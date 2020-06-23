<template>
  <mavon-editor ref="editor" v-model="editorData" @save="$emit('blur')" @blur="$emit('blur')"></mavon-editor>
</template>

<script>
  import {mavonEditor} from "mavon-editor";
  import "mavon-editor/dist/css/index.css";

  export default {
    name:"MavonEditor",
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
      value:function() {
        this.editorData = this.value;
      }
    },
    methods:{
      getValue:function(){
        return this.editorData;
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