<template>
    <section v-loading="pageLoading">
        <el-row>
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-select placeholder="请选择阶段" style="width:150px;" v-model="filters.stage" @change="getTimes">
                            <el-option label="全部" value="0"></el-option>
                            <el-option label="科目一" value="1"></el-option>
                            <el-option label="科目二" value="2"></el-option>
                            <el-option label="科目三" value="3"></el-option>
                            <el-option label="科目四" value="4"></el-option>
                        </el-select>
                        <el-date-picker type="daterange" placeholder="选择日期范围" v-model="filters.dateRange" @change="getTimes" format="yyyy-MM-dd" :editable="false">
                        </el-date-picker>
                        <el-input class="search-input mr40" placeholder="输入学员姓名" icon="search" :on-icon-click="getTimes" v-model="filters.keyWord"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="times.data" highlight-current-row @row-click="handleRowClick">
                <el-table-column type="selection" width="35">
                </el-table-column>
                <el-table-column prop="studentName" label="学员">
                </el-table-column>
                <el-table-column prop="teacherName" label="教练">
                </el-table-column>
                <el-table-column prop="cardNo" label="教练车" width="120">
                </el-table-column>
                <el-table-column prop="stageName" label="培训部分">
                </el-table-column>
                <el-table-column prop="trainingTimes" label="培训时段" width="260">
                </el-table-column>
                <el-table-column label="初审有效学时" width="120">
                    <template scope="scope">
                        <p v-bind:style="{ color: (scope.row.auditState===1?'#1F2D3D':(scope.row.auditState===0?'#1D8CE0':'#FF4949')) }">{{scope.row.validStudyMin}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="effectiveProportion" label="有效占比">
                </el-table-column>
                <el-table-column prop="isUpload" label="备案状态" :formatter="formatter">
                </el-table-column>
            </el-table>
            <!--工具条-->
            <el-pagination layout="total,prev,pager,next,jumper" @current-change="handleCurrentChange" :page-size="times.pageSize" :total="times.total">
            </el-pagination>
        </el-row>
        <!--电子教学日志详情-->
        <el-dialog title="电子教学日志详情" v-model="times.detailsFormVisible" :close-on-click-modal="false" size="full" @close="handleClose">
            <!-- 基本信息 -->
            <div class="basic mt0 pt0">
                <el-form v-model="times.detailsForm">
                    <el-row>
                        <p class="mt0 detailForm">
                            <img :src="times.detailsForm.studentPhoto" style="width:40px;height:40px;border-radius:100%;" />
                            <span class="name">学员：{{times.detailsForm.studentName}}</span>
                        </p>
                    </el-row>
                    <el-row>
                        <el-col :span="7">
                            <span>教练：{{times.detailsForm.teacherName}}</span>
                        </el-col>
                        <el-col :span="7">
                            <span>培训部分：{{times.detailsForm.stageName}}</span>
                        </el-col>
                        <el-col :span="7">
                            <span>车牌号：{{times.detailsForm.cardNo}}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="7">
                            <span>培训里程：{{times.detailsForm.mileage===0?times.detailsForm.mileage:times.detailsForm.mileage/1000}}公里</span>
                        </el-col>
                        <el-col :span="7">
                            <span>课程方式：{{times.detailsForm.subjectTypeName}}</span>
                        </el-col>
                        <el-col :span="7">
                            <span>车型：{{times.detailsForm.studyCarTypeName}}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="14">
                            <span>培训时段：{{times.detailsForm.beginTime+'~'+times.detailsForm.endTime}}</span>
                        </el-col>
                        <el-col :span="10">
                            <span>预约时段：{{times.detailsForm.appointmentBeginEndTime}}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <span>本次培训时长：{{times.detailsForm.allStudyMin}}分钟</span>
                        </el-col>
                        <el-col :span="6">
                            <span>有效学时：{{times.detailsForm.validStudyMin}}分钟</span>
                        </el-col>
                        <el-col :span="6">
                            <span>无效学时：{{times.detailsForm.badStudyMin}}分钟</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <p class="ml5">第一部分 已完成:{{times.detailsForm.timeTracking[0].completeTime}} 大纲要求:{{times.detailsForm.timeTracking[0].lowestTime}}</p>
                            <p class="mt5">
                                <el-progress :text-inside="true" :stroke-width="18" :percentage="times.detailsForm.timeTracking[0].completePercent" status="success"></el-progress>
                            </p>
                        </el-col>
                        <el-col :span="2">&nbsp;</el-col>
                        <el-col :span="10">
                            <p class="ml5">第二部分 已完成:{{times.detailsForm.timeTracking[1].completeTime}} 大纲要求:{{times.detailsForm.timeTracking[1].lowestTime}}</p>
                            <p class="mt5">
                                <el-progress :text-inside="true" :stroke-width="18" :percentage="times.detailsForm.timeTracking[1].completePercent" status="success"></el-progress>
                            </p>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <p class="ml5">第三部分 已完成:{{times.detailsForm.timeTracking[2].completeTime}} 大纲要求:{{times.detailsForm.timeTracking[2].lowestTime}}</p>
                            <p class="mt5">
                                <el-progress :text-inside="true" :stroke-width="18" :percentage="times.detailsForm.timeTracking[2].completePercent" status="success"></el-progress>
                            </p>
                        </el-col>
                        <el-col :span="2">&nbsp;</el-col>
                        <el-col :span="10">
                            <p class="ml5">第四部分 已完成:{{times.detailsForm.timeTracking[3].completeTime}} 大纲要求:{{times.detailsForm.timeTracking[3].lowestTime}}</p>
                            <p class="mt5">
                                <el-progress :text-inside="true" :stroke-width="18" :percentage="times.detailsForm.timeTracking[3].completePercent" status="success"></el-progress>
                            </p>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <span>最高时速：{{times.detailsForm.maxSpeed/10}}(km/h)</span>
                        </el-col>
                        <el-col :span="6">
                            <span>最低时速：{{times.detailsForm.minSpeed/10}}(km/h)</span>
                        </el-col>
                        <el-col :span="6">
                            <span>平均时速：{{times.detailsForm.avgSpeed}}(km/h)</span>
                        </el-col>
                    </el-row>
                </el-form>
                <el-radio-group v-model="radioType" class="mt15" @change="radioTypeChange">
                    <el-radio-button label="照片"></el-radio-button>
                    <el-radio-button label="轨迹" :disabled="times.detailsForm.subjectType!==1"></el-radio-button>
                </el-radio-group>
                <div v-if="radioType==='照片'" class="classRecordMin-Photo">
                    <swiper :options="swiperOptionPhoto">
                        <swiper-slide v-for="item in classRecordPhoto.data">
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
                    <el-button type="primary" v-show="times.detailsForm.subjectType===1 && times.showList==false" @click="getClassRecordMin" :loading="times.btnLoading">查看学时分钟</el-button>
                    <el-table :data="classRecordMin.data" v-show="times.detailsForm.subjectType===1 && times.showList==true">
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
                <div v-if="radioType==='轨迹'">
                    <div id="mapContainer" class="mt20"></div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="times.detailsFormVisible = false" size="large">关闭</el-button>
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
            pageLoading: false,
            filters: {
                stage: "",
                dateRange: "",
                keyWord: ""
            },
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
            classRecordMin: {
                data: [],
                para: []
            },
            classRecordPhoto: {
                data: []
            },
            classRecordGPS: {
                data: []
            },
            radioType: "照片",
            swiperOptionPhoto: {
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                slidesPerView: 'auto',
                paginationClickable: true,
                spaceBetween: 30
            },
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode
        }
    },
    methods: {
        formatter(row, column) {
            if (column.property === "isUpload") {
                return global.enums.uploadState[row.isUpload];
            }
        },
        getTimes() {
            this.pageLoading = true;
            this.times.para[0] = this.schoolCode;
            this.times.para[1] = this.filters.stage;
            this.times.para[2] = typeof (this.filters.dateRange[0]) === "undefined" || this.filters.dateRange[0] === null ? "" : new Date(this.filters.dateRange[0]).Format("yyyy-MM-dd");
            this.times.para[3] = typeof (this.filters.dateRange[1]) === "undefined" || this.filters.dateRange[1] === null ? "" : new Date(this.filters.dateRange[1]).Format("yyyy-MM-dd");
            this.times.para[4] = this.filters.keyWord;
            this.times.para[5] = this.times.page;
            this.times.para[6] = global.pageSize;
            setTimeout(() => {
                request.timeTraining.timeAudit.query.list(this.times.para).then((res) => {
                    if (res.success) {
                        this.pageLoading = false;
                        this.times.data = [];
                        let data = res.object.list;
                        this.times.total = res.object.num;
                        for (let item in data) {
                            this.times.data.push({
                                deviceId: data[item].deviceId,
                                classId: data[item].classId,
                                sim: data[item].sim,
                                studentId: data[item].studentId,
                                classRecordId: data[item].classRecordId,
                                studentName: data[item].studentName,
                                teacherName: data[item].teacherName,
                                cardNo: data[item].cardNo,
                                stageName: data[item].stageName,
                                beginTime: data[item].beginTime,
                                endTime: data[item].endTime,
                                trainingTimes: data[item].beginTime + "~" + data[item].endTime.split(" ")[1],
                                appointmentTimes: (data[item].appointmentBeginTime !== null && data[item].appointmentEndTime !== null ? data[item].appointmentBeginTime + "~" + data[item].appointmentEndTime.split(" ")[1] : ""),
                                allStudyMin: data[item].allStudyMin + '分钟',
                                auditState: data[item].auditState,
                                validStudyMin: data[item].auditState === 1 ? data[item].validStudyMin + '分钟' : global.enums.timeAudit.auditState[data[item].auditState],
                                effectiveProportion: (isNaN(data[item].validStudyMin / data[item].allStudyMin) ? 0 : (data[item].validStudyMin / data[item].allStudyMin) * 100).toFixed(2) + '%',
                                mileage: data[item].mileage / 1000 + '公里',
                                isUpload: data[item].isUpload
                            });
                        }
                    }
                });
            }, 1000);
        },
        getTimesDetailById(row) {
            this.curRow = row;
            let studentId = row.studentId;
            let classRecordId = row.classRecordId;
            request.timeTraining.timeAudit.query.detail(classRecordId).then((res) => {
                if (res.success) {
                    this.times.detailsForm = {
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
                            this.times.detailsForm.timeTracking = [];
                            for (let item in data) {
                                this.times.detailsForm.timeTracking.push({
                                    lowestTime: data[item].lowestTime,
                                    completeTime: data[item].completeTime,
                                    completePercent: parseInt(data[item].completePercent)
                                });
                            }
                        }
                    });
                    this.times.detailsFormVisible = true;
                }
            });
            this.getClassRecordPhoto([this.schoolCode, row.sim, row.classId]);
            this.classRecordMin.para = [this.schoolCode, row.sim, row.classId, row.beginTime, row.endTime];
        },
        getClassRecordMin() {
            this.times.btnLoading = true;
            setTimeout(() => {
                let para = this.classRecordMin.para;
                request.timeTraining.timeAudit.query.classRecordMin(para).then((res) => {
                    global.printLog("-----------------Min---------------------");
                    if (res.success) {
                        let data = res.object;
                        this.classRecordMin.data = [];
                        for (let item in data) {
                            this.classRecordMin.data.push({
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
                    this.times.showList = true;
                });
            }, 1000);
        },
        getClassRecordPhoto(para) {
            request.timeTraining.timeAudit.query.classRecordPhoto(para).then((res) => {
                global.printLog("-----------------Photo---------------------");
                if (res.success) {
                    let data = res.object;
                    this.classRecordPhoto.data = [];
                    for (let item in data) {
                        this.classRecordPhoto.data.push({
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
                    this.times.points = [];
                    this.classRecordGPS.data = [];
                    for (let item in data) {
                        if (parseInt(data[item].lng) !== 0 && parseInt(data[item].lat) !== 0) {
                            this.classRecordGPS.data.push({
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
                            this.times.points.push([data[item].lng, data[item].lat]);
                        }
                    }
                    let points = this.times.points;
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
            this.times.showList = false;
            this.classRecordMin.data = [];
            this.times.btnLoading = false;
            this.classRecordPhoto.data = [];
        },
        handleRowClick(row, evt, column) {
            if (column.type === "default") {
                this.radioType = "照片";
                this.getTimesDetailById(row);
            }
        },
        handleCurrentChange(val) {
            this.times.page = val;
            this.getTimes();
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
                            //center: [104.803023, 29.348056],
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
                            initAMapUI();
                            AMapUI.loadUI(["control/BasicControl"], (BasicControl) => {
                                amaps.addControl(new BasicControl.LayerSwitcher({
                                    position: "rt"
                                }));
                            });
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
        }
    },
    activated() {
        global.printLog("activated every one");
        this.getTimes();
    },
    mounted() {
    }
}

</script>

<style lang="scss">
.classRecordMin-Photo {
    overflow: hidden;
    .swiper-container {
        margin: 20px;
        height: auto!important;
        margin-left: auto;
        margin-right: auto;
    }
    .swiper-slide {
        width: 220px;
        min-height: 220px;
        border: 1px solid #dedede;
        background-size: cover;
        padding-bottom: 10px;
        img {
            width: 220px;
            height: 165px;
        }
        p {
            color: #1F2D3D;
        }
        .el-icon-check {
            color: #13CE66;
        }
        .el-icon-close {
            color: #FF4949;
        }
    }
}
</style>