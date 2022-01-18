
import { history } from 'umi';
import { Modal } from 'antd';
import { queryCurrent } from '@/services/user';


const confirm = Modal.confirm;
const INIT_TIMER = 5 * 60 * 60;//自动登出时间s
const INIT_TIMER_WARNING = INIT_TIMER - 10*60;//还剩多少秒弹出对话框s


export default class LoginTimer {

    timerInterval;
    remainTimeKey = "remainTime";
    pop: object | null;

    constructor() {
        this.pop = null;
    }

    showNotice(time: number) {
        if (this.pop === null) {
            this.pop = confirm({});
        }
        let that = this;
        let props = {
            title: "您还在当前页面吗？",
            content: `由于不活跃您将在${time}秒后注销登录状态并登出`,
            okText: '保持登录状态',
            cancelText: '登出',
            visible: true,
            onOk() {
                queryCurrent();
            },
            onCancel() {
                // 登出
                that.destoryConfirm();
                that.clearTimer();
                history.push('/user/login');
            },
        };
        this.pop.update(props);
    }

    // 销毁提示框
    destoryConfirm() {
        this.pop && this.pop.destroy();
    }

    // 销毁计时器
    clearTimer = () => {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = 0;
        }
    }

    // 创建计时器
    createTimer() {

        // 每次都要重置初始值
        localStorage.setItem(this.remainTimeKey, String(INIT_TIMER));
        if (!this.timerInterval) {
            this.timerInterval = setInterval(() => {
                // 剩余时间小于某个时间，弹出提示框提醒
                let timer = parseInt(localStorage.getItem(this.remainTimeKey) || "0")

                if (timer <= INIT_TIMER_WARNING && timer >= 0) {
                    this.showNotice(timer);
                } else {
                    this.destoryConfirm();
                }
                timer--;
                if (timer < 0) {
                    this.destoryConfirm();
                    this.clearTimer();
                    // 跳转至302，执行登出
                    history.push('/user/login');
                }
                localStorage.setItem(this.remainTimeKey, String(timer));
            }, 1000);
        }
    }

    /**
     * 检查request url 是否需要触发计时器刷新
     * @param url
     * @returns {boolean}  true表示需要刷新，false表示不需要刷新
     */
    checkRequestUrlForTimer(url: string) {
        let res = true;
        let pat = /^(.*)?(\/login|\/logout)(\/.*)?$/g;
        let flag = pat.test(url);
        
        res = flag ? false : true;
        return res;
    }

    refreshTimer() {
        this.clearTimer();
        this.createTimer();
    }


    //  刷新计时器
    resetTimer = (url: string) => {

        if (url) {
            let check = this.checkRequestUrlForTimer(url);

            if (check) {
                this.refreshTimer();
            }
        }
    };

}