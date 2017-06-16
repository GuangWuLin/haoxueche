<template>
    <section v-loading="pageLoading">
        <el-row>
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-form :inline="true">
                    <el-col :span="12">
                        <el-form-item>
                            <el-input class="search-input" v-model="exam.registered.keyword" placeholder="输入学员姓名/电话号码" icon="search" :on-icon-click="getExamRegistered"></el-input>
                            <el-date-picker type="date" placeholder="考试日期" class="ml15" :editable="false" v-model="exam.registered.examDate" @change="handlePickTime"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" class="t-right">
                        <el-form-item>
                            <el-button type="primary" @click="handleExamList" class="ml15">考试名单</el-button>
                            <el-button type="primary" @click="handleRecordEntry" class="ml15">成绩录入</el-button>
                            <el-button type="primary" @click="handleExport">导出表格</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="exam.registered.list" highlight-current-row @row-click="handleRowClick">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="studentName" label="学员姓名"></el-table-column>
                <el-table-column prop="phone" label="电话号码"></el-table-column>
                <el-table-column prop="carType" label="考试车型"></el-table-column>
                <el-table-column prop="stage" label="考试科目阶段" :formatter="formatter"></el-table-column>
                <el-table-column prop="score" label="考试成绩" :formatter="formatter"></el-table-column>
                <el-table-column prop="checkTeacherName" label="核算教练姓名"></el-table-column>
                <!--<el-table-column prop="checkTeacherId" label="核算教练编号"></el-table-column>-->
                <el-table-column prop="gmtExam" label="考试时间" :formatter="formatter"></el-table-column>
            </el-table>
            <!--工具条-->
            <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="exam.registered.total">
            </el-pagination>
        </el-row>
        <!--考试名单-->
        <el-dialog title="考试名单" v-model="examListFormVisible" :close-on-click-modal="false" size="full" @open="handleDialogOpen('exam-list')" class="exam">
            <!-- 基本信息 -->
            <div class="basic mt20" style="margin-top:0;padding:0 20px;">
                <el-form>
                    <el-row>
                        <el-col :span="24">
                            <el-input class="search-input" v-model="exam.student.keyword" placeholder="输入学员姓名/电话号码" icon="search" :on-icon-click="getExamStudent"></el-input>
                        </el-col>
                        <el-col :span="11" class="mt15">
                            <el-table :data="exam.student.list" @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="55"></el-table-column>
                                <el-table-column prop="studentName" label="姓名"></el-table-column>
                                <el-table-column prop="phone" label="号码" width="128"></el-table-column>
                                <el-table-column prop="carTypeName" label="车型"></el-table-column>
                                <el-table-column prop="schoolName" label="学校"></el-table-column>
                            </el-table>
                            <!--工具条-->
                            <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="exam.student.total">
                            </el-pagination>
                        </el-col>
                        <el-col :span="1" class="mt20">
                        </el-col>
                        <el-col :span="12" class="mt15">
                            <el-table :data="exam.selectData.list">
                                <el-table-column prop="studentName" label="姓名"></el-table-column>
                                <el-table-column prop="phone" label="号码" width="128"></el-table-column>
                                <el-table-column prop="carTypeName" label="车型"></el-table-column>
                                <el-table-column prop="schoolName" label="学校"></el-table-column>
                                <el-table-column label="操作" width="100">
                                    <template scope="scope">
                                        <el-button type="text" size="small" @click="handleRemoveSelected(scope.row)">移除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!--工具条-->
                            <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleSelCurrentChange" :page-size="pageSize" :total="exam.selectData.total">
                            </el-pagination>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="examListFormVisible = false" size="large">取消</el-button>
                <el-button type="primary" size="large" @click="handleSave('judgment')">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="请选择考试科目和考试日期" v-model="selectConditionalFormVisible" :close-on-click-modal="false" size="mini">
            <el-form :model="examForm" label-width="90px" class="mt30" :inline="true" ref="examForm" :rules="examFormRules">
                <el-form-item label="考试科目" prop="stage">
                    <el-select v-model="examForm.stage" placeholder="考试科目" @change="handleStageChange" style="width:180px;">
                        <el-option v-for="item in stageOptions" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="考试日期" prop="gmtExam">
                    <el-date-picker v-model="examForm.gmtExam" type="date" placeholder="考试日期" :editable="false" style="width:180px;"></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer mt15">
                <el-button @click.native="handleSave('entry')" size="large">确定</el-button>
            </div>
        </el-dialog>
        <!--成绩录入-->
        <el-dialog title="成绩录入" v-model="recordEntryFormVisible" :close-on-click-modal="false" size="full">
            <div class="basic mt20" style="margin-top:0;padding:0 20px;">
                <el-form>
                    <el-row>
                        <el-col :span="24">
                            <el-input class="search-input" v-model="exam.unregistered.keyword" placeholder="输入学员姓名、电话号码" icon="search" :on-icon-click="getExamUnRegistered"></el-input>
                            <el-date-picker type="date" v-model="exam.unregistered.examDate" placeholder="考试日期" :editable="false" style="width:180px;" @change="handlePickTime" class="ml15"></el-date-picker>
                        </el-col>
                        <el-col :span="24" class="mt20">
                            <el-table :data="exam.unregistered.list">
                                <el-table-column prop="studentName" label="姓名"></el-table-column>
                                <el-table-column prop="phone" label="电话" width="160"></el-table-column>
                                <el-table-column prop="carType" label="车型"></el-table-column>
                                <el-table-column prop="gmtExam" label="考试日期" :formatter="formatter" width="130"></el-table-column>
                                <!--<el-table-column prop="schoolName" label="分校"></el-table-column>-->
                                <el-table-column label="核算教练" width="200">
                                    <template scope="scope">
                                        <el-select placeholder="请选择教练" v-model="scope.row.checkTeacherName">
                                            <el-option v-for="item in teachers" :label="item.label" :value="item">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="成绩" width="350">
                                    <template scope="scope">
                                        <el-radio-group v-model="scope.row.score" size="small" style="font-size:13px;">
                                            <el-radio :label="1">一次通过</el-radio>
                                            <el-radio :label="2">二次通过</el-radio>
                                            <el-radio :label="0">未通过</el-radio>
                                        </el-radio-group>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!--工具条-->
                            <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="exam.unregistered.total">
                            </el-pagination>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="recordEntryFormVisible = false" size="large">取消</el-button>
                <el-button type="primary" @click.native="handleSave('results')" size="large">确定</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<style scope>
.el-dialog--small {
    width: 1100px;
}

.exam .el-dialog--full {
    width: 1200px;
}
</style>

<script>
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        return {
            checkedData: [],
            pageLoading: false,
            pageSize: global.pageSize,
            exam: {
                student: {
                    page: 1,
                    list: [],
                    total: 0,
                    keyword: "",
                },
                registered: {
                    page: 1,
                    examDate: "",
                    list: [],
                    total: 0,
                    keyword: "",
                },
                unregistered: {
                    page: 1,
                    examDate: "",
                    list: [{
                        id: "",
                        studentName: "",
                        phone: "",
                        carType: "",
                        checkTeacherName: "",
                        score: "",
                    }],
                    total: 0,
                    keyword: "",
                },
                selectData: {
                    page: 1,
                    list: [],
                    total: 0,
                }
            },
            examListFormVisible: false,
            stageOptions: global.options.stage,
            teachers: [],
            recordEntryFormVisible: false,
            selectConditionalFormVisible: false,
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            examForm: {
                stage: "",
                data: {
                    exams: []
                },
                gmtExam: ""
            },
            selectStage: "",
            examFormRules: {
                stage: [
                    { required: true, message: "请选择考试科目", trigger: "change" }
                ],
                gmtExam: [
                    { type: "date", required: true, message: "请选择考试日期", trigger: "change" }
                ]
            }
        }
    },
    methods: {
        formatter(row, column) {
            if (column.property === "stage") {
                return global.enums.stage[row.stage];
            }
            else if (column.property === "gmtExam") {
                return new Date(row.gmtExam).Format("yyyy-MM-dd");
            }
            else if (column.property === "score") {
                return row.score === "0" ? "未通过" : row.score === "1" ? "一次通过" : "二次通过";
            }
        },
        getExamRegistered() {
            this.pageLoading = true;
            let examDate = this.exam.registered.examDate !== undefined ? this.exam.registered.examDate : "";
            let para = [this.schoolCode, this.exam.registered.page, this.pageSize, this.exam.registered.keyword, examDate, true];
            setTimeout(() => {
                request.basic.exam.query.list(para).then((res) => {
                    if (res.success === true) {
                        this.pageLoading = false;
                        this.exam.registered.total = res.object.num;
                        this.exam.registered.list = res.object.list;
                    }
                });
            }, 1000);
        },
        getExamUnRegistered() {
            let examDate = this.exam.unregistered.examDate !== undefined ? this.exam.unregistered.examDate : "";
            let para = [this.schoolCode, this.exam.unregistered.page, this.pageSize, this.exam.unregistered.keyword, examDate, false];
            request.basic.exam.query.list(para).then((res) => {
                if (res.success === true) {
                    let data = res.object.list;
                    this.exam.unregistered.list = [];
                    for (let item in data) {
                        this.exam.unregistered.list.push({
                            id: data[item].id,
                            studentName: data[item].studentName,
                            phone: data[item].phone,
                            carType: data[item].carType,
                            checkTeacherName: "",
                            score: "",
                            gmtExam: data[item].gmtExam
                        });
                    }
                    this.exam.unregistered.total = res.object.num;
                }
            });
        },
        getExamStudent() {
            let args = [this.schoolCode, this.exam.student.page, this.pageSize, this.exam.student.keyword, 0, "", 1];
            request.basic.student.query.list(args).then((res) => {
                if (res.success === true) {
                    this.exam.student.total = res.object.num;
                    this.exam.student.list = res.object.list;
                }
            });
        },
        //查询教练员
        getTeachers() {
            let para = [this.schoolCode, 1, 10000, ""];
            request.basic.coach.query.list(para).then((res) => {
                if (res.success === true) {
                    this.teachers = [];
                    let data = res.object.list;
                    for (let item in data) {
                        this.teachers.push({
                            value: data[item].teacherId,
                            label: data[item].teacherName
                        })
                    }
                }
            });
        },
        handleSave(flag) {
            if (flag === "judgment") {
                let dataList = this.exam.selectData.list;
                if (!dataList.length) {
                    this.$message.warning("请选择学员！");
                }
                else {
                    this.selectConditionalFormVisible = true;
                }
            }
            else if (flag === "entry") {
                this.$refs["examForm"].validate((valid) => {
                    if (valid) {
                        let dataList = this.exam.selectData.list;
                        this.examForm.studentIds = [];
                        for (let item in dataList) {
                            this.examForm.data.exams.push({
                                studentId: dataList[item].studentId,
                                stage: this.examForm.stage,
                                gmtExam: new Date(this.examForm.gmtExam).Format("yyyy-MM-dd")
                            });
                        }
                        let objs = Object.assign({}, this.examForm.data);
                        request.basic.exam.create.exam(objs).then((res) => {
                            if (res.success === true) {
                                this.getExamStudent();
                                this.resetForm("examForm");
                                this.selectConditionalFormVisible = false;
                                this.$message({ message: res.object + "位学员的考试名单添加成功！", type: "success" });
                            }
                            else {
                                this.$message.error("考试名单添加失败！");
                            }
                        });
                    }
                });
            }
            else if (flag === "results") {
                let results = { exams: [] };
                let data = this.exam.unregistered.list;
                for (let item in data) {
                    if (data[item].checkTeacherName !== "" && data[item].score !== "") {
                        results.exams.push({
                            id: data[item].id,
                            score: data[item].score,
                            checkTeacherName: data[item].checkTeacherName.label,
                            checkTeacherId: data[item].checkTeacherName.value
                        });
                    }
                }
                if (results.exams.length > 0) {
                    request.basic.exam.create.examResuls(results).then((res) => {
                        if (res.success === true) {
                            this.getExamRegistered();
                            this.getExamUnRegistered();
                            this.$message({ message: "成绩录入成功！", type: "success" });
                        }
                        else {
                            this.$message.error({ message: "成绩录入失败！原因：" + res.message, type: "success" });
                        }
                    });
                }
                else {
                    this.$message.error("请先选择核算教练和成绩通过选项！");
                }
            }
        },
        handleRowClick() {
        },
        handleSelectionChange(data) {
            this.checkedData = data;
            this.exam.selectData.list = [];
            for (let item in data) {
                this.exam.selectData.list.unshift({
                    studentId: data[item].studentId,
                    studentName: data[item].studentName,
                    phone: data[item].phone,
                    carTypeName: data[item].carTypeName,
                    schoolName: data[item].schoolName
                });
            }
            this.exam.selectData.total = data.length;
        },
        handleRemoveSelected(item) {
            let checked = this.checkedData;
            let obj = this.exam.selectData.list;
            obj.splice(obj.indexOf(item), 1);
            checked.splice(checked.indexOf(item), 1);
        },
        handleDialogOpen(flag) {
            if (flag === "exam-list") {
                this.getExamStudent();
            }
        },
        handleCurrentChange(val) {
            if (this.examListFormVisible) {
                this.exam.student.page = val;
                this.getExamStudent();
            }
            else if (this.recordEntryFormVisible) {
                this.exam.unregistered.page = val;
                this.getExamUnRegistered();
            }
            else {
                this.exam.registered.page = val;
                this.getExamRegistered();
            }
        },
        handlePickTime(val) {
            let examDate = val !== undefined ? val : "";
            if (this.recordEntryFormVisible) {
                this.exam.unregistered.examDate = examDate;
                this.getExamUnRegistered();
            }
            else {
                this.exam.registered.examDate = examDate;
                this.getExamRegistered();
            }
        },
        handleSelCurrentChange() {
            //this.page = val;
        },
        handleExport() {
        },
        handleExamList() {
            this.examListFormVisible = true;
        },
        handleRecordEntry() {
            this.recordEntryFormVisible = true;
            this.getExamUnRegistered();
            this.getTeachers();
        },
        handleStageChange(val) {
            global.printLog(val);
        },
        //重置表单数据
        resetForm(formName) {
            this.checkedData = [];
            this.exam.selectData.list = [];
            this.$refs[formName].resetFields();
        }
    },
    activated() {
        global.printLog("activated every one");
        this.getExamRegistered();
    },
    mounted() {
    }
}

</script>