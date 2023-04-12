import React, { useState, useEffect } from 'react';
import styles from './style.less';
import { connect } from 'umi';
import EditFolderModal from '../../../components/EditFolderModal';
import NoteTree from './NoteTree';
import { Modal, notification } from "antd"
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ChangeParentModal from '../../../components/ChangeParentModal';
import { NoteNode } from '@/data/note'
import { changeUrl, menuData } from '../../../utils'
import { getFolderData } from '../../utils'

const { confirm } = Modal;

const MainMenu: React.FC = (props, ref) => {

    const [folderModalVisible, setFolderModalVisible] = useState<boolean>(false);
    const [parentModalVisible, setParentModalVisible] = useState<boolean>(false);

    const [editNode, setEditNode] = useState<object>({});
    const [treeData, setTreeData] = useState<NoteNode[]>([]);

    useEffect(() => {
        if (props.note.noteTreeData.length > 0) {
            setTreeData(getFolderData(props.note.noteTreeData));
        }
    }, [props.note.noteTreeData]);

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

    const render = function () {
        const { selectedType } = props.note;
        return (

            <div className={styles.content}>
                <div className={styles.toolbar}>
                    <EditFolderModal visible={folderModalVisible} parentId={selectedType} node={editNode} onCancel={() => setFolderModalVisible(false)}></EditFolderModal>
                </div>
                {
                    menuData.map(menu => <div key={menu.id} className={`${styles.menuItem} ${selectedType == menu.id ? styles.active : ""}`} onClick={() => {
                        changeUrl(props, "type", menu.id)
                        if (menu.id == "folder") {
                            props.dispatch({
                                type: 'note/refreshSelectedType',
                                payload: "folder",
                            })
                        }
                    }}>
                        {menu.icon}
                        {menu.name}
                    </div>)
                }

                <div className={styles.tree}>
                    <NoteTree
                        handleRename={handleRename}
                        handleChangeParent={handleChangeParent}
                        onDelete={handleDelete}
                        treeData={treeData}
                        {...props}
                    ></NoteTree>
                </div>
                <ChangeParentModal treeData={treeData} node={editNode} onCancel={() => setParentModalVisible(false)} visible={parentModalVisible}></ChangeParentModal>
            </div >
        );
    };
    return render();
};

export default connect(({ note }: { note: NoteModelState }) => ({ note }))(MainMenu);
