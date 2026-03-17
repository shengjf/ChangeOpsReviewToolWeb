import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function GenerationEntryCardContent() {
  const navigate = useNavigate()

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        本卡片用于触发生成前核对，生成逻辑可后续接入服务端接口。
      </p>
      <Button variant="outline" onClick={() => navigate("/validation")}>
        返回文档校验
      </Button>
    </div>
  )
}
