import "@mantine/core/styles.css";
import '@mantine/notifications/styles.css';
import { Container, MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import Header from "./components/Header";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import QuestsList from "./fragments/QuestsList";

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <ModalsProvider>
        <Notifications position="top-right" mt="64px"/>
        <Header />
        <Container size="xl" mt="xl">
          <QuestsList 
            cols={{ base: 1, sm: 2, md: 3, lg: 3, xl: 3 }}
          />
        </Container>
      </ModalsProvider>
    </MantineProvider>
  );
}
