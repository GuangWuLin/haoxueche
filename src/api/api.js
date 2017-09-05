// let base = process.env.API_ROOT;
import $ from "jquery";
import axios from "axios";

//请求拦截，添加header鉴权
var interceptor = axios.interceptors.request.use(
    config => {
        config.headers.Authorization = sessionStorage.getItem("user") === null ? "" : JSON.parse(sessionStorage.getItem("user")).authorization;
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

export const request = {
    //登录
    login: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/admin/login`, params); },
    //获取所有权限（By驾校）
    getFunctions: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/admin/getFunction?schoolCode=` + params + "&dt=" + Math.random()).then(res => res.data); },

    // 总览
    overview: {
        getTopData: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/overview/getOverView?schoolCode=` + params + "&dt=" + Math.random()).then(res => res.data); }
    },
    /* basic-基础管理 */
    basic: {
        student: {
            query: {
                list: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/student/queryStudentList?schoolCode=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&keyWord=" + (params[3] !== "" ? encodeURI(params[3]) : "") + "&carType=" + params[4] + (params[5] !== "" ? "&isAppointment=" + params[5] : "") + (params[6] !== "" ? "&queryType=" + params[6] : "") + "&inSchool=true" + "&dt=" + Math.random()).then(res => res.data); },
                detailById: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/student/queryStudentDetail?studentId=` + params + "&dt=" + Math.random()).then(res => res.data); },
                photo: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/student/queryStudentPhoto?studentId=` + params + "&dt=" + Math.random()).then(res => res.data); },
                printForm: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/student/queryPrintApplicationForm?studentId=` + params + "&dt=" + Math.random()).then(res => res.data); },
                classRecordList: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/student/queryClassRecordList?studentId=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&dt=" + Math.random()).then(res => res.data); },
                timeTraceInfo: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/student/queryTimeTraceInfo?studentId=` + params + "&dt=" + Math.random()).then(res => res.data); },
                stageTrainRecord: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/student/queryStageTrainRecord?studentId=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&dt=" + Math.random()).then(res => res.data); },
                teachLog: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/student/queryTeachLog?studentId=` + params[0] + "&stage=" + params[1] + "&dt=" + Math.random()).then(res => res.data); },
                graduationInfo: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/student/queryGraduationInfo?studentId=` + params + "&dt=" + Math.random()).then(res => res.data); },
                bindCoach: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/student/queryTeacherDicInfo?schoolCode=` + params + "&dt=" + Math.random()).then(res => res.data); },
                makeCardInfoById: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/student/getMakeIccardInfo?studentId=` + params + "&dt=" + Math.random()).then(res => res.data); }
            },
            create: {
                photo: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/student/uploadStudentPhoto`, params).then(res => res.data); },
                student: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/student/addStudent`, params).then(res => res.data); },
                record: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/student/studentRecord`, params).then(res => res.data); },
                report: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/student/reportedStudent`, params).then(res => res.data); },
                graduation: {
                    examine: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/student/graduationExamine`, params).then(res => res.data); },
                    record: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/student/graduationRecord`, params).then(res => res.data); }
                },
            },
            audit: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/student/auditStudent`, params).then(res => res.data); },
            update: params => { return axios.put(`${sessionStorage.getItem('baseUrl')}/sc/student/updateStudent`, params).then(res => res.data); },
            save: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/student/saveStudentCollectPhoto`, params).then(res => res.data); },
            makeIcCard: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/student/studentMakeIccard`, params).then(res => res.data); }
        },
        vehicle: {
            //queryList: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/car/query?schoolCode=` + params[0] + "&gmtBegin=" + params[1] + "&gmtEnd=" + params[2] + "&currentPage=" + params[3] + "&pageSize=" + params[4] + "&cardNo=" + (params[5] !== "" ? encodeURI(params[5]) : "") + "&dt=" + Math.random()).then(res => res.data); },
            queryDetail: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/car?id=` + params + "&dt=" + Math.random()).then(res => res.data); },
            queryColors: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/car/colors?dt=` + Math.random()).then(res => res.data); },
            queryBrands: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/car/brands?id=` + params + "&dt=" + Math.random()).then(res => res.data); },
            //create: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/car`, params).then(res => res.data); },
            edit: params => { return axios.put(`${sessionStorage.getItem('baseUrl')}/sc/car`, params).then(res => res.data); },
            report: params => { return axios.put(`${sessionStorage.getItem('baseUrl')}/sc/car/report`, params).then(res => res.data); },
            delete: params => { return axios.delete(`${sessionStorage.getItem('baseUrl')}/sc/car?id=` + params).then(res => res.data); },

            //以下是整改之后的接口
            create: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/car`, params).then(res => res.data); },
            queryList: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/car/query?schoolCode=` + params[0] + "&carLicense=" + (params[1] !== "" ? encodeURI(params[1]) : "") + "&gmtBegin=" + params[2] + "&gmtEnd=" + params[3] + "&currentPage=" + params[4] + "&pageSize=" + params[5] + "&dt=" + Math.random()).then(res => res.data); },
            queryAnnualCheckList: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/car/annualcheck/query?schoolCode=` + params[0] + "&carLicense=" + (params[1] !== "" ? encodeURI(params[1]) : "") + "&gmtBegin=" + params[2] + "&gmtEnd=" + params[3] + "&currentPage=" + params[4] + "&pageSize=" + params[5] + "&dt=" + Math.random()).then(res => res.data); },
            addAnnualCheck: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/car/annualcheck`, params).then(res => res.data); },
            editAnnualCheck: params => { return axios.put(`${sessionStorage.getItem('baseUrl')}/sc/car/annualcheck`, params).then(res => res.data); },
            delAnnualCheck: params => { return axios.delete(`${sessionStorage.getItem('baseUrl')}/sc/car/annualcheck?id=` + params).then(res => res.data); },

            //查询车辆保险列表
            insuranceQuery: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/car/insurance/query?schoolCode=` + params[0] + "&carLicense=" + (params[1] !== "" ? encodeURI(params[1]) : "") + "&gmtBegin=" + params[2] + "&gmtEnd=" + params[3] + "&currentPage=" + params[4] + "&pageSize=" + params[5] + "&dt=" + Math.random()).then(res => res.data); },
            insuranceDetailQuery: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/car/insurance?id=` + params + "&dt=" + Math.random()).then(res => res.data); },
            editInsurance: params => { return axios.put(`${sessionStorage.getItem('baseUrl')}/sc/car/insurance`, params).then(res => res.data); },
            createInsurance: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/car/insurance`, params).then(res => res.data); },
            delInsurance: params => { return axios.delete(`${sessionStorage.getItem('baseUrl')}/sc/car/insurance?id=` + params).then(res => res.data); }
        },
        coach: {
            query: {
                list: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/teacher/queryTeacherList?schoolCode=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&keyWord=" + (params[3] !== "" ? encodeURI(params[3]) : "") + "&dt=" + Math.random()).then(res => res.data); },
                detail: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/teacher/queryTeacherDetailInfo?teacherId=` + params + "&dt=" + Math.random()).then(res => res.data); },
                makeCardInfoById: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/teacher/getMakeIccardInfo?teacherId=` + params + "&dt=" + Math.random()).then(res => res.data); }
            },
            create: {
                coach: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/teacher/addTeacher`, params).then(res => res.data); },
                photo: {
                    coach: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/teacher/uploadTeacherPhoto`, params).then(res => res.data); }
                },
                record: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/teacher/teacherRecord`, params).then(res => res.data); },
                teacherLeave: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/teacher/addTeacherLeave`, params).then(res => res.data); }
            },
            update: params => { return axios.put(`${sessionStorage.getItem('baseUrl')}/sc/teacher/updateTeacher`, params).then(res => res.data); },
            delete: params => { return axios.delete(`${sessionStorage.getItem('baseUrl')}/sc/teacher/deleteTeacher?teacherId=` + params).then(res => res.data); },
            makeIcCard: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/teacher/teacherMakeIccard`, params).then(res => res.data); }
        },
        securityGuard: {
            query: {
                list: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/teacher/querySecurityGuardList?schoolCode=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&keyWord=" + (params[3] !== "" ? encodeURI(params[3]) : "") + "&dt=" + Math.random()).then(res => res.data); },
                detail: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/teacher/querySecurityGuardDetailInfo?teacherId=` + params + "&dt=" + Math.random()).then(res => res.data); },
            },
            create: {
                photo: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/teacher/uploadSecurityGuardPhoto`, params).then(res => res.data); },
                securityGuard: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/teacher/addSecurityGuard`, params).then(res => res.data); },
                record: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/teacher/securityGuardRecord`, params).then(res => res.data); },
            },
            update: params => { return axios.put(`${sessionStorage.getItem('baseUrl')}/sc/teacher/updateSecurityGuard`, params).then(res => res.data); },
            delete: params => { return axios.delete(`${sessionStorage.getItem('baseUrl')}/sc/teacher/deleteSecurityGuard?teacherId=` + params).then(res => res.data); }
        },
        examiner: {
            query: {
                list: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/teacher/queryExaminerList?schoolCode=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&keyWord=" + (params[3] !== "" ? encodeURI(params[3]) : "") + "&dt=" + Math.random()).then(res => res.data); },
                detail: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/teacher/queryExaminerDetailInfo?teacherId=` + params + "&dt=" + Math.random()).then(res => res.data); },
            },
            create: {
                photo: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/teacher/uploadExaminerPhoto`, params).then(res => res.data); },
                examiner: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/teacher/addExaminer`, params).then(res => res.data); },
                record: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/teacher/examinerRecord`, params).then(res => res.data); },
            },
            update: params => { return axios.put(`${sessionStorage.getItem('baseUrl')}/sc/teacher/updateExaminer`, params).then(res => res.data); },
            delete: params => { return axios.delete(`${sessionStorage.getItem('baseUrl')}/sc/teacher/deleteExaminer?teacherId=` + params).then(res => res.data); }
        },
        exam: {
            query: {
                list: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/exam/query?schoolCode=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&keyword=" + (params[3] !== "" ? encodeURI(params[3]) : "") + "&gmtExam=" + params[4] + "&register=" + params[5] + "&dt=" + Math.random()).then(res => res.data); },
                // 学员成绩列表查询
                listScoreSearch: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/exam/queryScoreListInfo?schoolCode=` + params[0] + "&examBeginDate=" + params[1] + "&examEndDate=" + params[2] + "&examStageName=" + (params[3] !== "" ? encodeURI(params[3]) : "") + "&examCarTypeName=" + params[4] + "&keyWord=" + (params[5] !== "" ? encodeURI(params[5]) : "") + "&currentPage=" + params[6] + "&pageSize=" + (params[7] !== '' ? params[7] : 10) + "&dt=" + Math.random()).then(res => res.data); },
                // 预约学员列表查询
                reservationSearch: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/exam/queryExamAppointmentListInfo?schoolCode=` + params[0] + "&examBeginDate=" + params[1] + "&examEndDate=" + params[2] + "&examStageName=" + (params[3] !== "" ? encodeURI(params[3]) : "") + "&examCarTypeName=" + params[4] + "&keyWord=" + (params[5] !== "" ? encodeURI(params[5]) : "") + "&currentPage=" + params[6] + "&pageSize=" + (params[7] !== '' ? params[7] : 10) + "&dt=" + Math.random()).then(res => res.data); },

            },
            create: {
                exam: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/exam`, params).then(res => res.data); },
                examResuls: params => { return axios.put(`${sessionStorage.getItem('baseUrl')}/sc/exam`, params).then(res => res.data); }
            }
        }
    },
    //systemSettings-系统设置
    systemSettings: {
        //用户模块
        users: {
            //查询用户（By驾校）
            queryInfo: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/admin/getUsers?schoolCode=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&dt=" + Math.random()).then(res => res.data); },
            create: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/admin/createUser`, params).then(res => res.data); },
            del: params => { return axios.delete(`${sessionStorage.getItem('baseUrl')}/sc/admin/deleteUser?userId=` + params).then(res => res.data); },
            checkPhone: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/admin/checkPhoneRegister?userName=` + params + "&dt=" + Math.random()).then(res => res.data); },
            //功能模块
            functions: {
                //查询功能（By驾校）
                query: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/admin/getUserAuthCode?userId=` + params + "&dt=" + Math.random()).then(res => res.data); },
                //编辑权限（By用户）
                edit: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/admin/updateUser`, params).then(res => res.data); },
            },
            //修改支付密码（By用户）
            updatePayPassword: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/admin/updatePayPassword`, params).then(res => res.data); },
        },
        //分校模块
        branchSchool: {
            query: {
                list: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/school/getBranchSchool?schoolCode=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&dt=" + Math.random()).then(res => res.data); },
            },
            create: {
                school: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/school/addBranchSchool`, params).then(res => res.data); },
                financialChapter: params => { return axios.put(`${sessionStorage.getItem('baseUrl')}/sc/school/updateFinancialChapter`, params).then(res => res.data); }
            }
        }
    },
    //获取分校列表
    getBranchSchool: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/school/getBranchSchool?schoolCode=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&dt=" + Math.random()).then(res => res.data); },
    //新增分校
    addBranchSchool: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/school/addBranchSchool`, params).then(res => res.data); },
    //appointment-预约管理
    appointment: {
        //模式
        model: {
            query: {
                list: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/appointmentModel/query?schoolCode=` + params[2] + "&currentPage=" + params[0] + "&pageSize=" + params[1] + "&dt=" + Math.random()).then(res => res.data); },
                detail: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/appointmentModel?modelId=` + params + "&dt=" + Math.random()).then(res => res.data); }
            },
            create: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/appointmentModel`, params).then(res => res.data); },
            update: params => { return axios.put(`${sessionStorage.getItem('baseUrl')}/sc/appointmentModel`, params).then(res => res.data); },
            delete: params => { return axios.delete(`${sessionStorage.getItem('baseUrl')}/sc/appointmentModel?modelId=` + params).then(res => res.data); },
        },
        //参数设置
        para: {
            query: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/appointmentschool/get?schoolCode=` + params + "&dt=" + Math.random()).then(res => res.data); },
            update: params => { return axios.put(`${sessionStorage.getItem('baseUrl')}/sc/appointmentschool/update`, params).then(res => res.data); }
        },
        //线下交易记录
        offlineorder: {
            query: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/offlineorder/getBaseCostDetail?schoolCode=` + params[0] + "&operateType=" + params[1] + "&studentPhone=" + (params[2] !== "" ? encodeURI(params[2]) : "") + "&currentPage=" + params[3] + "&pageSize=" + params[4] + "&dt=" + Math.random()).then(res => res.data); },
        },
        //在线支付订单
        onlineorder: {
            query: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/school/getOnlineOrders?schoolCode=` + params[0] + "&businessType=" + params[1] + "&ownerMobile=" + (params[2] !== "" ? encodeURI(params[2]) : "") + "&currentPage=" + params[3] + "&pageSize=" + params[4] + "&dt=" + Math.random()).then(res => res.data); },
        },
        //充值
        recharge: {
            queryStudent: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/offlineorder/getBaseCostDetailStudentInfo?schoolCode=` + params[0] + "&studentPhone=" + (params[1] !== "" ? encodeURI(params[1]) : "") + "&currentPage=" + params[2] + "&pageSize=" + params[3] + "&dt=" + Math.random()).then(res => res.data); },
            create: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/offlineorder/addBaseCostDetail`, params).then(res => res.data); },
            checkPayPassword: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/offlineorder/checkPayPassword`, params).then(res => res.data); }
        },
        query: {
            recording: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/appointmentrecord/queryAppointmentRecordList?keyWord=` + (params[0] !== "" ? encodeURI(params[0]) : "") + "&schoolCode=" + params[1] + "&currentPage=" + params[2] + "&pageSize=" + params[3] + "&beginTime=" + (params[4] === "" ? "" : params[4]) + "&endTime=" + (params[5] === "" ? "" : params[5]) + "&isEvaluate=" + (params[6] === "" ? "" : params[6]) + "&isPay=" + (params[7] === "" ? "" : params[7]) + "&dt=" + Math.random()).then(res => res.data); },
            detail: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/appointmentrecord/queryAppointmentRecordDetail?appointmentId=` + params + "&dt=" + Math.random()).then(res => res.data); },
            model: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/appointmentModel/queryAll?schoolCode=` + params + "&dt=" + Math.random()).then(res => res.data); },
            selectInfoWall: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/appointmentinfo/selectInfoWall?schoolCode=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&classDate=" + params[3] + "&modelId=" + (params[4] === "" ? 0 : params[4]) + "&stage=" + params[5] + "&keyword=" + (params[6] !== "" ? encodeURI(params[6]) : "") + "&dt=" + Math.random()).then(res => res.data); },
            wallQueryStudent: params => {
                return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/appointmentinfo/wallQueryStudent?schoolCode=` + params[0] +
                    "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&teacherId=" + params[3] +
                    "&keyword=" + (params[4] !== "" ? encodeURI(params[4]) : "") + "&modelId=" + params[5] + "&stage=" + params[6] + "&beginTime=" + params[7] + "&endTime=" + params[8] + "&dt=" + Math.random()).then(res => res.data);
            },
            studentQueryInfo: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/appointmentinfo/studentQueryInfo?schoolCode=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&studentId=" + params[3] + "&classDate=" + params[4] + "&stage=" + params[5] + "&keyword=" + (params[6] !== "" ? encodeURI(params[6]) : "") + "&dt=" + Math.random()).then(res => res.data); }
        },
        create: {
            addBaseEvaluate: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/appointmentrecord/addBaseEvaluate`, params).then(res => res.data); },
            appointmentinfo: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/appointmentinfo`, params).then(res => res.data); },
        },
        cancel: params => { return axios.put(`${sessionStorage.getItem('baseUrl')}/sc/appointmentinfo`, params).then(res => res.data); },
        classes: {
            query: {
                classesRecordWall: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/teacherClass/queryCLassRecord?currentPage=` + params[0] + "&pageSize=" + params[1] + "&schoolCode=" + params[2] + "&classDate=" + params[3] + "&modelId=" + params[4] + "&stage=" + params[5] + "&keyword=" + (params[6] !== "" ? encodeURI(params[6]) : "") + "&dt=" + Math.random()).then(res => res.data); },
                classesWall: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/teacherClass/queryClassWall?currentPage=` + params[0] + "&pageSize=" + params[1] + "&schoolCode=" + params[2] + "&classDate=" + params[3] + "&modelId=" + params[4] + "&stage=" + params[5] + "&keyword=" + (params[6] !== "" ? encodeURI(params[6]) : "") + (typeof (params[7]) !== "undefined" ? "&teacherId=" + params[7] : "") + "&dt=" + Math.random()).then(res => res.data); },
            },
            checking: params => { return axios.put(`${sessionStorage.getItem('baseUrl')}/sc/teacherClass`, params).then(res => res.data); },
            create: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/teacherClass`, params).then(res => res.data); },
            cancel: params => { return axios.delete(`${sessionStorage.getItem('baseUrl')}/sc/teacherClass?classId=` + params).then(res => res.data); }
        },
        //假期审核
        holidays: {
            //查询
            query: {
                list: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/teacher/getTeacherLeave?schoolCode=` + params[0] + "&leaveDay=" + params[1] + "&currentPage=" + params[2] + "&pageSize=" + params[3] + "&state=" + params[4] + "&keyword=" + (params[5] !== "" ? encodeURI(params[5]) : "") + "&dt=" + Math.random()).then(res => res.data); },
            },
            update: params => { return axios.put(`${sessionStorage.getItem('baseUrl')}/sc/teacher/updateLeaveState`, params).then(res => res.data); }
        }
    },
    //计时培训
    timeTraining: {
        //场地
        site: {
            //查询
            query: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/teaching/region/query?schoolCode=` + params[0] + "&gmtBegin=" + params[1] + "&gmtEnd=" + params[2] + "&currentPage=" + params[3] + "&pageSize=" + params[4] + "&dt=" + Math.random()).then(res => res.data); },
            //根据ID查询详情
            queryById: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/teaching/region?id=` + params + "&dt=" + Math.random()).then(res => res.data); },
            //新建
            create: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/teaching/region`, params).then(res => res.data); },
            //编辑
            edit: params => { return axios.put(`${sessionStorage.getItem('baseUrl')}/sc/teaching/region`, params).then(res => res.data); },
            //删除
            delete: params => { return axios.delete(`${sessionStorage.getItem('baseUrl')}/sc/teaching/region?id=` + params).then(res => res.data); },
            //审核
            review: params => { return axios.put(`${sessionStorage.getItem('baseUrl')}/sc/teaching/region/submit?id=` + params).then(res => res.data); }
        },
        timeAudit: {
            query: {
                list: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/classrecord/getClassRecordList?schoolCode=` + params[0] + (params[1] === "" || params[1] === "0" ? "" : "&stage=" + params[1]) + (params[2] === "" ? "" : "&beginTime=" + params[2]) + (params[3] === "" ? "" : "&endTime=" + params[3]) + (params[4] !== "" ? "&keyWord=" + encodeURI(params[4]) : "") + "&currentPage=" + params[5] + "&pageSize=" + params[6] + "&dt=" + Math.random()).then(res => res.data); },
                detail: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/classrecord/getClassRecordDetail?classRecordId=` + params + "&dt=" + Math.random()).then(res => res.data); },
                classRecordMin: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/classrecord/getClassRecordMin?schoolCode=` + params[0] + "&sim=" + params[1] + "&classId=" + params[2] + "&beginTime=" + params[3] + "&endTime=" + params[4] + "&dt=" + Math.random()).then(res => res.data); },
                classRecordPhoto: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/classrecord/getClassRecordPhoto?schoolCode=` + params[0] + "&sim=" + params[1] + "&classId=" + params[2] + "&dt=" + Math.random()).then(res => res.data); },
                classRecordGPS: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/classrecord/getClassRecordGPS?schoolCode=` + params[0] + "&sim=" + params[1] + "&beginTime=" + params[2] + "&endTime=" + params[3] + "&dt=" + Math.random()).then(res => res.data); }
            }
        },
        stageRecordAudit: {
            query: {
                pendingReportRecordList: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/stagerecord/getPendingReportRecordList?schoolCode=` + params[0] + "&stage=" + params[1] + "&keyWord=" + (params[2] !== "" ? encodeURI(params[2]) : "") + "&dt=" + Math.random()).then(res => res.data); },
                stageRecordList: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/stagerecord/getStageRecordList?schoolCode=` + params[0] + "&stage=" + params[1] + "&processState=" + params[2] + "&keyWord=" + (params[3] !== "" ? encodeURI(params[3]) : "") + "&dt=" + Math.random()).then(res => res.data); },
                reportedRecordList: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/stagerecord/getReportedRecordList?schoolCode=` + params[0] + "&stage=" + params[1] + "&keyWord=" + (params[2] !== "" ? encodeURI(params[2]) : "") + "&dt=" + Math.random()).then(res => res.data); }
            },
            create: {
                examinerSign: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/stagerecord/examinerSign`, params).then(res => res.data); },
                studentSign: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/stagerecord/studentSign`, params).then(res => res.data); },
                teacherSign: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/stagerecord/teacherSign`, params).then(res => res.data); },
                schoolSign: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/stagerecord/schoolSign`, params).then(res => res.data); },
                stagePerform: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/stagerecord/stagePerform`, params).then(res => res.data); }
            }
        },
        monitor: {
            query: {
                monitorCarList: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/monitor/getMonitorCarList?schoolCode=` + params + "&dt=" + Math.random()).then(res => res.data); },
                monitorInfoBySim: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/monitor/getMonitorInfoBySim?schoolCode=` + params[0] + "&simList=" + params[1] + "&dt=" + Math.random()).then(res => res.data); },
                capturePhoto: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/monitor/getCapturePhoto?schoolCode=` + params[0] + "&sim=" + params[1] + "&cmd=" + params[2] + "&dt=" + Math.random()).then(res => res.data); },
                historyGPS: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/monitor/getHistoryGPS?schoolCode=` + params[0] + "&sim=" + params[1] + "&beginTime=" + params[2] + "&endTime=" + params[3] + "&dt=" + Math.random()).then(res => res.data); },
                historyPhoto: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/monitor/getHistoryPhoto?schoolCode=` + params[0] + "&sim=" + params[1] + "&beginTime=" + params[2] + "&endTime=" + params[3] + "&currentPage=" + params[4] + "&pageSize=" + params[5] + "&dt=" + Math.random()).then(res => res.data); },
                ftpVideo: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/device/car/ftp?carLicense=` + encodeURI(params) + "&dt=" + Math.random()).then(res => res.data); }
            }
        },
        //获取培训部分
        queryStage: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/teaching/region/stage`, params).then(res => res.data); }
    },
    //内部管理
    backstageManagement: {
        department: {
            queryParentDeptById: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/department/queryParentDept?deptId=` + params + "&dt=" + Math.random()).then(res => res.data); },
            queryDetailById: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/department/query?deptId=` + params + "&dt=" + Math.random()).then(res => res.data); },
            query: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/department/queryTree?deptId=` + params + "&dt=" + Math.random()).then(res => res.data); },
            create: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/department`, params).then(res => res.data); }
        },
        finance: {
            query: {
                PayType: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/finance/selectPayType?schoolCode=` + params + "&dt=" + Math.random()).then(res => res.data); },
                ReceiptsType: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/finance/selectReceiptsType?schoolCode=` + params + "&dt=" + Math.random()).then(res => res.data); },
                Account: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/finance/selectAccount?schoolCode=` + params + "&dt=" + Math.random()).then(res => res.data); },
                DepartmentCost: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/finance/queryDepartmentCost?deptId=` + params + "&dt=" + Math.random()).then(res => res.data); },
                Receipt: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/finance/queryFinance?currentPage=` + params[0] + "&pageSize=" + params[1] + "&schoolCode=" + params[2] + "&deptId=" + params[3] + (params[4] !== "" ? "&beginTime=" + params[4] : "") + (params[5] !== "" ? "&endTime=" + params[5] : "") + "&dt=" + Math.random()).then(res => res.data); },
                RecStudentAll: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/finance/getRecStudentAll?deptId=` + params[0] + "&schoolCode=" + params[1] + "&dt=" + Math.random()).then(res => res.data); },
                DeptCost: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/finance/getDeptCost?deptId=` + params[0] + "&schoolCode=" + params[1] + "&dt=" + Math.random()).then(res => res.data); },
                RecDetail: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/finance/selectRecDetail?currentPage=` + params[0] + "&pageSize=" + params[1] + "&recId=" + params[2] + "&dt=" + Math.random()).then(res => res.data); }
            },
            create: {
                PayType: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/finance/insertPayType`, params).then(res => res.data); },
                ReceiptsType: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/finance/insertReceiptsType`, params).then(res => res.data); },
                Account: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/finance/insertAccount`, params).then(res => res.data); },
                DepartmentCost: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/finance/insertDepartmentCost`, params).then(res => res.data); },
                Receipt: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/finance/insert`, params).then(res => res.data); }
            },
            delete: {
                PayType: params => { return axios.delete(`${sessionStorage.getItem('baseUrl')}/sc/finance/deletePayType?payTypeId=` + params).then(res => res.data); },
                ReceiptsType: params => { return axios.delete(`${sessionStorage.getItem('baseUrl')}/sc/finance/deleteReceiptsType?recTypeId=` + params).then(res => res.data); },
                Account: params => { return axios.delete(`${sessionStorage.getItem('baseUrl')}/sc/finance/deleteAccount?accountId=` + params).then(res => res.data); },
                DepartmentCost: params => { return axios.delete(`${sessionStorage.getItem('baseUrl')}/sc/finance/deleteDepartmentCost?id=` + params).then(res => res.data); }
            },
            edit: {
                DepartmentCost: params => { return axios.put(`${sessionStorage.getItem('baseUrl')}/sc/finance/updateDepartmentCost`, params).then(res => res.data); },
                UpdateReceiptsPrint: params => { return axios.put(`${sessionStorage.getItem('baseUrl')}/sc/finance/updateReceiptsPrint`, params).then(res => res.data); }
            },
            check: {
                Receipts: params => { return axios.put(`${sessionStorage.getItem('baseUrl')}/sc/finance/checkReceipts`, params).then(res => res.data); }
            }
        }
    },
    //报表中心
    reportCentre: {
        //业务报表
        business: {
            //招生统计
            queryRecruitStudents: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/fnReport/getSchoolSignCount?schoolCode=` + params[0] + "&deptId=" + params[1] + "&beginTime=" + params[2] + "&endTime=" + params[3] + "&dt=" + Math.random()).then(res => res.data); },
            //欠费统计
            queryArrears: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/fnReport/getSchoolRecCost?schoolCode=` + params[0] + "&deptId=" + params[1] + "&beginTime=" + params[2] + "&endTime=" + params[3] + "&dt=" + Math.random()).then(res => res.data); },
            //欠费明细
            queryArrearsDetail: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/fnReport/getSchoolRecCostDetail?schoolCode=` + params[0] + "&deptId=" + params[1] + "&beginTime=" + params[2] + "&endTime=" + params[3] + "&dt=" + Math.random()).then(res => res.data); }
        },
        // 学时报表
        hoursReport:{
            // 统计教练工时
            TeacherHours:params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/teacherReport/getTeacherHours?schoolCode=` + params[0] + "&beginTime=" + params[1] + "&endTime=" + params[2] + "&currentPage=" + params[3] +  "&pageSize=" + params[4] + "&teacherKeyWord=" + (params[5]!=''?encodeURI(params[5]):'') + "&dt=" + Math.random()).then(res => res.data); },
            // 查询教练预约明细
            TeacherOrderDetail:params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/teacherReport/getTeacherOrderDetail?schoolCode=` + params[0] + "&beginTime=" + params[1] + "&endTime=" + params[2] + "&currentPage=" + params[3] +  "&pageSize=" + params[4] + "&teacherKeyWord=" + (params[5]!=''?encodeURI(params[5]):'') + "&stage=" + params[6] + "&dt=" + Math.random()).then(res => res.data); },
            // 查询教练打卡明细
            TeacherTimerDetail:params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/teacherReport/getTeacherTimerDetail?schoolCode=` + params[0] + "&beginTime=" + params[1] + "&endTime=" + params[2] + "&currentPage=" + params[3] +  "&pageSize=" + params[4] + "&teacherKeyWord=" + (params[5]!=''?encodeURI(params[5]):'') + "&stage=" + params[6] + "&dt=" + Math.random()).then(res => res.data); }
        },
        // 评价统计
        commentsReport:{
            // 统计教练评价
            TeacherEvaluate:params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/teacherReport/getTeacherEvaluate?schoolCode=` + params[0] + "&beginTime=" + params[1] + "&endTime=" + params[2] + "&currentPage=" + params[3] +  "&pageSize=" + params[4] + "&teacherKeyWord=" + (params[5]!=''?encodeURI(params[5]):'') + "&dt=" + Math.random()).then(res => res.data); },
            // 查询教练评价明细
            EvaluateDetail:params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/teacherReport/getEvaluateDetail?schoolCode=` + params[0] + "&beginTime=" + params[1] + "&endTime=" + params[2] + "&currentPage=" + params[3] +  "&pageSize=" + params[4] + "&level=" + params[5] + "&hasComments=" + params[6] + "&score=" + params[7] + (params[8]!=''?encodeURI(params[8]):'') + "&dt=" + Math.random()).then(res => res.data); }
        },
        // 考试统计
        examSummary:{
            // 驾校汇总
            schoolExamReport:params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/examReport/getSchoolExamReport?schoolCode=` + params[0] + "&beginTime=" + params[1] + "&endTime=" + params[2] + "&currentPage=" + params[3] +  "&pageSize=" + params[4] + "&isContrast=" + params[5] + "&queryType=" + params[6] + '&contrastBeginTime=' + params[7] + "&contrastEndTime=" +  params[8] + "&dt=" + Math.random()).then(res => res.data); },
            // 教练汇总
            teacherExamReport:params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/examReport/getTeacherExamReport?schoolCode=` + params[0] + "&beginTime=" + params[1] + "&endTime=" + params[2] + "&currentPage=" + params[3] +  "&pageSize=" + params[4] + "&teacherKeyWord=" + (params[5]!=''?encodeURI(params[5]):'') + "&queryType=" + params[6] + "&dt=" + Math.random()).then(res => res.data); },
            // 考试明细
            teacherExamDetail:params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/examReport/getTeacherExamDetail?schoolCode=` + params[0] + "&beginTime=" + params[1] + "&endTime=" + params[2] + "&currentPage=" + params[3] +  "&pageSize=" + params[4] + (params[5]!=''?encodeURI(params[5]):'') + "&queryType=" + params[6] + "&stage=" + params[7] + "&carType=" + params[8] + "&isPass=" + params[9] +"&dt=" + Math.random()).then(res => res.data); },
            // 绩效核算明细
            teacherExamDetailPerf:params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/examReport/getTeacherExamDetailPerf?schoolCode=` + params[0] + "&beginTime=" + params[1] + "&endTime=" + params[2] + "&currentPage=" + params[3] +  "&pageSize=" + params[4] + (params[5]!=''?encodeURI(params[5]):'') + "&queryType=" + params[6] + "&stage=" + params[7] + "&carType=" + params[8] +"&dt=" + Math.random()).then(res => res.data); },
        },
        // 学员阶段统计
        stageReport:{
            // 学员阶段按驾校汇总
            schoolStageReport:params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/stageReport/getSchoolStageReport?schoolCode=` + params[0] + "&carType=" + params[1] + "&dt=" + Math.random()).then(res => res.data); },
            // 学员阶段按教练汇总
            teacherStageReport:params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/stageReport/getTeacherStageReport?schoolCode=` + params[0] + "&carType=" + params[1] + "&currentPage=" + params[2] + "&pageSize=" + params[3] + "&teacherKeyWord=" + (params[4]!=''?encodeURI(params[4]):'') + "&dt=" + Math.random()).then(res => res.data); },
            // 学员阶段明细
            stageReportDetail:params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/stageReport/getStageReportDetail?schoolCode=` + params[0] + "&carType=" + params[1] + "&currentPage=" + params[2] + "&pageSize=" + params[3] + (params[4]!=''?encodeURI(params[4]):'') + "&stage=" + params[5] + "&dt=" + Math.random()).then(res => res.data); },
            
        },
        // 招生统计报表
        recruitReport:{
            // 招生统计
            recruitReport:params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/recruitReport/getRecruitReport?schoolCode=` + params[0] + "&beginTime=" + params[1] + "&endTime=" + params[2] + "&currentPage=" + params[3] +  "&pageSize=" + params[4] + "&isContrast=" + params[5] + "&carType=" + params[6] + "&recruitUser=" + (params[7]!=''?encodeURI(params[7]):'') + '&contrastBeginTime=' + params[8] + "&contrastEndTime=" +  params[9] + "&dt=" + Math.random()).then(res => res.data); },
            // 招生趋势
            recruitTrendReport:params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/recruitReport/getRecruitTrendReport?schoolCode=` + params[0] + "&theYear=" + params[1] + "&register=" + params[2] + "&currentPage=" + params[3] +  "&pageSize=" + params[4] + "&recruitUser=" + (params[5]!=''?encodeURI(params[5]):'') + "&carType=" + params[6] + "&dt=" + Math.random()).then(res => res.data); },
            // 招生明细
            recruitDetailReport:params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/recruitReport/getRecruitDetailReport?schoolCode=` + params[0] + "&beginTime=" + params[1] + "&endTime=" + params[2] + "&currentPage=" + params[3] +  "&pageSize=" + params[4] + "&studentKeyWord=" + (params[5]!=''?encodeURI(params[5]):'') + "&carType=" + params[6] + "&recruitUser=" + (params[7]!=''?encodeURI(params[7]):'') + "&dt=" + Math.random()).then(res => res.data); },
        }
    },
    //增值服务
    addService: {
        manager: {
            query: {
                managerList: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/attachservice/exist/query?schoolCode=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2]).then(res => res.data); },
                queryHistoryList: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/attachservice/history/query?serviceId=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2]).then(res => res.data); },
            },
        },
        pandect: {
            query: {
                queryPandectList: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/attachservice/gets?schoolCode=` + params[0]).then(res => res.data); },
            },
            save: {
                applyService: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/attachservice/apply`, params).then(res => res.data); },
            },
        },
    },
    //理论教学
    teaching: {
        device: {
            query: {
                queryDeviceList: params => {
                    return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/education/device/query?schoolCode=` + params[0] + (params[1] != "1" ? "&used=" + params[1] : "")
                        + (params[2] != "1" ? "&type=" + params[2] : "") + (params[3] != "" ? "&number=" + params[3] : "") + "&currentPage=" + params[4] + "&pageSize=" + params[5] + "&dt=" + Math.random()).then(res => res.data);
                }
            },
            save: {
                saveDevice: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/education/device`, params).then(res => res.data); },
                updeatDevice: params => { return axios.put(`${sessionStorage.getItem('baseUrl')}/sc/education/device`, params).then(res => res.data); },
            },
            delete: {
                deleteDevice: params => { return axios.delete(`${sessionStorage.getItem('baseUrl')}/sc/education/device?id=` + params[0]).then(res => res.data); },
            }
        },
        classRoom: {
            query: {
                classRoomList: params => {
                    return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/education/classroom/query?schoolCode=` + params[0] + "&schoolName=" + encodeURI(params[1])
                        + (params[2] != "" ? "&name=" + encodeURI(params[2]) : "") + (params[3] != "" ? "&address=" + encodeURI(params[3]) : "") + "&currentPage=" + params[4] + "&pageSize=" + params[5] + "&dt=" + Math.random()).then(res => res.data);
                },
                devices: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/education/device/query?schoolCode=` + params[0] + "&currentPage=1&pageSize=10" + "&dt=" + Math.random()).then(res => res.data); },
                recordList: params => {
                    return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/education/record/query?classroomId=` + params[0] + (params[1] != "" ? "&gmtBegin=" + params[1] : "") + (params[2] != "" ? "&gmtEnd=" + params[2] : "")
                        + (params[3] != "" ? "&teacherName=" + encodeURI(params[3]) : "") + "&currentPage=" + params[4] + "&pageSize=" + params[5] + "&dt=" + Math.random()).then(res => res.data);
                },
                queryTeacher: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/education/record/detail/teacher?recordId=` + params[0] + "&dt=" + Math.random()).then(res => res.data); },
                queryRecordDetail: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/education/record?recordId=` + params[0] + "&dt=" + Math.random()).then(res => res.data); },
                //"&type=" + params[7] + 
                student: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/education/record/detail/query?recordId=` + params[0] + (params[1] != "" ? "&userName=" + encodeURI(params[1]) : "") + (params[2] != "" ? "&telephone=" + params[2] : "") + (params[3] != "" ? "&idcard=" + params[3] : "") + (params[4] != "" ? "&status=" + params[4] : "") + (params[5] != "" ? "&currentPage=" + params[5] : "") + (params[6] != "" ? "&pageSize=" + params[6] : "") + "&dt=" + Math.random()).then(res => res.data); },
                queryMonitor: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/education/record/current/classroom?classroomId=` + params[0] + "&dt=" + Math.random()).then(res => res.data); },
                //type:manual 手动／automatic 自动
                snapshot: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/education/record/snapshot/query?recordId=` + params[0]).then(res => res.data); },
                //获取摄像头列表
                cameraList: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/education/device/detail?classroomId=` + params[0]).then(res => res.data); }
            },
            save: {
                classRoom: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/education/classroom`, params).then(res => res.data); },
                updateClassRoom: params => { return axios.put(`${sessionStorage.getItem('baseUrl')}/sc/education/classroom`, params).then(res => res.data); },
                snapshot: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/education/record/snapshot`, params).then(res => res.data); }
            },
            catchCamera: params => { return $.ajax({ type: "get", url: params + "&dt=" + Math.random(), cache: false }).then(res => res); }
        }
    },
    //公共
    public: {
        //查询地区（递归）
        queryArea: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/common/area?id=` + params + "&dt=" + Math.random()).then(res => res.data); },
        //查询地区（根据指定code）
        queryAreaByCode: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/common/area/name?id=` + params + "&dt=" + Math.random()).then(res => res.data); },
        //获取培训车型
        queryCarType: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/car/types`, params + "&dt=" + Math.random()).then(res => res.data); },
        //获取模式字典
        queryModel: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/teacher/queryModeDicInfo?schoolCode=` + params[0] + "&dt=" + Math.random()).then(res => res.data); },
        //查询驾校3D训练场图层（全部）
        queryTranning3DPicture: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/teaching/region/map/query?schoolCode=` + params[0] + "&currentPage=" + params[1] + "&pageSize=" + params[2] + "&dt=" + Math.random()).then(res => res.data); },
        //查询驾校3D训练场图层（指定ID）
        queryTranning3DPictureById: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/teaching/region/map?teachId=` + params + "&dt=" + Math.random()).then(res => res.data); }
    },
    // 线路管理
    routesManage: {
        // 新增培训线路
        addNewRoute: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/device/teaching/line`, params).then(res => res.data); },
        // 编辑路线
        editRouteLine: params => { return axios.put(`${sessionStorage.getItem('baseUrl')}/device/teaching/line`, params).then(res => res.data); },
        // 查询路线列表
        queryRoutes: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/device/teaching/line/query?schoolCode=`+ params[0] + '&currentPage=' + params[1] + '&pageSize=' + params[2] + "&name=" + (params[3]!=''?encodeURI(params[3]):'') + "&dt=" + Math.random()).then(res => res.data); },
        // 查询路线详情
        queryRouteDetail: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/device/teaching/line?id=` + params).then(res => res.data); },
        // 删除线路
        deleteRoute: params => { return axios.delete(`${sessionStorage.getItem('baseUrl')}/device/teaching/line?id=` + params).then(res => res.data); },
        // GPS坐标转火星坐标
        gpsToGCJ: params => { return $.ajax({ type: "get", url: 'http://restapi.amap.com/v3/assistant/coordinate/convert?key=7d75056f04b7bbdbdb9fa5575e1fb185&locations=' + params + "&coordsys=gps", cache: false }).then(res => res); }
    },
    //注册中心
    regCenter: {
        query: {
            serviceArea: params => { return axios.get(`${window.regUrl}/register_center/service/area?dt=` + Math.random()).then(res => res.data); },
            serviceList: params => { return axios.get(`${window.regUrl}/register_center/manager/check?areaCode=` + params[0] + "&userName=" + params[1] + "&dt=" + Math.random()).then(res => res.data); }
        }
    },
    //消息中心
    notice: {
        query: {
            list: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/notice/school/query?schoolCode=` + params[0] + "&type=" + params[1] + (params[2] === "" ? "" : "&customerId=" + params[2]) + (params[3] === "" ? "" : "&customer=" + params[3]) + (params[4] === "" ? "" : "&label=" + params[4]) + "&currentPage=" + params[5] + "&pageSize=" + params[6] + "&title=" + (params[7] !== "" ? encodeURI(params[7]) : "") + "&gmtBegin=" + params[8] + "&gmtEnd=" + params[9] + "&dt=" + Math.random()).then(res => res.data); },
            detail: params => { return axios.get(`${sessionStorage.getItem('baseUrl')}/sc/notice/school?id=` + params + "&dt=" + Math.random()).then(res => res.data); },
        },
        publish: params => { return axios.post(`${sessionStorage.getItem('baseUrl')}/sc/notice/school`, params).then(res => res.data); },
        reading: params => { return axios.put(`${sessionStorage.getItem('baseUrl')}/sc/notice/school/read?id=` + params[0] + "&customerId=" + params[1]).then(res => res.data); },
    }
}