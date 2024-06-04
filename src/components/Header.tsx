import {
  Container,
  Group,
  Menu,
  UnstyledButton,
  Avatar,
  Text,
  rem,
  Button,
  Loader,
  ActionIcon,
  Box,
  Divider,
} from "@mantine/core";

import { notifications } from "@mantine/notifications";

import {
  IconChevronDown,
  IconLogout,
  IconBrandGoogleFilled,
  IconMessageCircleQuestion,
} from "@tabler/icons-react";

// import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { ColorSchemeToggle } from "./ColorSchemeToggle";
import * as Auth from "../firebase/auth";
import { useAuthProvider } from "@/providers/AuthProvider";
import { upsertUser } from "@/dao/UserDao";
import Logo from "./Logo";
import { Role } from "@/db/constants";
import { modals } from "@mantine/modals";
import CreateQuestsForm from "@/fragments/CreateQuestsForm";

// const user = {
//   name: "Jane Spoonfighter",
//   email: "janspoon@fighter.dev",
//   image:
//     "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png",
// };

function UserMenu() {
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const { user, role } = useAuthProvider();

  const logout = async () => {
    await Auth.signOut();
    notifications.show({
      title: "Logged out",
      message: "You have been successfully logged out",
      autoClose: 1000,
      color: "blue",
    });
  };

  const createNewQuestHandler = () => {
    modals.open({
      title: "Create new quest",
      children: <CreateQuestsForm />,
    });
  };

  return (
    <Menu
      width={260}
      position="bottom-end"
      transitionProps={{ transition: "pop-top-right" }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      opened={userMenuOpened}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton>
          <Group gap={7}>
            <Avatar
              src={user!.photoURL!}
              alt={user!.displayName!}
              radius="xl"
              size={20}
            />
            <Text fw={500} size="sm" lh={1} mr={3}>
              {user!.displayName}
            </Text>
            <IconChevronDown
              style={{ width: rem(12), height: rem(12) }}
              stroke={1.5}
            />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        {role == "admin" && (
          <Box bg="blue" color="white" py="2px" fs="xs" ta="center">
            {role}
          </Box>
        )}

        {role == "admin" && (
          <Menu.Item
            onClick={createNewQuestHandler}
            leftSection={
              <IconMessageCircleQuestion
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
          >
            Create new quest
          </Menu.Item>
        )}

        <Menu.Item disabled>My Quests</Menu.Item>

        <Menu.Divider />
        <Menu.Item
          onClick={logout}
          leftSection={
            <IconLogout
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

function SignInButton() {
  const initSignInFlow = async () => {
    try {
      const user = await Auth.signIn();

      if (!user) {
        notifications.show({
          title: "Failed to sign in",
          message: "Please try again",
          autoClose: 1000,
          color: "red",
        });

        return;
      }

      await upsertUser(user.uid, {
        schemaVersion: 1,
        uid: user.uid,
        displayName: user.displayName!,
        photoUrl: user.photoURL!,
        role: Role.user,
      });

      notifications.show({
        title: "Signed in",
        message: `Welcome back, ${user.displayName}`,
        autoClose: 1000,
        color: "green",
      });
    } catch (error) {
      console.error("Failed to sign in", error);
    }
  };

  return (
    <Button
      onClick={initSignInFlow}
      leftSection={<IconBrandGoogleFilled />}
      variant="light"
    >
      Sign In With Google
    </Button>
  );
}

export default function Header() {
  // const [opened, { toggle }] = useDisclosure(false);

  const { user, loading } = useAuthProvider();

  const AwaitingAuthResultIndicator = () => (
    <ActionIcon variant="light" size="lg">
      <Loader size="xs" />
    </ActionIcon>
  );

  return (
    <Container size="xl">
      <Group justify="space-between" py="sm">
        <Group>
          <Logo />
          <Divider orientation="vertical" />
          <Text fs="xl" fw={500} c="dimmed">
            Quest Board
          </Text>
        </Group>

        {/* <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" /> */}
        <Group>
          {loading ? (
            <AwaitingAuthResultIndicator />
          ) : user ? (
            <UserMenu />
          ) : (
            <SignInButton />
          )}
          <ColorSchemeToggle />
        </Group>
      </Group>
    </Container>
  );
}
