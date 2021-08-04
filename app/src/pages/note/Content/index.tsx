import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import { Modal, Input } from 'antd';
import { ExclamationCircleTwoTone, CheckCircleTwoTone, LoadingOutlined,EyeOutlined,EditOutlined } from '@ant-design/icons';
import styles from './index.less';
import { connect } from 'umi';
import { getLevel, guid } from '@/utils/utils'
import MarkDownIt from './MarkDownIt'

const { TextArea } = Input;

let statusIcons = {
    '0': <CheckCircleTwoTone twoToneColor="#52c41a" />,
    '1': <ExclamationCircleTwoTone twoToneColor='#f1c40f' />, '2': <LoadingOutlined />
}

const group = 'group';

const Content = React.forwardRef((props, ref) => {

    const titleInput = useRef();
    const [code, setCode] = useState<string>('');
    const [saveStatus, setSaveStatus] = useState<Number>(null);//0:已保存 1:未保存 2:正在保存
    const [title, setTitle] = useState<string>('');
    const [codeVisible, setCodeVisible] = useState<boolean>(false);
    const [displayIndex, setDisplayIndex] = useState<number>(-1);


    useImperativeHandle(ref, () => ({
        handleAddNote: (parentId: string) => {
            console.log('handleAddNote');
            const id = guid();
            setSaveStatus(1)
            const note = { name: '新文档', parentId, id };
            setTitle('新文档');
            // content.current.innerHTML = '';
            props.dispatch({
                type: 'note/refreshShowNote',
                payload: note,
            })//显示笔记
        }
    }));

    const handleUpdateCode = () => {
        // content.current.innerHTML = code;
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
        handleShowNote(props.note.showNote)
    }, [props.note.showNote])

    const handleShowNote = (note) => {
        console.log('handleShowNote');
        setTitle(note.name);
        // content.current.innerHTML = note.text || '';
        setDisplayIndex(0)
        setSaveStatus(0)
    }

    const saveNote = (type: string, text: string) => {
        if (saveStatus == 0) {
            return;
        }

        let noteToSave = { ...props.note.showNote }

        if (noteToSave.id) {

            setSaveStatus(2)
            noteToSave.name = title

            let method
            if (type == 'title') {
                method = 'note/updateNoteTitle'
            } else {
                method = 'note/updateNoteText'
                noteToSave.text = text
            }

            props.dispatch({
                type: method,
                payload: noteToSave
            }).then((res) => {
                if (res) {
                    if (noteToSave.createTime) {//修改
                        if (type == 'title') {//标题修改了才刷新菜单
                            props.refreshMenu(getLevel(noteToSave.parentIds));
                        }
                    } else {
                        const { result: newNote } = res;
                        noteToSave = newNote;
                        props.refreshMenu(getLevel(newNote.parentIds));
                    }
                    props.dispatch({
                        type: 'openNotes/updateOpenNote',
                        payload: noteToSave
                    })

                    if (props.note.activeNoteId == noteToSave.id) {
                        setSaveStatus(0)
                    }
                }
            })
        }

    }

    const handleBlur = (e, type) => {
        if (type == 'title') {
            saveNote(type)
        } else if (!e.relatedTarget || e.relatedTarget.getAttribute('group') != group) {
            saveNote(type)
        }

    }


    const render = function () {
        return (
            <>
                {/* <div className={styles.toolbar} onBlur={e => handleBlur(e, 'content')}>
                    <div className={styles.buttons}>
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
                    <div className={styles.status}>
                        {statusIcons[saveStatus]}
                    </div>

                </div> */}
                <div className={styles.main}>
                    {props.children}
                    <div className={styles.content}>
                        <div className={styles.buttons}> {displayIndex == 0 ? <EditOutlined onClick={() => setDisplayIndex(1)} /> :
                            <EyeOutlined onClick={() => {
                                setDisplayIndex(0)
                            }} />}{statusIcons[saveStatus]}</div>
                        <div className={styles.title}><Input maxLength={100} ref={titleInput} value={title} onBlur={e => handleBlur(e, 'title')} onInput={handleTitleChange}></Input></div>
                        <MarkDownIt handleChange={handleChange} displayIndex={displayIndex} saveContent={(text: string) => saveNote('content', text)}></MarkDownIt>

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
