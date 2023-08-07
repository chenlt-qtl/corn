import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.less';
import { getArticle } from '@/services/read';
import { doPlay } from '@/utils/wordUtils';
import { connect } from 'umi';


const PointPicture = props => {


    const { articleId, setLoading, rate } = props;

    const player = useRef();
    const source = useRef();

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
        doPlay(player.current, times[0], times[1], rate);
    };

    const render = function () {

        return (
            <>
                <audio ref={player}>
                    <source ref={source} type="audio/mpeg" />
                    您的浏览器不支持 audio 元素。
                </audio>
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

export default connect(({ rate, articleId }) => ({ rate, articleId }))(PointPicture);
