import React from 'react';
import {Layout, Divider, Card, Icon, Spin, Alert, Row, Col, Button, Tag, message, Table, Collapse, Steps, Modal, Upload} from 'antd';


class AlphaExampleService extends React.Component {

  constructor(props) {
    super(props);

    this.title = 'Call API';
    this.submitAction       = this.submitAction.bind(this);
    this.state = {
        fileUploaded: false,
        file: undefined,
        fileReader: undefined,
    };
  }

  isComplete() {
    if (this.props.jobResult === undefined)
        return false;
    else
    {
        console.log(this.props.jobResult);
        return true;
    }
  }
  
  processFile(file) {
    let reader = new FileReader();

    reader.onload = (e => {
      this.setState({
        fileUploaded: true,
        file: file,
        fileReader: reader,
      });
    });

    reader.readAsDataURL(file);
  }

  submitAction() {
    this.props.showModalCallback(this.props.callModal);
    this.props.callApiCallback('classify', 
      {
        image: this.state.fileReader.result.split(',')[1],
        image_type: this.state.file.type.split('/')[1],
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    console.log("Receiving props: ", nextProps)
    this.parseResult(nextProps);
  }

  parseResult(nextProps)
  {
    if (nextProps.jobResult === undefined)
        return;
    
    let rpcResponse = nextProps.jobResult;

    let jobKeys = Object.keys(rpcResponse).map(item => {
        return {
          title: item,
          dataIndex: item,
          key: item,
          width: 150,
        }
      });

      let predictions = {};


      Object.keys(rpcResponse).forEach(item => {
        predictions[item] = rpcResponse[item].toString();
      });

      this.setState((prevState) => ({
        jobKeys: jobKeys,
        predictions: [predictions],
      }));
  }

  renderForm() {
    return(
        <React.Fragment>
        <div>
        {
            !this.state.fileUploaded &&
            <React.Fragment>
                <br/>
                <br/>
                <Upload.Dragger name="file" accept=".jpg,.jpeg,.png" beforeUpload={(file)=>{ this.processFile(file); return false; }} >
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">Click for file-chooser dialog or drag a file to this area to be analyzed.</p>
                </Upload.Dragger>
            </React.Fragment>
        }
        <table><tbody>
            <tr>
                <td><b>File:</b></td>
                <td>{this.state.file ? `${this.state.file.name}` : '(not uploaded)'}</td>
        </tr>
        </tbody>
        </table>

        <br/>
        <br/>
        <Button type="primary" onClick={() => {this.submitAction(); }} disabled={!this.state.fileUploaded} >Call Agent API</Button>
        </div>
        </React.Fragment>
        )
  }
  
  renderComplete() {
    return(<div><p>Complete</p>
        <div>
          <Divider orientation="left">Job Results</Divider>
          <Table pagination={false} columns={this.state.jobKeys} dataSource={this.state.predictions} />
        </div>
    </div>);
  }
  render() {
    if (this.isComplete())
        return this.renderComplete();
    else
        return this.renderForm();
  }
}

export default AlphaExampleService;