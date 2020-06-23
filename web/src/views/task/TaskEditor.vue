<template>
    <div>
        <div v-if="editComment">
            <c-editor ref="editor" v-model="comment" :showButton="showButton" @update="updateData"
                @cancelEdit="editComment=false"></c-editor>
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
    import CEditor from "@/components/CEditor";
    import 'element-ui/lib/theme-chalk/index.css';

    export default {
        name: 'TaskEditor',
        components: {
            CEditor,
        },
        computed: {

        },
        methods: {
            updateData: function () {
                this.$emit('update', this.getValue(), () => {
                    this.editComment = false
                });
            },
            getValue() {
                if (this.$refs["editor"]) {
                    return this.$refs["editor"].getValue();
                } else {
                    return this.value;
                }
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
                editComment: !this.showButton,
            }
        },
        watch: {
            value: function () {
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