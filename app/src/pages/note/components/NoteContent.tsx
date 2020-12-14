import React, { useRef, useImperativeHandle, useState } from 'react';
import styles from '../index.less'
import { connect, NoteModelState, ConnectProps, NoteState } from 'umi';
import { Input } from 'antd';
import { LoadingOutlined,CheckCircleTwoTone } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';

const NoteContent = React.forwardRef((props, ref) => {

    const { showNote } = props.note;
    const nameInput = useRef();
    const [textStatus, setTextStatus] = useState("");

    useImperativeHandle(ref, () => ({
        focusName: () => {
            nameInput.current.focus();
        }
    }), [nameInput]);

    const handleNameChange = e => {
        props.dispatch({
            type: 'note/refreshShowNote',
            payload: { ...showNote, name: e.target.value },
        })
    };

    const handleEditNote = (e) => {
        const text = window.tinymce.activeEditor.getContent();
        const newNote = { ...showNote, text };
        editNote(newNote);
    };
    const handleTextStatusChange = (state) => {
        if (state) {
            setTextStatus(<>正在保存 <LoadingOutlined/></>);
        } else {
            setTextStatus(<>保存成功 <CheckCircleTwoTone twoToneColor="#52c41a" /></>);
            setTimeout(() => {
                setTextStatus('');
            }, 1000);
        }
    }

    const editNote = (note) => {
        const { treeData } = props.note;
        handleTextStatusChange(1);
        if (note.parentId) {
            if (note.id) {
                props.dispatch({
                    type: 'note/modifyNote',
                    payload: note
                }).then(() => {
                    handleTextStatusChange(0);
                })
            } else {
                props.dispatch({
                    type: 'note/addNote',
                    payload: note
                }).then((res) => {
                    if (res) {
                        const { result: newNote } = res;
                        props.dispatch({
                            type: 'openNotes/updateOpenNote',
                            payload: [newNote, ...props.openNotes.openedNotes]
                        })
                        handleTextStatusChange(0);
                    }
                })
            }
        }
    }


    return (
        <>
            <div>
                <Input
                    ref={nameInput}
                    value={showNote.name}
                    onChange={handleNameChange}
                    onBlur={handleEditNote}
                ></Input>

            </div>
            <div className={styles.text}>
                <div className={styles.textStatus}>{textStatus}</div>
                <Editor
                    value={showNote.text}
                    onBlur={handleEditNote}
                    init={{
                        height: '100vh',
                        plugins: 'table,code,lists,advlist,image,imagetools,codesample,pagebreak',
                        toolbar: `code | undo redo | bold italic strikethrough | 
                        fontsizeselect h2 h3 forecolor backcolor | 
                bullist numlist | image | pagebreak blockquote codesample removeformat`,
                        toolbar_sticky: true,
                        menubar: false,
                        branding: false,
                    }}
                />
            </div>
        </>
    );
});
export default connect(({ note, openNotes, loading }: { note: NoteState, openNotes, loading }) => (
    { note, openNotes, loading })
    , null, null, { forwardRef: true })(NoteContent);
