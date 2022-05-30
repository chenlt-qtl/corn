import React, { useEffect } from 'react';
import { Modal, notification, Button } from 'antd';
import { ExclamationCircleOutlined, FileTextOutlined, FolderOutlined, DeleteOutlined, } from '@ant-design/icons';
import styles from './style.less';
import { connect } from 'umi';
import HocMedia from "@/components/HocMedia";


const { confirm } = Modal;
const NoteList: React.FC = (props, ref) => {


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


    const handleDelete = (e, note) => {
        e.preventDefault();
        e.stopPropagation();

        confirm({
            title: `确定要删除 ${note.name}?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {

                props.dispatch({
                    type: 'note/deleteNote',
                    payload: note,
                }).then(() => {
                    notification["info"]({
                        message: '删除成功',
                    });
                })
            }
        })
    }


    const transportNote = (note: object) => {
        const id = note.key || note.id;
        const title = note.title || note.name;
        return { ...note, id, title }
    }

    const loadMore = () => {
        const { pageNo, pageSize } = props.noteMenu;
        let type = `noteMenu/queryNewest`;
        if (props.noteMenu.listParentNote.id == "search") {
            type = "noteMenu/searchNote";
        }
        props.dispatch({
            type,
            payload: { pageNo: pageNo + 1, pageSize, searchStr, searchParentId },
        })
    }

    const render = function () {

        const { openedNote } = props.note;

        const { data = [], noDelete, hasMore } = props;

        return (
            <div className={styles.container} style={props.style}>
                <div className={styles.list}>
                    <ul> {data.map(item => {
                        const note = transportNote(item);
                        const { id, title } = note;
                        const isActive = openedNote.id == id;
                        return <li key={id} >
                            <div className={`${styles.menuItem} ${isActive ? styles.active : ''}`} onClick={() => handleNoteClick(item)}>
                                {item.isLeaf ? <FileTextOutlined /> : <FolderOutlined />}
                                <div className={styles.noteTitle} draggable={true} onDragStart={() => props.setDragNote(note)
                                }>&nbsp;&nbsp;{title}</div>
                                {noDelete ? "" :
                                    <div className={styles.menu}
                                        onClick={e => handleDelete(e, note)}
                                    >
                                        <DeleteOutlined />
                                    </div>}
                            </div>
                        </li>

                    })}
                        {hasMore ? <li><Button type="link" loading={loading} onClick={loadMore}>加载更多</Button></li> : ""}
                    </ul>

                </div>
            </div>
        );
    };
    return render();
};

export default HocMedia(connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu, loading }) => ({ note, noteMenu, loading }))(NoteList));
