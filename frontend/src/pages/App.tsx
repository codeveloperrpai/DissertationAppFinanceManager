import { LoginOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Typography, Card, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import { host, Title } from '..';
import httpClient from '../httpClient';
import { User } from '../types';
import backgroundImage from '../props/background.jpg';

const { Title: AntTitle } = Typography;

const LandingPage = () => {
    const [user, setUser] = useState<User | null>(null);

    const [accounts, setAccounts] = useState([]);


    const logOutUser = async () => {
        await httpClient.post("//" + host + "/logout");
        window.location.href = "/";
    };

    const getTransactions = async () => {
        window.location.href = "/allTransactions";
    };

    const showDashoard = async () => {
        window.location.href = "/financeDashboard";
    };



    const showBalance = async () => {
        window.location.href = "/showBalances";
    };


    const addTransaction = async () => {
        window.location.href = "/addTransaction";
    };

    useEffect(() => {
        (async () => {
            try {
                // Fetch user data
                const userResp = await httpClient.get(`//${host}/@me`);
                setUser(userResp.data);

                // Fetch account balances
                const accountsResp = await httpClient.get(`//${host}/get_accounts`);
                setAccounts(accountsResp.data.accounts);
            } catch (error: any) {
                console.log("Not authenticated");
            }
        })();
    }, []);


    const capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const blueThemeStyle = {
        background: `url(${backgroundImage})`,
        backgroundSize: 'cover', // Adjust the size to cover the entire container
        backgroundRepeat: 'no-repeat', // Do not repeat the background
        backgroundPosition: 'fill',
        color: '#001529', // Dark text color
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center' as 'center',
    };

    return (
        <div style={blueThemeStyle}>
            {user != null ? (
                <div>
                    <Card bordered={true} style={{ justifyContent: 'center', background: 'rgba(255, 255, 255, 0.4)', }}>

                        <AntTitle level={2}> Welcome to the Aspire Portal, {capitalize(user.email.split('.')[0])}</AntTitle>

                        <h1>You have logged in successfully</h1>

                        {/* <h2>Name: {user.name + ' ' + user.last_name}</h2>
                        <h2>Username: {user.email}</h2> */}
                        <Divider />

                        <Button size="large" type="primary" shape="round" onClick={() => addTransaction()}>
                            Add Transaction
                        </Button>

                        <Divider type='vertical' />

                        <Button size="large" type="primary" shape="round" onClick={() => getTransactions()}>
                            Check Transactions
                        </Button>

                        <Divider />

                        <Button size="large" type="primary" shape="round" onClick={() => showDashoard()}>
                            Show Dashboard
                        </Button>

                        <Divider type='vertical' />

                        <Button size="large" type="primary" shape="round" onClick={() => showBalance()}>
                            Check Account Balance
                        </Button>

                        <Divider />

                        <Button size="small" danger type="primary" onClick={() => logOutUser()} icon={<LoginOutlined />}>
                            Log out
                        </Button>
                    </Card>

                </div>
            ) : (
                <div style={{ padding: '100px' }}>
                    <Card bordered={true} style={{ justifyContent: 'center', background: 'rgba(255, 255, 255, 0.4)', }}>

                        <Form>
                            <Divider />
                            <AntTitle level={2}>Kindly log in to get access to Aspire Portal</AntTitle>
                            <Divider />
                            <a href="/login">
                                <Button type="primary" shape="round" icon={<LoginOutlined />}>
                                    Login
                                </Button>
                            </a>
                            <Divider />
                            <a href="/register">
                                <Button type="primary" shape="round">
                                    Register
                                </Button>
                            </a>
                        </Form>
                    </Card>
                </div>

            )}

        </div>

    );
};

export default LandingPage;
