package dev.vigu.social_media.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProfileResponse {

    private Integer id;
    private String email;
    private String firstname;
    private String lastname;
    private Integer imageId;

}
