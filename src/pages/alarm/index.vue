<template>
    <section v-loading="pageLoading">
        <el-row class="mb20">
            <el-col :span="24">
                <el-radio-group v-model="alarmTypeLabel" @change="handleMsgTypeChange">
                    <el-radio-button label="全部"></el-radio-button>
                    <el-radio-button label="预约"></el-radio-button>
                    <!--<el-radio-button label="车辆年检"></el-radio-button>
                            <el-radio-button label="车辆保险"></el-radio-button>-->
                    <el-radio-button label="学时审核"></el-radio-button>
                    <el-radio-button label="普通报警"></el-radio-button>
                </el-radio-group>
            </el-col>
            <el-col :span="24" v-show="alarmTypeLabel==='全部'" class="mt20">
                <el-form :inline="true" :model="filters">
                    <el-form-item class="left">
                        <el-date-picker v-model="filters.all.datetime" type="daterange" placeholder="提交时间" :editable="false" @change="handleDateRangeChange"></el-date-picker>
                    </el-form-item>
                    <el-form-item class="left">
                        <el-input class="search-input mr10" v-model="filters.all.keyword" placeholder="输入消息标题查询" icon="search" :on-icon-click="queryAlarms"></el-input>
                    </el-form-item>
                    <el-form-item class="right">
                        <el-button type="primary" @click="noticeRead" :disabled="alarms.readList.length?false:true">标记已读</el-button>
                    </el-form-item>
                </el-form>
                <!--列表-->
                <el-table :data="alarms.all.data" highlight-current-row @row-click="handleTableRowClick" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="35" align="left" :selectable="handleSelecTableChange">
                    </el-table-column>
                    <el-table-column label="标题" width="200" align="left" :show-overflow-tooltip="true">
                        <template scope="scope">
                            <p>
                                <em v-if="!scope.row.read" class="dot"></em>
                                {{scope.row.title}}
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="content" label="内容" align="left" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="创建时间" :formatter="formatter" width="300">
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="alarms.all.total">
                </el-pagination>
            </el-col>
            <el-col :span="24" v-show="alarmTypeLabel==='普通报警'" class="mt20">
                <el-form :inline="true" :model="filters">
                    <el-form-item class="left">
                        <el-date-picker v-model="filters.normal.datetime" type="daterange" placeholder="提交时间" :editable="false" @change="handleDateRangeChange"></el-date-picker>
                    </el-form-item>
                    <el-form-item class="left">
                        <el-input class="search-input mr10" v-model="filters.normal.keyword" placeholder="输入消息标题查询" icon="search" :on-icon-click="queryAlarms"></el-input>
                    </el-form-item>
                    <el-form-item class="right">
                        <el-button type="primary" @click="noticeRead" :disabled="alarms.readList.length?false:true">标记已读</el-button>
                    </el-form-item>
                </el-form>
                <!--列表-->
                <el-table :data="alarms.normal.data" highlight-current-row @row-click="handleTableRowClick" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="35" align="left" :selectable="handleSelecTableChange">
                    </el-table-column>
                    <el-table-column label="标题" width="200" align="left" :show-overflow-tooltip="true">
                        <template scope="scope">
                            <p>
                                <em v-if="!scope.row.read" class="dot"></em>
                                {{scope.row.title}}
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="content" label="内容" align="left" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="创建时间" :formatter="formatter" width="300">
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="alarms.normal.total">
                </el-pagination>
            </el-col>
            <el-col :span="24" v-show="alarmTypeLabel==='车辆年检'" class="mt20">
                <el-form :inline="true" :model="filters">
                    <el-form-item class="left">
                        <el-date-picker v-model="filters.vehiclesAnnualInspection.datetime" type="daterange" placeholder="提交时间" :editable="false" @change="handleDateRangeChange"></el-date-picker>
                    </el-form-item>
                    <el-form-item class="left">
                        <el-input class="search-input mr10" v-model="filters.vehiclesAnnualInspection.keyword" placeholder="输入消息标题查询" icon="search" :on-icon-click="queryAlarms"></el-input>
                    </el-form-item>
                    <el-form-item class="right">
                        <el-button type="primary" @click="noticeRead" :disabled="alarms.readList.length?false:true">标记已读</el-button>
                    </el-form-item>
                </el-form>
                <!--列表-->
                <el-table :data="alarms.vehiclesAnnualInspection.data" highlight-current-row @row-click="handleTableRowClick" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="35" align="left" :selectable="handleSelecTableChange">
                    </el-table-column>
                    <el-table-column label="标题" width="200" align="left" :show-overflow-tooltip="true">
                        <template scope="scope">
                            <p>
                                <em v-if="!scope.row.read" class="dot"></em>
                                {{scope.row.title}}
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="content" label="内容" align="left" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="创建时间" :formatter="formatter" width="300">
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="alarms.vehiclesAnnualInspection.total">
                </el-pagination>
            </el-col>
            <el-col :span="24" v-show="alarmTypeLabel==='车辆保险'" class="mt20">
                <el-form :inline="true" :model="filters">
                    <el-form-item class="left">
                        <el-date-picker v-model="filters.carInsurance.datetime" type="daterange" placeholder="提交时间" :editable="false" @change="handleDateRangeChange"></el-date-picker>
                    </el-form-item>
                    <el-form-item class="left">
                        <el-input class="search-input mr10" v-model="filters.carInsurance.keyword" placeholder="输入消息标题查询" icon="search" :on-icon-click="queryAlarms"></el-input>
                    </el-form-item>
                    <el-form-item class="right">
                        <el-button type="primary" @click="noticeRead" :disabled="alarms.readList.length?false:true">标记已读</el-button>
                    </el-form-item>
                </el-form>
                <!--列表-->
                <el-table :data="alarms.carInsurance.data" highlight-current-row @row-click="handleTableRowClick" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="35" align="left" :selectable="handleSelecTableChange">
                    </el-table-column>
                    <el-table-column label="标题" width="200" align="left" :show-overflow-tooltip="true">
                        <template scope="scope">
                            <p>
                                <em v-if="!scope.row.read" class="dot"></em>
                                {{scope.row.title}}
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="content" label="内容" align="left" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="创建时间" :formatter="formatter" width="300">
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="alarms.carInsurance.total">
                </el-pagination>
            </el-col>
            <el-col :span="24" v-show="alarmTypeLabel==='预约'" class="mt20">
                <el-form :inline="true" :model="filters">
                    <el-form-item class="left">
                        <el-date-picker v-model="filters.appointment.datetime" type="daterange" placeholder="提交时间" :editable="false" @change="handleDateRangeChange"></el-date-picker>
                    </el-form-item>
                    <el-form-item class="left">
                        <el-input class="search-input mr10" v-model="filters.appointment.keyword" placeholder="输入消息标题查询" icon="search" :on-icon-click="queryAlarms"></el-input>
                    </el-form-item>
                    <el-form-item class="right">
                        <el-button type="primary" @click="noticeRead" :disabled="alarms.readList.length?false:true">标记已读</el-button>
                    </el-form-item>
                </el-form>
                <!--列表-->
                <el-table :data="alarms.appointment.data" highlight-current-row @row-click="handleTableRowClick" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="35" align="left" :selectable="handleSelecTableChange">
                    </el-table-column>
                    <el-table-column label="标题" width="200" align="left" :show-overflow-tooltip="true">
                        <template scope="scope">
                            <p>
                                <em v-if="!scope.row.read" class="dot"></em>
                                {{scope.row.title}}
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="content" label="内容" align="left" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="创建时间" :formatter="formatter" width="300">
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="alarms.appointment.total">
                </el-pagination>
            </el-col>
            <el-col :span="24" v-show="alarmTypeLabel==='学时审核'" class="mt20">
                <el-form :inline="true" :model="filters">
                    <el-form-item class="left">
                        <el-date-picker v-model="filters.classRecord.datetime" type="daterange" placeholder="提交时间" :editable="false" @change="handleDateRangeChange"></el-date-picker>
                    </el-form-item>
                    <el-form-item class="left">
                        <el-input class="search-input mr10" v-model="filters.classRecord.keyword" placeholder="输入消息标题查询" icon="search" :on-icon-click="queryAlarms"></el-input>
                    </el-form-item>
                    <el-form-item class="right">
                        <el-button type="primary" @click="noticeRead" :disabled="alarms.readList.length?false:true">标记已读</el-button>
                    </el-form-item>
                </el-form>
                <!--列表-->
                <el-table :data="alarms.classRecord.data" highlight-current-row @row-click="handleTableRowClick" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="35" align="left" :selectable="handleSelecTableChange">
                    </el-table-column>
                    <el-table-column label="标题" width="200" align="left" :show-overflow-tooltip="true">
                        <template scope="scope">
                            <p>
                                <em v-if="!scope.row.read" class="dot"></em>
                                {{scope.row.title}}
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="content" label="内容" align="left" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="创建时间" :formatter="formatter" width="300">
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="alarms.classRecord.total">
                </el-pagination>
            </el-col>
        </el-row>
        <!--详情-->
        <el-dialog title="详情" v-model="alarms.detail.visible" :close-on-click-modal="false" size="small">
            <el-form class="mt30">
                <el-form-item label="标题">
                    {{alarms.detail.title}}
                </el-form-item>
                <el-form-item label="内容">
                    {{alarms.detail.content}}
                    <a href="javascript:;" v-if="alarms.detail.extra!==null&&typeof(alarms.detail.extra)==='object'" v-show="alarms.detail.extra.target==='car_insurance'||alarms.detail.extra.target==='class_record'" class="right" @click="handleShowDetailForm(alarms.detail.extra)">查看详情</a>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="large" @click.native="alarms.detail.visible = false">关闭</el-button>
            </div>
        </el-dialog>
        <!--电子教学日志详情-->
        <el-dialog title="电子教学日志详情" v-model="alarms.classRecord.times.detailsFormVisible" :close-on-click-modal="false" size="full" @close="handleClose">
            <!-- 基本信息 -->
            <div class="basic mt0 pt0">
                <el-form v-model="alarms.classRecord.times.detailsForm">
                    <el-row>
                        <p class="mt0 detailForm">
                            <img :src="alarms.classRecord.times.detailsForm.studentPhoto" style="width:40px;height:40px;border-radius:100%;" />
                            <span class="name">学员：{{alarms.classRecord.times.detailsForm.studentName}}</span>
                        </p>
                    </el-row>
                    <el-row>
                        <el-col :span="7">
                            <span>教练：{{alarms.classRecord.times.detailsForm.teacherName}}</span>
                        </el-col>
                        <el-col :span="7">
                            <span>培训部分：{{alarms.classRecord.times.detailsForm.stageName}}</span>
                        </el-col>
                        <el-col :span="7">
                            <span>车牌号：{{alarms.classRecord.times.detailsForm.cardNo}}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="7">
                            <span>培训里程：{{alarms.classRecord.times.detailsForm.mileage===0?alarms.classRecord.times.detailsForm.mileage:alarms.classRecord.times.detailsForm.mileage/1000}}公里</span>
                        </el-col>
                        <el-col :span="7">
                            <span>课程方式：{{alarms.classRecord.times.detailsForm.subjectTypeName}}</span>
                        </el-col>
                        <el-col :span="7">
                            <span>车型：{{alarms.classRecord.times.detailsForm.studyCarTypeName}}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="14">
                            <span>培训时段：{{alarms.classRecord.times.detailsForm.beginTime+'~'+alarms.classRecord.times.detailsForm.endTime}}</span>
                        </el-col>
                        <el-col :span="10">
                            <span>预约时段：{{alarms.classRecord.times.detailsForm.appointmentBeginEndTime}}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <span>本次培训时长：{{alarms.classRecord.times.detailsForm.allStudyMin}}分钟</span>
                        </el-col>
                        <el-col :span="6">
                            <span>有效学时：{{alarms.classRecord.times.detailsForm.validStudyMin}}分钟</span>
                        </el-col>
                        <el-col :span="6">
                            <span>无效学时：{{alarms.classRecord.times.detailsForm.badStudyMin}}分钟</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <p class="ml5">第一部分 已完成:{{alarms.classRecord.times.detailsForm.timeTracking[0].completeTime}} 大纲要求:{{alarms.classRecord.times.detailsForm.timeTracking[0].lowestTime}}</p>
                            <p class="mt5">
                                <el-progress :text-inside="true" :stroke-width="18" :percentage="alarms.classRecord.times.detailsForm.timeTracking[0].completePercent" status="success"></el-progress>
                            </p>
                        </el-col>
                        <el-col :span="2">&nbsp;</el-col>
                        <el-col :span="10">
                            <p class="ml5">第二部分 已完成:{{alarms.classRecord.times.detailsForm.timeTracking[1].completeTime}} 大纲要求:{{alarms.classRecord.times.detailsForm.timeTracking[1].lowestTime}}</p>
                            <p class="mt5">
                                <el-progress :text-inside="true" :stroke-width="18" :percentage="alarms.classRecord.times.detailsForm.timeTracking[1].completePercent" status="success"></el-progress>
                            </p>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <p class="ml5">第三部分 已完成:{{alarms.classRecord.times.detailsForm.timeTracking[2].completeTime}} 大纲要求:{{alarms.classRecord.times.detailsForm.timeTracking[2].lowestTime}}</p>
                            <p class="mt5">
                                <el-progress :text-inside="true" :stroke-width="18" :percentage="alarms.classRecord.times.detailsForm.timeTracking[2].completePercent" status="success"></el-progress>
                            </p>
                        </el-col>
                        <el-col :span="2">&nbsp;</el-col>
                        <el-col :span="10">
                            <p class="ml5">第四部分 已完成:{{alarms.classRecord.times.detailsForm.timeTracking[3].completeTime}} 大纲要求:{{alarms.classRecord.times.detailsForm.timeTracking[3].lowestTime}}</p>
                            <p class="mt5">
                                <el-progress :text-inside="true" :stroke-width="18" :percentage="alarms.classRecord.times.detailsForm.timeTracking[3].completePercent" status="success"></el-progress>
                            </p>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <span>最高时速：{{alarms.classRecord.times.detailsForm.maxSpeed/10}}(km/h)</span>
                        </el-col>
                        <el-col :span="6">
                            <span>最低时速：{{alarms.classRecord.times.detailsForm.minSpeed/10}}(km/h)</span>
                        </el-col>
                        <el-col :span="6">
                            <span>平均时速：{{alarms.classRecord.times.detailsForm.avgSpeed}}(km/h)</span>
                        </el-col>
                    </el-row>
                </el-form>
                <el-radio-group v-model="alarms.classRecord.radioType" class="mt15" @change="radioTypeChange">
                    <el-radio-button label="照片"></el-radio-button>
                    <el-radio-button label="轨迹" :disabled="alarms.classRecord.times.detailsForm.subjectType!==1"></el-radio-button>
                </el-radio-group>
                <div v-if="alarms.classRecord.radioType==='照片'" class="classRecordMin-Photo">
                    <swiper :options="alarms.classRecord.swiperOptionPhoto">
                        <swiper-slide v-for="item in alarms.classRecord.photo.data">
                            <img v-bind:src="item.photosUrl" class="photo" />
                            <p class="t-center mt5">
                                {{item.photosTypeText}}
                                <i v-if="item.auditScore!==-1" :class="[item.auditScore>=70?'el-icon-check':'el-icon-close']"></i>
                            </p>
                            <p class="t-center mt5">{{item.photoTime}}</p>
                        </swiper-slide>
                        <div class="swiper-button-prev" slot="button-prev"></div>
                        <div class="swiper-button-next" slot="button-next"></div>
                    </swiper>
                    <el-button type="primary" v-show="alarms.classRecord.times.detailsForm.subjectType===1 && alarms.classRecord.times.showList==false" @click="getClassRecordMin" :loading="alarms.classRecord.times.btnLoading">查看学时分钟</el-button>
                    <el-table :data="alarms.classRecord.min.data" v-show="alarms.classRecord.times.detailsForm.subjectType===1 && alarms.classRecord.times.showList==true">
                        <el-table-column type="expand">
                            <template scope="scope">
                                <el-form label-position="left" inline class="table-expand">
                                    <el-form-item label="记录时间">
                                        <span>{{ scope.row.studyTime }}</span>
                                    </el-form-item>
                                    <el-form-item label="最大速度(km/h)">
                                        <span>{{ scope.row.maxSpeed }}</span>
                                    </el-form-item>
                                    <el-form-item label="行驶记录速度(km/h)">
                                        <span>{{ scope.row.recordSpeed }}</span>
                                    </el-form-item>
                                    <el-form-item label="发动机转速(r/min)">
                                        <span>{{ scope.row.engineSpeed }}</span>
                                    </el-form-item>
                                    <el-form-item label="行驶里程(km)">
                                        <span>{{ scope.row.minMileage }}</span>
                                    </el-form-item>
                                    <el-form-item label="记录状态">
                                        <span>{{ scope.row.state }}</span>
                                    </el-form-item>
                                    <el-form-item label="审核结果">
                                        <span>{{ scope.row.auditState }}</span>
                                    </el-form-item>
                                    <el-form-item label="初审原因">
                                        <span>{{ scope.row.remark }}</span>
                                    </el-form-item>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column prop="studyTime" label="时间" width="190">
                        </el-table-column>
                        <el-table-column prop="maxSpeed" label="最大速度(km/h)">
                        </el-table-column>
                        <el-table-column prop="recordSpeed" label="行驶记录速度(km/h)">
                        </el-table-column>
                        <el-table-column prop="engineSpeed" label="发动机转速(r/min)">
                        </el-table-column>
                        <el-table-column prop="minMileage" label="行驶里程(km)" width="140">
                        </el-table-column>
                        <el-table-column prop="auditState" label="审核结果" width="100">
                        </el-table-column>
                    </el-table>
                </div>
                <div v-if="alarms.classRecord.radioType==='轨迹'">
                    <div id="mapContainer" class="mt20"></div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="alarms.classRecord.times.detailsFormVisible = false" size="large">关闭</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
var amaps, amapLoad = false;
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        return {
            pageSize: 10,
            filters: {
                all: {
                    keyword: "",
                    datetime: []
                },
                normal: {
                    keyword: "",
                    datetime: []
                },
                vehiclesAnnualInspection: {
                    keyword: "",
                    datetime: []
                },
                carInsurance: {
                    keyword: "",
                    datetime: []
                },
                appointment: {
                    keyword: "",
                    datetime: []
                },
                classRecord: {
                    keyword: "",
                    datetime: []
                }
            },
            alarms: {
                all: {
                    data: [],
                    total: 0,
                    curPage: 1
                },
                normal: {
                    data: [],
                    total: 0,
                    curPage: 1
                },
                vehiclesAnnualInspection: {
                    data: [],
                    total: 0,
                    curPage: 1
                },
                carInsurance: {
                    data: [],
                    total: 0,
                    curPage: 1
                },
                appointment: {
                    data: [],
                    total: 0,
                    curPage: 1
                },
                classRecord: {
                    data: [],
                    total: 0,
                    curPage: 1,
                    times: {
                        para: [],
                        data: [],
                        page: 1,
                        total: 0,
                        points: [],
                        curRow: "",
                        detailsForm: {
                            studentName: "",
                            teacherName: "",
                            stageName: "",
                            cardNo: "",
                            mileage: "",
                            subjectType: 0,
                            subjectTypeName: "",
                            studyCarTypeName: "",
                            beginTime: "",
                            endTime: "",
                            appointmentBeginTime: "",
                            appointmentEndTime: "",
                            allStudyMin: "",
                            validStudyMin: "",
                            badStudyMin: "",
                            maxSpeed: "",
                            minSpeed: "",
                            avgSpeed: "",
                            timeTracking: [{
                                completePercent: "",
                                completeTime: "",
                                lowestTime: ""
                            }, {
                                completePercent: "",
                                completeTime: "",
                                lowestTime: ""
                            }, {
                                completePercent: "",
                                completeTime: "",
                                lowestTime: ""
                            }, {
                                completePercent: "",
                                completeTime: "",
                                lowestTime: ""
                            }]
                        },
                        showList: false,
                        btnLoading: false,
                        detailsFormVisible: false
                    },
                    min: {
                        data: [],
                        para: []
                    },
                    photo: {
                        data: []
                    },
                    gps: {
                        data: []
                    },
                    radioType: "照片",
                    swiperOptionPhoto: {
                        nextButton: '.swiper-button-next',
                        prevButton: '.swiper-button-prev',
                        slidesPerView: 'auto',
                        paginationClickable: true,
                        spaceBetween: 30
                    }
                },
                readList: [],
                detail: {
                    visible: false,
                    title: "",
                    content: "",
                    date: "",
                    extra: ""
                }
            },
            alarmTypeName: "",
            alarmTypeLabel: "全部",
            pageLoading: false,
            userId: JSON.parse(sessionStorage.getItem("user")).userId,
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode
        }
    },
    methods: {
        //格式化数据
        formatter(row, column) {
            if (column.property === "gmtCreate") {
                return new Date(row.gmtCreate).Format("yyyy-MM-dd HH:mm:ss");
            }
        },
        //查询报警
        queryAlarms() {
            this.pageLoading = true;
            this.alarms.readList = [];
            let typeName = this.alarmTypeName;
            let para = [this.schoolCode, "WARNING", this.userId, "SCHOOL", typeName, 1, this.pageSize, "", "", ""];
            if (typeName === "normal") {
                para[5] = this.alarms.normal.curPage;
                para[7] = this.filters.normal.keyword;
                if (this.filters.normal.datetime.length) {
                    para[8] = new Date(this.filters.normal.datetime[0]).Format("yyyy-MM-dd") + " 00:00:00";
                    para[9] = new Date(this.filters.normal.datetime[1]).Format("yyyy-MM-dd") + " 23:59:59";
                }
            }
            else if (typeName === "car_annualcheck") {
                para[5] = this.alarms.vehiclesAnnualInspection.curPage;
                para[7] = this.filters.vehiclesAnnualInspection.keyword;
                if (this.filters.vehiclesAnnualInspection.datetime.length) {
                    para[8] = new Date(this.filters.vehiclesAnnualInspection.datetime[0]).Format("yyyy-MM-dd") + " 00:00:00";
                    para[9] = new Date(this.filters.vehiclesAnnualInspection.datetime[1]).Format("yyyy-MM-dd") + " 23:59:59";
                }
            }
            else if (typeName === "car_insurance") {
                para[5] = this.alarms.carInsurance.curPage;
                para[7] = this.filters.carInsurance.keyword;
                if (this.filters.carInsurance.datetime.length) {
                    para[8] = new Date(this.filters.carInsurance.datetime[0]).Format("yyyy-MM-dd") + " 00:00:00";
                    para[9] = new Date(this.filters.carInsurance.datetime[1]).Format("yyyy-MM-dd") + " 23:59:59";
                }
            }
            else if (typeName === "appointment") {
                para[5] = this.alarms.appointment.curPage;
                para[7] = this.filters.appointment.keyword;
                if (this.filters.appointment.datetime.length) {
                    para[8] = new Date(this.filters.appointment.datetime[0]).Format("yyyy-MM-dd") + " 00:00:00";
                    para[9] = new Date(this.filters.appointment.datetime[1]).Format("yyyy-MM-dd") + " 23:59:59";
                }
            }
            else if (typeName === "class_record") {
                para[5] = this.alarms.classRecord.curPage;
                para[7] = this.filters.classRecord.keyword;
                if (this.filters.classRecord.datetime.length) {
                    para[8] = new Date(this.filters.classRecord.datetime[0]).Format("yyyy-MM-dd") + " 00:00:00";
                    para[9] = new Date(this.filters.classRecord.datetime[1]).Format("yyyy-MM-dd") + " 23:59:59";
                }
            }
            else {
                para[5] = this.alarms.all.curPage;
                para[7] = this.filters.all.keyword;
                if (this.filters.all.datetime.length) {
                    para[8] = new Date(this.filters.all.datetime[0]).Format("yyyy-MM-dd") + " 00:00:00";
                    para[9] = new Date(this.filters.all.datetime[1]).Format("yyyy-MM-dd") + " 23:59:59";
                }
            }
            setTimeout(() => {
                request.notice.query.list(para).then((res) => {
                    this.pageLoading = false;
                    if (res.success) {
                        let data = res.object.list;
                        let total = res.object.num;
                        if (typeName === "normal") {
                            this.alarms.normal.data = data;
                            this.alarms.normal.total = total;
                        }
                        else if (typeName === "car_annualcheck") {
                            this.alarms.vehiclesAnnualInspection.data = data;
                            this.alarms.vehiclesAnnualInspection.total = total;
                        }
                        else if (typeName === "car_insurance") {
                            this.alarms.carInsurance.data = data;
                            this.alarms.carInsurance.total = total;
                        }
                        else if (typeName === "appointment") {
                            this.alarms.appointment.data = data;
                            this.alarms.appointment.total = total;
                        }
                        else if (typeName === "class_record") {
                            global.printLog(data);
                            this.alarms.classRecord.data = data;
                            this.alarms.classRecord.total = total;
                        }
                        else {
                            this.alarms.all.data = data;
                            this.alarms.all.total = total;
                        }
                    }
                });
            }, 500);
        },
        //报警置为已读
        noticeRead() {
            let para = [this.alarms.readList.join(","), this.userId];
            request.notice.reading(para).then((res) => {
                this.pageLoading = false;
                if (res.success) {
                    this.$message.success("操作成功");
                    this.queryAlarms();
                }
                else {
                    this.$message.error("操作失败");
                }
            });
        },
        //列表翻页查询
        handleCurrentChange(val) {
            if (this.alarmTypeName === "normal") {
                this.alarms.normal.curPage = val;
            }
            else if (this.alarmTypeName === "car_annualcheck") {
                this.alarms.vehiclesAnnualInspection.curPage = val;
            }
            else if (this.alarmTypeName === "car_insurance") {
                this.alarms.carInsurance.curPage = val;
            }
            else if (this.alarmTypeName === "appointment") {
                this.alarms.appointment.curPage = val;
            }
            else if (this.alarmTypeName === "class_record") {
                this.alarms.classRecord.curPage = val;
            }
            else {
                this.alarms.all.curPage = val;
            }
            this.queryAlarms();
        },
        //控制列表中复选框是否可选
        handleSelecTableChange(row) {
            return row.read ? false : true;
        },
        //选中需要已读的报警
        handleSelectionChange(data) {
            this.alarms.readList = [];
            for (let item in data) {
                this.alarms.readList.push(data[item].id);
            }
        },
        //点击报警列表查看详情
        handleTableRowClick(row, evt, column) {
            if (column.type === "default") {
                global.printLog(row);
                this.alarms.detail = {
                    title: row.title,
                    content: row.content,
                    date: new Date(row.gmtCreate).Format("yyyy-MM-dd HH:mm:ss"),
                    visible: false,
                    extra: row.extra
                }
                this.alarms.detail.visible = true;
                //标记已读
                request.notice.reading([row.id, this.userId]).then((res) => {
                    if (res.success) {
                        row.read = true;
                    }
                });
            }
        },
        //切换类型查询
        handleMsgTypeChange() {
            this.queryAlarms();
        },
        handleDateRangeChange(val) {
            if (val === "") {
                this.filters.all.datetime = [];
                this.filters.normal.datetime = [];
                this.filters.appointment.datetime = [];
                this.filters.classRecord.datetime = [];
                this.filters.carInsurance.datetime = [];
                this.filters.vehiclesAnnualInspection.datetime = [];
            }
            this.queryAlarms();
        },
        handleShowDetailForm(data) {
            let paras = data.param;
            if (data.target === "class_record") {
                let jsonData = JSON.parse(paras);
                this.getTimesDetailById(jsonData);
            }
            else if (data.target === "car_insurance") {
            }
        },
        radioTypeChange(val) {
            if (val === "轨迹") {
                this.initMap();
            }
        },
        initMap() {
            var interval = setInterval(() => {
                if (window._amapInit) {
                    clearInterval(interval);
                    this.$message.success({ message: "地图已加载完成^_^" });
                    setTimeout(() => {
                        amapLoad = true;
                        amaps = new AMap.Map("mapContainer", {
                            resizeEnable: true,
                            zoom: 11,
                            // center: [104.803023, 29.348056],
                            expandZoomRange: true,
                            zooms: [3, 20]
                        });
                        let tranningPicture = this.$store.state.tranningPicture;
                        for (let item in tranningPicture) {
                            let upLeft = [tranningPicture[item].upLeft.longitude, tranningPicture[item].upLeft.latitude];
                            let downRight = [tranningPicture[item].downRight.longitude, tranningPicture[item].downRight.latitude];
                            new AMap.ImageLayer({
                                url: tranningPicture[item].picUrl,
                                bounds: new AMap.Bounds(
                                    upLeft,
                                    downRight
                                ),
                                zooms: [3, 20]
                            }).setMap(amaps);
                        }
                        amaps.on("complete", () => {
                            this.getClassRecordGPS([this.schoolCode, this.curRow.sim, this.curRow.beginTime, this.curRow.endTime]);
                        });
                    }, 50);
                }
            }, 50);
        },
        initTrack(points) {
            var marker = new AMap.Marker({
                map: amaps,
                position: points[0],
                icon: "http://webapi.amap.com/images/car.png",
                offset: new AMap.Pixel(-26, -13),
                autoRotation: true
            });
            var polyline = new AMap.Polyline({
                map: amaps,
                path: points, //设置线覆盖物路径
                strokeColor: "#21364c",
                strokeWeight: 3 //线宽
            });
            var passedPolyline = new AMap.Polyline({
                map: amaps,
                strokeColor: "#20a0ff",
                strokeWeight: 3
            });

            marker.on("moving", function (e) {
                passedPolyline.setPath(e.passedPath);
            });
            amaps.setFitView();

            setTimeout(function () {
                marker.moveAlong(points, 30);
            }, 100);

            marker.on("click", function () {
                marker.stopMove();
                marker.moveAlong(points, 30);
            });
        },
        getTimesDetailById(row) {
            global.printLog(row);
            this.curRow = row;
            let studentId = row.studentId;
            let classRecordId = row.classRecordId;
            request.timeTraining.timeAudit.query.detail(classRecordId).then((res) => {
                if (res.success) {
                    this.alarms.classRecord.times.detailsForm = {
                        studentPhoto: res.object.studentPhoto,
                        studentName: res.object.studentName,
                        teacherName: res.object.teacherName,
                        stageName: res.object.stageName,
                        cardNo: res.object.cardNo,
                        mileage: res.object.mileage,
                        subjectType: res.object.subjectType,
                        subjectTypeName: res.object.subjectTypeName,
                        studyCarTypeName: res.object.studyCarTypeName,
                        beginTime: res.object.beginTime,
                        endTime: res.object.endTime.split(" ")[1],
                        appointmentBeginEndTime: (res.object.appointmentBeginTime !== null ? res.object.appointmentBeginTime + "~" : "") + (res.object.appointmentEndTime !== null ? res.object.appointmentEndTime : ""),
                        allStudyMin: res.object.allStudyMin,
                        validStudyMin: res.object.validStudyMin,
                        badStudyMin: res.object.badStudyMin,
                        maxSpeed: res.object.maxSpeed,
                        minSpeed: res.object.minSpeed,
                        avgSpeed: res.object.avgSpeed,
                        timeTracking: [{
                            lowestTime: "",
                            completeTime: "",
                            completePercent: 0
                        }, {
                            lowestTime: "",
                            completeTime: "",
                            completePercent: 0
                        }, {
                            lowestTime: "",
                            completeTime: "",
                            completePercent: 0
                        }, {
                            lowestTime: "",
                            completeTime: "",
                            completePercent: 0
                        }]
                    }
                    request.basic.student.query.timeTraceInfo(studentId).then((res) => {
                        if (res.success) {
                            let data = res.object;
                            this.alarms.classRecord.times.detailsForm.timeTracking = [];
                            for (let item in data) {
                                this.alarms.classRecord.times.detailsForm.timeTracking.push({
                                    lowestTime: data[item].lowestTime,
                                    completeTime: data[item].completeTime,
                                    completePercent: parseInt(data[item].completePercent)
                                });
                            }
                        }
                    });
                    this.alarms.classRecord.times.detailsFormVisible = true;
                }
            });
            this.getClassRecordPhoto([this.schoolCode, row.sim, row.classId]);
            this.alarms.classRecord.min.para = [this.schoolCode, row.sim, row.classId, row.beginTime, row.endTime];
        },
        getClassRecordMin() {
            this.alarms.classRecord.times.btnLoading = true;
            setTimeout(() => {
                let para = this.alarms.classRecord.min.para;
                request.timeTraining.timeAudit.query.classRecordMin(para).then((res) => {
                    global.printLog("-----------------Min---------------------");
                    if (res.success) {
                        let data = res.object;
                        this.alarms.classRecord.min.data = [];
                        for (let item in data) {
                            this.alarms.classRecord.min.data.push({
                                studyTime: data[item].studyTime,
                                maxSpeed: data[item].maxSpeed / 10,
                                recordSpeed: data[item].recordSpeed / 10,
                                engineSpeed: data[item].engineSpeed,
                                minMileage: data[item].minMileage/10,
                                state: data[item].state === 0 ? "正常" : "异常",
                                auditState: data[item].auditState === 1 ? "合格" : "不合格",
                                remark: data[item].remark,
                            });
                        }
                    }
                    this.alarms.classRecord.times.showList = true;
                });
            }, 1000);
        },
        getClassRecordPhoto(para) {
            request.timeTraining.timeAudit.query.classRecordPhoto(para).then((res) => {
                global.printLog("-----------------Photo---------------------");
                if (res.success) {
                    let data = res.object;
                    this.alarms.classRecord.photo.data = [];
                    for (let item in data) {
                        this.alarms.classRecord.photo.data.push({
                            photoTime: data[item].photoTime,
                            photosUrl: data[item].photosUrl,
                            photosType: data[item].photosType,
                            photosTypeText: global.enums.timeAudit.photosType[data[item].photosType],
                            auditScore: data[item].auditScore
                        });
                    }
                }
            });
        },
        getClassRecordGPS(para) {
            request.timeTraining.timeAudit.query.classRecordGPS(para).then((res) => {
                global.printLog("-----------------GPS---------------------");
                if (res.success) {
                    let data = res.object;
                    this.alarms.classRecord.gps.data = [];
                    this.alarms.classRecord.times.points = [];
                    for (let item in data) {
                        if (parseInt(data[item].lng) !== 0 && parseInt(data[item].lat) !== 0) {
                            this.alarms.classRecord.gps.data.push({
                                addTime: data[item].addTime,
                                alarmFlag: data[item].alarmFlag,
                                carNumber: data[item].carNumber,
                                deviceId: data[item].deviceId,
                                direction: data[item].direction,
                                lat: data[item].lat,
                                lng: data[item].lng,
                                locSpeed: data[item].locSpeed,
                                schoolCode: data[item].schoolCode,
                                sim: data[item].sim,
                                status: data[item].status,
                                time: data[item].time,
                                travelSpeed: data[item].travelSpeed
                            });
                            this.alarms.classRecord.times.points.push([data[item].lng, data[item].lat]);
                        }
                    }
                    let points = this.alarms.classRecord.times.points;
                    if (points.length) {
                        this.initTrack(points);
                    }
                    else {
                        this.$message.warning("暂无轨迹数据");
                    }
                }
            });
        },
        handleClose() {
            this.alarms.classRecord.min.data = [];
            this.alarms.classRecord.photo.data = [];
            this.alarms.classRecord.times.showList = false;
            this.alarms.classRecord.times.btnLoading = false;
        }
    },
    activated() {
        global.printLog("activated every one");
        this.queryAlarms();
    },
    watch: {
        alarmTypeLabel() {
            this.alarmTypeName = global.enums.messagesType[this.alarmTypeLabel];
        }
    },
    mounted() {
    }
}

</script>