import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { MenuOutlined, LeftOutlined, RightOutlined, CaretRightOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';

import { getMenu } from '@/services/read';
import styles from "./styles.less"


const Toolbar = (props, ref) => {

    const { setArticleId } = props;

    const [articleIds, setArticleIds] = useState<[]>([]);
    const [articleIndex, setArticleIndex] = useState<number>(0);
    const [menuData, setMenuData] = useState<[]>([]);
    const [menuIndex, setMenuIndex] = useState<number>(-1);

    useEffect(() => {
        getMenuData()
    }, [])

    const getMenuData = async () => {
        const res = await getMenu();
        if (res.success) {

            const menuData = JSON.parse(res.result.value);
            setMenuData(menuData)
            changeMenuIndex(menuData)
        }

    }

    useEffect(() => {
        changeMenuIndex(menuData)
    }, [props.match.params.menuIndex])

    const changeMenuIndex = (menuData: []) => {
        let menuIndex = props.match.params.menuIndex || 0;
        if (menuIndex * 1 >= menuData.length) {
            menuIndex = 0;
        }
        setMenuIndex(menuIndex)
        if (menuData.length > 0) {
            const articleIds = menuData[menuIndex].ids || [];
            setArticleIds(articleIds)
            console.log("articleIds", articleIds);

            articleIds.length > 0 && setArticleId(articleIds[0])
        }
    }

    //菜单点击事件
    const onMenuClick = (menuIndex: number) => {
        props.history.push('/all/read/' + menuIndex);
    };

    //翻页
    const go = (index: number) => {
        setArticleIndex(index);
        setArticleId(articleIds[index])
    };

    //菜单
    const content = (
        <div className={styles.menuContent}>
            {menuData.map((menu, index) => (
                <div
                    key={index}
                    onClick={() => onMenuClick(index)}
                    className={menuIndex == index ? styles.activeMenu : ''}
                >
                    {menuIndex == index ? (
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
                    onClick={() => go(articleIndex - 1)}
                    type="primary"
                    shape="circle"
                    disabled={articleIndex == 0}
                    icon={<LeftOutlined />}
                />
                <div className={styles.label}>上一页</div>
            </div>

            <div className={styles.btnDiv}>
                <Button
                    onClick={() => go(articleIndex + 1)}
                    type="primary"
                    shape="circle"
                    disabled={articleIndex >= articleIds.length - 1}
                    icon={<RightOutlined />}
                />
                <div className={styles.label}>下一页</div>
            </div>
        </div>
    )
}


export default withRouter(Toolbar)