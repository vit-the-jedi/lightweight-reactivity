(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const targetMap = /* @__PURE__ */ new WeakMap();
function reactive(target, effect) {
  const handler = {
    get(target2, key, reciever) {
      let result = Reflect.get(target2, key, reciever);
      track(target2, key);
      return result;
    },
    set(target2, key, value, reciever) {
      let oldValue = target2[key];
      let result = Reflect.set(target2, key, value, reciever);
      if (result && oldValue !== value) {
        trigger(target2, key);
      }
      return result;
    }
  };
  return new Proxy(target, handler);
}
function track(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, dep = /* @__PURE__ */ new Map());
  }
  if (target.effects) {
    const effects = Object.entries(target.effects());
    effects.forEach((effect) => {
      if (effect[0] === key) {
        dep.set(key, effect[1]);
      }
    });
  }
}
function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let dep = depsMap.get(key);
  if (dep) {
    dep.forEach((effectName) => {
      Object.values(effectName).forEach((effectFn) => {
        effectFn();
      });
    });
  }
}
const modal = reactive({
  open: false,
  clickAction: "Close X",
  content: "Hello, world!",
  effects() {
    return {
      open: {
        toggleVisibility: () => {
          document.querySelector("#total").textContent = this.open ? "Open" : "Closed";
        },
        toggleHello: () => {
          console.log(this.open ? "Hello" : "Goodbye");
        }
      },
      content: {
        updateContent: () => {
          document.querySelector("#modalContent").textContent = this.content;
        }
      }
    };
  }
});
document.querySelector("*[data-action]").addEventListener("click", () => {
  modal.open = !modal.open;
  modal.content = modal.content += Math.random();
});
console.log(modal);
