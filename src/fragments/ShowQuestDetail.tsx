import {
  Button,
  Group,
  Modal,
  Stack,
  Text,
  Avatar,
  Badge,
  Box,
  Divider,
} from "@mantine/core";

import { Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import * as Model from "@/db/model";
import { useState, useEffect } from "react";
import { getQuest } from "@/dao/QuestDao";
import QuestUrgencyBadge from "@/components/QuestUrgencyBadge";
import { QuestUrgency } from "@/db/constants";
import { useAuthProvider } from "@/providers/AuthProvider";

function QuestInProgressAlert() {
  const icon = <IconInfoCircle />;
  return (
    <Alert
      variant="light"
      color="blue"
      title="Quest in progress 🎉"
      icon={icon}
    >
      %username is currently working on this quest, we thank them for their help
    </Alert>
  );
}

function QuestTitle(props: { quest: Model.AnyQuest | null }) {
  return (
    <>
      {props.quest === null ? null : (
        <Stack gap="4px">
          <Text fw={600} size="lg">
            {props.quest.title}
          </Text>
          <Group gap="xs">
            <Badge variant="dot" color="green">
              Open
            </Badge>
            <QuestUrgencyBadge urgency={props.quest.urgency as QuestUrgency} />
            <Text size="sm" c="dimmed">
              {props.quest.createdAt.toDate().toLocaleDateString()}&nbsp;
              {props.quest.createdAt.toDate().toLocaleTimeString()}
            </Text>
          </Group>
        </Stack>
      )}
    </>
  );
}

export function CommentSimple() {
  return (
    <div>
      <Group>
        <Avatar
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"
          alt="Jacob Warnhalter"
          radius="xl"
        />
        <div>
          <Text size="sm">Jacob Warnhalter</Text>
          <Text size="xs" c="dimmed">
            10 minutes ago
          </Text>
        </div>
      </Group>
      <Text pl={54} pt="sm" size="sm">
        This Pokémon likes to lick its palms that are sweetened by being soaked
        in honey. Teddiursa concocts its own honey by blending fruits and pollen
        collected by Beedrill. Blastoise has water spouts that protrude from its
        shell. The water spouts are very accurate.
      </Text>
    </div>
  );
}

export default function ShowQuestDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { role } = useAuthProvider();

  const [quest, setQuest] = useState<Model.AnyQuest | null>(null);

  useEffect(() => {
    getQuest(id!).then((doc) => {
      setQuest(doc.data() as Model.AnyQuest);
    });
  }, []);

  const close = () => {
    navigate("/quests");
  };

  return (
    <>
      <Modal
        size="xl"
        opened
        onClose={close}
        title={<QuestTitle quest={quest} />}
        centered
      >
        <Stack mih="50vh">
          <Box flex={1}>
            <QuestInProgressAlert />
            <Text flex={1} mb="lg" mt="md">
              {quest?.details}
            </Text>

            <Group>
              <Button variant="light">Accept the quest</Button>
            </Group>
          </Box>

          {/* <Divider label="Comments" />
          <Stack gap="sm">
            {[1, 2, 3, 4, 5, 6, 7].map(() => (
              <CommentSimple />
            ))}
          </Stack> */}

          {role === "admin" && (
            <Box>
              <Divider mb="md"></Divider>
              <Group>
                <Button color="green" variant="light">
                  Mark as closed
                </Button>
                <Button color="grape" variant="light">
                  Re-open
                </Button>
                <Button variant="light">Edit</Button>

                <Button color="red" variant="outline">
                  Delete
                </Button>
              </Group>
            </Box>
          )}
        </Stack>
      </Modal>
    </>
  );
}
