import { Modal, message, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { SettingOutlined } from '@ant-design/icons';

import styles from './styles.less'
import { getSysData, updateSysData } from "@/services/system"
import EditModal from '../components/EditBankModal';
import Header from '../components/Header';
import { history } from 'umi';
import Account from '../components/Account';
import Tabs from '../components/Tabs';
import BankItems from '../components/BankItems';

const staticData = [3, 2, 1, -1, -2, -3]

interface Item {
    title: string;
    values: number[];
}

let cardDataObj;
let cardNumberObj;
let player = new Audio();

const dailyData = [{ title: "吃早饭", value: 3 },
{ title: "吃早饭", value: 3 },
{ title: "洗澡", value: 2 },
{ title: "刷牙", value: 2 },
{ title: "睡午觉", value: 3 },
{ title: "抄作业", value: 2 },
{ title: "收拾书桌", value: 2 },
{ title: "放学就做作业", value: 5 },
]

const Bank: React.FC<{}> = () => {

    const [result, setResult] = useState<Object[]>([]);

    const [activeTab, setActiveTab] = useState<number>(0);

    const [cardData, setCardData] = useState<API.CardData>({ tabs: [], value: [] });
    const [itemList, setItemList] = useState<Item[][]>([]);

    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [accountId, setAccountId] = useState<number>(1);
    const [accountData, setAccountData] = useState<Object>({});
    const [loading, setLoading] = useState<boolean>(false)

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

    const addRecords = (items:object[])=>{
        soundEffect(1)
        setResult([...result, ...items])
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
            onOk: async () => {
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


    const clean = () => {
        setResult([])
    }

    //type: -1扣分 1得分 0算分
    const soundEffect = (type: number) => {
        player.pause();
        let mp3;
        if (type < 0) {
            mp3 = "37j888piCfxy.mp3";
        } else if (type > 0) {
            mp3 = "53s888piCC7e.mp3";
        } else {
            mp3 = "42f888piCquQ.mp3";
        }

        player.src = "/sound/" + mp3;
        player.load();
        player.load();
        player.play();

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

    return (
        <div className={styles.container}>
            <Header title="银行" onBack={() => history.push("../card")}><Button type="link" onClick={edit}><SettingOutlined /></Button></Header>
            <div className={styles.body}>
                <Account setAccountId={setAccountId} accountData={accountData} accountId={accountId}></Account>
                <div className={styles.static}>
                    <div
                        className={`${styles.staticBtn} ${styles.add}`} 
                        onClick={() => addRecords(dailyData)}>日常</div>
                    {staticData.map(data => <div
                        className={`${styles.staticBtn} ${data > 0 ? styles.add : styles.sub}`} key={data}
                        onClick={() => addRecord({ title: "", value: data })}>{data}</div>)}
                </div>
                <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabData={cardData.tabs} />
                <BankItems itemData={itemList[activeTab]} soundEffect={soundEffect} result={result} setResult={setResult}></BankItems>
                <div className={styles.result}>
                    <ul>
                        {result.map((item, index) => <li key={item.title + index}
                            className={`${styles.button} ${item.value > 0 ? styles.add : styles.sub}`}
                            onClick={() => subItem(index)}>{formatTitle(item)}</li>)}
                    </ul>
                    <section className={styles.btns}>
                        <Button onClick={save} shape="round" className={styles.sum}>保存({result.reduce((total, cur) => total + cur.value * 1, 0)})</Button>
                        <Button onClick={clean} shape="round">清空</Button>
                    </section>
                </div>
            </div>
            <EditModal data={cardDataObj} modalVisible={modalVisible} onCancel={onCancel}></EditModal>
        </div>
    );
};

export default Bank;
