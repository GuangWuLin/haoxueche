<template>
    <section>
        <a href="" download=".xlsx" id="down-link"></a>
        <!--选择条-->
        <div>
            <el-radio-group v-model="radioHeaderSel">
                <el-radio-button label="招生汇总"></el-radio-button>
                <el-radio-button label="招生趋势"></el-radio-button>
                <el-radio-button label="招生明细"></el-radio-button>
            </el-radio-group>
            <!--工具栏-->
        </div>
        <!--招生汇总-->
        <div v-show="this.radioHeaderSel==='招生汇总'">
            <!--列表-->
            <el-row style="margin-top:20px;">
                <el-col :span="25" class="toolbar">
                    <el-form :inline="true" :model="tabOne">
                        <el-form-item>
                            <el-input class="search-input mr10 left" v-model="tabOne.admissions" placeholder="输入招生员姓名"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-select style="width:135px;" v-model="tabOne.carType" placeholder="选择车型" class="mr10">
                                <el-option v-for='item in carTypeOptions' :key='item.value' :value='item.value' :label='item.label'></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class='mr10'>
                            <el-date-picker :picker-options="tabOne.pickerOptions" type="daterange" :clearable='false' placeholder="选择日期范围" v-model="tabOne.dateRange" @change="handleDateRangeChange" format="yyyy-MM-dd" :editable="false">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-checkbox @change='checkChanged' v-model="tabOne.checked" class='mr10'>对比</el-checkbox>
                            <el-date-picker v-show='tabOne.checked' style="margin-left:-5px;" :picker-options="tabOne.pickerOptions2" type="daterange" :clearable='false' placeholder="选择日期范围" v-model="tabOne.dateRange2" @change="handleDateRangeChange" format="yyyy-MM-dd" :editable="false">
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
                <!--当选中对比时展示的表-->
                <el-table :summary-method="recruitSummaries" :show-summary="true" :data="tabOne.data" border highlight-current-row>
                    <el-table-column prop="recruitUser" label='招生人'>
                    </el-table-column>
                    <el-table-column label="招生数量" prop='recruitCount'>
                    </el-table-column>
                    <el-table-column label="对比招生数量" prop='contrastCount' v-if='tabOne.checked'>
                    </el-table-column>
                    <el-table-column label="变化数" prop='changeCount' v-if='tabOne.checked'>
                    </el-table-column>
                    <el-table-column label='变化率' prop='changeRate' v-if='tabOne.checked'>
                    </el-table-column>
                </el-table>
               <!--  <el-table :summary-method="recruitSummaries" v-show='!tabOne.checked' :show-summary="true" :data="tabOne.data" border highlight-current-row>
                    <el-table-column prop="recruitUser" label='招生人'>
                    </el-table-column>
                    <el-table-column label="招生数量" prop='recruitCount'>
                    </el-table-column>
                </el-table> -->
                <el-pagination @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :page-size="pageSize" :total="tabOne.total" :current-page="tabOne.page">
                </el-pagination>
            </section>
        </div>
        <!--招生趋势-->
        <div v-show="this.radioHeaderSel==='招生趋势'">
            <!--列表-->
            <el-row style="margin-top:20px;">
                <el-col :span="25" class="toolbar">
                    <el-form :inline="true" :model="tabTwo">
                        <el-form-item>
                            <el-input class="search-input mr10 left" v-model="tabTwo.admissions" placeholder="输入招生人姓名"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-select style="width:135px;" v-model="tabTwo.carType" placeholder="选择车型" class="mr10">
                                <el-option v-for='item in carTypeOptions' :key='item.value' :value='item.value' :label='item.label'></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-select style="width:135px;" v-model="tabTwo.register" placeholder="选择生源地" class="mr10">
                                <el-option value='0' label='全部'></el-option>
                                <el-option value='1' label='本地'></el-option>
                                <el-option value='2' label='外地'></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-date-picker v-model="tabTwo.theYear" align="right" type="year" placeholder="选择年">
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
                <el-table :show-summary="true" :summary-method="trendSummaries" :data="tabTwo.data" border highlight-current-row>
                    <el-table-column prop="recruitUser" label='招生人' min-width='80'>
                    </el-table-column>
                    <el-table-column label="招生数量（人）">
                        <el-table-column label="1月" prop='janCount'>
                           
                        </el-table-column>
                        <el-table-column label="2月" prop='febCount'>
                           
                        </el-table-column>
                        <el-table-column label="3月" prop='marCount'>
                           
                        </el-table-column>
                        <el-table-column label="4月" prop='aprCount'>
                            
                        </el-table-column>
                        <el-table-column label="5月" prop='mayCount'>
                            
                        </el-table-column>
                        <el-table-column label="6月" prop='junCount'>
                            
                        </el-table-column>
                        <el-table-column label="7月" prop='julCount'>
                           
                        </el-table-column>
                        <el-table-column label="8月" prop='augCount'>
                           
                        </el-table-column>
                        <el-table-column label="9月" prop='sepCount'>
                           
                        </el-table-column>
                        <el-table-column label="10月" prop='octCount'>
                            
                        </el-table-column>
                        <el-table-column label="11月" prop='novCount'>
                            
                        </el-table-column>
                        <el-table-column label="12月" prop='decCount'>
                            
                        </el-table-column>
                        <el-table-column label="合计" prop='allCount'>
                            
                        </el-table-column>
                    </el-table-column>
                </el-table>
                <el-pagination @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :page-size="pageSize" :total="tabTwo.total" :current-page="tabTwo.page">
                </el-pagination>
            </section>
        </div>
        <!--招生明细-->
        <div v-show="this.radioHeaderSel==='招生明细'">
            <el-row style="margin-top:20px;">
                <el-col :span="25" class="toolbar">
                    <el-form :inline="true" :model="tabThree">
                        <el-form-item>
                            <el-date-picker :picker-options="tabThree.pickerOptions2" type="daterange" :clearable='false' placeholder="选择日期范围" v-model="tabThree.dateRange" @change="handleDateRangeChange" format="yyyy-MM-dd" :editable="false">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-input class="search-input mr10 left" style='margin-left:10px;' v-model="tabThree.keyWord" placeholder="输入学员姓名或电话"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input class="search-input mr10 left" v-model="tabThree.admissions" placeholder="输入招生人姓名"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-select style="width:135px;" v-model="tabThree.carType" placeholder="选择车型" class="mr10">
                                <el-option v-for='item in carTypeOptions' :key='item.value' :value='item.value' :label='item.label'></el-option>
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
                <el-table :data="tabThree.data" border highlight-current-row>
                    <el-table-column prop="recruitUser" label="招生人" min-width='80'>
                    </el-table-column>
                    <el-table-column prop="studentName" label='学员姓名' min-width='80'>
                    </el-table-column>
                    <el-table-column prop="studentPhone" label='学员电话' width='135'>
                    </el-table-column>
                    <el-table-column prop="cardNo" label='学员证件号' width='180'>
                    </el-table-column>
                    <el-table-column prop="carTypeName" label='车型' width='90'>
                    </el-table-column>
                    <el-table-column prop="signTime" label='报名时间' width='170'>
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="录入时间" width='170'>
                    </el-table-column>
                    <el-table-column prop="register" label="生源" width='80'>
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
            radioHeaderSel: "招生汇总",
            pageSize: global.pageSize,
            carTypeOptions: [],
            admissionsData: [], // 全部招生人员
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            tabOne: {
                keyWord: '',
                data: [],
                allReport: [],
                page: 1,
                checked: true,
                carType: '',
                admissions: '', // 招生人
                // queryType: '1',
                total: 0,
                pageLoading: false,
                pickerOptions: {
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
                dateRange: [],
                dateRange2: [],

            },
            tabTwo: {
                curState: '',
                data: [],
                allReport: [],
                carType: '',
                register: '0',
                admissions: '',
                theYear: new Date(),
                total: 0,
                pageLoading: false,
                page: 1
            },
            tabThree: {
                data: [],
                carType: '',
                dateRange: [],
                admissions: '',
                keyWord: '',
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
            }

        }
    },
    methods: {
        //获取车辆类型
        getCarType() {
            request.public.queryCarType().then((res) => {
                if (res.success === true) {
                    this.carTypeOptions = [];
                    let data = res.object;
                    this.carTypeOptions.push({
                        value:'0',
                        label:'全部车型'
                    });
                    for (let item in data) {
                        this.carTypeOptions.push({
                            label: data[item].value,
                            value: data[item].key
                        });
                    }
                }
            });
        },
        recruitSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            // for (var o in this.tabOne.allReport) {
            //     this.tabOne.allReport[o] = Number(this.tabOne.allReport[o]);
            // }
            sums[0] = '合计';
            sums[1] = this.tabOne.allReport.recruitCount;
            sums[2] = this.tabOne.allReport.contrastCount;
            sums[3] = this.tabOne.allReport.changeCount;
            sums[4] = this.tabOne.allReport.changeRate !== null ? ((this.tabOne.allReport.changeRate * 100).toFixed(2) + '%') : '--';
            return sums;
        },
        trendSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            for (var o in this.tabTwo.allReport) {
                this.tabTwo.allReport[o] = Number(this.tabTwo.allReport[o]);
            }
            sums[0] = '合计';
            sums[1] = this.tabTwo.allReport.janCount;
            sums[2] = this.tabTwo.allReport.febCount;
            sums[3] = this.tabTwo.allReport.marCount;
            sums[4] = this.tabTwo.allReport.aprCount;
            sums[5] = this.tabTwo.allReport.mayCount;
            sums[6] = this.tabTwo.allReport.junCount;
            sums[7] = this.tabTwo.allReport.julCount;
            sums[8] = this.tabTwo.allReport.augCount;
            sums[9] = this.tabTwo.allReport.sepCount;
            sums[10] = this.tabTwo.allReport.octCount;
            sums[11] = this.tabTwo.allReport.novCount;
            sums[12] = this.tabTwo.allReport.decCount;
            sums[13] = this.tabTwo.allReport.allCount;
            return sums;
        },
        checkChanged() {
            this.tabOne.data = [];
        },
        queryDatas() {
            if (this.radioHeaderSel === '招生汇总' || this.radioHeaderSel === '招生趋势') {
                this.querySummary();
            } else {
                this.queryDetail();
            }
        },
        // 时间转换
        timeCheck() {
            // 初始化将所有的时间置空
            this.tabOne.dateRange = [];
            this.tabOne.dateRange2 = [];
            this.tabThree.dateRange = [];
            const end = new Date();
            const end_ = new Date();
            const start = new Date();
            const start_ = new Date();
            start.setTime(start.getTime() - 8.64e7);
            end.setTime(end.getTime() - 8.64e7);
            start_.setTime(start_.getTime() - 8.64e7 * 2);
            end_.setTime(end_.getTime() - 8.64e7 * 2);
            // 将初始时间全部置为昨日
            this.tabOne.dateRange = [start, end];
            // 作为招生汇总的对比时间置为前一日
            this.tabOne.dateRange2 = [start_, end_];
            this.tabThree.dateRange = [start, end];
        },
        querySummary() {
            var beginDate, beginDate_, endDate, endDate_, args;
            if (this.radioHeaderSel === '招生汇总') {
                this.tabOne.data = [];
                try {
                    beginDate = new Date(this.tabOne.dateRange[0]).Format('yyyy-MM-dd');
                    endDate = new Date(this.tabOne.dateRange[1]).Format('yyyy-MM-dd');
                    beginDate_ = new Date(this.tabOne.dateRange2[0]).Format('yyyy-MM-dd');
                    endDate_ = new Date(this.tabOne.dateRange2[1]).Format('yyyy-MM-dd');
                } catch (e) {
                    beginDate = this.tabOne.dateRange[0];
                    endDate = this.tabOne.dateRange[1];
                    beginDate_ = this.tabOne.dateRange2[0];
                    endDate_ = this.tabOne.dateRange2[1];
                }
                this.tabOne.pageLoading = true;
                args = [this.schoolCode, beginDate, endDate, this.tabOne.page, this.pageSize, (this.tabOne.checked ? '1' : '0'), this.tabOne.carType, this.tabOne.admissions, beginDate_, endDate_];
            } else {
                this.tabTwo.data = [];
                this.tabTwo.pageLoading = true;
                args = [this.schoolCode, this.tabTwo.theYear.getFullYear(), this.tabTwo.register, this.tabTwo.page, this.pageSize, this.tabTwo.admissions, this.tabTwo.carType];
            }
            setTimeout(() => {
                if (this.radioHeaderSel === '招生汇总') {
                    request.reportCentre.recruitReport.recruitReport(args).then(res => {
                        this.tabOne.pageLoading = false;
                        if (res.success) {
                            this.tabOne.total = res.object.reports.num;
                            this.tabOne.allReport = res.object.allReport;
                            res.object.reports.list.forEach(item => {
                                this.tabOne.data.push({
                                    recruitUser: Number(item.recruitUser) !== 0 ? item.recruitUser : '--',
                                    recruitCount: item.recruitCount,
                                    contrastCount: item.contrastCount,
                                    changeCount: item.changeCount,
                                    changeRate: item.changeRate !== null ? ((Number(item.changeRate) * 100).toFixed(2) + '%') : '--'
                                });
                            });
                        } else {
                            this.$message({
                                type: 'warning',
                                message: '请求数据失败，原因： ' + res.message
                            });
                        }
                    });
                } else {
                    request.reportCentre.recruitReport.recruitTrendReport(args).then(res => {
                        // global.printLog(res);
                        this.tabTwo.pageLoading = false;
                        if (res.success) {
                            this.tabTwo.total = res.object.reports.num;
                            this.tabTwo.allReport = res.object.allReport;
                            res.object.reports.list.forEach(item => {
                                this.tabTwo.data.push({
                                    recruitUser: Number(item.recruitUser) !== 0 ? item.recruitUser : '--',
                                    janCount: item.janCount,
                                    febCount: item.febCount,
                                    marCount: item.marCount,
                                    aprCount: item.aprCount,
                                    mayCount: item.mayCount,
                                    junCount: item.junCount,
                                    julCount: item.julCount,
                                    augCount: item.augCount,
                                    sepCount: item.sepCount,
                                    octCount: item.octCount,
                                    novCount: item.novCount,
                                    decCount: item.decCount,
                                    allCount: item.allCount
                                });
                            });
                        } else {
                            this.$message({
                                type: 'warning',
                                message: '数据请求失败，原因： ' + res.message
                            })
                        }
                    });
                }
            }, 1000);

        },
        queryDetail() {
            let beginDate, endDate, args;
            if (this.radioHeaderSel === '招生明细') {
                this.tabThree.data = [];
                this.tabThree.pageLoading = true;
                try {
                    beginDate = new Date(this.tabThree.dateRange[0]).Format('yyyy-MM-dd');
                    endDate = new Date(this.tabThree.dateRange[1]).Format('yyyy-MM-dd');
                } catch (e) {
                    beginDate = this.tabThree.dateRange[0];
                    endDate = this.tabThree.dateRange[1];
                }
                args = [this.schoolCode, beginDate, endDate, this.tabThree.page, this.pageSize, this.tabThree.keyWord, this.tabThree.carType, this.tabThree.admissions];
            }
            setTimeout(() => {
                request.reportCentre.recruitReport.recruitDetailReport(args).then(res => {
                    this.tabThree.pageLoading = false;
                    if (res.success) {
                        this.tabThree.total = res.object.num;
                        res.object.list.forEach(item => {
                            this.tabThree.data.push({
                                recruitUser: Number(item.recruitUser) !== 0 ? item.recruitUser : '--',
                                studentName: Number(item.studentName)!==0?item.studentName:'--',
                                studentPhone: Number(item.studentPhone)!==0?item.studentPhone:'--',
                                cardNo: Number(item.cardNo)!==0?item.cardNo:'--',
                                carTypeName: Number(item.carTypeName)!==0?item.carTypeName:'--',
                                signTime: Number(item.signTime)!==0?item.signTime:'--',
                                gmtCreate: Number(item.gmtCreate)!==0?item.gmtCreate:'--',
                                register: Number(item.register)!==0?item.register:'--'
                            });
                        });
                    } else {
                        this.$message({
                            type: 'warning',
                            message: '请求数据失败，原因： ' + res.message
                        });
                    }
                });
            }, 1000);
        },
        handleCommand() {
            let downLink = document.getElementById("down-link");
            let url = '', beginDate = '', endDate = '', beginDate_ = '', endDate_ = '';
            if (this.radioHeaderSel === '招生汇总') {
                url = '/sc/recruitReport/getRecruitExport?schoolCode=';
                try {
                    beginDate = new Date(this.tabOne.dateRange[0]).Format('yyyy-MM-dd');
                    endDate = new Date(this.tabOne.dateRange[1]).Format('yyyy-MM-dd');
                    beginDate_ = new Date(this.tabOne.dateRange2[0]).Format('yyyy-MM-dd');
                    endDate_ = new Date(this.tabOne.dateRange2[1]).Format('yyyy-MM-dd');
                } catch (e) {
                    beginDate = this.tabOne.dateRange[0];
                    endDate = this.tabOne.dateRange[1];
                    beginDate_ = this.tabOne.dateRange2[0];
                    endDate_ = this.tabOne.dateRange2[1];
                }
                downLink.setAttribute("href", sessionStorage.getItem('baseUrl') + url + this.schoolCode + "&beginTime=" + beginDate + "&endTime=" + endDate + "&isContrast=" + (this.tabOne.checked ? '1' : '0') + '&carType=' + this.tabOne.carType + "&recruitUser=" + encodeURI(this.tabOne.admissions) + "&contrastBeginTime=" + beginDate_ + "&contrastEndTime=" + endDate_);
            } else if (this.radioHeaderSel === '招生趋势') {
                url = '/sc/recruitReport/getRecruitTrendExport?schoolCode=';
                downLink.setAttribute("href", sessionStorage.getItem('baseUrl') + url + this.schoolCode + "&theYear=" + this.tabTwo.theYear.getFullYear() + "&register=" + this.tabTwo.register + "&carType=" +this.tabTwo.carType + '&recruitUser=' + this.tabTwo.admissions);
            } else if (this.radioHeaderSel === '招生明细') {
                url = '/sc/recruitReport/getRecruitDetailExport?schoolCode=';
                try {
                    beginDate = new Date(this.tabThree.dateRange[0]).Format('yyyy-MM-dd');
                    endDate = new Date(this.tabThree.dateRange[1]).Format('yyyy-MM-dd');
                } catch (e) {
                    beginDate = this.tabThree.dateRange[0];
                    endDate = this.tabThree.dateRange[1];
                }
                downLink.setAttribute("href", sessionStorage.getItem('baseUrl') + url + this.schoolCode + "&beginTime=" + beginDate + "&endTime=" + endDate + "&carType=" + this.tabThree.carType + "&studentKeyWord=" + encodeURI(this.tabThree.keyWord) + '&recruitUser=' + encodeURI(this.tabThree.admissions));
                // global.printLog(downLink.href);
            }
            // global.printLog(downLink.href);
            // global.printLog(downLink);
            downLink.click();
        },
        handleCurrentChange(val) {
            if (this.radioHeaderSel === '招生汇总') {
                this.tabOne.page = val;
                this.querySummary();
            } else if (this.radioHeaderSel === '招生趋势') {
                this.tabTwo.page = val;
                this.querySummary();
            } else if (this.radioHeaderSel === '招生明细') {
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
                    if (this.radioHeaderSel === '招生汇总') {
                        this.tabOne.page = 1;
                    } else if (this.radioHeaderSel === '招生明细') {
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
        this.querySummary();
    },
    mounted() {
        this.timeCheck();
        this.getCarType();
    }
}
</script>
<style>
.el-table__footer-wrapper {
    text-align: center;
}
</style>