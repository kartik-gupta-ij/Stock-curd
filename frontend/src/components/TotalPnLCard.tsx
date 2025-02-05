import { Card, Table, Text, Title } from '@mantine/core';
import { UserHolding } from '@/pages/Dashboard.page';

interface TotalPnLCardProps {
  totalPnL: number | undefined;
  userHolding: UserHolding | null;
}

const calculateTotalPnLWithUserHolding = (
  totalPnL: number | undefined,
  userHolding: UserHolding | null
) => {
  return (
    (totalPnL ?? 0) +
    (userHolding?.data.reduce((acc, holding) => acc + holding.quantity * holding.price, 0) || 0)
  );
};

const renderRows = (userHolding: UserHolding | null) => {
  return userHolding?.data.map((holding, i) => (
    <Table.Tr key={holding.symbol}>
      <Table.Td>{i + 1}</Table.Td>
      <Table.Td>{holding.quantity}</Table.Td>
      <Table.Td>{holding.symbol}</Table.Td>
      <Table.Td>{holding.price}</Table.Td>
    </Table.Tr>
  ));
};

export function TotalPnLCard({ totalPnL, userHolding }: TotalPnLCardProps) {
  const totalPnLWithUserHolding = calculateTotalPnLWithUserHolding(totalPnL, userHolding);
  const rows = renderRows(userHolding);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w={'100%'}>
      <Title order={2} mb="md">
        Total Profit/Loss
      </Title>
      <Text size="xl" fw={700} c={(totalPnL ?? 0) >= 0 ? 'green' : 'red'}>
        {totalPnL ? totalPnLWithUserHolding.toFixed(2) : 'Loading...'}
      </Text>
      {userHolding?.data?.length! > 0 && (
        <>
          <Title order={2} mb="md">
            User Holdings
          </Title>
          <Table striped withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>S. no.</Table.Th>
                <Table.Th>Quantity</Table.Th>
                <Table.Th>Symbol</Table.Th>
                <Table.Th>Price</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </>
      )}
    </Card>
  );
}
