import { getUserAdoptedQuests } from "@/dao/QuestDao";
import useMeta from "@/hooks/useMeta";
import { useAuthProvider } from "@/providers/AuthProvider";
import { Button, Container, Loader, SimpleGrid, Title, Text } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import QuestCard from "@/components/QuestCard";
import { QuestWrapper } from "@/dao/QuestDao";

export default function MyQuests() {
  const { user } = useAuthProvider();
  const [quests, setQuests] = useState<QuestWrapper[]>([]);
  const [loading, setLoading] = useState(true);

  useMeta({
    title: "My Quests",
    description: "View and manage your quests.",
  });

  useEffect(() => {
    if (!user) return;

    getUserAdoptedQuests(user!.uid).then((quests) => {
      setLoading(true);
      setQuests(quests);
      setLoading(false);
    });
  }, [user]);

  const isEmpty = () => !loading && quests.length === 0;

  return (
    <Container size="xl" mt="xl">
      <Button
        leftSection={<IconChevronLeft size={14} />}
        component={Link}
        size="sm"
        variant="outline"
        radius="xl"
        to="/quests"
        color="blue"
      >
        Quests
      </Button>
      <Title order={2} mt="lg">
        My Quests
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 3 }} mt="xl">
        {quests.map((quest: QuestWrapper) => (
          <Link
            key={quest.id}
            to={`/my-quests/${quest.id}`}
            style={{ textDecoration: "none" }}
          >
            <QuestCard key={quest.id} quest={quest.data} />
          </Link>
        ))}
      </SimpleGrid>

      {loading && <Loader color="blue" />}
      {isEmpty() && <Text c="dimmed">No quests found</Text>}

      <Outlet />
    </Container>
  );
}
