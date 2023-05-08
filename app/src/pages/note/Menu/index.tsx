import React from 'react';
import styles from './style.less';
import { connect, history } from 'umi';
import MainMenu from './components/MainMenu'
import ListMenu from './components/ListMenu';

const Menu: React.FC = (props, ref) => {

    //修改菜单类型
    const changeMenuType = value => {
        const { location } = props;
        const query = { ...(location.query || {}), menuType: value }
        history.push({
            pathname: location.pathname,
            query
        })
    }


    const render = function () {
        const { menuType = 3 } = history.location.query;

        return (
            <div className={`${styles.container} ${menuType == 1 ? styles.hide : styles.show}`}>
                <MainMenu menuType={menuType} onChangeMenuType={changeMenuType}></MainMenu>
                <ListMenu {...props}></ListMenu>
            </div>

        );
    };
    return render();
};

export default connect()(Menu);