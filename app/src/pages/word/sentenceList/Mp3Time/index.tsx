import React, { useState, useEffect, useRef } from 'react';
import { InputNumber, Button } from 'antd';
import styles from './styles.less';

let focusField: string;
const Mp3Time: React.FC = (props) => {

    const { value, onChange, onPlay } = props;

    const [startTime, setStartTime] = useState<number>(0);
    const [endTime, setEndTime] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [left, setLeft] = useState<number>(0);
    const container = useRef();

    useEffect(() => {
        if (value) {
            const timeArr = value.split(",")
            if (timeArr.length == 2) {
                const startTime = parseInt(timeArr[0])
                const duration = parseFloat(timeArr[1])
                setStartTime(startTime)
                setEndTime(startTime + duration)
            }
        } else {
            setStartTime(0)
            setEndTime(0)
        }
    }, [value])

    useEffect(() => {
        window.addEventListener("click", onMouseClick)
        return () => {
            window.removeEventListener("click", onMouseClick)
        }
    }, [])

    const onMouseClick = e => {
        //判断是否点击本组件的节点
        if (!container.current.contains(e.target)) {
            setHeight(0)
        }
    }

    const addTime = (time: number) => {
        if (focusField == "start") {
            let newStartTime = startTime + time;
            newStartTime = newStartTime > 0 ? newStartTime : 0;
            let duration = endTime > newStartTime ? (endTime - newStartTime) : 0
            onChange(`${newStartTime},${duration}`)
        } else {
            let newEndTime = endTime + time;
            newEndTime = newEndTime > 0 ? newEndTime : 0;
            let duration = newEndTime > startTime ? (newEndTime - startTime) : 0
            onChange(`${startTime},${duration}`)
        }
    }

    const onFocus = (field: string) => {
        focusField = field;
        setHeight(38)
        if (field == "start") {
            setLeft(0)
        } else {
            setLeft(115)
        }
    }

    const changeTime = value => {
        if (focusField == "start") {
            let newStartTime = value;
            newStartTime = newStartTime > 0 ? newStartTime : 0;
            let duration = endTime > newStartTime ? (endTime - newStartTime) : 0
            onChange(`${newStartTime},${duration}`)
        } else {
            let newEndTime = value;
            newEndTime = newEndTime > 0 ? newEndTime : 0;
            let duration = newEndTime > startTime ? (newEndTime - startTime) : 0
            onChange(`${startTime},${duration}`)
        }

    }

    return (
        <div className={styles.mp3Time} ref={container}>
            <InputNumber onChange={changeTime} value={startTime} onFocus={() => onFocus("start")}></InputNumber >
            <div className={styles.hyphen} />
            <InputNumber onChange={changeTime} value={endTime} onFocus={() => onFocus("end")}></InputNumber >
            <Button type="link"><i className="fa fa-volume-up" onClick={() => onPlay({ mp3Time: value })}></i></Button>
            <div className={styles.adjust} style={{ height: height + "px", left: left + "px" }}>
                <div className={styles.content}>
                    <Button type="link" onClick={() => addTime(1)}>+1s</Button>
                    <Button type="link" onClick={() => addTime(5)}>+5s</Button>
                    <Button type="link" onClick={() => addTime(-1)} danger>-1s</Button>
                    <Button type="link" onClick={() => addTime(-5)} danger>-5s</Button>
                </div>
            </div>
        </div>
    );
};


export default Mp3Time;