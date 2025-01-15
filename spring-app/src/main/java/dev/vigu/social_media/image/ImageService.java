package dev.vigu.social_media.image;

import dev.vigu.social_media.message.MessageService;
import dev.vigu.social_media.user.UserService;
import dev.vigu.social_media.util.ImageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository imageRepository;
    private final UserService userService;
    private final MessageService messageService;

    public String uploadImage(MultipartFile image, Integer userId) throws IOException {
        ImageData imageData = imageRepository.save(ImageData.builder()
                .name(image.getOriginalFilename())
                .type(image.getContentType())
                .imageData(ImageUtils.compressImage(image.getBytes()))
                .build());
        userService.uploadImage(imageData, userId);
        return "File uploaded successfully: " + image.getOriginalFilename();
    }

    public byte[] downloadImage(Integer id) {
        Optional<ImageData> dbImageData = imageRepository.findById(id);

        return ImageUtils.decompressImage(dbImageData.get().getImageData());
    }

    public String uploadImageWithMessageId(MultipartFile image, Integer senderId, Integer recipientId) throws IOException {
        ImageData imageData = imageRepository.save(ImageData.builder()
                .name(image.getOriginalFilename())
                .type(image.getContentType())
                .imageData(ImageUtils.compressImage(image.getBytes()))
                .build());
        messageService.uploadMessageWithImage(imageData, senderId, recipientId);
        return "File uploaded successfully: " + image.getOriginalFilename();
    }
}
