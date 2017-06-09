<template>
    <div>
        <div class="mul-top-header">
            <div class="header-one">
                <el-cascader :options="options" v-model="curSelected" :show-all-levels="false" filterable @change="changeValue" :change-on-select="true"></el-cascader>
                <!-- <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                        {{curMerchant}}<i class="el-icon-caret-bottom el-icon--right"></i>
                    </span>
                    
                    <el-dropdown-menu>
                        <div>111</div>
                    </el-dropdown-menu>
                </el-dropdown>-->
                <div>
                    <el-menu mode="horizontal" :default-active="activeHeaderMenuIndex" @select="handleSelect">
                        <el-menu-item index="1">
                            <router-link to="/deal/overView">交易分析</router-link>
                        </el-menu-item>
                        <el-menu-item index="2">
                            <router-link to="/construction">财务报表</router-link>
                        </el-menu-item>
                        <el-menu-item index="3">
                            <router-link to="/settings/security">设置</router-link>
                        </el-menu-item>
                    </el-menu>
                </div>
            </div>
            <div class="header-two">
                <el-menu class="right" mode="horizontal" @select="handleSelect">
                    <el-submenu index="2">
                        <template slot="title">{{loginUser}}</template>
                        <el-menu-item index="2-1">安全退出</el-menu-item>
                    </el-submenu>
                </el-menu>
            </div>
        </div>
        <div class="mid-container" v-if="activeHeaderMenuIndex!=='2'">
            <div class="l-menu">
                <div class="menu-list">
                    <ul v-if="activeHeaderMenuIndex==='1'">
                        <li>
                            <router-link to="/deal/overView">总览</router-link>
                        </li>
                        <li>
                            <router-link to="/deal/orders">交易订单</router-link>
                        </li>
                        <li>
                            <router-link to="/deal/cash">提现</router-link>
                        </li>
                        <li>
                            <router-link to="/operation/logs">操作日志</router-link>
                        </li>
                    </ul>
                    <ul v-if="activeHeaderMenuIndex==='3'">
                        <li>
                            <router-link to="/settings/security">安全设置</router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="r-content">
                <router-view v-on:child-emit="listenData" :appId="appId"></router-view>
            </div>
        </div>
        <div v-else>建设中</div>
    </div>
</template>

<style>
    .mul-top-header {
        display: -webkit-box;
        width: 100%;
        background-color: #f6f6f6;
        line-height: 70px;
        box-shadow: 0 2px 4px rgba(4, 0, 0, 0.1);
    }
    
    .header-one {
        -webkit-box-flex: 3;
        background-color: #F6F6F6;
    }
    
    .header-one>* {
        margin-left: 22px;
        float: left;
    }
    
    .header-two {
        -webkit-box-flex: 1;
    }
    
    .top-header>div:first-child {
        margin-left: 22px;
    }
    
    .mul-top-header .el-menu,
    .mul-top-header .el-menu:hover,
    .el-menu-item,
    .el-menu-item:hover {
        background-color: #F6F6F6;
    }
    
    .el-menu-item {
        color: #333;
        font-weight: 400;
        background-color: #F6F6F6;
    }
    
    .el-menu-item:hover,
    .el-menu-item.is-active {
        color: #127abd;
        background-color: #F6F6F6;
    }
    
    .el-menu--horizontal .el-menu-item {
        background-color: #F6F6F6;
    }
    
    .el-dropdown-link {
        cursor: pointer;
    }
    
    .el-icon--right {
        font-size: 12px;
    }
    
    .el-submenu__title:hover,
    .el-menu--horizontal>.el-submenu:hover .el-submenu__title {
        border: 0;
        background-color: #F6F6F6;
    }
    
    .mid-container .l-menu {
        width: 199px;
        position: absolute;
    }
    
    .mid-container .l-menu,
    .mid-container .r-content {
        /*position: fixed;*/
        overflow: auto;
        bottom: 0px;
        top: 72px;
    }
    
    .mid-container .l-menu .menu-list ul>li a:not(.sub):not(.router-link-active):hover {
        background-color: #e6e6e6;
    }
    
    .el-cascader {
        background: none;
    }
    
    .el-cascader .el-input .el-input__inner {
        border: none;
    }
    
    .el-cascader__label {
        line-height: 66px;
    }
    
    .el-menu--horizontal>.el-menu-item:hover,
    .el-submenu__title:hover .el-submenu__title {
        background: #F6F6F6;
    }
</style>

<script>
    import { global } from "../assets/javascript/global";
    import { MulMerchant } from "../api/api"
    import $ from 'jquery';
    export default {
        data() {
            return {
                loginUser: "",
                activeHeaderMenuIndex: "1",
                options: [],
                curSelected: [],
                appId: "",
                userId: 0
            }
        },
        methods: {
            //初始化获取多级商户的关系
            getRelations: function () {
                MulMerchant.query.relations(this.userId).then(res => {
                    if (res.success === true) {
                        this.listenData(res.data);
                    }
                });
            },
            handleSelect: function (index) {
                if (index !== "2-1") {
                    this.activeHeaderMenuIndex = index;
                }
                else {
                    global.session.clear();
                    this.$router.replace({ path: "/login" });
                }
            },
            //监听回传数据
            listenData: function (data) {
                let node = data.node;
                let childrens = data.children;
                var datas = [];
                datas.push(this.recursive(data));
                this.options = datas;
                this.curSelected.push(datas[0].value);
            },
            //回传数据递归处理
            recursive: function (data) {
                var orgdata = {
                    value: data.node.appId,
                    label: data.node.name
                };
                if (data.children.length > 0) {
                    $.extend(orgdata, { children: [] });
                }
                for (var item in data.children) {
                    var subdata = this.recursive(data.children[item]);
                    orgdata.children.push(subdata);
                }
                return orgdata;
            },
            //处理所选数据
            changeValue: function (item) {
                var len = item.length - 1;
                global.curMerchant.appId = item[len];
                this.appId = item[len];
            }
        },
        beforeCreate: function () {
            global.root = JSON.parse(global.session.get("root"));
            global.curMerchant.appId = global.root.appId;
        },
        mounted: function () {
            var user = global.user.get().user;
            if (user) {
                this.loginUser = user.email || "";
                this.userId = user.userId;
                this.getRelations();
            }
        }
    }

</script>