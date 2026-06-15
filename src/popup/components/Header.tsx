import { ActionIcon, Flex, Image, Menu, Title } from "@mantine/core";
import { PiUserCircleLight } from "react-icons/pi";
import { MdHelpOutline, MdSettings, MdLogout } from "react-icons/md";
import { useContext } from "react";
import { PageContext } from "../contexts/pageContext";
import { SignOutButton } from "@clerk/chrome-extension";

export function Header() {
  const { setPage } = useContext(PageContext)

  const onClickSettings = () => {
    setPage("settings")
  }

  return (
    <>
      <Flex
        align="center"
        justify="space-between"
        bg="white"
        w="100%"
        h="48px"
        p="sm"
        style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}
      >
        <Flex align="center" gap={4}>
          <Image src="/logo.png" h={32} w={32} />
          <Title order={1} size="lg">Advanced Dashboard for note</Title>
        </Flex>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon color="teal" variant="transparent" aria-label="user">
              <PiUserCircleLight style={{ width: '100%', height: '100%' }} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item leftSection={<MdHelpOutline />}>
              使い方
            </Menu.Item>
            {/** 
            <Menu.Item leftSection={<MdSettings />} onClick={onClickSettings}>
              設定
            </Menu.Item>
            */}

            <Menu.Divider />
            <SignOutButton>
              <Menu.Item leftSection={<MdLogout />}>
                ログアウト
              </Menu.Item>
            </SignOutButton>
          </Menu.Dropdown>
        </Menu>
      </Flex>
    </>
  )
}