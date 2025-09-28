import React from "react"
import { Location } from "../types"

type SiteContextType = {
  site: Location | null
  setSite: (loc: Location | null) => void
}

export const SiteContext = React.createContext<SiteContextType>({
  site: null,
  setSite: () => {}
})

export function useSite() {
  return React.useContext(SiteContext)
}

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [site, setSite] = React.useState<Location | null>(null)
  return (
    <SiteContext.Provider value={{ site, setSite }}>
      {children}
    </SiteContext.Provider>
  )
}
