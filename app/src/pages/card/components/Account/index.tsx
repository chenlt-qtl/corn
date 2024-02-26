import React from 'react';
import styles from './styles.less'

const Account: React.FC<{}> = (props) => {

    const { setUserIdx, userIdx, users } = props;
    return (
        <div className={styles.accountBar}>
            {users.map((user, index) => <div key={index} onClick={() => setUserIdx(index)} className={` ${index == userIdx ? styles.active : styles.noActive} ${styles.account}`}>
                <h5>{user.name}</h5>
                <h2>{user.total}张</h2>
                <img src={`/img/card/${index ? "boy-2.svg" : "girl-5.svg"}`}></img>
            </div>)}
        </div>
    );
};

export default Account;
