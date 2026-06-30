var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __moduleCache = /* @__PURE__ */ new WeakMap;
var __toCommonJS = (from) => {
  var entry = __moduleCache.get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function")
    __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    }));
  __moduleCache.set(from, entry);
  return entry;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// node_modules/react/cjs/react.development.js
var require_react_development = __commonJS((exports, module) => {
  (function() {
    function defineDeprecationWarning(methodName, info) {
      Object.defineProperty(Component.prototype, methodName, {
        get: function() {
          console.warn("%s(...) is deprecated in plain JavaScript React classes. %s", info[0], info[1]);
        }
      });
    }
    function getIteratorFn(maybeIterable) {
      if (maybeIterable === null || typeof maybeIterable !== "object")
        return null;
      maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
      return typeof maybeIterable === "function" ? maybeIterable : null;
    }
    function warnNoop(publicInstance, callerName) {
      publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
      var warningKey = publicInstance + "." + callerName;
      didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", callerName, publicInstance), didWarnStateUpdateForUnmountedComponent[warningKey] = true);
    }
    function Component(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    function ComponentDummy() {}
    function PureComponent(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    function noop() {}
    function testStringCoercion(value) {
      return "" + value;
    }
    function checkKeyStringCoercion(value) {
      try {
        testStringCoercion(value);
        var JSCompiler_inline_result = false;
      } catch (e) {
        JSCompiler_inline_result = true;
      }
      if (JSCompiler_inline_result) {
        JSCompiler_inline_result = console;
        var JSCompiler_temp_const = JSCompiler_inline_result.error;
        var JSCompiler_inline_result$jscomp$0 = typeof Symbol === "function" && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
        JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
        return testStringCoercion(value);
      }
    }
    function getComponentNameFromType(type) {
      if (type == null)
        return null;
      if (typeof type === "function")
        return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
      if (typeof type === "string")
        return type;
      switch (type) {
        case REACT_FRAGMENT_TYPE:
          return "Fragment";
        case REACT_PROFILER_TYPE:
          return "Profiler";
        case REACT_STRICT_MODE_TYPE:
          return "StrictMode";
        case REACT_SUSPENSE_TYPE:
          return "Suspense";
        case REACT_SUSPENSE_LIST_TYPE:
          return "SuspenseList";
        case REACT_ACTIVITY_TYPE:
          return "Activity";
      }
      if (typeof type === "object")
        switch (typeof type.tag === "number" && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof) {
          case REACT_PORTAL_TYPE:
            return "Portal";
          case REACT_CONTEXT_TYPE:
            return type.displayName || "Context";
          case REACT_CONSUMER_TYPE:
            return (type._context.displayName || "Context") + ".Consumer";
          case REACT_FORWARD_REF_TYPE:
            var innerType = type.render;
            type = type.displayName;
            type || (type = innerType.displayName || innerType.name || "", type = type !== "" ? "ForwardRef(" + type + ")" : "ForwardRef");
            return type;
          case REACT_MEMO_TYPE:
            return innerType = type.displayName || null, innerType !== null ? innerType : getComponentNameFromType(type.type) || "Memo";
          case REACT_LAZY_TYPE:
            innerType = type._payload;
            type = type._init;
            try {
              return getComponentNameFromType(type(innerType));
            } catch (x) {}
        }
      return null;
    }
    function getTaskName(type) {
      if (type === REACT_FRAGMENT_TYPE)
        return "<>";
      if (typeof type === "object" && type !== null && type.$$typeof === REACT_LAZY_TYPE)
        return "<...>";
      try {
        var name = getComponentNameFromType(type);
        return name ? "<" + name + ">" : "<...>";
      } catch (x) {
        return "<...>";
      }
    }
    function getOwner() {
      var dispatcher = ReactSharedInternals.A;
      return dispatcher === null ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
      return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
      if (hasOwnProperty.call(config, "key")) {
        var getter = Object.getOwnPropertyDescriptor(config, "key").get;
        if (getter && getter.isReactWarning)
          return false;
      }
      return config.key !== undefined;
    }
    function defineKeyPropWarningGetter(props, displayName) {
      function warnAboutAccessingKey() {
        specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
      }
      warnAboutAccessingKey.isReactWarning = true;
      Object.defineProperty(props, "key", {
        get: warnAboutAccessingKey,
        configurable: true
      });
    }
    function elementRefGetterWithDeprecationWarning() {
      var componentName = getComponentNameFromType(this.type);
      didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
      componentName = this.props.ref;
      return componentName !== undefined ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
      var refProp = props.ref;
      type = {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        props,
        _owner: owner
      };
      (refProp !== undefined ? refProp : null) !== null ? Object.defineProperty(type, "ref", {
        enumerable: false,
        get: elementRefGetterWithDeprecationWarning
      }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
      type._store = {};
      Object.defineProperty(type._store, "validated", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: 0
      });
      Object.defineProperty(type, "_debugInfo", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: null
      });
      Object.defineProperty(type, "_debugStack", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: debugStack
      });
      Object.defineProperty(type, "_debugTask", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: debugTask
      });
      Object.freeze && (Object.freeze(type.props), Object.freeze(type));
      return type;
    }
    function cloneAndReplaceKey(oldElement, newKey) {
      newKey = ReactElement(oldElement.type, newKey, oldElement.props, oldElement._owner, oldElement._debugStack, oldElement._debugTask);
      oldElement._store && (newKey._store.validated = oldElement._store.validated);
      return newKey;
    }
    function validateChildKeys(node) {
      isValidElement(node) ? node._store && (node._store.validated = 1) : typeof node === "object" && node !== null && node.$$typeof === REACT_LAZY_TYPE && (node._payload.status === "fulfilled" ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
      return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    function escape2(key) {
      var escaperLookup = { "=": "=0", ":": "=2" };
      return "$" + key.replace(/[=:]/g, function(match) {
        return escaperLookup[match];
      });
    }
    function getElementKey(element, index) {
      return typeof element === "object" && element !== null && element.key != null ? (checkKeyStringCoercion(element.key), escape2("" + element.key)) : index.toString(36);
    }
    function resolveThenable(thenable) {
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenable.reason;
        default:
          switch (typeof thenable.status === "string" ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(function(fulfilledValue) {
            thenable.status === "pending" && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
          }, function(error) {
            thenable.status === "pending" && (thenable.status = "rejected", thenable.reason = error);
          })), thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
          }
      }
      throw thenable;
    }
    function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
      var type = typeof children;
      if (type === "undefined" || type === "boolean")
        children = null;
      var invokeCallback = false;
      if (children === null)
        invokeCallback = true;
      else
        switch (type) {
          case "bigint":
          case "string":
          case "number":
            invokeCallback = true;
            break;
          case "object":
            switch (children.$$typeof) {
              case REACT_ELEMENT_TYPE:
              case REACT_PORTAL_TYPE:
                invokeCallback = true;
                break;
              case REACT_LAZY_TYPE:
                return invokeCallback = children._init, mapIntoArray(invokeCallback(children._payload), array, escapedPrefix, nameSoFar, callback);
            }
        }
      if (invokeCallback) {
        invokeCallback = children;
        callback = callback(invokeCallback);
        var childKey = nameSoFar === "" ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
        isArrayImpl(callback) ? (escapedPrefix = "", childKey != null && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
          return c;
        })) : callback != null && (isValidElement(callback) && (callback.key != null && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(callback, escapedPrefix + (callback.key == null || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(userProvidedKeyEscapeRegex, "$&/") + "/") + childKey), nameSoFar !== "" && invokeCallback != null && isValidElement(invokeCallback) && invokeCallback.key == null && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
        return 1;
      }
      invokeCallback = 0;
      childKey = nameSoFar === "" ? "." : nameSoFar + ":";
      if (isArrayImpl(children))
        for (var i = 0;i < children.length; i++)
          nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
      else if (i = getIteratorFn(children), typeof i === "function")
        for (i === children.entries && (didWarnAboutMaps || console.warn("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), didWarnAboutMaps = true), children = i.call(children), i = 0;!(nameSoFar = children.next()).done; )
          nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
      else if (type === "object") {
        if (typeof children.then === "function")
          return mapIntoArray(resolveThenable(children), array, escapedPrefix, nameSoFar, callback);
        array = String(children);
        throw Error("Objects are not valid as a React child (found: " + (array === "[object Object]" ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead.");
      }
      return invokeCallback;
    }
    function mapChildren(children, func, context) {
      if (children == null)
        return children;
      var result = [], count = 0;
      mapIntoArray(children, result, "", "", function(child) {
        return func.call(context, child, count++);
      });
      return result;
    }
    function lazyInitializer(payload) {
      if (payload._status === -1) {
        var ioInfo = payload._ioInfo;
        ioInfo != null && (ioInfo.start = ioInfo.end = performance.now());
        ioInfo = payload._result;
        var thenable = ioInfo();
        thenable.then(function(moduleObject) {
          if (payload._status === 0 || payload._status === -1) {
            payload._status = 1;
            payload._result = moduleObject;
            var _ioInfo = payload._ioInfo;
            _ioInfo != null && (_ioInfo.end = performance.now());
            thenable.status === undefined && (thenable.status = "fulfilled", thenable.value = moduleObject);
          }
        }, function(error) {
          if (payload._status === 0 || payload._status === -1) {
            payload._status = 2;
            payload._result = error;
            var _ioInfo2 = payload._ioInfo;
            _ioInfo2 != null && (_ioInfo2.end = performance.now());
            thenable.status === undefined && (thenable.status = "rejected", thenable.reason = error);
          }
        });
        ioInfo = payload._ioInfo;
        if (ioInfo != null) {
          ioInfo.value = thenable;
          var displayName = thenable.displayName;
          typeof displayName === "string" && (ioInfo.name = displayName);
        }
        payload._status === -1 && (payload._status = 0, payload._result = thenable);
      }
      if (payload._status === 1)
        return ioInfo = payload._result, ioInfo === undefined && console.error(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like:
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, ioInfo), "default" in ioInfo || console.error(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like:
  const MyComponent = lazy(() => import('./MyComponent'))`, ioInfo), ioInfo.default;
      throw payload._result;
    }
    function resolveDispatcher() {
      var dispatcher = ReactSharedInternals.H;
      dispatcher === null && console.error(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.`);
      return dispatcher;
    }
    function releaseAsyncTransition() {
      ReactSharedInternals.asyncTransitions--;
    }
    function enqueueTask(task) {
      if (enqueueTaskImpl === null)
        try {
          var requireString = ("require" + Math.random()).slice(0, 7);
          enqueueTaskImpl = (module && module[requireString]).call(module, "timers").setImmediate;
        } catch (_err) {
          enqueueTaskImpl = function(callback) {
            didWarnAboutMessageChannel === false && (didWarnAboutMessageChannel = true, typeof MessageChannel === "undefined" && console.error("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
            var channel = new MessageChannel;
            channel.port1.onmessage = callback;
            channel.port2.postMessage(undefined);
          };
        }
      return enqueueTaskImpl(task);
    }
    function aggregateErrors(errors) {
      return 1 < errors.length && typeof AggregateError === "function" ? new AggregateError(errors) : errors[0];
    }
    function popActScope(prevActQueue, prevActScopeDepth) {
      prevActScopeDepth !== actScopeDepth - 1 && console.error("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. ");
      actScopeDepth = prevActScopeDepth;
    }
    function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
      var queue = ReactSharedInternals.actQueue;
      if (queue !== null)
        if (queue.length !== 0)
          try {
            flushActQueue(queue);
            enqueueTask(function() {
              return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
            });
            return;
          } catch (error) {
            ReactSharedInternals.thrownErrors.push(error);
          }
        else
          ReactSharedInternals.actQueue = null;
      0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve(returnValue);
    }
    function flushActQueue(queue) {
      if (!isFlushing) {
        isFlushing = true;
        var i = 0;
        try {
          for (;i < queue.length; i++) {
            var callback = queue[i];
            do {
              ReactSharedInternals.didUsePromise = false;
              var continuation = callback(false);
              if (continuation !== null) {
                if (ReactSharedInternals.didUsePromise) {
                  queue[i] = callback;
                  queue.splice(0, i);
                  return;
                }
                callback = continuation;
              } else
                break;
            } while (1);
          }
          queue.length = 0;
        } catch (error) {
          queue.splice(0, i + 1), ReactSharedInternals.thrownErrors.push(error);
        } finally {
          isFlushing = false;
        }
      }
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
      isMounted: function() {
        return false;
      },
      enqueueForceUpdate: function(publicInstance) {
        warnNoop(publicInstance, "forceUpdate");
      },
      enqueueReplaceState: function(publicInstance) {
        warnNoop(publicInstance, "replaceState");
      },
      enqueueSetState: function(publicInstance) {
        warnNoop(publicInstance, "setState");
      }
    }, assign = Object.assign, emptyObject = {};
    Object.freeze(emptyObject);
    Component.prototype.isReactComponent = {};
    Component.prototype.setState = function(partialState, callback) {
      if (typeof partialState !== "object" && typeof partialState !== "function" && partialState != null)
        throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
      this.updater.enqueueSetState(this, partialState, callback, "setState");
    };
    Component.prototype.forceUpdate = function(callback) {
      this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
    };
    var deprecatedAPIs = {
      isMounted: [
        "isMounted",
        "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
      ],
      replaceState: [
        "replaceState",
        "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
      ]
    };
    for (fnName in deprecatedAPIs)
      deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    ComponentDummy.prototype = Component.prototype;
    deprecatedAPIs = PureComponent.prototype = new ComponentDummy;
    deprecatedAPIs.constructor = PureComponent;
    assign(deprecatedAPIs, Component.prototype);
    deprecatedAPIs.isPureReactComponent = true;
    var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = {
      H: null,
      A: null,
      T: null,
      S: null,
      actQueue: null,
      asyncTransitions: 0,
      isBatchingLegacy: false,
      didScheduleLegacyUpdate: false,
      didUsePromise: false,
      thrownErrors: [],
      getCurrentStack: null,
      recentlyCreatedOwnerStacks: 0
    }, hasOwnProperty = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
      return null;
    };
    deprecatedAPIs = {
      react_stack_bottom_frame: function(callStackForError) {
        return callStackForError();
      }
    };
    var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = deprecatedAPIs.react_stack_bottom_frame.bind(deprecatedAPIs, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutMaps = false, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = typeof reportError === "function" ? reportError : function(error) {
      if (typeof window === "object" && typeof window.ErrorEvent === "function") {
        var event = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: typeof error === "object" && error !== null && typeof error.message === "string" ? String(error.message) : String(error),
          error
        });
        if (!window.dispatchEvent(event))
          return;
      } else if (typeof process === "object" && typeof process.emit === "function") {
        process.emit("uncaughtException", error);
        return;
      }
      console.error(error);
    }, didWarnAboutMessageChannel = false, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = false, isFlushing = false, queueSeveralMicrotasks = typeof queueMicrotask === "function" ? function(callback) {
      queueMicrotask(function() {
        return queueMicrotask(callback);
      });
    } : enqueueTask;
    deprecatedAPIs = Object.freeze({
      __proto__: null,
      c: function(size) {
        return resolveDispatcher().useMemoCache(size);
      }
    });
    var fnName = {
      map: mapChildren,
      forEach: function(children, forEachFunc, forEachContext) {
        mapChildren(children, function() {
          forEachFunc.apply(this, arguments);
        }, forEachContext);
      },
      count: function(children) {
        var n = 0;
        mapChildren(children, function() {
          n++;
        });
        return n;
      },
      toArray: function(children) {
        return mapChildren(children, function(child) {
          return child;
        }) || [];
      },
      only: function(children) {
        if (!isValidElement(children))
          throw Error("React.Children.only expected to receive a single React element child.");
        return children;
      }
    };
    exports.Activity = REACT_ACTIVITY_TYPE;
    exports.Children = fnName;
    exports.Component = Component;
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.Profiler = REACT_PROFILER_TYPE;
    exports.PureComponent = PureComponent;
    exports.StrictMode = REACT_STRICT_MODE_TYPE;
    exports.Suspense = REACT_SUSPENSE_TYPE;
    exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
    exports.__COMPILER_RUNTIME = deprecatedAPIs;
    exports.act = function(callback) {
      var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
      actScopeDepth++;
      var queue = ReactSharedInternals.actQueue = prevActQueue !== null ? prevActQueue : [], didAwaitActCall = false;
      try {
        var result = callback();
      } catch (error) {
        ReactSharedInternals.thrownErrors.push(error);
      }
      if (0 < ReactSharedInternals.thrownErrors.length)
        throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
      if (result !== null && typeof result === "object" && typeof result.then === "function") {
        var thenable = result;
        queueSeveralMicrotasks(function() {
          didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
        });
        return {
          then: function(resolve, reject) {
            didAwaitActCall = true;
            thenable.then(function(returnValue) {
              popActScope(prevActQueue, prevActScopeDepth);
              if (prevActScopeDepth === 0) {
                try {
                  flushActQueue(queue), enqueueTask(function() {
                    return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                  });
                } catch (error$0) {
                  ReactSharedInternals.thrownErrors.push(error$0);
                }
                if (0 < ReactSharedInternals.thrownErrors.length) {
                  var _thrownError = aggregateErrors(ReactSharedInternals.thrownErrors);
                  ReactSharedInternals.thrownErrors.length = 0;
                  reject(_thrownError);
                }
              } else
                resolve(returnValue);
            }, function(error) {
              popActScope(prevActQueue, prevActScopeDepth);
              0 < ReactSharedInternals.thrownErrors.length ? (error = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(error)) : reject(error);
            });
          }
        };
      }
      var returnValue$jscomp$0 = result;
      popActScope(prevActQueue, prevActScopeDepth);
      prevActScopeDepth === 0 && (flushActQueue(queue), queue.length !== 0 && queueSeveralMicrotasks(function() {
        didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error("A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"));
      }), ReactSharedInternals.actQueue = null);
      if (0 < ReactSharedInternals.thrownErrors.length)
        throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
      return {
        then: function(resolve, reject) {
          didAwaitActCall = true;
          prevActScopeDepth === 0 ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
            return recursivelyFlushAsyncActWork(returnValue$jscomp$0, resolve, reject);
          })) : resolve(returnValue$jscomp$0);
        }
      };
    };
    exports.cache = function(fn) {
      return function() {
        return fn.apply(null, arguments);
      };
    };
    exports.cacheSignal = function() {
      return null;
    };
    exports.captureOwnerStack = function() {
      var getCurrentStack = ReactSharedInternals.getCurrentStack;
      return getCurrentStack === null ? null : getCurrentStack();
    };
    exports.cloneElement = function(element, config, children) {
      if (element === null || element === undefined)
        throw Error("The argument must be a React element, but you passed " + element + ".");
      var props = assign({}, element.props), key = element.key, owner = element._owner;
      if (config != null) {
        var JSCompiler_inline_result;
        a: {
          if (hasOwnProperty.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(config, "ref").get) && JSCompiler_inline_result.isReactWarning) {
            JSCompiler_inline_result = false;
            break a;
          }
          JSCompiler_inline_result = config.ref !== undefined;
        }
        JSCompiler_inline_result && (owner = getOwner());
        hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
        for (propName in config)
          !hasOwnProperty.call(config, propName) || propName === "key" || propName === "__self" || propName === "__source" || propName === "ref" && config.ref === undefined || (props[propName] = config[propName]);
      }
      var propName = arguments.length - 2;
      if (propName === 1)
        props.children = children;
      else if (1 < propName) {
        JSCompiler_inline_result = Array(propName);
        for (var i = 0;i < propName; i++)
          JSCompiler_inline_result[i] = arguments[i + 2];
        props.children = JSCompiler_inline_result;
      }
      props = ReactElement(element.type, key, props, owner, element._debugStack, element._debugTask);
      for (key = 2;key < arguments.length; key++)
        validateChildKeys(arguments[key]);
      return props;
    };
    exports.createContext = function(defaultValue) {
      defaultValue = {
        $$typeof: REACT_CONTEXT_TYPE,
        _currentValue: defaultValue,
        _currentValue2: defaultValue,
        _threadCount: 0,
        Provider: null,
        Consumer: null
      };
      defaultValue.Provider = defaultValue;
      defaultValue.Consumer = {
        $$typeof: REACT_CONSUMER_TYPE,
        _context: defaultValue
      };
      defaultValue._currentRenderer = null;
      defaultValue._currentRenderer2 = null;
      return defaultValue;
    };
    exports.createElement = function(type, config, children) {
      for (var i = 2;i < arguments.length; i++)
        validateChildKeys(arguments[i]);
      i = {};
      var key = null;
      if (config != null)
        for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = true, console.warn("Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform")), hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key), config)
          hasOwnProperty.call(config, propName) && propName !== "key" && propName !== "__self" && propName !== "__source" && (i[propName] = config[propName]);
      var childrenLength = arguments.length - 2;
      if (childrenLength === 1)
        i.children = children;
      else if (1 < childrenLength) {
        for (var childArray = Array(childrenLength), _i = 0;_i < childrenLength; _i++)
          childArray[_i] = arguments[_i + 2];
        Object.freeze && Object.freeze(childArray);
        i.children = childArray;
      }
      if (type && type.defaultProps)
        for (propName in childrenLength = type.defaultProps, childrenLength)
          i[propName] === undefined && (i[propName] = childrenLength[propName]);
      key && defineKeyPropWarningGetter(i, typeof type === "function" ? type.displayName || type.name || "Unknown" : type);
      var propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
      return ReactElement(type, key, i, getOwner(), propName ? Error("react-stack-top-frame") : unknownOwnerDebugStack, propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
    exports.createRef = function() {
      var refObject = { current: null };
      Object.seal(refObject);
      return refObject;
    };
    exports.forwardRef = function(render) {
      render != null && render.$$typeof === REACT_MEMO_TYPE ? console.error("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof render !== "function" ? console.error("forwardRef requires a render function but was given %s.", render === null ? "null" : typeof render) : render.length !== 0 && render.length !== 2 && console.error("forwardRef render functions accept exactly two parameters: props and ref. %s", render.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined.");
      render != null && render.defaultProps != null && console.error("forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?");
      var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
      Object.defineProperty(elementType, "displayName", {
        enumerable: false,
        configurable: true,
        get: function() {
          return ownName;
        },
        set: function(name) {
          ownName = name;
          render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
        }
      });
      return elementType;
    };
    exports.isValidElement = isValidElement;
    exports.lazy = function(ctor) {
      ctor = { _status: -1, _result: ctor };
      var lazyType = {
        $$typeof: REACT_LAZY_TYPE,
        _payload: ctor,
        _init: lazyInitializer
      }, ioInfo = {
        name: "lazy",
        start: -1,
        end: -1,
        value: null,
        owner: null,
        debugStack: Error("react-stack-top-frame"),
        debugTask: console.createTask ? console.createTask("lazy()") : null
      };
      ctor._ioInfo = ioInfo;
      lazyType._debugInfo = [{ awaited: ioInfo }];
      return lazyType;
    };
    exports.memo = function(type, compare) {
      type == null && console.error("memo: The first argument must be a component. Instead received: %s", type === null ? "null" : typeof type);
      compare = {
        $$typeof: REACT_MEMO_TYPE,
        type,
        compare: compare === undefined ? null : compare
      };
      var ownName;
      Object.defineProperty(compare, "displayName", {
        enumerable: false,
        configurable: true,
        get: function() {
          return ownName;
        },
        set: function(name) {
          ownName = name;
          type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
        }
      });
      return compare;
    };
    exports.startTransition = function(scope) {
      var prevTransition = ReactSharedInternals.T, currentTransition = {};
      currentTransition._updatedFibers = new Set;
      ReactSharedInternals.T = currentTransition;
      try {
        var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
        onStartTransitionFinish !== null && onStartTransitionFinish(currentTransition, returnValue);
        typeof returnValue === "object" && returnValue !== null && typeof returnValue.then === "function" && (ReactSharedInternals.asyncTransitions++, returnValue.then(releaseAsyncTransition, releaseAsyncTransition), returnValue.then(noop, reportGlobalError));
      } catch (error) {
        reportGlobalError(error);
      } finally {
        prevTransition === null && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table.")), prevTransition !== null && currentTransition.types !== null && (prevTransition.types !== null && prevTransition.types !== currentTransition.types && console.error("We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."), prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
      }
    };
    exports.unstable_useCacheRefresh = function() {
      return resolveDispatcher().useCacheRefresh();
    };
    exports.use = function(usable) {
      return resolveDispatcher().use(usable);
    };
    exports.useActionState = function(action, initialState, permalink) {
      return resolveDispatcher().useActionState(action, initialState, permalink);
    };
    exports.useCallback = function(callback, deps) {
      return resolveDispatcher().useCallback(callback, deps);
    };
    exports.useContext = function(Context) {
      var dispatcher = resolveDispatcher();
      Context.$$typeof === REACT_CONSUMER_TYPE && console.error("Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?");
      return dispatcher.useContext(Context);
    };
    exports.useDebugValue = function(value, formatterFn) {
      return resolveDispatcher().useDebugValue(value, formatterFn);
    };
    exports.useDeferredValue = function(value, initialValue) {
      return resolveDispatcher().useDeferredValue(value, initialValue);
    };
    exports.useEffect = function(create, deps) {
      create == null && console.warn("React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?");
      return resolveDispatcher().useEffect(create, deps);
    };
    exports.useEffectEvent = function(callback) {
      return resolveDispatcher().useEffectEvent(callback);
    };
    exports.useId = function() {
      return resolveDispatcher().useId();
    };
    exports.useImperativeHandle = function(ref, create, deps) {
      return resolveDispatcher().useImperativeHandle(ref, create, deps);
    };
    exports.useInsertionEffect = function(create, deps) {
      create == null && console.warn("React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?");
      return resolveDispatcher().useInsertionEffect(create, deps);
    };
    exports.useLayoutEffect = function(create, deps) {
      create == null && console.warn("React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?");
      return resolveDispatcher().useLayoutEffect(create, deps);
    };
    exports.useMemo = function(create, deps) {
      return resolveDispatcher().useMemo(create, deps);
    };
    exports.useOptimistic = function(passthrough, reducer) {
      return resolveDispatcher().useOptimistic(passthrough, reducer);
    };
    exports.useReducer = function(reducer, initialArg, init) {
      return resolveDispatcher().useReducer(reducer, initialArg, init);
    };
    exports.useRef = function(initialValue) {
      return resolveDispatcher().useRef(initialValue);
    };
    exports.useState = function(initialState) {
      return resolveDispatcher().useState(initialState);
    };
    exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
      return resolveDispatcher().useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    };
    exports.useTransition = function() {
      return resolveDispatcher().useTransition();
    };
    exports.version = "19.2.4";
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })();
});

// node_modules/react/index.js
var require_react = __commonJS((exports, module) => {
  var react_development = __toESM(require_react_development(), 1);
  if (false) {} else {
    module.exports = react_development;
  }
});

// node_modules/react/cjs/react-jsx-runtime.development.js
var require_react_jsx_runtime_development = __commonJS((exports) => {
  var React = __toESM(require_react(), 1);
  (function() {
    function getComponentNameFromType(type) {
      if (type == null)
        return null;
      if (typeof type === "function")
        return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
      if (typeof type === "string")
        return type;
      switch (type) {
        case REACT_FRAGMENT_TYPE:
          return "Fragment";
        case REACT_PROFILER_TYPE:
          return "Profiler";
        case REACT_STRICT_MODE_TYPE:
          return "StrictMode";
        case REACT_SUSPENSE_TYPE:
          return "Suspense";
        case REACT_SUSPENSE_LIST_TYPE:
          return "SuspenseList";
        case REACT_ACTIVITY_TYPE:
          return "Activity";
      }
      if (typeof type === "object")
        switch (typeof type.tag === "number" && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof) {
          case REACT_PORTAL_TYPE:
            return "Portal";
          case REACT_CONTEXT_TYPE:
            return type.displayName || "Context";
          case REACT_CONSUMER_TYPE:
            return (type._context.displayName || "Context") + ".Consumer";
          case REACT_FORWARD_REF_TYPE:
            var innerType = type.render;
            type = type.displayName;
            type || (type = innerType.displayName || innerType.name || "", type = type !== "" ? "ForwardRef(" + type + ")" : "ForwardRef");
            return type;
          case REACT_MEMO_TYPE:
            return innerType = type.displayName || null, innerType !== null ? innerType : getComponentNameFromType(type.type) || "Memo";
          case REACT_LAZY_TYPE:
            innerType = type._payload;
            type = type._init;
            try {
              return getComponentNameFromType(type(innerType));
            } catch (x) {}
        }
      return null;
    }
    function testStringCoercion(value) {
      return "" + value;
    }
    function checkKeyStringCoercion(value) {
      try {
        testStringCoercion(value);
        var JSCompiler_inline_result = false;
      } catch (e) {
        JSCompiler_inline_result = true;
      }
      if (JSCompiler_inline_result) {
        JSCompiler_inline_result = console;
        var JSCompiler_temp_const = JSCompiler_inline_result.error;
        var JSCompiler_inline_result$jscomp$0 = typeof Symbol === "function" && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
        JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
        return testStringCoercion(value);
      }
    }
    function getTaskName(type) {
      if (type === REACT_FRAGMENT_TYPE)
        return "<>";
      if (typeof type === "object" && type !== null && type.$$typeof === REACT_LAZY_TYPE)
        return "<...>";
      try {
        var name = getComponentNameFromType(type);
        return name ? "<" + name + ">" : "<...>";
      } catch (x) {
        return "<...>";
      }
    }
    function getOwner() {
      var dispatcher = ReactSharedInternals.A;
      return dispatcher === null ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
      return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
      if (hasOwnProperty.call(config, "key")) {
        var getter = Object.getOwnPropertyDescriptor(config, "key").get;
        if (getter && getter.isReactWarning)
          return false;
      }
      return config.key !== undefined;
    }
    function defineKeyPropWarningGetter(props, displayName) {
      function warnAboutAccessingKey() {
        specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
      }
      warnAboutAccessingKey.isReactWarning = true;
      Object.defineProperty(props, "key", {
        get: warnAboutAccessingKey,
        configurable: true
      });
    }
    function elementRefGetterWithDeprecationWarning() {
      var componentName = getComponentNameFromType(this.type);
      didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
      componentName = this.props.ref;
      return componentName !== undefined ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
      var refProp = props.ref;
      type = {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        props,
        _owner: owner
      };
      (refProp !== undefined ? refProp : null) !== null ? Object.defineProperty(type, "ref", {
        enumerable: false,
        get: elementRefGetterWithDeprecationWarning
      }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
      type._store = {};
      Object.defineProperty(type._store, "validated", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: 0
      });
      Object.defineProperty(type, "_debugInfo", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: null
      });
      Object.defineProperty(type, "_debugStack", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: debugStack
      });
      Object.defineProperty(type, "_debugTask", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: debugTask
      });
      Object.freeze && (Object.freeze(type.props), Object.freeze(type));
      return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
      var children = config.children;
      if (children !== undefined)
        if (isStaticChildren)
          if (isArrayImpl(children)) {
            for (isStaticChildren = 0;isStaticChildren < children.length; isStaticChildren++)
              validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
          } else
            console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else
          validateChildKeys(children);
      if (hasOwnProperty.call(config, "key")) {
        children = getComponentNameFromType(type);
        var keys = Object.keys(config).filter(function(k) {
          return k !== "key";
        });
        isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
        didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = true);
      }
      children = null;
      maybeKey !== undefined && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
      hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
      if ("key" in config) {
        maybeKey = {};
        for (var propName in config)
          propName !== "key" && (maybeKey[propName] = config[propName]);
      } else
        maybeKey = config;
      children && defineKeyPropWarningGetter(maybeKey, typeof type === "function" ? type.displayName || type.name || "Unknown" : type);
      return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
      isValidElement(node) ? node._store && (node._store.validated = 1) : typeof node === "object" && node !== null && node.$$typeof === REACT_LAZY_TYPE && (node._payload.status === "fulfilled" ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
      return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
      return null;
    };
    React = {
      react_stack_bottom_frame: function(callStackForError) {
        return callStackForError();
      }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsx = function(type, config, maybeKey) {
      var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
      return jsxDEVImpl(type, config, maybeKey, false, trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
    exports.jsxs = function(type, config, maybeKey) {
      var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
      return jsxDEVImpl(type, config, maybeKey, true, trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
  })();
});

// node_modules/react/jsx-runtime.js
var require_jsx_runtime = __commonJS((exports, module) => {
  var react_jsx_runtime_development = __toESM(require_react_jsx_runtime_development(), 1);
  if (false) {} else {
    module.exports = react_jsx_runtime_development;
  }
});

// node_modules/framer-motion/dist/es/context/LayoutGroupContext.mjs
var import_react, LayoutGroupContext;
var init_LayoutGroupContext = __esm(() => {
  import_react = __toESM(require_react(), 1);
  "use client";
  LayoutGroupContext = import_react.createContext({});
});

// node_modules/framer-motion/dist/es/utils/use-constant.mjs
function useConstant(init) {
  const ref = import_react2.useRef(null);
  if (ref.current === null) {
    ref.current = init();
  }
  return ref.current;
}
var import_react2;
var init_use_constant = __esm(() => {
  import_react2 = __toESM(require_react(), 1);
  "use client";
});

// node_modules/framer-motion/dist/es/utils/is-browser.mjs
var isBrowser;
var init_is_browser = __esm(() => {
  isBrowser = typeof window !== "undefined";
});

// node_modules/framer-motion/dist/es/utils/use-isomorphic-effect.mjs
var import_react3, useIsomorphicLayoutEffect;
var init_use_isomorphic_effect = __esm(() => {
  import_react3 = __toESM(require_react(), 1);
  init_is_browser();
  "use client";
  useIsomorphicLayoutEffect = isBrowser ? import_react3.useLayoutEffect : import_react3.useEffect;
});

// node_modules/framer-motion/dist/es/context/PresenceContext.mjs
var import_react4, PresenceContext;
var init_PresenceContext = __esm(() => {
  import_react4 = __toESM(require_react(), 1);
  "use client";
  PresenceContext = /* @__PURE__ */ import_react4.createContext(null);
});

// node_modules/motion-utils/dist/es/array.mjs
function addUniqueItem(arr, item) {
  if (arr.indexOf(item) === -1)
    arr.push(item);
}
function removeItem(arr, item) {
  const index = arr.indexOf(item);
  if (index > -1)
    arr.splice(index, 1);
}
var init_array = () => {};

// node_modules/motion-utils/dist/es/clamp.mjs
var clamp = (min, max, v) => {
  if (v > max)
    return max;
  if (v < min)
    return min;
  return v;
};
var init_clamp = () => {};

// node_modules/motion-utils/dist/es/format-error-message.mjs
function formatErrorMessage(message, errorCode) {
  return errorCode ? `${message}. For more information and steps for solving, visit https://motion.dev/troubleshooting/${errorCode}` : message;
}
var init_format_error_message = () => {};

// node_modules/motion-utils/dist/es/errors.mjs
var warning = () => {}, invariant = () => {};
var init_errors = __esm(() => {
  init_format_error_message();
  if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
    warning = (check, message, errorCode) => {
      if (!check && typeof console !== "undefined") {
        console.warn(formatErrorMessage(message, errorCode));
      }
    };
    invariant = (check, message, errorCode) => {
      if (!check) {
        throw new Error(formatErrorMessage(message, errorCode));
      }
    };
  }
});

// node_modules/motion-utils/dist/es/global-config.mjs
var MotionGlobalConfig;
var init_global_config = __esm(() => {
  MotionGlobalConfig = {};
});

// node_modules/motion-utils/dist/es/is-numerical-string.mjs
var isNumericalString = (v) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(v);
var init_is_numerical_string = () => {};

// node_modules/motion-utils/dist/es/is-object.mjs
function isObject(value) {
  return typeof value === "object" && value !== null;
}
var init_is_object = () => {};

// node_modules/motion-utils/dist/es/is-zero-value-string.mjs
var isZeroValueString = (v) => /^0[^.\s]+$/u.test(v);
var init_is_zero_value_string = () => {};

// node_modules/motion-utils/dist/es/memo.mjs
function memo(callback) {
  let result;
  return () => {
    if (result === undefined)
      result = callback();
    return result;
  };
}
var init_memo = () => {};

// node_modules/motion-utils/dist/es/noop.mjs
var noop = (any) => any;
var init_noop = () => {};

// node_modules/motion-utils/dist/es/pipe.mjs
var combineFunctions = (a, b) => (v) => b(a(v)), pipe = (...transformers) => transformers.reduce(combineFunctions);
var init_pipe = () => {};

// node_modules/motion-utils/dist/es/progress.mjs
var progress = (from, to, value) => {
  const toFromDifference = to - from;
  return toFromDifference === 0 ? 1 : (value - from) / toFromDifference;
};
var init_progress = () => {};

// node_modules/motion-utils/dist/es/subscription-manager.mjs
class SubscriptionManager {
  constructor() {
    this.subscriptions = [];
  }
  add(handler) {
    addUniqueItem(this.subscriptions, handler);
    return () => removeItem(this.subscriptions, handler);
  }
  notify(a, b, c) {
    const numSubscriptions = this.subscriptions.length;
    if (!numSubscriptions)
      return;
    if (numSubscriptions === 1) {
      this.subscriptions[0](a, b, c);
    } else {
      for (let i = 0;i < numSubscriptions; i++) {
        const handler = this.subscriptions[i];
        handler && handler(a, b, c);
      }
    }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
var init_subscription_manager = __esm(() => {
  init_array();
});

// node_modules/motion-utils/dist/es/time-conversion.mjs
var secondsToMilliseconds = (seconds) => seconds * 1000, millisecondsToSeconds = (milliseconds) => milliseconds / 1000;
var init_time_conversion = () => {};

// node_modules/motion-utils/dist/es/velocity-per-second.mjs
function velocityPerSecond(velocity, frameDuration) {
  return frameDuration ? velocity * (1000 / frameDuration) : 0;
}
var init_velocity_per_second = () => {};

// node_modules/motion-utils/dist/es/warn-once.mjs
function warnOnce(condition, message, errorCode) {
  if (condition || warned.has(message))
    return;
  console.warn(formatErrorMessage(message, errorCode));
  warned.add(message);
}
var warned;
var init_warn_once = __esm(() => {
  init_format_error_message();
  warned = new Set;
});

// node_modules/motion-utils/dist/es/wrap.mjs
var wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((v - min) % rangeSize + rangeSize) % rangeSize + min;
};
var init_wrap = () => {};

// node_modules/motion-utils/dist/es/easing/cubic-bezier.mjs
function binarySubdivide(x, lowerBound, upperBound, mX1, mX2) {
  let currentX;
  let currentT;
  let i = 0;
  do {
    currentT = lowerBound + (upperBound - lowerBound) / 2;
    currentX = calcBezier(currentT, mX1, mX2) - x;
    if (currentX > 0) {
      upperBound = currentT;
    } else {
      lowerBound = currentT;
    }
  } while (Math.abs(currentX) > subdivisionPrecision && ++i < subdivisionMaxIterations);
  return currentT;
}
function cubicBezier(mX1, mY1, mX2, mY2) {
  if (mX1 === mY1 && mX2 === mY2)
    return noop;
  const getTForX = (aX) => binarySubdivide(aX, 0, 1, mX1, mX2);
  return (t) => t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2);
}
var calcBezier = (t, a1, a2) => (((1 - 3 * a2 + 3 * a1) * t + (3 * a2 - 6 * a1)) * t + 3 * a1) * t, subdivisionPrecision = 0.0000001, subdivisionMaxIterations = 12;
var init_cubic_bezier = __esm(() => {
  init_noop();
});

// node_modules/motion-utils/dist/es/easing/modifiers/mirror.mjs
var mirrorEasing = (easing) => (p) => p <= 0.5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2;
var init_mirror = () => {};

// node_modules/motion-utils/dist/es/easing/modifiers/reverse.mjs
var reverseEasing = (easing) => (p) => 1 - easing(1 - p);
var init_reverse = () => {};

// node_modules/motion-utils/dist/es/easing/back.mjs
var backOut, backIn, backInOut;
var init_back = __esm(() => {
  init_cubic_bezier();
  init_mirror();
  init_reverse();
  backOut = /* @__PURE__ */ cubicBezier(0.33, 1.53, 0.69, 0.99);
  backIn = /* @__PURE__ */ reverseEasing(backOut);
  backInOut = /* @__PURE__ */ mirrorEasing(backIn);
});

// node_modules/motion-utils/dist/es/easing/anticipate.mjs
var anticipate = (p) => p >= 1 ? 1 : (p *= 2) < 1 ? 0.5 * backIn(p) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
var init_anticipate = __esm(() => {
  init_back();
});

// node_modules/motion-utils/dist/es/easing/circ.mjs
var circIn = (p) => 1 - Math.sin(Math.acos(p)), circOut, circInOut;
var init_circ = __esm(() => {
  init_mirror();
  init_reverse();
  circOut = reverseEasing(circIn);
  circInOut = mirrorEasing(circIn);
});

// node_modules/motion-utils/dist/es/easing/ease.mjs
var easeIn, easeOut, easeInOut;
var init_ease = __esm(() => {
  init_cubic_bezier();
  easeIn = /* @__PURE__ */ cubicBezier(0.42, 0, 1, 1);
  easeOut = /* @__PURE__ */ cubicBezier(0, 0, 0.58, 1);
  easeInOut = /* @__PURE__ */ cubicBezier(0.42, 0, 0.58, 1);
});

// node_modules/motion-utils/dist/es/easing/utils/is-easing-array.mjs
var isEasingArray = (ease) => {
  return Array.isArray(ease) && typeof ease[0] !== "number";
};
var init_is_easing_array = () => {};

// node_modules/motion-utils/dist/es/easing/utils/get-easing-for-segment.mjs
function getEasingForSegment(easing, i) {
  return isEasingArray(easing) ? easing[wrap(0, easing.length, i)] : easing;
}
var init_get_easing_for_segment = __esm(() => {
  init_wrap();
  init_is_easing_array();
});

// node_modules/motion-utils/dist/es/easing/utils/is-bezier-definition.mjs
var isBezierDefinition = (easing) => Array.isArray(easing) && typeof easing[0] === "number";
var init_is_bezier_definition = () => {};

// node_modules/motion-utils/dist/es/easing/utils/map.mjs
var easingLookup, isValidEasing = (easing) => {
  return typeof easing === "string";
}, easingDefinitionToFunction = (definition) => {
  if (isBezierDefinition(definition)) {
    invariant(definition.length === 4, `Cubic bezier arrays must contain four numerical values.`, "cubic-bezier-length");
    const [x1, y1, x2, y2] = definition;
    return cubicBezier(x1, y1, x2, y2);
  } else if (isValidEasing(definition)) {
    invariant(easingLookup[definition] !== undefined, `Invalid easing type '${definition}'`, "invalid-easing-type");
    return easingLookup[definition];
  }
  return definition;
};
var init_map = __esm(() => {
  init_errors();
  init_noop();
  init_anticipate();
  init_back();
  init_circ();
  init_cubic_bezier();
  init_ease();
  init_is_bezier_definition();
  easingLookup = {
    linear: noop,
    easeIn,
    easeInOut,
    easeOut,
    circIn,
    circInOut,
    circOut,
    backIn,
    backInOut,
    backOut,
    anticipate
  };
});

// node_modules/motion-utils/dist/es/index.mjs
var init_es = __esm(() => {
  init_array();
  init_clamp();
  init_errors();
  init_global_config();
  init_is_numerical_string();
  init_is_object();
  init_is_zero_value_string();
  init_memo();
  init_noop();
  init_pipe();
  init_progress();
  init_subscription_manager();
  init_time_conversion();
  init_velocity_per_second();
  init_warn_once();
  init_anticipate();
  init_back();
  init_circ();
  init_ease();
  init_get_easing_for_segment();
  init_is_bezier_definition();
  init_is_easing_array();
  init_map();
});

// node_modules/motion-dom/dist/es/frameloop/order.mjs
var stepsOrder;
var init_order = __esm(() => {
  stepsOrder = [
    "setup",
    "read",
    "resolveKeyframes",
    "preUpdate",
    "update",
    "preRender",
    "render",
    "postRender"
  ];
});

// node_modules/motion-dom/dist/es/stats/buffer.mjs
var statsBuffer;
var init_buffer = __esm(() => {
  statsBuffer = {
    value: null,
    addProjectionMetrics: null
  };
});

// node_modules/motion-dom/dist/es/frameloop/render-step.mjs
function createRenderStep(runNextFrame, stepName) {
  let thisFrame = new Set;
  let nextFrame = new Set;
  let isProcessing = false;
  let flushNextFrame = false;
  const toKeepAlive = new WeakSet;
  let latestFrameData = {
    delta: 0,
    timestamp: 0,
    isProcessing: false
  };
  let numCalls = 0;
  function triggerCallback(callback) {
    if (toKeepAlive.has(callback)) {
      step.schedule(callback);
      runNextFrame();
    }
    numCalls++;
    callback(latestFrameData);
  }
  const step = {
    schedule: (callback, keepAlive = false, immediate = false) => {
      const addToCurrentFrame = immediate && isProcessing;
      const queue = addToCurrentFrame ? thisFrame : nextFrame;
      if (keepAlive)
        toKeepAlive.add(callback);
      queue.add(callback);
      return callback;
    },
    cancel: (callback) => {
      nextFrame.delete(callback);
      toKeepAlive.delete(callback);
    },
    process: (frameData) => {
      latestFrameData = frameData;
      if (isProcessing) {
        flushNextFrame = true;
        return;
      }
      isProcessing = true;
      const prevFrame = thisFrame;
      thisFrame = nextFrame;
      nextFrame = prevFrame;
      thisFrame.forEach(triggerCallback);
      if (stepName && statsBuffer.value) {
        statsBuffer.value.frameloop[stepName].push(numCalls);
      }
      numCalls = 0;
      thisFrame.clear();
      isProcessing = false;
      if (flushNextFrame) {
        flushNextFrame = false;
        step.process(frameData);
      }
    }
  };
  return step;
}
var init_render_step = __esm(() => {
  init_buffer();
});

// node_modules/motion-dom/dist/es/frameloop/batcher.mjs
function createRenderBatcher(scheduleNextBatch, allowKeepAlive) {
  let runNextFrame = false;
  let useDefaultElapsed = true;
  const state = {
    delta: 0,
    timestamp: 0,
    isProcessing: false
  };
  const flagRunNextFrame = () => runNextFrame = true;
  const steps = stepsOrder.reduce((acc, key) => {
    acc[key] = createRenderStep(flagRunNextFrame, allowKeepAlive ? key : undefined);
    return acc;
  }, {});
  const { setup, read, resolveKeyframes, preUpdate, update, preRender, render, postRender } = steps;
  const processBatch = () => {
    const useManualTiming = MotionGlobalConfig.useManualTiming;
    const timestamp = useManualTiming ? state.timestamp : performance.now();
    runNextFrame = false;
    if (!useManualTiming) {
      state.delta = useDefaultElapsed ? 1000 / 60 : Math.max(Math.min(timestamp - state.timestamp, maxElapsed), 1);
    }
    state.timestamp = timestamp;
    state.isProcessing = true;
    setup.process(state);
    read.process(state);
    resolveKeyframes.process(state);
    preUpdate.process(state);
    update.process(state);
    preRender.process(state);
    render.process(state);
    postRender.process(state);
    state.isProcessing = false;
    if (runNextFrame && allowKeepAlive) {
      useDefaultElapsed = false;
      scheduleNextBatch(processBatch);
    }
  };
  const wake = () => {
    runNextFrame = true;
    useDefaultElapsed = true;
    if (!state.isProcessing) {
      scheduleNextBatch(processBatch);
    }
  };
  const schedule = stepsOrder.reduce((acc, key) => {
    const step = steps[key];
    acc[key] = (process2, keepAlive = false, immediate = false) => {
      if (!runNextFrame)
        wake();
      return step.schedule(process2, keepAlive, immediate);
    };
    return acc;
  }, {});
  const cancel = (process2) => {
    for (let i = 0;i < stepsOrder.length; i++) {
      steps[stepsOrder[i]].cancel(process2);
    }
  };
  return { schedule, cancel, state, steps };
}
var maxElapsed = 40;
var init_batcher = __esm(() => {
  init_es();
  init_order();
  init_render_step();
});

// node_modules/motion-dom/dist/es/frameloop/frame.mjs
var frame, cancelFrame, frameData, frameSteps;
var init_frame = __esm(() => {
  init_es();
  init_batcher();
  ({ schedule: frame, cancel: cancelFrame, state: frameData, steps: frameSteps } = /* @__PURE__ */ createRenderBatcher(typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : noop, true));
});

// node_modules/motion-dom/dist/es/frameloop/sync-time.mjs
function clearTime() {
  now = undefined;
}
var now, time;
var init_sync_time = __esm(() => {
  init_es();
  init_frame();
  time = {
    now: () => {
      if (now === undefined) {
        time.set(frameData.isProcessing || MotionGlobalConfig.useManualTiming ? frameData.timestamp : performance.now());
      }
      return now;
    },
    set: (newTime) => {
      now = newTime;
      queueMicrotask(clearTime);
    }
  };
});

// node_modules/motion-dom/dist/es/stats/animation-count.mjs
var activeAnimations;
var init_animation_count = __esm(() => {
  activeAnimations = {
    layout: 0,
    mainThread: 0,
    waapi: 0
  };
});

// node_modules/motion-dom/dist/es/animation/utils/is-css-variable.mjs
function containsCSSVariable(value) {
  if (typeof value !== "string")
    return false;
  return value.split("/*")[0].includes("var(--");
}
var checkStringStartsWith = (token) => (key) => typeof key === "string" && key.startsWith(token), isCSSVariableName, startsAsVariableToken, isCSSVariableToken = (value) => {
  const startsWithToken = startsAsVariableToken(value);
  if (!startsWithToken)
    return false;
  return singleCssVariableRegex.test(value.split("/*")[0].trim());
}, singleCssVariableRegex;
var init_is_css_variable = __esm(() => {
  isCSSVariableName = /* @__PURE__ */ checkStringStartsWith("--");
  startsAsVariableToken = /* @__PURE__ */ checkStringStartsWith("var(--");
  singleCssVariableRegex = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
});

// node_modules/motion-dom/dist/es/value/types/numbers/index.mjs
var number, alpha, scale;
var init_numbers = __esm(() => {
  init_es();
  number = {
    test: (v) => typeof v === "number",
    parse: parseFloat,
    transform: (v) => v
  };
  alpha = {
    ...number,
    transform: (v) => clamp(0, 1, v)
  };
  scale = {
    ...number,
    default: 1
  };
});

// node_modules/motion-dom/dist/es/value/types/utils/sanitize.mjs
var sanitize = (v) => Math.round(v * 1e5) / 1e5;
var init_sanitize = () => {};

// node_modules/motion-dom/dist/es/value/types/utils/float-regex.mjs
var floatRegex;
var init_float_regex = __esm(() => {
  floatRegex = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
});

// node_modules/motion-dom/dist/es/value/types/utils/is-nullish.mjs
function isNullish(v) {
  return v == null;
}
var init_is_nullish = () => {};

// node_modules/motion-dom/dist/es/value/types/utils/single-color-regex.mjs
var singleColorRegex;
var init_single_color_regex = __esm(() => {
  singleColorRegex = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu;
});

// node_modules/motion-dom/dist/es/value/types/color/utils.mjs
var isColorString = (type, testProp) => (v) => {
  return Boolean(typeof v === "string" && singleColorRegex.test(v) && v.startsWith(type) || testProp && !isNullish(v) && Object.prototype.hasOwnProperty.call(v, testProp));
}, splitColor = (aName, bName, cName) => (v) => {
  if (typeof v !== "string")
    return v;
  const [a, b, c, alpha2] = v.match(floatRegex);
  return {
    [aName]: parseFloat(a),
    [bName]: parseFloat(b),
    [cName]: parseFloat(c),
    alpha: alpha2 !== undefined ? parseFloat(alpha2) : 1
  };
};
var init_utils = __esm(() => {
  init_float_regex();
  init_is_nullish();
  init_single_color_regex();
});

// node_modules/motion-dom/dist/es/value/types/color/rgba.mjs
var clampRgbUnit = (v) => clamp(0, 255, v), rgbUnit, rgba;
var init_rgba = __esm(() => {
  init_es();
  init_numbers();
  init_sanitize();
  init_utils();
  rgbUnit = {
    ...number,
    transform: (v) => Math.round(clampRgbUnit(v))
  };
  rgba = {
    test: /* @__PURE__ */ isColorString("rgb", "red"),
    parse: /* @__PURE__ */ splitColor("red", "green", "blue"),
    transform: ({ red, green, blue, alpha: alpha$1 = 1 }) => "rgba(" + rgbUnit.transform(red) + ", " + rgbUnit.transform(green) + ", " + rgbUnit.transform(blue) + ", " + sanitize(alpha.transform(alpha$1)) + ")"
  };
});

// node_modules/motion-dom/dist/es/value/types/color/hex.mjs
function parseHex(v) {
  let r = "";
  let g = "";
  let b = "";
  let a = "";
  if (v.length > 5) {
    r = v.substring(1, 3);
    g = v.substring(3, 5);
    b = v.substring(5, 7);
    a = v.substring(7, 9);
  } else {
    r = v.substring(1, 2);
    g = v.substring(2, 3);
    b = v.substring(3, 4);
    a = v.substring(4, 5);
    r += r;
    g += g;
    b += b;
    a += a;
  }
  return {
    red: parseInt(r, 16),
    green: parseInt(g, 16),
    blue: parseInt(b, 16),
    alpha: a ? parseInt(a, 16) / 255 : 1
  };
}
var hex;
var init_hex = __esm(() => {
  init_rgba();
  init_utils();
  hex = {
    test: /* @__PURE__ */ isColorString("#"),
    parse: parseHex,
    transform: rgba.transform
  };
});

// node_modules/motion-dom/dist/es/value/types/numbers/units.mjs
var createUnitType = (unit) => ({
  test: (v) => typeof v === "string" && v.endsWith(unit) && v.split(" ").length === 1,
  parse: parseFloat,
  transform: (v) => `${v}${unit}`
}), degrees, percent, px, vh, vw, progressPercentage;
var init_units = __esm(() => {
  degrees = /* @__PURE__ */ createUnitType("deg");
  percent = /* @__PURE__ */ createUnitType("%");
  px = /* @__PURE__ */ createUnitType("px");
  vh = /* @__PURE__ */ createUnitType("vh");
  vw = /* @__PURE__ */ createUnitType("vw");
  progressPercentage = /* @__PURE__ */ (() => ({
    ...percent,
    parse: (v) => percent.parse(v) / 100,
    transform: (v) => percent.transform(v * 100)
  }))();
});

// node_modules/motion-dom/dist/es/value/types/color/hsla.mjs
var hsla;
var init_hsla = __esm(() => {
  init_numbers();
  init_units();
  init_sanitize();
  init_utils();
  hsla = {
    test: /* @__PURE__ */ isColorString("hsl", "hue"),
    parse: /* @__PURE__ */ splitColor("hue", "saturation", "lightness"),
    transform: ({ hue, saturation, lightness, alpha: alpha$1 = 1 }) => {
      return "hsla(" + Math.round(hue) + ", " + percent.transform(sanitize(saturation)) + ", " + percent.transform(sanitize(lightness)) + ", " + sanitize(alpha.transform(alpha$1)) + ")";
    }
  };
});

// node_modules/motion-dom/dist/es/value/types/color/index.mjs
var color;
var init_color = __esm(() => {
  init_hex();
  init_hsla();
  init_rgba();
  color = {
    test: (v) => rgba.test(v) || hex.test(v) || hsla.test(v),
    parse: (v) => {
      if (rgba.test(v)) {
        return rgba.parse(v);
      } else if (hsla.test(v)) {
        return hsla.parse(v);
      } else {
        return hex.parse(v);
      }
    },
    transform: (v) => {
      return typeof v === "string" ? v : v.hasOwnProperty("red") ? rgba.transform(v) : hsla.transform(v);
    },
    getAnimatableNone: (v) => {
      const parsed = color.parse(v);
      parsed.alpha = 0;
      return color.transform(parsed);
    }
  };
});

// node_modules/motion-dom/dist/es/value/types/utils/color-regex.mjs
var colorRegex;
var init_color_regex = __esm(() => {
  colorRegex = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
});

// node_modules/motion-dom/dist/es/value/types/complex/index.mjs
function test(v) {
  return isNaN(v) && typeof v === "string" && (v.match(floatRegex)?.length || 0) + (v.match(colorRegex)?.length || 0) > 0;
}
function analyseComplexValue(value) {
  const originalValue = value.toString();
  const values = [];
  const indexes = {
    color: [],
    number: [],
    var: []
  };
  const types = [];
  let i = 0;
  const tokenised = originalValue.replace(complexRegex, (parsedValue) => {
    if (color.test(parsedValue)) {
      indexes.color.push(i);
      types.push(COLOR_TOKEN);
      values.push(color.parse(parsedValue));
    } else if (parsedValue.startsWith(VAR_FUNCTION_TOKEN)) {
      indexes.var.push(i);
      types.push(VAR_TOKEN);
      values.push(parsedValue);
    } else {
      indexes.number.push(i);
      types.push(NUMBER_TOKEN);
      values.push(parseFloat(parsedValue));
    }
    ++i;
    return SPLIT_TOKEN;
  });
  const split = tokenised.split(SPLIT_TOKEN);
  return { values, split, indexes, types };
}
function parseComplexValue(v) {
  return analyseComplexValue(v).values;
}
function buildTransformer({ split, types }) {
  const numSections = split.length;
  return (v) => {
    let output = "";
    for (let i = 0;i < numSections; i++) {
      output += split[i];
      if (v[i] !== undefined) {
        const type = types[i];
        if (type === NUMBER_TOKEN) {
          output += sanitize(v[i]);
        } else if (type === COLOR_TOKEN) {
          output += color.transform(v[i]);
        } else {
          output += v[i];
        }
      }
    }
    return output;
  };
}
function createTransformer(source) {
  return buildTransformer(analyseComplexValue(source));
}
function getAnimatableNone(v) {
  const info = analyseComplexValue(v);
  const transformer = buildTransformer(info);
  return transformer(info.values.map((value, i) => convertToZero(value, info.split[i])));
}
var NUMBER_TOKEN = "number", COLOR_TOKEN = "color", VAR_TOKEN = "var", VAR_FUNCTION_TOKEN = "var(", SPLIT_TOKEN = "${}", complexRegex, convertNumbersToZero = (v) => typeof v === "number" ? 0 : color.test(v) ? color.getAnimatableNone(v) : v, convertToZero = (value, splitBefore) => {
  if (typeof value === "number") {
    return splitBefore?.trim().endsWith("/") ? value : 0;
  }
  return convertNumbersToZero(value);
}, complex;
var init_complex = __esm(() => {
  init_color();
  init_color_regex();
  init_float_regex();
  init_sanitize();
  complexRegex = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
  complex = {
    test,
    parse: parseComplexValue,
    createTransformer,
    getAnimatableNone
  };
});

// node_modules/motion-dom/dist/es/value/types/color/hsla-to-rgba.mjs
function hueToRgb(p, q, t) {
  if (t < 0)
    t += 1;
  if (t > 1)
    t -= 1;
  if (t < 1 / 6)
    return p + (q - p) * 6 * t;
  if (t < 1 / 2)
    return q;
  if (t < 2 / 3)
    return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
function hslaToRgba({ hue, saturation, lightness, alpha: alpha2 }) {
  hue /= 360;
  saturation /= 100;
  lightness /= 100;
  let red = 0;
  let green = 0;
  let blue = 0;
  if (!saturation) {
    red = green = blue = lightness;
  } else {
    const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
    const p = 2 * lightness - q;
    red = hueToRgb(p, q, hue + 1 / 3);
    green = hueToRgb(p, q, hue);
    blue = hueToRgb(p, q, hue - 1 / 3);
  }
  return {
    red: Math.round(red * 255),
    green: Math.round(green * 255),
    blue: Math.round(blue * 255),
    alpha: alpha2
  };
}
var init_hsla_to_rgba = () => {};

// node_modules/motion-dom/dist/es/utils/mix/immediate.mjs
function mixImmediate(a, b) {
  return (p) => p > 0 ? b : a;
}
var init_immediate = () => {};

// node_modules/motion-dom/dist/es/utils/mix/number.mjs
var mixNumber = (from, to, progress2) => {
  return from + (to - from) * progress2;
};
var init_number = () => {};

// node_modules/motion-dom/dist/es/utils/mix/color.mjs
function asRGBA(color2) {
  const type = getColorType(color2);
  warning(Boolean(type), `'${color2}' is not an animatable color. Use the equivalent color code instead.`, "color-not-animatable");
  if (!type)
    return false;
  let model = type.parse(color2);
  if (type === hsla) {
    model = hslaToRgba(model);
  }
  return model;
}
var mixLinearColor = (from, to, v) => {
  const fromExpo = from * from;
  const expo = v * (to * to - fromExpo) + fromExpo;
  return expo < 0 ? 0 : Math.sqrt(expo);
}, colorTypes, getColorType = (v) => colorTypes.find((type) => type.test(v)), mixColor = (from, to) => {
  const fromRGBA = asRGBA(from);
  const toRGBA = asRGBA(to);
  if (!fromRGBA || !toRGBA) {
    return mixImmediate(from, to);
  }
  const blended = { ...fromRGBA };
  return (v) => {
    blended.red = mixLinearColor(fromRGBA.red, toRGBA.red, v);
    blended.green = mixLinearColor(fromRGBA.green, toRGBA.green, v);
    blended.blue = mixLinearColor(fromRGBA.blue, toRGBA.blue, v);
    blended.alpha = mixNumber(fromRGBA.alpha, toRGBA.alpha, v);
    return rgba.transform(blended);
  };
};
var init_color2 = __esm(() => {
  init_es();
  init_hex();
  init_hsla();
  init_hsla_to_rgba();
  init_rgba();
  init_immediate();
  init_number();
  colorTypes = [hex, rgba, hsla];
});

// node_modules/motion-dom/dist/es/utils/mix/visibility.mjs
function mixVisibility(origin, target) {
  if (invisibleValues.has(origin)) {
    return (p) => p <= 0 ? origin : target;
  } else {
    return (p) => p >= 1 ? target : origin;
  }
}
var invisibleValues;
var init_visibility = __esm(() => {
  invisibleValues = new Set(["none", "hidden"]);
});

// node_modules/motion-dom/dist/es/utils/mix/complex.mjs
function mixNumber2(a, b) {
  return (p) => mixNumber(a, b, p);
}
function getMixer(a) {
  if (typeof a === "number") {
    return mixNumber2;
  } else if (typeof a === "string") {
    return isCSSVariableToken(a) ? mixImmediate : color.test(a) ? mixColor : mixComplex;
  } else if (Array.isArray(a)) {
    return mixArray;
  } else if (typeof a === "object") {
    return color.test(a) ? mixColor : mixObject;
  }
  return mixImmediate;
}
function mixArray(a, b) {
  const output = [...a];
  const numValues = output.length;
  const blendValue = a.map((v, i) => getMixer(v)(v, b[i]));
  return (p) => {
    for (let i = 0;i < numValues; i++) {
      output[i] = blendValue[i](p);
    }
    return output;
  };
}
function mixObject(a, b) {
  const output = { ...a, ...b };
  const blendValue = {};
  for (const key in output) {
    if (a[key] !== undefined && b[key] !== undefined) {
      blendValue[key] = getMixer(a[key])(a[key], b[key]);
    }
  }
  return (v) => {
    for (const key in blendValue) {
      output[key] = blendValue[key](v);
    }
    return output;
  };
}
function matchOrder(origin, target) {
  const orderedOrigin = [];
  const pointers = { color: 0, var: 0, number: 0 };
  for (let i = 0;i < target.values.length; i++) {
    const type = target.types[i];
    const originIndex = origin.indexes[type][pointers[type]];
    const originValue = origin.values[originIndex] ?? 0;
    orderedOrigin[i] = originValue;
    pointers[type]++;
  }
  return orderedOrigin;
}
var mixComplex = (origin, target) => {
  const template = complex.createTransformer(target);
  const originStats = analyseComplexValue(origin);
  const targetStats = analyseComplexValue(target);
  const canInterpolate = originStats.indexes.var.length === targetStats.indexes.var.length && originStats.indexes.color.length === targetStats.indexes.color.length && originStats.indexes.number.length >= targetStats.indexes.number.length;
  if (canInterpolate) {
    if (invisibleValues.has(origin) && !targetStats.values.length || invisibleValues.has(target) && !originStats.values.length) {
      return mixVisibility(origin, target);
    }
    return pipe(mixArray(matchOrder(originStats, targetStats), targetStats.values), template);
  } else {
    warning(true, `Complex values '${origin}' and '${target}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`, "complex-values-different");
    return mixImmediate(origin, target);
  }
};
var init_complex2 = __esm(() => {
  init_es();
  init_is_css_variable();
  init_color();
  init_complex();
  init_color2();
  init_immediate();
  init_number();
  init_visibility();
});

// node_modules/motion-dom/dist/es/utils/mix/index.mjs
function mix(from, to, p) {
  if (typeof from === "number" && typeof to === "number" && typeof p === "number") {
    return mixNumber(from, to, p);
  }
  const mixer = getMixer(from);
  return mixer(from, to);
}
var init_mix = __esm(() => {
  init_complex2();
  init_number();
});

// node_modules/motion-dom/dist/es/animation/drivers/frame.mjs
var frameloopDriver = (update) => {
  const passTimestamp = ({ timestamp }) => update(timestamp);
  return {
    start: (keepAlive = true) => frame.update(passTimestamp, keepAlive),
    stop: () => cancelFrame(passTimestamp),
    now: () => frameData.isProcessing ? frameData.timestamp : time.now()
  };
};
var init_frame2 = __esm(() => {
  init_sync_time();
  init_frame();
});

// node_modules/motion-dom/dist/es/animation/waapi/utils/linear.mjs
var generateLinearEasing = (easing, duration, resolution = 10) => {
  let points = "";
  const numPoints = Math.max(Math.round(duration / resolution), 2);
  for (let i = 0;i < numPoints; i++) {
    points += Math.round(easing(i / (numPoints - 1)) * 1e4) / 1e4 + ", ";
  }
  return `linear(${points.substring(0, points.length - 2)})`;
};
var init_linear = () => {};

// node_modules/motion-dom/dist/es/animation/generators/utils/calc-duration.mjs
function calcGeneratorDuration(generator) {
  let duration = 0;
  const timeStep = 50;
  let state = generator.next(duration);
  while (!state.done && duration < maxGeneratorDuration) {
    duration += timeStep;
    state = generator.next(duration);
  }
  return duration >= maxGeneratorDuration ? Infinity : duration;
}
var maxGeneratorDuration = 20000;
var init_calc_duration = () => {};

// node_modules/motion-dom/dist/es/animation/generators/utils/create-generator-easing.mjs
function createGeneratorEasing(options, scale2 = 100, createGenerator) {
  const generator = createGenerator({ ...options, keyframes: [0, scale2] });
  const duration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
  return {
    type: "keyframes",
    ease: (progress2) => {
      return generator.next(duration * progress2).value / scale2;
    },
    duration: millisecondsToSeconds(duration)
  };
}
var init_create_generator_easing = __esm(() => {
  init_es();
  init_calc_duration();
});

// node_modules/motion-dom/dist/es/animation/generators/spring.mjs
function calcAngularFreq(undampedFreq, dampingRatio) {
  return undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
}
function approximateRoot(envelope, derivative, initialGuess) {
  let result = initialGuess;
  for (let i = 1;i < rootIterations; i++) {
    result = result - envelope(result) / derivative(result);
  }
  return result;
}
function findSpring({ duration = springDefaults.duration, bounce = springDefaults.bounce, velocity = springDefaults.velocity, mass = springDefaults.mass }) {
  let envelope;
  let derivative;
  warning(duration <= secondsToMilliseconds(springDefaults.maxDuration), "Spring duration must be 10 seconds or less", "spring-duration-limit");
  let dampingRatio = 1 - bounce;
  dampingRatio = clamp(springDefaults.minDamping, springDefaults.maxDamping, dampingRatio);
  duration = clamp(springDefaults.minDuration, springDefaults.maxDuration, millisecondsToSeconds(duration));
  if (dampingRatio < 1) {
    envelope = (undampedFreq2) => {
      const exponentialDecay = undampedFreq2 * dampingRatio;
      const delta = exponentialDecay * duration;
      const a = exponentialDecay - velocity;
      const b = calcAngularFreq(undampedFreq2, dampingRatio);
      const c = Math.exp(-delta);
      return safeMin - a / b * c;
    };
    derivative = (undampedFreq2) => {
      const exponentialDecay = undampedFreq2 * dampingRatio;
      const delta = exponentialDecay * duration;
      const d = delta * velocity + velocity;
      const e = Math.pow(dampingRatio, 2) * Math.pow(undampedFreq2, 2) * duration;
      const f = Math.exp(-delta);
      const g = calcAngularFreq(Math.pow(undampedFreq2, 2), dampingRatio);
      const factor = -envelope(undampedFreq2) + safeMin > 0 ? -1 : 1;
      return factor * ((d - e) * f) / g;
    };
  } else {
    envelope = (undampedFreq2) => {
      const a = Math.exp(-undampedFreq2 * duration);
      const b = (undampedFreq2 - velocity) * duration + 1;
      return -safeMin + a * b;
    };
    derivative = (undampedFreq2) => {
      const a = Math.exp(-undampedFreq2 * duration);
      const b = (velocity - undampedFreq2) * (duration * duration);
      return a * b;
    };
  }
  const initialGuess = 5 / duration;
  const undampedFreq = approximateRoot(envelope, derivative, initialGuess);
  duration = secondsToMilliseconds(duration);
  if (isNaN(undampedFreq)) {
    return {
      stiffness: springDefaults.stiffness,
      damping: springDefaults.damping,
      duration
    };
  } else {
    const stiffness = Math.pow(undampedFreq, 2) * mass;
    return {
      stiffness,
      damping: dampingRatio * 2 * Math.sqrt(mass * stiffness),
      duration
    };
  }
}
function isSpringType(options, keys) {
  return keys.some((key) => options[key] !== undefined);
}
function getSpringOptions(options) {
  let springOptions = {
    velocity: springDefaults.velocity,
    stiffness: springDefaults.stiffness,
    damping: springDefaults.damping,
    mass: springDefaults.mass,
    isResolvedFromDuration: false,
    ...options
  };
  if (!isSpringType(options, physicsKeys) && isSpringType(options, durationKeys)) {
    springOptions.velocity = 0;
    if (options.visualDuration) {
      const visualDuration = options.visualDuration;
      const root = 2 * Math.PI / (visualDuration * 1.2);
      const stiffness = root * root;
      const damping = 2 * clamp(0.05, 1, 1 - (options.bounce || 0)) * Math.sqrt(stiffness);
      springOptions = {
        ...springOptions,
        mass: springDefaults.mass,
        stiffness,
        damping
      };
    } else {
      const derived = findSpring({ ...options, velocity: 0 });
      springOptions = {
        ...springOptions,
        ...derived,
        mass: springDefaults.mass
      };
      springOptions.isResolvedFromDuration = true;
    }
  }
  return springOptions;
}
function spring(optionsOrVisualDuration = springDefaults.visualDuration, bounce = springDefaults.bounce) {
  const options = typeof optionsOrVisualDuration !== "object" ? {
    visualDuration: optionsOrVisualDuration,
    keyframes: [0, 1],
    bounce
  } : optionsOrVisualDuration;
  let { restSpeed, restDelta } = options;
  const origin = options.keyframes[0];
  const target = options.keyframes[options.keyframes.length - 1];
  const state = { done: false, value: origin };
  const { stiffness, damping, mass, duration, velocity, isResolvedFromDuration } = getSpringOptions({
    ...options,
    velocity: -millisecondsToSeconds(options.velocity || 0)
  });
  const initialVelocity = velocity || 0;
  const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
  const initialDelta = target - origin;
  const undampedAngularFreq = millisecondsToSeconds(Math.sqrt(stiffness / mass));
  const isGranularScale = Math.abs(initialDelta) < 5;
  restSpeed || (restSpeed = isGranularScale ? springDefaults.restSpeed.granular : springDefaults.restSpeed.default);
  restDelta || (restDelta = isGranularScale ? springDefaults.restDelta.granular : springDefaults.restDelta.default);
  let resolveSpring;
  let resolveVelocity;
  let angularFreq;
  let A;
  let sinCoeff;
  let cosCoeff;
  if (dampingRatio < 1) {
    angularFreq = calcAngularFreq(undampedAngularFreq, dampingRatio);
    A = (initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / angularFreq;
    resolveSpring = (t) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
      return target - envelope * (A * Math.sin(angularFreq * t) + initialDelta * Math.cos(angularFreq * t));
    };
    sinCoeff = dampingRatio * undampedAngularFreq * A + initialDelta * angularFreq;
    cosCoeff = dampingRatio * undampedAngularFreq * initialDelta - A * angularFreq;
    resolveVelocity = (t) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
      return envelope * (sinCoeff * Math.sin(angularFreq * t) + cosCoeff * Math.cos(angularFreq * t));
    };
  } else if (dampingRatio === 1) {
    resolveSpring = (t) => target - Math.exp(-undampedAngularFreq * t) * (initialDelta + (initialVelocity + undampedAngularFreq * initialDelta) * t);
    const C = initialVelocity + undampedAngularFreq * initialDelta;
    resolveVelocity = (t) => Math.exp(-undampedAngularFreq * t) * (undampedAngularFreq * C * t - initialVelocity);
  } else {
    const dampedAngularFreq = undampedAngularFreq * Math.sqrt(dampingRatio * dampingRatio - 1);
    resolveSpring = (t) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
      const freqForT = Math.min(dampedAngularFreq * t, 300);
      return target - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) * Math.sinh(freqForT) + dampedAngularFreq * initialDelta * Math.cosh(freqForT)) / dampedAngularFreq;
    };
    const P = (initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / dampedAngularFreq;
    const sinhCoeff = dampingRatio * undampedAngularFreq * P - initialDelta * dampedAngularFreq;
    const coshCoeff = dampingRatio * undampedAngularFreq * initialDelta - P * dampedAngularFreq;
    resolveVelocity = (t) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
      const freqForT = Math.min(dampedAngularFreq * t, 300);
      return envelope * (sinhCoeff * Math.sinh(freqForT) + coshCoeff * Math.cosh(freqForT));
    };
  }
  const generator = {
    calculatedDuration: isResolvedFromDuration ? duration || null : null,
    velocity: (t) => secondsToMilliseconds(resolveVelocity(t)),
    next: (t) => {
      if (!isResolvedFromDuration && dampingRatio < 1) {
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
        const sin = Math.sin(angularFreq * t);
        const cos = Math.cos(angularFreq * t);
        const current2 = target - envelope * (A * sin + initialDelta * cos);
        const currentVelocity = secondsToMilliseconds(envelope * (sinCoeff * sin + cosCoeff * cos));
        state.done = Math.abs(currentVelocity) <= restSpeed && Math.abs(target - current2) <= restDelta;
        state.value = state.done ? target : current2;
        return state;
      }
      const current = resolveSpring(t);
      if (!isResolvedFromDuration) {
        const currentVelocity = secondsToMilliseconds(resolveVelocity(t));
        state.done = Math.abs(currentVelocity) <= restSpeed && Math.abs(target - current) <= restDelta;
      } else {
        state.done = t >= duration;
      }
      state.value = state.done ? target : current;
      return state;
    },
    toString: () => {
      const calculatedDuration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
      const easing = generateLinearEasing((progress2) => generator.next(calculatedDuration * progress2).value, calculatedDuration, 30);
      return calculatedDuration + "ms " + easing;
    },
    toTransition: () => {}
  };
  return generator;
}
var springDefaults, rootIterations = 12, safeMin = 0.001, durationKeys, physicsKeys;
var init_spring = __esm(() => {
  init_es();
  init_linear();
  init_calc_duration();
  init_create_generator_easing();
  springDefaults = {
    stiffness: 100,
    damping: 10,
    mass: 1,
    velocity: 0,
    duration: 800,
    bounce: 0.3,
    visualDuration: 0.3,
    restSpeed: {
      granular: 0.01,
      default: 2
    },
    restDelta: {
      granular: 0.005,
      default: 0.5
    },
    minDuration: 0.01,
    maxDuration: 10,
    minDamping: 0.05,
    maxDamping: 1
  };
  durationKeys = ["duration", "bounce"];
  physicsKeys = ["stiffness", "damping", "mass"];
  spring.applyToOptions = (options) => {
    const generatorOptions = createGeneratorEasing(options, 100, spring);
    options.ease = generatorOptions.ease;
    options.duration = secondsToMilliseconds(generatorOptions.duration);
    options.type = "keyframes";
    return options;
  };
});

// node_modules/motion-dom/dist/es/animation/generators/utils/velocity.mjs
function getGeneratorVelocity(resolveValue, t, current) {
  const prevT = Math.max(t - velocitySampleDuration, 0);
  return velocityPerSecond(current - resolveValue(prevT), t - prevT);
}
var velocitySampleDuration = 5;
var init_velocity = __esm(() => {
  init_es();
});

// node_modules/motion-dom/dist/es/animation/generators/inertia.mjs
function inertia({ keyframes, velocity = 0, power = 0.8, timeConstant = 325, bounceDamping = 10, bounceStiffness = 500, modifyTarget, min, max, restDelta = 0.5, restSpeed }) {
  const origin = keyframes[0];
  const state = {
    done: false,
    value: origin
  };
  const isOutOfBounds = (v) => min !== undefined && v < min || max !== undefined && v > max;
  const nearestBoundary = (v) => {
    if (min === undefined)
      return max;
    if (max === undefined)
      return min;
    return Math.abs(min - v) < Math.abs(max - v) ? min : max;
  };
  let amplitude = power * velocity;
  const ideal = origin + amplitude;
  const target = modifyTarget === undefined ? ideal : modifyTarget(ideal);
  if (target !== ideal)
    amplitude = target - origin;
  const calcDelta = (t) => -amplitude * Math.exp(-t / timeConstant);
  const calcLatest = (t) => target + calcDelta(t);
  const applyFriction = (t) => {
    const delta = calcDelta(t);
    const latest = calcLatest(t);
    state.done = Math.abs(delta) <= restDelta;
    state.value = state.done ? target : latest;
  };
  let timeReachedBoundary;
  let spring$1;
  const checkCatchBoundary = (t) => {
    if (!isOutOfBounds(state.value))
      return;
    timeReachedBoundary = t;
    spring$1 = spring({
      keyframes: [state.value, nearestBoundary(state.value)],
      velocity: getGeneratorVelocity(calcLatest, t, state.value),
      damping: bounceDamping,
      stiffness: bounceStiffness,
      restDelta,
      restSpeed
    });
  };
  checkCatchBoundary(0);
  return {
    calculatedDuration: null,
    next: (t) => {
      let hasUpdatedFrame = false;
      if (!spring$1 && timeReachedBoundary === undefined) {
        hasUpdatedFrame = true;
        applyFriction(t);
        checkCatchBoundary(t);
      }
      if (timeReachedBoundary !== undefined && t >= timeReachedBoundary) {
        return spring$1.next(t - timeReachedBoundary);
      } else {
        !hasUpdatedFrame && applyFriction(t);
        return state;
      }
    }
  };
}
var init_inertia = __esm(() => {
  init_spring();
  init_velocity();
});

// node_modules/motion-dom/dist/es/utils/interpolate.mjs
function createMixers(output, ease, customMixer) {
  const mixers = [];
  const mixerFactory = customMixer || MotionGlobalConfig.mix || mix;
  const numMixers = output.length - 1;
  for (let i = 0;i < numMixers; i++) {
    let mixer = mixerFactory(output[i], output[i + 1]);
    if (ease) {
      const easingFunction = Array.isArray(ease) ? ease[i] || noop : ease;
      mixer = pipe(easingFunction, mixer);
    }
    mixers.push(mixer);
  }
  return mixers;
}
function interpolate(input, output, { clamp: isClamp = true, ease, mixer } = {}) {
  const inputLength = input.length;
  invariant(inputLength === output.length, "Both input and output ranges must be the same length", "range-length");
  if (inputLength === 1)
    return () => output[0];
  if (inputLength === 2 && output[0] === output[1])
    return () => output[1];
  const isZeroDeltaRange = input[0] === input[1];
  if (input[0] > input[inputLength - 1]) {
    input = [...input].reverse();
    output = [...output].reverse();
  }
  const mixers = createMixers(output, ease, mixer);
  const numMixers = mixers.length;
  const interpolator = (v) => {
    if (isZeroDeltaRange && v < input[0])
      return output[0];
    let i = 0;
    if (numMixers > 1) {
      for (;i < input.length - 2; i++) {
        if (v < input[i + 1])
          break;
      }
    }
    const progressInRange = progress(input[i], input[i + 1], v);
    return mixers[i](progressInRange);
  };
  return isClamp ? (v) => interpolator(clamp(input[0], input[inputLength - 1], v)) : interpolator;
}
var init_interpolate = __esm(() => {
  init_es();
  init_mix();
});

// node_modules/motion-dom/dist/es/animation/keyframes/offsets/fill.mjs
function fillOffset(offset, remaining) {
  const min = offset[offset.length - 1];
  for (let i = 1;i <= remaining; i++) {
    const offsetProgress = progress(0, remaining, i);
    offset.push(mixNumber(min, 1, offsetProgress));
  }
}
var init_fill = __esm(() => {
  init_es();
  init_number();
});

// node_modules/motion-dom/dist/es/animation/keyframes/offsets/default.mjs
function defaultOffset(arr) {
  const offset = [0];
  fillOffset(offset, arr.length - 1);
  return offset;
}
var init_default = __esm(() => {
  init_fill();
});

// node_modules/motion-dom/dist/es/animation/keyframes/offsets/time.mjs
function convertOffsetToTimes(offset, duration) {
  return offset.map((o) => o * duration);
}
var init_time = () => {};

// node_modules/motion-dom/dist/es/animation/generators/keyframes.mjs
function defaultEasing(values, easing) {
  return values.map(() => easing || easeInOut).splice(0, values.length - 1);
}
function keyframes({ duration = 300, keyframes: keyframeValues, times, ease = "easeInOut" }) {
  const easingFunctions = isEasingArray(ease) ? ease.map(easingDefinitionToFunction) : easingDefinitionToFunction(ease);
  const state = {
    done: false,
    value: keyframeValues[0]
  };
  const absoluteTimes = convertOffsetToTimes(times && times.length === keyframeValues.length ? times : defaultOffset(keyframeValues), duration);
  const mapTimeToKeyframe = interpolate(absoluteTimes, keyframeValues, {
    ease: Array.isArray(easingFunctions) ? easingFunctions : defaultEasing(keyframeValues, easingFunctions)
  });
  return {
    calculatedDuration: duration,
    next: (t) => {
      state.value = mapTimeToKeyframe(t);
      state.done = t >= duration;
      return state;
    }
  };
}
var init_keyframes = __esm(() => {
  init_es();
  init_interpolate();
  init_default();
  init_time();
});

// node_modules/motion-dom/dist/es/animation/keyframes/get-final.mjs
function getFinalKeyframe(keyframes2, { repeat, repeatType = "loop" }, finalKeyframe, speed = 1) {
  const resolvedKeyframes = keyframes2.filter(isNotNull);
  const useFirstKeyframe = speed < 0 || repeat && repeatType !== "loop" && repeat % 2 === 1;
  const index = useFirstKeyframe ? 0 : resolvedKeyframes.length - 1;
  return !index || finalKeyframe === undefined ? resolvedKeyframes[index] : finalKeyframe;
}
var isNotNull = (value) => value !== null;
var init_get_final = () => {};

// node_modules/motion-dom/dist/es/animation/utils/replace-transition-type.mjs
function replaceTransitionType(transition) {
  if (typeof transition.type === "string") {
    transition.type = transitionTypeMap[transition.type];
  }
}
var transitionTypeMap;
var init_replace_transition_type = __esm(() => {
  init_inertia();
  init_keyframes();
  init_spring();
  transitionTypeMap = {
    decay: inertia,
    inertia,
    tween: keyframes,
    keyframes,
    spring
  };
});

// node_modules/motion-dom/dist/es/animation/utils/WithPromise.mjs
class WithPromise {
  constructor() {
    this.updateFinished();
  }
  get finished() {
    return this._finished;
  }
  updateFinished() {
    this._finished = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }
  notifyFinished() {
    this.resolve();
  }
  then(onResolve, onReject) {
    return this.finished.then(onResolve, onReject);
  }
}
var init_WithPromise = () => {};

// node_modules/motion-dom/dist/es/animation/JSAnimation.mjs
var percentToProgress = (percent2) => percent2 / 100, JSAnimation;
var init_JSAnimation = __esm(() => {
  init_es();
  init_sync_time();
  init_animation_count();
  init_mix();
  init_frame2();
  init_inertia();
  init_keyframes();
  init_calc_duration();
  init_velocity();
  init_get_final();
  init_replace_transition_type();
  init_WithPromise();
  JSAnimation = class JSAnimation extends WithPromise {
    constructor(options) {
      super();
      this.state = "idle";
      this.startTime = null;
      this.isStopped = false;
      this.currentTime = 0;
      this.holdTime = null;
      this.playbackSpeed = 1;
      this.delayState = {
        done: false,
        value: undefined
      };
      this.stop = () => {
        const { motionValue } = this.options;
        if (motionValue && motionValue.updatedAt !== time.now()) {
          this.tick(time.now());
        }
        this.isStopped = true;
        if (this.state === "idle")
          return;
        this.teardown();
        this.options.onStop?.();
      };
      activeAnimations.mainThread++;
      this.options = options;
      this.initAnimation();
      this.play();
      if (options.autoplay === false)
        this.pause();
    }
    initAnimation() {
      const { options } = this;
      replaceTransitionType(options);
      const { type = keyframes, repeat = 0, repeatDelay = 0, repeatType, velocity = 0 } = options;
      let { keyframes: keyframes$1 } = options;
      const generatorFactory = type || keyframes;
      if (generatorFactory !== keyframes) {
        invariant(keyframes$1.length <= 2, `Only two keyframes currently supported with spring and inertia animations. Trying to animate ${keyframes$1}`, "spring-two-frames");
      }
      if (generatorFactory !== keyframes && typeof keyframes$1[0] !== "number") {
        this.mixKeyframes = pipe(percentToProgress, mix(keyframes$1[0], keyframes$1[1]));
        keyframes$1 = [0, 100];
      }
      const generator = generatorFactory({ ...options, keyframes: keyframes$1 });
      if (repeatType === "mirror") {
        this.mirroredGenerator = generatorFactory({
          ...options,
          keyframes: [...keyframes$1].reverse(),
          velocity: -velocity
        });
      }
      if (generator.calculatedDuration === null) {
        generator.calculatedDuration = calcGeneratorDuration(generator);
      }
      const { calculatedDuration } = generator;
      this.calculatedDuration = calculatedDuration;
      this.resolvedDuration = calculatedDuration + repeatDelay;
      this.totalDuration = this.resolvedDuration * (repeat + 1) - repeatDelay;
      this.generator = generator;
    }
    updateTime(timestamp) {
      const animationTime = Math.round(timestamp - this.startTime) * this.playbackSpeed;
      if (this.holdTime !== null) {
        this.currentTime = this.holdTime;
      } else {
        this.currentTime = animationTime;
      }
    }
    tick(timestamp, sample = false) {
      const { generator, totalDuration, mixKeyframes, mirroredGenerator, resolvedDuration, calculatedDuration } = this;
      if (this.startTime === null)
        return generator.next(0);
      const { delay = 0, keyframes: keyframes2, repeat, repeatType, repeatDelay, type, onUpdate, finalKeyframe } = this.options;
      if (this.speed > 0) {
        this.startTime = Math.min(this.startTime, timestamp);
      } else if (this.speed < 0) {
        this.startTime = Math.min(timestamp - totalDuration / this.speed, this.startTime);
      }
      if (sample) {
        this.currentTime = timestamp;
      } else {
        this.updateTime(timestamp);
      }
      const timeWithoutDelay = this.currentTime - delay * (this.playbackSpeed >= 0 ? 1 : -1);
      const isInDelayPhase = this.playbackSpeed >= 0 ? timeWithoutDelay < 0 : timeWithoutDelay > totalDuration;
      this.currentTime = Math.max(timeWithoutDelay, 0);
      if (this.state === "finished" && this.holdTime === null) {
        this.currentTime = totalDuration;
      }
      let elapsed = this.currentTime;
      let frameGenerator = generator;
      if (repeat) {
        const progress2 = Math.min(this.currentTime, totalDuration) / resolvedDuration;
        let currentIteration = Math.floor(progress2);
        let iterationProgress = progress2 % 1;
        if (!iterationProgress && progress2 >= 1) {
          iterationProgress = 1;
        }
        iterationProgress === 1 && currentIteration--;
        currentIteration = Math.min(currentIteration, repeat + 1);
        const isOddIteration = Boolean(currentIteration % 2);
        if (isOddIteration) {
          if (repeatType === "reverse") {
            iterationProgress = 1 - iterationProgress;
            if (repeatDelay) {
              iterationProgress -= repeatDelay / resolvedDuration;
            }
          } else if (repeatType === "mirror") {
            frameGenerator = mirroredGenerator;
          }
        }
        elapsed = clamp(0, 1, iterationProgress) * resolvedDuration;
      }
      let state;
      if (isInDelayPhase) {
        this.delayState.value = keyframes2[0];
        state = this.delayState;
      } else {
        state = frameGenerator.next(elapsed);
      }
      if (mixKeyframes && !isInDelayPhase) {
        state.value = mixKeyframes(state.value);
      }
      let { done } = state;
      if (!isInDelayPhase && calculatedDuration !== null) {
        done = this.playbackSpeed >= 0 ? this.currentTime >= totalDuration : this.currentTime <= 0;
      }
      const isAnimationFinished = this.holdTime === null && (this.state === "finished" || this.state === "running" && done);
      if (isAnimationFinished && type !== inertia) {
        state.value = getFinalKeyframe(keyframes2, this.options, finalKeyframe, this.speed);
      }
      if (onUpdate) {
        onUpdate(state.value);
      }
      if (isAnimationFinished) {
        this.finish();
      }
      return state;
    }
    then(resolve, reject) {
      return this.finished.then(resolve, reject);
    }
    get duration() {
      return millisecondsToSeconds(this.calculatedDuration);
    }
    get iterationDuration() {
      const { delay = 0 } = this.options || {};
      return this.duration + millisecondsToSeconds(delay);
    }
    get time() {
      return millisecondsToSeconds(this.currentTime);
    }
    set time(newTime) {
      newTime = secondsToMilliseconds(newTime);
      this.currentTime = newTime;
      if (this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0) {
        this.holdTime = newTime;
      } else if (this.driver) {
        this.startTime = this.driver.now() - newTime / this.playbackSpeed;
      }
      if (this.driver) {
        this.driver.start(false);
      } else {
        this.startTime = 0;
        this.state = "paused";
        this.holdTime = newTime;
        this.tick(newTime);
      }
    }
    getGeneratorVelocity() {
      const t = this.currentTime;
      if (t <= 0)
        return this.options.velocity || 0;
      if (this.generator.velocity) {
        return this.generator.velocity(t);
      }
      const current = this.generator.next(t).value;
      return getGeneratorVelocity((s) => this.generator.next(s).value, t, current);
    }
    get speed() {
      return this.playbackSpeed;
    }
    set speed(newSpeed) {
      const hasChanged = this.playbackSpeed !== newSpeed;
      if (hasChanged && this.driver) {
        this.updateTime(time.now());
      }
      this.playbackSpeed = newSpeed;
      if (hasChanged && this.driver) {
        this.time = millisecondsToSeconds(this.currentTime);
      }
    }
    play() {
      if (this.isStopped)
        return;
      const { driver = frameloopDriver, startTime } = this.options;
      if (!this.driver) {
        this.driver = driver((timestamp) => this.tick(timestamp));
      }
      this.options.onPlay?.();
      const now2 = this.driver.now();
      if (this.state === "finished") {
        this.updateFinished();
        this.startTime = now2;
      } else if (this.holdTime !== null) {
        this.startTime = now2 - this.holdTime;
      } else if (!this.startTime) {
        this.startTime = startTime ?? now2;
      }
      if (this.state === "finished" && this.speed < 0) {
        this.startTime += this.calculatedDuration;
      }
      this.holdTime = null;
      this.state = "running";
      this.driver.start();
    }
    pause() {
      this.state = "paused";
      this.updateTime(time.now());
      this.holdTime = this.currentTime;
    }
    complete() {
      if (this.state !== "running") {
        this.play();
      }
      this.state = "finished";
      this.holdTime = null;
    }
    finish() {
      this.notifyFinished();
      this.teardown();
      this.state = "finished";
      this.options.onComplete?.();
    }
    cancel() {
      this.holdTime = null;
      this.startTime = 0;
      this.tick(0);
      this.teardown();
      this.options.onCancel?.();
    }
    teardown() {
      this.state = "idle";
      this.stopDriver();
      this.startTime = this.holdTime = null;
      activeAnimations.mainThread--;
    }
    stopDriver() {
      if (!this.driver)
        return;
      this.driver.stop();
      this.driver = undefined;
    }
    sample(sampleTime) {
      this.startTime = 0;
      return this.tick(sampleTime, true);
    }
    attachTimeline(timeline) {
      if (this.options.allowFlatten) {
        this.options.type = "keyframes";
        this.options.ease = "linear";
        this.initAnimation();
      }
      this.driver?.stop();
      return timeline.observe(this);
    }
  };
});

// node_modules/motion-dom/dist/es/animation/keyframes/utils/fill-wildcards.mjs
function fillWildcards(keyframes2) {
  for (let i = 1;i < keyframes2.length; i++) {
    keyframes2[i] ?? (keyframes2[i] = keyframes2[i - 1]);
  }
}
var init_fill_wildcards = () => {};

// node_modules/motion-dom/dist/es/render/dom/parse-transform.mjs
function defaultTransformValue(name) {
  return name.includes("scale") ? 1 : 0;
}
function parseValueFromTransform(transform, name) {
  if (!transform || transform === "none") {
    return defaultTransformValue(name);
  }
  const matrix3dMatch = transform.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let parsers;
  let match;
  if (matrix3dMatch) {
    parsers = matrix3dParsers;
    match = matrix3dMatch;
  } else {
    const matrix2dMatch = transform.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    parsers = matrix2dParsers;
    match = matrix2dMatch;
  }
  if (!match) {
    return defaultTransformValue(name);
  }
  const valueParser = parsers[name];
  const values = match[1].split(",").map(convertTransformToNumber);
  return typeof valueParser === "function" ? valueParser(values) : values[valueParser];
}
function convertTransformToNumber(value) {
  return parseFloat(value.trim());
}
var radToDeg = (rad) => rad * 180 / Math.PI, rotate = (v) => {
  const angle = radToDeg(Math.atan2(v[1], v[0]));
  return rebaseAngle(angle);
}, matrix2dParsers, rebaseAngle = (angle) => {
  angle = angle % 360;
  if (angle < 0)
    angle += 360;
  return angle;
}, rotateZ, scaleX = (v) => Math.sqrt(v[0] * v[0] + v[1] * v[1]), scaleY = (v) => Math.sqrt(v[4] * v[4] + v[5] * v[5]), matrix3dParsers, readTransformValue = (instance, name) => {
  const { transform = "none" } = getComputedStyle(instance);
  return parseValueFromTransform(transform, name);
};
var init_parse_transform = __esm(() => {
  matrix2dParsers = {
    x: 4,
    y: 5,
    translateX: 4,
    translateY: 5,
    scaleX: 0,
    scaleY: 3,
    scale: (v) => (Math.abs(v[0]) + Math.abs(v[3])) / 2,
    rotate,
    rotateZ: rotate,
    skewX: (v) => radToDeg(Math.atan(v[1])),
    skewY: (v) => radToDeg(Math.atan(v[2])),
    skew: (v) => (Math.abs(v[1]) + Math.abs(v[2])) / 2
  };
  rotateZ = rotate;
  matrix3dParsers = {
    x: 12,
    y: 13,
    z: 14,
    translateX: 12,
    translateY: 13,
    translateZ: 14,
    scaleX,
    scaleY,
    scale: (v) => (scaleX(v) + scaleY(v)) / 2,
    rotateX: (v) => rebaseAngle(radToDeg(Math.atan2(v[6], v[5]))),
    rotateY: (v) => rebaseAngle(radToDeg(Math.atan2(-v[2], v[0]))),
    rotateZ,
    rotate: rotateZ,
    skewX: (v) => radToDeg(Math.atan(v[4])),
    skewY: (v) => radToDeg(Math.atan(v[1])),
    skew: (v) => (Math.abs(v[1]) + Math.abs(v[4])) / 2
  };
});

// node_modules/motion-dom/dist/es/render/utils/keys-transform.mjs
var transformPropOrder, transformProps;
var init_keys_transform = __esm(() => {
  transformPropOrder = [
    "transformPerspective",
    "x",
    "y",
    "z",
    "translateX",
    "translateY",
    "translateZ",
    "scale",
    "scaleX",
    "scaleY",
    "rotate",
    "rotateX",
    "rotateY",
    "rotateZ",
    "skew",
    "skewX",
    "skewY"
  ];
  transformProps = /* @__PURE__ */ (() => new Set(transformPropOrder))();
});

// node_modules/motion-dom/dist/es/animation/keyframes/utils/unit-conversion.mjs
function removeNonTranslationalTransform(visualElement) {
  const removedTransforms = [];
  nonTranslationalTransformKeys.forEach((key) => {
    const value = visualElement.getValue(key);
    if (value !== undefined) {
      removedTransforms.push([key, value.get()]);
      value.set(key.startsWith("scale") ? 1 : 0);
    }
  });
  return removedTransforms;
}
var isNumOrPxType = (v) => v === number || v === px, transformKeys, nonTranslationalTransformKeys, positionalValues;
var init_unit_conversion = __esm(() => {
  init_parse_transform();
  init_keys_transform();
  init_numbers();
  init_units();
  transformKeys = new Set(["x", "y", "z"]);
  nonTranslationalTransformKeys = transformPropOrder.filter((key) => !transformKeys.has(key));
  positionalValues = {
    width: ({ x }, { paddingLeft = "0", paddingRight = "0", boxSizing }) => {
      const width = x.max - x.min;
      return boxSizing === "border-box" ? width : width - parseFloat(paddingLeft) - parseFloat(paddingRight);
    },
    height: ({ y }, { paddingTop = "0", paddingBottom = "0", boxSizing }) => {
      const height = y.max - y.min;
      return boxSizing === "border-box" ? height : height - parseFloat(paddingTop) - parseFloat(paddingBottom);
    },
    top: (_bbox, { top }) => parseFloat(top),
    left: (_bbox, { left }) => parseFloat(left),
    bottom: ({ y }, { top }) => parseFloat(top) + (y.max - y.min),
    right: ({ x }, { left }) => parseFloat(left) + (x.max - x.min),
    x: (_bbox, { transform }) => parseValueFromTransform(transform, "x"),
    y: (_bbox, { transform }) => parseValueFromTransform(transform, "y")
  };
  positionalValues.translateX = positionalValues.x;
  positionalValues.translateY = positionalValues.y;
});

// node_modules/motion-dom/dist/es/animation/keyframes/KeyframesResolver.mjs
function measureAllKeyframes() {
  if (anyNeedsMeasurement) {
    const resolversToMeasure = Array.from(toResolve).filter((resolver) => resolver.needsMeasurement);
    const elementsToMeasure = new Set(resolversToMeasure.map((resolver) => resolver.element));
    const transformsToRestore = new Map;
    elementsToMeasure.forEach((element) => {
      const removedTransforms = removeNonTranslationalTransform(element);
      if (!removedTransforms.length)
        return;
      transformsToRestore.set(element, removedTransforms);
      element.render();
    });
    resolversToMeasure.forEach((resolver) => resolver.measureInitialState());
    elementsToMeasure.forEach((element) => {
      element.render();
      const restore = transformsToRestore.get(element);
      if (restore) {
        restore.forEach(([key, value]) => {
          element.getValue(key)?.set(value);
        });
      }
    });
    resolversToMeasure.forEach((resolver) => resolver.measureEndState());
    resolversToMeasure.forEach((resolver) => {
      if (resolver.suspendedScrollY !== undefined) {
        window.scrollTo(0, resolver.suspendedScrollY);
      }
    });
  }
  anyNeedsMeasurement = false;
  isScheduled = false;
  toResolve.forEach((resolver) => resolver.complete(isForced));
  toResolve.clear();
}
function readAllKeyframes() {
  toResolve.forEach((resolver) => {
    resolver.readKeyframes();
    if (resolver.needsMeasurement) {
      anyNeedsMeasurement = true;
    }
  });
}
function flushKeyframeResolvers() {
  isForced = true;
  readAllKeyframes();
  measureAllKeyframes();
  isForced = false;
}

class KeyframeResolver {
  constructor(unresolvedKeyframes, onComplete, name, motionValue, element, isAsync = false) {
    this.state = "pending";
    this.isAsync = false;
    this.needsMeasurement = false;
    this.unresolvedKeyframes = [...unresolvedKeyframes];
    this.onComplete = onComplete;
    this.name = name;
    this.motionValue = motionValue;
    this.element = element;
    this.isAsync = isAsync;
  }
  scheduleResolve() {
    this.state = "scheduled";
    if (this.isAsync) {
      toResolve.add(this);
      if (!isScheduled) {
        isScheduled = true;
        frame.read(readAllKeyframes);
        frame.resolveKeyframes(measureAllKeyframes);
      }
    } else {
      this.readKeyframes();
      this.complete();
    }
  }
  readKeyframes() {
    const { unresolvedKeyframes, name, element, motionValue } = this;
    if (unresolvedKeyframes[0] === null) {
      const currentValue = motionValue?.get();
      const finalKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
      if (currentValue !== undefined) {
        unresolvedKeyframes[0] = currentValue;
      } else if (element && name) {
        const valueAsRead = element.readValue(name, finalKeyframe);
        if (valueAsRead !== undefined && valueAsRead !== null) {
          unresolvedKeyframes[0] = valueAsRead;
        }
      }
      if (unresolvedKeyframes[0] === undefined) {
        unresolvedKeyframes[0] = finalKeyframe;
      }
      if (motionValue && currentValue === undefined) {
        motionValue.set(unresolvedKeyframes[0]);
      }
    }
    fillWildcards(unresolvedKeyframes);
  }
  setFinalKeyframe() {}
  measureInitialState() {}
  renderEndStyles() {}
  measureEndState() {}
  complete(isForcedComplete = false) {
    this.state = "complete";
    this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, isForcedComplete);
    toResolve.delete(this);
  }
  cancel() {
    if (this.state === "scheduled") {
      toResolve.delete(this);
      this.state = "pending";
    }
  }
  resume() {
    if (this.state === "pending")
      this.scheduleResolve();
  }
}
var toResolve, isScheduled = false, anyNeedsMeasurement = false, isForced = false;
var init_KeyframesResolver = __esm(() => {
  init_fill_wildcards();
  init_unit_conversion();
  init_frame();
  toResolve = new Set;
});

// node_modules/motion-dom/dist/es/render/dom/is-css-var.mjs
var isCSSVar = (name) => name.startsWith("--");
var init_is_css_var = () => {};

// node_modules/motion-dom/dist/es/render/dom/style-set.mjs
function setStyle(element, name, value) {
  isCSSVar(name) ? element.style.setProperty(name, value) : element.style[name] = value;
}
var init_style_set = __esm(() => {
  init_is_css_var();
});

// node_modules/motion-dom/dist/es/utils/supports/flags.mjs
var supportsFlags;
var init_flags = __esm(() => {
  supportsFlags = {};
});

// node_modules/motion-dom/dist/es/utils/supports/memo.mjs
function memoSupports(callback, supportsFlag) {
  const memoized = memo(callback);
  return () => supportsFlags[supportsFlag] ?? memoized();
}
var init_memo2 = __esm(() => {
  init_es();
  init_flags();
});

// node_modules/motion-dom/dist/es/utils/supports/scroll-timeline.mjs
var supportsScrollTimeline;
var init_scroll_timeline = __esm(() => {
  init_memo2();
  supportsScrollTimeline = /* @__PURE__ */ memoSupports(() => window.ScrollTimeline !== undefined, "scrollTimeline");
});

// node_modules/motion-dom/dist/es/utils/supports/linear-easing.mjs
var supportsLinearEasing;
var init_linear_easing = __esm(() => {
  init_memo2();
  supportsLinearEasing = /* @__PURE__ */ memoSupports(() => {
    try {
      document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
    } catch (e) {
      return false;
    }
    return true;
  }, "linearEasing");
});

// node_modules/motion-dom/dist/es/animation/waapi/easing/cubic-bezier.mjs
var cubicBezierAsString = ([a, b, c, d]) => `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
var init_cubic_bezier2 = () => {};

// node_modules/motion-dom/dist/es/animation/waapi/easing/supported.mjs
var supportedWaapiEasing;
var init_supported = __esm(() => {
  init_cubic_bezier2();
  supportedWaapiEasing = {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    circIn: /* @__PURE__ */ cubicBezierAsString([0, 0.65, 0.55, 1]),
    circOut: /* @__PURE__ */ cubicBezierAsString([0.55, 0, 1, 0.45]),
    backIn: /* @__PURE__ */ cubicBezierAsString([0.31, 0.01, 0.66, -0.59]),
    backOut: /* @__PURE__ */ cubicBezierAsString([0.33, 1.53, 0.69, 0.99])
  };
});

// node_modules/motion-dom/dist/es/animation/waapi/easing/map-easing.mjs
function mapEasingToNativeEasing(easing, duration) {
  if (!easing) {
    return;
  } else if (typeof easing === "function") {
    return supportsLinearEasing() ? generateLinearEasing(easing, duration) : "ease-out";
  } else if (isBezierDefinition(easing)) {
    return cubicBezierAsString(easing);
  } else if (Array.isArray(easing)) {
    return easing.map((segmentEasing) => mapEasingToNativeEasing(segmentEasing, duration) || supportedWaapiEasing.easeOut);
  } else {
    return supportedWaapiEasing[easing];
  }
}
var init_map_easing = __esm(() => {
  init_es();
  init_linear_easing();
  init_linear();
  init_cubic_bezier2();
  init_supported();
});

// node_modules/motion-dom/dist/es/animation/waapi/start-waapi-animation.mjs
function startWaapiAnimation(element, valueName, keyframes2, { delay = 0, duration = 300, repeat = 0, repeatType = "loop", ease = "easeOut", times } = {}, pseudoElement = undefined) {
  const keyframeOptions = {
    [valueName]: keyframes2
  };
  if (times)
    keyframeOptions.offset = times;
  const easing = mapEasingToNativeEasing(ease, duration);
  if (Array.isArray(easing))
    keyframeOptions.easing = easing;
  if (statsBuffer.value) {
    activeAnimations.waapi++;
  }
  const options = {
    delay,
    duration,
    easing: !Array.isArray(easing) ? easing : "linear",
    fill: "both",
    iterations: repeat + 1,
    direction: repeatType === "reverse" ? "alternate" : "normal"
  };
  if (pseudoElement)
    options.pseudoElement = pseudoElement;
  const animation = element.animate(keyframeOptions, options);
  if (statsBuffer.value) {
    animation.finished.finally(() => {
      activeAnimations.waapi--;
    });
  }
  return animation;
}
var init_start_waapi_animation = __esm(() => {
  init_animation_count();
  init_buffer();
  init_map_easing();
});

// node_modules/motion-dom/dist/es/animation/generators/utils/is-generator.mjs
function isGenerator(type) {
  return typeof type === "function" && "applyToOptions" in type;
}
var init_is_generator = () => {};

// node_modules/motion-dom/dist/es/animation/waapi/utils/apply-generator.mjs
function applyGeneratorOptions({ type, ...options }) {
  if (isGenerator(type) && supportsLinearEasing()) {
    return type.applyToOptions(options);
  } else {
    options.duration ?? (options.duration = 300);
    options.ease ?? (options.ease = "easeOut");
  }
  return options;
}
var init_apply_generator = __esm(() => {
  init_linear_easing();
  init_is_generator();
});

// node_modules/motion-dom/dist/es/animation/NativeAnimation.mjs
var NativeAnimation;
var init_NativeAnimation = __esm(() => {
  init_es();
  init_style_set();
  init_scroll_timeline();
  init_get_final();
  init_WithPromise();
  init_start_waapi_animation();
  init_apply_generator();
  NativeAnimation = class NativeAnimation extends WithPromise {
    constructor(options) {
      super();
      this.finishedTime = null;
      this.isStopped = false;
      this.manualStartTime = null;
      if (!options)
        return;
      const { element, name, keyframes: keyframes2, pseudoElement, allowFlatten = false, finalKeyframe, onComplete } = options;
      this.isPseudoElement = Boolean(pseudoElement);
      this.allowFlatten = allowFlatten;
      this.options = options;
      invariant(typeof options.type !== "string", `Mini animate() doesn't support "type" as a string.`, "mini-spring");
      const transition = applyGeneratorOptions(options);
      this.animation = startWaapiAnimation(element, name, keyframes2, transition, pseudoElement);
      if (transition.autoplay === false) {
        this.animation.pause();
      }
      this.animation.onfinish = () => {
        this.finishedTime = this.time;
        if (!pseudoElement) {
          const keyframe = getFinalKeyframe(keyframes2, this.options, finalKeyframe, this.speed);
          if (this.updateMotionValue) {
            this.updateMotionValue(keyframe);
          }
          setStyle(element, name, keyframe);
          this.animation.cancel();
        }
        onComplete?.();
        this.notifyFinished();
      };
    }
    play() {
      if (this.isStopped)
        return;
      this.manualStartTime = null;
      this.animation.play();
      if (this.state === "finished") {
        this.updateFinished();
      }
    }
    pause() {
      this.animation.pause();
    }
    complete() {
      this.animation.finish?.();
    }
    cancel() {
      try {
        this.animation.cancel();
      } catch (e) {}
    }
    stop() {
      if (this.isStopped)
        return;
      this.isStopped = true;
      const { state } = this;
      if (state === "idle" || state === "finished") {
        return;
      }
      if (this.updateMotionValue) {
        this.updateMotionValue();
      } else {
        this.commitStyles();
      }
      if (!this.isPseudoElement)
        this.cancel();
    }
    commitStyles() {
      const element = this.options?.element;
      if (!this.isPseudoElement && element?.isConnected) {
        this.animation.commitStyles?.();
      }
    }
    get duration() {
      const duration = this.animation.effect?.getComputedTiming?.().duration || 0;
      return millisecondsToSeconds(Number(duration));
    }
    get iterationDuration() {
      const { delay = 0 } = this.options || {};
      return this.duration + millisecondsToSeconds(delay);
    }
    get time() {
      return millisecondsToSeconds(Number(this.animation.currentTime) || 0);
    }
    set time(newTime) {
      const wasFinished = this.finishedTime !== null;
      this.manualStartTime = null;
      this.finishedTime = null;
      this.animation.currentTime = secondsToMilliseconds(newTime);
      if (wasFinished) {
        this.animation.pause();
      }
    }
    get speed() {
      return this.animation.playbackRate;
    }
    set speed(newSpeed) {
      if (newSpeed < 0)
        this.finishedTime = null;
      this.animation.playbackRate = newSpeed;
    }
    get state() {
      return this.finishedTime !== null ? "finished" : this.animation.playState;
    }
    get startTime() {
      return this.manualStartTime ?? Number(this.animation.startTime);
    }
    set startTime(newStartTime) {
      this.manualStartTime = this.animation.startTime = newStartTime;
    }
    attachTimeline({ timeline, rangeStart, rangeEnd, observe }) {
      if (this.allowFlatten) {
        this.animation.effect?.updateTiming({ easing: "linear" });
      }
      this.animation.onfinish = null;
      if (timeline && supportsScrollTimeline()) {
        this.animation.timeline = timeline;
        if (rangeStart)
          this.animation.rangeStart = rangeStart;
        if (rangeEnd)
          this.animation.rangeEnd = rangeEnd;
        return noop;
      } else {
        return observe(this);
      }
    }
  };
});

// node_modules/motion-dom/dist/es/animation/waapi/utils/unsupported-easing.mjs
function isUnsupportedEase(key) {
  return key in unsupportedEasingFunctions;
}
function replaceStringEasing(transition) {
  if (typeof transition.ease === "string" && isUnsupportedEase(transition.ease)) {
    transition.ease = unsupportedEasingFunctions[transition.ease];
  }
}
var unsupportedEasingFunctions;
var init_unsupported_easing = __esm(() => {
  init_es();
  unsupportedEasingFunctions = {
    anticipate,
    backInOut,
    circInOut
  };
});

// node_modules/motion-dom/dist/es/animation/NativeAnimationExtended.mjs
var sampleDelta = 10, NativeAnimationExtended;
var init_NativeAnimationExtended = __esm(() => {
  init_es();
  init_sync_time();
  init_style_set();
  init_JSAnimation();
  init_NativeAnimation();
  init_replace_transition_type();
  init_unsupported_easing();
  NativeAnimationExtended = class NativeAnimationExtended extends NativeAnimation {
    constructor(options) {
      replaceStringEasing(options);
      replaceTransitionType(options);
      super(options);
      if (options.startTime !== undefined && options.autoplay !== false) {
        this.startTime = options.startTime;
      }
      this.options = options;
    }
    updateMotionValue(value) {
      const { motionValue, onUpdate, onComplete, element, ...options } = this.options;
      if (!motionValue)
        return;
      if (value !== undefined) {
        motionValue.set(value);
        return;
      }
      const sampleAnimation = new JSAnimation({
        ...options,
        autoplay: false
      });
      const sampleTime = Math.max(sampleDelta, time.now() - this.startTime);
      const delta = clamp(0, sampleDelta, sampleTime - sampleDelta);
      const current = sampleAnimation.sample(sampleTime).value;
      const { name } = this.options;
      if (element && name)
        setStyle(element, name, current);
      motionValue.setWithVelocity(sampleAnimation.sample(Math.max(0, sampleTime - delta)).value, current, delta);
      sampleAnimation.stop();
    }
  };
});

// node_modules/motion-dom/dist/es/animation/utils/is-animatable.mjs
var isAnimatable = (value, name) => {
  if (name === "zIndex")
    return false;
  if (typeof value === "number" || Array.isArray(value))
    return true;
  if (typeof value === "string" && (complex.test(value) || value === "0") && !value.startsWith("url(")) {
    return true;
  }
  return false;
};
var init_is_animatable = __esm(() => {
  init_complex();
});

// node_modules/motion-dom/dist/es/animation/utils/can-animate.mjs
function hasKeyframesChanged(keyframes2) {
  const current = keyframes2[0];
  if (keyframes2.length === 1)
    return true;
  for (let i = 0;i < keyframes2.length; i++) {
    if (keyframes2[i] !== current)
      return true;
  }
}
function canAnimate(keyframes2, name, type, velocity) {
  const originKeyframe = keyframes2[0];
  if (originKeyframe === null) {
    return false;
  }
  if (name === "display" || name === "visibility")
    return true;
  const targetKeyframe = keyframes2[keyframes2.length - 1];
  const isOriginAnimatable = isAnimatable(originKeyframe, name);
  const isTargetAnimatable = isAnimatable(targetKeyframe, name);
  warning(isOriginAnimatable === isTargetAnimatable, `You are trying to animate ${name} from "${originKeyframe}" to "${targetKeyframe}". "${isOriginAnimatable ? targetKeyframe : originKeyframe}" is not an animatable value.`, "value-not-animatable");
  if (!isOriginAnimatable || !isTargetAnimatable) {
    return false;
  }
  return hasKeyframesChanged(keyframes2) || (type === "spring" || isGenerator(type)) && velocity;
}
var init_can_animate = __esm(() => {
  init_es();
  init_is_generator();
  init_is_animatable();
});

// node_modules/motion-dom/dist/es/animation/utils/make-animation-instant.mjs
function makeAnimationInstant(options) {
  options.duration = 0;
  options.type = "keyframes";
}
var init_make_animation_instant = () => {};

// node_modules/motion-dom/dist/es/animation/waapi/utils/accelerated-values.mjs
var acceleratedValues;
var init_accelerated_values = __esm(() => {
  acceleratedValues = new Set([
    "opacity",
    "clipPath",
    "filter",
    "transform"
  ]);
});

// node_modules/motion-dom/dist/es/animation/waapi/utils/is-browser-color.mjs
function hasBrowserOnlyColors(keyframes2) {
  for (let i = 0;i < keyframes2.length; i++) {
    if (typeof keyframes2[i] === "string" && browserColorFunctions.test(keyframes2[i])) {
      return true;
    }
  }
  return false;
}
var browserColorFunctions;
var init_is_browser_color = __esm(() => {
  browserColorFunctions = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
});

// node_modules/motion-dom/dist/es/animation/waapi/supports/waapi.mjs
function supportsBrowserAnimation(options) {
  const { motionValue, name, repeatDelay, repeatType, damping, type, keyframes: keyframes2 } = options;
  const subject = motionValue?.owner?.current;
  if (!(subject instanceof HTMLElement)) {
    return false;
  }
  const { onUpdate, transformTemplate } = motionValue.owner.getProps();
  return supportsWaapi() && name && (acceleratedValues.has(name) || colorProperties.has(name) && hasBrowserOnlyColors(keyframes2)) && (name !== "transform" || !transformTemplate) && !onUpdate && !repeatDelay && repeatType !== "mirror" && damping !== 0 && type !== "inertia";
}
var colorProperties, supportsWaapi;
var init_waapi = __esm(() => {
  init_es();
  init_accelerated_values();
  init_is_browser_color();
  colorProperties = new Set([
    "color",
    "backgroundColor",
    "outlineColor",
    "fill",
    "stroke",
    "borderColor",
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor"
  ]);
  supportsWaapi = /* @__PURE__ */ memo(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
});

// node_modules/motion-dom/dist/es/animation/AsyncMotionValueAnimation.mjs
var MAX_RESOLVE_DELAY = 40, AsyncMotionValueAnimation;
var init_AsyncMotionValueAnimation = __esm(() => {
  init_es();
  init_sync_time();
  init_JSAnimation();
  init_get_final();
  init_KeyframesResolver();
  init_NativeAnimationExtended();
  init_can_animate();
  init_make_animation_instant();
  init_WithPromise();
  init_waapi();
  AsyncMotionValueAnimation = class AsyncMotionValueAnimation extends WithPromise {
    constructor({ autoplay = true, delay = 0, type = "keyframes", repeat = 0, repeatDelay = 0, repeatType = "loop", keyframes: keyframes2, name, motionValue, element, ...options }) {
      super();
      this.stop = () => {
        if (this._animation) {
          this._animation.stop();
          this.stopTimeline?.();
        }
        this.keyframeResolver?.cancel();
      };
      this.createdAt = time.now();
      const optionsWithDefaults = {
        autoplay,
        delay,
        type,
        repeat,
        repeatDelay,
        repeatType,
        name,
        motionValue,
        element,
        ...options
      };
      const KeyframeResolver$1 = element?.KeyframeResolver || KeyframeResolver;
      this.keyframeResolver = new KeyframeResolver$1(keyframes2, (resolvedKeyframes, finalKeyframe, forced) => this.onKeyframesResolved(resolvedKeyframes, finalKeyframe, optionsWithDefaults, !forced), name, motionValue, element);
      this.keyframeResolver?.scheduleResolve();
    }
    onKeyframesResolved(keyframes2, finalKeyframe, options, sync) {
      this.keyframeResolver = undefined;
      const { name, type, velocity, delay, isHandoff, onUpdate } = options;
      this.resolvedAt = time.now();
      let canAnimateValue = true;
      if (!canAnimate(keyframes2, name, type, velocity)) {
        canAnimateValue = false;
        if (MotionGlobalConfig.instantAnimations || !delay) {
          onUpdate?.(getFinalKeyframe(keyframes2, options, finalKeyframe));
        }
        keyframes2[0] = keyframes2[keyframes2.length - 1];
        makeAnimationInstant(options);
        options.repeat = 0;
      }
      const startTime = sync ? !this.resolvedAt ? this.createdAt : this.resolvedAt - this.createdAt > MAX_RESOLVE_DELAY ? this.resolvedAt : this.createdAt : undefined;
      const resolvedOptions = {
        startTime,
        finalKeyframe,
        ...options,
        keyframes: keyframes2
      };
      const useWaapi = canAnimateValue && !isHandoff && supportsBrowserAnimation(resolvedOptions);
      const element = resolvedOptions.motionValue?.owner?.current;
      let animation;
      if (useWaapi) {
        try {
          animation = new NativeAnimationExtended({
            ...resolvedOptions,
            element
          });
        } catch {
          animation = new JSAnimation(resolvedOptions);
        }
      } else {
        animation = new JSAnimation(resolvedOptions);
      }
      animation.finished.then(() => {
        this.notifyFinished();
      }).catch(noop);
      if (this.pendingTimeline) {
        this.stopTimeline = animation.attachTimeline(this.pendingTimeline);
        this.pendingTimeline = undefined;
      }
      this._animation = animation;
    }
    get finished() {
      if (!this._animation) {
        return this._finished;
      } else {
        return this.animation.finished;
      }
    }
    then(onResolve, _onReject) {
      return this.finished.finally(onResolve).then(() => {});
    }
    get animation() {
      if (!this._animation) {
        this.keyframeResolver?.resume();
        flushKeyframeResolvers();
      }
      return this._animation;
    }
    get duration() {
      return this.animation.duration;
    }
    get iterationDuration() {
      return this.animation.iterationDuration;
    }
    get time() {
      return this.animation.time;
    }
    set time(newTime) {
      this.animation.time = newTime;
    }
    get speed() {
      return this.animation.speed;
    }
    get state() {
      return this.animation.state;
    }
    set speed(newSpeed) {
      this.animation.speed = newSpeed;
    }
    get startTime() {
      return this.animation.startTime;
    }
    attachTimeline(timeline) {
      if (this._animation) {
        this.stopTimeline = this.animation.attachTimeline(timeline);
      } else {
        this.pendingTimeline = timeline;
      }
      return () => this.stop();
    }
    play() {
      this.animation.play();
    }
    pause() {
      this.animation.pause();
    }
    complete() {
      this.animation.complete();
    }
    cancel() {
      if (this._animation) {
        this.animation.cancel();
      }
      this.keyframeResolver?.cancel();
    }
  };
});

// node_modules/motion-dom/dist/es/animation/GroupAnimation.mjs
class GroupAnimation {
  constructor(animations) {
    this.stop = () => this.runAll("stop");
    this.animations = animations.filter(Boolean);
  }
  get finished() {
    return Promise.all(this.animations.map((animation) => animation.finished));
  }
  getAll(propName) {
    return this.animations[0][propName];
  }
  setAll(propName, newValue) {
    for (let i = 0;i < this.animations.length; i++) {
      this.animations[i][propName] = newValue;
    }
  }
  attachTimeline(timeline) {
    const subscriptions = this.animations.map((animation) => animation.attachTimeline(timeline));
    return () => {
      subscriptions.forEach((cancel, i) => {
        cancel && cancel();
        this.animations[i].stop();
      });
    };
  }
  get time() {
    return this.getAll("time");
  }
  set time(time2) {
    this.setAll("time", time2);
  }
  get speed() {
    return this.getAll("speed");
  }
  set speed(speed) {
    this.setAll("speed", speed);
  }
  get state() {
    return this.getAll("state");
  }
  get startTime() {
    return this.getAll("startTime");
  }
  get duration() {
    return getMax(this.animations, "duration");
  }
  get iterationDuration() {
    return getMax(this.animations, "iterationDuration");
  }
  runAll(methodName) {
    this.animations.forEach((controls) => controls[methodName]());
  }
  play() {
    this.runAll("play");
  }
  pause() {
    this.runAll("pause");
  }
  cancel() {
    this.runAll("cancel");
  }
  complete() {
    this.runAll("complete");
  }
}
function getMax(animations, propName) {
  let max = 0;
  for (let i = 0;i < animations.length; i++) {
    const value = animations[i][propName];
    if (value !== null && value > max) {
      max = value;
    }
  }
  return max;
}
var init_GroupAnimation = () => {};

// node_modules/motion-dom/dist/es/animation/GroupAnimationWithThen.mjs
var GroupAnimationWithThen;
var init_GroupAnimationWithThen = __esm(() => {
  init_GroupAnimation();
  GroupAnimationWithThen = class GroupAnimationWithThen extends GroupAnimation {
    then(onResolve, _onReject) {
      return this.finished.finally(onResolve).then(() => {});
    }
  };
});

// node_modules/motion-dom/dist/es/animation/utils/calc-child-stagger.mjs
function calcChildStagger(children, child, delayChildren, staggerChildren = 0, staggerDirection = 1) {
  const index = Array.from(children).sort((a, b) => a.sortNodePosition(b)).indexOf(child);
  const numChildren = children.size;
  const maxStaggerDuration = (numChildren - 1) * staggerChildren;
  const delayIsFunction = typeof delayChildren === "function";
  return delayIsFunction ? delayChildren(index, numChildren) : staggerDirection === 1 ? index * staggerChildren : maxStaggerDuration - index * staggerChildren;
}
var init_calc_child_stagger = () => {};

// node_modules/motion-dom/dist/es/animation/utils/css-variables-conversion.mjs
function parseCSSVariable(current) {
  const match = splitCSSVariableRegex.exec(current);
  if (!match)
    return [,];
  const [, token1, token2, fallback] = match;
  return [`--${token1 ?? token2}`, fallback];
}
function getVariableValue(current, element, depth = 1) {
  invariant(depth <= maxDepth, `Max CSS variable fallback depth detected in property "${current}". This may indicate a circular fallback dependency.`, "max-css-var-depth");
  const [token, fallback] = parseCSSVariable(current);
  if (!token)
    return;
  const resolved = window.getComputedStyle(element).getPropertyValue(token);
  if (resolved) {
    const trimmed = resolved.trim();
    return isNumericalString(trimmed) ? parseFloat(trimmed) : trimmed;
  }
  return isCSSVariableToken(fallback) ? getVariableValue(fallback, element, depth + 1) : fallback;
}
var splitCSSVariableRegex, maxDepth = 4;
var init_css_variables_conversion = __esm(() => {
  init_es();
  init_is_css_variable();
  splitCSSVariableRegex = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
});

// node_modules/motion-dom/dist/es/animation/utils/default-transitions.mjs
var underDampedSpring, criticallyDampedSpring = (target) => ({
  type: "spring",
  stiffness: 550,
  damping: target === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), keyframesTransition, ease, getDefaultTransition = (valueKey, { keyframes: keyframes2 }) => {
  if (keyframes2.length > 2) {
    return keyframesTransition;
  } else if (transformProps.has(valueKey)) {
    return valueKey.startsWith("scale") ? criticallyDampedSpring(keyframes2[1]) : underDampedSpring;
  }
  return ease;
};
var init_default_transitions = __esm(() => {
  init_keys_transform();
  underDampedSpring = {
    type: "spring",
    stiffness: 500,
    damping: 25,
    restSpeed: 10
  };
  keyframesTransition = {
    type: "keyframes",
    duration: 0.8
  };
  ease = {
    type: "keyframes",
    ease: [0.25, 0.1, 0.35, 1],
    duration: 0.3
  };
});

// node_modules/motion-dom/dist/es/animation/utils/resolve-transition.mjs
function resolveTransition(transition, parentTransition) {
  if (transition?.inherit && parentTransition) {
    const { inherit: _, ...rest } = transition;
    return { ...parentTransition, ...rest };
  }
  return transition;
}
var init_resolve_transition = () => {};

// node_modules/motion-dom/dist/es/animation/utils/get-value-transition.mjs
function getValueTransition(transition, key) {
  const valueTransition = transition?.[key] ?? transition?.["default"] ?? transition;
  if (valueTransition !== transition) {
    return resolveTransition(valueTransition, transition);
  }
  return valueTransition;
}
var init_get_value_transition = __esm(() => {
  init_resolve_transition();
});

// node_modules/motion-dom/dist/es/animation/utils/is-transition-defined.mjs
function isTransitionDefined(transition) {
  for (const key in transition) {
    if (!orchestrationKeys.has(key))
      return true;
  }
  return false;
}
var orchestrationKeys;
var init_is_transition_defined = __esm(() => {
  orchestrationKeys = new Set([
    "when",
    "delay",
    "delayChildren",
    "staggerChildren",
    "staggerDirection",
    "repeat",
    "repeatType",
    "repeatDelay",
    "from",
    "elapsed"
  ]);
});

// node_modules/motion-dom/dist/es/animation/interfaces/motion-value.mjs
var animateMotionValue = (name, value, target, transition = {}, element, isHandoff) => (onComplete) => {
  const valueTransition = getValueTransition(transition, name) || {};
  const delay = valueTransition.delay || transition.delay || 0;
  let { elapsed = 0 } = transition;
  elapsed = elapsed - secondsToMilliseconds(delay);
  const options = {
    keyframes: Array.isArray(target) ? target : [null, target],
    ease: "easeOut",
    velocity: value.getVelocity(),
    ...valueTransition,
    delay: -elapsed,
    onUpdate: (v) => {
      value.set(v);
      valueTransition.onUpdate && valueTransition.onUpdate(v);
    },
    onComplete: () => {
      onComplete();
      valueTransition.onComplete && valueTransition.onComplete();
    },
    name,
    motionValue: value,
    element: isHandoff ? undefined : element
  };
  if (!isTransitionDefined(valueTransition)) {
    Object.assign(options, getDefaultTransition(name, options));
  }
  options.duration && (options.duration = secondsToMilliseconds(options.duration));
  options.repeatDelay && (options.repeatDelay = secondsToMilliseconds(options.repeatDelay));
  if (options.from !== undefined) {
    options.keyframes[0] = options.from;
  }
  let shouldSkip = false;
  if (options.type === false || options.duration === 0 && !options.repeatDelay) {
    makeAnimationInstant(options);
    if (options.delay === 0) {
      shouldSkip = true;
    }
  }
  if (MotionGlobalConfig.instantAnimations || MotionGlobalConfig.skipAnimations || element?.shouldSkipAnimations) {
    shouldSkip = true;
    makeAnimationInstant(options);
    options.delay = 0;
  }
  options.allowFlatten = !valueTransition.type && !valueTransition.ease;
  if (shouldSkip && !isHandoff && value.get() !== undefined) {
    const finalKeyframe = getFinalKeyframe(options.keyframes, valueTransition);
    if (finalKeyframe !== undefined) {
      frame.update(() => {
        options.onUpdate(finalKeyframe);
        options.onComplete();
      });
      return;
    }
  }
  return valueTransition.isSync ? new JSAnimation(options) : new AsyncMotionValueAnimation(options);
};
var init_motion_value = __esm(() => {
  init_es();
  init_AsyncMotionValueAnimation();
  init_JSAnimation();
  init_get_value_transition();
  init_make_animation_instant();
  init_default_transitions();
  init_get_final();
  init_is_transition_defined();
  init_frame();
});

// node_modules/motion-dom/dist/es/render/utils/resolve-variants.mjs
function getValueState(visualElement) {
  const state = [{}, {}];
  visualElement?.values.forEach((value, key) => {
    state[0][key] = value.get();
    state[1][key] = value.getVelocity();
  });
  return state;
}
function resolveVariantFromProps(props, definition, custom, visualElement) {
  if (typeof definition === "function") {
    const [current, velocity] = getValueState(visualElement);
    definition = definition(custom !== undefined ? custom : props.custom, current, velocity);
  }
  if (typeof definition === "string") {
    definition = props.variants && props.variants[definition];
  }
  if (typeof definition === "function") {
    const [current, velocity] = getValueState(visualElement);
    definition = definition(custom !== undefined ? custom : props.custom, current, velocity);
  }
  return definition;
}
var init_resolve_variants = () => {};

// node_modules/motion-dom/dist/es/render/utils/resolve-dynamic-variants.mjs
function resolveVariant(visualElement, definition, custom) {
  const props = visualElement.getProps();
  return resolveVariantFromProps(props, definition, custom !== undefined ? custom : props.custom, visualElement);
}
var init_resolve_dynamic_variants = __esm(() => {
  init_resolve_variants();
});

// node_modules/motion-dom/dist/es/render/utils/keys-position.mjs
var positionalKeys;
var init_keys_position = __esm(() => {
  init_keys_transform();
  positionalKeys = new Set([
    "width",
    "height",
    "top",
    "left",
    "right",
    "bottom",
    ...transformPropOrder
  ]);
});

// node_modules/motion-dom/dist/es/value/index.mjs
class MotionValue {
  constructor(init, options = {}) {
    this.canTrackVelocity = null;
    this.events = {};
    this.updateAndNotify = (v) => {
      const currentTime = time.now();
      if (this.updatedAt !== currentTime) {
        this.setPrevFrameValue();
      }
      this.prev = this.current;
      this.setCurrent(v);
      if (this.current !== this.prev) {
        this.events.change?.notify(this.current);
        if (this.dependents) {
          for (const dependent of this.dependents) {
            dependent.dirty();
          }
        }
      }
    };
    this.hasAnimated = false;
    this.setCurrent(init);
    this.owner = options.owner;
  }
  setCurrent(current) {
    this.current = current;
    this.updatedAt = time.now();
    if (this.canTrackVelocity === null && current !== undefined) {
      this.canTrackVelocity = isFloat(this.current);
    }
  }
  setPrevFrameValue(prevFrameValue = this.current) {
    this.prevFrameValue = prevFrameValue;
    this.prevUpdatedAt = this.updatedAt;
  }
  onChange(subscription) {
    if (true) {
      warnOnce(false, `value.onChange(callback) is deprecated. Switch to value.on("change", callback).`);
    }
    return this.on("change", subscription);
  }
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = new SubscriptionManager;
    }
    const unsubscribe = this.events[eventName].add(callback);
    if (eventName === "change") {
      return () => {
        unsubscribe();
        frame.read(() => {
          if (!this.events.change.getSize()) {
            this.stop();
          }
        });
      };
    }
    return unsubscribe;
  }
  clearListeners() {
    for (const eventManagers in this.events) {
      this.events[eventManagers].clear();
    }
  }
  attach(passiveEffect, stopPassiveEffect) {
    this.passiveEffect = passiveEffect;
    this.stopPassiveEffect = stopPassiveEffect;
  }
  set(v) {
    if (!this.passiveEffect) {
      this.updateAndNotify(v);
    } else {
      this.passiveEffect(v, this.updateAndNotify);
    }
  }
  setWithVelocity(prev, current, delta) {
    this.set(current);
    this.prev = undefined;
    this.prevFrameValue = prev;
    this.prevUpdatedAt = this.updatedAt - delta;
  }
  jump(v, endAnimation = true) {
    this.updateAndNotify(v);
    this.prev = v;
    this.prevUpdatedAt = this.prevFrameValue = undefined;
    endAnimation && this.stop();
    if (this.stopPassiveEffect)
      this.stopPassiveEffect();
  }
  dirty() {
    this.events.change?.notify(this.current);
  }
  addDependent(dependent) {
    if (!this.dependents) {
      this.dependents = new Set;
    }
    this.dependents.add(dependent);
  }
  removeDependent(dependent) {
    if (this.dependents) {
      this.dependents.delete(dependent);
    }
  }
  get() {
    if (collectMotionValues.current) {
      collectMotionValues.current.push(this);
    }
    return this.current;
  }
  getPrevious() {
    return this.prev;
  }
  getVelocity() {
    const currentTime = time.now();
    if (!this.canTrackVelocity || this.prevFrameValue === undefined || currentTime - this.updatedAt > MAX_VELOCITY_DELTA) {
      return 0;
    }
    const delta = Math.min(this.updatedAt - this.prevUpdatedAt, MAX_VELOCITY_DELTA);
    return velocityPerSecond(parseFloat(this.current) - parseFloat(this.prevFrameValue), delta);
  }
  start(startAnimation) {
    this.stop();
    return new Promise((resolve) => {
      this.hasAnimated = true;
      this.animation = startAnimation(resolve);
      if (this.events.animationStart) {
        this.events.animationStart.notify();
      }
    }).then(() => {
      if (this.events.animationComplete) {
        this.events.animationComplete.notify();
      }
      this.clearAnimation();
    });
  }
  stop() {
    if (this.animation) {
      this.animation.stop();
      if (this.events.animationCancel) {
        this.events.animationCancel.notify();
      }
    }
    this.clearAnimation();
  }
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  destroy() {
    this.dependents?.clear();
    this.events.destroy?.notify();
    this.clearListeners();
    this.stop();
    if (this.stopPassiveEffect) {
      this.stopPassiveEffect();
    }
  }
}
function motionValue(init, options) {
  return new MotionValue(init, options);
}
var MAX_VELOCITY_DELTA = 30, isFloat = (value) => {
  return !isNaN(parseFloat(value));
}, collectMotionValues;
var init_value = __esm(() => {
  init_es();
  init_sync_time();
  init_frame();
  collectMotionValues = {
    current: undefined
  };
});

// node_modules/motion-dom/dist/es/render/utils/is-keyframes-target.mjs
var isKeyframesTarget = (v) => {
  return Array.isArray(v);
};
var init_is_keyframes_target = () => {};

// node_modules/motion-dom/dist/es/render/utils/setters.mjs
function setMotionValue(visualElement, key, value) {
  if (visualElement.hasValue(key)) {
    visualElement.getValue(key).set(value);
  } else {
    visualElement.addValue(key, motionValue(value));
  }
}
function resolveFinalValueInKeyframes(v) {
  return isKeyframesTarget(v) ? v[v.length - 1] || 0 : v;
}
function setTarget(visualElement, definition) {
  const resolved = resolveVariant(visualElement, definition);
  let { transitionEnd = {}, transition = {}, ...target } = resolved || {};
  target = { ...target, ...transitionEnd };
  for (const key in target) {
    const value = resolveFinalValueInKeyframes(target[key]);
    setMotionValue(visualElement, key, value);
  }
}
var init_setters = __esm(() => {
  init_value();
  init_resolve_dynamic_variants();
  init_is_keyframes_target();
});

// node_modules/motion-dom/dist/es/value/utils/is-motion-value.mjs
var isMotionValue = (value) => Boolean(value && value.getVelocity);
var init_is_motion_value = () => {};

// node_modules/motion-dom/dist/es/value/will-change/is.mjs
function isWillChangeMotionValue(value) {
  return Boolean(isMotionValue(value) && value.add);
}
var init_is = __esm(() => {
  init_is_motion_value();
});

// node_modules/motion-dom/dist/es/value/will-change/add-will-change.mjs
function addValueToWillChange(visualElement, key) {
  const willChange = visualElement.getValue("willChange");
  if (isWillChangeMotionValue(willChange)) {
    return willChange.add(key);
  } else if (!willChange && MotionGlobalConfig.WillChange) {
    const newWillChange = new MotionGlobalConfig.WillChange("auto");
    visualElement.addValue("willChange", newWillChange);
    newWillChange.add(key);
  }
}
var init_add_will_change = __esm(() => {
  init_es();
  init_is();
});

// node_modules/motion-dom/dist/es/render/dom/utils/camel-to-dash.mjs
function camelToDash(str) {
  return str.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
}
var init_camel_to_dash = () => {};

// node_modules/motion-dom/dist/es/animation/optimized-appear/data-id.mjs
var optimizedAppearDataId = "framerAppearId", optimizedAppearDataAttribute;
var init_data_id = __esm(() => {
  init_camel_to_dash();
  optimizedAppearDataAttribute = "data-" + camelToDash(optimizedAppearDataId);
});

// node_modules/motion-dom/dist/es/animation/optimized-appear/get-appear-id.mjs
function getOptimisedAppearId(visualElement) {
  return visualElement.props[optimizedAppearDataAttribute];
}
var init_get_appear_id = __esm(() => {
  init_data_id();
});

// node_modules/motion-dom/dist/es/animation/interfaces/visual-element-target.mjs
function shouldBlockAnimation({ protectedKeys, needsAnimating }, key) {
  const shouldBlock = protectedKeys.hasOwnProperty(key) && needsAnimating[key] !== true;
  needsAnimating[key] = false;
  return shouldBlock;
}
function animateTarget(visualElement, targetAndTransition, { delay = 0, transitionOverride, type } = {}) {
  let { transition, transitionEnd, ...target } = targetAndTransition;
  const defaultTransition = visualElement.getDefaultTransition();
  transition = transition ? resolveTransition(transition, defaultTransition) : defaultTransition;
  const reduceMotion = transition?.reduceMotion;
  if (transitionOverride)
    transition = transitionOverride;
  const animations = [];
  const animationTypeState = type && visualElement.animationState && visualElement.animationState.getState()[type];
  for (const key in target) {
    const value = visualElement.getValue(key, visualElement.latestValues[key] ?? null);
    const valueTarget = target[key];
    if (valueTarget === undefined || animationTypeState && shouldBlockAnimation(animationTypeState, key)) {
      continue;
    }
    const valueTransition = {
      delay,
      ...getValueTransition(transition || {}, key)
    };
    const currentValue = value.get();
    if (currentValue !== undefined && !value.isAnimating() && !Array.isArray(valueTarget) && valueTarget === currentValue && !valueTransition.velocity) {
      frame.update(() => value.set(valueTarget));
      continue;
    }
    let isHandoff = false;
    if (window.MotionHandoffAnimation) {
      const appearId = getOptimisedAppearId(visualElement);
      if (appearId) {
        const startTime = window.MotionHandoffAnimation(appearId, key, frame);
        if (startTime !== null) {
          valueTransition.startTime = startTime;
          isHandoff = true;
        }
      }
    }
    addValueToWillChange(visualElement, key);
    const shouldReduceMotion = reduceMotion ?? visualElement.shouldReduceMotion;
    value.start(animateMotionValue(key, value, valueTarget, shouldReduceMotion && positionalKeys.has(key) ? { type: false } : valueTransition, visualElement, isHandoff));
    const animation = value.animation;
    if (animation) {
      animations.push(animation);
    }
  }
  if (transitionEnd) {
    const applyTransitionEnd = () => frame.update(() => {
      transitionEnd && setTarget(visualElement, transitionEnd);
    });
    if (animations.length) {
      Promise.all(animations).then(applyTransitionEnd);
    } else {
      applyTransitionEnd();
    }
  }
  return animations;
}
var init_visual_element_target = __esm(() => {
  init_get_value_transition();
  init_resolve_transition();
  init_keys_position();
  init_setters();
  init_add_will_change();
  init_get_appear_id();
  init_motion_value();
  init_frame();
});

// node_modules/motion-dom/dist/es/animation/interfaces/visual-element-variant.mjs
function animateVariant(visualElement, variant, options = {}) {
  const resolved = resolveVariant(visualElement, variant, options.type === "exit" ? visualElement.presenceContext?.custom : undefined);
  let { transition = visualElement.getDefaultTransition() || {} } = resolved || {};
  if (options.transitionOverride) {
    transition = options.transitionOverride;
  }
  const getAnimation = resolved ? () => Promise.all(animateTarget(visualElement, resolved, options)) : () => Promise.resolve();
  const getChildAnimations = visualElement.variantChildren && visualElement.variantChildren.size ? (forwardDelay = 0) => {
    const { delayChildren = 0, staggerChildren, staggerDirection } = transition;
    return animateChildren(visualElement, variant, forwardDelay, delayChildren, staggerChildren, staggerDirection, options);
  } : () => Promise.resolve();
  const { when } = transition;
  if (when) {
    const [first, last] = when === "beforeChildren" ? [getAnimation, getChildAnimations] : [getChildAnimations, getAnimation];
    return first().then(() => last());
  } else {
    return Promise.all([getAnimation(), getChildAnimations(options.delay)]);
  }
}
function animateChildren(visualElement, variant, delay = 0, delayChildren = 0, staggerChildren = 0, staggerDirection = 1, options) {
  const animations = [];
  for (const child of visualElement.variantChildren) {
    child.notify("AnimationStart", variant);
    animations.push(animateVariant(child, variant, {
      ...options,
      delay: delay + (typeof delayChildren === "function" ? 0 : delayChildren) + calcChildStagger(visualElement.variantChildren, child, delayChildren, staggerChildren, staggerDirection)
    }).then(() => child.notify("AnimationComplete", variant)));
  }
  return Promise.all(animations);
}
var init_visual_element_variant = __esm(() => {
  init_resolve_dynamic_variants();
  init_calc_child_stagger();
  init_visual_element_target();
});

// node_modules/motion-dom/dist/es/animation/interfaces/visual-element.mjs
function animateVisualElement(visualElement, definition, options = {}) {
  visualElement.notify("AnimationStart", definition);
  let animation;
  if (Array.isArray(definition)) {
    const animations = definition.map((variant) => animateVariant(visualElement, variant, options));
    animation = Promise.all(animations);
  } else if (typeof definition === "string") {
    animation = animateVariant(visualElement, definition, options);
  } else {
    const resolvedDefinition = typeof definition === "function" ? resolveVariant(visualElement, definition, options.custom) : definition;
    animation = Promise.all(animateTarget(visualElement, resolvedDefinition, options));
  }
  return animation.then(() => {
    visualElement.notify("AnimationComplete", definition);
  });
}
var init_visual_element = __esm(() => {
  init_resolve_dynamic_variants();
  init_visual_element_target();
  init_visual_element_variant();
});

// node_modules/motion-dom/dist/es/value/types/auto.mjs
var auto;
var init_auto = __esm(() => {
  auto = {
    test: (v) => v === "auto",
    parse: (v) => v
  };
});

// node_modules/motion-dom/dist/es/value/types/test.mjs
var testValueType = (v) => (type) => type.test(v);
var init_test = () => {};

// node_modules/motion-dom/dist/es/value/types/dimensions.mjs
var dimensionValueTypes, findDimensionValueType = (v) => dimensionValueTypes.find(testValueType(v));
var init_dimensions = __esm(() => {
  init_auto();
  init_numbers();
  init_units();
  init_test();
  dimensionValueTypes = [number, px, percent, degrees, vw, vh, auto];
});

// node_modules/motion-dom/dist/es/animation/keyframes/utils/is-none.mjs
function isNone(value) {
  if (typeof value === "number") {
    return value === 0;
  } else if (value !== null) {
    return value === "none" || value === "0" || isZeroValueString(value);
  } else {
    return true;
  }
}
var init_is_none = __esm(() => {
  init_es();
});

// node_modules/motion-dom/dist/es/value/types/complex/filter.mjs
function applyDefaultFilter(v) {
  const [name, value] = v.slice(0, -1).split("(");
  if (name === "drop-shadow")
    return v;
  const [number2] = value.match(floatRegex) || [];
  if (!number2)
    return v;
  const unit = value.replace(number2, "");
  let defaultValue = maxDefaults.has(name) ? 1 : 0;
  if (number2 !== value)
    defaultValue *= 100;
  return name + "(" + defaultValue + unit + ")";
}
var maxDefaults, functionRegex, filter;
var init_filter = __esm(() => {
  init_complex();
  init_float_regex();
  maxDefaults = new Set(["brightness", "contrast", "saturate", "opacity"]);
  functionRegex = /\b([a-z-]*)\(.*?\)/gu;
  filter = {
    ...complex,
    getAnimatableNone: (v) => {
      const functions = v.match(functionRegex);
      return functions ? functions.map(applyDefaultFilter).join(" ") : v;
    }
  };
});

// node_modules/motion-dom/dist/es/value/types/complex/mask.mjs
var mask;
var init_mask = __esm(() => {
  init_complex();
  mask = {
    ...complex,
    getAnimatableNone: (v) => {
      const parsed = complex.parse(v);
      const transformer = complex.createTransformer(v);
      return transformer(parsed.map((v2) => typeof v2 === "number" ? 0 : typeof v2 === "object" ? { ...v2, alpha: 1 } : v2));
    }
  };
});

// node_modules/motion-dom/dist/es/value/types/int.mjs
var int;
var init_int = __esm(() => {
  init_numbers();
  int = {
    ...number,
    transform: Math.round
  };
});

// node_modules/motion-dom/dist/es/value/types/maps/transform.mjs
var transformValueTypes;
var init_transform = __esm(() => {
  init_numbers();
  init_units();
  transformValueTypes = {
    rotate: degrees,
    rotateX: degrees,
    rotateY: degrees,
    rotateZ: degrees,
    scale,
    scaleX: scale,
    scaleY: scale,
    scaleZ: scale,
    skew: degrees,
    skewX: degrees,
    skewY: degrees,
    distance: px,
    translateX: px,
    translateY: px,
    translateZ: px,
    x: px,
    y: px,
    z: px,
    perspective: px,
    transformPerspective: px,
    opacity: alpha,
    originX: progressPercentage,
    originY: progressPercentage,
    originZ: px
  };
});

// node_modules/motion-dom/dist/es/value/types/maps/number.mjs
var numberValueTypes;
var init_number2 = __esm(() => {
  init_int();
  init_numbers();
  init_units();
  init_transform();
  numberValueTypes = {
    borderWidth: px,
    borderTopWidth: px,
    borderRightWidth: px,
    borderBottomWidth: px,
    borderLeftWidth: px,
    borderRadius: px,
    borderTopLeftRadius: px,
    borderTopRightRadius: px,
    borderBottomRightRadius: px,
    borderBottomLeftRadius: px,
    width: px,
    maxWidth: px,
    height: px,
    maxHeight: px,
    top: px,
    right: px,
    bottom: px,
    left: px,
    inset: px,
    insetBlock: px,
    insetBlockStart: px,
    insetBlockEnd: px,
    insetInline: px,
    insetInlineStart: px,
    insetInlineEnd: px,
    padding: px,
    paddingTop: px,
    paddingRight: px,
    paddingBottom: px,
    paddingLeft: px,
    paddingBlock: px,
    paddingBlockStart: px,
    paddingBlockEnd: px,
    paddingInline: px,
    paddingInlineStart: px,
    paddingInlineEnd: px,
    margin: px,
    marginTop: px,
    marginRight: px,
    marginBottom: px,
    marginLeft: px,
    marginBlock: px,
    marginBlockStart: px,
    marginBlockEnd: px,
    marginInline: px,
    marginInlineStart: px,
    marginInlineEnd: px,
    fontSize: px,
    backgroundPositionX: px,
    backgroundPositionY: px,
    ...transformValueTypes,
    zIndex: int,
    fillOpacity: alpha,
    strokeOpacity: alpha,
    numOctaves: int
  };
});

// node_modules/motion-dom/dist/es/value/types/maps/defaults.mjs
var defaultValueTypes, getDefaultValueType = (key) => defaultValueTypes[key];
var init_defaults = __esm(() => {
  init_color();
  init_filter();
  init_mask();
  init_number2();
  defaultValueTypes = {
    ...numberValueTypes,
    color,
    backgroundColor: color,
    outlineColor: color,
    fill: color,
    stroke: color,
    borderColor: color,
    borderTopColor: color,
    borderRightColor: color,
    borderBottomColor: color,
    borderLeftColor: color,
    filter,
    WebkitFilter: filter,
    mask,
    WebkitMask: mask
  };
});

// node_modules/motion-dom/dist/es/value/types/utils/animatable-none.mjs
function getAnimatableNone2(key, value) {
  let defaultValueType = getDefaultValueType(key);
  if (!customTypes.has(defaultValueType))
    defaultValueType = complex;
  return defaultValueType.getAnimatableNone ? defaultValueType.getAnimatableNone(value) : undefined;
}
var customTypes;
var init_animatable_none = __esm(() => {
  init_complex();
  init_filter();
  init_mask();
  init_defaults();
  customTypes = /* @__PURE__ */ new Set([filter, mask]);
});

// node_modules/motion-dom/dist/es/animation/keyframes/utils/make-none-animatable.mjs
function makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name) {
  let i = 0;
  let animatableTemplate = undefined;
  while (i < unresolvedKeyframes.length && !animatableTemplate) {
    const keyframe = unresolvedKeyframes[i];
    if (typeof keyframe === "string" && !invalidTemplates.has(keyframe) && analyseComplexValue(keyframe).values.length) {
      animatableTemplate = unresolvedKeyframes[i];
    }
    i++;
  }
  if (animatableTemplate && name) {
    for (const noneIndex of noneKeyframeIndexes) {
      unresolvedKeyframes[noneIndex] = getAnimatableNone2(name, animatableTemplate);
    }
  }
}
var invalidTemplates;
var init_make_none_animatable = __esm(() => {
  init_complex();
  init_animatable_none();
  invalidTemplates = new Set(["auto", "none", "0"]);
});

// node_modules/motion-dom/dist/es/animation/keyframes/DOMKeyframesResolver.mjs
var DOMKeyframesResolver;
var init_DOMKeyframesResolver = __esm(() => {
  init_keys_position();
  init_dimensions();
  init_css_variables_conversion();
  init_is_css_variable();
  init_KeyframesResolver();
  init_is_none();
  init_make_none_animatable();
  init_unit_conversion();
  DOMKeyframesResolver = class DOMKeyframesResolver extends KeyframeResolver {
    constructor(unresolvedKeyframes, onComplete, name, motionValue2, element) {
      super(unresolvedKeyframes, onComplete, name, motionValue2, element, true);
    }
    readKeyframes() {
      const { unresolvedKeyframes, element, name } = this;
      if (!element || !element.current)
        return;
      super.readKeyframes();
      for (let i = 0;i < unresolvedKeyframes.length; i++) {
        let keyframe = unresolvedKeyframes[i];
        if (typeof keyframe === "string") {
          keyframe = keyframe.trim();
          if (isCSSVariableToken(keyframe)) {
            const resolved = getVariableValue(keyframe, element.current);
            if (resolved !== undefined) {
              unresolvedKeyframes[i] = resolved;
            }
            if (i === unresolvedKeyframes.length - 1) {
              this.finalKeyframe = keyframe;
            }
          }
        }
      }
      this.resolveNoneKeyframes();
      if (!positionalKeys.has(name) || unresolvedKeyframes.length !== 2) {
        return;
      }
      const [origin, target] = unresolvedKeyframes;
      const originType = findDimensionValueType(origin);
      const targetType = findDimensionValueType(target);
      const originHasVar = containsCSSVariable(origin);
      const targetHasVar = containsCSSVariable(target);
      if (originHasVar !== targetHasVar && positionalValues[name]) {
        this.needsMeasurement = true;
        return;
      }
      if (originType === targetType)
        return;
      if (isNumOrPxType(originType) && isNumOrPxType(targetType)) {
        for (let i = 0;i < unresolvedKeyframes.length; i++) {
          const value = unresolvedKeyframes[i];
          if (typeof value === "string") {
            unresolvedKeyframes[i] = parseFloat(value);
          }
        }
      } else if (positionalValues[name]) {
        this.needsMeasurement = true;
      }
    }
    resolveNoneKeyframes() {
      const { unresolvedKeyframes, name } = this;
      const noneKeyframeIndexes = [];
      for (let i = 0;i < unresolvedKeyframes.length; i++) {
        if (unresolvedKeyframes[i] === null || isNone(unresolvedKeyframes[i])) {
          noneKeyframeIndexes.push(i);
        }
      }
      if (noneKeyframeIndexes.length) {
        makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name);
      }
    }
    measureInitialState() {
      const { element, unresolvedKeyframes, name } = this;
      if (!element || !element.current)
        return;
      if (name === "height") {
        this.suspendedScrollY = window.pageYOffset;
      }
      this.measuredOrigin = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
      unresolvedKeyframes[0] = this.measuredOrigin;
      const measureKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
      if (measureKeyframe !== undefined) {
        element.getValue(name, measureKeyframe).jump(measureKeyframe, false);
      }
    }
    measureEndState() {
      const { element, name, unresolvedKeyframes } = this;
      if (!element || !element.current)
        return;
      const value = element.getValue(name);
      value && value.jump(this.measuredOrigin, false);
      const finalKeyframeIndex = unresolvedKeyframes.length - 1;
      const finalKeyframe = unresolvedKeyframes[finalKeyframeIndex];
      unresolvedKeyframes[finalKeyframeIndex] = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
      if (finalKeyframe !== null && this.finalKeyframe === undefined) {
        this.finalKeyframe = finalKeyframe;
      }
      if (this.removedTransforms?.length) {
        this.removedTransforms.forEach(([unsetTransformName, unsetTransformValue]) => {
          element.getValue(unsetTransformName).set(unsetTransformValue);
        });
      }
      this.resolveNoneKeyframes();
    }
  };
});

// node_modules/motion-dom/dist/es/utils/resolve-elements.mjs
function resolveElements(elementOrSelector, scope, selectorCache) {
  if (elementOrSelector == null) {
    return [];
  }
  if (elementOrSelector instanceof EventTarget) {
    return [elementOrSelector];
  } else if (typeof elementOrSelector === "string") {
    let root = document;
    if (scope) {
      root = scope.current;
    }
    const elements = selectorCache?.[elementOrSelector] ?? root.querySelectorAll(elementOrSelector);
    return elements ? Array.from(elements) : [];
  }
  return Array.from(elementOrSelector).filter((element) => element != null);
}
var init_resolve_elements = () => {};

// node_modules/motion-dom/dist/es/value/types/utils/get-as-type.mjs
var getValueAsType = (value, type) => {
  return type && typeof value === "number" ? type.transform(value) : value;
};
var init_get_as_type = () => {};

// node_modules/motion-dom/dist/es/utils/is-html-element.mjs
function isHTMLElement(element) {
  return isObject(element) && "offsetHeight" in element && !("ownerSVGElement" in element);
}
var init_is_html_element = __esm(() => {
  init_es();
});

// node_modules/motion-dom/dist/es/frameloop/microtask.mjs
var microtask, cancelMicrotask;
var init_microtask = __esm(() => {
  init_batcher();
  ({ schedule: microtask, cancel: cancelMicrotask } = /* @__PURE__ */ createRenderBatcher(queueMicrotask, false));
});

// node_modules/motion-dom/dist/es/gestures/drag/state/is-active.mjs
function isDragActive() {
  return isDragging.x || isDragging.y;
}
var isDragging;
var init_is_active = __esm(() => {
  isDragging = {
    x: false,
    y: false
  };
});

// node_modules/motion-dom/dist/es/gestures/drag/state/set-active.mjs
function setDragLock(axis) {
  if (axis === "x" || axis === "y") {
    if (isDragging[axis]) {
      return null;
    } else {
      isDragging[axis] = true;
      return () => {
        isDragging[axis] = false;
      };
    }
  } else {
    if (isDragging.x || isDragging.y) {
      return null;
    } else {
      isDragging.x = isDragging.y = true;
      return () => {
        isDragging.x = isDragging.y = false;
      };
    }
  }
}
var init_set_active = __esm(() => {
  init_is_active();
});

// node_modules/motion-dom/dist/es/gestures/utils/setup.mjs
function setupGesture(elementOrSelector, options) {
  const elements = resolveElements(elementOrSelector);
  const gestureAbortController = new AbortController;
  const eventOptions = {
    passive: true,
    ...options,
    signal: gestureAbortController.signal
  };
  const cancel = () => gestureAbortController.abort();
  return [elements, eventOptions, cancel];
}
var init_setup = __esm(() => {
  init_resolve_elements();
});

// node_modules/motion-dom/dist/es/gestures/hover.mjs
function isValidHover(event) {
  return !(event.pointerType === "touch" || isDragActive());
}
function hover(elementOrSelector, onHoverStart, options = {}) {
  const [elements, eventOptions, cancel] = setupGesture(elementOrSelector, options);
  elements.forEach((element) => {
    let isPressed = false;
    let deferredHoverEnd = false;
    let hoverEndCallback;
    const removePointerLeave = () => {
      element.removeEventListener("pointerleave", onPointerLeave);
    };
    const endHover = (event) => {
      if (hoverEndCallback) {
        hoverEndCallback(event);
        hoverEndCallback = undefined;
      }
      removePointerLeave();
    };
    const onPointerUp = (event) => {
      isPressed = false;
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      if (deferredHoverEnd) {
        deferredHoverEnd = false;
        endHover(event);
      }
    };
    const onPointerDown = () => {
      isPressed = true;
      window.addEventListener("pointerup", onPointerUp, eventOptions);
      window.addEventListener("pointercancel", onPointerUp, eventOptions);
    };
    const onPointerLeave = (leaveEvent) => {
      if (leaveEvent.pointerType === "touch")
        return;
      if (isPressed) {
        deferredHoverEnd = true;
        return;
      }
      endHover(leaveEvent);
    };
    const onPointerEnter = (enterEvent) => {
      if (!isValidHover(enterEvent))
        return;
      deferredHoverEnd = false;
      const onHoverEnd = onHoverStart(element, enterEvent);
      if (typeof onHoverEnd !== "function")
        return;
      hoverEndCallback = onHoverEnd;
      element.addEventListener("pointerleave", onPointerLeave, eventOptions);
    };
    element.addEventListener("pointerenter", onPointerEnter, eventOptions);
    element.addEventListener("pointerdown", onPointerDown, eventOptions);
  });
  return cancel;
}
var init_hover = __esm(() => {
  init_is_active();
  init_setup();
});

// node_modules/motion-dom/dist/es/gestures/utils/is-node-or-child.mjs
var isNodeOrChild = (parent, child) => {
  if (!child) {
    return false;
  } else if (parent === child) {
    return true;
  } else {
    return isNodeOrChild(parent, child.parentElement);
  }
};
var init_is_node_or_child = () => {};

// node_modules/motion-dom/dist/es/gestures/utils/is-primary-pointer.mjs
var isPrimaryPointer = (event) => {
  if (event.pointerType === "mouse") {
    return typeof event.button !== "number" || event.button <= 0;
  } else {
    return event.isPrimary !== false;
  }
};
var init_is_primary_pointer = () => {};

// node_modules/motion-dom/dist/es/gestures/press/utils/is-keyboard-accessible.mjs
function isElementKeyboardAccessible(element) {
  return keyboardAccessibleElements.has(element.tagName) || element.isContentEditable === true;
}
function isElementTextInput(element) {
  return textInputElements.has(element.tagName) || element.isContentEditable === true;
}
var keyboardAccessibleElements, textInputElements;
var init_is_keyboard_accessible = __esm(() => {
  keyboardAccessibleElements = new Set([
    "BUTTON",
    "INPUT",
    "SELECT",
    "TEXTAREA",
    "A"
  ]);
  textInputElements = new Set(["INPUT", "SELECT", "TEXTAREA"]);
});

// node_modules/motion-dom/dist/es/gestures/press/utils/state.mjs
var isPressing;
var init_state = __esm(() => {
  isPressing = new WeakSet;
});

// node_modules/motion-dom/dist/es/gestures/press/utils/keyboard.mjs
function filterEvents(callback) {
  return (event) => {
    if (event.key !== "Enter")
      return;
    callback(event);
  };
}
function firePointerEvent(target, type) {
  target.dispatchEvent(new PointerEvent("pointer" + type, { isPrimary: true, bubbles: true }));
}
var enableKeyboardPress = (focusEvent, eventOptions) => {
  const element = focusEvent.currentTarget;
  if (!element)
    return;
  const handleKeydown = filterEvents(() => {
    if (isPressing.has(element))
      return;
    firePointerEvent(element, "down");
    const handleKeyup = filterEvents(() => {
      firePointerEvent(element, "up");
    });
    const handleBlur = () => firePointerEvent(element, "cancel");
    element.addEventListener("keyup", handleKeyup, eventOptions);
    element.addEventListener("blur", handleBlur, eventOptions);
  });
  element.addEventListener("keydown", handleKeydown, eventOptions);
  element.addEventListener("blur", () => element.removeEventListener("keydown", handleKeydown), eventOptions);
};
var init_keyboard = __esm(() => {
  init_state();
});

// node_modules/motion-dom/dist/es/gestures/press/index.mjs
function isValidPressEvent(event) {
  return isPrimaryPointer(event) && !isDragActive();
}
function press(targetOrSelector, onPressStart, options = {}) {
  const [targets, eventOptions, cancelEvents] = setupGesture(targetOrSelector, options);
  const startPress = (startEvent) => {
    const target = startEvent.currentTarget;
    if (!isValidPressEvent(startEvent))
      return;
    if (claimedPointerDownEvents.has(startEvent))
      return;
    isPressing.add(target);
    if (options.stopPropagation) {
      claimedPointerDownEvents.add(startEvent);
    }
    const onPressEnd = onPressStart(target, startEvent);
    const onPointerEnd = (endEvent, success) => {
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      if (isPressing.has(target)) {
        isPressing.delete(target);
      }
      if (!isValidPressEvent(endEvent)) {
        return;
      }
      if (typeof onPressEnd === "function") {
        onPressEnd(endEvent, { success });
      }
    };
    const onPointerUp = (upEvent) => {
      onPointerEnd(upEvent, target === window || target === document || options.useGlobalTarget || isNodeOrChild(target, upEvent.target));
    };
    const onPointerCancel = (cancelEvent) => {
      onPointerEnd(cancelEvent, false);
    };
    window.addEventListener("pointerup", onPointerUp, eventOptions);
    window.addEventListener("pointercancel", onPointerCancel, eventOptions);
  };
  targets.forEach((target) => {
    const pointerDownTarget = options.useGlobalTarget ? window : target;
    pointerDownTarget.addEventListener("pointerdown", startPress, eventOptions);
    if (isHTMLElement(target)) {
      target.addEventListener("focus", (event) => enableKeyboardPress(event, eventOptions));
      if (!isElementKeyboardAccessible(target) && !target.hasAttribute("tabindex")) {
        target.tabIndex = 0;
      }
    }
  });
  return cancelEvents;
}
var claimedPointerDownEvents;
var init_press = __esm(() => {
  init_is_html_element();
  init_is_active();
  init_is_node_or_child();
  init_is_primary_pointer();
  init_setup();
  init_is_keyboard_accessible();
  init_keyboard();
  init_state();
  claimedPointerDownEvents = new WeakSet;
});

// node_modules/motion-dom/dist/es/utils/is-svg-element.mjs
function isSVGElement(element) {
  return isObject(element) && "ownerSVGElement" in element;
}
var init_is_svg_element = __esm(() => {
  init_es();
});

// node_modules/motion-dom/dist/es/resize/handle-element.mjs
function notifyTarget({ target, borderBoxSize }) {
  resizeHandlers.get(target)?.forEach((handler) => {
    handler(target, {
      get width() {
        return getWidth(target, borderBoxSize);
      },
      get height() {
        return getHeight(target, borderBoxSize);
      }
    });
  });
}
function notifyAll(entries) {
  entries.forEach(notifyTarget);
}
function createResizeObserver() {
  if (typeof ResizeObserver === "undefined")
    return;
  observer = new ResizeObserver(notifyAll);
}
function resizeElement(target, handler) {
  if (!observer)
    createResizeObserver();
  const elements = resolveElements(target);
  elements.forEach((element) => {
    let elementHandlers = resizeHandlers.get(element);
    if (!elementHandlers) {
      elementHandlers = new Set;
      resizeHandlers.set(element, elementHandlers);
    }
    elementHandlers.add(handler);
    observer?.observe(element);
  });
  return () => {
    elements.forEach((element) => {
      const elementHandlers = resizeHandlers.get(element);
      elementHandlers?.delete(handler);
      if (!elementHandlers?.size) {
        observer?.unobserve(element);
      }
    });
  };
}
var resizeHandlers, observer, getSize = (borderBoxAxis, svgAxis, htmlAxis) => (target, borderBoxSize) => {
  if (borderBoxSize && borderBoxSize[0]) {
    return borderBoxSize[0][borderBoxAxis + "Size"];
  } else if (isSVGElement(target) && "getBBox" in target) {
    return target.getBBox()[svgAxis];
  } else {
    return target[htmlAxis];
  }
}, getWidth, getHeight;
var init_handle_element = __esm(() => {
  init_is_svg_element();
  init_resolve_elements();
  resizeHandlers = new WeakMap;
  getWidth = /* @__PURE__ */ getSize("inline", "width", "offsetWidth");
  getHeight = /* @__PURE__ */ getSize("block", "height", "offsetHeight");
});

// node_modules/motion-dom/dist/es/resize/handle-window.mjs
function createWindowResizeHandler() {
  windowResizeHandler = () => {
    const info = {
      get width() {
        return window.innerWidth;
      },
      get height() {
        return window.innerHeight;
      }
    };
    windowCallbacks.forEach((callback) => callback(info));
  };
  window.addEventListener("resize", windowResizeHandler);
}
function resizeWindow(callback) {
  windowCallbacks.add(callback);
  if (!windowResizeHandler)
    createWindowResizeHandler();
  return () => {
    windowCallbacks.delete(callback);
    if (!windowCallbacks.size && typeof windowResizeHandler === "function") {
      window.removeEventListener("resize", windowResizeHandler);
      windowResizeHandler = undefined;
    }
  };
}
var windowCallbacks, windowResizeHandler;
var init_handle_window = __esm(() => {
  windowCallbacks = new Set;
});

// node_modules/motion-dom/dist/es/resize/index.mjs
function resize(a, b) {
  return typeof a === "function" ? resizeWindow(a) : resizeElement(a, b);
}
var init_resize = __esm(() => {
  init_handle_element();
  init_handle_window();
});

// node_modules/motion-dom/dist/es/utils/is-svg-svg-element.mjs
function isSVGSVGElement(element) {
  return isSVGElement(element) && element.tagName === "svg";
}
var init_is_svg_svg_element = __esm(() => {
  init_is_svg_element();
});

// node_modules/motion-dom/dist/es/utils/transform.mjs
function transform(...args) {
  const useImmediate = !Array.isArray(args[0]);
  const argOffset = useImmediate ? 0 : -1;
  const inputValue = args[0 + argOffset];
  const inputRange = args[1 + argOffset];
  const outputRange = args[2 + argOffset];
  const options = args[3 + argOffset];
  const interpolator = interpolate(inputRange, outputRange, options);
  return useImmediate ? interpolator(inputValue) : interpolator;
}
var init_transform2 = __esm(() => {
  init_interpolate();
});

// node_modules/motion-dom/dist/es/value/follow-value.mjs
function attachFollow(value, source, options = {}) {
  const initialValue = value.get();
  let activeAnimation = null;
  let latestValue = initialValue;
  let latestSetter;
  const unit = typeof initialValue === "string" ? initialValue.replace(/[\d.-]/g, "") : undefined;
  const stopAnimation = () => {
    if (activeAnimation) {
      activeAnimation.stop();
      activeAnimation = null;
    }
    value.animation = undefined;
  };
  const startAnimation = () => {
    const currentValue = asNumber(value.get());
    const targetValue = asNumber(latestValue);
    if (currentValue === targetValue) {
      stopAnimation();
      return;
    }
    const velocity = activeAnimation ? activeAnimation.getGeneratorVelocity() : value.getVelocity();
    stopAnimation();
    activeAnimation = new JSAnimation({
      keyframes: [currentValue, targetValue],
      velocity,
      type: "spring",
      restDelta: 0.001,
      restSpeed: 0.01,
      ...options,
      onUpdate: latestSetter
    });
  };
  const scheduleAnimation = () => {
    startAnimation();
    value.animation = activeAnimation ?? undefined;
    value["events"].animationStart?.notify();
    activeAnimation?.then(() => {
      value.animation = undefined;
      value["events"].animationComplete?.notify();
    });
  };
  value.attach((v, set) => {
    latestValue = v;
    latestSetter = (latest) => set(parseValue(latest, unit));
    frame.postRender(scheduleAnimation);
  }, stopAnimation);
  if (isMotionValue(source)) {
    let skipNextAnimation = options.skipInitialAnimation === true;
    const removeSourceOnChange = source.on("change", (v) => {
      if (skipNextAnimation) {
        skipNextAnimation = false;
        value.jump(parseValue(v, unit), false);
      } else {
        value.set(parseValue(v, unit));
      }
    });
    const removeValueOnDestroy = value.on("destroy", removeSourceOnChange);
    return () => {
      removeSourceOnChange();
      removeValueOnDestroy();
    };
  }
  return stopAnimation;
}
function parseValue(v, unit) {
  return unit ? v + unit : v;
}
function asNumber(v) {
  return typeof v === "number" ? v : parseFloat(v);
}
var init_follow_value = __esm(() => {
  init_JSAnimation();
  init_is_motion_value();
  init_frame();
});

// node_modules/motion-dom/dist/es/value/types/utils/find.mjs
var valueTypes, findValueType = (v) => valueTypes.find(testValueType(v));
var init_find = __esm(() => {
  init_color();
  init_complex();
  init_dimensions();
  init_test();
  valueTypes = [...dimensionValueTypes, color, complex];
});

// node_modules/motion-dom/dist/es/projection/geometry/models.mjs
var createAxisDelta = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), createDelta = () => ({
  x: createAxisDelta(),
  y: createAxisDelta()
}), createAxis = () => ({ min: 0, max: 0 }), createBox = () => ({
  x: createAxis(),
  y: createAxis()
});
var init_models = () => {};

// node_modules/motion-dom/dist/es/render/store.mjs
var visualElementStore;
var init_store = __esm(() => {
  visualElementStore = new WeakMap;
});

// node_modules/motion-dom/dist/es/render/utils/is-animation-controls.mjs
function isAnimationControls(v) {
  return v !== null && typeof v === "object" && typeof v.start === "function";
}
var init_is_animation_controls = () => {};

// node_modules/motion-dom/dist/es/render/utils/is-variant-label.mjs
function isVariantLabel(v) {
  return typeof v === "string" || Array.isArray(v);
}
var init_is_variant_label = () => {};

// node_modules/motion-dom/dist/es/render/utils/variant-props.mjs
var variantPriorityOrder, variantProps;
var init_variant_props = __esm(() => {
  variantPriorityOrder = [
    "animate",
    "whileInView",
    "whileFocus",
    "whileHover",
    "whileTap",
    "whileDrag",
    "exit"
  ];
  variantProps = ["initial", ...variantPriorityOrder];
});

// node_modules/motion-dom/dist/es/render/utils/is-controlling-variants.mjs
function isControllingVariants(props) {
  return isAnimationControls(props.animate) || variantProps.some((name) => isVariantLabel(props[name]));
}
function isVariantNode(props) {
  return Boolean(isControllingVariants(props) || props.variants);
}
var init_is_controlling_variants = __esm(() => {
  init_is_animation_controls();
  init_is_variant_label();
  init_variant_props();
});

// node_modules/motion-dom/dist/es/render/utils/motion-values.mjs
function updateMotionValuesFromProps(element, next, prev) {
  for (const key in next) {
    const nextValue = next[key];
    const prevValue = prev[key];
    if (isMotionValue(nextValue)) {
      element.addValue(key, nextValue);
    } else if (isMotionValue(prevValue)) {
      element.addValue(key, motionValue(nextValue, { owner: element }));
    } else if (prevValue !== nextValue) {
      if (element.hasValue(key)) {
        const existingValue = element.getValue(key);
        if (existingValue.liveStyle === true) {
          existingValue.jump(nextValue);
        } else if (!existingValue.hasAnimated) {
          existingValue.set(nextValue);
        }
      } else {
        const latestValue = element.getStaticValue(key);
        element.addValue(key, motionValue(latestValue !== undefined ? latestValue : nextValue, { owner: element }));
      }
    }
  }
  for (const key in prev) {
    if (next[key] === undefined)
      element.removeValue(key);
  }
  return next;
}
var init_motion_values = __esm(() => {
  init_value();
  init_is_motion_value();
});

// node_modules/motion-dom/dist/es/render/utils/reduced-motion/state.mjs
var prefersReducedMotion, hasReducedMotionListener;
var init_state2 = __esm(() => {
  prefersReducedMotion = { current: null };
  hasReducedMotionListener = { current: false };
});

// node_modules/motion-dom/dist/es/render/utils/reduced-motion/index.mjs
function initPrefersReducedMotion() {
  hasReducedMotionListener.current = true;
  if (!isBrowser2)
    return;
  if (window.matchMedia) {
    const motionMediaQuery = window.matchMedia("(prefers-reduced-motion)");
    const setReducedMotionPreferences = () => prefersReducedMotion.current = motionMediaQuery.matches;
    motionMediaQuery.addEventListener("change", setReducedMotionPreferences);
    setReducedMotionPreferences();
  } else {
    prefersReducedMotion.current = false;
  }
}
var isBrowser2;
var init_reduced_motion = __esm(() => {
  init_state2();
  isBrowser2 = typeof window !== "undefined";
});

// node_modules/motion-dom/dist/es/render/VisualElement.mjs
function setFeatureDefinitions(definitions) {
  featureDefinitions = definitions;
}
function getFeatureDefinitions() {
  return featureDefinitions;
}

class VisualElement {
  scrapeMotionValuesFromProps(_props, _prevProps, _visualElement) {
    return {};
  }
  constructor({ parent, props, presenceContext, reducedMotionConfig, skipAnimations, blockInitialAnimation, visualState }, options = {}) {
    this.current = null;
    this.children = new Set;
    this.isVariantNode = false;
    this.isControllingVariants = false;
    this.shouldReduceMotion = null;
    this.shouldSkipAnimations = false;
    this.values = new Map;
    this.KeyframeResolver = KeyframeResolver;
    this.features = {};
    this.valueSubscriptions = new Map;
    this.prevMotionValues = {};
    this.hasBeenMounted = false;
    this.events = {};
    this.propEventSubscriptions = {};
    this.notifyUpdate = () => this.notify("Update", this.latestValues);
    this.render = () => {
      if (!this.current)
        return;
      this.triggerBuild();
      this.renderInstance(this.current, this.renderState, this.props.style, this.projection);
    };
    this.renderScheduledAt = 0;
    this.scheduleRender = () => {
      const now2 = time.now();
      if (this.renderScheduledAt < now2) {
        this.renderScheduledAt = now2;
        frame.render(this.render, false, true);
      }
    };
    const { latestValues, renderState } = visualState;
    this.latestValues = latestValues;
    this.baseTarget = { ...latestValues };
    this.initialValues = props.initial ? { ...latestValues } : {};
    this.renderState = renderState;
    this.parent = parent;
    this.props = props;
    this.presenceContext = presenceContext;
    this.depth = parent ? parent.depth + 1 : 0;
    this.reducedMotionConfig = reducedMotionConfig;
    this.skipAnimationsConfig = skipAnimations;
    this.options = options;
    this.blockInitialAnimation = Boolean(blockInitialAnimation);
    this.isControllingVariants = isControllingVariants(props);
    this.isVariantNode = isVariantNode(props);
    if (this.isVariantNode) {
      this.variantChildren = new Set;
    }
    this.manuallyAnimateOnMount = Boolean(parent && parent.current);
    const { willChange, ...initialMotionValues } = this.scrapeMotionValuesFromProps(props, {}, this);
    for (const key in initialMotionValues) {
      const value = initialMotionValues[key];
      if (latestValues[key] !== undefined && isMotionValue(value)) {
        value.set(latestValues[key]);
      }
    }
  }
  mount(instance) {
    if (this.hasBeenMounted) {
      for (const key in this.initialValues) {
        this.values.get(key)?.jump(this.initialValues[key]);
        this.latestValues[key] = this.initialValues[key];
      }
    }
    this.current = instance;
    visualElementStore.set(instance, this);
    if (this.projection && !this.projection.instance) {
      this.projection.mount(instance);
    }
    if (this.parent && this.isVariantNode && !this.isControllingVariants) {
      this.removeFromVariantTree = this.parent.addVariantChild(this);
    }
    this.values.forEach((value, key) => this.bindToMotionValue(key, value));
    if (this.reducedMotionConfig === "never") {
      this.shouldReduceMotion = false;
    } else if (this.reducedMotionConfig === "always") {
      this.shouldReduceMotion = true;
    } else {
      if (!hasReducedMotionListener.current) {
        initPrefersReducedMotion();
      }
      this.shouldReduceMotion = prefersReducedMotion.current;
    }
    if (true) {
      warnOnce(this.shouldReduceMotion !== true, "You have Reduced Motion enabled on your device. Animations may not appear as expected.", "reduced-motion-disabled");
    }
    this.shouldSkipAnimations = this.skipAnimationsConfig ?? false;
    this.parent?.addChild(this);
    this.update(this.props, this.presenceContext);
    this.hasBeenMounted = true;
  }
  unmount() {
    this.projection && this.projection.unmount();
    cancelFrame(this.notifyUpdate);
    cancelFrame(this.render);
    this.valueSubscriptions.forEach((remove) => remove());
    this.valueSubscriptions.clear();
    this.removeFromVariantTree && this.removeFromVariantTree();
    this.parent?.removeChild(this);
    for (const key in this.events) {
      this.events[key].clear();
    }
    for (const key in this.features) {
      const feature = this.features[key];
      if (feature) {
        feature.unmount();
        feature.isMounted = false;
      }
    }
    this.current = null;
  }
  addChild(child) {
    this.children.add(child);
    this.enteringChildren ?? (this.enteringChildren = new Set);
    this.enteringChildren.add(child);
  }
  removeChild(child) {
    this.children.delete(child);
    this.enteringChildren && this.enteringChildren.delete(child);
  }
  bindToMotionValue(key, value) {
    if (this.valueSubscriptions.has(key)) {
      this.valueSubscriptions.get(key)();
    }
    if (value.accelerate && acceleratedValues.has(key) && this.current instanceof HTMLElement) {
      const { factory, keyframes: keyframes2, times, ease: ease2, duration } = value.accelerate;
      const animation = new NativeAnimation({
        element: this.current,
        name: key,
        keyframes: keyframes2,
        times,
        ease: ease2,
        duration: secondsToMilliseconds(duration)
      });
      const cleanup = factory(animation);
      this.valueSubscriptions.set(key, () => {
        cleanup();
        animation.cancel();
      });
      return;
    }
    const valueIsTransform = transformProps.has(key);
    if (valueIsTransform && this.onBindTransform) {
      this.onBindTransform();
    }
    const removeOnChange = value.on("change", (latestValue) => {
      this.latestValues[key] = latestValue;
      this.props.onUpdate && frame.preRender(this.notifyUpdate);
      if (valueIsTransform && this.projection) {
        this.projection.isTransformDirty = true;
      }
      this.scheduleRender();
    });
    let removeSyncCheck;
    if (typeof window !== "undefined" && window.MotionCheckAppearSync) {
      removeSyncCheck = window.MotionCheckAppearSync(this, key, value);
    }
    this.valueSubscriptions.set(key, () => {
      removeOnChange();
      if (removeSyncCheck)
        removeSyncCheck();
      if (value.owner)
        value.stop();
    });
  }
  sortNodePosition(other) {
    if (!this.current || !this.sortInstanceNodePosition || this.type !== other.type) {
      return 0;
    }
    return this.sortInstanceNodePosition(this.current, other.current);
  }
  updateFeatures() {
    let key = "animation";
    for (key in featureDefinitions) {
      const featureDefinition = featureDefinitions[key];
      if (!featureDefinition)
        continue;
      const { isEnabled, Feature: FeatureConstructor } = featureDefinition;
      if (!this.features[key] && FeatureConstructor && isEnabled(this.props)) {
        this.features[key] = new FeatureConstructor(this);
      }
      if (this.features[key]) {
        const feature = this.features[key];
        if (feature.isMounted) {
          feature.update();
        } else {
          feature.mount();
          feature.isMounted = true;
        }
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : createBox();
  }
  getStaticValue(key) {
    return this.latestValues[key];
  }
  setStaticValue(key, value) {
    this.latestValues[key] = value;
  }
  update(props, presenceContext) {
    if (props.transformTemplate || this.props.transformTemplate) {
      this.scheduleRender();
    }
    this.prevProps = this.props;
    this.props = props;
    this.prevPresenceContext = this.presenceContext;
    this.presenceContext = presenceContext;
    for (let i = 0;i < propEventHandlers.length; i++) {
      const key = propEventHandlers[i];
      if (this.propEventSubscriptions[key]) {
        this.propEventSubscriptions[key]();
        delete this.propEventSubscriptions[key];
      }
      const listenerName = "on" + key;
      const listener = props[listenerName];
      if (listener) {
        this.propEventSubscriptions[key] = this.on(key, listener);
      }
    }
    this.prevMotionValues = updateMotionValuesFromProps(this, this.scrapeMotionValuesFromProps(props, this.prevProps || {}, this), this.prevMotionValues);
    if (this.handleChildMotionValue) {
      this.handleChildMotionValue();
    }
  }
  getProps() {
    return this.props;
  }
  getVariant(name) {
    return this.props.variants ? this.props.variants[name] : undefined;
  }
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : undefined;
  }
  addVariantChild(child) {
    const closestVariantNode = this.getClosestVariantNode();
    if (closestVariantNode) {
      closestVariantNode.variantChildren && closestVariantNode.variantChildren.add(child);
      return () => closestVariantNode.variantChildren.delete(child);
    }
  }
  addValue(key, value) {
    const existingValue = this.values.get(key);
    if (value !== existingValue) {
      if (existingValue)
        this.removeValue(key);
      this.bindToMotionValue(key, value);
      this.values.set(key, value);
      this.latestValues[key] = value.get();
    }
  }
  removeValue(key) {
    this.values.delete(key);
    const unsubscribe = this.valueSubscriptions.get(key);
    if (unsubscribe) {
      unsubscribe();
      this.valueSubscriptions.delete(key);
    }
    delete this.latestValues[key];
    this.removeValueFromRenderState(key, this.renderState);
  }
  hasValue(key) {
    return this.values.has(key);
  }
  getValue(key, defaultValue) {
    if (this.props.values && this.props.values[key]) {
      return this.props.values[key];
    }
    let value = this.values.get(key);
    if (value === undefined && defaultValue !== undefined) {
      value = motionValue(defaultValue === null ? undefined : defaultValue, { owner: this });
      this.addValue(key, value);
    }
    return value;
  }
  readValue(key, target) {
    let value = this.latestValues[key] !== undefined || !this.current ? this.latestValues[key] : this.getBaseTargetFromProps(this.props, key) ?? this.readValueFromInstance(this.current, key, this.options);
    if (value !== undefined && value !== null) {
      if (typeof value === "string" && (isNumericalString(value) || isZeroValueString(value))) {
        value = parseFloat(value);
      } else if (!findValueType(value) && complex.test(target)) {
        value = getAnimatableNone2(key, target);
      }
      this.setBaseTarget(key, isMotionValue(value) ? value.get() : value);
    }
    return isMotionValue(value) ? value.get() : value;
  }
  setBaseTarget(key, value) {
    this.baseTarget[key] = value;
  }
  getBaseTarget(key) {
    const { initial } = this.props;
    let valueFromInitial;
    if (typeof initial === "string" || typeof initial === "object") {
      const variant = resolveVariantFromProps(this.props, initial, this.presenceContext?.custom);
      if (variant) {
        valueFromInitial = variant[key];
      }
    }
    if (initial && valueFromInitial !== undefined) {
      return valueFromInitial;
    }
    const target = this.getBaseTargetFromProps(this.props, key);
    if (target !== undefined && !isMotionValue(target))
      return target;
    return this.initialValues[key] !== undefined && valueFromInitial === undefined ? undefined : this.baseTarget[key];
  }
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = new SubscriptionManager;
    }
    return this.events[eventName].add(callback);
  }
  notify(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].notify(...args);
    }
  }
  scheduleRenderMicrotask() {
    microtask.render(this.render);
  }
}
var propEventHandlers, featureDefinitions;
var init_VisualElement = __esm(() => {
  init_es();
  init_KeyframesResolver();
  init_NativeAnimation();
  init_accelerated_values();
  init_microtask();
  init_sync_time();
  init_models();
  init_value();
  init_complex();
  init_animatable_none();
  init_find();
  init_is_motion_value();
  init_store();
  init_is_controlling_variants();
  init_keys_transform();
  init_motion_values();
  init_reduced_motion();
  init_resolve_variants();
  init_state2();
  init_frame();
  propEventHandlers = [
    "AnimationStart",
    "AnimationComplete",
    "Update",
    "BeforeLayoutMeasure",
    "LayoutMeasure",
    "LayoutAnimationStart",
    "LayoutAnimationComplete"
  ];
  featureDefinitions = {};
});

// node_modules/motion-dom/dist/es/render/dom/DOMVisualElement.mjs
var DOMVisualElement;
var init_DOMVisualElement = __esm(() => {
  init_is_motion_value();
  init_DOMKeyframesResolver();
  init_VisualElement();
  DOMVisualElement = class DOMVisualElement extends VisualElement {
    constructor() {
      super(...arguments);
      this.KeyframeResolver = DOMKeyframesResolver;
    }
    sortInstanceNodePosition(a, b) {
      return a.compareDocumentPosition(b) & 2 ? 1 : -1;
    }
    getBaseTargetFromProps(props, key) {
      const style = props.style;
      return style ? style[key] : undefined;
    }
    removeValueFromRenderState(key, { vars, style }) {
      delete vars[key];
      delete style[key];
    }
    handleChildMotionValue() {
      if (this.childSubscription) {
        this.childSubscription();
        delete this.childSubscription;
      }
      const { children } = this.props;
      if (isMotionValue(children)) {
        this.childSubscription = children.on("change", (latest) => {
          if (this.current) {
            this.current.textContent = `${latest}`;
          }
        });
      }
    }
  };
});

// node_modules/motion-dom/dist/es/render/Feature.mjs
class Feature {
  constructor(node) {
    this.isMounted = false;
    this.node = node;
  }
  update() {}
}
var init_Feature = () => {};

// node_modules/motion-dom/dist/es/projection/geometry/conversion.mjs
function convertBoundingBoxToBox({ top, left, right, bottom }) {
  return {
    x: { min: left, max: right },
    y: { min: top, max: bottom }
  };
}
function convertBoxToBoundingBox({ x, y }) {
  return { top: y.min, right: x.max, bottom: y.max, left: x.min };
}
function transformBoxPoints(point, transformPoint) {
  if (!transformPoint)
    return point;
  const topLeft = transformPoint({ x: point.left, y: point.top });
  const bottomRight = transformPoint({ x: point.right, y: point.bottom });
  return {
    top: topLeft.y,
    left: topLeft.x,
    bottom: bottomRight.y,
    right: bottomRight.x
  };
}
var init_conversion = () => {};

// node_modules/motion-dom/dist/es/projection/utils/has-transform.mjs
function isIdentityScale(scale2) {
  return scale2 === undefined || scale2 === 1;
}
function hasScale({ scale: scale2, scaleX: scaleX2, scaleY: scaleY2 }) {
  return !isIdentityScale(scale2) || !isIdentityScale(scaleX2) || !isIdentityScale(scaleY2);
}
function hasTransform(values) {
  return hasScale(values) || has2DTranslate(values) || values.z || values.rotate || values.rotateX || values.rotateY || values.skewX || values.skewY;
}
function has2DTranslate(values) {
  return is2DTranslate(values.x) || is2DTranslate(values.y);
}
function is2DTranslate(value) {
  return value && value !== "0%";
}
var init_has_transform = () => {};

// node_modules/motion-dom/dist/es/projection/geometry/delta-apply.mjs
function scalePoint(point, scale2, originPoint) {
  const distanceFromOrigin = point - originPoint;
  const scaled = scale2 * distanceFromOrigin;
  return originPoint + scaled;
}
function applyPointDelta(point, translate, scale2, originPoint, boxScale) {
  if (boxScale !== undefined) {
    point = scalePoint(point, boxScale, originPoint);
  }
  return scalePoint(point, scale2, originPoint) + translate;
}
function applyAxisDelta(axis, translate = 0, scale2 = 1, originPoint, boxScale) {
  axis.min = applyPointDelta(axis.min, translate, scale2, originPoint, boxScale);
  axis.max = applyPointDelta(axis.max, translate, scale2, originPoint, boxScale);
}
function applyBoxDelta(box, { x, y }) {
  applyAxisDelta(box.x, x.translate, x.scale, x.originPoint);
  applyAxisDelta(box.y, y.translate, y.scale, y.originPoint);
}
function applyTreeDeltas(box, treeScale, treePath, isSharedTransition = false) {
  const treeLength = treePath.length;
  if (!treeLength)
    return;
  treeScale.x = treeScale.y = 1;
  let node;
  let delta;
  for (let i = 0;i < treeLength; i++) {
    node = treePath[i];
    delta = node.projectionDelta;
    const { visualElement } = node.options;
    if (visualElement && visualElement.props.style && visualElement.props.style.display === "contents") {
      continue;
    }
    if (isSharedTransition && node.options.layoutScroll && node.scroll && node !== node.root) {
      translateAxis(box.x, -node.scroll.offset.x);
      translateAxis(box.y, -node.scroll.offset.y);
    }
    if (delta) {
      treeScale.x *= delta.x.scale;
      treeScale.y *= delta.y.scale;
      applyBoxDelta(box, delta);
    }
    if (isSharedTransition && hasTransform(node.latestValues)) {
      transformBox(box, node.latestValues, node.layout?.layoutBox);
    }
  }
  if (treeScale.x < TREE_SCALE_SNAP_MAX && treeScale.x > TREE_SCALE_SNAP_MIN) {
    treeScale.x = 1;
  }
  if (treeScale.y < TREE_SCALE_SNAP_MAX && treeScale.y > TREE_SCALE_SNAP_MIN) {
    treeScale.y = 1;
  }
}
function translateAxis(axis, distance) {
  axis.min += distance;
  axis.max += distance;
}
function transformAxis(axis, axisTranslate, axisScale, boxScale, axisOrigin = 0.5) {
  const originPoint = mixNumber(axis.min, axis.max, axisOrigin);
  applyAxisDelta(axis, axisTranslate, axisScale, originPoint, boxScale);
}
function resolveAxisTranslate(value, axis) {
  if (typeof value === "string") {
    return parseFloat(value) / 100 * (axis.max - axis.min);
  }
  return value;
}
function transformBox(box, transform2, sourceBox) {
  const resolveBox = sourceBox ?? box;
  transformAxis(box.x, resolveAxisTranslate(transform2.x, resolveBox.x), transform2.scaleX, transform2.scale, transform2.originX);
  transformAxis(box.y, resolveAxisTranslate(transform2.y, resolveBox.y), transform2.scaleY, transform2.scale, transform2.originY);
}
var TREE_SCALE_SNAP_MIN = 0.999999999999, TREE_SCALE_SNAP_MAX = 1.0000000000001;
var init_delta_apply = __esm(() => {
  init_number();
  init_has_transform();
});

// node_modules/motion-dom/dist/es/projection/utils/measure.mjs
function measureViewportBox(instance, transformPoint) {
  return convertBoundingBoxToBox(transformBoxPoints(instance.getBoundingClientRect(), transformPoint));
}
function measurePageBox(element, rootProjectionNode, transformPagePoint) {
  const viewportBox = measureViewportBox(element, transformPagePoint);
  const { scroll } = rootProjectionNode;
  if (scroll) {
    translateAxis(viewportBox.x, scroll.offset.x);
    translateAxis(viewportBox.y, scroll.offset.y);
  }
  return viewportBox;
}
var init_measure = __esm(() => {
  init_conversion();
  init_delta_apply();
});

// node_modules/motion-dom/dist/es/render/html/utils/build-transform.mjs
function buildTransform(latestValues, transform2, transformTemplate) {
  let transformString = "";
  let transformIsDefault = true;
  for (let i = 0;i < numTransforms; i++) {
    const key = transformPropOrder[i];
    const value = latestValues[key];
    if (value === undefined)
      continue;
    let valueIsDefault = true;
    if (typeof value === "number") {
      valueIsDefault = value === (key.startsWith("scale") ? 1 : 0);
    } else {
      const parsed = parseFloat(value);
      valueIsDefault = key.startsWith("scale") ? parsed === 1 : parsed === 0;
    }
    if (!valueIsDefault || transformTemplate) {
      const valueAsType = getValueAsType(value, numberValueTypes[key]);
      if (!valueIsDefault) {
        transformIsDefault = false;
        const transformName = translateAlias[key] || key;
        transformString += `${transformName}(${valueAsType}) `;
      }
      if (transformTemplate) {
        transform2[key] = valueAsType;
      }
    }
  }
  transformString = transformString.trim();
  if (transformTemplate) {
    transformString = transformTemplate(transform2, transformIsDefault ? "" : transformString);
  } else if (transformIsDefault) {
    transformString = "none";
  }
  return transformString;
}
var translateAlias, numTransforms;
var init_build_transform = __esm(() => {
  init_get_as_type();
  init_number2();
  init_keys_transform();
  translateAlias = {
    x: "translateX",
    y: "translateY",
    z: "translateZ",
    transformPerspective: "perspective"
  };
  numTransforms = transformPropOrder.length;
});

// node_modules/motion-dom/dist/es/render/html/utils/build-styles.mjs
function buildHTMLStyles(state, latestValues, transformTemplate) {
  const { style, vars, transformOrigin } = state;
  let hasTransform2 = false;
  let hasTransformOrigin = false;
  for (const key in latestValues) {
    const value = latestValues[key];
    if (transformProps.has(key)) {
      hasTransform2 = true;
      continue;
    } else if (isCSSVariableName(key)) {
      vars[key] = value;
      continue;
    } else {
      const valueAsType = getValueAsType(value, numberValueTypes[key]);
      if (key.startsWith("origin")) {
        hasTransformOrigin = true;
        transformOrigin[key] = valueAsType;
      } else {
        style[key] = valueAsType;
      }
    }
  }
  if (!latestValues.transform) {
    if (hasTransform2 || transformTemplate) {
      style.transform = buildTransform(latestValues, state.transform, transformTemplate);
    } else if (style.transform) {
      style.transform = "none";
    }
  }
  if (hasTransformOrigin) {
    const { originX = "50%", originY = "50%", originZ = 0 } = transformOrigin;
    style.transformOrigin = `${originX} ${originY} ${originZ}`;
  }
}
var init_build_styles = __esm(() => {
  init_get_as_type();
  init_number2();
  init_keys_transform();
  init_is_css_variable();
  init_build_transform();
});

// node_modules/motion-dom/dist/es/render/html/utils/render.mjs
function renderHTML(element, { style, vars }, styleProp, projection) {
  const elementStyle = element.style;
  let key;
  for (key in style) {
    elementStyle[key] = style[key];
  }
  projection?.applyProjectionStyles(elementStyle, styleProp);
  for (key in vars) {
    elementStyle.setProperty(key, vars[key]);
  }
}
var init_render = () => {};

// node_modules/motion-dom/dist/es/projection/styles/scale-border-radius.mjs
function pixelsToPercent(pixels, axis) {
  if (axis.max === axis.min)
    return 0;
  return pixels / (axis.max - axis.min) * 100;
}
var correctBorderRadius;
var init_scale_border_radius = __esm(() => {
  init_units();
  correctBorderRadius = {
    correct: (latest, node) => {
      if (!node.target)
        return latest;
      if (typeof latest === "string") {
        if (px.test(latest)) {
          latest = parseFloat(latest);
        } else {
          return latest;
        }
      }
      const x = pixelsToPercent(latest, node.target.x);
      const y = pixelsToPercent(latest, node.target.y);
      return `${x}% ${y}%`;
    }
  };
});

// node_modules/motion-dom/dist/es/projection/styles/scale-box-shadow.mjs
var correctBoxShadow;
var init_scale_box_shadow = __esm(() => {
  init_complex();
  init_number();
  correctBoxShadow = {
    correct: (latest, { treeScale, projectionDelta }) => {
      const original = latest;
      const shadow = complex.parse(latest);
      if (shadow.length > 5)
        return original;
      const template = complex.createTransformer(latest);
      const offset = typeof shadow[0] !== "number" ? 1 : 0;
      const xScale = projectionDelta.x.scale * treeScale.x;
      const yScale = projectionDelta.y.scale * treeScale.y;
      shadow[0 + offset] /= xScale;
      shadow[1 + offset] /= yScale;
      const averageScale = mixNumber(xScale, yScale, 0.5);
      if (typeof shadow[2 + offset] === "number")
        shadow[2 + offset] /= averageScale;
      if (typeof shadow[3 + offset] === "number")
        shadow[3 + offset] /= averageScale;
      return template(shadow);
    }
  };
});

// node_modules/motion-dom/dist/es/projection/styles/scale-correction.mjs
var scaleCorrectors;
var init_scale_correction = __esm(() => {
  init_scale_border_radius();
  init_scale_box_shadow();
  scaleCorrectors = {
    borderRadius: {
      ...correctBorderRadius,
      applyTo: [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius"
      ]
    },
    borderTopLeftRadius: correctBorderRadius,
    borderTopRightRadius: correctBorderRadius,
    borderBottomLeftRadius: correctBorderRadius,
    borderBottomRightRadius: correctBorderRadius,
    boxShadow: correctBoxShadow
  };
});

// node_modules/motion-dom/dist/es/render/utils/is-forced-motion-value.mjs
function isForcedMotionValue(key, { layout, layoutId }) {
  return transformProps.has(key) || key.startsWith("origin") || (layout || layoutId !== undefined) && (!!scaleCorrectors[key] || key === "opacity");
}
var init_is_forced_motion_value = __esm(() => {
  init_keys_transform();
  init_scale_correction();
});

// node_modules/motion-dom/dist/es/render/html/utils/scrape-motion-values.mjs
function scrapeMotionValuesFromProps(props, prevProps, visualElement) {
  const style = props.style;
  const prevStyle = prevProps?.style;
  const newValues = {};
  if (!style)
    return newValues;
  for (const key in style) {
    if (isMotionValue(style[key]) || prevStyle && isMotionValue(prevStyle[key]) || isForcedMotionValue(key, props) || visualElement?.getValue(key)?.liveStyle !== undefined) {
      newValues[key] = style[key];
    }
  }
  return newValues;
}
var init_scrape_motion_values = __esm(() => {
  init_is_motion_value();
  init_is_forced_motion_value();
});

// node_modules/motion-dom/dist/es/render/html/HTMLVisualElement.mjs
function getComputedStyle2(element) {
  return window.getComputedStyle(element);
}
var HTMLVisualElement;
var init_HTMLVisualElement = __esm(() => {
  init_is_css_variable();
  init_keys_transform();
  init_parse_transform();
  init_measure();
  init_DOMVisualElement();
  init_build_styles();
  init_render();
  init_scrape_motion_values();
  HTMLVisualElement = class HTMLVisualElement extends DOMVisualElement {
    constructor() {
      super(...arguments);
      this.type = "html";
      this.renderInstance = renderHTML;
    }
    readValueFromInstance(instance, key) {
      if (transformProps.has(key)) {
        return this.projection?.isProjecting ? defaultTransformValue(key) : readTransformValue(instance, key);
      } else {
        const computedStyle = getComputedStyle2(instance);
        const value = (isCSSVariableName(key) ? computedStyle.getPropertyValue(key) : computedStyle[key]) || 0;
        return typeof value === "string" ? value.trim() : value;
      }
    }
    measureInstanceViewportBox(instance, { transformPagePoint }) {
      return measureViewportBox(instance, transformPagePoint);
    }
    build(renderState, latestValues, props) {
      buildHTMLStyles(renderState, latestValues, props.transformTemplate);
    }
    scrapeMotionValuesFromProps(props, prevProps, visualElement) {
      return scrapeMotionValuesFromProps(props, prevProps, visualElement);
    }
  };
});

// node_modules/motion-dom/dist/es/render/object/ObjectVisualElement.mjs
function isObjectKey(key, object) {
  return key in object;
}
var ObjectVisualElement;
var init_ObjectVisualElement = __esm(() => {
  init_models();
  init_VisualElement();
  ObjectVisualElement = class ObjectVisualElement extends VisualElement {
    constructor() {
      super(...arguments);
      this.type = "object";
    }
    readValueFromInstance(instance, key) {
      if (isObjectKey(key, instance)) {
        const value = instance[key];
        if (typeof value === "string" || typeof value === "number") {
          return value;
        }
      }
      return;
    }
    getBaseTargetFromProps() {
      return;
    }
    removeValueFromRenderState(key, renderState) {
      delete renderState.output[key];
    }
    measureInstanceViewportBox() {
      return createBox();
    }
    build(renderState, latestValues) {
      Object.assign(renderState.output, latestValues);
    }
    renderInstance(instance, { output }) {
      Object.assign(instance, output);
    }
    sortInstanceNodePosition() {
      return 0;
    }
  };
});

// node_modules/motion-dom/dist/es/render/svg/utils/path.mjs
function buildSVGPath(attrs, length, spacing = 1, offset = 0, useDashCase = true) {
  attrs.pathLength = 1;
  const keys = useDashCase ? dashKeys : camelKeys;
  attrs[keys.offset] = `${-offset}`;
  attrs[keys.array] = `${length} ${spacing}`;
}
var dashKeys, camelKeys;
var init_path = __esm(() => {
  dashKeys = {
    offset: "stroke-dashoffset",
    array: "stroke-dasharray"
  };
  camelKeys = {
    offset: "strokeDashoffset",
    array: "strokeDasharray"
  };
});

// node_modules/motion-dom/dist/es/render/svg/utils/build-attrs.mjs
function buildSVGAttrs(state, {
  attrX,
  attrY,
  attrScale,
  pathLength,
  pathSpacing = 1,
  pathOffset = 0,
  ...latest
}, isSVGTag, transformTemplate, styleProp) {
  buildHTMLStyles(state, latest, transformTemplate);
  if (isSVGTag) {
    if (state.style.viewBox) {
      state.attrs.viewBox = state.style.viewBox;
    }
    return;
  }
  state.attrs = state.style;
  state.style = {};
  const { attrs, style } = state;
  if (attrs.transform) {
    style.transform = attrs.transform;
    delete attrs.transform;
  }
  if (style.transform || attrs.transformOrigin) {
    style.transformOrigin = attrs.transformOrigin ?? "50% 50%";
    delete attrs.transformOrigin;
  }
  if (style.transform) {
    style.transformBox = styleProp?.transformBox ?? "fill-box";
    delete attrs.transformBox;
  }
  for (const key of cssMotionPathProperties) {
    if (attrs[key] !== undefined) {
      style[key] = attrs[key];
      delete attrs[key];
    }
  }
  if (attrX !== undefined)
    attrs.x = attrX;
  if (attrY !== undefined)
    attrs.y = attrY;
  if (attrScale !== undefined)
    attrs.scale = attrScale;
  if (pathLength !== undefined) {
    buildSVGPath(attrs, pathLength, pathSpacing, pathOffset, false);
  }
}
var cssMotionPathProperties;
var init_build_attrs = __esm(() => {
  init_build_styles();
  init_path();
  cssMotionPathProperties = [
    "offsetDistance",
    "offsetPath",
    "offsetRotate",
    "offsetAnchor"
  ];
});

// node_modules/motion-dom/dist/es/render/svg/utils/camel-case-attrs.mjs
var camelCaseAttributes;
var init_camel_case_attrs = __esm(() => {
  camelCaseAttributes = new Set([
    "baseFrequency",
    "diffuseConstant",
    "kernelMatrix",
    "kernelUnitLength",
    "keySplines",
    "keyTimes",
    "limitingConeAngle",
    "markerHeight",
    "markerWidth",
    "numOctaves",
    "targetX",
    "targetY",
    "surfaceScale",
    "specularConstant",
    "specularExponent",
    "stdDeviation",
    "tableValues",
    "viewBox",
    "gradientTransform",
    "pathLength",
    "startOffset",
    "textLength",
    "lengthAdjust"
  ]);
});

// node_modules/motion-dom/dist/es/render/svg/utils/is-svg-tag.mjs
var isSVGTag = (tag) => typeof tag === "string" && tag.toLowerCase() === "svg";
var init_is_svg_tag = () => {};

// node_modules/motion-dom/dist/es/render/svg/utils/render.mjs
function renderSVG(element, renderState, _styleProp, projection) {
  renderHTML(element, renderState, undefined, projection);
  for (const key in renderState.attrs) {
    element.setAttribute(!camelCaseAttributes.has(key) ? camelToDash(key) : key, renderState.attrs[key]);
  }
}
var init_render2 = __esm(() => {
  init_camel_to_dash();
  init_render();
  init_camel_case_attrs();
});

// node_modules/motion-dom/dist/es/render/svg/utils/scrape-motion-values.mjs
function scrapeMotionValuesFromProps2(props, prevProps, visualElement) {
  const newValues = scrapeMotionValuesFromProps(props, prevProps, visualElement);
  for (const key in props) {
    if (isMotionValue(props[key]) || isMotionValue(prevProps[key])) {
      const targetKey = transformPropOrder.indexOf(key) !== -1 ? "attr" + key.charAt(0).toUpperCase() + key.substring(1) : key;
      newValues[targetKey] = props[key];
    }
  }
  return newValues;
}
var init_scrape_motion_values2 = __esm(() => {
  init_is_motion_value();
  init_keys_transform();
  init_scrape_motion_values();
});

// node_modules/motion-dom/dist/es/render/svg/SVGVisualElement.mjs
var SVGVisualElement;
var init_SVGVisualElement = __esm(() => {
  init_keys_transform();
  init_defaults();
  init_models();
  init_DOMVisualElement();
  init_camel_to_dash();
  init_build_attrs();
  init_camel_case_attrs();
  init_is_svg_tag();
  init_render2();
  init_scrape_motion_values2();
  SVGVisualElement = class SVGVisualElement extends DOMVisualElement {
    constructor() {
      super(...arguments);
      this.type = "svg";
      this.isSVGTag = false;
      this.measureInstanceViewportBox = createBox;
    }
    getBaseTargetFromProps(props, key) {
      return props[key];
    }
    readValueFromInstance(instance, key) {
      if (transformProps.has(key)) {
        const defaultType = getDefaultValueType(key);
        return defaultType ? defaultType.default || 0 : 0;
      }
      key = !camelCaseAttributes.has(key) ? camelToDash(key) : key;
      return instance.getAttribute(key);
    }
    scrapeMotionValuesFromProps(props, prevProps, visualElement) {
      return scrapeMotionValuesFromProps2(props, prevProps, visualElement);
    }
    build(renderState, latestValues, props) {
      buildSVGAttrs(renderState, latestValues, this.isSVGTag, props.transformTemplate, props.style);
    }
    renderInstance(instance, renderState, styleProp, projection) {
      renderSVG(instance, renderState, styleProp, projection);
    }
    mount(instance) {
      this.isSVGTag = isSVGTag(instance.tagName);
      super.mount(instance);
    }
  };
});

// node_modules/motion-dom/dist/es/render/utils/get-variant-context.mjs
function getVariantContext(visualElement) {
  if (!visualElement)
    return;
  if (!visualElement.isControllingVariants) {
    const context2 = visualElement.parent ? getVariantContext(visualElement.parent) || {} : {};
    if (visualElement.props.initial !== undefined) {
      context2.initial = visualElement.props.initial;
    }
    return context2;
  }
  const context = {};
  for (let i = 0;i < numVariantProps; i++) {
    const name = variantProps[i];
    const prop = visualElement.props[name];
    if (isVariantLabel(prop) || prop === false) {
      context[name] = prop;
    }
  }
  return context;
}
var numVariantProps;
var init_get_variant_context = __esm(() => {
  init_is_variant_label();
  init_variant_props();
  numVariantProps = variantProps.length;
});

// node_modules/motion-dom/dist/es/render/utils/shallow-compare.mjs
function shallowCompare(next, prev) {
  if (!Array.isArray(prev))
    return false;
  const prevLength = prev.length;
  if (prevLength !== next.length)
    return false;
  for (let i = 0;i < prevLength; i++) {
    if (prev[i] !== next[i])
      return false;
  }
  return true;
}
var init_shallow_compare = () => {};

// node_modules/motion-dom/dist/es/render/utils/animation-state.mjs
function createAnimateFunction(visualElement) {
  return (animations) => {
    return Promise.all(animations.map(({ animation, options }) => animateVisualElement(visualElement, animation, options)));
  };
}
function createAnimationState(visualElement) {
  let animate = createAnimateFunction(visualElement);
  let state = createState();
  let isInitialRender = true;
  let wasReset = false;
  const buildResolvedTypeValues = (type) => (acc, definition) => {
    const resolved = resolveVariant(visualElement, definition, type === "exit" ? visualElement.presenceContext?.custom : undefined);
    if (resolved) {
      const { transition, transitionEnd, ...target } = resolved;
      acc = { ...acc, ...target, ...transitionEnd };
    }
    return acc;
  };
  function setAnimateFunction(makeAnimator) {
    animate = makeAnimator(visualElement);
  }
  function animateChanges(changedActiveType) {
    const { props } = visualElement;
    const context = getVariantContext(visualElement.parent) || {};
    const animations = [];
    const removedKeys = new Set;
    let encounteredKeys = {};
    let removedVariantIndex = Infinity;
    for (let i = 0;i < numAnimationTypes; i++) {
      const type = reversePriorityOrder[i];
      const typeState = state[type];
      const prop = props[type] !== undefined ? props[type] : context[type];
      const propIsVariant = isVariantLabel(prop);
      const activeDelta = type === changedActiveType ? typeState.isActive : null;
      if (activeDelta === false)
        removedVariantIndex = i;
      let isInherited = prop === context[type] && prop !== props[type] && propIsVariant;
      if (isInherited && (isInitialRender || wasReset) && visualElement.manuallyAnimateOnMount) {
        isInherited = false;
      }
      typeState.protectedKeys = { ...encounteredKeys };
      if (!typeState.isActive && activeDelta === null || !prop && !typeState.prevProp || isAnimationControls(prop) || typeof prop === "boolean") {
        continue;
      }
      if (type === "exit" && typeState.isActive && activeDelta !== true) {
        if (typeState.prevResolvedValues) {
          encounteredKeys = {
            ...encounteredKeys,
            ...typeState.prevResolvedValues
          };
        }
        continue;
      }
      const variantDidChange = checkVariantsDidChange(typeState.prevProp, prop);
      let shouldAnimateType = variantDidChange || type === changedActiveType && typeState.isActive && !isInherited && propIsVariant || i > removedVariantIndex && propIsVariant;
      let handledRemovedValues = false;
      const definitionList = Array.isArray(prop) ? prop : [prop];
      let resolvedValues = definitionList.reduce(buildResolvedTypeValues(type), {});
      if (activeDelta === false)
        resolvedValues = {};
      const { prevResolvedValues = {} } = typeState;
      const allKeys = {
        ...prevResolvedValues,
        ...resolvedValues
      };
      const markToAnimate = (key) => {
        shouldAnimateType = true;
        if (removedKeys.has(key)) {
          handledRemovedValues = true;
          removedKeys.delete(key);
        }
        typeState.needsAnimating[key] = true;
        const motionValue2 = visualElement.getValue(key);
        if (motionValue2)
          motionValue2.liveStyle = false;
      };
      for (const key in allKeys) {
        const next = resolvedValues[key];
        const prev = prevResolvedValues[key];
        if (encounteredKeys.hasOwnProperty(key))
          continue;
        let valueHasChanged = false;
        if (isKeyframesTarget(next) && isKeyframesTarget(prev)) {
          valueHasChanged = !shallowCompare(next, prev);
        } else {
          valueHasChanged = next !== prev;
        }
        if (valueHasChanged) {
          if (next !== undefined && next !== null) {
            markToAnimate(key);
          } else {
            removedKeys.add(key);
          }
        } else if (next !== undefined && removedKeys.has(key)) {
          markToAnimate(key);
        } else {
          typeState.protectedKeys[key] = true;
        }
      }
      typeState.prevProp = prop;
      typeState.prevResolvedValues = resolvedValues;
      if (typeState.isActive) {
        encounteredKeys = { ...encounteredKeys, ...resolvedValues };
      }
      if ((isInitialRender || wasReset) && visualElement.blockInitialAnimation) {
        shouldAnimateType = false;
      }
      const willAnimateViaParent = isInherited && variantDidChange;
      const needsAnimating = !willAnimateViaParent || handledRemovedValues;
      if (shouldAnimateType && needsAnimating) {
        animations.push(...definitionList.map((animation) => {
          const options = { type };
          if (typeof animation === "string" && (isInitialRender || wasReset) && !willAnimateViaParent && visualElement.manuallyAnimateOnMount && visualElement.parent) {
            const { parent } = visualElement;
            const parentVariant = resolveVariant(parent, animation);
            if (parent.enteringChildren && parentVariant) {
              const { delayChildren } = parentVariant.transition || {};
              options.delay = calcChildStagger(parent.enteringChildren, visualElement, delayChildren);
            }
          }
          return {
            animation,
            options
          };
        }));
      }
    }
    if (removedKeys.size) {
      const fallbackAnimation = {};
      if (typeof props.initial !== "boolean") {
        const initialTransition = resolveVariant(visualElement, Array.isArray(props.initial) ? props.initial[0] : props.initial);
        if (initialTransition && initialTransition.transition) {
          fallbackAnimation.transition = initialTransition.transition;
        }
      }
      removedKeys.forEach((key) => {
        const fallbackTarget = visualElement.getBaseTarget(key);
        const motionValue2 = visualElement.getValue(key);
        if (motionValue2)
          motionValue2.liveStyle = true;
        fallbackAnimation[key] = fallbackTarget ?? null;
      });
      animations.push({ animation: fallbackAnimation });
    }
    let shouldAnimate = Boolean(animations.length);
    if (isInitialRender && (props.initial === false || props.initial === props.animate) && !visualElement.manuallyAnimateOnMount) {
      shouldAnimate = false;
    }
    isInitialRender = false;
    wasReset = false;
    return shouldAnimate ? animate(animations) : Promise.resolve();
  }
  function setActive(type, isActive) {
    if (state[type].isActive === isActive)
      return Promise.resolve();
    visualElement.variantChildren?.forEach((child) => child.animationState?.setActive(type, isActive));
    state[type].isActive = isActive;
    const animations = animateChanges(type);
    for (const key in state) {
      state[key].protectedKeys = {};
    }
    return animations;
  }
  return {
    animateChanges,
    setActive,
    setAnimateFunction,
    getState: () => state,
    reset: () => {
      state = createState();
      wasReset = true;
    }
  };
}
function checkVariantsDidChange(prev, next) {
  if (typeof next === "string") {
    return next !== prev;
  } else if (Array.isArray(next)) {
    return !shallowCompare(next, prev);
  }
  return false;
}
function createTypeState(isActive = false) {
  return {
    isActive,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function createState() {
  return {
    animate: createTypeState(true),
    whileInView: createTypeState(),
    whileHover: createTypeState(),
    whileTap: createTypeState(),
    whileDrag: createTypeState(),
    whileFocus: createTypeState(),
    exit: createTypeState()
  };
}
var reversePriorityOrder, numAnimationTypes;
var init_animation_state = __esm(() => {
  init_visual_element();
  init_calc_child_stagger();
  init_get_variant_context();
  init_is_animation_controls();
  init_is_keyframes_target();
  init_is_variant_label();
  init_resolve_dynamic_variants();
  init_shallow_compare();
  init_variant_props();
  reversePriorityOrder = [...variantPriorityOrder].reverse();
  numAnimationTypes = variantPriorityOrder.length;
});

// node_modules/motion-dom/dist/es/projection/geometry/copy.mjs
function copyAxisInto(axis, originAxis) {
  axis.min = originAxis.min;
  axis.max = originAxis.max;
}
function copyBoxInto(box, originBox) {
  copyAxisInto(box.x, originBox.x);
  copyAxisInto(box.y, originBox.y);
}
function copyAxisDeltaInto(delta, originDelta) {
  delta.translate = originDelta.translate;
  delta.scale = originDelta.scale;
  delta.originPoint = originDelta.originPoint;
  delta.origin = originDelta.origin;
}
var init_copy = () => {};

// node_modules/motion-dom/dist/es/projection/geometry/delta-calc.mjs
function calcLength(axis) {
  return axis.max - axis.min;
}
function isNear(value, target, maxDistance) {
  return Math.abs(value - target) <= maxDistance;
}
function calcAxisDelta(delta, source, target, origin = 0.5) {
  delta.origin = origin;
  delta.originPoint = mixNumber(source.min, source.max, delta.origin);
  delta.scale = calcLength(target) / calcLength(source);
  delta.translate = mixNumber(target.min, target.max, delta.origin) - delta.originPoint;
  if (delta.scale >= SCALE_MIN && delta.scale <= SCALE_MAX || isNaN(delta.scale)) {
    delta.scale = 1;
  }
  if (delta.translate >= TRANSLATE_MIN && delta.translate <= TRANSLATE_MAX || isNaN(delta.translate)) {
    delta.translate = 0;
  }
}
function calcBoxDelta(delta, source, target, origin) {
  calcAxisDelta(delta.x, source.x, target.x, origin ? origin.originX : undefined);
  calcAxisDelta(delta.y, source.y, target.y, origin ? origin.originY : undefined);
}
function calcRelativeAxis(target, relative, parent, anchor = 0) {
  const anchorPoint = anchor ? mixNumber(parent.min, parent.max, anchor) : parent.min;
  target.min = anchorPoint + relative.min;
  target.max = target.min + calcLength(relative);
}
function calcRelativeBox(target, relative, parent, anchor) {
  calcRelativeAxis(target.x, relative.x, parent.x, anchor?.x);
  calcRelativeAxis(target.y, relative.y, parent.y, anchor?.y);
}
function calcRelativeAxisPosition(target, layout, parent, anchor = 0) {
  const anchorPoint = anchor ? mixNumber(parent.min, parent.max, anchor) : parent.min;
  target.min = layout.min - anchorPoint;
  target.max = target.min + calcLength(layout);
}
function calcRelativePosition(target, layout, parent, anchor) {
  calcRelativeAxisPosition(target.x, layout.x, parent.x, anchor?.x);
  calcRelativeAxisPosition(target.y, layout.y, parent.y, anchor?.y);
}
var SCALE_PRECISION = 0.0001, SCALE_MIN, SCALE_MAX, TRANSLATE_PRECISION = 0.01, TRANSLATE_MIN, TRANSLATE_MAX;
var init_delta_calc = __esm(() => {
  init_number();
  SCALE_MIN = 1 - SCALE_PRECISION;
  SCALE_MAX = 1 + SCALE_PRECISION;
  TRANSLATE_MIN = 0 - TRANSLATE_PRECISION;
  TRANSLATE_MAX = 0 + TRANSLATE_PRECISION;
});

// node_modules/motion-dom/dist/es/projection/geometry/delta-remove.mjs
function removePointDelta(point, translate, scale2, originPoint, boxScale) {
  point -= translate;
  point = scalePoint(point, 1 / scale2, originPoint);
  if (boxScale !== undefined) {
    point = scalePoint(point, 1 / boxScale, originPoint);
  }
  return point;
}
function removeAxisDelta(axis, translate = 0, scale2 = 1, origin = 0.5, boxScale, originAxis = axis, sourceAxis = axis) {
  if (percent.test(translate)) {
    translate = parseFloat(translate);
    const relativeProgress = mixNumber(sourceAxis.min, sourceAxis.max, translate / 100);
    translate = relativeProgress - sourceAxis.min;
  }
  if (typeof translate !== "number")
    return;
  let originPoint = mixNumber(originAxis.min, originAxis.max, origin);
  if (axis === originAxis)
    originPoint -= translate;
  axis.min = removePointDelta(axis.min, translate, scale2, originPoint, boxScale);
  axis.max = removePointDelta(axis.max, translate, scale2, originPoint, boxScale);
}
function removeAxisTransforms(axis, transforms, [key, scaleKey, originKey], origin, sourceAxis) {
  removeAxisDelta(axis, transforms[key], transforms[scaleKey], transforms[originKey], transforms.scale, origin, sourceAxis);
}
function removeBoxTransforms(box, transforms, originBox, sourceBox) {
  removeAxisTransforms(box.x, transforms, xKeys, originBox ? originBox.x : undefined, sourceBox ? sourceBox.x : undefined);
  removeAxisTransforms(box.y, transforms, yKeys, originBox ? originBox.y : undefined, sourceBox ? sourceBox.y : undefined);
}
var xKeys, yKeys;
var init_delta_remove = __esm(() => {
  init_number();
  init_units();
  init_delta_apply();
  xKeys = ["x", "scaleX", "originX"];
  yKeys = ["y", "scaleY", "originY"];
});

// node_modules/motion-dom/dist/es/projection/geometry/utils.mjs
function isAxisDeltaZero(delta) {
  return delta.translate === 0 && delta.scale === 1;
}
function isDeltaZero(delta) {
  return isAxisDeltaZero(delta.x) && isAxisDeltaZero(delta.y);
}
function axisEquals(a, b) {
  return a.min === b.min && a.max === b.max;
}
function boxEquals(a, b) {
  return axisEquals(a.x, b.x) && axisEquals(a.y, b.y);
}
function axisEqualsRounded(a, b) {
  return Math.round(a.min) === Math.round(b.min) && Math.round(a.max) === Math.round(b.max);
}
function boxEqualsRounded(a, b) {
  return axisEqualsRounded(a.x, b.x) && axisEqualsRounded(a.y, b.y);
}
function aspectRatio(box) {
  return calcLength(box.x) / calcLength(box.y);
}
function axisDeltaEquals(a, b) {
  return a.translate === b.translate && a.scale === b.scale && a.originPoint === b.originPoint;
}
var init_utils2 = __esm(() => {
  init_delta_calc();
});

// node_modules/motion-dom/dist/es/projection/utils/each-axis.mjs
function eachAxis(callback) {
  return [callback("x"), callback("y")];
}
var init_each_axis = () => {};

// node_modules/motion-dom/dist/es/projection/styles/transform.mjs
function buildProjectionTransform(delta, treeScale, latestTransform) {
  let transform2 = "";
  const xTranslate = delta.x.translate / treeScale.x;
  const yTranslate = delta.y.translate / treeScale.y;
  const zTranslate = latestTransform?.z || 0;
  if (xTranslate || yTranslate || zTranslate) {
    transform2 = `translate3d(${xTranslate}px, ${yTranslate}px, ${zTranslate}px) `;
  }
  if (treeScale.x !== 1 || treeScale.y !== 1) {
    transform2 += `scale(${1 / treeScale.x}, ${1 / treeScale.y}) `;
  }
  if (latestTransform) {
    const { transformPerspective, rotate: rotate2, rotateX, rotateY, skewX, skewY } = latestTransform;
    if (transformPerspective)
      transform2 = `perspective(${transformPerspective}px) ${transform2}`;
    if (rotate2)
      transform2 += `rotate(${rotate2}deg) `;
    if (rotateX)
      transform2 += `rotateX(${rotateX}deg) `;
    if (rotateY)
      transform2 += `rotateY(${rotateY}deg) `;
    if (skewX)
      transform2 += `skewX(${skewX}deg) `;
    if (skewY)
      transform2 += `skewY(${skewY}deg) `;
  }
  const elementScaleX = delta.x.scale * treeScale.x;
  const elementScaleY = delta.y.scale * treeScale.y;
  if (elementScaleX !== 1 || elementScaleY !== 1) {
    transform2 += `scale(${elementScaleX}, ${elementScaleY})`;
  }
  return transform2 || "none";
}
var init_transform3 = () => {};

// node_modules/motion-dom/dist/es/projection/animation/mix-values.mjs
function mixValues(target, follow, lead, progress2, shouldCrossfadeOpacity, isOnlyMember) {
  if (shouldCrossfadeOpacity) {
    target.opacity = mixNumber(0, lead.opacity ?? 1, easeCrossfadeIn(progress2));
    target.opacityExit = mixNumber(follow.opacity ?? 1, 0, easeCrossfadeOut(progress2));
  } else if (isOnlyMember) {
    target.opacity = mixNumber(follow.opacity ?? 1, lead.opacity ?? 1, progress2);
  }
  for (let i = 0;i < numBorders; i++) {
    const borderLabel = borderLabels[i];
    let followRadius = getRadius(follow, borderLabel);
    let leadRadius = getRadius(lead, borderLabel);
    if (followRadius === undefined && leadRadius === undefined)
      continue;
    followRadius || (followRadius = 0);
    leadRadius || (leadRadius = 0);
    const canMix = followRadius === 0 || leadRadius === 0 || isPx(followRadius) === isPx(leadRadius);
    if (canMix) {
      target[borderLabel] = Math.max(mixNumber(asNumber2(followRadius), asNumber2(leadRadius), progress2), 0);
      if (percent.test(leadRadius) || percent.test(followRadius)) {
        target[borderLabel] += "%";
      }
    } else {
      target[borderLabel] = leadRadius;
    }
  }
  if (follow.rotate || lead.rotate) {
    target.rotate = mixNumber(follow.rotate || 0, lead.rotate || 0, progress2);
  }
}
function getRadius(values, radiusName) {
  return values[radiusName] !== undefined ? values[radiusName] : values.borderRadius;
}
function compress(min, max, easing) {
  return (p) => {
    if (p < min)
      return 0;
    if (p > max)
      return 1;
    return easing(progress(min, max, p));
  };
}
var borderLabels, numBorders, asNumber2 = (value) => typeof value === "string" ? parseFloat(value) : value, isPx = (value) => typeof value === "number" || px.test(value), easeCrossfadeIn, easeCrossfadeOut;
var init_mix_values = __esm(() => {
  init_number();
  init_units();
  init_es();
  borderLabels = [
    "borderTopLeftRadius",
    "borderTopRightRadius",
    "borderBottomLeftRadius",
    "borderBottomRightRadius"
  ];
  numBorders = borderLabels.length;
  easeCrossfadeIn = /* @__PURE__ */ compress(0, 0.5, circOut);
  easeCrossfadeOut = /* @__PURE__ */ compress(0.5, 0.95, noop);
});

// node_modules/motion-dom/dist/es/animation/animate/single-value.mjs
function animateSingleValue(value, keyframes2, options) {
  const motionValue$1 = isMotionValue(value) ? value : motionValue(value);
  motionValue$1.start(animateMotionValue("", motionValue$1, keyframes2, options));
  return motionValue$1.animation;
}
var init_single_value = __esm(() => {
  init_motion_value();
  init_value();
  init_is_motion_value();
});

// node_modules/motion-dom/dist/es/events/add-dom-event.mjs
function addDomEvent(target, eventName, handler, options = { passive: true }) {
  target.addEventListener(eventName, handler, options);
  return () => target.removeEventListener(eventName, handler);
}
var init_add_dom_event = () => {};

// node_modules/motion-dom/dist/es/projection/utils/compare-by-depth.mjs
var compareByDepth = (a, b) => a.depth - b.depth;
var init_compare_by_depth = () => {};

// node_modules/motion-dom/dist/es/projection/utils/flat-tree.mjs
class FlatTree {
  constructor() {
    this.children = [];
    this.isDirty = false;
  }
  add(child) {
    addUniqueItem(this.children, child);
    this.isDirty = true;
  }
  remove(child) {
    removeItem(this.children, child);
    this.isDirty = true;
  }
  forEach(callback) {
    this.isDirty && this.children.sort(compareByDepth);
    this.isDirty = false;
    this.children.forEach(callback);
  }
}
var init_flat_tree = __esm(() => {
  init_es();
  init_compare_by_depth();
});

// node_modules/motion-dom/dist/es/utils/delay.mjs
function delay(callback, timeout) {
  const start = time.now();
  const checkElapsed = ({ timestamp }) => {
    const elapsed = timestamp - start;
    if (elapsed >= timeout) {
      cancelFrame(checkElapsed);
      callback(elapsed - timeout);
    }
  };
  frame.setup(checkElapsed, true);
  return () => cancelFrame(checkElapsed);
}
var init_delay = __esm(() => {
  init_sync_time();
  init_frame();
});

// node_modules/motion-dom/dist/es/value/utils/resolve-motion-value.mjs
function resolveMotionValue(value) {
  return isMotionValue(value) ? value.get() : value;
}
var init_resolve_motion_value = __esm(() => {
  init_is_motion_value();
});

// node_modules/motion-dom/dist/es/projection/shared/stack.mjs
class NodeStack {
  constructor() {
    this.members = [];
  }
  add(node) {
    addUniqueItem(this.members, node);
    for (let i = this.members.length - 1;i >= 0; i--) {
      const member = this.members[i];
      if (member === node || member === this.lead || member === this.prevLead)
        continue;
      const inst = member.instance;
      if ((!inst || inst.isConnected === false) && !member.snapshot) {
        removeItem(this.members, member);
        member.unmount();
      }
    }
    node.scheduleRender();
  }
  remove(node) {
    removeItem(this.members, node);
    if (node === this.prevLead)
      this.prevLead = undefined;
    if (node === this.lead) {
      const prevLead = this.members[this.members.length - 1];
      if (prevLead)
        this.promote(prevLead);
    }
  }
  relegate(node) {
    for (let i = this.members.indexOf(node) - 1;i >= 0; i--) {
      const member = this.members[i];
      if (member.isPresent !== false && member.instance?.isConnected !== false) {
        this.promote(member);
        return true;
      }
    }
    return false;
  }
  promote(node, preserveFollowOpacity) {
    const prevLead = this.lead;
    if (node === prevLead)
      return;
    this.prevLead = prevLead;
    this.lead = node;
    node.show();
    if (prevLead) {
      prevLead.updateSnapshot();
      node.scheduleRender();
      const { layoutDependency: prevDep } = prevLead.options;
      const { layoutDependency: nextDep } = node.options;
      if (prevDep === undefined || prevDep !== nextDep) {
        node.resumeFrom = prevLead;
        if (preserveFollowOpacity)
          prevLead.preserveOpacity = true;
        if (prevLead.snapshot) {
          node.snapshot = prevLead.snapshot;
          node.snapshot.latestValues = prevLead.animationValues || prevLead.latestValues;
        }
        if (node.root?.isUpdating)
          node.isLayoutDirty = true;
      }
      if (node.options.crossfade === false)
        prevLead.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((member) => {
      member.options.onExitComplete?.();
      member.resumingFrom?.options.onExitComplete?.();
    });
  }
  scheduleRender() {
    this.members.forEach((member) => member.instance && member.scheduleRender(false));
  }
  removeLeadSnapshot() {
    if (this.lead?.snapshot)
      this.lead.snapshot = undefined;
  }
}
var init_stack = __esm(() => {
  init_es();
});

// node_modules/motion-dom/dist/es/projection/node/state.mjs
var globalProjectionState;
var init_state3 = __esm(() => {
  globalProjectionState = {
    hasAnimatedSinceResize: true,
    hasEverUpdated: false
  };
});

// node_modules/motion-dom/dist/es/projection/node/create-projection-node.mjs
function resetDistortingTransform(key, visualElement, values, sharedAnimationValues) {
  const { latestValues } = visualElement;
  if (latestValues[key]) {
    values[key] = latestValues[key];
    visualElement.setStaticValue(key, 0);
    if (sharedAnimationValues) {
      sharedAnimationValues[key] = 0;
    }
  }
}
function cancelTreeOptimisedTransformAnimations(projectionNode) {
  projectionNode.hasCheckedOptimisedAppear = true;
  if (projectionNode.root === projectionNode)
    return;
  const { visualElement } = projectionNode.options;
  if (!visualElement)
    return;
  const appearId = getOptimisedAppearId(visualElement);
  if (window.MotionHasOptimisedAnimation(appearId, "transform")) {
    const { layout, layoutId } = projectionNode.options;
    window.MotionCancelOptimisedAnimation(appearId, "transform", frame, !(layout || layoutId));
  }
  const { parent } = projectionNode;
  if (parent && !parent.hasCheckedOptimisedAppear) {
    cancelTreeOptimisedTransformAnimations(parent);
  }
}
function createProjectionNode({ attachResizeListener, defaultParent, measureScroll, checkIsScrollRoot, resetTransform }) {
  return class ProjectionNode {
    constructor(latestValues = {}, parent = defaultParent?.()) {
      this.id = id++;
      this.animationId = 0;
      this.animationCommitId = 0;
      this.children = new Set;
      this.options = {};
      this.isTreeAnimating = false;
      this.isAnimationBlocked = false;
      this.isLayoutDirty = false;
      this.isProjectionDirty = false;
      this.isSharedProjectionDirty = false;
      this.isTransformDirty = false;
      this.updateManuallyBlocked = false;
      this.updateBlockedByResize = false;
      this.isUpdating = false;
      this.isSVG = false;
      this.needsReset = false;
      this.shouldResetTransform = false;
      this.hasCheckedOptimisedAppear = false;
      this.treeScale = { x: 1, y: 1 };
      this.eventHandlers = new Map;
      this.hasTreeAnimated = false;
      this.layoutVersion = 0;
      this.updateScheduled = false;
      this.scheduleUpdate = () => this.update();
      this.projectionUpdateScheduled = false;
      this.checkUpdateFailed = () => {
        if (this.isUpdating) {
          this.isUpdating = false;
          this.clearAllSnapshots();
        }
      };
      this.updateProjection = () => {
        this.projectionUpdateScheduled = false;
        if (statsBuffer.value) {
          metrics.nodes = metrics.calculatedTargetDeltas = metrics.calculatedProjections = 0;
        }
        this.nodes.forEach(propagateDirtyNodes);
        this.nodes.forEach(resolveTargetDelta);
        this.nodes.forEach(calcProjection);
        this.nodes.forEach(cleanDirtyNodes);
        if (statsBuffer.addProjectionMetrics) {
          statsBuffer.addProjectionMetrics(metrics);
        }
      };
      this.resolvedRelativeTargetAt = 0;
      this.linkedParentVersion = 0;
      this.hasProjected = false;
      this.isVisible = true;
      this.animationProgress = 0;
      this.sharedNodes = new Map;
      this.latestValues = latestValues;
      this.root = parent ? parent.root || parent : this;
      this.path = parent ? [...parent.path, parent] : [];
      this.parent = parent;
      this.depth = parent ? parent.depth + 1 : 0;
      for (let i = 0;i < this.path.length; i++) {
        this.path[i].shouldResetTransform = true;
      }
      if (this.root === this)
        this.nodes = new FlatTree;
    }
    addEventListener(name, handler) {
      if (!this.eventHandlers.has(name)) {
        this.eventHandlers.set(name, new SubscriptionManager);
      }
      return this.eventHandlers.get(name).add(handler);
    }
    notifyListeners(name, ...args) {
      const subscriptionManager = this.eventHandlers.get(name);
      subscriptionManager && subscriptionManager.notify(...args);
    }
    hasListeners(name) {
      return this.eventHandlers.has(name);
    }
    mount(instance) {
      if (this.instance)
        return;
      this.isSVG = isSVGElement(instance) && !isSVGSVGElement(instance);
      this.instance = instance;
      const { layoutId, layout, visualElement } = this.options;
      if (visualElement && !visualElement.current) {
        visualElement.mount(instance);
      }
      this.root.nodes.add(this);
      this.parent && this.parent.children.add(this);
      if (this.root.hasTreeAnimated && (layout || layoutId)) {
        this.isLayoutDirty = true;
      }
      if (attachResizeListener) {
        let cancelDelay;
        let innerWidth = 0;
        const resizeUnblockUpdate = () => this.root.updateBlockedByResize = false;
        frame.read(() => {
          innerWidth = window.innerWidth;
        });
        attachResizeListener(instance, () => {
          const newInnerWidth = window.innerWidth;
          if (newInnerWidth === innerWidth)
            return;
          innerWidth = newInnerWidth;
          this.root.updateBlockedByResize = true;
          cancelDelay && cancelDelay();
          cancelDelay = delay(resizeUnblockUpdate, 250);
          if (globalProjectionState.hasAnimatedSinceResize) {
            globalProjectionState.hasAnimatedSinceResize = false;
            this.nodes.forEach(finishAnimation);
          }
        });
      }
      if (layoutId) {
        this.root.registerSharedNode(layoutId, this);
      }
      if (this.options.animate !== false && visualElement && (layoutId || layout)) {
        this.addEventListener("didUpdate", ({ delta, hasLayoutChanged, hasRelativeLayoutChanged, layout: newLayout }) => {
          if (this.isTreeAnimationBlocked()) {
            this.target = undefined;
            this.relativeTarget = undefined;
            return;
          }
          const layoutTransition = this.options.transition || visualElement.getDefaultTransition() || defaultLayoutTransition;
          const { onLayoutAnimationStart, onLayoutAnimationComplete } = visualElement.getProps();
          const hasTargetChanged = !this.targetLayout || !boxEqualsRounded(this.targetLayout, newLayout);
          const hasOnlyRelativeTargetChanged = !hasLayoutChanged && hasRelativeLayoutChanged;
          if (this.options.layoutRoot || this.resumeFrom || hasOnlyRelativeTargetChanged || hasLayoutChanged && (hasTargetChanged || !this.currentAnimation)) {
            if (this.resumeFrom) {
              this.resumingFrom = this.resumeFrom;
              this.resumingFrom.resumingFrom = undefined;
            }
            const animationOptions = {
              ...getValueTransition(layoutTransition, "layout"),
              onPlay: onLayoutAnimationStart,
              onComplete: onLayoutAnimationComplete
            };
            if (visualElement.shouldReduceMotion || this.options.layoutRoot) {
              animationOptions.delay = 0;
              animationOptions.type = false;
            }
            this.startAnimation(animationOptions);
            this.setAnimationOrigin(delta, hasOnlyRelativeTargetChanged);
          } else {
            if (!hasLayoutChanged) {
              finishAnimation(this);
            }
            if (this.isLead() && this.options.onExitComplete) {
              this.options.onExitComplete();
            }
          }
          this.targetLayout = newLayout;
        });
      }
    }
    unmount() {
      this.options.layoutId && this.willUpdate();
      this.root.nodes.remove(this);
      const stack = this.getStack();
      stack && stack.remove(this);
      this.parent && this.parent.children.delete(this);
      this.instance = undefined;
      this.eventHandlers.clear();
      cancelFrame(this.updateProjection);
    }
    blockUpdate() {
      this.updateManuallyBlocked = true;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = false;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || false;
    }
    startUpdate() {
      if (this.isUpdateBlocked())
        return;
      this.isUpdating = true;
      this.nodes && this.nodes.forEach(resetSkewAndRotation);
      this.animationId++;
    }
    getTransformTemplate() {
      const { visualElement } = this.options;
      return visualElement && visualElement.getProps().transformTemplate;
    }
    willUpdate(shouldNotifyListeners = true) {
      this.root.hasTreeAnimated = true;
      if (this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear) {
        cancelTreeOptimisedTransformAnimations(this);
      }
      !this.root.isUpdating && this.root.startUpdate();
      if (this.isLayoutDirty)
        return;
      this.isLayoutDirty = true;
      for (let i = 0;i < this.path.length; i++) {
        const node = this.path[i];
        node.shouldResetTransform = true;
        if (typeof node.latestValues.x === "string" || typeof node.latestValues.y === "string") {
          node.isLayoutDirty = true;
        }
        node.updateScroll("snapshot");
        if (node.options.layoutRoot) {
          node.willUpdate(false);
        }
      }
      const { layoutId, layout } = this.options;
      if (layoutId === undefined && !layout)
        return;
      const transformTemplate = this.getTransformTemplate();
      this.prevTransformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : undefined;
      this.updateSnapshot();
      shouldNotifyListeners && this.notifyListeners("willUpdate");
    }
    update() {
      this.updateScheduled = false;
      const updateWasBlocked = this.isUpdateBlocked();
      if (updateWasBlocked) {
        const wasBlockedByResize = this.updateBlockedByResize;
        this.unblockUpdate();
        this.updateBlockedByResize = false;
        this.clearAllSnapshots();
        if (wasBlockedByResize) {
          this.nodes.forEach(forceLayoutMeasure);
        }
        this.nodes.forEach(clearMeasurements);
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(clearIsLayoutDirty);
        return;
      }
      this.animationCommitId = this.animationId;
      if (!this.isUpdating) {
        this.nodes.forEach(clearIsLayoutDirty);
      } else {
        this.isUpdating = false;
        this.nodes.forEach(ensureDraggedNodesSnapshotted);
        this.nodes.forEach(resetTransformStyle);
        this.nodes.forEach(updateLayout);
        this.nodes.forEach(notifyLayoutUpdate);
      }
      this.clearAllSnapshots();
      const now2 = time.now();
      frameData.delta = clamp(0, 1000 / 60, now2 - frameData.timestamp);
      frameData.timestamp = now2;
      frameData.isProcessing = true;
      frameSteps.update.process(frameData);
      frameSteps.preRender.process(frameData);
      frameSteps.render.process(frameData);
      frameData.isProcessing = false;
    }
    didUpdate() {
      if (!this.updateScheduled) {
        this.updateScheduled = true;
        microtask.read(this.scheduleUpdate);
      }
    }
    clearAllSnapshots() {
      this.nodes.forEach(clearSnapshot);
      this.sharedNodes.forEach(removeLeadSnapshots);
    }
    scheduleUpdateProjection() {
      if (!this.projectionUpdateScheduled) {
        this.projectionUpdateScheduled = true;
        frame.preRender(this.updateProjection, false, true);
      }
    }
    scheduleCheckAfterUnmount() {
      frame.postRender(() => {
        if (this.isLayoutDirty) {
          this.root.didUpdate();
        } else {
          this.root.checkUpdateFailed();
        }
      });
    }
    updateSnapshot() {
      if (this.snapshot || !this.instance)
        return;
      this.snapshot = this.measure();
      if (this.snapshot && !calcLength(this.snapshot.measuredBox.x) && !calcLength(this.snapshot.measuredBox.y)) {
        this.snapshot = undefined;
      }
    }
    updateLayout() {
      if (!this.instance)
        return;
      this.updateScroll();
      if (!(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty) {
        return;
      }
      if (this.resumeFrom && !this.resumeFrom.instance) {
        for (let i = 0;i < this.path.length; i++) {
          const node = this.path[i];
          node.updateScroll();
        }
      }
      const prevLayout = this.layout;
      this.layout = this.measure(false);
      this.layoutVersion++;
      if (!this.layoutCorrected)
        this.layoutCorrected = createBox();
      this.isLayoutDirty = false;
      this.projectionDelta = undefined;
      this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement } = this.options;
      visualElement && visualElement.notify("LayoutMeasure", this.layout.layoutBox, prevLayout ? prevLayout.layoutBox : undefined);
    }
    updateScroll(phase = "measure") {
      let needsMeasurement = Boolean(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === phase) {
        needsMeasurement = false;
      }
      if (needsMeasurement && this.instance) {
        const isRoot = checkIsScrollRoot(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase,
          isRoot,
          offset: measureScroll(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : isRoot
        };
      }
    }
    resetTransform() {
      if (!resetTransform)
        return;
      const isResetRequested = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout;
      const hasProjection = this.projectionDelta && !isDeltaZero(this.projectionDelta);
      const transformTemplate = this.getTransformTemplate();
      const transformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : undefined;
      const transformTemplateHasChanged = transformTemplateValue !== this.prevTransformTemplateValue;
      if (isResetRequested && this.instance && (hasProjection || hasTransform(this.latestValues) || transformTemplateHasChanged)) {
        resetTransform(this.instance, transformTemplateValue);
        this.shouldResetTransform = false;
        this.scheduleRender();
      }
    }
    measure(removeTransform = true) {
      const pageBox = this.measurePageBox();
      let layoutBox = this.removeElementScroll(pageBox);
      if (removeTransform) {
        layoutBox = this.removeTransform(layoutBox);
      }
      roundBox(layoutBox);
      return {
        animationId: this.root.animationId,
        measuredBox: pageBox,
        layoutBox,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      const { visualElement } = this.options;
      if (!visualElement)
        return createBox();
      const box = visualElement.measureViewportBox();
      const wasInScrollRoot = this.scroll?.wasRoot || this.path.some(checkNodeWasScrollRoot);
      if (!wasInScrollRoot) {
        const { scroll } = this.root;
        if (scroll) {
          translateAxis(box.x, scroll.offset.x);
          translateAxis(box.y, scroll.offset.y);
        }
      }
      return box;
    }
    removeElementScroll(box) {
      const boxWithoutScroll = createBox();
      copyBoxInto(boxWithoutScroll, box);
      if (this.scroll?.wasRoot) {
        return boxWithoutScroll;
      }
      for (let i = 0;i < this.path.length; i++) {
        const node = this.path[i];
        const { scroll, options } = node;
        if (node !== this.root && scroll && options.layoutScroll) {
          if (scroll.wasRoot) {
            copyBoxInto(boxWithoutScroll, box);
          }
          translateAxis(boxWithoutScroll.x, scroll.offset.x);
          translateAxis(boxWithoutScroll.y, scroll.offset.y);
        }
      }
      return boxWithoutScroll;
    }
    applyTransform(box, transformOnly = false, output) {
      const withTransforms = output || createBox();
      copyBoxInto(withTransforms, box);
      for (let i = 0;i < this.path.length; i++) {
        const node = this.path[i];
        if (!transformOnly && node.options.layoutScroll && node.scroll && node !== node.root) {
          translateAxis(withTransforms.x, -node.scroll.offset.x);
          translateAxis(withTransforms.y, -node.scroll.offset.y);
        }
        if (!hasTransform(node.latestValues))
          continue;
        transformBox(withTransforms, node.latestValues, node.layout?.layoutBox);
      }
      if (hasTransform(this.latestValues)) {
        transformBox(withTransforms, this.latestValues, this.layout?.layoutBox);
      }
      return withTransforms;
    }
    removeTransform(box) {
      const boxWithoutTransform = createBox();
      copyBoxInto(boxWithoutTransform, box);
      for (let i = 0;i < this.path.length; i++) {
        const node = this.path[i];
        if (!hasTransform(node.latestValues))
          continue;
        let sourceBox;
        if (node.instance) {
          hasScale(node.latestValues) && node.updateSnapshot();
          sourceBox = createBox();
          copyBoxInto(sourceBox, node.measurePageBox());
        }
        removeBoxTransforms(boxWithoutTransform, node.latestValues, node.snapshot?.layoutBox, sourceBox);
      }
      if (hasTransform(this.latestValues)) {
        removeBoxTransforms(boxWithoutTransform, this.latestValues);
      }
      return boxWithoutTransform;
    }
    setTargetDelta(delta) {
      this.targetDelta = delta;
      this.root.scheduleUpdateProjection();
      this.isProjectionDirty = true;
    }
    setOptions(options) {
      this.options = {
        ...this.options,
        ...options,
        crossfade: options.crossfade !== undefined ? options.crossfade : true
      };
    }
    clearMeasurements() {
      this.scroll = undefined;
      this.layout = undefined;
      this.snapshot = undefined;
      this.prevTransformTemplateValue = undefined;
      this.targetDelta = undefined;
      this.target = undefined;
      this.isLayoutDirty = false;
    }
    forceRelativeParentToResolveTarget() {
      if (!this.relativeParent)
        return;
      if (this.relativeParent.resolvedRelativeTargetAt !== frameData.timestamp) {
        this.relativeParent.resolveTargetDelta(true);
      }
    }
    resolveTargetDelta(forceRecalculation = false) {
      const lead = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = lead.isProjectionDirty);
      this.isTransformDirty || (this.isTransformDirty = lead.isTransformDirty);
      this.isSharedProjectionDirty || (this.isSharedProjectionDirty = lead.isSharedProjectionDirty);
      const isShared = Boolean(this.resumingFrom) || this !== lead;
      const canSkip = !(forceRecalculation || isShared && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize);
      if (canSkip)
        return;
      const { layout, layoutId } = this.options;
      if (!this.layout || !(layout || layoutId))
        return;
      this.resolvedRelativeTargetAt = frameData.timestamp;
      const relativeParent = this.getClosestProjectingParent();
      if (relativeParent && this.linkedParentVersion !== relativeParent.layoutVersion && !relativeParent.options.layoutRoot) {
        this.removeRelativeTarget();
      }
      if (!this.targetDelta && !this.relativeTarget) {
        if (this.options.layoutAnchor !== false && relativeParent && relativeParent.layout) {
          this.createRelativeTarget(relativeParent, this.layout.layoutBox, relativeParent.layout.layoutBox);
        } else {
          this.removeRelativeTarget();
        }
      }
      if (!this.relativeTarget && !this.targetDelta)
        return;
      if (!this.target) {
        this.target = createBox();
        this.targetWithTransforms = createBox();
      }
      if (this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target) {
        this.forceRelativeParentToResolveTarget();
        calcRelativeBox(this.target, this.relativeTarget, this.relativeParent.target, this.options.layoutAnchor || undefined);
      } else if (this.targetDelta) {
        if (this.resumingFrom) {
          this.applyTransform(this.layout.layoutBox, false, this.target);
        } else {
          copyBoxInto(this.target, this.layout.layoutBox);
        }
        applyBoxDelta(this.target, this.targetDelta);
      } else {
        copyBoxInto(this.target, this.layout.layoutBox);
      }
      if (this.attemptToResolveRelativeTarget) {
        this.attemptToResolveRelativeTarget = false;
        if (this.options.layoutAnchor !== false && relativeParent && Boolean(relativeParent.resumingFrom) === Boolean(this.resumingFrom) && !relativeParent.options.layoutScroll && relativeParent.target && this.animationProgress !== 1) {
          this.createRelativeTarget(relativeParent, this.target, relativeParent.target);
        } else {
          this.relativeParent = this.relativeTarget = undefined;
        }
      }
      if (statsBuffer.value) {
        metrics.calculatedTargetDeltas++;
      }
    }
    getClosestProjectingParent() {
      if (!this.parent || hasScale(this.parent.latestValues) || has2DTranslate(this.parent.latestValues)) {
        return;
      }
      if (this.parent.isProjecting()) {
        return this.parent;
      } else {
        return this.parent.getClosestProjectingParent();
      }
    }
    isProjecting() {
      return Boolean((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    createRelativeTarget(relativeParent, layout, parentLayout) {
      this.relativeParent = relativeParent;
      this.linkedParentVersion = relativeParent.layoutVersion;
      this.forceRelativeParentToResolveTarget();
      this.relativeTarget = createBox();
      this.relativeTargetOrigin = createBox();
      calcRelativePosition(this.relativeTargetOrigin, layout, parentLayout, this.options.layoutAnchor || undefined);
      copyBoxInto(this.relativeTarget, this.relativeTargetOrigin);
    }
    removeRelativeTarget() {
      this.relativeParent = this.relativeTarget = undefined;
    }
    calcProjection() {
      const lead = this.getLead();
      const isShared = Boolean(this.resumingFrom) || this !== lead;
      let canSkip = true;
      if (this.isProjectionDirty || this.parent?.isProjectionDirty) {
        canSkip = false;
      }
      if (isShared && (this.isSharedProjectionDirty || this.isTransformDirty)) {
        canSkip = false;
      }
      if (this.resolvedRelativeTargetAt === frameData.timestamp) {
        canSkip = false;
      }
      if (canSkip)
        return;
      const { layout, layoutId } = this.options;
      this.isTreeAnimating = Boolean(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation);
      if (!this.isTreeAnimating) {
        this.targetDelta = this.relativeTarget = undefined;
      }
      if (!this.layout || !(layout || layoutId))
        return;
      copyBoxInto(this.layoutCorrected, this.layout.layoutBox);
      const prevTreeScaleX = this.treeScale.x;
      const prevTreeScaleY = this.treeScale.y;
      applyTreeDeltas(this.layoutCorrected, this.treeScale, this.path, isShared);
      if (lead.layout && !lead.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1)) {
        lead.target = lead.layout.layoutBox;
        lead.targetWithTransforms = createBox();
      }
      const { target } = lead;
      if (!target) {
        if (this.prevProjectionDelta) {
          this.createProjectionDeltas();
          this.scheduleRender();
        }
        return;
      }
      if (!this.projectionDelta || !this.prevProjectionDelta) {
        this.createProjectionDeltas();
      } else {
        copyAxisDeltaInto(this.prevProjectionDelta.x, this.projectionDelta.x);
        copyAxisDeltaInto(this.prevProjectionDelta.y, this.projectionDelta.y);
      }
      calcBoxDelta(this.projectionDelta, this.layoutCorrected, target, this.latestValues);
      if (this.treeScale.x !== prevTreeScaleX || this.treeScale.y !== prevTreeScaleY || !axisDeltaEquals(this.projectionDelta.x, this.prevProjectionDelta.x) || !axisDeltaEquals(this.projectionDelta.y, this.prevProjectionDelta.y)) {
        this.hasProjected = true;
        this.scheduleRender();
        this.notifyListeners("projectionUpdate", target);
      }
      if (statsBuffer.value) {
        metrics.calculatedProjections++;
      }
    }
    hide() {
      this.isVisible = false;
    }
    show() {
      this.isVisible = true;
    }
    scheduleRender(notifyAll2 = true) {
      this.options.visualElement?.scheduleRender();
      if (notifyAll2) {
        const stack = this.getStack();
        stack && stack.scheduleRender();
      }
      if (this.resumingFrom && !this.resumingFrom.instance) {
        this.resumingFrom = undefined;
      }
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = createDelta();
      this.projectionDelta = createDelta();
      this.projectionDeltaWithTransform = createDelta();
    }
    setAnimationOrigin(delta, hasOnlyRelativeTargetChanged = false) {
      const snapshot = this.snapshot;
      const snapshotLatestValues = snapshot ? snapshot.latestValues : {};
      const mixedValues = { ...this.latestValues };
      const targetDelta = createDelta();
      if (!this.relativeParent || !this.relativeParent.options.layoutRoot) {
        this.relativeTarget = this.relativeTargetOrigin = undefined;
      }
      this.attemptToResolveRelativeTarget = !hasOnlyRelativeTargetChanged;
      const relativeLayout = createBox();
      const snapshotSource = snapshot ? snapshot.source : undefined;
      const layoutSource = this.layout ? this.layout.source : undefined;
      const isSharedLayoutAnimation = snapshotSource !== layoutSource;
      const stack = this.getStack();
      const isOnlyMember = !stack || stack.members.length <= 1;
      const shouldCrossfadeOpacity = Boolean(isSharedLayoutAnimation && !isOnlyMember && this.options.crossfade === true && !this.path.some(hasOpacityCrossfade));
      this.animationProgress = 0;
      let prevRelativeTarget;
      this.mixTargetDelta = (latest) => {
        const progress2 = latest / 1000;
        mixAxisDelta(targetDelta.x, delta.x, progress2);
        mixAxisDelta(targetDelta.y, delta.y, progress2);
        this.setTargetDelta(targetDelta);
        if (this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout) {
          calcRelativePosition(relativeLayout, this.layout.layoutBox, this.relativeParent.layout.layoutBox, this.options.layoutAnchor || undefined);
          mixBox(this.relativeTarget, this.relativeTargetOrigin, relativeLayout, progress2);
          if (prevRelativeTarget && boxEquals(this.relativeTarget, prevRelativeTarget)) {
            this.isProjectionDirty = false;
          }
          if (!prevRelativeTarget)
            prevRelativeTarget = createBox();
          copyBoxInto(prevRelativeTarget, this.relativeTarget);
        }
        if (isSharedLayoutAnimation) {
          this.animationValues = mixedValues;
          mixValues(mixedValues, snapshotLatestValues, this.latestValues, progress2, shouldCrossfadeOpacity, isOnlyMember);
        }
        this.root.scheduleUpdateProjection();
        this.scheduleRender();
        this.animationProgress = progress2;
      };
      this.mixTargetDelta(this.options.layoutRoot ? 1000 : 0);
    }
    startAnimation(options) {
      this.notifyListeners("animationStart");
      this.currentAnimation?.stop();
      this.resumingFrom?.currentAnimation?.stop();
      if (this.pendingAnimation) {
        cancelFrame(this.pendingAnimation);
        this.pendingAnimation = undefined;
      }
      this.pendingAnimation = frame.update(() => {
        globalProjectionState.hasAnimatedSinceResize = true;
        activeAnimations.layout++;
        this.motionValue || (this.motionValue = motionValue(0));
        this.motionValue.jump(0, false);
        this.currentAnimation = animateSingleValue(this.motionValue, [0, 1000], {
          ...options,
          velocity: 0,
          isSync: true,
          onUpdate: (latest) => {
            this.mixTargetDelta(latest);
            options.onUpdate && options.onUpdate(latest);
          },
          onStop: () => {
            activeAnimations.layout--;
          },
          onComplete: () => {
            activeAnimations.layout--;
            options.onComplete && options.onComplete();
            this.completeAnimation();
          }
        });
        if (this.resumingFrom) {
          this.resumingFrom.currentAnimation = this.currentAnimation;
        }
        this.pendingAnimation = undefined;
      });
    }
    completeAnimation() {
      if (this.resumingFrom) {
        this.resumingFrom.currentAnimation = undefined;
        this.resumingFrom.preserveOpacity = undefined;
      }
      const stack = this.getStack();
      stack && stack.exitAnimationComplete();
      this.resumingFrom = this.currentAnimation = this.animationValues = undefined;
      this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      if (this.currentAnimation) {
        this.mixTargetDelta && this.mixTargetDelta(animationTarget);
        this.currentAnimation.stop();
      }
      this.completeAnimation();
    }
    applyTransformsToTarget() {
      const lead = this.getLead();
      let { targetWithTransforms, target, layout, latestValues } = lead;
      if (!targetWithTransforms || !target || !layout)
        return;
      if (this !== lead && this.layout && layout && shouldAnimatePositionOnly(this.options.animationType, this.layout.layoutBox, layout.layoutBox)) {
        target = this.target || createBox();
        const xLength = calcLength(this.layout.layoutBox.x);
        target.x.min = lead.target.x.min;
        target.x.max = target.x.min + xLength;
        const yLength = calcLength(this.layout.layoutBox.y);
        target.y.min = lead.target.y.min;
        target.y.max = target.y.min + yLength;
      }
      copyBoxInto(targetWithTransforms, target);
      transformBox(targetWithTransforms, latestValues);
      calcBoxDelta(this.projectionDeltaWithTransform, this.layoutCorrected, targetWithTransforms, latestValues);
    }
    registerSharedNode(layoutId, node) {
      if (!this.sharedNodes.has(layoutId)) {
        this.sharedNodes.set(layoutId, new NodeStack);
      }
      const stack = this.sharedNodes.get(layoutId);
      stack.add(node);
      const config = node.options.initialPromotionConfig;
      node.promote({
        transition: config ? config.transition : undefined,
        preserveFollowOpacity: config && config.shouldPreserveFollowOpacity ? config.shouldPreserveFollowOpacity(node) : undefined
      });
    }
    isLead() {
      const stack = this.getStack();
      return stack ? stack.lead === this : true;
    }
    getLead() {
      const { layoutId } = this.options;
      return layoutId ? this.getStack()?.lead || this : this;
    }
    getPrevLead() {
      const { layoutId } = this.options;
      return layoutId ? this.getStack()?.prevLead : undefined;
    }
    getStack() {
      const { layoutId } = this.options;
      if (layoutId)
        return this.root.sharedNodes.get(layoutId);
    }
    promote({ needsReset, transition, preserveFollowOpacity } = {}) {
      const stack = this.getStack();
      if (stack)
        stack.promote(this, preserveFollowOpacity);
      if (needsReset) {
        this.projectionDelta = undefined;
        this.needsReset = true;
      }
      if (transition)
        this.setOptions({ transition });
    }
    relegate() {
      const stack = this.getStack();
      if (stack) {
        return stack.relegate(this);
      } else {
        return false;
      }
    }
    resetSkewAndRotation() {
      const { visualElement } = this.options;
      if (!visualElement)
        return;
      let hasDistortingTransform = false;
      const { latestValues } = visualElement;
      if (latestValues.z || latestValues.rotate || latestValues.rotateX || latestValues.rotateY || latestValues.rotateZ || latestValues.skewX || latestValues.skewY) {
        hasDistortingTransform = true;
      }
      if (!hasDistortingTransform)
        return;
      const resetValues = {};
      if (latestValues.z) {
        resetDistortingTransform("z", visualElement, resetValues, this.animationValues);
      }
      for (let i = 0;i < transformAxes.length; i++) {
        resetDistortingTransform(`rotate${transformAxes[i]}`, visualElement, resetValues, this.animationValues);
        resetDistortingTransform(`skew${transformAxes[i]}`, visualElement, resetValues, this.animationValues);
      }
      visualElement.render();
      for (const key in resetValues) {
        visualElement.setStaticValue(key, resetValues[key]);
        if (this.animationValues) {
          this.animationValues[key] = resetValues[key];
        }
      }
      visualElement.scheduleRender();
    }
    applyProjectionStyles(targetStyle, styleProp) {
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible) {
        targetStyle.visibility = "hidden";
        return;
      }
      const transformTemplate = this.getTransformTemplate();
      if (this.needsReset) {
        this.needsReset = false;
        targetStyle.visibility = "";
        targetStyle.opacity = "";
        targetStyle.pointerEvents = resolveMotionValue(styleProp?.pointerEvents) || "";
        targetStyle.transform = transformTemplate ? transformTemplate(this.latestValues, "") : "none";
        return;
      }
      const lead = this.getLead();
      if (!this.projectionDelta || !this.layout || !lead.target) {
        if (this.options.layoutId) {
          targetStyle.opacity = this.latestValues.opacity !== undefined ? this.latestValues.opacity : 1;
          targetStyle.pointerEvents = resolveMotionValue(styleProp?.pointerEvents) || "";
        }
        if (this.hasProjected && !hasTransform(this.latestValues)) {
          targetStyle.transform = transformTemplate ? transformTemplate({}, "") : "none";
          this.hasProjected = false;
        }
        return;
      }
      targetStyle.visibility = "";
      const valuesToRender = lead.animationValues || lead.latestValues;
      this.applyTransformsToTarget();
      let transform2 = buildProjectionTransform(this.projectionDeltaWithTransform, this.treeScale, valuesToRender);
      if (transformTemplate) {
        transform2 = transformTemplate(valuesToRender, transform2);
      }
      targetStyle.transform = transform2;
      const { x, y } = this.projectionDelta;
      targetStyle.transformOrigin = `${x.origin * 100}% ${y.origin * 100}% 0`;
      if (lead.animationValues) {
        targetStyle.opacity = lead === this ? valuesToRender.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : valuesToRender.opacityExit;
      } else {
        targetStyle.opacity = lead === this ? valuesToRender.opacity !== undefined ? valuesToRender.opacity : "" : valuesToRender.opacityExit !== undefined ? valuesToRender.opacityExit : 0;
      }
      for (const key in scaleCorrectors) {
        if (valuesToRender[key] === undefined)
          continue;
        const { correct, applyTo, isCSSVariable } = scaleCorrectors[key];
        const corrected = transform2 === "none" ? valuesToRender[key] : correct(valuesToRender[key], lead);
        if (applyTo) {
          const num = applyTo.length;
          for (let i = 0;i < num; i++) {
            targetStyle[applyTo[i]] = corrected;
          }
        } else {
          if (isCSSVariable) {
            this.options.visualElement.renderState.vars[key] = corrected;
          } else {
            targetStyle[key] = corrected;
          }
        }
      }
      if (this.options.layoutId) {
        targetStyle.pointerEvents = lead === this ? resolveMotionValue(styleProp?.pointerEvents) || "" : "none";
      }
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = undefined;
    }
    resetTree() {
      this.root.nodes.forEach((node) => node.currentAnimation?.stop());
      this.root.nodes.forEach(clearMeasurements);
      this.root.sharedNodes.clear();
    }
  };
}
function updateLayout(node) {
  node.updateLayout();
}
function notifyLayoutUpdate(node) {
  const snapshot = node.resumeFrom?.snapshot || node.snapshot;
  if (node.isLead() && node.layout && snapshot && node.hasListeners("didUpdate")) {
    const { layoutBox: layout, measuredBox: measuredLayout } = node.layout;
    const { animationType } = node.options;
    const isShared = snapshot.source !== node.layout.source;
    if (animationType === "size") {
      eachAxis((axis) => {
        const axisSnapshot = isShared ? snapshot.measuredBox[axis] : snapshot.layoutBox[axis];
        const length = calcLength(axisSnapshot);
        axisSnapshot.min = layout[axis].min;
        axisSnapshot.max = axisSnapshot.min + length;
      });
    } else if (animationType === "x" || animationType === "y") {
      const snapAxis = animationType === "x" ? "y" : "x";
      copyAxisInto(isShared ? snapshot.measuredBox[snapAxis] : snapshot.layoutBox[snapAxis], layout[snapAxis]);
    } else if (shouldAnimatePositionOnly(animationType, snapshot.layoutBox, layout)) {
      eachAxis((axis) => {
        const axisSnapshot = isShared ? snapshot.measuredBox[axis] : snapshot.layoutBox[axis];
        const length = calcLength(layout[axis]);
        axisSnapshot.max = axisSnapshot.min + length;
        if (node.relativeTarget && !node.currentAnimation) {
          node.isProjectionDirty = true;
          node.relativeTarget[axis].max = node.relativeTarget[axis].min + length;
        }
      });
    }
    const layoutDelta = createDelta();
    calcBoxDelta(layoutDelta, layout, snapshot.layoutBox);
    const visualDelta = createDelta();
    if (isShared) {
      calcBoxDelta(visualDelta, node.applyTransform(measuredLayout, true), snapshot.measuredBox);
    } else {
      calcBoxDelta(visualDelta, layout, snapshot.layoutBox);
    }
    const hasLayoutChanged = !isDeltaZero(layoutDelta);
    let hasRelativeLayoutChanged = false;
    if (!node.resumeFrom) {
      const relativeParent = node.getClosestProjectingParent();
      if (relativeParent && !relativeParent.resumeFrom) {
        const { snapshot: parentSnapshot, layout: parentLayout } = relativeParent;
        if (parentSnapshot && parentLayout) {
          const anchor = node.options.layoutAnchor || undefined;
          const relativeSnapshot = createBox();
          calcRelativePosition(relativeSnapshot, snapshot.layoutBox, parentSnapshot.layoutBox, anchor);
          const relativeLayout = createBox();
          calcRelativePosition(relativeLayout, layout, parentLayout.layoutBox, anchor);
          if (!boxEqualsRounded(relativeSnapshot, relativeLayout)) {
            hasRelativeLayoutChanged = true;
          }
          if (relativeParent.options.layoutRoot) {
            node.relativeTarget = relativeLayout;
            node.relativeTargetOrigin = relativeSnapshot;
            node.relativeParent = relativeParent;
          }
        }
      }
    }
    node.notifyListeners("didUpdate", {
      layout,
      snapshot,
      delta: visualDelta,
      layoutDelta,
      hasLayoutChanged,
      hasRelativeLayoutChanged
    });
  } else if (node.isLead()) {
    const { onExitComplete } = node.options;
    onExitComplete && onExitComplete();
  }
  node.options.transition = undefined;
}
function propagateDirtyNodes(node) {
  if (statsBuffer.value) {
    metrics.nodes++;
  }
  if (!node.parent)
    return;
  if (!node.isProjecting()) {
    node.isProjectionDirty = node.parent.isProjectionDirty;
  }
  node.isSharedProjectionDirty || (node.isSharedProjectionDirty = Boolean(node.isProjectionDirty || node.parent.isProjectionDirty || node.parent.isSharedProjectionDirty));
  node.isTransformDirty || (node.isTransformDirty = node.parent.isTransformDirty);
}
function cleanDirtyNodes(node) {
  node.isProjectionDirty = node.isSharedProjectionDirty = node.isTransformDirty = false;
}
function clearSnapshot(node) {
  node.clearSnapshot();
}
function clearMeasurements(node) {
  node.clearMeasurements();
}
function forceLayoutMeasure(node) {
  node.isLayoutDirty = true;
  node.updateLayout();
}
function clearIsLayoutDirty(node) {
  node.isLayoutDirty = false;
}
function ensureDraggedNodesSnapshotted(node) {
  if (node.isAnimationBlocked && node.layout && !node.isLayoutDirty) {
    node.snapshot = node.layout;
    node.isLayoutDirty = true;
  }
}
function resetTransformStyle(node) {
  const { visualElement } = node.options;
  if (visualElement && visualElement.getProps().onBeforeLayoutMeasure) {
    visualElement.notify("BeforeLayoutMeasure");
  }
  node.resetTransform();
}
function finishAnimation(node) {
  node.finishAnimation();
  node.targetDelta = node.relativeTarget = node.target = undefined;
  node.isProjectionDirty = true;
}
function resolveTargetDelta(node) {
  node.resolveTargetDelta();
}
function calcProjection(node) {
  node.calcProjection();
}
function resetSkewAndRotation(node) {
  node.resetSkewAndRotation();
}
function removeLeadSnapshots(stack) {
  stack.removeLeadSnapshot();
}
function mixAxisDelta(output, delta, p) {
  output.translate = mixNumber(delta.translate, 0, p);
  output.scale = mixNumber(delta.scale, 1, p);
  output.origin = delta.origin;
  output.originPoint = delta.originPoint;
}
function mixAxis(output, from, to, p) {
  output.min = mixNumber(from.min, to.min, p);
  output.max = mixNumber(from.max, to.max, p);
}
function mixBox(output, from, to, p) {
  mixAxis(output.x, from.x, to.x, p);
  mixAxis(output.y, from.y, to.y, p);
}
function hasOpacityCrossfade(node) {
  return node.animationValues && node.animationValues.opacityExit !== undefined;
}
function roundAxis(axis) {
  axis.min = roundPoint(axis.min);
  axis.max = roundPoint(axis.max);
}
function roundBox(box) {
  roundAxis(box.x);
  roundAxis(box.y);
}
function shouldAnimatePositionOnly(animationType, snapshot, layout) {
  return animationType === "position" || animationType === "preserve-aspect" && !isNear(aspectRatio(snapshot), aspectRatio(layout), 0.2);
}
function checkNodeWasScrollRoot(node) {
  return node !== node.root && node.scroll?.wasRoot;
}
var metrics, transformAxes, animationTarget = 1000, id = 0, defaultLayoutTransition, userAgentContains = (string) => typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(string), roundPoint;
var init_create_projection_node = __esm(() => {
  init_es();
  init_single_value();
  init_get_appear_id();
  init_get_value_transition();
  init_microtask();
  init_sync_time();
  init_scale_correction();
  init_animation_count();
  init_buffer();
  init_delay();
  init_is_svg_element();
  init_is_svg_svg_element();
  init_number();
  init_value();
  init_resolve_motion_value();
  init_mix_values();
  init_copy();
  init_delta_apply();
  init_delta_calc();
  init_delta_remove();
  init_models();
  init_utils2();
  init_stack();
  init_transform3();
  init_each_axis();
  init_flat_tree();
  init_has_transform();
  init_state3();
  init_frame();
  metrics = {
    nodes: 0,
    calculatedTargetDeltas: 0,
    calculatedProjections: 0
  };
  transformAxes = ["", "X", "Y", "Z"];
  defaultLayoutTransition = {
    duration: 0.45,
    ease: [0.4, 0, 0.1, 1]
  };
  roundPoint = userAgentContains("applewebkit/") && !userAgentContains("chrome/") ? Math.round : noop;
});

// node_modules/motion-dom/dist/es/projection/node/DocumentProjectionNode.mjs
var DocumentProjectionNode;
var init_DocumentProjectionNode = __esm(() => {
  init_add_dom_event();
  init_create_projection_node();
  DocumentProjectionNode = createProjectionNode({
    attachResizeListener: (ref, notify) => addDomEvent(ref, "resize", notify),
    measureScroll: () => ({
      x: document.documentElement.scrollLeft || document.body?.scrollLeft || 0,
      y: document.documentElement.scrollTop || document.body?.scrollTop || 0
    }),
    checkIsScrollRoot: () => true
  });
});

// node_modules/motion-dom/dist/es/projection/node/HTMLProjectionNode.mjs
var rootProjectionNode, HTMLProjectionNode;
var init_HTMLProjectionNode = __esm(() => {
  init_create_projection_node();
  init_DocumentProjectionNode();
  rootProjectionNode = {
    current: undefined
  };
  HTMLProjectionNode = createProjectionNode({
    measureScroll: (instance) => ({
      x: instance.scrollLeft,
      y: instance.scrollTop
    }),
    defaultParent: () => {
      if (!rootProjectionNode.current) {
        const documentNode = new DocumentProjectionNode({});
        documentNode.mount(window);
        documentNode.setOptions({ layoutScroll: true });
        rootProjectionNode.current = documentNode;
      }
      return rootProjectionNode.current;
    },
    resetTransform: (instance, value) => {
      instance.style.transform = value !== undefined ? value : "none";
    },
    checkIsScrollRoot: (instance) => Boolean(window.getComputedStyle(instance).position === "fixed")
  });
});

// node_modules/motion-dom/dist/es/index.mjs
var init_es2 = __esm(() => {
  init_GroupAnimationWithThen();
  init_motion_value();
  init_visual_element_target();
  init_data_id();
  init_spring();
  init_create_generator_easing();
  init_is_generator();
  init_default();
  init_fill();
  init_microtask();
  init_set_active();
  init_hover();
  init_press();
  init_is_keyboard_accessible();
  init_is_primary_pointer();
  init_resize();
  init_is_html_element();
  init_is_svg_element();
  init_is_svg_svg_element();
  init_number();
  init_resolve_elements();
  init_transform2();
  init_value();
  init_follow_value();
  init_units();
  init_is_motion_value();
  init_add_will_change();
  init_Feature();
  init_HTMLVisualElement();
  init_ObjectVisualElement();
  init_store();
  init_SVGVisualElement();
  init_VisualElement();
  init_animation_state();
  init_is_animation_controls();
  init_is_controlling_variants();
  init_is_forced_motion_value();
  init_is_variant_label();
  init_resolve_dynamic_variants();
  init_resolve_variants();
  init_conversion();
  init_delta_calc();
  init_models();
  init_each_axis();
  init_measure();
  init_single_value();
  init_add_dom_event();
  init_resolve_motion_value();
  init_HTMLProjectionNode();
  init_state3();
  init_build_styles();
  init_scrape_motion_values();
  init_build_attrs();
  init_is_svg_tag();
  init_scrape_motion_values2();
  init_frame();
});

// node_modules/framer-motion/dist/es/context/MotionConfigContext.mjs
var import_react5, MotionConfigContext;
var init_MotionConfigContext = __esm(() => {
  import_react5 = __toESM(require_react(), 1);
  "use client";
  MotionConfigContext = import_react5.createContext({
    transformPagePoint: (p) => p,
    isStatic: false,
    reducedMotion: "never"
  });
});

// node_modules/framer-motion/dist/es/utils/use-composed-ref.mjs
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== undefined) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0;i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return React.useCallback(composeRefs(...refs), refs);
}
var React;
var init_use_composed_ref = __esm(() => {
  React = __toESM(require_react(), 1);
});

// node_modules/framer-motion/dist/es/components/AnimatePresence/PopChild.mjs
function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
  const id2 = import_react6.useId();
  const ref = import_react6.useRef(null);
  const size = import_react6.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });
  const { nonce } = import_react6.useContext(MotionConfigContext);
  const childRef = children.props?.ref ?? children?.ref;
  const composedRef = useComposedRefs(ref, childRef);
  import_react6.useInsertionEffect(() => {
    const { width, height, top, left, right, bottom } = size.current;
    if (isPresent || pop === false || !ref.current || !width || !height)
      return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    const y = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
    ref.current.dataset.motionPopId = id2;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id2}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            ${y}px !important;
          }
        `);
    }
    return () => {
      ref.current?.removeAttribute("data-motion-pop-id");
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return import_jsx_runtime.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, pop, children: pop === false ? children : React2.cloneElement(children, { ref: composedRef }) });
}
var import_jsx_runtime, React2, import_react6, PopChildMeasure;
var init_PopChild = __esm(() => {
  import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
  init_es2();
  React2 = __toESM(require_react(), 1);
  import_react6 = __toESM(require_react(), 1);
  init_MotionConfigContext();
  init_use_composed_ref();
  "use client";
  PopChildMeasure = class PopChildMeasure extends React2.Component {
    getSnapshotBeforeUpdate(prevProps) {
      const element = this.props.childRef.current;
      if (isHTMLElement(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
        const parent = element.offsetParent;
        const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
        const parentHeight = isHTMLElement(parent) ? parent.offsetHeight || 0 : 0;
        const computedStyle = getComputedStyle(element);
        const size = this.props.sizeRef.current;
        size.height = parseFloat(computedStyle.height);
        size.width = parseFloat(computedStyle.width);
        size.top = element.offsetTop;
        size.left = element.offsetLeft;
        size.right = parentWidth - size.width - size.left;
        size.bottom = parentHeight - size.height - size.top;
      }
      return null;
    }
    componentDidUpdate() {}
    render() {
      return this.props.children;
    }
  };
});

// node_modules/framer-motion/dist/es/components/AnimatePresence/PresenceChild.mjs
function newChildrenMap() {
  return new Map;
}
var import_jsx_runtime2, React3, import_react7, PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id2 = import_react7.useId();
  let isReusedContext = true;
  let context = import_react7.useMemo(() => {
    isReusedContext = false;
    return {
      id: id2,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete)
            return;
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  import_react7.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  React3.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  children = import_jsx_runtime2.jsx(PopChild, { pop: mode === "popLayout", isPresent, anchorX, anchorY, root, children });
  return import_jsx_runtime2.jsx(PresenceContext.Provider, { value: context, children });
};
var init_PresenceChild = __esm(() => {
  import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
  React3 = __toESM(require_react(), 1);
  import_react7 = __toESM(require_react(), 1);
  init_PresenceContext();
  init_use_constant();
  init_PopChild();
  "use client";
});

// node_modules/framer-motion/dist/es/components/AnimatePresence/use-presence.mjs
function usePresence(subscribe = true) {
  const context = import_react8.useContext(PresenceContext);
  if (context === null)
    return [true, null];
  const { isPresent, onExitComplete, register } = context;
  const id2 = import_react8.useId();
  import_react8.useEffect(() => {
    if (subscribe) {
      return register(id2);
    }
  }, [subscribe]);
  const safeToRemove = import_react8.useCallback(() => subscribe && onExitComplete && onExitComplete(id2), [id2, onExitComplete, subscribe]);
  return !isPresent && onExitComplete ? [false, safeToRemove] : [true];
}
var import_react8;
var init_use_presence = __esm(() => {
  import_react8 = __toESM(require_react(), 1);
  init_PresenceContext();
  "use client";
});

// node_modules/framer-motion/dist/es/components/AnimatePresence/utils.mjs
function onlyElements(children) {
  const filtered = [];
  import_react9.Children.forEach(children, (child) => {
    if (import_react9.isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
var import_react9, getChildKey = (child) => child.key || "";
var init_utils3 = __esm(() => {
  import_react9 = __toESM(require_react(), 1);
});

// node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs
var import_jsx_runtime3, import_react10, AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = import_react10.useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = import_react10.useRef(true);
  const pendingPresentChildren = import_react10.useRef(presentChildren);
  const exitComplete = useConstant(() => new Map);
  const exitingComponents = import_react10.useRef(new Set);
  const [diffedChildren, setDiffedChildren] = import_react10.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = import_react10.useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0;i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
        exitingComponents.current.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0;i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  if (mode === "wait" && renderedChildren.length > 1) {
    console.warn(`You're attempting to animate multiple children within AnimatePresence, but its mode is set to "wait". This will lead to odd visual behaviour.`);
  }
  const { forceRender } = import_react10.useContext(LayoutGroupContext);
  return import_jsx_runtime3.jsx(import_jsx_runtime3.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitingComponents.current.has(key)) {
        return;
      }
      if (exitComplete.has(key)) {
        exitingComponents.current.add(key);
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender?.();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && safeToRemove?.();
        onExitComplete && onExitComplete();
      }
    };
    return import_jsx_runtime3.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? undefined : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? undefined : onExit, anchorX, anchorY, children: child }, key);
  }) });
};
var init_AnimatePresence = __esm(() => {
  import_jsx_runtime3 = __toESM(require_jsx_runtime(), 1);
  import_react10 = __toESM(require_react(), 1);
  init_LayoutGroupContext();
  init_use_constant();
  init_use_isomorphic_effect();
  init_PresenceChild();
  init_use_presence();
  init_utils3();
  "use client";
});

// node_modules/framer-motion/dist/es/context/LazyContext.mjs
var import_react11, LazyContext;
var init_LazyContext = __esm(() => {
  import_react11 = __toESM(require_react(), 1);
  "use client";
  LazyContext = import_react11.createContext({ strict: false });
});

// node_modules/framer-motion/dist/es/motion/features/definitions.mjs
function initFeatureDefinitions() {
  if (isInitialized)
    return;
  const initialFeatureDefinitions = {};
  for (const key in featureProps) {
    initialFeatureDefinitions[key] = {
      isEnabled: (props) => featureProps[key].some((name) => !!props[name])
    };
  }
  setFeatureDefinitions(initialFeatureDefinitions);
  isInitialized = true;
}
function getInitializedFeatureDefinitions() {
  initFeatureDefinitions();
  return getFeatureDefinitions();
}
var featureProps, isInitialized = false;
var init_definitions = __esm(() => {
  init_es2();
  featureProps = {
    animation: [
      "animate",
      "variants",
      "whileHover",
      "whileTap",
      "exit",
      "whileInView",
      "whileFocus",
      "whileDrag"
    ],
    exit: ["exit"],
    drag: ["drag", "dragControls"],
    focus: ["whileFocus"],
    hover: ["whileHover", "onHoverStart", "onHoverEnd"],
    tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
    pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
    inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
    layout: ["layout", "layoutId"]
  };
});

// node_modules/framer-motion/dist/es/motion/features/load-features.mjs
function loadFeatures(features) {
  const featureDefinitions2 = getInitializedFeatureDefinitions();
  for (const key in features) {
    featureDefinitions2[key] = {
      ...featureDefinitions2[key],
      ...features[key]
    };
  }
  setFeatureDefinitions(featureDefinitions2);
}
var init_load_features = __esm(() => {
  init_es2();
  init_definitions();
});

// node_modules/framer-motion/dist/es/motion/utils/valid-prop.mjs
function isValidMotionProp(key) {
  return key.startsWith("while") || key.startsWith("drag") && key !== "draggable" || key.startsWith("layout") || key.startsWith("onTap") || key.startsWith("onPan") || key.startsWith("onLayout") || validMotionProps.has(key);
}
var validMotionProps;
var init_valid_prop = __esm(() => {
  validMotionProps = new Set([
    "animate",
    "exit",
    "variants",
    "initial",
    "style",
    "values",
    "variants",
    "transition",
    "transformTemplate",
    "custom",
    "inherit",
    "onBeforeLayoutMeasure",
    "onAnimationStart",
    "onAnimationComplete",
    "onUpdate",
    "onDragStart",
    "onDrag",
    "onDragEnd",
    "onMeasureDragConstraints",
    "onDirectionLock",
    "onDragTransitionEnd",
    "_dragX",
    "_dragY",
    "onHoverStart",
    "onHoverEnd",
    "onViewportEnter",
    "onViewportLeave",
    "globalTapTarget",
    "propagate",
    "ignoreStrict",
    "viewport"
  ]);
});

// node_modules/framer-motion/dist/es/render/dom/utils/filter-props.mjs
function loadExternalIsValidProp(isValidProp) {
  if (typeof isValidProp !== "function")
    return;
  shouldForward = (key) => key.startsWith("on") ? !isValidMotionProp(key) : isValidProp(key);
}
function filterProps(props, isDom, forwardMotionProps) {
  const filteredProps = {};
  for (const key in props) {
    if (key === "values" && typeof props.values === "object")
      continue;
    if (isMotionValue(props[key]))
      continue;
    if (shouldForward(key) || forwardMotionProps === true && isValidMotionProp(key) || !isDom && !isValidMotionProp(key) || props["draggable"] && key.startsWith("onDrag")) {
      filteredProps[key] = props[key];
    }
  }
  return filteredProps;
}
var shouldForward = (key) => !isValidMotionProp(key);
var init_filter_props = __esm(() => {
  init_es2();
  init_valid_prop();
  try {
    const emotionPkg = "@emotion/is-prop-" + "valid";
    loadExternalIsValidProp(__require(emotionPkg).default);
  } catch {}
});

// node_modules/framer-motion/dist/es/context/MotionContext/index.mjs
var import_react12, MotionContext;
var init_MotionContext = __esm(() => {
  import_react12 = __toESM(require_react(), 1);
  "use client";
  MotionContext = /* @__PURE__ */ import_react12.createContext({});
});

// node_modules/framer-motion/dist/es/context/MotionContext/utils.mjs
function getCurrentTreeVariants(props, context) {
  if (isControllingVariants(props)) {
    const { initial, animate } = props;
    return {
      initial: initial === false || isVariantLabel(initial) ? initial : undefined,
      animate: isVariantLabel(animate) ? animate : undefined
    };
  }
  return props.inherit !== false ? context : {};
}
var init_utils4 = __esm(() => {
  init_es2();
});

// node_modules/framer-motion/dist/es/context/MotionContext/create.mjs
function useCreateMotionContext(props) {
  const { initial, animate } = getCurrentTreeVariants(props, import_react13.useContext(MotionContext));
  return import_react13.useMemo(() => ({ initial, animate }), [variantLabelsAsDependency(initial), variantLabelsAsDependency(animate)]);
}
function variantLabelsAsDependency(prop) {
  return Array.isArray(prop) ? prop.join(" ") : prop;
}
var import_react13;
var init_create = __esm(() => {
  import_react13 = __toESM(require_react(), 1);
  init_MotionContext();
  init_utils4();
  "use client";
});

// node_modules/framer-motion/dist/es/render/html/utils/create-render-state.mjs
var createHtmlRenderState = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
var init_create_render_state = () => {};

// node_modules/framer-motion/dist/es/render/html/use-props.mjs
function copyRawValuesOnly(target, source, props) {
  for (const key in source) {
    if (!isMotionValue(source[key]) && !isForcedMotionValue(key, props)) {
      target[key] = source[key];
    }
  }
}
function useInitialMotionValues({ transformTemplate }, visualState) {
  return import_react14.useMemo(() => {
    const state = createHtmlRenderState();
    buildHTMLStyles(state, visualState, transformTemplate);
    return Object.assign({}, state.vars, state.style);
  }, [visualState]);
}
function useStyle(props, visualState) {
  const styleProp = props.style || {};
  const style = {};
  copyRawValuesOnly(style, styleProp, props);
  Object.assign(style, useInitialMotionValues(props, visualState));
  return style;
}
function useHTMLProps(props, visualState) {
  const htmlProps = {};
  const style = useStyle(props, visualState);
  if (props.drag && props.dragListener !== false) {
    htmlProps.draggable = false;
    style.userSelect = style.WebkitUserSelect = style.WebkitTouchCallout = "none";
    style.touchAction = props.drag === true ? "none" : `pan-${props.drag === "x" ? "y" : "x"}`;
  }
  if (props.tabIndex === undefined && (props.onTap || props.onTapStart || props.whileTap)) {
    htmlProps.tabIndex = 0;
  }
  htmlProps.style = style;
  return htmlProps;
}
var import_react14;
var init_use_props = __esm(() => {
  init_es2();
  import_react14 = __toESM(require_react(), 1);
  init_create_render_state();
  "use client";
});

// node_modules/framer-motion/dist/es/render/svg/utils/create-render-state.mjs
var createSvgRenderState = () => ({
  ...createHtmlRenderState(),
  attrs: {}
});
var init_create_render_state2 = __esm(() => {
  init_create_render_state();
});

// node_modules/framer-motion/dist/es/render/svg/use-props.mjs
function useSVGProps(props, visualState, _isStatic, Component2) {
  const visualProps = import_react15.useMemo(() => {
    const state = createSvgRenderState();
    buildSVGAttrs(state, visualState, isSVGTag(Component2), props.transformTemplate, props.style);
    return {
      ...state.attrs,
      style: { ...state.style }
    };
  }, [visualState]);
  if (props.style) {
    const rawStyles = {};
    copyRawValuesOnly(rawStyles, props.style, props);
    visualProps.style = { ...rawStyles, ...visualProps.style };
  }
  return visualProps;
}
var import_react15;
var init_use_props2 = __esm(() => {
  init_es2();
  import_react15 = __toESM(require_react(), 1);
  init_use_props();
  init_create_render_state2();
  "use client";
});

// node_modules/framer-motion/dist/es/render/svg/lowercase-elements.mjs
var lowercaseSVGElements;
var init_lowercase_elements = __esm(() => {
  lowercaseSVGElements = [
    "animate",
    "circle",
    "defs",
    "desc",
    "ellipse",
    "g",
    "image",
    "line",
    "filter",
    "marker",
    "mask",
    "metadata",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "rect",
    "stop",
    "switch",
    "symbol",
    "svg",
    "text",
    "tspan",
    "use",
    "view"
  ];
});

// node_modules/framer-motion/dist/es/render/dom/utils/is-svg-component.mjs
function isSVGComponent(Component2) {
  if (typeof Component2 !== "string" || Component2.includes("-")) {
    return false;
  } else if (lowercaseSVGElements.indexOf(Component2) > -1 || /[A-Z]/u.test(Component2)) {
    return true;
  }
  return false;
}
var init_is_svg_component = __esm(() => {
  init_lowercase_elements();
});

// node_modules/framer-motion/dist/es/render/dom/use-render.mjs
function useRender(Component2, props, ref, { latestValues }, isStatic, forwardMotionProps = false, isSVG) {
  const useVisualProps = isSVG ?? isSVGComponent(Component2) ? useSVGProps : useHTMLProps;
  const visualProps = useVisualProps(props, latestValues, isStatic, Component2);
  const filteredProps = filterProps(props, typeof Component2 === "string", forwardMotionProps);
  const elementProps = Component2 !== import_react16.Fragment ? { ...filteredProps, ...visualProps, ref } : {};
  const { children } = props;
  const renderedChildren = import_react16.useMemo(() => isMotionValue(children) ? children.get() : children, [children]);
  return import_react16.createElement(Component2, {
    ...elementProps,
    children: renderedChildren
  });
}
var import_react16;
var init_use_render = __esm(() => {
  init_es2();
  import_react16 = __toESM(require_react(), 1);
  init_use_props();
  init_use_props2();
  init_filter_props();
  init_is_svg_component();
  "use client";
});

// node_modules/framer-motion/dist/es/motion/utils/use-visual-state.mjs
function makeState({ scrapeMotionValuesFromProps: scrapeMotionValuesFromProps3, createRenderState }, props, context, presenceContext) {
  const state = {
    latestValues: makeLatestValues(props, context, presenceContext, scrapeMotionValuesFromProps3),
    renderState: createRenderState()
  };
  return state;
}
function makeLatestValues(props, context, presenceContext, scrapeMotionValues) {
  const values = {};
  const motionValues = scrapeMotionValues(props, {});
  for (const key in motionValues) {
    values[key] = resolveMotionValue(motionValues[key]);
  }
  let { initial, animate } = props;
  const isControllingVariants$1 = isControllingVariants(props);
  const isVariantNode$1 = isVariantNode(props);
  if (context && isVariantNode$1 && !isControllingVariants$1 && props.inherit !== false) {
    if (initial === undefined)
      initial = context.initial;
    if (animate === undefined)
      animate = context.animate;
  }
  let isInitialAnimationBlocked = presenceContext ? presenceContext.initial === false : false;
  isInitialAnimationBlocked = isInitialAnimationBlocked || initial === false;
  const variantToSet = isInitialAnimationBlocked ? animate : initial;
  if (variantToSet && typeof variantToSet !== "boolean" && !isAnimationControls(variantToSet)) {
    const list = Array.isArray(variantToSet) ? variantToSet : [variantToSet];
    for (let i = 0;i < list.length; i++) {
      const resolved = resolveVariantFromProps(props, list[i]);
      if (resolved) {
        const { transitionEnd, transition, ...target } = resolved;
        for (const key in target) {
          let valueTarget = target[key];
          if (Array.isArray(valueTarget)) {
            const index = isInitialAnimationBlocked ? valueTarget.length - 1 : 0;
            valueTarget = valueTarget[index];
          }
          if (valueTarget !== null) {
            values[key] = valueTarget;
          }
        }
        for (const key in transitionEnd) {
          values[key] = transitionEnd[key];
        }
      }
    }
  }
  return values;
}
var import_react17, makeUseVisualState = (config) => (props, isStatic) => {
  const context = import_react17.useContext(MotionContext);
  const presenceContext = import_react17.useContext(PresenceContext);
  const make = () => makeState(config, props, context, presenceContext);
  return isStatic ? make() : useConstant(make);
};
var init_use_visual_state = __esm(() => {
  init_es2();
  import_react17 = __toESM(require_react(), 1);
  init_MotionContext();
  init_PresenceContext();
  init_use_constant();
  "use client";
});

// node_modules/framer-motion/dist/es/render/html/use-html-visual-state.mjs
var useHTMLVisualState;
var init_use_html_visual_state = __esm(() => {
  init_es2();
  init_use_visual_state();
  init_create_render_state();
  "use client";
  useHTMLVisualState = /* @__PURE__ */ makeUseVisualState({
    scrapeMotionValuesFromProps,
    createRenderState: createHtmlRenderState
  });
});

// node_modules/framer-motion/dist/es/render/svg/use-svg-visual-state.mjs
var useSVGVisualState;
var init_use_svg_visual_state = __esm(() => {
  init_es2();
  init_use_visual_state();
  init_create_render_state2();
  "use client";
  useSVGVisualState = /* @__PURE__ */ makeUseVisualState({
    scrapeMotionValuesFromProps: scrapeMotionValuesFromProps2,
    createRenderState: createSvgRenderState
  });
});

// node_modules/framer-motion/dist/es/motion/utils/symbol.mjs
var motionComponentSymbol;
var init_symbol = __esm(() => {
  motionComponentSymbol = Symbol.for("motionComponentSymbol");
});

// node_modules/framer-motion/dist/es/motion/utils/use-motion-ref.mjs
function useMotionRef(visualState, visualElement, externalRef) {
  const externalRefContainer = import_react18.useRef(externalRef);
  import_react18.useInsertionEffect(() => {
    externalRefContainer.current = externalRef;
  });
  const refCleanup = import_react18.useRef(null);
  return import_react18.useCallback((instance) => {
    if (instance) {
      visualState.onMount?.(instance);
    }
    const ref = externalRefContainer.current;
    if (typeof ref === "function") {
      if (instance) {
        const cleanup = ref(instance);
        if (typeof cleanup === "function") {
          refCleanup.current = cleanup;
        }
      } else if (refCleanup.current) {
        refCleanup.current();
        refCleanup.current = null;
      } else {
        ref(instance);
      }
    } else if (ref) {
      ref.current = instance;
    }
    if (visualElement) {
      instance ? visualElement.mount(instance) : visualElement.unmount();
    }
  }, [visualElement]);
}
var import_react18;
var init_use_motion_ref = __esm(() => {
  import_react18 = __toESM(require_react(), 1);
  "use client";
});

// node_modules/framer-motion/dist/es/context/SwitchLayoutGroupContext.mjs
var import_react19, SwitchLayoutGroupContext;
var init_SwitchLayoutGroupContext = __esm(() => {
  import_react19 = __toESM(require_react(), 1);
  "use client";
  SwitchLayoutGroupContext = import_react19.createContext({});
});

// node_modules/framer-motion/dist/es/utils/is-ref-object.mjs
function isRefObject(ref) {
  return ref && typeof ref === "object" && Object.prototype.hasOwnProperty.call(ref, "current");
}
var init_is_ref_object = () => {};

// node_modules/framer-motion/dist/es/motion/utils/use-visual-element.mjs
function useVisualElement(Component2, visualState, props, createVisualElement, ProjectionNodeConstructor, isSVG) {
  const { visualElement: parent } = import_react20.useContext(MotionContext);
  const lazyContext = import_react20.useContext(LazyContext);
  const presenceContext = import_react20.useContext(PresenceContext);
  const motionConfig = import_react20.useContext(MotionConfigContext);
  const reducedMotionConfig = motionConfig.reducedMotion;
  const skipAnimations = motionConfig.skipAnimations;
  const visualElementRef = import_react20.useRef(null);
  const hasMountedOnce = import_react20.useRef(false);
  createVisualElement = createVisualElement || lazyContext.renderer;
  if (!visualElementRef.current && createVisualElement) {
    visualElementRef.current = createVisualElement(Component2, {
      visualState,
      parent,
      props,
      presenceContext,
      blockInitialAnimation: presenceContext ? presenceContext.initial === false : false,
      reducedMotionConfig,
      skipAnimations,
      isSVG
    });
    if (hasMountedOnce.current && visualElementRef.current) {
      visualElementRef.current.manuallyAnimateOnMount = true;
    }
  }
  const visualElement = visualElementRef.current;
  const initialLayoutGroupConfig = import_react20.useContext(SwitchLayoutGroupContext);
  if (visualElement && !visualElement.projection && ProjectionNodeConstructor && (visualElement.type === "html" || visualElement.type === "svg")) {
    createProjectionNode2(visualElementRef.current, props, ProjectionNodeConstructor, initialLayoutGroupConfig);
  }
  const isMounted = import_react20.useRef(false);
  import_react20.useInsertionEffect(() => {
    if (visualElement && isMounted.current) {
      visualElement.update(props, presenceContext);
    }
  });
  const optimisedAppearId = props[optimizedAppearDataAttribute];
  const wantsHandoff = import_react20.useRef(Boolean(optimisedAppearId) && typeof window !== "undefined" && !window.MotionHandoffIsComplete?.(optimisedAppearId) && window.MotionHasOptimisedAnimation?.(optimisedAppearId));
  useIsomorphicLayoutEffect(() => {
    hasMountedOnce.current = true;
    if (!visualElement)
      return;
    isMounted.current = true;
    window.MotionIsMounted = true;
    visualElement.updateFeatures();
    visualElement.scheduleRenderMicrotask();
    if (wantsHandoff.current && visualElement.animationState) {
      visualElement.animationState.animateChanges();
    }
  });
  import_react20.useEffect(() => {
    if (!visualElement)
      return;
    if (!wantsHandoff.current && visualElement.animationState) {
      visualElement.animationState.animateChanges();
    }
    if (wantsHandoff.current) {
      queueMicrotask(() => {
        window.MotionHandoffMarkAsComplete?.(optimisedAppearId);
      });
      wantsHandoff.current = false;
    }
    visualElement.enteringChildren = undefined;
  });
  return visualElement;
}
function createProjectionNode2(visualElement, props, ProjectionNodeConstructor, initialPromotionConfig) {
  const { layoutId, layout, drag, dragConstraints, layoutScroll, layoutRoot, layoutAnchor, layoutCrossfade } = props;
  visualElement.projection = new ProjectionNodeConstructor(visualElement.latestValues, props["data-framer-portal-id"] ? undefined : getClosestProjectingNode(visualElement.parent));
  visualElement.projection.setOptions({
    layoutId,
    layout,
    alwaysMeasureLayout: Boolean(drag) || dragConstraints && isRefObject(dragConstraints),
    visualElement,
    animationType: typeof layout === "string" ? layout : "both",
    initialPromotionConfig,
    crossfade: layoutCrossfade,
    layoutScroll,
    layoutRoot,
    layoutAnchor
  });
}
function getClosestProjectingNode(visualElement) {
  if (!visualElement)
    return;
  return visualElement.options.allowProjection !== false ? visualElement.projection : getClosestProjectingNode(visualElement.parent);
}
var import_react20;
var init_use_visual_element = __esm(() => {
  init_es2();
  import_react20 = __toESM(require_react(), 1);
  init_LazyContext();
  init_MotionConfigContext();
  init_MotionContext();
  init_PresenceContext();
  init_SwitchLayoutGroupContext();
  init_is_ref_object();
  init_use_isomorphic_effect();
  "use client";
});

// node_modules/framer-motion/dist/es/motion/index.mjs
function createMotionComponent(Component2, { forwardMotionProps = false, type } = {}, preloadedFeatures, createVisualElement) {
  preloadedFeatures && loadFeatures(preloadedFeatures);
  const isSVG = type ? type === "svg" : isSVGComponent(Component2);
  const useVisualState = isSVG ? useSVGVisualState : useHTMLVisualState;
  function MotionDOMComponent(props, externalRef) {
    let MeasureLayout;
    const configAndProps = {
      ...import_react21.useContext(MotionConfigContext),
      ...props,
      layoutId: useLayoutId(props)
    };
    const { isStatic } = configAndProps;
    const context = useCreateMotionContext(props);
    const visualState = useVisualState(props, isStatic);
    if (!isStatic && typeof window !== "undefined") {
      useStrictMode(configAndProps, preloadedFeatures);
      const layoutProjection = getProjectionFunctionality(configAndProps);
      MeasureLayout = layoutProjection.MeasureLayout;
      context.visualElement = useVisualElement(Component2, visualState, configAndProps, createVisualElement, layoutProjection.ProjectionNode, isSVG);
    }
    return import_jsx_runtime4.jsxs(MotionContext.Provider, { value: context, children: [MeasureLayout && context.visualElement ? import_jsx_runtime4.jsx(MeasureLayout, { visualElement: context.visualElement, ...configAndProps }) : null, useRender(Component2, props, useMotionRef(visualState, context.visualElement, externalRef), visualState, isStatic, forwardMotionProps, isSVG)] });
  }
  MotionDOMComponent.displayName = `motion.${typeof Component2 === "string" ? Component2 : `create(${Component2.displayName ?? Component2.name ?? ""})`}`;
  const ForwardRefMotionComponent = import_react21.forwardRef(MotionDOMComponent);
  ForwardRefMotionComponent[motionComponentSymbol] = Component2;
  return ForwardRefMotionComponent;
}
function useLayoutId({ layoutId }) {
  const layoutGroupId = import_react21.useContext(LayoutGroupContext).id;
  return layoutGroupId && layoutId !== undefined ? layoutGroupId + "-" + layoutId : layoutId;
}
function useStrictMode(configAndProps, preloadedFeatures) {
  const isStrict = import_react21.useContext(LazyContext).strict;
  if (preloadedFeatures && isStrict) {
    const strictMessage = "You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.";
    configAndProps.ignoreStrict ? warning(false, strictMessage, "lazy-strict-mode") : invariant(false, strictMessage, "lazy-strict-mode");
  }
}
function getProjectionFunctionality(props) {
  const featureDefinitions2 = getInitializedFeatureDefinitions();
  const { drag, layout } = featureDefinitions2;
  if (!drag && !layout)
    return {};
  const combined = { ...drag, ...layout };
  return {
    MeasureLayout: drag?.isEnabled(props) || layout?.isEnabled(props) ? combined.MeasureLayout : undefined,
    ProjectionNode: combined.ProjectionNode
  };
}
var import_jsx_runtime4, import_react21;
var init_motion = __esm(() => {
  import_jsx_runtime4 = __toESM(require_jsx_runtime(), 1);
  init_es();
  import_react21 = __toESM(require_react(), 1);
  init_LayoutGroupContext();
  init_LazyContext();
  init_MotionConfigContext();
  init_MotionContext();
  init_create();
  init_use_render();
  init_is_svg_component();
  init_use_html_visual_state();
  init_use_svg_visual_state();
  init_definitions();
  init_load_features();
  init_symbol();
  init_use_motion_ref();
  init_use_visual_element();
  "use client";
});

// node_modules/framer-motion/dist/es/render/components/create-proxy.mjs
function createMotionProxy(preloadedFeatures, createVisualElement) {
  if (typeof Proxy === "undefined") {
    return createMotionComponent;
  }
  const componentCache = new Map;
  const factory = (Component2, options) => {
    return createMotionComponent(Component2, options, preloadedFeatures, createVisualElement);
  };
  const deprecatedFactoryFunction = (Component2, options) => {
    if (true) {
      warnOnce(false, "motion() is deprecated. Use motion.create() instead.");
    }
    return factory(Component2, options);
  };
  return new Proxy(deprecatedFactoryFunction, {
    get: (_target, key) => {
      if (key === "create")
        return factory;
      if (!componentCache.has(key)) {
        componentCache.set(key, createMotionComponent(key, undefined, preloadedFeatures, createVisualElement));
      }
      return componentCache.get(key);
    }
  });
}
var init_create_proxy = __esm(() => {
  init_es();
  init_motion();
});

// node_modules/framer-motion/dist/es/render/dom/create-visual-element.mjs
var import_react22, createDomVisualElement = (Component2, options) => {
  const isSVG = options.isSVG ?? isSVGComponent(Component2);
  return isSVG ? new SVGVisualElement(options) : new HTMLVisualElement(options, {
    allowProjection: Component2 !== import_react22.Fragment
  });
};
var init_create_visual_element = __esm(() => {
  init_es2();
  import_react22 = __toESM(require_react(), 1);
  init_is_svg_component();
});

// node_modules/framer-motion/dist/es/motion/features/animation/index.mjs
var AnimationFeature;
var init_animation = __esm(() => {
  init_es2();
  AnimationFeature = class AnimationFeature extends Feature {
    constructor(node) {
      super(node);
      node.animationState || (node.animationState = createAnimationState(node));
    }
    updateAnimationControlsSubscription() {
      const { animate } = this.node.getProps();
      if (isAnimationControls(animate)) {
        this.unmountControls = animate.subscribe(this.node);
      }
    }
    mount() {
      this.updateAnimationControlsSubscription();
    }
    update() {
      const { animate } = this.node.getProps();
      const { animate: prevAnimate } = this.node.prevProps || {};
      if (animate !== prevAnimate) {
        this.updateAnimationControlsSubscription();
      }
    }
    unmount() {
      this.node.animationState.reset();
      this.unmountControls?.();
    }
  };
});

// node_modules/framer-motion/dist/es/motion/features/animation/exit.mjs
var id2 = 0, ExitAnimationFeature;
var init_exit = __esm(() => {
  init_es2();
  ExitAnimationFeature = class ExitAnimationFeature extends Feature {
    constructor() {
      super(...arguments);
      this.id = id2++;
      this.isExitComplete = false;
    }
    update() {
      if (!this.node.presenceContext)
        return;
      const { isPresent, onExitComplete } = this.node.presenceContext;
      const { isPresent: prevIsPresent } = this.node.prevPresenceContext || {};
      if (!this.node.animationState || isPresent === prevIsPresent) {
        return;
      }
      if (isPresent && prevIsPresent === false) {
        if (this.isExitComplete) {
          const { initial, custom } = this.node.getProps();
          if (typeof initial === "string") {
            const resolved = resolveVariant(this.node, initial, custom);
            if (resolved) {
              const { transition, transitionEnd, ...target } = resolved;
              for (const key in target) {
                this.node.getValue(key)?.jump(target[key]);
              }
            }
          }
          this.node.animationState.reset();
          this.node.animationState.animateChanges();
        } else {
          this.node.animationState.setActive("exit", false);
        }
        this.isExitComplete = false;
        return;
      }
      const exitAnimation = this.node.animationState.setActive("exit", !isPresent);
      if (onExitComplete && !isPresent) {
        exitAnimation.then(() => {
          this.isExitComplete = true;
          onExitComplete(this.id);
        });
      }
    }
    mount() {
      const { register, onExitComplete } = this.node.presenceContext || {};
      if (onExitComplete) {
        onExitComplete(this.id);
      }
      if (register) {
        this.unmount = register(this.id);
      }
    }
    unmount() {}
  };
});

// node_modules/framer-motion/dist/es/motion/features/animations.mjs
var animations;
var init_animations = __esm(() => {
  init_animation();
  init_exit();
  animations = {
    animation: {
      Feature: AnimationFeature
    },
    exit: {
      Feature: ExitAnimationFeature
    }
  };
});

// node_modules/framer-motion/dist/es/events/event-info.mjs
function extractEventInfo(event) {
  return {
    point: {
      x: event.pageX,
      y: event.pageY
    }
  };
}
var addPointerInfo = (handler) => (event) => isPrimaryPointer(event) && handler(event, extractEventInfo(event));
var init_event_info = __esm(() => {
  init_es2();
});

// node_modules/framer-motion/dist/es/events/add-pointer-event.mjs
function addPointerEvent(target, eventName, handler, options) {
  return addDomEvent(target, eventName, addPointerInfo(handler), options);
}
var init_add_pointer_event = __esm(() => {
  init_es2();
  init_event_info();
});

// node_modules/framer-motion/dist/es/utils/get-context-window.mjs
var getContextWindow = ({ current }) => {
  return current ? current.ownerDocument.defaultView : null;
};
var init_get_context_window = () => {};

// node_modules/framer-motion/dist/es/utils/distance.mjs
function distance2D(a, b) {
  const xDelta = distance(a.x, b.x);
  const yDelta = distance(a.y, b.y);
  return Math.sqrt(xDelta ** 2 + yDelta ** 2);
}
var distance = (a, b) => Math.abs(a - b);
var init_distance = () => {};

// node_modules/framer-motion/dist/es/gestures/pan/PanSession.mjs
class PanSession {
  constructor(event, handlers, { transformPagePoint, contextWindow = window, dragSnapToOrigin = false, distanceThreshold = 3, element } = {}) {
    this.startEvent = null;
    this.lastMoveEvent = null;
    this.lastMoveEventInfo = null;
    this.lastRawMoveEventInfo = null;
    this.handlers = {};
    this.contextWindow = window;
    this.scrollPositions = new Map;
    this.removeScrollListeners = null;
    this.onElementScroll = (event2) => {
      this.handleScroll(event2.target);
    };
    this.onWindowScroll = () => {
      this.handleScroll(window);
    };
    this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      if (this.lastRawMoveEventInfo) {
        this.lastMoveEventInfo = transformPoint(this.lastRawMoveEventInfo, this.transformPagePoint);
      }
      const info2 = getPanInfo(this.lastMoveEventInfo, this.history);
      const isPanStarted = this.startEvent !== null;
      const isDistancePastThreshold = distance2D(info2.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
      if (!isPanStarted && !isDistancePastThreshold)
        return;
      const { point: point2 } = info2;
      const { timestamp: timestamp2 } = frameData;
      this.history.push({ ...point2, timestamp: timestamp2 });
      const { onStart, onMove } = this.handlers;
      if (!isPanStarted) {
        onStart && onStart(this.lastMoveEvent, info2);
        this.startEvent = this.lastMoveEvent;
      }
      onMove && onMove(this.lastMoveEvent, info2);
    };
    this.handlePointerMove = (event2, info2) => {
      this.lastMoveEvent = event2;
      this.lastRawMoveEventInfo = info2;
      this.lastMoveEventInfo = transformPoint(info2, this.transformPagePoint);
      frame.update(this.updatePoint, true);
    };
    this.handlePointerUp = (event2, info2) => {
      this.end();
      const { onEnd, onSessionEnd, resumeAnimation } = this.handlers;
      if (this.dragSnapToOrigin || !this.startEvent) {
        resumeAnimation && resumeAnimation();
      }
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const panInfo = getPanInfo(event2.type === "pointercancel" ? this.lastMoveEventInfo : transformPoint(info2, this.transformPagePoint), this.history);
      if (this.startEvent && onEnd) {
        onEnd(event2, panInfo);
      }
      onSessionEnd && onSessionEnd(event2, panInfo);
    };
    if (!isPrimaryPointer(event))
      return;
    this.dragSnapToOrigin = dragSnapToOrigin;
    this.handlers = handlers;
    this.transformPagePoint = transformPagePoint;
    this.distanceThreshold = distanceThreshold;
    this.contextWindow = contextWindow || window;
    const info = extractEventInfo(event);
    const initialInfo = transformPoint(info, this.transformPagePoint);
    const { point } = initialInfo;
    const { timestamp } = frameData;
    this.history = [{ ...point, timestamp }];
    const { onSessionStart } = handlers;
    onSessionStart && onSessionStart(event, getPanInfo(initialInfo, this.history));
    this.removeListeners = pipe(addPointerEvent(this.contextWindow, "pointermove", this.handlePointerMove), addPointerEvent(this.contextWindow, "pointerup", this.handlePointerUp), addPointerEvent(this.contextWindow, "pointercancel", this.handlePointerUp));
    if (element) {
      this.startScrollTracking(element);
    }
  }
  startScrollTracking(element) {
    let current = element.parentElement;
    while (current) {
      const style = getComputedStyle(current);
      if (overflowStyles.has(style.overflowX) || overflowStyles.has(style.overflowY)) {
        this.scrollPositions.set(current, {
          x: current.scrollLeft,
          y: current.scrollTop
        });
      }
      current = current.parentElement;
    }
    this.scrollPositions.set(window, {
      x: window.scrollX,
      y: window.scrollY
    });
    window.addEventListener("scroll", this.onElementScroll, {
      capture: true
    });
    window.addEventListener("scroll", this.onWindowScroll);
    this.removeScrollListeners = () => {
      window.removeEventListener("scroll", this.onElementScroll, {
        capture: true
      });
      window.removeEventListener("scroll", this.onWindowScroll);
    };
  }
  handleScroll(target) {
    const initial = this.scrollPositions.get(target);
    if (!initial)
      return;
    const isWindow = target === window;
    const current = isWindow ? { x: window.scrollX, y: window.scrollY } : {
      x: target.scrollLeft,
      y: target.scrollTop
    };
    const delta = { x: current.x - initial.x, y: current.y - initial.y };
    if (delta.x === 0 && delta.y === 0)
      return;
    if (isWindow) {
      if (this.lastMoveEventInfo) {
        this.lastMoveEventInfo.point.x += delta.x;
        this.lastMoveEventInfo.point.y += delta.y;
      }
    } else {
      if (this.history.length > 0) {
        this.history[0].x -= delta.x;
        this.history[0].y -= delta.y;
      }
    }
    this.scrollPositions.set(target, current);
    frame.update(this.updatePoint, true);
  }
  updateHandlers(handlers) {
    this.handlers = handlers;
  }
  end() {
    this.removeListeners && this.removeListeners();
    this.removeScrollListeners && this.removeScrollListeners();
    this.scrollPositions.clear();
    cancelFrame(this.updatePoint);
  }
}
function transformPoint(info, transformPagePoint) {
  return transformPagePoint ? { point: transformPagePoint(info.point) } : info;
}
function subtractPoint(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}
function getPanInfo({ point }, history) {
  return {
    point,
    delta: subtractPoint(point, lastDevicePoint(history)),
    offset: subtractPoint(point, startDevicePoint(history)),
    velocity: getVelocity(history, 0.1)
  };
}
function startDevicePoint(history) {
  return history[0];
}
function lastDevicePoint(history) {
  return history[history.length - 1];
}
function getVelocity(history, timeDelta) {
  if (history.length < 2) {
    return { x: 0, y: 0 };
  }
  let i = history.length - 1;
  let timestampedPoint = null;
  const lastPoint = lastDevicePoint(history);
  while (i >= 0) {
    timestampedPoint = history[i];
    if (lastPoint.timestamp - timestampedPoint.timestamp > secondsToMilliseconds(timeDelta)) {
      break;
    }
    i--;
  }
  if (!timestampedPoint) {
    return { x: 0, y: 0 };
  }
  if (timestampedPoint === history[0] && history.length > 2 && lastPoint.timestamp - timestampedPoint.timestamp > secondsToMilliseconds(timeDelta) * 2) {
    timestampedPoint = history[1];
  }
  const time2 = millisecondsToSeconds(lastPoint.timestamp - timestampedPoint.timestamp);
  if (time2 === 0) {
    return { x: 0, y: 0 };
  }
  const currentVelocity = {
    x: (lastPoint.x - timestampedPoint.x) / time2,
    y: (lastPoint.y - timestampedPoint.y) / time2
  };
  if (currentVelocity.x === Infinity) {
    currentVelocity.x = 0;
  }
  if (currentVelocity.y === Infinity) {
    currentVelocity.y = 0;
  }
  return currentVelocity;
}
var overflowStyles;
var init_PanSession = __esm(() => {
  init_es2();
  init_es();
  init_add_pointer_event();
  init_event_info();
  init_distance();
  overflowStyles = /* @__PURE__ */ new Set(["auto", "scroll"]);
});

// node_modules/framer-motion/dist/es/gestures/drag/utils/constraints.mjs
function applyConstraints(point, { min, max }, elastic) {
  if (min !== undefined && point < min) {
    point = elastic ? mixNumber(min, point, elastic.min) : Math.max(point, min);
  } else if (max !== undefined && point > max) {
    point = elastic ? mixNumber(max, point, elastic.max) : Math.min(point, max);
  }
  return point;
}
function calcRelativeAxisConstraints(axis, min, max) {
  return {
    min: min !== undefined ? axis.min + min : undefined,
    max: max !== undefined ? axis.max + max - (axis.max - axis.min) : undefined
  };
}
function calcRelativeConstraints(layoutBox, { top, left, bottom, right }) {
  return {
    x: calcRelativeAxisConstraints(layoutBox.x, left, right),
    y: calcRelativeAxisConstraints(layoutBox.y, top, bottom)
  };
}
function calcViewportAxisConstraints(layoutAxis, constraintsAxis) {
  let min = constraintsAxis.min - layoutAxis.min;
  let max = constraintsAxis.max - layoutAxis.max;
  if (constraintsAxis.max - constraintsAxis.min < layoutAxis.max - layoutAxis.min) {
    [min, max] = [max, min];
  }
  return { min, max };
}
function calcViewportConstraints(layoutBox, constraintsBox) {
  return {
    x: calcViewportAxisConstraints(layoutBox.x, constraintsBox.x),
    y: calcViewportAxisConstraints(layoutBox.y, constraintsBox.y)
  };
}
function calcOrigin(source, target) {
  let origin = 0.5;
  const sourceLength = calcLength(source);
  const targetLength = calcLength(target);
  if (targetLength > sourceLength) {
    origin = progress(target.min, target.max - sourceLength, source.min);
  } else if (sourceLength > targetLength) {
    origin = progress(source.min, source.max - targetLength, target.min);
  }
  return clamp(0, 1, origin);
}
function rebaseAxisConstraints(layout, constraints) {
  const relativeConstraints = {};
  if (constraints.min !== undefined) {
    relativeConstraints.min = constraints.min - layout.min;
  }
  if (constraints.max !== undefined) {
    relativeConstraints.max = constraints.max - layout.min;
  }
  return relativeConstraints;
}
function resolveDragElastic(dragElastic = defaultElastic) {
  if (dragElastic === false) {
    dragElastic = 0;
  } else if (dragElastic === true) {
    dragElastic = defaultElastic;
  }
  return {
    x: resolveAxisElastic(dragElastic, "left", "right"),
    y: resolveAxisElastic(dragElastic, "top", "bottom")
  };
}
function resolveAxisElastic(dragElastic, minLabel, maxLabel) {
  return {
    min: resolvePointElastic(dragElastic, minLabel),
    max: resolvePointElastic(dragElastic, maxLabel)
  };
}
function resolvePointElastic(dragElastic, label) {
  return typeof dragElastic === "number" ? dragElastic : dragElastic[label] || 0;
}
var defaultElastic = 0.35;
var init_constraints = __esm(() => {
  init_es2();
  init_es();
});

// node_modules/framer-motion/dist/es/gestures/drag/VisualElementDragControls.mjs
class VisualElementDragControls {
  constructor(visualElement) {
    this.openDragLock = null;
    this.isDragging = false;
    this.currentDirection = null;
    this.originPoint = { x: 0, y: 0 };
    this.constraints = false;
    this.hasMutatedConstraints = false;
    this.elastic = createBox();
    this.latestPointerEvent = null;
    this.latestPanInfo = null;
    this.visualElement = visualElement;
  }
  start(originEvent, { snapToCursor = false, distanceThreshold } = {}) {
    const { presenceContext } = this.visualElement;
    if (presenceContext && presenceContext.isPresent === false)
      return;
    const onSessionStart = (event) => {
      if (snapToCursor) {
        this.snapToCursor(extractEventInfo(event).point);
      }
      this.stopAnimation();
    };
    const onStart = (event, info) => {
      const { drag, dragPropagation, onDragStart } = this.getProps();
      if (drag && !dragPropagation) {
        if (this.openDragLock)
          this.openDragLock();
        this.openDragLock = setDragLock(drag);
        if (!this.openDragLock)
          return;
      }
      this.latestPointerEvent = event;
      this.latestPanInfo = info;
      this.isDragging = true;
      this.currentDirection = null;
      this.resolveConstraints();
      if (this.visualElement.projection) {
        this.visualElement.projection.isAnimationBlocked = true;
        this.visualElement.projection.target = undefined;
      }
      eachAxis((axis) => {
        let current = this.getAxisMotionValue(axis).get() || 0;
        if (percent.test(current)) {
          const { projection } = this.visualElement;
          if (projection && projection.layout) {
            const measuredAxis = projection.layout.layoutBox[axis];
            if (measuredAxis) {
              const length = calcLength(measuredAxis);
              current = length * (parseFloat(current) / 100);
            }
          }
        }
        this.originPoint[axis] = current;
      });
      if (onDragStart) {
        frame.update(() => onDragStart(event, info), false, true);
      }
      addValueToWillChange(this.visualElement, "transform");
      const { animationState } = this.visualElement;
      animationState && animationState.setActive("whileDrag", true);
    };
    const onMove = (event, info) => {
      this.latestPointerEvent = event;
      this.latestPanInfo = info;
      const { dragPropagation, dragDirectionLock, onDirectionLock, onDrag } = this.getProps();
      if (!dragPropagation && !this.openDragLock)
        return;
      const { offset } = info;
      if (dragDirectionLock && this.currentDirection === null) {
        this.currentDirection = getCurrentDirection(offset);
        if (this.currentDirection !== null) {
          onDirectionLock && onDirectionLock(this.currentDirection);
        }
        return;
      }
      this.updateAxis("x", info.point, offset);
      this.updateAxis("y", info.point, offset);
      this.visualElement.render();
      if (onDrag) {
        frame.update(() => onDrag(event, info), false, true);
      }
    };
    const onSessionEnd = (event, info) => {
      this.latestPointerEvent = event;
      this.latestPanInfo = info;
      this.stop(event, info);
      this.latestPointerEvent = null;
      this.latestPanInfo = null;
    };
    const resumeAnimation = () => {
      const { dragSnapToOrigin: snap } = this.getProps();
      if (snap || this.constraints) {
        this.startAnimation({ x: 0, y: 0 });
      }
    };
    const { dragSnapToOrigin } = this.getProps();
    this.panSession = new PanSession(originEvent, {
      onSessionStart,
      onStart,
      onMove,
      onSessionEnd,
      resumeAnimation
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin,
      distanceThreshold,
      contextWindow: getContextWindow(this.visualElement),
      element: this.visualElement.current
    });
  }
  stop(event, panInfo) {
    const finalEvent = event || this.latestPointerEvent;
    const finalPanInfo = panInfo || this.latestPanInfo;
    const isDragging2 = this.isDragging;
    this.cancel();
    if (!isDragging2 || !finalPanInfo || !finalEvent)
      return;
    const { velocity } = finalPanInfo;
    this.startAnimation(velocity);
    const { onDragEnd } = this.getProps();
    if (onDragEnd) {
      frame.postRender(() => onDragEnd(finalEvent, finalPanInfo));
    }
  }
  cancel() {
    this.isDragging = false;
    const { projection, animationState } = this.visualElement;
    if (projection) {
      projection.isAnimationBlocked = false;
    }
    this.endPanSession();
    const { dragPropagation } = this.getProps();
    if (!dragPropagation && this.openDragLock) {
      this.openDragLock();
      this.openDragLock = null;
    }
    animationState && animationState.setActive("whileDrag", false);
  }
  endPanSession() {
    this.panSession && this.panSession.end();
    this.panSession = undefined;
  }
  updateAxis(axis, _point, offset) {
    const { drag } = this.getProps();
    if (!offset || !shouldDrag(axis, drag, this.currentDirection))
      return;
    const axisValue = this.getAxisMotionValue(axis);
    let next = this.originPoint[axis] + offset[axis];
    if (this.constraints && this.constraints[axis]) {
      next = applyConstraints(next, this.constraints[axis], this.elastic[axis]);
    }
    axisValue.set(next);
  }
  resolveConstraints() {
    const { dragConstraints, dragElastic } = this.getProps();
    const layout = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(false) : this.visualElement.projection?.layout;
    const prevConstraints = this.constraints;
    if (dragConstraints && isRefObject(dragConstraints)) {
      if (!this.constraints) {
        this.constraints = this.resolveRefConstraints();
      }
    } else {
      if (dragConstraints && layout) {
        this.constraints = calcRelativeConstraints(layout.layoutBox, dragConstraints);
      } else {
        this.constraints = false;
      }
    }
    this.elastic = resolveDragElastic(dragElastic);
    if (prevConstraints !== this.constraints && !isRefObject(dragConstraints) && layout && this.constraints && !this.hasMutatedConstraints) {
      eachAxis((axis) => {
        if (this.constraints !== false && this.getAxisMotionValue(axis)) {
          this.constraints[axis] = rebaseAxisConstraints(layout.layoutBox[axis], this.constraints[axis]);
        }
      });
    }
  }
  resolveRefConstraints() {
    const { dragConstraints: constraints, onMeasureDragConstraints } = this.getProps();
    if (!constraints || !isRefObject(constraints))
      return false;
    const constraintsElement = constraints.current;
    invariant(constraintsElement !== null, "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop.", "drag-constraints-ref");
    const { projection } = this.visualElement;
    if (!projection || !projection.layout)
      return false;
    const constraintsBox = measurePageBox(constraintsElement, projection.root, this.visualElement.getTransformPagePoint());
    let measuredConstraints = calcViewportConstraints(projection.layout.layoutBox, constraintsBox);
    if (onMeasureDragConstraints) {
      const userConstraints = onMeasureDragConstraints(convertBoxToBoundingBox(measuredConstraints));
      this.hasMutatedConstraints = !!userConstraints;
      if (userConstraints) {
        measuredConstraints = convertBoundingBoxToBox(userConstraints);
      }
    }
    return measuredConstraints;
  }
  startAnimation(velocity) {
    const { drag, dragMomentum, dragElastic, dragTransition, dragSnapToOrigin, onDragTransitionEnd } = this.getProps();
    const constraints = this.constraints || {};
    const momentumAnimations = eachAxis((axis) => {
      if (!shouldDrag(axis, drag, this.currentDirection)) {
        return;
      }
      let transition = constraints && constraints[axis] || {};
      if (dragSnapToOrigin === true || dragSnapToOrigin === axis)
        transition = { min: 0, max: 0 };
      const bounceStiffness = dragElastic ? 200 : 1e6;
      const bounceDamping = dragElastic ? 40 : 1e7;
      const inertia2 = {
        type: "inertia",
        velocity: dragMomentum ? velocity[axis] : 0,
        bounceStiffness,
        bounceDamping,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...dragTransition,
        ...transition
      };
      return this.startAxisValueAnimation(axis, inertia2);
    });
    return Promise.all(momentumAnimations).then(onDragTransitionEnd);
  }
  startAxisValueAnimation(axis, transition) {
    const axisValue = this.getAxisMotionValue(axis);
    addValueToWillChange(this.visualElement, axis);
    return axisValue.start(animateMotionValue(axis, axisValue, 0, transition, this.visualElement, false));
  }
  stopAnimation() {
    eachAxis((axis) => this.getAxisMotionValue(axis).stop());
  }
  getAxisMotionValue(axis) {
    const dragKey = `_drag${axis.toUpperCase()}`;
    const props = this.visualElement.getProps();
    const externalMotionValue = props[dragKey];
    return externalMotionValue ? externalMotionValue : this.visualElement.getValue(axis, (props.initial ? props.initial[axis] : undefined) || 0);
  }
  snapToCursor(point) {
    eachAxis((axis) => {
      const { drag } = this.getProps();
      if (!shouldDrag(axis, drag, this.currentDirection))
        return;
      const { projection } = this.visualElement;
      const axisValue = this.getAxisMotionValue(axis);
      if (projection && projection.layout) {
        const { min, max } = projection.layout.layoutBox[axis];
        const current = axisValue.get() || 0;
        axisValue.set(point[axis] - mixNumber(min, max, 0.5) + current);
      }
    });
  }
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag, dragConstraints } = this.getProps();
    const { projection } = this.visualElement;
    if (!isRefObject(dragConstraints) || !projection || !this.constraints)
      return;
    this.stopAnimation();
    const boxProgress = { x: 0, y: 0 };
    eachAxis((axis) => {
      const axisValue = this.getAxisMotionValue(axis);
      if (axisValue && this.constraints !== false) {
        const latest = axisValue.get();
        boxProgress[axis] = calcOrigin({ min: latest, max: latest }, this.constraints[axis]);
      }
    });
    const { transformTemplate } = this.visualElement.getProps();
    this.visualElement.current.style.transform = transformTemplate ? transformTemplate({}, "") : "none";
    projection.root && projection.root.updateScroll();
    projection.updateLayout();
    this.constraints = false;
    this.resolveConstraints();
    eachAxis((axis) => {
      if (!shouldDrag(axis, drag, null))
        return;
      const axisValue = this.getAxisMotionValue(axis);
      const { min, max } = this.constraints[axis];
      axisValue.set(mixNumber(min, max, boxProgress[axis]));
    });
    this.visualElement.render();
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    elementDragControls.set(this.visualElement, this);
    const element = this.visualElement.current;
    const stopPointerListener = addPointerEvent(element, "pointerdown", (event) => {
      const { drag, dragListener = true } = this.getProps();
      const target = event.target;
      const isClickingTextInputChild = target !== element && isElementTextInput(target);
      if (drag && dragListener && !isClickingTextInputChild) {
        this.start(event);
      }
    });
    let stopResizeObservers;
    const measureDragConstraints = () => {
      const { dragConstraints } = this.getProps();
      if (isRefObject(dragConstraints) && dragConstraints.current) {
        this.constraints = this.resolveRefConstraints();
        if (!stopResizeObservers) {
          stopResizeObservers = startResizeObservers(element, dragConstraints.current, () => this.scalePositionWithinConstraints());
        }
      }
    };
    const { projection } = this.visualElement;
    const stopMeasureLayoutListener = projection.addEventListener("measure", measureDragConstraints);
    if (projection && !projection.layout) {
      projection.root && projection.root.updateScroll();
      projection.updateLayout();
    }
    frame.read(measureDragConstraints);
    const stopResizeListener = addDomEvent(window, "resize", () => this.scalePositionWithinConstraints());
    const stopLayoutUpdateListener = projection.addEventListener("didUpdate", ({ delta, hasLayoutChanged }) => {
      if (this.isDragging && hasLayoutChanged) {
        eachAxis((axis) => {
          const motionValue2 = this.getAxisMotionValue(axis);
          if (!motionValue2)
            return;
          this.originPoint[axis] += delta[axis].translate;
          motionValue2.set(motionValue2.get() + delta[axis].translate);
        });
        this.visualElement.render();
      }
    });
    return () => {
      stopResizeListener();
      stopPointerListener();
      stopMeasureLayoutListener();
      stopLayoutUpdateListener && stopLayoutUpdateListener();
      stopResizeObservers && stopResizeObservers();
    };
  }
  getProps() {
    const props = this.visualElement.getProps();
    const { drag = false, dragDirectionLock = false, dragPropagation = false, dragConstraints = false, dragElastic = defaultElastic, dragMomentum = true } = props;
    return {
      ...props,
      drag,
      dragDirectionLock,
      dragPropagation,
      dragConstraints,
      dragElastic,
      dragMomentum
    };
  }
}
function skipFirstCall(callback) {
  let isFirst = true;
  return () => {
    if (isFirst) {
      isFirst = false;
      return;
    }
    callback();
  };
}
function startResizeObservers(element, constraintsElement, onResize) {
  const stopElement = resize(element, skipFirstCall(onResize));
  const stopContainer = resize(constraintsElement, skipFirstCall(onResize));
  return () => {
    stopElement();
    stopContainer();
  };
}
function shouldDrag(direction, drag, currentDirection) {
  return (drag === true || drag === direction) && (currentDirection === null || currentDirection === direction);
}
function getCurrentDirection(offset, lockThreshold = 10) {
  let direction = null;
  if (Math.abs(offset.y) > lockThreshold) {
    direction = "y";
  } else if (Math.abs(offset.x) > lockThreshold) {
    direction = "x";
  }
  return direction;
}
var elementDragControls;
var init_VisualElementDragControls = __esm(() => {
  init_es2();
  init_es();
  init_add_pointer_event();
  init_event_info();
  init_get_context_window();
  init_is_ref_object();
  init_PanSession();
  init_constraints();
  elementDragControls = new WeakMap;
});

// node_modules/framer-motion/dist/es/gestures/drag/index.mjs
var DragGesture;
var init_drag = __esm(() => {
  init_es2();
  init_es();
  init_VisualElementDragControls();
  DragGesture = class DragGesture extends Feature {
    constructor(node) {
      super(node);
      this.removeGroupControls = noop;
      this.removeListeners = noop;
      this.controls = new VisualElementDragControls(node);
    }
    mount() {
      const { dragControls } = this.node.getProps();
      if (dragControls) {
        this.removeGroupControls = dragControls.subscribe(this.controls);
      }
      this.removeListeners = this.controls.addListeners() || noop;
    }
    update() {
      const { dragControls } = this.node.getProps();
      const { dragControls: prevDragControls } = this.node.prevProps || {};
      if (dragControls !== prevDragControls) {
        this.removeGroupControls();
        if (dragControls) {
          this.removeGroupControls = dragControls.subscribe(this.controls);
        }
      }
    }
    unmount() {
      this.removeGroupControls();
      this.removeListeners();
      if (!this.controls.isDragging) {
        this.controls.endPanSession();
      }
    }
  };
});

// node_modules/framer-motion/dist/es/gestures/pan/index.mjs
var asyncHandler = (handler) => (event, info) => {
  if (handler) {
    frame.update(() => handler(event, info), false, true);
  }
}, PanGesture;
var init_pan = __esm(() => {
  init_es2();
  init_es();
  init_add_pointer_event();
  init_get_context_window();
  init_PanSession();
  PanGesture = class PanGesture extends Feature {
    constructor() {
      super(...arguments);
      this.removePointerDownListener = noop;
    }
    onPointerDown(pointerDownEvent) {
      this.session = new PanSession(pointerDownEvent, this.createPanHandlers(), {
        transformPagePoint: this.node.getTransformPagePoint(),
        contextWindow: getContextWindow(this.node)
      });
    }
    createPanHandlers() {
      const { onPanSessionStart, onPanStart, onPan, onPanEnd } = this.node.getProps();
      return {
        onSessionStart: asyncHandler(onPanSessionStart),
        onStart: asyncHandler(onPanStart),
        onMove: asyncHandler(onPan),
        onEnd: (event, info) => {
          delete this.session;
          if (onPanEnd) {
            frame.postRender(() => onPanEnd(event, info));
          }
        }
      };
    }
    mount() {
      this.removePointerDownListener = addPointerEvent(this.node.current, "pointerdown", (event) => this.onPointerDown(event));
    }
    update() {
      this.session && this.session.updateHandlers(this.createPanHandlers());
    }
    unmount() {
      this.removePointerDownListener();
      this.session && this.session.end();
    }
  };
});

// node_modules/framer-motion/dist/es/motion/features/layout/MeasureLayout.mjs
function MeasureLayout(props) {
  const [isPresent, safeToRemove] = usePresence();
  const layoutGroup = import_react23.useContext(LayoutGroupContext);
  return import_jsx_runtime5.jsx(MeasureLayoutWithContext, { ...props, layoutGroup, switchLayoutGroup: import_react23.useContext(SwitchLayoutGroupContext), isPresent, safeToRemove });
}
var import_jsx_runtime5, import_react23, hasTakenAnySnapshot = false, MeasureLayoutWithContext;
var init_MeasureLayout = __esm(() => {
  import_jsx_runtime5 = __toESM(require_jsx_runtime(), 1);
  init_es2();
  import_react23 = __toESM(require_react(), 1);
  init_use_presence();
  init_LayoutGroupContext();
  init_SwitchLayoutGroupContext();
  "use client";
  MeasureLayoutWithContext = class MeasureLayoutWithContext extends import_react23.Component {
    componentDidMount() {
      const { visualElement, layoutGroup, switchLayoutGroup, layoutId } = this.props;
      const { projection } = visualElement;
      if (projection) {
        if (layoutGroup.group)
          layoutGroup.group.add(projection);
        if (switchLayoutGroup && switchLayoutGroup.register && layoutId) {
          switchLayoutGroup.register(projection);
        }
        if (hasTakenAnySnapshot) {
          projection.root.didUpdate();
        }
        projection.addEventListener("animationComplete", () => {
          this.safeToRemove();
        });
        projection.setOptions({
          ...projection.options,
          layoutDependency: this.props.layoutDependency,
          onExitComplete: () => this.safeToRemove()
        });
      }
      globalProjectionState.hasEverUpdated = true;
    }
    getSnapshotBeforeUpdate(prevProps) {
      const { layoutDependency, visualElement, drag, isPresent } = this.props;
      const { projection } = visualElement;
      if (!projection)
        return null;
      projection.isPresent = isPresent;
      if (prevProps.layoutDependency !== layoutDependency) {
        projection.setOptions({
          ...projection.options,
          layoutDependency
        });
      }
      hasTakenAnySnapshot = true;
      if (drag || prevProps.layoutDependency !== layoutDependency || layoutDependency === undefined || prevProps.isPresent !== isPresent) {
        projection.willUpdate();
      } else {
        this.safeToRemove();
      }
      if (prevProps.isPresent !== isPresent) {
        if (isPresent) {
          projection.promote();
        } else if (!projection.relegate()) {
          frame.postRender(() => {
            const stack = projection.getStack();
            if (!stack || !stack.members.length) {
              this.safeToRemove();
            }
          });
        }
      }
      return null;
    }
    componentDidUpdate() {
      const { visualElement, layoutAnchor } = this.props;
      const { projection } = visualElement;
      if (projection) {
        projection.options.layoutAnchor = layoutAnchor;
        projection.root.didUpdate();
        microtask.postRender(() => {
          if (!projection.currentAnimation && projection.isLead()) {
            this.safeToRemove();
          }
        });
      }
    }
    componentWillUnmount() {
      const { visualElement, layoutGroup, switchLayoutGroup: promoteContext } = this.props;
      const { projection } = visualElement;
      hasTakenAnySnapshot = true;
      if (projection) {
        projection.scheduleCheckAfterUnmount();
        if (layoutGroup && layoutGroup.group)
          layoutGroup.group.remove(projection);
        if (promoteContext && promoteContext.deregister)
          promoteContext.deregister(projection);
      }
    }
    safeToRemove() {
      const { safeToRemove } = this.props;
      safeToRemove && safeToRemove();
    }
    render() {
      return null;
    }
  };
});

// node_modules/framer-motion/dist/es/motion/features/drag.mjs
var drag;
var init_drag2 = __esm(() => {
  init_drag();
  init_pan();
  init_MeasureLayout();
  init_es2();
  drag = {
    pan: {
      Feature: PanGesture
    },
    drag: {
      Feature: DragGesture,
      ProjectionNode: HTMLProjectionNode,
      MeasureLayout
    }
  };
});

// node_modules/framer-motion/dist/es/gestures/hover.mjs
function handleHoverEvent(node, event, lifecycle) {
  const { props } = node;
  if (node.animationState && props.whileHover) {
    node.animationState.setActive("whileHover", lifecycle === "Start");
  }
  const eventName = "onHover" + lifecycle;
  const callback = props[eventName];
  if (callback) {
    frame.postRender(() => callback(event, extractEventInfo(event)));
  }
}
var HoverGesture;
var init_hover2 = __esm(() => {
  init_es2();
  init_event_info();
  HoverGesture = class HoverGesture extends Feature {
    mount() {
      const { current } = this.node;
      if (!current)
        return;
      this.unmount = hover(current, (_element, startEvent) => {
        handleHoverEvent(this.node, startEvent, "Start");
        return (endEvent) => handleHoverEvent(this.node, endEvent, "End");
      });
    }
    unmount() {}
  };
});

// node_modules/framer-motion/dist/es/gestures/focus.mjs
var FocusGesture;
var init_focus = __esm(() => {
  init_es2();
  init_es();
  FocusGesture = class FocusGesture extends Feature {
    constructor() {
      super(...arguments);
      this.isActive = false;
    }
    onFocus() {
      let isFocusVisible = false;
      try {
        isFocusVisible = this.node.current.matches(":focus-visible");
      } catch (e) {
        isFocusVisible = true;
      }
      if (!isFocusVisible || !this.node.animationState)
        return;
      this.node.animationState.setActive("whileFocus", true);
      this.isActive = true;
    }
    onBlur() {
      if (!this.isActive || !this.node.animationState)
        return;
      this.node.animationState.setActive("whileFocus", false);
      this.isActive = false;
    }
    mount() {
      this.unmount = pipe(addDomEvent(this.node.current, "focus", () => this.onFocus()), addDomEvent(this.node.current, "blur", () => this.onBlur()));
    }
    unmount() {}
  };
});

// node_modules/framer-motion/dist/es/gestures/press.mjs
function handlePressEvent(node, event, lifecycle) {
  const { props } = node;
  if (node.current instanceof HTMLButtonElement && node.current.disabled) {
    return;
  }
  if (node.animationState && props.whileTap) {
    node.animationState.setActive("whileTap", lifecycle === "Start");
  }
  const eventName = "onTap" + (lifecycle === "End" ? "" : lifecycle);
  const callback = props[eventName];
  if (callback) {
    frame.postRender(() => callback(event, extractEventInfo(event)));
  }
}
var PressGesture;
var init_press2 = __esm(() => {
  init_es2();
  init_event_info();
  PressGesture = class PressGesture extends Feature {
    mount() {
      const { current } = this.node;
      if (!current)
        return;
      const { globalTapTarget, propagate } = this.node.props;
      this.unmount = press(current, (_element, startEvent) => {
        handlePressEvent(this.node, startEvent, "Start");
        return (endEvent, { success }) => handlePressEvent(this.node, endEvent, success ? "End" : "Cancel");
      }, {
        useGlobalTarget: globalTapTarget,
        stopPropagation: propagate?.tap === false
      });
    }
    unmount() {}
  };
});

// node_modules/framer-motion/dist/es/motion/features/viewport/observers.mjs
function initIntersectionObserver({ root, ...options }) {
  const lookupRoot = root || document;
  if (!observers.has(lookupRoot)) {
    observers.set(lookupRoot, {});
  }
  const rootObservers = observers.get(lookupRoot);
  const key = JSON.stringify(options);
  if (!rootObservers[key]) {
    rootObservers[key] = new IntersectionObserver(fireAllObserverCallbacks, { root, ...options });
  }
  return rootObservers[key];
}
function observeIntersection(element, options, callback) {
  const rootInteresectionObserver = initIntersectionObserver(options);
  observerCallbacks.set(element, callback);
  rootInteresectionObserver.observe(element);
  return () => {
    observerCallbacks.delete(element);
    rootInteresectionObserver.unobserve(element);
  };
}
var observerCallbacks, observers, fireObserverCallback = (entry) => {
  const callback = observerCallbacks.get(entry.target);
  callback && callback(entry);
}, fireAllObserverCallbacks = (entries) => {
  entries.forEach(fireObserverCallback);
};
var init_observers = __esm(() => {
  observerCallbacks = new WeakMap;
  observers = new WeakMap;
});

// node_modules/framer-motion/dist/es/motion/features/viewport/index.mjs
function hasViewportOptionChanged({ viewport = {} }, { viewport: prevViewport = {} } = {}) {
  return (name) => viewport[name] !== prevViewport[name];
}
var thresholdNames, InViewFeature;
var init_viewport = __esm(() => {
  init_es2();
  init_observers();
  thresholdNames = {
    some: 0,
    all: 1
  };
  InViewFeature = class InViewFeature extends Feature {
    constructor() {
      super(...arguments);
      this.hasEnteredView = false;
      this.isInView = false;
    }
    startObserver() {
      this.stopObserver?.();
      const { viewport = {} } = this.node.getProps();
      const { root, margin: rootMargin, amount = "some", once } = viewport;
      const options = {
        root: root ? root.current : undefined,
        rootMargin,
        threshold: typeof amount === "number" ? amount : thresholdNames[amount]
      };
      const onIntersectionUpdate = (entry) => {
        const { isIntersecting } = entry;
        if (this.isInView === isIntersecting)
          return;
        this.isInView = isIntersecting;
        if (once && !isIntersecting && this.hasEnteredView) {
          return;
        } else if (isIntersecting) {
          this.hasEnteredView = true;
        }
        if (this.node.animationState) {
          this.node.animationState.setActive("whileInView", isIntersecting);
        }
        const { onViewportEnter, onViewportLeave } = this.node.getProps();
        const callback = isIntersecting ? onViewportEnter : onViewportLeave;
        callback && callback(entry);
      };
      this.stopObserver = observeIntersection(this.node.current, options, onIntersectionUpdate);
    }
    mount() {
      this.startObserver();
    }
    update() {
      if (typeof IntersectionObserver === "undefined")
        return;
      const { props, prevProps } = this.node;
      const hasOptionsChanged = ["amount", "margin", "root"].some(hasViewportOptionChanged(props, prevProps));
      if (hasOptionsChanged) {
        this.startObserver();
      }
    }
    unmount() {
      this.stopObserver?.();
      this.hasEnteredView = false;
      this.isInView = false;
    }
  };
});

// node_modules/framer-motion/dist/es/motion/features/gestures.mjs
var gestureAnimations;
var init_gestures = __esm(() => {
  init_hover2();
  init_focus();
  init_press2();
  init_viewport();
  gestureAnimations = {
    inView: {
      Feature: InViewFeature
    },
    tap: {
      Feature: PressGesture
    },
    focus: {
      Feature: FocusGesture
    },
    hover: {
      Feature: HoverGesture
    }
  };
});

// node_modules/framer-motion/dist/es/motion/features/layout.mjs
var layout;
var init_layout = __esm(() => {
  init_es2();
  init_MeasureLayout();
  layout = {
    layout: {
      ProjectionNode: HTMLProjectionNode,
      MeasureLayout
    }
  };
});

// node_modules/framer-motion/dist/es/render/components/motion/feature-bundle.mjs
var featureBundle;
var init_feature_bundle = __esm(() => {
  init_animations();
  init_drag2();
  init_gestures();
  init_layout();
  featureBundle = {
    ...animations,
    ...gestureAnimations,
    ...drag,
    ...layout
  };
});

// node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs
var motion;
var init_proxy = __esm(() => {
  init_create_visual_element();
  init_create_proxy();
  init_feature_bundle();
  motion = /* @__PURE__ */ createMotionProxy(featureBundle, createDomVisualElement);
});

// node_modules/framer-motion/dist/es/utils/use-motion-value-event.mjs
function useMotionValueEvent(value, event, callback) {
  import_react24.useInsertionEffect(() => value.on(event, callback), [value, event, callback]);
}
var import_react24;
var init_use_motion_value_event = __esm(() => {
  import_react24 = __toESM(require_react(), 1);
  "use client";
});

// node_modules/framer-motion/dist/es/value/use-motion-value.mjs
function useMotionValue(initial) {
  const value = useConstant(() => motionValue(initial));
  const { isStatic } = import_react25.useContext(MotionConfigContext);
  if (isStatic) {
    const [, setLatest] = import_react25.useState(initial);
    import_react25.useEffect(() => value.on("change", setLatest), []);
  }
  return value;
}
var import_react25;
var init_use_motion_value = __esm(() => {
  init_es2();
  import_react25 = __toESM(require_react(), 1);
  init_MotionConfigContext();
  init_use_constant();
  "use client";
});

// node_modules/framer-motion/dist/es/value/use-combine-values.mjs
function useCombineMotionValues(values, combineValues) {
  const value = useMotionValue(combineValues());
  const updateValue = () => value.set(combineValues());
  updateValue();
  useIsomorphicLayoutEffect(() => {
    const scheduleUpdate = () => frame.preRender(updateValue, false, true);
    const subscriptions = values.map((v) => v.on("change", scheduleUpdate));
    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      cancelFrame(updateValue);
    };
  });
  return value;
}
var init_use_combine_values = __esm(() => {
  init_es2();
  init_use_isomorphic_effect();
  init_use_motion_value();
  "use client";
});

// node_modules/framer-motion/dist/es/value/use-computed.mjs
function useComputed(compute) {
  collectMotionValues.current = [];
  compute();
  const value = useCombineMotionValues(collectMotionValues.current, compute);
  collectMotionValues.current = undefined;
  return value;
}
var init_use_computed = __esm(() => {
  init_es2();
  init_use_combine_values();
  "use client";
});

// node_modules/framer-motion/dist/es/value/use-transform.mjs
function useTransform(input, inputRangeOrTransformer, outputRangeOrMap, options) {
  if (typeof input === "function") {
    return useComputed(input);
  }
  const isOutputMap = outputRangeOrMap !== undefined && !Array.isArray(outputRangeOrMap) && typeof inputRangeOrTransformer !== "function";
  if (isOutputMap) {
    return useMapTransform(input, inputRangeOrTransformer, outputRangeOrMap, options);
  }
  const outputRange = outputRangeOrMap;
  const transformer = typeof inputRangeOrTransformer === "function" ? inputRangeOrTransformer : transform(inputRangeOrTransformer, outputRange, options);
  const result = Array.isArray(input) ? useListTransform(input, transformer) : useListTransform([input], ([latest]) => transformer(latest));
  const inputAccelerate = !Array.isArray(input) ? input.accelerate : undefined;
  if (inputAccelerate && !inputAccelerate.isTransformed && typeof inputRangeOrTransformer !== "function" && Array.isArray(outputRangeOrMap) && options?.clamp !== false) {
    result.accelerate = {
      ...inputAccelerate,
      times: inputRangeOrTransformer,
      keyframes: outputRangeOrMap,
      isTransformed: true,
      ...options?.ease ? { ease: options.ease } : {}
    };
  }
  return result;
}
function useListTransform(values, transformer) {
  const latest = useConstant(() => []);
  return useCombineMotionValues(values, () => {
    latest.length = 0;
    const numValues = values.length;
    for (let i = 0;i < numValues; i++) {
      latest[i] = values[i].get();
    }
    return transformer(latest);
  });
}
function useMapTransform(inputValue, inputRange, outputMap, options) {
  const keys = useConstant(() => Object.keys(outputMap));
  const output = useConstant(() => ({}));
  for (const key of keys) {
    output[key] = useTransform(inputValue, inputRange, outputMap[key], options);
  }
  return output;
}
var init_use_transform = __esm(() => {
  init_es2();
  init_use_constant();
  init_use_combine_values();
  init_use_computed();
  "use client";
});

// node_modules/framer-motion/dist/es/value/use-follow-value.mjs
function useFollowValue(source, options = {}) {
  const { isStatic } = import_react26.useContext(MotionConfigContext);
  const getFromSource = () => isMotionValue(source) ? source.get() : source;
  if (isStatic) {
    return useTransform(getFromSource);
  }
  const value = useMotionValue(getFromSource());
  import_react26.useInsertionEffect(() => {
    return attachFollow(value, source, options);
  }, [value, JSON.stringify(options)]);
  return value;
}
var import_react26;
var init_use_follow_value = __esm(() => {
  init_es2();
  import_react26 = __toESM(require_react(), 1);
  init_MotionConfigContext();
  init_use_motion_value();
  init_use_transform();
  "use client";
});

// node_modules/framer-motion/dist/es/value/use-spring.mjs
function useSpring(source, options = {}) {
  return useFollowValue(source, { type: "spring", ...options });
}
var init_use_spring = __esm(() => {
  init_use_follow_value();
  "use client";
});

// node_modules/framer-motion/dist/es/animation/utils/is-dom-keyframes.mjs
function isDOMKeyframes(keyframes2) {
  return typeof keyframes2 === "object" && !Array.isArray(keyframes2);
}
var init_is_dom_keyframes = () => {};

// node_modules/framer-motion/dist/es/animation/animate/resolve-subjects.mjs
function resolveSubjects(subject, keyframes2, scope, selectorCache) {
  if (subject == null) {
    return [];
  }
  if (typeof subject === "string" && isDOMKeyframes(keyframes2)) {
    return resolveElements(subject, scope, selectorCache);
  } else if (subject instanceof NodeList) {
    return Array.from(subject);
  } else if (Array.isArray(subject)) {
    return subject.filter((s) => s != null);
  } else {
    return [subject];
  }
}
var init_resolve_subjects = __esm(() => {
  init_es2();
  init_is_dom_keyframes();
});

// node_modules/framer-motion/dist/es/animation/sequence/utils/calc-repeat-duration.mjs
function calculateRepeatDuration(duration, repeat, _repeatDelay) {
  return duration * (repeat + 1);
}
var init_calc_repeat_duration = () => {};

// node_modules/framer-motion/dist/es/animation/sequence/utils/calc-time.mjs
function calcNextTime(current, next, prev, labels) {
  if (typeof next === "number") {
    return next;
  } else if (next.startsWith("-") || next.startsWith("+")) {
    return Math.max(0, current + parseFloat(next));
  } else if (next === "<") {
    return prev;
  } else if (next.startsWith("<")) {
    return Math.max(0, prev + parseFloat(next.slice(1)));
  } else {
    return labels.get(next) ?? current;
  }
}
var init_calc_time = () => {};

// node_modules/framer-motion/dist/es/animation/sequence/utils/edit.mjs
function eraseKeyframes(sequence, startTime, endTime) {
  for (let i = 0;i < sequence.length; i++) {
    const keyframe = sequence[i];
    if (keyframe.at > startTime && keyframe.at < endTime) {
      removeItem(sequence, keyframe);
      i--;
    }
  }
}
function addKeyframes(sequence, keyframes2, easing, offset, startTime, endTime) {
  eraseKeyframes(sequence, startTime, endTime);
  for (let i = 0;i < keyframes2.length; i++) {
    sequence.push({
      value: keyframes2[i],
      at: mixNumber(startTime, endTime, offset[i]),
      easing: getEasingForSegment(easing, i)
    });
  }
}
var init_edit = __esm(() => {
  init_es2();
  init_es();
});

// node_modules/framer-motion/dist/es/animation/sequence/utils/normalize-times.mjs
function normalizeTimes(times, repeat) {
  for (let i = 0;i < times.length; i++) {
    times[i] = times[i] / (repeat + 1);
  }
}
var init_normalize_times = () => {};

// node_modules/framer-motion/dist/es/animation/sequence/utils/sort.mjs
function compareByTime(a, b) {
  if (a.at === b.at) {
    if (a.value === null)
      return 1;
    if (b.value === null)
      return -1;
    return 0;
  } else {
    return a.at - b.at;
  }
}
var init_sort = () => {};

// node_modules/framer-motion/dist/es/animation/sequence/create.mjs
function createAnimationsFromSequence(sequence, { defaultTransition = {}, ...sequenceTransition } = {}, scope, generators) {
  const defaultDuration = defaultTransition.duration || 0.3;
  const animationDefinitions = new Map;
  const sequences = new Map;
  const elementCache = {};
  const timeLabels = new Map;
  let prevTime = 0;
  let currentTime = 0;
  let totalDuration = 0;
  for (let i = 0;i < sequence.length; i++) {
    const segment = sequence[i];
    if (typeof segment === "string") {
      timeLabels.set(segment, currentTime);
      continue;
    } else if (!Array.isArray(segment)) {
      timeLabels.set(segment.name, calcNextTime(currentTime, segment.at, prevTime, timeLabels));
      continue;
    }
    let [subject, keyframes2, transition = {}] = segment;
    if (transition.at !== undefined) {
      currentTime = calcNextTime(currentTime, transition.at, prevTime, timeLabels);
    }
    let maxDuration = 0;
    const resolveValueSequence = (valueKeyframes, valueTransition, valueSequence, elementIndex = 0, numSubjects = 0) => {
      const valueKeyframesAsList = keyframesAsList(valueKeyframes);
      const { delay: delay2 = 0, times = defaultOffset(valueKeyframesAsList), type = defaultTransition.type || "keyframes", repeat, repeatType, repeatDelay = 0, ...remainingTransition } = valueTransition;
      let { ease: ease2 = defaultTransition.ease || "easeOut", duration } = valueTransition;
      const calculatedDelay = typeof delay2 === "function" ? delay2(elementIndex, numSubjects) : delay2;
      const numKeyframes = valueKeyframesAsList.length;
      const createGenerator = isGenerator(type) ? type : generators?.[type || "keyframes"];
      if (numKeyframes <= 2 && createGenerator) {
        let absoluteDelta = 100;
        if (numKeyframes === 2 && isNumberKeyframesArray(valueKeyframesAsList)) {
          const delta = valueKeyframesAsList[1] - valueKeyframesAsList[0];
          absoluteDelta = Math.abs(delta);
        }
        const springTransition = {
          ...defaultTransition,
          ...remainingTransition
        };
        if (duration !== undefined) {
          springTransition.duration = secondsToMilliseconds(duration);
        }
        const springEasing = createGeneratorEasing(springTransition, absoluteDelta, createGenerator);
        ease2 = springEasing.ease;
        duration = springEasing.duration;
      }
      duration ?? (duration = defaultDuration);
      const startTime = currentTime + calculatedDelay;
      if (times.length === 1 && times[0] === 0) {
        times[1] = 1;
      }
      const remainder = times.length - valueKeyframesAsList.length;
      remainder > 0 && fillOffset(times, remainder);
      valueKeyframesAsList.length === 1 && valueKeyframesAsList.unshift(null);
      if (repeat) {
        invariant(repeat < MAX_REPEAT, "Repeat count too high, must be less than 20", "repeat-count-high");
        duration = calculateRepeatDuration(duration, repeat);
        const originalKeyframes = [...valueKeyframesAsList];
        const originalTimes = [...times];
        ease2 = Array.isArray(ease2) ? [...ease2] : [ease2];
        const originalEase = [...ease2];
        for (let repeatIndex = 0;repeatIndex < repeat; repeatIndex++) {
          valueKeyframesAsList.push(...originalKeyframes);
          for (let keyframeIndex = 0;keyframeIndex < originalKeyframes.length; keyframeIndex++) {
            times.push(originalTimes[keyframeIndex] + (repeatIndex + 1));
            ease2.push(keyframeIndex === 0 ? "linear" : getEasingForSegment(originalEase, keyframeIndex - 1));
          }
        }
        normalizeTimes(times, repeat);
      }
      const targetTime = startTime + duration;
      addKeyframes(valueSequence, valueKeyframesAsList, ease2, times, startTime, targetTime);
      maxDuration = Math.max(calculatedDelay + duration, maxDuration);
      totalDuration = Math.max(targetTime, totalDuration);
    };
    if (isMotionValue(subject)) {
      const subjectSequence = getSubjectSequence(subject, sequences);
      resolveValueSequence(keyframes2, transition, getValueSequence("default", subjectSequence));
    } else {
      const subjects = resolveSubjects(subject, keyframes2, scope, elementCache);
      const numSubjects = subjects.length;
      for (let subjectIndex = 0;subjectIndex < numSubjects; subjectIndex++) {
        keyframes2 = keyframes2;
        transition = transition;
        const thisSubject = subjects[subjectIndex];
        const subjectSequence = getSubjectSequence(thisSubject, sequences);
        for (const key in keyframes2) {
          resolveValueSequence(keyframes2[key], getValueTransition2(transition, key), getValueSequence(key, subjectSequence), subjectIndex, numSubjects);
        }
      }
    }
    prevTime = currentTime;
    currentTime += maxDuration;
  }
  sequences.forEach((valueSequences, element) => {
    for (const key in valueSequences) {
      const valueSequence = valueSequences[key];
      valueSequence.sort(compareByTime);
      const keyframes2 = [];
      const valueOffset = [];
      const valueEasing = [];
      for (let i = 0;i < valueSequence.length; i++) {
        const { at, value, easing } = valueSequence[i];
        keyframes2.push(value);
        valueOffset.push(progress(0, totalDuration, at));
        valueEasing.push(easing || "easeOut");
      }
      if (valueOffset[0] !== 0) {
        valueOffset.unshift(0);
        keyframes2.unshift(keyframes2[0]);
        valueEasing.unshift(defaultSegmentEasing);
      }
      if (valueOffset[valueOffset.length - 1] !== 1) {
        valueOffset.push(1);
        keyframes2.push(null);
      }
      if (!animationDefinitions.has(element)) {
        animationDefinitions.set(element, {
          keyframes: {},
          transition: {}
        });
      }
      const definition = animationDefinitions.get(element);
      definition.keyframes[key] = keyframes2;
      const { type: _type, ...remainingDefaultTransition } = defaultTransition;
      definition.transition[key] = {
        ...remainingDefaultTransition,
        duration: totalDuration,
        ease: valueEasing,
        times: valueOffset,
        ...sequenceTransition
      };
    }
  });
  return animationDefinitions;
}
function getSubjectSequence(subject, sequences) {
  !sequences.has(subject) && sequences.set(subject, {});
  return sequences.get(subject);
}
function getValueSequence(name, sequences) {
  if (!sequences[name])
    sequences[name] = [];
  return sequences[name];
}
function keyframesAsList(keyframes2) {
  return Array.isArray(keyframes2) ? keyframes2 : [keyframes2];
}
function getValueTransition2(transition, key) {
  return transition && transition[key] ? {
    ...transition,
    ...transition[key]
  } : { ...transition };
}
var defaultSegmentEasing = "easeInOut", MAX_REPEAT = 20, isNumber = (keyframe) => typeof keyframe === "number", isNumberKeyframesArray = (keyframes2) => keyframes2.every(isNumber);
var init_create2 = __esm(() => {
  init_es2();
  init_es();
  init_resolve_subjects();
  init_calc_repeat_duration();
  init_calc_time();
  init_edit();
  init_normalize_times();
  init_sort();
});

// node_modules/framer-motion/dist/es/animation/utils/create-visual-element.mjs
function createDOMVisualElement(element) {
  const options = {
    presenceContext: null,
    props: {},
    visualState: {
      renderState: {
        transform: {},
        transformOrigin: {},
        style: {},
        vars: {},
        attrs: {}
      },
      latestValues: {}
    }
  };
  const node = isSVGElement(element) && !isSVGSVGElement(element) ? new SVGVisualElement(options) : new HTMLVisualElement(options);
  node.mount(element);
  visualElementStore.set(element, node);
}
function createObjectVisualElement(subject) {
  const options = {
    presenceContext: null,
    props: {},
    visualState: {
      renderState: {
        output: {}
      },
      latestValues: {}
    }
  };
  const node = new ObjectVisualElement(options);
  node.mount(subject);
  visualElementStore.set(subject, node);
}
var init_create_visual_element2 = __esm(() => {
  init_es2();
});

// node_modules/framer-motion/dist/es/animation/animate/subject.mjs
function isSingleValue(subject, keyframes2) {
  return isMotionValue(subject) || typeof subject === "number" || typeof subject === "string" && !isDOMKeyframes(keyframes2);
}
function animateSubject(subject, keyframes2, options, scope) {
  const animations2 = [];
  if (isSingleValue(subject, keyframes2)) {
    animations2.push(animateSingleValue(subject, isDOMKeyframes(keyframes2) ? keyframes2.default || keyframes2 : keyframes2, options ? options.default || options : options));
  } else {
    if (subject == null) {
      return animations2;
    }
    const subjects = resolveSubjects(subject, keyframes2, scope);
    const numSubjects = subjects.length;
    invariant(Boolean(numSubjects), "No valid elements provided.", "no-valid-elements");
    for (let i = 0;i < numSubjects; i++) {
      const thisSubject = subjects[i];
      const createVisualElement = thisSubject instanceof Element ? createDOMVisualElement : createObjectVisualElement;
      if (!visualElementStore.has(thisSubject)) {
        createVisualElement(thisSubject);
      }
      const visualElement = visualElementStore.get(thisSubject);
      const transition = { ...options };
      if ("delay" in transition && typeof transition.delay === "function") {
        transition.delay = transition.delay(i, numSubjects);
      }
      animations2.push(...animateTarget(visualElement, { ...keyframes2, transition }, {}));
    }
  }
  return animations2;
}
var init_subject = __esm(() => {
  init_es2();
  init_es();
  init_create_visual_element2();
  init_is_dom_keyframes();
  init_resolve_subjects();
});

// node_modules/framer-motion/dist/es/animation/animate/sequence.mjs
function animateSequence(sequence, options, scope) {
  const animations2 = [];
  const processedSequence = sequence.map((segment) => {
    if (Array.isArray(segment) && typeof segment[0] === "function") {
      const callback = segment[0];
      const mv = motionValue(0);
      mv.on("change", callback);
      if (segment.length === 1) {
        return [mv, [0, 1]];
      } else if (segment.length === 2) {
        return [mv, [0, 1], segment[1]];
      } else {
        return [mv, segment[1], segment[2]];
      }
    }
    return segment;
  });
  const animationDefinitions = createAnimationsFromSequence(processedSequence, options, scope, { spring });
  animationDefinitions.forEach(({ keyframes: keyframes2, transition }, subject) => {
    animations2.push(...animateSubject(subject, keyframes2, transition));
  });
  return animations2;
}
var init_sequence = __esm(() => {
  init_es2();
  init_create2();
  init_subject();
});

// node_modules/framer-motion/dist/es/animation/animate/index.mjs
function isSequence(value) {
  return Array.isArray(value) && value.some(Array.isArray);
}
function createScopedAnimate(options = {}) {
  const { scope, reduceMotion } = options;
  function scopedAnimate(subjectOrSequence, optionsOrKeyframes, options2) {
    let animations2 = [];
    let animationOnComplete;
    if (isSequence(subjectOrSequence)) {
      const { onComplete, ...sequenceOptions } = optionsOrKeyframes || {};
      if (typeof onComplete === "function") {
        animationOnComplete = onComplete;
      }
      animations2 = animateSequence(subjectOrSequence, reduceMotion !== undefined ? { reduceMotion, ...sequenceOptions } : sequenceOptions, scope);
    } else {
      const { onComplete, ...rest } = options2 || {};
      if (typeof onComplete === "function") {
        animationOnComplete = onComplete;
      }
      animations2 = animateSubject(subjectOrSequence, optionsOrKeyframes, reduceMotion !== undefined ? { reduceMotion, ...rest } : rest, scope);
    }
    const animation = new GroupAnimationWithThen(animations2);
    if (animationOnComplete) {
      animation.finished.then(animationOnComplete);
    }
    if (scope) {
      scope.animations.push(animation);
      animation.finished.then(() => {
        removeItem(scope.animations, animation);
      });
    }
    return animation;
  }
  return scopedAnimate;
}
var animate;
var init_animate = __esm(() => {
  init_es2();
  init_es();
  init_sequence();
  init_subject();
  animate = createScopedAnimate();
});

// node_modules/framer-motion/dist/es/render/dom/viewport/index.mjs
function inView(elementOrSelector, onStart, { root, margin: rootMargin, amount = "some" } = {}) {
  const elements = resolveElements(elementOrSelector);
  const activeIntersections = new WeakMap;
  const onIntersectionChange = (entries) => {
    entries.forEach((entry) => {
      const onEnd = activeIntersections.get(entry.target);
      if (entry.isIntersecting === Boolean(onEnd))
        return;
      if (entry.isIntersecting) {
        const newOnEnd = onStart(entry.target, entry);
        if (typeof newOnEnd === "function") {
          activeIntersections.set(entry.target, newOnEnd);
        } else {
          observer2.unobserve(entry.target);
        }
      } else if (typeof onEnd === "function") {
        onEnd(entry);
        activeIntersections.delete(entry.target);
      }
    });
  };
  const observer2 = new IntersectionObserver(onIntersectionChange, {
    root,
    rootMargin,
    threshold: typeof amount === "number" ? amount : thresholds[amount]
  });
  elements.forEach((element) => observer2.observe(element));
  return () => observer2.disconnect();
}
var thresholds;
var init_viewport2 = __esm(() => {
  init_es2();
  thresholds = {
    some: 0,
    all: 1
  };
});

// node_modules/framer-motion/dist/es/utils/use-in-view.mjs
function useInView(ref, { root, margin, amount, once = false, initial = false } = {}) {
  const [isInView, setInView] = import_react27.useState(initial);
  import_react27.useEffect(() => {
    if (!ref.current || once && isInView)
      return;
    const onEnter = () => {
      setInView(true);
      return once ? undefined : () => setInView(false);
    };
    const options = {
      root: root && root.current || undefined,
      margin,
      amount
    };
    return inView(ref.current, onEnter, options);
  }, [root, ref, margin, once, amount]);
  return isInView;
}
var import_react27;
var init_use_in_view = __esm(() => {
  import_react27 = __toESM(require_react(), 1);
  init_viewport2();
  "use client";
});

// node_modules/framer-motion/dist/es/index.mjs
var init_es3 = __esm(() => {
  init_AnimatePresence();
  init_proxy();
  init_es2();
  init_use_motion_value_event();
  init_use_motion_value();
  init_use_spring();
  init_use_transform();
  init_es();
  init_use_in_view();
  init_animate();
});

// node_modules/motion/dist/es/react.mjs
var init_react = __esm(() => {
  init_es3();
  init_es3();
});

// node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.js
var mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
var init_mergeClasses = () => {};

// node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.js
var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
var init_toKebabCase = () => {};

// node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.js
var toCamelCase = (string) => string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase());
var init_toCamelCase = () => {};

// node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.js
var toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
var init_toPascalCase = __esm(() => {
  init_toCamelCase();
});

// node_modules/lucide-react/dist/esm/defaultAttributes.js
var defaultAttributes;
var init_defaultAttributes = __esm(() => {
  defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
});

// node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.js
var hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};
var init_hasA11yProp = () => {};

// node_modules/lucide-react/dist/esm/Icon.js
var import_react28, Icon;
var init_Icon = __esm(() => {
  import_react28 = __toESM(require_react(), 1);
  init_defaultAttributes();
  init_hasA11yProp();
  init_mergeClasses();
  Icon = import_react28.forwardRef(({
    color: color2 = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => import_react28.createElement("svg", {
    ref,
    ...defaultAttributes,
    width: size,
    height: size,
    stroke: color2,
    strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
    className: mergeClasses("lucide", className),
    ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
    ...rest
  }, [
    ...iconNode.map(([tag, attrs]) => import_react28.createElement(tag, attrs)),
    ...Array.isArray(children) ? children : [children]
  ]));
});

// node_modules/lucide-react/dist/esm/createLucideIcon.js
var import_react29, createLucideIcon = (iconName, iconNode) => {
  const Component6 = import_react29.forwardRef(({ className, ...props }, ref) => import_react29.createElement(Icon, {
    ref,
    iconNode,
    className: mergeClasses(`lucide-${toKebabCase(toPascalCase(iconName))}`, `lucide-${iconName}`, className),
    ...props
  }));
  Component6.displayName = toPascalCase(iconName);
  return Component6;
};
var init_createLucideIcon = __esm(() => {
  import_react29 = __toESM(require_react(), 1);
  init_mergeClasses();
  init_toKebabCase();
  init_toPascalCase();
  init_Icon();
});

// node_modules/lucide-react/dist/esm/icons/camera.js
var __iconNode, Camera;
var init_camera = __esm(() => {
  init_createLucideIcon();
  __iconNode = [
    [
      "path",
      {
        d: "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",
        key: "18u6gg"
      }
    ],
    ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
  ];
  Camera = createLucideIcon("camera", __iconNode);
});

// node_modules/lucide-react/dist/esm/icons/chart-column.js
var __iconNode2, ChartColumn;
var init_chart_column = __esm(() => {
  init_createLucideIcon();
  __iconNode2 = [
    ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
    ["path", { d: "M18 17V9", key: "2bz60n" }],
    ["path", { d: "M13 17V5", key: "1frdt8" }],
    ["path", { d: "M8 17v-3", key: "17ska0" }]
  ];
  ChartColumn = createLucideIcon("chart-column", __iconNode2);
});

// node_modules/lucide-react/dist/esm/icons/check.js
var __iconNode3, Check;
var init_check = __esm(() => {
  init_createLucideIcon();
  __iconNode3 = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
  Check = createLucideIcon("check", __iconNode3);
});

// node_modules/lucide-react/dist/esm/icons/chevron-down.js
var __iconNode4, ChevronDown;
var init_chevron_down = __esm(() => {
  init_createLucideIcon();
  __iconNode4 = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
  ChevronDown = createLucideIcon("chevron-down", __iconNode4);
});

// node_modules/lucide-react/dist/esm/icons/chevron-left.js
var __iconNode5, ChevronLeft;
var init_chevron_left = __esm(() => {
  init_createLucideIcon();
  __iconNode5 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
  ChevronLeft = createLucideIcon("chevron-left", __iconNode5);
});

// node_modules/lucide-react/dist/esm/icons/chevron-right.js
var __iconNode6, ChevronRight;
var init_chevron_right = __esm(() => {
  init_createLucideIcon();
  __iconNode6 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
  ChevronRight = createLucideIcon("chevron-right", __iconNode6);
});

// node_modules/lucide-react/dist/esm/icons/circle-alert.js
var __iconNode7, CircleAlert;
var init_circle_alert = __esm(() => {
  init_createLucideIcon();
  __iconNode7 = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
    ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
  ];
  CircleAlert = createLucideIcon("circle-alert", __iconNode7);
});

// node_modules/lucide-react/dist/esm/icons/circle-check-big.js
var __iconNode8, CircleCheckBig;
var init_circle_check_big = __esm(() => {
  init_createLucideIcon();
  __iconNode8 = [
    ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
    ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
  ];
  CircleCheckBig = createLucideIcon("circle-check-big", __iconNode8);
});

// node_modules/lucide-react/dist/esm/icons/circle-x.js
var __iconNode9, CircleX;
var init_circle_x = __esm(() => {
  init_createLucideIcon();
  __iconNode9 = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
    ["path", { d: "m9 9 6 6", key: "z0biqf" }]
  ];
  CircleX = createLucideIcon("circle-x", __iconNode9);
});

// node_modules/lucide-react/dist/esm/icons/clock.js
var __iconNode10, Clock;
var init_clock = __esm(() => {
  init_createLucideIcon();
  __iconNode10 = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
  ];
  Clock = createLucideIcon("clock", __iconNode10);
});

// node_modules/lucide-react/dist/esm/icons/database.js
var __iconNode11, Database;
var init_database = __esm(() => {
  init_createLucideIcon();
  __iconNode11 = [
    ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
    ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
    ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
  ];
  Database = createLucideIcon("database", __iconNode11);
});

// node_modules/lucide-react/dist/esm/icons/disc-3.js
var __iconNode12, Disc3;
var init_disc_3 = __esm(() => {
  init_createLucideIcon();
  __iconNode12 = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M6 12c0-1.7.7-3.2 1.8-4.2", key: "oqkarx" }],
    ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
    ["path", { d: "M18 12c0 1.7-.7 3.2-1.8 4.2", key: "1eah9h" }]
  ];
  Disc3 = createLucideIcon("disc-3", __iconNode12);
});

// node_modules/lucide-react/dist/esm/icons/globe.js
var __iconNode13, Globe;
var init_globe = __esm(() => {
  init_createLucideIcon();
  __iconNode13 = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
    ["path", { d: "M2 12h20", key: "9i4pu4" }]
  ];
  Globe = createLucideIcon("globe", __iconNode13);
});

// node_modules/lucide-react/dist/esm/icons/grip-vertical.js
var __iconNode14, GripVertical;
var init_grip_vertical = __esm(() => {
  init_createLucideIcon();
  __iconNode14 = [
    ["circle", { cx: "9", cy: "12", r: "1", key: "1vctgf" }],
    ["circle", { cx: "9", cy: "5", r: "1", key: "hp0tcf" }],
    ["circle", { cx: "9", cy: "19", r: "1", key: "fkjjf6" }],
    ["circle", { cx: "15", cy: "12", r: "1", key: "1tmaij" }],
    ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
    ["circle", { cx: "15", cy: "19", r: "1", key: "f4zoj3" }]
  ];
  GripVertical = createLucideIcon("grip-vertical", __iconNode14);
});

// node_modules/lucide-react/dist/esm/icons/headphones.js
var __iconNode15, Headphones;
var init_headphones = __esm(() => {
  init_createLucideIcon();
  __iconNode15 = [
    [
      "path",
      {
        d: "M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3",
        key: "1xhozi"
      }
    ]
  ];
  Headphones = createLucideIcon("headphones", __iconNode15);
});

// node_modules/lucide-react/dist/esm/icons/heart.js
var __iconNode16, Heart;
var init_heart = __esm(() => {
  init_createLucideIcon();
  __iconNode16 = [
    [
      "path",
      {
        d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
        key: "mvr1a0"
      }
    ]
  ];
  Heart = createLucideIcon("heart", __iconNode16);
});

// node_modules/lucide-react/dist/esm/icons/house.js
var __iconNode17, House;
var init_house = __esm(() => {
  init_createLucideIcon();
  __iconNode17 = [
    ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
    [
      "path",
      {
        d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
        key: "r6nss1"
      }
    ]
  ];
  House = createLucideIcon("house", __iconNode17);
});

// node_modules/lucide-react/dist/esm/icons/info.js
var __iconNode18, Info;
var init_info = __esm(() => {
  init_createLucideIcon();
  __iconNode18 = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M12 16v-4", key: "1dtifu" }],
    ["path", { d: "M12 8h.01", key: "e9boi3" }]
  ];
  Info = createLucideIcon("info", __iconNode18);
});

// node_modules/lucide-react/dist/esm/icons/library.js
var __iconNode19, Library;
var init_library = __esm(() => {
  init_createLucideIcon();
  __iconNode19 = [
    ["path", { d: "m16 6 4 14", key: "ji33uf" }],
    ["path", { d: "M12 6v14", key: "1n7gus" }],
    ["path", { d: "M8 8v12", key: "1gg7y9" }],
    ["path", { d: "M4 4v16", key: "6qkkli" }]
  ];
  Library = createLucideIcon("library", __iconNode19);
});

// node_modules/lucide-react/dist/esm/icons/list-music.js
var __iconNode20, ListMusic;
var init_list_music = __esm(() => {
  init_createLucideIcon();
  __iconNode20 = [
    ["path", { d: "M16 5H3", key: "m91uny" }],
    ["path", { d: "M11 12H3", key: "51ecnj" }],
    ["path", { d: "M11 19H3", key: "zflm78" }],
    ["path", { d: "M21 16V5", key: "yxg4q8" }],
    ["circle", { cx: "18", cy: "16", r: "3", key: "1hluhg" }]
  ];
  ListMusic = createLucideIcon("list-music", __iconNode20);
});

// node_modules/lucide-react/dist/esm/icons/list-plus.js
var __iconNode21, ListPlus;
var init_list_plus = __esm(() => {
  init_createLucideIcon();
  __iconNode21 = [
    ["path", { d: "M16 5H3", key: "m91uny" }],
    ["path", { d: "M11 12H3", key: "51ecnj" }],
    ["path", { d: "M16 19H3", key: "zzsher" }],
    ["path", { d: "M18 9v6", key: "1twb98" }],
    ["path", { d: "M21 12h-6", key: "bt1uis" }]
  ];
  ListPlus = createLucideIcon("list-plus", __iconNode21);
});

// node_modules/lucide-react/dist/esm/icons/loader-circle.js
var __iconNode22, LoaderCircle;
var init_loader_circle = __esm(() => {
  init_createLucideIcon();
  __iconNode22 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
  LoaderCircle = createLucideIcon("loader-circle", __iconNode22);
});

// node_modules/lucide-react/dist/esm/icons/log-out.js
var __iconNode23, LogOut;
var init_log_out = __esm(() => {
  init_createLucideIcon();
  __iconNode23 = [
    ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
    ["path", { d: "M21 12H9", key: "dn1m92" }],
    ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
  ];
  LogOut = createLucideIcon("log-out", __iconNode23);
});

// node_modules/lucide-react/dist/esm/icons/maximize-2.js
var __iconNode24, Maximize2;
var init_maximize_2 = __esm(() => {
  init_createLucideIcon();
  __iconNode24 = [
    ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
    ["path", { d: "m21 3-7 7", key: "1l2asr" }],
    ["path", { d: "m3 21 7-7", key: "tjx5ai" }],
    ["path", { d: "M9 21H3v-6", key: "wtvkvv" }]
  ];
  Maximize2 = createLucideIcon("maximize-2", __iconNode24);
});

// node_modules/lucide-react/dist/esm/icons/mic-vocal.js
var __iconNode25, MicVocal;
var init_mic_vocal = __esm(() => {
  init_createLucideIcon();
  __iconNode25 = [
    [
      "path",
      {
        d: "m11 7.601-5.994 8.19a1 1 0 0 0 .1 1.298l.817.818a1 1 0 0 0 1.314.087L15.09 12",
        key: "80a601"
      }
    ],
    [
      "path",
      {
        d: "M16.5 21.174C15.5 20.5 14.372 20 13 20c-2.058 0-3.928 2.356-6 2-2.072-.356-2.775-3.369-1.5-4.5",
        key: "j0ngtp"
      }
    ],
    ["circle", { cx: "16", cy: "7", r: "5", key: "d08jfb" }]
  ];
  MicVocal = createLucideIcon("mic-vocal", __iconNode25);
});

// node_modules/lucide-react/dist/esm/icons/moon.js
var __iconNode26, Moon;
var init_moon = __esm(() => {
  init_createLucideIcon();
  __iconNode26 = [
    [
      "path",
      {
        d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
        key: "kfwtm"
      }
    ]
  ];
  Moon = createLucideIcon("moon", __iconNode26);
});

// node_modules/lucide-react/dist/esm/icons/music.js
var __iconNode27, Music;
var init_music = __esm(() => {
  init_createLucideIcon();
  __iconNode27 = [
    ["path", { d: "M9 18V5l12-2v13", key: "1jmyc2" }],
    ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
    ["circle", { cx: "18", cy: "16", r: "3", key: "1hluhg" }]
  ];
  Music = createLucideIcon("music", __iconNode27);
});

// node_modules/lucide-react/dist/esm/icons/pause.js
var __iconNode28, Pause;
var init_pause = __esm(() => {
  init_createLucideIcon();
  __iconNode28 = [
    ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
    ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
  ];
  Pause = createLucideIcon("pause", __iconNode28);
});

// node_modules/lucide-react/dist/esm/icons/play.js
var __iconNode29, Play;
var init_play = __esm(() => {
  init_createLucideIcon();
  __iconNode29 = [
    [
      "path",
      {
        d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
        key: "10ikf1"
      }
    ]
  ];
  Play = createLucideIcon("play", __iconNode29);
});

// node_modules/lucide-react/dist/esm/icons/plus.js
var __iconNode30, Plus;
var init_plus = __esm(() => {
  init_createLucideIcon();
  __iconNode30 = [
    ["path", { d: "M5 12h14", key: "1ays0h" }],
    ["path", { d: "M12 5v14", key: "s699le" }]
  ];
  Plus = createLucideIcon("plus", __iconNode30);
});

// node_modules/lucide-react/dist/esm/icons/radio.js
var __iconNode31, Radio;
var init_radio = __esm(() => {
  init_createLucideIcon();
  __iconNode31 = [
    ["path", { d: "M16.247 7.761a6 6 0 0 1 0 8.478", key: "1fwjs5" }],
    ["path", { d: "M19.075 4.933a10 10 0 0 1 0 14.134", key: "ehdyv1" }],
    ["path", { d: "M4.925 19.067a10 10 0 0 1 0-14.134", key: "1q22gi" }],
    ["path", { d: "M7.753 16.239a6 6 0 0 1 0-8.478", key: "r2q7qm" }],
    ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }]
  ];
  Radio = createLucideIcon("radio", __iconNode31);
});

// node_modules/lucide-react/dist/esm/icons/repeat-1.js
var __iconNode32, Repeat1;
var init_repeat_1 = __esm(() => {
  init_createLucideIcon();
  __iconNode32 = [
    ["path", { d: "m17 2 4 4-4 4", key: "nntrym" }],
    ["path", { d: "M3 11v-1a4 4 0 0 1 4-4h14", key: "84bu3i" }],
    ["path", { d: "m7 22-4-4 4-4", key: "1wqhfi" }],
    ["path", { d: "M21 13v1a4 4 0 0 1-4 4H3", key: "1rx37r" }],
    ["path", { d: "M11 10h1v4", key: "70cz1p" }]
  ];
  Repeat1 = createLucideIcon("repeat-1", __iconNode32);
});

// node_modules/lucide-react/dist/esm/icons/repeat.js
var __iconNode33, Repeat;
var init_repeat = __esm(() => {
  init_createLucideIcon();
  __iconNode33 = [
    ["path", { d: "m17 2 4 4-4 4", key: "nntrym" }],
    ["path", { d: "M3 11v-1a4 4 0 0 1 4-4h14", key: "84bu3i" }],
    ["path", { d: "m7 22-4-4 4-4", key: "1wqhfi" }],
    ["path", { d: "M21 13v1a4 4 0 0 1-4 4H3", key: "1rx37r" }]
  ];
  Repeat = createLucideIcon("repeat", __iconNode33);
});

// node_modules/lucide-react/dist/esm/icons/search.js
var __iconNode34, Search;
var init_search = __esm(() => {
  init_createLucideIcon();
  __iconNode34 = [
    ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
    ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
  ];
  Search = createLucideIcon("search", __iconNode34);
});

// node_modules/lucide-react/dist/esm/icons/settings.js
var __iconNode35, Settings;
var init_settings = __esm(() => {
  init_createLucideIcon();
  __iconNode35 = [
    [
      "path",
      {
        d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
        key: "1i5ecw"
      }
    ],
    ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
  ];
  Settings = createLucideIcon("settings", __iconNode35);
});

// node_modules/lucide-react/dist/esm/icons/share-2.js
var __iconNode36, Share2;
var init_share_2 = __esm(() => {
  init_createLucideIcon();
  __iconNode36 = [
    ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }],
    ["circle", { cx: "6", cy: "12", r: "3", key: "w7nqdw" }],
    ["circle", { cx: "18", cy: "19", r: "3", key: "1xt0gg" }],
    ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49", key: "47mynk" }],
    ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49", key: "1n3mei" }]
  ];
  Share2 = createLucideIcon("share-2", __iconNode36);
});

// node_modules/lucide-react/dist/esm/icons/shield.js
var __iconNode37, Shield;
var init_shield = __esm(() => {
  init_createLucideIcon();
  __iconNode37 = [
    [
      "path",
      {
        d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        key: "oel41y"
      }
    ]
  ];
  Shield = createLucideIcon("shield", __iconNode37);
});

// node_modules/lucide-react/dist/esm/icons/shuffle.js
var __iconNode38, Shuffle;
var init_shuffle = __esm(() => {
  init_createLucideIcon();
  __iconNode38 = [
    ["path", { d: "m18 14 4 4-4 4", key: "10pe0f" }],
    ["path", { d: "m18 2 4 4-4 4", key: "pucp1d" }],
    ["path", { d: "M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22", key: "1ailkh" }],
    ["path", { d: "M2 6h1.972a4 4 0 0 1 3.6 2.2", key: "km57vx" }],
    ["path", { d: "M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45", key: "os18l9" }]
  ];
  Shuffle = createLucideIcon("shuffle", __iconNode38);
});

// node_modules/lucide-react/dist/esm/icons/skip-back.js
var __iconNode39, SkipBack;
var init_skip_back = __esm(() => {
  init_createLucideIcon();
  __iconNode39 = [
    [
      "path",
      {
        d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
        key: "15892j"
      }
    ],
    ["path", { d: "M3 20V4", key: "1ptbpl" }]
  ];
  SkipBack = createLucideIcon("skip-back", __iconNode39);
});

// node_modules/lucide-react/dist/esm/icons/skip-forward.js
var __iconNode40, SkipForward;
var init_skip_forward = __esm(() => {
  init_createLucideIcon();
  __iconNode40 = [
    ["path", { d: "M21 4v16", key: "7j8fe9" }],
    [
      "path",
      {
        d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
        key: "zs4d6"
      }
    ]
  ];
  SkipForward = createLucideIcon("skip-forward", __iconNode40);
});

// node_modules/lucide-react/dist/esm/icons/sliders-vertical.js
var __iconNode41, SlidersVertical;
var init_sliders_vertical = __esm(() => {
  init_createLucideIcon();
  __iconNode41 = [
    ["path", { d: "M10 8h4", key: "1sr2af" }],
    ["path", { d: "M12 21v-9", key: "17s77i" }],
    ["path", { d: "M12 8V3", key: "13r4qs" }],
    ["path", { d: "M17 16h4", key: "h1uq16" }],
    ["path", { d: "M19 12V3", key: "o1uvq1" }],
    ["path", { d: "M19 21v-5", key: "qua636" }],
    ["path", { d: "M3 14h4", key: "bcjad9" }],
    ["path", { d: "M5 10V3", key: "cb8scm" }],
    ["path", { d: "M5 21v-7", key: "1w1uti" }]
  ];
  SlidersVertical = createLucideIcon("sliders-vertical", __iconNode41);
});

// node_modules/lucide-react/dist/esm/icons/sparkles.js
var __iconNode42, Sparkles;
var init_sparkles = __esm(() => {
  init_createLucideIcon();
  __iconNode42 = [
    [
      "path",
      {
        d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
        key: "1s2grr"
      }
    ],
    ["path", { d: "M20 2v4", key: "1rf3ol" }],
    ["path", { d: "M22 4h-4", key: "gwowj6" }],
    ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }]
  ];
  Sparkles = createLucideIcon("sparkles", __iconNode42);
});

// node_modules/lucide-react/dist/esm/icons/trash-2.js
var __iconNode43, Trash2;
var init_trash_2 = __esm(() => {
  init_createLucideIcon();
  __iconNode43 = [
    ["path", { d: "M10 11v6", key: "nco0om" }],
    ["path", { d: "M14 11v6", key: "outv1u" }],
    ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
    ["path", { d: "M3 6h18", key: "d0wm0j" }],
    ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
  ];
  Trash2 = createLucideIcon("trash-2", __iconNode43);
});

// node_modules/lucide-react/dist/esm/icons/trending-up.js
var __iconNode44, TrendingUp;
var init_trending_up = __esm(() => {
  init_createLucideIcon();
  __iconNode44 = [
    ["path", { d: "M16 7h6v6", key: "box55l" }],
    ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
  ];
  TrendingUp = createLucideIcon("trending-up", __iconNode44);
});

// node_modules/lucide-react/dist/esm/icons/user.js
var __iconNode45, User;
var init_user = __esm(() => {
  init_createLucideIcon();
  __iconNode45 = [
    ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
    ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
  ];
  User = createLucideIcon("user", __iconNode45);
});

// node_modules/lucide-react/dist/esm/icons/users.js
var __iconNode46, Users;
var init_users = __esm(() => {
  init_createLucideIcon();
  __iconNode46 = [
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
    ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
    ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
    ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
  ];
  Users = createLucideIcon("users", __iconNode46);
});

// node_modules/lucide-react/dist/esm/icons/volume-2.js
var __iconNode47, Volume2;
var init_volume_2 = __esm(() => {
  init_createLucideIcon();
  __iconNode47 = [
    [
      "path",
      {
        d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
        key: "uqj9uw"
      }
    ],
    ["path", { d: "M16 9a5 5 0 0 1 0 6", key: "1q6k2b" }],
    ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728", key: "ijwkga" }]
  ];
  Volume2 = createLucideIcon("volume-2", __iconNode47);
});

// node_modules/lucide-react/dist/esm/icons/volume-x.js
var __iconNode48, VolumeX;
var init_volume_x = __esm(() => {
  init_createLucideIcon();
  __iconNode48 = [
    [
      "path",
      {
        d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
        key: "uqj9uw"
      }
    ],
    ["line", { x1: "22", x2: "16", y1: "9", y2: "15", key: "1ewh16" }],
    ["line", { x1: "16", x2: "22", y1: "9", y2: "15", key: "5ykzw1" }]
  ];
  VolumeX = createLucideIcon("volume-x", __iconNode48);
});

// node_modules/lucide-react/dist/esm/icons/x.js
var __iconNode49, X;
var init_x = __esm(() => {
  init_createLucideIcon();
  __iconNode49 = [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
  ];
  X = createLucideIcon("x", __iconNode49);
});

// node_modules/lucide-react/dist/esm/lucide-react.js
var init_lucide_react = __esm(() => {
  init_chart_column();
  init_circle_alert();
  init_circle_check_big();
  init_circle_x();
  init_house();
  init_loader_circle();
  init_mic_vocal();
  init_sliders_vertical();
  init_sparkles();
  init_camera();
  init_check();
  init_chevron_down();
  init_chevron_left();
  init_chevron_right();
  init_clock();
  init_database();
  init_disc_3();
  init_globe();
  init_grip_vertical();
  init_headphones();
  init_heart();
  init_info();
  init_library();
  init_list_music();
  init_list_plus();
  init_log_out();
  init_maximize_2();
  init_moon();
  init_music();
  init_pause();
  init_play();
  init_plus();
  init_radio();
  init_repeat_1();
  init_repeat();
  init_search();
  init_settings();
  init_share_2();
  init_shield();
  init_shuffle();
  init_skip_forward();
  init_skip_back();
  init_trash_2();
  init_trending_up();
  init_user();
  init_users();
  init_volume_2();
  init_volume_x();
  init_x();
});

// node_modules/axios/lib/helpers/bind.js
function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

// node_modules/axios/lib/utils.js
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
function isArrayBufferView(val) {
  let result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}
function getGlobal() {
  if (typeof globalThis !== "undefined")
    return globalThis;
  if (typeof self !== "undefined")
    return self;
  if (typeof window !== "undefined")
    return window;
  if (typeof global !== "undefined")
    return global;
  return {};
}
function forEach(obj, fn, { allOwnKeys = false } = {}) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  let i;
  let l;
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (i = 0, l = obj.length;i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    if (isBuffer(obj)) {
      return;
    }
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;
    for (i = 0;i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}
function findKey(obj, key) {
  if (isBuffer(obj)) {
    return null;
  }
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}
function merge() {
  const { caseless, skipUndefined } = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return;
    }
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else if (!skipUndefined || !isUndefined(val)) {
      result[targetKey] = val;
    }
  };
  for (let i = 0, l = arguments.length;i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
}
var toString, getPrototypeOf, iterator, toStringTag, kindOf, kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type;
}, typeOfTest = (type) => (thing) => typeof thing === type, isArray, isUndefined, isArrayBuffer, isString, isFunction, isNumber2, isObject2 = (thing) => thing !== null && typeof thing === "object", isBoolean = (thing) => thing === true || thing === false, isPlainObject = (val) => {
  if (kindOf(val) !== "object") {
    return false;
  }
  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(toStringTag in val) && !(iterator in val);
}, isEmptyObject = (val) => {
  if (!isObject2(val) || isBuffer(val)) {
    return false;
  }
  try {
    return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
  } catch (e) {
    return false;
  }
}, isDate, isFile, isReactNativeBlob = (value) => {
  return !!(value && typeof value.uri !== "undefined");
}, isReactNative = (formData) => formData && typeof formData.getParts !== "undefined", isBlob, isFileList, isStream = (val) => isObject2(val) && isFunction(val.pipe), G, FormDataCtor, isFormData = (thing) => {
  let kind;
  return thing && (FormDataCtor && thing instanceof FormDataCtor || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
}, isURLSearchParams, isReadableStream, isRequest, isResponse, isHeaders, trim = (str) => {
  return str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
}, _global, isContextDefined = (context) => !isUndefined(context) && context !== _global, extend = (a, b, thisArg, { allOwnKeys } = {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      Object.defineProperty(a, key, {
        value: bind(val, thisArg),
        writable: true,
        enumerable: true,
        configurable: true
      });
    } else {
      Object.defineProperty(a, key, {
        value: val,
        writable: true,
        enumerable: true,
        configurable: true
      });
    }
  }, { allOwnKeys });
  return a;
}, stripBOM = (content) => {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
}, inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  Object.defineProperty(constructor.prototype, "constructor", {
    value: constructor,
    writable: true,
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(constructor, "super", {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
}, toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};
  destObj = destObj || {};
  if (sourceObj == null)
    return destObj;
  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
  return destObj;
}, endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}, toArray = (thing) => {
  if (!thing)
    return null;
  if (isArray(thing))
    return thing;
  let i = thing.length;
  if (!isNumber2(i))
    return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}, isTypedArray, forEachEntry = (obj, fn) => {
  const generator = obj && obj[iterator];
  const _iterator = generator.call(obj);
  let result;
  while ((result = _iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
}, matchAll = (regExp, str) => {
  let matches;
  const arr = [];
  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }
  return arr;
}, isHTMLForm, toCamelCase2 = (str) => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function replacer(m2, p1, p2) {
    return p1.toUpperCase() + p2;
  });
}, hasOwnProperty, isRegExp, reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};
  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });
  Object.defineProperties(obj, reducedDescriptors);
}, freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
      return false;
    }
    const value = obj[name];
    if (!isFunction(value))
      return;
    descriptor.enumerable = false;
    if ("writable" in descriptor) {
      descriptor.writable = false;
      return;
    }
    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error("Can not rewrite read-only method '" + name + "'");
      };
    }
  });
}, toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};
  const define = (arr) => {
    arr.forEach((value) => {
      obj[value] = true;
    });
  };
  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
  return obj;
}, noop2 = () => {}, toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
}, toJSONObject = (obj) => {
  const stack = new Array(10);
  const visit = (source, i) => {
    if (isObject2(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }
      if (isBuffer(source)) {
        return source;
      }
      if (!("toJSON" in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};
        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });
        stack[i] = undefined;
        return target;
      }
    }
    return source;
  };
  return visit(obj, 0);
}, isAsyncFn, isThenable = (thing) => thing && (isObject2(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch), _setImmediate, asap, isIterable = (thing) => thing != null && isFunction(thing[iterator]), utils_default;
var init_utils5 = __esm(() => {
  ({ toString } = Object.prototype);
  ({ getPrototypeOf } = Object);
  ({ iterator, toStringTag } = Symbol);
  kindOf = ((cache) => (thing) => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  })(Object.create(null));
  ({ isArray } = Array);
  isUndefined = typeOfTest("undefined");
  isArrayBuffer = kindOfTest("ArrayBuffer");
  isString = typeOfTest("string");
  isFunction = typeOfTest("function");
  isNumber2 = typeOfTest("number");
  isDate = kindOfTest("Date");
  isFile = kindOfTest("File");
  isBlob = kindOfTest("Blob");
  isFileList = kindOfTest("FileList");
  G = getGlobal();
  FormDataCtor = typeof G.FormData !== "undefined" ? G.FormData : undefined;
  isURLSearchParams = kindOfTest("URLSearchParams");
  [isReadableStream, isRequest, isResponse, isHeaders] = [
    "ReadableStream",
    "Request",
    "Response",
    "Headers"
  ].map(kindOfTest);
  _global = (() => {
    if (typeof globalThis !== "undefined")
      return globalThis;
    return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
  })();
  isTypedArray = ((TypedArray) => {
    return (thing) => {
      return TypedArray && thing instanceof TypedArray;
    };
  })(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
  isHTMLForm = kindOfTest("HTMLFormElement");
  hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
  isRegExp = kindOfTest("RegExp");
  isAsyncFn = kindOfTest("AsyncFunction");
  _setImmediate = ((setImmediateSupported, postMessageSupported) => {
    if (setImmediateSupported) {
      return setImmediate;
    }
    return postMessageSupported ? ((token, callbacks) => {
      _global.addEventListener("message", ({ source, data: data2 }) => {
        if (source === _global && data2 === token) {
          callbacks.length && callbacks.shift()();
        }
      }, false);
      return (cb) => {
        callbacks.push(cb);
        _global.postMessage(token, "*");
      };
    })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
  })(typeof setImmediate === "function", isFunction(_global.postMessage));
  asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
  utils_default = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber: isNumber2,
    isBoolean,
    isObject: isObject2,
    isPlainObject,
    isEmptyObject,
    isReadableStream,
    isRequest,
    isResponse,
    isHeaders,
    isUndefined,
    isDate,
    isFile,
    isReactNativeBlob,
    isReactNative,
    isBlob,
    isRegExp,
    isFunction,
    isStream,
    isURLSearchParams,
    isTypedArray,
    isFileList,
    forEach,
    merge,
    extend,
    trim,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray,
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty,
    hasOwnProp: hasOwnProperty,
    reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase: toCamelCase2,
    noop: noop2,
    toFiniteNumber,
    findKey,
    global: _global,
    isContextDefined,
    isSpecCompliantForm,
    toJSONObject,
    isAsyncFn,
    isThenable,
    setImmediate: _setImmediate,
    asap,
    isIterable
  };
});

// node_modules/axios/lib/core/AxiosError.js
var AxiosError, AxiosError_default;
var init_AxiosError = __esm(() => {
  init_utils5();
  AxiosError = class AxiosError extends Error {
    static from(error, code, config, request, response, customProps) {
      const axiosError = new AxiosError(error.message, code || error.code, config, request, response);
      axiosError.cause = error;
      axiosError.name = error.name;
      if (error.status != null && axiosError.status == null) {
        axiosError.status = error.status;
      }
      customProps && Object.assign(axiosError, customProps);
      return axiosError;
    }
    constructor(message, code, config, request, response) {
      super(message);
      Object.defineProperty(this, "message", {
        value: message,
        enumerable: true,
        writable: true,
        configurable: true
      });
      this.name = "AxiosError";
      this.isAxiosError = true;
      code && (this.code = code);
      config && (this.config = config);
      request && (this.request = request);
      if (response) {
        this.response = response;
        this.status = response.status;
      }
    }
    toJSON() {
      return {
        message: this.message,
        name: this.name,
        description: this.description,
        number: this.number,
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        config: utils_default.toJSONObject(this.config),
        code: this.code,
        status: this.status
      };
    }
  };
  AxiosError.ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE";
  AxiosError.ERR_BAD_OPTION = "ERR_BAD_OPTION";
  AxiosError.ECONNABORTED = "ECONNABORTED";
  AxiosError.ETIMEDOUT = "ETIMEDOUT";
  AxiosError.ERR_NETWORK = "ERR_NETWORK";
  AxiosError.ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS";
  AxiosError.ERR_DEPRECATED = "ERR_DEPRECATED";
  AxiosError.ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE";
  AxiosError.ERR_BAD_REQUEST = "ERR_BAD_REQUEST";
  AxiosError.ERR_CANCELED = "ERR_CANCELED";
  AxiosError.ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT";
  AxiosError.ERR_INVALID_URL = "ERR_INVALID_URL";
  AxiosError_default = AxiosError;
});

// node_modules/axios/lib/helpers/null.js
var null_default = null;

// node_modules/axios/lib/helpers/toFormData.js
function isVisitable(thing) {
  return utils_default.isPlainObject(thing) || utils_default.isArray(thing);
}
function removeBrackets(key) {
  return utils_default.endsWith(key, "[]") ? key.slice(0, -2) : key;
}
function renderKey(path, key, dots) {
  if (!path)
    return key;
  return path.concat(key).map(function each(token, i) {
    token = removeBrackets(token);
    return !dots && i ? "[" + token + "]" : token;
  }).join(dots ? "." : "");
}
function isFlatArray(arr) {
  return utils_default.isArray(arr) && !arr.some(isVisitable);
}
function toFormData(obj, formData, options) {
  if (!utils_default.isObject(obj)) {
    throw new TypeError("target must be an object");
  }
  formData = formData || new (null_default || FormData);
  options = utils_default.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    return !utils_default.isUndefined(source[option]);
  });
  const metaTokens = options.metaTokens;
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
  const useBlob = _Blob && utils_default.isSpecCompliantForm(formData);
  if (!utils_default.isFunction(visitor)) {
    throw new TypeError("visitor must be a function");
  }
  function convertValue(value) {
    if (value === null)
      return "";
    if (utils_default.isDate(value)) {
      return value.toISOString();
    }
    if (utils_default.isBoolean(value)) {
      return value.toString();
    }
    if (!useBlob && utils_default.isBlob(value)) {
      throw new AxiosError_default("Blob is not supported. Use a Buffer instead.");
    }
    if (utils_default.isArrayBuffer(value) || utils_default.isTypedArray(value)) {
      return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
    }
    return value;
  }
  function defaultVisitor(value, key, path) {
    let arr = value;
    if (utils_default.isReactNative(formData) && utils_default.isReactNativeBlob(value)) {
      formData.append(renderKey(path, key, dots), convertValue(value));
      return false;
    }
    if (value && !path && typeof value === "object") {
      if (utils_default.endsWith(key, "{}")) {
        key = metaTokens ? key : key.slice(0, -2);
        value = JSON.stringify(value);
      } else if (utils_default.isArray(value) && isFlatArray(value) || (utils_default.isFileList(value) || utils_default.endsWith(key, "[]")) && (arr = utils_default.toArray(value))) {
        key = removeBrackets(key);
        arr.forEach(function each(el, index) {
          !(utils_default.isUndefined(el) || el === null) && formData.append(indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]", convertValue(el));
        });
        return false;
      }
    }
    if (isVisitable(value)) {
      return true;
    }
    formData.append(renderKey(path, key, dots), convertValue(value));
    return false;
  }
  const stack = [];
  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });
  function build(value, path) {
    if (utils_default.isUndefined(value))
      return;
    if (stack.indexOf(value) !== -1) {
      throw Error("Circular reference detected in " + path.join("."));
    }
    stack.push(value);
    utils_default.forEach(value, function each(el, key) {
      const result = !(utils_default.isUndefined(el) || el === null) && visitor.call(formData, el, utils_default.isString(key) ? key.trim() : key, path, exposedHelpers);
      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });
    stack.pop();
  }
  if (!utils_default.isObject(obj)) {
    throw new TypeError("data must be an object");
  }
  build(obj);
  return formData;
}
var predicates, toFormData_default;
var init_toFormData = __esm(() => {
  init_utils5();
  init_AxiosError();
  predicates = utils_default.toFlatObject(utils_default, {}, null, function filter2(prop) {
    return /^is[A-Z]/.test(prop);
  });
  toFormData_default = toFormData;
});

// node_modules/axios/lib/helpers/AxiosURLSearchParams.js
function encode(str) {
  const charMap = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\x00"
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}
function AxiosURLSearchParams(params, options) {
  this._pairs = [];
  params && toFormData_default(params, this, options);
}
var prototype, AxiosURLSearchParams_default;
var init_AxiosURLSearchParams = __esm(() => {
  init_toFormData();
  prototype = AxiosURLSearchParams.prototype;
  prototype.append = function append(name, value) {
    this._pairs.push([name, value]);
  };
  prototype.toString = function toString2(encoder) {
    const _encode = encoder ? function(value) {
      return encoder.call(this, value, encode);
    } : encode;
    return this._pairs.map(function each(pair) {
      return _encode(pair[0]) + "=" + _encode(pair[1]);
    }, "").join("&");
  };
  AxiosURLSearchParams_default = AxiosURLSearchParams;
});

// node_modules/axios/lib/helpers/buildURL.js
function encode2(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
}
function buildURL(url, params, options) {
  if (!params) {
    return url;
  }
  const _encode = options && options.encode || encode2;
  const _options = utils_default.isFunction(options) ? {
    serialize: options
  } : options;
  const serializeFn = _options && _options.serialize;
  let serializedParams;
  if (serializeFn) {
    serializedParams = serializeFn(params, _options);
  } else {
    serializedParams = utils_default.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams_default(params, _options).toString(_encode);
  }
  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url;
}
var init_buildURL = __esm(() => {
  init_utils5();
  init_AxiosURLSearchParams();
});

// node_modules/axios/lib/core/InterceptorManager.js
class InterceptorManager {
  constructor() {
    this.handlers = [];
  }
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }
  eject(id3) {
    if (this.handlers[id3]) {
      this.handlers[id3] = null;
    }
  }
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }
  forEach(fn) {
    utils_default.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}
var InterceptorManager_default;
var init_InterceptorManager = __esm(() => {
  init_utils5();
  InterceptorManager_default = InterceptorManager;
});

// node_modules/axios/lib/defaults/transitional.js
var transitional_default;
var init_transitional = __esm(() => {
  transitional_default = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false,
    legacyInterceptorReqResOrdering: true
  };
});

// node_modules/axios/lib/platform/browser/classes/URLSearchParams.js
var URLSearchParams_default;
var init_URLSearchParams = __esm(() => {
  init_AxiosURLSearchParams();
  URLSearchParams_default = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams_default;
});

// node_modules/axios/lib/platform/browser/classes/FormData.js
var FormData_default;
var init_FormData = __esm(() => {
  FormData_default = typeof FormData !== "undefined" ? FormData : null;
});

// node_modules/axios/lib/platform/browser/classes/Blob.js
var Blob_default;
var init_Blob = __esm(() => {
  Blob_default = typeof Blob !== "undefined" ? Blob : null;
});

// node_modules/axios/lib/platform/browser/index.js
var browser_default;
var init_browser = __esm(() => {
  init_URLSearchParams();
  init_FormData();
  init_Blob();
  browser_default = {
    isBrowser: true,
    classes: {
      URLSearchParams: URLSearchParams_default,
      FormData: FormData_default,
      Blob: Blob_default
    },
    protocols: ["http", "https", "file", "blob", "url", "data"]
  };
});

// node_modules/axios/lib/platform/common/utils.js
var exports_utils = {};
__export(exports_utils, {
  origin: () => origin,
  navigator: () => _navigator,
  hasStandardBrowserWebWorkerEnv: () => hasStandardBrowserWebWorkerEnv,
  hasStandardBrowserEnv: () => hasStandardBrowserEnv,
  hasBrowserEnv: () => hasBrowserEnv
});
var hasBrowserEnv, _navigator, hasStandardBrowserEnv, hasStandardBrowserWebWorkerEnv, origin;
var init_utils6 = __esm(() => {
  hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
  _navigator = typeof navigator === "object" && navigator || undefined;
  hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
  hasStandardBrowserWebWorkerEnv = (() => {
    return typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
  })();
  origin = hasBrowserEnv && window.location.href || "http://localhost";
});

// node_modules/axios/lib/platform/index.js
var platform_default;
var init_platform = __esm(() => {
  init_browser();
  init_utils6();
  platform_default = {
    ...exports_utils,
    ...browser_default
  };
});

// node_modules/axios/lib/helpers/toURLEncodedForm.js
function toURLEncodedForm(data2, options) {
  return toFormData_default(data2, new platform_default.classes.URLSearchParams, {
    visitor: function(value, key, path, helpers) {
      if (platform_default.isNode && utils_default.isBuffer(value)) {
        this.append(key, value.toString("base64"));
        return false;
      }
      return helpers.defaultVisitor.apply(this, arguments);
    },
    ...options
  });
}
var init_toURLEncodedForm = __esm(() => {
  init_utils5();
  init_toFormData();
  init_platform();
});

// node_modules/axios/lib/helpers/formDataToJSON.js
function parsePropPath(name) {
  return utils_default.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
    return match[0] === "[]" ? "" : match[1] || match[0];
  });
}
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0;i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];
    if (name === "__proto__")
      return true;
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils_default.isArray(target) ? target.length : name;
    if (isLast) {
      if (utils_default.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }
      return !isNumericKey;
    }
    if (!target[name] || !utils_default.isObject(target[name])) {
      target[name] = [];
    }
    const result = buildPath(path, value, target[name], index);
    if (result && utils_default.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }
    return !isNumericKey;
  }
  if (utils_default.isFormData(formData) && utils_default.isFunction(formData.entries)) {
    const obj = {};
    utils_default.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });
    return obj;
  }
  return null;
}
var formDataToJSON_default;
var init_formDataToJSON = __esm(() => {
  init_utils5();
  formDataToJSON_default = formDataToJSON;
});

// node_modules/axios/lib/defaults/index.js
function stringifySafely(rawValue, parser, encoder) {
  if (utils_default.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils_default.trim(rawValue);
    } catch (e) {
      if (e.name !== "SyntaxError") {
        throw e;
      }
    }
  }
  return (encoder || JSON.stringify)(rawValue);
}
var defaults, defaults_default;
var init_defaults2 = __esm(() => {
  init_utils5();
  init_AxiosError();
  init_transitional();
  init_toFormData();
  init_toURLEncodedForm();
  init_platform();
  init_formDataToJSON();
  defaults = {
    transitional: transitional_default,
    adapter: ["xhr", "http", "fetch"],
    transformRequest: [
      function transformRequest(data2, headers) {
        const contentType = headers.getContentType() || "";
        const hasJSONContentType = contentType.indexOf("application/json") > -1;
        const isObjectPayload = utils_default.isObject(data2);
        if (isObjectPayload && utils_default.isHTMLForm(data2)) {
          data2 = new FormData(data2);
        }
        const isFormData2 = utils_default.isFormData(data2);
        if (isFormData2) {
          return hasJSONContentType ? JSON.stringify(formDataToJSON_default(data2)) : data2;
        }
        if (utils_default.isArrayBuffer(data2) || utils_default.isBuffer(data2) || utils_default.isStream(data2) || utils_default.isFile(data2) || utils_default.isBlob(data2) || utils_default.isReadableStream(data2)) {
          return data2;
        }
        if (utils_default.isArrayBufferView(data2)) {
          return data2.buffer;
        }
        if (utils_default.isURLSearchParams(data2)) {
          headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
          return data2.toString();
        }
        let isFileList2;
        if (isObjectPayload) {
          if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
            return toURLEncodedForm(data2, this.formSerializer).toString();
          }
          if ((isFileList2 = utils_default.isFileList(data2)) || contentType.indexOf("multipart/form-data") > -1) {
            const _FormData = this.env && this.env.FormData;
            return toFormData_default(isFileList2 ? { "files[]": data2 } : data2, _FormData && new _FormData, this.formSerializer);
          }
        }
        if (isObjectPayload || hasJSONContentType) {
          headers.setContentType("application/json", false);
          return stringifySafely(data2);
        }
        return data2;
      }
    ],
    transformResponse: [
      function transformResponse(data2) {
        const transitional = this.transitional || defaults.transitional;
        const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
        const JSONRequested = this.responseType === "json";
        if (utils_default.isResponse(data2) || utils_default.isReadableStream(data2)) {
          return data2;
        }
        if (data2 && utils_default.isString(data2) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
          const silentJSONParsing = transitional && transitional.silentJSONParsing;
          const strictJSONParsing = !silentJSONParsing && JSONRequested;
          try {
            return JSON.parse(data2, this.parseReviver);
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === "SyntaxError") {
                throw AxiosError_default.from(e, AxiosError_default.ERR_BAD_RESPONSE, this, null, this.response);
              }
              throw e;
            }
          }
        }
        return data2;
      }
    ],
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
      FormData: platform_default.classes.FormData,
      Blob: platform_default.classes.Blob
    },
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },
    headers: {
      common: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": undefined
      }
    }
  };
  utils_default.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
    defaults.headers[method] = {};
  });
  defaults_default = defaults;
});

// node_modules/axios/lib/helpers/parseHeaders.js
var ignoreDuplicateOf, parseHeaders_default = (rawHeaders) => {
  const parsed = {};
  let key;
  let val;
  let i;
  rawHeaders && rawHeaders.split(`
`).forEach(function parser(line) {
    i = line.indexOf(":");
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();
    if (!key || parsed[key] && ignoreDuplicateOf[key]) {
      return;
    }
    if (key === "set-cookie") {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
    }
  });
  return parsed;
};
var init_parseHeaders = __esm(() => {
  init_utils5();
  ignoreDuplicateOf = utils_default.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ]);
});

// node_modules/axios/lib/core/AxiosHeaders.js
function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }
  return utils_default.isArray(value) ? value.map(normalizeValue) : String(value);
}
function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;
  while (match = tokensRE.exec(str)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}
function matchHeaderValue(context, value, header, filter3, isHeaderNameFilter) {
  if (utils_default.isFunction(filter3)) {
    return filter3.call(this, value, header);
  }
  if (isHeaderNameFilter) {
    value = header;
  }
  if (!utils_default.isString(value))
    return;
  if (utils_default.isString(filter3)) {
    return value.indexOf(filter3) !== -1;
  }
  if (utils_default.isRegExp(filter3)) {
    return filter3.test(value);
  }
}
function formatHeader(header) {
  return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
    return char.toUpperCase() + str;
  });
}
function buildAccessors(obj, header) {
  const accessorName = utils_default.toCamelCase(" " + header);
  ["get", "set", "has"].forEach((methodName) => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}
var $internals, isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim()), AxiosHeaders, AxiosHeaders_default;
var init_AxiosHeaders = __esm(() => {
  init_utils5();
  init_parseHeaders();
  $internals = Symbol("internals");
  AxiosHeaders = class AxiosHeaders {
    constructor(headers) {
      headers && this.set(headers);
    }
    set(header, valueOrRewrite, rewrite) {
      const self2 = this;
      function setHeader(_value, _header, _rewrite) {
        const lHeader = normalizeHeader(_header);
        if (!lHeader) {
          throw new Error("header name must be a non-empty string");
        }
        const key = utils_default.findKey(self2, lHeader);
        if (!key || self2[key] === undefined || _rewrite === true || _rewrite === undefined && self2[key] !== false) {
          self2[key || _header] = normalizeValue(_value);
        }
      }
      const setHeaders = (headers, _rewrite) => utils_default.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
      if (utils_default.isPlainObject(header) || header instanceof this.constructor) {
        setHeaders(header, valueOrRewrite);
      } else if (utils_default.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
        setHeaders(parseHeaders_default(header), valueOrRewrite);
      } else if (utils_default.isObject(header) && utils_default.isIterable(header)) {
        let obj = {}, dest, key;
        for (const entry of header) {
          if (!utils_default.isArray(entry)) {
            throw TypeError("Object iterator must return a key-value pair");
          }
          obj[key = entry[0]] = (dest = obj[key]) ? utils_default.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]] : entry[1];
        }
        setHeaders(obj, valueOrRewrite);
      } else {
        header != null && setHeader(valueOrRewrite, header, rewrite);
      }
      return this;
    }
    get(header, parser) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils_default.findKey(this, header);
        if (key) {
          const value = this[key];
          if (!parser) {
            return value;
          }
          if (parser === true) {
            return parseTokens(value);
          }
          if (utils_default.isFunction(parser)) {
            return parser.call(this, value, key);
          }
          if (utils_default.isRegExp(parser)) {
            return parser.exec(value);
          }
          throw new TypeError("parser must be boolean|regexp|function");
        }
      }
    }
    has(header, matcher) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils_default.findKey(this, header);
        return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
      }
      return false;
    }
    delete(header, matcher) {
      const self2 = this;
      let deleted = false;
      function deleteHeader(_header) {
        _header = normalizeHeader(_header);
        if (_header) {
          const key = utils_default.findKey(self2, _header);
          if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
            delete self2[key];
            deleted = true;
          }
        }
      }
      if (utils_default.isArray(header)) {
        header.forEach(deleteHeader);
      } else {
        deleteHeader(header);
      }
      return deleted;
    }
    clear(matcher) {
      const keys = Object.keys(this);
      let i = keys.length;
      let deleted = false;
      while (i--) {
        const key = keys[i];
        if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
          delete this[key];
          deleted = true;
        }
      }
      return deleted;
    }
    normalize(format) {
      const self2 = this;
      const headers = {};
      utils_default.forEach(this, (value, header) => {
        const key = utils_default.findKey(headers, header);
        if (key) {
          self2[key] = normalizeValue(value);
          delete self2[header];
          return;
        }
        const normalized = format ? formatHeader(header) : String(header).trim();
        if (normalized !== header) {
          delete self2[header];
        }
        self2[normalized] = normalizeValue(value);
        headers[normalized] = true;
      });
      return this;
    }
    concat(...targets) {
      return this.constructor.concat(this, ...targets);
    }
    toJSON(asStrings) {
      const obj = Object.create(null);
      utils_default.forEach(this, (value, header) => {
        value != null && value !== false && (obj[header] = asStrings && utils_default.isArray(value) ? value.join(", ") : value);
      });
      return obj;
    }
    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
      return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join(`
`);
    }
    getSetCookie() {
      return this.get("set-cookie") || [];
    }
    get [Symbol.toStringTag]() {
      return "AxiosHeaders";
    }
    static from(thing) {
      return thing instanceof this ? thing : new this(thing);
    }
    static concat(first, ...targets) {
      const computed = new this(first);
      targets.forEach((target) => computed.set(target));
      return computed;
    }
    static accessor(header) {
      const internals = this[$internals] = this[$internals] = {
        accessors: {}
      };
      const accessors = internals.accessors;
      const prototype2 = this.prototype;
      function defineAccessor(_header) {
        const lHeader = normalizeHeader(_header);
        if (!accessors[lHeader]) {
          buildAccessors(prototype2, _header);
          accessors[lHeader] = true;
        }
      }
      utils_default.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
      return this;
    }
  };
  AxiosHeaders.accessor([
    "Content-Type",
    "Content-Length",
    "Accept",
    "Accept-Encoding",
    "User-Agent",
    "Authorization"
  ]);
  utils_default.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
    let mapped = key[0].toUpperCase() + key.slice(1);
    return {
      get: () => value,
      set(headerValue) {
        this[mapped] = headerValue;
      }
    };
  });
  utils_default.freezeMethods(AxiosHeaders);
  AxiosHeaders_default = AxiosHeaders;
});

// node_modules/axios/lib/core/transformData.js
function transformData(fns, response) {
  const config = this || defaults_default;
  const context = response || config;
  const headers = AxiosHeaders_default.from(context.headers);
  let data2 = context.data;
  utils_default.forEach(fns, function transform(fn) {
    data2 = fn.call(config, data2, headers.normalize(), response ? response.status : undefined);
  });
  headers.normalize();
  return data2;
}
var init_transformData = __esm(() => {
  init_utils5();
  init_defaults2();
  init_AxiosHeaders();
});

// node_modules/axios/lib/cancel/isCancel.js
function isCancel(value) {
  return !!(value && value.__CANCEL__);
}

// node_modules/axios/lib/cancel/CanceledError.js
var CanceledError, CanceledError_default;
var init_CanceledError = __esm(() => {
  init_AxiosError();
  CanceledError = class CanceledError extends AxiosError_default {
    constructor(message, config, request) {
      super(message == null ? "canceled" : message, AxiosError_default.ERR_CANCELED, config, request);
      this.name = "CanceledError";
      this.__CANCEL__ = true;
    }
  };
  CanceledError_default = CanceledError;
});

// node_modules/axios/lib/core/settle.js
function settle(resolve, reject, response) {
  const validateStatus2 = response.config.validateStatus;
  if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError_default("Request failed with status code " + response.status, [AxiosError_default.ERR_BAD_REQUEST, AxiosError_default.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4], response.config, response.request, response));
  }
}
var init_settle = __esm(() => {
  init_AxiosError();
});

// node_modules/axios/lib/helpers/parseProtocol.js
function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || "";
}

// node_modules/axios/lib/helpers/speedometer.js
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;
  min = min !== undefined ? min : 1000;
  return function push(chunkLength) {
    const now2 = Date.now();
    const startedAt = timestamps[tail];
    if (!firstSampleTS) {
      firstSampleTS = now2;
    }
    bytes[head] = chunkLength;
    timestamps[head] = now2;
    let i = tail;
    let bytesCount = 0;
    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }
    head = (head + 1) % samplesCount;
    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }
    if (now2 - firstSampleTS < min) {
      return;
    }
    const passed = startedAt && now2 - startedAt;
    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}
var speedometer_default;
var init_speedometer = __esm(() => {
  speedometer_default = speedometer;
});

// node_modules/axios/lib/helpers/throttle.js
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1000 / freq;
  let lastArgs;
  let timer;
  const invoke = (args, now2 = Date.now()) => {
    timestamp = now2;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn(...args);
  };
  const throttled = (...args) => {
    const now2 = Date.now();
    const passed = now2 - timestamp;
    if (passed >= threshold) {
      invoke(args, now2);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs);
        }, threshold - passed);
      }
    }
  };
  const flush = () => lastArgs && invoke(lastArgs);
  return [throttled, flush];
}
var throttle_default;
var init_throttle = __esm(() => {
  throttle_default = throttle;
});

// node_modules/axios/lib/helpers/progressEventReducer.js
var progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = speedometer_default(50, 250);
  return throttle_default((e) => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;
    bytesNotified = loaded;
    const data2 = {
      loaded,
      total,
      progress: total ? loaded / total : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e,
      lengthComputable: total != null,
      [isDownloadStream ? "download" : "upload"]: true
    };
    listener(data2);
  }, freq);
}, progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;
  return [
    (loaded) => throttled[0]({
      lengthComputable,
      total,
      loaded
    }),
    throttled[1]
  ];
}, asyncDecorator = (fn) => (...args) => utils_default.asap(() => fn(...args));
var init_progressEventReducer = __esm(() => {
  init_speedometer();
  init_throttle();
  init_utils5();
});

// node_modules/axios/lib/helpers/isURLSameOrigin.js
var isURLSameOrigin_default;
var init_isURLSameOrigin = __esm(() => {
  init_platform();
  isURLSameOrigin_default = platform_default.hasStandardBrowserEnv ? ((origin2, isMSIE) => (url) => {
    url = new URL(url, platform_default.origin);
    return origin2.protocol === url.protocol && origin2.host === url.host && (isMSIE || origin2.port === url.port);
  })(new URL(platform_default.origin), platform_default.navigator && /(msie|trident)/i.test(platform_default.navigator.userAgent)) : () => true;
});

// node_modules/axios/lib/helpers/cookies.js
var cookies_default;
var init_cookies = __esm(() => {
  init_utils5();
  init_platform();
  cookies_default = platform_default.hasStandardBrowserEnv ? {
    write(name, value, expires, path, domain, secure, sameSite) {
      if (typeof document === "undefined")
        return;
      const cookie = [`${name}=${encodeURIComponent(value)}`];
      if (utils_default.isNumber(expires)) {
        cookie.push(`expires=${new Date(expires).toUTCString()}`);
      }
      if (utils_default.isString(path)) {
        cookie.push(`path=${path}`);
      }
      if (utils_default.isString(domain)) {
        cookie.push(`domain=${domain}`);
      }
      if (secure === true) {
        cookie.push("secure");
      }
      if (utils_default.isString(sameSite)) {
        cookie.push(`SameSite=${sameSite}`);
      }
      document.cookie = cookie.join("; ");
    },
    read(name) {
      if (typeof document === "undefined")
        return null;
      const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
      return match ? decodeURIComponent(match[1]) : null;
    },
    remove(name) {
      this.write(name, "", Date.now() - 86400000, "/");
    }
  } : {
    write() {},
    read() {
      return null;
    },
    remove() {}
  };
});

// node_modules/axios/lib/helpers/isAbsoluteURL.js
function isAbsoluteURL(url) {
  if (typeof url !== "string") {
    return false;
  }
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

// node_modules/axios/lib/helpers/combineURLs.js
function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
}

// node_modules/axios/lib/core/buildFullPath.js
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
  let isRelativeUrl = !isAbsoluteURL(requestedURL);
  if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}
var init_buildFullPath = () => {};

// node_modules/axios/lib/core/mergeConfig.js
function mergeConfig(config1, config2) {
  config2 = config2 || {};
  const config = {};
  function getMergedValue(target, source, prop, caseless) {
    if (utils_default.isPlainObject(target) && utils_default.isPlainObject(source)) {
      return utils_default.merge.call({ caseless }, target, source);
    } else if (utils_default.isPlainObject(source)) {
      return utils_default.merge({}, source);
    } else if (utils_default.isArray(source)) {
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties(a, b, prop, caseless) {
    if (!utils_default.isUndefined(b)) {
      return getMergedValue(a, b, prop, caseless);
    } else if (!utils_default.isUndefined(a)) {
      return getMergedValue(undefined, a, prop, caseless);
    }
  }
  function valueFromConfig2(a, b) {
    if (!utils_default.isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }
  function defaultToConfig2(a, b) {
    if (!utils_default.isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!utils_default.isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }
  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
  };
  utils_default.forEach(Object.keys({ ...config1, ...config2 }), function computeConfigValue(prop) {
    if (prop === "__proto__" || prop === "constructor" || prop === "prototype")
      return;
    const merge2 = utils_default.hasOwnProp(mergeMap, prop) ? mergeMap[prop] : mergeDeepProperties;
    const configValue = merge2(config1[prop], config2[prop], prop);
    utils_default.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
  });
  return config;
}
var headersToObject = (thing) => thing instanceof AxiosHeaders_default ? { ...thing } : thing;
var init_mergeConfig = __esm(() => {
  init_utils5();
  init_AxiosHeaders();
});

// node_modules/axios/lib/helpers/resolveConfig.js
var resolveConfig_default = (config) => {
  const newConfig = mergeConfig({}, config);
  let { data: data2, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
  newConfig.headers = headers = AxiosHeaders_default.from(headers);
  newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);
  if (auth) {
    headers.set("Authorization", "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : "")));
  }
  if (utils_default.isFormData(data2)) {
    if (platform_default.hasStandardBrowserEnv || platform_default.hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(undefined);
    } else if (utils_default.isFunction(data2.getHeaders)) {
      const formHeaders = data2.getHeaders();
      const allowedHeaders = ["content-type", "content-length"];
      Object.entries(formHeaders).forEach(([key, val]) => {
        if (allowedHeaders.includes(key.toLowerCase())) {
          headers.set(key, val);
        }
      });
    }
  }
  if (platform_default.hasStandardBrowserEnv) {
    withXSRFToken && utils_default.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
    if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin_default(newConfig.url)) {
      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies_default.read(xsrfCookieName);
      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }
  return newConfig;
};
var init_resolveConfig = __esm(() => {
  init_platform();
  init_utils5();
  init_isURLSameOrigin();
  init_cookies();
  init_buildFullPath();
  init_mergeConfig();
  init_AxiosHeaders();
  init_buildURL();
});

// node_modules/axios/lib/adapters/xhr.js
var isXHRAdapterSupported, xhr_default;
var init_xhr = __esm(() => {
  init_utils5();
  init_settle();
  init_transitional();
  init_AxiosError();
  init_CanceledError();
  init_platform();
  init_AxiosHeaders();
  init_progressEventReducer();
  init_resolveConfig();
  isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
  xhr_default = isXHRAdapterSupported && function(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      const _config = resolveConfig_default(config);
      let requestData = _config.data;
      const requestHeaders = AxiosHeaders_default.from(_config.headers).normalize();
      let { responseType, onUploadProgress, onDownloadProgress } = _config;
      let onCanceled;
      let uploadThrottled, downloadThrottled;
      let flushUpload, flushDownload;
      function done() {
        flushUpload && flushUpload();
        flushDownload && flushDownload();
        _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
        _config.signal && _config.signal.removeEventListener("abort", onCanceled);
      }
      let request = new XMLHttpRequest;
      request.open(_config.method.toUpperCase(), _config.url, true);
      request.timeout = _config.timeout;
      function onloadend() {
        if (!request) {
          return;
        }
        const responseHeaders = AxiosHeaders_default.from("getAllResponseHeaders" in request && request.getAllResponseHeaders());
        const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
        const response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        };
        settle(function _resolve(value) {
          resolve(value);
          done();
        }, function _reject(err) {
          reject(err);
          done();
        }, response);
        request = null;
      }
      if ("onloadend" in request) {
        request.onloadend = onloadend;
      } else {
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
            return;
          }
          setTimeout(onloadend);
        };
      }
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }
        reject(new AxiosError_default("Request aborted", AxiosError_default.ECONNABORTED, config, request));
        request = null;
      };
      request.onerror = function handleError(event) {
        const msg = event && event.message ? event.message : "Network Error";
        const err = new AxiosError_default(msg, AxiosError_default.ERR_NETWORK, config, request);
        err.event = event || null;
        reject(err);
        request = null;
      };
      request.ontimeout = function handleTimeout() {
        let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
        const transitional = _config.transitional || transitional_default;
        if (_config.timeoutErrorMessage) {
          timeoutErrorMessage = _config.timeoutErrorMessage;
        }
        reject(new AxiosError_default(timeoutErrorMessage, transitional.clarifyTimeoutError ? AxiosError_default.ETIMEDOUT : AxiosError_default.ECONNABORTED, config, request));
        request = null;
      };
      requestData === undefined && requestHeaders.setContentType(null);
      if ("setRequestHeader" in request) {
        utils_default.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
          request.setRequestHeader(key, val);
        });
      }
      if (!utils_default.isUndefined(_config.withCredentials)) {
        request.withCredentials = !!_config.withCredentials;
      }
      if (responseType && responseType !== "json") {
        request.responseType = _config.responseType;
      }
      if (onDownloadProgress) {
        [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
        request.addEventListener("progress", downloadThrottled);
      }
      if (onUploadProgress && request.upload) {
        [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
        request.upload.addEventListener("progress", uploadThrottled);
        request.upload.addEventListener("loadend", flushUpload);
      }
      if (_config.cancelToken || _config.signal) {
        onCanceled = (cancel) => {
          if (!request) {
            return;
          }
          reject(!cancel || cancel.type ? new CanceledError_default(null, config, request) : cancel);
          request.abort();
          request = null;
        };
        _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
        if (_config.signal) {
          _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
        }
      }
      const protocol = parseProtocol(_config.url);
      if (protocol && platform_default.protocols.indexOf(protocol) === -1) {
        reject(new AxiosError_default("Unsupported protocol " + protocol + ":", AxiosError_default.ERR_BAD_REQUEST, config));
        return;
      }
      request.send(requestData || null);
    });
  };
});

// node_modules/axios/lib/helpers/composeSignals.js
var composeSignals = (signals, timeout) => {
  const { length } = signals = signals ? signals.filter(Boolean) : [];
  if (timeout || length) {
    let controller = new AbortController;
    let aborted;
    const onabort = function(reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(err instanceof AxiosError_default ? err : new CanceledError_default(err instanceof Error ? err.message : err));
      }
    };
    let timer = timeout && setTimeout(() => {
      timer = null;
      onabort(new AxiosError_default(`timeout of ${timeout}ms exceeded`, AxiosError_default.ETIMEDOUT));
    }, timeout);
    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach((signal2) => {
          signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
        });
        signals = null;
      }
    };
    signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
    const { signal } = controller;
    signal.unsubscribe = () => utils_default.asap(unsubscribe);
    return signal;
  }
}, composeSignals_default;
var init_composeSignals = __esm(() => {
  init_CanceledError();
  init_AxiosError();
  init_utils5();
  composeSignals_default = composeSignals;
});

// node_modules/axios/lib/helpers/trackStream.js
var streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;
  if (!chunkSize || len < chunkSize) {
    yield chunk;
    return;
  }
  let pos = 0;
  let end;
  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
}, readBytes = async function* (iterable, chunkSize) {
  for await (const chunk of readStream(iterable)) {
    yield* streamChunk(chunk, chunkSize);
  }
}, readStream = async function* (stream) {
  if (stream[Symbol.asyncIterator]) {
    yield* stream;
    return;
  }
  const reader = stream.getReader();
  try {
    for (;; ) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    await reader.cancel();
  }
}, trackStream = (stream, chunkSize, onProgress, onFinish) => {
  const iterator2 = readBytes(stream, chunkSize);
  let bytes = 0;
  let done;
  let _onFinish = (e) => {
    if (!done) {
      done = true;
      onFinish && onFinish(e);
    }
  };
  return new ReadableStream({
    async pull(controller) {
      try {
        const { done: done2, value } = await iterator2.next();
        if (done2) {
          _onFinish();
          controller.close();
          return;
        }
        let len = value.byteLength;
        if (onProgress) {
          let loadedBytes = bytes += len;
          onProgress(loadedBytes);
        }
        controller.enqueue(new Uint8Array(value));
      } catch (err) {
        _onFinish(err);
        throw err;
      }
    },
    cancel(reason) {
      _onFinish(reason);
      return iterator2.return();
    }
  }, {
    highWaterMark: 2
  });
};

// node_modules/axios/lib/adapters/fetch.js
var DEFAULT_CHUNK_SIZE, isFunction2, globalFetchAPI, ReadableStream2, TextEncoder2, test2 = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e) {
    return false;
  }
}, factory = (env) => {
  env = utils_default.merge.call({
    skipUndefined: true
  }, globalFetchAPI, env);
  const { fetch: envFetch, Request: Request2, Response: Response2 } = env;
  const isFetchSupported = envFetch ? isFunction2(envFetch) : typeof fetch === "function";
  const isRequestSupported = isFunction2(Request2);
  const isResponseSupported = isFunction2(Response2);
  if (!isFetchSupported) {
    return false;
  }
  const isReadableStreamSupported = isFetchSupported && isFunction2(ReadableStream2);
  const encodeText = isFetchSupported && (typeof TextEncoder2 === "function" ? ((encoder) => (str) => encoder.encode(str))(new TextEncoder2) : async (str) => new Uint8Array(await new Request2(str).arrayBuffer()));
  const supportsRequestStream = isRequestSupported && isReadableStreamSupported && test2(() => {
    let duplexAccessed = false;
    const hasContentType = new Request2(platform_default.origin, {
      body: new ReadableStream2,
      method: "POST",
      get duplex() {
        duplexAccessed = true;
        return "half";
      }
    }).headers.has("Content-Type");
    return duplexAccessed && !hasContentType;
  });
  const supportsResponseStream = isResponseSupported && isReadableStreamSupported && test2(() => utils_default.isReadableStream(new Response2("").body));
  const resolvers = {
    stream: supportsResponseStream && ((res) => res.body)
  };
  isFetchSupported && (() => {
    ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
      !resolvers[type] && (resolvers[type] = (res, config) => {
        let method = res && res[type];
        if (method) {
          return method.call(res);
        }
        throw new AxiosError_default(`Response type '${type}' is not supported`, AxiosError_default.ERR_NOT_SUPPORT, config);
      });
    });
  })();
  const getBodyLength = async (body) => {
    if (body == null) {
      return 0;
    }
    if (utils_default.isBlob(body)) {
      return body.size;
    }
    if (utils_default.isSpecCompliantForm(body)) {
      const _request = new Request2(platform_default.origin, {
        method: "POST",
        body
      });
      return (await _request.arrayBuffer()).byteLength;
    }
    if (utils_default.isArrayBufferView(body) || utils_default.isArrayBuffer(body)) {
      return body.byteLength;
    }
    if (utils_default.isURLSearchParams(body)) {
      body = body + "";
    }
    if (utils_default.isString(body)) {
      return (await encodeText(body)).byteLength;
    }
  };
  const resolveBodyLength = async (headers, body) => {
    const length = utils_default.toFiniteNumber(headers.getContentLength());
    return length == null ? getBodyLength(body) : length;
  };
  return async (config) => {
    let {
      url,
      method,
      data: data2,
      signal,
      cancelToken,
      timeout,
      onDownloadProgress,
      onUploadProgress,
      responseType,
      headers,
      withCredentials = "same-origin",
      fetchOptions
    } = resolveConfig_default(config);
    let _fetch = envFetch || fetch;
    responseType = responseType ? (responseType + "").toLowerCase() : "text";
    let composedSignal = composeSignals_default([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
    let request = null;
    const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
    });
    let requestContentLength;
    try {
      if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data2)) !== 0) {
        let _request = new Request2(url, {
          method: "POST",
          body: data2,
          duplex: "half"
        });
        let contentTypeHeader;
        if (utils_default.isFormData(data2) && (contentTypeHeader = _request.headers.get("content-type"))) {
          headers.setContentType(contentTypeHeader);
        }
        if (_request.body) {
          const [onProgress, flush] = progressEventDecorator(requestContentLength, progressEventReducer(asyncDecorator(onUploadProgress)));
          data2 = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
        }
      }
      if (!utils_default.isString(withCredentials)) {
        withCredentials = withCredentials ? "include" : "omit";
      }
      const isCredentialsSupported = isRequestSupported && "credentials" in Request2.prototype;
      const resolvedOptions = {
        ...fetchOptions,
        signal: composedSignal,
        method: method.toUpperCase(),
        headers: headers.normalize().toJSON(),
        body: data2,
        duplex: "half",
        credentials: isCredentialsSupported ? withCredentials : undefined
      };
      request = isRequestSupported && new Request2(url, resolvedOptions);
      let response = await (isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url, resolvedOptions));
      const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
      if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
        const options = {};
        ["status", "statusText", "headers"].forEach((prop) => {
          options[prop] = response[prop];
        });
        const responseContentLength = utils_default.toFiniteNumber(response.headers.get("content-length"));
        const [onProgress, flush] = onDownloadProgress && progressEventDecorator(responseContentLength, progressEventReducer(asyncDecorator(onDownloadProgress), true)) || [];
        response = new Response2(trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
          flush && flush();
          unsubscribe && unsubscribe();
        }), options);
      }
      responseType = responseType || "text";
      let responseData = await resolvers[utils_default.findKey(resolvers, responseType) || "text"](response, config);
      !isStreamResponse && unsubscribe && unsubscribe();
      return await new Promise((resolve, reject) => {
        settle(resolve, reject, {
          data: responseData,
          headers: AxiosHeaders_default.from(response.headers),
          status: response.status,
          statusText: response.statusText,
          config,
          request
        });
      });
    } catch (err) {
      unsubscribe && unsubscribe();
      if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) {
        throw Object.assign(new AxiosError_default("Network Error", AxiosError_default.ERR_NETWORK, config, request, err && err.response), {
          cause: err.cause || err
        });
      }
      throw AxiosError_default.from(err, err && err.code, config, request, err && err.response);
    }
  };
}, seedCache, getFetch = (config) => {
  let env = config && config.env || {};
  const { fetch: fetch2, Request: Request2, Response: Response2 } = env;
  const seeds = [Request2, Response2, fetch2];
  let len = seeds.length, i = len, seed, target, map = seedCache;
  while (i--) {
    seed = seeds[i];
    target = map.get(seed);
    target === undefined && map.set(seed, target = i ? new Map : factory(env));
    map = target;
  }
  return target;
}, adapter;
var init_fetch = __esm(() => {
  init_platform();
  init_utils5();
  init_AxiosError();
  init_composeSignals();
  init_AxiosHeaders();
  init_progressEventReducer();
  init_resolveConfig();
  init_settle();
  DEFAULT_CHUNK_SIZE = 64 * 1024;
  ({ isFunction: isFunction2 } = utils_default);
  globalFetchAPI = (({ Request: Request2, Response: Response2 }) => ({
    Request: Request2,
    Response: Response2
  }))(utils_default.global);
  ({ ReadableStream: ReadableStream2, TextEncoder: TextEncoder2 } = utils_default.global);
  seedCache = new Map;
  adapter = getFetch();
});

// node_modules/axios/lib/adapters/adapters.js
function getAdapter(adapters, config) {
  adapters = utils_default.isArray(adapters) ? adapters : [adapters];
  const { length } = adapters;
  let nameOrAdapter;
  let adapter2;
  const rejectedReasons = {};
  for (let i = 0;i < length; i++) {
    nameOrAdapter = adapters[i];
    let id3;
    adapter2 = nameOrAdapter;
    if (!isResolvedHandle(nameOrAdapter)) {
      adapter2 = knownAdapters[(id3 = String(nameOrAdapter)).toLowerCase()];
      if (adapter2 === undefined) {
        throw new AxiosError_default(`Unknown adapter '${id3}'`);
      }
    }
    if (adapter2 && (utils_default.isFunction(adapter2) || (adapter2 = adapter2.get(config)))) {
      break;
    }
    rejectedReasons[id3 || "#" + i] = adapter2;
  }
  if (!adapter2) {
    const reasons = Object.entries(rejectedReasons).map(([id3, state]) => `adapter ${id3} ` + (state === false ? "is not supported by the environment" : "is not available in the build"));
    let s = length ? reasons.length > 1 ? `since :
` + reasons.map(renderReason).join(`
`) : " " + renderReason(reasons[0]) : "as no adapter specified";
    throw new AxiosError_default(`There is no suitable adapter to dispatch the request ` + s, "ERR_NOT_SUPPORT");
  }
  return adapter2;
}
var knownAdapters, renderReason = (reason) => `- ${reason}`, isResolvedHandle = (adapter2) => utils_default.isFunction(adapter2) || adapter2 === null || adapter2 === false, adapters_default;
var init_adapters = __esm(() => {
  init_utils5();
  init_xhr();
  init_fetch();
  init_AxiosError();
  knownAdapters = {
    http: null_default,
    xhr: xhr_default,
    fetch: {
      get: getFetch
    }
  };
  utils_default.forEach(knownAdapters, (fn, value) => {
    if (fn) {
      try {
        Object.defineProperty(fn, "name", { value });
      } catch (e) {}
      Object.defineProperty(fn, "adapterName", { value });
    }
  });
  adapters_default = {
    getAdapter,
    adapters: knownAdapters
  };
});

// node_modules/axios/lib/core/dispatchRequest.js
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
  if (config.signal && config.signal.aborted) {
    throw new CanceledError_default(null, config);
  }
}
function dispatchRequest(config) {
  throwIfCancellationRequested(config);
  config.headers = AxiosHeaders_default.from(config.headers);
  config.data = transformData.call(config, config.transformRequest);
  if (["post", "put", "patch"].indexOf(config.method) !== -1) {
    config.headers.setContentType("application/x-www-form-urlencoded", false);
  }
  const adapter2 = adapters_default.getAdapter(config.adapter || defaults_default.adapter, config);
  return adapter2(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);
    response.data = transformData.call(config, config.transformResponse, response);
    response.headers = AxiosHeaders_default.from(response.headers);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);
      if (reason && reason.response) {
        reason.response.data = transformData.call(config, config.transformResponse, reason.response);
        reason.response.headers = AxiosHeaders_default.from(reason.response.headers);
      }
    }
    return Promise.reject(reason);
  });
}
var init_dispatchRequest = __esm(() => {
  init_transformData();
  init_defaults2();
  init_CanceledError();
  init_AxiosHeaders();
  init_adapters();
});

// node_modules/axios/lib/env/data.js
var VERSION = "1.13.6";

// node_modules/axios/lib/helpers/validator.js
function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== "object") {
    throw new AxiosError_default("options must be an object", AxiosError_default.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError_default("option " + opt + " must be " + result, AxiosError_default.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError_default("Unknown option " + opt, AxiosError_default.ERR_BAD_OPTION);
    }
  }
}
var validators, deprecatedWarnings, validator_default;
var init_validator = __esm(() => {
  init_AxiosError();
  validators = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
    validators[type] = function validator(thing) {
      return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
    };
  });
  deprecatedWarnings = {};
  validators.transitional = function transitional(validator, version, message) {
    function formatMessage(opt, desc) {
      return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
    }
    return (value, opt, opts) => {
      if (validator === false) {
        throw new AxiosError_default(formatMessage(opt, " has been removed" + (version ? " in " + version : "")), AxiosError_default.ERR_DEPRECATED);
      }
      if (version && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        console.warn(formatMessage(opt, " has been deprecated since v" + version + " and will be removed in the near future"));
      }
      return validator ? validator(value, opt, opts) : true;
    };
  };
  validators.spelling = function spelling(correctSpelling) {
    return (value, opt) => {
      console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
      return true;
    };
  };
  validator_default = {
    assertOptions,
    validators
  };
});

// node_modules/axios/lib/core/Axios.js
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig || {};
    this.interceptors = {
      request: new InterceptorManager_default,
      response: new InterceptorManager_default
    };
  }
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy = {};
        Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error;
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
        try {
          if (!err.stack) {
            err.stack = stack;
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))) {
            err.stack += `
` + stack;
          }
        } catch (e) {}
      }
      throw err;
    }
  }
  _request(configOrUrl, config) {
    if (typeof configOrUrl === "string") {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }
    config = mergeConfig(this.defaults, config);
    const { transitional: transitional2, paramsSerializer, headers } = config;
    if (transitional2 !== undefined) {
      validator_default.assertOptions(transitional2, {
        silentJSONParsing: validators2.transitional(validators2.boolean),
        forcedJSONParsing: validators2.transitional(validators2.boolean),
        clarifyTimeoutError: validators2.transitional(validators2.boolean),
        legacyInterceptorReqResOrdering: validators2.transitional(validators2.boolean)
      }, false);
    }
    if (paramsSerializer != null) {
      if (utils_default.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator_default.assertOptions(paramsSerializer, {
          encode: validators2.function,
          serialize: validators2.function
        }, true);
      }
    }
    if (config.allowAbsoluteUrls !== undefined) {} else if (this.defaults.allowAbsoluteUrls !== undefined) {
      config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    } else {
      config.allowAbsoluteUrls = true;
    }
    validator_default.assertOptions(config, {
      baseUrl: validators2.spelling("baseURL"),
      withXsrfToken: validators2.spelling("withXSRFToken")
    }, true);
    config.method = (config.method || this.defaults.method || "get").toLowerCase();
    let contextHeaders = headers && utils_default.merge(headers.common, headers[config.method]);
    headers && utils_default.forEach(["delete", "get", "head", "post", "put", "patch", "common"], (method) => {
      delete headers[method];
    });
    config.headers = AxiosHeaders_default.concat(contextHeaders, headers);
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
        return;
      }
      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      const transitional3 = config.transitional || transitional_default;
      const legacyInterceptorReqResOrdering = transitional3 && transitional3.legacyInterceptorReqResOrdering;
      if (legacyInterceptorReqResOrdering) {
        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      } else {
        requestInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      }
    });
    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    let promise;
    let i = 0;
    let len;
    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), undefined];
      chain.unshift(...requestInterceptorChain);
      chain.push(...responseInterceptorChain);
      len = chain.length;
      promise = Promise.resolve(config);
      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }
      return promise;
    }
    len = requestInterceptorChain.length;
    let newConfig = config;
    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }
    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }
    i = 0;
    len = responseInterceptorChain.length;
    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }
    return promise;
  }
  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
}
var validators2, Axios_default;
var init_Axios = __esm(() => {
  init_utils5();
  init_buildURL();
  init_InterceptorManager();
  init_dispatchRequest();
  init_mergeConfig();
  init_buildFullPath();
  init_validator();
  init_AxiosHeaders();
  init_transitional();
  validators2 = validator_default.validators;
  utils_default.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
    Axios.prototype[method] = function(url, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        url,
        data: (config || {}).data
      }));
    };
  });
  utils_default.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    function generateHTTPMethod(isForm) {
      return function httpMethod(url, data2, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          headers: isForm ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url,
          data: data2
        }));
      };
    }
    Axios.prototype[method] = generateHTTPMethod();
    Axios.prototype[method + "Form"] = generateHTTPMethod(true);
  });
  Axios_default = Axios;
});

// node_modules/axios/lib/cancel/CancelToken.js
class CancelToken {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    let resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    const token = this;
    this.promise.then((cancel) => {
      if (!token._listeners)
        return;
      let i = token._listeners.length;
      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });
    this.promise.then = (onfulfilled) => {
      let _resolve;
      const promise = new Promise((resolve) => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);
      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };
      return promise;
    };
    executor(function cancel(message, config, request) {
      if (token.reason) {
        return;
      }
      token.reason = new CanceledError_default(message, config, request);
      resolvePromise(token.reason);
    });
  }
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }
  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }
  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }
  toAbortSignal() {
    const controller = new AbortController;
    const abort = (err) => {
      controller.abort(err);
    };
    this.subscribe(abort);
    controller.signal.unsubscribe = () => this.unsubscribe(abort);
    return controller.signal;
  }
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}
var CancelToken_default;
var init_CancelToken = __esm(() => {
  init_CanceledError();
  CancelToken_default = CancelToken;
});

// node_modules/axios/lib/helpers/spread.js
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

// node_modules/axios/lib/helpers/isAxiosError.js
function isAxiosError(payload) {
  return utils_default.isObject(payload) && payload.isAxiosError === true;
}
var init_isAxiosError = __esm(() => {
  init_utils5();
});

// node_modules/axios/lib/helpers/HttpStatusCode.js
var HttpStatusCode, HttpStatusCode_default;
var init_HttpStatusCode = __esm(() => {
  HttpStatusCode = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511,
    WebServerIsDown: 521,
    ConnectionTimedOut: 522,
    OriginIsUnreachable: 523,
    TimeoutOccurred: 524,
    SslHandshakeFailed: 525,
    InvalidSslCertificate: 526
  };
  Object.entries(HttpStatusCode).forEach(([key, value]) => {
    HttpStatusCode[value] = key;
  });
  HttpStatusCode_default = HttpStatusCode;
});

// node_modules/axios/lib/axios.js
function createInstance(defaultConfig) {
  const context = new Axios_default(defaultConfig);
  const instance = bind(Axios_default.prototype.request, context);
  utils_default.extend(instance, Axios_default.prototype, context, { allOwnKeys: true });
  utils_default.extend(instance, context, null, { allOwnKeys: true });
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };
  return instance;
}
var axios, axios_default;
var init_axios = __esm(() => {
  init_utils5();
  init_Axios();
  init_mergeConfig();
  init_defaults2();
  init_formDataToJSON();
  init_CanceledError();
  init_CancelToken();
  init_toFormData();
  init_AxiosError();
  init_isAxiosError();
  init_AxiosHeaders();
  init_adapters();
  init_HttpStatusCode();
  axios = createInstance(defaults_default);
  axios.Axios = Axios_default;
  axios.CanceledError = CanceledError_default;
  axios.CancelToken = CancelToken_default;
  axios.isCancel = isCancel;
  axios.VERSION = VERSION;
  axios.toFormData = toFormData_default;
  axios.AxiosError = AxiosError_default;
  axios.Cancel = axios.CanceledError;
  axios.all = function all(promises) {
    return Promise.all(promises);
  };
  axios.spread = spread;
  axios.isAxiosError = isAxiosError;
  axios.mergeConfig = mergeConfig;
  axios.AxiosHeaders = AxiosHeaders_default;
  axios.formToJSON = (thing) => formDataToJSON_default(utils_default.isHTMLForm(thing) ? new FormData(thing) : thing);
  axios.getAdapter = adapters_default.getAdapter;
  axios.HttpStatusCode = HttpStatusCode_default;
  axios.default = axios;
  axios_default = axios;
});

// node_modules/axios/index.js
var init_axios2 = __esm(() => {
  init_axios();
});

// src/api.js
var API_BASE_URL, isCapacitor, api, resolveUrl = (url) => {
  if (!url)
    return url;
  return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
}, api_default;
var init_api = __esm(() => {
  init_axios2();
  API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  isCapacitor = typeof window !== "undefined" && window.Capacitor !== undefined;
  api = axios_default.create({
    baseURL: API_BASE_URL,
    withCredentials: !isCapacitor
  });
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  api_default = api;
});

// node_modules/@capacitor/core/dist/index.js
class WebPlugin {
  constructor(config) {
    this.listeners = {};
    this.retainedEventArguments = {};
    this.windowListeners = {};
    if (config) {
      console.warn(`Capacitor WebPlugin "${config.name}" config object was deprecated in v3 and will be removed in v4.`);
      this.config = config;
    }
  }
  addListener(eventName, listenerFunc) {
    let firstListener = false;
    const listeners = this.listeners[eventName];
    if (!listeners) {
      this.listeners[eventName] = [];
      firstListener = true;
    }
    this.listeners[eventName].push(listenerFunc);
    const windowListener = this.windowListeners[eventName];
    if (windowListener && !windowListener.registered) {
      this.addWindowListener(windowListener);
    }
    if (firstListener) {
      this.sendRetainedArgumentsForEvent(eventName);
    }
    const remove = async () => this.removeListener(eventName, listenerFunc);
    const p = Promise.resolve({ remove });
    return p;
  }
  async removeAllListeners() {
    this.listeners = {};
    for (const listener in this.windowListeners) {
      this.removeWindowListener(this.windowListeners[listener]);
    }
    this.windowListeners = {};
  }
  notifyListeners(eventName, data2, retainUntilConsumed) {
    const listeners = this.listeners[eventName];
    if (!listeners) {
      if (retainUntilConsumed) {
        let args = this.retainedEventArguments[eventName];
        if (!args) {
          args = [];
        }
        args.push(data2);
        this.retainedEventArguments[eventName] = args;
      }
      return;
    }
    listeners.forEach((listener) => listener(data2));
  }
  hasListeners(eventName) {
    return !!this.listeners[eventName].length;
  }
  registerWindowListener(windowEventName, pluginEventName) {
    this.windowListeners[pluginEventName] = {
      registered: false,
      windowEventName,
      pluginEventName,
      handler: (event) => {
        this.notifyListeners(pluginEventName, event);
      }
    };
  }
  unimplemented(msg = "not implemented") {
    return new Capacitor.Exception(msg, ExceptionCode.Unimplemented);
  }
  unavailable(msg = "not available") {
    return new Capacitor.Exception(msg, ExceptionCode.Unavailable);
  }
  async removeListener(eventName, listenerFunc) {
    const listeners = this.listeners[eventName];
    if (!listeners) {
      return;
    }
    const index = listeners.indexOf(listenerFunc);
    this.listeners[eventName].splice(index, 1);
    if (!this.listeners[eventName].length) {
      this.removeWindowListener(this.windowListeners[eventName]);
    }
  }
  addWindowListener(handle) {
    window.addEventListener(handle.windowEventName, handle.handler);
    handle.registered = true;
  }
  removeWindowListener(handle) {
    if (!handle) {
      return;
    }
    window.removeEventListener(handle.windowEventName, handle.handler);
    handle.registered = false;
  }
  sendRetainedArgumentsForEvent(eventName) {
    const args = this.retainedEventArguments[eventName];
    if (!args) {
      return;
    }
    delete this.retainedEventArguments[eventName];
    args.forEach((arg) => {
      this.notifyListeners(eventName, arg);
    });
  }
}
var createCapacitorPlatforms = (win) => {
  const defaultPlatformMap = new Map;
  defaultPlatformMap.set("web", { name: "web" });
  const capPlatforms = win.CapacitorPlatforms || {
    currentPlatform: { name: "web" },
    platforms: defaultPlatformMap
  };
  const addPlatform = (name, platform) => {
    capPlatforms.platforms.set(name, platform);
  };
  const setPlatform = (name) => {
    if (capPlatforms.platforms.has(name)) {
      capPlatforms.currentPlatform = capPlatforms.platforms.get(name);
    }
  };
  capPlatforms.addPlatform = addPlatform;
  capPlatforms.setPlatform = setPlatform;
  return capPlatforms;
}, initPlatforms = (win) => win.CapacitorPlatforms = createCapacitorPlatforms(win), CapacitorPlatforms, addPlatform, setPlatform, ExceptionCode, CapacitorException, getPlatformId = (win) => {
  var _a, _b;
  if (win === null || win === undefined ? undefined : win.androidBridge) {
    return "android";
  } else if ((_b = (_a = win === null || win === undefined ? undefined : win.webkit) === null || _a === undefined ? undefined : _a.messageHandlers) === null || _b === undefined ? undefined : _b.bridge) {
    return "ios";
  } else {
    return "web";
  }
}, createCapacitor = (win) => {
  var _a, _b, _c, _d, _e;
  const capCustomPlatform = win.CapacitorCustomPlatform || null;
  const cap = win.Capacitor || {};
  const Plugins = cap.Plugins = cap.Plugins || {};
  const capPlatforms = win.CapacitorPlatforms;
  const defaultGetPlatform = () => {
    return capCustomPlatform !== null ? capCustomPlatform.name : getPlatformId(win);
  };
  const getPlatform = ((_a = capPlatforms === null || capPlatforms === undefined ? undefined : capPlatforms.currentPlatform) === null || _a === undefined ? undefined : _a.getPlatform) || defaultGetPlatform;
  const defaultIsNativePlatform = () => getPlatform() !== "web";
  const isNativePlatform = ((_b = capPlatforms === null || capPlatforms === undefined ? undefined : capPlatforms.currentPlatform) === null || _b === undefined ? undefined : _b.isNativePlatform) || defaultIsNativePlatform;
  const defaultIsPluginAvailable = (pluginName) => {
    const plugin = registeredPlugins.get(pluginName);
    if (plugin === null || plugin === undefined ? undefined : plugin.platforms.has(getPlatform())) {
      return true;
    }
    if (getPluginHeader(pluginName)) {
      return true;
    }
    return false;
  };
  const isPluginAvailable = ((_c = capPlatforms === null || capPlatforms === undefined ? undefined : capPlatforms.currentPlatform) === null || _c === undefined ? undefined : _c.isPluginAvailable) || defaultIsPluginAvailable;
  const defaultGetPluginHeader = (pluginName) => {
    var _a2;
    return (_a2 = cap.PluginHeaders) === null || _a2 === undefined ? undefined : _a2.find((h) => h.name === pluginName);
  };
  const getPluginHeader = ((_d = capPlatforms === null || capPlatforms === undefined ? undefined : capPlatforms.currentPlatform) === null || _d === undefined ? undefined : _d.getPluginHeader) || defaultGetPluginHeader;
  const handleError = (err) => win.console.error(err);
  const pluginMethodNoop = (_target, prop, pluginName) => {
    return Promise.reject(`${pluginName} does not have an implementation of "${prop}".`);
  };
  const registeredPlugins = new Map;
  const defaultRegisterPlugin = (pluginName, jsImplementations = {}) => {
    const registeredPlugin = registeredPlugins.get(pluginName);
    if (registeredPlugin) {
      console.warn(`Capacitor plugin "${pluginName}" already registered. Cannot register plugins twice.`);
      return registeredPlugin.proxy;
    }
    const platform = getPlatform();
    const pluginHeader = getPluginHeader(pluginName);
    let jsImplementation;
    const loadPluginImplementation = async () => {
      if (!jsImplementation && platform in jsImplementations) {
        jsImplementation = typeof jsImplementations[platform] === "function" ? jsImplementation = await jsImplementations[platform]() : jsImplementation = jsImplementations[platform];
      } else if (capCustomPlatform !== null && !jsImplementation && "web" in jsImplementations) {
        jsImplementation = typeof jsImplementations["web"] === "function" ? jsImplementation = await jsImplementations["web"]() : jsImplementation = jsImplementations["web"];
      }
      return jsImplementation;
    };
    const createPluginMethod = (impl, prop) => {
      var _a2, _b2;
      if (pluginHeader) {
        const methodHeader = pluginHeader === null || pluginHeader === undefined ? undefined : pluginHeader.methods.find((m2) => prop === m2.name);
        if (methodHeader) {
          if (methodHeader.rtype === "promise") {
            return (options) => cap.nativePromise(pluginName, prop.toString(), options);
          } else {
            return (options, callback) => cap.nativeCallback(pluginName, prop.toString(), options, callback);
          }
        } else if (impl) {
          return (_a2 = impl[prop]) === null || _a2 === undefined ? undefined : _a2.bind(impl);
        }
      } else if (impl) {
        return (_b2 = impl[prop]) === null || _b2 === undefined ? undefined : _b2.bind(impl);
      } else {
        throw new CapacitorException(`"${pluginName}" plugin is not implemented on ${platform}`, ExceptionCode.Unimplemented);
      }
    };
    const createPluginMethodWrapper = (prop) => {
      let remove;
      const wrapper = (...args) => {
        const p = loadPluginImplementation().then((impl) => {
          const fn = createPluginMethod(impl, prop);
          if (fn) {
            const p2 = fn(...args);
            remove = p2 === null || p2 === undefined ? undefined : p2.remove;
            return p2;
          } else {
            throw new CapacitorException(`"${pluginName}.${prop}()" is not implemented on ${platform}`, ExceptionCode.Unimplemented);
          }
        });
        if (prop === "addListener") {
          p.remove = async () => remove();
        }
        return p;
      };
      wrapper.toString = () => `${prop.toString()}() { [capacitor code] }`;
      Object.defineProperty(wrapper, "name", {
        value: prop,
        writable: false,
        configurable: false
      });
      return wrapper;
    };
    const addListener = createPluginMethodWrapper("addListener");
    const removeListener = createPluginMethodWrapper("removeListener");
    const addListenerNative = (eventName, callback) => {
      const call = addListener({ eventName }, callback);
      const remove = async () => {
        const callbackId = await call;
        removeListener({
          eventName,
          callbackId
        }, callback);
      };
      const p = new Promise((resolve) => call.then(() => resolve({ remove })));
      p.remove = async () => {
        console.warn(`Using addListener() without 'await' is deprecated.`);
        await remove();
      };
      return p;
    };
    const proxy = new Proxy({}, {
      get(_, prop) {
        switch (prop) {
          case "$$typeof":
            return;
          case "toJSON":
            return () => ({});
          case "addListener":
            return pluginHeader ? addListenerNative : addListener;
          case "removeListener":
            return removeListener;
          default:
            return createPluginMethodWrapper(prop);
        }
      }
    });
    Plugins[pluginName] = proxy;
    registeredPlugins.set(pluginName, {
      name: pluginName,
      proxy,
      platforms: new Set([
        ...Object.keys(jsImplementations),
        ...pluginHeader ? [platform] : []
      ])
    });
    return proxy;
  };
  const registerPlugin = ((_e = capPlatforms === null || capPlatforms === undefined ? undefined : capPlatforms.currentPlatform) === null || _e === undefined ? undefined : _e.registerPlugin) || defaultRegisterPlugin;
  if (!cap.convertFileSrc) {
    cap.convertFileSrc = (filePath) => filePath;
  }
  cap.getPlatform = getPlatform;
  cap.handleError = handleError;
  cap.isNativePlatform = isNativePlatform;
  cap.isPluginAvailable = isPluginAvailable;
  cap.pluginMethodNoop = pluginMethodNoop;
  cap.registerPlugin = registerPlugin;
  cap.Exception = CapacitorException;
  cap.DEBUG = !!cap.DEBUG;
  cap.isLoggingEnabled = !!cap.isLoggingEnabled;
  cap.platform = cap.getPlatform();
  cap.isNative = cap.isNativePlatform();
  return cap;
}, initCapacitorGlobal = (win) => win.Capacitor = createCapacitor(win), Capacitor, registerPlugin, Plugins, encode3 = (str) => encodeURIComponent(str).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape), decode = (str) => str.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent), CapacitorCookiesPluginWeb, CapacitorCookies, readBlobAsBase64 = async (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader;
  reader.onload = () => {
    const base64String = reader.result;
    resolve(base64String.indexOf(",") >= 0 ? base64String.split(",")[1] : base64String);
  };
  reader.onerror = (error) => reject(error);
  reader.readAsDataURL(blob);
}), normalizeHttpHeaders = (headers = {}) => {
  const originalKeys = Object.keys(headers);
  const loweredKeys = Object.keys(headers).map((k) => k.toLocaleLowerCase());
  const normalized = loweredKeys.reduce((acc, key, index) => {
    acc[key] = headers[originalKeys[index]];
    return acc;
  }, {});
  return normalized;
}, buildUrlParams = (params, shouldEncode = true) => {
  if (!params)
    return null;
  const output = Object.entries(params).reduce((accumulator, entry) => {
    const [key, value] = entry;
    let encodedValue;
    let item;
    if (Array.isArray(value)) {
      item = "";
      value.forEach((str) => {
        encodedValue = shouldEncode ? encodeURIComponent(str) : str;
        item += `${key}=${encodedValue}&`;
      });
      item.slice(0, -1);
    } else {
      encodedValue = shouldEncode ? encodeURIComponent(value) : value;
      item = `${key}=${encodedValue}`;
    }
    return `${accumulator}&${item}`;
  }, "");
  return output.substr(1);
}, buildRequestInit = (options, extra = {}) => {
  const output = Object.assign({ method: options.method || "GET", headers: options.headers }, extra);
  const headers = normalizeHttpHeaders(options.headers);
  const type = headers["content-type"] || "";
  if (typeof options.data === "string") {
    output.body = options.data;
  } else if (type.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams;
    for (const [key, value] of Object.entries(options.data || {})) {
      params.set(key, value);
    }
    output.body = params.toString();
  } else if (type.includes("multipart/form-data") || options.data instanceof FormData) {
    const form = new FormData;
    if (options.data instanceof FormData) {
      options.data.forEach((value, key) => {
        form.append(key, value);
      });
    } else {
      for (const key of Object.keys(options.data)) {
        form.append(key, options.data[key]);
      }
    }
    output.body = form;
    const headers2 = new Headers(output.headers);
    headers2.delete("content-type");
    output.headers = headers2;
  } else if (type.includes("application/json") || typeof options.data === "object") {
    output.body = JSON.stringify(options.data);
  }
  return output;
}, CapacitorHttpPluginWeb, CapacitorHttp;
var init_dist = __esm(() => {
  /*! Capacitor: https://capacitorjs.com/ - MIT License */
  CapacitorPlatforms = /* @__PURE__ */ initPlatforms(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
  addPlatform = CapacitorPlatforms.addPlatform;
  setPlatform = CapacitorPlatforms.setPlatform;
  (function(ExceptionCode2) {
    ExceptionCode2["Unimplemented"] = "UNIMPLEMENTED";
    ExceptionCode2["Unavailable"] = "UNAVAILABLE";
  })(ExceptionCode || (ExceptionCode = {}));
  CapacitorException = class CapacitorException extends Error {
    constructor(message, code, data2) {
      super(message);
      this.message = message;
      this.code = code;
      this.data = data2;
    }
  };
  Capacitor = /* @__PURE__ */ initCapacitorGlobal(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
  registerPlugin = Capacitor.registerPlugin;
  Plugins = Capacitor.Plugins;
  CapacitorCookiesPluginWeb = class CapacitorCookiesPluginWeb extends WebPlugin {
    async getCookies() {
      const cookies = document.cookie;
      const cookieMap = {};
      cookies.split(";").forEach((cookie) => {
        if (cookie.length <= 0)
          return;
        let [key, value] = cookie.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
        key = decode(key).trim();
        value = decode(value).trim();
        cookieMap[key] = value;
      });
      return cookieMap;
    }
    async setCookie(options) {
      try {
        const encodedKey = encode3(options.key);
        const encodedValue = encode3(options.value);
        const expires = `; expires=${(options.expires || "").replace("expires=", "")}`;
        const path = (options.path || "/").replace("path=", "");
        const domain = options.url != null && options.url.length > 0 ? `domain=${options.url}` : "";
        document.cookie = `${encodedKey}=${encodedValue || ""}${expires}; path=${path}; ${domain};`;
      } catch (error) {
        return Promise.reject(error);
      }
    }
    async deleteCookie(options) {
      try {
        document.cookie = `${options.key}=; Max-Age=0`;
      } catch (error) {
        return Promise.reject(error);
      }
    }
    async clearCookies() {
      try {
        const cookies = document.cookie.split(";") || [];
        for (const cookie of cookies) {
          document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    }
    async clearAllCookies() {
      try {
        await this.clearCookies();
      } catch (error) {
        return Promise.reject(error);
      }
    }
  };
  CapacitorCookies = registerPlugin("CapacitorCookies", {
    web: () => new CapacitorCookiesPluginWeb
  });
  CapacitorHttpPluginWeb = class CapacitorHttpPluginWeb extends WebPlugin {
    async request(options) {
      const requestInit = buildRequestInit(options, options.webFetchExtra);
      const urlParams = buildUrlParams(options.params, options.shouldEncodeUrlParams);
      const url = urlParams ? `${options.url}?${urlParams}` : options.url;
      const response = await fetch(url, requestInit);
      const contentType = response.headers.get("content-type") || "";
      let { responseType = "text" } = response.ok ? options : {};
      if (contentType.includes("application/json")) {
        responseType = "json";
      }
      let data2;
      let blob;
      switch (responseType) {
        case "arraybuffer":
        case "blob":
          blob = await response.blob();
          data2 = await readBlobAsBase64(blob);
          break;
        case "json":
          data2 = await response.json();
          break;
        case "document":
        case "text":
        default:
          data2 = await response.text();
      }
      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      return {
        data: data2,
        headers,
        status: response.status,
        url: response.url
      };
    }
    async get(options) {
      return this.request(Object.assign(Object.assign({}, options), { method: "GET" }));
    }
    async post(options) {
      return this.request(Object.assign(Object.assign({}, options), { method: "POST" }));
    }
    async put(options) {
      return this.request(Object.assign(Object.assign({}, options), { method: "PUT" }));
    }
    async patch(options) {
      return this.request(Object.assign(Object.assign({}, options), { method: "PATCH" }));
    }
    async delete(options) {
      return this.request(Object.assign(Object.assign({}, options), { method: "DELETE" }));
    }
  };
  CapacitorHttp = registerPlugin("CapacitorHttp", {
    web: () => new CapacitorHttpPluginWeb
  });
});

// node_modules/@capacitor/app/dist/esm/definitions.js
var init_definitions2 = () => {};

// node_modules/@capacitor/app/dist/esm/web.js
var exports_web = {};
__export(exports_web, {
  AppWeb: () => AppWeb
});
var AppWeb;
var init_web = __esm(() => {
  init_dist();
  AppWeb = class AppWeb extends WebPlugin {
    constructor() {
      super();
      this.handleVisibilityChange = () => {
        const data2 = {
          isActive: document.hidden !== true
        };
        this.notifyListeners("appStateChange", data2);
        if (document.hidden) {
          this.notifyListeners("pause", null);
        } else {
          this.notifyListeners("resume", null);
        }
      };
      document.addEventListener("visibilitychange", this.handleVisibilityChange, false);
    }
    exitApp() {
      throw this.unimplemented("Not implemented on web.");
    }
    async getInfo() {
      throw this.unimplemented("Not implemented on web.");
    }
    async getLaunchUrl() {
      return { url: "" };
    }
    async getState() {
      return { isActive: document.hidden !== true };
    }
    async minimizeApp() {
      throw this.unimplemented("Not implemented on web.");
    }
  };
});

// node_modules/@capacitor/app/dist/esm/index.js
var App;
var init_esm = __esm(() => {
  init_dist();
  init_definitions2();
  App = registerPlugin("App", {
    web: () => Promise.resolve().then(() => (init_web(), exports_web)).then((m2) => new m2.AppWeb)
  });
});

// node_modules/capacitor-music-controls-plugin/dist/esm/definitions.js
var init_definitions3 = () => {};

// node_modules/capacitor-music-controls-plugin/dist/esm/web.js
var exports_web2 = {};
__export(exports_web2, {
  CapacitorMusicControlsWeb: () => CapacitorMusicControlsWeb
});
var CapacitorMusicControlsWeb;
var init_web2 = __esm(() => {
  init_dist();
  CapacitorMusicControlsWeb = class CapacitorMusicControlsWeb extends WebPlugin {
    constructor() {
      super({
        name: "CapacitorMusicControls",
        platforms: ["web"]
      });
    }
    create(options) {
      console.log("create", options);
      return Promise.resolve(undefined);
    }
    destroy() {
      return Promise.resolve(undefined);
    }
    updateDismissable(dismissable) {
      console.log("updateDismissable", dismissable);
    }
    updateElapsed(args) {
      console.log("updateElapsed", args);
    }
    updateIsPlaying(args) {
      console.log("updateIsPlaying", args);
    }
  };
});

// node_modules/capacitor-music-controls-plugin/dist/esm/index.js
var CapacitorMusicControls;
var init_esm2 = __esm(() => {
  init_dist();
  init_definitions3();
  CapacitorMusicControls = registerPlugin("CapacitorMusicControls", {
    web: () => Promise.resolve().then(() => (init_web2(), exports_web2)).then((m2) => new m2.CapacitorMusicControlsWeb)
  });
});

// node_modules/react/cjs/react-jsx-dev-runtime.development.js
var require_react_jsx_dev_runtime_development = __commonJS((exports) => {
  var React12 = __toESM(require_react(), 1);
  (function() {
    function getComponentNameFromType(type) {
      if (type == null)
        return null;
      if (typeof type === "function")
        return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
      if (typeof type === "string")
        return type;
      switch (type) {
        case REACT_FRAGMENT_TYPE:
          return "Fragment";
        case REACT_PROFILER_TYPE:
          return "Profiler";
        case REACT_STRICT_MODE_TYPE:
          return "StrictMode";
        case REACT_SUSPENSE_TYPE:
          return "Suspense";
        case REACT_SUSPENSE_LIST_TYPE:
          return "SuspenseList";
        case REACT_ACTIVITY_TYPE:
          return "Activity";
      }
      if (typeof type === "object")
        switch (typeof type.tag === "number" && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof) {
          case REACT_PORTAL_TYPE:
            return "Portal";
          case REACT_CONTEXT_TYPE:
            return type.displayName || "Context";
          case REACT_CONSUMER_TYPE:
            return (type._context.displayName || "Context") + ".Consumer";
          case REACT_FORWARD_REF_TYPE:
            var innerType = type.render;
            type = type.displayName;
            type || (type = innerType.displayName || innerType.name || "", type = type !== "" ? "ForwardRef(" + type + ")" : "ForwardRef");
            return type;
          case REACT_MEMO_TYPE:
            return innerType = type.displayName || null, innerType !== null ? innerType : getComponentNameFromType(type.type) || "Memo";
          case REACT_LAZY_TYPE:
            innerType = type._payload;
            type = type._init;
            try {
              return getComponentNameFromType(type(innerType));
            } catch (x) {}
        }
      return null;
    }
    function testStringCoercion(value) {
      return "" + value;
    }
    function checkKeyStringCoercion(value) {
      try {
        testStringCoercion(value);
        var JSCompiler_inline_result = false;
      } catch (e) {
        JSCompiler_inline_result = true;
      }
      if (JSCompiler_inline_result) {
        JSCompiler_inline_result = console;
        var JSCompiler_temp_const = JSCompiler_inline_result.error;
        var JSCompiler_inline_result$jscomp$0 = typeof Symbol === "function" && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
        JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
        return testStringCoercion(value);
      }
    }
    function getTaskName(type) {
      if (type === REACT_FRAGMENT_TYPE)
        return "<>";
      if (typeof type === "object" && type !== null && type.$$typeof === REACT_LAZY_TYPE)
        return "<...>";
      try {
        var name = getComponentNameFromType(type);
        return name ? "<" + name + ">" : "<...>";
      } catch (x) {
        return "<...>";
      }
    }
    function getOwner() {
      var dispatcher = ReactSharedInternals.A;
      return dispatcher === null ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
      return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
      if (hasOwnProperty2.call(config, "key")) {
        var getter = Object.getOwnPropertyDescriptor(config, "key").get;
        if (getter && getter.isReactWarning)
          return false;
      }
      return config.key !== undefined;
    }
    function defineKeyPropWarningGetter(props, displayName) {
      function warnAboutAccessingKey() {
        specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
      }
      warnAboutAccessingKey.isReactWarning = true;
      Object.defineProperty(props, "key", {
        get: warnAboutAccessingKey,
        configurable: true
      });
    }
    function elementRefGetterWithDeprecationWarning() {
      var componentName = getComponentNameFromType(this.type);
      didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
      componentName = this.props.ref;
      return componentName !== undefined ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
      var refProp = props.ref;
      type = {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        props,
        _owner: owner
      };
      (refProp !== undefined ? refProp : null) !== null ? Object.defineProperty(type, "ref", {
        enumerable: false,
        get: elementRefGetterWithDeprecationWarning
      }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
      type._store = {};
      Object.defineProperty(type._store, "validated", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: 0
      });
      Object.defineProperty(type, "_debugInfo", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: null
      });
      Object.defineProperty(type, "_debugStack", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: debugStack
      });
      Object.defineProperty(type, "_debugTask", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: debugTask
      });
      Object.freeze && (Object.freeze(type.props), Object.freeze(type));
      return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
      var children = config.children;
      if (children !== undefined)
        if (isStaticChildren)
          if (isArrayImpl(children)) {
            for (isStaticChildren = 0;isStaticChildren < children.length; isStaticChildren++)
              validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
          } else
            console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else
          validateChildKeys(children);
      if (hasOwnProperty2.call(config, "key")) {
        children = getComponentNameFromType(type);
        var keys = Object.keys(config).filter(function(k) {
          return k !== "key";
        });
        isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
        didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = true);
      }
      children = null;
      maybeKey !== undefined && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
      hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
      if ("key" in config) {
        maybeKey = {};
        for (var propName in config)
          propName !== "key" && (maybeKey[propName] = config[propName]);
      } else
        maybeKey = config;
      children && defineKeyPropWarningGetter(maybeKey, typeof type === "function" ? type.displayName || type.name || "Unknown" : type);
      return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
      isValidElement3(node) ? node._store && (node._store.validated = 1) : typeof node === "object" && node !== null && node.$$typeof === REACT_LAZY_TYPE && (node._payload.status === "fulfilled" ? isValidElement3(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement3(object) {
      return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React12.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty2 = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
      return null;
    };
    React12 = {
      react_stack_bottom_frame: function(callStackForError) {
        return callStackForError();
      }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React12.react_stack_bottom_frame.bind(React12, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
      var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
      return jsxDEVImpl(type, config, maybeKey, isStaticChildren, trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
  })();
});

// node_modules/react/jsx-dev-runtime.js
var require_jsx_dev_runtime = __commonJS((exports, module) => {
  var react_jsx_dev_runtime_development = __toESM(require_react_jsx_dev_runtime_development(), 1);
  if (false) {} else {
    module.exports = react_jsx_dev_runtime_development;
  }
});

// src/context/ToastContext.jsx
var import_react30, jsx_dev_runtime, ToastContext, useToast = () => import_react30.useContext(ToastContext);
var init_ToastContext = __esm(() => {
  import_react30 = __toESM(require_react(), 1);
  jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
  ToastContext = import_react30.createContext();
});

// src/context/PlayerContext.jsx
var exports_PlayerContext = {};
__export(exports_PlayerContext, {
  PlayerProvider: () => PlayerProvider,
  PlayerContext: () => PlayerContext
});
var import_react31, jsx_dev_runtime2, PlayerContext, PlayerProvider = ({ children }) => {
  const toast = useToast();
  const [currentSong, setCurrentSong] = import_react31.useState(null);
  const [isPlaying, setIsPlaying] = import_react31.useState(false);
  const [duration, setDuration] = import_react31.useState(0);
  const [volume, setVolumeState] = import_react31.useState(() => {
    const saved = localStorage.getItem("wave_volume");
    return saved !== null ? parseFloat(saved) : 0.7;
  });
  const [shuffleMode, setShuffleMode] = import_react31.useState(() => {
    const saved = localStorage.getItem("wave_shuffle");
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [repeatMode, setRepeatMode] = import_react31.useState(() => {
    const saved = localStorage.getItem("wave_repeat");
    return saved !== null ? saved : "off";
  });
  const [likedSongs, setLikedSongs] = import_react31.useState(new Set);
  const [playlists, setPlaylists] = import_react31.useState([]);
  const [likedPlaylists, setLikedPlaylists] = import_react31.useState([]);
  const [queue, setQueue] = import_react31.useState([]);
  const [history, setHistory] = import_react31.useState([]);
  const [queueIndex, setQueueIndex] = import_react31.useState(-1);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = import_react31.useState(false);
  const [isFullScreenPlayer, setIsFullScreenPlayer] = import_react31.useState(false);
  const [sleepTimer, setSleepTimerState] = import_react31.useState(null);
  const sleepTimerRef = import_react31.useRef(null);
  const audioRef = import_react31.useRef(new Audio);
  const preloadAudioRef = import_react31.useRef(new Audio);
  const accumulatedDurationRef = import_react31.useRef(0);
  const lastPlayTimeRef = import_react31.useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  import_react31.useEffect(() => {
    if (audioRef.current)
      audioRef.current.preload = "auto";
    if (preloadAudioRef.current)
      preloadAudioRef.current.preload = "metadata";
  }, []);
  const resolveBackendUrl = resolveUrl;
  const fetchLikedSongs = async () => {
    try {
      const response = await api_default.get(`/api/songs/liked/${user.id}`);
      const likedIds = new Set(response.data.songs.map((s) => s.song_id));
      setLikedSongs(likedIds);
    } catch (error) {
      console.error("Error fetching liked songs:", error);
    }
  };
  const fetchPlaylists = async () => {
    try {
      const response = await api_default.get(`/api/playlists/user/${user.id}`);
      setPlaylists(response.data.playlists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };
  const fetchLikedPlaylists = async () => {
    if (!user.id)
      return;
    try {
      const response = await api_default.get(`/api/playlists/liked/${user.id}`);
      setLikedPlaylists(response.data.playlists || []);
    } catch (error) {
      console.error("Error fetching liked playlists:", error);
    }
  };
  import_react31.useEffect(() => {
    if (user.id) {
      fetchLikedSongs();
      fetchPlaylists();
      fetchLikedPlaylists();
    }
  }, [user.id]);
  const controlsRef = import_react31.useRef({ playNext: () => {}, playPrevious: () => {}, togglePlay: () => {} });
  controlsRef.current = {
    playNext: () => playNext(),
    playPrevious: () => playPrevious(),
    togglePlay: () => togglePlay()
  };
  import_react31.useEffect(() => {
    if (typeof window === "undefined" || !window.Capacitor)
      return;
    const handleControlsEvent = (action) => {
      const message = action.message || action;
      switch (message) {
        case "music-controls-next":
          controlsRef.current.playNext();
          break;
        case "music-controls-previous":
          controlsRef.current.playPrevious();
          break;
        case "music-controls-pause":
        case "music-controls-play":
        case "music-controls-toggle-play-pause":
          controlsRef.current.togglePlay();
          break;
        case "music-controls-destroy":
          audioRef.current?.pause();
          setIsPlaying(false);
          try {
            CapacitorMusicControls.updateIsPlaying({ isPlaying: false });
          } catch (e) {}
          break;
      }
    };
    let listenerObj = null;
    try {
      CapacitorMusicControls.addListener("controlsNotification", handleControlsEvent).then((l) => listenerObj = l).catch((e) => console.log("MusicControls init err", e));
      const androidListener = (event) => handleControlsEvent(event.message || event);
      document.addEventListener("controlsNotification", androidListener);
      return () => {
        if (listenerObj)
          listenerObj.remove();
        document.removeEventListener("controlsNotification", androidListener);
        try {
          CapacitorMusicControls.destroy();
        } catch (e) {}
      };
    } catch (err) {
      console.error("Music Controls init failed", err);
    }
  }, []);
  const createPlaylist = async (title) => {
    try {
      await api_default.post("/api/playlists", {
        title,
        user_id: user.id
      });
      fetchPlaylists();
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };
  const addSongToPlaylist = async (playlistId, songId) => {
    try {
      await api_default.post(`/api/playlists/${playlistId}/songs`, {
        song_id: songId
      });
    } catch (error) {
      console.error("Error adding song to playlist:", error);
    }
  };
  const toggleLike = async (songId) => {
    if (!user.id)
      return;
    const isCurrentlyLiked = likedSongs.has(songId);
    setLikedSongs((prev) => {
      const next = new Set(prev);
      if (isCurrentlyLiked)
        next.delete(songId);
      else
        next.add(songId);
      return next;
    });
    try {
      const response = await api_default.post(`/api/songs/${songId}/like`, { user_id: user.id });
      if (response.data.liked !== !isCurrentlyLiked) {
        setLikedSongs((prev) => {
          const next = new Set(prev);
          if (response.data.liked)
            next.add(songId);
          else
            next.delete(songId);
          return next;
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      setLikedSongs((prev) => {
        const next = new Set(prev);
        if (isCurrentlyLiked)
          next.add(songId);
        else
          next.delete(songId);
        return next;
      });
      if (toast)
        toast.error("Failed to update library. Connection error.");
    }
  };
  const toggleLikePlaylist = async (playlist) => {
    if (!user.id || !playlist)
      return;
    try {
      const saavnId = playlist.saavn_id || playlist.id;
      if (!saavnId)
        return;
      const isLiked = likedPlaylists.some((p) => p.saavn_playlist_id === saavnId);
      if (isLiked) {
        await api_default.delete(`/api/playlists/liked/${saavnId}`);
        setLikedPlaylists((prev) => prev.filter((p) => p.saavn_playlist_id !== saavnId));
      } else {
        await api_default.post("/api/playlists/liked", {
          user_id: user.id,
          saavn_playlist_id: saavnId,
          title: playlist.title || playlist.name,
          cover_image_url: playlist.cover_image_url || playlist.image
        });
        fetchLikedPlaylists();
      }
    } catch (error) {
      console.error("Error toggling playlist like:", error);
    }
  };
  const fetchAndPlaySimilar = async (seedSong) => {
    if (!seedSong)
      return;
    try {
      const response = await api_default.get(`/api/songs/recommendations/${user.id || 0}`);
      const suggestions = response.data.songs || [];
      if (suggestions.length > 0) {
        const historyIds = new Set(history.map((s) => s.song_id || s.saavn_id));
        historyIds.add(seedSong.song_id || seedSong.saavn_id);
        const freshSongs = suggestions.filter((s) => !historyIds.has(s.song_id || s.saavn_id));
        if (freshSongs.length > 0) {
          startPlayback(freshSongs[0]);
          setQueue(freshSongs.slice(1));
          return;
        }
      }
      setIsPlaying(false);
    } catch (err) {
      console.error("Autoplay fetch failed:", err);
      setIsPlaying(false);
    }
  };
  const recordStream = import_react31.useCallback((songId, listenDuration) => {
    api_default.post(`/api/songs/${songId}/stream`, {
      user_id: user.id ? user.id : null,
      listen_duration: Math.round(listenDuration || 0)
    }).catch((err) => console.error("Stream tracking error:", err));
  }, [user.id]);
  const recordSkip = import_react31.useCallback((songId, skipPosition) => {
    if (!user.id || !songId)
      return;
    api_default.post(`/api/songs/${songId}/skip`, {
      user_id: user.id,
      skip_position: Math.round(skipPosition || 0)
    }).catch((err) => console.error("Skip tracking error:", err));
  }, [user.id]);
  const startPlayback = import_react31.useCallback(async (song) => {
    if (!song)
      return;
    let targetSong = song;
    let adaptiveQuality = "high";
    if (navigator.connection && navigator.connection.effectiveType) {
      if (navigator.connection.effectiveType === "3g")
        adaptiveQuality = "medium";
      else if (navigator.connection.effectiveType === "2g" || navigator.connection.effectiveType === "slow-2g")
        adaptiveQuality = "low";
    }
    if ((song.source === "jiosaavn" || !song.song_id) && song.saavn_id) {
      try {
        const importPayload = { ...song, quality_override: adaptiveQuality };
        const res = await api_default.post("/api/jiosaavn/import", importPayload);
        if (res.data.success) {
          const imported = res.data.song;
          targetSong = {
            song_id: imported.song_id,
            saavn_id: song.saavn_id,
            title: imported.title,
            audio_url: imported.audio_url,
            cover_image_url: imported.cover_image_url,
            duration: imported.duration,
            artist_id: imported.artist_id,
            artist_name: imported.artist_name,
            artists: imported.artists,
            source: "local"
          };
          setQueue((prev) => {
            const next = [...prev];
            const idx = next.findIndex((s) => s.saavn_id === targetSong.saavn_id);
            if (idx >= 0)
              next[idx] = targetSong;
            return next;
          });
        }
      } catch (err) {
        console.error("Auto-import failed during queue progression:", err);
      }
    }
    if (currentSong) {
      let finalDuration = accumulatedDurationRef.current;
      if (lastPlayTimeRef.current && !audioRef.current.paused) {
        finalDuration += (Date.now() - lastPlayTimeRef.current) / 1000;
      }
      if (finalDuration >= 20 && currentSong.song_id) {
        recordStream(currentSong.song_id, finalDuration);
      }
    }
    if (!targetSong.audio_url)
      return;
    const audioUrl = resolveUrl(targetSong.audio_url);
    audioRef.current.src = audioUrl;
    audioRef.current.play().catch((err) => console.error("Playback error:", err));
    setCurrentSong(targetSong);
    setIsPlaying(true);
    accumulatedDurationRef.current = 0;
    lastPlayTimeRef.current = Date.now();
    if ("mediaSession" in navigator) {
      const coverUrl = targetSong.cover_image_url ? resolveUrl(targetSong.cover_image_url) : "";
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: targetSong.title,
        artist: targetSong.artist_name,
        album: targetSong.album_name || "Wave",
        artwork: coverUrl ? [
          { src: coverUrl, sizes: "96x96", type: "image/jpeg" },
          { src: coverUrl, sizes: "256x256", type: "image/jpeg" },
          { src: coverUrl, sizes: "512x512", type: "image/jpeg" }
        ] : []
      });
      navigator.mediaSession.playbackState = "playing";
    }
    if (window.Capacitor && window.Capacitor.isNativePlatform()) {
      try {
        const coverUrl = targetSong.cover_image_url ? resolveUrl(targetSong.cover_image_url) : "";
        CapacitorMusicControls.create({
          track: targetSong.title || "Unknown Track",
          artist: targetSong.artist_name || "Unknown Artist",
          album: targetSong.album_name || "Wave Music",
          cover: coverUrl,
          isPlaying: true,
          dismissable: false,
          hasPrev: true,
          hasNext: true,
          hasClose: true,
          ticker: `Now playing: ${targetSong.title}`,
          playIcon: "media_play",
          pauseIcon: "media_pause",
          prevIcon: "media_prev",
          nextIcon: "media_next",
          closeIcon: "media_close",
          notificationIcon: "notification"
        }).catch((err) => console.error("Native Controls Create Error:", err));
      } catch (err) {
        console.log("CapacitorMusicControls sync error:", err);
      }
    }
  }, [currentSong, recordStream]);
  import_react31.useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", () => togglePlay());
      navigator.mediaSession.setActionHandler("pause", () => togglePlay());
      navigator.mediaSession.setActionHandler("previoustrack", () => playPrevious());
      navigator.mediaSession.setActionHandler("nexttrack", () => playNext());
      navigator.mediaSession.setActionHandler("seekto", (details) => {
        if (details.fastSeek && "fastSeek" in audioRef.current) {
          audioRef.current.fastSeek(details.seekTime);
          return;
        }
        const percentage = details.seekTime / audioRef.current.duration * 100;
        seek(percentage);
      });
    }
  }, [currentSong, queue, history, repeatMode, shuffleMode]);
  import_react31.useEffect(() => {
    const audio = audioRef.current;
    const handleTimeUpdate = () => {
      if (audio.duration) {
        if ("mediaSession" in navigator && navigator.mediaSession.setPositionState) {
          try {
            navigator.mediaSession.setPositionState({
              duration: audio.duration,
              playbackRate: audio.playbackRate,
              position: audio.currentTime
            });
          } catch (e) {}
        }
        if (audio.duration > 0 && audio.currentTime / audio.duration >= 0.7 && queue.length > 0) {
          const nextSong = queue[0];
          let adaptiveQuality = "high";
          if (navigator.connection && navigator.connection.effectiveType) {
            if (navigator.connection.effectiveType === "3g")
              adaptiveQuality = "medium";
            else if (navigator.connection.effectiveType === "2g" || navigator.connection.effectiveType === "slow-2g")
              adaptiveQuality = "low";
          }
          const preloadSource = nextSong.source === "jiosaavn" || !nextSong.song_id ? { ...nextSong, quality_override: adaptiveQuality } : nextSong;
          if (preloadSource.audio_url) {
            const nextUrl = resolveUrl(preloadSource.audio_url);
            if (nextUrl && preloadAudioRef.current.src !== nextUrl) {
              preloadAudioRef.current.src = nextUrl;
              preloadAudioRef.current.load();
            }
          }
        }
      }
    };
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    const handleEnded = () => {
      if (repeatMode === "one") {
        let finalDuration = accumulatedDurationRef.current;
        if (lastPlayTimeRef.current) {
          finalDuration += (Date.now() - lastPlayTimeRef.current) / 1000;
          lastPlayTimeRef.current = Date.now();
        }
        if (finalDuration >= 20 && currentSong?.song_id) {
          recordStream(currentSong.song_id, finalDuration);
        }
        accumulatedDurationRef.current = 0;
        audio.currentTime = 0;
        audio.play();
        return;
      }
      setQueue((prevQueue) => {
        if (prevQueue.length === 0) {
          if (currentSong) {
            setTimeout(() => fetchAndPlaySimilar(currentSong), 0);
          } else {
            setIsPlaying(false);
          }
          return [];
        }
        const nextSong = prevQueue[0];
        const remainingQueue = prevQueue.slice(1);
        if (repeatMode === "all") {
          const nextQueue = [...remainingQueue, currentSong];
          setTimeout(() => startPlayback(nextSong), 0);
          return nextQueue;
        }
        setHistory((prevHist) => [...prevHist, currentSong]);
        setTimeout(() => startPlayback(nextSong), 0);
        return remainingQueue;
      });
    };
    const handlePlay = () => {
      lastPlayTimeRef.current = Date.now();
    };
    const handlePause = () => {
      if (lastPlayTimeRef.current) {
        accumulatedDurationRef.current += (Date.now() - lastPlayTimeRef.current) / 1000;
        lastPlayTimeRef.current = null;
      }
    };
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [queue, startPlayback, repeatMode, shuffleMode, currentSong, history, user.id]);
  import_react31.useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentSong && currentSong.song_id) {
        let finalDuration = accumulatedDurationRef.current;
        if (lastPlayTimeRef.current && !audioRef.current.paused) {
          finalDuration += (Date.now() - lastPlayTimeRef.current) / 1000;
        }
        if (finalDuration >= 20) {
          const apiUrl = resolveBackendUrl(`/api/songs/${currentSong.song_id}/stream`);
          fetch(apiUrl, {
            method: "POST",
            body: JSON.stringify({
              user_id: user.id ? user.id : null,
              listen_duration: Math.round(finalDuration)
            }),
            headers: { "Content-Type": "application/json" },
            keepalive: true
          }).catch((err) => console.error("Unload sync error:", err));
        }
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentSong, user.id]);
  const playSong = (song, songList = null) => {
    if (songList && Array.isArray(songList)) {
      const idx = songList.findIndex((s) => s.song_id && song.song_id && s.song_id === song.song_id || s.saavn_id && song.saavn_id && s.saavn_id === song.saavn_id);
      setQueue(songList.slice(idx >= 0 ? idx + 1 : 1));
    }
    if (currentSong?.song_id === song.song_id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }
    if (songList && Array.isArray(songList)) {
      const idx = songList.findIndex((s) => s.song_id && song.song_id && s.song_id === song.song_id || s.saavn_id && song.saavn_id && s.saavn_id === song.saavn_id);
      setQueue(songList.slice(idx >= 0 ? idx + 1 : 1));
    } else {
      setQueue([]);
    }
    startPlayback(song);
  };
  const playNext = () => {
    if (currentSong?.song_id) {
      let listenedSoFar = accumulatedDurationRef.current;
      if (lastPlayTimeRef.current && !audioRef.current.paused) {
        listenedSoFar += (Date.now() - lastPlayTimeRef.current) / 1000;
      }
      if (listenedSoFar < 30) {
        recordSkip(currentSong.song_id, Math.round(listenedSoFar));
      }
    }
    if (queue.length === 0) {
      if (currentSong)
        fetchAndPlaySimilar(currentSong);
      return;
    }
    setQueue((prevQueue) => {
      if (prevQueue.length === 0)
        return [];
      const nextSong = prevQueue[0];
      const remainingQueue = prevQueue.slice(1);
      if (repeatMode === "all") {
        const nextQueue = [...remainingQueue, currentSong];
        setTimeout(() => startPlayback(nextSong), 0);
        return nextQueue;
      }
      setHistory((prev) => [...prev, currentSong]);
      setTimeout(() => startPlayback(nextSong), 0);
      return remainingQueue;
    });
  };
  const playPrevious = () => {
    if (audioRef.current.currentTime > 3) {
      let finalDuration = accumulatedDurationRef.current;
      if (lastPlayTimeRef.current && !audioRef.current.paused) {
        finalDuration += (Date.now() - lastPlayTimeRef.current) / 1000;
        lastPlayTimeRef.current = Date.now();
      }
      if (finalDuration >= 20 && currentSong?.song_id) {
        recordStream(currentSong.song_id, finalDuration);
      }
      accumulatedDurationRef.current = 0;
      audioRef.current.currentTime = 0;
      return;
    }
    if (history.length === 0) {
      audioRef.current.currentTime = 0;
      return;
    }
    const prevSong = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setQueue((prevQueue) => [currentSong, ...prevQueue]);
    startPlayback(prevSong);
  };
  const togglePlay = () => {
    if (!currentSong)
      return;
    if (isPlaying) {
      audioRef.current.pause();
      if ("mediaSession" in navigator)
        navigator.mediaSession.playbackState = "paused";
      try {
        if (window.Capacitor?.isNativePlatform()) {
          CapacitorMusicControls.updateIsPlaying({ isPlaying: false });
        }
      } catch (e) {}
    } else {
      audioRef.current.play();
      if ("mediaSession" in navigator)
        navigator.mediaSession.playbackState = "playing";
      try {
        if (window.Capacitor?.isNativePlatform()) {
          CapacitorMusicControls.updateIsPlaying({ isPlaying: true });
        }
      } catch (e) {}
    }
    setIsPlaying(!isPlaying);
  };
  const seek = (percentage) => {
    if (!currentSong || !audioRef.current.duration)
      return;
    if (percentage === 0) {
      let finalDuration = accumulatedDurationRef.current;
      if (lastPlayTimeRef.current && !audioRef.current.paused) {
        finalDuration += (Date.now() - lastPlayTimeRef.current) / 1000;
        lastPlayTimeRef.current = Date.now();
      }
      if (finalDuration >= 20 && currentSong.song_id) {
        recordStream(currentSong.song_id, finalDuration);
      }
      accumulatedDurationRef.current = 0;
    }
    const time2 = percentage / 100 * audioRef.current.duration;
    audioRef.current.currentTime = time2;
  };
  import_react31.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);
  const setVolume = (val) => {
    const v = Math.max(0, Math.min(1, val));
    audioRef.current.volume = v;
    setVolumeState(v);
    localStorage.setItem("wave_volume", v.toString());
  };
  const toggleShuffle = () => {
    setShuffleMode((prev) => {
      const next = !prev;
      localStorage.setItem("wave_shuffle", JSON.stringify(next));
      return next;
    });
    setQueue((prevQueue) => {
      if (!shuffleMode && prevQueue.length > 1) {
        return [...prevQueue].sort(() => Math.random() - 0.5);
      }
      return prevQueue;
    });
  };
  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      const next = prev === "off" ? "all" : prev === "all" ? "one" : "off";
      localStorage.setItem("wave_repeat", next);
      return next;
    });
  };
  const addToQueue = (song) => {
    setQueue((prev) => [...prev, song]);
  };
  const removeFromQueue = (index) => {
    setQueue((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };
  const reorderQueue = (sourceIndex, destinationIndex) => {
    if (sourceIndex < 0 || sourceIndex >= queue.length || destinationIndex < 0 || destinationIndex >= queue.length)
      return;
    setQueue((prevQueue) => {
      const newQueue = Array.from(prevQueue);
      const [movedItem] = newQueue.splice(sourceIndex, 1);
      newQueue.splice(destinationIndex, 0, movedItem);
      return newQueue;
    });
  };
  const clearQueue = () => {
    setQueue([]);
  };
  const setSleepTimer = (minutes) => {
    if (sleepTimerRef.current) {
      clearInterval(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }
    if (!minutes || minutes <= 0) {
      setSleepTimerState(null);
      return;
    }
    let remaining = minutes * 60;
    setSleepTimerState(remaining);
    sleepTimerRef.current = setInterval(() => {
      remaining -= 1;
      setSleepTimerState(remaining);
      if (remaining <= 0) {
        clearInterval(sleepTimerRef.current);
        sleepTimerRef.current = null;
        setSleepTimerState(null);
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }, 1000);
  };
  const cancelSleepTimer = () => {
    if (sleepTimerRef.current) {
      clearInterval(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }
    setSleepTimerState(null);
  };
  import_react31.useEffect(() => {
    return () => {
      if (sleepTimerRef.current)
        clearInterval(sleepTimerRef.current);
    };
  }, []);
  import_react31.useEffect(() => {
    const backButtonListener = App.addListener("backButton", () => {
      if (isFullScreenPlayer) {
        setIsFullScreenPlayer(false);
      } else if (window.history.length > 1) {
        window.history.back();
      } else {
        App.exitApp();
      }
    });
    return () => {
      backButtonListener.then((listener) => listener.remove()).catch(() => {});
    };
  }, [isFullScreenPlayer]);
  return /* @__PURE__ */ jsx_dev_runtime2.jsxDEV(PlayerContext.Provider, {
    value: {
      currentSong,
      isPlaying,
      duration,
      volume,
      audioRef,
      likedSongs,
      toggleLike,
      playlists,
      createPlaylist,
      addSongToPlaylist,
      likedPlaylists,
      fetchLikedPlaylists,
      toggleLikePlaylist,
      playSong,
      togglePlay,
      seek,
      setVolume,
      playNext,
      playPrevious,
      queue,
      shuffleMode,
      repeatMode,
      toggleShuffle,
      toggleRepeat,
      addToQueue,
      removeFromQueue,
      clearQueue,
      reorderQueue,
      sleepTimer,
      setSleepTimer,
      cancelSleepTimer,
      isSidebarCollapsed,
      setIsSidebarCollapsed,
      isFullScreenPlayer,
      setIsFullScreenPlayer,
      fetchAndPlaySimilar,
      resolveUrl: resolveBackendUrl
    },
    children
  }, undefined, false, undefined, this);
};
var init_PlayerContext = __esm(() => {
  import_react31 = __toESM(require_react(), 1);
  init_api();
  init_esm();
  init_esm2();
  init_ToastContext();
  jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
  PlayerContext = import_react31.createContext();
});

// src/pages/Dashboard.jsx
var import_react63 = __toESM(require_react(), 1);

// node_modules/react-router/dist/development/chunk-LFPYN7LY.mjs
var React4 = __toESM(require_react(), 1);
var React22 = __toESM(require_react(), 1);
var React32 = __toESM(require_react(), 1);
var React42 = __toESM(require_react(), 1);
var React9 = __toESM(require_react(), 1);
var React8 = __toESM(require_react(), 1);
var React7 = __toESM(require_react(), 1);
var React6 = __toESM(require_react(), 1);
var React5 = __toESM(require_react(), 1);
var React10 = __toESM(require_react(), 1);
var React11 = __toESM(require_react(), 1);
function invariant2(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function warning2(cond, message) {
  if (!cond) {
    if (typeof console !== "undefined")
      console.warn(message);
    try {
      throw new Error(message);
    } catch (e) {}
  }
}
function createPath({
  pathname = "/",
  search = "",
  hash = ""
}) {
  if (search && search !== "?")
    pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#")
    pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substring(hashIndex);
      path = path.substring(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substring(searchIndex);
      path = path.substring(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
var _map;
_map = new WeakMap;
function matchRoutes(routes, locationArg, basename = "/") {
  return matchRoutesImpl(routes, locationArg, basename, false);
}
function matchRoutesImpl(routes, locationArg, basename, allowPartial) {
  let location = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);
  let matches = null;
  for (let i = 0;matches == null && i < branches.length; ++i) {
    let decoded = decodePath(pathname);
    matches = matchRouteBranch(branches[i], decoded, allowPartial);
  }
  return matches;
}
function convertRouteMatchToUiMatch(match, loaderData) {
  let { route, pathname, params } = match;
  return {
    id: route.id,
    pathname,
    params,
    data: loaderData[route.id],
    loaderData: loaderData[route.id],
    handle: route.handle
  };
}
function flattenRoutes(routes, branches = [], parentsMeta = [], parentPath = "", _hasParentOptionalSegments = false) {
  let flattenRoute = (route, index, hasParentOptionalSegments = _hasParentOptionalSegments, relativePath) => {
    let meta = {
      relativePath: relativePath === undefined ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route
    };
    if (meta.relativePath.startsWith("/")) {
      if (!meta.relativePath.startsWith(parentPath) && hasParentOptionalSegments) {
        return;
      }
      invariant2(meta.relativePath.startsWith(parentPath), `Absolute route path "${meta.relativePath}" nested under path "${parentPath}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`);
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);
    if (route.children && route.children.length > 0) {
      invariant2(route.index !== true, `Index routes must not have child routes. Please remove all child routes from route path "${path}".`);
      flattenRoutes(route.children, branches, routesMeta, path, hasParentOptionalSegments);
    }
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes.forEach((route, index) => {
    if (route.path === "" || !route.path?.includes("?")) {
      flattenRoute(route, index);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index, true, exploded);
      }
    }
  });
  return branches;
}
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0)
    return [];
  let [first, ...rest] = segments;
  let isOptional = first.endsWith("?");
  let required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    return isOptional ? [required, ""] : [required];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  result.push(...restExploded.map((subpath) => subpath === "" ? required : [required, subpath].join("/")));
  if (isOptional) {
    result.push(...restExploded);
  }
  return result.map((exploded) => path.startsWith("/") && exploded === "" ? "/" : exploded);
}
function rankRouteBranches(branches) {
  branches.sort((a, b) => a.score !== b.score ? b.score - a.score : compareIndexes(a.routesMeta.map((meta) => meta.childrenIndex), b.routesMeta.map((meta) => meta.childrenIndex)));
}
var paramRe = /^:[\w-]+$/;
var dynamicSegmentValue = 3;
var indexRouteValue = 2;
var emptySegmentValue = 1;
var staticSegmentValue = 10;
var splatPenalty = -2;
var isSplat = (s) => s === "*";
function computeScore(path, index) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index) {
    initialScore += indexRouteValue;
  }
  return segments.filter((s) => !isSplat(s)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
}
function compareIndexes(a, b) {
  let siblings = a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);
  return siblings ? a[a.length - 1] - b[b.length - 1] : 0;
}
function matchRouteBranch(branch, pathname, allowPartial = false) {
  let { routesMeta } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i = 0;i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath({ path: meta.relativePath, caseSensitive: meta.caseSensitive, end }, remainingPathname);
    let route = meta.route;
    if (!match && end && allowPartial && !routesMeta[routesMeta.length - 1].route.index) {
      match = matchPath({
        path: meta.relativePath,
        caseSensitive: meta.caseSensitive,
        end: false
      }, remainingPathname);
    }
    if (!match) {
      return null;
    }
    Object.assign(matchedParams, match.params);
    matches.push({
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
      route
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = { path: pattern, caseSensitive: false, end: true };
  }
  let [matcher, compiledParams] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
  let match = pathname.match(matcher);
  if (!match)
    return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = compiledParams.reduce((memo22, { paramName, isOptional }, index) => {
    if (paramName === "*") {
      let splatValue = captureGroups[index] || "";
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
    }
    const value = captureGroups[index];
    if (isOptional && !value) {
      memo22[paramName] = undefined;
    } else {
      memo22[paramName] = (value || "").replace(/%2F/g, "/");
    }
    return memo22;
  }, {});
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive = false, end = true) {
  warning2(path === "*" || !path.endsWith("*") || path.endsWith("/*"), `Route path "${path}" will be treated as if it were "${path.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${path.replace(/\*$/, "/*")}".`);
  let params = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (match, paramName, isOptional, index, str) => {
    params.push({ paramName, isOptional: isOptional != null });
    if (isOptional) {
      let nextChar = str.charAt(index + match.length);
      if (nextChar && nextChar !== "/") {
        return "/([^\\/]*)";
      }
      return "(?:/([^\\/]*))?";
    }
    return "/([^\\/]+)";
  }).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  if (path.endsWith("*")) {
    params.push({ paramName: "*" });
    regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
  } else if (end) {
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    regexpSource += "(?:(?=\\/|$))";
  } else {}
  let matcher = new RegExp(regexpSource, caseSensitive ? undefined : "i");
  return [matcher, params];
}
function decodePath(value) {
  try {
    return value.split("/").map((v) => decodeURIComponent(v).replace(/\//g, "%2F")).join("/");
  } catch (error) {
    warning2(false, `The URL path "${value}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${error}).`);
    return value;
  }
}
function stripBasename(pathname, basename) {
  if (basename === "/")
    return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
var ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
function resolvePath(to, fromPathname = "/") {
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? parsePath(to) : to;
  let pathname;
  if (toPathname) {
    toPathname = toPathname.replace(/\/\/+/g, "/");
    if (toPathname.startsWith("/")) {
      pathname = resolvePathname(toPathname.substring(1), "/");
    } else {
      pathname = resolvePathname(toPathname, fromPathname);
    }
  } else {
    pathname = fromPathname;
  }
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach((segment) => {
    if (segment === "..") {
      if (segments.length > 1)
        segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
  return `Cannot include a '${char}' character in a manually specified \`to.${field}\` field [${JSON.stringify(path)}].  Please separate it out to the \`to.${dest}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function getPathContributingMatches(matches) {
  return matches.filter((match, index) => index === 0 || match.route.path && match.route.path.length > 0);
}
function getResolveToMatches(matches) {
  let pathMatches = getPathContributingMatches(matches);
  return pathMatches.map((match, idx) => idx === pathMatches.length - 1 ? match.pathname : match.pathnameBase);
}
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative = false) {
  let to;
  if (typeof toArg === "string") {
    to = parsePath(toArg);
  } else {
    to = { ...toArg };
    invariant2(!to.pathname || !to.pathname.includes("?"), getInvalidPathError("?", "pathname", "search", to));
    invariant2(!to.pathname || !to.pathname.includes("#"), getInvalidPathError("#", "pathname", "hash", to));
    invariant2(!to.search || !to.search.includes("#"), getInvalidPathError("#", "search", "hash", to));
  }
  let isEmptyPath = toArg === "" || to.pathname === "";
  let toPathname = isEmptyPath ? "/" : to.pathname;
  let from;
  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;
    if (!isPathRelative && toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }
      to.pathname = toSegments.join("/");
    }
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to, from);
  let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }
  return path;
}
var joinPaths = (paths) => paths.join("/").replace(/\/\/+/g, "/");
var normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
var normalizeSearch = (search) => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
var normalizeHash = (hash) => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
var ErrorResponseImpl = class {
  constructor(status, statusText, data2, internal = false) {
    this.status = status;
    this.statusText = statusText || "";
    this.internal = internal;
    if (data2 instanceof Error) {
      this.data = data2.toString();
      this.error = data2;
    } else {
      this.data = data2;
    }
  }
};
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}
function getRoutePattern(matches) {
  return matches.map((m2) => m2.route.path).filter(Boolean).join("/").replace(/\/\/*/g, "/") || "/";
}
var isBrowser3 = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
function parseToInfo(_to, basename) {
  let to = _to;
  if (typeof to !== "string" || !ABSOLUTE_URL_REGEX.test(to)) {
    return {
      absoluteURL: undefined,
      isExternal: false,
      to
    };
  }
  let absoluteURL = to;
  let isExternal = false;
  if (isBrowser3) {
    try {
      let currentUrl = new URL(window.location.href);
      let targetUrl = to.startsWith("//") ? new URL(currentUrl.protocol + to) : new URL(to);
      let path = stripBasename(targetUrl.pathname, basename);
      if (targetUrl.origin === currentUrl.origin && path != null) {
        to = path + targetUrl.search + targetUrl.hash;
      } else {
        isExternal = true;
      }
    } catch (e) {
      warning2(false, `<Link to="${to}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`);
    }
  }
  return {
    absoluteURL,
    isExternal,
    to
  };
}
var UninstrumentedSymbol = Symbol("Uninstrumented");
var objectProtoNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\x00");
var validMutationMethodsArr = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
];
var validMutationMethods = new Set(validMutationMethodsArr);
var validRequestMethodsArr = [
  "GET",
  ...validMutationMethodsArr
];
var validRequestMethods = new Set(validRequestMethodsArr);
var ResetLoaderDataSymbol = Symbol("ResetLoaderData");
var DataRouterContext = React4.createContext(null);
DataRouterContext.displayName = "DataRouter";
var DataRouterStateContext = React4.createContext(null);
DataRouterStateContext.displayName = "DataRouterState";
var RSCRouterContext = React4.createContext(false);
var ViewTransitionContext = React4.createContext({
  isTransitioning: false
});
ViewTransitionContext.displayName = "ViewTransition";
var FetchersContext = React4.createContext(/* @__PURE__ */ new Map);
FetchersContext.displayName = "Fetchers";
var AwaitContext = React4.createContext(null);
AwaitContext.displayName = "Await";
var NavigationContext = React4.createContext(null);
NavigationContext.displayName = "Navigation";
var LocationContext = React4.createContext(null);
LocationContext.displayName = "Location";
var RouteContext = React4.createContext({
  outlet: null,
  matches: [],
  isDataRoute: false
});
RouteContext.displayName = "Route";
var RouteErrorContext = React4.createContext(null);
RouteErrorContext.displayName = "RouteError";
var ENABLE_DEV_WARNINGS = true;
var ERROR_DIGEST_BASE = "REACT_ROUTER_ERROR";
var ERROR_DIGEST_REDIRECT = "REDIRECT";
var ERROR_DIGEST_ROUTE_ERROR_RESPONSE = "ROUTE_ERROR_RESPONSE";
function decodeRedirectErrorDigest(digest) {
  if (digest.startsWith(`${ERROR_DIGEST_BASE}:${ERROR_DIGEST_REDIRECT}:{`)) {
    try {
      let parsed = JSON.parse(digest.slice(28));
      if (typeof parsed === "object" && parsed && typeof parsed.status === "number" && typeof parsed.statusText === "string" && typeof parsed.location === "string" && typeof parsed.reloadDocument === "boolean" && typeof parsed.replace === "boolean") {
        return parsed;
      }
    } catch {}
  }
}
function decodeRouteErrorResponseDigest(digest) {
  if (digest.startsWith(`${ERROR_DIGEST_BASE}:${ERROR_DIGEST_ROUTE_ERROR_RESPONSE}:{`)) {
    try {
      let parsed = JSON.parse(digest.slice(40));
      if (typeof parsed === "object" && parsed && typeof parsed.status === "number" && typeof parsed.statusText === "string") {
        return new ErrorResponseImpl(parsed.status, parsed.statusText, parsed.data);
      }
    } catch {}
  }
}
function useHref(to, { relative } = {}) {
  invariant2(useInRouterContext(), `useHref() may be used only in the context of a <Router> component.`);
  let { basename, navigator: navigator2 } = React22.useContext(NavigationContext);
  let { hash, pathname, search } = useResolvedPath(to, { relative });
  let joinedPathname = pathname;
  if (basename !== "/") {
    joinedPathname = pathname === "/" ? basename : joinPaths([basename, pathname]);
  }
  return navigator2.createHref({ pathname: joinedPathname, search, hash });
}
function useInRouterContext() {
  return React22.useContext(LocationContext) != null;
}
function useLocation() {
  invariant2(useInRouterContext(), `useLocation() may be used only in the context of a <Router> component.`);
  return React22.useContext(LocationContext).location;
}
var navigateEffectWarning = `You should call navigate() in a React.useEffect(), not when your component is first rendered.`;
function useIsomorphicLayoutEffect2(cb) {
  let isStatic = React22.useContext(NavigationContext).static;
  if (!isStatic) {
    React22.useLayoutEffect(cb);
  }
}
function useNavigate() {
  let { isDataRoute } = React22.useContext(RouteContext);
  return isDataRoute ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
  invariant2(useInRouterContext(), `useNavigate() may be used only in the context of a <Router> component.`);
  let dataRouterContext = React22.useContext(DataRouterContext);
  let { basename, navigator: navigator2 } = React22.useContext(NavigationContext);
  let { matches } = React22.useContext(RouteContext);
  let { pathname: locationPathname } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches));
  let activeRef = React22.useRef(false);
  useIsomorphicLayoutEffect2(() => {
    activeRef.current = true;
  });
  let navigate = React22.useCallback((to, options = {}) => {
    warning2(activeRef.current, navigateEffectWarning);
    if (!activeRef.current)
      return;
    if (typeof to === "number") {
      navigator2.go(to);
      return;
    }
    let path = resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, options.relative === "path");
    if (dataRouterContext == null && basename !== "/") {
      path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
    }
    (options.replace ? navigator2.replace : navigator2.push)(path, options.state, options);
  }, [
    basename,
    navigator2,
    routePathnamesJson,
    locationPathname,
    dataRouterContext
  ]);
  return navigate;
}
var OutletContext = React22.createContext(null);
function useParams() {
  let { matches } = React22.useContext(RouteContext);
  let routeMatch = matches[matches.length - 1];
  return routeMatch ? routeMatch.params : {};
}
function useResolvedPath(to, { relative } = {}) {
  let { matches } = React22.useContext(RouteContext);
  let { pathname: locationPathname } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches));
  return React22.useMemo(() => resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, relative === "path"), [to, routePathnamesJson, locationPathname, relative]);
}
function useRoutesImpl(routes, locationArg, dataRouterOpts) {
  invariant2(useInRouterContext(), `useRoutes() may be used only in the context of a <Router> component.`);
  let { navigator: navigator2 } = React22.useContext(NavigationContext);
  let { matches: parentMatches } = React22.useContext(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  let parentPathname = routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  let parentRoute = routeMatch && routeMatch.route;
  if (ENABLE_DEV_WARNINGS) {
    let parentPath = parentRoute && parentRoute.path || "";
    warningOnce(parentPathname, !parentRoute || parentPath.endsWith("*") || parentPath.endsWith("*?"), `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${parentPathname}" (under <Route path="${parentPath}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${parentPath}"> to <Route path="${parentPath === "/" ? "*" : `${parentPath}/*`}">.`);
  }
  let locationFromContext = useLocation();
  let location;
  if (locationArg) {
    let parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
    invariant2(parentPathnameBase === "/" || parsedLocationArg.pathname?.startsWith(parentPathnameBase), `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${parentPathnameBase}" but pathname "${parsedLocationArg.pathname}" was given in the \`location\` prop.`);
    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }
  let pathname = location.pathname || "/";
  let remainingPathname = pathname;
  if (parentPathnameBase !== "/") {
    let parentSegments = parentPathnameBase.replace(/^\//, "").split("/");
    let segments = pathname.replace(/^\//, "").split("/");
    remainingPathname = "/" + segments.slice(parentSegments.length).join("/");
  }
  let matches = matchRoutes(routes, { pathname: remainingPathname });
  if (ENABLE_DEV_WARNINGS) {
    warning2(parentRoute || matches != null, `No routes matched location "${location.pathname}${location.search}${location.hash}" `);
    warning2(matches == null || matches[matches.length - 1].route.element !== undefined || matches[matches.length - 1].route.Component !== undefined || matches[matches.length - 1].route.lazy !== undefined, `Matched leaf route at location "${location.pathname}${location.search}${location.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`);
  }
  let renderedMatches = _renderMatches(matches && matches.map((match) => Object.assign({}, match, {
    params: Object.assign({}, parentParams, match.params),
    pathname: joinPaths([
      parentPathnameBase,
      navigator2.encodeLocation ? navigator2.encodeLocation(match.pathname.replace(/\?/g, "%3F").replace(/#/g, "%23")).pathname : match.pathname
    ]),
    pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([
      parentPathnameBase,
      navigator2.encodeLocation ? navigator2.encodeLocation(match.pathnameBase.replace(/\?/g, "%3F").replace(/#/g, "%23")).pathname : match.pathnameBase
    ])
  })), parentMatches, dataRouterOpts);
  if (locationArg && renderedMatches) {
    return /* @__PURE__ */ React22.createElement(LocationContext.Provider, {
      value: {
        location: {
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default",
          unstable_mask: undefined,
          ...location
        },
        navigationType: "POP"
      }
    }, renderedMatches);
  }
  return renderedMatches;
}
function DefaultErrorComponent() {
  let error = useRouteError();
  let message = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : error instanceof Error ? error.message : JSON.stringify(error);
  let stack = error instanceof Error ? error.stack : null;
  let lightgrey = "rgba(200,200,200, 0.5)";
  let preStyles = { padding: "0.5rem", backgroundColor: lightgrey };
  let codeStyles = { padding: "2px 4px", backgroundColor: lightgrey };
  let devInfo = null;
  if (ENABLE_DEV_WARNINGS) {
    console.error("Error handled by React Router default ErrorBoundary:", error);
    devInfo = /* @__PURE__ */ React22.createElement(React22.Fragment, null, /* @__PURE__ */ React22.createElement("p", null, "\uD83D\uDCBF Hey developer \uD83D\uDC4B"), /* @__PURE__ */ React22.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ React22.createElement("code", { style: codeStyles }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ React22.createElement("code", { style: codeStyles }, "errorElement"), " prop on your route."));
  }
  return /* @__PURE__ */ React22.createElement(React22.Fragment, null, /* @__PURE__ */ React22.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ React22.createElement("h3", { style: { fontStyle: "italic" } }, message), stack ? /* @__PURE__ */ React22.createElement("pre", { style: preStyles }, stack) : null, devInfo);
}
var defaultErrorElement = /* @__PURE__ */ React22.createElement(DefaultErrorComponent, null);
var RenderErrorBoundary = class extends React22.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      revalidation: props.revalidation,
      error: props.error
    };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") {
      return {
        error: props.error,
        location: props.location,
        revalidation: props.revalidation
      };
    }
    return {
      error: props.error !== undefined ? props.error : state.error,
      location: state.location,
      revalidation: props.revalidation || state.revalidation
    };
  }
  componentDidCatch(error, errorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    } else {
      console.error("React Router caught the following error during render", error);
    }
  }
  render() {
    let error = this.state.error;
    if (this.context && typeof error === "object" && error && "digest" in error && typeof error.digest === "string") {
      const decoded = decodeRouteErrorResponseDigest(error.digest);
      if (decoded)
        error = decoded;
    }
    let result = error !== undefined ? /* @__PURE__ */ React22.createElement(RouteContext.Provider, { value: this.props.routeContext }, /* @__PURE__ */ React22.createElement(RouteErrorContext.Provider, {
      value: error,
      children: this.props.component
    })) : this.props.children;
    if (this.context) {
      return /* @__PURE__ */ React22.createElement(RSCErrorHandler, { error }, result);
    }
    return result;
  }
};
RenderErrorBoundary.contextType = RSCRouterContext;
var errorRedirectHandledMap = /* @__PURE__ */ new WeakMap;
function RSCErrorHandler({
  children,
  error
}) {
  let { basename } = React22.useContext(NavigationContext);
  if (typeof error === "object" && error && "digest" in error && typeof error.digest === "string") {
    let redirect2 = decodeRedirectErrorDigest(error.digest);
    if (redirect2) {
      let existingRedirect = errorRedirectHandledMap.get(error);
      if (existingRedirect)
        throw existingRedirect;
      let parsed = parseToInfo(redirect2.location, basename);
      if (isBrowser3 && !errorRedirectHandledMap.get(error)) {
        if (parsed.isExternal || redirect2.reloadDocument) {
          window.location.href = parsed.absoluteURL || parsed.to;
        } else {
          const redirectPromise = Promise.resolve().then(() => window.__reactRouterDataRouter.navigate(parsed.to, {
            replace: redirect2.replace
          }));
          errorRedirectHandledMap.set(error, redirectPromise);
          throw redirectPromise;
        }
      }
      return /* @__PURE__ */ React22.createElement("meta", {
        httpEquiv: "refresh",
        content: `0;url=${parsed.absoluteURL || parsed.to}`
      });
    }
  }
  return children;
}
function RenderedRoute({ routeContext, match, children }) {
  let dataRouterContext = React22.useContext(DataRouterContext);
  if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) {
    dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
  }
  return /* @__PURE__ */ React22.createElement(RouteContext.Provider, { value: routeContext }, children);
}
function _renderMatches(matches, parentMatches = [], dataRouterOpts) {
  let dataRouterState = dataRouterOpts?.state;
  if (matches == null) {
    if (!dataRouterState) {
      return null;
    }
    if (dataRouterState.errors) {
      matches = dataRouterState.matches;
    } else if (parentMatches.length === 0 && !dataRouterState.initialized && dataRouterState.matches.length > 0) {
      matches = dataRouterState.matches;
    } else {
      return null;
    }
  }
  let renderedMatches = matches;
  let errors = dataRouterState?.errors;
  if (errors != null) {
    let errorIndex = renderedMatches.findIndex((m2) => m2.route.id && errors?.[m2.route.id] !== undefined);
    invariant2(errorIndex >= 0, `Could not find a matching route for errors on route IDs: ${Object.keys(errors).join(",")}`);
    renderedMatches = renderedMatches.slice(0, Math.min(renderedMatches.length, errorIndex + 1));
  }
  let renderFallback = false;
  let fallbackIndex = -1;
  if (dataRouterOpts && dataRouterState) {
    renderFallback = dataRouterState.renderFallback;
    for (let i = 0;i < renderedMatches.length; i++) {
      let match = renderedMatches[i];
      if (match.route.HydrateFallback || match.route.hydrateFallbackElement) {
        fallbackIndex = i;
      }
      if (match.route.id) {
        let { loaderData, errors: errors2 } = dataRouterState;
        let needsToRunLoader = match.route.loader && !loaderData.hasOwnProperty(match.route.id) && (!errors2 || errors2[match.route.id] === undefined);
        if (match.route.lazy || needsToRunLoader) {
          if (dataRouterOpts.isStatic) {
            renderFallback = true;
          }
          if (fallbackIndex >= 0) {
            renderedMatches = renderedMatches.slice(0, fallbackIndex + 1);
          } else {
            renderedMatches = [renderedMatches[0]];
          }
          break;
        }
      }
    }
  }
  let onErrorHandler = dataRouterOpts?.onError;
  let onError = dataRouterState && onErrorHandler ? (error, errorInfo) => {
    onErrorHandler(error, {
      location: dataRouterState.location,
      params: dataRouterState.matches?.[0]?.params ?? {},
      unstable_pattern: getRoutePattern(dataRouterState.matches),
      errorInfo
    });
  } : undefined;
  return renderedMatches.reduceRight((outlet, match, index) => {
    let error;
    let shouldRenderHydrateFallback = false;
    let errorElement = null;
    let hydrateFallbackElement = null;
    if (dataRouterState) {
      error = errors && match.route.id ? errors[match.route.id] : undefined;
      errorElement = match.route.errorElement || defaultErrorElement;
      if (renderFallback) {
        if (fallbackIndex < 0 && index === 0) {
          warningOnce("route-fallback", false, "No `HydrateFallback` element provided to render during initial hydration");
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = null;
        } else if (fallbackIndex === index) {
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = match.route.hydrateFallbackElement || null;
        }
      }
    }
    let matches2 = parentMatches.concat(renderedMatches.slice(0, index + 1));
    let getChildren = () => {
      let children;
      if (error) {
        children = errorElement;
      } else if (shouldRenderHydrateFallback) {
        children = hydrateFallbackElement;
      } else if (match.route.Component) {
        children = /* @__PURE__ */ React22.createElement(match.route.Component, null);
      } else if (match.route.element) {
        children = match.route.element;
      } else {
        children = outlet;
      }
      return /* @__PURE__ */ React22.createElement(RenderedRoute, {
        match,
        routeContext: {
          outlet,
          matches: matches2,
          isDataRoute: dataRouterState != null
        },
        children
      });
    };
    return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index === 0) ? /* @__PURE__ */ React22.createElement(RenderErrorBoundary, {
      location: dataRouterState.location,
      revalidation: dataRouterState.revalidation,
      component: errorElement,
      error,
      children: getChildren(),
      routeContext: { outlet: null, matches: matches2, isDataRoute: true },
      onError
    }) : getChildren();
  }, null);
}
function getDataRouterConsoleError(hookName) {
  return `${hookName} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function useDataRouterContext(hookName) {
  let ctx = React22.useContext(DataRouterContext);
  invariant2(ctx, getDataRouterConsoleError(hookName));
  return ctx;
}
function useDataRouterState(hookName) {
  let state = React22.useContext(DataRouterStateContext);
  invariant2(state, getDataRouterConsoleError(hookName));
  return state;
}
function useRouteContext(hookName) {
  let route = React22.useContext(RouteContext);
  invariant2(route, getDataRouterConsoleError(hookName));
  return route;
}
function useCurrentRouteId(hookName) {
  let route = useRouteContext(hookName);
  let thisRoute = route.matches[route.matches.length - 1];
  invariant2(thisRoute.route.id, `${hookName} can only be used on routes that contain a unique "id"`);
  return thisRoute.route.id;
}
function useRouteId() {
  return useCurrentRouteId("useRouteId");
}
function useNavigation() {
  let state = useDataRouterState("useNavigation");
  return state.navigation;
}
function useMatches() {
  let { matches, loaderData } = useDataRouterState("useMatches");
  return React22.useMemo(() => matches.map((m2) => convertRouteMatchToUiMatch(m2, loaderData)), [matches, loaderData]);
}
function useRouteError() {
  let error = React22.useContext(RouteErrorContext);
  let state = useDataRouterState("useRouteError");
  let routeId = useCurrentRouteId("useRouteError");
  if (error !== undefined) {
    return error;
  }
  return state.errors?.[routeId];
}
function useNavigateStable() {
  let { router } = useDataRouterContext("useNavigate");
  let id3 = useCurrentRouteId("useNavigate");
  let activeRef = React22.useRef(false);
  useIsomorphicLayoutEffect2(() => {
    activeRef.current = true;
  });
  let navigate = React22.useCallback(async (to, options = {}) => {
    warning2(activeRef.current, navigateEffectWarning);
    if (!activeRef.current)
      return;
    if (typeof to === "number") {
      await router.navigate(to);
    } else {
      await router.navigate(to, { fromRouteId: id3, ...options });
    }
  }, [router, id3]);
  return navigate;
}
var alreadyWarned = {};
function warningOnce(key, cond, message) {
  if (!cond && !alreadyWarned[key]) {
    alreadyWarned[key] = true;
    warning2(false, message);
  }
}
var USE_OPTIMISTIC = "useOptimistic";
var useOptimisticImpl = React32[USE_OPTIMISTIC];
var MemoizedDataRoutes = React32.memo(DataRoutes);
function DataRoutes({
  routes,
  future,
  state,
  isStatic,
  onError
}) {
  return useRoutesImpl(routes, undefined, { state, isStatic, onError, future });
}
function Router({
  basename: basenameProp = "/",
  children = null,
  location: locationProp,
  navigationType = "POP",
  navigator: navigator2,
  static: staticProp = false,
  unstable_useTransitions
}) {
  invariant2(!useInRouterContext(), `You cannot render a <Router> inside another <Router>. You should never have more than one in your app.`);
  let basename = basenameProp.replace(/^\/*/, "/");
  let navigationContext = React32.useMemo(() => ({
    basename,
    navigator: navigator2,
    static: staticProp,
    unstable_useTransitions,
    future: {}
  }), [basename, navigator2, staticProp, unstable_useTransitions]);
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default",
    unstable_mask
  } = locationProp;
  let locationContext = React32.useMemo(() => {
    let trailingPathname = stripBasename(pathname, basename);
    if (trailingPathname == null) {
      return null;
    }
    return {
      location: {
        pathname: trailingPathname,
        search,
        hash,
        state,
        key,
        unstable_mask
      },
      navigationType
    };
  }, [
    basename,
    pathname,
    search,
    hash,
    state,
    key,
    navigationType,
    unstable_mask
  ]);
  warning2(locationContext != null, `<Router basename="${basename}"> is not able to match the URL "${pathname}${search}${hash}" because it does not start with the basename, so the <Router> won't render anything.`);
  if (locationContext == null) {
    return null;
  }
  return /* @__PURE__ */ React32.createElement(NavigationContext.Provider, { value: navigationContext }, /* @__PURE__ */ React32.createElement(LocationContext.Provider, { children, value: locationContext }));
}
var defaultMethod = "get";
var defaultEncType = "application/x-www-form-urlencoded";
function isHtmlElement(object) {
  return typeof HTMLElement !== "undefined" && object instanceof HTMLElement;
}
function isButtonElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "button";
}
function isFormElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "form";
}
function isInputElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "input";
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function shouldProcessLinkClick(event, target) {
  return event.button === 0 && (!target || target === "_self") && !isModifiedEvent(event);
}
var _formDataSupportsSubmitter = null;
function isFormDataSubmitterSupported() {
  if (_formDataSupportsSubmitter === null) {
    try {
      new FormData(document.createElement("form"), 0);
      _formDataSupportsSubmitter = false;
    } catch (e) {
      _formDataSupportsSubmitter = true;
    }
  }
  return _formDataSupportsSubmitter;
}
var supportedFormEncTypes = /* @__PURE__ */ new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
]);
function getFormEncType(encType) {
  if (encType != null && !supportedFormEncTypes.has(encType)) {
    warning2(false, `"${encType}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${defaultEncType}"`);
    return null;
  }
  return encType;
}
function getFormSubmissionInfo(target, basename) {
  let method;
  let action;
  let encType;
  let formData;
  let body;
  if (isFormElement(target)) {
    let attr = target.getAttribute("action");
    action = attr ? stripBasename(attr, basename) : null;
    method = target.getAttribute("method") || defaultMethod;
    encType = getFormEncType(target.getAttribute("enctype")) || defaultEncType;
    formData = new FormData(target);
  } else if (isButtonElement(target) || isInputElement(target) && (target.type === "submit" || target.type === "image")) {
    let form = target.form;
    if (form == null) {
      throw new Error(`Cannot submit a <button> or <input type="submit"> without a <form>`);
    }
    let attr = target.getAttribute("formaction") || form.getAttribute("action");
    action = attr ? stripBasename(attr, basename) : null;
    method = target.getAttribute("formmethod") || form.getAttribute("method") || defaultMethod;
    encType = getFormEncType(target.getAttribute("formenctype")) || getFormEncType(form.getAttribute("enctype")) || defaultEncType;
    formData = new FormData(form, target);
    if (!isFormDataSubmitterSupported()) {
      let { name, type, value } = target;
      if (type === "image") {
        let prefix = name ? `${name}.` : "";
        formData.append(`${prefix}x`, "0");
        formData.append(`${prefix}y`, "0");
      } else if (name) {
        formData.append(name, value);
      }
    }
  } else if (isHtmlElement(target)) {
    throw new Error(`Cannot submit element that is not <form>, <button>, or <input type="submit|image">`);
  } else {
    method = defaultMethod;
    action = null;
    encType = defaultEncType;
    body = target;
  }
  if (formData && encType === "text/plain") {
    body = formData;
    formData = undefined;
  }
  return { action, method: method.toLowerCase(), encType, formData, body };
}
var objectProtoNames2 = Object.getOwnPropertyNames(Object.prototype).sort().join("\x00");
var ESCAPE_LOOKUP = {
  "&": "\\u0026",
  ">": "\\u003e",
  "<": "\\u003c",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var ESCAPE_REGEX = /[&><\u2028\u2029]/g;
function escapeHtml(html) {
  return html.replace(ESCAPE_REGEX, (match) => ESCAPE_LOOKUP[match]);
}
function invariant22(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
var SingleFetchRedirectSymbol = Symbol("SingleFetchRedirect");
function singleFetchUrl(reqUrl, basename, trailingSlashAware, extension) {
  let url = typeof reqUrl === "string" ? new URL(reqUrl, typeof window === "undefined" ? "server://singlefetch/" : window.location.origin) : reqUrl;
  if (trailingSlashAware) {
    if (url.pathname.endsWith("/")) {
      url.pathname = `${url.pathname}_.${extension}`;
    } else {
      url.pathname = `${url.pathname}.${extension}`;
    }
  } else {
    if (url.pathname === "/") {
      url.pathname = `_root.${extension}`;
    } else if (basename && stripBasename(url.pathname, basename) === "/") {
      url.pathname = `${basename.replace(/\/$/, "")}/_root.${extension}`;
    } else {
      url.pathname = `${url.pathname.replace(/\/$/, "")}.${extension}`;
    }
  }
  return url;
}
async function loadRouteModule(route, routeModulesCache) {
  if (route.id in routeModulesCache) {
    return routeModulesCache[route.id];
  }
  try {
    let routeModule = await import(route.module);
    routeModulesCache[route.id] = routeModule;
    return routeModule;
  } catch (error) {
    console.error(`Error loading route module \`${route.module}\`, reloading page...`);
    console.error(error);
    if (window.__reactRouterContext && window.__reactRouterContext.isSpaMode && undefined) {}
    window.location.reload();
    return new Promise(() => {});
  }
}
function isPageLinkDescriptor(object) {
  return object != null && typeof object.page === "string";
}
function isHtmlLinkDescriptor(object) {
  if (object == null) {
    return false;
  }
  if (object.href == null) {
    return object.rel === "preload" && typeof object.imageSrcSet === "string" && typeof object.imageSizes === "string";
  }
  return typeof object.rel === "string" && typeof object.href === "string";
}
async function getKeyedPrefetchLinks(matches, manifest, routeModules) {
  let links = await Promise.all(matches.map(async (match) => {
    let route = manifest.routes[match.route.id];
    if (route) {
      let mod = await loadRouteModule(route, routeModules);
      return mod.links ? mod.links() : [];
    }
    return [];
  }));
  return dedupeLinkDescriptors(links.flat(1).filter(isHtmlLinkDescriptor).filter((link) => link.rel === "stylesheet" || link.rel === "preload").map((link) => link.rel === "stylesheet" ? { ...link, rel: "prefetch", as: "style" } : { ...link, rel: "prefetch" }));
}
function getNewMatchesForLinks(page, nextMatches, currentMatches, manifest, location, mode) {
  let isNew = (match, index) => {
    if (!currentMatches[index])
      return true;
    return match.route.id !== currentMatches[index].route.id;
  };
  let matchPathChanged = (match, index) => {
    return currentMatches[index].pathname !== match.pathname || currentMatches[index].route.path?.endsWith("*") && currentMatches[index].params["*"] !== match.params["*"];
  };
  if (mode === "assets") {
    return nextMatches.filter((match, index) => isNew(match, index) || matchPathChanged(match, index));
  }
  if (mode === "data") {
    return nextMatches.filter((match, index) => {
      let manifestRoute = manifest.routes[match.route.id];
      if (!manifestRoute || !manifestRoute.hasLoader) {
        return false;
      }
      if (isNew(match, index) || matchPathChanged(match, index)) {
        return true;
      }
      if (match.route.shouldRevalidate) {
        let routeChoice = match.route.shouldRevalidate({
          currentUrl: new URL(location.pathname + location.search + location.hash, window.origin),
          currentParams: currentMatches[0]?.params || {},
          nextUrl: new URL(page, window.origin),
          nextParams: match.params,
          defaultShouldRevalidate: true
        });
        if (typeof routeChoice === "boolean") {
          return routeChoice;
        }
      }
      return true;
    });
  }
  return [];
}
function getModuleLinkHrefs(matches, manifest, { includeHydrateFallback } = {}) {
  return dedupeHrefs(matches.map((match) => {
    let route = manifest.routes[match.route.id];
    if (!route)
      return [];
    let hrefs = [route.module];
    if (route.clientActionModule) {
      hrefs = hrefs.concat(route.clientActionModule);
    }
    if (route.clientLoaderModule) {
      hrefs = hrefs.concat(route.clientLoaderModule);
    }
    if (includeHydrateFallback && route.hydrateFallbackModule) {
      hrefs = hrefs.concat(route.hydrateFallbackModule);
    }
    if (route.imports) {
      hrefs = hrefs.concat(route.imports);
    }
    return hrefs;
  }).flat(1));
}
function dedupeHrefs(hrefs) {
  return [...new Set(hrefs)];
}
function sortKeys(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();
  for (let key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}
function dedupeLinkDescriptors(descriptors, preloads) {
  let set = /* @__PURE__ */ new Set;
  let preloadsSet = new Set(preloads);
  return descriptors.reduce((deduped, descriptor) => {
    let alreadyModulePreload = preloads && !isPageLinkDescriptor(descriptor) && descriptor.as === "script" && descriptor.href && preloadsSet.has(descriptor.href);
    if (alreadyModulePreload) {
      return deduped;
    }
    let key = JSON.stringify(sortKeys(descriptor));
    if (!set.has(key)) {
      set.add(key);
      deduped.push({ key, link: descriptor });
    }
    return deduped;
  }, []);
}
function useDataRouterContext2() {
  let context = React8.useContext(DataRouterContext);
  invariant22(context, "You must render this element inside a <DataRouterContext.Provider> element");
  return context;
}
function useDataRouterStateContext() {
  let context = React8.useContext(DataRouterStateContext);
  invariant22(context, "You must render this element inside a <DataRouterStateContext.Provider> element");
  return context;
}
var FrameworkContext = React8.createContext(undefined);
FrameworkContext.displayName = "FrameworkContext";
function useFrameworkContext() {
  let context = React8.useContext(FrameworkContext);
  invariant22(context, "You must render this element inside a <HydratedRouter> element");
  return context;
}
function usePrefetchBehavior(prefetch, theirElementProps) {
  let frameworkContext = React8.useContext(FrameworkContext);
  let [maybePrefetch, setMaybePrefetch] = React8.useState(false);
  let [shouldPrefetch, setShouldPrefetch] = React8.useState(false);
  let { onFocus, onBlur, onMouseEnter, onMouseLeave, onTouchStart } = theirElementProps;
  let ref = React8.useRef(null);
  React8.useEffect(() => {
    if (prefetch === "render") {
      setShouldPrefetch(true);
    }
    if (prefetch === "viewport") {
      let callback = (entries) => {
        entries.forEach((entry) => {
          setShouldPrefetch(entry.isIntersecting);
        });
      };
      let observer2 = new IntersectionObserver(callback, { threshold: 0.5 });
      if (ref.current)
        observer2.observe(ref.current);
      return () => {
        observer2.disconnect();
      };
    }
  }, [prefetch]);
  React8.useEffect(() => {
    if (maybePrefetch) {
      let id3 = setTimeout(() => {
        setShouldPrefetch(true);
      }, 100);
      return () => {
        clearTimeout(id3);
      };
    }
  }, [maybePrefetch]);
  let setIntent = () => {
    setMaybePrefetch(true);
  };
  let cancelIntent = () => {
    setMaybePrefetch(false);
    setShouldPrefetch(false);
  };
  if (!frameworkContext) {
    return [false, ref, {}];
  }
  if (prefetch !== "intent") {
    return [shouldPrefetch, ref, {}];
  }
  return [
    shouldPrefetch,
    ref,
    {
      onFocus: composeEventHandlers(onFocus, setIntent),
      onBlur: composeEventHandlers(onBlur, cancelIntent),
      onMouseEnter: composeEventHandlers(onMouseEnter, setIntent),
      onMouseLeave: composeEventHandlers(onMouseLeave, cancelIntent),
      onTouchStart: composeEventHandlers(onTouchStart, setIntent)
    }
  ];
}
function composeEventHandlers(theirHandler, ourHandler) {
  return (event) => {
    theirHandler && theirHandler(event);
    if (!event.defaultPrevented) {
      ourHandler(event);
    }
  };
}
function PrefetchPageLinks({ page, ...linkProps }) {
  let { router } = useDataRouterContext2();
  let matches = React8.useMemo(() => matchRoutes(router.routes, page, router.basename), [router.routes, page, router.basename]);
  if (!matches) {
    return null;
  }
  return /* @__PURE__ */ React8.createElement(PrefetchPageLinksImpl, { page, matches, ...linkProps });
}
function useKeyedPrefetchLinks(matches) {
  let { manifest, routeModules } = useFrameworkContext();
  let [keyedPrefetchLinks, setKeyedPrefetchLinks] = React8.useState([]);
  React8.useEffect(() => {
    let interrupted = false;
    getKeyedPrefetchLinks(matches, manifest, routeModules).then((links) => {
      if (!interrupted) {
        setKeyedPrefetchLinks(links);
      }
    });
    return () => {
      interrupted = true;
    };
  }, [matches, manifest, routeModules]);
  return keyedPrefetchLinks;
}
function PrefetchPageLinksImpl({
  page,
  matches: nextMatches,
  ...linkProps
}) {
  let location = useLocation();
  let { future, manifest, routeModules } = useFrameworkContext();
  let { basename } = useDataRouterContext2();
  let { loaderData, matches } = useDataRouterStateContext();
  let newMatchesForData = React8.useMemo(() => getNewMatchesForLinks(page, nextMatches, matches, manifest, location, "data"), [page, nextMatches, matches, manifest, location]);
  let newMatchesForAssets = React8.useMemo(() => getNewMatchesForLinks(page, nextMatches, matches, manifest, location, "assets"), [page, nextMatches, matches, manifest, location]);
  let dataHrefs = React8.useMemo(() => {
    if (page === location.pathname + location.search + location.hash) {
      return [];
    }
    let routesParams = /* @__PURE__ */ new Set;
    let foundOptOutRoute = false;
    nextMatches.forEach((m2) => {
      let manifestRoute = manifest.routes[m2.route.id];
      if (!manifestRoute || !manifestRoute.hasLoader) {
        return;
      }
      if (!newMatchesForData.some((m22) => m22.route.id === m2.route.id) && m2.route.id in loaderData && routeModules[m2.route.id]?.shouldRevalidate) {
        foundOptOutRoute = true;
      } else if (manifestRoute.hasClientLoader) {
        foundOptOutRoute = true;
      } else {
        routesParams.add(m2.route.id);
      }
    });
    if (routesParams.size === 0) {
      return [];
    }
    let url = singleFetchUrl(page, basename, future.unstable_trailingSlashAwareDataRequests, "data");
    if (foundOptOutRoute && routesParams.size > 0) {
      url.searchParams.set("_routes", nextMatches.filter((m2) => routesParams.has(m2.route.id)).map((m2) => m2.route.id).join(","));
    }
    return [url.pathname + url.search];
  }, [
    basename,
    future.unstable_trailingSlashAwareDataRequests,
    loaderData,
    location,
    manifest,
    newMatchesForData,
    nextMatches,
    page,
    routeModules
  ]);
  let moduleHrefs = React8.useMemo(() => getModuleLinkHrefs(newMatchesForAssets, manifest), [newMatchesForAssets, manifest]);
  let keyedPrefetchLinks = useKeyedPrefetchLinks(newMatchesForAssets);
  return /* @__PURE__ */ React8.createElement(React8.Fragment, null, dataHrefs.map((href) => /* @__PURE__ */ React8.createElement("link", { key: href, rel: "prefetch", as: "fetch", href, ...linkProps })), moduleHrefs.map((href) => /* @__PURE__ */ React8.createElement("link", { key: href, rel: "modulepreload", href, ...linkProps })), keyedPrefetchLinks.map(({ key, link }) => /* @__PURE__ */ React8.createElement("link", {
    key,
    nonce: linkProps.nonce,
    ...link,
    crossOrigin: link.crossOrigin ?? linkProps.crossOrigin
  })));
}
function mergeRefs(...refs) {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
}
var isBrowser22 = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
try {
  if (isBrowser22) {
    window.__reactRouterVersion = "7.13.1";
  }
} catch (e) {}
function HistoryRouter({
  basename,
  children,
  history,
  unstable_useTransitions
}) {
  let [state, setStateImpl] = React10.useState({
    action: history.action,
    location: history.location
  });
  let setState = React10.useCallback((newState) => {
    if (unstable_useTransitions === false) {
      setStateImpl(newState);
    } else {
      React10.startTransition(() => setStateImpl(newState));
    }
  }, [unstable_useTransitions]);
  React10.useLayoutEffect(() => history.listen(setState), [history, setState]);
  return /* @__PURE__ */ React10.createElement(Router, {
    basename,
    children,
    location: state.location,
    navigationType: state.action,
    navigator: history,
    unstable_useTransitions
  });
}
HistoryRouter.displayName = "unstable_HistoryRouter";
var ABSOLUTE_URL_REGEX2 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
var Link = React10.forwardRef(function LinkWithRef({
  onClick,
  discover = "render",
  prefetch = "none",
  relative,
  reloadDocument,
  replace: replace2,
  unstable_mask,
  state,
  target,
  to,
  preventScrollReset,
  viewTransition,
  unstable_defaultShouldRevalidate,
  ...rest
}, forwardedRef) {
  let { basename, navigator: navigator2, unstable_useTransitions } = React10.useContext(NavigationContext);
  let isAbsolute = typeof to === "string" && ABSOLUTE_URL_REGEX2.test(to);
  let parsed = parseToInfo(to, basename);
  to = parsed.to;
  let href = useHref(to, { relative });
  let location = useLocation();
  let maskedHref = null;
  if (unstable_mask) {
    let resolved = resolveTo(unstable_mask, [], location.unstable_mask ? location.unstable_mask.pathname : "/", true);
    if (basename !== "/") {
      resolved.pathname = resolved.pathname === "/" ? basename : joinPaths([basename, resolved.pathname]);
    }
    maskedHref = navigator2.createHref(resolved);
  }
  let [shouldPrefetch, prefetchRef, prefetchHandlers] = usePrefetchBehavior(prefetch, rest);
  let internalOnClick = useLinkClickHandler(to, {
    replace: replace2,
    unstable_mask,
    state,
    target,
    preventScrollReset,
    relative,
    viewTransition,
    unstable_defaultShouldRevalidate,
    unstable_useTransitions
  });
  function handleClick(event) {
    if (onClick)
      onClick(event);
    if (!event.defaultPrevented) {
      internalOnClick(event);
    }
  }
  let isSpaLink = !(parsed.isExternal || reloadDocument);
  let link = /* @__PURE__ */ React10.createElement("a", {
    ...rest,
    ...prefetchHandlers,
    href: (isSpaLink ? maskedHref : undefined) || parsed.absoluteURL || href,
    onClick: isSpaLink ? handleClick : onClick,
    ref: mergeRefs(forwardedRef, prefetchRef),
    target,
    "data-discover": !isAbsolute && discover === "render" ? "true" : undefined
  });
  return shouldPrefetch && !isAbsolute ? /* @__PURE__ */ React10.createElement(React10.Fragment, null, link, /* @__PURE__ */ React10.createElement(PrefetchPageLinks, { page: href })) : link;
});
Link.displayName = "Link";
var NavLink = React10.forwardRef(function NavLinkWithRef({
  "aria-current": ariaCurrentProp = "page",
  caseSensitive = false,
  className: classNameProp = "",
  end = false,
  style: styleProp,
  to,
  viewTransition,
  children,
  ...rest
}, ref) {
  let path = useResolvedPath(to, { relative: rest.relative });
  let location = useLocation();
  let routerState = React10.useContext(DataRouterStateContext);
  let { navigator: navigator2, basename } = React10.useContext(NavigationContext);
  let isTransitioning = routerState != null && useViewTransitionState(path) && viewTransition === true;
  let toPathname = navigator2.encodeLocation ? navigator2.encodeLocation(path).pathname : path.pathname;
  let locationPathname = location.pathname;
  let nextLocationPathname = routerState && routerState.navigation && routerState.navigation.location ? routerState.navigation.location.pathname : null;
  if (!caseSensitive) {
    locationPathname = locationPathname.toLowerCase();
    nextLocationPathname = nextLocationPathname ? nextLocationPathname.toLowerCase() : null;
    toPathname = toPathname.toLowerCase();
  }
  if (nextLocationPathname && basename) {
    nextLocationPathname = stripBasename(nextLocationPathname, basename) || nextLocationPathname;
  }
  const endSlashPosition = toPathname !== "/" && toPathname.endsWith("/") ? toPathname.length - 1 : toPathname.length;
  let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(endSlashPosition) === "/";
  let isPending = nextLocationPathname != null && (nextLocationPathname === toPathname || !end && nextLocationPathname.startsWith(toPathname) && nextLocationPathname.charAt(toPathname.length) === "/");
  let renderProps = {
    isActive,
    isPending,
    isTransitioning
  };
  let ariaCurrent = isActive ? ariaCurrentProp : undefined;
  let className;
  if (typeof classNameProp === "function") {
    className = classNameProp(renderProps);
  } else {
    className = [
      classNameProp,
      isActive ? "active" : null,
      isPending ? "pending" : null,
      isTransitioning ? "transitioning" : null
    ].filter(Boolean).join(" ");
  }
  let style = typeof styleProp === "function" ? styleProp(renderProps) : styleProp;
  return /* @__PURE__ */ React10.createElement(Link, {
    ...rest,
    "aria-current": ariaCurrent,
    className,
    ref,
    style,
    to,
    viewTransition
  }, typeof children === "function" ? children(renderProps) : children);
});
NavLink.displayName = "NavLink";
var Form = React10.forwardRef(({
  discover = "render",
  fetcherKey,
  navigate,
  reloadDocument,
  replace: replace2,
  state,
  method = defaultMethod,
  action,
  onSubmit,
  relative,
  preventScrollReset,
  viewTransition,
  unstable_defaultShouldRevalidate,
  ...props
}, forwardedRef) => {
  let { unstable_useTransitions } = React10.useContext(NavigationContext);
  let submit = useSubmit();
  let formAction = useFormAction(action, { relative });
  let formMethod = method.toLowerCase() === "get" ? "get" : "post";
  let isAbsolute = typeof action === "string" && ABSOLUTE_URL_REGEX2.test(action);
  let submitHandler = (event) => {
    onSubmit && onSubmit(event);
    if (event.defaultPrevented)
      return;
    event.preventDefault();
    let submitter = event.nativeEvent.submitter;
    let submitMethod = submitter?.getAttribute("formmethod") || method;
    let doSubmit = () => submit(submitter || event.currentTarget, {
      fetcherKey,
      method: submitMethod,
      navigate,
      replace: replace2,
      state,
      relative,
      preventScrollReset,
      viewTransition,
      unstable_defaultShouldRevalidate
    });
    if (unstable_useTransitions && navigate !== false) {
      React10.startTransition(() => doSubmit());
    } else {
      doSubmit();
    }
  };
  return /* @__PURE__ */ React10.createElement("form", {
    ref: forwardedRef,
    method: formMethod,
    action: formAction,
    onSubmit: reloadDocument ? onSubmit : submitHandler,
    ...props,
    "data-discover": !isAbsolute && discover === "render" ? "true" : undefined
  });
});
Form.displayName = "Form";
function ScrollRestoration({
  getKey,
  storageKey,
  ...props
}) {
  let remixContext = React10.useContext(FrameworkContext);
  let { basename } = React10.useContext(NavigationContext);
  let location = useLocation();
  let matches = useMatches();
  useScrollRestoration({ getKey, storageKey });
  let ssrKey = React10.useMemo(() => {
    if (!remixContext || !getKey)
      return null;
    let userKey = getScrollRestorationKey(location, matches, basename, getKey);
    return userKey !== location.key ? userKey : null;
  }, []);
  if (!remixContext || remixContext.isSpaMode) {
    return null;
  }
  let restoreScroll = ((storageKey2, restoreKey) => {
    if (!window.history.state || !window.history.state.key) {
      let key = Math.random().toString(32).slice(2);
      window.history.replaceState({ key }, "");
    }
    try {
      let positions = JSON.parse(sessionStorage.getItem(storageKey2) || "{}");
      let storedY = positions[restoreKey || window.history.state.key];
      if (typeof storedY === "number") {
        window.scrollTo(0, storedY);
      }
    } catch (error) {
      console.error(error);
      sessionStorage.removeItem(storageKey2);
    }
  }).toString();
  return /* @__PURE__ */ React10.createElement("script", {
    ...props,
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: {
      __html: `(${restoreScroll})(${escapeHtml(JSON.stringify(storageKey || SCROLL_RESTORATION_STORAGE_KEY))}, ${escapeHtml(JSON.stringify(ssrKey))})`
    }
  });
}
ScrollRestoration.displayName = "ScrollRestoration";
function getDataRouterConsoleError2(hookName) {
  return `${hookName} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function useDataRouterContext3(hookName) {
  let ctx = React10.useContext(DataRouterContext);
  invariant2(ctx, getDataRouterConsoleError2(hookName));
  return ctx;
}
function useDataRouterState2(hookName) {
  let state = React10.useContext(DataRouterStateContext);
  invariant2(state, getDataRouterConsoleError2(hookName));
  return state;
}
function useLinkClickHandler(to, {
  target,
  replace: replaceProp,
  unstable_mask,
  state,
  preventScrollReset,
  relative,
  viewTransition,
  unstable_defaultShouldRevalidate,
  unstable_useTransitions
} = {}) {
  let navigate = useNavigate();
  let location = useLocation();
  let path = useResolvedPath(to, { relative });
  return React10.useCallback((event) => {
    if (shouldProcessLinkClick(event, target)) {
      event.preventDefault();
      let replace2 = replaceProp !== undefined ? replaceProp : createPath(location) === createPath(path);
      let doNavigate = () => navigate(to, {
        replace: replace2,
        unstable_mask,
        state,
        preventScrollReset,
        relative,
        viewTransition,
        unstable_defaultShouldRevalidate
      });
      if (unstable_useTransitions) {
        React10.startTransition(() => doNavigate());
      } else {
        doNavigate();
      }
    }
  }, [
    location,
    navigate,
    path,
    replaceProp,
    unstable_mask,
    state,
    target,
    to,
    preventScrollReset,
    relative,
    viewTransition,
    unstable_defaultShouldRevalidate,
    unstable_useTransitions
  ]);
}
var fetcherId = 0;
var getUniqueFetcherId = () => `__${String(++fetcherId)}__`;
function useSubmit() {
  let { router } = useDataRouterContext3("useSubmit");
  let { basename } = React10.useContext(NavigationContext);
  let currentRouteId = useRouteId();
  let routerFetch = router.fetch;
  let routerNavigate = router.navigate;
  return React10.useCallback(async (target, options = {}) => {
    let { action, method, encType, formData, body } = getFormSubmissionInfo(target, basename);
    if (options.navigate === false) {
      let key = options.fetcherKey || getUniqueFetcherId();
      await routerFetch(key, currentRouteId, options.action || action, {
        unstable_defaultShouldRevalidate: options.unstable_defaultShouldRevalidate,
        preventScrollReset: options.preventScrollReset,
        formData,
        body,
        formMethod: options.method || method,
        formEncType: options.encType || encType,
        flushSync: options.flushSync
      });
    } else {
      await routerNavigate(options.action || action, {
        unstable_defaultShouldRevalidate: options.unstable_defaultShouldRevalidate,
        preventScrollReset: options.preventScrollReset,
        formData,
        body,
        formMethod: options.method || method,
        formEncType: options.encType || encType,
        replace: options.replace,
        state: options.state,
        fromRouteId: currentRouteId,
        flushSync: options.flushSync,
        viewTransition: options.viewTransition
      });
    }
  }, [routerFetch, routerNavigate, basename, currentRouteId]);
}
function useFormAction(action, { relative } = {}) {
  let { basename } = React10.useContext(NavigationContext);
  let routeContext = React10.useContext(RouteContext);
  invariant2(routeContext, "useFormAction must be used inside a RouteContext");
  let [match] = routeContext.matches.slice(-1);
  let path = { ...useResolvedPath(action ? action : ".", { relative }) };
  let location = useLocation();
  if (action == null) {
    path.search = location.search;
    let params = new URLSearchParams(path.search);
    let indexValues = params.getAll("index");
    let hasNakedIndexParam = indexValues.some((v) => v === "");
    if (hasNakedIndexParam) {
      params.delete("index");
      indexValues.filter((v) => v).forEach((v) => params.append("index", v));
      let qs = params.toString();
      path.search = qs ? `?${qs}` : "";
    }
  }
  if ((!action || action === ".") && match.route.index) {
    path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
  }
  if (basename !== "/") {
    path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
  }
  return createPath(path);
}
var SCROLL_RESTORATION_STORAGE_KEY = "react-router-scroll-positions";
var savedScrollPositions = {};
function getScrollRestorationKey(location, matches, basename, getKey) {
  let key = null;
  if (getKey) {
    if (basename !== "/") {
      key = getKey({
        ...location,
        pathname: stripBasename(location.pathname, basename) || location.pathname
      }, matches);
    } else {
      key = getKey(location, matches);
    }
  }
  if (key == null) {
    key = location.key;
  }
  return key;
}
function useScrollRestoration({
  getKey,
  storageKey
} = {}) {
  let { router } = useDataRouterContext3("useScrollRestoration");
  let { restoreScrollPosition, preventScrollReset } = useDataRouterState2("useScrollRestoration");
  let { basename } = React10.useContext(NavigationContext);
  let location = useLocation();
  let matches = useMatches();
  let navigation = useNavigation();
  React10.useEffect(() => {
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = "auto";
    };
  }, []);
  usePageHide(React10.useCallback(() => {
    if (navigation.state === "idle") {
      let key = getScrollRestorationKey(location, matches, basename, getKey);
      savedScrollPositions[key] = window.scrollY;
    }
    try {
      sessionStorage.setItem(storageKey || SCROLL_RESTORATION_STORAGE_KEY, JSON.stringify(savedScrollPositions));
    } catch (error) {
      warning2(false, `Failed to save scroll positions in sessionStorage, <ScrollRestoration /> will not work properly (${error}).`);
    }
    window.history.scrollRestoration = "auto";
  }, [navigation.state, getKey, basename, location, matches, storageKey]));
  if (typeof document !== "undefined") {
    React10.useLayoutEffect(() => {
      try {
        let sessionPositions = sessionStorage.getItem(storageKey || SCROLL_RESTORATION_STORAGE_KEY);
        if (sessionPositions) {
          savedScrollPositions = JSON.parse(sessionPositions);
        }
      } catch (e) {}
    }, [storageKey]);
    React10.useLayoutEffect(() => {
      let disableScrollRestoration = router?.enableScrollRestoration(savedScrollPositions, () => window.scrollY, getKey ? (location2, matches2) => getScrollRestorationKey(location2, matches2, basename, getKey) : undefined);
      return () => disableScrollRestoration && disableScrollRestoration();
    }, [router, basename, getKey]);
    React10.useLayoutEffect(() => {
      if (restoreScrollPosition === false) {
        return;
      }
      if (typeof restoreScrollPosition === "number") {
        window.scrollTo(0, restoreScrollPosition);
        return;
      }
      try {
        if (location.hash) {
          let el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
          if (el) {
            el.scrollIntoView();
            return;
          }
        }
      } catch {
        warning2(false, `"${location.hash.slice(1)}" is not a decodable element ID. The view will not scroll to it.`);
      }
      if (preventScrollReset === true) {
        return;
      }
      window.scrollTo(0, 0);
    }, [location, restoreScrollPosition, preventScrollReset]);
  }
}
function usePageHide(callback, options) {
  let { capture } = options || {};
  React10.useEffect(() => {
    let opts = capture != null ? { capture } : undefined;
    window.addEventListener("pagehide", callback, opts);
    return () => {
      window.removeEventListener("pagehide", callback, opts);
    };
  }, [callback, capture]);
}
function useViewTransitionState(to, { relative } = {}) {
  let vtContext = React10.useContext(ViewTransitionContext);
  invariant2(vtContext != null, "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?");
  let { basename } = useDataRouterContext3("useViewTransitionState");
  let path = useResolvedPath(to, { relative });
  if (!vtContext.isTransitioning) {
    return false;
  }
  let currentPath = stripBasename(vtContext.currentLocation.pathname, basename) || vtContext.currentLocation.pathname;
  let nextPath = stripBasename(vtContext.nextLocation.pathname, basename) || vtContext.nextLocation.pathname;
  return matchPath(path.pathname, nextPath) != null || matchPath(path.pathname, currentPath) != null;
}

// node_modules/react-router/dist/development/index.mjs
"use client";

// src/pages/Dashboard.jsx
init_lucide_react();
init_api();
init_PlayerContext();

// src/pages/Search.jsx
var import_react33 = __toESM(require_react(), 1);
init_lucide_react();
init_api();
init_PlayerContext();
init_ToastContext();

// src/components/Skeleton.jsx
var import_react32 = __toESM(require_react(), 1);
var jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime(), 1);
var Skeleton = ({ className, variant = "rect" }) => {
  const baseClasses = "animate-pulse bg-brand-surface border border-white/[0.02] rounded-md";
  const variants = {
    rect: "h-full w-full",
    circle: "rounded-full h-12 w-12",
    text: "h-4 w-3/4 mb-2 rounded",
    subtext: "h-3 w-1/2 rounded"
  };
  return /* @__PURE__ */ jsx_dev_runtime3.jsxDEV("div", {
    className: `${baseClasses} ${variants[variant]} ${className}`
  }, undefined, false, undefined, this);
};
var SongSkeleton = () => /* @__PURE__ */ jsx_dev_runtime3.jsxDEV("div", {
  className: "flex items-center gap-4 bg-brand-surface rounded-lg p-3 border border-white/[0.02]",
  children: [
    /* @__PURE__ */ jsx_dev_runtime3.jsxDEV(Skeleton, {
      className: "w-14 h-14 shrink-0 rounded-md"
    }, undefined, false, undefined, this),
    /* @__PURE__ */ jsx_dev_runtime3.jsxDEV("div", {
      className: "flex-1",
      children: [
        /* @__PURE__ */ jsx_dev_runtime3.jsxDEV(Skeleton, {
          variant: "text"
        }, undefined, false, undefined, this),
        /* @__PURE__ */ jsx_dev_runtime3.jsxDEV(Skeleton, {
          variant: "subtext"
        }, undefined, false, undefined, this)
      ]
    }, undefined, true, undefined, this)
  ]
}, undefined, true, undefined, this);
var CardSkeleton = () => /* @__PURE__ */ jsx_dev_runtime3.jsxDEV("div", {
  className: "aspect-square bg-brand-surface rounded-2xl p-4 flex flex-col justify-end gap-3 border border-white/[0.02]",
  children: [
    /* @__PURE__ */ jsx_dev_runtime3.jsxDEV(Skeleton, {
      className: "w-1/2 h-6"
    }, undefined, false, undefined, this),
    /* @__PURE__ */ jsx_dev_runtime3.jsxDEV(Skeleton, {
      className: "w-1/3 h-4"
    }, undefined, false, undefined, this)
  ]
}, undefined, true, undefined, this);
var Skeleton_default = Skeleton;

// src/pages/Search.jsx
var jsx_dev_runtime4 = __toESM(require_jsx_dev_runtime(), 1);
var Search2 = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = import_react33.useState("");
  const [localResults, setLocalResults] = import_react33.useState([]);
  const [globalResults, setGlobalResults] = import_react33.useState([]);
  const [isSearching, setIsSearching] = import_react33.useState(false);
  const [importingId, setImportingId] = import_react33.useState(null);
  const { currentSong, isPlaying, likedSongs, toggleLike, playlists, addSongToPlaylist, playSong, resolveUrl: resolveUrl2, addToQueue } = import_react33.useContext(PlayerContext);
  const toast = useToast();
  const [activeTab, setActiveTab] = import_react33.useState("all");
  import_react33.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q) {
      setSearchTerm(q);
    }
  }, [location.search]);
  const genres = [
    { name: "Bollywood", color: "bg-gradient-to-br from-orange-400 to-orange-600", icon: Music },
    { name: "Pop", color: "bg-gradient-to-br from-pink-500 to-pink-700", icon: Music },
    { name: "Hip Hop", color: "bg-gradient-to-br from-blue-500 to-blue-700", icon: Disc3 },
    { name: "Electronic", color: "bg-gradient-to-br from-purple-500 to-purple-700", icon: Headphones },
    { name: "Romantic", color: "bg-gradient-to-br from-red-400 to-red-600", icon: Heart },
    { name: "Lofi", color: "bg-gradient-to-br from-indigo-600 to-indigo-800", icon: Music },
    { name: "Punjabi", color: "bg-gradient-to-br from-green-500 to-green-700", icon: Music },
    { name: "English", color: "bg-gradient-to-br from-yellow-500 to-yellow-700", icon: Music }
  ];
  const performSearch = async () => {
    if (!searchTerm.trim())
      return;
    setIsSearching(true);
    try {
      const localResp = await api_default.get(`/api/songs/search`, {
        params: { q: searchTerm, type: activeTab }
      });
      const globalResp = await api_default.get(`/api/jiosaavn/search`, {
        params: { query: searchTerm, type: activeTab }
      });
      let locals = localResp.data.results || [];
      let globals = globalResp.data.results || [];
      if (activeTab === "all") {
        if (locals.songs && globals.songs) {
          const localSaavnIds = new Set(locals.songs.map((s) => s.saavn_id).filter(Boolean));
          globals.songs = globals.songs.filter((s) => !localSaavnIds.has(s.saavn_id));
        }
        if (locals.artists && globals.artists) {
          const localSaavnIds = new Set(locals.artists.map((a) => a.saavn_id || a.id).filter(Boolean));
          globals.artists = globals.artists.filter((a) => !localSaavnIds.has(a.id));
        }
        if (locals.albums && globals.albums) {
          const localSaavnIds = new Set(locals.albums.map((a) => a.saavn_id || a.id).filter(Boolean));
          globals.albums = globals.albums.filter((a) => !localSaavnIds.has(a.id));
        }
        if (locals.playlists && globals.playlists) {
          const localSaavnIds = new Set(locals.playlists.map((p) => p.saavn_playlist_id || p.id).filter(Boolean));
          globals.playlists = globals.playlists.filter((p) => !localSaavnIds.has(p.id));
        }
      } else {
        const localSaavnIds = new Set(locals.map((item) => item.saavn_id || item.id || item.saavn_playlist_id).filter(Boolean));
        globals = globals.filter((item) => !localSaavnIds.has(item.saavn_id || item.id));
      }
      setLocalResults(locals);
      setGlobalResults(globals);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };
  import_react33.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        performSearch();
      } else {
        setLocalResults([]);
        setGlobalResults([]);
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, activeTab]);
  const handleGlobalPlay = async (saavnSong, songList = null) => {
    setImportingId(saavnSong.saavn_id);
    try {
      const res = await api_default.post("/api/jiosaavn/import", saavnSong);
      if (res.data.success) {
        const imported = res.data.song;
        const playable = {
          song_id: imported.song_id,
          saavn_id: saavnSong.saavn_id,
          title: imported.title,
          audio_url: imported.audio_url,
          cover_image_url: imported.cover_image_url,
          duration: imported.duration,
          artist_id: imported.artist_id,
          artist_name: imported.artist_name,
          artists: imported.artists
        };
        playSong(playable, songList || [playable]);
      }
    } catch (err) {
      console.error("Import failed:", err);
    } finally {
      setImportingId(null);
    }
  };
  const renderSongsSection = (songs, title) => {
    if (!songs || songs.length === 0)
      return null;
    return /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
      className: "animate-slide-up",
      children: [
        /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("h2", {
          className: "text-xl font-bold mb-4 tracking-tight text-white/90",
          children: title
        }, undefined, false, undefined, this),
        /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
          className: "grid grid-cols-1 gap-1",
          children: songs.map((song, idx) => {
            const isActive = currentSong?.song_id === song.song_id || song.audio_url && currentSong?.audio_url === song.audio_url;
            const isImporting = importingId === song.saavn_id;
            return /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
              className: `flex items-center gap-4 p-3 rounded-lg hover:bg-white/[0.05] transition-all group border border-transparent hover:border-white/[0.02] ${isActive ? "bg-white/[0.08]" : ""}`,
              children: [
                /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
                  className: "relative w-12 h-12 shrink-0 cursor-pointer rounded-md overflow-hidden",
                  onClick: () => song.source === "jiosaavn" ? handleGlobalPlay(song, songs) : playSong(song, songs),
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("img", {
                      src: song.source === "local" ? resolveUrl2(song.cover_image_url) : song.cover_image_url,
                      alt: "",
                      className: "w-full h-full object-cover"
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
                      className: `absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`,
                      children: isImporting ? /* @__PURE__ */ jsx_dev_runtime4.jsxDEV(LoaderCircle, {
                        className: "w-5 h-5 text-brand-primary animate-spin"
                      }, undefined, false, undefined, this) : isActive && isPlaying ? /* @__PURE__ */ jsx_dev_runtime4.jsxDEV(Pause, {
                        className: "w-5 h-5 text-white fill-current"
                      }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime4.jsxDEV(Play, {
                        className: "w-5 h-5 text-white fill-current"
                      }, undefined, false, undefined, this)
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
                  className: "flex-1 min-w-0",
                  onClick: () => song.source === "jiosaavn" ? handleGlobalPlay(song, songs) : playSong(song, songs),
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
                      className: `font-semibold truncate text-sm ${isActive ? "text-brand-primary" : "text-white"}`,
                      children: song.title
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
                      className: "text-xs text-brand-muted truncate font-medium",
                      children: song.artist_name
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("button", {
                  onClick: (e) => {
                    e.stopPropagation();
                    addToQueue(song);
                    toast.success("Added to queue");
                  },
                  className: "w-10 h-10 flex items-center justify-center rounded-full text-brand-muted hover:text-brand-primary opacity-0 group-hover:opacity-100 transition-all duration-200",
                  title: "Add to Queue",
                  children: /* @__PURE__ */ jsx_dev_runtime4.jsxDEV(Plus, {
                    className: "w-4 h-4"
                  }, undefined, false, undefined, this)
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
                  className: "text-xs text-brand-muted font-medium w-10 text-right tabular-nums",
                  children: formatTime(song.duration)
                }, undefined, false, undefined, this)
              ]
            }, song.song_id || song.saavn_id || idx, true, undefined, this);
          })
        }, undefined, false, undefined, this)
      ]
    }, undefined, true, undefined, this);
  };
  const renderArtistsSection = (artists, title) => {
    if (!artists || artists.length === 0)
      return null;
    return /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
      className: "animate-slide-up",
      children: [
        /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("h2", {
          className: "text-xl font-bold mb-4 tracking-tight text-white/90",
          children: title
        }, undefined, false, undefined, this),
        /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
          className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6",
          children: artists.map((artist, idx) => {
            const artistLink = artist.source === "local" ? `/dashboard/artist/${artist.id}` : `/dashboard/artist/saavn_${artist.id}`;
            return /* @__PURE__ */ jsx_dev_runtime4.jsxDEV(Link, {
              to: artistLink,
              className: "group bg-white/[0.02] hover:bg-white/[0.04] p-4 rounded-xl transition-all border border-white/[0.02] hover:border-white/[0.05]",
              children: [
                /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
                  className: "aspect-square rounded-full overflow-hidden mb-4 shadow-lg ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-500 bg-brand-surface",
                  children: artist.image ? /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("img", {
                    src: artist.source === "local" ? resolveUrl2(artist.image) : artist.image,
                    alt: artist.name,
                    className: "w-full h-full object-cover"
                  }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime4.jsxDEV(Music, {
                    className: "w-1/2 h-1/2 m-auto text-brand-muted opacity-30 h-full"
                  }, undefined, false, undefined, this)
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
                  className: "font-bold text-sm truncate text-center text-white/90 group-hover:text-brand-primary transition-colors",
                  children: artist.name
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
                  className: "text-[10px] text-brand-muted text-center mt-1 font-bold uppercase tracking-widest",
                  children: "Artist"
                }, undefined, false, undefined, this)
              ]
            }, artist.id || idx, true, undefined, this);
          })
        }, undefined, false, undefined, this)
      ]
    }, undefined, true, undefined, this);
  };
  const renderAlbumsSection = (albums, title) => {
    if (!albums || albums.length === 0)
      return null;
    return /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
      className: "animate-slide-up",
      children: [
        /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("h2", {
          className: "text-xl font-bold mb-4 tracking-tight text-white/90",
          children: title
        }, undefined, false, undefined, this),
        /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
          className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6",
          children: albums.map((album, idx) => /* @__PURE__ */ jsx_dev_runtime4.jsxDEV(Link, {
            to: `/dashboard/album/saavn_${album.id}`,
            className: "group bg-white/[0.02] hover:bg-white/[0.04] p-4 rounded-xl transition-all border border-white/[0.02] hover:border-white/[0.05] cursor-pointer",
            children: [
              /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
                className: "aspect-square rounded-lg overflow-hidden mb-4 shadow-xl ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-500 bg-brand-surface",
                children: /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("img", {
                  src: album.cover_image_url,
                  alt: album.name,
                  className: "w-full h-full object-cover"
                }, undefined, false, undefined, this)
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
                className: "font-bold text-sm truncate text-white",
                children: album.name
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
                className: "text-xs text-brand-muted truncate mt-1",
                children: album.artist_name
              }, undefined, false, undefined, this)
            ]
          }, album.id || idx, true, undefined, this))
        }, undefined, false, undefined, this)
      ]
    }, undefined, true, undefined, this);
  };
  const renderPlaylistsSection = (playlists2, title) => {
    if (!playlists2 || playlists2.length === 0)
      return null;
    return /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
      className: "animate-slide-up",
      children: [
        /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("h2", {
          className: "text-xl font-bold mb-4 tracking-tight text-white/90",
          children: title
        }, undefined, false, undefined, this),
        /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
          className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6",
          children: playlists2.map((playlist, idx) => /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
            className: "group bg-white/[0.02] hover:bg-white/[0.04] p-4 rounded-xl transition-all border border-white/[0.02] hover:border-white/[0.05] cursor-pointer",
            children: [
              /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
                className: "aspect-square rounded-lg bg-gradient-to-br from-brand-surface to-brand-dark flex items-center justify-center mb-4 shadow-xl ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-500 relative overflow-hidden",
                children: [
                  /* @__PURE__ */ jsx_dev_runtime4.jsxDEV(Plus, {
                    className: "w-10 h-10 text-brand-muted/30"
                  }, undefined, false, undefined, this),
                  playlist.cover_image_url && /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("img", {
                    src: playlist.cover_image_url,
                    alt: "",
                    className: "absolute inset-0 w-full h-full object-cover"
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
                className: "font-bold text-sm truncate text-white",
                children: playlist.name
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
                className: "text-xs text-brand-muted truncate mt-1",
                children: [
                  playlist.song_count || 0,
                  " songs"
                ]
              }, undefined, true, undefined, this)
            ]
          }, playlist.id || idx, true, undefined, this))
        }, undefined, false, undefined, this)
      ]
    }, undefined, true, undefined, this);
  };
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds) || seconds === 0 || seconds === "0")
      return "";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  const hasResults = activeTab === "all" ? localResults?.songs?.length > 0 || localResults?.artists?.length > 0 || globalResults?.songs?.length > 0 || globalResults?.artists?.length > 0 : localResults?.length > 0 || globalResults?.length > 0;
  return /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
    className: "flex-1 overflow-y-auto bg-brand-dark p-4 md:p-8 pb-[10rem] md:pb-32 animate-fade-in custom-scrollbar",
    children: /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
      className: "max-w-6xl mx-auto",
      children: [
        /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
          className: "relative mb-8 animate-slide-up",
          children: [
            /* @__PURE__ */ jsx_dev_runtime4.jsxDEV(Search, {
              className: "absolute left-6 top-1/2 -translate-y-1/2 text-brand-muted w-6 h-6"
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("input", {
              id: "search-page-input",
              name: "search-page-input",
              type: "text",
              placeholder: "Search millions of songs...",
              className: "w-full bg-brand-surface border border-white/[0.02] rounded-full py-3 pl-12 md:py-5 md:pl-16 pr-8 text-base md:text-xl font-medium focus:ring-2 focus:ring-brand-accent/30 focus:bg-white/[0.03] outline-none transition-all shadow-sm placeholder-brand-muted text-brand-primary",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              autoFocus: true
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this),
        searchTerm && /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
          className: "flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide",
          children: [
            { id: "all", label: "All", icon: Search },
            { id: "song", label: "Songs", icon: Music },
            { id: "artist", label: "Artists", icon: Disc3 },
            { id: "album", label: "Albums", icon: Database },
            { id: "playlist", label: "Playlists", icon: Plus }
          ].map((tab) => /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("button", {
            onClick: () => setActiveTab(tab.id),
            className: `flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-brand-primary text-brand-dark shadow-lg scale-105" : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"}`,
            children: [
              /* @__PURE__ */ jsx_dev_runtime4.jsxDEV(tab.icon, {
                className: "w-3.5 h-3.5"
              }, undefined, false, undefined, this),
              tab.label
            ]
          }, tab.id, true, undefined, this))
        }, undefined, false, undefined, this),
        isSearching && /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
          className: "space-y-4 animate-fade-in",
          children: [
            /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("h2", {
              className: "text-xl font-bold mb-4",
              children: "Searching..."
            }, undefined, false, undefined, this),
            [...Array(5)].map((_, i) => /* @__PURE__ */ jsx_dev_runtime4.jsxDEV(SongSkeleton, {}, i, false, undefined, this))
          ]
        }, undefined, true, undefined, this),
        !isSearching && searchTerm && !hasResults && /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
          className: "text-center py-32 rounded-2xl border-dashed border-white/[0.05] bg-brand-surface animate-fade-in",
          children: [
            /* @__PURE__ */ jsx_dev_runtime4.jsxDEV(Search, {
              className: "w-20 h-20 mx-auto mb-6 text-brand-muted opacity-50"
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("h3", {
              className: "text-2xl font-bold mb-3 text-brand-primary",
              children: [
                'No results found for "',
                searchTerm,
                '"'
              ]
            }, undefined, true, undefined, this),
            /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("p", {
              className: "text-brand-muted max-w-md mx-auto",
              children: "We couldn't find any songs matching your search across millions of tracks. Try adjusting your query."
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this),
        !isSearching && searchTerm && /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
          className: "space-y-12",
          children: activeTab === "all" ? /* @__PURE__ */ jsx_dev_runtime4.jsxDEV(jsx_dev_runtime4.Fragment, {
            children: [
              renderSongsSection([...localResults.songs || [], ...globalResults.songs || []].slice(0, 10), "Top Songs"),
              renderArtistsSection([...localResults.artists || [], ...globalResults.artists || []].slice(0, 8), "Artists"),
              renderAlbumsSection(globalResults.albums || [], "Albums"),
              renderPlaylistsSection([...localResults.playlists || [], ...globalResults.playlists || []].slice(0, 8), "Playlists")
            ]
          }, undefined, true, undefined, this) : activeTab === "song" ? renderSongsSection([...Array.isArray(localResults) ? localResults : [], ...Array.isArray(globalResults) ? globalResults : []], "Songs") : activeTab === "artist" ? renderArtistsSection([...Array.isArray(localResults) ? localResults : [], ...Array.isArray(globalResults) ? globalResults : []], "Artists") : activeTab === "album" ? renderAlbumsSection(Array.isArray(globalResults) ? globalResults : [], "Albums") : activeTab === "playlist" ? renderPlaylistsSection([...Array.isArray(localResults) ? localResults : [], ...Array.isArray(globalResults) ? globalResults : []], "Playlists") : null
        }, undefined, false, undefined, this),
        !searchTerm && /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
          className: "animate-slide-up",
          style: { animationDelay: "0.1s" },
          children: [
            /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("h2", {
              className: "text-xl font-bold mb-6 tracking-tight text-brand-primary",
              children: "Browse all"
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
              className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6",
              children: genres.map((genre) => /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
                onClick: () => setSearchTerm(genre.name),
                className: `aspect-[3/2] md:aspect-square rounded-xl p-5 flex flex-col justify-between ${genre.color} hover:brightness-110 active:scale-95 transition-all cursor-pointer group relative overflow-hidden shadow-lg`,
                children: [
                  /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
                    className: "text-xl font-black text-white relative z-10 tracking-tight leading-tight",
                    children: genre.name
                  }, undefined, false, undefined, this),
                  /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("div", {
                    className: "absolute -bottom-2 -right-2 w-24 h-24 bg-white/10 rounded-lg group-hover:scale-110 transition-transform duration-500 rotate-[25deg] shadow-xl overflow-hidden flex items-center justify-center",
                    children: /* @__PURE__ */ jsx_dev_runtime4.jsxDEV(genre.icon, {
                      className: "w-12 h-12 text-white/40 -rotate-[25deg]"
                    }, undefined, false, undefined, this)
                  }, undefined, false, undefined, this)
                ]
              }, genre.name, true, undefined, this))
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this)
      ]
    }, undefined, true, undefined, this)
  }, undefined, false, undefined, this);
};
var Search_default = Search2;

// src/pages/ListenerStats.jsx
var import_react36 = __toESM(require_react(), 1);
init_lucide_react();
init_api();
init_PlayerContext();

// src/components/CountUp.jsx
init_react();
var import_react35 = __toESM(require_react(), 1);
var jsx_dev_runtime5 = __toESM(require_jsx_dev_runtime(), 1);
function CountUp({
  to,
  from = 0,
  direction = "up",
  delay: delay2 = 0,
  duration = 2,
  className = "",
  startWhen = true,
  separator = "",
  onStart,
  onEnd
}) {
  const ref = import_react35.useRef(null);
  const motionValue2 = useMotionValue(direction === "down" ? to : from);
  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);
  const springValue = useSpring(motionValue2, {
    damping,
    stiffness
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });
  const getDecimalPlaces = (num) => {
    const str = num.toString();
    if (str.includes(".")) {
      const decimals = str.split(".")[1];
      if (parseInt(decimals) !== 0) {
        return decimals.length;
      }
    }
    return 0;
  };
  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));
  const formatValue = import_react35.useCallback((latest) => {
    const hasDecimals = maxDecimals > 0;
    const options = {
      useGrouping: !!separator,
      minimumFractionDigits: hasDecimals ? maxDecimals : 0,
      maximumFractionDigits: hasDecimals ? maxDecimals : 0
    };
    const formattedNumber = Intl.NumberFormat("en-US", options).format(latest);
    return separator ? formattedNumber.replace(/,/g, separator) : formattedNumber;
  }, [maxDecimals, separator]);
  import_react35.useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatValue(direction === "down" ? to : from);
    }
  }, [from, to, direction, formatValue]);
  import_react35.useEffect(() => {
    if (isInView && startWhen) {
      if (typeof onStart === "function")
        onStart();
      const timeoutId = setTimeout(() => {
        motionValue2.set(direction === "down" ? from : to);
      }, delay2 * 1000);
      const durationTimeoutId = setTimeout(() => {
        if (typeof onEnd === "function")
          onEnd();
      }, delay2 * 1000 + duration * 1000);
      return () => {
        clearTimeout(timeoutId);
        clearTimeout(durationTimeoutId);
      };
    }
  }, [isInView, startWhen, motionValue2, direction, from, to, delay2, onStart, onEnd, duration]);
  import_react35.useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = formatValue(latest);
      }
    });
    return () => unsubscribe();
  }, [springValue, formatValue]);
  return /* @__PURE__ */ jsx_dev_runtime5.jsxDEV("span", {
    className,
    ref
  }, undefined, false, undefined, this);
}

// src/pages/ListenerStats.jsx
var jsx_dev_runtime6 = __toESM(require_jsx_dev_runtime(), 1);
var ListenerStats = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [stats, setStats] = import_react36.useState(null);
  const [isLoading, setIsLoading] = import_react36.useState(true);
  const { playSong } = import_react36.useContext(PlayerContext);
  import_react36.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api_default.get(`/api/stats/listener/${user.id}`);
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching listener stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [user.id]);
  if (isLoading) {
    return /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
      className: "flex-1 overflow-y-auto pb-32 custom-scrollbar animate-fade-in",
      children: /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
        className: "p-8 max-w-6xl mx-auto",
        children: /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
          className: "animate-pulse space-y-8",
          children: [
            /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
              className: "h-10 w-64 bg-brand-surface rounded-xl"
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
              className: "grid grid-cols-3 gap-4",
              children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                className: "h-36 bg-brand-surface rounded-2xl"
              }, i, false, undefined, this))
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
              className: "grid grid-cols-2 gap-6",
              children: [
                /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                  className: "h-80 bg-brand-surface rounded-2xl"
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                  className: "h-80 bg-brand-surface rounded-2xl"
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this)
    }, undefined, false, undefined, this);
  }
  const statCards = [
    {
      label: "Total Streams",
      value: stats?.stats?.total_streams || 0,
      icon: Play,
      gradient: "from-sky-500/20 to-sky-500/5",
      iconColor: "text-sky-400",
      borderColor: "border-sky-500/10",
      countUp: true
    },
    {
      label: "Listen Time",
      value: stats?.stats?.total_listen_time || "0h 0m",
      icon: Clock,
      gradient: "from-violet-500/20 to-violet-500/5",
      iconColor: "text-violet-400",
      borderColor: "border-violet-500/10"
    },
    {
      label: "Top Artist",
      value: stats?.stats?.top_artist || "--",
      icon: MicVocal,
      gradient: "from-rose-500/20 to-rose-500/5",
      iconColor: "text-rose-400",
      borderColor: "border-rose-500/10",
      isText: true
    },
    {
      label: "Top Language",
      value: stats?.stats?.top_language || "--",
      icon: Globe,
      gradient: "from-amber-500/20 to-amber-500/5",
      iconColor: "text-amber-400",
      borderColor: "border-amber-500/10",
      isText: true
    },
    {
      label: "Top Genre",
      value: stats?.stats?.top_genre || "--",
      icon: Disc3,
      gradient: "from-fuchsia-500/20 to-fuchsia-500/5",
      iconColor: "text-fuchsia-400",
      borderColor: "border-fuchsia-500/10",
      isText: true
    },
    {
      label: "Unique Languages",
      value: stats?.stats?.unique_languages || 0,
      icon: Globe,
      gradient: "from-blue-500/20 to-blue-500/5",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/10",
      countUp: true
    },
    {
      label: "Unique Genres",
      value: stats?.stats?.unique_genres || 0,
      icon: Music,
      gradient: "from-emerald-500/20 to-emerald-500/5",
      iconColor: "text-emerald-400",
      borderColor: "border-emerald-500/10",
      countUp: true
    },
    {
      label: "Liked Songs",
      value: stats?.stats?.liked_count || 0,
      icon: Heart,
      gradient: "from-pink-500/20 to-pink-500/5",
      iconColor: "text-pink-400",
      borderColor: "border-pink-500/10",
      countUp: true
    },
    {
      label: "Liked Playlists",
      value: stats?.stats?.liked_playlists_count || 0,
      icon: Disc3,
      gradient: "from-orange-500/20 to-orange-500/5",
      iconColor: "text-orange-400",
      borderColor: "border-orange-500/10",
      countUp: true
    }
  ];
  const maxPlayCount = stats?.top_songs?.[0]?.play_count || 1;
  const maxGenreCount = stats?.top_genres?.[0]?.listen_count || 1;
  const maxLanguageCount = stats?.top_languages?.[0]?.listen_count || 1;
  const genreColors = [
    "bg-sky-400",
    "bg-violet-400",
    "bg-rose-400",
    "bg-amber-400",
    "bg-emerald-400",
    "bg-pink-400",
    "bg-teal-400",
    "bg-orange-400"
  ];
  return /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
    className: "flex-1 overflow-y-auto pb-32 custom-scrollbar animate-fade-in",
    children: /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
      className: "p-8 max-w-6xl mx-auto",
      children: [
        /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
          className: "mb-10 animate-slide-up",
          children: /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
            className: "flex items-center gap-4 mb-2",
            children: [
              /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                className: "w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/[0.06] flex items-center justify-center",
                children: /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(ChartColumn, {
                  className: "w-6 h-6 text-white"
                }, undefined, false, undefined, this)
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                children: /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("h1", {
                  className: "text-3xl font-black tracking-tight text-brand-primary",
                  children: "Your Stats"
                }, undefined, false, undefined, this)
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        }, undefined, false, undefined, this),
        /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
          className: "grid grid-cols-2 md:grid-cols-3 gap-4 mb-10",
          children: statCards.map((card, i) => {
            const Icon2 = card.icon;
            return /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
              className: `relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br ${card.gradient} border ${card.borderColor} hover:scale-[1.02] transition-all duration-300 animate-slide-up group`,
              style: { animationDelay: `${i * 0.05}s` },
              children: [
                /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                  className: "flex items-start justify-between mb-4",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("span", {
                      className: "text-xs font-semibold text-brand-muted uppercase tracking-wider",
                      children: card.label
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Icon2, {
                      className: `w-5 h-5 ${card.iconColor} opacity-60 group-hover:opacity-100 transition-opacity`
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("span", {
                  className: `${card.isText ? "text-lg" : "text-3xl"} font-bold text-brand-primary block truncate`,
                  children: card.countUp ? /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(CountUp, {
                    from: 0,
                    to: Number(card.value) || 0,
                    separator: ",",
                    duration: 1.5
                  }, undefined, false, undefined, this) : card.value
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                  className: `absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-20 bg-gradient-to-br ${card.gradient}`
                }, undefined, false, undefined, this)
              ]
            }, card.label, true, undefined, this);
          })
        }, undefined, false, undefined, this),
        /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
          className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
          children: [
            /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
              className: "rounded-2xl bg-brand-surface border border-white/[0.03] overflow-hidden animate-slide-up",
              style: { animationDelay: "0.3s" },
              children: [
                /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                  className: "p-6 pb-4 border-b border-white/[0.03]",
                  children: /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("h3", {
                    className: "text-sm font-bold text-brand-primary uppercase tracking-wider flex items-center gap-2",
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Headphones, {
                        className: "w-4 h-4 text-sky-400"
                      }, undefined, false, undefined, this),
                      "Most Played"
                    ]
                  }, undefined, true, undefined, this)
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                  className: "p-4",
                  children: stats?.top_songs?.length > 0 ? /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                    className: "space-y-1",
                    children: stats.top_songs.slice(0, 8).map((song, i) => /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                      className: "flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer group",
                      onClick: () => playSong(song),
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("span", {
                          className: `text-sm font-black w-6 text-center tabular-nums ${i < 3 ? "text-white" : "text-brand-muted"}`,
                          children: i + 1
                        }, undefined, false, undefined, this),
                        /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                          className: "w-10 h-10 rounded-lg bg-brand-dark flex items-center justify-center overflow-hidden shrink-0 relative",
                          children: [
                            song.cover_image_url ? /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("img", {
                              src: song.cover_image_url,
                              className: "w-full h-full object-cover",
                              alt: ""
                            }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Music, {
                              className: "w-4 h-4 text-brand-muted"
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                              className: "absolute inset-0 bg-brand-dark/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
                              children: /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Play, {
                                className: "w-4 h-4 text-white fill-current ml-0.5"
                              }, undefined, false, undefined, this)
                            }, undefined, false, undefined, this)
                          ]
                        }, undefined, true, undefined, this),
                        /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                          className: "flex-1 min-w-0",
                          children: [
                            /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                              className: "text-sm font-semibold text-brand-primary truncate",
                              children: song.title
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                              className: "text-xs text-brand-muted truncate",
                              children: song.artist_name
                            }, undefined, false, undefined, this)
                          ]
                        }, undefined, true, undefined, this),
                        /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                          className: "flex items-center gap-3 shrink-0",
                          children: [
                            /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                              className: "w-20 h-1.5 bg-white/5 rounded-full overflow-hidden hidden sm:block",
                              children: /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                                className: "h-full bg-sky-400/60 rounded-full transition-all duration-700",
                                style: { width: `${song.play_count / maxPlayCount * 100}%` }
                              }, undefined, false, undefined, this)
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("span", {
                              className: "text-xs font-bold text-brand-muted tabular-nums w-8 text-right",
                              children: [
                                song.play_count,
                                "×"
                              ]
                            }, undefined, true, undefined, this)
                          ]
                        }, undefined, true, undefined, this)
                      ]
                    }, song.song_id, true, undefined, this))
                  }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                    className: "text-center py-12",
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Headphones, {
                        className: "w-10 h-10 text-brand-muted/30 mx-auto mb-3"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("p", {
                        className: "text-sm text-brand-muted",
                        children: "Start listening to see your top songs!"
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this)
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this),
            /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
              className: "space-y-6",
              children: [
                /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                  className: "rounded-2xl bg-brand-surface border border-white/[0.03] overflow-hidden animate-slide-up",
                  style: { animationDelay: "0.4s" },
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                      className: "p-6 pb-4 border-b border-white/[0.03]",
                      children: /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("h3", {
                        className: "text-sm font-bold text-brand-primary uppercase tracking-wider flex items-center gap-2",
                        children: [
                          /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Globe, {
                            className: "w-4 h-4 text-amber-400"
                          }, undefined, false, undefined, this),
                          "Top Languages"
                        ]
                      }, undefined, true, undefined, this)
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                      className: "p-6",
                      children: stats?.top_languages?.length > 0 ? /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                        className: "space-y-4",
                        children: stats.top_languages.slice(0, 3).map((lang, i) => {
                          const pct = lang.listen_count / maxLanguageCount * 100;
                          const barColor = genreColors[i % genreColors.length];
                          return /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                            className: "group",
                            children: [
                              /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                                className: "flex justify-between items-center mb-1.5",
                                children: [
                                  /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                      /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("span", {
                                        className: `text-xs font-black w-4 text-center tabular-nums ${i < 2 ? "text-white" : "text-brand-muted"}`,
                                        children: i + 1
                                      }, undefined, false, undefined, this),
                                      /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("span", {
                                        className: "text-sm font-semibold text-brand-primary",
                                        children: lang.language
                                      }, undefined, false, undefined, this)
                                    ]
                                  }, undefined, true, undefined, this),
                                  /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("span", {
                                    className: "text-xs font-bold text-brand-muted tabular-nums",
                                    children: [
                                      lang.listen_count,
                                      " plays"
                                    ]
                                  }, undefined, true, undefined, this)
                                ]
                              }, undefined, true, undefined, this),
                              /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                                className: "h-2 bg-white/5 rounded-full overflow-hidden ml-7",
                                children: /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                                  className: `h-full ${barColor} rounded-full transition-all duration-1000 ease-out`,
                                  style: { width: `${pct}%`, opacity: 0.7 }
                                }, undefined, false, undefined, this)
                              }, undefined, false, undefined, this)
                            ]
                          }, lang.language, true, undefined, this);
                        })
                      }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                        className: "text-center py-6",
                        children: [
                          /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Globe, {
                            className: "w-8 h-8 text-brand-muted/30 mx-auto mb-2"
                          }, undefined, false, undefined, this),
                          /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("p", {
                            className: "text-xs text-brand-muted",
                            children: "Listen to more music to discover your top language!"
                          }, undefined, false, undefined, this)
                        ]
                      }, undefined, true, undefined, this)
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                  className: "rounded-2xl bg-brand-surface border border-white/[0.03] overflow-hidden animate-slide-up",
                  style: { animationDelay: "0.5s" },
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                      className: "p-6 pb-4 border-b border-white/[0.03]",
                      children: /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("h3", {
                        className: "text-sm font-bold text-brand-primary uppercase tracking-wider flex items-center gap-2",
                        children: [
                          /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Disc3, {
                            className: "w-4 h-4 text-violet-400"
                          }, undefined, false, undefined, this),
                          "Top Genres"
                        ]
                      }, undefined, true, undefined, this)
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                      className: "p-6",
                      children: stats?.top_genres?.length > 0 ? /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                        className: "space-y-4",
                        children: stats.top_genres.slice(0, 4).map((genre, i) => {
                          const pct = genre.listen_count / maxGenreCount * 100;
                          const barColor = genreColors[i % genreColors.length];
                          return /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                            className: "group",
                            children: [
                              /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                                className: "flex justify-between items-center mb-1.5",
                                children: [
                                  /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                      /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("span", {
                                        className: `text-xs font-black w-4 text-center tabular-nums ${i < 2 ? "text-white" : "text-brand-muted"}`,
                                        children: i + 1
                                      }, undefined, false, undefined, this),
                                      /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("span", {
                                        className: "text-sm font-semibold text-brand-primary",
                                        children: genre.genre
                                      }, undefined, false, undefined, this)
                                    ]
                                  }, undefined, true, undefined, this),
                                  /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("span", {
                                    className: "text-xs font-bold text-brand-muted tabular-nums",
                                    children: [
                                      genre.listen_count,
                                      " plays"
                                    ]
                                  }, undefined, true, undefined, this)
                                ]
                              }, undefined, true, undefined, this),
                              /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                                className: "h-2 bg-white/5 rounded-full overflow-hidden ml-7",
                                children: /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                                  className: `h-full ${barColor} rounded-full transition-all duration-1000 ease-out`,
                                  style: { width: `${pct}%`, opacity: 0.7 }
                                }, undefined, false, undefined, this)
                              }, undefined, false, undefined, this)
                            ]
                          }, genre.genre, true, undefined, this);
                        })
                      }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("div", {
                        className: "text-center py-6",
                        children: [
                          /* @__PURE__ */ jsx_dev_runtime6.jsxDEV(Disc3, {
                            className: "w-8 h-8 text-brand-muted/30 mx-auto mb-2"
                          }, undefined, false, undefined, this),
                          /* @__PURE__ */ jsx_dev_runtime6.jsxDEV("p", {
                            className: "text-xs text-brand-muted",
                            children: "Listen to more music to discover your genre taste!"
                          }, undefined, false, undefined, this)
                        ]
                      }, undefined, true, undefined, this)
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              ]
            }, undefined, true, undefined, this)
          ]
        }, undefined, true, undefined, this)
      ]
    }, undefined, true, undefined, this)
  }, undefined, false, undefined, this);
};
var ListenerStats_default = ListenerStats;

// src/components/Sidebar.jsx
var import_react38 = __toESM(require_react(), 1);
init_lucide_react();
init_PlayerContext();

// src/components/Logo.jsx
var import_react37 = __toESM(require_react(), 1);
var jsx_dev_runtime7 = __toESM(require_jsx_dev_runtime(), 1);
var WaveLogo = ({ size = 32, className = "", withText = false, textSize = "text-xl" }) => {
  return /* @__PURE__ */ jsx_dev_runtime7.jsxDEV("div", {
    className: `flex items-center justify-center gap-3 ${className}`,
    children: [
      /* @__PURE__ */ jsx_dev_runtime7.jsxDEV("svg", {
        width: size * (628 / 260),
        height: size,
        viewBox: "450 375 632 260",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        className: "shrink-0",
        children: [
          /* @__PURE__ */ jsx_dev_runtime7.jsxDEV("path", {
            d: "M717.062 375.832C718.256 375.829 719.45 375.825 720.68 375.822C723.184 375.817 725.688 375.815 728.192 375.815C731.99 375.812 735.788 375.794 739.586 375.775C742.036 375.772 744.487 375.77 746.938 375.77C748.055 375.762 749.172 375.755 750.323 375.748C757.045 375.767 763.445 376.367 770.072 377.503C772.897 377.983 775.718 378.345 778.562 378.687C818.501 385.572 850.813 414.124 873.5 446.187C878.059 452.953 882.397 459.864 886.762 466.755C897.232 483.333 897.232 483.333 909 499C913.171 496.14 916.94 493.275 920.188 489.375C923.025 485.976 926.081 483.045 929.375 480.09C939.547 470.83 949.123 460.946 958.812 451.187C961.708 448.271 964.605 445.356 967.505 442.444C969.296 440.645 971.085 438.845 972.871 437.041C977.747 432.145 982.741 427.481 988 423C988.987 422.131 989.975 421.262 990.992 420.367C1016.56 398.262 1047.21 378.318 1082 377C1080.62 379.5 1080.62 379.5 1079 382C1078.34 382 1077.68 382 1077 382C1076.75 382.574 1076.5 383.147 1076.24 383.738C1074.83 386.316 1073.17 388.073 1071.12 390.187C1059.45 402.986 1050.63 418.06 1042 433C1041.35 434.123 1041.35 434.123 1040.68 435.269C1034.41 446.096 1028.92 457.223 1023.59 468.539C1021.46 473.06 1019.26 477.541 1017 482C1013.78 488.372 1010.69 494.803 1007.62 501.25C999.685 517.89 991.658 534.279 982 550C981.523 550.783 981.045 551.566 980.554 552.373C974.237 562.703 967.724 572.661 960 582C959.515 582.587 959.03 583.173 958.53 583.777C941.263 604.52 921.538 622.17 894 627C877.748 628.189 862.927 627.795 848 621C846.349 620.298 846.349 620.298 844.664 619.582C821.544 608.973 803.565 587.927 790 567C789.278 565.895 788.556 564.791 787.812 563.652C783.075 556.185 779.091 548.429 775.224 540.491C773.83 537.655 772.413 534.831 770.992 532.008C765.367 520.831 759.821 509.625 754.448 498.325C747.696 484.133 740.811 470.006 733.918 455.883C733.101 454.206 732.286 452.529 731.471 450.851C725.299 438.15 718.57 425.822 711.501 413.597C710.56 411.968 709.622 410.338 708.69 408.704C702.611 398.05 695.784 388.63 687 380C690.267 377.076 692.596 376.558 696.934 376.323C698.09 376.259 699.246 376.194 700.437 376.128C705.981 375.929 711.515 375.838 717.062 375.832Z",
            fill: "#FDFDFD"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime7.jsxDEV("path", {
            d: "M515.375 375.625C517.22 375.614 517.22 375.614 519.102 375.602C533.386 375.531 547.014 375.993 561 379C562.382 379.283 563.764 379.565 565.146 379.847C601.151 387.489 629.815 411.566 649.617 441.845C659.839 457.776 668.852 474.184 677.43 491.031C681.981 499.962 686.781 508.748 691.634 517.517C692.977 519.958 694.297 522.408 695.613 524.863C705.338 542.898 716.91 562.808 737.561 569.402C741.554 570.381 745.408 570.396 749.5 570.312C750.29 570.316 751.08 570.319 751.895 570.322C759.266 570.256 766.11 568.803 773.062 566.375C773.817 566.115 774.571 565.854 775.348 565.586C775.893 565.393 776.438 565.199 777 565C769.138 590.143 750.212 609.906 727.304 622.162C718.272 626.811 708.796 630.322 699 633C698.297 633.196 697.594 633.392 696.87 633.593C689.153 635.442 681.315 635.372 673.426 635.371C671.032 635.375 668.64 635.411 666.246 635.449C638.807 635.651 615.829 625.985 596 607C595.336 606.399 594.672 605.799 593.988 605.18C573.488 585.968 562.051 557.717 550.503 532.721C544.325 519.352 538.036 506.035 531.752 492.715C530.254 489.539 528.759 486.362 527.266 483.184C523.048 474.221 518.756 465.303 514.259 456.477C513.318 454.626 512.382 452.772 511.448 450.917C495.785 419.461 495.785 419.461 472 394C471.494 393.599 470.987 393.197 470.465 392.784C463.529 387.204 463.529 387.204 456.105 382.328C455.411 381.89 454.716 381.452 454 381C454 380.34 454 379.68 454 379C474.44 376.231 494.766 375.669 515.375 375.625Z",
            fill: "#FDFDFD"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime7.jsxDEV("path", {
            d: "M1082 377C1079 382.5 1077.14 384.107 1072 390.5C1047.5 421 1013.5 489 1009 499C1004.5 509 995 518.5 983 523C971 527.5 945.344 527 931.5 518.5C917.656 510 909 499 909 499C909 499 933.364 476.807 945.344 464.719C959.327 450.672 972.887 435.847 988 423C1014.51 399.672 1045.73 378.876 1082 377Z",
            fill: "#C5C4C4"
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      withText && /* @__PURE__ */ jsx_dev_runtime7.jsxDEV("span", {
        className: `${textSize} font-black tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent`,
        children: "Wave"
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
};
var Logo_default = WaveLogo;

// src/components/Sidebar.jsx
var jsx_dev_runtime8 = __toESM(require_jsx_dev_runtime(), 1);
var Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { playlists, createPlaylist, likedPlaylists, isSidebarCollapsed, setIsSidebarCollapsed, isFullScreenPlayer } = import_react38.useContext(PlayerContext);
  let currentView = "home";
  if (location.pathname === "/search")
    currentView = "search";
  else if (location.pathname === "/dashboard/library")
    currentView = "library";
  else if (location.pathname === "/dashboard/stats")
    currentView = "stats";
  const handleCreatePlaylist = () => {
    const title = prompt("Enter playlist name:");
    if (title)
      createPlaylist(title);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  if (isFullScreenPlayer)
    return null;
  return /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(jsx_dev_runtime8.Fragment, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("div", {
        className: `${isSidebarCollapsed ? "w-20" : "w-64"} hidden md:flex flex-col bg-brand-dark pt-6 pb-2 shrink-0 z-50 border-r border-white/[0.04] transition-all duration-300`,
        children: [
          /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("div", {
            className: `flex items-center ${isSidebarCollapsed ? "justify-center mx-0" : "justify-between px-8"} mb-10 relative h-8`,
            children: [
              !isSidebarCollapsed && /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("div", {
                className: "flex items-center gap-3 cursor-pointer animate-fade-in",
                onClick: () => navigate("/dashboard"),
                children: [
                  /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(Logo_default, {
                    size: 22,
                    className: "shrink-0"
                  }, undefined, false, undefined, this),
                  /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("span", {
                    className: "text-xl font-black tracking-tighter bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent",
                    children: "Wave"
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("button", {
                onClick: () => setIsSidebarCollapsed(!isSidebarCollapsed),
                className: `w-8 h-8 rounded-full flex items-center justify-center text-brand-muted hover:text-white hover:bg-white/10 transition-colors shrink-0 ${isSidebarCollapsed ? "" : "absolute right-4"}`,
                title: isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar",
                children: isSidebarCollapsed ? /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(Logo_default, {
                  size: 16
                }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(ChevronLeft, {
                  className: "w-4 h-4"
                }, undefined, false, undefined, this)
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("nav", {
            className: "flex-1 px-4 space-y-2 custom-scrollbar overflow-y-auto overflow-x-hidden",
            children: [
              /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(Link, {
                to: "/dashboard",
                className: `nav-link ${currentView === "home" ? "nav-link-active" : "nav-link-inactive"} ${isSidebarCollapsed ? "justify-center px-0" : ""}`,
                title: isSidebarCollapsed ? "Home" : "",
                children: [
                  /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(House, {
                    className: "w-5 h-5 shrink-0"
                  }, undefined, false, undefined, this),
                  !isSidebarCollapsed && /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("span", {
                    className: "truncate",
                    children: "Home"
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(Link, {
                to: "/search",
                className: `nav-link ${currentView === "search" ? "nav-link-active" : "nav-link-inactive"} ${isSidebarCollapsed ? "justify-center px-0" : ""}`,
                title: isSidebarCollapsed ? "Search" : "",
                children: [
                  /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(Search, {
                    className: "w-5 h-5 shrink-0"
                  }, undefined, false, undefined, this),
                  !isSidebarCollapsed && /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("span", {
                    className: "truncate",
                    children: "Search"
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(Link, {
                to: "/dashboard/library",
                className: `nav-link ${currentView === "library" ? "nav-link-active" : "nav-link-inactive"} ${isSidebarCollapsed ? "justify-center px-0" : ""}`,
                title: isSidebarCollapsed ? "Your Library" : "",
                children: [
                  /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(Library, {
                    className: "w-5 h-5 shrink-0"
                  }, undefined, false, undefined, this),
                  !isSidebarCollapsed && /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("span", {
                    className: "truncate",
                    children: "Your Library"
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(Link, {
                to: "/dashboard/stats",
                className: `nav-link ${currentView === "stats" ? "nav-link-active" : "nav-link-inactive"} ${isSidebarCollapsed ? "justify-center px-0" : ""}`,
                title: isSidebarCollapsed ? "Your Stats" : "",
                children: [
                  /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(ChartColumn, {
                    className: "w-5 h-5 shrink-0"
                  }, undefined, false, undefined, this),
                  !isSidebarCollapsed && /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("span", {
                    className: "truncate",
                    children: "Your Stats"
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("div", {
                className: "pt-6 px-2 space-y-1",
                children: [
                  playlists?.map((pl) => /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(Link, {
                    to: `/dashboard/playlist/${pl.playlist_id}`,
                    className: `flex items-center gap-3 p-2 rounded-lg transition-colors overflow-hidden group ${location.pathname === `/dashboard/playlist/${pl.playlist_id}` ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"} ${isSidebarCollapsed ? "justify-center" : ""}`,
                    title: pl.title,
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("div", {
                        className: "w-8 h-8 rounded-md bg-gradient-to-tr from-brand-accent/20 to-brand-primary/10 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-white/20 transition-colors",
                        children: /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(Music, {
                          className: "w-4 h-4 text-white/50"
                        }, undefined, false, undefined, this)
                      }, undefined, false, undefined, this),
                      !isSidebarCollapsed && /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("span", {
                        className: `text-sm font-medium truncate ${location.pathname === `/dashboard/playlist/${pl.playlist_id}` ? "text-brand-primary" : "text-brand-muted group-hover:text-white transition-colors"}`,
                        children: pl.title
                      }, undefined, false, undefined, this)
                    ]
                  }, `local-${pl.playlist_id}`, true, undefined, this)),
                  likedPlaylists?.map((pl) => /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(Link, {
                    to: `/playlist/saavn/${pl.saavn_playlist_id}`,
                    className: `flex items-center gap-3 p-2 rounded-lg transition-colors overflow-hidden group ${location.pathname === `/playlist/saavn/${pl.saavn_playlist_id}` ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"} ${isSidebarCollapsed ? "justify-center" : ""}`,
                    title: pl.title,
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("div", {
                        className: "w-8 h-8 rounded-md bg-gradient-to-tr from-indigo-500/20 to-purple-500/10 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-white/20 transition-colors",
                        children: /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(Library, {
                          className: "w-4 h-4 text-indigo-400/50"
                        }, undefined, false, undefined, this)
                      }, undefined, false, undefined, this),
                      !isSidebarCollapsed && /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("span", {
                        className: `text-sm font-medium truncate ${location.pathname === `/playlist/saavn/${pl.saavn_playlist_id}` ? "text-brand-primary" : "text-brand-muted group-hover:text-white transition-colors"}`,
                        children: pl.title
                      }, undefined, false, undefined, this)
                    ]
                  }, `saavn-${pl.saavn_playlist_id}`, true, undefined, this)),
                  /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("button", {
                    onClick: handleCreatePlaylist,
                    className: `w-full flex items-center gap-3 p-2 mt-2 rounded-lg text-brand-muted hover:text-white hover:bg-white/[0.04] transition-colors group ${isSidebarCollapsed ? "justify-center" : ""}`,
                    title: "Create New Playlist",
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("div", {
                        className: "w-8 h-8 rounded-md bg-white/[0.02] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/30 transition-colors",
                        children: /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(Plus, {
                          className: "w-4 h-4 group-hover:scale-110 transition-transform"
                        }, undefined, false, undefined, this)
                      }, undefined, false, undefined, this),
                      !isSidebarCollapsed && /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("span", {
                        className: "text-sm font-medium",
                        children: "Create Playlist"
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this)
                ]
              }, undefined, true, undefined, this),
              (user.role === "artist" || user.role === "admin") && /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("div", {
                className: "pt-8",
                children: /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(Link, {
                  to: "/artist",
                  className: `flex items-center gap-4 py-3 text-brand-muted hover:text-brand-primary rounded-lg font-medium transition-colors ${isSidebarCollapsed ? "justify-center px-0" : "px-4"}`,
                  title: isSidebarCollapsed ? "Artist Portal" : "",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(Music, {
                      className: "w-5 h-5 shrink-0"
                    }, undefined, false, undefined, this),
                    !isSidebarCollapsed && /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("span", {
                      className: "truncate",
                      children: "Artist Portal"
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              }, undefined, false, undefined, this),
              user.role === "admin" && /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(Link, {
                to: "/admin",
                className: `flex items-center gap-4 py-3 text-brand-muted hover:text-brand-primary rounded-lg font-medium transition-colors ${isSidebarCollapsed ? "justify-center px-0" : "px-4"}`,
                title: isSidebarCollapsed ? "Admin Access" : "",
                children: [
                  /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(Shield, {
                    className: "w-5 h-5 shrink-0"
                  }, undefined, false, undefined, this),
                  !isSidebarCollapsed && /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("span", {
                    className: "truncate",
                    children: "Admin Access"
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("div", {
        className: "md:hidden fixed bottom-0 left-0 right-0 h-16 bg-brand-dark/95 backdrop-blur-xl border-t border-white/[0.04] z-[60] flex items-center justify-around px-2 pb-safe",
        children: [
          /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(Link, {
            to: "/dashboard",
            className: `flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors ${currentView === "home" ? "text-brand-primary" : "text-brand-muted hover:text-white"}`,
            children: [
              /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(House, {
                className: `w-5 h-5 ${currentView === "home" ? "fill-current" : ""}`
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("span", {
                className: "text-[10px] font-medium tracking-wide",
                children: "Home"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(Link, {
            to: "/search",
            className: `flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors ${currentView === "search" ? "text-brand-primary" : "text-brand-muted hover:text-white"}`,
            children: [
              /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(Search, {
                className: `w-5 h-5 ${currentView === "search" ? "font-black" : ""}`
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("span", {
                className: "text-[10px] font-medium tracking-wide",
                children: "Search"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(Link, {
            to: "/dashboard/library",
            className: `flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors ${currentView === "library" ? "text-brand-primary" : "text-brand-muted hover:text-white"}`,
            children: [
              /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(Library, {
                className: `w-5 h-5 ${currentView === "library" ? "fill-current" : ""}`
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("span", {
                className: "text-[10px] font-medium tracking-wide",
                children: "Library"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(Link, {
            to: "/dashboard/stats",
            className: `flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors ${currentView === "stats" ? "text-brand-primary" : "text-brand-muted hover:text-white"}`,
            children: [
              /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(ChartColumn, {
                className: `w-5 h-5 ${currentView === "stats" ? "fill-current" : ""}`
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime8.jsxDEV("span", {
                className: "text-[10px] font-medium tracking-wide",
                children: "Stats"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this)
    ]
  }, undefined, true, undefined, this);
};
var Sidebar_default = Sidebar;

// src/components/BottomPlayer.jsx
var import_react47 = __toESM(require_react(), 1);
init_lucide_react();
init_react();
init_PlayerContext();

// src/components/TiltedCard.jsx
var import_react40 = __toESM(require_react(), 1);
init_react();

// src/context/PerformanceContext.jsx
var import_react39 = __toESM(require_react(), 1);
var jsx_dev_runtime9 = __toESM(require_jsx_dev_runtime(), 1);
var PerformanceContext = import_react39.createContext();
var usePerformance = () => {
  return import_react39.useContext(PerformanceContext);
};

// src/components/TiltedCard.jsx
var jsx_dev_runtime10 = __toESM(require_jsx_dev_runtime(), 1);
var springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2
};
function TiltedCard({
  imageSrc,
  altText = "Tilted card image",
  captionText = "",
  containerHeight = "300px",
  containerWidth = "100%",
  imageHeight = "300px",
  imageWidth = "300px",
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = false,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false
}) {
  const { reducedEffects } = usePerformance();
  const ref = import_react40.useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale2 = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1
  });
  const [lastY, setLastY] = import_react40.useState(0);
  function handleMouse(e) {
    if (!ref.current || reducedEffects)
      return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    const rotationX = offsetY / (rect.height / 2) * -rotateAmplitude;
    const rotationY = offsetX / (rect.width / 2) * rotateAmplitude;
    rotateX.set(rotationX);
    rotateY.set(rotationY);
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }
  function handleMouseEnter() {
    if (reducedEffects)
      return;
    scale2.set(scaleOnHover);
    opacity.set(1);
  }
  function handleMouseLeave() {
    opacity.set(0);
    scale2.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }
  return /* @__PURE__ */ jsx_dev_runtime10.jsxDEV("figure", {
    ref,
    className: "relative w-full h-full [perspective:800px] flex flex-col items-center justify-center cursor-pointer group",
    style: {
      height: containerHeight,
      width: containerWidth
    },
    onMouseMove: handleMouse,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    children: [
      showMobileWarning && /* @__PURE__ */ jsx_dev_runtime10.jsxDEV("div", {
        className: "absolute top-4 text-center text-sm block sm:hidden text-brand-muted",
        children: "This effect is not optimized for mobile. Check on desktop."
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime10.jsxDEV(motion.div, {
        className: "relative [transform-style:preserve-3d] transition-shadow duration-300 group-hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] rounded-2xl",
        style: {
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale: scale2
        },
        children: [
          /* @__PURE__ */ jsx_dev_runtime10.jsxDEV(motion.img, {
            src: imageSrc,
            alt: altText,
            className: "absolute top-0 left-0 object-cover rounded-[15px] will-change-transform [transform:translateZ(0)] shadow-lg",
            style: {
              width: imageWidth,
              height: imageHeight
            }
          }, undefined, false, undefined, this),
          displayOverlayContent && overlayContent && /* @__PURE__ */ jsx_dev_runtime10.jsxDEV(motion.div, {
            className: "absolute top-0 left-0 z-[2] will-change-transform [transform:translateZ(30px)]",
            children: overlayContent
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      showTooltip && /* @__PURE__ */ jsx_dev_runtime10.jsxDEV(motion.figcaption, {
        className: "pointer-events-none absolute left-0 top-0 rounded-[4px] bg-brand-surface/90 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-brand-primary opacity-0 z-[3] hidden sm:block border border-white/5 shadow-xl",
        style: {
          x,
          y,
          opacity,
          rotate: rotateFigcaption
        },
        children: captionText
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// src/components/QueuePanel.jsx
var import_react42 = __toESM(require_react(), 1);
init_lucide_react();
init_PlayerContext();
var jsx_dev_runtime11 = __toESM(require_jsx_dev_runtime(), 1);
var QueuePanel = ({ isOpen, onClose }) => {
  const { currentSong, queue, removeFromQueue, clearQueue, playSong, resolveUrl: resolveUrl2, reorderQueue } = import_react42.useContext(PlayerContext);
  const dragItem = import_react42.useRef(null);
  const dragOverItem = import_react42.useRef(null);
  const [draggedIndex, setDraggedIndex] = import_react42.useState(null);
  const touchStartY = import_react42.useRef(null);
  const touchItemIndex = import_react42.useRef(null);
  const handleDragStart = (e, index) => {
    dragItem.current = index;
    setDraggedIndex(index);
  };
  const handleDragEnter = (e, index) => {
    dragOverItem.current = index;
  };
  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      reorderQueue(dragItem.current, dragOverItem.current);
    }
    dragItem.current = null;
    dragOverItem.current = null;
    setDraggedIndex(null);
  };
  const handleTouchStart = (e, index) => {
    touchStartY.current = e.touches[0].clientY;
    touchItemIndex.current = index;
  };
  const handleTouchEnd = (e) => {
    if (touchStartY.current === null || touchItemIndex.current === null)
      return;
    const endY = e.changedTouches[0].clientY;
    const diff = endY - touchStartY.current;
    const idx = touchItemIndex.current;
    if (Math.abs(diff) > 40) {
      if (diff < 0 && idx > 0)
        reorderQueue(idx, idx - 1);
      if (diff > 0 && idx < queue.length - 1)
        reorderQueue(idx, idx + 1);
    }
    touchStartY.current = null;
    touchItemIndex.current = null;
  };
  if (!isOpen)
    return null;
  return /* @__PURE__ */ jsx_dev_runtime11.jsxDEV(jsx_dev_runtime11.Fragment, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("div", {
        onClick: onClose,
        className: "fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("div", {
        className: "fixed right-0 top-0 bottom-0 w-full md:w-[380px] bg-brand-dark border-l border-white/[0.06] z-[70] flex flex-col animate-slide-in-right shadow-2xl",
        children: [
          /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("div", {
            className: "p-5 border-b border-white/[0.04] flex items-center justify-between shrink-0 pt-safe",
            children: [
              /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("h2", {
                className: "text-sm font-bold uppercase tracking-widest text-brand-primary flex items-center gap-2.5",
                children: [
                  /* @__PURE__ */ jsx_dev_runtime11.jsxDEV(ListMusic, {
                    className: "w-4 h-4 text-brand-muted"
                  }, undefined, false, undefined, this),
                  "Queue"
                ]
              }, undefined, true, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("button", {
                onClick: onClose,
                className: "w-10 h-10 rounded-full hover:bg-white/[0.06] flex items-center justify-center transition-colors text-brand-muted hover:text-brand-primary",
                children: /* @__PURE__ */ jsx_dev_runtime11.jsxDEV(X, {
                  className: "w-5 h-5"
                }, undefined, false, undefined, this)
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          currentSong && /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("div", {
            className: "p-5 border-b border-white/[0.04] shrink-0",
            children: [
              /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("span", {
                className: "text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-3 block",
                children: "Now Playing"
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("div", {
                className: "flex items-center gap-3",
                children: [
                  /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("div", {
                    className: "w-12 h-12 rounded-lg overflow-hidden bg-brand-surface shrink-0 shadow-md",
                    children: currentSong.cover_image_url ? /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("img", {
                      src: resolveUrl2(currentSong.cover_image_url),
                      alt: "",
                      className: "w-full h-full object-cover"
                    }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("div", {
                      className: "w-full h-full flex items-center justify-center",
                      children: /* @__PURE__ */ jsx_dev_runtime11.jsxDEV(Music, {
                        className: "w-5 h-5 text-brand-muted"
                      }, undefined, false, undefined, this)
                    }, undefined, false, undefined, this)
                  }, undefined, false, undefined, this),
                  /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("div", {
                    className: "min-w-0",
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("div", {
                        className: "text-sm font-bold truncate text-brand-primary",
                        children: currentSong.title
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("div", {
                        className: "text-xs text-brand-muted truncate",
                        children: currentSong.artist_name
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this)
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("div", {
            className: "flex-1 overflow-y-auto custom-scrollbar",
            children: queue.length > 0 ? /* @__PURE__ */ jsx_dev_runtime11.jsxDEV(jsx_dev_runtime11.Fragment, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("div", {
                  className: "p-5 pb-2 flex items-center justify-between",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("span", {
                      className: "text-[10px] font-bold uppercase tracking-widest text-brand-muted",
                      children: [
                        "Next up · ",
                        queue.length,
                        " ",
                        queue.length === 1 ? "song" : "songs"
                      ]
                    }, undefined, true, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("button", {
                      onClick: clearQueue,
                      className: "text-[10px] font-bold uppercase tracking-widest text-brand-muted hover:text-red-400 transition-colors",
                      children: "Clear all"
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("div", {
                  className: "px-3 pb-4 space-y-0.5",
                  children: queue.map((song, idx) => /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("div", {
                    draggable: true,
                    onDragStart: (e) => handleDragStart(e, idx),
                    onDragEnter: (e) => handleDragEnter(e, idx),
                    onDragEnd: handleDragEnd,
                    onDragOver: (e) => e.preventDefault(),
                    onTouchStart: (e) => handleTouchStart(e, idx),
                    onTouchEnd: handleTouchEnd,
                    className: `flex items-center gap-3 p-2.5 rounded-lg transition-all group cursor-grab active:cursor-grabbing hover:bg-white/[0.05] ${draggedIndex === idx ? "opacity-30" : "opacity-100"}`,
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime11.jsxDEV(GripVertical, {
                        className: "w-4 h-4 text-brand-muted/30 group-hover:text-brand-muted/80 cursor-grab shrink-0"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("div", {
                        className: "w-10 h-10 rounded-md overflow-hidden bg-brand-surface shrink-0",
                        children: song.cover_image_url ? /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("img", {
                          src: resolveUrl2(song.cover_image_url),
                          alt: "",
                          className: "w-full h-full object-cover pointer-events-none"
                        }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("div", {
                          className: "w-full h-full flex items-center justify-center pointer-events-none",
                          children: /* @__PURE__ */ jsx_dev_runtime11.jsxDEV(Music, {
                            className: "w-3.5 h-3.5 text-brand-muted"
                          }, undefined, false, undefined, this)
                        }, undefined, false, undefined, this)
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("div", {
                        className: "flex-1 min-w-0 pr-1",
                        children: [
                          /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("div", {
                            className: "text-sm font-semibold truncate text-brand-primary",
                            children: song.title
                          }, undefined, false, undefined, this),
                          /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("div", {
                            className: "text-xs text-brand-muted truncate",
                            children: song.artist_name
                          }, undefined, false, undefined, this)
                        ]
                      }, undefined, true, undefined, this),
                      /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("button", {
                        onClick: (e) => {
                          e.stopPropagation();
                          removeFromQueue(idx);
                        },
                        className: "w-10 h-10 rounded-full bg-white/5 md:bg-transparent md:opacity-0 group-hover:opacity-100 hover:bg-red-500/20 flex items-center justify-center transition-all shrink-0 active:scale-90",
                        children: /* @__PURE__ */ jsx_dev_runtime11.jsxDEV(Trash2, {
                          className: "w-4 h-4 text-red-400"
                        }, undefined, false, undefined, this)
                      }, undefined, false, undefined, this)
                    ]
                  }, `q-${song.song_id || song.saavn_id}-${idx}`, true, undefined, this))
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this) : /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("div", {
              className: "flex-1 flex flex-col items-center justify-center text-center p-10",
              children: [
                /* @__PURE__ */ jsx_dev_runtime11.jsxDEV(ListMusic, {
                  className: "w-12 h-12 text-brand-muted/20 mb-4"
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("p", {
                  className: "text-sm font-bold text-brand-muted mb-1",
                  children: "Your queue is empty"
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("p", {
                  className: "text-xs text-brand-muted/60",
                  children: "Add songs to play next"
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this)
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("style", {
        children: `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
};
var QueuePanel_default = QueuePanel;

// src/components/ElasticSlider.jsx
init_react();
var import_react44 = __toESM(require_react(), 1);
var jsx_dev_runtime12 = __toESM(require_jsx_dev_runtime(), 1);
var MAX_OVERFLOW = 50;
function ElasticSlider({
  defaultValue = 50,
  startingValue = 0,
  maxValue = 100,
  className = "",
  isStepped = false,
  stepSize = 1,
  leftIcon = /* @__PURE__ */ jsx_dev_runtime12.jsxDEV(jsx_dev_runtime12.Fragment, {
    children: "-"
  }, undefined, false, undefined, this),
  rightIcon = /* @__PURE__ */ jsx_dev_runtime12.jsxDEV(jsx_dev_runtime12.Fragment, {
    children: "+"
  }, undefined, false, undefined, this),
  onChange
}) {
  return /* @__PURE__ */ jsx_dev_runtime12.jsxDEV("div", {
    className: `flex flex-col items-center justify-center gap-4 w-48 ${className}`,
    children: /* @__PURE__ */ jsx_dev_runtime12.jsxDEV(Slider, {
      defaultValue,
      startingValue,
      maxValue,
      isStepped,
      stepSize,
      leftIcon,
      rightIcon,
      onChange
    }, undefined, false, undefined, this)
  }, undefined, false, undefined, this);
}
function Slider({ defaultValue, startingValue, maxValue, isStepped, stepSize, leftIcon, rightIcon, onChange }) {
  const [value, setValue] = import_react44.useState(defaultValue);
  const sliderRef = import_react44.useRef(null);
  const [region, setRegion] = import_react44.useState("middle");
  const clientX = useMotionValue(0);
  const overflow = useMotionValue(0);
  const scale2 = useMotionValue(1);
  import_react44.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  useMotionValueEvent(clientX, "change", (latest) => {
    if (sliderRef.current) {
      const { left, right } = sliderRef.current.getBoundingClientRect();
      let newValue;
      if (latest < left) {
        setRegion("left");
        newValue = left - latest;
      } else if (latest > right) {
        setRegion("right");
        newValue = latest - right;
      } else {
        setRegion("middle");
        newValue = 0;
      }
      overflow.jump(decay(newValue, MAX_OVERFLOW));
    }
  });
  const handlePointerMove = (e) => {
    if (e.buttons > 0 && sliderRef.current) {
      const { left, width } = sliderRef.current.getBoundingClientRect();
      let newValue = startingValue + (e.clientX - left) / width * (maxValue - startingValue);
      if (isStepped) {
        newValue = Math.round(newValue / stepSize) * stepSize;
      }
      newValue = Math.min(Math.max(newValue, startingValue), maxValue);
      setValue(newValue);
      if (onChange)
        onChange(newValue);
      clientX.jump(e.clientX);
    }
  };
  const handlePointerDown = (e) => {
    handlePointerMove(e);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handlePointerUp = () => {
    animate(overflow, 0, { type: "spring", bounce: 0.5 });
  };
  const getRangePercentage = () => {
    const totalRange = maxValue - startingValue;
    if (totalRange === 0)
      return 0;
    return (value - startingValue) / totalRange * 100;
  };
  return /* @__PURE__ */ jsx_dev_runtime12.jsxDEV(jsx_dev_runtime12.Fragment, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime12.jsxDEV(motion.div, {
        onHoverStart: () => animate(scale2, 1.2),
        onHoverEnd: () => animate(scale2, 1),
        onTouchStart: () => animate(scale2, 1.2),
        onTouchEnd: () => animate(scale2, 1),
        style: {
          scale: scale2,
          opacity: useTransform(scale2, [1, 1.2], [0.7, 1])
        },
        className: "flex w-full touch-none select-none items-center justify-center gap-4",
        children: [
          /* @__PURE__ */ jsx_dev_runtime12.jsxDEV(motion.div, {
            animate: {
              scale: region === "left" ? [1, 1.4, 1] : 1,
              transition: { duration: 0.25 }
            },
            style: {
              x: useTransform(() => region === "left" ? -overflow.get() / scale2.get() : 0)
            },
            children: leftIcon
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime12.jsxDEV("div", {
            ref: sliderRef,
            className: "relative flex w-full max-w-xs flex-grow cursor-grab touch-none select-none items-center py-4",
            onPointerMove: handlePointerMove,
            onPointerDown: handlePointerDown,
            onPointerUp: handlePointerUp,
            children: /* @__PURE__ */ jsx_dev_runtime12.jsxDEV(motion.div, {
              style: {
                scaleX: useTransform(() => {
                  if (sliderRef.current) {
                    const { width } = sliderRef.current.getBoundingClientRect();
                    return 1 + overflow.get() / width;
                  }
                }),
                scaleY: useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.8]),
                transformOrigin: useTransform(() => {
                  if (sliderRef.current) {
                    const { left, width } = sliderRef.current.getBoundingClientRect();
                    return clientX.get() < left + width / 2 ? "right" : "left";
                  }
                }),
                height: useTransform(scale2, [1, 1.2], [4, 8]),
                marginTop: useTransform(scale2, [1, 1.2], [0, -2]),
                marginBottom: useTransform(scale2, [1, 1.2], [0, -2])
              },
              className: "flex flex-grow transition-all",
              children: /* @__PURE__ */ jsx_dev_runtime12.jsxDEV("div", {
                className: "relative h-full flex-grow overflow-hidden rounded-full bg-white/10 pointer-events-none",
                children: /* @__PURE__ */ jsx_dev_runtime12.jsxDEV("div", {
                  className: "absolute h-full bg-brand-primary rounded-full transition-all pointer-events-none",
                  style: { width: `${getRangePercentage()}%` }
                }, undefined, false, undefined, this)
              }, undefined, false, undefined, this)
            }, undefined, false, undefined, this)
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime12.jsxDEV(motion.div, {
            animate: {
              scale: region === "right" ? [1, 1.4, 1] : 1,
              transition: { duration: 0.25 }
            },
            style: {
              x: useTransform(() => region === "right" ? overflow.get() / scale2.get() : 0)
            },
            children: rightIcon
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime12.jsxDEV("p", {
        className: "absolute text-brand-muted transform -translate-y-4 text-xs font-medium tracking-wide hidden",
        children: Math.round(value)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
function decay(value, max) {
  if (max === 0)
    return 0;
  const entry = value / max;
  const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
  return sigmoid * max;
}

// src/components/LyricsPanel.jsx
var import_react45 = __toESM(require_react(), 1);
init_react();
init_lucide_react();
init_api();
var jsx_dev_runtime13 = __toESM(require_jsx_dev_runtime(), 1);
var parseLRC = (lrcString) => {
  if (!lrcString)
    return [];
  const lines = lrcString.split(`
`);
  const parsed = [];
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
  lines.forEach((line) => {
    const match = line.match(timeRegex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const ms = parseInt(match[3], 10) / (match[3].length === 2 ? 100 : 1000);
      const timeInSec = minutes * 60 + seconds + ms;
      const text = line.replace(timeRegex, "").trim();
      if (text) {
        parsed.push({ time: timeInSec, text });
      }
    }
  });
  return parsed;
};
var LyricsPanel = ({ currentSong, currentTime, dominantColor, onClose }) => {
  const [lyrics, setLyrics] = import_react45.useState([]);
  const [loading, setLoading] = import_react45.useState(true);
  const [error, setError] = import_react45.useState(null);
  const [activeIndex, setActiveIndex] = import_react45.useState(0);
  const scrollRef = import_react45.useRef(null);
  const { playSong } = import_react45.default.useContext((init_PlayerContext(), __toCommonJS(exports_PlayerContext)).PlayerContext);
  const lineRefs = import_react45.useRef([]);
  import_react45.useEffect(() => {
    let active = true;
    const fetchLyrics = async () => {
      if (!currentSong?.song_id && !currentSong?.saavn_id)
        return;
      setLoading(true);
      setError(null);
      setLyrics([]);
      try {
        const id3 = currentSong.saavn_id ? `saavn_${currentSong.saavn_id}` : currentSong.song_id;
        const res = await api_default.get(`/api/songs/${id3}/lyrics`);
        if (active && res.data?.success) {
          if (res.data.syncedLyrics) {
            setLyrics(parseLRC(res.data.syncedLyrics));
          } else if (res.data.plainLyrics) {
            setLyrics([{ time: 0, text: res.data.plainLyrics, isStatic: true }]);
          } else if (res.data.instrumental) {
            setLyrics([{ time: 0, text: "• Instrumental •", isStatic: true }]);
          } else {
            setError("No lyrics available for this song.");
          }
        } else if (active) {
          setError("No lyrics available for this song.");
        }
      } catch (err_ignored) {
        if (active)
          setError("Failed to load lyrics.");
      } finally {
        if (active)
          setLoading(false);
      }
    };
    fetchLyrics();
    return () => {
      active = false;
    };
  }, [currentSong]);
  const handleLineClick = (lineTime) => {
    if (lineTime === undefined || loading)
      return;
  };
  import_react45.useEffect(() => {
    if (!lyrics.length || lyrics[0].isStatic)
      return;
    let newActiveIndex = -1;
    for (let i = 0;i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) {
        newActiveIndex = i;
      } else {
        break;
      }
    }
    if (newActiveIndex === -1 && currentTime < (lyrics[0]?.time || 0)) {
      newActiveIndex = 0;
    }
    if (newActiveIndex !== activeIndex && newActiveIndex !== -1) {
      setActiveIndex(newActiveIndex);
      if (scrollRef.current && lineRefs.current[newActiveIndex]) {
        const container = scrollRef.current;
        const activeLine = lineRefs.current[newActiveIndex];
        const containerHeight = container.offsetHeight;
        const lineTop = activeLine.offsetTop;
        const lineHeight = activeLine.offsetHeight;
        const targetScroll = lineTop - containerHeight / 2 + lineHeight / 2;
        container.scrollTo({
          top: targetScroll,
          behavior: "smooth"
        });
      }
    }
  }, [currentTime, lyrics, activeIndex]);
  return /* @__PURE__ */ jsx_dev_runtime13.jsxDEV(motion.div, {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
    transition: { type: "spring", damping: 30, stiffness: 150 },
    className: "fixed inset-0 z-50 flex flex-col overflow-hidden bg-brand-dark/95 backdrop-blur-3xl",
    style: {
      background: `linear-gradient(to bottom, ${dominantColor}50, #0a0a0a 90%)`
    },
    children: [
      /* @__PURE__ */ jsx_dev_runtime13.jsxDEV("div", {
        className: "flex items-center justify-between p-6 md:p-10 shrink-0 z-10 bg-gradient-to-b from-black/20 to-transparent",
        children: [
          /* @__PURE__ */ jsx_dev_runtime13.jsxDEV("div", {
            className: "flex items-center gap-3 md:gap-4 flex-1 min-w-0",
            children: [
              /* @__PURE__ */ jsx_dev_runtime13.jsxDEV("div", {
                className: "w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/5 shadow-2xl shrink-0",
                children: /* @__PURE__ */ jsx_dev_runtime13.jsxDEV(MicVocal, {
                  className: "w-5 h-5 md:w-6 md:h-6 text-brand-primary"
                }, undefined, false, undefined, this)
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime13.jsxDEV("div", {
                className: "min-w-0",
                children: [
                  /* @__PURE__ */ jsx_dev_runtime13.jsxDEV("h2", {
                    className: "text-lg md:text-2xl font-black text-white drop-shadow-md tracking-tight leading-tight truncate",
                    children: currentSong?.title || "Lyrics"
                  }, undefined, false, undefined, this),
                  /* @__PURE__ */ jsx_dev_runtime13.jsxDEV("p", {
                    className: "text-white/60 font-medium text-xs md:text-base truncate",
                    children: currentSong?.artist_name
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime13.jsxDEV("button", {
            onClick: onClose,
            className: "w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 flex items-center justify-center transition-all border border-white/10",
            children: /* @__PURE__ */ jsx_dev_runtime13.jsxDEV(X, {
              className: "w-5 h-5 text-white/70"
            }, undefined, false, undefined, this)
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime13.jsxDEV("div", {
        ref: scrollRef,
        className: "flex-1 overflow-y-auto w-full max-w-4xl mx-auto px-6 md:px-12 pb-[60vh] pt-[30vh] custom-scrollbar scroll-smooth relative",
        children: /* @__PURE__ */ jsx_dev_runtime13.jsxDEV(AnimatePresence, {
          mode: "wait",
          children: loading ? /* @__PURE__ */ jsx_dev_runtime13.jsxDEV(motion.div, {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            className: "absolute inset-0 flex flex-col items-center justify-center gap-6",
            children: [
              /* @__PURE__ */ jsx_dev_runtime13.jsxDEV("div", {
                className: "flex gap-2",
                children: [...Array(3)].map((_, i) => /* @__PURE__ */ jsx_dev_runtime13.jsxDEV(motion.div, {
                  className: "w-3 h-3 rounded-full bg-brand-primary",
                  animate: { y: [0, -10, 0] },
                  transition: { repeat: Infinity, duration: 0.8, delay: i * 0.2 }
                }, i, false, undefined, this))
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime13.jsxDEV("p", {
                className: "text-white/40 font-black tracking-widest uppercase text-xs",
                children: "Syncing Lyrics"
              }, undefined, false, undefined, this)
            ]
          }, "loading", true, undefined, this) : error ? /* @__PURE__ */ jsx_dev_runtime13.jsxDEV(motion.div, {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "absolute inset-0 flex flex-col items-center justify-center text-center px-4",
            children: [
              /* @__PURE__ */ jsx_dev_runtime13.jsxDEV(CircleAlert, {
                className: "w-14 h-14 text-white/20 mb-4"
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime13.jsxDEV("p", {
                className: "text-xl font-bold text-white/50",
                children: error
              }, undefined, false, undefined, this)
            ]
          }, "error", true, undefined, this) : lyrics.length > 0 && lyrics[0].isStatic ? /* @__PURE__ */ jsx_dev_runtime13.jsxDEV("div", {
            className: "whitespace-pre-line text-2xl md:text-3xl font-bold text-white/80 leading-relaxed text-center py-20",
            children: lyrics[0].text
          }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime13.jsxDEV("div", {
            className: "space-y-6 md:space-y-10 flex flex-col items-start",
            children: lyrics.map((line, i) => {
              const isActive = i === activeIndex;
              const isPassed = i < activeIndex;
              return /* @__PURE__ */ jsx_dev_runtime13.jsxDEV(motion.div, {
                ref: (el) => lineRefs.current[i] = el,
                initial: false,
                animate: {
                  scale: isActive ? 1.05 : 1,
                  opacity: isActive ? 1 : isPassed ? 0.3 : 0.5,
                  filter: isActive ? "blur(0px)" : isPassed ? "blur(1px)" : "blur(2px)",
                  x: isActive ? 10 : 0
                },
                transition: { type: "spring", duration: 0.6, bounce: 0.3 },
                className: `lyric-line cursor-pointer group will-change-transform w-full text-left`,
                children: /* @__PURE__ */ jsx_dev_runtime13.jsxDEV("p", {
                  className: `text-3xl md:text-6xl font-black leading-tight tracking-tight transition-colors duration-700 ${isActive ? "text-white" : "text-white/20"}`,
                  children: line.text
                }, undefined, false, undefined, this)
              }, i, false, undefined, this);
            })
          }, undefined, false, undefined, this)
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime13.jsxDEV("div", {
        className: "absolute inset-0 pointer-events-none overflow-hidden opacity-30",
        children: /* @__PURE__ */ jsx_dev_runtime13.jsxDEV(motion.div, {
          animate: {
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 90, 0]
          },
          transition: { duration: 15, repeat: Infinity, ease: "linear" },
          className: "absolute -top-1/4 -left-1/4 w-[100%] h-[100%] rounded-full",
          style: { background: `radial-gradient(circle, ${dominantColor} 0%, transparent 70%)`, filter: "blur(100px)" }
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime13.jsxDEV("style", {
        dangerouslySetInnerHTML: { __html: `
        .custom-scrollbar::-webkit-scrollbar {
            width: 0px;
            background: transparent;
        }
        .lyric-line {
            transition: color 0.7s ease;
        }
       ` }
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
};
var LyricsPanel_default = LyricsPanel;

// src/components/BottomPlayer.jsx
var jsx_dev_runtime14 = __toESM(require_jsx_dev_runtime(), 1);
var useDominantColor = (imageUrl) => {
  const [color2, setColor] = import_react47.useState("#121212");
  import_react47.useEffect(() => {
    if (!imageUrl)
      return;
    const img = new Image;
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        canvas.width = 64;
        canvas.height = 64;
        ctx.drawImage(img, 0, 0, 64, 64);
        const imageData = ctx.getImageData(0, 0, 64, 64).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0;i < imageData.length; i += 16) {
          r += imageData[i];
          g += imageData[i + 1];
          b += imageData[i + 2];
          count++;
        }
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
        r = Math.floor(r * 0.4);
        g = Math.floor(g * 0.4);
        b = Math.floor(b * 0.4);
        setColor(`rgb(${r}, ${g}, ${b})`);
      } catch (e) {
        setColor("#121212");
      }
    };
  }, [imageUrl]);
  return color2;
};
var formatTime = (seconds) => {
  if (!seconds || isNaN(seconds))
    return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
var BottomPlayer = () => {
  const {
    currentSong,
    isPlaying,
    duration,
    volume,
    audioRef,
    likedSongs,
    toggleLike,
    togglePlay,
    seek,
    setVolume,
    playNext,
    playPrevious,
    resolveUrl: resolveUrl2,
    shuffleMode,
    repeatMode,
    toggleShuffle,
    toggleRepeat,
    queue,
    sleepTimer,
    setSleepTimer,
    cancelSleepTimer,
    isFullScreenPlayer,
    setIsFullScreenPlayer,
    isSidebarCollapsed
  } = import_react47.useContext(PlayerContext);
  const [progress2, setProgress] = import_react47.useState(0);
  import_react47.useEffect(() => {
    const audio = audioRef.current;
    if (!audio)
      return;
    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration * 100);
      }
    };
    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audioRef]);
  const [showQueue, setShowQueue] = import_react47.useState(false);
  const [showLyrics, setShowLyrics] = import_react47.useState(false);
  const [showSleepMenu, setShowSleepMenu] = import_react47.useState(false);
  const [isIdle, setIsIdle] = import_react47.useState(false);
  const location = useLocation();
  const idleTimerRef = import_react47.useRef(null);
  const touchStartY = import_react47.useRef(0);
  const touchEndY = import_react47.useRef(0);
  const touchStartX = import_react47.useRef(0);
  const touchEndX = import_react47.useRef(0);
  const compactTouchStartX = import_react47.useRef(0);
  const compactTouchStartY = import_react47.useRef(0);
  const resetIdleTimer = () => {
    setIsIdle(false);
    if (idleTimerRef.current)
      clearTimeout(idleTimerRef.current);
    if (isFullScreenPlayer && window.innerWidth >= 768) {
      idleTimerRef.current = setTimeout(() => {
        setIsIdle(true);
      }, 3000);
    }
  };
  import_react47.useEffect(() => {
    if (isFullScreenPlayer) {
      resetIdleTimer();
      window.addEventListener("mousemove", resetIdleTimer);
      window.addEventListener("keydown", resetIdleTimer);
    } else {
      setIsIdle(false);
      if (idleTimerRef.current)
        clearTimeout(idleTimerRef.current);
    }
    return () => {
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("keydown", resetIdleTimer);
      if (idleTimerRef.current)
        clearTimeout(idleTimerRef.current);
    };
  }, [isFullScreenPlayer]);
  const dominantColor = useDominantColor(currentSong?.cover_image_url ? resolveUrl2(currentSong.cover_image_url) : null);
  const currentTime = progress2 / 100 * (duration || currentSong?.duration || 0);
  import_react47.useEffect(() => {
    if (isFullScreenPlayer) {
      setIsFullScreenPlayer(false);
    }
  }, [location.pathname]);
  const formatTimerDisplay = (seconds) => {
    if (!seconds)
      return "";
    const m2 = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m2}:${s.toString().padStart(2, "0")}`;
  };
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e) => {
    touchEndY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const deltaY = touchStartY.current - touchEndY.current;
    const deltaX = touchStartX.current - touchEndX.current;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    if (absDeltaX > absDeltaY && absDeltaX > 60) {
      if (deltaX > 0) {
        playNext();
      } else {
        playPrevious();
      }
    } else if (deltaY < -50 && touchEndY.current !== 0) {
      setIsFullScreenPlayer(false);
    }
    touchStartY.current = 0;
    touchEndY.current = 0;
    touchStartX.current = 0;
    touchEndX.current = 0;
  };
  const handleCompactTouchStart = (e) => {
    compactTouchStartX.current = e.touches[0].clientX;
    compactTouchStartY.current = e.touches[0].clientY;
  };
  const handleCompactTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = compactTouchStartX.current - endX;
    const deltaY = Math.abs(compactTouchStartY.current - endY);
    const absDeltaX = Math.abs(deltaX);
    if (absDeltaX > deltaY && absDeltaX > 60) {
      e.preventDefault();
      if (deltaX > 0) {
        playNext();
      } else {
        playPrevious();
      }
    }
  };
  if (!currentSong)
    return null;
  const sidebarOffset = isFullScreenPlayer ? "left-0" : isSidebarCollapsed ? "left-0 md:left-20" : "left-0 md:left-64";
  return /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(jsx_dev_runtime14.Fragment, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(AnimatePresence, {
        children: showLyrics && /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(LyricsPanel_default, {
          currentSong,
          currentTime,
          dominantColor,
          onClose: () => setShowLyrics(false)
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(QueuePanel_default, {
        isOpen: showQueue,
        onClose: () => setShowQueue(false)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(AnimatePresence, {
        children: isFullScreenPlayer && /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(motion.div, {
          initial: { opacity: 0, y: "100%" },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: "100%" },
          transition: { type: "spring", damping: 25, stiffness: 200 },
          className: "fixed top-0 left-0 w-full h-full pb-safe z-[45] flex flex-col md:items-center md:justify-center overflow-y-auto md:overflow-hidden cursor-default md:cursor-none",
          style: {
            background: `linear-gradient(to bottom, ${dominantColor} 0%, #121212 100%)`,
            cursor: isIdle && window.innerWidth >= 768 ? "none" : "default"
          },
          onTouchStart: handleTouchStart,
          onTouchMove: handleTouchMove,
          onTouchEnd: handleTouchEnd,
          children: [
            /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
              className: "absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent z-0 opacity-100"
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
              className: "hidden md:flex flex-col w-full h-full items-center justify-center relative z-10 p-12",
              children: [
                /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(AnimatePresence, {
                  children: !isIdle && /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(motion.div, {
                    initial: { opacity: 0, y: -20 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -20 },
                    className: "absolute top-12 right-12 flex gap-4 z-50",
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("button", {
                        onClick: () => {
                          if (!document.fullscreenElement) {
                            document.documentElement.requestFullscreen().catch((err) => console.error("Fullscreen error:", err));
                          } else if (document.exitFullscreen) {
                            document.exitFullscreen();
                          }
                        },
                        className: "p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-brand-muted hover:text-white transition-all shadow-lg backdrop-blur-xl border border-white/[0.05]",
                        title: "Toggle True Fullscreen",
                        children: /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(Maximize2, {
                          className: "w-6 h-6"
                        }, undefined, false, undefined, this)
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("button", {
                        onClick: () => setIsFullScreenPlayer(false),
                        className: "p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-brand-muted hover:text-white transition-all shadow-lg backdrop-blur-xl border border-white/[0.05]",
                        title: "Minimize",
                        children: /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(ChevronDown, {
                          className: "w-6 h-6"
                        }, undefined, false, undefined, this)
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this)
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
                  className: "flex-1 flex flex-col items-center justify-center w-full max-w-7xl pt-12 md:pb-12",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(motion.div, {
                      layout: true,
                      className: "w-full max-w-[400px] lg:max-w-[460px] aspect-square relative transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]",
                      children: /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(TiltedCard, {
                        imageSrc: resolveUrl2(currentSong.cover_image_url) || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070",
                        altText: currentSong.title,
                        containerHeight: "100%",
                        containerWidth: "100%",
                        imageHeight: "100%",
                        imageWidth: "100%",
                        scaleOnHover: 1.03,
                        rotateAmplitude: 5,
                        showMobileWarning: false,
                        showTooltip: false,
                        displayOverlayContent: false
                      }, undefined, false, undefined, this)
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(AnimatePresence, {
                      mode: "wait",
                      children: isIdle && /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(motion.div, {
                        initial: { opacity: 0, y: 10, filter: "blur(10px)" },
                        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
                        exit: { opacity: 0, y: -10, filter: "blur(10px)" },
                        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                        className: "mt-16 text-center pointer-events-none",
                        children: [
                          /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("h1", {
                            className: "text-3xl lg:text-4xl font-extrabold text-white/90 tracking-tight mb-2 flex items-center justify-center gap-2",
                            children: [
                              currentSong.title,
                              currentSong.explicit_content && /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("span", {
                                className: "shrink-0 px-1.5 py-0.5 rounded-[3px] bg-white/10 text-[10px] font-bold text-white/40 leading-none border border-white/5 uppercase",
                                children: "E"
                              }, undefined, false, undefined, this)
                            ]
                          }, undefined, true, undefined, this),
                          /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("p", {
                            className: "text-xl lg:text-2xl font-medium text-white/40 tracking-normal",
                            children: currentSong.artist_name
                          }, undefined, false, undefined, this)
                        ]
                      }, "idle-info", true, undefined, this)
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              ]
            }, undefined, true, undefined, this),
            /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
              className: "md:hidden flex flex-col w-full h-full relative z-10 px-6 pt-safe pb-8",
              children: [
                /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
                  className: "flex items-center justify-between shrink-0 mb-8 mt-4",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("button", {
                      onClick: () => setIsFullScreenPlayer(false),
                      className: "p-2 text-white",
                      title: "Minimize",
                      children: /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(ChevronDown, {
                        className: "w-8 h-8"
                      }, undefined, false, undefined, this)
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
                      className: "text-xs font-bold uppercase tracking-widest text-white/80",
                      children: "Now Playing"
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
                      className: "w-8"
                    }, undefined, false, undefined, this),
                    " "
                  ]
                }, undefined, true, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
                  className: "w-full aspect-square bg-brand-surface rounded-xl shadow-2xl overflow-hidden mb-8 shrink-0 flex items-center justify-center",
                  children: currentSong.cover_image_url ? /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("img", {
                    src: resolveUrl2(currentSong.cover_image_url),
                    alt: "Cover Art",
                    className: "w-full h-full object-cover"
                  }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(Music, {
                    className: "w-24 h-24 text-brand-muted"
                  }, undefined, false, undefined, this)
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
                  className: "flex items-center justify-between mb-8 shrink-0",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
                      className: "flex-1 min-w-0 pr-4",
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("h1", {
                          className: "text-2xl font-bold text-white truncate mb-1 flex items-center gap-2",
                          children: [
                            currentSong.title,
                            currentSong.explicit_content && /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("span", {
                              className: "shrink-0 px-1 py-0.5 rounded-[2px] bg-white/10 text-[10px] font-bold text-white/40 leading-none border border-white/5 uppercase",
                              children: "E"
                            }, undefined, false, undefined, this)
                          ]
                        }, undefined, true, undefined, this),
                        /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("p", {
                          className: "text-brand-muted font-medium text-lg truncate",
                          children: currentSong.artist_name
                        }, undefined, false, undefined, this)
                      ]
                    }, undefined, true, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("button", {
                      onClick: () => toggleLike(currentSong.song_id),
                      title: likedSongs.has(currentSong.song_id) ? "Unlike" : "Like",
                      className: `p-2 transition-colors ${likedSongs.has(currentSong.song_id) ? "text-brand-primary" : "text-brand-muted"}`,
                      children: /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(Heart, {
                        className: `w-7 h-7 ${likedSongs.has(currentSong.song_id) ? "fill-current" : ""}`
                      }, undefined, false, undefined, this)
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
                  className: "mb-6 shrink-0 text-brand-muted text-[11px] font-medium tracking-wide",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(ElasticSlider, {
                      defaultValue: progress2,
                      maxValue: 100,
                      onChange: (val) => seek(val),
                      className: "w-full !p-0 mb-2",
                      leftIcon: null,
                      rightIcon: null
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
                      className: "flex justify-between w-full mt-2",
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("span", {
                          children: formatTime(progress2 / 100 * duration)
                        }, undefined, false, undefined, this),
                        /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("span", {
                          children: formatTime(duration || currentSong.duration)
                        }, undefined, false, undefined, this)
                      ]
                    }, undefined, true, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
                  className: "flex items-center justify-between mb-6 shrink-0",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("button", {
                      onClick: toggleShuffle,
                      className: `p-3 ${shuffleMode ? "text-brand-primary" : "text-brand-muted"}`,
                      title: "Shuffle",
                      children: /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(Shuffle, {
                        className: "w-6 h-6"
                      }, undefined, false, undefined, this)
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("button", {
                      onClick: playPrevious,
                      className: "p-3 text-white",
                      title: "Previous",
                      children: /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(SkipBack, {
                        className: "w-10 h-10 fill-current"
                      }, undefined, false, undefined, this)
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("button", {
                      onClick: togglePlay,
                      title: isPlaying ? "Pause" : "Play",
                      className: "w-20 h-20 rounded-full bg-brand-primary text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform",
                      children: isPlaying ? /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(Pause, {
                        className: "w-8 h-8 fill-current"
                      }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(Play, {
                        className: "w-8 h-8 fill-current ml-1.5"
                      }, undefined, false, undefined, this)
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("button", {
                      onClick: playNext,
                      className: "p-3 text-white",
                      title: "Next",
                      children: /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(SkipForward, {
                        className: "w-10 h-10 fill-current"
                      }, undefined, false, undefined, this)
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("button", {
                      onClick: toggleRepeat,
                      className: `p-3 ${repeatMode !== "off" ? "text-brand-primary" : "text-brand-muted"}`,
                      title: "Repeat",
                      children: repeatMode === "one" ? /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(Repeat1, {
                        className: "w-6 h-6"
                      }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(Repeat, {
                        className: "w-6 h-6"
                      }, undefined, false, undefined, this)
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
                  className: "flex items-center justify-between mt-auto",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("button", {
                      onClick: () => setShowLyrics(!showLyrics),
                      title: "Lyrics",
                      className: `p-2 transition-colors ${showLyrics ? "text-brand-primary" : "text-brand-muted hover:text-white"}`,
                      children: /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(MicVocal, {
                        className: "w-6 h-6"
                      }, undefined, false, undefined, this)
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("button", {
                      onClick: () => setShowQueue(!showQueue),
                      title: "Queue",
                      className: `p-2 transition-colors ${showQueue ? "text-brand-primary" : "text-brand-muted hover:text-white"}`,
                      children: /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(ListMusic, {
                        className: "w-6 h-6"
                      }, undefined, false, undefined, this)
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              ]
            }, undefined, true, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(AnimatePresence, {
        children: (!isFullScreenPlayer || window.innerWidth >= 768) && /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(motion.div, {
          initial: { y: 200 },
          animate: { y: 0 },
          exit: { y: 200 },
          transition: { duration: 0.4, ease: "easeOut" },
          className: `fixed bottom-[4rem] md:bottom-0 ${sidebarOffset} right-0 h-[4.5rem] md:h-24 bg-brand-surface md:bg-brand-surface/90 md:backdrop-blur-xl border-t border-white/[0.02] ${isFullScreenPlayer ? "z-[50]" : "z-[40]"} flex items-center px-4 md:px-8 mx-2 md:mx-0 rounded-xl md:rounded-none mb-1 md:mb-0 transition-all duration-300 shadow-xl md:shadow-none`,
          onTouchStart: handleCompactTouchStart,
          onTouchEnd: handleCompactTouchEnd,
          style: {
            display: isFullScreenPlayer && window.innerWidth < 768 ? "none" : "flex",
            opacity: isFullScreenPlayer && isIdle && window.innerWidth >= 768 ? 0 : 1,
            pointerEvents: isFullScreenPlayer && isIdle && window.innerWidth >= 768 ? "none" : "auto"
          },
          onClick: (e) => {
            if (window.innerWidth < 768 && !e.target.closest("button")) {
              setIsFullScreenPlayer(true);
            }
          },
          children: [
            /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
              className: "flex items-center gap-3 flex-1 md:w-1/3 overflow-hidden cursor-pointer md:cursor-default min-w-0",
              children: [
                /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
                  className: "w-10 h-10 md:w-14 md:h-14 bg-brand-dark rounded-md shadow-sm overflow-hidden flex items-center justify-center shrink-0",
                  children: currentSong.cover_image_url ? /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("img", {
                    src: resolveUrl2(currentSong.cover_image_url),
                    className: "w-full h-full object-cover"
                  }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(Music, {
                    className: "w-6 h-6 text-brand-muted"
                  }, undefined, false, undefined, this)
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
                  className: "overflow-hidden min-w-0 flex-1",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
                      className: "flex items-center gap-1.5 min-w-0",
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
                          className: "text-sm font-semibold text-white truncate",
                          children: currentSong.title
                        }, undefined, false, undefined, this),
                        currentSong.explicit_content && /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("span", {
                          className: "shrink-0 px-1 py-0.5 rounded-[2px] bg-white/10 text-[8px] font-bold text-white/40 leading-none border border-white/5 uppercase",
                          children: "E"
                        }, undefined, false, undefined, this)
                      ]
                    }, undefined, true, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
                      className: "flex items-center gap-1 text-[10px] md:text-xs text-brand-muted truncate mt-0.5",
                      children: currentSong.artists && currentSong.artists.length > 0 ? currentSong.artists.map((artist, idx) => /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(import_react47.default.Fragment, {
                        children: [
                          /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("span", {
                            className: "hover:text-white transition-colors",
                            children: artist.name
                          }, undefined, false, undefined, this),
                          idx < currentSong.artists.length - 1 && /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("span", {
                            className: "text-white/20",
                            children: ","
                          }, undefined, false, undefined, this)
                        ]
                      }, artist.id, true, undefined, this)) : /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("span", {
                        className: "hover:text-white transition-colors",
                        children: currentSong.artist_name
                      }, undefined, false, undefined, this)
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("button", {
                  onClick: (e) => {
                    e.stopPropagation();
                    toggleLike(currentSong.song_id);
                  },
                  title: likedSongs.has(currentSong.song_id) ? "Unlike" : "Like",
                  className: `shrink-0 p-1.5 md:p-2 rounded-full transition-colors ${likedSongs.has(currentSong.song_id) ? "text-brand-primary" : "text-white/60 hover:text-white"}`,
                  children: /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(Heart, {
                    className: `w-5 h-5 md:w-5 md:h-5 ${likedSongs.has(currentSong.song_id) ? "fill-current" : ""}`
                  }, undefined, false, undefined, this)
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this),
            /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
              className: "flex-none md:flex-1 flex items-center justify-end md:justify-center md:flex-col gap-2 ml-1 md:ml-0 shrink-0 md:pl-0",
              children: [
                /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
                  className: "flex items-center gap-3 md:gap-4",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("button", {
                      onClick: toggleShuffle,
                      className: `hidden md:block transition-colors ${shuffleMode ? "text-brand-primary" : "text-brand-muted hover:text-white"}`,
                      title: "Shuffle",
                      children: /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(Shuffle, {
                        className: "w-4 h-4"
                      }, undefined, false, undefined, this)
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("button", {
                      onClick: (e) => {
                        e.stopPropagation();
                        playPrevious();
                      },
                      className: "hidden md:block text-brand-muted hover:text-white transition-colors",
                      title: "Previous",
                      children: /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(SkipBack, {
                        className: "w-5 h-5 fill-current"
                      }, undefined, false, undefined, this)
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("button", {
                      onClick: (e) => {
                        e.stopPropagation();
                        togglePlay();
                      },
                      title: isPlaying ? "Pause" : "Play",
                      className: "w-10 h-10 md:w-10 md:h-10 rounded-full bg-brand-primary text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform",
                      children: isPlaying ? /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(Pause, {
                        className: "w-4 h-4 md:w-5 md:h-5 fill-current"
                      }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(Play, {
                        className: "w-4 h-4 md:w-5 md:h-5 fill-current ml-1"
                      }, undefined, false, undefined, this)
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("button", {
                      onClick: (e) => {
                        e.stopPropagation();
                        playNext();
                      },
                      className: "hidden md:block text-brand-muted hover:text-white transition-colors",
                      title: "Next",
                      children: /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(SkipForward, {
                        className: "w-5 h-5 fill-current"
                      }, undefined, false, undefined, this)
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("button", {
                      onClick: toggleRepeat,
                      className: `hidden md:block transition-colors ${repeatMode !== "off" ? "text-brand-primary" : "text-brand-muted hover:text-white"}`,
                      title: "Repeat",
                      children: repeatMode === "one" ? /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(Repeat1, {
                        className: "w-4 h-4"
                      }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(Repeat, {
                        className: "w-4 h-4"
                      }, undefined, false, undefined, this)
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
                  className: "hidden md:flex w-full max-w-md items-center gap-3 text-xs text-brand-muted font-medium",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("span", {
                      children: formatTime(progress2 / 100 * duration)
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
                      className: "flex-1 flex items-center px-2 group",
                      children: /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(ElasticSlider, {
                        defaultValue: progress2,
                        maxValue: 100,
                        onChange: (val) => seek(val),
                        className: "w-full !p-0",
                        leftIcon: null,
                        rightIcon: null
                      }, undefined, false, undefined, this)
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("span", {
                      children: formatTime(duration || currentSong.duration)
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              ]
            }, undefined, true, undefined, this),
            /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
              className: "hidden md:flex w-1/3 justify-end items-center gap-2",
              children: [
                /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("button", {
                  onClick: () => setVolume(volume > 0 ? 0 : 0.7),
                  className: "text-brand-muted hover:text-white transition-colors",
                  title: "Mute/Unmute",
                  children: volume === 0 ? /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(VolumeX, {
                    className: "w-4 h-4"
                  }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(Volume2, {
                    className: "w-4 h-4"
                  }, undefined, false, undefined, this)
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
                  className: "w-24 flex items-center pr-2 group",
                  children: /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(ElasticSlider, {
                    defaultValue: Math.round(volume * 100),
                    maxValue: 100,
                    onChange: (val) => setVolume(val / 100),
                    className: "w-full !p-0",
                    leftIcon: null,
                    rightIcon: null
                  }, undefined, false, undefined, this)
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("button", {
                  onClick: (e) => {
                    e.stopPropagation();
                    setShowQueue(!showQueue);
                  },
                  title: "Queue",
                  className: `relative p-2 rounded-full transition-colors ${showQueue ? "text-brand-primary bg-white/[0.06]" : "text-brand-muted hover:text-white"}`,
                  children: /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(ListMusic, {
                    className: "w-4 h-4"
                  }, undefined, false, undefined, this)
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("button", {
                  onClick: (e) => {
                    e.stopPropagation();
                    setShowLyrics(!showLyrics);
                  },
                  title: "Lyrics",
                  className: `relative p-2 rounded-full transition-colors ${showLyrics ? "text-brand-primary bg-white/[0.06]" : "text-brand-muted hover:text-white"}`,
                  children: /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(MicVocal, {
                    className: "w-4 h-4"
                  }, undefined, false, undefined, this)
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
                  className: "relative",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("button", {
                      onClick: () => setShowSleepMenu(!showSleepMenu),
                      title: "Sleep Timer",
                      className: `p-2 rounded-full transition-colors relative ${sleepTimer ? "text-sky-400" : "text-brand-muted hover:text-white"}`,
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(Moon, {
                          className: "w-4 h-4"
                        }, undefined, false, undefined, this),
                        sleepTimer && /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("span", {
                          className: "absolute -top-1.5 -right-2 text-[9px] font-black text-sky-400",
                          children: formatTimerDisplay(sleepTimer)
                        }, undefined, false, undefined, this)
                      ]
                    }, undefined, true, undefined, this),
                    showSleepMenu && /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
                      className: "absolute bottom-full right-0 mb-3 w-44 bg-brand-surface border border-white/[0.06] rounded-xl shadow-2xl p-2 z-[60]",
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
                          className: "text-[10px] font-bold text-brand-muted uppercase tracking-widest px-3 py-2",
                          children: "Sleep Timer"
                        }, undefined, false, undefined, this),
                        [5, 15, 30, 45, 60, 90].map((mins) => /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("button", {
                          onClick: () => {
                            setSleepTimer(mins);
                            setShowSleepMenu(false);
                          },
                          className: "w-full text-left px-3 py-2 text-sm font-medium text-white hover:bg-white/[0.08] rounded-lg transition-colors",
                          children: [
                            mins,
                            " minutes"
                          ]
                        }, mins, true, undefined, this)),
                        sleepTimer && /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("button", {
                          onClick: () => {
                            cancelSleepTimer();
                            setShowSleepMenu(false);
                          },
                          className: "w-full text-left px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-400/10 rounded-lg transition-colors border-t border-white/[0.04] mt-1",
                          children: "Cancel timer"
                        }, undefined, false, undefined, this)
                      ]
                    }, undefined, true, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("button", {
                  onClick: () => setIsFullScreenPlayer(!isFullScreenPlayer),
                  title: isFullScreenPlayer ? "Minimize" : "Fullscreen",
                  className: "text-brand-muted hover:text-white transition-colors ml-1 p-2",
                  children: isFullScreenPlayer ? /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(ChevronDown, {
                    className: "w-5 h-5"
                  }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime14.jsxDEV(Maximize2, {
                    className: "w-5 h-5"
                  }, undefined, false, undefined, this)
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this),
            /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
              className: "absolute bottom-0 left-0 h-[2.5px] bg-white/10 md:hidden w-full rounded-b-xl overflow-hidden shadow-inner",
              children: /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("div", {
                className: "h-full bg-brand-primary shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-300 ease-linear",
                style: { width: `${progress2 / 100 * 100}%` }
              }, undefined, false, undefined, this)
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
};
var BottomPlayer_default = BottomPlayer;

// src/components/SongCard.jsx
var import_react51 = __toESM(require_react(), 1);
init_lucide_react();
init_PlayerContext();
init_ToastContext();

// src/components/SongContextMenu.jsx
var import_react49 = __toESM(require_react(), 1);
init_react();
init_lucide_react();
init_PlayerContext();
init_ToastContext();
var jsx_dev_runtime15 = __toESM(require_jsx_dev_runtime(), 1);
var SongContextMenu = ({ isOpen, onClose, song, position }) => {
  const { addToQueue, toggleLike, likedSongs, playlists, addSongToPlaylist } = import_react49.useContext(PlayerContext);
  const toast = useToast();
  const [showPlaylists, setShowPlaylists] = import_react49.useState(false);
  if (!isOpen || !song)
    return null;
  const isLiked = likedSongs.has(song.song_id);
  const actions = [
    {
      icon: ListPlus,
      label: "Add to Queue",
      onClick: () => {
        addToQueue(song);
        toast.success("Added to queue");
        onClose();
      }
    },
    {
      icon: Heart,
      label: isLiked ? "Remove from Liked" : "Like Song",
      onClick: () => {
        toggleLike(song.song_id || song.saavn_id);
        toast.success(isLiked ? "Removed from liked songs" : "Added to liked songs");
        onClose();
      },
      className: isLiked ? "text-red-400" : ""
    },
    {
      icon: ListPlus,
      label: "Add to Playlist",
      onClick: () => setShowPlaylists(true)
    },
    {
      icon: Share2,
      label: "Share Song",
      onClick: async () => {
        try {
          if (navigator.share) {
            await navigator.share({ title: song.title, text: `Listen to ${song.title} by ${song.artist_name} on Wave`, url: window.location.href });
          } else {
            await navigator.clipboard.writeText(`\uD83C\uDFB5 ${song.title} - ${song.artist_name}`);
            toast.success("Copied to clipboard");
          }
        } catch {}
        onClose();
      }
    }
  ];
  return /* @__PURE__ */ jsx_dev_runtime15.jsxDEV(jsx_dev_runtime15.Fragment, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime15.jsxDEV("div", {
        className: "fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm",
        onClick: onClose
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime15.jsxDEV(motion.div, {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 50 },
        transition: { type: "spring", damping: 28, stiffness: 350 },
        className: "fixed bottom-0 left-0 right-0 z-[160] bg-brand-surface border-t border-white/10 rounded-t-3xl px-4 pt-4 pb-safe shadow-2xl",
        children: [
          /* @__PURE__ */ jsx_dev_runtime15.jsxDEV("div", {
            className: "flex items-center gap-3 mb-4 px-2",
            children: [
              /* @__PURE__ */ jsx_dev_runtime15.jsxDEV("div", {
                className: "w-12 h-12 rounded-lg overflow-hidden bg-brand-dark shrink-0",
                children: song.cover_image_url ? /* @__PURE__ */ jsx_dev_runtime15.jsxDEV("img", {
                  src: song.cover_image_url,
                  alt: "",
                  className: "w-full h-full object-cover"
                }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime15.jsxDEV("div", {
                  className: "w-full h-full flex items-center justify-center text-brand-muted",
                  children: /* @__PURE__ */ jsx_dev_runtime15.jsxDEV(Radio, {
                    className: "w-5 h-5"
                  }, undefined, false, undefined, this)
                }, undefined, false, undefined, this)
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime15.jsxDEV("div", {
                className: "flex-1 min-w-0",
                children: [
                  /* @__PURE__ */ jsx_dev_runtime15.jsxDEV("div", {
                    className: "font-bold text-sm truncate text-brand-primary",
                    children: song.title
                  }, undefined, false, undefined, this),
                  /* @__PURE__ */ jsx_dev_runtime15.jsxDEV("div", {
                    className: "text-xs text-brand-muted truncate",
                    children: song.artist_name
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime15.jsxDEV("button", {
                onClick: onClose,
                className: "w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-brand-muted",
                children: /* @__PURE__ */ jsx_dev_runtime15.jsxDEV(X, {
                  className: "w-5 h-5"
                }, undefined, false, undefined, this)
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          !showPlaylists ? /* @__PURE__ */ jsx_dev_runtime15.jsxDEV("div", {
            className: "space-y-1 mb-4",
            children: actions.map((action, i) => /* @__PURE__ */ jsx_dev_runtime15.jsxDEV("button", {
              onClick: action.onClick,
              className: `w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/[0.04] transition-colors ${action.className || "text-brand-primary"}`,
              children: [
                /* @__PURE__ */ jsx_dev_runtime15.jsxDEV(action.icon, {
                  className: "w-5 h-5 text-brand-muted"
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime15.jsxDEV("span", {
                  className: "text-sm font-semibold",
                  children: action.label
                }, undefined, false, undefined, this)
              ]
            }, i, true, undefined, this))
          }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime15.jsxDEV("div", {
            className: "space-y-1 mb-4",
            children: [
              /* @__PURE__ */ jsx_dev_runtime15.jsxDEV("button", {
                onClick: () => setShowPlaylists(false),
                className: "text-xs font-bold text-brand-muted uppercase tracking-widest mb-2 px-4 flex items-center gap-1 hover:text-brand-primary",
                children: "← Back"
              }, undefined, false, undefined, this),
              playlists?.length > 0 ? playlists.map((pl) => /* @__PURE__ */ jsx_dev_runtime15.jsxDEV("button", {
                onClick: () => {
                  addSongToPlaylist(pl.playlist_id, song.song_id || song.saavn_id);
                  toast.success(`Added to "${pl.title}"`);
                  onClose();
                },
                className: "w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.04] transition-colors text-brand-primary text-sm font-semibold",
                children: [
                  /* @__PURE__ */ jsx_dev_runtime15.jsxDEV(ListPlus, {
                    className: "w-4 h-4 text-brand-muted"
                  }, undefined, false, undefined, this),
                  pl.title
                ]
              }, pl.playlist_id, true, undefined, this)) : /* @__PURE__ */ jsx_dev_runtime15.jsxDEV("p", {
                className: "text-center text-brand-muted text-sm py-4",
                children: "No playlists yet"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this)
    ]
  }, undefined, true, undefined, this);
};
var useLongPress = (onLongPress, delay2 = 500) => {
  const timerRef = import_react49.useRef(null);
  const isLongPressRef = import_react49.useRef(false);
  const start = import_react49.useCallback((e) => {
    isLongPressRef.current = false;
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onLongPress(e);
    }, delay2);
  }, [onLongPress, delay2]);
  const stop = import_react49.useCallback(() => {
    if (timerRef.current)
      clearTimeout(timerRef.current);
  }, []);
  return {
    onTouchStart: start,
    onTouchEnd: stop,
    onTouchMove: stop,
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop
  };
};
var SongContextMenu_default = SongContextMenu;

// src/components/SongCard.jsx
var jsx_dev_runtime16 = __toESM(require_jsx_dev_runtime(), 1);
var SongCard = ({ song }) => {
  const {
    currentSong,
    isPlaying,
    likedSongs,
    toggleLike,
    playlists,
    addSongToPlaylist,
    addToQueue,
    playSong,
    resolveUrl: resolveUrl2
  } = import_react51.useContext(PlayerContext);
  const isActive = currentSong?.song_id === song.song_id;
  const isLiked = likedSongs.has(song.song_id);
  const [showPlaylistMenu, setShowPlaylistMenu] = import_react51.useState(false);
  const [contextMenu, setContextMenu] = import_react51.useState(false);
  const toast = useToast();
  const handleLongPress = import_react51.useCallback(() => {
    setContextMenu(true);
  }, []);
  const longPressHandlers = useLongPress(handleLongPress, 500);
  const handleLike = (e) => {
    e.stopPropagation();
    toggleLike(song.song_id);
    toast.success(isLiked ? "Removed from liked songs" : "Added to liked songs");
  };
  const handleAddToQueue = (e) => {
    e.stopPropagation();
    addToQueue(song);
    toast.success("Added to queue");
    setShowPlaylistMenu(false);
  };
  return /* @__PURE__ */ jsx_dev_runtime16.jsxDEV(jsx_dev_runtime16.Fragment, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime16.jsxDEV("div", {
        className: `group flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer ${isActive ? "bg-brand-primary/[0.06] border border-brand-primary/10" : "hover:bg-white/[0.02] border border-transparent"}`,
        onClick: () => playSong(song),
        ...longPressHandlers,
        children: [
          /* @__PURE__ */ jsx_dev_runtime16.jsxDEV("div", {
            className: "flex items-center gap-4 min-w-0 flex-1",
            children: [
              /* @__PURE__ */ jsx_dev_runtime16.jsxDEV("div", {
                className: "w-12 h-12 bg-brand-dark rounded-lg overflow-hidden shadow-sm shrink-0 relative",
                children: [
                  song.cover_image_url ? /* @__PURE__ */ jsx_dev_runtime16.jsxDEV("img", {
                    src: resolveUrl2(song.cover_image_url),
                    alt: "cover",
                    className: "w-full h-full object-cover"
                  }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime16.jsxDEV(Music, {
                    className: "w-5 h-5 m-auto mt-3.5 text-brand-muted"
                  }, undefined, false, undefined, this),
                  isActive && isPlaying && /* @__PURE__ */ jsx_dev_runtime16.jsxDEV("div", {
                    className: "absolute inset-0 bg-black/40 flex items-center justify-center",
                    children: /* @__PURE__ */ jsx_dev_runtime16.jsxDEV("div", {
                      className: "flex gap-[2px] items-end h-3",
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime16.jsxDEV("div", {
                          className: "w-[3px] bg-brand-primary rounded-full animate-pulse",
                          style: { height: "60%", animationDelay: "0ms" }
                        }, undefined, false, undefined, this),
                        /* @__PURE__ */ jsx_dev_runtime16.jsxDEV("div", {
                          className: "w-[3px] bg-brand-primary rounded-full animate-pulse",
                          style: { height: "100%", animationDelay: "200ms" }
                        }, undefined, false, undefined, this),
                        /* @__PURE__ */ jsx_dev_runtime16.jsxDEV("div", {
                          className: "w-[3px] bg-brand-primary rounded-full animate-pulse",
                          style: { height: "40%", animationDelay: "400ms" }
                        }, undefined, false, undefined, this)
                      ]
                    }, undefined, true, undefined, this)
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime16.jsxDEV("div", {
                className: "flex flex-col min-w-0",
                children: [
                  /* @__PURE__ */ jsx_dev_runtime16.jsxDEV("div", {
                    className: "flex items-center gap-1.5 min-w-0",
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime16.jsxDEV("span", {
                        className: `text-sm font-semibold truncate ${isActive ? "text-brand-primary" : "text-brand-primary/90"}`,
                        children: song.title
                      }, undefined, false, undefined, this),
                      song.explicit_content && /* @__PURE__ */ jsx_dev_runtime16.jsxDEV("span", {
                        className: "shrink-0 px-1 py-0.5 rounded-[2px] bg-white/10 text-[8px] font-bold text-brand-muted/80 leading-none",
                        children: "E"
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this),
                  /* @__PURE__ */ jsx_dev_runtime16.jsxDEV(Link, {
                    to: `/dashboard/artist/${song.artist_id}`,
                    onClick: (e) => e.stopPropagation(),
                    className: "text-xs text-brand-muted truncate hover:text-brand-primary transition-colors",
                    children: song.artist_name
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime16.jsxDEV("div", {
            className: "flex items-center gap-1 shrink-0 ml-4",
            children: [
              /* @__PURE__ */ jsx_dev_runtime16.jsxDEV("span", {
                className: "text-xs text-brand-muted/60 font-medium mr-3 hidden sm:inline",
                children: [
                  song.play_count || 0,
                  " plays"
                ]
              }, undefined, true, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime16.jsxDEV("button", {
                onClick: handleLike,
                className: `w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${isLiked ? "text-brand-primary" : "text-brand-muted opacity-0 group-hover:opacity-100"}`,
                children: /* @__PURE__ */ jsx_dev_runtime16.jsxDEV(Heart, {
                  className: `w-4 h-4 ${isLiked ? "fill-current" : ""}`
                }, undefined, false, undefined, this)
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime16.jsxDEV("button", {
                onClick: handleAddToQueue,
                title: "Add to Queue",
                className: "w-10 h-10 flex items-center justify-center rounded-full text-brand-muted hover:text-brand-primary opacity-0 group-hover:opacity-100 transition-all duration-200",
                children: /* @__PURE__ */ jsx_dev_runtime16.jsxDEV(Plus, {
                  className: "w-4 h-4"
                }, undefined, false, undefined, this)
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime16.jsxDEV("div", {
                className: `transition-all duration-300 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`,
                onClick: () => playSong(song),
                children: /* @__PURE__ */ jsx_dev_runtime16.jsxDEV("div", {
                  className: `w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? "bg-brand-primary text-brand-dark" : "bg-brand-surface text-brand-primary border border-white/[0.05]"}`,
                  children: isActive && isPlaying ? /* @__PURE__ */ jsx_dev_runtime16.jsxDEV(Pause, {
                    className: "w-5 h-5 fill-current"
                  }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime16.jsxDEV(Play, {
                    className: "w-5 h-5 fill-current ml-1"
                  }, undefined, false, undefined, this)
                }, undefined, false, undefined, this)
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime16.jsxDEV(SongContextMenu_default, {
        isOpen: contextMenu,
        onClose: () => setContextMenu(false),
        song
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
};
var SongCard_default = SongCard;

// src/components/MagicBento.jsx
var import_react52 = __toESM(require_react(), 1);
var jsx_dev_runtime17 = __toESM(require_jsx_dev_runtime(), 1);

// src/components/ProfileSettingsModal.jsx
var import_react53 = __toESM(require_react(), 1);
init_react();
init_api();
init_lucide_react();
init_api();
init_ToastContext();
var jsx_dev_runtime18 = __toESM(require_jsx_dev_runtime(), 1);
var ProfileSettingsModal = ({ isOpen, onClose, user, onUpdate }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = import_react53.useState("profile");
  const [formData, setFormData] = import_react53.useState({
    username: user?.username || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    avatar_url: user?.avatar_url || "",
    streaming_quality: user?.streaming_quality || "auto"
  });
  const [selectedFile, setSelectedFile] = import_react53.useState(null);
  const [previewUrl, setPreviewUrl] = import_react53.useState(resolveUrl(user?.avatar_url) || "");
  const [isLoading, setIsLoading] = import_react53.useState(false);
  const [status, setStatus] = import_react53.useState(null);
  const [isEditingName, setIsEditingName] = import_react53.useState(false);
  const [usernameStatus, setUsernameStatus] = import_react53.useState(null);
  const [usernameFormatError, setUsernameFormatError] = import_react53.useState("");
  const usernameTimerRef = import_react53.useRef(null);
  const fileInputRef = import_react53.useRef(null);
  const [issueDescription, setIssueDescription] = import_react53.useState("");
  const [isSubmittingIssue, setIsSubmittingIssue] = import_react53.useState(false);
  const [showIssueForm, setShowIssueForm] = import_react53.useState(false);
  import_react53.default.useEffect(() => {
    if (user && isOpen) {
      setFormData({
        username: user?.username || "",
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        avatar_url: user?.avatar_url || "",
        streaming_quality: user?.streaming_quality || "auto"
      });
      setPreviewUrl(resolveUrl(user?.avatar_url) || "");
      setSelectedFile(null);
    }
  }, [user, isOpen]);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStatus("dirty");
    }
  };
  const checkUsername = import_react53.useCallback((username) => {
    if (usernameTimerRef.current)
      clearTimeout(usernameTimerRef.current);
    if (!username || username.length < 3 || username === user?.username) {
      setUsernameStatus(null);
      return;
    }
    setUsernameStatus("checking");
    usernameTimerRef.current = setTimeout(async () => {
      try {
        const res = await api_default.get(`/api/auth/check-username/${encodeURIComponent(username)}`);
        setUsernameStatus(res.data.available ? "available" : "taken");
      } catch {
        setUsernameStatus(null);
      }
    }, 500);
  }, [user]);
  const handleUsernameChange = (val) => {
    const rawVal = val.toLowerCase();
    if (rawVal && !/^[a-z0-9_]+$/.test(rawVal)) {
      setUsernameFormatError("Username can only contain letters, numbers, and underscores (no spaces)");
    } else {
      setUsernameFormatError("");
    }
    setFormData({ ...formData, username: rawVal });
    if (rawVal.length >= 3 && /^[a-z0-9_]+$/.test(rawVal)) {
      checkUsername(rawVal);
    } else {
      if (usernameTimerRef.current)
        clearTimeout(usernameTimerRef.current);
      setUsernameStatus(null);
    }
    setStatus("dirty");
  };
  const handleSaveQuality = async (quality) => {
    setFormData((prev) => ({ ...prev, streaming_quality: quality }));
    try {
      const response = await api_default.post("/api/auth/profile", {
        user_id: user.id,
        streaming_quality: quality
      });
      if (response.data.success) {
        onUpdate(response.data.user);
        toast.success(`Quality set to ${quality}`);
      }
    } catch (err) {
      toast.error("Failed to update quality");
    }
  };
  const handleSave = async (e) => {
    if (e)
      e.preventDefault();
    if (usernameStatus === "taken" || usernameFormatError) {
      toast.error("Please fix username formatting or availability issues");
      return;
    }
    setIsLoading(true);
    setStatus(null);
    try {
      let finalAvatarUrl = formData.avatar_url;
      if (selectedFile) {
        const uploadData = new FormData;
        uploadData.append("avatar", selectedFile);
        const uploadResponse = await api_default.post("/api/auth/upload-avatar", uploadData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (uploadResponse.data.success) {
          finalAvatarUrl = uploadResponse.data.avatar_url;
        }
      }
      const response = await api_default.post("/api/auth/profile", {
        user_id: user.id,
        username: formData.username,
        avatar_url: finalAvatarUrl,
        first_name: formData.first_name?.trim(),
        last_name: formData.last_name?.trim(),
        streaming_quality: formData.streaming_quality
      });
      if (response.data.success) {
        onUpdate(response.data.user);
        setStatus("success");
        toast.success("Settings saved!");
        setTimeout(() => setStatus(null), 2000);
      }
    } catch (error) {
      setStatus("error");
      toast.error(error.response?.data?.error || "Failed to save");
    } finally {
      setIsLoading(false);
    }
  };
  const handleReportIssue = async () => {
    if (!issueDescription.trim())
      return;
    setIsSubmittingIssue(true);
    try {
      await api_default.post("/api/issues/", {
        description: issueDescription,
        error_log: "Manual report"
      });
      toast.success("Issue reported! Thank you.");
      setIssueDescription("");
      setShowIssueForm(false);
    } catch (err) {
      toast.error("Failed to send report");
    } finally {
      setIsSubmittingIssue(false);
    }
  };
  const isDirty = selectedFile || formData.username !== user?.username || formData.first_name !== user?.first_name || formData.last_name !== user?.last_name || formData.streaming_quality !== user?.streaming_quality;
  return /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(AnimatePresence, {
    children: isOpen && /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
      className: "fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 pb-safe",
      children: [
        /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          onClick: onClose,
          className: "absolute inset-0 bg-black/80 backdrop-blur-md"
        }, undefined, false, undefined, this),
        /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(motion.div, {
          initial: { opacity: 0, scale: 0.9, y: 20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.9, y: 20 },
          className: "font-sans relative w-full h-[100dvh] md:max-w-4xl md:h-[700px] bg-brand-surface/95 md:bg-brand-surface border-t border-white/10 md:border md:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden backdrop-blur-3xl",
          children: [
            /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
              className: "absolute inset-0 z-0 md:hidden pointer-events-none opacity-50",
              children: [
                /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                  className: "absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-brand-primary/20 blur-[80px] rounded-full mix-blend-screen animate-pulse",
                  style: { animationDuration: "4s" }
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                  className: "absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-500/20 blur-[80px] rounded-full mix-blend-screen animate-pulse",
                  style: { animationDuration: "6s" }
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this),
            /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
              className: "relative z-10 w-full md:w-64 bg-black/40 md:bg-black/20 border-b md:border-b-0 md:border-r border-white/5 flex flex-col p-4 md:p-6 shrink-0",
              children: [
                /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                  className: "flex items-center justify-between mb-4 md:mb-8",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("h2", {
                      className: "text-xl md:text-2xl font-black text-white italic tracking-tighter",
                      children: "Settings"
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("button", {
                      onClick: onClose,
                      className: "md:hidden text-white/60 hover:text-white bg-white/5 p-2 rounded-full",
                      children: /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(X, {
                        className: "w-5 h-5"
                      }, undefined, false, undefined, this)
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                  className: "flex md:flex-col overflow-x-auto hide-scrollbar md:space-y-1 gap-2 pb-2 md:pb-0 md:flex-1",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("button", {
                      onClick: () => setActiveTab("profile"),
                      className: `shrink-0 flex items-center justify-center md:justify-start gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-full md:rounded-xl transition-all font-bold text-xs md:text-sm ${activeTab === "profile" ? "bg-brand-primary text-brand-dark" : "bg-white/5 md:bg-transparent text-brand-muted hover:bg-white/10 hover:text-white"}`,
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(User, {
                          className: "w-4 h-4"
                        }, undefined, false, undefined, this),
                        " Profile"
                      ]
                    }, undefined, true, undefined, this),
                    user?.role !== "artist" && /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("button", {
                      onClick: () => setActiveTab("streaming"),
                      className: `shrink-0 flex items-center justify-center md:justify-start gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-full md:rounded-xl transition-all font-bold text-xs md:text-sm ${activeTab === "streaming" ? "bg-brand-primary text-brand-dark" : "bg-white/5 md:bg-transparent text-brand-muted hover:bg-white/10 hover:text-white"}`,
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(Headphones, {
                          className: "w-4 h-4"
                        }, undefined, false, undefined, this),
                        " Streaming"
                      ]
                    }, undefined, true, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("button", {
                      onClick: () => setActiveTab("about"),
                      className: `shrink-0 flex items-center justify-center md:justify-start gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-full md:rounded-xl transition-all font-bold text-xs md:text-sm ${activeTab === "about" ? "bg-brand-primary text-brand-dark" : "bg-white/5 md:bg-transparent text-brand-muted hover:bg-white/10 hover:text-white"}`,
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(Info, {
                          className: "w-4 h-4"
                        }, undefined, false, undefined, this),
                        " About & Help"
                      ]
                    }, undefined, true, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                isDirty && /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(motion.button, {
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  onClick: handleSave,
                  disabled: isLoading || usernameStatus === "taken" || !!usernameFormatError,
                  className: "hidden md:block mt-4 w-full py-3 bg-brand-primary text-brand-dark rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50",
                  children: isLoading ? /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(LoaderCircle, {
                    className: "w-4 h-4 animate-spin mx-auto"
                  }, undefined, false, undefined, this) : "Save Changes"
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this),
            /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
              className: "relative z-10 flex-1 flex flex-col overflow-hidden",
              children: [
                /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                  className: "flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 pb-24 md:pb-10",
                  children: [
                    activeTab === "profile" && /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                      className: "space-y-8 max-w-lg",
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("section", {
                          children: [
                            /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("h3", {
                              className: "text-sm font-black text-brand-primary uppercase tracking-widest mb-6",
                              children: "Profile Identity"
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                              className: "flex items-center gap-6",
                              children: [
                                /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                                  className: "relative group cursor-pointer",
                                  onClick: () => fileInputRef.current?.click(),
                                  children: [
                                    /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                                      className: "w-24 h-24 rounded-2xl bg-brand-dark border-2 border-white/10 overflow-hidden flex items-center justify-center group-hover:border-brand-primary/40 transition-all",
                                      children: previewUrl ? /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("img", {
                                        src: previewUrl,
                                        alt: "",
                                        className: "w-full h-full object-cover"
                                      }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(User, {
                                        className: "w-8 h-8 text-brand-muted"
                                      }, undefined, false, undefined, this)
                                    }, undefined, false, undefined, this),
                                    /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                                      className: "absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl",
                                      children: /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(Camera, {
                                        className: "w-6 h-6 text-white"
                                      }, undefined, false, undefined, this)
                                    }, undefined, false, undefined, this),
                                    /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("input", {
                                      type: "file",
                                      ref: fileInputRef,
                                      onChange: handleFileChange,
                                      accept: "image/*",
                                      className: "hidden"
                                    }, undefined, false, undefined, this)
                                  ]
                                }, undefined, true, undefined, this),
                                /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                                  className: "flex-1 space-y-4",
                                  children: /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                                    className: "space-y-1.5",
                                    children: [
                                      /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("label", {
                                        className: "text-[10px] font-bold text-brand-muted uppercase",
                                        children: "Display Name"
                                      }, undefined, false, undefined, this),
                                      /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                                        className: "flex gap-2",
                                        children: [
                                          /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("input", {
                                            type: "text",
                                            value: formData.first_name,
                                            onChange: (e) => {
                                              setFormData({ ...formData, first_name: e.target.value });
                                              setStatus("dirty");
                                            },
                                            placeholder: "First Name",
                                            className: "flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary/40"
                                          }, undefined, false, undefined, this),
                                          /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("input", {
                                            type: "text",
                                            value: formData.last_name,
                                            onChange: (e) => {
                                              setFormData({ ...formData, last_name: e.target.value });
                                              setStatus("dirty");
                                            },
                                            placeholder: "Last Name",
                                            className: "flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary/40"
                                          }, undefined, false, undefined, this)
                                        ]
                                      }, undefined, true, undefined, this)
                                    ]
                                  }, undefined, true, undefined, this)
                                }, undefined, false, undefined, this)
                              ]
                            }, undefined, true, undefined, this)
                          ]
                        }, undefined, true, undefined, this),
                        /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("section", {
                          className: "space-y-1.5",
                          children: [
                            /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("label", {
                              className: "text-[10px] font-bold text-brand-muted uppercase",
                              children: "Username"
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                              className: "relative",
                              children: [
                                /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("input", {
                                  type: "text",
                                  value: formData.username,
                                  onChange: (e) => handleUsernameChange(e.target.value),
                                  className: `w-full bg-white/[0.03] border rounded-xl px-4 py-2.5 pr-10 text-sm text-white focus:outline-none transition-all ${usernameStatus === "taken" ? "border-red-500/50" : usernameStatus === "available" ? "border-emerald-500/50" : "border-white/10 focus:border-brand-primary/40"}`
                                }, undefined, false, undefined, this),
                                /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                                  className: "absolute right-3 top-1/2 -translate-y-1/2",
                                  children: [
                                    usernameStatus === "available" && !usernameFormatError && /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(CircleCheckBig, {
                                      className: "w-4 h-4 text-emerald-400"
                                    }, undefined, false, undefined, this),
                                    (usernameStatus === "taken" || usernameFormatError) && /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(CircleX, {
                                      className: "w-4 h-4 text-red-400"
                                    }, undefined, false, undefined, this),
                                    usernameStatus === "checking" && !usernameFormatError && /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                                      className: "w-4 h-4 border-2 border-brand-muted/30 border-t-brand-muted rounded-full animate-spin"
                                    }, undefined, false, undefined, this)
                                  ]
                                }, undefined, true, undefined, this)
                              ]
                            }, undefined, true, undefined, this),
                            usernameFormatError && /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("p", {
                              className: "text-[10px] text-amber-400 font-bold mt-1.5",
                              children: usernameFormatError
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("p", {
                              className: "text-[10px] text-brand-muted italic mt-1.5",
                              children: "Your unique handle on Wave. Changing this may affect shared links."
                            }, undefined, false, undefined, this)
                          ]
                        }, undefined, true, undefined, this)
                      ]
                    }, undefined, true, undefined, this),
                    activeTab === "streaming" && user?.role !== "artist" && /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                      className: "space-y-8 max-w-lg",
                      children: /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("section", {
                        children: [
                          /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("h3", {
                            className: "text-sm font-black text-brand-primary uppercase tracking-widest mb-2 flex items-center gap-2",
                            children: [
                              /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(SlidersVertical, {
                                className: "w-4 h-4"
                              }, undefined, false, undefined, this),
                              " Audio Quality"
                            ]
                          }, undefined, true, undefined, this),
                          /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("p", {
                            className: "text-xs text-brand-muted mb-6",
                            children: 'Higher bitrates consume more data but sound incredible. "Extreme" uses 320kbps.'
                          }, undefined, false, undefined, this),
                          /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                            className: "grid gap-3",
                            children: [
                              { id: "auto", label: "Auto (Recommended)", desc: "Balanced based on connection" },
                              { id: "low", label: "Data Saver (96kbps)", desc: "Minimum data usage" },
                              { id: "medium", label: "Balanced (160kbps)", desc: "Standard streaming quality" },
                              { id: "high", label: "High (256kbps)", desc: "Premium clarity" },
                              { id: "extreme", label: "Extreme (320kbps+)", desc: "Lossless-like experience" }
                            ].map((opt) => /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("button", {
                              onClick: () => {
                                setFormData({ ...formData, streaming_quality: opt.id });
                                setStatus("dirty");
                              },
                              className: `flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${formData.streaming_quality === opt.id ? "bg-brand-primary/10 border-brand-primary" : "bg-white/[0.02] border-white/5 hover:border-white/20"}`,
                              children: [
                                /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                                  children: [
                                    /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("p", {
                                      className: `text-sm font-bold ${formData.streaming_quality === opt.id ? "text-brand-primary" : "text-white"}`,
                                      children: opt.label
                                    }, undefined, false, undefined, this),
                                    /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("p", {
                                      className: "text-[10px] text-brand-muted mt-0.5",
                                      children: opt.desc
                                    }, undefined, false, undefined, this)
                                  ]
                                }, undefined, true, undefined, this),
                                formData.streaming_quality === opt.id && /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(Check, {
                                  className: "w-5 h-5 text-brand-primary"
                                }, undefined, false, undefined, this)
                              ]
                            }, opt.id, true, undefined, this))
                          }, undefined, false, undefined, this)
                        ]
                      }, undefined, true, undefined, this)
                    }, undefined, false, undefined, this),
                    activeTab === "about" && /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                      className: "space-y-8 max-w-lg text-left",
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("section", {
                          className: "space-y-4",
                          children: [
                            /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("h3", {
                              className: "text-sm font-black text-brand-primary uppercase tracking-widest mb-6",
                              children: "App Info"
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                              className: "bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4",
                              children: [
                                /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                                  className: "flex justify-between items-center",
                                  children: [
                                    /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("span", {
                                      className: "text-xs font-bold text-white",
                                      children: "Version"
                                    }, undefined, false, undefined, this),
                                    /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("span", {
                                      className: "text-xs font-medium text-brand-muted",
                                      children: "2.2.0 (Build 943)"
                                    }, undefined, false, undefined, this)
                                  ]
                                }, undefined, true, undefined, this),
                                /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                                  className: "flex justify-between items-center",
                                  children: [
                                    /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("span", {
                                      className: "text-xs font-bold text-white",
                                      children: "Environment"
                                    }, undefined, false, undefined, this),
                                    /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("span", {
                                      className: "text-xs font-medium text-brand-muted",
                                      children: "Production (Cloud)"
                                    }, undefined, false, undefined, this)
                                  ]
                                }, undefined, true, undefined, this)
                              ]
                            }, undefined, true, undefined, this)
                          ]
                        }, undefined, true, undefined, this),
                        /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("section", {
                          className: "space-y-4",
                          children: [
                            /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("h3", {
                              className: "text-sm font-black text-brand-primary uppercase tracking-widest",
                              children: "Support"
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("button", {
                              onClick: () => setShowIssueForm(!showIssueForm),
                              className: "w-full flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all",
                              children: [
                                /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                                  className: "flex items-center gap-3",
                                  children: [
                                    /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(Info, {
                                      className: "w-5 h-5 text-blue-400"
                                    }, undefined, false, undefined, this),
                                    /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("span", {
                                      className: "text-xs font-bold text-white",
                                      children: "Report a Bug"
                                    }, undefined, false, undefined, this)
                                  ]
                                }, undefined, true, undefined, this),
                                /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(ChevronRight, {
                                  className: `w-4 h-4 text-brand-muted transition-transform ${showIssueForm ? "rotate-90" : ""}`
                                }, undefined, false, undefined, this)
                              ]
                            }, undefined, true, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(AnimatePresence, {
                              children: showIssueForm && /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(motion.div, {
                                initial: { height: 0, opacity: 0 },
                                animate: { height: "auto", opacity: 1 },
                                exit: { height: 0, opacity: 0 },
                                className: "overflow-hidden space-y-3",
                                children: [
                                  /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("textarea", {
                                    value: issueDescription,
                                    onChange: (e) => setIssueDescription(e.target.value),
                                    placeholder: "Describe the problem...",
                                    className: "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary/40 min-h-[120px] resize-none"
                                  }, undefined, false, undefined, this),
                                  /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("button", {
                                    onClick: handleReportIssue,
                                    disabled: isSubmittingIssue || !issueDescription.trim(),
                                    className: "w-full py-3 bg-blue-500/20 text-blue-400 rounded-xl font-bold text-xs hover:bg-blue-500/30 transition-all",
                                    children: isSubmittingIssue ? /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(LoaderCircle, {
                                      className: "w-4 h-4 animate-spin mx-auto"
                                    }, undefined, false, undefined, this) : "Submit Feedback"
                                  }, undefined, false, undefined, this)
                                ]
                              }, undefined, true, undefined, this)
                            }, undefined, false, undefined, this)
                          ]
                        }, undefined, true, undefined, this)
                      ]
                    }, undefined, true, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                isDirty && /* @__PURE__ */ jsx_dev_runtime18.jsxDEV("div", {
                  className: "md:hidden absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-brand-surface via-brand-surface to-transparent pt-12",
                  children: /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(motion.button, {
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    onClick: handleSave,
                    disabled: isLoading || usernameStatus === "taken" || !!usernameFormatError,
                    className: "w-full py-3.5 bg-brand-primary text-brand-dark rounded-xl font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(var(--brand-primary-rgb),0.3)] active:scale-[0.98] transition-all disabled:opacity-50",
                    children: isLoading ? /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(LoaderCircle, {
                      className: "w-4 h-4 animate-spin mx-auto"
                    }, undefined, false, undefined, this) : "Save Changes"
                  }, undefined, false, undefined, this)
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this)
          ]
        }, undefined, true, undefined, this)
      ]
    }, undefined, true, undefined, this)
  }, undefined, false, undefined, this);
};
var ProfileSettingsModal_default = ProfileSettingsModal;

// src/components/UserMenu.jsx
var import_react55 = __toESM(require_react(), 1);
init_react();
init_lucide_react();
init_api();
var jsx_dev_runtime19 = __toESM(require_jsx_dev_runtime(), 1);
var UserMenu = ({ isOpen, onClose, user, onOpenSettings, onLogout, navigate }) => {
  const menuRef = import_react55.useRef(null);
  import_react55.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);
  if (!isOpen)
    return null;
  return /* @__PURE__ */ jsx_dev_runtime19.jsxDEV(AnimatePresence, {
    children: /* @__PURE__ */ jsx_dev_runtime19.jsxDEV(motion.div, {
      ref: menuRef,
      initial: { opacity: 0, scale: 0.95, y: -10 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95, y: -10 },
      transition: { type: "spring", damping: 20, stiffness: 300 },
      className: "absolute right-0 top-full mt-2 w-72 bg-brand-surface/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden",
      children: [
        /* @__PURE__ */ jsx_dev_runtime19.jsxDEV("div", {
          className: "p-5 border-b border-white/5 bg-gradient-to-b from-brand-primary/5 to-transparent",
          children: /* @__PURE__ */ jsx_dev_runtime19.jsxDEV("div", {
            className: "flex items-center gap-4",
            children: [
              /* @__PURE__ */ jsx_dev_runtime19.jsxDEV("div", {
                className: "w-12 h-12 rounded-full bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center overflow-hidden shadow-inner",
                children: user.avatar_url ? /* @__PURE__ */ jsx_dev_runtime19.jsxDEV("img", {
                  src: resolveUrl(user.avatar_url),
                  alt: "",
                  className: "w-full h-full object-cover"
                }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime19.jsxDEV("span", {
                  className: "text-xl font-black text-brand-primary uppercase",
                  children: user.username?.[0] || "U"
                }, undefined, false, undefined, this)
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime19.jsxDEV("div", {
                className: "flex-1 min-w-0",
                children: [
                  /* @__PURE__ */ jsx_dev_runtime19.jsxDEV("h3", {
                    className: "text-sm font-black text-brand-primary truncate leading-tight",
                    children: user.first_name ? `${user.first_name} ${user.last_name || ""}` : user.username
                  }, undefined, false, undefined, this),
                  /* @__PURE__ */ jsx_dev_runtime19.jsxDEV("p", {
                    className: "text-[10px] text-brand-muted font-bold tracking-wider uppercase mt-0.5",
                    children: [
                      "@",
                      user.username
                    ]
                  }, undefined, true, undefined, this)
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this)
        }, undefined, false, undefined, this),
        /* @__PURE__ */ jsx_dev_runtime19.jsxDEV("div", {
          className: "p-2 space-y-0.5",
          children: [
            /* @__PURE__ */ jsx_dev_runtime19.jsxDEV("button", {
              onClick: () => {
                onClose();
                onOpenSettings();
              },
              className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group text-left",
              children: [
                /* @__PURE__ */ jsx_dev_runtime19.jsxDEV("div", {
                  className: "w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-colors",
                  children: /* @__PURE__ */ jsx_dev_runtime19.jsxDEV(Settings, {
                    className: "w-4 h-4"
                  }, undefined, false, undefined, this)
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime19.jsxDEV("div", {
                  className: "flex-1",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime19.jsxDEV("p", {
                      className: "text-xs font-bold text-white",
                      children: "Settings"
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime19.jsxDEV("p", {
                      className: "text-[9px] text-brand-muted",
                      children: "Profile, Quality, Privacy"
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime19.jsxDEV(ChevronRight, {
                  className: "w-3.5 h-3.5 text-brand-muted opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0"
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this),
            /* @__PURE__ */ jsx_dev_runtime19.jsxDEV("div", {
              className: "h-px bg-white/5 mx-2 my-1"
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsx_dev_runtime19.jsxDEV("button", {
              onClick: onLogout,
              className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors group text-left",
              children: [
                /* @__PURE__ */ jsx_dev_runtime19.jsxDEV(LogOut, {
                  className: "w-4 h-4 text-red-400/60 group-hover:text-red-400"
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime19.jsxDEV("span", {
                  className: "text-[11px] font-semibold text-red-400/60 group-hover:text-red-400",
                  children: "Sign Out"
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this)
          ]
        }, undefined, true, undefined, this),
        /* @__PURE__ */ jsx_dev_runtime19.jsxDEV("div", {
          className: "px-5 py-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between",
          children: [
            /* @__PURE__ */ jsx_dev_runtime19.jsxDEV("span", {
              className: "text-[9px] font-black uppercase tracking-widest text-brand-muted/40",
              children: "Wave Music"
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsx_dev_runtime19.jsxDEV("span", {
              className: "text-[9px] font-bold text-brand-muted/30",
              children: "v2.2.0"
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this)
      ]
    }, undefined, true, undefined, this)
  }, undefined, false, undefined, this);
};
var UserMenu_default = UserMenu;

// src/pages/Dashboard.jsx
init_ToastContext();

// src/components/HorizontalCarousel.jsx
var import_react57 = __toESM(require_react(), 1);
init_lucide_react();
var jsx_dev_runtime20 = __toESM(require_jsx_dev_runtime(), 1);
var HorizontalCarousel = ({ children, className = "" }) => {
  const scrollRef = import_react57.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = import_react57.useState(false);
  const [canScrollRight, setCanScrollRight] = import_react57.useState(false);
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el)
      return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };
  import_react57.useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el)
      el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el?.removeEventListener("scroll", checkScroll);
  }, [children]);
  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el)
      return;
    el.scrollBy({ left: dir * 320, behavior: "smooth" });
  };
  return /* @__PURE__ */ jsx_dev_runtime20.jsxDEV("div", {
    className: `relative group/carousel ${className}`,
    children: [
      canScrollLeft && /* @__PURE__ */ jsx_dev_runtime20.jsxDEV("button", {
        onClick: () => scroll(-1),
        className: "absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-brand-dark/90 border border-white/10 shadow-xl flex items-center justify-center text-white hover:bg-white/10 transition-all opacity-0 group-hover/carousel:opacity-100",
        children: /* @__PURE__ */ jsx_dev_runtime20.jsxDEV(ChevronLeft, {
          className: "w-5 h-5"
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime20.jsxDEV("div", {
        ref: scrollRef,
        className: "flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-2",
        style: { scrollbarWidth: "none", msOverflowStyle: "none" },
        children
      }, undefined, false, undefined, this),
      canScrollRight && /* @__PURE__ */ jsx_dev_runtime20.jsxDEV("button", {
        onClick: () => scroll(1),
        className: "absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-brand-dark/90 border border-white/10 shadow-xl flex items-center justify-center text-white hover:bg-white/10 transition-all opacity-0 group-hover/carousel:opacity-100",
        children: /* @__PURE__ */ jsx_dev_runtime20.jsxDEV(ChevronRight, {
          className: "w-5 h-5"
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
};
var HorizontalCarousel_default = HorizontalCarousel;

// src/components/SectionHeader.jsx
var import_react58 = __toESM(require_react(), 1);
var jsx_dev_runtime21 = __toESM(require_jsx_dev_runtime(), 1);
var SectionHeader = ({ title, icon: Icon2, subtitle, onShowAll }) => /* @__PURE__ */ jsx_dev_runtime21.jsxDEV("div", {
  className: "flex items-end justify-between mb-4 md:mb-5",
  children: [
    /* @__PURE__ */ jsx_dev_runtime21.jsxDEV("div", {
      children: [
        /* @__PURE__ */ jsx_dev_runtime21.jsxDEV("h2", {
          className: "text-lg md:text-xl font-bold text-brand-primary flex items-center gap-2 md:gap-2.5",
          children: [
            Icon2 && /* @__PURE__ */ jsx_dev_runtime21.jsxDEV(Icon2, {
              className: "w-4 h-4 md:w-5 md:h-5 text-brand-muted"
            }, undefined, false, undefined, this),
            title
          ]
        }, undefined, true, undefined, this),
        subtitle && /* @__PURE__ */ jsx_dev_runtime21.jsxDEV("p", {
          className: "text-[10px] md:text-xs text-brand-muted mt-0.5 md:mt-1 font-medium",
          children: subtitle
        }, undefined, false, undefined, this)
      ]
    }, undefined, true, undefined, this),
    onShowAll && /* @__PURE__ */ jsx_dev_runtime21.jsxDEV("button", {
      onClick: onShowAll,
      className: "text-[10px] md:text-xs font-bold text-brand-muted hover:text-brand-primary transition-colors uppercase tracking-wider",
      children: "Show all"
    }, undefined, false, undefined, this)
  ]
}, undefined, true, undefined, this);
var SectionHeader_default = SectionHeader;

// src/components/ContentCard.jsx
var import_react59 = __toESM(require_react(), 1);
init_lucide_react();
var jsx_dev_runtime22 = __toESM(require_jsx_dev_runtime(), 1);
var ContentCard = ({ image, title, subtitle, onClick, onAddToQueue, isRound = false, size = "normal", isCurrentlyPlaying = false, isCurrentlyPaused = false }) => {
  const w = size === "large" ? "w-40 md:w-52 shrink-0" : "w-36 md:w-44 shrink-0";
  const [imgError, setImgError] = import_react59.useState(false);
  return /* @__PURE__ */ jsx_dev_runtime22.jsxDEV("div", {
    onClick,
    className: `${w} p-2 md:p-3 rounded-2xl bg-brand-surface hover:bg-white/[0.04] transition-all duration-300 group cursor-pointer border border-transparent hover:border-white/[0.05]`,
    children: [
      /* @__PURE__ */ jsx_dev_runtime22.jsxDEV("div", {
        className: `aspect-square bg-brand-dark ${isRound ? "rounded-full" : "rounded-xl"} mb-2 md:mb-3 overflow-hidden relative shadow-md flex items-center justify-center`,
        children: [
          image && !imgError ? /* @__PURE__ */ jsx_dev_runtime22.jsxDEV("img", {
            src: image,
            alt: title,
            className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700",
            loading: "lazy",
            onError: () => setImgError(true)
          }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime22.jsxDEV(Music, {
            className: "w-10 h-10 text-brand-muted opacity-50"
          }, undefined, false, undefined, this),
          isCurrentlyPlaying && /* @__PURE__ */ jsx_dev_runtime22.jsxDEV("div", {
            className: "absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300",
            children: /* @__PURE__ */ jsx_dev_runtime22.jsxDEV("div", {
              className: "w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center shadow-lg animate-pulse",
              children: /* @__PURE__ */ jsx_dev_runtime22.jsxDEV(Pause, {
                className: "w-5 h-5 fill-current text-brand-dark"
              }, undefined, false, undefined, this)
            }, undefined, false, undefined, this)
          }, undefined, false, undefined, this),
          !isCurrentlyPlaying && /* @__PURE__ */ jsx_dev_runtime22.jsxDEV("div", {
            className: "absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2",
            children: /* @__PURE__ */ jsx_dev_runtime22.jsxDEV("div", {
              className: "flex items-center gap-3",
              children: [
                /* @__PURE__ */ jsx_dev_runtime22.jsxDEV("div", {
                  className: "w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-105",
                  children: /* @__PURE__ */ jsx_dev_runtime22.jsxDEV(Play, {
                    className: "w-6 h-6 fill-current text-brand-dark ml-1"
                  }, undefined, false, undefined, this)
                }, undefined, false, undefined, this),
                onAddToQueue && /* @__PURE__ */ jsx_dev_runtime22.jsxDEV("button", {
                  onClick: (e) => {
                    e.stopPropagation();
                    onAddToQueue();
                  },
                  className: "w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 text-white",
                  title: "Add to queue",
                  children: /* @__PURE__ */ jsx_dev_runtime22.jsxDEV(Plus, {
                    className: "w-5 h-5"
                  }, undefined, false, undefined, this)
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this)
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime22.jsxDEV("div", {
        className: "font-semibold truncate text-xs md:text-sm text-brand-primary",
        children: title
      }, undefined, false, undefined, this),
      subtitle && /* @__PURE__ */ jsx_dev_runtime22.jsxDEV("div", {
        className: "text-[10px] md:text-xs text-brand-muted truncate mt-0.5",
        children: subtitle
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
};
var ContentCard_default = ContentCard;

// src/components/QuickPickCard.jsx
var import_react60 = __toESM(require_react(), 1);
init_lucide_react();
var jsx_dev_runtime23 = __toESM(require_jsx_dev_runtime(), 1);
var QuickPickCard = ({ song, onClick, resolveUrl: resolveUrl2 }) => {
  const [imgError, setImgError] = import_react60.useState(false);
  return /* @__PURE__ */ jsx_dev_runtime23.jsxDEV("div", {
    onClick,
    className: "flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.07] rounded-lg overflow-hidden cursor-pointer group transition-all duration-200 h-14 shadow-sm",
    children: [
      /* @__PURE__ */ jsx_dev_runtime23.jsxDEV("div", {
        className: "w-14 h-14 shrink-0 bg-brand-dark relative flex items-center justify-center",
        children: [
          song.cover_image_url && !imgError ? /* @__PURE__ */ jsx_dev_runtime23.jsxDEV("img", {
            src: resolveUrl2(song.cover_image_url),
            alt: "",
            className: "w-full h-full object-cover",
            onError: () => setImgError(true)
          }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime23.jsxDEV(Music, {
            className: "w-5 h-5 text-brand-muted opacity-50"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime23.jsxDEV("div", {
            className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]",
            children: /* @__PURE__ */ jsx_dev_runtime23.jsxDEV(Play, {
              className: "w-5 h-5 fill-current text-white transform scale-75 group-hover:scale-100 transition-transform duration-300 ml-0.5"
            }, undefined, false, undefined, this)
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime23.jsxDEV("span", {
        className: "text-xs font-bold text-brand-primary truncate pr-3 flex-1",
        children: song.title
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
};
var QuickPickCard_default = QuickPickCard;

// src/components/VinylExpansionHeader.jsx
var import_react61 = __toESM(require_react(), 1);
var jsx_dev_runtime24 = __toESM(require_jsx_dev_runtime(), 1);

// src/components/TopThreeHeader.jsx
var import_react62 = __toESM(require_react(), 1);
init_lucide_react();
var jsx_dev_runtime25 = __toESM(require_jsx_dev_runtime(), 1);
var TopThreeHeader = ({ trendingSongs, resolveUrl: resolveUrl2, onPlay }) => {
  if (!trendingSongs || trendingSongs.length === 0) {
    return /* @__PURE__ */ jsx_dev_runtime25.jsxDEV("div", {
      className: "hidden md:block pt-6 pb-10 px-8 max-w-[1400px] mx-auto",
      children: /* @__PURE__ */ jsx_dev_runtime25.jsxDEV("div", {
        className: "grid grid-cols-1 md:grid-cols-3 gap-6 h-[280px]",
        children: [...Array(3)].map((_, i) => /* @__PURE__ */ jsx_dev_runtime25.jsxDEV("div", {
          className: "relative rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-white/5 animate-pulse"
        }, `skeleton-top-three-${i}`, false, undefined, this))
      }, undefined, false, undefined, this)
    }, undefined, false, undefined, this);
  }
  const topThree = trendingSongs.slice(0, 3);
  return /* @__PURE__ */ jsx_dev_runtime25.jsxDEV("div", {
    className: "hidden md:block animate-fade-in pt-6 pb-10 px-8 max-w-[1400px] mx-auto",
    children: /* @__PURE__ */ jsx_dev_runtime25.jsxDEV("div", {
      className: "grid grid-cols-1 md:grid-cols-3 gap-6 h-[280px]",
      children: topThree.slice(0, 3).map((song, i) => /* @__PURE__ */ jsx_dev_runtime25.jsxDEV("div", {
        onClick: () => onPlay(song),
        className: "relative rounded-3xl overflow-hidden group cursor-pointer shadow-2xl border border-white/5 bg-brand-surface",
        children: [
          /* @__PURE__ */ jsx_dev_runtime25.jsxDEV("img", {
            src: resolveUrl2(song.cover_image_url),
            className: "absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110",
            alt: ""
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime25.jsxDEV("div", {
            className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime25.jsxDEV("div", {
            className: "absolute bottom-0 left-0 p-6 z-10 w-full transform transition-transform duration-500 group-hover:-translate-y-1",
            children: [
              /* @__PURE__ */ jsx_dev_runtime25.jsxDEV("div", {
                className: "flex items-center gap-1.5 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0",
                children: [
                  /* @__PURE__ */ jsx_dev_runtime25.jsxDEV("span", {
                    className: "w-1.5 h-1.5 rounded-full bg-brand-primary"
                  }, undefined, false, undefined, this),
                  /* @__PURE__ */ jsx_dev_runtime25.jsxDEV("span", {
                    className: "text-[9px] font-black uppercase tracking-[0.2em] text-brand-primary",
                    children: "Listen Now"
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime25.jsxDEV("h2", {
                className: "text-xl font-black text-white leading-tight truncate drop-shadow-lg mb-0.5",
                children: song.title
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime25.jsxDEV("p", {
                className: "text-white/50 text-xs font-bold truncate",
                children: song.artist_name
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime25.jsxDEV("div", {
            className: "absolute top-6 right-6 w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-xl",
            children: /* @__PURE__ */ jsx_dev_runtime25.jsxDEV(Play, {
              className: "w-5 h-5 fill-current text-brand-dark ml-0.5"
            }, undefined, false, undefined, this)
          }, undefined, false, undefined, this)
        ]
      }, `top-three-song-${song.saavn_id || song.song_id || i}-${i}`, true, undefined, this))
    }, undefined, false, undefined, this)
  }, undefined, false, undefined, this);
};
var TopThreeHeader_default = TopThreeHeader;

// src/pages/Dashboard.jsx
var jsx_dev_runtime26 = __toESM(require_jsx_dev_runtime(), 1);
var Dashboard = ({ defaultView = "home" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [songs, setSongs] = import_react63.useState([]);
  const [recentSongs, setRecentSongs] = import_react63.useState([]);
  const [isLoading, setIsLoading] = import_react63.useState(true);
  const [likedSongsData, setLikedSongsData] = import_react63.useState([]);
  const [playlistInfo, setPlaylistInfo] = import_react63.useState(null);
  const [artistProfileData, setArtistProfileData] = import_react63.useState(null);
  const [listenerStats, setListenerStats] = import_react63.useState(null);
  const [isFollowing, setIsFollowing] = import_react63.useState(false);
  const [homeContent, setHomeContent] = import_react63.useState(null);
  const [recommendations, setRecommendations] = import_react63.useState([]);
  const [followedArtists, setFollowedArtists] = import_react63.useState([]);
  const [trendingSongs, setTrendingSongs] = import_react63.useState([]);
  const [loadingStates, setLoadingStates] = import_react63.useState({
    recent: true,
    home: true,
    recommendations: true,
    followed: true
  });
  const [importingId, setImportingId] = import_react63.useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = import_react63.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = import_react63.useState(false);
  const [currentUser, setCurrentUser] = import_react63.useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const toast = useToast();
  const [saavnArtist, setSaavnArtist] = import_react63.useState(null);
  const [saavnAlbum, setSaavnAlbum] = import_react63.useState(null);
  const [saavnPlaylist, setSaavnPlaylist] = import_react63.useState(null);
  const [searchQuery, setSearchQuery] = import_react63.useState("");
  const handleAddToQueue = (song) => {
    addToQueue(song);
    toast.success("Added to queue");
  };
  const {
    currentSong,
    isPlaying,
    duration,
    volume,
    likedSongs,
    toggleLike,
    playlists,
    createPlaylist,
    addSongToPlaylist,
    likedPlaylists,
    fetchLikedPlaylists,
    toggleLikePlaylist,
    playSong,
    togglePlay,
    seek,
    setVolume,
    playNext,
    playPrevious,
    resolveUrl: resolveUrl2,
    addToQueue
  } = import_react63.useContext(PlayerContext);
  let currentView = "home";
  if (location.pathname === "/search")
    currentView = "search";
  else if (location.pathname === "/dashboard/library")
    currentView = "library";
  else if (location.pathname === "/dashboard/stats")
    currentView = "stats";
  else if (location.pathname.startsWith("/dashboard/playlist/"))
    currentView = "playlist";
  else if (location.pathname.startsWith("/dashboard/saavn-playlist/"))
    currentView = "saavn-playlist";
  else if (location.pathname.startsWith("/dashboard/album/saavn_"))
    currentView = "saavn-album";
  else if (location.pathname.startsWith("/dashboard/artist/saavn_"))
    currentView = "saavn-artist";
  else if (location.pathname.startsWith("/dashboard/artist/"))
    currentView = "artist-profile";
  const hasLoadedHome = import_react63.useRef(false);
  import_react63.useEffect(() => {
    const loadContent = async () => {
      if (currentView === "home") {
        if (hasLoadedHome.current)
          return;
        fetchRecentSongs().finally(() => setLoadingStates((prev) => ({ ...prev, recent: false })));
        fetchHomeContent().finally(() => setLoadingStates((prev) => ({ ...prev, home: false })));
        fetchRecommendations().finally(() => setLoadingStates((prev) => ({ ...prev, recommendations: false })));
        fetchFollowedArtists().finally(() => setLoadingStates((prev) => ({ ...prev, followed: false })));
        fetchTrending();
        hasLoadedHome.current = true;
        setIsLoading(false);
      } else {
        setIsLoading(true);
        if (currentView === "library") {
          await fetchLikedSongs();
        } else if (currentView === "playlist" && location.pathname.split("/").pop()) {
          await fetchPlaylistSongs(location.pathname.split("/").pop());
        } else if (currentView === "artist-profile" && location.pathname.split("/").pop()) {
          await fetchArtistProfile(location.pathname.split("/").pop());
        } else if (currentView === "saavn-artist") {
          const saavnId = location.pathname.split("saavn_")[1];
          if (saavnId)
            await fetchSaavnArtist(saavnId);
        } else if (currentView === "saavn-album") {
          const saavnId = location.pathname.split("saavn_")[1];
          if (saavnId)
            await fetchSaavnAlbum(saavnId);
        } else if (currentView === "saavn-playlist") {
          const saavnId = location.pathname.split("/").pop();
          if (saavnId)
            await fetchSaavnPlaylist(saavnId);
        }
        setIsLoading(false);
      }
    };
    loadContent();
  }, [currentView, location.pathname]);
  const fetchRecentSongs = async () => {
    try {
      const response = await api_default.get(`/api/songs/recent/${user.id}`);
      setRecentSongs(response.data.songs);
    } catch (error) {
      console.error("Error fetching recent songs:", error);
    }
  };
  const fetchHomeContent = async () => {
    try {
      const response = await api_default.get("/api/jiosaavn/home", { params: { user_id: user.id } });
      setHomeContent(response.data.content);
    } catch (error) {
      console.error("Error fetching home content:", error);
    }
  };
  const fetchRecommendations = async () => {
    try {
      const response = await api_default.get(`/api/songs/recommendations/${user.id}`);
      setRecommendations(response.data.songs || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };
  const fetchFollowedArtists = async () => {
    try {
      const response = await api_default.get(`/api/stats/following/${user.id}`);
      setFollowedArtists(response.data.following || []);
    } catch (error) {
      console.error("Error fetching followed artists:", error);
    }
  };
  const fetchTrending = async () => {
    try {
      const response = await api_default.get("/api/stats/trending");
      setTrendingSongs(response.data.songs || []);
    } catch (error) {
      console.error("Error fetching trending songs:", error);
    }
  };
  const fetchSaavnArtist = async (id3) => {
    try {
      const resp = await api_default.get(`/api/jiosaavn/artist/${id3}`);
      setSaavnArtist(resp.data.artist);
    } catch (error) {
      console.error("Error fetching JioSaavn artist:", error);
    }
  };
  const fetchSaavnAlbum = async (id3) => {
    try {
      const resp = await api_default.get(`/api/jiosaavn/album/${id3}`);
      setSaavnAlbum(resp.data.album);
    } catch (error) {
      console.error("Error fetching JioSaavn album:", error);
    }
  };
  const fetchSaavnPlaylist = async (id3) => {
    try {
      const resp = await api_default.get(`/api/jiosaavn/playlist/${id3}`);
      setSaavnPlaylist(resp.data.playlist);
    } catch (error) {
      console.error("Error fetching JioSaavn playlist:", error);
    }
  };
  const fetchArtistProfile = async (artistId) => {
    try {
      const [profileRes, followRes] = await Promise.all([
        api_default.get(`/api/songs/artist/${artistId}`),
        user.id ? api_default.get(`/api/stats/is_following/${artistId}/${user.id}`) : Promise.resolve({ data: { following: false } })
      ]);
      setArtistProfileData(profileRes.data.profile);
      setIsFollowing(followRes.data.following);
    } catch (error) {
      console.error("Error fetching artist profile:", error);
    }
  };
  const handleToggleFollow = async (artistId) => {
    try {
      const response = await api_default.post(`/api/stats/follow/${artistId}`, { user_id: user.id });
      setIsFollowing(response.data.following);
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };
  const fetchLikedSongs = async () => {
    try {
      const response = await api_default.get(`/api/songs/liked/${user.id}`);
      setLikedSongsData(response.data.songs);
    } catch (error) {
      console.error("Error fetching liked songs:", error);
    }
  };
  const fetchPlaylistSongs = async (playlistId) => {
    try {
      const response = await api_default.get(`/api/playlists/${playlistId}`);
      setPlaylistInfo(response.data.playlist);
    } catch (error) {
      console.error("Error fetching playlist songs:", error);
    }
  };
  const handleCreatePlaylist = () => {
    const title = prompt("Enter playlist name:");
    if (title) {
      createPlaylist(title);
    }
  };
  const handleLogout = async () => {
    try {
      await api_default.post("/api/auth/logout");
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  const handleGlobalPlay = async (saavnSong, songList = null) => {
    setImportingId(saavnSong.saavn_id);
    try {
      const res = await api_default.post("/api/jiosaavn/import", saavnSong);
      if (res.data.success) {
        const imported = res.data.song;
        const playable = {
          song_id: imported.song_id,
          saavn_id: saavnSong.saavn_id,
          title: imported.title,
          audio_url: imported.audio_url,
          cover_image_url: imported.cover_image_url,
          duration: imported.duration,
          artist_id: imported.artist_id,
          artist_name: imported.artist_name,
          artists: imported.artists
        };
        playSong(playable, songList || [playable]);
      }
    } catch (err) {
      console.error("Import failed:", err);
    } finally {
      setImportingId(null);
    }
  };
  const formatTime2 = (seconds) => {
    if (!seconds || isNaN(seconds))
      return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  const [isRefreshing, setIsRefreshing] = import_react63.useState(false);
  const [pullDistance, setPullDistance] = import_react63.useState(0);
  const [fetchError, setFetchError] = import_react63.useState(null);
  const pullStartY = import_react63.useRef(0);
  const scrollContainerRef = import_react63.useRef(null);
  const PULL_THRESHOLD = 80;
  const handleRefresh = import_react63.useCallback(async () => {
    setIsRefreshing(true);
    setFetchError(null);
    hasLoadedHome.current = false;
    try {
      await Promise.all([
        fetchRecentSongs(),
        fetchTrending(),
        fetchHomeContent(),
        fetchRecommendations(),
        fetchFollowedArtists()
      ]);
      hasLoadedHome.current = true;
    } catch (err) {
      setFetchError("Failed to load content. Pull down to retry.");
    } finally {
      setIsRefreshing(false);
      setPullDistance(0);
    }
  }, []);
  const handlePullStart = import_react63.useCallback((e) => {
    if (scrollContainerRef.current?.scrollTop === 0) {
      pullStartY.current = e.touches[0].clientY;
    }
  }, []);
  const handlePullMove = import_react63.useCallback((e) => {
    if (!pullStartY.current || isRefreshing)
      return;
    const scrollTop = scrollContainerRef.current?.scrollTop || 0;
    if (scrollTop > 0) {
      pullStartY.current = 0;
      setPullDistance(0);
      return;
    }
    const delta = e.touches[0].clientY - pullStartY.current;
    if (delta > 0) {
      setPullDistance(Math.min(delta * 0.5, PULL_THRESHOLD * 1.5));
    }
  }, [isRefreshing]);
  const handlePullEnd = import_react63.useCallback(() => {
    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      handleRefresh();
    } else {
      setPullDistance(0);
    }
    pullStartY.current = 0;
  }, [pullDistance, isRefreshing, handleRefresh]);
  return /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
    className: "flex h-screen bg-brand-dark overflow-hidden",
    children: [
      /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(ProfileSettingsModal_default, {
        isOpen: isProfileModalOpen,
        onClose: () => setIsProfileModalOpen(false),
        user: currentUser,
        onUpdate: (updatedUser) => setCurrentUser(updatedUser)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Sidebar_default, {}, undefined, false, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
        className: "flex-1 flex flex-col min-w-0 bg-brand-dark relative",
        children: [
          /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
            className: "min-h-[3.5rem] md:min-h-[4rem] py-2 md:py-3 pt-safe px-4 md:px-8 flex items-center sticky top-0 z-40 bg-brand-dark/90 backdrop-blur-2xl border-b border-white/[0.03] transition-all duration-500 shadow-sm",
            children: [
              /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                className: "flex-1 flex items-center",
                children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                  className: "flex items-center gap-2 cursor-pointer group md:hidden",
                  onClick: () => navigate("/dashboard"),
                  children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Logo_default, {
                    size: 20,
                    className: "shrink-0 group-hover:scale-105 transition-transform"
                  }, undefined, false, undefined, this)
                }, undefined, false, undefined, this)
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                className: "flex-[2] flex justify-center items-center",
                children: currentView !== "search" && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                  className: "relative w-full max-w-[200px] md:max-w-md group transition-all duration-300",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Search, {
                      className: "absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-brand-muted w-3.5 h-3.5 opacity-50 group-focus-within:text-brand-primary transition-colors"
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("input", {
                      id: "global-search-input",
                      name: "global-search-input",
                      type: "text",
                      placeholder: "Search songs, artists, albums...",
                      value: searchQuery,
                      onChange: (e) => setSearchQuery(e.target.value),
                      onKeyDown: (e) => {
                        if (e.key === "Enter" && searchQuery.trim()) {
                          navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                          setSearchQuery("");
                        }
                      },
                      className: "w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.05] rounded-full py-1.5 md:py-2.5 pl-9 md:pl-11 pr-3 md:pr-4 text-xs font-semibold text-brand-primary focus:outline-none focus:bg-white/[0.08] focus:border-brand-primary/20 placeholder-brand-muted/70 transition-all duration-300 shadow-inner"
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                className: "flex-1 flex justify-end items-center gap-3 md:gap-6 relative",
                children: [
                  /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                    className: "flex items-center gap-3 cursor-pointer group",
                    onClick: () => setIsUserMenuOpen(!isUserMenuOpen),
                    children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                      className: "w-9 h-9 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center overflow-hidden group-hover:border-brand-primary/40 transition-all bg-gradient-to-tr from-brand-primary/20 to-brand-accent/20 shadow-lg",
                      children: currentUser.avatar_url ? /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("img", {
                        src: resolveUrl2(currentUser.avatar_url),
                        alt: "",
                        className: "w-full h-full object-cover"
                      }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("span", {
                        className: "text-sm font-black text-brand-primary uppercase",
                        children: currentUser.username?.[0] || "U"
                      }, undefined, false, undefined, this)
                    }, undefined, false, undefined, this)
                  }, undefined, false, undefined, this),
                  /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(UserMenu_default, {
                    isOpen: isUserMenuOpen,
                    onClose: () => setIsUserMenuOpen(false),
                    user: currentUser,
                    onOpenSettings: () => setIsProfileModalOpen(true),
                    onLogout: handleLogout,
                    navigate
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this),
          currentView === "home" && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
            ref: scrollContainerRef,
            onTouchStart: handlePullStart,
            onTouchMove: handlePullMove,
            onTouchEnd: handlePullEnd,
            className: "flex-1 overflow-y-auto relative pb-32 md:pb-32 custom-scrollbar animate-fade-in",
            children: [
              (pullDistance > 0 || isRefreshing) && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                className: "flex items-center justify-center transition-all duration-200 overflow-hidden",
                style: { height: isRefreshing ? 48 : pullDistance },
                children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                  className: `w-6 h-6 border-[3px] border-brand-primary/20 border-t-brand-primary rounded-full ${isRefreshing ? "animate-spin" : ""}`,
                  style: { transform: !isRefreshing ? `rotate(${pullDistance * 3}deg)` : undefined, opacity: Math.min(pullDistance / PULL_THRESHOLD, 1) }
                }, undefined, false, undefined, this)
              }, undefined, false, undefined, this),
              fetchError && !isLoading && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                className: "mx-4 md:mx-8 mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3",
                children: [
                  /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                    className: "text-red-400 text-sm font-medium flex-1",
                    children: fetchError
                  }, undefined, false, undefined, this),
                  /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("button", {
                    onClick: handleRefresh,
                    className: "px-4 py-2 rounded-xl bg-red-500/20 text-red-300 text-xs font-bold hover:bg-red-500/30 transition-colors",
                    children: "Retry"
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                className: "relative md:min-h-[300px] hidden md:block",
                children: loadingStates.home && trendingSongs.length === 0 ? /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                  className: "w-full h-[300px] bg-white/[0.02] rounded-3xl animate-pulse mx-8 mt-6"
                }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(TopThreeHeader_default, {
                  trendingSongs: trendingSongs.length >= 3 ? trendingSongs : homeContent?.trending_songs || recommendations || [],
                  resolveUrl: resolveUrl2,
                  onPlay: handleGlobalPlay
                }, undefined, false, undefined, this)
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                className: "p-4 md:p-8 max-w-[1400px] mx-auto space-y-8 md:space-y-10 mt-4 md:mt-0",
                children: [
                  /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                    className: "animate-slide-up",
                    children: recentSongs.length > 0 && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(jsx_dev_runtime26.Fragment, {
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(SectionHeader_default, {
                          title: "Quick Picks",
                          icon: Clock,
                          subtitle: "Jump back in"
                        }, undefined, false, undefined, this),
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                          className: "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-4",
                          children: recentSongs.slice(0, 8).map((song) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(QuickPickCard_default, {
                            song,
                            onClick: () => playSong(song, recentSongs),
                            resolveUrl: resolveUrl2
                          }, `qp-${song.song_id}`, false, undefined, this))
                        }, undefined, false, undefined, this)
                      ]
                    }, undefined, true, undefined, this)
                  }, undefined, false, undefined, this),
                  (loadingStates.home || homeContent?.featured_playlists?.length > 0) && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                    className: "animate-slide-up",
                    style: { animationDelay: "0.05s" },
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(SectionHeader_default, {
                        title: "Featured Playlists",
                        icon: Sparkles,
                        subtitle: "Curated playlists just for you"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(HorizontalCarousel_default, {
                        children: loadingStates.home ? [...Array(6)].map((_, i) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                          className: "w-44 shrink-0",
                          children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(CardSkeleton, {}, undefined, false, undefined, this)
                        }, i, false, undefined, this)) : homeContent?.featured_playlists?.map((pl) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(ContentCard_default, {
                          image: pl.cover_image_url,
                          title: pl.name,
                          subtitle: `${pl.song_count || ""} songs`,
                          onClick: () => navigate(`/dashboard/saavn-playlist/${pl.id}`)
                        }, pl.id, false, undefined, this))
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this),
                  (loadingStates.recent || recentSongs.length > 0) && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                    className: "animate-slide-up",
                    style: { animationDelay: "0.1s" },
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(SectionHeader_default, {
                        title: "Recently Played",
                        icon: Clock
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(HorizontalCarousel_default, {
                        children: loadingStates.recent ? [...Array(5)].map((_, i) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                          className: "w-44 shrink-0",
                          children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(CardSkeleton, {}, undefined, false, undefined, this)
                        }, i, false, undefined, this)) : recentSongs.slice(0, 10).map((song) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(ContentCard_default, {
                          image: resolveUrl2(song.cover_image_url),
                          title: song.title,
                          subtitle: song.artist_name,
                          onClick: () => playSong(song, recentSongs),
                          onAddToQueue: () => handleAddToQueue(song)
                        }, `recent-${song.song_id}`, false, undefined, this))
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this),
                  (loadingStates.recommendations || recommendations.length > 0) && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                    className: "animate-slide-up",
                    style: { animationDelay: "0.2s" },
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(SectionHeader_default, {
                        title: `Made For ${currentUser.username}`,
                        icon: Headphones,
                        subtitle: "Based on your listening taste"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(HorizontalCarousel_default, {
                        children: loadingStates.recommendations ? [...Array(5)].map((_, i) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                          className: "w-44 shrink-0",
                          children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(CardSkeleton, {}, undefined, false, undefined, this)
                        }, i, false, undefined, this)) : recommendations.map((song, i) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(ContentCard_default, {
                          image: song.cover_image_url,
                          title: song.title,
                          subtitle: song.artist_name,
                          onClick: () => handleGlobalPlay(song),
                          onAddToQueue: () => handleAddToQueue(song)
                        }, `rec-${song.saavn_id || song.song_id}-${i}`, false, undefined, this))
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this),
                  (loadingStates.home || homeContent?.new_releases?.length > 0) && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                    className: "animate-slide-up",
                    style: { animationDelay: "0.25s" },
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(SectionHeader_default, {
                        title: "New Releases",
                        icon: Disc3,
                        subtitle: "Latest albums to explore"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(HorizontalCarousel_default, {
                        children: loadingStates.home ? [...Array(5)].map((_, i) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                          className: "w-44 shrink-0",
                          children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(CardSkeleton, {}, undefined, false, undefined, this)
                        }, i, false, undefined, this)) : homeContent?.new_releases?.map((album) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(ContentCard_default, {
                          image: album.cover_image_url,
                          title: album.name,
                          subtitle: album.artist_name,
                          onClick: () => navigate(`/dashboard/album/saavn_${album.id}`)
                        }, `album-${album.id}`, false, undefined, this))
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this),
                  (loadingStates.home || homeContent?.trending_songs?.length > 0) && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                    className: "animate-slide-up",
                    style: { animationDelay: "0.3s" },
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(SectionHeader_default, {
                        title: "Popular Right Now",
                        icon: TrendingUp,
                        subtitle: "From millions of listeners"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(HorizontalCarousel_default, {
                        children: loadingStates.home ? [...Array(5)].map((_, i) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                          className: "w-44 shrink-0",
                          children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(CardSkeleton, {}, undefined, false, undefined, this)
                        }, i, false, undefined, this)) : homeContent?.trending_songs?.map((song) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(ContentCard_default, {
                          image: song.cover_image_url,
                          title: song.title,
                          subtitle: song.artist_name,
                          onClick: () => handleGlobalPlay(song),
                          onAddToQueue: () => handleAddToQueue(song)
                        }, `pop-${song.saavn_id}`, false, undefined, this))
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this),
                  homeContent?.personalized_mixes?.map((mix2, midx) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                    className: "animate-slide-up",
                    style: { animationDelay: `${0.35 + midx * 0.05}s` },
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(SectionHeader_default, {
                        title: mix2.title,
                        icon: mix2.type === "artist" ? Headphones : Sparkles,
                        subtitle: mix2.type === "artist" ? "Songs you might love" : "Curated for your taste"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(HorizontalCarousel_default, {
                        children: mix2.songs.map((song) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(ContentCard_default, {
                          image: song.cover_image_url,
                          title: song.title,
                          subtitle: song.artist_name,
                          onClick: () => handleGlobalPlay(song),
                          onAddToQueue: () => handleAddToQueue(song)
                        }, `pmix-${song.saavn_id}`, false, undefined, this))
                      }, undefined, false, undefined, this)
                    ]
                  }, `mix-${mix2.key}`, true, undefined, this)),
                  followedArtists.length > 0 && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                    className: "animate-slide-up",
                    style: { animationDelay: "0.35s" },
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(SectionHeader_default, {
                        title: "Your Artists",
                        icon: Users
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(HorizontalCarousel_default, {
                        children: followedArtists.map((artist) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(ContentCard_default, {
                          image: resolveUrl2(artist.avatar_url),
                          title: artist.artist_name,
                          subtitle: "Artist",
                          isRound: true,
                          onClick: () => navigate(`/dashboard/artist/${artist.artist_id}`)
                        }, `fa-${artist.artist_id}`, false, undefined, this))
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this)
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this),
          currentView === "stats" && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(ListenerStats_default, {}, undefined, false, undefined, this),
          currentView === "library" && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
            className: "flex-1 overflow-y-auto relative pb-[10rem] md:pb-32 animate-fade-in custom-scrollbar",
            children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
              className: "p-4 md:p-8 max-w-7xl mx-auto",
              children: [
                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("h1", {
                  className: "text-3xl md:text-5xl font-black mb-8 md:mb-12 tracking-tight flex items-center gap-5 pt-4 text-white drop-shadow-lg",
                  children: "Your Library"
                }, undefined, false, undefined, this),
                (playlists?.length > 0 || likedPlaylists?.length > 0) && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                  className: "mb-14 animate-slide-up",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("h2", {
                      className: "text-xl md:text-2xl font-bold mb-6 tracking-tight text-brand-primary",
                      children: "Playlists"
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                      className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6",
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                          onClick: handleCreatePlaylist,
                          className: "cursor-pointer group flex flex-col",
                          children: [
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                              className: "aspect-square bg-white/[0.02] border border-white/5 border-dashed rounded-2xl shadow-xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-white/[0.05] group-hover:border-white/20 transition-all",
                              children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Plus, {
                                className: "w-8 h-8 md:w-12 md:h-12 text-white/30 group-hover:scale-110 transition-transform"
                              }, undefined, false, undefined, this)
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("h3", {
                              className: "font-bold text-sm md:text-lg truncate mb-0.5 md:mb-1 text-white",
                              children: "Create New"
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("p", {
                              className: "text-xs md:text-sm font-medium text-brand-muted shrink-0",
                              children: "Local Playlist"
                            }, undefined, false, undefined, this)
                          ]
                        }, undefined, true, undefined, this),
                        playlists?.map((pl) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                          onClick: () => navigate(`/dashboard/playlist/${pl.playlist_id}`),
                          className: "cursor-pointer group flex flex-col",
                          children: [
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                              className: "aspect-square bg-gradient-to-tr from-brand-accent/20 to-brand-primary/10 rounded-2xl shadow-xl flex items-center justify-center mb-3 md:mb-4 border border-white/5 group-hover:border-white/20 group-hover:scale-105 transition-all",
                              children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Music, {
                                className: "w-10 h-10 md:w-16 md:h-16 text-white/20 drop-shadow-md"
                              }, undefined, false, undefined, this)
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("h3", {
                              className: "font-bold text-sm md:text-lg truncate mb-0.5 md:mb-1 text-white",
                              children: pl.title
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("p", {
                              className: "text-xs md:text-sm font-medium text-brand-muted shrink-0",
                              children: [
                                "By ",
                                user.username || "You"
                              ]
                            }, undefined, true, undefined, this)
                          ]
                        }, `local-${pl.playlist_id}`, true, undefined, this)),
                        likedPlaylists?.map((pl) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                          onClick: () => navigate(`/dashboard/saavn-playlist/${pl.saavn_playlist_id}`),
                          className: "cursor-pointer group flex flex-col",
                          children: [
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                              className: "aspect-square bg-gradient-to-br from-indigo-500/20 to-purple-500/10 rounded-2xl shadow-xl flex items-center justify-center mb-3 md:mb-4 border border-white/5 group-hover:border-white/20 group-hover:scale-105 transition-all relative overflow-hidden",
                              children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Library, {
                                className: "w-10 h-10 md:w-16 md:h-16 text-indigo-400/40 drop-shadow-md"
                              }, undefined, false, undefined, this)
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("h3", {
                              className: "font-bold text-sm md:text-lg truncate mb-0.5 md:mb-1 text-white",
                              children: pl.title
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("p", {
                              className: "text-xs md:text-sm font-medium text-brand-muted shrink-0",
                              children: "Saved Playlist"
                            }, undefined, false, undefined, this)
                          ]
                        }, `saavn-${pl.saavn_playlist_id}`, true, undefined, this))
                      ]
                    }, undefined, true, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                  className: "animate-slide-up",
                  style: { animationDelay: "0.1s" },
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("h2", {
                      className: "text-xl md:text-2xl font-bold mb-6 tracking-tight text-brand-primary flex items-center gap-3",
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Heart, {
                          className: "w-6 h-6 text-brand-accent-hot fill-current"
                        }, undefined, false, undefined, this),
                        "Liked Tracks"
                      ]
                    }, undefined, true, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                      className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
                      children: [
                        isLoading ? [...Array(6)].map((_, i) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(SongSkeleton, {}, i, false, undefined, this)) : likedSongsData?.map((song) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(SongCard_default, {
                          song
                        }, song.song_id, false, undefined, this)),
                        !isLoading && (!likedSongsData || likedSongsData.length === 0) && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                          className: "col-span-full py-20 text-center rounded-2xl border-dashed border-white/[0.05] bg-brand-surface mt-4",
                          children: [
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Heart, {
                              className: "w-12 h-12 mx-auto mb-6 text-brand-muted opacity-50"
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("p", {
                              className: "text-xl font-medium text-brand-primary",
                              children: "Your library is quiet..."
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("p", {
                              className: "text-sm text-brand-muted mt-2 mb-8",
                              children: "Start liking songs to build your personal collection."
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("button", {
                              onClick: () => navigate("/search"),
                              className: "btn-primary inline-flex items-center gap-2",
                              children: [
                                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Search, {
                                  className: "w-4 h-4"
                                }, undefined, false, undefined, this),
                                "Discover Tracks"
                              ]
                            }, undefined, true, undefined, this)
                          ]
                        }, undefined, true, undefined, this)
                      ]
                    }, undefined, true, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              ]
            }, undefined, true, undefined, this)
          }, undefined, false, undefined, this),
          currentView === "playlist" && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
            className: "flex-1 overflow-y-auto relative pb-[10rem] md:pb-32 animate-fade-in custom-scrollbar",
            children: isLoading ? /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
              className: "p-4 md:p-8 pt-10 md:pt-20",
              children: [
                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                  className: "flex flex-col md:flex-row items-center md:items-end gap-6 mb-12",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Skeleton_default, {
                      className: "w-40 h-40 md:w-48 md:h-48 rounded-2xl"
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                      className: "space-y-4 w-full flex flex-col items-center md:items-start",
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Skeleton_default, {
                          className: "w-20 h-4"
                        }, undefined, false, undefined, this),
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Skeleton_default, {
                          className: "w-64 h-8 md:h-12"
                        }, undefined, false, undefined, this),
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Skeleton_default, {
                          className: "w-full max-w-[20rem] md:w-96 h-4 md:h-6"
                        }, undefined, false, undefined, this)
                      ]
                    }, undefined, true, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                  className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5",
                  children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(SongSkeleton, {}, i, false, undefined, this))
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this) : playlistInfo && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(jsx_dev_runtime26.Fragment, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                  className: "absolute top-0 w-full h-[24rem] md:h-[32rem] bg-gradient-to-b from-brand-accent/20 to-transparent pointer-events-none"
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                  className: "p-4 md:p-8 relative z-10",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                      className: "flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 mb-8 md:mb-12 animate-slide-up text-center md:text-left",
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                          className: "w-48 h-48 md:w-56 md:h-56 glass-surface rounded-2xl shadow-2xl flex items-center justify-center group overflow-hidden shrink-0 mt-4 md:mt-0",
                          children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Music, {
                            className: "w-20 h-20 md:w-24 md:h-24 text-white/10 group-hover:scale-110 transition-transform duration-700"
                          }, undefined, false, undefined, this)
                        }, undefined, false, undefined, this),
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                          className: "pb-2",
                          children: [
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("span", {
                              className: "text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent mb-2 md:mb-3 block",
                              children: "Playlist"
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("h1", {
                              className: "text-4xl md:text-7xl font-black tracking-tighter mb-2 md:mb-4",
                              children: playlistInfo.title
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("p", {
                              className: "text-white/50 text-sm md:text-lg font-medium max-w-2xl leading-relaxed px-4 md:px-0",
                              children: playlistInfo.description || "A curated collection of your favorite tracks on Wave."
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                              className: "flex items-center justify-center md:justify-start gap-3 mt-4 md:mt-6 text-xs md:text-sm font-bold",
                              children: [
                                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                                  className: "w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center text-[10px] text-brand-dark",
                                  children: user.username?.charAt(0)
                                }, undefined, false, undefined, this),
                                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("span", {
                                  className: "text-white/90",
                                  children: user.username
                                }, undefined, false, undefined, this),
                                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("span", {
                                  className: "text-white/20",
                                  children: "•"
                                }, undefined, false, undefined, this),
                                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("span", {
                                  className: "text-white/40",
                                  children: [
                                    playlistInfo.songs?.length || 0,
                                    " songs"
                                  ]
                                }, undefined, true, undefined, this)
                              ]
                            }, undefined, true, undefined, this)
                          ]
                        }, undefined, true, undefined, this)
                      ]
                    }, undefined, true, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                      className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 animate-slide-up",
                      style: { animationDelay: "0.1s" },
                      children: [
                        playlistInfo.songs?.map((song) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(SongCard_default, {
                          song
                        }, song.song_id, false, undefined, this)),
                        playlistInfo.songs?.length === 0 && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                          className: "col-span-full py-32 text-center glass-panel border-white/5 bg-white/[0.01]",
                          children: [
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Music, {
                              className: "w-16 h-16 mx-auto mb-4 opacity-10"
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("p", {
                              className: "text-lg font-bold text-white/40",
                              children: "This playlist is empty."
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Link, {
                              to: "/search",
                              className: "text-brand-primary hover:underline font-bold text-sm mt-4 inline-block",
                              children: "Find songs to add"
                            }, undefined, false, undefined, this)
                          ]
                        }, undefined, true, undefined, this)
                      ]
                    }, undefined, true, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              ]
            }, undefined, true, undefined, this)
          }, undefined, false, undefined, this),
          currentView === "artist-profile" && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
            className: "flex-1 overflow-y-auto relative pb-[10rem] md:pb-32 animate-fade-in custom-scrollbar",
            children: isLoading ? /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
              className: "animate-pulse",
              children: [
                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                  className: "h-64 md:h-80 bg-white/5 w-full"
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                  className: "p-4 md:p-8",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                      className: "flex justify-center md:justify-start gap-4 mb-8 md:mb-10 mt-[-2rem] md:mt-0 relative z-10",
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Skeleton_default, {
                          variant: "circle",
                          className: "h-14 w-14"
                        }, undefined, false, undefined, this),
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Skeleton_default, {
                          className: "w-32 h-14 rounded-full"
                        }, undefined, false, undefined, this)
                      ]
                    }, undefined, true, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Skeleton_default, {
                      className: "w-48 h-8 mb-6 md:mb-8 mx-auto md:mx-0"
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                      className: "grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5",
                      children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(SongSkeleton, {}, i, false, undefined, this))
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              ]
            }, undefined, true, undefined, this) : artistProfileData && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(jsx_dev_runtime26.Fragment, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                  className: "relative h-[20rem] md:h-[28rem] w-full",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                      className: "absolute inset-0 bg-gradient-to-b from-brand-accent/30 to-brand-dark z-0"
                    }, undefined, false, undefined, this),
                    artistProfileData.banner_url ? /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("img", {
                      src: artistProfileData.banner_url,
                      alt: "banner",
                      className: "w-full h-full object-cover relative z-[-1]"
                    }, undefined, false, undefined, this) : artistProfileData.songs?.[0]?.cover_image_url ? /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("img", {
                      src: resolveUrl2(artistProfileData.songs[0].cover_image_url),
                      alt: "fallback-banner",
                      className: "w-full h-full object-cover relative z-[-1] opacity-50 blur-md saturate-150"
                    }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                      className: "w-full h-full bg-gradient-to-tr from-brand-accent/20 to-brand-primary/10 relative z-[-1]"
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                      className: "absolute bottom-0 left-0 p-4 md:p-12 w-full bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent z-10 transition-all duration-700",
                      children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                        className: "flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-8 text-center md:text-left translate-y-8 md:translate-y-0",
                        children: [
                          artistProfileData.avatar_url || artistProfileData.songs?.[0]?.cover_image_url ? /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("img", {
                            src: artistProfileData.avatar_url || resolveUrl2(artistProfileData.songs[0].cover_image_url),
                            alt: "avatar",
                            className: "w-32 h-32 md:w-48 md:h-48 rounded-full shadow-2xl ring-4 ring-white/10 object-cover shrink-0 animate-slide-up"
                          }, undefined, false, undefined, this) : null,
                          /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                            children: [
                              /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("h1", {
                                className: "text-4xl md:text-8xl font-black tracking-tighter mb-2 md:mb-4 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-slide-up",
                                style: { animationDelay: "0.05s" },
                                children: artistProfileData.username
                              }, undefined, false, undefined, this),
                              /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("p", {
                                className: "text-sm md:text-lg text-white/70 max-w-3xl font-medium leading-relaxed drop-shadow-md animate-slide-up px-4 md:px-0",
                                style: { animationDelay: "0.1s" },
                                children: artistProfileData.bio || "Artist"
                              }, undefined, false, undefined, this)
                            ]
                          }, undefined, true, undefined, this)
                        ]
                      }, undefined, true, undefined, this)
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                  className: "p-4 md:p-8 relative z-10 mt-10 md:mt-0",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                      className: "flex items-center justify-center md:justify-start gap-6 md:gap-8 mb-10 md:mb-14 animate-slide-up",
                      style: { animationDelay: "0.2s" },
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("button", {
                          className: "w-14 h-14 bg-brand-primary rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all text-brand-dark",
                          children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Play, {
                            className: "w-7 h-7 fill-current ml-1"
                          }, undefined, false, undefined, this)
                        }, undefined, false, undefined, this),
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("button", {
                          onClick: () => handleToggleFollow(artistProfileData.artist_id),
                          className: `px-8 py-3 rounded-full border font-bold transition-all uppercase tracking-widest text-[10px] ${isFollowing ? "border-brand-primary/30 bg-brand-primary/10 text-brand-primary" : "border-white/10 hover:bg-white/5"}`,
                          children: isFollowing ? "Following" : "Follow"
                        }, undefined, false, undefined, this)
                      ]
                    }, undefined, true, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                      className: "space-y-4 md:space-y-6 animate-slide-up",
                      style: { animationDelay: "0.3s" },
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("h2", {
                          className: "text-lg md:text-xl font-bold flex items-center gap-3 tracking-tight",
                          children: [
                            "Discography",
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                              className: "h-px flex-1 bg-white/5"
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("span", {
                              className: "text-white/20 font-bold text-[10px] md:text-xs tracking-widest uppercase",
                              children: [
                                artistProfileData.songs?.length || 0,
                                " tracks"
                              ]
                            }, undefined, true, undefined, this)
                          ]
                        }, undefined, true, undefined, this),
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                          className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4",
                          children: [
                            artistProfileData.songs?.map((song) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(SongCard_default, {
                              song: { ...song, artist_name: artistProfileData.username, artist_id: artistProfileData.artist_id }
                            }, song.song_id, false, undefined, this)),
                            (!artistProfileData.songs || artistProfileData.songs.length === 0) && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                              className: "col-span-full py-32 text-center glass-panel border-white/5 bg-white/[0.01]",
                              children: [
                                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Music, {
                                  className: "w-16 h-16 mx-auto mb-4 opacity-10"
                                }, undefined, false, undefined, this),
                                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("p", {
                                  className: "text-xl font-bold text-white/30",
                                  children: "Quiet stage..."
                                }, undefined, false, undefined, this),
                                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("p", {
                                  className: "text-sm text-white/20 mt-2",
                                  children: "This artist hasn't published any tracks yet."
                                }, undefined, false, undefined, this)
                              ]
                            }, undefined, true, undefined, this)
                          ]
                        }, undefined, true, undefined, this)
                      ]
                    }, undefined, true, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              ]
            }, undefined, true, undefined, this)
          }, undefined, false, undefined, this),
          currentView === "saavn-artist" && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
            className: "flex-1 overflow-y-auto relative pb-[10rem] md:pb-32 animate-fade-in custom-scrollbar",
            children: isLoading ? /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
              className: "animate-pulse",
              children: [
                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                  className: "h-64 md:h-80 bg-white/5 w-full"
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                  className: "p-4 md:p-8",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Skeleton_default, {
                      className: "w-48 md:w-64 h-8 md:h-10 mb-4 md:mb-6"
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                      className: "grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5",
                      children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(SongSkeleton, {}, i, false, undefined, this))
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              ]
            }, undefined, true, undefined, this) : saavnArtist && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(jsx_dev_runtime26.Fragment, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                  className: "relative h-[20rem] md:h-[24rem] w-full",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                      className: "absolute inset-0 bg-gradient-to-b from-white/[0.06] to-brand-dark z-0"
                    }, undefined, false, undefined, this),
                    saavnArtist.image && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("img", {
                      src: saavnArtist.image,
                      alt: "",
                      className: "w-full h-full object-cover relative z-[-1] opacity-40 blur-sm scale-110"
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                      className: "absolute bottom-0 left-0 p-4 md:p-12 w-full bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent z-10 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-8 text-center md:text-left translate-y-6 md:translate-y-0",
                      children: [
                        saavnArtist.image && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("img", {
                          src: saavnArtist.image,
                          alt: saavnArtist.name,
                          className: "w-32 h-32 md:w-48 md:h-48 rounded-full shadow-2xl ring-4 ring-white/10 object-cover shrink-0"
                        }, undefined, false, undefined, this),
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                          children: [
                            saavnArtist.is_verified && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("span", {
                              className: "inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/20 text-sky-400 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 md:mb-3",
                              children: "✓ Verified Artist"
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("h1", {
                              className: "text-4xl md:text-6xl font-black tracking-tighter mb-1 md:mb-2",
                              children: saavnArtist.name
                            }, undefined, false, undefined, this),
                            saavnArtist.fan_count > 0 && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("p", {
                              className: "text-xs md:text-sm text-brand-muted font-medium",
                              children: [
                                Number(saavnArtist.fan_count).toLocaleString(),
                                " followers"
                              ]
                            }, undefined, true, undefined, this)
                          ]
                        }, undefined, true, undefined, this)
                      ]
                    }, undefined, true, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                  className: "p-4 md:p-8 mt-8 md:mt-0",
                  children: [
                    saavnArtist.top_songs?.length > 0 && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                      className: "mb-12 animate-slide-up",
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("h2", {
                          className: "text-xl font-bold mb-5 text-brand-primary",
                          children: "Popular"
                        }, undefined, false, undefined, this),
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                          className: "space-y-1",
                          children: saavnArtist.top_songs.map((song, idx) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                            onClick: () => handleGlobalPlay(song, saavnArtist.top_songs),
                            className: "flex items-center gap-4 p-3 rounded-lg hover:bg-white/[0.04] transition-all group cursor-pointer",
                            children: [
                              /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("span", {
                                className: "w-6 text-center text-sm font-bold text-brand-muted tabular-nums",
                                children: idx + 1
                              }, undefined, false, undefined, this),
                              /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                                className: "w-11 h-11 rounded-md overflow-hidden shrink-0 bg-brand-dark relative",
                                children: [
                                  /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("img", {
                                    src: song.cover_image_url,
                                    alt: "",
                                    className: "w-full h-full object-cover"
                                  }, undefined, false, undefined, this),
                                  /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                                    className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
                                    children: importingId === song.saavn_id ? /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(LoaderCircle, {
                                      className: "w-4 h-4 animate-spin text-white"
                                    }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Play, {
                                      className: "w-4 h-4 text-white fill-current"
                                    }, undefined, false, undefined, this)
                                  }, undefined, false, undefined, this)
                                ]
                              }, undefined, true, undefined, this),
                              /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                                className: "flex-1 min-w-0",
                                children: [
                                  /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                                    className: "text-sm font-semibold text-brand-primary truncate",
                                    children: song.title
                                  }, undefined, false, undefined, this),
                                  /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                                    className: "text-xs text-brand-muted truncate",
                                    children: song.album_name
                                  }, undefined, false, undefined, this)
                                ]
                              }, undefined, true, undefined, this),
                              /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("button", {
                                onClick: (e) => {
                                  e.stopPropagation();
                                  handleAddToQueue(song);
                                },
                                className: "w-10 h-10 flex items-center justify-center rounded-full text-brand-muted hover:text-brand-primary opacity-0 group-hover:opacity-100 transition-all duration-200",
                                title: "Add to Queue",
                                children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Plus, {
                                  className: "w-4 h-4"
                                }, undefined, false, undefined, this)
                              }, undefined, false, undefined, this),
                              /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("span", {
                                className: "text-xs text-brand-muted font-medium tabular-nums",
                                children: formatTime2(song.duration)
                              }, undefined, false, undefined, this)
                            ]
                          }, song.saavn_id || idx, true, undefined, this))
                        }, undefined, false, undefined, this)
                      ]
                    }, undefined, true, undefined, this),
                    saavnArtist.top_albums?.length > 0 && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                      className: "animate-slide-up",
                      style: { animationDelay: "0.1s" },
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(SectionHeader_default, {
                          title: "Albums"
                        }, undefined, false, undefined, this),
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(HorizontalCarousel_default, {
                          children: saavnArtist.top_albums.map((album) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(ContentCard_default, {
                            image: album.cover_image_url,
                            title: album.name,
                            subtitle: album.year,
                            onClick: () => navigate(`/dashboard/album/saavn_${album.id}`)
                          }, album.id, false, undefined, this))
                        }, undefined, false, undefined, this)
                      ]
                    }, undefined, true, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              ]
            }, undefined, true, undefined, this)
          }, undefined, false, undefined, this),
          currentView === "saavn-album" && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
            className: "flex-1 overflow-y-auto relative pb-[10rem] md:pb-32 animate-fade-in custom-scrollbar",
            children: isLoading ? /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
              className: "p-4 md:p-8 pt-10 md:pt-20 animate-pulse",
              children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                className: "flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 mb-8 md:mb-12",
                children: [
                  /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Skeleton_default, {
                    className: "w-48 h-48 md:w-52 md:h-52 rounded-2xl"
                  }, undefined, false, undefined, this),
                  /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                    className: "space-y-4 w-full flex flex-col items-center md:items-start",
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Skeleton_default, {
                        className: "w-20 h-4"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Skeleton_default, {
                        className: "w-64 h-8 md:h-10"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Skeleton_default, {
                        className: "w-40 h-4 md:h-5"
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this)
                ]
              }, undefined, true, undefined, this)
            }, undefined, false, undefined, this) : saavnAlbum && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(jsx_dev_runtime26.Fragment, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                  className: "absolute top-0 w-full h-[24rem] md:h-[30rem] bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none"
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                  className: "p-4 md:p-8 relative z-10",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                      className: "flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 mb-8 md:mb-10 animate-slide-up text-center md:text-left",
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                          className: "w-48 h-48 md:w-56 md:h-56 rounded-2xl shadow-2xl overflow-hidden shrink-0 mt-4 md:mt-0",
                          children: saavnAlbum.cover_image_url ? /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("img", {
                            src: saavnAlbum.cover_image_url,
                            alt: "",
                            className: "w-full h-full object-cover"
                          }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                            className: "w-full h-full bg-brand-surface flex items-center justify-center",
                            children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Disc3, {
                              className: "w-16 h-16 md:w-20 md:h-20 text-white/10"
                            }, undefined, false, undefined, this)
                          }, undefined, false, undefined, this)
                        }, undefined, false, undefined, this),
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                          className: "pb-2",
                          children: [
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("span", {
                              className: "text-[10px] font-black uppercase tracking-[0.3em] text-brand-muted mb-2 md:mb-3 block",
                              children: "Album"
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("h1", {
                              className: "text-4xl md:text-5xl font-black tracking-tighter mb-2 md:mb-3",
                              children: saavnAlbum.name
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("p", {
                              className: "text-sm md:text-lg text-brand-muted font-medium",
                              children: saavnAlbum.artist_name
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                              className: "flex items-center justify-center md:justify-start gap-3 mt-3 md:mt-4 text-[10px] md:text-xs font-bold text-brand-muted",
                              children: [
                                saavnAlbum.year && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("span", {
                                  children: saavnAlbum.year
                                }, undefined, false, undefined, this),
                                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("span", {
                                  children: "•"
                                }, undefined, false, undefined, this),
                                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("span", {
                                  children: [
                                    saavnAlbum.song_count || saavnAlbum.songs?.length || 0,
                                    " songs"
                                  ]
                                }, undefined, true, undefined, this)
                              ]
                            }, undefined, true, undefined, this)
                          ]
                        }, undefined, true, undefined, this)
                      ]
                    }, undefined, true, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                      className: "space-y-1 animate-slide-up",
                      style: { animationDelay: "0.1s" },
                      children: saavnAlbum.songs?.map((song, idx) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                        onClick: () => handleGlobalPlay(song, saavnAlbum.songs),
                        className: "flex items-center gap-4 p-3 rounded-lg hover:bg-white/[0.04] transition-all group cursor-pointer",
                        children: [
                          /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("span", {
                            className: "w-6 text-center text-sm font-bold text-brand-muted tabular-nums",
                            children: idx + 1
                          }, undefined, false, undefined, this),
                          /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                            className: "w-10 h-10 rounded-md overflow-hidden shrink-0 bg-brand-dark relative",
                            children: [
                              /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("img", {
                                src: song.cover_image_url,
                                alt: "",
                                className: "w-full h-full object-cover"
                              }, undefined, false, undefined, this),
                              /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                                className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
                                children: importingId === song.saavn_id ? /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(LoaderCircle, {
                                  className: "w-4 h-4 animate-spin text-white"
                                }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Play, {
                                  className: "w-4 h-4 text-white fill-current"
                                }, undefined, false, undefined, this)
                              }, undefined, false, undefined, this)
                            ]
                          }, undefined, true, undefined, this),
                          /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                            className: "flex-1 min-w-0",
                            children: [
                              /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                                className: "text-sm font-semibold text-brand-primary truncate",
                                children: song.title
                              }, undefined, false, undefined, this),
                              /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                                className: "text-xs text-brand-muted truncate",
                                children: song.artist_name
                              }, undefined, false, undefined, this)
                            ]
                          }, undefined, true, undefined, this),
                          /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("button", {
                            onClick: (e) => {
                              e.stopPropagation();
                              handleAddToQueue(song);
                            },
                            className: "w-10 h-10 flex items-center justify-center rounded-full text-brand-muted hover:text-brand-primary opacity-0 group-hover:opacity-100 transition-all duration-200",
                            title: "Add to Queue",
                            children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Plus, {
                              className: "w-4 h-4"
                            }, undefined, false, undefined, this)
                          }, undefined, false, undefined, this),
                          /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("span", {
                            className: "text-xs text-brand-muted font-medium tabular-nums",
                            children: formatTime2(song.duration)
                          }, undefined, false, undefined, this)
                        ]
                      }, song.saavn_id || idx, true, undefined, this))
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              ]
            }, undefined, true, undefined, this)
          }, undefined, false, undefined, this),
          currentView === "saavn-playlist" && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
            className: "flex-1 overflow-y-auto relative pb-[10rem] md:pb-32 animate-fade-in custom-scrollbar",
            children: isLoading ? /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
              className: "p-4 md:p-8 pt-10 md:pt-20 animate-pulse",
              children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                className: "flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 mb-8 md:mb-12",
                children: [
                  /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Skeleton_default, {
                    className: "w-48 h-48 md:w-52 md:h-52 rounded-2xl"
                  }, undefined, false, undefined, this),
                  /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                    className: "space-y-4 w-full flex flex-col items-center md:items-start",
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Skeleton_default, {
                        className: "w-20 h-4"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Skeleton_default, {
                        className: "w-64 h-8 md:h-10"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Skeleton_default, {
                        className: "w-full max-w-[20rem] md:w-96 h-4 md:h-5"
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this)
                ]
              }, undefined, true, undefined, this)
            }, undefined, false, undefined, this) : saavnPlaylist && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(jsx_dev_runtime26.Fragment, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                  className: "absolute top-0 w-full h-[24rem] md:h-[30rem] bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none"
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                  className: "p-4 md:p-8 relative z-10",
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                      className: "flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 mb-8 md:mb-10 animate-slide-up text-center md:text-left",
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                          className: "w-48 h-48 md:w-56 md:h-56 rounded-2xl shadow-2xl overflow-hidden shrink-0 mt-4 md:mt-0",
                          children: saavnPlaylist.cover_image_url ? /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("img", {
                            src: saavnPlaylist.cover_image_url,
                            alt: "",
                            className: "w-full h-full object-cover"
                          }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                            className: "w-full h-full bg-brand-surface flex items-center justify-center",
                            children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Music, {
                              className: "w-16 h-16 md:w-20 md:h-20 text-white/10"
                            }, undefined, false, undefined, this)
                          }, undefined, false, undefined, this)
                        }, undefined, false, undefined, this),
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                          className: "pb-2",
                          children: [
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("span", {
                              className: "text-[10px] font-black uppercase tracking-[0.3em] text-brand-muted mb-2 md:mb-3 block",
                              children: "Playlist"
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("h1", {
                              className: "text-4xl md:text-5xl font-black tracking-tighter mb-2 md:mb-3",
                              children: saavnPlaylist.name
                            }, undefined, false, undefined, this),
                            saavnPlaylist.description && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("p", {
                              className: "text-xs md:text-base text-brand-muted font-medium max-w-2xl px-4 md:px-0",
                              children: saavnPlaylist.description
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                              className: "flex items-center justify-center md:justify-start gap-3 mt-3 md:mt-4 text-[10px] md:text-xs font-bold text-brand-muted",
                              children: [
                                /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("span", {
                                  children: [
                                    saavnPlaylist.song_count || saavnPlaylist.songs?.length || 0,
                                    " songs"
                                  ]
                                }, undefined, true, undefined, this),
                                saavnPlaylist.fan_count > 0 && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(jsx_dev_runtime26.Fragment, {
                                  children: [
                                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("span", {
                                      children: "•"
                                    }, undefined, false, undefined, this),
                                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("span", {
                                      children: [
                                        Number(saavnPlaylist.fan_count).toLocaleString(),
                                        " likes"
                                      ]
                                    }, undefined, true, undefined, this)
                                  ]
                                }, undefined, true, undefined, this)
                              ]
                            }, undefined, true, undefined, this)
                          ]
                        }, undefined, true, undefined, this)
                      ]
                    }, undefined, true, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                      className: "mb-6 md:mb-8 flex items-center justify-center md:justify-start gap-4 animate-slide-up",
                      style: { animationDelay: "0.05s" },
                      children: [
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("button", {
                          onClick: () => saavnPlaylist.songs?.[0] && handleGlobalPlay(saavnPlaylist.songs[0], saavnPlaylist.songs),
                          className: "w-12 h-12 md:w-14 md:h-14 bg-brand-primary rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all text-brand-dark",
                          title: "Play All",
                          children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Play, {
                            className: "w-6 h-6 md:w-7 md:h-7 fill-current ml-1"
                          }, undefined, false, undefined, this)
                        }, undefined, false, undefined, this),
                        /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("button", {
                          onClick: () => toggleLikePlaylist(saavnPlaylist),
                          className: "w-12 h-12 rounded-full flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.1] transition-colors",
                          title: likedPlaylists?.some((p) => p.saavn_playlist_id === saavnPlaylist.id) ? "Remove from Library" : "Save to Library",
                          children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Heart, {
                            className: `w-6 h-6 transition-colors ${likedPlaylists?.some((p) => p.saavn_playlist_id === saavnPlaylist.id) ? "fill-brand-accent text-brand-accent" : "text-brand-muted hover:text-white"}`
                          }, undefined, false, undefined, this)
                        }, undefined, false, undefined, this)
                      ]
                    }, undefined, true, undefined, this),
                    /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                      className: "space-y-1 animate-slide-up",
                      style: { animationDelay: "0.1s" },
                      children: saavnPlaylist.songs?.map((song, idx) => /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                        onClick: () => handleGlobalPlay(song, saavnPlaylist.songs),
                        className: "flex items-center gap-4 p-3 rounded-lg hover:bg-white/[0.04] transition-all group cursor-pointer",
                        children: [
                          /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("span", {
                            className: "w-6 text-center text-sm font-bold text-brand-muted tabular-nums",
                            children: idx + 1
                          }, undefined, false, undefined, this),
                          /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                            className: "w-10 h-10 rounded-md overflow-hidden shrink-0 bg-brand-dark relative",
                            children: [
                              /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("img", {
                                src: song.cover_image_url,
                                alt: "",
                                className: "w-full h-full object-cover"
                              }, undefined, false, undefined, this),
                              /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                                className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
                                children: importingId === song.saavn_id ? /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(LoaderCircle, {
                                  className: "w-4 h-4 animate-spin text-white"
                                }, undefined, false, undefined, this) : /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Play, {
                                  className: "w-4 h-4 text-white fill-current"
                                }, undefined, false, undefined, this)
                              }, undefined, false, undefined, this)
                            ]
                          }, undefined, true, undefined, this),
                          /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                            className: "flex-1 min-w-0",
                            children: [
                              /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                                className: "text-sm font-semibold text-brand-primary truncate",
                                children: song.title
                              }, undefined, false, undefined, this),
                              /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("div", {
                                className: "text-xs text-brand-muted truncate",
                                children: song.artist_name
                              }, undefined, false, undefined, this)
                            ]
                          }, undefined, true, undefined, this),
                          /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("button", {
                            onClick: (e) => {
                              e.stopPropagation();
                              handleAddToQueue(song);
                            },
                            className: "w-10 h-10 flex items-center justify-center rounded-full text-brand-muted hover:text-brand-primary opacity-0 group-hover:opacity-100 transition-all duration-200",
                            title: "Add to Queue",
                            children: /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Plus, {
                              className: "w-4 h-4"
                            }, undefined, false, undefined, this)
                          }, undefined, false, undefined, this),
                          /* @__PURE__ */ jsx_dev_runtime26.jsxDEV("span", {
                            className: "text-xs text-brand-muted font-medium tabular-nums",
                            children: formatTime2(song.duration)
                          }, undefined, false, undefined, this)
                        ]
                      }, song.saavn_id || idx, true, undefined, this))
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              ]
            }, undefined, true, undefined, this)
          }, undefined, false, undefined, this),
          currentView === "search" && /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(Search_default, {}, undefined, false, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(ProfileSettingsModal_default, {
            isOpen: isProfileModalOpen,
            onClose: () => setIsProfileModalOpen(false),
            user: currentUser,
            onUpdate: (updatedUser) => setCurrentUser(updatedUser)
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(BottomPlayer_default, {}, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this)
    ]
  }, undefined, true, undefined, this);
};
var Dashboard_default = Dashboard;
export {
  Dashboard_default as default
};
