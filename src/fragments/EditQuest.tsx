import { em, Modal } from "@mantine/core";
import CreateQuestsForm from "./CreateQuestsForm";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { getQuest, updateQuest } from "@/dao/QuestDao";
import { useEffect, useState } from "react";
import { AnyQuest } from "@/db/model";
import { notifications } from "@mantine/notifications";

export default function EditQuest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const [quest, setQuest] = useState<AnyQuest | null>(null);

  const fetchQuest = async () => {
    getQuest(id!).then((doc) => {
      setQuest(doc.data() as AnyQuest);
    });
  };

  useEffect(() => {
    fetchQuest();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const close = () => {
    navigate(-1);
  };

  const onSubmit = async (values: any, form: any) => {
    updateQuest(id!, values).then(() => {
        form.reset();
        notifications.show({
            title: "Quest updated",
            message: "Quest has been updated successfully",
            color: "green",
        })
        close();
    }).catch((error) => {
        notifications.show({
            title: "Failed to update quest",
            message: error.message,
            color: "red",
        })
    })
  };

  return (
    <Modal
      size="xl"
      opened
      onClose={close}
      title="Edit"
      fullScreen={isMobile}
      centered
    >
      {quest && <CreateQuestsForm quest={quest} submitHandler={onSubmit} />}
    </Modal>
  );
}
