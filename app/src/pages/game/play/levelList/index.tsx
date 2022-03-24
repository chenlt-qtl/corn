import React, { useState, useEffect } from 'react';
import styles from './styles.less'
import { getGameLevelInfo } from '@/services/game';
import { LockTwoTone } from '@ant-design/icons';
import { history } from 'umi';


interface LevelData {
    level?: number;
    score?: number;
}

const levelWordCount = 10;//一关10个词

let type = 0;
let nextLevel = 1;

const LevelList: React.FC<{}> = (props) => {

    const [levelList, setLevelList] = useState<LevelData[]>([]);

    useEffect(() => {
        let urlParams = props.match.params;

        getWordCount(urlParams.id);
    }, [])

    const getWordCount = async (id: string) => {
        if (id) {
            const res = await getGameLevelInfo(id);
            const wordCount = res.result.wordCount;
            const scoreList = res.result.scoreList;
            scoreList && (nextLevel = scoreList.length + 1);
            type = res.result.type;
            const list = [];
            let levelCounts = wordCount / levelWordCount;
            if (wordCount % levelWordCount != 0) {
                levelCounts -= 1;

            }

            for (let i = 1; i < levelCounts; i++) {
                list.push({ level: i })
            }

            setLevelList(list);
        }
    }


    const handlePlay = () => {
        let urlParams = props.match.params;

        if (type == 0) {
            history.push("/b/play/en/" + urlParams.id)
        } else {
            history.push("/b/play/cn/" + urlParams.id)
        }

    }



    return (
        <div>
            {levelList.map(item => {
                const canPlay = item.level! <= nextLevel;
                return <section style={{ cursor: canPlay ? "pointer" : "default" }} onClick={canPlay ? handlePlay : () => { }} className={styles.level} key={item.level}>
                    {item.level}
                    {item.score ? item.score : <LockTwoTone />}
                </section>
            })
            }
        </div>
    );
};

export default LevelList;
