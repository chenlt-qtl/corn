package org.seed.modules.read.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.seed.modules.read.entity.Read;

/**
 * @Description: 点读
 * @author： jeecg-boot
 * @date：   2023-07-30
 * @version： V1.0
 */
public interface IReadService extends IService<Read> {
    boolean update(Read read);

    Read add(Read read);
}
