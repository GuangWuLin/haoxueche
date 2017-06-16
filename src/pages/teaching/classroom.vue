<template>
  <section class="className">
    <!--工具条-->
    <el-row>
      <el-form :inline="true">
        <el-form-item>
          <el-input icon="search" placeholder="请输入教室名称" v-model="name" :on-icon-click="queryClassRoomList">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input icon="search" placeholder="请输入教室地址" v-model="address" :on-icon-click="queryClassRoomList">
          </el-input>
        </el-form-item>
        <el-button type="primary" @click="addClassRommClick" class="right">&nbsp;新增&nbsp;</el-button>
      </el-form>
    </el-row>
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
    <el-dialog title="新增" v-model="addClassRoom" :close-on-click-modal="false" size="full">
      <el-form v-if="addClassRoom" :rules="validator" :model="addClassRoomCondition" ref="addClassRoomRef" :inline="true" label-width="125px">
        <p class="group-title">设置围栏</p>
        <div id="mapContainer"></div>
        <p class="group-title">围栏信息</p>
        <el-row>
          <el-form-item label="名称" prop="name">
            <el-input v-model="addClassRoomCondition.name" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item label="面积(平方米)" prop="area">
            <el-input v-model="addClassRoomCondition.area" placeholder="面积(平方米)"></el-input>
          </el-form-item>
          <el-form-item label="容纳人数" prop="galleryful">
            <el-input v-model="addClassRoomCondition.galleryful" placeholder="容纳人数"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="addClassRoomCondition.address" placeholder="地址" style="width:860px;"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="设备列表" prop="devices">
            <el-select v-model="addClassRoomCondition.devices" multiple placeholder="请选择设备" style="width:860px;">
              <el-option v-for="item in deviceList" :label="item.number" :value="item.number"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row class="photo">
          <label class="camera-Text">*请选择四个方位摄像头</label>
          <div class="glyph-icon icon-shexiangtou fontPhotoA"></div>
          <el-form-item class="cameraA">
            <el-select v-model="addClassRoomCondition.cameras[0].cameraNo" placeholder="请选择摄像头">
              <el-option v-for="item in cameraList" :label="item.number" :value="item.number"></el-option>
            </el-select>
          </el-form-item>
          <div class="glyph-icon icon-shexiangtou fontPhotoB"></div>
          <el-form-item class="cameraB">
            <el-select v-model="addClassRoomCondition.cameras[3].cameraNo" placeholder="请选择摄像头">
              <el-option v-for="item in cameraList" :label="item.number" :value="item.number"></el-option>
            </el-select>
          </el-form-item>
          <div class="glyph-icon icon-shexiangtou fontPhotoC"></div>
          <el-form-item class="cameraC">
            <el-select v-model="addClassRoomCondition.cameras[1].cameraNo" placeholder="请选择摄像头">
              <el-option v-for="item in cameraList" :label="item.number" :value="item.number"></el-option>
            </el-select>
          </el-form-item>
          <div class="glyph-icon icon-shexiangtou fontPhotoD"></div>
          <el-form-item class="cameraD">
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
    <el-dialog title="详情" v-model="classRoomDetail" :close-on-click-modal="false" size="full">
      <el-row v-if="classRoomDetail">
        <p class="group-title">设置围栏
          <el-button type="primary" @click="updateClassRommClick" class="right mt10">&nbsp;修改&nbsp;</el-button>
        </p>
        <el-row>
          <div id="mapContainer"></div>
        </el-row>
        <p class="group-title">围栏信息</p>
        <el-form :model="classRoomDetailCondition">
          <el-row>
            <el-col :span="8">
              <label>名称：{{classRoomDetailCondition.name}}</label>
            </el-col>
            <el-col :span="8">
              <label>面积(平方米)：{{classRoomDetailCondition.area}}</label>
            </el-col>
            <el-col :span="8">
              <label>容纳人数：{{classRoomDetailCondition.galleryful}}</label>
            </el-col>
          </el-row>
          <el-row>
            <label>地址：{{classRoomDetailCondition.address}}</label>
          </el-row>
          <el-row>
            <label>设备列表：{{classRoomDetailCondition.deviceNo}}</label>
          </el-row>
          <el-row class="photo">
            <div class="glyph-icon icon-shexiangtou fontPhotoA"></div>
            <el-form-item class="cameraA">
              <label>摄像头A：{{classRoomDetailCondition.cameraA}}</label>
            </el-form-item>
            <div class="glyph-icon icon-shexiangtou fontPhotoB"></div>
            <el-form-item class="cameraB">
              <label>摄像头D：{{classRoomDetailCondition.cameraD}}</label>
            </el-form-item>
            <div class="glyph-icon icon-shexiangtou fontPhotoC"></div>
            <el-form-item class="cameraC" style="right:30px">
              <label>摄像头B：{{classRoomDetailCondition.cameraB}}</label>
            </el-form-item>
            <div class="glyph-icon icon-shexiangtou fontPhotoD"></div>
            <el-form-item class="cameraD" style="right:30px">
              <label>摄像头C：{{classRoomDetailCondition.cameraC}}</label>
            </el-form-item>
            <img src="../../../src/assets/images/classRoom.png">
          </el-row>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="classRoomDetail = false" size="large">确定</el-button>
      </div>
    </el-dialog>
    <!--编辑理论教室-->
    <el-dialog title="编辑" v-model="updateClassRoom" :close-on-click-modal="false" size="full">
      <el-form v-if="updateClassRoom" :rules="validator" :model="updateClassRoomCondition" ref="updateClassRoomRef" :inline="true" class="demo-form-inline newSiteForm" label-width="125px">
        <p class="group-title">设置围栏</p>
        <div id="mapContainerUpdate"></div>
        <p class="group-title">围栏信息</p>
        <el-row>
          <el-form-item label="名称" prop="name">
            <el-input v-model="updateClassRoomCondition.name" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item label="面积(平方米)" prop="area">
            <el-input v-model="updateClassRoomCondition.area" placeholder="面积(平方米)"></el-input>
          </el-form-item>
          <el-form-item label="容纳人数" prop="galleryful">
            <el-input v-model="updateClassRoomCondition.galleryful" placeholder="容纳人数"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="updateClassRoomCondition.address" placeholder="地址" style="width:860px;"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="设备列表" prop="devices">
            <el-select v-model="updateClassRoomCondition.devices" multiple placeholder="请选择设备" style="width:860px;">
              <el-option v-for="item in deviceList" :label="item.number" :value="item.number"></el-option>
            </el-select>
          </el-form-item>
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
      <el-form :inline="true" class="mt20">
        <el-form-item class="normal">
          <el-date-picker align="right" type="datetime" v-model="recordCondition.gmtBegin" placeholder="选择时间日期" @change="beginDateChange">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="normal">
          <el-date-picker align="right" type="datetime" v-model="recordCondition.gmtEnd" placeholder="选择时间日期" @change="endDateChange">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input style="width:250px;" v-model="recordCondition.teacherName" icon="search" placeholder="请输入教练姓名" :on-icon-click="queryRecordList">
          </el-input>
        </el-form-item>
        <!--<el-button type="primary" @click="queryRecordList"> 查 询 </el-button>-->
      </el-form>
      <!--列表-->
      <el-table highlight-current-row :data="recordCondition.recordList" @row-click="recordRowClick">
        <el-table-column prop="teacherName" label="教练姓名"></el-table-column>
        <el-table-column prop="durationTime" label="课程时长（分钟）"></el-table-column>
        <el-table-column prop="signInNum" label="学员人数"></el-table-column>
        <el-table-column prop="gmtBegin" label="签到时间" :formatter="formatter"></el-table-column>
        <el-table-column prop="gmtEnd" label="签退时间" :formatter="formatter"></el-table-column>
        <el-table-column prop="status" label="状态" :formatter="formatter"></el-table-column>
      </el-table>
      <!--工具条-->
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="this.recordCondition.total">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="record = false" size="large">关闭</el-button>
      </div>
    </el-dialog>
    <!--培训详情页面-->
    <el-dialog title="培训记录详情" v-model="recordDetail" :close-on-click-modal="false" size="full">
      <el-row class="mb20 mt20">
        <el-radio-group v-model="paymentType">
          <el-radio-button label="基本信息"></el-radio-button>
          <el-radio-button label="过程图片"></el-radio-button>
        </el-radio-group>
      </el-row>
      <el-row v-if="paymentType==='基本信息'">
        <el-row>
          <el-col :span="4">
            <img class="photoClass" :src="recordDetailCondition.teacher.sigPhotoUrl">
          </el-col>
          <el-col :span="19">
            <el-row style="line-height:35px;border-bottom:1px solid #dfe6ec;">
              <el-col :span="7">姓名：{{recordDetailCondition.teacherObj.userName}}</el-col>
              <el-col :span="7">电话号码：{{recordDetailCondition.teacherObj.telephone}}</el-col>
              <el-col :span="5">培训时长：{{recordDetailCondition.recordObj.durationTime+'分钟'||"- -"}}</el-col>
            </el-row>
            <el-row style="line-height:35px;border-bottom:1px solid #dfe6ec;">
              <el-col :span="7">签到学员数：{{recordDetailCondition.recordObj.signInNum}}</el-col>
              <el-col :span="7">过程签到学员数：{{recordDetailCondition.recordObj.processNum}}</el-col>
              <el-col :span="5">签退学员数：{{recordDetailCondition.recordObj.signOutNum}}</el-col>
            </el-row>
            <el-row style="line-height:35px;border-bottom:1px solid #dfe6ec;">
              <el-col :span="7">签到时间：{{recordDetailCondition.teacher.signInTime===null?"":new Date(recordDetailCondition.teacher.signInTime).Format("yyyy-MM-dd HH:mm:ss")}}</el-col>
              <el-col :span="12">签退时间：{{recordDetailCondition.teacher.signOutTime!==""?new Date(recordDetailCondition.teacher.signOutTime).Format("yyyy-MM-dd HH:mm:ss"):""}}</el-col>
            </el-row>
            <el-button type="text" size="small" @click="teacherDetailClick" class="mt10">查看详情</el-button>
          </el-col>
        </el-row>
        <el-row class="mt20">
          <el-form :inline="true">
            <el-form-item>
              <el-input style="width:260px;" icon="search" placeholder="请输入学员姓名" v-model="recordDetailCondition.userName" :on-icon-click="queryStudent">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-select placeholder="请选择审核状态" v-model="recordDetailCondition.status" @change="queryStudent">
                <el-option label="成功" value="success"></el-option>
                <el-option label="失败" value="fail"></el-option>
                <el-option label="复审成功" value="review_success"></el-option>
                <el-option label="复审失败" value="review_fail"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <!--列表-->
          <el-table :data="recordDetailCondition.studentList" @row-click="detailRowClick" highlight-current-row>
            <el-table-column prop="userName" label="学员姓名"></el-table-column>
            <el-table-column prop="telephone" label="电话号码"></el-table-column>
            <el-table-column label="签到时间" width="180">
              <template scope="scope">
                {{new Date(scope.row.signs[1].gmtSign).Format("yyyy-MM-dd HH:mm:ss")}}
              </template>
            </el-table-column>
            <el-table-column label="过程签到时间" width="180">
              <template scope="scope">
                {{scope.row.signs[2]?new Date(scope.row.signs[2].gmtSign).Format("yyyy-MM-dd HH:mm:ss"):""}}
              </template>
            </el-table-column>
            <el-table-column label="签退时间" width="180">
              <template scope="scope">
                {{scope.row.signs[3]?new Date(scope.row.signs[3].gmtSign).Format("yyyy-MM-dd HH:mm:ss"):""}}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="审核结果"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
          </el-table>
          <!--工具条-->
          <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="recordDetailCondition.total">
          </el-pagination>
        </el-row>
      </el-row>
      <el-row v-if="paymentType==='过程图片'">
        <!--过程图片-->
        <el-row class="history-list">
          <div class="el-steps is-vertical" style="font-size:13px;">
            <div class="el-step is-vertical" style="min-height:260px;" v-for="item in recordDetailCondition.processInfo">
              <div class="el-step__head is-wait is-text">
                <div class="el-step__line is-vertical">
                  <i class="el-step__line-inner"></i>
                </div>
              </div>
              <div class="el-step__main">
                <div class="el-step__title is-wait" style="font-weight:normal;">
                  {{new Date(item.gmtCreate).Format("yyyy-MM-dd")}}
                  <div style="margin-top:15px;">
                    <img :src="item.signs[0].picUrl" style="width:80px;height:90px;margin-bottom:10px;" />
                    <p>{{item.userName+(item.type==="teacher"?"教练":"学员")}}</p>
                  </div>
                </div>
                <div style="position:absolute;left:110px;top:22px;width:85%;height:210px;">
                  <el-row :span="24">
                    <el-col :span="6" v-for="(sign,index) in item.signs" v-if="index>0" class="ml30">
                      <img :src="sign.picUrl" style="width:215px;height:176px;border-radius:3px;" />
                      <p class="mt10 t-center">
                        {{sign.type==="sign_in"?"学员签到":sign.type==="halfway"?"正在过程签到":"学员签退"}}
                        <span>{{new Date(sign.gmtSign).Format("HH:mm:ss")}}</span>
                        <span :class="sign.status==='success'||sign.status==='review_success'?'el-icon-check':'el-icon-close'" :style="sign.status==='success'||sign.status==='review_success'?'color:#13CE66;':'color:#FF4949;'"></span>
                      </p>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </div>
        </el-row>
        <!--工具条-->
        <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="recordDetailCondition.total">
        </el-pagination>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="recordDetail = false" size="large">关闭</el-button>
      </div>
    </el-dialog>
    <!--学员详情页面-->
    <el-dialog title="学员详情" v-model="stuDetail" :close-on-click-modal="false" size="small">
      <el-row class="mt20 mb20">
        <el-col :span="4">
          <label>教练姓名：{{recordDetailCondition.teacherObj.userName}}</label>
        </el-col>
        <el-col :span="6">
          <label>签到时间：{{new Date(recordDetailCondition.teacher.signInTime).Format("yyyy-MM-dd HH:mm:ss")}}</label>
        </el-col>
        <el-col :span="8">
          <label>签退时间：{{recordDetailCondition.teacher.signOutTime!==""?new Date(recordDetailCondition.teacher.signOutTime).Format("yyyy-MM-dd HH:mm:ss"):""}}</label>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2">
          <img v-if="recordDetailCondition.student.signs[0]" :src="recordDetailCondition.student.signs[0].picUrl" style="width:88.33px;height:90px;border-radius:3px;" />
          <p class="mt5 t-center">{{recordDetailCondition.student.userName}}</p>
        </el-col>
        <el-col :span="18">
          <el-col :span="6" v-for="(item,index) in recordDetailCondition.student.signs" v-if="index>0" class="ml30">
            <img :src="item.picUrl" style="width:202px;height:176px;border-radius:3px;">
            <p class="mt10 t-center">
              {{item.type==="sign_in"?"学员签到":item.type==="halfway"?"正在过程签到":"学员签退"}}
              <span>{{new Date(item.gmtSign).Format("HH:mm:ss")}}</span>
              <span :class="item.status==='success'||item.status==='review_success'?'el-icon-check':'el-icon-close'" :style="item.status==='success'||item.status==='review_success'?'color:#13CE66;':'color:#FF4949;'"></span>
            </p>
          </el-col>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="stuDetail = false" size="large">关闭</el-button>
      </div>
    </el-dialog>
    <!--教师详情页面-->
    <el-dialog title="教练详情" v-model="teacherDetail" :close-on-click-modal="false" size="small">
      <el-row class="mt30">
        <el-col :span="2">
          <img :src="recordDetailCondition.teacher.sigPhotoUrl" style="width:88.33px;height:90px;border-radius:3px;" />
          <p class="mt5 t-center">{{recordDetailCondition.teacherObj.userName}}</p>
        </el-col>
        <el-col :span="18">
          <el-col :span="6" class="ml30">
            <img :src="recordDetailCondition.teacher.sigInUrl" style="width:202px;height:176px;border-radius:3px;">
            <p class="mt10 t-center">
              教练签到
              <span>{{new Date(recordDetailCondition.teacher.signInTime).Format("HH:mm:ss")}}</span>
              <span :class="recordDetailCondition.teacher.inStatus==='success'||recordDetailCondition.teacher.inStatus==='review_success'?'el-icon-check':'el-icon-close'" :style="recordDetailCondition.teacher.inStatus==='success'||recordDetailCondition.teacher.inStatus==='review_success'?'color:#13CE66;':'color:#FF4949;'"></span>
            </p>
          </el-col>
          <el-col :span="6" class="ml30" v-if="recordDetailCondition.teacher.signOutTime">
            <img :src="recordDetailCondition.teacher.sigOutUrl" style="width:202px;height:176px;border-radius:3px;">
            <p class="mt10 t-center">
              教练签退
              <span>{{new Date(recordDetailCondition.teacher.signOutTime).Format("HH:mm:ss")}}</span>
              <span :class="recordDetailCondition.teacher.outStatus==='success'||recordDetailCondition.teacher.outStatus==='review_success'?'el-icon-check':'el-icon-close'" :style="recordDetailCondition.teacher.outStatus==='success'||recordDetailCondition.teacher.outStatus==='review_success'?'color:#13CE66;':'color:#FF4949;'"></span>
            </p>
          </el-col>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="teacherDetail = false" size="large">关闭</el-button>
      </div>
    </el-dialog>
    <!--培训监控页面-->
    <el-dialog title="监控详情" v-model="monitor" :close-on-click-modal="false" size="full">
      <el-row class="mt20 mb20">
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
        <el-table :data="recordDetailCondition.studentList">
          <el-table-column prop="userName" label="学员姓名"></el-table-column>
          <el-table-column prop="idcard" label="身份证"></el-table-column>
          <el-table-column prop="signInTime" label="签到时间"></el-table-column>
        </el-table>
        <!--工具条-->
        <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pageSize" :total="recordDetailCondition.total">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="monitor = false" size="large">关闭</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
videojs.options.flash.swf = "video-js.swf";
</script>

<script>
var amaps;
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
          signs: []
          // sigPhotoUrl: "", //证件照片
          // signInTime: "", //签到时间
          // sigInUrl: "",//签到照片
          // inStatus: "",
          // halfwayTime: "",
          // halfwayUrl: "",
          // halfwayStatus: "",
          // signOutTime: "",//签退时间
          // sigOutUrl: "",//签退照片
          // outStatus: "",
        },
        processInfo: []
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
      }
    }
  },
  methods: {
    formatter(row, column) {
      if (column.property === "status") {
        return global.enums.record.status[row.status];
      }
      else if (column.property === "gmtBegin") {
        return row.gmtBegin === null ? "" : new Date(row.gmtBegin).Format("yyyy-MM-dd HH:mm:ss");
      }
      else if (column.property === "gmtEnd") {
        return row.gmtEnd === null ? "" : new Date(row.gmtEnd).Format("yyyy-MM-dd HH:mm:ss");
      }
      else if (column.property === "signInTime") {
        return row.signInTime === null ? "" : new Date(row.signInTime).Format("yyyy-MM-dd HH:mm:ss");
      }
      else if (column.property === "halfwayTime") {
        return row.halfwayTime === null ? "" : new Date(row.halfwayTime).Format("yyyy-MM-dd HH:mm:ss");
      }
      else if (column.property === "signOutTime") {
        return row.signOutTime === null ? "" : new Date(row.signOutTime).Format("yyyy-MM-dd HH:mm:ss");
      }
    },
    //查询教室列表
    queryClassRoomList() {
      let args = [this.schoolCode, this.schoolName, this.name, this.address, this.currentPage, this.pageSize];
      request.teaching.classRoom.query.classRoomList(args).then((res) => {
        if (res.success === true) {
          this.total = res.object.num;
          this.classRoomList = res.object.list;
          for (let i = 0; i < this.classRoomList.length; i++) {
            this.classRoomList[i].gmtCreate = new Date(this.classRoomList[i].gmtCreate).Format("yyyy-MM-dd HH:mm:ss");
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
        }
      });
    },
    //设备列表下拉框
    queryDevice() {
      let args = [this.schoolCode];
      request.teaching.classRoom.query.devices(args).then((res) => {
        if (res.success === true) {
          this.deviceList = [];
          this.cameraList = [];
          this.deviceAllList = res.object.list;
          for (let i = 0; i < this.deviceAllList.length; i++) {
            let item = {};
            this.deviceAllList[i].type = global.enums.record.status[this.deviceAllList[i].type];
            item.model = this.deviceAllList[i].model;
            item.number = this.deviceAllList[i].number;
            if (this.deviceAllList[i].type == '设备') {
              this.deviceList.push(item);
            } else if (this.deviceAllList[i].type == '摄像头') {
              this.cameraList.push(item);
            }
          }
        }
      });
    },
    //查询培训记录列表
    queryRecordList() {
      let args = [this.recordCondition.classroomId, this.recordCondition.gmtBegin, this.recordCondition.gmtEnd, this.recordCondition.teacherName, this.recordCondition.currentPage, this.pageSize];
      request.teaching.classRoom.query.recordList(args).then((res) => {
        if (res.success === true) {
          this.recordCondition.total = res.object.num;
          this.recordCondition.recordList = res.object.list;
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
      this.recordDetailCondition.idcard, this.recordDetailCondition.status, this.recordDetailCondition.currentPage, this.pageSize];
      request.teaching.classRoom.query.student(args).then((res) => {
        if (res.success === true) {
          let data = res.object.list;
          console.log(data);
          this.recordDetailCondition.studentList = [];
          this.recordDetailCondition.processInfo = [];
          this.recordDetailCondition.total = res.object.num;
          for (let item in data) {
            if (data[item].type === "student") {
              this.recordDetailCondition.studentList.push({
                userName: data[item].userName,
                telephone: data[item].telephone,
                status: global.enums.record.status[data[item].status],
                signs: data[item].signs,
                remark: data[item].remark,
                type: data[item].type,
                gmtCreate: data[item].gmtCreate
              });
            }
            this.recordDetailCondition.processInfo.push({
              userName: data[item].userName,
              telephone: data[item].telephone,
              status: global.enums.record.status[data[item].status],
              signs: data[item].signs,
              remark: data[item].remark,
              type: data[item].type,
              gmtCreate: data[item].gmtCreate
            });
          }
        }
      });
    },
    //查询培训记录详情
    queryRecordDetail() {
      let args = [this.recordDetailCondition.recordId];
      request.teaching.classRoom.query.queryRecordDetail(args).then((res) => {
        if (res.success === true) {
          //console.log(res.object);
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
            if (!polygonArr.length) {
              this.$message.info("请在地图上画出围栏区域");
              return;
            }
            this.addClassRoomCondition.pens = [];
            var path = polygonArr[0].G.path;
            for (var item in path) {
              this.addClassRoomCondition.pens.push({
                longitude: path[item].lng,
                latitude: path[item].lat
              });
            }
            let k = 0;
            let cameras = this.addClassRoomCondition.cameras;
            let selectCameras = { cameras: [] };
            for (let item in cameras) {
              if (cameras[item].cameraNo) {
                k++;
                selectCameras.cameras.push({
                  location: cameras[item].location,
                  cameraNo: cameras[item].cameraNo
                });
              }
            }
            if (k === 0) {
              this.$message.info("请至少选择一个摄像头");
              return;
            }
            console.log(JSON.stringify(selectCameras.cameras));
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
            args.cameras = selectCameras.cameras;
            args.pens = this.addClassRoomCondition.pens;
            request.teaching.classRoom.save.classRoom(args).then((res) => {
              if (res.success === true) {
                this.queryClassRoomList();
                this.addClassRoom = false;
                this.$message({ message: "新增教室成功", type: "success" });
              }
              else {
                this.$message.error("新增教室失败，原因：" + res.message);
              }
            });
          }
        });
      } else if (name == 'updateClassRoom') {
        this.$refs["updateClassRoomRef"].validate((valid) => {
          if (valid) {
            if (!polygonArr.length) {
              this.$message.info("请在地图上画出围栏区域");
              return;
            }
            this.updateClassRoomCondition.pens = [];
            if (activePolygon !== null) {
              var path = activePolygon.G.path;
              for (var item in path) {
                this.updateClassRoomCondition.pens.push({
                  longitude: path[item].lng,
                  latitude: path[item].lat
                });
              }
            }
            else {
              var path = polygonArr[0].G.path;
              for (var item in path) {
                this.updateClassRoomCondition.pens.push({
                  longitude: path[item].lng,
                  latitude: path[item].lat
                });
              }
            }
            let k = 0;
            let cameras = this.updateClassRoomCondition.cameras;
            let selectCameras = { cameras: [] };
            for (let item in cameras) {
              if (cameras[item].cameraNo) {
                k++;
                selectCameras.cameras.push({
                  location: cameras[item].location,
                  cameraNo: cameras[item].cameraNo
                });
              }
            }
            if (k === 0) {
              this.$message.info("请至少选择一个摄像头");
              return;
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
            args.cameras = selectCameras.cameras;
            args.pens = this.updateClassRoomCondition.pens;
            request.teaching.classRoom.save.updateClassRoom(args).then((res) => {
              if (res.success === true) {
                this.queryClassRoomList();
                this.updateClassRoom = false;
                this.$message.success({ message: "编辑教室成功" });
              }
              else {
                this.$message.error("编辑教室失败，原因：" + res.message);
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
      }
      else if (this.recordDetail == true) {
        this.recordDetailCondition.currentPage = val;
        this.queryStudent();
      }
      else {
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
    //点击新增理论教室按钮
    addClassRommClick() {
      polygonArr = [];
      this.queryDevice();
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
      this.addClassRoom = true;
      this.initMap(() => {
        this.initData(true);
      }, "mapContainer");
    },
    //设备列表行点击方法
    rowClick(row, evt, column) {
      this.classRoomDetail = true;
      this.initMap(() => {
        this.initData(false);
        setupInitialData(row.pens, false);
        closeAllEditor();
      }, "mapContainer");
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
      console.log(row);
      this.recordDetailCondition.student.userName = row.userName;
      this.recordDetailCondition.student.signs = row.signs;
      this.stuDetail = true;//学员详情弹窗
    },
    //查看教练详情点击按钮
    teacherDetailClick() {
      this.queryTeacher();
      this.teacherDetail = true;
    },
    //点击编辑理论教室按钮
    updateClassRommClick() {
      this.classRoomDetail = false;
      this.updateClassRoom = true;
      let row = this.classRoomDetailCondition;
      this.initMap(() => {
        this.initData(true);
        setupInitialData(row.pens, true);
      }, "mapContainerUpdate");
      this.queryDevice();
      this.updateClassRoomCondition.id = row.id;
      this.updateClassRoomCondition.name = row.name;
      this.updateClassRoomCondition.address = row.address;
      this.updateClassRoomCondition.area = row.area + "";
      this.updateClassRoomCondition.galleryful = row.galleryful + "";
      this.updateClassRoomCondition.devices = row.devices;
      this.updateClassRoomCondition.cameras[0].cameraNo = row.cameraA;
      this.updateClassRoomCondition.cameras[1].cameraNo = row.cameraB;
      this.updateClassRoomCondition.cameras[2].cameraNo = row.cameraC;
      this.updateClassRoomCondition.cameras[3].cameraNo = row.cameraD;
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
      this.recordDetailCondition.studentList = [];
      this.monitorCondition.classRoomId = row.id;
      this.queryMonitor(() => {
        this.recordDetailCondition.recordId = this.monitorCondition.monitorObj.id;
        this.queryStudent();
      });
    },
    initMap(callback, mapObj) {
      global.printLog(window._amapInit);
      var interval = setInterval(() => {
        if (window._amapInit) {
          clearInterval(interval);
          this.$message.success({ message: "地图已加载完成^_^" });
          setTimeout(() => {
            amaps = new AMap.Map(mapObj, {
              resizeEnable: true,
              zoom: 17,
              center: [global.map.center.lat, global.map.center.lng]
            });
            amaps.on("complete", () => {
              callback();
            });
          }, 50);
        }
        else {
          global.printLog("地图拼命加载中，" + interval);
        }
      }, 50);
    },
    //初始化数据
    initData(draw) {
      var editor = {};
      lnglatInArea = false;
      setTimeout(() => {
        if (draw) {
          mouseTool = new AMap.MouseTool(amaps);
          AMap.event.addListener(amaps, "click", (e) => {
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
          amaps.plugin(["AMap.MouseTool"], () => {
            mouseTool.polygon({
              strokeColor: "#4A90E2",
              strokeOpacity: 1,
              fillColor: "#E0E3E5",
              fillOpacity: 0.5,
              strokeStyle: "dashed"
            });
            AMap.event.addListener(mouseTool, "draw", (mt) => {
              mouseTool.close();
              var polygon = mt.obj;
              polygonArr.push(polygon);
              var editor = new AMap.PolyEditor(amaps, polygon);
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
      }, 1000);
    }
  },
  mounted() {
    this.queryClassRoomList();
  },
  //页面激活之后
  activated() {
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
      amaps.remove(makerShow[m]);
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

function setupInitialData(initPolygonData, draw) {
  // console.log(map);
  // console.log(initPolygonData);
  lnglatInArea = true;
  if (initPolygonData.length == 0) {
    mouseTool.polygon();
    return
  }
  var polygonDataArr = [];
  amaps.setCenter(new AMap.LngLat(initPolygonData[0].longitude, initPolygonData[0].latitude));
  for (var i = 0; i < initPolygonData.length; i++) {
    var polygonData = initPolygonData[i];
    var point = new AMap.LngLat(polygonData.longitude, polygonData.latitude);
    polygonDataArr.push(point);
  }
  var polygon = new AMap.Polygon({
    map: amaps,
    strokeColor: "#0e81e5",
    fillColor: "#0e81e5",
    strokeStyle: "solid",
    fillOpacity: 0.5,
    strokeOpacity: 1,
    path: polygonDataArr
  });
  var editor = new AMap.PolyEditor(amaps, polygon);
  if (draw) {
    addDeleteDelegate(polygon);
  }
  polygon.setExtData({
    editor: editor
  });
  polygonArr.push(polygon);
  amaps.setFitView();
}

</script> 

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
    right: 5px;
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
    right: 5px;
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