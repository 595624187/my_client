import axios from 'axios'
import {message} from 'antd'
export default function ajax(url,data={},type='GET'){
  return new Promise((resolve,reject)=>{
    /*
    1.执行异步ajax请求
    2.如果成功了，调用resolve（value）
    3.如果失败了，不调用reject（reason），而是提示异常信息
     */
    let promise
    if(type==='GET'){
      promise = axios.get(url,{
        params:data
      })
    }else{
      promise = axios.post(url,data)
    }

    promise.then(response=>{
      resolve(response)
    }).catch(error=>{
      message.error('请求出错了:'+error.message)
    })
  })
 
}