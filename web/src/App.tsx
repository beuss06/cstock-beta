import React, { useEffect, useMemo, useState } from 'react'
import { api, setAuth } from './api'
import cn from 'classnames'

type UserToken = { access_token: string }
type Item = { id: string; refCode: string; label: string }
type Location = { id: string; name: string; type: 'DEPOT'|'CHANTIER'|'AUTRE'; archived?: boolean }
type MovementType = 'ENTRY'|'EXIT'|'TRANSFER'|'RETURN'|'LOSS'

function useToken() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  useEffect(() => setAuth(token ?? undefined), [token])
  const save = (t: string) => { localStorage.setItem('token', t); setToken(t) }
  const clear = () => { localStorage.removeItem('token'); setToken(null); setAuth(undefined) }
  return { token, save, clear }
}

export default function App() {
  const { token, save, clear } = useToken()
  return (
    <div className="min-h-screen">
      <NavBar onLogout={clear} isAuthed={!!token} />
      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        {!token ? <LoginCard onLogged={save} /> : <Dashboard />}
      </main>
      <Footer />
    </div>
  )
}

function NavBar({ onLogout, isAuthed }: { onLogout: () => void; isAuthed: boolean }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/80 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-teal-700"></div>
          <span className="font-semibold">C-Stock</span>
        </div>
        <div className="text-sm text-gray-500">
          {isAuthed ? (
            <button onClick={onLogout} className="px-3 py-1.5 rounded-lg border hover:bg-gray-50">
              Déconnexion
            </button>
          ) : (
            <span>Gestion de stock chantier</span>
          )}
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="max-w-6xl mx-auto px-4 py-6 text-xs text-gray-400">
      © {new Date().getFullYear()} C-Stock — Prototype
    </footer>
  )
}

function LoginCard({ onLogged }: { onLogged: (token: string) => void }) {
  const [email, setEmail] = useState('admin@cstock.local')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const res = await api.post<UserToken>('/auth/login', { email, password })
      onLogged(res.data.access_token)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erreur de connexion')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-sm rounded-2xl p-6 border">
        <h1 className="text-xl font-semibold mb-1">Connexion</h1>
        <p className="text-sm text-gray-500 mb-4">Utilise l’admin seed pour commencer.</p>
        <form onSubmit={submit} className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Email</span>
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required
              className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-600"/>
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Mot de passe</span>
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required
              className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-600"/>
          </label>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button disabled={loading}
            className={cn("mt-2 px-4 py-2 rounded-lg text-white bg-teal-700 hover:opacity-90",
              loading && "opacity-60 cursor-not-allowed")}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
      <p className="text-center text-xs text-gray-500 mt-3">
        admin@cstock.local / admin123
      </p>
    </div>
  )
}

function Dashboard() {
  const [items, setItems] = useState<Item[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const [i, l] = await Promise.all([
          api.get<Item[]>('/items'),
          api.get<Location[]>('/locations'),
        ])
        setItems(i.data); setLocations(l.data)
      } finally { setLoading(false) }
    })()
  }, [])

  return (
    <div className="grid gap-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Créer un mouvement">
          <MovementForm
            items={items}
            locations={locations}
            onSuccess={(msg) => setToast(msg)}
          />
        </Card>
        <Card title="Articles (aperçu)">
          {loading ? <SkeletonRows/> : <ItemsTable items={items} />}
        </Card>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4">
          <div className="bg-emerald-600 text-white px-4 py-2 rounded-lg shadow">
            {toast}
            <button className="ml-3 opacity-70 hover:opacity-100" onClick={() => setToast(null)}>×</button>
          </div>
        </div>
      )}
    </div>
  )
}

function Card({ title, children }: React.PropsWithChildren<{ title: string }>) {
  return (
    <section className="bg-white border rounded-2xl shadow-sm">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}

function SkeletonRows() {
  return (
    <div className="animate-pulse grid gap-2">
      {Array.from({length:6}).map((_,i)=>(
        <div key={i} className="h-8 bg-gray-100 rounded" />
      ))}
    </div>
  )
}

function ItemsTable({ items }: { items: Item[] }) {
  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-left p-2">Référence</th>
            <th className="text-left p-2">Libellé</th>
            <th className="text-left p-2">ID</th>
          </tr>
        </thead>
        <tbody>
          {items.slice(0,8).map(it=>(
            <tr key={it.id} className="border-t">
              <td className="p-2 font-mono">{it.refCode}</td>
              <td className="p-2">{it.label}</td>
              <td className="p-2 text-gray-500">{it.id}</td>
            </tr>
          ))}
          {items.length===0 && (
            <tr><td colSpan={3} className="p-3 text-gray-400">Aucun article</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function MovementForm({
  items, locations, onSuccess
}: { items: Item[]; locations: Location[]; onSuccess: (msg: string)=>void }) {
  const [type, setType] = useState<MovementType>('ENTRY')
  const [itemId, setItemId] = useState<string>('')
  const [qty, setQty] = useState<number>(1)
  const [fromLocationId, setFromLocationId] = useState<string>('')
  const [toLocationId, setToLocationId] = useState<string>('')
  const [blNo, setBlNo] = useState(''); const [poNo, setPoNo] = useState('')
  const [personName, setPersonName] = useState(''); const [siteRoom, setSiteRoom] = useState('')
  const [loading, setLoading] = useState(false)
  const depots = useMemo(()=>locations.filter(l=>!l.archived), [locations])

  useEffect(()=>{
    if (!itemId && items[0]) setItemId(items[0].id)
    if (!toLocationId && depots[0]) setToLocationId(depots[0].id)
  }, [items, depots])

  const needsFrom = type === 'EXIT' || type === 'TRANSFER' || type==='RETURN'
  const needsTo   = type === 'ENTRY' || type === 'TRANSFER' || type==='RETURN'

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/movements', {
        type, itemId, qty: Number(qty) || 1,
        fromLocationId: needsFrom ? fromLocationId || undefined : undefined,
        toLocationId:   needsTo   ? toLocationId   || undefined : undefined,
        blNo: blNo || undefined, poNo: poNo || undefined,
        personName: personName || undefined, siteRoom: siteRoom || undefined,
      })
      onSuccess('Mouvement enregistré')
      setQty(1); setBlNo(''); setPoNo(''); setPersonName(''); setSiteRoom('')
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Erreur lors de l’enregistrement')
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <div className="grid sm:grid-cols-3 gap-3">
        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Type</span>
          <select value={type} onChange={e=>setType(e.target.value as MovementType)}
            className="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-teal-600">
            <option value="ENTRY">Entrée</option>
            <option value="EXIT">Sortie</option>
            <option value="TRANSFER">Transfert</option>
            <option value="RETURN">Retour</option>
            <option value="LOSS">Perte/Casse</option>
          </select>
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Article</span>
          <select value={itemId} onChange={e=>setItemId(e.target.value)}
            className="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-teal-600">
            {items.map(i=> <option key={i.id} value={i.id}>{i.refCode} — {i.label}</option>)}
          </select>
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Quantité</span>
          <input type="number" min={1} value={qty} onChange={e=>setQty(parseInt(e.target.value))}
            className="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-teal-600"/>
        </label>
      </div>

      {needsFrom && (
        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Depuis</span>
          <select value={fromLocationId} onChange={e=>setFromLocationId(e.target.value)}
            className="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-teal-600">
            <option value="">— choisir —</option>
            {depots.map(l=> <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </label>
      )}

      {needsTo && (
        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Vers</span>
          <select value={toLocationId} onChange={e=>setToLocationId(e.target.value)}
            className="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-teal-600">
            <option value="">— choisir —</option>
            {depots.map(l=> <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </label>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <label className="grid gap-1">
          <span className="text-sm text-gray-600">N° BL (optionnel)</span>
          <input value={blNo} onChange={e=>setBlNo(e.target.value)}
            className="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-teal-600"/>
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-600">N° BC (optionnel)</span>
          <input value={poNo} onChange={e=>setPoNo(e.target.value)}
            className="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-teal-600"/>
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Personne</span>
          <input value={personName} onChange={e=>setPersonName(e.target.value)}
            className="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-teal-600"/>
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Pièce / Zone</span>
          <input value={siteRoom} onChange={e=>setSiteRoom(e.target.value)}
            className="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-teal-600"/>
        </label>
      </div>

      <div className="flex justify-end">
        <button disabled={loading}
          className={cn("px-4 py-2 rounded-lg text-white bg-teal-700 hover:opacity-90",
            loading && "opacity-60 cursor-not-allowed")}>
          {loading ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}
