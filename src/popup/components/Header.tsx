import { Flex, Image, Title } from "@mantine/core";

export function Header() {
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
      </Flex>
    </>
  )
}