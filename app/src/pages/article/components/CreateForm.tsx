import React, { useState, useImperativeHandle } from 'react';

import { Modal, Form, Input, message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { addArticle, updateArticle } from '../service';
import { ArticleItem } from '../data'
import ImgUpload from './ImgUpload'
import Mp3Upload from './Mp3Upload'



interface CreateFormProps {
  modalVisible: boolean;
  onCancel: (reload:boolean) => void;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 }
};

const CreateForm = React.forwardRef((props:CreateFormProps, ref) => {
  const { modalVisible, onCancel } = props;
  const [picture, setPicture] = useState<string>('');
  const [mp3, setMp3] = useState<string>('');
  const [article, setArticle] = useState<ArticleItem>({});

  const [form] = Form.useForm();

  const handleSaveArticle = async () => {
    let value = await form.validateFields();
    value.picture = picture;
    value.mp3 = mp3;

    let result;
    if (article.id) {
      value = { ...article, ...value };
      result = await updateArticle(value);
    } else {
      result = await addArticle(value);
    }
    if (result) {
      if (result.success) {
        message.success('保存成功!');
        onCancel(true);
      } else {
        message.error(result.message);
      }
    }
  }

  const handleImgChange = (value:string) => {
      setPicture(value);
  };

  const handleMp3Change = (value:string) => {
      setMp3(value);
  };

  useImperativeHandle(ref, () => ({
    setFormValue: (value: ArticleItem) => {
      const { title, mp3 = '', picture = '', comment } = value;
      setArticle(value);
      form.setFieldsValue({ title, comment });
      setPicture(picture);
      setMp3(mp3);
    }
  }), []);

  return (
    <Modal
      title="增加文章"
      visible={modalVisible}
      onCancel={() => { onCancel(false) }}
      style={{ top: 20 }}
      onOk={handleSaveArticle}
    >
      <Form
        {...layout}
        form={form}
        name="article"
      >
        <Form.Item
          label="标题"
          name="title"
          rules={[{ required: true, message: 'Please input your title!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="封面"
          name="picture"
        >
          <ImgUpload
            picture={picture}
            onChange={handleImgChange}
          >
          </ImgUpload>
        </Form.Item>
        <Form.Item
          label="音频"
          name="mp3"
        >
          <Mp3Upload mp3={mp3}
            onChange={handleMp3Change}></Mp3Upload>
        </Form.Item>
        <Form.Item
          label="备注"
          name="comment"
        >
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default CreateForm;
