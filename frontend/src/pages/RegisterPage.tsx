import {
    CheckOutlined,
    CloseOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
    MailOutlined,
    SecurityScanOutlined,
    UserAddOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Button, Divider, Form, Input, Typography, Space, Card } from 'antd';
import React, { useEffect, useState } from 'react';
import { host } from '..';
import httpClient from '../httpClient';
import { encode as base64_encode } from 'base-64';
import backgroundImage from '../props/background.jpg';


const { Text, Title } = Typography;

const RegisterPage: React.FC = () => {
    const [password, setPassword] = useState({
        password: '',
    });
    const [validLength, setValidLength] = useState(false);
    const [hasNumber, setHasNumber] = useState(false);
    const [upperCase, setUpperCase] = useState(false);
    const [lowerCase, setLowerCase] = useState(false);
    const [specialChar, setSpecialChar] = useState(false);
    const [requiredLength] = useState(8);

    const inputChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (
        event
    ) => {
        const { value, name } = event.target;
        setPassword({
            ...password,
            [name]: value,
        });
    };

    useEffect(() => {
        setValidLength(password.password.length >= requiredLength);
        setUpperCase(password.password.toLowerCase() !== password.password);
        setLowerCase(password.password.toUpperCase() !== password.password);
        setHasNumber(/\d/.test(password.password));
        setSpecialChar(
            /[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(password.password)
        );
    }, [password, requiredLength]);

    const [email, setEmail] = useState<string>('');
    const [first_name, setFirstName] = useState<string>('');
    const [last_name, setLastname] = useState<string>('');

    let checkPass = () => {
        return (
            hasNumber &&
            upperCase &&
            lowerCase &&
            requiredLength >= 8 &&
            specialChar &&
            email !== '' &&
            first_name !== '' &&
            last_name !== ''
        );
    };

    const PasswordStrengthIndicator: React.FC<{
        label: string;
        value: boolean;
    }> = ({ label, value }) => (
        <Space>
            <Typography.Text>{label}:</Typography.Text>
            {value ? (
                <Typography.Text type="success">
                    <CheckOutlined />
                </Typography.Text>
            ) : (
                <Typography.Text type="danger">
                    <CloseOutlined />
                </Typography.Text>
            )}
        </Space>
    );

    const registerUser = async () => {
        try {
            const encodedPass = base64_encode(password['password']);
            const data = {
                email: email,
                password: encodedPass,
                first_name: first_name,
                last_name: last_name,
            };
            if (checkPass()) {
                try {
                    await httpClient.post(`//${host}/register`, data);
                    window.location.href = '/';
                } catch (error: any) {
                    if (error.response.status === 401) {
                        alert('Invalid Credentials');
                    } else if (error.response.status === 409) {
                        alert('This user already exists');
                    }
                }
            } else {
                alert(
                    'Please make sure you fill all the fields and choose a strong password.'
                );
            }
        } catch (error: any) {
            console.log('Something went wrong.');
        }
    };

    const formStyle = {
        width: '50%', // Adjust the width to your preference
        marginTop: '20px',
        fontSize: '10px',
        fontWeight: 'bold',
        textAlign: 'center' as 'center', // Adjust the type here
        // background: 'rgba(255, 255, 255, 0.4)',
    };
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);


    return (
        <div style={{
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
        }}>
            <Card bordered={true} style={{ width: '30%', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.4)', }}>

                <div>

                    <h1>Create a new account</h1>
                    <Form>

                        <Input
                            size="small"
                            placeholder="First Name"
                            value={first_name}
                            onChange={(e) => setFirstName(e.target.value)}
                            prefix={<UserAddOutlined />}
                        />
                        <Divider type="vertical" />
                        <Input
                            size="small"
                            placeholder="Last Name"
                            value={last_name}
                            onChange={(e) => setLastname(e.target.value)}
                            prefix={<UserOutlined></UserOutlined>}
                        />
                        <Divider type="vertical" />
                        <Input
                            size="small"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            prefix={<MailOutlined />}
                        />
                        <Divider type="vertical" />

                        <div style={{ marginBottom: '20px' }}>
                            <Input.Password
                                name="password"
                                placeholder="Password"
                                prefix={<SecurityScanOutlined />}
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                onChange={inputChange}
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
                            />
                            {isPasswordFocused && (
                                <Space direction="vertical">
                                    <PasswordStrengthIndicator label="Valid Length" value={validLength} />
                                    <PasswordStrengthIndicator label="Has a Number" value={hasNumber} />
                                    <PasswordStrengthIndicator label="UpperCase" value={upperCase} />
                                    <PasswordStrengthIndicator label="LowerCase" value={lowerCase} />
                                    <PasswordStrengthIndicator label="Special Character" value={specialChar} />
                                </Space>
                            )}
                        </div>
                        <Divider />
                        <Button type="primary" shape="round" onClick={() => registerUser()}>
                            Submit
                        </Button>
                    </Form>
                </div>
            </Card>
        </div>
    );
}

export default RegisterPage;