// eslint-disable-next-line @typescript-eslint/ban-types
export interface Constructor<A extends unknown[] = unknown[], I = {}> {
  new (...args: A): I;
}
