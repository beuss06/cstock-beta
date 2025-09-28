import React from "react"
import { getMovements, getItems, getLocations } from "../api"
import { Movement, Item, Location, MovementType } from "../types"
import { toastErr } from "./Toast"
import { useSite } from "../context/SiteContext"

export default function History() {
  const [items, setItems] = React.useState<Item[]>([])
  const [locs, setLocs] = React.useState<Location[]>([])
  const [movs, setMovs] = React.useState<Movement[]>([])
  const [q, setQ] = React.useState<{type?: MovementType | ""; itemId?: string; locId?: string}>({})
  const { site } = useSite()

  React.useEffect(() => {
    getItems().then(setItems).catch(() => toastErr("Items indisponibles"))
    getLocations().then(setLocs).catch(() => toastErr("Lieux indisponibles"))
    refresh()
  }, [])

  async function refresh() {
    try {
      const data = await getMovements()
      setMovs(data)
    } catch {
      toastErr("Historique indisponible")
    }
  }

  const filtered = movs.filter(m => {
    if (q.type && m.type !== q.type) return false
    if (q.itemId && m.itemId !== q.itemId) return false
    if (q.locId && !(m.fromLocationId === q.locId || m.toLocationId === q.locId)) return false
    if (site && !(m.fromLocationId === site.id || m.toLocationId === site.id)) return false
    return true
  })

  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-end sm:justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
          <select className="rounded-lg border border-neutral-300 px-3 py-2"
                  value={q.type ?? ""} onChange={e => setQ(p => ({...p, type: e.target.value as any || ""}))}>
            <option value="">Type</option>
            <option value="ENTRY">Entrée</option>
            <option value="EXIT">Sortie</option>
            <option value="TRANSFER">Transfert</option>
            <option value="RETURN">Retour</option>
            <option value="LOSS">Perte/Casse</option>
          </select>
          <select className="rounded-lg border border-neutral-300 px-3 py-2"
                  value={q.itemId ?? ""} onChange={e => setQ(p => ({...p, itemId: e.target.value || ""}))}>
            <option value="">Article</option>
            {items.map(i => <option key={i.id} value={i.id}>{i.refCode} — {i.label}</option>)}
          </select>
          <select className="rounded-lg border border-neutral-300 px-3 py-2"
                  value={q.locId ?? ""} onChange={e => setQ(p => ({...p, locId: e.target.value || ""}))}>
            <option value="">Lieu</option>
            {locs.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>
        <button onClick={refresh} className="rounded-lg bg-neutral-100 hover:bg-neutral-200 px-3 py-2">
          Rafraîchir
        </button>
      </div>

      {site && (
        <div className="mt-3 text-sm text-neutral-600">
          Filtré par chantier : <span className="font-medium">{site.name}</span>
        </div>
      )}

      {/* mobile = cartes, desktop = table */}
      <div className="mt-4 space-y-2 md:hidden">
        {filtered.map(m => (
          <div key={m.id} className="rounded-lg border border-neutral-200 p-3">
            <div className="text-sm text-neutral-500">{new Date(m.createdAt).toLocaleString()}</div>
            <div className="font-medium">{m.type} · {m.item?.refCode ?? m.itemId} × {m.qty}</div>
            <div className="text-sm">
              {m.fromLocation?.name || "—"} → {m.toLocation?.name || "—"}
            </div>
            {(m.blNo || m.poNo) && (
              <div className="text-xs text-neutral-500">BL {m.blNo ?? "—"} · PO {m.poNo ?? "—"}</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-500">
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Type</th>
              <th className="py-2 pr-4">Article</th>
              <th className="py-2 pr-4">Qté</th>
              <th className="py-2 pr-4">De</th>
              <th className="py-2 pr-4">Vers</th>
              <th className="py-2 pr-4">BL</th>
              <th className="py-2 pr-4">PO</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} className="border-t border-neutral-200">
                <td className="py-2 pr-4">{new Date(m.createdAt).toLocaleString()}</td>
                <td className="py-2 pr-4">{m.type}</td>
                <td className="py-2 pr-4">{m.item?.refCode ?? m.itemId} — {m.item?.label ?? ""}</td>
                <td className="py-2 pr-4">{m.qty}</td>
                <td className="py-2 pr-4">{m.fromLocation?.name ?? "—"}</td>
                <td className="py-2 pr-4">{m.toLocation?.name ?? "—"}</td>
                <td className="py-2 pr-4">{m.blNo ?? "—"}</td>
                <td className="py-2 pr-4">{m.poNo ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
