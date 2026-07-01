class User {
  name: string;
  role: string;
  pages: (string | number)[];

  constructor(name: string, role: string, pages: (string | number)[]) {
    this.name = name;
    this.role = role;
    this.pages = pages;
  }

  welcome(): void {
    console.log(`welcome ${this.name}`);
  }

  dataShow(): void {
    throw new Error('抽象方法需要被实现');
  }
}

export class SuperAdmin extends User {
  constructor(name: string) {
    super(name, 'superAdmin', ['home', 1, 2, 3]);
  }

  override dataShow(): void {
    console.log('superAdmin-dataShow');
  }

  addRight(): void {}

  addUser(): void {}
}

export class Admin extends User {
  constructor(name: string) {
    super(name, 'admin', ['home', 1, 2]);
  }

  addUser(): void {}

  override dataShow(): void {
    console.log('admin-dataShow');
  }
}

export class Editor extends User {
  constructor(name: string) {
    super(name, 'editor', ['home', 1]);
  }

  override dataShow(): void {
    console.log('editor-dataShow');
  }
}

type UserRole = 'superAdmin' | 'admin' | 'editor';
type UserConstructor = new (name: string) => User;

/** 根据传入的职责，return 响应的类 */
export function getAbstractUserFactory(role: UserRole): UserConstructor {
  switch (role) {
    case 'superAdmin':
      return SuperAdmin;
    case 'admin':
      return Admin;
    case 'editor':
      return Editor;
  }
}

const UserClass = getAbstractUserFactory('editor');
export const userInstance = new UserClass('liry');
