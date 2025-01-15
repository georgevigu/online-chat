package dev.vigu.social_media.message;

import dev.vigu.social_media.user.ProfileResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {

    private Integer id;
    private String content;
    private LocalDateTime timestamp;
    private ProfileResponse sender;
    private ProfileResponse recipient;
    private Integer imageId;

}
