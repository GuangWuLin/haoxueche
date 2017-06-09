k
<template>
    <section>
        <el-row class="mb20">
            <el-col :span="20">
                <el-radio-group v-model="monitorType" @change="handleTypeChange">
                    <el-radio-button label="实时监控"></el-radio-button>
                    <el-radio-button label="历史照片"></el-radio-button>
                    <el-radio-button label="历史轨迹"></el-radio-button>
                </el-radio-group>
            </el-col>
        </el-row>
        <el-row v-show="monitorType==='实时监控'">
            <div id="mapContainer"></div>
            <section class="tool">
                <header class="toolbox" @click="handleBack">
                    <ul>
                        <li title="总车辆">
                            <em class="glyph-icon icon-cheliang total"></em>{{monitor.cars.all.length}}辆</li>
                        <li title="在线车辆">
                            <em class="glyph-icon icon-cheliang online"></em>{{monitor.cars.online.length}}辆</li>
                        <li title="培训中">
                            <em class="glyph-icon icon-cheliang tranning"></em>{{monitor.cars.tranning.length}}辆</li>
                    </ul>
                </header>
            </section>
            <transition name="el-zoom-in-top">
                <div v-if="resultsBoxShow" class="results-box">
                    <ul>
                        <li>
                            <a href="javascript:;" v-for="item in monitor.cars.all" @click="handlePos(item)">
                                <p class="left">{{item.carNo+" "+item.sim}}</p>
                                <p class="right">
                                    <em v-bind:class="{ 'offline': item.isOnline===0, 'online': item.isOnline===1, 'tranning': item.isOnline===2 }">
                                        {{item.isOnline===1?'在线':(item.isOnline===2?'培训中':'离线')}}
                                    </em>
                                </p>
                            </a>
                        </li>
                    </ul>
                </div>
            </transition>
            <transition name="el-zoom-in-top">
                <div v-if="resultsDetailBoxShow">
                    <div class="results-box">
                        <p>
                            <a href="javascript:" class="glyph-icon icon-close right mt5" style="color:#000;font-size:1.15em;" @click="handleBack"></a>
                        </p>
                        <div class="results-box-inner">
                            <div class="top-info" v-if="monitor.cars.detail.isOnline===2">
                                <div class="info-item">
                                    <div class="item-pics">
                                        <div class="left">
                                            <img :src="monitor.cars.detail.studentPhoto" />
                                            <p class="mt5">学员：{{monitor.cars.detail.studentName}}</p>
                                        </div>
                                        <div class="right">
                                            <img :src="monitor.cars.detail.teacherPhoto" />
                                            <p class="mt5">教练：{{monitor.cars.detail.teacherName}}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <el-row class="mt20 mb15 ml15">
                                        <el-col :span="14">
                                            <span>车牌：{{monitor.cars.detail.carNo}}</span>
                                        </el-col>
                                        <el-col :span="10">
                                            <span>培训部分：{{monitor.cars.detail.stageName}}</span>
                                        </el-col>
                                    </el-row>
                                    <el-row class="mt15 mb15 ml15">
                                        <el-col :span="14">
                                            <span>签到：{{monitor.cars.detail.signInTime}}</span>
                                        </el-col>
                                        <el-col :span="10">
                                            <span>培训学时：{{monitor.cars.detail.tranningTime}}分</span>
                                        </el-col>
                                    </el-row>
                                    <el-row class="mt15 mb15 ml15">
                                        <el-col :span="12">
                                            <span>当前速度：{{monitor.cars.detail.travelSpeed}}</span>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                            <div class="info-item">
                                <div class="item-bar">
                                    <el-button type="text" class="left" @click="monitorType='历史照片'">历史照片</el-button>
                                    <el-button type="text" class="right" @click="monitorType='历史轨迹'">历史轨迹</el-button>
                                </div>
                            </div>
                            <div class="mb20" v-if="monitor.cars.detail.isOnline===2&&monitor.capturePhoto!==''">
                                <div v-if="capturePhotoShow">
                                    <p class="mt15 mb15 ml15">{{monitor.cars.detail.photoDateTime}}</p>
                                    <img :src="monitor.capturePhoto" class="photo" />
                                </div>
                            </div>
                            <div v-if="!capturePhotoShow" style="height:100px;">
                                <div v-loading="true" style="height:80px;" element-loading-text="照片抓拍中..."></div>
                            </div>
                        </div>
                    </div>
                    <transition name="el-fade-in">
                        <a class="capturePhoto" href="javascript:" @click="queryCapturePhoto" v-if="monitor.cars.detail.isOnline===2&&capturePhotoShow">
                            <em class="inner">
                                <i class="glyph-icon icon-paizhao"></i>
                            </em>
                        </a>
                    </transition>
                </div>
            </transition>
        </el-row>
        <el-row v-show="monitorType==='历史照片'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-form :inline="true">
                    <el-form-item>
                        <el-date-picker v-if="dateVisible" type="daterange" placeholder="选择日期范围" v-model="monitor.photo.filter.date" :clearable="false" :editable="false" @change="queryHistoryPhoto"></el-date-picker>
                        <el-select placeholder="请选择车辆" v-model="monitor.photo.filter.sim" @change="queryHistoryPhoto">
                            <el-option v-for="item in monitor.cars.all" :label="item.carNo" :value="item.sim"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <!--列表-->
                <el-table :data="monitor.photo.data">
                    <el-table-column prop="studentName" label="学员">
                    </el-table-column>
                    <el-table-column prop="teacherName" label="教练">
                    </el-table-column>
                    <el-table-column prop="photosType" label="图片类型" :formatter="formatter">
                    </el-table-column>
                    <el-table-column prop="photoTime" label="图片拍摄时间">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="text" size="small" @click.stop="handleLookPhoto(scope.row)">查看图片</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="10" :total="monitor.photo.total">
                </el-pagination>
            </el-col>
        </el-row>
        <el-row v-show="monitorType==='历史轨迹'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-form :inline="true">
                    <el-form-item>
                        <el-date-picker v-if="dateVisible" type="date" placeholder="选择日期" v-model="monitor.track.filter.date" @change="queryHistoryGPS" :clearable="false" :editable="false"></el-date-picker>
                        <el-select placeholder="请选择车辆" v-model="monitor.track.filter.sim" @change="queryHistoryGPS">
                            <el-option v-for="item in monitor.cars.all" :label="item.carNo" :value="item.sim"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div id="mapContainer1"></div>
                <!--列表-->
                <el-table :data="monitor.track.times.data" class="mt20">
                    <el-table-column prop="studentName" label="学员">
                    </el-table-column>
                    <el-table-column prop="teacherName" label="教练">
                    </el-table-column>
                    <el-table-column prop="cardNo" label="教练车">
                    </el-table-column>
                    <el-table-column prop="stageName" label="培训部分">
                    </el-table-column>
                    <el-table-column prop="trainingTimes" label="培训时段" width="220">
                    </el-table-column>
                    <el-table-column prop="appointmentTimes" label="预约时段" width="220">
                    </el-table-column>
                    <el-table-column prop="allStudyMin" label="培训学时">
                    </el-table-column>
                    <el-table-column label="初审有效学时" width="120">
                        <template scope="scope">
                            <p v-bind:style="{ color: (scope.row.auditState===1?'#1F2D3D':(scope.row.auditState===0?'#1D8CE0':'#FF4949')) }">{{scope.row.validStudyMin}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="effectiveProportion" label="有效占比">
                    </el-table-column>
                    <el-table-column prop="mileage" label="培训里程">
                    </el-table-column>
                    <el-table-column prop="isUpload" label="备案状态" :formatter="formatter">
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="10" :total="monitor.track.times.total">
                </el-pagination>
            </el-col>
        </el-row>
        <!--历史照片详情-->
        <el-dialog :title="monitor.photo.details.photosType" v-model="monitor.photo.photoVisibile" :close-on-click-modal="false" size="small" custom-class="history-photo">
            <!-- 历史照片 -->
            <el-row class="mt20">
                <el-col :span="18">
                    <!--<p>{{monitor.photo.details.photosType}}</p>-->
                    <p>{{monitor.photo.details.photoTime}}</p>
                    <p>
                        <img :src="monitor.photo.details.photosUrl" class="photo" />
                    </p>
                </el-col>
                <el-col :span="6">
                    <p>
                        <img :src="monitor.photo.details.studentPhoto" class="student" />
                        <p>{{monitor.photo.details.studentName}}</p>
                    </p>
                    <p>
                        <img :src="monitor.photo.details.teacherPhoto" class="teacher" />
                        <p>{{monitor.photo.details.teacherName}}</p>
                    </p>
                </el-col>
            </el-row>
        </el-dialog>
    </section>
</template>

<script>
var amaps;
// import AMap from 'AMap'
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        return {
            amaps: "",
            dateVisible: false,
            historicalPhoto: [],
            resultsBoxShow: true,
            resultsDetailBoxShow: false,
            monitorType: "实时监控",
            monitor: {
                cars: {
                    all: [],
                    online: [],
                    offline: [],
                    tranning: [],
                    bySim: [],
                    detail: {
                        carNo: "",
                        signInTime: "",
                        studentName: "",
                        studentPhoto: "",
                        teacherName: "",
                        teacherPhoto: "",
                        isOnline: 0
                    }
                },
                capturePhoto: "",
                track: {
                    filter: {
                        date: new Date().Format("yyyy-MM-dd"),
                        sim: ""
                    },
                    times: {
                        data: [],
                        page: 1,
                        total: 0
                    },
                    lineArr: [],
                },
                photo: {
                    data: [],
                    total: 0,
                    page: 1,
                    filter: {
                        date: [new Date().Format("yyyy-MM-dd"), new Date().Format("yyyy-MM-dd")],
                        sim: ""
                    },
                    photoVisibile: false,
                    details: {
                        photosType: "",
                        photoTime: "",
                        photosUrl: "",
                        studentName: "",
                        studentPhoto: "",
                        teacherName: "",
                        teacherPhoto: ""
                    }
                }
            },
            markers: {},
            markersMoveListener: {},
            lineArr: [],
            capturePhotoShow: true,
            cursim: "",
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode
        }
    },
    methods: {
        //格式化数据
        formatter(row, column) {
            if (column.property === "isUpload") {
                return global.enums.uploadState[row.isUpload];
            }
            else if (column.property === "photosType") {
                return global.enums.timeAudit.photosType[row.photosType];
            }
        },
        //查询定位的车辆列表
        queryMonitorCars() {
            request.timeTraining.monitor.query.monitorCarList(this.schoolCode).then((res) => {
                if (res.success) {
                    let sims = [];
                    let data = res.object;
                    this.monitor.cars.all = [];
                    for (let item in data) {
                        this.monitor.cars.all.push({
                            sim: data[item].sim,
                            carId: data[item].carId,
                            carNo: data[item].carNo,
                            carType: data[item].carType,
                            isOnline: data[item].isOnline,
                            deviceId: data[item].deviceId,
                            deviceUnifyCode: data[item].deviceUnifyCode,
                            schoolCode: data[item].schoolCode
                        });
                        sims.push(data[item].sim);
                    }
                    this.queryMonitorInfoBySim(sims);
                }
            });
        },
        //根据SIM查询定位信息
        queryMonitorInfoBySim(simInfo) {
            let para = [this.schoolCode, simInfo];
            request.timeTraining.monitor.query.monitorInfoBySim(para).then((res) => {
                if (res.success) {
                    let data = res.object;
                    console.log(data);
                    this.monitor.cars.bySim = [];
                    let allCars = this.monitor.cars.all;
                    for (let i = 0, posData = data.length; i < posData; i++) {
                        for (let j = 0, carsData = allCars.length; j < carsData; j++) {
                            if (data[i].sim === allCars[j].sim) {
                                allCars[j].isOnline = data[i].isOnline;
                                this.monitor.cars.bySim.push({
                                    sim: allCars[j].sim,
                                    carNo: allCars[j].carNo,
                                    carGPS: data[i].carGPS,
                                    carTraining: data[i].carTraining,
                                    isOnline: allCars[j].isOnline,
                                    deviceUnifyCode: allCars[j].deviceUnifyCode
                                });
                                break;
                            }
                        }
                    }
                    let markerData = this.monitor.cars.bySim;
                    this.handleCreateMarker(markerData);
                }
            });
        },
        //查询抓拍的照片
        queryCapturePhoto() {
            this.capturePhotoShow = false;
            let para = [this.monitor.cars.detail.schoolCode, this.monitor.cars.detail.sim, this.monitor.cars.detail.deviceId, this.monitor.cars.detail.deviceUnifyCode];
            request.timeTraining.monitor.query.capturePhoto(para).then((res) => {
                if (res.success) {
                    this.monitor.capturePhoto = res.object;
                    this.monitor.cars.detail.photoDateTime = new Date().Format("yyyy-MM-dd HH:mm:ss");
                }
                this.capturePhotoShow = true;
            });
        },
        //查询历史轨迹
        queryHistoryGPS() {
            amaps.clearMap();
            this.monitor.track.lineArr = [];
            if (this.monitor.track.filter.sim === "") { return; }
            let date = new Date(this.monitor.track.filter.date).Format("yyyy-MM-dd");
            let para = [this.schoolCode, this.monitor.track.filter.sim, date, date];
            request.timeTraining.monitor.query.historyGPS(para).then((res) => {
                if (res.success) {
                    this.initTrack(res.object);
                }
            });
            this.queryTimes();
        },
        //初始化轨迹到地图
        initTrack(data) {
            if (data.length > 0) {
                let marker = new AMap.Marker({
                    map: amaps,
                    position: [data[0].lng, data[0].lat],
                    icon: "http://webapi.amap.com/images/car.png",
                    offset: new AMap.Pixel(-26, -13),
                    autoRotation: true
                });
                for (let i = 0, dataLen = data.length; i < dataLen; i++) {
                    this.monitor.track.lineArr.push([data[i].lng, data[i].lat]);
                }
                //绘制轨迹
                var polyline = new AMap.Polyline({
                    map: amaps,
                    path: this.monitor.track.lineArr,
                    strokeColor: "#21364c",
                    strokeWeight: 3
                });

                var passedPolyline = new AMap.Polyline({
                    map: amaps,
                    strokeColor: "#20a0ff",
                    strokeWeight: 3
                });

                marker.on("moving", function (e) {
                    passedPolyline.setPath(e.passedPath);
                })
                amaps.setFitView();
                marker.moveAlong(this.monitor.track.lineArr, 200);
            }
        },
        //查询历史照片
        queryHistoryPhoto() {
            if (this.monitor.photo.filter.sim === "") { return; }
            let date = this.monitor.photo.filter.date;
            let para = [this.schoolCode, this.monitor.photo.filter.sim, new Date(date[0]).Format("yyyy-MM-dd"), new Date(date[1]).Format("yyyy-MM-dd"), this.monitor.photo.page, 10];
            request.timeTraining.monitor.query.historyPhoto(para).then((res) => {
                if (res.success) {
                    let data = res.object;
                    this.monitor.photo.data = data.list;
                    this.monitor.photo.total = data.num;
                }
            });
        },
        //查询学时列表
        queryTimes() {
            let date = new Date(this.monitor.track.filter.date).Format("yyyy-MM-dd");
            request.timeTraining.timeAudit.query.list([this.schoolCode, "", date, date, "", this.monitor.track.times.page, 10]).then((res) => {
                if (res.success) {
                    let data = res.object.list;
                    this.monitor.track.times.data = [];
                    this.monitor.track.times.total = res.object.num;
                    for (let item in data) {
                        this.monitor.track.times.data.push({
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
        },
        //创建标记到地图
        handleCreateMarker(data) {
            this.monitor.cars.online = [];
            this.monitor.cars.offline = [];
            this.monitor.cars.tranning = [];
            for (let i = 0, posData = data.length; i < posData; i++) {
                let item = data[i];
                if (item.carGPS != null && item.carGPS != "") {
                    if (item.isOnline === 2) {
                        this.monitor.cars.tranning.push(item);
                        this.monitor.cars.online.push(item);
                    }
                    else if (item.carGPS.offline === 0) {
                        this.monitor.cars.online.push(item);
                    }
                }
                else {
                    this.monitor.cars.offline.push(item);
                    //如果车辆不在线，并且地图上没有该车辆，则绘制一个离线车辆
                    var cur_maker = this.markers[item.sim];
                    if (cur_maker === undefined && item.carGPS != null && item.carGPS != "") {
                        this.markers[item.sim] = new AMap.Marker({
                            icon: "/static/images/offline.png",
                            position: [item.lng, item.lat],
                            map: amaps,
                            autoRotation: false,
                            label: {
                                offset: new AMap.Pixel(18, 0),
                                content: item.carNo,
                            }
                        });
                    }
                }
            }
            let onlineCars = this.monitor.cars.online;
            for (let i = 0, online = onlineCars.length; i < online; i++) {
                let item = {
                    sim: onlineCars[i].carGPS.sim,
                    lng: onlineCars[i].carGPS.lng,
                    lat: onlineCars[i].carGPS.lat,
                    carNo: onlineCars[i].carNo,
                    isOnline: onlineCars[i].isOnline,
                    deviceId: onlineCars[i].carGPS.deviceId,
                    schoolCode: onlineCars[i].carGPS.schoolCode,
                    deviceUnifyCode: onlineCars[i].deviceUnifyCode
                };

                if (this.lineArr[("lineArr" + item.sim)]) {
                    var lastOne = this.lineArr[("lineArr" + item.sim)].length - 1;
                    if (this.lineArr[("lineArr" + item.sim)][lastOne][0] != item.lng || this.lineArr[("lineArr" + item.sim)][lastOne][1] != item.lat && parseInt(item.lng) !== 0 && parseInt(item.lat) !== 0) {
                        this.lineArr[("lineArr" + item.sim)].push([item.lng, item.lat]);
                    }
                } else {
                    if (parseInt(item.lng) !== 0 && parseInt(item.lat) !== 0) {
                        this.lineArr[("lineArr" + item.sim)] = [];
                        this.lineArr[("lineArr" + item.sim)].push([item.lng, item.lat]);
                    }
                }

                if (!this.markers[item.sim]) {
                    this.markers[item.sim] = new AMap.Marker({
                        icon: "/static/images/online.png",
                        position: [item.lng, item.lat],
                        map: amaps,
                        autoRotation: false,
                        label: {
                            offset: new AMap.Pixel(18, 0),
                            content: item.carNo,
                        }
                    });
                    this.markers[item.sim].on("click", () => {
                        this.monitor.capturePhoto = "";
                        this.handlePos(item);
                    });
                    //global.printLog(item.stage);
                    // //设置一个培训部分用于绘制车辆运行速度
                    // var extData = item.stage == null ? "" : item.stage;
                    // exData = item.deviceId + "," + extData;
                    // mo.markers[item.deviceId].setExtData(exData);
                }
            }
            let tranningCars = this.monitor.cars.tranning;
            for (let i = 0, tranningLen = tranningCars.length; i < tranningLen; i++) {
                let item = {
                    sim: tranningCars[i].carGPS.sim,
                    lng: tranningCars[i].carGPS.lng,
                    lat: tranningCars[i].carGPS.lat,
                    carNo: tranningCars[i].carNo,
                    isOnline: tranningCars[i].isOnline,
                    deviceId: tranningCars[i].carGPS.deviceId,
                    schoolCode: tranningCars[i].carGPS.schoolCode,
                    deviceUnifyCode: tranningCars[i].deviceUnifyCode
                };
                this.handleMove(item);
            }
        },
        //标记移动
        handleMove(data) {
            let sim = data.sim;
            //获取本次行驶的路线
            let dataArr = [];
            let _lineArr = this.lineArr[("lineArr" + sim)];
            if (typeof (_lineArr) !== "undefined") {
                for (let i = 0, arrLen = _lineArr.length; i < arrLen; i++) {
                    dataArr[i] = _lineArr[i];
                }
                var temp = this.lineArr[("lineArr" + sim)].pop();
                this.lineArr[("lineArr" + sim)].length = 0;
                this.lineArr[("lineArr" + sim)].push(temp);
                if (dataArr.length >= 2) {
                    let polyline = new AMap.Polyline({
                        map: amaps,
                        path: dataArr,
                        strokeColor: "#00A",  //线颜色
                        strokeOpacity: 0,     //线透明度
                        strokeWeight: 2      //线宽
                    });
                    //如果当前marker存在移动的方法，则注销掉之前的
                    if (this.markersMoveListener[sim] == null) {
                        //给当前maker绑定移动完成以后的方法
                        this.markersMoveListener[sim] = AMap.event.addListener(this.markers[sim], "moveend", function () {
                            global.printLog(sim + "跑完了，准备跑下一次");
                            if (typeof this.getExtData() == "String") {
                                var cur_sim = this.getExtData().split(",")[0];
                                this.markerMove(cur_sim);
                            }
                        });
                    }
                    this.markers[sim].moveAlong(dataArr, 40);
                }
                else {
                    //global.printLog(sim + "没有数据，10秒以后再跑");
                    setTimeout(() => {
                        this.handleMove(data);
                    }, 10000);
                }
            }
        },
        //进入车辆详细页，定位标记
        handlePos(data) {
            if (data.isOnline === 2) {
                let bySimData = this.monitor.cars.bySim;
                for (let i = 0, dataLen = bySimData.length; i < dataLen; i++) {
                    let item = bySimData[i];
                    if (item.sim === data.sim) {
                        let signInTime = new Date();
                        signInTime.setTime(item.carTraining.signInTime);
                        this.monitor.cars.detail = {
                            carNo: data.carNo,
                            deviceId: data.deviceId,
                            studentName: item.carTraining.studentName,
                            studentPhoto: item.carTraining.studentPhoto,
                            teacherName: item.carTraining.teacherName,
                            teacherPhoto: item.carTraining.teacherPhoto,
                            deviceUnifyCode: data.deviceUnifyCode,
                            schoolCode: data.schoolCode,
                            sim: data.sim,
                            photoDateTime: "",
                            travelSpeed: item.carGPS.travelSpeed,
                            signInTime: signInTime.Format("yyyy-MM-dd HH:mm:ss"),
                            stageName: item.carTraining.stageName,
                            tranningTime: parseInt((new Date().getTime() - item.carTraining.signInTime) / 60000)
                        }
                    }
                }
            }
            this.monitor.cars.detail.isOnline = data.isOnline;
            var cur_marker = this.markers[data.sim];
            if (cur_marker != null) {
                amaps.setCenter(cur_marker.getPosition());
                amaps.setZoom(19);
            }
            this.resultsBoxShow = false;
            this.resultsDetailBoxShow = true;
            this.cursim = data.sim;
        },
        //查看历史照片
        handleLookPhoto(item) {
            this.monitor.photo.details = {
                photosType: global.enums.timeAudit.photosType[item.photosType],
                photoTime: item.photoTime,
                photosUrl: item.photosUrl,
                studentName: item.studentName,
                studentPhoto: item.studentPhoto,
                teacherName: item.teacherName,
                teacherPhoto: item.teacherPhoto
            }
            this.monitor.photo.photoVisibile = true;
        },
        //后退上一步
        handleBack() {
            this.monitor.capturePhoto = "";
            this.resultsBoxShow = true;
            this.resultsDetailBoxShow = false;
        },
        //监控、照片、轨迹切换
        handleTypeChange(val) {
            this.markers = {};
            this.monitorType = val;
            this.monitor.photo.filter.sim = "";
            this.monitor.track.filter.sim = "";
            if (val === "实时监控") {
                this.handleBack();
                this.initMap(() => {
                    this.initData("monitor");
                }, "mapContainer");
            }
            else if (val === "历史照片") {
                this.dateVisible = false;
                setTimeout(() => {
                    this.dateVisible = true;
                    this.monitor.photo.filter.sim = this.cursim;
                }, 100);
            }
            else {
                this.initMap(() => {
                    this.initData("track");
                }, "mapContainer1");
                this.dateVisible = false;
                setTimeout(() => {
                    this.dateVisible = true;
                    this.monitor.track.filter.sim = this.cursim;
                }, 100);
            }
        },
        //初始化加载地图
        initData(target) {
            if (target === "monitor") {
                this.queryMonitorCars();
            }
        },
        //列表翻页
        handleCurrentChange(val) {
            if (this.monitorType === "历史轨迹") {
                this.monitor.track.times.page = val;
                this.queryTimes();
            }
            else if (this.monitorType === "历史照片") {
                this.monitor.photo.page = val;
                this.queryHistoryPhoto();
            }
        },
        initMap(callback, mapObj) {
            global.printLog(window._amapInit);
            var interval = setInterval(() => {
                if (window._amapInit) {
                    clearInterval(interval);
                    //global.printLog("地图已加载完成^_^");
                    this.$message.success({ message: "地图已加载完成^_^" });
                    setTimeout(() => {
                        amaps = new AMap.Map(mapObj, {
                            resizeEnable: true,
                            zoom: 17,
                            center: [global.map.center.lat, global.map.center.lng]
                        });
                        amaps.on("complete", () => {
                            AMapUI.loadUI(["control/BasicControl"], (BasicControl) => {
                                amaps.addControl(new BasicControl.LayerSwitcher({
                                    position: "rt"
                                }));
                            });
                            callback();
                        });
                    }, 50);
                }
                else {
                    this.$message.info({ message: "地图拼命加载中，" + interval });
                    //global.printLog("地图拼命加载中，" + interval);
                }
            }, 50);
        }
    },
    activated() {
        global.printLog("activated");
        this.handleTypeChange(this.monitorType);
    },
    deactivated() {
        global.printLog("deactivated");
        amaps.clearMap();
        this.markers = {};
        this.lineArr = [];
    },
    mounted() {
    }
}

</script>

    <style lang="scss">
    .tool {
        position: absolute;
        left: 15px;
        top: 15px;
        z-index: 6201;
        .toolbox {
            position: relative;
            z-index: 2201;
            width: 360px;
            height: 50px;
            background: #FFF;
            border-radius: 3px;
            cursor: pointer;
            box-shadow: 0 2px 2px rgba(0, 0, 0, .15);
            em {
                font-style: normal;
                margin-right: 5px;
                font-size: 1.35em;
                &.total {
                    color: #1F2D3D;
                }
                &.online {
                    color: #20A0FF;
                }
                &.tranning {
                    color: #13CE66;
                }
            }
            ul {
                margin: 0 20px;
            }
            ul li {
                float: left;
                display: inline-block;
                line-height: 50px;
                margin-right: 20px;
            }
        }
    }

    .results-box {
        position: absolute;
        left: 15px;
        top: 67px;
        z-index: 6201;
        width: 360px;
        max-height: 460px;
        overflow-y: auto;
        border-top: 1px solid #D8D8D8;
        background: #FFF;
        border-radius: 0 0 3px 3px;
        box-shadow: 0 2px 2px rgba(0, 0, 0, .15);
        ul li a {
            display: block;
            height: 30px;
            line-height: 30px;
            padding: 10px 15px;
            cursor: pointer;
            &:hover {
                background: #EEEEEE;
            }
            >p>em {
                font-style: normal;
            }
        }
        .online {
            color: #20A0FF;
        }
        .offline {
            color: #1F2D3D;
        }
        .tranning {
            color: #13CE66;
        }
        .results-box-inner {
            color: #1F2D3D;
            padding: 10px 20px;
            .info-item {
                border-bottom: 1px solid #d1dbe5;
                .item-pics {
                    width: 290px;
                    text-align: center;
                    height: 95px;
                    margin: 10px auto;
                    img {
                        width: 60px;
                        height: 69px;
                    }
                }
                .item-bar {
                    width: 250px;
                    height: 26px;
                    margin: 6px auto 15px auto;
                }
            }
            .photo {
                width: 290px;
                height: 220px;
            }
        }
    }

    a.capturePhoto {
        width: 55px;
        height: 60px;
        z-index: 6221;
        position: absolute;
        left: 375px;
        top: 160px;
        background: #fff;
        border-top-left-radius: 0;
        border-top-right-radius: 2em;
        border-bottom-right-radius: 2em;
        border-bottom-left-radius: 0;
        box-shadow: 3px 3px 10px rgba(0, 0, 0, .35);
        .inner {
            border-radius: 100%;
            background: #20A0FF;
            width: 40px;
            height: 40px;
            display: inline-block;
            position: absolute;
            left: 8px;
            top: 11px;
            >i {
                font-size: 2.1em;
                position: relative;
                top: 5px;
                left: 7px;
            }
        }
    }

    .history-photo {
        width: 700px;
        padding-bottom: 40px;
        p {
            margin-bottom: 10px;
        }
        img.photo {
            width: 456px;
            height: 327px;
            margin-right: 20px;
        }
        img.student,
        img.teacher {
            width: 105px;
            height: 110px;
            margin-top: 25px;
        }
    }
</style>