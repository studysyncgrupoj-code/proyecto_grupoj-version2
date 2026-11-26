
package com.studysync.controller;

import com.studysync.model.User;
import com.studysync.service.UserService;
import com.studysync.security.jwt.JwtService;

import org.springframework.http.ResponseEntity;
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

    public UserController(
            UserService userService,
            JwtService jwtService
    ) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
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
}
