import {
  Button,
  Group,
  Modal,
  Stack,
  Text,
  Avatar,
  Box,
  Divider,
  em,
  TypographyStylesProvider,
} from "@mantine/core";

import DOMPurify from 'dompurify';

import { Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import * as Model from "@/db/model";
import { useState, useEffect } from "react";
import {
  changeQuestStatus,
  deleteQuest,
  getQuest,
  getQuestAssignments,
  takeQuest,
  withdrawQuest,
} from "@/dao/QuestDao";
import QuestUrgencyBadge from "@/components/QuestUrgencyBadge";
import { QuestStatus, QuestUrgency, Role } from "@/db/constants";
import { useAuthProvider } from "@/providers/AuthProvider";
import { modals } from "@mantine/modals";
import { publish } from "@nucleoidai/react-event";
import { EVT_QUEST_DELETED } from "@/events";
import QuestStatusBadge from "@/components/QuestStatusBadge";
import { useMediaQuery } from '@mantine/hooks';
import useMeta from "@/hooks/useMeta";

function QuestInProgressAlert(props: {
  assignment: Model.RetrievedQuestAssignment | null;
  unassignQuest: () => void;
}) {
  const { user, role } = useAuthProvider();
  const { assignment, unassignQuest } = props;

  const icon = <IconInfoCircle />;

  const title = (
    <Stack gap={0}>
      <Text fw="bold" lh={1}>
        Quest in progress 🎉
      </Text>
      <Text c="dimmed" size="sm" mt={4}>
        {props.assignment?.assignedAt.toDate().toLocaleDateString()}
      </Text>
    </Stack>
  );

  return (
    <Alert
      variant="light"
      color="blue"
      title={title}
      icon={icon}
      radius="lg"
      mt="md"
    >
      {assignment?.assignee.uid == user?.uid
        ? "You are currently working on this quest, thank you for your help"
        : `This quest is currently being worked on by ${assignment?.assignee.displayName}, we thank them for their help.`}
      <Box mt="md">
        {assignment &&
          (role == Role.admin || assignment.assignee.uid == user?.uid) && (
            <Button variant="outline" onClick={unassignQuest}>
              Withdraw
            </Button>
          )}
      </Box>
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
            <QuestStatusBadge status={props.quest.status as QuestStatus} />
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

  const { role, user } = useAuthProvider();

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const [quest, setQuest] = useState<Model.AnyQuest | null>(null);
  const [assignment, setAssignment] =
    useState<Model.RetrievedQuestAssignment | null>(null);

  const fetchQuest = async () => {
    getQuest(id!).then((doc) => {
      setQuest(doc.data() as Model.AnyQuest);
      getQuestAssignments(id!).then((doc) => {
        console.log(doc);
        setAssignment(doc);
      });
    });
  };

  useMeta({
    title: quest?.title || "Loading",
  });

  useEffect(() => {
    fetchQuest();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const close = () => {
    navigate(-1)
  };

  const markAsClosed = () => {
    changeQuestStatus(id!, QuestStatus.closed).then(() => {
      fetchQuest();
    });
  };

  const markAsOpened = () => {
    changeQuestStatus(id!, assignment != null ? QuestStatus.adopted : QuestStatus.open).then(() => {
      fetchQuest();
    });
  };

  const assignQuest = () => {
    takeQuest(id!, user!.uid).then(() => {
      fetchQuest();
    });
  };

  const unassignQuest = () => {
    withdrawQuest(id!).then(() => {
      fetchQuest();
    });
  };

  const remove = () => {
    const onConfirm = () => {
      deleteQuest(id!).then(() => {
        publish(EVT_QUEST_DELETED, id);
        close();
      });
    };
    modals.openConfirmModal({
      title: "Delete quest",
      children: (
        <Text size="sm">
          Are you sure you want to delete this quest? This action cannot be
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: onConfirm,
    });
  };

  return (
    <>
      <Modal
        size="xl"
        opened
        onClose={close}
        title={<QuestTitle quest={quest} />}
        fullScreen={isMobile}
        centered
      >
        <Stack mih="50vh">
          <Box flex={1}>
            {assignment && quest!.status !== QuestStatus.closed && (
              <QuestInProgressAlert
                assignment={assignment}
                unassignQuest={unassignQuest}
              />
            )}

            {assignment && quest!.status === QuestStatus.closed && (
              <Alert
                title="Quest completed"
                color="green"
                icon={<IconInfoCircle />}
                radius="lg"
                mt="md"
              >
                This quest has been completed by {assignment.assignee.displayName}
              </Alert>
            )}

            {!assignment && quest?.status === QuestStatus.closed && (
              <Alert
                title="Quest closed"
                color="red"
                icon={<IconInfoCircle />}
                radius="lg"
                mt="md"
              >
                This quest has been closed
              </Alert>
            )}

            <Box flex={1} mb="lg" mt="md">
            <TypographyStylesProvider>
              { <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(quest?.details || "") }} /> }
            </TypographyStylesProvider>
            </Box>

            {!assignment && quest?.status !== QuestStatus.closed && (
              <Button variant="outline" onClick={assignQuest}>
                Take this quest
              </Button>
            )}
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
                {quest?.status !== QuestStatus.closed && (
                  <Button color="green" variant="light" onClick={markAsClosed}>
                    Mark as closed
                  </Button>
                )}
                {quest?.status === QuestStatus.closed && (
                  <Button color="grape" variant="light" onClick={markAsOpened}>
                    Re-open
                  </Button>
                )}
                <Button variant="light">Edit</Button>

                <Button color="red" variant="outline" onClick={remove}>
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
