# Mərhələ

An English learning workspace for IT Business Analysts and Product Owners, with career roadmaps, original certification practice, and an English–Azerbaijani word and terminology helper. The public entry point is `/en`; old `/az` links redirect to the equivalent English page.

**Tracks:** BA Junior → Mid → Lead; PO Junior → Mid → Senior/Lead; ECBA, CCBA, CBAP, PSPO I, PSPO II, and PSPO III.

## Run locally

Use **Node.js 24 LTS** and npm. The application requires Node.js 22 or newer.

```sh
git clone https://github.com/Sanan2030/level_up.git
cd level_up
npm ci
npm run dev
```

Open the address printed by Next.js. The root route redirects to English. No database, account, paid API, or secret is required. The curated terminology dictionary works offline; general-word fallback depends on external public services.

For an existing checkout, use `npm ci` to reproduce the committed lockfile. Use `npm install` only when intentionally updating dependencies; commit the resulting `package-lock.json` with that change.

To run the production build locally:

```sh
npm run build
npm start
```

The build validates content before generating the application. To set canonical URLs, sitemap URLs, and social metadata, copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to your site's origin. Its fallback is `https://level-up.example`, a placeholder that must be replaced before a public launch. This is a public setting, not a secret.

## What is included

- The supplied Mərhələ design with a landing-page roadmap builder, horizontal navigation, a personal dashboard at `/[locale]/dashboard`, and a responsive English application shell, light/dark appearance, keyboard controls, and reduced-motion support.
- Three-step onboarding with a current level, target level or certification, and daily study time. Roadmaps show the learning gap, prerequisite order, time estimates, and target-level skills. Changing tracks preserves progress.
- Six career competency profiles with expectations, hard and soft skills, tools, deliverables, interview examples, and self-assessment checklists.
- A searchable lesson library and glossary, statically generated MDX lessons, Mermaid diagrams, an interactive learning stepper, notes, bookmarks, and lesson completion.
- 446 original questions (100 each for PSPO I/II, 40 PSPO III written reflections, 64 ECBA, 60 each for CCBA/CBAP, and 11 each for BA/PO topic practice), domain drills, mistake review, spaced repetition, shuffled answers, flagged questions, persisted sessions, and attempt history. Selected-response, ordering, matching, and written-reflection formats have separate handling.
- Practice sessions of 5–100 questions with difficulty, response-format and unseen-question filters; weighted 50-question ECBA mocks are enabled by verified configuration and sufficient domain coverage. Other full mocks retain their verification and bank-size gates.
- A top-level **Translate** tool supports words, acronyms and phrases such as _onboarding_, _Definition of Done_ and _scope creep_. Its 91 curated terms have English definitions, Azerbaijani meanings and explanations, and examples in both languages. Unknown terms use optional public dictionary/machine-translation services with visible limitations.
- A five-group, 28-focus-area Professional Scrum study guide links concepts to available lessons and identifies the coaching/mentoring/teaching coverage gaps.
- A dashboard with measured lesson progress, activity streak, milestones, next steps, and practice history charts.
- Validated JSON progress export/import, typed storage adapters, Zod content validation, Vitest logic tests, and GitHub Actions checks.

The curriculum deliberately distinguishes **complete lessons** from **planned outlines**. There are 73 topics: 33 complete English lessons and 40 detailed outlines. Complete lessons cover stakeholder mapping, requirement types, user stories and Gherkin, prioritization, Product Goals, backlog management, product metrics, all 9 IIBA certification lessons grounded in supplied BABOK v3 sections, and all 17 PSPO lessons, including Scrum events/artifacts, product value, empirical strategy, EBM, stakeholder decisions, Kanban flow, and written case reasoning. Outlines document the remaining topic sequence and cannot be counted as completed lessons. Time estimates include the whole curriculum, including planned content; they are guidance rather than a guarantee.

## Certification accuracy

All questions are independently written educational practice, **not official exam questions**. The app is not affiliated with IIBA or Scrum.org. It does not reproduce BABOK text, book text, official assessment questions, or exam dumps. Uploaded PDFs are not distributed with the app.

Exam details live in `data/exams/`, with source links, verification status, and a verification date. Fields marked `TODO: VERIFY` or `needs-verification` must be checked against the linked official sources before being presented as current exam facts. A missing or unpublished pass threshold remains `null`; it is never guessed. Certification eligibility must be checked with the awarding organization.

ECBA, CCBA, and CBAP formats, question counts, durations, and blueprint weights were verified against official IIBA pages/documents on 2026-10-20; the CCBA/CBAP page facts were reconfirmed on 2026-10-21. The current English ECBA uses the nine-domain blueprint. Numerical passing thresholds were not confirmed and remain null. Scrum.org assessment pages returned a website challenge, so PSPO exam settings remain unverified. See [exam provenance](data/exams/SOURCES.md) and [teaching provenance](docs/CONTENT-SOURCES.md).

Full-length mock mode is enabled only when the format is verified, required configuration is present, and the bank has enough unique questions with the required domain coverage. A small practice bank is not represented as a full official-format mock. Written answers use a self-review rubric and are excluded from automatic scoring. Pausing is a learning convenience, not a claim about official exam rules. Readiness and practice results do not predict an official exam result.

## Project structure

```text
app/                         App Router pages, metadata, sitemap
components/                  App shell, learning views, lessons, quizzes, charts
content/{ba,po,certs,certifications}/        Locale-specific MDX lessons and outlines
data/modules.json            Roadmap modules and prerequisite relationships
data/lessons.json             Stable lesson metadata
data/competencies/           Career-level expectations and assessment checklists
data/glossary.json            Bilingual terms and related lessons
data/questions/              Original question banks
data/exams/                  Editable exam settings and source provenance
data/sources.json            Read/uploaded and unavailable source register
data/dictionary.json         Curated English–Azerbaijani explanations and examples
data/scrum-competencies.json  Five groups and 28 focus areas
lib/                         Schemas, content loading, roadmap, storage, quiz logic
scripts/                     Build-time content validation
tests/                       Logic and content validation tests
```

Next.js App Router and TypeScript provide the application foundation. Tailwind and shared CSS styles provide the design system. MDX is compiled from trusted repository content; Zod validates metadata and JSON. Mermaid, Framer Motion, and Recharts supply diagrams, motion, and charts. Heavy visual components load separately from the main interface.

See [Content authoring](docs/CONTENT_AUTHORING.md) to add or translate lessons through GitHub without changing UI code.

## Progress and privacy

The `StorageAdapter` interface in `lib/storage.ts` is asynchronous, so a database-backed implementation can replace the local adapter later. Stored progress has a schema version; the parser validates data and supports the defined legacy migration. Lesson IDs stay the same across languages, so translation changes do not erase completion.

Progress, quiz sessions, notes, and bookmarks currently live **only in this browser's localStorage**. They do not automatically synchronize between devices or browsers. Clearing browser data, using private browsing, or reaching the storage quota can lose or prevent persistence. Export progress regularly from Settings; import previews require confirmation before replacing current progress. Imports are validated and limited to 5 MB. Keep exported files private because they include your notes and written responses.

There is no authentication, shared-user database, or analytics service. Do not store confidential client or employer information in lesson notes. Database sync, accounts, and conflict resolution would require a separate integration and deployment configuration.

## Development checks

```sh
npm run validate:content
npm run lint
npm run typecheck
npm test
npm run format:check
npm run build
npm run test:e2e
```

`npm run test:e2e` uses Playwright with a production server on port 3100. Install its browser once with `npx playwright install chromium`; to use an existing browser, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. Tests cover functional flows and automated WCAG A/AA checks.

`npm run test:watch` runs Vitest while developing. `npm run format` applies Prettier. The CI workflow runs the checks above on pushes and pull requests; a green run applies only to the revision it tested. For UI changes, also inspect English pages, both themes, the bilingual Translate results, a narrow viewport, keyboard navigation, and the affected functional flow. Source verification is a separate editorial responsibility; passing a schema check does not establish that an exam fact is current.

## Publish through GitHub and Vercel

1. **Use the existing repository.** This project belongs to `Sanan2030/level_up`. If reproducing it in a new GitHub repository, create an empty repository first, then configure its HTTPS remote. Do not overwrite an existing remote or remote history without reviewing it.
2. **Commit and push the project.** After validation, push the intended production branch. The normal commands for this repository are:

   ```sh
   git add .
   git commit -m "Expand BA and PO learning platform"
   git push -u origin main
   ```

   If working on another local branch, review and merge it into `main` first. Subsequent changes should normally use pull requests.

3. **Import into Vercel.** Sign in to Vercel, choose **Add New → Project**, connect your GitHub account, and import `Sanan2030/level_up`. Grant access to that repository when prompted.
4. **Review the build settings.** Select Next.js, keep the repository root as the root directory, use Node.js 24.x when available, use `npm ci` for installation, and `npm run build` for the build command. Keep Next.js's default output settings.
5. **Set the public origin.** Add `NEXT_PUBLIC_SITE_URL` using the canonical HTTPS production origin. No database connection string or API secret is needed for the initial version. Redeploy after changing build-time environment variables.
6. **Set production and preview branches.** Confirm **Settings → Git → Production Branch** is `main`. With the Git integration enabled, pushes to `main` create production deployments; pull requests and other branches receive preview deployments. Review the environment-variable scopes for Production and Preview separately. Preview URLs are for checking changes before merging.
7. **Deploy and check behavior.** Trigger the first deployment, inspect build logs, then verify `/az` and `/en`, a complete lesson, onboarding, a quiz, and export/import. Check browser persistence on the deployed origin; data from another origin does not transfer automatically.
8. **Optional custom domain.** In **Settings → Domains**, add your domain, apply the DNS records Vercel provides, and wait for DNS and HTTPS verification. Set `NEXT_PUBLIC_SITE_URL` to that canonical domain and redeploy. Confirm redirects, canonical links, sitemap, and social metadata.

This guide describes deployment; pushing Git commits alone does not create a Vercel project or prove a deployment succeeded. Verify certification settings and expand outline content before representing the site as a complete exam-preparation course.

## Supplied teaching sources

The curriculum uses selected sections of the user-supplied BABOK Guide v3 (IIBA, 2015), Scrum Guide (November 2020), The Kanban Guide for Scrum Teams (January 2021), Evidence-Based Management Guide (2024), _The Professional Product Owner_ (McGreal & Jocham, 2018), and pasted official Professional Scrum Competencies text. Current guides take precedence over older book terminology. This is selected-section reading, not a claim that every page of both books was read.

There are 244 explicitly source-tagged questions. New lessons and questions cite source sections. Existing question and option IDs remain stable for saved attempts. The source register distinguishes read uploads/pages from inaccessible links. Read [the content audit](docs/CONTENT-SOURCES.md), [research findings and limitations](docs/RESEARCH-2026-10-21.md), and [selected reading records](docs/reading-audits/babok-reading-audit.md).

One public community preparation README was read and assessed separately. First-hand candidate exam-result reports could not be read through the current network restrictions. No candidate-review consensus, pass-rate claims or real exam questions were invented. PSPO exam formats remain unverified even though the practice banks are larger.

## Translate

Open **Translate** in the header and enter an English word or short phrase, or select text in a lesson before opening it. Curated entries are available immediately with contextual explanations in English and Azerbaijani. General English results use Free Dictionary API, an exact-match Datamuse definition fallback, and MyMemory and are labeled as machine translated; a provider outage, missing definition or quota limit produces an honest unavailable state.

`GET /api/translate?q=...` accepts short text only, uses fixed upstream hosts, validates responses, applies timeouts, bounds its cache and requires no credentials. Only explicit unknown-term lookups contact these services. Tests mock provider success/failure. A live check on 2026-10-22 confirmed Datamuse definitions and MyMemory translation respond successfully; the primary dictionary returned HTTP 403 in this cloud environment. External services may still be unavailable or quota-limited. The original PDFs are not bundled or made downloadable.

English-only publication preserves old lesson IDs, progress storage and notes. Localized JSON fields and archived AZ MDX files remain for compatibility and terminology work; `/az/...` redirects preserve path and query parameters.
