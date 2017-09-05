<template>
    <section v-loading="pageLoading">
        <a href="" download=".xlsx" id="down-link"></a>
        <el-row>
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="filters">
                    <el-col :span="18">
                        <el-form-item>
                            <el-input class="search-input" v-model="filters.keyword" placeholder="输入学员姓名、电话" icon="search" :on-icon-click="getReservation"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-date-picker v-model="filters.dateRange" type="daterange" placeholder="选择预约时间" :editable="false" @change="handleDateRangeChange"></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-select v-model="filters.isEvaluate" style="width:150px;" @change="getReservation">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="未评价" value="0"></el-option>
                                <el-option label="已评价" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <!--<el-form-item>
                            <el-select v-model="filters.isPay" style="width:150px;" @change="getReservation">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="未支付" value="0"></el-option>
                                <el-option label="已支付" value="1"></el-option>
                            </el-select>
                        </el-form-item>-->
                    </el-col>
                    <el-dropdown @command="handleCommand" class="right">
                        <el-button type="primary">
                            批量操作
                            <i class="el-icon-caret-bottom el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="export">导出表格</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="reservation" highlight-current-row @row-click="rowClick">
                <el-table-column prop="teacherName" label="教练">
                </el-table-column>
                <el-table-column prop="studentPhone" label="学员电话">
                </el-table-column>
                <el-table-column prop="studentName" label="学员">
                </el-table-column>
                <el-table-column prop="appointmentTime" label="预约时间" width="220">
                </el-table-column>
                <el-table-column prop="realityDeduct" label="预约扣除">
                </el-table-column>
                <el-table-column prop="stageName" label="科目">
                </el-table-column>
                <el-table-column prop="currentState" label="当前状态" :formatter="formatter">
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button v-if="scope.row.currentState===1" type="text" size="small" @click.stop="handleOperation(scope.row.appointmentId,'cancel')">取消预约</el-button>
                        <el-button v-if="scope.row.currentState===4" type="text" size="small" @click.stop="handleOperation(scope.row.appointmentId,'appraisal')">帮TA评价</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--工具条-->
            <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="recording.pageSize" :total="recording.total">
            </el-pagination>
        </el-row>
        <el-dialog title="预约详情" v-model="reservationFormVisible" :close-on-click-modal="false" size="full" @close="handleDialogClose">
            <p class="group-title">预约信息</p>
            <el-row class="reservation" v-model="reservationData">
                <el-col :span="4">
                    <div class="col">
                        <p>学员</p>
                        <p>{{reservationData.studentName}}</p>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="col">
                        <p>预约</p>
                        <p>{{reservationData.appointmentTime}}</p>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="col">
                        <p>部分</p>
                        <p>{{reservationData.stageName}}</p>
                    </div>
                </el-col>
                <el-col :span="5">
                    <div class="col">
                        <p>教练</p>
                        <p>{{reservationData.teacherName}}</p>
                    </div>
                </el-col>
                <el-col :span="5">
                    <div class="col">
                        <p>扣除</p>
                        <p>{{reservationData.realityDeduct}}</p>
                    </div>
                </el-col>
                <el-col :span="24" class="t-right">
                    <span>预约时间：{{reservationData.appointmentDate}}</span>
                    <span>评价时间：{{reservationData.evaluateTime}}</span>
                </el-col>
            </el-row>
            <p class="group-title">评价信息</p>
            <div v-if="reservationData.currentState===1||reservationData.currentState===2">
                <p class="reservation-ing">尚未完成培训,无评价信息</p>
            </div>
            <div v-if="reservationData.currentState===3">
                <p class="reservation-ing">尚未完成支付,不能评价</p>
            </div>
            <div v-if="reservationData.currentState===5" class="basic mt0 pt0 hasReservation">
                <el-row>
                    <el-col :span="2">
                        综合评星
                    </el-col>
                    <el-col :span="20">
                        <el-rate disabled v-model="reservationData.score"></el-rate>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2">
                        评价内容
                    </el-col>
                    <el-col :span="20">
                        <el-input type="textarea" auto-complete="off" v-model="reservationData.comments" readonly :autosize="true" resize="none"></el-input>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2">
                        教练印象
                    </el-col>
                    <el-col :span="20">
                        <el-tag v-for="impression in reservationData.evaluateList.split('|')" type="primary">{{impression}}</el-tag>
                    </el-col>
                </el-row>
            </div>
            <div v-if="reservationData.currentState===4" class="basic mt0 pt0 trained">
                <el-form v-model="appraisal">
                    <el-row>
                        <el-col :span="2">
                            <span class="rate_validate_class">
                                综合评星
                            </span>
                        </el-col>
                        <el-col :span="20">
                            <el-rate v-model="appraisal.score" @change="handleRateChange"></el-rate>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="2">
                            <span class="ml15">评价内容</span>
                        </el-col>
                        <el-col :span="20">
                            <el-input type="textarea" auto-complete="off" v-model="appraisal.comments" :rows="4" resize="none"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="2">
                            <span class="ml15">教练印象</span>
                        </el-col>
                        <el-col :span="20">
                            <el-checkbox-group v-model="appraisal.impressionTags">
                                <el-checkbox v-for="impression in impressionTags" :label="impression">{{impression}}</el-checkbox>
                            </el-checkbox-group>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="2">
                            <span class="ml15">匿名评价</span>
                        </el-col>
                        <el-col :span="20">
                            <el-switch v-model="appraisal.isNickName" on-color="#13ce66" off-color="#999"></el-switch>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer" v-if="reservationData.currentState===4">
                <el-button @click.native="reservationFormVisible = false" size="large">取消</el-button>
                <el-button type="primary" size="large" @click="handleSave">保存</el-button>
            </div>
            <div slot="footer" class="dialog-footer" v-else>
                <el-button type="primary" size="large" @click="reservationFormVisible = false">关闭</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<style lang="scss">
.reservation {
    background: #eee;
    padding: 30px;
    padding-bottom: 5px;
    .col {
        >p {
            text-align: center;
            line-height: 30px;
        }
    }
    span {
        color: #999;
        line-height: 45px;
        &:first-child {
            margin-right: 20px;
        }
    }
}

.reservation-ing {
    background: #eee;
    padding: 100px;
    font-size: 1.5em;
    text-align: center;
}

.hasReservation,
.trained {
    .rate_validate_class:before {
        content: "*";
        color: #ff4949;
        margin-right: 4px;
    }
    .el-tag {
        padding: 0 10px;
        height: 28px;
        line-height: 26px;
        margin: 0 5px;
    }
    .el-input--mini {
        width: 80px;
    }
    .el-checkbox {
        color: #FFF;
        background: #999;
        border-radius: 4px;
        padding: 5px 10px;
        .el-checkbox__input.is-checked .el-checkbox__inner {
            width: 18px;
        }
        .el-checkbox__inner {
            background-color: transparent;
            display: inline-block;
            position: relative;
            box-sizing: border-box;
            border: 0;
            width: 0px;
            height: 15px;
            z-index: 1;
        }
        .el-checkbox__label {
            font-size: 13px;
            padding-left: 0;
            font-family: SimSun;
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
            filters: {
                keyword: "",
                dateRange: [],
                isEvaluate: "",
                isPay: ""
            },
            recording: {
                total: 0,
                page: 1,
                pageSize: global.pageSize
            },
            userId: JSON.parse(sessionStorage.getItem("user")).userId,
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            reservation: [],
            status: "已培训",
            reservationFormVisible: false,
            reservationData: {
                schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                studentId: 0,
                studentName: "",
                studentIdNumber: "",
                evaObjectType: 1,
                evaObjectId: 3,
                score: 0,
                stage: 0,
                evaluateList: "",
                comments: "",
                appointmentId: 0,
                isNickName: false
            },
            impressionTags: [],
            appraisal: {
                score: 0,
                comments: "",
                impressionTags: [],
                isNickName: false
            },
            options: [{
                value: '培训中',
                label: '培训中'
            }, {
                value: '已评价',
                label: '已评价'
            }, {
                value: '未开始',
                label: '未开始'
            }, {
                value: '已培训',
                label: '已培训'
            }],
            pageLoading: false
        }
    },
    methods: {
        //数据格式化转换
        formatter(row, column) {
            if (column.property === "currentState") {
                return global.enums.recordingStatus[row.currentState];
            }
        },
        //查询预约记录
        getReservation() {
            let beginDate = "";
            let endDate = "";
            this.pageLoading = true;
            let daterange = this.filters.dateRange;
            if (daterange.length > 0) {
                beginDate = new Date(daterange[0]).Format("yyyy-MM-dd") + " 00:00:00";
                endDate = new Date(daterange[1]).Format("yyyy-MM-dd") + " 23:59:59";
            }
            let para = [this.filters.keyword, this.schoolCode, this.recording.page, this.recording.pageSize, beginDate, endDate, this.filters.isEvaluate, this.filters.isPay];
            global.printLog(para);
            //return;
            setTimeout(() => {
                request.appointment.query.recording(para).then((res) => {
                    if (res.success) {
                        this.pageLoading = false;
                        this.reservation = res.object.list;
                        this.recording.total = res.object.num;
                    }
                });
            }, 1000);
        },
        //查询预约记录详情
        getReservationDetail(appointmentId) {
            request.appointment.query.detail(appointmentId).then((res) => {
                if (res.success) {
                    let data = res.object;
                    global.printLog(data);
                    this.reservationData = data;
                    this.reservationFormVisible = true;
                }
                else {
                    this.$message.error("查询失败！原因：" + res.message);
                }
            });
        },
        //操作（详情/评价/取消预约）
        handleOperation(appointmentId, type) {
            if (type === "cancel") {
                this.$confirm("您正在执行取消预约操作, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnClickModal: false,
                    type: "warning"
                }).then(() => {
                    let para = {
                        appointmentId: appointmentId,
                        cancelUserId: this.userId,
                        cancelUserType: 30
                    }
                    request.appointment.cancel(para).then((res) => {
                        if (res.success) {
                            this.getReservation();
                            this.$message.success({ message: "操作成功！" });
                        }
                        else {
                            this.$message.error("操作失败！原因：" + res.message);
                        }
                    });
                }).catch(() => { });
            }
            else {
                this.getReservationDetail(appointmentId);
                this.reservationFormVisible = true;
            }
        },
        //提交评价
        handleSave() {
            if (this.appraisal.score < 1) {
                this.$message.warning({ message: "提交评价前请先打分" });
                return;
            }
            else if (this.appraisal.comments.length > 200) {
                this.$message.warning({ message: "评论内容字数不能超过200" });
                return;
            }
            let para = {
                schoolCode: this.schoolCode,
                studentId: this.reservationData.studentId,
                studentName: this.reservationData.studentName,
                studentIdNumber: this.reservationData.cardNo,
                evaObjectType: 1,//1：教练员；2.培训机构
                evaObjectId: this.reservationData.teacherId,
                score: this.appraisal.score,
                stage: this.reservationData.stage,
                evaluateList: this.appraisal.impressionTags.join("|"),
                comments: this.appraisal.comments,
                appointmentId: this.reservationData.appointmentId,
                isNickName: this.appraisal.isNickName
            }
            request.appointment.create.addBaseEvaluate(para).then((res) => {
                if (res.success) {
                    this.getReservation();
                    this.reservationFormVisible = false;
                    this.appraisal = {
                        score: 0,
                        comments: "",
                        impressionTags: [],
                        isNickName: false
                    }
                    this.$message.success({ message: "评价成功！" });
                }
                else {
                    this.$message.error("评价失败！原因：" + res.message);
                }
            });
        },
        //行点击
        rowClick: function (row, evt, column) {
            if (column.type === "default") {
                this.getReservationDetail(row.appointmentId);
            }
        },
        //预约记录翻页
        handleCurrentChange(val) {
            this.recording.page = val;
            this.getReservation();
        },
        //打星获取标签
        handleRateChange(val) {
            if (val === 0) { return; }
            if (val < 3) {
                this.impressionTags = global.enums.impression.difference;
            }
            else if (val < 4) {
                this.impressionTags = global.enums.impression.good;
            }
            else {
                this.impressionTags = global.enums.impression.excellent;
            }
        },
        //导出操作
        handleCommand(command) {
            if (command === "export") {
                let downLink = document.getElementById("down-link");
                downLink.setAttribute("href", sessionStorage.getItem("baseUrl") + "/appointmentrecord/exportAppointmentRecord?keyWord=" + this.filters.keyword + "&schoolCode=" + this.schoolCode);
                downLink.click();
            }
        },
        handleDialogClose() {
            this.appraisal.score = 0;
            this.appraisal.comments = "";
            this.impressionTags = [];
            this.appraisal.isNickName = false;
            this.appraisal.impressionTags = [];
        },
        handleDateRangeChange(daterange) {
            this.filters.dateRange = [];
            if (daterange.length > 0) {
                this.filters.dateRange.push(daterange.split(" - ")[0]);
                this.filters.dateRange.push(daterange.split(" - ")[1]);
            }
            this.getReservation();
        }
    },
    activated() {
        global.printLog("activated every one");
        this.getReservation();
    },
    mounted() {
    }
}

</script>