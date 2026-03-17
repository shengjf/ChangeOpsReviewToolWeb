import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { generationCards } from "./generationCards"
import { HorizontalCarousel } from "./components/HorizontalCarousel"
import { Footer } from "./components/Footer"

export function DocumentGenerationPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />

        <div className="flex flex-1 flex-col lg:ml-64">
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-[2000px]">
              <div className="mb-6 md:mb-8">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  文档生成
                </h1>
                <p className="mt-1 text-sm text-muted-foreground md:mt-2 md:text-base">
                  基于卡片流完成生成前核对与流程操作
                </p>
              </div>

              <HorizontalCarousel cards={generationCards} />
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  )
}
