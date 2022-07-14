import React, { useEffect, useState } from 'react';
import { Modal, notification, Button } from 'antd';
import { ExclamationCircleOutlined, FileTextOutlined, FolderOutlined, DeleteOutlined, } from '@ant-design/icons';
import styles from './style.less';
import { connect } from 'umi';
import HocMedia from "@/components/HocMedia";
import { NoteNode, NoteItem } from '@/data/note';


const { confirm } = Modal;

const pageSize = 50;

const NoteList: React.FC = (props, ref) => {
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [pageNo, setPageNo] = useState<number>(1);
    const [noteList, setNoteList] = useState<NoteNode[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getData(1);
    }, [props.params])

    const getData = pageNo => {
        const { getDataMethod, params } = props;
        if (getDataMethod) {//需要自己加载数据    
            setLoading(true)
            getDataMethod({ pageSize, ...params, pageNo }).then(({ result, success }) => {
                setLoading(false)
                let rows;
                if (success) {

                    if (result instanceof Array) {
                        rows = result;
                    } else {

                        const { records, total, current } = result;

                        if (current == 1) {
                            rows = records;
                        } else {
                            rows = [...noteList, ...records]
                        }
                        const hasMore = total > rows.length;
                        setHasMore(hasMore);
                        setPageNo(pageNo);
                    }
                    sortData(rows);
                }
            })
        }
    }

    useEffect(() => {
        sortData(noteList);
    }, [props.sortType])

    const sortData = (items)=>{
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
                props.dispatch({
                    type: 'note/refreshShowMenu',
                    payload: false,
                })
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

    const loadMore = () => {
        getData(pageNo + 1);
    }

    const render = function () {

        const { openedNoteId } = props.note;

        const { data = noteList, noDelete } = props;

        return (
            <div className={styles.container} style={props.style}>
                <div className={styles.list}>
                    <ul> {data.map(item => {
                        const note = transportNote(item);
                        const { id, title } = note;
                        const isActive = openedNoteId == id;
                        return <li key={id} >
                            <div className={`${styles.menuItem} ${isActive ? styles.active : ''}`} onClick={() => handleNoteClick(item)}>
                                {item.isLeaf ? <FileTextOutlined /> : <FolderOutlined />}
                                <div className={styles.noteTitle} draggable={true} >&nbsp;&nbsp;{title}</div>
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

export default HocMedia(connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(NoteList));
