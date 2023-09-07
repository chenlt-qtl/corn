import React from 'react';
import styles from './styles.less'
import { Link } from 'umi';


const Card: React.FC<{}> = () => {



    return (
        <div className={styles.container}>
            <div className={styles.welcome}>
                <h5>欢迎光临</h5>
                <h2>请选择目的地...</h2>
            </div>
            <Link className={styles.button} to="card/bank">
                银行
                <img src='/img/card/钱包.svg'></img></Link>
            <Link className={styles.button} to="card/superMarket">
                超市
                <img src='/img/card/商店.svg'></img></Link>
        </div>
    );
};

export default Card;
