import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, message, Card, Divider, } from 'antd';
import { BackwardFilled, CloseOutlined, EditTwoTone, HistoryOutlined, LoginOutlined, UploadOutlined } from '@ant-design/icons';
import { host } from '..';
import httpClient from '../httpClient';
import backgroundImage from '../props/background.jpg';


const { Option } = Select;

const AddTransactionPage: React.FC = () => {
    const [accounts, setAccounts] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const transactionType = ['Income','Expense']

    useEffect(() => {
        // Fetch accounts and categories from the server
        const fetchAccountsAndCategories = async () => {
            try {
                const accountsResponse = await httpClient.get(`http://${host}/get_accounts`);
                const categoriesResponse = await httpClient.get(`http://${host}/get_categories`);
                setAccounts(accountsResponse.data.accounts.map((account: any) => account.name) || []);
                setCategories(categoriesResponse.data.categories.map((category: any) => category.name) || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching accounts and categories', error);
            }
        };

        fetchAccountsAndCategories();
    }, []);

    const backToLandingPage = async () => {
        window.location.href = "/"
    }


    const onFinish = async (values: any) => {
        try {
            const response = await httpClient.post(`http://${host}/add_transaction`, {
                amount: parseFloat(values.amount),
                category: values.category,
                description: values.description,
                account_name: values.account_name,
                type:values.type,
                date: values.date.toISOString(), // convert to ISO string
            });

            message.success(response.data.message);
        } catch (error) {
            message.error('Failed to add transaction. Please try again.');
            console.error('Error adding transaction', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    // const containerStyle = {
    //     background: `url(${backgroundImage})`,
    //     backgroundSize: 'cover', // Adjust the size to cover the entire container
    //     backgroundRepeat: 'no-repeat', // Do not repeat the background
    //     backgroundPosition: 'fill',
    //     padding: '120px',
    //     paddingTop: '26px',
    //     // paddingBottom: '10px',
    //     // display: 'flex',
    //     // flexDirection: 'column',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     // minHeight: '100vh',
    //     textAlign: 'center' as 'center',
    //     // width: '50%',
    //     marginBottom: '1em',
    // };

    const blueThemeStyle = {
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

    const formStyle = {
        // width: '90%', // Adjust the width to your preference
        marginTop: '20px',
        fontSize: '10px',
        fontWeight: 'bold',
        textAlign: 'center' as 'center', // Adjust the type here
        // background: 'rgba(255, 255, 255, 0.4)',
    };

    return (
        <div style={blueThemeStyle}>
            <Card title="Add your transaction" bordered={true} style={{ fontWeight: 'bold', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.4)', }}>

                <Form onFinish={onFinish} style={formStyle}>
                    <Form.Item
                        label="Amount"
                        name="amount"
                        rules={[{ required: true, message: 'Please enter the amount' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Category"
                        name="category"
                        rules={[{ required: true, message: 'Please select a category' }]}
                    >
                        <Select>
                            {categories.map((category) => (
                                <Option key={category} value={category}>
                                    {category}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[{ required: true, message: 'Income/Expense' }]}
                    >
                        <Select>
                            {transactionType.map((type) => (
                                <Option key={type} value={type}>
                                    {type}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please enter a description' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Account"
                        name="account_name"
                        rules={[{ required: true, message: 'Please select an account' }]}
                    >
                        <Select>
                            {accounts.map((account) => (
                                <Option key={account} value={account}>
                                    {account}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Date"
                        name="date"
                        rules={[{ required: true, message: 'Please select a date' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add Transaction
                        </Button>
                    </Form.Item>
                </Form>
                <Divider type='horizontal' />
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <Button shape="round" type="primary" onClick={() => backToLandingPage()} icon={<BackwardFilled />}>
                        Go back
                    </Button>

                    <Button size="small" danger type="primary" icon={<LoginOutlined />}>
                        Log out
                    </Button>
                </div>
            </Card>

        </div>
    );
};

export default AddTransactionPage;
