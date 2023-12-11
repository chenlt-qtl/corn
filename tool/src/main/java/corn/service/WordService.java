package corn.service;


import corn.modal.Result;
import corn.utils.SaveUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class WordService {


    @Autowired
    RestService restService;

    @Value("${corn.path.backup}")
    String backupPath;

    @Value("${corn.resourceUrl}")
    String resourceUrl;

    public void backupMp3() {
        //1. 从API读取数据
        int pageNo = 1;
        int pageSize = 20;
        int total = pageSize + 1;
        Map<String, Object> param = new HashMap();
        param.put("pageSize", pageSize);

        for (; total > (pageNo - 1) * pageSize; pageNo++) {
            param.put("pageNo", pageNo);
            Result result = restService.get("/word/word/list", param);
            Map page = (Map) result.getResult();
            List<Map> records = (List<Map>) page.get("records");
            total = (int) page.get("total");
            //2. 提取出mp3
            for (Map word : records) {
                log.info("处理word：{}", word.get("wordName"));
                if(word.containsKey("mp3")) {
                    SaveUtil.saveFromUrl((String) word.get("mp3"),backupPath);
                }
            }
        }
        log.info("total : {}", total);

    }
}
