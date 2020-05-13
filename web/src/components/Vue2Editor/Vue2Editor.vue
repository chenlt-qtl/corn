<template>
  <vue-editor useCustomImageHandler @imageAdded="handleImageAdded" v-model="content" @blur="$emit('blur')"/>
</template>

<script>
  import Vue from 'vue'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import { axios } from '@/utils/request'
  import Vue2Editor, { VueEditor } from 'vue2-editor'

  Vue.use(Vue2Editor)

  export default {
    name: 'Vue2Editor',
    components: {
      VueEditor
    },
    data: function() {
      return {
        content: this.value
      }
    },
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    watch: {
      content: function() {
        this.$emit('input', this.content)
      },
      value: function() {
        this.content = this.value
      }
    },
    methods: {
      handleImageAdded(file, Editor, cursorLocation, resetUploader) {
        console.log(111)
        var formData = new FormData()
        formData.append('file', file)

        axios({
          url: window._CONFIG['domianURL'] + '/sys/common/upload',
          method: 'POST',
          data: formData,
          headers: { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) }
        })
          .then(result => {
            console.log(result)
            Editor.insertEmbed(cursorLocation, 'image', window._CONFIG['domianURL'] + '/' + result.message)
            resetUploader()
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }
</script>

<style>
  .ql-snow .ql-toolbar button svg, .quillWrapper .ql-snow.ql-toolbar button svg{
    width: 16px;
    height: 16px;
  }
</style>