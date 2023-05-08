import React, { useState, useRef, useEffect } from 'react';
import { Input, Button } from 'antd';
import { ExclamationCircleTwoTone, CheckCircleTwoTone, LoadingOutlined, EyeOutlined, EditOutlined, StarOutlined, StarFilled, CloseCircleOutlined, ProfileOutlined, InboxOutlined } from '@ant-design/icons';
import styles from './style.less';
import { connect, history } from 'umi';
import MarkDown from './MarkDown'
import 'font-awesome/css/font-awesome.min.css';
import HocMedia from "@/components/HocMedia";
import lodash from 'lodash';

let statusIcons = {
    '0': <CheckCircleTwoTone key="ok" twoToneColor="#52c41a" />,
    '1': <ExclamationCircleTwoTone key="unsave" twoToneColor='#f1c40f' />,
    '2': <LoadingOutlined key="saving" />
}

const group = 'group';

const Content = React.forwardRef((props, ref) => {

    const titleInput = useRef();
    const [saveStatus, setSaveStatus] = useState<Number>(0);//0:已保存 1:未保存 2:正在保存
    const [isEdit, setIsEdit] = useState<boolean>(false); //是否编辑状态

    const [title, setTitle] = useState<String>("");

    const [showToc, setShowToc] = useState<boolean>(true);

    useEffect(() => {
   
        const { openedNote } = props.note;
        if (!lodash.isEmpty(openedNote)) {
            setTitle(openedNote.name)
            if (!openedNote.id) {//新增
                setSaveStatus(1)
                setIsEdit(true);
                titleInput.current.focus();
            } else {
                setIsEdit(false);
                setSaveStatus(0)
            }
        }

    }, [props.note.openedNote.id])

    const handleChange = e => {
        setSaveStatus(1)
    }

    const handleTitleChange = e => {
        setTitle(e.target.value);
        setSaveStatus(1)
    }

    const saveNote = (type: string, text: string) => {
        if (saveStatus == 0) {
            return;
        }
        let noteToSave = { ...props.note.openedNote }

        setSaveStatus(2)
        noteToSave.name = title
        noteToSave.text = text

        let method
        if (noteToSave.id) {
            if (type == 'title') {
                method = 'note/updateNoteTitle'
            } else {
                method = 'note/updateNoteText'
                noteToSave.text = text
            }
        } else {
            method = 'note/addNote'
        }

        props.dispatch({
            type: method,
            payload: noteToSave
        }).then(res => {
            if (res.success) {
                setSaveStatus(0)
                if (!noteToSave.id) {//新增
                    const { openedNotes } = props.note;
                    console.log("1631");
                    props.dispatch({ type: 'note/refreshOpenedNote', payload: res.result })
                    props.dispatch({ type: 'note/refreshOpenedNotes', payload: [res.result, ...openedNotes] })
                }
            } else {
                setSaveStatus(1)
            }
        })


    }

    const handleBlur = (e, type) => {
        if (type == 'title' || !e.relatedTarget || e.relatedTarget.getAttribute('group') != group) {
            saveNote(type)
        }

    }

    const handleChangeFav = () => {
        const { openedNote } = props.note;
        props.dispatch({
            type: 'note/editFav',
            payload: { noteId: openedNote.id, isFav: !openedNote.fav },
        })
    }

    const goBack = () => {
        props.dispatch({
            type: 'note/refreshShowMenu',
            payload: true,
        })
    }

    const getTitleBtn = () => {
        <Button type='text'><ProfileOutlined /></Button>
        const btns = [];
        const { openedNote } = props.note;
        if (openedNote) {
            if (props.note.openedNote.fav) {
                btns.push(<Button key="noFav" onClick={handleChangeFav} type='text'><StarFilled className={styles.fav} /></Button>)
            } else {
                btns.push(<Button key="fav" onClick={handleChangeFav} type='text'><StarOutlined /></Button>)
            }

            if (isEdit) {
                btns.push(<Button key="edit" onClick={() => {
                    setIsEdit(false);
                }} type='text'><EyeOutlined /></Button>)

            } else {
                btns.push(<Button key="view" type='text' onClick={() => {
                    setIsEdit(true)
                }} ><EditOutlined /></Button>)
            }
            btns.push(statusIcons[saveStatus])
            return btns;
        }
    }


    const togglerMenu = [
        { icon: '&#xe88c;', type: 3 },
        { icon: '&#xe8bf;', type: 2 },
        { icon: '&#xe88e;', type: 1 }]


    const render = function () {
        const { isMobile } = props;
        const { openedNote } = props.note;

        const { menuType = 3 } = history.location.query;


        return (
            <div className={`${styles.main} ${isMobile ? styles.isMobile : ""}`}>
                {isMobile ?
                    <div className={styles.toolbar}>
                        <Button shape='circle' onClick={goBack}><span className='iconfont'>&#xe7c3;</span></Button>
                        {/* <Dropdown.Button overlay={menu1}>Actions</Dropdown.Button> */}
                        <div className={styles.buttons}>{getTitleBtn()?.map(i => i)}</div>
                    </div>
                    : ""
                }
                {!lodash.isEmpty(openedNote) ? <>
                    <div className={styles.title}>
                        {isMobile ? "" :
                            <Button type='text' onClick={() => setShowToc(!showToc)} disabled={isEdit}><span className='iconfont'>&#xe7e3;</span></Button>
                        }
                        <Input maxLength={100} ref={titleInput} value={title} onBlur={e => handleBlur(e, 'title')} onInput={handleTitleChange}></Input>
                        {isMobile ? "" : <div className={styles.buttons}>{getTitleBtn()?.map(i => i)}</div>}
                    </div>
                    <div className={styles.content}>
                        <MarkDown {...props} handleChange={handleChange} showToc={showToc} setShowToc={setShowToc} isEdit={isEdit} saveContent={(text: string) => saveNote('content', text)}></MarkDown>
                    </div></> : <div className={styles.empty}><InboxOutlined /></div>}
            </div>
        );
    };
    return render();
});

export default HocMedia(connect(({ note, loading }: { note: NoteModelState, loading }) =>
    ({ note, loading }))(Content));
