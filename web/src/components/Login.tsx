import React from "react"
import { login } from "../api"
import { toastErr } from "./Toast"

export default function Login({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = React.useState("admin@cstock.local")
  const [password, setPassword] = React.useState("admin123")
  const [loading, setLoading] = React.useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setLoading(true)
      await login(email, password)
      onDone()
    } catch (e: any) {
      toastErr(e?.response?.data?.message ?? "Échec de connexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 bg-white p-6 rounded-xl shadow">
        <div className="text-center">
          <div className="text-xl font-semibold">C-Stock</div>
          <div className="text-sm text-neutral-500">Connexion</div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Email</label>
          <input
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={email} onChange={(e) => setEmail(e.target.value)} inputMode="email" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Mot de passe</label>
          <input
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button disabled={loading}
          className="w-full rounded-lg bg-brand-600 hover:bg-brand-700 text-white py-2 font-medium disabled:opacity-60">
          {loading ? "Connexion…" : "Se connecter"}
        </button>
        <p className="text-center text-xs text-neutral-500">admin@cstock.local / admin123</p>
      </form>
    </div>
  )
}
