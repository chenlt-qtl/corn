import React, { useState } from 'react';
import star from '@/assets/diamond.svg';
import styles from './style.less';
import { connect } from 'umi';
import TreeMenu from '../TreeMenu'
import ListMenu from '../ListMenu'
import Search from '../Search';
import Fav from '../Fav';



const LeftMenu: React.FC = (props, ref) => {
   
    const [menuType, setMenuType] = useState<String>("tree");


    const hideMenu = ()=>{
        props.setMenuStyle("two");
    }

    const onMenuClick = value => {
        if(props.menuStyle!= "three"){
            props.setMenuStyle("three");
        }
        setMenuType(value);
    }

    const handleNoteClick = (note: NoteItem) => {
        const { isMobile } = props;
        if (note.isLeaf) {
            const { openedNoteId } = props.note;
            if (openedNoteId != note.id) {
                props.dispatch({
                    type: 'note/openNote',
                    payload: note.id,
                })
            }

            if (isMobile) {
                hideMenu();
            }
        } else {
            const { listParentNote } = props.note;
            if (listParentNote.id != note.id) {
                props.dispatch({
                    type: 'note/refreshListParentNote',
                    payload: note
                })
            }
        }

    }

    const menuData = {
        "tree": { menuType: "tree", icon: "&#xe82d;", text: "文件夹" },
        "list": { menuType: "list", icon: "&#xe8a8;", text: "列表" },
        "search": { menuType: "search", icon: "&#xe893;", text: "搜索" },
        "fav": { menuType: "fav", icon: "&#xe8b1;", text: "收藏夹" },
        // { menuType: "newest", icon: "&#xe804;" ,text:"最近文档"},
    }

    const render = function () {

        return (

            <div className={`${styles.container} ${styles[props.menuStyle]}`}>
                {/* 菜单 */}
                <div className={styles.menu}>
                    <span className={styles.avatar}><img src={star}></img></span>
                    <ul>
                        {Object.keys(menuData).map(key =>
                            <li key={key} onClick={() => onMenuClick(key)} className={menuData[key].menuType == menuType ? styles.active : ""}>
                                <span className="iconfont" dangerouslySetInnerHTML={{ __html: menuData[key].icon }}></span>
                            </li>
                        )}
                    </ul>
                </div>

                {/* 列表 */}
                <div className={styles.content}>
                    <header className={styles.header}>
                        <em className={styles.closeBtn}><span className="iconfont" onClick={hideMenu}>&#xe86a;</span></em>
                        {menuData[menuType] ? menuData[menuType].text : ""}
                    </header>
                    <article className={styles.body}>
                        <div className={menuType == "tree" ? styles.show : styles.hide}>
                            <TreeMenu onNoteClick={handleNoteClick} getDragNote={() => dragNote}></TreeMenu>
                        </div>
                        <div className={menuType == "list" ? styles.show : styles.hide}>
                            <ListMenu onNoteClick={handleNoteClick} setDragNote={() => { }}></ListMenu>
                        </div>
                        <div className={menuType == "search" ? styles.show : styles.hide}>
                            <Search onNoteClick={handleNoteClick} ></Search>
                        </div>
                        <div className={menuType == "fav" ? styles.show : styles.hide}>
                            <Fav onNoteClick={handleNoteClick} ></Fav>
                        </div>
                    </article>
                </div>

            </div>




        );
    };
    return render();
};

export default connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(LeftMenu);