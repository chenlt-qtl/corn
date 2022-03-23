import React, { useState, useEffect } from 'react';
import { IRouteComponentProps, Link, useModel, history } from 'umi'
import { stringify } from 'querystring';
import styles from './styles.less'
import { outLogin } from '@/services/login';
import { getPageQuery } from '@/utils/utils';
import LoginTimer from "@/components/LoginTimer"
import { MenuOutlined } from '@ant-design/icons';
import HocMedia from "@/components/HocMedia";

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
    await outLogin();
    const { redirect } = getPageQuery();
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
            pathname: '/user/login',
            search: stringify({
                redirect: window.location.href,
            }),
        });
    }
};

function GlobalHeader({ children, location, isMobile }: IRouteComponentProps) {

    const [activeUrl, setActiveUrl] = useState<string>('/');
    const { initialState, setInitialState } = useModel('@@initialState');

    useEffect(() => {
        setActiveUrl(location.pathname);
    }, [location])

    const menus = [{ url: '/noteapp', text: '笔记' }, { url: '/word', text: '英语' }, { url: '/game', text: '游戏管理' }, { url: '/play/list', text: '游戏' }, { url: '/wordChinese', text: '语文天地' }, { url: '/splicMp3', text: '切割' }, { url: '/exam', text: '例子' }];

    const logout = () => {
        setInitialState({ ...initialState, currentUser: undefined });
        loginOut();
        return;
    }

    const showMenu = () => {

    }

    return (
        <>
            <LoginTimer></LoginTimer>
            <header>
                <div className={styles.container}>
                    <div className={styles.logo}>
                        <a href="/">Acorn</a>
                    </div>
                    {isMobile ?
                        <nav>
                            <div className={styles.menu} onClick={showMenu}>
                                <MenuOutlined />
                            </div>
                        </nav> :
                        <nav className={styles.nav}>
                            <ul>
                                {menus.map(item => (
                                    <li key={item.url} className={item.url === activeUrl ? styles.active : undefined}>
                                        <Link to={item.url}>{item.text}</Link>
                                    </li>
                                ))}
                                <li><a href="#" onClick={logout}>退出</a></li>
                            </ul>
                        </nav>
                    }

                    <div className={styles.wrapper}>
                        <ul className={styles.menu}>
                            <li><a href="#">Menu</a></li>
                            <li><a href="#">Menu</a></li>
                            <li><a href="#">Menu</a></li>
                            <li><a href="#">Menu</a></li>
                            <li><a href="#">Menu</a></li>
                        </ul>
                    </div>

                </div>
            </header>
            {children}
        </>)
}

export default HocMedia(GlobalHeader);