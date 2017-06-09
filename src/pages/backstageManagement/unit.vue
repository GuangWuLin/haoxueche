<template>
    <section v-loading="pageLoading">
        <el-row class="mb20">
            <el-button type="primary" @click="addUnitFormVisible = true" class="right">添加单位</el-button>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="5">
                <el-input placeholder="根据单位名称过滤" class="mb10" v-model="filterText">
                </el-input>
                <el-tree class="filter-tree" :data="unitsOption" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="unitsOption" @node-click="nodeClick" :expand-on-click-node="false" :highlight-current="true" :default-expanded-keys="defaultExpandedKeys">
                </el-tree>
            </el-col>
            <el-col :span="19">
                <el-table :data="units">
                    <el-table-column prop="deptName" label="单位名称">
                    </el-table-column>
                    <el-table-column prop="managerName" label="单位负责人">
                    </el-table-column>
                    <el-table-column prop="managerPhone" label="负责人电话">
                    </el-table-column>
                    <el-table-column prop="teaherCount" label="教练数">
                    </el-table-column>
                    <el-table-column prop="carCount" label="车辆数">
                    </el-table-column>
                    <el-table-column prop="address" label="地址">
                    </el-table-column>
                    <el-table-column prop="remark" label="备注">
                    </el-table-column>
                </el-table>
            </el-col>
            <el-dialog title="新增单位" v-model="addUnitFormVisible" :close-on-click-modal="false" class="unit-dialog" size="tiny" @close="dialogClose" @open="dialogOpen">
                <el-form :model="addUnitForm" label-width="95px" class="mt20" ref="addUnitForm" :rules="customerRules">
                    <el-form-item label="单位名称" prop="deptName" :rules="[{ required: true, message: '请填写单位名称', trigger: 'blur' }]">
                        <el-input auto-complete="off" v-model="addUnitForm.deptName"></el-input>
                    </el-form-item>
                    <el-form-item label="负责人" prop="managerName" :rules="[{ required: true, message: '请填写单位负责人', trigger: 'blur' }]">
                        <el-input auto-complete="off" v-model="addUnitForm.managerName"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" prop="managerPhone">
                        <el-input auto-complete="off" v-model="addUnitForm.managerPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="上级单位" prop="parentId" :rules="[{ required: true, message: '请选择上级单位', trigger: 'blur' }]">
                        <el-cascader :options="unitsOption" :show-all-levels="false" @change="unitsOptionChange" :change-on-select="true" v-model="curUnitItem" :filterable="true">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="地址" prop="address" :rules="[{ required: true, message: '请填写单位所在地址', trigger: 'blur' }]">
                        <el-input auto-complete="off" v-model="addUnitForm.address"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input type="textarea" auto-complete="off" v-model="addUnitForm.remark" resize="none"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addUnitFormVisible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click="handleSave">保存</el-button>
                </div>
            </el-dialog>
        </el-row>
    </section>
</template>

<script>
import $ from "jquery";
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        var validator = (rule, value, callback) => {
            let field = rule.field;
            if (field === "managerPhone") {
                if (value === "") {
                    return callback(new Error("请填写单位负责人电话"));
                }
                else if (!global.fieldVerification.IsPhone(value)) {
                    return callback(new Error("电话号码格式不正确"));
                }
            }
            callback();
        }
        return {
            units: [],
            selUnitsId: 0,
            unitsOption: [],
            pageLoading: false,
            defaultExpandedKeys: [],
            addUnitFormVisible: false,
            deptId: JSON.parse(sessionStorage.getItem("user")).deptId,
            addUnitForm: {
                parentId: 0,
                schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                deptName: "",
                managerName: "",
                managerPhone: "",
                address: "",
                remark: ""
            },
            filterText: "",
            defaultProps: {
                children: "children",
                label: "label"
            },
            customerRules: {
                managerPhone: [
                    { type: "number", required: true, validator: validator, trigger: "blur" }
                ]
            },
            curUnitItem: []
        }
    },
    methods: {
        //获取单位
        getUnits() {
            let para = this.deptId;
            this.pageLoading = true;
            global.printLog(para);
            setTimeout(() => {
                request.backstageManagement.department.query(para).then((res) => {
                    if (res.success) {
                        this.unitsOption = [];
                        let data = res.object;
                        global.printLog(data);
                        for (var item in data) {
                            this.unitsOption.push(this.recursive(data[item]));
                        }
                        this.defaultExpandedKeys = [];
                        if (data.length) {
                            this.getUnitsInfo(data[0].deptId);
                        }
                    }
                });
            }, 500);
        },
        //回传数据递归处理
        recursive(data) {
            var orgdata = {
                value: data.deptId + "&" + data.deptName,
                label: data.deptName
            };
            if (data.children) {
                $.extend(orgdata, { children: [] });
            }
            for (var item in data.children) {
                var subdata = this.recursive(data.children[item]);
                orgdata.children.push(subdata);
            }
            return orgdata;
        },
        //获取单位详细
        getUnitsInfo(deptId) {
            let para = [deptId];
            this.pageLoading = true;
            setTimeout(() => {
                request.backstageManagement.department.queryDetailById(para).then((res) => {
                    if (res.success) {
                        this.units = [];
                        let data = res.object;
                        for (let item in data) {
                            this.units.push({
                                deptName: data[item].deptName,
                                managerName: data[item].managerName,
                                managerPhone: data[item].managerPhone,
                                teaherCount: data[item].teaherCount,
                                carCount: data[item].carCount,
                                address: data[item].address,
                                remark: data[item].remark
                            });
                        }
                        this.pageLoading = false;
                    }
                });
            }, 500);
        },
        handleSave() {
            this.$refs["addUnitForm"].validate((valid) => {
                if (valid) {
                    let para = Object.assign({}, this.addUnitForm);
                    request.backstageManagement.department.create(para).then((res) => {
                        if (res.success) {
                            this.getUnits();
                            this.resetForm("addUnitForm");
                            this.addUnitFormVisible = false;
                            this.$message({ message: "单位添加成功！", type: "success" });
                        }
                        else {
                            this.$message.error("单位添加失败！");
                        }
                    });
                }
            });
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        unitsOptionChange(item) {
            this.curUnitItem = item;
            var len = item.length - 1;
            var value = item[len].split("&");
            this.addUnitForm.parentId = value[0];
            this.selUnitsId = value[0];
        },
        nodeClick(data) {
            let nodeid = data.value.split("&")[0];
            this.getUnitsInfo(nodeid);
        },
        //Dialog被关闭回调
        dialogClose() {
            this.curUnitItem = [];
            this.resetForm("addUnitForm");
        },
        //Dialog被打开回调
        dialogOpen() {
            $(".el-cascader-menus").css("z-index", "20002");
        },
        //重置表单数据
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    },
    activated() {
        this.getUnits();
    },
    watch: {
        filterText(val) {
            this.$refs.unitsOption.filter(val);
        }
    },
    mounted() {
    }
}

</script>

<style lang="scss">
.unit-dialog {
    input,
    textarea {
        width: 90%;
    }
    .el-select input,
    .el-cascader input {
        width: 100%;
    }
}
</style>