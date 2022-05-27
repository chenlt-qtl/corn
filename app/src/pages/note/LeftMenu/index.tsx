import React, { useState } from 'react';
import star from '@/assets/diamond.svg';
import styles from './style.less';
import { connect } from 'umi';
import TreeMenu from '../TreeMenu'
import ListMenu from '../ListMenu'



const LeftMenu: React.FC = (props, ref) => {

    const [menuType, setMenuStyle] = useState<String>("tree");

    const setMenuType = value => {
        setMenuStyle(value);
    }

    const handleNoteClick = (note: NoteItem) => {
        const { isMobile } = props;
        if (note.isLeaf) {
            const { openedNote } = props.note;
            if (openedNote.id != note.id) {
                props.dispatch({
                    type: 'note/openNote',
                    payload: note.id,
                })
            }

            if (isMobile) {
                props.dispatch({
                    type: 'note/refreshShowMenu',
                    payload: false,
                })
            }
        } else {
            const { listParentNote } = props.noteMenu;
            if (listParentNote.id != note.id) {
                props.dispatch({
                    type: 'noteMenu/refreshListParentNote',
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

            <div className={`${styles.container} ${props.note.showMenu ? styles.show : styles.hide}`}>
                {/* 菜单 */}
                <div className={styles.menu}>
                    <span className={styles.avatar}><img src={star}></img></span>
                    <ul>
                        {Object.keys(menuData).map(key =>
                            <li key={key} onClick={() => setMenuType(key)} className={menuData[key].menuType == menuType ? styles.active : ""}>
                                <span className="iconfont" dangerouslySetInnerHTML={{ __html: menuData[key].icon }}></span>
                            </li>
                        )}
                    </ul>
                </div>

                {/* 列表 */}
                <div className={styles.content}>
                    <header className={styles.header}>
                        <em className={styles.closeBtn}><span className="iconfont" >&#xe86a;</span></em>
                        {menuData[menuType] ? menuData[menuType].text : ""}
                    </header>
                    <article className={styles.body}>
                        <TreeMenu style={{ display: menuType == "tree" ? "block" : "none" }} onNoteClick={handleNoteClick} getDragNote={() => dragNote}></TreeMenu>
                        <ListMenu style={{ display: menuType == "list" ? "block" : "none" }} onNoteClick={handleNoteClick} setDragNote={() => { }}></ListMenu> :
                    </article>
                </div>

            </div>




        );
    };
    return render();
};

export default connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu, loading }) => ({ note, noteMenu, loading }))(LeftMenu);
