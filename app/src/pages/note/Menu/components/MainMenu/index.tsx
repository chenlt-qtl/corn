import React, { useState, useEffect } from 'react';
import styles from './style.less';
import { connect } from 'umi';
import EditFolderModal from '../../../components/EditFolderModal';
import NoteTree from './NoteTree';
import { Modal, notification } from "antd"
import { ExclamationCircleOutlined, ClockCircleOutlined, FolderOutlined, FolderOpenOutlined, StarOutlined } from '@ant-design/icons';
import ChangeParentModal from '../../../components/ChangeParentModal';
import { NoteNode } from '@/data/note'
import { changeUrl } from '../../../utils'
import { getFolderData } from '../../utils'
import { getNode } from '../../utils';

const { confirm } = Modal;

const MainMenu: React.FC = (props, ref) => {

    const [folderModalVisible, setFolderModalVisible] = useState<boolean>(false);
    const [parentModalVisible, setParentModalVisible] = useState<boolean>(false);

    const [editNode, setEditNode] = useState<object>({});
    const [treeData, setTreeData] = useState<NoteNode[]>([]);

    useEffect(() => {
        if (props.note.noteTreeData) {
            setTreeData(getFolderData(props.note.noteTreeData));
        }
    }, [props.note.noteTreeData]);

    useEffect(() => {
        const { type } = props.match.params;
        if (type == "folder") {
            const { openedNote } = props.note;
            if (openedNote.parentId) {
                const parentNote = getNode(openedNote.parentId, props.note.noteTreeData);
                onSelectedFolder(parentNote)
            }
        }

    }, [props.match.params.type]);

    const handleRename = (node) => {
        setEditNode(node);
        setFolderModalVisible(true);
    }

    const handleChangeParent = (node) => {
        setEditNode(node);
        setParentModalVisible(true);
    }


    const handleDelete = (node) => {
        confirm({
            title: `确定要删除 ${node.title}?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {

                props.dispatch({
                    type: 'note/deleteNote',
                    payload: node.id,
                }).then(() => {
                    notification["info"]({
                        message: '删除成功',
                    });
                    // loadTreeData();
                });
            }
        });
    }

    const onSelectedFolder = note => {
        console.log(1626);
        
        props.dispatch({ type: "note/refreshSelectedFolder", payload: note })
    }


    const render = function () {
        const { type } = props.match.params;
        const { selectedFolder } = props.note;

        return (

            <div className={styles.content}>
                <div className={styles.toolbar}>
                    <EditFolderModal visible={folderModalVisible} parentId={selectedFolder.id} node={editNode} onCancel={() => setFolderModalVisible(false)}></EditFolderModal>
                </div>
                <div className={`${styles.menuItem} ${type == "fav" ? styles.active : ""}`} onClick={() => {
                    changeUrl(props, "type", "fav")
                }}>
                    <StarOutlined />
                    {/* <i className="fa fa-star-o"></i> */}
                    收藏夹
                </div>
                <div className={`${styles.menuItem} ${type == "history" ? styles.active : ""}`} onClick={() => {
                    changeUrl(props, "type", "history")
                }}>
                    <ClockCircleOutlined />
                    最近打开
                </div>
                <div className={`${styles.menuItem} ${type == "folder" && !selectedFolder.id ? styles.active : ""}`} onClick={() => {
                    changeUrl(props, "type", "folder");
                    onSelectedFolder({})
                }}>
                    {type == "folder" ? <FolderOpenOutlined /> : <FolderOutlined />}
                    文件夹
                </div>
                {type == "folder" ?
                    <div className={styles.tree}>
                        <NoteTree
                            handleRename={handleRename}
                            handleChangeParent={handleChangeParent}
                            onDelete={handleDelete}
                            treeData={treeData}
                        ></NoteTree>
                    </div> : ""}
                <ChangeParentModal treeData={treeData} node={editNode} onCancel={() => setParentModalVisible(false)} visible={parentModalVisible}></ChangeParentModal>
            </div >
        );
    };
    return render();
};

export default connect(({ note }: { note: NoteModelState }) => ({ note }))(MainMenu);
