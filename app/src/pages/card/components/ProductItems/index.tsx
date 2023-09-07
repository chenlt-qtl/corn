import { Button } from 'antd';
import React from 'react';
import styles from './styles.less'
import { ShoppingCartOutlined, SketchOutlined } from '@ant-design/icons';

const ProductItems: React.FC<{}> = props => {

    const { itemData = [], soundEffect, result, setResult } = props;

    const addRecord = (item) => {
        soundEffect(item.value)
        setResult([...result, item])
    }

    return (
        <div className={styles.items}>
            <ul>
                {itemData.map(item => <li key={item.title}>
                    <img src={`/img/sm/${item.img ? item.img : "0"}.svg`}></img>
                    <span className={styles.label}>{item.title}</span>
                    <div className={styles.toolbar}>
                        <div>￥<span className={styles.price}>{item.value}</span></div>
                        <Button className={styles.btn} shape='round' onClick={() => addRecord(item)}><ShoppingCartOutlined /></Button></div></li>)}
            </ul>
        </div>

    );
};

export default ProductItems;
