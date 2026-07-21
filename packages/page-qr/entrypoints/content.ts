const contentScript = defineContentScript({
  matches: ['*://*.google.com/*'],
  main() {
    console.log('Hello content.');
  }
});

export default contentScript;
