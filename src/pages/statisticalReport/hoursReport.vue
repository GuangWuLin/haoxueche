<template>
    <section>
        <a href="" download=".xlsx" id="down-link"></a>
        <!--选择条-->
        <div>
            <el-radio-group v-model="radioHeaderSel">
                <el-radio-button label="教练汇总"></el-radio-button>
                <el-radio-button label="预约明细"></el-radio-button>
                <el-radio-button label="计时明细"></el-radio-button>
            </el-radio-group>
            <!--工具栏-->
        </div>
        <!--教练汇总-->
        <div v-show="this.radioHeaderSel==='教练汇总'">
            <!--列表-->
            <el-row style="margin-top:20px;">
                <el-col :span="25" class="toolbar">
                    <el-form :inline="true" :model="tabOne">
                        <el-form-item>
                            <el-input class="search-input mr10 left" v-model="tabOne.keyWord" placeholder="输入教练姓名或电话"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-date-picker :picker-options="tabOne.pickerOptions2" type="daterange" @change="handleDateRangeChange" :clearable='false' placeholder="选择日期范围" v-model="tabOne.dateRange" format="yyyy-MM-dd" :editable="false">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item class="right" style="margin-right:49px;">
                            <el-button type="primary" @click="queryDatas">查询</el-button>
                            <el-button type="primary" @click="handleCommand">导出表格</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <section v-loading="tabOne.pageLoading">
    
                <el-table @cell-click='cellClick' :show-summary="true" :summary-method="coachsSummaries" :data="teachers" border highlight-current-row>
                    <el-table-column prop="teacherName" label='教练'>
                    </el-table-column>
                    <el-table-column prop="phone" label="电话号码">
                    </el-table-column>
                    <el-table-column prop="idNumber" label="身份证号">
                    </el-table-column>
                    <el-table-column label="预约学时（分钟）">
                        <el-table-column label="科目二预约学时">
                            <template scope="scope">
                                <el-button type='text' style="text-decoration:underline;">{{ scope.row.appointmentTwoMin }}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="科目三预约学时">
                            <template scope="scope">
                                <el-button type='text' style="text-decoration:underline;">{{ scope.row.appointmentThreeMin }}</el-button>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="计时学时（分钟）">
                        <el-table-column label='科目二计时学时'>
                            <template scope="scope">
                                <el-button type='text' style="text-decoration:underline;">{{ scope.row.timerTwoMin }}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label='科目三计时学时'>
                            <template scope="scope">
                                <el-button type='text' style="text-decoration:underline;">{{ scope.row.timerThreeMin }}</el-button>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
                <el-pagination @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :page-size="pageSize" :total="tabOne.total" :current-page="tabOne.page">
                </el-pagination>
            </section>
        </div>
        <!--预约明细-->
        <div v-show="this.radioHeaderSel==='预约明细'">
            <el-row style="margin-top:20px;">
                <el-col :span="25" class="toolbar">
                    <el-form :inline="true" :model="tabTwo">
                        <el-form-item>
                            <el-input class="search-input mr10 left" v-model="tabTwo.keyWord" placeholder="输入教练姓名或电话"></el-input>
                        </el-form-item>
                        <el-select v-model="tabTwo.curState" style="width:135px;" placeholder="科目" class="mr10">
                            <el-option label="全部科目" value="0"></el-option>
                            <el-option label="科目一" value="1"></el-option>
                            <el-option label="科目二" value="2"></el-option>
                            <el-option label="科目三" value="3"></el-option>
                            <el-option label="科目四" value="4"></el-option>
                        </el-select>
                        <el-form-item>
                            <el-date-picker :picker-options="tabTwo.pickerOptions2" type="daterange" :clearable='false' placeholder="选择日期范围" v-model="tabTwo.dateRange" @change="handleDateRangeChange" format="yyyy-MM-dd" :editable="false">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item class="right" style="margin-right:49px;">
                            <el-button type="primary" @click="queryDatas">查询</el-button>
                            <el-button type="primary" @click="handleCommand">导出表格</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <section v-loading="tabTwo.pageLoading">
                <el-table :data="detailsApp" border highlight-current-row>
                    <el-table-column label="教练" prop="teacherName" min-width='80'>
                    </el-table-column>
                    <el-table-column prop="teacherPhone" label="电话号码" width='135'>
                    </el-table-column>
                    <el-table-column prop="idNumber" label="身份证号" width='180'>
                    </el-table-column>
                    <el-table-column prop="carTypeName" label='培训车型'  width='90'>
                    </el-table-column>
                    <el-table-column prop="stageName" label='科目' width='90'>
                    </el-table-column>
                    <el-table-column prop="studentName" label='学员' min-width='80'>
                    </el-table-column>
                    <el-table-column prop="studyDate" label='日期'  width='170'>
                    </el-table-column>
                    <el-table-column prop="studyTime" label='预约时段（时分）' width='150'>
                    </el-table-column>
                    <el-table-column prop="studyMin" label='预约分钟数'  width='120'>
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="预约时间" width='170'>
                    </el-table-column>
                </el-table>
                <el-pagination @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :page-size="pageSize" :total="tabTwo.total" :current-page="tabTwo.page">
                </el-pagination>
            </section>
        </div>
        <!--计时明细-->
        <div v-show="this.radioHeaderSel==='计时明细'">
            <el-row style="margin-top:20px;">
                <el-col :span="25" class="toolbar">
                    <el-form :inline="true" :model="tabThree">
                        <el-form-item>
                            <el-input class="search-input mr10 left" v-model="tabThree.keyWord" placeholder="输入教练姓名或电话"></el-input>
                        </el-form-item>
    
                        <el-select v-model="tabThree.curState" style="width:135px;" placeholder="科目" class="mr10">
                            <el-option label="全部科目" value="0"></el-option>
                            <el-option label="科目一" value="1"></el-option>
                            <el-option label="科目二" value="2"></el-option>
                            <el-option label="科目三" value="3"></el-option>
                            <el-option label="科目四" value="4"></el-option>
                        </el-select>
    
                        <el-form-item>
                            <el-date-picker :picker-options="tabThree.pickerOptions2" type="daterange" :clearable='false' placeholder="选择日期范围" v-model="tabThree.dateRange" @change="handleDateRangeChange" format="yyyy-MM-dd" :editable="false">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item class="right" style="margin-right:49px;">
                            <el-button type="primary" @click="queryDatas">查询</el-button>
                            <el-button type="primary" @click="handleCommand">导出表格</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <section v-loading="tabThree.pageLoading">
                <el-table :data="detailsTime" border highlight-current-row>
                    <el-table-column prop="teacherName" label="教练" min-width='80'>
                    </el-table-column>
                    <el-table-column prop="teacherPhone" label="电话号码" width='135'>
                    </el-table-column>
                    <el-table-column prop="idNumber" label="身份证号" width='180'>
                    </el-table-column>
                    <el-table-column prop="carTypeName" label='培训车型' width='90'>
                    </el-table-column>
                    <el-table-column prop="stageName" label='科目' width='90'>
                    </el-table-column>
                    <el-table-column prop="studentName" label='学员' min-width='80'>
                    </el-table-column>
                    <el-table-column prop="studyDate" label='日期' width='170'>
                    </el-table-column>
                    <el-table-column prop="studyTime" label='计时时段（时分）' width='150'>
                    </el-table-column>
                    <el-table-column prop="studyMin" label='计时分钟数' width='120'>
                    </el-table-column>
                </el-table>
                <el-pagination @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :page-size="pageSize" :total="tabThree.total" :current-page="tabThree.page">
                </el-pagination>
            </section>
        </div>
    </section>
</template>
<script>
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        return {
            radioHeaderSel: "教练汇总",
            pageSize: global.pageSize,
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            teachers: [],
            detailsApp: [],
            detailsTime: [],
            tabOne: {
                keyWord: '',
                curState: '0',
                page: 1,
                total: 0,
                allReport: [],
                pageLoading: false,
                pickerOptions2: {
                    shortcuts: [{
                        text: '昨天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '本周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            const weekDay = start.getDay();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * (weekDay - 1));
                            end.setTime(end.getTime() + 3600 * 1000 * 24 * (7 - weekDay));
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '本月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            const today = start.getDate();
                            const thisMonth = start.getMonth() + 1;
                            const year = start.getFullYear();
                            const monthEnd = new Date(year, thisMonth, 0).getDate();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * (today - 1));
                            end.setTime(end.getTime() + 3600 * 1000 * 24 * (monthEnd - today));
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '上月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            const today = start.getDate();
                            const thisMonth = start.getMonth() + 1;
                            const year = start.getFullYear();
                            const monthEnd = new Date(year, thisMonth - 1, 0).getDate();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * (today + monthEnd - 1));
                            end.setTime(end.getTime() - 3600 * 1000 * 24 * today);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                dateRange: []
            },
            tabTwo: {
                keyWord: '',
                curState: '0',
                dateRange: [],
                total: 0,
                pageLoading: false,
                pickerOptions2: {
                    shortcuts: [{
                        text: '昨天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '本周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            const weekDay = start.getDay();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * (weekDay - 1));
                            end.setTime(end.getTime() + 3600 * 1000 * 24 * (7 - weekDay));
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '本月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            const today = start.getDate();
                            const thisMonth = start.getMonth() + 1;
                            const year = start.getFullYear();
                            const monthEnd = new Date(year, thisMonth, 0).getDate();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * (today - 1));
                            end.setTime(end.getTime() + 3600 * 1000 * 24 * (monthEnd - today));
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '上月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            const today = start.getDate();
                            const thisMonth = start.getMonth() + 1;
                            const year = start.getFullYear();
                            const monthEnd = new Date(year, thisMonth - 1, 0).getDate();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * (today + monthEnd - 1));
                            end.setTime(end.getTime() - 3600 * 1000 * 24 * today);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                page: 1
            },
            tabThree: {
                keyWord: '',
                curState: '0',
                total: 0,
                pageLoading: false,
                page: 1,
                pickerOptions2: {
                    shortcuts: [{
                        text: '昨天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '本周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            const weekDay = start.getDay();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * (weekDay - 1));
                            end.setTime(end.getTime() + 3600 * 1000 * 24 * (7 - weekDay));
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '本月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            const today = start.getDate();
                            const thisMonth = start.getMonth() + 1;
                            const year = start.getFullYear();
                            const monthEnd = new Date(year, thisMonth, 0).getDate();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * (today - 1));
                            end.setTime(end.getTime() + 3600 * 1000 * 24 * (monthEnd - today));
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '上月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            const today = start.getDate();
                            const thisMonth = start.getMonth() + 1;
                            const year = start.getFullYear();
                            const monthEnd = new Date(year, thisMonth - 1, 0).getDate();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * (today + monthEnd - 1));
                            end.setTime(end.getTime() - 3600 * 1000 * 24 * today);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                dateRange: []
            },

        }
    },
    methods: {
        coachsSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            for (var o in this.tabOne.allReport) {
                this.tabOne.allReport[o] = Number(this.tabOne.allReport[o]);
            }
            sums[0] = '合计';
            sums[1] = '--';
            sums[2] = '--';
            sums[3] = this.tabOne.allReport.appointmentTwoMin;
            sums[4] = this.tabOne.allReport.appointmentThreeMin;
            sums[5] = this.tabOne.allReport.timerTwoMin;
            sums[6] = this.tabOne.allReport.timerThreeMin;
            return sums;
        },
        // 点击table 中某一格时触发
        cellClick(row, column, cell, event) {
            switch (column.label) {
                case '科目二预约学时':
                    this.tabTwo.keyWord = row.teacherName === '--'?'':row.teacherName;
                    this.tabTwo.curState = '2';
                    this.tabTwo.dateRange = this.tabOne.dateRange;
                    this.radioHeaderSel = '预约明细';
                    break;
                case '科目三预约学时':
                    this.tabTwo.keyWord = row.teacherName === '--'?'':row.teacherName;
                    this.tabTwo.curState = '3';
                    this.tabTwo.dateRange = this.tabOne.dateRange;
                    this.radioHeaderSel = '预约明细';
                    break;
                case '科目二计时学时':
                    this.tabThree.keyWord = row.teacherName === '--'?'':row.teacherName;
                    this.tabThree.dateRange = this.tabOne.dateRange;
                    this.tabThree.curState = '2';
                    this.radioHeaderSel = '计时明细';
                    break;
                case '科目三计时学时':
                    this.tabThree.keyWord = row.teacherName === '--'?'':row.teacherName;
                    this.tabThree.dateRange = this.tabOne.dateRange;
                    this.tabThree.curState = '3';
                    this.radioHeaderSel = '计时明细';
                    break;
                default:
                    break;
            }
            this.queryDetail();
        },
        queryDatas() {
            if (this.radioHeaderSel === '教练汇总') {
                this.queryCoachs();
            } else {
                this.queryDetail();
            }
        },
        // 时间转换
        timeCheck() {
            this.tabOne.dateRange = [];
            this.tabTwo.dateRange = [];
            this.tabThree.dateRange = [];
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 8.64e7);
            end.setTime(end.getTime() - 8.64e7);
            this.tabOne.dateRange = [start, end];
            this.tabTwo.dateRange = [start, end];
            this.tabThree.dateRange = [start, end];
        },
        queryCoachs() {
            var beginDate, endDate;
            try {
                beginDate = new Date(this.tabOne.dateRange[0]).Format('yyyy-MM-dd');
                endDate = new Date(this.tabOne.dateRange[1]).Format('yyyy-MM-dd');
            } catch (e) {
                beginDate = this.tabOne.dateRange[0];
                endDate = this.tabOne.dateRange[1];
            }
            this.tabOne.pageLoading = true;
            let args = [this.schoolCode, beginDate, endDate, this.tabOne.page, this.pageSize, this.tabOne.keyWord, this.tabOne.curState];
            setTimeout(() => {
                this.teachers = [];
                request.reportCentre.hoursReport.TeacherHours(args).then((res) => {
                    if (res.success) {
                        this.tabOne.pageLoading = false;
                        this.tabOne.total = res.object.reports.num;
                        this.tabOne.allReport = res.object.allReport;
                        res.object.reports.list.forEach(item => {
                            this.teachers.push({
                                teacherName: Number(item.teacherName)!==0?item.teacherName:'--',
                                appointmentThreeMin: item.appointmentThreeMin,
                                appointmentTwoMin: item.appointmentTwoMin,
                                idNumber: Number(item.idNumber)!==0?item.idNumber:'--',
                                phone: Number(item.phone)!==0?item.phone:'--',
                                teacherId: Number(item.teacherId)!==0?item.teacherId:'--',
                                timerThreeMin: item.timerThreeMin,
                                timerTwoMin: item.timerTwoMin
                            });
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: '获取教练员工时信息失败，原因: ' + res.message
                        })
                    }
                });
            }, 1000);

        },
        queryDetail() {
            let page, keyWord, beginDate, endDate, curState;
            if (this.radioHeaderSel === '预约明细') {
                this.tabTwo.pageLoading = true;
                page = this.tabTwo.page;
                keyWord = this.tabTwo.keyWord;
                try {
                    beginDate = new Date(this.tabTwo.dateRange[0]).Format('yyyy-MM-dd');
                    endDate = new Date(this.tabTwo.dateRange[1]).Format('yyyy-MM-dd');
                } catch (e) {
                    beginDate = this.tabTwo.dateRange[0];
                    endDate = this.tabTwo.dateRange[1];
                }
                curState = this.tabTwo.curState;
            } else if (this.radioHeaderSel === '计时明细') {
                this.tabThree.pageLoading = true;
                page = this.tabThree.page;
                keyWord = this.tabThree.keyWord;
                try {
                    beginDate = new Date(this.tabThree.dateRange[0]).Format('yyyy-MM-dd');
                    endDate = new Date(this.tabThree.dateRange[1]).Format('yyyy-MM-dd');
                } catch (e) {
                    beginDate = this.tabThree.dateRange[0];
                    endDate = this.tabThree.dateRange[1];
                }
                curState = this.tabThree.curState;
            }
            let args = [this.schoolCode, beginDate, endDate, page, this.pageSize, keyWord, curState]; // 预约明细、计时明细
            setTimeout(() => {
                if (this.radioHeaderSel === '预约明细') {
                    this.detailsApp = [];

                    request.reportCentre.hoursReport.TeacherOrderDetail(args).then(res => {
                        if (res.success) {
                            this.tabTwo.pageLoading = false;
                            this.tabTwo.total = res.object.num;
                            res.object.list.forEach(item => {
                                this.detailsApp.push({
                                    teacherName: Number(item.teacherName)!==0?item.teacherName:'--',
                                    carTypeName: Number(item.carTypeName)!==0?item.carTypeName:'--',
                                    stageName: Number(item.stageName)!==0?item.stageName:'--',
                                    idNumber: Number(item.idNumber)!==0?item.idNumber:'--',
                                    teacherPhone: Number(item.teacherPhone)!==0?item.teacherPhone:'--',
                                    studyDate: Number(item.studyDate)!==0?item.studyDate:'--',
                                    studentName: Number(item.studentName)!==0?item.studentName:'--',
                                    gmtCreate: Number(item.gmtCreate)!==0?item.gmtCreate:'--',
                                    studyMin: item.studyMin,
                                    studyTime: item.studyTime,
                                });
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: '获取教练预约明细时信息失败，原因: ' + res.message
                            })
                        }
                    });
                } else if (this.radioHeaderSel === '计时明细') {
                    this.detailsTime = [];
                    request.reportCentre.hoursReport.TeacherTimerDetail(args).then(res => {
                        if (res.success) {
                            this.tabThree.pageLoading = false;
                            this.tabThree.total = res.object.num;
                            res.object.list.forEach(item => {
                                this.detailsTime.push({
                                    teacherName: Number(item.teacherName)!==0?item.teacherName:'--',
                                    carTypeName: Number(item.carTypeName)!==0?item.carTypeName:'--',
                                    stageName: Number(item.stageName)!==0?item.stageName:'--',
                                    idNumber: Number(item.idNumber)!==0?item.idNumber:'--',
                                    teacherPhone: Number(item.teacherPhone)!==0?item.teacherPhone:'--',
                                    studyDate: Number(item.studyDate)!==0?item.studyDate:'--',
                                    studentName: Number(item.studentName)!==0?item.studentName:'--',
                                    studyMin: item.studyMin,
                                    studyTime: item.studyTime,
                                });
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: '获取教练预约明细时信息失败，原因: ' + res.message
                            })
                        }
                    });
                }
            }, 1000);
        },
        handleCommand() {
            let downLink = document.getElementById("down-link");
            let url = '', beginDate = '', endDate = '', stage, keyWord;
            if (this.radioHeaderSel === '教练汇总') {
                url = '/sc/teacherReport/getTeacherHoursExport?schoolCode=';
                try {
                    beginDate = new Date(this.tabOne.dateRange[0]).Format('yyyy-MM-dd');
                    endDate = new Date(this.tabOne.dateRange[1]).Format('yyyy-MM-dd');
                } catch (e) {
                    beginDate = this.tabOne.dateRange[0];
                    endDate = this.tabOne.dateRange[1];
                }
                stage = this.tabOne.curState;
                keyWord = this.tabOne.keyWord;
            } else if (this.radioHeaderSel === '预约明细') {
                try {
                    beginDate = new Date(this.tabTwo.dateRange[0]).Format('yyyy-MM-dd');
                    endDate = new Date(this.tabTwo.dateRange[1]).Format('yyyy-MM-dd');
                } catch (e) {
                    beginDate = this.tabTwo.dateRange[0];
                    endDate = this.tabTwo.dateRange[1];
                }
                stage = this.tabTwo.curState;
                keyWord = this.tabTwo.keyWord;
                url = '/sc/teacherReport/getTeacherOrderDetailExport?schoolCode=';
            } else if (this.radioHeaderSel === '计时明细') {
                url = '/sc/teacherReport/getTeacherTimerDetailExport?schoolCode=';
                try {
                    beginDate = new Date(this.tabThree.dateRange[0]).Format('yyyy-MM-dd');
                    endDate = new Date(this.tabThree.dateRange[1]).Format('yyyy-MM-dd');
                } catch (e) {
                    beginDate = this.tabThree.dateRange[0];
                    endDate = this.tabThree.dateRange[1];
                }
                stage = this.tabThree.curState;
                keyWord = this.tabThree.keyWord;
            }
            downLink.setAttribute("href", sessionStorage.getItem('baseUrl') + url + this.schoolCode + "&beginTime=" + beginDate + "&endTime=" + endDate + "&teacherKeyWord=" + (keyWord !== '' ? encodeURI(keyWord) : '') + "&stage=" + stage);
            downLink.click();
        },
        handleCurrentChange(val) {
            if (this.radioHeaderSel === '教练汇总') {
                this.tabOne.page = val;
                this.queryCoachs();
            } else if (this.radioHeaderSel === '预约明细') {
                this.tabTwo.page = val;
                this.queryDetail();
            } else if (this.radioHeaderSel === '计时明细') {
                this.tabThree.page = val;
                this.queryDetail();
            }
        },
        handleDateRangeChange(daterange) {
            let datasRange = [];
            if (daterange.length > 0) {
                let start = daterange.split(" - ")[0];
                let end = daterange.split(" - ")[1];
                let start_ = new Date(start).getTime();
                let end_ = new Date(end).getTime();
                datasRange.push(start);
                datasRange.push(end);
                if (Math.round((end_ - start_) / 8.64e7) >= 31) {
                    this.$message({
                        type: 'warning',
                        message: '为保证服务器稳定运行，请将选择区间控制在31天以内~'
                    });
                } else {
                    if (this.radioHeaderSel === '教练汇总') {
                        this.tabOne.dateRange = datasRange;
                        this.tabOne.page = 1;
                    } else if (this.radioHeaderSel === '预约明细') {
                        this.tabTwo.dateRange = datasRange;
                        this.tabTwo.page = 1;
                    } else if (this.radioHeaderSel === '计时明细') {
                        this.tabThree.dateRange = datasRange;
                        this.tabThree.page = 1;
                    }
                }
            }
        }
    },
    deactivated() {
        this.tabOne.page = 1;
        this.tabTwo.page = 1;
        this.tabThree.page = 1;
        global.printLog("deactivated...");
    },
    activated() {
        this.queryCoachs();
    },
    mounted() {
        this.timeCheck();
    }
}

</script>