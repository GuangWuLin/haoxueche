<template>
    <section>
        <!--工具条-->
        <el-row class="toolbar">
            <el-form :model="deviceCondition" :inline="true">
                <el-form-item class="normal">
                    <el-select placeholder="请选择设备类型" v-model="deviceCondition.type" @change="typeChange">
                        <el-option label="全部" value="1"></el-option>
                        <el-option label="设备" value="device"></el-option>
                        <el-option label="摄像头" value="camera"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="normal">
                    <el-select placeholder="请绑定教室" v-model="deviceCondition.used" @change="usedChange">
                        <el-option label="全部" value="1"></el-option>
                        <el-option label="已绑定" value="true"></el-option>
                        <el-option label="未绑定" value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="normal">
                    <el-input placeholder="请输入设备编号" v-model="deviceCondition.number" style="width:260px;">
                    </el-input>
                </el-form-item>
                <el-button type="primary" @click="queryDeviceList"> 查 询 </el-button>
                <el-button type="primary" @click="addDeviceClick" class="right"> 新 增 </el-button>
            </el-form>
        </el-row>
        <!--列表-->
        <el-table :data="deviceList">
            <el-table-column prop="number" label="设备编码"></el-table-column>
            <el-table-column prop="type" label="设备类型" :formatter="formatter"></el-table-column>
            <el-table-column prop="model" label="设备型号"></el-table-column>
            <el-table-column prop="manufacturer" label="厂商"></el-table-column>
            <el-table-column prop="bind" label="是否绑定教室" :formatter="formatter"></el-table-column>
            <el-table-column prop="gmtCreate" label="创建时间" :formatter="formatter"></el-table-column>
            <el-table-column prop="task" label="操作">
                <template scope="scope">
                    <el-button type="text" size="small" @click="updateDeviceClick(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="deleteDevice(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="total">
        </el-pagination>
        <!--新增设备-->
        <el-dialog title="新增设备" v-model="addDevice" :close-on-click-modal="false" size="tiny">
            <el-row style="margin-top:60px">
                <el-form :rules="validate" :model="addDeviceCondition" label-width="100px" ref="addDeviceRef">
                    <el-col :span="0">
                        <el-form-item label="设备类型" prop="type">
                            <el-select placeholder="请选择设备类型" v-model="addDeviceCondition.type" style="width:260px;">
                                <el-option label="设备" value="device"></el-option>
                                <el-option label="摄像头" value="camera"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="编号" prop="number">
                            <el-input style="width:260px;" v-model="addDeviceCondition.number" placeholder="请输入编号">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="型号">
                            <el-input style="width:260px;" v-model="addDeviceCondition.model" placeholder="请输入型号">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="生产厂家">
                            <el-input style="width:260px;" v-model="addDeviceCondition.manufacturer" placeholder="请输入生产厂家">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addDevice = false" size="large">取消</el-button>
                <el-button type="primary" size="large" @click="saveDevice">保存</el-button>
            </div>
        </el-dialog>
        <!--编辑设备-->
        <el-dialog title="编辑设备" v-model="updateDevice" :close-on-click-modal="false" size="tiny">
            <el-row class="mt20">
                <el-col>
                    <label>设备类型：{{this.updateDeviceCondition.typeName}}</label>
                </el-col>
            </el-row>
            <el-row class="mt20">
                <el-form :rules="validate" :model="updateDeviceCondition" label-width="70px" ref="updeatDeviceRef">
                    <el-col :span="0">
                        <el-form-item label="编号" prop="number">
                            <el-input style="width:250px;" v-model="updateDeviceCondition.number" placeholder="请输入编号">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="型号">
                            <el-input style="width:250px;" v-model="updateDeviceCondition.model" placeholder="请输入型号">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="生产厂家">
                            <el-input style="width:250px;" v-model="updateDeviceCondition.manufacturer" placeholder="请输入生产厂家">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addDevice = false" size="large">取消</el-button>
                <el-button type="primary" size="large" @click="updeatDevice">保存</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<style scope>

</style>
<script>
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        return {
            addDevice: false,
            updateDevice: false,
            pageSize: global.pageSize,
            currentPage: 1,
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            total: 0,
            deviceCondition: {//列表查询条件
                used: "1", //是否绑定
                type: "1", //类型(设备,摄像头)
                number: "",//型号
            },
            deviceList: [], //设备列表展示
            addDeviceCondition: {//新增表单
                schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                type: "", //设备类型
                number: "",//编号
                model: "",//型号
                manufacturer: "",//厂商
            },
            updateDeviceCondition: {//设备编辑表单
                id: "",
                type: "", //设备类型
                number: "",//编号
                model: "",//型号
                manufacturer: "",//厂商
            },
            validate: {
                type: [
                    { required: true, message: "请选择类型", trigger: "blur" }
                ],
                number: [
                    { required: true, message: "请输入编号", trigger: "blur" }
                ],
            },

        }
    },
    methods: {
        formatter(row, column) {
            if (column.property === "bind") {
                return row.bind ? "绑定" : "未绑定";
            }
            else if (column.property === "gmtCreate") {
                return new Date(row.gmtCreate).Format("yyyy-MM-dd HH:mm:ss");
            }
            else if (column.property === "type") {
                return row.type === "device" ? "设备" : "摄像头";
            }
        },
        //查询服务管理列表
        queryDeviceList() {
            let args = [this.schoolCode, this.deviceCondition.used, this.deviceCondition.type, this.deviceCondition.number, this.currentPage, this.pageSize];
            request.teaching.device.query.queryDeviceList(args).then((res) => {
                if (res.success === true) {
                    this.total = res.object.num;
                    this.deviceList = res.object.list;
                    console.log(this.deviceList);
                }
            });
        },
        //新增设备
        saveDevice() {
            this.$refs["addDeviceRef"].validate((valid) => {
                if (valid) {
                    let args = this.addDeviceCondition;
                    request.teaching.device.save.saveDevice(args).then((res) => {
                        if (res.success === true) {
                            this.addDevice = false;
                            this.queryDeviceList();
                            this.$message({ message: (res.object != null ? res.object : "") + "新增设备成功！", type: "success" });
                        } else {
                            this.$message.error("新增设备失败！" + res.message);
                        }
                    });
                }
            });
        },
        //删除按钮
        deleteDevice(row) {
            let args = [row.id];
            this.$confirm("您正在执行删除设备操作, 是否继续？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnClickModal: false,
                type: "warning"
            }).then(() => {
                request.teaching.device.delete.deleteDevice(args).then((res) => {
                    if (res.success === true) {
                        this.queryDeviceList();
                        this.$message({ message: (res.object != null ? res.object : "") + "删除设备成功！", type: "success" });
                    } else {
                        this.$message.error("删除设备失败！" + res.message);
                    }
                });
            }).catch(() => { });
        },
        //编辑按钮
        updeatDevice() {
            this.$refs["updeatDeviceRef"].validate((valid) => {
                if (valid) {
                    let args = {};
                    args.id = this.updateDeviceCondition.id;
                    args.number = this.updateDeviceCondition.number;
                    args.model = this.updateDeviceCondition.model;
                    args.manufacturer = this.updateDeviceCondition.manufacturer;
                    // console.log("1111111!!!"+args)
                    request.teaching.device.save.updeatDevice(args).then((res) => {
                        if (res.success === true) {
                            this.updateDevice = false;
                            this.queryDeviceList();
                            this.$message({ message: (res.object != null ? res.object : "") + "设备修改成功！", type: "success" });
                        } else {
                            this.$message.error("设备修改失败！" + res.message);
                        }
                    });
                }
            });
        },
        //下拉框改变
        typeChange() {
            this.queryDeviceList();
        },
        usedChange() {
            this.queryDeviceList();
        },
        //分页
        handleCurrentChange(val) {
            this.currentPage = val;
            this.queryDeviceList();
        },
        //设备类型转换
        changStatus(status) {
            let statusName = "";
            if (status == "device") {
                statusName = "设备";
            } else if (status == "camera") {
                statusName = "摄像头";
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
        //新增点击
        addDeviceClick() {
            this.addDevice = true;
            this.addDeviceCondition.type = "";
            this.addDeviceCondition.number = "";
            this.addDeviceCondition.model = "";
            this.addDeviceCondition.manufacturer = "";
        },
        //点击编辑按钮
        updateDeviceClick(row) {
            this.updateDevice = true;
            this.updateDeviceCondition.type = row.type;
            this.updateDeviceCondition.id = row.id;
            this.updateDeviceCondition.number = row.number;
            this.updateDeviceCondition.model = row.model;
            this.updateDeviceCondition.manufacturer = row.manufacturer;
            this.updateDeviceCondition.typeName = row.type === "device" ? "设备" : "摄像头";
        }
    },
    //页面激活之后
    activated() {
        this.queryDeviceList();
    },
    mounted() {
    }
}
</script> 