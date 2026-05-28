import { Outlet } from 'react-router-dom';
import Nav from '../components/Nav';

const PublicLayout = () => {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
};

export default PublicLayout;
