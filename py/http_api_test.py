#! /usr/bin/env python3
#coding=utf-8

import requests
import time
import hashlib
import json

ip = "192.168.1.243"
port = 8080

salt = "pubSchool_V3"
GMT_FORMAT = '%a %b %d %Y %H:%M:%S GMT+0800 (中国标准时间)'
headers = {
    #24小时有效
    "Token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYxOTY2ODExOH0.XLlPWaYaoeFiifth2o5cTXI0OpmVqQLQfdB3nj_Bo-I",
}


#param create
def get_param(param={}):
    publish_param = {
        "version": "v1.0",
        "platform": "Web",
        "timestamp":"",
    } 
    param.update(publish_param)
    time.localtime(time.time())
    param["timestamp"] = int(time.time()*1000)
    param_l = [i for i in param]
    param_l.sort()
    sign_s = "&".join(["%s=%s"%(i,str(param[i])) for i in param_l])
    sign_s = sign_s + "&" + salt
    param["sign"] = hashlib.md5(sign_s.encode("utf-8")).hexdigest()
    return param

#list
def any_list(url_path,param={}):
    param = get_param(param)
    url = "http://"+ip+":"+str(port)+url_path+"?"
    req = requests.get(url,params=param,headers=headers)
    print(req.request.url)
    print(req.text)

#delete
def any_delete(url_path,param,body=None):
    param = get_param(param)
    url = "http://"+ip+":"+str(port)+url_path+"?"
    if body == None:
        req = requests.delete(url,params=param,headers=headers)
    else:
        i_head = {}
        i_head.update(headers)
        i_head['content-type'] = "application/json"
        req = requests.delete(url,params=param,headers=i_head,data=json.dumps(body))
    print(req.request.url)
    print(req.text)

#add
def any_add(url_path,param,body=None):
    tmp_param = {}
    tmp_param.update(param)
    url = "http://"+ip+":"+str(port)+url_path+"?"
    if body != None and isinstance(body,dict):
        tmp_param.update(body)
    param = get_param(param=param)
    tmp_param = get_param(tmp_param)
    param["sign"] = tmp_param["sign"]
    param["timestamp"] = tmp_param["timestamp"]
    if body == None:
        req = requests.post(url,params=param,headers=headers)
    else:
        i_head = {}
        i_head.update(headers)
        i_head['content-type'] = "application/json"
        req = requests.delete(url,params=param,headers=i_head,data=json.dumps(body))
    print(req.request.url)
    print(req.text)
    pass

# class/add http post
def classes_add(param):
    url_path = "/classes/add"

    param = get_param(param)
    url = "http://"+ip+":"+str(port)+url_path+"?"
    req = requests.post(url,params=param,headers=headers)
    print(req.text)

#classess delete
def classes_delete():
    url_path = "/classes/delete"
    param = get_param()
    url = "http://"+ip+":"+str(port)+url_path+"?"
    i_head = {}
    i_head.update(headers)
    i_head['content-type'] = "application/json"
    body = [1,]
    req = requests.delete(url,params=param,headers=i_head,data = json.dumps(body))
    print(req.text)

#classess list
def classess_list():
    url_path = "/classes/list"
    param = {
        #可缺省
        # "classesName":"四年一班",
        # "pageNo":1,
        # "pageSize":10,
        # "teacherName":"银灰",
    }
    param = get_param(param)
    url = "http://"+ip+":"+str(port)+url_path+"?"
    req = requests.get(url,params=param,headers=headers)
    print(req.request.url)
    print(req.text)

#device delete
def device_delete():
    url_path = "/device/delete"
    param = {
        "deviceId":1000,
        "transitId":19204,
    }
    param = get_param(param)
    url = "http://"+ip+":"+str(port)+url_path+"?"
    req = requests.delete(url,params=param,headers=headers)
    print(req.request.url)
    print(req.text)

#device list
def device_list():
    url_path = "/device/list"
    param = {
        # "pageNo":1,
        # "pageSize":1,
        "symbol":"",    #拾音器mic地址
        # "deviceAlias":"123",
        "transitId":"12314",
    }
    param = get_param(param)
    url = "http://"+ip+":"+str(port)+url_path+"?"
    req = requests.get(url,params=param,headers=headers)
    print(req.request.url)
    print(req.text)

#room add
def room_add(param):
    url_path = "/room/add"
    param = get_param(param)
    url = "http://"+ip+":"+str(port)+url_path+"?"
    req = requests.post(url,params=param,headers=headers)
    print(req.request.url)
    print(req.text)

#room delete
def room_del():
    url_path = "/room/del"
    param = get_param()
    roomIds = [5]
    i_head = {}
    i_head.update(headers)
    i_head['content-type'] = "application/json"
    url = "http://"+ip+":"+str(port)+url_path+"?"
    req = requests.delete(url,params=param,headers=i_head,data=json.dumps(roomIds))
    print(req.request.url)
    print(req.text)

#room list
def room_list():
    url_path = "/room/list"
    param = {
        # "pageNo":1,
        # "pageSize":10,
        # "roomName":"德育楼307教室",
    }
    param = get_param(param)
    url = "http://"+ip+":"+str(port)+url_path+"?"
    req = requests.get(url,params=param,headers=headers)
    print(req.request.url)
    print(req.text)

#room modify
def room_modify():
    url_path = "/room/modify"
    param = {
        "roomId":5,
        "roomName":"德育楼四教室",
    }
    param = get_param(param)
    url = "http://"+ip+":"+str(port)+url_path+"?"
    req = requests.put(url,params=param,headers=headers)
    print(req.request.url)
    print(req.text)

#student add
def student_add():
    url_path = "/student/add"
    body={
        "classesId": 4,
        "studentName": "张三",
        "studentNo": "1990",
        # "symbol": "法外狂徒"
    }
    param = get_param()
    paramt = get_param(body)
    param["timestamp"] = paramt["timestamp"]
    param["sign"] = paramt["sign"]
    i_head = {}
    i_head.update(headers)
    i_head['content-type'] = "application/json"
    url = "http://"+ip+":"+str(port)+url_path+"?"
    req = requests.post(url,params=param,headers=i_head,data=json.dumps(body))
    print(req.request.url)
    print(req.text)

#student modify
def student_modify():
    url_path = "/student/modify"
    param = {
        "id":1, #要修改的学生id
    }
    body = {
    "classesId": 4,
    "studentName": "王五",
    "studentNo": "1900",
    # "symbol": ""
    }
    tmp_param  = {}
    tmp_param.update(param)
    tmp_param.update(body)
    param = get_param(param=param)
    tmp_param = get_param(tmp_param)
    param["sign"] = tmp_param["sign"]
    param["timestamp"] = tmp_param["timestamp"]
    i_head = {}
    i_head.update(headers)
    i_head['content-type'] = "application/json"
    url = "http://"+ip+":"+str(port)+url_path+"?"
    req = requests.put(url,params=param,headers=i_head,data=json.dumps(body))
    print(req.request.url)
    print(req.text)

#student list
def student_list():
    url_path = "/student/list"
    param = {
        "classesId":4,
        # "pageNo":1,
        #"pageSize":2,
        # "studentName":"",
        #"studentNo":""
    }
    any_list(url_path,param)

#student delete
def student_delete():
    url_path = "/student/delete"
    param = {
        "classesId":4,
    }
    body=[1,]
    any_delete(url_path,param,body)


#teacher login
def teacher_login():
    url_path = "/teacher/login"
    param = {
        "account":"00000001",#管理员账号
        "password":"123456",
    }
    # param = {
    #     "account":"1897655921",
    #     "password":"123456",
    # }
    param = get_param(param)
    url = "http://"+ip+":"+str(port)+url_path+"?"
    req = requests.post(url,params=param)
    print(req.request.path_url)
    print(req.text)

#teacher logout
def teacher_logout():
    url_path = "/teacher/logout"
    param = {}
    param = get_param(param)
    url = "http://"+ip+":"+str(port)+url_path+"?"
    req = requests.post(url,params=param,headers = headers)
    print(req.request.path_url)
    print(req.text)

#teacher register
def teacher_register(body):
    url_path="/teacher/register"
    param = {}
    param = get_param(param)
    g_sig = get_param(body)
    param["sign"] = g_sig["sign"]
    param["timestamp"] = g_sig["timestamp"]
    i_head = {}
    i_head.update(headers)
    i_head['content-type'] = "application/json"
    url = "http://"+ip+":"+str(port)+url_path+"?"
    body = json.dumps(body)
    req = requests.post(url,params=param,headers=i_head,data=body)
    print(req.request.url)
    print(req.text)

#teacher list
def teacher_list():
    url_path = "/teacher/list"
    param = {
        # "account":"",
        # "pageNo":1,
        # "pageSize":1,
        # "teacherName":"",
    }
    any_list(url_path,param)

#teacher modify
def teacher_modify():
    url_path = "/teacher/modify"
    param = {
        # "account":"",
        "id":2,
        # "password":"",
        "teacherName":"银灰4",
    }
    param = get_param(param) 
    url = "http://"+ip+":"+str(port)+url_path+"?"
    req = requests.put(url,params=param,headers=headers)
    print(req.request.url)
    print(req.text)

#teacher delete
def teacher_delete():
    url_path = "/teacher/delete"
    body = [4]
    any_delete(url_path,{},body)

#transit add
def transit_add():
    url_path = "/transit/add"
    param = {
        "roomId":6,
        "transitSymbol":"t1",
    }
    any_add(url_path,param)

def transit_list():
    url_path = "/transit/list"
    param = {
        "roomId":6,
        # "transitSymbol":"t1"
    }
    any_list(url_path,param)

def transit_delete():
    url_path = "/transit/del"
    param = {
        "roomId":6,
        "transitId":1,
    }
    any_delete(url_path,param)

#teacher list
teachers_list = [
    {
        "account":"1897655921",
        "password":"123456",
        "teacherName":"银灰",
    },
    {
        "account":"1897655922",
        "password":"123456",
        "teacherName":"银灰2",
    },
    {
        "account":"1897655923",
        "password":"123456",
        "teacherName":"银灰3",
    },
]

def teachers_list_add():
    for i in teachers_list:
        teacher_register(i)

class_list = [
    {
        "classesName":"四年三班",
        "teacherName":"银灰",
        # "version":"v3.0",
    },
    {
        "classesName":"四年四班",
        "teacherName":"银灰3",
        # "version":"v3.0",
    },
    {
        "classesName":"四年二班",
        "teacherName":"银灰2",
        # "version":"v3.0",
    },
    {
        "classesName":"四年一班",
        "teacherName":"银灰",
        # "version":"v3.0",
    },
]

def classes_list_add():
    for i in class_list:
        classes_add(i)

rooms_list = [
    {
        "roomName":"德育楼307教室",
    },
    {
       "roomName":"德育楼309教室",
    },
    {
       "roomName":"德育楼302教室",
    },
    {
       "roomName":"德育楼301教室",
    },
]

def room_list_add():
    for i in rooms_list:
        room_add(i)

if __name__ == "__main__":
    # transit_add()
    # room_list()
    # teacher_list()
    # teacher_delete()
    # teacher_list()
    # teacher_login()
    # teacher_logout()
    student_list()