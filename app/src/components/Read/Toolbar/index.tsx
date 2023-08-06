import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { MenuOutlined, LeftOutlined, RightOutlined, CaretRightOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';

import { getMenu } from '@/services/read';
import styles from "./styles.less"


function Toolbar() {
    let { mId = 0 } = props.match.params;
    const [ids, setIds] = useState<[]>([]);
    const [index, setIndex] = useState<number>(0);
    const [ids, setIds] = useState<[]>([]);

    let menuData = [];

    useEffect(() => {
        getMenuData()
    }, [])

    const getMenuData = async () => {
        const res = await getMenu();
        if (res.success) {

            menuData = JSON.parse(res.result.value);
            if (mId * 1 >= menuData.length) {
                mId = 0;
            }
            console.log(mId, menuData[mId].ids);

            setIds(menuData[mId].ids)
        }

    }

    useEffect(() => {
        if (ids.length > 0) {
            setIndex(0);
            getData(0);
        }
    }, [mId]);

    //菜单点击事件
    const onMenuClick = (moduleId: number) => {
        props.history.push('/all/read/' + moduleId);
    };

    //翻页
    const go = (index: number) => {
        setIndex(index);
        getData(index);
    };

    //菜单
    const content = (
        <div className={styles.menuContent}>
            {menuData.map((menu, index) => (
                <div
                    key={index}
                    onClick={() => onMenuClick(index)}
                    className={mId == index ? styles.activeMenu : ''}
                >
                    {mId == index ? (
                        <div className={styles.caret}>
                            <CaretRightOutlined />
                        </div>
                    ) : (
                        ''
                    )}
                    <div className={styles.title}>M{index + 1}</div>
                    <div className={styles.subTitle}>{menu.subTitle}</div>
                </div>
            ))}
        </div>
    );
    return (
        <div className={styles.toolbar}>
            <div className={styles.btnDiv}>
                <Popover content={content} trigger="click">
                    <Button type="primary" shape="circle" icon={<MenuOutlined />} />
                </Popover>

                <div className={styles.label}>目录</div>
            </div>

            <div className={styles.btnDiv}>
                <Button
                    onClick={() => go(index - 1)}
                    type="primary"
                    shape="circle"
                    disabled={index == 0}
                    icon={<LeftOutlined />}
                />
                <div className={styles.label}>上一页</div>
            </div>

            <div className={styles.btnDiv}>
                <Button
                    onClick={() => go(index + 1)}
                    type="primary"
                    shape="circle"
                    disabled={index >= ids.length - 1}
                    icon={<RightOutlined />}
                />
                <div className={styles.label}>下一页</div>
            </div>
        </div>
    )
}


export default withRouter(Toolbar)