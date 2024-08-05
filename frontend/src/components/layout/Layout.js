import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

function Layout({header = <Header/>, children}) {
  return (
    <div>
      {header}
      <main className='mt-4'>
        {children}
      </main>
    </div>
  );
}

export default Layout;