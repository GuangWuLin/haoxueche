<template>
    <section v-loading="pageLoading">
        <el-row>
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input class="search-input" v-model="filters.keyword" placeholder="输入教练姓名、电话" icon="search" :on-icon-click="handleQueryAfterResetData"></el-input>
                    </el-form-item>
                    <el-form-item style="width:150px;">
                        <el-select placeholder="请选择模式" v-model="filters.models" @change="handleQueryAfterResetData">
                            <el-option v-for="item in modelOptions" :label="item.modelName" :value="item.modelId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="width:150px;">
                        <el-select placeholder="请选择科目" v-model="filters.stage" @change="handleQueryAfterResetData">
                            <el-option label="科目二" value="2"></el-option>
                            <el-option label="科目三" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker type="date" placeholder="选择日期" v-model="filters.date" :clearable="false" :editable="false" @change="handleQueryAfterResetData" :picker-options="pickerOptions"></el-date-picker>
                    </el-form-item>
                    <el-form-item class="right">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="selectedAll" @change="handleAllSelectedChange" class="mr20" :disabled="classCount>0?false:true">全选</el-checkbox>
                        <el-button type="primary" :disabled="selected.length?false:true" @click="releaseClasses">报班{{selected.length?'('+selected.length+')':''}}</el-button>
                        <!--<el-button type="danger" :disabled="cancelSelected.length?false:true" @click="cancelClasses">取消{{cancelSelected.length?'('+cancelSelected.length+')':''}}</el-button>-->
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <div v-for="list in classes.list" class="classes-review">
                <div class="coach-photo">
                    <img v-bind:src="list.photosUrl" />
                    <p>{{list.teacherName}}</p>
                    <p>{{list.phone}}</p>
                </div>
                <div class="classes">
                    <span v-for="item in list.classDOS">
                        <a href="javascript:" v-if="item.state===0" v-bind:class="[item.check?'is-review':'']" @click="handleSelected(item,'review')">
                            <p>{{item.classTime}}</p>
                            <p>{{item.stageName}}</p>
                        </a>
                        <a href="javascript:" v-else-if="item.state===2||item.state===3" class="is-selected cancel" @click="handleSelected(item,'cancel')">
                            <p>{{item.classTime}}</p>
                            <p>{{item.message}}</p>
                            <p class="cancel-tip">取消报班</p>
                            <span v-bind:class="[item.cancel?'cancel-layer layer-show':'cancel-layer']">
                                <i class="el-icon-check"></i>
                            </span>
                        </a>
                        <a v-else class="is-selected">
                            <p>{{item.classTime}}</p>
                            <p>{{item.message}}</p>
                        </a>
                    </span>
                </div>
            </div>
        </el-row>
        <el-row class="t-center">
            <el-button type="text" v-if="classes.list.length" :disabled="loadMore?false:true" @click="handleLoadMore">{{loadMore?"查看更多":"无更多数据"}}</el-button>
        </el-row>
        <div class="glyph-icon icon-empty empty-data" v-if="emptyVisible">
            <p>暂无数据</p>
        </div>
    </section>
</template>

<script>
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        return {
            page: 1,
            pageSize: 5,
            loadMore: false,
            emptyVisible: false,
            filters: {
                keyword: "",
                models: "",
                stage: "2",
                date: new Date().Format("yyyy-MM-dd")
            },
            classes: {
                total: 0,
                list: []
            },
            modelOptions: [],
            dateList: [],
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
            //         this.filters.date = list[$index].date;
            //         this.handleQueryAfterResetData();
            //     }
            // },
            selected: [],
            cancelSelected: [],
            classCount: 0,
            selectedAll: false,
            isIndeterminate: false,
            pageLoading: false,
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            }
        }
    },
    methods: {
        //查询模式
        queryModels() {
            request.appointment.query.model(this.schoolCode).then((res) => {
                if (res.success === true) {
                    let data = res.object;
                    this.modelOptions = data;
                    if (data.length) {
                        this.filters.models = data[0].modelId;
                        // this.queryClasses();
                    }
                    else {
                        this.$message.info({ message: "所属模式没有数据，请前往[模式管理]添加模式后再操作教练报班" });
                    }
                }
            });
        },
        queryClasses() {
            if (this.filters.models === "") { return; }
            this.pageLoading = true;
            this.emptyVisible = false;
            let date = this.filters.date !== "" ? new Date(this.filters.date).Format("yyyy-MM-dd") : "";
            setTimeout(() => {
                let para = [this.page, this.pageSize, this.schoolCode, date, (this.filters.models === "0" ? "" : this.filters.models), (this.filters.stage === "0" ? "" : this.filters.stage), this.filters.keyword];
                request.appointment.classes.query.classesWall(para).then((res) => {
                    if (res.success) {
                        let _that = this;
                        let data = res.object.list;
                        this.classes.total = res.object.num;
                        for (let item in data) {
                            this.classes.list.push({
                                teacherName: data[item].teacherName,
                                phone: data[item].phone,
                                photosUrl: data[item].photosUrl,
                                classDOS: data[item].classDOS,
                            });
                            for (let dos in data[item].classDOS) {
                                if (data[item].classDOS[dos].teacherIsClass === 1) {
                                    this.classCount++;
                                }
                            }
                        }
                        this.loadMore = this.classes.list.length < this.classes.total;
                    }
                    if (!this.classes.total) {
                        this.emptyVisible = true;
                    }
                    this.pageLoading = false;
                });
            }, 1000);
        },
        releaseClasses() {
            let para = { times: [] };
            let selected = this.selected;
            for (let item in selected) {
                para.times.push({
                    schoolCode: this.schoolCode,
                    teacherId: selected[item].teacherId,
                    classDate: selected[item].classDate,
                    beginTime: selected[item].beginTime,
                    endTime: selected[item].endTime,
                    stage: selected[item].stage,
                    state: 20,
                    personCount: selected[item].personCount,
                    cost: selected[item].cost,
                    classMin: selected[item].classMin,
                    modelId: selected[item].modelId,
                    addUserId: JSON.parse(sessionStorage.getItem("user")).userId,
                    addUserName: JSON.parse(sessionStorage.getItem("user")).userName,
                    addUserType: 30
                });
            }
            let data = Object.assign({}, para);
            request.appointment.classes.create(data).then((res) => {
                if (res.success) {
                    this.handleQueryAfterResetData();
                    this.$message.success(res.object);
                }
            });
        },
        cancelClasses(data) {
            //let cancelSelected = this.cancelSelected;
            let classId = data.classId;
            request.appointment.classes.cancel(classId).then((res) => {
                if (res.success) {
                    this.$message.success("报班取消成功");
                    this.handleQueryAfterResetData();
                }
                else {
                    this.$message.success("报班取消失败，原因：" + res.message);
                }
                data.cancel = false;
            });
        },
        handleSelected(data, target) {
            //报班
            if (target === "review") {
                if (!data.check) {
                    data.check = true;
                    this.selected.push(data);
                }
                else {
                    data.check = false;
                    this.selected.splice(this.selected.indexOf(data), 1);
                }
            }
            else {
                //取消报班
                //目前接口仅支持单个报班取消，点击后提醒是否取消？
                global.printLog(data.cancel);
                data.cancel = !data.cancel ? true : false;
                this.$confirm("您正在操作取消报班, 是否继续?", "提示", {
                    type: "warning",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnClickModal: false
                }).then(() => {
                    this.cancelClasses(data);
                }).catch(() => {
                    data.cancel = false;
                });

                //以下是批量取消报班操作
                // if (!data.cancel) {
                //     data.cancel = true;
                //     this.cancelSelected.push(data);
                // }
                // else {
                //     data.cancel = false;
                //     this.cancelSelected.splice(this.cancelSelected.indexOf(data), 1);
                // }
            }
        },
        handleAllSelectedChange(evt) {
            this.selected = [];
            let data = this.classes.list;
            for (let item in data) {
                for (let dos in data[item].classDOS) {
                    if (data[item].classDOS[dos].teacherIsClass === 1) {
                        data[item].classDOS[dos].check = evt.target.checked;
                        if (evt.target.checked) {
                            this.selected.push(data[item].classDOS[dos]);
                        }
                        else {
                            this.selected = [];
                        }
                    }
                }
            }
            this.isIndeterminate = false;
        },
        handleLoadMore() {
            this.page++;
            this.queryClasses();
            if (this.selected.length > 0) {
                this.selectedAll = false;
                this.isIndeterminate = true;
            }
        },
        handleQueryAfterResetData() {
            this.page = 1;
            this.selected = [];
            this.classCount = 0;
            this.classes.list = [];
            this.queryClasses();
        }
    },
    created() {
        // this.dateList = global.getDays(new Date().Format("yyyy-MM-dd"), 100);
        // this.dateList[0].click = true;
    },
    activated() {
        global.printLog("activated every one");
        this.queryModels();
    },
    deactivated() {
        this.filters.models = "";
    },
    mounted() {
    },
    watch: {
        selected() {
            let selectedCount = this.selected.length;
            this.selectedAll = selectedCount === 0 ? false : selectedCount === this.classCount;
            this.isIndeterminate = selectedCount > 0 && selectedCount < this.classCount;
        }
    }
}

</script>