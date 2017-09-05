<template>
    <section v-loading="pageLoading">
        <el-row class="mb20">
            <el-col :span="24">
                <el-date-picker v-model="recruitStudents.dateRange" type="daterange" placeholder="选择日期范围" class="right" :editable="false" @change="handleDateRangeChange"></el-date-picker>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="19">
                <highcharts :options="recruitStudents.options" ref="highcharts"></highcharts>
            </el-col>
        </el-row>
        
    </section>
</template>
<script>
var highcharts;
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        return {
            pageLoading: false,
            recruitStudents: {
                title: "",
                dateRange: "",
                para: [0, 0, "", ""],
                options: {
                    chart: {
                        type: ""
                    },
                    title: {
                        text: "",
                        x: -20 //center
                    },
                    xAxis: [{
                        categories: [],
                        reversed: true,
                    }, {
                        opposite: true,
                        reversed: true,
                        categories: [],
                        linkedTo: 0,
                    }],
                    yAxis: {
                        title: {
                            text: null
                        }
                    },
                    plotOptions: {
                        series: {
                            stacking: "normal"
                        }
                    },
                    series: [{
                        name: '人数',
                        data: []
                    }]
                }
            },
            deptId: JSON.parse(sessionStorage.getItem("user")).deptId,
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
        }
    },
    methods: {
        queryRecruitStudents() {
            this.pageLoading = true;
            this.recruitStudents.para[0] = this.schoolCode;
            this.recruitStudents.para[1] = this.deptId;
            request.reportCentre.business.queryRecruitStudents(this.recruitStudents.para).then(res => {
                global.printLog(res);
                if (res.success) {
                    let data = res.object;
                    this.pageLoading = false;
                    highcharts.$options.propsData.options.series[0].data = [];
                    highcharts.$options.propsData.options.xAxis[0].categories = [];
                    highcharts.$options.propsData.options.xAxis[1].categories = [];
                    for (let item in data) {
                        highcharts.$options.propsData.options.xAxis[0].categories.push(data[item].deptName);
                        highcharts.$options.propsData.options.xAxis[1].categories.push(data[item].deptName);
                        highcharts.$options.propsData.options.series[0].data.push(data[item].signInCount);
                    }
                }else{
                    this.$message({
                        type:'error',
                        message:'查询失败,原因： ' + res.message
                    })
                }
            });
        },
        handleDateRangeChange() {
            highcharts.$options.propsData.options.chart.type = "bar";
            let beginYear = new Date(this.recruitStudents.dateRange[0]).getFullYear();
            let beginMonth = new Date(this.recruitStudents.dateRange[0]).getMonth() + 1;
            let endYear = new Date(this.recruitStudents.dateRange[1]).getFullYear();
            let endMonth = new Date(this.recruitStudents.dateRange[1]).getMonth() + 1;
            if (this.recruitStudents.dateRange[0] === null) {
                this.recruitStudents.para[2] = "";
                this.recruitStudents.para[3] = "";
            }
            else {
                this.recruitStudents.para[2] = new Date(this.recruitStudents.dateRange[0]).Format("yyyy-MM-dd");
                this.recruitStudents.para[3] = new Date(this.recruitStudents.dateRange[1]).Format("yyyy-MM-dd");
            }
            highcharts.$options.propsData.options.title.text = (this.recruitStudents.dateRange[0] === null ? "阶段统计" : beginYear + "年" + beginMonth + "月-" + endYear + "年" + endMonth + "月阶段统计");
            this.recruitStudents.title = highcharts.$options.propsData.options.title.text;
            global.printLog(this.recruitStudents.para);
            this.queryRecruitStudents();
        }
    },
    activated() {
        global.printLog("activated");
        this.queryRecruitStudents();
    },
    deactivated() {
        global.printLog("deactivated");
    },
    mounted() {
        highcharts = this.$refs.highcharts;
        highcharts.$options.propsData.options.chart.type = "bar";
        highcharts.$options.propsData.options.title.text = "阶段统计";
        global.printLog(highcharts);
    }
}
</script>