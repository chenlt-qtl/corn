import React, { useEffect, useState } from 'react';
import { Dropdown, Menu, Button } from 'antd';
import { HomeOutlined, EllipsisOutlined } from '@ant-design/icons';
import styles from './style.less';
import { connect } from 'umi';
import { queryNote, queryNoteById } from '@/services/note'
import EditFolderModal from '../../../components/EditFolderModal';
import NoteList from '../NoteList';
import { NoteItem } from '@/data/note';



const homeNote = { id: "0", name: "所有笔记" }

const ListMenu: React.FC = (props, ref) => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [params, setParams] = useState<Object>({});
    const [sortType, setSortType] = useState<string>('default');
    const [rootNote, setRootNote] = useState<NoteItem>({ ...homeNote });


    useEffect(() => {
        refreshData({ ...homeNote })
    }, []);

    const refreshData = async (parentNote) => {
        setParams({ parentId: parentNote.id })
        setRootNote(parentNote);
        setSortType('default')
    }

    const onFoldClick = parentNote => {
        refreshData(parentNote)
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


    const goBack = async (home: boolean = false) => {
        
        let parentNote;
        
        if (home || rootNote.parentId == "0") {
            parentNote = homeNote;
        } else if (rootNote.parentId) {
            const res = await queryNoteById(rootNote.parentId);
            parentNote = res.result;
        }
        refreshData(parentNote)

    }



    const render = () => {

        const buttonDisable = rootNote.id == homeNote.id;

        return (
            <div className={styles.container} >

                <EditFolderModal visible={isModalVisible} parentId={rootNote.id} node={{}} onCancel={() => setIsModalVisible(false)}></EditFolderModal>

                <div className={styles.toolbar}>
                    <Button type="text" disabled={buttonDisable} onClick={() => goBack()}><span className='iconfont'>&#xe7c3;</span></Button>
                    <span className={styles.title}>{rootNote.name}</span>
                    {buttonDisable ? <div></div> : <Button type="text" disabled={buttonDisable} onClick={() => goBack(true)}><HomeOutlined /></Button>}
                    <Dropdown overlay={sortMenu} trigger={['click']}><Button type="text"><EllipsisOutlined /></Button></Dropdown>
                </div>
                <div className={styles.list}>
                    <NoteList getDataMethod={queryNote} params={params} sortType={sortType} onFoldClick={onFoldClick}></NoteList>
                </div>

            </div>
        );
    };
    return render();
};

export default connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(ListMenu);
