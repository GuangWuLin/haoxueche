<template>
    <section>
        <div class="content">
            <el-row class="content_top">
                <el-row :span="24">
                    <el-col :span="3">
                        <p>&nbsp;</p>
                        <p>今日</p>
                        <p>昨日</p>
                    </el-col>
                    <el-col :span="5">
                        <p>报名人数</p>
                        <p>
                            <em>{{overview.data.baseStatisticsList[0].enrollCount}}</em>人</p>
                        <p>
                            <em>{{overview.data.baseStatisticsList[1].enrollCount}}</em>人</p>
                    </el-col>
                    <el-col :span="5">
                        <p>预约学时</p>
                        <p>
                            <em>{{overview.data.baseStatisticsList[0].appointmentHoursCount}}</em>人</p>
                        <p>
                            <em>{{overview.data.baseStatisticsList[1].appointmentHoursCount}}</em>人</p>
                    </el-col>
                    <el-col :span="5">
                        <p>培训学时</p>
                        <p>
                            <em>{{overview.data.baseStatisticsList[0].timerHoursCount}}</em>人</p>
                        <p>
                            <em>{{overview.data.baseStatisticsList[1].timerHoursCount}}</em>人</p>
                    </el-col>
                    <el-col :span="5">
                        <p>培训人数</p>
                        <p>
                            <em>{{overview.data.baseStatisticsList[0].trainCount}}</em>人</p>
                        <p>
                            <em>{{overview.data.baseStatisticsList[1].trainCount}}</em>人</p>
                    </el-col>
                </el-row>
            </el-row>
            <el-row class="content_functions">
                <div class="groupbox">
                    <span class="group-title">常用功能</span>
                </div>
                <el-row :gutter="35" class="function-list">
                    <el-col :span="6">
                        <a href="javascript:" class="list-content">
                            <i class="glyph-icon icon-xueyuan"></i>
                            <p>学员报名</p>
                        </a>
                    </el-col>
                    <el-col :span="6">
                        <a href="javascript:" class="list-content">
                            <i class="glyph-icon icon-yuyueguanli"></i>
                            <p>预约学车</p>
                        </a>
                    </el-col>
                    <el-col :span="6">
                        <a href="javascript:" class="list-content">
                            <i class="glyph-icon icon-jiaolianbaoban"></i>
                            <p>教练报班</p>
                        </a>
                    </el-col>
                    <el-col :span="6">
                        <a href="javascript:" class="list-content">
                            <i class="glyph-icon icon-chongzhi"></i>
                            <p>学员充值</p>
                        </a>
                    </el-col>
                </el-row>
                <el-row :gutter="35" class="function-list">
                    <el-col :span="6">
                        <a href="javascript:" class="list-content">
                            <i class="glyph-icon icon-dongtaijiankong"></i>
                            <p>车辆监控</p>
                        </a>
                    </el-col>
                    <el-col :span="6">
                        <a href="javascript:" class="list-content">
                            <i class="glyph-icon icon-yuyueqiang"></i>
                            <p>预约墙</p>
                        </a>
                    </el-col>
                    <el-col :span="6">
                        <a href="javascript:" class="list-content">
                            <i class="glyph-icon icon-kaoshi"></i>
                            <p>考试管理</p>
                        </a>
                    </el-col>
                    <el-col :span="6">
                        <a href="javascript:" class="list-content">
                            <i class="glyph-icon icon-zidingyi"></i>
                            <p>自定义功能</p>
                        </a>
                    </el-col>
                </el-row>
            </el-row>
            <el-row class="content_functions">
                <div class="groupbox">
                    <span class="group-title">更多服务</span>
                </div>
                <el-row :gutter="35" class="function-list">
                    <el-col :span="2">
                        &nbsp;
                    </el-col>
                    <el-col :span="4">
                        <a href="javascript:" class="list-content" style="background:none;">
                            <i class="glyph-icon icon-kaochangguanli"></i>
                            <p>考场管理</p>
                        </a>
                    </el-col>
                    <el-col :span="4">
                        <a href="javascript:" class="list-content" style="background:none;">
                            <i class="glyph-icon icon-weixin"></i>
                            <p>微信服务</p>
                        </a>
                    </el-col>
                    <el-col :span="4">
                        <a href="javascript:" class="list-content" style="background:none;">
                            <i class="glyph-icon icon-baoxian"></i>
                            <p>保险服务</p>
                        </a>
                    </el-col>
                    <el-col :span="4">
                        <a href="javascript:" class="list-content" style="background:none;">
                            <i class="glyph-icon icon-shouyin"></i>
                            <p>好学车收银</p>
                        </a>
                    </el-col>
                    <el-col :span="4">
                        <a href="javascript:" class="list-content" style="background:none;">
                            <i class="glyph-icon icon-dingzhihua"></i>
                            <p>定制化开发</p>
                        </a>
                    </el-col>
                    <el-col :span="2">
                        &nbsp;
                    </el-col>
                </el-row>
            </el-row>
            <el-row class="content_functions">
                <div class="groupbox">
                    <span class="group-title">知识乐园</span>
                </div>
                <el-row :gutter="15" class="knowledge-paradise">
                    <el-col :span="6">
                        <a href="javascript:" class="paradise-content appointment-training">
                            <p>预约培训</p>
                            <p>如何高效的使用预约</p>
                        </a>
                    </el-col>
                    <el-col :span="6">
                        <a href="javascript:" class="paradise-content enrollment-promotion">
                            <p>招生推广</p>
                            <p>如何运用互联网的方法推广驾校</p>
                        </a>
                    </el-col>
                    <el-col :span="6">
                        <a href="javascript:" class="paradise-content training-efficiency">
                            <p>培训效率</p>
                            <p>如何运用互联网的方式推广驾校</p>
                        </a>
                    </el-col>
                    <el-col :span="6">
                        <a href="javascript:" class="paradise-content principals-share">
                            <p>校长分享</p>
                            <p>优秀的校长分析管理经验</p>
                        </a>
                    </el-col>
                </el-row>
            </el-row>
        </div>
        <div class="right-side">
            <div class="side-row">
                <div class="row-title">
                    有问题请找我
                </div>
                <div class="row-kefu-content">
                    <div class="content-left-icon">
                        <i class="glyph-icon icon-kefu"></i>
                    </div>
                    <div class="left">客服经理：小凤</div>
                </div>
            </div>
            <div class="side-row">
                <div class="row-title">
                    学员APP
                </div>
                <div class="row-app-content">
                    <div class="content-left-erwm">
                        <img src="static/images/erwm.png" />
                    </div>
                    <div class="content-download-link">扫码下载</div>
                </div>
            </div>
            <div class="side-row">
                <div class="row-title">
                    产品动态
                </div>
                <ul class="row-info-content">
                    <li>
                        <span class="mr10 left">
                            06.13
                        </span>
                        <span>
                            驾校微信公众平台上线
                        </span>
                    </li>
                    <li>
                        <span class="mr10 left">
                            06.12
                        </span>
                        <span>
                            好学车整合平台更新
                        </span>
                    </li>
                </ul>
            </div>
            <div class="side-row">
                <div class="row-title">
                    帮助中心
                </div>
                <ul class="row-info-content">
                    <li>
                        <span class="mr10 left">
                            1.
                        </span>
                        <span>
                            新手必读
                        </span>
                    </li>
                    <li>
                        <span class="mr10 left">
                            2.
                        </span>
                        <span>
                            如何设置学员管理的功能
                        </span>
                    </li>
                    <li>
                        <span class="mr10 left">
                            3.
                        </span>
                        <span>
                            如何设置教练管理的功能
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>

<script>
import { request } from "../../api/api";
export default {
    data() {
        return {
            overview: {
                filter: {
                    schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                },
                data: {
                    baseStatisticsList: [
                        {
                            id: 0,
                            appointmentHoursCount: 0,
                            timerHoursCount: 0,
                            enrollCount: 0,
                            trainCount: 0,
                            schoolCode: null,
                            gmtCreate: 1489334400000,
                            gmtUpdate: null
                        },
                        {
                            id: 0,
                            appointmentHoursCount: 0,
                            timerHoursCount: 0,
                            enrollCount: 0,
                            trainCount: 0,
                            schoolCode: null,
                            gmtCreate: 1489334400000,
                            gmtUpdate: null
                        }
                    ]
                },
            }
        }
    },
    methods: {
        //查询总览
        queryTopData() {
            let para = this.overview.filter.schoolCode;
            request.overview.getTopData(para).then((res) => {
                if (res.success === true) {
                    let data = res.object;
                    if (data.baseStatisticsList.length) {
                        this.overview.data.baseStatisticsList = data.baseStatisticsList
                    }
                }
            });
        }
    },
    activated() {
        this.queryTopData();
    }
}
</script>

<style lang="scss">
.content {
    width: 100%;
    color: #333742;
    float: left;
    margin-right: -350px;
    font-size: 15px;
    .groupbox {
        height: auto;
        border-top: 1px solid #EAEAEA;
        padding: 10px;
    }

    .group-title {
        display: block;
        margin: -20px auto;
        width: 100px;
        text-align: center;
        color: #333742;
        background-color: #FFF;
    }
}

.content_top {
    background: #F4F6F8;
    margin-right: 350px;
    .el-row {
        margin: 0 50px;
        padding: 30px 0;
    }
    p {
        line-height: 40px;
        em {
            font-style: normal;
            font-weight: 600;
            margin-right: 5px;
        }
    }
    .el-col:not(:first-child) {
        text-align: center;
    }
}

.content_functions {
    margin-top: 45px;
    margin-right: 350px;
    .function-list,
    .knowledge-paradise {
        padding: 10px 30px;
        margin-top: 15px;
        .list-content,
        .paradise-content {
            &.appointment-training {
                background: #8AD385;
                color: #FFF;
            }
            &.enrollment-promotion {
                background: #4CADED;
                color: #FFF;
            }
            &.training-efficiency {
                background: #EA807E;
                color: #FFF;
            }
            &.principals-share {
                background: #F19252;
                color: #FFF;
            }
            p:first-child {
                font-size: 18px;
                margin-top: 10px;
                margin-bottom: 5px;
            }
            p:last-child {
                font-size: 12px;
            }
            border-radius: 2px;
            height: 75px;
            background: #F4F6F8;
            display: block;
            text-align: center;
            font-size: 14px;
            padding-top: 20px;
            .glyph-icon {
                margin-right: 0;
                float: none;
                font-size: 2.2em;
                margin-bottom: 3px;
            }
            .icon-xueyuan {
                color: #0B9EFF;
            }
            .icon-yuyueguanli {
                color: #64C15E;
            }
            .icon-jiaolianbaoban {
                color: #FF5B59;
            }
            .icon-chongzhi {
                color: #FF6600;
            }
            .icon-dongtaijiankong {
                color: #FF6600;
            }
            .icon-yuyueqiang {
                color: #0B9EFF;
            }
            .icon-kaoshi {
                color: #FF5B59;
            }
            .icon-zidingyi {
                color: #64C15E;
            }
            .icon-kaochangguanli {
                color: #0B9EFF;
            }
            .icon-weixin {
                color: #64C15E;
            }
            .icon-baoxian {
                color: #0B9EFF;
            }
            .icon-shouyin {
                color: #FF6600;
            }
            .icon-dingzhihua {
                color: #64C15E;
            }
        }
    }
}

.right-side {
    width: 280px;
    height: 100%;
    color: #333742;
    background: #fff;
    float: right;
    font-size: 14px;
    .side-row {
        border: 1px solid #F4F6F8;
        margin-bottom: 20px;
        .row-title {
            line-height: 40px;
            background: #F4F6F8;
            font-size: 14px;
            text-indent: 20px;
        }
        .row-kefu-content {
            height: 80px;
            line-height: 80px;
            .content-left-icon {
                float: left;
                width: 60px;
                padding-left: 20px;
                .glyph-icon {
                    color: #0B9EFF;
                    font-size: 3em;
                    margin-right: 0;
                }
            }
        }
        .row-app-content {
            height: 110px;
            .content-left-erwm {
                float: left;
                width: 82px;
                padding-left: 20px;
                margin-top: 15px;
                >img {
                    width: 82px;
                    height: 84px;
                }
            }
            .content-download-link {
                float: left;
                line-height: 110px;
                margin-left: 20px;
            }
        }
        .row-info-content {
            padding: 20px;
            li:not(:last-child) {
                margin-bottom: 8px;
            }
            >span:last-child {
                display: table-cell;
                *display: inline-block;
            }
        }
    }
}
</style>