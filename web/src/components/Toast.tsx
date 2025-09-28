import React from "react"
import { createPortal } from "react-dom"
import clsx from "clsx"

export function toastOk(msg: string) {
  window.dispatchEvent(new CustomEvent("toast", { detail: { msg, type: "ok" } }))
}
export function toastErr(msg: string) {
  window.dispatchEvent(new CustomEvent("toast", { detail: { msg, type: "err" } }))
}

export default function Toast() {
  const [message, setMessage] = React.useState<string | null>(null)
  const [type, setType] = React.useState<"ok"|"err">("ok")

  React.useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      setMessage(detail.msg)
      setType(detail.type)
      setTimeout(() => setMessage(null), 3000)
    }
    window.addEventListener("toast", handler as any)
    return () => window.removeEventListener("toast", handler as any)
  }, [])

  if (!message) return null
  return createPortal(
    <div className={clsx("fixed inset-x-0 top-2 z-50 flex justify-center px-3")}>
      <div className={clsx("rounded-lg px-4 py-2 text-sm shadow-md",
        type === "ok" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white")}>
        {message}
      </div>
    </div>,
    document.body
  )
}
