<template>
<!--
    <ckeditor :editor="editor" v-model="editorData" :config="editorConfig" style="height: 200px;" @blur="$emit('blur')"></ckeditor>
-->
  <mavon-editor ref="editor" v-model="editorData" @imgAdd="imgAdd" @save="$emit('blur')"></mavon-editor>
</template>

<script>
  import Vue from 'vue';
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import {mavonEditor} from "mavon-editor";
  import "mavon-editor/dist/css/index.css";
  import { axios } from '@/utils/request'

  export default {
    components:{mavonEditor},
    data() {
      return {
        editorData:this.value
      };
    },
    props:{
      value:{
        type:String,
        default:""
      }
    },
    watch:{
      editorData:function() {
        this.$emit("input",this.editorData);
      },
      value:function() {
        this.editorData = this.value;
      }
    },
    methods:{
      imgAdd(pos, $file){
        console.log($file);
        var formdata = new FormData();
        formdata.append('file', $file);
        axios({
          url: window._CONFIG['domianURL']+"/sys/common/upload",
          method: 'post',
          data: formdata,
          headers: { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) },
        }).then((result) => {
          this.$refs.editor.$img2Url(pos, window._CONFIG['domianURL']+"/"+result.message);
        })
      }
    }

  }
</script>

<style>
  .ck.ck-icon{
    height: 16px;
    width: 16px;
  }

  .ck.ck-button .ck-button__label, a.ck.ck-button .ck-button__label{
    font-size: 12px;
  }

  .ck.ck-button, a.ck.ck-button{
    min-height: 22px;
    min-width: 26px;
  }

  [dir=ltr] .ck.ck-dropdown .ck-dropdown__arrow{
    margin-left: 5px;
  }

  .ck.ck-icon, .ck.ck-icon *{
    color: #6C6565;
  }
</style>