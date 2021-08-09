import React, {Component} from 'react';
import {
    Card,
    Select,
    Button,
    Icon,
    Table,
    Input, message,
} from 'antd'
import {reqProducts,reqSearchProducts,reqUpdateStatus} from '../../api'
import LinkButton from "../../components/link-button";
import {PAGE_SIZE} from "../../utils/contants";
const Option = Select.Option
class Home extends Component {
    state = {
        total:0,
        products:[],
        loading:false,
        searchName:'',
        searchType:'productName',
    }
    initColumns = ()=>{
        this.columns = [
            {
                width:'20%',
                title:'商品名称',
                dataIndex:'name',
            },
            {

                title:'商品描述',
                dataIndex:'desc',
            },
            {
                title:'价格',
                width:'20%',
                dataIndex:'price',
                render:(price)=>{
                    return '￥'+price
                }
            },
            {
                title:'状态',
                width:100,
                // dataIndex:'status',
                render:(product)=>{
                    const {status,_id} = product
                    const newStatus = status===1?2:1
                    return(
                        <span>
                            <Button type='primary' onClick={()=>{this.updateStatus(_id,newStatus)}}> {status===1?'下架':'上架'}</Button>
                            <span>{status===1?'在售':'已下架'}</span>
                        </span>
                    )
                }
            },
            {
                title:'操作',
                width:120,
                render:(product)=>{
                    return(
                        <span>
                            <LinkButton onClick={()=>{this.props.history.push('/product/detail', {product})}}>详情</LinkButton>
                            <LinkButton onClick={()=>{this.props.history.push('/product/addupdate',product)}}>修改</LinkButton>
                        </span>
                    )
                }
            }
        ]
    }
    getProducts = async (pageNum)=>{
        this.pageNum = pageNum
        this.setState({loading:true})
        const {searchName,searchType} = this.state
        let result
        if(searchName){
            result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
        }else{
            result = await reqProducts(pageNum,PAGE_SIZE)
        }
        this.setState({loading:false})
        if(result.data.status===0){
            const {total,list} = result.data.data
            this.setState({
                total,
                products:list
            })
        }
    }

    updateStatus = async (productId,status)=>{
        const result = await reqUpdateStatus(productId,status)
        console.log(result)
        if(result.data.status===0){
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }
    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getProducts(1)
    }

    render() {
        const {products,total,loading,searchName,searchType} = this.state
        const title = (
            <span>
                <Select
                  value={searchType}
                  style={{width:150}}
                  onChange={value=>this.setState({searchType: value})}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input
                  placeholder='关键字'
                  value={searchName}
                  style={{width:200 ,margin:'0 15px'}}
                  onChange={event=>this.setState({searchName:event.target.value})}
                />
                <Button type='primary' onClick={()=>this.getProducts(1)}>搜索</Button>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={()=>this.props.history.push('/product/addupdate')}>
                <Icon type='plus'/>
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    dataSource={products}
                    columns={this.columns}
                    rowKey='_id'
                    loading={loading}
                    pagination={{
                        total,
                        defaultPageSize:3,
                        showQuickJumper:true,
                        // onChange:{(pageNum)=>{this.getProducts(pageNum)}}
                        onChange:this.getProducts
                    }}
                />
            </Card>
        );
    }
}

export default Home;