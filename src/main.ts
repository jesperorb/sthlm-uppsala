import App from './App.svelte'

// Start the mocking conditionally.
if (process.env.NODE_ENV === 'development') {
    import('./mocks/browser')
      .then(({ worker }) => worker.start());
}

const app = new App({
  target: document.getElementById('app')
})

export default app
