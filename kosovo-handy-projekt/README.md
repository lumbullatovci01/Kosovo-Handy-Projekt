# Kosovo Handy

Aplikacion web mobile (PWA) që i lidh klientët në Kosovë me puntorë të shërbimeve të shtëpisë (hidraulik, elektricist, bojaxhi).

**Autori:** [Emri Mbiemri] · Programimi për Pajisje Mobile 2026/2027, AAB

## Çka bën
- Shfaq listën e puntorëve me çmim dhe vlerësim, me filtër sipas profesionit.
- Klienti hap profilin e puntorit, e telefonon ose dërgon kërkesë për shërbim.
- Puntori hyn me GitHub dhe e ndryshon çmimin vetëm te profili i vet.

## Teknologjia
Next.js, TypeScript, Tailwind, Neon (PostgreSQL), Auth.js

## Si ta nisësh
1. `npm install`
2. Krijo `.env.local` me `DATABASE_URL`, `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`
3. `npm run dev` dhe hape `http://localhost:3000`
