import React, { useState, useEffect } from 'react';
import { Modal, Input, Form } from 'antd';
import { FolderOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import HocMedia from "@/components/HocMedia";

const FormItem = Form.Item;

const EditFolder: React.FC = (props, ref) => {

    const [form] = Form.useForm();

    useEffect(() => {
        const node = props.data || {};
        form.setFieldsValue({ foldName: node.name });
    }, [props.visible]);

    const handleSaveFold = async () => {

        const { foldName } = await form.validateFields();
        const data = { ...props.data, name: foldName }
        let type = data.id ? "note/updateNoteTitle" : "note/addNote"

        props.dispatch({ type, payload: data }).then(res => {
            if (res && res.success) {
                props.onCancel();
            }
        })

    }


    const render = function () {
        return (
            <Modal title="请输入文件夹名称..." visible={props.visible} onOk={handleSaveFold}
                onCancel={() => {
                    props.onCancel();
                }}>
                <Form form={form}                    >
                    <FormItem name="foldName"
                        rules={[{ required: true, message: '请输入文件夹名称!' }]}>
                        <Input prefix={<FolderOutlined />} />
                    </FormItem>
                </Form>
            </Modal>
        );
    };
    return render();
};

export default HocMedia(connect(({ note }: { note: NoteModelState }) => ({ note }))(EditFolder));
