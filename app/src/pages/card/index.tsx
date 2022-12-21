import { Modal, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import styles from './styles.less'
import { cardItems as itemList} from "@/utils/constants";
import { cardTabs as tabs } from "@/utils/constants";
import { useRef } from 'react';

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

    const player = useRef();
    const source = useRef();

    useEffect(() => {

    }, [])

    const addRecord = (item) => {
        soundEffect(item.value)
        setResult([...result, item])
    }

    const subItem = (index: number) => {
        const data = [...result];
        data.splice(index, 1);
        setResult(data)
    }

    const sum = () => {
        soundEffect(0)
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

    //type: -1扣分 1得分 0算分
    const soundEffect = (type: number) => {
        console.log("type", type);

        let mp3;
        if (type < 0) {
            mp3 = "37j888piCfxy.mp3";
        } else if (type > 0) {
            mp3 = "53s888piCC7e.mp3";
        } else {
            mp3 = "42f888piCquQ.mp3";
        }
        source.current.src = publicPath + "/public/sound/" + mp3;

        player.current!.load();
        player.current!.play();

    }

    const layout = { sm: { span: 4 }, xs: { span: 8 } }

    return (
        <main className={styles.container}>
            <section className={styles.static}>
                <Row gutter={[8, 8]}>
                    {staticData.map(item => <Col {...layout} key={item}><div className={`${styles.button} ${item > 0 ? styles.add : styles.sub}`}
                        onClick={() => addRecord({ title: "", value: item })}>{formatTitle({ title: "", value: item })}</div></Col>)}
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
                                {item.values ? item.values.map(value => <small key={`${item.title}${value}`} onClick={() => addRecord({ ...item, value: value })}
                                    className={`${styles.button} ${value > 0 ? styles.add : styles.sub}`}
                                >{formatValue(value)}</small>) : <small onClick={() => addRecord({ ...item, value: item.value })}
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
            <div><audio ref={player}>
                <source ref={source} type="audio/mpeg" />
                您的浏览器不支持 audio 元素。
            </audio></div>
        </main>
    );
};

export default DiamondCard;
