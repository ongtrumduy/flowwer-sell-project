import { RootRouter } from './router';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <RootRouter></RootRouter>
      <ToastContainer />
    </>
  );
}

export default App;
