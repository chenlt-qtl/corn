import React, { useEffect, useState } from 'react';
import { Dropdown, Menu, Modal, notification, Button, Input } from 'antd';
import { ExclamationCircleOutlined, SearchOutlined, FileTextOutlined, FolderOutlined, DeleteOutlined, HomeOutlined, EllipsisOutlined } from '@ant-design/icons';
import styles from './style.less';
import { connect } from 'umi';
import { queryNoteById, queryNote } from '@/services/note'
import { isNormalNoteId } from '@/utils/utils';
import EditFolderModal from '../components/EditFolderModal';
import NoteList from '../components/NoteList';



const { confirm } = Modal;
const ListMenu: React.FC = (props, ref) => {
    const [searchInputStr, setSearchInputStr] = useState<string>("");
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [dataList, setDataList] = useState<[]>([]);

    useEffect(() => {

        const parentId = props.noteMenu.listParentNote.id;
        getListData(parentId);

    }, [props.noteMenu.listParentNote]);

    useEffect(() => {
        getListData("0");
    }, []);

    const getListData = (parentId:string)=>{
        queryNote(parentId).then(({ result }) => {
            result.sort((a, b) => a.isLeaf - b.isLeaf);
            setDataList(result);
        });
    }

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

        console.log(dataList);


        const loading = props.loading.effects["noteMenu/refreshNewestData"] || false;

        const buttonDisable = !isNormalNoteId(listParentNote.id);

        return (
            <div className={styles.container} >

                <EditFolderModal visible={isModalVisible} node={{}} onCancel={() => setIsModalVisible(false)}></EditFolderModal>

                <div className={styles.toolbar}>
                    <Button type="text" disabled={buttonDisable} onClick={() => goBack()}><span className='iconfont'>&#xe7c3;</span></Button>
                    <span className={styles.title}>{listParentNote.name || "所有笔记"}</span>
                    {buttonDisable ? <div></div> : <Button type="text" disabled={buttonDisable} onClick={() => goBack(true)}><HomeOutlined /></Button>}
                    <Dropdown overlay={sortMenu} trigger={['click']}><Button type="text"><EllipsisOutlined /></Button></Dropdown>
                </div>
                 <div className={styles.list}>
                    <NoteList data={dataList} ></NoteList> 
                </div>

            </div>
        );
    };
    return render();
};

export default connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu, loading }) => ({ note, noteMenu, loading }))(ListMenu);
