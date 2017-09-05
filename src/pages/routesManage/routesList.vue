<template>
    <section v-loading="pageLoading">
        <!--工具条-->
        <el-row>
            <el-col :span="25" class="toolbar">
                <el-form :inline="true">
                    <el-form-item>
                        <el-input class="search-input mr10 left" v-model="keyWord" placeholder="线路名称" icon="search" :on-icon-click="queryRoutes"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="routes" highlight-current-row @row-click='rowClick'>
                <el-table-column prop="name" label="线路名称">
                </el-table-column>
                <el-table-column prop="teacherName" label="采集人">
                </el-table-column>
                <el-table-column prop="gmtCreate" label="创建时间">
                </el-table-column>
                <el-table-column prop="gmtModify" label="编辑时间">
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button size="small" type="text" @click.stop="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--线路详情-->
            <el-dialog title="线路详情" v-model="detailsFormVisible" :close-on-click-modal="false" size="full" @close="()=>{detailsFormVisible=false;}">
                <!-- 基本信息 -->
                <el-row class="mb20" style="margin-top:20px;">
                    <el-popover @hide="hidePop" ref="isEdit" placement="top" width="200" v-model="visible2">
                        <el-input style="margin:1px 2px;" placeholder='请输入线路名称' v-model='routeInfo.name' size="small" :autofocus='true'></el-input>
                        <div style="text-align: right; margin:2px;">
                            <el-button size="mini" type="text" @click="cancel">取消</el-button>
                            <el-button type="text" size="mini" @click="editRoute">确定</el-button>
                        </div>
                    </el-popover>
                    <el-col :span="6">
                        <span>名称：</span>
                        <span>{{currentRoute.name}}</span>
                        <span style="color:#58B7FF;cursor:pointer;margin-left:10px;" v-popover:isEdit type="text" @click="editable=!editable">修改</span>
                    </el-col>
                    <el-col :span="6">采集人：{{routeInfo.teacherName}}</el-col>
                    <el-col :span="6">新增时间：{{new Date(routeInfo.gmtCreate).Format('yyyy-MM-dd HH:mm:ss')}}</el-col>
                    <el-col :span="6">编辑时间：{{new Date(routeInfo.gmtModify).Format('yyyy-MM-dd HH:mm:ss')}}</el-col>
                </el-row>
                <el-row class="mb20">
                    <div id="mapContainer"></div>
                </el-row>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="()=>{detailsFormVisible = false;}" size="large">取消</el-button>
                </div>
            </el-dialog>
            <!--工具条-->
            <el-pagination @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :page-size="pageSize" :total="total">
            </el-pagination>
        </el-row>
    </section>
</template>
<script type="text/javascript">
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
var amaps;
export default {
    data() {
        return {
            visible2: false,
            editable: false,
            detailsFormVisible: false,
            routes: [],
            key: -1,
            pageSize: global.pageSize,
            total: 0,
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            keyWord: "",
            page: 1,
            pageLoading: false,
            currentRoute: {},
            routeInfo: {},
            markers: [],
            dataArr: []
        }
    },
    methods: {
        hidePop() {
            if (this.currentRoute.name !== this.routeInfo.name) this.routeInfo.name = this.currentRoute.name;
        },
        // 线路编辑取消
        cancel() {
            this.visible2 = false;
            this.$message.info('已取消修改线路名称~');
        },
        // 线路编辑 名称
        editRoute() {
            // currentRoute 作为一个临时存储行信息的容器
            this.currentRoute.name = this.routeInfo.name;
            request.routesManage.editRouteLine(this.currentRoute).then(res => {
                if (res.success) {
                    this.routes[this.key].name = this.currentRoute.name;
                    this.$message.success('线路修改成功');
                    this.visible2 = false;
                } else {
                    this.$message.warn('修改失败，原因：' + res.message);
                }
            });
        },
        //创建标记到地图
        handleCreateMarker(data) {
            // 因为从服务器获取到的经纬度是真实的GPS坐标，而高德地图需要的是CGJ火星坐标
            // 所以需要先从高德接口转一下经纬度
            let convertArr = [], str = '', newData = [];
            newData = data; // 创建一个新的数组来存储接受到的变量
            // 遍历这个数组 构造高德api中需要的参数结构
            newData.forEach(item => {
                str += `${item.longitude},${item.latitude}|`;
            });
            // 请求高德接口
            request.routesManage.gpsToGCJ(str).then(res => {
                if (res.status === '1') {
                    let arrs = [];
                    // 当返回的状态码为 1，表示成功
                    // 返回的坐标在 locations 中，是字符串形式
                    arrs = res.locations.split(';');
                    arrs.forEach((item, index) => {
                        let arr = [];
                        arr = item.split(',');
                        convertArr.push(arr);
                    });
                    // 将newData中的经纬度修改为火星坐标
                    convertArr.forEach((item, index) => {
                        newData[index].longitude = item[0];
                        newData[index].latitude = item[1];
                    });
                    // 遍历修改之后的坐标系数组 创建标记
                    for (let i = 0, posData = newData.length; i < posData; i++) {
                        let item = newData[i];
                        let labels = `${i + 1} ${item.content}`;
                        this.markers[i] = new AMap.Marker({
                            icon: "/static/images/location.png",
                            position: [item.longitude, item.latitude],
                            map: amaps,
                            autoRotation: false,
                            label: {
                                offset: new AMap.Pixel(-3 * labels.length, -18),
                                content: labels,
                            }
                        });
                    }
                    // 重新设置地图中心点
                    amaps.setCenter(this.markers[data.length/2-1].getPosition());
                    // 调用连线方法 把修改过坐标的数组传过去
                    this.routeLine(newData);
                }
            });
        },
        //标记连线
        routeLine(data) {
            var lineArr = []; // 创建一个新数组，用来作为 数组数组 [[经度,维度],[经度,维度],[经度,维度]]
            data.forEach(item => {
                let arr = [];
                arr.push(parseFloat(item.longitude));
                arr.push(parseFloat(item.latitude));
                lineArr.push(arr);
            });
            // 连线
            return new AMap.Polyline({
                map: amaps,
                path: lineArr,
                strokeColor: "#FD6601",//线颜色
                strokeOpacity: 1,//线透明度
                strokeWeight: 7,//线宽
                strokeStyle: "solid"//线样式
            });
            if (data.length > 0) {
                amaps.setFitView(); // 初始化轨迹到地图
            }else{
                this.$message.warning("暂无轨迹数据");
            }
        },
        // 获取当前选中线路详情,并创建地图
        getRouteDetail(id) {
            this.dataArr = []; // 将坐标组置空
            // 将临时存储数组置空
            // this.pageLoading = true;
            if (this.currentRoute.points) this.currentRoute.points = [];
            request.routesManage.queryRouteDetail(id).then(res => {
                if (res.success) {
                    this.currentRoute.points = res.object.points;
                    this.routeInfo = res.object;
                    this.dataArr = res.object.points;
                    let firstLo = res.object.points[0];
                    // 初始化地图
                    var interval = setInterval(() => {
                        if (window._amapInit) {
                            clearInterval(interval);
                            setTimeout(() => {
                                let tileLayer = [];
                                amaps = new AMap.Map("mapContainer", {
                                    resizeEnable: true,
                                    zoom: 17,
                                    center: [firstLo.longitude, firstLo.latitude],
                                    layers: tileLayer,
                                    expandZoomRange: true,
                                    zooms: [3, 20]
                                });
                                amaps.on("complete", () => {
                                    initAMapUI();
                                    AMapUI.loadUI(["control/BasicControl"], (BasicControl) => {
                                        amaps.addControl(new BasicControl.LayerSwitcher({
                                            position: "rt"
                                        }));
                                    });
                                // 调用高德 GPS转火星坐标
                                this.handleCreateMarker(this.dataArr);
                                });
                            }, 50);
                            this.$message.success({ message: "地图已加载完成^_^" });
                        }
                        else {
                            global.printLog("地图拼命加载中，" + interval);
                        }
                    }, 50);
                } else {
                    this.$message({
                        type: 'error',
                        message: '获取当前线路详情失败，原因：' + res.message
                    });
                }
            });
        },
        // 列表行点击
        rowClick(row, evt, column) {
            this.key = row.key;
            this.currentRoute.id = row.id;
            this.currentRoute.identityCard = row.identityCard;
            this.currentRoute.name = row.name;
            this.detailsFormVisible = true;
            this.getRouteDetail(row.id);
        },
        // 查询线路
        queryRoutes() {
            this.routes = [];
            this.pageLoading = true;
            let args = [this.schoolCode, this.page, this.pageSize, this.keyWord];
            setTimeout(() => {
                request.routesManage.queryRoutes(args).then(res => {
                    if (res.success) {
                        let obj = res.object.list;
                        this.total = res.object.num;
                        obj.forEach((item, index) => {
                            this.routes.push({
                                id: item.id,
                                name: item.name,
                                teacherName: item.teacherName,
                                gmtCreate: new Date(item.gmtCreate).Format('yyyy-MM-dd HH:mm:ss'),
                                gmtModify: new Date(item.gmtModify).Format('yyyy-MM-dd HH:mm:ss'),
                                identityCard: item.identityCard,
                                points: item.points,
                                key: index
                            });
                        });
                    } else {
                        this.$message({ type: 'error', message: '线路查询失败，原因：' + res.message });
                    }
                    this.pageLoading = false;
                });
            }, 500);
        },
        // 删除线路
        handleDelete(index, row) {
            // 弹出模态框提醒用户是否删除当前线路
            this.$confirm('确定要删除当前线路吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false, // 点击周围不隐藏模态框
                type: 'warning'
            }).then(() => {
                request.routesManage.deleteRoute(row.id).then(res => {
                    if (res.success) {
                        this.queryRoutes();
                        this.$message.success('删除成功~');
                    }
                    else {
                        this.$message({ type: 'error', message: '删除线路失败，原因：' + res.message });
                    }
                });
            }).catch(() => { });
        },
        // 切换页请求新数据
        handleCurrentChange(val) {
            this.page = val;
            this.queryRoutes();
        }
    },
    // 组件激活
    activated() {
        this.queryRoutes();
    }
}
</script>
<style lang="scss">
.amap-marker-label {
    background: white;
    color: #FD6601;
    border: none;
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

.monitor-map {
    position: absolute;
    top: 118px;
    right: 20px;
    left: 80px;
    height: auto;
    bottom: 20px;
    #mapContainer {
        height: 100%;
    }
}
</style>