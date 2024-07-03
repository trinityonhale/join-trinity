import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import Header from "./components/Header";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { Routes, Route, Navigate } from "react-router-dom";
import loadable from "@loadable/component";

const Quests = loadable(() => import("./views/Quests"));
const MyQuests = loadable(() => import("./views/MyQuests"));
const ShowQuestDetail = loadable(() => import("./fragments/ShowQuestDetail"));
const EditQuest = loadable(() => import("./fragments/EditQuest"));

const Proposals = loadable(() => import("./views/Proposals"));
const CreateProposal = loadable(() => import("./views/CreateProposal"))
const ProposalDetail = loadable(() => import("./views/ProposalDetail"));

export default function App() {

  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <ModalsProvider>
        <Notifications position="top-right" mt="64px" />
        <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/quests" />} />
            <Route path="/my-quests" element={<MyQuests />}>
              <Route path=":id" element={<ShowQuestDetail />} />
            </Route>
            <Route path="/quests" element={<Quests />}>
              <Route path=":id" element={<ShowQuestDetail />} />
              <Route path=":id/edit" element={<EditQuest />} />
            </Route>
            <Route path="/proposals" element={<Proposals />} />
            <Route path="/proposals/create" element={<CreateProposal />} />
            <Route path="/proposals/:id" element={<ProposalDetail />} />
          </Routes>
      </ModalsProvider>
    </MantineProvider>
  );
}
