import React, { useEffect, useState } from 'react';
import { Dropdown, Menu, Modal, notification, Button } from 'antd';
import { ExclamationCircleOutlined, HomeOutlined, EllipsisOutlined } from '@ant-design/icons';
import styles from './style.less';
import { connect } from 'umi';
import { queryNoteById, queryNote } from '@/services/note'
import EditFolderModal from '../components/EditFolderModal';
import NoteList from '../components/NoteList';



const { confirm } = Modal;
const ListMenu: React.FC = (props, ref) => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [params, setParams] = useState<Object>({});
    const [sortType, setSortType] = useState<string>('default');


    useEffect(() => {
        refreshData();
    }, [props.noteMenu.listParentNote]);

    useEffect(() => {
        refreshData();
    }, [props.note.listKey]);

    const refreshData = ()=>{
        const parentId = props.noteMenu.listParentNote.id;
        setSortType('default')
        setParams({ parentId })
    }


    const handleSort = e => {
        setSortType(e.key)
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



    const render = function () {
        const { listParentNote } = props.noteMenu;

        const buttonDisable = listParentNote.id == "0";

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
                    <NoteList getDataMethod={queryNote} params={params} sortType={sortType}></NoteList>
                </div>

            </div>
        );
    };
    return render();
};

export default connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu, loading }) => ({ note, noteMenu, loading }))(ListMenu);
