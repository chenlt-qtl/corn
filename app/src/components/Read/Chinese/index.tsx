import React, { useState } from 'react';
import styles from './styles.less';
import FaIcon from '@/components/FaIcon';


const Chinese = props => {

    const { chinese, visible, setVisible } = props;

    const render = function () {

        return (<>
            {chinese ? <div className={`${styles.chineseWin} ${visible ? styles.show : styles.hide}`} >
                {visible ? <div className={styles.close} onClick={() => setVisible(false)} > <FaIcon className="fa-times-circle"></FaIcon></div> : null}
                <div className={styles.chinese} onClick={() => !visible && setVisible(true)}>{visible ? chinese : "显示中文"}</div>
            </div> : null}
        </>

        );
    };
    return render();
};

export default Chinese;
