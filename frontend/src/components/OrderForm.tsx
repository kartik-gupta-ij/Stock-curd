import { Box, Button, Card, NumberInput, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';

interface OrderFormProps {
  handleSubmit: (symbolFrom: string, quantity: number, price: number) => void;
}

export function OrderForm({ handleSubmit }: OrderFormProps) {
  const form = useForm({
    initialValues: {
      symbol: '',
      quantity: 1,
      price: 0,
    },
    validate: {
      symbol: (value) => (value.length > 0 ? null : 'Symbol is required'),
      quantity: (value) => (value > 0 ? null : 'Quantity must be greater than 0'),
      price: (value) => (value > 0 ? null : 'Price must be non-negative and non-zero'),
    },
  });

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card shadow="sm" padding="lg" radius="md" m="xl" w="400" withBorder>
        <Title order={2} mb="md">
          Place Order
        </Title>
        <form
          onSubmit={form.onSubmit((values) =>
            handleSubmit(values.symbol, values.quantity, values.price)
          )}
        >
          <Stack gap="sm">
            <TextInput required label="Symbol" {...form.getInputProps('symbol')} />
            <NumberInput required label="Quantity" {...form.getInputProps('quantity')} />
            <NumberInput required label="Price" {...form.getInputProps('price')} />
            <Button type="submit">Place Order</Button>
          </Stack>
        </form>
      </Card>
    </Box>
  );
}
