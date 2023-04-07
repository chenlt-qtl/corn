package org.seed.modules.note.controller;

import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.SecurityUtils;
import org.seed.common.api.vo.Result;
import org.seed.common.util.ResultUtils;
import org.seed.modules.note.entity.NoteFavorite;
import org.seed.modules.note.model.NoteModel;
import org.seed.modules.note.service.INoteFavoriteService;
import org.seed.modules.system.entity.SysUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * @Title: Controller
 * @Description: 收藏夹
 * @author： jeecg-boot
 * @date：   2021-01-04
 * @version： V1.0
 */
@RestController
@RequestMapping("/note/noteFavorite")
@Slf4j
public class NoteFavoriteController {
	@Autowired
	private INoteFavoriteService noteFavoriteService;

	/**
	  *  编辑
	 * @param noteFavorite
	 * @return
	 */
	@PutMapping(value = "/edit")
	public Result edit(@RequestBody NoteFavorite noteFavorite) {
		noteFavoriteService.edit(noteFavorite.getNoteIds());
		return ResultUtils.ok();
	}

	 @PutMapping(value = "/edit/{noteId}")
	 public Result editOne(@PathVariable("noteId") String id,@RequestParam Boolean isFav) {

		 noteFavoriteService.editOne(id,isFav);
		 return ResultUtils.ok();
	 }
	
	/**
	  *   通过id删除
	 * @param id
	 * @return
	 */
	@DeleteMapping(value = "/delete")
	public Result delete(@RequestParam(name="id",required=true) String id) {
		NoteFavorite noteFavorite = noteFavoriteService.getById(id);
		if(noteFavorite==null) {
			return ResultUtils.error("未找到对应实体");
		}else {
			noteFavoriteService.removeById(id);
			return ResultUtils.ok();
		}
	}
	


	 /**
	  * 通过登录用户查询
	  * @return
	  */
	 @GetMapping(value = "/queryNotes")
	 public Result queryNotes() {

		 SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
		 List<NoteModel> notes = noteFavoriteService.queryNotes(sysUser.getUsername());
		 List<NoteModel> list = new ArrayList();

		 for (NoteModel note : notes) {
			 if (note.getIsLeaf()) {
				 note.encryption();
				 list.add(note);
			 }
		 }

		 return ResultUtils.okData(list);
	 }



}
