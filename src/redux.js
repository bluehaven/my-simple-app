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

export function fetchData(image) {
    return function (dispatch) {
        dispatch(requestData());
        return fetch(`http://localhost:5000/rekognition/detect`, {
            method: 'POST',
            body: JSON.stringify(image),})
            .then(function (response) {
                return response.json()
            })
            .then(function (response) {
                console.log(response); // now this is the body of the response
                dispatch(receivedData(response));
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
            console.log(action);
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