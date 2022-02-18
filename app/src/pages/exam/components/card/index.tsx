import React from 'react';
import styles from './styles.less'
import 'font-awesome/css/font-awesome.min.css';



const Card: React.FC<{}> = () => {
    return (

        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.box}>
                    <div className={styles.front}>
                        <div className={styles.icon}><i className='fa fa-code'></i></div>
                        <span>Web Design</span>
                    </div>
                    <div className={styles.back}>
                        <span>Web Design</span>
                        <p>The club provides a wide variety of activities including tennis, swimming and squash.The club provides a wide variety of activities including tennis, swimming and squash. </p>
                    </div>
                </div>
                <div className={styles.box}>
                    <div className={styles.front}>
                        <div className={styles.icon}><i className='fa fa-line-chart'></i></div>
                        <span>Adverising</span>
                    </div>
                    <div className={styles.back}>
                        <span>Adverising</span>
                        <p>The club provides a wide variety of activities including tennis, swimming and squash.The club provides a wide variety of activities including tennis, swimming and squash. </p>
                    </div>
                </div>
                <div className={styles.box}>
                    <div className={styles.front}>
                        <div className={styles.icon}><i className='fa fa-rocket'></i></div>
                        <span>Game Design</span>
                    </div>
                    <div className={styles.back}>
                        <span>Game Design</span>
                        <p>The club provides a wide variety of activities including tennis, swimming and squash. The club provides a wide variety of activities including tennis, swimming and squash.</p>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Card;
