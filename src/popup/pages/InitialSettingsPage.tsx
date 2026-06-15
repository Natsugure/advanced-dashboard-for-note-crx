import { Button, Container, Divider, Flex, Image, LoadingOverlay, Stack, Table, Text, Title } from "@mantine/core";
import { FaLink, FaCircleCheck } from "react-icons/fa6";
import { useContext, useState } from "react";
import { fetchCurrentUser } from "@/lib/noteApi";
import type { NoteCurrentUser } from "@/lib/noteApiSchema";
import { useUser } from "../hooks/useUsers";
import { MdArrowForward } from "react-icons/md"
import { PageContext } from "../contexts/pageContext";

type Step = "onboarding" | "confirmRegister" | "fetchFirstStats" | "done"

export function InitialSettingsPage() {
  const { setPage } = useContext(PageContext)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<Step>("onboarding")
  const [noteUser, setNoteUser] = useState<NoteCurrentUser | undefined>(undefined)
  const { createUser } = useUser()

  const onClickFetchCurrentUser = async () => {
    setIsLoading(true)

    try {
      setNoteUser(await fetchCurrentUser())
      setStep("confirmRegister")
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const onClickBindAccount = async () => {
    setIsLoading(true)

    try {
      if(!noteUser) throw new Error("noteUser is undefined")

      await createUser(noteUser.id, noteUser.nickname, noteUser.urlname)
      setStep("fetchFirstStats")
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const onClickNavigateMainPage = () => setPage("main")

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
          <Title order={1} size="lg">初回設定</Title>
        </Flex>
      </Flex>

    <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }}/>
    
    <Container mt="sm">
      {step === "onboarding" && (
        <Container>
          <Text>アプリを利用する前に、noteのユーザー情報の紐づけが必要です。</Text>
          <Text mt="sm">ブラウザ上でnoteにログインした状態で、下のボタンを押してください。</Text>
          <Button mt="md" w="100%" onClick={onClickFetchCurrentUser}>ユーザー情報の取得</Button>
        </Container>
      )}

      {step === "confirmRegister" && (
        <Container>
          <Stack>
            <Text fw={700}>取得したnoteのユーザー情報</Text>
            <Table variant="vertical" layout="fixed">
              <Table.Tbody>
                <Table.Tr>
                  <Table.Th w={120}>クリエイター名</Table.Th>
                  <Table.Td>{noteUser?.nickname}</Table.Td>
                </Table.Tr>

                <Table.Tr>
                  <Table.Th w={120}>note ID</Table.Th>
                  <Table.Td>{noteUser?.urlname}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Stack>

          <Divider my="md" />

          <Text>このnoteアカウントを紐づけます。</Text>
          <Text>※一度紐づけたアカウントの組み合わせは変更できません。</Text>
          
          <Button
            w="100%"
            mt="md" 
            leftSection={<FaLink />} 
            onClick={onClickBindAccount}
          >
            アカウントを紐づける
          </Button>
        </Container>
      )}

      {step === "fetchFirstStats" && (
        <Container mt="md">
          <Flex>
            <FaCircleCheck color="green" size={24}/>
            <Text fw={700} ml="xs">アカウントの紐づけに成功しました</Text>
          </Flex>

          <Text mt="sm">統計を取得する準備が整いました。</Text>
          <Text>メインページに移動して、統計を取得してみましょう。</Text>

          <Button
            w="100%"
            mt="lg" 
            leftSection={<MdArrowForward />}
            onClick={onClickNavigateMainPage}
          >
            メインページへ
          </Button>
        </Container>
      )}
      </Container>
    </>
  )
}