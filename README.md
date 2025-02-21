# Reactive System README

## Overview
This project uses the basis for Vue 3's reactivity system, and implements a simple reactive system in JavaScript using `Proxy` and `WeakMap`. It enables tracking dependencies of an object's properties and automatically triggers associated effects when those properties change.

## Features
- Creates a reactive proxy object that tracks property access and updates.
- Uses `WeakMap` to store dependencies per target object.
- Triggers effects when observed properties are modified.

## Installation
No external dependencies are required. Simply include the `reactive.js` file in your project and import the `reactive` function.
Alternatively, you can import this project from [jsr.io](https://jsr.io/@vit-the-jedi-tools/lightweight-reactivity)

## Usage
```javascript
import { reactive } from './reactive.js';

const obj = {
count: 0,
message: 'Hello',
__nonReactiveField: 1,
__effects = {
  count: {
    log: function() {
      console.log(`Count changed to: ${reactiveObj.count}`)
      },
    },
  };
};
const reactiveObj = reactive(obj);

// Modifying the property triggers effects
reactiveObj.count = 1; // Logs: "Count changed to: 1"
```
### Important Notes
- The __effects object is used to store associated effects based on your objects properties. It is important to store effects inside a key with the same name as the property you wish to associate your functions with.
- Each function inside the __effects object must be a regular function to enable further reactive updates from inside the function. When the reactive object is made, each function inside effects is bound to the Proxy.
- If an arrow function is used, the function instead binds to the original object, rendering further reactive updates inside the function impossible.

## API
### `reactive(target)`
- Wraps an object with a `Proxy` to track property access and changes.
- Returns a proxy object that enables automatic effect tracking.

### Internal Methods
#### `track(target, key, effects)`
- Stores the dependencies of a specific property in a `WeakMap`.
- Ensures that effects are not duplicated.

#### `trigger(target, key, recieverProxy)`
- Invokes all stored effects for a property when its value is updated.
- Binds effects to the receiver proxy to allow reactive updates.

## How It Works
1. The `reactive` function creates a proxy around the target object.
2. It intercepts property access (`get`) and modification (`set`).
3. The `track` function stores effects associated with object properties.
4. The `trigger` function runs the stored effects when a property changes.
5. Effects are functions stored in an `__effects` object within the target.

## Notes
- Private (`__`-prefixed) and function properties are ignored.
- Effects should be defined in an `__effects` object within the reactive object.
- This implementation does not support deep reactivity.

## License
This project is open-source and available for modification and distribution.

