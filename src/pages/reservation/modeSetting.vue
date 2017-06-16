<template>
    <section class="mode" v-loading="pageLoading">
        <el-row>
            <!--工具条-->
            <el-col :span="24" class="toolbar mb15 ml15">
                <el-button type="primary" @click="handleAdd">新增模式</el-button>
            </el-col>
            <a href="javascript:" v-for="item in modelsList" @click.stop="handleQueryDetail(item.modelId)">
                <el-card class="box-card">
                    <div slot="header">
                        <span>{{ item.modelName }}</span>
                        <i class="el-icon-close right" style="color:#FF0000;" @click.stop="handleDel(item.modelId)"></i>
                    </div>
                    <p class="title">最低金额：{{item.minCost}} 最高金额：{{item.maxCost}}</p>
                    <div class="text-overflow">
                        <p class="comments">{{item.comments}}</p>
                    </div>
                </el-card>
            </a>
        </el-row>
        <el-dialog title="新增模式" v-model="addModelFormVisible" :close-on-click-modal="false" custom-class="custom-dialog-style">
            <el-form :model="addModelForm" label-width="95px" class="mt20" ref="addModelForm">
                <el-form-item label="模式名称" prop="modelName" :rules="[{ required: true, message: '请填写模式名称', trigger: 'blur' }]">
                    <el-input auto-complete="off" v-model="addModelForm.modelName"></el-input>
                </el-form-item>
                <el-form-item label="模式描述" prop="comments">
                    <el-input type="textarea" auto-complete="off" v-model="addModelForm.comments"></el-input>
                </el-form-item>
                <div class="mt15 mb15 t-center pb20" style="border-bottom:1px solid #dedede;">
                    <el-row>
                        <el-col :span="24">
                            <el-radio-group v-model="modelOfStage">
                                <el-radio-button label="科目二"></el-radio-button>
                                <el-radio-button label="科目三"></el-radio-button>
                            </el-radio-group>
                        </el-col>
                    </el-row>
                </div>
                <!--科目二列表-->
                <el-table :data="models.stage2" v-if="modelOfStage==='科目二'" height="301" ref="stage2Data">
                    <el-table-column label="开始时间">
                        <template scope="scope">
                            <el-input v-model="scope.row.beginTime" auto-complete="off" icon="time" @blur="checkStartTime(scope)"></el-input>
                            <!--<el-time-select v-model="scope.row.startTime" :picker-options="{start: '00:00',step: '00:15',end: '23:45'}" :editable="true" size="mini"></el-time-select>-->
                        </template>
                    </el-table-column>
                    <el-table-column label="结束时间">
                        <template scope="scope">
                            <el-input v-model="scope.row.endTime" auto-complete="off" icon="time" @blur="checkEndTime(scope,2)"></el-input>
                            <!--<el-time-select v-model="scope.row.endTime" :picker-options="{start: '00:00',step: '00:15',end: '23:45'}" :editable="false" size="mini"></el-time-select>-->
                        </template>
                    </el-table-column>
                    <el-table-column label="可约人数">
                        <template scope="scope">
                            <el-input v-model="scope.row.personCount" auto-complete="off" @blur="checkPositiveInteger(scope.row,4,'personCount')"></el-input>
                            <!--<el-input-number v-model="scope.row.personCount" size="small" :min="1" :max="4" :controls="false" @change="checkPositiveInteger(scope.row.personCount)"></el-input-number>-->
                        </template>
                    </el-table-column>
                    <el-table-column label="学时分钟数">
                        <template scope="scope">
                            <el-input v-model="scope.row.classMin" auto-complete="off" @blur="checkPositiveInteger(scope.row,9999,'classMin')"></el-input>
                            <!--<el-input-number v-model="scope.row.classMin" size="small" :min="1" :max="10000" :controls="false" @change="checkPositiveInteger(scope.row.classMin)"></el-input-number>-->
                        </template>
                    </el-table-column>
                    <el-table-column label="正常价格">
                        <template scope="scope">
                            <el-input v-model="scope.row.cost" auto-complete="off" @blur="checkPositiveInteger(scope.row,9999,'cost')"></el-input>
                            <!--<el-input-number v-model="scope.row.cost" size="small" :min="1" :max="10000" :controls="false" @blur="checkPositiveInteger(scope.row.cost)"></el-input-number>-->
                        </template>
                    </el-table-column>
                    <el-table-column label="周末价格">
                        <template scope="scope">
                            <el-input v-model="scope.row.weekEnd" auto-complete="off" @blur="checkPositiveInteger(scope.row,9999,'weekEnd')"></el-input>
                            <!--<el-input-number v-model="scope.row.weekEnd" size="small" :min="1" :max="10000" :controls="false" @blur="checkPositiveInteger(scope.row.weekEnd)"></el-input-number>-->
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-switch v-model="scope.row.showType" on-text="开" off-text="关" on-color="#13ce66" off-color="#999"></el-switch>
                        </template>
                    </el-table-column>
                </el-table>
                <!--科目三列表-->
                <el-table :data="models.stage3" height="301" ref="stage3Data" v-else>
                    <el-table-column label="开始时间">
                        <template scope="scope">
                            <el-input v-model="scope.row.beginTime" auto-complete="off" icon="time" @blur="checkStartTime(scope)"></el-input>
                            <!--<el-time-select v-model="scope.row.startTime" :picker-options="{start: '00:00',step: '00:15',end: '23:45'}" :editable="true" size="mini"></el-time-select>-->
                        </template>
                    </el-table-column>
                    <el-table-column label="结束时间">
                        <template scope="scope">
                            <el-input v-model="scope.row.endTime" auto-complete="off" icon="time" @blur="checkEndTime(scope)"></el-input>
                            <!--<el-time-select v-model="scope.row.endTime" :picker-options="{start: '00:00',step: '00:15',end: '23:45'}" :editable="false" size="mini"></el-time-select>-->
                        </template>
                    </el-table-column>
                    <el-table-column label="可约人数">
                        <template scope="scope">
                            <el-input-number v-model="scope.row.personCount" size="small" :min="1" :max="4" :controls="false"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="学时分钟数">
                        <template scope="scope">
                            <el-input-number v-model="scope.row.classMin" size="small" :min="0" :max="1" :controls="false"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="正常价格">
                        <template scope="scope">
                            <el-input-number v-model="scope.row.cost" size="small" :min="0" :max="1000" :controls="false"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="周末价格">
                        <template scope="scope">
                            <el-input-number v-model="scope.row.weekEnd" size="small" :min="0" :max="1000" :controls="false"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-switch v-model="scope.row.showType" on-text="开" off-text="关" on-color="#13ce66" off-color="#999"></el-switch>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button class="mt15" @click="modelOfStage==='科目二'?initTimesOfStage(1,[2,0]):initTimesOfStage(1,[0,3])">
                    添加行
                    <i class="el-icon-plus el-icon--right"></i>
                </el-button>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addModelFormVisible = false" size="large">取消</el-button>
                <el-button type="primary" size="large" @click="handleSave">保存</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        return {
            page: 1,
            pageLoading: false,
            pageSize: global.pageSize,
            timesCount: 5,
            addModelForm: {
                modelId: 0,
                modelName: "",
                comments: "",
                modelSet: {},
                schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            },
            models: {
                stage2: [],
                stage3: []
            },
            modelOfStage: "科目二",
            addModelFormVisible: false,
            modelsList: []
        }
    },
    methods: {
        //查询模式列表
        handleQueryList() {
            this.pageLoading = true;
            let para = [this.page, this.pageSize, this.addModelForm.schoolCode];
            setTimeout(() => {
                request.appointment.model.query.list(para).then((res) => {
                    if (res.success === true) {
                        global.printLog(res);
                        this.pageLoading = false;
                        let data = res.object;
                        this.modelsList = data.list;
                    }
                });
            }, 1000);
        },
        //查询模式详情
        handleQueryDetail(modeId) {
            request.appointment.model.query.detail(modeId).then((res) => {
                if (res.success === true) {
                    let data = res.object;
                    this.addModelForm.modelId = data.modelId;
                    this.addModelForm.schoolCode = data.schoolCode;
                    this.addModelForm.modelName = data.modelName;
                    this.addModelForm.comments = data.comments;
                    this.models.stage2 = [];
                    for (let item in data.modelSet2) {
                        delete data.modelSet2[item].gmtCreate;
                        delete data.modelSet2[item].gmtModify;
                    }
                    this.models.stage2 = data.modelSet2;
                    this.models.stage3 = [];
                    this.models.stage3 = data.modelSet3;
                    for (let item in data.modelSet3) {
                        delete data.modelSet3[item].gmtCreate;
                        delete data.modelSet3[item].gmtModify;
                    }
                    this.initTimesOfStage(this.timesCount, [2, 3]);
                    this.modelOfStage = "科目二";
                    this.addModelFormVisible = true;
                }
            });
        },
        //打开模式编辑窗体
        handleAdd() {
            this.modelOfStage = "科目二";
            this.models.stage2 = [];
            this.models.stage3 = [];
            this.addModelForm.modelId = 0;
            this.addModelForm.comments = "";
            this.addModelForm.modelName = "";
            this.initTimesOfStage(this.timesCount, [2, 3]);
            this.addModelFormVisible = true;
        },
        //新增/编辑模式
        handleSave() {
            this.$refs["addModelForm"].validate((valid) => {
                if (valid) {
                    var count = 0;
                    var $stage = [];
                    var $stage2 = this.models.stage2;
                    var $stage3 = this.models.stage3;
                    var $stageConcat = $stage2.concat($stage3);
                    $stageConcat.forEach(function (item, index, array) {
                        if (item.beginTime !== "" && item.endTime !== "") {
                            count++;
                            $stage.push(item);
                        }
                    });
                    if (count > 0) {
                        this.addModelForm.modelSet = $stage;
                        delete this.addModelForm.modelSet.gmtCreate;
                        delete this.addModelForm.modelSet.gmtModify;
                        let para = Object.assign({}, this.addModelForm);
                        if (this.addModelForm.modelId === 0) {
                            request.appointment.model.create(para).then((res) => {
                                if (res.success === true) {
                                    this.handleQueryList();
                                    this.handleReset("addModelForm");
                                    this.addModelFormVisible = false;
                                    this.$message.success({ message: "模式添加成功！" });
                                }
                                else {
                                    this.$message.error("模式添加失败！原因：" + res.message);
                                }
                            });
                        }
                        else {
                            request.appointment.model.update(para).then((res) => {
                                if (res.success === true) {
                                    this.handleQueryList();
                                    this.handleReset("addModelForm");
                                    this.addModelFormVisible = false;
                                    this.$message.success({ message: "模式编辑成功！" });
                                }
                                else {
                                    this.$message.error("模式编辑失败！原因：" + res.message);
                                }
                            });
                        }
                    }
                    else {
                        this.$message.warning({ message: "科目时段必须填写一项！" });
                    }
                }
            });
        },
        //模式删除
        handleDel(modelId) {
            this.$confirm("您正在执行删除模式操作, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnClickModal: false,
                type: "warning"
            }).then(() => {
                request.appointment.model.delete(modelId).then((res) => {
                    if (res.success === true) {
                        this.handleQueryList();
                        this.$message.success({ message: "模式删除成功！" });
                    }
                    else {
                        this.$message.error("模式删除成功！原因：" + res.message);
                    }
                });
            }).catch(() => { });
        },
        //重置模式窗体数据
        handleReset(formName) {
            this.initTimesOfStage(this.timesCount, [2, 3]);
            this.$refs[formName].resetFields();
        },
        //初始化模式数据
        initTimesOfStage(totals, stage) {
            for (let i = 0; i < totals; i++) {
                if (stage[0] === 2) {
                    this.models.stage2.push({
                        stage: "2",
                        beginTime: "",
                        endTime: "",
                        personCount: 1,
                        classMin: 1,
                        cost: 1,
                        weekEnd: 1,
                        showType: true,
                        updateUserId: JSON.parse(sessionStorage.getItem("user")).userId,
                        updateUserName: JSON.parse(sessionStorage.getItem("user")).userName,
                        schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode
                    });
                }
                if (stage[1] === 3) {
                    this.models.stage3.push({
                        stage: "3",
                        beginTime: "",
                        endTime: "",
                        personCount: 1,
                        classMin: 1,
                        cost: 1,
                        weekEnd: 1,
                        showType: true,
                        updateUserId: JSON.parse(sessionStorage.getItem("user")).userId,
                        updateUserName: JSON.parse(sessionStorage.getItem("user")).userName,
                        schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode
                    });
                }
            }
        },
        //校验开始时间
        checkStartTime(scope) {
            var beginTime = "";
            var row = scope.row;
            var scopeIndex = scope.$index;
            if (row.beginTime != "") {
                if (row.beginTime.indexOf(":") < 0) {
                    row.beginTime = row.beginTime + ":00";
                }
                if (row.beginTime.indexOf(":") == row.beginTime.length - 1) {
                    row.beginTime = row.beginTime + "00";
                }
                if (row.beginTime.split(":")[0] < 0 || row.beginTime.split(":")[0] > 23 || row.beginTime.split(":")[1] < 0 || row.beginTime.split(":")[1] > 59 || row.beginTime.indexOf("(") >= 0 || row.beginTime.split(":")[1].length > 2) {
                    this.$message({ message: "您输入的时间无效！", type: "warning" });
                    row.beginTime = "";
                }
                else {
                    beginTime = (new Date()).getFullYear().toString() + "/" + (parseInt((new Date()).getMonth()) + 1).toString() + "/" + (new Date()).getDate().toString() + " " + row.beginTime;
                    beginTime = new Date(beginTime);
                    if (beginTime == "Invalid Date" || beginTime == "NaN") {
                        this.$message({ message: "您输入的时间无效！", type: "warning" });
                        row.beginTime = "";
                        return;
                    }
                }
                var beginTimeMinutes = beginTime.getMinutes();
                if ((parseInt(beginTimeMinutes) / 5).toString().indexOf(".") > -1) {
                    //this.$message({ message: "时间的分钟数必须为5整数倍，请重新输入！", type: "warning" });
                    //row.beginTime = "";
                }
                var endTime = row.endTime;
                if ((beginTime != "" && beginTime != null) && (endTime != "" && endTime != null)) {
                    //转换开始时间
                    beginTime = row.beginTime;
                    beginTime = (new Date()).getFullYear().toString() + "/" + (parseInt((new Date()).getMonth()) + 1).toString() + "/" + (new Date()).getDate().toString() + " " + beginTime;
                    beginTime = new Date(beginTime);
                    //转换结束时间
                    endTime = (new Date()).getFullYear().toString() + "/" + (parseInt((new Date()).getMonth()) + 1).toString() + "/" + (new Date()).getDate().toString() + " " + endTime;
                    endTime = new Date(endTime);
                    var endTimeHours = endTime.getHours();
                    var endTimeMinutes = endTime.getMinutes();
                    if (beginTime >= endTime) {
                        this.$message({ message: "开始时间必须小于结束时间！", type: "warning" });
                        row.beginTime = "";
                        return;
                    }
                    if (this.modelOfStage === "科目二") {
                        if (compareTime(this.models.stage2, scopeIndex, beginTime, endTime) === false) {
                            this.$message({ message: "该时间段与其它时间段重复！", type: "warning" });
                            row.beginTime = "";
                            return;
                        }
                    }
                    else {
                        if (compareTime(this.models.stage3, scopeIndex, beginTime, endTime) === false) {
                            this.$message({ message: "该时间段与其它时间段重复！", type: "warning" });
                            row.beginTime = "";
                            return;
                        }
                    }
                    beginTime = beginTime.getTime();
                    endTime = endTime.getTime();
                    //求出开始时间和结束时间的秒差数
                    //var diffTime = (endTime - beginTime) / 1000;
                    //求出开始时间和结束时间的分钟差数
                    // var diffMinutes = diffTime / 60;
                    // if (((diffMinutes / 30)).toString().indexOf(".") > -1 && ((diffMinutes / 45)).toString().indexOf(".") > -1) {
                    //     this.$message({ message: "时间段设置错误，分钟数差值必须为30或者45的整数倍，请重新设置！", type: "warning" });
                    //     row.beginTime = "";
                    //     return;
                    // }
                }
            }
        },
        //校验结束时间
        checkEndTime(scope) {
            var endTime = "";
            var row = scope.row;
            var scopeIndex = scope.$index;
            if (row.endTime != "") {
                if (row.endTime.indexOf(":") < 0) {
                    row.endTime = row.endTime + ":00";
                }
                if (row.endTime.indexOf(":") == row.endTime.length - 1) {
                    row.endTime = row.endTime + "00";
                }
                if (row.endTime.split(":")[0] < 0 || row.endTime.split(":")[0] > 23 || row.endTime.split(":")[1] < 0 || row.endTime.split(":")[1] > 59 || row.endTime.indexOf("(") >= 0 || row.endTime.split(":")[1].length > 2) {
                    this.$message({ message: "您输入的时间无效！", type: "warning" });
                    row.endTime = "";
                }
                else {
                    endTime = (new Date()).getFullYear().toString() + "/" + (parseInt((new Date()).getMonth()) + 1).toString() + "/" + (new Date()).getDate().toString() + " " + row.beginTime;
                    endTime = new Date(endTime);
                    if (endTime == "Invalid Date" || endTime == "NaN") {
                        this.$message({ message: "您输入的时间无效！", type: "warning" });
                        row.endTime = "";
                        return;
                    }
                }
                var endTimeMinutes = endTime.getMinutes();
                if ((parseInt(endTimeMinutes) / 5).toString().indexOf(".") > -1) {
                    //this.$message({ message: "时间的分钟数必须为5整数倍，请重新输入！", type: "warning" });
                    //row.endTime = "";
                }
                var beginTime = row.beginTime;
                if ((endTime != "" && endTime != null) && (beginTime != "" && beginTime != null)) {
                    global.printLog("in");
                    //转换开始时间
                    beginTime = (new Date()).getFullYear().toString() + "/" + (parseInt((new Date()).getMonth()) + 1).toString() + "/" + (new Date()).getDate().toString() + " " + beginTime;
                    beginTime = new Date(beginTime);
                    //转换结束时间
                    endTime = row.endTime;
                    endTime = (new Date()).getFullYear().toString() + "/" + (parseInt((new Date()).getMonth()) + 1).toString() + "/" + (new Date()).getDate().toString() + " " + endTime;
                    endTime = new Date(endTime);
                    var endTimeHours = endTime.getHours();
                    var endTimeMinutes = endTime.getMinutes();
                    if (beginTime >= endTime) {
                        this.$message({ message: "结束时间必须大于开始时间！", type: "warning" });
                        row.endTime = "";
                        return;
                    }
                    if (this.modelOfStage === "科目二") {
                        if (compareTime(this.models.stage2, scopeIndex, beginTime, endTime) === false) {
                            this.$message({ message: "该时间段与其它时间段重复！", type: "warning" });
                            row.endTime = "";
                            return;
                        }
                    }
                    else {
                        if (compareTime(this.models.stage3, scopeIndex, beginTime, endTime) === false) {
                            this.$message({ message: "该时间段与其它时间段重复！", type: "warning" });
                            row.endTime = "";
                            return;
                        }
                    }
                    beginTime = beginTime.getTime();
                    endTime = endTime.getTime();
                    //求出开始时间和结束时间的秒差数
                    // var diffTime = (endTime - beginTime) / 1000;
                    // //求出开始时间和结束时间的分钟差数
                    // var diffMinutes = diffTime / 60;
                    // if (((diffMinutes / 30)).toString().indexOf(".") > -1 && ((diffMinutes / 45)).toString().indexOf(".") > -1) {
                    //     this.$message({ message: "时间段设置错误，分钟数差值必须为30或者45的整数倍，请重新设置！", type: "warning" });
                    //     row.endTime = "";
                    //     return;
                    // }
                }
            }
        },
        //校验是否为正整数
        checkPositiveInteger(row, limit, target) {
            //personCount classMin cost weekEnd
            global.printLog(row);
            if (target === "personCount") {
                if (!global.fieldVerification.IsNumber(row.personCount) || parseInt(row.personCount) < 1) {
                    row.personCount = 1;
                    this.$message({ message: "可约人数只能是正整数且大于0", type: "warning" });
                }
                else if (row.personCount > limit) {
                    row.personCount = limit;
                    this.$message({ message: "可约人数最多不能超过" + limit + "人", type: "warning" });
                }
            }
            else if (target === "classMin") {
                if (!global.fieldVerification.IsNumber(row.classMin) || parseInt(row.classMin) < 1) {
                    row.classMin = 1;
                    this.$message({ message: "学时分钟数只能是正整数且大于0", type: "warning" });
                }
                else if (row.classMin > limit) {
                    row.classMin = limit;
                    this.$message({ message: "学时分钟数最大不能超过" + limit + "分钟", type: "warning" });
                }
            }
            else if (target === "cost") {
                if (!global.fieldVerification.IsNumber(row.cost) || parseInt(row.cost) < 1) {
                    row.cost = 1;
                    this.$message({ message: "正常价格只能是正整数且大于0", type: "warning" });
                }
                else if (row.cost > limit) {
                    row.cost = limit;
                    this.$message({ message: "正常价格最大不能超过" + limit + "元", type: "warning" });
                }
            }
            else {
                if (!global.fieldVerification.IsNumber(row.weekEnd) || parseInt(row.weekEnd) < 1) {
                    row.weekEnd = 1;
                    this.$message({ message: "周末价格只能是正整数且大于0", type: "warning" });
                }
                else if (row.weekEnd > limit) {
                    row.weekEnd = limit;
                    this.$message({ message: "周末价格最大不能超过" + limit + "元", type: "warning" });
                }
            }
        }
    },
    activated() {
        global.printLog("activated every one");
        this.handleQueryList();
    },
    updated() {
        console.log("updated ing...");
    },
    mounted() {
    }
}

function compareTime(obj, scopeIndex, beginTime, endTime) {
    var compare = true;
    obj.forEach(function (item, index, array) {
        if (scopeIndex !== index) {
            var compareStartTime = item.beginTime;
            compareStartTime = (new Date()).getFullYear().toString() + "/" + (parseInt((new Date()).getMonth()) + 1).toString() + "/" + (new Date()).getDate().toString() + " " + compareStartTime;
            compareStartTime = new Date(compareStartTime);
            var compareEndTime = item.endTime;
            compareEndTime = (new Date()).getFullYear().toString() + "/" + (parseInt((new Date()).getMonth()) + 1).toString() + "/" + (new Date()).getDate().toString() + " " + compareEndTime;
            compareEndTime = new Date(compareEndTime);
            if (endTime > compareStartTime && compareEndTime > beginTime) {
                compare = false;
                return;
            }
        }
    });
    return compare;
}

</script>

<style lang="scss">
.mode {
    .box-card {
        width: 320px;
        float: left;
        margin: 10px;
        min-height: 160px;
        cursor: pointer;
        .el-card__header {
            padding: 15px 20px;
        }
        .el-card__body {
            padding: 20px;
            max-height: 74px;
            p.title {
                margin-top: -.2em;
            }
            .text-overflow {
                margin-top: .5em;
                p.comments {
                    display: block;
                    height: 60px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: pre-wrap;
                    &:hover {
                        display: block;
                        overflow: auto;
                        white-space: normal;
                    }
                }
            }
        }
    }
}

.custom-dialog-style {
    width: 800px;
    input {
        width: 300px;
    }
    textarea {
        min-height: 80px;
    }
    .el-table {
        input {
            width: 60px;
            height: 26px;
            text-align: center;
            margin: 0 auto;
        }
        .el-icon-time {
            +input {
                width: 75px;
            }
        }
        .el-input-number--small {
            width: 60px;
        }
        .el-input-number {
            top: 3px;
        }
        .el-switch__label * {
            font-size: 12px;
        }
        .el-switch__label--right span {
            right: 18px;
        }
        .el-switch__label--left span {
            left: 20px;
        }
        .el-input__icon {
            width: 25px;
            font-size: 12px;
            +.el-input__inner {
                padding-right: 25px;
            }
        }
    }
}
</style>