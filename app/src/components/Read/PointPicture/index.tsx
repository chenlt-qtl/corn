import React, { useState, useEffect } from 'react';
import styles from './styles.less';
import { getArticle } from '@/services/read';
import { doPlay } from '@/utils/wordUtils';
import { connect } from 'umi';

let player;

const PointPicture = props => {

    const { articleId, setLoading, rate } = props;

    const [picture, setPicture] = useState<String>();
    const [positions, setPositions] = useState<[]>();
    const [mp3Times, setMp3Times] = useState<[String]>();
    const [activeIndex, setActiveIndex] = useState<number>(-1);


    useEffect(() => {
        getData();
    }, [articleId])

    const getData = async () => {

        if (!articleId) {
            return;
        }

        setLoading(true);
        setActiveIndex(-1);
        const res = await getArticle(articleId);
        const { article, sentences, read } = res.result;

        //图片
        setPicture(article.picture);
        setPositions((read.position || '').split('|'));

        //加载mp3
        player = new Audio(article.mp3)

        player.load();
        const mp3Times = [];
        const { records } = sentences;
        records.map(record => mp3Times.push(record.mp3Time));
        setMp3Times(mp3Times);
        player.addEventListener("loadeddata", () => {
            setLoading(false)
        })

    };

    const onPlay = (i) => {
        setActiveIndex(i);
        const times = mp3Times[i].split(',');
        doPlay(player, times[0], times[1], rate);
    };

    const render = function () {

        return (
            <>
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
                </div>
            </>
        );
    };
    return render();
};

export default connect(({ read: { rate, articleId } }) => ({ rate, articleId }))(PointPicture);
