import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { axiosInstance } from '../utils/axiosSetup';

export function AuthenticationForm(props: PaperProps) {
  const [type, toggle] = useToggle(['login', 'register']);
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      username: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      // name: (val) => (val.length === 0 ? 'Name is required' : null),
      username: (val) => (val.length === 0 ? 'Username is required' : null),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (values: typeof form.values) => {
    if (type === 'register') {
      try {
        const response = await axiosInstance.post('/register', {
          username: values.username,
          password: values.password,
        });
        if (response.status === 201) {
          notifications.show({
            title: 'Success',
            message: 'User registered successfully',
          });
          toggle();
        } else {
          notifications.show({
            title: 'Error',
            message: 'Internal server error',
          });
        }
      } catch (error: any) {
        console.error(error);
        if (error.response.status === 400) {
          notifications.show({
            title: 'Error',
            message: 'User already exists',
          });
        } else {
          notifications.show({
            title: 'Error',
            message: 'An error occurred',
          });
        }
      }
    } else {
      try {
        const response = await axiosInstance.post('/login', {
          username: values.username,
          password: values.password,
        });
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token);
          notifications.show({
            title: 'Success',
            message: 'Login successful',
          });
          navigate('/dashboard');
        } else {
          notifications.show({
            title: 'Error',
            message: 'Internal server error',
          });
        }
      } catch (error: any) {
        console.error(error);
        if (error.response.status === 400) {
          notifications.show({
            title: 'Error',
            message: 'Invalid credentials',
          });
        } else {
          notifications.show({
            title: 'Error',
            message: 'An error occurred',
          });
        }
      }
    }
  };

  return (
    <Box
      top="50%"
      left="50%"
      w={500}
      px="xl"
      pb="xl"
      pt="lg"
      style={{
        maxWidth: 'calc(100% - 40px)',

        transform: 'translate(-50%, -50%)',

        position: 'absolute',
      }}
    >
      <Paper radius="md" p="xl" withBorder {...props}>
        <Text size="lg" fw={500}>
          Welcome to Mantine, {type} with
        </Text>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {type === 'register' && (
              <TextInput
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                radius="md"
              />
            )}

            <TextInput
              required
              label="Username"
              placeholder="hello@mantine.dev"
              value={form.values.username}
              onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
              error={form.errors.email && 'Invalid username'}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password && 'Password should include at least 6 characters'}
              radius="md"
            />

            {type === 'register' && (
              <Checkbox
                label="I accept terms and conditions"
                checked={form.values.terms}
                onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
              />
            )}
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
              {type === 'register'
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit" radius="xl">
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Paper>
    </Box>
  );
}
