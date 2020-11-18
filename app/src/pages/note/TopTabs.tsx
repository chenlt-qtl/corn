import React, { useState, useEffect } from 'react';
import styles from './topTabs.less'
import { queryNote } from './service'

const openNotesTab = { id: '', name: '最近打开', color: '#f1c40f' };
const defaultColor = "#1abc9c";

const TopTabs: React.FC<{}> = (props) => {

    const [activeId, setActiveId] = useState<string>("1");
    const [activeColor, setActiveColor] = useState<string>(defaultColor);

    const [tabData, setTabData] = useState<object[]>([]);

    const onClick = (id: string, color: string = defaultColor) => {
        setActiveId(id);
        color && setActiveColor(color);
        props.onTabChange(id);
    }

    useEffect(() => {
        queryNote('0').then(({ result }) => {
            onClick(openNotesTab.id,openNotesTab.color);
            setTabData([openNotesTab, ...result]);
        });
    }, []);

    const tabs = tabData.map(item => {
        const classes = [styles.item];
        const style = {}
        if (activeId === item.id) {
            classes.push(styles.active);
            style.background = activeColor;
            style.color = activeColor;
        } else {
            if (item.color) {
                style.background = item.color;
                style.color = item.color;
            }
        }

        return (
            <div key={item.id} className={classes.join(' ')} datatitle={item.name} onClick={(e) => { onClick(item.id, item.color) }}>
                <div style={style}>{item.name}</div>
            </div>
        )
    })


    return (
        <div className={styles.tab}>
            <div className={styles.label}>
                {tabs}
            </div>
            <div className={styles.content} style={{ background: activeColor }}>
                {props.children}
            </div>

        </div>
    );
}
export default TopTabs;