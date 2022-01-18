import React from 'react';
import styles from './styles.less'
import 'font-awesome/css/font-awesome.min.css';

const Exam2: React.FC<{}> = () => {



    return (
        <>
            <div className={styles.container}>
                <div className={styles.page}>
                    <div className={styles.top}>
                        <div className={styles.title}>
                            <div className={styles.left}>
                                <div className={styles.text}>
                                    Dens device
                                </div>
                                <div className={styles.sub}>
                                    <div className={styles.flag}>
                                        <div className={styles.ellipse}></div>
                                        <div className={styles.ellipse}></div>
                                        <div className={styles.ellipse}></div>
                                        <div className={styles.ellipse}></div>
                                    </div>
                                    <div className={styles.subtext}>Connected</div>

                                </div>
                            </div>
                            <i className="fa fa-ellipsis-v"></i>
                        </div>


                        <div className={styles["treat-time-container"]}>
                            <div className={styles.circle1}></div>
                            <div className={styles.circle2}></div>
                            <div className={styles.circle3}></div>
                            <div className={styles.circle4}></div>
                            <div className={styles.circle5}></div>
                            <div className={styles.circle6}></div>
                            <div className={styles.circle7}></div>
                            <div className={styles["inner-circle"]}>
                                <div className={styles["treat-title"]}>
                                    Treat Time
                                </div>
                                <div className={styles.time}>36:00</div>
                            </div>
                        </div>
                        <div className={styles.comfort}>
                            Comfort
                        </div>
                        <div className={styles["slider-container"]}>
                            <div className={styles.strength}>Strength</div>
                            <div className={styles["slider-outer"]}>
                                <div className={styles.bg}>
                                    <div className={styles.left}>

                                    </div>
                                </div>
                                <div className={styles.thumb}>
                                    <div className={styles["thumb-inner"]}>

                                    </div>
                                </div>
                            </div>
                            <div className={styles.number}>
                                <div className={styles["number-text"]}>1</div>
                                <div className={styles["number-text"]}>2</div>
                                <div className={styles["number-text"]}>3</div>
                                <div className={styles["number-text"]}>4</div>
                            </div>
                        </div>
                        <div className={styles["button-container"]}>
                            <div className={styles.button}>
                                <i className="fa fa-pause"></i>
                            </div>
                            <div className={styles.button}>
                                <i className="fa fa-stop"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Exam2;
