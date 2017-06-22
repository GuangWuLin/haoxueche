<template>
    <section v-loading="pageLoading">
        <a href="" download=".xlsx" id="down-link"></a>
        <a id="loadPDF" href="http://182.140.213.46:8888/group1/M00/01/31/wKgKJliZjouAJQlRAASfWE3xQiY601.pdf"></a>
        <!--工具条-->
        <el-row>
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input class="search-input mr10 left" v-model="filters.keyWord" placeholder="输入学员姓名、电话" icon="search" :on-icon-click="queryStudents"></el-input>
                        <VTYPE :type="filters.curCarType" tag="vtype" v-on:child-emit="listenData" style="width:120px;" class="mr10 left"></VTYPE>
                        <el-select v-model="filters.curStuType" style="width:135px;" placeholder="选择类型" class="mr10" @change="queryStudents">
                            <el-option label="全部状态" value="1"></el-option>
                            <el-option label="总校学员" value="2"></el-option>
                            <el-option label="完成报名学员" value="3"></el-option>
                        </el-select>
                        <el-select v-model="filters.isAppointment" style="width:135px;" placeholder="选择培训类型" class="mr10" @change="queryStudents" ref="mySel">
                            <el-option label="全部类型" value=""></el-option>
                            <el-option label="预约培训" value=true></el-option>
                            <el-option label="传统培训" value=false></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="right">
                        <el-dropdown @command="handleCommand">
                            <el-button type="primary">
                                批量操作
                                <i class="el-icon-caret-bottom el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <!--<el-dropdown-item command="print">打印档案</el-dropdown-item>-->
                                <el-dropdown-item command="export">导出表格</el-dropdown-item>
                                <el-dropdown-item command="filing">备案学员</el-dropdown-item>
                                <el-dropdown-item command="report">报总校</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-form-item>
                    <el-button type="primary" @click="handleShowNewWin" class="mr20 right">学员报名</el-button>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="students" highlight-current-row @selection-change="handleSelectionChange" @row-click="rowClick">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="studentName" label="姓名">
                </el-table-column>
                <el-table-column prop="phone" label="电话">
                </el-table-column>
                <el-table-column prop="carTypeName" label="车型">
                </el-table-column>
                <el-table-column prop="schoolName" label="分校">
                </el-table-column>
                <!--<el-table-column prop="trainTypeName" label="培训类型">
                                                                                </el-table-column>
                                                                                <el-table-column prop="appointmentCount" label="预约次数">
                                                                                </el-table-column>-->
                <el-table-column prop="stage2Progress" label="科二进度">
                </el-table-column>
                <el-table-column prop="stage3Progress" label="科三进度">
                </el-table-column>
                <el-table-column prop="uploadState" label="备案状态" :formatter="formatter">
                </el-table-column>
                <el-table-column prop="reportState" label="上报状态" :formatter="formatter">
                </el-table-column>
                <el-table-column prop="signTime" label="报名日期">
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button type="text" size="small" @click.stop="handleAppointment(scope.$index, scope.row,'appointment')" :disabled="scope.row.trainTypeName!=='预约培训'||scope.row.isLearnFirst===true?true:false">预约</el-button>
                        <el-button type="text" size="small" @click.stop="handleAppointment(scope.$index, scope.row,'look')">照片</el-button>
                        <el-button type="text" size="small" :disabled="scope.row.applicationformState!==30" @click.stop="handleAppointment(scope.$index, scope.row,'print')">打印申请表</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--工具条-->
            <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="total">
            </el-pagination>
        </el-row>
        <el-dialog title="学员预约" v-model="appointmentCoachFormVisible" :close-on-click-modal="false" size="full" @close="dialogClose('appointment');">
            <el-row class="toolbar mt20" :gutter="10">
                <el-form :inline="true" :model="filters">
                    <el-form-item style="width:150px;">
                        <el-select v-model="filters.reservation.stage" ref="stageSel" @change="handleQueryAfterResetData">
                            <el-option label="科目二" value="2"></el-option>
                            <el-option label="科目三" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input class="search-input" v-model="filters.reservation.keyword" placeholder="输入教练姓名、电话" icon="search" :on-icon-click="handleQueryAfterResetData"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker type="date" placeholder="选择日期" v-model="filters.reservation.date" :clearable="false" :editable="false" @change="handleQueryAfterResetData" :picker-options="pickerOptions"></el-date-picker>
                    </el-form-item>
                    <el-form-item class="right">
                        <el-button type="primary" @click.native="handleCreateReservation" size="large" :disabled="filters.reservation.selected.length?false:true">确认预约{{filters.reservation.selected.length?'('+filters.reservation.selected.length+')':''}}</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row v-loading="filters.reservation.loading">
                <div v-for="list in filters.reservation.data" class="classes-review">
                    <div class="coach-photo">
                        <img v-bind:src="list.photosUrl" />
                        <p>{{list.teacherName}}</p>
                        <p>{{list.phone}}</p>
                    </div>
                    <div class="classes">
                        <span v-for="item in list.timeDOS">
                            <a href="javascript:" v-if="item.isOrder===1" v-bind:class="[item.check?'is-review':'']" @click="handleSelected(item,list)">
                                <p>{{item.orderTime}}</p>
                                <p>{{item.message}}</p>
                            </a>
                            <a v-else class="is-selected">
                                <p>{{item.orderTime}}</p>
                                <p>{{item.message}}</p>
                            </a>
                        </span>
                    </div>
                </div>
            </el-row>
            <el-row class="t-center">
                <el-button type="text" v-if="filters.reservation.data.length" :disabled="filters.reservation.loadMore?false:true" @click="handleLoadMore">{{filters.reservation.loadMore?"查看更多":"无更多数据"}}</el-button>
            </el-row>
            <div class="glyph-icon icon-empty empty-data" v-if="filters.reservation.emptyVisible">
                <p>暂无数据</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="appointmentCoachFormVisible = false" size="large">关闭</el-button>
            </div>
        </el-dialog>
        <!--学员报名-->
        <el-dialog title="学员报名" v-model="addStuFormVisible" :close-on-click-modal="false" size="full" @close="dialogClose('new')" @open="dialogOpen()">
            <el-form v-if="addStuFormVisible" :model="addStuForm" :rules="stuFormRules" ref="addStuForm" :inline="true" class="demo-form-inline" label-width="85px">
                <p class="group-title">
                    个人信息
                    <el-button size="small" type="primary" @click="readMachine('id')" style="position:absolute;top:15px;left:735px;">身份证读卡器识别</el-button>
                    <el-button size="small" type="primary" @click="readMachine('high')" :disabled="decline_timer==0?false:true" style="position:absolute;top:15px;left:605px;">{{(decline_timer==0?'高拍仪识别':decline_timer+'秒后识别高拍仪')}}</el-button>
                </p>
                <el-form-item label="姓名" prop="studentName">
                    <el-input auto-complete="off" v-model="addStuForm.studentName"></el-input>
                </el-form-item>
                <el-form-item label="性别" class="normal" prop="gender">
                    <el-select v-model="addStuForm.gender" placeholder="请选择性别">
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="国籍" class="normal" prop="nationality">
                    <el-select placeholder="请选择国籍" v-model="addStuForm.nationality">
                        <el-option label="中国" value="中国"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证件类型" prop="cardNo">
                    <el-input v-model="addStuForm.cardNo" placeholder="输入证件号" style="width:485px;">
                        <el-select slot="prepend" placeholder="请选择" v-model="addStuForm.cardType">
                            <el-option label="身份证" value="1"></el-option>
                            <el-option label="护照" value="2"></el-option>
                            <el-option label="军官证" value="3"></el-option>
                            <el-option label="其他" value="4"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item label="报名时间" prop="signTime">
                    <el-date-picker type="date" placeholder="报名时间" v-model="addStuForm.signTime" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="登记住所区划" class="addr">
                    <PCA v-if="thisShow" tag="reg" v-on:child-emit="listenData" :county="addStuForm.registCounty"></PCA>
                </el-form-item>
                <el-form-item label="登记住所地址" prop="registAddress" class="addr">
                    <el-input auto-complete="off" v-model="addStuForm.registAddress"></el-input>
                </el-form-item>
                <el-form-item label="出生日期" prop="birthday">
                    <el-date-picker type="date" placeholder="出生日期" v-model="addStuForm.birthday" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="身份证有效期" prop="effectiveDate">
                    <el-date-picker type="date" placeholder="身份证有效期" v-model="addStuForm.effectiveDate" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="入校时间" prop="enterTime">
                    <el-date-picker type="date" placeholder="入校时间" v-model="addStuForm.enterTime" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="培训车型" class="normal" prop="carType">
                    <el-select v-model="addStuForm.carType" placeholder="请选择培训车型">
                        <el-option v-for="item in carTypeOptions" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="电话号码" prop="phone">
                    <el-input auto-complete="off" v-model="addStuForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱">
                    <el-input auto-complete="off" v-model="addStuForm.email"></el-input>
                </el-form-item>
                <el-form-item label="所属单位" class="normal" prop="deptId">
                    <el-cascader :options="departmentData" :show-all-levels="false" @change="departmentChange" :change-on-select="true" v-model="selectedUnitOptions" :filterable="true">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="户籍" prop="register" class="normal">
                    <el-select placeholder="请选择户籍" v-model="addStuForm.register">
                        <el-option label="本地" value="1"></el-option>
                        <el-option label="外地" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="居住证号" prop="timerStudentInfo.residenceNo" v-if="addStuForm.register==='2'">
                    <el-input auto-complete="off" v-model="addStuForm.timerStudentInfo.residenceNo"></el-input>
                </el-form-item>
                <el-form-item label="业务类型" class="normal" prop="studyType">
                    <el-select v-model="addStuForm.studyType" placeholder="请选择业务类型">
                        <el-option label="初领" value="0"></el-option>
                        <el-option label="增驾" value="1"></el-option>
                        <el-option label="其他" value="9"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否发卡" class="normal" prop="timerStudentInfo.useIccard">
                    <el-select v-model="addStuForm.timerStudentInfo.useIccard" placeholder="请选择是否发卡">
                        <el-option label="否" value="false"></el-option>
                        <el-option label="是" value="true"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="初领日期" v-if="addStuForm.studyType==='1'" prop="drivingLicenceTime">
                    <el-date-picker type="date" placeholder="初领日期" v-model="addStuForm.drivingLicenceTime"></el-date-picker>
                </el-form-item>
                <el-form-item label="原准驾车型" class="normal" v-if="addStuForm.studyType==='1'" prop="oldCarType">
                    <el-select placeholder="请选择原准驾车型" v-model="addStuForm.oldCarType">
                        <el-option v-for="item in carTypeOptions" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="驾驶证号" v-if="addStuForm.studyType==='1'" prop="drivingLicenceNo">
                    <el-input auto-complete="off" v-model="addStuForm.drivingLicenceNo"></el-input>
                </el-form-item>
                <el-form-item label="联系住所区划" class="cs">
                    <PCA v-if="thisShow" tag="basic" v-on:child-emit="listenData" :county="addStuForm.county"></PCA>
                </el-form-item>
                <el-form-item label="联系邮政编码" prop="postalcode">
                    <el-input auto-complete="off" v-model="addStuForm.postalcode"></el-input>
                </el-form-item>
                <el-form-item label="联系住所地址" class="addr" prop="address">
                    <el-input auto-complete="off" v-model="addStuForm.address"></el-input>
                </el-form-item>
                <el-form-item label="招生人" prop="recruitUser">
                    <el-input auto-complete="off" v-model="addStuForm.recruitUser"></el-input>
                </el-form-item>
                <el-form-item label="办理人" prop="transactor">
                    <el-input auto-complete="off" v-model="addStuForm.transactor" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="分校" class="normal" prop="brachSchool">
                    <el-select placeholder="请选择分校" v-model="brachSchool" @change="handleBrachSchoolChange">
                        <el-option v-for="item in branchSchoolData" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否跨校" class="normal" prop="timerStudentInfo.isTransfer">
                    <el-select placeholder="请选择" v-model="addStuForm.timerStudentInfo.isTransfer">
                        <el-option label="否" :value="false"></el-option>
                        <el-option label="是" :value="true"></el-option>
                    </el-select>
                </el-form-item>
                <p class="group-title">健康状况</p>
                <el-form-item label="身高" prop="height">
                    <el-input auto-complete="off" v-model="addStuForm.timerStudentInfo.height"></el-input>
                </el-form-item>
                <el-form-item label="左视力" prop="leftVision">
                    <el-input auto-complete="off" v-model="addStuForm.timerStudentInfo.leftVision"></el-input>
                </el-form-item>
                <el-form-item label="右视力" prop="rightVision">
                    <el-input auto-complete="off" v-model="addStuForm.timerStudentInfo.rightVision"></el-input>
                </el-form-item>
                <el-form-item label="辨色力" class="normal" prop="colorVision">
                    <el-select placeholder="请选择辨色力" v-model="addStuForm.timerStudentInfo.colorVision">
                        <el-option label="正常" value="正常"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="听力" class="normal" prop="hearing">
                    <el-select placeholder="请选择听力" v-model="addStuForm.timerStudentInfo.hearing">
                        <el-option label="正常" value="正常"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="左下肢" class="normal" prop="leftLegs">
                    <el-select placeholder="请选择左下肢" v-model="addStuForm.timerStudentInfo.leftLegs">
                        <el-option label="正常" value="正常"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="右下肢" class="normal" prop="rightLegs">
                    <el-select placeholder="请选择右下肢" v-model="addStuForm.timerStudentInfo.rightLegs">
                        <el-option label="正常" value="正常"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="躯干颈部" class="normal" prop="trunkNeck">
                    <el-select placeholder="请选择躯干颈部" v-model="addStuForm.timerStudentInfo.trunkNeck">
                        <el-option label="正常" value="正常"></el-option>
                    </el-select>
                </el-form-item>
                <p class="group-title">
                    权限设置
                    <el-switch v-model="addStuForm.isAppointment" on-text="打开" off-text="关闭" on-color="#13ce66" off-color="#999" style="margin-left:12px;font-size:13px;"></el-switch>
                    <div style="width:83%;margin:0 auto;" v-if="addStuForm.isAppointment===true">
                        <p>
                            <el-select v-model="addStuForm.appointmentStudentInfo.appointmentType" placeholder="请选择" @change="appointmentTypeChange">
                                <el-option label="预约扣除剩余分钟" value="20"></el-option>
                                <el-option label="预约扣除学费余额" value="10"></el-option>
                            </el-select>
                            <span v-if="addStuForm.appointmentStudentInfo.appointmentType==='20'">&nbsp;&nbsp;为学员初次充值&nbsp;&nbsp;科目二&nbsp;&nbsp;
                                <el-input auto-complete="off" style="width:80px;" v-model="addStuForm.appointmentStudentInfo.stage2Time"></el-input>&nbsp;分钟&nbsp;&nbsp;科目三&nbsp;&nbsp;
                                <el-input auto-complete="off" style="width:80px;" v-model="addStuForm.appointmentStudentInfo.stage3Time"></el-input>&nbsp;分钟</span>
                            <span v-if="addStuForm.appointmentStudentInfo.appointmentType==='10'">&nbsp;&nbsp;为学员初次充值&nbsp;
                                <el-input auto-complete="off" style="width:80px;" v-model="addStuForm.appointmentStudentInfo.costBalance" :disabled="rechargeDisabled"></el-input>&nbsp;元</span>
                            <p style="line-height: 30px;margin-top:10px;">
                                <el-checkbox v-model="addStuForm.appointmentStudentInfo.forceEva">必须完成评价才能继续预约</el-checkbox>
                            </p>
                            <p style="line-height: 30px;">
                                <el-checkbox v-model="appointmentsLimit">限制学员预约次数</el-checkbox>
                                <div style="margin-left:22px;" v-if="appointmentsLimit">
                                    <p>每天最多预约&nbsp;
                                        <el-input auto-complete="off" style="width:60px;margin-top:10px;margin-bottom:10px;" size="mini" ref="dayCount" type="number" min="0"></el-input>&nbsp;次</p>
                                    <p>每周最多预约&nbsp;
                                        <el-input auto-complete="off" style="width:60px;margin-bottom:10px;" size="mini" ref="weekCount" type="number" min="0"></el-input>&nbsp;次</p>
                                </div>
                            </p>
                            <p style="line-height: 30px;" v-if="addStuForm.appointmentStudentInfo.appointmentType==='10'">
                                <el-checkbox v-model="addStuForm.appointmentStudentInfo.isLearnFirst" @change="studyAfterPaidChange">是否先学后付</el-checkbox>
                            </p>
                            <p style="line-height: 30px;margin-top:10px;">
                                <span>浮动价格&nbsp;&nbsp;
                                    <el-input auto-complete="off" style="width:80px;" v-model="addStuForm.appointmentStudentInfo.floatingPrice"></el-input>&nbsp;&nbsp;元</span>
                            </p>
                            <p class="selCoach" style="line-height: 40px;margin-top:10px;">
                                <span class="mr20">绑定教练</span>
                                <el-tag v-for="item in addStuForm.bindTeacherInfo" :closable="true" :close-transition="false" @close="handleTagClose(item)" v-if="item.teacherName">
                                    {{item.teacherName}}
                                </el-tag>
                                <el-button type="primary" icon="plus" :plain="true" @click="bindTeacherList=[];queryCoach();selectFormVisible = true"></el-button>
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
                <el-button @click.native="thisShow=false;addStuFormVisible = false" size="large">取消</el-button>
                <el-button type="primary" size="large" @click="createNew('add')" :loading="btnLoading">保存</el-button>
            </div>
            <object classid="clsid:10946843-7507-44FE-ACE8-2B3483D179B7" id="CVR_IDCard" name="CVR_IDCard" width="0" height="0" class="hide"></object>
        </el-dialog>
        <!--学员修改-->
        <el-dialog title="修改" v-model="editStuFormVisible" :close-on-click-modal="false" size="full" @close="dialogClose('edit')">
            <el-form :model="editStuForm" :rules="stuFormRules" ref="editStuForm" :inline="true" class="demo-form-inline" label-width="85px">
                <p class="group-title">个人信息</p>
                <el-form-item label="姓名" prop="studentName">
                    <el-input auto-complete="off" v-model="editStuForm.studentName"></el-input>
                </el-form-item>
                <el-form-item label="性别" class="normal" prop="gender">
                    <el-select v-model="editStuForm.gender" placeholder="请选择性别">
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="国籍" class="normal" prop="nationality">
                    <el-select placeholder="请选择国籍" v-model="editStuForm.nationality">
                        <el-option label="中国" value="中国"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证件类型" prop="cardNo">
                    <el-input v-model="editStuForm.cardNo" placeholder="输入证件号" style="width:485px;" :disabled="editStuForm.timerStudentInfo.uploadState!==0">
                        <el-select slot="prepend" placeholder="请选择" v-model="editStuForm.cardType" :disabled="editStuForm.timerStudentInfo.uploadState!==0">
                            <el-option label="身份证" value="1"></el-option>
                            <el-option label="护照" value="2"></el-option>
                            <el-option label="军官证" value="3"></el-option>
                            <el-option label="其他" value="4"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item label="报名时间" prop="signTime">
                    <el-date-picker type="date" placeholder="报名时间" v-model="editStuForm.signTime" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="登记住所区划" class="cs">
                    <PCA v-if="thisShow" tag="reg" v-on:child-emit="listenData" :county="editStuForm.registCounty"></PCA>
                </el-form-item>
                <el-form-item label="登记住所地址" prop="registAddress" class="addr">
                    <el-input auto-complete="off" v-model="editStuForm.registAddress"></el-input>
                </el-form-item>
                <el-form-item label="出生日期" prop="birthday">
                    <el-date-picker type="date" placeholder="出生日期" v-model="editStuForm.birthday" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="身份证有效期" prop="effectiveDate">
                    <el-date-picker type="date" placeholder="身份证有效期" v-model="editStuForm.effectiveDate" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="入校时间" prop="enterTime">
                    <el-date-picker type="date" placeholder="入校时间" v-model="editStuForm.enterTime" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="培训车型" class="normal" prop="carType">
                    <el-select v-model="editStuForm.carType" placeholder="请选择培训车型" :disabled="editStuForm.timerStudentInfo.uploadState!==0">
                        <el-option v-for="item in carTypeOptions" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="电话号码" prop="phone">
                    <el-input auto-complete="off" v-model="editStuForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱">
                    <el-input auto-complete="off" v-model="editStuForm.email"></el-input>
                </el-form-item>
                <el-form-item label="所属单位" class="normal" prop="deptId">
                    <el-cascader :options="departmentData" :show-all-levels="false" @change="departmentChange" :change-on-select="true" v-model="selectedUnitOptions" :filterable="true">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="户籍" prop="register" class="normal">
                    <el-select placeholder="请选择户籍" v-model="editStuForm.register">
                        <el-option label="本地" value="1"></el-option>
                        <el-option label="外地" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="居住证号" prop="timerStudentInfo.residenceNo" v-if="editStuForm.register==='2'">
                    <el-input auto-complete="off" v-model="editStuForm.timerStudentInfo.residenceNo"></el-input>
                </el-form-item>
                <el-form-item label="业务类型" class="normal" prop="studyType">
                    <el-select v-model="editStuForm.studyType" placeholder="请选择业务类型" :disabled="editStuForm.timerStudentInfo.uploadState!==0">
                        <el-option label="初领" value="0"></el-option>
                        <el-option label="增驾" value="1"></el-option>
                        <el-option label="其他" value="9"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="初领日期" v-if="editStuForm.studyType==='1'" prop="drivingLicenceTime">
                    <el-date-picker type="date" placeholder="初领日期" v-model="editStuForm.drivingLicenceTime"></el-date-picker>
                </el-form-item>
                <el-form-item label="原准驾车型" class="normal" v-if="editStuForm.studyType==='1'" prop="oldCarType">
                    <el-select placeholder="请选择原准驾车型" v-model="editStuForm.oldCarType">
                        <el-option v-for="item in carTypeOptions" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="驾驶证号" v-if="editStuForm.studyType==='1'" prop="drivingLicenceNo">
                    <el-input auto-complete="off" v-model="editStuForm.drivingLicenceNo"></el-input>
                </el-form-item>
                <el-form-item label="联系住所区划" class="cs">
                    <PCA v-if="thisShow" tag="basic" v-on:child-emit="listenData" :county="editStuForm.county"></PCA>
                </el-form-item>
                <el-form-item label="联系邮政编码" prop="postalcode">
                    <el-input auto-complete="off" v-model="editStuForm.postalcode"></el-input>
                </el-form-item>
                <el-form-item label="联系住所地址" class="addr" prop="address">
                    <el-input auto-complete="off" v-model="editStuForm.address"></el-input>
                </el-form-item>
                <!--修改处的发卡信息与添加学员时一致-->
                <el-form-item label="是否发卡" class="normal" prop="timerStudentInfo.useIccard">
                    <el-select :disabled="addStuForm.timerStudentInfo.useIccard==='true'" v-model="editStuForm.timerStudentInfo.useIccard" placeholder="请选择是否发卡">
                        <el-option label="否" value="false"></el-option>
                        <el-option label="是" value="true"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="招生人" prop="recruitUser">
                    <el-input auto-complete="off" v-model="editStuForm.recruitUser"></el-input>
                </el-form-item>
                <el-form-item label="办理人" prop="transactor">
                    <el-input auto-complete="off" v-model="editStuForm.transactor"></el-input>
                </el-form-item>
                <el-form-item label="分校" class="normal" prop="brachSchool">
                    <el-select placeholder="请选择分校" v-model="brachSchool" @change="handleBrachSchoolChange">
                        <el-option v-for="item in branchSchoolData" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否跨校" class="normal">
                    <el-select placeholder="请选择" v-model="editStuForm.timerStudentInfo.isTransfer">
                        <el-option label="否" :value="false"></el-option>
                        <el-option label="是" :value="true"></el-option>
                    </el-select>
                </el-form-item>
                <p class="group-title">健康状况</p>
                <el-form-item label="身高" prop="height">
                    <el-input auto-complete="off" v-model="editStuForm.timerStudentInfo.height"></el-input>
                </el-form-item>
                <el-form-item label="左视力" prop="leftVision">
                    <el-input auto-complete="off" v-model="editStuForm.timerStudentInfo.leftVision"></el-input>
                </el-form-item>
                <el-form-item label="右视力" prop="rightVision">
                    <el-input auto-complete="off" v-model="editStuForm.timerStudentInfo.rightVision"></el-input>
                </el-form-item>
                <el-form-item label="辨色力" class="normal" prop="colorVision">
                    <el-select placeholder="请选择辨色力" v-model="editStuForm.timerStudentInfo.colorVision">
                        <el-option label="正常" value="正常"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="听力" class="normal" prop="hearing">
                    <el-select placeholder="请选择听力" v-model="editStuForm.timerStudentInfo.hearing">
                        <el-option label="正常" value="正常"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="左下肢" class="normal" prop="leftLegs">
                    <el-select placeholder="请选择左下肢" v-model="editStuForm.timerStudentInfo.leftLegs">
                        <el-option label="正常" value="正常"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="右下肢" class="normal" prop="rightLegs">
                    <el-select placeholder="请选择右下肢" v-model="editStuForm.timerStudentInfo.rightLegs">
                        <el-option label="正常" value="正常"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="躯干颈部" class="normal" prop="trunkNeck">
                    <el-select placeholder="请选择躯干颈部" v-model="editStuForm.timerStudentInfo.trunkNeck">
                        <el-option label="正常" value="正常"></el-option>
                    </el-select>
                </el-form-item>
                <p class="group-title">
                    权限设置
                    <el-switch v-model="editStuForm.isAppointment" :disabled="appointmentDisabled" on-text="打开" off-text="关闭" on-color="#13ce66" off-color="#999" style="margin-left:12px;font-size:13px;"></el-switch>
                    <div style="width:83%;margin:0 auto;" v-if="editStuForm.isAppointment===true">
                        <p>
                            <el-select v-model="editStuForm.appointmentStudentInfo.appointmentType" placeholder="请选择">
                                <el-option label="预约扣除剩余分钟" value="20"></el-option>
                                <el-option label="预约扣除学费余额" value="10"></el-option>
                            </el-select>
                            <span v-if="editStuForm.appointmentStudentInfo.appointmentType==='20'" class="hide">&nbsp;&nbsp;为学员初次充值&nbsp;&nbsp;科目二&nbsp;&nbsp;
                                <el-input auto-complete="off" style="width:80px;" v-model="editStuForm.appointmentStudentInfo.stage2Time"></el-input>&nbsp;分钟&nbsp;&nbsp;科目三&nbsp;&nbsp;
                                <el-input auto-complete="off" style="width:80px;" v-model="editStuForm.appointmentStudentInfo.stage3Time"></el-input>&nbsp;分钟</span>
                            <span v-if="editStuForm.appointmentStudentInfo.appointmentType==='10'" class="hide">&nbsp;&nbsp;为学员初次充值&nbsp;
                                <el-input auto-complete="off" style="width:80px;" v-model="editStuForm.appointmentStudentInfo.costBalance" :disabled="rechargeDisabled"></el-input>&nbsp;元</span>
                            <p style="line-height: 30px;margin-top:10px;">
                                <el-checkbox v-model="editStuForm.appointmentStudentInfo.forceEva">必须完成评价才能继续预约</el-checkbox>
                            </p>
                            <p style="line-height: 30px;">
                                <el-checkbox v-model="appointmentsLimit">限制学员预约次数</el-checkbox>
                                <div style="margin-left:22px;" v-if="appointmentsLimit">
                                    <p>每天最多预约&nbsp;
                                        <el-input auto-complete="off" style="width:40px;margin-top:10px;margin-bottom:10px;" size="mini" v-model="editStuForm.appointmentStudentInfo.dayCount===-1?'':editStuForm.appointmentStudentInfo.dayCount" ref="dayCount"></el-input>&nbsp;次</p>
                                    <p>每周最多预约&nbsp;
                                        <el-input auto-complete="off" style="width:40px;margin-bottom:10px;" size="mini" v-model="editStuForm.appointmentStudentInfo.weekCount===-1?'':editStuForm.appointmentStudentInfo.weekCount" ref="weekCount"></el-input>&nbsp;次</p>
                                </div>
                            </p>
                            <p style="line-height: 30px;" v-if="editStuForm.appointmentStudentInfo.appointmentType==='10'">
                                <el-checkbox v-model="learnFirst">是否先学后付</el-checkbox>
                            </p>
                            <p style="line-height: 30px;margin-top:10px;">
                                <span>浮动价格&nbsp;&nbsp;
                                    <el-input auto-complete="off" style="width:80px;" v-model="editStuForm.appointmentStudentInfo.floatingPrice"></el-input>&nbsp;&nbsp;元</span>
                            </p>
                            <p class="selCoach" style="line-height: 40px;margin-top:10px;">
                                <span class="mr20">绑定教练</span>
                                <el-tag v-for="item in editStuForm.bindTeacherInfo" :closable="true" :close-transition="false" @close="handleTagClose(item)">
                                    {{item.teacherName}}
                                </el-tag>
                                <el-button type="primary" icon="plus" :plain="true" @click="queryCoach();selectFormVisible = true"></el-button>
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
                <el-button @click.native="editStuFormVisible = false" size="large">取消</el-button>
                <el-button type="primary" size="large" @click="createNew('edit')" :loading="btnLoading">保存</el-button>
            </div>
        </el-dialog>
        <!--高拍仪拍照-->
        <el-dialog title="照片" v-model="photoFormVisible" :close-on-click-modal="false" size="small" @close="dialogClose('high')">
            <el-row class="mt20 ml15">
                <el-col :span="8">
                    <el-table :data="photoObject" :show-header="false" :border="true" @row-click="handlePhotoTableRowClcik">
                        <el-table-column type="index"></el-table-column>
                        <el-table-column prop="photosType" width="150px" align="left" :formatter="formatter"></el-table-column>
                        <el-table-column>
                            <template scope="scope">
                                <el-button type="text" size="small" style="cursor:default;color:#999;" v-if="scope.row.isHide">未拍照</el-button>
                                <el-button type="text" size="small" style="cursor:default;color:#13ce66;" v-if="scope.row.reportState===10">已拍照</el-button>
                                <el-button type="text" size="small" style="cursor:default;color:#1F2D3D;" v-if="scope.row.reportState===20">上报中</el-button>
                                <el-button type="text" size="small" style="cursor:default;color:#13ce66;" v-if="scope.row.reportState===30">上报成功</el-button>
                                <el-tooltip class="item" effect="dark" :content="scope.row.failReason" placement="top-end" v-if="scope.row.reportState===40">
                                    <el-button type="text" size="small" style="cursor:default;color:#FF4949;" v-if="scope.row.reportState===40">上报失败</el-button>
                                </el-tooltip>
                                <el-button type="text" size="small" style="cursor:default;color:#1D8CE0;" v-if="scope.row.starting">拍照中...</el-button>
                                <el-button type="text" size="small" v-show="!scope.row.starting" @click.stop="handleTakePhoto(scope.row)">拍照</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="14">
                    <div style="width:550px;height:400px;margin-left:50px;background-size:cover;">
                        <div id="loadCaptrue" style="width:100%;height:100%;outline:1px solid #8391a5;">
                            <img :src="photosUrl" style="width:100%;height:100%;outline:1px solid #8391a5;" v-if="showImage" />
                            <object classid="clsid:454C18E2-8B7D-43C6-8C17-B1825B49D7DE" id="captrue" width="550" height="400" v-if="showCaptrue"></object>
                        </div>
                        <div style="position: absolute;right:10px;top:0;" v-if="showPaiZhao">
                            <el-button type="primary" @click="handleReView(0)">&nbsp;拍照&nbsp;</el-button>
                        </div>
                        <div style="position: absolute;right:10px;top:0;" v-if="showSave">
                            <el-button type="primary" @click="handleReView(1)">&nbsp;保存&nbsp;</el-button>
                        </div>
                        <div style="position: absolute;right:10px;top:50px;" v-if="showSave">
                            <el-button @click="handleReView(-1)">&nbsp;取消&nbsp;</el-button>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer mt20">
                <el-button @click.native="photoFormVisible = false" size="large">关闭</el-button>
            </div>
        </el-dialog>
        <!--学员头像拍照-->
        <el-dialog title="拍照" v-model="photographFormVisible" :close-on-click-modal="false" class="photograph" size="tiny" @close="dialogClose('captrue_info')" @open="dialogOpen">
            <div id="loadCaptrue" style="width:280px;height:280px;outline:1px solid #8391a5;margin-top:10px;">
                <img :src="infoPhotoUrl" style="width:100%;height:100%;outline:1px solid #8391a5;" v-if="showImageByInfo" />
                <object classid="clsid:454C18E2-8B7D-43C6-8C17-B1825B49D7DE" id="captrue_info" width="260" height="280" v-if="showCaptrueByInfo"></object>
            </div>
            <div style="height:50px;position:absolute;top:50px;right:15px;">
                <el-button type="primary" @click="onPhotograph('do')" v-if="showCaptrueByInfo">拍照</el-button>
                <el-button type="primary" @click="onPhotograph('redo')" v-else>重拍</el-button>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="photographFormVisible = false" size="large">关闭</el-button>
                <el-button type="primary" size="large" @click="savePhoto">确定</el-button>
            </div>
        </el-dialog>
        <!--选择教练-->
        <el-dialog title="选择教练" v-model="selectFormVisible" :close-on-click-modal="false" size="mini">
            <el-form label-width="85px" class="selCoach mt20 mb10">
                <el-checkbox-group v-model="bindTeacherList">
                    <el-checkbox v-for="item in coachData" :label="item.teacherId+','+item.teacherName" :value="item.teacherId">{{item.teacherName}}</el-checkbox>
                </el-checkbox-group>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="handleTeachersChecked" size="large">确定</el-button>
            </div>
        </el-dialog>
        <!--学员详情-->
        <el-dialog title="学员详情" v-model="detailsFormVisible" :close-on-click-modal="false" size="full" @close="dialogClose('detail')">
            <div class="details-header">
                <el-radio-group v-model="radioHeaderSel">
                    <el-radio-button label="基本信息"></el-radio-button>
                    <!--<el-radio-button label="电子教学日志"></el-radio-button>-->
                    <el-radio-button label="学时追踪"></el-radio-button>
                    <el-radio-button label="阶段培训记录"></el-radio-button>
                    <el-radio-button label="培训教学日志"></el-radio-button>
                    <el-radio-button label="结业管理"></el-radio-button>
                </el-radio-group>
            </div>
            <!-- 基本信息 -->
            <div class="basic" v-if="this.radioHeaderSel==='基本信息'">
                <el-form v-model="detailsForm">
                    <el-row>
                        <el-col :span="10">
                            <p class="mt15 detailForm">
                                <img v-bind:src="studentPhoto" class="photo" />
                                <span class="name">{{detailsForm.studentName}}【{{detailsForm.timerStudentInfo.uploadState===1?'已备案':detailsForm.timerStudentInfo.uploadState===2?'修改未备案':'未备案'}}】</span>
                            </p>
                        </el-col>
                        <el-col :span="14">
                            <p class="t-right">
                                <el-button type="primary" size="large" v-show="detailsForm.timerStudentInfo.useIccard=='true'" @click="()=>{showCard=true;getData(editStuForm.studentId)}">&nbsp;{{detailsForm.timerStudentInfo.makeIccard?'换卡':'绑卡'}}&nbsp;</el-button>
                                <el-button type="primary" size="large" @click="handleOpenEdit(detailsForm,'edit')">&nbsp;修改&nbsp;</el-button>
                                <el-button type="primary" size="large" @click="handleOpenEdit(detailsForm,'look')">&nbsp;照片{{detailsForm.photosCount}}&nbsp;</el-button>
                                <span v-if="!isFnCheck">
                                    <el-button type="primary" size="large" v-if="detailsForm.reportState===20" @click="handleOpenEdit(detailsForm,'audit')">&nbsp;审核&nbsp;</el-button>
                                </span>
                                <span v-else>
                                    <el-button type="primary" size="large" v-if="detailsForm.fnState===20" @click="handleOpenEdit(detailsForm,'audit')">&nbsp;审核&nbsp;</el-button>
                                </span>
                                <el-button type="primary" size="large" v-if="detailsForm.applicationformState===20" style="color:#bfcbd9;cursor:not-allowed;background-image:none;background-color:#eef1f6;border-color:#d1dbe5;">打印申请表，还需等待{{detailsForm.waitingCount}}人</el-button>
                                <el-button type="primary" size="large" @click="handleOpenEdit(detailsForm,'print')" v-if="detailsForm.applicationformState===30">打印申请表</el-button>
                                <el-tooltip class="item" effect="dark" :content="detailsForm.failReason" placement="top-end" v-if="detailsForm.applicationformState===40">
                                    <el-button type="primary" size="large" style="color:#bfcbd9;cursor:not-allowed;background-image:none;background-color:#eef1f6;border-color:#d1dbe5;">打印申请表</el-button>
                                </el-tooltip>
                            </p>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <span>统一编号：{{detailsForm.timerStudentInfo.studentUnifyCode}}</span>
                        </el-col>
                        <el-col :span="6">
                            <span>电话：{{detailsForm.phone}}</span>
                        </el-col>
                        <el-col :span="5">
                            <span>性别：{{detailsForm.genderName}}</span>
                        </el-col>
                        <el-col :span="4">
                            <span>国籍：{{detailsForm.nationality}}</span>
                        </el-col>
                        <el-col :span="3">
                            <span>车型：{{detailsForm.carTypeName}}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <span>在校状态：{{detailsForm.state===10?'在校':detailsForm.state===20?'结业':'离校'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <span>阶段：{{detailsForm.studentState===10?'报名':detailsForm.studyType===20?'科目一':detailsForm.studyType===30?'科目二':detailsForm.studyType===40?'科目三':'科目四'}}</span>
                        </el-col>
                        <el-col :span="5">
                            <span>招生人：{{detailsForm.recruitUser}}</span>
                        </el-col>
                        <el-col :span="4">
                            <span>办理人：{{detailsForm.transactor}}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <span>学习类型：{{detailsForm.studyType==='0'?'初领':detailsForm.studyType==='1'?'增领':'其它'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <span>是否跨驾培机构：{{detailsForm.isTransfer?"是":"否"}}</span>
                        </el-col>
                        <el-col :span="5">
                            <span>有预约才能学习：{{detailsForm.isAppointment?"是":"否"}}</span>
                        </el-col>
                        <el-col :span="4">
                            <span>户籍：{{detailsForm.register==='1'?"本地":"外地"}}</span>
                        </el-col>
                        <el-col :span="3" v-if="detailsForm.register===2">
                            <span>居住证号：{{detailsForm.residenceNo}}</span>
                        </el-col>
                    </el-row>
                    <el-row v-if="detailsForm.studyType===1">
                        <el-col :span="6">
                            <span>原准驾车型名称：{{detailsForm.oldCarTypeName}}</span>
                        </el-col>
                        <el-col :span="6">
                            <span>驾驶证号：{{detailsForm.drivingLicenceNo}}</span>
                        </el-col>
                        <el-col :span="4">
                            <span>驾驶证初领日期：{{detailsForm.drivingLicenceTime}}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24" class="t-right">
                            <p style="color:#9b9b9b;">
                                <span class="mr40">创建日期：{{detailsForm.gmtCreate}}</span>
                                <span>最近一次修改时间：{{detailsForm.gmtModify}}</span>
                            </p>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-card class="box-card">
                                <p>证件类型：{{detailsForm.cardTypeName}}</p>
                                <p>证件号码：{{detailsForm.cardNo}}</p>
                                <p>所属地区：{{(detailsForm.provinceName!==null?detailsForm.provinceName:'')+'&nbsp;'+(detailsForm.cityName!==null?detailsForm.cityName:'')+'&nbsp;'+(detailsForm.countyName!==null?detailsForm.countyName:'')}}
                                </p>
                                <p>联系地址：{{detailsForm.address}}</p>
                            </el-card>
                        </el-col>
                        <el-col :span="8">
                            <el-card class="box-card">
                                <p>驾校编号：{{detailsForm.schoolCode}}</p>
                                <p>驾校名称：{{detailsForm.schoolName}}</p>
                                <p>报名日期：{{new Date(detailsForm.signTime).Format("yyyy-MM-dd")}}</p>
                                <p>入校时间：{{new Date(detailsForm.enterTime).Format("yyyy-MM-dd")}}</p>
                            </el-card>
                        </el-col>
                        <el-col :span="8">
                            <el-card class="box-card">
                                <p>
                                    <span>身高：{{detailsForm.timerStudentInfo.height}}CM</span>
                                    <span>左视力：{{detailsForm.timerStudentInfo.leftVision}}</span>
                                </p>
                                <p>
                                    <span>右视力：{{detailsForm.timerStudentInfo.rightVision}}</span>
                                    <span>辨色力：{{detailsForm.timerStudentInfo.colorVision}}</span>
                                </p>
                                <p>
                                    <span>听力：{{detailsForm.timerStudentInfo.hearing}}</span>
                                    <span>左下肢：{{detailsForm.timerStudentInfo.leftLegs}}</span>
                                </p>
                                <p>
                                    <span>右下肢：{{detailsForm.timerStudentInfo.rightLegs}}</span>
                                    <span>躯干颈部：{{detailsForm.timerStudentInfo.trunkNeck}}</span>
                                </p>
                            </el-card>
                        </el-col>
                    </el-row>
                    <div v-if="detailsForm.isAppointment">
                        <p class="group-title">预约信息</p>
                        <el-row>
                            <el-col :span="4">
                                <p>
                                    <span>学费余额：{{detailsForm.appointmentStudentInfo.costBalance}}元</span>
                                </p>
                            </el-col>
                            <el-col :span="4">
                                <p>
                                    <span>科目二剩余：{{detailsForm.appointmentStudentInfo.stage2Time}}分钟</span>
                                </p>
                            </el-col>
                            <el-col :span="4">
                                <p>
                                    <span>科目二已学：{{detailsForm.appointmentStudentInfo.has2Time}}分钟</span>
                                </p>
                            </el-col>
                            <el-col :span="4">
                                <p>
                                    <span>科目三剩余：{{detailsForm.appointmentStudentInfo.stage3Time}}分钟</span>
                                </p>
                            </el-col>
                            <el-col :span="4">
                                <p>
                                    <span>科目三已学：{{detailsForm.appointmentStudentInfo.has3Time}}分钟</span>
                                </p>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12" class="authority">
                                <p class="title">
                                    <span>预约权限[预约{{detailsForm.appointmentStudentInfo.appointmentType==="10"?'扣费':'扣学时'}}]</span>
                                </p>
                                <ul>
                                    <li v-if="detailsForm.appointmentStudentInfo.forceEva">必须完成评价才能继续预约</li>
                                    <li>
                                        限制学员预约次数
                                        <p>
                                            每天最多预约 {{detailsForm.appointmentStudentInfo.dayCount===-1?'[无限制]':detailsForm.appointmentStudentInfo.dayCount+"次"}}
                                        </p>
                                        <p>
                                            每周最多预约 {{detailsForm.appointmentStudentInfo.weekCount===-1?'[无限制]':detailsForm.appointmentStudentInfo.weekCount+"次"}}
                                        </p>
                                    </li>
                                    <li v-if="detailsForm.appointmentStudentInfo.learnFirst">
                                        先学后付
                                    </li>
                                    <li>上浮价格 {{detailsForm.appointmentStudentInfo.floatingPrice}}元</li>
                                </ul>
                            </el-col>
                            <el-col :span="11" class="mt50">
                                <swiper :options="swiperOption" ref="swiper">
                                    <swiper-slide v-for="item in detailsForm.bindTeacherInfo">
                                        <p style="text-align:center;">
                                            <img :src="item.photosUrl" class="img" /> {{item.teacherName}}
                                        </p>
                                    </swiper-slide>
                                    <div class="swiper-button-prev" slot="button-prev"></div>
                                    <div class="swiper-button-next" slot="button-next"></div>
                                </swiper>
                            </el-col>
                        </el-row>
                    </div>
                </el-form>
            </div>
            <!-- 电子教学日志 -->
            <div class="electronic-teaching-log" v-if="this.radioHeaderSel==='电子教学日志'">
                <el-table :data="classRecord" class="mt20" highlight-current-row @selection-change="" @row-click="rowClick">
                    <el-table-column prop="studentName" label="学员">
                    </el-table-column>
                    <el-table-column prop="teacherName" label="教练">
                    </el-table-column>
                    <el-table-column prop="cardNo" label="教练车">
                    </el-table-column>
                    <el-table-column prop="stage" label="阶段" :formatter="formatter">
                    </el-table-column>
                    <el-table-column prop="beginTime" label="签到时间" width="155">
                    </el-table-column>
                    <el-table-column prop="endTime" label="签退时间" width="155">
                    </el-table-column>
                    <!--<el-table-column prop="acceptStudyMin" label="培训学时">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </el-table-column>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <el-table-column prop="mileage" label="培训里程">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </el-table-column>-->
                    <el-table-column prop="isUpload" label="备案状态" :formatter="formatter">
                    </el-table-column>
                </el-table>
                <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="recordListTotal">
                </el-pagination>
            </div>
            <!-- 学时追踪 -->
            <div class="time-tracking" v-if="this.radioHeaderSel==='学时追踪'">
                <el-table :data="timeTraceInfo" border class="mt20">
                    <el-table-column label="培训项目" width="108">
                        <template scope="scope">
                            <span>{{scope.row.stage}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="学习进度" width="337">
                        <template scope="scope">
                            <div class="studyProgress" v-for="item in scope.row.itemList">
                                <p>{{item.itemName}}：最低完成{{item.lowestTime}}， 已完成{{item.completeTime}}，剩余{{item.surplusTime}}</p>
                                <p>
                                    <el-progress :text-inside="true" :stroke-width="16" :percentage="item.completePercent" status="success"></el-progress>
                                </p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="考核员签字">
                        <template scope="scope">
                            <i v-bind:class="[ scope.row.approveProcess>0?'el-icon-circle-check':'el-icon-circle-cross' ]"></i>
                        </template>
                    </el-table-column>
                    <el-table-column label="学员签字">
                        <template scope="scope">
                            <i v-bind:class="[ scope.row.approveProcess>10?'el-icon-circle-check':'el-icon-circle-cross' ]"></i>
                        </template>
                    </el-table-column>
                    <el-table-column label="教练签字">
                        <template scope="scope">
                            <i v-bind:class="[ scope.row.approveProcess>20?'el-icon-circle-check':'el-icon-circle-cross' ]"></i>
                        </template>
                    </el-table-column>
                    <el-table-column label="驾校盖章">
                        <template scope="scope">
                            <i v-bind:class="[ scope.row.approveProcess>30?'el-icon-circle-check':'el-icon-circle-cross' ]"></i>
                        </template>
                    </el-table-column>
                    <el-table-column label="驾校上报">
                        <template scope="scope">
                            <i v-bind:class="[ scope.row.approveProcess>40?'el-icon-circle-check':'el-icon-circle-cross' ]"></i>
                        </template>
                    </el-table-column>
                    <el-table-column label="运管签章">
                        <template scope="scope">
                            <i v-bind:class="[ scope.row.approveProcess>50?'el-icon-circle-check':'el-icon-circle-cross' ]"></i>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 阶段培训记录 -->
            <div class="stage-training-record" v-if="this.radioHeaderSel==='阶段培训记录'">
                <el-row>
                    <el-col :span="20">
                        <p class="prompt">提示：阶段审核前需要对该学员电子教学日志进行手动审核，确保学时真实性。</p>
                    </el-col>
                    <el-col :span="4">
                        <p class="t-right">
                            <el-button type="primary" size="large">&nbsp;打印&nbsp;</el-button>
                        </p>
                    </el-col>
                    <el-col :span="24">
                        <div>
                            <!--<PDF :pdfurl="testpdfurl"></PDF>-->
                            <!--123-->
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <p class="title">阶段记录上报结果（{{stageTrainRecordTotal}}）</p>
                    <el-table :data="stageTrainRecord" highlight-current-row @selection-change="">
                        <el-table-column prop="stage" label="培训部分" :formatter="formatter">
                        </el-table-column>
                        <el-table-column prop="esignatureTime" label="上报时间">
                        </el-table-column>
                        <el-table-column prop="checkState" label="审核状态" :formatter="formatter">
                        </el-table-column>
                        <el-table-column prop="superviseEsignatureTime" label="审核时间">
                        </el-table-column>
                        <el-table-column prop="validTime" label="审核认可学时">
                        </el-table-column>
                        <el-table-column prop="needfulTime" label="补学学时">
                        </el-table-column>
                        <el-table-column prop="checkDuration" label="本次审核通过总学时" width="155">
                        </el-table-column>
                        <el-table-column prop="totalInvalidTime" label="本次审核不通过总学时" width="170">
                        </el-table-column>
                    </el-table>
                    <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="stageTrainRecordTotal">
                    </el-pagination>
                </el-row>
            </div>
            <!-- 培训教学日志 -->
            <div class="training-teaching-log" v-if="this.radioHeaderSel==='培训教学日志'">
                <el-row>
                    <el-col :span="24">
                        <el-select v-model="training_teaching_log_stage" placeholder="请选择" @change="stageChange">
                            <el-option v-for="item in stageOptions" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="24" class="mb20">
                        <h1 class="title">C1、C2/C3、C4 驾驶员培训教学日志</h1>
                        <p>标注：“（C1C2）”者－－仅作为C1、C2的教学项目</p>
                    </el-col>
                    <table v-if="training_teaching_log_stage==='1'" class="table table-bordered">
                        <tbody>
                            <tr>
                                <td colspan="6" style="width: 50%">培训机构名称：{{training_teaching_log_data.schoolName}}</td>
                                <td colspan="4">学员姓名：{{training_teaching_log_data.studentName}}</td>
                                <td colspan="2">车型：{{training_teaching_log_data.carTypeName}}</td>
                            </tr>
                            <tr class="empty-tr">
                                <td colspan="12"></td>
                            </tr>
                            <tr>
                                <td colspan="4" class="t-center tb-title" style="font-size: 18px">第一阶段 学时: 30/28</td>
                                <td colspan="8" style="height: 120px;">阶段目标：掌握道路交通法律、法规及道路交通信号的规定；培养安全礼让、文明驾驶的驾驶道德；了解机动车基本知识；了解典型道路、恶劣气象条件下的安全驾驶知识及紧急情况的应急处置知识；掌握正确的伤员急救知识；了解常见危险物品知识；掌握基础的驾驶操作要领。</td>
                            </tr>
                            <tr class="empty-tr">
                                <td colspan="12"></td>
                            </tr>
                            <tr>
                                <td colspan="12" class="t-center tb-title">理论知识 学时: 26/24</td>
                            </tr>
                            <tr>
                                <th colspan="1">序号</th>
                                <th colspan="5">教学项目</th>
                                <th colspan="6">教学项目</th>
                            </tr>
                            <tr>
                                <td colspan="1">1</td>
                                <td colspan="5">道路交通安全法律、法规和规章</td>
                                <td colspan="6">掌握《中华人民共和国道路交通安全法》及相关法规</td>
                            </tr>
                            <tr>
                                <td colspan="1">2</td>
                                <td colspan="5">道路交通信号及其含义</td>
                                <td colspan="6">掌握各种道路交通信号的含义及规定</td>
                            </tr>
                            <tr>
                                <td colspan="1">3</td>
                                <td colspan="5">机动车基本知识</td>
                                <td colspan="6">了解机动车基本知识</td>
                            </tr>
                            <tr>
                                <td colspan="1">4</td>
                                <td colspan="5">安全行车、文明驾驶知识</td>
                                <td colspan="6">掌握安全行车、文明驾驶知识，树立安全意识</td>
                            </tr>
                            <tr>
                                <td colspan="1">5</td>
                                <td colspan="5">典型道路及恶劣气象条件下的安全驾驶知识</td>
                                <td colspan="6">了解典型道路、恶劣气象条件下的安全驾驶知识</td>
                            </tr>
                            <tr>
                                <td colspan="1">6</td>
                                <td colspan="5">紧急情况的应急处置知识</td>
                                <td colspan="6">了解紧急情况的应急处置知识</td>
                            </tr>
                            <tr>
                                <td colspan="1">7</td>
                                <td colspan="5">伤员自救、急救及常见危险品知识</td>
                                <td colspan="6">掌握正确的伤员急救知识，了解常见危险物品知识</td>
                            </tr>
                            <tr class="empty-tr">
                                <td colspan="12"></td>
                            </tr>
                            <tr>
                                <td colspan="12" class="t-center tb-title">理论知识 学习明细</td>
                            </tr>
                            <tr>
                                <th colspan="2">开始时间</th>
                                <th colspan="2">结束时间</th>
                                <th colspan="2">学习时间</th>
                                <th colspan="2">教练员</th>
                                <th colspan="2">教学车辆</th>
                                <th colspan="2">教学项目</th>
                            </tr>
                            <tr v-for="item in training_teaching_log_data.theoryTeachLogList">
                                <td>{{item.beginTime}}</td>
                                <td>{{item.endTime}}</td>
                                <td>{{item.acceptStudyMin}}</td>
                                <td>{{item.teacherName}}</td>
                                <td>{{item.cardNo}}</td>
                                <td>{{item.trainingItemName}}</td>
                            </tr>
                            <tr class="empty-tr">
                                <td colspan="12"></td>
                            </tr>
                            <tr class="td-textarea">
                                <td colspan="12">第一阶段考核意见：{{training_teaching_log_data.checkStateName}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table v-if="training_teaching_log_stage==='2'" class="table table-bordered">
                        <tbody>
                            <tr>
                                <td colspan="6" style="width: 50%">培训机构名称：{{training_teaching_log_data.schoolName}}</td>
                                <td colspan="4">学员姓名：{{training_teaching_log_data.studentName}}</td>
                                <td colspan="2">车型：{{training_teaching_log_data.carTypeName}}</td>
                            </tr>
                            <tr class="empty-tr">
                                <td colspan="12"></td>
                            </tr>
                            <tr>
                                <td colspan="4" class="t-center tb-title" style="font-size: 18px">第二阶段 学时: 28/14</td>
                                <td colspan="8" style="height: 120px;">阶段目标：掌握车辆使用的相关知识；熟练掌握场地和场内道路驾驶的基本要领和方法，准确地控制车辆的行驶位置、速度和路线。</td>
                            </tr>
                            <tr class="empty-tr">
                                <td colspan="12"></td>
                            </tr>
                            <tr>
                                <td colspan="12" class="t-center tb-title">理论知识 学时: 1/1</td>
                            </tr>
                            <tr>
                                <th colspan="1">序号</th>
                                <th colspan="5">教学项目</th>
                                <th colspan="6">教学项目</th>
                            </tr>
                            <tr>
                                <td colspan="1">1</td>
                                <td colspan="5">本阶段操作常识</td>
                                <td colspan="6">掌握本阶段的操作内容和要求</td>
                            </tr>
                            <tr class="empty-tr">
                                <td colspan="12"></td>
                            </tr>
                            <tr>
                                <td colspan="12" class="t-center tb-title">理论知识 学习明细</td>
                            </tr>
                            <tr>
                                <th colspan="2">开始时间</th>
                                <th colspan="2">结束时间</th>
                                <th colspan="2">学习时间</th>
                                <th colspan="2">教练员</th>
                                <th colspan="2">教学车辆</th>
                                <th colspan="2">教学项目</th>
                            </tr>
                            <tr v-for="item in training_teaching_log_data.theoryTeachLogList">
                                <td colspan="2">{{item.beginTime}}</td>
                                <td colspan="2">{{item.endTime}}</td>
                                <td colspan="2">{{item.acceptStudyMin}}</td>
                                <td colspan="2">{{item.teacherName}}</td>
                                <td colspan="2">{{item.cardNo}}</td>
                                <td colspan="2">{{item.trainingItemName}}</td>
                            </tr>
                            <tr class="empty-tr">
                                <td colspan="12"></td>
                            </tr>
                            <tr>
                                <td colspan="12" class="t-center tb-title">实际操作 学时: 27/13</td>
                            </tr>
                            <tr>
                                <th colspan="1">序号</th>
                                <th colspan="5">教学项目</th>
                                <th colspan="6">教学项目</th>
                            </tr>
                            <tr>
                                <td colspan="1">1</td>
                                <td colspan="5">上车准备与起步</td>
                                <td colspan="6">掌握上车前的注意事项及安全起步的方法</td>
                            </tr>
                            <tr>
                                <td colspan="1">2</td>
                                <td colspan="5">变速、停车、倒车</td>
                                <td colspan="6">熟练掌握加速、减速行驶和停车、倒车的操作要领</td>
                            </tr>
                            <tr>
                                <td colspan="1">3</td>
                                <td colspan="5">行驶位置和路线</td>
                                <td colspan="6">能够保持正确的行驶位置和行驶路线</td>
                            </tr>
                            <tr>
                                <td colspan="1">4</td>
                                <td colspan="5">场地驾驶</td>
                                <td colspan="6">熟练掌握操控车辆进行移位、前进、倒车及判断车轨迹的技能</td>
                            </tr>
                            <tr>
                                <td colspan="1">5</td>
                                <td colspan="5">场内道路驾驶</td>
                                <td colspan="6">掌握坡道定点停车和起步、侧方停车、通过单边桥、曲线行驶、直角转弯、限速通过限宽门、通过连续障碍、百米加减档、起伏路驾驶的方法</td>
                            </tr>
                            <tr>
                                <td colspan="1">6</td>
                                <td colspan="5">综合驾驶及考核</td>
                                <td colspan="6">能够综合运用本阶段所学内容，在场内安全熟练地驾驶车辆</td>
                            </tr>
                            <tr class="empty-tr">
                                <td colspan="12"></td>
                            </tr>
                            <tr>
                                <td colspan="12" class="t-center tb-title">实际操作 学习明细</td>
                            </tr>
                            <tr>
                                <th colspan="2">开始时间</th>
                                <th colspan="2">结束时间</th>
                                <th colspan="1">学习时间</th>
                                <th colspan="2">教练员</th>
                                <th colspan="2">教学车辆</th>
                                <th colspan="1">教学项目</th>
                                <th colspan="1">行驶里程(km)</th>
                                <th colspan="1">最高时速(km/h)</th>
                            </tr>
                            <tr v-for="item in training_teaching_log_data.vehicleTeachLogList">
                                <td colspan="2">{{item.beginTime}}</td>
                                <td colspan="2">{{item.endTime}}</td>
                                <td colspan="1">{{item.acceptStudyMin}}</td>
                                <td colspan="2">{{item.teacherName}}</td>
                                <td colspan="2">{{item.cardNo}}</td>
                                <td colspan="1">{{item.trainingItemName}}</td>
                                <td colspan="1">{{item.mileage}}</td>
                                <td colspan="1">{{item.maxSpeed}}</td>
                            </tr>
                            <tr class="empty-tr">
                                <td colspan="12"></td>
                            </tr>
                            <tr class="td-textarea">
                                <td colspan="12">第二阶段考核意见：{{training_teaching_log_data.checkStateName}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table v-if="training_teaching_log_stage==='3'" class="table table-bordered">
                        <tbody>
                            <tr>
                                <td colspan="6" style="width: 50%">培训机构名称：{{training_teaching_log_data.schoolName}}</td>
                                <td colspan="4">学员姓名：{{training_teaching_log_data.studentName}}</td>
                                <td colspan="2">车型：{{training_teaching_log_data.carTypeName}}</td>
                            </tr>
                            <tr class="empty-tr">
                                <td colspan="12"></td>
                            </tr>
                            <tr>
                                <td colspan="4" class="t-center tb-title" style="font-size: 18px">第三阶段 学时: 20/12</td>
                                <td colspan="8" style="height: 120px;">阶段目标：掌握车辆通行的规则；了解行人、非机动车的动态特点及险情的预测和分析方法；熟练掌握一般道路和夜间驾驶方法，能够根据不同的道路交通状况安全驾驶；培养预见性的安全驾驶意识。</td>
                            </tr>
                            <tr class="empty-tr">
                                <td colspan="12"></td>
                            </tr>
                            <tr>
                                <td colspan="12" class="t-center tb-title">理论知识 学时: 2/2</td>
                            </tr>
                            <tr>
                                <th colspan="1">序号</th>
                                <th colspan="5">教学项目</th>
                                <th colspan="6">教学项目</th>
                            </tr>
                            <tr>
                                <td colspan="1">1</td>
                                <td colspan="5">保护行人和非机动车的安全</td>
                                <td colspan="6">了解行人（尤其儿童）和非机动车的动态特点，保护行人（尤其儿童）和非机动车的安全</td>
                            </tr>
                            <tr>
                                <td colspan="1">2</td>
                                <td colspan="5">优先通行权和礼让</td>
                                <td colspan="6">掌握车辆通行的规则，培养安全礼让的意识</td>
                            </tr>
                            <tr>
                                <td colspan="1">3</td>
                                <td colspan="5">险情的预测和分析</td>
                                <td colspan="6">了解各种交通状况下可能出现的险情</td>
                            </tr>
                            <tr>
                                <td colspan="1">4</td>
                                <td colspan="5">阶段操作常识</td>
                                <td colspan="6">掌握道路驾驶的内容和要求</td>
                            </tr>
                            <tr class="empty-tr">
                                <td colspan="12"></td>
                            </tr>
                            <tr>
                                <td colspan="12" class="t-center tb-title">理论知识 学习明细</td>
                            </tr>
                            <tr>
                                <th colspan="2">开始时间</th>
                                <th colspan="2">结束时间</th>
                                <th colspan="2">学习时间</th>
                                <th colspan="2">教练员</th>
                                <th colspan="2">教学车辆</th>
                                <th colspan="2">教学项目</th>
                            </tr>
                            <tr v-for="item in training_teaching_log_data.theoryTeachLogList">
                                <td colspan="2">{{item.beginTime}}</td>
                                <td colspan="2">{{item.endTime}}</td>
                                <td colspan="2">{{item.acceptStudyMin}}</td>
                                <td colspan="2">{{item.teacherName}}</td>
                                <td colspan="2">{{item.cardNo}}</td>
                                <td colspan="2">{{item.trainingItemName}}</td>
                            </tr>
                            <tr class="empty-tr">
                                <td colspan="12"></td>
                            </tr>
                            <tr>
                                <td colspan="12" class="t-center tb-title">实际操作 学时: 18/10</td>
                            </tr>
                            <tr>
                                <th colspan="1">序号</th>
                                <th colspan="5">教学项目</th>
                                <th colspan="6">教学项目</th>
                            </tr>
                            <tr>
                                <td colspan="1">1</td>
                                <td colspan="5">直线行驶</td>
                                <td colspan="6">针对道路和交通状况，掌握直线行驶的方法，并保持安全跟车距离</td>
                            </tr>
                            <tr>
                                <td colspan="1">2</td>
                                <td colspan="5">变更车道</td>
                                <td colspan="6">掌握变更车道的操作要领和方法</td>
                            </tr>
                            <tr>
                                <td colspan="1">3</td>
                                <td colspan="5">通过路口</td>
                                <td colspan="6">能够根据道路交通状况，以安全的速度和方法通过路口</td>
                            </tr>
                            <tr>
                                <td colspan="1">4</td>
                                <td colspan="5">会车、超车、让超车</td>
                                <td colspan="6">在道路上安全、规范地进行会车、超车、让超车</td>
                            </tr>
                            <tr>
                                <td colspan="1">5</td>
                                <td colspan="5">靠边停车</td>
                                <td colspan="6">掌握靠边停车的方法，能按要求在路边安全停车；能够选择合理的路线和速度，将车倒入预定位置</td>
                            </tr>
                            <tr>
                                <td colspan="1">6</td>
                                <td colspan="5">掉头</td>
                                <td colspan="6">掌握安全、规范的掉头方法</td>
                            </tr>
                            <tr>
                                <td colspan="1">7</td>
                                <td colspan="5">速度感知C1C2</td>
                                <td colspan="6">在限定的速度内，体验较高速度下驾驶车辆的感知</td>
                            </tr>
                            <tr>
                                <td colspan="1">8</td>
                                <td colspan="5">预见性驾驶</td>
                                <td colspan="6">掌握通过学校、人行横道、公共汽车站、弯道及其他视线不良等交通状况下的预见性驾驶方法</td>
                            </tr>
                            <tr>
                                <td colspan="1">9</td>
                                <td colspan="5">夜间驾驶</td>
                                <td colspan="6">掌握夜间驾驶的规律，正确变换灯光和使用信号装置，能够在夜间道路安全行车</td>
                            </tr>
                            <tr>
                                <td colspan="1">10</td>
                                <td colspan="5">综合驾驶及考核</td>
                                <td colspan="6">能够综合运用本阶段所学内容，在一般道路上安全熟练地驾驶车辆</td>
                            </tr>
                            <tr class="empty-tr">
                                <td colspan="12"></td>
                            </tr>
                            <tr>
                                <td colspan="12" class="t-center tb-title">实际操作 学习明细</td>
                            </tr>
                            <tr>
                                <th colspan="2">开始时间</th>
                                <th colspan="2">结束时间</th>
                                <th colspan="1">学习时间</th>
                                <th colspan="2">教练员</th>
                                <th colspan="2">教学车辆</th>
                                <th colspan="1">教学项目</th>
                                <th colspan="1">行驶里程(km)</th>
                                <th colspan="1">最高时速(km/h)</th>
                            </tr>
                            <tr v-for="item in training_teaching_log_data.vehicleTeachLogList">
                                <td colspan="2">{{item.beginTime}}</td>
                                <td colspan="2">{{item.endTime}}</td>
                                <td colspan="1">{{item.acceptStudyMin}}</td>
                                <td colspan="2">{{item.teacherName}}</td>
                                <td colspan="2">{{item.cardNo}}</td>
                                <td colspan="1">{{item.trainingItemName}}</td>
                                <td colspan="1">{{item.mileage}}</td>
                                <td colspan="1">{{item.maxSpeed}}</td>
                            </tr>
                            <tr class="empty-tr">
                                <td colspan="12"></td>
                            </tr>
                            <tr class="td-textarea">
                                <td colspan="12">第三阶段考核意见：{{training_teaching_log_data.checkStateName}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table v-if="training_teaching_log_stage==='4'" class="table table-bordered">
                        <tbody>
                            <tr>
                                <td colspan="6" style="width: 50%">培训机构名称：{{training_teaching_log_data.schoolName}}</td>
                                <td colspan="4">学员姓名：{{training_teaching_log_data.studentName}}</td>
                                <td colspan="2">车型：{{training_teaching_log_data.carTypeName}}</td>
                            </tr>
                            <tr class="empty-tr">
                                <td colspan="12"></td>
                            </tr>
                            <tr>
                                <td colspan="4" class="t-center tb-title" style="font-size: 18px">第四阶段 学时: 8/6</td>
                                <td colspan="8" style="height: 120px;">阶段目标： 了解常见道路交通事故的原因及预防措施；了解车辆常见故障的处置方法；了解各种特殊道路交通环境下的安全行车方法；培养驾驶应变能力；能够独立驾驶车辆。</td>
                            </tr>
                            <tr class="empty-tr">
                                <td colspan="12"></td>
                            </tr>
                            <tr>
                                <td colspan="12" class="t-center tb-title">理论知识 学时: 2/2</td>
                            </tr>
                            <tr>
                                <th colspan="1">序号</th>
                                <th colspan="5">教学项目</th>
                                <th colspan="6">教学项目</th>
                            </tr>
                            <tr>
                                <td colspan="1">1</td>
                                <td colspan="5">道路交通事故的预防</td>
                                <td colspan="6">了解常见交通事故的发生原因，牢固树立安全意识，掌握预防事故的相关知识</td>
                            </tr>
                            <tr>
                                <td colspan="1">2</td>
                                <td colspan="5">阶段操作常识</td>
                                <td colspan="6">掌握复杂道路驾驶的内容和要求</td>
                            </tr>
                            <tr>
                                <td colspan="1">3</td>
                                <td colspan="5">车辆常见故障处置</td>
                                <td colspan="6">熟悉常见故障的特点和处置方法</td>
                            </tr>
                            <tr class="empty-tr">
                                <td colspan="12"></td>
                            </tr>
                            <tr>
                                <td colspan="12" class="t-center tb-title">理论知识 学习明细</td>
                            </tr>
                            <tr>
                                <th colspan="2">开始时间</th>
                                <th colspan="2">结束时间</th>
                                <th colspan="2">学习时间</th>
                                <th colspan="2">教练员</th>
                                <th colspan="2">教学车辆</th>
                                <th colspan="2">教学项目</th>
                            </tr>
                            <tr v-for="item in training_teaching_log_data.theoryTeachLogList">
                                <td colspan="2">{{item.beginTime}}</td>
                                <td colspan="2">{{item.endTime}}</td>
                                <td colspan="2">{{item.acceptStudyMin}}</td>
                                <td colspan="2">{{item.teacherName}}</td>
                                <td colspan="2">{{item.cardNo}}</td>
                                <td colspan="2">{{item.trainingItemName}}</td>
                            </tr>
                            <tr class="empty-tr">
                                <td colspan="12"></td>
                            </tr>
                            <tr class="td-textarea">
                                <td colspan="12">第四阶段考核意见：{{training_teaching_log_data.checkStateName}}</td>
                            </tr>
                        </tbody>
                    </table>
                </el-row>
            </div>
            <!-- 结业管理 -->
            <div class="graduation-management" v-if="this.radioHeaderSel==='结业管理'">
                <el-row>
                    <el-col :span="19">&nbsp;</el-col>
                    <el-col :span="5">
                        <p class="t-right">
                            <el-button type="primary" size="large" @click="createNew('sign')" v-if="graduation_management_data.state===10">&nbsp;结业考核&nbsp;</el-button>
                            <el-button type="primary" size="large" @click="createNew('record')" v-if="graduation_management_data.state===20&&!graduation_management_data.isUpload">&nbsp;结业备案&nbsp;</el-button>
                            <el-button type="primary" size="large" @click="" v-if="graduation_management_data.isUpload">&nbsp;打印&nbsp;</el-button>
                        </p>
                    </el-col>
                    <el-col :span="24">
                        <h1 class="title">机动车驾驶员培训结业证书</h1>
                    </el-col>
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td colspan="6" style="width: 50%">学员姓名：{{graduation_management_data.studentName}}</td>
                                <td colspan="4">状态：{{formatData(graduation_management_data.state,'graduateState')}}</td>
                                <td colspan="2">备案状态：{{formatData(graduation_management_data.isUpload,'isUpload')}}</td>
                            </tr>
                        </tbody>
                    </table>
                </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="detailsFormVisible = false" size="large">取消</el-button>
            </div>
            <object id="ocx" classid="CLSID:4E194A99-7F41-453E-914C-544BB186A59C" codebase="../../assets/cab/signocx.cab#version=1.0.0.3" width="100" height="50" class="hide"></object>
        </el-dialog>
        <!--电子教学日志详情-->
        <el-dialog title="电子教学日志详情" v-model="classRecordDetailsFormVisible" :close-on-click-modal="false" size="full">
            <el-col :span="7" class="classRecordDetails ">
                <el-row class="mt20">
                    <div class="mb15 pl10" style="font-size:1.2em;color:#333;">电子教学日志编号：00009</div>
                </el-row>
                <el-row class="info">
                    <div class="left-img">
                        <img src="https://www.baidu.com/img/baidu_jgylogo3.gif" />
                    </div>
                    <div class="right-content">
                        <p>学员：张三</p>
                        <p>教练：李四</p>
                        <p>培训部分：科目三</p>
                        <p>车牌号：川A12345</p>
                        <p>培训里程：50</p>
                        <p>课程方式：暂无</p>
                    </div>
                </el-row>
                <el-row class="mt20">
                    <p>培训时段：2017-05-15 10:55:33 - 11:05:33</p>
                    <p>预约时段：10分钟</p>
                    <p>本次培训时长：10分钟</p>
                    <p>有效学时：55分钟</p>
                    <p>无效学时：0分钟</p>
                </el-row>
                <el-row class="mt20 part">
                    <div>
                        <p>第一部分</p>
                        <el-progress :text-inside="true" :stroke-width="18" :percentage="70"></el-progress>
                    </div>
                    <div>
                        <p>第二部分</p>
                        <el-progress :text-inside="true" :stroke-width="18" :percentage="70"></el-progress>
                    </div>
                    <div>
                        <p>第三部分</p>
                        <el-progress :text-inside="true" :stroke-width="18" :percentage="70"></el-progress>
                    </div>
                    <div>
                        <p>第四部分</p>
                        <el-progress :text-inside="true" :stroke-width="18" :percentage="70"></el-progress>
                    </div>
                </el-row>
                <el-row class="mt20 bottom-speed">
                    <div>
                        <p>最高时速</p>
                        <p>哈哈</p>
                    </div>
                    <div>
                        <p>最低时速</p>
                        <p>哈哈</p>
                    </div>
                    <div>
                        <p>平均时速</p>
                        <p>哈哈</p>
                    </div>
                </el-row>
            </el-col>
            <el-col :span="17" class="mt20">
                <div style="height:390px;border: 1px solid #eee;" class="ml15" id="map">
                    Map
                </div>
                <div class="ml15 mt20">
                    <el-table :data="students" height="250">
                        <el-table-column prop="studentName" label="记录时间">
                        </el-table-column>
                        <el-table-column prop="phone" label="最大速度">
                        </el-table-column>
                        <el-table-column prop="carTypeName" label="行驶记录速度">
                        </el-table-column>
                        <el-table-column prop="schoolName" label="发动机转速">
                        </el-table-column>
                        <el-table-column prop="trainTypeName" label="行驶里程">
                        </el-table-column>
                        <el-table-column prop="appointmentCount" label="记录状态">
                        </el-table-column>
                        <el-table-column prop="stage2Progress" label="审核结果">
                        </el-table-column>
                        <el-table-column prop="stage3Progress" label="初审原因">
                        </el-table-column>
                        <el-table-column prop="uploadState" label="审核原因" :formatter="formatter">
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
            <el-col :span="24">
                <p class="group-title">照片信息</p>
    
            </el-col>
        </el-dialog>
        <!--学员制卡弹窗-->
        <el-dialog title="学员制卡" v-model="showCard" :show-close="false" :close-on-click-modal="false">
            <el-form ref="makeCard" :rules="ruleForms" :model="ruleForm" :inline="true" label-width="100px">
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
                    <el-input auto-complete="off" placeholder="请输入学员卡卡号" v-model="ruleForm.cardNo" style="width:400px;"></el-input>
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
                <el-form-item label="车型" class="normal">
                    <el-select :disabled="ruleForm.carType!=''" v-model="ruleForm.carType" placeholder="请选择培训车型">
                        <el-option v-for="item in carTypeOptions" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="第一指纹" prop="fingerMB1">
                    <el-input :disabled="true" auto-complete="off" v-model="ruleForm.fingerMB1" style="width:400px;"></el-input>
                </el-form-item>
                <el-form-item label="第二指纹" prop="fingerMB2">
                    <el-input :disabled="true" auto-complete="off" v-model="ruleForm.fingerMB2" style="width:400px;"></el-input>
                </el-form-item>
                <!--特殊卡指纹待定-->
                <el-form-item label="特殊卡指纹" prop="noFinger">
                    <el-switch :disabled="true" on-text="" off-text="" v-model="ruleForm.noFinger"></el-switch>
                </el-form-item>
                <el-form-item style="float:right;margin-right:44px;">
                    <el-button type="primary" @click="XykSetInfo('ruleForm')" :loading="btnLoading">立即创建</el-button>
                    <el-button @click="cancelMake">取消</el-button>
                </el-form-item>
            </el-form>
            <object id="myobj" classid="clsid:93201C87-E8B2-4B20-A61A-6D4DFBD2D140" class="hide" /></object>
        </el-dialog>
    </section>
</template>

<script>
var map;
//拍摄身份证次数，1代表已拍正面，2代表已拍反面
var idCardPhotographCount = 0;
import $ from "jquery";
import { request } from "../../api/api";
import PCA from "../../components/common/pca.vue";
import VTYPE from "../../components/common/vtype.vue";
import { global } from "../../assets/javascript/global";
// import Pdfjs from "pdfjs"
// import PDF from "../../components/common/pdf.vue"
export default {
    data() {
        return {
            showCard: false,
            bindTeacherList: [],
            bindTeacherInfo: [],
            bindTeacherInfo1: [],
            appointmentDisabled: true,
            thisShow: false,
            studentPhoto: "",
            curPaiZhaoData: {
                studentId: "",
                schoolCode: "",
                photosUrl: "",
                photosType: 0
            },
            showCaptrue: true,
            showImage: false,
            showPaiZhao: false,
            showSave: false,
            showCaptrueByInfo: true,
            showImageByInfo: false,
            infoPhotoUrl: "",
            reportStudents: {
                isFnCheck: JSON.parse(sessionStorage.getItem("user")).isFnCheck,
                studentIdList: []
            },
            recordStudents: {
                studentIdList: []
            },
            image: "",
            isCam: false,
            total: 0,
            recordListTotal: 0,
            stageTrainRecordTotal: 0,
            pageSize: global.pageSize,
            parentSchoolCode: JSON.parse(sessionStorage.getItem("user")).parentSchoolCode,
            schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
            testpdfurl: "//cdn.mozilla.net/pdfjs/tracemonkey.pdf",
            stageOptions: global.options.stage,
            carTypeOptions: [],
            registProvinceData: [],
            registCityData: [],
            registCountyData: [],
            departmentData: [],
            branchSchoolData: [],
            coachData: [],
            filters: {
                reservation: {
                    data: [],
                    page: 1,
                    stage: "2",
                    keyword: "",
                    pageSize: 4,
                    selected: [],
                    studentId: 0,
                    schoolCode: "",
                    loading: false,
                    loadMore: false,
                    emptyVisible: false,
                    date: new Date().Format("yyyy-MM-dd")
                },
                keyWord: "",
                curCarType: "0",
                curStuType: "1",
                isAppointment: ""
            },
            training_teaching_log_stage: "1",
            training_teaching_log_data: {
            },
            graduation_management_data: {
            },
            selected: "",
            students: [],
            classRecord: [],
            timeTraceInfo: [],
            stageTrainRecord: [],
            page: 1,
            classRecordPage: 1,
            stageTrainRecordPage: 1,
            pageLoading: false,
            addStuFormVisible: false,//新增界面是否显示
            selectedUnitOptions: [],
            brachSchool: "",
            addStuForm: {
                schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                studentName: "",
                gender: "1",
                parentSchoolCode: JSON.parse(sessionStorage.getItem("user")).parentSchoolCode,
                cardType: "1",
                cardNo: "",
                phone: "",
                signTime: "",
                address: "",
                studyType: "0",
                province: "",
                city: "",
                county: "",
                enterTime: "",
                recruitUser: "",
                transactor: JSON.parse(sessionStorage.getItem("user")).userName,
                carType: "",
                drivingLicenceTime: "",
                oldCarType: "",
                drivingLicenceNo: "",
                nationality: "中国",
                signMoney: "",
                qq: "",
                register: "2",
                deptId: [],
                isAppointment: false,
                isFnCheck: JSON.parse(sessionStorage.getItem("user")).isFnCheck === 0 ? false : true,
                birthday: "",
                effectiveDate: "",
                email: "",
                postalcode: "",
                registProvince: "",
                registCity: "",
                registCounty: "",
                registAddress: "",
                photosUrl: "",
                appointmentStudentInfo: {
                    appointmentType: "20",
                    costBalance: "",
                    stage2Time: "",
                    stage3Time: "",
                    dayCount: -1,
                    weekCount: -1,
                    isLearnFirst: false,
                    forceEva: false,
                    floatingPrice: 0
                },
                timerStudentInfo: {
                    photosUrl: "",
                    photosId: 0,
                    proPhotosId: 0,
                    height: "170",
                    leftVision: "5.0",
                    faceId: 0,
                    faceppId: "",
                    rightVision: "5.0",
                    colorVision: "正常",
                    hearing: "正常",
                    leftLegs: "正常",
                    rightLegs: "正常",
                    trunkNeck: "正常",
                    residenceNo: "",
                    isTransfer: false,
                    useIccard: "false"
                },
                bindTeacherInfo: []
            },
            ruleForms:{
                cardNo: [
                    { required: true, message: "请选择证件类型并填写证件号码", trigger: "blur" }
                ],
            },
            stuFormRules: {
                studentName: [
                    { required: true, message: "请填写学员姓名", trigger: "blur" }
                ],
                gender: [
                    { required: true, message: "请选择学员性别", trigger: "change" }
                ],
                cardNo: [
                    { required: true, message: "请选择证件类型并填写证件号码", trigger: "blur" }
                ],
                phone: [
                    { required: true, message: "请填写学员电话号码", trigger: "change" }
                ],
                signTime: [
                    { type: "date", required: true, message: "请选择学员报名时间", trigger: "change" }
                ],
                enterTime: [
                    { type: "date", required: true, message: "请选择学员入校时间", trigger: "change" }
                ],
                carType: [
                    { type: "number", required: true, message: "请选择车型", trigger: "change" }
                ],
                studyType: [
                    { required: true, message: "请选择学习类型", trigger: "change" }
                ],
                nationality: [
                    { required: true, message: "请选择国籍", trigger: "change" }
                ],
                deptId: [
                    { required: true, message: "请选择所属单位", trigger: "change" }
                ],
                isTransfer: [
                    { required: true, message: "请选择是否跨校", trigger: "change" }
                ],
                registAddress: [
                    { required: true, message: "请填写登记住所地址", trigger: "blur" }
                ],
                birthday: [
                    { type: "date", required: true, message: "请选择学员出生日期", trigger: "change" }
                ],
                effectiveDate: [
                    { type: "date", required: true, message: "请选择学员身份证有效期", trigger: "change" }
                ],
                email: [
                    { required: true, message: "请填写邮箱号码", trigger: "blur" }
                ],
                register: [
                    { required: true, message: "请选择户籍", trigger: "change" }
                ],
                "timerStudentInfo.residenceNo": [
                    { required: true, message: "请填写居住证号", trigger: "blur" }
                ],
                drivingLicenceTime: [
                    { type: "date", required: true, message: "请选择初领日期", trigger: "change" }
                ],
                oldCarType: [
                    { type: "number", required: true, message: "请选择原准驾车型", trigger: "change" }
                ],
                drivingLicenceNo: [
                    { required: true, message: "请填写驾驶证号", trigger: "blur" }
                ],
                postalcode: [
                    { required: true, message: "请填写联系邮政编码", trigger: "blur" }
                ],
                address: [
                    { required: true, message: "请填写联系住所地址", trigger: "blur" }
                ]
                // brachSchool: [
                //     { required: true, message: "请选择分校", trigger: "change" }
                // ]
            },
            detailsForm: {
                studentId: "",
                schoolCode: "",
                studentName: "",
                gender: "",
                parentSchoolCode: "",
                cardType: "",
                cardNo: "",
                phone: "",
                signTime: "",
                address: "",
                studyType: "",
                province: "",
                city: "",
                county: "",
                enterTime: "",
                recruitUser: "",
                transactor: "",
                carType: "",
                drivingLicenceTime: "",
                oldCarType: "",
                drivingLicenceNo: "",
                nationality: "",
                signMoney: "",
                qq: "",
                register: "",
                deptId: "",
                isAppointment: false,
                isFnCheck: JSON.parse(sessionStorage.getItem("user")).isFnCheck === 0 ? false : true,
                birthday: "",
                effectiveDate: "",
                email: "",
                postalcode: "",
                registProvince: "",
                registCity: "",
                registCounty: "",
                registAddress: "",
                appointmentStudentInfo: {
                    appointmentType: "",
                    costBalance: "0",
                    stage2Time: 0,
                    stage3Time: 0,
                    dayCount: -1,
                    weekCount: -1,
                    isLearnFirst: false,
                    forceEva: false,
                    floatingPrice: 0
                },
                timerStudentInfo: {
                    photosUrl: "",
                    photosId: 0,
                    proPhotosId: 0,
                    height: "",
                    leftVision: "",
                    faceId: 0,
                    faceppId: "",
                    rightVision: "",
                    colorVision: "",
                    hearing: "",
                    leftLegs: "",
                    rightLegs: "",
                    trunkNeck: "",
                    residenceNo: "",
                    isTransfer: false,
                    uploadState: 0,
                    useIccard: "false"
                },
                bindTeacherInfo: [],
                photosCount: "",
                waitingCount: -1,
                failReason: ""
            },
            detailsFormVisible: false,
            editStuFormVisible: false,
            editStuForm: {
                studentId: "",
                schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                studentName: "",
                gender: "1",
                parentSchoolCode: JSON.parse(sessionStorage.getItem("user")).parentSchoolCode,
                cardType: "1",
                cardNo: "",
                phone: "",
                signTime: "",
                address: "",
                studyType: "0",
                province: "",
                city: "",
                county: "",
                enterTime: "",
                recruitUser: "",
                transactor: JSON.parse(sessionStorage.getItem("user")).userName,
                carType: "",
                drivingLicenceTime: "",
                oldCarType: "",
                drivingLicenceNo: "",
                nationality: "中国",
                signMoney: "",
                qq: "",
                register: "1",
                deptId: "",
                isAppointment: false,
                isFnCheck: JSON.parse(sessionStorage.getItem("user")).isFnCheck === 0 ? false : true,
                birthday: "",
                effectiveDate: "",
                email: "",
                postalcode: "",
                registProvince: "",
                registCity: "",
                registCounty: "",
                registAddress: "",
                photosUrl: "",
                appointmentStudentInfo: {
                    appointmentType: "10",
                    costBalance: "",
                    stage2Time: "",
                    stage3Time: "",
                    dayCount: -1,
                    weekCount: -1,
                    isLearnFirst: false,
                    forceEva: false,
                    floatingPrice: 0
                },
                timerStudentInfo: {
                    photosUrl: "",
                    photosId: 0,
                    proPhotosId: 0,
                    height: "",
                    leftVision: "",
                    faceId: 0,
                    faceppId: "",
                    rightVision: "",
                    colorVision: "正常",
                    hearing: "正常",
                    leftLegs: "正常",
                    rightLegs: "正常",
                    trunkNeck: "正常",
                    residenceNo: "",
                    isTransfer: false,
                    useIccard: "false"
                },
                bindTeacherInfo: []
            },
            photoFormVisible: false,
            appointmentsLimit: false,
            learnFirst: false,
            radioChecked: true,
            rechargeDisabled: false,
            radioHeaderSel: "基本信息",
            selectFormVisible: false,
            swiperOption: {
                autoplay: 1000000,
                slidesPerView: 5,
                autoHeight: true,
                prevButton: ".swiper-button-prev",
                nextButton: ".swiper-button-next",
                mousewheelControl: true,
                preventClicks: false,
                observeParents: true,
                loop: false
            },
            // appointmentSwiperOption: {
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
            //         this.filters.reservation.date = list[$index].date;
            //         this.handleQueryAfterResetData();
            //     }
            // },
            photographFormVisible: false,
            photosUrl: "",
            photoObject: [],
            classRecordDetailsFormVisible: false,
            btnLoading: false,
            curRowPhotos: "",
            dateList: [],
            appointmentCoachFormVisible: false,
            isFnCheck: JSON.parse(sessionStorage.getItem("user")).isFnCheck === 0 ? false : true,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            ruleForm: {
                studentName: '',
                IdCardNo: '',
                schNo: '',
                cardNo: '',
                stdNo: '',
                noFinger: false,
                fingerMB1: '',
                fingerMB2: '',
                thHour: '',
                opHour: '',
                hadRunMile: '',
                hadSubMinute: '',
                carType: ''
            },
            decline_timer: 5
        }
    },
    methods: {
        handleShowNewWin() {
            this.addStuFormVisible = true;
            this.addStuForm = {
                schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
                studentName: "",
                gender: "1",
                parentSchoolCode: JSON.parse(sessionStorage.getItem("user")).parentSchoolCode,
                cardType: "1",
                cardNo: "",
                phone: "",
                signTime: new Date(),
                address: "",
                studyType: "0",
                province: "510000",
                city: "510100",
                county: "510101",
                enterTime: new Date(),
                recruitUser: "",
                transactor: JSON.parse(sessionStorage.getItem("user")).userName,
                carType: "",
                drivingLicenceTime: "",
                oldCarType: "",
                drivingLicenceNo: "",
                nationality: "中国",
                signMoney: "",
                qq: "",
                register: "2",
                deptId: [],
                isAppointment: false,
                isFnCheck: JSON.parse(sessionStorage.getItem("user")).isFnCheck === 0 ? false : true,
                birthday: "",
                effectiveDate: "",
                email: "",
                postalcode: "",
                registProvince: "",
                registCity: "",
                registCounty: "",
                registAddress: "",
                appointmentStudentInfo: {
                    appointmentType: "20",
                    costBalance: "",
                    stage2Time: "",
                    stage3Time: "",
                    dayCount: -1,
                    weekCount: -1,
                    isLearnFirst: false,
                    forceEva: false,
                    floatingPrice: 0
                },
                timerStudentInfo: {
                    photosUrl: "",
                    photosId: 0,
                    proPhotosId: 0,
                    height: "170",
                    leftVision: "5.0",
                    faceId: 0,
                    faceppId: "",
                    rightVision: "5.0",
                    colorVision: "正常",
                    hearing: "正常",
                    leftLegs: "正常",
                    rightLegs: "正常",
                    trunkNeck: "正常",
                    residenceNo: "",
                    isTransfer: false,
                    useIccard: "false"
                },
                bindTeacherInfo: []
            };
            this.image = "";
            this.bindTeacherInfo1 = [];
            this.selectedUnitOptions = [];
            this.appointmentsLimit = false;
            this.brachSchool = this.schoolCode;
            let curProvince = this.schoolCode.toString().substring(0, 2) + "0000";
            let curCity = this.schoolCode.toString().substring(0, 4) + "00";
            global.getAreaByCode(curProvince, (data) => {
                let results = data;
                global.getAreaByCode(curCity, (data) => {
                    this.addStuForm.address = results + data;
                });
            });
            this.decline_timer = 5;
            var interval = setInterval(() => {
                if (this.decline_timer == 0) {
                    clearInterval(interval);
                    return;
                }
                this.decline_timer--;
            }, 1000);
        },
        //获取学员列表
        queryStudents() {
            this.pageLoading = true;
            let args = [this.schoolCode, this.page, this.pageSize, this.filters.keyWord, this.filters.curCarType, this.filters.isAppointment, this.filters.curStuType];
            global.printLog(args);
            setTimeout(() => {
                request.basic.student.query.list(args).then((res) => {
                    if (res.success === true) {
                        global.printLog(res);
                        this.pageLoading = false;
                        this.total = res.object.num;
                        this.students = res.object.list;
                    }
                });
            }, 1000);
        },
        //获取学员列表
        queryStudentsDetail(stuId) {
            this.appointmentsLimit = false;
            this.appointmentDisabled = true;
            request.basic.student.query.detailById(stuId).then((res) => {
                if (res.success === true) {
                    let data = res.object;
                    global.printLog(data);
                    global.printLog("-------------------------------------------");
                    this.brachSchool = data.schoolCode;
                    this.detailsForm = data;
                    this.editStuForm = data;

                    this.editStuForm.timerStudentInfo.useIccard = global.convertToString(data.timerStudentInfo.useIccard);
                    this.editStuForm.signTime = data.signTime !== null ? new Date(data.signTime) : "";
                    this.editStuForm.enterTime = data.enterTime !== null ? new Date(data.enterTime) : "";
                    this.editStuForm.birthday = data.birthday !== null ? new Date(data.birthday) : "";
                    this.editStuForm.effectiveDate = data.effectiveDate !== null ? new Date(data.effectiveDate) : "";
                    this.editStuForm.drivingLicenceTime = data.drivingLicenceTime !== null ? new Date(data.drivingLicenceTime) : "";

                    this.editStuForm.cardType = global.convertToString(data.cardType);
                    this.editStuForm.gender = global.convertToString(data.gender);
                    this.editStuForm.studyType = global.convertToString(data.studyType);
                    this.editStuForm.register = global.convertToString(data.register);
                    this.editStuForm.timerStudentInfo.isTransfer = data.timerStudentInfo.transfer;
                    this.editStuForm.appointmentStudentInfo.appointmentType = global.convertToString(data.appointmentStudentInfo.appointmentType);
                    this.learnFirst = data.appointmentStudentInfo.learnFirst;
                    if (data.isAppointment === null) {
                        this.appointmentDisabled = false;
                    }
                    this.image = data.timerStudentInfo.photosUrl;
                    this.studentPhoto = this.detailsForm.timerStudentInfo.photosUrl;
                    this.editStuForm.photosUrl = data.timerStudentInfo.photosUrl;
                    this.selectedUnitOptions = [];
                    var units = data.deptIdListInfo;
                    if (units.length) {
                        for (let item in units) {
                            this.selectedUnitOptions.push(units[item].deptId + "&" + units[item].deptName);
                        }
                        this.editStuForm.deptId = global.convertToString(units[units.length - 1].deptId);
                    }
                    if (data.appointmentStudentInfo.dayCount > -1 || data.appointmentStudentInfo.weekCount > -1) {
                        this.appointmentsLimit = true;
                    }
                    this.bindTeacherList = [];
                    for (var item in data.bindTeacherInfo) {
                        this.bindTeacherList.push(data.bindTeacherInfo[item].teacherId + "," + data.bindTeacherInfo[item].teacherName);
                    }
                    global.printLog(this.bindTeacherList);
                    this.queryTeachLog(data.studentId, 1);
                    this.queryTimeTraceInfo(data.studentId);
                    this.queryGraduationInfo(data.studentId);
                    this.queryClassRecordList(data.studentId);
                    this.queryStageTrainRecord(data.studentId);
                    global.printLog(this.editStuForm);
                    global.printLog("++++++++++++++++++++++++++++++++++++++++++++++++");
                }
                this.detailsFormVisible = true;
            });
        },
        queryAppointmentCoachByStudent() {
            this.filters.reservation.loading = true;
            this.filters.reservation.emptyVisible = false;
            setTimeout(() => {
                let paras = [this.filters.reservation.schoolCode, this.filters.reservation.page, this.filters.reservation.pageSize, this.filters.reservation.studentId, new Date(this.filters.reservation.date).Format("yyyy-MM-dd"), this.filters.reservation.stage, this.filters.reservation.keyword];
                global.printLog(paras);
                request.appointment.query.studentQueryInfo(paras).then((res) => {
                    //global.printLog(res);
                    if (res.success) {
                        let data = res.object.list;
                        this.filters.reservation.total = res.object.num;
                        for (let item in data) {
                            this.filters.reservation.data.push({
                                teacherId: data[item].teacherId,
                                teacherName: data[item].teacherName,
                                phone: data[item].phone,
                                photosUrl: data[item].photosUrl,
                                timeDOS: data[item].timeDOS,
                                modelId: data[item].modelId
                            });
                            // (function (that, res) {
                            //     for (let dos in res) {
                            //         that.timeDOS.push({
                            //             beginTime: res[dos].beginTime,
                            //             endTime: res[dos].endTime,
                            //             orderTime: res[dos].orderTime,
                            //             personCount: res[dos].personCount,
                            //             classMin: res[dos].classMin,
                            //             cost: res[dos].cost,
                            //             personHas: res[dos].personHas,
                            //             message: res[dos].message,
                            //             isOrder: res[dos].isOrder,
                            //             check: false,
                            //             modelId: data[item].modelId,
                            //             teacherId: data[item].teacherId
                            //         });
                            //     }
                            // })(this.filters.reservation.data[item], data[item].timeDOS);
                        }
                        this.filters.reservation.loadMore = this.filters.reservation.data.length < res.object.num;
                    }
                    this.filters.reservation.loading = false;
                    if (!this.filters.reservation.total) {
                        this.filters.reservation.emptyVisible = true;
                    }
                });
            }, 500)
        },
        handleLoadMore() {
            this.filters.reservation.page++;
            this.queryAppointmentCoachByStudent();
        },
        handleSelected(data, list) {
            if (!data.check) {
                data.check = true;
                this.filters.reservation.selected.push({
                    beginTime: data.beginTime,
                    endTime: data.endTime,
                    teacherId: data.teacherId,
                    studentId: this.filters.reservation.studentId,
                    appointmentStage: this.filters.reservation.stage,
                    schoolCode: this.schoolCode,
                    modelId: list.modelId,
                    appointmentType: 10,
                    appointmentUserType: 30,
                    appointmentUserId: JSON.parse(sessionStorage.getItem("user")).userId
                });
            }
            else {
                data.check = false;
                this.filters.reservation.selected.splice(this.filters.reservation.selected.indexOf(data), 1);
            }
        },
        handleCreateReservation() {
            let paras = { infos: this.filters.reservation.selected };
            //global.printLog(JSON.stringify(paras));
            request.appointment.create.appointmentinfo(paras).then((res) => {
                if (res.success) {
                    this.handleQueryAfterResetData();
                    this.$message.success({ message: res.object.message });
                }
            });
        },
        handleQueryAfterResetData() {
            this.filters.reservation.data = [];
            this.filters.reservation.page = 1;
            this.filters.reservation.selected = [];
            if (this.appointmentCoachFormVisible) {
                this.queryAppointmentCoachByStudent();
            }
        },
        queryCoach() {
            request.basic.student.query.bindCoach(this.schoolCode).then((res) => {
                if (res.success === true) {
                    this.coachData = [];
                    let data = res.object;
                    for (let item in data) {
                        this.coachData.push({
                            teacherId: data[item].teacherId,
                            teacherName: data[item].teacherName
                        });
                    }
                }
            });
        },
        queryClassRecordList(stuId) {
            let args = [stuId, this.classRecordPage, this.pageSize];
            request.basic.student.query.classRecordList(args).then((res) => {
                if (res.success === true) {
                    this.classRecord = res.object.list;
                    this.recordListTotal = res.object.num;
                }
            });
        },
        queryTimeTraceInfo(stuId) {
            request.basic.student.query.timeTraceInfo(stuId).then((res) => {
                if (res.success === true) {
                    //global.printLog(res);
                    this.timeTraceInfo = res.object;
                }
            });
        },
        queryStageTrainRecord(stuId) {
            let args = [stuId, this.stageTrainRecordPage, this.pageSize];
            request.basic.student.query.stageTrainRecord(args).then((res) => {
                if (res.success === true) {
                    //global.printLog(res);
                    this.stageTrainRecord = res.object.stageTrainRecordDetailList.list;
                    this.stageTrainRecordTotal = res.object.stageTrainRecordDetailList.num;
                }
            });
        },
        queryTeachLog(stuId, stage) {
            let args = [stuId, stage];
            request.basic.student.query.teachLog(args).then((res) => {
                if (res.success === true) {
                    //global.printLog(res);
                    this.training_teaching_log_data = res.object;
                }
            });
        },
        queryGraduationInfo(stuId) {
            request.basic.student.query.graduationInfo(stuId).then((res) => {
                global.printLog(res);
                if (res.success === true) {
                    //global.printLog(res);
                    this.graduation_management_data = res.object;
                    //this.graduation_management_data.state = global.convertToString(res.object.state);
                    //global.printLog(this.graduation_management_data);
                    //global.printLog(graduation_management_data.state);
                }
            });
        },
        initMap() {
            setTimeout(function () {
                map = new AMap.Map("map", {
                    zoom: 10,
                    center: [global.map.center.lat, global.map.center.lng]
                });
            }, 1000);
        },
        formatter(row, column) {
            if (column.property === "uploadState") {
                return global.enums.uploadState[row.uploadState];
            }
            else if (column.property === "reportState") {
                return global.enums.reportState[row.reportState];
            }
            else if (column.property === "photosType") {
                return global.enums.photoType[row.photosType];
            }
            else if (column.property === "stage") {
                return global.enums.stage[row.stage];
            }
            else if (column.property === "checkState") {
                return global.enums.reviewState[row.checkState];
            }
            else if (column.property === "isUpload") {
                return row.isUpload ? "已备案" : "未备案";
            }
        },
        //性别显示转换
        formatSex(row, column) {
            return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
        },
        //转换
        formatData(val, flag, format) {
            if (flag === "date") {
                return val === "" ? "" : new Date(val).Format(format);
            }
            else if (flag === "graduateState") {
                return global.enums.graduateState[val];
            }
            else if (flag === "isUpload") {
                return val ? "已备案" : "未备案";
            }
        },
        //获取车辆类型
        getCarType() {
            request.public.queryCarType().then((res) => {
                if (res.success === true) {
                    this.carTypeOptions = [];
                    let data = res.object;
                    for (let item in data) {
                        this.carTypeOptions.push({
                            label: data[item].value,
                            value: data[item].key
                        });
                        if (data[item].value === "C1") {
                            this.addStuForm.oldCarType = this.addStuForm.carType = data[item].key;
                        }
                    }
                }
            });
        },
        //获取单位
        getDepartment() {
            global.printLog("开始执行getDepartment方法了......");
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
                    for (let item in data) {
                        this.branchSchoolData.push({
                            label: data[item].schoolName,
                            value: data[item].schoolCode
                        });
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
        //学员报名/编辑
        createNew(target) {
            if (target === "add") {
                this.$refs["addStuForm"].validate((valid) => {
                    if (valid) {
                        if (this.appointmentsLimit && this.addStuForm.isAppointment) {
                            let dCount = this.$refs.dayCount.$refs.input;
                            let wCount = this.$refs.weekCount.$refs.input;
                            if (dCount.value === "" && wCount.value === "") {
                                this.$message.warning("勾选[限制学员预约次数]后，每周预约次数或每天预约次数必须填写一项！");
                                return;
                            }
                            else if (!global.fieldVerification.IsNumber(dCount.value) || !global.fieldVerification.IsNumber(wCount.value)) {
                                this.$message.warning("预约次数必须为大于0的正整数，请重填！");
                                return;
                            }
                            else {
                                if (dCount.value === "0" || wCount.value === "0") {
                                    this.$message.warning("预约次数必须大于0！");
                                    return;
                                }
                                else if (wCount.value !== "" && dCount.value !== "" && wCount.value < dCount.value) {
                                    this.$message.warning("每周预约次数必须大于或等于每天预约次数！");
                                    return;
                                }
                                this.addStuForm.appointmentStudentInfo.dayCount = dCount.value === "" ? -1 : dCount.value;
                                this.addStuForm.appointmentStudentInfo.weekCount = wCount.value === "" ? -1 : wCount.value;
                                onUploadPic(this);
                            }
                        }
                        else {
                            onUploadPic(this);
                        }
                        function onUploadPic(that) {
                            if (that.addStuForm.isAppointment) {
                                if (that.addStuForm.appointmentStudentInfo.appointmentType === "20") {
                                    let stage2Time = that.addStuForm.appointmentStudentInfo.stage2Time;
                                    let stage3Time = that.addStuForm.appointmentStudentInfo.stage3Time;
                                    if (stage2Time !== "" && stage3Time !== "" && parseInt(stage2Time) < 1 || parseInt(stage3Time) < 1) {
                                        that.$message.warning("分钟数必须大于0！");
                                        return;
                                    }
                                }
                                else if (that.addStuForm.appointmentStudentInfo.appointmentType === "10") {
                                    let costBalance = that.addStuForm.appointmentStudentInfo.costBalance;
                                    if (costBalance !== "" && parseInt(costBalance) < 1) {
                                        that.$message.warning("学费必须大于0！");
                                        return;
                                    }
                                }
                                let floatingPrice = that.addStuForm.appointmentStudentInfo.floatingPrice;
                                let reg = new RegExp("^-?[0-9]*?[0-9]*$");
                                if (!reg.test(floatingPrice)) {
                                    that.$message.warning("浮动价格只能是数字，可为负数但不能有小数！");
                                    return;
                                }
                            }
                            if (that.image !== "") {
                                that.btnLoading = true;
                                let para = {
                                    studentName: that.addStuForm.studentName,
                                    studentPhone: that.addStuForm.phone,
                                    studentGender: that.addStuForm.gender,
                                    photoOfBase64: that.image.substring(that.image.indexOf(",") + 1)
                                }
                                let objs = Object.assign({}, para);
                                request.basic.student.create.photo(objs).then((res) => {
                                    if (res.success) {
                                        var data = res.object;
                                        that.addStuForm.timerStudentInfo.faceId = data.faceId;
                                        that.addStuForm.timerStudentInfo.photosId = data.photosId;
                                        that.addStuForm.timerStudentInfo.proPhotosId = data.proPhotosId;
                                        that.addStuForm.timerStudentInfo.photosUrl = data.photosUrl;
                                        that.addStuForm.photosUrl = data.photosUrl;
                                    }
                                    onCreate(that);
                                });
                            }
                            else {
                                that.btnLoading = true;
                                onCreate(that);
                            }
                        }
                        function onCreate(that) {
                            that.addStuForm.birthday = that.formatData(that.addStuForm.birthday, "date", "yyyy-MM-dd");
                            that.addStuForm.signTime = that.formatData(that.addStuForm.signTime, "date", "yyyy-MM-dd");
                            that.addStuForm.enterTime = that.formatData(that.addStuForm.enterTime, "date", "yyyy-MM-dd");
                            that.addStuForm.effectiveDate = that.formatData(that.addStuForm.effectiveDate, "date", "yyyy-MM-dd");
                            that.addStuForm.drivingLicenceTime = that.formatData(that.addStuForm.drivingLicenceTime, "date", "yyyy-MM-dd");

                            let formData = Object.assign({}, that.addStuForm);
                            global.printLog(JSON.stringify(formData));
                            global.printLog(that.addStuForm);
                            request.basic.student.create.student(formData).then((res) => {
                                that.btnLoading = false;
                                if (res.success) {
                                    if (that.addStuForm.timerStudentInfo.useIccard == 'true') {
                                        that.showCard = true;
                                        that.getData(res.object);
                                    }
                                    that.resetForm("addStuForm");
                                    that.$message.success({ message: "学员添加成功！" });
                                    that.addStuFormVisible = false;
                                    that.queryStudents();
                                }
                                else {
                                    that.addStuForm.signTime = that.addStuForm.signTime !== "" ? new Date(that.addStuForm.signTime) : that.addStuForm.signTime;
                                    that.addStuForm.enterTime = that.addStuForm.enterTime !== "" ? new Date(that.addStuForm.enterTime) : that.addStuForm.enterTime;
                                    that.addStuForm.birthday = that.addStuForm.birthday !== "" ? new Date(that.addStuForm.birthday) : that.addStuForm.birthday;
                                    that.addStuForm.effectiveDate = that.addStuForm.effectiveDate !== "" ? new Date(that.addStuForm.effectiveDate) : that.addStuForm.effectiveDate;
                                    that.addStuForm.drivingLicenceTime = that.addStuForm.drivingLicenceTime !== "" ? new Date(that.addStuForm.drivingLicenceTime) : that.addStuForm.drivingLicenceTime;
                                    that.$message.error("学员添加失败！原因：" + res.message);
                                    global.printLog(that.addStuForm);
                                }
                            });
                        }
                    }
                });
            }
            else if (target === "sign") {
                let that = this;
                let studentId = that.detailsForm.studentId;
                global.readSignatureData(function (data) {
                    let para = {
                        studentId: studentId,
                        cachetData: data
                    }
                    request.basic.student.create.graduation.examine(para).then((res) => {
                        if (res.success) {
                            that.queryGraduationInfo(studentId);
                            that.$message({ message: "结业考核成功！", type: "success" });
                        }
                        else {
                            that.$message.error("结业考核失败！原因：" + res.message);
                        }
                    });
                })
            }
            else if (target === "record") {
                let that = this;
                let studentId = that.detailsForm.studentId;
                let signatureUrlCondition = {};
                signatureUrlCondition["autinscode"] = that.graduation_management_data.schoolUnifyCode;
                signatureUrlCondition["gracertnum"] = that.graduation_management_data.gracertNum;
                signatureUrlCondition["grantdate"] = that.graduation_management_data.grantDate;
                signatureUrlCondition["stunum"] = that.graduation_management_data.studentUnifyCode;
                global.initSignatureData(signatureUrlCondition, function (data) {
                    global.printLog(data);
                    let para = {
                        studentId: that.graduation_management_data.studentId,
                        studentUnifyCode: that.graduation_management_data.studentUnifyCode,
                        schoolUnifyCode: that.graduation_management_data.schoolUnifyCode,
                        gracertNum: that.graduation_management_data.gracertNum,
                        grantDate: that.graduation_management_data.grantDate,
                        pdfUrl: that.graduation_management_data.pdfUrl,
                        esignature: data
                    }
                    global.printLog(JSON.stringify(para));
                    request.basic.student.create.graduation.record(para).then((res) => {
                        if (res.success) {
                            that.queryGraduationInfo(studentId);
                            that.$message({ message: "结业备案成功！", type: "success" });
                        }
                        else {
                            that.$message.error("结业备案失败！原因：" + res.message);
                        }
                    });
                });
            }
            else {
                this.$refs["editStuForm"].validate((valid) => {
                    if (valid) {
                        if (this.image === "" || this.image === null) {
                            this.$message.warning("请选择学员头像！");
                            return;
                        }
                        if (this.appointmentsLimit && this.editStuForm.isAppointment) {
                            let dCount = this.$refs.dayCount.$refs.input;
                            let wCount = this.$refs.weekCount.$refs.input;
                            if (dCount.value === "" && wCount.value === "") {
                                this.$message.warning("勾选[限制学员预约次数]后，每周预约次数或每天预约次数必须填写一项！");
                                return;
                            }
                            else if (!global.fieldVerification.IsNumber(dCount.value) || !global.fieldVerification.IsNumber(wCount.value)) {
                                this.$message.warning("预约次数必须为大于0的正整数，请重填！");
                                return;
                            }
                            else {
                                if (dCount.value === "0" || wCount.value === "0") {
                                    this.$message.warning("预约次数必须大于0！");
                                    return;
                                }
                                else if (wCount.value !== "" && dCount.value !== "" && wCount.value < dCount.value) {
                                    this.$message.warning("每周预约次数必须大于或等于每天预约次数！");
                                    return;
                                }
                            }
                            this.editStuForm.appointmentStudentInfo.dayCount = dCount.value === "" ? -1 : dCount.value;
                            this.editStuForm.appointmentStudentInfo.weekCount = wCount.value === "" ? -1 : wCount.value;
                        }
                        this.btnLoading = true;
                        var objExp = new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/);
                        if (!objExp.test(this.image)) {
                            let phonePara = {
                                studentName: this.editStuForm.studentName,
                                studentPhone: this.editStuForm.phone,
                                studentGender: this.editStuForm.gender,
                                photoOfBase64: this.image.substring(this.image.indexOf(",") + 1)
                            }
                            let objs = Object.assign({}, phonePara);
                            global.printLog(objs);
                            request.basic.student.create.photo(objs).then((res) => {
                                if (res.success) {
                                    var data = res.object;
                                    this.editStuForm.timerStudentInfo.faceId = data.faceId;
                                    this.editStuForm.timerStudentInfo.photosId = data.photosId;
                                    this.editStuForm.timerStudentInfo.proPhotosId = data.proPhotosId;
                                    this.editStuForm.timerStudentInfo.photosUrl = data.photosUrl;
                                    this.editStuForm.photosUrl = data.photosUrl;
                                    onUpdate(this);
                                }
                                else {
                                    global.printLog(this.editStuForm.drivingLicenceTime);
                                    this.editStuForm.signTime = this.editStuForm.signTime === "" ? "" : new Date(this.editStuForm.signTime);
                                    this.editStuForm.enterTime = this.editStuForm.enterTime === "" ? "" : new Date(this.editStuForm.enterTime);
                                    this.editStuForm.birthday = this.editStuForm.birthday === "" ? "" : new Date(this.editStuForm.birthday);
                                    this.editStuForm.effectiveDate = this.editStuForm.effectiveDate === "" ? "" : new Date(this.editStuForm.effectiveDate);
                                    this.editStuForm.drivingLicenceTime = this.editStuForm.drivingLicenceTime === "" ? "" : new Date(this.editStuForm.drivingLicenceTime);
                                    global.printLog(this.editStuForm);
                                    this.$message.error("学员修改失败123！原因：" + res.message);
                                    this.btnLoading = false;
                                }
                            });
                        }
                        else {
                            onUpdate(this);
                        }
                        function onUpdate(that) {
                            if (that.editStuForm.isAppointment) {
                                let floatingPrice = that.editStuForm.appointmentStudentInfo.floatingPrice;
                                let reg = new RegExp("^-?[0-9]*?[0-9]*$");
                                if (!reg.test(floatingPrice)) {
                                    that.btnLoading = false;
                                    that.$message.warning("浮动价格只能是数字，可为负数但不能有小数！");
                                    return;
                                }
                            }
                            if (that.editStuForm.isAppointment === null) {
                                that.editStuForm.isAppointment = false;
                            }
                            var updatePara = {
                                "studentId": that.editStuForm.studentId,
                                "studentName": that.editStuForm.studentName,
                                "schoolCode": that.editStuForm.schoolCode,
                                "gender": that.editStuForm.gender,
                                "cardType": that.editStuForm.cardType,
                                "cardNo": that.editStuForm.cardNo,
                                "phone": that.editStuForm.phone,
                                "signTime": that.formatData(that.editStuForm.signTime, "date", "yyyy-MM-dd"),
                                "enterTime": that.formatData(that.editStuForm.enterTime, "date", "yyyy-MM-dd"),
                                "recruitUser": that.editStuForm.recruitUser,
                                "transactor": that.editStuForm.transactor,
                                "carType": that.editStuForm.carType,
                                "province": that.editStuForm.province,
                                "city": that.editStuForm.city,
                                "county": that.editStuForm.county,
                                "qq": that.editStuForm.qq,
                                "address": that.editStuForm.address,
                                "studyType": that.editStuForm.studyType,
                                "oldCarType": that.editStuForm.oldCarType,
                                "drivingLicenceNo": that.editStuForm.drivingLicenceNo,
                                "drivingLicenceTime": that.formatData(that.editStuForm.drivingLicenceTime, "date", "yyyy-MM-dd"),
                                "photosUrl": that.editStuForm.photosUrl,
                                "nationality": that.editStuForm.nationality,
                                "signMoney": that.editStuForm.signMoney,
                                "comments": that.editStuForm.comments,
                                "isAppointment": that.editStuForm.isAppointment,
                                "deptId": that.editStuForm.deptId,
                                "register": that.editStuForm.register,
                                "birthday": that.formatData(that.editStuForm.birthday, "date", "yyyy-MM-dd"),
                                "effectiveDate": that.formatData(that.editStuForm.effectiveDate, "date", "yyyy-MM-dd"),
                                "email": that.editStuForm.email,
                                "postalcode": that.editStuForm.postalcode,
                                "registProvince": that.editStuForm.registProvince,
                                "registCity": that.editStuForm.registCity,
                                "registCounty": that.editStuForm.registCounty,
                                "registAddress": that.editStuForm.registAddress,
                                "appointmentStudentInfo": {
                                    "appointmentType": that.editStuForm.appointmentStudentInfo.appointmentType,
                                    "dayCount": that.appointmentsLimit ? that.editStuForm.appointmentStudentInfo.dayCount : -1,
                                    "weekCount": that.appointmentsLimit ? that.editStuForm.appointmentStudentInfo.weekCount : -1,
                                    "isLearnFirst": that.learnFirst,
                                    "forceEva": that.editStuForm.appointmentStudentInfo.forceEva,
                                    "floatingPrice": that.editStuForm.appointmentStudentInfo.floatingPrice,
                                    // "costBalance": that.editStuForm.appointmentStudentInfo.costBalance,
                                    // "has2Time": that.editStuForm.appointmentStudentInfo.has2Time,
                                    // "has3Time": that.editStuForm.appointmentStudentInfo.has3Time,
                                    // "stage2Time": that.editStuForm.appointmentStudentInfo.stage2Time,
                                    // "stage3Time": that.editStuForm.appointmentStudentInfo.stage3Time
                                },
                                "timerStudentInfo": {
                                    "photosUrl": that.editStuForm.timerStudentInfo.photosUrl,
                                    "photosId": that.editStuForm.timerStudentInfo.photosId,
                                    "proPhotosId": that.editStuForm.timerStudentInfo.proPhotosId,
                                    "height": that.editStuForm.timerStudentInfo.height,
                                    "leftVision": that.editStuForm.timerStudentInfo.leftVision,
                                    "faceId": that.editStuForm.timerStudentInfo.faceId,
                                    "faceppId": that.editStuForm.timerStudentInfo.faceppId,
                                    "rightVision": that.editStuForm.timerStudentInfo.rightVision,
                                    "colorVision": that.editStuForm.timerStudentInfo.colorVision,
                                    "hearing": that.editStuForm.timerStudentInfo.hearing,
                                    "leftLegs": that.editStuForm.timerStudentInfo.leftLegs,
                                    "rightLegs": that.editStuForm.timerStudentInfo.rightLegs,
                                    "trunkNeck": that.editStuForm.timerStudentInfo.trunkNeck,
                                    "residenceNo": that.editStuForm.timerStudentInfo.residenceNo,
                                    "isTransfer": that.editStuForm.timerStudentInfo.isTransfer,
                                    "useIccard": that.editStuForm.timerStudentInfo.useIccard
                                },
                                bindTeacherInfo: that.editStuForm.bindTeacherInfo
                            }
                            //let para = Object.assign({}, updatePara);
                            global.printLog(JSON.stringify(updatePara));
                            request.basic.student.update(updatePara).then((res) => {
                                if (res.success) {
                                    that.queryStudents();
                                    that.editStuFormVisible = false;
                                    that.$message({ message: "学员修改成功！", type: "success" });
                                }
                                else {
                                    that.editStuForm.signTime = new Date(that.editStuForm.signTime);
                                    that.editStuForm.enterTime = new Date(that.editStuForm.enterTime);
                                    that.$message.error("学员修改失败456！原因：" + res.message);
                                    global.printLog(that.editStuForm);
                                }
                                that.btnLoading = false;
                            });
                        }
                    }
                });
            }
        },
        //显示编辑界面
        handleEdit(index, row) {
            global.printLog(index);
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },
        //删除
        handleAppointment(index, row, target) {
            this.handleOpenEdit(row, target);
        },
        handleCurrentChange(val) {
            if (this.detailsFormVisible) {
                this.classRecordPage = val;
            }
            else {
                this.page = val;
                this.queryStudents();
            }
        },
        rowClick(row, evt, column) {
            if (column.type === "default") {
                if (this.detailsFormVisible) {
                }
                else {
                    this.queryStudentsDetail(row.studentId);
                }
            }
            else { }
        },
        stageChange(data) {
            let stuId = this.detailsForm.studentId;
            this.queryTeachLog(stuId, data);
        },
        studyAfterPaidChange(evt) {
            if (evt.target.checked) {
                this.$confirm("勾选先学后付，将会清空[初次充值]？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.rechargeDisabled = true;
                    this.addStuForm.appointmentStudentInfo.costBalance = "";
                }).catch(() => {
                    this.addStuForm.appointmentStudentInfo.isLearnFirst = false;
                    if (this.editStuFormVisible) {
                        this.learnFirst = false;
                    }
                });
            }
            else {
                this.rechargeDisabled = false;
                if (this.editStuFormVisible) {
                    global.printLog(evt);
                    this.learnFirst = false;
                    //this.editStuForm.appointmentStudentInfo.isLearnFirst = false;
                    //evt.target.checked = false;
                }
            }
        },
        appointmentTypeChange(val) {
            global.printLog(val);
            if (val === "10") {
                this.addStuForm.appointmentStudentInfo.stage2Time = "";
                this.addStuForm.appointmentStudentInfo.stage3Time = "";
            }
            else {
                this.addStuForm.appointmentStudentInfo.costBalance = "";
                this.addStuForm.appointmentStudentInfo.isLearnFirst = false;
            }
            //addStuForm.appointmentStudentInfo.stage2Time addStuForm.appointmentStudentInfo.costBalance addStuForm.appointmentStudentInfo.isLearnFirst
        },
        //所属单位值切换
        departmentChange(item) {
            global.printLog(item);
            this.curUnitItem = item;
            var len = item.length - 1;
            var value = item[len].split("&");
            if (this.addStuFormVisible) {
                this.addStuForm.deptId = value[0];
            }
            else {
                this.editStuForm.deptId = value[0];
            }
        },
        //Dialog被关闭回调
        dialogClose(target) {
            if (target === "new") {
                this.thisShow = false;
                this.addStuForm.registProvince = this.schoolCode.toString().substring(0, 2) + "0000";
                this.addStuForm.registCity = this.schoolCode.toString().substring(0, 4) + "00";
                this.addStuForm.province = "510000";
                this.addStuForm.city = "510100";
                this.addStuForm.county = "510101";
                this.resetForm("addStuForm");
            }
            else if (target === "high") {
                this.photosUrl = "";
                this.showImage = false;
                this.showCaptrue = true;
                idCardPhotographCount = 0;
            }
            else if (target === "detail") {
                //this.image = "";
                // this.brachSchool = "";
                this.radioHeaderSel = '基本信息';
                // this.selectedUnitOptions = [];
            }
            else if (target === "appointment") {
                // let list = this.dateList;
                // for (var i = 0, len = list.length; i < len; i++) {
                //     list[i].click = false;
                // }
                // list[0].click = true;
                this.filters.reservation.date = new Date().Format("yyyy-MM-dd");
            }
        },
        //Dialog被打开回调
        dialogOpen() {
            $(".el-cascader-menus").css("z-index", "20002");
            if (this.photographFormVisible) {
                this.showImageByInfo = false;
                this.showCaptrueByInfo = true;
                setTimeout(() => {
                    var captrueInfo = document.getElementById("captrue_info");
                    if (typeof captrueInfo.bStopPlay === "undefined") {
                        this.$message.error("拍照设备不存在或浏览器不支持");
                    }
                    else {
                        captrueInfo.bStopPlay();
                        var startPlay = captrueInfo.bStartPlay2(0);
                        captrueInfo.bSetMode(0);
                    }
                }, 1000);
                global.printLog("检测设备是否存在......");
            }
            else if (this.photoFormVisible) {
                let captrue = document.getElementById("captrue");
                captrue.bStopPlay();
                this.showSave = false;
                this.showPaiZhao = false;
            }
            else if (this.addStuFormVisible || this.editStuFormVisible) {
                this.thisShow = true;
            }
        },
        //传输高拍仪照片到服务器
        onPhotograph(tag) {
            if (tag === "do") {
                var ip;
                var port;
                var captrueInfo = document.getElementById("captrue_info");
                if (typeof captrueInfo.bStopPlay === "undefined") {
                    this.$message.error("拍照设备不存在或浏览器不支持");
                }
                else {
                    var startPlay = captrueInfo.bStartPlay2(0);
                    captrueInfo.bSetMode(0);
                    var str = captrueInfo.bSaveJPG("D:\\", "2");
                    global.printLog("str：" + str);
                    captrueInfo.bStopPlay();
                    let url = request.baseUrl + "/sc/common/highShotMeter/getPhotographInfo";
                    url = url.replace("http://", "").replace("https://", "");
                    var rooturl = url.substring(0, url.indexOf("/"));
                    var functionUrl = url.substring(url.indexOf("/"), url.length);
                    var index = rooturl.indexOf(":");
                    if (index < 0) {
                        ip = rooturl;
                        port = 80;
                    }
                    else {
                        ip = rooturl.substring(0, index);
                        port = rooturl.substring(index + 1);
                    }
                    global.printLog("ip：" + ip);
                    global.printLog("port：" + port);
                    global.printLog("functionUrl：" + functionUrl);
                    global.printLog("以上没有问题，开始上传本地照片到服务器...");
                    //上传本地照片到服务器
                    //122平台更改上传照片方法：sUpLoadImageEx2，最后一个参数由true变成false就好了；
                    var result = captrueInfo.sUpLoadImageEx2("D:\\2.JPG", ip, port, functionUrl, true, false);
                    global.printLog(result);
                    global.printLog("result:" + result);
                    let data = JSON.parse(eval(JSON.stringify(result)));
                    if (data.success) {
                        global.printLog(data.object);
                        this.infoPhotoUrl = "data:image/jpeg;base64," + data.object;
                    }
                    this.showImageByInfo = true;
                    this.showCaptrueByInfo = false;
                }
            }
            else {
                this.showImageByInfo = false;
                this.showCaptrueByInfo = true;
                setTimeout(() => {
                    var captrueInfo = document.getElementById("captrue_info");
                    if (typeof captrueInfo.bStopPlay === "undefined") {
                        this.$message.error("拍照设备不存在或浏览器不支持");
                    }
                    else {
                        captrueInfo.bStopPlay();
                        var startPlay = captrueInfo.bStartPlay2(0);
                    }
                }, 1000);
            }
        },
        //读取身份证/读取高拍仪
        readMachine(type) {
            if (type === "id") {
                this.$message.info("暂未开通身份证读取功能，敬请期待");
            }
            else {
                var CVR_IDCard = document.getElementById("CVR_IDCard");
                if (typeof (CVR_IDCard.ReadCard) === "undefined") {
                    this.$message.error("浏览器无法支持高拍仪读取信息，请更换为IE11浏览器重试");
                }
                else {
                    var results = CVR_IDCard.ReadCard();
                    global.printLog("results：" + results);
                    global.printLog(results === "0");
                    if (results === "0") {
                        this.thisShow = false;
                        //获取姓名
                        var name = CVR_IDCard.Name;
                        //获取性别
                        var gender = CVR_IDCard.Sex == "男" ? 1 : 2;
                        //获取证件号码
                        var cardNo = CVR_IDCard.CardNo;
                        //获取省
                        var registProvince = cardNo.substr(0, 2) + "0000";
                        //获取市
                        var registCity = cardNo.substr(0, 4) + "00";
                        //获取区/县
                        var registCounty = cardNo.substr(0, 6);
                        //获取地址
                        var address = CVR_IDCard.Address;
                        //获取出生日期
                        var birthDay = CVR_IDCard.Born.replace("年", "-").replace("月", "-").replace("日", "");
                        //获取身份证有效期止
                        var effectiveDate = CVR_IDCard.ExpiredDate.replace(/\./g, "-");
                        //获取头像base64数据
                        var photoOfBase64 = CVR_IDCard.Picture;
                        if (this.addStuFormVisible) {
                            this.addStuForm.registAddress = address;
                            this.addStuForm.birthday = new Date(birthDay);
                            this.addStuForm.cardNo = cardNo;
                            this.addStuForm.effectiveDate = new Date(effectiveDate);
                            this.addStuForm.gender = global.convertToString(gender);
                            this.addStuForm.studentName = name;
                            this.addStuForm.registProvince = registProvince;
                            this.addStuForm.registCity = registCity;
                            this.addStuForm.registCounty = registCounty;
                            this.image = "data:image/jpeg;base64," + photoOfBase64;
                            let province = registProvince.toString();
                            if (province !== "") {
                                if (province.substring(0, 4) === this.schoolCode.toString().substring(0, 4)) {
                                    this.addStuForm.register = "1";
                                }
                            }
                        }
                        else if (this.editStuFormVisible) {
                            this.editStuForm.registAddress = address;
                            this.editStuForm.birthday = new Date(birthDay);
                            this.editStuForm.cardNo = cardNo;
                            this.editStuForm.effectiveDate = new Date(effectiveDate);
                            this.editStuForm.gender = global.convertToString(gender);
                            this.editStuForm.studentName = name;
                            this.editStuForm.registProvince = registProvince;
                            this.editStuForm.registCity = registCity;
                            this.editStuForm.registCounty = registCounty;
                            this.image = "data:image/jpeg;base64," + photoOfBase64;
                            let province = registProvince.toString();
                            if (province !== "") {
                                if (province.substring(0, 4) === this.schoolCode.toString().substring(0, 4)) {
                                    this.editStuForm.register = "1";
                                }
                            }
                        }
                        setTimeout(() => {
                            this.thisShow = true;
                        }, 200);
                    }
                    else {
                        global.printLog("进入高拍仪，还没刷身份证");
                    }
                }
            }
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
                this.$message.error("您的浏览器不支持图片上传，请升级您的浏览器");
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
            this.image = this.infoPhotoUrl;
            this.photographFormVisible = false;
        },
        handleOpenEdit(stu, target) {
            if (target === "edit") {
                this.detailsFormVisible = false;
                this.addStuForm.timerStudentInfo.useIccard = global.convertToString(this.detailsForm.timerStudentInfo.useIccard);
                setTimeout(() => {
                    this.thisShow = true;
                    this.editStuFormVisible = true;
                }, 100);
            }
            else if (target === "look") {
                let studentId = stu.studentId;
                request.basic.student.query.photo(studentId).then((res) => {
                    if (res.success) {
                        this.photoObject = [];
                        let data = res.object;
                        global.printLog(JSON.stringify(data));
                        for (let item in data) {
                            this.photoObject.push({
                                starting: false,
                                photosType: data[item].photosType,
                                photosUrl: data[item].photosUrl,
                                reportState: data[item].reportState,
                                // uploadStatusText: global.enums.picUploadStatus[data[item].reportState],
                                isHide: data[item].photosUrl === "" ? true : false,
                                failReason: data[item].failReason
                                //照片上报状态（10：已拍照；20：未上报；30：上报中；40：上报成功；50：上报失败）
                            });
                        }
                        this.photoFormVisible = true;
                        this.curPaiZhaoData.studentId = studentId;
                        this.curPaiZhaoData.schoolCode = stu.schoolCode;
                        global.printLog(this.photoObject);
                    }
                });
            }
            else if (target === "audit") {
                let para = {
                    studentId: stu.studentId,
                    schoolCode: stu.schoolCode
                }
                request.basic.student.audit(para).then((res) => {
                    if (res.success) {
                        stu.fnState = 40;
                        this.$message({ message: "学员审核成功！", type: "success" });
                    }
                    else {
                        this.$message.error("学员审核失败！原因：" + res.message);
                    }
                });
            }
            else if (target === "print") {
                request.basic.student.query.printForm(stu.studentId).then((res) => {
                    if (res.success) {
                        window.open(res.object, "打印申请表");
                    }
                });
            }
            else if (target === "appointment") {
                this.filters.reservation.stage = "2";
                this.filters.reservation.keyword = "";
                this.filters.reservation.studentId = stu.studentId;
                this.filters.reservation.schoolCode = stu.schoolCode;
                this.appointmentCoachFormVisible = true;
                this.handleQueryAfterResetData();
            }
        },
        handleTakePhoto(row) {
            global.printLog("row" + row);
            idCardPhotographCount = 0;
            this.showCaptrue = true;
            this.showImage = false;
            setTimeout(() => {
                let type = row.photosType;
                var captrue = document.getElementById("captrue");
                if (typeof captrue.bStopPlay === "undefined") {
                    this.$message.error("拍照设备不存在或浏览器不支持");
                    return;
                }
                global.printLog("captrue" + captrue);
                this.showSave = false;
                this.showPaiZhao = false;
                this.showCaptrue = true;
                this.showImage = false;
                let that = this;
                this.curRowPhotos = row;
                row.starting = true;
                var timer = setInterval(function () {
                    if (captrue !== null) {
                        global.printLog("进入timer事件：" + timer);
                        clearInterval(timer);
                        global.printLog("准备进入高拍仪拍照方法：" + timer);
                        HIGHSHOTMETER.doPhotograph(type, captrue, that);
                    }
                    else {
                        global.printLog("loading...");
                        captrue = document.getElementById("captrue");
                    }
                }, 500);
            }, 200);
        },
        handleSelectionChange(data) {
            this.recordStudents.studentIdList = [];
            this.reportStudents.studentIdList = [];
            for (let item in data) {
                this.recordStudents.studentIdList.push({ studentId: data[item].studentId });
                this.reportStudents.studentIdList.push({ studentId: data[item].studentId });
            }
        },
        handleCommand(command) {
            if (command === "print") {
            }
            else if (command === "export") {
                let downLink = document.getElementById("down-link");
                downLink.setAttribute("href", request.baseUrl + "/sc/student/exportStudent?keyWord=" + this.filters.keyWord + "&carType=" + (this.filters.curCarType === "" ? 0 : this.filters.curCarType) + "&schoolCode=" + this.schoolCode + "&isAppointment=" + this.filters.isAppointment + "&queryType=" + this.filters.curStuType);
                downLink.click();
            }
            else if (command === "filing") {
                let students = this.recordStudents.studentIdList;
                if (students.length > 0) {
                    let para = Object.assign({}, this.recordStudents);
                    global.printLog(para);
                    request.basic.student.create.record(para).then((res) => {
                        if (res.success) {
                            this.recordStudents.studentIdList = [];
                            this.reportStudents.studentIdList = [];
                            this.$msgbox({
                                title: "系统提示",
                                message: res.object,
                                confirmButtonText: "确定",
                                closeOnClickModal: false,
                                beforeClose: (action, instance, done) => {
                                    if (action === "confirm" || action === "cancel") {
                                        done();
                                        this.queryStudents();
                                    }
                                }
                            }).then(action => { });
                        }
                        else {
                            this.$message.error("学员备案失败！原因：" + res.message);
                        }
                    });
                }
                else {
                    this.$message.error("请先选择要备案的学员！");
                }
            }
            else if (command === "report") {
                global.printLog("report");
                let students = this.reportStudents.studentIdList;
                if (students.length > 0) {
                    let para = Object.assign({}, this.reportStudents);
                    global.printLog(para);
                    request.basic.student.create.report(para).then((res) => {
                        global.printLog(res);
                        if (res.success) {
                            this.recordStudents.studentIdList = [];
                            this.reportStudents.studentIdList = [];
                            this.$msgbox({
                                title: "系统提示",
                                message: res.object,
                                confirmButtonText: "确定",
                                closeOnClickModal: false,
                                beforeClose: (action, instance, done) => {
                                    if (action === "confirm" || action === "cancel") {
                                        done();
                                        this.queryStudents();
                                    }
                                }
                            }).then(action => { });
                        }
                        else {
                            this.$message.error("学员上报失败！原因：" + res.message);
                        }
                    });
                }
                else {
                    this.$message.error("请先选择要上报的学员！");
                }
            }
        },
        handleReView(target) {
            if (target === -1) {
                global.printLog(this);
                this.showSave = false;
                this.showPaiZhao = true;
                global.printLog("开始调用handleTakePhoto方法：" + this.curRowPhotos);
                this.handleTakePhoto(this.curRowPhotos);
            }
            else if (target === 0) {
                global.printLog(idCardPhotographCount);
                var photosUrl = HIGHSHOTMETER.savePhoto(request.baseUrl + "/sc/student/uploadStudentCollectPhoto");
                global.printLog(photosUrl);
                global.printLog(JSON.stringify(photosUrl));
                let res = JSON.parse(eval(JSON.stringify(photosUrl)));
                global.printLog(res);
                if (res.success) {
                    this.showCaptrue = false;
                    this.showPaiZhao = false;
                    this.showImage = true;
                    this.showSave = true;
                    this.photosUrl = res.object;
                    this.curPaiZhaoData.photosUrl = this.photosUrl;
                    this.curRowPhotos.starting = false;
                }
            }
            else {
                let data = Object.assign({}, this.curPaiZhaoData);
                request.basic.student.save(data).then((res) => {
                    if (res.success) {
                        let photos = this.photoObject;
                        for (let item in photos) {
                            if (photosType === photos[item].photosType) {
                                photos[item].isHide = false;
                            }
                        }
                        this.showSave = false;
                        this.$message({ message: "图片保存成功！", type: "success" });
                    }
                    else {
                        this.$message.error("图片保存失败！原因：" + res.message);
                    }
                });
            }
        },
        handleBrachSchoolChange(val) {
            if (val !== this.schoolCode) {
                this.addStuForm.schoolCode = val;
                this.addStuForm.parentSchoolCode = this.schoolCode;
                this.editStuForm.schoolCode = val;
                this.addStuForm.parentSchoolCode = this.schoolCode;
            }
            else {
                this.addStuForm.schoolCode = this.schoolCode;
                this.addStuForm.parentSchoolCode = this.parentSchoolCode;
                this.editStuForm.schoolCode = this.schoolCode;
                this.editStuForm.parentSchoolCode = this.parentSchoolCode;
            }
        },
        handlePhotoTableRowClcik(row) {
            this.photosUrl = row.photosUrl;
            this.showCaptrue = false;
            this.showImage = true;
            global.printLog(row.photosUrl);
        },
        handleTeachersChecked() {
            if (this.editStuFormVisible) {
                this.editStuForm.bindTeacherInfo = bindTeachers(this.bindTeacherList);
            }
            else if (this.addStuFormVisible) {
                this.addStuForm.bindTeacherInfo = bindTeachers(this.bindTeacherList);
            }
            this.selectFormVisible = false;
            function bindTeachers(data) {
                let arr = [];
                for (let item in data) {
                    let id = data[item].split(",")[0];
                    let name = data[item].split(",")[1];
                    arr.push({ teacherId: id, teacherName: name });
                }
                return arr;
            }
        },
        handleTagClose(data) {
            if (this.editStuFormVisible) {
                this.editStuForm.bindTeacherInfo.splice(this.editStuForm.bindTeacherInfo.indexOf(data), 1);
            }
            else if (this.addStuFormVisible) {
                this.addStuForm.bindTeacherInfo.splice(this.addStuForm.bindTeacherInfo.indexOf(data), 1);
            }
            this.bindTeacherList.splice(this.bindTeacherList.indexOf(data.teacherId + "," + data.teacherName), 1);
        },
        listenData(result, tag) {
            if (this.addStuFormVisible) {
                if (tag === "basic") {
                    this.addStuForm.province = result[0].province.code;
                    this.addStuForm.city = result[0].city.code;
                    this.addStuForm.county = result[0].code;
                }
                else if (tag === "reg") {
                    this.addStuForm.registProvince = result[0].province.code;
                    this.addStuForm.registCity = result[0].city.code;
                    this.addStuForm.registCounty = result[0].code;
                }
            }
            else if (this.editStuFormVisible) {
                if (tag === "basic") {
                    this.editStuForm.province = result[0].province.code;
                    this.editStuForm.city = result[0].city.code;
                    this.editStuForm.county = result[0].code;
                }
                else {
                    this.editStuForm.registProvince = result[0].province.code;
                    this.editStuForm.registCity = result[0].city.code;
                    this.editStuForm.registCounty = result[0].code;
                }
            }
            else {
                if (tag === "vtype") {
                    this.filters.curCarType = result;
                    this.queryStudents();
                }
            }
        },
        XykReadInfo() {
            // alert(10086);
            // var beg = new Date();
            var addsCard = document.getElementById("myobj");
            // console.log(addsCard);
            addsCard.SetReaderType('AYUSB');
            // // var results = addsCard.ReadCard();
            var revalue = addsCard.XykReadInfo();
            if (revalue == "") revalue = "错误:" + addsCard.LastError;
            if (revalue == "") {
                revalue = "错误:" + addsCard.LastError;
                this.$message.error("学员卡读取失败！原因：" + revalue);
            } else {
                this.$message({ message: "学员卡读取成功！", type: "success" });
            }
            // var end = new Date();
            // alert(end.getSeconds() * 1000 + end.getMilliseconds() - (beg.getSeconds() * 1000 + beg.getMilliseconds()));
        },
        XykSetInfo() {
            this.$refs["makeCard"].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    var setCard = document.getElementById('myobj');
                    setCard.SetReaderType('AYUSB');
                    let tmp = this.ruleForm;
                    let schNo1 = global.convertToString(tmp.schNo);
                    let stdNo = tmp.stdNo;
                    let sth;
                    if (schNo1.length === 9) {
                        sth = schNo1.split('');
                        sth.splice(4, 1);
                        sth = sth.join('');
                    }
                    switch (stdNo.length) {
                        case 4:
                            stdNo = '0000' + stdNo;
                            break;
                        case 5:
                            stdNo = '000' + stdNo;
                            break;
                        case 6:
                            stdNo = '00' + stdNo;
                            break;
                        case 7:
                            stdNo = '0' + stdNo;
                            break;

                    }
                    let finger = this.ruleForm.noFinger ? 'you' : 'NoFinger';
                    var info = setCard.XykSetInfo(
                        sth, //
                        stdNo,
                        tmp.studentName, //
                        tmp.carType, //
                        tmp.IdCardNo, //
                        '03015B110000F03EC01E800E8006800680028002800280028002800280028002800280028002800200000000000000000000000000000000200B2ADE2717AB7E6818037E3D2A813E4A37851E23BFE7FE578D81BF21A06A7F64A5995F2FA76C3F6D2D84F75FB004FF24B0519F29B42BBF19B527BF63BE46BF261BD33D000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',//tmp.fingerMB1,
                        '0302531A0000FFFF80038001800180018001800180018001800180018001800180018001800180018001FFFF1C6C000000000000000000000E06945E440FD89E1094ECBE4E1C053E0830E8BE66B0DCDE58BC485E6BC51D7E668F1AFF1B1F009F27A756FF3AAAC63F4EB1C6FF5139091F0EC024BF54C249FF60C5069F373CCBFD313D5FBD4B2B06BA08C6E2924AAD9C3816BA0DF909448DD323AB04571FB3C72F000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', // tmp.fingerMB2
                        tmp.thHour, //
                        tmp.opHour,  //
                        tmp.hadRunMile, //
                        "",
                        tmp.hadSubMinute, //
                        finger);
                    // var info = 'hello';
                    if (info == "") {
                        info = "错误:" + setCard.LastError;
                        this.$message.warning("学员制卡失败！原因：" + info);
                    }
                    else {
                        console.log(info);
                        var userStr = sessionStorage.getItem("user");
                        var userJ = JSON.parse(userStr);
                        var updatePara = {
                            'iccardNo': tmp.cardNo,
                            'schoolCode': tmp.schNo,
                            'studentId': parseInt(tmp.stdNo),
                            'studentName': tmp.studentName,
                            'idcardNo': tmp.IdCardNo,
                            'carTypeName': tmp.carType,
                            'fingerMB1': '03015B110000F03EC01E800E8006800680028002800280028002800280028002800280028002800200000000000000000000000000000000200B2ADE2717AB7E6818037E3D2A813E4A37851E23BFE7FE578D81BF21A06A7F64A5995F2FA76C3F6D2D84F75FB004FF24B0519F29B42BBF19B527BF63BE46BF261BD33D000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                            'fingerMB2': '0302531A0000FFFF80038001800180018001800180018001800180018001800180018001800180018001FFFF1C6C000000000000000000000E06945E440FD89E1094ECBE4E1C053E0830E8BE66B0DCDE58BC485E6BC51D7E668F1AFF1B1F009F27A756FF3AAAC63F4EB1C6FF5139091F0EC024BF54C249FF60C5069F373CCBFD313D5FBD4B2B06BA08C6E2924AAD9C3816BA0DF909448DD323AB04571FB3C72F000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                            'thHour': tmp.thHour,
                            'opHour': tmp.opHour,
                            'hadRunMile': tmp.hadRunMile,
                            'hadSubMinute': tmp.hadSubMinute,
                            'fingerprint': tmp.noFinger,
                            'userId': userJ.userId,
                            'operateType': this.detailsForm.timerStudentInfo.makeIcCard ? '2' : '1'
                        }
                        request.basic.student.makeIcCard(updatePara).then((res) => {
                            // console.log('==========================================');
                            // console.log(updatePara);
                            // console.log(res);
                            // console.log('==========================================');
                            if (res.success) {
                                this.$message({ message: "学员制卡成功！数据库录入已更新", type: "success" });
                                this.showCard = false;
                            }
                            else {
                                this.editStuForm.signTime = new Date(this.editStuForm.signTime);
                                this.editStuForm.enterTime = new Date(this.editStuForm.enterTime);
                                this.$message.error("学员制卡录入数据库失败456！原因：" + res.message);
                                global.printLog(this.editStuForm);
                            }
                            this.btnLoading = false;
                        });
                        // this.$message({
                        //     type: 'success',
                        //     message: '制卡成功！'
                        // });
                    }
                }
            });



            // this.editStuForm.timerStudentInfo.makeIccard = true; 

        },
        cancelMake() {
            this.$confirm('是否放弃当前制卡操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // console.warn(this.isNewCreate);
                this.$message({
                    type: 'success',
                    message: '已取消制卡'
                });
                this.showCard = false;
            }).catch(() => {
                return;
            });
        },
        getData(para) {
            request.basic.student.query.makeCardInfoById(para).then(res => {
                let tmpObj = res.object;
                this.ruleForm.studentName = tmpObj.studentName;
                this.ruleForm.IdCardNo = tmpObj.cardNo;
                this.ruleForm.schNo = tmpObj.schoolCode;
                this.ruleForm.stdNo = global.convertToString(tmpObj.studentId);
                this.ruleForm.fingerMB1 = tmpObj.fingerMB1;
                this.ruleForm.fingerMB2 = tmpObj.fingerMB2;
                this.ruleForm.thHour = tmpObj.thHour === null ? '' : tmpObj.thHour;
                this.ruleForm.opHour = tmpObj.opHour;
                this.ruleForm.carType = tmpObj.carTypeName;
                this.ruleForm.hadRunMile = tmpObj.hadRunMile;
                this.ruleForm.hadSubMinute = tmpObj.hadSubMinute;
                this.ruleForm.noFinger = tmpObj.fingerprint;
            });
        },
        //重置表单数据
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    },
    components: {
        PCA,
        VTYPE
    },
    created() {
        // this.dateList = global.getDays(new Date().Format("yyyy-MM-dd"), 100);
        // this.dateList[0].click = true;
    },
    activated() {
        global.printLog("activated every one");
        this.getCarType();
        this.getDepartment();
        this.getBranchSchool();
        this.queryStudents();
    },
    deactivated() {
        global.printLog("deactivated...");
    },
    mounted() {
    }
}

/**
* 高拍仪
*/

//照片类型  2：现场照片   3：注册申请表   4：身份证  5：暂住证表  6：驾驶证申请表   7：体检表
var photosType;

var HIGHSHOTMETER = {
    //拍照    2：现场照片   3：注册申请表   4：身份证  5：暂住证表  6：驾驶证申请表   7：体检表
    doPhotograph: function (type, captrue, vm) {
        global.printLog("进入高拍仪......");
        photosType = type;
        //global.printLog(typeof captrue.bStopPlay === "undefined");
        //关闭正在拍照的摄像头
        var stopPlay = captrue.bStopPlay();
        global.printLog("stopPlay：" + stopPlay);
        //现场照片
        if (photosType == 2) {
            HIGHSHOTMETER.livePhoto();
        }
        //注册申请表
        else if (photosType == 3) {
            HIGHSHOTMETER.registApplicationForm();
        }
        //身份证
        else if (photosType == 4) {
            HIGHSHOTMETER.idCard();
        }
        //暂住证表
        else if (photosType == 5) {
            HIGHSHOTMETER.stayCardForm();
        }
        //驾驶证申请表
        else if (photosType == 6) {
            HIGHSHOTMETER.drivingLicenseApplicationForm();
        }
        //体检表
        else if (photosType == 7) {
            HIGHSHOTMETER.healthForm();
        }
        vm.showPaiZhao = true;
        vm.curPaiZhaoData.photosType = photosType;
        global.printLog("进入高拍仪成功......");
    },
    //现场照片拍照
    livePhoto: function () {
        //启用副摄像头
        var startPlay = captrue.bStartPlay2(0);
        captrue.bSetMode(0);
    },
    //注册申请表
    registApplicationForm: function () {
        var startPlay = captrue.bStartPlayRotate(90);
        captrue.bSetMode(3);
    },
    //身份证拍照
    idCard: function () {
        //启用主摄像头
        var startPlay = captrue.bStartPlay();
        //设置模式
        captrue.bSetMode(4);
    },
    //暂住证表拍照
    stayCardForm: function () {
        var startPlay = captrue.bStartPlay();
        captrue.bSetMode(3);
        captrue.bSaveMergeStart("D:\\", "5", 1, 2, 5, 5);
    },
    //驾驶证申请表拍照
    drivingLicenseApplicationForm: function () {
        var startPlay = captrue.bStartPlayRotate(90);
        captrue.bSetMode(3);
    },
    //体检表拍照
    healthForm: function () {
        var startPlay = captrue.bStartPlayRotate(90);
        captrue.bSetMode(3);
    },
    //保存拍照  url:上传照片地址
    savePhoto: function (url) {
        //上传照片后返回的路径
        var photosUrl = "";
        //照片名称
        var photosName = photosType.toString();
        global.printLog("photosType:" + photosType);
        //身份证需正反面拍照，共拍照两次，计数已拍照次数
        if (photosType == 4) {
            idCardPhotographCount += 1;
        }
        //保存图片至本机
        if (photosType == 5) {
            var saveMergePage = captrue.bSaveMergePage();
            if (!confirm("需要再拍摄暂住证明其他页吗？")) {
                var saveMergeEnd = captrue.bSaveMergeEnd();
                var stopPlay = captrue.bStopPlay();
                photosUrl = HIGHSHOTMETER.uploadPhoto("D:\\5.JPG", url);
                return photosUrl;
            }
        }
        else {
            global.printLog("photosType:" + photosType);
            var str = captrue.bSaveJPG("D:\\", photosName);
            global.printLog("str:" + str);
            if (photosType == 4 && idCardPhotographCount == 2) {
                var stopPlay = captrue.bStopPlay();
                global.printLog(stopPlay);
                photosUrl = HIGHSHOTMETER.uploadPhoto("D:\\" + photosName + ".JPG", url);
                global.printLog(photosUrl);
                return photosUrl;
            }
            else if (photosType != 4) {
                var stopPlay = captrue.bStopPlay();
                global.printLog("stopPlay:" + stopPlay);
                photosUrl = HIGHSHOTMETER.uploadPhoto("D:\\" + photosName + ".JPG", url);
                global.printLog("photosUrl:" + photosUrl);
                return photosUrl;
            }
        }
    },
    //上传照片
    uploadPhoto: function (photoPath, url) {
        //获取上传地址信息
        //global.printLog("url：" + url);
        var ip;
        var port;
        url = url.replace("http://", "").replace("https://", "");
        var rooturl = url.substring(0, url.indexOf("/"));
        var functionUrl = url.substring(url.indexOf("/"), url.length);
        var index = rooturl.indexOf(":");
        if (index < 0) {
            ip = rooturl;
            port = 80;
        }
        else {
            ip = rooturl.substring(0, index);
            port = rooturl.substring(index + 1);
        }
        // global.printLog("photoPath：" + photoPath);
        // global.printLog("ip：" + ip);
        // global.printLog("port：" + port);
        // global.printLog("functionUrl：" + functionUrl);
        // global.printLog("以上没有问题，开始上传本地照片到服务器...");
        //上传本地照片到服务器
        //122平台更改上传照片方法：sUpLoadImageEx2，最后一个参数由true变成false就好了；
        var photosUrl = captrue.sUpLoadImageEx2(photoPath, ip, port, functionUrl, true, false);
        //global.printLog("获取本地照片并上传到服务器成功，photosUrl：" + photosUrl);
        return photosUrl;
    }
}

</script>