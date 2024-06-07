import { QuestStatus, QuestUrgency } from "@/db/constants";
import {
  Button,
  Group,
  InputWrapper,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import { ComboboxData } from "@mantine/core";
import Editor from "@/components/Editor";
import { Timestamp } from "firebase/firestore";

type QuestFormValues = {
  title: any;
  details: any;
  urgency: any;
};

export default function CreateQuestsForm({
  quest,
  submitHandler,
}: {
  quest?: any;
  submitHandler: (values: any, form: UseFormReturnType<any>) => Promise<any>;
}) {
  const form: UseFormReturnType<QuestFormValues> = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: quest?.title || "",
      details: quest?.details || "",
      urgency: quest?.urgency.toString() || null,
    },
    validate: {
      title: (value) => (value.trim().length > 0 ? null : "Title is required"),
      details: () => null, // No validation for details (optional field)
      urgency: (value) => value == null && "Urgency is required",
    },
  });

  const urgencyOptions: ComboboxData = Object.entries(QuestUrgency)
    .filter(([key]) => isNaN(parseInt(key))) // Filter out non-numeric keys
    .map(([key, value]) => ({
      value: value.toString(),
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }));

  const getExcerpt = (details: string) => {
    const elem = document.createElement("div");
    elem.innerHTML = details;
    return elem.innerText.substring(0, 100);
  };

  const handleSubmit = async (values: typeof form.values) => {
    const propagatedValues = {
      title: values.title,
      details: values.details,
      excerpt: getExcerpt(values.details),
      urgency: parseInt(values.urgency),
      status: QuestStatus.open,
      schemaVersion: 1,
      createdAt: new Timestamp(new Date().getTime() / 1000, 0),
    };

    submitHandler(propagatedValues, form);
  };

  console.log("form", form.getInputProps("details"));

  return (
    <div>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
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

          <InputWrapper label="Details" {...form.getInputProps("details")}>
            <Editor {...form.getInputProps("details")} />
          </InputWrapper>

          <Group justify="flex-end" mt="md">
            <Button type="submit">{quest ? "Save" : "Create"}</Button>
          </Group>
        </Stack>
      </form>
    </div>
  );
}
