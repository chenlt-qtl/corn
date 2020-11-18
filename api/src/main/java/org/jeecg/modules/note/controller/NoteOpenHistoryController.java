package org.jeecg.modules.note.controller;

import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.api.vo.Result;
import org.jeecg.modules.note.entity.NoteOpenHistory;
import org.jeecg.modules.note.model.NoteModel;
import org.jeecg.modules.note.service.INoteOpenHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

 /**
 * @Title: Controller
 * @Description: 打开历史
 * @author： jeecg-boot
 * @date：   2020-11-13
 * @version： V1.0
 */
@RestController
@RequestMapping("/note/openHistory")
@Slf4j
public class NoteOpenHistoryController {
	@Autowired
	private INoteOpenHistoryService noteOpenHistoryService;
	
	/**
	  *   添加
	 * @param noteOpenHistory
	 * @return
	 */
	@PostMapping(value = "/add")
	public Result<NoteOpenHistory> add(@RequestBody NoteOpenHistory noteOpenHistory) {
		Result<NoteOpenHistory> result = new Result<NoteOpenHistory>();
		result.setResult(noteOpenHistoryService.addHistory(noteOpenHistory));
		result.success("保存成功！");
		return result;
	}

	/**
	  *  编辑
	 * @param noteOpenHistory
	 * @return
	 */
	@PutMapping(value = "/edit")
	public Result<NoteOpenHistory> edit(@RequestBody NoteOpenHistory noteOpenHistory) {
		Result<NoteOpenHistory> result = new Result<NoteOpenHistory>();
		NoteOpenHistory noteOpenHistoryEntity = noteOpenHistoryService.getById(noteOpenHistory.getId());
		if(noteOpenHistoryEntity==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = noteOpenHistoryService.updateById(noteOpenHistory);
			//TODO 返回false说明什么？
			if(ok) {
				result.success("修改成功!");
			}
		}

		return result;
	}

	/**
	  * 查询笔记数据
	 * @return
	 */
	@GetMapping(value = "/query")
	public Result<List<NoteModel>> queryNotes() {
		Result<List<NoteModel>> result = new Result<List<NoteModel>>();

		result.setResult(noteOpenHistoryService.queryNotes());
		result.setSuccess(true);
		return result;
	}

}
