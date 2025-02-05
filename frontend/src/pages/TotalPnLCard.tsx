import { Card, Text, Title } from '@mantine/core';

interface TotalPnLCardProps {
  totalPnL: number;
}

export function TotalPnLCard({ totalPnL }: TotalPnLCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" m="xl" w="400" withBorder>
      <Title order={2} mb="md">
        Total Profit/Loss
      </Title>
      <Text size="xl" fw={700} c={totalPnL >= 0 ? 'green' : 'red'}>
        {totalPnL ? totalPnL.toFixed(2) : 'Loading...'}
      </Text>
    </Card>
  );
}
