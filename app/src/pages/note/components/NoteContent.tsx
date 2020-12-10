import React, { useRef, useImperativeHandle } from 'react';
import styles from '../index.less'
import { connect, NoteModelState, ConnectProps, NoteState } from 'umi';
import { Input } from 'antd';
import { Editor } from '@tinymce/tinymce-react';

const NoteContent = React.forwardRef((props, ref) => {

    const { showNote } = props.note;
    const nameInput = useRef();

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

    const editNote = (note) => {
        const { treeData } = props.note;
        if (note.parentId) {
            if (note.id) {
                props.dispatch({
                    type: 'note/modifyNote',
                    payload: note
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
                    }
                })
            }
        }
    }


    return (
        <>
            <Input
                ref={nameInput}
                value={showNote.name}
                onChange={handleNameChange}
                onBlur={handleEditNote}
            ></Input>
            <div className={styles.text}>
                <Editor
                    value={showNote.text}
                    onBlur={handleEditNote}
                    init={{
                        height: '100vh',
                        plugins: 'table,code,lists,advlist',
                        toolbar: `code | undo redo | bold italic h2 h3 blockquote forecolor backcolor | 
                bullist numlist | link image`,
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
