import React, { useState } from 'react';
import { Button, Divider } from 'antd';
import { PlusCircleTwoTone, LeftOutlined, RightOutlined, StarFilled, HistoryOutlined, DownOutlined, WalletOutlined, ReadOutlined } from '@ant-design/icons';
import styles from './style.less';
import { connect } from 'umi';
import TopMenu from '../TopMenu';

const fixedMenu = [{ id: 'open', name: '最近打开', icon: <HistoryOutlined /> },
{ id: 'favorate', name: '收藏夹', icon: <StarFilled className={styles.favorate} /> }];

const iconStyle = { 'fontSize': '10px' }

const Menu: React.FC<{}> = (props) => {

    const [menuHidden, setMenuHidden] = useState < boolean > (false);

    const [activeTopMenuId, setActiveTopMenuId] = useState < string > ('');
    const [activeMenu1Id, setActiveMenu1Id] = useState < string > ('');
    const [activeMenu2Id, setActiveMenu2Id] = useState < string > ('');
    const [activeMenu3Id, setActiveMenu3Id] = useState < string > ('');

    const [menuItem, setMenuItem] = useState < object[] > ([]);
    const [menu2Item, setMenu2Item] = useState < object[] > ([]);
    const [menu3Item, setMenu3Item] = useState < object[] > ([]);

    const [closeMenus, setCloseMenus] = useState < string[] > ([]);

    const handleTopMenuSelect = (id: string) => {
        setActiveTopMenuId(id)
        props.dispatch({
            type: 'note/queryChildren',
            payload: id,
        }).then((res) => {
            if (res) {
                const { result } = res;
                setMenuItem([...result]);
                setMenu2Item([]);
                setMenu3Item([]);
                props.onShowNote()
            }
        });
    }

    const handleDisplayMenu = (isOpen: boolean, id: string) => {
        if (isOpen) {
            setCloseMenus(closeMenus.filter(item => item != id))
        } else {
            setCloseMenus([id, ...closeMenus])
        }
    }

    const handleMenuSelect = (id: string, type: number) => {
        props.onShowNote(id)//显示笔记
        let method;

        if (type == 1) {
            setActiveMenu1Id(id);
            method = 'note/queryChildren';
        } else if (type == 2) {
            method = 'note/queryTabTree'
            setActiveMenu2Id(id);
        } else {
            setActiveMenu3Id(id);
        }

        if (type == 3) {
            return;
        }
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
                if (type == 1) {
                    setMenu2Item(result);
                    setMenu3Item([]);
                } else if (type == 2) {
                    setMenu3Item(result);
                }
            }
        });

    }

    const handleAddNote = (e, pid: string) => {
        props.onAddNote(pid)
        if (pid == activeMenu1Id) {
            setMenu3Item([]);
        } else if (pid == activeTopMenuId) {
            setMenu2Item([]);
            setMenu3Item([]);
        }
        e.preventDefault()
    }

    const getAddBtn = (pid: string) => {
        return <div onClick={e => handleAddNote(e, pid)} className={styles.addBtn}><PlusCircleTwoTone twoToneColor='#2ecc71' /></div>;
    }

    const getMenu = (items: []) => {
        if (items) {
            return <ul>
                {items.map(item => {
                    const level = item.parentIds.split('/').length - 4;
                    return <li key={item.key}>
                        <div className={`${styles.menuItem} ${activeMenu3Id == item.key ? styles.active : ''}`}>
                            <div className={styles.label} onClick={() => handleMenuSelect(item.key, 3)} style={{ 'paddingLeft': `${level > 0 ? level * 8 : 0}px` }}>
                                {item.leaf ? '' :
                                    (closeMenus.includes(item.key) ? <RightOutlined style={iconStyle} onClick={() => handleDisplayMenu(true, item.key)} /> :
                                        <DownOutlined style={iconStyle} onClick={() => handleDisplayMenu(false, item.key)} />)}
                                        &nbsp;&nbsp;{item.title}
                            </div>
                            {level == 0 ? getAddBtn(item.key) : ''}
                        </div>

                        {(item.leaf || closeMenus.includes(item.key)) ? '' : getMenu(item.children)}
                    </li>
                })
                }
            </ul>
        }
    }

    const getMenu1 = (items: object[], addBtn: boolean) => {
        return items.map(item => (
            <li key={item.id}                                    >
                <div className={`${styles.menuItem} ${activeMenu1Id == item.id ? styles.active : ''}`}>
                    <div className={styles.label} onClick={() => handleMenuSelect(item.id, 1)}>
                        {activeMenu1Id == item.id ? <ReadOutlined></ReadOutlined> :
                            (item.icon ? item.icon : <WalletOutlined />)}&nbsp;&nbsp;{item.name}
                    </div>
                    {addBtn ? getAddBtn(item.id) : ''}
                </div>
            </li>))
    }

    const render = function () {
        return (
            <div className={`${styles.menu} ${menuHidden ? styles.hidden : styles.show}`}>
                <div className={styles.fold}>
                    <Button type="primary" size="small" onClick={() => setMenuHidden(!menuHidden)} shape="circle" icon={menuHidden ? <RightOutlined /> : <LeftOutlined />} />
                </div>
                <div className={styles.item}>
                    <div><ul>
                        {getMenu1(fixedMenu, false)}
                        <Divider></Divider>
                        <li><TopMenu onMenuSelect={handleTopMenuSelect}></TopMenu></li>
                        <Divider></Divider>
                        <Button block onClick={() => handleAddNote(activeTopMenuId)}>
                            增加
                        </Button>
                        {getMenu1(menuItem, true)}
                    </ul></div>
                    {menu2Item.length > 0 ?
                        <div><ul>
                            {menu2Item.map(item => (
                                <li key={item.key}                                    >
                                    <div className={`${styles.menuItem} ${activeMenu2Id == item.id ? styles.active : ''}`}>
                                        <div className={styles.label} onClick={() => handleMenuSelect(item.id, 2)}>
                                            <div style={{ flexShrink: 0 }}>{item.name}</div><div className={styles.parents}>{item.parents}</div>
                                        </div>
                                        {getAddBtn(item.key)}
                                    </div>
                                </li>))}
                        </ul></div>
                        : ''}
                    {menu3Item.length > 0 ? <div>{getMenu(menu3Item)}</div> : ''}
                </div>

            </div>
        );
    };
    return render();
};

export default connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(Menu);
