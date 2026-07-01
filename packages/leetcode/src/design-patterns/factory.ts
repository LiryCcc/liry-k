/**
 * 新建用户选择用户权限
 * 如管理员，超级管理员，普通员工等
 * 创建user的工厂
 */

type UserRole = 'superAdmin' | 'admin' | 'user';

/** 每种用户只能看见特定的页面 */
export class User {
  role: UserRole;
  pages: (string | number)[];

  constructor(role: UserRole, pages: (string | number)[]) {
    this.role = role;
    this.pages = pages;
  }

  static UserFactory = (role: UserRole): User => {
    switch (role) {
      case 'superAdmin':
        return new User('superAdmin', ['home', 1, 2, 3]);
      case 'admin':
        return new User('admin', ['home', 1, 2, 3]);
      case 'user':
        return new User('user', ['home', 1, 2, 3]);
    }
  };
}

export default User;
