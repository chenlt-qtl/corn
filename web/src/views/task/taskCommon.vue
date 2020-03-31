<template>
  <div></div>
</template>
<script type="text/javascript">

const cancel = {
  id : 1,
  label: '取消',
};
const statusData = [{
  label: '未开始',
  disabled : true,
  children: [{
    id: 0,
    label: '未开始',
  }, cancel],
}, {
  label: '开发',
  disabled : true,
  children: [{
    id : 10,
    label: '进行中',
  }, {
    id: 11,
    label: '单元测试',
  }, {
    id : 12,
    label: '合并代码',
  }]
}, {
  label: '测试',
  disabled: true,
  children: [{
    id: 23,
    label: '测试中',
  }, {
    id: 21,
    label: 'QA测试',
  }, {
    id: 22,
    label: '线上测试',
  }]
}, {
  label: '完成',
  disabled: true,
  children: [{
    id : 99,
    label: '完成',
  }]
}]
const statusOptions = [];
const statusKeyVal = [];
statusData.forEach((group)=>{
  let status = [];
  group.children.forEach((option)=>{
    statusKeyVal.push({code:option.id,text:option.label});
    status.push(option.id);
  });
  statusOptions.push({code:status.toString(),text:group.label});
});

export default{
  statusOptions,
  cancel,
  statusData,
  statusKeyVal,
  statusFilter:function(status) {
    status = status||0;
    if(status<10) {
      return 'info';
    }else if(status>=10 && status<20) {
      return 'warning';
    }else if(status>=20 && status<30) {
      return 'primary';
    }else{
      return 'success';
    }
  },
  tableRowClassName({row}) {
    let result = '';
    if (row.status >= 10 && row.status<20) {//开发中
      result = 'dev-row';
    } else if (row.status >= 20 && row.status<30) {//测试中
      result = 'test-row';
    } else if (row.status == 99 ){
      result = 'finish-row';
    }
    return result;
  },
  getStatus(status){
    let code = status||0;
    let text = "";
    this.statusKeyVal.forEach((item)=>{
      if(item.code.toString() == code.toString()){
        text = item.text;
      }
    });
    return text;
  },
  getColorByType(type,option){
    let color = "#fff";
    if(type||type===0) {
      option.forEach((option) => {
        if (option.id == type) {
          color = option.color;
        }
      });
    }
    return color;
  },
  getTextByType(type,option){
    let name = "";
    if(type||type===0) {
      option.forEach((option) => {
        if (option.id == type) {
          name = option.name;
        }
      });
    }
    return name;
  }
}

</script>