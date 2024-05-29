import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";

export function ColorSchemeToggle() {
  const { toggleColorScheme } = useMantineColorScheme();

  const computedColorScheme = useComputedColorScheme('light');

  return (
    <ActionIcon onClick={() => toggleColorScheme()} variant="default">
      {computedColorScheme == "light" && (
        <IconSun style={{ width: "70%", height: "70%" }} stroke={1.5} />
      )}
      {computedColorScheme == "dark" && (
        <IconMoon style={{ width: "70%", height: "70%" }} stroke={1.5} />
      )}
    </ActionIcon>
  );
}