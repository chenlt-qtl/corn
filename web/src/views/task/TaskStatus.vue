<template>
  <div>
      <el-dropdown v-if="showDrop" @command="setStatus">
        <el-button>{{getStatus(data.status)}}</el-button>
        <el-dropdown-menu slot="dropdown" divided>
          <el-dropdown-item v-for="item in nextStatusOptions" :key="item.id" :command="[item.id,data]" >{{item.label}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div v-else>{{getStatus(data.status)}}</div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { Loading, Dropdown, DropdownMenu, DropdownItem } from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  import statusData from "./statusData";


  Vue.component(Dropdown.name, Dropdown);
  Vue.component(DropdownMenu.name, DropdownMenu);
  Vue.component(DropdownItem.name, DropdownItem);
  Vue.use(Loading.directive);



  export default {
    name:'TaskStatus',
    filters: {
      statusFilter(status) {
        return statusData.statusFilter(status);
      },
    },
    props:{
      data:{
        type:Object
      },
      typeOptions:{
        type:Array
      }

    },
    computed:{
      nextStatusOptions:function() {
        return this.getStatusOption();
      },
    },
    created:function() {
      this.getStatusOption();
    },
    methods: {
      getStatus(status){
        return statusData.getStatus(status);
      },
      setStatus(data){
        this.$emit("changeStatus",data);
      },
      getStatusOption(){
        const status = this.data.status;
        const type = this.data.type;
        let hasCancel = false;//是否有取消
        let result = [];
        this.typeOptions.forEach((typeObj) => {
          if (typeObj.id == type) {
            const statusIdArr = (typeObj.statusStr||'').split(",");
            statusIdArr.forEach((statusId)=> {
              if (statusId == String(statusData.cancel.id)) {
                hasCancel = true;
              } else {
                statusData.statusData.forEach((a,index) => {
                  if(!result[index]){
                    result[index]=[];
                  }
                  a.children.forEach((b) => {
                    if (statusId == String(b.id) && statusId != String(status)) {
                      result[index].push(b);
                    }
                  });
                });
              }
            });
          }
        });


        let nowPhase = 0;
        let nextPhase = -1;
        if(status && status<10){
          nowPhase = 0;
        }else if(10 <= status && status<20){
          nowPhase = 1;
        }else if(20 <=status&&status<30){
          nowPhase = 2;
        }else if(status>=30){
          nowPhase = 3;
        }

        let options = result[nowPhase];

        for(let i = (nowPhase+1);i<result.length;i++){
          if(result[i].length>0){
            nextPhase = i;
            break;
          }
        }
        if(nextPhase != -1){
          options = options.concat(result[nextPhase]);
        }
        if(hasCancel&&nowPhase<3){
          options.push(statusData.cancel);
        }

        if(options.length>0){
          this.showDrop = true;
        }else{
          this.showDrop = false;
        }
        return options;
      },
    },
    data() {
      return {
        showDrop:false,
        statusOptions:statusData.statusOptions,
        statusKeyVal:statusData.statusKeyVal,
      }
    },
  }
</script>
