package corn.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import corn.modal.NoteContent;

/**
 * @Description: 内容
 * @author： jeecg-boot
 * @date：   2021-05-19
 * @version： V1.0
 */
public interface NoteContentMapper extends BaseMapper<NoteContent> {

    public void deleteUseless();
}
