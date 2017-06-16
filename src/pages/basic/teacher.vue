<template>
    <section v-loading="pageLoading">
        <el-row class="mb20">
            <el-col :span="20">
                <el-radio-group v-model="radioHeaderSel" @change="teacherTypeChange">
                    <el-radio-button label="教练员"></el-radio-button>
                    <el-radio-button label="安全员"></el-radio-button>
                    <el-radio-button label="考核员"></el-radio-button>
                </el-radio-group>
            </el-col>
        </el-row>
        <a href="" download=".xlsx" id="down-link"></a>
        <el-row v-if="radioHeaderSel==='教练员'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input class="search-input mr40" v-model="filters.teacher.keyWord" placeholder="输入教练姓名、电话" icon="search" :on-icon-click="getTeachers"></el-input>
                    </el-form-item>
                    <el-dropdown @command="handleCommand" class="right">
                        <el-button type="primary">
                            批量操作
                            <i class="el-icon-caret-bottom el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="export">导出表格</el-dropdown-item>
                            <el-dropdown-item command="record">备案监管平台</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button type="primary" @click="handleAdd(1)" class="mr20 right">添加新教员</el-button>
                </el-form>
                <!--列表-->
                <el-table :data="teachers.data" highlight-current-row @selection-change="handleSelectionChange" @row-click="rowClick" v-if="radioHeaderSel==='教练员'">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="teacherName" label="教练姓名"></el-table-column>
                    <el-table-column prop="phone" label="电话"></el-table-column>
                    <el-table-column prop="idNumber" label="身份证"></el-table-column>
                    <el-table-column prop="teachCarTypeName" label="培训车型"></el-table-column>
                    <el-table-column prop="schoolName" label="所属分校"></el-table-column>
                    <el-table-column prop="bindCar" label="绑定车辆"></el-table-column>
                    <el-table-column prop="appointmentTeacher" label="预约教练" :formatter="formatTableData"></el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="text" size="small" @click.stop="coachNewForm(scope.row)" :disabled="scope.row.appointmentTeacher?false:true">报班</el-button>
                            <el-button type="text" size="small" @click.stop="coachLeave(scope.row)">请假</el-button>
                            <el-button type="text" size="small" @click.stop="handleDelete(scope.row,'teacher')">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="teachers.total">
                </el-pagination>
            </el-col>
            <!--新增教练员界面-->
            <el-dialog title="新增教练" v-model="addCoachFormVisible" :close-on-click-modal="false" size="full" @close="dialogClose">
                <el-form v-if="addCoachFormVisible" :model="addCoachForm" :rules="coachFormRules" ref="addCoachForm" :inline="true" class="demo-form-inline" label-width="85px">
                    <p class="group-title">个人信息</p>
                    <el-form-item label="姓名" prop="teacherName">
                        <el-input auto-complete="off" v-model="addCoachForm.teacherName"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" class="normal" prop="gender">
                        <el-select placeholder="请选择性别" v-model="addCoachForm.gender">
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="电话号码" prop="phone">
                        <el-input auto-complete="off" v-model="addCoachForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号" prop="idNumber">
                        <el-input auto-complete="off" v-model="addCoachForm.idNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="驾驶证号" prop="drivingLicenceNo">
                        <el-input auto-complete="off" v-model="addCoachForm.drivingLicenceNo"></el-input>
                    </el-form-item>
                    <el-form-item label="初领日期" prop="drivingLicenceTime">
                        <el-date-picker type="date" placeholder="初领日期" v-model="addCoachForm.drivingLicenceTime" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="准驾车型" class="normal" prop="drivingCarType">
                        <el-select placeholder="请选择准驾车型" v-model="addCoachForm.drivingCarType">
                            <el-option v-for="item in vehiclesTypeOption" :label="item.value" :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="准教车型" class="normal" prop="teachCarType">
                        <el-select placeholder="请选择准教车型" v-model="addCoachForm.teachCarType">
                            <el-option v-for="item in vehiclesTypeOption" :label="item.value" :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="QQ" prop="qq">
                        <el-input auto-complete="off" v-model="addCoachForm.qq"></el-input>
                    </el-form-item>
                    <el-form-item label="所属区划" class="cs">
                        <PCA v-if="thisShow" tag="basic" v-on:child-emit="listenData"></PCA>
                    </el-form-item>
                    <el-form-item label="家庭住址" class="addr" prop="address">
                        <el-input auto-complete="off" v-model="addCoachForm.address"></el-input>
                    </el-form-item>
                    <el-form-item label="供职状态" class="normal" prop="workState">
                        <el-select placeholder="请选择供职状态" v-model="addCoachForm.workState">
                            <el-option v-for="item in workStateData" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="入职日期" prop="inputDate">
                        <el-date-picker type="date" placeholder="入职日期" v-model="addCoachForm.inputDate" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="离职日期" prop="departureDate">
                        <el-date-picker type="date" placeholder="离职日期" v-model="addCoachForm.departureDate" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="职业资格证号" prop="vocationalNo">
                        <el-input auto-complete="off" v-model="addCoachForm.vocationalNo"></el-input>
                    </el-form-item>
                    <el-form-item label="职业资格等级" class="normal" prop="vocationalLevel">
                        <el-select placeholder="请选择职业资格等级" v-model="addCoachForm.vocationalLevel">
                            <el-option v-for="item in vocationalLevelData" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分校" class="normal" prop="schoolCode">
                        <el-select placeholder="请选择分校" v-model="addCoachForm.schoolCode" @change="branchSchoolChange">
                            <el-option v-for="item in branchSchoolData" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="绑定车辆" class="normal" prop="bindCar">
                        <el-select placeholder="请选择绑定车辆" v-model="bindCar" ref="bindCar">
                            <el-option v-for="item in vehiclesData" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="培训科目" class="normal" prop="appointmentTeacherInfo.stage">
                        <el-select placeholder="请选择培训科目" v-model="addCoachForm.appointmentTeacherInfo.stage">
                            <el-option label="科目二" value="2"></el-option>
                            <el-option label="科目三" value="3"></el-option>
                            <el-option label="混合科目" value="4"></el-option>
                            <!--<el-option v-for="item in trainingStageOptions" :label="item.label" :value="item.value"></el-option>-->
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属单位" class="normal" prop="deptId">
                        <el-cascader :options="departmentData" :show-all-levels="false" @change="departmentChange" :change-on-select="true" v-model="selectedUnitOptions">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="是否发卡" class="normal" prop="timerTeacherInfo.useIccard">
                        <el-select v-model="addCoachForm.timerTeacherInfo.useIccard" placeholder="请选择是否发卡">
                            <el-option label="否" value="false"></el-option>
                            <el-option label="是" value="true"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注" class="addr" prop="comments">
                        <el-input auto-complete="off" v-model="addCoachForm.comments"></el-input>
                    </el-form-item>
                    <p class="group-title">
                        预约培训
                        <el-switch v-model="addCoachForm.appointmentTeacher" on-text="打开" off-text="关闭" on-color="#13ce66" off-color="#999" style="margin-left:12px;font-size:13px;"></el-switch>
                        <div style="width:83%;margin:0 auto;" v-if="addCoachForm.appointmentTeacher===true">
                            <p>
                                <el-select placeholder="请选择模式" v-model="addCoachForm.appointmentTeacherInfo.modelId">
                                    <el-option v-for="item in modelData" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                                <p style="line-height: 30px;margin-top:10px;">
                                    <span>浮动价格&nbsp;&nbsp;
                                        <el-input auto-complete="off" style="width:80px;" size="mini" v-model="addCoachForm.appointmentTeacherInfo.floatingPrice"></el-input>&nbsp;&nbsp;元</span>
                                </p>
                                <p style="line-height: 30px;">
                                    <el-checkbox v-model="addCoachForm.appointmentTeacherInfo.isClass" @change="appointmentChange">教练需要报班</el-checkbox>
                                </p>
                                <p style="line-height: 30px;" v-if="addCoachForm.appointmentTeacherInfo.isClass">
                                    <el-checkbox v-model="addCoachForm.appointmentTeacherInfo.classPass">教练报班免审</el-checkbox>
                                </p>
                            </p>
                        </div>
                    </p>
                    <div style="position:absolute;top:60px;right:40px;">
                        <img :src="image" style="width:125px;height:170px;margin-bottom:12px;border:1px solid #bfcbd9;" />
                        <p>
                            <el-button size="small" type="primary" style="position:relative;top:0;left:10px;" @click="openFile">上传</el-button>
                            <input type="file" style="display:none;" @change="onFileChange" ref="upload" />
                            <el-button size="small" type="primary" style="position:relative;top:0;left:25px;" @click="photographFormVisible = true">拍照</el-button>
                        </p>
                    </div>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="thisShow=addCoachFormVisible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click.native="createNew('teacher','add')">保存</el-button>
                </div>
            </el-dialog>
            <el-dialog title="修改" v-model="editCoachFormVisible" :close-on-click-modal="false" size="full" @close="dialogClose">
                <el-form v-if="editCoachFormVisible" :model="editCoachForm" :rules="coachFormRules" ref="editCoachForm" :inline="true" class="demo-form-inline" label-width="85px">
                    <p class="group-title">个人信息</p>
                    <el-form-item label="姓名" prop="teacherName">
                        <el-input auto-complete="off" v-model="editCoachForm.teacherName"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" class="normal">
                        <el-select placeholder="请选择性别" v-model="editCoachForm.gender">
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="电话号码" prop="phone">
                        <el-input auto-complete="off" v-model="editCoachForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号" prop="idNumber">
                        <el-input auto-complete="off" v-model="editCoachForm.idNumber" :disabled="editCoachForm.timerTeacherInfo.uploadState!==10"></el-input>
                    </el-form-item>
                    <el-form-item label="驾驶证号" prop="drivingLicenceNo">
                        <el-input auto-complete="off" v-model="editCoachForm.drivingLicenceNo"></el-input>
                    </el-form-item>
                    <el-form-item label="初领日期" prop="drivingLicenceTime">
                        <el-date-picker type="date" placeholder="初领日期" v-model="editCoachForm.drivingLicenceTime" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="准驾车型" class="normal" prop="drivingCarType">
                        <el-select placeholder="请选择准驾车型" v-model="editCoachForm.drivingCarType">
                            <el-option v-for="item in vehiclesTypeOption" :label="item.value" :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="准教车型" class="normal" prop="teachCarType">
                        <el-select placeholder="请选择准教车型" v-model="editCoachForm.teachCarType">
                            <el-option v-for="item in vehiclesTypeOption" :label="item.value" :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="QQ" prop="qq">
                        <el-input auto-complete="off" v-model="editCoachForm.qq"></el-input>
                    </el-form-item>
                    <el-form-item label="请选择" class="cs">
                        <PCA v-if="thisShow" :county="editCoachForm.county" tag="basic" v-on:child-emit="listenData"></PCA>
                    </el-form-item>
                    <el-form-item label="家庭住址" class="addr" prop="address">
                        <el-input auto-complete="off" v-model="editCoachForm.address"></el-input>
                    </el-form-item>
                    <el-form-item label="供职状态" class="normal" prop="workState">
                        <el-select placeholder="请选择供职状态" v-model="editCoachForm.workState">
                            <el-option v-for="item in workStateData" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="入职日期" prop="inputDate">
                        <el-date-picker type="date" placeholder="入职日期" v-model="editCoachForm.inputDate" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="离职日期" prop="departureDate">
                        <el-date-picker type="date" placeholder="离职日期" v-model="editCoachForm.departureDate" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="职业资格证号" prop="vocationalNo">
                        <el-input auto-complete="off" v-model="editCoachForm.vocationalNo"></el-input>
                    </el-form-item>
                    <el-form-item label="职业资格等级" class="normal" prop="vocationalLevel">
                        <el-select placeholder="请选择职业资格等级" v-model="editCoachForm.vocationalLevel">
                            <el-option v-for="item in vocationalLevelData" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分校" class="normal" prop="schoolCode">
                        <el-select placeholder="请选择分校" v-model="editCoachForm.schoolCode" @change="branchSchoolChange">
                            <el-option v-for="item in branchSchoolData" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="绑定车辆" class="normal">
                        <el-select placeholder="请选择绑定车辆" v-model="editCoachForm.appointmentTeacherInfo.carId" ref="bindCar">
                            <el-option v-for="item in vehiclesData" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="培训科目" class="normal" prop="stage">
                        <el-select placeholder="请选择培训科目" v-model="editCoachForm.appointmentTeacherInfo.stage">
                            <!--<el-option v-for="item in trainingStageOptions" :label="item.label" :value="item.value"></el-option>-->
                            <el-option label="科目二" value="2"></el-option>
                            <el-option label="科目三" value="3"></el-option>
                            <el-option label="混合科目" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属单位" class="normal" prop="deptId">
                        <el-cascader :options="departmentData" :show-all-levels="false" @change="departmentChange" :change-on-select="true" v-model="selectedUnitOptions">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="是否发卡"  class="normal" prop="timerTeacherInfo.useIccard">
                        <el-select :disabled="editCoachForm.timerTeacherInfo.useIccard" v-model="editCoachForm.timerTeacherInfo.useIccard" placeholder="请选择是否发卡">
                            <el-option label="否" value="false"></el-option>
                            <el-option label="是" value="true"></el-option>
                            <!--<el-option :label="(editCoachForm.timerTeacherInfo.useIccard==='true'||editCoachForm.timerTeacherInfo.useIccard)?'是':'否'" :value="(editCoachForm.timerTeacherInfo.useIccard==='true'||editCoachForm.timerTeacherInfo.useIccard)?true:false"></el-option>
                            <el-option v-if="!editCoachForm.timerTeacherInfo.useIccard" :label="(editCoachForm.timerTeacherInfo.useIccard==='true'||editCoachForm.timerTeacherInfo.useIccard)?'否':'是'" :value="(editCoachForm.timerTeacherInfo.useIccard==='true'||editCoachForm.timerTeacherInfo.useIccard)?false:true"></el-option>-->
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注" class="addr" prop="comments">
                        <el-input auto-complete="off" v-model="editCoachForm.comments"></el-input>
                    </el-form-item>
                    <p class="group-title">
                        预约培训
                        <el-switch v-model="editCoachForm.appointmentTeacher" :disabled="true" on-text="打开" off-text="关闭" on-color="#13ce66" off-color="#999" style="margin-left:12px;font-size:13px;"></el-switch>
                        <div style="width:83%;margin:0 auto;" v-if="editCoachForm.appointmentTeacher===true">
                            <p>
                                <el-select placeholder="请选择模式" v-model="editCoachForm.appointmentTeacherInfo.modelId">
                                    <el-option v-for="item in modelData" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                                <p style="line-height: 30px;margin-top:10px;">
                                    <span>浮动价格&nbsp;&nbsp;
                                        <el-input auto-complete="off" style="width:80px;" size="mini" v-model="editCoachForm.appointmentTeacherInfo.floatingPrice"></el-input>&nbsp;&nbsp;元</span>
                                </p>
                                <p style="line-height: 30px;">
                                    <el-checkbox v-model="editCoachForm.appointmentTeacherInfo.isClass" @change="appointmentChange">教练需要报班</el-checkbox>
                                </p>
                                <p style="line-height: 30px;" v-if="editCoachForm.appointmentTeacherInfo.isClass">
                                    <el-checkbox v-model="editCoachForm.appointmentTeacherInfo.classPass">教练报班免审</el-checkbox>
                                </p>
                            </p>
                        </div>
                    </p>
                    <div style="position:absolute;top:60px;right:40px;">
                        <img :src="image" style="width:125px;height:170px;margin-bottom:12px;border:1px solid #bfcbd9;" />
                        <p>
                            <el-button size="small" type="primary" style="position:relative;top:0;left:10px;" @click="openFile">上传</el-button>
                            <input type="file" style="display:none;" @change="onFileChange" ref="upload" />
                            <el-button size="small" type="primary" style="position:relative;top:0;left:25px;" @click="photographFormVisible = true">拍照</el-button>
                        </p>
                    </div>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="thisShow=editCoachFormVisible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click.native="createNew('teacher','edit')">保存</el-button>
                </div>
            </el-dialog>
            <el-dialog title="拍照" v-model="photographFormVisible" :close-on-click-modal="false" class="photograph" size="small" @close="dialogClose">
                <div id="webcam" style="width:320px;height:240px;float:left;margin:20px;"></div>
                <canvas style="width:320px;height:240px;float:left;margin:20px;margin-left:55px;" id="canvas">
                </canvas>
                <div style="width:100%;height:50px;position:absolute;top:155px;left:367px;">
                    <el-button type="primary" @click="onPhotograph()">拍照</el-button>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="photographFormVisible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click="savePhoto">保存</el-button>
                </div>
            </el-dialog>
            <!--教练员请假界面-->
            <el-dialog title="教练员请假" v-model="coachLeaveFormVisible" :close-on-click-modal="false" size="mini" @close="dialogClose">
                <el-form :model="coachLeaveForm" ref="coachLeaveForm" :inline="true" label-width="85px">
                    <div class="mt15 mb15 t-center">
                        <el-row>
                            <el-col :span="24">
                                <el-radio-group v-model="leaveType.label" @change="leaveTypeChange">
                                    <el-radio-button label="按天请假"></el-radio-button>
                                    <el-radio-button label="按小时请假"></el-radio-button>
                                </el-radio-group>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="leaveForm">
                        <el-form-item :label="beginText">
                            <el-date-picker type="datetime" placeholder="开始时间" v-model="leaveType.time.begin" :editable="false" v-show="leaveType.label==='按小时请假'"></el-date-picker>
                            <el-date-picker type="date" placeholder="开始日期" v-model="leaveType.day.begin" :editable="false" v-show="leaveType.label==='按天请假'"></el-date-picker>
                        </el-form-item>
                        <el-form-item :label="endText">
                            <el-date-picker type="datetime" placeholder="结束时间" v-model="leaveType.time.end" :editable="false" v-show="leaveType.label==='按小时请假'"></el-date-picker>
                            <el-date-picker type="date" placeholder="结束日期" v-model="leaveType.day.end" :editable="false" v-show="leaveType.label==='按天请假'"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="请假原因" prop="comments">
                            <el-input type="textarea" auto-complete="off" v-model="coachLeaveForm.comments" resize="none" :autosize="{ minRows: 4 }"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="coachLeaveFormVisible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click.native="createNew('leave','add')">提交</el-button>
                </div>
            </el-dialog>
            <!--教练员报班界面-->
            <el-dialog title="教练报班" v-model="coachNewClassFormVisible" :close-on-click-modal="false" size="full" @close="dialogClose">
                <el-row class="mt20">
                    <el-form :inline="true" :model="filters">
                        <el-form-item class="normal">
                            <el-select placeholder="请选择科目" v-model="filters.classes.stage" @change="queryClasses">
                                <el-option label="科目二" value="2"></el-option>
                                <el-option label="科目三" value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item style="width:192px;">
                            <el-date-picker type="date" placeholder="选择日期" v-model="filters.classes.date" :clearable="false" :editable="false" @change="queryClasses" :picker-options="pickerOptions"></el-date-picker>
                        </el-form-item>
                        <el-form-item class="right">
                            <el-checkbox :indeterminate="isIndeterminate" v-model="selectedAll" @change="handleAllSelectedChange" class="mr20" :disabled="classCount>0?false:true">全选</el-checkbox>
                            <el-button type="primary" :disabled="selected.length?false:true" @click="releaseClasses">报班{{selected.length?'('+selected.length+')':''}}</el-button>
                        </el-form-item>
                    </el-form>
                </el-row>
                <!--<el-row>
                                        <div class="wall-container hide">
                                            <div class="header-two">
                                                <swiper :options="swiperOption" ref="swiper">
                                                    <swiper-slide v-for="item in dateList" v-bind:class="[item.click?'is-active':'']">
                                                        <p>{{item.date}}</p>
                                                        <p>{{item.week}}</p>
                                                    </swiper-slide>
                                                    <div class="swiper-button-prev" slot="button-prev"></div>
                                                    <div class="swiper-button-next" slot="button-next"></div>
                                                </swiper>
                                            </div>
                                        </div>
                                    </el-row>-->
                <el-row v-loading="filters.classes.loading" class="mt20">
                    <div v-for="list in classes.list" class="classes-review">
                        <div class="coach-photo">
                            <img v-bind:src="list.photosUrl" />
                            <p>{{list.teacherName}}</p>
                            <p>{{list.phone}}</p>
                        </div>
                        <div class="classes">
                            <span v-for="item in list.classDOS">
                                <a href="javascript:" v-if="item.teacherIsClass===1" v-bind:class="[item.check?'is-review':'']" @click="handleSelected(item)">
                                    <p>{{item.classTime}}</p>
                                    <p>{{item.stageName}}</p>
                                </a>
                                <a v-else class="is-selected">
                                    <p>{{item.classTime}}</p>
                                    <p>{{item.message}}</p>
                                </a>
                            </span>
                        </div>
                    </div>
                    <div class="glyph-icon icon-empty empty-data" v-if="emptyVisible">
                        <p>暂无数据</p>
                    </div>
                </el-row>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="large" @click.native="coachNewClassFormVisible = false">关闭</el-button>
                </div>
            </el-dialog>
            <el-dialog title="教练详情" v-model="detailsCoachFormVisible" :close-on-click-modal="false" size="full">
                <!-- 基本信息 -->
                <div class="basic" style="margin-top:0;padding:0 20px;">
                    <el-form :model="detailTeacher">
                        <el-row>
                            <el-col :span="18">
                                <p class="mt15 detailForm">
                                    <img v-bind:src="detailTeacher.timerTeacherInfo.photosUrl" class="photo" />
                                    <span class="ml50">{{detailTeacher.teacherName}}【{{detailTeacher.timerTeacherInfo.uploadState===20?'已备案':detailTeacher.timerTeacherInfo.uploadState===30?'修改未备案':'未备案'}}】</span>
                                </p>
                            </el-col>
                            <el-col :span="6">
                                <p class="t-right">
                                    <el-button type="primary" size="large" @click="">&nbsp;换卡&nbsp;</el-button>
                                    <el-button type="primary" size="large" @click="handleOpenEdit(detailTeacher,'teacher')">&nbsp;修改&nbsp;</el-button>
                                </p>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="5">
                                <span>统一编号：{{detailTeacher.timerTeacherInfo.teacherUnifyCode}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span>性别：{{detailTeacher.genderName}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span>电话：{{detailTeacher.phone}}</span>
                            </el-col>
                            <el-col :span="7">
                                <span>身份证号：{{detailTeacher.idNumber}}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="5">
                                <span>准驾车型：{{detailTeacher.drivingCarTypeName}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span>在职状态: {{formatData(detailTeacher.workState,"workState")}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span>驾驶证初领日期: {{new Date(detailTeacher.drivingLicenceTime).Format("yyyy-MM-dd")}}</span>
                            </el-col>
                            <el-col :span="7">
                                <span>职业资格证号：{{detailTeacher.vocationalNo}}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="5">
                                <span>职业资格等级: {{formatData(detailTeacher.vocationalLevel,"vocationalLevel")}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span>QQ号：{{detailTeacher.qq}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span>驾驶证号: {{detailTeacher.drivingLicenceNo}}</span>
                            </el-col>
                            <el-col :span="7">
                                <span>所属分校：{{detailTeacher.schoolName}}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="5">
                                <span>准教车型：{{detailTeacher.teachCarTypeName}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span>所属地区：{{detailTeacher.regionName}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span>入职日期：{{detailTeacher.inputDate===""?"":new Date(detailTeacher.inputDate).Format("yyyy-MM-dd")}}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="5">
                                <span>离职日期：{{(detailTeacher.departureDate===""?"":new Date(detailTeacher.departureDate).Format("yyyy-MM-dd"))}}</span>
                            </el-col>
                            <el-col :span="19">
                                <span>家庭住址：{{detailTeacher.address}}</span>
                            </el-col>
                        </el-row>
                        <div v-if="detailTeacher.appointmentTeacher">
                            <p class="group-title">预约培训</p>
                            <el-row>
                                <el-col :span="6">
                                    <p>
                                        <span>预约模式：{{detailTeacher.appointmentTeacherInfo.modeName}}</span>
                                    </p>
                                </el-col>
                                <el-col :span="6">
                                    <p>
                                        <span>浮动价格：{{detailTeacher.appointmentTeacherInfo.floatingPrice}}元</span>
                                    </p>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12" class="authority">
                                    <ul>
                                        <li v-if="detailTeacher.appointmentTeacherInfo.isClass">教练需要报班</li>
                                        <li v-if="detailTeacher.appointmentTeacherInfo.classPass">教练报班免审</li>
                                    </ul>
                                </el-col>
                            </el-row>
                        </div>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="detailsCoachFormVisible = false" size="large">取消</el-button>
                </div>
            </el-dialog>
            <el-dialog title="学员制卡" v-model="showCard">
                <!--制卡-->
                    <object id="myobj"  border="1" height=30 width=200
                        align="center" classid="clsid:93201C87-E8B2-4B20-A61A-6D4DFBD2D140" />
                    </object>
                <el-form :model="ruleForm" :inline="true" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    
                    <el-form-item label="学员姓名" prop="studentName">
                        <el-input :disabled="true" auto-complete="off" v-model="ruleForm.studentName" style="width:400px;"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号码" prop="IdCardNo">
                        <el-input :disabled="true" v-model="ruleForm.IdCardNo" placeholder="输入证件号" style="width:400px;"></el-input>
                    </el-form-item>
        
                    <el-form-item label="驾校编号" prop="schNo">
                        <el-input :disabled="true" auto-complete="off" v-model="ruleForm.schNo" style="width:400px;"></el-input>
                    </el-form-item>
        
                    <el-form-item label="学员ID" prop="stdNo">
                        <el-input :disabled="true" auto-complete="off" v-model="ruleForm.stdNo" style="width:400px;"></el-input>
                    </el-form-item>

                    
                    <el-form-item label="卡号" prop="cardNo">
                        <el-input auto-complete="off" v-model="ruleForm.cardNo" style="width:400px;"></el-input>
                    </el-form-item>

                    <el-form-item label="已通过科目" prop="thHour">
                        <el-input :disabled="true" auto-complete="off" v-model="ruleForm.thHour" style="width:400px;"></el-input>
                    </el-form-item>

                    <el-form-item label="三阶段学时要求" prop="opHour">
                        <el-input :disabled="true" auto-complete="off" v-model="ruleForm.opHour" style="width:400px;"></el-input>
                    </el-form-item>

                    <el-form-item label="已行驶的里程" prop="hadRunMile">
                        <el-input :disabled="true" auto-complete="off" v-model="ruleForm.hadRunMile" style="width:400px;"></el-input>
                    </el-form-item>

                    <el-form-item label="已学学时" prop="hadSubMinute">
                        <el-input :disabled="true" auto-complete="off" v-model="ruleForm.hadSubMinute" style="width:400px;"></el-input>
                    </el-form-item>

                    <el-form-item label="车型" class="normal" prop="carType">
                        <el-select  :disabled="ruleForm.carType!=''" v-model="ruleForm.carType" placeholder="请选择培训车型">
                            <el-option v-for="item in carTypeOptions" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
        
                    <el-form-item label="第一指纹" prop="fingerMB1">
                        <el-switch on-text="" :disabled="true" off-text="" v-model="ruleForm.fingerMB1" style="width:200px;"></el-switch>
                        
                    </el-form-item>
        
                    <el-form-item label="第二指纹" prop="fingerMB2">
                        <el-switch :disabled="true" on-text="" off-text="" v-model="ruleForm.fingerMB2" style="width:200px;"></el-switch>
                    </el-form-item>

                    <!--特殊卡指纹待定-->
                    <el-form-item label="特殊卡指纹" prop="noFinger">
                        <el-switch on-text="" off-text="" v-model="ruleForm.noFinger"></el-switch>
                    </el-form-item>
        
                    <el-form-item style="float:right;margin-right:44px;">
                    <el-button type="primary" @click="XykSetInfo('ruleForm')">立即创建</el-button>
                    <el-button @click="()=>showCard=false">取消</el-button>
                </el-form-item>
                </el-form>
            </el-dialog>
            
        </el-row>
        <el-row v-if="radioHeaderSel==='安全员'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input class="search-input mr40" v-model="filters.securityGuard.keyWord" placeholder="输入安全员姓名、电话" icon="search" :on-icon-click="getSecurityGuard"></el-input>
                    </el-form-item>
                    <el-dropdown @command="handleCommand" class="right">
                        <el-button type="primary">
                            批量操作
                            <i class="el-icon-caret-bottom el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="export">导出表格</el-dropdown-item>
                            <el-dropdown-item command="record">备案监管平台</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button type="primary" @click="handleAdd(2)" class="mr20 right">添加安全员</el-button>
                </el-form>
                <!--列表-->
                <el-table :data="soteachers.data" highlight-current-row @selection-change="handleSelectionChange" @row-click="rowClick" v-if="radioHeaderSel==='安全员'">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="guardName" label="安全员姓名"></el-table-column>
                    <el-table-column prop="phone" label="电话"></el-table-column>
                    <el-table-column prop="idNumber" label="身份证"></el-table-column>
                    <el-table-column prop="teachCarTypeName" label="准驾车型"></el-table-column>
                    <el-table-column prop="schoolName" label="所属分校"></el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="soteachers.total">
                </el-pagination>
            </el-col>
            <!--新增安全员界面-->
            <el-dialog title="新增安全员" v-model="addSOFormVisible" :close-on-click-modal="false" size="full" @close="dialogClose">
                <el-form v-if="addSOFormVisible" :model="addSOForm" :rules="soFormRules" ref="addSOForm" :inline="true" class="demo-form-inline" label-width="85px">
                    <p class="group-title">个人信息</p>
                    <el-form-item label="姓名" prop="guardName">
                        <el-input auto-complete="off" v-model="addSOForm.guardName"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" class="normal" prop="gender">
                        <el-select placeholder="请选择性别" v-model="addSOForm.gender">
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="电话号码" prop="phone">
                        <el-input auto-complete="off" v-model="addSOForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号" prop="idNumber">
                        <el-input auto-complete="off" v-model="addSOForm.idNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="QQ" prop="qq">
                        <el-input auto-complete="off" v-model="addSOForm.qq"></el-input>
                    </el-form-item>
                    <el-form-item label="驾驶证号">
                        <el-input auto-complete="off" v-model="addSOForm.drivingLicenceNo"></el-input>
                    </el-form-item>
                    <el-form-item label="所属区划" class="cs">
                        <PCA v-if="thisShow" tag="basic" v-on:child-emit="listenData"></PCA>
                    </el-form-item>
                    <el-form-item label="家庭住址" class="addr" prop="address">
                        <el-input auto-complete="off" v-model="addSOForm.address"></el-input>
                    </el-form-item>
                    <el-form-item label="供职状态" class="normal" prop="workState">
                        <el-select placeholder="请选择供职状态" v-model="addSOForm.workState">
                            <el-option v-for="item in workStateData" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="入职日期" prop="inputDate">
                        <el-date-picker type="date" placeholder="入职日期" :editable="false" v-model="addSOForm.inputDate"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="离职日期" prop="departureDate">
                        <el-date-picker type="date" placeholder="离职日期" :editable="false" v-model="addSOForm.departureDate"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="初领日期">
                        <el-date-picker type="date" placeholder="初领日期" :editable="false" v-model="addSOForm.drivingLicenceTime"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="职业资格证号" prop="vocationalNo">
                        <el-input auto-complete="off" v-model="addSOForm.vocationalNo"></el-input>
                    </el-form-item>
                    <el-form-item label="职业资格等级" class="normal" prop="vocationalLevel">
                        <el-select placeholder="请选择职业资格等级" v-model="addSOForm.vocationalLevel">
                            <el-option v-for="item in vocationalLevelData" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="准驾车型" class="normal">
                        <el-select placeholder="请选择准驾车型" v-model="addSOForm.drivingCarType">
                            <el-option v-for="item in vehiclesTypeOption" :label="item.value" :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="准教车型" class="normal">
                        <el-select placeholder="请选择准教车型" v-model="addSOForm.teachCarType">
                            <el-option v-for="item in vehiclesTypeOption" :label="item.value" :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分校" class="normal" prop="schoolCode">
                        <el-select placeholder="请选择分校" v-model="addSOForm.schoolCode">
                            <el-option v-for="item in branchSchoolData" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注" class="addr" prop="comments">
                        <el-input auto-complete="off" v-model="addSOForm.comments"></el-input>
                    </el-form-item>
                    <div style="position:absolute;top:60px;right:40px;">
                        <img :src="image" style="width:125px;height:170px;margin-bottom:12px;border:1px solid #bfcbd9;" />
                        <p>
                            <el-button size="small" type="primary" style="position:relative;top:0;left:10px;" @click="openFile">上传</el-button>
                            <input type="file" style="display:none;" @change="onFileChange" ref="upload" />
                        </p>
                    </div>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addSOFormVisible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click.native="createNew('so','add')">保存</el-button>
                </div>
            </el-dialog>
            <el-dialog title="安全员详情" v-model="detailsSOFormVisible" :close-on-click-modal="false" size="full">
                <!-- 基本信息 -->
                <div class="basic" style="margin-top:0;padding:0 20px;">
                    <el-form :model="detailsSO">
                        <el-row>
                            <el-col :span="16">
                                <p class="mt15 detailForm">
                                    <img v-bind:src="detailsSO.photosUrl" class="photo" />
                                    <span class="ml50">{{detailsSO.guardName}}【{{detailsSO.uploadState===20?'已备案':detailsSO.uploadState===30?'修改未备案':'未备案'}}】</span>
                                </p>
                            </el-col>
                            <el-col :span="8">
                                <p class="t-right">
                                    <el-button type="primary" size="large" @click="handleOpenEdit(detailsSO,'so')">&nbsp;修改&nbsp;</el-button>
                                    <el-button type="danger" size="large" @click="handleDelete(detailsSO,'so')">&nbsp;删除&nbsp;</el-button>
                                </p>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>统一编号：{{detailsSO.guardUnifyCode}}</span>
                            </el-col>
                            <el-col :span="5">
                                <span>性别：{{detailsSO.genderName}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span>电话：{{detailsSO.phone}}</span>
                            </el-col>
                            <el-col :span="7">
                                <span>身份证号：{{detailsSO.idNumber}}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>准驾车型：{{detailsSO.drivingCarTypeName}}</span>
                            </el-col>
                            <el-col :span="5">
                                <span>在职状态: {{formatData(detailsSO.workState,"workState")}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span>驾驶证初领日期: {{detailsSO.drivingLicenceTime===""?"":new Date().Format("yyyy-MM-dd")}}</span>
                            </el-col>
                            <el-col :span="7">
                                <span>职业资格证号:{{detailsSO.vocationalNo}}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>职业资格等级: {{formatData(detailsSO.vocationalLevel,"vocationalLevel")}}</span>
                            </el-col>
                            <el-col :span="5">
                                <span>QQ号：{{detailsSO.qq}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span>驾驶证号: {{detailsSO.drivingLicenceNo}}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>所属分校：{{detailsSO.schoolName}}</span>
                            </el-col>
                            <el-col :span="5">
                                <span>准教车型：{{detailsSO.teachCarTypeName}}</span>
                            </el-col>
                            <el-col :span="13">
                                <span>所属地区：{{detailsSO.regionName}}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>入职日期：{{detailsSO.inputDate===""?"":new Date(detailsSO.inputDate).Format("yyyy-MM-dd")}}</span>
                            </el-col>
                            <el-col :span="5">
                                <span>离职日期：{{(detailsSO.departureDate===""?"":new Date(detailsSO.departureDate).Format("yyyy-MM-dd"))}}</span>
                            </el-col>
                            <el-col :span="13">
                                <span>家庭住址：{{detailsSO.address}}</span>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="detailsSOFormVisible = false" size="large">取消</el-button>
                </div>
            </el-dialog>
            <el-dialog title="修改" v-model="editSOFormVisible" :close-on-click-modal="false" size="full" @close="dialogClose">
                <el-form v-if="editSOFormVisible" :model="editSOForm" :rules="soFormRules" ref="editSOForm" :inline="true" class="demo-form-inline" label-width="85px">
                    <p class="group-title">个人信息</p>
                    <el-form-item label="姓名" prop="guardName">
                        <el-input auto-complete="off" v-model="editSOForm.guardName"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" class="normal">
                        <el-select placeholder="请选择性别" v-model="editSOForm.gender">
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="电话号码" prop="phone">
                        <el-input auto-complete="off" v-model="editSOForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号" prop="idNumber">
                        <el-input auto-complete="off" v-model="editSOForm.idNumber" :disabled="editSOForm.uploadState!==10"></el-input>
                    </el-form-item>
                    <el-form-item label="驾驶证号">
                        <el-input auto-complete="off" v-model="editSOForm.drivingLicenceNo"></el-input>
                    </el-form-item>
                    <el-form-item label="初领日期">
                        <el-date-picker type="date" placeholder="初领日期" v-model="editSOForm.drivingLicenceTime" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="准驾车型" class="normal">
                        <el-select placeholder="请选择准驾车型" v-model="editSOForm.drivingCarType">
                            <el-option v-for="item in vehiclesTypeOption" :label="item.value" :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="准教车型" class="normal">
                        <el-select placeholder="请选择准教车型" v-model="editSOForm.teachCarType">
                            <el-option v-for="item in vehiclesTypeOption" :label="item.value" :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="QQ" prop="qq">
                        <el-input auto-complete="off" v-model="editSOForm.qq"></el-input>
                    </el-form-item>
                    <el-form-item label="请选择" class="cs">
                        <PCA v-if="thisShow" :county="editSOForm.county" tag="basic" v-on:child-emit="listenData"></PCA>
                    </el-form-item>
                    <el-form-item label="家庭住址" class="addr" prop="address">
                        <el-input auto-complete="off" v-model="editSOForm.address"></el-input>
                    </el-form-item>
                    <el-form-item label="供职状态" class="normal" prop="workState">
                        <el-select placeholder="请选择供职状态" v-model="editSOForm.workState">
                            <el-option v-for="item in workStateData" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="入职日期" prop="inputDate">
                        <el-date-picker type="date" placeholder="入职日期" v-model="editSOForm.inputDate" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="离职日期" prop="departureDate">
                        <el-date-picker type="date" placeholder="离职日期" v-model="editSOForm.departureDate" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="职业资格证号" prop="vocationalNo">
                        <el-input auto-complete="off" v-model="editSOForm.vocationalNo"></el-input>
                    </el-form-item>
                    <el-form-item label="职业资格等级" class="normal" prop="vocationalLevel">
                        <el-select placeholder="请选择职业资格等级" v-model="editSOForm.vocationalLevel">
                            <el-option v-for="item in vocationalLevelData" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分校" class="normal" prop="schoolCode">
                        <el-select placeholder="请选择分校" v-model="editSOForm.schoolCode" @change="branchSchoolChange">
                            <el-option v-for="item in branchSchoolData" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注" class="addr" prop="comments">
                        <el-input auto-complete="off" v-model="editSOForm.comments"></el-input>
                    </el-form-item>
                    <div style="position:absolute;top:60px;right:40px;">
                        <img :src="image" style="width:125px;height:170px;margin-bottom:12px;border:1px solid #bfcbd9;" />
                        <p>
                            <el-button size="small" type="primary" style="position:relative;top:0;left:10px;" @click="openFile">上传</el-button>
                            <input type="file" style="display:none;" @change="onFileChange" ref="upload" />
                        </p>
                    </div>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="thisShow=editSOFormVisible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click.native="createNew('so','edit')">保存</el-button>
                </div>
            </el-dialog>
        </el-row>
        <el-row v-if="radioHeaderSel==='考核员'">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input class="search-input mr40" v-model="filters.examiner.keyWord" placeholder="输入考核员姓名、电话" icon="search" :on-icon-click="getExaminer"></el-input>
                    </el-form-item>
                    <el-dropdown @command="handleCommand" class="right">
                        <el-button type="primary">
                            批量操作
                            <i class="el-icon-caret-bottom el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="export">导出表格</el-dropdown-item>
                            <el-dropdown-item command="record">备案监管平台</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button type="primary" @click="handleAdd(3)" class="mr20 right">添加考核员</el-button>
                </el-form>
                <!--列表-->
                <el-table :data="assessors.data" highlight-current-row @selection-change="handleSelectionChange" @row-click="rowClick" v-if="radioHeaderSel==='考核员'">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="examinerName" label="考核员姓名"></el-table-column>
                    <el-table-column prop="phone" label="电话"></el-table-column>
                    <el-table-column prop="idNumber" label="身份证"></el-table-column>
                    <el-table-column prop="teachCarTypeName" label="准驾车型"></el-table-column>
                    <el-table-column prop="schoolName" label="所属分校"></el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="assessors.total">
                </el-pagination>
            </el-col>
            <!--新增考核员界面-->
            <el-dialog title="新增考核员" v-model="addAssessorFormVisible" :close-on-click-modal="false" size="full" @close="dialogClose">
                <el-form v-if="addAssessorFormVisible" :model="addAssessorForm" :rules="assessorFormRules" ref="addAssessorForm" :inline="true" class="demo-form-inline" label-width="85px">
                    <p class="group-title">个人信息</p>
                    <el-form-item label="姓名" prop="examinerName">
                        <el-input auto-complete="off" v-model="addAssessorForm.examinerName"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" class="normal" prop="gender">
                        <el-select placeholder="请选择性别" v-model="addAssessorForm.gender">
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="电话号码" prop="phone">
                        <el-input auto-complete="off" v-model="addAssessorForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号" prop="idNumber">
                        <el-input auto-complete="off" v-model="addAssessorForm.idNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="QQ" prop="qq">
                        <el-input auto-complete="off" v-model="addAssessorForm.qq"></el-input>
                    </el-form-item>
                    <el-form-item label="驾驶证号" prop="drivingLicenceNo">
                        <el-input auto-complete="off" v-model="addAssessorForm.drivingLicenceNo"></el-input>
                    </el-form-item>
                    <el-form-item label="所属区划" class="cs">
                        <PCA v-if="thisShow" tag="basic" v-on:child-emit="listenData"></PCA>
                    </el-form-item>
                    <el-form-item label="家庭住址" class="addr" prop="address">
                        <el-input auto-complete="off" v-model="addAssessorForm.address"></el-input>
                    </el-form-item>
                    <el-form-item label="供职状态" class="normal" prop="workState">
                        <el-select placeholder="请选择供职状态" v-model="addAssessorForm.workState">
                            <el-option v-for="item in workStateData" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="入职日期" prop="inputDate">
                        <el-date-picker type="date" placeholder="入职日期" :editable="false" v-model="addAssessorForm.inputDate"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="离职日期" prop="departureDate">
                        <el-date-picker type="date" placeholder="离职日期" :editable="false" v-model="addAssessorForm.departureDate"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="初领日期" prop="drivingLicenceTime">
                        <el-date-picker type="date" placeholder="初领日期" :editable="false" v-model="addAssessorForm.drivingLicenceTime"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="职业资格证号" prop="vocationalNo">
                        <el-input auto-complete="off" v-model="addAssessorForm.vocationalNo"></el-input>
                    </el-form-item>
                    <el-form-item label="职业资格等级" class="normal" prop="vocationalLevel">
                        <el-select placeholder="请选择职业资格等级" v-model="addAssessorForm.vocationalLevel">
                            <el-option v-for="item in vocationalLevelData" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="准驾车型" class="normal" prop="drivingCarType">
                        <el-select placeholder="请选择准驾车型" v-model="addAssessorForm.drivingCarType">
                            <el-option v-for="item in vehiclesTypeOption" :label="item.value" :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="准教车型" class="normal">
                        <el-select placeholder="请选择准教车型" v-model="addAssessorForm.teachCarType">
                            <el-option v-for="item in vehiclesTypeOption" :label="item.value" :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分校" class="normal" prop="schoolCode">
                        <el-select placeholder="请选择分校" v-model="addAssessorForm.schoolCode">
                            <el-option v-for="item in branchSchoolData" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注" class="addr" prop="comments">
                        <el-input auto-complete="off" v-model="addAssessorForm.comments"></el-input>
                    </el-form-item>
                    <div style="position:absolute;top:60px;right:40px;">
                        <img :src="image" style="width:125px;height:170px;margin-bottom:12px;border:1px solid #bfcbd9;" />
                        <p>
                            <el-button size="small" type="primary" style="position:relative;top:0;left:10px;" @click="openFile">上传</el-button>
                            <input type="file" style="display:none;" @change="onFileChange" ref="upload" />
                        </p>
                    </div>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addAssessorFormVisible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click.native="createNew('assessor','add')">保存</el-button>
                </div>
            </el-dialog>
            <el-dialog title="考核员详情" v-model="detailsAssessorFormVisible" :close-on-click-modal="false" size="full">
                <!-- 基本信息 -->
                <div class="basic" style="margin-top:0;padding:0 20px;">
                    <el-form :model="detailsAssessor">
                        <el-row>
                            <el-col :span="16">
                                <p class="mt15 detailForm">
                                    <img v-bind:src="detailsAssessor.photosUrl" class="photo" />
                                    <span class="ml50">{{detailsAssessor.examinerName}}【{{detailsAssessor.uploadState===20?'已备案':detailsAssessor.uploadState===30?'修改未备案':'未备案'}}】</span>
                                </p>
                            </el-col>
                            <el-col :span="8">
                                <p class="t-right">
                                    <el-button type="primary" size="large" @click="handleOpenEdit(detailsAssessor,'assessor')">&nbsp;修改&nbsp;</el-button>
                                    <el-button type="danger" size="large" @click="handleDelete(detailsAssessor,'assessor')">&nbsp;删除&nbsp;</el-button>
                                </p>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>统一编号：{{detailsAssessor.examinerUnifyCode}}</span>
                            </el-col>
                            <el-col :span="5">
                                <span>性别：{{detailsAssessor.genderName}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span>电话：{{detailsAssessor.phone}}</span>
                            </el-col>
                            <el-col :span="7">
                                <span>身份证号：{{detailsAssessor.idNumber}}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>准驾车型：{{detailsAssessor.drivingCarTypeName}}</span>
                            </el-col>
                            <el-col :span="5">
                                <span>在职状态: {{formatData(detailsSO.workState,"workState")}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span>驾驶证初领日期: {{detailsAssessor.drivingLicenceTime===""?"":new Date(detailsAssessor.drivingLicenceTime).Format("yyyy-MM-dd")}}</span>
                            </el-col>
                            <el-col :span="7">
                                <span>职业资格证号:{{detailsAssessor.vocationalNo}}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>职业资格等级: {{formatData(detailsSO.vocationalLevel,"vocationalLevel")}}</span>
                            </el-col>
                            <el-col :span="5">
                                <span>QQ号：{{detailsAssessor.qq}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span>驾驶证号: {{detailsAssessor.drivingLicenceNo}}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>所属分校：{{detailsAssessor.schoolName}}</span>
                            </el-col>
                            <el-col :span="5">
                                <span>准教车型：{{detailsAssessor.teachCarTypeName}}</span>
                            </el-col>
                            <el-col :span="13">
                                <span>所属地区：{{detailsAssessor.regionName}}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <span>入职日期：{{detailsAssessor.inputDate===""?"":new Date(detailsAssessor.inputDate).Format("yyyy-MM-dd")}}</span>
                            </el-col>
                            <el-col :span="5">
                                <span>离职日期：{{(detailsAssessor.departureDate===""?"":new Date(detailsAssessor.departureDate).Format("yyyy-MM-dd"))}}</span>
                            </el-col>
                            <el-col :span="13">
                                <span>家庭住址：{{detailsAssessor.address}}</span>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="detailsAssessorFormVisible = false" size="large">取消</el-button>
                </div>
            </el-dialog>
            <el-dialog title="修改" v-model="editAssessorFormVisible" :close-on-click-modal="false" size="full" @close="dialogClose">
                <el-form v-if="editAssessorFormVisible" :model="editAssessorForm" :rules="assessorFormRules" ref="editAssessorForm" :inline="true" class="demo-form-inline" label-width="85px">
                    <p class="group-title">个人信息</p>
                    <el-form-item label="姓名" prop="examinerName">
                        <el-input auto-complete="off" v-model="editAssessorForm.examinerName"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" class="normal">
                        <el-select placeholder="请选择性别" v-model="editAssessorForm.gender">
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="电话号码" prop="phone">
                        <el-input auto-complete="off" v-model="editAssessorForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号" prop="idNumber">
                        <el-input auto-complete="off" v-model="editAssessorForm.idNumber" :disabled="editAssessorForm.uploadState!==10"></el-input>
                    </el-form-item>
                    <el-form-item label="驾驶证号" prop="drivingLicenceNo">
                        <el-input auto-complete="off" v-model="editAssessorForm.drivingLicenceNo"></el-input>
                    </el-form-item>
                    <el-form-item label="初领日期" prop="drivingLicenceTime">
                        <el-date-picker type="date" placeholder="初领日期" v-model="editAssessorForm.drivingLicenceTime" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="准驾车型" class="normal" prop="drivingCarType">
                        <el-select placeholder="请选择准驾车型" v-model="editAssessorForm.drivingCarType">
                            <el-option v-for="item in vehiclesTypeOption" :label="item.value" :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="准教车型" class="normal">
                        <el-select placeholder="请选择准教车型" v-model="editAssessorForm.teachCarType">
                            <el-option v-for="item in vehiclesTypeOption" :label="item.value" :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="QQ" prop="qq">
                        <el-input auto-complete="off" v-model="editAssessorForm.qq"></el-input>
                    </el-form-item>
                    <el-form-item label="请选择" class="cs">
                        <PCA v-if="thisShow" :county="editAssessorForm.county" tag="basic" v-on:child-emit="listenData"></PCA>
                    </el-form-item>
                    <el-form-item label="家庭住址" class="addr" prop="address">
                        <el-input auto-complete="off" v-model="editAssessorForm.address"></el-input>
                    </el-form-item>
                    <el-form-item label="供职状态" class="normal" prop="workState">
                        <el-select placeholder="请选择供职状态" v-model="editAssessorForm.workState">
                            <el-option v-for="item in workStateData" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="入职日期" prop="inputDate">
                        <el-date-picker type="date" placeholder="入职日期" v-model="editAssessorForm.inputDate" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="离职日期">
                        <el-date-picker type="date" placeholder="离职日期" v-model="editAssessorForm.departureDate" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="职业资格证号" prop="vocationalNo">
                        <el-input auto-complete="off" v-model="editAssessorForm.vocationalNo"></el-input>
                    </el-form-item>
                    <el-form-item label="职业资格等级" class="normal" prop="vocationalLevel">
                        <el-select placeholder="请选择职业资格等级" v-model="editAssessorForm.vocationalLevel">
                            <el-option v-for="item in vocationalLevelData" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分校" class="normal" prop="schoolCode">
                        <el-select placeholder="请选择分校" v-model="editAssessorForm.schoolCode" @change="branchSchoolChange">
                            <el-option v-for="item in branchSchoolData" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注" class="addr" prop="comments">
                        <el-input auto-complete="off" v-model="editAssessorForm.comments"></el-input>
                    </el-form-item>
                    <div style="position:absolute;top:60px;right:40px;">
                        <img :src="image" style="width:125px;height:170px;margin-bottom:12px;border:1px solid #bfcbd9;" />
                        <p>
                            <el-button size="small" type="primary" style="position:relative;top:0;left:10px;" @click="openFile">上传</el-button>
                            <input type="file" style="display:none;" @change="onFileChange" ref="upload" />
                        </p>
                    </div>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="thisShow=editAssessorFormVisible = false" size="large">取消</el-button>
                    <el-button type="primary" size="large" @click.native="createNew('assessor','edit')">保存</el-button>
                </div>
            </el-dialog>
        </el-row>
    </section>
</template>

<script>
import $ from "jquery";
import { request } from "../../api/api";
import PCA from "../../components/common/pca.vue";
import { global } from "../../assets/javascript/global";
// import { xlsx } from "../../assets/javascript/xlsx.full.min.js";
export default {
    data() {
        return {
            
            ruleForm: {
                studentName: '青青子衿',
                IdCardNo: '123456',
                schNo:'90028',
                cardNo: '2938',
                stdNo: '9527',
                noFinger: false,
                fingerMB1:'',
                fingerMB2:'',
                thHour:'km1;km2',
                opHour:'0,12,0,0;24,2,0,50;20,16,4,300',
                hadRunMile:'0;50;0;0',
                hadSubMinute:'15,15,15;15,15,15;0,0,0;0,0,0',
                carType:'C1'
            },
            showCard: true,
            thisShow: false,
            pageLoading: false,
            emptyVisible: false,
            recordTeachers: {
                teacherIdList: []
            },
            recordSecurityGuard: {
                teacherIdList: []
            },
            recordExaminer: {
                teacherIdList: []
            },
            bindCar: "",
            image: "",
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            parentSchoolCode: JSON.parse(sessionStorage.getItem("user")).parentSchoolCode,
            teachers: {
                data: [],
                total: 0,
                page: 1
            },
            detailTeacher: {
                appointmentTeacherInfo: {
                    stage: 0,
                    isClass: false,
                    modelId: 0,
                    modeName: "",
                    carId: 0,
                    bindCar: "",
                    classPass: true,
                    floatingPrice: 0
                },
                timerTeacherInfo: {
                    photosUrl: "",
                    faceId: 0,
                    faceppId: "",
                    photosId: 0,
                    proPhotosId: 0,
                    uploadState: 0,
                    teacherUnifyCode: "",
                    useIccard: 'false'
                },
                deptIdListInfo: []
            },
            select: "",
            vehiclesTypeOption: [],
            departmentData: [],
            filters: {
                teacher: {
                    keyWord: ""
                },
                securityGuard: {
                    keyWord: ""
                },
                examiner: {
                    keyWord: ""
                },
                classes: {
                    page: 1,
                    stage: "2",
                    teacherId: 0,
                    pageSize: 10,
                    loading: false,
                    schoolCode: "",
                    date: new Date().Format("yyyy-MM-dd")
                }
            },
            radioHeaderSel: "教练员",
            leaveType: {
                label: "按天请假",
                day: {
                    begin: "",
                    end: ""
                },
                time: {
                    begin: "",
                    end: ""
                }
            },
            beginText: "开始日期",
            endText: "结束日期",
            trainingStageOptions: global.options.stage,
            vocationalLevelData: global.options.vocationalLevel,
            workStateData: global.options.workState,
            branchSchoolData: [],
            vehiclesData: [],
            modelData: [],

            /* 教练员 */
            addCoachFormVisible: false,
            //新增教练员实体模型
            addCoachForm: {
                schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                teacherName: "",
                gender: "1",
                idNumber: "",
                phone: "",
                province: "",
                city: "",
                county: "",
                qq: "",
                address: "",
                workState: "",
                photosUrl: "",
                drivingLicenceNo: "",
                drivingLicenceTime: "",
                vocationalNo: "",
                vocationalLevel: "",
                drivingCarType: "",
                teachCarType: "",
                inputDate: "",
                departureDate: "",
                appointmentTeacher: false,
                comments: "",
                deptId: 0,
                appointmentTeacherInfo: {
                    stage: "2",
                    isClass: false,
                    modelId: "",
                    carId: "",
                    bindCar: "",
                    classPass: false,
                    floatingPrice: ""
                },
                timerTeacherInfo: {
                    photosUrl: "",
                    faceId: 0,
                    faceppId: "",
                    photosId: 0,
                    proPhotosId: 0,
                    useIccard: 'false'
                }
            },
            switchSetting: false, //预约类型开关
            coachFormRules: {
                teacherName: [
                    { required: true, message: "请填写教练员姓名", trigger: "blur" }
                ],
                idNumber: [
                    { required: true, message: "请填写教练员身份证", trigger: "blur" }
                ],
                phone: [
                    { required: true, message: "请填写教练员电话", trigger: "blur" }
                ],
                drivingLicenceNo: [
                    { required: true, message: "请填写教练员驾驶证号", trigger: "blur" }
                ],
                drivingLicenceTime: [
                    { type: "date", required: true, message: "请选择驾驶证初领日期", trigger: "change" }
                ],
                drivingCarType: [
                    { type: "number", required: true, message: "请选择准驾车型", trigger: "change" }
                ],
                teachCarType: [
                    { type: "number", required: true, message: "请选择准教车型", trigger: "change" }
                ],
                workState: [
                    { required: true, message: "请选择供职状态", trigger: "change" }
                ],
                inputDate: [
                    { type: "date", required: true, message: "请选择入职时间", trigger: "change" }
                ],
                deptId: [
                    { required: true, message: "请选择所属单位", trigger: "change" }
                ],
                "timerTeacherInfo.useIccard": [
                    { required: true, message: "请选择是否为发卡教练", trigger: "change" }
                ]
            },
            detailsCoachFormVisible: false,
            editCoachFormVisible: false,
            selectedUnitOptions: [],
            editCoachForm: {
                schoolCode: this.schoolCode,
                teacherName: "",
                gender: "1",
                idNumber: "",
                phone: "",
                province: "",
                city: "",
                county: "",
                qq: "",
                address: "",
                workState: "",
                photosUrl: "",
                drivingLicenceNo: "",
                drivingLicenceTime: "",
                vocationalNo: "",
                vocationalLevel: "",
                drivingCarType: "",
                teachCarType: "",
                inputDate: "",
                departureDate: "",
                appointmentTeacher: false,
                comments: "",
                deptId: 0,
                appointmentTeacherInfo: {
                    stage: "",
                    isClass: false,
                    modelId: "",
                    carId: "",
                    bindCar: "",
                    classPass: false,
                    floatingPrice: ""
                },
                timerTeacherInfo: {
                    photosUrl: "",
                    faceId: 0,
                    faceppId: "",
                    photosId: 0,
                    proPhotosId: 0,
                    useIccard: 'false'
                }
            },

            //教练员请假
            coachLeaveForm: {
                schoolCode: "",
                teacherId: "",
                beginTime: "",
                endTime: "",
                comments: ""
            },
            coachLeaveFormVisible: false,

            //教练员报班
            coachNewClassForm: {},
            coachNewClassFormVisible: false,

            /* 安全员 */
            soteachers: {
                data: [],
                total: 0,
                page: 1
            },
            addSOFormVisible: false,
            addSOForm: {
                schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                guardName: "",
                gender: "1",
                idNumber: "",
                phone: "",
                province: "",
                city: "",
                county: "",
                qq: "",
                address: "",
                photosUrl: "",
                photosId: 0,
                proPhotosId: 0,
                drivingLicenceNo: "",
                drivingLicenceTime: "",
                vocationalNo: "",
                vocationalLevel: "1",
                drivingCarType: "",
                teachCarType: "",
                workState: "0",
                inputDate: "",
                departureDate: "",
                comments: ""
            },
            soFormRules: {
                guardName: [
                    { required: true, message: "请填写安全员姓名", trigger: "blur" }
                ],
                idNumber: [
                    { required: true, message: "请填写安全员身份证", trigger: "blur" }
                ],
                phone: [
                    { required: true, message: "请填写安全员电话", trigger: "blur" }
                ],
                drivingLicenceNo: [
                    { required: true, message: "请填写安全员驾驶证号", trigger: "blur" }
                ],
                drivingLicenceTime: [
                    { type: "date", required: true, message: "请选择驾驶证初领日期", trigger: "blur" }
                ],
                drivingCarType: [
                    { type: "number", required: true, message: "请选择准驾车型", trigger: "change" }
                ],
                teachCarType: [
                    { type: "number", required: true, message: "请选择准教车型", trigger: "change" }
                ],
                workState: [
                    { required: true, message: "请选择供职状态", trigger: "change" }
                ],
                inputDate: [
                    { type: "date", required: true, message: "请选择入职时间", trigger: "change" }
                ],
                deptId: [
                    { required: true, message: "请选择所属单位", trigger: "change" }
                ]
            },
            detailsSOFormVisible: false,
            detailsSO: {
            },
            editSOFormVisible: false,
            editSOForm: {
                guardId: 0,
                schoolCode: "",
                schoolName: "",
                guardName: "",
                gender: "",
                genderName: "",
                idNumber: "",
                phone: "",
                province: "",
                provinceName: "",
                city: "",
                cityName: "",
                county: "",
                countyName: "",
                qq: "",
                address: "",
                photosUrl: "",
                photosId: 0,
                proPhotosId: 0,
                drivingLicenceNo: "",
                drivingLicenceTime: "",
                vocationalNo: "",
                vocationalLevel: "",
                drivingCarType: "",
                drivingCarTypeName: "",
                teachCarType: "",
                teachCarTypeName: "",
                workState: "",
                inputDate: "",
                departureDate: "",
                comments: "",
                gmtCreate: "",
                gmtModify: "",
                uploadState: "",
                guardUnifyCode: ""
            },

            /* 考核员 */
            assessors: {
                data: [],
                total: 0,
                page: 1
            },
            addAssessorFormVisible: false,
            addAssessorForm: {
                schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                examinerName: "",
                gender: "1",
                idNumber: "",
                phone: "",
                province: "",
                city: "",
                county: "510104",
                qq: "",
                address: "",
                photosUrl: "",
                photosId: 0,
                proPhotosId: 0,
                drivingLicenceNo: "",
                drivingLicenceTime: "",
                vocationalNo: "",
                vocationalLevel: "1",
                drivingCarType: "",
                teachCarType: "",
                workState: "0",
                inputDate: "",
                departureDate: "",
                comments: ""
            },
            assessorFormRules: {
                examinerName: [
                    { required: true, message: "请填写考核员姓名", trigger: "blur" }
                ],
                idNumber: [
                    { required: true, message: "请填写考核员身份证", trigger: "blur" }
                ],
                phone: [
                    { required: true, message: "请填写考核员电话", trigger: "blur" }
                ],
                drivingLicenceNo: [
                    { required: true, message: "请填写考核员驾驶证号", trigger: "blur" }
                ],
                drivingLicenceTime: [
                    { type: "date", required: true, message: "请选择驾驶证初领日期", trigger: "change" }
                ],
                drivingCarType: [
                    { type: "number", required: true, message: "请选择准驾车型", trigger: "change" }
                ],
                teachCarType: [
                    { type: "number", required: true, message: "请选择准教车型", trigger: "change" }
                ],
                workState: [
                    { required: true, message: "请选择供职状态", trigger: "change" }
                ],
                inputDate: [
                    { type: "date", required: true, message: "请选择入职时间", trigger: "change" }
                ],
                deptId: [
                    { required: true, message: "请选择所属单位", trigger: "change" }
                ]
            },
            detailsAssessorFormVisible: false,
            detailsAssessor: {
            },
            editAssessorFormVisible: false,
            editAssessorForm: {
                guardId: 0,
                schoolCode: "",
                schoolName: "",
                guardName: "",
                gender: "",
                genderName: "",
                idNumber: "",
                phone: "",
                province: "",
                provinceName: "",
                city: "",
                cityName: "",
                county: "",
                countyName: "",
                qq: "",
                address: "",
                photosUrl: "",
                photosId: 0,
                proPhotosId: 0,
                drivingLicenceNo: "",
                drivingLicenceTime: "",
                vocationalNo: "",
                vocationalLevel: "",
                drivingCarType: "",
                drivingCarTypeName: "",
                teachCarType: "",
                teachCarTypeName: "",
                workState: "",
                inputDate: "",
                departureDate: "",
                comments: "",
                gmtCreate: "",
                gmtModify: "",
                uploadState: "",
                guardUnifyCode: ""
            },
            total: 0,
            page: 1,
            pageSize: global.pageSize,
            dateList: [],
            photographFormVisible: false,
            // swiperOption: {
            //     mousewheelControl: true,
            //     preventLinksPropagation: false,
            //     nextButton: ".swiper-button-next",
            //     prevButton: ".swiper-button-prev",
            //     onClick: swiper => {
            //         let list = this.dateList;
            //         let $index = swiper.clickedIndex;
            //         list[$index].click = true;
            //         for (var i = 0, len = list.length; i < len; i++) {
            //             if ($index === i) continue;
            //             list[i].click = false;
            //         }
            //         this.filters.classes.date = list[$index].date;
            //         this.queryClasses();
            //     }
            // },
            selected: [],
            classCount: 0,
            selectedAll: false,
            isIndeterminate: false,
            classes: {
                total: 0,
                list: []
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            }
        }
    },
    methods: {
        XykReadInfo() {
            // alert(10086);
            // var beg = new Date();
            var addsCard = document.getElementById("myobj");
            // console.log(addsCard);

            addsCard.SetReaderType('AYUSB');
            // // var results = addsCard.ReadCard();
            var revalue = addsCard.XykReadInfo();
            if (revalue == "") revalue = "错误:" + addsCard.LastError;
            this.input2 = revalue;
            console.log(revalue);

            // var end = new Date();
            // alert(end.getSeconds() * 1000 + end.getMilliseconds() - (beg.getSeconds() * 1000 + beg.getMilliseconds()));
        },
        XykSetInfo() {
            console.log(this.ruleForm)
            // var obj = 
            var setCard = document.getElementById('myobj');
            setCard.SetReaderType('AYUSB');
            let finger = this.ruleForm.noFinger ? 'you' : 'NoFinger';
            var info = setCard.XykSetInfo(
                this.ruleForm.schNo, 
                this.ruleForm.stdNo, 
                this.ruleForm.studentName, 
                this.ruleForm.carType, 
                this.ruleForm.IdCardNo, 
                this.ruleForm.fingerMB1, 
                this.ruleForm.fingerMB2, 
                this.ruleForm.thHour, 
                this.ruleForm.opHour, 
                this.ruleForm.hadRunMile, 
                "",
                this.ruleForm.hadSubMinute, 
                finger);
            // console.log(info);
            if (info == "") info = "错误:" + setCard.LastError;
            this.input2 = info;
        },
        XykSetInfoBeg() {
            var setCard = document.getElementById('myobj');
            setCard.SetReaderType('AYUSB');
            let finger = this.ruleForm.noFinger ? 'you' : 'NoFinger';
            var re = setCard.XykSetInfoBeg(
                this.ruleForm.schNo, 
                this.ruleForm.stdNo, 
                this.ruleForm.studentName, 
                this.ruleForm.carType,
                 this.ruleForm.IdCardNo, 
                 this.ruleForm.fingerMB1, 
                 this.ruleForm.fingerMB2, 
                 this.ruleForm.thHour, 
                 this.ruleForm.opHour, 
                 this.ruleForm.hadRunMile, 
                 "",
                 this.ruleForm.hadSubMinute, 
                 finger);
            if (re == "") re = "设置中...";
            this.input2 = re;
        },

        ieXykSetInfoEnd(Re) {
            var setCard = document.getElementById('myobj');
            if (Re == "") Re = "错误:" + setCard.LastError;
            this.input2 = Re;
        },
        XykFingerCheck() {
            var setCard = document.getElementById('myobj');
            var re = setCard.XykFingerCheck();
            if (re == "") re = "错误:" + setCard.LastError;
            this.input2 = re;
        },
        XykFingerCheckBeg() {
             var setCard = document.getElementById('myobj');
            var re = setCard.XykFingerCheckBeg();
            if (re == "") re = "设置中..."; this.input2 = re;
        },
        ieXykFingerCheckEnd(Re) {
             var setCard = document.getElementById('myobj');
            if (Re == "") Re = "错误:" + setCard.LastError; this.input2 = Re;
        },
        //表格数据格式化
        formatTableData(row, column) {
            if (column.property === "appointmentTeacher") {
                return row.appointmentTeacher ? "是" : "否";
            }
        },
        //转换
        formatData(val, flag, format) {
            if (flag === "date") {
                return (val === "" || val === undefined ? "" : new Date(val).Format(format));
            }
            else if (flag === "workState") {
                return global.enums.workState[val];
            }
            else if (flag === "vocationalLevel") {
                return global.enums.vocationalLevel[val];
            }
        },
        //获取模式字典
        queryModel() {
            let para = [this.schoolCode];
            request.public.queryModel(para).then((res) => {
                if (res.success) {
                    this.modelData = [];
                    let data = res.object;
                    for (let item in data) {
                        this.modelData.push({
                            value: data[item].modelId,
                            label: data[item].modelName
                        });
                    }
                    if (data) {
                        this.addCoachForm.appointmentTeacherInfo.modelId = data[0].modelId;
                    }
                }
            });
        },
        //获取车辆列表
        getVehicles() {
            let para = [this.schoolCode, "", "", this.page, 10000, ""];
            request.basic.vehicle.queryList(para).then((res) => {
                if (res.success === true) {
                    this.vehiclesData = [];
                    let data = res.object.list;
                    for (let item in data) {
                        this.vehiclesData.push({
                            label: data[item].cardNo,
                            value: data[item].id
                        });
                    }
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
        //新增/编辑教练员/安全员/考核员
        createNew(target, flag) {
            // console.log(this)
            if (target === "teacher") {
                if (flag === "add") {
                    this.$refs["addCoachForm"].validate((valid) => {
                        if (valid) {
                            if(this.addCoachForm.timerTeacherInfo.useIccard == 'false'){
                                // console.log()
                                if (this.image !== "") {
                                    let phonePara = {
                                        teacherName: this.addCoachForm.teacherName,
                                        phone: this.addCoachForm.phone,
                                        gender: this.addCoachForm.gender,
                                        photoOfBase64: this.image.substring(this.image.indexOf(",") + 1)
                                    }
                                    let objs = Object.assign({}, phonePara);
                                    request.basic.coach.create.photo.coach(objs).then((res) => {
                                        if (res.success) {
                                            this.addCoachForm.timerTeacherInfo.photosUrl = res.object.photosUrl;
                                            this.addCoachForm.timerTeacherInfo.faceId = res.object.faceId;
                                            this.addCoachForm.timerTeacherInfo.faceppId = res.object.faceppId;
                                            this.addCoachForm.timerTeacherInfo.photosId = res.object.photosId;
                                            this.addCoachForm.timerTeacherInfo.proPhotosId = res.object.proPhotosId;
                                        }
                                        onCreate(this);
                                    });
                                }
                                else {
                                    onCreate(this);
                                }
                                
                            }else{
                                // this.showCard = true;
                                onCreate(this);
                            }
                            function onCreate(that) {
                                    console.info(that);
                                    that.addCoachForm.appointmentTeacherInfo.carId = that.bindCar;
                                    that.addCoachForm.appointmentTeacherInfo.bindCar = that.$refs.bindCar.selectedLabel;
                                    that.addCoachForm.drivingLicenceTime = that.formatData(that.addCoachForm.drivingLicenceTime, "date", "yyyy-MM-dd");
                                    that.addCoachForm.inputDate = that.formatData(that.addCoachForm.inputDate, "date", "yyyy-MM-dd");
                                    that.addCoachForm.departureDate = that.formatData(that.addCoachForm.departureDate, "date", "yyyy-MM-dd");
                                    let para = Object.assign({}, that.addCoachForm);
                                    global.printLog(JSON.stringify(para));
                                    request.basic.coach.create.coach(para).then((res) => {
                                        if (res.success) {
                                            that.getTeachers();
                                            that.resetForm("addCoachForm");
                                            that.addCoachFormVisible = false;
                                            that.$message({ message: "教练员添加成功！", type: "success" });
                                        }
                                        else {
                                            that.addCoachForm.drivingLicenceTime = new Date(that.addCoachForm.drivingLicenceTime);
                                            that.addCoachForm.inputDate = new Date(that.addCoachForm.inputDate);
                                            that.addCoachForm.departureDate = that.formatData(that.addCoachForm.departureDate, "date", "yyyy-MM-dd");
                                            that.$message.error("教练员添加失败！原因：" + res.message);
                                        }
                                    });
                                }
                        }
                    });
                }
                else {
                    this.$refs["editCoachForm"].validate((valid) => {
                        if (valid) {
                            var objExp = new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/);
                            if (this.image === "") {
                                this.$message.warning({ message: "请选择教练员头像！", type: "success" });
                            }
                            else if (!objExp.test(this.image)) {
                                let phonePara = {
                                    teacherName: this.editCoachForm.teacherName,
                                    phone: this.editCoachForm.phone,
                                    gender: this.editCoachForm.gender,
                                    photoOfBase64: this.image.substring(this.image.indexOf(",") + 1)
                                }
                                let objs = Object.assign({}, phonePara);
                                request.basic.coach.create.photo.coach(objs).then((res) => {
                                    if (res.success) {
                                        this.editCoachForm.timerTeacherInfo.photosUrl = res.object.photosUrl;
                                        this.editCoachForm.timerTeacherInfo.faceId = res.object.faceId;
                                        this.editCoachForm.timerTeacherInfo.faceppId = res.object.faceppId;
                                        this.editCoachForm.timerTeacherInfo.photosId = res.object.photosId;
                                        this.editCoachForm.timerTeacherInfo.proPhotosId = res.object.proPhotosId;
                                        // this.editCoachForm.timerTeacherInfo.proPhotosId = res.object.proPhotosId;
                                       
                                        onUpdate(this);
                                    }
                                    else {
                                        this.$message.error("教练员修改失败！原因：" + res.message);
                                    }
                                });
                            }
                            else {
                                onUpdate(this);
                            }
                            function onUpdate(that) {
                                var updatePara = {
                                    "teacherId": that.editCoachForm.teacherId,
                                    "teacherName": that.editCoachForm.teacherName,
                                    "schoolCode": that.editCoachForm.schoolCode,
                                    "gender": that.editCoachForm.gender,
                                    "idNumber": that.editCoachForm.idNumber,
                                    "phone": that.editCoachForm.phone,
                                    "province": that.editCoachForm.province,
                                    "city": that.editCoachForm.city,
                                    "county": that.editCoachForm.county,
                                    "qq": that.editCoachForm.qq,
                                    "address": that.editCoachForm.address,
                                    "drivingLicenceNo": that.editCoachForm.drivingLicenceNo,
                                    "drivingLicenceTime": that.formatData(that.editCoachForm.drivingLicenceTime, "date", "yyyy-MM-dd"),
                                    "vocationalNo": that.editCoachForm.vocationalNo,
                                    "vocationalLevel": that.editCoachForm.vocationalLevel,
                                    "drivingCarType": that.editCoachForm.drivingCarType,
                                    "teachCarType": that.editCoachForm.teachCarType,
                                    "workState": that.editCoachForm.workState,
                                    "inputDate": that.formatData(that.editCoachForm.inputDate, "date", "yyyy-MM-dd"),
                                    "departureDate": that.formatData(that.editCoachForm.departureDate, "date", "yyyy-MM-dd"),
                                    "appointmentTeacher": that.editCoachForm.appointmentTeacher,
                                    "comments": that.editCoachForm.comments,
                                    "deptId": that.editCoachForm.deptId,
                                    "appointmentTeacherInfo": {
                                        "stage": that.editCoachForm.appointmentTeacherInfo.stage,
                                        "isClass": that.editCoachForm.appointmentTeacherInfo.isClass,
                                        "modelId": that.editCoachForm.appointmentTeacherInfo.modelId,
                                        "carId": that.editCoachForm.appointmentTeacherInfo.carId,
                                        "bindCar": that.$refs.bindCar.selectedLabel,
                                        "classPass": that.editCoachForm.appointmentTeacherInfo.classPass,
                                        "floatingPrice": that.editCoachForm.appointmentTeacherInfo.floatingPrice,
                                    },
                                    "timerTeacherInfo": {
                                        "photosUrl": that.editCoachForm.timerTeacherInfo.photosUrl,
                                        "faceId": that.editCoachForm.timerTeacherInfo.faceId,
                                        "faceppId": that.editCoachForm.timerTeacherInfo.faceppId,
                                        "photosId": that.editCoachForm.timerTeacherInfo.photosId,
                                        "proPhotosId": that.editCoachForm.timerTeacherInfo.proPhotosId,
                                        "useIccard":that.editCoachForm.timerTeacherInfo.useIccard
                                    }
                                }
                                let para = Object.assign({}, updatePara);
                                request.basic.coach.update(para).then((res) => {
                                    if (res.success) {
                                        that.getTeachers();
                                        that.editCoachFormVisible = false;
                                        that.$message({ message: "教练员修改成功！", type: "success" });
                                    }
                                    else {
                                        that.$message.error("教练员修改失败！原因：" + res.message);
                                    }
                                });
                            }
                        }
                    });
                }
            }
            else if (target === "so") {
                if (flag === "add") {
                    this.$refs["addSOForm"].validate((valid) => {
                        if (valid) {
                            if (this.image !== "") {
                                let phonePara = {
                                    photoOfBase64: this.image.substring(this.image.indexOf(",") + 1)
                                }
                                request.basic.securityGuard.create.photo(phonePara).then((res) => {
                                    if (res.success) {
                                        this.addSOForm.photosId = res.object.photosId;
                                        this.addSOForm.photosUrl = res.object.photosUrl;
                                        this.addSOForm.proPhotosId = res.object.proPhotosId;
                                    }
                                    onCreateSO(this);
                                });
                            }
                            else {
                                onCreateSO(this);
                            }
                            function onCreateSO(that) {
                                that.addSOForm.inputDate = that.formatData(that.addSOForm.inputDate, "date", "yyyy-MM-dd");
                                that.addSOForm.departureDate = that.formatData(that.addSOForm.departureDate, "date", "yyyy-MM-dd");
                                that.addSOForm.drivingLicenceTime = that.formatData(that.addSOForm.drivingLicenceTime, "date", "yyyy-MM-dd");
                                let para = Object.assign({}, that.addSOForm);
                                global.printLog(JSON.stringify(para));
                                request.basic.securityGuard.create.securityGuard(para).then((res) => {
                                    global.printLog(res);
                                    if (res.success) {
                                        that.getSecurityGuard();
                                        //this.resetForm("addSOForm");
                                        that.addSOFormVisible = false;
                                        that.$message({ message: "安全员添加成功！", type: "success" });
                                    }
                                    else {
                                        that.addSOForm.drivingLicenceTime = new Date(that.addSOForm.drivingLicenceTime);
                                        that.addSOForm.inputDate = new Date(that.addSOForm.inputDate);
                                        that.addSOForm.departureDate = that.formatData(that.addSOForm.departureDate, "date", "yyyy-MM-dd");
                                        that.$message.error("安全员添加失败！原因：" + res.message);
                                    }
                                });
                            }
                        }
                    });
                }
                else {
                    this.$refs["editSOForm"].validate((valid) => {
                        if (valid) {
                            var objExp = new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/);
                            if (this.image === "") {
                                this.$message.warning({ message: "请选择安全员头像！", type: "success" });
                            }
                            else if (!objExp.test(this.image)) {
                                let phonePara = {
                                    photoOfBase64: this.image.substring(this.image.indexOf(",") + 1)
                                }
                                let objs = Object.assign({}, phonePara);
                                request.basic.securityGuard.create.photo(objs).then((res) => {
                                    global.printLog(res);
                                    if (res.success) {
                                        this.editSOForm.photosUrl = res.object.photosUrl;
                                        this.editSOForm.photosId = res.object.photosId;
                                        this.editSOForm.proPhotosId = res.object.proPhotosId;
                                        onUpdate(this);
                                    }
                                    else {
                                        this.$message.error("安全员修改失败！原因：" + res.message);
                                    }
                                });
                            }
                            else {
                                onUpdate(this);
                            }
                            function onUpdate(that) {
                                let updatePara = {
                                    schoolCode: that.editSOForm.schoolCode,
                                    guardId: that.editSOForm.guardId,
                                    guardName: that.editSOForm.guardName,
                                    gender: that.editSOForm.gender,
                                    idNumber: that.editSOForm.idNumber,
                                    phone: that.editSOForm.phone,
                                    province: that.editSOForm.province,
                                    city: that.editSOForm.city,
                                    county: that.editSOForm.county,
                                    qq: that.editSOForm.qq,
                                    address: that.editSOForm.address,
                                    photosUrl: that.editSOForm.photosUrl,
                                    photosId: that.editSOForm.photosId,
                                    proPhotosId: that.editSOForm.proPhotosId,
                                    drivingLicenceNo: that.editSOForm.drivingLicenceNo,
                                    drivingLicenceTime: that.formatData(that.editSOForm.drivingLicenceTime, "date", "yyyy-MM-dd"),
                                    vocationalNo: that.editSOForm.vocationalNo,
                                    vocationalLevel: that.editSOForm.vocationalLevel,
                                    drivingCarType: that.editSOForm.drivingCarType,
                                    teachCarType: that.editSOForm.teachCarType,
                                    workState: that.editSOForm.workState,
                                    inputDate: that.formatData(that.editSOForm.inputDate, "date", "yyyy-MM-dd"),
                                    departureDate: that.formatData(that.editSOForm.departureDate, "date", "yyyy-MM-dd"),
                                    comments: that.editSOForm.comments
                                }
                                let para = Object.assign({}, updatePara);
                                request.basic.securityGuard.update(para).then((res) => {
                                    if (res.success) {
                                        that.getSecurityGuard();
                                        that.editSOFormVisible = false;
                                        that.$message({ message: "安全员修改成功！", type: "success" });
                                    }
                                    else {
                                        that.$message.error("安全员修改失败！原因：" + res.message);
                                    }
                                });
                            }
                        }
                    });
                }
            }
            else if (target === "assessor") {
                if (flag === "add") {
                    this.$refs["addAssessorForm"].validate((valid) => {
                        if (valid) {
                            if (this.image !== "") {
                                let phonePara = {
                                    photoOfBase64: this.image.substring(this.image.indexOf(",") + 1)
                                }
                                request.basic.examiner.create.photo(phonePara).then((res) => {
                                    if (res.success) {
                                        this.addAssessorForm.photosId = res.object.photosId;
                                        this.addAssessorForm.photosUrl = res.object.photosUrl;
                                        this.addAssessorForm.proPhotosId = res.object.proPhotosId;
                                    }
                                    onCreateAssessor(this);
                                });
                            }
                            else {
                                onCreateAssessor(this);
                            }
                            function onCreateAssessor(that) {
                                that.addAssessorForm.inputDate = that.formatData(that.addAssessorForm.inputDate, "date", "yyyy-MM-dd");
                                that.addAssessorForm.departureDate = that.formatData(that.addAssessorForm.departureDate, "date", "yyyy-MM-dd");
                                that.addAssessorForm.drivingLicenceTime = that.formatData(that.addAssessorForm.drivingLicenceTime, "date", "yyyy-MM-dd");
                                let para = Object.assign({}, that.addAssessorForm);
                                global.printLog(JSON.stringify(para));
                                request.basic.examiner.create.examiner(para).then((res) => {
                                    global.printLog(res);
                                    if (res.success) {
                                        that.getExaminer();
                                        //this.resetForm("addAssessorForm");
                                        that.addAssessorFormVisible = false;
                                        that.$message({ message: "考核员添加成功！", type: "success" });
                                    }
                                    else {
                                        that.addAssessorForm.drivingLicenceTime = new Date(that.addAssessorForm.drivingLicenceTime);
                                        that.addAssessorForm.inputDate = new Date(that.addAssessorForm.inputDate);
                                        that.addAssessorForm.departureDate = that.formatData(that.addAssessorForm.departureDate, "date", "yyyy-MM-dd");
                                        that.$message.error("考核员添加失败！原因：" + res.message);
                                    }
                                });
                            }
                        }
                    });
                }
                else {
                    this.$refs["editAssessorForm"].validate((valid) => {
                        if (valid) {
                            var objExp = new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/);
                            if (this.image === "") {
                                this.$message.warning({ message: "请选择考核员头像！", type: "success" });
                            }
                            else if (!objExp.test(this.image)) {
                                let phonePara = {
                                    photoOfBase64: this.image.substring(this.image.indexOf(",") + 1)
                                }
                                let objs = Object.assign({}, phonePara);
                                request.basic.examiner.create.photo(objs).then((res) => {
                                    if (res.success) {
                                        this.editAssessorForm.photosUrl = res.object.photosUrl;
                                        this.editAssessorForm.photosId = res.object.photosId;
                                        this.editAssessorForm.proPhotosId = res.object.proPhotosId;
                                        onUpdate(this);
                                    }
                                    else {
                                        this.$message.error("考核员修改失败！原因：" + res.message);
                                    }
                                });
                            }
                            else {
                                onUpdate(this);
                            }
                            function onUpdate(that) {
                                let updatePara = {
                                    schoolCode: that.editAssessorForm.schoolCode,
                                    examinerId: that.editAssessorForm.examinerId,
                                    examinerName: that.editAssessorForm.examinerName,
                                    gender: that.editAssessorForm.gender,
                                    idNumber: that.editAssessorForm.idNumber,
                                    phone: that.editAssessorForm.phone,
                                    province: that.editAssessorForm.province,
                                    city: that.editAssessorForm.city,
                                    county: that.editAssessorForm.county,
                                    qq: that.editAssessorForm.qq,
                                    address: that.editAssessorForm.address,
                                    photosUrl: that.editAssessorForm.photosUrl,
                                    photosId: that.editAssessorForm.photosId,
                                    proPhotosId: that.editAssessorForm.proPhotosId,
                                    drivingLicenceNo: that.editAssessorForm.drivingLicenceNo,
                                    drivingLicenceTime: that.formatData(that.editAssessorForm.drivingLicenceTime, "date", "yyyy-MM-dd"),
                                    vocationalNo: that.editAssessorForm.vocationalNo,
                                    vocationalLevel: that.editAssessorForm.vocationalLevel,
                                    drivingCarType: that.editAssessorForm.drivingCarType,
                                    teachCarType: that.editAssessorForm.teachCarType,
                                    workState: that.editAssessorForm.workState,
                                    inputDate: that.formatData(that.editAssessorForm.inputDate, "date", "yyyy-MM-dd"),
                                    departureDate: that.formatData(that.editAssessorForm.departureDate, "date", "yyyy-MM-dd"),
                                    comments: that.editAssessorForm.comments
                                }
                                let para = Object.assign({}, updatePara);
                                request.basic.examiner.update(para).then((res) => {
                                    if (res.success) {
                                        that.getExaminer();
                                        that.editAssessorFormVisible = false;
                                        that.$message({ message: "考核员修改成功！", type: "success" });
                                    }
                                    else {
                                        that.$message.error("考核员修改失败！原因：" + res.message);
                                    }
                                });
                            }
                        }
                    });
                }
            }
            else if (target === "leave") {
                if (this.leaveType.label === "按天请假") {
                    if (this.leaveType.day.begin === "" || this.leaveType.day.end === "") {
                        this.$message.warning("请假开始日期和结束日期不能为空");
                        return;
                    }
                    this.coachLeaveForm.beginTime = new Date(this.leaveType.day.begin).Format("yyyy-MM-dd 00:00:00");
                    this.coachLeaveForm.endTime = new Date(this.leaveType.day.end).Format("yyyy-MM-dd") + " 23:59:59";
                }
                else {
                    if (this.leaveType.day.beginTime === "" || this.leaveType.day.endTime === "") {
                        this.$message.warning("请假开始时间和结束时间不能为空");
                        return;
                    }
                    this.coachLeaveForm.beginTime = new Date(this.leaveType.time.begin).Format("yyyy-MM-dd HH:mm:ss");
                    this.coachLeaveForm.endTime = new Date(this.leaveType.time.end).Format("yyyy-MM-dd HH:mm:ss");
                }
                if (new Date(this.coachLeaveForm.beginTime).getTime() > new Date(this.coachLeaveForm.endTime).getTime()) {
                    this.$message.warning("请假开始时间不能大于结束时间");
                }
                else {
                    let objs = Object.assign({}, this.coachLeaveForm);
                    request.basic.coach.create.teacherLeave(objs).then((res) => {
                        if (res.success) {
                            this.coachLeaveFormVisible = false;
                            this.$message({ message: "请假成功！", type: "success" });
                        }
                        else {
                            this.$message.error("请假失败！原因：" + res.message);
                        }
                    });
                }
            }
        },
        //查询教练员
        getTeachers() {
            this.pageLoading = true;
            let para = [this.schoolCode, this.teachers.page, this.pageSize, this.filters.teacher.keyWord];
            setTimeout(() => {
                request.basic.coach.query.list(para).then((res) => {
                    if (res.success === true) {
                        this.pageLoading = false;
                        global.printLog(res.object.num);
                        this.teachers.total = res.object.num;
                        this.teachers.data = res.object.list;
                    }
                });
            }, 1000);
        },
        //查询教练员详情
        getTeachersDetail(id) {
            request.basic.coach.query.detail(id).then((res) => {
                if (res.success === true) {
                    let data = res.object;
                    global.printLog(data);
                    // console.info(data);
                    // this.datas.province = data.province;
                    // this.datas.provinceName = data.provinceName;
                    // this.datas.city = data.city;
                    // this.datas.cityName = data.cityName;
                    // this.datas.county = data.county;
                    // this.datas.countyName = data.countyName;
                    this.detailTeacher = data;
                    this.detailTeacher.regionName = global.convertToString(data.provinceName) + "" + global.convertToString(data.cityName) + "" + global.convertToString(data.countyName);
                    this.detailTeacher.departureDate = (data.departureDate === "" || data.departureDate === null ? "" : data.departureDate);
                    this.editCoachForm = data;
                    this.editCoachForm.timerTeacherInfo.useIccard = data.timerTeacherInfo.useIccard.toString();
                    this.selectedUnitOptions = [];
                    this.editCoachForm.inputDate = data.inputDate === null ? "" : new Date(data.inputDate);
                    this.editCoachForm.departureDate = (data.departureDate === "" || data.departureDate === null ? "" : data.departureDate);
                    this.editCoachForm.drivingLicenceTime = data.drivingLicenceTime === null ? "" : new Date(data.drivingLicenceTime);
                    this.editCoachForm.drivingCarType = data.drivingCarType;
                    this.editCoachForm.teachCarType = data.teachCarType;
                    this.editCoachForm.gender = global.convertToString(data.gender);
                    this.editCoachForm.workState = global.convertToString(data.workState);
                    this.editCoachForm.vocationalLevel = global.convertToString(data.vocationalLevel);
                    this.editCoachForm.appointmentTeacherInfo.stage = global.convertToString(data.appointmentTeacherInfo.stage);
                    this.editCoachForm.appointmentTeacherInfo.carId = global.convertToString(data.appointmentTeacherInfo.carId);

                    var units = data.deptIdListInfo;
                    for (let item in units) {
                        this.selectedUnitOptions.push(units[item].deptId + "&" + units[item].deptName);
                    }
                    this.editCoachForm.deptId = global.convertToString(units[units.length - 1].deptId);
                    this.bindCar = global.convertToString(data.appointmentTeacherInfo.carId);
                    this.image = data.timerTeacherInfo.photosUrl;
                }
                this.detailsCoachFormVisible = true;
            });
        },
        //查询安全员
        getSecurityGuard() {
            this.pageLoading = true;
            let para = [this.schoolCode, this.page, this.pageSize, this.filters.securityGuard.keyWord];
            setTimeout(() => {
                request.basic.securityGuard.query.list(para).then((res) => {
                    if (res.success === true) {
                        this.soteachers.total = res.object.num;
                        this.soteachers.data = res.object.list;
                        this.pageLoading = false;
                    }
                });
            }, 1000);
        },
        //查询安全员详情
        getSecurityGuardDetail(id) {
            let para = [id];
            request.basic.securityGuard.query.detail(para).then((res) => {
                if (res.success === true) {
                    let data = res.object;
                    global.printLog(JSON.stringify(data));
                    this.detailsSO = data;
                    this.detailsSO.regionName = global.convertToString(data.provinceName) + "" + global.convertToString(data.cityName) + "" + global.convertToString(data.countyName);
                    this.detailsSO.departureDate = (data.departureDate === "" || data.departureDate === null ? "" : data.departureDate);
                    this.editSOForm = data;
                    this.image = data.photosUrl;
                    this.editSOForm.gender = global.convertToString(data.gender);
                    this.editSOForm.workState = global.convertToString(data.workState);
                    this.editSOForm.vocationalLevel = global.convertToString(data.vocationalLevel);
                    this.editSOForm.inputDate = data.inputDate === null ? "" : new Date(data.inputDate);
                    this.editSOForm.drivingLicenceTime = data.drivingLicenceTime === "" || data.drivingLicenceTime === null ? "" : new Date(data.drivingLicenceTime);
                    this.editSOForm.departureDate = (data.departureDate === "" || data.departureDate === null ? "" : data.departureDate);
                }
            });
        },
        //查询考核员
        getExaminer() {
            this.pageLoading = true;
            let para = [this.schoolCode, this.page, this.pageSize, this.filters.examiner.keyWord];
            setTimeout(() => {
                request.basic.examiner.query.list(para).then((res) => {
                    if (res.success === true) {
                        global.printLog(res);
                        this.assessors.total = res.object.num;
                        this.assessors.data = res.object.list;
                        this.pageLoading = false;
                    }
                });
            }, 1000);
        },
        //查询考核员详情
        getExaminerDetail(id) {
            let para = [id];
            request.basic.examiner.query.detail(para).then((res) => {
                if (res.success === true) {
                    let data = res.object;
                    global.printLog(data);
                    this.detailsAssessor = data;
                    this.detailsAssessor.regionName = global.convertToString(data.provinceName) + "" + global.convertToString(data.cityName) + "" + global.convertToString(data.countyName);
                    this.detailsAssessor.departureDate = (data.departureDate === "" || data.departureDate === null ? "" : data.departureDate);
                    this.editAssessorForm = data;
                    this.image = data.photosUrl;
                    this.editAssessorForm.drivingCarType = data.drivingCarType === null ? "" : parseInt(data.drivingCarType);
                    this.editAssessorForm.teachCarType = data.teachCarType === null ? "" : parseInt(data.teachCarType);
                    this.editAssessorForm.gender = global.convertToString(data.gender);
                    this.editAssessorForm.workState = global.convertToString(data.workState);
                    this.editAssessorForm.vocationalLevel = global.convertToString(data.vocationalLevel);
                    this.editAssessorForm.inputDate = data.inputDate === null ? "" : new Date(data.inputDate);
                    this.editAssessorForm.drivingLicenceTime = data.drivingLicenceTime === null ? "" : new Date(data.drivingLicenceTime);
                    this.editAssessorForm.departureDate = (data.departureDate === "" || data.departureDate === null ? "" : data.departureDate);
                }
            });
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
        createRecord(flag) {
            if (flag === "teachers") {
                let teachers = this.recordTeachers.teacherIdList;
                if (teachers.length > 0) {
                    let para = Object.assign({}, this.recordTeachers);
                    request.basic.coach.create.record(para).then((res) => {
                        if (res.success) {
                            this.$msgbox({
                                title: "系统提示",
                                message: res.object,
                                confirmButtonText: "确定",
                                closeOnClickModal: false,
                                beforeClose: (action, instance, done) => {
                                    if (action === "confirm" || action === "cancel") {
                                        done();
                                        this.getTeachers();
                                    }
                                }
                            }).then(action => { });
                        }
                        else {
                            this.$message.error("教练员备案失败！原因：" + res.message);
                        }
                    });
                }
                else {
                    this.$message.error("请先选择要备案的教练！");
                }
            }
            else if (flag === "securityGuard") {
                let teachers = this.recordSecurityGuard.teacherIdList;
                if (teachers.length > 0) {
                    let para = Object.assign({}, this.recordSecurityGuard);
                    request.basic.securityGuard.create.record(para).then((res) => {
                        if (res.success) {
                            this.$msgbox({
                                title: "系统提示",
                                message: res.object,
                                confirmButtonText: "确定",
                                closeOnClickModal: false,
                                beforeClose: (action, instance, done) => {
                                    if (action === "confirm" || action === "cancel") {
                                        done();
                                        this.getSecurityGuard();
                                    }
                                }
                            }).then(action => { });
                        }
                        else {
                            this.$message.error("安全员备案失败！原因：" + res.message);
                        }
                    });
                }
                else {
                    this.$message.error("请先选择要备案的安全员！");
                }
            }
            else if (flag === "examiner") {
                let teachers = this.recordExaminer.teacherIdList;
                if (teachers.length > 0) {
                    let para = Object.assign({}, this.recordExaminer);
                    request.basic.examiner.create.record(para).then((res) => {
                        if (res.success) {
                            this.$msgbox({
                                title: "系统提示",
                                message: res.object,
                                confirmButtonText: "确定",
                                closeOnClickModal: false,
                                beforeClose: (action, instance, done) => {
                                    if (action === "confirm" || action === "cancel") {
                                        done();
                                        this.getExaminer();
                                    }
                                }
                            }).then(action => { });
                        }
                        else {
                            this.$message.error("考核员备案失败！原因：" + res.message);
                        }
                    });
                }
                else {
                    this.$message.error("请先选择要备案的考核员！");
                }
            }
        },
        handleAdd(target) {
            this.image = "";
            if (target === 1) {
                this.addCoachForm = {
                    schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                    teacherName: "",
                    gender: "1",
                    idNumber: "",
                    phone: "",
                    province: "",
                    city: "",
                    county: "",
                    qq: "",
                    address: "",
                    workState: "",
                    photosUrl: "",
                    drivingLicenceNo: "",
                    drivingLicenceTime: "",
                    vocationalNo: "",
                    vocationalLevel: "",
                    drivingCarType: "",
                    teachCarType: "",
                    inputDate: "",
                    departureDate: "",
                    appointmentTeacher: false,
                    comments: "",
                    deptId: 0,
                    appointmentTeacherInfo: {
                        stage: "2",
                        isClass: false,
                        modelId: "",
                        carId: "",
                        bindCar: "",
                        classPass: false,
                        floatingPrice: ""
                    },
                    timerTeacherInfo: {
                        photosUrl: "",
                        faceId: 0,
                        faceppId: "",
                        photosId: 0,
                        useIccard:'false',
                        proPhotosId: 0
                    }
                };
                this.addCoachFormVisible = true;
            }
            else if (target === 2) {
                this.addSOForm = {
                    schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                    guardName: "",
                    gender: "1",
                    idNumber: "",
                    phone: "",
                    province: "",
                    city: "",
                    county: "",
                    qq: "",
                    address: "",
                    photosUrl: "",
                    photosId: 0,
                    proPhotosId: 0,
                    drivingLicenceNo: "",
                    drivingLicenceTime: "",
                    vocationalNo: "",
                    vocationalLevel: "1",
                    drivingCarType: "",
                    teachCarType: "",
                    workState: "0",
                    inputDate: "",
                    departureDate: "",
                    comments: ""
                };
                this.addSOFormVisible = true;
            }
            else {
                this.addAssessorForm = {
                    schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                    examinerName: "",
                    gender: "1",
                    idNumber: "",
                    phone: "",
                    province: "",
                    city: "",
                    county: "510104",
                    qq: "",
                    address: "",
                    photosUrl: "",
                    photosId: 0,
                    proPhotosId: 0,
                    drivingLicenceNo: "",
                    drivingLicenceTime: "",
                    vocationalNo: "",
                    vocationalLevel: "1",
                    drivingCarType: "",
                    teachCarType: "",
                    workState: "0",
                    inputDate: "",
                    departureDate: "",
                    comments: ""
                };
                this.addAssessorFormVisible = true;
            }
            this.thisShow = true;
            //this.resetForm(["addCoachForm", "editCoachForm", "addSOForm", "editSOForm", "addAssessorForm", "editAssessorForm"]);
        },
        rowClick(row, evt, column) {
            if (column.type === "default") {
                if (this.radioHeaderSel === "教练员") {
                    this.getTeachersDetail(row.teacherId);
                }
                else if (this.radioHeaderSel === "安全员") {
                    this.getSecurityGuardDetail(row.guardId);
                    this.detailsSOFormVisible = true;
                }
                else {
                    this.getExaminerDetail(row.examinerId);
                    this.detailsAssessorFormVisible = true;
                }
            }
        },
        coachLeave(row) {
            this.coachLeaveForm.teacherId = row.teacherId;
            this.coachLeaveForm.schoolCode = row.schoolCode;
            this.coachLeaveFormVisible = true;
        },
        //打开教练报班窗体
        coachNewForm(row) {
            this.coachNewClassFormVisible = true;
            this.filters.classes.teacherId = row.teacherId;
            this.filters.classes.schoolCode = row.schoolCode;
            this.queryClasses();
        },
        //查询报班时段（By教练ID）
        queryClasses() {
            this.selected = [];
            this.emptyVisible = false;
            this.filters.classes.loading = true;
            let teacherId = this.filters.classes.teacherId;
            request.basic.coach.query.detail(teacherId).then((res) => {
                if (res.success === true) {
                    let data = res.object;
                    //global.printLog(data);
                    setTimeout(() => {
                        let date = this.filters.classes.date !== "" ? new Date(this.filters.classes.date).Format("yyyy-MM-dd") : "";
                        let para = [this.filters.classes.page, this.filters.classes.pageSize, this.filters.classes.schoolCode, date, data.appointmentTeacherInfo.modelId, this.filters.classes.stage, "", teacherId];
                        //global.printLog(para);
                        request.appointment.classes.query.classesWall(para).then((res) => {
                            if (res.success === true) {
                                this.classCount = 0;
                                let data = res.object.list;
                                let total = res.object.num;
                                this.classes.list = [];
                                for (let item in data) {
                                    this.classes.list.push({
                                        teacherName: data[item].teacherName,
                                        phone: data[item].phone,
                                        photosUrl: data[item].photosUrl,
                                        classDOS: data[item].classDOS
                                    });
                                    for (let dos in data[item].classDOS) {
                                        if (data[item].classDOS[dos].teacherIsClass === 1) {
                                            this.classCount++;
                                        }
                                    }
                                }
                            }
                            this.filters.classes.loading = false;
                            if (!res.object.num) {
                                this.emptyVisible = true;
                            }
                        });
                    }, 1000);
                }
            });
        },
        //报班
        releaseClasses() {
            let para = { times: [] };
            let selected = this.selected;
            for (let item in selected) {
                para.times.push({
                    schoolCode: this.schoolCode,
                    teacherId: selected[item].teacherId,
                    classDate: selected[item].classDate,
                    beginTime: selected[item].beginTime,
                    endTime: selected[item].endTime,
                    stage: selected[item].stage,
                    state: 20,
                    personCount: selected[item].personCount,
                    cost: selected[item].cost,
                    classMin: selected[item].classMin,
                    modelId: selected[item].modelId,
                    addUserId: JSON.parse(sessionStorage.getItem("user")).userId,
                    addUserName: JSON.parse(sessionStorage.getItem("user")).userName,
                    addUserType: 30
                });
            }
            let data = Object.assign({}, para);
            global.printLog(JSON.stringify(data));
            request.appointment.classes.create(data).then((res) => {
                if (res.success === true) {
                    this.queryClasses();
                    this.$message({ message: res.object, type: "success" });
                }
            });
        },
        handleSelected(data) {
            if (!data.check) {
                data.check = true;
                this.selected.push(data);
            }
            else {
                data.check = false;
                this.selected.splice(this.selected.indexOf(data), 1);
            }
        },
        handleAllSelectedChange(evt) {
            this.selected = [];
            let data = this.classes.list;
            for (let item in data) {
                for (let dos in data[item].classDOS) {
                    if (data[item].classDOS[dos].teacherIsClass === 1) {
                        data[item].classDOS[dos].check = evt.target.checked;
                        if (evt.target.checked) {
                            this.selected.push(data[item].classDOS[dos]);
                        }
                    }
                }
            }
            this.isIndeterminate = false;
        },
        handleCurrentChange(val) {
            this.teachers.page = this.soteachers.page = this.assessors.page = 1;
            if (this.radioHeaderSel === "教练员") {
                this.teachers.page = val;
                this.getTeachers();
            }
            else if (this.radioHeaderSel === "安全员") {
                this.soteachers.page = val;
                this.getSecurityGuard();
            }
            else {
                this.assessors.page = val;
                this.getExaminer();
            }
        },
        //报班需要免审状态切换
        appointmentChange(evt) {
            if (!evt.target.checked) {
                this.addCoachForm.appointmentTeacherInfo.classPass = evt.target.checked;
                this.editCoachForm.appointmentTeacherInfo.classPass = evt.target.checked;
            }
        },
        //所属单位值切换
        departmentChange(item) {
            var len = item.length - 1;
            var value = item[len].split("&");
            this.addCoachForm.deptId = value[0];
        },
        //分校切换
        branchSchoolChange(item) {
            global.printLog(item);
        },
        //Dialog被关闭回调
        dialogClose() {
            if (!this.photographFormVisible) {
                //this.image = "";
                $("#webcam").children().remove();
            }
            if (!this.coachNewClassFormVisible) {
                // let list = this.dateList;
                // for (var i = 0, len = list.length; i < len; i++) {
                //     list[i].click = false;
                // }
                // list[0].click = true;
                this.filters.classes.stage = "2";
                this.filters.classes.date = new Date().Format("yyyy-MM-dd");
            }
            if (!this.coachLeaveFormVisible) {
                this.leaveType.time.begin = "";
                this.leaveType.day.begin = "";
                this.leaveType.time.end = "";
                this.leaveType.day.end = "";
                this.leaveType.label = "按天请假";
                this.coachLeaveForm.comments = "";
            }
        },
        //Dialog被打开回调
        dialogOpen() {
            $(".el-cascader-menus").css("z-index", "20002");
            if (this.photographFormVisible) {
                $(document).ready(function () {
                    var pos = 0;
                    var ctx = null;
                    var image = [];
                    this.isCam = false;
                    //获取画布对象
                    var canvas = document.getElementById("canvas");
                    //获取画布的Context对象
                    ctx = canvas.getContext("2d");
                    //复制画布上的像素数据
                    image = ctx.getImageData(0, 0, 320, 240);
                    //保存拍照图片到画布
                    var saveCB = function (data) {
                        var col = data.split(";");
                        var img = image;
                        for (var i = 0; i < 320; i++) {
                            var tmp = parseInt(col[i]);
                            img.data[pos + 0] = (tmp >> 16) & 0xff;
                            img.data[pos + 1] = (tmp >> 8) & 0xff;
                            img.data[pos + 2] = tmp & 0xff;
                            img.data[pos + 3] = 0xff;
                            pos += 4;
                        }
                        if (pos >= 4 * 320 * 240) {
                            //将图片数据放回画布
                            ctx.putImageData(img, 0, 0);
                            pos = 0;
                            this.isCam = true;
                        }
                    };

                    jQuery("#webcam").webcam({
                        width: 320,
                        height: 240,
                        mode: "callback",
                        swffile: "http://www.jq22.com/demo/jQuery-webcam-master/jscam_canvas_only.swf",
                        onTick: function () { },
                        onSave: saveCB,
                        onCapture: function () {
                            webcam.save();
                        },
                        debug: function (type, string) { },
                        onLoad: function () {
                            var cams = webcam.getCameraList();
                            if (cams.length > 0) {
                                this.isCam = true;
                                for (var i in cams) {
                                    $("#cams").append("<li>" + cams[i] + "</li>");
                                }
                            }
                            else {
                                this.isCam = false;
                            }
                        }
                    });
                });
            }
        },
        onPhotograph() {
            webcam.capture();
        },
        openFile() {
            this.$refs.upload.click();
        },
        onFileChange(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            const isLt2M = files[0].size / 1024 / 1024 < 2;
            const validateType = files[0].type === "image/jpeg" || files[0].type === "image/jpg" || files[0].type === "image/png";
            if (!validateType) {
                this.$message.error("上传头像只能是 JPG 或 PNG 图片格式!");
            }
            else if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
            }
            else {
                this.createImage(files[0]);
            }
        },
        createImage(file) {
            if (typeof FileReader === "undefined") {
                alert("您的浏览器不支持图片上传，请升级您的浏览器");
                return false;
            }
            var image = new Image();
            var reader = new FileReader();
            var vm = this;
            reader.onload = function (e) {
                vm.image = e.target.result;
            };
            reader.readAsDataURL(file);
        },
        savePhoto() {
            if (this.photographFormVisible) {
                $("#webcam").children().remove();
                var canvas = document.getElementById("canvas");
                var PHOTOOFBASE64 = canvas.toDataURL("image/png");
                this.image = PHOTOOFBASE64;
                PHOTOOFBASE64 = PHOTOOFBASE64.substring(PHOTOOFBASE64.indexOf(",") + 1);
                this.photographFormVisible = false;
            }
        },
        handleOpenEdit(teacher, target) {
            let that = this;
            if (target === "teacher") {
                that.detailsCoachFormVisible = false;
                setTimeout(function () {
                    that.editCoachFormVisible = true;
                }, 200);
            }
            else if (target === "so") {
                that.detailsSOFormVisible = false;
                setTimeout(function () {
                    that.editSOFormVisible = true;
                }, 200);
            }
            else if (target === "assessor") {
                that.detailsAssessorFormVisible = false;
                setTimeout(function () {
                    that.editAssessorFormVisible = true;
                }, 200);
            }
            that.thisShow = true;
        },
        handleDelete(row, flag) {
            if (flag === "teacher") {
                this.$confirm("您正在删除教练【" + row.teacherName + "】, 是否继续？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnClickModal: false,
                    type: "warning"
                }).then(() => {
                    request.basic.coach.delete(row.teacherId).then((res) => {
                        if (res.success) {
                            this.getTeachers();
                            this.$message({ message: "教练员删除成功！", type: "success" });
                        }
                        else {
                            this.$message.error("教练员删除失败！原因：" + res.message);
                        }
                    })
                }).catch(() => { });
            }
            else if (flag === "so") {
                this.$confirm("您正在删除安全员【" + row.guardName + "】, 是否继续？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnClickModal: false,
                    type: "warning"
                }).then(() => {
                    request.basic.securityGuard.delete(row.guardId).then((res) => {
                        if (res.success) {
                            this.getSecurityGuard();
                            this.detailsSOFormVisible = false;
                            this.$message({ message: "安全员删除成功！", type: "success" });
                        }
                        else {
                            this.$message.error("安全员删除失败！原因：" + res.message);
                        }
                    })
                }).catch(() => { });
            }
            else {
                this.$confirm("您正在删除考核员【" + row.examinerName + "】, 是否继续？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnClickModal: false,
                    type: "warning"
                }).then(() => {
                    request.basic.examiner.delete(row.examinerId).then((res) => {
                        if (res.success) {
                            this.getExaminer();
                            this.detailsAssessorFormVisible = false;
                            this.$message({ message: "考核员删除成功！", type: "success" });
                        }
                        else {
                            this.$message.error("考核员删除失败！原因：" + res.message);
                        }
                    })
                }).catch(() => { });
            }
        },
        handleSelectionChange(data) {
            if (this.radioHeaderSel === "教练员") {
                this.recordTeachers.teacherIdList = [];
                for (let item in data) {
                    this.recordTeachers.teacherIdList.push({ teacherId: data[item].teacherId });
                }
            }
            else if (this.radioHeaderSel === "安全员") {
                this.recordSecurityGuard.teacherIdList = [];
                for (let item in data) {
                    this.recordSecurityGuard.teacherIdList.push({ teacherId: data[item].guardId });
                }
            }
            else if (this.radioHeaderSel === "考核员") {
                this.recordExaminer.teacherIdList = [];
                for (let item in data) {
                    this.recordExaminer.teacherIdList.push({ teacherId: data[item].examinerId });
                }
            }
        },
        handleCommand(command) {
            if (this.radioHeaderSel === "教练员") {
                if (command === "export") {
                    let downLink = document.getElementById("down-link");
                    downLink.setAttribute("href", request.baseUrl + "/sc/teacher/exportTeacher?keyWord=" + this.filters.teacher.keyWord + "&schoolCode=" + this.schoolCode);
                    downLink.click();
                }
                else if (command === "record") {
                    this.createRecord("teachers");
                }
            }
            else if (this.radioHeaderSel === "安全员") {
                if (command === "export") {
                    let downLink = document.getElementById("down-link");
                    downLink.setAttribute("href", request.baseUrl + "/sc/teacher/exportSecurityGuard?keyWord=" + this.filters.securityGuard.keyWord + "&schoolCode=" + this.schoolCode);
                    downLink.click();
                }
                else if (command === "record") {
                    this.createRecord("securityGuard");
                }
            }
            else {
                if (command === "export") {
                    let downLink = document.getElementById("down-link");
                    downLink.setAttribute("href", request.baseUrl + "/sc/teacher/exportExaminer?keyWord=" + this.filters.examiner.keyWord + "&schoolCode=" + this.schoolCode);
                    downLink.click();
                }
                else if (command === "record") {
                    this.createRecord("examiner");
                }
            }
        },
        handleExport(filename) {
            var jsono = [{//测试数据
                "保质期临期预警(天)": "保质期临期预警(天)",
                "商品标题": "商品标题",
                "建议零售价": "建议零售价",
                "高(cm)": "高(cm)",
                "商品描述": "商品描述",
                "保质期禁售(天)": "保质期禁售(天)",
                "商品名称": "商品名称",
                "商品简介": "商品简介",
                "宽(cm)": "宽(cm)",
                "阿达": "阿达",
                "货号": "货号",
                "商品条码": "商品条码",
                "商品品牌": "商品品牌",
                "净容积(cm^3)": "净容积(cm^3)",
                "是否保质期管理": "是否保质期管理",
                "是否串号管理": "是否串号管理",
                "商品颜色": "商品颜色",
                "尺码": "尺码",
                "是否批次管理": "是否批次管理",
                "商品编号": "商品编号",
                "商品简称": "商品简称",
                "毛重(g)": "毛重(g)",
                "长(cm)": "长(cm)",
                "英文名称": "英文名称",
                "净重(g)": "净重(g)",
                "商品分类": "商品分类",
                "这里超过了": "这里超过了",
                "保质期(天)": "保质期(天)"
            }, {
                "保质期临期预警(天)": "adventLifecycle",
                "商品标题": "title",
                "建议零售价": "defaultPrice",
                "高(cm)": "height",
                "商品描述": "Description",
                "保质期禁售(天)": "lockupLifecycle",
                "商品名称": "skuName",
                "商品简介": "brief",
                "宽(cm)": "width",
                "阿达": "asdz",
                "货号": "goodsNo",
                "商品条码": "skuNo",
                "商品品牌": "brand",
                "净容积(cm^3)": "netVolume",
                "是否保质期管理": "isShelfLifeMgmt",
                "是否串号管理": "isSNMgmt",
                "商品颜色": "color",
                "尺码": "size",
                "是否批次管理": "isBatchMgmt",
                "商品编号": "skuCode",
                "商品简称": "shortName",
                "毛重(g)": "grossWeight",
                "长(cm)": "length",
                "英文名称": "englishName",
                "净重(g)": "netWeight",
                "商品分类": "categoryId",
                "这里超过了": 1111.0,
                "保质期(天)": "expDate"
            }];
            var tmpDown; //导出的二进制对象
            global.downloadExl(jsono, filename, "");
        },
        listenData(result, tag) {
            console.warn(result)
            if (this.addCoachFormVisible) {
                this.addCoachForm.province = result[0].province.code;
                this.addCoachForm.city = result[0].city.code;
                this.addCoachForm.county = result[0].code;
            }
            else if (this.editCoachFormVisible) {
                this.editCoachForm.province = result[0].province.code;
                this.editCoachForm.city = result[0].city.code;
                this.editCoachForm.county = result[0].code;
            }
            else if (this.addSOFormVisible) {
                this.addSOForm.province = result[0].province.code;
                this.addSOForm.city = result[0].city.code;
                this.addSOForm.county = result[0].code;
            }
            else if (this.editSOFormVisible) {
                this.editSOForm.province = result[0].province.code;
                this.editSOForm.city = result[0].city.code;
                this.editSOForm.county = result[0].code;
            }
            else if (this.addAssessorFormVisible) {
                this.addAssessorForm.province = result[0].province.code;
                this.addAssessorForm.city = result[0].city.code;
                this.addAssessorForm.county = result[0].code;
            }
            else if (this.editAssessorFormVisible) {
                this.editAssessorForm.province = result[0].province.code;
                this.editAssessorForm.city = result[0].city.code;
                this.editAssessorForm.county = result[0].code;
            }
        },
        teacherTypeChange(val) {
            if (val === "教练员") {
                this.getTeachers();
            }
            else if (val === "安全员") {
                this.getSecurityGuard();
            }
            else {
                this.getExaminer();
            }
        },
        leaveTypeChange(val) {
            if (val === "按天请假") {
                this.beginText = "开始日期";
                this.endText = "结束日期";
            }
            else {
                this.beginText = "开始时间";
                this.endText = "结束时间";
            }
        },
        //重置表单数据
        resetForm(formNames) {
            for (var item in formNames) {
                try {
                    this.$refs[formNames[item]].resetFields();
                }
                catch (e) { }
            }
        }
    },
    components: {
        PCA
    },
    created() {
        // this.dateList = global.getDays(new Date().Format("yyyy-MM-dd"), 100);
        // this.dateList[0].click = true;
    },
    activated() {
        global.printLog("activated every one");
        this.queryModel();
        this.getCarType();
        this.getBranchSchool();
        this.getVehicles();
        this.getDepartment();
        this.teacherTypeChange(this.radioHeaderSel);
    },
    mounted() {
    },
    watch: {
        selected() {
            let selectedCount = this.selected.length;
            this.selectedAll = selectedCount === 0 ? false : selectedCount === this.classCount;
            this.isIndeterminate = selectedCount > 0 && selectedCount < this.classCount;
        }
    }
}

</script>

<style scope lang="scss">
.el-dialog__body {
    padding: 0 20px;
    .el-dialog__header {
        padding: 20px 20px 20px;
    }
}

.leaveForm {
    margin-top: 20px;
    .el-date-editor.el-input,
    .el-textarea__inner {
        width: 300px;
    }
}

.wall {
    border: 1px solid #E7EBED;
    margin: 0;
    border-right: 0;
}

.wall .data-header {
    height: 64px;
    width: 100%;
}

.wall .data-header .left-header {
    width: 100px;
    float: left;
    display: inline-block;
    border-right: 1px solid #E7EBED;
}

.wall .data-header .left-header div.back-slant {
    width: 100px;
    height: 63px;
    position: relative;
    background-color: transparent;
}

.wall .data-header .left-header div.back-slant span.time {
    left: 55px;
    top: 8px;
}

.wall .data-header .left-header div.back-slant span.coach {
    left: 18px;
    top: 35px;
}

.wall .data-header .left-header div.back-slant span {
    position: absolute;
    z-index: 999;
    font-size: 14px;
    color: #8799AB;
}

.wall .data-header .left-header div.back-slant:before {
    position: absolute;
    top: 0px;
    right: 0;
    left: 0;
    bottom: 0;
    border-bottom: 63px solid #E7EBED;
    border-right: 101px solid transparent;
    content: "";
}

.wall .data-header .left-header div.back-slant:after {
    position: absolute;
    left: 0;
    right: 1px;
    top: 1px;
    bottom: 0;
    border-bottom: 63px solid #FFF;
    border-right: 101px solid transparent;
    content: "";
}

.wall .data-header .right-top {
    float: left;
    display: inline-block;
    height: 64px;
}

.wall .data-header .right-top .week-row {
    height: 64px;
    width: 100%;
    border-bottom: 1px solid #E7EBED;
}

.wall .data-header .right-top .week-row span {
    height: 20px;
    line-height: 40px;
    display: block;
}

.wall .data-header .right-top .week-row a {
    display: inline-block;
    height: 53px;
    text-align: center;
    text-decoration: none;
    color: #8799ab;
    float: left;
    border-right: 1px solid #E7EBED;
    padding: 6px 30px;
}
</style>