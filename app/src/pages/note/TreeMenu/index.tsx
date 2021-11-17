import React, { useState, useEffect } from 'react';
import { Button, Tree, Spin, Modal, notification, Menu, Dropdown, Input, Form } from 'antd';
import { ClockCircleOutlined, StarFilled, PlusOutlined, CaretDownOutlined, DeleteOutlined, ExclamationCircleOutlined, FolderOutlined, FileMarkdownOutlined, EditOutlined, FolderOpenOutlined, BookOutlined } from '@ant-design/icons';
import styles from './style.less';
import { connect } from 'umi';
import { isNormalNoteId } from '@/utils/utils';


const { confirm } = Modal;

const { DirectoryTree } = Tree;
const FormItem = Form.Item;
let fold = {};

const LeftMenu: React.FC = (props, ref) => {

    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
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
        console.log("listParentNote", listParentNote);

        if (listParentNote.parentIds) {
            const expandedKeys = (listParentNote.parentIds || "").split("/")
            setExpandedKeys([listParentNote.id, ...expandedKeys])
        }
        const { id } = listParentNote;
        if (isNormalNoteId(id)) {
            setSelectedKeys([id])
        }
    }, [props.noteMenu.listParentNote]);


    const handleAddNote = ({ key }) => {
        if (key == "1") {//文件夹
            setIsModalVisible(true);
            form.setFieldsValue({ foldName: "" });
            fold = { parentId: props.noteMenu.listParentNote.id, isLeaf: false }
        } else {
            const newNote = { id: "new", name: "新文档", parentId: props.noteMenu.listParentNote.id, isLeaf: true };
            props.dispatch({
                type: "note/refreshOpenedNote",
                payload: newNote
            })
            props.dispatch({
                type: 'note/refreshOpenedNotes',
                payload: [newNote, ...props.note.openedNotes]
            })
        }
    }

    const menu = (
        <Menu onClick={handleAddNote}>
            <Menu.Item key="1" icon={<FolderOutlined />}>文件夹</Menu.Item>
            <Menu.Item key="2" icon={<FileMarkdownOutlined />}>笔记</Menu.Item>
        </Menu>
    );

    const handleSaveFold = async () => {
        console.log(fold);

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

        props.dispatch({
            type: 'noteMenu/refreshActiveMenuId',
            payload: "all",
        })
        const { key, title, isLeaf, parentIds } = node;

        props.onNoteClick({ id: key, name: title, parentIds, isLeaf })
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
        props.dispatch({
            type: 'noteMenu/refreshActiveMenuId',
            payload: type,
        })
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
        form.setFieldsValue({ foldName: node.name });
        fold = { id: node.key, ...node };
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

            <Spin spinning={loading} wrapperClassName={styles.content} >
                <div className={styles.toolbar}>
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button type="primary" shape="round" icon={<PlusOutlined />}>增加</Button>
                    </Dropdown>
                    {/* <Button type="primary" shape="round" icon={<DeleteOutlined />} onClick={handleDelete} danger>删除</Button> */}
                </div>

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
                                if (node.parentId == 0) {
                                    icon = <BookOutlined />;
                                } else {
                                    if (expandedKeys.includes(node.key)) {
                                        icon = <FolderOpenOutlined />;
                                    } else {
                                        icon = <FolderOutlined />;
                                    }
                                }
                                return <div className={styles.treeNode} onDrop={() => handleChangeParent(node.key)} onDragOver={(event) => {
                                    event.preventDefault();
                                }}><div className={styles.title}>{icon}{node.title}</div>
                                    <div className="noteTreeMenu" onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleRename(node)
                                    }} ><EditOutlined /></div>
                                    <div className="noteTreeMenu delete" onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleDelete(node)
                                    }}><DeleteOutlined /></div></div>
                            }}
                            // onExpand={onExpand}
                            autoExpandParent={true}
                            draggable={false}
                            onSelect={openNote}
                        />
                    </div>
                </div>
                <Modal title="请输入文件夹名称..." visible={isModalVisible} onOk={handleSaveFold} onCancel={() => setIsModalVisible(false)}>
                    <Form form={form}                    >
                        <FormItem name="foldName"
                            rules={[{ required: true, message: '请输入文件夹名称!' }]}>
                            <Input prefix={<FolderOutlined />} />
                        </FormItem>
                    </Form>
                </Modal>
            </Spin>

        );
    };
    return render();
};

export default connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu, loading }) => ({ note, noteMenu, loading }))(LeftMenu);
