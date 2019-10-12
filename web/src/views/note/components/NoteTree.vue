<template>
  <div>
    <a-dropdown>
      <a-menu slot="overlay" @click="handleAddButton">
        <a-menu-item key="1"><a-icon type="book" />新建分区</a-menu-item>
        <a-menu-item key="2"><a-icon type="file-add" />新建文档</a-menu-item>
      </a-menu>
      <a-button icon="plus">
        新建 <a-icon type="down" />
      </a-button>
    </a-dropdown>
    <a-spin :spinning="spinning">
      <a-dropdown :trigger="[this.dropTrigger]" @visibleChange="dropStatus">
                 <span style="user-select: none">
                     <a-directory-tree
                       showIcon
                       :selectedKeys="selectedKeys"
                       @rightClick="rightHandle"
                       @select="onTreeClick"
                       @drop="onDrop"
                       :treeData="noteTree"
                       class="note-left-tree"
                       :expandedKeys="expandedKeys"
                       draggable
                       :filterTreeNode="filterTreeNode"
                     />
                  </span>
        <!--新增右键点击事件,和增加添加和删除功能-->
        <a-menu slot="overlay" style="padding: 10px 20px;">
          <a-menu-item @click="handlePaste" key="3" v-if="this.copyKey"><a-icon type="file" />粘贴</a-menu-item>
          <a-menu-item @click="handleAddByParent" key="4"><a-icon type="plus" />新文档</a-menu-item>
          <a-menu-item @click="handleCopy" key="1"><a-icon type="copy" />复制</a-menu-item>
          <a-menu-item @click="handleDelete" key="2"><a-icon type="minus" />删除</a-menu-item>
        </a-menu>
      </a-dropdown>
    </a-spin>
  </div>
</template>

<script>
  import { httpAction} from '@/api/manage'
  import { deleteNote, queryNoteTree, queryNoteById} from '@/api/api'

  export default {
    name:'NoteTree',
    props: {
      topId: {
        type: String,
        required: false
      },
      searchText: {
        type: String,
        required: false
      },
    },
    data() {
      return {
        spinning: false,
        dropTrigger: '',
        rightClickSelectedKey: '',
        selectedKeys:[],
        noteTree: [],
        expandedKeys:[],//打开的树节点
        noteData:[],//保存所有note信息
        copyKey:'',
        url: {
          copy: "/note/copy",
          edit: '/note/edit',
        }
      }
    },
    created() {
    },
    methods:{
      handleAddButton(e){
        if (!this.topId) {
          this.$message.warning('请先选中一个笔记本!')
          return false;
        }
        let isTop = false;
        let parentKey;
        if(e.key == 1){//增加分区
          isTop = true;
          parentKey = this.topId;
        }else{
          let key = this.selectedKeys[0];
          if (!key) {//顶级节点
            this.$message.warning('请选择分区!')
            return;
          }
          parentKey = key;
        }

        this.handleAdd(parentKey,isTop);
      },
      handleAdd(parentKey,isTop) {
        let newObj = {};
        newObj["name"] = newObj["title"] = "无标题文档";
        newObj["text"] = " ";
        newObj["id"] = newObj["key"] = this.uuid();
        newObj['parentId'] = parentKey;

        if (isTop) {//顶级节点
          this.noteTree.push(newObj);
          newObj["name"] = newObj["title"] = "新分区";
        } else {
          let parent = this.getTreeNode(this.noteTree,parentKey);
          if(parent){
            if(parent.model.parentIds.split("/").length>=7){
              this.$message.warning('笔记本目录最多只能6层!');
              return;
            }
            if(!parent.children){
              parent.children = [];
            }
            parent.isLeaf=false;
            parent.children.push(newObj);
            newObj['parentIds'] = parent.model.parentIds+"/"+parentKey;
          }else {
            this.noteTree.push(newObj);
          }
        }
        newObj["model"]=Object.assign({}, newObj);
        this.noteData[newObj["id"]] = newObj["model"];
        this.loadNote(newObj["id"],true);
      },
      loadTree(callback) {//加载笔记本树
        if (this.topId) {
          this.spinning = true;
          let that = this
          queryNoteTree({ 'parentId': this.topId,"text":that.searchText }).then((res) => {
            if (res.success) {
              that.noteTree = [];
              for (let i = 0; i < res.result.length; i++) {
                that.noteTree.push(res.result[i])
              }
              if(callback){
                callback();
              }
            }
            this.spinning = false
          })
        }
      },
      handleAddByParent(){
        let parentKey = this.rightClickSelectedKey;
        this.handleAdd(parentKey,false);
      },
      //右键事件
      rightHandle(node) {
        this.dropTrigger = 'contextmenu'
        this.rightClickSelectedKey = node.node.eventKey
      },
      dropStatus(visible) {
        if (visible == false) {
          this.dropTrigger = ''
        }
      },
      onTreeClick(key) {
        let id = key[0];
        if (!id) {
          this.loadNote();
        } else {
          if (!this.noteData[id]) {
            this.$emit('spinning', true);
            queryNoteById({ 'id': id }).then((res) => {
              if (res.success) {
                this.noteData[id] = res.result;
                this.loadNote(id);
              }
              this.$emit('spinning', false);
            })
          } else {
            this.loadNote(id);
          }
        }
      },
      updateNote(note){
        let oldNote = this.getTreeNode(this.noteTree,note.key);
        oldNote = note;
        this.noteData[oldNote.key] = oldNote.model;
      },
      loadNote(id,focus){
        if(id) {
          let expandedKeys = [];
          if (this.noteData[id].parentIds) {
            expandedKeys = this.noteData[id].parentIds.split("/");
          }
          if (this.expandedKeys[this.expandedKeys.length - 1] != id) {
            expandedKeys.push(id);
          }
          this.expandedKeys = expandedKeys;
          this.selectedKeys[0] = id;
          this.$emit('onTreeClick', this.noteData[id], focus);
        }else{
          this.selectedKeys = [];
          this.$emit('onTreeClick', {});
        }
      },
      getSelected(){
        return this.getTreeNode(this.noteTree,this.selectedKeys[0]);
      },
      getTreeNode(notes,id){
        let result;
        for(let key in notes) {
          let node = notes[key];
          if (node.key === id) {
            result = node;
            break;
          }else {
            if(node.children){
              result = this.getTreeNode(node.children,id);
              if(result){
                break;
              }
            }
          }
        }
        return result;
      },
      //拖动
      onDrop (info) {
        const newParent = this.getTreeNode(this.noteTree,info.node.eventKey);
        const dragKey = info.dragNode.eventKey
        if (!info.dropToGap) {
          if (!newParent.children) {
            newParent.children = [];
          }
          let drapNote = this.getTreeNode(this.noteTree, dragKey);
          newParent.children.push(drapNote);
          drapNote.model.parentId = info.node.eventKey;//更换父ID

          //删除旧的
          const oldParent = this.getTreeNode(this.noteTree, info.dragNode.$parent.eventKey);
          oldParent.children = oldParent.children.filter(node => node.key !== dragKey);
          httpAction(this.url.edit, drapNote.model, 'put');
        }
      },
      handleCopy(){
        this.copyKey = this.rightClickSelectedKey;
      },
      handlePaste(){//粘贴笔记
        let that = this;
        if(this.copyKey){
          this.$emit('spinning',true);
          httpAction(this.url.copy, {parentId: this.rightClickSelectedKey,id:this.copyKey }, 'post').then((res) => {
            if (res.success) {
              that.$message.success('复制成功!')
              that.loadTree(function (){
                let note = res.result;
                that.noteData[note.id] = note;
                that.onTreeClick([note.id]);
              });
              that.copyKey = '';
            }
            that.$emit('spinning',false);
          })
        }
      },
      handleDelete() {
        deleteNote({ id: this.rightClickSelectedKey }).then((resp) => {
          if (resp.success) {
            this.$message.success('删除成功!')
            this.loadTree();
            this.$emit('removeNode',this.rightClickSelectedKey);
          } else {
            this.$message.warning('删除失败!')
          }
        })
      },
      filterTreeNode(node){
        if (this.searchText && node.title.indexOf(this.searchText)>-1) {
          return true;
        }else {
          return false;
        }
      },
      searchByName(notes,result,name){
        for(let i in notes) {
          let node = notes[i];
          let title = node['title'];
          if (name && title.indexOf(name)>-1) {
            result.push(node);
          }
          if(node.children){
            this.searchByName(node.children,result,name);
          }
        }
      },
      uuid() {//生成uuid
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 32; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[12] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[16] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        var uuid = s.join("");
        return uuid;
      },
    },
    watch: {
      topId(){
        this.loadTree();
      },
      searchText(){
        const expandedNotes = [];
        this.searchByName(this.noteTree,expandedNotes,this.searchText);
        let expandedKeys = [];
        expandedNotes.forEach((node)=> {
          const parentIds = node.model.parentIds;
          expandedKeys = expandedKeys.concat(parentIds.split("/"));
        });
        Object.assign(this, {
          expandedKeys,
        })
      }
    }
  }

</script>

<style>
  .note-left-tree{
    width: 320px;
    max-height: 600px;
    min-height: 437px;
    overflow-x: hidden;
    overflow-y: auto;
    border:1px solid #d9d9d9;
    margin-top: 5px;
  }
</style>
