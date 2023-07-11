import React, { useState, useRef, useImperativeHandle } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';
import 'font-awesome/css/font-awesome.min.css';

interface Mp3UploadProps {
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

const Mp3Upload= React.forwardRef((props:Mp3UploadProps, ref) => {

  const { value, type, onChange } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(true);
  const player = useRef();

  useImperativeHandle(ref, () => ({
    getPlayTime: () => {
      return player.current!.getStartDate();
    }
  }), []);

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

  const handleMp3Change = info => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      onChange(info.file.response.result);
      setLoading(false);
    }
  };

  const mp3UploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const play = (e, pause) => {
    e.stopPropagation();
    e.preventDefault();
    if (pause) {
      player.current!.pause();
    } else {
      player.current!.load();
      player.current!.play();
    }
    setPaused(pause);
  }

  const iconStyle = { fontSize: '18px', color: 'rgba(0,0,0,0.7)' };

  return (
    <>
      <Upload
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        headers={{ ['X-Access-Token']: localStorage.getItem('jwToken') || '' }}
        action={'/api/sys/common/uploadMp3/' + (type ? type : 'word')}
        beforeUpload={beforeMp3Upload}
        onChange={handleMp3Change}
      >
        {value ? (paused ? <i style={iconStyle} className="fa fa-play" onClick={e => { play(e, false) }}></i> :
          <i style={iconStyle} className="fa fa-pause" onClick={e => { play(e, true) }}></i>) : mp3UploadButton}
      </Upload>
      <audio ref={player}>
        <source src={value} type="audio/mpeg" />
                  您的浏览器不支持 audio 元素。
            </audio>
    </>
  )
});

export default Mp3Upload;