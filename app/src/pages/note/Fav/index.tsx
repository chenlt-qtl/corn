import React, { useEffect, useState } from 'react';
import { Dropdown, Menu, Modal, notification, Button, Input } from 'antd';
import { ExclamationCircleOutlined, SearchOutlined, FileTextOutlined, FolderOutlined, DeleteOutlined, HomeOutlined, EllipsisOutlined } from '@ant-design/icons';
import styles from './styles.less';
import { connect } from 'umi';
import { queryNoteById, queryFav } from '@/services/note'
import NoteList from '../components/NoteList';


const { confirm } = Modal;
const Fav: React.FC = (props, ref) => {
    const [searchInputStr, setSearchInputStr] = useState<string>("");

    const [dataList, setDataList] = useState<[]>([]);

    useEffect( () => {
        queryFav().then(({ data }) => setDataList(data));
    }, []);

    // useEffect(() => {

    //     const parentId = props.noteMenu.listParentNote.id;

    //     const pageNo = 1, pageSize = 5;

    //     if (parentId != undefined) {
    //         if (parentId == "search") {

    //             props.dispatch({
    //                 type: 'noteMenu/refreshPageInfo',
    //                 payload: { pageNo, pageSize }
    //             })
    //             props.dispatch({
    //                 type: 'noteMenu/searchNote',
    //                 payload: { pageNo, pageSize, searchStr, searchParentId }
    //             })
    //         } else if (parentId == "newest") {
    //             props.dispatch({
    //                 type: 'noteMenu/refreshPageInfo',
    //                 payload: { pageNo, pageSize }
    //             })
    //             props.dispatch({
    //                 type: 'noteMenu/queryNewest',
    //                 payload: { pageNo, pageSize }
    //             })
    //         } else {
    //             props.dispatch({
    //                 type: `noteMenu/queryMenuItems`,
    //                 payload: parentId,
    //             })
    //         }

    //     }

    // }, [props.noteMenu.listParentNote]);



    const render = function () {


        const loading = props.loading.effects["noteMenu/refreshNewestData"] || false;
        return (
            <div style={props.style}>
                <NoteList data={dataList}></NoteList>
            </div>
        );
    };
    return render();
};

export default connect(({ note, noteMenu, loading }: { note: NoteModelState, noteMenu, loading }) => ({ note, noteMenu, loading }))(Fav);
