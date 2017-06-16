<template>
    <section class="finance-set" v-loading="pageLoading">
        <div class="row">
            <p>支付方式</p>
            <div class="dynamic">
                <el-tag :key="item" v-for="item in pay.elements" :closable="true" :close-transition="false" @close="handleClose(item,'pay')">
                    {{item.payTypeName}}
                </el-tag>
                <div v-if="pay.visible">
                    <el-input v-model="pay.value" ref="saveInput" placeholder="请输入支付方式">
                        <el-button type="primary" class="submit" @click="handleInputConfirm('pay')" slot="append">保存</el-button>
                    </el-input>
                </div>
                <el-button v-else size="small" @click="showInput('pay')" icon="plus">支付方式</el-button>
            </div>
        </div>
        <div class="row">
            <p>单据类型</p>
            <div class="dynamic">
                <el-tag :key="item" v-for="item in document.elements" :closable="true" :close-transition="false" @close="handleClose(item,'doc')">
                    {{item.recTypeName}}
                </el-tag>
                <div v-if="document.visible">
                    <el-input v-model="document.value" ref="saveInput" placeholder="请输入单据类型">
                        <el-button type="primary" class="submit" @click="handleInputConfirm('doc')" slot="append">保存</el-button>
                    </el-input>
                </div>
                <el-button v-else size="small" @click="showInput('doc')" icon="plus">单据类型</el-button>
            </div>
        </div>
        <div class="row">
            <p>资金账户</p>
            <div class="dynamic">
                <el-tag :key="item" v-for="item in account.elements" :closable="true" :close-transition="false" @close="handleClose(item,'acc')">
                    {{item.accountName}}
                </el-tag>
                <div v-if="account.visible">
                    <el-input v-model="account.value" ref="saveInput" placeholder="请输入资金账户">
                        <el-button type="primary" class="submit" @click="handleInputConfirm('acc')" slot="append">保存</el-button>
                    </el-input>
                </div>
                <el-button v-else size="small" @click="showInput('acc')" icon="plus">资金账户</el-button>
            </div>
        </div>
    </section>
</template>

<script>
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        return {
            pageLoading: false,
            pay: {
                elements: [],
                visible: false,
                value: ""
            },
            document: {
                elements: [],
                visible: false,
                value: ""
            },
            account: {
                elements: [],
                visible: false,
                value: ""
            },
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode
        };
    },
    methods: {
        //查询支付类型
        queryPayType() {
            this.pageLoading = true;
            setTimeout(() => {
                request.backstageManagement.finance.query.PayType(this.schoolCode).then((res) => {
                    if (res.success) {
                        this.pay.elements = [];
                        let objs = res.object;
                        for (let item in objs) {
                            this.pay.elements.push({
                                payTypeId: objs[item].payTypeId,
                                payTypeName: objs[item].payTypeName
                            });
                        }
                        this.pageLoading = false;
                    }
                });
            }, 1000);
        },
        //查询单据类型
        queryReceiptsType() {
            this.pageLoading = true;
            setTimeout(() => {
                request.backstageManagement.finance.query.ReceiptsType(this.schoolCode).then((res) => {
                    if (res.success) {
                        this.document.elements = [];
                        let objs = res.object;
                        for (let item in objs) {
                            this.document.elements.push({
                                recTypeId: objs[item].recTypeId,
                                recTypeName: objs[item].recTypeName
                            });
                        }
                        this.pageLoading = false;
                    }
                });
            }, 1000);
        },
        //查询资金账户
        queryAccount() {
            this.pageLoading = true;
            setTimeout(() => {
                request.backstageManagement.finance.query.Account(this.schoolCode).then((res) => {
                    if (res.success) {
                        this.account.elements = [];
                        let objs = res.object;
                        for (let item in objs) {
                            this.account.elements.push({
                                accountId: objs[item].accountId,
                                accountName: objs[item].accountName
                            });
                        }
                        this.pageLoading = false;
                    }
                });
            }, 1000);
        },
        createNew(para, target, callback) {
            para.schoolCode = this.schoolCode;
            if (target === "pay") {
                request.backstageManagement.finance.create.PayType(para).then((res) => {
                    if (res.success) {
                        global.printLog(res);
                        callback(res);
                        this.$message({ message: "支付方式自定义成功！", type: "success" });
                    }
                });
            }
            else if (target === "doc") {
                request.backstageManagement.finance.create.ReceiptsType(para).then((res) => {
                    if (res.success) {
                        callback(res);
                        this.$message({ message: "单据类型自定义成功！", type: "success" });
                    }
                });
            }
            else {
                request.backstageManagement.finance.create.Account(para).then((res) => {
                    if (res.success) {
                        global.printLog(res);
                        callback(res);
                        this.$message({ message: "资金账户自定义成功！", type: "success" });
                    }
                });
            }
        },
        delete(para, target, callback) {
            if (target === "pay") {
                request.backstageManagement.finance.delete.PayType(para).then((res) => {
                    if (res.success) {
                        callback(res.success);
                        this.$message({ message: "支付方式作废成功！", type: "success" });
                    }
                });
            }
            else if (target === "doc") {
                request.backstageManagement.finance.delete.ReceiptsType(para).then((res) => {
                    if (res.success) {
                        this.$message({ message: "支付方式作废成功！", type: "success" });
                        callback(res.success);
                    }
                });
            }
            else {
                request.backstageManagement.finance.delete.Account(para).then((res) => {
                    if (res.success) {
                        this.$message({ message: "支付方式作废成功！", type: "success" });
                        callback(res.success);
                    }
                });
            }
        },
        handleClose(item, target) {
            this.$confirm("废除后无法恢复, 是否继续？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                let obj = this.account.elements, id = item.accountId;
                if (target === "pay") {
                    id = item.payTypeId;
                    obj = this.pay.elements;
                }
                else if (target === "doc") {
                    id = item.recTypeId;
                    obj = this.document.elements;
                }
                this.delete(id, target, function (success) {
                    if (success) {
                        obj.splice(obj.indexOf(item), 1);
                    }
                });
            }).catch(() => { });
        },
        showInput(target) {
            if (target === "pay") {
                this.pay.visible = true;
            }
            else if (target === "doc") {
                this.document.visible = true;
            }
            else {
                this.account.visible = true;
            }
            this.$nextTick(_ => {
                this.$refs.saveInput.$refs.input.focus();
            });
        },
        handleInputConfirm(target) {
            let obj = this.account, value, para = { "accountName": obj.value };
            if (target === "pay") {
                obj = this.pay;
                para = { "payTypeName": obj.value };
            }
            else if (target === "doc") {
                obj = this.document;
                para = { "recTypeName": obj.value };
            }
            if (obj.value) {
                this.createNew(para, target, function (res) {
                    if (res.success) {
                        if (target === "pay") {
                            obj.elements.push({
                                "payTypeId": res.object,
                                "payTypeName": obj.value
                            });
                        }
                        else if (target === "doc") {
                            obj.elements.push({
                                "recTypeId": res.object,
                                "recTypeName": obj.value
                            });
                        }
                        else {
                            obj.elements.push({
                                "accountId": res.object,
                                "accountName": obj.value
                            });
                        }
                    }
                    obj.value = "";
                });
            }
            obj.visible = false;
        }
    },
    activated() {
        this.queryPayType();
        this.queryAccount();
        this.queryReceiptsType();
    },
    mounted() {
    }
}

</script>

<style lang="scss">
.finance-set {
    p {
        position: relative;
        top: -8px;
        display: inline-block;
        background: #fff;
        margin-left: 10px;
        font-size: 13px;
        overflow: hidden;
    }
    .row {
        border: 1px solid #d1dbe5;
        margin-bottom: 30px;
        .dynamic {
            padding: 0 10px 10px;
            position: relative;
            top: -8px;
            .el-input {
                width: 60%;
            }
            .el-tag {
                margin: 5px 10px 10px 0;
            }
            .el-button {
                color: #20a0ff;
                font-size: 1em;
                &.submit {
                    color: #fff;
                    border-color: #20a0ff;
                    background-color: #20a0ff;
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                }
            }
            .el-input-group__append,
            .el-input-group__prepend {
                border: 1px solid #20a0ff;
            }
        }
    }
}
</style>