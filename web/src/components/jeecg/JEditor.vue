<template>
  <div class="tinymce-editor">
    <editor
      v-model="myValue"
      :init="init"
      :disabled="disabled"
      @onClick="onClick">
    </editor>
  </div>
</template>

<script>
  import tinymce from 'tinymce/tinymce'
  import Editor from '@tinymce/tinymce-vue'
  import 'tinymce/themes/silver/theme'
  import 'tinymce/plugins/image'
  import 'tinymce/plugins/media'
  import 'tinymce/plugins/table'
  import 'tinymce/plugins/lists'
  import 'tinymce/plugins/contextmenu'
  import 'tinymce/plugins/wordcount'
  import 'tinymce/plugins/colorpicker'
  import 'tinymce/plugins/textcolor'
  import 'tinymce/plugins/emoticons'
  import 'tinymce/plugins/autoresize'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from '@/store/mutation-types'



  export default {
    name:'JEditor',
    components: {
      Editor
    },
    props: {
      max_height:{
        type:Number,
        default: 600
      },
      value: {
        type: String,
        required:false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      plugins: {
        type: [String, Array],
        default: 'lists image media table textcolor wordcount contextmenu powerpaste autoresize'
      },
      toolbar: {
        type: [String, Array],
        default: 'undo redo |  formatselect | bold italic underline strikethrough |' +
          'fontselect |fontsizeselect | forecolor backcolor| alignleft aligncenter alignright alignjustify| ' +
          'bullist numlist outdent indent | lists image media table| removeformat'
      }
    },
    data() {
      let that = this;
      return {
        //初始化配置
        init: {
          language_url: '/tinymce/langs/zh_CN.js',
          language: 'zh_CN',
          skin_url: '/tinymce/skins/lightgray',
          min_height: this.max_height>350?350:this.max_height,
          max_height:this.max_height,
          plugins: this.plugins,
          toolbar: this.toolbar,
          branding: false,
          menubar: false,
          images_upload_handler: (blobInfo, success) => {
            var xhr, formData;

            xhr = new XMLHttpRequest();

            xhr.withCredentials = false;
            xhr.open('POST', window._CONFIG['domianURL']+"/sys/common/upload");

            const token = Vue.ls.get(ACCESS_TOKEN);
            if (token) {
              xhr.setRequestHeader( 'X-Access-Token', token);
            }

            xhr.onload = function() {
              var json;
              if (xhr.status != 200) {
                return;
              }

              json = JSON.parse(xhr.responseText);
              if (!json || typeof json.message != 'string') {
                return;
              }
              console.log(window._CONFIG['domianURL']+"/"+json.message);

              success(window._CONFIG['domianURL']+"/"+json.message);
            };

            formData = new FormData();
            formData.append('file', blobInfo.blob(), blobInfo.filename());

            xhr.send(formData);
          },
          setup : function(ed) {
            ed.on('blur', that.onBlur);
            ed.on('keydown', function (evt) {
              if (evt.keyCode == 9) {
                if (evt.shiftKey) {
                  ed.execCommand('Outdent');
                } else {
                  ed.execCommand('Indent');
                }

                evt.preventDefault();
                evt.stopPropagation();
              }
            });
          },
        },
        myValue: this.value
      }
    },
    mounted() {
      tinymce.init({})
    },
    methods: {

      onClick(e) {
        this.$emit('onClick', e, tinymce)
      },
      onBlur(e) {
        this.$emit('blur', e, tinymce)
      },
      getValue(){
        return tinymce.activeEditor.getContent();
      },
      setText(value){
        value = value||"";
        console.log("myValue",value);
        this.myValue = value;
        tinymce.activeEditor.setContent(value);
      },
      setFocus(){
        tinymce.activeEditor.focus();
      },
    },
    watch: {
      value(newValue) {
        newValue = newValue||"";
        this.myValue = newValue;
        this.$emit('input', newValue);
      },
    }
  }

</script>
<style>

</style>