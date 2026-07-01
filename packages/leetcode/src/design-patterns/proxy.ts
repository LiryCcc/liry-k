class Star {
  play(): void {
    console.log('play');
  }
}

export class StarProxy {
  private superStar: Star;

  constructor() {
    this.superStar = new Star();
  }

  talk(price: number): void {
    if (price >= 10000) {
      this.superStar.play();
    } else {
      throw new Error('price is too low');
    }
  }
}

setTimeout(() => {
  console.log('time out');
}, 10000000);

export default StarProxy;
