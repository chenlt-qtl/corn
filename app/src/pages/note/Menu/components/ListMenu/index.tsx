import React, { useEffect, useState, useRef } from 'react';
import { Dropdown, Menu, Button, Input, Spin, Radio } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import styles from './style.less';
import { connect, useModel } from 'umi';
import { queryFav, pageSearchNote } from '@/services/note'
import NoteList from './NoteList';
import { SearchOutlined, InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import { getNode } from '../../utils';

const ListMenu: React.FC = (props, ref) => {

    const { initialState: { currentUser } } = useModel('@@initialState');

    const [sortType, setSortType] = useState<string>('default');
    const [searchStr, setSearchStr] = useState<string>("");
    const [listData, setListData] = useState<Object[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [range, setRange] = useState<number>(1);
    const [searchRecent, setSearchRecent] = useState<string[]>((localStorage.getItem("searchRecent" + currentUser.id) || "").split(","));
    const inputRef = useRef<Input | null>(null);
    const searchWinRef = useRef(null);
    const [showSearchWin, setShowSearchWin] = useState<boolean>(false);
    const [afterSearch, setAfterSearch] = useState<boolean>(false);

    useEffect(() => {
        getData();
    }, [props.match.params.type]);

    useEffect(() => {
        const { type } = props.match.params;
        type == "folder" && getData();
    }, [props.note.selectedFolder.id]);

    useEffect(() => {
        getData()
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
        if (afterSearch) {
            return;
        }

        const { type } = props.match.params;

        let listData = [];
        setLoading(true);
        let res;

        if (type == "fav") {

            res = await queryFav();
            if (res && res.success) {
                listData = res.result
                if (searchStr) {
                    listData = listData.filter(i => i.name.toLowerCase().includes(searchStr.toLowerCase()))
                }
            }
        } else if (type == "folder") {

            const { selectedFolder } = props.note;
            if (!searchStr) {
                if (!selectedFolder.id) {
                    listData = props.note.noteTreeData || [];
                } else {
                    const parent = getNode(selectedFolder.id, props.note.noteTreeData);
                    parent && (listData = parent.children);
                }
            } else {
                const res = await pageSearchNote({ pageNo: 0, pageSize: 20, searchStr, parentId: range ? (selectedFolder.id || 0) : 0 });
                if (res && res.success) {
                    listData = res.result.records
                }
            }
        } else if (type == "history") {
            listData = props.note.openedNotes;
            if (searchStr) {
                listData = listData.filter(i => i.name.toLowerCase().includes(searchStr.toLowerCase()))
            }
        }

        setLoading(false)
        setListData(listData.sort(i => i.isLeaf))
        setSortType('default')

    }

    const goBack = () => {

        const { selectedFolder } = props.note;

        if (!selectedFolder.parentId || selectedFolder.parentId == "0") {
            setSelectedNote({})
        } else {
            const parentNote = getNode(selectedFolder.parentId, props.note.noteTreeData);
            setSelectedNote(parentNote)
        }
    }

    const setSelectedNote = note => {
        console.log(1619);
        
        props.dispatch({ type: "note/refreshSelectedFolder", payload: note })
        props.dispatch({ type: "note/refreshSelectedTreeKey", payload: note.id })
    }

    const handleSort = e => {
        setSortType(e.key)
    }

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

    const handleSearch = async (searchStr) => {

        //更新搜索历史
        updateSearchRecent(searchStr)
        const { id } = props.note.selectedFolder;
        if (!range && id) {
            console.log(1625);
            
            props.dispatch({ type: "note/refreshSelectedFolder", payload: {} })
        }

        searchStr ? setAfterSearch(true) : setAfterSearch(false)
        getData(searchStr);
        setShowSearchWin(false)

    }


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

    const onRangeChange = e => {
        setRange(e.target.value)
    }

    const cleanSearch = () => {

        setSearchRecent([]);
        localStorage.setItem("searchRecent" + props.user.id, "")
    }


    const render = () => {

        const { type } = props.match.params;
        const { id, name } = props.note.selectedFolder;

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
                        {type == "folder" ? (<div className={styles.range}>
                            <span className={styles.title}>搜索范围</span>
                            <div className={styles.rangeRadio}>
                                <Radio.Group onChange={onRangeChange} value={range}>
                                    <Radio value={1}>当前文件夹  </Radio>
                                    <Radio value={0}>全部笔记</Radio>
                                </Radio.Group>
                            </div>
                        </div>) : ""}

                    </div>
                </div>
                {type == "folder" ?
                    <div className={styles.toolbar}>
                        {id ? <Button type="text" onClick={() => goBack()}><span className='iconfont'>&#xe7c3;</span></Button> : ""}
                        <span className={styles.title}>{name || "文件夹"}</span>
                        <Dropdown overlay={sortMenu} trigger={['click']}><Button type="text"><EllipsisOutlined /></Button></Dropdown>
                    </div> : ""}
                {type ?
                    <Spin spinning={loading} wrapperClassName={styles.list}>
                        <NoteList {...props} data={listData} sortType={sortType} onFoldClick={setSelectedNote}></NoteList>
                    </Spin> : <div className={styles.empty}><InboxOutlined /></div>}
            </div >

        );
    };
    return render();
};

export default connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(ListMenu);
