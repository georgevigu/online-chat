package dev.vigu.social_media.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @GetMapping("/")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(service.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getUser(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> editUser(
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @PathVariable Integer id
           ) {
        return ResponseEntity.ok(service.editUser(id, firstName, lastName));
    }

    @GetMapping("/profile")
    public ResponseEntity<List<ProfileResponse>> getAllProfiles() {
        return ResponseEntity.ok(service.getAllProfiles());
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<ProfileResponse> getProfile(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getProfile(id));
    }

}
