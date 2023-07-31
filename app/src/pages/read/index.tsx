import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.less'
import { getArticle } from "@/services/read"
import prev from '@/assets/fanhui.svg'
import next from '@/assets/xiayibu.svg'
import point from '@/assets/pointdown.svg'
import { stringify } from 'qs';
import { Spin } from 'antd';

let timeoutIndex = 0;
const Read = (props, ref) => {

    const { ids = "", index = 0 } = props.location.query;
    const idArr = ids.split(",")
    const id = idArr[index]
    


    const player = useRef();
    const source = useRef();

    const [picture, setPicture] = useState<String>();
    const [positions, setPositions] = useState<[]>();
    const [mp3Times, setMp3Times] = useState<[String]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    useEffect(() => {
        getData();
    }, [id])

    const getData = async () => {
        setActiveIndex(-1)
        setLoading(true)
        const res = await getArticle(id)
        const { article, sentences, read } = res.result;
        source.current.src = article.mp3;
        player.current.load();

        setPicture(article.picture)
        
        setPositions((read.position || "").split("|"))

        const mp3Times = [];
        const { records } = sentences;
        records.map(record => mp3Times.push(record.mp3Time))
        setMp3Times(mp3Times)
        setLoading(false)
    }

    const play = i => {

        console.log("timeoutIndex",timeoutIndex);
        
        clearTimeout(timeoutIndex)
        setActiveIndex(i)
        player.current.pause();

        const times = mp3Times[i].split(",")
        const rate = 0.7;

        //单位秒
        player.current.currentTime = times[0];
        player.current.play();
        player.current.playbackRate = rate;

        timeoutIndex = setTimeout(() => {
            player.current.pause();
            console.log("pause");
            
        }, parseInt(times[1]) / rate * 1000)
        console.log(111,timeoutIndex);
        

    }

    const goNext = () => {
        const { pathname, query } = props.location;
        props.history.push(pathname + "?" + stringify({ ...query, index: parseInt(index) + 1 }))
    }


    const render = function () {

        return (
            <div className={styles.container}>
                <audio ref={player}>
                    <source ref={source} type="audio/mpeg" />
                    您的浏览器不支持 audio 元素。
                </audio>
                <Spin spinning={loading}>
                    <div className={styles.tip}><img src={point}></img>请点读</div>

                    {index != 0 ? <div className={styles.prev} onClick={() => props.history.go(-1)}><img src={prev}></img></div> : ""}
                    {index < idArr.length - 1 ? <div className={styles.next} onClick={goNext}><img src={next}></img></div> : ""}

                    {(mp3Times || []).map((i, index) => {
                        const positionArr = positions[index].split(",");
                        return <div key={index}>
                            <div onClick={() => play(index)} className={`${styles.mask} ${index==activeIndex?styles.active:""}`} style={{ top: positionArr[0], height: positionArr[1] }}></div>
                        </div>
                    })}
                    <img src={picture} className={styles.bgImg}></img>
                </Spin>

            </div>
        );
    };
    return render();
};

export default Read;
