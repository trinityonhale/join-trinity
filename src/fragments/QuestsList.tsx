import QuestCard from "@/components/QuestCard";
import { SimpleGrid, Loader, Group, Button, Text } from "@mantine/core";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getNextPageOfQuests } from "@/dao/QuestDao";
import { EVT_QUEST_CREATED } from "@/events";
import { subscribe } from "@nucleoidai/react-event";

const ITEMS_PER_PAGE = 10;

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
  const [lastQuest, setLastQuest] = useState<QueryDocumentSnapshot | null>(
    null
  );
  const [hasMoreData, setHasMoreData] = useState(true);

  const loadQuests = async () => {
    setLoading(true);
    const nextPage = await getNextPageOfQuests(lastQuest, ITEMS_PER_PAGE);
    setLastQuest(nextPage[nextPage.length - 1]);

    if (nextPage.length < ITEMS_PER_PAGE) {
      setHasMoreData(false);
    }

    setQuests([...quests, ...nextPage]);
    setLoading(false);
  };

  useEffect(() => {
    loadQuests();

    subscribe(EVT_QUEST_CREATED, (quest: QueryDocumentSnapshot) => {
      setQuests((quests) => ([quest, ...quests]));
    })

    console.log('i fire once');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // it has more data
  const showLoadMoreButton = () => hasMoreData && !loading && quests.length > 0;
  const hasNoData = () => !loading && quests.length === 0;

  return (
    <>
      <SimpleGrid cols={props.cols}>
        {quests.map((quest) => (
          <QuestCard
            key={quest.id}
            id={quest.id}
            quest={{
              schemaVersion: quest.data().schemaVersion,
              title: quest.data().title,
              details: quest.data().details,
              urgency: quest.data().urgency,
              createdAt: quest.data().createdAt,
            }}
          />
        ))}
      </SimpleGrid>

      <Group justify="center">{loading && <Loader color="blue" />}</Group>

      <Group justify="center">
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
