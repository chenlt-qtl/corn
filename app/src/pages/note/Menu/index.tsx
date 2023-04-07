import React from 'react';
import styles from './style.less';
import { connect, history } from 'umi';
import MainMenu from './components/MainMenu'
import MinMenu from './components/MinMenu';
import ListMenu from './components/ListMenu';

const menuData = [{ id: "fav", name: "收藏夹", queryType: "" }, { id: "history", name: "最近打开", queryType: "" }, { id: "folder", name: "文件夹", queryType: "getNoteTree" }]
const Menu: React.FC = (props, ref) => {

    useEffect(() => {
        const { type } = props.match.params;
        props.dispatch({
            type: 'note/refreshSelectedFolder',
            payload: menuData.filter(i => i.id == type),
        })
    }, [props.match.params.type])

    const render = function () {
        const { menuType = 3 } = history.location.query;

        return (

            <div className={`${styles.container} ${menuType == 1 ? styles.hide : styles.show}`}>
                {menuType == 2 ? <MinMenu {...props}></MinMenu> :
                    <MainMenu {...props} ></MainMenu>}
                <ListMenu {...props}></ListMenu>
            </div>

        );
    };
    return render();
};

export default connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(Menu);