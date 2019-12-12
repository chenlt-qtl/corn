package org.jeecg.modules.task.service.impl;

import org.jeecg.modules.task.entity.Task;
import org.jeecg.modules.task.mapper.TaskMapper;
import org.jeecg.modules.task.service.ITaskService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * @Description: 任务
 * @author： jeecg-boot
 * @date：   2019-12-10
 * @version： V1.0
 */
@Service
public class TaskServiceImpl extends ServiceImpl<TaskMapper, Task> implements ITaskService {

}
