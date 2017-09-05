<template>
    <section v-loading="pageLoading">
        <el-row>
            <el-col :span="24">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input class="search-input" v-model="filters.wall.keyword" placeholder="输入教练姓名、电话" icon="search" :on-icon-click="handleQueryAfterResetData"></el-input>
                    </el-form-item>
                    <el-form-item style="width:150px;">
                        <el-select v-model="filters.wall.model" @change="handleQueryAfterResetData" ref="modelSel">
                            <el-option v-for="item in modelOptions" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="width:150px;">
                        <el-select v-model="filters.wall.stage" @change="handleQueryAfterResetData" ref="stageSel">
                            <el-option v-for="item in stageOptions" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker type="date" placeholder="选择日期" v-model="filters.wall.date" :clearable="false" :editable="false" @change="handleQueryAfterResetData" :picker-options="pickerOptions"></el-date-picker>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <div class="reservation-list">
                <div class="table-left">
                    <table cellpadding="0" cellspacing="0">
                        <tr v-for="item in reservationData">
                            <td>
                                <p>
                                    <img v-bind:src="item.photosUrl" />
                                </p>
                                <p>{{item.teacherName}}</p>
                                <p>{{item.phone}}</p>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="table-right">
                    <table cellpadding="0" cellspacing="0">
                        <tr v-for="item in reservationData">
                            <td v-for="dos in item.timeDOS">
                                <a class="time-container full" href="javascript:" v-if="dos.isOrder===0&&dos.message==='约满'" @click="handleOpenReservationWin(dos)">
                                    <p>{{dos.orderTime}}</p>
                                    <p class="full">{{dos.message}}</p>
                                </a>
                                <a class="time-container" href="javascript:" v-else-if="dos.isOrder" slot="reference" @click="handleOpenReservationWin(dos)">
                                    <p>{{dos.orderTime}}</p>
                                    <p>{{dos.message}}</p>
                                    <div class="reservation-layer" style="position:absolute;width:300px;height:220px;outline:1px solid #000;top:0;right:115px;display:none;">
                                        123
                                    </div>
                                </a>
                                <a v-else v-bind:style="{ backgroundColor:'#657690',color:'#FFF' }" class="time-container no-cursor" slot="reference">
                                    <p>{{dos.orderTime}}</p>
                                    <p>{{dos.message}}</p>
                                </a>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="t-center">
                    <el-button type="text" v-if="reservationData.length" :disabled="loadMore?false:true" @click="handleLoadMore">{{loadMore?"查看更多":"无更多数据"}}</el-button>
                </div>
                <div class="glyph-icon icon-empty empty-data mt20" v-if="filters.wall.emptyVisible">
                    <p>暂无数据</p>
                </div>
            </div>
        </el-row>
        <el-dialog title="预约学员" v-model="studentFormVisible" :close-on-click-modal="false" size="full" @close="handleDialogClose">
            <el-row class="toolbar mt20" :gutter="10">
                <el-form :inline="true" :model="filters">
                    <el-form-item class="reservation-studentForm">
                        <span class="times">{{studentForm.reservationDateTime+' '+studentForm.stageName}}</span>
                        <span>所属模式：
                            <em>{{studentForm.modelName}}</em>
                        </span>
                        <span>所在模式中还可预约：
                            <em>{{studentForm.lastPerson}}</em>人</span>
                    </el-form-item>
                    <el-form-item class="right">
                        <el-input class="search-input" v-model="filters.stu.keyword" placeholder="输入学员姓名、电话" icon="search" :on-icon-click="handleQueryStu"></el-input>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row class="reservation-stu-list">
                <el-table :data="students.data" v-loading="filters.stu.loading" :row-class-name="bindRowClass">
                    <el-table-column prop="studentName" label="学员姓名">
                    </el-table-column>
                    <el-table-column prop="genderName" label="性别">
                    </el-table-column>
                    <el-table-column prop="phone" label="电话">
                    </el-table-column>
                    <el-table-column prop="cardNo" label="身份证" width="180">
                    </el-table-column>
                    <el-table-column prop="carTypeName" label="车型">
                    </el-table-column>
                    <el-table-column prop="has2Time" label="科二已学">
                    </el-table-column>
                    <el-table-column prop="stage2Time" label="科二剩余">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="text" size="small" @click.stop="createAppointment(scope.row)" v-bind:style="scope.row.isOrder===0?{'color':'#20A0FF'}:{'color':'#FF4949'}">{{scope.row.isOrder===0?'预约TA':'取消预约'}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="students.total" v-if="studentFormVisible">
                </el-pagination>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="studentFormVisible = false" size="large">关闭</el-button>
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
            pageLoading: false,
            pageSize: global.pageSize,
            userId: JSON.parse(sessionStorage.getItem("user")).userId,
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            dateList: [],
            modelOptions: [],
            stageOptions: [],
            filters: {
                wall: {
                    page: 1,
                    model: "",
                    stage: "2",
                    keyword: "",
                    emptyVisible: false,
                    date: new Date().Format("yyyy-MM-dd")
                },
                stu: {
                    keyword: "",
                    loading: false
                }
            },
            // swiperOption: {
            //     mousewheelControl: true,
            //     preventLinksPropagation: false,
            //     nextButton: ".swiper-button-next",
            //     prevButton: ".swiper-button-prev",
            //     onClick: swiper => {
            //         let list = this.dateList;
            //         let $index = swiper.clickedIndex;
            //         list[$index].click = true;
            //         for (var i = 0, len = list.length; i < len; i++) {
            //             if ($index === i) continue;
            //             list[i].click = false;
            //         }
            //         this.filters.wall.date = list[$index].date;
            //         this.handleQueryAfterResetData();
            //     }
            // },
            loadMore: false,
            reservationData: [],
            popoverData: {},
            studentFormVisible: false,
            studentForm: {},
            students: {
                page: 1,
                data: [],
                total: 0
            },
            curCoach: {},
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            }
        }
    },
    computed: {
    },
    methods: {
        //获取预约墙
        queryReservation() {
            this.pageLoading = true;
            this.filters.wall.emptyVisible = false;
            setTimeout(() => {
                let paras = [this.schoolCode, this.filters.wall.page, 5, new Date(this.filters.wall.date).Format("yyyy-MM-dd"), this.filters.wall.model, this.filters.wall.stage, this.filters.wall.keyword];
                request.appointment.query.selectInfoWall(paras).then((res) => {
                    if (res.success) {
                        let list = res.object.list;
                        for (let item in list) {
                            this.reservationData.push({
                                teacherName: list[item].teacherName,
                                phone: list[item].phone,
                                photosUrl: list[item].photosUrl,
                                timeDOS: list[item].timeDOS
                            });
                        }
                        if (list.length) {
                            this.loadMore = this.reservationData.length < res.object.num;
                        }
                        else {
                            this.filters.wall.emptyVisible = true;
                        }
                        this.pageLoading = false;
                        global.printLog(this.reservationData);
                    }
                });
            }, 1000);
        },
        handleQueryAfterResetData() {
            global.printLog("begin query...");
            //this.students.page = 1;
            this.reservationData = [];
            this.filters.wall.page = 1;
            this.queryReservation();
        },
        handleLoadMore() {
            this.filters.wall.page++;
            this.queryReservation();
        },
        //初始化模式
        initModels() {
            let para = [1, this.pageSize, this.schoolCode];
            request.appointment.model.query.list(para).then((res) => {
                if (res.success === true) {
                    this.modelOptions = [];
                    let data = res.object.list;
                    for (let item in data) {
                        this.modelOptions.push({
                            value: data[item].modelId,
                            label: data[item].modelName
                        });
                    }
                    if (data) {
                        this.filters.wall.model = data[0].modelId;
                    }
                }
            });
        },
        //初始化阶段
        initStage() {
            this.stageOptions = [];
            let stageArr = global.options.stage;
            for (let item in stageArr) {
                if (item != 0 && item != 3) {
                    this.stageOptions.push(stageArr[item]);
                }
            }
            this.filters.wall.stage = this.stageOptions[0].value;
        },
        handleOpenReservationWin(data) {
            this.curCoach = data;
            this.handleQueryStu();
        },
        handleQueryStu() {
            let data = this.curCoach;
            let lastPerson = (data.personCount - data.personHas);
            this.studentForm = {
                teacherId: data.teacherId,
                stageName: this.$refs.stageSel.selectedLabel,
                modelName: this.$refs.modelSel.selectedLabel,
                lastPerson: lastPerson < 0 ? 0 : lastPerson,
                reservationDateTime: data.beginTime.split(" ")[0] + " " + global.getWeek(new Date(data.beginTime).getDay()) + " " + data.orderTime
            }
            this.studentFormVisible = true;
            this.filters.stu.loading = true;
            setTimeout(() => {
                let paras = [this.schoolCode, this.students.page, this.pageSize, data.teacherId, this.filters.stu.keyword, this.$refs.modelSel.value, this.$refs.stageSel.value, data.beginTime, data.endTime];
                request.appointment.query.wallQueryStudent(paras).then((res) => {
                    if (res.success) {
                        this.students.total = res.object.num;
                        this.students.data = res.object.list;
                    }
                    this.filters.stu.loading = false;
                });
            }, 1000);
        },
        handleCurrentChange(val) {
            this.students.page = val;
            this.handleQueryStu();
        },
        createAppointment(data) {
            let isOrder = data.isOrder;
            let stuId = data.studentId;
            if (isOrder > 0) {
                this.$confirm("您正在执行取消预约操作, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnClickModal: false,
                    type: "warning"
                }).then(() => {
                    let para = {
                        appointmentId: data.appointmentId,
                        cancelUserId: this.userId,
                        cancelUserType: 30
                    }
                    request.appointment.cancel(para).then((res) => {
                        if (res.object.state > 0) {
                            this.handleQueryStu();
                            this.$message.success(res.object);
                        }
                        else {
                            this.$message.error(res.object);
                        }
                    });
                }).catch(() => { });
            }
            else {
                let _reservationDateTime = this.studentForm.reservationDateTime;
                let paras = {
                    infos: [{
                        beginTime: _reservationDateTime.split(" ")[0] + " " + _reservationDateTime.split(" ")[2].split("-")[0] + ":00",
                        endTime: _reservationDateTime.split(" ")[0] + " " + _reservationDateTime.split(" ")[2].split("-")[1] + ":00",
                        teacherId: this.studentForm.teacherId,
                        studentId: stuId,
                        appointmentStage: this.filters.wall.stage,
                        schoolCode: this.schoolCode,
                        modelId: this.filters.wall.model,
                        appointmentType: 10,
                        appointmentUserType: 30,
                        appointmentUserId: this.userId
                    }]
                };
                request.appointment.create.appointmentinfo(paras).then((res) => {
                    if (res.success) {
                        this.handleQueryStu();
                        this.$message.success({ message: res.object.message });
                    }
                });
            }
        },
        handleDialogClose() {
            this.students.page = 1;
            this.filters.stu.keyword = "";
            this.handleQueryAfterResetData();
        },
        bindRowClass(row, index) {
            if (row.isOrder === 1) {
                return "booked";
            }
            return "";
        },
        handlePopoverShow(data) {
            // let p = $(".el-popover");
            $(".el-popover").css({ padding: "0" });
            setTimeout(() => {
                let date = this.filters.wall.date;
                let week = global.getWeek(new Date(data.beginTime).getDay());
                let lastPerson = data.personCount - data.personHas;
                this.popoverData = {
                    date: date,
                    week: week,
                    message: data.message,
                    isOrder: data.isOrder,
                    lastPerson: lastPerson,
                    teacherId: data.teacherId,
                    orderTime: data.orderTime,
                    stageName: this.$refs.stageSel.selectedLabel,
                    modelName: this.$refs.modelSel.selectedLabel
                }
                //global.printLog($(p[0]).css("left"));
            }, 0);
        },
        handlePopoverHide() {
            //global.printLog(this.curPopover);
            //$("#" + this.curPopover).remove();
            //$(".el-popover").remove();
        }
    },
    created() {
        // this.dateList = global.getDays(new Date().Format("yyyy-MM-dd"), 30);
        // this.dateList[0].click = true;
    },
    activated() {
        this.initStage();
        this.initModels();
        global.printLog("activated every one");
    },
    deactivated() {
        this.filters.wall.model = "";
    },
    mounted() {
    }
}

</script>

<style lang="scss">
.reservation-list {
    width: 100%;
    position: relative;
}

.reservation-list table {
    border-collapse: collapse;
}

.reservation-list table th,
.reservation-list table td {
    border: 1px solid #E7EBED; // border-top: 0;
    border-bottom: 0;
    text-align: center;
    background: #fff;
    white-space: nowrap;
    min-width: 115px;
    height: 100px;
    .time-container {
        margin-top: 0; // margin-bottom: 1px;
        display: block;
        height: 100%;
        &:hover {
            .reservation-layer {
                display: block;
                background: #ff0000;
            }
        }
        >p {
            margin-bottom: 5px;
            position: relative;
            top: 30px;
            &.full {
                color: #FF4949;
                font-weight: bolder;
            }
        }
        &.full {
            background: #E9ECF0;
        }
    }
    span {
        display: block;
        height: 100%;
    }
    a:not(.no-cursor):hover {
        outline: 1px solid #13CA4C;
        background-color: rgba(19, 202, 76, .1);
    }
    &:last-child {
        border-bottom: 1px solid #E7EBED;
    }
}

.reservation-list table:first-child td {
    p {
        >img {
            width: 40px;
            height: 40px;
            border-radius: 100%;
            margin-top: 8px;
        }
    }
}

.table-left {
    float: left;
}

.table-right {
    overflow-x: auto;
    margin-left: 115px;
}

.reservation-popover {
    width: 320px;
    height: 100px;
    text-indent: 20px;
    font-size: 1.2em;
    .title {
        line-height: 40px;
        display: block;
        border-bottom: 1px solid #eee;
        color: #333;
    }
    .content {
        line-height: 60px;
        display: block;
        color: #777;
        >span {
            color: #333;
        }
    }
}

.reservation-studentForm {
    text-indent: 10px;
    margin-left: 5px;
    span {
        color: #777;
        margin-right: 5px;
    }
    .times {
        background-color: #FFE1D1;
        border-radius: 4px;
        padding: 6px;
        color: #1F2D3D;
    }
    em {
        color: #333;
        font-style: normal;
    }
}

.reservation-stu-list {
    .el-table .booked {
        background: #E9ECF0;
    }
}

.wall-container {
    display: -webkit-box;
    height: 63px;
    border: 1px solid #E7EBED;
}

.header-one {
    width: 115px;
    border-right: 1px solid #E7EBED;
    .back-slant {
        width: 115px;
        height: 63px;
        position: relative;
        background-color: transparent;
        span {
            position: absolute;
            z-index: 999;
            font-size: 14px;
            color: #8799AB;
            &.time {
                left: 70px;
                top: 10px;
            }
            &.coach {
                left: 18px;
                top: 35px;
            }
        }
        &:before {
            position: absolute;
            top: 0px;
            right: 0;
            left: 0;
            bottom: 0;
            border-bottom: 63px solid #E7EBED;
            border-right: 116px solid transparent;
            content: "";
        }
        &:after {
            position: absolute;
            left: 0;
            right: 1px;
            top: 1px;
            bottom: 0;
            border-bottom: 62px solid #FFF;
            border-right: 116px solid transparent;
            content: "";
        }
    }
}

.header-two {
    -webkit-box-flex: 3;
    border-right: 0;
    .swiper-slide {
        cursor: pointer;
        height: 45px;
        color: #8799ab;
        text-align: center;
        padding-top: 12px;
        padding-bottom: 6px;
        border-right: 1px solid #E7EBED;
        p {
            height: 20px;
            line-height: 23px;
        }
        &:hover,
        &.is-active {
            background-color: #21364c;
            color: #FFF;
        }
    }
    .swiper-container {
        width: 90%!important;
        padding: 0 50px!important;
    }
    .swiper-slide {
        background-position: 50%!important;
        background-size: cover!important;
        width: 100px!important;
    }
}
</style>