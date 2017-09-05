<template>
    <section>
        <a href="" download=".xlsx" id="down-link"></a>
        <!--选择条-->
        <div>
            <el-radio-group v-model="radioHeaderSel">
                <el-radio-button label="驾校汇总"></el-radio-button>
                <el-radio-button label="教练汇总"></el-radio-button>
                <el-radio-button label="考试明细"></el-radio-button>
                <el-radio-button label="绩效核算明细"></el-radio-button>
            </el-radio-group>
            <!--工具栏-->
        </div>
        <!--驾校汇总-->
        <div v-show="this.radioHeaderSel==='驾校汇总'">
            <!--列表-->
            <el-row style="margin-top:20px;">
                <el-col :span="25" class="toolbar">
                    <el-form :inline="true" :model="tabOne">
                        <el-form-item class='mr10'>
                            <el-select style="width:135px;" v-model='tabOne.queryType'>
                                <el-option label="考试日期" value="1"></el-option>
                                <el-option label="获取成绩日期" value="2"></el-option>
                            </el-select>
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
                <el-table v-show='tabOne.checked' @cell-click='cellClick' :summary-method="schoolSummaries" :show-summary="true" :data="tabOne.data" border highlight-current-row>
                    <el-table-column prop="examStageName" label='科目'>
                    </el-table-column>
                    <el-table-column :label='tabOne.titleOne'>
                        <el-table-column label="参考人次" prop='allCount'>
                        </el-table-column>
                        <el-table-column label="合格人次" prop='passCount'>
                        </el-table-column>
                        <el-table-column label="合格率" prop='passRate'>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column :label="tabOne.titleTwo" >
                        <el-table-column label='参考人次' prop='contrastAllCount'>
                        </el-table-column>
                        <el-table-column label='合格人次' prop='contrastPassCount'>
                        </el-table-column>
                        <el-table-column label='合格率' prop='contrastPassRate'>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="变化率">
                        <el-table-column label='参考人次' prop='changeAll'>
                        </el-table-column>
                        <el-table-column label='合格人次' prop='changePass'>
                        </el-table-column>
                        <el-table-column label='合格率' prop='changePassRate'>
                        </el-table-column>
                    </el-table-column>
                </el-table>
                <!--当未选中对比时展示的表-->
                <el-table v-show='!tabOne.checked' @cell-click='cellClick' :summary-method="schoolSummaries" :show-summary="true" :data="tabOne.data" border highlight-current-row>
                    <el-table-column prop="examStageName" label='科目'>
                    </el-table-column>
                    <el-table-column label="参考人次" prop='allCount'>
                    </el-table-column>
                    <el-table-column label="合格人次" prop='passCount'>
                    </el-table-column>
                    <el-table-column label="合格率" prop='passRate'>
                    </el-table-column>
                </el-table>
                <el-pagination @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :page-size="pageSize" :total="tabOne.total" :current-page="tabOne.page">
                </el-pagination>
            </section>
        </div>
        <!--教练汇总-->
        <div v-show="this.radioHeaderSel==='教练汇总'">
            <!--列表-->
            <el-row style="margin-top:20px;">
                <el-col :span="25" class="toolbar">
                    <el-form :inline="true" :model="tabTwo">
                        <el-form-item>
                            <el-select style="width:135px;" v-model='tabTwo.queryType'>
                                <el-option label="考试日期" value="1"></el-option>
                                <el-option label="获取成绩日期" value="2"></el-option>
                            </el-select>
                            <el-date-picker :picker-options="tabTwo.pickerOptions2" type="daterange" :clearable='false' placeholder="选择日期范围" v-model="tabTwo.dateRange" @change="handleDateRangeChange" format="yyyy-MM-dd" :editable="false">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-input class="search-input mr10 left" v-model="tabTwo.keyWord" placeholder="输入教练姓名或电话"></el-input>
                        </el-form-item>
                        <el-form-item class="right" style="margin-right:49px;">
                            <el-button type="primary" @click="queryDatas">查询</el-button>
                            <el-button type="primary" @click="handleCommand">导出表格</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <section v-loading="tabTwo.pageLoading">
                <el-table @cell-click='cellClick' :data="tabTwo.data" border highlight-current-row>
                    <el-table-column prop="teacherName" label='教练' min-width='80'>
                    </el-table-column>
                    <el-table-column prop="phone" label="电话号码" width='135'>
                    </el-table-column>
                    <el-table-column prop="idNumber" label="身份证号" width='180'>
                    </el-table-column>
                    <el-table-column label="科目二考试">
                        <el-table-column label="参考人次" column-key='科目二'>
                            <template scope="scope">
                                <el-button type='text' style="text-decoration:underline;">{{ scope.row.allTwoCount }}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="合格人次" column-key='科目二'>
                            <template scope="scope">
                                <el-button type='text' style="text-decoration:underline;">{{ scope.row.passTwoCount }}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="合格率" column-key='科目二'>
                            <template scope="scope">
                                <el-button type='text' style="text-decoration:underline;">{{ scope.row.passTwoRate }}</el-button>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="科目三考试">
                        <el-table-column label='参考人次' column-key='科目三'>
                            <template scope="scope">
                                <el-button type='text' style="text-decoration:underline;">{{ scope.row.allThreeCount }}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label='合格人次' column-key='科目三'>
                            <template scope="scope">
                                <el-button type='text' style="text-decoration:underline;">{{ scope.row.passThreeCount }}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label='合格率' column-key='科目三'>
                            <template scope="scope">
                                <el-button type='text' style="text-decoration:underline;">{{ scope.row.passThreeRate }}</el-button>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
                <el-pagination @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :page-size="pageSize" :total="tabTwo.total" :current-page="tabTwo.page">
                </el-pagination>
            </section>
        </div>
        <!--考试明细-->
        <div v-show="this.radioHeaderSel==='考试明细'">
            <el-row style="margin-top:20px;">
                <el-col :span="25" class="toolbar">
                    <el-form :inline="true" :model="tabThree">
                        <el-form-item>
                            <el-select style="width:135px;" v-model='tabThree.queryType'>
                                <el-option label="考试日期" value="1"></el-option>
                                <el-option label="获取成绩日期" value="2"></el-option>
                            </el-select>
                            <el-date-picker :picker-options="tabThree.pickerOptions2" type="daterange" :clearable='false' placeholder="选择日期范围" v-model="tabThree.dateRange" @change="handleDateRangeChange" format="yyyy-MM-dd" :editable="false">
                            </el-date-picker>
                        </el-form-item>
                        <br/>
                        <el-radio class="radio" v-model="tabThree.radio" label="1">教练</el-radio>
                        <el-radio class="radio" v-model="tabThree.radio" label="2">学员</el-radio>
                        <el-form-item>
                            <el-input class="search-input mr10 left" style='margin-left:10px;' v-model="tabThree.keyWord" placeholder="输入姓名或电话"></el-input>
                        </el-form-item>
                        <el-select style="width:135px;" v-model="tabThree.curState" placeholder="考试科目" class="mr10">
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
                        <el-select style="width:135px;" v-model="tabThree.examPassed" placeholder="考试通过" class="mr10">
                            <el-option label="全部" value="2"></el-option>
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                        <el-form-item class="right" style="margin-right:49px;">
                            <el-button type="primary" @click="queryDatas">查询</el-button>
                            <el-button type="primary" @click="handleCommand">导出表格</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <section v-loading="tabThree.pageLoading">
                <el-table @cell-click='cellClick' :data="tabThree.data" border highlight-current-row>
                    <el-table-column label="学员" min-width='80'>
                        <template scope="scope">
                            <el-button type='text' :disabled="scope.row.examStageName === '科目一'||scope.row.examStageName === '科目四'" style="text-decoration:underline;">{{ scope.row.studentName }}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="studentPhone" label="学员电话" width='135'>
                    </el-table-column>
                    <el-table-column prop="examStageName" label='科目' width='90'>
                    </el-table-column>
                    <el-table-column prop="examCarTypeName" label='考试车型' width='90'>
                    </el-table-column>
                    <el-table-column prop="examDate" label='考试日期' width='120'>
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label='成绩获取日期' width='170'>
                    </el-table-column>
                    <el-table-column prop="isPass" label='考试通过' width='90'>
                    </el-table-column>
                    <el-table-column label='教练' min-width='80'>
                        <template scope="scope">
                            <el-button type='text' :disabled="scope.row.examStageName === '科目一'||scope.row.examStageName === '科目四'" style="text-decoration:underline;">{{ scope.row.teacherName }}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="teacherPhone" label="教练电话" width='135'>
                    </el-table-column>
                    <el-table-column prop="idNumber" label="教练身份证号" width='180'>
                    </el-table-column>
                </el-table>
                <el-pagination @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :page-size="pageSize" :total="tabThree.total" :current-page="tabThree.page">
                </el-pagination>
            </section>
        </div>
        <!--绩效考核-->
        <div v-show="this.radioHeaderSel==='绩效核算明细'">
            <el-row style="margin-top:20px;">
                <el-col :span="25" class="toolbar">
                    <el-form :inline="true" :model="tabFour">
                        <el-form-item>
                            <el-select style="width:135px;" v-model='tabFour.queryType'>
                                <el-option label="考试日期" value="1"></el-option>
                                <el-option label="获取成绩日期" value="2"></el-option>
                            </el-select>
                            <el-date-picker :picker-options="tabFour.pickerOptions2" type="daterange" :clearable='false' placeholder="选择日期范围" v-model="tabFour.dateRange" @change="handleDateRangeChange" format="yyyy-MM-dd" :editable="false">
                            </el-date-picker>
                        </el-form-item>
                        <br/>
                        <el-radio class="radio" v-model="tabFour.radio" label="1">教练</el-radio>
                        <el-radio class="radio" v-model="tabFour.radio" label="2">学员</el-radio>
                        <el-form-item>
                            <el-input class="search-input mr10 left" style='margin-left:10px;' v-model="tabFour.keyWord" placeholder="输入姓名或电话"></el-input>
                        </el-form-item>
    
                        <el-select style="width:135px;" v-model="tabFour.curState" placeholder="考试科目" class="mr10">
                            <el-option label="全部科目" value="0"></el-option>
                            <el-option label="科目二" value="2"></el-option>
                            <el-option label="科目三" value="3"></el-option>
                        </el-select>
                        <el-form-item>
                            <el-select style="width:135px;" v-model="tabFour.carType" placeholder="选择车型" class="mr10">
                                <el-option v-for='item in carTypeOptions' :key='item.value' :value='item.value' :label='item.label' ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class='mr10'>
                            <el-radio class="radio" v-model="tabFour.timeType" label="1">计时学时</el-radio>
                            <el-radio class="radio" v-model="tabFour.timeType" label="2">预约学时</el-radio>
                        </el-form-item>
                        <el-form-item class="right" style="margin-right:49px;">
                            <el-button type="primary" @click="queryDatas">查询</el-button>
                            <el-button type="primary" @click="handleCommand">导出表格</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <section v-loading="tabFour.pageLoading">
                <el-table :data="tabFour.data" border highlight-current-row>
                    <el-table-column label="学员" prop="studentName" min-width='80'>
                    </el-table-column>
                    <el-table-column prop="studentPhone" label="学员电话" width='135'>
                    </el-table-column>
                    <el-table-column prop="teacherName" label='教练' min-width='80'>
                    </el-table-column>
                    <el-table-column prop="examStageName" label='科目' width='90'>
                    </el-table-column>
                    <el-table-column prop="examCarTypeName" label='考试车型' width='90'>
                    </el-table-column>
                    <el-table-column prop="examDate" label='考试日期' width='120'>
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label='成绩获取日期' width='170'>
                    </el-table-column>
                    <el-table-column prop="isExamTeacher" label='核算教练'>
                    </el-table-column>
                    <el-table-column prop="isLastTeacher" label='最后计时教练'>
                    </el-table-column>
                    <el-table-column v-if="tabFour.timeType=='1'" prop="timerMin" label="计时学时(分钟)">
                    </el-table-column>
                    <el-table-column v-else prop="appointmentMin" label="预约学时(分钟)">
                    </el-table-column>
                    <el-table-column v-if="tabFour.timeType=='1'" prop="timerRate" label="计时学时比例">
                    </el-table-column>
                    <el-table-column v-else prop="appointmentRate" label="预约学时比例">
                    </el-table-column>
                </el-table>
                <el-pagination @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :page-size="pageSize" :total="tabFour.total" :current-page="tabFour.page">
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
            pageSize: global.pageSize,
            carTypeOptions: [],
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            tabOne: {
                keyWord: '',
                data: [],
                allExam: [],
                curState: '0',
                page: 1,
                checked: false,
                queryType: '1',
                total: 0,
                titleOne: '本次查看区间',
                titleTwo: '对比区间',
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
                keyWord: '',
                curState: '',
                data: [],
                allExam: [],
                carType: '',
                queryType: '1',
                radio: '1',
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
                curState: '',
                data: [],
                carType: '',
                examPassed: '',
                queryType: '1',
                radio: '1',
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
            tabFour: {
                keyWord: '',
                curState: '',
                data: [],
                carType: '',
                queryType: '1',
                radio: '1',
                timeType: '1',
                dateRange: [],
                dateRange2: [],
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
        schoolSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            sums[0] = '合计';
            sums[1] = this.tabOne.allExam.allCount;
            sums[2] = this.tabOne.allExam.passCount;
            sums[3] = this.tabOne.allExam.passRate !== null ? ((this.tabOne.allExam.passRate * 100).toFixed(2) + '%') : '--';
            if (this.tabOne.checked) {
                sums[4] = this.tabOne.allExam.contrastAllCount;
                sums[5] = this.tabOne.allExam.contrastPassCount;
                sums[6] = this.tabOne.allExam.contrastPassRate !== null ? ((this.tabOne.allExam.contrastPassRate * 100).toFixed(2) + '%') : '--';
                sums[7] = this.tabOne.allExam.changeAll!== null ? ((this.tabOne.allExam.changeAll * 100).toFixed(2) + '%') : '--';
                sums[8] = this.tabOne.allExam.changePass!== null ? ((this.tabOne.allExam.changePass * 100).toFixed(2) + '%') : '--';
                sums[9] = this.tabOne.allExam.changePassRate !== null ? ((this.tabOne.allExam.changePassRate * 100).toFixed(2) + '%') : '--';
            }
            return sums;
        },
        checkChanged() {
            this.tabOne.data = [];
        },
        // 点击table 中某一格时触发
        cellClick(row, column, cell, event) {
            if (this.radioHeaderSel === '教练汇总') {
                this.tabThree.radio = '1';
                this.tabThree.dateRange = this.tabTwo.dateRange;
                this.tabThree.curState = column.columnKey === '科目二' ? '2' : '3';
                this.tabThree.keyWord = row.teacherName === '--' ? '' : row.teacherName;
                this.tabThree.queryType = this.tabTwo.queryType;
                this.radioHeaderSel = '考试明细';
            } else if (this.radioHeaderSel === '考试明细') {
                if(row.examStageName === '科目一' || row.examStageName ==='科目四')   return;
                this.tabFour.dateRange = this.tabThree.dateRange;
                this.tabFour.curState = row.examStageName === '科目二' ? '2' : '3';
                if (column.label === '学员') {
                    this.tabFour.keyWord = row.studentName === '--' ? '' : row.studentName;
                    this.tabFour.radio = '2';
                } else if (column.label === '教练') {
                    this.tabFour.keyWord = row.teacherName === '--' ? '' : row.teacherName;
                    this.tabFour.radio = '1';
                }
                this.tabFour.queryType = this.tabThree.queryType;
                this.radioHeaderSel = '绩效核算明细';
            }
            this.queryDetail();
            // console.warn(1)
        },
        queryDatas() {
            if (this.radioHeaderSel === '驾校汇总' || this.radioHeaderSel === '教练汇总') {
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
            this.tabTwo.dateRange = [];
            this.tabThree.dateRange = [];
            this.tabFour.dateRange = [];
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
            // 作为驾校汇总的对比时间置为前一日
            this.tabOne.dateRange2 = [start_, end_];
            this.tabTwo.dateRange = [start, end];
            this.tabThree.dateRange = [start, end];
            this.tabFour.dateRange = [start, end];
        },
        querySummary() {
            var beginDate, beginDate_, endDate, endDate_, args;
            if (this.radioHeaderSel === '驾校汇总') {
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
                args = [this.schoolCode, beginDate, endDate, this.tabOne.page, this.pageSize, (this.tabOne.checked ? '1' : '0'), this.tabOne.queryType, beginDate_, endDate_];
            } else {
                this.tabTwo.data = [];
                try {
                    beginDate = new Date(this.tabTwo.dateRange[0]).Format('yyyy-MM-dd');
                    endDate = new Date(this.tabTwo.dateRange[1]).Format('yyyy-MM-dd');
                } catch (e) {
                    beginDate = this.tabTwo.dateRange[0];
                    endDate = this.tabTwo.dateRange[1];
                }
                this.tabTwo.pageLoading = true;
                args = [this.schoolCode, beginDate, endDate, this.tabTwo.page, this.pageSize, this.tabTwo.keyWord, this.tabTwo.queryType, this.tabTwo.curState, this.tabTwo.carType];
            }
            setTimeout(() => {
                if (this.radioHeaderSel === '驾校汇总') {
                    request.reportCentre.examSummary.schoolExamReport(args).then(res => {
                        this.tabOne.pageLoading = false;
                        if (res.success) {
                            if (this.tabOne.checked) {
                                this.tabOne.titleOne = this.tabOne.dateRange[0].Format('yyyy-MM-dd') + ' - ' + this.tabOne.dateRange[1].Format('yyyy-MM-dd');
                                this.tabOne.titleTwo = this.tabOne.dateRange2[0].Format('yyyy-MM-dd') + ' - ' + this.tabOne.dateRange2[1].Format('yyyy-MM-dd');
                            }
                            this.tabOne.total = res.object.exams.length;
                            this.tabOne.allExam = res.object.allExam;
                            res.object.exams.forEach(item => {
                                this.tabOne.data.push({
                                    examStageName: Number(item.examStageName)!==0?item.examStageName:'--',
                                    stage: Number(item.stage)!==0?item.stage:'--',
                                    passCount: item.passCount,
                                    allCount: item.allCount,
                                    contrastPassCount: item.contrastPassCount,
                                    contrastAllCount: item.contrastAllCount,
                                    contrastPassRate: item.contrastPassRate !== null ? ((Number(item.contrastPassRate) * 100).toFixed(2) + '%') : '--',
                                    passRate: item.passRate !== null ? ((Number(item.passRate) * 100).toFixed(2) + '%') : '--',
                                    changePass: item.changePass !== null ? ((Number(item.changePass) * 100).toFixed(2) + '%') : '--',
                                    changeAll: item.changeAll !== null ? ((Number(item.changeAll) * 100).toFixed(2) + '%') : '--',
                                    changePassRate: item.changePassRate !== null ? ((Number(item.changePassRate) * 100).toFixed(2) + '%') : '--'
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
                    request.reportCentre.examSummary.teacherExamReport(args).then(res => {
                        // global.printLog(res);
                        this.tabTwo.pageLoading = false;
                        if (res.success) {
                            this.tabTwo.total = res.object.examReports.num;
                            this.tabTwo.allExam = res.object.allExam;
                            res.object.examReports.list.forEach(item => {
                                this.tabTwo.data.push({
                                    teacherName: Number(item.teacherName) !== 0 ? item.teacherName : '--',
                                    phone: Number(item.phone)!==0?item.phone:'--',
                                    idNumber: Number(item.idNumber)!==0?item.idNumber:'--',
                                    teacherId: Number(item.teacherId)!==0?item.teacherId:'--',
                                    passTwoCount: item.passTwoCount,
                                    passThreeCount: item.passThreeCount,
                                    allTwoCount: item.allTwoCount,
                                    allThreeCount: item.allThreeCount,
                                    passTwoRate: item.passTwoRate !== null ? ((Number(item.passTwoRate) * 100).toFixed(2) + '%') : '--',
                                    passThreeRate: item.passThreeRate !== null ? ((Number(item.passThreeRate) * 100).toFixed(2) + '%') : '--'
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
            let page, keyWord, beginDate, endDate, curState, carType, isPassed, queryType, args;
            if (this.radioHeaderSel === '考试明细') {
                this.tabThree.data = [];
                this.tabThree.pageLoading = true;
                page = this.tabThree.page;
                let teacherKeyWord = `&teacherKeyWord=${this.tabThree.keyWord !== '' ? this.tabThree.keyWord : ''}`;
                let studentKeyWord = `&studentKeyWord=${this.tabThree.keyWord !== '' ? this.tabThree.keyWord : ''}`;
                try {
                    beginDate = new Date(this.tabThree.dateRange[0]).Format('yyyy-MM-dd');
                    endDate = new Date(this.tabThree.dateRange[1]).Format('yyyy-MM-dd');
                } catch (e) {
                    beginDate = this.tabThree.dateRange[0];
                    endDate = this.tabThree.dateRange[1];
                }
                curState = this.tabThree.curState;
                carType = this.tabThree.carType;
                isPassed = this.tabThree.examPassed;
                queryType = this.tabThree.queryType;
                args = [this.schoolCode, beginDate, endDate, page, this.pageSize, this.tabThree.radio === '1' ? teacherKeyWord : studentKeyWord, queryType, curState, carType, isPassed];
            } else if (this.radioHeaderSel === '绩效核算明细') {
                this.tabFour.data = [];
                this.tabFour.pageLoading = true;
                page = this.tabFour.page;
                let teacherKeyWord = `&teacherKeyWord=${this.tabFour.keyWord !== '' ? this.tabFour.keyWord : ''}`;
                let studentKeyWord = `&studentKeyWord=${this.tabFour.keyWord !== '' ? this.tabFour.keyWord : ''}`;
                try {
                    beginDate = new Date(this.tabFour.dateRange[0]).Format('yyyy-MM-dd');
                    endDate = new Date(this.tabFour.dateRange[1]).Format('yyyy-MM-dd');
                } catch (e) {
                    beginDate = this.tabFour.dateRange[0];
                    endDate = this.tabFour.dateRange[1];
                }
                curState = this.tabFour.curState;
                carType = this.tabFour.carType;
                // isPassed = this.tabFour.examPassed;
                queryType = this.tabFour.queryType;
                args = [this.schoolCode, beginDate, endDate, page, this.pageSize, this.tabFour.radio === '1' ? teacherKeyWord : studentKeyWord, queryType, curState, carType];
            }
            setTimeout(() => {
                if (this.radioHeaderSel === '考试明细') {
                    request.reportCentre.examSummary.teacherExamDetail(args).then(res => {
                        this.tabThree.pageLoading = false;
                        if (res.success) {
                            this.tabThree.total = res.object.num;
                            res.object.list.forEach(item => {
                                this.tabThree.data.push({
                                    teacherName: Number(item.teacherName) !==0 ?item.teacherName:'--',
                                    teacherPhone: Number(item.teacherPhone) !==0 ?item.teacherPhone:'--',
                                    studentName: Number(item.studentName) !==0 ?item.studentName:'--',
                                    studentPhone: Number(item.studentPhone) !==0 ?item.studentPhone:'--',
                                    cardNo: Number(item.cardNo) !==0 ?item.cardNo:'--',
                                    examCarTypeName: Number(item.examCarTypeName) !==0 ?item.examCarTypeName:'--',
                                    examDate: Number(item.examDate) !==0 ?item.examDate:'--',
                                    examStageName: Number(item.examStageName) !==0 ?item.examStageName:'--',
                                    gmtCreate: Number(item.gmtCreate) !==0 ?item.gmtCreate:'--',
                                    isPass: Number(item.isPass) !==0 ?item.isPass:'--',
                                    idNumber: Number(item.idNumber) !==0 ?item.idNumber:'--'
                                });
                            });
                        } else {
                            this.$message({
                                type: 'warning',
                                message: '请求数据失败，原因： ' + res.message
                            });
                        }
                        // global.printLog(res);
                    });
                } else if (this.radioHeaderSel === '绩效核算明细') {
                    request.reportCentre.examSummary.teacherExamDetailPerf(args).then(res => {
                        this.tabFour.pageLoading = false;
                        if (res.success) {
                            this.tabFour.total = res.object.num;
                            res.object.list.forEach(item => {
                                this.tabFour.data.push({
                                    teacherName: Number(item.teacherName) !==0 ?item.teacherName:'--',
                                    teacherPhone: Number(item.teacherPhone) !==0 ?item.teacherPhone:'--',
                                    studentName: Number(item.studentName) !==0 ?item.studentName:'--',
                                    studentPhone: Number(item.studentPhone) !==0 ?item.studentPhone:'--',
                                    cardNo: Number(item.cardNo) !==0 ?item.cardNo:'--',
                                    examCarTypeName: Number(item.examCarTypeName) !==0 ?item.examCarTypeName:'--',
                                    examDate: Number(item.examDate) !==0 ?item.examDate:'--',
                                    examStageName: Number(item.examStageName) !==0 ?item.examStageName:'--',
                                    gmtCreate: Number(item.gmtCreate) !==0 ?item.gmtCreate:'--',
                                    idNumber: Number(item.idNumber) !==0 ?item.idNumber:'--',
                                    appointmentMin: item.appointmentMin,
                                    timerMin: item.timerMin,
                                    appointmentRate: item.appointmentRate !== null ? ((Number(item.appointmentRate) * 100).toFixed(2) + '%') : '--',
                                    timerRate: item.timerRate !== null ? ((Number(item.timerRate) * 100).toFixed(2) + '%') : '--',
                                    isLastTeacher: Number(item.isLastTeacher) !==0 ?item.isLastTeacher:'--',
                                    isExamTeacher: Number(item.isExamTeacher) !==0 ?item.isExamTeacher:'--'
                                });
                            })
                        } else {
                            this.$message({
                                type: 'warning',
                                message: '请求数据失败，原因： ' + res.message
                            });
                        }
                        // global.printLog(res);
                    });
                }
            }, 1000);
        },
        handleCommand() {
            let downLink = document.getElementById("down-link");
            let url = '', beginDate = '', endDate = '', beginDate_ = '', endDate_ = '';
            if (this.radioHeaderSel === '驾校汇总') {
                url = '/sc/examReport/getSchoolExamExport?schoolCode=';
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
                downLink.setAttribute("href", sessionStorage.getItem('baseUrl') + url + this.schoolCode + "&beginTime=" + beginDate + "&endTime=" + endDate + "&isContrast=" + (this.tabOne.checked ? '1' : '0') + '&queryType=' + this.tabOne.queryType + "&currentPage=" + this.tabOne.page + '&pageSize=' + this.pageSize + "&contrastBeginTime=" + beginDate_ + "&contrastEndTime=" + endDate_);
            } else if (this.radioHeaderSel === '教练汇总') {
                url = '/sc/examReport/getTeacherExamExport?schoolCode=';
                try {
                    beginDate = new Date(this.tabTwo.dateRange[0]).Format('yyyy-MM-dd');
                    endDate = new Date(this.tabTwo.dateRange[1]).Format('yyyy-MM-dd');
                } catch (e) {
                    beginDate = this.tabTwo.dateRange[0];
                    endDate = this.tabTwo.dateRange[1];
                }
                downLink.setAttribute("href", sessionStorage.getItem('baseUrl') + url + this.schoolCode + "&beginTime=" + beginDate + "&endTime=" + endDate + "&teacherKeyWord=" + (this.tabTwo.keyWord !== '' ? encodeURI(this.tabTwo.keyWord) : '') + '&queryType=' + this.tabTwo.queryType);
            } else if (this.radioHeaderSel === '考试明细') {
                url = '/sc/examReport/getTeacherExamDetailExport?schoolCode=';
                try {
                    beginDate = new Date(this.tabThree.dateRange[0]).Format('yyyy-MM-dd');
                    endDate = new Date(this.tabThree.dateRange[1]).Format('yyyy-MM-dd');
                } catch (e) {
                    beginDate = this.tabThree.dateRange[0];
                    endDate = this.tabThree.dateRange[1];
                }
                let teacherKeyWord = `&teacherKeyWord=${this.tabThree.keyWord !== '' ? this.tabThree.keyWord : ''}`;
                let studentKeyWord = `&studentKeyWord=${this.tabThree.keyWord !== '' ? this.tabThree.keyWord : ''}`;
                downLink.setAttribute("href", sessionStorage.getItem('baseUrl') + url + this.schoolCode + "&beginTime=" + beginDate + "&endTime=" + endDate + "&queryType=" + this.tabThree.queryType + (this.tabThree.radio === '1' ? encodeURI(teacherKeyWord) : encodeURI(studentKeyWord)) + '&stage=' + this.tabThree.curState + '&carType=' + this.tabThree.carType + '&isPass=' + this.tabThree.examPassed);
                // global.printLog(downLink.href);

            } else if (this.radioHeaderSel === '绩效核算明细') {
                url = '/sc/examReport/getTeacherExamDetailPerfExport?schoolCode=';
                let teacherKeyWord = `&teacherKeyWord=${this.tabFour.keyWord !== '' ? this.tabFour.keyWord : ''}`;
                let studentKeyWord = `&studentKeyWord=${this.tabFour.keyWord !== '' ? this.tabFour.keyWord : ''}`;
                try {
                    beginDate = new Date(this.tabFour.dateRange[0]).Format('yyyy-MM-dd');
                    endDate = new Date(this.tabFour.dateRange[1]).Format('yyyy-MM-dd');
                } catch (e) {
                    beginDate = this.tabFour.dateRange[0];
                    endDate = this.tabFour.dateRange[1];
                }
                downLink.setAttribute("href", sessionStorage.getItem('baseUrl') + url + this.schoolCode + "&beginTime=" + beginDate + "&endTime=" + endDate + (this.tabFour.radio === '1' ? encodeURI(teacherKeyWord) : encodeURI(studentKeyWord)) + "&stage=" + this.tabFour.curState + '&carType=' + this.tabFour.carType + '&queryType=' + this.tabFour.queryType);
            }
            // global.printLog(downLink.href);
            // global.printLog(downLink);
            downLink.click();
        },
        handleCurrentChange(val) {
            if (this.radioHeaderSel === '驾校汇总') {
                this.tabOne.page = val;
                this.querySummary();
            } else if (this.radioHeaderSel === '教练汇总') {
                this.tabTwo.page = val;
                this.querySummary();
            } else if (this.radioHeaderSel === '考试明细') {
                this.tabThree.page = val;
                this.queryDetail();
            }else if(this.radioHeaderSel === '绩效核算明细'){
                this.tabFour.page = val;
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
        this.tabFour.page = 1;
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
.prompt {
    background-image: url('../../assets/images/wenhao.png');
    background-repeat: no-repeat;
    background-position: 85% 50%;
    background-size: 17%;
}

.el-table__footer-wrapper {
    text-align: center;
}
</style>