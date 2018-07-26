import { applyMiddleware, combineReducers, createStore, } from 'redux';
import thunk from 'redux-thunk';
import { logger } from 'redux-logger';

// actions.js
export const onCaptureImage = screenshot => ({
    type: 'CAPTURE_IMAGE',
    screenshot,
});

export const requestPrice = () => ({
    type: 'REQUEST_PRICE',
});
export const receivedPrice = result => ({
    type: 'RECEIVED_PRICE',
    result,
});

export function fetchPrice(image) {
    return function (dispatch) {
        dispatch(requestPrice());

        return fetch(`http://localhost:5000/api/hello/post`, {
            method: 'POST',
            body: JSON.stringify(image),})
            .then(function (response) {
                return response.json()
            })
            .then(function (response) {
                console.log(response);
                dispatch(receivedPrice(response));// now this is the body of the response
            });

    };
}

// reducers.js
export const quoteApp = (state = {loading: false}, action) => {
    switch (action.type) {
        case 'CAPTURE_IMAGE':
            return {
                ...state,
                image: action.screenshot
            }

        case 'REQUEST_PRICE':
            return {
                ...state,
                loading: true };

        case 'RECEIVED_PRICE':
            console.log(action);
            return {
                ...state,
                price: action.result.price,
                loading: false };

        default:
            return state;
    }
};

export const reducers = combineReducers({
    quoteApp,
});

// store.js
export function configureStore(initialState = {}) {
    const store = createStore(reducers, initialState, applyMiddleware(thunk));
    return store;
};

export const store = configureStore();