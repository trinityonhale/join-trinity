import Editor from "@/components/Editor";
import { createProposal } from "@/dao/ProposalDao";
import { ProposalStatus } from "@/db/constants";
import { useAuthProvider } from "@/providers/AuthProvider";
import {
  Box,
  Button,
  FileInput,
  InputWrapper,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Timestamp } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  UploadTask,
} from "firebase/storage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PROPOSAL_TEMPLATE = `
<p>In this document, a person or group of people will author a document describing a proposal and asking for feedback on it from the rest of the organization.</p>
<h2>Summary</h2>
<p>One paragraph explanation of the proposal</p>
<h2>Motivation / Benefits</h2>
<p>Why are we doing this? What is the expected outcome?</p>
<h2>Approach</h2>
<p>The recommended approach to fulfill the needs presented in the previous section.
<h2>Drawbacks</h2>
<p>Why should we not do this?</p>
`;

export default function ProposalForm() {
  const { user } = useAuthProvider();
  const navigate = useNavigate();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      attachments: [] as File[],
      content: PROPOSAL_TEMPLATE,
    },
    validate: {
      title: (value) => (value.trim().length > 0 ? null : "Title is required"),
      content: (value) =>
        value.trim().length > 0 ? null : "Content is required",
      attachments: (value) => {
        if (value.length < 0) return null;
        if (value.filter((file) => file.size > 10 * 1024 * 1024).length > 0) {
          return "Single file size should be less than 10MB";
        }
        return null;
      },
    },
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);

    console.debug("handleSubmit", values);

    try {
      const ref = await createProposal({
        title: values.title,
        content: values.content,
        attachments: [],
        uid: user!.uid,
        createdAt: Timestamp.now(),
        schemaVersion: 1,
        status: ProposalStatus.pending,
      });

      if (values.attachments.length > 0) {
        const result = await saveAttachments(ref.id, values.attachments);
        console.debug("all file uploaded", result);
      }

      navigate("/proposals/" + ref.id);
      notifications.show({
        title: "Proposal created",
        message: "We have added this proposal",
        color: "green",
      });
    } catch (e) {
      console.error("error submitting proposal", e)
    } finally {
      setLoading(false);
    }
  };

  let tasks: UploadTask[] = [];

  const saveAttachments = (proposalId: string, attachments: File[]) => {
    console.debug("Attachments for upload", attachments);

    tasks = [];

    const storage = getStorage();

    attachments.map((file: File) => {
      const task = uploadBytesResumable(
        ref(storage, `/proposal-attachments/${proposalId}/${file.name}`),
        file
      );

      tasks.push(task);
    });

    console.debug("Upload tasks", tasks);
    return Promise.all(tasks);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="sm">
        <TextInput
          label="Title"
          description="Enter a concise and descriptive title for your proposal"
          withAsterisk
          key="title"
          {...form.getInputProps("title")}
        ></TextInput>

        <InputWrapper
          label="Content"
          description="Provide detailed information about your proposal"
          withAsterisk
          key="content"
          {...form.getInputProps("content")}
        >
          <Editor {...form.getInputProps("content")} />
        </InputWrapper>

        <FileInput
          label="Attachments"
          description="Other supplementary documents or files"
          placeholder="Upload files"
          key="attachments"
          {...form.getInputProps("attachments")}
          multiple
        />

        <Box>
          <Button mt="md" type="submit" loading={loading}>
            Submit
          </Button>
        </Box>
      </Stack>
    </form>
  );
}
