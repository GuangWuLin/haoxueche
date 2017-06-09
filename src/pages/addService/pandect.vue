<template>
    <section class="className">
        <el-row>
            <a href="javascript:" v-for="item in pandectList" @click="detailClick(item.id,item.status,item.type)">
                <el-card class="box-card el-card__body">
                    <div style="color:'#1f2d3d'" v-bind:class="[item.status=='normal' ? kaitongClass : weikaitongClass ]">
                        <span v-if="item.type=='theory_education'" class="glyph-icon icon-lilunJiaoxue  icon-wenxin"></span>
                        <!--<span v-if="item.type='theory_education'" class="glyph-icon icon-wechat icon-wenxin"></span>-->
                        <span class="wenxin-text">{{item.name}}</span>
    
                    </div>
                    <div>
                        <div class="bottom clearfix weixin-contanier">
                            <p>{{item.description}}</p>
                            <div id="bb">
                                <el-button type="text" class="button">{{item.online?"前往开通":"暂未开放"}}</el-button>
                            </div>
                        </div>
                    </div>
                </el-card>
            </a>
        </el-row>
        <!--详情页面-->
        <el-dialog title="详情页面" v-model="detail" :close-on-click-modal="false" size="full">
            <el-row class="mb20">
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
                    <el-button :disabled="(pandectDetail.status=='normal'?true:false)" @click="applyClick" type="primary" size="large">立即申请</el-button>
                </el-col>
            </el-row>
            <el-row v-if="paymentType==='产品介绍'">
                产品介绍
            </el-row>
            <el-row v-if="paymentType==='使用场景'">
                使用场景
            </el-row>
            <el-row v-if="paymentType==='申请条件'">
                申请条件
            </el-row>
            <el-row v-if="paymentType==='关于费率'">
                关于费率
            </el-row>
            <el-row v-if="paymentType==='服务咨询'">
                服务咨询
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="detail = false" size="large">取消</el-button>
            </div>
        </el-dialog>
    
        <!--申请联系人信息-->
        <el-dialog title="申请人信息" v-model="apply" :close-on-click-modal="false" size="tiny">
            <el-row style="margin-top:60px">
                <el-form  :rules="validate" :model="applyCondition" label-width="70px" ref="applyRef">
                    <el-col :span="0">
                        <el-form-item label="姓名" prop="contactPerson">
                            <el-input style="width:250px;" v-model="applyCondition.contactPerson" placeholder="请输入姓名">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="常用邮箱" prop="email">
                            <el-input style="width:250px;" v-model="applyCondition.email" placeholder="常用邮箱">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="常用QQ" prop="qq">
                            <el-input style="width:250px;" v-model="applyCondition.qq" placeholder="常用QQ">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="手机号码" prop="telephone">
                            <el-input style="width:250px;" v-model="applyCondition.telephone" placeholder="手机号码">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="apply = false" size="large">取消</el-button>
                <el-button type="primary" size="large" @click="applyService">保存</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<style scope lang="scss">
.className{
    .box-card {
    width: 266px;
    float: left;
    margin: 10px;
    min-height: 160px;
    cursor: pointer;
}

.el-card__body {
    padding: 0px;
}

.weixin-contanier {
    height: 280px;
    padding: 0;
    text-align: center;
}

.kaitong {
    background: green;
    height: 135px;
    line-height: 100px;
    color: #fff;
    position: relative;
}

.weikaitong {
    background: gray;
    height: 135px;
    line-height: 100px;
    color: #fff;
    position: relative;
}

.icon-wenxin {
    position: absolute;
    top: 0px;
    left: 101px;
    font-size: 60px;
}

.wenxin-text {
    position: absolute;
    left: 105px;
    margin-top: 47px;
}

#bb {
    /*margin-bottom: 0;*/
    position: relative;
    bottom: -84%;
}

.text {
    height: 100px;
    width: 100px;
    background-color: red;
}
}

</style>
<script>
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        return {
            kaitongClass: 'kaitong',
            weikaitongClass: 'weikaitong',
            detail: false,
            apply: false,
            paymentType: '产品介绍',
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            pandectList: [],//总览列表
            pandectDetail: { //详情页
                id: "",
                status: "",
                type: "",

            },
            applyCondition: {//申请表单
                type: "",
                schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                contactPerson: "",
                email: "",
                qq: "",
                telephone: "",
            },
            validate:{
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
        applyClick() {
            this.apply = true;
            this.applyCondition.type = this.pandectDetail.type;
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
                            this.apply = false;
                            this.$message({ message: (res.object!=null?res.object:"") + "申请服务成功！", type: "success" });
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
    },
}
</script> 