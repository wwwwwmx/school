/**
 * @method 时间戳
 * @param {*} timestamp  时间戳
 */
const dateTimer = (timestart, timeend) => {
  let date = new Date(timestart) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let dateend = new Date(timeend)
  let Y = date.getFullYear() + '-'
  let M =
    (date.getMonth() + 1 < 10 ?
      '0' + (date.getMonth() + 1) :
      date.getMonth() + 1) + '-'
  let D =
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  let h =
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  let m =
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())+' ' +'—' +' '
    let YEnd = dateend.getFullYear() + '-'
    let MEnd =
      (dateend.getMonth() + 1 < 10 ?
        '0' + (dateend.getMonth() + 1) :
        dateend.getMonth() + 1) + '-'
    let DEnd =
      (dateend.getDate() < 10 ? '0' + dateend.getDate() : dateend.getDate()) + ' '
  let hEnd = (dateend.getHours() < 10 ? '0' + dateend.getHours() : dateend.getHours()) + ':'
  let mEnd =
    (dateend.getMinutes() < 10 ? '0' + dateend.getMinutes() : dateend.getMinutes())

  return Y + M + D + h + m + YEnd + MEnd + DEnd + hEnd + mEnd
};
const times = (timestart, timeend) => {
  let date = new Date(timestart) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let dateend = new Date(timeend)
  let Y = date.getFullYear() + '-'
  let M =
    (date.getMonth() + 1 < 10 ?
      '0' + (date.getMonth() + 1) :
      date.getMonth() + 1) + '-'
  let D =
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  let h =
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  let m =
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
    '-'
  let hEnd = (dateend.getHours() < 10 ? '0' + dateend.getHours() : dateend.getHours()) + ':'
  let mEnd =
    (dateend.getMinutes() < 10 ? '0' + dateend.getMinutes() : dateend.getMinutes())

  return Y + M + D + h + m + hEnd + mEnd
};
const getTime = (timestamp) => {
  let date = new Date(timestamp)
  let Y = date.getFullYear() + '-'
  let M =
    (date.getMonth() + 1 < 10 ?
      '0' + (date.getMonth() + 1) :
      date.getMonth() + 1) + '-'
  let D =
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  let h =
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  let m =
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
  return Y + M + D + h + m
};
const timejoin = (timestart) => {
  let date = new Date(timestart) //时间戳为10位需*1000，时间戳为13位的话不需乘1000

  let Y = date.getFullYear() + '-'
  let M =
    (date.getMonth() + 1 < 10 ?
      '0' + (date.getMonth() + 1) :
      date.getMonth() + 1) + '-'
  let D =
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())



  return Y + M + D
};
const timesnow = (timestart) => {
  let date = new Date(timestart) //时间戳为10位需*1000，时间戳为13位的话不需乘1000

  let Y = date.getFullYear() + '-'
  let M =
    (date.getMonth() + 1 < 10 ?
      '0' + (date.getMonth() + 1) :
      date.getMonth() + 1) + '-'
  let D =
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  let h =
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  let m =
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())


  return Y + M + D + h + m
};

// 把日期转换成时间戳
const timeparse = (date) => {
  return new Date(date).getTime()

}
// 导出给外部使用
export {
  dateTimer,
  times,
  timejoin,
  timeparse,
  timesnow,
  getTime
}
