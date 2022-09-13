/*
 * @Author: your name
 * @Date: 2021-06-19 11:59:56
 * @LastEditTime: 2021-06-19 12:09:32
 * @LastEditors: Please set LastEditors
 * @Description: 给全局的提示框设置时间
 * @FilePath: \publish-school\src\utils\message.js
 */
import Vue from 'vue'
import ElementUI from 'element-ui';
 
['success', 'warning', 'info', 'error'].forEach(type => {
    ElementUI.Message[type] = options => {
        if (typeof options === 'string') {
            options = {
              message: options,
              duration: 2000
            };
        }
        options.type = type;
        return ElementUI.Message(options);
    };
});
ElementUI.Dialog.props.closeOnClickModal.default=false;

