import { Modal, Row, Col, message, Button, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import styles from './styles.less'
import { useRef } from 'react';
import { getSysData, updateSysData } from "@/services/system"
import EditModal from './editModal';

const staticData = [3, 2, 1, -1, -2, -3]

interface Item {
    title: string;
    values: number[];
}

let cardDataObj;
let cardNumberObj;
const DiamondCard: React.FC<{}> = () => {

    const [result, setResult] = useState<Object[]>([]);

    const [activeTab, setActiveTab] = useState<number>(0);

    const [cardData, setCardData] = useState<API.CardData>({ tabs: [], value: [] });
    const [itemList, setItemList] = useState<Item[][]>([]);

    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [accountId, setAccountId] = useState<number>(1);
    const [accountData, setAccountData] = useState<Object>({});
    const [loading, setLoading] = useState<boolean>(false)

    const player = useRef();
    const source = useRef();

    useEffect(() => {
        initData()
    }, [])

    const initData = async () => {
        setLoading(true)
        const res = await getSysData("card-data");
        if (res.success) {
            const records = res.result.records;
            if (records.length == 1) {
                cardDataObj = records[0]
                genItemData(records[0].value);
            }
        }

        const res1 = await getSysData("card-number");
        if (res1.success) {
            const records = res1.result.records;
            if (records.length == 1) {
                cardNumberObj = records[0]
                setAccountData(records[0].value ? JSON.parse(records[0].value) : { "1": 0, "2": 0 });
            }
        }
        setLoading(false)

    }

    const genItemData = str => {
        if (str) {
            const json = JSON.parse(str);
            setCardData(json)

            const itemList: Item[][] = [];
            const level1 = json.value;
            let isValid = true;

            level1.map((level1Str, index) => {
                if (level1Str) {
                    const level2 = level1Str.split("\n");
                    level2.map(level2Str => {
                        if (level2Str) {
                            const [title, ...values] = level2Str.split(",")
                            if (!title || !values || values.length == 0) {
                                isValid = false;
                            }
                            if (!itemList[index]) {
                                itemList[index] = [];
                            }
                            itemList[index].push({ title, values })
                        }
                    })

                }
            })
            if (isValid) {
                setItemList(itemList);
            } else {
                message.error("数据格式有误")
            }
        }
    }

    const addRecord = (item) => {
        soundEffect(item.value)
        setResult([...result, item])
    }

    const subItem = (index: number) => {
        const data = [...result];
        data.splice(index, 1);
        setResult(data)
    }

    const save = () => {
        soundEffect(0)
        const total = result.reduce((total, item) => {
            return total + parseInt(item.value)
        }, 0)

        Modal.confirm({
            title: `帐户 : ${accountId == 1 ? "豆芽" : "桐桐"}`,
            content: (
                <div>
                    <p>存入 {total} 张卡?</p>
                </div>
            ),
            onOk:async()=> {
                setLoading(true)
                const oldNumber = accountData[accountId];
                const newNumber = oldNumber * 1 + total;
                accountData[accountId] = newNumber;
                const res = await updateSysData({ ...cardNumberObj, value: JSON.stringify(accountData) });
                setLoading(false);
                if (res && res.success) {
                    message.success("操作成功")
                    clean()
                } else {
                    message.error('保存失败');
                }
            },
        })
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
        player.current!.pause();
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

    const edit = () => {
        setModalVisible(true);
    }

    const onCancel = (reload: boolean) => {
        if (reload) {
            initData();
        }
        setModalVisible(false);
    }

    const layout = { sm: { span: 4 }, xs: { span: 8 } }

    return (
        <main className={styles.container}>
            <Spin spinning={loading}>
                <div className={styles.account}>
                    <div className={styles.cardNumber}>
                        <div className={styles.numberItem}>
                            <h5>豆芽</h5>
                            <h2>{accountData["1"]}张</h2>
                        </div>
                        <div className={styles.numberItem}>
                            <h5>桐桐</h5>
                            <h2>{accountData["2"]}张</h2>
                        </div>
                    </div>
                    <div className={styles.btns}>
                        <Button onClick={() => setAccountId(1)} className={`${styles.radio1} ${accountId == 1 ? styles.active : ""}`}>豆芽</Button>
                        <Button onClick={() => setAccountId(2)} className={`${styles.radio2} ${accountId == 2 ? styles.active : ""}`}>桐桐</Button>
                        <Button onClick={edit}>修改配置</Button>
                    </div>
                </div>
                <section className={styles.static}>
                    <Row gutter={[8, 8]}>
                        {staticData.map(item => <Col {...layout} key={item}><div className={`${styles.button} ${item > 0 ? styles.add : styles.sub}`}
                            onClick={() => addRecord({ title: "", value: item })}>{formatTitle({ title: "", value: item })}</div></Col>)}
                    </Row>
                </section>
                <section className={styles.item}>
                    <div className={styles.neumorphicOuter}>
                        <div className={styles.controls}>
                            {cardData.tabs.map((tab, index) => <div key={tab} onClick={() => onTabClick(index)}
                                className={`${styles.control} ${activeTab == index ? styles.active : ""}`}>{tab}</div>)}
                        </div>
                        <div className={styles.inner}>
                            <ul>
                                {(itemList[activeTab] || []).map(item => <li key={item.title}>
                                    <span className={result.filter(i => i.title == item.title).length > 0 ? styles.gray : ""}>{item.title} : </span>
                                    {item.values.map(value => <small key={`${item.title}${value}`} onClick={() => addRecord({ ...item, value: value })}
                                        className={`${styles.button} ${value > 0 ? styles.add : styles.sub}`}
                                    >{formatValue(value)}</small>)}</li>)}
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
                <section className={styles.btns}><button onClick={save} className={styles.sum}>保存</button><button onClick={clean}>清空</button></section>
                <div><audio ref={player}>
                    <source ref={source} type="audio/mpeg" />
                    您的浏览器不支持 audio 元素。
                </audio></div>
                <EditModal data={cardDataObj} modalVisible={modalVisible} onCancel={onCancel}></EditModal>
            </Spin>
        </main>
    );
};

export default DiamondCard;
