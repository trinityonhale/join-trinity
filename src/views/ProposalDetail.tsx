import {
  changeProposalStatus,
  checkIsAlreadySigned,
  finalizeProposal,
  getProposal,
  getProposalTimeline,
} from "@/dao/ProposalDao";
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
  Textarea,
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
import ProposalComments from "@/fragments/ProposalComments";
import ProposalSignatures from "@/fragments/ProposalSignatures";
import { QueryDocumentSnapshot } from "firebase/firestore";

function ProposalTimeline(props: {
  id: string | null;
  proposal?: AnyProposal | null;
}) {
  const activeStatus = () => {
    switch (props.proposal?.status) {
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

  const [timeline, setTimeline] = useState<QueryDocumentSnapshot[]>([]);

  const getTimeline = async () => {
    if (!props.id) return;
    const data = await getProposalTimeline(props.id!);
    setTimeline(data);
  };

  useEffect(() => {
    getTimeline();
  }, [props.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const capitalize = function (s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return (
    <Timeline
      active={activeStatus()}
      lineWidth={2}
      bulletSize={24}
      color="yellow"
    >
      {/* items */}
      <Timeline.Item title="Collecting Signature">
        <Text size="xs" mt={4}>
          {props.proposal?.createdAt.toDate().toLocaleString()}
        </Text>
      </Timeline.Item>

      {timeline.map((item, index) => (
        <Timeline.Item title={capitalize(item.data().status)} key={index}>
          <Text size="xs" mt={4}>
            {item.data().createdAt.toDate().toLocaleString()}
          </Text>
        </Timeline.Item>
      ))}
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
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const signProposal = () => {
    const signProposalHandler = async () => {
      await signProposalAction(id!, user!);
      await checkSignStatus();
      window.location.reload();
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

  const changeStatusToConsidering = async () => {
    await changeProposalStatus(id!, ProposalStatus.considering);
    window.location.reload();
  };

  const [reply, setReply] = useState("");

  const btnFinalizeDisabled = reply.trim().length === 0;

  const finalize = async (status: ProposalStatus) => {
    await finalizeProposal(id!, status, reply);
    window.location.reload();
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
              <ProposalSignatures
                signaturesCount={proposal?.signaturesCount ?? 0}
              />
            </Box>
          </Group>
        </Group>
        <Flex mt="lg">
          <Box w="300px">
            <ProposalTimeline proposal={proposal} id={id!} />

            {proposal?.status == ProposalStatus.pending && <SignatureButton />}
          </Box>
          <Box w="100%" flex={1}>
            <Container size="sm">
              {role == "admin" &&
                proposal?.status === ProposalStatus.pending &&
                (proposal?.signaturesCount ?? 0) >=
                  PROPOSAL_SIGNATURES_THRESHOLD && (
                  <Alert
                    title={`${proposal?.signaturesCount} signatures collected`}
                    mb="md"
                    icon={<IconInfoCircle />}
                  >
                    This proposal has collected enough signatures and is ready
                    to be carried to next stage
                    <Button
                      variant="light"
                      mt="md"
                      onClick={changeStatusToConsidering}
                    >
                      Carry
                    </Button>
                  </Alert>
                )}

              {role == "admin" &&
                proposal?.status === ProposalStatus.considering && (
                  <Alert
                    title="Awaiting for council's reply"
                    mb="md"
                    icon={<IconInfoCircle />}
                  >
                    <Textarea
                      placeholder="Details about this decision"
                      mt="xs"
                      value={reply}
                      onChange={(event) => setReply(event.currentTarget.value)}
                      mb="md"
                    ></Textarea>
                    <Group>
                      <Button
                        disabled={btnFinalizeDisabled}
                        variant="light"
                        onClick={() => finalize(ProposalStatus.accepted)}
                      >
                        Approve
                      </Button>
                      <Button
                        disabled={btnFinalizeDisabled}
                        variant="light"
                        onClick={() => finalize(ProposalStatus.rejected)}
                      >
                        Reject
                      </Button>
                      <Button
                        disabled={btnFinalizeDisabled}
                        variant="light"
                        onClick={() => finalize(ProposalStatus.dropped)}
                      >
                        Drop
                      </Button>
                    </Group>
                  </Alert>
                )}

              <Alert
                title={`Proposal ${proposal?.status}`}
                mb="md"
                icon={<IconInfoCircle />}
              >
                {proposal?.reply}
              </Alert>

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
                  <Text fw={500} mb="md">
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
                <Text fw={500} mb="md">
                  Discussions
                </Text>
                <ProposalComments />
              </Card>
            </Container>
          </Box>
        </Flex>
      </Container>
    </div>
  );
}
