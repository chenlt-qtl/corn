import React, { useState, useEffect } from 'react';
import { Tree, Dropdown, Menu } from 'antd';
import { DeleteOutlined, EditOutlined, EllipsisOutlined, SwapOutlined } from '@ant-design/icons';
import styles from './style.less';
import { connect } from 'umi';
import { getNode } from '../../utils';

const NoteTree: React.FC = (props, ref) => {

    const { treeData, onDelete, selectFolder, onSelectFolder } = props;
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);


    useEffect(() => {
        if (props.selectFolder.id) {
            const { id } = props.selectFolder;
            expandNote({ ...props.selectFolder, key: id })
        }

    }, [props.selectFolder]);

    useEffect(() => {
        const { openedNote } = props.note;

        if (openedNote.parentId) {
            const parent = getNode(openedNote.parentId, treeData)
            parent && onNodeSelect(null, parent)
        }

    }, [props.note.openedNote]);


    const handleExpand = (value) => {
        setExpandedKeys(value);
    }

    const getParentIds = (node, parentIds) => {
        const parent = getNode(node.parentId, treeData)
        if (parent) {
            return getParentIds(parent, [...parentIds, parent.key]);
        } else {
            return parentIds
        }

    }

    const onNodeSelect = (e, node) => {

        e && e.stopPropagation();
        onSelectFolder({ ...node, id: node.key })
    }

    /**
     * 展开节点
     * @param node 
     */
    const expandNote = node => {
        if (node.key != "0") {
            let newExpandedKeys;
            if (expandedKeys.includes(node.key)) {
                newExpandedKeys = expandedKeys.filter(i => i != node.key);
            } else {
                newExpandedKeys = [...getParentIds(node, []), node.key]
            }

            setExpandedKeys(newExpandedKeys)
        }

    }


    const operMenu = node => (
        <Menu>
            <Menu.Item onClick={e => props.handleRename(node)}>
                <EditOutlined />&nbsp;&nbsp;重命名
            </Menu.Item>
            <Menu.Item onClick={e => props.handleChangeParent(node)}>
                <SwapOutlined />&nbsp;&nbsp;移动
            </Menu.Item>
            <Menu.Item onClick={e => onDelete(node)}>
                <DeleteOutlined />&nbsp;&nbsp;删除
            </Menu.Item>
        </Menu>
    );


    const render = function () {
        return (
            <Tree
                selectedKeys={[selectFolder.id]}
                blockNode
                multiple
                expandedKeys={expandedKeys}
                treeData={treeData}
                showIcon
                autoExpandParent={false}
                onExpand={handleExpand}
                titleRender={node => <div className={styles.treeNode} onClick={e => onNodeSelect(e, node)}>
                    <div className={styles.title}>&nbsp;{node.title}</div>
                    {node.key == "0" ? "" : <div onClick={e => e.stopPropagation()}><Dropdown overlay={operMenu(node)} trigger={['click']}><div className="noteTreeMenu" ><EllipsisOutlined /></div></Dropdown></div>}
                </div>
                }
            />
        );
    };
    return render();
};

export default connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(NoteTree);
