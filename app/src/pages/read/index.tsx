import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.less'
import { getArticle } from "@/services/read"
import { Spin, Button, Popover } from 'antd';
import { doPlay } from '@/utils/wordUtils'
import { MenuOutlined, LeftOutlined, RightOutlined, CaretRightOutlined } from '@ant-design/icons';

const menuData = [
    { ids: [32, 33, 34, 35], subTitle: "at,an,ap,ad" },
    { ids: [36, 37, 38, 39], subTitle: "am,ag,ash,amp" },
    { ids: [40, 41, 42, 43], subTitle: "and,ack,ant,ed" },
]

const Read = (props, ref) => {

    let { mId = 0 } = props.match.params;

    if (mId * 1 >= menuData.length) {
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
        setIndex(0)
        getData(0);
    }, [mId])

    const getData = async (index: number) => {
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

    //菜单
    const content = (
        <div className={styles.menuContent}>
            {menuData.map((menu, index) => <div key={index} onClick={() => onMenuClick(index)} className={mId == index ? styles.activeMenu : ""}>
                {mId == index ? <div className={styles.caret}><CaretRightOutlined /></div> : ""}
                <div className={styles.title}>M{index + 1}</div>
                <div className={styles.subTitle}>{menu.subTitle}</div>
            </div>)}
        </div>
    );

    //菜单点击事件
    const onMenuClick = (moduleId: number) => {
        props.history.push("/all/read/" + moduleId);

    }

    //翻页
    const go = (index: number) => {
        setIndex(index)
        getData(index);
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
                        <div className={styles.picture}>
                            {/*点读区域absolute*/}
                                {(mp3Times || []).map((i, index) => {
                                    const positionArr = positions[index].split(",");
                                    return <div key={index} onClick={() => onPlay(index)}
                                        className={`${styles.mask} ${index == activeIndex ? styles.active : ""}`}
                                        style={{ top: positionArr[0], height: positionArr[1] }}></div>
                                })}

                                {/**真正有占空间的元素 */}
                            <img src={picture}></img>
                        </div>
                        {/*  */}
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
