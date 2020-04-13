<template>
  <div></div>
</template>
<script type="text/javascript">

const statusData = {
  1:{title:"进行中"},
  5:{title:"未开始"},
  9:{title:"已完成"},
  0:{title:"已删除"}
};

export default{
  statusData,
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
  }
}

</script>