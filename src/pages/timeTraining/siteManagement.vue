<template>
    <section v-loading="pageLoading">
        <el-row>
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" class="right">
                    <el-form-item>
                        <el-button type="primary" @click="handleAdd(1)">添加场地</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="sitesList" highlight-current-row @row-click="rowClick">
                <el-table-column prop="name" label="区域名称">
                </el-table-column>
                <el-table-column prop="address" label="区域地址">
                </el-table-column>
                <el-table-column prop="area" label="区域面积(平方米)" width="200">
                </el-table-column>
                <el-table-column prop="stage" label="培训部分" :formatter="formatData">
                </el-table-column>
                <el-table-column prop="teachType" label="培训车型">
                </el-table-column>
                <!--<el-table-column prop="gmtModify" label="新增时间" :formatter="formatData" width="160">
                                                </el-table-column>-->
                <el-table-column prop="report" label="上报状态" :formatter="formatData">
                </el-table-column>
                <el-table-column prop="status" label="审核状态" :formatter="formatData">
                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template scope="scope">
                        <el-button type="text" size="small" @click.stop="handleOperator(scope.row,1)" :disabled="scope.row.status!=='UN_DO'">审核</el-button>
                        <el-button type="text" size="small" @click.stop="handleOperator(scope.row,2)" :disabled="scope.row.status==='DOING'">修改</el-button>
                        <el-button type="text" size="small" @click.stop="handleOperator(scope.row,3)" :disabled="scope.row.status==='DOING'">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--工具条-->
            <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="10" :total="total">
            </el-pagination>
        </el-row>
        <el-dialog title="场地详情" v-model="detailsFormVisible" :close-on-click-modal="false" size="full" @close="handleDialogClose">
            <el-form :model="detailSiteForm" :inline="true">
                <p class="group-title">场地信息</p>
                <el-row class="mb15">
                    <el-col :span="6">
                        <span>区域名称：{{detailSiteForm.name}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span>区域地址：{{detailSiteForm.address}}</span>
                    </el-col>
                    <el-col :span="5">
                        <span>区域面积(平方米)：{{detailSiteForm.area}}</span>
                    </el-col>
                    <el-col :span="5">
                        <span>培训部分：{{detailSiteForm.stage}}</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <span>培训车型：{{detailSiteForm.teachType}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span>新增时间：{{detailSiteForm.gmtModify}}</span>
                    </el-col>
                    <el-col :span="5">
                        <span>上报状态：{{detailSiteForm.report?"已上报":"未上报"}}</span>
                    </el-col>
                    <el-col :span="5">
                        <span>审核状态：{{(detailSiteForm.status==="UN_DO"?"未审核":detailSiteForm.status==="SUCCESS"?"审核成功":detailSiteForm.status==="DOING"?"审核中":"审核失败")}}</span>
                    </el-col>
                </el-row>
                <p class="group-title">围栏展示</p>
                <el-row>
                    <div id="mapContainer1"></div>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="detailsFormVisible = false" size="large">确定</el-button>
            </div>
        </el-dialog>
        <!--新增场地界面-->
        <el-dialog title="新增场地" v-model="newSiteFormVisible" :close-on-click-modal="false" size="full" @close="handleDialogClose">
            <el-form v-if="newSiteFormVisible" :model="newSiteForm" :rules="siteFormRule" ref="newSiteForm" :inline="true" class="demo-form-inline newSiteForm" label-width="115px">
                <p class="group-title">设置围栏</p>
                <el-row>
                    <div id="mapContainer"></div>
                </el-row>
                <p class="group-title">围栏信息</p>
                <el-row>
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="newSiteForm.name" placeholder="名称"></el-input>
                    </el-form-item>
                    <el-form-item label="培训部分" class="normal" prop="stage">
                        <el-select v-model="newSiteForm.stage" placeholder="请选择培训部分">
                            <el-option label="科目二" value="PART_2"></el-option>
                            <el-option label="科目三" value="PART_3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="面积(平方米)" prop="area">
                        <el-input v-model="newSiteForm.area" placeholder="面积(平方米)"></el-input>
                    </el-form-item>
                    <el-form-item label="容纳车辆数" prop="maxCarNum">
                        <el-input v-model="newSiteForm.maxCarNum" placeholder="容纳车辆数"></el-input>
                    </el-form-item>
                    <el-form-item label="投放车辆数" prop="realCarNum">
                        <el-input v-model="newSiteForm.realCarNum" placeholder="投放车辆数"></el-input>
                    </el-form-item>
                    <el-form-item label="培训车型" class="addr" prop="teachType">
                        <el-select v-model="newSiteForm.teachType" multiple placeholder="请选择培训车型" style="width:814px;">
                            <el-option v-for="item in teachTypeOptions" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="地址" class="addr" prop="address">
                        <el-input v-model="newSiteForm.address" placeholder="地址"></el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="newSiteFormVisible = false" size="large">取消</el-button>
                <el-button type="primary" size="large" @click="postCreateSite">保存</el-button>
            </div>
        </el-dialog>
        <!--新增场地界面-->
        <el-dialog title="编辑场地" v-model="editSiteFormVisible" :close-on-click-modal="false" size="full" @close="handleDialogClose">
            <el-form v-if="editSiteFormVisible" :model="editSiteForm" :rules="siteFormRule" ref="editSiteForm" :inline="true" class="demo-form-inline newSiteForm" label-width="115px">
                <p class="group-title">设置围栏</p>
                <el-row>
                    <div id="mapContainer2"></div>
                </el-row>
                <p class="group-title">围栏信息</p>
                <el-row>
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="editSiteForm.name" placeholder="名称"></el-input>
                    </el-form-item>
                    <el-form-item label="培训部分" class="normal" prop="stage">
                        <el-select v-model="editSiteForm.stage" placeholder="请选择培训部分">
                            <el-option label="科目二" value="PART_2"></el-option>
                            <el-option label="科目三" value="PART_3"></el-option>
                            <!--<el-option v-for="item in trainingStageOptions" :label="item.label" :value="item.value"></el-option>-->
                        </el-select>
                    </el-form-item>
                    <el-form-item label="面积(平方米)" prop="area">
                        <el-input v-model="editSiteForm.area" placeholder="面积(平方米)"></el-input>
                    </el-form-item>
                    <el-form-item label="容纳车辆数" prop="maxCarNum">
                        <el-input v-model="editSiteForm.maxCarNum" placeholder="容纳车辆数" ref="maxCarNum" @change="handleInputChange"></el-input>
                    </el-form-item>
                    <el-form-item label="投放车辆数" prop="realCarNum">
                        <el-input v-model="editSiteForm.realCarNum" placeholder="投放车辆数"></el-input>
                    </el-form-item>
                    <el-form-item label="培训车型" class="addr" prop="sex">
                        <el-select v-model="editSiteForm.teachType" multiple placeholder="请选择培训车型" style="width:814px;">
                            <el-option v-for="item in teachTypeOptions" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="地址" class="addr" prop="address">
                        <el-input v-model="editSiteForm.address" placeholder="地址"></el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editSiteFormVisible = false" size="large">取消</el-button>
                <el-button type="primary" size="large" @click="postCreateSite">保存</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<style lang="scss">
.newSiteForm {
    .addr .el-form-item__content {
        width: 814px;
    }
}

#mapContainer,
#mapContainer1,
#mapContainer2 {
    height: 550px;
    width: 100%;
    border: 1px solid #d1dbe5;
}
</style>

<script>
var amaps;
var mouseTool;
var makerShow = [];
var polygonArr = [];
var activePolygon = null;
var lnglatInArea = false;
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        return {
            page: 1,
            total: 0,
            sitesList: [],
            pageLoading: false,
            teachTypeOptions: [],
            trainingStageOptions: [],//global.options.stage
            newSiteFormVisible: false,
            newSiteForm: {
                schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                name: "",
                stage: "PART_2",
                area: "",
                address: "",
                teachType: [],
                maxCarNum: 1,
                realCarNum: 1,
                points: []
            },
            //name stage area address maxCarNum realCarNum teachType
            siteFormRule: {
                name: [
                    { required: true, message: "请填写场地名称", trigger: "blur" }
                ],
                stage: [
                    { required: true, message: "请选择培训部分", trigger: "change" }
                ],
                area: [
                    {
                        required: true, validator: (rule, value, callback) => {
                            if (!value) {
                                return callback(new Error("请填写场地面积"));
                            }
                            else if (!global.fieldVerification.IsFloatNumber(value, 1)) {
                                return callback(new Error("场地面积只能填写数字或浮点数值，小数点后保留1位"));
                            }
                            callback();
                        }, trigger: "blur"
                    }
                ],
                maxCarNum: [
                    {
                        required: true, validator: (rule, value, callback) => {
                            if (!value) {
                                return callback(new Error("请填写容纳车辆数"));
                            }
                            else if (!/^[1-9]\d*$/.test(value)) {
                                return callback(new Error("容纳车辆数必须为大于0的纯数字"));
                            }
                            callback();
                        }, trigger: "blur"
                    }
                ],
                realCarNum: [
                    {
                        required: true, validator: (rule, value, callback) => {
                            if (!value) {
                                return callback(new Error("请填写投放车辆数"));
                            }
                            else if (!/^[1-9]\d*$/.test(value)) {
                                return callback(new Error("投放车辆数必须为大于0的纯数字"));
                            }
                            callback();
                        }, trigger: "blur"
                    }
                ],
                teachType: [{ required: true, type: "array", message: "请选择培训车型", trigger: "change" }],
                address: [{ required: true, message: "请填写场地所在地址", trigger: "blur" }]
            },
            editSiteFormVisible: false,
            editSiteForm: {
                id: 0,
                schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                name: "",
                stage: "",
                area: "",
                address: "",
                teachType: [],
                maxCarNum: "",
                realCarNum: "",
                points: []
            },
            detailsFormVisible: false,
            detailSiteForm: {},
            curSiteId: 0,
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode
        }
    },
    methods: {
        //数据转换
        formatData(row, column) {
            if (column.property === "report") {
                return row.report ? "已上报" : "未上报";
            }
            else if (column.property === "status") {
                return global.enums.status[row.status];
            }
            else if (column.property === "stage") {
                return global.enums.newStage[row.stage];
            }
            else if (column.property === "gmtModify") {
                return new Date(row.gmtModify).Format("yyyy-MM-dd HH:mm:ss");
            }
        },
        //列表行点击
        rowClick(row) {
            let id = row.id;
            this.curSiteId = id;
            this.detailsFormVisible = true;
            this.initMap(() => {
                this.initData(false);
                this.getSitesDetail(id, (data) => {
                    this.detailSiteForm = data;
                    this.detailSiteForm.teachType = data.teachType.join("、");
                    this.detailSiteForm.stage = global.enums.newStage[data.stage];
                    this.detailSiteForm.gmtModify = new Date(data.gmtModify).Format("yyyy-MM-dd HH:mm:ss");
                    //global.printLog(data.points);
                    setupInitialData(data.points, false);
                });
            }, "mapContainer1");
        },
        //获取场地列表
        getSites() {
            this.pageLoading = true;
            let para = [this.schoolCode, "", "", this.page, 10];
            setTimeout(() => {
                request.timeTraining.site.query(para).then((res) => {
                    if (res.success === true) {
                        this.pageLoading = false;
                        let data = res.object;
                        global.printLog(data);
                        this.total = data.num;
                        this.sitesList = data.list;
                    }
                });
            }, 1000);
        },
        //获取场地详情
        getSitesDetail(id, callback) {
            request.timeTraining.site.queryById(id).then((res) => {
                if (res.success === true) {
                    callback(res.object);
                }
                else {
                    callback(false);
                }
            });
        },
        //获取车辆类型
        getCarType() {
            request.public.queryCarType().then((res) => {
                if (res.success === true) {
                    this.teachTypeOptions = res.object;
                }
            });
        },
        //获取培训部分
        getTrainingStage() {
            this.trainingStageOptions = [];
            let stageArr = global.options.stage;
            for (let item in stageArr) {
                if (item != 0 && item != 3) {
                    this.trainingStageOptions.push(stageArr[item]);
                }
            }
            //this.filters.wall.stage = this.stageOptions[0].value;
            // request.timeTraining.queryStage().then((res) => {
            //     if (res.success === true) {
            //         this.trainingStageOptions = res.object;
            //     }
            // });
        },
        //打开新建场地
        handleAdd() {
            polygonArr = [];
            this.newSiteForm = {
                schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                name: "",
                stage: "PART_2",
                area: "",
                address: "",
                teachType: [],
                maxCarNum: 1,
                realCarNum: 1,
                points: []
            };
            this.newSiteFormVisible = true;
            this.initMap(() => {
                this.initData(true);
                this.getTrainingStage();
            }, "mapContainer");
        },
        //列表操作
        handleOperator(row, operator) {
            let id = row.id;
            if (operator === 1) {
                request.timeTraining.site.review(id).then((res) => {
                    if (res.success === true) {
                        this.getSites();
                        this.$message({ message: "场地审核成功", type: "success" });
                    }
                    else {
                        this.$message.error("场地审核失败，原因：" + res.message);
                    }
                });
            }
            else if (operator === 2) {
                global.printLog(operator);
                this.editSiteFormVisible = true;
                this.initMap(() => {
                    this.initData(false);
                    this.getSitesDetail(id, (data) => {
                        if (data) {
                            this.editSiteForm = {
                                id: data.id,
                                schoolCode: data.schoolCode,
                                name: data.name,
                                stage: data.stage,
                                area: data.area,
                                address: data.address,
                                teachType: data.teachType,
                                maxCarNum: data.maxCarNum,
                                realCarNum: data.realCarNum,
                                points: data.points,
                            }
                            setupInitialData(data.points, true);
                        }
                    });
                }, "mapContainer2");
            }
            else if (operator === 3) {
                this.$confirm("您正在执行删除场地操作, 是否继续？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    request.timeTraining.site.delete(id).then((res) => {
                        if (res.success === true) {
                            this.getSites();
                            this.$message({ type: "success", message: "删除成功" });
                        }
                        else {
                            this.$message.error("删除失败，原因：" + res.message);
                        }
                    });
                }).catch(() => { });
            }
        },
        //提交新建场地
        postCreateSite() {
            if (this.newSiteFormVisible) {
                this.$refs["newSiteForm"].validate((valid) => {
                    if (valid) {
                        this.newSiteForm.points = [];
                        if (polygonArr.length) {
                            var path = polygonArr[0].G.path;
                            for (var item in path) {
                                this.newSiteForm.points.push({
                                    "longitude": path[item].lng,
                                    "latitude": path[item].lat
                                });
                            }
                            let para = Object.assign({}, this.newSiteForm);
                            request.timeTraining.site.create(para).then((res) => {
                                if (res.success === true) {
                                    this.getSites();
                                    this.newSiteFormVisible = false;
                                    this.$message({ message: "场地创建成功", type: "success" });
                                }
                                else {
                                    this.$message.error("场地创建失败，原因：" + res.message);
                                }
                            });
                        }
                        else {
                            this.$message.error("请在地图上设置围栏");
                        }
                    }
                });
            }
            else {
                if (activePolygon !== null) {
                    this.editSiteForm.points = [];
                    var path = activePolygon.G.path;
                    for (var item in path) {
                        this.editSiteForm.points.push({
                            "longitude": path[item].lng,
                            "latitude": path[item].lat
                        });
                    }
                }
                let para = Object.assign({}, this.editSiteForm);
                request.timeTraining.site.edit(para).then((res) => {
                    if (res.success === true) {
                        this.getSites();
                        this.editSiteFormVisible = false;
                        this.$message({ message: "场地编辑成功", type: "success" });
                    }
                    else {
                        this.$message.error("场地编辑失败，原因：" + res.message);
                    }
                });
            }
        },
        //列表翻页
        handleCurrentChange() {
            this.page = val;
            this.getSites();
        },
        //初始化数据
        initData(draw) {
            var editor = {};
            lnglatInArea = false;
            setTimeout(() => {
                if (draw) {
                    mouseTool = new AMap.MouseTool(amaps);
                    AMap.event.addListener(amaps, "click", (e) => {
                        var lnglat = e.lnglat;
                        for (var i = 0; i < polygonArr.length; i++) {
                            if (polygonArr[i].contains(lnglat)) {
                                lnglatInArea = true;
                            }
                        }
                        if (!lnglatInArea) {
                            closeAllEditor();
                        }
                    });
                    var markers = [], _points, _mouseTool;
                    amaps.plugin(["AMap.MouseTool"], () => {
                        mouseTool.polygon({
                            strokeColor: "#4A90E2",
                            strokeOpacity: 1,
                            fillColor: "#E0E3E5",
                            fillOpacity: 0.5,
                            strokeStyle: "dashed"
                        });
                        AMap.event.addListener(mouseTool, "draw", (mt) => {
                            mouseTool.close();
                            var polygon = mt.obj;
                            polygonArr.push(polygon);
                            var editor = new AMap.PolyEditor(amaps, polygon);
                            polygon.setExtData({
                                editor: editor
                            });
                            addDeleteDelegate(polygon);
                            closeAllEditor();
                            activePolygon = polygon;
                            makerShowAndOpenEditor(editor);
                        });
                    });
                }
            }, 1000);
        },
        handleDialogClose() {
            amaps.clearMap();
        },
        initMap(callback, mapObj) {
            //global.printLog(window._amapInit);
            var interval = setInterval(() => {
                if (window._amapInit) {
                    clearInterval(interval);
                    //global.printLog("地图已加载完成^_^");
                    this.$message.success({ message: "地图已加载完成^_^" });
                    setTimeout(() => {
                        global.printLog(this.curSiteId);
                        request.public.queryTranning3DPictureById(this.curSiteId).then((res) => {
                            if (res.success) {
                                let tileLayer = [];
                                if (res.object) {
                                    let data = res.object;
                                    let upLeft = [data.upLeft.longitude, data.upLeft.latitude];
                                    let downRight = [data.downRight.longitude, data.downRight.latitude];
                                    tileLayer = [new AMap.TileLayer(), new AMap.ImageLayer({
                                        url: data.picUrl,
                                        bounds: new AMap.Bounds(
                                            upLeft,
                                            downRight
                                        ),
                                        zooms: [3, 20]
                                    })];
                                }
                                amaps = new AMap.Map(mapObj, {
                                    resizeEnable: true,
                                    zoom: 11,
                                    layers: tileLayer,
                                    expandZoomRange: true,
                                    zooms: [3, 20]
                                    //center: [global.map.center.lat, global.map.center.lng]
                                });
                                amaps.on("complete", () => {
                                    callback();
                                });
                            }
                        });
                        // let tranningPicture = this.$store.state.tranningPicture;
                        // for (let item in tranningPicture) {
                        //     let upLeft = [tranningPicture[item].upLeft.longitude, tranningPicture[item].upLeft.latitude];
                        //     let downRight = [tranningPicture[item].downRight.longitude, tranningPicture[item].downRight.latitude];
                        //     let tileLayer = [new AMap.TileLayer(), new AMap.ImageLayer({
                        //         url: tranningPicture[item].picUrl,
                        //         bounds: new AMap.Bounds(
                        //             upLeft,
                        //             downRight
                        //         ),
                        //         zooms: [3, 20]
                        //     })];
                        //     amaps = new AMap.Map("mapContainer", {
                        //         resizeEnable: true,
                        //         zoom: 11,
                        //         //center: [104.803023, 29.348056],
                        //         layers: tileLayer,
                        //         expandZoomRange: true,
                        //         zooms: [3, 20]
                        //     });
                        // }
                    }, 50);
                }
                else {
                    global.printLog("地图拼命加载中，" + interval);
                }
            }, 50);
        },
        handleInputChange(val) {
            this.$nextTick(function () {
                global.printLog(val);
                this.$refs.maxCarNum.$refs.input.value = (val === "0" ? 1 : val);
            });
        }
    },
    activated() {
        global.printLog("activated every one");
        this.getCarType();
        this.getSites();
    },
    deactivated() {
        if (typeof (amaps) !== "undefined") {
            amaps.clearMap();
        }
    },
    mounted() {
    }
}

function closeAllEditor() {
    for (var i = 0; i < polygonArr.length; i++) {
        var editor = polygonArr[i].getExtData().editor;
        polygonArr[i].setOptions({
            strokeColor: "#0e81e5",
            fillColor: "#0e81e5",
            strokeStyle: "solid"
        });
        editor.close()
    }
    activePolygon = null;
}

function addDeleteDelegate(polygon) {
    AMap.event.addListener(polygon, "mouseover", function (e) {
        if (activePolygon !== polygon) {
            polygon.setOptions({
                strokeColor: "#ff738f",
                fillColor: "#ff738f",
                strokeStyle: "solid"
            })
        }

    });
    AMap.event.addListener(polygon, "mouseout", function (e) {
        if (activePolygon !== polygon) {
            polygon.setOptions({
                strokeColor: "#0e81e5",
                fillColor: "#0e81e5",
                strokeStyle: "solid"
            })
        }
    });

    AMap.event.addListener(polygon, "click", function (e) {
        closeAllEditor();
        polygon.setOptions({
            strokeColor: "#ff738f",
            fillColor: "#ff738f",
            strokeStyle: "dashed"
        });
        activePolygon = polygon;
        makerShowAndOpenEditor(polygon.getExtData().editor);
        return false;
    });
}

function makerShowAndOpenEditor(editor) {
    editor.open();
    var regionData = getRegionData();
    if (regionData == null || regionData.length == 0) {
        return;
    }
    //去掉所有的maker
    if (makerShow != null && makerShow.length != 0) {
        for (var m = 0; m < makerShow.length; m++) {
            amaps.remove(makerShow[m]);
        }
    }
}

function getRegionData() {
    var pathData = [];
    for (var j = 0; j < polygonArr.length; j++) {
        var polygon = polygonArr[j];
        pathData.push(polygon.getPath())
    }
    return pathData
}

function setupInitialData(initPolygonData, draw) {
    lnglatInArea = true;
    if (initPolygonData.length == 0) {
        mouseTool.polygon();
        return
    }
    setTimeout(() => {
        var polygonDataArr = [];
        amaps.setCenter(new AMap.LngLat(initPolygonData[0].longitude, initPolygonData[0].latitude));
        for (var i = 0; i < initPolygonData.length; i++) {
            var polygonData = initPolygonData[i];
            var point = new AMap.LngLat(polygonData.longitude, polygonData.latitude);
            polygonDataArr.push(point);
        }
        var polygon = new AMap.Polygon({
            map: amaps,
            strokeColor: "#0e81e5",
            fillColor: "#0e81e5",
            strokeStyle: "solid",
            fillOpacity: 0.5,
            strokeOpacity: 1,
            path: polygonDataArr
        });
        var editor = new AMap.PolyEditor(amaps, polygon);
        if (draw) {
            addDeleteDelegate(polygon);
        }
        polygon.setExtData({
            editor: editor
        });
        polygonArr.push(polygon);
        amaps.setFitView();
    }, 200);
}

</script>