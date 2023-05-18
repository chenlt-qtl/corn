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
    const [text, setText] = useState<string>("");//存放全部的文本
    const [editText, setEditText] = useState<string>("");//存放正在被编辑的文本
    const [visible, setVisible] = useState<boolean>(false);

    const [htmlObjs, setHtmlObjs] = useState<Object[]>([]);
    const [editKey, setEditKey] = useState<string>("");


    useEffect(() => {
        const { openedNote } = props.note;
        let text = openedNote.text || "";
        setText(text);
    }, [props.note.openedNote.id])

    useEffect(() => {
        processText(text)
    }, [text])

    useEffect(() => {
        if (props.isEdit) {//非编辑不用操作
            setEditText(text);
        }
    }, [props.isEdit])


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


    //切割text内容
    const processText = (text: string) => {

        tocify.reset();
        const { id } = props.note.openedNote;

        const separator = "\n## ";
        let index = text.indexOf(separator);
        let oldIndex = 0;
        const htmlObjs = [];

        while (index != -1) {
            let tempText = text.substring(oldIndex, index);

            if (tempText.length > 0) {
                htmlObjs.push({ id: id + index, text: tempText, html: marked(tempText) });
            }
            oldIndex = index + 1;
            index = text.indexOf(separator, index + 1);
        }

        let tempText = text.substring(oldIndex, text.length);
        if (tempText.length > 0) {
            htmlObjs.push({ id: id + text.length, text: tempText, html: marked(tempText) });
        }
        setHtmlObjs(htmlObjs);

    }

    //内容修改时，更新右上图标状态，数据同步到value中
    const handleEditorChange = ({ text }) => {
        setEditText(text);
        props.handleChange();
    }

    //保存数据，更新view视图
    const saveContent = text => {
        setText(text)
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


    const onTextDoubleclick = textId => {
        const { id } = props.note.openedNote;
        if (id && !props.isMobile) {
            setEditKey(textId)
            if (textId == "new") {
                setEditText(blankText);
            } else {
                htmlObjs.forEach(item => {
                    if (item.id == textId) {
                        setEditText(item.text);
                    }
                })
            }
            setVisible(true)
        }
    }

    //窗口关闭
    const onModalClose = () => {
        let text = "";
        let isChange = false;
        if (editKey == "new") {
            if (editText != blankText) {
                htmlObjs.push({ text: editText })
                isChange = true;
            }
        }
        htmlObjs.forEach(item => {
            if (item.id == editKey) {
                if (editText != item.text) {
                    text += editText;
                    isChange = true;
                }
            } else {
                text += item.text;
            }
            text += "\n";
        })


        if (isChange) {
            setText(text)
            saveContent(text);
        }
        setVisible(false);
    }


    const render = function () {
        const { isEdit, showToc, setShowToc, isMobile } = props;

        return (
            <>
                <div className={styles.md_container}>
                    {(!isMobile && showToc && !isEdit) ? <div className={styles.md_toc}>
                        <div className={styles.md_title}><CloseOutlined onClick={() => { setShowToc(false) }} /></div>
                        {tocify && tocify.render()}
                    </div> : ""}
                    <div className={`${styles.md_content} ${styles.md_md}`}>
                        {isEdit ?
                            <MdEditor
                                value={editText}
                                renderHTML={renderHTML}
                                onChange={handleEditorChange}
                                onImageUpload={handleImageUpload}
                                onBlur={() => saveContent(editText)}
                                style={{ height: '100%' }}
                                config={{ view: { menu: true, html: isMobile ? false : true, md: true } }}
                            />
                            : <div className={styles.md_view}>
                                {htmlObjs.length > 0 && htmlObjs.map(item =>
                                    <div key={item.id} dangerouslySetInnerHTML={{ __html: item.html }} onDoubleClick={() => onTextDoubleclick(item.id)}></div>
                                )}
                                <div className={styles.md_restSpace} onDoubleClick={() => onTextDoubleclick("new")}></div>
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
                    onCancel={onModalClose}
                >
                    <div className={styles.md_md}>
                        <MdEditor
                            value={editText}
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
