<template>
  <div style="min-height: 300px">
    <quill-editor ref="quill" v-model="editorData" :options="editorOption" @blur="handlerBlur($event)">
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
    mounted:function(){
      const that = this;
      this.$refs.quill.quill.on('text-change', function(delta, oldDelta, source) {
        if(source == "user"){
          that.isChange = true;
        }else {
          that.isChange = false;
        }
      })

      this.$refs.quill.quill.on('selection-change', function(range, oldRange, source) {
          if (!range) {
            console.log('selection change',range, oldRange, source);
          }
        })
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
        isChange:false,
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
      handlerBlur:function(e) {
        console.log('blur');
        if(this.isChange){
          //this.$emit('blur');
          this.isChange = false;
        }
      },
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