<div class="loading-wrapper">
  <div class="loading">
    <div />
    <div />
    <div />
    <div />
  </div>
</div>

<style>

.loading-wrapper {
    position: fixed;
    top: 0.25rem;
    left: 0.25rem;
  }

  .loading {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .loading div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 34px;
    height: 34px;
    margin: 4px;
    border: 4px solid #333;
    border-radius: 50%;
    animation: loading 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #333 transparent transparent transparent;
  }
  .loading div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .loading div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .loading div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes loading {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>