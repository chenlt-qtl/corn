package org.jeecg.modules.task.service;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import org.jeecg.modules.note.entity.Note;
import org.jeecg.modules.task.entity.Task;
import com.baomidou.mybatisplus.extension.service.IService;
import org.jeecg.modules.task.vo.TaskVo;

/**
 * @Description: 任务
 * @author： jeecg-boot
 * @date：   2019-12-10
 * @version： V1.0
 */
public interface ITaskService extends IService<Task> {

    public static final int DEL_STATUS = 0;

    public void delTask(Task task);

    boolean updateTask(Task task,Task oldTask);

    boolean saveTask(Task task);

    IPage<TaskVo> pageWithChild(IPage<Task> page, Wrapper<Task> queryWrapper);
}
