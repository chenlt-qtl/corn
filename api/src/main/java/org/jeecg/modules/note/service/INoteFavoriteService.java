package org.jeecg.modules.note.service;

import org.jeecg.modules.note.entity.NoteFavorite;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * @Description: 收藏夹
 * @author： jeecg-boot
 * @date：   2021-01-04
 * @version： V1.0
 */
public interface INoteFavoriteService extends IService<NoteFavorite> {

    public void edit(String noteIds);
}
