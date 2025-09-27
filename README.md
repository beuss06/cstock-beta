# C‑Stock — Starter (TS/Node + NestJS + Prisma + PostgreSQL + MinIO + Traefik + React PWA)

Ce dépôt fournit **une base prête à déployer** pour ton projet **C‑Stock** :
- **Backend** : Node 20 LTS • **NestJS** • **Prisma** • **JWT/RBAC** • OpenAPI.
- **Base** : **PostgreSQL 16** (+ **migrations Prisma**). Sauvegardes automatiques.
- **Fichiers/Photos** : **MinIO (S3 compatible)** pour BL, photos produits/outils.
- **Reverse‑proxy & TLS** : **Traefik** avec **Let’s Encrypt** auto (HTTP→HTTPS).
- **Frontend** : **React + Vite** en **PWA mobile‑first** (manifest + SW).
- **Docker Compose** : orchestration simple sur ton **VPS 4 vCPU / 8 Go / 240 Go**.

> Tout est **commenté** pour expliquer **pourquoi** chaque choix a été fait.

---

## 1) Pourquoi ces choix ?

- **TypeScript partout (front/back)** : un seul langage = modèles partagés, vélocité, maintenance plus simple.
- **NestJS** : structure modulaire (DI, Guards, Pipes) ⇒ évite le “spaghetti” quand le projet grossit (stocks, mouvements, outillage, etc.).
- **Prisma + PostgreSQL** : schéma typé, **migrations versionnées** (garantit que les **mises à jour ne perdent pas la base**), transactions solides pour les mouvements de stock.
- **MinIO (S3)** : stockage d’objets robuste (photos BL/outils) décorrélé de la DB, versionnable, sauvegardable séparément.
- **Traefik** : termine TLS (Let’s Encrypt), gère les routes, redirige HTTP→HTTPS ; évite la configuration NGINX complexe. Parfait pour **cstock.slegd.com**.
- **React + Vite + PWA** : **mobile‑first** et installable comme appli ; accès caméra (scan code‑barres/QR), perf top, DX moderne.
- **Backups Postgres** : conteneur de sauvegarde planifiée prêt à l’emploi (évite l’oubli critique).
- **Logs/Health** : `/health` + Swagger pour vérifier l’état et la contract API.

---

## 2) Pré‑requis

- **DNS** : créer un enregistrement **A** `cstock.slegd.com` → **82.165.95.7**.
- **Docker + docker compose** installés sur le VPS.
- Ouvrir les ports **80** et **443** en entrée, SSH sur **22** seulement.
- (Recommandé) UFW/Fail2ban activés côté OS.

---

## 3) Configuration

Copie `.env.example` en `.env` et adapte :

```bash
cp .env.example .env
```

Champs importants :
- `TRAEFIK_ACME_EMAIL` : e‑mail pour Let’s Encrypt.
- `PUBLIC_FQDN=cstock.slegd.com` : domaine public.
- **JWT** : `JWT_SECRET` (génère une valeur forte).
- **Postgres** : mots de passe/DB.
- **MinIO** : clés d’accès.

> Tous les services lisent `.env` via docker‑compose.

---

## 4) Lancement

```bash
docker compose up -d --build
```

Puis **migrations Prisma** et **seed** :

```bash
docker compose exec api npx prisma migrate deploy
docker compose exec api npx ts-node prisma/seed.ts
```

Accès :
- **Front** : `https://cstock.slegd.com/`
- **API Swagger** : `https://cstock.slegd.com/api/docs`
- **MinIO Console (privé)** : non exposé publiquement par défaut (sécurité).

Admin de démonstration (seed) :
- **email** : `admin@cstock.local`
- **password** : `admin123` (à **changer** immédiatement).

---

## 5) Modules livrés

- **Auth** (JWT, rôles RBAC) : masque les **tarifs** côté API selon rôle (sécurité server‑side).
- **Items (Références)** : CRUD ; champs **optionnels** (EAN, unités, famille…). **Tarifs** servis seulement aux rôles autorisés.
- **Locations** : dépôts, chantiers (17 seeds), véhicules, box. Archivage possible.
- **Stocks** : quantités par lieu, seuils mini, alertes (base prête).
- **Movements** : **Entrée/Sortie/Transfert/Retour/Perte/Casse** ; journal complet (qui/quand/où).
- **Tools (Parc électroportatif/outillage)** : numéros de série, affectations, historique, maintenances (base prête).
- **Suppliers** : fournisseurs liés aux références et tarifs.
- **Attachments** : photos/BL stockés dans MinIO (S3).

> Les endpoints de base sont fournis (stubs + exemples). À compléter au besoin.

---

## 6) Sauvegardes

Le service `pgbackups` réalise des dumps **quotidiens** (rétention paramétrable).  
Pourquoi : **ne jamais** dépendre d’un seul volume ; pouvoir **restaurer** après une MAJ ratée.

Dump local : `./backups` (volume) — à répliquer hors‑serveur si possible.

---

## 7) Sécurité (principes)

- **HTTPS partout** via Traefik + Let’s Encrypt.
- **JWT expirables** + refresh token (évolutif).
- **RBAC** fin : ADMIN, LOGISTICIAN, SITE_MANAGER, STOREKEEPER, ACCOUNTING, VIEWER.
- **Masquage prix** côté **API** (jamais faire confiance au front).
- **Audit** : mouvements horodatés, utilisateur exécutant, payload minimal loggué.
- **MinIO** non exposé publiquement.

---

## 8) Front (PWA mobile‑first)

- Manifest + Service Worker → installable sur mobile.
- Page d’accueil = **tableaux** (références/alertes), recherche, actions rapides.
- Scanner (stub) prêt : accès caméra (API navigateur), **pour E/S rapides**.

---

## 9) Prochaines étapes suggérées

- 🎯 Finaliser DTO/validation par endpoint + tests e2e.
- 🔐 Ajouter MFA/SSO si nécessaire.
- 📦 Intégrer import CSV (Rexel/Esabora) quand prêt.
- 📊 Dashboards : consommation par période, ruptures, top mouvements.
- 📴 Offline minimal (cache lecture + file d’attente POST).

Bon build !
