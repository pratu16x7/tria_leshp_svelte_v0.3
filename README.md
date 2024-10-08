# Tria Svelte_v0.3

AST Explorer, Parser and Algorithm Visualizer in Svelte


[![Trialgo](http://img.youtube.com/vi/iQnvFfWgHU4/0.jpg)](http://www.youtube.com/watch?v=iQnvFfWgHU4 "Trialgo Run 1")

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

tsconfig stuff:

- Path aliases are handled by https://kit.svelte.dev/docs/configuration#alias except $lib which is handled by https://kit.svelte.dev/docs/configuration#files
- If you want to overwrite includes/excludes, make sure to copy over the relevant includes/excludes from the referenced tsconfig.json - TypeScript does not merge them in
