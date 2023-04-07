import React, { useState, useEffect } from 'react';
import { Tree, Dropdown, Menu } from 'antd';
import { DeleteOutlined, EditOutlined, EllipsisOutlined, SwapOutlined } from '@ant-design/icons';
import styles from './style.less';
import { connect } from 'umi';
import { getNode } from '../../utils';

const NoteTree: React.FC = (props, ref) => {

    const { treeData, onDelete } = props;
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);


    useEffect(() => {
        const { selectedFolder } = props.note;
        if (selectedFolder.id) {
            const { id } = selectedFolder;
            expandNote({ ...selectedFolder, key: id })
        }

    }, [props.note.selectedFolder.id]);

    useEffect(() => {
        const { selectedTreeKey } = props.note;
        if (selectedTreeKey) {
            const note = getNode(selectedTreeKey, treeData)
            note && expandNote(note, true)
        }

    }, [props.note.selectedTreeKey]);

    useEffect(() => {
        const { openedNote } = props.note;

        if (openedNote.parentId) {
            const parent = getNode(openedNote.parentId, treeData)
            parent && expandNote({ ...parent, key: parent.id }, true)
            props.dispatch({ type: "note/refreshSelectedTreeKey", payload: openedNote.parentId })
        }

    }, [props.note.openedNote]);


    const handleExpand = (value) => {
        setExpandedKeys(value);
    }

    const getParentIds = (node, parentIds) => {
        const parent = getNode(node.parentId, treeData)
        if (parent) {
            return getParentIds(parent, [...parentIds, parent.id]);
        } else {
            return parentIds
        }

    }

    const onNodeSelect = (e, node) => {
        e && e.stopPropagation();
        props.dispatch({ type: "note/refreshSelectedFolder", payload: node })
        props.dispatch({ type: "note/refreshSelectedTreeKey", payload: node.id })
        expandNote(node)
    }

    /**
     * 展开节点
     * @param node 
     */
    const expandNote = (node, expand) => {
        if (node.id != "0") {
            let newExpandedKeys;
            if (expand) {
                newExpandedKeys = [...getParentIds(node, []), node.id]
            } else if (expandedKeys.includes(node.id)) {
                newExpandedKeys = expandedKeys.filter(i => i != node.id);
            } else {
                newExpandedKeys = [...getParentIds(node, []), node.id]
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
        const { selectedTreeKey } = props.note;

        return (
            <Tree
                selectedKeys={[selectedTreeKey]}
                blockNode
                multiple
                expandedKeys={expandedKeys}
                treeData={treeData}
                showIcon
                autoExpandParent={false}
                onExpand={handleExpand}
                titleRender={node => <div className={styles.treeNode} onClick={e => onNodeSelect(e, node)}>
                    <div className={styles.title}>&nbsp;{node.title}</div>
                    {node.id == "0" ? "" : <div onClick={e => e.stopPropagation()}><Dropdown overlay={operMenu(node)} trigger={['click']}><div className="noteTreeMenu" ><EllipsisOutlined /></div></Dropdown></div>}
                </div>
                }
            />
        );
    };
    return render();
};

export default connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(NoteTree);
