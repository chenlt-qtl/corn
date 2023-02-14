package org.seed.modules.note.service;

import org.seed.modules.note.entity.NoteFavorite;
import com.baomidou.mybatisplus.extension.service.IService;
import org.seed.modules.note.model.NoteModel;

import java.util.List;

/**
 * @Description: 收藏夹
 * @author： jeecg-boot
 * @date：   2021-01-04
 * @version： V1.0
 */
public interface INoteFavoriteService extends IService<NoteFavorite> {

    public void edit(String noteIds);

    void editOne(String noteId, Boolean isFav);

    public List<NoteModel> queryNotes(String username);

    public boolean queryIfFavorite(String noteId);
}
