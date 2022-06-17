import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { queryFav } from '@/services/note'
import NoteList from '../components/NoteList';
import styles from './styles.less';


const Fav: React.FC = (props, ref) => {

    const [dataList, setDataList] = useState<[]>([]);

    useEffect(() => {
        
        queryFav().then(({ result }) => setDataList(result));
        
    }, [props.note.favKey]);


    const render = function () {

        return (
            <div className={styles.container}>
                <NoteList data={dataList} noDelete={true}></NoteList>
            </div>
        );
    };
    return render();
};

export default connect(({ note }: { note: NoteModelState }) => ({ note }))(Fav);
