<template>
    <section v-loading="pageLoading">
        <el-row :gutter="10">
            <el-col :span="5">
                <el-input placeholder="根据单位名称过滤" class="mb10" v-model="filterText">
                </el-input>
    
                <el-tree class="filter-tree" :data="unitsOption" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="unitsOption" @node-click="nodeClick" :expand-on-click-node="false" :highlight-current="true" :default-expanded-keys="defaultExpandedKeys">
                </el-tree>
            </el-col>
            <el-col :span="19">
                <el-row class="mb10">
                    <el-date-picker v-model="pickTime" type="daterange" placeholder="选择制单日期范围" :editable="false" @change="handlePickTime">
                    </el-date-picker>
                </el-row>
                <el-table :data="receipts" @row-click="handleRowClick" :highlight-current-row="true">
                    <el-table-column prop="recCode" label="单据号" width="140">
                    </el-table-column>
                    <el-table-column prop="deptName" label="单位">
                    </el-table-column>
                    <!--<el-table-column prop="addUserName" label="制单人" width="120">
                    </el-table-column>
                    <el-table-column prop="accountName" label="资金账户">
                    </el-table-column>
                    <el-table-column prop="payTypeName" label="支付方式">
                    </el-table-column>-->
                    <el-table-column prop="cost" label="金额(元)">
                    </el-table-column>
                    <el-table-column prop="recTypeName" label="单据类型" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="制单日期" width="180">
                    </el-table-column>
                    <el-table-column prop="stateName" label="审核状态">
                    </el-table-column>
                    <el-table-column label="操作" width="120">
                        <template scope="scope">
                            <div v-if="scope.row.state===10">
                                <el-button type="text" size="small" @click.stop="handleCheck(scope.row.recId,30)">不通过</el-button>
                                <el-button type="text" size="small" @click.stop="handleCheck(scope.row.recId,20)">通过</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="total">
                </el-pagination>
            </el-col>
        </el-row>
        <el-dialog title="制单详情" v-model="receiptDetailFormVisible" :close-on-click-modal="false" size="full">
            <el-form v-model="recDetail" class="basic mt0 pt0 pb0">
                <el-row>
                    <el-col :span="10">
                        <p class="mt15">
                            <span>所属单位：{{recDetail.deptName}}</span>
                        </p>
                    </el-col>
                    <el-col :span="6">
                        <p class="mt15">
                            <span>制单人：{{recDetail.addUserName}}</span>
                        </p>
                    </el-col>
                    <el-col :span="7">
                        <p class="t-right">
                            <el-button type="danger" @click="handleCheck(recDetail.recId,30)" size="large" v-if="recDetail.state===10">不通过</el-button>
                            <el-button type="success" @click="handleCheck(recDetail.recId,20)" size="large" v-if="recDetail.state===10">通过</el-button>
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
                <el-table-column prop="gmtCreate" label="制单时间" width="180">
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                </el-table-column>
            </el-table>
            <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="detailTotal">
            </el-pagination>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="receiptDetailFormVisible = false" size="large" class="left">关闭</el-button>
                <el-button @click.native="printFinanceReceipt" size="large" type="primary">打印单据</el-button>
            </div>
        </el-dialog>
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
    </section>
</template>

<script>
import $ from "jquery";
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        return {
            financialVoucher: [],
            total: 0,
            detailTotal: 0,
            pageSize: global.pageSize,
            curDeptId: JSON.parse(sessionStorage.getItem("user")).deptId,
            pickTime: "",
            recDetail: {},
            receipts: [],
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            args: [1, 0, 0, 0, "", ""],
            receiptDetailData: [],
            receiptDetailFormVisible: false,
            curUnitName: "",
            unitsOption: [],
            defaultExpandedKeys: [],
            filterText: "",
            checkForm: {
                recId: 0,
                schoolCode: 0,
                checkUserId: JSON.parse(sessionStorage.getItem("user")).userId,
                checkUserName: JSON.parse(sessionStorage.getItem("user")).userName,
                state: 0
            },
            defaultProps: {
                children: "children",
                label: "label"
            },
            pageLoading: false,
            financialVoucherCurPage: 1,
            schoolName: JSON.parse(sessionStorage.getItem("user")).schoolName,
            userName: JSON.parse(sessionStorage.getItem("user")).userName
        }
    },
    methods: {
        printFinanceReceipt() {
            // global.printLog("print");
            // global.printLog(LODOP);
            // global.printLog(this.financialVoucher);
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
                                global.printLog("Value：" + Value);
                                this.updateReceiptsPrint(this.recDetail.recId, () => {
                                    this.financialVoucher = [];
                                    this.financialVoucherCurPage = 1;
                                    this.financialVoucher.push({ data: [] });
                                    this.queryRecStudentsDetailByPrint(this.financialVoucher[0]);
                                });
                            }
                        }
                    }
                };
                LODOP.PRINTA();
            }
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
        //获取单位
        queryUnits() {
            this.pageLoading = true;
            let para = this.curDeptId;
            setTimeout(() => {
                request.backstageManagement.department.query(para).then((res) => {
                    if (res.success) {
                        this.unitsOption = [];
                        let data = res.object;
                        for (var item in data) {
                            this.unitsOption.push(this.recursive(data[item]));
                        }
                        this.curUnitName = data[0].deptName;
                        this.queryReceipt();
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
        //获取已制单的学员详情
        queryRecStudentsDetail(curPage) {
            let para = [curPage, this.pageSize, this.recDetail.recId];
            request.backstageManagement.finance.query.RecDetail(para).then((res) => {
                if (res.success) {
                    let data = res.object;
                    this.detailTotal = data.num;
                    this.receiptDetailData = data.list;
                }
            });
        },
        //获取已制单的学员详情（打印专用）
        queryRecStudentsDetailByPrint(obj) {
            let para = [this.financialVoucherCurPage, 7, this.recDetail.recId];
            request.backstageManagement.finance.query.RecDetail(para).then((res) => {
                if (res.success) {
                    let data = res.object.list;
                    //global.printLog(data);
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
                        this.queryRecStudentsDetailByPrint(this.financialVoucher[this.financialVoucherCurPage - 1]);
                    }
                }
            });
        },
        calculateCost(data) {
            if (typeof (data) !== "undefined") {
                return data.toFixed(2);
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
        },
        //审核单据
        handleCheck(recId, state) {
            let that = this;
            if (state === 30) {
                this.$confirm("废除后无法恢复, 是否继续？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    check(recId, state);
                }).catch(() => { });
            }
            else {
                check(recId, state);
            }
            function check(recId, state) {
                that.checkForm.recId = recId;
                that.checkForm.state = state;
                that.checkForm.schoolCode = that.schoolCode;
                let para = Object.assign({}, that.checkForm);
                request.backstageManagement.finance.check.Receipts(para).then((res) => {
                    if (res.success) {
                        that.queryReceipt();
                        that.receiptDetailFormVisible = false;
                        that.$message({ message: "单据审核成功！", type: "success" });
                    }
                    else {
                        that.$message.error("单据审核失败！原因：" + res.message);
                    }
                });
            }
        },
        //单位树节点点击
        nodeClick(data) {
            this.curUnitName = data.label;
            let nodeid = data.value.split("&")[0];
            this.curDeptId = nodeid;
            this.queryReceipt();
        },
        //单位树节点筛选
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        //分页
        handleCurrentChange(val) {
            if (this.receiptDetailFormVisible) {
                this.queryRecStudentsDetail(val);
            }
            else {
                this.args[0] = val;
                this.queryReceipt();
            }
        },
        //已制单列表行点击
        handleRowClick(row) {
            this.recDetail = row;
            this.receiptDetailFormVisible = true;
            this.queryRecStudentsDetail(1);
            this.financialVoucher = [];
            this.financialVoucherCurPage = 1;
            this.financialVoucher.push({ data: [] });
            this.queryRecStudentsDetailByPrint(this.financialVoucher[0]);
        },
        //时间切换
        handlePickTime() {
            this.args[4] = this.pickTime[0] !== null ? this.pickTime[0].Format("yyyy-MM-dd") : "";
            this.args[5] = this.pickTime[1] !== null ? this.pickTime[1].Format("yyyy-MM-dd") : "";
            this.queryReceipt();
        },
        //重置表单数据
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    },
    watch: {
        filterText(val) {
            this.$refs.unitsOption.filter(val);
        }
    },
    activated() {
        this.financialVoucher = [];
        this.financialVoucherCurPage = 1;
        this.financialVoucher.push({ data: [] });
        this.curDeptId = JSON.parse(sessionStorage.getItem("user")).deptId;
        this.queryUnits();
    },
    mounted() {
    }
}

</script>