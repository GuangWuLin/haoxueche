<template>
    <section>
        <a href="" download=".xlsx" id="down-link"></a>
        <!--工具条-->
        <div>
            <el-radio-group v-model="radioHeaderSel">
                <el-radio-button label="评价汇总"></el-radio-button>
                <el-radio-button label="评价明细"></el-radio-button>
            </el-radio-group>
    
        </div>
        <!--评价汇总-->
        <div v-show="this.radioHeaderSel==='评价汇总'">
            <!--列表-->
            <el-row style="margin-top:20px;">
                <el-col :span="25" class="toolbar">
                    <el-form :inline="true" :model="tabOne">
                        <el-form-item>
                            <el-input class="search-input mr10 left" v-model="tabOne.keyWord" placeholder="输入教练姓名或电话"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-date-picker :picker-options="tabOne.pickerOptions2" align="right" type="daterange" :clearable='false' placeholder="选择日期范围" v-model="tabOne.dateRange" @change="handleDateRangeChange" format="yyyy-MM-dd" :editable="false">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item class="right" style="margin-right:49px;">
                            <el-button type="primary" @click="queryDatas">查询</el-button>
                            <el-button type="primary" @click="handleCommand">导出表格</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <section v-loading="tabOne.pageLoading">
                <el-table @cell-click='cellClick' show-summary sum-text='合计' :summary-method="commentsSummaries" :data="allComments" border highlight-current-row>
                    <el-table-column prop="teacherName" label='教练'>
                    </el-table-column>
                    <el-table-column prop="phone" label="电话号码">
                    </el-table-column>
                    
                    <el-table-column label="内容评价数">
                        <el-table-column label="好评" column-key="内容评价数">
                            <template scope="scope">
                                <el-button type='text' style="text-decoration:underline;">{{ scope.row.hasGoodEvaluate }}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="hasMiddleEvaluate" label="中评" column-key="内容评价数">
                            <template scope="scope">
                                <el-button type='text' style="text-decoration:underline;">{{ scope.row.hasMiddleEvaluate }}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="hasBadEvaluate" label="差评" column-key="内容评价数">
                            <template scope="scope">
                                <el-button type='text' style="text-decoration:underline;">{{ scope.row.hasBadEvaluate }}</el-button>
                            </template>
                        </el-table-column>
                    </el-table-column>
    
                    <el-table-column label="星级评价数（好评：五星、四星  中评：三星  差评：二星、一星）">
                        <el-table-column label='好评' column-key="星级评价数">
                            <template scope="scope">
                                <el-button type='text' style="text-decoration:underline;">{{ scope.row.allGoodEvaluate }}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label='中评' column-key="星级评价数">
                            <template scope="scope">
                                <el-button type='text' style="text-decoration:underline;">{{ scope.row.allMiddleEvaluate }}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label='差评' column-key="星级评价数">
                            <template scope="scope">
                                <el-button type='text' style="text-decoration:underline;">{{ scope.row.allBadEvaluate }}</el-button>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination :current-page="tabOne.page" @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :page-size="pageSize" :total="tabOne.total">
                </el-pagination>
            </section>
        </div>
        <!--评价明细-->
        <div v-show="this.radioHeaderSel==='评价明细'">
            <el-row style="margin-top:20px;">
                <el-col :span="25" class="toolbar">
                    <el-form :inline="true" :model="tabTwo">
                        <el-radio class="radio" v-model="radio" label="1">教练</el-radio>
                        <el-radio class="radio" v-model="radio" label="2">学员</el-radio>
                        <el-form-item>
                            <el-input class="search-input mr10 left" v-model="tabTwo.keyWord" placeholder="输入姓名或电话"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-date-picker :picker-options="tabTwo.pickerOptions2" type="daterange" :clearable='false' placeholder="选择日期范围" v-model="tabTwo.dateRange" @change="handleDateRangeChange" format="yyyy-MM-dd" :editable="false">
                            </el-date-picker>
                        </el-form-item>
                        <br/>
                        <el-select v-model="tabTwo.level" style="width:135px;" placeholder="评价等级" class="mr10">
                            <el-option label="全部评价" value=""></el-option>
                            <el-option label="好评" value="1"></el-option>
                            <el-option label="中评" value="2"></el-option>
                            <el-option label="差评" value="3"></el-option>
                        </el-select>
                        <el-select v-model="tabTwo.score" style="width:135px;" placeholder="评价星级" class="mr10">
                            <el-option label="全部星级" value=""></el-option>
                            <el-option label="一星" value="1"></el-option>
                            <el-option label="二星" value="2"></el-option>
                            <el-option label="三星" value="3"></el-option>
                            <el-option label="四星" value="4"></el-option>
                            <el-option label="五星" value="5"></el-option>
                        </el-select>
                        <el-select v-model="tabTwo.hasComments" style="width:135px;" placeholder="评价内容" class="mr10">
                            <el-option label="全部评价内容" value=""></el-option>
                            <el-option label="有评价内容" value="1"></el-option>
                            <el-option label="无评价内容" value="0"></el-option>
                        </el-select>
                        <el-form-item class="right" style="margin-right:49px;">
                            <el-button type="primary" @click="queryDatas">查询</el-button>
                            <el-button type="primary" @click="handleCommand">导出表格</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <section v-loading="tabTwo.pageLoading">
                <el-table border :data="detailComments" highlight-current-row>
                    <el-table-column prop="teacherName" label="教练" min-width='80'>
                    </el-table-column>
                    <el-table-column prop="teacherPhone" label="教练电话" width='135'>
                    </el-table-column>
                    <el-table-column prop="studentName" label='学员' min-width='80'>
                    </el-table-column>
                    <el-table-column prop="studentPhone" label="学员电话" width='135'>
                    </el-table-column>
                    <el-table-column prop="evaluateTime" label='评论时间' width='170'>
                    </el-table-column>
                    <el-table-column prop="orderTime" label='培训时间' width='195'>
                    </el-table-column>
                    <el-table-column prop="levelName" label='评价等级' width='89'>
                    </el-table-column>
                    <el-table-column prop="score" label='星级' width='65'>
                    </el-table-column>
                    <el-table-column prop="comments" label="评价内容" :show-overflow-tooltip='true'>
                    </el-table-column>
                    <el-table-column prop="evaluateList" label="教练印象" :show-overflow-tooltip='true'>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :page-size="pageSize" :current-page="tabTwo.page" :total="tabTwo.total">
                </el-pagination>
            </section>
        </div>
    
    </section>
</template>

<script>
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        return {
            radio: '1',
            radioHeaderSel: "评价汇总",
            pageSize: global.pageSize,
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            allComments: [],
            detailComments: [],
            tabOne: {
                keyWord: '',
                level: '',
                hasComments: '',
                score: '',
                total: 0,
                page: 1,
                allReport: [],
                dateRange: [],
                pageLoading: false,
                pickerOptions2: {
                    shortcuts: [{
                        text: '昨天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '本周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            const weekDay = start.getDay();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * (weekDay - 1));
                            end.setTime(end.getTime() + 3600 * 1000 * 24 * (7 - weekDay));
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '本月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            const today = start.getDate();
                            const thisMonth = start.getMonth() + 1;
                            const year = start.getFullYear();
                            const monthEnd = new Date(year, thisMonth, 0).getDate();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * (today - 1));
                            end.setTime(end.getTime() + 3600 * 1000 * 24 * (monthEnd - today));
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '上月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            const today = start.getDate();
                            const thisMonth = start.getMonth() + 1;
                            const year = start.getFullYear();
                            const monthEnd = new Date(year, thisMonth - 1, 0).getDate();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * (today + monthEnd - 1));
                            end.setTime(end.getTime() - 3600 * 1000 * 24 * today);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
            },
            tabTwo: {
                keyWord: '',
                level: '',
                hasComments: '',
                score: '',
                page: 1,
                pageLoading: false,
                total: 0,
                dateRange: [],
                pickerOptions2: {
                    shortcuts: [{
                        text: '昨天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '本周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            const weekDay = start.getDay();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * (weekDay - 1));
                            end.setTime(end.getTime() + 3600 * 1000 * 24 * (7 - weekDay));
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '本月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            const today = start.getDate();
                            const thisMonth = start.getMonth() + 1;
                            const year = start.getFullYear();
                            const monthEnd = new Date(year, thisMonth, 0).getDate();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * (today - 1));
                            end.setTime(end.getTime() + 3600 * 1000 * 24 * (monthEnd - today));
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '上月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            const today = start.getDate();
                            const thisMonth = start.getMonth() + 1;
                            const year = start.getFullYear();
                            const monthEnd = new Date(year, thisMonth - 1, 0).getDate();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * (today + monthEnd - 1));
                            end.setTime(end.getTime() - 3600 * 1000 * 24 * today);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
            },

        }
    },
    methods: {
        commentsSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            for (var o in this.tabOne.allReport) {
                this.tabOne.allReport[o] = Number(this.tabOne.allReport[o]);
            }
            sums[0] = '合计';
            sums[1] = '--';
            sums[2] = this.tabOne.allReport.hasGoodEvaluate;
            sums[3] = this.tabOne.allReport.hasMiddleEvaluate;
            sums[4] = this.tabOne.allReport.hasBadEvaluate;
            sums[5] = this.tabOne.allReport.allGoodEvaluate;
            sums[6] = this.tabOne.allReport.allMiddleEvaluate;
            sums[7] = this.tabOne.allReport.allBadEvaluate;
            return sums;
        },
        // 单格被点击
        cellClick(row, column, cell, event) {
            // 将该cell的 keyword 赋值给 tabTwo
            this.tabTwo.keyWord = row.teacherName === '--'?'':row.teacherName;
            this.tabTwo.dateRange = this.tabOne.dateRange;
            // 将该cell的 星级 赋值给 tabTwo
            switch (column.label) {
                case '好评':
                    if (column.columnKey === '内容评价数') {
                        this.tabTwo.level = '1';
                        this.tabTwo.score = '';
                    } else if (column.columnKey === '星级评价数') {
                        this.tabTwo.score = '5';
                        this.tabTwo.level = '';
                    }
                    break;
                case '中评':
                    if (column.columnKey === '内容评价数') {
                        this.tabTwo.level = '2';
                        this.tabTwo.score = '';
                    } else if (column.columnKey === '星级评价数') {
                        this.tabTwo.score = '3';
                        this.tabTwo.level = '';
                    }
                    break;
                case '差评':
                    if (column.columnKey === '内容评价数') {
                        this.tabTwo.level = '3';
                        this.tabTwo.score = '';
                    } else if (column.columnKey === '星级评价数') {
                        this.tabTwo.score = '2';
                        this.tabTwo.level = '';
                    }
                default:
                    break;
            }
            this.radioHeaderSel = '评价明细';
            this.radio = '1';
            this.queryDetail();
        },
        // 时间转换
        timeCheck() {
            this.tabOne.dateRange = [];
            this.tabTwo.dateRange = [];
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 8.64e7);
            end.setTime(end.getTime() - 8.64e7);
            this.tabOne.dateRange = [start, end];
            this.tabTwo.dateRange = [start, end];
        },
        queryDatas() {
            if (this.radioHeaderSel === '评价汇总') {
                this.queryCoachs();
            } else {
                this.queryDetail();
            }
        },
        queryDetail() {
            var beginDate, endDate;
            try {
                beginDate = new Date(this.tabTwo.dateRange[0]).Format('yyyy-MM-dd');
                endDate = new Date(this.tabTwo.dateRange[1]).Format('yyyy-MM-dd');
            } catch (e) {
                beginDate = this.tabTwo.dateRange[0];
                endDate = this.tabTwo.dateRange[1];
            }
            this.tabTwo.pageLoading = true;
            let teacherKeyWord = `&teacherKeyWord=${this.tabTwo.keyWord !== '' ? this.tabTwo.keyWord : ''}`;
            let studentKeyWord = `&studentKeyWord=${this.tabTwo.keyWord !== '' ? this.tabTwo.keyWord : ''}`;
            let args = [this.schoolCode, beginDate, endDate, this.tabTwo.page, this.pageSize, this.tabTwo.level, this.tabTwo.hasComments, this.tabTwo.score, this.radio === '1' ? teacherKeyWord : studentKeyWord];
            this.detailComments = [];
            setTimeout(() => {
                request.reportCentre.commentsReport.EvaluateDetail(args).then(res => {
                    if (res.success) {
                        this.tabTwo.pageLoading = false;
                        this.tabTwo.total = res.object.num;
                        res.object.list.forEach(item => {
                            this.detailComments.push({
                                teacherName: Number(item.teacherName)!==0?item.teacherName:'--',
                                teacherPhone: Number(item.teacherPhone)!==0?item.teacherPhone:'--',
                                studentName: Number(item.studentName)!==0?item.studentName:'--',
                                studentPhone: Number(item.studentPhone)!==0?item.studentPhone:'--',
                                evaluateTime: Number(item.evaluateTime)!==0?item.evaluateTime:'--',
                                orderTime: Number(item.orderTime)!==0?item.orderTime:'--',
                                levelName: Number(item.levelName)!==0?item.levelName:'--',
                                score: item.score,
                                comments: Number(item.comments)!==0?item.comments:'--',
                                evaluateList: Number(item.evaluateList)!==0?item.evaluateList:'--',
                            });
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: '获取评价明细时信息失败，原因: ' + res.message
                        });
                    }
                });
            }, 100);

        },
        queryCoachs() {
            var beginDate, endDate;
            try {
                beginDate = new Date(this.tabOne.dateRange[0]).Format('yyyy-MM-dd');
                endDate = new Date(this.tabOne.dateRange[1]).Format('yyyy-MM-dd');
            } catch (e) {
                beginDate = this.tabOne.dateRange[0];
                endDate = this.tabOne.dateRange[1];
            }
            let args = [this.schoolCode, beginDate, endDate, this.tabOne.page, this.pageSize, this.tabOne.keyWord];
            this.tabOne.pageLoading = true;
            setTimeout(() => {
                this.allComments = [];
                request.reportCentre.commentsReport.TeacherEvaluate(args).then((res) => {
                    if (res.success) {
                        this.tabOne.pageLoading = false;
                        this.tabOne.total = res.object.reports.num;
                        this.tabOne.allReport = res.object.allReport;
                        res.object.reports.list.forEach(item => {
                            this.allComments.push({
                                teacherName: Number(item.teacherName)!==0?item.teacherName:'--',
                                phone: item.phone,
                                hasGoodEvaluate: item.hasGoodEvaluate,
                                hasMiddleEvaluate: item.hasMiddleEvaluate,
                                hasBadEvaluate: item.hasBadEvaluate,
                                allGoodEvaluate: item.allGoodEvaluate,
                                allMiddleEvaluate: item.allMiddleEvaluate,
                                allBadEvaluate: item.allBadEvaluate
                            });
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: '获取评价汇总时信息失败，原因: ' + res.message
                        })
                    }
                });
            }, 1000);

        },
        handleCommand() {
            let downLink = document.getElementById("down-link");
            let url = '', beginDate = '', endDate = '', keyWord = '';
            if (this.radioHeaderSel === '评价汇总') {
                url = '/sc/teacherReport/getTeacherEvaluateExport?schoolCode=';
                try {
                    beginDate = new Date(this.tabOne.dateRange[0]).Format('yyyy-MM-dd');
                    endDate = new Date(this.tabOne.dateRange[1]).Format('yyyy-MM-dd');
                } catch (e) {
                    beginDate = this.tabOne.dateRange[0];
                    endDate = this.tabOne.dateRange[1];
                }
                keyWord = this.tabOne.keyWord!==''?encodeURI(this.tabOne.keyWord) : '';
                downLink.setAttribute("href", sessionStorage.getItem('baseUrl') + url + this.schoolCode + "&beginTime=" + beginDate + "&endTime=" + endDate + '&teacherKeyWord=' + keyWord);
            } else if (this.radioHeaderSel === '评价明细') {
                url = '/sc/teacherReport/getEvaluateDetailExport?schoolCode=';
                try {
                    beginDate = new Date(this.tabTwo.dateRange[0]).Format('yyyy-MM-dd');
                    endDate = new Date(this.tabTwo.dateRange[1]).Format('yyyy-MM-dd');
                } catch (e) {
                    beginDate = this.tabTwo.dateRange[0];
                    endDate = this.tabTwo.dateRange[1];
                }
                // keyWord = this.tabTwo.keyWord!==''?encodeURI(this.tabTwo.keyWord) : '';
                keyWord = this.radio == '1'?"&teacherKeyWord=":"&studentKeyWord=";
                downLink.setAttribute("href", sessionStorage.getItem('baseUrl') + url + this.schoolCode + "&beginTime=" + beginDate + "&endTime=" + endDate + keyWord + (this.tabTwo.keyWord!==''?encodeURI(this.tabTwo.keyWord):'') + "&level=" + this.tabTwo.level + '&score=' + this.tabTwo.score + '&hasComments=' + this.tabTwo.hasComments);
            }
            console.log(downLink);
            downLink.click();
        },
        handleCurrentChange(val) {
            if (this.radioHeaderSel === '评价汇总') {
                this.tabOne.page = val;
                this.queryCoachs();

            } else if (this.radioHeaderSel === '评价明细') {
                this.tabTwo.page = val;
                this.queryDetail();
            }
        },
        handleDateRangeChange(daterange) {
            let datasRange = [];
            if (daterange.length > 0) {
                let start = daterange.split(" - ")[0];
                let end = daterange.split(" - ")[1];
                let start_ = new Date(start).getTime();
                let end_ = new Date(end).getTime();
                datasRange.push(start);
                datasRange.push(end);
                if (Math.round((end_ - start_) / 8.64e7) >= 31) {
                    this.$message({
                        type: 'warning',
                        message: '为保证服务器稳定运行，请将选择区间控制在31天以内~'
                    });
                } else {
                    if (this.radioHeaderSel === '评价汇总') {
                        this.tabOne.dateRange = datasRange;
                        this.tabOne.page = 1;
                    } else {
                        this.tabTwo.dateRange = datasRange;
                        this.tabTwo.page = 1;
                    }
                }
            }
        }
    },
    deactivated() {
        this.tabOne.page = 1;
        this.tabTwo.page = 1;
        global.printLog("deactivated...");
    },
    activated() {
        this.queryCoachs();
    },
    mounted() {
        this.timeCheck();
    }
}

</script>