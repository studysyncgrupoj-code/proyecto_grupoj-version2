
package com.studysync.controller;

import com.studysync.model.User;
import com.studysync.service.UserService;
import com.studysync.service.MfaService;
import com.studysync.security.jwt.JwtService;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;
    private final JdbcTemplate jdbcTemplate;
    private final MfaService mfaService;

    public UserController(
            UserService userService,
            JwtService jwtService,
            JdbcTemplate jdbcTemplate,
            MfaService mfaService
    ) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.jdbcTemplate = jdbcTemplate;
        this.mfaService = mfaService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }



    @GetMapping("/contacts")
    public List<Map<String, Object>> getContacts(
            @AuthenticationPrincipal User currentUser
    ) {
        return userService.getAllUsers()
                .stream()
                .filter(u -> Boolean.TRUE.equals(u.getActivo()))
                .filter(u -> "PROFESOR".equalsIgnoreCase(u.getRol())
                        || "ESTUDIANTE".equalsIgnoreCase(u.getRol()))
                .filter(u -> !u.getId().equals(currentUser.getId()))
                .filter(u -> Boolean.TRUE.equals(
                    jdbcTemplate.queryForObject("""
                        SELECT CASE
                            WHEN COALESCE(
                                (SELECT profile_visibility
                                 FROM user_settings
                                 WHERE user_id = ?), 'public'
                            ) = 'public' THEN true
                            WHEN EXISTS (
                                SELECT 1 FROM user_settings
                                WHERE user_id = ?
                                AND profile_visibility = 'students'
                            ) THEN EXISTS (
                                SELECT 1
                                FROM courses c
                                JOIN student_courses sc
                                  ON sc.course_id = c.id
                                WHERE c.teacher_id = ?
                                  AND sc.student_id = ?
                            )
                            ELSE false
                        END
                        """, Boolean.class,
                        u.getId(), u.getId(),
                        u.getId(), currentUser.getId())
                ))
                .map(u -> {
                    Map<String, Object> data = new LinkedHashMap<>();
                    data.put("id", u.getId());
                    data.put("nombre", u.getNombre());
                    data.put("apellido", u.getApellido());
                    data.put("rol", u.getRol());
                    data.put("activo", u.getActivo());
                    return data;
                })
                .toList();
    }

    @GetMapping("/students")
    public List<Map<String, Object>> getStudents() {
        return userService.getAllUsers()
                .stream()
                .filter(user -> "ESTUDIANTE".equalsIgnoreCase(user.getRol()))
                .map(user -> {
                    Map<String, Object> data = new LinkedHashMap<>();
                    data.put("id", user.getId());
                    data.put("nombre", user.getNombre());
                    data.put("apellido", user.getApellido());
                    data.put("email", user.getEmail());
                    data.put("rol", user.getRol());
                    data.put("activo", user.getActivo());
                    return data;
                })
                .toList();
    }


    @GetMapping("/professors/statistics")
    public ResponseEntity<?> getProfessorStatistics(
            @AuthenticationPrincipal User currentUser
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        if (!"ADMINISTRADOR".equalsIgnoreCase(currentUser.getRol())) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(jdbcTemplate.queryForList("""
            SELECT u.id,
                   COUNT(DISTINCT c.id) AS cursos,
                   COUNT(DISTINCT sc.student_id) AS estudiantes,
                   COUNT(DISTINCT ar.id) AS informes
            FROM users u
            LEFT JOIN courses c ON c.teacher_id = u.id
            LEFT JOIN student_courses sc ON sc.course_id = c.id
            LEFT JOIN academic_reports ar ON ar.teacher_id = u.id
            WHERE u.rol = 'PROFESOR'
            GROUP BY u.id
            ORDER BY u.id
            """));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        if (!"ADMINISTRADOR".equalsIgnoreCase(currentUser.getRol())
                && !currentUser.getId().equals(id)) {
            return ResponseEntity.status(403).build();
        }

        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> createUser(
            @RequestBody User user,
            @AuthenticationPrincipal User currentUser
    ) {
        boolean isAdmin = currentUser != null &&
                "ADMINISTRADOR".equalsIgnoreCase(currentUser.getRol());

        user.setId(null);

        if (!isAdmin) {
            user.setRol("ESTUDIANTE");
            user.setActivo(true);
        }

        return ResponseEntity.ok(
                userService.saveUser(user)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody User userDetails,
            @AuthenticationPrincipal User currentUser
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        boolean isAdmin = "ADMINISTRADOR".equalsIgnoreCase(
                currentUser.getRol()
        );

        if (!isAdmin) {
            if (!currentUser.getId().equals(id)) {
                return ResponseEntity.status(403).build();
            }

            userDetails.setPassword(null);
            userDetails.setRol(currentUser.getRol());
            userDetails.setActivo(currentUser.getActivo());
        }

        return userService.updateUser(id, userDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id
    ) {
        if (!userService.deleteUser(id)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> credentials
    ) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        User user = userService.login(email, password);

        if (user == null) {
            return ResponseEntity
                    .status(401)
                    .body(Map.of(
                            "message",
                            "Credenciales incorrectas"
                    ));
        }

        if (mfaService.isEnabled(user.getId())) {
            String code = credentials.get("otp");

            if (code == null || code.isBlank()) {
                return ResponseEntity.status(401).body(Map.of(
                    "code", "MFA_REQUIRED",
                    "message", "Código de autenticación requerido"
                ));
            }

            if (!mfaService.verify(user.getId(), code, true)) {
                return ResponseEntity.status(401).body(Map.of(
                    "code", "MFA_INVALID",
                    "message", "Código inválido, expirado o utilizado"
                ));
            }
        }

        String token = jwtService.generateToken(user);

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("id", user.getId());
        response.put("nombre", user.getNombre());
        response.put("apellido", user.getApellido());
        response.put("email", user.getEmail());
        response.put("rol", user.getRol());
        response.put("activo", user.getActivo());
        response.put("fechaCreacion", user.getFechaCreacion());
        response.put("token", token);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal User currentUser,
            @RequestBody Map<String, String> payload) {

        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        userService.changePassword(
            currentUser.getId(),
            payload.get("currentPassword"),
            payload.get("newPassword")
        );

        return ResponseEntity.ok(
            Map.of("message", "Contraseña actualizada correctamente")
        );
    }

}
