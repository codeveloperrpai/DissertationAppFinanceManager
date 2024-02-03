import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  SecurityScanOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, Card } from 'antd';
import React, { useState } from 'react';
import { host } from '..';
import httpClient from '../httpClient';
import { encode as base64_encode } from 'base-64';
import backgroundImage from '../props/background.jpg';


const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const logInUser = async () => {
    const encodedPass = base64_encode(password);
    const data = {
      email: email,
      password: encodedPass,
    };
    try {
      await httpClient.post(`//${host}/login`, data);
      window.location.href = '/';
    } catch (error: any) {
      if (error.response.status === 401) {
        alert('Invalid Credentials');
      }
    }
  };

  const containerStyle = {
    background: `url(${backgroundImage})`,
    backgroundSize: 'cover', // Adjust the size to cover the entire container
    backgroundRepeat: 'no-repeat', // Do not repeat the background
    backgroundPosition: 'fill',
    color: '#001529', // Dark text color
    padding: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    textAlign: 'center' as 'center',
  };

  const inputStyle = {
    marginBottom: '15px',
  };

  const formStyle = {
    // width: '50%', // Adjust the width to your preference
    marginTop: '20px',
    fontSize: '10px',
    fontWeight: 'bold',
    textAlign: 'center' as 'center', // Adjust the type here
    // background: 'rgba(255, 255, 255, 0.4)',
  };

  return (
    <div style={containerStyle}>
      <Card bordered={true} style={{ justifyContent: 'center', background: 'rgba(255, 255, 255, 0.4)', }}>

        <h1 style={{ textAlign: 'center', marginBottom: '20px', }}>
          Log into your account
        </h1>
        <Form style={formStyle}>
          <Input
            size="large"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            prefix={<UserOutlined />}
            style={inputStyle}
          />
          <Input.Password
            placeholder="Password"
            prefix={<SecurityScanOutlined />}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          <Button
            size="large"
            type="primary"
            shape="round"
            onClick={() => logInUser()}
            style={{ marginTop: '20px', width: '100%' }}
          >
            Log In
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
