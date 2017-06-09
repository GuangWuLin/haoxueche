<template>
    <section>
        <el-button type="primary" @click="print" class="mr10 right hide">打印</el-button>
        <div v-for="(item,index) of results" style="margin:0 auto;width:790px;font-family:宋体;position:relative;display:none;" :id="'printHtml'+index">
            <img :src="chapterPic" style="position:absolute;top:200px;right:40px;width:194px;height:194px;background-size:cover" />
            <el-row>
                <h1 style="text-align:center;line-height:50px;font-size:1.35em;margin-bottom:10px;">{{schoolName+"收款凭证明细"}}</h1>
            </el-row>
            <el-row>
                <span style="float:left;line-height:30px;font-size:1.2em;text-indent:15px;">
                    <em style="font-weight:600;font-style:normal;">收款日期：</em>{{typeof(item.data[0])!=="undefined"?item.data[0].gmtModify:""}}</span>
                <span style="float:right;line-height:30px;font-weight:600;font-size:1.2em;margin-right:13px;">
                    <em style="font-size:1.2em;font-style:normal;margin-right:3px;">No</em>{{item.data.recCode}}</span>
            </el-row>
            <el-row style="min-height:210px;">
                <table cellpadding="0" cellspacing="0" width="99%" style="border:1px solid #000;text-align:center;line-height:22px;margin-bottom:10px;font-size:1.15em;">
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
            <el-row style="text-indent:10px;">
                <div style="float:left">
                    <p style="font-size:1.1em;">
                        <span style="font-weight:600;">经办人:</span>
                        <span style="padding-right:3px;border-bottom:1px solid #000;margin-bottom:10px;margin-right:5px;">{{userName}}</span>
                        <span style="font-weight:600;">收款人:</span>
                        <span style="display:inline-block;padding-right:3px;border-bottom:1px solid #000;min-width:60px;margin-right:5px;"></span>
                        <span style="font-weight:600;">付款人:</span>
                        <span style="display:inline-block;padding-right:3px;border-bottom:1px solid #000;min-width:60px;"></span>
                    </p>
                    <p>
                        第 {{item.data.current}} 页 共 {{item.data.total}} 页 该单据于 {{new Date().Format("yyyy-MM-dd HH:mm:ss")}} 第 {{item.data.printCount+1}} 次打印
                    </p>
                </div>
                <div style="font-size:1.04em;float:right;margin-right:13px;">
                    <p>人数小计：{{item.data.length}}人</p>
                    <p>金额小计：￥{{calculateCost(item.data.totalCost)}}</p>
                </div>
            </el-row>
        </div>
        <div style="margin:50px auto;width:790px;font-family:宋体;position:relative;display:none;" ref="printHtml111">
            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496214844472&di=3d7055687020e5bdae4354878ecee808&imgtype=0&src=http%3A%2F%2Fpic.colipu.com%2FProductBigImage%2F1_1036600.jpg" style="position:absolute;top:120px;right:110px;width:194px;height:194px;background-size:cover" />
            <el-row>
                <h1 style="text-align:center;line-height:30px;font-size:1.8em;">{{financialToll.unitTile}}</h1>
            </el-row>
            <el-row>
                <span style="float:left;line-height:30px;font-size:1.35em;text-indent:45px;">
                    <em style="font-weight:600;font-style:normal;">收款日期：</em>{{financialToll.receiptDate}}</span>
                <span style="float:right;line-height:30px;font-weight:600;font-size:1.3em;">
                    <em style="font-size:1.4em;font-style:normal;margin-right:3px;">No</em>{{financialToll.receiptNumber}}</span>
            </el-row>
            <el-row>
                <div style="display:box;display:-webkit-box;">
                    <div style="width:40px;font-size:2em;text-align:center;padding-top:70px;font-weight:600;">
                        收款凭证
                    </div>
                    <div style="border:2px solid #000;box-flex:1;-webkit-box-flex: 1;padding:1px;">
                        <div style="border:1px solid #000;padding:0px 38px;">
                            <p style="margin-top:20px;font-size:1.35em;font-weight:600;">今收到：
                                <span style="display:inline-block;border-bottom:1px solid #000;width:88%;"></span>
                            </p>
                            <p style="margin-top:10px;font-size:1.35em;font-weight:600;">支&nbsp;付：
                                <span style="display:inline-block;border-bottom:1px solid #000;width:88%;"></span>
                            </p>
                            <p style="margin-top:10px;font-size:1.35em;font-weight:600;">人民币
                                <span>(大写)</span>：
                                <span style="display:inline-block;border-bottom:1px solid #000;width:80%;"></span>
                            </p>
                            <p style="margin-top:10px;font-size:1.35em;font-weight:600;">摘&nbsp;要：
                                <span style="display:inline-block;border-bottom:1px solid #000;width:88%;"></span>
                            </p>
                            <p style="margin-top:10px;font-size:1.35em;font-weight:600;">
                                <span style="display:inline-block;border-bottom:1px solid #000;width:99%;"></span>
                            </p>
                            <div style="height:50px;line-height:50px;font-size:1.35em;font-weight:600;">
                                <span style="float:left;">收款单位：</span>
                                <span style="float:right;margin-right:10px;">
                                    <em style="display:inline-block;border-bottom:1px solid #000;width:100px;"></em>元</span>
                            </div>
                            <div style="height:50px;font-size:1.35em;font-weight:600;">
                                <div style="float:left;">
                                    单位签章：
                                </div>
                                <div style="float:right;text-align:right;font-size:.8em;font-weight:normal;line-height:20px;">
                                    <p>黄日华(教练):
                                        <span style="display:inline-block;width:85px;">13688016520</span>
                                    </p>
                                    <p>投诉电话:
                                        <span style="display:inline-block;width:85px;">13688016520</span>
                                    </p>
                                </div>
                                <div style="float:right;text-align:right;font-size:.8em;margin-right:20px;font-weight:normal;line-height:20px;">
                                    <p>学员电话:
                                        <span style="display:inline-block;width:85px;">13688016520</span>
                                    </p>
                                    <p>防伪咨询:
                                        <span style="display:inline-block;width:85px;">13688016520</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-row>
            <el-row style="text-indent:45px;margin-top:15px;font-size:1.35em;">
                <div style="float:left;">
                    <span style="font-weight:600;">经办人：</span>
                    <span style="padding-right:3px;border-bottom:1px solid #000;margin-bottom:10px;">曾琳</span>
                </div>
                <div style="float:right;">
                    <span style="font-weight:600;">收款人：</span>
                    <span style="display:inline-block;padding-right:3px;border-bottom:1px solid #000;min-width:100px;margin-right:3px;"></span>
                    <span style="font-weight:600;">付款人：</span>
                    <span style="display:inline-block;padding-right:3px;border-bottom:1px solid #000;min-width:100px;"></span>
                    <p style="font-size:.77em;margin-top:3px;text-align:right;">该单据于“2017-4-14&nbsp;上午11：33：14”第“1”次打印</p>
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
            curPage: 1,
            results: [],
            schoolName: JSON.parse(sessionStorage.getItem("user")).schoolName,
            userName: JSON.parse(sessionStorage.getItem("user")).userName,
            financialToll: {
                unitTile: "长城驾校学员收费凭证",
                receiptDate: "2017年05月26日",
                receiptNumber: "2017-05-26-0013",
            },
            chapterPic: JSON.parse(sessionStorage.getItem("user")).financialChapter
        }
    },
    methods: {
        print() {
            console.log("print");
            console.log(LODOP);
            console.log(this.results);
            let data = this.results;
            for (let item in data) {
                LODOP.ADD_PRINT_HTM(50, 5, "100%", "100%", document.getElementById("printHtml" + item).innerHTML);
                if (item < data.length - 1) {
                    LODOP.NewPage();
                }
            }
            LODOP.PREVIEW();
        },
        //获取已制单的学员详情
        queryRecStudentsDetail(obj) {
            let para = [this.curPage, 7, 114];
            request.backstageManagement.finance.query.RecDetail(para).then((res) => {
                if (res.success) {
                    let data = res.object.list;
                    //console.log(data);
                    obj.data.totalCost = 0;
                    for (let item in data) {
                        obj.data.current = this.curPage;
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
                            gmtModify: new Date(data[item].gmtModify).Format("yyyy-MM-dd"),
                            remark: data[item].remark
                        });
                    }
                    if (this.curPage < res.object.totalPage) {
                        this.curPage++;
                        this.results.push({ data: [] });
                        this.queryRecStudentsDetail(this.results[this.curPage - 1]);
                    }
                    else if (this.curPage === res.object.totalPage) {
                        //console.log(this.results);
                        //console.log(JSON.stringify(this.results));
                    }
                }
            });
        },
        calculateCost(data) {
            if (typeof (data) !== "undefined") {
                return data.toFixed(2);
            }
        }
    },
    computed: {
    },
    activated() {
        this.curPage = 1;
        this.results = [];
        this.results.push({ data: [] });
        this.queryRecStudentsDetail(this.results[0]);
    },
    mounted() {
    }
}
</script>