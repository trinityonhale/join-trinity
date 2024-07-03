import {
  Button,
  Container,
  Menu,
  Card,
  Group,
  Text,
  Badge,
  Box,
  Title,
} from "@mantine/core";
import { IconFlare, IconMessages } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export function ProposalItem() {
  return (
    <Box py="sm">
      <Badge color="blue" variant="dot">
        Pending
      </Badge>
      <Group mt="sm">
        <Box flex={1}>
          <Text fw={500}>
            Name of the proposal
          </Text>
          <Text c="dimmed" size="sm">
            Authored by Jane Doe on 16/06/2024
          </Text>
        </Box>

        <Group gap="sm">
          <Group gap="xs">
            <IconMessages size="16" />
            <Text size="sm">3</Text>
          </Group>

          <Group gap="xs">
            <IconFlare size="16" />
            <Text size="sm">8</Text>
          </Group>
        </Group>
      </Group>
    </Box>
  );
}

export default function Proposals() {
  return (
    <Container size="xl" mt="lg">
      <Group mb="xl">
        <Title order={2} flex={1}>Proposals</Title>
        <Button component={Link}
        to="/proposals/create"
        >Submit a proposal</Button>
      </Group>
      <Card py={0}>
        {Array.from({ length: 2 }).map((_, index) => (
                <ProposalItem />
            ))}
      </Card>

      <Title order={3} mb="lg" mt="xl">Past Proposals</Title>
      <Card py={0}>
        {Array.from({ length: 3 }).map((_, index) => (
                <ProposalItem />
            ))}
      </Card>
    </Container>
  );
}
