function textToImage(text: string, width = 400, height = 300): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ccc';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#000';
  ctx.font = '20px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  return canvas.toDataURL('image/png');
}

const imageMap = new WeakMap<HTMLImageElement, number>();

const imagesElements = document.querySelectorAll<HTMLImageElement>('.image');
console.log(imagesElements);

const observer = new IntersectionObserver((items) => {
  items.forEach((item) => {
    const image = item.target as HTMLImageElement;
    if (!imageMap.get(image)) {
      const id = Math.random();
      imageMap.set(image, id);
    }
    const dataSrc = image.getAttribute('data-src');
    if (item.isIntersecting) {
      image.src = textToImage('图片加载中');
      const realImg = new Image();
      realImg.src = `${dataSrc}?a=${imageMap.get(image)}`;
      realImg.onload = () => {
        image.src = realImg.src;
      };
      realImg.onerror = () => {
        image.src = textToImage('加载失败');
      };
    } else {
      image.removeAttribute('src');
      image.src = textToImage('图片未加载');
    }
  });
});

imagesElements.forEach((image) => {
  observer.observe(image);
});
