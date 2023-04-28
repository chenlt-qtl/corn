import React, { useState } from 'react';
import { Button, Modal, Menu, Dropdown, Input, Form } from 'antd';
import { PlusOutlined, FolderOutlined, FileMarkdownOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import HocMedia from "@/components/HocMedia";
import { changeUrl } from '../../utils'
import styles from './styles.less'

const FormItem = Form.Item;
let fold = {};

const EditFolder: React.FC = (props, ref) => {

    const { parentId, size } = props;

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [form] = Form.useForm();


    if (props.visible && !isModalVisible) {
        setIsModalVisible(true);
        const node = props.node || {};

        form.setFieldsValue({ foldName: node.name });
        fold = node;
    }


    const handleAddNote = ({ key }) => {
        if (key == "1") {//文件夹
            setIsModalVisible(true);
            form.setFieldsValue({ foldName: "" });
            fold = { parentId, isLeaf: false }
        } else {
            const newNote = { id: "new", name: "新文档", parentId, isLeaf: true, isNew: true };
            const { openedNotes } = props.note;
            props.dispatch({
                type: 'note/refreshOpenedNotes',
                payload: { ...openedNotes, newNote }
            })
            changeUrl(props, "add")

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

        const small = size == "small";

        return (

            <div className={props.className}>
                <div className={small ? styles.small : ""}>
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button type={small ? "link" : "primary"} shape="round" icon={<PlusOutlined />}>{small ? "" : "增加"}</Button>
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

export default HocMedia(connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(EditFolder));
