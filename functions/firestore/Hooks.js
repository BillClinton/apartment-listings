const pre = function(methodName, fn) {
  if (!this.hooks.pre) {
    this.hooks.pre = {};
  }
  this.hooks['pre'][methodName] = fn;
};

const runHooks = async function(hookType, methodName) {
  const hooks = this.constructor.hooks;
  if (hooks[hookType] && hooks[hookType][methodName]) {
    const fn = hooks[hookType][methodName];
    if (typeof fn === 'function') {
      if (fn.constructor.name === 'AsyncFunction') {
        await fn.call(this);
      } else {
        fn.call(this);
      }
    }
  }
};

module.exports = {
  pre,
  runHooks
};
