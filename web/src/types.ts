export type MovementType = "ENTRY" | "EXIT" | "TRANSFER" | "RETURN" | "LOSS"

export interface Item {
  id: string
  refCode: string
  label: string
  photoUrl?: string | null
}

export interface Location {
  id: string
  name: string
  type?: string | null
  archived?: boolean
}

export interface Movement {
  id: string
  type: MovementType
  itemId: string
  qty: number
  fromLocationId?: string | null
  toLocationId?: string | null
  blNo?: string | null
  poNo?: string | null
  personName?: string | null
  siteRoom?: string | null
  createdAt: string
  item?: Item
  fromLocation?: Location | null
  toLocation?: Location | null
}
