<template functional>
  <div class="tab-content">
    <a-tabs defaultActiveKey="1" tabPosition="left" style="height: 100%">
      <a-tab-pane tab="Tab 1" key="1"></a-tab-pane>
      <a-tab-pane tab="Tab 2" key="2"></a-tab-pane>
      <a-tab-pane tab="Tab 3" key="3"></a-tab-pane>
      <a-tab-pane tab="Tab 4" key="4"></a-tab-pane>
      <a-tab-pane tab="Tab 5" key="5"></a-tab-pane>
      <a-tab-pane tab="Tab 6" key="6"></a-tab-pane>
      <a-tab-pane tab="Tab 7" key="7"></a-tab-pane>
      <a-tab-pane tab="Tab 8" key="8"></a-tab-pane>
      <a-tab-pane tab="Tab 9" key="9"></a-tab-pane>
      <a-tab-pane tab="Tab 10" key="10"></a-tab-pane>
      <a-tab-pane tab="Tab 11" key="11"></a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
  export default {
    name: "SelectTab",

  };
</script>

<style>
  .ant-tabs .ant-tabs-left-bar .ant-tabs-tab{
    background-color: #fff;
    color: #595959;
    padding: 10px 24px;
    margin: 0;
  }
  .ant-tabs .ant-tabs-left-bar .ant-tabs-tab-active{
    background-color: #1890ff;
    color: #fff;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .ant-tabs-ink-bar ant-tabs-ink-bar-animated{
    height:41px;
  }
  .tab-content{
    border-top-right-radius: 20px;
  }
</style>
