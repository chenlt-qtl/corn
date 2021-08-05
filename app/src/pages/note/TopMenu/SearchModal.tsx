import React, { useState, useEffect } from 'react';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { Modal, List, Input, Button, Spin } from 'antd';
import styles from './styles.less';
import { searchNote } from '@/pages/note/service'
import MdEditor from 'react-markdown-editor-lite'
import marked from 'marked'
import { NoteItem } from '../data';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'umi';

const pageSize = 20;

interface SearchProps {
    modalVisible: boolean;
    onCancel: (needRefresh: boolean) => void;
}

const SearchModal: React.FC<SearchProps> = (props) => {
    const { modalVisible, onCancel } = props;

    const [searchStr, setSearchStr] = useState<string>('');

    const [dataList, setDataList] = useState<object[]>([]);

    const [note, setNote] = useState<NoteItem>({});

    const [pageNo, setPageNo] = useState<number>(1);

    const [total, setTotal] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(false);

    const [moreLoading, setMoreLoading] = useState<boolean>(false);

    const onSearch = async (pageNo: number) => {
        if (pageNo == 1) {
            setLoading(true);
        }
        setMoreLoading(true);
        let result = await searchNote({ pageNo, pageSize, searchStr });
        if (result && result.success) {
            setTotal(result.result.total)
            if (pageNo == 1) {
                setDataList(result.result.records)
            } else {
                setDataList([...dataList, ...result.result.records])
            }
        } else {
            setTotal(0)
            setDataList([]);
        }
        setMoreLoading(false)
        setLoading(false)
    }

    const loadMore = () => {
        onSearch(pageNo + 1);
        setPageNo(pageNo + 1);
    }

    const showNote = (note: NoteItem) => {
        setNote(note);
    }

    const openNote = () => {
        const parentIds = note.parentIds;
        if (parentIds) {
            const ids = parentIds.split("/");
            ids.push(note.id)
            props.dispatch({
                type: 'noteMenu/updateActiveTop',
                payload: ids[1],
            })

            if (ids[2]) {
                props.dispatch({
                    type: 'noteMenu/refreshActiveMenu1Id',
                    payload: ids[2]
                })
            }
            if (ids[3]) {
                props.dispatch({
                    type: 'noteMenu/refreshActiveMenu2Id',
                    payload: ids[3]
                })
            }
            if (ids[4]) {
                props.dispatch({
                    type: 'noteMenu/refreshActiveMenu3Id',
                    payload: ids[4],
                })
            }
            props.dispatch({
                type: 'note/queryNote',
                payload: note.id,
            })
            props.onCancel();
        }
    }

    useEffect(() => {
        onSearch(pageNo);
    }, [pageNo])

    return (
        <Modal visible={modalVisible} closable={false} footer={false} style={{ top: 20 }}>
            <div className={styles.modal}>
                <div className={styles.title} style={{ borderBottom: 0 }}>
                    <span>搜索笔记本</span>
                    <div className={styles.buttons}>
                        <Button type="text" onClick={onCancel}><CloseOutlined /></Button>
                    </div>
                </div>
                <Input prefix={<SearchOutlined className="site-form-item-icon" />} onChange={e => setSearchStr(e.target.value)} onPressEnter={() => onSearch(1)} onBlur={() => onSearch(1)} />
                <Spin spinning={loading}>
                    <div className={styles.searchList}>
                        <InfiniteScroll
                            initialLoad={false}
                            pageStart={0}
                            loadMore={loadMore}
                            hasMore={!moreLoading && dataList.length < total}
                            useWindow={false}
                        >
                            <List
                                size="small"
                                dataSource={dataList}
                                renderItem={(item: NoteItem) => <List.Item className={`${styles.listItem} ${item.id == note.id ? styles.select : ''}`} onClick={() => showNote(item)} key={item.id}>{item.name}</List.Item>}
                            >
                                {moreLoading && (dataList.length < total) && (
                                    <div className={styles.loading}>
                                        <Spin />
                                    </div>
                                )}
                            </List>
                        </InfiniteScroll>
                    </div>
                </Spin>
                <div className={styles.content}>
                    <MdEditor
                        style={{ border: 0 }}
                        value={note.text}
                        renderHTML={() => marked(note.text || "")}
                        config={{ view: { menu: false, md: false } }}
                        readOnly={true}
                    />
                </div>
                <div className={styles.searchTb}>
                    <Button disabled={!note.id} onClick={openNote}>打开</Button>
                    <Button onClick={onCancel}>关闭</Button>
                </div>
            </div>
        </Modal>
    );
};

export default connect()(SearchModal);
