import { notifications } from '@mantine/notifications';
import { axiosInstance } from './axiosSetup';

export const fetchProfile = async (setProfile: (profile: any) => void) => {
  try {
    const response = await axiosInstance.get('/profile');
    setProfile(response.data.data);
    notifications.show({
      title: 'Success',
      message: 'Profile data fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    notifications.show({
      title: 'Error',
      message: 'Failed to fetch profile data',
    });
  }
};

export const fetchHoldings = async (setHoldings: (holdings: any) => void) => {
  try {
    const response = await axiosInstance.get('/portfolio/holdings');
    if (response.data.status === 'success') {
      setHoldings(response.data);
      notifications.show({
        title: 'Success',
        message: 'Holdings data fetched successfully',
      });
    }
  } catch (error) {
    console.error('Error fetching holdings:', error);
    notifications.show({
      title: 'Error',
      message: 'Failed to fetch holdings data',
    });
  }
};

export const fetchChartData = async (
  symbol: string,
  fromDate: Date | null,
  toDate: Date | null,
  setChartData: (data: any) => void
) => {
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

export const fetchUserSpecificHoldings = async (setUserHolding: (holdings: any) => void) => {
  try {
    const response = await axiosInstance.get('/portfolio/user_holdings');
    setUserHolding(response.data);
    notifications.show({
      title: 'Success',
      message: 'Holdings data fetched successfully',
      color: 'green',
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    notifications.show({
      title: 'Error',
      message: 'Failed to fetch holdings data',
      color: 'red',
    });
  }
};

export const placeOrder = async (
  symbolFrom: string,
  quantity: number,
  price: number,
  fetchUserSpecificHoldings: (setUserHolding: (holdings: any) => void) => void,
  setUserHolding: (holdings: any) => void
) => {
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
      fetchUserSpecificHoldings(setUserHolding);
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
