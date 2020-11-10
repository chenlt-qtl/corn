import React, { useState, useEffect } from 'react';
import { Tree, Input, Card, Layout } from 'antd';
import { NoteItem } from './data'
import { getList } from './service'
import styles from './index.less'
import { Editor } from '@tinymce/tinymce-react';

const { Search } = Input;
const { Sider, Content } = Layout;

const x = 3;
const y = 2;
const z = 1;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

const dataList: object[] = [];
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key } = node;
    dataList.push({ key, title: key });
    if (node.children) {
      generateList(node.children);
    }
  }
};
generateList(gData);

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

const note = `<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;"><span style="background-color: #ebf1dd;">------线上测试---------------------------------------------------------------------------</span></div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;"><span style="background-color: #daeef4;">-----95测试------------------------------------------------------------------------------</span></div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;"><span style="background-color: #feead9;">-----未合并-------------------------------------------------------------------------------</span></div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">用户显示api key</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;"><span style="background-color: #feead9;">--------------------------------------------------------------------------------------------</span></div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;"><span style="background-color: #fad4d3;">report detail进入页面很慢的问题 </span></div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;"><span style="background-color: #fae220;">报销</span></div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">-------------------------------------------------------------------------------------</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">报表明细页面没有把时间传到api去过滤target</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">已删除的transport在下拉框中显示出来</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75; padding-left: 40px;">1.高级查询里</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75; padding-left: 40px;">2.billing report里</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">调用api时登录信息过期的处理 ok 合并 95测试（https不能测） 线上测试</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75; padding-left: 40px;">翻页的可以 提交的不可以</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75; padding-left: 40px;">有一个公共的参数是apiId</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">批量修改transport</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;"><span style="background-color: #e67e23;"> 检查是否同一个用户下的</span></div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75; padding-left: 40px;"><span style="background-color: #ffffff;">页面不会弹出任务窗口 ok</span></div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75; padding-left: 40px;"><span style="background-color: #ffffff;">下拉框要改成向上 ok</span></div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75; padding-left: 40px;"><span style="background-color: #ffffff;">任务弹出框由top弹出 ok</span></div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;"><span style="background-color: #ffffff;">&nbsp;</span></div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;"><span style="background-color: #ffffff;">批量删除API</span></div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75; padding-left: 40px;"><span style="background-color: #ffffff;"><span style="background-color: #e67e23;">检查是否同一个用户下的</span> </span></div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">培扬帐号问题</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">--------------------------------------------------------------------------------------</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">发邮件频率放到参数表里</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">研究图表 grafana ing</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">报表按客户查询不可用（可用，登录超时了，要提示一下）</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">去掉(图表的等下个版本再去掉) ok <span style="background-color: #fad4d3;">线上测试下</span></div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">com.cnc.stat.web.cb.back.ReportDetailCallBack</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">com.cnc.stat.web.cb.pre.ReportPreCall</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">com.cnc.stat.web.cb.back.ReportDetailCallBack</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">com.cnc.stat.web.cb.pre.ReportPreCall</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">com.cnc.stat.web.cb.pre.ReportPreCall</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">增加rmp对比菜单</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;">操作 ing</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">对比：(新规则：以IP为基准做对比，多出来的为替换IP)</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 84px; line-height: 1.75;">删除分类显示不正确</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; margin-left: 28px; line-height: 1.75;">增加、删除、更换IP批量操作</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; margin-left: 28px; line-height: 1.75;">server如果是禁用时 不显示在列表中</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; margin-left: 28px; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; white-space: pre-wrap; margin-left: 28px; text-indent: 28px; line-height: 1.75;">操作：</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; margin-left: 28px; line-height: 1.75;">增加单个</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; margin-left: 28px; line-height: 1.75;">批量替换IP</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; margin-left: 28px; line-height: 1.75;">批量删除</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">问题：</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">后退后菜单选中问题</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">new 按钮换行问题</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">报表下载，弹出提示框，需要点击关闭才会关闭</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">impala报错catch起来</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">-----------------------------------------------------------------------------------------------------------------------</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">批量修改加速项信息</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;"><span style="background-color: #fae220;">验证码</span></div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">用户管理</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;"><span style="background-color: #fae220;">web登录帐号对应api两条数据时 提示信息要明确一些</span></div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">---------------------------------------------------------------------------------------------------------------------------</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;"><span style="background-color: #fae220; font-weight: bold;">1.koko部分：</span></div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;"><span style="background-color: #fae220;">1.note展示页面</span></div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;"><span style="background-color: #fae220;">2.图片文件保存时，建日期文件夹</span></div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;">标题里没有输入数据 就不触发change ok</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;">前一个笔记没保存时点新增，内容会被前一个笔记影响 ing</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;">搜索功能</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;">只支持6层目录</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;">tab可以全关闭</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;">新增的时候直接改标题 不会保存（会报ID已存在）</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;"><span style="background-color: #fad4d3;">刚开页面时不会切换到历史打开记录</span></div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;"><span style="background-color: #fad4d3;">最后更新时间显示出来，保存结果也展示出来</span></div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;"><span style="background-color: #fad4d3;">1.看一遍jeecgboot文档 </span><a href="http://jeecg-boot.mydoc.io/"><span style="color: #003884;">http://jeecg-boot.mydoc.io</span></a><span style="color: #393939;"> ok</span></div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;"><span style="background-color: #fad4d3;">2.看一遍vue </span><a href="https://cn.vuejs.org/v2/guide/"><span style="color: #003884;">https://cn.vuejs.org/v2/guide/</span></a></div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;"><span style="background-color: #fad4d3;">3.看一遍Ant Design of Vue </span><a href="https://vue.ant.design/docs/vue/introduce-cn/"><span style="color: #003884;">https://vue.ant.design/docs/vue/introduce-cn/</span></a></div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;"><span style="background-color: #fad4d3;">4.</span><span style="font-family: Arial; color: #444444; background-color: #ffffff;">Mybatis-plus </span><a href="https://mp.baomidou.com/"><span style="color: #003884;">https://mp.baomidou.com/</span></a></div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;"><span style="color: #393939;">5.</span><span style="font-family: Arial; color: #444444; background-color: #ffffff;">ES6 </span><a href="https://blog.csdn.net/itzhongzi/article/details/73330681"><span style="color: #003884;">https://blog.csdn.net/itzhongzi/article/details/73330681</span></a></div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;">6.Vue全家桶 Webpack 、axios、Vue router、Vuex、Vue Loader、Vue cli</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;">7.WebStorm安装与使用 <a href="https://blog.csdn.net/u011781521/article/details/53558979"><span style="color: #003884;">https://blog.csdn.net/u011781521/article/details/53558979</span></a></div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;">&nbsp;</div>
<div style="font-size: 14px; white-space: pre-wrap; text-indent: 28px; line-height: 1.75;">生词本功能</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">1.录入生词</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;">2.生词循环播放</div>
<div style="font-size: 14px; text-indent: 56px; white-space: pre-wrap; line-height: 1.75;"><img src="http://localhost:8080/jeecg-boot/user/20190711/jeecg_1562811525638.png" alt="" /></div>`;

const NoteList: React.FC<{}> = () => {

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>('');


  const onExpand = (expandedKeys: string[]) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = e => {
    const { value } = e.target;
    const expandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, gData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(true);
    setSearchValue(value);
  };

  const render = function () {
    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
              <span>{item.title}</span>
            );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });
    return (
      <Layout className={styles.layout}>
        <Sider>
          <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
          <Tree
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            treeData={loop(gData)}
          />
        </Sider>
        <Content>
          <Card>
            <Input></Input>
            {/* <div className={styles.text} dangerouslySetInnerHTML={{ __html: note }} /> */}
            <div className={styles.text}>
              <Editor
                initialValue={note}
                init={{
                  height: '100vh',
                  plugins: 'table,code,lists,advlist',
                  toolbar: 'code | bold italic h2 h3 blockquote forecolor backcolor | bullist numlist | link image',
                  toolbar_sticky: true,
                  menubar: false,
                  branding: false,
                  // plugins: 'table,quickbars,code,lists,advlist',
                  // toolbar: false,
                  // menubar: false,
                  // inline: true,
                  // quickbars_insert_toolbar: 'quickimage quicktable',
                  // quickbars_selection_toolbar: 'bold italic | code h2 h3 blockquote | bullist numlist | table |bold italic underline strikethrough superscript subscript | formats | removeformat',
                }}
              />
            </div>
          </Card>
        </Content>
      </Layout>
    );
  }
  return render();
};

export default NoteList;
