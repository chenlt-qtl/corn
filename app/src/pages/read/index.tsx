import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.less';
import { getArticle, getMenu } from '@/services/read';
import { Spin, Button, Popover } from 'antd';
import { doPlay } from '@/utils/wordUtils';
import Toolbar from '@/components/Read/Toolbar';

// const menuData = [
//     { ids: [32, 33, 34, 35], subTitle: 'at,an,ap,ad' },
//     { ids: [36, 37, 38, 39], subTitle: 'am,ag,ash,amp' },
//     { ids: [40, 41, 42, 43], subTitle: 'and,ack,ant,ed' },
//     { ids: [44, 45, 46, 47], subTitle: 'en,et,eck,ell' },
//     { ids: [48, 49, 50, 51], subTitle: 'end,est,ip,it' },
// ];

// console.log(JSON.stringify(menuData));


const Read = (props, ref) => {


    const player = useRef();
    const source = useRef();

    const [picture, setPicture] = useState<String>();
    const [positions, setPositions] = useState<[]>();
    const [mp3Times, setMp3Times] = useState<[String]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);


    const getData = async (articleId:number) => {

        setActiveIndex(-1);
        setLoading(true);
        const res = await getArticle(articleId);
        const { article, sentences, read } = res.result;
        source.current.src = article.mp3;
        player.current.load();

        setPicture(article.picture);

        setPositions((read.position || '').split('|'));

        const mp3Times = [];
        const { records } = sentences;
        records.map((record) => mp3Times.push(record.mp3Time));
        setMp3Times(mp3Times);
        setLoading(false);
    };

    const onPlay = (i) => {
        setActiveIndex(i);
        const times = mp3Times[i].split(',');
        doPlay(player.current, times[0], times[1], 0.7);
    };

    const render = function () {

        return (
            <div className={styles.container}>
                <audio ref={player}>
                    <source ref={source} type="audio/mpeg" />
                    您的浏览器不支持 audio 元素。
                </audio>
                <Spin spinning={loading}>
                    <div className={styles.content}>
                        <div className={styles.picture}>
                            {/*点读区域absolute*/}
                            {(mp3Times || []).map((i, index) => {
                                const positionArr = positions[index].split(',');
                                return (
                                    <div
                                        key={index}
                                        onClick={() => onPlay(index)}
                                        className={`${styles.mask} ${index == activeIndex ? styles.active : ''}`}
                                        style={{ top: positionArr[0], height: positionArr[1] }}
                                    ></div>
                                );
                            })}

                            {/**真正有占空间的元素 */}
                            <img src={picture}></img>
                        </div>
                        {/*  */}
                    </div>
                </Spin>
                <Toolbar></Toolbar>
            </div>
        );
    };
    return render();
};

export default Read;
