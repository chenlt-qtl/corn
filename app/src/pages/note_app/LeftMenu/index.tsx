import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Button, Divider, Dropdown, Menu, Modal, notification } from 'antd';
import { ExclamationCircleOutlined, LeftOutlined, RightOutlined, StarFilled, HistoryOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './style.less';
import { connect } from 'umi';
import TopMenu from '../TopMenu';
import { getLevel } from '@/utils/utils'

const { confirm } = Modal;

const fixedMenu = [{ id: 'open', name: '最近打开', icon: <HistoryOutlined /> },
{ id: 'favorate', name: '收藏夹', icon: <StarFilled className={styles.favorate} /> }];

const iconStyle = { 'fontSize': '10px' }


const LeftMenu: React.FC = (props, ref) => {

    const [menuHidden, setMenuHidden] = useState < boolean > (false);

    const [activeMenu3Id, setActiveMenu3Id] = useState < string > ('');

    const [title2, setTitle2] = useState < string > ('');
    const [title3, setTitle3] = useState < string > ('');

    const [closeMenus, setCloseMenus] = useState < string[] > ([]);


    useEffect(() => {
        props.refreshMenu(2)
    }, [props.noteMenu.activeMenu1Id])

    useEffect(() => {
        props.refreshMenu(3)
    }, [props.noteMenu.activeMenu2Id])

    const getRightMenu = (param: object) => {
        if (param.id == "favorate" || param.id == "open") {
            return <></>;
        }
        return (<Menu onClick={e => handleDropDownClick(e, param)}>
            <Menu.Item key="add">增加子笔记</Menu.Item>
            <Menu.Item key="del">删除</Menu.Item>

        </Menu>)
    }

    const handleDisplayMenu = (isOpen: boolean, id: string) => {
        if (isOpen) {
            setCloseMenus(closeMenus.filter(item => item != id))
        } else {
            setCloseMenus([id, ...closeMenus])
        }
    }

    const handleMenuSelect = (note: object) => {
        console.log(2);
        const { id, title, level } = transportNote(note);

        props.dispatch({
            type: 'note/queryNote',
            payload: id,
        })//显示笔记

        if (level == 1) {
            setTitle2(title)
            props.dispatch({
                type: 'noteMenu/refreshActiveMenu1Id',
                payload: id,
            })
        } else if (level == 2) {
            setTitle3(title)
            props.dispatch({
                type: 'noteMenu/refreshActiveMenu2Id',
                payload: id,
            })
        } else {
            setActiveMenu3Id(id);
        }
    }

    const handleAddNote = (pid: string) => {
        if (pid == props.noteMenu.activeMenu1Id) {
            props.dispatch({
                type: 'noteMenu/refreshMenu3',
                payload: [],
            })
        } else if (pid == props.noteMenu.activeTopId) {
            props.dispatch({
                type: 'noteMenu/refreshMenu2',
                payload: [],
            })
            props.dispatch({
                type: 'noteMenu/refreshMenu3',
                payload: [],
            })
        }
        props.onAddNote(pid)
    }

    const transportNote = (note: object) => {
        const id = note.key || note.id;
        const title = note.title || note.name;
        let level;
        if (id == "favorate" || id == "open") {
            level = 1;
        } else {
            level = getLevel(note.parentIds);
        }
        return { ...note, id, title, level }
    }

    const handleDropDownClick = ({ key }, note: object) => {
        const { id, title, level } = transportNote(note);
        if (key == 'add') {

        } else if (key == 'del') {
            confirm({
                title: `确定要删除 ${title}?`,
                icon: <ExclamationCircleOutlined />,
                onOk() {
                    props.dispatch({
                        type: 'note/deleteNote',
                        payload: id,
                    }).then(() => {
                        notification["info"]({
                            message: '删除成功',
                        });
                        props.refreshMenu(level)
                    })
                }
            });

        }
    }

    const getIcon = (item: object) => {
        const { level, id } = item
        if (level >= 3) {
            if (!item.leaf) {
                if (closeMenus.includes(id)) {
                    return <RightOutlined style={iconStyle} onClick={() => handleDisplayMenu(true, id)} />
                } else {
                    return <DownOutlined style={iconStyle} onClick={() => handleDisplayMenu(false, id)} />
                }
            }
        } else {
            if (item.icon) {
                return item.icon;
            }
        }
    }

    const getMenu = (items: [], activeId: string) => {

        if (items) {
            return <ul>{items.map(item => {
                const note = transportNote(item);
                const { id, title, level = 0 } = note;
                const isLevel3 = ((level || 0) >= 3)
                return <li key={id}>
                    <Dropdown overlay={getRightMenu(item)} trigger={['contextMenu']}>
                        <div className={`${styles.menu1Item} ${activeId == id ? styles.active : ''}`}>
                            <div className={styles.label} onClick={() => handleMenuSelect(item)} style={{ 'paddingLeft': `${isLevel3 ? (level - 3) * 8 + 12 : 12}px` }}>
                                {getIcon(note)}
                                &nbsp;&nbsp;{title}
                                {(level <= 3 && id != 'open' && id != 'favorate') ? <span className={styles.addChild} onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    console.log(1);
                                    handleAddNote(id);
                                }}>
                                    <PlusOutlined title='增加子笔记' />
                                </span> : ''}
                            </div>
                        </div>
                    </Dropdown>

                    {(!item.children || closeMenus.includes(id)) ? '' : getMenu(item.children, activeId)}
                </li>

            })}</ul>

        }
    }

    const render = function () {
        const { menu1Item, menu2Item, menu3Item } = props.noteMenu;
        return (
            <>
                <div className={`${styles.content} ${menuHidden ? styles.hidden : styles.show}`}>
                    <div className={styles.fold}>
                        <Button type="primary" size="small" onClick={() => setMenuHidden(!menuHidden)} shape="circle" icon={menuHidden ? <RightOutlined /> : <LeftOutlined />} />
                    </div>
                    <div className={styles.menu}>
                        <TopMenu></TopMenu>
                        <div className={styles.menuContent}>
                            <div className={styles.title}>{props.noteMenu.title1}</div>
                            <ul>
                                {getMenu(fixedMenu, props.noteMenu.activeMenu1Id)}
                                <Divider></Divider>
                                {getMenu(menu1Item, props.noteMenu.activeMenu1Id)}
                            </ul>
                            <div className={styles.button}>
                                <Button block onClick={() => handleAddNote(props.noteMenu.activeTopId)}>增加</Button>
                            </div>
                        </div>
                        {menu2Item.length > 0 ?
                            <div className={styles.menuContent}>
                                <div className={styles.title}>{title2}</div>
                                {getMenu(menu2Item, props.noteMenu.activeMenu2Id)}
                                <div className={styles.button}>
                                    <Button block onClick={() => handleAddNote(props.noteMenu.activeMenu1Id)}>增加</Button>
                                </div>
                            </div> : ''}
                        {menu3Item.length > 0 ?
                            <div className={styles.menuContent}>
                                <div className={styles.title}>{title3}</div>
                                {getMenu(menu3Item, activeMenu3Id)}
                                <div className={styles.button}>
                                    <Button block onClick={() => handleAddNote(props.noteMenu.activeMenu2Id)}>增加</Button>
                                </div>
                            </div> : ''}
                    </div>
                </div>
            </>
        );
    };
    return render();
};

export default connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu, loading }) => ({ note, noteMenu, loading }))(LeftMenu);
