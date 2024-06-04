import {
    Container
} from '@mantine/core';

import QuestsList from "@/fragments/QuestsList";
import { Outlet } from "react-router-dom";

export default function Quests() {
  return (
    <Container size="xl" mt="xl">
      <QuestsList cols={{ base: 1, sm: 2, md: 3, lg: 3, xl: 3 }} />
      <Outlet />
    </Container>
  );
}