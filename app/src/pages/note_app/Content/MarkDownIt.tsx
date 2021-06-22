import React, { useState, useEffect } from 'react';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import styles from './index.less';
import { connect } from 'umi';

import { uploadImg } from '@/pages/note/service'

import MdEditor, { Plugins } from 'react-markdown-editor-lite'
// 导入编辑器的样式
import 'react-markdown-editor-lite/lib/index.css';

import marked from 'marked'
import hljs from "highlight.js";
import 'highlight.js/styles/monokai-sublime.css';
import Tocify from './Tocify';

let tocify = new Tocify();
const renderer = new marked.Renderer();
renderer.heading = function (text, level, raw) {
    const anchor = tocify.add(text, level);
    return `<a id="${anchor}" href="#${anchor}" class="anchor-fix"><h${level}>${text}</h${level}></a>\n`;
};


marked.setOptions({
    renderer,
    highlight: function (code) {
        return hljs.highlightAuto(code).value;
    },
    gfm: true, // 允许 Git Hub标准的markdown.
    pedantic: false, // 不纠正原始模型任何的不良行为和错误（默认为false）
    sanitize: false, // 对输出进行过滤（清理），将忽略任何已经输入的html代码（标签）
    tables: true, // 允许支持表格语法（该选项要求 gfm 为true）
    breaks: false, // 允许回车换行（该选项要求 gfm 为true）
    smartLists: true, // 使用比原生markdown更时髦的列表
    smartypants: false, // 使用更为时髦的标点
})

MdEditor.use(Plugins.TabInsert, {
    /**
     * 用户按下 Tab 键时输入的空格的数目
     * 特别地，1 代表输入一个'\t'，而不是一个空格
     * 默认值是 1
     */
    tabMapValue: 1,
});

const plugins = ['header', 'font-bold', 'font-italic', 'font-underline', 'font-strikethrough',
    'list-unordered', 'list-ordered', 'block-quote', 'block-wrap', 'block-code-inline',
    'block-code-block', 'table', 'image', 'link', 'clear', 'logger', 'auto-resize', 'full-screen'];



const MarkDownIt = React.forwardRef((props, ref) => {
    const [value, setValue] = useState<string>("");
    const [htmlStr, setHtmlStr] = useState<string>("");

    useEffect(() => {
        const text = props.note.showNote.text || "";
        setHtmlStr(renderHTML(text))
        setValue(text);
    }, [props.note.showNote])

    useEffect(() => {
        setHtmlStr(renderHTML(value))
    }, [props.displayIndex])

    const handleEditorChange = ({ html, text }) => {
        setValue(text);
        props.handleChange();
    }

    const saveContent = () => {
        console.log('save note', value);
        props.saveContent(value);

    }

    const handleImageUpload = (file, callback) => {
        const reader = new FileReader()
        reader.onload = async () => {
            const convertBase64UrlToBlob = (urlData) => {
                let arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1]
                let bstr = atob(arr[1])
                let n = bstr.length
                let u8arr = new Uint8Array(n)
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n)
                }
                return new Blob([u8arr], { type: mime })
            }
            const blob = convertBase64UrlToBlob(reader.result)
            console.log(blob);

            let result = await uploadImg(reader.result)
            if (result.success) {
                callback(result.result)
            } else {
                console.log(result.message);

            }

        }
        reader.readAsDataURL(file)
    }

    const renderHTML = (text: string) => {
        tocify = new Tocify();
        let html = marked(text);
        return html
    }


    const render = function () {
        const { displayIndex } = props;
        return (
            <>

                {displayIndex == 1 ?
                    <div style={{ display: displayIndex == 1 ? 'block' : 'none' }}>
                        <MdEditor
                            value={value}
                            style={{ height: "600px" }}
                            renderHTML={(text) => marked(text)}
                            onChange={handleEditorChange}
                            // plugins={plugins}
                            onImageUpload={handleImageUpload}
                            onBlur={saveContent}
                        />
                    </div> : ''}

                {displayIndex == 0 ?
                    <div className={styles.view}>
                        <div className={styles.toc}>
                            <span>大纲</span>
                            {tocify && tocify.render()}</div>
                        <div className={styles.text} dangerouslySetInnerHTML={{ __html: htmlStr }} />
                    </div> : ''}
            </>
        );
    };
    return render();
});

export default connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu, loading }) =>
    ({ note, noteMenu, loading }), null, null, { forwardRef: true })(MarkDownIt);
