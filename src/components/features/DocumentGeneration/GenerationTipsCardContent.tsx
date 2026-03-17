export function GenerationTipsCardContent() {
  return (
    <div className="space-y-3 text-sm text-muted-foreground">
      <div className="rounded-lg border bg-muted/30 p-3">
        1. 请先完成必传文档上传，并执行一次完整校验。
      </div>
      <div className="rounded-lg border bg-muted/30 p-3">
        2. 检查失败项是否已全部修正，避免生成无效文档。
      </div>
      <div className="rounded-lg border bg-muted/30 p-3">
        3. 生成完成后建议导出报告并归档。
      </div>
    </div>
  )
}
