<template>
    <section class="className">
        <!--列表-->
        <el-table :data="managerList">
            <el-table-column prop="attachService.name" label="理论教学"></el-table-column>
            <el-table-column prop="gmtApply" label="申请时间" :formatter="formatter"></el-table-column>
            <el-table-column prop="gmtApproval" label="完成时间" :formatter="formatter"></el-table-column>
            <el-table-column prop="status" label="状态" :formatter="formatter"></el-table-column>
            <el-table-column prop="task" label="操作">
                <template scope="scope">
                    <el-button type="text" size="small" @click.stop="historyClick(scope.row)">操作历史</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="total">
        </el-pagination>
        <!--操作历史页面-->
        <el-dialog title="操作历史" v-model="historyVisible" :close-on-click-modal="false" size="full">
            <el-row class="history-list">
                <div class="el-steps is-vertical">
                    <div class="el-step is-vertical" v-for="item in history.list">
                        <div class="el-step__head is-wait is-text">
                            <div class="el-step__line is-vertical">
                                <i class="el-step__line-inner"></i>
                            </div>
                        </div>
                        <div class="el-step__main">
                            <div class="el-step__title is-wait">
                                {{item.gmtOperateDate}}
                            </div>
                        </div>
                        <div class="el-step_description">
                            <div class="el-step__title is-wait">
                                <p class="description-title">
                                    恢复服务
                                    <em>{{item.gmtOperateTime}}</em>
                                </p>
                                <p class="description-operator">
                                    操作员：{{item.operator}}
                                </p>
                                <p class="description-reason">
                                    原因：{{item.content}}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </el-row>
            <!--工具条-->
            <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="history.total">
            </el-pagination>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="historyVisible = false" size="large">关闭</el-button>
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
            historyVisible: false,
            pageSize: global.pageSize,
            currentPage: 1,
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            serviceName: "",
            total: 0,
            managerList: [], //服务管理列表展示
            history: {//历史详情
                id: "",
                currentPage: 1,
                list: [],
                total: 0,
            },

        }
    },
    methods: {
        formatter(row, column) {
            if (column.property === "gmtApply") {
                return new Date(row.gmtApply).Format("yyyy-MM-dd HH:mm:ss");
            }
            else if (column.property === "gmtApproval") {
                return new Date(row.gmtApproval).Format("yyyy-MM-dd HH:mm:ss");
            }
            else if (column.property === "status") {
                return global.enums.services.status[row.status];
            }
        },
        //查询服务管理列表
        queryManagerList() {
            let args = [this.schoolCode, this.currentPage, this.pageSize];
            request.addService.manager.query.managerList(args).then((res) => {
                if (res.success === true) {
                    this.total = res.object.num;
                    this.managerList = res.object.list;
                }
            });
        },
        //查看操作历史
        queryHistoryList(id) {
            let args = [id, this.history.currentPage, this.pageSize];
            // console.log("1111111!!!"+args)
            request.addService.manager.query.queryHistoryList(args).then((res) => {
                if (res.success === true) {
                    this.history.list = [];
                    let data = res.object.list;
                    this.history.total = res.object.num;
                    for (let item in data) {
                        this.history.list.push({
                            id: data[item].id,
                            content: data[item].content,
                            operation: data[item].operation,
                            operator: data[item].operator,
                            gmtOperateDate: new Date(data[item].gmtOperate).Format("yyyy-MM-dd"),
                            gmtOperateTime: new Date(data[item].gmtOperate).Format("HH:mm:ss"),
                            serviceId: data[item].serviceId
                        })
                    }
                    console.log(data);
                }
            });
        },

        //分页
        handleCurrentChange(val) {
            if (this.historyVisible) {
                this.history.currentPage = val;
                queryHistoryList(this.history.id);
            } else {
                this.currentPage = val;
                this.queryManagerList();
            }

        },
        //点击查看历史
        historyClick(row) {
            this.historyVisible = true;
            this.queryHistoryList(row.id);
            this.history.id = row.id;
        },

    },
    mounted() {
        this.queryManagerList();
    },
}
</script>

<style scope lang="scss">
.history-list {
    .el-steps {
        margin: 20px;
        font-size: 0;
        .el-step__title {
            line-height: 6px;
            color: #1F2D3D;
            font-weight: 600;
            font-size: 16px;
        }
        .el-step {
            position: relative;
            vertical-align: top;
            margin-right: 0px;
            min-height: 100px;
            padding-bottom: 20px;
        }
        .el-step__head {
            width: 2px;
            height: 2px;
            &.is-text.is-wait {
                color: #E1E6EB;
                border-color: #E1E6EB;
                background-color: #E1E6EB;
            }
            .el-step__line {
                background-color: #E1E6EB;
            }
        }
        .el-step__line.is-vertical {
            top: 6px;
            left: 2px;
        }
        .el-step__icon {
            line-height: 2px;
            >* {
                display: none;
            }
        }
        .el-step_description {
            position: absolute;
            left: 140px;
            top: 0;
            margin-left: 0;
            .description-title {
                >em {
                    font-size: 13px;
                    font-weight: normal;
                    font-style: normal;
                }
            }
            .description-operator,
            .description-reason {
                font-size: 13px;
                margin-top: 20px;
                font-weight: normal;
            }
            .description-reason {
                color: #20A0FF;
            }
        }
    }
}

.className {
    .history-Text {
        font-size: 20px;
    }

    .history-MinText {
        position: absolute;
        left: 224px;
        top: -7px;
    }
    .history-blueText {
        position: absolute;
        left: 224px;
        top: 21px;
        color: #87CEFF;
    }
}
</style>