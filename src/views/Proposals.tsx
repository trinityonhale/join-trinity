import { getNextPageOfProposals } from "@/dao/ProposalDao";
import { ProposalStatus } from "@/db/constants";
import { AnyProposal } from "@/db/model";
import {
  Button,
  Container,
  Card,
  Group,
  Text,
  Badge,
  Box,
  Title,
} from "@mantine/core";
import { IconFlare, IconMessages } from "@tabler/icons-react";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function ProposalItem({ proposal }: { proposal: AnyProposal}) {
  return (
    <Box py="sm">
      <Badge color="blue" variant="dot">
        {proposal.status}
      </Badge>
      <Group mt="sm">
        <Box flex={1}>
          <Text fw={500}>
            {proposal.title}
          </Text>
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
            <Text size="sm">{ proposal.signaturesCount?.toString() ?? '0' }</Text>
          </Group>
        </Group>
      </Group>
    </Box>
  );
}

export default function Proposals() {

  const [proposals, setProposals] = useState<QueryDocumentSnapshot[]>([]);

  const fetchProposal = () => {
    return getNextPageOfProposals(null, 15, ProposalStatus.pending).then((docs) => {
      console.log(docs)
      setProposals([...proposals, ...docs])
    })
  }

  useEffect(() => {
    fetchProposal()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container size="xl" mt="lg">
      <Group mb="xl">
        <Title order={2} flex={1}>Proposals</Title>
        <Button component={Link}
        to="/proposals/create"
        >Submit a proposal</Button>
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
