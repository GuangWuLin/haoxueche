<template>
    <section v-loading="pageLoading">
        <el-form :inline="true" :model="filters">
            <el-form-item>
                <el-input class="search-input" v-model="filters.keyword" placeholder="输入教练姓名、电话" icon="search" :on-icon-click="handleQueryAfterResetData" @keyup.enter.native="handleQueryAfterResetData"></el-input>
            </el-form-item>
            <el-form-item>
                <el-select placeholder="请选择模式" style="width:150px;" v-model="filters.models" @change="handleQueryAfterResetData">
                    <el-option label="全部" value="0"></el-option>
                    <el-option v-for="item in modelOptions" :label="item.modelName" :value="item.modelId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="filters.stage" style="width:150px;" placeholder="选择科目" @change="handleQueryAfterResetData">
                    <el-option label="全部" value="0"></el-option>
                    <el-option label="科目二" value="2"></el-option>
                    <el-option label="科目三" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="right">
                <el-checkbox :indeterminate="isIndeterminate" v-model="selectedAll" @change="handleAllSelectedChange" class="mr20" :disabled="classCount>0?false:true">全选</el-checkbox>
                <el-button type="primary" :disabled="selected.length?false:true" @click="checkingClasses">审核{{selected.length?'('+selected.length+')':''}}</el-button>
            </el-form-item>
        </el-form>
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
            <div v-for="list in classesReview.list" class="classes-review">
                <div class="coach-photo">
                    <img v-bind:src="list.photosUrl" />
                    <p>{{list.teacherName}}</p>
                    <p>{{list.phone}}</p>
                </div>
                <div class="classes">
                    <span v-for="item in list.classDOS">
                        <a href="javascript:" v-if="item.state===10" v-bind:class="[item.check?'is-review':'']" @click="handleSelected(item)">
                            <p>{{item.classTime}}</p>
                            <p>{{item.stageName}}</p>
                        </a>
                        <a v-else class="is-selected">
                            <p>{{item.classTime}}</p>
                            <p>{{item.stageName}}</p>
                        </a>
                    </span>
                </div>
            </div>
        </el-row>
        <el-row class="t-center">
            <el-button type="text" v-if="classesReview.list.length" :disabled="loadMore?false:true" @click="handleLoadMore">{{loadMore?"查看更多":"无更多数据"}}</el-button>
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
                models: "",
                keyword: "",
                stage: "0",
                date: new Date().Format("yyyy-MM-dd")
            },
            classesReview: {
                total: 0,
                list: []
            },
            modelOptions: [],
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
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
            dateList: [],
            selected: [],
            classCount: 0,
            pageLoading: false,
            selectedAll: false,
            isIndeterminate: false
        }
    },
    methods: {
        //查询模式
        queryModels() {
            request.appointment.query.model(this.schoolCode).then((res) => {
                if (res.success === true) {
                    this.modelOptions = res.object;
                    this.filters.models = "0";
                    //this.filters.models = res.object[0].modelId;
                    //global.printLog(res.object);
                    //this.queryClassesReview();
                }
            });
        },
        //查询报班时段
        queryClassesReview() {
            this.emptyVisible = false;
            this.pageLoading = true;
            let date = this.filters.date !== "" ? new Date(this.filters.date).Format("yyyy-MM-dd") : "";
            let para = [this.page, this.pageSize, this.schoolCode, date, (this.filters.models === "0" ? "" : this.filters.models), (this.filters.stage === "0" ? "" : this.filters.stage), this.filters.keyword];
            setTimeout(() => {
                global.printLog(para);
                request.appointment.classes.query.classesRecordWall(para).then((res) => {
                    if (res.success === true) {
                        let data = res.object.list;
                        global.printLog(data);
                        this.classesReview.total = res.object.num;
                        for (let item in data) {
                            this.classesReview.list.push({
                                teacherId: data[item].teacherId,
                                teacherName: data[item].teacherName,
                                phone: data[item].phone,
                                photosUrl: data[item].photosUrl,
                                classDOS: data[item].classDOS
                            });
                            for (let dos in data[item].classDOS) {
                                if (data[item].classDOS[dos].state === 10) {
                                    this.classCount++;
                                }
                            }
                        }
                        global.printLog(this.classesReview.list);
                        this.loadMore = this.classesReview.list.length < this.classesReview.total;
                    }
                    if (!this.classesReview.total) {
                        this.emptyVisible = true;
                    }
                    this.pageLoading = false;
                });
            }, 1000)
        },
        //报班审核
        checkingClasses() {
            let selected = this.selected;
            let para = { times: [] };
            for (let item in selected) {
                para.times.push({
                    classId: selected[item].classId,
                    state: 20
                });
            }
            let data = Object.assign({}, para);
            request.appointment.classes.checking(data).then((res) => {
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
        },
        handleAllSelectedChange(evt) {
            this.selected = [];
            let data = this.classesReview.list;
            for (let item in data) {
                for (let dos in data[item].classDOS) {
                    if (data[item].classDOS[dos].state === 10) {
                        data[item].classDOS[dos].check = evt.target.checked;
                        if (evt.target.checked) {
                            this.selected.push(data[item].classDOS[dos]);
                        }
                    }
                }
            }
            this.isIndeterminate = false;
        },
        handleLoadMore() {
            this.page++;
            this.queryClassesReview();
            if (this.selected.length > 0) {
                this.selectedAll = false;
                this.isIndeterminate = true;
            }
        },
        handleQueryAfterResetData() {
            this.page = 1;
            this.selected = [];
            this.classCount = 0;
            this.classesReview.list = [];
            this.queryClassesReview();
        }
    },
    created() {
        this.dateList = global.getDays(new Date().Format("yyyy-MM-dd"), 100);
        this.dateList[0].click = true;
    },
    activated() {
        global.printLog("activated every one");
        this.queryModels();
        //this.queryClassesReview();
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

<style scop lang="scss">
.review-tool {
    width: 100%;
    margin: 0 auto;
    text-align: right;
    margin-bottom: 15px;
    box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
    .el-col {
        >:first-child {
            margin-right: 20px;
        }
        >.el-button {
            padding: 9px 25px;
        }
    }
}

.classes-review {
    width: 100%;
    box-sizing: border-box;
    border-radius: 4px;
    position: relative;
    background-color: #fff;
    overflow: hidden;
    color: #333;
    opacity: 1;
    display: table;
    transition: opacity .2s;
    border: 1px solid #d1dbe5;
    box-shadow: 0 2px 14px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
    margin-bottom: 15px;
    .coach-photo {
        padding-top: 15px;
        padding-bottom: 10px;
        font-size: 14px;
        width: 150px;
        border-right: 1px solid #d1dbe5;
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        >img {
            width: 50px;
            height: 50px;
            border-radius: 50px;
            +p {
                margin-top: 10px;
            }
        }
    }
    .classes {
        display: table-cell;
        padding: 5px 10px;
        >span {
            display: inline-block;
            margin: 10px;
            a {
                width: 98px;
                border: 1px solid #BFCBDA;
                text-align: center;
                height: 50px;
                display: table-cell;
                vertical-align: middle;
                border-radius: 3px;
                >p {
                    color: #99A9BF;
                    &:last-child {
                        margin-top: 5px;
                    }
                }
                &.is-review {
                    background: #20a0ff;
                    border-color: #0190fe;
                    >p {
                        color: #fff;
                    }
                }
                &:not(.is-review):hover,
                &.is-selected {
                    border-color: #20a0ff;
                    >p {
                        color: #20a0ff;
                    }
                }
            }
        }
    }
}

.el-pagination {
    margin: 0;
}

.empty-data {
    width: 100%;
    font-size: 10em;
    color: #999;
    >p {
        font-size: .15em;
        font-weight: bolder;
    }
}
</style>