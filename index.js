"use strict";

//create weakmap to store target and its dependencies
//stores depsMap for each target object property
const targetMap = new WeakMap();

//retuns a proxy object that we can use to intercept get + set
//and run effects when the target is accessed
export function reactive(target) {
  //effects() returns an object of methods based on property changes
  //object keys prefixed by "__" are considered private and will be ignored
  let effects = target.__effects;
  const keys = Object.keys(target)
    .map((key) => key)
    .filter((key) => !key.includes("__"));
  keys.forEach((key) => track(target, key, effects));
  const handler = {
    get(target, key, reciever) {
      let result = Reflect.get(target, key, reciever);
      return result;
    },
    set(target, key, value, reciever) {
      let oldValue = target[key];
      let result = Reflect.set(target, key, value, reciever);
      if (result && oldValue !== value) {
        trigger(target, key, reciever);
      }
      return result;
    },
  };
  return new Proxy(target, handler);
}

//create a set of unique dependencies to run when target object
//is accessed
let dep = new Set();

//save each effect to re-run later inside of our depsMap
function track(target, key, effects) {
  let depsMap = targetMap.get(target);

  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);

  if (!dep) {
    //Set() wasn't working as each effect was being added multiple times (treated as a unique obj every time)
    depsMap.set(key, (dep = new Map()));
  }
  if (effects) {
    const effectFns = Object.values(effects[key]).map((fn) => fn);
    dep.set(key, effectFns);
  }
}

//run each effect when target object is accessed
function trigger(target, key, recieverProxy) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let dep = depsMap.get(key);
  if (dep) {
    //run each effect that was saved to the dep map, based on the property that was changed
    dep.forEach((effectName) => {
      //run each effect function
      effectName.forEach((fn) => {
        //bind the recieverProxy to the effect function so that we can access the target object
        //this makes the effect function also able to make reactive updates
        fn = fn.bind(recieverProxy);
        fn();
      });
    });
  }
}
