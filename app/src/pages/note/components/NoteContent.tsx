import React, { useRef, useImperativeHandle, useState } from 'react';
import styles from '../index.less'
import { connect, NoteModelState, ConnectProps, NoteState } from 'umi';
import { Input } from 'antd';
import { LoadingOutlined, CheckCircleTwoTone, StarFilled, StarOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import lodash from 'lodash';


const NoteContent = React.forwardRef((props, ref) => {

    const { showNote } = props.note;
    const { noteIds } = props.noteFavorite;
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
            setTextStatus(<>正在保存 <LoadingOutlined /></>);
        } else {
            setTextStatus(<>保存成功 <CheckCircleTwoTone twoToneColor="#52c41a" /></>);
            setTimeout(() => {
                setTextStatus('');
            }, 1000);
        }
    }

    const editNote = (note) => {
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

    const isFavorate = () => {
        if (noteIds.includes(showNote.id)) {
            return true;
        }
        return false;
    }

    const setFavorate = (data:boolean) =>{
        if(lodash.isEmpty(showNote)){
            return;
        }
        let result:string[] = [];
        if(data){//增加
            result = Array.from(new Set([...noteIds,showNote.id]));
        }else{//减少
            result = noteIds.filter((item:string)=>item!=showNote.id);
        }

        console.log(result);
        props.dispatch({
            type: 'noteFavorite/edit',
            payload: result
        });
    }

    return (
        <>
            <div className={styles.title}>
                <Input
                    ref={nameInput}
                    value={showNote.name}
                    onChange={handleNameChange}
                    onBlur={handleEditNote}
                ></Input>
                <div className={styles.star}>
                    {isFavorate() ? <StarFilled onClick={()=>{setFavorate(false);}} className={styles.favorate}/> : <StarOutlined onClick={()=>{setFavorate(true);}} className={styles.notFavorate}/>}</div>
            </div>
            <div className={styles.text}>
                <div className={styles.textStatus}>{textStatus}</div>
                <Editor
                    value={showNote.text}
                    onBlur={handleEditNote}
                    init={{
                        height: '100vh',
                        plugins: 'table,code,lists,advlist,image,imagetools,codesample,pagebreak,nonbreaking',
                        toolbar: `code | undo redo | bold italic strikethrough | 
                        fontsizeselect h2 h3 forecolor backcolor | 
                bullist numlist | image | pagebreak blockquote codesample removeformat`,
                        toolbar_sticky: true,
                        menubar: false,
                        branding: false,
                        nonbreaking_force_tab: true,
                    }}
                />
            </div>
        </>
    );
});
export default connect(({ note, openNotes, noteFavorite, loading }: { note: NoteState, openNotes, noteFavorite, loading }) => (
    { note, openNotes, noteFavorite, loading })
    , null, null, { forwardRef: true })(NoteContent);
