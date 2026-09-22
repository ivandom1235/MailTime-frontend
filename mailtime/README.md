# MailTime frontend configuration

Set the backend origin in `.env` beside this file:

```env
VITE_API_BASE_URL=https://mailtime-sj1m.onrender.com
```

Use the actual Render URL, without a trailing slash or `/api`. `src/services/api.js`
reads this variable and appends `/api` itself. For a local backend, use
`http://localhost:5000`. Restart `npm run dev` after changing `.env`.

`.env` is ignored by Git. For Vercel deployment, set `VITE_API_BASE_URL` in the
frontend project's Environment Variables and redeploy. If the backend hostname
changes, also replace the old backend origin in `vercel.json`'s `connect-src`
directive, or the browser will block API requests. Backend credentials belong in
Render's environment settings, not in the frontend.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
