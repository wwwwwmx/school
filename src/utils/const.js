/**
 * 项目常量定义
 */

// 当前版本标识信息
const VERSION = "public_school_v1";

// Y轴距离顶部默认值 => Y轴为多少时显示回到顶部按钮
export const BACK_POSITION = 1000;

/**
 * @method CODE状态码
 * @param {Number} CODE_EXIST                   存在
 * @param {Number} PICKUP_DROPS                 拾音器掉线
 * @param {Number} PICKUP_STOP_RECORD           拾音器停止录音
 * @param {Number} PICKUP_IS_NO                 没有多余拾音器
 * @param {Number} PICKUP_UP_SUCCESS            拾音器签到成功
 * @param {Number} PICKUP_UP_FAILUER            拾音器签到失败
 * @param {Number} PICKUP_DOWN_SUCCESS          拾音器解绑成功
 * @param {Number} PICKUP_DOWN_FAILUER          拾音器解绑失败
 * @param {Number} ADD_TOPIC_FAILURE            题目已存在
 * @param {Number} ADD_IMPORT_TOPIC_FAILURE     存在重复题目、已去重导入
 * @param {Number} ADD_IMPORT_CLASSES_FAILURE   该表格存在重复班级，已去重导入
 * @param {Number} ADD_IMPORT_STUDENT_FAILURE   该表格存在重复学生，已去重导入
 */
export const CODE_EXIST = 1005;
export const PICKUP_DROPS = 1012;
export const PICKUP_STOP_RECORD = 1023;
export const PICKUP_IS_NO = 1015;
export const PICKUP_UP_SUCCESS = 1011;
export const PICKUP_UP_FAILUER = 1010;
export const PICKUP_DOWN_SUCCESS = 1013;
export const PICKUP_DOWN_FAILUER = 1014;
export const ADD_TOPIC_FAILURE = 1021;
export const ADD_IMPORT_TOPIC_FAILURE = 1022;
export const ADD_IMPORT_CLASSES_FAILURE = 1018;
export const ADD_IMPORT_STUDENT_FAILURE = 1019;

// 登录页面中的tabs
// export const TABSINDEX = `${VERSION}_tabs_index`;
// =========================== 用户 =========================== 
// 用户身份 0: 教师 1: 超级管理员
export const ROLE = `${VERSION}_role`;
// 用户id
export const ADMINUSERID = `${VERSION}_user_id`;
export const LASTLOGIN = `${VERSION}_lastlogin_id`;
export const PUBLISHVERSION = `${VERSION}_publishversion`;


// 用户账号
export const ADMINACCOUNT = `${VERSION}_account`;
// 用户密码
export const PASSWORD = `${VERSION}_password`;
// 用户头像
export const AVATAR = `${VERSION}_avatar`;
// token
export const TOKEN = `${VERSION}_token`;
// 是否记住密码
export const REMEMBER = `${VERSION}_remember`;
export const GENDER =`${VERSION}_gender`
//组织关系
export const ORGANIZATIONID = `${VERSION}_organizationid`
// =========================== PC端 =========================== 
// 光哥PC端唯一标识
export const PCSYMBOL = `${VERSION}_pc_symbol`;
export const AUTOPLAYING = `${VERSION}_pc_autoplaying`;

// ======================== 课中需要数据 ========================
// 当前题目下标
// export const CURRENTINDEX = `${VERSION}_current_index`;
// 课程id
export const COURSEID = `${VERSION}_course_id`;
// 课件id
export const LESSONID = `${VERSION}_lesson_id`;
// 课件名称
export const LESSONNAME = `${VERSION}_lesson_name`;
//班级名称
export const CLASSNAME = `${VERSION}_class_name`;
//课程名称
export const COURSENAME = `${VERSION}_coursename_id`;
//是否来自上课
export const ISTEACHING = `${VERSION}_isteaching_id`;
//是否切换了课件
export const ISEVAL = `${VERSION}_iseval_id`;
// 上课班级id
export const CLASSESID = `${VERSION}_classes_id`;
//教室id
export const ROOMID = `${VERSION}_room_id`;
export const TEACHERNAME = `${VERSION}_teacher_name`;
export const QUERYSIGNIN = `${VERSION}_querysignin_id`
// 课程记录id
export const TAKECLASSID = `${VERSION}_takeclass_id`;

//课件评测文本列表
export const TITLELIST = `${VERSION}_titlelist_data`;
export const ALLLESSONLIST = `${VERSION}_alllessonlist_data`;
export const ALLCOURSELIST = `${VERSION}_allcourselist_data`;
export const AUTOEVALCOUNT = `${VERSION}_autoevalcount`;



// =========================== mqtt =========================== 
// 客户端id标识
export const CLIENTSYMBOL = `${VERSION}_mqtt`;

// ========================== 前端发布 ==========================
/**
 * @method  传递课件ID ps/v1/pc/coursewareId/${uuid} 用于PC端获取上课时的课件ID
 * @payload 直接写 0、1、2... 即可
 */
export const SEND_TO_PC_COURSEWARE_ID = `ps/v1/pc/coursewareId/`;

/**
 * @method  学生签到 ps/sign/${课件id}
 * @payload JSON解析
 * {
 *   @param {String} signType "signPickup" 后端大佬原话: 这个是固定的只能是这个值原因是现在只有拾音器了但是我不想改
 *   @param {String} studentId 学生学号
 * }
 */
export const SEND_TO_BACKEND_SIGN_IN = `ps/sign/`;

/**
 * @method  学生解绑 ps/down/${课件id}
 * @payload 拾音器编号 后端大佬原话: 列表就好不需要用JSON
 */
export const SEND_TO_BACKEND_SIGN_DOWN = `ps/down/`;
/**
 * @method 遗嘱信息，will/web/${教师id}/${课件id}
 */
export const SEND_TO_WILL_MESSAGE = `will/web/`;
/**
 * @method  切换课件信息 ps/display/${课件id}
 * @payload JSON解析
 * {
 *   @param {Number} msgType  1: 单词 2: 句子 3:段落
 *   @param {String} word     单词、句子、段落
 * }
 */
export const SEND_TO_BACKEND_COURSEWARE_DISPLAY = `ps/display/`;

/**
 * @method  开始/结束评测 ps/char/${课件id}
 * @payload JSON解析
 * {
 *   @param {Number} start      0: 开始录音 1: 结束录音
 *   @param {String} word       单词、句子、段落
 *   @param {Number} msgType    1: 单词 2: 句子 3:段落
 * }
 */
export const SEND_TO_BACKEND_EVALUATING = `ps/char/`;


// ========================== 前端接收 ==========================
/**
 * @method  PC端回执 ps/v1/web/coursewareId/result/${uuid} 用于确定PC端已经收到了我的消息
 * @payload 传啥都行 随你...
 */
export const RECEIVE_TO_PC_COURSEWARE_ID = `ps/v1/web/coursewareId/result/`;

/**
 * @method  拾音器回执 ps/result/pickup/down/${课件id}
 * @payload JSON解析
 * {
 *   @param {String} code           状态码
 *   @param {Object} data  如下
 *   {
 *     @param {String} studentId    学生学号
 *     @param {String} deviceMark   拾音器编号
 *   }
 *   @param {String} message        消息详细
 * }
 */
export const RECEIVE_TO_BACKEND_PICKUP = `ps/result/pickup/down/`;

