import React, { useState, useEffect } from 'react';
import { queryNote } from './service'
import { useModel } from 'umi';
import { Tabs } from 'antd';
import { BookOutlined } from '@ant-design/icons';
const { TabPane } = Tabs;

const openNotesTab = { id: '', name: '最近打开'};

const TopTabs: React.FC<{}> = (props) => {

    const [activeId, setActiveId] = useState<string>("1");

    const [tabData, setTabData] = useState<object[]>([]);

    const { setSelectedKeys } = useModel('note', ({ setSelectedKeys }) => ({ setSelectedKeys }));


    const onClick = (id: string) => {
        setActiveId(id);
        props.onTabChange(id);
        setSelectedKeys([]);
    }

    useEffect(() => {
        queryNote('0').then((res) => {
            if (res) {
                console.log(res);
                const { result } = res;
                onClick(openNotesTab.id, openNotesTab.color);
                setTabData([openNotesTab, ...result]);
            }
        });
    }, []);

    return (
        <div>
            <Tabs defaultActiveKey={activeId} onChange={onClick}>
                {tabData.map((item,index) => {
                    return (
                        <TabPane key={item.id}
                            tab={
                                <span>
                                    {index>0?'':<BookOutlined />}
                                    {item.name}
                                </span>
                            }>
                        </TabPane>
                    )
                })}
            </Tabs>
            <div>
                {props.children}
            </div>

        </div>
    );
}
export default TopTabs;