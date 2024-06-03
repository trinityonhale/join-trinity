import { Card, Group, Text, Stack, Badge } from "@mantine/core";
import * as Model from "@/db/model";
import { QuestUrgency } from "@/db/constants";
import { Link } from "react-router-dom";
import QuestUrgencyBadge from "./QuestUrgencyBadge";

export default function QuestCard(props: {
  quest: Model.AnyQuest;
  id: string;
}) {
  const { quest, id } = props;

  return (
    <Link to={`/quests/${id}`} style={{ textDecoration: "none" }}>
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between">
          <Group gap="sm">
          {quest.status === "closed" && (
            <Badge variant="dot" color="red">
              Closed
            </Badge>
          )}
          {quest.status === "open" && (
            <Badge variant="dot" color="green">
              Open
            </Badge>
          )}
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
    </Link>
  );
}
