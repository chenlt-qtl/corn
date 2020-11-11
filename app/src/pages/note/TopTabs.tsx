import React, { useState, useEffect } from 'react';
import styles from './topTabs.less'
import { queryNote } from './service'


const TopTabs: React.FC<{}> = (props) => {

    const [activeId, setActiveId] = useState<string>("1");

    const [tabData, setTabData] = useState<object[]>([]);

    const onClick = (id: string) => {
        setActiveId(id);
        props.onTabChange(id);
    }

    useEffect(() => {
        queryNote('0').then(({ result }) => {
            setTabData(result);
        });
    }, []);

    const tabs = tabData.map(item => {
        const classes = [styles.item];
        if (activeId === item.id) {
            classes.push(styles.active);
        }
        return <div className={classes.join(' ')} dataTitle={item.name} onClick={(e) => { onClick(item.id) }}><div>{item.name}</div></div>
    })


    return (
        <div className={styles.tab}>
            <div className={styles.label}>
                {tabs}
            </div>
            <div className={styles.content}>
                {props.children}
            </div>

        </div>
    );
}
export default TopTabs;