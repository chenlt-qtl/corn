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

const ExamList: React.FC<{}> = () => {
    const [activeKey, setActiveKey] = useState<number>(9);

    const getComponent = () => {
        let component = <></>;
        switch (activeKey) {
            case 1:
                component = <Christmas></Christmas>
                break;
            case 2:
                component = <Exam2></Exam2>
                break;
            case 3:
                component = <Exam3></Exam3>
                break;
            case 4:
                component = <Exam4></Exam4>
                break;
            case 5:
                component = <Exam5></Exam5>
                break;
            case 6:
                component = <Exam6></Exam6>
                break;
            case 7:
                component = <Exam7></Exam7>
                break;
            case 8:
                component = <Exam8></Exam8>
                break;
            case 9:
                component = <Exam9></Exam9>
                break;
            default:
                break;
        }
        return component;
    }

    return (
        <main className={styles.main}>
            <nav className={styles.menu}>
                <ul>
                    <li onClick={() => setActiveKey(1)}>圣诞树</li>
                    <li onClick={() => setActiveKey(2)}>拟态界面</li>
                    <li onClick={() => setActiveKey(3)}>拟态组件1</li>
                    <li onClick={() => setActiveKey(7)}>拟态组件2</li>
                    <li onClick={() => setActiveKey(4)}>tabs</li>
                    <li onClick={() => setActiveKey(5)}>Form</li>
                    <li onClick={() => setActiveKey(6)}>播放器</li>
                    <li onClick={() => setActiveKey(8)}>伸缩菜单</li>
                    <li onClick={() => setActiveKey(9)}>全屏菜单</li>
                </ul>
            </nav>
            <div className={styles.content}>
                {getComponent()}
            </div>
        </main>
    );
};

export default ExamList;
