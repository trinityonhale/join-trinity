import "@mantine/core/styles.css";
import '@mantine/notifications/styles.css';
import { MantineProvider } from "@mantine/core";
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
        <QuestsList />
      </ModalsProvider>
    </MantineProvider>
  );
}
