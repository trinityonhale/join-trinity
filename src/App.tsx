import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import Header from "./components/Header";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { Routes, Route, Navigate } from "react-router-dom";

import Quests from "./views/Quests";
import ShowQuestDetail from "./fragments/ShowQuestDetail";


export default function App() {

  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <ModalsProvider>
        <Notifications position="top-right" mt="64px" />
        <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/quests" />} />
            <Route path="/quests" element={<Quests />}>
              <Route path=":id" element={<ShowQuestDetail />} />
            </Route>
          </Routes>
      </ModalsProvider>
    </MantineProvider>
  );
}
