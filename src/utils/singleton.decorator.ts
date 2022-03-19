export interface Constructor<A extends unknown[] = unknown[], I = unknown> {
  new (...args: A): I;
}

export const SINGLETON_KEY = Symbol('singleton');

export const Singleton = () => {
  return <T extends Constructor>(target: T) => {
    return new Proxy(target, {
      construct(target, argsArray, newTarget) {
        // if class extended or newTarget changed
        if (target.prototype !== newTarget.prototype) {
          return Reflect.construct(target, argsArray, newTarget);
        }

        if (!target[SINGLETON_KEY]) {
          target[SINGLETON_KEY] = Reflect.construct(target, argsArray, newTarget);
        }

        return target[SINGLETON_KEY];
      },
    });
  };
};
