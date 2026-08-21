export const debugLog = async () => {
  console.log(import.meta.env);
  console.log(import.meta.glob);
  console.log(import.meta.hot);
  console.log(import.meta.resolve);
  console.log(import.meta.url);
};
