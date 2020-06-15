<template>
    <div>
        <div v-if="editComment||!showButton">
            <q-editor ref="editor" v-model="comment" style="padding-bottom: 5px;"></q-editor>
            <div v-show="showButton">
                <el-button size="small" type="primary" @click="updateData">保存</el-button>
                <el-button size="small" type="text" @click="editComment=false">取消</el-button>
            </div>
        </div>
        <div v-else>
            <div class="comment_div" @click="editComment=true" v-show="value.length>7" v-html="value">
            </div>
            <div class="comment_div" style="color: #C0C4CC;" @click="editComment=true" v-show="value.length<=7">
                添加描述...
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import { httpAction } from '@/api/manage';
    import JEditor from "@/components/jeecg/JEditor";
    import QEditor from "@/components/QEditor";
    import { Loading } from 'element-ui';
    import 'element-ui/lib/theme-chalk/index.css';

    export default {
        name: 'TaskEditor',
        components: {
            JEditor,
            QEditor,
        },
        computed: {

        },
        methods: {
            updateData: function () {
                this.$emit('update', this.comment, () => {
                    this.editComment = false
                });
            },
            getValue() {
                return this.comment;
            }
        },
        props: {
            value: {
                type: String,
                default: ""
            },
            showButton: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                comment: this.value,
                editComment: false,
                toolbar: 'bold italic underline strikethrough | forecolor backcolor',
            }
        },
        watch: {
            value: function () {
                console.log(this.value);

                this.comment = this.value;
            }
        }
    }
</script>
<style scoped>
    .comment_div {
        padding: 30px 10px 10px 10px;
        overflow: auto;
    }
</style>