<template>
    <!-- 此页面暂时废掉 -->
    <section>
        <el-row>
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input class="search-input mr40" v-model="filters.name" placeholder="输入教练姓名、电话" icon="search" :on-icon-click="getTeachers"></el-input>
                    </el-form-item>
                </el-form>
                <!--列表-->
                <el-table :data="teachers" highlight-current-row @row-click="rowClick(1)">
                    <el-table-column type="selection" width="35">
                    </el-table-column>
                    <el-table-column prop="name" label="姓名">
                    </el-table-column>
                    <el-table-column prop="phone" label="性别">
                    </el-table-column>
                    <el-table-column prop="carType" label="电话">
                    </el-table-column>
                    <el-table-column prop="school" label="准教车型">
                    </el-table-column>
                    <el-table-column prop="cashType" label="准驾车型">
                    </el-table-column>
                    <el-table-column prop="trainingType" label="身份证">
                    </el-table-column>
                    <el-table-column prop="appointNumber" label="驾驶证初领日期">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="text" size="small" @click.stop="coachNewClass()">报班</el-button>
                            <el-button type="text" size="small" @click.stop="coachLeave()">请假</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="10" :total="total">
                </el-pagination>
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
            teachers: [],
            filters: {
                name: ""
            }
        }
    },
    methods: {
        getTeachers() {
            let para = {
                page: this.page,
                name: this.filters.name
            };
            getTeachersListPage(para).then((res) => {
                this.total = res.data.total;
                this.teachers = res.data.users;
            });
        },
        rowClick(target) {

        },
        handleCurrentChange(val) {
            this.page = val;
            this.getTeachers();
        }
    },
    mounted() {
        setTimeout(() => {
            this.getTeachers();
        }, 400);
    }
}

</script>