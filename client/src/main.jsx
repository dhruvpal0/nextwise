import {Children, StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css';
import {Provider} from 'react-redux';
import {appStore} from './app/store';
import { Toaster } from './components/ui/sonner';
import Loading from './components/Loading';
import { useLoadUserQuery } from './features/api/authApi';

const Custom = ({children}) => {
  const {isLoading} = useLoadUserQuery();
  return <> {isLoading? <Loading /> :<> {children} </>}</>;
  
  }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
      <Custom>
    <App />
    <Toaster/>
    </Custom>
    </Provider>
  </StrictMode>,
)
