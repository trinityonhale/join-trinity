import { QuestUrgency } from "@/db/constants";
import { Button, Group, Select, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ComboboxData } from "@mantine/core";
import { createQuest, getQuest } from "@/dao/QuestDao";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { DocumentReference, Timestamp } from "firebase/firestore";
import { EVT_QUEST_CREATED } from "@/events";
import { publish } from "@nucleoidai/react-event";

export default function CreateQuestsForm() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      details: "",
      urgency: "2",
    },
    validate: {
      title: (value) => (value.trim().length > 0 ? null : "Title is required"),
      details: (value) =>
        value.trim().length > 0 ? null : "Details is required",
      urgency: (value) => value == null && "Urgency is required",
    },
  });

  const urgencyOptions: ComboboxData = Object.entries(QuestUrgency)
    .filter(([key]) => isNaN(parseInt(key))) // Filter out non-numeric keys
    .map(([key, value]) => ({
      value: value.toString(),
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }));

  const handleSubmit = async (values: typeof form.values) => {
    createQuest({
      title: values.title,
      details: values.details,
      urgency: parseInt(values.urgency),
      schemaVersion: 1,
      createdAt: new Timestamp(new Date().getTime() / 1000, 0)
    }).then(async (ref: DocumentReference) => {
      form.reset();
      modals.closeAll();
      notifications.show({
        title: "Quest created",
        message: "Quest has been created successfully",
        color: "green",
      })
      publish(EVT_QUEST_CREATED, await getQuest(ref.id))
    })
  }

  return (
    <div>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Title"
          placeholder="Enter title"
          withAsterisk
          key="title"
          {...form.getInputProps("title")}
        />

        <Select
          label="Urgency"
          placeholder="Select urgency"
          withAsterisk
          key="urgency"
          data={urgencyOptions}
          {...form.getInputProps("urgency")}
        />

        <Textarea
          label="Details"
          placeholder="Enter details"
          withAsterisk
          key="details"
          {...form.getInputProps("details")}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Create</Button>
        </Group>
      </form>
    </div>
  );
}
