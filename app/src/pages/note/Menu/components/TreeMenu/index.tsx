import React, { useState, useEffect } from 'react';
import styles from './style.less';
import { connect, history } from 'umi';
import { queryTreeMenu } from '@/services/note'
import EditFolderModal from '../../../components/EditFolderModal';
import NoteTree from './NoteTree';
import { Spin, Modal, notification } from "antd"
import { StarOutlined, FolderOutlined, ExclamationCircleOutlined, FolderOpenOutlined } from '@ant-design/icons';
import ChangeParentModal from '../../../components/ChangeParentModal';
import { NoteNode } from '@/data/note'
import { changeUrl } from '../../../utils'
import { getFolderData } from '../../utils'

const { confirm } = Modal;

const TreeMenu: React.FC = (props, ref) => {

    const [folderModalVisible, setFolderModalVisible] = useState<boolean>(false);
    const [parentModalVisible, setParentModalVisible] = useState<boolean>(false);

    const [editNode, setEditNode] = useState<object>({});
    const [treeData, setTreeData] = useState<NoteNode[]>([]);

    useEffect(() => {
        if (props.note.noteTreeData) {
            setTreeData(getFolderData(props.note.noteTreeData));
        }
    }, [props.note.noteTreeData]);

    const handleRename = (node) => {
        setFolderModalVisible(true);
        setEditNode(node);
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
                    payload: node.key,
                }).then(() => {
                    notification["info"]({
                        message: '删除成功',
                    });
                    // loadTreeData();
                });
            }
        });
    }


    const render = function () {
        const { type } = props.match.params;
        const { selectFolder = {}, onSelectFolder } = props;

        return (

            <div className={styles.content}>
                <div className={styles.toolbar}>
                    <EditFolderModal visible={folderModalVisible} parentId={selectFolder.id} node={editNode} onCancel={() => setFolderModalVisible(false)}></EditFolderModal>
                </div>
                <div className={`${styles.menuItem} ${type == "fav" ? styles.active : ""}`} onClick={() => {
                    changeUrl(props, "type", "fav")
                }}>
                    {/* <StarOutlined /> */}
                    <i className="fa fa-star-o"></i>
                    收藏夹
                </div>
                <div className={`${styles.menuItem} ${type == "folder" && !selectFolder.id ? styles.active : ""}`} onClick={() => {
                    changeUrl(props, "type", "folder");
                    onSelectFolder({})
                }}>
                    {type == "fav" ? <i className="fa fa-folder-o"></i> : <i className="fa fa-folder-open-o"></i>}
                    文件夹
                </div>
                {type == "folder" ?
                    <div className={styles.tree}>
                        <NoteTree
                            handleRename={handleRename}
                            handleChangeParent={handleChangeParent}
                            selectFolder={selectFolder}
                            onSelectFolder={onSelectFolder}
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

export default connect(({ note }: { note: NoteModelState }) => ({ note }))(TreeMenu);
