import React, { useState } from 'react';
import styles from './styles.less';
import { Spin } from 'antd';
import Toolbar from '@/components/Read/Toolbar';
import PointPicture from '@/components/Read/PointPicture';

const Read = (props, ref) => {


    const [loading, setLoading] = useState<boolean>(false);
    const [articleId, setArticleId] = useState<number>(0);

    const render = function () {

        return (
            <div className={styles.container}>
                <Spin spinning={loading}>
                    <PointPicture articleId={articleId} setLoading={setLoading}></PointPicture>
                    <Toolbar setArticleId={setArticleId}></Toolbar>
                </Spin>

            </div>
        );
    };
    return render();
};

export default Read;
