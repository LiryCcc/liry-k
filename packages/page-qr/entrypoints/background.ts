const backgroundScript = defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime['id'] });
});

export default backgroundScript;
