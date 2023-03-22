import React, { useEffect, useState } from 'react';
import { Dropdown, Menu, Button, Input, Spin } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import styles from './style.less';
import { connect } from 'umi';
import { queryNote, queryFav } from '@/services/note'
import NoteList from './NoteList';
import { SearchOutlined, InboxOutlined } from '@ant-design/icons';
import { getNode } from '../../utils';

const ListMenu: React.FC = (props, ref) => {
    const [sortType, setSortType] = useState<string>('default');
    const [searchStr, setSearchStr] = useState<string>("");
    const [listData, setListData] = useState<Object[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        loadData();
    }, [props.match.params]);

    useEffect(() => {
        loadData()
    }, [props.selectFolder]);

    const loadData = async () => {
        const { type } = props.match.params;
        let listData = [];
        setLoading(true);
        let res;

        if (type == "fav") {
            res = await queryFav();
            if (res && res.success) {
                listData = res.result
            }
        } else if (type == "folder") {

            const { selectFolder = {} } = props;
            if (!selectFolder.id) {
                listData = props.note.noteTreeData;
            } else {
                const parent = getNode(selectFolder.id, props.note.noteTreeData);
                parent && (listData = parent.children);
            }
        }

        setLoading(false)
        setListData(listData.sort(i => i.isLeaf))
        setSortType('default')

    }

    const goBack = () => {

        const { selectFolder = {}, onSelectFolder } = props;

        if (!selectFolder.parentId || selectFolder.parentId == "0") {
            onSelectFolder({})
        } else {
            const parentNote = getNode(selectFolder.parentId, props.note.noteTreeData);
            onSelectFolder({ ...parentNote, id: parentNote.key })
        }
    }

    const handleSort = e => {
        setSortType(e.key)
    }

    const handleSearch = () => {
        const params = { searchStr }
        setParams(params);
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



    const render = () => {

        const { type } = props.match.params;
        const { selectFolder = {} } = props;


        return (

            <div className={styles.container} >
                <div className={styles.searchBar}>
                    <Input className={styles.search} value={searchStr} onChange={e => setSearchStr(e.currentTarget.value)} onPressEnter={handleSearch} suffix={<SearchOutlined />}></Input>
                </div>
                {type == "folder" ?
                    <div className={styles.toolbar}>
                        {selectFolder.id ? <Button type="text" onClick={() => goBack()}><span className='iconfont'>&#xe7c3;</span></Button> : ""}
                        <span className={styles.title}>{selectFolder.name||"文件夹"}</span>
                        <Dropdown overlay={sortMenu} trigger={['click']}><Button type="text"><EllipsisOutlined /></Button></Dropdown>
                    </div> : ""}
                {type ?
                    <Spin spinning={loading} wrapperClassName={styles.list}>
                        <NoteList {...props} data={listData} sortType={sortType} onFoldClick={props.onSelectFolder}></NoteList>
                    </Spin> : <div className={styles.empty}><InboxOutlined /></div>}
            </div >

        );
    };
    return render();
};

export default connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(ListMenu);
