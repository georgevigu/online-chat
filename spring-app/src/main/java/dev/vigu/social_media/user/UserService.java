package dev.vigu.social_media.user;

import dev.vigu.social_media.image.ImageData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;

    public List<User> getAllUsers() {
        return repository.findAll();
    }

    public User getUser(Integer id) {
        Optional<User> user = repository.findById(id);
        return user.orElse(null);
    }

    public ProfileResponse editUser(Integer id, String firstName, String lastName) {
        return repository.findById(id)
                .map(user -> {
                    user.setFirstname(firstName);
                    user.setLastname(lastName);
                    User savedUser = repository.save(user);
                    return new ProfileResponse(
                            savedUser.getId(),
                            savedUser.getEmail(),
                            savedUser.getFirstname(),
                            savedUser.getLastname(),
                            savedUser.getImage() != null ? savedUser.getImage().getId() : null
                    );
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public ProfileResponse getProfile(Integer id) {
        ProfileResponse profile;
        Optional<User> user = repository.findById(id);

        if (user.isPresent()) {
            User finalUser = user.get();
            profile = ProfileResponse.builder()
                    .id(finalUser.getId())
                    .email(finalUser.getEmail())
                    .firstname(finalUser.getFirstname())
                    .lastname(finalUser.getLastname())
                    .imageId(finalUser.getImage() != null ? finalUser.getImage().getId() : null)
                    .build();
            return profile;
        }
        return null;
    }

    public List<ProfileResponse> getAllProfiles() {
        List<User> allUsers = getAllUsers();

        return allUsers.stream().map(user ->
                ProfileResponse.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .firstname(user.getFirstname())
                        .lastname(user.getLastname())
                        .imageId(user.getImage() != null ? user.getImage().getId() : null)
                        .build()
        ).collect(Collectors.toList());
    }

    public void uploadImage(ImageData image, Integer userId) {
        Optional<User> user = repository.findById(userId);
        if (user.isPresent()) {
            User finalUser = user.get();
            finalUser.setImage(image);
            repository.save(finalUser);
        }
        System.out.println("User with id " + userId + " not found");
    }

}
