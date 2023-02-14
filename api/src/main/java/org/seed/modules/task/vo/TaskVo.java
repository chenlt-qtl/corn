package org.seed.modules.task.vo;

import lombok.Data;
import org.seed.common.util.UpLoadUtil;
import org.seed.modules.task.entity.Task;
import org.springframework.beans.BeanUtils;

import java.util.ArrayList;
import java.util.List;

@Data
public class TaskVo extends Task {

    public TaskVo(Task task){
        BeanUtils.copyProperties(task,this);
    }

    private List<TaskVo> children = new ArrayList<>();

    public String getComment() {
        return UpLoadUtil.dbToReal(super.getComment(),"html");
    }

}
