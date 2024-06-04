import { Card, Group, Text, Stack } from "@mantine/core";
import * as Model from "@/db/model";
import { QuestStatus, QuestUrgency } from "@/db/constants";
import QuestUrgencyBadge from "./QuestUrgencyBadge";
import QuestStatusBadge from "./QuestStatusBadge";

export default function QuestCard(props: { quest: Model.AnyQuest }) {
  const { quest } = props;

  return (
    <Card withBorder padding="lg" radius="md">
      <Group justify="space-between">
        <Group gap="sm">
          <QuestStatusBadge status={quest.status as QuestStatus} />
          <QuestUrgencyBadge urgency={quest.urgency as QuestUrgency} />
        </Group>
        <Text c="dimmed" fz="sm">
          {quest.createdAt.toDate().toLocaleDateString()}
        </Text>
      </Group>

      <Stack h="3rem" mt="xs">
        <Text fw={500} lineClamp={2}>
          {quest.title}
        </Text>
      </Stack>
      <Text fz="sm" c="dimmed" mt={5} lineClamp={5} h={108}>
        {quest.details?.substring(0, 300)}
      </Text>
    </Card>
  );
}
