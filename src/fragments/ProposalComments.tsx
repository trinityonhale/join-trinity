import { createComment, getNextPageOfComments } from "@/dao/ProposalDao";
import { useAuthProvider } from "@/providers/AuthProvider";
import {
  Text,
  Avatar,
  Group,
  Box,
  Textarea,
  Stack,
  Button,
} from "@mantine/core";
import { QueryDocumentSnapshot, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProposalComment({ data }: { data: any }) {
  return (
    <Box mb="md">
      <Group>
        <Avatar
          src={data.author?.photoUrl}
          alt={data.author?.displayName}
          radius="xl"
        />
        <div>
          <Text size="sm">{data.author?.displayName}</Text>
          <Text size="xs" c="dimmed">
            {data.createdAt.toDate().toLocaleDateString()}
          </Text>
        </div>
      </Group>
      <Text pl={54} pt="sm" size="sm">
        {data.content}
      </Text>
    </Box>
  );
}

export default function ProposalComments() {
  const [content, setContent] = useState("");

  const { user } = useAuthProvider();
  const { id } = useParams();

  const hasContent = content.trim().length > 0;

  const send = async () => {
    if (hasContent) {
      await createComment(id!, {
        schemaVersion: 1,
        content,
        createdAt: Timestamp.now(),
        author: {
            uid: user!.uid,
            ...(user!.displayName && { displayName: user!.displayName }),
            ...(user!.photoURL && { photoUrl: user!.photoURL})
        }
      });

      setContent("");
      window.location.reload()
    }
  };

  const [lastComment, setLastComment] = useState<QueryDocumentSnapshot | null>(null);
  const [comments, setComments] = useState<QueryDocumentSnapshot[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);

  const loadComments = async () => {
    try {
        const ITEMS_PER_LOAD = 100
        const nextPage = await getNextPageOfComments(id!, lastComment, ITEMS_PER_LOAD);
        setLastComment(nextPage[nextPage.length - 1]);
        setComments([...comments, ...nextPage])
        setHasMoreData(nextPage.length === ITEMS_PER_LOAD);
    } catch (error) {
        console.error("Failed to load comments", error);
    }
  }

  useEffect(() => {
    loadComments().then(() => {
      console.log("loaded comments for ", id);
    })
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Stack mb="lg">
        <Textarea
          placeholder="Leave a comment"
          value={content}
          onChange={(event) => setContent(event.currentTarget.value)}
        ></Textarea>
        <Group>
          <Button disabled={!hasContent} onClick={send}>
            Send
          </Button>
        </Group>
      </Stack>
      {comments.map((comment) => (
        <ProposalComment key={comment.id} data={comment.data()} />
      ))}
    </>
  );
}
