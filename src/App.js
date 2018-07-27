import React, { Component } from 'react';
import { connect } from 'react-redux';
import { onCaptureImage } from './redux';
import Webcam from 'react-webcam';
import { fetchData } from './redux';
import {Button, ButtonToolbar, Grid, Row, Col} from 'react-bootstrap';
import logo from "./logo.png";
import "./App.css";

function createMarkup(imageSrc) {
    return {__html: '<img width="400" src="' + imageSrc + '">'};
}

class App extends React.Component {
    setRef = (webcam) => {
        this.webcam = webcam;
    }

    handleClick = () => {
        const screenshot = this.webcam.getScreenshot();
        //console.log(screenshot);
        this.props.onCaptureImage(screenshot);
    }

    render() {
        const videoConstraints = {
            width: 1280,
            height: 720,
            facingMode: 'user',
        };

        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>the cold never bothered me anyway</h2>
                </div>
                <div className="App-webcam">
                    <Webcam
                        audio={false}
                        height={350}
                        ref={this.setRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                    />
                </div>
                <div className="App-button">
                    <ButtonToolbar>
                        <Button onClick={this.handleClick} block>Take Photo!</Button>
                        <Button onClick={() => this.props.fetchData(this.props.rekognition.image)} block>Rekognize</Button>
                    </ButtonToolbar>
                </div>
                <hr></hr>
                <Grid>
                    <Row className="show-grid">
                        <Col md={6}>
                            <div>
                                <div className="App-intro">Your Quote Summary </div> <br/>
                                <pre>Age: {this.props.rekognition.rekognitionData ? this.props.rekognition.rekognitionData.estimatedAge : ""} </pre>
                            </div>
                            <div>
                                <pre>Gender: {this.props.rekognition.rekognitionData ? this.props.rekognition.rekognitionData.gender.value : ""} </pre>
                            </div>
                            <div>
                                <pre>Life Insurance: {this.props.rekognition.rekognitionData ? this.props.rekognition.rekognitionData.quoteDetailsList[0].premium : ""} </pre>
                            </div>
                            <div>
                                <pre>Health Insurance: {this.props.rekognition.rekognitionData ? this.props.rekognition.rekognitionData.quoteDetailsList[1].premium : ""} </pre>
                            </div>
                            <div>
                                <pre>Travel Insurance: {this.props.rekognition.rekognitionData ? this.props.rekognition.rekognitionData.quoteDetailsList[2].premium : ""} </pre>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div>
                               <pre> <div dangerouslySetInnerHTML={createMarkup(this.props.rekognition.image)} /></pre>
                            </div>
                            <pre className="App-bottom">{JSON.stringify(this.props.rekognition, null, 2)}</pre>
                        </Col>
                    </Row>
                </Grid>
            </div>

        );
    }
}

// AppContainer.js
const mapStateToProps = (state, ownProps) => ({
    rekognition: state.rekognition,
});

const mapDispatchToProps = {
    onCaptureImage,
    fetchData
};

const AppContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

export default AppContainer;
