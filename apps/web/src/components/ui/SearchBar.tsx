'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal } from 'lucide-react'

export default function SearchBar({
  placeholder = 'Search places, stops…',
  onSubmit,
}: { placeholder?: string; onSubmit?: (q: string) => void }) {
  const [q, setQ] = useState('')
  const [focus, setFocus] = useState(false)

  return (
    <motion.form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.(q.trim())
      }}
      initial={false}
      animate={{
        boxShadow: focus
          ? '0 12px 40px rgba(0,0,0,0.18)'
          : '0 8px 24px rgba(0,0,0,0.12)',
      }}
      className="flex gap-2 items-center rounded-2xl border bg-background/90 backdrop-blur px-3 py-2"
    >
      <Search className="w-4 h-4 text-muted-foreground" />
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder={placeholder}
        className="border-0 shadow-none focus-visible:ring-0"
      />
      <Button type="submit" className="rounded-xl">
        Search
      </Button>
      <Button type="button" variant="secondary" className="rounded-xl" title="Filters">
        <SlidersHorizontal className="w-4 h-4" />
      </Button>
    </motion.form>
  )
}
