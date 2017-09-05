<template>
    <section>
        <a href="" download=".xlsx" id="down-link"></a>
        <!--选择条-->
        <div>
            <el-radio-group v-model="radioHeaderSel">
                <el-radio-button label="驾校汇总"></el-radio-button>
                <el-radio-button label="教练汇总"></el-radio-button>
                <el-radio-button label="学员明细"></el-radio-button>
            </el-radio-group>
            <!--工具栏-->
        </div>
        <!--驾校汇总-->
        <div v-show="this.radioHeaderSel==='驾校汇总'">
            <el-row style="margin-top:20px;">
                <el-col :span="25" class="toolbar">
                    <el-form :inline="true" :model="tabOne">
                        <el-form-item>
                            <el-select style="width:135px;" v-model="tabOne.carType" placeholder="选择车型" class="mr10">
                                <el-option v-for='item in carTypeOptions' :key='item.value' :value='item.value' :label='item.label' ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="right" style="margin-right:49px;">
                            <el-button type="primary" @click="queryDatas">查询</el-button>
                            <el-button type="primary" @click="handleCommand">导出表格</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <section v-loading="tabOne.pageLoading">
                <el-table :show-summary="true" :summary-method="schoolSummaries" :data="statisticsBySchools" border highlight-current-row>
                    <el-table-column label="车型" prop="carTypeName">
                    </el-table-column>
                    <el-table-column prop="stageOneCount" label="科目一学员">
                    </el-table-column>
                    <el-table-column prop="stageTwoCount" label="科目二学员">
                    </el-table-column>
                    <el-table-column prop="stageThreeCount" label='科目三学员'>
                    </el-table-column>
                    <el-table-column prop="stageFourCount" label='科目四学员'>
                    </el-table-column>
                    <el-table-column prop="allCount" label='合计'>
                    </el-table-column>
                </el-table>
            </section>
        </div>
        <!--教练汇总-->
        <div v-show="this.radioHeaderSel==='教练汇总'">
            <!--列表-->
            <el-row style="margin-top:20px;">
                <el-col :span="25" class="toolbar">
                    <el-form :inline="true" :model="tabTwo">
                        <el-form-item>
                            <el-input class="search-input mr10 left" v-model="tabTwo.keyWord" placeholder="输入教练姓名或电话"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-select style="width:135px;" v-model="tabTwo.carType" placeholder="选择车型" class="mr10">
                                <el-option v-for='item in carTypeOptions' :key='item.value' :value='item.value' :label='item.label' ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="right" style="margin-right:49px;">
                            <el-button type="primary" @click="queryDatas">查询</el-button>
                            <el-button type="primary" @click="handleCommand">导出表格</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <section v-loading="tabTwo.pageLoading">
                <el-table :row-key='(row)=>{return row.carType}' @cell-click='cellClick' :show-summary="true" :summary-method="coachSummaries" :data="statisticsByCoachs" border highlight-current-row>
                    <el-table-column prop="teacherName" label='教练'>
                    </el-table-column>
                    <el-table-column prop="teacherPhone" label="电话号码">
                    </el-table-column>
                    <el-table-column prop="carTypeName" label="车型">
                    </el-table-column>
                    <el-table-column label="科目一学员数">
                        <template scope='scope'>
                            <el-button type='text' style="text-decoration:underline;">{{ scope.row.stageOneCount }}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="科目二学员数">
                        <template scope='scope'>
                            <el-button type='text' style="text-decoration:underline;">{{ scope.row.stageTwoCount }}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="科目三学员数">
                        <template scope='scope'>
                            <el-button type='text' style="text-decoration:underline;">{{ scope.row.stageThreeCount }}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="科目四学员数">
                        <template scope='scope'>
                            <el-button type='text' style="text-decoration:underline;">{{ scope.row.stageFourCount }}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="合计">
                        <template scope='scope'>
                            <el-button type='text' style="text-decoration:underline;">{{ scope.row.allCount }}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :page-size="pageSize" :total="tabTwo.total" :current-page="tabTwo.page">
                </el-pagination>
            </section>
        </div>
        <!--学员明细-->
        <div v-show="this.radioHeaderSel==='学员明细'">
            <el-row style="margin-top:20px;">
                <el-col :span="25" class="toolbar">
                    <el-form :inline="true" :model="tabThree">
                        <el-form-item class='mr10'>
                            <el-radio class="radio" v-model="tabThree.radio" label="1">教练</el-radio>
                            <el-radio class="radio" v-model="tabThree.radio" label="2">学员</el-radio>
                        </el-form-item>
                        <el-form-item>
                            <el-input class="search-input mr10 left" v-model="tabThree.keyWord" placeholder="输入姓名或电话"></el-input>
                        </el-form-item>
                        <el-select v-model="tabThree.curState" style="width:135px;" placeholder="科目" class="mr10">
                            <el-option label="全部科目" value="0"></el-option>
                            <el-option label="科目一" value="1"></el-option>
                            <el-option label="科目二" value="2"></el-option>
                            <el-option label="科目三" value="3"></el-option>
                            <el-option label="科目四" value="4"></el-option>
                        </el-select>
                        <el-form-item>
                            <el-select style="width:135px;" v-model="tabThree.carType" placeholder="选择车型" class="mr10">
                                <el-option v-for='item in carTypeOptions' :key='item.value' :value='item.value' :label='item.label' ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="right" style="margin-right:49px;">
                            <el-button type="primary" @click="queryDatas">查询</el-button>
                            <el-button type="primary" @click="handleCommand">导出表格</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <section v-loading="tabThree.pageLoading">
                <el-table :data="studentDetail" border highlight-current-row>
                    <el-table-column prop="studentName" label="学员">
                    </el-table-column>
                    <el-table-column prop="studentPhone" label="学员电话">
                    </el-table-column>
                    <el-table-column prop="cardNo" label="证件号">
                    </el-table-column>
                    <el-table-column prop="carTypeName" label='车型'>
                    </el-table-column>
                    <el-table-column prop="stageName" label='科目进度'>
                    </el-table-column>
                    <el-table-column prop="teacherName" label='教练'>
                    </el-table-column>
                    <el-table-column prop="teacherPhone" label='教练电话'>
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
            radioHeaderSel: "驾校汇总",
            carTypeOptions:[],
            pageSize: global.pageSize,
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            statisticsByCoachs: [],
            statisticsBySchools: [],
            studentDetail: [],
            tabOne: {
                page: 1,
                total: 0,
                carType: '',
                allReport: [],
                pageLoading: false,
            },
            tabTwo: {
                keyWord: '',
                total: 0,
                carType: '',
                allReport: [],
                pageLoading: false,
                page: 1
            },
            tabThree: {
                keyWord: '',
                curState: '0',
                carType: '',
                total: 0,
                radio: '1',
                pageLoading: false,
                page: 1
            },

        }
    },
    methods: {
        //获取车辆类型
        getCarType() {
            request.public.queryCarType().then((res) => {
                if (res.success === true) {
                    this.carTypeOptions = [];
                    this.carTypeOptions.push({
                        value:'0',
                        label:'全部车型'
                    });
                    let data = res.object;
                    for (let item in data) {
                        this.carTypeOptions.push({
                            label: data[item].value,
                            value: data[item].key
                        });
                    }
                }
            });
        },
        schoolSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            for (var o in this.tabOne.allReport) {
                this.tabOne.allReport[o] = Number(this.tabOne.allReport[o]);
            }
            sums[0] = '合计';
            sums[1] = this.tabOne.allReport.stageOneCount;
            sums[2] = this.tabOne.allReport.stageTwoCount;
            sums[3] = this.tabOne.allReport.stageThreeCount;
            sums[4] = this.tabOne.allReport.stageFourCount;
            sums[5] = this.tabOne.allReport.allCount;
            return sums;
        },
        coachSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            for (var o in this.tabTwo.allReport) {
                this.tabTwo.allReport[o] = Number(this.tabTwo.allReport[o]);
            }
            sums[0] = '合计';
            sums[1] = '--';
            sums[2] = '--';
            sums[3] = this.tabTwo.allReport.stageOneCount;
            sums[4] = this.tabTwo.allReport.stageTwoCount;
            sums[5] = this.tabTwo.allReport.stageThreeCount;
            sums[6] = this.tabTwo.allReport.stageFourCount;
            sums[7] = this.tabTwo.allReport.allCount;
            return sums;
        },
        // 点击table 中某一格时触发
        cellClick(row, column, cell, event) {
            switch (column.label) {
                case '科目一学员数':
                    this.tabThree.curState = '1';
                    this.tabThree.radio = '1';
                    break;
                case '科目二学员数':
                    this.tabThree.curState = '2';
                    this.tabThree.radio = '1';
                    break;
                case '科目三学员数':
                    this.tabThree.curState = '3';
                    this.tabThree.radio = '1';
                    break;
                case '科目四学员数':
                    this.tabThree.curState = '4';
                    this.tabThree.radio = '1';
                    break;
                case '合计':
                    this.tabThree.curState = '0';
                    this.tabThree.radio = '1';
                    break;
                default:
                    break;
            }
            this.tabThree.carType = row.carType;
            this.tabThree.keyWord = row.teacherName === '--'?'':row.teacherName;
            this.radioHeaderSel = '学员明细';
            this.queryDetail();
        },
        queryDatas() {
            if (this.radioHeaderSel === '教练汇总' || this.radioHeaderSel === '驾校汇总') {
                this.queryReports();
            } else {
                this.queryDetail();
            }
        },
        queryReports() {
            if (this.radioHeaderSel === '驾校汇总') {
                this.tabOne.pageLoading = true;
                let args = [this.schoolCode, this.tabOne.carType];
                setTimeout(() => {
                    this.statisticsBySchools = [];
                    request.reportCentre.stageReport.schoolStageReport(args).then((res) => {
                        if (res.success) {
                            this.tabOne.pageLoading = false;
                            this.tabOne.total = res.object.reports.length;
                            this.tabOne.allReport = res.object.allReport;
                            res.object.reports.forEach(item => {
                                this.statisticsBySchools.push({
                                    carTypeName: Number(item.carTypeName) === 0 ? '--' : item.carTypeName,
                                    stageOneCount: item.stageOneCount,
                                    stageTwoCount: item.stageTwoCount,
                                    stageThreeCount: item.stageThreeCount,
                                    stageFourCount: item.stageFourCount,
                                    allCount: item.allCount,
                                });
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: '获取驾校汇总信息失败，原因: ' + res.message
                            })
                        }
                    });
                }, 1000);
            } else {
                this.tabTwo.pageLoading = true;
                let args = [this.schoolCode, this.tabTwo.carType, this.tabTwo.page, this.pageSize, this.tabTwo.keyWord];
                setTimeout(() => {
                    this.statisticsByCoachs = [];
                    request.reportCentre.stageReport.teacherStageReport(args).then((res) => {
                        if (res.success) {
                            this.tabTwo.pageLoading = false;
                            this.tabTwo.total = res.object.reports.num;
                            this.tabTwo.allReport = res.object.allReport;
                            res.object.reports.list.forEach(item => {
                                this.statisticsByCoachs.push({
                                    teacherName: Number(item.teacherName) === 0 ? '--' : item.teacherName,
                                    teacherPhone: Number(item.teacherPhone) === 0 ? '--' : item.teacherPhone,
                                    carTypeName: Number(item.carTypeName) === 0 ? '--' : item.carTypeName,
                                    stageOneCount: item.stageOneCount,
                                    stageTwoCount: item.stageTwoCount,
                                    stageThreeCount: item.stageThreeCount,
                                    stageFourCount: item.stageFourCount,
                                    allCount: item.allCount,
                                    carType: Number(item.carType) === 0 ? '--' : item.carType,
                                });
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: '获取教练汇总信息失败，原因: ' + res.message
                            })
                        }
                    });
                }, 1000);
            }
        },
        queryDetail() {
            this.tabThree.pageLoading = true;
            let args = [this.schoolCode, this.tabThree.carType, this.tabThree.page, this.pageSize, (this.tabThree.radio === '1' ? `&teacherKeyWord=${this.tabThree.keyWord}` : `&studentKeyWord=${this.tabThree.keyWord}`), this.tabThree.curState]; // 预约明细、计时明细
            setTimeout(() => {
                this.studentDetail = [];
                request.reportCentre.stageReport.stageReportDetail(args).then(res => {
                    if (res.success) {
                        this.tabThree.pageLoading = false;
                        this.tabThree.total = res.object.num;
                        res.object.list.forEach(item => {
                            this.studentDetail.push({
                                teacherName: Number(item.teacherName) === 0 ? '--' : item.teacherName,
                                carTypeName: Number(item.carTypeName)!==0?item.carTypeName:'--',
                                stageName: Number(item.stageName)!==0?item.stageName:'--',
                                cardNo: Number(item.cardNo) !== 0?item.cardNo:'--',
                                teacherPhone: Number(item.teacherPhone) !== 0 ?item.teacherPhone:'--',
                                studentPhone: Number(item.studentPhone)!==0?item.studentPhone:'--',
                                studentName: Number(item.studentName) !== 0 ?item.studentName:'--',
                                idNumber: Number(item.idNumber)!==0?item.idNumber:'--'
                            });
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: '获取学员明细时信息失败，原因: ' + res.message
                        })
                    }
                });
            }, 1000);
        },
        handleCommand() {
            let downLink = document.getElementById("down-link");
            let url = '', keyWord;
            if (this.radioHeaderSel === '驾校汇总') {
                url = '/sc/stageReport/getSchoolStageExport?schoolCode=';
                downLink.setAttribute("href", sessionStorage.getItem('baseUrl') + url + this.schoolCode + "&carType=" + this.tabOne.carType);
            } else if (this.radioHeaderSel === '教练汇总') {
                url = '/sc/stageReport/getTeacherStageExport?schoolCode=';
                downLink.setAttribute("href", sessionStorage.getItem('baseUrl') + url + this.schoolCode + "&carType=" + this.tabTwo.carType + "&teacherKeyWord=" + encodeURI(this.tabTwo.keyWord));
            } else if (this.radioHeaderSel === '学员明细') {
                url = '/sc/stageReport/getStageDetailExport?schoolCode=';
                keyWord = this.tabThree.radio === '1' ? '&teacherKeyWord=' : '&studentKeyWord=';
                downLink.setAttribute("href", sessionStorage.getItem('baseUrl') + url + this.schoolCode + "&carType=" + this.tabThree.carType + keyWord + encodeURI(this.tabThree.keyWord) + "&stage=" + this.tabThree.curState);
            }
           // console.log(downLink.href);
            downLink.click();
        },
        handleCurrentChange(val) {
            if (this.radioHeaderSel === '驾校汇总') {
                this.tabOne.page = val;
                this.queryReports();
            } else if (this.radioHeaderSel === '教练汇总') {
                this.tabTwo.page = val;
                this.queryReports();
            } else if (this.radioHeaderSel === '学员明细') {
                this.tabThree.page = val;
                this.queryDetail();
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
        this.queryReports();
    },
    mounted() {
        this.getCarType();
    }
}

</script>