package dev.vigu.social_media.message;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/message")
public class MessageController {

    public final MessageService messageService;

    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(@RequestBody MessageRequest messageRequest) {
        return messageService.saveMessage(messageRequest);
    }

    @GetMapping("/by-users")
    public ResponseEntity<List<MessageResponse>> getMessagesByUsers(
            @RequestParam Integer senderId,
            @RequestParam Integer recipientId) {
        return ResponseEntity.ok(messageService.getMessagesByUsers(senderId, recipientId));
    }

    @GetMapping("/")
    public ResponseEntity<List<MessageResponse>> getAllMessages() {
        return ResponseEntity.ok(messageService.getAllMessages());
    }

}
