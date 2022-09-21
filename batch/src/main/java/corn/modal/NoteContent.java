package corn.modal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "note_content")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class NoteContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    private String text;
    private Date createTime;
    private String createBy;
    private Date updateTime;
    private String updateBy;

}
