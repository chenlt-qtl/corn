import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, message, Button } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { update } from '@/services/card';



interface editProps {
    modalVisible: boolean;
    onCancel: (reload: boolean) => void;
    data: API.SysData
}

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 }
};

const tabsReg = /^([^,，\s]+,)*[^,，\s]+$/;



const EditModal = React.forwardRef((props: editProps, ref) => {
    const { modalVisible, onCancel, data = {} } = props;

    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

    const [step, setStep] = useState<number>(0);

    const [form] = Form.useForm();

    const [tabs, setTabs] = useState<string[]>([]);


    useEffect(() => {
        console.log(data.value);

        if (data.value) {
            const json = JSON.parse(data.value)
            const { tabs } = json;
            setTabs(tabs)
            form.setFieldsValue({ tabs: tabs.join(",") });
        }
    }, [data])

    const next = async () => {
        let formData = await form.validateFields();
        setTabs(formData.tabs.split(","))

        if (data.value) {
            const json = JSON.parse(data.value)
            const { value } = json;
            const formValue = {};

            form.setFieldsValue((value || []).map((str, index) => formValue[index] = str));
        }
        setStep(1)
    }

    const handleSave = async () => {
        setConfirmLoading(true);

        let formData = await form.validateFields();
        const value: string[] = [];
        Object.keys(formData).map(key => value[key] = formData[key])

        const res = await update({ ...data, value: JSON.stringify({ tabs, value }) });
        setConfirmLoading(false);
        if (res && res.success) {
            message.success("操作成功")
            cancel(true);
        } else {
            message.error('保存失败');
        }

    }

    const cancel = (reload: boolean) => {
        setStep(0);
        onCancel(reload);
    }


    return (
        <Modal
            title="修改数据"
            visible={modalVisible}
            onCancel={() => { cancel(false) }}
            style={{ top: 20 }}
            confirmLoading={confirmLoading}
            footer={[<Button key="cancel" onClick={() => { cancel(false) }}>取消</Button>,
            step == 0 ? <Button key="next" onClick={next} type="primary">下一步</Button> : <Button type="primary" loading={confirmLoading} onClick={handleSave} key="submit">提交</Button>]}
        >
            <Form
                {...layout}
                form={form}
                name="card"
            >
                {step == 0 ? <Form.Item
                    label="标签"
                    name="tabs"
                    rules={[{ required: true, message: '请输入标签' }, { pattern: tabsReg, message: "使用英文逗号隔开，中间不要有空格和中文逗号" }]}
                >
                    <Input />
                </Form.Item> : tabs.map((tab, index) => <Form.Item
                    label={tab}
                    name={index}
                    rules={[{ required: true, message: '请输入内容' }]}
                >
                    <TextArea rows={3} />
                </Form.Item>)
                }
            </Form>
        </Modal>
    );
});

export default EditModal;
