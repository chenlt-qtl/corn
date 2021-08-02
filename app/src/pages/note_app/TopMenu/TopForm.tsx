import React, { useEffect } from 'react';

import { Modal, Form, Input, message } from 'antd';
import { updateNoteTitle } from '@/pages/note_app/service'
import { NoteItem } from '@/pages/note_app/data.d';



interface TopFormProps {
  modalVisible: boolean;
  onCancel: (needRefresh: boolean) => void;
  note: NoteItem;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 }
};

const TopForm: React.FC<TopFormProps> = (props) => {
  const { modalVisible, onCancel, note } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(note);
  }, [note])

  return (
    <Modal
      title="详细信息"
      visible={modalVisible}
      onCancel={() => onCancel(false)}
      style={{ top: 20 }}
      onOk={async () => {
        const fieldsValue = await form.validateFields();
        const noteToSave = { ...note, ...fieldsValue }
        const { success, message: msg } = await updateNoteTitle(noteToSave);
        if (success) {
          message.success('操作成功!');
          onCancel(true);
        } else {
          message.error(msg)
        }
      }}
    >
      <Form
        {...layout}
        form={form}
      >
        <Form.Item
          label="标题"
          name="name"
          rules={[{ required: true, message: 'Please input your title!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TopForm;
