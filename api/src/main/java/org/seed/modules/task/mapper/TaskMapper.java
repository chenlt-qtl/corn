package org.seed.modules.task.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.seed.modules.task.entity.Task;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * @Description: 任务
 * @author： jeecg-boot
 * @date：   2019-12-10
 * @version： V1.0
 */
public interface TaskMapper extends BaseMapper<Task> {

    /**
     * 查询所有子任务
     * @param createBy
     * @return
     */
    public List<Task> listAllChildren(@Param("createBy") String createBy,@Param("pIdsArr") String[] pIdsArr,@Param("title") String title);

}
