interface UserData {
  name: string | undefined;
  age: number | undefined;
}

export const Singleton = (() => {
  let instance: UserData | null = null;

  class User implements UserData {
    name: string | undefined;
    age: number | undefined;

    constructor(name?: string, age?: number) {
      this.name = name;
      this.age = age;
    }
  }

  return (name?: string, age?: number): UserData => {
    if (!instance) {
      instance = new User(name, age);
    }
    return instance;
  };
})();

console.log(Singleton());
