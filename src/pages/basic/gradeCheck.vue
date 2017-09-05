<template>
    <section>
        <a href="" download=".xlsx" id="down-link"></a>
        <!--工具条-->
        <el-row>
            <el-col :span="25" class="toolbar">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input class="search-input mr10 left" v-model="filters.keyWord" placeholder="输入学员姓名、身份证"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker type="daterange" placeholder="选择日期范围" v-model="filters.dateRange" @change="handleDateRangeChange" format="yyyy-MM-dd" :clearable='false' :editable="false">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-select style="width:135px;" v-model="filters.curCarType" placeholder="选择车型" class="mr10">
                            <el-option v-for='item in carTypeOptions' :key='item.value' :value='item.value' :label='item.label'></el-option>
                        </el-select>
                        <el-select v-model="filters.curState" style="width:135px;" placeholder="考试科目" class="mr10">
                            <el-option label="全部科目" value=""></el-option>
                            <el-option label="科目一" value="科目一"></el-option>
                            <el-option label="科目二" value="科目二"></el-option>
                            <el-option label="科目三 道路驾驶技能考试" value="科目三 道路驾驶技能考试"></el-option>
                            <el-option label="科目三 安全文明常识考试" value="科目三 安全文明常识考试"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="right" style="margin-right:49px;">
                        <el-button type='primary' @click='queryStudents'>查询</el-button>
                        <el-button type="primary" @click="handleCommand">导出表格</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <!--列表-->
        <section v-loading="pageLoading">
            <el-table border :data="students" highlight-current-row>
                <el-table-column prop="studentName" label="姓名" min-width='80'>
                </el-table-column>
                <el-table-column prop="task" label="考试科目" min-width='80'>
                </el-table-column>
                <el-table-column prop="carType" label="车型" width="90">
                </el-table-column>
                <el-table-column prop="taskTime" label="考试日期" width="120">
                </el-table-column>
                <el-table-column prop="taskZone" label="考试场地" min-width='80'>
                </el-table-column>
                <el-table-column prop="taskOrder" label="考试场次" width='170'>
                </el-table-column>
                <el-table-column prop="result" label="考试成绩" width='90'>
                </el-table-column>
            </el-table>
            <!--工具条-->
            <el-pagination @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :page-size="pageSize" :total="total">
            </el-pagination>
        </section>
    </section>
</template>

<script>
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        return {
            carTypeOptions: [],
            pageSize: global.pageSize,
            total: 0,
            filters: {
                dateRange: [],
                keyWord: "",
                curCarType: "",
                curState: ""
            },
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            students: [],
            page: 1,
            pageLoading: false
        }

    },
    methods: {
        //获取车辆类型
        getCarType() {
            request.public.queryCarType().then((res) => {
                if (res.success === true) {
                    this.carTypeOptions = [];
                    let data = res.object;
                    this.carTypeOptions.push({
                        value: '',
                        label: '全部车型'
                    });
                    for (let item in data) {
                        this.carTypeOptions.push({
                            label: data[item].value,
                            value: data[item].value
                        });
                    }
                }
            });
        },
        // 时间转换
        timeCheck() {
            // 初始化将所有的时间置空
            this.filters.dateRange = [];
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 8.64e7);
            end.setTime(end.getTime() - 8.64e7);
            // 将初始时间全部置为昨日
            this.filters.dateRange = [start, end];
        },
        queryStudents() {
            let beginDate = "";
            let endDate = "";
            this.students = [];
            this.pageLoading = true;
            let daterange = this.filters.dateRange;
            if (daterange.length > 0) {
                try {
                    beginDate = new Date(daterange[0]).Format("yyyy-MM-dd");
                    endDate = new Date(daterange[1]).Format("yyyy-MM-dd");
                } catch (e) {
                    beginDate = daterange[0];
                    endDate = daterange[1];
                }
            }
            let args = [this.schoolCode, beginDate, endDate, this.filters.curState, this.filters.curCarType, this.filters.keyWord, this.page, this.pageSize];
            setTimeout(() => {
                request.basic.exam.query.listScoreSearch(args).then((res) => {
                    if (res.success) {
                        this.pageLoading = false;
                        this.total = res.object.num;
                        res.object.list.forEach(item => {
                            this.students.push({
                                studentName: item.studentName,
                                task: item.examStageName,
                                carType: item.examCarTypeName,
                                taskTime: item.examDate,
                                taskZone: item.examSite,
                                taskOrder: item.examScreenings,
                                result: item.examScore
                            });
                        });
                    }
                });
            }, 1000);
        },
        handleCommand() {
            let beginDate = "";
            let endDate = "";
            let downLink = document.getElementById("down-link");
            try {
                beginDate = new Date(this.filters.dateRange[0]).Format("yyyy-MM-dd");
                endDate = new Date(this.filters.dateRange[1]).Format("yyyy-MM-dd");
            } catch (e) {
                beginDate = this.filters.dateRange[0];
                endDate = this.filters.dateRange[1];
            }
            downLink.setAttribute("href", sessionStorage.getItem('baseUrl') + "/sc/exam/exportScoreInfo?keyWord=" + encodeURI(this.filters.keyWord) + "&examCarTypeName=" + (this.filters.curCarType === "" ? '' : this.filters.curCarType) + "&examStageName=" + encodeURI(this.filters.curState) + "&schoolCode=" + this.schoolCode + "&examBeginDate=" + beginDate + "&examEndDate=" + endDate);
            downLink.click();
        },
        handleCurrentChange(val) {
            this.page = val;
            this.queryStudents();
        },
        handleDateRangeChange(daterange) {
            this.filters.dateRange = [];
            if (daterange.length > 0) {
                this.filters.dateRange.push(daterange.split(" - ")[0]);
                this.filters.dateRange.push(daterange.split(" - ")[1]);
                this.page = 1;
            }
        }
    },
    deactivated() {
        global.printLog("deactivated...");
    },
    activated(){
        this.queryStudents();
    },
    mounted() {
        this.timeCheck();
        this.getCarType();
    }
}

</script>