import { Card, Group, Badge, Text } from "@mantine/core";
import { Model } from "@/db/model";
import { QuestUrgency } from "@/db/constants";

export default function QuestCard(props: { quest: Model.AnyQuest }) {
  const { quest } = props;

  enum QuestUrgencyColor {
    low = "green",
    medium = "orange",
    high = "red",
  }

  return (
    <Card withBorder padding="lg" radius="md">
      <Group justify="space-between">
        <Badge
          bg={
            QuestUrgencyColor[
              QuestUrgency[quest.urgency] as keyof typeof QuestUrgencyColor
            ]
          }
        >
          {QuestUrgency[quest.urgency]}
        </Badge>
        <Text c="dimmed" fz="sm">
          {quest.createdAt.toDate().toLocaleDateString()}
        </Text>
      </Group>

      <Text fz="lg" fw={500} mt="md">
        {quest.title}
      </Text>
      <Text fz="sm" c="dimmed" mt={5}>
        {quest.details.substring(0, 100)}
      </Text>
    </Card>
  );
}
