import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../styles/components/Layout.scss';

const Layout = () => {
  return (
    <div className="kalei-app">
      <Sidebar />
      <main className="kalei-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;