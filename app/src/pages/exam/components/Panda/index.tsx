import React from 'react';
import styles from './styles.less'
import 'font-awesome/css/font-awesome.min.css';



const Panda: React.FC<{}> = () => {
    return (

        <div className={styles.container}>
            <div className={styles.panda}>
                <div className={`${styles.ear} ${styles.left}`}></div>
                <div className={`${styles.ear} ${styles.right}`}></div>
                <div className={styles.face}>
                    <div className={`${styles["eye-shadow"]} ${styles.left}`}></div>
                    <div className={`${styles["eye-white"]} ${styles.left}`}>
                        <div className={styles["eye-ball"]}></div>
                    </div>

                    <div className={`${styles["eye-shadow"]} ${styles.right}`}></div>
                    <div className={`${styles["eye-white"]} ${styles.right}`}>
                        <div className={styles["eye-ball"]}></div>
                    </div>

                    <div className={styles.nose}></div>
                    <div className={styles.mouth}></div>
                    <div className={styles.body}>
                    </div>
                    <div className={`${styles.foot} ${styles.left}`}>
                        <div className={styles.sole}></div>
                    </div>
                    <div className={`${styles.foot} ${styles.right}`}>
                        <div className={styles.sole}></div>
                    </div>
                </div>
            </div>
        </div >

    );
};

export default Panda;
