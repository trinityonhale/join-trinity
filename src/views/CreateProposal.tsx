import ProposalForm from "@/fragments/ProposalForm";
import { Button, Container, Title } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function CreateProposal() {
  return (
    <Container size="xl" my="xl">
      <Button
        leftSection={<IconChevronLeft size={14} />}
        component={Link}
        size="sm"
        variant="outline"
        radius="xl"
        to="/proposals"
        color="blue"
      >
        Proposals
      </Button>
      <Title order={2} flex={1} mb="xl" mt="lg">
        Submit Proposal
      </Title>
      <Container size="sm" m={0} p={0}>
        <ProposalForm />
      </Container>
    </Container>
  );
}
