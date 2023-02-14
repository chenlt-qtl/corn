package org.seed.modules.task.service.impl;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.seed.common.util.UpLoadUtil;
import org.seed.modules.system.entity.SysUser;
import org.seed.modules.task.entity.Task;
import org.seed.modules.task.mapper.TaskMapper;
import org.seed.modules.task.service.ITaskService;
import org.seed.modules.task.vo.TaskVo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

/**
 * @Description: 任务
 * @author： jeecg-boot
 * @date：   2019-12-10
 * @version： V1.0
 */
@Service
public class TaskServiceImpl extends ServiceImpl<TaskMapper, Task> implements ITaskService {

    @Value(value = "${jeecg.path.upload}")
    private String uploadpath;

    @Resource
    private TaskMapper taskMapper;

    //删除任务和子任务
    public void delTask(Task task){

        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
        List<Task> tasks = taskMapper.listAllChildren(sysUser.getUsername(),new String[]{task.getPIds()+"/"+task.getId()},null);//所有子任务
        tasks.add(task);
        for(Task t:tasks){
            t.setStatus(DEL_STATUS);
            this.updateById(t);
        }

    }

    @Override
    public boolean updateTask(Task task,Task oldTask) {
        if(StringUtils.isNotBlank(task.getPIds()) && !"0".equals(task.getPIds())){//有父节点又要改plan start date的 祖宗节点的plan start date也一起改掉
            if(task.getPlanStartDate() != null && oldTask.getPlanStartDate() != null
                    && task.getPlanStartDate().getTime() != oldTask.getPlanStartDate().getTime()){
                String topParentId = task.getPIds().substring(2,34);
                Task topParent = getById(topParentId);
                topParent.setPlanStartDate(task.getPlanStartDate());
                updateById(topParent);
            }

        }
        setParents(task);
        task.setComment(UpLoadUtil.parseText(uploadpath,task.getComment(),oldTask.getComment()));
        return updateById(task);
    }

    @Override
    public boolean saveTask(Task task) {
        setParents(task);
        task.setComment(UpLoadUtil.parseText(uploadpath,task.getComment(),""));
        return save(task);
    }

    @Override
    public IPage<TaskVo> pageWithChild(IPage<Task> page, Wrapper<Task> queryWrapper) {
        IPage<Task> pageList = page(page,queryWrapper);

        List<String> taskIds = new ArrayList();
        List<TaskVo> records = new ArrayList<>();
        List<TaskVo> childrenVo = new ArrayList<>();
        for(Task task:pageList.getRecords()){
            records.add(new TaskVo(task));
            taskIds.add(task.getPIds()+"/"+task.getId());
        }
        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
        List<Task> children = taskMapper.listAllChildren(sysUser.getUsername(), taskIds.toArray(new String[]{}), null);//查出所有子节点
        for(Task child:children){
            childrenVo.add(new TaskVo(child));
        }
        for(TaskVo child:childrenVo){
            boolean found = false;//是否找到父节点

            for(TaskVo parent:records){
                if(parent.getId().equals(child.getPId())){
                    parent.getChildren().add(child);
                    found = true;
                    break;
                }
            }
            if(!found){
                for(TaskVo parent:childrenVo){
                    if(parent.getId().equals(child.getPId())){
                        parent.getChildren().add(child);
                        break;
                    }
                }
            }
        }

        IPage<TaskVo> result = new Page<>();
        result.setRecords(records);
        result.setTotal(pageList.getTotal());
        return result;
    }


    /**
     * 设置parents
     * @param task
     */
    public void setParents(Task task){
        if(StringUtils.isBlank(task.getPId())||"0".equals(task.getPId())){
            task.setPId("0");
            task.setPIds("0");
        }else {
            Task parent = getById(task.getPId());
            task.setPIds(parent.getPIds() + "/" + task.getPId());
        }
    }
}
