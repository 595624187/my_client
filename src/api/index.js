import ajax from './ajax'
import jsonp from 'jsonp'
import { resolveOnChange } from 'antd/lib/input/Input'
import { message } from 'antd'
//一般写法
/*
export function reqLogin(username,password){
  ajax('/login',{username,password},'POST')
}
*/
//箭头函数
// const BASE = 'http://localhost:5000'
const BASE = ''
export const reqLogin = (username,password)=>ajax(BASE+'/login',{username,password},'POST')
export const reqAddUser = (user)=>ajax(BASE+'/manage/user/add',user,'POST')
export const reqCategorys = (parentId)=>ajax(BASE+'/manage/category/list',{parentId})
export const reqAddCategorys = (categoryName,parentId)=>ajax(BASE+'/manage/category/add',{categoryName,parentId},'POST')
export const reqUpdateCategorys = ({categoryId,categoryName})=>ajax(BASE+'/manage/category/update',{categoryId,categoryName},'POST')
export const reqProducts = (pageNum,pageSize)=>ajax(BASE+'/manage/product/list',{pageNum,pageSize})
export const reqTestFlask = ({currentOption,currentTime})=>ajax(BASE+'/register',{currentOption,currentTime},'POST')
export const reqTestFlask1 = ({currentOption,currentTime})=>ajax(BASE+'/manage/industry/add',{currentOption,currentTime},'POST')
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType})=>ajax(BASE+'/manage/product/search',{
  pageNum,
  pageSize,
  [searchType]:searchName
})
export const reqCategory = (categoryId=>ajax(BASE + '/manage/category/info',{categoryId}))
export const reqUpdateStatus = (productId,status)=>ajax(BASE+'/manage/product/updateStatus',{productId,status},'POST')
export const reqDeleteImg = (name)=>ajax(BASE+'/manage/img/delete',{name},'POST')

export const reqWeather = (city) =>{
  const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=O8472ZPhpdGSrXqrkUnjyHgdIZFEAyq8`
  jsonp(url,{},(err,data)=>{
    console.log('jsonp()',err,data);
    if(!err&&data.status==='success'){
      const {dayPictureUrl,weather} = data.results[0].weather_data[0]
      resolveOnChange({dayPictureUrl,weather})
    }else{
      message.error('获取天气信息失败！')
    }
  })
}
reqWeather('北京')