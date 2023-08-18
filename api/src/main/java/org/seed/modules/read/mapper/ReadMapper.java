package org.seed.modules.read.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.seed.modules.note.entity.Note;
import org.seed.modules.read.entity.Read;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * @Description: 点读
 * @author： jeecg-boot
 * @date：   2023-07-30
 * @version： V1.0
 */
public interface ReadMapper extends BaseMapper<Read> {

    List<Read> getByArticleId(@Param("articleId") Long articleId,@Param("id") Long id);

}
