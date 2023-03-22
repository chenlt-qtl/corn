import React, { useEffect, useState } from 'react';
import { TreeSelect, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './styles.less';
import { connect } from 'umi';
import { queryTreeMenu, pageSearchNote } from '@/services/note'
import { NoteNode } from '@/data/note';
import NoteList from '../NoteList';

const Search: React.FC = (props, ref) => {
    const [searchStr, setSearchStr] = useState<string>("");

    const [parentId, setParentId] = useState<string>("");

    const [noteTree, setNoteTree] = useState<NoteNode[]>([]);
    const [params, setParams] = useState<Object>({});


    useEffect(() => {

        queryTreeMenu("0", false).then(({ result }) => setNoteTree(result))

    }, []);

    useEffect(() => {
        handleSearch();
    }, [parentId]);

    const handleSearch = () => {
        const params = { parentId, searchStr, withLeaf: false }
        setParams(params);
    }

    const render = function () {

        return (
            <div className={styles.container} style={props.style}>
                <div className={styles.searchBar}>
                    <Input className={styles.search} value={searchStr} onChange={e => setSearchStr(e.currentTarget.value)} onPressEnter={handleSearch} suffix={<SearchOutlined />}></Input>
                    <div>
                        <label className={styles.treeLabel}>位置 :</label>
                        <TreeSelect
                            style={{ width: '100%' }}
                            value={parentId}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={noteTree}
                            placeholder="Please select"
                            onChange={parentId => setParentId(parentId)}
                            allowClear
                        />
                    </div>
                </div>
                <div className={styles.list}>
                    <NoteList getDataMethod={pageSearchNote} params={params}></NoteList>
                </div>
            </div>
        );
    };
    return render();
};

export default connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(Search);
