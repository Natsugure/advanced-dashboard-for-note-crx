import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  Flex,
  LoadingOverlay,
  Progress,
  Space,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { useUpdateStats } from "../hooks/useUpdateStats";
import { useContext, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { IoOpenOutline } from "react-icons/io5";
import { TfiStatsUp } from "react-icons/tfi";
import { Header } from "../components/Header";
import { UserContext } from "../contexts/userContext";

export function MainPage() {
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogText, setDialogText] = useState("");
  const { user, isLoading } = useContext(UserContext);
  const [opened, { toggle, close }] = useDisclosure();
  const { updateStats, isProcessing, progress } = useUpdateStats();

  const onClickFetchStats = async () => {
    try {
      const result = await updateStats();

      if (result === "no_update") {
        setDialogTitle("更新を中断しました");
        setDialogText("前回取得時から統計が更新されていませんでした。");
      } else {
        setDialogTitle("更新が完了しました");
        setDialogText("統計情報をサーバーに送信しました。");
      }
    } catch (e) {
      setDialogTitle("更新に失敗しました");
      setDialogText(
        e instanceof Error ? e.message : "不明なエラーが発生しました。",
      );
    } finally {
      toggle();
    }
  };

  const onClickOpenApp = () => {
    void chrome.tabs.create({ url: `${process.env.VITE_WEB_APP_URL}/dashboard` });
  };

  const handleClose = () => {
    close();
    setDialogTitle("");
  };

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
          ),
        }}
      />
      <Dialog
        opened={opened}
        withCloseButton
        onClose={handleClose}
        title={dialogTitle}
      >
        <Text>{dialogText}</Text>
      </Dialog>
      <Header />
      <Stack p="md" gap="sm">
        <Card shadow="sm" p="sm" radius="md">
          <Card.Section inheritPadding px="xs" withBorder>
            <Stack>
              <Text fw={500} size="sm" c="dimmed" mt="xs" mb="xs">取得対象noteアカウント</Text>
            </Stack>
          </Card.Section>

          <Card.Section inheritPadding px="0px" withBorder>
            <Table variant="vertical" layout="fixed" verticalSpacing="sm">
              <Table.Tbody>
                <Table.Tr>
                  <Table.Th w={120}>クリエイター名</Table.Th>
                  <Table.Td>{isLoading ? "読み込み中…" : user?.noteNickName}</Table.Td>
                </Table.Tr>

                <Table.Tr>
                  <Table.Th w={120}>note ID</Table.Th>
                  <Table.Td>{isLoading ? "読み込み中…" : user?.noteUrlName}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Card.Section>
        </Card>
        <Button mt="md" leftSection={<TfiStatsUp />} onClick={onClickFetchStats}>
          統計を取得
        </Button>
        <Button leftSection={<IoOpenOutline />} onClick={onClickOpenApp}>
          アプリを開く
        </Button>
      </Stack>
    </>
  );
}
