import mqtt from 'mqtt'
import Vue from 'vue'
import { isDelayTime, printLog } from 'utils/util';
import {
  CLIENTSYMBOL,
} from 'utils/const';
import { options } from 'less';
// 生成一个随机客户端ID
function randomClientId() {
  return CLIENTSYMBOL + Math.random().toString(16).substr(5, 7);
}
// mqtt服务连接
function connect(Bus) {
  let mqttUrl = process.env.MQTT_URL;
  let clientId = randomClientId();
  let client = mqtt.connect(mqttUrl, {
    clean: true,
    clientId,
    keepalive: 10,
    username: "admin",
    password:"password",
    reconnectPeriod: 200,
    connectTimeout: 30 * 1000,
    protocolId: "MQIsdp",
    protocolVersion: 3,
    will: {
      topic: `web/will`,
      payload: `The front end is disconnect => web/will`,
      qos: 1
    }
  })

  // printLog("[MQTT] 服务器地址 =>", process.env);
  // printLog("[MQTT] Bus =>", Bus);
  // printLog("[MQTT] 客户端ID =>", clientId);


  Vue.prototype.$mqtt =  {
    // [发布主题]
    publish(topic, message, retain) {
      printLog('[MQTT] 前端发布主题 =>', `Topic: ${topic}`, message);
      if (typeof message != "string") {
        message = JSON.stringify(message);
      }
      // 是否需要保留服务器消息
      if (retain) {
        // printLog('[MQTT] 前端发布主题 =>22222', `Topic: ${topic}`, message);
        client && client.publish(topic, message, {retain: retain});
      } else {
        client && client.publish(topic, message);
      }
    },

    // [订阅主题]
    subscribe(topic, cb) {
      printLog('[MQTT] 前端订阅主题 =>', `Topic: ${topic}`);
      client && client.subscribe(topic, cb)
    },

    // [取消订阅]
    unsubscribe(topic, opt) {
      printLog('[MQTT] 前端取消订阅 =>', `Topic: ${topic}`);
      client && client.unsubscribe(topic, opt)
    },

    // TODO: 暂时废弃 [消息接收]
    // onmessage(callback) {
    //   client && client.on('message', (topic, message) => {
    //     let result = 1;
    //     try {
    //       message = JSON.parse(message.toString());
    //       // console.log(message);
    //     } catch (error) {
    //       printLog('[MQTT] 前端中转处理出错 =>', `ERROR: ${error}`);
    //       result = 0;
    //       message = {};
    //     }
    //     const data = {
    //       result,
    //       topic,
    //       message,
    //       // 获取到当前消息的时间戳
    //       timestamp: +new Date(),
    //     }
    //     callback(data);
    //   })
    // },

    // 事件监听
    onEvents() {
      // 连接成功
      client.on('connect', () => {
        printLog('[MQTT] 连接成功 =>', `客户端ID: ${client.options.clientId}`);
        console.log("\n\n");
      })

      // 监听正常消息
      client.on('message', (topic, message) => {
        let result = 1;
        try {
          message = JSON.parse(message.toString());
        } catch (error) {
          // printLog('[MQTT] 前端中转处理出错 =>', `ERROR: ${error}`);
          result = 0;
          message = {};
        }
        // 封装消息体
        const res = {
          result,
          topic,
          message,
          // 获取到当前消息的时间戳
          timestamp: +new Date(),
        }
        Bus.$emit(topic, res);
      })

      // 接收异常消息
      client.on('error', error => {
        printLog('[MQTT] 异常 =>', `客户端ID: ${client.options.clientId}`);
      })

      // 接收离线消息
      client.on('offline', e => {
        // 更換clientId
        client.options.clientId = randomClientId();
        printLog('[MQTT] 断线重连 =>', `客户端ID: ${client.options.clientId}`);
        // client.reconnect()
      })

      // 关闭消息
      client.on('close', e => {
        printLog('[MQTT] 关闭连接 =>', `客户端ID: ${client.options.clientId}`);
      })

      // 接收重连消息
      client.on('reconnect', error => {
        printLog('[MQTT] 正在重连 =>', `客户端ID: ${client.options.clientId}`);
      })
    },

    // 关闭mqtt
    onEnd() {
      printLog('[MQTT] 等待关闭 =>', `客户端ID: ${client.options.clientId}`);
      client && client.end();
    },
  }
  return client;



}

// 导出使用
function init(vue) {
  new connect(vue);
}

export { init }
