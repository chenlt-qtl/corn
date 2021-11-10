import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import { Tabs, Input, Button, Divider, Spin } from 'antd';
import { ExclamationCircleTwoTone, CheckCircleTwoTone, LoadingOutlined, EyeOutlined, EditOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import styles from './index.less';
import { connect } from 'umi';
import { guid } from '@/utils/utils'
import MarkDownIt from './MarkDownIt'

const { TabPane } = Tabs;

let statusIcons = {
    '0': <CheckCircleTwoTone twoToneColor="#52c41a" />,
    '1': <ExclamationCircleTwoTone twoToneColor='#f1c40f' />, '2': <LoadingOutlined />
}

const group = 'group';

const Content = React.forwardRef((props, ref) => {

    const titleInput = useRef();
    const [saveStatus, setSaveStatus] = useState<Number>(0);//0:已保存 1:未保存 2:正在保存
    const [displayIndex, setDisplayIndex] = useState<number>(-1);

    const [title, setTitle] = useState<String>("");

    useEffect(() => {
        setDisplayIndex(0)
        setTitle(props.note.openedNote.name)
    }, [props.note.openedNote])

    useImperativeHandle(ref, () => ({
        handleAddNote: (parentId: string) => {
            console.log('handleAddNote');
            const id = guid();
            setSaveStatus(1)
            const note = { name: '新文档', parentId, id };
            setTitle('新文档');
            props.dispatch({
                type: 'note/refreshShowNote',
                payload: note,
            })//显示笔记
        }
    }));


    const handleChange = e => {
        setSaveStatus(1)
    }

    const handleTitleChange = e => {
        setTitle(e.target.value);
        setSaveStatus(1)
    }


    const handleActiveNote = (id) => {

        const { openedNote } = props.note;
        if (openedNote.id != id) {
            props.dispatch({
                type: 'note/openNote',
                payload: id,
            })

            setDisplayIndex(0)
            setSaveStatus(0)
        }
    }

    const closeNotes = (allClose: boolean) => {
        const openedNotes = [];
        const { openedNote } = props.note;
        if (!allClose) {

            if (openedNote && openedNote.name) {
                openedNotes.push(props.note.openedNote)
            }
        } else {
            props.dispatch({
                type: 'note/refreshOpenedNote',
                payload: {},
            })
        }
        props.dispatch({
            type: 'note/refreshOpenedNotes',
            payload: openedNotes,
        })
    }

    const saveNote = (type: string, text: string) => {
        if (saveStatus == 0) {
            return;
        }

        let noteToSave = { ...props.note.openedNote }


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
            payload: { ...noteToSave, id: noteToSave.id == "new" ? null : noteToSave.id }
        }).then((res) => {
            if (res) {
                if (props.note.openedNote.id == noteToSave.id) {
                    setSaveStatus(0)
                }
            }
        })


    }

    const handleBlur = (e, type) => {
        if (type == 'title') {
            saveNote(type)
        } else if (!e.relatedTarget || e.relatedTarget.getAttribute('group') != group) {
            saveNote(type)
        }

    }

    const handleRemoveTab = id => {

        props.dispatch({
            type: 'note/closeNote',
            payload: id,
        })

        setDisplayIndex(0)
        setSaveStatus(0)
    }

    const handleChangeFav = () => {
        const { openedNote } = props.note;
        props.dispatch({
            type: 'noteFavorite/editOne',
            payload: { noteId: openedNote.id, isFav: !openedNote.fav },
        })
    }

    const render = function () {
        const { openedNote = {}, openedNotes } = props.note;
        const loading = props.loading.effects["noteFavorite/editOne"] || props.loading.effects["note/openNote"] || false;
        return (
            <div className={styles.main}>
                <div className={styles.top}>
                    <div className={styles.block}></div>
                    <div className={styles.tab}>
                        <Tabs
                            hideAdd
                            onTabClick={handleActiveNote}
                            activeKey={openedNote.id}
                            type="editable-card"
                            onEdit={handleRemoveTab}
                            tabBarExtraContent={<>
                                <Button onClick={() => { closeNotes(false) }} type="link">关闭其他</Button>
                                <Divider type="vertical" />
                                <Button onClick={() => { closeNotes(true) }} type="link">关闭所有</Button>
                            </>}
                        >
                            {openedNotes.map(pane => (
                                <TabPane tab={pane.name} key={pane.id}>
                                </TabPane>
                            ))}
                        </Tabs>

                    </div>
                    <div className={styles.block}></div>
                </div>

                <Spin spinning={loading}>
                    <div className={styles.title}>
                        <Input maxLength={100} ref={titleInput} value={title} onBlur={e => handleBlur(e, 'title')} onInput={handleTitleChange}></Input>
                        {openedNote.id ? <div className={styles.buttons}>{openedNote.fav ? <StarFilled className={styles.fav} onClick={handleChangeFav} /> : <StarOutlined onClick={handleChangeFav} />}{displayIndex == 0 ? <EditOutlined onClick={() => setDisplayIndex(1)} /> :
                            <EyeOutlined onClick={() => {
                                setDisplayIndex(0)
                            }} />}{statusIcons[saveStatus]}</div> : ""}
                    </div>
                </Spin>
                <div className={styles.content}>
                    <MarkDownIt handleChange={handleChange} displayIndex={displayIndex} saveContent={(text: string) => saveNote('content', text)}></MarkDownIt>
                </div>
            </div>
        );
    };
    return render();
});

export default connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu, loading }) =>
    ({ note, noteMenu, loading }), null, null, { forwardRef: true })(Content);
