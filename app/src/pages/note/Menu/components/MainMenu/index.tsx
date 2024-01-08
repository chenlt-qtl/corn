import React, { useState } from 'react';
import styles from './style.less';
import { connect } from 'umi';
import EditFolderModal from '../../../components/EditFolderModal';
import AddBtn from '../../../components/AddBtn';
import NoteTree from './NoteTree';
import { Button, Modal, notification } from "antd"
import { ExclamationCircleOutlined, MenuOutlined } from '@ant-design/icons';
import { menuData, isFolder } from '../../../utils'

const { confirm } = Modal;

const MainMenu: React.FC = (props, ref) => {

    const { menuType, onChangeParent } = props;

    const [folderModalVisible, setFolderModalVisible] = useState<boolean>(false);

    const [editNode, setEditNode] = useState<object>({});

    const handleRename = node => {
        setEditNode(node);
        setFolderModalVisible(true);
    }

    const onAddFolder = () => {
        const { listParent: { id } } = props.note;
        setEditNode({ parentId: id, isLeaf: false })
        setFolderModalVisible(true)
    }


    const handleDelete = (node) => {
        confirm({
            title: `确定要删除 ${node.name}?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {

                props.dispatch({
                    type: 'note/deleteNote',
                    payload: node.id,
                }).then(res => {
                    if (res.success) {
                        notification["info"]({
                            message: '删除成功',
                        });
                    }
                });
            }
        });
    }
    const toggleMenu = () => {
        props.onChangeMenuType(menuType === 3 ? 2 : 3)
    }

    const togglerMenu = [{ icon: '&#xe8bf;', type: 2 }, { icon: '&#xe88e;', type: 1 }]


    const render = function () {
        const { listParent: { id }, treeSelectKey } = props.note;
        const min = menuType == 2;

        const activeIds = min ? [isFolder(id) ? "0" : id] : [id, treeSelectKey]


        return (

            <div className={`${styles.content} ${min ? styles.min : ""}`}>
                <div className={styles.toolbar}>
                    <Button type="text" className={styles.menuToggle} onClick={toggleMenu}><MenuOutlined /></Button>
                    <AddBtn size={min ? "small" : ""} onAddFolder={onAddFolder}></AddBtn>
                    <div></div>
                    <EditFolderModal data={editNode} visible={folderModalVisible} onCancel={() => setFolderModalVisible(false)}></EditFolderModal>
                </div>
                {
                    menuData.filter(i => !i.hide).map(menu => <div key={menu.id} className={`${styles.menuItem} ${min ? styles.minMenuItem : ""} ${activeIds.includes(menu.id) ? styles.active : ""}`} onClick={() => {
                        props.dispatch({ type: "note/refreshListParent", payload: { id: menu.id } })
                        props.dispatch({ type: "note/refreshTreeSelectKey", payload: menu.id == "0" ? "0" : "" })
                    }}>
                        {menu.icon}
                        {min ? "" : menu.name}
                    </div>)
                }
                {min ? "" : <><div className={styles.tree}>
                    <NoteTree
                        handleRename={handleRename}
                        handleChangeParent={onChangeParent}
                        onDelete={handleDelete}
                        treeData={props.note.folderTreeData}
                        {...props}
                    ></NoteTree>
                </div>
                </>}
            </div >
        );
    };
    return render();
};

export default connect(({ note }: { note: NoteModelState }) => ({ note }))(MainMenu);
