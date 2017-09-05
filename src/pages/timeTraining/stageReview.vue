<template>
    <section v-loading="pageLoading">
        <el-row class="mb20">
            <el-col :span="20">
                <el-radio-group v-model="stageType" @change="stageTypeChange">
                    <el-radio-button label="考核员签名"></el-radio-button>
                    <el-radio-button label="学员签名"></el-radio-button>
                    <el-radio-button label="教练签名"></el-radio-button>
                    <el-radio-button label="驾校签章"></el-radio-button>
                    <el-radio-button label="上报审核"></el-radio-button>
                    <el-radio-button label="审核结果查询"></el-radio-button>
                </el-radio-group>
            </el-col>
        </el-row>
        <el-row v-show="stageType==='考核员签名'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-form :inline="true">
                    <el-form-item>
                        <el-select placeholder="选择阶段" v-model="pendingReportRecord.filter.stage" @change="stageChange" style="width:150px;">
                            <el-option label="科目一" value="1"></el-option>
                            <el-option label="科目二" value="2"></el-option>
                            <el-option label="科目三" value="3"></el-option>
                            <el-option label="科目四" value="4"></el-option>
                        </el-select>
                        <el-input v-model="pendingReportRecord.filter.keyword" class="search-input ml15" placeholder="学员姓名" icon="search" :on-icon-click="queryPendingReportRecordList"></el-input>
                    </el-form-item>
                    <el-form-item class="right">
                        <el-button type="primary" @click="handleOpenWin" :disabled="pendingReportRecord.create.form.stageHourIds.length>0?false:true">考核员签名</el-button>
                    </el-form-item>
                </el-form>
                <!--列表-->
                <el-table :data="pendingReportRecord.data" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="35" :selectable="handleSelecTableChange">
                    </el-table-column>
                    <el-table-column prop="studentName" label="学员">
                    </el-table-column>
                    <el-table-column prop="carTypeName" label="车型">
                    </el-table-column>
                    <el-table-column prop="needfulTime" label="补学学时/分" width="110">
                    </el-table-column>
                    <el-table-column prop="needStudy" label="大纲要求/分" width="110">
                    </el-table-column>
                    <el-table-column prop="totalTime" label="培训学时/分" width="110">
                    </el-table-column>
                    <el-table-column prop="pendingReportTime" label="有效学时/分" width="110">
                        <template scope="scope">
                            {{scope.row.pendingReportTime}}
                            <span style="color:#1D8CE0;" v-if="scope.row.needfulTime>0">(补学)</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="mileage" label="里程/公里" :formatter="formatter" width="110">
                    </el-table-column>
                    <el-table-column label="备注" width="150">
                        <template scope="scope">
                            <el-tag v-if="scope.row.signStatus!=='pending'" type="danger">
                                {{scope.row.signStatus==='invalid_total'?'有效学时没有达到':scope.row.signStatus==='invalid_vehicle'?'实操学时没有达到':'课堂学时没有达到'}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="text" size="small" @click.stop="queryStageTrainRecord(scope.row)">培训记录表</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row v-show="stageType==='学员签名'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-form :inline="true">
                    <el-form-item>
                        <el-select placeholder="选择阶段" v-model="stageRecordList.student.filter.stage" @change="stageChange" style="width:150px;">
                            <el-option label="科目一" value="1"></el-option>
                            <el-option label="科目二" value="2"></el-option>
                            <el-option label="科目三" value="3"></el-option>
                            <el-option label="科目四" value="4"></el-option>
                        </el-select>
                        <el-input v-model="stageRecordList.student.filter.keyword" class="search-input ml15" placeholder="学员姓名" icon="search" :on-icon-click="stageChange"></el-input>
                    </el-form-item>
                    <el-form-item class="right">
                        <el-button type="primary" :disabled="stageRecordList.student.createForm.stageRecordIds.length>0?false:true" @click="create">学员签名</el-button>
                    </el-form-item>
                </el-form>
                <!--列表-->
                <el-table :data="stageRecordList.data" highlight-current-row @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="35">
                    </el-table-column>
                    <el-table-column prop="studentName" label="学员">
                    </el-table-column>
                    <!--<el-table-column prop="carTypeName" label="车型">
                    </el-table-column>-->
                    <el-table-column prop="duration" label="本次上报学时">
                    </el-table-column>
                    <el-table-column prop="classTime" label="理论学时">
                    </el-table-column>
                    <el-table-column prop="simulatorTime" label="模拟学时">
                    </el-table-column>
                    <el-table-column prop="vehicleTime" label="实车学时">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="text" size="small" @click.stop="queryStageTrainRecord(scope.row)">培训记录表</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row v-show="stageType==='教练签名'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-form :inline="true">
                    <el-form-item>
                        <el-select placeholder="选择阶段" v-model="stageRecordList.teacher.filter.stage" @change="stageChange" style="width:150px;">
                            <el-option label="科目一" value="1"></el-option>
                            <el-option label="科目二" value="2"></el-option>
                            <el-option label="科目三" value="3"></el-option>
                            <el-option label="科目四" value="4"></el-option>
                        </el-select>
                        <el-input v-model="stageRecordList.teacher.filter.keyword" class="search-input ml15" placeholder="学员姓名" icon="search" :on-icon-click="stageChange"></el-input>
                    </el-form-item>
                    <el-form-item class="right">
                        <el-button type="primary" :disabled="stageRecordList.teacher.createForm.stageRecordIds.length>0?false:true" @click="create">教练签名</el-button>
                    </el-form-item>
                </el-form>
                <!--列表-->
                <el-table :data="stageRecordList.data" highlight-current-row @selection-change="handleSelectionChange" @row-click="handleRowClick">
                    <el-table-column type="selection" width="35">
                    </el-table-column>
                    <el-table-column prop="studentName" label="学员">
                    </el-table-column>
                    <!--<el-table-column prop="carTypeName" label="车型">
                    </el-table-column>-->
                    <el-table-column prop="duration" label="本次上报学时">
                    </el-table-column>
                    <el-table-column prop="classTime" label="理论学时">
                    </el-table-column>
                    <el-table-column prop="simulatorTime" label="模拟学时">
                    </el-table-column>
                    <el-table-column prop="vehicleTime" label="实车学时">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="text" size="small" @click.stop="queryStageTrainRecord(scope.row)">培训记录表</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row v-show="stageType==='驾校签章'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-form :inline="true">
                    <el-form-item>
                        <el-select placeholder="选择阶段" v-model="stageRecordList.school.filter.stage" @change="stageChange" style="width:150px;">
                            <el-option label="科目一" value="1"></el-option>
                            <el-option label="科目二" value="2"></el-option>
                            <el-option label="科目三" value="3"></el-option>
                            <el-option label="科目四" value="4"></el-option>
                        </el-select>
                        <el-input v-model="stageRecordList.school.filter.keyword" class="search-input ml15" placeholder="学员姓名" icon="search" :on-icon-click="stageChange"></el-input>
                    </el-form-item>
                    <el-form-item class="right">
                        <el-button type="primary" :disabled="stageRecordList.school.signData.length>0?false:true" @click="create">驾校签章</el-button>
                    </el-form-item>
                </el-form>
                <!--列表-->
                <el-table :data="stageRecordList.data" highlight-current-row @selection-change="handleSelectionChange" @row-click="handleRowClick">
                    <el-table-column type="selection" width="35">
                    </el-table-column>
                    <el-table-column prop="studentName" label="学员">
                    </el-table-column>
                    <!--<el-table-column prop="carTypeName" label="车型">
                    </el-table-column>-->
                    <el-table-column prop="duration" label="本次上报学时">
                    </el-table-column>
                    <el-table-column prop="classTime" label="理论学时">
                    </el-table-column>
                    <el-table-column prop="simulatorTime" label="模拟学时">
                    </el-table-column>
                    <el-table-column prop="vehicleTime" label="实车学时">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="text" size="small" @click.stop="queryStageTrainRecord(scope.row)">培训记录表</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row v-show="stageType==='上报审核'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-form :inline="true">
                    <el-form-item>
                        <el-select placeholder="选择阶段" v-model="stageRecordList.stagePerform.filter.stage" @change="stageChange" style="width:150px;">
                            <el-option label="科目一" value="1"></el-option>
                            <el-option label="科目二" value="2"></el-option>
                            <el-option label="科目三" value="3"></el-option>
                            <el-option label="科目四" value="4"></el-option>
                        </el-select>
                        <el-input v-model="stageRecordList.stagePerform.filter.keyword" class="search-input ml15" placeholder="学员姓名" icon="search" :on-icon-click="stageChange"></el-input>
                    </el-form-item>
                    <el-form-item class="right">
                        <el-button type="primary" :disabled="stageRecordList.stagePerform.createForm.stageRecordIds.length>0?false:true" @click="create">上报并审核</el-button>
                    </el-form-item>
                </el-form>
                <!--列表-->
                <el-table :data="stageRecordList.data" highlight-current-row @selection-change="handleSelectionChange" @row-click="handleRowClick">
                    <el-table-column type="selection" width="35">
                    </el-table-column>
                    <el-table-column prop="studentName" label="学员">
                    </el-table-column>
                    <!--<el-table-column prop="carTypeName" label="车型">
                    </el-table-column>-->
                    <el-table-column prop="duration" label="本次上报学时">
                    </el-table-column>
                    <el-table-column prop="classTime" label="理论学时">
                    </el-table-column>
                    <el-table-column prop="simulatorTime" label="模拟学时">
                    </el-table-column>
                    <el-table-column prop="vehicleTime" label="实车学时">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="text" size="small" @click.stop="queryStageTrainRecord(scope.row)">培训记录表</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row v-show="stageType==='审核结果查询'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-form :inline="true">
                    <el-form-item>
                        <el-select placeholder="选择阶段" v-model="reportedRecordList.filter.stage" @change="stageChange" style="width:150px;">
                            <el-option label="科目一" value="1"></el-option>
                            <el-option label="科目二" value="2"></el-option>
                            <el-option label="科目三" value="3"></el-option>
                            <el-option label="科目四" value="4"></el-option>
                        </el-select>
                        <el-input v-model="reportedRecordList.filter.keyword" class="search-input ml15" placeholder="学员姓名" icon="search" :on-icon-click="stageChange"></el-input>
                    </el-form-item>
                </el-form>
                <!--列表-->
                <el-table :data="reportedRecordList.data" highlight-current-row @row-click="handleRowClick">
                    <el-table-column width="35">
                    </el-table-column>
                    <el-table-column prop="studentName" label="学员">
                    </el-table-column>
                    <!--<el-table-column prop="carTypeName" label="车型">
                    </el-table-column>-->
                    <el-table-column prop="duration" label="本次上报学时">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="上报时间">
                    </el-table-column>
                    <el-table-column prop="checkState" label="审核状态">
                    </el-table-column>
                    <el-table-column prop="needfulTime" label="补学学时">
                    </el-table-column>
                    <el-table-column prop="totalInvalidTime" label="不合格学时">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <!--<el-button type="text" size="small" @click.stop="stageChange">培训记录表</el-button>-->
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-dialog title="选择考核员" v-model="examiner.dialogVisible" size="tiny" :close-on-click-modal="false">
            <el-form :model="pendingReportRecord.create.form" ref="createForm" label-width="100px" :rules="pendingReportRecord.create.rules" class="mt20">
                <el-form-item prop="examinerId" label="考核员">
                    <el-select v-model="pendingReportRecord.create.form.examinerId" placeholder="请选择考核员" ref="examiner_sel">
                        <el-option v-for="item in examiner.data" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="examiner.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="create" :loading="btnLoading">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="系统提示" v-model="dialogVisible" size="tiny" class="results-form" :close-on-click-modal="false">
            <el-row class="mt15" v-if="stageRecordList.results.successData.length">
                <ul>
                    <li class="title">成功
                        <span class="success">{{stageRecordList.results.successData.length}}</span>条数据</li>
                    <li>
                        <ul>
                            <li v-for="item in stageRecordList.results.successData">
                                {{item}}
                            </li>
                        </ul>
                    </li>
                </ul>
            </el-row>
            <el-row class="mt15" v-if="stageRecordList.results.failData.length">
                <ul>
                    <li class="title">失败
                        <span class="danger">{{stageRecordList.results.failData.length}}</span>条数据</li>
                    <li>
                        <ul>
                            <li v-for="item in stageRecordList.results.failData">
                                {{item}}
                            </li>
                        </ul>
                    </li>
                </ul>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">知道了</el-button>
            </div>
        </el-dialog>
        <object id="ocx" classid="CLSID:4E194A99-7F41-453E-914C-544BB186A59C" codebase="../../assets/cab/signocx.cab#version=1.0.0.3" width="100" height="50" class="hide"></object>
    </section>
</template>

<script>
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        return {
            pageLoading: false,
            btnLoading: false,
            stageType: "考核员签名",
            examiner: {
                data: [],
                dialogVisible: false
            },
            pendingReportRecord: {
                data: [],
                filter: {
                    stage: "1",
                    keyword: ""
                },
                create: {
                    rules: {
                        examinerId: [
                            { type: "number", required: true, message: "请选择考核员", trigger: "change" }
                        ]
                    },
                    form: {
                        schoolCode: "",
                        examinerId: "",
                        examinerName: "",
                        stageHourIds: []
                    }
                }
            },
            stageRecordList: {
                data: [],
                student: {
                    data: [],
                    filter: {
                        stage: "1",
                        keyword: ""
                    },
                    createForm: {
                        stageRecordIds: []
                    }
                },
                teacher: {
                    data: [],
                    filter: {
                        stage: "1",
                        keyword: ""
                    },
                    createForm: {
                        stageRecordIds: []
                    }
                },
                school: {
                    data: [],
                    filter: {
                        stage: "1",
                        keyword: ""
                    },
                    signData: [],
                    createForm: {
                        schoolSignItems: [{
                            stageRecordId: "",
                            esignature: ""
                        }],
                        signBase64: ""
                    }
                },
                stagePerform: {
                    data: [],
                    filter: {
                        stage: "1",
                        keyword: "",
                    },
                    createForm: {
                        stageRecordIds: []
                    }
                },
                results: {
                    successData: [],
                    failData: []
                },
                disabled: false,
                processState: 10
            },
            reportedRecordList: {
                data: [],
                filter: {
                    stage: "1",
                    keyword: ""
                }
            },
            dialogVisible: false,
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode
        }
    },
    methods: {
        formatter(row, column) {
            if (column.property === "mileage") {
                return (row.mileage / 1000).toFixed(2);
            }
        },
        queryExaminer() {
            request.basic.examiner.query.list([this.schoolCode, 1, 10000, ""]).then((res) => {
                if (res.success) {
                    this.examiner.data = [];
                    let data = res.object.list;
                    for (let item in data) {
                        this.examiner.data.push({
                            value: data[item].examinerId,
                            label: data[item].examinerName
                        });
                    }
                }
            });
        },
        queryPendingReportRecordList() {
            this.pageLoading = true;
            let para = [this.schoolCode, this.pendingReportRecord.filter.stage, this.pendingReportRecord.filter.keyword];
            setTimeout(() => {
                request.timeTraining.stageRecordAudit.query.pendingReportRecordList(para).then((res) => {
                    if (res.success) {
                        let data = res.object;
                        global.printLog(data);
                        // this.pendingReportRecord.data = [];
                        // for (let item in data) {
                        //     this.pendingReportRecord.data.push({
                        //         studentName: data[item].studentName,
                        //         carTypeName: data[item].carTypeName,
                        //         needfulTime: data[item].needfulTime,
                        //         needStudy: data[item].needStudy,
                        //         totalTime: data[item].totalTime,
                        //         pendingReportTime: data[item].pendingReportTime,
                        //         mileage: data[item].mileage,
                        //         signStatus: data[item].signStatus
                        //     })
                        // }
                        this.pendingReportRecord.data = data;
                    }
                    this.pageLoading = false;
                });
            }, 1000);
        },
        queryStageRecordList(stage, keyword) {
            this.pageLoading = true;
            let para = [this.schoolCode, stage, this.stageRecordList.processState, keyword];
            global.printLog(para);
            setTimeout(() => {
                request.timeTraining.stageRecordAudit.query.stageRecordList(para).then((res) => {
                    if (res.success) {
                        let data = res.object;
                        global.printLog(data);
                        // this.stageRecordList.data = [];
                        // for (let item in data) {
                        //     this.stageRecordList.data.push({
                        //         studentName: data[item].studentName,
                        //         carTypeName: data[item].carTypeName,
                        //         duration: data[item].duration,
                        //         classTime: data[item].classTime,
                        //         simulatorTime: data[item].simulatorTime,
                        //         vehicleTime: data[item].vehicleTime
                        //     });
                        // }
                        this.stageRecordList.data = data;
                    }
                    this.pageLoading = false;
                });
            }, 1000);
        },
        queryReportedRecordList() {
            this.pageLoading = true;
            let para = [this.schoolCode, this.reportedRecordList.filter.stage, this.reportedRecordList.filter.keyword];
            setTimeout(() => {
                request.timeTraining.stageRecordAudit.query.reportedRecordList(para).then((res) => {
                    if (res.success) {
                        let data = res.object.list;
                        this.reportedRecordList.data = [];
                        for (let item in data) {
                            this.reportedRecordList.data.push({
                                studentName: data[item].studentName,
                                carTypeName: data[item].carTypeName,
                                duration: data[item].duration,
                                gmtCreate: data[item].gmtCreate,
                                checkState: data[item].checkState,
                                needfulTime: data[item].needfulTime,
                                totalInvalidTime: data[item].totalInvalidTime
                            });
                        }
                        this.pageLoading = false;
                    }
                });
            }, 1000);
        },
        queryStageTrainRecord(row) {
            let stuId = row.studentId;
            request.basic.student.query.stageTrainRecord([stuId, 1, 1]).then((res) => {
                if (res.success) {
                    let data = res.object;
                    if (data.stagePdf === null) {
                        this.$message.error("PDF地址不存在");
                    }
                    else {
                        window.open(data.stagePdf.pdfUrl, "培训记录表");
                    }
                }
            });
        },
        create() {
            if (this.stageType === "考核员签名") {
                this.$refs["createForm"].validate((valid) => {
                    if (valid) {
                        this.btnLoading = true;
                        this.stageRecordList.results.failData = [];
                        this.stageRecordList.results.successData = [];
                        this.pendingReportRecord.create.form.schoolCode = this.schoolCode;
                        this.pendingReportRecord.create.form.examinerName = this.$refs.examiner_sel.selectedLabel;
                        let objs = Object.assign({}, this.pendingReportRecord.create.form);
                        request.timeTraining.stageRecordAudit.create.examinerSign(objs).then((res) => {
                            if (res.success) {
                                global.printLog(res);
                                let data = res.object;
                                for (let item in data) {
                                    if (data[item].signSuccess === 0) {
                                        this.stageRecordList.results.failData.push(data[item].signMessage);
                                    }
                                    else if (data[item].signSuccess === 1) {
                                        this.stageRecordList.results.successData.push(data[item].signMessage);
                                    }
                                }
                                this.btnLoading = this.examiner.dialogVisible = false;
                                this.queryPendingReportRecordList();
                                this.$refs["createForm"].resetFields();
                                setTimeout(() => {
                                    this.dialogVisible = true;
                                }, 300);
                                //this.$message.success({ message: "考核员签名成功" });
                            }
                            else {
                                this.$message.success({ message: "考核员签名失败" });
                            }
                        });
                    }
                });
            }
            else {
                this.$confirm("确认执行签名操作吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnPressEscape: false,
                    closeOnClickModal: false,
                    type: "warning",
                    beforeClose: (action, instance, done) => {
                        if (action === "confirm") {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = "执行中...";
                            this.stageRecordList.results.failData = [];
                            this.stageRecordList.results.successData = [];
                            if (this.stageType === "学员签名") {
                                let objs = Object.assign({}, this.stageRecordList.student.createForm);
                                request.timeTraining.stageRecordAudit.create.studentSign(objs).then((res) => {
                                    if (res.success) {
                                        let data = res.object;
                                        for (let item in data) {
                                            if (data[item].signSuccess === 0) {
                                                this.stageRecordList.results.failData.push(data[item].signMessage);
                                            }
                                            else if (data[item].signSuccess === 1) {
                                                this.stageRecordList.results.successData.push(data[item].signMessage);
                                            }
                                        }
                                        done();
                                        this.stageChange();
                                        instance.confirmButtonLoading = false;
                                        setTimeout(() => {
                                            this.dialogVisible = true;
                                        }, 300);
                                        //this.$message.success({ message: "学员签名成功" });
                                    }
                                });
                            }
                            else if (this.stageType === "教练签名") {
                                let objs = Object.assign({}, this.stageRecordList.teacher.createForm);
                                request.timeTraining.stageRecordAudit.create.teacherSign(objs).then((res) => {
                                    if (res.success) {
                                        let data = res.object;
                                        for (let item in data) {
                                            if (data[item].signSuccess === 0) {
                                                this.stageRecordList.results.failData.push(data[item].signMessage);
                                            }
                                            else if (data[item].signSuccess === 1) {
                                                this.stageRecordList.results.successData.push(data[item].signMessage);
                                            }
                                        }
                                        done();
                                        this.stageChange();
                                        instance.confirmButtonLoading = false;
                                        setTimeout(() => {
                                            this.dialogVisible = true;
                                        }, 300);
                                        //this.$message.success({ message: "教练签名成功" });
                                    }
                                });
                            }
                            else if (this.stageType === "驾校签章") {
                                let that = this;
                                setTimeout(() => {
                                    this.stageRecordList.school.createForm.schoolSignItems = [];
                                    global.readSignatureData((data) => {
                                        initData(this.stageRecordList.school.signData, data);
                                    });
                                }, 500);
                                function initData(signData, base64Data) {
                                    for (let item in signData) {
                                        let checkCondition = {};
                                        let stageRecordId = signData[item].stageRecordId;
                                        checkCondition["classtime"] = parseInt(signData[item].classTime);
                                        checkCondition["duration"] = parseInt(signData[item].duration);
                                        checkCondition["examresult"] = parseInt(signData[item].examResult);
                                        checkCondition["inscode"] = signData[item].schoolUnifyCode;
                                        checkCondition["mileage"] = parseInt(signData[item].mileage);
                                        checkCondition["networktime"] = parseInt(signData[item].networkTime);
                                        var recarray = signData[item].recarray.split(",");
                                        var recarrayJsonArray = [];
                                        for (var j = 0; j < recarray.length; j++) {
                                            var recarrayCondition = {};
                                            recarrayCondition["rnum"] = recarray[j];
                                            recarrayJsonArray.push(recarrayCondition);
                                        }
                                        checkCondition["recarray"] = recarrayJsonArray;
                                        checkCondition["rectype"] = parseInt(signData[item].rectype);
                                        checkCondition["simulatortime"] = parseInt(signData[item].simulatorTime);
                                        checkCondition["stunum"] = signData[item].studentUnifyCode;
                                        checkCondition["subject"] = parseInt(signData[item].stage);
                                        checkCondition["totaltime"] = parseInt(signData[item].totalTime);
                                        checkCondition["vehicletime"] = parseInt(signData[item].vehicleTime);
                                        global.initSignatureData(checkCondition, (data) => {
                                            that.stageRecordList.school.createForm.schoolSignItems.push({
                                                stageRecordId: stageRecordId,
                                                esignature: data
                                            });
                                        });
                                    }
                                    that.stageRecordList.school.createForm.signBase64 = base64Data;
                                    let objs = that.stageRecordList.school.createForm;
                                    //global.printLog(that.stageRecordList.school.createForm);
                                    //global.printLog(JSON.stringify(that.stageRecordList.school.createForm));
                                    //return;
                                    request.timeTraining.stageRecordAudit.create.schoolSign(objs).then((res) => {
                                        global.printLog(res);
                                        if (res.success) {
                                            let data = res.object;
                                            for (let item in data) {
                                                if (data[item].signSuccess === 0) {
                                                    that.stageRecordList.results.failData.push(data[item].signMessage);
                                                }
                                                else if (data[item].signSuccess === 1) {
                                                    that.stageRecordList.results.successData.push(data[item].signMessage);
                                                }
                                            }
                                            done();
                                            that.stageChange();
                                            instance.confirmButtonLoading = false;
                                            setTimeout(() => {
                                                that.dialogVisible = true;
                                            }, 300);
                                            //this.$message.success({ message: "驾校签章成功" });
                                        }
                                    });
                                }
                            }
                            else if (this.stageType === "上报审核") {
                                let objs = Object.assign({}, this.stageRecordList.stagePerform.createForm);
                                request.timeTraining.stageRecordAudit.create.stagePerform(objs).then((res) => {
                                    if (res.success) {
                                        let data = res.object;
                                        for (let item in data) {
                                            if (data[item].signSuccess === 0) {
                                                this.stageRecordList.results.failData.push(data[item].signMessage);
                                            }
                                            else if (data[item].signSuccess === 1) {
                                                this.stageRecordList.results.successData.push(data[item].signMessage);
                                            }
                                        }
                                        done();
                                        this.stageChange();
                                        instance.confirmButtonLoading = false;
                                        setTimeout(() => {
                                            this.dialogVisible = true;
                                        }, 300);
                                        //this.$message.success({ message: "上报审核成功" });
                                    }
                                });
                            }
                        } else {
                            done();
                        }
                    }
                }).then(() => {
                }).catch(() => { });
            }
        },
        stageChange() {
            if (this.stageType === "考核员签名") {
                this.queryPendingReportRecordList();
            }
            else if (this.stageType === "审核结果查询") {
                this.queryReportedRecordList();
            }
            else {
                let stage = "";
                let keyword = "";
                if (this.stageType === "学员签名") {
                    this.stageRecordList.processState = 10;
                    stage = this.stageRecordList.student.filter.stage;
                    keyword = this.stageRecordList.student.filter.keyword;
                }
                else if (this.stageType === "教练签名") {
                    this.stageRecordList.processState = 20;
                    stage = this.stageRecordList.teacher.filter.stage;
                    keyword = this.stageRecordList.teacher.filter.keyword;
                }
                else if (this.stageType === "驾校签章") {
                    this.stageRecordList.processState = 30;
                    stage = this.stageRecordList.school.filter.stage;
                    keyword = this.stageRecordList.school.filter.keyword;
                }
                else if (this.stageType === "上报审核") {
                    this.stageRecordList.processState = 40;
                    stage = this.stageRecordList.stagePerform.filter.stage;
                    keyword = this.stageRecordList.stagePerform.filter.keyword;
                }
                this.queryStageRecordList(stage, keyword);
            }
        },
        stageTypeChange(val) {
            this.stageType = val;
            this.stageRecordList.school.signData = [];
            this.pendingReportRecord.create.form.stageHourIds = [];
            this.stageRecordList.student.createForm.stageRecordIds = [];
            this.stageRecordList.teacher.createForm.stageRecordIds = [];
            this.stageRecordList.stagePerform.createForm.stageRecordIds = [];
            this.stageChange();
        },
        handleOpenWin() {
            this.queryExaminer();
            this.examiner.dialogVisible = true;
        },
        handleRowClick(row, evt, column) {
            if (column.type === "default") {
                global.printLog(column.type);
            }
        },
        handleSelecTableChange(row) {
            if (this.stageType === "考核员签名") {
                if (row.signStatus === "pending") {
                    return true;
                }
                return false;
            }
            return true;
        },
        handleSelectionChange(data) {
            if (this.stageType === "学员签名") {
                this.stageRecordList.student.createForm.stageRecordIds = loop(data, this);
            }
            else if (this.stageType === "教练签名") {
                this.stageRecordList.teacher.createForm.stageRecordIds = loop(data, this);
            }
            else if (this.stageType === "驾校签章") {
                this.stageRecordList.school.signData = data;
                //global.printLog(this.stageRecordList.school.createForm.signData);
            }
            else if (this.stageType === "上报审核") {
                this.stageRecordList.stagePerform.createForm.stageRecordIds = loop(data, this);
            }
            else {
                this.pendingReportRecord.create.form.stageHourIds = [];
                for (let item in data) {
                    this.pendingReportRecord.create.form.stageHourIds.push(data[item].stageHourId);
                }
            }
            function loop(data, that) {
                let arr = [];
                for (let item in data) {
                    arr.push(data[item].stageRecordId);
                }
                return arr;
            }
        },
        handleCurrentChange(val) {
            this.page = val;
        }
    },
    activated() {
        global.printLog("activated every one");
        setTimeout(() => {
            this.stageTypeChange(this.stageType);
        }, 1000);
    },
    mounted() {
        this.reportedRecordList.filter.stage = "1";
        this.pendingReportRecord.filter.stage = "1";
        this.stageRecordList.school.filter.stage = "1";
        this.stageRecordList.teacher.filter.stage = "1";
        this.stageRecordList.student.filter.stage = "1";
        this.stageRecordList.stagePerform.filter.stage = "1";
    }
}

</script>

<style lang="scss">
.results-form {
    color: #1F2D3D;
    .title {
        font-size: 1.1em;
        span {
            margin: 0 2px;
            font-size: 1.2em;
            font-weight: bolder;
            &.success {
                color: #13CE66;
            }
            &.danger {
                color: #FF4949;
            }
        }
    }
    ul li ul {
        margin-bottom: 10px;
        li {
            list-style-type: disc;
            padding: 10px 0 5px;
            margin-left: 28px;
            border-bottom: 1px solid #dfe6ec;
            &:last-child {
                border-bottom: 0;
            }
        }
    }
}
</style>