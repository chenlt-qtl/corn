import React from 'react';
import styles from './styles.less'
import 'font-awesome/css/font-awesome.min.css';



const Keyboard: React.FC<{}> = () => {
    return (

        <div className={styles.container}>
            <span><i>C</i></span>
            <span><i>S</i></span>
            <span><i>S</i></span>
            <span><i>O</i></span>
            <span><i>n</i></span>
            <span><i>l</i></span>
            <span></span>
        </div >

    );
};

export default Keyboard;
