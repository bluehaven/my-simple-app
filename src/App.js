import React, { Component } from 'react';
import { connect } from 'react-redux';
import { onCaptureImage } from './redux';
import Webcam from 'react-webcam';
import { fetchPrice } from './redux';
import './App.css';

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
            <div>
                <Webcam
                    audio={false}
                    height={350}
                    ref={this.setRef}
                    screenshotFormat="image/jpeg"
                    width={350}
                    videoConstraints={videoConstraints}
                />
                <button onClick={this.handleClick}>Capture photo</button>
                <button onClick={() => this.props.fetchPrice(this.props.quoteApp.image)}>Get Quote</button>
                <pre>{JSON.stringify(this.props.quoteApp, null, 2)}</pre>
            </div>

        );
    }
}

// AppContainer.js
const mapStateToProps = (state, ownProps) => ({
    quoteApp: state.quoteApp,
});

const mapDispatchToProps = {
    onCaptureImage,
    fetchPrice
};

const AppContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

export default AppContainer;
