import React, { Component } from 'react'
import './login.less'
import logo from '../../assets/images/logo.png'
import { Form, Icon, Input, Button, message } from 'antd';
import {reqLogin} from '../../api'
import storageUtils from '../../utils/storageUtils'
import memoryUtils from '../../utils/memoryUtils'
import { Redirect } from 'react-router-dom';
class login extends Component {
  back = ()=>{
    this.props.history.go(-1)
  }
  handleSubmit = (event)=>{
    event.preventDefault()
    this.props.form.validateFields(async (err,values)=>{
      if(!err){
        const {username,password} = values
        const response = await reqLogin(username,password)
        const result = response.data
        if(result.status===0){
          message.success('登录成功')
          //保存user
          const user = result.data
          memoryUtils.user = user
          storageUtils.saveUser(user)
          //跳转到管理界面
          this.props.history.replace('/')
        }else{
          message.error(result.msg)
        }
      }else{
        message.error('验证失败',err)
      }
    })
  }
  validateName = (rule,value,callback)=>{
    if(!value){
      callback('账号必须输入')
    }else if(value.length<4){
      callback('账号长度不能小于4位')
    }else if(value.length>12){
      callback('账号的长度不能大于12位')
    }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
      callback('账号必须是英文、数字或下滑线组成')
    }else{
      callback()
    }
  }
  validatePwd = (rule,value,callback)=>{
    // console.log('validator()',rule,value);
    if(!value){
      callback('密码必须输入')
    }else if(value.length<4){
      callback('密码长度不能小于4位')
    }else if(value.length>12){
      callback('密码的长度不能大于12位')
    }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
      callback('密码必须是英文、数字或下滑线组成')
    }else{
      callback()//验证通过
    }
  }
  render() {
    const user = memoryUtils.user
    if(user&&user._id){
      return <Redirect to='/admin'/>
    }else{
      const {getFieldDecorator} = this.props.form
      return (
        <div className="login">
          <header className="login-header">
            <img src={logo} alt=""/>
            <h1>React项目：后台管理系统</h1>
          </header>
          <section className="login-content">
            <h2>用户登录</h2>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <Form.Item>
               {
                 getFieldDecorator('username',{
                  rules:[
                    {
                      validator:this.validateName
                    }
                  ]
                 })(
                  <Input
                    prefix={<Icon type="user"/>}
                    placeholder="账号"
                  />  
                 )
               }
              </Form.Item>
              <Form.Item>
                {
                  getFieldDecorator('password',{
                    rules:[
                      {
                        validator:this.validatePwd
                      }
                    ]
                  })(
                  <Input
                    prefix={<Icon type="lock" />}
                    type="password"
                    placeholder="密码"
                  />
                  )
                }
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                 登录
                </Button>
                <Button type="primary" onClick={this.back} className="login-form-button">返回</Button>
              </Form.Item>
            </Form>
          </section>
        </div>
      )
    }
  }
}
const WrapLogin = Form.create()(login)
export default WrapLogin


/*
async 和 await
1.作用？
  简化promise对象的使用：不再使用then（）来指定成功、失败的回调函数
  以同步编码（没有回调函数了）方法实现异步流程
2.哪里写await？
  在返回promise的表达式左侧写await：不想要promise，想要promise异步执行的成功的value数据
3.哪里写async？
  await所在函数（最近的）定义的左侧写
*/