import React from "react"
import { createMovement, getItems, getLocations } from "../api"
import { MovementType, Item, Location } from "../types"
import { toastErr, toastOk } from "./Toast"
import { useSite } from "../context/SiteContext"

const TYPES: { key: MovementType; label: string }[] = [
  { key: "ENTRY", label: "Entrée" },
  { key: "EXIT", label: "Sortie" },
  { key: "TRANSFER", label: "Transfert" },
  { key: "RETURN", label: "Retour" },
  { key: "LOSS", label: "Perte/Casse" },
]

export default function MovementForm() {
  const [type, setType] = React.useState<MovementType>("ENTRY")
  const [items, setItems] = React.useState<Item[]>([])
  const [locs, setLocs] = React.useState<Location[]>([])
  const [itemId, setItemId] = React.useState("")
  const [qty, setQty] = React.useState<number>(1)
  const [fromId, setFromId] = React.useState<string>("")
  const [toId, setToId] = React.useState<string>("")
  const [blNo, setBlNo] = React.useState("")
  const [poNo, setPoNo] = React.useState("")
  const [personName, setPersonName] = React.useState("")
  const [siteRoom, setSiteRoom] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const { site } = useSite()

  const needsFrom = type === "EXIT" || type === "TRANSFER" || type === "LOSS"
  const needsTo   = type === "ENTRY" || type === "TRANSFER" || type === "RETURN"

  React.useEffect(() => {
    getItems().then(setItems).catch(() => toastErr("Items indisponibles"))
    getLocations().then((all) => {
      setLocs(all.filter(l => !l.archived))
    }).catch(() => toastErr("Lieux indisponibles"))
  }, [])

  React.useEffect(() => {
    if (!site) return
    if (needsTo) setToId(prev => prev || site.id)
    if (needsFrom) setFromId(prev => prev || site.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site, type])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!itemId || qty <= 0) return toastErr("Sélectionne un article et une quantité > 0")
    if (needsFrom && !fromId) return toastErr("Lieu de départ requis")
    if (needsTo && !toId) return toastErr("Lieu d’arrivée requis")
    setLoading(true)
    try {
      await createMovement({
        type, itemId, qty,
        fromLocationId: needsFrom ? fromId : undefined,
        toLocationId: needsTo ? toId : undefined,
        blNo: blNo || undefined,
        poNo: poNo || undefined,
        personName: personName || undefined,
        siteRoom: siteRoom || undefined,
      })
      toastOk("Mouvement enregistré")
      setQty(1); setBlNo(""); setPoNo(""); setPersonName(""); setSiteRoom("")
    } catch (e: any) {
      toastErr(e?.response?.data?.message ?? "Échec enregistrement")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TYPES.map(t => (
          <button key={t.key}
            onClick={() => setType(t.key)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap border
              ${type === t.key ? "bg-brand-600 text-white border-brand-600" : "bg-white text-neutral-700 border-neutral-300"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm">Article</label>
          <select className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                  value={itemId} onChange={e => setItemId(e.target.value)}>
            <option value="">— choisir —</option>
            {items.map(i => (
              <option key={i.id} value={i.id}>{i.refCode} — {i.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm">Quantité</label>
          <input type="number" min={1} className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                 value={qty} onChange={e => setQty(Number(e.target.value))} />
        </div>

        {needsFrom && (
          <div className="space-y-1">
            <label className="text-sm">Depuis</label>
            <select className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                    value={fromId} onChange={e => setFromId(e.target.value)}>
              <option value="">— lieu de départ —</option>
              {locs.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
        )}

        {needsTo && (
          <div className="space-y-1">
            <label className="text-sm">Vers</label>
            <select className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                    value={toId} onChange={e => setToId(e.target.value)}>
              <option value="">— lieu d’arrivée —</option>
              {locs.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm">N° BL fournisseur (optionnel)</label>
          <input className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                 value={blNo} onChange={e => setBlNo(e.target.value)} placeholder="BL-0001" />
        </div>

        <div className="space-y-1">
          <label className="text-sm">Bon de commande (optionnel)</label>
          <input className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                 value={poNo} onChange={e => setPoNo(e.target.value)} placeholder="JB244952" />
        </div>

        <div className="space-y-1">
          <label className="text-sm">Pour qui / Pièce (optionnel)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input className="rounded-lg border border-neutral-300 px-3 py-2"
                   value={personName} onChange={e => setPersonName(e.target.value)} placeholder="Magasinier, Chef d'équipe…" />
            <input className="rounded-lg border border-neutral-300 px-3 py-2"
                   value={siteRoom} onChange={e => setSiteRoom(e.target.value)} placeholder="salle de bain, chambre master…" />
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button disabled={loading}
            className="rounded-lg bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 font-medium disabled:opacity-60">
            {loading ? "Enregistrement…" : "Valider le mouvement"}
          </button>
        </div>
      </form>
    </div>
  )
}
