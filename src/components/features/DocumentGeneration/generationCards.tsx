import { ClipboardCheck, FileText, Sparkles } from "lucide-react"
import { ValidationResults } from "@/components/features/ValidationResults"
import { GenerationEntryCardContent } from "./GenerationEntryCardContent"
import { GenerationTipsCardContent } from "./GenerationTipsCardContent"
import type { GenerationCardConfig } from "./types"

// 新增或删除卡片时，仅需调整此数组
export const generationCards: GenerationCardConfig[] = [
  {
    id: "entry",
    tabLabel: "任务入口",
    title: "生成任务入口",
    description: "配置生成流程并快速回到校验页。",
    icon: Sparkles,
    content: <GenerationEntryCardContent />,
  },
  {
    id: "review-table",
    tabLabel: "校验表格",
    title: "校验结果复用",
    description: "复用文档校验页相同的表格，便于生成前复核。",
    icon: FileText,
    content: <ValidationResults />,
  },
  {
    id: "tips",
    tabLabel: "生成提示",
    title: "生成前检查清单",
    description: "执行生成前请逐项确认，降低返工风险。",
    icon: ClipboardCheck,
    content: <GenerationTipsCardContent />,
  },
]
