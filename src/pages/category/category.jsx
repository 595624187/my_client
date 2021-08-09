import React, { Component } from 'react'
import {
  Card,
  Table,
  Button,
  Icon,
  message,
  Modal,
}from 'antd'
import LinkButton from '../../components/link-button'
import {reqCategorys,reqUpdateCategorys,reqAddCategorys} from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'
export default class Category extends Component {
  state={
    loading:false,//是否正在获取数据中
    categorys:[],//一级分类列表
    subCategorys:[],//二级分类列表
    parentId:'0',//当前需要显示的分类列表的父分类Id
    parentName:'',//当前需要显示的分类列表的父分类名称
    showStatus:0,//标识添加/跟新的确认框是否显示,0:都不显示，1：显示甜腻骄傲，2：显示更新
  }
  initColumns = ()=>{
    this.columns = [
      {
        title:'分类的名称',
        dataIndex:'name',
      },
      {
        title:'操作',
        width:300,
        render:(category)=>(
          <span>
            <LinkButton onClick={()=>this.showUpdate(category)}>修改分类</LinkButton>
            {this.state.parentId==='0'?<LinkButton onClick={()=>this.showSubCategorys(category)}>查看子分类</LinkButton>:null}
          </span>
        )
      },

    ]
  }
  getCategorys= async (parentId)=>{
    this.setState({loading:true})
    parentId = parentId||this.state.parentId
    const result = await reqCategorys(parentId)
    this.setState({loading:false})    
    if(result.data.status===0){
      const categorys = result.data.data
      if(parentId==='0'){
        this.setState({categorys})
      }else{
        this.setState({
          subCategorys:categorys
        })
      }
    }else{
      message.error('获取列表失败')
    }
  }
  showCategorys=()=>{
    this.setState({
      parentId:'0',
      parentName:'',
      subCategorys:[],
    })
  }
  showSubCategorys=(category)=>{
    //更新状态
    this.setState({
      parentId:category._id,
      parentName:category.name
    },()=>{
      this.getCategorys()
    })
  }
  //响应点击取消：隐藏确认框
  handleCancel=()=>{
    //清除输入数据
    this.form.resetFields()
    this.setState({
      showStatus:0
    })
  }
  showAdd=()=>{
    this.setState({
      showStatus:1
    })
  }
  showUpdate=(category)=>{
    this.category=category
    this.setState({
      showStatus:2
    })
  }
  //添加分类
  addCategory= ()=>{
    this.form.validateFields(async (err,values)=>{
      if(!err){
        this.setState({
          showStatus:0
        })
        const {categoryName,parentId} = values
        this.form.resetFields()
        const result = await reqAddCategorys(categoryName,parentId)
        if(result.data.status===0){
          if(parentId===this.state.parentId){
            this.getCategorys()
          }else if(parentId==='0'){
            this.getCategorys('0')
          }
        }
      }
    })


  }
  //跟新分类
  updateCategory=()=>{
    console.log('update');
    this.form.validateFields(async (err,values)=>{
      if(!err){
        this.setState({
          showStatus:0
        })
        const categoryId = this.category._id

        const {categoryName} = values
        console.log(categoryId)
        console.log(categoryName)
        const result= await reqUpdateCategorys({
          categoryId,categoryName
        })

        //清除输入数据
        this.form.resetFields()

        if(result.data.status===0){
          this.getCategorys()
        }
      }
    })


  }
  //为第一次render（）准备数据
  componentWillMount(){
    this.initColumns()
  }
  //执行异步任务：发异步ajax请求
  componentDidMount(){
    this.getCategorys()
  }
  render() {
    const {categorys,subCategorys,showStatus,parentId,parentName,loading} = this.state

    const category = this.category||{}

    const title= parentId==='0'?'一级分类列表':(
    <span>
      <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
      <Icon type='arrow-right' style={{marginRight:5}}></Icon>
      <span>{parentName}</span>
    </span>
    )

    const extra = (
      <Button type='primary' onClick={this.showAdd}>
        <Icon type='plus'></Icon>
        添加
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table dataSource={parentId==='0'?categorys:subCategorys} 
        columns={this.columns}
        bordered
        rowKey='_id'
        loading={loading}
        pagination={{defaultPageSize:5,showQuickJumper:true}}
        >
        </Table>
        
        <Modal
          title='添加分类'
          visible={showStatus===1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm
            parentId={parentId}
            categorys={categorys}
            setForm={(form)=>{this.form=form}}
          />
        </Modal>

        <Modal  
          title='更新分类'
          visible={showStatus===2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
        <UpdateForm 
        categoryName={category.name}
        setForm={(form)=>{this.form=form}}/>
        </Modal>
      </Card>
    )
  }
}
