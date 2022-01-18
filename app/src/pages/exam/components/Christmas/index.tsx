import React from 'react';
import styles from './styles.less'


const Christmas: React.FC<{}> = () => {

    return (
        <div className={styles.container}>
            <section className={styles.tree}>

                <div className={styles.star}>
                    <div className={styles["star-in"]}></div>
                </div>
                <div className={styles["leaf-box"]}>
                <div className={styles.leaf}>
                        <div className={styles.edge}></div>
                        <div className={`${styles.edge} ${styles.right}`}></div>
                    </div>
                    <div className={styles.leaf}>
                        <div className={styles.edge}></div>
                        <div className={`${styles.edge} ${styles.right}`}></div>
                    </div>
                    <div className={styles.leaf}>
                        <div className={styles.edge}></div>
                        <div className={`${styles.edge} ${styles.right}`}></div>
                    </div>
                </div>
                <div className={styles.trunk}></div>
                <div className={styles["ball-box"]}>
                    <div className={`${styles.ball} ${styles.b1}`}></div>
                    <div className={`${styles.ball} ${styles.b2}`}></div>
                    <div className={`${styles.ball} ${styles.b3}`}></div>
                    <div className={`${styles.ball} ${styles.b4}`}></div>
                    <div className={`${styles.ball} ${styles.b5}`}></div>
                </div>
                <div className={styles.sparkle}>
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                </div>
                <div className={styles.blink}>
                    <div></div>
                    <div></div>
                </div>
            </section>
            <section className={`${styles.word} ${styles.line1}`}><span className={styles.heard}>❤</span>卜先生</section>
            <section className={`${styles.word} ${styles.line2}`}>Happy new year</section>
            <section className={`${styles.word} ${styles.line3}`}>Merry Christmas</section>
        </div>
    );
};

export default Christmas;
