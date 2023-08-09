import React, { useState, useEffect } from 'react';
import styles from './style.less';
import { connect } from 'umi';
import EditFolderModal from '../../../components/EditFolderModal';
import AddBtn from '../../../components/AddBtn';
import NoteTree from './NoteTree';
import { Modal, notification } from "antd"
import { ExclamationCircleOutlined, MenuOutlined } from '@ant-design/icons';
import ChangeParentModal from '../../../components/ChangeParentModal';
import { NoteNode } from '@/data/note'
import { menuData, isFolder } from '../../../utils'
import { getFolderData } from '../../utils'

const { confirm } = Modal;

const MainMenu: React.FC = (props, ref) => {

    const { menuType } = props;

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
                }).then(() => {
                    notification["info"]({
                        message: '删除成功',
                    });
                    // loadTreeData();
                });
            }
        });
    }

    const togglerMenu = [{ icon: '&#xe8bf;', type: 2 }, { icon: '&#xe88e;', type: 1 }]


    const render = function () {
        const { listParent: { id }, treeSelectKey } = props.note;

        const { onChangeMenuType } = props;
        const min = menuType === 2;

        const activeIds = min ? [isFolder(id) ? "0" : id] : [id, treeSelectKey]


        return (

            <div className={`${styles.content} ${min ? styles.min : ""}`}>
                <div className={styles.toolbar}>
                    <MenuOutlined />
                    <AddBtn size={min ? "small" : ""} onAddFolder={onAddFolder}></AddBtn>
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
                        handleChangeParent={handleChangeParent}
                        onDelete={handleDelete}
                        treeData={treeData}
                        {...props}
                    ></NoteTree>
                </div>

                    <div className={styles.toggler}>
                        {togglerMenu.map(item =>
                            <div key={item.type} className={styles.btn} onClick={() => onChangeMenuType(item.type)}>
                                <span className='iconfont' dangerouslySetInnerHTML={{ __html: item.icon }}></span>
                            </div>
                        )}
                    </div>
                    <ChangeParentModal treeData={treeData} node={editNode} onCancel={() => setParentModalVisible(false)} visible={parentModalVisible}></ChangeParentModal>
                </>}
            </div >
        );
    };
    return render();
};

export default connect(({ note }: { note: NoteModelState }) => ({ note }))(MainMenu);
