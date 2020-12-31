import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload,message } from 'antd';


interface ImgUploadProps {
  picture: string;
  onChange:(value: string) => void;
}

const ImgUpload: React.FC<ImgUploadProps> = (props) => {

  const { picture,onChange } = props;

  const [loading, setLoading] = useState<boolean>(false);

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
  const handleImgChange = info => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      console.log(info);
      onChange(info.file.response.result);
      setLoading(false);
    }
  };


  const imgUploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );


  return (
    <>
      <Upload
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        headers={{ ['X-Access-Token']: localStorage.getItem('jwToken') || '' }}
        action='/api/sys/common/uploadImg/word'
        beforeUpload={beforeImgUpload}
        onChange={handleImgChange}
      >
        {picture ? <img src={picture} alt="avatar" style={{ width: '100%' }} /> : imgUploadButton}
      </Upload>
    </>
  )
}

export default ImgUpload;