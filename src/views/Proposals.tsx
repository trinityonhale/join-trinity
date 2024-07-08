import { getNextPageOfProposals } from "@/dao/ProposalDao";
import { ProposalStatus } from "@/db/constants";
import { AnyProposal } from "@/db/model";
import { useAuthProvider } from "@/providers/AuthProvider";
import {
  Button,
  Container,
  Card,
  Group,
  Text,
  Badge,
  Box,
  Title,
  Select,
} from "@mantine/core";
import { IconFlare } from "@tabler/icons-react";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function ProposalItem({ proposal }: { proposal: AnyProposal }) {
  const colorMap: { [key in ProposalStatus]: string } = {
    [ProposalStatus.accepted]: "green",
    [ProposalStatus.pending]: "blue",
    [ProposalStatus.considering]: "yellow",
    [ProposalStatus.dropped]: "gray",
    [ProposalStatus.rejected]: "red",
  };

  return (
    <Box py="sm">
      <Badge color={colorMap[proposal.status]} variant="dot">
        {proposal.status}
      </Badge>
      <Group mt="sm">
        <Box flex={1}>
          <Text fw={500}>{proposal.title}</Text>
          <Text c="dimmed" size="sm">
            {proposal.createdAt.toDate().toLocaleDateString()}
          </Text>
        </Box>

        <Group gap="sm">
          {/* <Group gap="xs">
            <IconMessages size="16" />
            <Text size="sm">{ proposal.commentsCount?.toString() ?? '0' }</Text>
          </Group> */}

          <Group gap="xs">
            <IconFlare size="16" />
            <Text size="sm">{proposal.signaturesCount?.toString() ?? "0"}</Text>
          </Group>
        </Group>
      </Group>
    </Box>
  );
}

export default function Proposals() {
  type FilterValues = "Pending" | "Reviewed";
  const [filter, setFilter] = useState<FilterValues>("Pending");
  const [proposals, setProposals] = useState<QueryDocumentSnapshot[]>([]);

  const { user } = useAuthProvider();

  const fetchProposal = (clear = false) => {
    return getNextPageOfProposals(
      null,
      100,
      filter === "Pending"
        ? [ProposalStatus.pending, ProposalStatus.considering]
        : [
            ProposalStatus.accepted,
            ProposalStatus.rejected,
            ProposalStatus.dropped,
          ]
    ).then((docs) => {
      if (clear) {
        setProposals(docs);
      } else {
        setProposals([...proposals, ...docs]);
      }
    });
  };

  useEffect(() => {
    fetchProposal(true);
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container size="xl" mt="lg">
      <Group mb="xl">
        <Title order={2} flex={1}>
          Proposals
        </Title>
        {user != null && (
          <Button component={Link} to="/proposals/create">
            Submit a proposal
          </Button>
        )}
      </Group>

      <Group mb="lg">
        <Select
          data={["Pending", "Reviewed"]}
          value={filter}
          onChange={(value) => setFilter(value as FilterValues)}
        ></Select>
      </Group>
      <Card py={0}>
        {proposals.map((proposal) => (
          <Link
            key={proposal.id}
            to={`/proposals/${proposal.id}`}
            style={{ textDecoration: "none", color: "unset" }}
          >
            <ProposalItem proposal={proposal.data() as AnyProposal} />
          </Link>
        ))}
      </Card>

      {/* <Title order={3} mb="lg" mt="xl">Past Proposals</Title>
      <Card py={0}>
        {Array.from({ length: 3 }).map((_, index) => (
          <ProposalItem key={index} />
        ))}
      </Card> */}
    </Container>
  );
}
