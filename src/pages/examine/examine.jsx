import React, { Component } from 'react'
import { Steps ,Select,Table,Modal, Button} from 'antd';

const { Step } = Steps;
const {Option} = Select;
const provinceData = ['同意', '拒绝'];
const cityData = {
  同意: [ '审批通过', '已处理'],
  拒绝: ['请勿重复提交', '身份验证失败','时间逾期'],
};


export default class examine extends Component {
    
    state={
      currentStep:0,
      cities: cityData[provinceData[0]],
      secondCity: cityData[provinceData[0]][0],
      visible: false,
      ediable: false,
    }
    showModal = () => {
      this.setState({
        visible: true,
      });
    };
    handleOk = e => {
      console.log(e);
      this.setState({
        visible: false,
        ediable:true,
      });
    };
  
    handleCancel = e => {
      console.log(e);
      this.setState({
        visible: false,
        ediable:false,
      });
    };
    handleProvinceChange = value => {
      this.setState({
        cities: cityData[value],
        secondCity: cityData[value][0],
      });
    };
    onSecondCityChange = value => {
      this.setState({
        secondCity: value,
      });
    };
    render() {
        const {currentStep,cities,ediable} = this.state
        const columns = [
            {
              title: '姓名',
              dataIndex: 'name',
              key: 'name',
              render: text => <a>{text}</a>,
            },
            {
              title: '年龄',
              dataIndex: 'age',
              key: 'age',
            },
            {
              title: '地址',
              dataIndex: 'address',
              key: 'address',
            },
            {
              title:'电话',
              dataIndex:'phone',
              key:'phone',
            },
            {
              title: <span style={{fontWeight:'bolder'}}>审批结果</span>,
              key: 'tags',
              dataIndex: 'tags',
              render: tags => (
                <div >
                  <Select
                    defaultValue={provinceData[0]}
                    style={{ width: 80 }}
                    onChange={this.handleProvinceChange}
                    disabled={ediable}
                  >
                    {provinceData.map(province => (
                      <Option key={province}>{province}</Option>
                    ))}
                  </Select>
                  <Select
                    style={{ width: 150 }}
                    value={this.state.secondCity}
                    onChange={this.onSecondCityChange}
                    disabled = {ediable}
                  >
                    {cities.map(city => (
                      <Option key={city}>{city}</Option>
                    ))}
                  </Select>
                </div>
              ),
            },
            {
              title: '操作',
              key: 'action',
              render: (text, record) => (
                <div>
                  <Button type="primary" onClick={this.showModal}>
                    提交
                  </Button>
                  <Modal
                    title="确定要提交吗"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                  >
                    <p>信息1</p>
                    <p>信息2</p>
                  </Modal>
                </div>
              ),
            },
          ];
          const data = [
            {
              key: '1',
              name: 'John Brown',
              age: 32,
              address: 'New York No. 1 Lake Park',
              phone:'1235564956',
              tags: ['nice', 'developer'],
            },
            {
              key: '2',
              name: 'Jim Green',
              age: 42,
              address: 'London No. 1 Lake Park',
              phone:'15245455245',
              tags: ['loser'],
            },
            {
              key: '3',
              name: 'Joe Black',
              age: 32,
              address: 'Sidney No. 1 Lake Park',
              phone:'15645654345',
              tags: ['cool', 'teacher'],
            },
          ];
          
        const nextTip = ()=>{
          const {currentStep} = this.state
          this.setState({currentStep:currentStep+1})
        }
        function handleChange(value) {
          console.log(`selected ${value}`);
        }
        
        return (
            <div className="examine">
                <Steps current={currentStep}>
                    <Step title="流程开始" description="创建流程" />
                    <Step title="等待处理" subTitle="Left 00:00:08" description="流程正在处理" />
                    <Step title="处理完成" description="审批流程完成" />
                </Steps>
                <Button type="primary" onClick={nextTip} style={{display:'flex',margin:'0 auto',lineHeight:'30px'}}>下一步</Button>

                <Table columns={columns} dataSource={data}></Table>
                
            </div>
        )
    }
}
