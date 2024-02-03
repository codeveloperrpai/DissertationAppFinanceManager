import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.min.css'
import httpClient from '../httpClient';
import { Button, Card, Divider, Form, Input, Spin, Table, Tabs, Typography } from 'antd';
import moment, { months } from 'moment';
import { User } from '../types';
import { host, Title } from '..';
import { BackwardFilled, CloseOutlined, EditTwoTone, HistoryOutlined, LoginOutlined, UploadOutlined } from '@ant-design/icons';
import { Bar, Doughnut, Line, Pie, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement } from 'chart.js';
import backgroundImage from '../props/background.jpg';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement);

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
    padding: '5px',
    // display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh', // This ensures the div takes at least the full height of the viewport
    textAlign: 'center' as 'center', // Adjust the 
};

const FinanceDashboard = () => {
    // const [tableData, setTableData] = useState([])
    const [tableData, setTableData] = useState<Transaction[]>([]);
    const [user, setUser] = useState<User | null>(null)
    const [filteredData, setFilteredData] = useState<Transaction[]>([]);
    const [editingRow, setEditingRow] = useState<any | null>(null);
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState<string>('All'); // Default to 'all'
    const [chartData, setChartData] = useState<any>({});
    const [transactions, setTransactions] = useState<Transaction[]>([]); // Declare transactions here
    const [isLoading, setIsLoading] = useState(true);
    const [categoryChart, setcategoryChart] = useState<any | null>(null);
    const [monthlyChart, setmonthlyChart] = useState<any | null>(null);



    const handleTabChange = (key: string) => {
        setActiveTab(key);
        filterDataByMonth(key);
    };

    const filterDataByMonth = (month: string) => {
        if (month === 'All') {
            setFilteredData(tableData);
        } else {
            // Assuming your 'date' fielld is in the format 'YYYY-MM-DD'
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

    var setTableConfig = {
        method: 'post',
        url: 'http://' + host + '/save_transaction',
        data: tableData
    };


    const prepareChartData = (transactions: Transaction[]) => {
        const categoryCounts: Record<string, number> = {};
        const monthlyTotal: Record<string, number> = {};
        const months: String[] = getDistinctMonths();

        transactions.forEach((transaction) => {
            const category = transaction.category;
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;

            const month = moment(transaction.date).format('MMMM');
            monthlyTotal[month] = (monthlyTotal[month] || 0) + transaction.amount;

            // months.forEach((month: any) => {
            //     if (month===transMonth){
            //     monthlyTotal[month] = (monthlyTotal[month] || 0) + transaction.amount;
            //     }
            // });

        });
        const labels = Object.keys(categoryCounts);
        const data = Object.values(categoryCounts);
        const totalTransactions = data.reduce((acc: number, count: number) => acc + count, 0);
        const percentages = data.map((count: number) => ((count / totalTransactions) * 100).toFixed(2) + '%');
        const monthlyLabels = Object.keys(monthlyTotal);
        const sortedMonths = monthlyLabels.sort((a: any, b: any) => moment(a, 'MMMM').diff(moment(b, 'MMMM')));
        const monthlyData = Object.values(monthlyTotal);
        const sortedMonthlyData = monthlyData.slice().sort((a, b) => {
            const monthA = moment(monthlyLabels[monthlyData.indexOf(a)], 'MMMM');
            const monthB = moment(monthlyLabels[monthlyData.indexOf(b)], 'MMMM');
            return monthB.diff(monthA); // Change the order of subtraction for ascending order
        });

        // var totalIncome = 0
        // transactions.forEach((transaction) => {
        //     const type  = transaction.type;
        // categoryCounts[category] = (categoryCounts[category] || 0) + 1;

        // const month = moment(transaction.date).format('MMMM');
        // monthlyTotal[month] = (monthlyTotal[month] || 0) + transaction.amount;

        // months.forEach((month: any) => {
        //     if (month===transMonth){
        //     monthlyTotal[month] = (monthlyTotal[month] || 0) + transaction.amount;
        //     }
        // });

        // });
        // var totalExpense = 0


        const backgroundColors = [
            'rgba(120, 200, 160, 0.8)',
            'rgba(220, 120, 180, 0.8)',
            'rgba(140, 220, 100, 0.8)',
            'rgba(250, 130, 60, 0.8)',
            'rgba(160, 220, 140, 0.8)',
            'rgba(230, 160, 40, 0.8)',
            'rgba(240, 200, 70, 0.8)',
            'rgba(180, 120, 210, 0.8)',
            'rgba(200, 180, 110, 0.8)',
            'rgba(240, 140, 160, 0.8)',
            'rgba(110, 210, 180, 0.8)',
            'rgba(220, 170, 90, 0.8)',
            'rgba(140, 190, 220, 0.8)',
            'rgba(180, 160, 200, 0.8)',
            'rgba(200, 140, 120, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(120, 150, 200, 0.8)',
            'rgba(200, 100, 150, 0.8)',
            'rgba(180, 210, 90, 0.8)',
            'rgba(100, 200, 200, 0.8)',
            'rgba(255, 150, 50, 0.8)',
            'rgba(70, 180, 210, 0.8)',
            'rgba(250, 180, 50, 0.8)',
            'rgba(170, 200, 100, 0.8)',
            'rgba(190, 160, 130, 0.8)',
            'rgba(210, 180, 150, 0.8)',
            'rgba(150, 220, 80, 0.8)'
            // can add more colours if needed
        ];
        const legendData = labels.map((label, index) => ({
            label: `${label} (${percentages[index]})`,
            percentage: percentages[index], // Include percentage in legendData
            color: backgroundColors[index],
        }));
        const categoryChart = {
            // labels: labels.map((label, index) => `${label} (${percentages[index]})`),
            labels: months,
            datasets: [
                {
                    data,
                    backgroundColor: backgroundColors,
                    hoverBackgroundColor: 'rgba(75,192,192,0.6)',
                },
            ],
            options: {
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem: any, data: any) {
                            const label = data.labels[tooltipItem.index];
                            return label;
                        },
                    },
                },
            },
            legendData,
        };



        const monthlyChart = {
            labels: monthlyLabels,
            datasets: [
                {
                    label: 'Monthly Total Expenses',
                    data: sortedMonthlyData,
                    backgroundColor: backgroundColors,
                },
            ],
        };

        setcategoryChart(categoryChart);
        setmonthlyChart(monthlyChart);

        // return { categoryChart, monthlyChart };
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
                // setActiveTab('All'); // Set initial tab after data fetch
                const chartData = prepareChartData(response.data.transactions);
                setChartData(chartData);
                console.log(chartData)
                setIsLoading(false);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [transactions]);


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
        } catch (error: any) {
            console.log("Something went wrong while setting the transactional values.", error)
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

    return (
        <div style={blueThemeStyle}>
            {/* <Tabs defaultActiveKey="All" activeKey={activeTab} onChange={handleTabChange}>
                {getDistinctMonths().map((month) => (
                    <TabPane tab={month} key={month}> */}
            {/* Charts on the sides */}
            <Card size='small' bordered={true} style={{ fontWeight: 'bold', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.4)', }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div >
                        {/* style={{ flex: 1, marginRight: '10px' }} */}
                        {/* Bar Chart */}
                        {isLoading ? (
                            <Spin size="large" />
                        ) : (
                            <Card title="Doughnut Chart Colour Scheme" bordered={true} style={{ height: '50%', justifyContent: 'center' }}>

                            <div style={{ marginTop: '20px' }}>
                                <Title level={4}>Transactions per Month (Bar Chart)</Title>
                                <Bar data={monthlyChart} />
                            </div>
                            </Card>
                        )}
                    </div>
                    {/* <Divider type='vertical' /> */}


                    {/* <div style={{ flex: 1, marginLeft: '10px'}}> */}
                    {/* Doughnut Chart */}
                    {isLoading ? (
                        <Spin size="large" />
                    ) : (
                        // <div style={{ marginTop: '10px', padding:'30px' }}>
                        <Card title="Doughnut Chart Colour Scheme" bordered={true} style={{ height: '50%', justifyContent: 'center' }}>

                        <div>
                            <Title level={4}>Expense Distribution (Doughnut Chart)</Title>
                            <Doughnut data={categoryChart} />
                            <Divider type='vertical' />
                        </div>
                        </Card>
                    )}

                    {isLoading ? (
                        <Spin size="large" />
                    ) : (
                        // <div style={{ marginTop: '10px', padding:'30px' }}>
                        <div>

                            {categoryChart.legendData && (
                                <div>

                                    {/* <Divider type='horizontal' /> */}
                                    <Card title="Doughnut Chart Colour Scheme" bordered={true} style={{ height: '50%', justifyContent: 'center' }}>
                                        {/* <h4>Legend</h4> */}
                                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                                            {categoryChart.legendData.map((legendItem: any, index: number) => (
                                                <li key={index}>
                                                    <span style={{ backgroundColor: legendItem.color, width: '15px', height: '15px', display: 'inline-block', marginRight: '5px' }}></span>
                                                    {legendItem.label}
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>

                                </div>
                            )}</div>
                    )}
                    {/* </div> */}
                </div>



                {/* <div style={{ flex: 1, marginLeft: '10px' }}> */}
                {/* Line Chart */}
                {/* {isLoading ? (
                                    <Spin size="large" />
                                ) : (
                                    <div style={{ marginTop: '20px' }}>
                                        <Title level={4}>Your Line Chart</Title>
                                        <Line data={chartData} />
                                    </div>
                                )} */}

                {/* Pie Chart
                                // {isLoading ? (
                                //     <Spin size="large" />
                                // ) : (
                                //     <div style={{ marginTop: '20px' }}>
                                //         <Title level={4}>Your Pie Chart</Title>
                                //         <Pie data={chartData} />
                                //     </div>
                                // )} */}
                {/* </div> */}


                {/* Buttons */}
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <Button shape="round" type="primary" onClick={() => backToLandingPage()} icon={<BackwardFilled />}>
                        Go back
                    </Button>

                    <Button size="small" danger type="primary" icon={<LoginOutlined />}>
                        Log out
                    </Button>
                </div>
                {/* </TabPane>
                ))}
            </Tabs> */}
            </Card>
        </div>
    );
};

export default FinanceDashboard;
