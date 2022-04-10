import React from 'react';
import styles from './styles.less'
import 'font-awesome/css/font-awesome.min.css';



const Panda: React.FC<{}> = () => {
    return (

        <div className={styles.container}>
           <div className={styles.sun}>
               <div className={styles["sunBody"]}>
                   <div className={styles.line}></div>
                   <div className={styles.line}></div>
                   <div className={styles.line}></div>
                   <div className={styles.line}></div>
                   <div className={styles.line}></div>
                   <div className={styles.line}></div>
                   <div className={styles.line}></div>
                   <div className={styles.line}></div>
               </div>
               <div className={styles.eye}></div>
               <div className={styles.horizon}></div>
           </div>
        </div >

    );
};

export default Panda;
