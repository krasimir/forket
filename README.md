<h1 align="center">𐂐 Forket - the RSC support without a framework</h1>

Forket is a tool that splits your code to client and server so you have [RSC (React Server Components)](https://react.dev/reference/rsc/server-components) working without a framework.

* [Documentation](./forket/README.md)
* [Examples/templates](#examplestemplates)
* [A must-read intro blog post](https://krasimirtsonev.com/blog/article/vanilla-react-server-components-with-no-framework)

## RSC features

| Feature | Is supported |
| ----------- | ----------- |
| Streaming | ✅ |
| Async server components | ✅ |
| Mixing server and client components | ✅ |
| `"use client"` and `"use server"` directives | ✅ |
| `Suspense` + `use` | ✅ |
| Server functions | ✅ |
| Server actions | ✅ |
| `useActionState`, `useTransition` | ✅ |
| Passing live-promise from server to client | ✅ |

<img width="500" src="https://raw.githubusercontent.com/krasimir/forket/refs/heads/main/assets/project_whitebg.png">
‎
## Examples/Templates

* esbuild / [Basic code snippets](./examples/basic/) - app that covers the examples from the [official server components](https://react.dev/reference/rsc/server-components) docs.
* esbuild / [Image annotator](./examples/annotation-app/) - a little bit more complicated app for annotating pictures
* Vite / [Inspirational quote generator](./examples/vite/) - generates inspirational quote
* Webpack / [Inspirational quote generator](./examples/webpack/) - generates inspirational quote
* [CLI](./examples/just-cli) - No app really. Just Forket doing its magic.

## Caveats

I'm quite happy with the result so far. The libarry is supporting almost everything that is listed into the official docs. However, to make all this work at a decent level I had to make some compromises. Here's the list:

* You can’t have nester client boundaries or in other words nested islands.
* There is an additional `div` with `display: content` for the root client components. So, no effect on your layout but there may be problems with some CSS selectors.
* The server’s entry point also need to be processed by Forket. This means that it needs to be inside the `src` directory. Usually that's the case but who knows.
* There must be at least one file in the root directory with “use client” directive. Forket need to inject some client-side utilities in order to operate.
* The client entry points (the components that have “use client” need to default export a component)

## Materials/inspiration

* By Lazar Nikolov https://www.smashingmagazine.com/2024/05/forensics-react-server-components
* By Dan Abramov - https://github.com/reactwg/server-components/discussions/5
* https://edspencer.net/2024/7/1/decoding-react-server-component-payloads
* Back in 2020 - https://www.youtube.com/watch?v=TQQPAU21ZUw
* Dev tool to see RSC - https://www.alvar.dev/blog/creating-devtools-for-react-server-components
* RSC from scratch - https://www.youtube.com/watch?v=MaebEqhZR84
