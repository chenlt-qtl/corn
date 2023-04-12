import React from 'react';
import styles from './style.less';
import { connect, history } from 'umi';
import MainMenu from './components/MainMenu'
import MinMenu from './components/MinMenu';
import ListMenu from './components/ListMenu';

const Menu: React.FC = (props, ref) => {
    const render = function () {
        const { menuType = 3 } = history.location.query;

        return (
            <div className={`${styles.container} ${menuType == 1 ? styles.hide : styles.show}`}>
                {menuType == 2 ? <MinMenu></MinMenu> :
                    <MainMenu></MainMenu>}
                <ListMenu {...props}></ListMenu>
            </div>

        );
    };
    return render();
};

export default connect()(Menu);