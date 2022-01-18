import React from 'react';
import styles from './styles.less'
import 'font-awesome/css/font-awesome.min.css';



const Exam9: React.FC<{}> = () => {
    return (

        <div className={styles.container}>

            <input type="checkbox" id="checkBox" />
            <label htmlFor="checkBox" className={styles.menuBtn}>
                <i className="fa fa-navicon"></i>
            </label>
            <div className={styles.con}>
                <h1>主界面</h1>
                <h3>小标题</h3>
            </div>
            <div className={styles.wrapper}>
                <ul className={styles.menu}>
                    <li><a href="#">Menu</a></li>
                    <li><a href="#">Menu</a></li>
                    <li><a href="#">Menu</a></li>
                    <li><a href="#">Menu</a></li>
                    <li><a href="#">Menu</a></li>
                </ul>
            </div>

        </div >

    );
};

export default Exam9;
