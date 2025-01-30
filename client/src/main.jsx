import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client'; // Add this import
import './index.css';
import App from './App.jsx';
import { store } from './redux/store.js';
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode> {/* You can enable StrictMode to catch additional potential issues */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
