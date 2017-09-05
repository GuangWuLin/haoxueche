<template>
    <section v-loading="pageLoading">
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="recharges">
                <el-form-item>
                    <el-input class="search-input mr40" v-model="recharges.filters.keyword" placeholder="输入学员电话或姓名搜索" icon="search" :on-icon-click="queryRechargeStu"></el-input>
                </el-form-item>
            </el-form>
            <!--列表-->
            <el-table :data="recharges.data">
                <el-table-column type="expand">
                    <template scope="scope">
                        <el-form label-position="left" inline class="table-expand">
                            <el-form-item label="姓名">
                                <span>{{ scope.row.studentName }}</span>
                            </el-form-item>
                            <el-form-item label="身份证">
                                <span>{{ scope.row.cardNo }}</span>
                            </el-form-item>
                            <el-form-item label="电话">
                                <span>{{ scope.row.phone }}</span>
                            </el-form-item>
                            <el-form-item label="预约学员">
                                <span>{{ scope.row.isAppointment }}</span>
                            </el-form-item>
                            <el-form-item label="预约类型">
                                <span>{{ scope.row.appointmentType }}</span>
                            </el-form-item>
                            <el-form-item label="剩余费用/元">
                                <span>{{ scope.row.costBalance }}</span>
                            </el-form-item>
                            <el-form-item label="科二剩余/分">
                                <span>{{ scope.row.stage2Time }}</span>
                            </el-form-item>
                            <el-form-item label="科三剩余/分">
                                <span>{{ scope.row.stage3Time }}</span>
                            </el-form-item>
                            <el-form-item label="科二已学/分">
                                <span>{{ scope.row.has2Time }}</span>
                            </el-form-item>
                            <el-form-item label="科三已学/分">
                                <span>{{ scope.row.has3Time }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="studentName" label="姓名" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="cardNo" label="身份证" width="200">
                </el-table-column>
                <el-table-column prop="phone" label="电话" width="160">
                </el-table-column>
                <!--<el-table-column prop="isAppointment" label="预约学员">
                </el-table-column>-->
                <el-table-column prop="appointmentType" label="预约类型" width="90">
                </el-table-column>
                <el-table-column prop="costBalance" label="剩余费用/元">
                </el-table-column>
                <el-table-column prop="twoTimes" label="科二已学/剩余">
                </el-table-column>
                <el-table-column prop="threeTimes" label="科三已学/剩余">
                </el-table-column>
                <el-table-column label="操作" width="170">
                    <template scope="scope">
                        <el-tag v-if="scope.row.isAppointment===0" type="gray">传统学员无此项操作</el-tag>
                        <div v-else>
                            <el-tag v-if="scope.row.learnFirst===true" type="gray">先学后付学员无此项操作</el-tag>
                            <div v-else>
                                <el-button type="text" size="small" @click.stop="handleOpen(scope.row,1)" v-if="scope.row.deductionShow">充学费</el-button>
                                <el-button type="text" size="small" @click.stop="handleOpen(scope.row,2)" v-if="scope.row.deductionShow">退学费</el-button>
                                <el-button type="text" size="small" @click.stop="handleOpen(scope.row,3)" v-if="scope.row.buckleShow">充学时</el-button>
                                <el-button type="text" size="small" @click.stop="handleOpen(scope.row,4)" v-if="scope.row.buckleShow">退学时</el-button>
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!--工具条-->
            <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="recharges.total">
            </el-pagination>
            <el-dialog title="充学费" v-model="tuitionFeesFormVisible" :close-on-click-modal="false" custom-class="recharges-dialog-style" @close="handleClose">
                <el-form :model="tuitionFeesForm" ref="tuitionFeesForm" label-width="80px" class="mt30">
                    <el-form-item label="学员姓名">
                        <span>{{tuitionFeesForm.stuName}}</span>
                    </el-form-item>
                    <el-form-item label="金额" :rules="[{ type: 'number', required: true, message: '请填写充值金额', trigger: 'blur' }]">
                        <el-input v-model="tuitionFeesForm.cost" ref="costInput" @change="handleInputChange"></el-input>
                        <span class="units">元</span>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="tuitionFeesFormVisible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click="handleCreate">保存</el-button>
                </div>
            </el-dialog>
            <el-dialog title="退学费" v-model="tuitionRefundFormVisible" :close-on-click-modal="false" custom-class="recharges-dialog-style" @close="handleClose">
                <el-form :model="tuitionRefundForm" ref="tuitionRefundForm" label-width="80px" class="mt30">
                    <el-form-item label="学员姓名">
                        <span>{{tuitionRefundForm.stuName}}</span>
                    </el-form-item>
                    <el-form-item label="金额" :rules="[{ type: 'number', required: true, message: '请填写充值金额', trigger: 'blur' }]">
                        <el-input v-model="tuitionRefundForm.cost" ref="costInput" @change="handleInputChange"></el-input>
                        <span class="units">元</span>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="tuitionRefundFormVisible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click="handleCreate">保存</el-button>
                </div>
            </el-dialog>
            <el-dialog title="充学时" v-model="timeRechargeFormVisible" :close-on-click-modal="false" custom-class="recharges-dialog-style" @close="handleClose">
                <el-form :model="timeRechargeForm" ref="timeRechargeForm" label-width="80px" class="mt30">
                    <el-form-item label="学员姓名">
                        <span>{{timeRechargeForm.stuName}}</span>
                    </el-form-item>
                    <el-form-item label="阶段" prop="stage">
                        <el-select v-model="timeRechargeForm.stage" placeholder="请选择阶段">
                            <el-option label="科目二" value="2"></el-option>
                            <el-option label="科目三" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="学时" :rules="[{ type: 'number', required: true, message: '请填写学时', trigger: 'blur' }]">
                        <el-input v-model="timeRechargeForm.times" ref="costInput" @change="handleInputChange"></el-input>
                        <span class="units">分钟</span>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="timeRechargeFormVisible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click="handleCreate">保存</el-button>
                </div>
            </el-dialog>
            <el-dialog title="退学时" v-model="timeRefundFormVisible" :close-on-click-modal="false" custom-class="recharges-dialog-style" @close="handleClose">
                <el-form :model="timeRefundForm" ref="timeRefundForm" label-width="80px" class="mt30">
                    <el-form-item label="学员姓名">
                        <span>{{timeRefundForm.stuName}}</span>
                    </el-form-item>
                    <el-form-item label="阶段" prop="stage">
                        <el-select v-model="timeRefundForm.stage" placeholder="请选择阶段">
                            <el-option label="科目二" value="2"></el-option>
                            <el-option label="科目三" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="学时" :rules="[{ type: 'number', required: true, message: '请填写学时', trigger: 'blur' }]">
                        <el-input v-model="timeRefundForm.times" ref="costInput" @change="handleInputChange"></el-input>
                        <span class="units">分钟</span>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="timeRefundFormVisible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click="handleCreate">保存</el-button>
                </div>
            </el-dialog>
            <el-dialog title="验证支付密码" v-model="checkPayPasswordFormVisible" :close-on-click-modal="false" custom-class="recharges-dialog-style" :show-close="false" :close-on-press-escape="false">
                <el-form :model="checkPayPasswordForm" ref="checkPayPasswordForm" label-width="80px" class="mt30" :rules="checkPayPasswordFormRules">
                    <el-form-item label="账户名">
                        <span>{{checkPayPasswordForm.userName}}</span>
                    </el-form-item>
                    <el-form-item label="密码" prop="payPassword">
                        <el-input type="password" v-model="checkPayPasswordForm.payPassword" placeholder="请输入支付密码"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="handleConfirm" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click="handleCheck">保存</el-button>
                </div>
            </el-dialog>
        </el-col>
    </section>
</template>

<style lang="scss">
.recharges-dialog-style {
    width: 500px;
    .el-tag {
        margin-right: 10px;
    }
    span.units {
        display: inline-block;
        position: absolute;
        margin-left: 10px;
    }
    .el-input {
        width: 180px;
    }
}
</style>

<script>
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        return {
            winTitle: "",
            pageLoading: false,
            pageSize: global.pageSize,
            recharges: {
                data: [],
                page: 1,
                total: 0,
                filters: {
                    keyword: ""
                }
            },
            tuitionFeesFormVisible: false,
            tuitionFeesForm: {
                stuName: "",
                cost: 1
            },
            tuitionRefundFormVisible: false,
            tuitionRefundForm: {
                stuName: "",
                cost: 1
            },
            timeRechargeFormVisible: false,
            timeRechargeForm: {
                stuName: "",
                stage: "2",
                times: 1,
                gift: false
            },
            timeRefundFormVisible: false,
            timeRefundForm: {
                stuName: "",
                stage: "2",
                times: 1,
                gift: false
            },
            checkPayPasswordFormVisible: false,
            checkPayPasswordForm: {
                userName: JSON.parse(sessionStorage.getItem("user")).userName,
                payPassword: "",
                costId: 0
            },
            checkPayPasswordFormRules: {
                payPassword: [
                    { required: true, message: "请输入交易密码", trigger: "blur" },
                    { min: 6, max: 12, message: "长度在 6 到 12 个字符之间", trigger: "blur" }
                ]
            },
            thisStu: "",
            userId: JSON.parse(sessionStorage.getItem("user")).userId,
            userName: JSON.parse(sessionStorage.getItem("user")).userName,
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            costInput: 0
        }
    },
    methods: {
        queryRechargeStu() {
            this.pageLoading = true;
            let para = [this.schoolCode, this.recharges.filters.keyword, this.recharges.page, this.pageSize];
            setTimeout(() => {
                request.appointment.recharge.queryStudent(para).then((res) => {
                    if (res.success) {
                        this.pageLoading = false;
                        this.recharges.total = res.object.num;
                        this.recharges.data = res.object.list;
                        for (let item in this.recharges.data) {
                            if (this.recharges.data[item].appointmentType === 10) {
                                this.recharges.data[item].deductionShow = true;
                            }
                            else {
                                this.recharges.data[item].buckleShow = true;
                            }
                            this.recharges.data[item].isAppointment = (this.recharges.data[item].isAppointment === 1 ? "是" : "否");
                            this.recharges.data[item].appointmentType = global.enums.appointmentType[this.recharges.data[item].appointmentType];
                        }
                    }
                });
            }, 1000);
        },
        handleInputChange(val) {
            this.$nextTick(function () {
                this.$refs.costInput.$refs.input.value = (val === "0" || !global.fieldVerification.IsNumber(val) ? 1 : val > 99999 ? 99999 : val);
            });
        },
        handleCurrentChange(val) {
            this.recharges.page = val;
            this.queryRechargeStu();
        },
        handleOpen(stu, target) {
            if (target === 1) {
                this.tuitionFeesFormVisible = true;
                this.tuitionFeesForm.stuName = stu.studentName;
            }
            else if (target === 2) {
                this.tuitionRefundFormVisible = true;
                this.tuitionRefundForm.stuName = stu.studentName;
            }
            else if (target === 3) {
                this.timeRechargeFormVisible = true;
                this.timeRechargeForm.stuName = stu.studentName;
            }
            else {
                this.timeRefundFormVisible = true;
                this.timeRefundForm.stuName = stu.studentName;
            }
            this.thisStu = stu;
            // setTimeout(() => {
            //     alert(123);
            //     this.$refs["tuitionFeesForm"].resetFields();
            // }, 5000);
            //this.resetForm(["tuitionFeesForm", "tuitionRefundForm", "timeRechargeForm", "timeRefundForm"]);
        },
        handleClose() {
            this.tuitionFeesForm.cost = 1;
            this.tuitionRefundForm.cost = 1;
            this.timeRechargeForm.stage = "2";
            this.timeRechargeForm.times = 1;
            this.timeRefundForm.stage = "2";
            this.timeRefundForm.times = 1;
        },
        handleCreate() {
            let _title = "充值";
            let _comments = "";
            var _cost = 0;
            var _stage = 0;
            var _operateType = 0;
            var _stageTwoTime = 0;
            var _stageThreeTime = 0;
            var _stage2Time = this.thisStu.stage2Time;
            var _stage3Time = this.thisStu.stage3Time;
            var _costBalance = this.thisStu.costBalance;
            if (this.tuitionFeesFormVisible) {
                _operateType = 20;
                _cost = this.tuitionFeesForm.cost;
                _comments = "为学员：" + this.thisStu.studentName + _title + _cost + "元";
            }
            else if (this.tuitionRefundFormVisible) {
                _title = "退费";
                _operateType = 10;
                if (_costBalance < this.tuitionRefundForm.cost) {
                    this.$message.error(_title + "金额不能大于剩余学费金额！");
                    return;
                }
                _cost = -this.tuitionRefundForm.cost;
                _comments = "为学员：" + this.thisStu.studentName + _title + this.tuitionRefundForm.cost + "元";
            }
            else if (this.timeRechargeFormVisible) {
                _title = "充学时";
                _operateType = 30;
                _stage = this.timeRechargeForm.stage;
                if (_stage === "2") {
                    _stageTwoTime = this.timeRechargeForm.times;
                }
                else {
                    _stageThreeTime = this.timeRechargeForm.times;
                }
                _comments = "为学员：" + this.thisStu.studentName + (this.timeRechargeForm.stage === "2" ? "科目二" : "科目三") + _title + this.timeRechargeForm.times + "分";
            }
            else {
                _title = "退学时";
                _operateType = 40;
                _stage = this.timeRefundForm.stage;
                if (_stage === "2") {
                    if (_stage2Time < this.timeRefundForm.times) {
                        this.$message.error(_title + "分钟数不能大于剩余学时分钟数！");
                        return;
                    }
                    _stageTwoTime = -this.timeRefundForm.times;
                }
                else {
                    if (_stage3Time < this.timeRefundForm.times) {
                        this.$message.error(_title + "分钟数不能大于剩余学时分钟数！");
                        return;
                    }
                    _stageThreeTime = -this.timeRefundForm.times;
                }
                _comments = "为学员：" + this.thisStu.studentName + (this.timeRefundForm.stage === "2" ? "科目二" : "科目三") + _title + this.timeRefundForm.times + "分";
            }
            let para = {
                schoolCode: this.schoolCode,
                studentId: this.thisStu.studentId,
                cost: _cost,//充值费用金额（退费则为负数）
                stageTwoTime: _stageTwoTime,//阶段选择科目二时，科二充值学时（退学时则为负数）
                stageThreeTime: _stageThreeTime,//阶段选择科目三时，科三充值学时（退学时则为负数）
                userId: this.userId,
                operateType: _operateType,//操作类型（10退费20充值30充学时40退学时）
                comments: _comments,
                costType: 1,//驾校充值、充学时默认填1
                title: _title,
                stage: _stage,//冲学时必填
                userName: this.userName, //驾校操作员姓名
                userPhone: this.userName,//驾校操作员电话
                studentName: this.thisStu.studentName,
                studentPhone: this.thisStu.phone//学员电话号码
            }
            this.winTitle = _title;
            request.appointment.recharge.create(para).then((res) => {
                if (res.success) {
                    let that = this;
                    that.checkPayPasswordForm.costId = res.object;
                    that.resetForm(["tuitionFeesForm", "tuitionRefundForm", "timeRechargeForm", "timeRefundForm"]);
                    that.tuitionFeesFormVisible = that.tuitionRefundFormVisible = that.timeRechargeFormVisible = that.timeRefundFormVisible = false;
                    setTimeout(function () {
                        that.checkPayPasswordFormVisible = true;
                    }, 500);
                }
                else {
                    this.$message.error("操作失败！原因：" + res.message);
                }
            });
        },
        handleCheck() {
            this.$refs["checkPayPasswordForm"].validate((valid) => {
                if (valid) {
                    request.appointment.recharge.checkPayPassword(this.checkPayPasswordForm).then((res) => {
                        if (res.success) {
                            this.queryRechargeStu();
                            this.resetForm(["checkPayPasswordForm"]);
                            this.checkPayPasswordFormVisible = false;
                            this.$message.success(this.winTitle + "操作成功！");
                        }
                        else {
                            this.checkPayPasswordForm.payPassword = "";
                            this.$message.error("操作失败！原因：" + res.message);
                        }
                    });
                }
            });
        },
        handleConfirm() {
            this.$confirm("终止该操作，" + this.winTitle + "订单将不会生效, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnClickModal: false,
                type: "warning"
            }).then(() => {
                this.checkPayPasswordFormVisible = false;
            }).catch(() => {
            });
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
    activated() {
        global.printLog("activated every one");
        this.queryRechargeStu();
    },
    mounted() {
    }
}

</script>