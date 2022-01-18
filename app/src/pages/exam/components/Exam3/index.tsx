import React from 'react';
import styles from './styles.less'
import 'font-awesome/css/font-awesome.min.css';

const Exam3: React.FC<{}> = () => {



    return (
        <>
            <div className={styles.container}>
                <div className={styles.left}>
                    <span><i className="fa fa-fighter-jet"></i></span>
                    <span><i className="fa fa-bluetooth-b"></i></span>
                    <span><i className="fa fa-wifi"></i></span>
                    <span><i className="fa fa-heart"></i></span>
                </div>
                <div className={styles.right}>
                    <div className={styles.top}>
                        <span><i className="fa fa-fighter-jet"></i></span>
                        <p>音乐</p>
                    </div>
                    <div className={styles.buttons}>
                        <span><i className="fa fa-bluetooth-b"></i></span>
                        <span><i className="fa fa-wifi"></i></span>
                        <span><i className="fa fa-heart"></i></span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Exam3;
