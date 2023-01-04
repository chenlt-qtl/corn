import React, { useState, useEffect } from 'react';
import styles from './md.less';
import { connect } from 'umi';
import { Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { uploadImg } from '@/services/note'
import HocMedia from "@/components/HocMedia";


import MdEditor, { Plugins } from 'react-markdown-editor-lite'
// 导入编辑器的样式
import 'react-markdown-editor-lite/lib/index.css';

import marked from 'marked'
import hljs from "highlight.js";
import 'highlight.js/styles/a11y-light.css';
import Tocify from './Tocify';

let tocify = new Tocify();


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

const blankText = "## ";

const MarkDown = React.forwardRef((props, ref) => {
    const [value, setValue] = useState<string>("");
    const [visible, setVisible] = useState<boolean>(false);

    const [htmlObjs, setHtmlObjs] = useState<Object[]>([]);
    const [editKey, setEditKey] = useState<string>("");


    useEffect(() => {
        const { openedNote } = props.note;
        let text = "";
        if (openedNote.id) {
            text =openedNote.text || "";
        }
        processText(text);
    }, [props.note.openedNote])

    useEffect(() => {
        if (editKey == "new") {
            setValue(blankText);
        } else {
            htmlObjs.forEach(item => {
                if (item.id == editKey) {
                    setValue(item.text);
                }
            })
        }
    }, [editKey])

    useEffect(() => {
        const { displayIndex } = props;
        if (displayIndex) {//编辑
            const { openedNote } = props.note;
            let text = "";
            if (openedNote) {
                text = openedNote.text || "";
            }
            setValue(text);
        }
    }, [props.displayIndex])

    //监听窗口关闭
    useEffect(() => {

        //关闭时保存数据
        if (!visible) {
            let text = "";
            let isChange = false;
            if (editKey == "new") {
                if (value != blankText) {
                    htmlObjs.push({ text: value })
                    isChange = true;
                }
            }
            htmlObjs.forEach(item => {
                if (item.id == editKey) {
                    if (value != item.text) {
                        text += value;
                        isChange = true;
                    }
                } else {
                    text += item.text;
                }
                text += "\n";
            })


            if (isChange) {
                saveContent(text);
            }
            setEditKey("");
        }
    }, [visible])


    const renderer = new marked.Renderer();
    renderer.heading = function (text, level) {
        if (!visible) {//如果没有显示弹窗的时候，更新目录
            const anchor = tocify.add(text, level);
            return `<a id="${anchor}" href="#${anchor}" class="anchor-fix"><h${level}>${text}</h${level}></a>\n`;
        } else {
            return `<h${level}>${text}</h${level}>`;

        }


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
        smartLists: false, // 使用比原生markdown更时髦的列表
        smartypants: false, // 使用更为时髦的标点
    })


    const processText = (text: string) => {

        tocify.reset();
        const { openedNote } = props.note;

        const separator = "\n## ";
        let index = text.indexOf(separator);
        let oldIndex = 0;
        const htmlObjs = [];

        while (index != -1) {
            let tempText = text.substring(oldIndex, index);

            if (tempText.length > 0) {
                htmlObjs.push({ id: openedNote.id + index, text: tempText, html: marked(tempText) });
            }
            oldIndex = index + 1;
            index = text.indexOf(separator, index + 1);
        }

        let tempText = text.substring(oldIndex, text.length);
        if (tempText.length > 0) {
            htmlObjs.push({ id: openedNote.id + text.length, text: tempText, html: marked(tempText) });
        }

        setHtmlObjs(htmlObjs);

    }

    //内容修改时，更新右上图标状态，数据同步到value中
    const handleEditorChange = ({ html, text }) => {
        setValue(text);
        props.handleChange();
    }

    //保存数据，更新view视图
    const saveContent = text => {
        processText(text);
        props.saveContent(text);
    }

    const handleImageUpload = (file, callback) => {
        const reader = new FileReader()
        reader.onload = async () => {
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
        tocify.reset();
        let html = marked(text);
        return html
    }


    const clickText = (textId) => {
        if (props.note.openedNote.id && !props.isMobile) {
            setEditKey(textId)
            setVisible(true)
        }
    }



    const render = function () {
        const { displayIndex, showToc, setShowToc, isMobile } = props;

        return (
            <>
                <div className={styles.md_container}>
                    {!isMobile && showToc ? <div className={styles.md_toc}>
                        <div className={styles.md_title}><CloseOutlined onClick={() => { setShowToc(false) }} /></div>
                        {tocify && tocify.render()}
                    </div> : ""}
                    <div className={`${styles.md_content} ${styles.md_md}`}>
                        {displayIndex == 1 ?
                            <MdEditor
                                value={value}
                                renderHTML={renderHTML}
                                onChange={handleEditorChange}
                                onImageUpload={handleImageUpload}
                                onBlur={() => saveContent(value)}
                                style={{ height: '100%' }}
                                config={{ view: { menu: true, html: isMobile ? false : true, md: true } }}
                            />
                            : <div className={styles.md_view}>
                                {htmlObjs.length > 0 && htmlObjs.map(item =>
                                    <div key={item.id} dangerouslySetInnerHTML={{ __html: item.html }} onDoubleClick={() => clickText(item.id)}></div>
                                )}
                                <div className={styles.md_restSpace} onDoubleClick={() => clickText("new")}></div>
                            </div>}
                    </div>
                </div>

                <Modal
                    title={null}
                    footer={null}
                    visible={visible}
                    closable={false}
                    width={1000}
                    maskClosable={true}
                    onCancel={() => setVisible(false)}
                >
                    <div className={styles.md_md}>
                        <MdEditor
                            value={value}
                            renderHTML={text => marked(text)}
                            onChange={handleEditorChange}
                            onImageUpload={handleImageUpload}
                            config={{ view: { menu: true, html: true, md: true } }}
                            style={{ "minHeight": "500px" }} />
                    </div>
                </Modal>
            </>
        );
    };
    return render();
});

export default HocMedia(connect(({ note, loading }: { note: NoteModelState, loading }) =>
    ({ note, loading }), null, null, { forwardRef: true })(MarkDown));
