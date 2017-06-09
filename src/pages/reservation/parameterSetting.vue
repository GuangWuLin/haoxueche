<template>
    <section class="addParameterForm" v-loading="pageLoading">
        <el-form :model="addParameterForm" label-width="165px" class="mt20" ref="addParameterForm">
            <el-form-item label="可提前预约" prop="advanceAppointmentHour" :rules="[{ type:'number', required: true, message: '请填写可提前预约小时', trigger: 'blur' }]">
                <el-input-number size="large" v-model="addParameterForm.advanceAppointmentHour" :controls="false" :min="1" :max="200"></el-input-number>
                <span class="unit">小时</span>
            </el-form-item>
            <el-form-item label="提前取消预约" prop="advanceCancelHour" :rules="[{ type:'number', required: true, message: '请填写提前取消预约小时', trigger: 'blur' }]">
                <el-input-number size="large" v-model="addParameterForm.advanceCancelHour" :controls="false" :min="0" :max="24"></el-input-number>
                <span class="unit">小时</span>
            </el-form-item>
            <el-form-item label="学员提前签到" prop="beforeSignMin" :rules="[{ type:'number', required: true, message: '请填写学员提前签到分钟', trigger: 'blur' }]">
                <el-input-number size="large" v-model="addParameterForm.beforeSignMin" :controls="false" :min="0" :max="60"></el-input-number>
                <span class="unit">分钟</span>
            </el-form-item>
            <el-form-item label="预约限制学员签到" prop="judgeAppointment">
                <el-select v-model="addParameterForm.judgeAppointment" clearable placeholder="请选择">
                    <el-option label="否" :value="false"></el-option>
                    <el-option label="是" :value="true"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="预约限制强制签退" prop="forceExit">
                <el-switch v-model="addParameterForm.forceExit" on-color="#13ce66" off-color="#999" on-text="开" off-text="关">
                </el-switch>
            </el-form-item>
            <el-form-item v-if="addParameterForm.forceExit===true" label="预约结束后强制签退" prop="afterExitMin" :rules="[{ type:'number', required: true, message: '请填写预约结束后强制签退时间', trigger: 'blur' }]">
                <el-input-number size="large" v-model="addParameterForm.afterExitMin" :controls="false" :min="0" :max="60"></el-input-number>
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
    .el-form-item__error {
        padding: 0;
        top: 90%;
    }
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
        .el-input-number--large {
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
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode
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