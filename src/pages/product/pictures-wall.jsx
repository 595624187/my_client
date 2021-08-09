import {Upload, Icon, Modal, message} from 'antd';
import React from 'react'
import {reqDeleteImg} from "../../api";

export default class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',//标识是否显示大图预览Modal
    fileList: [
      {
        uid: '-1',//每个file都有自己唯一的id
        name: 'image.png',//图片文件名
        status: 'done',//图片状态：done-已上传 uploading：正在上传中 removed：已删除
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',//图片地址
      },
      {
        uid: '-5',
        name: 'image.png',
        status: 'error',
      },
    ],
  };
/*
* 获取所有已上传图片文件名的数组
* */
  getImgs = () =>{
    return this.state.fileList.map(file=>file.name)
  }
  handleCancel = () => this.setState({ previewVisible: false });
  handlePreview = async file => {
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = async ({ file,fileList }) => {
    console.log('handleChange()',fileList[fileList.length-1],file.status,file,file===fileList[fileList.length-1])
    if(file.status==='done'){
      const result = file.response
      if(result.status===0){
        message.success('上传图片成功！')
        const {name,url} = result.data
        file = fileList[fileList.length-1]
        file.url = url
        file.name = name
      }else{
        message.error('上传图片失败！')
      }
    }else if(file.status==='removed'){
      const result = await reqDeleteImg(file.name)
      console.log(result)
      if(result.data.status === 0 ){
        message.success('删除图片成功')
      }else{
        message.error('删除图片失败')
      }
    }
    this.setState({fileList})
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="http://localhost:3000/manage/img/upload"/*上传图片的接口地址*/
          listType="picture-card"/*卡片央视*/
          fileList={fileList}/*所有已上传图片对象的数组*/
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          accept='image/*'/*只接受图片格式*/
          name='image' /*请求参数名*/
        >
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

