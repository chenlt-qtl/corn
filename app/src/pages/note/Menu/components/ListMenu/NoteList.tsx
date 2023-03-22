import React, { useEffect, useState } from 'react';
import { Modal, notification, Menu, Dropdown } from 'antd';
import { ExclamationCircleOutlined, FileTextOutlined, FolderOutlined, DeleteOutlined, SwapOutlined, EllipsisOutlined } from '@ant-design/icons';
import styles from './style.less';
import { NoteNode, NoteItem } from '@/data/note';
import { connect } from 'umi';
import { changeUrl } from '../../../utils'

const { confirm } = Modal;

const NoteList: React.FC = (props, ref) => {

    const [noteList, setNoteList] = useState<NoteNode[]>([]);

    useEffect(() => {
        setNoteList(props.data);
    }, [props.data])

    useEffect(() => {
        sortData(noteList);
    }, [props.sortType])

    const sortData = (items) => {
        const { sortType } = props;

        if (sortType) {
            if (sortType == "default") {
                items = items.sort((a, b) => a.isLeaf - b.isLeaf)
            } else if (sortType == "date") {
                items = items.sort((a, b) => a.updateTime < b.updateTime ? 1 : -1)
            } else if (sortType == "name") {
                items = items.sort((a, b) => a.name > b.name)
            }
        }
        setNoteList([...items]);
    }


    const handleNoteClick = (note: NoteItem) => {

        if (note.isLeaf) {
            changeUrl(props, "id", note.id)
        } else {
            props.onFoldClick && props.onFoldClick({ ...note, id: note.key });
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
                }).then(() => {
                    notification["info"]({
                        message: '删除成功',
                    });
                    getData(1)
                })
            }
        })
    }


    const transportNote = (note: object) => {
        const id = note.key || note.id;
        const title = note.title || note.name;
        return { ...note, id, title }
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

        const { noDelete } = props;

        return (
            <div className={styles.noteList} style={props.style}>
                <div className={styles.list}>
                    <ul> {noteList.map(item => {
                        const note = transportNote(item);
                        const { id, title } = note;
                        const isActive = openedNote.id == id;
                        return <li key={id} >
                            <div className={`${styles.menuItem} ${isActive ? styles.active : ''}`} onClick={() => handleNoteClick(item)}>
                                {item.isLeaf ? <FileTextOutlined /> : <FolderOutlined />}
                                <div className={styles.noteTitle} draggable={true} >&nbsp;&nbsp;{title}</div>
                                {noDelete ? "" :
                                    <Dropdown overlay={operMenu(note)} trigger={['click']}>
                                        <div className={styles.menu} onClick={e => e.stopPropagation()}>
                                            <EllipsisOutlined />
                                        </div></Dropdown>}
                            </div>
                        </li>

                    })}
                    </ul>
                </div>
            </div >
        );
    };
    return render();
};

export default connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(NoteList);
