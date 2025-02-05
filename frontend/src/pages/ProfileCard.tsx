import { Card, Group, Text, Title } from '@mantine/core';
import { Profile } from './Dashboard.page';


interface ProfileCardProps {
  profile: Profile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" m="xl" w="400" withBorder>
      {profile ? (
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
      ) : (
        <Title order={2} mb="md">
          Loading profile...
        </Title>
      )}
    </Card>
  );
}