import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Input, Radio } from 'antd';
import styles from './styles.less';
import { PlusOutlined } from '@ant-design/icons';
import lodash from 'lodash';


const SplicMp3: React.FC<{}> = (props) => {

    const [mp3, setMp3] = useState<string>("1610614532135.mp3");
    const [timeList, setTimeList] = useState<string[]>([]);
    const [lastTime, setLastTime] = useState<number>(0);
    const [speed, setSpeed] = useState<number>(1);
    const audio = useRef();
    const source = useRef();

    const options = [
        { label: '0.4', value: 0.4 },
        { label: '0.5', value: 0.5 },
        { label: '0.75', value: 0.75 },
        { label: '0.85', value: 0.85 },
        { label: '1', value: 1 },
        // { label: '1.25', value: 1.25 },
        // { label: '1.5', value: 1.5 },
        // { label: '1.75', value: 1.75 },
        // { label: '2', value: 2 },
    ];

    const changeSpeed = e => {
        const value = e.target.value;
        audio.current.playbackRate = value;
        setSpeed(value)
    }

    const handleAdd = () => {
        let timeDisplay = Math.floor(audio.current.currentTime * 1000);//获取实时时间
        let sentence = `mp3[${lastTime}:${timeDisplay}].export('./output/${lastTime}-${timeDisplay}.mp3', format='mp3')`
        setLastTime(timeDisplay);
        setTimeList([...timeList, sentence])
    }

    const handleUrlChange = (e) => {
        setMp3(e.target.value);
        source.current.src = "http://localhost:89/split/" + e.target.value;
        audio.current!.load();
        audio.current.playbackRate = speed;
        // audio.current!.play();
    }

    return (
        <div className={styles.content}>
            <div><Input value={mp3} onChange={handleUrlChange}></Input>
                <Radio.Group options={options} onChange={changeSpeed} value={speed} /></div>

            <div><audio ref={audio} controls style={{ width: '100%' }}>
                <source ref={source} type="audio/mpeg" />
                  您的浏览器不支持 audio 元素。
            </audio></div>
            <div><Button disabled={mp3 === ""} onClick={handleAdd} icon={<PlusOutlined />} type="primary"></Button></div>
            <div>
                <ul>
                    {timeList.map(item => <li key={item}>{item}</li>)}
                </ul>
            </div>
        </div>
    );
};

export default SplicMp3;
