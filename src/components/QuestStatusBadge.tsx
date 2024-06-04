import { QuestStatus } from "@/db/constants";
import { Badge } from "@mantine/core";

export default function QuestStatusBadge(props: { status: QuestStatus }) {
  const { status } = props;
  return (
    <>
      {status === "closed" && (
        <Badge variant="dot" color="red">
          Closed
        </Badge>
      )}
      {status === "open" && (
        <Badge variant="dot" color="blue">
          Open
        </Badge>
      )}
      {status === "adopted" && (
        <Badge variant="dot" color="green">
            Adopted
        </Badge>
      )}
    </>
  );
}
