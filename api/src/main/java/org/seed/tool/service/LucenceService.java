package org.seed.tool.service;

import org.apache.commons.lang3.StringUtils;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryparser.classic.MultiFieldQueryParser;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.search.*;
import org.apache.lucene.search.highlight.InvalidTokenOffsetsException;
import org.apache.shiro.SecurityUtils;
import org.seed.modules.note.entity.Note;
import org.seed.modules.note.mapper.NoteMapper;
import org.seed.modules.note.model.NoteModel;
import org.seed.modules.system.entity.SysUser;
import org.seed.tool.analyzer.MyIKAnalyzer;
import org.seed.tool.utils.LucenceUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
public class LucenceService {

    @Value(value = "${jeecg.path.lucence}")
    private String indexPath;

    private final String NOTE_PATH = "note";

    @Resource
    NoteMapper noteMapper;

    public void createNoteIndex() throws IOException {

        String path = indexPath + File.separator + NOTE_PATH;

        //1.删除旧index
        File file = new File(path);
        if (file.exists()) {
            File[] files = file.listFiles();//声明目录下所有的文件 files[];
            for (int i = 0; i < files.length; i++) {//遍历目录下所有的文件
                files[i].delete();
            }
        } else {
            file.mkdirs();
        }

        //2.创建index
        int current = 0;
        int size = 20;
        long total = 1;

        for (; total !=0; current++) {

            List<NoteModel> records = noteMapper.getNoteModelList(current*size,size);
            total = 0;
            Collection<Document> docs = new ArrayList<>(size);
            for (NoteModel noteModel : records) {
                // 创建文档对象
                Document document = new Document();
                //StringField会创建索引，但是不会被分词，TextField，即创建索引又会被分词。
                document.add(new StringField("id", noteModel.getId().toString(), Field.Store.YES));
                document.add(new StringField("createBy", noteModel.getCreateBy(), Field.Store.NO));
                if(StringUtils.isNotBlank(noteModel.getText())) {
                    document.add(new TextField("text", noteModel.getText(), Field.Store.NO));
                }
                document.add(new TextField("name", noteModel.getName(), Field.Store.YES));
                docs.add(document);
            }
            LucenceUtils.createIndex(docs, path);
        }
    }

    public List<Note> searchNote(String text) throws IOException, ParseException, InvalidTokenOffsetsException {
        String[] fields =  {"name","text"};
        String path = indexPath + File.separator + NOTE_PATH;
        IndexSearcher searcher = LucenceUtils.getSearcher(path);

        BooleanQuery.Builder builder = new BooleanQuery.Builder();

        // 创建查询解析器,两个参数：默认要查询的字段的名称，分词器
        MultiFieldQueryParser parser = new MultiFieldQueryParser(fields, new MyIKAnalyzer());
        // 创建查询对象1
        Query query1 = parser.parse(text);
        builder.add( query1, BooleanClause.Occur.MUST );

        // 创建查询对象2
        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
        Query query2 =new TermQuery(new Term("createBy",sysUser.getUsername()));
        builder.add( query2, BooleanClause.Occur.MUST );

        ScoreDoc[] scoreDocs = LucenceUtils.searchByQuery(builder.build(), path);
        List<Note> list = new ArrayList();
        for(ScoreDoc scoreDoc:scoreDocs){

            int docID = scoreDoc.doc;
            // 根据编号去找文档
            Document doc = searcher.doc(docID);
            Note note = new Note();
            note.setId(Long.parseLong(doc.get("id")));
            note.setName(doc.get("name"));
            list.add(note);
        }
        return list;

    }



}
