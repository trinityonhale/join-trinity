import {
  Container,
  Group,
  Menu,
  UnstyledButton,
  Avatar,
  Text,
  rem,
  useMantineTheme,
  Button,
  Loader,
  ActionIcon,
  Box,
} from "@mantine/core";

import { notifications } from "@mantine/notifications";

import {
  IconChevronDown,
  IconLogout,
  IconBrandGoogleFilled,
  IconMessageCircleQuestion,
} from "@tabler/icons-react";

import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { ColorSchemeToggle } from "./ColorSchemeToggle";
import { Auth } from "../firebase/auth";
import { useAuthProvider } from "@/providers/AuthProvider";
import { upsertUser } from "@/dao/UserDao";

// const user = {
//   name: "Jane Spoonfighter",
//   email: "janspoon@fighter.dev",
//   image:
//     "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png",
// };

function UserMenu() {
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const theme = useMantineTheme();

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

  return (
    <Menu
      width={260}
      position="bottom-end"
      transitionProps={{ transition: "pop-top-right" }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton>
          <Group gap={7}>
            <Avatar
              src={user.photoURL}
              alt={user.displayName!}
              radius="xl"
              size={20}
            />
            <Text fw={500} size="sm" lh={1} mr={3}>
              {user.displayName}
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

        <Menu.Item
          leftSection={
            <IconMessageCircleQuestion
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
        >
          Create new quest
        </Menu.Item>

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

      upsertUser({
        uid: user.uid,
        displayName: user.displayName!,
        photoUrl: user.photoURL!,
        role: "user",
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
  const [opened, { toggle }] = useDisclosure(false);

  const { user, loading } = useAuthProvider();

  const AwaitingAuthResultIndicator = () => (
    <ActionIcon variant="light">
      <Loader size="xs" />
    </ActionIcon>
  );

  return (
    <Container size="xl">
      <Group justify="space-between" py="md">
        <div>Open Trinity</div>

        {/* <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" /> */}
        <div>
          {loading ? (
            <AwaitingAuthResultIndicator />
          ) : user ? (
            <UserMenu />
          ) : (
            <SignInButton />
          )}
          <ColorSchemeToggle />
        </div>
      </Group>
    </Container>
  );
}
