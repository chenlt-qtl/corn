import React from 'react';
import styles from './styles.less'
import 'font-awesome/css/font-awesome.min.css';



const Menu: React.FC<{}> = () => {
    return (

        <div className={styles.container}>
            <div className={styles.menu}>
                <input type="checkbox" id="checkBox"></input>
                <label className={styles.toggle} htmlFor="checkBox"><span className="fa fa-plus"></span></label>
                <li style={{ "--i": 0 }}>
                    <a href="#"><span className="fa fa-home"></span></a>
                </li>
                <li style={{ "--i": 1 }}>
                    <a href="#"><span className="fa fa-user"></span></a>
                </li>
                <li style={{ "--i": 2 }}>
                    <a href="#"><span className="fa fa-gear"></span></a>
                </li>
                <li style={{ "--i": 3 }}>
                    <a href="#"><span className="fa fa-envelope"></span></a>
                </li>
                <li style={{ "--i": 4 }}>
                    <a href="#"><span className="fa fa-key"></span></a>
                </li>
                <li style={{ "--i": 5 }}>
                    <a href="#"><span className="fa fa-video-camera"></span></a>
                </li>
                <li style={{ "--i": 6 }}>
                    <a href="#"><span className="fa fa-gamepad"></span></a>
                </li>
                <li style={{ "--i": 7 }}>
                    <a href="#"><span className="fa fa-camera"></span></a>
                </li>
            </div>
        </div>

    );
};

export default Menu;
