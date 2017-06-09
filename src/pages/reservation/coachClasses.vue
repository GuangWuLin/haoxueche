<template>
    <section v-loading="pageLoading">
        <el-row>
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input class="search-input" v-model="filters.keyword" placeholder="输入教练姓名、电话" icon="search" :on-icon-click="handleQueryAfterResetData" @keyup.enter.native="handleQueryAfterResetData"></el-input>
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
                    <el-form-item class="right">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="selectedAll" @change="handleAllSelectedChange" class="mr20" :disabled="classCount>0?false:true">全选</el-checkbox>
                        <el-button type="primary" :disabled="selected.length?false:true" @click="releaseClasses">报班{{selected.length?'('+selected.length+')':''}}</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row class="review-tool">
            <div class="wall-container">
                <div class="header-two">
                    <swiper :options="swiperOption" ref="swiper">
                        <swiper-slide v-for="item in dateList" v-bind:class="[item.click?'is-active':'']">
                            <p>{{item.date}}</p>
                            <p>{{item.week}}</p>
                        </swiper-slide>
                        <div class="swiper-button-prev" slot="button-prev"></div>
                        <div class="swiper-button-next" slot="button-next"></div>
                    </swiper>
                </div>
            </div>
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
                        <a href="javascript:" v-if="item.teacherIsClass===1" v-bind:class="[item.check?'is-review':'']" @click="handleSelected(item)">
                            <p>{{item.classTime}}</p>
                            <p>{{item.stageName}}</p>
                        </a>
                        <a v-else class="is-selected">
                            <p>{{item.classTime}}</p>
                            <p>{{item.message+item.stageName}}</p>
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
            swiperOption: {
                mousewheelControl: true,
                preventLinksPropagation: false,
                nextButton: ".swiper-button-next",
                prevButton: ".swiper-button-prev",
                onClick: swiper => {
                    let list = this.dateList;
                    let $index = swiper.clickedIndex;
                    list[$index].click = true;
                    for (var i = 0, len = list.length; i < len; i++) {
                        if ($index === i) continue;
                        list[i].click = false;
                    }
                    this.filters.date = list[$index].date;
                    this.handleQueryAfterResetData();
                }
            },
            selected: [],
            classCount: 0,
            selectedAll: false,
            isIndeterminate: false,
            pageLoading: false,
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode
        }
    },
    methods: {
        //查询模式
        queryModels() {
            request.appointment.query.model(this.schoolCode).then((res) => {
                if (res.success === true) {
                    this.modelOptions = res.object;
                    this.filters.models = res.object[0].modelId;
                }
            });
        },
        queryClasses() {
            this.pageLoading = true;
            this.emptyVisible = false;
            let date = this.filters.date !== "" ? new Date(this.filters.date).Format("yyyy-MM-dd") : "";
            setTimeout(() => {
                let para = [this.page, this.pageSize, this.schoolCode, date, (this.filters.models === "0" ? "" : this.filters.models), (this.filters.stage === "0" ? "" : this.filters.stage), this.filters.keyword];
                request.appointment.classes.query.classesWall(para).then((res) => {
                    if (res.success === true) {
                        let _that = this;
                        this.classes.list = [];
                        let data = res.object.list;
                        this.classes.total = res.object.num;
                        for (let item in data) {
                            this.classes.list.push({
                                teacherName: data[item].teacherName,
                                phone: data[item].phone,
                                photosUrl: data[item].photosUrl,
                                classDOS: data[item].classDOS
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
                if (res.success === true) {
                    this.handleQueryAfterResetData();
                    this.$message({ message: res.object, type: "success" });
                }
            });
        },
        handleSelected(data) {
            if (!data.check) {
                data.check = true;
                this.selected.push(data);
            }
            else {
                data.check = false;
                this.selected.splice(this.selected.indexOf(data), 1);
            }
            global.printLog(data);
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
        this.dateList = global.getDays(new Date().Format("yyyy-MM-dd"), 100);
        this.dateList[0].click = true;
    },
    activated() {
        this.queryModels();
        global.printLog("activated every one");
        this.queryClasses();
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