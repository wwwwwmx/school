/*
 * @Author: your name
 * @Date: 2021-05-06 14:05:48
 * @LastEditTime: 2021-12-29 11:06:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\newApi\teacher-data.js
 */
/**
 * 教师、学生、课程、课件、评测数据存储类编写,
 */

import {
  classToNewList,
  randomNum,
  slicenum,
  getRandomChineseWord
} from "utils/util";
import {
  timesnow
} from "utils/util-KH";
// 账户
export class AdminUserInfo {
  constructor(role, info, password, remember) {
    /**
     * @method 教师账号信息
     * @param {String}  role           用户身份 0: 教师  1: 管理员
     * @param {Number}  teacherId    用户id
     * @param {String}  teacherAccount   用户账号
     * @param {String}  password       用户密码
     * @param {boolean} remember       是否需要记住密码
     * @param {String}  teacherName    教师姓名
     * @param {Array}   typeSet        返回不需要再显示的引导层
     * @param {String}  token          token令牌
     */
    this.role = role || 0;
    this.teacherId = info.id || 0;
    this.teacherAccount = info.account || "";
    this.teacherName = info.teacherName || "";
    this.password = password || "";
    this.remember = remember || false;
    this.token = info.token || "";
    this.typeSet = info.typeSet || [];
    this.organizationId = info.organizationId || 0;
    this.avatar=info.avatar||""
    this.gender=info.gender||""
  }
}

export class CardListInfo {
  constructor(info, wahyClass) {
    // wahyClass: 使用哪一个解析类
    /**
     * @method 通用列表解析类
     * @param {Number}    count     总条数
     * @param {Number}    curPage   当前页码
     * @param {boolean}   hasNext   是否有下一页
     * @param {Number}    totalPage 总页数
     * @param {Array}     date      通过一个类的解析方式,转换一个列表内部属性并返回一个新列表
     */
    this.count = info.count || 0;
    this.curPage = info.curPage || 0;
    this.hasNext = info.hasNext || false;
    this.totalPage = info.totalPage || 0;
    this.data = classToNewList(info.data, wahyClass) || [];
  }
}
// 课程、课件卡片解析类
export class CourseSingle {
  constructor(itemInfo) {
    /**
     * @method 单个课程卡片信息
     * @param {Number}  courseId                  课程ID
     * @param {String}  courseName          课程名称
     * @param {String}  courseDesc          课程描述
     */
    this.id = itemInfo.courseId || 0;
    this.courseName = itemInfo.courseName || "";
    this.courseDesc = itemInfo.courseDesc || "";
    this.cover = itemInfo.cover;
    this.lessonCount = itemInfo.lessonCount;
    this.progress = itemInfo.progress;
    
  }
}
export class LessonSingle {
  constructor(itemInfo) {
    /**
     * @method 单个课件卡片信息
     * @param {Number}  lessonId        课件ID
     * @param {String}  lessonName      课件名称
     * @param {number}  modifyTeacherId 最后修改人Id
     * @param {String}  modifyTimestamp 最后修改时间戳
     * @param {number}  paragraphCount 段落数量
     * @param {number}  sentenceCount 句子数量
     * @param {number}  wordCount     单词数量
     * @param {number}  progress      学习进度
     */
    this.id = itemInfo.lessonId || 0;
    this.lessonName = itemInfo.lessonName || "";
    this.modifyTeacherId = itemInfo.modifyTeacherId || 0;
    this.modifyTeacherName = itemInfo.modifyTeacherName || "";
    this.modifyTimestamp = itemInfo.modifyTimestamp || 0;
    this.paragraphCount = itemInfo.paragraphCount || 0,
      this.sentenceCount = itemInfo.sentenceCount || 0;
    this.wordCount = itemInfo.wordCount || 0;
    this.progress = itemInfo.progress || 0;

  }
}
//新版课程报告列表
export class newCourseReportInfo {
  constructor(info) {
    this.list = classToNewList(info, reportSingleInfo) || [];
  }
}
class reportSingleInfo {
  constructor(itemInfo) {
    this.evalMode = itemInfo.evalMode;
    this.autoEvalName = itemInfo.autoEvalName;
    this.evalResultList = itemInfo.evalResultList;
    this.evalTextScoreInfoList = itemInfo.evalTextScoreInfoList;
    this.phoneticMastery = itemInfo.phoneticMastery;
    this.rateEvaluation = itemInfo.rateEvaluation;
    this.scoreAxis = itemInfo.scoreAxis;
    this.scoreBank = itemInfo.scoreBank;
    this.studentScoreTable = itemInfo.studentScoreTable;
    this.takeClassInfo = itemInfo.takeClassInfo;
  }
}
// 课件题目列表
export class CoursewareTopicInfo {
  constructor(info) {
    /**
     * @method 课件题目列表信息
     * @param {Array}  list              课件题目列表
     */
    this.list = classToNewList(info, CoursewareTopicSingle) || [];
  }
}
export class CoursewareTopicSingle {
  constructor(itemInfo, state = 1) {
    /**
     * @method 单个题目信息
     * @param {String} randomKey    使用7位随机数代替randomkey, 保证节点唯一性
     * @param {String} evalState    组件内状态: 0: 编辑、1: 完成
     * @param {String} type         题目类型 1：单词、2：句子、3：段落
     * @param {String} evalText      题目
     * @param {String} translation    翻译
     */
    this.randomKey = Math.random().toString(16).substr(5, 7);
    this.titleState = state;
    this.type = itemInfo.type;
    this.evalText = itemInfo.evalText;
    this.evalTextId = itemInfo.id;
    // 换行翻译数据去重
    this.translation = Array.from(new Set(itemInfo.translation.split("\n"))).join('\n');
  }
}

// 学生
export class StudentSignInInfo {
  constructor(info = {}) {
    /**
     * @method 学生签到列表信息
     * @param {Number} takeClassId       上课时, 生成的课程记录Id, 用于下课时传参, 需要保存本地缓存
     * @param {Number} classesId         班级Id
     * @param {Number} roomId            教室Id
     * @param {Array}  studentDeviceList 学生签到列表: 详细参数在单解析类说明
     */
    this.takeClassId = info.takeClassId || 0;
    this.classesId = info.classesId || 0;
    this.roomId = info.roomId || 0;
    this.studentDeviceList = classToNewList(info.studentDeviceList, StudentSignInSingle) || [];
  }
}
export class StudentSignInSingle {
  constructor(itemInfo) {
    /**
     * @method 单个学生签到信息
     * @param {boolean} bind       签到状态 true: 已签到 fasle 未签到
     * @param {Number}  signInType   [前端自增参数]签到类型 0: 签到 1: 正在签到 2: 解绑 3: 正在解绑
     * @param {String}  deviceAlias   语音答题器编号
     * @param {String}  deviceSymbol  答题器设备 Mac 地址
     * @param {String}  studentName  学生姓名   
     * @param {String}  studentNo    学生学号
     * @param {String}  transitSymbol 拾音器所属中转设备 Mac 地址     
     */
    this.bind = itemInfo.bind || false;
    this.deviceAlias = itemInfo.deviceAlias || null;
    this.deviceSymbol = itemInfo.deviceSymbol || null;
    this.studentNo = itemInfo.studentNo || "";
    this.studentName = itemInfo.studentName || "";
    this.transitSymbol = itemInfo.transitSymbol || null;
    this.gender = itemInfo.gender || "男";
  }
}

// 课中课件信息
export class CourseWordInfo {
  constructor(info = {}) {
    /**
     * @method 课中-课件题目信息
     * @param {Array}  list     课件题目列表: 详细参数在单解析类说明
     */
    this.list = classToNewList(info, CourseWordSingle) || [];
    // 测试
    // this.list = classToNewList(Array.from(new Array(50).randomkeys()), CourseWordSingle);
  }
}

export class CourseWordSingle {
  constructor(itemInfo) {
    /**
     * @method 单个题目信息
     * @param {Number}  evalTextId              评测文本id
     * @param {Number}  id              后台返回的id，用来给移动端发消息用
     * @param {String}  audio           评测文本原始音频
     * @param {String}  duration        评测时长，前端调用开始评测时传值
     * @param {Number}  evalCountAuto       自动评测次数，大于0表示评测过
     * @param {Number}  evalCountNormal       手动评测次数，大于0表示评测过
     * @param {boolean} evaluatedAutoInThePast 该文本是否评测过自动模式
     * @param {boolean} evaluatedNormalInThePast 该文本是否评测过手动模式
     * @param {boolean} lastAuto               是否是自动模式最后评测的文本
     * @param {boolean} lastNormal               是不是手动模式最后评测的文本
     * @param {String}  evalText         评测单词、句子、段落文本
     * @param {String}  phonetic        评测音标
     * @param {Number}  lastEvalLevel      评测结果是星星等级（1,2,3,4表示优，良，中，差）
     * @param {String}  translation       评测文本翻译内容
     * @param {Number}  type            评测文本类型：1、单词； 2、句子； 3、段落
     * @param {String}  timeSymbol      该文本评测开始时的时间戳
     * @param {boolean} isShowContent   [前端] 是否显示题目
     * @param {boolean} isShowTranslate [前端] 是否显示翻译
     * @param {boolean} isShowPhone     [前端] 是否显示音标 ！！！单词特有
     * @param {boolean} isEval          [前端]自动模式特有，当前单词是否评测过,        
     */
    this.evalTextId = itemInfo.id || 0;
    this.id = itemInfo.id || 0;
    this.audio = itemInfo.audio || "";
    this.duration = itemInfo.duration || "";
    this.evalCountAuto = itemInfo.evalCountAuto || 0;
    this.evalCountNormal = itemInfo.evalCountNormal || 0;
    this.evalText = itemInfo.evalText ? itemInfo.evalText : itemInfo.text;
    this.evaluatedAutoInThePast = itemInfo.evaluatedAutoInThePast || false;
    this.evaluatedNormalInThePast = itemInfo.evaluatedNormalInThePast || false;
    this.lastEvalLevel = itemInfo.lastEvalLevel|| 0;
    this.phonetic = itemInfo.phonetic || "";
    this.lastAuto = itemInfo.lastAuto || false;
    this.lastNormal = itemInfo.lastNormal || false;
    this.translation = itemInfo.translation || "";
    this.type = itemInfo.type || 1;
    this.timeSymbol = itemInfo.timeSymbol || "";
    this.isShowContent = true;
    this.isShowTranslate = true;
    this.isShowPhone = true;
    this.isEval = false;
  }
}


// 学生评测详情
export class StudentEvalResultInfo {
  constructor(info = {}) {
    /**
     * @method 课中-学生评测结果
     * @param {Object} evalChart         柱形图数据
     * @param {String} evalText          评测文本
     * @param {Number} evaluatedStudentCount 已答学生数量
     * @param {Number} signedStudentCount   签到学生数量
     * @param  {String} phonetic            音标
     * @param {Array}  evaluationDetailList        答题明细
     * @param {Number} type                 评测文本类型
     */
    console.log(info)
    this.evalChart = info.evalChart || {};
    this.evalText = info.evalText;
    this.evaluatedStudentCount = info.evaluatedStudentCount;
    this.phonetic = this.phonetic;
    this.signedStudentCount = info.signedStudentCount;
    this.type = info.type;
    this.evaluationDetailList = classToNewList(info.evaluationDetailList, StudentEvalSingle) || [];

    // TODO: 测试
    // this.list = classToNewList([1, 2, 3, 4, 5, 6, 7, 7, 8, 8, 9, 7323, 3, 2, 32, , 23, 2], StudentEvalSingle) || [];
  }
}
export class StudentEvalSingle {
  constructor(itemInfo) {
    /**
     * @method 单个学生明细信息
     * @param {String}  studentNo          学生学号
     * @param {String}  studentName        学生姓名
     * @param {Number}  score              评测总分
     * @param {String}  level              评测等级，不知道柱状图到底是怎么搞的，之后如果人数比例不能用的话，过滤出四个等级的比例[0,0,0,0]
     * @param {String}  audio           音频链接
     * @param {boolean} isPlay             [前端添加] 是否在播放
     * @param {Number}  accurateValue      句子评测准确度: 单词无
     * @param {Number}  completeValue      句子评测完整度: 单词无
     * @param {Number}  fluentValue       句子评测流利度: 单词无
     * @param {Array}   phoneticList       音标列表: 单词独有
     * @param {Number} type                 评测文本类型
     * @param {Number} evalMode            标记评测模式，1手动，2重读，3自动
     * 
     * 
     */
    this.studentNo = itemInfo.studentNo || "";
    this.studentName = itemInfo.studentName || "";
    this.score = itemInfo.score || 0;
    this.audio = itemInfo.audio || "";
    this.level = itemInfo.level || 0;
    this.isPlay = false;
    this.type = itemInfo.type || 0;
    this.evalMode = itemInfo.evalMode;

    this.accurateValue = itemInfo.accurateValue || 0;
    this.completeValue = itemInfo.completeValue || 0;
    this.fluentValue = itemInfo.fluentValue || 0;
    this.phoneticScoreList = classToNewList(itemInfo.phoneticScoreList, PhonticItem) || [];
  }
}
class PhonticItem {
  constructor(item) {
    /**
     * @method 音标占比解析类
     * @param {String} phonetic       音标
     * @param {Number} score      对应得分
     */
    this.phonetic = item.phonetic;
    this.score = item.score;
  }
}


// 课件结束评测数据
export class CoursewareEvalInfo {
  constructor(info = {}) {
    // 左侧数据
    const courseInfo = info.takeClassInfo || {};
    // 学分榜
    const scoreBank = info.scoreBank || {};
    const scoreBankLen = Object.keys(scoreBank).length;
    // 分数段分布
    const studentScore = classToNewList(info.studentScoreTable, EstudentScoreSingle);
    let unJoinStudents = false;
    if (info.rateEvaluation && info.rateEvaluation.unsignedStudentList) {
      unJoinStudents = classToNewList(info.rateEvaluation.unsignedStudentList, EstudentScoreSingle);
    }
    // 音标掌握情况
    const phoneticMasterSituation = info.phoneticMastery || {};
    // TODO: mock数据测试
    // const studentScore = classToNewList([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0], EstudentScoreSingle);
    // const unJoinStudents = classToNewList([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0], EstudentScoreSingle);
    // const scoreDetails = classToNewList([1, 2, 3, 4, 5, 6, 8, 9, 0, 1, 1, 1, 1, 1, 1, 1,], EdistributionSingle);
    // 未参评人数列表
    // 参评率计算: 先拿到课堂人数 再根据未参评列表长度获取未参评人数 (1 - 未参评率 = 参评率)
    // 应到、实到、缺到、未参评、参评率
    let shouldNum = courseInfo.studentCount || 0;
    let actuallyNum = courseInfo.signedCount || 0;
    let lackNum = shouldNum - actuallyNum;
    let noParticipateNum = unJoinStudents.length;
    let participateRate = 0;
    if (actuallyNum != 0) {
      participateRate = ((actuallyNum / shouldNum) * 100);
    }
    //  console.log(noParticipateNum,actuallyNum,participateRate)
    participateRate = participateRate ? participateRate.toFixed(2) : "0.00";
    // 单词、句子、段落得分
    info.evalTextScoreInfoList.forEach((value) => value["signedCount"] = actuallyNum);
    const scoreDetails = classToNewList(info.evalTextScoreInfoList.length === 0 ? [{}] : info.evalTextScoreInfoList, EdistributionSingle);
    const scoreSnippet = info.scoreAxis || {};

    this.part0 = {
      /**
       * @method 左侧课程班级数据
       * @param  {String}  courseName         课程名称
       * @param  {String}  coursewareName     课件名称
       * @param  {String}  className          班级名称
       * @param  {String}  teacherName        授课教师
       * @param  {String}  havaClassTime      上课时间
       * @param  {String}  roomName               上课教室
       * @param  {Number}  shouldNum          应到人数
       * @param  {Number}  actuallyNum        实到人数
       * @param  {Number}  lackNum            缺到人数
       */
      courseName: courseInfo.courseName || "",
      coursewareName: courseInfo.lessonName || "",
      className: courseInfo.classesName || "",
      teacherName: courseInfo.teacherName || "",
      havaClassTime: timesnow(courseInfo.startTimestamp) || "",
      roomName: courseInfo.roomName || "",
      shouldNum,
      actuallyNum,
      lackNum,
    }
    this.part1 = {
      /**
       * @method 课堂概况
       * @param  {Number}  participateRate      参评率
       * @param  {Number}  classroomNum         课堂人数
       * @param  {Number}  noParticipateNum     未参评人数
       * @param  {Array}   noParticipateList    未参评名单列表
       * @param  {Array}   creditsList          学分榜列表 左至右顺序分别为 平均分、最高分、最低分、优秀率、及格率
       */
      participateRate,
      classroomNum: actuallyNum,
      noParticipateNum,
      noParticipateList: unJoinStudents,
      creditsList: scoreBankLen ? [
        scoreBank["平均分"],
        scoreBank["最高分"],
        scoreBank["最低分"],
        scoreBank["优秀率"],
        scoreBank["及格率"]
      ] : ["0.0分", "0.0分", "0.0分", "100.0%", "0.0%"]
    }
    this.part2 = {
      /**
       * @method 分数段分布
       * @param  {Array}  studentScoreList      学生成绩列表 => 详情参数请看[EstudentScoreSingle](class)
       * @param  {Object} diffcultObj           发音困难对象
       * @param  {Array}  scoreRateListV        人数比例列表数据
       */
      studentScoreList: studentScore,
      diffcultObj: {
        // 人数、占比
        num: scoreSnippet.pronunciationDifficult || 0,
        percent: scoreSnippet.proportion || 0
      },
      scoreRateListV: scoreSnippet.list.map(val => val.yaxisScale) || [
        randomNum(0, 0),
        randomNum(0, 0),
        randomNum(0, 0),
        randomNum(0, 0),
      ],
    }
    this.part3 = {
      /**
       * @method 音标掌握情况
       * @param {Array}  phoneticObj      音标对象 key为音标 value为百分比
       * @param {Array}  difficultList    掌握度最低列表
       */
      phoneticObj: phoneticMasterSituation.data,
      //  difficultList: classToNewList(phoneticMasterSituation.lowestWordList || [1], EphoneticSingle),
      difficultList: [new EphoneticSingle({
        phonetic: phoneticMasterSituation.lowestPhonetic,
        involvingList: phoneticMasterSituation.lowestWordList,
        percent: phoneticMasterSituation.data[phoneticMasterSituation.lowestPhonetic]
      })], //暂定一个
      //  TODO: 模拟数据展示 记得置空
      // phoneticObj: {
      //   "a": randomNum(10, 100),
      //   "b": randomNum(10, 100),
      //   "c": randomNum(10, 100),
      //   "d": randomNum(10, 100),
      //   "e": randomNum(10, 100),
      //   "f": randomNum(10, 100),
      //   "g": randomNum(10, 100)
      // },
      // difficultList: classToNewList([1, 2], EphoneticSingle),
    }
    this.part4 = {
      /**
       * @method 单词、句子、段落得分
       * @param {Array} infoListH           表格列表头
       * @param {Array} distributionList    单词、句子、段落分布列表 => EcontentLevelSingle
       * @param {Array} detailInfoList      详情信息列表 => EdistributionSingle
       */
      detailInfoList: scoreDetails
    }
  }
}
class EstudentScoreSingle {
  constructor(item) {
    /**
     * @method 单个学生成绩类
     * @param  {String}  studentNo        学号
     * @param  {String}  studentName      姓名
     * @param  {Number}  score            总成绩
     * @param  {Number}  scoreWord        单词平均分
     * @param  {Number}  scoreSentence    句子平均分
     * @param  {Number}  scoreSection     段落平均分
     */
    // TODO: 测试完毕记得置空
    this.studentNo = item.student ? item.student.studentNo : item.studentNo || "";
    this.studentName = item.student ? item.student.studentName : item.studentName || "";
    this.score = item.scoreTotal || 0;
    this.scoreWord = item.scoreWord || 0;
    this.scoreSentence = item.scoreSentence || 0;
    this.scoreSection = item.scoreParagraph || 0;
  }
}
class EphoneticSingle {
  constructor(item, type = 0) {
    /**
     * @method 音标掌握度低解析类
     * @param  {String}  phonetic         音标
     * @param  {Number}  percent          百分比
     * @param  {Array}   involvingList    涉及单词列表
     */
    this.phonetic = item.phonetic || "";
    //  this.percent = item.percent ? item.percent.toFixed(2) : 0;
    this.percent = item.percent || "";
    this.involvingList = item.involvingList || [];
    // this.involvingList = item.involvingList || ["apple", "banana", "angle", "angel", "pig"];
  }
}
export class AnalyzeDevice {
  constructor(info = {}) {
    /**
     * @method 课中-课件题目信息
     * @param {Array}  list     课件题目列表: 详细参数在单解析类说明
     */
    this.list = classToNewList(info, AnalyzeDeviceSingle) || [];
  }
}
//解析设备状态
class AnalyzeDeviceSingle {
  /**
   * 
   * @param {*} item 
   */
  constructor(item) {
    this.deviceAlias = item.deviceAlias;
    this.id = item.id;
    this.symbol = item.symbol;
    this.devState = {};
  }
}

class EdistributionSingle {
  constructor(item) {
    /**
     * @method 单词、句子、段落等级解析类
     * @param {String}  evalText             单词、句子、段落
     * @param {Number}  classAVG            班级平均分
     * @param {Object}  numDiffObj          发音困难户对象
     * @param {Object}  phoneticDiffObj     最低得分音标对象
     * @param {Array}   infoList            信息列表: 参评率、未参评人数、最高分、最低分、平均分
     * @param {Array}   noParticipateList   未参评列表
     * @param {Array}   numPercentListV     人数百分比列表 10个
     * @param {Array}   phoneticAVGX        音标发音平均得分X轴列表
     * @param {Array}   phoneticAVGV        音标发音平均得分列表
     */
    const scoreSnippet = item.scoreAxis || {};
    const elementsSnippet = item.phoneticInfo || {};
    const elementsList = elementsSnippet.scoreList || [];
    // TODO: 测试完毕记得置空
    // let wordList = ["apple", "banana", "pig", "scold", "alone ", "author", "Immigrants are provided with sites on which to build their own houses", "The driver slewed the crane round.", "She wrote plays in verse."]
    // this.content = item.difficultContent || wordList[randomNum(0, wordList.length - 1)];
    this.evalText = item.evalText;
    this.classAVG = item.averageScore || randomNum(0, 0);
    // TODO: 测试完毕记得置空
    let length = 0;
    if (item.unEvalStudentList && item.unEvalStudentList.length) {
      length = item.unEvalStudentList.length;
    }
    this.infoList = [
      item.signedCount ? Math.round((item.signedCount / (length+item.signedCount)) * 100 * 100) / 100 : 0,
      length,
      item.highestScore || randomNum(0, 0),
      item.lowestScore || randomNum(0, 0),
      this.classAVG
    ];
    // TODO: 测试完毕记得置空
    this.noParticipateList = classToNewList(item.unEvalStudentList, EstudentScoreSingle);
    // this.noParticipateList = classToNewList([1, 2, 3, 4, 5], EstudentScoreSingle);
    //  this.numDiffObj = {
    //    num: scoreSnippet.pronunciationDifficult || randomNum(0, 0),
    //    percent: scoreSnippet.proportion || randomNum(0, 0)
    //  };
    this.phoneticDiffObj = {
      phonetic: elementsSnippet.lowestPhonetic || "",
      percent: elementsSnippet.lowestPhoneticScore || randomNum(0, 0)
    };
    // TODO: 测试完毕记得置空
    this.numPercentListV = scoreSnippet.list ? scoreSnippet.list.map(val => val.yaxisScale) : [
      randomNum(0, 0),
      randomNum(0, 0),
      randomNum(0, 0),
      randomNum(0, 0),
    ];
    this.phoneticAVGX = [];
    this.phoneticAVGV = [];
    elementsList.forEach((item) => {
      this.phoneticAVGX.push(item.xaxisValue || "");
      this.phoneticAVGV.push(item.yaxisScale || randomNum(0, 0));
    });

    this.phoneticAVGX = this.phoneticAVGX.length ? this.phoneticAVGX : [];
    this.phoneticAVGV = this.phoneticAVGV.length ? this.phoneticAVGV : [];
  }
}
