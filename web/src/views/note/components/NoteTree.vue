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
                       :expandedKeys="expandedKeys"
                       @expand="onExpand"
                       @rightClick="rightHandle"
                       @select="onTreeClick"
                       @drop="onDrop"
                       :treeData="noteTree"
                       class="note-left-tree"
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
          <a-menu-item @click="handleOpen" key="5"><a-icon type="folder-open" />展开</a-menu-item>
        </a-menu>
      </a-dropdown>
    </a-spin>
  </div>
</template>

<script>
  import { httpAction} from '@/api/manage'
  import { deleteNote, queryNoteTree} from '@/api/api'

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
        copyKey:'',
        url: {
          copy: "/note/copy",
          edit: '/note/edit',
          updateParent: '/note/updateParent',
        }
      }
    },
    created() {
    },
    methods:{
      handleOpen(){
        const note = this.getTreeNode(this.noteTree,this.rightClickSelectedKey);
        let ids = note.parentIds.split("/");
        getChildIds(ids,note);
        function getChildIds(ids,note) {
          ids.push(note.key);
          (note.children||[]).forEach((child)=>{
            getChildIds(ids,child);
          });
        }
        this.expandedKeys = ids;
      },
      onExpand(e){
        this.expandedKeys = e;
      },
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
        newObj["title"] = newObj["name"] = "无标题文档";
        newObj["text"] = " ";
        newObj["key"] = newObj["id"] = this.uuid();
        newObj['parentId'] = parentKey;
        newObj["isLeaf"] = true;

        if (isTop) {//顶级节点
          this.noteTree.push(newObj);
          newObj["title"] = newObj["name"]= "新分区";
        } else {
          let parent = this.getTreeNode(this.noteTree,parentKey);
          if(parent){
            if(!parent.children){
              parent.children = [];
            }
            parent.isLeaf=false;
            parent.children.push(newObj);
            newObj['parentIds'] = parent.parentIds+"/"+parentKey;
          }else {
            this.noteTree.push(newObj);
          }
        }
        this.$emit('addNote', newObj);
        this.selectNote(newObj["key"]);
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
              if(this.selectedKeys[0]){
                this.selectNote(this.selectedKeys[0]);
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
        this.$emit('loadNote', id, false);
        this.selectNote(id);
      },
      selectNote(id){
        if(id) {
          const note = this.getTreeNode(this.noteTree, id);
          if(note) {
            let expandedKeys = [];
            if (note.parentIds) {
              expandedKeys = note.parentIds.split("/");
            }
            expandedKeys.push(id);
            this.expandedKeys = expandedKeys;
          }
        }
        this.selectedKeys = [id];
      },
      updateNote(note){
        let noteTree = this.noteTree;
        this.updateTreeNode(note.id,note.name,noteTree);
        this.noteTree = noteTree;
      },
      getSelected(){
        return this.selectedKeys[0];
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
      updateTreeNode(id,title,notes,found){
        if(!found) {
          for (let i = 0; i < notes.length; i++) {
            let node = notes[i];
            if (node.key == id) {
              node.title = title;
              found = true;
              break;
            } else {
              if (node.children) {
                this.updateTreeNode(id, title, node.children,found);
                if(found){
                  break;
                }
              }
            }
          }
        }
      },
      //拖动
      onDrop (info) {
        const newParent = this.getTreeNode(this.noteTree,info.node.eventKey);
        const dragKey = info.dragNode.eventKey;
        if (!info.dropToGap) {
          const oldParent = this.getTreeNode(this.noteTree, info.dragNode.$parent.eventKey);
          if (oldParent.key != newParent.key) {
            if (!newParent.children) {
              newParent.children = [];
            }

            let drapNote = this.getTreeNode(this.noteTree, dragKey);
            newParent.children.push(drapNote);
            drapNote.parentId = info.node.eventKey;//更换父ID
            drapNote.parentIds = newParent.parentIds + "/" + drapNote.parentId;

            //删除旧的
            oldParent.children = oldParent.children.filter(node => node.key !== dragKey);

            this.$emit('spinning',true);
            let that = this;
            httpAction(this.url.updateParent, { id: drapNote.key, parentId: drapNote.parentId }, 'put').then((res) => {
              if (res.success) {
                that.$message.success('保存成功!')
              }else {
                that.$message.error(res.message);
              }
              that.loadTree();
              that.$emit('spinning',false);
            });
          }
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
                that.$emit('addNote', note);
                that.selectNote(note.id);
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
          const parentIds = node.parentIds;
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
