import React, { useState } from 'react';
import styles from './style.less';
import { connect, history } from 'umi';
import MainMenu from './components/MainMenu'
import ListMenu from './components/ListMenu';
import ChangeParentModal from '../components/ChangeParentModal';

const Menu: React.FC = (props, ref) => {

    const [parentModalVisible, setParentModalVisible] = useState<boolean>(false);
    const [note, setNote] = useState({});

    //修改菜单类型
    const changeMenuType = value => {
        const { location } = props;
        const query = { ...(location.query || {}), menuType: value }
        history.push({
            pathname: location.pathname,
            query
        })
    }

    const onChangeParent = node => {
        setParentModalVisible(true)
        setNote(node)
    }


    const render = function () {
        const { menuType = 3 } = history.location.query;

        return (
            <div className={`${styles.container} ${menuType == 1 ? styles.hide : styles.show}`}>
                <MainMenu menuType={menuType} onChangeMenuType={changeMenuType} onChangeParent={onChangeParent}></MainMenu>
                <ListMenu {...props} onChangeParent={onChangeParent}></ListMenu>
                <ChangeParentModal node={note} onCancel={() => setParentModalVisible(false)} visible={parentModalVisible}></ChangeParentModal>
            </div>

        );
    };
    return render();
};

export default connect()(Menu);