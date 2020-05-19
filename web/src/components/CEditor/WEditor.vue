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
      this.editor.customConfig.colors = [
        '#000000',
        '#eeece0',
        '#1c487f',
        '#4d80bf',
        '#c24f4a',
        '#8baa4a',
        '#7b5ba1',
        '#46acc8',
        '#f9963b',
        '#ffffff',
        '#F1C40F',
        '#FBF661',
      ];
      this.editor.customConfig.zIndex = 100;
      this.editor.create(); // 创建富文本实例
      this.editor.txt.html(this.value);
    },
    watch:{
      value:function() {
        this.editor.txt.html(this.value);
        this.isChange = false;
      },
    },
    methods:{
      getValue:function(){
        return this.editor.txt.html();
      }
    }
  }
</script>

<style lang=less>
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