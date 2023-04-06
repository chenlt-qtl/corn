import React, { useState, useRef, useEffect } from 'react';
import { Tabs, Input, Menu, Dropdown, Button } from 'antd';
import { ExclamationCircleTwoTone, CheckCircleTwoTone, LoadingOutlined, EyeOutlined, EditOutlined, StarOutlined, StarFilled, CloseCircleOutlined, ProfileOutlined, InboxOutlined } from '@ant-design/icons';
import styles from './style.less';
import { connect, Link, history } from 'umi';
import MarkDown from './MarkDown'
import 'font-awesome/css/font-awesome.min.css';
import HocMedia from "@/components/HocMedia";
import { changeUrl } from '../utils'

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

    useEffect(() => {
        if (displayIndex) {//编辑
            setShowToc(false)
        } else {//view
            setShowToc(true)
        }
    }, [displayIndex])

    const handleChange = e => {
        setSaveStatus(1)
    }

    const handleTitleChange = e => {
        setTitle(e.target.value);
        setSaveStatus(1)
    }


    const handleActiveNote = (id) => {
        changeUrl(props, "id", id)
    }

    const closeNotes = (key: string) => {

        const { id } = props.match.params;
        const { openedNotes } = props.note;

        if (key == "1") {//关闭其他
            if (openedNotes[id]) {
                setOpenedNotes({ [id]: { ...openedNotes[id], index: 0 } })
            }
        } else if (key == "2") {//关闭所有
            setOpenedNotes({})
            changeUrl(props, "id", "")
        } else {//关闭单个
            const newOpenedNotes = { ...openedNotes };
            delete newOpenedNotes[key]
            setOpenedNotes(newOpenedNotes)

            if (id == key) {
                changeUrl(props, "id", Object.keys(newOpenedNotes)[0] || "")
                setDisplayIndex(0)
                setSaveStatus(0)
            }
        }
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
            const { id } = props.match.params;
            if (res) {
                if (id == noteToSave.id) {
                    setSaveStatus(0)
                }
            }
        })


    }

    const setOpenedNotes = notes => props.dispatch({
        type: 'note/refreshOpenedNotes',
        payload: notes
    })

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
        const { id } = props.match.params;
        if (id) {
            if (props.note.openedNote.fav) {
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
        const { openedNotes } = props.note;
        const { id } = props.match.params;

        const { menuType = 3 } = history.location.query;

        const tabData = Object.values(openedNotes).sort((a, b) => a.index > b.index);

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
                                activeKey={id}
                                type="editable-card"
                                onEdit={closeNotes}
                            >
                                {tabData.map(({ id, name }) => (
                                    <TabPane tab={name} key={id}>
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
                {id ? <>
                    <div className={styles.title}>
                        {isMobile ? "" : <Button type='text' onClick={() => setShowToc(!showToc)} disabled={!!displayIndex}><span className='iconfont'>&#xe7e3;</span></Button>}
                        <Input maxLength={100} ref={titleInput} value={title} onBlur={e => handleBlur(e, 'title')} onInput={handleTitleChange}></Input>
                        {isMobile ? "" : <div className={styles.buttons}>{getTitleBtn()?.map(i => i)}</div>}
                    </div>
                    <div className={styles.content}>
                        <MarkDown {...props} handleChange={handleChange} showToc={showToc} setShowToc={setShowToc} displayIndex={displayIndex} saveContent={(text: string) => saveNote('content', text)}></MarkDown>
                    </div></> : <div className={styles.empty}><InboxOutlined /></div>}
            </div>
        );
    };
    return render();
});

export default HocMedia(connect(({ note, loading }: { note: NoteModelState, loading }) =>
    ({ note, loading }))(Content));
