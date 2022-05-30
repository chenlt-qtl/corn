import React, { useEffect, useState } from 'react';
import { Dropdown, Menu, Modal, notification, Button, Input } from 'antd';
import { ExclamationCircleOutlined, SearchOutlined, FileTextOutlined, FolderOutlined, DeleteOutlined, HomeOutlined, EllipsisOutlined } from '@ant-design/icons';
import styles from './styles.less';
import { connect } from 'umi';
import { queryFav } from '@/services/note'
import NoteList from '../components/NoteList';


const Fav: React.FC = (props, ref) => {

    const [dataList, setDataList] = useState<[]>([]);

    useEffect(() => {
        queryFav().then(({ result }) => setDataList(result));
    }, []);


    const render = function () {

        const loading = props.loading.effects["noteMenu/refreshNewestData"] || false;
        return (
            <div style={props.style}>
                <NoteList data={dataList} noDelete={true}></NoteList>
            </div>
        );
    };
    return render();
};

export default connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu, loading }) => ({ note, noteMenu, loading }))(Fav);
