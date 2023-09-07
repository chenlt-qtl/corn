import React from 'react';
import styles from './styles.less'


const Tabs: React.FC<{}> = (props) => {


    const { activeTab, setActiveTab, tabData } = props;

    const onTabClick = id => {
        setActiveTab(id)
    }


    return (
        <ul className={styles.tabs}>
            {tabData.map((item, index) => <li key={index}
                className={activeTab == index ? styles.active : ""}
                onClick={() => onTabClick(index)}>{item}</li>)}
        </ul>

    );
};

export default Tabs;
