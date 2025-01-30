"use strict";

//create weakmap to store target and its dependencies
//stores depsMap for each target object property
const targetMap = new WeakMap();

//retuns a proxy object that we can use to intercept get + set
//and run effects when the target is accessed
export function reactive(target) {
  //effects() returns an object of methods based on property changes
  let effects = target.effects();
  Object.keys(target).forEach((key) => {
    track(target, key, effects);
  });
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
    Object.entries(effects).forEach((effectObj) => {
      //only get the effects that match the property that was changed
      if (effectObj[0] === key) {
        //save each matching effect to the dep map, organized by property being changed
        dep.set(key, effectObj[1]);
      }
    });
  }
}

//run each effect when target object is accessed
function trigger(target, key, recieverProxy) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let dep = depsMap.get(key);
  console.log(dep);
  if (dep) {
    //run each effect that was saved to the dep map, based on the property that was changed
    dep.forEach((effectName) => {
      //run each effect function
      Object.values(effectName).forEach((fn) => {
        fn = fn.bind(recieverProxy);
        fn();
      });
    });
  }
}
