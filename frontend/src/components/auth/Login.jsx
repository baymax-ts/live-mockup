import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Button, Form, Input } from 'antd';
import { DataContext } from '../../context/DataContext';

function Login () {

    const {openNotification} = useContext(DataContext);
    const [params] = useSearchParams();
    const redirectValue = params.get('redirect');

    const { userData, setUserData } = useContext(DataContext);
    const navigate = useNavigate();
    // const history = useHistory();

    useEffect(() => {
      if (!!userData.user) {
        redirectValue ? navigate(`/${redirectValue}`) : navigate("/");
      }
    }, [userData])

    const onFinish = (values) => {
        submit(values.username, values.password);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const submit = async (email, password) => {
        // e.preventDefault();
        try{
            const loginUser = {email, password};
            const loginResponse = await axios.post(`${process.env.REACT_APP_SERVER}/users/login`, loginUser);
            setUserData({
                token: loginResponse.data.token,
                user: loginResponse.data.user
            });
            localStorage.setItem("auth-token", loginResponse.data.token);
            localStorage.setItem("user", loginResponse.data.user);
            navigate("/admin");
        } catch(err) {
          openNotification(err.response.data.msg)
        }
        
    };
    
    return (
      <div className='flex w-full items-center flex-col justify-center'>
        <Form
          name="basic"
          className='w-1/2'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
      
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
      
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
}
 
export default Login;