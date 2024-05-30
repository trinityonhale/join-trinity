import { QuestUrgency } from "@/db/constants";
import { Badge } from "@mantine/core";

export default function QuestUrgencyBadge(props: { urgency: QuestUrgency }) {
  enum QuestUrgencyColor {
    low = "green",
    medium = "orange",
    high = "red",
  }
  return (
    <Badge
      bg={
        QuestUrgencyColor[
          QuestUrgency[props.urgency] as keyof typeof QuestUrgencyColor
        ]
      }
    >
      {QuestUrgency[props.urgency]}
    </Badge>
  );
}
