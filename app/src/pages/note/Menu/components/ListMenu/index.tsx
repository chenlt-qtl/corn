import React, { useEffect, useState, useRef } from 'react';
import { Dropdown, Menu, Button, Input, Radio, message } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import styles from './style.less';
import { connect, useModel } from 'umi';
import { queryFav, pageSearchNote } from '@/services/note'
import NoteList from './NoteList';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { getNode } from '../../utils';
import { getMenu, isFolder } from '../../../utils'

const ListMenu: React.FC = (props, ref) => {

    const { initialState: { currentUser } } = useModel('@@initialState');

    const [sortType, setSortType] = useState<string>('default');
    const [listData, setListData] = useState<Object[]>([]);
    const [searchRecent, setSearchRecent] = useState<string[]>((localStorage.getItem("searchRecent" + currentUser.id) || "").split(","));
    const searchWinRef = useRef(null);
    const searchRef = useRef(null);
    const [range, setRange] = useState<number>(1);//1:当前文件夹  0：全部文件夹
    const [showSearchWin, setShowSearchWin] = useState<boolean>(false);//控制是否展示搜索历史弹出框
    const [listTitle, setListTitle] = useState<string>("");
    const [searchStr, setSearchStr] = useState<string>("");

    useEffect(() => {
        const { listParentId } = props.note;
        const menu = getMenu(listParentId);
        if (menu) {
            setListTitle(menu.name);
        }
        listParentId != "search" && getData(menu);
    }, [props.note.listParentId]);

    useEffect(() => {
        const { listParentId, openedNote } = props.note;
        if (openedNote && openedNote.parentId && !isNaN(listParentId)) {
            props.dispatch({ type: 'note/refreshListParentId', payload: openedNote.parentId })
        }
    }, [props.note.openedNote]);

    useEffect(() => {

        const { listParentId } = props.note;
        if (listParentId && !isNaN(listParentId)) {
            loadTreeData()
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
        if (!searchWinRef.current.contains(target) && target != searchRef.current.input) {
            setShowSearchWin(false)
        }

    }


    const getData = async (menu) => {

        const { listParentId } = props.note;

        let listData = [];

        if (menu && menu.id != "0") {

            if (listParentId == "fav") {
                const res = await queryFav();
                if (res && res.success) {
                    listData = res.result
                }
            } else if (listParentId == "history") {
                listData = props.note.openedNotes
            }
            setListData(listData.sort(i => i.isLeaf))
        } else {
            loadTreeData()
        }
        setSortType('default')

    }


    const loadTreeData = async () => {
        if (props.note.noteTreeData.length == 0) {
            return;
        }

        const { listParentId } = props.note;
        let listData;
        if (listParentId == "0") {
            listData = props.note.noteTreeData;
        } else {//其他树节点，从treedata上面过滤数据
            const node = getNode(listParentId, props.note.noteTreeData);
            if (node) {
                listData = node.children;
                setListTitle(node.name);
            } else {
                message.error("不合法的文件夹ID:" + listParentId);
                return;
            }
        }
        setListData(listData.sort(i => i.isLeaf))
    }

    const goBack = () => {
        const { listParentId } = props.note;
        const node = getNode(listParentId, props.note.noteTreeData);

        if (node) {
            let payload;
            if (node.parentId) {
                payload = node.parentId;
            } else {//返回根节点
                payload = "0"
            }
            props.dispatch({
                type: 'note/refreshListParentId',
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

        const { listParentId } = props.note;
        let newListData
        //更新搜索历史
        updateSearchRecent(searchStr)
        if (!isNaN(listParentId)) {
            props.dispatch({ type: 'note/refreshListParentId', payload: "search" })
        }


        if (isFolder(listParentId) && !range) { //全部文件夹搜索
            const res = await pageSearchNote({ pageNo: 0, pageSize: 20, searchStr, parentId: 0 });
            if (res && res.success) {
                newListData = res.result.records
            }
        } else {
            newListData = listData.filter(i => i.name.toLowerCase().includes(searchStr.toLowerCase()))
        }

        setListData(newListData)
        setShowSearchWin(false)
        setSearchStr("")

    }


    //快捷历史搜索
    const searchHistory = str => {
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

        const { listParentId } = props.note;
        

        return (

            <div className={styles.container} >
                <div className={styles.searchBar}>
                    <Input className={styles.search} onClick={() => setShowSearchWin(true)} value={searchStr} onChange={e => setSearchStr(e.target.value)}
                        onFocus={() => setShowSearchWin(true)} ref={searchRef}
                        onPressEnter={e => handleSearch(e.target.value)} suffix={<SearchOutlined />}></Input>
                    <div ref={searchWinRef} className={styles.searchModel} style={{ display: showSearchWin ? "flex" : "none" }}>
                        <div className={styles.recent}>
                            <span className={styles.title}>最近搜索</span><span className={styles.icon} onClick={cleanSearch}><DeleteOutlined /> </span>
                            <span className={styles.searchStrs}>{searchRecent.map(str => <span key={str} onClick={() => {
                                searchHistory(str)
                            }}>{str}</span>)}</span>
                        </div>
                        {isFolder(listParentId) ? (<div className={styles.range}>
                            <span className={styles.title}>搜索范围</span>
                            <div className={styles.rangeRadio}>
                                <Radio.Group onChange={e => setRange(e.target.value)} value={range}>
                                    <Radio value={1}>当前文件夹  </Radio>
                                    <Radio value={0}>全部笔记</Radio>
                                </Radio.Group>
                            </div>
                        </div>) : ""}
                    </div>
                </div>

                <div className={styles.toolbar}>
                    {!getMenu(listParentId) ? <Button type="text" onClick={() => goBack()}><span className='iconfont'>&#xe7c3;</span></Button> : ""}
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
