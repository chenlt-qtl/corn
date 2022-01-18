import React, { useState, useEffect } from 'react';
import { Progress } from 'antd';
import { WordCnItem } from '@/data/word';
import styles from './styles.less'
import { getCnWordByGameLevel } from '@/services/game';




const CnGame: React.FC<{}> = (props) => {

    const [wordList, setWordList] = useState<WordCnItem[]>([]);
    const [step, setStep] = useState<number>(1);

    useEffect(() => {
        let urlParams = props.match.params;
        getData(urlParams.id);
    }, [])

    const getData = async (id: string) => {
        if (id) {
            const res = await getCnWordByGameLevel(id);
            if (res && res.success) {
                const list = res.result.records;
                setWordList(list);
            }
        }
    }

    const getContent = (step: number) => {
        if (step == 1) {
            return wordList.map(item =>
                <section key={item.id}>
                    {item.wordName} :{item.pinYin}:{item.acceptation}
                </section>)
        } else if (step == 2) {

        }
    }

    return (
        <div className={styles.content}>
            <header>
                <section className={styles.background}>
                    <section className={styles.success}>正确</section>
                    <section className={styles.fail}>错误</section>
                </section>

                <section className={styles.center}>
                    <section className={styles.total}>20</section>
                    <section className={styles.progress} data-percent={80}></section>
                </section>

            </header>

        </div>
    );
};

export default CnGame;
