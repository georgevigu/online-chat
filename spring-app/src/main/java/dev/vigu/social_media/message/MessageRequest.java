package dev.vigu.social_media.message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageRequest {

    private Integer senderId;
    private Integer recipientId;
    private String content;

}
