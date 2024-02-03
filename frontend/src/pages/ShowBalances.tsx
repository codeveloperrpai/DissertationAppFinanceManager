import { LoginOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Typography, Card, Spin } from 'antd';
import { BackwardFilled, CloseOutlined, EditTwoTone, HistoryOutlined, UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { host, Title } from '..';
import httpClient from '../httpClient';
import { User } from '../types';
import backgroundImage from '../props/background.jpg';


const { Title: AntTitle } = Typography;

const Showbalances = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [accounts, setAccounts] = useState([]);

    const [totalBalance, setTotalBalance] = useState<number>(0);



    const logOutUser = async () => {
        await httpClient.post("//" + host + "/logout");
        window.location.href = "/";
    };

    const backToLandingPage = async () => {
        window.location.href = "/"
    }

    const getTransactions = async () => {
        window.location.href = "/allTransactions";
    };

    const showDashoard = async () => {
        window.location.href = "/financeDashboard";
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

                // Calculate total balance
                var totalMoney: number = 0;
                accounts.forEach((account: any) => {
                    totalMoney = (totalMoney || 0) + account.balance;
                });

                setTotalBalance(totalMoney);
                setIsLoading(false);
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
                    <Card bordered={true} style={{ background: 'rgba(255, 255, 255, 0.4)' }}>
                        {/* Right side content */}
                        <div>
                            {/* Display account balances */}
                            <AntTitle level={3}>Account Balances</AntTitle>
                            {accounts.map((account: any, index) => (
                                <div key={index}>
                                    <p>{account.name}</p>
                                    <p>Balance: <span style={{ fontSize: '14px', marginLeft: '5px' }}>₹</span> {Number(account.balance).toFixed()}</p>
                                    {/* <Divider /> */}
                                </div>
                            ))}
                            {/* <div>
                                {isLoading ? (
                                    <Spin size="large" />
                                ) : (
                                    // <div style={{ marginTop: '10px', padding:'30px' }}>
                                    <div>
                                        <Title level={4}>Total Balance</Title>
                                        <p>{totalBalance}</p>
                                        <Divider type='vertical' />
                                    </div>
                                )}
                            </div> */}
                            {/* <Divider /> */}

                            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                                <Button shape="round" type="primary" onClick={() => backToLandingPage()} icon={<BackwardFilled />}>
                                    Go back
                                </Button>
                                <Divider type='vertical' />
                                <Button size='small' danger type="primary" onClick={() => logOutUser()} icon={<LoginOutlined />}>
                                    Log out
                                </Button>

                            </div>
                        </div>
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

export default Showbalances;
