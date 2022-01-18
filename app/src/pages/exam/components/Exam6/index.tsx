import React from 'react';
import styles from './styles.less'
import 'font-awesome/css/font-awesome.min.css';



const Exam6: React.FC<{}> = () => {
    return (

        <div className={styles.container}>
            <div className={styles.phone}>
                <div className={styles.inner}>
                    <div className={styles.header}>
                        <button className={`${styles.button} ${styles.back}`}>
                            <i className='fa fa-arrow-left' />
                        </button>
                        <h2 className={styles.title}>My Playlist</h2>
                        <button className={`${styles.button} ${styles.more}`}>
                            <i className='fa fa-ellipsis-h' />
                        </button>
                    </div>

                    <div className={styles.cover}>
                        <img src="https://p2.music.126.net/rNQH185Dp2lcG2yII_Aiwg==/18159534045164927.jpg" alt="Sober Up" />
                    </div>

                    <div className={styles.info}>
                        <h3 className={styles.song}>Sober Up</h3>
                        <h4 className={styles.artist}>AJR/Rviers Cuomo</h4>
                    </div>

                    <div className={styles.time}>
                        <div className={styles.bar}></div>
                    </div>

                    <div className={styles.control}>
                        <button className={styles.controlButton}>
                            <i className='fa fa-step-backward'></i>
                        </button>

                        <button className={styles.playButton}>
                            <i className='fa fa-play'></i>
                        </button>

                        <button className={styles.controlButton}>
                            <i className='fa fa-step-forward'></i>
                        </button >
                    </div >

                </div >
            </div >

        </div >

    );
};

export default Exam6;
