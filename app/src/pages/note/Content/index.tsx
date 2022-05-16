import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import { Tabs, Input, Menu, Dropdown, Button } from 'antd';
import { ExclamationCircleTwoTone, CheckCircleTwoTone, LoadingOutlined, EyeOutlined, EditOutlined, StarOutlined, StarFilled, CloseCircleOutlined, ProfileOutlined } from '@ant-design/icons';
import styles from './style.less';
import { connect } from 'umi';
import { guid } from '@/utils/utils'
import MarkDownIt from './MarkDown'
import 'font-awesome/css/font-awesome.min.css';


const { TabPane } = Tabs;

let statusIcons = {
    '0': <CheckCircleTwoTone twoToneColor="#52c41a" />,
    '1': <ExclamationCircleTwoTone twoToneColor='#f1c40f' />,
    '2': <LoadingOutlined />
}

const group = 'group';

const Content = React.forwardRef((props, ref) => {

    const titleInput = useRef();
    const [saveStatus, setSaveStatus] = useState<Number>(0);//0:已保存 1:未保存 2:正在保存
    const [displayIndex, setDisplayIndex] = useState<number>(-1);

    const [title, setTitle] = useState<String>("");

    const [closeMenuVisible, setCloseMenuVisible] = useState<boolean>(false);

    const [showToc, setShowToc] = useState<boolean>(false);

    useEffect(() => {
        setDisplayIndex(0)
        setTitle(props.note.openedNote.name)
    }, [props.note.openedNote])

    useImperativeHandle(ref, () => ({
        handleAddNote: (parentId: string) => {
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

    const getTitleBtn = () => {
        <Button type='text'><ProfileOutlined /></Button>
        const btns = [];
        if (props.note.openedNote.id) {
            if (props.note.openedNote.fav) {
                btns.push(<Button onClick={handleChangeFav} type='text'><StarFilled className={styles.fav} /></Button>)
            } else {
                btns.push(<Button onClick={handleChangeFav} type='text'><StarOutlined /></Button>)
            }
            if (!displayIndex) {
                btns.push(<Button onClick={() => setDisplayIndex(1)} type='text'><EditOutlined /></Button>)
            } else {
                btns.push(<Button type='text' onClick={() => {
                    setDisplayIndex(0)
                }} ><EyeOutlined /></Button>)
            }
            btns.push(statusIcons[saveStatus])
            return btns;
        }
    }


    const menu = (
        <Menu onClick={e => closeNotes(e.key === '1' ? false : true)}>
            <Menu.Item key="1">关闭其他</Menu.Item>
            <Menu.Item key="2">关闭所有</Menu.Item>
        </Menu>
    );

    const togglerMenu = [
        { icon: '&#xe88c;', name: "three" },
        { icon: '&#xe8bf;', name: "two" },
        { icon: '&#xe88e;', name: "one" }]

    const render = function () {
        const { openedNote = {}, openedNotes } = props.note;
        const { menuStyle, setMenuStyle } = props;
        const loading = props.loading.effects["noteFavorite/editOne"] || props.loading.effects["note/openNote"] || false;
        return (
            // <Spin spinning={loading} wrapperClassName={styles.main} >
            <div className={styles.main}>
                <div className={styles.tabPane}>
                    {/* <div className={styles.btn} onClick={toggleShowMenu}>{showMenu ? <FullscreenOutlined /> : <FullscreenExitOutlined />}</div> */}
                    {/* <div className={styles.btn} >    <Switch
                        checkedChildren={<span className="iconfont">&#xe88c;</span>}
                        unCheckedChildren={<span className='fa fa-expand'></span>}
                        defaultChecked
                    /></div> */}
                    <div className={styles.btn} >
                        <div className={styles.toggler}>
                            {togglerMenu.map(item => <span key={item.name}
                                className={`iconfont ${menuStyle == item.name ? styles.active : ""}`}
                                dangerouslySetInnerHTML={{ __html: item.icon }} onClick={() => setMenuStyle(item.name)}></span>)}
                        </div>
                    </div>
                    <div className={styles.tab}>
                        <Tabs
                            hideAdd
                            onTabClick={handleActiveNote}
                            activeKey={openedNote.id}
                            type="editable-card"
                            onEdit={handleRemoveTab}
                        >
                            {openedNotes.map(pane => (
                                <TabPane tab={pane.name} key={pane.id}>
                                </TabPane>
                            ))}
                        </Tabs>
                    </div>
                    <div className={styles.btn} >
                        <Dropdown
                            overlay={menu}
                            onVisibleChange={e => { setCloseMenuVisible(e) }}
                            visible={closeMenuVisible}
                        >
                            <div className={styles.closeBtn}>
                                <CloseCircleOutlined />
                            </div>
                        </Dropdown>
                    </div>
                </div>

                <div className={styles.title}>
                    <Button type='text' onClick={() => setShowToc(!showToc)} disabled={!!displayIndex}><span className='iconfont'>&#xe7e3;</span></Button>
                    <Input maxLength={100} ref={titleInput} value={title} onBlur={e => handleBlur(e, 'title')} onInput={handleTitleChange}></Input>
                    <div className={styles.buttons}>{getTitleBtn()?.map(i => i)}</div>
                </div>
                <div className={styles.content}>
                    <MarkDownIt handleChange={handleChange} showToc={showToc} setShowToc={setShowToc} displayIndex={displayIndex} saveContent={(text: string) => saveNote('content', text)}></MarkDownIt>
                </div>
            </div>
            // </Spin>
        );
    };
    return render();
});

export default connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu, loading }) =>
    ({ note, noteMenu, loading }), null, null, { forwardRef: true })(Content);
