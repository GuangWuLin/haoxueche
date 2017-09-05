<template>
    <section v-loading="pageLoading">
        <el-row class="mb20">
            <el-form :inline="true" :model="holidays.filter">
                <el-form-item class="left">
                    <el-date-picker v-model="holidays.filter.datetime" type="date" placeholder="请假时间" :editable="false" @change="handleDateChange"></el-date-picker>
                </el-form-item>
                <el-form-item class="left">
                    <el-input class="search-input mr10" v-model="holidays.filter.keyword" placeholder="输入教练姓名/手机号查询" icon="search" :on-icon-click="queryHolidays"></el-input>
                </el-form-item>
                <el-form-item class="right">
                    <!--<el-button type="primary" @click="">导出数据</el-button>-->
                </el-form-item>
            </el-form>
            <!--列表-->
            <el-table :data="holidays.data" @expand="handleExpand">
                <el-table-column type="expand">
                    <template scope="scope">
                        <el-form label-position="left" inline class="table-expand">
                            <el-form-item label="教练姓名">
                                <span>{{ scope.row.teacherName }}</span>
                            </el-form-item>
                            <el-form-item label="教练电话">
                                <span>{{ scope.row.phone }}</span>
                            </el-form-item>
                            <el-form-item label="请假时间">
                                <span>{{ scope.row.beginTime+" - "+scope.row.endTime }}</span>
                            </el-form-item>
                            <el-form-item label="请假原因">
                                <span>{{ scope.row.comments }}</span>
                            </el-form-item>
                            <el-form-item label="提交时间">
                                <span>{{ scope.row.gmtModify }}</span>
                            </el-form-item>
                            <el-form-item label="审核时间">
                                <span>{{ scope.row.gmtModify }}</span>
                            </el-form-item>
                            <el-form-item label="审核原因">
                                <span>{{ scope.row.refuseReason }}</span>
                            </el-form-item>
                            <el-form-item label="审核状态">
                                <span>{{ scope.row.state === 10 ? "未审核" : scope.row.state === 20 ? "审核通过" : "审核失败" }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="teacherName" label="教练姓名">
                </el-table-column>
                <el-table-column label="请假时间" width="320">
                    <template scope="scope">
                        {{scope.row.beginTime+" - "+scope.row.endTime}}
                    </template>
                </el-table-column>
                <el-table-column prop="gmtCreate" label="提交时间" width="180">
                </el-table-column>
                <el-table-column prop="state" label="审核结果" :formatter="formatter">
                </el-table-column>
                <el-table-column label="审核时间" width="180">
                    <template scope="scope">
                        {{scope.row.state===10?"- -":scope.row.gmtModify}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button type="text" size="small" @click.stop="" v-if="scope.row.state===10" @click="handleOperator('review',scope.row)">审核</el-button>
                        <el-button type="text" size="small" @click.stop="" v-if="scope.row.state===20" @click="handleOperator('cancel',scope.row)">取消请假</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--工具条-->
            <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="holidays.total">
            </el-pagination>
            <!--审核请假-->
            <el-dialog title="审核" v-model="holidays.review.visible" :close-on-click-modal="false" size="small" custom-class="holidaysReviewForm">
                <el-form v-if="holidays.review.visible" :model="holidays.review.forms" :rules="holidays.review.rules" ref="holidaysReviewForm" label-width="90px" class="mt30">
                    <el-form-item label="请假原因">
                        <el-input type="textarea" auto-complete="off" v-model="holidays.review.comments" resize="none" :autosize="true" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="审核状态" prop="state">
                        <el-radio-group v-model="holidays.review.forms.state">
                            <el-radio label="20">通过</el-radio>
                            <el-radio label="30">驳回</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="审核原因" prop="refuseReason">
                        <el-input type="textarea" auto-complete="off" v-model="holidays.review.forms.refuseReason" :rows="5" resize="none"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="holidays.review.visible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click.native="handleOperator('postReview')" :loading="holidays.review.btnLoading">保存</el-button>
                </div>
            </el-dialog>
        </el-row>
    </section>
</template>

<script>
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        return {
            pageSize: 10,
            pageLoading: false,
            holidays: {
                filter: {
                    keyword: "",
                    datetime: "",
                    state: ""
                },
                data: [],
                total: 0,
                curPage: 1,
                review: {
                    comments: "",
                    rules: {
                        state: [
                            { required: true, message: "请选择审核状态", trigger: "change" }
                        ],
                        refuseReason: [
                            { min: 0, max: 200, message: "审核原因字数不能超过200", trigger: "blur" }
                        ]
                    },
                    visible: false,
                    btnLoading: false,
                    forms: {
                        leaveId: "",
                        refuseReason: "",
                        state: "",
                        schoolCode: ""
                    }
                }
            },
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode
        }
    },
    methods: {
        formatter(row, column) {
            if (column.property === "state") {
                return row.state === 10 ? "未审核" : row.state === 20 ? "审核通过" : "审核失败";
            }
        },
        queryHolidays() {
            this.pageLoading = true;
            let date = this.holidays.filter.datetime;
            let paras = [this.schoolCode, (date === "" || date === undefined ? "" : new Date(date).Format("yyyy-MM-dd")), this.holidays.curPage, this.pageSize, this.holidays.filter.state, this.holidays.filter.keyword]
            setTimeout(() => {
                request.appointment.holidays.query.list(paras).then((res) => {
                    if (res.success) {
                        let data = res.object.list;
                        global.printLog(data);
                        let total = res.object.num;
                        this.holidays.data = data;
                        this.holidays.total = total;
                    }
                    this.pageLoading = false;
                });
            }, 500);
        },
        handleOperator(target, row) {
            if (target === "review") {
                this.holidays.review.visible = true;
                this.holidays.review.comments = row.comments;
                this.holidays.review.forms = { leaveId: row.leaveId, schoolCode: this.schoolCode, refuseReason: "", state: "" };
            }
            else if (target === "postReview") {
                this.$refs["holidaysReviewForm"].validate((valid) => {
                    if (valid) {
                        let paras = Object.assign({}, this.holidays.review.forms);
                        global.printLog(paras);
                        request.appointment.holidays.update(paras).then((res) => {
                            if (res.success) {
                                this.queryHolidays();
                                this.$message.success("审核成功");
                                this.holidays.review.visible = false;
                                this.holidays.review.comments = "";
                                this.holidays.review.forms = { state: "", leaveId: "", schoolCode: "", refuseReason: "" };
                            }
                            else {
                                this.$message.error("审核失败，原因：" + res.message);
                            }
                        });
                    }
                });
            }
            else if (target === "cancel") {
                this.$confirm("您正在操作取消请假操作, 是否继续？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnClickModal: false,
                    type: "warning"
                }).then(() => {
                    let paras = {
                        schoolCode: this.schoolCode,
                        leaveId: row.leaveId,
                        refuseReason: "取消请假",
                        state: 40
                    };
                    request.appointment.holidays.update(paras).then((res) => {
                        if (res.success) {
                            this.queryHolidays();
                            this.$message.success("取消成功");
                        }
                        else {
                            this.$message.error("取消失败，原因：" + res.message);
                        }
                    });
                }).catch(() => { });
            }
        },
        handleDateChange() {
            this.queryHolidays();
        },
        handleExpand(row, expanded) {
            global.printLog(row);
            global.printLog(expanded);
        },
        handleCurrentChange(val) {
            this.holidays.curPage = val;
            this.queryHolidays();
        }
    },
    activated() {
        global.printLog("activated every one");
        this.queryHolidays();
    }
}
</script>

<style lang="scss">
.holidaysReviewForm {
    width: 500px;
    .el-form-item {
        padding-right: 30px;
    }
}
</style>