interface Builder {
  init(): void | Promise<void>;
  getData(): Promise<string>;
  render(): void | Promise<void>;
}

class Navbar implements Builder {
  init(): void {
    console.log('navbar-init');
  }

  getData(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('navbar-getData');
      }, 1000);
    });
  }

  render(): void {
    console.log('navbar-render');
  }
}

class List implements Builder {
  init(): void {
    console.log('List-init');
  }

  getData(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('List-getData');
      }, 1000);
    });
  }

  render(): void {
    console.log('List-render');
  }
}

export class Creator {
  async startBuild(builder: Builder): Promise<void> {
    await builder.init();
    await builder.getData();
    await builder.render();
  }
}

const op = new Creator();
op.startBuild(new List());
op.startBuild(new Navbar());
