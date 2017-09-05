<template>
    <section v-loading="pageLoading">
        <el-row :gutter="10">
            <el-col :span="5">
                <el-input placeholder="根据单位名称过滤" class="mb10" v-model="filterText">
                </el-input>
    
                <el-tree class="filter-tree" :data="unitsOptionTree" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="unitsOptionTree" @node-click="nodeClick" :expand-on-click-node="false" :highlight-current="true" :default-expanded-keys="defaultExpandedKeys">
                </el-tree>
            </el-col>
            <el-col :span="19">
                <el-row class="mb10">
                    <el-date-picker v-model="pickTime" type="daterange" placeholder="选择日期范围" :editable="false" @change="handlePickTime">
                    </el-date-picker>
                    <el-button type="primary" @click="addReceiptFormVisible = true" size="large" class="right">
                        制单
                        <i class="el-icon-document el-icon--right"></i>
                    </el-button>
                </el-row>
                <el-table :data="receipts" @row-click="rowClick" :highlight-current-row="true">
                    <el-table-column prop="recCode" label="单据号">
                    </el-table-column>
                    <el-table-column prop="deptName" label="单位">
                    </el-table-column>
                    <el-table-column prop="cost" label="金额(元)">
                    </el-table-column>
                    <el-table-column prop="recTypeName" label="单据类型">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="制单日期" width="200">
                    </el-table-column>
                    <el-table-column prop="stateName" label="审核状态">
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="total">
                </el-pagination>
            </el-col>
            <el-dialog title="制单" v-model="addReceiptFormVisible" :close-on-click-modal="false" class="receipt-dialog" size="full" @close="dialogClose" @open="dialogOpen">
                <el-form :model="addReceiptForm" label-width="90px" class="mt20" ref="addReceiptForm" :inline="true" :rules="customerRules">
                    <el-form-item label="所属单位" prop="deptId" :rules="[{ required: true, message: '请选择所属单位', trigger: 'change' }]">
                        <el-cascader :options="unitsOptionCascader" :show-all-levels="false" @change="unitsOptionCascaderChange" :change-on-select="true" v-model="cascaderItem" :filterable="true"></el-cascader>
                    </el-form-item>
                    <el-form-item label="资金账户" prop="accountId" :rules="[{ type:'number', required: true, message: '请选择资金账户', trigger: 'change' }]">
                        <el-select placeholder="请选择资金账户" v-model="addReceiptForm.accountId" ref="" @change="">
                            <el-option v-for="item in accountOptions" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="支付方式" prop="payType" :rules="[{ type:'number', required: true, message: '请选择支付方式', trigger: 'change' }]">
                        <el-select placeholder="请选择支付方式" v-model="addReceiptForm.payType" ref="" @change="">
                            <el-option v-for="item in payTypeOptions" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="金额" prop="cost">
                        <el-input auto-complete="off" v-model="addReceiptForm.cost" :readonly="true"></el-input>
                    </el-form-item>
                    <el-form-item label="单据类型" prop="recType" :rules="[{ type:'number', required: true, message: '请选择单据类型', trigger: 'change' }]">
                        <el-select placeholder="请选择单据类型" v-model="addReceiptForm.recType" ref="" @change="">
                            <el-option v-for="item in receiptsTypeOptions" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="学员人数" prop="studentCount">
                        <el-input auto-complete="off" v-model="addReceiptForm.studentCount" :readonly="true"></el-input>
                    </el-form-item>
                    <el-form-item label="摘要" prop="remark">
                        <el-input type="textarea" auto-complete="off" v-model="addReceiptForm.remark" class="remark" resize="none"></el-input>
                    </el-form-item>
                    <div class="mb20 t-center">
                        <el-row>
                            <el-radio-group v-model="stuType" @change="stuTypeChange">
                                <el-radio-button label="现有学员"></el-radio-button>
                                <el-radio-button label="快速创建" :disabled="isQuickOpen"></el-radio-button>
                            </el-radio-group>
                        </el-row>
                    </div>
                    <!-- 现有学员 -->
                    <div v-if="stuType==='现有学员'">
                        <el-table :data="receiptsData.exist" @selection-change="handleSelectionChange" ref="myTable">
                            <el-table-column type="selection" width="55" :selectable="handleSelecTableChange" :reserve-selection="false">
                            </el-table-column>
                            <el-table-column prop="studentName" label="姓名">
                            </el-table-column>
                            <el-table-column prop="studentCarTypeName" label="车型">
                            </el-table-column>
                            <el-table-column prop="studentCardTypeName" label="证件类型">
                            </el-table-column>
                            <el-table-column prop="studentCardNo" label="证件号码" width="200">
                            </el-table-column>
                            <el-table-column prop="phone" label="电话号码">
                            </el-table-column>
                            <el-table-column prop="remark" label="备注">
                                <template scope="scope">
                                    <el-input v-model="scope.row.remark" auto-complete="off" placeholder="请填写备注"></el-input>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <!-- 快速创建学员 -->
                    <div v-if="stuType==='快速创建'">
                        <el-table :data="receiptsData.create" @selection-change="handleSelectionChange" ref="myTable">
                            <el-table-column type="selection" width="55" :selectable="handleSelecTableChange" :reserve-selection="false">
                            </el-table-column>
                            <el-table-column label="姓名">
                                <template scope="scope">
                                    <el-input v-model="scope.row.studentName" auto-complete="off" placeholder="请填写学员姓名"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="车型">
                                <template scope="scope">
                                    <el-select placeholder="请选择车型" v-model="scope.row.studentCarType" ref="addCarType" @change="carTypeOptionChange(scope.row)">
                                        <el-option v-for="item in carType.options" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="证件类型">
                                <template scope="scope">
                                    <el-select placeholder="请选择" v-model="scope.row.studentCardType">
                                        <el-option label="身份证" value="1"></el-option>
                                        <el-option label="护照" value="2"></el-option>
                                        <el-option label="军官证" value="3"></el-option>
                                        <el-option label="其他" value="4"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="证件号码">
                                <template scope="scope">
                                    <el-input v-model="scope.row.studentCardNo" auto-complete="off" @blur="handleSelecTableChange(scope.row)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="电话号码">
                                <template scope="scope">
                                    <el-input v-model="scope.row.phone" auto-complete="off" @blur="handleSelecTableChange(scope.row)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="备注">
                                <template scope="scope">
                                    <el-input v-model="scope.row.remark" auto-complete="off" placeholder="请填写备注"></el-input>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button class="mt15" @click="initCreating(false)">
                            添加行
                            <i class="el-icon-plus el-icon--right"></i>
                        </el-button>
                    </div>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addReceiptFormVisible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click="handleSave('save')">保存</el-button>
                    <el-button type="primary" size="large" @click="handleSave('saveAndPrint')">保存并打印</el-button>
                </div>
            </el-dialog>
            <el-dialog title="制单详情" v-model="receiptDetailFormVisible" :close-on-click-modal="false" size="full">
                <el-form v-model="recDetail" class="basic mt0 pt0 pb0">
                    <el-row>
                        <el-col :span="14">
                            <p class="mt15">
                                <span>所属单位：{{recDetail.deptName}}</span>
                            </p>
                        </el-col>
                        <el-col :span="4">
                            <p class="mt15">
                                <span>制单人：{{recDetail.addUserName}}</span>
                            </p>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5">
                            <span>资金账户：{{recDetail.accountName}}</span>
                        </el-col>
                        <el-col :span="5">
                            <span>支付方式：{{recDetail.payTypeName}}</span>
                        </el-col>
                        <el-col :span="4">
                            <span>总金额：{{recDetail.cost}}元</span>
                        </el-col>
                        <el-col :span="5">
                            <span>单据类型：{{recDetail.recTypeName}}</span>
                        </el-col>
                        <el-col :span="5">
                            <span>学员人数：{{detailTotal}}人</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <span>摘要：{{recDetail.remark}}</span>
                    </el-row>
                </el-form>
                <p class="group-title">学员明细</p>
                <el-table :data="receiptDetailData">
                    <el-table-column prop="studentName" label="姓名">
                    </el-table-column>
                    <el-table-column prop="studentCarTypeName" label="车型">
                    </el-table-column>
                    <el-table-column prop="cost" label="金额">
                    </el-table-column>
                    <el-table-column prop="studentCardTypeName" label="证件类型">
                    </el-table-column>
                    <el-table-column prop="studentCardNo" label="证件号码" width="200">
                    </el-table-column>
                    <el-table-column prop="phone" label="电话号码" width="140">
                    </el-table-column>
                    <el-table-column prop="gmtModify" label="制单时间" width="180">
                    </el-table-column>
                    <el-table-column prop="remark" label="备注">
                    </el-table-column>
                </el-table>
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="detailTotal">
                </el-pagination>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="receiptDetailFormVisible = false" size="large" class="left">关闭</el-button>
                    <el-button @click.native="printFinanceReceipt(recDetail.recId)" size="large" type="primary">打印单据</el-button>
                </div>
            </el-dialog>
        </el-row>
        <!-- 打印单据 -->
        <div v-for="(item,index) of financialVoucher" style="margin:0 auto;width:790px;font-family:宋体;position:relative;display:none;" :id="'print'+index">
            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496214844472&di=3d7055687020e5bdae4354878ecee808&imgtype=0&src=http%3A%2F%2Fpic.colipu.com%2FProductBigImage%2F1_1036600.jpg" style="position:absolute;top:170px;right:40px;width:194px;height:194px;background-size:cover" />
            <el-row>
                <h1 style="text-align:center;line-height:32px;font-size:1.5em;">{{schoolName+"收款凭证明细"}}</h1>
            </el-row>
            <el-row>
                <span style="float:left;line-height:40px;font-size:1.2em;">
                    <em style="font-weight:600;font-style:normal;">收款日期：</em>{{typeof(item.data[0])!=="undefined"?item.data[0].gmtModify:""}}</span>
                <span style="float:right;line-height:40px;font-weight:600;font-size:1.2em;margin-right:13px;">
                    <em style="font-size:1.2em;font-style:normal;margin-right:3px;">No</em>{{item.data.recCode}}</span>
            </el-row>
            <el-row style="min-height:200px;">
                <table cellpadding="0" cellspacing="0" width="99%" style="border:1px solid #000;text-align:center;line-height:22px;font-size:1.15em;">
                    <tr>
                        <td style="border-right:1px solid #000;font-weight:600;">总校/分校</td>
                        <td style="border-right:1px solid #000;font-weight:600;">姓名</td>
                        <td style="border-right:1px solid #000;font-weight:600;">证件号码</td>
                        <td style="border-right:1px solid #000;font-weight:600;">车型</td>
                        <td style="border-right:1px solid #000;font-weight:600;">余额</td>
                        <td style="border-right:1px solid #000;font-weight:600;">日期</td>
                        <td style="font-weight:600;border-right:0;width:100px;">备注</td>
                    </tr>
                    <tr v-for="child in item.data">
                        <td style="border-top:1px solid #000;border-right:1px solid #000;">{{child.deptName}}</td>
                        <td style="border-top:1px solid #000;border-right:1px solid #000;">{{child.studentName}}</td>
                        <td style="border-top:1px solid #000;border-right:1px solid #000;">{{child.studentCardNo}}</td>
                        <td style="border-top:1px solid #000;border-right:1px solid #000;">{{child.studentCarTypeName}}</td>
                        <td style="border-top:1px solid #000;border-right:1px solid #000;">￥{{child.cost}}</td>
                        <td style="border-top:1px solid #000;border-right:1px solid #000;">{{child.gmtModify}}</td>
                        <td style="border-top:1px solid #000;border-right:1px solid #000;border-right:0;">{{child.remark}}</td>
                    </tr>
                </table>
            </el-row>
            <el-row style="margin-top:10px;">
                <div style="float:left;">
                    <div>
                        <span style="font-weight:600;">经办人:</span>
                        <span style="padding-right:3px;border-bottom:1px solid #000;margin-right:5px;">{{userName}}</span>
                        <span style="font-weight:600;">收款人:</span>
                        <span style="display:inline-block;padding-right:3px;border-bottom:1px solid #000;min-width:60px;margin-right:5px;"></span>
                        <span style="font-weight:600;">付款人:</span>
                        <span style="display:inline-block;padding-right:3px;border-bottom:1px solid #000;min-width:60px;"></span>
                    </div>
                    <div style="font-size:14px;margin-top:5px;">
                        第 {{item.data.current}} 页 共 {{item.data.total}} 页 该单据于 {{new Date().Format("yyyy-MM-dd HH:mm:ss")}} 第 {{item.data.printCount+1}} 次打印
                    </div>
                </div>
                <div style="font-size:1.04em;float:right;margin-right:13px;">
                    <div>人数小计：{{item.data.length}}人</div>
                    <div>金额小计：￥{{calculateCost(item.data.totalCost)}}</div>
                </div>
            </el-row>
        </div>
        <div class="printer-win" v-if="printerWinShow">
            <div v-loading="true" element-loading-text="正在调起打印机..." class="win-inner"></div>
        </div>
    </section>
</template>

<script>
import $ from "jquery";
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        var validator = (rule, value, callback) => {
            let field = rule.field;
            if (field === "cost") {
                if (value < 1) {
                    return callback(new Error("金额必须大于0"));
                }
            }
            else if (field === "studentCount") {
                if (value < 1) {
                    return callback(new Error("学员人数不能为0"));
                }
            }
            callback();
        }
        return {
            total: 0,
            detailTotal: 0,
            pageSize: global.pageSize,
            stuType: "现有学员",
            curDeptId: JSON.parse(sessionStorage.getItem("user")).deptId,
            isQuickOpen: JSON.parse(sessionStorage.getItem("user")).parentSchoolCode === 0 ? false : true,
            curCost: 0,
            pickTime: "",
            recDetail: {},
            receipts: [],
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            args: [1, 0, 0, 0, "", ""],
            addReceiptFormVisible: false,
            receiptDetailFormVisible: false,
            carType: {
                options: [],
                costs: []
            },
            studentCarType: [],
            payTypeOptions: [],
            accountOptions: [],
            receiptsTypeOptions: [],
            receiptsData: {
                exist: [],
                create: []
            },
            addReceiptForm: {
                deptId: 0,
                schoolCode: 0,
                deptName: "",
                addUserId: JSON.parse(sessionStorage.getItem("user")).userId,
                addUserName: JSON.parse(sessionStorage.getItem("user")).userName,
                accountId: "",
                recType: "",
                studentCount: 0,
                cost: 0,
                payType: "",
                detailDOS: []
            },
            checkReceiptForm: {
                recId: 0,
                schoolCode: this.schoolCode,
                checkUserId: 0,
                checkUserName: "",
                state: 20
            },
            curUnitName: "",
            unitsOptionTree: [],
            unitsOptionCascader: [],
            defaultExpandedKeys: [],
            filterText: "",
            defaultProps: {
                children: "children",
                label: "label"
            },
            customerRules: {
                cost: [
                    { type: "number", required: true, validator: validator, trigger: "blur" }
                ],
                studentCount: [
                    { type: "number", required: true, validator: validator, trigger: "blur" }
                ]
            },
            cascaderItem: [],
            receiptDetailData: [],
            pageLoading: false,
            financialVoucher: [],
            financialVoucherCurPage: 1,
            printerWinShow: false,
            schoolName: JSON.parse(sessionStorage.getItem("user")).schoolName,
            userName: JSON.parse(sessionStorage.getItem("user")).userName
        }
    },
    methods: {
        //获取单位
        queryUnits(target) {
            this.pageLoading = true;
            let para = this.curDeptId;
            setTimeout(() => {
                request.backstageManagement.department.query(para).then((res) => {
                    if (res.success) {
                        if (target === "tree") {
                            this.unitsOptionTree = [];
                            let data = res.object;
                            for (var item in data) {
                                this.unitsOptionTree.push(this.recursive(data[item]));
                            }
                            this.queryReceipt();
                        }
                        else {
                            global.printLog("query cascader");
                            this.unitsOptionCascader = [];
                            let data = res.object;
                            for (var item in data) {
                                this.unitsOptionCascader.push(this.recursive(data[item]));
                            }
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
        //查询已制单据
        queryReceipt() {
            this.pageLoading = true;
            this.args[1] = this.pageSize;
            this.args[2] = this.schoolCode;
            this.args[3] = this.curDeptId;
            setTimeout(() => {
                request.backstageManagement.finance.query.Receipt(this.args).then((res) => {
                    if (res.success) {
                        this.pageLoading = false;
                        this.total = res.object.num;
                        this.receipts = res.object.list;
                    }
                });
            }, 500);
        },
        //查询支付方式
        queryPayType() {
            request.backstageManagement.finance.query.PayType(this.schoolCode).then((res) => {
                if (res.success) {
                    let data = res.object;
                    this.payTypeOptions = [];
                    for (let item in data) {
                        this.payTypeOptions.push({
                            label: data[item].payTypeName,
                            value: data[item].payTypeId
                        });
                    }
                    this.addReceiptForm.payType = data[0].payTypeId;
                }
            });
        },
        //查询资金帐户
        queryAccount() {
            request.backstageManagement.finance.query.Account(this.schoolCode).then((res) => {
                if (res.success) {
                    let data = res.object;
                    this.accountOptions = [];
                    for (let item in data) {
                        this.accountOptions.push({
                            label: data[item].accountName,
                            value: data[item].accountId
                        });
                    }
                    this.addReceiptForm.accountId = data[0].accountId;
                }
            });
        },
        //查询单据类型
        queryReceiptsType() {
            request.backstageManagement.finance.query.ReceiptsType(this.schoolCode).then((res) => {
                if (res.success) {
                    let data = res.object;
                    this.receiptsTypeOptions = [];
                    for (let item in data) {
                        this.receiptsTypeOptions.push({
                            label: data[item].recTypeName,
                            value: data[item].recTypeId
                        });
                    }
                    if (data.length) {
                        this.addReceiptForm.recType = data[0].recTypeId;
                    }
                }
            });
        },
        //获取车辆类型
        queryCarType() {
            this.carType.options = [];
            this.carType.costs = [];
            let para = [this.addReceiptForm.deptId, this.schoolCode];
            request.backstageManagement.finance.query.DeptCost(para).then((res) => {
                if (res.success) {
                    let data = res.object;
                    for (let item in data) {
                        this.carType.options.push({
                            label: data[item].carTypeName,
                            value: data[item].carType
                        });
                        this.carType.costs.push({
                            value: data[item].carType,
                            cost: data[item].managerCost
                        });
                    }
                }
            });
        },
        //获取需要制单的学员列表
        queryRecStudents() {
            let para = [this.addReceiptForm.deptId, this.schoolCode];
            request.backstageManagement.finance.query.RecStudentAll(para).then((res) => {
                if (res.success) {
                    let data = res.object;
                    this.receiptsData.exist = [];
                    for (let item in data) {
                        this.receiptsData.exist.push({
                            studentName: data[item].studentName,
                            studentCarType: data[item].studentCarType,
                            studentCarTypeName: data[item].studentCarTypeName,
                            studentCardType: data[item].studentCardType,
                            studentCardTypeName: data[item].studentCardTypeName,
                            studentCardNo: data[item].studentCardNo,
                            studentId: data[item].studentId,
                            phone: data[item].phone,
                            cost: data[item].cost,
                            remark: "",
                            isCheck: false
                        });
                    }
                }
            });
        },
        //获取已制单的学员详情
        queryRecStudentsDetail(curPage) {
            let para = [curPage, this.pageSize, this.recDetail.recId];
            request.backstageManagement.finance.query.RecDetail(para).then((res) => {
                if (res.success) {
                    let data = res.object;
                    this.detailTotal = data.num;
                    this.receiptDetailData = data.list;
                    this.financialVoucher = [];
                    this.financialVoucherCurPage = 1;
                    this.financialVoucher.push({ data: [] });
                    this.queryRecStudentsDetailByPrint(this.financialVoucher[0], this.recDetail.recId, "query");
                }
            });
        },
        //保存制单
        handleSave(target) {
            let array;
            this.$refs["addReceiptForm"].validate((valid) => {
                if (valid) {
                    if (this.stuType === "现有学员") {
                        array = this.receiptsData.exist.filter(function (item) { return item.isCheck; });
                    }
                    else {
                        array = this.receiptsData.create.filter(function (item) { return item.isCheck; });
                    }
                    array.forEach(function (item) { delete item.isCheck; });
                    this.addReceiptForm.detailDOS = array;
                    let para = Object.assign({}, this.addReceiptForm);
                    this.$nextTick(_ => {
                        this.$refs.myTable.clearSelection();
                    });
                    request.backstageManagement.finance.create.Receipt(para).then((res) => {
                        global.printLog(res);
                        if (res.success) {
                            this.resetForm("addReceiptForm");
                            this.addReceiptForm.deptName = "";
                            this.addReceiptFormVisible = false;
                            this.queryReceipt();
                            this.$message({ message: "制单成功！", type: "success" });
                            if (target === "saveAndPrint") {
                                this.financialVoucher = [];
                                this.financialVoucherCurPage = 1;
                                this.financialVoucher.push({ data: [] });
                                setTimeout(() => {
                                    this.printerWinShow = true;
                                    this.queryRecStudentsDetailByPrint(this.financialVoucher[0], res.object, target);
                                }, 1000);
                            }
                        }
                        else {
                            this.$message.error("制单失败，原因：" + res.message);
                        }
                    });
                }
            });
        },
        //单位级联选择器切换
        unitsOptionCascaderChange(item) {
            this.cascaderItem = item;
            if (!item.length) return;
            var len = item.length - 1;
            var value = item[len].split("&");
            this.addReceiptForm.deptId = value[0];
            this.addReceiptForm.deptName = value[1];
            this.curDeptId = value[0];
            this.queryCarType();
            this.queryRecStudents();
        },
        //单位树，点击
        nodeClick(data) {
            this.curUnitName = data.label;
            let nodeid = data.value.split("&")[0];
            this.curDeptId = nodeid;
            this.queryReceipt();
        },
        //单位树筛选
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        //已制单学员列表翻页
        handleCurrentChange(val) {
            if (this.receiptDetailFormVisible) {
                this.queryRecStudentsDetail(val);
            } else {
                this.args[0] = val;
                this.queryReceipt();
            }
        },
        //初始化快速创建学员列表
        initCreating(first) {
            if (first) {
                this.receiptsData.create = [];
            }
            for (var i = 0; i < 1; i++) {
                this.receiptsData.create.push({
                    studentName: "",
                    studentCarType: "",
                    // studentCarTypeName: "",
                    studentCardType: "",
                    // studentCardTypeName: "",
                    studentCardNo: "",
                    studentId: "",
                    phone: "",
                    cost: "",
                    remark: "",
                    isCheck: false
                });
            }
        },
        //快速创建/现有学员 类型切换
        stuTypeChange(val) {
            if (val === "快速创建") {
                this.initCreating(true);
            }
            else {
                this.queryRecStudents();
            }
            this.stuType = val;
            this.addReceiptForm.cost = 0;
        },
        //车型值切换
        carTypeOptionChange(row) {
            let carType = row.studentCarType;
            let costs = this.carType.costs;
            for (let item in costs) {
                if (costs[item].value === carType) {
                    row.cost = costs[item].cost;
                    this.curCost = row.cost;
                    break;
                }
            }
        },
        //列表中checkbox选中切换
        handleSelectionChange(data) {
            let cost = 0;
            for (let item in data) {
                cost = cost + data[item].cost;
                data[item].isCheck = true;
            }
            this.addReceiptForm.cost = cost;
            this.addReceiptForm.studentCount = data.length;
        },
        //根据输入值验证成功后启用列表中的checkbox
        handleSelecTableChange(row) {
            let isNull = false, cardNoVerify = true, phoneVerify = global.fieldVerification.IsPhone(row.phone);
            if (row.studentCardType === "1") {
                cardNoVerify = global.fieldVerification.isIdCardNo(row.studentCardNo);
            }
            if (row.studentName !== "" && row.studentCarType !== "" && row.studentCardType !== "" && row.studentCardNo !== "" && cardNoVerify && row.phone !== "" && phoneVerify && row.cost !== "") {
                isNull = true;
            }
            return isNull;
        },
        //时间切换
        handlePickTime() {
            this.args[4] = this.pickTime[0] !== null ? this.pickTime[0].Format("yyyy-MM-dd") : "";
            this.args[5] = this.pickTime[1] !== null ? this.pickTime[1].Format("yyyy-MM-dd") : "";
            this.queryReceipt();
        },
        //Dialog被关闭回调
        dialogClose() {
            global.printLog("closed");
            this.cascaderItem = [];
            this.stuType = "现有学员";
            this.receiptsData.exist = [];
            this.receiptsData.create = [];
            this.resetForm("addReceiptForm");
        },
        //Dialog被打开回调
        dialogOpen() {
            this.queryReceiptsType();
            global.printLog("opened");
            //this.queryUnits("cascader");
            $(".el-cascader-menus").css("z-index", "20002");
        },
        //已制单列表行点击
        rowClick(row) {
            this.recDetail = row;
            this.receiptDetailFormVisible = true;
            this.queryRecStudentsDetail(1);
        },
        //重置表单数据
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        //获取已制单的学员详情（打印专用）
        queryRecStudentsDetailByPrint(obj, recId, target) {
            let para = [this.financialVoucherCurPage, 7, recId];
            request.backstageManagement.finance.query.RecDetail(para).then((res) => {
                if (res.success) {
                    let data = res.object.list;
                    obj.data.totalCost = 0;
                    for (let item in data) {
                        obj.data.current = this.financialVoucherCurPage;
                        obj.data.total = res.object.totalPage;
                        obj.data.totalCost += data[item].cost;
                        obj.data.recCode = data[item].recCode;
                        obj.data.printCount = data[item].printCount;
                        obj.data.push({
                            deptName: data[item].deptName,
                            studentName: data[item].studentName,
                            studentCardNo: data[item].studentCardNo,
                            studentCarTypeName: data[item].studentCarTypeName,
                            cost: data[item].cost,
                            gmtModify: data[item].gmtModify.split(" ")[0],
                            remark: data[item].remark
                        });
                    }
                    if (this.financialVoucherCurPage < res.object.totalPage) {
                        this.financialVoucherCurPage++;
                        this.financialVoucher.push({ data: [] });
                        this.queryRecStudentsDetailByPrint(this.financialVoucher[this.financialVoucherCurPage - 1], recId, target);
                    }
                    if (target === "saveAndPrint") {
                        if (this.financialVoucherCurPage === res.object.totalPage) {
                            setTimeout(() => {
                                this.printFinanceReceipt(recId);
                            }, 1500);
                        }
                    }
                }
            });
        },
        calculateCost(data) {
            if (typeof (data) !== "undefined") {
                return data.toFixed(2);
            }
        },
        printFinanceReceipt(recId) {
            this.printerWinShow = false;
            let data = this.financialVoucher;
            for (let item in data) {
                LODOP.ADD_PRINT_HTM(0, 0, "99.5%", "100%", document.getElementById("print" + item).innerHTML);
                if (item < data.length - 1) {
                    LODOP.NEWPAGEA();
                }
            }
            LODOP.SET_PRINT_MODE("CATCH_PRINT_STATUS", true);
            if (LODOP.CVERSION) {
                LODOP.On_Return = (TaskID, Value) => {
                    LODOP.GET_VALUE("PRINT_STATUS_EXIST", Value);
                    if (LODOP.CVERSION) {
                        LODOP.On_Return = (TaskID, Value) => {
                            if (Value === "1") {
                                global.printLog(Value);
                                this.updateReceiptsPrint(recId, () => {
                                    this.financialVoucher = [];
                                    this.financialVoucherCurPage = 1;
                                    this.financialVoucher.push({ data: [] });
                                    this.queryRecStudentsDetailByPrint(this.financialVoucher[0], recId, "query");
                                });
                            }
                        }
                    }
                };
                LODOP.PRINTA();
            }
        },
        //更新打印次数
        updateReceiptsPrint(recId, callback) {
            let para = { recId: recId };
            request.backstageManagement.finance.edit.UpdateReceiptsPrint(para).then((res) => {
                if (!res.success) {
                    this.$message.error(res.message);
                }
                else {
                    callback();
                }
            });
        }
    },
    watch: {
        filterText(val) {
            this.$refs.unitsOptionTree.filter(val);
        },
        curCost(val) {
            this.addReceiptForm.cost = val;
        }
    },
    activated() {
        this.curDeptId = JSON.parse(sessionStorage.getItem("user")).deptId;
        this.queryUnits("tree");
        this.queryUnits("cascader");
        this.queryPayType();
        this.queryAccount();
        this.initCreating(true);
        this.addReceiptForm.schoolCode = this.schoolCode;
        this.financialVoucher = [];
        this.financialVoucherCurPage = 1;
        this.financialVoucher.push({ data: [] });
    },
    mounted() {
    }
}

</script>

<style lang="scss">
.receipt-dialog {
    .el-input {
        input {
            width: 220px;
        }
    }
    .remark textarea {
        width: 868px;
    }
    .el-table {
        .cell {
            input {
                width: 133px;
            }
        }
    }
}

.printer-win {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 99999;
    background: rgba(51, 51, 51, .4);
    .win-inner {
        position: absolute;
        width: 400px;
        height: 200px;
        left: 50%;
        top: 50%;
        margin-left: -200px;
        margin-top: -100px;
        background: #fff;
    }
}
</style>