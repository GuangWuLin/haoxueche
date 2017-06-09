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
            <el-col :span="8" class="right t-right">
                <el-form :inline="true" :model="filters">
                    <el-form-item v-if="paymentType==='学费充值'">
                        <el-input class="search-input mr40" v-model="filters.academicExpenseValue.keyword" placeholder="输入支付人电话号码" icon="search" :on-icon-click="queryPayments" @keyup.enter.native="queryPayments"></el-input>
                        <el-button type="primary" class="right">导出表格</el-button>
                    </el-form-item>
                    <el-form-item v-if="paymentType==='先学后付'">
                        <el-input class="search-input mr40" v-model="filters.attachedBefore.keyword" placeholder="输入支付人电话号码" icon="search" :on-icon-click="queryPayments" @keyup.enter.native="queryPayments"></el-input>
                        <el-button type="primary" class="right">导出表格</el-button>
                    </el-form-item>
                    <el-form-item v-if="paymentType==='短信充值'">
                        <el-input class="search-input mr40" v-model="filters.short_livedBurden.keyword" placeholder="输入支付人电话号码" icon="search" :on-icon-click="queryPayments" @keyup.enter.native="queryPayments"></el-input>
                        <el-button type="primary" class="right">导出表格</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row v-if="paymentType==='学费充值'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <!--列表-->
                <el-table :data="filters.academicExpenseValue.data" @row-click="handleRowClick">
                    <el-table-column prop="payHxcNo" label="订单编号">
                    </el-table-column>
                    <el-table-column prop="title" label="订单标题">
                    </el-table-column>
                    <el-table-column prop="payPrice" label="支付金额／元">
                    </el-table-column>
                    <el-table-column prop="feePrice" label="手续费／元">
                    </el-table-column>
                    <el-table-column prop="ownerName" label="支付人">
                    </el-table-column>
                    <el-table-column prop="ownerMobile" label="支付人电话">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="支付时间">
                    </el-table-column>
                    <el-table-column prop="paySerialNum" label="支付流水号">
                    </el-table-column>
                    <el-table-column prop="comments" label="订单备注">
                    </el-table-column>
                    <el-table-column prop="state" label="状态" :formatter="formatter">
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="filters.academicExpenseValue.total">
                </el-pagination>
            </el-col>
        </el-row>
        <el-row v-if="paymentType==='先学后付'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <!--列表-->
                <el-table :data="filters.attachedBefore.data" @row-click="handleRowClick">
                    <el-table-column prop="payHxcNo" label="订单编号">
                    </el-table-column>
                    <el-table-column prop="title" label="订单标题">
                    </el-table-column>
                    <el-table-column prop="payPrice" label="支付金额／元">
                    </el-table-column>
                    <el-table-column prop="feePrice" label="手续费／元">
                    </el-table-column>
                    <el-table-column prop="ownerName" label="支付人">
                    </el-table-column>
                    <el-table-column prop="ownerMobile" label="支付人电话">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="支付时间">
                    </el-table-column>
                    <el-table-column prop="paySerialNum" label="支付流水号">
                    </el-table-column>
                    <el-table-column prop="comments" label="订单备注">
                    </el-table-column>
                    <el-table-column prop="state" label="状态" :formatter="formatter">
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="filters.attachedBefore.total">
                </el-pagination>
            </el-col>
        </el-row>
        <el-row v-if="paymentType==='短信充值'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <!--列表-->
                <el-table :data="filters.short_livedBurden.data" @row-click="handleRowClick">
                    <el-table-column prop="payHxcNo" label="订单编号">
                    </el-table-column>
                    <el-table-column prop="title" label="订单标题">
                    </el-table-column>
                    <el-table-column prop="payPrice" label="支付金额／元">
                    </el-table-column>
                    <el-table-column prop="feePrice" label="手续费／元">
                    </el-table-column>
                    <el-table-column prop="ownerName" label="支付人">
                    </el-table-column>
                    <el-table-column prop="ownerMobile" label="支付人电话">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="支付时间">
                    </el-table-column>
                    <el-table-column prop="paySerialNum" label="支付流水号">
                    </el-table-column>
                    <el-table-column prop="comments" label="订单备注">
                    </el-table-column>
                    <el-table-column prop="state" label="状态" :formatter="formatter">
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
        },
        queryPayments() {
            let type = this.paymentType;
            if (type === "学费充值") {
                this.queryPara[2] = this.filters.academicExpenseValue.keyword;
            }
            else if (type === "先学后付") {
                this.queryPara[2] = this.filters.attachedBefore.keyword;
            }
            else {
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
                            this.filters.academicExpenseValue.data = data.list;
                        }
                        else if (type === "先学后付") {
                            this.filters.attachedBefore.total = data.num;
                            this.filters.attachedBefore.data = data.list;
                        }
                        else {
                            this.filters.short_livedBurden.total = data.num;
                            this.filters.short_livedBurden.data = data.list;
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
    mounted() {
    }
}

</script>