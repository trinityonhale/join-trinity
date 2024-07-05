import { getNewSignatures } from "@/dao/ProposalDao";
import { User } from "@/db/schema";
import { Avatar, UnstyledButton } from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function UserAvatar({ user }: { user: User }) {
  const userInitials = user.displayName
    .split(" ")
    .slice(0, 2)
    .map((name) => name.charAt(0))
    .join("");

  if (user.photoUrl) {
    return <Avatar src={user.photoUrl} alt={user.displayName} radius="xl" />;
  } else {
    return (
      <Avatar alt={user.displayName} radius="xl">
        {userInitials}
      </Avatar>
    );
  }
}
export default function ProposalSignatures({
  signaturesCount,
}: {
  signaturesCount: number;
}) {
  const [signatures, setSignatures] = useState<User[]>([]);

  const displayCount = Math.max(signaturesCount - 3, 0);

  const { id } = useParams();

  useEffect(() => {
    getNewSignatures(id!).then((users) => {
      setSignatures(users);
    });
  }, [signaturesCount]);

  return (
    <UnstyledButton>
      <Avatar.Group>
        {signatures.map((u) => (
          <UserAvatar user={u} key={u.uid} />
        ))}
        {displayCount > 0 && <Avatar>+{displayCount}</Avatar>}
      </Avatar.Group>
    </UnstyledButton>
  );
}
