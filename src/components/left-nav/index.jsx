import React, { Component } from 'react'
import {Link,withRouter} from 'react-router-dom'
import { Menu, Icon, } from 'antd';
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import './index.less'

const SubMenu = Menu.SubMenu
class LeftNav extends Component {
  state = {
    collapsed: false,
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
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
              this.getMenuNodes_map(item.children)
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
        if(cItem) this.openKey = item.key
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
    // console.log(this);
    const path = this.props.location.pathname
    const openKey = this.openKey
    return (
      <div className="left-nav">
        <Link to='/admin'className="left-nav-header">
          <img src={logo} alt=""/>
          <h1>wcy管理系统</h1>
        </Link>
        <Menu
            selectedKeys={[path]}
            defaultOpenKeys={[openKey]}
            mode="inline"
            theme="dark"
            inlineCollapsed={this.state.collapsed}
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