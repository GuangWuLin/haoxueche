<template>
    <section class="className">
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" label-width="80px">
                <el-col :span="20">
                    <el-form-item label="服务名称" class="normal">
                        <el-input placeholder="请输入服务名称" icon="search" v-model="this.serviceName" :on-icon-click="queryManagerList" @keyup.enter.native="queryManagerList">
                        </el-input>
                    </el-form-item>
                    <el-col :span="15" style="float:right;">
                        <el-form-item>
                            <el-button type="primary" @click="queryManagerList"> 查 询 </el-button>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table highlight-current-row :data="managerList" highlight-current-row>
            <el-table-column prop="attachService.name" label="理论教学"></el-table-column>
            <el-table-column prop="gmtApply" label="申请时间"></el-table-column>
            <el-table-column prop="gmtApproval" label="完成时间"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column prop="task" label="操作">
                <template scope="scope">
                    <el-button type="text" size="small" @click.stop="historyClick(scope.row)">操作历史</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="this.total">
        </el-pagination>
    
        <!--操作历史页面-->
        <el-dialog title="操作历史页面" v-model="history" :close-on-click-modal="false" size="full">
            <div v-for="itrms in this.historyCondition.historyList">
                <el-row class="mb20">
                    <el-col :span="5" class="history-Text">
                        {{itrms.gmtOperate}}
                    </el-col>
                    <el-col :span="3" class="history-Text">
                        {{itrms.operation}}
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8" class="history-MinText">
                        操作员：{{itrms.operator}}
                    </el-col>
                     <el-col :span="4" class="history-blueText">
                        原因：{{itrms.content}}
                    </el-col>
                </el-row>
            </div>
            <!--工具条-->
            <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="this.historyCondition.total">
            </el-pagination>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="history = false" size="large">取消</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<style scope lang="scss">
    .className{
        .history-Text {
        font-size: 20px;
    }

    .history-MinText {
        position: absolute;
        left: 224px;
        top:-7px;
    }
    .history-blueText{
        position: absolute;
        left: 224px;
        top:21px;
        color: #87CEFF;
    }
    }

</style>
<script>
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        return {
            history: false,
            pageSize: global.pageSize,
            currentPage: 1,
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            serviceName: "",
            total: 0,
            managerList: [], //服务管理列表展示
            historyCondition: {//历史详情
                id: "",
                currentPage: 1,
                historyList: [],
                total: 0,
            },

        }
    },
    methods: {
        //查询服务管理列表
        queryManagerList() {
            let args = [this.schoolCode, this.currentPage, this.pageSize];
            // console.log("1111111!!!"+args)
            request.addService.manager.query.queryManagerList(args).then((res) => {
                if (res.success === true) {
                    this.total = res.object.num;
                    this.managerList = res.object.list;
                    for (let i = 0; i < this.managerList.length; i++) {
                        this.managerList[i].status = this.changStatus(this.managerList[i].status);
                        this.managerList[i].gmtApply = this.changDate(this.managerList[i].gmtApply);
                        this.managerList[i].gmtApproval = this.changDate(this.managerList[i].gmtApproval);
                    }
                }
            });
        },
        //查看操作历史
        queryHistoryList(id) {
            let args = [id, this.historyCondition.currentPage, this.pageSize];
            // console.log("1111111!!!"+args)
            request.addService.manager.query.queryHistoryList(args).then((res) => {
                if (res.success === true) {
                    this.historyCondition.total = res.object.num;
                    this.historyCondition.historyList = res.object.list;
                    for (let i = 0; i < this.historyCondition.historyList.length; i++) {
                        this.historyCondition.historyList[i].gmtOperate = this.changDate(this.historyCondition.historyList[i].gmtOperate);
                    }
                }
            });
        },

        //分页
        handleCurrentChange(val) {
            if (this.history) {
                this.historyCondition.currentPage = val;
                queryHistoryList(this.historyCondition.id);
            } else {
                this.currentPage = val;
                this.queryManagerList();
            }

        },
        //状态转换
        changStatus(status) {
            let statusName = "";
            if (status == "to_do") {
                statusName = "审核中";
            } else if (status == "fail") {
                statusName = "审核失败";
            } else if (status == "normal") {
                statusName = "已开通";
            } else if (status == "stop") {
                statusName = "停止服务";
            }
            return statusName;
        },
        //时间转换
        changDate(dateString) {
            if (dateString == null) {
                return "";
            }
            let dateC = "";
            let date = new Date(dateString);
            let y = date.getFullYear();
            let m = date.getMonth() + 1;
            let d = date.getDate();
            let h = date.getHours();
            let M = date.getMinutes();
            dateC = y + "-" + m + "-" + d + " " + h + ":" + M;
            return dateC;
        },
        //点击查看历史
        historyClick(row) {
            this.history = true;
            this.queryHistoryList(row.id);
            this.historyCondition.id = row.id;
            //console.log(this.historyCondition.historyList+"!!!!")
        },

    },
    mounted() {
        this.queryManagerList();
    },
}
</script> 