import React, {Component} from 'react';
import {Card, Form, Input, Cascader,Button, Upload, Icon,Modal} from 'antd'
import LinkButton from "../../components/link-button";
import{reqCategorys} from "../../api";
import PicturesWall from "./pictures-wall";
const {Item} = Form
const TextArea = Input.TextArea
const options = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        isLeaf: false,
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        isLeaf: false,
    },
   {
        value: 'beijin',
        label: 'beijin',
        isLeaf: false,
    },
   {
        value: 'tianjin',
        label: 'tianjin',
        isLeaf: true,
    },

];
class ProductAddUpdate extends Component {
    state = {
        options,
    };
    constructor(props) {
        super(props);
        this.pw = React.createRef()
    }
    //异步获取一级/二级分类列表，并显示
    initOptions = async (categorys)=>{
        const options = categorys.map(c=>({
            value:c._id,
            label:c.name,
            isLeaf:false //不是叶子
        }))
        //如果是一个二级分类商品的更新
        const {isUpdate,product} = this
        const {pCategoryId,categoryId} = product
        if(isUpdate && pCategoryId!=='0'){
            //获取对用的二级分类商品列表
            const subCategorys = await this.getCategorys(pCategoryId)
            //生成二级下拉列表options
            const childOptions = subCategorys.map(c=>({
                value:c._id,
                label:c.name,
                isLeaf:true,
            }))
            //找到当前商品对应的一级
            const targetOption = options.find(option=>option.value===pCategoryId)
            //关联对应的一级option上
            targetOption.children = childOptions
        }

        this.setState({options})
    }
    getCategorys = async (parentId)=>{
        const result = await reqCategorys(parentId)
        if(result.data.status===0){
            const categorys = result.data.data
            if(parentId==='0'){
                this.initOptions(categorys)
            }else{
                return categorys
            }
        }
    }
    submit = () =>{
        this.props.form.validateFields((error,values)=>{
            if(!error){
                const pw = this.pw.current
                const imgs = pw.getImgs()
                console.log(imgs)
            }
        })
    }
    validatePrice = (rule,value,callback)=>{
        if(value*1>0){
            callback()
        }else{
            callback('价格必须大于0')
        }
    }
    loadData = async selectedOptions => {
        //得到选择的option对象
        const targetOption = selectedOptions[0];
        //显示Loading
        targetOption.loading = true;
        // 模拟请求获取二级列表数据，并更新
        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false;
        if(subCategorys && subCategorys.length>0){
            //生成一个二级列表的options
            const childOptions = subCategorys.map(c=>({
                value:c._id,
                label:c.name,
                isLeaf:true,
            }))
            //关联到当前option上
            targetOption.children = childOptions
        }else{
            targetOption.isLeaf = true
        }
        this.setState({
            options:[...this.state.options]
        })
    };
    onChange = (value, selectedOptions) => {
        // console.log(value, selectedOptions);

    };
    componentDidMount() {
        this.getCategorys('0')
    }
    componentWillMount() {
        //取出携带的state
        const product = this.props.location.state
        this.isUpdate = !!product
        this.product = product||{}
    }

    render() {
        const {isUpdate,product} = this
        const {pCategoryId,categoryId} = product
        //指定Item布局的配置对象
        const formItemLayout = {
            labelCol:{span:2},
            wrapperCol:{span:8}
        }
        const categoryIds = [] //用来接收级联分类ID的数组
        if(isUpdate){
            //商品是一级分类商品
            if(pCategoryId==='0'){
                categoryIds.push(categoryId)
            }else{
                //商品是二级分类商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }

        }
        const title=(
          <span>
              <LinkButton onClick={()=>this.props.history.goBack()}>
                 <Icon type='arrow-left'/>
             </LinkButton>
              <span>{isUpdate?'修改商品':'添加商品'}</span>
          </span>
        )
        const {getFieldDecorator} = this.props.form
        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label='商品名称'>
                        {getFieldDecorator('name', {
                            initialValue:product.name,
                            rules:[
                                {required:true,message:'必须输入商品名称'}
                            ]
                        })(<Input placeholder='请输入商品名称'/>)
                        }
                    </Item>
                    <Item label='商品描述'>
                        {getFieldDecorator('desc', {
                            initialValue:product.desc,
                            rules:[
                                {required:true,message:'必须输入商品描述'}
                            ]
                        })(<TextArea
                          placeholder='请输入商品描述'
                          autosize={{minRows:2,maxRows:6}}
                        />)
                        }

                    </Item>
                    <Item label='商品价格'>
                        {getFieldDecorator('price', {
                            initialValue:product.price,
                            rules:[
                                {required:true,message:'必须输入商品描述'},
                                {validator:this.validatePrice}
                            ]
                        })(<Input
                          type='number'
                          placeholder='请输入商品价格'
                          addonAfter='元'
                        />)
                        }

                    </Item>
                    <Item label='商品分类'>
                        {getFieldDecorator('categoryIds', {
                            initialValue:categoryIds,
                            rules:[
                                {required:true,message:'必须输入商品分类'},
                            ]
                        })(<Cascader
                          options={this.state.options}
                          loadData={this.loadData}
                          placeholder='请指定商品分类'
                          onChange={this.onChange}
                          // changeOnSelect
                        />)
                        }

                    </Item>
                     <Item label='商品图片'>
                         <PicturesWall ref={this.pw}/>
                    </Item>
                    <Item label='商品详情'>
                        <span>商品详情</span>
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        );
    }
}

export default Form.create()(ProductAddUpdate)
