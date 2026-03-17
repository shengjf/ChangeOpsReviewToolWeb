/**
 * 应用头部组件
 */
import { FileText, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NavLink } from "react-router-dom"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-[2000px] items-center justify-between px-4 md:px-6 lg:px-8">
        {/* 左侧：Logo和导航 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">
              ChangeOps Review Tool
            </h1>
            <Badge variant="secondary" className="ml-2">
              Beta
            </Badge>
          </div>

          <nav className="ml-4 hidden items-center gap-4 md:ml-8 md:flex md:gap-6">
            <NavLink
              to="/validation"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-foreground ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`
              }
            >
              文档校验
            </NavLink>
            <NavLink
              to="/generation"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-foreground ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`
              }
            >
              文档生成
            </NavLink>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              模板管理
            </a>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              历史记录
            </a>
          </nav>
        </div>

        {/* 右侧：状态和用户操作 */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>系统正常</span>
          </div>

          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Settings className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
