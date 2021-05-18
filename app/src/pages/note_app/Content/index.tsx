import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import { Modal, Input } from 'antd';
import { ExclamationCircleTwoTone, CheckCircleTwoTone, LoadingOutlined } from '@ant-design/icons';
import styles from './index.less';
import { connect } from 'umi';
import { getLevel, guid } from '@/utils/utils'

const { TextArea } = Input;

let statusIcons = {
    '0': <CheckCircleTwoTone twoToneColor="#52c41a" />,
    '1': <ExclamationCircleTwoTone twoToneColor='#f1c40f' />, '2': <LoadingOutlined />
}

const group = 'group';

const Content = React.forwardRef((props, ref) => {

    const content = useRef();
    const titleInput = useRef();
    const [code, setCode] = useState < string > ('');
    const [saveStatus, setSaveStatus] = useState < Number > (null);//0:已保存 1:未保存 2:正在保存
    const [title, setTitle] = useState < string > ('');
    const [codeVisible, setCodeVisible] = useState < boolean > (false);
    const [note, setNote] = useState < object > ({});

    const execCommand = (command: string, param1: string = '') => {
        document.execCommand(command, false, param1);
    }

    const showCode = () => {
        setCode(content.current.innerHTML);
        setCodeVisible(true);
    }
    useImperativeHandle(ref, () => ({
        handleAddNote: (parentId: string) => {
            console.log('handleAddNote');
            const id = guid();
            setSaveStatus(1)
            setNote({ parentId, id });
            setTitle('新文档');
            content.current.innerHTML = '';
            props.dispatch({
                type: 'note/refreshActiveNoteId',
                payload: id,
            })//显示笔记
        }
    }));

    const handleUpdateCode = () => {
        content.current.innerHTML = code;
        setCodeVisible(false);
    }

    const handleCodeChange = ({ target: { value } }) => {
        setCode(value)
    }

    const handleChange = e => {
        setSaveStatus(1)
    }

    const handleTitleChange = e => {
        setTitle(e.target.value);
        setSaveStatus(1)
    }

    useEffect(() => {
        handleShowNote(props.note.activeNoteId)
    }, [props.note.activeNoteId])

    const handleShowNote = (id: string) => {
        console.log('handleShowNote');
        if (!id || id == '') {
            setNote({});
            setTitle('');
            content.current.innerHTML = '';
        } else if (id != "open" && id != "favorate") {
            props.dispatch({
                type: 'note/queryNote',
                payload: id,
            }).then((res) => {
                if (res) {
                    setNote(res);
                    setTitle(res.name);
                    content.current.innerHTML = res.text;
                    setSaveStatus(0)
                }
            });
        }

    }

    const saveNote = () => {
        if (saveStatus == 0) {
            return;
        }
        setSaveStatus(2)
        const noteToSave = { ...note, name: title, text: content.current.innerHTML }
        if (noteToSave.parentId) {
            let type;
            if (noteToSave.createTime) {//修改
                type = 'note/modifyNote'
            } else {
                type = 'note/addNote'
            }

            props.dispatch({
                type, payload: noteToSave
            }).then((res) => {
                if (res) {
                    if (noteToSave.createTime) {//修改
                        if (note.name != title) {//标题修改了才刷新菜单
                            props.refreshMenu(getLevel(noteToSave.parentIds));
                        }
                    } else {
                        const { result: newNote } = res;
                        props.refreshMenu(getLevel(newNote.parentIds));
                    }
                    if (props.note.activeNoteId == noteToSave.id) {
                        setSaveStatus(0)
                    }
                }
            })
        }

    }

    const handleBlur = e => {
        if (!e.relatedTarget || e.relatedTarget.getAttribute('group') != group) {
            saveNote()
        }

    }


    const render = function () {
        return (
            <>
                <div className={styles.toolbar} onBlur={handleBlur}>
                    <a group={group} onClick={showCode} href='#'>code</a>
                    <a group={group} onClick={() => execCommand('bold')} href='#'><b>Bold</b></a>
                    <a group={group} onClick={() => execCommand('italic')} href='#'><em>Italic</em></a>
                    <a group={group} onClick={() => execCommand('underline')} href='#'><u><b>U</b></u></a>
                    <a group={group} className={styles.yellow}
                        onClick={() => {
                            execCommand('backColor', '#FFEB9C')
                            execCommand('foreColor', '#9C6500')
                        }} href='#'>突出</a>
                    <a group={group} className={styles.green}
                        onClick={() => {
                            execCommand('backColor', '#C6EFCE')
                            execCommand('foreColor', '#006100')
                        }} href='#'>优秀</a>
                    <a group={group} className={styles.warning}
                        onClick={() => {
                            execCommand('backColor', '#FFC7CE')
                            execCommand('foreColor', '#9C0006')
                        }} href='#'>警告</a>
                    <a group={group} onClick={() => execCommand('removeFormat')} href='#'><b>去除格式</b></a>
                    <a group={group} onClick={() => execCommand('insertHorizontalRule')} href='#'><b>水平线</b></a>
                    <a group={group} onClick={() => execCommand('insertHTML', '&nbsp;&nbsp;&nbsp;-&nbsp;')} href='#'><b>*</b></a>
                    <a group={group} onClick={() => execCommand('indent')} href='#'><b>{'Tab'}</b></a>
                    <a group={group} onClick={() => execCommand('fontname', 'Microsoft YaHei')} href='#'><span style={{ fontFamily: 'Microsoft YaHei' }}>雅黑</span></a>
                    <a group={group} onClick={() => execCommand('fontname', 'SimHei')} href='#'><span style={{ fontFamily: 'SimHei' }}>黑体</span></a>
                    <a group={group} onClick={() => execCommand('fontname', 'SimSun')} href='#'><span style={{ fontFamily: 'SimSun' }}>宋体</span></a>
                    <a group={group} onClick={() => execCommand('fontname', 'Courier New')} href='#'><div style={{ display: 'inline-block', fontFamily: 'Courier New' }}>Font</div></a>
                    <a group={group} onClick={() => execCommand('fontname', 'Comic Sans MS')} href='#'><div style={{ display: 'inline-block', fontFamily: 'Comic Sans MS' }}>Font</div></a>



                </div>
                <div className={styles.main}>
                    {props.children}
                    <div className={styles.content}>
                        <div className={styles.title}><Input group={group} ref={titleInput} value={title} onBlur={handleBlur} onInput={handleTitleChange}></Input>{statusIcons[saveStatus]}</div>
                        <div group={group} className={styles.text} ref={content} onInput={handleChange} onBlur={handleBlur} suppressContentEditableWarning="true" contentEditable>
                        </div>
                    </div>
                </div>
                <Modal
                    visible={codeVisible}
                    onOk={handleUpdateCode}
                    onCancel={() => setCodeVisible(false)}
                >
                    <div style={{ marginBottom: '10px' }}>Source code</div>
                    <TextArea value={code} rows={10} onChange={handleCodeChange} />

                </Modal>
            </>
        );
    };
    return render();
});

export default connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu, loading }) =>
    ({ note, noteMenu, loading }), null, null, { forwardRef: true })(Content);
