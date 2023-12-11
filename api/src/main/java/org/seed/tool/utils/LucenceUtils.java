package org.seed.tool.utils;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.*;
import org.apache.lucene.queryparser.classic.MultiFieldQueryParser;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.search.highlight.*;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.seed.common.exception.CornException;
import org.seed.tool.analyzer.MyIKAnalyzer;
import org.wltea.analyzer.lucene.IKAnalyzer;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.util.Collection;

public class LucenceUtils {

    /**
     *
     * @param docs  要写入的文件
     * @param indexPath index存放的根路径
     * @param openMode OpenMode.APPEND 会在索引库的基础上追加新索引。OpenMode.CREATE会先清空原来数据，再提交新的索引
     * @return
     * @throws IOException
     */
    public static String createIndex(Collection<Document> docs, String indexPath, IndexWriterConfig.OpenMode openMode) throws IOException {

        // 索引目录类,指定索引在硬盘中的位置
        Directory directory = FSDirectory.open(FileSystems.getDefault().getPath(indexPath));
        // 引入IK分词器
        Analyzer analyzer = new MyIKAnalyzer();
        // 索引写出工具的配置对象，这个地方就是最上面报错的问题解决方案
        IndexWriterConfig conf = new IndexWriterConfig(analyzer);
        // 设置打开方式：OpenMode.APPEND 会在索引库的基础上追加新索引。OpenMode.CREATE会先清空原来数据，再提交新的索引
        conf.setOpenMode(openMode);
        // 创建索引的写出工具类。参数：索引的目录和配置信息
        IndexWriter indexWriter = new IndexWriter(directory, conf);
        // 把文档集合交给IndexWriter
        indexWriter.addDocuments(docs);
        // 提交
        indexWriter.commit();
        // 关闭
        indexWriter.close();
        return "success";
    }


    public static String update(Document doc, String indexPath, Long id) throws IOException {
        // 创建目录对象
        Directory directory = FSDirectory.open(FileSystems.getDefault().getPath(indexPath));
        // 创建配置对象
        IndexWriterConfig conf = new IndexWriterConfig(new MyIKAnalyzer());
        // 创建索引写出工具
        IndexWriter writer = new IndexWriter(directory, conf);

        writer.updateDocument(new Term("id", id.toString()), doc);
        // 提交
        writer.commit();
        // 关闭
        writer.close();
        return "success";
    }

    public static String deleteIndex(Long id, String indexPath) throws IOException {
        // 创建目录对象
        Directory directory = FSDirectory.open(FileSystems.getDefault().getPath(indexPath));
        // 创建配置对象
        IndexWriterConfig conf = new IndexWriterConfig(new IKAnalyzer());
        // 创建索引写出工具
        IndexWriter writer = new IndexWriter(directory, conf);
        // 根据词条进行删除
        writer.deleteDocuments(new Term("id", id.toString()));
        // 提交
        writer.commit();
        // 关闭
        writer.close();
        return "success";
    }


    public static ScoreDoc[] searchText(String text, String column, String indexPath) throws IOException, ParseException {
        Directory directory = FSDirectory.open(FileSystems.getDefault().getPath(indexPath));
        // 索引读取工具
        IndexReader reader = DirectoryReader.open(directory);
        // 索引搜索工具
        IndexSearcher searcher = new IndexSearcher(reader);
        // 创建查询解析器,两个参数：默认要查询的字段的名称，分词器
        QueryParser parser = new QueryParser(column, new MyIKAnalyzer());
        // 创建查询对象
        Query query = parser.parse(text);
        // 获取前十条记录
        TopDocs topDocs = searcher.search(query, 10);
        // 获取总条数
        System.out.println("本次搜索共找到" + topDocs.totalHits + "条数据");
        // 获取得分文档对象（ScoreDoc）数组.SocreDoc中包含：文档的编号、文档的得分
        ScoreDoc[] scoreDocs = topDocs.scoreDocs;
        return scoreDocs;
    }

    public static ScoreDoc[] searchTexts(String text, String[] columns, String indexPath) throws IOException, ParseException {
        Directory directory = FSDirectory.open(FileSystems.getDefault().getPath(indexPath));
        // 索引读取工具
        IndexReader reader = DirectoryReader.open(directory);
        // 索引搜索工具
        IndexSearcher searcher = new IndexSearcher(reader);

        // 创建查询解析器,两个参数：默认要查询的字段的名称，分词器
        MultiFieldQueryParser parser = new MultiFieldQueryParser(columns, new MyIKAnalyzer());
        // 创建查询对象
        Query query = parser.parse(text);
        // 获取前十条记录
        TopDocs topDocs = searcher.search(query, 100);
        // 获取总条数
        System.out.println("本次搜索共找到" + topDocs.totalHits + "条数据");
        // 获取得分文档对象（ScoreDoc）数组.SocreDoc中包含：文档的编号、文档的得分
        return topDocs.scoreDocs;
    }

    public static ScoreDoc[] searchByQuery(Query query, String indexPath) throws IOException, ParseException {
        Directory directory = FSDirectory.open(FileSystems.getDefault().getPath(indexPath));
        // 索引读取工具
        IndexReader reader = DirectoryReader.open(directory);
        // 索引搜索工具
        IndexSearcher searcher = new IndexSearcher(reader);

        // 获取前1000条记录
        TopDocs topDocs = searcher.search(query,1000);
        // 获取总条数
        System.out.println("本次搜索共找到" + topDocs.totalHits + "条数据");
        // 获取得分文档对象（ScoreDoc）数组.SocreDoc中包含：文档的编号、文档的得分
        return topDocs.scoreDocs;
    }

    /**
     * 高亮效果
     *
     * @param text
     * @param columns
     * @param indexPath
     * @return
     * @throws IOException
     * @throws ParseException
     * @throws InvalidTokenOffsetsException
     */
    public static ScoreDoc[] searchText2(String text, String[] columns, String indexPath) throws IOException, ParseException, InvalidTokenOffsetsException {
        Directory directory = FSDirectory.open(FileSystems.getDefault().getPath(indexPath));
        // 索引读取工具
        IndexReader reader = DirectoryReader.open(directory);
        // 索引搜索工具
        IndexSearcher searcher = new IndexSearcher(reader);
        // 创建查询解析器,两个参数：默认要查询的字段的名称，分词器
        MultiFieldQueryParser parser = new MultiFieldQueryParser(columns, new MyIKAnalyzer());
        // 创建查询对象
        Query query = parser.parse(text);
        // 获取前十条记录
        TopDocs topDocs = searcher.search(query, 100);
        // 获取总条数
        System.out.println("本次搜索共找到" + topDocs.totalHits + "条数据");

        //高亮显示
        SimpleHTMLFormatter simpleHTMLFormatter = new SimpleHTMLFormatter("<span style='color:red'>", "</span>");
        Highlighter highlighter = new Highlighter(simpleHTMLFormatter, new QueryScorer(query));
        Fragmenter fragmenter = new SimpleFragmenter(100);   //高亮后的段落范围在100字内
        highlighter.setTextFragmenter(fragmenter);

        // 获取得分文档对象（ScoreDoc）数组.SocreDoc中包含：文档的编号、文档的得分
        return topDocs.scoreDocs;
//        List<Content> list = new ArrayList<>();
//        for (ScoreDoc scoreDoc : scoreDocs) {
//            // 取出文档编号
//            int docID = scoreDoc.doc;
//            // 根据编号去找文档
//            Document doc = reader.document(docID);
//            //Content content = contentMapper.selectByPrimaryKey(doc.get("id"));
//            Content content = new NoteContent();
//            //处理高亮字段显示
//            String title = highlighter.getBestFragment(new MyIKAnalyzer(), "title", doc.get("title"));
//            if (title == null) {
//                title = content.getTitle();
//            }
//            String descs = highlighter.getBestFragment(new MyIKAnalyzer(), "descs", doc.get("descs"));
//            if (descs == null) {
//                descs = content.getDescs();
//            }
//            content.setDescs(descs);
//            content.setTitle(title);
//            list.add(content);
//        }
//        request.setAttribute("list", list);
//        return "index";
    }

//    分页查询
//    public String searchText3(String text) throws IOException, ParseException, InvalidTokenOffsetsException {
//        String[] str = {"title", "descs"};
//        int page = 1;
//        int pageSize = 10;
//        Directory directory = FSDirectory.open(FileSystems.getDefault().getPath("d:\\indexDir"));
//        // 索引读取工具
//        IndexReader reader = DirectoryReader.open(directory);
//        // 索引搜索工具
//        IndexSearcher searcher = new IndexSearcher(reader);
//        // 创建查询解析器,两个参数：默认要查询的字段的名称，分词器
//        MultiFieldQueryParser parser = new MultiFieldQueryParser(str, new MyIKAnalyzer());
//        // 创建查询对象
//        Query query = parser.parse(text);
//        // 获取前十条记录
//        //TopDocs topDocs = searcher.search(query, 100);
//
//        TopDocs topDocs = searchByPage(page, pageSize, searcher, query);
//        // 获取总条数
//        System.out.println("本次搜索共找到" + topDocs.totalHits + "条数据");
//
//        //高亮显示
//        SimpleHTMLFormatter simpleHTMLFormatter = new SimpleHTMLFormatter("<span style='color:red'>", "</span>");
//        Highlighter highlighter = new Highlighter(simpleHTMLFormatter, new QueryScorer(query));
//        Fragmenter fragmenter = new SimpleFragmenter(100);   //高亮后的段落范围在100字内
//        highlighter.setTextFragmenter(fragmenter);
//
//        // 获取得分文档对象（ScoreDoc）数组.SocreDoc中包含：文档的编号、文档的得分
//        ScoreDoc[] scoreDocs = topDocs.scoreDocs;
//        List<Content> list = new ArrayList<>();
//        for (ScoreDoc scoreDoc : scoreDocs) {
//            // 取出文档编号
//            int docID = scoreDoc.doc;
//            // 根据编号去找文档
//            Document doc = reader.document(docID);
//            //Content content = contentMapper.selectByPrimaryKey(doc.get("id"));
//            Content content = new NoteContent();
//            //处理高亮字段显示
//            String title = highlighter.getBestFragment(new MyIKAnalyzer(), "title", doc.get("title"));
//            if (title == null) {
//                title = content.getTitle();
//            }
//            String descs = highlighter.getBestFragment(new MyIKAnalyzer(), "descs", doc.get("descs"));
//            if (descs == null) {
//                descs = content.getDescs();
//            }
//            content.setDescs(descs);
//            content.setTitle(title);
//            list.add(content);
//        }
//        System.err.println("list的长度：" + list.size());
//        request.setAttribute("page", page);
//        request.setAttribute("pageSize", pageSize);
//        request.setAttribute("list", list);
//        return "index";
//    }

    public static TopDocs searchByPage(int page, int perPage, IndexSearcher searcher, Query query) throws IOException {
        TopDocs result = null;
        if (query == null) {
            System.out.println(" Query is null return null ");
            return null;
        }
        ScoreDoc before = null;
        if (page != 1) {
            TopDocs docsBefore = searcher.search(query, (page - 1) * perPage);
            ScoreDoc[] scoreDocs = docsBefore.scoreDocs;
            if (scoreDocs.length > 0) {
                before = scoreDocs[scoreDocs.length - 1];
            }
        }
        result = searcher.searchAfter(before, query, perPage);
        return result;
    }

//    public String searchText4(String text) throws IOException, ParseException, InvalidTokenOffsetsException {
//        String[] str = {"title", "descs"};
//        int page = 1;
//        int pageSize = 100;
//        IndexSearcher searcher = getMoreSearch("d:\\indexDir");
//        // 创建查询解析器,两个参数：默认要查询的字段的名称，分词器
//        MultiFieldQueryParser parser = new MultiFieldQueryParser(str, new MyIKAnalyzer());
//        // 创建查询对象
//        Query query = parser.parse(text);
//
//        TopDocs topDocs = searchByPage(page, pageSize, searcher, query);
//        // 获取总条数
//        System.out.println("本次搜索共找到" + topDocs.totalHits + "条数据");
//
//        //高亮显示
//        SimpleHTMLFormatter simpleHTMLFormatter = new SimpleHTMLFormatter("<span style='color:red'>", "</span>");
//        Highlighter highlighter = new Highlighter(simpleHTMLFormatter, new QueryScorer(query));
//        Fragmenter fragmenter = new SimpleFragmenter(100);   //高亮后的段落范围在100字内
//        highlighter.setTextFragmenter(fragmenter);
//
//        // 获取得分文档对象（ScoreDoc）数组.SocreDoc中包含：文档的编号、文档的得分
//        ScoreDoc[] scoreDocs = topDocs.scoreDocs;
//        List<Content> list = new ArrayList<>();
//        for (ScoreDoc scoreDoc : scoreDocs) {
//            // 取出文档编号
//            int docID = scoreDoc.doc;
//            // 根据编号去找文档
//            //Document doc = reader.document(docID);
//            Document doc = searcher.doc(docID);//多索引找文档要用searcher找了，reader容易报错
//            //Content content = contentMapper.selectByPrimaryKey(doc.get("id"));
//            Content content = new NoteContent();
//            //处理高亮字段显示
//            String title = highlighter.getBestFragment(new MyIKAnalyzer(), "title", doc.get("title"));
//            if (title == null) {
//                title = content.getTitle();
//            }
//            String descs = highlighter.getBestFragment(new MyIKAnalyzer(), "descs", doc.get("descs"));
//            if (descs == null) {
//                descs = content.getDescs();
//            }
//            content.setDescs(descs);
//            content.setTitle(title);
//            list.add(content);
//        }
//        System.err.println("list的长度：" + list.size());
//        request.setAttribute("page", page);
//        request.setAttribute("pageSize", pageSize);
//        request.setAttribute("list", list);
//        return "index";
//    }

    public static IndexSearcher getSearcher(String indexPath) {
        try {
            IndexReader reader = DirectoryReader.open(FSDirectory.open(FileSystems.getDefault().getPath(indexPath)));
            return new IndexSearcher(reader);
        } catch (IOException e) {
            throw new CornException(e.getMessage());
        }
    }
}
