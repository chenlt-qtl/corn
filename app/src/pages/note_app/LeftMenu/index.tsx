import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Button, Divider, Dropdown, Menu, Modal, notification } from 'antd';
import { ExclamationCircleOutlined, LeftOutlined, RightOutlined, StarFilled, HistoryOutlined, DownOutlined, WalletOutlined, ReadOutlined } from '@ant-design/icons';
import styles from './style.less';
import { connect } from 'umi';
import TopMenu from '../TopMenu';

const { confirm } = Modal;

const fixedMenu = [{ id: 'open', name: '最近打开', icon: <HistoryOutlined /> },
{ id: 'favorate', name: '收藏夹', icon: <StarFilled className={styles.favorate} /> }];

const iconStyle = { 'fontSize': '10px' }


const LeftMenu = React.forwardRef((props, ref) => {

    const [menuHidden, setMenuHidden] = useState < boolean > (false);

    const [activeMenu1Id, setActiveMenu1Id] = useState < string > ('');
    const [activeMenu2Id, setActiveMenu2Id] = useState < string > ('');
    const [activeMenu3Id, setActiveMenu3Id] = useState < string > ('');

    const [title2, setTitle2] = useState < string > ('');
    const [title3, setTitle3] = useState < string > ('');

    const [closeMenus, setCloseMenus] = useState < string[] > ([]);

    useImperativeHandle(ref, () => ({
        refreshParentMenu: (note: object,active:boolean) => {
            const {id,level} = transportNote(note)
            refreshMenu(level)
            if(active){
                if(level==1){
                    setActiveMenu1Id(id)
                }else if(level==2){
                    setActiveMenu2Id(id)
                }else{
                    setActiveMenu3Id(id)
                }
            }
        }
    }), []);

    useEffect(() => {
        refreshMenu(2)
    }, [activeMenu1Id])

    useEffect(() => {
        refreshMenu(3)
    }, [activeMenu2Id])

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
        const { id, title, level } = transportNote(note);

        props.onShowNote(id)//显示笔记

        if (level == 1) {
            setTitle2(title)
            setActiveMenu1Id(id);
        } else if (level == 2) {
            setTitle3(title)
            setActiveMenu2Id(id);
        } else {
            setActiveMenu3Id(id);
        }
    }

    const handleAddNote = (pid: string) => {
        if (pid == activeMenu1Id) {
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
        const level = getLevel(note.parentIds);
        return { id, title, level }
    }

    const handleDropDownClick = ({ key }, note: object) => {
        const { id, title, level } = transportNote(note);
        if (key == 'add') {

        } else if (key == 'del') {
            confirm({
                title: `确定要删除 ${title}?`,
                icon: <ExclamationCircleOutlined />,
                onOk() {
                    console.log('delete ', id);
                    props.dispatch({
                        type: 'note/deleteNote',
                        payload: id,
                    }).then(() => {
                        notification["info"]({
                            message: '删除成功',
                        });
                        refreshMenu(level)
                    })
                }
            });

        }
    }

    const getLevel = (parentIds: string) => {
        if (parentIds) {
            const idArr = parentIds.split('/').length;
            const level = idArr - 1;
            if (level > 0) {
                return level > 3 ? 3 : level;
            }
        }
        notification["warning"]({
            message: '数据有误,请联系管理员',
        });
    }

    const refreshMenu = (type: number) => {
        let method = 'note/queryChildren';
        let id;

        if (type == 1) {
            id = props.noteMenu.activeTopId
        } else if (type == 2) {
            id = activeMenu1Id
        } else if (type == 3) {
            method = 'note/queryTabTree'
            id = activeMenu2Id
        }

        console.log(type);
        console.log(id);
        console.log(props.noteMenu.activeTopId);
        if (id == "favorate") {
            method = 'noteFavorite/query'
        }
        if (id == "open") {
            method = 'openNotes/queryOpenNote'
        }
        props.dispatch({
            type: method,
            payload: id,
        }).then((res) => {
            if (res) {
                const { result } = res;
                props.dispatch({
                    type: `noteMenu/refreshMenu${type}`,
                    payload: result,
                })
            }
        });

    }

    const getMenu3 = (items: []) => {
        if (items) {
            return <ul>
                {items.map(item => {
                    const level = item.parentIds.split('/').length - 4;
                    return <li key={item.key}>
                        <Dropdown overlay={getRightMenu(item)} trigger={['contextMenu']}>
                            <div className={`${styles.menu1Item} ${activeMenu3Id == item.key ? styles.active : ''}`}>
                                <div className={styles.label} onClick={() => handleMenuSelect(item)} style={{ 'paddingLeft': `${level > 0 ? level * 8 : 0}px` }}>
                                    {item.leaf ? '' :
                                        (closeMenus.includes(item.key) ? <RightOutlined style={iconStyle} onClick={() => handleDisplayMenu(true, item.key)} /> :
                                            <DownOutlined style={iconStyle} onClick={() => handleDisplayMenu(false, item.key)} />)}
                                        &nbsp;&nbsp;{item.title}
                                </div>
                            </div>
                        </Dropdown>

                        {(item.leaf || closeMenus.includes(item.key)) ? '' : getMenu3(item.children)}
                    </li>
                })
                }
            </ul>
        }
    }

    const getMenu1 = (items: object[], addBtn: boolean) => {
        return items.map(item => (
            <li key={item.id}>
                <Dropdown overlay={getRightMenu(item)} trigger={['contextMenu']} >
                    <div className={`${styles.menu1Item} ${activeMenu1Id == item.id ? styles.active : ''}`}>
                        <div className={styles.label} onClick={() => handleMenuSelect(item)}>
                            {activeMenu1Id == item.id ? <ReadOutlined></ReadOutlined> :
                                (item.icon ? item.icon : <WalletOutlined />)}&nbsp;&nbsp;{item.name}
                        </div>
                    </div>
                </Dropdown>
            </li>))
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
                                {getMenu1(fixedMenu, false)}
                                <Divider></Divider>
                                {getMenu1(menu1Item, true)}
                            </ul>
                            <div className={styles.button}>
                                <Button block onClick={() => handleAddNote(props.noteMenu.activeTopId)}>增加</Button>
                            </div>
                        </div>
                        {menu2Item.length > 0 ?
                            <div className={styles.menuContent}>
                                <div className={styles.title}>{title2}</div>
                                <ul>
                                    {menu2Item.map(item => (
                                        <li key={item.id}>
                                            <Dropdown overlay={getRightMenu(item)} trigger={['contextMenu']} >
                                                <div className={`${styles.menu1Item} ${activeMenu2Id == item.id ? styles.active : ''}`}>
                                                    <div className={styles.label} onClick={() => handleMenuSelect(item)}>
                                                        <div style={{ flexShrink: 0 }}>{item.name}</div><div className={styles.parents}>{item.parents}</div>
                                                    </div>
                                                </div>
                                            </Dropdown>
                                        </li>))}
                                </ul>
                                <div className={styles.button}>
                                    <Button block onClick={() => handleAddNote(activeMenu1Id)}>增加</Button>
                                </div>
                            </div> : ''}
                        {menu3Item.length > 0 ?
                            <div className={styles.menuContent}>
                                <div className={styles.title}>{title3}</div>
                                {getMenu3(menu3Item)}
                                <div className={styles.button}>
                                    <Button block onClick={() => handleAddNote(activeMenu2Id)}>增加</Button>
                                </div>
                            </div> : ''}
                    </div>
                </div>
            </>
        );
    };
    return render();
});

export default connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu:NoteState, loading }) => ({ note, noteMenu, loading }) , null, null, { forwardRef: true })(LeftMenu);
