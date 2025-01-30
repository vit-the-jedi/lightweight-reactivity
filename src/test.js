import { reactive } from "./index.js";

class testClass {
  constructor() {
    this.test = "test";
    this.__private = "private";
    this.test2 = "test2";
  }
  effects() {
    return {
      test: {
        updateValue1: () => {
          document.getElementById("output").innerText = this.test;
          this.test2 = "newValue";
          console.log(`test value updated to`, this.test);
        },
        hello: () => {
          console.log("heyyyy");
        },
      },
      test2: {
        updateValue: () => {
          document.getElementById("output2").innerText = this.test2;
          console.log(`test2 value updated to`, this.test2);
          this.test = "newValueFORSUREEE";
        },
      },
    };
  }
}

const test = reactive(new testClass());

setTimeout(() => {
  test.test = "hello";
  test.test2 = "world";
}, 1000);
