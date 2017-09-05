<template>
    <section v-loading="pageLoading">
        <el-row>
            <el-col :span="14">
                <el-radio-group v-model="paymentType" @change="paymentTypeChange">
                    <el-radio-button label="学费充值"></el-radio-button>
                    <el-radio-button label="先学后付"></el-radio-button>
                    <el-radio-button label="短信充值"></el-radio-button>
                </el-radio-group>
            </el-col>
            <el-col :span="10" class="right t-right">
                <el-form :inline="true" :model="filters">
                    <el-form-item v-if="paymentType==='学费充值'">
                        <el-input class="search-input mr20" v-model="filters.academicExpenseValue.keyword" placeholder="输入支付人电话号码" icon="search" :on-icon-click="queryPayments"></el-input>
                        <el-button type="primary" class="right">导出表格</el-button>
                    </el-form-item>
                    <el-form-item v-if="paymentType==='先学后付'">
                        <el-input class="search-input mr20" v-model="filters.attachedBefore.keyword" placeholder="输入支付人电话号码" icon="search" :on-icon-click="queryPayments"></el-input>
                        <el-button type="primary" class="right">导出表格</el-button>
                    </el-form-item>
                    <el-form-item v-if="paymentType==='短信充值'">
                        <el-input class="search-input mr20" v-model="filters.short_livedBurden.keyword" placeholder="输入支付人电话号码" icon="search" :on-icon-click="queryPayments"></el-input>
                        <el-button type="primary" class="right">导出表格</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row v-show="paymentType==='学费充值'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <!--列表-->
                <el-table :data="filters.academicExpenseValue.data" @row-click="handleRowClick">
                    <el-table-column type="expand">
                        <template scope="scope">
                            <el-form label-position="left" inline class="table-expand">
                                <el-form-item label="订单编号">
                                    <span>{{ scope.row.payHxcNo }}</span>
                                </el-form-item>
                                <el-form-item label="订单标题">
                                    <span>{{ scope.row.title }}</span>
                                </el-form-item>
                                <el-form-item label="支付金额／元">
                                    <span>{{ scope.row.payPrice }}</span>
                                </el-form-item>
                                <el-form-item label="手续费／元">
                                    <span>{{ scope.row.feePrice }}</span>
                                </el-form-item>
                                <el-form-item label="支付人">
                                    <span>{{ scope.row.ownerName }}</span>
                                </el-form-item>
                                <el-form-item label="支付人电话">
                                    <span>{{ scope.row.ownerMobile }}</span>
                                </el-form-item>
                                <el-form-item label="支付时间">
                                    <span>{{ new Date(scope.row.gmtCreate).Format("yyyy-MM-dd HH:mm:ss") }}</span>
                                </el-form-item>
                                <el-form-item label="支付流水号">
                                    <span>{{ scope.row.paySerialNum }}</span>
                                </el-form-item>
                                <el-form-item label="订单备注" style="width:100%;">
                                    <span>{{ scope.row.comments }}</span>
                                </el-form-item>
                                <el-form-item label="状态" style="width:100%;">
                                    <span>{{ scope.row.stateName }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column prop="payHxcNo" label="订单编号">
                    </el-table-column>
                    <el-table-column prop="title" label="订单标题">
                    </el-table-column>
                    <el-table-column prop="payPrice" label="支付金额/元">
                    </el-table-column>
                    <el-table-column prop="feePrice" label="手续费/元">
                    </el-table-column>
                    <el-table-column prop="ownerName" label="支付人">
                    </el-table-column>
                    <el-table-column prop="ownerMobile" label="支付人电话">
                    </el-table-column>
                    <el-table-column prop="stateName" label="状态">
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="filters.academicExpenseValue.total">
                </el-pagination>
            </el-col>
        </el-row>
        <el-row v-show="paymentType==='先学后付'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <!--列表-->
                <el-table :data="filters.attachedBefore.data" @row-click="handleRowClick">
                    <el-table-column type="expand">
                        <template scope="scope">
                            <el-form label-position="left" inline class="table-expand">
                                <el-form-item label="订单编号">
                                    <span>{{ scope.row.payHxcNo }}</span>
                                </el-form-item>
                                <el-form-item label="订单标题">
                                    <span>{{ scope.row.title }}</span>
                                </el-form-item>
                                <el-form-item label="支付金额／元">
                                    <span>{{ scope.row.payPrice }}</span>
                                </el-form-item>
                                <el-form-item label="手续费／元">
                                    <span>{{ scope.row.feePrice }}</span>
                                </el-form-item>
                                <el-form-item label="支付人">
                                    <span>{{ scope.row.ownerName }}</span>
                                </el-form-item>
                                <el-form-item label="支付人电话">
                                    <span>{{ scope.row.ownerMobile }}</span>
                                </el-form-item>
                                <el-form-item label="支付时间">
                                    <span>{{ new Date(scope.row.gmtCreate).Format("yyyy-MM-dd HH:mm:ss") }}</span>
                                </el-form-item>
                                <el-form-item label="支付流水号">
                                    <span>{{ scope.row.paySerialNum }}</span>
                                </el-form-item>
                                <el-form-item label="订单备注" style="width:100%;">
                                    <span>{{ scope.row.comments }}</span>
                                </el-form-item>
                                <el-form-item label="状态" style="width:100%;">
                                    <span>{{ scope.row.stateName }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column prop="payHxcNo" label="订单编号" width="200">
                    </el-table-column>
                    <el-table-column prop="title" label="订单标题">
                    </el-table-column>
                    <el-table-column prop="payPrice" label="支付金额/元">
                    </el-table-column>
                    <el-table-column prop="feePrice" label="手续费/元">
                    </el-table-column>
                    <el-table-column prop="ownerName" label="支付人">
                    </el-table-column>
                    <el-table-column prop="ownerMobile" label="支付人电话">
                    </el-table-column>
                    <el-table-column prop="stateName" label="状态">
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="filters.attachedBefore.total">
                </el-pagination>
            </el-col>
        </el-row>
        <el-row v-show="paymentType==='短信充值'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <!--列表-->
                <el-table :data="filters.short_livedBurden.data" @row-click="handleRowClick">
                    <el-table-column type="expand">
                        <template scope="scope">
                            <el-form label-position="left" inline class="table-expand">
                                <el-form-item label="订单编号">
                                    <span>{{ scope.row.payHxcNo }}</span>
                                </el-form-item>
                                <el-form-item label="订单标题">
                                    <span>{{ scope.row.title }}</span>
                                </el-form-item>
                                <el-form-item label="支付金额／元">
                                    <span>{{ scope.row.payPrice }}</span>
                                </el-form-item>
                                <el-form-item label="手续费／元">
                                    <span>{{ scope.row.feePrice }}</span>
                                </el-form-item>
                                <el-form-item label="支付人">
                                    <span>{{ scope.row.ownerName }}</span>
                                </el-form-item>
                                <el-form-item label="支付人电话">
                                    <span>{{ scope.row.ownerMobile }}</span>
                                </el-form-item>
                                <el-form-item label="支付时间">
                                    <span>{{ new Date(scope.row.gmtCreate).Format("yyyy-MM-dd HH:mm:ss") }}</span>
                                </el-form-item>
                                <el-form-item label="支付流水号">
                                    <span>{{ scope.row.paySerialNum }}</span>
                                </el-form-item>
                                <el-form-item label="订单备注" style="width:100%;">
                                    <span>{{ scope.row.comments }}</span>
                                </el-form-item>
                                <el-form-item label="状态" style="width:100%;">
                                    <span>{{ scope.row.stateName }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column prop="payHxcNo" label="订单编号">
                    </el-table-column>
                    <el-table-column prop="title" label="订单标题">
                    </el-table-column>
                    <el-table-column prop="payPrice" label="支付金额/元">
                    </el-table-column>
                    <el-table-column prop="feePrice" label="手续费/元">
                    </el-table-column>
                    <el-table-column prop="ownerName" label="支付人">
                    </el-table-column>
                    <el-table-column prop="ownerMobile" label="支付人电话">
                    </el-table-column>
                    <el-table-column prop="stateName" label="状态">
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="filters.short_livedBurden.total">
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
                academicExpenseValue: {
                    type: 10,
                    data: [],
                    keyword: "",
                    total: 0
                },
                attachedBefore: {
                    type: 20,
                    data: [],
                    keyword: "",
                    total: 0
                },
                short_livedBurden: {
                    type: 30,
                    data: [],
                    keyword: "",
                    total: 0
                }
            },
            queryPara: [],
            paymentType: "学费充值",
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode
        }
    },
    methods: {
        formatter(row, column) {
            if (column.property === "state") {
                return global.enums.payStatus[row.state];
            }
            else if (column.property === "gmtCreate") {
                return row.gmtCreate === null ? "" : new Date(row.gmtCreate).Format("yyyy-MM-dd HH:mm:ss");
            }
        },
        queryPayments() {
            let type = this.paymentType;
            if (type === "学费充值") {
                this.filters.academicExpenseValue.data = [];
                this.queryPara[2] = this.filters.academicExpenseValue.keyword;
            }
            else if (type === "先学后付") {
                this.filters.attachedBefore.data = [];
                this.queryPara[2] = this.filters.attachedBefore.keyword;
            }
            else {
                this.filters.short_livedBurden.data = [];
                this.queryPara[2] = this.filters.short_livedBurden.keyword;
            }
            setTimeout(() => {
                request.appointment.onlineorder.query(this.queryPara).then((res) => {
                    if (res.success === true) {
                        this.pageLoading = false;
                        let data = res.object;
                        let type = this.paymentType;
                        if (type === "学费充值") {
                            this.filters.academicExpenseValue.total = data.num;
                            for (let item in data.list) {
                                this.filters.academicExpenseValue.data.push({
                                    payHxcNo: data.list[item].payHxcNo,
                                    title: data.list[item].title,
                                    payPrice: data.list[item].payPrice,
                                    feePrice: data.list[item].feePrice,
                                    ownerName: data.list[item].ownerName,
                                    ownerMobile: data.list[item].ownerMobile,
                                    gmtCreate: data.list[item].gmtCreate,
                                    paySerialNum: data.list[item].paySerialNum,
                                    comments: data.list[item].comments,
                                    state: data.list[item].state,
                                    stateName: global.enums.payStatus[data.list[item].state]
                                });
                            }
                        }
                        else if (type === "先学后付") {
                            this.filters.attachedBefore.total = data.num;
                            for (let item in data.list) {
                                this.filters.attachedBefore.data.push({
                                    payHxcNo: data.list[item].payHxcNo,
                                    title: data.list[item].title,
                                    payPrice: data.list[item].payPrice,
                                    feePrice: data.list[item].feePrice,
                                    ownerName: data.list[item].ownerName,
                                    ownerMobile: data.list[item].ownerMobile,
                                    gmtCreate: data.list[item].gmtCreate,
                                    paySerialNum: data.list[item].paySerialNum,
                                    comments: data.list[item].comments,
                                    state: data.list[item].state,
                                    stateName: global.enums.payStatus[data.list[item].state]
                                });
                            }
                        }
                        else {
                            this.filters.short_livedBurden.total = data.num;
                            for (let item in data.list) {
                                this.filters.short_livedBurden.data.push({
                                    payHxcNo: data.list[item].payHxcNo,
                                    title: data.list[item].title,
                                    payPrice: data.list[item].payPrice,
                                    feePrice: data.list[item].feePrice,
                                    ownerName: data.list[item].ownerName,
                                    ownerMobile: data.list[item].ownerMobile,
                                    gmtCreate: data.list[item].gmtCreate,
                                    paySerialNum: data.list[item].paySerialNum,
                                    comments: data.list[item].comments,
                                    state: data.list[item].state,
                                    stateName: global.enums.payStatus[data.list[item].state]
                                });
                            }
                        }
                    }
                });
            }, 1000);
        },
        paymentTypeChange(type) {
            if (type === "学费充值") {
                this.initPara(this.filters.academicExpenseValue.type, this.filters.academicExpenseValue.keyword, 1);
            }
            else if (type === "先学后付") {
                this.initPara(this.filters.attachedBefore.type, this.filters.attachedBefore.keyword, 1);
            }
            else {
                this.initPara(this.filters.short_livedBurden.type, this.filters.short_livedBurden.keyword, 1);
            }
        },
        initPara(type, keyword, page) {
            this.pageLoading = true;
            this.queryPara[1] = type;
            this.queryPara[2] = keyword;
            this.queryPara[3] = page;
            this.queryPayments();
        },
        handleCurrentChange(val) {
            let type = this.paymentType;
            if (type === "学费充值") {
                this.initPara(this.filters.academicExpenseValue.type, this.filters.academicExpenseValue.keyword, val);
            }
            else if (type === "先学后付") {
                this.initPara(this.filters.attachedBefore.type, this.filters.attachedBefore.keyword, val);
            }
            else {
                this.initPara(this.filters.short_livedBurden.type, this.filters.short_livedBurden.keyword, val);
            }
        },
        handleRowClick() {
        }
    },
    activated() {
        global.printLog("activated every one");
        this.queryPara[4] = this.pageSize;
        this.queryPara[0] = this.schoolCode;
        this.paymentTypeChange(this.paymentType)
        // if (this.paymentType === "学费充值") {
        //     this.initPara(this.filters.academicExpenseValue.type, this.filters.academicExpenseValue.keyword, 1);
        // }
    },
    computed: {
        format: function (v) {
            global.printLog(v)
            //return this.msg.split('').reverse().join('')
        }
    }
}
</script>

<style lang="scss" scope>
.table-expand {
    font-size: 0;
}

.table-expand label {
    width: 100px;
    color: #99a9bf;
    text-align: right;
    margin-right: 10px;
}

.table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
    text-align: left;
}

.el-form--label-left .el-form-item__label {
    text-align: right;
    padding: 13px 12px 13px 0;
}

.el-table__expanded-cell {
    .el-form-item__content {
        line-height: 40px;
    }
}
</style>