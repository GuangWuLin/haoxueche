<template>
    <section v-loading="pageLoading">
        <!--列表-->
        <el-row class="mb20">
            <el-button type="primary" @click="branchSchoolFormVisible = true" class="right" :disabled="createBranchSchool">添加分校</el-button>
            <el-col :span="24" class="mt20">
                <!--列表-->
                <el-table :data="branchSchool">
                    <el-table-column prop="schoolName" label="分校名称">
                    </el-table-column>
                    <el-table-column prop="contact" label="分校负责人">
                    </el-table-column>
                    <el-table-column prop="schoolAddress" label="分校所属地址">
                    </el-table-column>
                </el-table>
                <!--添加分校-->
                <el-dialog title="添加分校" v-model="branchSchoolFormVisible" :close-on-click-modal="false" @close="dialogClose">
                    <el-form :model="branchSchoolForm" :rules="branchSchoolFormRules" ref="branchSchoolForm" label-width="100px" :inline="true" class="mt30">
                        <el-form-item label="姓名" prop="name">
                            <el-input auto-complete="off" v-model="branchSchoolForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="性别">
                            <el-select placeholder="请选择性别" v-model="branchSchoolForm.gender" style="width:192px;">
                                <el-option label="男" value="MALE"></el-option>
                                <el-option label="女" value="FEMALE"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="身份证" prop="idNumber">
                            <el-input auto-complete="off" v-model="branchSchoolForm.idNumber"></el-input>
                        </el-form-item>
                        <el-form-item label="电话" prop="phone">
                            <el-input auto-complete="off" v-model="branchSchoolForm.phone"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input auto-complete="off" v-model="branchSchoolForm.password" type="password"></el-input>
                        </el-form-item>
                        <el-form-item label="操作员住址" prop="address">
                            <el-input auto-complete="off" v-model="branchSchoolForm.address"></el-input>
                        </el-form-item>
                        <el-form-item label="驾校名称" prop="schoolName">
                            <el-input auto-complete="off" v-model="branchSchoolForm.schoolName"></el-input>
                        </el-form-item>
                        <el-form-item label="所在省" prop="province">
                            <el-select placeholder="请选择所在省" v-model="branchSchoolForm.province" style="width:192px;" @change="provinceChange">
                                <el-option v-for="item in provinceData" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所在市" prop="city">
                            <el-select placeholder="请选择所在市" v-model="branchSchoolForm.city" style="width:192px;" ref="city">
                                <el-option v-for="item in cityData" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="分校负责人" prop="contact">
                            <el-input auto-complete="off" v-model="branchSchoolForm.contact"></el-input>
                        </el-form-item>
                        <el-form-item label="分校地址" prop="schoolAddress">
                            <el-input auto-complete="off" v-model="branchSchoolForm.schoolAddress" style="width:497px;"></el-input>
                        </el-form-item>
                        <div prop="photos">
                            <el-upload class="avatar-uploader" :action="fileUploadAction" :show-file-list="false" :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload" style="position: absolute;top: 70px;right: 40px;">
                                <img v-if="branchSchoolForm.photos" :src="branchSchoolForm.photos" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </div>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="branchSchoolFormVisible = false" size="large">取消</el-button>
                        <el-button type="primary" size="large" @click.native="create('branchSchoolForm')">提交</el-button>
                    </div>
                </el-dialog>
            </el-col>
            <!--工具条-->
            <el-pagination class="mt20" layout="total,prev,pager,next,jumper" @current-change="handlePageChange" :page-size="10" :total="total">
            </el-pagination>
        </el-row>
    </section>
</template>

<script>
import $ from "jquery";
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        return {
            total: 0,
            args: [0, 1, 10],
            pageLoading: false,
            fileUploadAction: sessionStorage.getItem("baseUrl") + "/file/uploadFile",
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            branchSchool: [],
            branchSchoolFormVisible: false,
            branchSchoolForm: {
                name: "",
                idNumber: "",
                gender: "MALE",
                photos: "",
                phone: "",
                address: "",
                userName: "",
                password: "",
                schoolName: "",
                province: "",
                city: "",
                cityName: "",
                contact: "",
                schoolAddress: "",
                schoolCode: this.schoolCode
            },
            branchSchoolFormRules: {
                name: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if (!value) {
                                return callback(new Error("请填写分校操作员名称"));
                            }
                            if (!global.fieldVerification.IsChinese(value)) {
                                return callback(new Error("操作员名称格式不正确，只能为中文"));
                            }
                            callback();
                        }, trigger: "blur|change"
                    },
                    { max: 15, message: "名称长度不能超过15个中文", trigger: "blur" }
                ],
                idNumber: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if (!value) {
                                return callback(new Error("请填写身份证号"));
                            }
                            if (!global.fieldVerification.isIdCardNo(value)) {
                                return callback(new Error("身份证格式不正确"));
                            }
                            callback();
                        }, trigger: "blur|change"
                    }
                ],
                phone: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if (!value) {
                                return callback(new Error("请填写联系电话"));
                            }
                            if (!global.fieldVerification.IsPhone(value)) {
                                return callback(new Error("电话格式不正确"));
                            }
                            callback();
                        }, trigger: "blur|change"
                    }
                ],
                schoolName: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if (!value) {
                                return callback(new Error("请填写分校名称"));
                            }
                            if (!global.fieldVerification.IsChinese(value)) {
                                return callback(new Error("分校名称格式不正确，只能为中文"));
                            }
                            callback();
                        }, trigger: "blur|change"
                    },
                    { max: 20, message: "名称长度不能超过20个中文", trigger: "blur" }
                    // { min: 2, max: 5, message: "长度在2到5个字符", trigger: "blur" }
                ],
                contact: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if (!value) {
                                return callback(new Error("请填写分校负责人名称"));
                            }
                            if (!global.fieldVerification.IsChinese(value)) {
                                return callback(new Error("负责人名称格式不正确，只能为中文"));
                            }
                            callback();
                        }, trigger: "blur|change"
                    },
                    { max: 15, message: "名称长度不能超过15个中文", trigger: "blur" }
                    // { min: 2, max: 5, message: "长度在2到5个字符", trigger: "blur" }
                ],
                schoolAddress: [
                    { required: true, message: "请填写分校地址", trigger: "blur" }
                    // { min: 2, max: 5, message: "长度在2到5个字符", trigger: "blur" }
                ],
                password: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if (!value) {
                                return callback(new Error("请填写密码"));
                            }
                            //判断只能输入数字+字母
                            var reg = /(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]{6,16}/;
                            if (!reg.test(value)) {
                                return callback(new Error("密码必须是6到16个字母和数字组合"));
                            }
                            callback();
                        }, trigger: "blur"
                    }
                ],
                province: [
                    { required: true, message: "请选择所在省", trigger: "change" }
                ],
                city: [
                    { required: true, message: "请选择所在市", trigger: "change" }
                ]
            },
            provinceData: [],
            cityData: [],
            filterText: "",
            defaultAuthority: [],
            createBranchSchool: JSON.parse(sessionStorage.getItem("user")).parentSchoolCode === 0 ? false : true
        }
    },
    methods: {
        //性别显示转换
        formatSex(row, column) {
            return row.gender == "FEMALE" ? "女" : row.gender == "MALE" ? "男" : "未知";
        },
        //时间显示转换
        formatDate(row, column) {
            return new Date(row.gmtCreate).Format("yyyy-MM-dd HH:mm:ss");
        },
        //添加分校
        create(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.branchSchoolForm.photos === "") {
                        this.$message.warning("请上传头像！");
                        return;
                    }
                    this.branchSchoolForm.userName = this.branchSchoolForm.phone;
                    this.branchSchoolForm.cityName = this.$refs.city.selectedLabel;
                    let para = Object.assign({}, this.branchSchoolForm);
                    // global.printLog(para);
                    request.systemSettings.branchSchool.create.school(para).then((res) => {
                        if (res.success) {
                            this.getBranchSchool();
                            this.branchSchoolFormVisible = false;
                            this.$message({ message: "分校添加成功！", type: "success" });
                        }
                        else {
                            this.$message.error("分校添加失败，原因：" + res.message);
                        }
                    });
                }
            });
        },
        //获取分校列表
        getBranchSchool() {
            this.pageLoading = true;
            this.args[0] = this.schoolCode;
            setTimeout(() => {
                request.systemSettings.branchSchool.query.list(this.args).then((res) => {
                    if (res.success === true) {
                        this.pageLoading = false;
                        let data = res.object;
                        global.printLog(data);
                        this.total = data.num;
                        this.branchSchool = data.list;
                    }
                });
            }, 1000);
        },
        //翻页查询
        handlePageChange(val) {
            this.args[0] = this.schoolCode;
            this.args[1] = val;
            this.getBranchSchool();
        },
        //头像上传成功回调
        handleAvatarScucess(res, file) {
            if (res.success) {
                global.printLog(res);
                this.branchSchoolForm.photos = res.object[0];
            }
        },
        //头像上传前检测
        beforeAvatarUpload(file) {
            const validateType = file.type === "image/jpg" || file.type === "image/jpeg" || file.type === "image/png";
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!validateType) {
                this.$message.error("上传头像只能是 JPG 或 PNG 图片格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
            }
            return validateType && isLt2M;
        },
        //获取省份列表
        getProvince() {
            let that = this;
            global.getArea("", function (data) {
                that.provinceData = [];
                for (let item in data) {
                    that.provinceData.push({
                        label: data[item].name,
                        value: data[item].code
                    });
                }
            });
        },
        //获取市列表
        getCity(province) {
            let that = this;
            global.getArea(province, function (data) {
                that.cityData = [];
                for (let item in data) {
                    that.cityData.push({
                        label: data[item].name,
                        value: data[item].code
                    });
                }
                that.branchSchoolForm.city = that.cityData[0].value;
            });
        },
        //省份列表切换查询
        provinceChange(province) {
            this.getCity(province);
        },
        //权限筛选
        filterNode(value, data) {
            if (!value) return true;
            return data.value.indexOf(value) !== -1;
        },
        dialogClose() {
            this.resetForm("branchSchoolForm");
        },
        //重置表单数据
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    },
    activated() {
        global.printLog("activated every one");
        this.getProvince();
        this.getBranchSchool();
        this.branchSchoolForm.schoolCode = this.schoolCode;
    },
    //页面挂载
    mounted() {
    }
}

</script>

<style lang="scss">
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
}

.avatar {
    width: 100px;
    height: 100px;
    display: block;
}
</style>