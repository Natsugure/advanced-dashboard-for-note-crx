import { Button } from "@mantine/core";
import { useUpdateStats } from "./hooks/useUpdateStats";

export function MainPage() {
  const { updateStats } = useUpdateStats()

  const onClickFetchStats = () => {
    updateStats()
  }

  return (
    <>
      <Button onClick={onClickFetchStats}>統計を取得</Button>
    </>
  )
}
