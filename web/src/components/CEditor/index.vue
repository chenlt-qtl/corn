<template>
    <div>
        <div style="margin-bottom: 5px;height: 40px;">
            <div v-show="showButton" style="float: left;">
                <el-button size="small" type="primary" @click="updateData">保存</el-button>
                <el-button size="small" type="text" @click="$emit('cancelEdit')">取消</el-button>
            </div>
            <div style="overflow: auto;text-align: right;">
                <el-radio-group v-model="editorType">
                    <el-radio v-for="(value,key) in editorTypeEnum" :label="value" :key="value">{{key}}
                    </el-radio>
                </el-radio-group>
            </div>
        </div>
        <div style="min-height: 300px">
            <!-- <q-editor ref="editor0" v-show="editorType===0" v-model="editorData"></q-editor> -->
            <mavon-editor :ref="'editor'+editorTypeEnum['Mavon']" v-show="editorType===editorTypeEnum['Mavon']"
                v-model="editorData"></mavon-editor>
            <!-- <w-editor :ref="'editor'+editorTypeEnum['Wang']" v-show="editorType===editorTypeEnum['Wang']" v-model="editorData"></w-editor> -->
            <j-editor :ref="'editor'+editorTypeEnum['TinyMCE']" v-show="editorType===editorTypeEnum['TinyMCE']"
                v-model="editorData"></j-editor>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import { Radio, RadioGroup, Button } from 'element-ui';
    import 'element-ui/lib/theme-chalk/index.css';
    import QEditor from '@/components/CEditor/QEditor'
    import MavonEditor from '@/components/CEditor/MavonEditor'
    import WEditor from '@/components/CEditor/WEditor'
    import JEditor from "@/components/jeecg/JEditor";

    Vue.component(Radio.name, Radio);
    Vue.component(RadioGroup.name, RadioGroup);
    Vue.component(Button.name, Button);

    export default {
        name: "CEditor",
        components: {
            QEditor,
            MavonEditor,
            WEditor,
            JEditor,
        },
        data() {
            return {
                editorType: 2,
                editorTypeEnum: { Mavon: 0, TinyMCE: 2 },
                editorData: this.value || "",
            };
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
        watch: {
            value: function () {
                this.editorData = this.value;
            },
            editorType: function (newValue, oldValue) {
                const value = this.$refs[`editor${oldValue}`].getValue();
                this.editorData = value;
            }
        },
        methods: {
            getValue: function () {
                const value = this.$refs[`editor${this.editorType}`].getValue();
                return value;
            },
            updateData: function () {
                this.$emit('update', this.getValue());
            },
        }

    }
</script>

<style>

</style>