<img width="898" height="1091" alt="image" src="https://github.com/user-attachments/assets/cd332186-3498-4b67-91c5-2778f4b6c4e4" />

<img width="913" height="1202" alt="image" src="https://github.com/user-attachments/assets/f4f8edfe-f98f-4822-8193-628d77446116" />

# DynamicFacetSearch

A small containerised Node.js / Express / EJS / MongoDB CRUD web app that stores products in a single `products` collection and derives filter facets dynamically from each product's flexible `attributes` object. No authentication.

## Tech stack

- **Runtime:** Node.js 22, Express 5, EJS
- **Database:** MongoDB 7 (native driver)
- **Tests:** Jest
- **Containers:** Docker + Docker Compose
- **Dev VM:** Vagrant (libvirt or VirtualBox provider)
- **CI/CD:** Jenkins declarative pipeline (see `Jenkinsfile`)

## Repository layout

```
src/                 Express app, Mongo connection, product module
views/               EJS templates
tests/               Jest unit tests
scripts/             seed.js, provision-vagrant.sh, deploy-test.sh
public/              styles.css
Dockerfile           app image
docker-compose.yml   app + MongoDB
Vagrantfile          dev VM (Ubuntu 22.04)
Jenkinsfile          CI/CD pipeline
```

## Prerequisites

Pick one of the two paths below. Either is enough to run the project locally.

- **Docker path (simplest):** Docker 20+ and the Docker Compose v2 plugin.
- **Vagrant path:** Vagrant + libvirt (Linux) or VirtualBox (macOS / Windows).

## Quick start — Docker Compose on your host

```bash
git clone git@github.com:Emrebener/DynamicFacetSearch.git
cd DynamicFacetSearch
cp .env.example .env              # adjust only if you need to
docker compose up -d --build
```

The app is published on **http://localhost:3010** and MongoDB is available only on the internal Compose network.

### Seed demo data

The app starts with an empty `products` collection. Load the demo data (12 products across 4 categories — Laptops, Headphones, Books, Bicycles) with:

```bash
docker compose exec -T product-catalogue-web npm run seed
```

The seed script is idempotent — it clears the collection before inserting, so you can re-run it whenever you want a clean dataset.

### Stopping the stack

```bash
docker compose down          # keeps the Mongo volume
docker compose down -v       # also wipes the Mongo volume
```

## Quick start — Vagrant dev VM

```bash
vagrant up --provider=libvirt   # or --provider=virtualbox
vagrant ssh
cd /vagrant
docker compose up -d --build
docker compose exec -T product-catalogue-web npm run seed
```

The VM forwards host `127.0.0.1:3010` → guest `3010`, so the app is reachable at **http://localhost:3010** on your host.

> On **Arch/EndeavourOS with firewalld and libvirt**, the guest may fail to reach the internet during provisioning. If you see apt timeouts, you probably need a `libvirt-to-any` firewalld policy.

## Running the tests

```bash
npm install
npm test
```

The same command runs inside the Jenkins pipeline under the *Run tests* stage.

## GitFlow

- `main` — stable.
- `develop` — integration. CI deploys to the test environment on pushes here.
- `feature/*` — new work, merged into `develop` via PR.
- `hotfix/*` — urgent fixes, merged into `develop` (and `main` when applicable).

Do **not** push straight to `develop` or `main`; use a PR.

## CI/CD

A push to any branch triggers the Jenkins pipeline (via GitHub webhook). The pipeline runs checkout → `npm ci` → `npm test` → `docker compose build`. When the built branch is `develop`, the pipeline additionally runs `scripts/deploy-test.sh`, which deploys the app + MongoDB stack on the test-environment host via Docker Compose.

The test environment is for demos only. Do **not** treat it as production.

## Environment variables

`.env.example` documents the expected variables. `MONGO_URI` is the only value you normally need to change; the defaults work for local Docker Compose and the Vagrant VM.

