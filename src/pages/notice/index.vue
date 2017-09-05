<template>
    <section v-loading="pageLoading">
        <el-row class="mb20">
            <el-form :inline="true" :model="filters">
                <el-form-item class="left">
                    <el-date-picker v-model="filters.notice.datetime" type="daterange" placeholder="创建时间" :editable="false" @change="handleDateRangeChange"></el-date-picker>
                </el-form-item>
                <el-form-item class="left">
                    <el-input class="search-input mr10" v-model="filters.notice.keyword" placeholder="输入公告标题查询" icon="search" :on-icon-click="queryNotices"></el-input>
                </el-form-item>
                <el-form-item class="right">
                    <el-button type="primary" @click="addPublish" class="right">发布公告</el-button>
                </el-form-item>
                <el-form-item class="right">
                    <el-button type="primary" @click="noticeRead" :disabled="notices.readList.length?false:true">标记已读</el-button>
                </el-form-item>
            </el-form>
            <!--列表-->
            <el-table :data="notices.data" highlight-current-row @row-click="handleTableRowClick" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="35" align="left" :selectable="handleSelecTableChange">
                </el-table-column>
                <el-table-column label="标题" width="200" align="left" :show-overflow-tooltip="true">
                    <template scope="scope">
                        <p>
                            <em v-if="!scope.row.read" class="dot"></em>
                            {{scope.row.title}}
                        </p>
                    </template>
                </el-table-column>
                <el-table-column prop="content" label="内容" align="left" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="gmtCreate" label="创建时间" :formatter="formatter" width="300">
                </el-table-column>
            </el-table>
            <!--工具条-->
            <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="notices.total">
            </el-pagination>
            <!--发布公告-->
            <el-dialog title="发布公告" v-model="notices.publish.visible" :close-on-click-modal="false" size="small" custom-class="publishForm">
                <el-form v-if="notices.publish.visible" :model="notices.publish.forms" :rules="notices.publish.rules" ref="publishForm" label-width="90px" class="mt30">
                    <el-form-item label="公告标题" prop="title">
                        <el-input auto-complete="off" v-model="notices.publish.forms.title"></el-input>
                    </el-form-item>
                    <el-form-item label="公告内容" prop="content">
                        <el-input type="textarea" auto-complete="off" v-model="notices.publish.forms.content" :rows="5" resize="none"></el-input>
                    </el-form-item>
                    <el-form-item label="接收对象" class="customer">
                        <el-radio-group v-model="notices.publish.forms.customer">
                            <el-radio label="STUDENT">学员</el-radio>
                            <el-radio label="TEACHER">教练</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="notices.publish.visible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click.native="publishNotice" :loading="notices.publish.btnLoading">保存</el-button>
                </div>
            </el-dialog>
            <!--公告详情-->
            <el-dialog title="详情" v-model="notices.detail.visible" :close-on-click-modal="false" size="small">
                <el-form class="mt30">
                    <el-form-item label="标题">
                        {{notices.detail.title}}
                    </el-form-item>
                    <el-form-item label="内容">
                        {{notices.detail.content}}
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="large" @click.native="notices.detail.visible = false">关闭</el-button>
                </div>
            </el-dialog>
        </el-row>
    </section>
</template>

<script>
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        return {
            pageSize: 10,
            pageLoading: false,
            filters: {
                notice: {
                    keyword: "",
                    datetime: []
                }
            },
            notices: {
                data: [],
                total: 0,
                curPage: 1,
                readList: [],
                detail: {
                    visible: false,
                    title: "",
                    content: "",
                    date: ""
                },
                publish: {
                    visible: false,
                    forms: {
                        title: "",
                        content: "",
                        customer: "STUDENT",
                        schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode
                    },
                    btnLoading: false,
                    rules: {
                        title: [
                            { required: true, message: "请填写公告标题", trigger: "blur,change" },
                            { min: 2, max: 10, message: "标题长度在 2 到 10 个字符", trigger: "blur,change" }
                        ],
                        content: [
                            { required: true, message: "请填写公告内容", trigger: "blur,change" },
                            { min: 4, max: 200, message: "公告内容长度在 4 到 200 个字符", trigger: "blur,change" }
                        ]
                    }
                }
            },
            userId: JSON.parse(sessionStorage.getItem("user")).userId,
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode
        }
    },
    methods: {
        //格式化数据
        formatter(row, column) {
            if (column.property === "gmtCreate") {
                return new Date(row.gmtCreate).Format("yyyy-MM-dd HH:mm:ss");
            }
        },
        //查询公告列表
        queryNotices() {
            this.pageLoading = true;
            this.notices.readList = [];
            let beginTime = "";
            let endTime = "";
            if (this.filters.notice.datetime.length) {
                beginTime = new Date(this.filters.notice.datetime[0]).Format("yyyy-MM-dd") + " 00:00:00";
                endTime = new Date(this.filters.notice.datetime[1]).Format("yyyy-MM-dd") + " 23:59:59";
            }
            let para = [this.schoolCode, "INFORM", this.userId, "", "", this.notices.curPage, this.pageSize, this.filters.notice.keyword, beginTime, endTime];
            setTimeout(() => {
                request.notice.query.list(para).then((res) => {
                    this.pageLoading = false;
                    if (res.success) {
                        let data = res.object.list;
                        let total = res.object.num;
                        this.notices.data = data;
                        this.notices.total = total;
                    }
                });
            }, 500);
        },
        //公告置为已读
        noticeRead() {
            let para = [this.notices.readList.join(","), this.userId];
            request.notice.reading(para).then((res) => {
                this.pageLoading = false;
                if (res.success) {
                    this.$message.success("操作成功");
                    this.queryNotices();
                }
                else {
                    this.$message.error("操作失败");
                }
            });
        },
        //列表翻页查询
        handleCurrentChange(val) {
            this.notices.curPage = val;
            this.queryNotices();
        },
        //控制列表中复选框是否可选
        handleSelecTableChange(row) {
            return row.read ? false : true;
        },
        //选中需要已读的公告
        handleSelectionChange(data) {
            this.notices.readList = [];
            for (let item in data) {
                this.notices.readList.push(data[item].id);
            }
        },
        //点击公告列表查看详情
        handleTableRowClick(row, evt, column) {
            if (column.type === "default") {
                global.printLog(row);
                this.notices.detail = {
                    title: row.title,
                    content: row.content,
                    date: new Date(row.gmtCreate).Format("yyyy-MM-dd HH:mm:ss"),
                    visible: false
                }
                this.notices.detail.visible = true;
                //标记已读
                request.notice.reading([row.id, this.userId]).then((res) => {
                    if (res.success) {
                        row.read = true;
                    }
                });
            }
        },
        //打开发布公告窗体
        addPublish() {
            this.notices.publish.visible = true;
            this.notices.publish.forms.title = "";
            this.notices.publish.forms.content = "";
            this.notices.publish.forms.customer = "STUDENT";
        },
        //发布公告
        publishNotice() {
            this.$refs["publishForm"].validate((valid) => {
                if (valid) {
                    this.notices.publish.btnLoading = true;
                    let formData = Object.assign({}, this.notices.publish.forms);
                    global.printLog(JSON.stringify(formData));
                    request.notice.publish(formData).then((res) => {
                        this.notices.publish.btnLoading = false;
                        if (res.success) {
                            this.queryNotices();
                            this.notices.publish.visible = false;
                            this.$message.success("公告发布成功");
                        }
                        else {
                            this.$message.success("公告发布失败");
                        }
                    });
                }
            });
        },
        handleDateRangeChange(val) {
            if (val === "") {
                this.filters.notice.datetime = [];
            }
            this.queryNotices();
        }
    },
    activated() {
        global.printLog("activated every one");
        this.queryNotices();
    }
}
</script>