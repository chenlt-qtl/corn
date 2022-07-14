import React, { useState, useEffect } from 'react';
import { Tree, Spin, Modal, notification } from 'antd';
import { FileTextOutlined, DeleteOutlined, ExclamationCircleOutlined, FolderOutlined, EditOutlined, FolderOpenOutlined, FolderFilled, FolderOpenFilled } from '@ant-design/icons';
import styles from './style.less';
import { connect } from 'umi';
import EditFolderModal from '../components/EditFolderModal';
import { queryTreeMenu } from '@/services/note'
import { NoteNode } from '@/data/note';



const { confirm } = Modal;

const { DirectoryTree } = Tree;

const TreeMenu: React.FC = (props, ref) => {

    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [renameNode, setRenameNode] = useState<object>({});
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

    const [treeData, setTreeData] = useState<NoteNode[]>([])


    useEffect(() => {
        queryTreeMenu("0", true).then(({ result }) => setTreeData(result))
    }, []);

    useEffect(() => {

        queryTreeMenu("0", true).then(({ result }) => setTreeData(result))

    }, [props.note.treeKey]);

    useEffect(() => {
        const { openedNoteId, openedNotes } = props.note;

        const openedNote = openedNotes[openedNoteId];

        if (openedNote && openedNote.parentIds) {
            const expandedKeys = (openedNote.parentIds || "").split("/")

            setExpandedKeys([openedNoteId, ...expandedKeys])
        }
        setSelectedKeys([openedNoteId]);

    }, [props.note.openedNoteId]);


    const handleExpand = value => {
        setExpandedKeys(value);
    }

    const openNote = (_, { node }) => {

        const { key, title, isLeaf, parentIds, parentId } = node;

        if (isLeaf) {
            props.onNoteClick({ id: key, name: title, parentIds, isLeaf, parentId })
        } else {

            props.dispatch({
                type: 'note/refreshListParentNote',
                payload: { id: key, name: title }
            })

            setSelectedKeys([key]);
        }


    }


    const handleDelete = node => {
        confirm({
            title: `确定要删除 ${node.title}?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {

                props.dispatch({
                    type: 'note/deleteNote',
                    payload: { id: node.key, isLeaf: node.isLeaf, parentIds: node.parentIds, parentId: node.parentId },
                }).then(() => {
                    notification["info"]({
                        message: '删除成功',
                    });
                });
            }
        });
    }

    const handleRename = node => {
        setIsModalVisible(true);
        setRenameNode(node);
    }

    const onDrop: TreeProps['onDrop'] = ({ node, dragNode }) => {

        const newParentId = node.key;
        if (dragNode && dragNode.parentId != newParentId && dragNode.key != newParentId) {
            props.dispatch({
                type: 'note/updateParent',
                payload: { id: dragNode.key, parentId: newParentId },
            })
        }
    }


    const render = function () {

        const loading = props.loading.effects["note/queryMenuTree"] || false;

        return (

            <div className={styles.content}>

                <EditFolderModal visible={isModalVisible} node={renameNode} onCancel={() => setIsModalVisible(false)}></EditFolderModal>

                <div className={styles.tree}>
                    <DirectoryTree
                        selectedKeys={selectedKeys}
                        blockNode
                        multiple
                        showIcon={false}
                        expandedKeys={expandedKeys}
                        treeData={treeData}
                        onExpand={handleExpand}
                        titleRender={node => {
                            let icon;
                            const style = { color: 'rgba(0, 0, 0, 0.5)' };

                            if (node.isLeaf) {
                                icon = <FileTextOutlined />;
                            } else if (expandedKeys.includes(node.key)) {

                                if (node.parentId == 0) {
                                    icon = <FolderOpenFilled style={style} />;

                                } else {
                                    icon = <FolderOpenOutlined />;
                                }
                            } else {
                                if (node.parentId == 0) {
                                    icon = <FolderFilled style={style} />;

                                } else {
                                    icon = <FolderOutlined />;
                                }
                            }

                            return <div className={styles.treeNode}>
                                <div className={styles.title}>{icon}{node.title}</div>
                                <div className="noteTreeMenu" onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleRename(node)
                                }} ><EditOutlined /></div>
                                <div className="noteTreeMenu delete" onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDelete(node)
                                }}><DeleteOutlined /></div>
                            </div>
                        }}
                        autoExpandParent
                        draggable
                        onSelect={openNote}
                        onDrop={onDrop}
                    />
                </div>
            </div>
        );
    };
    return render();
};

export default connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(TreeMenu);
