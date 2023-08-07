import React, { useState } from 'react';
import styles from './styles.less';
import { Spin } from 'antd';
import Toolbar from '@/components/Read/Toolbar';
import PointPicture from '@/components/Read/PointPicture';

const Read = (props, ref) => {


    const [loading, setLoading] = useState<boolean>(false);

    const render = function () {

        return (
            <div className={styles.container}>
                <Spin spinning={loading}>
                    <PointPicture setLoading={setLoading}></PointPicture>
                    <Toolbar></Toolbar>
                </Spin>

            </div>
        );
    };
    return render();
};

export default Read;
