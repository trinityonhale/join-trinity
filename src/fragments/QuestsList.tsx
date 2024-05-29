import QuestCard from "@/components/QuestCard";
import { SimpleGrid, Container } from "@mantine/core";
import { Model } from "@/db/model";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getNextPageOfQuests } from "@/dao/QuestDao";

export default function QuestsList() {
  const [quests, setQuests] = useState<QueryDocumentSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastQuest, setLastQuest] = useState<QueryDocumentSnapshot | null>(
    null
  );

  const loadQuests = async () => {
    setLoading(true);
    const nextPage = await getNextPageOfQuests(lastQuest, 10);
    setLastQuest(nextPage[nextPage.length - 1]);
    setQuests([...quests, ...nextPage]);
    setLoading(false);

    console.log(quests);
  };

  useEffect(() => {
    loadQuests();
  }, []);

  return (
    <Container size="xl">
      <SimpleGrid cols={3}>
        {quests.map((quest) => (
          <QuestCard
            key={quest.id}
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
    </Container>
  );
}
