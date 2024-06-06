import QuestCard from "@/components/QuestCard";
import {
  SimpleGrid,
  Loader,
  Group,
  Button,
  Text,
  SegmentedControl,
  Container,
} from "@mantine/core";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getNextPageOfQuests } from "@/dao/QuestDao";
import { EVT_QUEST_CREATED, EVT_QUEST_DELETED } from "@/events";
import { subscribe } from "@nucleoidai/react-event";
import { QuestStatus } from "@/db/constants";
import { Link } from "react-router-dom";
import useMeta from "@/hooks/useMeta";

function QuestFilter(props: { status: QuestStatus, onChange: (status: QuestStatus) => void}) {
  const { status, onChange } = props;

  const statusColor = () => {
    switch (status) {
      case QuestStatus.open:
        return "blue";
      case QuestStatus.adopted:
        return "green";
      case QuestStatus.closed:
        return "purple";
      default:
        return "blue";
    }
  };

  const handleSetStatus = (status: string) => {
    // call the parent's function
    onChange(QuestStatus[status as keyof typeof QuestStatus]);
  }

  return (
    <Container size="xs" px={0}>
    <SegmentedControl
      color={statusColor()}
      value={status}
      onChange={handleSetStatus}
      fullWidth
      radius="xl"
      data={[
        { value: QuestStatus.open, label: "Open" },
        { value: QuestStatus.adopted, label: "Adopted" },
        { value: QuestStatus.closed, label: "Closed" },
      ]}
    />
    </Container>
  );
}

const ITEMS_PER_PAGE = 12;

export default function QuestsList(props: {
  cols?: {
    base: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}) {
  const [quests, setQuests] = useState<QueryDocumentSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<QuestStatus>(QuestStatus.open);
  const [lastQuest, setLastQuest] = useState<QueryDocumentSnapshot | null>(
    null
  );
  const [hasMoreData, setHasMoreData] = useState(true);

  const loadQuests = async () => {
    setLoading(true);
    try {
      const nextPage = await getNextPageOfQuests(lastQuest, ITEMS_PER_PAGE, status);
      setLastQuest(nextPage[nextPage.length - 1]);
      setHasMoreData(nextPage.length === ITEMS_PER_PAGE);
      setQuests([...quests, ...nextPage]);
    } catch (error) {
      console.error("Failed to load quests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuests().then(() => {
      console.log("loaded quests", status);
    })
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  const onStatusChange = (status: QuestStatus) => {
    setStatus(status);
    setQuests([]);
    setLastQuest(null);
  }

  useMeta({
    title: "Quests",
    description: "View and manage quests",
  });

  useEffect(() => {
    loadQuests();

    subscribe(EVT_QUEST_CREATED, (quest: QueryDocumentSnapshot) => {
      setQuests((quests) => [quest, ...quests]);
    });

    subscribe(EVT_QUEST_DELETED, (id: string) => {
      setQuests((quests) => quests.filter((quest) => quest.id !== id));
    });

    console.log("i fire once");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // it has more data
  const showLoadMoreButton = () => hasMoreData && !loading && quests.length > 0;
  const hasNoData = () => !loading && quests.length === 0;

  return (
    <>
      <QuestFilter status={status} onChange={onStatusChange} />

      <SimpleGrid cols={props.cols} mt="lg">
        {quests.map((quest) => (
          <Link
            key={quest.id}
            to={`/quests/${quest.id}`}
            style={{ textDecoration: "none" }}
          >
            <QuestCard
              quest={{
                excerpt: quest.data().excerpt,
                schemaVersion: quest.data().schemaVersion,
                title: quest.data().title,
                details: quest.data().details,
                urgency: quest.data().urgency,
                createdAt: quest.data().createdAt,
                status: quest.data().status,
              }}
            />
          </Link>
        ))}
      </SimpleGrid>

      <Group justify="center">{loading && <Loader color="blue" />}</Group>

      <Group justify="center" mt="xl">
        {showLoadMoreButton() && (
          <Button onClick={loadQuests} color="blue">
            Load more
          </Button>
        )}
      </Group>

      <Group justify="center">
        {hasNoData() && <Text>Behold, no quests found</Text>}
      </Group>
    </>
  );
}
