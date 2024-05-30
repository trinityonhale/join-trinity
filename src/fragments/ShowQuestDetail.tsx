import { Group, Modal, Text } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import * as Model from "@/db/model";
import { useState, useEffect } from "react";
import { getQuest } from "@/dao/QuestDao";
import QuestUrgencyBadge from "@/components/QuestUrgencyBadge";
import { QuestUrgency } from "@/db/constants";

function QuestTitle(props: { quest: Model.AnyQuest | null }) {
  return (
    <>
      {props.quest === null ? null : (
        <Group>
          <QuestUrgencyBadge urgency={props.quest.urgency as QuestUrgency} />
          <Text>{props.quest.title}</Text>
        </Group>
      )}
    </>
  );
}

export default function ShowQuestDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

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
        <Text>{quest?.details}</Text>
      </Modal>
    </>
  );
}
