import { Button } from 'antd'
import React from 'react'
import { LeftOutlined } from '@ant-design/icons';

import styles from './styles.less'


export default function index(props) {
    const { title, children, onBack } = props;
    return (
        <div className={styles.container}>
            <div>
                {onBack ? <Button onClick={onBack} type='link'><LeftOutlined /></Button> : null}{title}
            </div>
            <div>{children}</div>
        </div>
    )
}
