<template>
  <section class="className">
    <!--工具条-->
    <el-col :span="24">
      <el-form label-width="80px">
        <el-col :span="9">
          <el-form-item label="教室名称">
            <el-input style="width:250px;" icon="search" placeholder="请输入教室名称" v-model="name" :on-icon-click="queryClassRoomList" @keyup.enter.native="queryClassRoomList">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="教室地址">
            <el-input style="width:250px;" icon="search" placeholder="请输入教室地址" v-model="address" :on-icon-click="queryClassRoomList" @keyup.enter.native="queryClassRoomList">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="float:right;">
          <el-form-item>
            <el-button type="primary" @click="queryClassRoomList"> 查 询 </el-button>
            <el-button type="primary" @click="addClassRommClick"> 新 增 </el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table highlight-current-row :data="classRoomList" @row-click="rowClick">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="deviceNo" label="设备"></el-table-column>
      <el-table-column prop="cameraNo" label="摄像头"></el-table-column>
      <el-table-column prop="gmtCreate" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button type="text" size="small" @click.stop="recordClick(scope.row)">培训记录</el-button>
          <el-button type="text" size="small" @click.stop="monitorClick(scope.row)">查看监控</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="this.total">
    </el-pagination>
    <!--新增理论教室-->
    <el-dialog title="新增理论教室" v-model="addClassRoom" :close-on-click-modal="false" size="full">
      <el-form :rules="validator" :model="addClassRoomCondition" ref="addClassRoomRef" :inline="true" class="demo-form-inline newSiteForm" label-width="105px">
        <p class="group-title">设置围栏</p>
        <el-row>
          <div id="mapContainer"></div>
        </el-row>
        <p class="group-title">围栏信息</p>
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="addClassRoomCondition.name" placeholder="名称"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input v-model="addClassRoomCondition.address" placeholder="地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="面积(平方米)" prop="area">
              <el-input v-model="addClassRoomCondition.area" placeholder="面积(平方米)"></el-input>
            </el-form-item>
            <el-form-item label="容纳人数" prop="galleryful">
              <el-input v-model="addClassRoomCondition.galleryful" placeholder="容纳人数"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备列表" prop="devices">
              <el-select v-model="addClassRoomCondition.devices" multiple placeholder="请选择设备">
                <el-option v-for="item in deviceList" :label="item.number" :value="item.number"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="photo">
          <label class="camera-Text">*请选择四个方位摄像头</label>
          <div class="glyph-icon icon-shexiangtou fontPhotoA"></div>
          <el-form-item class="cameraA ">
            <el-select v-model="addClassRoomCondition.cameras[0].cameraNo" placeholder="请选择摄像头">
              <el-option v-for="item in cameraList" :label="item.number" :value="item.number"></el-option>
            </el-select>
          </el-form-item>
          <div class="glyph-icon icon-shexiangtou fontPhotoB"></div>
          <el-form-item class="cameraB ">
            <el-select v-model="addClassRoomCondition.cameras[3].cameraNo" placeholder="请选择摄像头">
              <el-option v-for="item in cameraList" :label="item.number" :value="item.number"></el-option>
            </el-select>
          </el-form-item>
          <div class="glyph-icon icon-shexiangtou fontPhotoC"></div>
          <el-form-item class="cameraC ">
            <el-select v-model="addClassRoomCondition.cameras[1].cameraNo" placeholder="请选择摄像头">
              <el-option v-for="item in cameraList" :label="item.number" :value="item.number"></el-option>
            </el-select>
          </el-form-item>
          <div class="glyph-icon icon-shexiangtou fontPhotoD"></div>
          <el-form-item class="cameraD ">
            <el-select v-model="addClassRoomCondition.cameras[2].cameraNo" placeholder="请选择摄像头">
              <el-option v-for="item in cameraList" :label="item.number" :value="item.number"></el-option>
            </el-select>
          </el-form-item>
          <img src="../../../src/assets/images/classRoom.png">
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addClassRoom = false" size="large">取消</el-button>
        <el-button type="primary" size="large" @click="saveClassRoom('saveClassRoom')">保存</el-button>
      </div>
    </el-dialog>
    <!--理论教室详情-->
    <el-dialog title="理论教室详情" v-model="classRoomDetail" :close-on-click-modal="false" size="full">
      <el-form class="demo-form-inline newSiteForm" label-width="105px">
        <p class="group-title">设置围栏</p>
        <el-row>
          <div id="mapContainer"></div>
        </el-row>
        <p class="group-title">围栏信息</p>
        <el-row>
          <el-col :span="3" style="position:absolute;left:900px;">
            <el-button type="primary" @click="updateClassRommClick"> 编辑理论教室 </el-button>
          </el-col>
          <el-col :span="12" :push="3">
            <label style="font-size:17px;">名称：{{this.classRoomDetailCondition.name}}</label>
          </el-col>
          <el-col :span="7" :push="2">
            <label style="font-size:17px;">地址：{{this.classRoomDetailCondition.address}}</label>
          </el-col>
          <el-col :span="12" :push="3">
            <label style="font-size:17px;">面积(平方米)：{{this.classRoomDetailCondition.area}}</label>
          </el-col>
          <el-col :span="7" :push="2">
            <label style="font-size:17px;">容纳人数：{{this.classRoomDetailCondition.galleryful}}</label>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :push="3">
            <label style="font-size:17px;">设备列表：{{this.classRoomDetailCondition.deviceNo}}</label>
          </el-col>
        </el-row>
        <el-row class="photo">
          <div class="glyph-icon icon-shexiangtou fontPhotoA"></div>
          <el-form-item class="cameraA ">
            <label style="font-size:17px;">摄像头A：{{this.classRoomDetailCondition.cameraA}}</label>
          </el-form-item>
          <div class="glyph-icon icon-shexiangtou fontPhotoB"></div>
          <el-form-item class="cameraB ">
            <label style="font-size:17px;">摄像头D：{{this.classRoomDetailCondition.cameraD}}</label>
          </el-form-item>
          <div class="glyph-icon icon-shexiangtou fontPhotoC"></div>
          <el-form-item class="cameraC " style="left:420px">
            <label style="font-size:17px;">摄像头B：{{this.classRoomDetailCondition.cameraB}}</label>
          </el-form-item>
          <div class="glyph-icon icon-shexiangtou fontPhotoD"></div>
          <el-form-item class="cameraD " style="left:420px">
            <label style="font-size:17px;">摄像头C：{{this.classRoomDetailCondition.cameraC}}</label>
          </el-form-item>
          <img src="../../../src/assets/images/classRoom.png">
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="classRoomDetail = false" size="large">确定</el-button>
      </div>
    </el-dialog>
    <!--编辑理论教室-->
    <el-dialog title="编辑理论教室" v-model="updateClassRoom" :close-on-click-modal="false" size="full">
      <el-form :rules="validator" :model="updateClassRoomCondition" ref="updateClassRoomRef" :inline="true" class="demo-form-inline newSiteForm" label-width="105px">
        <p class="group-title">设置围栏</p>
        <el-row>
          <div id="mapContainerUpdate"></div>
        </el-row>
        <p class="group-title">围栏信息</p>
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="updateClassRoomCondition.name" placeholder="名称"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input v-model="updateClassRoomCondition.address" placeholder="地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="面积(平方米)" prop="area">
              <el-input v-model="updateClassRoomCondition.area" placeholder="面积(平方米)"></el-input>
            </el-form-item>
            <el-form-item label="容纳人数" prop="galleryful">
              <el-input v-model="updateClassRoomCondition.galleryful" placeholder="容纳人数"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备列表" prop="devices">
              <el-select v-model="updateClassRoomCondition.devices" multiple placeholder="请选择设备">
                <el-option v-for="item in deviceList" :label="item.number" :value="item.number"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="photo">
          <label class="camera-Text">*请选择四个方位摄像头</label>
          <div class="glyph-icon icon-shexiangtou fontPhotoA"></div>
          <el-form-item class="cameraA ">
            <el-select v-model="updateClassRoomCondition.cameras[0].cameraNo" placeholder="请选择摄像头">
              <el-option v-for="item in cameraList" :label="item.number" :value="item.number"></el-option>
            </el-select>
          </el-form-item>
          <div class="glyph-icon icon-shexiangtou fontPhotoB"></div>
          <el-form-item class="cameraB ">
            <el-select v-model="updateClassRoomCondition.cameras[3].cameraNo" placeholder="请选择摄像头">
              <el-option v-for="item in cameraList" :label="item.number" :value="item.number"></el-option>
            </el-select>
          </el-form-item>
          <div class="glyph-icon icon-shexiangtou fontPhotoC"></div>
          <el-form-item class="cameraC ">
            <el-select v-model="updateClassRoomCondition.cameras[1].cameraNo" placeholder="请选择摄像头">
              <el-option v-for="item in cameraList" :label="item.number" :value="item.number"></el-option>
            </el-select>
          </el-form-item>
          <div class="glyph-icon icon-shexiangtou fontPhotoD"></div>
          <el-form-item class="cameraD ">
            <el-select v-model="updateClassRoomCondition.cameras[2].cameraNo" placeholder="请选择摄像头">
              <el-option v-for="item in cameraList" :label="item.number" :value="item.number"></el-option>
            </el-select>
          </el-form-item>
          <img src="../../../src/assets/images/classRoom.png">
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="updateClassRoom = false" size="large">取消</el-button>
        <el-button type="primary" size="large" @click="saveClassRoom('updateClassRoom')">保存</el-button>
      </div>
    </el-dialog>
    <!--培训记录-->
    <el-dialog title="培训记录" v-model="record" :close-on-click-modal="false" size="full">
      <el-form label-width="80px">
        <el-row>
          <el-col :span="7">
            <el-form-item label="起始时间" class="normal">
              <el-date-picker align="right" type="datetime" v-model="recordCondition.gmtBegin" placeholder="选择时间日期" @change="beginDateChange">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="结束时间" class="normal">
              <el-date-picker align="right" type="datetime" v-model="recordCondition.gmtEnd" placeholder="选择时间日期" @change="endDateChange">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="教练姓名">
              <el-input style="width:250px;" v-model="recordCondition.teacherName" icon="search" placeholder="请输入教练姓名" :on-icon-click="queryRecordList" @keyup.enter.native="queryRecordList">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="float:right;">
            <el-form-item>
              <el-button type="primary" @click="queryRecordList"> 查 询 </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!--列表-->
      <el-table highlight-current-row :data="recordCondition.recordList" @row-click="recordRowClick">
        <el-table-column prop="teacherName" label="教练姓名"></el-table-column>
        <el-table-column prop="durationTime" label="课程时长（分钟）"></el-table-column>
        <el-table-column prop="signInNum" label="学员人数"></el-table-column>
        <el-table-column prop="gmtBegin" label="签到时间"></el-table-column>
        <el-table-column prop="gmtEnd" label="签退时间"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button type="text" size="small">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="this.recordCondition.total">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="record = false" size="large">取消</el-button>
      </div>
    </el-dialog>
    <!--培训详情页面-->
    <el-dialog title="详情页面" v-model="recordDetail" :close-on-click-modal="false" size="full">
      <el-row class="mb20">
        <el-col :span="17">
          <el-radio-group v-model="paymentType">
            <el-radio-button label="基本信息"></el-radio-button>
            <el-radio-button label="过程图片"></el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row v-if="paymentType==='基本信息'">
        <el-row>
          <el-col :span="3">
            <img class="photoClass" :src="recordDetailCondition.teacher.sigPhotoUrl">
          </el-col>
          <el-col :span="19" :push="1">
            <label style="font-size:17px;">姓名：{{ recordDetailCondition.teacherObj.userName}}</label>
            <label style="font-size:17px;" class="fontMidDetial">电话号码：{{ recordDetailCondition.teacherObj.telephone}}</label>
            <label style="font-size:17px;" class="fontEndDetial">培训时长：120分钟</label>
          </el-col>
          <el-col :span="19" :push="1">
            <div style="height:14px;"></div>
            <hr style="FILTER: alpha(opacity=100,finishopacity=0,style=3)" color='#CFCFCF' size=3>
          </el-col>
          <el-col :span="19" :push="1">
            <div style="height:14px;"></div>
            <label style="font-size:17px;">签到时间：{{recordDetailCondition.teacher.signInTime}}</label>
            <label style="font-size:17px;position: absolute;  left: 520px;">签退时间：{{recordDetailCondition.teacher.signOutTime}}</label>
          </el-col>
          <el-col :span="19" :push="1">
            <div style="height:14px;"></div>
            <hr style="FILTER: alpha(opacity=100,finishopacity=0,style=3)" color='#CFCFCF' size=3>
          </el-col>
          <el-col :span="19" :push="1">
            <div style="height:14px;"></div>
            <label style="font-size:17px;">签到学员数：{{ recordDetailCondition.recordObj.signInNum}}</label>
            <label style="font-size:17px;" class="fontMidDetial">过程签到学员数：{{ recordDetailCondition.recordObj.processNum}}</label>
            <label style="font-size:17px;" class="fontEndDetial">签退学员数：{{ recordDetailCondition.recordObj.signOutNum}}</label>
          </el-col>
          <el-col :span="19" :push="1">
            <div style="height:14px;"></div>
            <hr style="FILTER: alpha(opacity=100,finishopacity=0,style=3)" color='#CFCFCF' size=3>
          </el-col>
          <el-col :span="19" :push="1">
            <el-button type="text" size="small" @click="teacherDetailClick">查看详情</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form label-width="80px">
              <el-col :span="9">
                <el-form-item label="学员信息">
                  <el-input style="width:250px;" icon="search" placeholder="请输入学员姓名" v-model="recordDetailCondition.userName" :on-icon-click="queryStudent" @keyup.enter.native="queryStudent">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="审核状态">
                  <el-select placeholder="请选择审核状态" v-model="recordDetailCondition.status" @change="queryStudent">
                    <el-option label="成功 " value="success"></el-option>
                    <el-option label="失败  " value="fail"></el-option>
                    <el-option label="复审成功  " value="review_success"></el-option>
                    <el-option label="复审失败 " value="review_fail"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form>
          </el-col>
          <!--列表-->
          <el-table highlight-current-row :data="recordDetailCondition.studentList" @row-click="detailRowClick">
            <el-table-column prop="userName" label="学员姓名"></el-table-column>
            <el-table-column prop="telephone" label="电话号码"></el-table-column>
            <el-table-column prop="signInTime" label="签到时间"></el-table-column>
            <el-table-column prop="halfwayTime" label="过程签到时间"></el-table-column>
            <el-table-column prop="signOutTime" label="签退时间"></el-table-column>
            <el-table-column prop="status" label="审核结果"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button type="text" size="small">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--工具条-->
          <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="recordDetailCondition.total">
          </el-pagination>
        </el-row>
      </el-row>
      <el-row v-if="paymentType==='过程图片'">
        <!--过程图片-->
        <div v-for="items in recordDetailCondition.studentList">
          <el-row>
            <el-col :span="24" style="height:35px">
              <label style="font-size:16px"> 日期:{{items.day}}</label>
            </el-col>
            <el-col :span="3">
              <img style="width: 90px; height: 117px;top155px" :src="items.sigPhotoUrl">
              <label style="font-size:14px;position: absolute;  left: 10px; top:160px;">{{items.userName}}学员</label>
            </el-col>
            <el-col :span="3">
              <img style="width: 120px;height: 137px;position:absolute;left:200px;" class="photoClass1" :src="items.sigInUrl">
              <label style="font-size:14px;position: absolute;  left: 200px; top:200px;">开始签到{{items.inTime}}
                <i v-if="items.inStatus=='success'||items.inStatus=='review_success'" class="el-icon-check"></i>
                <i v-else class="el-icon-close"></i>
              </label>
            </el-col>
            <el-col :span="3">
              <img style="width: 120px;height: 137px;position:absolute;left:470px;" class="photoClass1" :src="items.halfwayUrl">
              <label style="font-size:14px;position: absolute;  left: 470px; top:200px;">中途签到{{items.halfwayTime}}
                <i v-if="items.halfwayStatus=='success'||items.halfwayStatus=='review_success'" class="el-icon-check"></i>
                <i v-else class="el-icon-close"></i>
              </label>
            </el-col>
            <el-col :span="3">
              <img style="width: 120px;height: 137px;position:absolute;left:740px;" class="photoClass1" :src="items.sigOutUrl">
              <label style="font-size:14px;position: absolute;  left: 740px; top:200px;">结束签到{{items.outTime}}
                <i v-if="items.outStatus=='success'||items.outStatus=='review_success'" class="el-icon-check"></i>
                <i v-else class="el-icon-close"></i>
              </label>
            </el-col>
          </el-row>
          <div style="height:75px"></div>
        </div>
        <!--工具条-->
        <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="recordDetailCondition.total">
        </el-pagination>
      </el-row>
  
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="recordDetail = false" size="large">取消</el-button>
      </div>
    </el-dialog>
    <!--学员详情页面-->
    <el-dialog title="详情页面" v-model="stuDetail" :close-on-click-modal="false" size="small">
      <el-row>
        <el-col :span="19">
          <div style="height:14px;"></div>
          <label style="font-size:14px;">学员姓名：{{this.recordDetailCondition.student.userName}}</label>
          <label style="font-size:14px;" class="fontBegin">签到时间：{{this.recordDetailCondition.student.signInTime}}</label>
          <label style="font-size:14px;" class="fontMid">中途签到时间：{{this.recordDetailCondition.student.halfwayTime}}</label>
          <label style="font-size:14px;" class="fontEnd">签退时间：{{this.recordDetailCondition.student.signOutTime}}</label>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="height:15px">
        </el-col>
        <el-col :span="3">
          <img style="width: 100px; height: 137px;top155px" :src="this.recordDetailCondition.student.sigPhotoUrl">
          <label style="font-size:14px;position: absolute;  left: 10px; top:160px;">{{this.recordDetailCondition.student.userName}}学员</label>
        </el-col>
        <el-col :span="3">
          <img style="width: 168px;position:absolute;left:200px;" class="photoClass1" :src="this.recordDetailCondition.student.sigInUrl">
          <label style="font-size:14px;position: absolute;  left: 239px; top:200px;">学员签到
            <i v-if="this.recordDetailCondition.student.inStatus=='success'||this.recordDetailCondition.student.inStatus=='review_success'" class="el-icon-check"></i>
            <i v-else class="el-icon-close"></i>
          </label>
        </el-col>
        <el-col :span="3">
          <img style="width: 168px;position:absolute;left:470px;" class="photoClass1" :src="this.recordDetailCondition.student.halfwayUrl">
          <label style="font-size:14px;position: absolute;  left: 515px; top:200px;">中途签到
            <i v-if="this.recordDetailCondition.student.halfwayStatus=='success'||this.recordDetailCondition.student.halfwayStatus=='review_success'" class="el-icon-check"></i>
            <i v-else class="el-icon-close"></i>
          </label>
        </el-col>
        <el-col :span="3">
          <img style="width: 168px;position:absolute;left:740px;" class="photoClass1" :src=" this.recordDetailCondition.student.sigOutUrl ">
          <label style="font-size:14px;position: absolute;  left: 784px; top:200px;">结束签到
            <i v-if="this.recordDetailCondition.student.outStatus=='success'||this.recordDetailCondition.student.outStatus=='review_success'" class="el-icon-check"></i>
            <i v-else class="el-icon-close"></i>
          </label>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="stuDetail = false" size="large">取消</el-button>
      </div>
    </el-dialog>
    <!--教师详情页面-->
    <el-dialog title="详情页面" v-model="teacherDetail" :close-on-click-modal="false" size="small">
      <el-row>
        <el-col :span="19">
          <div style="height:14px;"></div>
          <label style="font-size:14px;">教师姓名：{{this.recordDetailCondition.teacherObj.userName}}</label>
          <label style="font-size:14px;" class="fontBegin">签到时间：{{this.recordDetailCondition.teacher.signInTime}}</label>
          <label style="font-size:14px;" class="fontMid">签退时间：{{this.recordDetailCondition.teacher.signOutTime}}</label>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="height:15px">
        </el-col>
        <el-col :span="3">
          <img style="width: 100px; height: 137px;top155px" :src="this.recordDetailCondition.teacher.sigPhotoUrl">
          <label style="font-size:14px;position: absolute;  left: 10px; top:160px;">{{this.recordDetailCondition.teacherObj.userName}}教员</label>
        </el-col>
        <el-col :span="3">
          <img style="width: 168px;position:absolute;left:200px;" class="photoClass1" :src="this.recordDetailCondition.teacher.sigInUrl">
          <label style="font-size:14px;position: absolute;  left: 239px; top:200px;">开始签到
            <i v-if="this.recordDetailCondition.teacher.inStatus=='success'||this.recordDetailCondition.teacher.inStatus=='review_success'" class="el-icon-check"></i>
            <i v-else class="el-icon-close"></i>
          </label>
        </el-col>
        <el-col :span="3">
          <img style="width: 168px;position:absolute;left:470px;" class="photoClass1" :src="this.recordDetailCondition.teacher.sigOutUrl">
          <label style="font-size:14px;position: absolute;  left: 515px; top:200px;">结束签到
            <i v-if="this.recordDetailCondition.teacher.outStatus=='success'||this.recordDetailCondition.teacher.outStatus=='review_success'" class="el-icon-check"></i>
            <i v-else class="el-icon-close"></i>
          </label>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="teacherDetail = false" size="large">取消</el-button>
      </div>
    </el-dialog>
    <!--培训监控页面-->
    <el-dialog title="详情页面" v-model="monitor" :close-on-click-modal="false" size="full">
      <el-row class="mb20">
        <el-col :span="12">
          <el-radio-group v-model="monitorType">
            <el-radio-button label="摄像头A"></el-radio-button>
            <el-radio-button label="摄像头B"></el-radio-button>
            <el-radio-button label="摄像头C"></el-radio-button>
            <el-radio-button label="摄像头D"></el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-col :span="10" v-if="monitorType==='摄像头A'">
        <embed src="http://125.71.30.144:5080/flashls/flashvideo.php?para=[{%22plate%22:%22%E5%B7%9DA12741%22,%22platecolor%22:%22%E9%BB%84%22,%22area%22:%221%22,%22chan%22:%221%22}]" width="400" height="420"></embed>
      </el-col>
      <el-col :span="10" v-if="monitorType==='摄像头B'">
        <embed src="http://125.71.30.144:5080/flashls/flashvideo.php?para=[{%22plate%22:%22%E5%B7%9DA12741%22,%22platecolor%22:%22%E9%BB%84%22,%22area%22:%221%22,%22chan%22:%221%22}]" width="400" height="420"></embed>
      </el-col>
      <el-col :span="10" v-if="monitorType==='摄像头C'">
      </el-col>
      <el-col :span="10" v-if="monitorType==='摄像头D'">
      </el-col>
      <!--列表-->
      <label style="position:absolute;left:535px;top:30px;">教练姓名:{{monitorCondition.monitorObj.teacherName}}</label>
      <label style="position:absolute;left:755px;top:30px;">在线学员:{{monitorCondition.monitorObj.signInNum}}</label>
      <label style="position:absolute;left:950px;top:30px;">培训时长:{{monitorCondition.monitorObj.durationTime}}</label>
      <div style="position:absolute;left:494px;width:583px">
        <el-table highlight-current-row :data="recordDetailCondition.studentList">
          <el-table-column prop="userName" label="学员姓名"></el-table-column>
          <el-table-column prop="idcard" label="身份证"></el-table-column>
          <el-table-column prop="signInTime" label="签到时间"></el-table-column>
        </el-table>
        <!--工具条-->
        <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="recordDetailCondition.total">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="monitor = false" size="large">取消</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<style scope lang="scss">
.className {
  .fontBegin {
    position: absolute;
    left: 173px;
  }

  .fontMidDetial {
    position: absolute;
    left: 300px;
  }

  .fontEndDetial {
    position: absolute;
    left: 663px;
  }

  .fontMid {
    position: absolute;
    left: 434px;
  }

  .fontEnd {
    position: absolute;
    left: 715px;
  }

  .photoClass1 {
    width: 170px;
    height: 180px;
  }

  .photoClass {
    width: 150px;
    height: 180px;
  }

  .camera-Text {
    font-size: 15px;
    color: red;
    position: absolute;
    left: 15px;
    top: 10px;
  }

  .newSiteForm {
    .addr .el-form-item__content {
      width: 814px;
    }
  }

  #mapContainer {
    height: 450px;
    width: 100%;
    border: 1px solid #d1dbe5;
  }

  #mapContainerUpdate {
    height: 450px;
    width: 100%;
    border: 1px solid #d1dbe5;
  }

  .photo {
    position: absolute;
    left: 148px;
  }


  .cameraA {
    position: absolute;
    left: 20px;
    top: 82px;
  }

  .fontPhotoA {
    font-size: 43px;
    color: #48D1CC;
    position: absolute;
    left: 25px;
    top: 30px;
  }

  .cameraB {
    position: absolute;
    left: 20px;
    top: 370px;
  }

  .fontPhotoB {
    font-size: 43px;
    color: #48D1CC;
    position: absolute;
    left: 25px;
    top: 320px;
  }

  .cameraC {
    position: absolute;
    left: 505px;
    top: 82px;
  }

  .fontPhotoC {
    font-size: 43px;
    color: #48D1CC;
    position: absolute;
    left: 660px;
    top: 32px;
  }

  .cameraD {
    position: absolute;
    left: 505px;
    top: 370px;
  }

  .fontPhotoD {
    font-size: 43px;
    color: #48D1CC;
    position: absolute;
    left: 660px;
    top: 320px;
  }
}
</style>
 
<script>
var map;
var mouseTool;
var makerShow = [];
var polygonArr = [];
var activePolygon = null;
var lnglatInArea = false;
import $ from "jquery";
import { request } from "../../api/api";
import { global } from "../../assets/javascript/global";
export default {
  data() {
    return {
      monitor: false,
      teacherDetail: false,
      stuDetail: false,
      recordDetail: false,
      record: false,
      updateClassRoom: false,
      classRoomDetail: false,
      addClassRoom: false,
      paymentType: "基本信息",
      monitorType: "摄像头A",
      pageSize: global.pageSize,
      currentPage: 1,
      schoolCode: JSON.parse(sessionStorage.getItem("user")).schoolCode,
      schoolName: JSON.parse(sessionStorage.getItem("user")).schoolName,
      total: 0,
      name: "",//教室列表查询条件
      address: "",//教室列表查询条件
      classRoomList: [], //教室列表展示
      addClassRoomCondition: {       //新增教室
        name: "", //名称
        address: "", //地址
        area: "", //面积
        galleryful: "",//容纳人数
        devices: [],//设备数组
        cameras: [
          {
            location: "A",
            cameraNo: "",
          },
          {
            location: "B",
            cameraNo: "",
          },
          {
            location: "C",
            cameraNo: "",
          },
          {
            location: "D",
            cameraNo: "",
          },
        ],//摄像头
        pens: [],//电子围栏数组

      },
      classRoomDetailCondition: {   //教室详情
        id: "",
        name: "", //名称
        address: "", //地址
        area: "", //面积
        galleryful: "",//容纳人数
        deviceNo: "", //设备列表
        cameraA: "",//A位置摄像头
        cameraB: "",
        cameraC: "",
        cameraD: "",
        pens: [],//电子围栏数组
      },
      deviceAllList: [],
      deviceList: [],//设备下拉框
      cameraList: [],//摄像头下拉框
      updateClassRoomCondition: {  //编辑教室
        id: "",
        name: "", //名称
        address: "", //地址
        area: "", //面积
        galleryful: "",//容纳人数
        devices: [],//设备数组
        cameras: [
          {
            location: "A",
            cameraNo: "",
          },
          {
            location: "B",
            cameraNo: "",
          },
          {
            location: "C",
            cameraNo: "",
          },
          {
            location: "D",
            cameraNo: "",
          },
        ],//摄像头
        pens: [],//电子围栏数组
      },
      monitorCondition: {//监控页面
        classRoomId: "",
        monitorObj: {
          id: "",  //培训记录id
          teacherName: "",
          signInNum: "",
          durationTime: "",
        }, //查询教室对象
      },
      recordCondition: { //培训记录页面
        recordList: [],  //培训记录列表
        classroomId: "",
        currentPage: 1,
        total: 0,
        gmtBegin: "", //开始时间
        gmtEnd: "", //结束时间
        teacherName: "",//教练姓名
      },
      recordDetailCondition: {     //培训记录详情页面
        userName: "",
        telephone: "",
        idcard: "", //身份证
        status: "",
        currentPage: 1,
        total: 0,
        recordId: "",   //培训记录编号Id
        teacherObj: {},  //培训记录教练详情
        recordObj: {},    //培训记录详情
        teacher: {
          sigPhotoUrl: "", //证件照片
          signInTime: "", //签到时间
          inStatus: "",
          sigInUrl: "",//签到照片
          signOutTime: "",//签退时间
          sigOutUrl: "",//签退照片
          outStatus: "",
        },
        studentList: [],//学员列表
        student: {   //学员详情
          userName: "",
          sigPhotoUrl: "", //证件照片
          signInTime: "", //签到时间
          sigInUrl: "",//签到照片
          inStatus: "",
          halfwayTime: "",
          halfwayUrl: "",
          halfwayStatus: "",
          signOutTime: "",//签退时间
          sigOutUrl: "",//签退照片
          outStatus: "",
        },

      },
      validator: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入地址", trigger: "blur" }
        ],
        area: [
          { required: true, message: "请输入面积", trigger: "blur" }
        ],
        galleryful: [
          { required: true, message: "请输入容纳人数", trigger: "blur" }
        ],
        devices: [
          { type: 'array', required: true, message: "请选择设备", trigger: "change" }
        ],
        cameraNoA: [
          { required: true, message: "请选择摄像头", trigger: "change" }
        ],
      },

    }
  },
  methods: {
    //查询教室列表
    queryClassRoomList() {
      let args = [this.schoolCode, this.schoolName, this.name, this.address, this.currentPage, this.pageSize];
      // console.log(args)
      request.teaching.classRoom.query.queryClassRoomList(args).then((res) => {
        if (res.success === true) {
          this.total = res.object.num;
          this.classRoomList = res.object.list;
          for (let i = 0; i < this.classRoomList.length; i++) {
            this.classRoomList[i].gmtCreate = this.changDate(this.classRoomList[i].gmtCreate);
            let item = this.classRoomList[i];
            item.deviceNo = "";
            item.deviceArray = [];
            for (let j = 0; j < item.devices.length; j++) {
              item.deviceNo += item.devices[j].deviceNo + "  "; //列表的设备展示
              item.deviceArray.push(item.devices[j].deviceNo);
            }

            item.cameraNo = "";
            for (let k = 0; k < item.cameras.length; k++) {
              item.cameraNo += item.cameras[k].location + item.cameras[k].cameraNo + "  "; //列表的摄像头展示
              if (item.cameras[k].location == 'A') {
                item.cameraA = item.cameras[k].cameraNo;
              } else if (item.cameras[k].location == 'B') {
                item.cameraB = item.cameras[k].cameraNo;
              } else if (item.cameras[k].location == 'C') {
                item.cameraC = item.cameras[k].cameraNo;
              } else if (item.cameras[k].location == 'D') {
                item.cameraD = item.cameras[k].cameraNo;
              }

            }
          }

          // console.log(this.classRoomList);
        }
      });
    },
    //设备列表下拉框
    queryDevice() {
      let args = [this.schoolCode];
      request.teaching.classRoom.query.queryDevice(args).then((res) => {
        if (res.success === true) {
          this.deviceAllList = res.object.list;
          for (let i = 0; i < this.deviceAllList.length; i++) {
            let item = {};
            this.deviceAllList[i].type = this.changStatus(this.deviceAllList[i].type);
            item.model = this.deviceAllList[i].model;
            item.number = this.deviceAllList[i].number;
            if (this.deviceAllList[i].type == '设备') {
              this.deviceList.push(item);
            } else if (this.deviceAllList[i].type == '摄像头') {
              this.cameraList.push(item);
            }
          }
          // console.log(this.deviceList+"!!");
          // console.log(this.cameraList+"!!cameraList");
        }
      });
    },
    //查询培训记录列表
    queryRecordList() {
      let args = [this.recordCondition.classroomId, this.recordCondition.gmtBegin, this.recordCondition.gmtEnd, this.recordCondition.teacherName, this.recordCondition.currentPage, this.pageSize];
      request.teaching.classRoom.query.queryRecordList(args).then((res) => {
        if (res.success === true) {
          this.recordCondition.total = res.object.num;
          this.recordCondition.recordList = res.object.list;

          for (let i = 0; i < this.recordCondition.recordList.length; i++) {
            this.recordCondition.recordList[i].status = this.changStatus(this.recordCondition.recordList[i].status);
            this.recordCondition.recordList[i].gmtBegin = this.changDate(this.recordCondition.recordList[i].gmtBegin);
            this.recordCondition.recordList[i].gmtEnd = this.changDate(this.recordCondition.recordList[i].gmtEnd);
          }
        }
      });
    },
    //查询培训记录详情(教师)
    queryTeacher() {
      let args = [this.recordDetailCondition.recordId];
      request.teaching.classRoom.query.queryTeacher(args).then((res) => {
        if (res.success === true) {
          this.recordDetailCondition.teacherObj = res.object;
          let items = this.recordDetailCondition.teacherObj.signs;
          for (let i = 0; i < items.length; i++) {
            if (items[i].type == "photo") {
              this.recordDetailCondition.teacher.sigPhotoUrl = items[i].picUrl;
            } else if (items[i].type == "sign_in") {
              this.recordDetailCondition.teacher.signInTime = items[i].gmtSign;
              this.recordDetailCondition.teacher.sigInUrl = items[i].picUrl;
              this.recordDetailCondition.teacher.inStatus = items[i].status;
            } else if (items[i].type == "sign_out") {
              this.recordDetailCondition.teacher.signOutTime = items[i].gmtSign;
              this.recordDetailCondition.teacher.sigOutUrl = items[i].picUrl;
              this.recordDetailCondition.teacher.outStatus = items[i].status;
            }
          }
        }
      });
    },
    //查询培训记录详情页面(学员)
    queryStudent() {
      let args = [this.recordDetailCondition.recordId, this.recordDetailCondition.userName, this.recordDetailCondition.telephone,
      this.recordDetailCondition.idcard, this.recordDetailCondition.status, this.recordDetailCondition.currentPage, this.pageSize,];
      request.teaching.classRoom.query.queryStudent(args).then((res) => {
        if (res.success === true) {
          this.recordDetailCondition.total = res.object.num;
          this.recordDetailCondition.studentList = res.object.list;
          let items = this.recordDetailCondition.studentList;
          // console.log(items);
          for (let i = 0; i < items.length; i++) {
            items[i].status = this.changStatus(items[i].status);
            for (let j = 0; j < items[i].signs.length; j++) {
              if (items[i].signs[j].type == "photo") {
                items[i].sigPhotoUrl = items[i].signs[j].picUrl;
              } else if (items[i].signs[j].type == "sign_in") {
                items[i].signInTime = items[i].signs[j].gmtSign;
                items[i].sigInUrl = items[i].signs[j].picUrl;
                items[i].inStatus = items[i].signs[j].status;
                items[i].day = this.handleChangeDate(items[i].signs[j].gmtSign); //拆分日期
                items[i].inTime = this.handleChangeTime(items[i].signs[j].gmtSign); //拆分时间
              } else if (items[i].signs[j].type == "halfway") {
                items[i].halfwayTime = items[i].signs[j].gmtSign;
                items[i].halfwayUrl = items[i].signs[j].picUrl;
                items[i].halfwayStatus = items[i].signs[j].status;
                items[i].halfwayTime = this.handleChangeTime(items[i].signs[j].gmtSign); //拆分时间
              } else if (items[i].signs[j].type == "sign_out") {
                items[i].signOutTime = items[i].signs[j].gmtSign;
                items[i].sigOutUrl = items[i].signs[j].picUrl;
                items[i].outStatus = items[i].signs[j].status;
                items[i].outTime = this.handleChangeTime(items[i].signs[j].gmtSign); //拆分时间
              }
            }
          }
        }
      });
    },
    //查询培训记录详情
    queryRecordDetail() {
      let args = [this.recordDetailCondition.recordId];
      request.teaching.classRoom.query.queryRecordDetail(args).then((res) => {
        if (res.success === true) {
          this.recordDetailCondition.recordObj = res.object;
        }
      });
    },
    //查询监控页面
    queryMonitor(callback) {
      let args = [this.monitorCondition.classRoomId];
      request.teaching.classRoom.query.queryMonitor(args).then((res) => {
        if (res.success === true) {
          if (res.object != null) {
            this.monitorCondition.monitorObj = res.object;
            callback();
          }
        }
      });
    },
    //新增理论教室
    saveClassRoom(name) {
      if (name == "saveClassRoom") {
        this.$refs["addClassRoomRef"].validate((valid) => {
          if (valid) {
            this.addClassRoomCondition.pens = [];
            var path = polygonArr[0].G.path;
            for (var item in path) {
              this.addClassRoomCondition.pens.push({
                "longitude": path[item].lng,
                "latitude": path[item].lat
              });
            }
            let args = {};
            args.schoolCode = this.schoolCode;
            args.name = this.addClassRoomCondition.name;
            args.address = this.addClassRoomCondition.address;
            args.area = this.addClassRoomCondition.area;
            args.galleryful = this.addClassRoomCondition.galleryful;
            let device = {};
            let devices = [];
            for (let i = 0; i < this.addClassRoomCondition.devices.length; i++) {
              device.deviceNo = this.addClassRoomCondition.devices[i];
              devices.push(device);
            }
            args.devices = devices;
            args.cameras = this.addClassRoomCondition.cameras;
            args.pens = this.addClassRoomCondition.pens;
            // console.log(args);
            request.teaching.classRoom.save.saveClassRoom(args).then((res) => {
              if (res.success === true) {
                this.queryClassRoomList();
                this.addClassRoom = false;
                this.$message({ message: "新增教室成功！", type: "success" });
              }
              else {
                this.$message.error("新增教室失败");
              }
            });
          }
        });
      } else if (name == 'updateClassRoom') {
        this.$refs["updateClassRoomRef"].validate((valid) => {
          if (valid) {
            this.updateClassRoomCondition.pens = [];
            var path = polygonArr[0].G.path;
            for (var item in path) {
              this.updateClassRoomCondition.pens.push({
                "longitude": path[item].lng,
                "latitude": path[item].lat
              });
            }
            let args = {};
            args.id = this.updateClassRoomCondition.id;
            args.schoolCode = this.schoolCode;
            args.name = this.updateClassRoomCondition.name;
            args.address = this.updateClassRoomCondition.address;
            args.area = this.updateClassRoomCondition.area;
            args.galleryful = this.updateClassRoomCondition.galleryful;
            let device = {};
            let devices = [];
            for (let i = 0; i < this.updateClassRoomCondition.devices.length; i++) {
              device.deviceNo = this.updateClassRoomCondition.devices[i];
              devices.push(device);
            }
            args.devices = devices;
            args.cameras = this.updateClassRoomCondition.cameras;
            args.pens = this.updateClassRoomCondition.pens;
            // console.log(args);
            request.teaching.classRoom.save.updateClassRoom(args).then((res) => {
              if (res.success === true) {
                this.queryClassRoomList();
                this.updateClassRoom = false;
                this.$message({ message: "编辑教室成功！", type: "success" });
              }
              else {
                this.$message.error("编辑教室失败");
              }
            });
          }
        });
      }

    },
    //分页
    handleCurrentChange(val) {
      if (this.record == true) {
        this.recordCondition.currentPage = val;
        this.queryRecordList();
      } else if (this.recordDetail == true) {
        this.recordDetailCondition.currentPage = val;
        this.queryStudent();
      } else {
        this.currentPage = val;
        this.queryClassRoomList();
      }

    },
    // 日期改变拆分
    beginDateChange(date) {
      let dataStr = this.changDate(date);
      this.recordCondition.gmtBegin = dataStr;
      this.queryRecordList();
    },
    // 日期改变拆分
    endDateChange(date) {
      let dataStr = this.changDate(date);
      this.recordCondition.gmtEnd = dataStr;
      this.queryRecordList();
    },
    //设备类型转换
    changStatus(status) {
      let statusName = "";
      if (status == "device") {
        statusName = "设备";
      } else if (status == "camera") {
        statusName = "摄像头";
      } else if (status == "sign_in") {
        statusName = "正在签到";
      } else if (status == "halfway") {
        statusName = "正在过程签到 ";
      } else if (status == "sign_out") {
        statusName = "正在签退 ";
      } else if (status == "doing") {
        statusName = "正在培训 ";
      } else if (status == "done") {
        statusName = "培训完成 ";
      } else if (status == "success") {
        statusName = "成功  ";
      } else if (status == "fail") {
        statusName = "失败  ";
      } else if (status == "review_success") {
        statusName = "复审成功  ";
      } else if (status == "review_fail") {
        statusName = "复审失败 ";
      }
      return statusName;
    },
    //时间转换
    changDate(dateString) {
      if (dateString == null) {
        return "";
      }
      let dateC = "";
      let date = new Date(dateString);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      let h = date.getHours();
      let M = date.getMinutes();
      let s = date.getSeconds();
      dateC = y + "-" + m + "-" + d + " " + h + ":" + M + ":" + s;
      return dateC;
    },
    //拆分年月日
    handleChangeDate(data) {
      let date = data.split(" ");
      if (date.length != 1) {
        return date[0];
      }
      return data;
    },
    //拆分时间
    handleChangeTime(data) {
      let date = data.split(" ");
      if (date.length != 1) {
        return date[1];
      }
      return data;
    },
    //点击新增理论教室按钮
    addClassRommClick() {
      this.queryDevice();
      this.addClassRoom = true;
      this.initMap(true, 'mapContainer');
      this.addClassRoomCondition.name = "";
      this.addClassRoomCondition.address = "";
      this.addClassRoomCondition.area = "";
      this.addClassRoomCondition.galleryful = "";
      this.addClassRoomCondition.devices = [];
      this.addClassRoomCondition.cameras[0].cameraNo = "";
      this.addClassRoomCondition.cameras[1].cameraNo = "";
      this.addClassRoomCondition.cameras[2].cameraNo = "";
      this.addClassRoomCondition.cameras[3].cameraNo = "";
      this.addClassRoomCondition.pens = [];
    },
    //设备列表行点击方法
    rowClick(row, evt, column) {
      this.initMap(false, 'mapContainer');
      this.classRoomDetail = true;
      this.classRoomDetailCondition.id = row.id;
      this.classRoomDetailCondition.name = row.name;
      this.classRoomDetailCondition.address = row.address;
      this.classRoomDetailCondition.area = row.area;
      this.classRoomDetailCondition.galleryful = row.galleryful;
      this.classRoomDetailCondition.deviceNo = row.deviceNo;
      this.classRoomDetailCondition.cameraA = row.cameraA;
      this.classRoomDetailCondition.cameraB = row.cameraB;
      this.classRoomDetailCondition.cameraC = row.cameraC;
      this.classRoomDetailCondition.cameraD = row.cameraD;
      this.classRoomDetailCondition.devices = row.deviceArray;
      this.classRoomDetailCondition.pens = row.pens;
      setupInitialData(row.pens);
    },
    //培训记录行点击方法
    recordRowClick(row, evt, column) {
      this.recordDetail = true;
      this.recordDetailCondition.recordId = row.id;
      this.queryTeacher();
      this.queryRecordDetail();
      this.queryStudent();
    },
    //培训详情行点击方法
    detailRowClick(row, evt, column) {
      this.stuDetail = true;     //学员详情弹窗
      this.recordDetailCondition.student.userName = row.userName
      this.recordDetailCondition.student.sigPhotoUrl = row.sigPhotoUrl
      this.recordDetailCondition.student.signInTime = row.signInTime
      this.recordDetailCondition.student.sigInUrl = row.sigInUrl
      this.recordDetailCondition.student.inStatus = row.inStatus
      this.recordDetailCondition.student.halfwayTime = row.halfwayTime
      this.recordDetailCondition.student.halfwayUrl = row.halfwayUrl
      this.recordDetailCondition.student.halfwayStatus = row.halfwayStatus
      this.recordDetailCondition.student.signOutTime = row.signOutTime
      this.recordDetailCondition.student.sigOutUrl = row.sigOutUrl
      this.recordDetailCondition.student.outStatus = row.outStatus
      // console.log(this.recordDetailCondition.student.inStatus)
    },
    //查看教练详情点击按钮
    teacherDetailClick() {
      this.teacherDetail = true;

    },
    //点击编辑理论教室按钮
    updateClassRommClick() {
      this.initMap(true, 'mapContainerUpdate');
      this.updateClassRoom = true;
      this.classRoomDetail = false;
      this.queryDevice();
      this.updateClassRoomCondition.id = this.classRoomDetailCondition.id;
      this.updateClassRoomCondition.name = this.classRoomDetailCondition.name;
      this.updateClassRoomCondition.address = this.classRoomDetailCondition.address;
      this.updateClassRoomCondition.area = this.classRoomDetailCondition.area + "";
      this.updateClassRoomCondition.galleryful = this.classRoomDetailCondition.galleryful + "";
      this.updateClassRoomCondition.devices = this.classRoomDetailCondition.devices;
      this.updateClassRoomCondition.cameras[0].cameraNo = this.classRoomDetailCondition.cameraA;
      this.updateClassRoomCondition.cameras[1].cameraNo = this.classRoomDetailCondition.cameraB;
      this.updateClassRoomCondition.cameras[2].cameraNo = this.classRoomDetailCondition.cameraC;
      this.updateClassRoomCondition.cameras[3].cameraNo = this.classRoomDetailCondition.cameraD;
      this.updateClassRoomCondition.pens = [];

    },
    //点击培训记录按钮
    recordClick(row) {
      this.record = true;
      this.recordCondition.classroomId = row.id;
      this.recordCondition.gmtBegin = "";
      this.recordCondition.gmtEnd = "";
      this.recordCondition.teacherName = "";
      this.queryRecordList();
    },
    //点击监控按钮
    monitorClick(row) {
      this.monitor = true;
      this.monitorCondition.monitorObj.teacherName = "";
      this.monitorCondition.monitorObj.signInNum = "";
      this.monitorCondition.monitorObj.durationTime = "";
      this.monitorCondition.monitorObj.id = "";
      this.recordDetailCondition.studentList=[];
      this.monitorCondition.classRoomId = row.id;
      this.queryMonitor(() => {
        this.recordDetailCondition.recordId = this.monitorCondition.monitorObj.id;
        this.queryStudent();
        
      });


    },
    //初始化地图
    initMap(draw, name) {
      var editor = {};
      lnglatInArea = false;
      setTimeout(function () {
        map = new AMap.Map(name, {
          zoom: 10,
          center: [global.map.center.lat, global.map.center.lng]
        });
        if (draw) {
          mouseTool = new AMap.MouseTool(map);
          AMap.event.addListener(map, "click", function (e) {
            var lnglat = e.lnglat;
            for (var i = 0; i < polygonArr.length; i++) {
              if (polygonArr[i].contains(lnglat)) {
                lnglatInArea = true;
              }
            }
            if (!lnglatInArea) {
              closeAllEditor();
            }
          });

          var markers = [], _points, _mouseTool;
          map.plugin(["AMap.MouseTool"], function () {
            mouseTool.polygon({
              strokeColor: "#4A90E2",
              strokeOpacity: 1,
              fillColor: "#E0E3E5",
              fillOpacity: 0.5,
              strokeStyle: "dashed"
            });
            AMap.event.addListener(mouseTool, "draw", function (mt) {
              mouseTool.close();
              var polygon = mt.obj;
              polygonArr.push(polygon);
              var editor = new AMap.PolyEditor(map, polygon);
              polygon.setExtData({
                editor: editor
              });
              addDeleteDelegate(polygon);
              closeAllEditor();
              activePolygon = polygon;
              makerShowAndOpenEditor(editor);
            });
          });
        }
      }, 50);
    },
  },
  mounted() {
     this.queryClassRoomList();
  },
   //页面激活之后
    activated(){
        this.queryClassRoomList();
    },
}


function closeAllEditor() {
  for (var i = 0; i < polygonArr.length; i++) {
    var editor = polygonArr[i].getExtData().editor;
    polygonArr[i].setOptions({
      strokeColor: "#0e81e5",
      fillColor: "#0e81e5",
      strokeStyle: "solid"
    });
    editor.close()
  }
  activePolygon = null;
}
function addDeleteDelegate(polygon) {
  AMap.event.addListener(polygon, "mouseover", function (e) {
    if (activePolygon !== polygon) {
      polygon.setOptions({
        strokeColor: "#ff738f",
        fillColor: "#ff738f",
        strokeStyle: "solid"
      })
    }

  });
  AMap.event.addListener(polygon, "mouseout", function (e) {
    if (activePolygon !== polygon) {
      polygon.setOptions({
        strokeColor: "#0e81e5",
        fillColor: "#0e81e5",
        strokeStyle: "solid"
      })
    }
  });

  AMap.event.addListener(polygon, "click", function (e) {
    closeAllEditor();
    polygon.setOptions({
      strokeColor: "#ff738f",
      fillColor: "#ff738f",
      strokeStyle: "dashed"
    });
    activePolygon = polygon;
    makerShowAndOpenEditor(polygon.getExtData().editor);
    return false;
  });
}

function makerShowAndOpenEditor(editor) {
  editor.open();
  var regionData = getRegionData();
  if (regionData == null || regionData.length == 0) {
    return;
  }
  //去掉所有的maker
  if (makerShow != null && makerShow.length != 0) {
    for (var m = 0; m < makerShow.length; m++) {
      map.remove(makerShow[m]);
    }
  }
}

function getRegionData() {
  var pathData = [];
  for (var j = 0; j < polygonArr.length; j++) {
    var polygon = polygonArr[j];
    pathData.push(polygon.getPath())
  }
  return pathData
}

function setupInitialData(initPolygonData) {
  // console.log(map);
  // console.log(initPolygonData);
  lnglatInArea = true;
  if (initPolygonData.length == 0) {
    mouseTool.polygon();
    return
  }
  var polygonDataArr = [];
  map.setCenter(new AMap.LngLat(initPolygonData[0].longitude, initPolygonData[0].latitude));
  for (var i = 0; i < initPolygonData.length; i++) {
    var polygonData = initPolygonData[i];
    var point = new AMap.LngLat(polygonData.longitude, polygonData.latitude);
    polygonDataArr.push(point);
  }
  var polygon = new AMap.Polygon({
    map: map,
    strokeColor: "#0e81e5",
    fillColor: "#0e81e5",
    strokeStyle: "solid",
    fillOpacity: 0.5,
    strokeOpacity: 1,
    path: polygonDataArr
  });
  var editor = new AMap.PolyEditor(map, polygon);
  addDeleteDelegate(polygon);
  polygon.setExtData({
    editor: editor
  });
  polygonArr.push(polygon);
  map.setFitView();
}

</script> 