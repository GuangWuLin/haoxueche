import Error from "./pages/Error.vue"
import NotFound from "./pages/404.vue"
import Login from "./pages/Login.vue"

import Home from "./pages/Home.vue"
/* 总览 */
import OverView from "./pages/overview/index.vue"

/* 基础管理 */
import Student from "./pages/basic/student.vue"
import Teacher from "./pages/basic/teacher.vue"
import Vehicle from "./pages/basic/vehicle.vue"
import Exam from "./pages/basic/exam.vue"
import reservationSearch from "./pages/basic/reservationSearch.vue"
import gradeCheck from "./pages/basic/gradeCheck.vue"





/* 预约管理 */
import Reservation from "./pages/reservation/index.vue"
import ModeSetting from "./pages/reservation/modeSetting.vue"
import ParameterSetting from "./pages/reservation/parameterSetting.vue"
import ReservationRecord from "./pages/reservation/reservationRecord.vue"
import CoachClasses from "./pages/reservation/coachClasses.vue"
// import ClassesRecord from "./pages/reservation/classesRecord.vue" 此页面暂时废掉
import ClassesReview from "./pages/reservation/classesReview.vue"
import OnlinePaymentOrders from "./pages/reservation/onlinePaymentOrders.vue"
import LineRechargeRecord from "./pages/reservation/lineRechargeRecord.vue"
import Recharge from "./pages/reservation/recharge.vue"
import HolidayReview from "./pages/reservation/holidayReview.vue"

/* 计时培训 */
import SiteManagement from "./pages/timeTraining/siteManagement.vue"
import Monitoring from "./pages/timeTraining/monitoring.vue"
import TimeAudit from "./pages/timeTraining/timeAudit.vue"
import StageReview from "./pages/timeTraining/stageReview.vue"
import MonitorRules from "./pages/timeTraining/monitorRules.vue"

/* 消息中心 */
import SystemMsg from "./pages/message/index.vue"
import HistoryAnnouncement from "./pages/message/historyAnnouncement.vue"
import Details from "./pages/message/details.vue"

/* 系统设置 */
import Users from "./pages/systemSettings/users.vue"
import Schools from "./pages/systemSettings/schools.vue"

/* 报警消息 */
import SystemAlarm from "./pages/alarm/index.vue"

/* 系统公告 */
import SystemNotice from "./pages/notice/index.vue"

/* 内部管理 */
import Unit from "./pages/backstageManagement/unit.vue"
import Finance from "./pages/backstageManagement/finance.vue"
import Price from "./pages/backstageManagement/price.vue"
import FinanceReceipt from "./pages/backstageManagement/financeReceipt.vue"
import FinanceReview from "./pages/backstageManagement/financeReview.vue"
import Reporting from "./pages/backstageManagement/reporting.vue"

/* 报表中心 */
import Business from "./pages/statisticalReport/business.vue"
import HoursReport from "./pages/statisticalReport/hoursReport.vue"
import stageStatistics from "./pages/statisticalReport/stageStatistics.vue"
import CommentsReport from "./pages/statisticalReport/commentsReport.vue"
import ExamManage from "./pages/statisticalReport/examManage.vue"
import StageReport from "./pages/statisticalReport/stageReport.vue"
import RecruitReport from "./pages/statisticalReport/recruitReport.vue"


/*增值服务*/
// 服务总览
import Pandect from "./pages/addService/pandect.vue"
// 服务管理
import Manager from "./pages/addService/manager.vue"

/*理论教学 */
//理论教室
import Classroom from "./pages/teaching/classroom.vue"
//理论设备
import Device from "./pages/teaching/device.vue"

/* Testing */
import Test from "./pages/Test.vue"

// 兼容性提示页
import Info from "./pages/Info.vue"

// 线路管理
import RoutesList from './pages/routesManage/routesList.vue'

export default [
	{ path: "/error", component: Error, name: "错误", meta: { requireAuth: false }, hidden: true },
	{ path: "/", component: Login, name: "登录", meta: { requireAuth: false }, hidden: true },
	{ path: "/login", component: Login, name: "登录", meta: { requireAuth: false }, hidden: true },
	{ path: "/test", component: Test, name: "测试", meta: { requireAuth: false }, hidden: true },
	{
		path: "/",
		component: Home,
		name: "总览",
		iconCls: "glyph-icon icon-zonglan",
		leaf: true,
		children: [
			{ path: "/overview", component: OverView, name: "总览", meta: { requireAuth: true } }
		]
	},
	{
		path: "/",
		component: Home,
		name: "基础管理",
		iconCls: "glyph-icon icon-guanli",
		children: [
			{ path: "/student", component: Student, name: "学员管理", iconCls: "glyph-icon icon-xueyuan", meta: { requireAuth: true } },
			{ path: "/teacher", component: Teacher, name: "教练管理", iconCls: "glyph-icon icon-jiaolian", meta: { requireAuth: true } },
			{ path: "/vehicle", component: Vehicle, name: "车辆管理", iconCls: "glyph-icon icon-cheliang", meta: { requireAuth: true } },
			// { path: "/exam", component: Exam, name: "考试管理", iconCls: "glyph-icon icon-kaoshi", meta: { requireAuth: true } }
		]
	},
	{
		path: "/",
		component: Home,
		name: "预约管理",
		iconCls: "glyph-icon icon-yuyueguanli",
		children: [
			{ path: "/bookingWall", component: Reservation, name: "预约墙", iconCls: "glyph-icon icon-yuyueqiang", meta: { requireAuth: true } },
			{ path: "/modeSetting", component: ModeSetting, name: "模式管理", iconCls: "glyph-icon icon-moshiguanli", meta: { requireAuth: true } },
			{ path: "/parameterSetting", component: ParameterSetting, name: "参数设置", iconCls: "glyph-icon icon-canshushezhi", meta: { requireAuth: true } },
			{ path: "/reservationRecord", component: ReservationRecord, name: "预约记录", iconCls: "glyph-icon icon-yuyuejilu", meta: { requireAuth: true } },
			{ path: "/coachClasses", component: CoachClasses, name: "教练报班", iconCls: "glyph-icon icon-jiaolianbaoban", meta: { requireAuth: true } },
			// { path: "/classesRecord", component: ClassesRecord, name: "报班记录" }, 此页面暂时废掉
			{ path: "/classesReview", component: ClassesReview, name: "报班审核", iconCls: "glyph-icon icon-baobanshenhe", meta: { requireAuth: true } },
			{ path: "/onlinePaymentOrders", component: OnlinePaymentOrders, name: "在线支付订单", iconCls: "glyph-icon icon-zaixianzhifudingdan", meta: { requireAuth: true } },
			{ path: "/lineRechargeRecord", component: LineRechargeRecord, name: "线下充值记录", iconCls: "glyph-icon icon-xianxiachongzhijilu", meta: { requireAuth: true } },
			{ path: "/recharge", component: Recharge, name: "充值", iconCls: "glyph-icon icon-chongzhi", meta: { requireAuth: true } },
			{ path: "/holidayReview", component: HolidayReview, name: "请假审核", iconCls: "glyph-icon icon-qingjiashenhe", meta: { requireAuth: true } }
		]
	},
	{
		path: "/",
		component: Home,
		name: "计时培训",
		iconCls: "glyph-icon icon-jishipeixun",
		children: [
			{ path: "/siteManagement", component: SiteManagement, name: "场地管理", iconCls: "glyph-icon icon-changdiguanli", meta: { requireAuth: true } },
			{ path: "/monitoring", component: Monitoring, name: "动态监控", iconCls: "glyph-icon icon-dongtaijiankong", meta: { requireAuth: true } },
			{ path: "/timeAudit", component: TimeAudit, name: "学时审核", iconCls: "glyph-icon icon-xueshishenhe", meta: { requireAuth: true } },
			{ path: "/stageReview", component: StageReview, name: "阶段记录审核", iconCls: "glyph-icon icon-jieduanjilushenhe", meta: { requireAuth: true } },
			{ path: "/routesList", component: RoutesList, name: '科三线路', iconCls: "glyph-icon icon-xianluguanli", meta: { requireAuth: true } }
			// { path: "/monitorRules", component: MonitorRules, name: "监控规则", iconCls: "glyph-icon icon-kaoshi", meta: { requireAuth: true } }
		]
	},
	{
		path: "/",
		component: Home,
		name: "系统设置",
		iconCls: "glyph-icon icon-xitongshezhi",
		// leaf: true,
		children: [
			{ path: "/users", component: Users, name: "用户管理", iconCls: "glyph-icon icon-yonghuguanli", meta: { requireAuth: true } },
			{ path: "/schools", component: Schools, name: "分校管理", iconCls: "glyph-icon icon-fenxiaoguanli", meta: { requireAuth: true } }
		]
	},
	{
		path: "/",
		component: Home,
		name: "内部管理",
		iconCls: "glyph-icon icon-neibuguanli",
		children: [
			{ path: "/unit", component: Unit, name: "单位设置", iconCls: "glyph-icon icon-danweishezhi", meta: { requireAuth: true } },
			{ path: "/finance", component: Finance, name: "财务设置", iconCls: "glyph-icon icon-caiwushezhi", meta: { requireAuth: true } },
			{ path: "/price", component: Price, name: "价格设置", iconCls: "glyph-icon icon-jiageshezhi", meta: { requireAuth: true } },
			{ path: "/financeReceipt", component: FinanceReceipt, name: "财务制单", iconCls: "glyph-icon icon-caiwuzhidan", meta: { requireAuth: true } },
			{ path: "/financeReview", component: FinanceReview, name: "财务审核", iconCls: "glyph-icon icon-caiwushenhe", meta: { requireAuth: true } },
			{ path: "/reporting", component: Reporting, name: "车管状态", iconCls: "glyph-icon icon-cheguanzhuangtai", meta: { requireAuth: true } }
		]
	},
	{
		path: "/",
		component: Home,
		name: "增值服务",
		iconCls: "glyph-icon icon-zengzhi-fuwu",
		children: [
			{ path: "/pandect", component: Pandect, name: "服务总览", iconCls: "glyph-icon icon-fuwu-zonglan", meta: { requireAuth: true } },
			{ path: "/manager", component: Manager, name: "服务管理", iconCls: "glyph-icon icon-fuwu-guanli", meta: { requireAuth: true } },
		]
	},
	{
		path: "/",
		component: Home,
		name: "理论教学",
		iconCls: "glyph-icon icon-lilun-jiaoxue",
		children: [
			{ path: "/classroom", component: Classroom, name: "理论教室", iconCls: "glyph-icon icon-lilun-jiaoshi", meta: { requireAuth: true } },
			{ path: "/device", component: Device, name: "理论设备", iconCls: "glyph-icon icon-lilun-shebei", meta: { requireAuth: true } },
		]
	},
	{
		path: "/",
		component: Home,
		name: "报表中心",
		iconCls: "glyph-icon icon-baobiao",
		children: [
			{ path: "/business", component: Business, name: "业务报表", iconCls: "glyph-icon icon-yewu-baobiao", meta: { requireAuth: true } },
			{ path: "/stageStatistics", component: stageStatistics, name: "学员阶段报表", iconCls: "glyph-icon icon-jieduan-baobiao", meta: { requireAuth: true } },
			{ path: "/hoursReport", component: HoursReport, name: "学时报表", iconCls: "glyph-icon icon-yewu-baobiao", meta: { requireAuth: true } },
			{ path: "/commentsReport", component: CommentsReport, name: "评价报表", iconCls: "glyph-icon icon-yewu-baobiao", meta: { requireAuth: true } },
			{ path: "/examManage", component: ExamManage, name: "考试统计", iconCls: "glyph-icon icon-yewu-baobiao", meta: { requireAuth: true } },
			{ path: "/stageReport", component: StageReport, name: "阶段统计", iconCls: "glyph-icon icon-yewu-baobiao", meta: { requireAuth: true } },
			{ path: "/recruitReport", component: RecruitReport, name: "招生统计", iconCls: "glyph-icon icon-yewu-baobiao", meta: { requireAuth: true } },
		]
	},
	{
		path: "/",
		component: Home,
		name: "考试中心",
		iconCls: "glyph-icon icon-kaoshizhongxin",
		children: [
			{ path: "/reservationSearch", component: reservationSearch, name: '预约查询', iconCls: "glyph-icon icon-yuyuechaxun", meta: { requireAuth: true } },
			{ path: "/exam", component: Exam, name: "考试管理", iconCls: "glyph-icon icon-kaoshichaxun", meta: { requireAuth: true } },
			{ path: "/gradeCheck", component: gradeCheck, name: "成绩查询", iconCls: "glyph-icon icon-chengjichaxun", meta: { requireAuth: true } }
		]
	},
	{
		path: "/",
		component: Home,
		name: "消息中心",
		iconCls: "glyph-icon icon-xiaoxizhongxin",
		children: [
			{ path: "/msg", component: SystemMsg, name: "消息", iconCls: "glyph-icon icon-xiaoxi", meta: { requireAuth: true } },
			{ path: "/alarm", component: SystemAlarm, name: "报警", iconCls: "glyph-icon icon-baojing", meta: { requireAuth: true } },
			{ path: "/notice", component: SystemNotice, name: "公告", iconCls: "glyph-icon icon-gonggao", meta: { requireAuth: true } }
		]
	},
	// {
	// 	path: "/",
	// 	component: Home,
	// 	name: "报警",
	// 	leaf: true,
	// 	hidden: true,
	// 	children: [
	// 		{
	// 			path: "/systemAlarm",
	// 			component: SystemAlarm,
	// 			name: "报警",
	// 			children: [
	// 				{ path: "/systemAlarm/:id", component: Details, name: "报警详情", meta: { requireAuth: true } }
	// 			]
	// 		}
	// 	]
	// },
	{
		path: "/404",
		component: NotFound,
		name: "404",
		hidden: true
	},
	{
		path: "/info",
		component: Info,
		name: "系统提示",
		hidden: true
	}
	// ,
	// {
	// 	path: "*",
	// 	hidden: true,
	// 	redirect: { path: "/404" }
	// }
]