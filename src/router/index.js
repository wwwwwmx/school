import Vue from 'vue';
import Router from 'vue-router';
import store from 'store'

// 导入工具类
import { setStore, getStore } from "utils/util";
import { ROLE, TOKEN, PCSYMBOL } from 'utils/const';

// * 公有页面 
// 登录
const Login = () => import('views/public/Login');
// 侧边栏菜单 + 顶部菜单
const Layout = () => import('views/public/Layout');
// 设置环境
const SetEnv = () => import('views/public/SetEnv');
// 404
const NotFound = () => import('cpns/content/public/404');

// * 课程备课 
// 课程列表
const ManageCourse = () => import('views/teacher/manageCourse/ManageCourse');
// 课件列表
const ManageCourseware = () => import('views/teacher/manageCourse/ManageCourseware');
//课件题目列表
const ManageLessonTitle = () => import('views/teacher/manageCourse/ManageLessonTitle');
// 课件-新增课件题目
const ManageAddCourseware = () => import('views/teacher/manageCourse/childCourseware/AddCoursewareTopic');
// 课中-选择练习

// * 课中上课 
// 课中-学生签到
// const ManageStudentSignIn = () => import('views/teacher/manageGotoClass/ManageStudentSignIn');
// 课中-引导页
// const ManageGuide = () => import('views/teacher/manageGotoClass/ManageGuide');
// 课中-口语练习
const ManageHaveClass = () => import('views/teacher/manageGotoClass/ManageHaveClass');
// 课中-等待课程报告生成
const ManageLoading = () => import('views/teacher/manageGotoClass/ManageLoading');
// 课中-评测报告生成
const ManageEvalResult = () => import('views/teacher/manageGotoClass/ManageEvalResult');
const SignLoading = () => import('views/teacher/manageGotoClass/SignLoading');
const ReportInClass = () => import('views/teacher/manageGotoClass/ReportInClass');
// const StartCourse = () => import('views/startTeaching/StartCourse');
//管理员端
//管理员主页面管理
const ManageView = () => import('views/administrator/ManageView')
//班级管理
const ManageClass = () => import('views/administrator/ManageClass');
//教室管理
const ManageClassroom = () => import('views/administrator/ManageClassroom');
//按理说中转和设备是教室的子路由，但因为某些原因不可跳转，等后续优化时处理
//绑定中转
const BindTransit = () => import('views/administrator/bindTransit/BindTransit')
//学生管理
const ManageStudent = () => import('views/administrator/ManageStudent')
//查看答题器设备
const AnswerDevice = () => import('views/administrator/AnswerDevice');
//教师管理
const ManageTeacher = () => import('views/administrator/ManageTeacher');
//课堂记录
const ManageHistory = () => import('views/administrator/ManageHistory')
//学生上课记录
const ManageStudenthistory = () => import('views/administrator/ManageStudenthistory')
//学生学情
const StudentDetail = () => import('views/administrator/StudentDetail')
//学情报告
const DetailReport = () => import('views/administrator/DetailReport')
//课堂报告
const CourseReport = () => import('views/administrator/CourseReport')
//课程管理
const ManageCourseHistory = () => import('views/teacher/manageCourseHistory/ManageCourseHistory');
//学生成绩
const StudentHistory = () => import('views/administrator/bindTransit/StudentHistory');
// 用户端
const BeginTeaching = () => import('views/startTeaching/BeginTeaching');
const Empty = () => import('views/startTeaching/Empty');
const ManageTeacherhistory = () =>import('views/administrator/ManageTeacherhistory')


// 学生管理课程列表
const ManageStudentCourseList = () => import('views/teacher/ManageStudentCourseList/ManageStudentCourseList')
// 学生管理课程详情
const ManageStudentCourseDetail = () => import('views/teacher/ManageStudentCourseDetail/ManageStudentCourseDetail')
//新写的课程报告界面
const HisrotyReport = () => import('views/public/HistoryReport')
const CourseHisrotyReport = () => import('views/public/CourseHistoryReport')

// 启用路由 『路由注册』
Vue.use(Router);

// 定义路由列表
const routes = [
  {
    path: '/',
    redirect: '/login/none',
  },
  {
    path: '/login',
    redirect: '/login/none',
  },
  {
    desc: "登录",
    path: '/login/:symbol',
    name: 'login',
    component: Login,
    meta: {
      requireAuth: false
    }
  },
  {
    desc: "更改配置",
    path: "/set-env",
    name: "setEnv",
    component: SetEnv
  },
  //管理员页面
  {
    desc: "管理员主页面",
    name: 'manage-view',
    path: '/manage-view',
    component: ManageView,
    meta: {
      showpage: true,
      requireAuth: true,
      roleList: [1],
    },
    children: [
      {
        desc: "教师管理",
        name: "manage-teacher",
        path: "manage-teacher",
        component: ManageTeacher,
        meta: {
          showpage: true,
          requireAuth: true,
          roleList: [1],
        }
      },
      {
        desc: "班级管理",
        name: "manage-class",
        path: "manage-class",
        component: ManageClass,
        meta: {
          showpage: true,
          requireAuth: true,
          roleList: [1],
        },
        children: [
          {
            desc: "学生管理",
            name: "managestudent",
            path: "managestudent",
            component: ManageStudent,
            meta: {
              showpage: false,
              showpages: true,
              requireAuth: true,
              roleList: [0, 1]
            },
            children: [
              {
                desc: "历史上课记录",
                name: "managestudenthistory",
                path: "managestudenthistory",
                component: ManageStudenthistory,
                meta: {
                  showpages: false,
                  requireAuth: true,
                  roleList: [0, 1]
                }
              },
            ]
          },
        ]
      },
      {
        desc: "教室管理",
        name: "manage-room",
        path: "manage-room",
        component: ManageClassroom,
        meta: {
          showpage: true,
          requireAuth: true,
          roleList: [1]
        },
        children: [
          {
            desc: "查看设备",
            name: "answer-device",
            path: "answer-device",
            component: AnswerDevice,
            meta: {
              showpage: false,
              requireAuth: true,
              roleList: [1]
            }
          },
        ]
      },
      {
        desc: "课堂记录",
        name: "manage-history",
        path: "manage-history",
        component: ManageHistory,
        meta: {
          requireAuth: true,
          roleList: [0, 1],
          showpage: true,
        },
        children: [{
          desc: "学生学情",
          name: "student-detail",
          path: "student-detail",
          component: StudentDetail,
          meta: {
            requireAuth: true,
            roleList: [0, 1],
            showpage: false
          },
        },]
      },
      // {
      //   desc: "绑定中转",
      //   name: "bind-transit",
      //   path: "bind-transit",
      //   component: BindTransit,
      //   meta: {
      //     requireAuth: true,
      //     roleList: [1]
      //   }
      // },
      // {
      //   desc: "查看设备",
      //   name: "answer-device",
      //   path: "answer-device",
      //   component: AnswerDevice,
      //   meta: {
      //     requireAuth: true,
      //     roleList: [1]
      //   }
      // },
    ],
  },
  {
    desc: "课堂报告",
    name: "course-report",
    path: "/course-report",
    component: CourseReport,
    meta: {
      requireAuth: true,
      roleList: [0, 1],
      showpage:true
    },
  },
  {
    desc: "学情报告",
    name: "detail-report",
    path: "/detail-report",
    component: DetailReport,
    meta: {
      requireAuth: true,
      roleList: [0, 1],
      showpage:false
    },
  },
  //用户
  {
    path: '/index',
    name: 'index',
    component: Layout,
    meta: {
      requireAuth: true,
      roleList: [0],
    },
    children: [
      // {
      //   //只有用户端可用，所以没必要再加上身份验证
      //   desc: "开始授课弹框",
      //   name: "start-teaching",
      //   path: "start-teaching",
      //   component: StartTeaching,
      //   meta: {
      //     requireAuth: true,
      //     roleList: [0]
      //   },
      // },
      {
        desc: "空白页，用于刷新页面",
        name: "empty",
        path: "empty",
        component: Empty,
        meta: {
          requireAuth: true,
          roleList: [0]
        },
      },
      {
        desc: "课程备课列表",
        name: "courseList",
        path: "course-prepare",
        component: ManageCourse,
        meta: {
          requireAuth: true,
          // 可进入当前页面身份数组 0: 普通用户 1: 超级管理员
          roleList: [0]
        },
      },
      // {
      //   desc: "学生签到",
      //   path: "student-sign-in",
      //   name: "studentSignIn",
      //   component: ManageStudentSignIn,
      //   meta: {
      //     requireAuth: true,
      //     roleList: [0],
      //   }
      // },
      // {
      //   desc: "签到后的选择课程",
      //   path: "start-course",
      //   name: "start-course",
      //   component: StartCourse,
      // },
      {
        desc: "课件卡片列表",
        name: "coursewareList",
        path: "courseware",
        component: ManageCourseware,
        meta: {
          requireAuth: true,
          roleList: [0]
        }
      },
      {
        desc: "学生成绩",
        name: "student-history",
        path: "student-history",
        component: StudentHistory,
        meta: {
          requireAuth: true,
          roleList: [0],
        }
      },
      {
        desc: "新增课件",
        name: "addCourseware",
        path: "add-courseware",
        component: ManageAddCourseware,
        meta: {
          requireAuth: true,
          roleList: [0]
        }
      },
      // {
      //   desc: "引导页",
      //   path: "guide-page",
      //   name: "ManageGuide",
      //   component: ManageGuide,
      //   meta: {
      //     requireAuth: true,
      //     roleList: [0]
      //   }
      // },
      {
        desc: "口语练习",
        path: "begin-have-class",
        name: "ManageHaveClass",
        // redirect:"/manage-index/begin-have-class",
        component: ManageHaveClass,
        meta: {
          // TODO: 测试下 上线时记得改为true
          requireAuth: true,
          roleList: [0]
        }
      },
      {
        desc: "生成课程报告等待页",
        path: "loading-class",
        name: "ManageLoading",
        component: ManageLoading,
        meta: {
          requireAuth: true,
          roleList: [0]
        }
      },
      {
        desc: "开始授课3d轮播图",
        name: "begin-teaching",
        path: "begin-teaching",
        component: BeginTeaching,
        meta: {
          requireAuth: true,
          roleList: [0]
        },
      },
      {
        desc: "课堂记录",
        name: "manage-history",
        path: "manage-history",
        component: ManageHistory,
        meta: {
          requireAuth: true,
          roleList: [0, 1],
        }
      },
      // Tab1: 只有教师身份才能显示
      {
        desc: "加载签到loading动画",
        path: "/sign-loading",
        name: "sign-loading",
        component: SignLoading,
      },
      
      {
        desc: "自动模式结束后的课后报告",
        path: "report-in-class",
        name: "report-in-class",
        component: ReportInClass,
      },
      {
        desc: "课件题目列表",
        name: "lesson-title",
        path: "lesson-title",
        component: ManageLessonTitle,
        meta: {
          requireAuth: true,
          roleList: [0]
        }
      },
      {
        desc: "历史数据",
        name: "manageteacherhistory",
        path: "manageteacherhistory",
        component: ManageTeacherhistory,
        meta: {
          requireAuth: true,
          roleList: [0]
        }
      },
      {
        desc: "学生课程详情",
        name: "managestudentcourselist",
        path: "managestudentcourselist",
        component: ManageStudentCourseList,
        meta: {
          requireAuth: true,
          roleList: [0, 1]
        }
      },
      {
        desc: "学生报告详情",
        name: "managestudentcoursedetail",
        path: "managestudentcoursedetail",
        component: ManageStudentCourseDetail,
        meta: {
          requireAuth: true,
          roleList: [0, 1]
        }
      },
      {
        desc: "课程详情",
        name: "managecoursehistory",
        path: "managecoursehistory",
        component: ManageCourseHistory,
        meta: {
          requireAuth: true,
          roleList: [0, 1]
        }
      },
      {
        desc: "评测结果展示页",
        path: "eval-result",
        name: "ManageEvalResult",
        component: ManageEvalResult,
        meta: {
          requireAuth: true,
          roleList: [0, 1]
        }
      },
      {
        desc: "学生评测结果展示页",
        path: "history-report",
        name: "history-report",
        component: HisrotyReport,
        meta: {
          requireAuth: true,
          roleList: [0, 1]
        }
      },
      {
        desc: "班级课程评测结果展示页",
        path: "course-history-report",
        name: "course-history-report",
        component: CourseHisrotyReport,
        meta: {
          requireAuth: true,
          roleList: [0, 1]
        }
      },
      {
        desc: "错误页面",
        path: '*',
        component: NotFound,
      }
    ]
  },

];

// 创建路由对象
const router = new Router({
  mode: 'history',
  routes
});
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}
// 配置路由拦截器
router.beforeEach((to, from, next) => {
  if (to.matched.length != 0) {
    // console.log("[1]matched里面有元素");
    if (to.meta.requireAuth) {
      // console.log("[2]需要登录权限 请判断token");

      if (getStore(TOKEN)) {
        // console.log("[3]token验证通过，验证页面身份权限", store.state.role, to.meta.roleList);
        if (to.meta.roleList.includes(store.state.routerJump.role)) {
          // console.log("[4]页面身份权限验证通过");
          next();
        } else {
          // console.log("[4]该页面权限不属于你, 下次见");
          next({ path: "/404" });
        }
      } else {
        // console.log("[3]验证失败，滚去登录吧你");
        next({ path: '/' })
      }
    } else {
      // console.log("[2]无需登录权限 请判断是否在登录页面 验证token决定是否帮忙登录", to.path.includes("/login/"));
      if (to.path != "/" && to.path != "/" && to.path.includes("/login/") == false) {
        // console.log("[3]不在登录页 走起 爱去哪去哪");
        next();
      } else {
        // console.log("[3]在登录页 我看下你有没有token", to.params.symbol);
        // 保存光哥PC端唯一标识
        setStore(PCSYMBOL, to.params.symbol);
        if (getStore(TOKEN)) {
          // console.log("[4]有了！！！送你去首页");
          // 根据身份跳转不同首页
          // console.log('这是获取要去的链接',store.getters.jumpRouterName)
          // next(store.getters.jumpRouterName);
          next()
        } else {
          // console.log("[4]没有！！！滚去登录");
          next();
        }
      }
    }
  } else {
    console.log("[1]matched里面没有元素 暂时我也不知道有什么用");
    // next({
    //   path: '/login',
    //   // 将跳转的路由path作为参数，登录成功后跳转到该路由
    //   query: { redirect: to.fullPath }
    // })
  }
})

// 导出路由信息
export default router;
