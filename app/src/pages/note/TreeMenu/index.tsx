import React, { useState, useEffect } from 'react';
import { Button, Tree, Spin, Modal, notification, Menu, Dropdown, Input, Form } from 'antd';
import { ClockCircleOutlined, StarFilled, PlusOutlined, FileTextOutlined, DeleteOutlined, ExclamationCircleOutlined, FolderOutlined, FileMarkdownOutlined, EditOutlined, FolderOpenOutlined, FolderFilled, FolderOpenFilled } from '@ant-design/icons';
import styles from './style.less';
import { connect } from 'umi';
import { isNormalNoteId } from '@/utils/utils';
import EditFolderModal from '../components/EditFolderModal';
import { queryTreeMenu } from '@/services/note'
import { NoteNode } from '@/data/note';



const { confirm } = Modal;

const { DirectoryTree } = Tree;

const LeftMenu: React.FC = (props, ref) => {

    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [renameNode, setRenameNode] = useState<object>({});

    const [treeData, setTreeData] = useState<NoteNode[]>([])


    useEffect(() => {
        queryTreeMenu("0").then(({ result }) => setTreeData(result))
    }, []);

    useEffect(() => {
        const { listParentNote } = props.noteMenu;

        if (listParentNote.parentIds) {
            const expandedKeys = (listParentNote.parentIds || "").split("/")
            setExpandedKeys([listParentNote.id, ...expandedKeys])
        }
        const { id } = listParentNote;
        if (isNormalNoteId(id)) {
            setSelectedKeys([id])
        }
    }, [props.noteMenu.listParentNote]);


    const handleExpand = value => {
        setExpandedKeys(value);
    }

    const openNote = (_, { node }) => {

        const { key, title, isLeaf, parentIds, parentId } = node;

        props.onNoteClick({ id: key, name: title, parentIds, isLeaf, parentId })
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

    const handleChangeParent = (newParent: string) => {
        const dragNote = props.getDragNote();

        if (dragNote && dragNote.parentId != newParent && dragNote.id != newParent) {
            props.dispatch({
                type: 'note/updateParent',
                payload: { ...dragNote, parentId: newParent },
            })
        }

    }


    const render = function () {

        const loading = props.loading.effects["note/queryMenuTree"] || false;
        console.log(treeData);


        return (

            <div className={styles.content}>

                <EditFolderModal visible={isModalVisible} node={renameNode} onCancel={() => setIsModalVisible(false)}></EditFolderModal>

                <div className={styles.tree}>
                    <DirectoryTree
                        selectedKeys={selectedKeys}
                        blockNode={true}
                        multiple
                        showIcon={false}
                        expandedKeys={expandedKeys}
                        treeData={treeData}
                        onExpand={handleExpand}
                        titleRender={node => {
                            let icon;
                            const style = { color: 'rgba(0, 0, 0, 0.5)' };

                            console.log(node);
                            
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

                            return <div className={styles.treeNode} onDrop={() => handleChangeParent(node.key)} onDragOver={(event) => {
                                event.preventDefault();
                            }}>
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
                        // onExpand={onExpand}
                        autoExpandParent={true}
                        draggable={false}
                        onSelect={openNote}
                    />
                </div>
            </div>
        );
    };
    return render();
};

export default connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu, loading }) => ({ note, noteMenu, loading }))(LeftMenu);
