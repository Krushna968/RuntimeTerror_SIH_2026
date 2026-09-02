"use client"

import * as React from "react"
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion"
import { 
  Sparkles, 
  Map as MapIcon, 
  Cpu, 
  ShieldCheck, 
  FileText, 
  ArrowRight,
  Compass,
  Radio,
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface HeroCarouselItem {
  id: string
  tabKey: 'chat' | 'map' | 'agent-lab' | 'safety' | 'bulletin'
  title: string
  tagline: string
  description: string
  image: string
  credit: string
  meta: string[]
  accent: string
  badge: string
  icon: React.ReactNode
}

export interface BlueOrbitLandingHeroProps {
  onExplorePlatform: (tab: 'home' | 'chat' | 'map' | 'agent-lab' | 'safety' | 'bulletin') => void
  className?: string
}

const CAROUSEL_ITEMS: HeroCarouselItem[] = [
  {
    id: "blue-orbit",
    tabKey: "chat",
    badge: "BLUE ORBIT",
    title: "Blue Orbit\nMarine Intelligence",
    tagline: "Autonomous Agentic AI Platform for ISRO & Indian Coastal Waters",
    description: "Bridging the gap between ISRO Earth Observation satellites (Oceansat-3 & INSAT-3DR) and 4 million+ coastal fishermen with real-time, explainable, and multilingual decision intelligence.",
    image: "/blue_orbit_hero.jpg",
    credit: "ISRO SIH 2026 · TEAM RUNTIME TERROR",
    meta: ["ISRO OCEANSAT-3", "AGENTIC AI", "DISASTER MGMT"],
    accent: "#0ea5e9", // Ocean Cyan
    icon: <Compass className="w-4 h-4 text-cyan-300" />
  },
  {
    id: "ai-chatbot",
    tabKey: "chat",
    badge: "AI CHATBOT",
    title: "AI Chatbot\nDecision Studio",
    tagline: "Gemini & NVIDIA NIM Powered Natural Language AI",
    description: "Ask questions naturally or use hands-free voice across 8 regional Indian languages. Autonomously translates ISRO satellite oceanography into explainable, evidence-backed fishing advisories.",
    image: "/blue_orbit_voice.jpg",
    credit: "8 REGIONAL INDIAN LANGUAGES · VOICE-FIRST",
    meta: ["VOICE-FIRST", "SUB-500MS", "MULTILINGUAL"],
    accent: "#0284c7", // Sky Blue
    icon: <Sparkles className="w-4 h-4 text-sky-300" />
  },
  {
    id: "gis-command",
    tabKey: "map",
    badge: "GIS COMMAND",
    title: "GIS Command\nOcean Center",
    tagline: "Sub-Meter Geospatial Marine Intelligence",
    description: "Multi-layered live maritime map with 200 NM Indian EEZ, IMBL international border geofencing, high-confidence PFZ thermal contours, and real-time cyclone hazard trajectory cones.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
    credit: "ISRO OCEANSAT-3 & INCOIS FEEDS",
    meta: ["200 NM EEZ", "IMBL GEOFENCE", "CYCLONE CONES"],
    accent: "#0d9488", // Teal
    icon: <MapIcon className="w-4 h-4 text-teal-300" />
  },
  {
    id: "agent-dag",
    tabKey: "agent-lab",
    badge: "AGENT DAG",
    title: "Agent DAG\nReasoning Lab",
    tagline: "Deterministic 6-Agent Consensus Graph",
    description: "Watch the Master Supervisor decompose complex marine queries across 6 specialized domain agents simultaneously, combining spatial calculus and ocean physics without hallucinations.",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1600&q=80",
    credit: "6 SPECIALIZED DOMAIN AGENTS · PARALLEL DAG",
    meta: ["6 DOMAIN AGENTS", "PARALLEL DAG", "100% EXPLAINABLE"],
    accent: "#6366f1", // Indigo Purple
    icon: <Cpu className="w-4 h-4 text-indigo-300" />
  },
  {
    id: "safety-barometer",
    tabKey: "safety",
    badge: "SAFETY BAROMETER",
    title: "Safety Barometer\n0–100 Clearance",
    tagline: "Life-Saving Maritime Weather Intelligence",
    description: "Out at sea, making a wrong decision about weather can be fatal. Blue Orbit calculates wave heights, swell period, Beaufort wind scale, and lightning probability to give an instant, color-coded venture status.",
    image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1600&q=80",
    credit: "BEAUFORT SCALE & CYCLONE HAZARD ENGINE",
    meta: ["WAVE HEIGHTS", "BEAUFORT SCALE", "ZERO-LAG CLEARANCE"],
    accent: "#059669", // Emerald Green
    icon: <ShieldCheck className="w-4 h-4 text-emerald-300" />
  },
  {
    id: "advisory-bulletin",
    tabKey: "bulletin",
    badge: "ADVISORY BULLETIN",
    title: "Advisory Bulletin\nISRO & INCOIS",
    tagline: "Standardized Marine Intelligence & Printable PDF",
    description: "Official government-compliant advisory bulletins with unique tracking IDs, tabulated PFZ coordinates, target species classification, and 1-click printable PDF generation for harbour masters.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80",
    credit: "GOVT. OF INDIA · DEPT. OF SPACE",
    meta: ["PFZ COORDINATES", "QR VERIFIED", "PRINTABLE PDF"],
    accent: "#2563eb", // Royal ISRO Blue
    icon: <FileText className="w-4 h-4 text-blue-300" />
  }
]

/* Layout ratios lifted from the reference design */
const CARD_H = 0.28
const CARD_AR = 0.76
const GAP = 0.04
const STRIP_TOP = 0.52
const TITLE = 0.058
const LABEL = 0.0105
const PAD = 0.025
const RAIL = 0.22

const WHEEL_THRESHOLD = 50
const WHEEL_COOLDOWN = 380

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n))

export const BlueOrbitLandingHero: React.FC<BlueOrbitLandingHeroProps> = ({
  onExplorePlatform,
  className
}) => {
  const stageRef = React.useRef<HTMLDivElement>(null)
  const [box, setBox] = React.useState({ w: 0, h: 0 })
  const [index, setIndex] = React.useState(0)
  const [dragging, setDragging] = React.useState(false)
  const [paused, setPaused] = React.useState(false)
  const reduced = useReducedMotion()

  const items = CAROUSEL_ITEMS
  const last = items.length - 1

  const go = React.useCallback(
    (next: number) => {
      const clamped = clamp(next, 0, Math.max(0, last))
      setIndex(clamped)
    },
    [last]
  )

  React.useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const read = () =>
      setBox({ w: stage.clientWidth, h: stage.clientHeight })
    read()
    const ro = new ResizeObserver(read)
    ro.observe(stage)
    return () => ro.disconnect()
  }, [])

  const fullH = clamp(box.h * CARD_H, 110, 340)
  const halfH = fullH / 1.85
  const cardW = fullH * CARD_AR
  const gap = Math.max(6, Math.round(cardW * GAP))
  const step = cardW + gap
  const pad = Math.max(20, Math.round(box.w * PAD))
  const label = Math.max(10, Math.round(box.h * LABEL))

  const xFor = React.useCallback(
    (i: number) => box.w / 2 - (i * step + cardW / 2),
    [box.w, step, cardW]
  )
  const x = useMotionValue(0)
  const target = xFor(index)

  const swing = reduced
    ? { duration: 0 }
    : { duration: 0.7, ease: "easeOut" as const }
  const spring = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 240, damping: 32, mass: 0.9 }

  React.useEffect(() => {
    if (dragging) return
    const run = animate(x, target, spring)
    return () => run.stop()
  }, [target, dragging, reduced, x]) // eslint-disable-line react-hooks/exhaustive-deps

  // Wheel and trackpad step
  React.useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let acc = 0
    let until = 0

    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      const stuck = (delta > 0 && index === last) || (delta < 0 && index === 0)
      if (stuck) {
        acc = 0
        return
      }
      e.preventDefault()
      const now = e.timeStamp
      if (now < until) return
      acc += delta
      if (Math.abs(acc) < WHEEL_THRESHOLD) return
      go(index + Math.sign(acc))
      acc = 0
      until = now + WHEEL_COOLDOWN
    }

    stage.addEventListener("wheel", onWheel, { passive: false })
    return () => stage.removeEventListener("wheel", onWheel)
  }, [go, index, last])

  // Autoplay
  React.useEffect(() => {
    if (paused || dragging || items.length < 2) return
    const id = window.setTimeout(
      () => go(index === last ? 0 : index + 1),
      5500
    )
    return () => window.clearTimeout(id)
  }, [dragging, go, index, items.length, last, paused])

  const active = items[index]
  if (!active) return null

  const lines = active.title.split("\n")
  const accent = active.accent ?? "#0284c7"

  return (
    <div
      ref={stageRef}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="Blue Orbit Marine Platform Modules"
      onKeyDown={(e) => {
        const keys: Record<string, number> = {
          ArrowLeft: index - 1,
          ArrowRight: index + 1,
          Home: 0,
          End: last,
        }
        if (!(e.key in keys)) return
        e.preventDefault()
        go(keys[e.key]!)
      }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn(
        "relative h-screen min-h-[580px] w-full overflow-hidden bg-black text-white select-none pt-16",
        "outline-none focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:ring-inset",
        className
      )}
    >
      {/* ── Background: Pure Vibrant Artwork (No black tint/overlays) ── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={swing}
        >
          <motion.img
            src={active.image}
            alt=""
            aria-hidden
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ scale: reduced ? 1.0 : 1.08 }}
            animate={{ scale: 1.0 }}
            transition={reduced ? { duration: 0 } : { duration: 6, ease: "linear" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Headline & Narrative Block (Above Filmstrip) ── */}
      <div
        className="absolute inset-x-0 top-0 flex flex-col justify-end z-20"
        style={{
          height: `${STRIP_TOP * 100}%`,
          paddingLeft: pad,
          paddingRight: pad,
          paddingBottom: Math.round(box.h * 0.03),
        }}
      >
        <div className="flex w-full flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.h2
                key={index}
                className="font-black leading-[0.92] tracking-[-0.035em] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
                style={{ fontSize: Math.max(30, Math.round(box.h * TITLE)) }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.18 } }}
              >
                {lines.map((line, i) => (
                  <span key={i} className="block overflow-hidden">
                    <motion.span
                      className="block"
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { duration: 0.62, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }
                      }
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </motion.h2>
            </AnimatePresence>

            <motion.p
              key={`desc-${index}`}
              className="text-xs sm:text-sm text-white/95 max-w-xl font-normal leading-relaxed line-clamp-3 sm:line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              {active.description}
            </motion.p>
          </div>

          {/* Action Launch Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => onExplorePlatform(active.tabKey)}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-2xl transition-all active:scale-95 cursor-pointer flex items-center justify-center space-x-2 group"
            >
              <span>Launch {active.badge}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {active.credit ? (
              <motion.span
                key={`credit-${index}`}
                className="hidden xl:inline-block font-mono text-[10px] uppercase tracking-[0.14em] text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pl-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {active.credit}
              </motion.span>
            ) : null}
          </div>
        </div>
      </div>

      {/* ── Filmstrip: Unfurled Active Card + Cropped Neighbours ── */}
      <div
        className="absolute inset-x-0 z-20"
        style={{ top: `${STRIP_TOP * 100}%`, height: fullH }}
      >
        <motion.div
          className="flex items-start"
          style={{ gap, x, cursor: dragging ? "grabbing" : "grab" }}
          drag="x"
          dragMomentum={false}
          dragElastic={0.08}
          dragConstraints={{ left: xFor(last), right: xFor(0) }}
          onDragStart={() => setDragging(true)}
          onDragEnd={(_, info) => {
            setDragging(false)
            const thrown = x.get() + info.velocity.x * 0.12
            go(Math.round((box.w / 2 - thrown - cardW / 2) / step))
          }}
        >
          {items.map((item, i) => {
            const isCurrent = i === index
            return (
              <motion.button
                key={item.id}
                type="button"
                aria-label={item.title.replace(/\n/g, " ")}
                aria-current={isCurrent}
                onClick={() => {
                  if (isCurrent) {
                    onExplorePlatform(item.tabKey)
                  } else {
                    go(i)
                  }
                }}
                className={cn(
                  "relative shrink-0 overflow-hidden rounded-2xl bg-white/5 border border-white/20 transition-shadow",
                  isCurrent ? "ring-2 ring-white/90 shadow-2xl" : "hover:border-white/50"
                )}
                style={{ width: cardW }}
                animate={{ height: isCurrent ? fullH : halfH }}
                transition={spring}
              >
                <img
                  src={item.image}
                  alt=""
                  draggable={false}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: "50% 30%" }}
                />

                {/* Card Gradient & Label Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3.5 text-left">
                  <div className="flex items-center justify-between">
                    <span className="p-1.5 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-white">
                      {item.icon}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-md bg-white text-slate-950 font-mono text-[9px] font-extrabold uppercase">
                        OPEN ➔
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-[9px] font-mono text-cyan-300 font-bold uppercase tracking-widest">
                      {item.badge}
                    </div>
                    <div className="text-xs md:text-sm font-black text-white leading-tight mt-0.5 tracking-tight">
                      {item.badge}
                    </div>
                  </div>
                </div>

                <motion.span
                  aria-hidden
                  className="absolute inset-0 bg-black pointer-events-none"
                  animate={{ opacity: isCurrent ? 0 : 0.28 }}
                  transition={spring}
                />
              </motion.button>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}

export const OrcaLandingHero = BlueOrbitLandingHero
export default BlueOrbitLandingHero
