<template>
    <section v-loading="pageLoading">
        <el-row>
            <el-col :span="24" class="toolbar">
                <el-radio-group v-model="pageListSel" class="mb20" @change="handlePageListSelChange">
                    <el-radio-button label="待上报学员"></el-radio-button>
                    <el-radio-button label="待审核学员"></el-radio-button>
                    <el-radio-button label="审核失败学员"></el-radio-button>
                </el-radio-group>
            </el-col>
        </el-row>
        <el-row v-show="pageListSel==='待上报学员'">
            <!--工具条-->
            <el-row :span="24" class="toolbar">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input class="search-input mr10 left" v-model="filters.keyWord" placeholder="输入学员姓名、电话" icon="search"></el-input>
                    </el-form-item>
                    <el-button type="primary" class="mr20 right">批量上报</el-button>
                </el-form>
            </el-row>
            <!--列表-->
            <el-row class="mb20">
                <!--列表-->
                <el-table :data="reporting.students">
                    <el-table-column type="selection" width="35">
                    </el-table-column>
                    <el-table-column prop="userId" label="姓名">
                    </el-table-column>
                    <el-table-column prop="userName" label="电话">
                    </el-table-column>
                    <el-table-column prop="gender" label="车型">
                    </el-table-column>
                    <el-table-column prop="idNumber" label="分校">
                    </el-table-column>
                    <el-table-column prop="phone" label="身份证号">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="备案状态">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="上报状态">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="报名日期">
                    </el-table-column>
                    <el-table-column label="操作" width="140">
                        <template scope="scope">
                            <el-button type="text" size="small" @click.stop="" :disabled="scope.row.isDisabled">上报车管</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination class="mt20" layout="total,prev,pager,next,jumper" @current-change="handlePageChange" :page-size="10" :total="total">
                </el-pagination>
            </el-row>
        </el-row>
        <el-row v-show="pageListSel==='待审核学员'">
            <!--工具条-->
            <el-row :span="24" class="toolbar">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input class="search-input mr10 left" v-model="filters.keyWord" placeholder="输入学员姓名、电话" icon="search"></el-input>
                    </el-form-item>
                    <el-button type="primary" class="mr20 right">批量办结</el-button>
                </el-form>
            </el-row>
            <!--列表-->
            <el-row class="mb20">
                <!--列表-->
                <el-table :data="reporting.students">
                    <el-table-column type="selection" width="35">
                    </el-table-column>
                    <el-table-column prop="userId" label="姓名">
                    </el-table-column>
                    <el-table-column prop="userName" label="电话">
                    </el-table-column>
                    <el-table-column prop="gender" label="车型">
                    </el-table-column>
                    <el-table-column prop="idNumber" label="分校">
                    </el-table-column>
                    <el-table-column prop="phone" label="身份证号">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="备案状态">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="上报状态">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="报名日期">
                    </el-table-column>
                    <el-table-column label="操作" width="140">
                        <template scope="scope">
                            <el-button type="text" size="small" @click.stop="" :disabled="scope.row.isDisabled">车管办结</el-button>
                            <el-button type="text" size="small" @click.stop="" :disabled="scope.row.isDisabled">审核失败</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination class="mt20" layout="total,prev,pager,next,jumper" @current-change="handlePageChange" :page-size="10" :total="total">
                </el-pagination>
            </el-row>
        </el-row>
        <el-row v-show="pageListSel==='审核失败学员'">
            <!--工具条-->
            <el-row :span="24" class="toolbar">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input class="search-input mr10 left" v-model="filters.keyWord" placeholder="输入学员姓名、电话" icon="search"></el-input>
                    </el-form-item>
                    <el-button type="primary" class="mr20 right">批量重报</el-button>
                </el-form>
            </el-row>
            <!--列表-->
            <el-row class="mb20">
                <!--列表-->
                <el-table :data="reporting.students">
                    <el-table-column type="selection" width="35">
                    </el-table-column>
                    <el-table-column prop="userId" label="姓名">
                    </el-table-column>
                    <el-table-column prop="userName" label="电话">
                    </el-table-column>
                    <el-table-column prop="gender" label="车型">
                    </el-table-column>
                    <el-table-column prop="idNumber" label="分校">
                    </el-table-column>
                    <el-table-column prop="phone" label="身份证号">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="备案状态">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="上报状态">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="报名日期">
                    </el-table-column>
                    <el-table-column label="操作" width="140">
                        <template scope="scope">
                            <el-button type="text" size="small" @click.stop="" :disabled="scope.row.isDisabled">重报车管</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination class="mt20" layout="total,prev,pager,next,jumper" @current-change="handlePageChange" :page-size="10" :total="total">
                </el-pagination>
            </el-row>
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
            filters: {
                keyWord: ""
            },
            reporting: {
                students: []
            },
            total: 0,
            args: [0, 1, 10],
            pageLoading: false,
            pageListSel: "待上报学员",
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode
        }
    },
    methods: {
        //获取用户列表
        getStudentsByReporting() {
            this.pageLoading = true;
            setTimeout(() => {
                request.systemSettings.users.queryInfo(this.args).then((res) => {
                    if (res.success === true) {
                        let data = res.object;
                        this.total = data.num;
                        this.pageLoading = false;
                        this.reporting.students = data.list;
                    }
                });
            }, 1000);
        },
        //翻页查询
        handlePageChange(val) {
            this.args[1] = val;
            this.getStudentsByReporting();
        },
        handlePageListSelChange(val) {
            if (val === "待上报学员") {
            }
            else if (val === "待审核学员") {
            }
            else {
            }
        },
        //重置表单数据
        resetForm(formNames) {
            for (var item in formNames) {
                try {
                    this.$refs[formNames[item]].resetFields();
                }
                catch (e) { }
            }
        }
    },
    created() {
    },
    activated() {
        global.printLog("activated every one");
    },
    //页面挂载
    mounted() {
    }
}

</script>

<style lang="scss">

</style>