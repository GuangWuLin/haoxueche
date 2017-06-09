<template>
    <section v-loading="pageLoading">
        <el-row class="mb20">
            <el-button type="primary" @click="addPriceFormVisible = true" class="right">添加价格</el-button>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="5">
                <el-input placeholder="根据单位名称过滤" class="mb10" v-model="filterText">
                </el-input>
    
                <el-tree class="filter-tree" :data="unitsOption" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="unitsOption" @node-click="nodeClick" :expand-on-click-node="false" :highlight-current="true" :default-expanded-keys="defaultExpandedKeys">
                </el-tree>
            </el-col>
            <el-col :span="19">
                <el-table :data="prices">
                    <el-table-column prop="unitName" label="单位">
                    </el-table-column>
                    <el-table-column prop="carTypeName" label="车型">
                    </el-table-column>
                    <el-table-column prop="managerCost" label="价格(元)">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="text" size="small" @click.stop="openEditForm(scope.row)">修改</el-button>
                            <el-button type="text" size="small" @click.stop="handleDelete(scope.row.id)">作废</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-dialog title="新增价格" v-model="addPriceFormVisible" :close-on-click-modal="false" class="price-dialog" size="tiny" @close="dialogClose" @open="dialogOpen">
                <el-form :model="addPriceForm" label-width="95px" class="mt20" ref="addPriceForm">
                    <el-form-item label="所属单位" prop="deptId" :rules="[{ required: true, message: '请选择所属单位', trigger: 'change' }]">
                        <el-cascader :options="unitsOption" :show-all-levels="false" @change="unitsOptionChange" :change-on-select="true" v-model="curUnitItem" :filterable="true">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="车型" prop="carType" :rules="[{ type:'number', required: true, message: '请选择车型', trigger: 'change' }]">
                        <el-select placeholder="请选择车型" v-model="addPriceForm.carType" ref="addCarType">
                            <el-option v-for="item in carTypeOptions" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="价格" prop="managerCost" :rules="[{ required: true, message: '请填写价格', trigger: 'blur' }]">
                        <el-input auto-complete="off" v-model="addPriceForm.managerCost">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addPriceFormVisible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click="handleSave">保存</el-button>
                </div>
            </el-dialog>
            <el-dialog title="修改价格" v-model="editPriceFormVisible" :close-on-click-modal="false" class="price-dialog" size="tiny">
                <el-form :model="editPriceForm" label-width="85px" class="mt20" ref="editPriceForm">
                    <el-form-item label="所属单位">
                        <el-input v-model="deptName" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="车型" prop="carType" :rules="[{ type:'number', required: true, message: '请选择车型', trigger: 'change' }]">
                        <el-select placeholder="请选择车型" v-model="editPriceForm.carType" ref="editCarType">
                            <el-option v-for="item in carTypeOptions" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="价格" prop="managerCost" :rules="[{ required: true, message: '请填写价格', trigger: 'blur' }]">
                        <el-input auto-complete="off" v-model="editPriceForm.managerCost">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="editPriceFormVisible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click="handleEdit">保存</el-button>
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
        return {
            prices: [],
            carTypeOptions: [],
            addPriceForm: {
                deptId: 0,
                schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                carType: "",
                carTypeName: "",
                managerCost: ""
            },
            deptId: JSON.parse(sessionStorage.getItem("user")).deptId,
            deptName: "",
            editPriceForm: {
                id: 0,
                deptId: 0,
                schoolCode: "",
                carType: "",
                carTypeName: "",
                managerCost: ""
            },
            addPriceFormVisible: false,
            editPriceFormVisible: false,
            curUnitName: "",
            unitsOption: [],
            defaultExpandedKeys: [],
            filterText: "",
            defaultProps: {
                children: "children",
                label: "label"
            },
            curUnitItem: [],
            pageLoading: false
        }
    },
    methods: {
        //获取车辆类型
        queryCarType() {
            request.public.queryCarType().then((res) => {
                if (res.success === true) {
                    let data = res.object;
                    for (let item in data) {
                        this.carTypeOptions.push({
                            label: data[item].value,
                            value: data[item].key
                        });
                    }
                }
            });
        },
        //获取单位
        queryUnits() {
            let para = this.deptId;
            this.pageLoading = true;
            setTimeout(() => {
                request.backstageManagement.department.query(para).then((res) => {
                    if (res.success) {
                        this.unitsOption = [];
                        let data = res.object;
                        for (var item in data) {
                            this.unitsOption.push(this.recursive(data[item]));
                        }
                        this.curUnitName = data[0].deptName;
                        this.queryDepartmentCost(this.deptId);
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
        //查询价格表
        queryDepartmentCost(para) {
            this.pageLoading = true;
            setTimeout(() => {
                request.backstageManagement.finance.query.DepartmentCost(para).then((res) => {
                    if (res.success) {
                        this.prices = [];
                        let objects = res.object;
                        for (let item in objects) {
                            this.prices.push({
                                id: objects[item].id,
                                deptId: objects[item].deptId,
                                unitName: this.curUnitName,
                                carTypeId: objects[item].carType,
                                carTypeName: objects[item].carTypeName,
                                managerCost: objects[item].managerCost,
                                schoolCode: objects[item].schoolCode
                            });
                        }
                        this.pageLoading = false;
                    }
                });
            }, 500);
        },
        unitsOptionChange(item) {
            this.curUnitItem = item;
            var len = item.length - 1;
            var value = item[len].split("&");
            this.addPriceForm.deptId = value[0];
            this.deptId = value[0];
            this.curUnitName = value[1];
        },
        handleSave() {
            this.$refs["addPriceForm"].validate((valid) => {
                if (valid) {
                    this.addPriceForm.carType = this.$refs.addCarType.value;
                    this.addPriceForm.carTypeName = this.$refs.addCarType.selectedLabel;
                    let para = Object.assign({}, this.addPriceForm);
                    request.backstageManagement.finance.create.DepartmentCost(para).then((res) => {
                        if (res.success) {
                            this.queryDepartmentCost(this.deptId);
                            this.resetForm("addPriceForm");
                            this.addPriceFormVisible = false;
                            this.$message({ message: "价格添加成功！", type: "success" });
                        }
                        else {
                            this.$message.error("价格添加失败！");
                        }
                    });
                }
            });
        },
        openEditForm(row) {
            this.deptName = row.unitName;
            this.editPriceForm.id = row.id;
            this.editPriceForm.deptId = row.deptId;
            this.editPriceForm.managerCost = row.managerCost;
            this.editPriceForm.carType = row.carTypeId;
            this.editPriceForm.carTypeName = row.carTypeName;
            this.editPriceForm.schoolCode = row.schoolCode;
            this.editPriceFormVisible = true;
        },
        handleEdit() {
            this.editPriceForm.carType = this.$refs.editCarType.value;
            this.editPriceForm.carTypeName = this.$refs.editCarType.selectedLabel;
            let para = Object.assign({}, this.editPriceForm);
            request.backstageManagement.finance.edit.DepartmentCost(para).then((res) => {
                if (res.success) {
                    this.queryDepartmentCost(this.deptId);
                    this.editPriceFormVisible = false;
                    this.$message({ message: "价格设置修改成功！", type: "success" });
                }
                else {
                    this.$message.error("价格设置修改失败！");
                }
            });
        },
        handleDelete(id) {
            this.$confirm("您正在作废价格, 是否继续？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                request.backstageManagement.finance.delete.DepartmentCost(id).then((res) => {
                    if (res.success) {
                        this.queryDepartmentCost(this.deptId);
                        this.$message({ message: "价格作废成功！", type: "success" });
                    }
                    else {
                        this.$message.error("价格作废失败！");
                    }
                });
            }).catch(() => { });
        },
        nodeClick(data) {
            this.curUnitName = data.label;
            let nodeid = data.value.split("&")[0];
            this.deptId = nodeid;
            this.queryDepartmentCost(nodeid);
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        //Dialog被关闭回调
        dialogClose() {
            this.curUnitItem = [];
            this.resetForm("addPriceForm");
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
    watch: {
        filterText(val) {
            this.$refs.unitsOption.filter(val);
        }
    },
    activated() {
        this.deptId = JSON.parse(sessionStorage.getItem("user")).deptId;
        this.queryUnits();
        this.queryCarType();
    },
    mounted() {
    }
}

</script>

<style lang="scss">
.price-dialog {
    .el-input {
        width: 218px;
    }
    .el-input-group {
        width: 57.5%;
    }
}
</style>