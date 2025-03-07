import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { persistor, store } from './redux/store.js'; // ✅ Fixed typo
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>  {/* ✅ Fixed typo */}
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
