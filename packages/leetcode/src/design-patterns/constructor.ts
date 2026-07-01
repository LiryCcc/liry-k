/** 构造器模式 */

interface IEmployee {
  name: string;
  age: number;
  say(): void;
}

type EmployeeCtor = new (name: string, age: number) => IEmployee;

export const Employee: EmployeeCtor = function (this: IEmployee, name: string, age: number): void {
  this.name = name;
  this.age = age;
  this.say = () => {
    console.log(`${this.name} ${this.age}`);
  };
} as unknown as EmployeeCtor;

export const e1 = new Employee('k1', 100);
export const e2 = new Employee('k2', 100);
