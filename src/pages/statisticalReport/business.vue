<template>
    <section v-loading="pageLoading">
        <el-row class="mb20">
            <el-col :span="24">
                <el-radio-group v-model="businessType" @change="handleTypeChange">
                    <el-radio-button label="招生统计"></el-radio-button>
                    <el-radio-button label="欠费统计"></el-radio-button>
                </el-radio-group>
                <el-date-picker v-if="businessType==='招生统计'" v-model="recruitStudents.dateRange" type="daterange" placeholder="选择日期范围" class="right" :editable="false" @change="handleDateRangeChange"></el-date-picker>
                <el-date-picker v-else v-model="arrears.dateRange" type="daterange" placeholder="选择日期范围" class="right" :editable="false" @change="handleDateRangeChange"></el-date-picker>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="5">
                <el-input placeholder="根据单位名称过滤" class="mb10" v-model="filterText">
                </el-input>
                <el-tree class="filter-tree" :data="unitsOption" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="unitsOption" @node-click="nodeClick" :expand-on-click-node="false" :highlight-current="true">
                </el-tree>
            </el-col>
            <el-col :span="19">
                <highcharts v-if="businessType==='招生统计'" :options="recruitStudents.options" ref="highcharts"></highcharts>
                <highcharts v-else :options="arrears.options" ref="highcharts"></highcharts>
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
            unitsOption: [],
            filterText: "",
            defaultProps: {
                children: "children",
                label: "label"
            },
            pageLoading: false,
            businessType: "招生统计",
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
                        name: '招生数',
                        data: []
                    }, {
                        name: '退学数',
                        data: []
                    }]
                }
            },
            deptId: JSON.parse(sessionStorage.getItem("user")).deptId,
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            arrears: {
                title: "",
                dateRange: "",
                para: [0, 0, "", ""],
                options: {
                    chart: {
                        type: "column"
                    },
                    title: {
                        text: "",
                        x: -20 //center
                    },
                    xAxis: {
                        type: "category"
                    },
                    yAxis: {
                        title: {
                            text: "金额"
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                format: ""
                            }
                        }
                    },
                    series: [{
                        name: "单位",
                        colorByPoint: true,
                        data: []
                    }],
                    drilldown: {
                        series: []
                    }
                }
            }
        }
    },
    methods: {
        queryRecruitStudents() {
            this.recruitStudents.para[0] = this.schoolCode;
            request.reportCentre.business.queryRecruitStudents(this.recruitStudents.para).then(res => {
                global.printLog(res);
                if (res.success) {
                    let data = res.object;
                    highcharts.$options.propsData.options.series[0].data = [];
                    highcharts.$options.propsData.options.series[1].data = [];
                    highcharts.$options.propsData.options.xAxis[0].categories = [];
                    highcharts.$options.propsData.options.xAxis[1].categories = [];
                    for (let item in data) {
                        highcharts.$options.propsData.options.xAxis[0].categories.push(data[item].deptName);
                        highcharts.$options.propsData.options.xAxis[1].categories.push(data[item].deptName);
                        highcharts.$options.propsData.options.series[0].data.push(data[item].signInCount);
                        highcharts.$options.propsData.options.series[1].data.push(data[item].signOutCount);
                    }
                }
                this.pageLoading = false;
            });
        },
        queryArrears() {
            this.arrears.para[0] = this.schoolCode;
            request.reportCentre.business.queryArrears(this.arrears.para).then(res => {
                if (res.success) {
                    global.printLog(res);
                    let data = res.object;
                    highcharts.$options.propsData.options.series[0].data = [];
                    for (let item in data) {
                        highcharts.$options.propsData.options.series[0].data.push({
                            name: data[item].deptName,
                            y: data[item].cost
                            //drilldown: data[item].isDetail ? true : null
                        });
                    }
                }
                this.pageLoading = false;
            });
        },
        queryArrearsDetail() {
            this.arrears.para[0] = this.schoolCode;
            request.reportCentre.business.queryArrearsDetail(this.arrears.para).then(res => {
                if (res.success) {
                    global.printLog(res);
                    let data = res.object;
                    highcharts.$options.propsData.options.series[0].data = [];
                    for (let item in data) {
                        highcharts.$options.propsData.options.series[0].data.push({
                            name: data[item].deptName,
                            y: data[item].cost
                            //drilldown: data[item].isDetail ? true : null
                        });
                    }
                }
            })
        },
        //获取单位
        getUnits() {
            let para = this.deptId;
            this.pageLoading = true;
            global.printLog(para);
            setTimeout(() => {
                request.backstageManagement.department.query(para).then((res) => {
                    if (res.success) {
                        this.unitsOption = [];
                        let data = res.object;
                        global.printLog(data);
                        for (var item in data) {
                            this.unitsOption.push(this.recursive(data[item]));
                        }
                        if (data.length) {
                            this.recruitStudents.para[1] = data[0].deptId;
                            this.arrears.para[1] = data[0].deptId;
                            this.handleTypeChange(this.businessType);
                        }
                    }
                });
            }, 500);
        },
        //回传数据递归处理
        recursive(data) {
            var orgdata = {
                value: data.deptId + "&" + data.deptName,
                label: data.deptName
            };
            if (data.children) {
                $.extend(orgdata, { children: [] });
            }
            for (var item in data.children) {
                var subdata = this.recursive(data.children[item]);
                orgdata.children.push(subdata);
            }
            return orgdata;
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        nodeClick(data) {
            let nodeid = data.value.split("&")[0];
            global.printLog(nodeid);
            if (this.businessType === "招生统计") {
                this.recruitStudents.para[1] = nodeid;
                this.queryRecruitStudents();
            }
            else {
                this.arrears.para[1] = nodeid;
                this.queryArrearsDetail();
                //this.queryArrears();
            }
        },
        handleDateRangeChange() {
            if (this.businessType === "招生统计") {
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
                highcharts.$options.propsData.options.title.text = (this.recruitStudents.dateRange[0] === null ? "招生统计" : beginYear + "年" + beginMonth + "月-" + endYear + "年" + endMonth + "月招生统计");
                this.recruitStudents.title = highcharts.$options.propsData.options.title.text;
                global.printLog(this.recruitStudents.para);
                this.queryRecruitStudents();
            }
            else {
                highcharts.$options.propsData.options.chart.type = "column";
                let beginYear = new Date(this.arrears.dateRange[0]).getFullYear();
                let beginMonth = new Date(this.arrears.dateRange[0]).getMonth() + 1;
                let endYear = new Date(this.arrears.dateRange[1]).getFullYear();
                let endMonth = new Date(this.arrears.dateRange[1]).getMonth() + 1;
                if (this.arrears.dateRange[0] === null) {
                    this.arrears.para[2] = "";
                    this.arrears.para[3] = "";
                }
                else {
                    this.arrears.para[2] = new Date(this.arrears.dateRange[0]).Format("yyyy-MM-dd");
                    this.arrears.para[3] = new Date(this.arrears.dateRange[1]).Format("yyyy-MM-dd");
                }
                highcharts.$options.propsData.options.title.text = (this.arrears.dateRange[0] === null ? "欠费统计" : beginYear + "年" + beginMonth + "月-" + endYear + "年" + endMonth + "月欠费统计");
                this.arrears.title = highcharts.$options.propsData.options.title.text;
                this.queryArrears();
            }
        },
        handleTypeChange(val) {
            highcharts = this.$refs.highcharts;
            if (val === "招生统计") {
                if (this.recruitStudents.title === "") {
                    highcharts.$options.propsData.options.title.text = val;
                }
                else {
                    highcharts.$options.propsData.options.title.text = this.recruitStudents.title;
                }
                this.queryRecruitStudents();
            }
            else {
                if (this.arrears.title === "") {
                    highcharts.$options.propsData.options.title.text = val;
                }
                else {
                    highcharts.$options.propsData.options.title.text = this.arrears.title;
                }
                this.queryArrears();
            }
        }
    },
    activated() {
        global.printLog("activated");
        this.getUnits();
    },
    deactivated() {
        global.printLog("deactivated");
    },
    mounted() {
        highcharts = this.$refs.highcharts;
        highcharts.$options.propsData.options.chart.type = "bar";
        highcharts.$options.propsData.options.title.text = "招生统计";
        global.printLog(highcharts);
    },
    watch: {
        filterText(val) {
            this.$refs.unitsOption.filter(val);
        }
    }
}
</script>