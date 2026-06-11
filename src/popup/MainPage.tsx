import { Box, Button, Container, Dialog, Flex, LoadingOverlay, Progress, Space, Stack, Text } from "@mantine/core";
import { useUpdateStats } from "./hooks/useUpdateStats";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { IoOpenOutline } from "react-icons/io5";
import { TfiStatsUp } from "react-icons/tfi";

export function MainPage() {
  const [dialogTitle, setDialogTitle] = useState("")
  const [dialogText, setDialogText] = useState("")
  const [opened, { toggle, close }] = useDisclosure()
  const { 
    updateStats, 
    isProcessing, 
    progress, 
  } = useUpdateStats()

  const onClickFetchStats = async () => {
    try {
      const result = await updateStats()

      if (result === "no_update") {
        setDialogTitle("更新を中断しました")
        setDialogText("前回取得時から統計が更新されていませんでした。")
      } else {
        setDialogTitle("更新が完了しました")
        setDialogText("統計情報をサーバーに送信しました。")
      }
    } catch (e) {
      setDialogTitle("更新に失敗しました")
      setDialogText(e instanceof Error ? e.message : "不明なエラーが発生しました。")
    } finally {
      toggle()
    }
  }

  const onClickOpenApp = () => {
    chrome.tabs.create({ url: `${process.env.VITE_WEB_APP_URL}/dashboard` })
  }

  useEffect(() => {
    !opened && setDialogTitle("")
  }, [opened])

  return (
    <>
      <LoadingOverlay 
        visible={isProcessing}
        loaderProps={{ 
          children: (
            <Container>
              <Flex mb="xs" justify="space-between">
                <Text>更新中…</Text>
                <Space />
                <Text>{progress.toFixed(1)}%</Text>
              </Flex>
              <Box w={500}>
                <Progress value={progress} />
              </Box>
            </Container>
          )
        }}
      />
      <Dialog 
        opened={opened}
        withCloseButton
        onClose={close}
        title={dialogTitle}
      >
        <Text>{dialogText}</Text>
      </Dialog>
      <Stack p="md" gap="sm">
        <Button
          leftSection={<TfiStatsUp />}
          onClick={onClickFetchStats}
        >
          統計を取得
        </Button>
        <Button leftSection={<IoOpenOutline />} onClick={onClickOpenApp}>アプリを開く</Button>
      </Stack>
    </>
  )
}
