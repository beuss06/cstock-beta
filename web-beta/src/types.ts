export type MovementType = "ENTRY" | "EXIT" | "TRANSFER" | "RETURN" | "LOSS";
export type Item = { id: string; refCode: string; label: string; };
export type Location = { id: string; name: string; type: "DEPOT"|"CHANTIER"|"AUTRE"; archived?: boolean; };
export type Movement = {
  id: string; type: MovementType; itemId: string; qty: number;
  fromLocationId?: string|null; toLocationId?: string|null;
  blNo?: string|null; poNo?: string|null; personName?: string|null; siteRoom?: string|null;
  createdAt: string; item?: Item; fromLocation?: Location; toLocation?: Location;
};
