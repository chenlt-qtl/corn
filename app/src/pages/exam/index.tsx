import React, { useState } from 'react';
import styles from './styles.less'

import Christmas from './components/Christmas'
import Exam2 from './components/Exam2'
import Exam3 from './components/Exam3'
import Exam4 from './components/Exam4'
import Exam5 from './components/Exam5'
import Exam6 from './components/Exam6'
import Exam7 from './components/Exam7'
import Exam8 from './components/Exam8'
import Exam9 from './components/Exam9'
import Keyboard from './components/keyboard'
import Menu from './components/menu'
import Card from './components/card'
import Button3D from './components/button3D';
import SunLoading from './components/sunLoading'
const ExamList: React.FC<{}> = () => {
    const [activeKey, setActiveKey] = useState<number>(14);


    const items = [
        { id: 1, name: "圣诞树", component: <Christmas></Christmas> },
        { id: 2, name: "拟态界面", component: <Exam2></Exam2> },
        { id: 3, name: "拟态组件1", component: <Exam3></Exam3> },
        { id: 4, name: "拟态组件2", component: <Exam7></Exam7> },
        { id: 5, name: "tabs", component: <Exam4></Exam4> },
        { id: 6, name: "Form", component: <Exam5></Exam5> },
        { id: 7, name: "播放器", component: <Exam6></Exam6> },
        { id: 8, name: "伸缩菜单", component: <Exam8></Exam8> },
        { id: 9, name: "全屏菜单", component: <Exam9></Exam9> },
        { id: 10, name: "键盘", component: <Keyboard></Keyboard> },
        { id: 11, name: "圆形菜单", component: <Menu></Menu> },
        { id: 12, name: "卡片翻动效果", component: <Card></Card> },
        { id: 13, name: "3D按钮", component: <Button3D></Button3D> },
        { id: 14, name: "太阳加载", component: <SunLoading></SunLoading> },
    ];



    return (
        <main className={styles.main}>
            <nav className={styles.menu}>
                <ul>
                    {items.map(item =>
                        <li className={item.id == activeKey ? styles.active : ""} key={item.id} onClick={() => setActiveKey(item.id)}>{item.name}</li>
                    )}
                </ul>
            </nav>
            <div className={styles.content}>
                {items.filter(item=>item.id==activeKey)[0].component}
            </div>
        </main>
    );
};

export default ExamList;
