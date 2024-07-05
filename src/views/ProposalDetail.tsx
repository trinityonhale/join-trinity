import { checkIsAlreadySigned, getProposal } from "@/dao/ProposalDao";
import { getUserById } from "@/dao/UserDao";
import { AnyProposal, UserV1 } from "@/db/model";
import {
  Timeline,
  Text,
  Container,
  Group,
  Box,
  Flex,
  Card,
  ThemeIcon,
  TypographyStylesProvider,
  Button,
  Anchor,
  Alert,
} from "@mantine/core";

import { signProposal as signProposalAction } from "@/dao/ProposalDao";

import DOMPurify from "dompurify";

import { IconFlare, IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PROPOSAL_SIGNATURES_THRESHOLD, ProposalStatus } from "@/db/constants";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import { modals } from "@mantine/modals";
import { useAuthProvider } from "@/providers/AuthProvider";

function ProposalTimeline(props: { status: ProposalStatus }) {
  const activeStatus = () => {
    switch (props.status) {
      case ProposalStatus.pending:
        return 0;
      case ProposalStatus.considering:
        return 1;
      case ProposalStatus.accepted:
        return 2;
      default: // rejected or dropped
        return 3;
    }
  };

  return (
    <Timeline active={activeStatus()} lineWidth={2} bulletSize={24}>
      {/* items */}
      <Timeline.Item title="Collect Signature" color="yellow">
        <Text size="xs" mt={4}>
          2 hours ago
        </Text>
      </Timeline.Item>

      <Timeline.Item title="Under Consideration" color="blue">
        <Text size="xs" mt={4}>
          52 minutes ago
        </Text>
      </Timeline.Item>

      <Timeline.Item title="Approved" color="green">
        <Text size="xs" mt={4}>
          Just now
        </Text>
      </Timeline.Item>

      <Timeline.Item title="Rejected" color="red">
        <Text size="xs" mt={4}>
          Just now
        </Text>
      </Timeline.Item>

      <Timeline.Item title="Dropped" color="red">
        <Text size="xs" mt={4}>
          Just now
        </Text>
      </Timeline.Item>
    </Timeline>
  );
}

function SignatureButton() {
  enum SignStatus {
    LOADING = "loading",
    SIGNED = "signed",
    UNSIGNED = "unsigned",
  }

  const [signStatus, setSignStatus] = useState<SignStatus>(SignStatus.LOADING);

  const { id } = useParams();
  const { user } = useAuthProvider();

  const checkSignStatus = async () => {
    if (!user) return;
    setSignStatus(SignStatus.LOADING);
    const status = await checkIsAlreadySigned(id!, user!);
    setSignStatus(status ? SignStatus.SIGNED : SignStatus.UNSIGNED);
  };

  useEffect(() => {
    checkSignStatus();
  }, [user]);

  const signProposal = () => {
    const signProposalHandler = async () => {
      await signProposalAction(id!, user!);
      await checkSignStatus();
    };

    console.debug("signing proposal for user", user);

    modals.openConfirmModal({
      title: "Sign proposal",
      children: (
        <Text size="sm">
          Please confirm you are going to sign this proposal, signature cannot
          be reversed
        </Text>
      ),
      onConfirm: signProposalHandler,
      labels: { confirm: "Sign", cancel: "Cancel" },
    });
  };

  return (
    <>
      {user && (
        <Button
          fullWidth
          mt="xl"
          onClick={signProposal}
          loading={signStatus == SignStatus.LOADING}
          disabled={signStatus != SignStatus.UNSIGNED}
        >
          {signStatus == SignStatus.SIGNED ? "Signed" : "Sign the proposal"}
        </Button>
      )}
      {!user && (
        <Button fullWidth mt="xl">
          Log in to sign
        </Button>
      )}
    </>
  );
}
export default function ProposalDetail() {
  type Attachment = {
    name: string;
    url: string;
  };

  const { id } = useParams();
  const [proposal, setProposal] = useState<AnyProposal | null>();
  const [author, setAuthor] = useState<UserV1 | null>();
  const [attachments, setAttachments] = useState<Attachment[]>();
  const { role } = useAuthProvider();

  const fetchProposal = async () => {
    getProposal(id!).then((doc) => {
      setProposal(doc.data() as AnyProposal);

      getUserById(doc.data()?.uid).then((doc) => {
        setAuthor(doc);
      });

      listAttachments(doc.id).then((attachments) => {
        setAttachments(attachments);
      });
    });
  };

  const listAttachments = async (proposalId: string) => {
    const storage = getStorage();

    const listRef = ref(storage, `/proposal-attachments/${proposalId}`);

    console.debug("listRef", listRef);

    const list = [] as any[];
    const listResult = await listAll(listRef);

    for (const item of listResult.items) {
      const attachmentRef = ref(storage, item.fullPath);
      const url = await getDownloadURL(attachmentRef);

      const att = {
        name: item.name,
        url: url,
      };

      list.push(att);
    }

    return list;
  };

  useEffect(() => {
    fetchProposal();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <Container size="xl" mt="lg">
        <Group mb="xl">
          <Box flex={1}>
            <Text size="xl">{proposal?.title} </Text>
            <Text size="sm" c="dimmed">
              Authored by {author?.displayName} on{" "}
              {proposal?.createdAt.toDate().toLocaleDateString()}
            </Text>
          </Box>

          <Group gap="xs">
            <ThemeIcon
              variant="gradient"
              size="lg"
              gradient={{ from: "red", to: "yellow", deg: 300 }}
            >
              <IconFlare size={16} />
            </ThemeIcon>
            <Box>
              <Text size="lg" fw={500} lh={1} mb={4}>
                {proposal?.signaturesCount?.toString() ?? "0"}
              </Text>
              <Text size="sm" lh={1}>
                signature(s) collected
              </Text>
            </Box>
          </Group>
        </Group>
        <Flex mt="lg">
          <Box w="300px">
            <ProposalTimeline
              status={proposal?.status ?? ProposalStatus.pending}
            />

            <SignatureButton />
          </Box>
          <Box w="100%" flex={1}>
            <Container size="sm">
              {role == "admin" &&
                (proposal?.signaturesCount ?? 0) >=
                  PROPOSAL_SIGNATURES_THRESHOLD && (
                  <Alert
                    title={`${proposal?.signaturesCount} signatures collected`}
                    mb="md"
                    icon={<IconInfoCircle />}
                  >
                    This proposal has collected enough signatures and is ready
                    to be carried to next stage

                    <Button variant="light" mt="md">Carries</Button>
                  </Alert>
                )}

              <Card w="100%" mb="md">
                <TypographyStylesProvider>
                  {
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(proposal?.content || ""),
                      }}
                    />
                  }
                </TypographyStylesProvider>
              </Card>

              {attachments && (
                <Card w="100%" mb="md">
                  <Text fw={500} mb="xs">
                    Attachments
                  </Text>

                  {attachments.length !== 0 &&
                    attachments.map((att) => (
                      <Anchor href={att.url}>{att.name}</Anchor>
                    ))}

                  {attachments.length == 0 && (
                    <Text c="dimmed">No attachments</Text>
                  )}
                </Card>
              )}

              <Card w="100%" mb="md">
                Discussions
              </Card>
            </Container>
          </Box>
        </Flex>
      </Container>
    </div>
  );
}
