<template>
  <div class="wangeditor">
    <div ref="editorElem" style="text-align:left;"></div>
  </div>
</template>

<script>

  import E from 'wangeditor'


  export default {
    name: 'WEditor',
    data() {
      return {
        editor: null,
        isChange:false,
      };
    },
    props: {
      value:{
        type:String,
        default:''
      }
    }, // 接收父组件的方法
    mounted() {
      const that = this;
      this.editor = new E(this.$refs.editorElem);
      this.editor.customConfig.uploadImgShowBase64 = true;
      this.editor.customConfig.onchange = () => {
        console.log('change')
        that.isChange = true;
      };

      this.editor.customConfig.onblur = function () {
        if(that.isChange) {
          that.$emit("blur",that.editor.txt.html());
          that.isChange = false;
        }
      }

      this.editor.customConfig.menus = [
        // 菜单配置
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        'code', // 插入代码
        'undo', // 撤销
        'redo' // 重复
      ];
      this.editor.create(); // 创建富文本实例
      this.editor.txt.html(this.value);
    },
    watch:{
      value:function() {
        this.editor.txt.html(this.value);
        this.isChange = false;
      },
    }
  }
</script>

<style>
  .wangeditor{
    font-size: 12px;
  }
  .subcontainer {
    height: 100%;
    width: 100%;

  .tabs {
    padding: 20px 0;
  }

  }

  .editor {
    width: 100%;
    height: 300px;
    margin-bottom: 40px;
  }

  .a-btn {
    padding-bottom: 80px;
  }

  .a-btn a {
    display: block;
    color: #fff;
    font-size: 16px;
    line-height: 30px;
    width: 100px;
    text-align: center;
    float: right;
    background: dodgerblue;
  }

  .w-e-toolbar{
    flex-wrap:wrap;
  }
</style>