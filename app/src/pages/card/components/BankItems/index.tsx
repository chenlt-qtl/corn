import { Divider } from 'antd';
import React from 'react';
import styles from './styles.less'

const BankItems: React.FC<{}> = props => {

    const { itemData = [], soundEffect, result, setResult } = props;

    const addRecord = (item) => {
        soundEffect(item.value)
        setResult([...result, item])
    }


    const formatValue = (value: number) => value > 0 ? " +" + value : " " + value

    return (
        <div className={styles.items}>
            <ul>
                {itemData.map(item => <li key={item.title}>
                    <span className={result.filter(i => i.title == item.title).length > 0 ? styles.gray : styles.label}>{item.title}</span>
                    <div className={styles.button}>
                        {item.values.reduce((total, value) => {
                            if (total.length > 0) {
                                total.push(<Divider key={`${item.title}${value}${total.length}`} type="vertical" />);
                            }
                            total.push(<small key={`${item.title}${value}`}
                                onClick={() => addRecord({ ...item, value: value })}
                                className={value > 0 ? styles.add : styles.sub}
                            >{formatValue(value)}</small>)
                            return total;
                        }, [])}
                    </div></li>)}
            </ul>
        </div>

    );
};

export default BankItems;
