import React, { useState,useEffect } from 'react';
import { IRouteComponentProps,Link } from 'umi'
import styles from './styles.less'

export default function GlobalHeader({ children, location, route, history, match }: IRouteComponentProps) {

    const [activeUrl, setActiveUrl] = useState<string>('/');

    useEffect(() => {
        setActiveUrl(location.pathname);
    }, [location])

    const menus = [{ url: '/note', text: '笔记' }, { url: '/article', text: '英语' }];

    return (
        <>
            <header>
                <div className={styles.container}>
                    <div className={styles.logo}>
                        <a href="/">Acorn</a>
                    </div>
                    <nav className={styles.nav}>
                        <ul>
                            {menus.map(item => (
                                <li key={item.url} className={item.url === activeUrl ? styles.active : undefined}>
                                    <Link to={item.url}>{item.text}</Link>
                                </li>
                            ))}
                            <li><Link to="/logout">退出</Link></li>
                        </ul>
                    </nav>
                </div>
            </header>
            { children}
        </>)
}