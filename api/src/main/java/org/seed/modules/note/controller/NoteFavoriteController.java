package org.seed.modules.note.controller;

import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.SecurityUtils;
import org.seed.common.api.vo.Result;
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
	public Result<NoteFavorite> edit(@RequestBody NoteFavorite noteFavorite) {
		Result<NoteFavorite> result = new Result<NoteFavorite>();
		noteFavoriteService.edit(noteFavorite.getNoteIds());
		result.setSuccess(true);
		return result;
	}

	 @PutMapping(value = "/edit/{noteId}")
	 public Result editOne(@PathVariable("noteId") String id,@RequestParam Boolean isFav) {

		 Result result = new Result();
		 noteFavoriteService.editOne(id,isFav);
		 result.setSuccess(true);
		 return result;
	 }
	
	/**
	  *   通过id删除
	 * @param id
	 * @return
	 */
	@DeleteMapping(value = "/delete")
	public Result<NoteFavorite> delete(@RequestParam(name="id",required=true) String id) {
		Result<NoteFavorite> result = new Result<NoteFavorite>();
		NoteFavorite noteFavorite = noteFavoriteService.getById(id);
		if(noteFavorite==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = noteFavoriteService.removeById(id);
			if(ok) {
				result.success("删除成功!");
			}
		}
		
		return result;
	}
	
	/**
	  *  批量删除
	 * @param ids
	 * @return
	 */
	@DeleteMapping(value = "/deleteBatch")
	public Result<NoteFavorite> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		Result<NoteFavorite> result = new Result<NoteFavorite>();
		if(ids==null || "".equals(ids.trim())) {
			result.error500("参数不识别！");
		}else {
			this.noteFavoriteService.removeByIds(Arrays.asList(ids.split(",")));
			result.success("删除成功!");
		}
		return result;
	}
	

	 /**
	  * 通过登录用户查询
	  * @return
	  */
	 @GetMapping(value = "/queryNotes")
	 public Result<List<NoteModel>> queryNotes() {
		 Result<List<NoteModel>> result = new Result();

		 SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
		 List<NoteModel> notes = noteFavoriteService.queryNotes(sysUser.getUsername());
		 List<NoteModel> list = new ArrayList();

		 for (NoteModel note : notes) {
			 if (note.getIsLeaf()) {
				 note.encryption();
				 list.add(note);
			 }
		 }
		 result.setSuccess(true);
		 result.setResult(list);

		 return result;
	 }



}