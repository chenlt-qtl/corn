import React from 'react';

import styles from './styles.less'

const Account: React.FC<{}> = (props) => {
    
    const {setAccountId,accountId,accountData} = props;

    return (
        <div className={styles.accountBar}>
            <div onClick={() => setAccountId(1)} className={` ${accountId == 1 ? styles.active : styles.noActive} ${styles.account}`}>
                <h5>豆芽</h5>
                <h2>{accountData["1"]}张</h2>
                <img src='/img/card/girl-5.svg'></img>
            </div>
            <div onClick={() => setAccountId(2)} className={`${accountId == 2 ? styles.active : styles.noActive} ${styles.account} `}>
                <h5>桐桐</h5>
                <h2>{accountData["2"]}张</h2>
                <img src='/img/card/boy-2.svg'></img>
            </div>
        </div>
    );
};

export default Account;
