import React from 'react';
import { Modal, notification, Menu, Dropdown } from 'antd';
import { ExclamationCircleOutlined, FileTextOutlined, FolderOutlined, DeleteOutlined, SwapOutlined, EllipsisOutlined, InboxOutlined } from '@ant-design/icons';
import styles from './style.less';
import { NoteItem } from '@/data/note';
import { connect } from 'umi';

const { confirm } = Modal;

const NoteList: React.FC = (props, ref) => {



    const sortData = items => {
        const { sortType } = props;


        if (sortType) {
            if (sortType == "default") {
                return [...items].sort((a, b) => a.isLeaf - b.isLeaf)
            } else if (sortType == "date") {
                return [...items].sort((a, b) => a.updateTime < b.updateTime ? 1 : -1)
            } else if (sortType == "name") {
                return [...items].sort((a, b) => a.name > b.name)
            }
        }
        return [...items];
    }


    const handleNoteClick = (note: NoteItem) => {
        const { onFolderClick } = props;
        if (note.isLeaf) {
            props.dispatch({
                type: 'note/openNote',
                payload: note.id,
            })
        } else {
            onFolderClick(note.id)
        }
    }


    const handleDelete = note => {
        confirm({
            title: `确定要删除 ${note.name}?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {

                props.dispatch({
                    type: 'note/deleteNote',
                    payload: note.id,
                }).then(res => {
                    if (res && res.success) {
                        notification["info"]({
                            message: '删除成功',
                        });
                    }
                })
            }
        })
    }


    const operMenu = node =>
        <Menu>
            {props.handleChangeParent ?
                <Menu.Item onClick={e => props.handleChangeParent(node)}>
                    <SwapOutlined />&nbsp;&nbsp;移动
                </Menu.Item> : ""}
            <Menu.Item onClick={e => handleDelete(node)}>
                <DeleteOutlined />&nbsp;&nbsp;删除
            </Menu.Item>
        </Menu>


    const render = function () {

        const { openedNote } = props.note;

        const { data, noDelete } = props;

        return (
            <div className={styles.noteList} style={props.style}>
                {data.length > 0 ?
                    <div className={styles.list}>
                        <ul> {
                            sortData(data).map(note => {
                                const { name, id, isLeaf } = note;
                                const isActive = (openedNote.id == id);
                                return <li key={id} >
                                    <div className={`${styles.menuItem} ${isActive ? styles.active : ''}`} onClick={() => handleNoteClick(note)}>
                                        {isLeaf ? <FileTextOutlined /> : <FolderOutlined />}
                                        <div className={styles.noteTitle} draggable={true} >&nbsp;&nbsp;{name}</div>
                                        {noDelete ? "" :
                                            <Dropdown overlay={operMenu(note)} trigger={['click']}>
                                                <div className={styles.menu} onClick={e => e.stopPropagation()}>
                                                    <EllipsisOutlined />
                                                </div></Dropdown>}
                                    </div>
                                </li>
                            })}
                        </ul>
                    </div> : <div className={styles.empty}><InboxOutlined /></div>}
            </div >
        );
    };
    return render();
};

export default connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(NoteList);
