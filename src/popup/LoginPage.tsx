import { SignInButton } from "@clerk/chrome-extension";
import { Button, Container, Flex, Text, Title } from "@mantine/core";

export function LoginPage() {
  const onClickSignUp = () => {
    chrome.tabs.create({ url: `${process.env.VITE_WEB_APP_URL}/signup`})
  }

  return (
    <>
      <Container size="lg" mt="xl">
        <Title order={1}>Advanced Dashboard for note</Title>
        <Text>はじめるにはログインしてください</Text>
        <Flex mt="md" align="center" justify="center" gap="md">
          <SignInButton mode="modal">
            <Button size="lg">ログイン</Button>
          </SignInButton>
          <Button size="lg" onClick={onClickSignUp}>新規登録</Button>
        </Flex>
      </Container>
    </>
  )
}