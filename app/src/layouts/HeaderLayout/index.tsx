import React, { useState, useEffect } from 'react';
import { IRouteComponentProps, Link, useModel, history } from 'umi'
import { stringify } from 'querystring';
import styles from './styles.less'
import { outLogin } from '@/services/login';
import { getPageQuery } from '@/utils/utils';
import LoginTimer from "@/components/LoginTimer"
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import HocMedia from "@/components/HocMedia";
import menuConfig from '../../../config/menu';


const configs = menuConfig.routes.map(route => route.routes.map(i => ({ ...i })).filter(i => {
    i.path = route.path + i.path;
    return i.name
}));

const menus = [].concat.apply([], configs);

console.log(menus);


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
    const [classNames, setClassNames] = useState<string[]>([styles.menu]);
    const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

    useEffect(() => {
        setActiveUrl(location.pathname);
    }, [location])

    const logout = () => {
        setInitialState({ ...initialState, currentUser: undefined });
        loginOut();
        return;
    }

    const handleMenuClick = () => {
        if (isMenuVisible) {
            setClassNames([styles.menu])
            setIsMenuVisible(false);
        } else {
            setClassNames([styles.menu, styles.full])
            setIsMenuVisible(true);
        }
    }

    return (
        <div className={styles.container}>
            <LoginTimer></LoginTimer>
            <header className={styles.header}>
                <div className={styles.logo}>
                    <a href="/">Acorn</a>
                </div>
                {isMobile ?
                    <nav>
                        <div className={classNames.join(" ")} onClick={handleMenuClick}>
                            <div className={styles.menuBtn}>
                                {isMenuVisible ? <CloseOutlined /> : <MenuOutlined />}
                            </div>
                            <ul>
                                {menus.map(menu=><li key={menu.path}><Link to={menu.path}>{menu.name}</Link></li>)}
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
            </header>
            <div className={styles.main}>{children}</div>
        </div>)
}

export default HocMedia(HeaderLayout);