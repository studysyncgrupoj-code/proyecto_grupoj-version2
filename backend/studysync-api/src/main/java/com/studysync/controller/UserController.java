
package com.studysync.controller;

import com.studysync.model.User;
import com.studysync.service.UserService;
import com.studysync.security.jwt.JwtService;

import org.springframework.http.ResponseEntity;
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

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(
            @PathVariable Long id
    ) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> createUser(
            @RequestBody User user
    ) {
        return ResponseEntity.ok(
                userService.saveUser(user)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody User userDetails
    ) {
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
