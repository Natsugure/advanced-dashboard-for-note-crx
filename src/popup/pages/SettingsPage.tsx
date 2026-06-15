import { useContext } from "react"
import { PageContext } from "../contexts/pageContext"
import { Button, Flex, Title } from "@mantine/core"
import { MdArrowBack } from "react-icons/md"

export function SettingsPage() {
  const { setPage } = useContext(PageContext)

  return (
    <>
      <Flex
        align="center"
        bg="white"
        w="100%"
        h="48px"
        p="sm"
        gap="xs"
        style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}
      >
        <Button
          variant="transparent"
          size="sm"
          leftSection={<MdArrowBack />}
          onClick={() => setPage("main")}
        >
          戻る
        </Button>
        <Title order={1} size="xl">設定</Title> 
      </Flex>
    </>
  )
}