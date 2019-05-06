package org.jeecg.modules.note.service;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.extension.service.IService;
import org.jeecg.modules.note.entity.Note;

import java.util.List;

/**
 * @Description: 笔记管理
 * @author： jeecg-boot
 * @date：   2019-04-23
 * @version： V1.0
 */
public interface INoteService extends IService<Note> {

    List<Note> listNote(String createBy,String parentId);

}
