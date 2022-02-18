import React from 'react';
import styles from './styles.less'
import 'font-awesome/css/font-awesome.min.css';



const Button3D: React.FC<{}> = () => {
    return (

        <div className={styles.container}>
            <div className={styles.icons}>
                <a href="#">
                    <div className={styles.layer}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span className='fa fa-facebook-f'></span>
                    </div>
                    <div className={styles.text}>Facebook</div>
                </a>
                <a href="#">
                    <div className={styles.layer}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span className='fa fa-twitter'></span>
                    </div>
                    <div className={styles.text}>Twitter</div>
                </a>
                <a href="#">
                    <div className={styles.layer}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span className='fa fa-instagram'></span>
                    </div>
                    <div className={styles.text}>Instagram</div>
                </a>
                <a href="#">
                    <div className={styles.layer}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span className='fa fa-linkedin'></span>
                    </div>
                    <div className={styles.text}>Linkedin</div>
                </a>
                <a href="#">
                    <div className={styles.layer}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span className='fa fa-youtube-play'></span>
                    </div>
                    <div className={styles.text}>Youtube</div>
                </a>
            </div>
        </div>

    );
};

export default Button3D;
