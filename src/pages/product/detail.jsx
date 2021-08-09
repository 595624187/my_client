import React, {Component} from 'react';
import {
    Card,
    Icon,
    List,
}from 'antd'
import {reqCategory} from "../../api";
import LinkButton from "../../components/link-button";
import {BASE_IMG_URL} from "../../utils/contants";

const Item = List.Item
class ProductDtail extends Component {
  state={
    cName1:'',
    cName2:'',
  }
  async componentWillMount() {
    const{pCategoryId,categoryId} =this.props.location.state.product
    if(pCategoryId==='0'){
      const result = await reqCategory(categoryId)
      const cName1 = result.data.data.name
      console.log(result)
      this.setState({cName1})
    }else{
      /*
      //通过多个await方式发送请求：后面一个是在前一个请求成功之后才发送
      const result1 = await reqCategory(pCategoryId)
      const result2 = await reqCategory(categoryId)
      const cName1 = result1.data.data.name
      const cName2 = result2.data.data.name
      */
      //一次性发送多个请求，只有都成功了，才正常处理
      const results = await Promise.all([reqCategory(categoryId),reqCategory(pCategoryId)])
      const cName1 = results[1].data.data.name
      const cName2 = results[0].data.data.name
      this.setState({cName1,cName2})
    }
  }

  render() {
      //读取携带过来的state数据
      const {product} = this.props.location.state
      const {name,desc,price,detail,imgs} = product
      const{cName1,cName2} = this.state
        const title=(
          <span>
            <LinkButton>
                <Icon type='arrow-left'
                      style={{color:'green',marginRight:15,fontSize:20}}
                      onClick={()=>this.props.history.goBack()}
                />
            </LinkButton>
              <span>商品详情</span>
          </span>
        )
        return (
            <Card title={title} className='product-detail' key={product._id}>
                <List>
                    <Item>
                        <span className='left'>商品名称:</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品描述:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品价格:</span>
                        <span>{price}</span>
                    </Item>
                  <Item>
                        <span className='left'>所属分类:</span>
                        <span>{cName1}{cName2?'-->'+cName2:''}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品图片:</span>
                        <span>
                          {
                            imgs.map(img=>{
                              return(
                                <img className='product-img' src={BASE_IMG_URL+img} alt="img" key={img}/>
                              )
                            })
                          }
                        </span>
                    </Item>
                     <Item>
                        <span className='left'>商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html:detail}}>
                        </span>
                    </Item>
                </List>
            </Card>
        );
    }
}

export default ProductDtail;