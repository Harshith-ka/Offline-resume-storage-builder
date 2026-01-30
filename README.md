# Resume Forge

**Apple Notes + Canva + AI — but for resumes.**

A fully **offline-capable**, premium resume builder and storage platform with a Canva-style editor, AI-ready features, student and fresher templates, and local-first storage.

---

## Core idea

- **Canva-level drag-and-drop editor** — Text, skill bars, timelines, sections, project/internship cards; snap-to-grid, zoom, layers.
- **AI-powered writing** — Resume generation, section enhancement, summarization, ATS feedback (backend hooks; wire to OpenAI or local LLM).
- **Student & fresher first** — Academic-first, internship-based, and ATS-friendly templates.
- **Local-first storage** — IndexedDB; edit and save offline, version history, optional cloud later.
- **Premium UI** — Dark theme, glassmorphism, gradient hero, Framer Motion, grain texture.

---

## Target users

| Primary | Secondary |
|--------|-----------|
| College students (18–24), no full-time experience | Freelancers |
| Freshers (0–2 yrs), ATS-friendly, multiple role versions | Career switchers |
| Internships, projects, hackathons | Placement cells |

---

## Tech stack

| Layer | Stack |
|-------|--------|
| **Frontend** | Next.js 15, TypeScript, Tailwind, shadcn-style (Radix), Framer Motion, Zustand, idb (IndexedDB) |
| **Backend** | FastAPI (AI services, auth/licensing later) |
| **Storage** | IndexedDB (offline), version history; SQLite/encrypted local on backend when needed |

---

## Getting started

### Frontend (Next.js)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Backend (FastAPI, optional for AI)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
uvicorn main:app --reload
```

API: [http://localhost:8000](http://localhost:8000). Set `NEXT_PUBLIC_API_URL=http://localhost:8000` for AI features.

---

## UX flow

1. **Landing** → Premium pitch, differentiators.
2. **Choose path** → Student / Fresher / Professional (via Templates).
3. **Pick template** → Academic First, ATS Fresher, Professional Clean (editable canvas).
4. **Editor** → Drag blocks, resize/align (snap grid), edit text, save (IndexedDB).
5. **My Resumes** → List, open, duplicate (e.g. Resume_Frontend, Resume_Internship), delete.
6. **Export** → PDF (ATS-friendly), PNG; print-safe margins.
7. **AI** (when backend is wired) → Generate, enhance, summarize, ATS feedback.

---

## Features

- **Blocks:** Heading, Paragraph, Bullet list, Skill meter, Timeline, Section, Project card, Internship card.
- **Templates:** Student (no experience), Fresher (ATS), Professional (clean).
- **Editor:** Drag to move, snap-to-grid (8px), zoom, block palette, delete selected.
- **Storage:** Save/load from IndexedDB; version history stored per resume.
- **Export:** PDF (text-based, ATS-friendly), PNG (when canvas ref available).
- **API:** FastAPI stubs for AI generate, enhance, summarize, ATS feedback.

---

## Project structure

```
├── src/
│   ├── app/           # Next.js App Router
│   │   ├── page.tsx    # Landing
│   │   ├── templates/  # Template picker
│   │   ├── resumes/   # My Resumes (IndexedDB list)
│   │   └── editor/    # Canvas editor, export
│   ├── components/    # UI, editor blocks
│   ├── lib/           # db (idb), api, utils
│   ├── store/         # Zustand editor store
│   ├── types/         # Resume, blocks
│   └── data/          # Template definitions
├── backend/            # FastAPI AI stubs
│   ├── main.py
│   └── requirements.txt
└── README.md
```

---

## License

Private / commercial as per your terms.
