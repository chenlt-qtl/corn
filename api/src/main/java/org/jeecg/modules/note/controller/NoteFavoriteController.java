package org.jeecg.modules.note.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.modules.note.entity.NoteFavorite;
import org.jeecg.modules.note.model.NoteModel;
import org.jeecg.modules.note.service.INoteFavoriteService;
import org.jeecg.modules.system.entity.SysUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;
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
	@GetMapping(value = "/query")
	public Result<String[]> query() {
		Result<String[]> result = new Result();

		SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();

		QueryWrapper<NoteFavorite> queryWrapper = new QueryWrapper();
		queryWrapper.eq("create_by",sysUser.getUsername());
		result.setSuccess(true);
		NoteFavorite noteFavorite = noteFavoriteService.getOne(queryWrapper);
		if(noteFavorite != null){
			String noteIds = noteFavorite.getNoteIds();
			if(StringUtils.isNotBlank(noteIds)){
				result.setResult(noteIds.split(","));
			}
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

		 result.setSuccess(true);
		 result.setResult(noteFavoriteService.queryNotes(sysUser.getUsername()));

		 return result;
	 }



}
