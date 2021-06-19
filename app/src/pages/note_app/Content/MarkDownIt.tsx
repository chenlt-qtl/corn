import React, { useState, useRef, useEffect } from 'react';
import { Modal, Input } from 'antd';
import { EyeOutlined, InteractionOutlined, CheckCircleOutlined, EditOutlined } from '@ant-design/icons';
import styles from './index.less';
import { connect } from 'umi';
import { getLevel, guid } from '@/utils/utils'

import { uploadImg } from '@/pages/note/service'

import MarkdownIt from 'markdown-it'
import MdEditor, { Plugins } from 'react-markdown-editor-lite'
// 导入编辑器的样式
import 'react-markdown-editor-lite/lib/index.css';



const mdParser = new MarkdownIt();

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
    const [value, setValue] = useState("");
    const [displayIndex, setDisplayIndex] = useState<number>(0);
    const content = useRef();

    useEffect(() => {
        const text = props.note.showNote.text || "";
        setDisplayIndex(0);
        setValue(text);
        content.current.innerHTML = text;


    }, [props.note.showNote])


    const handleEditorChange = ({ html, text }) => {
        console.log('handleEditorChange', html, text)
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

    const editBtn = <EditOutlined onClick={()=>setDisplayIndex(1)} />
    const viewBtn = <EyeOutlined onClick={()=>setDisplayIndex(0)} />
    const oldBtn = <InteractionOutlined onClick={()=>setDisplayIndex(2)} />

    const getDisplayBtn = () => {
        
        if (displayIndex == 0) {
            return <>{editBtn}{oldBtn}</>
        } else if (displayIndex == 1) {
            return <>{viewBtn}{oldBtn}</>
        } else if (displayIndex == 2) {
            return <>{editBtn}{viewBtn}</>
        }

    }


    const render = function () {
        return (
            <>
                <div className={styles.buttons}>{getDisplayBtn()}</div>
                <div style={{ display: displayIndex == 1 ? 'block' : 'none' }}>
                    <MdEditor
                        value={value}
                        style={{ height: "600px" }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={handleEditorChange}
                        // plugins={plugins}
                        config={{ view: { html: false } }}
                        onImageUpload={handleImageUpload}
                        onBlur={saveContent}
                    />
                </div>
                <div style={{ display: displayIndex == 0 ? 'block' : 'none' }}>
                    <MdEditor
                        value={value}
                        style={{ border: 0 }}
                        renderHTML={(text) => mdParser.render(text)}
                        config={{ view: { menu: false, md: false } }}
                        readOnly={true}
                    />
                </div>
                <div style={{ display: displayIndex == 2 ? 'block' : 'none' }}>
                    <div ref={content} suppressContentEditableWarning="true" contentEditable>
                    </div>
                </div>
            </>
        );
    };
    return render();
});

export default connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu, loading }) =>
    ({ note, noteMenu, loading }), null, null, { forwardRef: true })(MarkDownIt);
