import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import styles from './styles.less';
import { getArticle } from '@/services/read';
import { doPlay } from '@/utils/wordUtils';
import { CloseOutlined } from '@ant-design/icons';

let player;
let sentenceList;//保存句子信息，取中文的时候用

const PointPicture = props => {

    const { articleId, setLoading, rate } = props;

    const [picture, setPicture] = useState<String>();
    const [positions, setPositions] = useState<[]>();
    const [mp3Times, setMp3Times] = useState<[String]>();
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [chinese, setChinese] = useState<String>("");
    const [chineseVisible, setChineseVisible] = useState<boolean>(false);

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
        sentenceList = sentences;

        //图片
        setPicture(article.picture);
        setPositions((read.position || '').split('|'));

        //加载mp3
        player = new Audio(article.mp3)
        player.load();

        const mp3Times = [];
        sentenceList = sentences.records;
        sentenceList.map(record => mp3Times.push(record.mp3Time));
        setMp3Times(mp3Times);

        //先播放一下
        doPlay(player, "0", "0.0001", 1);
        setTimeout(() => setLoading(false), 0)
    };

    const onAreaClick = i => {
        setActiveIndex(i);
        const times = mp3Times[i].split(',');
        doPlay(player, times[0], times[1], rate);
        const sentence = sentenceList[i]
        setChinese(sentence.acceptation)
        sentence.acceptation ? setChineseVisible(true) : setChineseVisible(false)
    };

    const render = function () {

        return (
            <div className={styles.content}>
                <div className={styles.picture}>
                    {/*点读区域absolute*/}
                    {(mp3Times || []).map((i, index) => {
                        const positionArr = positions[index].split(',');
                        return (
                            <div key={index}
                                onClick={() => onAreaClick(index)}
                                className={`${styles.mask} ${index == activeIndex ? styles.active : ''}`}
                                style={{ top: positionArr[0], height: positionArr[1] }}
                            ></div>
                        );
                    })}

                    {/**真正有占空间的元素 */}
                    <img src={picture}></img>
                </div>
                <div className={`${styles.chineseWin} ${chineseVisible ? styles.show : styles.hide}`} >
                    <CloseOutlined className={styles.close} onClick={() => setChineseVisible(false)} />
                    <div className={styles.chinese}>{chinese}</div>
                </div>
            </div>
        );
    };
    return render();
};

export default connect(({ read: { rate, articleId } }) => ({ rate, articleId }))(PointPicture);
