import { Box, Button, Container, Flex, LoadingOverlay, Progress, Space, Text } from "@mantine/core";
import { useUpdateStats } from "./hooks/useUpdateStats";

export function MainPage() {
  const { updateStats, isProcessing, progress } = useUpdateStats()

  const onClickFetchStats = () => {
    updateStats().then(
      // TODO: 完了通知+エラー通知を入れる
    )
  }

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
      <Button onClick={onClickFetchStats}>統計を取得</Button>
    </>
  )
}
