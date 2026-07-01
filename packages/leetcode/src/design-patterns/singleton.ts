export class Singleton {
  name!: number | string;
  age!: number;
  static instance: Singleton | null = null;

  constructor(name: number | string, age: number) {
    if (!Singleton.instance) {
      this.name = name;
      this.age = age;
      Singleton.instance = this;
    }
    return Singleton.instance!;
  }
}

console.log(new Singleton(11, 100) === new Singleton('12', 120));
