import React, { useState } from 'react';
import { Tree, Input, Spin, Menu, Dropdown } from 'antd';
import styles from './index.less'
import { useModel } from 'umi';
import { PlusOutlined } from '@ant-design/icons';

const NoteTree: React.FC<{}> = (props) => {

    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

    const { setTreeData, treeData, noteData, treeLoading, loadNote, searchValue, setSearchValue } =
        useModel('note', ({ setTreeData, treeData, noteData, treeLoading, loadNote, searchValue, setSearchValue }) =>
            ({ setTreeData, treeData, noteData, treeLoading, loadNote, searchValue, setSearchValue }));

    const onSearchChange = (e) => {
        setSearchValue(e.target.value);
    };



    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={props.addRootNote}>
                    增加分区
            </a>
            </Menu.Item>
            <Menu.Item>
                <a onClick={props.addNote}>
                    增加笔记
            </a>
            </Menu.Item>
        </Menu>
    );

    const onSearch = (e) => {
        if (e.keyCode === 13) {
            setAutoExpandParent(true);
            const { keys, treeData } = getSearchResult(noteData, searchValue);
            setExpandedKeys(Array.from(new Set(keys)));
            setTreeData(treeData);
        }
    };

    const onExpand = (expandedKeys: string[]) => {
        setExpandedKeys(expandedKeys);
        setAutoExpandParent(false);
    };

    //设置搜索结果
    const getSearchResult = (data, searchValue) => {
        const keys = [];
        if (!searchValue || searchValue.trim() === '') {
            return { treeData: data, keys };
        }
        const treeData = data.reduce((total, item) => {
            let children = [];
            if (item.children) {
                const childrenData = getSearchResult(item.children, searchValue);
                children = childrenData.treeData;
                keys.push(...childrenData.keys);
            }
            const index = item.name.toLowerCase().indexOf(searchValue.trim().toLowerCase());
            if (index > -1 || children.length > 0) {
                let title;
                keys.push(...item.parentIds.split('/'));
                if (index > -1) {
                    const beforeStr = item.name.substr(0, index);
                    const afterStr = item.name.substr(index + searchValue.length);
                    title = (<span>
                        {beforeStr}
                        <span className={styles.found}>{searchValue}</span>
                        {afterStr}
                    </span>);
                } else {
                    title = <span>{item.name}</span>;
                }
                if (children.length > 0) {
                    total.push({ ...item, title, children });
                } else {
                    total.push({ ...item, title });
                }
            }
            return total;
        }, []);
        return { treeData, keys };
    };

    return (
        <>
            <div className={styles.toolbar}>
                <input
                    value={searchValue}
                    onChange={onSearchChange}
                    onKeyUp={onSearch}
                />
                <Dropdown overlay={menu}>
                    <div>
                        <PlusOutlined />
                    </div>
                </Dropdown>
            </div>
            <Spin spinning={treeLoading}>
                <Tree
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    treeData={treeData}
                    onSelect={loadNote}
                />
            </Spin>
        </>
    );
}
export default NoteTree;