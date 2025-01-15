package dev.vigu.social_media.image;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "images")
public class ImageData {

    @Id
    @GeneratedValue
    private Integer id;
    private String name;
    private String type;
    @Lob
    private byte[] imageData;

}
