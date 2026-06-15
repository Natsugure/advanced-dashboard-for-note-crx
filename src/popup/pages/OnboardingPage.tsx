import { SignInButton } from "@clerk/chrome-extension";
import { Button, Container, Flex, Image, Stack, Title } from "@mantine/core";
import { FiExternalLink } from "react-icons/fi";

export function OnboardingPage() {
  const onClickSiteButton = () => {
    void chrome.tabs.create({ url: process.env.VITE_WEB_APP_URL})
  }

  const onClickSignUp = () => {
    void chrome.tabs.create({ url: `${process.env.VITE_WEB_APP_URL}/signup`})
  }

  return (
    <>
      <Container>
        <Stack justify="center" align="center" h="100vh">
          <Stack align="center">
            <Image src="/logo.png" h={128} w={128} />
            <Title order={1} size="28px">Advanced Dashboard for note</Title>
          </Stack>
          <Flex gap="md" mt="md">
            <SignInButton mode="modal">
              <Button size="lg">ログイン</Button>
            </SignInButton>
            <Button size="lg" onClick={onClickSignUp}>新規登録</Button>
          </Flex>
          <Button
            variant="subtle"
            leftSection={<FiExternalLink />}
            mt="xl"
            onClick={onClickSiteButton}
          >
            Advanced Dashboard for note 公式サイトへ
          </Button>
        </Stack>
      </Container>
    </>
  )
}