import React from 'react';
import styles from './styles.less'
import 'font-awesome/css/font-awesome.min.css';



const Exam8: React.FC<{}> = () => {
    return (

        <div className={styles.container}>

            <div className={styles.navbar}>
                <input type="checkbox" name="" id="" />
                <span></span>
                <span></span>
                <ul>
                    <li><a href="javascript:void(0)">back</a></li>
                    <li><a href="javascript:void(0)">new</a></li>
                    <li><a href="javascript:void(0)">edit</a></li>
                    <li><a href="javascript:void(0)">view</a></li>
                    <li><a href="javascript:void(0)">next</a></li>
                </ul>
            </div>

        </div >

    );
};

export default Exam8;
