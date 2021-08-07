import React, { Component } from 'react'
import './index.less'
import {formateDate} from '../../utils/defaultUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import menuList from '../../config/menuConfig'
import {Modal} from 'antd'
import {withRouter} from 'react-router-dom'
import LinkButton from '../link-button'
class Header extends Component {
  state={
    currentTime:formateDate(Date.now()),
    dayPictureUrl:'',
    weather:'',
  }
  getTime = ()=>{
    this.intervalId = setInterval(()=>{
      const currentTime = formateDate(Date.now())
      this.setState({currentTime})
    },1000)
  }
  getTitle = ()=>{
    const path = this.props.location.pathname
    let title
    menuList.forEach(item=>{
      if(item.key===path){
        title = item.title
      }else if(item.children){
        const cItem = item.children.find(cItem=>cItem.key===path)
        if(cItem){
          title = cItem.title
        }
      }
    })
    return title
  }
  logout=()=>{
    Modal.confirm({
      content:'退出登录后网站将退回到登录界面',
      okText:'确定',
      okType:'danger',
      cancelText:'返回',
      onOk:()=>{
        storageUtils.deleteUser()
        memoryUtils.user={}

        this.props.history.replace('/login')
      },
    })
  }

  componentDidMount(){
    this.getTime()
  }
  componentWillUnmout(){
    clearInterval(this.intervalId)
  }
  render() {
    const {currentTime} = this.state
    const username = memoryUtils.user.username
    const title = this.getTitle()
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎，{username}</span>
          {/* <a href="javascript:" onClick={this.logout}>退出</a> */}
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">
            {title}
          </div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <span><img src="http://api.map.baidu.com/images/weather/day/qing.png" alt="weather"/></span>
            <span>晴</span>
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(Header)