import { useEffect, useState } from 'react';
import { LineChart } from '@mantine/charts';
import { Box, Button, Card, Group, Select, Stack, Title } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';
import { OrderForm } from '../components/OrderForm';
import { ProfileCard } from '../components/ProfileCard';
import { TotalPnLCard } from '../components/TotalPnLCard';
import { axiosInstance } from '../utils/axiosSetup';

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

function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [holdings, setHoldings] = useState<Holdings | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [symbol, setSymbol] = useState('NIFTY 50');
  const [fromDate, setFromDate] = useState<Date | null>(new Date('2017-01-02T00:00:00+05:30'));
  const [toDate, setToDate] = useState<Date | null>(new Date('2017-01-31T00:00:00+05:30'));

  const fetchChartData = async (symbol: string, fromDate: Date | null, toDate: Date | null) => {
    try {
      const response = await axiosInstance.get('/historical-data', {
        params: { symbol, from_date: fromDate, to_date: toDate },
      });
      setChartData({
        status: 'success',
        data: response.data,
      });
      notifications.show({
        title: 'Success',
        message: 'Chart data fetched successfully',
        color: 'green',
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch chart data',
        color: 'red',
      });
    }
  };

  useEffect(() => {
    axiosInstance
      .get('/profile')
      .then((response) => {
        const newProfile = {
          user_id: '1',
          user_type: response.data.user_type,
          email: response.data.email,
          user_name: response.data.user_name,
          broker: response.data.broker,
        };
        setProfile(newProfile);
        notifications.show({
          title: 'Success',
          message: 'Profile data fetched successfully',
        });
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to fetch profile data',
        });
      });

    axiosInstance
      .get('/portfolio/holdings')
      .then((response) => {
        if (response.data.status === 'success') {
          setHoldings(response.data);
          notifications.show({
            title: 'Success',
            message: 'Holdings data fetched successfully',
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching holdings:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to fetch holdings data',
        });
      });

    if (fromDate && toDate && symbol) fetchChartData(symbol, fromDate, toDate);
  }, []);

  useEffect(() => {
    if (fromDate && toDate) fetchChartData(symbol, fromDate, toDate);
  }, [symbol, fromDate, toDate]);

  const totalPnL = holdings?.data.reduce((sum, item) => sum + item.pnl, 0);

  const handleSubmit = async (symbolFrom: string, quantity: number, price: number) => {
    if (!symbolFrom || quantity <= 0 || price <= 0) {
      console.error('All fields are required and must be valid.');
      notifications.show({
        title: 'Error',
        message: 'All fields are required and must be valid',
      });
      return;
    }
    try {
      const response = await axiosInstance.post('/order/place_order', {
        symbol: symbolFrom,
        quantity,
        price,
      });

      if (response.status === 200) {
        notifications.show({
          title: 'Success',
          message: 'Order placed successfully',
        });
      } else {
        notifications.show({
          title: 'Error',
          message: 'Failed to place order',
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to place order',
      });
    }
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

      <Group justify="center" my="xl">
        <Button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/';
          }}
        >
          Logout
        </Button>
      </Group>
      <ColorSchemeToggle />
    </Box>
  );
}

export { Dashboard };
