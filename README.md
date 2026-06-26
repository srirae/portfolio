# srirae.vercel.app

My personal portfolio. Built from scratch (well, from a Magic UI template I completely dismantled and rebuilt). Throughout the years I have had multiple portfolio but only this one has a mix of minamilism and classy.

---

## What's in here

| Section | What it shows |
|---|---|
| Hero/Main Section | Just a bio page |
| Resume | Just a Jake's resume template |
| Experience | Experience timeline with actual details |
| Projects | Things I built and why they exist |
| Contact | Ways to reach me |

---

## Tech

| Tool |
|---|
| **Next.js (App Router)** |
| **Tailwind CSS** |
| **Shadcn UI** |
| **Magic UI** |
| **Aceternity UI** |
| **Lucide React** |

---

## Run it locally

You'll need **Node.js 18+**. That's it.

```bash
# 1. Clone it
git clone https://github.com/srirae/portfolio.git
cd portfolio

# 2. Install deps
npm i

# 3. Start dev server
npm run dev
```

Open `http://localhost:3000`. Should just work.

---

## To customize

Everything that's "me" lives in one file:

**`src/data/resume.tsx`**

Open it and swap out the `DATA` object. Here's what's in there:

| Key | What to change |
|---|---|
| `name`, `initials` | Your name |
| `url` | Your deployed URL |
| `summary` | Your one-paragraph bio |
| `avatarUrl` | Path to your photo |
| `contact.social` | GitHub, LinkedIn, X, etc. |
| `work` | Your experience — company, role, dates, bullets |
| `education` | School, degree, dates |
| `projects` | Title, description, tech stack, links |
| `skills` | The tech you actually know |

Save the file → hot reload → done. No other config to touch.

---


## The Base website

This started as a Magic UI template. I kept the bones, threw out most of the defaults, and rebuilt it. A lot of the Shadcn components are re-styled.

---

## Credits

- [Magic UI](https://magicui.design/) — animated components and layout
- [Shadcn UI](https://ui.shadcn.com/) — component primitives
- [Aceternity UI](https://ui.aceternity.com/) — the flashy visual effects
- [Lucide](https://lucide.dev/) — icons
