<template>
    <section v-loading="pageLoading">
        <!--列表-->
        <el-row class="mb20">
            <el-button type="primary" @click="handleShowAddWin" class="right">添加新用户</el-button>
            <el-col :span="24" class="mt20">
                <!--列表-->
                <el-table :data="users">
                    <el-table-column prop="userId" label="用户ID">
                    </el-table-column>
                    <el-table-column prop="userName" label="用户名">
                    </el-table-column>
                    <el-table-column prop="gender" label="性别" :formatter="formatSex">
                    </el-table-column>
                    <el-table-column prop="idNumber" label="身份证">
                    </el-table-column>
                    <el-table-column prop="phone" label="电话">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="创建时间" :formatter="formatDate">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="text" size="small" @click.stop="editAuthority(scope.row)" :disabled="scope.row.isDisabled">编辑权限</el-button>
                            <el-button type="text" size="small" @click.stop="delUser(scope.row.userId)" :disabled="scope.row.isDisabled">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--添加新用户-->
                <el-dialog title="添加新用户" v-model="userFormVisible" :close-on-click-modal="false" size="full" @close="handleCloseDialog">
                    <el-form :model="userForm" :rules="userFormRules" ref="userForm" label-width="100px" :inline="true">
                        <p class="group-title">基本信息</p>
                        <el-form-item label="姓名" prop="name">
                            <el-input auto-complete="off" v-model="userForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="性别">
                            <el-select placeholder="请选择性别" v-model="userForm.gender" style="width:192px;">
                                <el-option label="男" value="MALE"></el-option>
                                <el-option label="女" value="FEMALE"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="身份证" prop="idNumber">
                            <el-input auto-complete="off" v-model="userForm.idNumber"></el-input>
                        </el-form-item>
                        <el-form-item label="QQ" prop="qq">
                            <el-input auto-complete="off" v-model="userForm.qq"></el-input>
                        </el-form-item>
                        <el-form-item label="用户名" prop="userName">
                            <el-input auto-complete="off" v-model="userForm.userName"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" v-model="userForm.password"></el-input>
                        </el-form-item>
                        <el-form-item label="地址" prop="address">
                            <el-input auto-complete="off" v-model="userForm.address" style="width:497px;"></el-input>
                        </el-form-item>
                        <div prop="photos">
                            <el-upload class="avatar-uploader" :action="fileUploadAction" :show-file-list="false" :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload" style="position: absolute;top: 70px;right: 40px;">
                                <img v-if="userForm.photos" :src="userForm.photos" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </div>
                        <p class="group-title">权限信息</p>
                        <el-tree :data="authority" show-checkbox node-key="id" :props="defaultProps" ref="authorityTree" @check-change="handleCheckChange"></el-tree>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="userFormVisible = false" size="large">取消</el-button>
                        <el-button type="primary" size="large" @click.native="create('userForm')">提交</el-button>
                    </div>
                </el-dialog>
                <!--编辑用户权限-->
                <el-dialog title="编辑权限" v-model="userEditFormVisible" :close-on-click-modal="false" size="full" @close="handleCloseDialog">
                    <el-input placeholder="输入关键字进行过滤" v-model="filterText" class="mt20 mb15"></el-input>
                    <el-tree :data="authority" show-checkbox node-key="id" :props="defaultProps" :default-checked-keys="defaultAuthority" ref="editAuthorityTree" :filter-node-method="filterNode" @check-change="handleCheckChange"></el-tree>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="userEditFormVisible = false" size="large">取消</el-button>
                        <el-button type="primary" size="large" @click.native="saveAuthority()">提交</el-button>
                    </div>
                </el-dialog>
                <!--支付密码（新增）-->
                <el-dialog title="设置支付密码" v-model="payFormVisible" :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false" custom-class="pay-form">
                    <el-alert title="勾选 [充值模块]，系统需要您设置支付密码，以保证账户资金安全" type="warning" show-icon class="mt20" :closable="false"></el-alert>
                    <el-form :model="payPwdForm" class="mt20" label-width="90px" :rules="payPwdRule" ref="payPwdForm">
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" placeholder="输入支付密码" v-model="payPwdForm.password"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="repeatPassword">
                            <el-input type="password" placeholder="再次输入支付密码" v-model="payPwdForm.repeatPassword"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="handleConfirm" size="large">取消</el-button>
                        <el-button type="primary" size="large" @click.native="savePayPassword()">确定</el-button>
                    </div>
                </el-dialog>
                <!--支付密码（编辑）-->
                <el-dialog title="设置支付密码" v-model="payEditFormVisible" :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false" custom-class="pay-form">
                    <el-alert title="勾选 [充值模块]，系统需要您设置支付密码，以保证账户资金安全" type="warning" show-icon class="mt20" :closable="false"></el-alert>
                    <el-form :model="payPwdForm" class="mt20" label-width="90px" :rules="payPwdRule" ref="payPwdForm">
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" placeholder="输入支付密码" v-model="payPwdForm.password"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="repeatPassword">
                            <el-input type="password" placeholder="再次输入支付密码" v-model="payPwdForm.repeatPassword"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="handleConfirmForEdit" size="large">取消</el-button>
                        <el-button type="primary" size="large" @click.native="editPayPassword()">确定</el-button>
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
        var validateRepeatPass = (rule, value, callback) => {
            if (value !== this.payPwdForm.password) {
                callback(new Error("两次输入密码不一致"));
            } else {
                callback();
            }
        };
        return {
            total: 0,
            users: [],
            args: [0, 1, 10],
            pageLoading: false,
            userFormVisible: false,
            fileUploadAction: request.baseUrl + "/file/uploadFile",
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            userForm: {
                schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                name: "",
                gender: "MALE",
                idNumber: "",
                qq: "",
                address: "",
                photos: "",
                userName: "",
                password: "",
                phone: "",
                authcodeLise: [],
                payPassword: ""
            },
            userFormRules: {
                name: [
                    { required: true, message: "请填写姓名", trigger: "blur" },
                    { min: 2, max: 5, message: "长度在2到5个字符", trigger: "blur" }
                ],
                gender: [
                    { required: true, message: "请选择性别", trigger: "change" }
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
                userName: [
                    { required: true, message: "输入电话号码，将作为登录帐号登录", trigger: "blur" },
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if (!global.fieldVerification.IsPhone(value)) {
                                return callback(new Error("电话格式不正确"));
                            }
                            else {
                                setTimeout(() => {
                                    this.getPhoneIsExists(value, function (exists) {
                                        if (!exists) {
                                            return callback(new Error("号码已存在，请重试"));
                                        }
                                        callback();
                                    });
                                }, 1000);
                            }
                        }, trigger: "change|blur"
                    }
                ],
                password: [
                    { required: true, message: "请填写密码", trigger: "blur" },
                    { min: 6, max: 12, message: "长度在6到12个字符", trigger: "blur" }
                ]
            },
            userEditFormVisible: false,
            userEditForm: {
                userId: 0,
                authcodeLise: []
            },
            userEditFormRules: {
            },
            provinceData: [],
            cityData: [],
            authority: [],
            defaultProps: {
                children: "children",
                label: "value"
            },
            filterText: "",
            defaultAuthority: [],
            payModelId: 0,
            payFormVisible: false,
            payPwdForm: {
                password: "",
                repeatPassword: ""
            },
            payPwdRule: {
                password: [
                    { required: true, message: "请输入支付密码", trigger: "blur" },
                    { min: 6, max: 12, message: "长度在 6 到 12 个字符之间", trigger: "change" }
                ],
                repeatPassword: [
                    { required: true, message: "请输入支付密码", trigger: "blur" },
                    { min: 6, max: 12, message: "长度在 6 到 12 个字符之间", trigger: "change" },
                    { validator: validateRepeatPass, trigger: "blur" }
                ]
            },
            payEditFormVisible: false,
            editPayPasswordForm: {
                userId: 0,
                userName: "",
                payPassword: ""
            },
            hasPay: 0
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
        formatOperator() {
            global.printLog("111");
        },
        //获取用户列表
        getUsers() {
            this.pageLoading = true;
            setTimeout(() => {
                request.systemSettings.users.queryInfo(this.args).then((res) => {
                    if (res.success === true) {
                        this.pageLoading = false;
                        let data = res.object;
                        this.total = data.num;
                        this.users = data.list;
                        let userId = JSON.parse(sessionStorage.getItem("user")).userId;
                        for (let item in this.users) {
                            if (this.users[item].userId === userId) {
                                this.users[item].isDisabled = true;
                            }
                            else {
                                this.users[item].isDisabled = false;
                            }
                        }
                    }
                });
            }, 1000);
        },
        //验证手机号是否已存在
        getPhoneIsExists(val, callback) {
            request.systemSettings.users.checkPhone(val).then((res) => {
                callback(res.success);
            });
        },
        handleShowAddWin() {
            this.userForm = {
                schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                name: "",
                gender: "MALE",
                idNumber: "",
                qq: "",
                address: "",
                photos: "",
                userName: "",
                password: "",
                phone: "",
                authcodeLise: [],
                payPassword: ""
            };
            this.userFormVisible = true
        },
        //添加新用户
        create(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.userForm.photos === "") {
                        this.$message.warning("请上传用户头像！");
                        return;
                    }
                    this.userForm.authcodeLise = [];
                    this.userForm.phone = this.userForm.userName;
                    let authority = this.$refs.authorityTree.getCheckedNodes();
                    let arrs = [];
                    for (var item in authority) {
                        arrs.push(authority[item].id, authority[item].firstLevel);
                    }
                    arrs = global.ArrayUnique(arrs);
                    for (var item in arrs) {
                        this.userForm.authcodeLise.push({ "authCode": arrs[item] });
                    }
                    //global.printLog(JSON.stringify(this.userForm.authcodeLise));

                    if (this.userForm.authcodeLise.length <= 0) {
                        this.$message.error("用户添加失败，原因：请至少选择一项功能！");
                        return;
                    }
                    let para = Object.assign({}, this.userForm);
                    request.systemSettings.users.create(para).then((res) => {
                        if (res.success === true) {
                            this.resetForm([formName]);
                            this.userFormVisible = false;
                            this.$refs.authorityTree.setCheckedKeys([]);
                            this.$message.success({ message: "用户添加成功！" });
                            this.getUsers();
                        }
                        else {
                            this.$message.error("用户添加失败，原因：" + res.message);
                        }
                    });
                }
            });
        },
        //翻页查询
        handlePageChange(val) {
            this.args[1] = val;
            this.getUsers();
        },
        //头像上传成功回调
        handleAvatarScucess(res, file) {
            if (res.success) {
                this.userForm.photos = res.object[0];
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
            });
        },
        //省份列表切换查询
        provinceChange(province) {
            this.getCity(province);
        },
        //编辑权限
        editAuthority(user) {
            this.userEditForm.userId = user.userId;
            this.editPayPasswordForm.userId = user.userId;
            this.editPayPasswordForm.userName = user.phone;
            request.systemSettings.users.functions.query(user.userId).then((res) => {
                if (res.success === true) {
                    this.defaultAuthority = [];
                    this.userEditFormVisible = true;
                    for (var item in res.object) {
                        if (res.object[item] === "206000") {//是否包含充值权限
                            this.hasPay = res.object[item]
                        }
                        this.defaultAuthority.push(res.object[item]);
                    }
                    if (this.$refs.editAuthorityTree) {
                        this.$refs.editAuthorityTree.setCheckedKeys(this.defaultAuthority);
                    }
                }
            });
        },
        savePayPassword() {
            this.$refs["payPwdForm"].validate((valid) => {
                if (valid) {
                    this.userForm.payPassword = this.payPwdForm.password;
                    //global.printLog(this.userForm);
                    this.payFormVisible = false;
                }
            });
        },
        //保存权限
        saveAuthority() {
            if (this.hasPay === 0) {
                let para_pay = Object.assign({}, this.editPayPasswordForm);
                request.systemSettings.users.updatePayPassword(para_pay).then((res) => {
                    if (res.success) {
                        global.printLog("has no");
                        updateAu(this);
                    }
                });
            }
            else {
                global.printLog("has");
                updateAu(this);
            }
            function updateAu(that) {
                let arrs = [];
                that.userEditForm.authcodeLise = [];
                let authority = that.$refs.editAuthorityTree.getCheckedNodes();
                for (var item in authority) {
                    arrs.push(authority[item].id, authority[item].firstLevel);
                }
                arrs = global.ArrayUnique(arrs);
                for (var item in arrs) {
                    that.userEditForm.authcodeLise.push({ "authCode": arrs[item] });
                }
                //global.printLog(that.userEditForm.authcodeLise);
                //return;
                if (that.userEditForm.authcodeLise.length <= 0) {
                    that.$message.error("用户添加失败，原因：请至少选择一项功能。");
                    return;
                }
                let para = Object.assign({}, that.userEditForm);
                request.systemSettings.users.functions.edit(para).then((res) => {
                    if (res.success) {
                        that.hasPay = 0;
                        that.userEditFormVisible = false;
                        that.resetForm(["editPayPasswordForm"]);
                        that.$message({ message: "权限编辑成功！", type: "success" });
                    }
                    else {
                        that.$message.error("权限编辑失败！");
                    }
                });
            }
        },
        //删除用户
        delUser(userId) {
            this.$confirm("您正在执行删除用户操作, 是否继续？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                request.systemSettings.users.del(userId).then((res) => {
                    if (res.success === true) {
                        this.getUsers();
                        this.$message({ message: "用户删除成功！", type: "success" });
                    }
                    else {
                        this.$message.error("用户删除失败！");
                    }
                });
            }).catch(() => { });
        },
        //权限筛选
        filterNode(value, data) {
            if (!value) return true;
            return data.value.indexOf(value) !== -1;
        },
        handleCheckChange(data, selfCheck) {
            if (data.value === "充值" && this.hasPay === 0) {
                if (selfCheck) {
                    this.payModelId = data.id;
                    if (this.editPayPasswordForm.userName === "") {
                        this.payFormVisible = true;
                    }
                    else {
                        this.payEditFormVisible = true;
                    }
                }
                else {
                    this.hasPay = 0;
                    this.payModelId = "";
                    this.resetForm(["payPwdForm"]);
                    this.userForm.payPassword = "";
                    this.editPayPasswordForm.payPassword = "";
                }
            }
        },
        editPayPassword() {
            this.$refs["payPwdForm"].validate((valid) => {
                if (valid) {
                    this.editPayPasswordForm.payPassword = this.payPwdForm.password;
                    this.payEditFormVisible = false;
                }
            });
        },
        handleConfirmForEdit() {
            this.$confirm("取消后，[充值模块] 会被关闭, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnClickModal: false,
                type: "warning"
            }).then(() => {
                this.resetForm(["payPwdForm"]);
                this.payEditFormVisible = false;
                this.editPayPasswordForm.payPassword = "";
                let authority = this.$refs.editAuthorityTree.getCheckedNodes();
                this.$refs.editAuthorityTree.setCheckedKeys([]);
                let resultsAuthority = [];
                for (var item in authority) {
                    if (this.payModelId !== authority[item].id) {
                        resultsAuthority.push({ id: authority[item].id, label: authority[item].value });
                    }
                }
                this.$refs.editAuthorityTree.setCheckedNodes(resultsAuthority);
            }).catch(() => {
            });
        },
        handleConfirm() {
            this.$confirm("取消后，[充值模块] 会被关闭, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnClickModal: false,
                type: "warning"
            }).then(() => {
                this.resetForm(["payPwdForm"]);
                this.userForm.payPassword = "";
                this.payFormVisible = false;
                let authority = this.$refs.authorityTree.getCheckedNodes();
                this.$refs.authorityTree.setCheckedKeys([]);
                let resultsAuthority = [];
                for (var item in authority) {
                    if (this.payModelId !== authority[item].id) {
                        resultsAuthority.push({ id: authority[item].id, label: authority[item].value });
                    }
                }
                this.$refs.authorityTree.setCheckedNodes(resultsAuthority);
            }).catch(() => {
            });
        },
        handleCloseDialog() {
            this.hasPay = 0;
            this.resetForm(["userForm", "payPwdForm", "editPayPasswordForm"]);
        },
        //重置表单数据
        resetForm(formNames) {
            for (var item in formNames) {
                try {
                    this.$refs[formNames[item]].resetFields();
                }
                catch (e) { }
            }
        }
    },
    //监听数据变化
    watch: {
        filterText(val) {
            this.$refs.editAuthorityTree.filter(val);
        },
        users() {
            //this.getUsers();
        }
    },
    created() {
        global.loadFunctions(1, (data) => {
            this.authority = data;
        });
    },
    activated() {
        global.printLog("activated every one");
        this.args[0] = this.schoolCode;
        this.getUsers();
        this.getProvince();
        this.userForm.schoolCode = this.schoolCode;
    },
    //页面挂载
    mounted() {
    }
}

</script>

<style lang="scss">
.userForm {
    input {
        width: 280px;
    }
}

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

.pay-form {
    width: 500px;
}
</style>