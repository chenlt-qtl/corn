import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.less'
import { getArticle } from "@/services/read"
import point from '@/assets/pointdown.svg'
import { stringify } from 'qs';
import { Spin, Button, Popover } from 'antd';
import { doPlay } from '@/utils/wordUtils'
import { MenuOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';

const menuData = [{ ids: [32, 33], subTitle: "an,an,an,ang" }, { ids: [33, 34], subTitle: "ag,ank,an,ang" }]

const Read = (props, ref) => {

    let { mId } = props.match.params;

    if (mId >= menuData.length) {
        mId = 0;
    }

    const ids = menuData[mId].ids;

    const player = useRef();
    const source = useRef();

    const [picture, setPicture] = useState<String>();
    const [positions, setPositions] = useState<[]>();
    const [mp3Times, setMp3Times] = useState<[String]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [index, setIndex] = useState<number>(0);

    useEffect(() => {
        console.log("index", index);
        getData();
    }, [index])

    const getData = async () => {
        setActiveIndex(-1)
        setLoading(true)
        const res = await getArticle(ids[index])
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

    const onPlay = i => {

        setActiveIndex(i)
        const times = mp3Times[i].split(",")
        doPlay(player.current, times[0], times[1], 0.7)

    }

    const content = (
        <div className={styles.menuContent}>
            {menuData.map((menu, index) => <p key={index} onClick={() => onMenuClick(index)} className={mId==index?styles.activeMenu:""}>
                <div className={styles.title}>M{index + 1}</div>
                 <span className={styles.subTitle}>{menu.subTitle}</span>
                 </p>)}
        </div>
    );

    const onMenuClick = (moduleId: number) => {

    }

    const go = (index: number) => {
        setIndex(index)
    }


    const render = function () {

        return (
            <div className={styles.container}>
                <audio ref={player}>
                    <source ref={source} type="audio/mpeg" />
                    您的浏览器不支持 audio 元素。
                </audio>
                <Spin spinning={loading}>
                    <div className={styles.content}>
                        <div className={styles.tip}><img src={point}></img>请点读</div>

                        {(mp3Times || []).map((i, index) => {
                            const positionArr = positions[index].split(",");
                            return <div key={index}>
                                <div onClick={() => onPlay(index)} className={`${styles.mask} ${index == activeIndex ? styles.active : ""}`} style={{ top: positionArr[0], height: positionArr[1] }}></div>
                            </div>
                        })}
                        <img src={picture} className={styles.bgImg}></img>
                    </div>
                </Spin>
                <div className={styles.toolbar}>
                    <div className={styles.btnDiv}>
                        <Popover content={content} trigger="click">
                            <Button type="primary" shape="circle" icon={<MenuOutlined />} />
                        </Popover>

                        <div className={styles.label}>目录</div>
                    </div>

                    <div className={styles.btnDiv}>
                        <Button onClick={() => go(index - 1)} type="primary" shape="circle" disabled={index == 0} icon={<LeftOutlined />} />
                        <div className={styles.label}>上一页</div>
                    </div>

                    <div className={styles.btnDiv}>
                        <Button onClick={() => go(index + 1)} type="primary" shape="circle" disabled={index >= ids.length - 1} icon={<RightOutlined />} />
                        <div className={styles.label}>下一页</div>
                    </div>
                </div>

            </div>
        );
    };
    return render();
};

export default Read;
