<template>
    <section v-loading="pageLoading">
        <el-row>
            <el-col :span="24" class="toolbar">
                <el-radio-group v-model="pageListSel" class="mb20" @change="handlePageListSelChange">
                    <el-radio-button label="基本信息"></el-radio-button>
                    <el-radio-button label="年检信息"></el-radio-button>
                    <el-radio-button label="保险信息"></el-radio-button>
                </el-radio-group>
            </el-col>
        </el-row>
        <el-row v-show="pageListSel==='基本信息'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="filters">
                    <el-col :span="12">
                        <el-form-item>
                            <el-input class="search-input" v-model="filters.basic.plat" placeholder="输入车牌号" icon="search" :on-icon-click="queryVehicles"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" class="t-right">
                        <el-form-item>
                            <el-button type="primary" @click="handleOpenWin('new')">新增车辆</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleFiling" :loading="btnLoading" :disabled="reportTeachers.ids.length===0">车辆备案</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="vehicles.basic.list" highlight-current-row @selection-change="handleSelectionChange" @row-click="handleRowClick">
                <el-table-column type="selection" width="35" :selectable="handleSelecTableChange">
                </el-table-column>
                <el-table-column prop="carLicense" label="车牌号">
                </el-table-column>
                <el-table-column prop="carBrands" label="车辆品牌" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="carType" label="培训车型">
                </el-table-column>
                <el-table-column prop="vin" label="车架号">
                </el-table-column>
                <el-table-column prop="superviseStatus" label="状态" :formatter="formatData">
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button type="text" size="small" @click.stop="handleOperating(scope.row,'del')" :disabled="scope.row.superviseStatus==='DOING'">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--工具条-->
            <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="vehicles.basic.total">
            </el-pagination>
            <!--新增车辆界面-->
            <el-dialog title="新增车辆" v-model="addVehiclesFormVisible" :close-on-click-modal="false" size="full">
                <el-form v-if="addVehiclesFormVisible" :model="addVehiclesForm" :rules="vehiclesFormRules" ref="addVehiclesForm" :inline="true" label-width="100px">
                    <p class="group-title">基础信息</p>
                    <el-form-item label="车牌号" prop="carLicense">
                        <el-input auto-complete="off" v-model="addVehiclesForm.carLicense"></el-input>
                    </el-form-item>
                    <el-form-item label="车牌颜色" class="normal" prop="plateColor">
                        <el-select placeholder="请选择车牌颜色" v-model="addVehiclesForm.plateColor" ref="plateColor">
                            <el-option v-for="item in vehiclesColorsOption" :label="item.value" :value="item.key">
                            </el-option>
                        </el-select>
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
                    <el-form-item label="车辆品牌" class="cs" prop="manufacturerId">
                        <el-col :span="7">
                            <el-select placeholder="生产厂家" v-model="addVehiclesForm.manufacturerId" @change="brandChange" ref="manufacturer">
                                <el-option v-for="item in manufacturerData" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="7">
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
                    <el-form-item label="购买日期" prop="gmtBuy">
                        <el-date-picker type="date" placeholder="购买日期" v-model="addVehiclesForm.gmtBuy" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="所属单位" prop="departmentId">
                        <el-cascader :options="departmentData" :show-all-levels="false" @change="departmentChange" :change-on-select="true" v-model="selectedUnitOptions" style="width:192px;">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="所属分校" class="normal" prop="schoolCode">
                        <el-select placeholder="请选择分校" v-model="addVehiclesForm.schoolCode">
                            <el-option v-for="item in branchSchoolData" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-upload class="avatar-uploader" :action="fileUploadAction" :show-file-list="false" :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload" style="position: absolute;top: 70px;right: 35px;">
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
                <el-popover ref="enlargeImage" placement="top" width="300" trigger="hover">
                    <img :src="detailVehicles.carPhotos" style="width:100%;height:100%;" />
                </el-popover>
                <!-- 基本信息 -->
                <div class="basic" style="margin-top:0;padding:0 20px;">
                    <el-form :model="detailVehicles">
                        <el-row>
                            <el-col :span="20">
                                <p class="mt15 detailForm">
                                    <img v-bind:src="detailVehicles.carPhotos" class="photo" v-popover:enlargeImage />
                                    <span class="ml50">{{detailVehicles.cardNo}}【{{editVehiclesForm.superviseStatusText}}】</span>
                                </p>
                            </el-col>
                            <el-col :span="4">
                                <p class="t-right">
                                    <el-button type="primary" size="large" @click="handleOpenWin('edit')" :disabled="detailVehicles.superviseStatus==='DOING'">&nbsp;修改&nbsp;</el-button>
                                </p>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="7">
                                <span>车牌号码：{{detailVehicles.carLicense}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span>车牌颜色：{{detailVehicles.plateColorName}}</span>
                            </el-col>
                            <el-col :span="5">
                                <span>培训车型：{{detailVehicles.carType}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span>车架号：{{detailVehicles.vin}}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="7">
                                <span>发动机编号：{{detailVehicles.engineNo}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span>行驶证号：{{detailVehicles.licenseNo}}</span>
                            </el-col>
                            <el-col :span="11">
                                <span>所属分校：{{detailVehicles.schoolName}}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="7">
                                <span>车辆品牌：{{detailVehicles.brandInfo!=null?detailVehicles.brandInfo.manufacturer.name+'&nbsp;&nbsp;'+detailVehicles.brandInfo.brand.name+'&nbsp;&nbsp;'+detailVehicles.brandInfo.model.name:'--'}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span>购买日期：{{detailVehicles.gmtBuy===null?"":new Date(detailVehicles.gmtBuy).Format("yyyy-MM-dd")}}</span>
                            </el-col>
                            <el-col :span="5">
                                <span>所属单位：{{detailVehicles.departmentName}}</span>
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
                <el-form v-if="editVehiclesFormVisible" :model="editVehiclesForm" :rules="vehiclesFormRules" ref="editVehiclesForm" :inline="true" label-width="100px">
                    <p class="group-title">基础信息</p>
                    <el-form-item label="车牌号" prop="cardNo">
                        <el-input auto-complete="off" v-model="editVehiclesForm.carLicense" :disabled="editVehiclesForm.superviseStatus==='SUCCESS'"></el-input>
                    </el-form-item>
                    <el-form-item label="车牌颜色" class="normal" prop="plateColor">
                        <el-select placeholder="请选择车牌颜色" v-model="editVehiclesForm.plateColor" ref="plateColor">
                            <el-option v-for="item in vehiclesColorsOption" :label="item.value" :value="item.key">
                            </el-option>
                        </el-select>
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
                    <el-form-item label="车辆品牌" class="cs" prop="manufacturerId">
                        <el-col :span="7">
                            <el-select placeholder="生产厂家" v-model="editVehiclesForm.manufacturerId" @change="brandChange" ref="manufacturer">
                                <el-option v-for="item in manufacturerData" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="7">
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
                    <el-form-item label="购买日期" prop="gmtBuy">
                        <el-date-picker type="date" placeholder="购买日期" v-model="editVehiclesForm.gmtBuy" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="所属单位" prop="departmentId">
                        <el-cascader :options="departmentData" :show-all-levels="false" @change="departmentChange" :change-on-select="true" v-model="selectedUnitOptions" style="width:192px;">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="所属分校" class="normal" prop="schoolCode">
                        <el-select placeholder="请选择分校" v-model="editVehiclesForm.schoolCode">
                            <el-option v-for="item in branchSchoolData" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-upload class="avatar-uploader" :action="fileUploadAction" :show-file-list="false" :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload" style="position: absolute;top: 70px;right:35px;">
                        <img v-if="editVehiclesForm.carPhotos" :src="editVehiclesForm.carPhotos" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="editVehiclesFormVisible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click.native="createNew('edit')" :loading="btnLoading">保存</el-button>
                </div>
            </el-dialog>
        </el-row>
        <el-row v-show="pageListSel==='年检信息'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="filters">
                    <el-col :span="20">
                        <el-form-item>
                            <el-input class="search-input" v-model="filters.annualInspection.plat" placeholder="输入车牌号" icon="search" :on-icon-click="queryAnnualCheckList"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-date-picker v-model="filters.annualInspection.daterange" type="daterange" placeholder="选择年检创建日期" :editable="false" @change="handleDateRangeChange"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" class="t-right">
                        <el-form-item>
                            <el-button type="primary" @click="handleOpenWin('new')">新增年检</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="vehicles.annualInspection.list">
                <el-table-column prop="carLicense" label="车牌号">
                </el-table-column>
                <el-table-column prop="gmtLast" label="上次年检日期">
                </el-table-column>
                <el-table-column prop="gmtNext" label="下次年检日期">
                </el-table-column>
                <el-table-column prop="gmtRemind" label="提醒日期">
                </el-table-column>
                <el-table-column prop="remindWays" label="提醒方式" :formatter="formatData">
                </el-table-column>
                <el-table-column prop="gmtCreate" label="创建时间">
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button type="text" size="small" @click.stop="handleOperating(scope.row,'nextRemind')">下次提醒</el-button>
                        <el-button type="text" size="small" @click.stop="handleOperating(scope.row,'edit')">修改</el-button>
                        <el-button type="text" size="small" @click.stop="handleOperating(scope.row,'del')">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--工具条-->
            <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="vehicles.annualInspection.total">
            </el-pagination>
            <el-dialog title="新增年检" v-model="addAnnualCheck.visible" :close-on-click-modal="false" size="tiny">
                <el-form v-if="addAnnualCheck.visible" :model="addAnnualCheck.forms" :rules="addAnnualCheck.rules" ref="addAnnualCheck" label-width="115px" class="mt30">
                    <el-form-item label="车牌号" prop="carLicense">
                        <el-autocomplete v-model="addAnnualCheck.forms.carLicense" style="width:194px;" :fetch-suggestions="querySearchAsync" :trigger-on-focus="false"></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="上次年检日期" class="normal" prop="gmtLast">
                        <el-date-picker v-model="addAnnualCheck.forms.gmtLast" type="date" placeholder="选择下次年检日期" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="下次年检日期" class="normal" prop="gmtNext">
                        <el-date-picker v-model="addAnnualCheck.forms.gmtNext" type="date" placeholder="选择下次年检日期" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="提醒日期" prop="gmtRemind">
                        <el-date-picker v-model="addAnnualCheck.forms.gmtRemind" type="date" placeholder="选择提醒日期" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="提醒方式" class="normal">
                        <el-checkbox-group v-model="addAnnualCheck.forms.remindWays" @change="handleRemindWaysChange">
                            <el-checkbox label="WEB" name="type" :disabled="true">网站推送</el-checkbox>
                            <el-checkbox label="SMS" name="type">短信提醒</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item v-if="addAnnualCheck.forms.remindWays.length>1" v-for="(telephone, index) in addAnnualCheck.forms.telephones" :label="'电话号码'" :key="telephone.key" :prop="'telephones.' + index + '.value'" :rules="[{required:true,message:'请输入电话号码',trigger:'blur'}]">
                        <el-input auto-complete="off" v-model="telephone.value" style="width:194px;"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addAnnualCheck.visible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click.native="createNew('annualCheckAdd')" :loading="addAnnualCheck.btnLoading">保存</el-button>
                </div>
            </el-dialog>
            <el-dialog title="下次提醒" v-model="nextRemindForm.visible" :close-on-click-modal="false" size="tiny">
                <el-form v-if="nextRemindForm.visible" :model="nextRemindForm.forms" :rules="nextRemindForm.rules" ref="nextRemindForm" label-width="115px" class="mt30">
                    <el-form-item label="车牌号" prop="carLicense">
                        <label>{{nextRemindForm.forms.carLicense}}</label>
                    </el-form-item>
                    <!--<el-form-item label="下次年检日期" class="normal" prop="gmtNext">
                                        <el-date-picker v-model="nextRemindForm.forms.gmtNext" type="date" placeholder="选择下次年检日期" :editable="false"></el-date-picker>
                                    </el-form-item>-->
                    <el-form-item label="提醒日期" prop="gmtRemind">
                        <el-date-picker v-model="nextRemindForm.forms.gmtRemind" type="date" placeholder="选择提醒日期" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="提醒方式" class="normal">
                        <el-checkbox-group v-model="nextRemindForm.forms.remindWays" @change="handleRemindWaysChange">
                            <el-checkbox label="WEB" name="type" :disabled="true">网站推送</el-checkbox>
                            <el-checkbox label="SMS" name="type">短信提醒</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item v-if="nextRemindForm.forms.remindWays.length>1" v-for="(telephone, index) in nextRemindForm.forms.telephones" :label="'电话号码'" :key="telephone.key" :prop="'telephones.' + index + '.value'" :rules="[{required:true,message:'请输入电话号码',trigger:'blur'}]">
                        <el-input auto-complete="off" v-model="telephone.value" style="width:194px;"></el-input>
                        <!--<el-button @click.prevent="removeDomain(telephone)">删除</el-button>-->
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="nextRemindForm.visible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click.native="createNew('nextRemind')" :loading="nextRemindForm.btnLoading">保存</el-button>
                </div>
            </el-dialog>
            <el-dialog title="编辑年检" v-model="editAnnualCheck.visible" :close-on-click-modal="false" size="tiny">
                <el-form v-if="editAnnualCheck.visible" :model="editAnnualCheck.forms" :rules="editAnnualCheck.rules" ref="editAnnualCheck" label-width="115px" class="mt30">
                    <el-form-item label="车牌号" prop="carLicense">
                        <label>{{editAnnualCheck.forms.carLicense}}</label>
                    </el-form-item>
                    <el-form-item label="上次年检日期" class="normal" prop="gmtLast">
                        <el-date-picker v-model="editAnnualCheck.forms.gmtLast" type="date" placeholder="选择下次年检日期" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="下次年检日期" class="normal" prop="gmtNext">
                        <el-date-picker v-model="editAnnualCheck.forms.gmtNext" type="date" placeholder="选择下次年检日期" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="提醒日期" prop="gmtRemind">
                        <el-date-picker v-model="editAnnualCheck.forms.gmtRemind" type="date" placeholder="选择提醒日期" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="提醒方式" class="normal">
                        <el-checkbox-group v-model="editAnnualCheck.forms.remindWays" @change="handleRemindWaysChange">
                            <el-checkbox label="WEB" name="type" :disabled="true">网站推送</el-checkbox>
                            <el-checkbox label="SMS" name="type">短信提醒</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item v-if="editAnnualCheck.forms.remindWays.length>1" v-for="(telephone, index) in editAnnualCheck.forms.telephones" :label="'电话号码'" :key="telephone.key" :prop="'telephones.' + index + '.value'" :rules="[{required:true,message:'请输入电话号码',trigger:'blur'}]">
                        <el-input auto-complete="off" v-model="telephone.value" style="width:194px;"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="editAnnualCheck.visible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click.native="createNew('annualCheckEdit')" :loading="editAnnualCheck.btnLoading">保存</el-button>
                </div>
            </el-dialog>
        </el-row>
        <el-row v-show="pageListSel==='保险信息'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="filters">
                    <el-col :span="20">
                        <el-form-item>
                            <el-input class="search-input" v-model="filters.insurance.plat" placeholder="输入车牌号" icon="search" :on-icon-click="queryInsuranceList"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-date-picker v-model="filters.insurance.daterange" type="daterange" placeholder="选择保险创建日期" :editable="false" @change="handleDateRangeChange"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" class="t-right">
                        <el-form-item>
                            <el-button type="primary" @click="handleOpenWin('new')">新增保险</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="vehicles.insurance.list" highlight-current-row @row-click="handleRowClick">
                <el-table-column prop="carLicense" label="车牌号">
                </el-table-column>
                <el-table-column prop="gmtRemind" label="提醒日期">
                </el-table-column>
                <el-table-column prop="remindWays" label="提醒方式" :formatter="formatData">
                </el-table-column>
                <el-table-column prop="gmtCreate" label="创建时间">
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button type="text" size="small" @click.stop="handleOperating(scope.row,'nextRemind')">下次提醒</el-button>
                        <!--<el-button type="text" size="small" @click.stop="handleOperating(scope.row,'edit')">修改</el-button>-->
                        <el-button type="text" size="small" @click.stop="handleOperating(scope.row,'del')">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--工具条-->
            <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="vehicles.insurance.total">
            </el-pagination>
            <!--新增保险-->
            <el-dialog title="新增保险" v-model="insurance.new.visible" :close-on-click-modal="false" size="full">
                <el-form v-if="insurance.new.visible" :model="insurance.new.forms" :rules="insurance.new.rules" ref="addInsurance" label-width="85px" class="mt30" :inline="true">
                    <el-form-item label="车牌号" prop="carLicense">
                        <el-autocomplete v-model="insurance.new.forms.carLicense" style="width:194px;" :fetch-suggestions="querySearchAsync" :trigger-on-focus="false"></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="提醒日期" prop="gmtRemind">
                        <el-date-picker v-model="insurance.new.forms.gmtRemind" type="date" placeholder="选择提醒日期" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="提醒方式" class="normal">
                        <el-checkbox-group v-model="insurance.new.forms.remindWays" @change="handleRemindWaysChange">
                            <el-checkbox label="WEB" name="type" :disabled="true">网站推送</el-checkbox>
                            <el-checkbox label="SMS" name="type">短信提醒</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item v-if="insurance.new.forms.remindWays.length>1" v-for="(telephone, index) in insurance.new.forms.telephones" :label="'电话号码'" :key="telephone.key" :prop="'telephones.' + index + '.value'" :rules="[{required:true,message:'请输入电话号码',trigger:'blur'}]">
                        <el-input auto-complete="off" v-model="telephone.value" style="width:194px;"></el-input>
                    </el-form-item>
                    <p class="group-title ml30">
                        商业险
                        <el-button type="primary" icon="plus" :plain="true" @click="addInsurace('commercial')" class="ml15" title="新增商业险"></el-button>
                    </p>
                    <el-form :model="insuraceForm" ref="insuraceForm" :inline="true" class="demo-form-inline mt15 ml5" label-width="95px">
                        <el-row class="insurace-part" v-for="(item,index) in insuraceForm.commercial">
                            <el-form-item label="保险名称" prop="name">
                                <el-input auto-complete="off" v-model="item.name"></el-input>
                            </el-form-item>
                            <el-form-item label="保险公司" prop="company">
                                <el-input auto-complete="off" v-model="item.company"></el-input>
                            </el-form-item>
                            <el-form-item label="保险单号" prop="code">
                                <el-input auto-complete="off" v-model="item.code"></el-input>
                            </el-form-item>
                            <el-form-item label="保险费用" prop="cost">
                                <el-input auto-complete="off" v-model="item.cost"></el-input>
                            </el-form-item>
                            <el-form-item label="到期日期" prop="gmtEnd">
                                <el-date-picker type="date" placeholder="到期日期" :editable="false" v-model="item.gmtEnd"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="三方责任险" prop="otherCost">
                                <el-input auto-complete="off" v-model="item.otherCost"></el-input>
                            </el-form-item>
                            <!--<el-form-item class="ml30">
                                    <el-upload ref="upload" :action="fileUploadAction" :on-success="fileOnSuccess" :file-list="item.fileList" :auto-upload="false" :show-file-list="false">
                                        <el-button slot="trigger" size="small" type="primary">选取保单附件</el-button>
                                        <el-button style="margin-left: 10px;" size="small" type="success" @click="uploadSubmit(item)">点击上传</el-button>
                                        </el-upload>
                                        <el-upload :action="fileUploadAction" :on-success="fileOnSuccess" :on-remove="fileOnRemove" :file-list="item.fileList" :show-file-list="true">
                                            <el-button size="small" type="primary" v-if="item.fileList.length==0">上传保单附件</el-button>
                                            </el-upload>
                            </el-form-item>-->
                            <el-form-item class="ml15">
                                <el-button type="primary" icon="minus" :plain="true" @click="delInsurace(item,'commercial')" title="删除商业险" v-if="insuraceForm.commercial.length>1"></el-button>
                            </el-form-item>
                        </el-row>
                    </el-form>
                    <p class="group-title ml30">
                        交强险
                        <!--<el-button type="primary" icon="plus" :plain="true" @click="addInsurace('mandatory')" class="ml15" title="新增交强险"></el-button>-->
                    </p>
                    <el-form :model="insuraceForm" ref="insuraceForm" :inline="true" class="demo-form-inline mt15 ml5" label-width="95px">
                        <el-row class="insurace-part" v-for="(item,index) in insuraceForm.mandatory">
                            <el-form-item label="保险名称" prop="name">
                                <el-input auto-complete="off" v-model="item.name"></el-input>
                            </el-form-item>
                            <el-form-item label="保险公司" prop="company">
                                <el-input auto-complete="off" v-model="item.company"></el-input>
                            </el-form-item>
                            <el-form-item label="保险单号" prop="code">
                                <el-input auto-complete="off" v-model="item.code"></el-input>
                            </el-form-item>
                            <el-form-item label="保险费用" prop="cost">
                                <el-input auto-complete="off" v-model="item.cost"></el-input>
                            </el-form-item>
                            <el-form-item label="到期日期" prop="gmtEnd">
                                <el-date-picker type="date" placeholder="到期日期" :editable="false" v-model="item.gmtEnd"></el-date-picker>
                            </el-form-item>
                            <!--<el-button type="primary" icon="minus" :plain="true" @click="delInsurace(item,'mandatory')" class="ml15" title="删除交强险"></el-button>-->
                        </el-row>
                    </el-form>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="insurance.new.visible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click.native="createNew('create')" :loading="insurance.new.btnLoading">保存</el-button>
                </div>
            </el-dialog>
            <!--编辑保险-->
            <el-dialog title="编辑保险" v-model="insurance.edit.visible" :close-on-click-modal="false" size="full">
                <el-form v-if="insurance.edit.visible" :model="insurance.edit.forms" :rules="insurance.edit.rules" ref="editInsurance" label-width="85px" class="mt30" :inline="true">
                    <el-form-item label="车牌号" prop="carLicense">
                        <el-autocomplete v-model="insurance.edit.forms.carLicense" style="width:194px;" :fetch-suggestions="querySearchAsync" :trigger-on-focus="false"></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="提醒日期" prop="gmtRemind">
                        <el-date-picker v-model="insurance.edit.forms.gmtRemind" type="date" placeholder="选择提醒日期" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="提醒方式" class="normal">
                        <el-checkbox-group v-model="insurance.edit.forms.remindWays" @change="handleRemindWaysChange">
                            <el-checkbox label="WEB" name="type" :disabled="true">网站推送</el-checkbox>
                            <el-checkbox label="SMS" name="type">短信提醒</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item v-if="insurance.edit.forms.remindWays.length>1" v-for="(telephone, index) in insurance.edit.forms.telephones" :label="'电话号码'" :key="telephone.key" :prop="'telephones.' + index + '.value'" :rules="[{required:true,message:'请输入电话号码',trigger:'blur'}]">
                        <el-input auto-complete="off" v-model="telephone.value" style="width:194px;"></el-input>
                    </el-form-item>
                    <p class="group-title ml30">
                        商业险
                        <el-button type="primary" icon="plus" :plain="true" @click="addInsurace('commercial')" class="ml15" title="新增商业险"></el-button>
                    </p>
                    <el-form :model="insuraceForm" ref="insuraceForm" :inline="true" class="demo-form-inline mt15 ml5" label-width="95px">
                        <el-row class="insurace-part" v-for="(item,index) in insuraceForm.commercial">
                            <el-form-item label="保险名称" prop="name">
                                <el-input auto-complete="off" v-model="item.name"></el-input>
                            </el-form-item>
                            <el-form-item label="保险公司" prop="company">
                                <el-input auto-complete="off" v-model="item.company"></el-input>
                            </el-form-item>
                            <el-form-item label="保险单号" prop="code">
                                <el-input auto-complete="off" v-model="item.code"></el-input>
                            </el-form-item>
                            <el-form-item label="保险费用" prop="cost">
                                <el-input auto-complete="off" v-model="item.cost"></el-input>
                            </el-form-item>
                            <el-form-item label="到期日期" prop="gmtEnd">
                                <el-date-picker type="date" placeholder="到期日期" :editable="false" v-model="item.gmtEnd"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="三方责任险" prop="otherCost">
                                <el-input auto-complete="off" v-model="item.otherCost"></el-input>
                            </el-form-item>
                            <el-form-item class="ml15">
                                <el-button type="primary" icon="minus" :plain="true" @click="delInsurace(item,'commercial')" title="删除商业险" v-if="insuraceForm.commercial.length>1"></el-button>
                            </el-form-item>
                        </el-row>
                    </el-form>
                    <p class="group-title ml30">
                        交强险
                        <el-button type="primary" icon="plus" :plain="true" @click="addInsurace('mandatory')" class="ml15" title="新增交强险" v-if="insuraceForm.mandatory.length===0"></el-button>
                    </p>
                    <el-form :model="insuraceForm" ref="insuraceForm" :inline="true" class="demo-form-inline mt15 ml5" label-width="95px">
                        <el-row class="insurace-part" v-for="(item,index) in insuraceForm.mandatory">
                            <el-form-item label="保险名称" prop="name">
                                <el-input auto-complete="off" v-model="item.name"></el-input>
                            </el-form-item>
                            <el-form-item label="保险公司" prop="company">
                                <el-input auto-complete="off" v-model="item.company"></el-input>
                            </el-form-item>
                            <el-form-item label="保险单号" prop="code">
                                <el-input auto-complete="off" v-model="item.code"></el-input>
                            </el-form-item>
                            <el-form-item label="保险费用" prop="cost">
                                <el-input auto-complete="off" v-model="item.cost"></el-input>
                            </el-form-item>
                            <el-form-item label="到期日期" prop="gmtEnd">
                                <el-date-picker type="date" placeholder="到期日期" :editable="false" v-model="item.gmtEnd"></el-date-picker>
                            </el-form-item>
                            <el-button type="primary" icon="minus" :plain="true" @click="delInsurace(item,'mandatory')" class="ml15" title="删除交强险" v-if="insuraceForm.mandatory.length===1"></el-button>
                        </el-row>
                    </el-form>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="insurance.edit.visible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click.native="createNew('edit')" :loading="insurance.edit.btnLoading">保存</el-button>
                </div>
            </el-dialog>
            <!--保险详情-->
            <el-dialog title="保险详情" v-model="insurance.detail.visible" :close-on-click-modal="false" size="full">
                <!-- 基本信息 -->
                <div class="basic" style="margin-top:0;padding:0 20px;">
                    <el-form :model="insurance.detail.forms">
                        <el-row class="mt15">
                            <el-col :span="7">
                                <span>车牌号码：{{insurance.detail.forms.carLicense}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span>提醒时间：{{insurance.detail.forms.gmtRemind}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span>提醒方式：{{insurance.detail.forms.remindWays.join("、")}}</span>
                            </el-col>
                            <el-col :span="3" class="t-right">
                                <el-button type="primary" size="large" @click="handleOperating(insurance.detail.forms,'edit')" style="position:absolute;top:0;">&nbsp;修改&nbsp;</el-button>
                            </el-col>
                        </el-row>
                        <el-row v-if="insurance.detail.forms.remindWays.length>1">
                            <el-col :span="20">
                                <span>
                                    电话号码：{{insurance.detail.forms.telephones.join("、")}}
                                </span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-radio-group v-model="radioInsuranceSel" class="mb15">
                                    <el-radio-button label="商业险"></el-radio-button>
                                    <el-radio-button label="交强险"></el-radio-button>
                                </el-radio-group>
                                <!--列表-->
                                <el-table :data="insurance.detail.forms.commercialInsurances" v-show="radioInsuranceSel==='商业险'">
                                    <el-table-column prop="name" label="保险名称" :show-overflow-tooltip="true">
                                    </el-table-column>
                                    <el-table-column prop="company" label="保险公司" :show-overflow-tooltip="true">
                                    </el-table-column>
                                    <el-table-column prop="cost" label="保费">
                                    </el-table-column>
                                    <el-table-column prop="code" label="保险单号">
                                    </el-table-column>
                                    <el-table-column prop="otherCost" label="三方责任险" width="150">
                                    </el-table-column>
                                    <el-table-column prop="gmtEnd" label="到期日期" width="130">
                                    </el-table-column>
                                    <el-table-column prop="gmtModify" label="创建时间" width="130">
                                    </el-table-column>
                                    <!--<el-table-column label="保单原件">
                                        <template scope="scope">
                                            <a :href="scope.row.photos" download="shangyexian">点击下载</a>
                                        </template>
                                    </el-table-column>-->
                                </el-table>
                                <el-table :data="insurance.detail.forms.mandatoryInsurances" v-show="radioInsuranceSel==='交强险'">
                                    <el-table-column prop="name" label="保险名称" :show-overflow-tooltip="true">
                                    </el-table-column>
                                    <el-table-column prop="company" label="保险公司" :show-overflow-tooltip="true">
                                    </el-table-column>
                                    <el-table-column prop="cost" label="保费">
                                    </el-table-column>
                                    <el-table-column prop="code" label="保险单号">
                                    </el-table-column>
                                    <el-table-column prop="gmtEnd" label="到期日期">
                                    </el-table-column>
                                    <el-table-column prop="gmtModify" label="创建时间">
                                    </el-table-column>
                                    <!--<el-table-column label="保单原件">
                                        <template scope="scope">
                                            <a :href="scope.row.photos" download="jiaoqiangxian">点击下载</a>
                                        </template>
                                    </el-table-column>-->
                                </el-table>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="insurance.detail.visible = false" size="large">取消</el-button>
                </div>
            </el-dialog>
            <!--下次提醒（保险）-->
            <el-dialog title="下次提醒" v-model="insurance.nextRemind.visible" :close-on-click-modal="false" size="tiny">
                <el-form v-if="insurance.nextRemind.visible" :model="insurance.nextRemind.forms" :rules="insurance.nextRemind.rules" ref="nextRemindForm" label-width="115px" class="mt30">
                    <el-form-item label="车牌号" prop="carLicense">
                        <label>{{insurance.nextRemind.forms.carLicense}}</label>
                    </el-form-item>
                    <el-form-item label="提醒日期" prop="gmtRemind">
                        <el-date-picker v-model="insurance.nextRemind.forms.gmtRemind" type="date" placeholder="选择提醒日期" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="提醒方式" class="normal">
                        <el-checkbox-group v-model="insurance.nextRemind.forms.remindWays" @change="handleRemindWaysChange">
                            <el-checkbox label="WEB" name="type" :disabled="true">网站推送</el-checkbox>
                            <el-checkbox label="SMS" name="type">短信提醒</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item v-if="insurance.nextRemind.forms.remindWays.length>1" v-for="(telephone, index) in insurance.nextRemind.forms.telephones" :label="'电话号码'" :key="telephone.key" :prop="'telephones.' + index + '.value'" :rules="[{required:true,message:'请输入电话号码',trigger:'blur'}]">
                        <el-input auto-complete="off" v-model="telephone.value" style="width:194px;"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="insurance.nextRemind.visible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click.native="createNew('nextRemind')" :loading="insurance.nextRemind.btnLoading">保存</el-button>
                </div>
            </el-dialog>
        </el-row>
    </section>
</template>

<script>
import $ from "jquery";
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
    data() {
        var checkPhone = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("请填写短信接收电话号码"));
            }
            if (global.fieldVerification.IsPhone(value) < 1) {
                callback(new Error("电话号码格式不正确"));
            }
            else {
                callback();
            }
        }
        return {
            pageLoading: false,
            vehicles: {
                basic: {
                    list: [],
                    total: 0,
                    curPage: 1
                },
                annualInspection: {
                    list: [],
                    total: 0,
                    curPage: 1
                },
                insurance: {
                    list: [],
                    total: 0,
                    curPage: 1
                }
            },
            vehiclesColorsOption: [],
            vehiclesTypeOption: [],
            departmentData: [],
            manufacturerData: [],
            brandsData: [],
            modelData: [],
            branchSchoolData: [],
            filters: {
                basic: {
                    plat: ""
                },
                annualInspection: {
                    plat: "",
                    daterange: []
                },
                insurance: {
                    plat: "",
                    daterange: []
                }
            },
            pageListSel: "基本信息",
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
                carLicense: "",
                plateColor: "",
                plateColorName: "",
                licenseNo: "",
                carType: "",
                vin: "",
                engineNo: "",
                gmtBuy: "",
                manufacturerId: "",
                brandId: "",
                modelId: "",
                carPhotos: "",
                departmentId: "",
                departmentName: ""
            },
            vehiclesFormRules: {
                carLicense: [
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
                // schoolCode: [
                //     { required: true, message: "请选择所属分校", trigger: "change" }
                // ],
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
                //operationNo: "",
                carLicense: "",
                plateColor: "",
                plateColorName: "",
                carPhotos: "",
                manufacturerId: "",
                brandId: "",
                modelId: "",
                carType: "",
                gmtBuy: "",
                //gmtRegister: "",
                //gmtAs: "",
                //vouchStudent: "",
                licenseNo: "",
                //provinceName: "",
                //province: "",
                //cityName: "",
                //city: "",
                //countyName: "",
                //county: "",
                //level: "",
                //gmtLevel: "",
                //gmtLevelValidity: "",
                //seating: "",
                // commercialInsurances: [
                //     {
                //         insuranceCompany: "",
                //         insuranceCost: 0,
                //         otherCost: 0,
                //         insuranceCode: "",
                //         insurancePhotos: "",
                //         gmtEnd: ""
                //     }
                // ],
                // mandatoryInsurances: [
                //     {
                //         insuranceCompany: "",
                //         insuranceCost: 0,
                //         insuranceCode: "",
                //         insurancePhotos: "",
                //         gmtEnd: ""
                //     }
                // ],
                //propValue: "",
                departmentId: 0,
                departmentName: ""
            },
            addAnnualCheck: {
                visible: false,
                forms: {
                    id: "",
                    schoolCode: "",
                    carLicense: "",
                    gmtLast: "",
                    gmtNext: "",
                    gmtRemind: "",
                    remindWays: ["WEB"],
                    telephones: [{ value: "" }]
                },
                rules: {
                    carLicense: [
                        { required: true, message: "请填写车牌号", trigger: "blur" }
                    ],
                    gmtLast: [
                        { type: "date", required: true, message: "请选择上次年检日期", trigger: "blur" }
                    ],
                    gmtNext: [
                        { type: "date", required: true, message: "请选择下次年检日期", trigger: "blur" }
                    ],
                    gmtRemind: [
                        { type: "date", required: true, message: "请选择提醒日期", trigger: "blur" }
                    ]
                },
                btnLoading: false
            },
            editAnnualCheck: {
                visible: false,
                forms: {
                    id: "",
                    schoolCode: "",
                    carLicense: "",
                    gmtLast: "",
                    gmtNext: "",
                    gmtRemind: "",
                    remindWays: ["WEB"],
                    telephones: [{ value: "" }]
                },
                rules: {
                    carLicense: [
                        { required: true, message: "请填写车牌号", trigger: "blur" }
                    ],
                    gmtLast: [
                        { type: "date", required: true, message: "请选择上次年检日期", trigger: "blur" }
                    ],
                    gmtNext: [
                        { type: "date", required: true, message: "请选择下次年检日期", trigger: "blur" }
                    ],
                    gmtRemind: [
                        { type: "date", required: true, message: "请选择提醒日期", trigger: "blur" }
                    ]
                },
                btnLoading: false
            },
            nextRemindForm: {
                visible: false,
                forms: {
                    id: "",
                    schoolCode: "",
                    carLicense: "",
                    gmtLast: "",
                    gmtNext: "",
                    gmtRemind: "",
                    remindWays: ["WEB"],
                    telephones: [{ value: "" }]
                },
                rules: {
                    gmtNext: [
                        { type: "date", required: true, message: "请选择下次年检日期", trigger: "blur" }
                    ],
                    gmtRemind: [
                        { type: "date", required: true, message: "请选择提醒日期", trigger: "blur" }
                    ]
                },
                btnLoading: false
            },
            insurance: {
                new: {
                    visible: false,
                    forms: {
                        carLicense: "",
                        gmtRemind: "",
                        remindWays: ["WEB"],
                        telephones: [{ value: "" }],
                        schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                        commercialInsurances: [],
                        mandatoryInsurances: []
                    },
                    rules: {
                        carLicense: [
                            { required: true, message: "请填写车牌号", trigger: "blur" }
                        ],
                        gmtRemind: [
                            { type: "date", required: true, message: "请选择提醒日期", trigger: "blur" }
                        ]
                    },
                    btnLoading: false
                },
                edit: {
                    visible: false,
                    forms: {
                        carLicense: "",
                        gmtRemind: "",
                        remindWays: ["WEB"],
                        telephones: [{ value: "" }],
                        schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                        commercialInsurances: [],
                        mandatoryInsurances: []
                    },
                    rules: {
                        carLicense: [
                            { required: true, message: "请填写车牌号", trigger: "blur" }
                        ],
                        gmtRemind: [
                            { type: "date", required: true, message: "请选择提醒日期", trigger: "blur" }
                        ]
                    },
                    btnLoading: false
                },
                nextRemind: {
                    visible: false,
                    forms: {
                        id: "",
                        carLicense: "",
                        gmtRemind: "",
                        remindWays: ["WEB"],
                        telephones: [{ value: "" }],
                        schoolCode: "",
                        commercialInsurances: "",
                        mandatoryInsurances: ""
                    },
                    rules: {
                        carLicense: [
                            { required: true, message: "请填写车牌号", trigger: "blur" }
                        ],
                        gmtRemind: [
                            { type: "date", required: true, message: "请选择提醒日期", trigger: "blur" }
                        ]
                    },
                    btnLoading: false
                },
                detail: {
                    visible: false,
                    forms: {
                        carLicense: "",
                        gmtRemind: "",
                        remindWays: [],
                        telephones: [{ value: "" }],
                        schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                        commercialInsurances: [],
                        mandatoryInsurances: []
                    }
                }
            },
            selectedUnitOptions: [],
            editVehiclesFormVisible: false,
            fileUploadAction: sessionStorage.getItem("baseUrl") + "/file/uploadFile",
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            parentSchoolCode: JSON.parse(sessionStorage.getItem("user")).parentSchoolCode,
            btnLoading: false,
            pageSize: global.pageSize
        }
    },
    methods: {
        //数据转换
        formatData(row, column) {
            if (column.property === "superviseStatus") {
                return global.enums.vehicles.superviseStatus[row.superviseStatus];
            }
            else if (column.property === "gmtEnd") {
                return row.gmtEnd === null ? "" : new Date(row.gmtEnd).Format("yyyy-MM-dd");
            }
            else if (column.property === "gmtRemind") {
                return row.gmtRemind === null ? "" : new Date(row.gmtRemind).Format("yyyy-MM-dd");
            }
            else if (column.property === "gmtModify") {
                return row.gmtModify === null ? "" : new Date(row.gmtModify).Format("yyyy-MM-dd");
            }
            else if (column.property === "gmtAs") {
                return row.gmtAs === null ? "" : new Date(row.gmtAs).Format("yyyy-MM-dd");
            }
            else if (column.property === "remindWays") {
                let remindWays = [];
                for (let item in row.remindWays) {
                    remindWays.push(global.enums.remindType[row.remindWays[item]]);
                }
                return remindWays.join("、");
            }
        },
        //获取车辆基本信息列表
        queryVehicles() {
            this.pageLoading = true;
            let para = [this.schoolCode, this.filters.basic.plat, "", "", this.vehicles.basic.curPage, this.pageSize];
            setTimeout(() => {
                request.basic.vehicle.queryList(para).then((res) => {
                    if (res.success === true) {
                        this.pageLoading = false;
                        let data = res.object;
                        //global.printLog(data);
                        this.vehicles.basic.list = [];
                        this.vehicles.basic.total = data.num;
                        for (let item in data.list) {
                            this.vehicles.basic.list.push({
                                id: data.list[item].id,
                                carLicense: data.list[item].carLicense,
                                carBrands: data.list[item].brandInfo.manufacturer.name + " " + data.list[item].brandInfo.brand.name + " " + data.list[item].brandInfo.model.name,
                                carType: data.list[item].carType,
                                vin: data.list[item].vin,
                                superviseStatus: data.list[item].superviseStatus
                            });
                        }
                    }
                });
            }, 1000);
        },
        //获取车辆年检列表
        queryAnnualCheckList() {
            this.pageLoading = true;
            let beginDate = "";
            let endDate = "";
            let daterange = this.filters.annualInspection.daterange;
            if (daterange.length > 0) {
                beginDate = new Date(daterange[0]).Format("yyyy-MM-dd") + " 00:00:00";
                endDate = new Date(daterange[1]).Format("yyyy-MM-dd") + " 23:59:59";
            }
            let para = [this.schoolCode, this.filters.annualInspection.plat, beginDate, endDate, this.vehicles.annualInspection.curPage, this.pageSize];
            setTimeout(() => {
                request.basic.vehicle.queryAnnualCheckList(para).then((res) => {
                    if (res.success === true) {
                        this.pageLoading = false;
                        let data = res.object;
                        global.printLog(data);
                        this.vehicles.annualInspection.list = [];
                        this.vehicles.annualInspection.total = data.num;
                        for (let item in data.list) {
                            this.vehicles.annualInspection.list.push({
                                id: data.list[item].id,
                                schoolCode: data.list[item].schoolCode,
                                carLicense: data.list[item].carLicense,
                                gmtLast: data.list[item].gmtLast == null ? "- -" : new Date(data.list[item].gmtLast).Format("yyyy-MM-dd"),
                                gmtNext: data.list[item].gmtNext == null ? "- -" : new Date(data.list[item].gmtNext).Format("yyyy-MM-dd"),
                                gmtRemind: new Date(data.list[item].gmtRemind).Format("yyyy-MM-dd"),
                                remindWays: data.list[item].remindWays,
                                telephones: data.list[item].telephones,
                                gmtCreate: new Date(data.list[item].gmtCreate).Format("yyyy-MM-dd"),
                                gmtModify: new Date(data.list[item].gmtModify).Format("yyyy-MM-dd")
                            });
                        }
                    }
                });
            }, 1000);
        },
        //获取车辆保险列表
        queryInsuranceList() {
            this.pageLoading = true;
            let beginDate = "";
            let endDate = "";
            let daterange = this.filters.insurance.daterange;
            if (daterange.length > 0) {
                beginDate = new Date(daterange[0]).Format("yyyy-MM-dd") + " 00:00:00";
                endDate = new Date(daterange[1]).Format("yyyy-MM-dd") + " 23:59:59";
            }
            let para = [this.schoolCode, this.filters.insurance.plat, beginDate, endDate, this.vehicles.insurance.curPage, this.pageSize];
            setTimeout(() => {
                request.basic.vehicle.insuranceQuery(para).then((res) => {
                    if (res.success === true) {
                        global.printLog(res);
                        let data = res.object.list;
                        this.pageLoading = false;
                        this.vehicles.insurance.list = [];
                        this.vehicles.insurance.total = res.object.num;
                        for (let item in data) {
                            this.vehicles.insurance.list.push({
                                id: data[item].id,
                                carLicense: data[item].carLicense,
                                commercialInsurances: data[item].commercialInsurances,
                                mandatoryInsurances: data[item].mandatoryInsurances,
                                gmtCreate: new Date(data[item].gmtCreate).Format("yyyy-MM-dd"),
                                gmtModify: new Date(data[item].gmtModify).Format("yyyy-MM-dd"),
                                gmtRemind: new Date(data[item].gmtRemind).Format("yyyy-MM-dd"),
                                remindWays: data[item].remindWays,
                                schoolCode: data[item].schoolCode,
                                telephones: data[item].telephones
                            });
                        }
                    }
                });
            }, 1000);
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
            let para = [this.schoolCode, 1, 1000];
            request.systemSettings.branchSchool.query.list(para).then((res) => {
                if (res.success === true) {
                    let data = res.object.list;
                    this.branchSchoolData = [];
                    this.branchSchoolData.push({
                        label: JSON.parse(sessionStorage.getItem("user")).schoolName,
                        value: this.schoolCode
                    });
                    // if (this.parentSchoolCode === 0) {
                    //     data.unshift({
                    //         schoolName: JSON.parse(sessionStorage.getItem("user")).schoolName,
                    //         schoolCode: this.schoolCode
                    //     });
                    // }
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
        //打开新增窗体
        handleOpenWin(flag) {
            let pageListSel = this.pageListSel;
            if (pageListSel === "基本信息") {
                if (flag === "new") {
                    this.addVehiclesForm = {
                        schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                        carLicense: "",
                        plateColor: "",
                        plateColorName: "",
                        licenseNo: "",
                        carType: "",
                        vin: "",
                        engineNo: "",
                        gmtBuy: "",
                        manufacturerId: "",
                        brandId: "",
                        modelId: "",
                        carPhotos: "",
                        departmentId: "",
                        departmentName: ""
                    };
                    this.selectedUnitOptions = [];
                    this.addVehiclesFormVisible = true;
                    this.getParentDept(JSON.parse(sessionStorage.getItem("user")).deptId, (data) => {
                        if (data.success) {
                            for (var item in data.object) {
                                this.selectedUnitOptions.push(data.object[item].deptId + "&" + data.object[item].deptName);
                            }
                            this.addVehiclesForm.departmentId = global.convertToString(data.object[data.object.length - 1].deptId);
                            this.addVehiclesForm.departmentName = global.convertToString(data.object[data.object.length - 1].deptName);
                        }
                        else {
                            this.$message.error("获取单位列表失败");
                        }
                    });
                }
                else if (flag === "edit") {
                    this.detailsVehicleFormVisible = false;
                    this.editVehiclesFormVisible = true;
                }
            }
            else if (pageListSel === "年检信息") {
                if (flag === "new") {
                    this.addAnnualCheck.forms = {
                        schoolCode: "",
                        carLicense: "",
                        gmtLast: "",
                        gmtNext: "",
                        gmtRemind: "",
                        remindWays: ["WEB"],
                        telephones: [{ value: "" }]
                    }
                    this.addAnnualCheck.visible = true;
                }
            }
            else if (pageListSel === "保险信息") {
                if (flag === "new") {
                    this.insuraceForm.commercial = [];
                    this.insuraceForm.mandatory = [];
                    this.insurance.new.forms = {
                        carLicense: "",
                        gmtRemind: "",
                        remindWays: ["WEB"],
                        telephones: [{ value: "" }],
                        schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                        commercialInsurances: [],
                        mandatoryInsurances: []
                    };
                    this.addInsurace("mandatory");
                    this.addInsurace("commercial");
                    this.insurance.new.visible = true;
                }
            }
        },
        //车辆备案
        handleFiling() {
            let ids = this.reportTeachers.ids;
            if (ids.length > 0) {
                this.btnLoading = true;
                let para = Object.assign({}, this.reportTeachers);
                request.basic.vehicle.report(para).then((res) => {
                    if (res.success) {
                        this.reportTeachers.ids = [];
                        this.$msgbox({
                            title: "系统提示",
                            message: res.object,
                            confirmButtonText: "确定",
                            closeOnClickModal: false,
                            beforeClose: (action, instance, done) => {
                                if (action === "confirm" || action === "cancel") {
                                    done();
                                    this.queryVehicles();
                                }
                            }
                        }).then(action => { });
                    }
                    this.btnLoading = false;
                });
            }
            else {
                this.$message.warning("请先选择车辆！");
            }
        },
        //车辆删除、年检编辑、提醒、删除
        handleOperating(row, operating) {
            let pageListSel = this.pageListSel;
            if (pageListSel === "基本信息" && operating === "del") {
                this.$confirm("删除车辆【" + row.carLicense + "】，其年检和保险会一并删除且不可恢复, 是否继续？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnClickModal: false,
                    type: "warning"
                }).then(() => {
                    request.basic.vehicle.delete(row.id).then((res) => {
                        if (res.success) {
                            this.queryVehicles();
                            this.$message.success("车辆删除成功");
                        }
                        else {
                            this.$message.error("车辆删除失败，原因：" + res.message);
                        }
                    })
                }).catch(() => { });
            }
            else if (pageListSel === "年检信息") {
                if (operating === "nextRemind") {
                    this.nextRemindForm.forms.remindWays = row.remindWays;
                    this.nextRemindForm.forms.telephones = row.remindWays.length > 1 ? [] : [{ value: "" }];
                    this.nextRemindForm.forms.id = row.id;
                    this.nextRemindForm.forms.gmtLast = row.gmtLast === "- -" ? null : row.gmtLast;
                    this.nextRemindForm.forms.schoolCode = row.schoolCode;
                    this.nextRemindForm.forms.carLicense = row.carLicense;
                    this.nextRemindForm.forms.gmtNext = row.gmtNext;
                    this.nextRemindForm.forms.gmtRemind = "";
                    for (let item in row.telephones) {
                        this.nextRemindForm.forms.telephones.push({ value: row.telephones[item] });
                    }
                    this.nextRemindForm.visible = true;
                }
                else if (operating === "edit") {
                    this.editAnnualCheck.forms = {
                        id: row.id,
                        schoolCode: row.schoolCode,
                        carLicense: row.carLicense,
                        gmtLast: row.gmtLast === "- -" ? "" : new Date(row.gmtLast),
                        gmtNext: new Date(row.gmtNext),
                        gmtRemind: new Date(row.gmtRemind),
                        remindWays: row.remindWays,
                        telephones: row.remindWays.length > 1 ? [] : [{ value: "" }]
                    }
                    for (let item in row.telephones) {
                        this.editAnnualCheck.forms.telephones.push({ value: row.telephones[item] });
                    }
                    this.editAnnualCheck.visible = true;
                }
                else {
                    this.$confirm("您正在操作删除年检信息, 是否继续？", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        closeOnClickModal: false,
                        type: "warning"
                    }).then(() => {
                        request.basic.vehicle.delAnnualCheck(row.id).then((res) => {
                            if (res.success === true) {
                                this.queryAnnualCheckList();
                                this.$message.success({ message: "年检删除成功" });
                            }
                            else {
                                this.$message.error("年检删除失败");
                            }
                        });
                    }).catch(() => { });
                }
            }
            else {
                if (operating === "nextRemind") {
                    request.basic.vehicle.insuranceDetailQuery(row.id).then((res) => {
                        if (res.success === true) {
                            let data = res.object;
                            this.insurance.nextRemind.forms = {
                                id: data.id,
                                carLicense: data.carLicense,
                                gmtRemind: "",
                                remindWays: data.remindWays,
                                telephones: data.remindWays.length > 1 ? [] : [{ value: "" }],
                                schoolCode: data.schoolCode,
                                commercialInsurances: data.commercialInsurances,
                                mandatoryInsurances: data.mandatoryInsurances
                            };
                            for (let item in data.telephones) {
                                this.insurance.nextRemind.forms.telephones.push({ value: data.telephones[item] });
                            }
                            this.insurance.nextRemind.visible = true;
                        }
                    });
                }
                else if (operating === "edit") {
                    this.insurance.detail.visible = false;
                    setTimeout(() => {
                        this.insuraceForm.mandatory = [];
                        this.insuraceForm.commercial = [];
                        request.basic.vehicle.insuranceDetailQuery(row.id).then((res) => {
                            if (res.success === true) {
                                let data = res.object;
                                this.insurance.edit.forms = {
                                    id: data.id,
                                    schoolCode: data.schoolCode,
                                    carLicense: data.carLicense,
                                    gmtRemind: new Date(data.gmtRemind),
                                    remindWays: data.remindWays,
                                    telephones: data.remindWays.length > 1 ? [] : [{ value: "" }]
                                }
                                for (let item in data.telephones) {
                                    this.insurance.edit.forms.telephones.push({ value: data.telephones[item] });
                                }
                                let commercialInsurances = data.commercialInsurances;
                                for (let item in commercialInsurances) {
                                    this.insuraceForm.commercial.push({
                                        name: commercialInsurances[item].name,
                                        code: commercialInsurances[item].code,
                                        company: commercialInsurances[item].company,
                                        gmtEnd: commercialInsurances[item].gmtEnd,
                                        cost: commercialInsurances[item].cost,
                                        otherCost: commercialInsurances[item].otherCost,
                                        photos: "http://img.haoxueche.com:8888/group1/M00/01/C6/wKgKH1j0VoGAIcqtAAB82yFOkbc455.jpg"
                                    });
                                }
                                let mandatoryInsurances = data.mandatoryInsurances;
                                for (let item in mandatoryInsurances) {
                                    this.insuraceForm.mandatory.push({
                                        name: mandatoryInsurances[item].name,
                                        code: mandatoryInsurances[item].code,
                                        company: mandatoryInsurances[item].company,
                                        gmtEnd: mandatoryInsurances[item].gmtEnd,
                                        cost: mandatoryInsurances[item].cost,
                                        photos: "http://img.haoxueche.com:8888/group1/M00/01/C6/wKgKH1j0VoGAIcqtAAB82yFOkbc455.jpg"
                                    });
                                }
                                this.insurance.edit.visible = true;
                            }
                        });
                    }, 200);
                }
                else {
                    this.$confirm("您正在操作删除保险信息, 是否继续？", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        closeOnClickModal: false,
                        type: "warning"
                    }).then(() => {
                        request.basic.vehicle.delInsurance(row.id).then((res) => {
                            if (res.success) {
                                this.queryInsuranceList();
                                this.$message.success("保险删除成功");
                            }
                            else {
                                this.$message.error("保险删除失败，原因：" + res.message);
                            }
                        });
                    }).catch(() => { });
                }
            }
        },
        //车辆列表行点击
        handleRowClick(row, evt, column) {
            if (column.type === "default") {
                if (this.pageListSel === "基本信息") {
                    request.basic.vehicle.queryDetail(row.id).then((res) => {
                        if (res.success) {
                            let data = res.object;
                            global.printLog(data);
                            this.detailVehicles = data;
                            let _brandId = data.brandInfo.brand.id;
                            let _modelId = data.brandInfo.model.id;
                            let _manufacturerId = data.brandInfo.manufacturer.id;
                            this.editVehiclesForm = {
                                id: data.id,
                                vin: data.vin,
                                engineNo: data.engineNo,
                                operationNo: data.operationNo,
                                carLicense: data.carLicense,
                                plateColor: parseInt(data.plateColor),
                                plateColorName: data.plateColorName,
                                carPhotos: data.carPhotos,
                                manufacturerId: _manufacturerId,
                                modelId: _modelId,
                                brandId: _brandId,
                                carType: data.carType,
                                gmtBuy: data.gmtBuy === null ? "" : new Date(data.gmtBuy),
                                licenseNo: data.licenseNo,
                                schoolCode: parseInt(data.schoolCode),
                                superviseStatus: data.superviseStatus,
                                superviseStatusText: global.enums.vehicles.superviseStatus[data.superviseStatus],
                                departmentId: 0,
                                departmentName: ""
                            }
                            this.getCarBrands(_manufacturerId, 1, () => {
                                this.editVehiclesForm.brandId = _brandId;
                            });
                            this.getCarBrands(_brandId, 2, () => {
                                this.editVehiclesForm.modelId = _modelId;
                            });
                            this.selectedUnitOptions = [];
                            this.getParentDept(data.departmentId, (data) => {
                                if (data.success) {
                                    for (var item in data.object) {
                                        this.selectedUnitOptions.push(data.object[item].deptId + "&" + data.object[item].deptName);
                                    }
                                }
                                this.editVehiclesForm.departmentId = global.convertToString(data.object[data.object.length - 1].deptId);
                                this.editVehiclesForm.departmentName = global.convertToString(data.object[data.object.length - 1].deptName);
                            });
                        }
                        this.detailsVehicleFormVisible = true;
                    });
                }
                else if (this.pageListSel === "保险信息") {
                    this.radioInsuranceSel = "商业险";
                    request.basic.vehicle.insuranceDetailQuery(row.id).then((res) => {
                        if (res.success === true) {
                            let data = res.object;
                            this.insurance.detail.forms = {
                                id: data.id,
                                carLicense: data.carLicense,
                                gmtRemind: new Date(data.gmtRemind).Format("yyyy-MM-dd"),
                                remindWays: [],
                                telephones: [],
                                schoolCode: data.schoolCode,
                                commercialInsurances: [],
                                mandatoryInsurances: []
                            };
                            for (let item in data.telephones) {
                                this.insurance.detail.forms.telephones.push(data.telephones[item]);
                            }
                            for (let item in data.remindWays) {
                                this.insurance.detail.forms.remindWays.push(global.enums.remindType[data.remindWays[item]]);
                            }
                            for (let item in data.commercialInsurances) {
                                this.insurance.detail.forms.commercialInsurances.push({
                                    insuranceId: data.commercialInsurances[item].insuranceId,
                                    name: data.commercialInsurances[item].name,
                                    code: data.commercialInsurances[item].code,
                                    company: data.commercialInsurances[item].company,
                                    cost: data.commercialInsurances[item].cost,
                                    otherCost: data.commercialInsurances[item].otherCost,
                                    photos: data.commercialInsurances[item].photos,
                                    gmtModify: new Date(data.gmtModify).Format("yyyy-MM-dd"),
                                    gmtEnd: new Date(data.commercialInsurances[item].gmtEnd).Format("yyyy-MM-dd"),
                                });
                            }
                            for (let item in data.mandatoryInsurances) {
                                this.insurance.detail.forms.mandatoryInsurances.push({
                                    insuranceId: data.mandatoryInsurances[item].insuranceId,
                                    name: data.mandatoryInsurances[item].name,
                                    code: data.mandatoryInsurances[item].code,
                                    company: data.mandatoryInsurances[item].company,
                                    cost: data.mandatoryInsurances[item].cost,
                                    photos: data.mandatoryInsurances[item].photos,
                                    gmtModify: new Date(data.gmtModify).Format("yyyy-MM-dd"),
                                    gmtEnd: new Date(data.mandatoryInsurances[item].gmtEnd).Format("yyyy-MM-dd"),
                                });
                            }
                            this.insurance.detail.visible = true;
                        }
                    });
                }
            }
        },
        //添加保险
        addInsurace(insurace) {
            if (insurace === "commercial") {
                this.insuraceForm.commercial.push({
                    name: "",
                    code: "",
                    company: "",
                    gmtEnd: "",
                    cost: "",
                    otherCost: "",
                    photos: "http://img.haoxueche.com:8888/group1/M00/01/C6/wKgKH1j0VoGAIcqtAAB82yFOkbc455.jpg"
                });
            }
            else {
                this.insuraceForm.mandatory.push({
                    name: "",
                    code: "",
                    company: "",
                    gmtEnd: "",
                    cost: "",
                    photos: "http://img.haoxueche.com:8888/group1/M00/01/C6/wKgKH1j0VoGAIcqtAAB82yFOkbc455.jpg"
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
        //添加/编辑车辆、年检、保险
        createNew(target) {
            let refs = this.$refs;
            let pageListSel = this.pageListSel;
            if (pageListSel === "基本信息") {
                if (target === "create") {
                    refs["addVehiclesForm"].validate((valid) => {
                        if (valid) {
                            if (this.addVehiclesForm.carPhotos === "") {
                                this.$message.error("请先上传车辆图片");
                                return;
                            }
                            this.btnLoading = true;
                            this.addVehiclesForm.plateColorName = refs.plateColor.selectedLabel;
                            this.addVehiclesForm.gmtBuy = new Date(this.addVehiclesForm.gmtBuy).Format("yyyy-MM-dd");
                            global.printLog(JSON.stringify(this.addVehiclesForm));
                            let para = Object.assign({}, this.addVehiclesForm);
                            request.basic.vehicle.create(para).then((res) => {
                                this.btnLoading = false;
                                if (res.success) {
                                    this.queryVehicles();
                                    this.resetForm("addVehiclesForm");
                                    this.addVehiclesFormVisible = false;
                                    this.$message({ message: "车辆添加成功", type: "success" });
                                }
                                else {
                                    this.addVehiclesForm.gmtBuy = (this.addVehiclesForm.gmtBuy === "" || this.addVehiclesForm.gmtBuy === undefined ? "" : new Date(this.addVehiclesForm.gmtBuy));
                                    this.$message.error("车辆添加失败，原因：" + res.message);
                                }
                            });
                        }
                    });
                }
                else {
                    refs["editVehiclesForm"].validate((valid) => {
                        if (valid) {
                            if (this.editVehiclesForm.carPhotos === "") {
                                this.$message.error("请先上传车辆图片");
                                return;
                            }
                            this.btnLoading = true;
                            this.editVehiclesForm.plateColorName = refs.plateColor.selectedLabel;
                            this.editVehiclesForm.gmtBuy = new Date(this.editVehiclesForm.gmtBuy).Format("yyyy-MM-dd");
                            global.printLog(JSON.stringify(this.editVehiclesForm));
                            let para = Object.assign({}, this.editVehiclesForm);
                            request.basic.vehicle.edit(para).then((res) => {
                                this.btnLoading = false;
                                if (res.success) {
                                    this.queryVehicles();
                                    this.resetForm("editVehiclesForm");
                                    this.editVehiclesFormVisible = false;
                                    this.$message.success({ message: "车辆修改成功" });
                                }
                                else {
                                    this.editVehiclesForm.gmtBuy = this.editVehiclesForm.gmtBuy === "" || this.editVehiclesForm.gmtBuy === undefined ? "" : new Date(this.editVehiclesForm.gmtBuy);
                                    this.$message.error("车辆修改失败，原因：" + res.message);
                                }
                            });
                        }
                    });
                }
            }
            else if (pageListSel === "年检信息") {
                if (target === "nextRemind") {
                    refs["nextRemindForm"].validate((valid) => {
                        if (valid) {
                            let phones = [];
                            let forms = this.nextRemindForm.forms;
                            for (let item in forms.telephones) {
                                if (forms.telephones[item].value === "") {
                                    continue;
                                }
                                if (global.fieldVerification.IsPhone(forms.telephones[item].value) < 1) {
                                    this.$message.error("电话号码格式不正确");
                                    return;
                                }
                                else {
                                    phones.push(forms.telephones[item].value);
                                }
                            }
                            this.nextRemindForm.btnLoading = true;
                            let paras = {
                                id: forms.id,
                                schoolCode: forms.schoolCode,
                                carLicense: forms.carLicense,
                                gmtLast: new Date(forms.gmtLast).Format("yyyy-MM-dd"),
                                gmtNext: new Date(forms.gmtNext).Format("yyyy-MM-dd"),
                                gmtRemind: new Date(forms.gmtRemind).Format("yyyy-MM-dd"),
                                remindWays: forms.remindWays,
                                telephones: phones
                            }
                            request.basic.vehicle.editAnnualCheck(paras).then((res) => {
                                if (res.success === true) {
                                    this.queryAnnualCheckList();
                                    this.nextRemindForm.visible = false;
                                    this.$message.success({ message: "提醒设置成功" });
                                }
                                else {
                                    this.$message.error("提醒设置失败");
                                }
                                this.nextRemindForm.btnLoading = false;
                            });
                        }
                    });
                }
                else if (target === "annualCheckAdd") {
                    refs["addAnnualCheck"].validate((valid) => {
                        if (valid) {
                            let phones = [];
                            let forms = this.addAnnualCheck.forms;
                            let remindTime = new Date(forms.gmtRemind).getTime();
                            let lastTime = new Date(forms.gmtLast).getTime();
                            let nextTime = new Date(forms.gmtNext).getTime();
                            if (lastTime >= nextTime) {
                                this.$message.info("上次年检日期必须小于下次年检日期");
                            }
                            else if (remindTime <= lastTime || remindTime >= nextTime) {
                                this.$message.info("提醒日期应该大于上次年检日期且小于下次年检日期");
                            }
                            else {
                                for (let item in forms.telephones) {
                                    if (forms.telephones[item].value === "") {
                                        continue;
                                    }
                                    if (global.fieldVerification.IsPhone(forms.telephones[item].value) < 1) {
                                        this.$message.error("电话号码格式不正确");
                                        return;
                                    }
                                    else {
                                        phones.push(forms.telephones[item].value);
                                    }
                                }
                                this.addAnnualCheck.btnLoading = true;
                                let paras = {
                                    schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                                    carLicense: forms.carLicense,
                                    gmtLast: new Date(forms.gmtLast).Format("yyyy-MM-dd"),
                                    gmtNext: new Date(forms.gmtNext).Format("yyyy-MM-dd"),
                                    gmtRemind: new Date(forms.gmtRemind).Format("yyyy-MM-dd"),
                                    remindWays: forms.remindWays,
                                    telephones: phones
                                }
                                request.basic.vehicle.addAnnualCheck(paras).then((res) => {
                                    if (res.success === true) {
                                        this.queryAnnualCheckList();
                                        this.addAnnualCheck.visible = false;
                                        this.$message.success({ message: "新增年检成功" });
                                    }
                                    else {
                                        this.$message.error("新增年检失败，原因：" + res.message);
                                    }
                                    this.addAnnualCheck.btnLoading = false;
                                });
                            }
                        }
                    });
                }
                else if (target === "annualCheckEdit") {
                    refs["editAnnualCheck"].validate((valid) => {
                        if (valid) {
                            let phones = [];
                            let forms = this.editAnnualCheck.forms;
                            let remindTime = new Date(forms.gmtRemind).getTime();
                            let lastTime = new Date(forms.gmtLast).getTime();
                            let nextTime = new Date(forms.gmtNext).getTime();
                            if (lastTime >= nextTime) {
                                this.$message.info("上次年检日期必须小于下次年检日期");
                            }
                            else if (remindTime <= lastTime || remindTime >= nextTime) {
                                this.$message.info("提醒日期应该大于上次年检日期且小于下次年检日期");
                            }
                            else {
                                for (let item in forms.telephones) {
                                    if (forms.telephones[item].value === "") {
                                        continue;
                                    }
                                    if (global.fieldVerification.IsPhone(forms.telephones[item].value) < 1) {
                                        this.$message.error("电话号码格式不正确");
                                        return;
                                    }
                                    else {
                                        phones.push(forms.telephones[item].value);
                                    }
                                }
                                this.editAnnualCheck.btnLoading = true;
                                let paras = {
                                    id: forms.id,
                                    schoolCode: forms.schoolCode,
                                    carLicense: forms.carLicense,
                                    gmtLast: new Date(forms.gmtLast).Format("yyyy-MM-dd"),
                                    gmtNext: new Date(forms.gmtNext).Format("yyyy-MM-dd"),
                                    gmtRemind: new Date(forms.gmtRemind).Format("yyyy-MM-dd"),
                                    remindWays: forms.remindWays,
                                    telephones: phones
                                }
                                request.basic.vehicle.editAnnualCheck(paras).then((res) => {
                                    if (res.success === true) {
                                        this.queryAnnualCheckList();
                                        this.editAnnualCheck.visible = false;
                                        this.$message.success({ message: "年检编辑成功" });
                                    }
                                    else {
                                        this.$message.error("年检编辑失败");
                                    }
                                    this.editAnnualCheck.btnLoading = false;
                                });
                            }
                        }
                    });
                }
            }
            else {
                if (target === "create") {
                    refs["addInsurance"].validate((valid) => {
                        if (valid) {
                            let commercial = this.insuraceForm.commercial;
                            this.insurance.new.forms.commercialInsurances = [];
                            if (commercial.length > 0) {
                                for (var item in commercial) {
                                    if (commercial[item].name !== "" && commercial[item].code !== "" && commercial[item].company !== "" && commercial[item].gmtEnd !== "" && commercial[item].cost !== "" && commercial[item].otherCost !== "" && commercial[item].photos !== "") {
                                        commercial[item].gmtEnd = new Date(commercial[item].gmtEnd).Format("yyyy-MM-dd");
                                        this.insurance.new.forms.commercialInsurances.push(commercial[item]);
                                    }
                                }
                            }
                            let mandatory = this.insuraceForm.mandatory;
                            this.insurance.new.forms.mandatoryInsurances = [];
                            if (mandatory.length > 0) {
                                for (var item in mandatory) {
                                    if (mandatory[item].name !== "" && mandatory[item].code !== "" && mandatory[item].company !== "" && mandatory[item].gmtEnd !== "" && mandatory[item].cost !== "" && mandatory[item].photos !== "") {
                                        mandatory[item].gmtEnd = new Date(mandatory[item].gmtEnd).Format("yyyy-MM-dd");
                                        this.insurance.new.forms.mandatoryInsurances.push(mandatory[item]);
                                    }
                                }
                            }
                            if (this.insurance.new.forms.commercialInsurances.length == 0 && this.insurance.new.forms.mandatoryInsurances.length == 0) {
                                this.$message.error("请指定一种保险");
                            }
                            else {
                                let phones = [];
                                let forms = this.insurance.new.forms;
                                for (let item in forms.telephones) {
                                    if (forms.telephones[item].value === "") {
                                        continue;
                                    }
                                    if (global.fieldVerification.IsPhone(forms.telephones[item].value) < 1) {
                                        this.$message.error("电话号码格式不正确");
                                        return;
                                    }
                                    else {
                                        phones.push(forms.telephones[item].value);
                                    }
                                }
                                this.insurance.new.btnLoading = true;
                                let paras = {
                                    telephones: phones,
                                    schoolCode: forms.schoolCode,
                                    carLicense: forms.carLicense,
                                    remindWays: forms.remindWays,
                                    gmtRemind: new Date(forms.gmtRemind).Format("yyyy-MM-dd"),
                                    commercialInsurances: forms.commercialInsurances,
                                    mandatoryInsurances: forms.mandatoryInsurances
                                }
                                request.basic.vehicle.createInsurance(paras).then((res) => {
                                    if (res.success === true) {
                                        this.queryInsuranceList();
                                        this.insurance.new.visible = false;
                                        this.$message.success({ message: "保险新增成功" });
                                    }
                                    else {
                                        this.$message.error("保险新增失败");
                                    }
                                    this.insurance.new.btnLoading = false;
                                });
                            }
                        }
                    });
                }
                else if (target === "nextRemind") {
                    refs["nextRemindForm"].validate((valid) => {
                        if (valid) {
                            let phones = [];
                            let forms = this.insurance.nextRemind.forms;
                            for (let item in forms.telephones) {
                                if (forms.telephones[item].value === "") {
                                    continue;
                                }
                                if (global.fieldVerification.IsPhone(forms.telephones[item].value) < 1) {
                                    this.$message.error("电话号码格式不正确");
                                    return;
                                }
                                else {
                                    phones.push(forms.telephones[item].value);
                                }
                            }
                            this.insurance.nextRemind.btnLoading = true;
                            let paras = {
                                id: forms.id,
                                schoolCode: forms.schoolCode,
                                carLicense: forms.carLicense,
                                gmtRemind: new Date(forms.gmtRemind).Format("yyyy-MM-dd"),
                                remindWays: forms.remindWays,
                                telephones: phones,
                                commercialInsurances: forms.commercialInsurances,
                                mandatoryInsurances: forms.mandatoryInsurances
                            }
                            request.basic.vehicle.editInsurance(paras).then((res) => {
                                if (res.success === true) {
                                    this.queryInsuranceList();
                                    this.insurance.nextRemind.visible = false;
                                    this.$message.success({ message: "提醒设置成功" });
                                }
                                else {
                                    this.$message.error("提醒设置失败");
                                }
                                this.insurance.nextRemind.btnLoading = false;
                            });
                        }
                    });
                }
                else if (target === "edit") {
                    refs["editInsurance"].validate((valid) => {
                        if (valid) {
                            let commercial = this.insuraceForm.commercial;
                            this.insurance.edit.forms.commercialInsurances = [];
                            if (commercial.length > 0) {
                                for (var item in commercial) {
                                    if (commercial[item].name !== "" && commercial[item].code !== "" && commercial[item].company !== "" && commercial[item].gmtEnd !== "" && commercial[item].cost !== "" && commercial[item].otherCost !== "" && commercial[item].photos !== "") {
                                        commercial[item].gmtEnd = new Date(commercial[item].gmtEnd).Format("yyyy-MM-dd");
                                        this.insurance.edit.forms.commercialInsurances.push(commercial[item]);
                                    }
                                }
                            }
                            let mandatory = this.insuraceForm.mandatory;
                            this.insurance.edit.forms.mandatoryInsurances = [];
                            if (mandatory.length > 0) {
                                for (var item in mandatory) {
                                    if (mandatory[item].name !== "" && mandatory[item].code !== "" && mandatory[item].company !== "" && mandatory[item].gmtEnd !== "" && mandatory[item].cost !== "" && mandatory[item].photos !== "") {
                                        mandatory[item].gmtEnd = new Date(mandatory[item].gmtEnd).Format("yyyy-MM-dd");
                                        this.insurance.edit.forms.mandatoryInsurances.push(mandatory[item]);
                                    }
                                }
                            }
                            if (this.insurance.edit.forms.commercialInsurances.length == 0 && this.insurance.edit.forms.mandatoryInsurances.length == 0) {
                                this.$message.error("请指定一种保险");
                            }
                            else {
                                let phones = [];
                                let forms = this.insurance.edit.forms;
                                for (let item in forms.telephones) {
                                    if (forms.telephones[item].value === "") {
                                        continue;
                                    }
                                    if (global.fieldVerification.IsPhone(forms.telephones[item].value) < 1) {
                                        this.$message.error("电话号码格式不正确");
                                        return;
                                    }
                                    else {
                                        phones.push(forms.telephones[item].value);
                                    }
                                }
                                this.insurance.edit.btnLoading = true;
                                let paras = {
                                    id: forms.id,
                                    telephones: phones,
                                    schoolCode: forms.schoolCode,
                                    carLicense: forms.carLicense,
                                    remindWays: forms.remindWays,
                                    gmtRemind: new Date(forms.gmtRemind).Format("yyyy-MM-dd"),
                                    commercialInsurances: this.insurance.edit.forms.commercialInsurances,
                                    mandatoryInsurances: this.insurance.edit.forms.mandatoryInsurances
                                }
                                request.basic.vehicle.editInsurance(paras).then((res) => {
                                    if (res.success === true) {
                                        this.queryInsuranceList();
                                        this.insurance.edit.visible = false;
                                        this.$message.success({ message: "保险编辑成功" });
                                    }
                                    else {
                                        this.$message.error("保险编辑失败");
                                    }
                                    this.insurance.edit.btnLoading = false;
                                });
                            }
                        }
                    });
                }
            }
        },
        brandChange(id) {
            this.getCarBrands(id, 1, () => { });
        },
        brandChange1(id) {
            this.getCarBrands(id, 2, () => { });
            // this.$message({message:'what the fuck!',type:'success'});
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
        //根据deptId查询所有上级部门
        getParentDept(deptId, callback) {
            request.backstageManagement.department.queryParentDeptById(deptId).then((res) => {
                callback(res);
            });
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
            if (this.pageListSel === "基本信息") {
                this.vehicles.basic.curPage = val;
                this.queryVehicles();
            }
            else if (this.pageListSel === "年检信息") {
                this.vehicles.annualInspection.curPage = val;
                this.queryAnnualCheckList();
            }
            else {
                this.vehicles.insurance.curPage = val;
                this.queryInsuranceList();
            }
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
        //车辆列表根据备案状态控制复选框是否可选
        handleSelecTableChange(row) {
            return row.superviseStatus === "DOING" ? false : true;
        },
        handlePageListSelChange(val) {
            if (val === "基本信息") {
                this.queryVehicles();
            }
            else if (val === "年检信息") {
                this.queryAnnualCheckList();
            }
            else {
                this.queryInsuranceList();
            }
        },
        handleDateRangeChange(daterange) {
            this.filters.insurance.daterange = [];
            this.filters.annualInspection.daterange = [];
            if (this.pageListSel === "年检信息") {
                if (daterange !== "") {
                    this.filters.annualInspection.daterange.push(daterange.split(" - ")[0]);
                    this.filters.annualInspection.daterange.push(daterange.split(" - ")[1]);
                }
                this.queryAnnualCheckList();
            }
            else {
                if (daterange !== "") {
                    this.filters.insurance.daterange.push(daterange.split(" - ")[0]);
                    this.filters.insurance.daterange.push(daterange.split(" - ")[1]);
                }
                this.queryInsuranceList();
            }
        },
        handleRemindWaysChange(data) {
            if (data.length === 1) {
                this.nextRemindForm.forms.telephones = [{ value: "" }];
                this.editAnnualCheck.forms.telephones = [{ value: "" }];
                this.addAnnualCheck.forms.telephones = [{ value: "" }];
                this.insurance.new.forms.telephones = [{ value: "" }];
                this.insurance.edit.forms.telephones = [{ value: "" }];
            }
            this.nextRemindForm.forms.remindWays = data;
            this.editAnnualCheck.forms.remindWays = data;
            this.addAnnualCheck.forms.remindWays = data;
            this.insurance.new.forms.remindWays = data;
            this.insurance.edit.forms.remindWays = data;
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
        },
        querySearchAsync(queryString, callback) {
            let para = [this.schoolCode, queryString, "", "", 1, 100000];
            request.basic.vehicle.queryList(para).then((res) => {
                if (res.success === true) {
                    let vehicles = [];
                    let data = res.object.list;
                    for (let item in data) {
                        vehicles.push({ value: data[item].carLicense });
                    }
                    //console.log(vehicles.filter((item) => { return (item.value); }));
                    callback(vehicles.filter((item) => { return (item.value); }));
                }
            });
        },
        fileOnRemove(file, fileList) {
            global.printLog(file, fileList);
        },
        fileOnSuccess(response, file, fileList) {
            global.printLog(response);
            global.printLog(file);
            global.printLog(fileList);
        },
        uploadSubmit(item) {
            global.printLog(this.$refs["upload"]);
            //this.$refs["upload"].submit();
        }
    },
    activated() {
        global.printLog("activated every one");
        this.queryVehicles();
        this.getDepartment();
        this.getVehiclesColors();
        this.getCarType();
        this.getCarBrands("", 0, () => { });
        this.getBranchSchool();
        //this.queryAnnualCheckList();
        //this.queryInsuranceList();
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