<template>
    <section class="services">
        <el-row>
            <a class="box-card" href="javascript:" v-for="item in pandectList" @click="detailClick(item.id,item.status,item.type)">
                <div class="card-inner">
                    <div class="icon">
                        <em class="glyph-icon"></em>
                        <p>
                            <span>{{item.name}}</span>
                        </p>
                    </div>
                    <div class="description">
                        <p class="innner">
                            {{item.description}}
                        </p>
                        <div class="operation">
                            <el-button :plain="true" @click.stop="handleApply(item.type)">{{item.online?"前往开通":"暂未开放"}}</el-button>
                        </div>
                    </div>
                </div>
            </a>
        </el-row>
        <!--详情页面-->
        <el-dialog title="开通详情" v-model="detail" :close-on-click-modal="false" size="full">
            <el-row class="mb20 mt20">
                <el-col :span="17">
                    <el-radio-group v-model="paymentType" @change="paymentTypeChange">
                        <el-radio-button label="产品介绍"></el-radio-button>
                        <el-radio-button label="使用场景"></el-radio-button>
                        <el-radio-button label="申请条件"></el-radio-button>
                        <el-radio-button label="关于费率"></el-radio-button>
                        <el-radio-button label="服务咨询"></el-radio-button>
                    </el-radio-group>
                </el-col>
                <el-col :span="6">
                    <el-button :disabled="(pandectDetail.status!='normal'?true:false)" type="primary" size="large">已开通</el-button>
                    <el-button :disabled="(pandectDetail.status=='normal'?true:false)" @click="handleApply(pandectDetail.type)" type="primary" size="large">立即申请</el-button>
                </el-col>
            </el-row>
            <el-row v-show="paymentType==='产品介绍'">
                产品介绍
            </el-row>
            <el-row v-show="paymentType==='使用场景'">
                使用场景
            </el-row>
            <el-row v-show="paymentType==='申请条件'">
                申请条件
            </el-row>
            <el-row v-show="paymentType==='关于费率'">
                关于费率
            </el-row>
            <el-row v-show="paymentType==='服务咨询'">
                服务咨询
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="detail = false" size="large">取消</el-button>
            </div>
        </el-dialog>
        <!--申请联系人信息-->
        <el-dialog title="申请" v-model="applyVisible" :close-on-click-modal="false" size="tiny">
            <el-row class="mt20">
                <el-form v-if="applyVisible" :rules="validate" :model="applyCondition" label-width="88px" ref="applyRef">
                    <el-form-item label="姓名" prop="contactPerson">
                        <el-input v-model="applyCondition.contactPerson" placeholder="请输入姓名">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="常用邮箱" prop="email">
                        <el-input v-model="applyCondition.email" placeholder="常用邮箱">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="常用QQ" prop="qq">
                        <el-input v-model="applyCondition.qq" placeholder="常用QQ">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="telephone">
                        <el-input v-model="applyCondition.telephone" placeholder="手机号码">
                        </el-input>
                    </el-form-item>
                </el-form>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="applyVisible = false" size="large">取消</el-button>
                <el-button type="primary" size="large" @click="applyService">保存</el-button>
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
            kaitongClass: 'kaitong',
            weikaitongClass: 'weikaitong',
            detail: false,
            applyVisible: false,
            paymentType: '产品介绍',
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            pandectList: [],//总览列表
            pandectDetail: { //详情页
                id: "",
                status: "",
                type: "theory_education",

            },
            applyCondition: {//申请表单
                type: "",
                schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                contactPerson: "",
                email: "",
                qq: "",
                telephone: "",
            },
            validate: {
                contactPerson: [
                    { required: true, message: "请输入姓名", trigger: "blur" }
                ],
                email: [
                    { required: true, message: "请输入电子邮箱", trigger: "blur" }
                ],
                qq: [
                    { required: true, message: "请输入QQ号码", trigger: "blur" }
                ],
                telephone: [
                    { required: true, message: "请输入电话", trigger: "blur" }
                ],
            },
        }
    },
    methods: {
        //点击查看详情页面
        detailClick(id, status, type) {
            this.detail = true;
            this.pandectDetail.id = id;
            this.pandectDetail.status = status;
            this.pandectDetail.type = type;
        },
        //详情页面改变
        paymentTypeChange() {
        },
        //点击申请
        handleApply(type) {
            global.printLog(type);
            this.applyVisible = true;
            this.applyCondition.type = type;
            this.applyCondition.contactPerson = "";
            this.applyCondition.email = "";
            this.applyCondition.qq = "";
            this.applyCondition.telephone = "";
        },
        //获取服务总览列表
        queryPandectList() {
            let args = [this.schoolCode];
            request.addService.pandect.query.queryPandectList(args).then((res) => {
                if (res.success === true) {
                    global.printLog(res);
                    this.pandectList = res.object;
                }
            });
        },
        //申请增值服务(保存按钮)
        applyService() {
            this.$refs["applyRef"].validate((valid) => {
                if (valid) {
                    let args = this.applyCondition;
                    request.addService.pandect.save.applyService(args).then((res) => {
                        if (res.success === true) {
                            this.applyVisible = false;
                            this.$message({ message: (res.object != null ? res.object : "") + "申请服务成功！", type: "success" });
                        } else {
                            this.$message.error("申请服务失败！" + res.message);
                        }
                    });
                }
            });
        },

    },
    mounted() {
        this.queryPandectList();
    }
}
</script> 

<style scope lang="scss">
.services {
    a.box-card {
        width: 220px;
        margin: 20px;
        float: left;
        .card-inner {
            width: 220px;
            position: relative;
            box-shadow: 0 0 6px 0 rgba(0, 0, 0, .04);
            .icon {
                width: 220px;
                height: 112px;
                display: table-cell;
                vertical-align: middle;
                text-align: center;
                background-color: #20A0FF;
                border: 1px solid #20A0FF;
                color: #fff;
                .glyph-icon {
                    float: none;
                    font-size: 2em;
                    margin-right: 0;
                    margin-bottom: 2px;
                }
                >em:before {
                    display: block;
                    content: "\e7b6";
                }
                >p {
                    display: block;
                    font-weight: 600;
                    font-family: "Arial";
                    font-size: 1.1em;
                }
            }
            .description {
                position: relative;
                top: 0;
                bottom: 50px;
                border: 1px solid #E1E6EB;
                .innner {
                    margin: 20px;
                    overflow: auto;
                    word-wrap: break-word;
                    height: 100px;
                    color: #61646D;
                    font-size: 1.13em;
                }
                .operation {
                    width: 100%;
                    height: 40px;
                    text-align: center;
                    margin-bottom: 10px;
                    .el-button {
                        padding: 8px 15px;
                        color: #20A0FF;
                        border: 1px solid #20A0FF;
                        border-radius: 2px;
                    }
                }
            }
        }
    }
}
</style>