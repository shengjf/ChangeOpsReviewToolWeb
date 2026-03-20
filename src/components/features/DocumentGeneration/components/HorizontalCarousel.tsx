import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
} from "react"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { GenerationCardConfig } from "../types"

interface HorizontalCarouselProps {
  cards: GenerationCardConfig[]
}

export function HorizontalCarousel({ cards }: HorizontalCarouselProps) {
  const [activeCard, setActiveCard] = useState(0)
  const [furthestReachedCard, setFurthestReachedCard] = useState(0)
  const [trackMinHeight, setTrackMinHeight] = useState(760)
  const [isDesktop, setIsDesktop] = useState(
    typeof window === "undefined" ? true : window.innerWidth > 1024
  )
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])

  const getCardStyle = useCallback(
    (index: number): CSSProperties => {
      const offset = index - activeCard
      const absOffset = Math.abs(offset)

      return {
        transform: `translateX(${offset * 105}%)`,
        opacity: absOffset === 0 ? 1 : 0,
        zIndex: absOffset === 0 ? 10 : 1,
        cursor: absOffset === 0 ? "default" : "pointer",
        pointerEvents: absOffset === 0 ? "auto" : "none",
        filter: "none",
      }
    },
    [activeCard]
  )

  const handleStepClick = useCallback((index: number) => {
    setActiveCard(index)
  }, [])

  const handlePrevClick = useCallback(() => {
    setActiveCard((c) => Math.max(0, c - 1))
  }, [])

  const handleNextClick = useCallback(() => {
    setActiveCard((c) => Math.min(cards.length - 1, c + 1))
  }, [cards.length])

  const handleCardClick = useCallback(
    (index: number) => {
      if (activeCard !== index) {
        setActiveCard(index)
      }
    },
    [activeCard]
  )

  const isStepCompleted = (index: number) => {
    return index !== activeCard && index <= furthestReachedCard
  }

  const isStepActive = (index: number) => {
    return index === activeCard
  }

  const updateTrackMinHeight = useCallback(() => {
    if (!isDesktop) {
      setTrackMinHeight(0)
      return
    }

    // Card 固定高度为 700px，加上阴影和间距
    setTrackMinHeight(700)
  }, [isDesktop])

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth > 1024
      setIsDesktop(desktop)
    }

    updateTrackMinHeight()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [updateTrackMinHeight])

  useEffect(() => {
    updateTrackMinHeight()
  }, [cards, updateTrackMinHeight])

  useEffect(() => {
    setFurthestReachedCard((current) => Math.max(current, activeCard))
  }, [activeCard])

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      {/* Stepper 样式的步骤导航 */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {cards.map((card, index) => {
            const Icon = card.icon
            const completed = isStepCompleted(index)
            const active = isStepActive(index)

            return (
              <div key={card.id} className="flex items-center">
                <button
                  onClick={() => handleStepClick(index)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-200",
                    completed
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : active
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full">
                    {completed ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </span>
                  <span className="text-sm font-medium">{card.tabLabel}</span>
                </button>
                {index < cards.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 h-px w-8",
                      completed ? "bg-green-500" : "bg-border"
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div
        className="hcarousel-track relative"
        style={isDesktop ? { minHeight: `${trackMinHeight}px` } : undefined}
      >
        <Button
          variant="ghost"
          className="hcarousel-arrow hcarousel-arrow-left"
          onClick={handlePrevClick}
          disabled={activeCard === 0}
          aria-label="上一步"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="hcarousel-viewport">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`hcard ${activeCard === index ? "hcard-current" : ""}`}
              style={getCardStyle(index)}
              onClick={() => handleCardClick(index)}
              ref={(el) => {
                cardRefs.current[index] = el
              }}
            >
              <Card className="h-full overflow-hidden border-0 shadow-none">
                <CardHeader>
                  <CardTitle className="text-xl">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>{card.content}</CardContent>
              </Card>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          className="hcarousel-arrow hcarousel-arrow-right"
          onClick={handleNextClick}
          disabled={activeCard === cards.length - 1}
          aria-label="下一步"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="hcarousel-dots">
        {cards.map((card, index) => (
          <Button
            key={card.id}
            variant="ghost"
            className={cn(
              "hcarousel-dot h-3 w-3 rounded-full p-0",
              activeCard === index
                ? "active bg-primary hover:bg-primary/85"
                : isStepCompleted(index)
                  ? "bg-green-500 hover:bg-green-400"
                  : "bg-muted-foreground/45 hover:bg-muted-foreground/35"
            )}
            onClick={() => handleStepClick(index)}
            aria-label={`切换到${card.tabLabel}`}
          />
        ))}
      </div>
    </div>
  )
}
