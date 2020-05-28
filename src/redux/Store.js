import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import RootReducer from '../reducers';
import { persistStore, persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/es/storage/session'

let middleware = [thunk];

const persistConfig = {
    key: 'root',
    storage: storageSession,
};

export default function configureStore() {
	
	const store = createStore(
		persistReducer(persistConfig, RootReducer),
		applyMiddleware(...middleware)
	);
	return [store, persistStore(store)]
}