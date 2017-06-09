<template>
    <section>
        <!--列表-->
        <el-row class="mb20" v-if="show==='list'">
            <el-col :span="24">
                <el-radio-group v-model="msgType">
                    <el-radio-button label="未读报警"></el-radio-button>
                    <el-radio-button label="已读报警"></el-radio-button>
                </el-radio-group>
            </el-col>
            <el-col :span="24" v-if="msgType==='未读报警'" class="mt20">
                <!--列表-->
                <el-table :data="alarms" highlight-current-row @row-click="rowClick">
                    <el-table-column prop="name" label="标题">
                    </el-table-column>
                    <el-table-column prop="phone" label="内容">
                    </el-table-column>
                    <el-table-column prop="carType" label="提交时间">
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col :span="24" v-if="msgType==='已读报警'" class="mt20">
                <!--列表-->
                <el-table :data="alarms" highlight-current-row @row-click="rowClick()">
                    <el-table-column prop="name" label="标题">
                    </el-table-column>
                    <el-table-column prop="phone" label="内容">
                    </el-table-column>
                    <el-table-column prop="carType" label="提交时间">
                    </el-table-column>
                </el-table>
            </el-col>
            <!--工具条-->
            <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="10" :total="total">
            </el-pagination>
        </el-row>
        <!--详情-->
        <el-row v-if="show==='details'">
            <!--面包屑-->
            <el-col :span="24" class="toolbar">
                <div class="el-breadcrumb breadcrumb-inner">
                    <span class="el-breadcrumb__item" @click="clickFunc"><span class="el-breadcrumb__item__inner">消息中心</span><span
                        class="el-breadcrumb__separator">/</span></span>
                    <span class="el-breadcrumb__item"><span class="el-breadcrumb__item__inner">系统消息</span><span class="el-breadcrumb__separator">/</span></span>
                </div>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import { getTeachersListPage } from "../../api/api";
    import { global } from "../../assets/javascript/global";
    export default {
        data() {
            return {
                page: 1,
                total: 0,
                alarms: [],
                msgType: "未读报警",
                show: "list"
            }
        },
        methods: {
            rowClick(row) {
                //this.show = "details";
                this.$router.push({ name: "报警详情", params: { id: row.id } });
                //this.$emit("child-emit", "报警详情");
            },
            getAlarms() {
                let para = {
                    page: this.page
                };
                getTeachersListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.alarms = res.data.users;
                });
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getAlarms();
            },
            clickFunc() {
                this.show = "list";
                this.getAlarms();
                //this.$router.push({ name: "系统消息" });
            }
        },
        ready() {
            alert(1);
        },
        mounted() {
            // let params = this.$route.params;
            // if (params.id) {
            //     this.show = "details";
            // }
            // else {
            //     this.show = "list";
            // }
            this.getAlarms();
        }
    }

</script>