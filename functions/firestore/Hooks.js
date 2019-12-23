const pre = function(methodName, fn) {
  if (!this.hooks.pre) {
    this.hooks.pre = {};
  }
  // console.log('vcalling static pre function');
  this.hooks['pre'][methodName] = fn;
};

const runHooks = async function(hookType, methodName) {
  const hooks = this.constructor.hooks;
  if (hooks[hookType] && hooks[hookType][methodName]) {
    const fn = hooks[hookType][methodName];
    // console.log(typeof fn);
    // console.log(fn.constructor.name);
    if (typeof fn === 'function') {
      // console.log('its a function');
      if (fn.constructor.name === 'AsyncFunction') {
        // console.log('its async - waiting');
        await fn.call(this);
      } else {
        // console.log('its normal');
        fn.call(this);
      }
    }
  }
};

module.exports = {
  pre,
  runHooks
};
