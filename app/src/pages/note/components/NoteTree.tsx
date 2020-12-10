import React, { useState,useEffect } from 'react';
import { Tree, Spin, Menu, Dropdown,message } from 'antd';
import styles from '../index.less'
import { PlusOutlined } from '@ant-design/icons';
import { connect, ConnectProps } from 'umi';
import {NoteNode} from '../data.d';

//设置搜索结果
const getSearchResult = (data:NoteNode[], searchValue:string) => {
    const keys:string[] = [];
    if (!searchValue || searchValue.trim() === '') {
        return { treeData: data, keys };
    }
    const treeData = data.reduce((total:NoteNode[], item:NoteNode) => {
        let children:NoteNode[] = [];
        if (item.children) {
            const childrenData = getSearchResult(item.children, searchValue);
            children = childrenData.treeData;
            keys.push(...childrenData.keys);
        }
        let reg = new RegExp(searchValue, 'ig');
        const match = item.name.match(reg);
        if (match || children.length > 0) {
            let title;
            keys.push(...item.parentIds.split('/'));
            if (match) {
                title = replaceKeyWord(reg,searchValue,item.name);
            } else {
                title = <span>{item.name}</span>;
            }
            total.push({ ...item, title, children });
        }
        return total;
    }, []);
    return { treeData, keys };
};

const replaceKeyWord = (reg:RegExp,searchValue:string,text:string)=>{
    let strs = [],index = 0,match;
    while ((match = reg.exec(text))) {
        strs.push(text.substring(index, match.index));
        index = match.index + searchValue.length;
    };
    strs.push(text.substring(index));

    return <span>{strs.map((value,i)=>{
        if(i!=strs.length-1){
            return <>{value}<span className={styles.found}>{searchValue}</span></>;
        }else{
            return value;
        }
    })}
    </span>
}

const NoteTree: React.FC<{}> = (props) => {

    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
    const [searchValue, setSearchValue] = useState<string>('');
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const [displayTreeData, setDisplayTreeData] = useState<NoteNode[]>([]);


    useEffect(() => {
        updateTreeData();
    }, [props.note.treeData]);

    const updateTreeData = ()=>{
        const {keys,treeData} = getSearchResult(props.note.treeData,searchValue);
        setDisplayTreeData(treeData);
        return Array.from(new Set(keys));
    }

    const onSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const addRootNote = () => {
        const { activeTabId } = props.note;
        const newNote = { parentId: activeTabId, name: '新文档', text: ' ' };
        props.onAddNote(newNote);
    };

    const addNote = () => {
        let newNote = {};
        const { showNote } = props.note;
        if (showNote && showNote.id) {
            newNote = { parentId: showNote.id, name: '新文档', text: ' ' };
        } else {
            message.error('请先选择一个笔记本');
            return;
        }
        props.onAddNote(newNote);
    };

    const toolbarMenu = (
        <Menu>
            <Menu.Item>
                <a onClick={addRootNote}>
                    增加分区
            </a>
            </Menu.Item>
            <Menu.Item>
                <a onClick={addNote}>
                    增加笔记
            </a>
            </Menu.Item>
        </Menu>
    );

    const onSearch = (e) => {
        if (e.keyCode === 13) {
            setAutoExpandParent(true);
            const expandedKeys = updateTreeData();
            setExpandedKeys(expandedKeys);

        }
    };

    const onExpand = (expandedKeys: string[]) => {
        setExpandedKeys(expandedKeys);
        setAutoExpandParent(false);
    };

    const onSelect = (ids: string[]) => {
        if (ids.length > 0) {
            props.dispatch({
                type: 'note/queryNote',
                payload: ids[0]
            })

        }
    };

    const loading = props.loading.effects["note/queryTabTree"];

    return (
        <>
            <div className={styles.toolbar}>
                <input
                    value={searchValue}
                    onChange={onSearchChange}
                    onKeyUp={onSearch}
                />
                <Dropdown overlay={toolbarMenu}>
                    <div>
                        <PlusOutlined />
                    </div>
                </Dropdown>
            </div>
            <Spin spinning={loading}>
                <div className={styles.tree}>
                    <Tree
                        onExpand={onExpand}
                        expandedKeys={expandedKeys}
                        autoExpandParent={autoExpandParent}
                        treeData={displayTreeData}
                        onSelect={onSelect}
                        selectedKeys={props.note.selectedKeys}
                    />
                </div>
            </Spin>
        </>
    );
}
export default connect(({ openNotes, note, loading }: { openNotes: OpenNoteState, note: NoteState, loading }) => (
    { openNotes, note, loading })
)(NoteTree);