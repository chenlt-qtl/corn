<template>
  <div>
    <a-tabs
      hideAdd
      v-model="activeTabKey"
      type="editable-card"
      @edit="onEdit"
      @change="onChange"
    >
      <a-tab-pane v-for="pane in panes" :tab="pane.name" :key="pane.id" :closable="pane.closable"></a-tab-pane>
      <a-icon type="close-circle" slot="tabBarExtraContent" style="cursor: pointer" @click="closeAll" title="关闭所有"/>
    </a-tabs>
  </div>
</template>

<script>

  export default {
    name:'MainTab',
    props: {
      topId: {
        type: String,
        required: false
      }
    },
    data() {
      return {
        spinning: false,
        panes:[],
        allPanes:[],
        allActiveTabKeys:[],
        activeTabKey:'',
      }
    },
    created() {
      this.initPanes();
    },
    methods:{
      initPanes(){
        if(!this.allPanes[this.topId]){
          this.allPanes[this.topId] = [];
        }
        this.panes = this.allPanes[this.topId];
        this.activeTabKey = this.allActiveTabKeys[this.topId];
        this.$emit('onChangeTab', this.activeTabKey);
      },
      onChange(key){
        this.$emit('onChangeTab', key);
      },
      activeTab(note){
        let contain = false;
        for(let i=0 ; i<this.panes.length; i++){
          if(this.panes[i].id == note.id){
            contain = true;
            break;
          }
        }
        if(!contain){
          this.panes.push(note);
        }
        this.activeTabKey = note.id;
      },
      onEdit (targetKey, action) {
        this[action](targetKey)
      },
      remove (targetKey) {//关闭tab
        const panes = this.panes.filter(pane => pane.id !== targetKey)
        this.panes = panes;

        if(targetKey === this.activeTabKey ){

          if(this.panes.length>0){
            this.activeTabKey = this.panes[0].id;
          }else{
            this.activeTabKey = '';
          }
          this.$emit('onChangeTab', this.activeTabKey);
        }
      },
      //关闭所有tab
      closeAll() {
        this.panes = [];
        this.activeTabKey = '';
      },
    },
    watch: {
      activeTabKey(newKey){
        this.allActiveTabKeys[this.topId] = newKey;
      },
      topId(){
        this.initPanes();
      },
      panes(newData){
        this.allPanes[this.topId] = newData;
      }
    }
  }

</script>

<style>
</style>
