import React, { useState, useEffect } from 'react';
import { Tree, Dropdown, Menu } from 'antd';
import { DeleteOutlined, EditOutlined, EllipsisOutlined, SwapOutlined } from '@ant-design/icons';
import styles from './style.less';
import { connect } from 'umi';
import { getNode } from '../../utils';

const NoteTree: React.FC = (props, ref) => {

    const { treeData, onDelete } = props;
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

    useEffect(() => {
        const { defaultTreeValue } = props.note;
        expandNote({ key: defaultTreeValue }, true)
        setSelectedKeys([defaultTreeValue])
    }, [props.note.defaultTreeValue]);

    const handleExpand = (value) => {
        setExpandedKeys(value);
    }

    const getParentKeys = ({ key }, parentKeys) => {
        const node = getNode(key, treeData)
        if (node) {
            return getParentKeys({ key: node.parentId }, [...parentKeys, node.key]);
        } else {
            return parentKeys
        }

    }

    const onNodeSelect = (e, node) => {
        e && e.stopPropagation();
        expandNote({ key: node.key })
        setSelectedKeys([String(node.id)])
        props.dispatch({ type: 'note/refreshListParentId', payload: node.key })

    }

    /**
     * 展开节点
     * @param node 
     */
    const expandNote = (node, expand = false) => {

        if (node.key != "0") {
            let newExpandedKeys;
            if (expand) {
                newExpandedKeys = [...getParentKeys(node, []), node.key]
            } else if (expandedKeys.includes(node.key)) {
                newExpandedKeys = expandedKeys.filter(i => i != node.key);
            } else {
                newExpandedKeys = [...getParentKeys(node, []), node.key]
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
            <>
                {
                    treeData.length > 0 ? <Tree
                        selectedKeys={selectedKeys}
                        blockNode
                        multiple
                        expandedKeys={expandedKeys}
                        treeData={treeData}
                        showIcon
                        autoExpandParent={false}
                        onExpand={handleExpand}
                        titleRender={node => <div className={styles.treeNode} onClick={e => onNodeSelect(e, node)}>
                            <div className={styles.title}>&nbsp;{node.title}</div>
                            {node.id == "0" ? "" : <div className={styles.treeBtn} onClick={e => e.stopPropagation()}><Dropdown overlay={operMenu(node)} trigger={['click']}><div className="noteTreeMenu" ><EllipsisOutlined /></div></Dropdown></div>}
                        </div>
                        }
                    /> : ""
                }
            </>
        );
    };
    return render();
};

export default connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(NoteTree);
