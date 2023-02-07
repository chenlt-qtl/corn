import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, message, Button } from 'antd';
import { updateIngredient, createIngredient } from '@/services/food';



interface editProps {
    modalVisible: boolean;
    onCancel: (reload: boolean) => void;
    data: API.Recipe
}

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 }
};


const EditForm = React.forwardRef((props: editProps, ref) => {
    const { modalVisible, onCancel, data = {} } = props;

    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(data);
    }, [data])

    const handleSave = async () => {
        setConfirmLoading(true);

        let formData = await form.validateFields();
        let method = data.id ? updateIngredient : createIngredient;
        const res = await method({ ...data, ...formData });
        setConfirmLoading(false);
        if (res && res.success) {
            message.success("操作成功")
            onCancel(true);
        } else {
            message.error('保存失败');
        }

    }


    return (
        <Modal
            title="明细"
            visible={modalVisible}
            onCancel={() => { onCancel(false) }}
            style={{ top: 20 }}
            confirmLoading={confirmLoading}
            footer={[<Button key="cancel" onClick={() => { onCancel(false) }}>取消</Button>,
            <Button type="primary" loading={confirmLoading} onClick={handleSave} key="submit">保存</Button>]}
        >
            <Form
                {...layout}
                form={form}
            >
                <Form.Item
                    label="名称"
                    name="name"
                    rules={[{ required: true, message: '请输入名称' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="保质期"
                    name="expirationDate"
                    rules={[{ required: true, message: '请输入保质期' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
});

export default EditForm;
