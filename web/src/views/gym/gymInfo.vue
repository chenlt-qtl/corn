<template>
  <div style="width: 100%;text-align: center;" v-loading="loading">
    <div style="width: 300px;margin: 10px auto;">
      <h2>{{temp.className}}</h2>
      {{timeStr}}
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="temp.comment"
        maxlength="2000"
        show-word-limit>
      </el-input>
      <div style="margin-top: 20px;">
        <el-button type="primary" @click="handleOk">
          保存记录
        </el-button>
        <el-button @click="close">
          取消
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { httpAction } from '@/api/manage'
  import { Button, MessageBox, Loading, Input} from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';

  Vue.component(Button.name, Button);
  Vue.component(MessageBox.name, MessageBox);
  Vue.component(Input.name, Input);
  Vue.use(Loading.directive);
  Vue.prototype.$prompt = MessageBox.prompt;

  export default {
    name: "GymClassDetail",
    data () {
      return {
        loading:false,
        url: {
          add: "/gym/gymInfo/add",
        },
        temp:{},
      }
    },
    computed:{
      timeStr:function() {
        let second = new Number(this.temp.totalTime).toFixed(0);
        if(second>60){
          return (second/60).toFixed(0)+"'"+second/60;
        }else {
          if(second<10){
            return "00'0"+second;
          }else {
            return "00'" + second;
          }
        }
      },
    },
    mounted:function(){
      this.temp = Object.assign({},this.$route.params);
    },
    methods: {
      close () {
        this.$emit('close');
        this.visible = false;
        MessageBox.confirm('确定不保存锻炼记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({path: '/blank/gym'});
        }).catch(() => {});
      },
      handleOk () {
            this.loading = true;
            let that = this;
            console.log(this.temp);
            httpAction(this.url.add,this.temp,'post').then((res)=>{
              if(res.success){
                MessageBox.alert('保存成功','',{
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$router.push({path:'/blank/gymInfoList'});
                  }
                });
              }else{
                MessageBox.alert(res.message);
              }
            }).finally(() => {
              that.loading = false;
            })

      },
    }
  }
</script>

<style scoped>
  .avatar-uploader{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
    height: 178px;
  }
  .avatar-uploader:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>