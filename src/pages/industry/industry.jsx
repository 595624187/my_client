import React, { Component } from 'react'
import {Descriptions,Select,Upload, message, Button,Icon} from 'antd'
import './industry.less'
import ajax from '../../api/ajax'
import {Form} from 'antd'
import industryList from '../../config/industryConfig'
import {reqTestFlask,reqTestFlask1} from '../../api'
import axios from 'axios'
const{Option} = Select
class industry extends Component {
    state={
        currentOption:''
    }
    getMenuNodes = (industryList)=>{
        return industryList.map(item=>{
            return(
                <div className="item">
                    <div className="item-title">{item.title}</div>
                    {item.children.map((res,index)=>{
                        return(
                            <div classNmae="item-content">
                                 {(index+1)+'.'+res.detail}
                            </div>
                        )
                        })}
                </div>
            )
        })
    }
    getTitle = (industryList)=>{
        return industryList.map(item=>{
            // console.log(item.title);
            return <Option value={item.title}>{item.title}</Option>

        })
    }
    handleSub=()=>{
        const {currentOption} = this.state
        console.log({currentOption});
        let currentTime = new Date()
        // ajax('/register',{currentOption,currentTime},'POST').then(res=>{
        //     console.log(res);
        // })
        reqTestFlask({currentOption,currentTime}).then(res=>{
            console.log('Flask请求'+res);
        })
        reqTestFlask1({currentOption,currentTime}).then(res=>{
            console.log('Node请求');
            console.log(res);
        })
    }
    componentWillMount(){
        this.menuNodes = this.getMenuNodes(industryList)
        // console.log(this.getTitle(industryList));
        // let res = reqTestFlask('jack1')
        this.setState({currentOption:industryList[0].title})
        
    }
    onChange=(value) => {
        console.log(`selected ${value}`);
        this.setState({currentOption:value})
        console.log('state:'+this.state['currentOption'])
      }
    render() {
        const props = {
            name: 'file',
            action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            headers: {
              authorization: 'authorization-text',
            },
            onChange(info) {
              if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
              }
              if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
              } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
              }
            },
          };
        
          
          function onBlur() {
            console.log('blur');
          }
          
          function onFocus() {
            console.log('focus');
          }
          
          function onSearch(val) {
            console.log('search:', val);
          }
        return (
            <div className="industry">
                <Descriptions title="说明" className="industry-disc">
                    <Descriptions.Item>1.文件格式：.xlsx、.xls、.csv</Descriptions.Item>
                    <Descriptions.Item>2.结果通过邮箱发送</Descriptions.Item>
                    <Descriptions.Item>3.因邮件附件大小限制，原始文件列数不要太多</Descriptions.Item>
                </Descriptions>
                <Descriptions title="格式要求">
                    <Descriptions.Item>
                        {
                            this.menuNodes
                        }
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions title="定位维度*">
                    <Descriptions.Item>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="请选择维度"
                        optionFilterProp="children"
                        onChange={this.onChange}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onSearch={onSearch}
                        defaultValue={industryList[0].title}
                    >
                        {
                            industryList.map(item=>{
                                return(
                                    <Option value={item.title}>{item.title}</Option>
                                )
                            })
                        }

                    </Select>
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions title="文件*">
                    <Descriptions.Item>
                        <Upload {...props}>
                            <Button style={{marginRight:20}}>
                              <Icon type="upload" /> 点击选择文件
                            </Button>
                        </Upload>
                             <Button type="primary" onClick={this.handleSub}>提交</Button>
                    </Descriptions.Item>
                </Descriptions>
            </div>
        )
    }
}
export default Form.create()(industry)