import { Modal } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.less'
import { getGameList } from '@/services/game'
import { reduce } from 'lodash';


const staticData = [3, 2, 1, -1, -2, -3]
// const itemList = [{ id: 1, title: "a", value: 3 },
// { id: 2, title: "b", value: -3 }]

const itemList = [
    { id: 1, title: "认真吃饭", value: 1 },
    { id: 2, title: "不挑食", value: 1 },
    { id: 1, title: "洗澡", value: 1 },
    { id: 1, title: "刷牙", value: 1 },
    { id: 1, title: "抄作业", value: 2 },
    { id: 1, title: "7点前完成作业", value: 10 },
    { id: 1, title: "8点前完成作业", value: 5 },
    { id: 1, title: "9点前完成作业", value: 2 },
    { id: 1, title: "9点后完成作业", value: -5 },
    { id: 1, title: "10点后完成作业", value: -10 },
    { id: 1, title: "10点前睡觉", value: 5 },
    { id: 1, title: "睡前不说话", value: 5 },
    { id: 1, title: "没完成作业前画画", value: -2 },
    { id: 1, title: "挑食", value: -2 },
    { id: 1, title: "帮忙做家务", value: 3 },
    { id: 1, title: "9点后完成作业", value: -2 },
    { id: 1, title: "收拾玩具", value: 3 },
    { id: 1, title: "收拾书", value: 2 },
    { id: 1, title: "洗澡不积极", value: -2 },
    { id: 1, title: "刷牙不积极", value: -2 },
    { id: 1, title: "乱丢玩具", value: -3 },
]

const DiamondCard: React.FC<{}> = () => {

    const [result, setResult] = useState<Object[]>([]);

    useEffect(() => {

    }, [])

    const addStatic = (value: number) => {
        setResult([...result, { title: "", value: value }])
    }

    const subItem = (index: number) => {
        const data = [...result];
        data.splice(index, 1);
        setResult(data)
    }

    const sum = () => {
        console.log(result);

        const total = result.reduce((total, item) => {
            console.log(item);
            return total + item.value
        }, 0)

        Modal.info({
            title: '恭喜你获得',
            content: (
                <div>
                    <p>{total}</p>
                </div>
            ),
            onOk() { },
        });
    }

    const formatTitle = item => {
        const { title, value } = item;
        if (value > 0) {
            return title + " +" + value;
        } else {
            return title + " " + value;
        }
    }

    const clean = () => {
        setResult([])
    }

    return (
        <main className={styles.container}>
            <section className={styles.static}>
                <ul>
                    {staticData.map(item => <li key={item} className={item > 0 ? styles.add : styles.sub}
                        onClick={() => addStatic(item)}>{formatTitle({ title: "", value: item })}</li>)}
                </ul>
            </section>
            <section className={styles.item}>
                <ul>
                    {itemList.filter(item=>item.value>0).map(item => <li key={item.id}
                        className={`${item.value > 0 ? styles.add : styles.sub} ${result.filter(i => i.id == item.id).length > 0 ? styles.gray : ""}`}
                        onClick={() => setResult([...result, item])}>{formatTitle(item)}</li>)}
                </ul>
                <hr/>
                <ul>
                    {itemList.filter(item=>item.value<0).map(item => <li key={item.id}
                        className={`${item.value > 0 ? styles.add : styles.sub} ${result.filter(i => i.id == item.id).length > 0 ? styles.gray : ""}`}
                        onClick={() => setResult([...result, item])}>{formatTitle(item)}</li>)}
                </ul>
            </section>
            <section className={styles.result}>
                <ul>
                    {result.map((item, index) => <li key={item.title + index} className={item.value > 0 ? styles.add : styles.sub}
                        onClick={() => subItem(index)}>{formatTitle(item)}</li>)}
                </ul>
            </section>
            <section className={styles.sum}><button onClick={sum}>计算</button><button onClick={clean}>清空</button></section>
        </main>
    );
};

export default DiamondCard;
