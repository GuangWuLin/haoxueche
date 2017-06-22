<template>
    <section v-loading="pageLoading">
        <el-row>
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="filters">
                    <el-col :span="12">
                        <el-form-item>
                            <el-input class="search-input" v-model="filters.plat" placeholder="输入车牌号" icon="search" :on-icon-click="getVehicles"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" class="t-right">
                        <el-form-item>
                            <el-button type="primary" @click="handleOpenWin('new')">新增车辆</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleFiling">车辆备案</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="vehiclesList" highlight-current-row @selection-change="handleSelectionChange" @row-click="rowClick">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="cardNo" label="车牌号">
                </el-table-column>
                <el-table-column prop="operationNo" label="营运证号">
                </el-table-column>
                <el-table-column prop="model" label="车辆型号">
                </el-table-column>
                <el-table-column prop="carType" label="培训车型">
                </el-table-column>
                <el-table-column prop="gmtAs" label="年检日期" :formatter="formatData">
                </el-table-column>
                <el-table-column prop="report" label="状态" :formatter="formatData">
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button type="text" size="small" @click.stop="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--工具条-->
            <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="10" :total="total">
            </el-pagination>
        </el-row>
        <!--新增车辆界面-->
        <el-dialog title="新增车辆" v-model="addVehiclesFormVisible" :close-on-click-modal="false" size="full">
            <el-form v-if="addVehiclesFormVisible" :model="addVehiclesForm" :rules="vehiclesFormRules" ref="addVehiclesForm" :inline="true" label-width="85px">
                <p class="group-title">基础信息</p>
                <el-form-item label="车牌号" prop="cardNo">
                    <el-input auto-complete="off" v-model="addVehiclesForm.cardNo"></el-input>
                </el-form-item>
                <el-form-item label="车牌颜色" class="normal" prop="plateColor">
                    <el-select placeholder="请选择车牌颜色" v-model="addVehiclesForm.plateColor" ref="plateColor">
                        <el-option v-for="item in vehiclesColorsOption" :label="item.value" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="座位数" prop="seating">
                    <el-input auto-complete="off" v-model="addVehiclesForm.seating"></el-input>
                </el-form-item>
                <el-form-item label="营运证编号" prop="operationNo">
                    <el-input auto-complete="off" v-model="addVehiclesForm.operationNo"></el-input>
                </el-form-item>
                <el-form-item label="行驶证号" prop="licenseNo">
                    <el-input auto-complete="off" v-model="addVehiclesForm.licenseNo"></el-input>
                </el-form-item>
                <el-form-item label="培训车型" class="normal" prop="carType">
                    <el-select placeholder="请选择培训车型" v-model="addVehiclesForm.carType">
                        <el-option v-for="item in vehiclesTypeOption" :label="item.value" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="车架号" prop="vin">
                    <el-input auto-complete="off" v-model="addVehiclesForm.vin"></el-input>
                </el-form-item>
                <el-form-item label="发动机编号" prop="engineNo">
                    <el-input auto-complete="off" v-model="addVehiclesForm.engineNo"></el-input>
                </el-form-item>
                <el-form-item label="核定学员数" prop="vouchStudent">
                    <el-input auto-complete="off" v-model="addVehiclesForm.vouchStudent"></el-input>
                </el-form-item>
                <el-form-item label="所属分校" class="normal" prop="schoolCode">
                    <el-select placeholder="请选择分校" v-model="addVehiclesForm.schoolCode">
                        <el-option v-for="item in branchSchoolData" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="购买日期" prop="gmtBuy">
                    <el-date-picker type="date" placeholder="购买日期" v-model="addVehiclesForm.gmtBuy" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="入校日期" class="normal" prop="gmtRegister">
                    <el-date-picker type="date" placeholder="入校日期" v-model="addVehiclesForm.gmtRegister" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="车辆品牌" class="cs" prop="manufacturerId">
                    <el-col :span="9">
                        <el-select placeholder="生产厂家" v-model="addVehiclesForm.manufacturerId" @change="brandChange" ref="manufacturer">
                            <el-option v-for="item in manufacturerData" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="9">
                        <el-select placeholder="车辆品牌" v-model="addVehiclesForm.brandId" @change="brandChange1" ref="brand">
                            <el-option v-for="item in brandsData" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="0">
                        <el-select placeholder="车辆型号" v-model="addVehiclesForm.modelId" ref="model">
                            <el-option v-for="item in modelData" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="技术等级" class="normal" prop="level">
                    <el-select placeholder="请选择技术等级" v-model="addVehiclesForm.level">
                        <el-option label="一级" value="一级"></el-option>
                        <el-option label="二级" value="二级"></el-option>
                        <el-option label="三级" value="三级"></el-option>
                        <el-option label="四级" value="四级"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="等级评定日期" class="normal" prop="gmtLevel">
                    <el-date-picker type="date" placeholder="等级评定日期" v-model="addVehiclesForm.gmtLevel" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="技术等级有效期" class="normal" prop="gmtLevelValidity">
                    <el-date-picker type="date" placeholder="技术等级有效期" v-model="addVehiclesForm.gmtLevelValidity" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="所属区划" class="cs">
                    <PCA v-if="addVehiclesFormVisible" tag="basic" v-on:child-emit="listenData"></PCA>
                </el-form-item>
                <el-form-item label="年检日期" prop="gmtAs">
                    <el-date-picker type="date" placeholder="年检日期" v-model="addVehiclesForm.gmtAs" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="所属单位" prop="departmentId">
                    <el-cascader :options="departmentData" :show-all-levels="false" @change="departmentChange" :change-on-select="true" v-model="selectedUnitOptions">
                    </el-cascader>
                </el-form-item>
                <p class="group-title">
                    保险信息(商业险)
                    <el-button type="primary" icon="plus" :plain="true" @click="addInsurace('commercial')" class="ml15" title="新增商业险"></el-button>
                </p>
                <el-form :model="insuraceForm" ref="insuraceForm" :inline="true" class="demo-form-inline mt15" label-width="85px">
                    <el-row class="insurace-part" v-for="(item,index) in insuraceForm.commercial">
                        <el-form-item label="保险公司" prop="insuranceCompany">
                            <el-input auto-complete="off" v-model="item.insuranceCompany"></el-input>
                        </el-form-item>
                        <el-form-item label="保险单号" prop="insuranceCode">
                            <el-input auto-complete="off" v-model="item.insuranceCode"></el-input>
                        </el-form-item>
                        <el-form-item label="保险费用" prop="insuranceCost">
                            <el-input auto-complete="off" v-model="item.insuranceCost"></el-input>
                        </el-form-item>
                        <el-form-item label="到期日期" prop="gmtEnd">
                            <el-date-picker type="date" placeholder="到期日期" :editable="false" v-model="item.gmtEnd"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="三方责任险" prop="otherCost">
                            <el-input auto-complete="off" v-model="item.otherCost"></el-input>
                        </el-form-item>
                        <el-button type="primary" icon="minus" :plain="true" @click="delInsurace(item,'commercial')" class="ml15" title="删除商业险"></el-button>
                    </el-row>
                </el-form>
                <p class="group-title">
                    保险信息(交强险)
                    <el-button type="primary" icon="plus" :plain="true" @click="addInsurace('mandatory')" class="ml15" title="新增交强险"></el-button>
                </p>
                <el-form :model="insuraceForm" ref="insuraceForm" :inline="true" class="demo-form-inline mt15" label-width="85px">
                    <el-row class="insurace-part" v-for="(item,index) in insuraceForm.mandatory">
                        <el-form-item label="保险公司" prop="insuranceCompany">
                            <el-input auto-complete="off" v-model="item.insuranceCompany"></el-input>
                        </el-form-item>
                        <el-form-item label="保险单号" prop="insuranceCode">
                            <el-input auto-complete="off" v-model="item.insuranceCode"></el-input>
                        </el-form-item>
                        <el-form-item label="保险费用" prop="insuranceCost">
                            <el-input auto-complete="off" v-model="item.insuranceCost"></el-input>
                        </el-form-item>
                        <el-form-item label="到期日期" prop="gmtEnd">
                            <el-date-picker type="date" placeholder="到期日期" :editable="false" v-model="item.gmtEnd"></el-date-picker>
                        </el-form-item>
                        <el-button type="primary" icon="minus" :plain="true" @click="delInsurace(item,'mandatory')" class="ml15" title="删除交强险"></el-button>
                    </el-row>
                </el-form>
                <el-upload class="avatar-uploader" :action="fileUploadAction" :show-file-list="false" :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload" style="position: absolute;top: 70px;right: 50px;">
                    <img v-if="addVehiclesForm.carPhotos" :src="addVehiclesForm.carPhotos" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addVehiclesFormVisible = false" size="large">取消</el-button>
                <el-button type="primary" size="large" @click.native="createNew('create')" :loading="btnLoading">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="车辆详情" v-model="detailsVehicleFormVisible" :close-on-click-modal="false" size="full">
            <!-- 基本信息 -->
            <div class="basic" style="margin-top:0;padding:0 20px;">
                <el-form :model="detailVehicles">
                    <el-row>
                        <el-col :span="20">
                            <p class="mt15 detailForm">
                                <img v-bind:src="detailVehicles.carPhotos" class="photo" />
                                <span class="ml50">{{detailVehicles.cardNo}}【{{detailVehicles.report?'已备案':'未备案'}}】</span>
                            </p>
                        </el-col>
                        <el-col :span="4">
                            <p class="t-right">
                                <el-button type="primary" size="large" @click="handleOpenWin('edit')">&nbsp;修改&nbsp;</el-button>
                            </p>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <span>行驶证号：{{detailVehicles.licenseNo}}</span>
                        </el-col>
                        <el-col :span="4">
                            <span>培训车型：{{detailVehicles.carType}}</span>
                        </el-col>
                        <el-col :span="6">
                            <span>车架号：{{detailVehicles.vin}}</span>
                        </el-col>
                        <el-col :span="6">
                            <span>发动机编号：{{detailVehicles.engineNo}}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <span>车辆品牌: {{(detailVehicles.manufacturer===null?'':detailVehicles.manufacturer)+' '+(detailVehicles.brand===null?'':detailVehicles.brand)+' '+(detailVehicles.model===null?'':detailVehicles.model)}}</span>
                        </el-col>
                        <el-col :span="4">
                            <span>核定学员数：{{detailVehicles.vouchStudent}}</span>
                        </el-col>
                        <el-col :span="6">
                            <span>入校日期：{{detailVehicles.gmtRegister===null||detailVehicles.gmtRegister==="1970-01-01"?"":formatDate(detailVehicles.gmtRegister)}}</span>
                        </el-col>
                        <el-col :span="8">
                            <span>所属分校：{{detailVehicles.schoolName}}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <span>营运证编号: {{detailVehicles.operationNo}}</span>
                        </el-col>
                        <el-col :span="4">
                            <span>车牌颜色：{{detailVehicles.plateColorName}}</span>
                        </el-col>
                        <el-col :span="6">
                            <span>技术等级：{{detailVehicles.level}}</span>
                        </el-col>
                        <el-col :span="6">
                            <span>等级评定日期: {{detailVehicles.gmtLevel===null?"":formatDate(detailVehicles.gmtLevel)}}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <span>所属地区：{{(detailVehicles.provinceName===null?'':detailVehicles.provinceName)+' '+(detailVehicles.cityName===null?'':detailVehicles.cityName)+' '+(detailVehicles.countyName===null?'':detailVehicles.countyName)}}</span>
                        </el-col>
                        <el-col :span="6">
                            <span>技术等级有效期：{{detailVehicles.gmtLevelValidity===null?"":formatDate(detailVehicles.gmtLevelValidity)}}</span>
                        </el-col>
                        <el-col :span="4">
                            <span>座位数：{{detailVehicles.seating}}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <span>购买日期：{{detailVehicles.gmtBuy===null?"":formatDate(detailVehicles.gmtBuy)}}</span>
                        </el-col>
                        <el-col :span="6">
                            <span>年检日期：{{detailVehicles.gmtAs===null?"":formatDate(detailVehicles.gmtAs)}}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-radio-group v-model="radioInsuranceSel" class="mb15">
                                <el-radio-button label="商业险"></el-radio-button>
                                <el-radio-button label="交强险"></el-radio-button>
                            </el-radio-group>
                            <!--列表-->
                            <el-table :data="detailVehicles.commercialInsurances" highlight-current-row v-show="radioInsuranceSel==='商业险'">
                                <el-table-column prop="insuranceCompany" label="保险公司">
                                </el-table-column>
                                <el-table-column prop="insuranceCost" label="保费">
                                </el-table-column>
                                <el-table-column prop="insuranceCode" label="保险单号">
                                </el-table-column>
                                <el-table-column prop="otherCost" label="第三方责任险">
                                </el-table-column>
                                <el-table-column prop="gmtEnd" label="到期日期" :formatter="formatData">
                                </el-table-column>
                                <el-table-column prop="gmtModify" label="创建时间" :formatter="formatData">
                                </el-table-column>
                                <el-table-column prop="insurancePhotos" label="保单原件">
                                </el-table-column>
                            </el-table>
                            <el-table :data="detailVehicles.mandatoryInsurances" highlight-current-row v-show="radioInsuranceSel==='交强险'">
                                <el-table-column prop="insuranceCompany" label="保险公司">
                                </el-table-column>
                                <el-table-column prop="insuranceCost" label="保费">
                                </el-table-column>
                                <el-table-column prop="insuranceCode" label="保险单号">
                                </el-table-column>
                                <el-table-column prop="gmtEnd" label="到期日期" :formatter="formatData">
                                </el-table-column>
                                <el-table-column prop="gmtModify" label="创建时间" :formatter="formatData">
                                </el-table-column>
                                <el-table-column prop="insurancePhotos" label="保单原件">
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="detailsVehicleFormVisible = false" size="large">取消</el-button>
            </div>
        </el-dialog>
        <!--编辑车辆界面-->
        <el-dialog title="编辑车辆" v-model="editVehiclesFormVisible" :close-on-click-modal="false" size="full">
            <el-form v-if="editVehiclesFormVisible" :model="editVehiclesForm" :rules="vehiclesFormRules" ref="editVehiclesForm" :inline="true" label-width="85px">
                <p class="group-title">基础信息</p>
                <el-form-item label="车牌号" prop="cardNo">
                    <el-input auto-complete="off" v-model="editVehiclesForm.cardNo" :disabled="editVehiclesForm.report"></el-input>
                </el-form-item>
                <el-form-item label="车牌颜色" class="normal" prop="plateColor">
                    <el-select placeholder="请选择车牌颜色" v-model="editVehiclesForm.plateColor" ref="plateColor">
                        <el-option v-for="item in vehiclesColorsOption" :label="item.value" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="座位数" prop="seating">
                    <el-input auto-complete="off" v-model="editVehiclesForm.seating"></el-input>
                </el-form-item>
                <el-form-item label="营运证编号" prop="operationNo">
                    <el-input auto-complete="off" v-model="editVehiclesForm.operationNo"></el-input>
                </el-form-item>
                <el-form-item label="行驶证号" prop="licenseNo">
                    <el-input auto-complete="off" v-model="editVehiclesForm.licenseNo"></el-input>
                </el-form-item>
                <el-form-item label="培训车型" class="normal" prop="carType">
                    <el-select placeholder="请选择培训车型" v-model="editVehiclesForm.carType">
                        <el-option v-for="item in vehiclesTypeOption" :label="item.value" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="车架号" prop="vin">
                    <el-input auto-complete="off" v-model="editVehiclesForm.vin"></el-input>
                </el-form-item>
                <el-form-item label="发动机编号" prop="engineNo">
                    <el-input auto-complete="off" v-model="editVehiclesForm.engineNo"></el-input>
                </el-form-item>
                <el-form-item label="核定学员数" prop="vouchStudent">
                    <el-input auto-complete="off" v-model="editVehiclesForm.vouchStudent"></el-input>
                </el-form-item>
                <el-form-item label="所属分校" class="normal" prop="schoolCode">
                    <el-select placeholder="请选择分校" v-model="editVehiclesForm.schoolCode">
                        <el-option v-for="item in branchSchoolData" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="购买日期" prop="gmtBuy">
                    <el-date-picker type="date" placeholder="购买日期" v-model="editVehiclesForm.gmtBuy" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="入校日期" class="normal" prop="gmtRegister">
                    <el-date-picker type="date" placeholder="入校日期" v-model="editVehiclesForm.gmtRegister" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="车辆品牌" class="cs" prop="manufacturerId">
                    <el-col :span="9">
                        <el-select placeholder="生产厂家" v-model="editVehiclesForm.manufacturerId" @change="brandChange" ref="manufacturer">
                            <el-option v-for="item in manufacturerData" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="9">
                        <el-select placeholder="车辆品牌" v-model="editVehiclesForm.brandId" @change="brandChange1" ref="brand">
                            <el-option v-for="item in brandsData" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="0">
                        <el-select placeholder="车辆型号" v-model="editVehiclesForm.modelId" ref="model">
                            <el-option v-for="item in modelData" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="技术等级" class="normal" prop="level">
                    <el-select placeholder="请选择技术等级" v-model="editVehiclesForm.level">
                        <el-option label="一级" value="一级"></el-option>
                        <el-option label="二级" value="二级"></el-option>
                        <el-option label="三级" value="三级"></el-option>
                        <el-option label="四级" value="四级"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="等级评定日期" class="normal" prop="gmtLevel">
                    <el-date-picker type="date" placeholder="等级评定日期" v-model="editVehiclesForm.gmtLevel" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="技术等级有效期" class="normal" prop="gmtLevelValidity">
                    <el-date-picker type="date" placeholder="技术等级有效期" v-model="editVehiclesForm.gmtLevelValidity" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="所属地区" class="cs">
                    <PCA v-if="editVehiclesFormVisible" tag="basic" :county="editVehiclesForm.county" v-on:child-emit="listenData"></PCA>
                </el-form-item>
                <el-form-item label="年检日期" prop="gmtAs">
                    <el-date-picker type="date" placeholder="年检日期" v-model="editVehiclesForm.gmtAs" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="所属单位" prop="departmentId">
                    <el-cascader :options="departmentData" :show-all-levels="false" @change="departmentChange" :change-on-select="true" v-model="selectedUnitOptions">
                    </el-cascader>
                </el-form-item>
                <p class="group-title">
                    保险信息(商业险)
                    <el-button type="primary" icon="plus" :plain="true" @click="addInsurace('commercial')" class="ml15" title="新增商业险"></el-button>
                </p>
                <el-form :model="insuraceForm" ref="insuraceForm" :inline="true" class="demo-form-inline mt15" label-width="85px">
                    <el-row class="insurace-part" v-for="(item,index) in insuraceForm.commercial">
                        <el-form-item label="保险公司" prop="insuranceCompany">
                            <el-input auto-complete="off" v-model="item.insuranceCompany"></el-input>
                        </el-form-item>
                        <el-form-item label="保险单号" prop="insuranceCode">
                            <el-input auto-complete="off" v-model="item.insuranceCode"></el-input>
                        </el-form-item>
                        <el-form-item label="保险费用" prop="insuranceCost">
                            <el-input auto-complete="off" v-model="item.insuranceCost"></el-input>
                        </el-form-item>
                        <el-form-item label="到期日期" prop="gmtEnd">
                            <el-date-picker type="date" placeholder="到期日期" :editable="false" v-model="item.gmtEnd"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="三方责任险" prop="otherCost">
                            <el-input auto-complete="off" v-model="item.otherCost"></el-input>
                        </el-form-item>
                        <el-button type="primary" icon="minus" :plain="true" @click="delInsurace(item,'commercial')" class="ml15" title="删除商业险"></el-button>
                    </el-row>
                </el-form>
                <p class="group-title">
                    保险信息(交强险)
                    <el-button type="primary" icon="plus" :plain="true" @click="addInsurace('mandatory')" class="ml15" title="新增交强险"></el-button>
                </p>
                <el-form :model="insuraceForm" ref="insuraceForm" :inline="true" class="demo-form-inline mt15" label-width="85px">
                    <el-row class="insurace-part" v-for="(item,index) in insuraceForm.mandatory">
                        <el-form-item label="保险公司" prop="insuranceCompany">
                            <el-input auto-complete="off" v-model="item.insuranceCompany"></el-input>
                        </el-form-item>
                        <el-form-item label="保险单号" prop="insuranceCode">
                            <el-input auto-complete="off" v-model="item.insuranceCode"></el-input>
                        </el-form-item>
                        <el-form-item label="保险费用" prop="insuranceCost">
                            <el-input auto-complete="off" v-model="item.insuranceCost"></el-input>
                        </el-form-item>
                        <el-form-item label="到期日期" prop="gmtEnd">
                            <el-date-picker type="date" placeholder="到期日期" :editable="false" v-model="item.gmtEnd"></el-date-picker>
                        </el-form-item>
                        <el-button type="primary" icon="minus" :plain="true" @click="delInsurace(item,'mandatory')" class="ml15" title="删除交强险"></el-button>
                    </el-row>
                </el-form>
                <el-upload class="avatar-uploader" :action="fileUploadAction" :show-file-list="false" :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload" style="position: absolute;top: 70px;right: 50px;">
                    <img v-if="editVehiclesForm.carPhotos" :src="editVehiclesForm.carPhotos" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editVehiclesFormVisible = false" size="large">取消</el-button>
                <el-button type="primary" size="large" @click.native="createNew('edit')" :loading="btnLoading">保存</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
import $ from "jquery";
import { request } from "../../api/api";
import PCA from "../../components/common/pca.vue";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        return {
            pageLoading: false,
            total: 0,
            page: 1,
            vehiclesList: [],
            vehiclesColorsOption: [],
            vehiclesTypeOption: [],
            departmentData: [],
            provinceData: [],
            cityData: [],
            countyData: [],
            manufacturerData: [],
            brandsData: [],
            modelData: [],
            branchSchoolData: [],
            filters: {
                plat: ""
            },
            radioInsuranceSel: "商业险",
            detailsVehicleFormVisible: false,
            addVehiclesFormVisible: false,
            insuraceForm: {
                commercial: [],
                mandatory: []
            },
            reportTeachers: {
                ids: []
            },
            //新增车辆实体模型
            addVehiclesForm: {
                schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                cardNo: "",
                plateColor: "",
                plateColorName: "",
                seating: "",
                operationNo: "",
                licenseNo: "",
                carType: "",
                vin: "",
                engineNo: "",
                vouchStudent: "",
                gmtBuy: "",
                gmtRegister: "",
                manufacturerId: "",
                brandId: "",
                modelId: "",
                level: "",
                gmtLevel: "",
                gmtLevelValidity: "",
                province: "",
                city: "",
                county: "",
                gmtAs: "",
                carPhotos: "",
                commercialInsurances: [],
                mandatoryInsurances: [],
                departmentId: "",
                departmentName: ""
            },
            vehiclesFormRules: {
                cardNo: [
                    { required: true, message: "请填写车牌号", trigger: "blur" }
                ],
                licenseNo: [
                    { required: true, message: "请填写营运证编号", trigger: "blur" }
                ],
                carType: [
                    { required: true, message: "请选择培训车型", trigger: "change" }
                ],
                vin: [
                    { required: true, message: "请填写车架号", trigger: "blur" }
                ],
                engineNo: [
                    { required: true, message: "请填写发动机号", trigger: "blur" }
                ],
                plateColor: [
                    { type: "number", required: true, message: "请选择车牌颜色", trigger: "change" }
                ],
                manufacturerId: [
                    { required: true, message: "请选择车辆生产厂家／品牌／型号", trigger: "change" }
                ],
                departmentId: [
                    { required: true, message: "请选择所属部门", trigger: "change" }
                ],
                gmtBuy: [
                    { type: "date", required: true, message: "请选择购买日期", trigger: "change" }
                ]
            },
            detailVehicles: {},
            editVehiclesForm: {
                id: "",
                vin: "",
                engineNo: "",
                operationNo: "",
                cardNo: "",
                plateColor: "",
                plateColorName: "",
                carPhotos: "",
                manufacturerId: "",
                brandId: "",
                modelId: "",
                carType: "",
                gmtBuy: "",
                gmtRegister: "",
                gmtAs: "",
                vouchStudent: "",
                licenseNo: "",
                provinceName: "",
                province: "",
                cityName: "",
                city: "",
                countyName: "",
                county: "",
                level: "",
                gmtLevel: "",
                gmtLevelValidity: "",
                seating: "",
                commercialInsurances: [
                    {
                        insuranceCompany: "",
                        insuranceCost: 0,
                        otherCost: 0,
                        insuranceCode: "",
                        insurancePhotos: "",
                        gmtEnd: ""
                    }
                ],
                mandatoryInsurances: [
                    {
                        insuranceCompany: "",
                        insuranceCost: 0,
                        insuranceCode: "",
                        insurancePhotos: "",
                        gmtEnd: ""
                    }
                ]
            },
            selectedUnitOptions: [],
            editVehiclesFormVisible: false,
            fileUploadAction: request.baseUrl + "/file/uploadFile",
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            parentSchoolCode: JSON.parse(sessionStorage.getItem("user")).parentSchoolCode,
            btnLoading: false
        }
    },
    methods: {
        //数据转换
        formatData(row, column) {
            if (column.property === "report") {
                return row.report ? "已备案" : "未备案";
            }
            else if (column.property === "gmtEnd") {
                return row.gmtEnd === null ? "" : new Date(row.gmtEnd).Format("yyyy-MM-dd");
            }
            else if (column.property === "gmtModify") {
                return row.gmtModify === null ? "" : new Date(row.gmtModify).Format("yyyy-MM-dd");
            }
            else if (column.property === "gmtAs") {
                return row.gmtAs === null ? "" : new Date(row.gmtAs).Format("yyyy-MM-dd");
            }
        },
        //获取车牌颜色
        getVehiclesColors() {
            request.basic.vehicle.queryColors().then((res) => {
                if (res.success === true) {
                    this.vehiclesColorsOption = res.object;
                }
            });
        },
        //获取车辆类型
        getCarType() {
            request.public.queryCarType().then((res) => {
                if (res.success === true) {
                    this.vehiclesTypeOption = res.object;
                }
            });
        },
        //获取分校
        getBranchSchool() {
            let para = [this.schoolCode, this.page, 1000];
            request.systemSettings.branchSchool.query.list(para).then((res) => {
                if (res.success === true) {
                    let data = res.object.list;
                    this.branchSchoolData = [];
                    if (this.parentSchoolCode === 0) {
                        data.unshift({
                            schoolName: JSON.parse(sessionStorage.getItem("user")).schoolName,
                            schoolCode: this.schoolCode
                        });
                    }
                    for (let item in data) {
                        this.branchSchoolData.push({
                            label: data[item].schoolName,
                            value: data[item].schoolCode
                        });
                    }
                }
            });
        },
        //获取车辆品牌（根据不同参数递归查询）
        getCarBrands(id, tag, callback) {
            global.printLog(id);
            // 根据选择的 id 搜索全部汽车生产厂家
            request.basic.vehicle.queryBrands(id).then((res) => {
                if (res.success === true) {
                    let data = res.object;
                    if (tag === 0) {
                        // 初始化请求 0 查询所有汽车厂家
                        // id 是 汽车品牌 id
                        // tag 表示查哪一级
                        this.manufacturerData = []; // 汽车厂家数组
                        for (let item in data) {
                            this.manufacturerData.push({
                                label: data[item].name,
                                value: data[item].id
                            });
                        }
                    }
                    else if (tag === 1) {
                        this.brandsData = []; // 汽车品牌数组
                        for (let item in data) {
                            this.brandsData.push({
                                label: data[item].name,
                                value: data[item].id
                            });
                        }
                        if (data.length) {
                            if (this.addVehiclesFormVisible) {
                                this.addVehiclesForm.brandId = this.brandsData[0].value;
                            }
                            else if (this.editVehiclesFormVisible) {
                                this.editVehiclesForm.brandId = this.brandsData[0].value;
                            }
                        }
                    }
                    else if (tag === 2) {
                        this.modelData = [];
                        for (let item in data) {
                            this.modelData.push({
                                label: data[item].name,
                                value: data[item].id
                            });
                        }
                        if (data.length) {
                            if (this.addVehiclesFormVisible) {
                                this.addVehiclesForm.modelId = this.modelData[0].value;
                            }
                            else {
                                this.editVehiclesForm.modelId = this.modelData[0].value;
                            }
                        }
                    }
                    callback();
                }
            });
        },
        //获取车辆列表
        getVehicles() {
            this.pageLoading = true;
            let para = [this.schoolCode, "", "", this.page, 10, this.filters.plat];
            setTimeout(() => {
                request.basic.vehicle.queryList(para).then((res) => {
                    if (res.success === true) {
                        this.pageLoading = false;
                        let data = res.object;
                        global.printLog(data);
                        this.total = data.num;
                        this.vehiclesList = data.list;
                    }
                });
            }, 1000);
        },
        //打开新增窗体
        handleOpenWin(flag) {
            if (flag === "new") {
                this.addVehiclesFormVisible = true;
            }
            else if (flag === "edit") {
                this.detailsVehicleFormVisible = false;
                this.editVehiclesFormVisible = true;
            }
        },
        handleFiling() {
            let ids = this.reportTeachers.ids;
            if (ids.length > 0) {
                let para = Object.assign({}, this.reportTeachers);
                request.basic.vehicle.report(para).then((res) => {
                    if (res.success) {
                        //global.printLog(res);
                        this.reportTeachers.ids = [];
                        this.$msgbox({
                            title: "系统提示",
                            message: res.object,
                            confirmButtonText: "确定",
                            closeOnClickModal: false,
                            beforeClose: (action, instance, done) => {
                                if (action === "confirm" || action === "cancel") {
                                    done();
                                    this.getVehicles();
                                }
                            }
                        }).then(action => { });
                    }
                });
            }
            else {
                this.$message.warning("请先选择车辆！");
            }
        },
        handleDelete(row) {
            this.$confirm("您正在删除车辆【" + row.cardNo + "】, 是否继续？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnClickModal: false,
                type: "warning"
            }).then(() => {
                request.basic.vehicle.delete(row.id).then((res) => {
                    if (res.success) {
                        this.getVehicles();
                        this.$message({ message: "车辆删除成功！", type: "success" });
                    }
                    else {
                        this.$message.error("车辆删除失败！原因：" + res.message);
                    }
                })
            }).catch(() => { });
        },
        //列表行点击
        rowClick(row, evt, column) {
            if (column.type === "default") {
                this.radioInsuranceSel = "商业险";
                request.basic.vehicle.queryDetail(row.id).then((res) => {
                    if (res.success) {
                        let data = res.object;
                        global.printLog(data);
                        this.detailVehicles = data;
                        this.detailVehicles.level = data.level;
                        let _brandId = data.brandId;
                        let _modelId = data.modelId;
                        let _manufacturerId = data.manufacturerId;
                        this.editVehiclesForm = {
                            id: data.id,
                            vin: data.vin,
                            engineNo: data.engineNo,
                            operationNo: data.operationNo,
                            cardNo: data.cardNo,
                            plateColor: parseInt(data.plateColor),
                            plateColorName: data.plateColorName,
                            carPhotos: data.carPhotos,
                            manufacturerId: _manufacturerId,
                            carType: data.carType,
                            gmtBuy: data.gmtBuy === null ? "" : new Date(data.gmtBuy),
                            gmtRegister: data.gmtRegister === null ? "" : new Date(data.gmtRegister),
                            gmtAs: data.gmtAs === null ? "" : new Date(data.gmtAs),
                            vouchStudent: data.vouchStudent,
                            licenseNo: data.licenseNo,
                            province: data.province,
                            provinceName: data.provinceName,
                            city: data.city,
                            cityName: data.cityName,
                            county: data.county,
                            countyName: data.countyName,
                            level: data.level,
                            gmtLevel: data.gmtLevel === null ? "" : new Date(data.gmtLevel),
                            gmtLevelValidity: data.gmtLevelValidity === null ? "" : new Date(data.gmtLevelValidity),
                            seating: data.seating,
                            commercialInsurances: data.commercialInsurances,
                            mandatoryInsurances: data.mandatoryInsurances,
                            schoolCode: parseInt(data.schoolCode),
                            report: data.report
                        }
                        this.getCarBrands(_manufacturerId, 1, () => {
                            this.editVehiclesForm.brandId = _brandId;
                        });
                        this.getCarBrands(_brandId, 2, () => {
                            this.editVehiclesForm.modelId = _modelId;
                        });
                    }
                    this.detailsVehicleFormVisible = true;
                });
            }
        },
        //添加保险
        addInsurace(insurace) {
            if (insurace === "commercial") {
                this.insuraceForm.commercial.push({
                    insuranceCompany: "",
                    insuranceCode: "",
                    insuranceCost: "",
                    gmtEnd: "",
                    otherCost: ""
                });
            }
            else {
                this.insuraceForm.mandatory.push({
                    insuranceCompany: "",
                    insuranceCode: "",
                    insuranceCost: "",
                    gmtEnd: ""
                });
            }
        },
        //删除保险
        delInsurace(item, insurace) {
            if (insurace === "commercial") {
                var index = this.insuraceForm.commercial.indexOf(item)
                if (index !== -1) {
                    this.insuraceForm.commercial.splice(index, 1);
                }
            }
            else if (insurace === "mandatory") {
                var index = this.insuraceForm.mandatory.indexOf(item)
                if (index !== -1) {
                    this.insuraceForm.mandatory.splice(index, 1);
                }
            }
        },
        //添加车辆
        createNew(target) {
            let refs = this.$refs;
            if (target === "create") {
                this.$refs["addVehiclesForm"].validate((valid) => {
                    if (valid) {
                        if (this.addVehiclesForm.carPhotos === "") {
                            this.$message.error("请先上传车辆图片");
                            return;
                        }
                        else if (this.addVehiclesForm.manufacturerId === "") {
                            this.$message.error("请选择车辆品牌");
                            return;
                        }
                        this.btnLoading = true;
                        this.addVehiclesForm.commercialInsurances = [];
                        this.addVehiclesForm.mandatoryInsurances = [];
                        this.addVehiclesForm.plateColorName = refs.plateColor.selectedLabel;
                        this.addVehiclesForm.gmtAs = this.formatDate(this.addVehiclesForm.gmtAs);
                        this.addVehiclesForm.gmtBuy = this.formatDate(this.addVehiclesForm.gmtBuy);
                        this.addVehiclesForm.gmtLevel = this.formatDate(this.addVehiclesForm.gmtLevel);
                        this.addVehiclesForm.gmtRegister = this.formatDate(this.addVehiclesForm.gmtRegister);
                        this.addVehiclesForm.gmtLevelValidity = this.formatDate(this.addVehiclesForm.gmtLevelValidity);
                        let commercial = this.insuraceForm.commercial;
                        if (commercial.length > 0) {
                            for (var item in commercial) {
                                commercial[item].gmtEnd = this.formatDate(commercial[item].gmtEnd);
                                this.addVehiclesForm.commercialInsurances.push(commercial[item]);
                            }
                        }
                        let mandatory = this.insuraceForm.mandatory;
                        if (mandatory.length > 0) {
                            for (var item in mandatory) {
                                mandatory[item].gmtEnd = this.formatDate(mandatory[item].gmtEnd);
                                this.addVehiclesForm.mandatoryInsurances.push(commercial[item]);
                            }
                        }
                        global.printLog(JSON.stringify(this.addVehiclesForm));
                        let para = Object.assign({}, this.addVehiclesForm);
                        //return;
                        request.basic.vehicle.create(para).then((res) => {
                            this.btnLoading = false;
                            if (res.success) {
                                this.getVehicles();
                                this.resetForm("addVehiclesForm");
                                this.addVehiclesFormVisible = false;
                                this.$message({ message: "车辆添加成功", type: "success" });
                            }
                            else {
                                this.addVehiclesForm.gmtBuy = (this.addVehiclesForm.gmtBuy === "" || this.addVehiclesForm.gmtBuy === undefined ? "" : new Date(this.addVehiclesForm.gmtBuy));
                                this.addVehiclesForm.gmtRegister = (this.addVehiclesForm.gmtRegister === "" || this.addVehiclesForm.gmtRegister === undefined ? "" : new Date(this.addVehiclesForm.gmtRegister));
                                this.addVehiclesForm.gmtLevel = (this.addVehiclesForm.gmtLevel === "" || this.addVehiclesForm.gmtLevel === undefined ? "" : new Date(this.addVehiclesForm.gmtLevel));
                                this.addVehiclesForm.gmtLevelValidity = (this.addVehiclesForm.gmtLevelValidity === "" || this.addVehiclesForm.gmtLevelValidity === undefined ? "" : new Date(this.addVehiclesForm.gmtLevelValidity));
                                this.addVehiclesForm.gmtAs = (this.addVehiclesForm.gmtAs === "" || this.addVehiclesForm.gmtAs === undefined ? "" : new Date(this.addVehiclesForm.gmtAs));
                                this.$message.error("车辆添加失败，原因：" + res.message);
                            }
                        });
                    }
                });
            }
            else {
                this.$refs["editVehiclesForm"].validate((valid) => {
                    if (valid) {
                        if (this.editVehiclesForm.carPhotos === "") {
                            this.$message.error("请先上传车辆图片");
                            return;
                        }
                        else if (this.editVehiclesForm.manufacturerId === "") {
                            this.$message.error("请选择车辆品牌");
                            return;
                        }
                        this.btnLoading = true;
                        this.editVehiclesForm.gmtAs = this.formatDate(this.editVehiclesForm.gmtAs);
                        this.editVehiclesForm.gmtBuy = this.formatDate(this.editVehiclesForm.gmtBuy);
                        this.editVehiclesForm.gmtLevel = this.formatDate(this.editVehiclesForm.gmtLevel);
                        this.editVehiclesForm.gmtRegister = this.formatDate(this.editVehiclesForm.gmtRegister);
                        this.editVehiclesForm.gmtLevelValidity = this.formatDate(this.editVehiclesForm.gmtLevelValidity);
                        //manufacturer brand model
                        global.printLog(JSON.stringify(this.editVehiclesForm));
                        let para = Object.assign({}, this.editVehiclesForm);
                        request.basic.vehicle.edit(para).then((res) => {
                            this.btnLoading = false;
                            if (res.success) {
                                this.getVehicles();
                                this.resetForm("editVehiclesForm");
                                this.editVehiclesFormVisible = false;
                                this.$message({ message: "车辆修改成功", type: "success" });
                            }
                            else {
                                this.editVehiclesForm.gmtAs = this.editVehiclesForm.gmtAs === "" || this.editVehiclesForm.gmtAs === undefined ? "" : new Date(this.editVehiclesForm.gmtAs);
                                this.editVehiclesForm.gmtBuy = this.editVehiclesForm.gmtBuy === "" || this.editVehiclesForm.gmtBuy === undefined ? "" : new Date(this.editVehiclesForm.gmtBuy);
                                this.editVehiclesForm.gmtLevel = this.editVehiclesForm.gmtLevel === "" || this.editVehiclesForm.gmtLevel === undefined ? "" : new Date(this.editVehiclesForm.gmtLevel);
                                this.editVehiclesForm.gmtRegister = this.editVehiclesForm.gmtRegister === "" || this.editVehiclesForm.gmtRegister === undefined ? "" : new Date(this.editVehiclesForm.gmtRegister);
                                this.editVehiclesForm.gmtLevelValidity = this.editVehiclesForm.gmtLevelValidity === "" || this.editVehiclesForm.gmtLevelValidity === undefined ? "" : new Date(this.editVehiclesForm.gmtLevelValidity);
                                this.$message.error("车辆修改失败，原因：" + res.message);
                            }
                        });
                    }
                });
            }
        },
        brandChange(id) {
            this.getCarBrands(id, 1, () => { });
        },
        brandChange1(id) {
            this.getCarBrands(id, 2, () => { });
        },
        //获取单位
        getDepartment() {
            let para = JSON.parse(sessionStorage.getItem("user")).deptId;
            request.backstageManagement.department.query(para).then((res) => {
                if (res.success) {
                    this.departmentData = [];
                    let data = res.object;
                    for (var item in data) {
                        this.departmentData.push(this.recursive(data[item]));
                    }
                }
            });
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
        //处理所选数据
        departmentChange(item) {
            var len = item.length - 1;
            var value = item[len].split("&");
            if (this.addVehiclesFormVisible) {
                this.addVehiclesForm.departmentId = value[0];
                this.addVehiclesForm.departmentName = value[1];
            }
            else if (this.editVehiclesFormVisible) {
                this.editVehiclesForm.departmentId = value[0];
                this.editVehiclesForm.departmentName = value[1];
            }
        },
        //列表翻页
        handleCurrentChange(val) {
            this.page = val;
            this.getVehicles();
        },
        //头像上传成功回调
        handleAvatarScucess(res, file) {
            if (res.success) {
                if (this.addVehiclesFormVisible) {
                    this.addVehiclesForm.carPhotos = res.object[0];
                }
                else {
                    this.editVehiclesForm.carPhotos = res.object[0];
                }
            }
        },
        //头像上传前检测
        beforeAvatarUpload(file) {
            const validateType = file.type === "image/jpg" || file.type === "image/jpeg" || file.type === "image/png";
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!validateType) {
                this.$message.error("上传头像图片只能是 JPG 或 PNG 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
            }
            return validateType && isLt2M;
        },
        handleSelectionChange(data) {
            this.reportTeachers.ids = [];
            for (let item in data) {
                this.reportTeachers.ids.push(data[item].id);
            }
        },
        formatDate(date) {
            return (date === "" || date === undefined ? "" : new Date(date).Format("yyyy-MM-dd"));
        },
        listenData(result, tag) {
            if (this.addVehiclesFormVisible) {
                this.addVehiclesForm.province = result[0].province.code;
                this.addVehiclesForm.city = result[0].city.code;
                this.addVehiclesForm.county = result[0].code;
            }
            else if (this.editVehiclesFormVisible) {
                this.editVehiclesForm.province = result[0].province.code;
                this.editVehiclesForm.city = result[0].city.code;
                this.editVehiclesForm.county = result[0].code;
            }
        },
        //重置表单数据
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.addVehiclesForm.carPhotos = "";
            this.addVehiclesForm.manufacturerId = "";
            this.addVehiclesForm.brandId = "";
            this.addVehiclesForm.modelId = "";
            this.editVehiclesForm.carPhotos = "";
            this.editVehiclesForm.manufacturerId = "";
            this.editVehiclesForm.brandId = "";
            this.editVehiclesForm.modelId = "";
        }
    },
    components: {
        PCA
    },
    activated() {
        global.printLog("activated every one");
        this.getVehicles();
        this.getDepartment();
        this.getVehiclesColors();
        this.getCarType();
        this.getCarBrands("", 0, () => { });
        this.getBranchSchool();
    },
    mounted() {
    }
}

</script>

<style lang="scss">
.insurace-part {
    border-bottom: 1px dotted #dedede;
    margin-bottom: 20px;
    &:last-child {
        border: 0;
        margin: 0;
    }
}
</style>