import React, { useState, useEffect } from 'react';
import { Tabs, Skeleton } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import { connect, NoteModelState } from 'umi';

const { TabPane } = Tabs;

const openNotesTab = { id: '', name: '最近打开' };

const TopTabs: React.FC<{}> = (props) => {

    const [tabData, setTabData] = useState<object[]>([]);

    const onClick = (id: string) => {
        props.onTabChange(id);
    }

    useEffect(() => {
        props.dispatch({
            type: 'note/queryChildren',
            payload: '0',
        }).then((res) => {
            if (res) {
                const { result } = res;
                setTabData([openNotesTab, ...result]);
            }
        });
    }, []);
    const loading = props.loading.effects["note/queryChildren"];
    const { activeTabId } = props.note;
    return (
        <div>
            <Skeleton title={false} active={true} paragraph={{ rows: 1 }} loading={loading}>
                <Tabs defaultActiveKey={activeTabId} onChange={onClick}>
                    {tabData.map((item, index) => {
                        return (
                            <TabPane key={item.id}
                                tab={
                                    <span>
                                        {index > 0 ? '' : <BookOutlined />}
                                        {item.name}
                                    </span>
                                }>
                            </TabPane>
                        )
                    })}
                </Tabs>
            </Skeleton>
            <div>
                {props.children}
            </div>
        </div>
    );
}
export default connect(({ note, loading }: { note: NoteModelState, loading: any }) => ({ note, loading }))(TopTabs);
