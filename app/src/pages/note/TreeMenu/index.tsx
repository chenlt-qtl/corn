import React, { useState, useEffect } from 'react';
import { Button, Tree, Spin, Modal, notification, Menu, Dropdown, Input, Form } from 'antd';
import { ClockCircleOutlined, StarFilled, PlusOutlined, CaretDownOutlined, DeleteOutlined, ExclamationCircleOutlined, FolderOutlined, FileMarkdownOutlined, EditOutlined, FolderOpenOutlined, FolderFilled, FolderOpenFilled } from '@ant-design/icons';
import styles from './style.less';
import { connect } from 'umi';
import { isNormalNoteId } from '@/utils/utils';
import EditFolderModal from '../components/EditFolderModal';

const { confirm } = Modal;

const { DirectoryTree } = Tree;
const FormItem = Form.Item;
let fold = {};

const LeftMenu: React.FC = (props, ref) => {

    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [renameNode, setRenameNode] = useState<object>({});
    const [form] = Form.useForm();


    useEffect(() => {
        getTreeData();
        props.dispatch({
            type: `noteMenu/refreshActiveMenu`,
            payload: {}
        })
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



    const handleSaveFold = async () => {

        const { foldName } = await form.validateFields();

        props.dispatch({
            type: "note/updateNoteTitle",
            payload: { ...fold, name: foldName }
        }).then(() => {
            getTreeData();
        })
        setIsModalVisible(false)

    }

    const getTreeData = () => {
        return props.dispatch({
            type: `noteMenu/queryMenuTree`,
            payload: 0,
        })
    }

    const handleExpand = value => {
        setExpandedKeys(value);
    }

    const openNote = (_, { node }) => {

        const { key, title, isLeaf, parentIds, parentId } = node;

        props.onNoteClick({ id: key, name: title, parentIds, isLeaf, parentId })
    }


    const handleMenuClick = (type: string) => {
        let name = "";
        let id = "0";
        if (type == "newest") {
            name = "最新文档"
            id = "newest";

        } else {
            if (type == "fav") {
                name = "收藏夹"
                id = "fav";
            }
        }

        const { listParentNote } = props.noteMenu;
        if (listParentNote.id != id) {
            props.dispatch({
                type: 'noteMenu/refreshListParentNote',
                payload: { id, name }
            })
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
        const { treeData, activeMenuId } = props.noteMenu;


        const loading = props.loading.effects["note/queryMenuTree"] || false;

        const menuItems = [{ key: 'newest', text: <><ClockCircleOutlined />最新文档</> },
        { key: 'fav', text: <><StarFilled className={styles.favorate} />收藏夹</> },
        { key: 'all', text: <><CaretDownOutlined />所有笔记</> }]

        return (

            <div className={styles.content} style={props.style}>

                <EditFolderModal visible={isModalVisible} node={renameNode} onCancel={() => setIsModalVisible(false)}></EditFolderModal>

                <div className={styles.menu}>
                    {menuItems.map(item =>
                        <div key={item.key} className={`${styles.menuItem} ${item.key == activeMenuId ? styles.activeMenu : ""}`} onClick={() => handleMenuClick(item.key)} >{item.text}</div>
                    )}
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

                                if (expandedKeys.includes(node.key)) {

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
                <Modal title="请输入文件夹名称..." visible={false} onOk={handleSaveFold} onCancel={() => setIsModalVisible(false)}>
                    <Form form={form}                    >
                        <FormItem name="foldName"
                            rules={[{ required: true, message: '请输入文件夹名称!' }]}>
                            <Input prefix={<FolderOutlined />} />
                        </FormItem>
                    </Form>
                </Modal>
            </div>

        );
    };
    return render();
};

export default connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu, loading }) => ({ note, noteMenu, loading }))(LeftMenu);
