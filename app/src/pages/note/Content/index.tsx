import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import { Tabs, Input, Menu, Dropdown, Button } from 'antd';
import { ExclamationCircleTwoTone, CheckCircleTwoTone, LoadingOutlined, EyeOutlined, EditOutlined, StarOutlined, StarFilled, CloseCircleOutlined, ProfileOutlined, InboxOutlined } from '@ant-design/icons';
import styles from './style.less';
import { connect, Link, history } from 'umi';
import { guid } from '@/utils/utils'
import MarkDown from './MarkDown'
import 'font-awesome/css/font-awesome.min.css';
import HocMedia from "@/components/HocMedia";
import { queryNoteById } from '@/services/note'
import { NoteItem } from '@/data/note';

const { TabPane } = Tabs;

let statusIcons = {
    '0': <CheckCircleTwoTone key="ok" twoToneColor="#52c41a" />,
    '1': <ExclamationCircleTwoTone key="unsave" twoToneColor='#f1c40f' />,
    '2': <LoadingOutlined key="saving" />
}

const group = 'group';

const Content = React.forwardRef((props, ref) => {

    const titleInput = useRef();
    const [saveStatus, setSaveStatus] = useState<Number>(0);//0:已保存 1:未保存 2:正在保存
    const [displayIndex, setDisplayIndex] = useState<number>(-1);

    const [title, setTitle] = useState<String>("");

    const [closeMenuVisible, setCloseMenuVisible] = useState<boolean>(false);

    const [showToc, setShowToc] = useState<boolean>(true);

    const [note, setNote] = useState<NoteItem>({});

    const [loading, setLoading] = useState<Boolean>(false);

    useEffect(() => {
        if (displayIndex) {//编辑
            setShowToc(false)
        } else {//view
            setShowToc(true)
        }
    }, [displayIndex])

    useEffect(() => {
        if (displayIndex) {//编辑
            setShowToc(false)
        } else {//view
            setShowToc(true)
        }
    }, [displayIndex])

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

    const closeNotes = (key: string) => {

        let newOpenedNotes = {};
        const { openedNote, openedNotes } = props.note;

        if (key == "1") {//关闭其他
            if (openedNote && openedNotes[openedNote.id]) {
                newOpenedNotes = { [openedNote.id]: openedNote }
            }
        } else if (key == "2") {//关闭所有
            props.dispatch({
                type: 'note/refreshOpenedNote',
                payload: {}
            })
        } else {//关闭单个
            newOpenedNotes = { ...openedNotes };
            delete newOpenedNotes[key]
            if (openedNote && openedNote.id == key) {
                props.dispatch({
                    type: 'note/refreshOpenedNote',
                    payload: Object.values(newOpenedNotes)[0] || {}
                })
                setDisplayIndex(0)
                setSaveStatus(0)
            }
        }

        props.dispatch({
            type: 'note/refreshOpenedNotes',
            payload: newOpenedNotes,
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
            payload: noteToSave
        }).then(res => {
            if (type == "title") {
                // props.dispatch({
                //     type: 'note/refreshListParam',
                //     payload: { ...props.note.listParam },
                // })
            }
            if (res) {
                if (props.note.openedNote.id == noteToSave.id) {
                    setSaveStatus(0)
                }
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
        if (openedNote.id) {
            if (openedNote.fav) {
                btns.push(<Button key="noFav" onClick={handleChangeFav} type='text'><StarFilled className={styles.fav} /></Button>)
            } else {
                btns.push(<Button key="fav" onClick={handleChangeFav} type='text'><StarOutlined /></Button>)
            }
            if (!displayIndex) {
                btns.push(<Button key="view" onClick={() => {
                    setDisplayIndex(1);
                }} type='text'><EditOutlined /></Button>)
            } else {
                btns.push(<Button key="edit" type='text' onClick={() => {
                    setDisplayIndex(0)
                }} ><EyeOutlined /></Button>)
            }
            btns.push(statusIcons[saveStatus])
            return btns;
        }
    }


    const menu = (
        <Menu onClick={e => closeNotes(e.key)}>
            <Menu.Item key="1">关闭其他</Menu.Item>
            <Menu.Item key="2">关闭所有</Menu.Item>
        </Menu>
    );

    const togglerMenu = [
        { icon: '&#xe88c;', type: 3 },
        { icon: '&#xe8bf;', type: 2 },
        { icon: '&#xe88e;', type: 1 }]


    const render = function () {
        const { isMobile } = props;
        const { openedNotes, openedNote } = props.note;
        const { menuType = 3 } = history.location.query;

        return (
            <div className={`${styles.main} ${isMobile ? styles.isMobile : ""}`}>
                {isMobile ?
                    <div className={styles.toolbar}>
                        <Button shape='circle' onClick={goBack}><span className='iconfont'>&#xe7c3;</span></Button>
                        {/* <Dropdown.Button overlay={menu1}>Actions</Dropdown.Button> */}
                        <div className={styles.buttons}>{getTitleBtn()?.map(i => i)}</div>
                    </div>
                    :
                    (<div className={styles.tabPane}>
                        <div className={styles.btn} >
                            <div className={styles.toggler}>
                                {togglerMenu.map(item => <Link key={item.type} to={{ pathname: history.location.pathname, search: "menuType=" + item.type, state: { abc: item.type } }}>
                                    <span className={`iconfont ${menuType == item.type ? styles.active : ""}`}
                                        dangerouslySetInnerHTML={{ __html: item.icon }}></span></Link>)}
                            </div>
                        </div>
                        <div className={styles.tab}>
                            <Tabs
                                hideAdd
                                onTabClick={handleActiveNote}
                                activeKey={openedNote.id}
                                type="editable-card"
                                onEdit={closeNotes}
                            >
                                {Object.keys(openedNotes).map(key => (
                                    <TabPane tab={openedNotes[key].name} key={openedNotes[key].id}>
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
                    </div>)}
                {openedNote.id ? <>
                    <div className={styles.title}>
                        {isMobile ? "" : <Button type='text' onClick={() => setShowToc(!showToc)} disabled={!!displayIndex}><span className='iconfont'>&#xe7e3;</span></Button>}
                        <Input maxLength={100} ref={titleInput} value={title} onBlur={e => handleBlur(e, 'title')} onInput={handleTitleChange}></Input>
                        {isMobile ? "" : <div className={styles.buttons}>{getTitleBtn()?.map(i => i)}</div>}
                    </div>
                    <div className={styles.content}>
                        <MarkDown handleChange={handleChange} showToc={showToc} setShowToc={setShowToc} displayIndex={displayIndex} saveContent={(text: string) => saveNote('content', text)}></MarkDown>
                    </div></> : <div className={styles.empty}><InboxOutlined /></div>}
            </div>
            // </Spin>
        );
    };
    return render();
});

export default HocMedia(connect(({ note, loading }: { note: NoteModelState, loading }) =>
    ({ note, loading }), null, null, { forwardRef: true })(Content));
