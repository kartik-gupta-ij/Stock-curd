import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart } from '@mantine/charts';
import { Box, Card, Select, Stack, Title } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { OrderForm } from './OrderForm';
import { ProfileCard } from './ProfileCard';
import { TotalPnLCard } from './TotalPnLCard';

export interface Profile {
  user_id: string;
  user_type: string;
  email: string;
  user_name: string;
  broker: string;
}

interface Holdings {
  status: string;
  data: {
    tradingsymbol: string;
    exchange: string;
    isin: string;
    quantity: number;
    authorised_date: string;
    average_price: number;
    last_price: number;
    close_price: number;
    pnl: number;
    day_change: number;
    day_change_percentage: number;
  }[];
}

interface ChartData {
  status: string;
  data: {
    date: string;
    price: number;
  }[];
}

const demoData = {
  status: 'success',
  data: [
    { date: '2017-01-02 00:00:00+05:30', price: 8179.5 },
    { date: '2017-01-03 00:00:00+05:30', price: 8192.25 },
    { date: '2017-01-04 00:00:00+05:30', price: 8190.5 },
    { date: '2017-01-05 00:00:00+05:30', price: 8273.8 },
    { date: '2017-01-06 00:00:00+05:30', price: 8243.8 },
    { date: '2017-01-09 00:00:00+05:30', price: 8236.05 },
    { date: '2017-01-10 00:00:00+05:30', price: 8288.6 },
    { date: '2017-01-11 00:00:00+05:30', price: 8380.65 },
    { date: '2017-01-12 00:00:00+05:30', price: 8407.2 },
    { date: '2017-01-13 00:00:00+05:30', price: 8400.35 },
    { date: '2017-01-16 00:00:00+05:30', price: 8412.8 },
    { date: '2017-01-17 00:00:00+05:30', price: 8398 },
    { date: '2017-01-18 00:00:00+05:30', price: 8417 },
    { date: '2017-01-19 00:00:00+05:30', price: 8435.1 },
    { date: '2017-01-20 00:00:00+05:30', price: 8349.35 },
    { date: '2017-01-23 00:00:00+05:30', price: 8391.5 },
    { date: '2017-01-24 00:00:00+05:30', price: 8475.8 },
    { date: '2017-01-25 00:00:00+05:30', price: 8602.75 },
    { date: '2017-01-27 00:00:00+05:30', price: 8641.25 },
    { date: '2017-01-30 00:00:00+05:30', price: 8632.75 },
    { date: '2017-01-31 00:00:00+05:30', price: 8561.3 },
  ],
};

const holdings_response = {
  status: 'success',
  data: [
    {
      tradingsymbol: 'GOLDBEES',
      exchange: 'BSE',
      isin: 'INF204KB17I5',
      quantity: 2,
      authorised_date: '2021-06-08 00:00:00',
      average_price: 40.67,
      last_price: 42.47,
      close_price: 42.28,
      pnl: 3.5999999999999943,
      day_change: 0.18999999999999773,
      day_change_percentage: 0.44938505203405327,
    },
    {
      tradingsymbol: 'IDEA',
      exchange: 'NSE',
      isin: 'INE669E01016',
      quantity: 5,
      authorised_date: '2021-06-08 00:00:00',
      average_price: 8.466,
      last_price: 10,
      close_price: 10.1,
      pnl: 7.6700000000000035,
      day_change: -0.09999999999999964,
      day_change_percentage: -0.9900990099009866,
    },
  ],
};

const profile_response = {
  user_id: 'AB1234',
  user_type: 'individual',
  email: 'xxxyyy@gmail.com',
  user_name: 'AxAx Bxx',
  broker: 'ZERODHA',
};

function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(profile_response);
  const [holdings, setHoldings] = useState<Holdings | null>(holdings_response);
  const [chartData, setChartData] = useState<ChartData | null>(demoData);
  const [symbol, setSymbol] = useState('NIFTY 50');
  const [fromDate, setFromDate] = useState<Date | null>(new Date('2017-01-02T00:00:00+05:30'));
  const [toDate, setToDate] = useState<Date | null>(new Date('2017-01-31T00:00:00+05:30'));

  const fetchChartData = async (symbol: string, fromDate: Date | null, toDate: Date | null) => {
    try {
      const response = await axios.get('http://localhost:3000/historical-data', {
        params: { symbol, from_date: fromDate, to_date: toDate },
      });
      setChartData({
        status: 'success',
        data: response.data,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    axios
      .get('/api/profile')
      .then((response) => {
        if (response.data.status === 'success') {
          setProfile(response.data.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
      });

    axios
      .get('/api/holdings')
      .then((response) => {
        if (response.data.status === 'success') {
          setHoldings(response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching holdings:', error);
      });

    if (fromDate && toDate && symbol) fetchChartData(symbol, fromDate, toDate);
  }, []);

  useEffect(() => {
    if (fromDate && toDate) fetchChartData(symbol, fromDate, toDate);
  }, [symbol, fromDate, toDate]);

  const totalPnL = holdings?.data.reduce((sum, item) => sum + item.pnl, 0);

  const handleSubmit = (symbolFrom: string, quantity: number, price: number) => {
    if (!symbolFrom || quantity <= 0 || price <= 0) {
      console.error('All fields are required and must be valid.');
      return;
    }
    console.log('Order placed:', { symbol: symbolFrom, quantity, price });
  };

  return (
    <Box p="xl">
      <Box
        style={{
          display: 'flex',
        }}
      >
        {profile && <ProfileCard profile={profile} />}
        {totalPnL && <TotalPnLCard totalPnL={totalPnL} />}
        <OrderForm handleSubmit={handleSubmit} />
        <Card shadow="sm" padding="lg" radius="md" m="xl" w="400" withBorder>
          <Title order={2} mb="md">
            Chart selection
          </Title>
          <Stack gap="sm" mt="md">
            <Select
              label="Symbol"
              data={['NIFTY 50', 'NIFTY BANK']}
              value={symbol}
              onChange={(value) => setSymbol(value ?? '')}
            />
            <DateTimePicker label="From Date" value={fromDate} onChange={setFromDate} />
            <DateTimePicker label="To Date" value={toDate} onChange={setToDate} />
          </Stack>
        </Card>
      </Box>

      <LineChart
        h={300}
        data={chartData?.data ?? []}
        dataKey="date"
        series={[{ name: 'price', color: 'blue' }]}
      />
    </Box>
  );
}

export { Dashboard };
