import React, { useEffect } from 'react';
import styles from './styles.less'
import { Tabs } from 'antd';
import Recipe from './recipe';
import Ingredient from './ingredient';

const { TabPane } = Tabs;



const Food: React.FC<{}> = () => {

    useEffect(() => {
        initData()
    }, [])

    const initData = async () => {


    }

    return (
        <div className={styles.container}>
            <div className={styles.tab}>
                <Tabs type="card">
                    <TabPane tab="Tab Title 1" key="1">
                        <Recipe />
                    </TabPane>
                    <TabPane tab="Tab Title 2" key="2">
                        <Ingredient />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};

export default Food;
