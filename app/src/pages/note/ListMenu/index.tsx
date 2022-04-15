import React, { useEffect, useState } from 'react';
import { Dropdown, Menu, Modal, notification, Button, Spin, Input } from 'antd';
import { ExclamationCircleOutlined, SearchOutlined, SwapLeftOutlined, UnorderedListOutlined, FileTextOutlined, FolderOutlined, DeleteOutlined, HomeOutlined, EllipsisOutlined } from '@ant-design/icons';
import styles from './style.less';
import { connect } from 'umi';
import { queryNoteById } from '@/pages/note/service'
import { isNormalNoteId } from '@/utils/utils';

let searchStr;
let searchParentId;
const { confirm } = Modal;
const ListMenu: React.FC = (props, ref) => {
    const [searchInputStr, setSearchInputStr] = useState<string>("");

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

    const handleSort = e => {
        const { listMenuItems } = props.noteMenu;

        const key = e.key;
        let items = [...listMenuItems];
        if (key == "default") {
            items = items.sort((a, b) => a.isLeaf - b.isLeaf)
        } else if (key == "date") {
            items = items.sort((a, b) => a.updateTime < b.updateTime ? 1 : -1)
        } else if (key == "name") {
            items = items.sort((a, b) => a.name > b.name)
        }

        props.dispatch({
            type: 'noteMenu/refreshListMenu',
            payload: items
        })

    }

    const sortMenu = (
        <Menu onClick={handleSort}>
            <Menu.Item key="default">
                默认排序
            </Menu.Item>
            <Menu.Item key="date">
                按时间排序
            </Menu.Item>
            <Menu.Item key="name">
                按名称排序
            </Menu.Item>
        </Menu>
    );

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

    const goBack = async (home: boolean = false) => {

        let listParentNote;
        const parentId = props.noteMenu.listParentNote.parentId;


        if (!home && parentId != 0) {
            const res = await queryNoteById(parentId);
            listParentNote = res.result;
        }

        props.dispatch({
            type: `noteMenu/refreshListParentNote`,
            payload: listParentNote,
        })

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

    const handleSearch = e => {
        if (searchInputStr) {
            searchStr = searchInputStr;
            searchParentId = props.noteMenu.listParentNote.id;
            props.dispatch({
                type: "noteMenu/refreshListParentNote",
                payload: { id: "search", name: `"${searchStr}"搜索结果` }
            })
            setSearchInputStr("");
        }

    }

    const render = function () {
        const { listParentNote, listMenuItems, hasMore, activeMenuId } = props.noteMenu;

        const { openedNote } = props.note;

        const loading = props.loading.effects["noteMenu/refreshNewestData"] || false;

        const buttonDisable = !isNormalNoteId(listParentNote.id);

        return (
            <div className={styles.container}>
                <div className={styles.toolbar}>
                    <Button type="text" disabled={buttonDisable} onClick={() => goBack()}><SwapLeftOutlined /></Button>
                    <span className={styles.title}>{listParentNote.name || "所有笔记"}</span>
                    {buttonDisable ? <div></div> : <Button type="text" disabled={buttonDisable} onClick={() => goBack(true)}><HomeOutlined /></Button>}
                    <Dropdown overlay={sortMenu} trigger={['click']}><Button type="text"><EllipsisOutlined /></Button></Dropdown>
                </div>
                <div className={styles.searchBar}>
                    <Input className={styles.search} value={searchInputStr} onChange={e => setSearchInputStr(e.currentTarget.value)} onPressEnter={handleSearch} suffix={<SearchOutlined />}></Input>
                </div>
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
                        {(hasMore && (activeMenuId == "newest" || listParentNote.id == "search")) ? <li><Button type="link" loading={loading} onClick={loadMore}>加载更多</Button></li> : ""}
                    </ul>

                </div>
            </div>
        );
    };
    return render();
};

export default connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu, loading }) => ({ note, noteMenu, loading }))(ListMenu);
