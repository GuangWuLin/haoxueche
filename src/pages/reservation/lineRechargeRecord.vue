<template>
    <section v-loading="pageLoading">
        <el-row>
            <el-col :span="14">
                <el-radio-group v-model="rechargeType" @change="rechargeTypeChange">
                    <el-radio-button label="充学费"></el-radio-button>
                    <el-radio-button label="退学费"></el-radio-button>
                    <el-radio-button label="充学时"></el-radio-button>
                    <el-radio-button label="退学时"></el-radio-button>
                </el-radio-group>
            </el-col>
            <el-col :span="8" class="right t-right">
                <el-form :inline="true" :model="filters">
                    <el-form-item v-show="rechargeType==='充学费'">
                        <el-input class="search-input mr40" v-model="filters.schoolFee.keyword" placeholder="输入支付人电话号码" icon="search" :on-icon-click="queryRecharge"></el-input>
                        <el-button type="primary" class="right">导出表格</el-button>
                    </el-form-item>
                    <el-form-item v-show="rechargeType==='退学费'">
                        <el-input class="search-input mr40" v-model="filters.withdrawalExpenses.keyword" placeholder="输入支付人电话号码" icon="search" :on-icon-click="queryRecharge"></el-input>
                        <el-button type="primary" class="right">导出表格</el-button>
                    </el-form-item>
                    <el-form-item v-show="rechargeType==='充学时'">
                        <el-input class="search-input mr40" v-model="filters.timeOfSchooling.keyword" placeholder="输入支付人电话号码" icon="search" :on-icon-click="queryRecharge"></el-input>
                        <el-button type="primary" class="right">导出表格</el-button>
                    </el-form-item>
                    <el-form-item v-show="rechargeType==='退学时'">
                        <el-input class="search-input mr40" v-model="filters.withdrawalTimeOfSchooling.keyword" placeholder="输入支付人电话号码" icon="search" :on-icon-click="queryRecharge"></el-input>
                        <el-button type="primary" class="right">导出表格</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row v-show="rechargeType==='充学费'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <!--列表-->
                <el-table :data="filters.schoolFee.data" @row-click="handleRowClick">
                    <el-table-column prop="costNo" label="订单编号">
                    </el-table-column>
                    <el-table-column prop="title" label="订单标题">
                    </el-table-column>
                    <el-table-column prop="cost" label="支付金额/元">
                    </el-table-column>
                    <el-table-column prop="studentName" label="学员">
                    </el-table-column>
                    <el-table-column prop="studentPhone" label="学员电话">
                    </el-table-column>
                    <el-table-column prop="comments" label="订单备注">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="操作日期" :formatter="formatter">
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="filters.schoolFee.total">
                </el-pagination>
            </el-col>
        </el-row>
        <el-row v-show="rechargeType==='退学费'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <!--列表-->
                <el-table :data="filters.withdrawalExpenses.data" @row-click="handleRowClick">
                    <el-table-column prop="costNo" label="订单编号">
                    </el-table-column>
                    <el-table-column prop="title" label="订单标题">
                    </el-table-column>
                    <el-table-column prop="cost" label="支付金额/元">
                    </el-table-column>
                    <el-table-column prop="studentName" label="学员">
                    </el-table-column>
                    <el-table-column prop="studentPhone" label="学员电话">
                    </el-table-column>
                    <el-table-column prop="comments" label="订单备注">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="操作日期" :formatter="formatter">
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="filters.withdrawalExpenses.total">
                </el-pagination>
            </el-col>
        </el-row>
        <el-row v-show="rechargeType==='充学时'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <!--列表-->
                <el-table :data="filters.timeOfSchooling.data" @row-click="handleRowClick">
                    <el-table-column prop="costNo" label="订单编号">
                    </el-table-column>
                    <el-table-column prop="title" label="订单标题">
                    </el-table-column>
                    <el-table-column prop="stageTwoTime" label="科二分钟数/分">
                    </el-table-column>
                    <el-table-column prop="stageThreeTime" label="科三分钟数/分">
                    </el-table-column>
                    <el-table-column prop="studentName" label="学员">
                    </el-table-column>
                    <el-table-column prop="studentPhone" label="学员电话">
                    </el-table-column>
                    <el-table-column prop="comments" label="订单备注">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="操作日期" :formatter="formatter">
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="filters.timeOfSchooling.total">
                </el-pagination>
            </el-col>
        </el-row>
        <el-row v-show="rechargeType==='退学时'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <!--列表-->
                <el-table :data="filters.withdrawalTimeOfSchooling.data" @row-click="handleRowClick">
                    <el-table-column prop="costNo" label="订单编号">
                    </el-table-column>
                    <el-table-column prop="title" label="订单标题">
                    </el-table-column>
                    <el-table-column prop="stageTwoTime" label="科二分钟数/分">
                    </el-table-column>
                    <el-table-column prop="stageThreeTime" label="科三分钟数/分">
                    </el-table-column>
                    <el-table-column prop="studentName" label="学员">
                    </el-table-column>
                    <el-table-column prop="studentPhone" label="学员电话">
                    </el-table-column>
                    <el-table-column prop="comments" label="订单备注">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="操作日期" :formatter="formatter">
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="filters.withdrawalTimeOfSchooling.total">
                </el-pagination>
            </el-col>
        </el-row>
    </section>
</template>

<script>
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        return {
            pageLoading: false,
            pageSize: global.pageSize,
            filters: {
                schoolFee: {
                    type: 20,
                    data: [],
                    keyword: "",
                    total: 0,
                },
                withdrawalExpenses: {
                    type: 10,
                    data: [],
                    keyword: "",
                    total: 0,
                },
                timeOfSchooling: {
                    type: 30,
                    data: [],
                    keyword: "",
                    total: 0,
                },
                withdrawalTimeOfSchooling: {
                    type: 40,
                    data: [],
                    keyword: "",
                    total: 0,
                }
            },
            queryPara: [],
            rechargeType: "充学费",
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode
        }
    },
    methods: {
        formatter(row, column) {
            if (column.property === "gmtCreate") {
                return new Date(row.gmtCreate).Format("yyyy-MM-dd HH:mm:ss");
            }
        },
        queryRecharge() {
            let type = this.rechargeType;
            if (type === "充学费") {
                this.queryPara[2] = this.filters.schoolFee.keyword;
            }
            else if (type === "退学费") {
                this.queryPara[2] = this.filters.withdrawalExpenses.keyword;
            }
            else if (type === "充学时") {
                this.queryPara[2] = this.filters.timeOfSchooling.keyword;
            }
            else {
                this.queryPara[2] = this.filters.withdrawalTimeOfSchooling.keyword;
            }
            setTimeout(() => {
                request.appointment.offlineorder.query(this.queryPara).then((res) => {
                    if (res.success === true) {
                        this.pageLoading = false;
                        let data = res.object;
                        let type = this.rechargeType;
                        if (type === "充学费") {
                            this.filters.schoolFee.total = data.num;
                            this.filters.schoolFee.data = data.list;
                        }
                        else if (type === "退学费") {
                            this.filters.withdrawalExpenses.total = data.num;
                            this.filters.withdrawalExpenses.data = data.list;
                        }
                        else if (type === "充学时") {
                            this.filters.timeOfSchooling.total = data.num;
                            this.filters.timeOfSchooling.data = data.list;
                        }
                        else {
                            this.filters.withdrawalTimeOfSchooling.total = data.num;
                            this.filters.withdrawalTimeOfSchooling.data = data.list;
                        }
                    }
                });
            }, 1000);
        },
        rechargeTypeChange(type) {
            if (type === "充学费") {
                this.initPara(this.filters.schoolFee.type, this.filters.schoolFee.keyword, 1);
            }
            else if (type === "退学费") {
                this.initPara(this.filters.withdrawalExpenses.type, this.filters.withdrawalExpenses.keyword, 1);
            }
            else if (type === "充学时") {
                this.initPara(this.filters.timeOfSchooling.type, this.filters.timeOfSchooling.keyword, 1);
            }
            else {
                this.initPara(this.filters.withdrawalTimeOfSchooling.type, this.filters.withdrawalTimeOfSchooling.keyword, 1);
            }
        },
        initPara(type, keyword, page) {
            this.pageLoading = true;
            this.queryPara[1] = type;
            this.queryPara[2] = keyword;
            this.queryPara[3] = page;
            this.queryRecharge();
        },
        handleCurrentChange(val) {
            let type = this.rechargeType;
            if (type === "充学费") {
                this.initPara(this.filters.schoolFee.type, this.filters.schoolFee.keyword, val);
            }
            else if (type === "退学费") {
                this.initPara(this.filters.withdrawalExpenses.type, this.filters.withdrawalExpenses.keyword, val);
            }
            else if (type === "充学时") {
                this.initPara(this.filters.timeOfSchooling.type, this.filters.timeOfSchooling.keyword, val);
            }
            else {
                this.initPara(this.filters.withdrawalTimeOfSchooling.type, this.filters.withdrawalTimeOfSchooling.keyword, val);
            }
        },
        handleRowClick() {
        }
    },
    activated() {
        global.printLog("activated every one");
        this.queryPara[4] = this.pageSize;
        this.queryPara[0] = this.schoolCode;
        this.rechargeTypeChange(this.rechargeType);
    },
    mounted() {
    }
}

</script>