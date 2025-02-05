import { useEffect, useState } from 'react';
import { LineChart } from '@mantine/charts';
import { Box, Button, Card, Group, Select, Stack, Title } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useMediaQuery } from '@mantine/hooks';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';
import { fetchChartData, fetchHoldings, fetchProfile, fetchUserSpecificHoldings, placeOrder } from '@/utils/api';
import { OrderForm } from '../components/OrderForm';
import { ProfileCard } from '../components/ProfileCard';
import { TotalPnLCard } from '../components/TotalPnLCard';

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

export interface UserHolding {
  status: string;
  data: {
    symbol: string;
    price: number;
    quantity: number;
    user_id: number;
  }[];
}

function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [holdings, setHoldings] = useState<Holdings | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [symbol, setSymbol] = useState('NIFTY 50');
  const [fromDate, setFromDate] = useState<Date | null>(new Date('2017-01-02T00:00:00+05:30'));
  const [toDate, setToDate] = useState<Date | null>(new Date('2017-01-31T00:00:00+05:30'));
  const [userHolding, setUserHolding] = useState<null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    fetchUserSpecificHoldings(setUserHolding);
    fetchProfile(setProfile);
    fetchHoldings(setHoldings);
  }, []);

  useEffect(() => {
    if (fromDate && toDate) fetchChartData(symbol, fromDate, toDate, setChartData);
  }, [symbol, fromDate, toDate]);

  const totalPnL = holdings?.data.reduce((sum, item) => sum + item.pnl, 0);

  const handleSubmit = async (symbolFrom: string, quantity: number, price: number) => {
    await placeOrder(symbolFrom, quantity, price, fetchUserSpecificHoldings, setUserHolding);
  };

  return (
    <Box p="xl">
      <Box
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 20,
          marginBottom: 20,
        }}
      >
        <ProfileCard profile={profile} />
        <TotalPnLCard totalPnL={totalPnL} userHolding={userHolding} />
        <OrderForm handleSubmit={handleSubmit} />
        <Card shadow="sm" padding="lg" radius="md" withBorder w={'100%'}>
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