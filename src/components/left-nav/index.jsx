import React, { Component } from 'react'
import {Link,withRouter} from 'react-router-dom'
import { Menu, Icon, } from 'antd';
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import './index.less'

const SubMenu = Menu.SubMenu
class LeftNav extends Component {
  //根据menu的数据数组生成对应的标签数组
  getMenuNodes_map = (menuList)=>{
    return menuList.map(item=>{
      if(!item.children){
        return(
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      }else{
        return(
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {
              this.getMenuNodes(item.children)
            }
          </SubMenu>
        )
      }
    })
  }

  getMenuNodes = (menuList)=>{
    const path = this.props.location.pathname
    return menuList.reduce((pre,item)=>{
      //向pre添加<Menu.Item>
      if(!item.children){
        pre.push((
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        ))
      }else{
        const cItem = item.children.find(cItem=>cItem.key===path)
        if(cItem){
          this.openKey = item.key
        }
        pre.push((
          <SubMenu
          key={item.key}
          title={
            <span>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </span>
          }
        >
          {
            this.getMenuNodes(item.children)
          }
        </SubMenu>
        ))
      }
      //向pre添加<SubMenu>
      return pre
    },[])
  }
  //在第一次render（）之前执行一次
  //为第一个render（）准备数据（必须同步的）
  componentWillMount(){
    this.menuNodes = this.getMenuNodes(menuList)
  }

  render() {
    //得到当前请求的路由路径
    let path = this.props.location.pathname
    const openKey = this.openKey
    if(path.indexOf('/product')===0){//当前请求的是商品或其子路由的j界面
      path='/product'
    }
    return (
      <div className="left-nav">
        <Link to='/admin'className="left-nav-header">
          <img src={logo} alt=""/>
          <h1>wcy管理系统</h1>
        </Link>
        <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[path]}
            defaultOpenKeys={[openKey]}
          >
            {
              this.menuNodes
            }
          </Menu>
      </div>
    )
  }
}

export default withRouter(LeftNav)