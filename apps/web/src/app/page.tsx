// apps/web/src/app/page.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

import SearchBar from '@/components/ui/SearchBar'
import RouteModal from '@/components/ui/RouteModal'
import BusRail, { BusItem } from '@/components/ui/BusRail'
import BottomDrawer from '@/components/ui/BottomDrawer'
import { CategoryChips, RouteQuickFilters } from '@/components/ui/CategoryChips'
import AnimatedMasonry from '@/components/ui/AnimatedMasonry'

import {
  RouteTile,
  BusTile,
  AdTile,
  RouteTileData,
  BusTileData,
  AdTileData,
} from '@/components/ui/tiles'
import SegmentedShelf, { ShelfItem } from '@/components/ui/SegmentedShelf'

type Mode = 'routes' | 'buses'

export default function HomePage() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)

  const [drawerExpanded, setDrawerExpanded] = useState(false)
  const [mode, setMode] = useState<Mode>('routes')
  const [activeRoute, setActiveRoute] = useState<RouteTileData | null>(null)
  const [pickedBus, setPickedBus] = useState<BusItem | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // reshuffle seed (drives subtle morph/jitter)
  const [seed, setSeed] = useState(0)

  // collected chips (what scrolled past the top)
  // We keep extra fields locally; when passing to SegmentedShelf they’re compatible with ShelfItem.
  type Chip = ShelfItem & { kind: 'route' | 'bus' | 'ad'; hint?: string }
  const [shelf, setShelf] = useState<Chip[]>([])

  // --- demo data -------------------------------------------------------------
  const routes: RouteTileData[] = [
    { id: 'A',  title: 'Route A',  subtitle: 'Fastest · 24 min · 1 transfer', color: '#7c3aed' },
    { id: 'B',  title: 'Route B',  subtitle: 'Fewest transfers · 28 min · 0 transfers', color: '#2563eb' },
    { id: 'C',  title: 'Route C',  subtitle: 'Cheapest · $1.80 · 30 min',           color: '#16a34a' },
    { id: 'A2', title: 'Route A (via Canal)', subtitle: '26 min · 1 transfer',      color: '#8b5cf6' },
    { id: 'B2', title: 'Route B Express',     subtitle: '25 min · 0 transfers',     color: '#3b82f6' },
    { id: 'C2', title: 'Route C Night',       subtitle: '$1.80 · 32 min',           color: '#22c55e' },
  ]

  const busesData: BusTileData[] = [
    { id: '97', name: '97 · Airport → Downtown',      etaMin: 4,  crowd: 'Med',  color: '#ef4444' },
    { id: '61', name: '61 · Kanata → Tunney’s',       etaMin: 7,  crowd: 'Low',  color: '#f59e0b' },
    { id: '6',  name: '6 · Greenboro → Rockcliffe',   etaMin: 12, crowd: 'High', color: '#10b981' },
    { id: '2',  name: '2 · Bayview → Blair',          etaMin: 3,  crowd: 'Low',  color: '#06b6d4' },
    { id: '75', name: '75 · Barrhaven → DT',          etaMin: 9,  crowd: 'Med',  color: '#f97316' },
    { id: '14', name: '14 · St-Laurent → Carling',    etaMin: 5,  crowd: 'Low',  color: '#94a3b8' },
  ]

  const nearby: AdTileData[] = [
    { id: 'ad-museum',   title: 'National Gallery',   subtitle: 'Late-night Thursdays', tag: 'Museum' },
    { id: 'ad-war',      title: 'War Museum',         subtitle: 'New exhibit: D-Day',   tag: 'Museum' },
    { id: 'ad-science',  title: 'Science & Tech',     subtitle: 'Robotics Week',        tag: 'Event'  },
    { id: 'ad-aviation', title: 'Aviation Museum',    subtitle: 'WWII aircraft tour',   tag: 'Tour'   },
    { id: 'ad-byg',      title: 'ByWard Arts Market', subtitle: 'Sat 10–4pm',           tag: 'Market' },
    { id: 'ad-winter',   title: 'Rideau Skateway',    subtitle: 'Season pass -20%',     tag: 'Season' },
    { id: 'ad-concert',  title: 'Zibi Concerts',      subtitle: 'Free Friday live',     tag: 'Music'  },
    { id: 'ad-farmers',  title: 'Lansdowne Farmers',  subtitle: 'Fresh fall harvest',   tag: 'Market' },
  ]
  // --------------------------------------------------------------------------

  // Map setup + bump seed after viewport changes
  useEffect(() => {
    if (!mapContainer.current) return
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [-75.6972, 45.4215],
      zoom: 13,
    })
    mapRef.current = map
    const bump = () => setSeed((s) => s + 1)
    map.on('moveend', bump)
    return () => {
      map.off('moveend', bump)
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Light, continuous re-jitter while user scrolls
  useEffect(() => {
    const onScroll = () => setSeed((s) => s + 1)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Esc → back to routes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMode('routes') }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handleCategory = (k: string | null) => setSelectedCategory(k)
  const handleQuick = (k: 'fastest' | 'cheapest' | 'fewest') => console.log('Quick:', k)

  // Helpers to add a chip by id when a tile scrolls past the top
  const addRouteChip = (id: string) => {
    const r = routes.find(x => x.id === id)
    if (!r) return
    const hint = r.subtitle.split('·')[0]?.trim()
    setShelf(prev => prev.some(c => c.id === id) ? prev : [...prev, { id, label: r.title, color: r.color, kind: 'route', hint }])
  }
  const addBusChip = (id: string) => {
    const b = busesData.find(x => x.id === id)
    if (!b) return
    setShelf(prev => prev.some(c => c.id === id) ? prev : [...prev, { id, label: `${b.id} · ${b.etaMin}m`, color: b.color, kind: 'bus', hint: b.crowd }])
  }
  const addAdChip = (id: string) => {
    const ad = nearby.find(x => x.id === id)
    if (!ad) return
    setShelf(prev => prev.some(c => c.id === id) ? prev : [...prev, { id, label: ad.title, kind: 'ad', hint: ad.tag }])
  }

  return (
    <div className="w-screen h-screen relative">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Top overlay */}
      <div className="absolute left-1/2 -translate-x-1/2 top-4 z-10 w-[min(980px,94vw)] space-y-3">
        <SearchBar onSubmit={(q) => console.log('search', q)} />
        <div className="rounded-2xl shadow-md border bg-background/80 backdrop-blur p-3">
          <div className="flex flex-wrap items-center gap-3">
            <CategoryChips selected={selectedCategory} onPick={handleCategory} />
            <div className="flex-1" />
            <RouteQuickFilters onPick={handleQuick} />
            <button
              onClick={() => setMode('buses')}
              className="px-4 py-1.5 text-sm rounded-xl border bg-background hover:bg-accent transition"
            >
              See buses
            </button>
          </div>
        </div>
      </div>

      {/* Left bus rail (collapsed → expanded on hover) */}
      <BusRail
        items={busesData as unknown as BusItem[]}
        onPick={(b) => { setPickedBus(b); setMode('buses') }}
        onExpandView={() => setMode('buses')}
      />

      {/* Bottom drawer */}
      <BottomDrawer expanded={drawerExpanded} onToggle={setDrawerExpanded}>
        {/* Header: Hide (left) + segmented shelf (center) */}
        <div className="mb-3">
          <SegmentedShelf
            segment={mode}
            onSegmentChange={setMode}
            items={shelf}
            onChipClick={(id) => {
              // optional: jump back or open a modal based on chip.kind
              const r = routes.find(x => x.id === id)
              if (r) setActiveRoute(r)
            }}
            onHide={() => setDrawerExpanded(false)}
            className="mx-auto w-[min(1200px,95vw)]"
          />
        </div>

        {/* Animated content (2–3 per row, jitter + morph controlled by seed) */}
        {mode === 'buses' ? (
          <AnimatedMasonry
            items={busesData}
            seed={seed}
            columns={3}  // responsive: 1 / 2 / 3 (component adds breakpoints)
            gap={14}
            onPassTop={(id) => addBusChip(id)}
            render={(b) => <BusTile data={b} />}
          />
        ) : (
          <>
            <AnimatedMasonry
              items={routes}
              seed={seed}
              columns={3}
              gap={14}
              onPassTop={(id) => addRouteChip(id)}
              render={(r) => <RouteTile data={r} onClick={() => setActiveRoute(r)} />}
            />
            <div className="mt-6" />
            <AnimatedMasonry
              items={nearby}
              seed={seed}
              columns={3}
              gap={14}
              onPassTop={(id) => addAdChip(id)}
              render={(ad) => <AdTile data={ad} />}
            />
          </>
        )}
      </BottomDrawer>

      {/* Route details modal */}
      <RouteModal
        open={!!activeRoute}
        onOpenChange={(v) => !v && setActiveRoute(null)}
        title={activeRoute?.title ?? ''}
        glowColor={activeRoute?.color ?? '#7c3aed'}
      >
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">{activeRoute?.subtitle}</div>
        </div>
      </RouteModal>
    </div>
  )
}
