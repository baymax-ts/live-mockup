import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import AuthOptions from '../auth/AuthOptions';
import { Button } from 'antd';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';

class AdminHeader extends Component {
   
    render() { 
      return ( 
        <header className="h-16 w-full rounded-full shadow-md bg-white flex items-center pl-10 pr-10 justify-between">
          <Link to="/"><h1 className="title">Mockup</h1></Link>
        </header>
      );
    }
}
 
export default AdminHeader;