import App from './App.svelte'

// Uncomment for local mock
// import('./mocks/browser').then(({ worker }) => worker.start({
//  onUnhandledRequest: "error"
// }));

const app = new App({
  target: document.getElementById('app')
})

export default app
