export function Footer() {
  return (
    <div className="border-t p-6 md:pt-8">
      <div className="mx-auto max-w-[2000px]">
        <div className="text-center text-xs text-muted-foreground md:text-sm">
          <p>
            ChangeOps Review Tool • 版本 1.0.0 • 最后更新:{" "}
            {new Date().toLocaleDateString()}
          </p>
          <p className="mt-1">© 2025 上海ICNOC • 接入网与固网终端运行中心</p>
        </div>
      </div>
    </div>
  )
}
