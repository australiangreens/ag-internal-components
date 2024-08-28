type SuppressionFilter = RegExp | ((...data: unknown[]) => boolean);

type ConsoleFn = 'log' | 'error' | 'warn' | 'info' | 'debug';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const origConsoleFns: Record<ConsoleFn, any> = {
  log: console.warn.bind(console),
  error: console.error.bind(console),
  warn: console.warn.bind(console),
  info: console.info.bind(console),
  debug: console.debug.bind(console),
};

/**
 * If called, will replace the underlying console function with a wrapper that
 * will prevent the original from being called if a filter matches. A filter can
 * either be a regex or a function that returns true on a match.
 *
 * Motivation: Originally implemented to provide a way to suppress the harmless
 * MUI warnings generated by SingleAutocomplete component
 */
export function suppressConsole(fn: ConsoleFn, filters: SuppressionFilter[]) {
  console[fn] = (...data: unknown[]) => {
    // If filtered, skip output
    for (const filter of filters) {
      if (typeof filter === 'function') {
        if (filter(...data)) return;
      } else if (filter instanceof RegExp && data.length > 0) {
        for (const str of data) {
          if (typeof str === 'string' && filter.test(str)) {
            return;
          }
        }
      }
    }
    // Otherwise call original console function
    origConsoleFns[fn](data);
  };
}

/**
 * Reset console[fn] to original. If fn is not specified, resets all functions
 * (log, error, warn, info, debug)
 *
 * NOTE: Unsure if this will work in most cases
 */
export function unsuppressConsole(fn?: ConsoleFn) {
  if (fn) {
    console[fn] = origConsoleFns[fn];
  } else {
    for (const f of Object.keys(origConsoleFns) as ConsoleFn[]) {
      console[f] = origConsoleFns[f];
    }
  }
}