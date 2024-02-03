import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.min.css'
import httpClient from '../httpClient';
import { Button, DatePicker, Divider, Form, Input, Spin, Table, Tabs, Typography } from 'antd';
import moment from 'moment';
import { User } from '../types';
import { host, Title } from '..';
import { BackwardFilled, CloseOutlined, EditTwoTone, HistoryOutlined, LoginOutlined, UploadOutlined } from '@ant-design/icons';
// import { Bar, Doughnut, Line, Pie, Radar } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement } from 'chart.js';
import backgroundImage from '../props/background.jpg';
// ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement);

const { TabPane } = Tabs; // Import Tabs component from Ant Design

const { Text } = Typography;


interface Transaction {
    id: string;
    amount: number;
    category: string;
    description: string;
    date: string;
    type: string;
    account_name: string
}

interface TransactionTableProps {
    transactions: Transaction[];
}


const blueThemeStyle = {
    background: `url(${backgroundImage})`,
    backgroundSize: 'cover', // Adjust the size to cover the entire container
    backgroundRepeat: 'no-repeat', // Do not repeat the background
    backgroundPosition: 'fill',
    color: '#fff', // White text
    padding: '40px',
    // display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh', // This ensures the div takes at least the full height of the viewport
    textAlign: 'center' as 'center',
};

const AllTransactions = () => {
    // const [tableData, setTableData] = useState([])
    const [tableData, setTableData] = useState<Transaction[]>([]);
    const [user, setUser] = useState<User | null>(null)
    const [filteredData, setFilteredData] = useState<Transaction[]>([]);
    const [editingRow, setEditingRow] = useState<any | null>(null);
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState<string>('All'); // Default to 'all'
    const [chartData, setChartData] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);


    const handleTabChange = (key: string) => {
        setActiveTab(key);
        filterDataByMonth(key);
    };

    const filterDataByMonth = (month: string) => {
        if (month === 'All') {
            setFilteredData(tableData);
        } else {
            // Assuming your 'date' field is in the format 'YYYY-MM-DD'
            const filtered = tableData.filter((item) => moment(item.date).format('MMMM') === month);
            setFilteredData(filtered);
        }
    };

    const getDistinctMonths = () => {
        // Assuming your 'date' field is in the format 'YYYY-MM-DD'
        const monthsSet = new Set(tableData.map((item) => moment(item.date).format('MMMM')));
        const monthsArray = Array.from(monthsSet);

        // Sort the months in descending order (latest to oldest)
        const sortedMonths = monthsArray.sort((a, b) => {
            const dateA = moment(a, 'MMMM');
            const dateB = moment(b, 'MMMM');
            return dateB.diff(dateA);
        });

        return ['All', ...sortedMonths];
    };


    const logOutUser = async () => {
        await httpClient.post("//" + host + "/logout")
        window.location.href = "/"
    }

    const timeConfig = {
        rules: [{ type: 'object' as any, required: true, message: 'Please select time!' }],
    }

    const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
        const columns = [
            // {
            //     title: 'ID',
            //     dataIndex: 'id',
            //     key: 'id',
            // },
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                render: (text: any, record: Transaction) => {
                    if (editingRow === record.id) {
                        return (
                            <Form.Item
                                name="date"
                                rules={[{ required: true, message: 'Please enter a date' }]}
                            >
                                <Input placeholder="Enter Date" />
                            </Form.Item>
                        );
                    } else {
                        return <p>{text}</p>;
                    }
                }
            },
            {
                title: 'Category',
                dataIndex: 'category',
                key: 'category',
                render: (text: any, record: Transaction) => {
                    if (editingRow === record.id) {
                        return (
                            <Form.Item
                                name="category"
                                rules={[{ required: true, message: 'Please enter a category' }]}
                            >
                                <Input placeholder="Enter Category" />
                            </Form.Item>
                        );
                    } else {
                        return <p>{text}</p>;
                    }
                }
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
                render: (text: any, record: Transaction) => {
                    if (editingRow === record.id) {
                        return (
                            <Form.Item
                                name="description"
                                rules={[{ required: true, message: 'Please enter a description' }]}
                            >
                                <Input placeholder="Enter Description" />
                            </Form.Item>
                        );
                    } else {
                        return <p>{text}</p>;
                    }
                }
            },
            {
                title: 'Account',
                dataIndex: 'account_name',
                key: 'account_name',
                render: (text: any, record: Transaction) => {
                    if (editingRow === record.id) {
                        return (
                            <Form.Item
                                name="account_name"
                                rules={[{ required: true, message: 'Please enter an accounr' }]}
                            >
                                <Input placeholder="Enter Account" />
                            </Form.Item>
                        );
                    } else {
                        return <p>{text}</p>;
                    }
                }
            },
            {
                title: <>
                    Amount <span style={{ fontSize: '14px', marginLeft: '5px' }}>(₹)</span>
                </>,
                dataIndex: 'amount',
                key: 'amount',
                render: (text: any, record: Transaction) => {
                    if (editingRow === record.id) {
                        return (
                            <Form.Item
                                name="amount"
                                rules={[{ required: true, message: 'Please enter an amount' }]}
                            >
                                <Input placeholder="Enter Amount" />
                            </Form.Item>
                        );
                    } else {
                        return <p>{text}</p>;
                    }
                }

            },
            // {
            //     'title': 'ACTIONS',
            //     render: (_: any, record: Transaction) => {
            //         if (editingRow === null) {
            //             return <>
            //                 <Button
            //                     size='small'
            //                     type="dashed" onClick={
            //                         () => {
            //                             console.log('choosing record', record.id)
            //                             setEditingRow(record.id);
            //                             form.setFieldsValue({
            //                                 id: record.id,
            //                                 amount: record.amount,
            //                                 description: record.description,
            //                                 category: record.category,
            //                                 account_name: record.account_name,
            //                                 date: record.date
            //                             });
            //                         }}
            //                     icon={<EditTwoTone />}
            //                 >Edit</Button>
            //                 <Divider type='vertical'></Divider></>
            //         }
            //         else if (editingRow === record.id) {
            //             return <>
            //                 <Button
            //                     disabled={editingRow !== record.id}
            //                     danger
            //                     size='small'
            //                     type="ghost" onClick={
            //                         () => {
            //                             setEditingRow(null);
            //                         }}
            //                     icon={<CloseOutlined />}
            //                 >Cancel</Button>

            //                 <Divider type='vertical'></Divider>
            //                 <Button
            //                     disabled={editingRow !== record.id}
            //                     shape='round'
            //                     name="save"
            //                     type="primary"
            //                     htmlType="submit">
            //                     Set
            //                 </Button>
            //             </>
            //         }
            //     }
            // }
        ]

        return <Table style={{ fontWeight: 'bold', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.4)', }} dataSource={transactions} columns={columns} bordered rowKey="id" pagination={{ pageSize: 5, hideOnSinglePage: true, showSizeChanger: false }} size="small" />;

    };

    // const disabledDate: RangePickerProps['disabledDate'] = current => {
    //     return (current < moment().startOf('week')) || current > moment().endOf('week');
    // }

    var setTableConfig = {
        method: 'post',
        url: 'http://' + host + '/save_transaction',
        data: tableData
    };

    const prepareChartData = (filteredData: Transaction[]) => {
        const categoryCounts: Record<string, number> = {};

        filteredData.forEach((transaction) => {
            const category = transaction.category;
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        const labels = Object.keys(categoryCounts);
        const data = Object.values(categoryCounts);

        return {
            labels,
            datasets: [
                {
                    label: 'Transactions per Category',
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(75,192,192,0.6)',
                    hoverBorderColor: 'rgba(75,192,192,1)',
                    data,
                },
            ],
        };
    };

    useEffect(() => {

        const fetchData = async () => {
            try {
                const resp = await httpClient.get(`//${host}/@me`);
                setUser(resp.data);
            } catch (error: any) {
                console.log('Not authenticated');
                window.location.href = '/';
            }

            try {
                const response = await httpClient.get(`http://${host}/get_transactions`);
                setTableData(response.data.transactions);
                setFilteredData(response.data.transactions)
                console.log(tableData)
                // console.log(filteredData)
                setActiveTab('All'); // Set initial tab after data fetch
                const chartData = prepareChartData(response.data.transactions);
                setChartData(chartData);
                console.log(chartData)
                setIsLoading(false);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);


    const onFinish = (values: any) => {
        try {
            console.log(values)
            if (values !== null && values !== undefined && Object.keys(values).length > 0) {
                console.log(values)
                let description = values['description'];
                let amount = values['amount']
                let category = values['category']
                let date = values['date']
                let account_name = values['account_name']

                if (description.length == 0) {
                    alert('Description is empty')
                    return;
                }
                if (amount.length == 0) {
                    alert('Amount is empty')
                    return;
                }
                if (category.length == 0) {
                    alert('Category is empty')
                    return;
                }
                if (date.length == 0) {
                    alert('Date is empty')
                    return;
                }
                if (account_name.length == 0) {
                    alert('Account field is empty')
                    return;
                }
            }
            let updatedDataSource: any = [...tableData];

            if (editingRow !== null && updatedDataSource !== undefined) {
                let currEditingRow = editingRow
                console.log(currEditingRow)
                // % 7 === 0 ? 7 : editingRow % 7
                let description = values['description']
                console.log('before', updatedDataSource[0])
                // let currData = updatedDataSource[currEditingRow - 1]
                let currData = updatedDataSource.find((item: Transaction) => item.id === currEditingRow);
                console.log('after', updatedDataSource[0])
                console.log('currdata', currData)
                console.log('curredit', currEditingRow)
                // updatedDataSource = updatedDataSource.map((item: Transaction) => {
                // if (item.id === currEditingRow) {
                // return {
                let indexToEdit = updatedDataSource.findIndex((item: Transaction) => item.id === currEditingRow);

                if (indexToEdit !== -1) {
                    updatedDataSource.splice(indexToEdit, 1, {
                        id: currEditingRow,
                        amount: values['amount'],
                        category: values['category'],
                        description: values['description'],
                        account_name: values['account_name'],
                        date: values['date']
                    });
                    setTableData([...updatedDataSource]); // Make sure to create a new array reference for reactivity
                    setFilteredData([...updatedDataSource]);
                    setEditingRow(null);
                }
            }
            //     };
            // }
            //     return item;
            // });
            // console.log(updatedDataSource)
            // setTableData(updatedDataSource);
            // setFilteredData(updatedDataSource);
            // setEditingRow(null);
            // }
        } catch (error: any) {
            console.log("Something went wrong while setting the transacional values.", error)
        }
    };

    let total = 0
    if (tableData.length !== 0) {
        total = tableData.length / 7
    }

    const backToLandingPage = async () => {
        window.location.href = "/"
    }

    const saveInDb = () => {
        httpClient(setTableConfig)
            .then(function (response) {
                setTableData(response.data);
                setFilteredData(response.data);
                window.location.reload()
                alert("Trasaction saved")
            })
            .catch(function (error) {
                alert("Failed to save the data!")
                window.location.reload()
                console.log(error);
            });
    }

    const oldRecords = async () => {
        window.location.href = "/allSheets"
    }
    return (
        <div style={blueThemeStyle}>
            <Tabs style={{ padding: '5px', fontWeight: 'bold', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.4)', }} defaultActiveKey="All" activeKey={activeTab} onChange={handleTabChange}>
                {getDistinctMonths().map((month) => (
                    <TabPane tab={month} key={month}>
                        <div style={{ marginBottom: '20px' }}>
                            <Title level={5}>Your Transactions</Title>
                        </div>
                        {/* Table in the center */}
                        {isLoading ? (
                            <Spin size="large" />
                        ) : (
                            <div style={{ fontWeight: 'bold', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.4)', marginTop: '20px', textAlign: 'center' }}>
                                <TransactionTable transactions={filteredData} />
                            </div>
                        )}

                        {/* Buttons */}
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                            <Button shape="round" type="primary" onClick={() => backToLandingPage()} icon={<BackwardFilled />}>
                                Go back
                            </Button>
                            {/* <Button size="large" type="primary" shape="round" icon={<UploadOutlined />}>
                                Submit
                            </Button> */}
                            <Button size='small' danger type="primary" onClick={() => logOutUser()} icon={<LoginOutlined />}>
                                Log out
                            </Button>
                        </div>
                    </TabPane>
                ))}
            </Tabs>
        </div>
    );
};

export default AllTransactions;
