import "@mantine/core/styles.css";
import '@mantine/notifications/styles.css';
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import Header from "./components/Header";
import { Notifications } from "@mantine/notifications";

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Notifications position="top-right" mt="64px"/>
      <Header />
    </MantineProvider>
  );
}
