//let base = process.env.API_ROOT;
let base = window.interface;
import axios from "axios";
let dtFmt = "yyyy-MM-dd HH:mm:ss" + Math.random();

//请求拦截，添加header鉴权
axios.interceptors.request.use(
    config => {
        config.headers.Authorization = sessionStorage.getItem("user") === null ? "" : JSON.parse(sessionStorage.getItem("user")).authorization;
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

export const request = {
    baseUrl: base,
    //登录
    login: params => { return axios.post(`${base}/sc/admin/login`, params); },
    //获取所有权限（By驾校）
    getFunctions: params => { return axios.get(`${base}/sc/admin/getFunction?schoolCode=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },

    // 总览
    overview: {
        getTopData: params => { return axios.get(`${base}/sc/overview/getOverView?schoolCode=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); }
    },
    /* basic-基础管理 */
    basic: {
        student: {
            query: {
                list: params => { return axios.get(`${base}/sc/student/queryStudentList?schoolCode=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&keyWord=" + (params[3] !== "" ? encodeURI(params[3]) : "") + "&carType=" + params[4] + (params[5] !== "" ? "&isAppointment=" + params[5] : "") + (params[6] !== "" ? "&queryType=" + params[6] : "") + "&inSchool=true" + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                detailById: params => { return axios.get(`${base}/sc/student/queryStudentDetail?studentId=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                photo: params => { return axios.get(`${base}/sc/student/queryStudentPhoto?studentId=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                printForm: params => { return axios.get(`${base}/sc/student/queryPrintApplicationForm?studentId=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                classRecordList: params => { return axios.get(`${base}/sc/student/queryClassRecordList?studentId=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                timeTraceInfo: params => { return axios.get(`${base}/sc/student/queryTimeTraceInfo?studentId=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                stageTrainRecord: params => { return axios.get(`${base}/sc/student/queryStageTrainRecord?studentId=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                teachLog: params => { return axios.get(`${base}/sc/student/queryTeachLog?studentId=` + params[0] + "&stage=" + params[1] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                graduationInfo: params => { return axios.get(`${base}/sc/student/queryGraduationInfo?studentId=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                bindCoach: params => { return axios.get(`${base}/sc/student/queryTeacherDicInfo?schoolCode=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); }
            },
            create: {
                photo: params => { return axios.post(`${base}/sc/student/uploadStudentPhoto`, params).then(res => res.data); },
                student: params => { return axios.post(`${base}/sc/student/addStudent`, params).then(res => res.data); },
                record: params => { return axios.post(`${base}/sc/student/studentRecord`, params).then(res => res.data); },
                report: params => { return axios.post(`${base}/sc/student/reportedStudent`, params).then(res => res.data); },
                graduation: {
                    examine: params => { return axios.post(`${base}/sc/student/graduationExamine`, params).then(res => res.data); },
                    record: params => { return axios.post(`${base}/sc/student/graduationRecord`, params).then(res => res.data); }
                },
            },
            audit: params => { return axios.post(`${base}/sc/student/auditStudent`, params).then(res => res.data); },
            update: params => { return axios.put(`${base}/sc/student/updateStudent`, params).then(res => res.data); },
            save: params => { return axios.post(`${base}/sc/student/saveStudentCollectPhoto`, params).then(res => res.data); }
        },
        vehicle: {
            queryList: params => { return axios.get(`${base}/sc/car/query?schoolCode=` + params[0] + "&gmtBegin=" + params[1] + "&gmtEnd=" + params[2] + "&currentPage=" + params[3] + "&pageSize=" + params[4] + "&cardNo=" + (params[5] !== "" ? encodeURI(params[5]) : "") + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            queryDetail: params => { return axios.get(`${base}/sc/car?id=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            queryColors: params => { return axios.get(`${base}/sc/car/colors?dt=` + new Date().Format(dtFmt)).then(res => res.data); },
            queryBrands: params => { return axios.get(`${base}/sc/car/brands?id=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            create: params => { return axios.post(`${base}/sc/car`, params).then(res => res.data); },
            edit: params => { return axios.put(`${base}/sc/car`, params).then(res => res.data); },
            report: params => { return axios.put(`${base}/sc/car/report`, params).then(res => res.data); },
            delete: params => { return axios.delete(`${base}/sc/car?id=` + params).then(res => res.data); }
        },
        coach: {
            query: {
                list: params => { return axios.get(`${base}/sc/teacher/queryTeacherList?schoolCode=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&keyWord=" + (params[3] !== "" ? encodeURI(params[3]) : "") + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                detail: params => { return axios.get(`${base}/sc/teacher/queryTeacherDetailInfo?teacherId=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            },
            create: {
                coach: params => { return axios.post(`${base}/sc/teacher/addTeacher`, params).then(res => res.data); },
                photo: {
                    coach: params => { return axios.post(`${base}/sc/teacher/uploadTeacherPhoto`, params).then(res => res.data); }
                },
                record: params => { return axios.post(`${base}/sc/teacher/teacherRecord`, params).then(res => res.data); },
                teacherLeave: params => { return axios.post(`${base}/sc/teacher/addTeacherLeave`, params).then(res => res.data); }
            },
            update: params => { return axios.put(`${base}/sc/teacher/updateTeacher`, params).then(res => res.data); },
            delete: params => { return axios.delete(`${base}/sc/teacher/deleteTeacher?teacherId=` + params).then(res => res.data); }
        },
        securityGuard: {
            query: {
                list: params => { return axios.get(`${base}/sc/teacher/querySecurityGuardList?schoolCode=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&keyWord=" + (params[3] !== "" ? encodeURI(params[3]) : "") + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                detail: params => { return axios.get(`${base}/sc/teacher/querySecurityGuardDetailInfo?teacherId=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            },
            create: {
                photo: params => { return axios.post(`${base}/sc/teacher/uploadSecurityGuardPhoto`, params).then(res => res.data); },
                securityGuard: params => { return axios.post(`${base}/sc/teacher/addSecurityGuard`, params).then(res => res.data); },
                record: params => { return axios.post(`${base}/sc/teacher/securityGuardRecord`, params).then(res => res.data); },
            },
            update: params => { return axios.put(`${base}/sc/teacher/updateSecurityGuard`, params).then(res => res.data); },
            delete: params => { return axios.delete(`${base}/sc/teacher/deleteSecurityGuard?teacherId=` + params).then(res => res.data); }
        },
        examiner: {
            query: {
                list: params => { return axios.get(`${base}/sc/teacher/queryExaminerList?schoolCode=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&keyWord=" + (params[3] !== "" ? encodeURI(params[3]) : "") + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                detail: params => { return axios.get(`${base}/sc/teacher/queryExaminerDetailInfo?teacherId=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            },
            create: {
                photo: params => { return axios.post(`${base}/sc/teacher/uploadExaminerPhoto`, params).then(res => res.data); },
                examiner: params => { return axios.post(`${base}/sc/teacher/addExaminer`, params).then(res => res.data); },
                record: params => { return axios.post(`${base}/sc/teacher/examinerRecord`, params).then(res => res.data); },
            },
            update: params => { return axios.put(`${base}/sc/teacher/updateExaminer`, params).then(res => res.data); },
            delete: params => { return axios.delete(`${base}/sc/teacher/deleteExaminer?teacherId=` + params).then(res => res.data); }
        },
        exam: {
            query: {
                list: params => { return axios.get(`${base}/sc/exam/query?schoolCode=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&keyword=" + (params[3] !== "" ? encodeURI(params[3]) : "") + "&gmtExam=" + params[4] + "&register=" + params[5] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            },
            create: {
                exam: params => { return axios.post(`${base}/sc/exam`, params).then(res => res.data); },
                examResuls: params => { return axios.put(`${base}/sc/exam`, params).then(res => res.data); }
            }
        }
    },
    //systemSettings-系统设置
    systemSettings: {
        //用户模块
        users: {
            //查询用户（By驾校）
            queryInfo: params => { return axios.get(`${base}/sc/admin/getUsers?schoolCode=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            create: params => { return axios.post(`${base}/sc/admin/createUser`, params).then(res => res.data); },
            del: params => { return axios.delete(`${base}/sc/admin/deleteUser?userId=` + params).then(res => res.data); },
            checkPhone: params => { return axios.get(`${base}/sc/admin/checkPhoneRegister?userName=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            //功能模块
            functions: {
                //查询功能（By驾校）
                query: params => { return axios.get(`${base}/sc/admin/getUserAuthCode?userId=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                //编辑权限（By用户）
                edit: params => { return axios.post(`${base}/sc/admin/updateUser`, params).then(res => res.data); },
            },
            //修改支付密码（By用户）
            updatePayPassword: params => { return axios.post(`${base}/sc/admin/updatePayPassword`, params).then(res => res.data); },
        },
        //分校模块
        branchSchool: {
            query: {
                list: params => { return axios.get(`${base}/sc/school/getBranchSchool?schoolCode=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            },
            create: {
                school: params => { return axios.post(`${base}/sc/school/addBranchSchool`, params).then(res => res.data); },
                financialChapter: params => { return axios.put(`${base}/sc/school/updateFinancialChapter`, params).then(res => res.data); }
            }
        }
    },
    //获取分校列表
    getBranchSchool: params => { return axios.get(`${base}/sc/school/getBranchSchool?schoolCode=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
    //新增分校
    addBranchSchool: params => { return axios.post(`${base}/sc/school/addBranchSchool`, params).then(res => res.data); },
    //appointment-预约管理
    appointment: {
        //模式
        model: {
            query: {
                list: params => { return axios.get(`${base}/sc/appointmentModel/query?schoolCode=` + params[2] + "&currentPage=" + params[0] + "&pageSize=" + params[1] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                detail: params => { return axios.get(`${base}/sc/appointmentModel?modelId=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); }
            },
            create: params => { return axios.post(`${base}/sc/appointmentModel`, params).then(res => res.data); },
            update: params => { return axios.put(`${base}/sc/appointmentModel`, params).then(res => res.data); },
            delete: params => { return axios.delete(`${base}/sc/appointmentModel?modelId=` + params).then(res => res.data); },
        },
        //参数设置
        para: {
            query: params => { return axios.get(`${base}/sc/appointmentschool/get?schoolCode=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            update: params => { return axios.put(`${base}/sc/appointmentschool/update`, params).then(res => res.data); }
        },
        //线下交易记录
        offlineorder: {
            query: params => { return axios.get(`${base}/sc/offlineorder/getBaseCostDetail?schoolCode=` + params[0] + "&operateType=" + params[1] + "&studentPhone=" + (params[2] !== "" ? encodeURI(params[2]) : "") + "&currentPage=" + params[3] + "&pageSize=" + params[4] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
        },
        //在线支付订单
        onlineorder: {
            query: params => { return axios.get(`${base}/sc/school/getOnlineOrders?schoolCode=` + params[0] + "&businessType=" + params[1] + "&ownerMobile=" + (params[2] !== "" ? encodeURI(params[2]) : "") + "&currentPage=" + params[3] + "&pageSize=" + params[4] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
        },
        //充值
        recharge: {
            queryStudent: params => { return axios.get(`${base}/sc/offlineorder/getBaseCostDetailStudentInfo?schoolCode=` + params[0] + "&studentPhone=" + params[1] + "&currentPage=" + params[2] + "&pageSize=" + params[3] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            create: params => { return axios.post(`${base}/sc/offlineorder/addBaseCostDetail`, params).then(res => res.data); },
            checkPayPassword: params => { return axios.post(`${base}/sc/offlineorder/checkPayPassword`, params).then(res => res.data); }
        },
        query: {
            recording: params => { return axios.get(`${base}/sc/appointmentrecord/queryAppointmentRecordList?keyWord=` + (params[0] !== "" ? encodeURI(params[0]) : "") + "&schoolCode=" + params[1] + "&currentPage=" + params[2] + "&pageSize=" + params[3] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            detail: params => { return axios.get(`${base}/sc/appointmentrecord/queryAppointmentRecordDetail?appointmentId=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            model: params => { return axios.get(`${base}/sc/appointmentModel/queryAll?schoolCode=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            selectInfoWall: params => { return axios.get(`${base}/sc/appointmentinfo/selectInfoWall?schoolCode=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&classDate=" + params[3] + "&modelId=" + (params[4] === "" ? 0 : params[4]) + "&stage=" + params[5] + "&keyword=" + (params[6] !== "" ? encodeURI(params[6]) : "") + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            wallQueryStudent: params => { return axios.get(`${base}/sc/appointmentinfo/wallQueryStudent?schoolCode=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&teacherId=" + params[3] + "&keyword=" + (params[4] !== "" ? encodeURI(params[4]) : "") + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            studentQueryInfo: params => { return axios.get(`${base}/sc/appointmentinfo/studentQueryInfo?schoolCode=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&studentId=" + params[3] + "&classDate=" + params[4] + "&stage=" + params[5] + "&keyword=" + (params[6] !== "" ? encodeURI(params[6]) : "") + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); }
        },
        create: {
            addBaseEvaluate: params => { return axios.post(`${base}/sc/appointmentrecord/addBaseEvaluate`, params).then(res => res.data); },
            appointmentinfo: params => { return axios.post(`${base}/sc/appointmentinfo`, params).then(res => res.data); },
        },
        cancel: params => { return axios.put(`${base}/sc/appointmentinfo`, params).then(res => res.data); },
        classes: {
            query: {
                classesRecordWall: params => { return axios.get(`${base}/sc/teacherClass/queryCLassRecord?currentPage=` + params[0] + "&pageSize=" + params[1] + "&schoolCode=" + params[2] + "&classDate=" + params[3] + "&modelId=" + params[4] + "&stage=" + params[5] + "&keyword=" + (params[6] !== "" ? encodeURI(params[6]) : "") + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                classesWall: params => { return axios.get(`${base}/sc/teacherClass/queryClassWall?currentPage=` + params[0] + "&pageSize=" + params[1] + "&schoolCode=" + params[2] + "&classDate=" + params[3] + "&modelId=" + params[4] + "&stage=" + params[5] + "&keyword=" + (params[6] !== "" ? encodeURI(params[6]) : "") + (typeof (params[7]) !== "undefined" ? "&teacherId=" + params[7] : "") + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            },
            checking: params => { return axios.put(`${base}/sc/teacherClass`, params).then(res => res.data); },
            create: params => { return axios.post(`${base}/sc/teacherClass`, params).then(res => res.data); },
        }
    },
    //计时培训
    timeTraining: {
        //场地
        site: {
            //查询
            query: params => { return axios.get(`${base}/sc/teaching/region/query?schoolCode=` + params[0] + "&gmtBegin=" + params[1] + "&gmtEnd=" + params[2] + "&currentPage=" + params[3] + "&pageSize=" + params[4] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            //根据ID查询详情
            queryById: params => { return axios.get(`${base}/sc/teaching/region?id=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            //新建
            create: params => { return axios.post(`${base}/sc/teaching/region`, params).then(res => res.data); },
            //编辑
            edit: params => { return axios.put(`${base}/sc/teaching/region`, params).then(res => res.data); },
            //删除
            delete: params => { return axios.delete(`${base}/sc/teaching/region?id=` + params).then(res => res.data); },
            //审核
            review: params => { return axios.put(`${base}/sc/teaching/region/submit?id=` + params).then(res => res.data); }
        },
        timeAudit: {
            query: {
                list: params => { return axios.get(`${base}/sc/classrecord/getClassRecordList?schoolCode=` + params[0] + (params[1] === "" || params[1] === "0" ? "" : "&stage=" + params[1]) + (params[2] === "" ? "" : "&beginTime=" + params[2]) + (params[3] === "" ? "" : "&endTime=" + params[3]) + (params[4] !== "" ? "&keyWord=" + encodeURI(params[4]) : "") + "&currentPage=" + params[5] + "&pageSize=" + params[6] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                detail: params => { return axios.get(`${base}/sc/classrecord/getClassRecordDetail?classRecordId=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                classRecordMin: params => { return axios.get(`${base}/sc/classrecord/getClassRecordMin?schoolCode=` + params[0] + "&sim=" + params[1] + "&classId=" + params[2] + "&beginTime=" + params[3] + "&endTime=" + params[4] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                classRecordPhoto: params => { return axios.get(`${base}/sc/classrecord/getClassRecordPhoto?schoolCode=` + params[0] + "&sim=" + params[1] + "&classId=" + params[2] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                classRecordGPS: params => { return axios.get(`${base}/sc/classrecord/getClassRecordGPS?schoolCode=` + params[0] + "&sim=" + params[1] + "&beginTime=" + params[2] + "&endTime=" + params[3] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); }
            }
        },
        stageRecordAudit: {
            query: {
                pendingReportRecordList: params => { return axios.get(`${base}/sc/stagerecord/getPendingReportRecordList?schoolCode=` + params[0] + "&stage=" + params[1] + "&keyWord=" + (params[2] !== "" ? encodeURI(params[2]) : "") + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                stageRecordList: params => { return axios.get(`${base}/sc/stagerecord/getStageRecordList?schoolCode=` + params[0] + "&stage=" + params[1] + "&processState=" + params[2] + "&keyWord=" + (params[3] !== "" ? encodeURI(params[3]) : "") + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                reportedRecordList: params => { return axios.get(`${base}/sc/stagerecord/getReportedRecordList?schoolCode=` + params[0] + "&stage=" + params[1] + "&keyWord=" + (params[2] !== "" ? encodeURI(params[2]) : "") + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); }
            },
            create: {
                examinerSign: params => { return axios.post(`${base}/sc/stagerecord/examinerSign`, params).then(res => res.data); },
                studentSign: params => { return axios.post(`${base}/sc/stagerecord/studentSign`, params).then(res => res.data); },
                teacherSign: params => { return axios.post(`${base}/sc/stagerecord/teacherSign`, params).then(res => res.data); },
                schoolSign: params => { return axios.post(`${base}/sc/stagerecord/schoolSign`, params).then(res => res.data); },
                stagePerform: params => { return axios.post(`${base}/sc/stagerecord/stagePerform`, params).then(res => res.data); }
            }
        },
        monitor: {
            query: {
                monitorCarList: params => { return axios.get(`${base}/sc/monitor/getMonitorCarList?schoolCode=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                monitorInfoBySim: params => { return axios.get(`${base}/sc/monitor/getMonitorInfoBySim?schoolCode=` + params[0] + "&simList=" + params[1] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                capturePhoto: params => { return axios.get(`${base}/sc/monitor/getCapturePhoto?schoolCode=` + params[0] + "&sim=" + params[1] + "&deviceId=" + params[2] + "&deviceUnifyCode=" + params[3] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                historyGPS: params => { return axios.get(`${base}/sc/monitor/getHistoryGPS?schoolCode=` + params[0] + "&sim=" + params[1] + "&beginTime=" + params[2] + "&endTime=" + params[3] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                historyPhoto: params => { return axios.get(`${base}/sc/monitor/getHistoryPhoto?schoolCode=` + params[0] + "&sim=" + params[1] + "&beginTime=" + params[2] + "&endTime=" + params[3] + "&currentPage=" + params[4] + "&pageSize=" + params[5] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            },
        },
        //获取培训部分
        queryStage: params => { return axios.get(`${base}/sc/teaching/region/stage`, params).then(res => res.data); }
    },
    //内部管理
    backstageManagement: {
        department: {
            queryDetailById: params => { return axios.get(`${base}/sc/department/query?deptId=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            query: params => { return axios.get(`${base}/sc/department/queryTree?deptId=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            create: params => { return axios.post(`${base}/sc/department`, params).then(res => res.data); }
        },
        finance: {
            query: {
                PayType: params => { return axios.get(`${base}/sc/finance/selectPayType?schoolCode=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                ReceiptsType: params => { return axios.get(`${base}/sc/finance/selectReceiptsType?schoolCode=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                Account: params => { return axios.get(`${base}/sc/finance/selectAccount?schoolCode=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                DepartmentCost: params => { return axios.get(`${base}/sc/finance/queryDepartmentCost?deptId=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                Receipt: params => { return axios.get(`${base}/sc/finance/queryFinance?currentPage=` + params[0] + "&pageSize=" + params[1] + "&schoolCode=" + params[2] + "&deptId=" + params[3] + (params[4] !== "" ? "&beginTime=" + params[4] : "") + (params[5] !== "" ? "&endTime=" + params[5] : "") + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                RecStudentAll: params => { return axios.get(`${base}/sc/finance/getRecStudentAll?deptId=` + params[0] + "&schoolCode=" + params[1] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                DeptCost: params => { return axios.get(`${base}/sc/finance/getDeptCost?deptId=` + params[0] + "&schoolCode=" + params[1] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                RecDetail: params => { return axios.get(`${base}/sc/finance/selectRecDetail?currentPage=` + params[0] + "&pageSize=" + params[1] + "&recId=" + params[2] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); }
            },
            create: {
                PayType: params => { return axios.post(`${base}/sc/finance/insertPayType`, params).then(res => res.data); },
                ReceiptsType: params => { return axios.post(`${base}/sc/finance/insertReceiptsType`, params).then(res => res.data); },
                Account: params => { return axios.post(`${base}/sc/finance/insertAccount`, params).then(res => res.data); },
                DepartmentCost: params => { return axios.post(`${base}/sc/finance/insertDepartmentCost`, params).then(res => res.data); },
                Receipt: params => { return axios.post(`${base}/sc/finance/insert`, params).then(res => res.data); }
            },
            delete: {
                PayType: params => { return axios.delete(`${base}/sc/finance/deletePayType?payTypeId=` + params).then(res => res.data); },
                ReceiptsType: params => { return axios.delete(`${base}/sc/finance/deleteReceiptsType?recTypeId=` + params).then(res => res.data); },
                Account: params => { return axios.delete(`${base}/sc/finance/deleteAccount?accountId=` + params).then(res => res.data); },
                DepartmentCost: params => { return axios.delete(`${base}/sc/finance/deleteDepartmentCost?id=` + params).then(res => res.data); }
            },
            edit: {
                DepartmentCost: params => { return axios.put(`${base}/sc/finance/updateDepartmentCost`, params).then(res => res.data); },
                UpdateReceiptsPrint: params => { return axios.put(`${base}/sc/finance/updateReceiptsPrint`, params).then(res => res.data); }
            },
            check: {
                Receipts: params => { return axios.put(`${base}/sc/finance/checkReceipts`, params).then(res => res.data); }
            }
        }
    },
    //报表中心
    reportCentre: {
        //业务报表
        business: {
            //招生统计
            queryRecruitStudents: params => { return axios.get(`${base}/sc/fnReport/getSchoolSignCount?schoolCode=` + params[0] + "&deptId=" + params[1] + "&beginTime=" + params[2] + "&endTime=" + params[3] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            //欠费统计
            queryArrears: params => { return axios.get(`${base}/sc/fnReport/getSchoolRecCost?schoolCode=` + params[0] + "&deptId=" + params[1] + "&beginTime=" + params[2] + "&endTime=" + params[3] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            //欠费明细
            queryArrearsDetail: params => { return axios.get(`${base}/sc/fnReport/getSchoolRecCostDetail?schoolCode=` + params[0] + "&deptId=" + params[1] + "&beginTime=" + params[2] + "&endTime=" + params[3] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); }
        }
    },
    //增值服务
    addService: {
        manager: {
            query: {
                managerList: params => { return axios.get(`${base}/sc/attachservice/exist/query?schoolCode=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2]).then(res => res.data); },
                queryHistoryList: params => { return axios.get(`${base}/sc/attachservice/history/query?serviceId=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2]).then(res => res.data); },
            },
        },
        pandect: {
            query: {
                queryPandectList: params => { return axios.get(`${base}/sc/attachservice/gets?schoolCode=` + params[0]).then(res => res.data); },
            },
            save: {
                applyService: params => { return axios.post(`${base}/sc/attachservice/apply`, params).then(res => res.data); },
            },
        },
    },
    //理论教学
    teaching: {
        device: {
            query: {
                queryDeviceList: params => {
                    return axios.get(`${base}/sc/education/device/query?schoolCode=` + params[0] + (params[1] != "1" ? "&used=" + params[1] : "")
                        + (params[2] != "1" ? "&type=" + params[2] : "") + (params[3] != "" ? "&number=" + params[3] : "") + "&currentPage=" + params[4] + "&pageSize=" + params[5] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data);
                }
            },
            save: {
                saveDevice: params => { return axios.post(`${base}/sc/education/device`, params).then(res => res.data); },
                updeatDevice: params => { return axios.put(`${base}/sc/education/device`, params).then(res => res.data); },
            },
            delete: {
                deleteDevice: params => { return axios.delete(`${base}/sc/education/device?id=` + params[0]).then(res => res.data); },
            }
        },
        classRoom: {
            query: {
                classRoomList: params => {
                    return axios.get(`${base}/sc/education/classroom/query?schoolCode=` + params[0] + "&schoolName=" + params[1]
                        + (params[2] != "" ? "&name=" + params[2] : "") + (params[3] != "" ? "&address=" + params[3] : "") + "&currentPage=" + params[4] + "&pageSize=" + params[5] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data);
                },
                devices: params => { return axios.get(`${base}/sc/education/device/query?schoolCode=` + params[0] + "&currentPage=1&pageSize=10" + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                recordList: params => {
                    return axios.get(`${base}/sc/education/record/query?classroomId=` + params[0] + (params[1] != "" ? "&gmtBegin=" + params[1] : "") + (params[2] != "" ? "&gmtEnd=" + params[2] : "")
                        + (params[3] != "" ? "&teacherName=" + params[3] : "") + "&currentPage=" + params[4] + "&pageSize=" + params[5] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data);
                },
                queryTeacher: params => { return axios.get(`${base}/sc/education/record/detail/teacher?recordId=` + params[0] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                queryRecordDetail: params => { return axios.get(`${base}/sc/education/record?recordId=` + params[0] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                //"&type=" + params[7] + 
                student: params => { return axios.get(`${base}/sc/education/record/detail/query?recordId=` + params[0] + (params[1] != "" ? "&userName=" + params[1] : "") + (params[2] != "" ? "&telephone=" + params[2] : "") + (params[3] != "" ? "&idcard=" + params[3] : "") + (params[4] != "" ? "&status=" + params[4] : "") + (params[5] != "" ? "&currentPage=" + params[5] : "") + (params[6] != "" ? "&pageSize=" + params[6] : "") + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
                queryMonitor: params => { return axios.get(`${base}/sc/education/record/current/classroom?classroomId=` + params[0] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
            },
            save: {
                classRoom: params => { return axios.post(`${base}/sc/education/classroom`, params).then(res => res.data); },
                updateClassRoom: params => { return axios.put(`${base}/sc/education/classroom`, params).then(res => res.data); },
            }
        }
    },
    //公共
    public: {
        //查询地区（递归）
        queryArea: params => { return axios.get(`${base}/sc/common/area?id=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
        //查询地区（根据指定code）
        queryAreaByCode: params => { return axios.get(`${base}/sc/common/area/name?id=` + params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
        //获取培训车型
        queryCarType: params => { return axios.get(`${base}/sc/car/types`, params + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); },
        //获取模式字典
        queryModel: params => { return axios.get(`${base}/sc/teacher/queryModeDicInfo?schoolCode=` + params[0] + "&dt=" + new Date().Format(dtFmt)).then(res => res.data); }
    }
}