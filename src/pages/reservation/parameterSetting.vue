<template>
    <section class="addParameterForm" v-loading="pageLoading">
        <el-form :model="addParameterForm" :rules="parameterFormRule" label-width="165px" class="mt20" ref="addParameterForm">
            <el-form-item label="可提前预约" prop="advanceAppointmentHour">
                <el-input v-model="addParameterForm.advanceAppointmentHour"></el-input>
                <span class="unit">小时</span>
            </el-form-item>
            <el-form-item label="提前取消预约" prop="advanceCancelHour">
                <el-input v-model="addParameterForm.advanceCancelHour"></el-input>
                <span class="unit">小时</span>
            </el-form-item>
            <el-form-item label="学员提前签到" prop="beforeSignMin">
                <el-input v-model="addParameterForm.beforeSignMin"></el-input>
                <span class="unit">分钟</span>
            </el-form-item>
            <el-form-item label="预约限制学员签到" prop="judgeAppointment">
                <el-select v-model="addParameterForm.judgeAppointment" :clearable="false" placeholder="请选择">
                    <el-option label="否" :value="false"></el-option>
                    <el-option label="是" :value="true"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="预约限制强制签退" prop="forceExit">
                <el-switch v-model="addParameterForm.forceExit" on-color="#13ce66" off-color="#999" on-text="开" off-text="关" @change="handleForceExit">
                </el-switch>
            </el-form-item>
            <el-form-item v-if="addParameterForm.forceExit===true" label="预约结束后强制签退" prop="afterExitMin">
                <el-input v-model="addParameterForm.afterExitMin"></el-input>
                <span class="unit">分钟</span>
            </el-form-item>
        </el-form>
        <div slot="footer" class="t-right">
            <el-button type="primary" size="large" @click="handleSave">保存</el-button>
        </div>
    </section>
</template>

<style lang="scss">
.addParameterForm {
    width: 550px;
    margin: 50px auto;
    .el-switch__label * {
        font-size: 12px;
    }
    .el-switch--wide .el-switch__label--right span {
        right: 18px;
    }
    .el-switch--wide .el-switch__label--left span {
        left: 20px;
    }
    .el-form {
        .el-select,
        .el-input {
            width: 300px;
        }
        span.unit {
            line-height: 42px;
            display: inline;
            position: absolute;
            margin-left: 10px;
            color: #999;
        }
    }
}
</style>

<script>
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        var parametersValidator = (rule, value, callback) => {
            var msg = "";
            var target = rule.target;
            if (value === "") {
                if (target === "advanceAppointmentHour") {
                    msg = "请填写可提前预约小时";
                }
                else if (target === "advanceCancelHour") {
                    msg = "请填写提前取消预约小时";
                }
                else if (target === "beforeSignMin") {
                    msg = "请填写学员提前签到分钟";
                }
                else {
                    msg = "请填写预约结束后强制签退时间";
                }
                return callback(new Error(msg));
            }
            else if (!/^[0-9]\d*$/.test(value)) {
                if (target === "advanceAppointmentHour") {
                    msg = "预约小时必须为大于0的纯数字";
                }
                else if (target === "advanceCancelHour") {
                    msg = "取消预约小时必须为大于0的纯数字";
                }
                else if (target === "beforeSignMin") {
                    msg = "提前签到分钟必须为大于0的纯数字";
                }
                else {
                    msg = "强制签退时间必须为大于0的纯数字";
                }
                return callback(new Error(msg));
            }
            else if (/^[0-9]\d*$/.test(value)) {
                if (target === "advanceAppointmentHour") {
                    if (value > 200) {
                        return callback(new Error("可提前预约小时不能大于200"));
                    }
                    else if (value < 1) {
                        return callback(new Error("预约小时必须为大于0的纯数字"));
                    }
                }
                else if (target === "advanceCancelHour" && value > 24) {
                    return callback(new Error("取消预约小时不能大于24"));
                }
                else if (target === "beforeSignMin" && value > 60) {
                    return callback(new Error("提前签到分钟不能大于60"));
                }
                else if (target === "afterExitMin" && value > 60) {
                    return callback(new Error("强制签退时间不能大于60"));
                }
            }
            callback();
        }
        return {
            pageLoading: false,
            addParameterForm: {
                schoolCode: 0,
                orderCarCount: 0,
                astrictCar: false,
                advanceAppointmentHour: 0,
                advanceCancelHour: 0,
                forceExit: false,
                afterExitMin: 0,
                beforeSignMin: 0,
                judgeAppointment: false,
                studyBeforHour: 0
            },
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            parameterFormRule: {
                advanceAppointmentHour: [
                    { required: true, validator: parametersValidator, trigger: "blur", target: "advanceAppointmentHour" }
                ],
                advanceCancelHour: [
                    { required: true, validator: parametersValidator, trigger: "blur", target: "advanceCancelHour" }
                ],
                beforeSignMin: [
                    { required: true, validator: parametersValidator, trigger: "blur", target: "beforeSignMin" }
                ],
                afterExitMin: [
                    { required: true, validator: parametersValidator, trigger: "blur", target: "afterExitMin" }
                ]
            }
        }
    },
    methods: {
        queryParameters() {
            this.pageLoading = true;
            setTimeout(() => {
                request.appointment.para.query(this.schoolCode).then((res) => {
                    if (res.success === true) {
                        this.pageLoading = false;
                        this.addParameterForm = res.object;
                    }
                });
            }, 1000);
        },
        handleForceExit(val) {
            if (!val) {
                this.addParameterForm.afterExitMin = 0;
            }
        },
        handleSave() {
            this.$refs["addParameterForm"].validate((valid) => {
                if (valid) {
                    let objs = Object.assign({}, this.addParameterForm);
                    request.appointment.para.update(objs).then((res) => {
                        if (res.success === true) {
                            this.$message.success({ message: "预约参数编辑成功！" });
                        }
                        else {
                            this.$message.error("预约参数编辑失败！原因：" + res.message);
                        }
                    });
                }
            });
        }
    },
    activated() {
        global.printLog("activated every one");
        this.queryParameters();
    },
    mounted() {
    }
}

</script>