import React, { useState } from 'react';
import { Button, Modal, Menu, Dropdown, Input, Form } from 'antd';
import { PlusOutlined, FolderOutlined, FileMarkdownOutlined } from '@ant-design/icons';
import styles from './style.less';
import { connect } from 'umi';


const FormItem = Form.Item;
let fold = {};

const AddBtn: React.FC = (props, ref) => {

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [form] = Form.useForm();


    if (props.visible && !isModalVisible) {
        setIsModalVisible(true);
        const node = props.node || {};

        form.setFieldsValue({ foldName: node.name });
        fold = { id: node.key, ...node };
    }


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

        const { foldName } = await form.validateFields();

        props.dispatch({
            type: "note/updateNoteTitle",
            payload: { ...fold, name: foldName }
        })

        props.onCancel();
        setIsModalVisible(false)
    }


    const render = function () {

        return (

            <div className={props.className}>
                <div className={styles.toolbar}>
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button type="primary" shape="round" icon={<PlusOutlined />}>增加</Button>
                    </Dropdown>
                </div>
                <Modal title="请输入文件夹名称..." visible={isModalVisible} onOk={handleSaveFold}
                    onCancel={() => {
                        props.onCancel();
                        setIsModalVisible(false)
                    }}>
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

export default connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu, loading }) => ({ note, noteMenu, loading }))(AddBtn);
