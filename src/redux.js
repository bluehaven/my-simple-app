import { applyMiddleware, combineReducers, createStore, } from 'redux';
import thunk from 'redux-thunk';
import { logger } from 'redux-logger';

// actions.js
export const onCaptureImage = screenshot => ({
    type: 'CAPTURE_IMAGE',
    screenshot,
});

export const requestData = () => ({
    type: 'REQUEST_DATA',
});
export const receivedData = result => ({
    type: 'RECEIVED_DATA',
    result,
});

function stripCharactersInBase64Image(image) {
    return image.replace(/data:.+?,/, "");
}

export function fetchData(image) {
    return function (dispatch) {
        dispatch(requestData());
        var body = {"image": stripCharactersInBase64Image(image)};
        console.log(body);
        return fetch(`http://c089bd75.ngrok.io/rekognition/detect`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),})
            .then(function (response) {
                return response.json()
            })
            .then(function (response) {
                console.log(response);
                dispatch(receivedData(response));
            })
            .catch(function(error) {
                console.log(error);
            });

    };
}

// reducers.js
export const rekognition = (state = {fetchingData: false}, action) => {
    switch (action.type) {
        case 'CAPTURE_IMAGE':
            return {
                ...state,
                image: action.screenshot
            }

        case 'REQUEST_DATA':
            return {
                ...state,
                fetchingData: true };

        case 'RECEIVED_DATA':
            return {
                ...state,
                fetchingData: false,
                rekognitionData: action.result
            };

        default:
            return state;
    }
};

export const reducers = combineReducers({
    rekognition,
});

// store.js
export function configureStore(initialState = {}) {
    const store = createStore(reducers, initialState, applyMiddleware(thunk));
    return store;
};

export const store = configureStore();