import React, { useState } from 'react';
import styles from './styles.less';
import { CloseOutlined } from '@ant-design/icons';


const Chinese = props => {

    const { chinese } = props;

    const [visible, setVisible] = useState<boolean>(true)

    const render = function () {

        return (<>
            {chinese ? <div className={`${styles.chineseWin} ${visible ? styles.show : styles.hide}`} >
                {visible ? <CloseOutlined className={styles.close} onClick={() => setVisible(false)} /> : null}
                <div className={styles.chinese} onClick={()=>!visible&&setVisible(true)}>{visible ? chinese : "翻译"}</div>
            </div> : null}
        </>

        );
    };
    return render();
};

export default Chinese;
