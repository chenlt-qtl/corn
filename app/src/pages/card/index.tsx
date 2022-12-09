import { Modal, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import styles from './styles.less'
import { cardItems as itemList} from "@/utils/constants";
import {cardTabs as tabs } from "@/utils/constants";

const staticData = [3, 2, 1, -1, -2, -3]


// const itemList = [
//     [{ title: "a", values: [3, -3] },
//     { title: "b", value: -3 }],
//     [{ title: "c", values: [3, -3] }, { title: "d", values: [3, -3] }],
// ]
// const tabs = ["aa", "bb", "cc"]

const DiamondCard: React.FC<{}> = () => {

    const [result, setResult] = useState<Object[]>([]);

    const [activeTab, setActiveTab] = useState<number>(0);

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
        const total = result.reduce((total, item) => {
            console.log(item);
            return total + item.value
        }, 0)

        Modal.info({
            title: '恭喜你获得',
            content: (
                <div>
                    <p>{total} 张卡</p>
                </div>
            ),
            onOk() { },
        });
    }

    const formatTitle = item => {
        console.log(item);

        const { title, value } = item;
        if (value > 0) {
            return title + " +" + value;
        } else {
            return title + " " + value;
        }
    }

    const formatValue = (value: number) => value > 0 ? " +" + value : " " + value


    const clean = () => {
        setResult([])
    }

    const onTabClick = id => {
        setActiveTab(id)
    }

    const layout = { sm: { span: 4 }, xs: { span: 8 } }

    return (
        <main className={styles.container}>
            <section className={styles.static}>
                <Row gutter={[8, 8]}>
                    {staticData.map(item => <Col {...layout} key={item}><div className={`${styles.button} ${item > 0 ? styles.add : styles.sub}`}
                        onClick={() => addStatic(item)}>{formatTitle({ title: "", value: item })}</div></Col>)}
                </Row>
            </section>
            <section className={styles.item}>
                <div className={styles.neumorphicOuter}>
                    <div className={styles.controls}>
                        {tabs.map((tab, index) => <div key={tab} onClick={() => onTabClick(index)}
                            className={`${styles.control} ${activeTab == index ? styles.active : ""}`}>{tab}</div>)}
                    </div>
                    <div className={styles.inner}>
                        <ul>
                            {(itemList[activeTab] || []).map(item => <li key={item.title}>
                                <span className={result.filter(i => i.title == item.title).length > 0 ? styles.gray : ""}>{item.title} : </span>
                                {item.values ? item.values.map(value => <small key={`${item.title}${value}`} onClick={() => setResult([...result, { ...item, value: value }])}
                                    className={`${styles.button} ${value > 0 ? styles.add : styles.sub}`}
                                >{formatValue(value)}</small>) : <small onClick={() => setResult([...result, { ...item, value: item.value }])}
                                    className={`${styles.button} ${item.value > 0 ? styles.add : styles.sub}`}
                                >{formatValue(item.value)}</small>}</li>)}
                        </ul>
                    </div >

                </div >
            </section>
            <section className={styles.result}>
                <ul>
                    {result.map((item, index) => <li key={item.title + index} className={`${styles.button} ${item.value > 0 ? styles.add : styles.sub}`}
                        onClick={() => subItem(index)}>{formatTitle(item)}</li>)}
                </ul>
            </section>
            <section className={styles.sum}><button onClick={sum}>计算</button><button onClick={clean}>清空</button></section>
        </main>
    );
};

export default DiamondCard;
