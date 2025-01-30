import { reactive } from "https://raw.githubusercontent.com/vit-the-jedi/lightweight-reactivity/main/src/index.js";

class testClass {
  constructor() {
    this.test = "test";
    this.__private = "private";
    this.test2 = "test2";
    this.show = true;
    this.__effects = {
      test: {
        updateValue1() {
          document.getElementById("output").innerText = this.test;
          this.test2 = "newValue";
          console.log(`test value updated to`, this.test);
        },
        hello() {
          console.log("heyyyy");
        },
      },
      test2: {
        updateValue() {
          document.getElementById("output2").innerText = this.test2;
          console.log(`test2 value updated to`, this.test2);
          this.test = "newValueFORSUREEE";
        },
      },
      show: {
        toggle() {
          if (this.show) {
            document.querySelector(".show").style.display = "block";
          } else {
            document.querySelector(".show").style.display = "none";
          }
          console.log(`show value updated to`, this.show);
        },
      },
    };
  }
}

const test = reactive(new testClass());
