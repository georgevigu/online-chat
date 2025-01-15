package dev.vigu.social_media.message;

import dev.vigu.social_media.image.ImageData;
import dev.vigu.social_media.user.ProfileResponse;
import dev.vigu.social_media.user.User;
import dev.vigu.social_media.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public ResponseEntity<String> saveMessage(MessageRequest messageRequest) {
        User sender = userRepository.findById(messageRequest.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User recipient = userRepository.findById(messageRequest.getRecipientId())
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setRecipient(recipient);
        message.setContent(messageRequest.getContent());
        message.setTimestamp(LocalDateTime.now());

        messageRepository.save(message);

        return new ResponseEntity<String>(HttpStatus.OK);
    }

    public List<MessageResponse> getAllMessages() {
        List<Message> messages = messageRepository.findAll();
        return messages.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<MessageResponse> getMessagesByUsers(Integer senderId, Integer recipientId) {
        List<Message> messages = messageRepository.findConversationBetweenUsers(senderId, recipientId);
        return messages.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public void uploadMessageWithImage(ImageData image, Integer senderId, Integer recipientId) {
        Message newMessage = Message.builder()
                .image(image)
                .timestamp(LocalDateTime.now())
                .build();
        Optional<User> sender = userRepository.findById(senderId);
        Optional<User> recipient = userRepository.findById(recipientId);
        sender.ifPresent(newMessage::setSender);
        recipient.ifPresent(newMessage::setRecipient);
        messageRepository.save(newMessage);
    }



    private MessageResponse mapToDTO(Message message) {
        MessageResponse dto = new MessageResponse();
        dto.setId(message.getId());
        dto.setContent(message.getContent());
        dto.setTimestamp(message.getTimestamp());
        if (message.getImage() != null) {
            dto.setImageId(message.getImage().getId());
        }

        ProfileResponse senderDTO = new ProfileResponse();
        senderDTO.setId(message.getSender().getId());
        senderDTO.setFirstname(message.getSender().getFirstname());
        senderDTO.setLastname(message.getSender().getLastname());
        if (message.getSender().getImage() != null) {
            senderDTO.setImageId(message.getSender().getImage().getId());
        }
        senderDTO.setEmail(message.getSender().getEmail());

        ProfileResponse recipientDTO = new ProfileResponse();
        recipientDTO.setId(message.getRecipient().getId());
        recipientDTO.setFirstname(message.getRecipient().getFirstname());
        recipientDTO.setLastname(message.getRecipient().getLastname());
        if (message.getRecipient().getImage() != null) {
            senderDTO.setImageId(message.getRecipient().getImage().getId());
        }
        recipientDTO.setEmail(message.getRecipient().getEmail());

        dto.setSender(senderDTO);
        dto.setRecipient(recipientDTO);

        return dto;
    }

}
