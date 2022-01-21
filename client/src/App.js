import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import { Button, Grid, Row, Col } from 'react-bootstrap';
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      upload: false,
      response: "",
      loading: false
    }
  }

  startConvert = () => {
    this.setState({loading: true})
    axios.get("http://localhost:3001/get_transaction").then((response) => {
      console.log("response ", response);
      this.setState({data: response.data, loading: false})
    })
  }
  
  upload = () => {
    this.setState({loading: true})
    // console.log("this.state.data ", this.state.data);
    axios.post("http://localhost:3001/uploaddata", this.state.data).then((response) => {
      console.log("response ", response);
      this.setState({upload: true, response: response.data, loading: false})
    })
  }

  render() {
    return (
      <div className="App">
        <Grid>
          <Row className="show-grid">
            <Col xs={12} md={12}>
              <Button bsStyle="primary" onClick={() => this.startConvert()}>Start Convert</Button>
              <Button bsStyle="primary" onClick={() => this.upload()}>Upload</Button>
            </Col>
            <Col xs={12} md={12}>
            {this.state.upload ? <div className="alert alert-primary" role="alert">
              passed: {this.state.response.passed}, failed: {this.state.response.failed}
            </div>: null}
            {this.state.loading ? <div style={{position:"absolute", right: "45%"}}><img src="loading.gif"/></div> : null }
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Currency</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Created Date</th>
                </tr>
              </thead>
              <tbody>
              {this.state.data.map((val, index) => {
                return (
                  <tr key={index}>
                    <td>{val.currency}</td>
                    <td>{val.amount}</td>
                    <td>{val.createdAt}</td>
                  </tr>
                )
              })}
              </tbody>
            </table>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
