<template>
  <div style="min-height: 300px">
    <quill-editor ref="quill" v-model="editorData" :options="editorOption">
    </quill-editor>
  </div>
</template>

<script>
  import Vue from 'vue';
  import 'quill/dist/quill.snow.css'
  import { quillEditor } from 'vue-quill-editor'

  export default {
    components:{
      quillEditor
    },
    data() {
      return {
        editorData:this.value,
        editorOption:{
          placeholder: '请输入内容...',
          modules: {
            toolbar:[
              ['bold', 'italic', 'underline', 'strike'], //加粗，斜体，下划线，删除线
              ['blockquote', 'code-block'],  //引用，代码块
              [{ 'color': [] }, { 'background': [] }],  // 字体颜色，字体背景颜色
              [{ 'font': [] }],  //字体
              [{ 'align': [] }], //对齐方式
              ['clean'], //清除字体样式
              ['image'] //上传图片、上传视频
            ]
          },
          quillUpdateImg:true,
        },
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
      },
      editorData:function(){
        //this.$emit("input",this.editorData);
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

  .ql-container.ql-snow{
    min-height: 300px;
  }

  .ql-snow.ql-toolbar button, .ql-snow .ql-toolbar button{
    height: 20px;
    width: 22px;
    padding:2px 5px;
  }

  .ql-snow .ql-picker{
    font-size: 12px;
  }

  .ql-toolbar.ql-snow {
    padding: 4px;
  }

  .ql-toolbar.ql-snow .ql-formats{
    margin-right: 10px;
  }
</style>