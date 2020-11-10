import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import { Modal, Form, Input, Upload, message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { addArticle } from '../service';


interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 }
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel } = props;
  const [imgLoading, setImgLoading] = useState<boolean>(false);
  const [mp3Loading, setMp3Loading] = useState<boolean>(false);
  const [picture, setPicture] = useState<string>('');
  const [mp3, setMp3] = useState<string>('');

  const onFinish = values => {

  }

  const onFinishFailed = errorInfo => {

  }

  function beforeImgUpload(file: any) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  function beforeMp3Upload(file: any) {
    const isMp3 = file.type === 'audio/mpeg';
    if (!isMp3) {
      message.error('You can only upload MP3 file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 100;
    if (!isLt2M) {
      message.error('Mp3 must smaller than 100MB!');
    }
    return isMp3 && isLt2M;
  }
  const handleImgChange = info => {
    if (info.file.status === 'uploading') {
      setImgLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setPicture(info.file.response.result);
      setImgLoading(false);
    }
  };

  const handleMp3Change = info => {
    if (info.file.status === 'uploading') {
      setMp3Loading(true);
      return;
    }
    if (info.file.status === 'done') {
      setMp3(info.file.response.result);
      setMp3Loading(false);
    }
  };

  const imgUploadButton = (
    <div>
      {imgLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const mp3UploadButton = (
    <div>
      {mp3Loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Modal
      title="增加文章"
      visible={modalVisible}
      onCancel={() => onCancel()}
      style={{ top: 20 }}
      onOk={async (value) => {
        const {success} = await addArticle(value);
        if (success) {
          message.error('添加成功!');
          onCancel();
        }
      }}
    >
      <Form
        {...layout}
        name="article"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
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
          <Upload
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            headers={{ ['X-Access-Token']: localStorage.getItem('jwToken') || '' }}
            action='/api/sys/common/upload'
            beforeUpload={beforeImgUpload}
            onChange={handleImgChange}
          >
            {picture ? <img src={picture} alt="avatar" style={{ width: '100%' }} /> : imgUploadButton}
          </Upload>
        </Form.Item>
        <Form.Item
          label="音频"
          name="mp3"
        >
          {mp3 ? <audio controls>
            <source src={mp3} type="audio/mpeg" />
                  您的浏览器不支持 audio 元素。
            </audio> : <Upload
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              headers={{ ['X-Access-Token']: localStorage.getItem('jwToken') || '' }}
              action='/api/sys/common/upload'
              beforeUpload={beforeMp3Upload}
              onChange={handleMp3Change}
            >
              {mp3UploadButton}
            </Upload>}
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
};

export default CreateForm;
