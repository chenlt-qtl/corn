import React, { useState, useEffect } from 'react';
import { GameItem } from '@/data/game';
import styles from './styles.less'
import { getGameList } from '@/services/game'
import {history} from 'umi';

const PlayList: React.FC<{}> = () => {

    const [listData, setListData] = useState<GameItem[]>([]);

    useEffect(() => {
        getTableData();
    }, [])

    const getTableData = async () => {
        const res = await getGameList();
        setListData(res.result.records);

    }

    const handlePlay = (game: GameItem) => {
        history.push(`/play/${game.id}`);
    }



    return (
        <div>
            {listData.map(item =>
                <section key={item.id} onClick={()=>handlePlay(item)} className={styles.item}>{item.gameName}</section>
            )}
        </div>
    );
};

export default PlayList;
