import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import RootRouter from './router';

function App() {
  return (
    <>
      <RootRouter></RootRouter>
      <ToastContainer />
    </>
  );
}

export default App;
