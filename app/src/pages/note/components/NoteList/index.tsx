import React, { useEffect } from 'react';
import { Modal, notification, Button } from 'antd';
import { ExclamationCircleOutlined, FileTextOutlined, FolderOutlined, DeleteOutlined, } from '@ant-design/icons';
import styles from './style.less';
import { connect } from 'umi';


const { confirm } = Modal;
const NoteList: React.FC = (props, ref) => {

    useEffect(() => {

        const parentId = props.noteMenu.listParentNote.id;

        const pageNo = 1, pageSize = 5;

        if (parentId != undefined) {
            if (parentId == "search") {

                props.dispatch({
                    type: 'noteMenu/refreshPageInfo',
                    payload: { pageNo, pageSize }
                })
                props.dispatch({
                    type: 'noteMenu/searchNote',
                    payload: { pageNo, pageSize, searchStr, searchParentId }
                })
            } else if (parentId == "newest") {
                props.dispatch({
                    type: 'noteMenu/refreshPageInfo',
                    payload: { pageNo, pageSize }
                })
                props.dispatch({
                    type: 'noteMenu/queryNewest',
                    payload: { pageNo, pageSize }
                })
            } else {
                props.dispatch({
                    type: `noteMenu/queryMenuItems`,
                    payload: parentId,
                })
            }

        }

    }, [props.noteMenu.listParentNote]);

    useEffect(() => {
        props.dispatch({
            type: `noteMenu/refreshListParentNote`,
        })
    }, []);


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
        const { listMenuItems } = props.noteMenu;
        const { hasMore } = props;

        const { openedNote } = props.note;

        return (
            <div className={styles.container} style={props.style}>
                <div className={styles.list}>
                    <ul> {listMenuItems.map(item => {
                        const note = transportNote(item);
                        const { id, title } = note;
                        const isActive = openedNote.id == id;
                        return <li key={id} >
                            <div className={`${styles.menuItem} ${isActive ? styles.active : ''}`} onClick={() => props.onNoteClick(item)}>
                                {item.isLeaf ? <FileTextOutlined /> : <FolderOutlined />}
                                <div className={styles.noteTitle} draggable={true} onDragStart={() => props.setDragNote(note)
                                }>&nbsp;&nbsp;{title}</div>
                                <div className={styles.menu}
                                    onClick={e => handleDelete(e, note)}
                                >
                                    <DeleteOutlined />
                                </div>
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

export default connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu, loading }) => ({ note, noteMenu, loading }))(NoteList);
