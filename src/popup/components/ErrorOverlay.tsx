import { Flex, Stack, Text } from "@mantine/core"
import { FaCircleXmark } from "react-icons/fa6";

interface Props {
  message: string | undefined
}

export function ErrorOverlay({ message }: Props) {
  return (
    <>
      <Stack justify="center" align="center" w="100vw" h="100vh">
        <Flex>
          <FaCircleXmark color="red" size={24}/>
          <Text fw={700} ml="xs">エラーが発生しました</Text>
        </Flex>
        <Text fw={500} ml="xs">{message}</Text>
      </Stack>
    </>
  )
}