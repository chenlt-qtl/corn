import React, { useState, useEffect } from 'react';
import { IRouteComponentProps, Link, useModel, history } from 'umi'
import { stringify } from 'querystring';
import styles from './styles.less'
import { outLogin } from '@/services/login';
import { getPageQuery } from '@/utils/utils';
import LoginTimer from "@/components/LoginTimer"
import { MenuOutlined } from '@ant-design/icons';
import HocMedia from "@/components/HocMedia";
import menuConfig from '../../../config/menu';


const configs = menuConfig.routes.map(route=>route.routes.map(i=>({...i})).filter(i=>{
    i.path = route.path+i.path;
    return i.name}));
    
const menus = [].concat.apply([],configs);

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

function HeaderLayout({ children, location, isMobile }: IRouteComponentProps) {

    const [activeUrl, setActiveUrl] = useState<string>('/');
    const { initialState, setInitialState } = useModel('@@initialState');

    useEffect(() => {
        setActiveUrl(location.pathname);
    }, [location])

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
                            <div className={`${styles.menu} ${styles.a}`} onClick={showMenu}>
                                <div className={styles.menuBtn}>
                                    <MenuOutlined />
                                </div>
                                <ul className={styles.menu}>
                                    <li><a href="#">Menu</a></li>
                                    <li><a href="#">Menu</a></li>
                                    <li><a href="#">Menu</a></li>
                                    <li><a href="#">Menu</a></li>
                                    <li><a href="#">Menu</a></li>
                                </ul>
                            </div>
                        </nav> :
                        <nav className={styles.nav}>
                            <ul>
                                {menus.map(item => (
                                    <li key={item.path} className={item.path === activeUrl ? styles.active : undefined}>
                                        <Link to={item.path}>{item.name}</Link>
                                    </li>
                                ))}
                                <li><a href="#" onClick={logout}>退出</a></li>
                            </ul>
                        </nav>
                    }



                </div>
            </header>
            {children}
        </>)
}

export default HocMedia(HeaderLayout);