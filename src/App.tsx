
import './App.css'
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/toast-custom.css';

const App: React.FC = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default App;