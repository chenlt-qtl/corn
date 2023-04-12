import React, { useEffect, useState, useRef } from 'react';
import { Dropdown, Menu, Button, Input, Radio, message } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import styles from './style.less';
import { connect, useModel } from 'umi';
import { queryFav, pageSearchNote } from '@/services/note'
import NoteList from './NoteList';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { getNode } from '../../utils';
import { getMenu } from '../../../utils'

const ListMenu: React.FC = (props, ref) => {

    const { initialState: { currentUser } } = useModel('@@initialState');

    const [sortType, setSortType] = useState<string>('default');
    const [searchStr, setSearchStr] = useState<string>("");
    const [listData, setListData] = useState<Object[]>([]);
    const [searchRecent, setSearchRecent] = useState<string[]>((localStorage.getItem("searchRecent" + currentUser.id) || "").split(","));
    const inputRef = useRef<Input | null>(null);
    const searchWinRef = useRef(null);
    const [showSearchWin, setShowSearchWin] = useState<boolean>(false);
    const [listTitle, setListTitle] = useState<string>("");

    useEffect(() => {
        setSearchStr("")
        props.note.selectedType && getData("");
    }, [props.note.selectedType]);

    useEffect(() => {
        
        const { selectedType } = props.note;
        if (selectedType && (!isNaN(selectedType) || selectedType == "folder")) {
            loadTreeData(searchStr)
        }

    }, [props.note.noteTreeData]);

    useEffect(() => {
        window.addEventListener('click', closeShowWin)
        return () => {
            window.removeEventListener('click', closeShowWin)
        }
    }, []);

    const closeShowWin = e => {
        const { target } = e
        if (!searchWinRef.current.contains(target) && target != inputRef.current.input) {
            setShowSearchWin(false)
        }

    }


    const getData = async (searchStr: string) => {

        const { selectedType } = props.note;

        let listData = [];

        const menu = getMenu(selectedType);
        if (menu) {
            setListTitle(menu.name);
        }

        if (menu && menu.id != "folder") {

            if (selectedType == "fav") {
                const res = await queryFav();
                if (res && res.success) {
                    listData = res.result
                }
            } else if (selectedType == "history") {
                listData = props.note.openedNotes
            }
            if (searchStr) {
                listData = listData.filter(i => i.name.toLowerCase().includes(searchStr.toLowerCase()))
            }
            setListData(listData.sort(i => i.isLeaf))
        } else {
            loadTreeData(searchStr)
        }
        setSortType('default')

    }


    const loadTreeData = async (searchStr: string) => {
        if (props.note.noteTreeData.length == 0) {
            return;
        }
        const { selectedType } = props.note;

        let listData;
        if (selectedType == "folder") {
            if (!searchStr) {
                listData = props.note.noteTreeData || [];
            } else {
                const res = await pageSearchNote({ pageNo: 0, pageSize: 20, searchStr, parentId: 0 });
                if (res && res.success) {
                    listData = res.result.records
                }
            }
        } else {//其他树节点，从treedata上面过滤数据
            const node = getNode(selectedType, props.note.noteTreeData);
            if (node) {
                listData = node.children;
                if (searchStr) {
                    listData = listData.filter(i => i.name.toLowerCase().includes(searchStr.toLowerCase()))
                }
                setListTitle(node.name);
            } else {
                message.error("不合法的文件夹ID:" + selectedType);
                return;
            }
        }
        setListData(listData.sort(i => i.isLeaf))
    }

    const goBack = () => {
        const { selectedType } = props.note;
        const node = getNode(selectedType, props.note.noteTreeData);

        if (node) {
            let payload;
            if (node.parentId) {
                payload = node.parentId;
            } else {//返回根节点
                payload = "folder"
            }
            props.dispatch({
                type: 'note/refreshSelectedType',
                payload
            })
        }
    }

    //排序
    const handleSort = e => {
        setSortType(e.key)
    }

    //更新搜索历史
    const updateSearchRecent = searchStr => {
        if (searchStr) {
            const set = new Set([searchStr, ...searchRecent.filter(a => a)])
            const newSearchRecent = [...set];
            while (newSearchRecent.length > 5) {
                newSearchRecent.pop()
            }

            setSearchRecent(newSearchRecent);
            localStorage.setItem("searchRecent" + currentUser.id, newSearchRecent.join(","))
        }
    }

    //搜索事件
    const handleSearch = async (searchStr) => {

        //更新搜索历史
        updateSearchRecent(searchStr)
        getData(searchStr);
        setShowSearchWin(false)

    }


    //快捷历史搜索
    const searchHistory = str => {
        setSearchStr(str);
        handleSearch(str);
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

    //清除搜索历史
    const cleanSearch = () => {
        setSearchRecent([]);
        localStorage.setItem("searchRecent" + props.user.id, "")
    }


    const render = () => {

        const { selectedType } = props.note;

        return (

            <div className={styles.container} >
                <div className={styles.searchBar}>
                    <Input ref={inputRef} className={styles.search} onClick={() => setShowSearchWin(true)}
                        onFocus={() => setShowSearchWin(true)}
                        value={searchStr}
                        onChange={e => setSearchStr(e.currentTarget.value)}
                        onPressEnter={() => handleSearch(searchStr)} suffix={<SearchOutlined />}></Input>
                    <div ref={searchWinRef} className={styles.searchModel} style={{ display: showSearchWin ? "flex" : "none" }}>
                        <div className={styles.recent}>
                            <span className={styles.title}>最近搜索</span><span className={styles.icon} onClick={cleanSearch}><DeleteOutlined /> </span>
                            <span className={styles.searchStrs}>{searchRecent.map(str => <span key={str} onClick={() => {
                                searchHistory(str)
                            }}>{str}</span>)}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.toolbar}>
                    {!getMenu(selectedType) ? <Button type="text" onClick={() => goBack()}><span className='iconfont'>&#xe7c3;</span></Button> : ""}
                    <span className={styles.title}>{listTitle}</span>
                    <Dropdown overlay={sortMenu} trigger={['click']}><Button type="text"><EllipsisOutlined /></Button></Dropdown>
                </div>
                <NoteList {...props} data={listData} sortType={sortType}></NoteList>
            </div >

        );
    };
    return render();
};

export default connect(({ note }: { note: NoteModelState }) => ({ note }))(ListMenu);
