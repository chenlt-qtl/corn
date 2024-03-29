package org.seed.modules.ngalain.controller;

import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.SecurityUtils;
import org.seed.common.api.vo.Result;
import org.seed.common.exception.CornException;
import org.seed.common.util.ResultUtils;
import org.seed.modules.ngalain.service.NgAlainService;
import org.seed.modules.system.entity.SysUser;
import org.seed.modules.system.service.ISysDictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/sys/ng-alain")
public class NgAlainController {
    @Autowired
    private NgAlainService ngAlainService;
    @Autowired
    private ISysDictService sysDictService;

    @RequestMapping(value = "/getAppData")
    @ResponseBody
    public JSONObject getAppData(HttpServletRequest request) throws Exception {
       String token=request.getHeader("X-Access-Token");
        JSONObject j = new JSONObject();
        SysUser user = (SysUser) SecurityUtils.getSubject().getPrincipal();
        JSONObject userObjcet = new JSONObject();
        userObjcet.put("name", user.getUsername());
        userObjcet.put("avatar", user.getAvatar());
        userObjcet.put("email", user.getEmail());
        userObjcet.put("token", token);
        j.put("user", userObjcet);
        j.put("menu",ngAlainService.getMenu(user.getUsername()));
        JSONObject app = new JSONObject();
        app.put("name", "jeecg-boot-angular");
        app.put("description", "jeecg+ng-alain整合版本");
        j.put("app", app);
        return j;
    }

    @RequestMapping(value = "/getDictItems/{dictCode}", method = RequestMethod.GET)
    public Object getDictItems(@PathVariable String dictCode) {
        log.info(" dictCode : "+ dictCode);
        List<Map<String,Object>> ls = null;
        try {
            ls = sysDictService.queryDictItemsByCode(dictCode);
        } catch (Exception e) {
            log.info(e.getMessage());
            throw new CornException("操作失败");

        }
        List<JSONObject> dictlist=new ArrayList<>();
        for (Map<String, Object> l : ls) {
            JSONObject dict=new JSONObject();
                try {
                    dict.put("value",Integer.parseInt((String)l.get("value")));
                } catch (NumberFormatException e) {
                    dict.put("value",l.get("value"));
                }
            dict.put("label",l.get("text"));
            dictlist.add(dict);
        }
        return ResultUtils.okData(dictlist);
    }
    @RequestMapping(value = "/getDictItemsByTable/{table}/{key}/{value}", method = RequestMethod.GET)
    public Object getDictItemsByTable(@PathVariable String table,@PathVariable String key,@PathVariable String value) {
        return this.ngAlainService.getDictByTable(table,key,value);
    }
}
