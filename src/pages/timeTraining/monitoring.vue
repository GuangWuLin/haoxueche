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
        <div v-if="monitorType==='实时监控'" class="map-container" :style="{ left: monitorMapLeftPos + 'px' }">
            <div class="container-vehicle" v-if="!monitor.cars.collapsed">
                <div class="vehicle-filter">
                    <el-autocomplete v-model="monitor.filter.platNo" size="small" :fetch-suggestions="querySearchAsync" placeholder="输入车牌号模糊筛选" @select="handleAutocompleteSelect"></el-autocomplete>
                </div>
                <div class="vehicle-status">
                    <ul>
                        <li>
                            <a href="javascript:;">
                                <span>{{monitor.cars.all.length}}</span>
                                <span>总数</span>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:;">
                                <span>{{monitor.cars.online.length}}</span>
                                <span>在线</span>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:;">
                                <span>{{monitor.cars.tranning.length}}</span>
                                <span>培训中</span>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:;">
                                <span>{{monitor.cars.offline.length}}</span>
                                <span>离线</span>
                            </a>
                        </li>
                        <li>
                            <a v-if="monitor.tracking" href="javascript:;" class="glyph-icon icon-genzong open" @click="hideMarker('hide')" title="点击取消跟踪"></a>
                            <a v-if="!monitor.tracking" href="javascript:;" class="glyph-icon icon-genzong close" @click="hideMarker('show')" title="点击跟踪"></a>
                        </li>
                    </ul>
                </div>
                <div class="vehicle-list" id="vehicleList">
                    <a href="javascript:;" v-for="(item,index) in monitor.cars.all" :key='index' @click="()=>{handlePos(item);}" v-bind:class="{'active':item.active}" :id="'sim-'+item.sim">
                        {{item.carNo}}
                        <em v-bind:class="{ 'offline right': item.isOnline===0, 'online right': item.isOnline===1, 'tranning right': item.isOnline===2 }">
                            {{item.isOnline===1?'在线':(item.isOnline===2?'培训中':'离线')}}
                        </em>
                    </a>
                </div>
                <a href="javascript:;" class="vehicle-list-collapsed" @click="()=>{monitor.cars.collapsed=true}">
                    <em class="el-icon-arrow-left"></em>
                </a>
            </div>
            <div class="container-vehicle min" v-if="monitor.cars.collapsed">
                <div class="vehicle-filter">
                    <el-autocomplete v-model="monitor.filter.platNo" size="small" :fetch-suggestions="querySearchAsync" placeholder="输入车牌号" @select="handleAutocompleteSelect"></el-autocomplete>
                </div>
                <div class="vehicle-status">
                    <ul>
                        <li>
                            <a href="javascript:;">
                                <span>{{monitor.cars.all.length}}</span>
                                <span>总数</span>
                            </a>
                        </li>
                        <li>
                            <a v-if="monitor.tracking" href="javascript:;" class="glyph-icon icon-genzong open" @click="hideMarker('hide')" title="点击取消跟踪"></a>
                            <a v-if="!monitor.tracking" href="javascript:;" class="glyph-icon icon-genzong close" @click="hideMarker('show')" title="点击跟踪"></a>
                        </li>
                    </ul>
                </div>
                <div class="vehicle-list" id="vehicleList">
                    <a href="javascript:;" v-for="(item,index) in monitor.cars.all" :key='index' @click="()=>{handlePos(item);}" v-bind:class="{'active':item.active}" :id="'sim-'+item.sim">
                        <em v-bind:class="{ 'offline': item.isOnline===0, 'online': item.isOnline===1, 'tranning': item.isOnline===2 }"></em>
                        {{item.carNo}}
                    </a>
                </div>
                <a href="javascript:;" class="vehicle-list-collapsed" @click="monitor.cars.collapsed=false">
                    <em class="el-icon-arrow-right"></em>
                </a>
            </div>
            <div id="container-map" :style="{ left: (monitor.cars.collapsed?131:301) + 'px' }">
                <p>
                    <i class="el-icon-loading"></i>
                    地图加载中...
                </p>
            </div>
        </div>
        <el-row v-if="monitorType==='历史照片'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-form :inline="true">
                    <el-form-item>
                        <el-date-picker type="daterange" placeholder="选择日期范围" v-model="monitor.photo.filter.date" :clearable="false" :editable="false" @change="queryHistoryPhoto"></el-date-picker>
                        <el-select placeholder="请选择车辆" v-model="monitor.photo.filter.sim" @change="queryHistoryPhoto">
                            <el-option v-for="item in monitor.cars.all" :key='item.value' :label="item.carNo" :value="item.sim"></el-option>
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
        <el-row v-if="monitorType==='历史轨迹'" class="map-container" :style="{ left: monitorMapLeftPos + 'px' }">
            <div id="container-map" style="left:0;">
                <p>
                    <i class="el-icon-loading"></i>
                    地图加载中...
                </p>
            </div>
            <div class="track-history">
                <div class="filter-header pt10">
                    <el-select v-model="monitor.track.filter.query" filterable clearable remote placeholder="输入车牌号模糊筛选" :remote-method="remoteFilter" @change="queryHistoryGPS">
                        <el-option v-for="item in monitor.track.filter.cars" :key='item.sim' :label="item.carNo" :value="item">
                        </el-option>
                    </el-select>
                </div>
                <div class="filter-header pb10">
                    <!-- v-if="dateVisible" -->
                    <el-date-picker type="date" placeholder="选择日期" v-model="monitor.track.filter.date" @change="queryHistoryGPS" :clearable="false" :editable="false"></el-date-picker>
                </div>
                <div class="filter-header" v-show="monitor.track.lineArr.length">
                    <el-col :span="3" class="t-right">
                        进度
                    </el-col>
                    <el-col :span="21">
                        <el-progress :text-inside="true" :stroke-width="16" :percentage="progress" status="success"></el-progress>
                    </el-col>
                </div>
                <div class="filter-header" style="text-align:right;padding-right:20px;" v-show="monitor.track.lineArr.length">
                    <el-button @click="tracking('stop')" :disabled="monitor.track.status==='stop'">停止</el-button>
                    <el-button :type="monitor.track.status==='pause'?'primary':''" @click="tracking('resume')" v-if="monitor.track.status==='pause'&&progress<100">继续</el-button>
                    <el-button :type="monitor.track.status==='start'||monitor.track.status==='resume'?'primary':''" @click="tracking('pause')" v-else :disabled="monitor.track.status==='stop'">暂停</el-button>
                    <el-button type="primary" @click="tracking('start')" v-if="monitor.track.status==='stop'">播放</el-button>
                </div>
                <!-- ="!monitor.track.lineVisible" -->
                <!-- <div class="filter-header information" v-if="monitor.track.lineVisible" v-show="monitor.track.times.data.length?false:true">
                    <p class="empty">
                        <i class="el-icon-information"></i>
                    </p>
                    <p class="empty">
                        暂无轨迹数据
                    </p>
                </div> -->
                <!-- <div class="filter-header information" v-show="!monitor.track.lineVisible">
                    <p class="empty">
                        <i class="el-icon-information"></i>
                    </p>
                    <p class="empty"></p>
                </div>
                 v-show="(monitor.track.times.data.length||monitor.track.lineArr.length)?false:true"
                -->
                <div class="open-table" v-show="monitor.track.times.data.length">
                    <a href="javascript:;" @click="()=>{monitor.track.times.tableVisible=(monitor.track.times.tableVisible?false:true)}">
                        <i class="el-icon-arrow-down"></i>
                    </a>
                </div>
                <!--列表-->
                <el-table :data="monitor.track.times.data" height="150" v-show="monitor.track.times.tableVisible">
                    <el-table-column prop="studentName" label="学员">
                    </el-table-column>
                    <el-table-column prop="teacherName" label="教练">
                    </el-table-column>
                    <el-table-column prop="stageName" label="培训部分">
                    </el-table-column>
                    <!-- <el-table-column prop="allStudyMin" label="培训学时" width="90"></el-table-column> -->
                    <el-table-column label="有效学时">
                        <template scope="scope">
                            <p v-bind:style="{ color: (scope.row.auditState===1?'#1F2D3D':(scope.row.auditState===0?'#1D8CE0':'#FF4949')) }">{{scope.row.validStudyMin}}</p>
                        </template>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <!-- <el-pagination v-show="monitor.track.times.data.length" layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="10" :total="monitor.track.times.total"></el-pagination> -->
            </div>
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
var amaps, infoWindow, track_marker, passedPolyline;
var collapsedTimer = 0, timerCount = 0;
// import AMap from 'AMap'
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        return {
            totalDistance: 0,
            runDistance: 0,
            progress: 0,
            amaps: "",
            dateVisible: false,
            historicalPhoto: [],
            monitorType: "实时监控",
            monitor: {
                filter: {
                    platNo: ""
                },
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
                    },
                    collapsed: false,
                    left: 130
                },
                capturePhoto: "",
                track: {
                    filter: {
                        date: new Date().Format("yyyy-MM-dd"),
                        sim: "",
                        query: [],
                        cars: []
                    },
                    times: {
                        data: [],
                        page: 1,
                        total: 0,
                        tableVisible: false
                    },
                    lineArr: [],
                    lineVisible: false,
                    status: "stop"
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
                },
                tracking: true,
                currentItem: {}
            },
            markers: {},
            markersMoveListener: {},
            lineArr: [],
            capturePhotoShow: true,
            monitorMapLeftPos: 220,
            collapsed: false,
            videoLink: "",
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
                    for (let item in data) {
                        sims.push(data[item].sim);
                    }
                    if (sims.length > 0) {
                        this.queryMonitorInfoBySim(sims, data);
                    }
                }
            });
        },
        //根据SIM查询定位信息
        queryMonitorInfoBySim(simInfo, cars) {
            let para = [this.schoolCode, simInfo];
            request.timeTraining.monitor.query.monitorInfoBySim(para).then((res) => {
                if (res.success) {
                    let data = res.object;
                    this.monitor.cars.all = [];
                    this.monitor.cars.bySim = [];
                    for (let i = 0, posData = data.length; i < posData; i++) {
                        for (let j = 0, carsData = cars.length; j < carsData; j++) {
                            if (data[i].sim === cars[j].sim) {
                                this.monitor.cars.all.push({
                                    sim: cars[j].sim,
                                    carId: cars[i].carId,
                                    carNo: cars[j].carNo,
                                    value: cars[j].carNo,
                                    carGPS: data[i].carGPS,
                                    isOnline: data[j].isOnline,
                                    carType: cars[i].carType,
                                    deviceId: cars[i].deviceId,
                                    carTraining: data[i].carTraining,
                                    schoolCode: cars[i].schoolCode,
                                    deviceUnifyCode: cars[j].deviceUnifyCode,
                                    active: false
                                });
                                break;
                            }
                        }
                    }
                    this.handleCreateMarker(this.monitor.cars.all);
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
                //如果gps为空即则没有开启设备传输定位数据，直接视为离线
                if (item.carGPS == null) {
                    this.monitor.cars.offline.push(item);
                }
                else {
                    //isOnline：2为培训中，1为在线，由于培训中也代表在线，因此online个数会增加
                    if (item.isOnline === 2) {
                        this.createMarker(item, 2);
                        this.monitor.cars.online.push(item);
                        this.monitor.cars.tranning.push(item);
                    }
                    //offline代表是否离线，0为在线，1为离线
                    else if (item.carGPS.offline === 0) {
                        this.createMarker(item, 1);
                        this.monitor.cars.online.push(item);
                    }
                    //标记离线车辆
                    else {
                        this.createMarker(item, 0);
                        this.monitor.cars.offline.push(item);
                    }
                }
            }
            let onlineCars = this.monitor.cars.online;
            for (let i = 0, online = onlineCars.length; i < online; i++) {
                let item = onlineCars[i];
                if (this.lineArr[("lineArr" + item.carGPS.sim)]) {
                    var lastOne = this.lineArr[("lineArr" + item.carGPS.sim)].length - 1;
                    if (this.lineArr[("lineArr" + item.carGPS.sim)][lastOne][0] != item.carGPS.lng || this.lineArr[("lineArr" + item.carGPS.sim)][lastOne][1] != item.carGPS.lat && parseInt(item.carGPS.lng) !== 0 && parseInt(item.carGPS.lat) !== 0) {
                        this.lineArr[("lineArr" + item.carGPS.sim)].push([item.carGPS.lng, item.carGPS.lat]);
                    }
                }
                else {
                    if (parseInt(item.carGPS.lng) !== 0 && parseInt(item.carGPS.lat) !== 0) {
                        this.lineArr[("lineArr" + item.carGPS.sim)] = [];
                        this.lineArr[("lineArr" + item.carGPS.sim)].push([item.carGPS.lng, item.carGPS.lat]);
                    }
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
            // let onlineCars = this.monitor.cars.online;
            // for (let i = 0, online = onlineCars.length; i < online; i++) {
            //     let item = {
            //         sim: onlineCars[i].carGPS.sim,
            //         lng: onlineCars[i].carGPS.lng,
            //         lat: onlineCars[i].carGPS.lat,
            //         carNo: onlineCars[i].carNo,
            //         isOnline: onlineCars[i].isOnline,
            //         deviceId: onlineCars[i].carGPS.deviceId,
            //         schoolCode: onlineCars[i].carGPS.schoolCode,
            //         deviceUnifyCode: onlineCars[i].deviceUnifyCode
            //     };

            //     if (this.lineArr[("lineArr" + item.sim)]) {
            //         var lastOne = this.lineArr[("lineArr" + item.sim)].length - 1;
            //         if (this.lineArr[("lineArr" + item.sim)][lastOne][0] != item.lng || this.lineArr[("lineArr" + item.sim)][lastOne][1] != item.lat && parseInt(item.lng) !== 0 && parseInt(item.lat) !== 0) {
            //             this.lineArr[("lineArr" + item.sim)].push([item.lng, item.lat]);
            //         }
            //     } else {
            //         if (parseInt(item.lng) !== 0 && parseInt(item.lat) !== 0) {
            //             this.lineArr[("lineArr" + item.sim)] = [];
            //             this.lineArr[("lineArr" + item.sim)].push([item.lng, item.lat]);
            //         }
            //     }

            //     if (!this.markers[item.sim]) {
            //         this.markers[item.sim] = new AMap.Marker({
            //             icon: "/static/images/online.png",
            //             position: [item.lng, item.lat],
            //             map: amaps,
            //             autoRotation: false,
            //             label: {
            //                 offset: new AMap.Pixel(18, 0),
            //                 content: item.carNo,
            //             }
            //         });
            //         this.markers[item.sim].on("click", () => {
            //             this.monitor.capturePhoto = "";
            //             this.handlePos(item);
            //         });
            //         //global.printLog(item.stage);
            //         // //设置一个培训部分用于绘制车辆运行速度
            //         // var extData = item.stage == null ? "" : item.stage;
            //         // exData = item.deviceId + "," + extData;
            //         // mo.markers[item.deviceId].setExtData(exData);
            //     }
            // }
        },
        //创建marker标记
        createMarker(item, flag) {
            var cur_maker = this.markers[item.sim];
            if (cur_maker === undefined) {
                this.markers[item.sim] = new AMap.Marker({
                    icon: "/static/images/" + (flag === 0 ? "offline" : flag === 1 ? "online" : "tranning") + ".png",
                    position: [item.carGPS.lng, item.carGPS.lat],
                    map: amaps,
                    autoRotation: true,
                    topWhenClick: true
                });
                this.markers[item.sim].on("click", () => {
                    this.handlePos(item);
                });
                this.markers[item.sim].on("mouseover", (e) => {
                    e.target.setTop(true);
                });
            }
        },
        //查询抓拍的照片
        queryCapturePhoto(callback, cmd) {
            let item = this.monitor.currentItem;
            let para = [item.schoolCode, item.sim, cmd];
            if (cmd === 1) {
                request.timeTraining.monitor.query.capturePhoto(para).then((res) => {
                    if (res.success) {
                        global.printLog("指令发送成功，5秒后开始轮询获取图片接口");
                        setTimeout(() => {
                            global.printLog("开始轮询获取图片接口");
                            this.queryCapturePhoto(callback, 2);
                        }, 4000);
                    }
                });
            }
            else {
                if (timerCount > 11) {
                    callback(false);
                }
                else {
                    timerCount++;
                    request.timeTraining.monitor.query.capturePhoto(para).then((data) => {
                        if (data.success) {
                            if (data.object !== null) {
                                callback(data.object, new Date().Format("yyyy-MM-dd HH:mm:ss"));
                            }
                            else {
                                setTimeout(() => {
                                    this.queryCapturePhoto(callback, 2);
                                }, 1000);
                            }
                        }
                        global.printLog("已轮询获取图片接口" + timerCount + "次");
                    });
                }
            }
        },
        //查询历史轨迹
        queryHistoryGPS() {
            amaps.clearMap();
            this.progress = 0;
            this.totalDistance = 0;
            this.monitor.track.lineArr = [];
            this.monitor.track.status = "stop";
            this.monitor.track.times.data = [];
            this.monitor.track.lineVisible = false;
            this.monitor.track.times.tableVisible = false;
            if (this.monitor.track.filter.query.length === 0) { return; }
            let date = new Date(this.monitor.track.filter.date).Format("yyyy-MM-dd");
            let para = [this.schoolCode, this.monitor.track.filter.query.sim, date, date];
            request.timeTraining.monitor.query.historyGPS(para).then((res) => {
                if (res.success) {
                    this.initTrack(res.object);
                }
            });
            this.queryTimes();
        },
        //查询车辆FTP视频
        queryFTPVideo(data, callback) {
            request.timeTraining.monitor.query.ftpVideo(data.carNo).then((res) => {
                if (res.success) {
                    let data = res.object;
                    if (data != null && data.online) {
                        callback("ftp://" + data.userName + ":" + data.password + "@" + data.ip + ":" + data.port);
                    }
                    else {
                        callback(false);
                    }
                }
            });
        },
        //初始化轨迹到地图
        initTrack(data) {
            global.printLog(data.length);
            if (track_marker !== undefined) {
                track_marker.setMap(null);
            }
            if (data.length > 0) {
                let _lng = 0, _lat = 0;
                for (let i = 0, dataLen = data.length; i < dataLen; i++) {
                    if (parseInt(data[i].lng) != 0 && parseInt(data[i].lat) != 0) {
                        this.monitor.track.lineArr.push([data[i].lng, data[i].lat]);
                        if (_lng != 0 && _lat != 0) { continue; }
                        _lng = data[i].lng;
                        _lat = data[i].lat;
                    }
                }
                let lines = this.monitor.track.lineArr;
                if (!lines.length) {
                    this.monitor.track.lineVisible = true;
                    this.$message.warning("暂无轨迹数据");
                    return;
                }

                track_marker = new AMap.Marker({
                    map: amaps,
                    position: [_lng, _lat],
                    icon: "http://webapi.amap.com/images/car.png",
                    offset: new AMap.Pixel(-26, -13),
                    autoRotation: true
                });
                //绘制轨迹
                var polyline = new AMap.Polyline({
                    map: amaps,
                    path: lines,
                    strokeColor: "#21364c",
                    strokeWeight: 3
                });

                passedPolyline = new AMap.Polyline({
                    map: amaps,
                    strokeColor: "#20a0ff",
                    strokeWeight: 3
                });
                lines.forEach((item, index) => {
                    if (index < lines.length - 1) {
                        let _distance = new AMap.LngLat(lines[index].lng, lines[index].lat).distance([lines[index + 1].lng, lines[index + 1].lat]);
                        this.totalDistance += Number(_distance);
                    }
                });
                track_marker.on("moving", (e) => {
                    this.runDistance = 0;
                    let linesArr = e.passedPath;
                    linesArr.forEach((item, index) => {
                        if (index < linesArr.length - 1) {
                            let _distance = new AMap.LngLat(linesArr[index].lng, linesArr[index].lat).distance([linesArr[index + 1].lng, linesArr[index + 1].lat]);
                            this.runDistance += Number(_distance);
                        }
                    });
                    this.progress = Number(((this.runDistance / this.totalDistance) * 100).toFixed(0));
                    passedPolyline.setPath(linesArr);
                    if (this.progress === 100) {
                        this.monitor.track.status = "stop";
                    }
                });
                amaps.setFitView();
            }
            else {
                this.$message.warning("暂无轨迹数据");
            }
        },
        tracking(status) {
            if (status === "start") {
                track_marker.moveAlong(this.monitor.track.lineArr, 200);
            }
            else if (status === "pause") {
                if (this.monitor.track.status === "stop") {
                    return;
                }
                track_marker.pauseMove();
            }
            else if (status === "resume") {
                track_marker.resumeMove();
            }
            else {
                if (this.monitor.track.status !== "stop") {
                    this.progress = 0;
                    track_marker.stopMove();
                    passedPolyline.setPath([]);
                    let lines = this.monitor.track.lineArr;
                    track_marker.setPosition([lines[0].lng, lines[0].lat]);
                }
            }
            this.monitor.track.status = status;
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
            this.monitor.track.times.data = [];
            let date = new Date(this.monitor.track.filter.date).Format("yyyy-MM-dd");
            request.timeTraining.timeAudit.query.list([this.schoolCode, "", date, date, this.monitor.track.filter.query.carNo, this.monitor.track.times.page, 10]).then((res) => {
                if (res.success) {
                    let data = res.object.list;
                    global.printLog(data);
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
        hanldeStopMove() {
            let tranningCars = this.monitor.cars.tranning;
            for (let i = 0, tranningLen = tranningCars.length; i < tranningLen; i++) {
                this.markers[tranningCars[i].carGPS.sim].stopMove();
            }
        },
        //进入车辆详细页，定位标记
        handlePos(data) {
            // this.videoLink = "";
            // this.monitor.cars.detail.isOnline = 0;
            if (data.carGPS == null) {
                this.$message.info({ message: "新装车辆未开启定位设备" });
            }
            else {
                var that = this;
                global.printLog(data);
                this.resetActive(data);
                let isOnline = data.isOnline;
                let carTraining = data.carTraining;
                //动态创建地图信息窗体及内容
                var title = "<div class='window-title'><a href='javascript:;' class='glyph-icon icon-dingwei' title='车辆定位'></a><a href='javascript:;' class='hide'>语音</a><a href='javascript:;' target='_blank' class='glyph-icon icon-shipin hide' title='FTP视频' id='shipin-link'></a></div>", content = [];
                var results = document.createElement("div");
                var resultsBox = document.createElement("div");
                resultsBox.className = "results-box";
                var resultsBoxInner = document.createElement("div");
                resultsBoxInner.className = "results-box-inner";
                var topInfo = document.createElement("div");
                topInfo.className = "top-info";

                //在线且培训中
                if (isOnline === 2 && carTraining != null) {
                    topInfo.innerHTML = "<div class=\"info-item\"><div class=\"item-pics\"><div class=\"left\"><img src='" + carTraining.studentPhoto + "'><p class=\"mt5\">学员：" + carTraining.studentName + "</p></div><div class=\"right\"><img src='" + carTraining.teacherPhoto + "'><p class=\"mt5\">教练：" + carTraining.teacherName + "</p></div></div></div><div class=\"info-item\"><div class=\"el-row mt20 mb15 ml15\"><div class=\"el-col el-col-14\"><span>车牌：" + data.carNo + "</span></div><div class=\"el-col el-col-10\"><span>培训部分：" + carTraining.stageName + "</span></div></div><div class=\"el-row mt15 mb15 ml15\"><div class=\"el-col el-col-14\"><span>培训学时：" + parseInt((new Date().getTime() - carTraining.signInTime) / 60000) + "分</span></div><div class=\"el-col el-col-10\"><span>当前速度：" + data.carGPS.travelSpeed + "</span></div></div><div class=\"el-row mt15 mb15 ml15\"><div class=\"el-col el-col-20\"><span>签到：" + new Date(parseInt(carTraining.signInTime)).Format("yyyy-MM-dd HH:mm:ss") + "</span></div></div></div>";
                }
                //在线
                else if (isOnline) {
                    topInfo.innerHTML = "<div class=\"no-tranning\"><div class=\"pic\"></div><label class=\"txt\">车辆未培训...</label></div>";
                    topInfo.innerHTML += "<div class=\"info-item\"><div class=\"el-row mt20 mb15 ml15\"><div class=\"el-col el-col-14\"><span>车牌：" + data.carNo + "</span></div><div class=\"el-col el-col-10\"><span>当前速度：" + data.carGPS.travelSpeed + "</span></div></div><div class=\"el-row mt15 mb15 ml15\"><div class=\"el-col el-col-20\"><span>最近签到教练：" + (carTraining === null ? "" : carTraining.teacherName) + "</span></div></div><div class=\"el-row mt15 mb15 ml15\"><div class=\"el-col el-col-20\"><span>最后一次定位时间：" + data.carGPS.time + "</span></div></div>";
                }
                //离线
                else {
                    topInfo.innerHTML = "<div class=\"no-tranning\"><div class=\"pic\"></div><label class=\"txt\">车辆不在线...</label></div>";
                    topInfo.innerHTML += "<div class=\"info-item\"><div class=\"el-row mt20 mb15 ml15\"><div class=\"el-col el-col-14\"><span>车牌：" + data.carNo + "</span></div></div><div class=\"el-row mt15 mb15 ml15\"><div class=\"el-col el-col-20\"><span>最近签到教练：" + (carTraining === null ? "" : carTraining.teacherName) + "</span></div></div><div class=\"el-row mt15 mb15 ml15\"><div class=\"el-col el-col-20\"><span>最后一次定位时间：" + data.carGPS.time + "</span></div></div>";
                }
                resultsBoxInner.appendChild(topInfo);

                //跳转功能键
                var toolBar = document.createElement("div");
                toolBar.innerHTML = "<div class=\"info-item\"><div class=\"item-bar\"><button type=\"button\" id=\"history-pic\" class=\"el-button left el-button--text\"><span>历史照片</span></button><button type=\"button\" id=\"history-track\" class=\"el-button right el-button--text\"><span>历史轨迹</span></button></div></div>";
                resultsBoxInner.appendChild(toolBar);

                //在线/培训中
                if (isOnline) {
                    var zhaopian = document.createElement("div");
                    zhaopian.innerHTML = "<div class=\"capture-photo\"><div id='failed-text' style=\"text-align:center;padding-bottom:20px;display:none;\"><p class=\"el-icon-warning mt20 mb10\" style='font-size:3em;color:#20A0FF;'></p><p>已超时，照片抓拍失败！</p><p>请确保车辆设备终端网络信号良好，<a href='javascript:;' style='color:#20A0FF;' id='reset-zp1'>重新抓拍？</a></p></div><div id='loading-text' style=\"text-align:center;display:none;\"><em style='background:url(/static/images/loading_16.gif);display:inline-block;width:16px;height:16px;margin-right:5px;position:relative;top:2px;'></em>照片抓拍中...</div><a id='zhaopian-icon' href=\"javascript:;\"><em class=\"glyph-icon icon-paizhao\"></em></a><div id='zhaopian' style=\"height:220px;width:290px;margin:0 auto;display:none;margin-top:10px;\"><img id=\"remotePicture\" src=\"\" style=\"width:100%;height:100%;padding:10px 0;\" /><a href='javascript:;' style='color:#20A0FF;padding-bottom:15px;' id='reset-zp'>重新抓拍？</a></div></div>";
                    resultsBoxInner.appendChild(zhaopian);
                }
                resultsBox.appendChild(resultsBoxInner);
                results.appendChild(resultsBox);
                content.push(results.innerHTML);
                infoWindow = new AMap.InfoWindow({
                    autoMove: true,
                    isCustom: true,  //使用自定义窗体
                    content: createInfoWindow(title, content.join("")),
                    offset: new AMap.Pixel(20, -45)
                });
                var cur_marker = this.markers[data.sim];
                if (cur_marker != null) {
                    //amaps.setCenter(cur_marker.getPosition());
                    //amaps.setZoom(20);
                }
                this.markers[data.sim].show();
                this.monitor.currentItem = data;
                infoWindow.open(amaps, cur_marker.getPosition());
                infoWindow.setPosition(cur_marker.getPosition());

                setTimeout(() => {
                    if (isOnline) {
                        var resetZP = document.getElementById("reset-zp");
                        var resetZP1 = document.getElementById("reset-zp1");
                        var zhaopianIcon = document.getElementById("zhaopian-icon");
                        zhaopianIcon.onclick = resetZP1.onclick = resetZP.onclick = function () {
                            document.getElementById("zhaopian").style.display = "none";
                            document.getElementById("failed-text").style.display = "none";
                            document.getElementById("zhaopian-icon").style.display = "none";
                            loadRemotePicture("zhaopian-icon", "zhaopian", "loading-text", that);
                        }
                    }
                    var historyPic = document.getElementById("history-pic");
                    var historyTrack = document.getElementById("history-track");
                    historyPic.onclick = function () {
                        that.monitorType = "历史照片";
                        setTimeout(() => {
                            that.monitor.photo.filter.sim = data.sim;
                        }, 600);
                    }
                    historyTrack.onclick = function () {
                        that.monitorType = "历史轨迹";
                        that.monitor.track.filter.cars = that.monitor.cars.all;
                        setTimeout(() => {
                            that.monitor.track.filter.query = data;
                        }, 600);
                    }
                    that.queryFTPVideo(data, function (result) {
                        let shipinLink = document.getElementById("shipin-link");
                        global.printLog(result);
                        if (result) {
                            shipinLink.style.display = "block";
                            shipinLink.setAttribute("href", result);
                        }
                    });
                }, 500)
            }
        },
        //选中车辆
        resetActive(data) {
            let tracking = this.monitor.tracking;
            if (!tracking) {
                this.hideMarker("hide");
            }
            let allCars = this.monitor.cars.all;
            for (let i = 0, allCarsLen = allCars.length; i < allCarsLen; i++) {
                if (allCars[i].sim === data.sim) {
                    data.active = true;
                    //this.markers[data.sim].show();
                }
                else {
                    allCars[i].active = false;
                }
            }
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
        //监控、照片、轨迹切换
        handleTypeChange(val) {
            if (typeof (amaps) !== "undefined") {
                amaps.clearMap();
            }
            this.progress = 0;
            //this.hanldeStopMove();
            this.totalDistance = 0;
            this.monitor.track.lineArr = [];
            this.monitor.track.status = "stop";
            this.monitor.track.times.data = [];
            this.monitor.track.lineVisible = false;
            this.monitor.track.times.tableVisible = false;

            this.markers = {};
            this.monitorType = val;
            clearInterval(collapsedTimer);
            this.monitor.photo.filter.sim = "";
            this.monitor.track.filter.query = [];
            this.monitor.track.times.data = [];
            this.monitor.track.lineVisible = false;
            this.monitor.track.times.tableVisible = false;
            setTimeout(() => {
                if (val === "实时监控") {
                    this.initMap(() => {
                        this.initData("monitor");
                    }, "container-map");
                    collapsedTimer = setInterval(() => {
                        this.collapsed = this.$store.state.collapsed;
                    }, 10);
                }
                else if (val === "历史照片") {
                }
                else {
                    this.initMap(() => { }, "container-map");
                    collapsedTimer = setInterval(() => {
                        this.collapsed = this.$store.state.collapsed;
                    }, 10);
                }
            }, 300);
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
                    global.printLog("地图已加载完成");
                    setTimeout(() => {
                        amaps = new AMap.Map(mapObj, {
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
                            initAMapUI();
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
                    global.printLog("地图拼命加载中，" + interval);
                }
            }, 50);
        },
        querySearchAsync(queryString, callback) {
            var allCars = this.monitor.cars.all;
            var results = queryString ? allCars.filter(this.createStateFilter(queryString.toLowerCase())) : allCars;
            callback(results);
        },
        createStateFilter(queryString) {
            return (state) => {
                return (state.value.toLowerCase().indexOf(queryString) > -1);
            };
        },
        handleAutocompleteSelect(item) {
            this.handlePos(item);
            document.getElementById("vehicleList").scrollTop = document.querySelector("#sim-" + item.sim).offsetTop;
        },
        // handleIconClick() {
        //     var allCars = this.monitor.cars.all;
        //     let query = this.monitor.filter.platNo;
        //     let res = "";
        //     for (let item in allCars) {
        //         if (allCars[item].value.toLowerCase() === query) {
        //             res = query;
        //             break;
        //         }
        //         continue;
        //     }
        //     console.log(res);
        // },
        hideMarker(flag) {
            let data = this.monitor.cars.all;
            if (flag === "hide") {
                for (let item in data) {
                    if (this.markers[data[item].sim] === undefined) {
                        continue;
                    }
                    data[item].active = false;
                    this.markers[data[item].sim].hide();
                }
                if (infoWindow !== undefined && infoWindow.getIsOpen()) {
                    infoWindow.close();
                }
                this.monitor.tracking = false;
            }
            else {
                if (JSON.stringify(this.monitor.currentItem) != "{}") {
                    this.markers[this.monitor.currentItem.sim].hide();
                }
                this.markers = {};
                this.monitor.tracking = true;
                this.handleCreateMarker(data);
            }
        },
        remoteFilter(query) {
            if (query !== "") {
                var allCars = this.monitor.cars.all;
                this.monitor.track.filter.cars = allCars.filter(this.createStateFilter(query.toLowerCase()));
            }
            else {
                this.monitor.track.filter.cars = [];
            }
        }
    },
    activated() {
        global.printLog("activated");
        this.handleTypeChange(this.monitorType);
    },
    deactivated() {
        amaps.clearMap();
        this.markers = {};
        this.lineArr = [];
        clearInterval(collapsedTimer);
        global.printLog("deactivated");
    },
    watch: {
        collapsed() {
            this.monitorMapLeftPos = this.collapsed ? 80 : 220;
        }
    }
}

//构建自定义信息窗体
function createInfoWindow(title, content) {
    var info = document.createElement("div");
    info.className = "info-window";

    //可以通过下面的方式修改自定义窗体的宽高
    //info.style.width = "400px";
    // 定义顶部标题
    var top = document.createElement("div");
    var titleD = document.createElement("div");
    var closeX = document.createElement("a");
    top.className = "info-window-top";
    titleD.innerHTML = title;
    closeX.className = "close glyph-icon icon-close";
    closeX.onclick = closeInfoWindow;

    top.appendChild(titleD);
    top.appendChild(closeX);
    info.appendChild(top);

    // 定义中部内容
    var middle = document.createElement("div");
    middle.className = "info-middle";
    middle.style.backgroundColor = 'white';
    middle.innerHTML = content;
    info.appendChild(middle);

    // 定义底部内容
    var bottom = document.createElement("div");
    bottom.className = "info-bottom";
    bottom.style.position = 'relative';
    bottom.style.top = '0px';
    bottom.style.margin = '0 auto';
    var sharp = document.createElement("img");
    sharp.src = "http://webapi.amap.com/images/sharp.png";
    bottom.appendChild(sharp);
    info.appendChild(bottom);
    return info;
}

function loadRemotePicture(obj, obj1, obj2, that) {
    document.getElementById(obj2).style.display = "block";
    that.queryCapturePhoto((data, datetime) => {
        timerCount = 0;
        document.getElementById(obj2).style.display = "none";
        if (data) {
            document.getElementById("remotePicture").src = data;
            document.getElementById(obj1).style.display = "block";
        }
        else {
            document.getElementById("failed-text").style.display = "block";
        }
    }, 1);
}

//关闭信息窗体
function closeInfoWindow() {
    amaps.clearInfoWindow();
}

</script>

<style lang="scss">
.info-window {
    box-shadow: 0 1px 20px rgba(0, 0, 0, .4); //width: 351px;
}

.info-window-top {
    position: relative;
    background: #20A0FF;
    .window-title {
        padding-left: 15px;
        display: table-cell;
        vertical-align: middle;
        .glyph-icon {
            padding: 0 8px;
            margin: 0 3px;
            color: #FFF;
            font-size: 1.8em;
        }
    }
}

.info-window-top div {
    color: #FFF;
    line-height: 50px; // padding: 0 6px;
}

.info-window-top a.close {
    position: absolute;
    display: inline-block;
    top: 18px;
    right: 0;
    transition-duration: 0.25s;
    cursor: pointer;
    font-size: 16px;
}

div.info-middle {
    font-size: 13px; // padding: 6px;
    padding-bottom: 0;
    line-height: 20px;
    min-height: auto;
}

div.info-bottom {
    height: 0px;
    width: 100%;
    clear: both;
    text-align: center;
}

div.info-bottom img {
    position: relative;
    z-index: 104;
}

// ---
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
    width: 340px;
    background: #FFF;
    max-height: 350px;
    overflow: hidden;
    overflow-y: auto;
    ul li a:not(.capturePhoto) {
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
    .results-box-inner {
        margin: 0 auto;
        color: #000;
        width: 320px;
        background: #FFF;
        .info-item {
            border-bottom: 1px solid #d1dbe5;
            .item-pics {
                width: 240px;
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
            padding: 0 15px;
        }
        .no-tranning {
            width: 320px;
            padding: 20px 0;
            border-bottom: 1px solid #d1dbe5;
            .pic {
                width: 117px;
                height: 81px;
                background: url("../../../static/images/icons.png") no-repeat;
                margin: 0 auto;
            }
            .txt {
                text-align: center;
                display: block;
                line-height: 40px;
                color: #333;
            }
        }
        .capture-photo {
            display: table-cell;
            vertical-align: middle;
            height: 80px;
            width: 350px;
            text-align: center;
            >a {
                width: 60px;
                height: 60px;
                border-radius: 100%;
                display: inline-block;
                background: #20A0FF;
                >em {
                    font-size: 2.2em;
                    margin-right: 0;
                    float: none;
                    line-height: 58px;
                }
            }
        }
        .toolbar {
            width: 100px;
            position: absolute;
            top: 20px;
            right: 1px;
            z-index: -1;
            ul li {
                margin-bottom: 10px;
                text-align: center;
                display: inline-block;
                width: 50px;
                background: transparent;
                position: relative;
                right: -41px;
                a.capturePhoto {
                    display: block;
                    background: #fff;
                    border-top-left-radius: 0;
                    border-top-right-radius: 2em;
                    border-bottom-right-radius: 2em;
                    border-bottom-left-radius: 0;
                    box-shadow: 3px 3px 10px rgba(0, 0, 0, .35);
                    .inner {
                        border-radius: 100%;
                        width: 40px;
                        height: 40px;
                        display: inline-block;
                        >i {
                            font-size: 3em;
                            color: #20A0FF;
                        }
                    }
                }
            }
        }
    }
    &.vehicleList {
        overflow-y: auto;
        box-shadow: 0 2px 2px rgba(0, 0, 0, .15);
    }
    &.box-detail {
        width: 420px;
        background: transparent;
        .results-box-inner {
            overflow-y: auto;
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

.map-container {
    position: absolute;
    top: 118px;
    left: 220px;
    right: 20px;
    bottom: 20px;
    border: 1px solid #d1dbe5;
    .container-vehicle {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 300px;
        border-right: 1px solid #d1dbe5;
        .vehicle-filter {
            height: 50px;
            border-bottom: 1px solid #d1dbe5;
            text-align: center;
            line-height: 50px;
            .el-autocomplete {
                width: 92%;
            }
            .el-input--small .el-input__inner {
                height: 34px;
            }
        }
        .vehicle-status {
            height: 60px;
            display: table-cell;
            vertical-align: middle;
            width: 300px;
            border-bottom: 1px solid #d1dbe5;
            ul li {
                float: left;
                text-align: center;
                display: inline-block;
                a>span {
                    display: block;
                    text-align: center;
                    font-size: 13px;
                    &:first-child {
                        font-size: 16px;
                    }
                }
                .glyph-icon {
                    font-size: 2em;
                    text-align: center;
                    float: inherit;
                    width: 30px;
                    margin: 5px 0 0 2px;
                    &.open {
                        color: #20a0ff;
                    }
                    &.close {
                        color: #999;
                    }
                }
                &:not(:last-child) {
                    width: 21.8%;
                }
            }
        }
        .vehicle-list {
            position: absolute;
            top: 112px;
            bottom: 0;
            width: 100%;
            overflow-y: auto;
            a {
                padding: 0 15px;
                display: block;
                line-height: 50px;
                &:hover {
                    background: #EEEEEE;
                }
                &.active {
                    background: #EEEEEE;
                }
                em {
                    font-style: normal;
                }
            }
        }
        .vehicle-list-collapsed {
            position: absolute;
            top: 45%;
            right: -22px;
            width: 20px;
            height: 70px;
            z-index: 9999;
            background: #fff;
            border: 1px solid #d1dbe5;
            border-top-right-radius: .8em;
            border-bottom-right-radius: .8em;
            .el-icon-arrow-left,
            .el-icon-arrow-right {
                line-height: 70px;
                font-size: 1.5em;
                color: #999;
            }
        }
        &.min {
            width: 130px;
            .vehicle-status {
                ul li {
                    width: 50%;
                    .glyph-icon {
                        width: 60px;
                    }
                }
            }
            .vehicle-list {
                em {
                    width: 8px;
                    height: 8px;
                    margin-right: 6px;
                    border-radius: 100%;
                    display: inline-block;
                    &.online {
                        background: #20A0FF;
                    }
                    &.offline {
                        background: #B3B3B3;
                    }
                    &.tranning {
                        background: #13CE66;
                    }
                }
            }
        }
    }
    #container-map {
        position: absolute;
        top: 0;
        left: 301px;
        bottom: 0;
        right: 0;
        >p {
            position: relative;
            top: 50%;
            font-size: 1.1em;
            text-align: center;
            .el-icon-loading {
                color: #1D8CE0;
            }
        }
    }
    #mapContainer {
        height: 100%;
    }
    .track-history {
        position: absolute;
        top: 0;
        left: 0;
        height: auto;
        width: 355px;
        background: #FFF;
        border-right: 1px solid #d1dbe5;
        border-bottom: 1px solid #d1dbe5; // box-shadow: 10px 0 10px rgba(0, 0, 0, .2);
        // box-shadow: 0 0 5px rgba(0, 0, 0, .2);
        .filter-header {
            text-align: center;
            line-height: 50px;
            .el-select,
            .el-date-editor.el-input {
                width: 92%;
                .el-input__inner {
                    height: 34px;
                    border-radius: 2px;
                }
            }
            &:nth-child(2) {
                border-bottom: 1px solid #D8D8D8;
            }
            &:nth-child(3) {
                padding-top: 10px;
            }
            .el-progress {
                margin-top: 16px;
                margin-bottom: 10px;
                .el-progress-bar {
                    width: 92%;
                    .el-progress-bar__inner {
                        line-height: 1;
                    }
                }
            }
            .el-button {
                padding: 8px 15px;
            }
            &.information {
                line-height: 0;
                padding-bottom: 20px;
                p {
                    margin-top: 15px;
                    >i {
                        font-size: 3em;
                    }
                    &.normal {
                        color: #21364C;
                    }
                    &.empty {
                        color: #20A0FF;
                    }
                }
            }
        }
        .open-table {
            a {
                display: block;
                width: 75px;
                line-height: 20px;
                margin: 0 auto;
                margin-top: 16px;
                background: #E5E9F2;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
                text-align: center;
            }
        }
        .el-table {
            border: 0;
        }
    }
}

.online {
    color: #13CE66;
}

.offline {
    color: #838A96;
}

.tranning {
    color: #13CE66;
}

.monitor-map {
    position: absolute;
    top: 118px;
    left: 220px;
    border: 1px solid #000;
    right: 20px;
    bottom: 0; // #mapContainer {
    //     height: 100%;
    // }
}
</style>