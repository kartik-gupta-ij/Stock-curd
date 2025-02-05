import { Card, Group, Text, Title } from '@mantine/core';
import { Profile } from '../pages/Dashboard.page';

interface ProfileCardProps {
  profile: Profile | null;
}

const renderProfileInfo = (profile: Profile) => (
  <>
    <Title order={2} mb="md">
      Profile Information
    </Title>
    <Group>
      <Text fw={500}>User ID:</Text>
      <Text>{profile.user_id}</Text>
    </Group>
    <Group>
      <Text fw={500}>User Type:</Text>
      <Text>{profile.user_type}</Text>
    </Group>
    <Group>
      <Text fw={500}>Email:</Text>
      <Text>{profile.email}</Text>
    </Group>
    <Group>
      <Text fw={500}>User Name:</Text>
      <Text>{profile.user_name}</Text>
    </Group>
    <Group>
      <Text fw={500}>Broker:</Text>
      <Text>{profile.broker}</Text>
    </Group>
  </>
);

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w={'100%'}>
      {profile ? (
        renderProfileInfo(profile)
      ) : (
        <Title order={2} mb="md">
          Loading profile...
        </Title>
      )}
    </Card>
  );
}
