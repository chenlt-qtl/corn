import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'antd';
import { queryCurrent } from '@/services/user';
import styles from './styles.less'
import QuestionCircleOutlined from '@ant-design/icons'
import { history } from 'umi';
import { outLogin } from '@/services/login';
import { getPageQuery } from '@/utils/utils';



export const INIT_TIMER = 5*60*60;//自动登出时间s
export const INIT_TIMER_WARNING = 5 * 60;//还剩多少秒弹出对话框s
export const REMAIN_TIME_KEY = "remainTimeKey";

// 获取过期时间戳
export function getLogoutTimeStamp() {
    return new Date().getTime() + INIT_TIMER * 1000;
}


export default function LoginTimer() {

    const [visible, setVisible] = useState<boolean>(false);
    const [restTime, setRestTime] = useState<number>(0);


    let timerInterval: any;



    useEffect(() => {
        createTimer();
    }, [])


    useEffect(() => {
        return clearTimer;
    }, [])



    const logout = async () => {
        await outLogin();
        const { redirect } = getPageQuery();
        // Note: There may be security issues, please note
        if (window.location.pathname !== '/user/login' && !redirect) {
            history.replace({ pathname: '/user/login' });

        }
    }

    const handleCancel = () => {
        setVisible(false);
        clearTimer();
        logout();
    }


    // 销毁计时器
    const clearTimer = () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    // 创建计时器
    const createTimer = () => {
        // 重置初始值
        localStorage.setItem(REMAIN_TIME_KEY, String(getLogoutTimeStamp()));
        if (!timerInterval) {
            timerInterval = setInterval(() => {
                const nowTime = new Date().getTime();
                // 剩余时间小于某个时间，弹出提示框提醒
                const logoutTime = parseInt(localStorage.getItem(REMAIN_TIME_KEY) || "0");
                const restTime = Math.floor((logoutTime - nowTime) / 1000);

                if (restTime <= INIT_TIMER_WARNING && restTime >= 0) {
                    setVisible(true);
                    setRestTime(restTime);
                } else {
                    setVisible(false);
                }
                if (restTime < 0) {
                    handleCancel();
                }
            }, 1000);
        }

    }



    return (
        <Modal
            title={null}
            footer={null}
            visible={visible}
            closable={false}
            width={416}
        >
            <div className={styles.container}>
                <div className={styles.title}><QuestionCircleOutlined />您还在当前页面吗？</div>
                <div className={styles.content}>{`由于不活跃您将在${restTime}秒后注销登录状态并登出`}</div>
                <div className={styles.footer}>
                    <Button onClick={handleCancel}>登出</Button>
                    <Button type="primary"
                        onClick={() => {
                            localStorage.setItem(REMAIN_TIME_KEY, String(getLogoutTimeStamp()));
                            setVisible(false)
                            //获取一下客户信息
                            queryCurrent();
                        }}
                    >保持登录状态</Button>
                </div>
            </div>
        </Modal>
    )


}


