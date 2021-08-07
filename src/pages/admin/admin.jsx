import React, { Component } from 'react'
import {Layout} from 'antd'
import {Redirect, Route,Switch} from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import Examine from '../examine/examine'
import Industry from '../industry/industry'
const {Footer,Sider,Content} = Layout
export default class admin extends Component {
  test=()=>{
    this.props.history.push('/login')
  }
  render() {
    const user = memoryUtils.user
    //如果内存中没有user=>没有登录
    if(!user||!user._id){
      //自动跳转到登陆（在render（））中
      return <Redirect to='/login'/>
    }else{
      return (
        <Layout style={{height:'100%'}}>
          <Sider>
            <LeftNav/>
          </Sider>
          <Layout>
            <Header>Header</Header>
            <Content style={{height:2000,margin:20,background:'#fff',overflowY:'scroll'}}>
              <Switch>
                <Route path='/home' component={Home}/>
                <Route path='/category' component={Category}/>
                <Route path='/role' component={Role}/>
                <Route path='/user' component={User}/>
                <Route path='/product' component={Product}/>
                <Route path='/charts/bar' component={Bar}/>
                <Route path='/charts/line' component={Line}/>
                <Route path='/charts/pie' component={Pie}/>
                <Route path='/industry' component={Industry}/>
                <Route path='/examine' component={Examine}></Route>
                <Redirect to='/home'/>
              </Switch>
            </Content>
            <Footer style={{textAlign:'center',color:'#cccccc'}}>使用火狐浏览器，可以获得更加简洁的页面操作</Footer>
          </Layout>
        </Layout>
      )
    }
    
  }
}
