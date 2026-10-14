# William Daugherty-Miller

Personal research site. React, TypeScript and Vite, deployed to GitHub Pages.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm test          # 15 tests: routing, page structure, figure data, copy
npm run build     # production build in dist/
npm run preview   # serve dist/ at http://localhost:4173
```

Open the site through `npm run dev` or `npm run preview`. Opening `dist/index.html` directly from disk shows a blank
page, because browsers do not run module scripts from `file://`.

## Deploy to GitHub Pages

1. Push this folder to a public repository. Name it `WDaugherty.github.io` to serve it at `https://wdaugherty.github.io`;
   any other name serves it at `https://wdaugherty.github.io/<name>/`. Both work.
2. In the repository, open **Settings > Pages** and set **Source** to **GitHub Actions**.
3. Open the **Actions** tab. The **Deploy** workflow runs on every push to `main`, and can be rerun with **Run workflow**.

### If the deploy fails

| Symptom                                                | Cause                                                                                 | Fix                                                      |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `Get Pages site failed` in the build job               | Pages source is not GitHub Actions                                                    | Step 2 above                                             |
| `Getting Pages deployment status failed ... Not Found` | A run named "pages build and deployment" is GitHub's branch deploy, still switched on | Step 2 above, then rerun **Deploy**                      |
| `Branch "main" is not allowed to deploy`               | Environment protection rule                                                           | **Settings > Environments > github-pages**: allow `main` |
| Site loads blank                                       | Pages is serving the source files, not the build                                      | Step 2 above                                             |

Without Actions: run `npm run build:docs`, commit the `docs/` folder, and set **Settings > Pages** to deploy from branch
`main`, folder `/docs`. Rebuild and commit `docs/` after every change.

## Custom domain

1. Buy the domain (for example at Cloudflare or Porkbun). `.dev` domains require HTTPS, which GitHub Pages provides.
2. Verify it under your GitHub **profile Settings > Pages** before pointing DNS at GitHub.
3. Add DNS records: `A` records for `@` to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and
   `185.199.111.153`, and a `CNAME` for `www` to `wdaugherty.github.io`. Do not add wildcard records.
4. Enter the domain under the repository's **Settings > Pages > Custom domain**, then tick **Enforce HTTPS** once it is
   offered (up to 24 hours).

## Editing content

| What                                                                          | Where                   |
| ----------------------------------------------------------------------------- | ----------------------- |
| Name, title, links, education, experience, skills, manuscripts, posters, news | `src/data/profile.ts`   |
| Projects and the methods each one uses                                        | `src/data/projects.ts`  |
| Research interests on the home page                                           | `src/data/interests.ts` |
| Home-page item rows                                                           | `src/pages/Home.tsx`    |
| Bio                                                                           | `src/pages/About.tsx`   |
| Colours, type and layout                                                      | `src/styles.css`        |

Optional fields in `profile.ts` (ORCID, Google Scholar, CV PDF, posters) appear on the site only once filled in. To link
a PDF, add it as `public/cv.pdf` and set `cvPdf: "./cv.pdf"`.

The footer date updates itself at each build. Figures are synthetic and seeded, so they look the same on every load.
No patient data belongs in this repository.
