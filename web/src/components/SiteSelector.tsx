import React from "react"
import { getLocations } from "../api"
import { Location } from "../types"
import { useSite } from "../context/SiteContext"

function isSite(l: Location) {
  const t = (l.type || "").toUpperCase()
  return t === "SITE" || t === "CHANTIER"
}

export default function SiteSelector() {
  const [sites, setSites] = React.useState<Location[]>([])
  const { site, setSite } = useSite()

  React.useEffect(() => {
    getLocations().then((all) => {
      const filtered = all.filter(l => !l.archived && isSite(l))
      if (filtered.length) setSites(filtered)
      else setSites(all.filter(l => !l.archived && !/d[ée]p[oô]t/i.test(l.name)))
    })
  }, [])

  return (
    <div className="flex items-center gap-2">
      <span className="hidden md:inline text-sm text-neutral-600">Chantier :</span>
      <select
        className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm bg-white"
        value={site?.id || ""}
        onChange={(e) => {
          const id = e.target.value
          const sel = sites.find(s => s.id === id) || null
          setSite(sel)
        }}
      >
        <option value="">Tous</option>
        {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
    </div>
  )
}
