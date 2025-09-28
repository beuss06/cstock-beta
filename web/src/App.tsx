import React from "react"
import Login from "./components/Login"
import MovementForm from "./components/MovementForm"
import History from "./components/History"
import { logout } from "./api"
import Toast from "./components/Toast"
import "./index.css"
import { SiteProvider } from "./context/SiteContext"
import SiteSelector from "./components/SiteSelector"

function Shell() {
  const [tab, setTab] = React.useState<"move"|"history">("move")
  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-neutral-200">
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between gap-2">
          <div className="font-semibold">C-Stock</div>
          <nav className="flex gap-2">
            <button
              className={`px-3 py-1.5 rounded-lg text-sm ${tab==="move"?"bg-brand-600 text-white":"bg-neutral-100"}`}
              onClick={() => setTab("move")}
            >Mouvement</button>
            <button
              className={`px-3 py-1.5 rounded-lg text-sm ${tab==="history"?"bg-brand-600 text-white":"bg-neutral-100"}`}
              onClick={() => setTab("history")}
            >Historique</button>
          </nav>
          <div className="flex items-center gap-2">
            <SiteSelector />
            <button onClick={logout} className="text-sm text-neutral-600 hover:text-neutral-800">Déconnexion</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-4 space-y-4">
        {tab === "move" && <MovementForm />}
        {tab === "history" && <History />}
      </main>
    </>
  )
}

export default function App() {
  const [authed, setAuthed] = React.useState(!!localStorage.getItem("token"))
  if (!authed) return (
    <>
      <Login onDone={() => setAuthed(true)} />
      <Toast />
    </>
  )
  return (
    <SiteProvider>
      <Shell />
      <Toast />
    </SiteProvider>
  )
}
