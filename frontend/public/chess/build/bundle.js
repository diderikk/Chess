(function (l, r) {
  if (!l || l.getElementById("livereloadscript")) return;
  r = l.createElement("script");
  r.async = 1;
  r.src =
    "//" +
    (self.location.host || "localhost").split(":")[0] +
    ":35729/livereload.js?snipver=1";
  r.id = "livereloadscript";
  l.getElementsByTagName("head")[0].appendChild(r);
})(self.document);
var app = (function () {
  "use strict";

  function noop() {}
  const identity = (x) => x;
  function assign(tar, src) {
    // @ts-ignore
    for (const k in src) tar[k] = src[k];
    return tar;
  }
  function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
      loc: { file, line, column, char },
    };
  }
  function run(fn) {
    return fn();
  }
  function blank_object() {
    return Object.create(null);
  }
  function run_all(fns) {
    fns.forEach(run);
  }
  function is_function(thing) {
    return typeof thing === "function";
  }
  function safe_not_equal(a, b) {
    return a != a
      ? b == b
      : a !== b || (a && typeof a === "object") || typeof a === "function";
  }
  let src_url_equal_anchor;
  function src_url_equal(element_src, url) {
    if (!src_url_equal_anchor) {
      src_url_equal_anchor = document.createElement("a");
    }
    src_url_equal_anchor.href = url;
    return element_src === src_url_equal_anchor.href;
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
  }
  function validate_store(store, name) {
    if (store != null && typeof store.subscribe !== "function") {
      throw new Error(`'${name}' is not a store with a 'subscribe' method`);
    }
  }
  function subscribe(store, ...callbacks) {
    if (store == null) {
      return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
  }
  function get_store_value(store) {
    let value;
    subscribe(store, (_) => (value = _))();
    return value;
  }
  function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
  }
  function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
      const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
      return definition[0](slot_ctx);
    }
  }
  function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
      ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
      : $$scope.ctx;
  }
  function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
      const lets = definition[2](fn(dirty));
      if ($$scope.dirty === undefined) {
        return lets;
      }
      if (typeof lets === "object") {
        const merged = [];
        const len = Math.max($$scope.dirty.length, lets.length);
        for (let i = 0; i < len; i += 1) {
          merged[i] = $$scope.dirty[i] | lets[i];
        }
        return merged;
      }
      return $$scope.dirty | lets;
    }
    return $$scope.dirty;
  }
  function update_slot_base(
    slot,
    slot_definition,
    ctx,
    $$scope,
    slot_changes,
    get_slot_context_fn
  ) {
    if (slot_changes) {
      const slot_context = get_slot_context(
        slot_definition,
        ctx,
        $$scope,
        get_slot_context_fn
      );
      slot.p(slot_context, slot_changes);
    }
  }
  function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
      const dirty = [];
      const length = $$scope.ctx.length / 32;
      for (let i = 0; i < length; i++) {
        dirty[i] = -1;
      }
      return dirty;
    }
    return -1;
  }
  function exclude_internal_props(props) {
    const result = {};
    for (const k in props) if (k[0] !== "$") result[k] = props[k];
    return result;
  }
  function compute_rest_props(props, keys) {
    const rest = {};
    keys = new Set(keys);
    for (const k in props) if (!keys.has(k) && k[0] !== "$") rest[k] = props[k];
    return rest;
  }
  function null_to_empty(value) {
    return value == null ? "" : value;
  }
  function action_destroyer(action_result) {
    return action_result && is_function(action_result.destroy)
      ? action_result.destroy
      : noop;
  }

  const is_client = typeof window !== "undefined";
  let now = is_client ? () => window.performance.now() : () => Date.now();
  let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;

  const tasks = new Set();
  function run_tasks(now) {
    tasks.forEach((task) => {
      if (!task.c(now)) {
        tasks.delete(task);
        task.f();
      }
    });
    if (tasks.size !== 0) raf(run_tasks);
  }
  /**
   * Creates a new task that runs on each raf frame
   * until it returns a falsy value or is aborted
   */
  function loop(callback) {
    let task;
    if (tasks.size === 0) raf(run_tasks);
    return {
      promise: new Promise((fulfill) => {
        tasks.add((task = { c: callback, f: fulfill }));
      }),
      abort() {
        tasks.delete(task);
      },
    };
  }
  function append(target, node) {
    target.appendChild(node);
  }
  function get_root_for_style(node) {
    if (!node) return document;
    const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    if (root && root.host) {
      return root;
    }
    return node.ownerDocument;
  }
  function append_empty_stylesheet(node) {
    const style_element = element("style");
    append_stylesheet(get_root_for_style(node), style_element);
    return style_element.sheet;
  }
  function append_stylesheet(node, style) {
    append(node.head || node, style);
    return style.sheet;
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function detach(node) {
    node.parentNode.removeChild(node);
  }
  function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
      if (iterations[i]) iterations[i].d(detaching);
    }
  }
  function element(name) {
    return document.createElement(name);
  }
  function text(data) {
    return document.createTextNode(data);
  }
  function space() {
    return text(" ");
  }
  function empty() {
    return text("");
  }
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
  }
  function prevent_default(fn) {
    return function (event) {
      event.preventDefault();
      // @ts-ignore
      return fn.call(this, event);
    };
  }
  function attr(node, attribute, value) {
    if (value == null) node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
      node.setAttribute(attribute, value);
  }
  function children(element) {
    return Array.from(element.childNodes);
  }
  function set_input_value(input, value) {
    input.value = value == null ? "" : value;
  }
  function set_style(node, key, value, important) {
    if (value === null) {
      node.style.removeProperty(key);
    } else {
      node.style.setProperty(key, value, important ? "important" : "");
    }
  }
  function toggle_class(element, name, toggle) {
    element.classList[toggle ? "add" : "remove"](name);
  }
  function custom_event(
    type,
    detail,
    { bubbles = false, cancelable = false } = {}
  ) {
    const e = document.createEvent("CustomEvent");
    e.initCustomEvent(type, bubbles, cancelable, detail);
    return e;
  }

  // we need to store the information for multiple documents because a Svelte application could also contain iframes
  // https://github.com/sveltejs/svelte/issues/3624
  const managed_styles = new Map();
  let active = 0;
  // https://github.com/darkskyapp/string-hash/blob/master/index.js
  function hash(str) {
    let hash = 5381;
    let i = str.length;
    while (i--) hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
    return hash >>> 0;
  }
  function create_style_information(doc, node) {
    const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
    managed_styles.set(doc, info);
    return info;
  }
  function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = "{\n";
    for (let p = 0; p <= 1; p += step) {
      const t = a + (b - a) * ease(p);
      keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    const doc = get_root_for_style(node);
    const { stylesheet, rules } =
      managed_styles.get(doc) || create_style_information(doc, node);
    if (!rules[name]) {
      rules[name] = true;
      stylesheet.insertRule(
        `@keyframes ${name} ${rule}`,
        stylesheet.cssRules.length
      );
    }
    const animation = node.style.animation || "";
    node.style.animation = `${
      animation ? `${animation}, ` : ""
    }${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
  }
  function delete_rule(node, name) {
    const previous = (node.style.animation || "").split(", ");
    const next = previous.filter(
      name
        ? (anim) => anim.indexOf(name) < 0 // remove specific animation
        : (anim) => anim.indexOf("__svelte") === -1 // remove all Svelte animations
    );
    const deleted = previous.length - next.length;
    if (deleted) {
      node.style.animation = next.join(", ");
      active -= deleted;
      if (!active) clear_rules();
    }
  }
  function clear_rules() {
    raf(() => {
      if (active) return;
      managed_styles.forEach((info) => {
        const { ownerNode } = info.stylesheet;
        // there is no ownerNode if it runs on jsdom.
        if (ownerNode) detach(ownerNode);
      });
      managed_styles.clear();
    });
  }

  let current_component;
  function set_current_component(component) {
    current_component = component;
  }
  function get_current_component() {
    if (!current_component)
      throw new Error("Function called outside component initialization");
    return current_component;
  }
  function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
  }
  function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
  }
  function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail, { cancelable = false } = {}) => {
      const callbacks = component.$$.callbacks[type];
      if (callbacks) {
        // TODO are there situations where events could be dispatched
        // in a server (non-DOM) environment?
        const event = custom_event(type, detail, { cancelable });
        callbacks.slice().forEach((fn) => {
          fn.call(component, event);
        });
        return !event.defaultPrevented;
      }
      return true;
    };
  }
  function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
    return context;
  }
  function getContext(key) {
    return get_current_component().$$.context.get(key);
  }
  // TODO figure out if we still want to support
  // shorthand events, or if we want to implement
  // a real bubbling mechanism
  function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
      // @ts-ignore
      callbacks.slice().forEach((fn) => fn.call(this, event));
    }
  }

  const dirty_components = [];
  const binding_callbacks = [];
  const render_callbacks = [];
  const flush_callbacks = [];
  const resolved_promise = Promise.resolve();
  let update_scheduled = false;
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }
  function tick() {
    schedule_update();
    return resolved_promise;
  }
  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }
  function add_flush_callback(fn) {
    flush_callbacks.push(fn);
  }
  // flush() calls callbacks in this order:
  // 1. All beforeUpdate callbacks, in order: parents before children
  // 2. All bind:this callbacks, in reverse order: children before parents.
  // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
  //    for afterUpdates called during the initial onMount, which are called in
  //    reverse order: children before parents.
  // Since callbacks might update component values, which could trigger another
  // call to flush(), the following steps guard against this:
  // 1. During beforeUpdate, any updated components will be added to the
  //    dirty_components array and will cause a reentrant call to flush(). Because
  //    the flush index is kept outside the function, the reentrant call will pick
  //    up where the earlier call left off and go through all dirty components. The
  //    current_component value is saved and restored so that the reentrant call will
  //    not interfere with the "parent" flush() call.
  // 2. bind:this callbacks cannot trigger new flush() calls.
  // 3. During afterUpdate, any updated components will NOT have their afterUpdate
  //    callback called a second time; the seen_callbacks set, outside the flush()
  //    function, guarantees this behavior.
  const seen_callbacks = new Set();
  let flushidx = 0; // Do *not* move this inside the flush() function
  function flush() {
    const saved_component = current_component;
    do {
      // first, call beforeUpdate functions
      // and update components
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
      set_current_component(null);
      dirty_components.length = 0;
      flushidx = 0;
      while (binding_callbacks.length) binding_callbacks.pop()();
      // then, once components are updated, call
      // afterUpdate functions. This may cause
      // subsequent updates...
      for (let i = 0; i < render_callbacks.length; i += 1) {
        const callback = render_callbacks[i];
        if (!seen_callbacks.has(callback)) {
          // ...so guard against infinite loops
          seen_callbacks.add(callback);
          callback();
        }
      }
      render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
  }
  function update($$) {
    if ($$.fragment !== null) {
      $$.update();
      run_all($$.before_update);
      const dirty = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty);
      $$.after_update.forEach(add_render_callback);
    }
  }

  let promise;
  function wait() {
    if (!promise) {
      promise = Promise.resolve();
      promise.then(() => {
        promise = null;
      });
    }
    return promise;
  }
  function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? "intro" : "outro"}${kind}`));
  }
  const outroing = new Set();
  let outros;
  function group_outros() {
    outros = {
      r: 0,
      c: [],
      p: outros, // parent group
    };
  }
  function check_outros() {
    if (!outros.r) {
      run_all(outros.c);
    }
    outros = outros.p;
  }
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }
  function transition_out(block, local, detach, callback) {
    if (block && block.o) {
      if (outroing.has(block)) return;
      outroing.add(block);
      outros.c.push(() => {
        outroing.delete(block);
        if (callback) {
          if (detach) block.d(1);
          callback();
        }
      });
      block.o(local);
    } else if (callback) {
      callback();
    }
  }
  const null_transition = { duration: 0 };
  function create_in_transition(node, fn, params) {
    let config = fn(node, params);
    let running = false;
    let animation_name;
    let task;
    let uid = 0;
    function cleanup() {
      if (animation_name) delete_rule(node, animation_name);
    }
    function go() {
      const {
        delay = 0,
        duration = 300,
        easing = identity,
        tick = noop,
        css,
      } = config || null_transition;
      if (css)
        animation_name = create_rule(
          node,
          0,
          1,
          duration,
          delay,
          easing,
          css,
          uid++
        );
      tick(0, 1);
      const start_time = now() + delay;
      const end_time = start_time + duration;
      if (task) task.abort();
      running = true;
      add_render_callback(() => dispatch(node, true, "start"));
      task = loop((now) => {
        if (running) {
          if (now >= end_time) {
            tick(1, 0);
            dispatch(node, true, "end");
            cleanup();
            return (running = false);
          }
          if (now >= start_time) {
            const t = easing((now - start_time) / duration);
            tick(t, 1 - t);
          }
        }
        return running;
      });
    }
    let started = false;
    return {
      start() {
        if (started) return;
        started = true;
        delete_rule(node);
        if (is_function(config)) {
          config = config();
          wait().then(go);
        } else {
          go();
        }
      },
      invalidate() {
        started = false;
      },
      end() {
        if (running) {
          cleanup();
          running = false;
        }
      },
    };
  }

  const globals =
    typeof window !== "undefined"
      ? window
      : typeof globalThis !== "undefined"
      ? globalThis
      : global;

  function get_spread_update(levels, updates) {
    const update = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
      const o = levels[i];
      const n = updates[i];
      if (n) {
        for (const key in o) {
          if (!(key in n)) to_null_out[key] = 1;
        }
        for (const key in n) {
          if (!accounted_for[key]) {
            update[key] = n[key];
            accounted_for[key] = 1;
          }
        }
        levels[i] = n;
      } else {
        for (const key in o) {
          accounted_for[key] = 1;
        }
      }
    }
    for (const key in to_null_out) {
      if (!(key in update)) update[key] = undefined;
    }
    return update;
  }
  function get_spread_object(spread_props) {
    return typeof spread_props === "object" && spread_props !== null
      ? spread_props
      : {};
  }

  function bind(component, name, callback) {
    const index = component.$$.props[name];
    if (index !== undefined) {
      component.$$.bound[index] = callback;
      callback(component.$$.ctx[index]);
    }
  }
  function create_component(block) {
    block && block.c();
  }
  function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
      // onMount happens before the initial afterUpdate
      add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
          on_destroy.push(...new_on_destroy);
        } else {
          // Edge case - component was destroyed immediately,
          // most likely as a result of a binding initialising
          run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
      });
    }
    after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching);
      // TODO null out other refs, including component.$$ (but need to
      // preserve final state?)
      $$.on_destroy = $$.fragment = null;
      $$.ctx = [];
    }
  }
  function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
  }
  function init(
    component,
    options,
    instance,
    create_fragment,
    not_equal,
    props,
    append_styles,
    dirty = [-1]
  ) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = (component.$$ = {
      fragment: null,
      ctx: null,
      // state
      props,
      update: noop,
      not_equal,
      bound: blank_object(),
      // lifecycle
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(
        options.context || (parent_component ? parent_component.$$.context : [])
      ),
      // everything else
      callbacks: blank_object(),
      dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root,
    });
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance
      ? instance(component, options.props || {}, (i, ret, ...rest) => {
          const value = rest.length ? rest[0] : ret;
          if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
            if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
            if (ready) make_dirty(component, i);
          }
          return ret;
        })
      : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        const nodes = children(options.target);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $$.fragment && $$.fragment.c();
      }
      if (options.intro) transition_in(component.$$.fragment);
      mount_component(
        component,
        options.target,
        options.anchor,
        options.customElement
      );
      flush();
    }
    set_current_component(parent_component);
  }
  /**
   * Base class for Svelte components. Used when dev=false.
   */
  class SvelteComponent {
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    $on(type, callback) {
      const callbacks =
        this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1) callbacks.splice(index, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  }

  function dispatch_dev(type, detail) {
    document.dispatchEvent(
      custom_event(type, Object.assign({ version: "3.50.1" }, detail), {
        bubbles: true,
      })
    );
  }
  function append_dev(target, node) {
    dispatch_dev("SvelteDOMInsert", { target, node });
    append(target, node);
  }
  function insert_dev(target, node, anchor) {
    dispatch_dev("SvelteDOMInsert", { target, node, anchor });
    insert(target, node, anchor);
  }
  function detach_dev(node) {
    dispatch_dev("SvelteDOMRemove", { node });
    detach(node);
  }
  function listen_dev(
    node,
    event,
    handler,
    options,
    has_prevent_default,
    has_stop_propagation
  ) {
    const modifiers =
      options === true
        ? ["capture"]
        : options
        ? Array.from(Object.keys(options))
        : [];
    if (has_prevent_default) modifiers.push("preventDefault");
    if (has_stop_propagation) modifiers.push("stopPropagation");
    dispatch_dev("SvelteDOMAddEventListener", {
      node,
      event,
      handler,
      modifiers,
    });
    const dispose = listen(node, event, handler, options);
    return () => {
      dispatch_dev("SvelteDOMRemoveEventListener", {
        node,
        event,
        handler,
        modifiers,
      });
      dispose();
    };
  }
  function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
      dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
    else dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
  }
  function prop_dev(node, property, value) {
    node[property] = value;
    dispatch_dev("SvelteDOMSetProperty", { node, property, value });
  }
  function set_data_dev(text, data) {
    data = "" + data;
    if (text.wholeText === data) return;
    dispatch_dev("SvelteDOMSetData", { node: text, data });
    text.data = data;
  }
  function validate_each_argument(arg) {
    if (
      typeof arg !== "string" &&
      !(arg && typeof arg === "object" && "length" in arg)
    ) {
      let msg = "{#each} only iterates over array-like objects.";
      if (typeof Symbol === "function" && arg && Symbol.iterator in arg) {
        msg += " You can use a spread to convert this iterable into an array.";
      }
      throw new Error(msg);
    }
  }
  function validate_slots(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
      if (!~keys.indexOf(slot_key)) {
        console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
      }
    }
  }
  /**
   * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
   */
  class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
      if (!options || (!options.target && !options.$$inline)) {
        throw new Error("'target' is a required option");
      }
      super();
    }
    $destroy() {
      super.$destroy();
      this.$destroy = () => {
        console.warn("Component was already destroyed"); // eslint-disable-line no-console
      };
    }
    $capture_state() {}
    $inject_state() {}
  }

  // js/phoenix/utils.js
  var closure = (value) => {
    if (typeof value === "function") {
      return value;
    } else {
      let closure2 = function () {
        return value;
      };
      return closure2;
    }
  };

  // js/phoenix/constants.js
  var globalSelf = typeof self !== "undefined" ? self : null;
  var phxWindow = typeof window !== "undefined" ? window : null;
  var global$1 = globalSelf || phxWindow || global$1;
  var DEFAULT_VSN = "2.0.0";
  var SOCKET_STATES = { connecting: 0, open: 1, closing: 2, closed: 3 };
  var DEFAULT_TIMEOUT = 1e4;
  var WS_CLOSE_NORMAL = 1e3;
  var CHANNEL_STATES = {
    closed: "closed",
    errored: "errored",
    joined: "joined",
    joining: "joining",
    leaving: "leaving",
  };
  var CHANNEL_EVENTS = {
    close: "phx_close",
    error: "phx_error",
    join: "phx_join",
    reply: "phx_reply",
    leave: "phx_leave",
  };
  var TRANSPORTS = {
    longpoll: "longpoll",
    websocket: "websocket",
  };
  var XHR_STATES = {
    complete: 4,
  };

  // js/phoenix/push.js
  var Push = class {
    constructor(channel, event, payload, timeout) {
      this.channel = channel;
      this.event = event;
      this.payload =
        payload ||
        function () {
          return {};
        };
      this.receivedResp = null;
      this.timeout = timeout;
      this.timeoutTimer = null;
      this.recHooks = [];
      this.sent = false;
    }
    resend(timeout) {
      this.timeout = timeout;
      this.reset();
      this.send();
    }
    send() {
      if (this.hasReceived("timeout")) {
        return;
      }
      this.startTimeout();
      this.sent = true;
      this.channel.socket.push({
        topic: this.channel.topic,
        event: this.event,
        payload: this.payload(),
        ref: this.ref,
        join_ref: this.channel.joinRef(),
      });
    }
    receive(status, callback) {
      if (this.hasReceived(status)) {
        callback(this.receivedResp.response);
      }
      this.recHooks.push({ status, callback });
      return this;
    }
    reset() {
      this.cancelRefEvent();
      this.ref = null;
      this.refEvent = null;
      this.receivedResp = null;
      this.sent = false;
    }
    matchReceive({ status, response, _ref }) {
      this.recHooks
        .filter((h) => h.status === status)
        .forEach((h) => h.callback(response));
    }
    cancelRefEvent() {
      if (!this.refEvent) {
        return;
      }
      this.channel.off(this.refEvent);
    }
    cancelTimeout() {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
    startTimeout() {
      if (this.timeoutTimer) {
        this.cancelTimeout();
      }
      this.ref = this.channel.socket.makeRef();
      this.refEvent = this.channel.replyEventName(this.ref);
      this.channel.on(this.refEvent, (payload) => {
        this.cancelRefEvent();
        this.cancelTimeout();
        this.receivedResp = payload;
        this.matchReceive(payload);
      });
      this.timeoutTimer = setTimeout(() => {
        this.trigger("timeout", {});
      }, this.timeout);
    }
    hasReceived(status) {
      return this.receivedResp && this.receivedResp.status === status;
    }
    trigger(status, response) {
      this.channel.trigger(this.refEvent, { status, response });
    }
  };

  // js/phoenix/timer.js
  var Timer = class {
    constructor(callback, timerCalc) {
      this.callback = callback;
      this.timerCalc = timerCalc;
      this.timer = null;
      this.tries = 0;
    }
    reset() {
      this.tries = 0;
      clearTimeout(this.timer);
    }
    scheduleTimeout() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.tries = this.tries + 1;
        this.callback();
      }, this.timerCalc(this.tries + 1));
    }
  };

  // js/phoenix/channel.js
  var Channel = class {
    constructor(topic, params, socket) {
      this.state = CHANNEL_STATES.closed;
      this.topic = topic;
      this.params = closure(params || {});
      this.socket = socket;
      this.bindings = [];
      this.bindingRef = 0;
      this.timeout = this.socket.timeout;
      this.joinedOnce = false;
      this.joinPush = new Push(
        this,
        CHANNEL_EVENTS.join,
        this.params,
        this.timeout
      );
      this.pushBuffer = [];
      this.stateChangeRefs = [];
      this.rejoinTimer = new Timer(() => {
        if (this.socket.isConnected()) {
          this.rejoin();
        }
      }, this.socket.rejoinAfterMs);
      this.stateChangeRefs.push(
        this.socket.onError(() => this.rejoinTimer.reset())
      );
      this.stateChangeRefs.push(
        this.socket.onOpen(() => {
          this.rejoinTimer.reset();
          if (this.isErrored()) {
            this.rejoin();
          }
        })
      );
      this.joinPush.receive("ok", () => {
        this.state = CHANNEL_STATES.joined;
        this.rejoinTimer.reset();
        this.pushBuffer.forEach((pushEvent) => pushEvent.send());
        this.pushBuffer = [];
      });
      this.joinPush.receive("error", () => {
        this.state = CHANNEL_STATES.errored;
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.onClose(() => {
        this.rejoinTimer.reset();
        if (this.socket.hasLogger())
          this.socket.log("channel", `close ${this.topic} ${this.joinRef()}`);
        this.state = CHANNEL_STATES.closed;
        this.socket.remove(this);
      });
      this.onError((reason) => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `error ${this.topic}`, reason);
        if (this.isJoining()) {
          this.joinPush.reset();
        }
        this.state = CHANNEL_STATES.errored;
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.joinPush.receive("timeout", () => {
        if (this.socket.hasLogger())
          this.socket.log(
            "channel",
            `timeout ${this.topic} (${this.joinRef()})`,
            this.joinPush.timeout
          );
        let leavePush = new Push(
          this,
          CHANNEL_EVENTS.leave,
          closure({}),
          this.timeout
        );
        leavePush.send();
        this.state = CHANNEL_STATES.errored;
        this.joinPush.reset();
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.on(CHANNEL_EVENTS.reply, (payload, ref) => {
        this.trigger(this.replyEventName(ref), payload);
      });
    }
    join(timeout = this.timeout) {
      if (this.joinedOnce) {
        throw new Error(
          "tried to join multiple times. 'join' can only be called a single time per channel instance"
        );
      } else {
        this.timeout = timeout;
        this.joinedOnce = true;
        this.rejoin();
        return this.joinPush;
      }
    }
    onClose(callback) {
      this.on(CHANNEL_EVENTS.close, callback);
    }
    onError(callback) {
      return this.on(CHANNEL_EVENTS.error, (reason) => callback(reason));
    }
    on(event, callback) {
      let ref = this.bindingRef++;
      this.bindings.push({ event, ref, callback });
      return ref;
    }
    off(event, ref) {
      this.bindings = this.bindings.filter((bind) => {
        return !(
          bind.event === event &&
          (typeof ref === "undefined" || ref === bind.ref)
        );
      });
    }
    canPush() {
      return this.socket.isConnected() && this.isJoined();
    }
    push(event, payload, timeout = this.timeout) {
      payload = payload || {};
      if (!this.joinedOnce) {
        throw new Error(
          `tried to push '${event}' to '${this.topic}' before joining. Use channel.join() before pushing events`
        );
      }
      let pushEvent = new Push(
        this,
        event,
        function () {
          return payload;
        },
        timeout
      );
      if (this.canPush()) {
        pushEvent.send();
      } else {
        pushEvent.startTimeout();
        this.pushBuffer.push(pushEvent);
      }
      return pushEvent;
    }
    leave(timeout = this.timeout) {
      this.rejoinTimer.reset();
      this.joinPush.cancelTimeout();
      this.state = CHANNEL_STATES.leaving;
      let onClose = () => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `leave ${this.topic}`);
        this.trigger(CHANNEL_EVENTS.close, "leave");
      };
      let leavePush = new Push(
        this,
        CHANNEL_EVENTS.leave,
        closure({}),
        timeout
      );
      leavePush
        .receive("ok", () => onClose())
        .receive("timeout", () => onClose());
      leavePush.send();
      if (!this.canPush()) {
        leavePush.trigger("ok", {});
      }
      return leavePush;
    }
    onMessage(_event, payload, _ref) {
      return payload;
    }
    isMember(topic, event, payload, joinRef) {
      if (this.topic !== topic) {
        return false;
      }
      if (joinRef && joinRef !== this.joinRef()) {
        if (this.socket.hasLogger())
          this.socket.log("channel", "dropping outdated message", {
            topic,
            event,
            payload,
            joinRef,
          });
        return false;
      } else {
        return true;
      }
    }
    joinRef() {
      return this.joinPush.ref;
    }
    rejoin(timeout = this.timeout) {
      if (this.isLeaving()) {
        return;
      }
      this.socket.leaveOpenTopic(this.topic);
      this.state = CHANNEL_STATES.joining;
      this.joinPush.resend(timeout);
    }
    trigger(event, payload, ref, joinRef) {
      let handledPayload = this.onMessage(event, payload, ref, joinRef);
      if (payload && !handledPayload) {
        throw new Error(
          "channel onMessage callbacks must return the payload, modified or unmodified"
        );
      }
      let eventBindings = this.bindings.filter((bind) => bind.event === event);
      for (let i = 0; i < eventBindings.length; i++) {
        let bind = eventBindings[i];
        bind.callback(handledPayload, ref, joinRef || this.joinRef());
      }
    }
    replyEventName(ref) {
      return `chan_reply_${ref}`;
    }
    isClosed() {
      return this.state === CHANNEL_STATES.closed;
    }
    isErrored() {
      return this.state === CHANNEL_STATES.errored;
    }
    isJoined() {
      return this.state === CHANNEL_STATES.joined;
    }
    isJoining() {
      return this.state === CHANNEL_STATES.joining;
    }
    isLeaving() {
      return this.state === CHANNEL_STATES.leaving;
    }
  };

  // js/phoenix/ajax.js
  var Ajax = class {
    static request(
      method,
      endPoint,
      accept,
      body,
      timeout,
      ontimeout,
      callback
    ) {
      if (global$1.XDomainRequest) {
        let req = new global$1.XDomainRequest();
        this.xdomainRequest(
          req,
          method,
          endPoint,
          body,
          timeout,
          ontimeout,
          callback
        );
      } else {
        let req = new global$1.XMLHttpRequest();
        this.xhrRequest(
          req,
          method,
          endPoint,
          accept,
          body,
          timeout,
          ontimeout,
          callback
        );
      }
    }
    static xdomainRequest(
      req,
      method,
      endPoint,
      body,
      timeout,
      ontimeout,
      callback
    ) {
      req.timeout = timeout;
      req.open(method, endPoint);
      req.onload = () => {
        let response = this.parseJSON(req.responseText);
        callback && callback(response);
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }
      req.onprogress = () => {};
      req.send(body);
    }
    static xhrRequest(
      req,
      method,
      endPoint,
      accept,
      body,
      timeout,
      ontimeout,
      callback
    ) {
      req.open(method, endPoint, true);
      req.timeout = timeout;
      req.setRequestHeader("Content-Type", accept);
      req.onerror = () => {
        callback && callback(null);
      };
      req.onreadystatechange = () => {
        if (req.readyState === XHR_STATES.complete && callback) {
          let response = this.parseJSON(req.responseText);
          callback(response);
        }
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }
      req.send(body);
    }
    static parseJSON(resp) {
      if (!resp || resp === "") {
        return null;
      }
      try {
        return JSON.parse(resp);
      } catch (e) {
        console && console.log("failed to parse JSON response", resp);
        return null;
      }
    }
    static serialize(obj, parentKey) {
      let queryStr = [];
      for (var key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
          continue;
        }
        let paramKey = parentKey ? `${parentKey}[${key}]` : key;
        let paramVal = obj[key];
        if (typeof paramVal === "object") {
          queryStr.push(this.serialize(paramVal, paramKey));
        } else {
          queryStr.push(
            encodeURIComponent(paramKey) + "=" + encodeURIComponent(paramVal)
          );
        }
      }
      return queryStr.join("&");
    }
    static appendParams(url, params) {
      if (Object.keys(params).length === 0) {
        return url;
      }
      let prefix = url.match(/\?/) ? "&" : "?";
      return `${url}${prefix}${this.serialize(params)}`;
    }
  };

  // js/phoenix/longpoll.js
  var LongPoll = class {
    constructor(endPoint) {
      this.endPoint = null;
      this.token = null;
      this.skipHeartbeat = true;
      this.onopen = function () {};
      this.onerror = function () {};
      this.onmessage = function () {};
      this.onclose = function () {};
      this.pollEndpoint = this.normalizeEndpoint(endPoint);
      this.readyState = SOCKET_STATES.connecting;
      this.poll();
    }
    normalizeEndpoint(endPoint) {
      return endPoint
        .replace("ws://", "http://")
        .replace("wss://", "https://")
        .replace(
          new RegExp("(.*)/" + TRANSPORTS.websocket),
          "$1/" + TRANSPORTS.longpoll
        );
    }
    endpointURL() {
      return Ajax.appendParams(this.pollEndpoint, { token: this.token });
    }
    closeAndRetry(code, reason, wasClean) {
      this.close(code, reason, wasClean);
      this.readyState = SOCKET_STATES.connecting;
    }
    ontimeout() {
      this.onerror("timeout");
      this.closeAndRetry(1005, "timeout", false);
    }
    poll() {
      if (
        !(
          this.readyState === SOCKET_STATES.open ||
          this.readyState === SOCKET_STATES.connecting
        )
      ) {
        return;
      }
      Ajax.request(
        "GET",
        this.endpointURL(),
        "application/json",
        null,
        this.timeout,
        this.ontimeout.bind(this),
        (resp) => {
          if (resp) {
            var { status, token, messages } = resp;
            this.token = token;
          } else {
            status = 0;
          }
          switch (status) {
            case 200:
              messages.forEach((msg) => {
                setTimeout(() => {
                  this.onmessage({ data: msg });
                }, 0);
              });
              this.poll();
              break;
            case 204:
              this.poll();
              break;
            case 410:
              this.readyState = SOCKET_STATES.open;
              this.onopen({});
              this.poll();
              break;
            case 403:
              this.onerror(403);
              this.close(1008, "forbidden", false);
              break;
            case 0:
            case 500:
              this.onerror(500);
              this.closeAndRetry(1011, "internal server error", 500);
              break;
            default:
              throw new Error(`unhandled poll status ${status}`);
          }
        }
      );
    }
    send(body) {
      Ajax.request(
        "POST",
        this.endpointURL(),
        "application/json",
        body,
        this.timeout,
        this.onerror.bind(this, "timeout"),
        (resp) => {
          if (!resp || resp.status !== 200) {
            this.onerror(resp && resp.status);
            this.closeAndRetry(1011, "internal server error", false);
          }
        }
      );
    }
    close(code, reason, wasClean) {
      this.readyState = SOCKET_STATES.closed;
      let opts = Object.assign(
        { code: 1e3, reason: void 0, wasClean: true },
        { code, reason, wasClean }
      );
      if (typeof CloseEvent !== "undefined") {
        this.onclose(new CloseEvent("close", opts));
      } else {
        this.onclose(opts);
      }
    }
  };

  // js/phoenix/presence.js
  var Presence = class {
    constructor(channel, opts = {}) {
      let events = opts.events || {
        state: "presence_state",
        diff: "presence_diff",
      };
      this.state = {};
      this.pendingDiffs = [];
      this.channel = channel;
      this.joinRef = null;
      this.caller = {
        onJoin: function () {},
        onLeave: function () {},
        onSync: function () {},
      };
      this.channel.on(events.state, (newState) => {
        let { onJoin, onLeave, onSync } = this.caller;
        this.joinRef = this.channel.joinRef();
        this.state = Presence.syncState(this.state, newState, onJoin, onLeave);
        this.pendingDiffs.forEach((diff) => {
          this.state = Presence.syncDiff(this.state, diff, onJoin, onLeave);
        });
        this.pendingDiffs = [];
        onSync();
      });
      this.channel.on(events.diff, (diff) => {
        let { onJoin, onLeave, onSync } = this.caller;
        if (this.inPendingSyncState()) {
          this.pendingDiffs.push(diff);
        } else {
          this.state = Presence.syncDiff(this.state, diff, onJoin, onLeave);
          onSync();
        }
      });
    }
    onJoin(callback) {
      this.caller.onJoin = callback;
    }
    onLeave(callback) {
      this.caller.onLeave = callback;
    }
    onSync(callback) {
      this.caller.onSync = callback;
    }
    list(by) {
      return Presence.list(this.state, by);
    }
    inPendingSyncState() {
      return !this.joinRef || this.joinRef !== this.channel.joinRef();
    }
    static syncState(currentState, newState, onJoin, onLeave) {
      let state = this.clone(currentState);
      let joins = {};
      let leaves = {};
      this.map(state, (key, presence) => {
        if (!newState[key]) {
          leaves[key] = presence;
        }
      });
      this.map(newState, (key, newPresence) => {
        let currentPresence = state[key];
        if (currentPresence) {
          let newRefs = newPresence.metas.map((m) => m.phx_ref);
          let curRefs = currentPresence.metas.map((m) => m.phx_ref);
          let joinedMetas = newPresence.metas.filter(
            (m) => curRefs.indexOf(m.phx_ref) < 0
          );
          let leftMetas = currentPresence.metas.filter(
            (m) => newRefs.indexOf(m.phx_ref) < 0
          );
          if (joinedMetas.length > 0) {
            joins[key] = newPresence;
            joins[key].metas = joinedMetas;
          }
          if (leftMetas.length > 0) {
            leaves[key] = this.clone(currentPresence);
            leaves[key].metas = leftMetas;
          }
        } else {
          joins[key] = newPresence;
        }
      });
      return this.syncDiff(state, { joins, leaves }, onJoin, onLeave);
    }
    static syncDiff(state, diff, onJoin, onLeave) {
      let { joins, leaves } = this.clone(diff);
      if (!onJoin) {
        onJoin = function () {};
      }
      if (!onLeave) {
        onLeave = function () {};
      }
      this.map(joins, (key, newPresence) => {
        let currentPresence = state[key];
        state[key] = this.clone(newPresence);
        if (currentPresence) {
          let joinedRefs = state[key].metas.map((m) => m.phx_ref);
          let curMetas = currentPresence.metas.filter(
            (m) => joinedRefs.indexOf(m.phx_ref) < 0
          );
          state[key].metas.unshift(...curMetas);
        }
        onJoin(key, currentPresence, newPresence);
      });
      this.map(leaves, (key, leftPresence) => {
        let currentPresence = state[key];
        if (!currentPresence) {
          return;
        }
        let refsToRemove = leftPresence.metas.map((m) => m.phx_ref);
        currentPresence.metas = currentPresence.metas.filter((p) => {
          return refsToRemove.indexOf(p.phx_ref) < 0;
        });
        onLeave(key, currentPresence, leftPresence);
        if (currentPresence.metas.length === 0) {
          delete state[key];
        }
      });
      return state;
    }
    static list(presences, chooser) {
      if (!chooser) {
        chooser = function (key, pres) {
          return pres;
        };
      }
      return this.map(presences, (key, presence) => {
        return chooser(key, presence);
      });
    }
    static map(obj, func) {
      return Object.getOwnPropertyNames(obj).map((key) => func(key, obj[key]));
    }
    static clone(obj) {
      return JSON.parse(JSON.stringify(obj));
    }
  };

  // js/phoenix/serializer.js
  var serializer_default = {
    HEADER_LENGTH: 1,
    META_LENGTH: 4,
    KINDS: { push: 0, reply: 1, broadcast: 2 },
    encode(msg, callback) {
      if (msg.payload.constructor === ArrayBuffer) {
        return callback(this.binaryEncode(msg));
      } else {
        let payload = [
          msg.join_ref,
          msg.ref,
          msg.topic,
          msg.event,
          msg.payload,
        ];
        return callback(JSON.stringify(payload));
      }
    },
    decode(rawPayload, callback) {
      if (rawPayload.constructor === ArrayBuffer) {
        return callback(this.binaryDecode(rawPayload));
      } else {
        let [join_ref, ref, topic, event, payload] = JSON.parse(rawPayload);
        return callback({ join_ref, ref, topic, event, payload });
      }
    },
    binaryEncode(message) {
      let { join_ref, ref, event, topic, payload } = message;
      let metaLength =
        this.META_LENGTH +
        join_ref.length +
        ref.length +
        topic.length +
        event.length;
      let header = new ArrayBuffer(this.HEADER_LENGTH + metaLength);
      let view = new DataView(header);
      let offset = 0;
      view.setUint8(offset++, this.KINDS.push);
      view.setUint8(offset++, join_ref.length);
      view.setUint8(offset++, ref.length);
      view.setUint8(offset++, topic.length);
      view.setUint8(offset++, event.length);
      Array.from(join_ref, (char) =>
        view.setUint8(offset++, char.charCodeAt(0))
      );
      Array.from(ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(topic, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(event, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      var combined = new Uint8Array(header.byteLength + payload.byteLength);
      combined.set(new Uint8Array(header), 0);
      combined.set(new Uint8Array(payload), header.byteLength);
      return combined.buffer;
    },
    binaryDecode(buffer) {
      let view = new DataView(buffer);
      let kind = view.getUint8(0);
      let decoder = new TextDecoder();
      switch (kind) {
        case this.KINDS.push:
          return this.decodePush(buffer, view, decoder);
        case this.KINDS.reply:
          return this.decodeReply(buffer, view, decoder);
        case this.KINDS.broadcast:
          return this.decodeBroadcast(buffer, view, decoder);
      }
    },
    decodePush(buffer, view, decoder) {
      let joinRefSize = view.getUint8(1);
      let topicSize = view.getUint8(2);
      let eventSize = view.getUint8(3);
      let offset = this.HEADER_LENGTH + this.META_LENGTH - 1;
      let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
      offset = offset + joinRefSize;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      return { join_ref: joinRef, ref: null, topic, event, payload: data };
    },
    decodeReply(buffer, view, decoder) {
      let joinRefSize = view.getUint8(1);
      let refSize = view.getUint8(2);
      let topicSize = view.getUint8(3);
      let eventSize = view.getUint8(4);
      let offset = this.HEADER_LENGTH + this.META_LENGTH;
      let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
      offset = offset + joinRefSize;
      let ref = decoder.decode(buffer.slice(offset, offset + refSize));
      offset = offset + refSize;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      let payload = { status: event, response: data };
      return {
        join_ref: joinRef,
        ref,
        topic,
        event: CHANNEL_EVENTS.reply,
        payload,
      };
    },
    decodeBroadcast(buffer, view, decoder) {
      let topicSize = view.getUint8(1);
      let eventSize = view.getUint8(2);
      let offset = this.HEADER_LENGTH + 2;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      return { join_ref: null, ref: null, topic, event, payload: data };
    },
  };

  // js/phoenix/socket.js
  var Socket = class {
    constructor(endPoint, opts = {}) {
      this.stateChangeCallbacks = {
        open: [],
        close: [],
        error: [],
        message: [],
      };
      this.channels = [];
      this.sendBuffer = [];
      this.ref = 0;
      this.timeout = opts.timeout || DEFAULT_TIMEOUT;
      this.transport = opts.transport || global$1.WebSocket || LongPoll;
      this.establishedConnections = 0;
      this.defaultEncoder = serializer_default.encode.bind(serializer_default);
      this.defaultDecoder = serializer_default.decode.bind(serializer_default);
      this.closeWasClean = false;
      this.binaryType = opts.binaryType || "arraybuffer";
      this.connectClock = 1;
      if (this.transport !== LongPoll) {
        this.encode = opts.encode || this.defaultEncoder;
        this.decode = opts.decode || this.defaultDecoder;
      } else {
        this.encode = this.defaultEncoder;
        this.decode = this.defaultDecoder;
      }
      let awaitingConnectionOnPageShow = null;
      if (phxWindow && phxWindow.addEventListener) {
        phxWindow.addEventListener("pagehide", (_e) => {
          if (this.conn) {
            this.disconnect();
            awaitingConnectionOnPageShow = this.connectClock;
          }
        });
        phxWindow.addEventListener("pageshow", (_e) => {
          if (awaitingConnectionOnPageShow === this.connectClock) {
            awaitingConnectionOnPageShow = null;
            this.connect();
          }
        });
      }
      this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 3e4;
      this.rejoinAfterMs = (tries) => {
        if (opts.rejoinAfterMs) {
          return opts.rejoinAfterMs(tries);
        } else {
          return [1e3, 2e3, 5e3][tries - 1] || 1e4;
        }
      };
      this.reconnectAfterMs = (tries) => {
        if (opts.reconnectAfterMs) {
          return opts.reconnectAfterMs(tries);
        } else {
          return [10, 50, 100, 150, 200, 250, 500, 1e3, 2e3][tries - 1] || 5e3;
        }
      };
      this.logger = opts.logger || null;
      this.longpollerTimeout = opts.longpollerTimeout || 2e4;
      this.params = closure(opts.params || {});
      this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
      this.vsn = opts.vsn || DEFAULT_VSN;
      this.heartbeatTimer = null;
      this.pendingHeartbeatRef = null;
      this.reconnectTimer = new Timer(() => {
        this.teardown(() => this.connect());
      }, this.reconnectAfterMs);
    }
    replaceTransport(newTransport) {
      this.disconnect();
      this.transport = newTransport;
    }
    protocol() {
      return location.protocol.match(/^https/) ? "wss" : "ws";
    }
    endPointURL() {
      let uri = Ajax.appendParams(
        Ajax.appendParams(this.endPoint, this.params()),
        { vsn: this.vsn }
      );
      if (uri.charAt(0) !== "/") {
        return uri;
      }
      if (uri.charAt(1) === "/") {
        return `${this.protocol()}:${uri}`;
      }
      return `${this.protocol()}://${location.host}${uri}`;
    }
    disconnect(callback, code, reason) {
      this.connectClock++;
      this.closeWasClean = true;
      this.reconnectTimer.reset();
      this.teardown(callback, code, reason);
    }
    connect(params) {
      this.connectClock++;
      if (params) {
        console &&
          console.log(
            "passing params to connect is deprecated. Instead pass :params to the Socket constructor"
          );
        this.params = closure(params);
      }
      if (this.conn) {
        return;
      }
      this.closeWasClean = false;
      this.conn = new this.transport(this.endPointURL());
      this.conn.binaryType = this.binaryType;
      this.conn.timeout = this.longpollerTimeout;
      this.conn.onopen = () => this.onConnOpen();
      this.conn.onerror = (error) => this.onConnError(error);
      this.conn.onmessage = (event) => this.onConnMessage(event);
      this.conn.onclose = (event) => this.onConnClose(event);
    }
    log(kind, msg, data) {
      this.logger(kind, msg, data);
    }
    hasLogger() {
      return this.logger !== null;
    }
    onOpen(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.open.push([ref, callback]);
      return ref;
    }
    onClose(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.close.push([ref, callback]);
      return ref;
    }
    onError(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.error.push([ref, callback]);
      return ref;
    }
    onMessage(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.message.push([ref, callback]);
      return ref;
    }
    onConnOpen() {
      if (this.hasLogger())
        this.log("transport", `connected to ${this.endPointURL()}`);
      this.closeWasClean = false;
      this.establishedConnections++;
      this.flushSendBuffer();
      this.reconnectTimer.reset();
      this.resetHeartbeat();
      this.stateChangeCallbacks.open.forEach(([, callback]) => callback());
    }
    heartbeatTimeout() {
      if (this.pendingHeartbeatRef) {
        this.pendingHeartbeatRef = null;
        if (this.hasLogger()) {
          this.log(
            "transport",
            "heartbeat timeout. Attempting to re-establish connection"
          );
        }
        this.abnormalClose("heartbeat timeout");
      }
    }
    resetHeartbeat() {
      if (this.conn && this.conn.skipHeartbeat) {
        return;
      }
      this.pendingHeartbeatRef = null;
      clearTimeout(this.heartbeatTimer);
      setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
    }
    teardown(callback, code, reason) {
      if (!this.conn) {
        return callback && callback();
      }
      this.waitForBufferDone(() => {
        if (this.conn) {
          if (code) {
            this.conn.close(code, reason || "");
          } else {
            this.conn.close();
          }
        }
        this.waitForSocketClosed(() => {
          if (this.conn) {
            this.conn.onclose = function () {};
            this.conn = null;
          }
          callback && callback();
        });
      });
    }
    waitForBufferDone(callback, tries = 1) {
      if (tries === 5 || !this.conn || !this.conn.bufferedAmount) {
        callback();
        return;
      }
      setTimeout(() => {
        this.waitForBufferDone(callback, tries + 1);
      }, 150 * tries);
    }
    waitForSocketClosed(callback, tries = 1) {
      if (
        tries === 5 ||
        !this.conn ||
        this.conn.readyState === SOCKET_STATES.closed
      ) {
        callback();
        return;
      }
      setTimeout(() => {
        this.waitForSocketClosed(callback, tries + 1);
      }, 150 * tries);
    }
    onConnClose(event) {
      let closeCode = event && event.code;
      if (this.hasLogger()) this.log("transport", "close", event);
      this.triggerChanError();
      clearTimeout(this.heartbeatTimer);
      if (!this.closeWasClean && closeCode !== 1e3) {
        this.reconnectTimer.scheduleTimeout();
      }
      this.stateChangeCallbacks.close.forEach(([, callback]) =>
        callback(event)
      );
    }
    onConnError(error) {
      if (this.hasLogger()) this.log("transport", error);
      let transportBefore = this.transport;
      let establishedBefore = this.establishedConnections;
      this.stateChangeCallbacks.error.forEach(([, callback]) => {
        callback(error, transportBefore, establishedBefore);
      });
      if (transportBefore === this.transport || establishedBefore > 0) {
        this.triggerChanError();
      }
    }
    triggerChanError() {
      this.channels.forEach((channel) => {
        if (
          !(channel.isErrored() || channel.isLeaving() || channel.isClosed())
        ) {
          channel.trigger(CHANNEL_EVENTS.error);
        }
      });
    }
    connectionState() {
      switch (this.conn && this.conn.readyState) {
        case SOCKET_STATES.connecting:
          return "connecting";
        case SOCKET_STATES.open:
          return "open";
        case SOCKET_STATES.closing:
          return "closing";
        default:
          return "closed";
      }
    }
    isConnected() {
      return this.connectionState() === "open";
    }
    remove(channel) {
      this.off(channel.stateChangeRefs);
      this.channels = this.channels.filter(
        (c) => c.joinRef() !== channel.joinRef()
      );
    }
    off(refs) {
      for (let key in this.stateChangeCallbacks) {
        this.stateChangeCallbacks[key] = this.stateChangeCallbacks[key].filter(
          ([ref]) => {
            return refs.indexOf(ref) === -1;
          }
        );
      }
    }
    channel(topic, chanParams = {}) {
      let chan = new Channel(topic, chanParams, this);
      this.channels.push(chan);
      return chan;
    }
    push(data) {
      if (this.hasLogger()) {
        let { topic, event, payload, ref, join_ref } = data;
        this.log("push", `${topic} ${event} (${join_ref}, ${ref})`, payload);
      }
      if (this.isConnected()) {
        this.encode(data, (result) => this.conn.send(result));
      } else {
        this.sendBuffer.push(() =>
          this.encode(data, (result) => this.conn.send(result))
        );
      }
    }
    makeRef() {
      let newRef = this.ref + 1;
      if (newRef === this.ref) {
        this.ref = 0;
      } else {
        this.ref = newRef;
      }
      return this.ref.toString();
    }
    sendHeartbeat() {
      if (this.pendingHeartbeatRef && !this.isConnected()) {
        return;
      }
      this.pendingHeartbeatRef = this.makeRef();
      this.push({
        topic: "phoenix",
        event: "heartbeat",
        payload: {},
        ref: this.pendingHeartbeatRef,
      });
      this.heartbeatTimer = setTimeout(
        () => this.heartbeatTimeout(),
        this.heartbeatIntervalMs
      );
    }
    abnormalClose(reason) {
      this.closeWasClean = false;
      if (this.isConnected()) {
        this.conn.close(WS_CLOSE_NORMAL, reason);
      }
    }
    flushSendBuffer() {
      if (this.isConnected() && this.sendBuffer.length > 0) {
        this.sendBuffer.forEach((callback) => callback());
        this.sendBuffer = [];
      }
    }
    onConnMessage(rawMessage) {
      this.decode(rawMessage.data, (msg) => {
        let { topic, event, payload, ref, join_ref } = msg;
        if (ref && ref === this.pendingHeartbeatRef) {
          clearTimeout(this.heartbeatTimer);
          this.pendingHeartbeatRef = null;
          setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
        }
        if (this.hasLogger())
          this.log(
            "receive",
            `${payload.status || ""} ${topic} ${event} ${
              (ref && "(" + ref + ")") || ""
            }`,
            payload
          );
        for (let i = 0; i < this.channels.length; i++) {
          const channel = this.channels[i];
          if (!channel.isMember(topic, event, payload, join_ref)) {
            continue;
          }
          channel.trigger(event, payload, ref, join_ref);
        }
        for (let i = 0; i < this.stateChangeCallbacks.message.length; i++) {
          let [, callback] = this.stateChangeCallbacks.message[i];
          callback(msg);
        }
      });
    }
    leaveOpenTopic(topic) {
      let dupChannel = this.channels.find(
        (c) => c.topic === topic && (c.isJoined() || c.isJoining())
      );
      if (dupChannel) {
        if (this.hasLogger())
          this.log("transport", `leaving duplicate topic "${topic}"`);
        dupChannel.leave();
      }
    }
  };

  /*
   * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
   *
   * https://github.com/reach/router/blob/master/LICENSE
   */

  const isUndefined = (value) => typeof value === "undefined";

  const isFunction = (value) => typeof value === "function";

  const isNumber = (value) => typeof value === "number";

  function createCounter() {
    let i = 0;
    /**
     * Returns an id and increments the internal state
     * @returns {number}
     */
    return () => i++;
  }

  /**
   * Create a globally unique id
   *
   * @returns {string} An id
   */
  function createGlobalId() {
    return Math.random().toString(36).substring(2);
  }

  const isSSR = typeof window === "undefined";

  function addListener(target, type, handler) {
    target.addEventListener(type, handler);
    return () => target.removeEventListener(type, handler);
  }

  const subscriber_queue = [];
  /**
   * Creates a `Readable` store that allows reading by subscription.
   * @param value initial value
   * @param {StartStopNotifier}start start and stop notifications for subscriptions
   */
  function readable(value, start) {
    return {
      subscribe: writable(value, start).subscribe,
    };
  }
  /**
   * Create a `Writable` store that allows both updating and reading by subscription.
   * @param {*=}value initial value
   * @param {StartStopNotifier=}start start and stop notifications for subscriptions
   */
  function writable(value, start = noop) {
    let stop;
    const subscribers = new Set();
    function set(new_value) {
      if (safe_not_equal(value, new_value)) {
        value = new_value;
        if (stop) {
          // store is ready
          const run_queue = !subscriber_queue.length;
          for (const subscriber of subscribers) {
            subscriber[1]();
            subscriber_queue.push(subscriber, value);
          }
          if (run_queue) {
            for (let i = 0; i < subscriber_queue.length; i += 2) {
              subscriber_queue[i][0](subscriber_queue[i + 1]);
            }
            subscriber_queue.length = 0;
          }
        }
      }
    }
    function update(fn) {
      set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
      const subscriber = [run, invalidate];
      subscribers.add(subscriber);
      if (subscribers.size === 1) {
        stop = start(set) || noop;
      }
      run(value);
      return () => {
        subscribers.delete(subscriber);
        if (subscribers.size === 0) {
          stop();
          stop = null;
        }
      };
    }
    return { set, update, subscribe };
  }
  function derived(stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single ? [stores] : stores;
    const auto = fn.length < 2;
    return readable(initial_value, (set) => {
      let inited = false;
      const values = [];
      let pending = 0;
      let cleanup = noop;
      const sync = () => {
        if (pending) {
          return;
        }
        cleanup();
        const result = fn(single ? values[0] : values, set);
        if (auto) {
          set(result);
        } else {
          cleanup = is_function(result) ? result : noop;
        }
      };
      const unsubscribers = stores_array.map((store, i) =>
        subscribe(
          store,
          (value) => {
            values[i] = value;
            pending &= ~(1 << i);
            if (inited) {
              sync();
            }
          },
          () => {
            pending |= 1 << i;
          }
        )
      );
      inited = true;
      sync();
      return function stop() {
        run_all(unsubscribers);
        cleanup();
      };
    });
  }

  /*
   * Adapted from https://github.com/EmilTholin/svelte-routing
   *
   * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
   */

  const createKey = (ctxName) => `@@svnav-ctx__${ctxName}`;

  // Use strings instead of objects, so different versions of
  // svelte-navigator can potentially still work together
  const LOCATION = createKey("LOCATION");
  const ROUTER = createKey("ROUTER");
  const ROUTE = createKey("ROUTE");
  const ROUTE_PARAMS = createKey("ROUTE_PARAMS");
  const FOCUS_ELEM = createKey("FOCUS_ELEM");

  const paramRegex = /^:(.+)/;

  /**
   * Check if `string` starts with `search`
   * @param {string} string
   * @param {string} search
   * @return {boolean}
   */
  const startsWith = (string, search) =>
    string.substr(0, search.length) === search;

  /**
   * Check if `segment` is a root segment
   * @param {string} segment
   * @return {boolean}
   */
  const isRootSegment = (segment) => segment === "";

  /**
   * Check if `segment` is a dynamic segment
   * @param {string} segment
   * @return {boolean}
   */
  const isDynamic = (segment) => paramRegex.test(segment);

  /**
   * Check if `segment` is a splat
   * @param {string} segment
   * @return {boolean}
   */
  const isSplat = (segment) => segment[0] === "*";

  /**
   * Strip potention splat and splatname of the end of a path
   * @param {string} str
   * @return {string}
   */
  const stripSplat = (str) => str.replace(/\*.*$/, "");

  /**
   * Strip `str` of potential start and end `/`
   * @param {string} str
   * @return {string}
   */
  const stripSlashes = (str) => str.replace(/(^\/+|\/+$)/g, "");

  /**
   * Split up the URI into segments delimited by `/`
   * @param {string} uri
   * @return {string[]}
   */
  function segmentize(uri, filterFalsy = false) {
    const segments = stripSlashes(uri).split("/");
    return filterFalsy ? segments.filter(Boolean) : segments;
  }

  /**
   * Add the query to the pathname if a query is given
   * @param {string} pathname
   * @param {string} [query]
   * @return {string}
   */
  const addQuery = (pathname, query) => pathname + (query ? `?${query}` : "");

  /**
   * Normalizes a basepath
   *
   * @param {string} path
   * @returns {string}
   *
   * @example
   * normalizePath("base/path/") // -> "/base/path"
   */
  const normalizePath = (path) => `/${stripSlashes(path)}`;

  /**
   * Joins and normalizes multiple path fragments
   *
   * @param {...string} pathFragments
   * @returns {string}
   */
  function join(...pathFragments) {
    const joinFragment = (fragment) => segmentize(fragment, true).join("/");
    const joinedSegments = pathFragments.map(joinFragment).join("/");
    return normalizePath(joinedSegments);
  }

  // We start from 1 here, so we can check if an origin id has been passed
  // by using `originId || <fallback>`
  const LINK_ID = 1;
  const ROUTE_ID = 2;
  const ROUTER_ID = 3;
  const USE_FOCUS_ID = 4;
  const USE_LOCATION_ID = 5;
  const USE_MATCH_ID = 6;
  const USE_NAVIGATE_ID = 7;
  const USE_PARAMS_ID = 8;
  const USE_RESOLVABLE_ID = 9;
  const USE_RESOLVE_ID = 10;
  const NAVIGATE_ID = 11;

  const labels = {
    [LINK_ID]: "Link",
    [ROUTE_ID]: "Route",
    [ROUTER_ID]: "Router",
    [USE_FOCUS_ID]: "useFocus",
    [USE_LOCATION_ID]: "useLocation",
    [USE_MATCH_ID]: "useMatch",
    [USE_NAVIGATE_ID]: "useNavigate",
    [USE_PARAMS_ID]: "useParams",
    [USE_RESOLVABLE_ID]: "useResolvable",
    [USE_RESOLVE_ID]: "useResolve",
    [NAVIGATE_ID]: "navigate",
  };

  const createLabel = (labelId) => labels[labelId];

  function createIdentifier(labelId, props) {
    let attr;
    if (labelId === ROUTE_ID) {
      attr = props.path ? `path="${props.path}"` : "default";
    } else if (labelId === LINK_ID) {
      attr = `to="${props.to}"`;
    } else if (labelId === ROUTER_ID) {
      attr = `basepath="${props.basepath || ""}"`;
    }
    return `<${createLabel(labelId)} ${attr || ""} />`;
  }

  function createMessage(labelId, message, props, originId) {
    const origin = props && createIdentifier(originId || labelId, props);
    const originMsg = origin ? `\n\nOccurred in: ${origin}` : "";
    const label = createLabel(labelId);
    const msg = isFunction(message) ? message(label) : message;
    return `<${label}> ${msg}${originMsg}`;
  }

  const createMessageHandler =
    (handler) =>
    (...args) =>
      handler(createMessage(...args));

  const fail = createMessageHandler((message) => {
    throw new Error(message);
  });

  // eslint-disable-next-line no-console
  const warn = createMessageHandler(console.warn);

  const SEGMENT_POINTS = 4;
  const STATIC_POINTS = 3;
  const DYNAMIC_POINTS = 2;
  const SPLAT_PENALTY = 1;
  const ROOT_POINTS = 1;

  /**
   * Score a route depending on how its individual segments look
   * @param {object} route
   * @param {number} index
   * @return {object}
   */
  function rankRoute(route, index) {
    const score = route.default
      ? 0
      : segmentize(route.fullPath).reduce((acc, segment) => {
          let nextScore = acc;
          nextScore += SEGMENT_POINTS;

          if (isRootSegment(segment)) {
            nextScore += ROOT_POINTS;
          } else if (isDynamic(segment)) {
            nextScore += DYNAMIC_POINTS;
          } else if (isSplat(segment)) {
            nextScore -= SEGMENT_POINTS + SPLAT_PENALTY;
          } else {
            nextScore += STATIC_POINTS;
          }

          return nextScore;
        }, 0);

    return { route, score, index };
  }

  /**
   * Give a score to all routes and sort them on that
   * @param {object[]} routes
   * @return {object[]}
   */
  function rankRoutes(routes) {
    return (
      routes
        .map(rankRoute)
        // If two routes have the exact same score, we go by index instead
        .sort((a, b) => {
          if (a.score < b.score) {
            return 1;
          }
          if (a.score > b.score) {
            return -1;
          }
          return a.index - b.index;
        })
    );
  }

  /**
   * Ranks and picks the best route to match. Each segment gets the highest
   * amount of points, then the type of segment gets an additional amount of
   * points where
   *
   *  static > dynamic > splat > root
   *
   * This way we don't have to worry about the order of our routes, let the
   * computers do it.
   *
   * A route looks like this
   *
   *  { fullPath, default, value }
   *
   * And a returned match looks like:
   *
   *  { route, params, uri }
   *
   * @param {object[]} routes
   * @param {string} uri
   * @return {?object}
   */
  function pick(routes, uri) {
    let bestMatch;
    let defaultMatch;

    const [uriPathname] = uri.split("?");
    const uriSegments = segmentize(uriPathname);
    const isRootUri = uriSegments[0] === "";
    const ranked = rankRoutes(routes);

    for (let i = 0, l = ranked.length; i < l; i++) {
      const { route } = ranked[i];
      let missed = false;
      const params = {};

      // eslint-disable-next-line no-shadow
      const createMatch = (uri) => ({ ...route, params, uri });

      if (route.default) {
        defaultMatch = createMatch(uri);
        continue;
      }

      const routeSegments = segmentize(route.fullPath);
      const max = Math.max(uriSegments.length, routeSegments.length);
      let index = 0;

      for (; index < max; index++) {
        const routeSegment = routeSegments[index];
        const uriSegment = uriSegments[index];

        if (!isUndefined(routeSegment) && isSplat(routeSegment)) {
          // Hit a splat, just grab the rest, and return a match
          // uri:   /files/documents/work
          // route: /files/* or /files/*splatname
          const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

          params[splatName] = uriSegments
            .slice(index)
            .map(decodeURIComponent)
            .join("/");
          break;
        }

        if (isUndefined(uriSegment)) {
          // URI is shorter than the route, no match
          // uri:   /users
          // route: /users/:userId
          missed = true;
          break;
        }

        const dynamicMatch = paramRegex.exec(routeSegment);

        if (dynamicMatch && !isRootUri) {
          const value = decodeURIComponent(uriSegment);
          params[dynamicMatch[1]] = value;
        } else if (routeSegment !== uriSegment) {
          // Current segments don't match, not dynamic, not splat, so no match
          // uri:   /users/123/settings
          // route: /users/:id/profile
          missed = true;
          break;
        }
      }

      if (!missed) {
        bestMatch = createMatch(join(...uriSegments.slice(0, index)));
        break;
      }
    }

    return bestMatch || defaultMatch || null;
  }

  /**
   * Check if the `route.fullPath` matches the `uri`.
   * @param {Object} route
   * @param {string} uri
   * @return {?object}
   */
  function match(route, uri) {
    return pick([route], uri);
  }

  /**
   * Resolve URIs as though every path is a directory, no files. Relative URIs
   * in the browser can feel awkward because not only can you be "in a directory",
   * you can be "at a file", too. For example:
   *
   *  browserSpecResolve('foo', '/bar/') => /bar/foo
   *  browserSpecResolve('foo', '/bar') => /foo
   *
   * But on the command line of a file system, it's not as complicated. You can't
   * `cd` from a file, only directories. This way, links have to know less about
   * their current path. To go deeper you can do this:
   *
   *  <Link to="deeper"/>
   *  // instead of
   *  <Link to=`{${props.uri}/deeper}`/>
   *
   * Just like `cd`, if you want to go deeper from the command line, you do this:
   *
   *  cd deeper
   *  # not
   *  cd $(pwd)/deeper
   *
   * By treating every path as a directory, linking to relative paths should
   * require less contextual information and (fingers crossed) be more intuitive.
   * @param {string} to
   * @param {string} base
   * @return {string}
   */
  function resolve(to, base) {
    // /foo/bar, /baz/qux => /foo/bar
    if (startsWith(to, "/")) {
      return to;
    }

    const [toPathname, toQuery] = to.split("?");
    const [basePathname] = base.split("?");
    const toSegments = segmentize(toPathname);
    const baseSegments = segmentize(basePathname);

    // ?a=b, /users?b=c => /users?a=b
    if (toSegments[0] === "") {
      return addQuery(basePathname, toQuery);
    }

    // profile, /users/789 => /users/789/profile
    if (!startsWith(toSegments[0], ".")) {
      const pathname = baseSegments.concat(toSegments).join("/");
      return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
    }

    // ./       , /users/123 => /users/123
    // ../      , /users/123 => /users
    // ../..    , /users/123 => /
    // ../../one, /a/b/c/d   => /a/b/one
    // .././one , /a/b/c/d   => /a/b/c/one
    const allSegments = baseSegments.concat(toSegments);
    const segments = [];

    allSegments.forEach((segment) => {
      if (segment === "..") {
        segments.pop();
      } else if (segment !== ".") {
        segments.push(segment);
      }
    });

    return addQuery(`/${segments.join("/")}`, toQuery);
  }

  /**
   * Normalizes a location for consumption by `Route` children and the `Router`.
   * It removes the apps basepath from the pathname
   * and sets default values for `search` and `hash` properties.
   *
   * @param {Object} location The current global location supplied by the history component
   * @param {string} basepath The applications basepath (i.e. when serving from a subdirectory)
   *
   * @returns The normalized location
   */
  function normalizeLocation(location, basepath) {
    const { pathname, hash = "", search = "", state } = location;
    const baseSegments = segmentize(basepath, true);
    const pathSegments = segmentize(pathname, true);
    while (baseSegments.length) {
      if (baseSegments[0] !== pathSegments[0]) {
        fail(
          ROUTER_ID,
          `Invalid state: All locations must begin with the basepath "${basepath}", found "${pathname}"`
        );
      }
      baseSegments.shift();
      pathSegments.shift();
    }
    return {
      pathname: join(...pathSegments),
      hash,
      search,
      state,
    };
  }

  const normalizeUrlFragment = (frag) => (frag.length === 1 ? "" : frag);

  /**
   * Creates a location object from an url.
   * It is used to create a location from the url prop used in SSR
   *
   * @param {string} url The url string (e.g. "/path/to/somewhere")
   *
   * @returns {{ pathname: string; search: string; hash: string }} The location
   */
  function createLocation(url) {
    const searchIndex = url.indexOf("?");
    const hashIndex = url.indexOf("#");
    const hasSearchIndex = searchIndex !== -1;
    const hasHashIndex = hashIndex !== -1;
    const hash = hasHashIndex
      ? normalizeUrlFragment(url.substr(hashIndex))
      : "";
    const pathnameAndSearch = hasHashIndex ? url.substr(0, hashIndex) : url;
    const search = hasSearchIndex
      ? normalizeUrlFragment(pathnameAndSearch.substr(searchIndex))
      : "";
    const pathname = hasSearchIndex
      ? pathnameAndSearch.substr(0, searchIndex)
      : pathnameAndSearch;
    return { pathname, search, hash };
  }

  /**
   * Resolves a link relative to the parent Route and the Routers basepath.
   *
   * @param {string} path The given path, that will be resolved
   * @param {string} routeBase The current Routes base path
   * @param {string} appBase The basepath of the app. Used, when serving from a subdirectory
   * @returns {string} The resolved path
   *
   * @example
   * resolveLink("relative", "/routeBase", "/") // -> "/routeBase/relative"
   * resolveLink("/absolute", "/routeBase", "/") // -> "/absolute"
   * resolveLink("relative", "/routeBase", "/base") // -> "/base/routeBase/relative"
   * resolveLink("/absolute", "/routeBase", "/base") // -> "/base/absolute"
   */
  function resolveLink(path, routeBase, appBase) {
    return join(appBase, resolve(path, routeBase));
  }

  /**
   * Get the uri for a Route, by matching it against the current location.
   *
   * @param {string} routePath The Routes resolved path
   * @param {string} pathname The current locations pathname
   */
  function extractBaseUri(routePath, pathname) {
    const fullPath = normalizePath(stripSplat(routePath));
    const baseSegments = segmentize(fullPath, true);
    const pathSegments = segmentize(pathname, true).slice(
      0,
      baseSegments.length
    );
    const routeMatch = match({ fullPath }, join(...pathSegments));
    return routeMatch && routeMatch.uri;
  }

  /*
   * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
   *
   * https://github.com/reach/router/blob/master/LICENSE
   */

  const POP = "POP";
  const PUSH = "PUSH";
  const REPLACE = "REPLACE";

  function getLocation(source) {
    return {
      ...source.location,
      pathname: encodeURI(decodeURI(source.location.pathname)),
      state: source.history.state,
      _key: (source.history.state && source.history.state._key) || "initial",
    };
  }

  function createHistory(source) {
    let listeners = [];
    let location = getLocation(source);
    let action = POP;

    const notifyListeners = (listenerFns = listeners) =>
      listenerFns.forEach((listener) => listener({ location, action }));

    return {
      get location() {
        return location;
      },
      listen(listener) {
        listeners.push(listener);

        const popstateListener = () => {
          location = getLocation(source);
          action = POP;
          notifyListeners([listener]);
        };

        // Call listener when it is registered
        notifyListeners([listener]);

        const unlisten = addListener(source, "popstate", popstateListener);
        return () => {
          unlisten();
          listeners = listeners.filter((fn) => fn !== listener);
        };
      },
      /**
       * Navigate to a new absolute route.
       *
       * @param {string|number} to The path to navigate to.
       *
       * If `to` is a number we will navigate to the stack entry index + `to`
       * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
       * @param {Object} options
       * @param {*} [options.state] The state will be accessible through `location.state`
       * @param {boolean} [options.replace=false] Replace the current entry in the history
       * stack, instead of pushing on a new one
       */
      navigate(to, options) {
        const { state = {}, replace = false } = options || {};
        action = replace ? REPLACE : PUSH;
        if (isNumber(to)) {
          if (options) {
            warn(
              NAVIGATE_ID,
              "Navigation options (state or replace) are not supported, " +
                "when passing a number as the first argument to navigate. " +
                "They are ignored."
            );
          }
          action = POP;
          source.history.go(to);
        } else {
          const keyedState = { ...state, _key: createGlobalId() };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            source.history[replace ? "replaceState" : "pushState"](
              keyedState,
              "",
              to
            );
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }
        }

        location = getLocation(source);
        notifyListeners();
      },
    };
  }

  function createStackFrame(state, uri) {
    return { ...createLocation(uri), state };
  }

  // Stores history entries in memory for testing or other platforms like Native
  function createMemorySource(initialPathname = "/") {
    let index = 0;
    let stack = [createStackFrame(null, initialPathname)];

    return {
      // This is just for testing...
      get entries() {
        return stack;
      },
      get location() {
        return stack[index];
      },
      addEventListener() {},
      removeEventListener() {},
      history: {
        get state() {
          return stack[index].state;
        },
        pushState(state, title, uri) {
          index++;
          // Throw away anything in the stack with an index greater than the current index.
          // This happens, when we go back using `go(-n)`. The index is now less than `stack.length`.
          // If we call `go(+n)` the stack entries with an index greater than the current index can
          // be reused.
          // However, if we navigate to a path, instead of a number, we want to create a new branch
          // of navigation.
          stack = stack.slice(0, index);
          stack.push(createStackFrame(state, uri));
        },
        replaceState(state, title, uri) {
          stack[index] = createStackFrame(state, uri);
        },
        go(to) {
          const newIndex = index + to;
          if (newIndex < 0 || newIndex > stack.length - 1) {
            return;
          }
          index = newIndex;
        },
      },
    };
  }

  // Global history uses window.history as the source if available,
  // otherwise a memory history
  const canUseDOM = !!(
    !isSSR &&
    window.document &&
    window.document.createElement
  );
  // Use memory history in iframes (for example in Svelte REPL)
  const isEmbeddedPage = !isSSR && window.location.origin === "null";
  const globalHistory = createHistory(
    canUseDOM && !isEmbeddedPage ? window : createMemorySource()
  );

  // We need to keep the focus candidate in a separate file, so svelte does
  // not update, when we mutate it.
  // Also, we need a single global reference, because taking focus needs to
  // work globally, even if we have multiple top level routers
  // eslint-disable-next-line import/no-mutable-exports
  let focusCandidate = null;

  // eslint-disable-next-line import/no-mutable-exports
  let initialNavigation = true;

  /**
   * Check if RouterA is above RouterB in the document
   * @param {number} routerIdA The first Routers id
   * @param {number} routerIdB The second Routers id
   */
  function isAbove(routerIdA, routerIdB) {
    const routerMarkers = document.querySelectorAll("[data-svnav-router]");
    for (let i = 0; i < routerMarkers.length; i++) {
      const node = routerMarkers[i];
      const currentId = Number(node.dataset.svnavRouter);
      if (currentId === routerIdA) return true;
      if (currentId === routerIdB) return false;
    }
    return false;
  }

  /**
     * Check if a Route candidate is the best choice to move focus to,
     * and store the best match.
     * @param {{
         level: number;
         routerId: number;
         route: {
           id: number;
           focusElement: import("svelte/store").Readable<Promise<Element>|null>;
         }
       }} item A Route candidate, that updated and is visible after a navigation
     */
  function pushFocusCandidate(item) {
    if (
      // Best candidate if it's the only candidate...
      !focusCandidate ||
      // Route is nested deeper, than previous candidate
      // -> Route change was triggered in the deepest affected
      // Route, so that's were focus should move to
      item.level > focusCandidate.level ||
      // If the level is identical, we want to focus the first Route in the document,
      // so we pick the first Router lookin from page top to page bottom.
      (item.level === focusCandidate.level &&
        isAbove(item.routerId, focusCandidate.routerId))
    ) {
      focusCandidate = item;
    }
  }

  /**
   * Reset the focus candidate.
   */
  function clearFocusCandidate() {
    focusCandidate = null;
  }

  function initialNavigationOccurred() {
    initialNavigation = false;
  }

  /*
   * `focus` Adapted from https://github.com/oaf-project/oaf-side-effects/blob/master/src/index.ts
   *
   * https://github.com/oaf-project/oaf-side-effects/blob/master/LICENSE
   */
  function focus$1(elem) {
    if (!elem) return false;
    const TABINDEX = "tabindex";
    try {
      if (!elem.hasAttribute(TABINDEX)) {
        elem.setAttribute(TABINDEX, "-1");
        let unlisten;
        // We remove tabindex after blur to avoid weird browser behavior
        // where a mouse click can activate elements with tabindex="-1".
        const blurListener = () => {
          elem.removeAttribute(TABINDEX);
          unlisten();
        };
        unlisten = addListener(elem, "blur", blurListener);
      }
      elem.focus();
      return document.activeElement === elem;
    } catch (e) {
      // Apparently trying to focus a disabled element in IE can throw.
      // See https://stackoverflow.com/a/1600194/2476884
      return false;
    }
  }

  function isEndMarker(elem, id) {
    return Number(elem.dataset.svnavRouteEnd) === id;
  }

  function isHeading(elem) {
    return /^H[1-6]$/i.test(elem.tagName);
  }

  function query(selector, parent = document) {
    return parent.querySelector(selector);
  }

  function queryHeading(id) {
    const marker = query(`[data-svnav-route-start="${id}"]`);
    let current = marker.nextElementSibling;
    while (!isEndMarker(current, id)) {
      if (isHeading(current)) {
        return current;
      }
      const heading = query("h1,h2,h3,h4,h5,h6", current);
      if (heading) {
        return heading;
      }
      current = current.nextElementSibling;
    }
    return null;
  }

  function handleFocus(route) {
    Promise.resolve(get_store_value(route.focusElement)).then((elem) => {
      const focusElement = elem || queryHeading(route.id);
      if (!focusElement) {
        warn(
          ROUTER_ID,
          "Could not find an element to focus. " +
            "You should always render a header for accessibility reasons, " +
            'or set a custom focus element via the "useFocus" hook. ' +
            "If you don't want this Route or Router to manage focus, " +
            'pass "primary={false}" to it.',
          route,
          ROUTE_ID
        );
      }
      const headingFocused = focus$1(focusElement);
      if (headingFocused) return;
      focus$1(document.documentElement);
    });
  }

  const createTriggerFocus =
    (a11yConfig, announcementText, location) =>
    (manageFocus, announceNavigation) =>
      // Wait until the dom is updated, so we can look for headings
      tick().then(() => {
        if (!focusCandidate || initialNavigation) {
          initialNavigationOccurred();
          return;
        }
        if (manageFocus) {
          handleFocus(focusCandidate.route);
        }
        if (a11yConfig.announcements && announceNavigation) {
          const { path, fullPath, meta, params, uri } = focusCandidate.route;
          const announcementMessage = a11yConfig.createAnnouncement(
            { path, fullPath, meta, params, uri },
            get_store_value(location)
          );
          Promise.resolve(announcementMessage).then((message) => {
            announcementText.set(message);
          });
        }
        clearFocusCandidate();
      });

  const visuallyHiddenStyle =
    "position:fixed;" +
    "top:-1px;" +
    "left:0;" +
    "width:1px;" +
    "height:1px;" +
    "padding:0;" +
    "overflow:hidden;" +
    "clip:rect(0,0,0,0);" +
    "white-space:nowrap;" +
    "border:0;";

  /* node_modules/svelte-navigator/src/Router.svelte generated by Svelte v3.50.1 */

  const file$k = "node_modules/svelte-navigator/src/Router.svelte";

  // (195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}
  function create_if_block$e(ctx) {
    let div;
    let t;

    const block = {
      c: function create() {
        div = element("div");
        t = text(/*$announcementText*/ ctx[0]);
        attr_dev(div, "role", "status");
        attr_dev(div, "aria-atomic", "true");
        attr_dev(div, "aria-live", "polite");
        attr_dev(div, "style", visuallyHiddenStyle);
        add_location(div, file$k, 195, 1, 5906);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        append_dev(div, t);
      },
      p: function update(ctx, dirty) {
        if (dirty[0] & /*$announcementText*/ 1)
          set_data_dev(t, /*$announcementText*/ ctx[0]);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$e.name,
      type: "if",
      source:
        "(195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}",
      ctx,
    });

    return block;
  }

  function create_fragment$k(ctx) {
    let div;
    let t0;
    let t1;
    let if_block_anchor;
    let current;
    const default_slot_template = /*#slots*/ ctx[20].default;
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/ ctx[19],
      null
    );
    let if_block =
      /*isTopLevelRouter*/ ctx[2] &&
      /*manageFocus*/ ctx[4] &&
      /*a11yConfig*/ ctx[1].announcements &&
      create_if_block$e(ctx);

    const block = {
      c: function create() {
        div = element("div");
        t0 = space();
        if (default_slot) default_slot.c();
        t1 = space();
        if (if_block) if_block.c();
        if_block_anchor = empty();
        set_style(div, "display", "none");
        attr_dev(div, "aria-hidden", "true");
        attr_dev(div, "data-svnav-router", /*routerId*/ ctx[3]);
        add_location(div, file$k, 190, 0, 5750);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        insert_dev(target, t0, anchor);

        if (default_slot) {
          default_slot.m(target, anchor);
        }

        insert_dev(target, t1, anchor);
        if (if_block) if_block.m(target, anchor);
        insert_dev(target, if_block_anchor, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx,
              /*$$scope*/ ctx[19],
              !current
                ? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
                : get_slot_changes(
                    default_slot_template,
                    /*$$scope*/ ctx[19],
                    dirty,
                    null
                  ),
              null
            );
          }
        }

        if (
          /*isTopLevelRouter*/ ctx[2] &&
          /*manageFocus*/ ctx[4] &&
          /*a11yConfig*/ ctx[1].announcements
        )
          if_block.p(ctx, dirty);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(default_slot, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        if (detaching) detach_dev(t0);
        if (default_slot) default_slot.d(detaching);
        if (detaching) detach_dev(t1);
        if (if_block) if_block.d(detaching);
        if (detaching) detach_dev(if_block_anchor);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$k.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  const createId$1 = createCounter();
  const defaultBasepath = "/";

  function instance$k($$self, $$props, $$invalidate) {
    let $location;
    let $activeRoute;
    let $prevLocation;
    let $routes;
    let $announcementText;
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("Router", slots, ["default"]);
    let { basepath = defaultBasepath } = $$props;
    let { url = null } = $$props;
    let { history = globalHistory } = $$props;
    let { primary = true } = $$props;
    let { a11y = {} } = $$props;

    const a11yConfig = {
      createAnnouncement: (route) => `Navigated to ${route.uri}`,
      announcements: true,
      ...a11y,
    };

    // Remember the initial `basepath`, so we can fire a warning
    // when the user changes it later
    const initialBasepath = basepath;

    const normalizedBasepath = normalizePath(basepath);
    const locationContext = getContext(LOCATION);
    const routerContext = getContext(ROUTER);
    const isTopLevelRouter = !locationContext;
    const routerId = createId$1();
    const manageFocus =
      primary && !(routerContext && !routerContext.manageFocus);
    const announcementText = writable("");
    validate_store(announcementText, "announcementText");
    component_subscribe($$self, announcementText, (value) =>
      $$invalidate(0, ($announcementText = value))
    );
    const routes = writable([]);
    validate_store(routes, "routes");
    component_subscribe($$self, routes, (value) =>
      $$invalidate(18, ($routes = value))
    );
    const activeRoute = writable(null);
    validate_store(activeRoute, "activeRoute");
    component_subscribe($$self, activeRoute, (value) =>
      $$invalidate(16, ($activeRoute = value))
    );

    // Used in SSR to synchronously set that a Route is active.
    let hasActiveRoute = false;

    // Nesting level of router.
    // We will need this to identify sibling routers, when moving
    // focus on navigation, so we can focus the first possible router
    const level = isTopLevelRouter ? 0 : routerContext.level + 1;

    // If we're running an SSR we force the location to the `url` prop
    const getInitialLocation = () =>
      normalizeLocation(
        isSSR ? createLocation(url) : history.location,
        normalizedBasepath
      );

    const location = isTopLevelRouter
      ? writable(getInitialLocation())
      : locationContext;

    validate_store(location, "location");
    component_subscribe($$self, location, (value) =>
      $$invalidate(15, ($location = value))
    );
    const prevLocation = writable($location);
    validate_store(prevLocation, "prevLocation");
    component_subscribe($$self, prevLocation, (value) =>
      $$invalidate(17, ($prevLocation = value))
    );
    const triggerFocus = createTriggerFocus(
      a11yConfig,
      announcementText,
      location
    );
    const createRouteFilter = (routeId) => (routeList) =>
      routeList.filter((routeItem) => routeItem.id !== routeId);

    function registerRoute(route) {
      if (isSSR) {
        // In SSR we should set the activeRoute immediately if it is a match.
        // If there are more Routes being registered after a match is found,
        // we just skip them.
        if (hasActiveRoute) {
          return;
        }

        const matchingRoute = match(route, $location.pathname);

        if (matchingRoute) {
          hasActiveRoute = true;

          // Return the match in SSR mode, so the matched Route can use it immediatly.
          // Waiting for activeRoute to update does not work, because it updates
          // after the Route is initialized
          return matchingRoute; // eslint-disable-line consistent-return
        }
      } else {
        routes.update((prevRoutes) => {
          // Remove an old version of the updated route,
          // before pushing the new version
          const nextRoutes = createRouteFilter(route.id)(prevRoutes);

          nextRoutes.push(route);
          return nextRoutes;
        });
      }
    }

    function unregisterRoute(routeId) {
      routes.update(createRouteFilter(routeId));
    }

    if (!isTopLevelRouter && basepath !== defaultBasepath) {
      warn(
        ROUTER_ID,
        'Only top-level Routers can have a "basepath" prop. It is ignored.',
        { basepath }
      );
    }

    if (isTopLevelRouter) {
      // The topmost Router in the tree is responsible for updating
      // the location store and supplying it through context.
      onMount(() => {
        const unlisten = history.listen((changedHistory) => {
          const normalizedLocation = normalizeLocation(
            changedHistory.location,
            normalizedBasepath
          );
          prevLocation.set($location);
          location.set(normalizedLocation);
        });

        return unlisten;
      });

      setContext(LOCATION, location);
    }

    setContext(ROUTER, {
      activeRoute,
      registerRoute,
      unregisterRoute,
      manageFocus,
      level,
      id: routerId,
      history: isTopLevelRouter ? history : routerContext.history,
      basepath: isTopLevelRouter ? normalizedBasepath : routerContext.basepath,
    });

    const writable_props = ["basepath", "url", "history", "primary", "a11y"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<Router> was created with unknown prop '${key}'`);
    });

    $$self.$$set = ($$props) => {
      if ("basepath" in $$props)
        $$invalidate(10, (basepath = $$props.basepath));
      if ("url" in $$props) $$invalidate(11, (url = $$props.url));
      if ("history" in $$props) $$invalidate(12, (history = $$props.history));
      if ("primary" in $$props) $$invalidate(13, (primary = $$props.primary));
      if ("a11y" in $$props) $$invalidate(14, (a11y = $$props.a11y));
      if ("$$scope" in $$props) $$invalidate(19, ($$scope = $$props.$$scope));
    };

    $$self.$capture_state = () => ({
      createCounter,
      createId: createId$1,
      getContext,
      setContext,
      onMount,
      writable,
      LOCATION,
      ROUTER,
      globalHistory,
      normalizePath,
      pick,
      match,
      normalizeLocation,
      createLocation,
      isSSR,
      warn,
      ROUTER_ID,
      pushFocusCandidate,
      visuallyHiddenStyle,
      createTriggerFocus,
      defaultBasepath,
      basepath,
      url,
      history,
      primary,
      a11y,
      a11yConfig,
      initialBasepath,
      normalizedBasepath,
      locationContext,
      routerContext,
      isTopLevelRouter,
      routerId,
      manageFocus,
      announcementText,
      routes,
      activeRoute,
      hasActiveRoute,
      level,
      getInitialLocation,
      location,
      prevLocation,
      triggerFocus,
      createRouteFilter,
      registerRoute,
      unregisterRoute,
      $location,
      $activeRoute,
      $prevLocation,
      $routes,
      $announcementText,
    });

    $$self.$inject_state = ($$props) => {
      if ("basepath" in $$props)
        $$invalidate(10, (basepath = $$props.basepath));
      if ("url" in $$props) $$invalidate(11, (url = $$props.url));
      if ("history" in $$props) $$invalidate(12, (history = $$props.history));
      if ("primary" in $$props) $$invalidate(13, (primary = $$props.primary));
      if ("a11y" in $$props) $$invalidate(14, (a11y = $$props.a11y));
      if ("hasActiveRoute" in $$props) hasActiveRoute = $$props.hasActiveRoute;
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    $$self.$$.update = () => {
      if ($$self.$$.dirty[0] & /*basepath*/ 1024) {
        if (basepath !== initialBasepath) {
          warn(
            ROUTER_ID,
            'You cannot change the "basepath" prop. It is ignored.'
          );
        }
      }

      if ($$self.$$.dirty[0] & /*$routes, $location*/ 294912) {
        // This reactive statement will be run when the Router is created
        // when there are no Routes and then again the following tick, so it
        // will not find an active Route in SSR and in the browser it will only
        // pick an active Route after all Routes have been registered.
        {
          const bestMatch = pick($routes, $location.pathname);
          activeRoute.set(bestMatch);
        }
      }

      if ($$self.$$.dirty[0] & /*$location, $prevLocation*/ 163840) {
        // Manage focus and announce navigation to screen reader users
        {
          if (isTopLevelRouter) {
            const hasHash = !!$location.hash;

            // When a hash is present in the url, we skip focus management, because
            // focusing a different element will prevent in-page jumps (See #3)
            const shouldManageFocus = !hasHash && manageFocus;

            // We don't want to make an announcement, when the hash changes,
            // but the active route stays the same
            const announceNavigation =
              !hasHash || $location.pathname !== $prevLocation.pathname;

            triggerFocus(shouldManageFocus, announceNavigation);
          }
        }
      }

      if ($$self.$$.dirty[0] & /*$activeRoute*/ 65536) {
        // Queue matched Route, so top level Router can decide which Route to focus.
        // Non primary Routers should just be ignored
        if (manageFocus && $activeRoute && $activeRoute.primary) {
          pushFocusCandidate({ level, routerId, route: $activeRoute });
        }
      }
    };

    return [
      $announcementText,
      a11yConfig,
      isTopLevelRouter,
      routerId,
      manageFocus,
      announcementText,
      routes,
      activeRoute,
      location,
      prevLocation,
      basepath,
      url,
      history,
      primary,
      a11y,
      $location,
      $activeRoute,
      $prevLocation,
      $routes,
      $$scope,
      slots,
    ];
  }

  class Router extends SvelteComponentDev {
    constructor(options) {
      super(options);

      init(
        this,
        options,
        instance$k,
        create_fragment$k,
        safe_not_equal,
        {
          basepath: 10,
          url: 11,
          history: 12,
          primary: 13,
          a11y: 14,
        },
        null,
        [-1, -1]
      );

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Router",
        options,
        id: create_fragment$k.name,
      });
    }

    get basepath() {
      throw new Error(
        "<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set basepath(value) {
      throw new Error(
        "<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get url() {
      throw new Error(
        "<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set url(value) {
      throw new Error(
        "<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get history() {
      throw new Error(
        "<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set history(value) {
      throw new Error(
        "<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get primary() {
      throw new Error(
        "<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set primary(value) {
      throw new Error(
        "<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get a11y() {
      throw new Error(
        "<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set a11y(value) {
      throw new Error(
        "<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  var Router$1 = Router;

  /**
   * Check if a component or hook have been created outside of a
   * context providing component
   * @param {number} componentId
   * @param {*} props
   * @param {string?} ctxKey
   * @param {number?} ctxProviderId
   */
  function usePreflightCheck(
    componentId,
    props,
    ctxKey = ROUTER,
    ctxProviderId = ROUTER_ID
  ) {
    const ctx = getContext(ctxKey);
    if (!ctx) {
      fail(
        componentId,
        (label) =>
          `You cannot use ${label} outside of a ${createLabel(ctxProviderId)}.`,
        props
      );
    }
  }

  const toReadonly = (ctx) => {
    const { subscribe } = getContext(ctx);
    return { subscribe };
  };

  /**
     * Access the current location via a readable store.
     * @returns {import("svelte/store").Readable<{
        pathname: string;
        search: string;
        hash: string;
        state: {};
      }>}
     *
     * @example
      ```html
      <script>
        import { useLocation } from "svelte-navigator";

        const location = useLocation();

        $: console.log($location);
        // {
        //   pathname: "/blog",
        //   search: "?id=123",
        //   hash: "#comments",
        //   state: {}
        // }
      </script>
      ```
     */
  function useLocation() {
    usePreflightCheck(USE_LOCATION_ID);
    return toReadonly(LOCATION);
  }

  /**
     * @typedef {{
        path: string;
        fullPath: string;
        uri: string;
        params: {};
      }} RouteMatch
     */

  /**
   * @typedef {import("svelte/store").Readable<RouteMatch|null>} RouteMatchStore
   */

  /**
   * Access the history of top level Router.
   */
  function useHistory() {
    const { history } = getContext(ROUTER);
    return history;
  }

  /**
   * Access the base of the parent Route.
   */
  function useRouteBase() {
    const route = getContext(ROUTE);
    return route ? derived(route, (_route) => _route.base) : writable("/");
  }

  /**
     * Resolve a given link relative to the current `Route` and the `Router`s `basepath`.
     * It is used under the hood in `Link` and `useNavigate`.
     * You can use it to manually resolve links, when using the `link` or `links` actions.
     *
     * @returns {(path: string) => string}
     *
     * @example
      ```html
      <script>
        import { link, useResolve } from "svelte-navigator";

        const resolve = useResolve();
        // `resolvedLink` will be resolved relative to its parent Route
        // and the Routers `basepath`
        const resolvedLink = resolve("relativePath");
      </script>

      <a href={resolvedLink} use:link>Relative link</a>
      ```
     */
  function useResolve() {
    usePreflightCheck(USE_RESOLVE_ID);
    const routeBase = useRouteBase();
    const { basepath: appBase } = getContext(ROUTER);
    /**
     * Resolves the path relative to the current route and basepath.
     *
     * @param {string} path The path to resolve
     * @returns {string} The resolved path
     */
    const resolve = (path) =>
      resolveLink(path, get_store_value(routeBase), appBase);
    return resolve;
  }

  /**
     * A hook, that returns a context-aware version of `navigate`.
     * It will automatically resolve the given link relative to the current Route.
     * It will also resolve a link against the `basepath` of the Router.
     *
     * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router>
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /absolutePath
      </button>
      ```
      *
      * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router basepath="/base">
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /base/route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /base/absolutePath
      </button>
      ```
     */
  function useNavigate() {
    usePreflightCheck(USE_NAVIGATE_ID);
    const resolve = useResolve();
    const { navigate } = useHistory();
    /**
     * Navigate to a new route.
     * Resolves the link relative to the current route and basepath.
     *
     * @param {string|number} to The path to navigate to.
     *
     * If `to` is a number we will navigate to the stack entry index + `to`
     * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
     * @param {Object} options
     * @param {*} [options.state]
     * @param {boolean} [options.replace=false]
     */
    const navigateRelative = (to, options) => {
      // If to is a number, we navigate to the target stack entry via `history.go`.
      // Otherwise resolve the link
      const target = isNumber(to) ? to : resolve(to);
      return navigate(target, options);
    };
    return navigateRelative;
  }

  /* node_modules/svelte-navigator/src/Route.svelte generated by Svelte v3.50.1 */
  const file$j = "node_modules/svelte-navigator/src/Route.svelte";

  const get_default_slot_changes = (dirty) => ({
    params: dirty & /*$params*/ 16,
    location: dirty & /*$location*/ 8,
  });

  const get_default_slot_context = (ctx) => ({
    params: isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    location: /*$location*/ ctx[3],
    navigate: /*navigate*/ ctx[10],
  });

  // (97:0) {#if isActive}
  function create_if_block$d(ctx) {
    let router;
    let current;

    router = new Router$1({
      props: {
        primary: /*primary*/ ctx[1],
        $$slots: { default: [create_default_slot$2] },
        $$scope: { ctx },
      },
      $$inline: true,
    });

    const block = {
      c: function create() {
        create_component(router.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(router, target, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        const router_changes = {};
        if (dirty & /*primary*/ 2) router_changes.primary = /*primary*/ ctx[1];

        if (
          dirty & /*$$scope, component, $location, $params, $$restProps*/ 264217
        ) {
          router_changes.$$scope = { dirty, ctx };
        }

        router.$set(router_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(router.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(router.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(router, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$d.name,
      type: "if",
      source: "(97:0) {#if isActive}",
      ctx,
    });

    return block;
  }

  // (113:2) {:else}
  function create_else_block$6(ctx) {
    let current;
    const default_slot_template = /*#slots*/ ctx[17].default;
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/ ctx[18],
      get_default_slot_context
    );

    const block = {
      c: function create() {
        if (default_slot) default_slot.c();
      },
      m: function mount(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor);
        }

        current = true;
      },
      p: function update(ctx, dirty) {
        if (default_slot) {
          if (
            default_slot.p &&
            (!current || dirty & /*$$scope, $params, $location*/ 262168)
          ) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx,
              /*$$scope*/ ctx[18],
              !current
                ? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
                : get_slot_changes(
                    default_slot_template,
                    /*$$scope*/ ctx[18],
                    dirty,
                    get_default_slot_changes
                  ),
              get_default_slot_context
            );
          }
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(default_slot, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (default_slot) default_slot.d(detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_else_block$6.name,
      type: "else",
      source: "(113:2) {:else}",
      ctx,
    });

    return block;
  }

  // (105:2) {#if component !== null}
  function create_if_block_1$9(ctx) {
    let switch_instance;
    let switch_instance_anchor;
    let current;

    const switch_instance_spread_levels = [
      { location: /*$location*/ ctx[3] },
      { navigate: /*navigate*/ ctx[10] },
      isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
      /*$$restProps*/ ctx[11],
    ];

    var switch_value = /*component*/ ctx[0];

    function switch_props(ctx) {
      let switch_instance_props = {};

      for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
        switch_instance_props = assign(
          switch_instance_props,
          switch_instance_spread_levels[i]
        );
      }

      return {
        props: switch_instance_props,
        $$inline: true,
      };
    }

    if (switch_value) {
      switch_instance = new switch_value(switch_props());
    }

    const block = {
      c: function create() {
        if (switch_instance) create_component(switch_instance.$$.fragment);
        switch_instance_anchor = empty();
      },
      m: function mount(target, anchor) {
        if (switch_instance) {
          mount_component(switch_instance, target, anchor);
        }

        insert_dev(target, switch_instance_anchor, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        const switch_instance_changes =
          dirty &
          /*$location, navigate, isSSR, get, params, $params, $$restProps*/ 3608
            ? get_spread_update(switch_instance_spread_levels, [
                dirty & /*$location*/ 8 && { location: /*$location*/ ctx[3] },
                dirty & /*navigate*/ 1024 && { navigate: /*navigate*/ ctx[10] },
                dirty & /*isSSR, get, params, $params*/ 528 &&
                  get_spread_object(
                    isSSR
                      ? get_store_value(/*params*/ ctx[9])
                      : /*$params*/ ctx[4]
                  ),
                dirty & /*$$restProps*/ 2048 &&
                  get_spread_object(/*$$restProps*/ ctx[11]),
              ])
            : {};

        if (switch_value !== (switch_value = /*component*/ ctx[0])) {
          if (switch_instance) {
            group_outros();
            const old_component = switch_instance;

            transition_out(old_component.$$.fragment, 1, 0, () => {
              destroy_component(old_component, 1);
            });

            check_outros();
          }

          if (switch_value) {
            switch_instance = new switch_value(switch_props());
            create_component(switch_instance.$$.fragment);
            transition_in(switch_instance.$$.fragment, 1);
            mount_component(
              switch_instance,
              switch_instance_anchor.parentNode,
              switch_instance_anchor
            );
          } else {
            switch_instance = null;
          }
        } else if (switch_value) {
          switch_instance.$set(switch_instance_changes);
        }
      },
      i: function intro(local) {
        if (current) return;
        if (switch_instance) transition_in(switch_instance.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        if (switch_instance) transition_out(switch_instance.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(switch_instance_anchor);
        if (switch_instance) destroy_component(switch_instance, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_1$9.name,
      type: "if",
      source: "(105:2) {#if component !== null}",
      ctx,
    });

    return block;
  }

  // (98:1) <Router {primary}>
  function create_default_slot$2(ctx) {
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    const if_block_creators = [create_if_block_1$9, create_else_block$6];
    const if_blocks = [];

    function select_block_type(ctx, dirty) {
      if (/*component*/ ctx[0] !== null) return 0;
      return 1;
    }

    current_block_type_index = select_block_type(ctx);
    if_block = if_blocks[current_block_type_index] =
      if_block_creators[current_block_type_index](ctx);

    const block = {
      c: function create() {
        if_block.c();
        if_block_anchor = empty();
      },
      m: function mount(target, anchor) {
        if_blocks[current_block_type_index].m(target, anchor);
        insert_dev(target, if_block_anchor, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx);

        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx, dirty);
        } else {
          group_outros();

          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });

          check_outros();
          if_block = if_blocks[current_block_type_index];

          if (!if_block) {
            if_block = if_blocks[current_block_type_index] =
              if_block_creators[current_block_type_index](ctx);
            if_block.c();
          } else {
            if_block.p(ctx, dirty);
          }

          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(if_block);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block);
        current = false;
      },
      d: function destroy(detaching) {
        if_blocks[current_block_type_index].d(detaching);
        if (detaching) detach_dev(if_block_anchor);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_default_slot$2.name,
      type: "slot",
      source: "(98:1) <Router {primary}>",
      ctx,
    });

    return block;
  }

  function create_fragment$j(ctx) {
    let div0;
    let t0;
    let t1;
    let div1;
    let current;
    let if_block = /*isActive*/ ctx[2] && create_if_block$d(ctx);

    const block = {
      c: function create() {
        div0 = element("div");
        t0 = space();
        if (if_block) if_block.c();
        t1 = space();
        div1 = element("div");
        set_style(div0, "display", "none");
        attr_dev(div0, "aria-hidden", "true");
        attr_dev(div0, "data-svnav-route-start", /*id*/ ctx[5]);
        add_location(div0, file$j, 95, 0, 2622);
        set_style(div1, "display", "none");
        attr_dev(div1, "aria-hidden", "true");
        attr_dev(div1, "data-svnav-route-end", /*id*/ ctx[5]);
        add_location(div1, file$j, 121, 0, 3295);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div0, anchor);
        insert_dev(target, t0, anchor);
        if (if_block) if_block.m(target, anchor);
        insert_dev(target, t1, anchor);
        insert_dev(target, div1, anchor);
        current = true;
      },
      p: function update(ctx, [dirty]) {
        if (/*isActive*/ ctx[2]) {
          if (if_block) {
            if_block.p(ctx, dirty);

            if (dirty & /*isActive*/ 4) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block$d(ctx);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(t1.parentNode, t1);
          }
        } else if (if_block) {
          group_outros();

          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });

          check_outros();
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(if_block);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div0);
        if (detaching) detach_dev(t0);
        if (if_block) if_block.d(detaching);
        if (detaching) detach_dev(t1);
        if (detaching) detach_dev(div1);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$j.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  const createId = createCounter();

  function instance$j($$self, $$props, $$invalidate) {
    let isActive;
    const omit_props_names = ["path", "component", "meta", "primary"];
    let $$restProps = compute_rest_props($$props, omit_props_names);
    let $activeRoute;
    let $location;
    let $parentBase;
    let $params;
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("Route", slots, ["default"]);
    let { path = "" } = $$props;
    let { component = null } = $$props;
    let { meta = {} } = $$props;
    let { primary = true } = $$props;
    usePreflightCheck(ROUTE_ID, $$props);
    const id = createId();
    const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    validate_store(activeRoute, "activeRoute");
    component_subscribe($$self, activeRoute, (value) =>
      $$invalidate(15, ($activeRoute = value))
    );
    const parentBase = useRouteBase();
    validate_store(parentBase, "parentBase");
    component_subscribe($$self, parentBase, (value) =>
      $$invalidate(16, ($parentBase = value))
    );
    const location = useLocation();
    validate_store(location, "location");
    component_subscribe($$self, location, (value) =>
      $$invalidate(3, ($location = value))
    );
    const focusElement = writable(null);

    // In SSR we cannot wait for $activeRoute to update,
    // so we use the match returned from `registerRoute` instead
    let ssrMatch;

    const route = writable();
    const params = writable({});
    validate_store(params, "params");
    component_subscribe($$self, params, (value) =>
      $$invalidate(4, ($params = value))
    );
    setContext(ROUTE, route);
    setContext(ROUTE_PARAMS, params);
    setContext(FOCUS_ELEM, focusElement);

    // We need to call useNavigate after the route is set,
    // so we can use the routes path for link resolution
    const navigate = useNavigate();

    // There is no need to unregister Routes in SSR since it will all be
    // thrown away anyway
    if (!isSSR) {
      onDestroy(() => unregisterRoute(id));
    }

    $$self.$$set = ($$new_props) => {
      $$invalidate(
        23,
        ($$props = assign(
          assign({}, $$props),
          exclude_internal_props($$new_props)
        ))
      );
      $$invalidate(
        11,
        ($$restProps = compute_rest_props($$props, omit_props_names))
      );
      if ("path" in $$new_props) $$invalidate(12, (path = $$new_props.path));
      if ("component" in $$new_props)
        $$invalidate(0, (component = $$new_props.component));
      if ("meta" in $$new_props) $$invalidate(13, (meta = $$new_props.meta));
      if ("primary" in $$new_props)
        $$invalidate(1, (primary = $$new_props.primary));
      if ("$$scope" in $$new_props)
        $$invalidate(18, ($$scope = $$new_props.$$scope));
    };

    $$self.$capture_state = () => ({
      createCounter,
      createId,
      getContext,
      onDestroy,
      setContext,
      writable,
      get: get_store_value,
      Router: Router$1,
      ROUTER,
      ROUTE,
      ROUTE_PARAMS,
      FOCUS_ELEM,
      useLocation,
      useNavigate,
      useRouteBase,
      usePreflightCheck,
      isSSR,
      extractBaseUri,
      join,
      ROUTE_ID,
      path,
      component,
      meta,
      primary,
      id,
      registerRoute,
      unregisterRoute,
      activeRoute,
      parentBase,
      location,
      focusElement,
      ssrMatch,
      route,
      params,
      navigate,
      isActive,
      $activeRoute,
      $location,
      $parentBase,
      $params,
    });

    $$self.$inject_state = ($$new_props) => {
      $$invalidate(23, ($$props = assign(assign({}, $$props), $$new_props)));
      if ("path" in $$props) $$invalidate(12, (path = $$new_props.path));
      if ("component" in $$props)
        $$invalidate(0, (component = $$new_props.component));
      if ("meta" in $$props) $$invalidate(13, (meta = $$new_props.meta));
      if ("primary" in $$props)
        $$invalidate(1, (primary = $$new_props.primary));
      if ("ssrMatch" in $$props)
        $$invalidate(14, (ssrMatch = $$new_props.ssrMatch));
      if ("isActive" in $$props)
        $$invalidate(2, (isActive = $$new_props.isActive));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    $$self.$$.update = () => {
      if (
        $$self.$$.dirty & /*path, $parentBase, meta, $location, primary*/ 77834
      ) {
        {
          // The route store will be re-computed whenever props, location or parentBase change
          const isDefault = path === "";

          const rawBase = join($parentBase, path);

          const updatedRoute = {
            id,
            path,
            meta,
            // If no path prop is given, this Route will act as the default Route
            // that is rendered if no other Route in the Router is a match
            default: isDefault,
            fullPath: isDefault ? "" : rawBase,
            base: isDefault
              ? $parentBase
              : extractBaseUri(rawBase, $location.pathname),
            primary,
            focusElement,
          };

          route.set(updatedRoute);

          // If we're in SSR mode and the Route matches,
          // `registerRoute` will return the match
          $$invalidate(14, (ssrMatch = registerRoute(updatedRoute)));
        }
      }

      if ($$self.$$.dirty & /*ssrMatch, $activeRoute*/ 49152) {
        $$invalidate(
          2,
          (isActive = !!(ssrMatch || ($activeRoute && $activeRoute.id === id)))
        );
      }

      if ($$self.$$.dirty & /*isActive, ssrMatch, $activeRoute*/ 49156) {
        if (isActive) {
          const { params: activeParams } = ssrMatch || $activeRoute;
          params.set(activeParams);
        }
      }
    };

    $$props = exclude_internal_props($$props);

    return [
      component,
      primary,
      isActive,
      $location,
      $params,
      id,
      activeRoute,
      parentBase,
      location,
      params,
      navigate,
      $$restProps,
      path,
      meta,
      ssrMatch,
      $activeRoute,
      $parentBase,
      slots,
      $$scope,
    ];
  }

  class Route extends SvelteComponentDev {
    constructor(options) {
      super(options);

      init(this, options, instance$j, create_fragment$j, safe_not_equal, {
        path: 12,
        component: 0,
        meta: 13,
        primary: 1,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Route",
        options,
        id: create_fragment$j.name,
      });
    }

    get path() {
      throw new Error(
        "<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set path(value) {
      throw new Error(
        "<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get component() {
      throw new Error(
        "<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set component(value) {
      throw new Error(
        "<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get meta() {
      throw new Error(
        "<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set meta(value) {
      throw new Error(
        "<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get primary() {
      throw new Error(
        "<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set primary(value) {
      throw new Error(
        "<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  var Route$1 = Route;

  const durationUnitRegex = /[a-zA-Z]/;
  const range = (size, startAt = 0) =>
    [...Array(size).keys()].map((i) => i + startAt);
  // export const characterRange = (startChar, endChar) =>
  //   String.fromCharCode(
  //     ...range(
  //       endChar.charCodeAt(0) - startChar.charCodeAt(0),
  //       startChar.charCodeAt(0)
  //     )
  //   );
  // export const zip = (arr, ...arrs) =>
  //   arr.map((val, i) => arrs.reduce((list, curr) => [...list, curr[i]], [val]));

  /* node_modules/svelte-loading-spinners/dist/Pulse.svelte generated by Svelte v3.50.1 */
  const file$i = "node_modules/svelte-loading-spinners/dist/Pulse.svelte";

  function get_each_context$6(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[6] = list[i];
    return child_ctx;
  }

  // (45:2) {#each range(3, 0) as version}
  function create_each_block$6(ctx) {
    let div;

    const block = {
      c: function create() {
        div = element("div");
        attr_dev(div, "class", "cube svelte-446r86");
        set_style(
          div,
          "animation-delay",
          /*version*/ ctx[6] * (+(/*durationNum*/ ctx[5]) / 10) +
            /*durationUnit*/ ctx[4]
        );
        set_style(
          div,
          "left",
          /*version*/ ctx[6] *
            (+(/*size*/ ctx[3]) / 3 + +(/*size*/ ctx[3]) / 15) +
            /*unit*/ ctx[1]
        );
        add_location(div, file$i, 45, 4, 1049);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*size, unit*/ 10) {
          set_style(
            div,
            "left",
            /*version*/ ctx[6] *
              (+(/*size*/ ctx[3]) / 3 + +(/*size*/ ctx[3]) / 15) +
              /*unit*/ ctx[1]
          );
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block$6.name,
      type: "each",
      source: "(45:2) {#each range(3, 0) as version}",
      ctx,
    });

    return block;
  }

  function create_fragment$i(ctx) {
    let div;
    let each_value = range(3, 0);
    validate_each_argument(each_value);
    let each_blocks = [];

    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$6(
        get_each_context$6(ctx, each_value, i)
      );
    }

    const block = {
      c: function create() {
        div = element("div");

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        attr_dev(div, "class", "wrapper svelte-446r86");
        set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
        set_style(div, "--color", /*color*/ ctx[0]);
        set_style(div, "--duration", /*duration*/ ctx[2]);
        add_location(div, file$i, 41, 0, 911);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(div, null);
        }
      },
      p: function update(ctx, [dirty]) {
        if (dirty & /*range, durationNum, durationUnit, size, unit*/ 58) {
          each_value = range(3, 0);
          validate_each_argument(each_value);
          let i;

          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context$6(ctx, each_value, i);

            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block$6(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(div, null);
            }
          }

          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }

          each_blocks.length = each_value.length;
        }

        if (dirty & /*size, unit*/ 10) {
          set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
        }

        if (dirty & /*color*/ 1) {
          set_style(div, "--color", /*color*/ ctx[0]);
        }

        if (dirty & /*duration*/ 4) {
          set_style(div, "--duration", /*duration*/ ctx[2]);
        }
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        destroy_each(each_blocks, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$i.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$i($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("Pulse", slots, []);
    let { color = "#FF3E00" } = $$props;
    let { unit = "px" } = $$props;
    let { duration = "1.5s" } = $$props;
    let { size = "60" } = $$props;
    let durationUnit = duration.match(durationUnitRegex)[0];
    let durationNum = duration.replace(durationUnitRegex, "");
    const writable_props = ["color", "unit", "duration", "size"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<Pulse> was created with unknown prop '${key}'`);
    });

    $$self.$$set = ($$props) => {
      if ("color" in $$props) $$invalidate(0, (color = $$props.color));
      if ("unit" in $$props) $$invalidate(1, (unit = $$props.unit));
      if ("duration" in $$props) $$invalidate(2, (duration = $$props.duration));
      if ("size" in $$props) $$invalidate(3, (size = $$props.size));
    };

    $$self.$capture_state = () => ({
      range,
      durationUnitRegex,
      color,
      unit,
      duration,
      size,
      durationUnit,
      durationNum,
    });

    $$self.$inject_state = ($$props) => {
      if ("color" in $$props) $$invalidate(0, (color = $$props.color));
      if ("unit" in $$props) $$invalidate(1, (unit = $$props.unit));
      if ("duration" in $$props) $$invalidate(2, (duration = $$props.duration));
      if ("size" in $$props) $$invalidate(3, (size = $$props.size));
      if ("durationUnit" in $$props)
        $$invalidate(4, (durationUnit = $$props.durationUnit));
      if ("durationNum" in $$props)
        $$invalidate(5, (durationNum = $$props.durationNum));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [color, unit, duration, size, durationUnit, durationNum];
  }

  class Pulse extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$i, create_fragment$i, safe_not_equal, {
        color: 0,
        unit: 1,
        duration: 2,
        size: 3,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Pulse",
        options,
        id: create_fragment$i.name,
      });
    }

    get color() {
      throw new Error(
        "<Pulse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set color(value) {
      throw new Error(
        "<Pulse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get unit() {
      throw new Error(
        "<Pulse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set unit(value) {
      throw new Error(
        "<Pulse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get duration() {
      throw new Error(
        "<Pulse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set duration(value) {
      throw new Error(
        "<Pulse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get size() {
      throw new Error(
        "<Pulse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set size(value) {
      throw new Error(
        "<Pulse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
    const o = +getComputedStyle(node).opacity;
    return {
      delay,
      duration,
      easing,
      css: (t) => `opacity: ${t * o}`,
    };
  }

  var ChessColor;
  (function (ChessColor) {
    ChessColor[(ChessColor["WHITE"] = 0)] = "WHITE";
    ChessColor[(ChessColor["BLACK"] = 1)] = "BLACK";
    ChessColor[(ChessColor["RANDOM"] = 2)] = "RANDOM";
  })(ChessColor || (ChessColor = {}));
  var ChessColor$1 = ChessColor;

  const modeIndex = writable(-1);

  /* src/components/Pairing.svelte generated by Svelte v3.50.1 */
  const file$h = "src/components/Pairing.svelte";

  function get_each_context$5(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[8] = list[i];
    child_ctx[10] = i;
    return child_ctx;
  }

  // (73:6) {:else}
  function create_else_block_1$1(ctx) {
    let h2;
    let t0_value =
      `${/*minuteIncrement*/ ctx[8].minutes} + ${
        /*minuteIncrement*/ ctx[8].increment
      }` + "";
    let t0;
    let t1;
    let h5;
    let t2_value = getTimeControlMode(/*minuteIncrement*/ ctx[8]) + "";
    let t2;

    const block = {
      c: function create() {
        h2 = element("h2");
        t0 = text(t0_value);
        t1 = space();
        h5 = element("h5");
        t2 = text(t2_value);
        attr_dev(h2, "readonly", "");
        attr_dev(h2, "class", "svelte-y897na");
        add_location(h2, file$h, 73, 8, 2162);
        attr_dev(h5, "readonly", "");
        attr_dev(h5, "class", "svelte-y897na");
        add_location(h5, file$h, 76, 8, 2270);
      },
      m: function mount(target, anchor) {
        insert_dev(target, h2, anchor);
        append_dev(h2, t0);
        insert_dev(target, t1, anchor);
        insert_dev(target, h5, anchor);
        append_dev(h5, t2);
      },
      p: noop,
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(h2);
        if (detaching) detach_dev(t1);
        if (detaching) detach_dev(h5);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_else_block_1$1.name,
      type: "else",
      source: "(73:6) {:else}",
      ctx,
    });

    return block;
  }

  // (69:6) {#if index === modeSelected}
  function create_if_block_1$8(ctx) {
    let div;
    let pulse;
    let div_intro;
    let current;

    pulse = new Pulse({
      props: { size: "50", color: "orange", unit: "px" },
      $$inline: true,
    });

    const block = {
      c: function create() {
        div = element("div");
        create_component(pulse.$$.fragment);
        add_location(div, file$h, 69, 8, 2039);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        mount_component(pulse, div, null);
        current = true;
      },
      p: noop,
      i: function intro(local) {
        if (current) return;
        transition_in(pulse.$$.fragment, local);

        if (!div_intro) {
          add_render_callback(() => {
            div_intro = create_in_transition(div, fade, { delay: 100 });
            div_intro.start();
          });
        }

        current = true;
      },
      o: function outro(local) {
        transition_out(pulse.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        destroy_component(pulse);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_1$8.name,
      type: "if",
      source: "(69:6) {#if index === modeSelected}",
      ctx,
    });

    return block;
  }

  // (64:2) {#each defaultMinuteIncrements as minuteIncrement, index}
  function create_each_block$5(ctx) {
    let div;
    let current_block_type_index;
    let if_block;
    let div_class_value;
    let current;
    let mounted;
    let dispose;
    const if_block_creators = [create_if_block_1$8, create_else_block_1$1];
    const if_blocks = [];

    function select_block_type(ctx, dirty) {
      if (/*index*/ ctx[10] === /*modeSelected*/ ctx[0]) return 0;
      return 1;
    }

    current_block_type_index = select_block_type(ctx);
    if_block = if_blocks[current_block_type_index] =
      if_block_creators[current_block_type_index](ctx);

    function click_handler() {
      return /*click_handler*/ ctx[4](
        /*minuteIncrement*/ ctx[8],
        /*index*/ ctx[10]
      );
    }

    const block = {
      c: function create() {
        div = element("div");
        if_block.c();

        attr_dev(
          div,
          "class",
          (div_class_value =
            "" +
            (null_to_empty(
              /*index*/ ctx[10] === /*modeSelected*/ ctx[0]
                ? "time-control-clicked"
                : "time-control"
            ) +
              " svelte-y897na"))
        );

        add_location(div, file$h, 64, 4, 1843);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        if_blocks[current_block_type_index].m(div, null);
        current = true;

        if (!mounted) {
          dispose = listen_dev(
            div,
            "click",
            click_handler,
            false,
            false,
            false
          );
          mounted = true;
        }
      },
      p: function update(new_ctx, dirty) {
        ctx = new_ctx;
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx);

        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx, dirty);
        } else {
          group_outros();

          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });

          check_outros();
          if_block = if_blocks[current_block_type_index];

          if (!if_block) {
            if_block = if_blocks[current_block_type_index] =
              if_block_creators[current_block_type_index](ctx);
            if_block.c();
          } else {
            if_block.p(ctx, dirty);
          }

          transition_in(if_block, 1);
          if_block.m(div, null);
        }

        if (
          !current ||
          (dirty & /*modeSelected*/ 1 &&
            div_class_value !==
              (div_class_value =
                "" +
                (null_to_empty(
                  /*index*/ ctx[10] === /*modeSelected*/ ctx[0]
                    ? "time-control-clicked"
                    : "time-control"
                ) +
                  " svelte-y897na")))
        ) {
          attr_dev(div, "class", div_class_value);
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(if_block);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        if_blocks[current_block_type_index].d();
        mounted = false;
        dispose();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block$5.name,
      type: "each",
      source:
        "(64:2) {#each defaultMinuteIncrements as minuteIncrement, index}",
      ctx,
    });

    return block;
  }

  // (91:4) {:else}
  function create_else_block$5(ctx) {
    let h4;

    const block = {
      c: function create() {
        h4 = element("h4");
        h4.textContent = "Custom";
        attr_dev(h4, "readonly", "");
        add_location(h4, file$h, 91, 6, 2648);
      },
      m: function mount(target, anchor) {
        insert_dev(target, h4, anchor);
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(h4);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_else_block$5.name,
      type: "else",
      source: "(91:4) {:else}",
      ctx,
    });

    return block;
  }

  // (87:4) {#if modeSelected === 11}
  function create_if_block$c(ctx) {
    let div;
    let pulse;
    let div_intro;
    let current;

    pulse = new Pulse({
      props: { size: "50", color: "orange", unit: "px" },
      $$inline: true,
    });

    const block = {
      c: function create() {
        div = element("div");
        create_component(pulse.$$.fragment);
        add_location(div, file$h, 87, 6, 2533);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        mount_component(pulse, div, null);
        current = true;
      },
      i: function intro(local) {
        if (current) return;
        transition_in(pulse.$$.fragment, local);

        if (!div_intro) {
          add_render_callback(() => {
            div_intro = create_in_transition(div, fade, { delay: 100 });
            div_intro.start();
          });
        }

        current = true;
      },
      o: function outro(local) {
        transition_out(pulse.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        destroy_component(pulse);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$c.name,
      type: "if",
      source: "(87:4) {#if modeSelected === 11}",
      ctx,
    });

    return block;
  }

  function create_fragment$h(ctx) {
    let div1;
    let t;
    let div0;
    let current_block_type_index;
    let if_block;
    let div0_class_value;
    let current;
    let mounted;
    let dispose;
    let each_value = /*defaultMinuteIncrements*/ ctx[1];
    validate_each_argument(each_value);
    let each_blocks = [];

    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$5(
        get_each_context$5(ctx, each_value, i)
      );
    }

    const out = (i) =>
      transition_out(each_blocks[i], 1, 1, () => {
        each_blocks[i] = null;
      });

    const if_block_creators = [create_if_block$c, create_else_block$5];
    const if_blocks = [];

    function select_block_type_1(ctx, dirty) {
      if (/*modeSelected*/ ctx[0] === 11) return 0;
      return 1;
    }

    current_block_type_index = select_block_type_1(ctx);
    if_block = if_blocks[current_block_type_index] =
      if_block_creators[current_block_type_index](ctx);

    const block = {
      c: function create() {
        div1 = element("div");

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        t = space();
        div0 = element("div");
        if_block.c();

        attr_dev(
          div0,
          "class",
          (div0_class_value =
            "" +
            (null_to_empty(
              /*modeSelected*/ ctx[0] === 11
                ? "time-control-clicked"
                : "time-control"
            ) +
              " svelte-y897na"))
        );

        add_location(div0, file$h, 82, 2, 2381);
        attr_dev(div1, "class", "container svelte-y897na");
        add_location(div1, file$h, 62, 0, 1745);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div1, anchor);

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(div1, null);
        }

        append_dev(div1, t);
        append_dev(div1, div0);
        if_blocks[current_block_type_index].m(div0, null);
        current = true;

        if (!mounted) {
          dispose = [
            listen_dev(
              div0,
              "click",
              /*handleCustomClick*/ ctx[3],
              false,
              false,
              false
            ),
            action_destroyer(focus.call(null, div1)),
          ];

          mounted = true;
        }
      },
      p: function update(ctx, [dirty]) {
        if (
          dirty &
          /*modeSelected, handleModeClick, defaultMinuteIncrements, getTimeControlMode*/ 7
        ) {
          each_value = /*defaultMinuteIncrements*/ ctx[1];
          validate_each_argument(each_value);
          let i;

          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context$5(ctx, each_value, i);

            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block$5(child_ctx);
              each_blocks[i].c();
              transition_in(each_blocks[i], 1);
              each_blocks[i].m(div1, t);
            }
          }

          group_outros();

          for (i = each_value.length; i < each_blocks.length; i += 1) {
            out(i);
          }

          check_outros();
        }

        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type_1(ctx);

        if (current_block_type_index !== previous_block_index) {
          group_outros();

          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });

          check_outros();
          if_block = if_blocks[current_block_type_index];

          if (!if_block) {
            if_block = if_blocks[current_block_type_index] =
              if_block_creators[current_block_type_index](ctx);
            if_block.c();
          }

          transition_in(if_block, 1);
          if_block.m(div0, null);
        }

        if (
          !current ||
          (dirty & /*modeSelected*/ 1 &&
            div0_class_value !==
              (div0_class_value =
                "" +
                (null_to_empty(
                  /*modeSelected*/ ctx[0] === 11
                    ? "time-control-clicked"
                    : "time-control"
                ) +
                  " svelte-y897na")))
        ) {
          attr_dev(div0, "class", div0_class_value);
        }
      },
      i: function intro(local) {
        if (current) return;

        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }

        transition_in(if_block);
        current = true;
      },
      o: function outro(local) {
        each_blocks = each_blocks.filter(Boolean);

        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }

        transition_out(if_block);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div1);
        destroy_each(each_blocks, detaching);
        if_blocks[current_block_type_index].d();
        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$h.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function getTimeControlMode(timeControl) {
    if (timeControl.minutes < 3) return "Bullet";
    if (timeControl.minutes < 10) return "Blitz";
    if (timeControl.minutes < 30) return "Rapid";
    return "Classical";
  }

  function focus(element) {
    element.focus();
  }

  function instance$h($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("Pairing", slots, []);
    const dispatch = createEventDispatcher();

    const defaultMinuteIncrements = [
      { minutes: 1, increment: 0 },
      { minutes: 2, increment: 1 },
      { minutes: 3, increment: 0 },
      { minutes: 3, increment: 2 },
      { minutes: 5, increment: 0 },
      { minutes: 5, increment: 3 },
      { minutes: 10, increment: 0 },
      { minutes: 10, increment: 5 },
      { minutes: 15, increment: 10 },
      { minutes: 30, increment: 0 },
      { minutes: 30, increment: 20 },
    ];

    let modeSelected = -1;
    let openCustomModal = false;

    const modeUnsub = modeIndex.subscribe((val) => {
      $$invalidate(0, (modeSelected = val));
    });

    onDestroy(modeUnsub);

    function handleModeClick(mode, index) {
      if (modeSelected !== index) {
        modeIndex.set(index);

        dispatch("joinLobby", {
          mode: `${mode.minutes}:${mode.increment}`,
          color: ChessColor$1.RANDOM,
        });
      } else if (modeSelected === index) {
        modeIndex.set(-1);
        dispatch("leaveLobby");
      }
    }

    function handleCustomClick() {
      if (modeSelected !== 11) {
        dispatch("leaveLobby");
        dispatch("openCustomModal");
      } else {
        modeIndex.set(-1);
        dispatch("leaveLobby");
      }
    }

    const writable_props = [];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<Pairing> was created with unknown prop '${key}'`);
    });

    const click_handler = (minuteIncrement, index) =>
      handleModeClick(minuteIncrement, index);

    $$self.$capture_state = () => ({
      Pulse,
      createEventDispatcher,
      onDestroy,
      fade,
      ChessColor: ChessColor$1,
      modeIndex,
      dispatch,
      defaultMinuteIncrements,
      modeSelected,
      openCustomModal,
      modeUnsub,
      getTimeControlMode,
      handleModeClick,
      handleCustomClick,
      focus,
    });

    $$self.$inject_state = ($$props) => {
      if ("modeSelected" in $$props)
        $$invalidate(0, (modeSelected = $$props.modeSelected));
      if ("openCustomModal" in $$props)
        openCustomModal = $$props.openCustomModal;
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [
      modeSelected,
      defaultMinuteIncrements,
      handleModeClick,
      handleCustomClick,
      click_handler,
    ];
  }

  class Pairing extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Pairing",
        options,
        id: create_fragment$h.name,
      });
    }
  }

  /* src/components/SwitchContainer.svelte generated by Svelte v3.50.1 */
  const file$g = "src/components/SwitchContainer.svelte";

  function get_each_context$4(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[11] = list[i];
    child_ctx[13] = i;
    return child_ctx;
  }

  // (19:4) {#each switchItems as item, index}
  function create_each_block$4(ctx) {
    let div1;
    let h3;
    let t0_value = /*item*/ ctx[11] + "";
    let t0;
    let t1;
    let div0;
    let t2;
    let mounted;
    let dispose;

    function mouseover_handler() {
      return /*mouseover_handler*/ ctx[8](/*index*/ ctx[13]);
    }

    function click_handler() {
      return /*click_handler*/ ctx[9](/*index*/ ctx[13]);
    }

    const block = {
      c: function create() {
        div1 = element("div");
        h3 = element("h3");
        t0 = text(t0_value);
        t1 = space();
        div0 = element("div");
        t2 = space();
        attr_dev(h3, "class", "svelte-19nerzx");
        set_style(
          h3,
          "color",
          /*selected*/ ctx[0] === /*index*/ ctx[13] ? "green" : "",
          false
        );
        add_location(h3, file$g, 26, 8, 645);
        attr_dev(div0, "class", "bar svelte-19nerzx");

        set_style(
          div0,
          "background-color",
          /*selected*/ ctx[0] === /*index*/ ctx[13]
            ? "green"
            : /*hoverOver*/ ctx[1] === /*index*/ ctx[13]
            ? "green"
            : "darkgray",
          false
        );

        add_location(div0, file$g, 29, 8, 737);
        attr_dev(div1, "class", "switch-item svelte-19nerzx");
        add_location(div1, file$g, 19, 6, 453);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div1, anchor);
        append_dev(div1, h3);
        append_dev(h3, t0);
        append_dev(div1, t1);
        append_dev(div1, div0);
        append_dev(div1, t2);

        if (!mounted) {
          dispose = [
            listen_dev(div1, "focus", focus_handler$1, false, false, false),
            listen_dev(
              div1,
              "mouseover",
              mouseover_handler,
              false,
              false,
              false
            ),
            listen_dev(
              div1,
              "mouseleave",
              /*hoverExit*/ ctx[5],
              false,
              false,
              false
            ),
            listen_dev(div1, "click", click_handler, false, false, false),
          ];

          mounted = true;
        }
      },
      p: function update(new_ctx, dirty) {
        ctx = new_ctx;

        if (dirty & /*selected*/ 1) {
          set_style(
            h3,
            "color",
            /*selected*/ ctx[0] === /*index*/ ctx[13] ? "green" : "",
            false
          );
        }

        if (dirty & /*selected, hoverOver*/ 3) {
          set_style(
            div0,
            "background-color",
            /*selected*/ ctx[0] === /*index*/ ctx[13]
              ? "green"
              : /*hoverOver*/ ctx[1] === /*index*/ ctx[13]
              ? "green"
              : "darkgray",
            false
          );
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div1);
        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block$4.name,
      type: "each",
      source: "(19:4) {#each switchItems as item, index}",
      ctx,
    });

    return block;
  }

  function create_fragment$g(ctx) {
    let div2;
    let div0;
    let t;
    let div1;
    let current;
    let each_value = /*switchItems*/ ctx[2];
    validate_each_argument(each_value);
    let each_blocks = [];

    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$4(
        get_each_context$4(ctx, each_value, i)
      );
    }

    const default_slot_template = /*#slots*/ ctx[7].default;
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/ ctx[6],
      null
    );

    const block = {
      c: function create() {
        div2 = element("div");
        div0 = element("div");

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        t = space();
        div1 = element("div");
        if (default_slot) default_slot.c();
        attr_dev(div0, "id", "switch");
        attr_dev(div0, "class", "svelte-19nerzx");
        add_location(div0, file$g, 17, 2, 390);
        attr_dev(div1, "id", "child-container");
        attr_dev(div1, "class", "svelte-19nerzx");
        add_location(div1, file$g, 40, 2, 968);
        attr_dev(div2, "id", "container");
        attr_dev(div2, "class", "svelte-19nerzx");
        add_location(div2, file$g, 16, 0, 367);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div2, anchor);
        append_dev(div2, div0);

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(div0, null);
        }

        append_dev(div2, t);
        append_dev(div2, div1);

        if (default_slot) {
          default_slot.m(div1, null);
        }

        current = true;
      },
      p: function update(ctx, [dirty]) {
        if (
          dirty &
          /*hover, hoverExit, select, selected, hoverOver, switchItems*/ 63
        ) {
          each_value = /*switchItems*/ ctx[2];
          validate_each_argument(each_value);
          let i;

          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context$4(ctx, each_value, i);

            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block$4(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(div0, null);
            }
          }

          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }

          each_blocks.length = each_value.length;
        }

        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx,
              /*$$scope*/ ctx[6],
              !current
                ? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
                : get_slot_changes(
                    default_slot_template,
                    /*$$scope*/ ctx[6],
                    dirty,
                    null
                  ),
              null
            );
          }
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(default_slot, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div2);
        destroy_each(each_blocks, detaching);
        if (default_slot) default_slot.d(detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$g.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  const focus_handler$1 = () => {};

  function instance$g($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("SwitchContainer", slots, ["default"]);
    const dispatch = createEventDispatcher();
    let { selected = 0 } = $$props;
    let hoverOver = -1;
    const switchItems = ["Pairing", "Lobby", "Rooms"];

    function select(index) {
      dispatch("select", index);
    }

    function hover(index) {
      $$invalidate(1, (hoverOver = index));
    }

    function hoverExit() {
      $$invalidate(1, (hoverOver = -1));
    }

    const writable_props = ["selected"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(
          `<SwitchContainer> was created with unknown prop '${key}'`
        );
    });

    const mouseover_handler = (index) => hover(index);
    const click_handler = (index) => select(index);

    $$self.$$set = ($$props) => {
      if ("selected" in $$props) $$invalidate(0, (selected = $$props.selected));
      if ("$$scope" in $$props) $$invalidate(6, ($$scope = $$props.$$scope));
    };

    $$self.$capture_state = () => ({
      createEventDispatcher,
      dispatch,
      selected,
      hoverOver,
      switchItems,
      select,
      hover,
      hoverExit,
    });

    $$self.$inject_state = ($$props) => {
      if ("selected" in $$props) $$invalidate(0, (selected = $$props.selected));
      if ("hoverOver" in $$props)
        $$invalidate(1, (hoverOver = $$props.hoverOver));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [
      selected,
      hoverOver,
      switchItems,
      select,
      hover,
      hoverExit,
      $$scope,
      slots,
      mouseover_handler,
      click_handler,
    ];
  }

  class SwitchContainer extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$g, create_fragment$g, safe_not_equal, {
        selected: 0,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "SwitchContainer",
        options,
        id: create_fragment$g.name,
      });
    }

    get selected() {
      throw new Error(
        "<SwitchContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set selected(value) {
      throw new Error(
        "<SwitchContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  var img$i =
    "data:image/png;base64,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";

  var img$h =
    "data:image/png;base64,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";

  var img$g =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAQAAACQ9RH5AAAFCUlEQVRYw+2ZWWxUVRjHf3fKIiqoFMpm2YOgGFc244MiGBQFcUExxiguMVSjT+gDfcD4ghK3iFFccBdwS4kIBiQYhLoQXECRiCIVWigtxSKYMm1/PrQdZobpvcM0qSHhuy/nnuX/m++c73xn7r2B/D8W+5+4J8EnwWEWBMG1bSCb88V45PJcR7dlqjsBPdrVYybwB3vYj2xhLV8w7vg1OuT0a/sxqLl0HgDXUNpOa0wPejMDmcMVjCVoL4+xCoIaYItrc1M48fZxkMdIoCBnco5rPITfmotfUZCTQk6DCtmLg1put9O3vcAf4pUePFrxXruAGY2nu0uTK0cfr0pocAVBMCi4JhgX9Eqpvgpm0i+1a8pxEXQNhgSdcgwuxrCa2sTtIZZzHTERFuM7murxMhEG8iQbqUIkzs8sZuJxTTXdWEADYi/HO8r8loYdPEIer+DCdPD7jKGEhsDh3u1CS3zd+d5tF1nByCzB5LEOOzrbPbbYXuc7rKl5PS/g7HTwBuo7O8udpto+Hzc/zg3ZgYuxt1s81pbZV+QwDk8DBxa5W9WdvucjTnWmj1mq6h8WHmZUJJhRxANXmNmqvaW5469J4O5+quq3TjP1vBjnRnWbfSoZEAVeig8ZZvNEvCMBvtg/1X1enzGKzvJH9TtZEgqmM7VYZrgVizFXiTjEKrXUwla3bIGV6ohaOoSBJ+F5RtvDYi/xTLeqq+wYmi2WqDPT/p+lJ5Bz4bIsjpZnGM1eAj5gOD9xE/HQ3t8Ao+DS5Lp0cDX8kwU4YAEx7mcCFUymNqJ39ybhPWHgfVCeBRgu5V5eBOawK7LvJcAPsD2lMm2Ne1KXd0wayGwr1K3mRZ4H5xi33rMPc1rIGruPpQ08m5XPAPNpiOwzjw68yq7nPRTisXAJjXmuydLjmyL9LVZr7X2Q/DROhpQ5Fwv8OSvw9AhskdrgzXJnNrk6xmfYzeUZcXXu9Gs/doH3uN8ZDrZLK9BTXaTqgzIvq0NC6MybGHN+AldribO8wB4pubjFavzF1b7iDHsk2ka4RT3o7fJS0zmeBViER2nAq91qiROSMlNHCx3tVB9wru+6xq0eSJqPRjc620Lnekj9yeFHuK8V/dYXiClUYVOCzfMy57rBShuTMEcndYiXW+QyD6raoOpCTy1nbKvqYbFBPg14tk9anXG9jx3Syetdrerb8j69WtcOwt9zBbV0rSK/eeNtYzflVFBBORWUMy9RrqCcalq0RjKZlZ//MClUOnw/cABrrHRRSuCkB9fRACxyaEvr4nDlLJ4WH+RD6gDoz1D60idxTU+U+tKHfKYwBSjlOT6iPko2wuM6xJiTfN5tEWvcz5kusUbVMm/8IkI5ojmORe7IEFjVbrZThiFdvM/N6subw5WjgusAZ9RwJlBPKesTwVVBHdBIdVJw7WBd4mQeTMUHh6e3MbgqfNWpdk1piNnbi4ynzULcdc5peYpc3DaP/6Zbd/YDARcyMRFcBeQBMXomBdcFjKUD0MgynuXLJd7WFo+PIJ7va0lPFa0nkG5O8w3/VfWpTeHKUa8iShB+ZR2bOBK58Wr5hLvoTzEbzV/Zpu0kDOZ14k3+3OoTvuVaf7eulZSJSD1vMTRSN6pDM7yYTclVgX0ck6nrDp5mWDaaQfbfJIKBjGcAhfSnP4WckmioYxdllLGd5X6ftVquH0OCnhQykL8oo9IcRHIGt9VOvDd7J8EnDPg/ryi8MXGcJ5YAAAAASUVORK5CYII=";

  /* src/components/TableItem.svelte generated by Svelte v3.50.1 */
  const file$f = "src/components/TableItem.svelte";

  function create_fragment$f(ctx) {
    let tr;
    let td0;
    let t0;
    let t1;
    let td1;
    let t2;
    let t3;
    let td2;
    let img;
    let img_src_value;
    let mounted;
    let dispose;

    const block = {
      c: function create() {
        tr = element("tr");
        td0 = element("td");
        t0 = text(/*player*/ ctx[0]);
        t1 = space();
        td1 = element("td");
        t2 = text(/*mode*/ ctx[1]);
        t3 = space();
        td2 = element("td");
        img = element("img");
        attr_dev(td0, "class", "svelte-2l5av4");
        add_location(td0, file$f, 29, 2, 864);
        attr_dev(td1, "class", "svelte-2l5av4");
        add_location(td1, file$f, 30, 2, 884);
        attr_dev(img, "class", "icon svelte-2l5av4");
        if (
          !src_url_equal(
            img.src,
            (img_src_value = /*colorToIcon*/ ctx[3](/*color*/ ctx[2]))
          )
        )
          attr_dev(img, "src", img_src_value);
        attr_dev(img, "alt", "color icon");
        add_location(img, file$f, 31, 6, 906);
        attr_dev(td2, "class", "svelte-2l5av4");
        add_location(td2, file$f, 31, 2, 902);
        attr_dev(tr, "class", "svelte-2l5av4");
        add_location(tr, file$f, 28, 0, 831);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, tr, anchor);
        append_dev(tr, td0);
        append_dev(td0, t0);
        append_dev(tr, t1);
        append_dev(tr, td1);
        append_dev(td1, t2);
        append_dev(tr, t3);
        append_dev(tr, td2);
        append_dev(td2, img);

        if (!mounted) {
          dispose = listen_dev(
            tr,
            "click",
            /*handleRowClick*/ ctx[4],
            false,
            false,
            false
          );
          mounted = true;
        }
      },
      p: function update(ctx, [dirty]) {
        if (dirty & /*player*/ 1) set_data_dev(t0, /*player*/ ctx[0]);
        if (dirty & /*mode*/ 2) set_data_dev(t2, /*mode*/ ctx[1]);

        if (
          dirty & /*color*/ 4 &&
          !src_url_equal(
            img.src,
            (img_src_value = /*colorToIcon*/ ctx[3](/*color*/ ctx[2]))
          )
        ) {
          attr_dev(img, "src", img_src_value);
        }
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(tr);
        mounted = false;
        dispose();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$f.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$f($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("TableItem", slots, []);
    const dispatch = createEventDispatcher();
    let { player = "" } = $$props;
    let { mode = "" } = $$props;
    let { color = "" } = $$props;
    let { isLobbyItem = true } = $$props;

    function colorToIcon(color) {
      switch (color) {
        case "RANDOM":
          return img$g;
        case "WHITE":
          return img$h;
        case "BLACK":
          return img$i;
      }
    }

    function handleRowClick() {
      if (isLobbyItem)
        dispatch("joinLobby", { mode, color: ChessColor$1[color] });
      else dispatch("joinRoom", player);
    }

    const writable_props = ["player", "mode", "color", "isLobbyItem"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<TableItem> was created with unknown prop '${key}'`);
    });

    $$self.$$set = ($$props) => {
      if ("player" in $$props) $$invalidate(0, (player = $$props.player));
      if ("mode" in $$props) $$invalidate(1, (mode = $$props.mode));
      if ("color" in $$props) $$invalidate(2, (color = $$props.color));
      if ("isLobbyItem" in $$props)
        $$invalidate(5, (isLobbyItem = $$props.isLobbyItem));
    };

    $$self.$capture_state = () => ({
      BlackKing: img$i,
      WhiteKing: img$h,
      CombinedKing: img$g,
      createEventDispatcher,
      ChessColor: ChessColor$1,
      dispatch,
      player,
      mode,
      color,
      isLobbyItem,
      colorToIcon,
      handleRowClick,
    });

    $$self.$inject_state = ($$props) => {
      if ("player" in $$props) $$invalidate(0, (player = $$props.player));
      if ("mode" in $$props) $$invalidate(1, (mode = $$props.mode));
      if ("color" in $$props) $$invalidate(2, (color = $$props.color));
      if ("isLobbyItem" in $$props)
        $$invalidate(5, (isLobbyItem = $$props.isLobbyItem));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [player, mode, color, colorToIcon, handleRowClick, isLobbyItem];
  }

  class TableItem extends SvelteComponentDev {
    constructor(options) {
      super(options);

      init(this, options, instance$f, create_fragment$f, safe_not_equal, {
        player: 0,
        mode: 1,
        color: 2,
        isLobbyItem: 5,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "TableItem",
        options,
        id: create_fragment$f.name,
      });
    }

    get player() {
      throw new Error(
        "<TableItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set player(value) {
      throw new Error(
        "<TableItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get mode() {
      throw new Error(
        "<TableItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set mode(value) {
      throw new Error(
        "<TableItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get color() {
      throw new Error(
        "<TableItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set color(value) {
      throw new Error(
        "<TableItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get isLobbyItem() {
      throw new Error(
        "<TableItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set isLobbyItem(value) {
      throw new Error(
        "<TableItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  /* src/components/Table.svelte generated by Svelte v3.50.1 */
  const file$e = "src/components/Table.svelte";

  function get_each_context$3(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[5] = list[i];
    return child_ctx;
  }

  // (14:2) {#each lobbyTable as lobby}
  function create_each_block$3(ctx) {
    let tableitem;
    let current;

    tableitem = new TableItem({
      props: {
        player: /*lobby*/ ctx[5].id,
        mode: /*lobby*/ ctx[5].mode,
        color: /*lobby*/ ctx[5].color,
        isLobbyItem: /*isLobbyTable*/ ctx[2],
      },
      $$inline: true,
    });

    tableitem.$on("joinLobby", /*joinLobby_handler*/ ctx[3]);
    tableitem.$on("joinRoom", /*joinRoom_handler*/ ctx[4]);

    const block = {
      c: function create() {
        create_component(tableitem.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(tableitem, target, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        const tableitem_changes = {};
        if (dirty & /*lobbyTable*/ 1)
          tableitem_changes.player = /*lobby*/ ctx[5].id;
        if (dirty & /*lobbyTable*/ 1)
          tableitem_changes.mode = /*lobby*/ ctx[5].mode;
        if (dirty & /*lobbyTable*/ 1)
          tableitem_changes.color = /*lobby*/ ctx[5].color;
        if (dirty & /*isLobbyTable*/ 4)
          tableitem_changes.isLobbyItem = /*isLobbyTable*/ ctx[2];
        tableitem.$set(tableitem_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(tableitem.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(tableitem.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(tableitem, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block$3.name,
      type: "each",
      source: "(14:2) {#each lobbyTable as lobby}",
      ctx,
    });

    return block;
  }

  function create_fragment$e(ctx) {
    let table;
    let tr;
    let th0;
    let t0;
    let t1;
    let th1;
    let t3;
    let th2;
    let t5;
    let current;
    let each_value = /*lobbyTable*/ ctx[0];
    validate_each_argument(each_value);
    let each_blocks = [];

    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$3(
        get_each_context$3(ctx, each_value, i)
      );
    }

    const out = (i) =>
      transition_out(each_blocks[i], 1, 1, () => {
        each_blocks[i] = null;
      });

    const block = {
      c: function create() {
        table = element("table");
        tr = element("tr");
        th0 = element("th");
        t0 = text(/*firstIndexName*/ ctx[1]);
        t1 = space();
        th1 = element("th");
        th1.textContent = "Mode";
        t3 = space();
        th2 = element("th");
        th2.textContent = "Color";
        t5 = space();

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        attr_dev(th0, "class", "svelte-1gfgf3s");
        add_location(th0, file$e, 8, 4, 193);
        attr_dev(th1, "class", "svelte-1gfgf3s");
        add_location(th1, file$e, 9, 4, 223);
        attr_dev(th2, "class", "svelte-1gfgf3s");
        add_location(th2, file$e, 10, 4, 241);
        attr_dev(tr, "class", "svelte-1gfgf3s");
        add_location(tr, file$e, 7, 2, 184);
        attr_dev(table, "class", "svelte-1gfgf3s");
        add_location(table, file$e, 6, 0, 174);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, table, anchor);
        append_dev(table, tr);
        append_dev(tr, th0);
        append_dev(th0, t0);
        append_dev(tr, t1);
        append_dev(tr, th1);
        append_dev(tr, t3);
        append_dev(tr, th2);
        append_dev(table, t5);

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(table, null);
        }

        current = true;
      },
      p: function update(ctx, [dirty]) {
        if (!current || dirty & /*firstIndexName*/ 2)
          set_data_dev(t0, /*firstIndexName*/ ctx[1]);

        if (dirty & /*lobbyTable, isLobbyTable*/ 5) {
          each_value = /*lobbyTable*/ ctx[0];
          validate_each_argument(each_value);
          let i;

          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context$3(ctx, each_value, i);

            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block$3(child_ctx);
              each_blocks[i].c();
              transition_in(each_blocks[i], 1);
              each_blocks[i].m(table, null);
            }
          }

          group_outros();

          for (i = each_value.length; i < each_blocks.length; i += 1) {
            out(i);
          }

          check_outros();
        }
      },
      i: function intro(local) {
        if (current) return;

        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }

        current = true;
      },
      o: function outro(local) {
        each_blocks = each_blocks.filter(Boolean);

        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }

        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(table);
        destroy_each(each_blocks, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$e.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$e($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("Table", slots, []);
    let { lobbyTable = [] } = $$props;
    let { firstIndexName = "Player ID" } = $$props;
    let { isLobbyTable = true } = $$props;
    const writable_props = ["lobbyTable", "firstIndexName", "isLobbyTable"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<Table> was created with unknown prop '${key}'`);
    });

    function joinLobby_handler(event) {
      bubble.call(this, $$self, event);
    }

    function joinRoom_handler(event) {
      bubble.call(this, $$self, event);
    }

    $$self.$$set = ($$props) => {
      if ("lobbyTable" in $$props)
        $$invalidate(0, (lobbyTable = $$props.lobbyTable));
      if ("firstIndexName" in $$props)
        $$invalidate(1, (firstIndexName = $$props.firstIndexName));
      if ("isLobbyTable" in $$props)
        $$invalidate(2, (isLobbyTable = $$props.isLobbyTable));
    };

    $$self.$capture_state = () => ({
      TableItem,
      lobbyTable,
      firstIndexName,
      isLobbyTable,
    });

    $$self.$inject_state = ($$props) => {
      if ("lobbyTable" in $$props)
        $$invalidate(0, (lobbyTable = $$props.lobbyTable));
      if ("firstIndexName" in $$props)
        $$invalidate(1, (firstIndexName = $$props.firstIndexName));
      if ("isLobbyTable" in $$props)
        $$invalidate(2, (isLobbyTable = $$props.isLobbyTable));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [
      lobbyTable,
      firstIndexName,
      isLobbyTable,
      joinLobby_handler,
      joinRoom_handler,
    ];
  }

  class Table extends SvelteComponentDev {
    constructor(options) {
      super(options);

      init(this, options, instance$e, create_fragment$e, safe_not_equal, {
        lobbyTable: 0,
        firstIndexName: 1,
        isLobbyTable: 2,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Table",
        options,
        id: create_fragment$e.name,
      });
    }

    get lobbyTable() {
      throw new Error(
        "<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set lobbyTable(value) {
      throw new Error(
        "<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get firstIndexName() {
      throw new Error(
        "<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set firstIndexName(value) {
      throw new Error(
        "<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get isLobbyTable() {
      throw new Error(
        "<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set isLobbyTable(value) {
      throw new Error(
        "<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  function is_date(obj) {
    return Object.prototype.toString.call(obj) === "[object Date]";
  }

  function tick_spring(ctx, last_value, current_value, target_value) {
    if (typeof current_value === "number" || is_date(current_value)) {
      // @ts-ignore
      const delta = target_value - current_value;
      // @ts-ignore
      const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0
      const spring = ctx.opts.stiffness * delta;
      const damper = ctx.opts.damping * velocity;
      const acceleration = (spring - damper) * ctx.inv_mass;
      const d = (velocity + acceleration) * ctx.dt;
      if (
        Math.abs(d) < ctx.opts.precision &&
        Math.abs(delta) < ctx.opts.precision
      ) {
        return target_value; // settled
      } else {
        ctx.settled = false; // signal loop to keep ticking
        // @ts-ignore
        return is_date(current_value)
          ? new Date(current_value.getTime() + d)
          : current_value + d;
      }
    } else if (Array.isArray(current_value)) {
      // @ts-ignore
      return current_value.map((_, i) =>
        tick_spring(ctx, last_value[i], current_value[i], target_value[i])
      );
    } else if (typeof current_value === "object") {
      const next_value = {};
      for (const k in current_value) {
        // @ts-ignore
        next_value[k] = tick_spring(
          ctx,
          last_value[k],
          current_value[k],
          target_value[k]
        );
      }
      // @ts-ignore
      return next_value;
    } else {
      throw new Error(`Cannot spring ${typeof current_value} values`);
    }
  }
  function spring(value, opts = {}) {
    const store = writable(value);
    const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
    let last_time;
    let task;
    let current_token;
    let last_value = value;
    let target_value = value;
    let inv_mass = 1;
    let inv_mass_recovery_rate = 0;
    let cancel_task = false;
    function set(new_value, opts = {}) {
      target_value = new_value;
      const token = (current_token = {});
      if (
        value == null ||
        opts.hard ||
        (spring.stiffness >= 1 && spring.damping >= 1)
      ) {
        cancel_task = true; // cancel any running animation
        last_time = now();
        last_value = new_value;
        store.set((value = target_value));
        return Promise.resolve();
      } else if (opts.soft) {
        const rate = opts.soft === true ? 0.5 : +opts.soft;
        inv_mass_recovery_rate = 1 / (rate * 60);
        inv_mass = 0; // infinite mass, unaffected by spring forces
      }
      if (!task) {
        last_time = now();
        cancel_task = false;
        task = loop((now) => {
          if (cancel_task) {
            cancel_task = false;
            task = null;
            return false;
          }
          inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
          const ctx = {
            inv_mass,
            opts: spring,
            settled: true,
            dt: ((now - last_time) * 60) / 1000,
          };
          const next_value = tick_spring(ctx, last_value, value, target_value);
          last_time = now;
          last_value = value;
          store.set((value = next_value));
          if (ctx.settled) {
            task = null;
          }
          return !ctx.settled;
        });
      }
      return new Promise((fulfil) => {
        task.promise.then(() => {
          if (token === current_token) fulfil();
        });
      });
    }
    const spring = {
      set,
      update: (fn, opts) => set(fn(target_value, value), opts),
      subscribe: store.subscribe,
      stiffness,
      damping,
      precision,
    };
    return spring;
  }

  /* node_modules/svelte-range-slider-pips/src/RangePips.svelte generated by Svelte v3.50.1 */

  const file$d = "node_modules/svelte-range-slider-pips/src/RangePips.svelte";

  function get_each_context$2(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[28] = list[i];
    child_ctx[30] = i;
    return child_ctx;
  }

  // (177:2) {#if ( all && first !== false ) || first }
  function create_if_block_9(ctx) {
    let span;
    let span_style_value;
    let mounted;
    let dispose;
    let if_block =
      /*all*/ (ctx[6] === "label" || /*first*/ ctx[7] === "label") &&
      create_if_block_10(ctx);

    const block = {
      c: function create() {
        span = element("span");
        if (if_block) if_block.c();
        attr_dev(span, "class", "pip first");
        attr_dev(
          span,
          "style",
          (span_style_value = "" + /*orientationStart*/ (ctx[14] + ": 0%;"))
        );
        toggle_class(span, "selected", /*isSelected*/ ctx[18](/*min*/ ctx[0]));
        toggle_class(span, "in-range", /*inRange*/ ctx[17](/*min*/ ctx[0]));
        add_location(span, file$d, 177, 4, 4438);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        if (if_block) if_block.m(span, null);

        if (!mounted) {
          dispose = [
            listen_dev(
              span,
              "click",
              function () {
                if (is_function(/*labelClick*/ ctx[21](/*min*/ ctx[0])))
                  /*labelClick*/ ctx[21](/*min*/ ctx[0]).apply(this, arguments);
              },
              false,
              false,
              false
            ),
            listen_dev(
              span,
              "touchend",
              prevent_default(function () {
                if (is_function(/*labelClick*/ ctx[21](/*min*/ ctx[0])))
                  /*labelClick*/ ctx[21](/*min*/ ctx[0]).apply(this, arguments);
              }),
              false,
              true,
              false
            ),
          ];

          mounted = true;
        }
      },
      p: function update(new_ctx, dirty) {
        ctx = new_ctx;

        if (/*all*/ ctx[6] === "label" || /*first*/ ctx[7] === "label") {
          if (if_block) {
            if_block.p(ctx, dirty);
          } else {
            if_block = create_if_block_10(ctx);
            if_block.c();
            if_block.m(span, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }

        if (
          dirty & /*orientationStart*/ 16384 &&
          span_style_value !==
            (span_style_value = "" + /*orientationStart*/ (ctx[14] + ": 0%;"))
        ) {
          attr_dev(span, "style", span_style_value);
        }

        if (dirty & /*isSelected, min*/ 262145) {
          toggle_class(
            span,
            "selected",
            /*isSelected*/ ctx[18](/*min*/ ctx[0])
          );
        }

        if (dirty & /*inRange, min*/ 131073) {
          toggle_class(span, "in-range", /*inRange*/ ctx[17](/*min*/ ctx[0]));
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
        if (if_block) if_block.d();
        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_9.name,
      type: "if",
      source: "(177:2) {#if ( all && first !== false ) || first }",
      ctx,
    });

    return block;
  }

  // (186:6) {#if all === 'label' || first === 'label'}
  function create_if_block_10(ctx) {
    let span;
    let t_value =
      /*formatter*/ ctx[12](/*fixFloat*/ ctx[16](/*min*/ ctx[0]), 0, 0) + "";
    let t;
    let if_block0 = /*prefix*/ ctx[10] && create_if_block_12(ctx);
    let if_block1 = /*suffix*/ ctx[11] && create_if_block_11(ctx);

    const block = {
      c: function create() {
        span = element("span");
        if (if_block0) if_block0.c();
        t = text(t_value);
        if (if_block1) if_block1.c();
        attr_dev(span, "class", "pipVal");
        add_location(span, file$d, 186, 8, 4728);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        if (if_block0) if_block0.m(span, null);
        append_dev(span, t);
        if (if_block1) if_block1.m(span, null);
      },
      p: function update(ctx, dirty) {
        if (/*prefix*/ ctx[10]) {
          if (if_block0) {
            if_block0.p(ctx, dirty);
          } else {
            if_block0 = create_if_block_12(ctx);
            if_block0.c();
            if_block0.m(span, t);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        if (
          dirty & /*formatter, fixFloat, min*/ 69633 &&
          t_value !==
            (t_value =
              /*formatter*/ ctx[12](
                /*fixFloat*/ ctx[16](/*min*/ ctx[0]),
                0,
                0
              ) + "")
        )
          set_data_dev(t, t_value);

        if (/*suffix*/ ctx[11]) {
          if (if_block1) {
            if_block1.p(ctx, dirty);
          } else {
            if_block1 = create_if_block_11(ctx);
            if_block1.c();
            if_block1.m(span, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_10.name,
      type: "if",
      source: "(186:6) {#if all === 'label' || first === 'label'}",
      ctx,
    });

    return block;
  }

  // (188:10) {#if prefix}
  function create_if_block_12(ctx) {
    let span;
    let t;

    const block = {
      c: function create() {
        span = element("span");
        t = text(/*prefix*/ ctx[10]);
        attr_dev(span, "class", "pipVal-prefix");
        add_location(span, file$d, 187, 22, 4772);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        append_dev(span, t);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*prefix*/ 1024) set_data_dev(t, /*prefix*/ ctx[10]);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_12.name,
      type: "if",
      source: "(188:10) {#if prefix}",
      ctx,
    });

    return block;
  }

  // (188:100) {#if suffix}
  function create_if_block_11(ctx) {
    let span;
    let t;

    const block = {
      c: function create() {
        span = element("span");
        t = text(/*suffix*/ ctx[11]);
        attr_dev(span, "class", "pipVal-suffix");
        add_location(span, file$d, 187, 112, 4862);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        append_dev(span, t);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*suffix*/ 2048) set_data_dev(t, /*suffix*/ ctx[11]);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_11.name,
      type: "if",
      source: "(188:100) {#if suffix}",
      ctx,
    });

    return block;
  }

  // (194:2) {#if ( all && rest !== false ) || rest}
  function create_if_block_4$2(ctx) {
    let each_1_anchor;
    let each_value = Array(/*pipCount*/ ctx[20] + 1);
    validate_each_argument(each_value);
    let each_blocks = [];

    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$2(
        get_each_context$2(ctx, each_value, i)
      );
    }

    const block = {
      c: function create() {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        each_1_anchor = empty();
      },
      m: function mount(target, anchor) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(target, anchor);
        }

        insert_dev(target, each_1_anchor, anchor);
      },
      p: function update(ctx, dirty) {
        if (
          dirty &
          /*orientationStart, percentOf, pipVal, isSelected, inRange, labelClick, suffix, formatter, prefix, all, rest, min, max, pipCount*/ 4120131
        ) {
          each_value = Array(/*pipCount*/ ctx[20] + 1);
          validate_each_argument(each_value);
          let i;

          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context$2(ctx, each_value, i);

            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block$2(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
            }
          }

          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }

          each_blocks.length = each_value.length;
        }
      },
      d: function destroy(detaching) {
        destroy_each(each_blocks, detaching);
        if (detaching) detach_dev(each_1_anchor);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_4$2.name,
      type: "if",
      source: "(194:2) {#if ( all && rest !== false ) || rest}",
      ctx,
    });

    return block;
  }

  // (196:6) {#if pipVal(i) !== min && pipVal(i) !== max}
  function create_if_block_5$1(ctx) {
    let span;
    let t;
    let span_style_value;
    let mounted;
    let dispose;
    let if_block =
      /*all*/ (ctx[6] === "label" || /*rest*/ ctx[9] === "label") &&
      create_if_block_6$1(ctx);

    const block = {
      c: function create() {
        span = element("span");
        if (if_block) if_block.c();
        t = space();
        attr_dev(span, "class", "pip");
        attr_dev(
          span,
          "style",
          (span_style_value =
            "" +
            /*orientationStart*/ (ctx[14] +
              ": " +
              /*percentOf*/ ctx[15](/*pipVal*/ ctx[19](/*i*/ ctx[30])) +
              "%;"))
        );
        toggle_class(
          span,
          "selected",
          /*isSelected*/ ctx[18](/*pipVal*/ ctx[19](/*i*/ ctx[30]))
        );
        toggle_class(
          span,
          "in-range",
          /*inRange*/ ctx[17](/*pipVal*/ ctx[19](/*i*/ ctx[30]))
        );
        add_location(span, file$d, 196, 8, 5101);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        if (if_block) if_block.m(span, null);
        append_dev(span, t);

        if (!mounted) {
          dispose = [
            listen_dev(
              span,
              "click",
              function () {
                if (
                  is_function(
                    /*labelClick*/ ctx[21](/*pipVal*/ ctx[19](/*i*/ ctx[30]))
                  )
                )
                  /*labelClick*/ ctx[21](
                    /*pipVal*/ ctx[19](/*i*/ ctx[30])
                  ).apply(this, arguments);
              },
              false,
              false,
              false
            ),
            listen_dev(
              span,
              "touchend",
              prevent_default(function () {
                if (
                  is_function(
                    /*labelClick*/ ctx[21](/*pipVal*/ ctx[19](/*i*/ ctx[30]))
                  )
                )
                  /*labelClick*/ ctx[21](
                    /*pipVal*/ ctx[19](/*i*/ ctx[30])
                  ).apply(this, arguments);
              }),
              false,
              true,
              false
            ),
          ];

          mounted = true;
        }
      },
      p: function update(new_ctx, dirty) {
        ctx = new_ctx;

        if (/*all*/ ctx[6] === "label" || /*rest*/ ctx[9] === "label") {
          if (if_block) {
            if_block.p(ctx, dirty);
          } else {
            if_block = create_if_block_6$1(ctx);
            if_block.c();
            if_block.m(span, t);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }

        if (
          dirty & /*orientationStart, percentOf, pipVal*/ 573440 &&
          span_style_value !==
            (span_style_value =
              "" +
              /*orientationStart*/ (ctx[14] +
                ": " +
                /*percentOf*/ ctx[15](/*pipVal*/ ctx[19](/*i*/ ctx[30])) +
                "%;"))
        ) {
          attr_dev(span, "style", span_style_value);
        }

        if (dirty & /*isSelected, pipVal*/ 786432) {
          toggle_class(
            span,
            "selected",
            /*isSelected*/ ctx[18](/*pipVal*/ ctx[19](/*i*/ ctx[30]))
          );
        }

        if (dirty & /*inRange, pipVal*/ 655360) {
          toggle_class(
            span,
            "in-range",
            /*inRange*/ ctx[17](/*pipVal*/ ctx[19](/*i*/ ctx[30]))
          );
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
        if (if_block) if_block.d();
        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_5$1.name,
      type: "if",
      source: "(196:6) {#if pipVal(i) !== min && pipVal(i) !== max}",
      ctx,
    });

    return block;
  }

  // (205:10) {#if all === 'label' || rest === 'label'}
  function create_if_block_6$1(ctx) {
    let span;
    let t_value =
      /*formatter*/ ctx[12](
        /*pipVal*/ ctx[19](/*i*/ ctx[30]),
        /*i*/ ctx[30],
        /*percentOf*/ ctx[15](/*pipVal*/ ctx[19](/*i*/ ctx[30]))
      ) + "";
    let t;
    let if_block0 = /*prefix*/ ctx[10] && create_if_block_8(ctx);
    let if_block1 = /*suffix*/ ctx[11] && create_if_block_7$1(ctx);

    const block = {
      c: function create() {
        span = element("span");
        if (if_block0) if_block0.c();
        t = text(t_value);
        if (if_block1) if_block1.c();
        attr_dev(span, "class", "pipVal");
        add_location(span, file$d, 205, 12, 5465);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        if (if_block0) if_block0.m(span, null);
        append_dev(span, t);
        if (if_block1) if_block1.m(span, null);
      },
      p: function update(ctx, dirty) {
        if (/*prefix*/ ctx[10]) {
          if (if_block0) {
            if_block0.p(ctx, dirty);
          } else {
            if_block0 = create_if_block_8(ctx);
            if_block0.c();
            if_block0.m(span, t);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        if (
          dirty & /*formatter, pipVal, percentOf*/ 561152 &&
          t_value !==
            (t_value =
              /*formatter*/ ctx[12](
                /*pipVal*/ ctx[19](/*i*/ ctx[30]),
                /*i*/ ctx[30],
                /*percentOf*/ ctx[15](/*pipVal*/ ctx[19](/*i*/ ctx[30]))
              ) + "")
        )
          set_data_dev(t, t_value);

        if (/*suffix*/ ctx[11]) {
          if (if_block1) {
            if_block1.p(ctx, dirty);
          } else {
            if_block1 = create_if_block_7$1(ctx);
            if_block1.c();
            if_block1.m(span, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_6$1.name,
      type: "if",
      source: "(205:10) {#if all === 'label' || rest === 'label'}",
      ctx,
    });

    return block;
  }

  // (207:14) {#if prefix}
  function create_if_block_8(ctx) {
    let span;
    let t;

    const block = {
      c: function create() {
        span = element("span");
        t = text(/*prefix*/ ctx[10]);
        attr_dev(span, "class", "pipVal-prefix");
        add_location(span, file$d, 206, 26, 5513);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        append_dev(span, t);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*prefix*/ 1024) set_data_dev(t, /*prefix*/ ctx[10]);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_8.name,
      type: "if",
      source: "(207:14) {#if prefix}",
      ctx,
    });

    return block;
  }

  // (207:119) {#if suffix}
  function create_if_block_7$1(ctx) {
    let span;
    let t;

    const block = {
      c: function create() {
        span = element("span");
        t = text(/*suffix*/ ctx[11]);
        attr_dev(span, "class", "pipVal-suffix");
        add_location(span, file$d, 206, 131, 5618);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        append_dev(span, t);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*suffix*/ 2048) set_data_dev(t, /*suffix*/ ctx[11]);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_7$1.name,
      type: "if",
      source: "(207:119) {#if suffix}",
      ctx,
    });

    return block;
  }

  // (195:4) {#each Array(pipCount + 1) as _, i}
  function create_each_block$2(ctx) {
    let show_if =
      /*pipVal*/ ctx[19](/*i*/ ctx[30]) !== /*min*/ ctx[0] &&
      /*pipVal*/ ctx[19](/*i*/ ctx[30]) !== /*max*/ ctx[1];
    let if_block_anchor;
    let if_block = show_if && create_if_block_5$1(ctx);

    const block = {
      c: function create() {
        if (if_block) if_block.c();
        if_block_anchor = empty();
      },
      m: function mount(target, anchor) {
        if (if_block) if_block.m(target, anchor);
        insert_dev(target, if_block_anchor, anchor);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*pipVal, min, max*/ 524291)
          show_if =
            /*pipVal*/ ctx[19](/*i*/ ctx[30]) !== /*min*/ ctx[0] &&
            /*pipVal*/ ctx[19](/*i*/ ctx[30]) !== /*max*/ ctx[1];

        if (show_if) {
          if (if_block) {
            if_block.p(ctx, dirty);
          } else {
            if_block = create_if_block_5$1(ctx);
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      d: function destroy(detaching) {
        if (if_block) if_block.d(detaching);
        if (detaching) detach_dev(if_block_anchor);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block$2.name,
      type: "each",
      source: "(195:4) {#each Array(pipCount + 1) as _, i}",
      ctx,
    });

    return block;
  }

  // (215:2) {#if ( all && last !== false ) || last}
  function create_if_block$b(ctx) {
    let span;
    let span_style_value;
    let mounted;
    let dispose;
    let if_block =
      /*all*/ (ctx[6] === "label" || /*last*/ ctx[8] === "label") &&
      create_if_block_1$7(ctx);

    const block = {
      c: function create() {
        span = element("span");
        if (if_block) if_block.c();
        attr_dev(span, "class", "pip last");
        attr_dev(
          span,
          "style",
          (span_style_value = "" + /*orientationStart*/ (ctx[14] + ": 100%;"))
        );
        toggle_class(span, "selected", /*isSelected*/ ctx[18](/*max*/ ctx[1]));
        toggle_class(span, "in-range", /*inRange*/ ctx[17](/*max*/ ctx[1]));
        add_location(span, file$d, 215, 4, 5798);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        if (if_block) if_block.m(span, null);

        if (!mounted) {
          dispose = [
            listen_dev(
              span,
              "click",
              function () {
                if (is_function(/*labelClick*/ ctx[21](/*max*/ ctx[1])))
                  /*labelClick*/ ctx[21](/*max*/ ctx[1]).apply(this, arguments);
              },
              false,
              false,
              false
            ),
            listen_dev(
              span,
              "touchend",
              prevent_default(function () {
                if (is_function(/*labelClick*/ ctx[21](/*max*/ ctx[1])))
                  /*labelClick*/ ctx[21](/*max*/ ctx[1]).apply(this, arguments);
              }),
              false,
              true,
              false
            ),
          ];

          mounted = true;
        }
      },
      p: function update(new_ctx, dirty) {
        ctx = new_ctx;

        if (/*all*/ ctx[6] === "label" || /*last*/ ctx[8] === "label") {
          if (if_block) {
            if_block.p(ctx, dirty);
          } else {
            if_block = create_if_block_1$7(ctx);
            if_block.c();
            if_block.m(span, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }

        if (
          dirty & /*orientationStart*/ 16384 &&
          span_style_value !==
            (span_style_value = "" + /*orientationStart*/ (ctx[14] + ": 100%;"))
        ) {
          attr_dev(span, "style", span_style_value);
        }

        if (dirty & /*isSelected, max*/ 262146) {
          toggle_class(
            span,
            "selected",
            /*isSelected*/ ctx[18](/*max*/ ctx[1])
          );
        }

        if (dirty & /*inRange, max*/ 131074) {
          toggle_class(span, "in-range", /*inRange*/ ctx[17](/*max*/ ctx[1]));
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
        if (if_block) if_block.d();
        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$b.name,
      type: "if",
      source: "(215:2) {#if ( all && last !== false ) || last}",
      ctx,
    });

    return block;
  }

  // (224:6) {#if all === 'label' || last === 'label'}
  function create_if_block_1$7(ctx) {
    let span;
    let t_value =
      /*formatter*/ ctx[12](
        /*fixFloat*/ ctx[16](/*max*/ ctx[1]),
        /*pipCount*/ ctx[20],
        100
      ) + "";
    let t;
    let if_block0 = /*prefix*/ ctx[10] && create_if_block_3$2(ctx);
    let if_block1 = /*suffix*/ ctx[11] && create_if_block_2$3(ctx);

    const block = {
      c: function create() {
        span = element("span");
        if (if_block0) if_block0.c();
        t = text(t_value);
        if (if_block1) if_block1.c();
        attr_dev(span, "class", "pipVal");
        add_location(span, file$d, 224, 8, 6088);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        if (if_block0) if_block0.m(span, null);
        append_dev(span, t);
        if (if_block1) if_block1.m(span, null);
      },
      p: function update(ctx, dirty) {
        if (/*prefix*/ ctx[10]) {
          if (if_block0) {
            if_block0.p(ctx, dirty);
          } else {
            if_block0 = create_if_block_3$2(ctx);
            if_block0.c();
            if_block0.m(span, t);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        if (
          dirty & /*formatter, fixFloat, max, pipCount*/ 1118210 &&
          t_value !==
            (t_value =
              /*formatter*/ ctx[12](
                /*fixFloat*/ ctx[16](/*max*/ ctx[1]),
                /*pipCount*/ ctx[20],
                100
              ) + "")
        )
          set_data_dev(t, t_value);

        if (/*suffix*/ ctx[11]) {
          if (if_block1) {
            if_block1.p(ctx, dirty);
          } else {
            if_block1 = create_if_block_2$3(ctx);
            if_block1.c();
            if_block1.m(span, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_1$7.name,
      type: "if",
      source: "(224:6) {#if all === 'label' || last === 'label'}",
      ctx,
    });

    return block;
  }

  // (226:10) {#if prefix}
  function create_if_block_3$2(ctx) {
    let span;
    let t;

    const block = {
      c: function create() {
        span = element("span");
        t = text(/*prefix*/ ctx[10]);
        attr_dev(span, "class", "pipVal-prefix");
        add_location(span, file$d, 225, 22, 6132);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        append_dev(span, t);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*prefix*/ 1024) set_data_dev(t, /*prefix*/ ctx[10]);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_3$2.name,
      type: "if",
      source: "(226:10) {#if prefix}",
      ctx,
    });

    return block;
  }

  // (226:109) {#if suffix}
  function create_if_block_2$3(ctx) {
    let span;
    let t;

    const block = {
      c: function create() {
        span = element("span");
        t = text(/*suffix*/ ctx[11]);
        attr_dev(span, "class", "pipVal-suffix");
        add_location(span, file$d, 225, 121, 6231);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        append_dev(span, t);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*suffix*/ 2048) set_data_dev(t, /*suffix*/ ctx[11]);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_2$3.name,
      type: "if",
      source: "(226:109) {#if suffix}",
      ctx,
    });

    return block;
  }

  function create_fragment$d(ctx) {
    let div;
    let t0;
    let t1;
    let if_block0 =
      /*all*/ ((ctx[6] && /*first*/ ctx[7] !== false) || /*first*/ ctx[7]) &&
      create_if_block_9(ctx);
    let if_block1 =
      /*all*/ ((ctx[6] && /*rest*/ ctx[9] !== false) || /*rest*/ ctx[9]) &&
      create_if_block_4$2(ctx);
    let if_block2 =
      /*all*/ ((ctx[6] && /*last*/ ctx[8] !== false) || /*last*/ ctx[8]) &&
      create_if_block$b(ctx);

    const block = {
      c: function create() {
        div = element("div");
        if (if_block0) if_block0.c();
        t0 = space();
        if (if_block1) if_block1.c();
        t1 = space();
        if (if_block2) if_block2.c();
        attr_dev(div, "class", "rangePips");
        toggle_class(div, "disabled", /*disabled*/ ctx[5]);
        toggle_class(div, "hoverable", /*hoverable*/ ctx[4]);
        toggle_class(div, "vertical", /*vertical*/ ctx[2]);
        toggle_class(div, "reversed", /*reversed*/ ctx[3]);
        toggle_class(div, "focus", /*focus*/ ctx[13]);
        add_location(div, file$d, 168, 0, 4273);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        if (if_block0) if_block0.m(div, null);
        append_dev(div, t0);
        if (if_block1) if_block1.m(div, null);
        append_dev(div, t1);
        if (if_block2) if_block2.m(div, null);
      },
      p: function update(ctx, [dirty]) {
        if (
          /*all*/ (ctx[6] && /*first*/ ctx[7] !== false) ||
          /*first*/ ctx[7]
        ) {
          if (if_block0) {
            if_block0.p(ctx, dirty);
          } else {
            if_block0 = create_if_block_9(ctx);
            if_block0.c();
            if_block0.m(div, t0);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        if (/*all*/ (ctx[6] && /*rest*/ ctx[9] !== false) || /*rest*/ ctx[9]) {
          if (if_block1) {
            if_block1.p(ctx, dirty);
          } else {
            if_block1 = create_if_block_4$2(ctx);
            if_block1.c();
            if_block1.m(div, t1);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }

        if (/*all*/ (ctx[6] && /*last*/ ctx[8] !== false) || /*last*/ ctx[8]) {
          if (if_block2) {
            if_block2.p(ctx, dirty);
          } else {
            if_block2 = create_if_block$b(ctx);
            if_block2.c();
            if_block2.m(div, null);
          }
        } else if (if_block2) {
          if_block2.d(1);
          if_block2 = null;
        }

        if (dirty & /*disabled*/ 32) {
          toggle_class(div, "disabled", /*disabled*/ ctx[5]);
        }

        if (dirty & /*hoverable*/ 16) {
          toggle_class(div, "hoverable", /*hoverable*/ ctx[4]);
        }

        if (dirty & /*vertical*/ 4) {
          toggle_class(div, "vertical", /*vertical*/ ctx[2]);
        }

        if (dirty & /*reversed*/ 8) {
          toggle_class(div, "reversed", /*reversed*/ ctx[3]);
        }

        if (dirty & /*focus*/ 8192) {
          toggle_class(div, "focus", /*focus*/ ctx[13]);
        }
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
        if (if_block2) if_block2.d();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$d.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$d($$self, $$props, $$invalidate) {
    let pipStep;
    let pipCount;
    let pipVal;
    let isSelected;
    let inRange;
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("RangePips", slots, []);
    let { range = false } = $$props;
    let { min = 0 } = $$props;
    let { max = 100 } = $$props;
    let { step = 1 } = $$props;
    let { values = [(max + min) / 2] } = $$props;
    let { vertical = false } = $$props;
    let { reversed = false } = $$props;
    let { hoverable = true } = $$props;
    let { disabled = false } = $$props;
    let { pipstep = undefined } = $$props;
    let { all = true } = $$props;
    let { first = undefined } = $$props;
    let { last = undefined } = $$props;
    let { rest = undefined } = $$props;
    let { prefix = "" } = $$props;
    let { suffix = "" } = $$props;
    let { formatter = (v, i) => v } = $$props;
    let { focus = undefined } = $$props;
    let { orientationStart = undefined } = $$props;
    let { percentOf = undefined } = $$props;
    let { moveHandle = undefined } = $$props;
    let { fixFloat = undefined } = $$props;

    function labelClick(val) {
      if (!disabled) {
        moveHandle(undefined, val);
      }
    }

    const writable_props = [
      "range",
      "min",
      "max",
      "step",
      "values",
      "vertical",
      "reversed",
      "hoverable",
      "disabled",
      "pipstep",
      "all",
      "first",
      "last",
      "rest",
      "prefix",
      "suffix",
      "formatter",
      "focus",
      "orientationStart",
      "percentOf",
      "moveHandle",
      "fixFloat",
    ];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<RangePips> was created with unknown prop '${key}'`);
    });

    $$self.$$set = ($$props) => {
      if ("range" in $$props) $$invalidate(22, (range = $$props.range));
      if ("min" in $$props) $$invalidate(0, (min = $$props.min));
      if ("max" in $$props) $$invalidate(1, (max = $$props.max));
      if ("step" in $$props) $$invalidate(23, (step = $$props.step));
      if ("values" in $$props) $$invalidate(24, (values = $$props.values));
      if ("vertical" in $$props) $$invalidate(2, (vertical = $$props.vertical));
      if ("reversed" in $$props) $$invalidate(3, (reversed = $$props.reversed));
      if ("hoverable" in $$props)
        $$invalidate(4, (hoverable = $$props.hoverable));
      if ("disabled" in $$props) $$invalidate(5, (disabled = $$props.disabled));
      if ("pipstep" in $$props) $$invalidate(25, (pipstep = $$props.pipstep));
      if ("all" in $$props) $$invalidate(6, (all = $$props.all));
      if ("first" in $$props) $$invalidate(7, (first = $$props.first));
      if ("last" in $$props) $$invalidate(8, (last = $$props.last));
      if ("rest" in $$props) $$invalidate(9, (rest = $$props.rest));
      if ("prefix" in $$props) $$invalidate(10, (prefix = $$props.prefix));
      if ("suffix" in $$props) $$invalidate(11, (suffix = $$props.suffix));
      if ("formatter" in $$props)
        $$invalidate(12, (formatter = $$props.formatter));
      if ("focus" in $$props) $$invalidate(13, (focus = $$props.focus));
      if ("orientationStart" in $$props)
        $$invalidate(14, (orientationStart = $$props.orientationStart));
      if ("percentOf" in $$props)
        $$invalidate(15, (percentOf = $$props.percentOf));
      if ("moveHandle" in $$props)
        $$invalidate(26, (moveHandle = $$props.moveHandle));
      if ("fixFloat" in $$props)
        $$invalidate(16, (fixFloat = $$props.fixFloat));
    };

    $$self.$capture_state = () => ({
      range,
      min,
      max,
      step,
      values,
      vertical,
      reversed,
      hoverable,
      disabled,
      pipstep,
      all,
      first,
      last,
      rest,
      prefix,
      suffix,
      formatter,
      focus,
      orientationStart,
      percentOf,
      moveHandle,
      fixFloat,
      labelClick,
      inRange,
      isSelected,
      pipStep,
      pipVal,
      pipCount,
    });

    $$self.$inject_state = ($$props) => {
      if ("range" in $$props) $$invalidate(22, (range = $$props.range));
      if ("min" in $$props) $$invalidate(0, (min = $$props.min));
      if ("max" in $$props) $$invalidate(1, (max = $$props.max));
      if ("step" in $$props) $$invalidate(23, (step = $$props.step));
      if ("values" in $$props) $$invalidate(24, (values = $$props.values));
      if ("vertical" in $$props) $$invalidate(2, (vertical = $$props.vertical));
      if ("reversed" in $$props) $$invalidate(3, (reversed = $$props.reversed));
      if ("hoverable" in $$props)
        $$invalidate(4, (hoverable = $$props.hoverable));
      if ("disabled" in $$props) $$invalidate(5, (disabled = $$props.disabled));
      if ("pipstep" in $$props) $$invalidate(25, (pipstep = $$props.pipstep));
      if ("all" in $$props) $$invalidate(6, (all = $$props.all));
      if ("first" in $$props) $$invalidate(7, (first = $$props.first));
      if ("last" in $$props) $$invalidate(8, (last = $$props.last));
      if ("rest" in $$props) $$invalidate(9, (rest = $$props.rest));
      if ("prefix" in $$props) $$invalidate(10, (prefix = $$props.prefix));
      if ("suffix" in $$props) $$invalidate(11, (suffix = $$props.suffix));
      if ("formatter" in $$props)
        $$invalidate(12, (formatter = $$props.formatter));
      if ("focus" in $$props) $$invalidate(13, (focus = $$props.focus));
      if ("orientationStart" in $$props)
        $$invalidate(14, (orientationStart = $$props.orientationStart));
      if ("percentOf" in $$props)
        $$invalidate(15, (percentOf = $$props.percentOf));
      if ("moveHandle" in $$props)
        $$invalidate(26, (moveHandle = $$props.moveHandle));
      if ("fixFloat" in $$props)
        $$invalidate(16, (fixFloat = $$props.fixFloat));
      if ("inRange" in $$props) $$invalidate(17, (inRange = $$props.inRange));
      if ("isSelected" in $$props)
        $$invalidate(18, (isSelected = $$props.isSelected));
      if ("pipStep" in $$props) $$invalidate(27, (pipStep = $$props.pipStep));
      if ("pipVal" in $$props) $$invalidate(19, (pipVal = $$props.pipVal));
      if ("pipCount" in $$props)
        $$invalidate(20, (pipCount = $$props.pipCount));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*pipstep, max, min, step, vertical*/ 41943047) {
        $$invalidate(
          27,
          (pipStep =
            pipstep ||
            ((max - min) / step >= (vertical ? 50 : 100)
              ? (max - min) / (vertical ? 10 : 20)
              : 1))
        );
      }

      if ($$self.$$.dirty & /*max, min, step, pipStep*/ 142606339) {
        $$invalidate(
          20,
          (pipCount = parseInt((max - min) / (step * pipStep), 10))
        );
      }

      if ($$self.$$.dirty & /*fixFloat, min, step, pipStep*/ 142671873) {
        $$invalidate(
          19,
          (pipVal = function (val) {
            return fixFloat(min + val * step * pipStep);
          })
        );
      }

      if ($$self.$$.dirty & /*values, fixFloat*/ 16842752) {
        $$invalidate(
          18,
          (isSelected = function (val) {
            return values.some((v) => fixFloat(v) === fixFloat(val));
          })
        );
      }

      if ($$self.$$.dirty & /*range, values*/ 20971520) {
        $$invalidate(
          17,
          (inRange = function (val) {
            if (range === "min") {
              return values[0] > val;
            } else if (range === "max") {
              return values[0] < val;
            } else if (range) {
              return values[0] < val && values[1] > val;
            }
          })
        );
      }
    };

    return [
      min,
      max,
      vertical,
      reversed,
      hoverable,
      disabled,
      all,
      first,
      last,
      rest,
      prefix,
      suffix,
      formatter,
      focus,
      orientationStart,
      percentOf,
      fixFloat,
      inRange,
      isSelected,
      pipVal,
      pipCount,
      labelClick,
      range,
      step,
      values,
      pipstep,
      moveHandle,
      pipStep,
    ];
  }

  class RangePips extends SvelteComponentDev {
    constructor(options) {
      super(options);

      init(this, options, instance$d, create_fragment$d, safe_not_equal, {
        range: 22,
        min: 0,
        max: 1,
        step: 23,
        values: 24,
        vertical: 2,
        reversed: 3,
        hoverable: 4,
        disabled: 5,
        pipstep: 25,
        all: 6,
        first: 7,
        last: 8,
        rest: 9,
        prefix: 10,
        suffix: 11,
        formatter: 12,
        focus: 13,
        orientationStart: 14,
        percentOf: 15,
        moveHandle: 26,
        fixFloat: 16,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "RangePips",
        options,
        id: create_fragment$d.name,
      });
    }

    get range() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set range(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get min() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set min(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get max() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set max(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get step() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set step(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get values() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set values(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get vertical() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set vertical(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get reversed() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set reversed(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get hoverable() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set hoverable(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get disabled() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set disabled(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get pipstep() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set pipstep(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get all() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set all(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get first() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set first(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get last() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set last(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get rest() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set rest(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get prefix() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set prefix(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get suffix() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set suffix(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get formatter() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set formatter(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get focus() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set focus(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get orientationStart() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set orientationStart(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get percentOf() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set percentOf(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get moveHandle() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set moveHandle(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get fixFloat() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set fixFloat(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  /* node_modules/svelte-range-slider-pips/src/RangeSlider.svelte generated by Svelte v3.50.1 */

  const { console: console_1$2 } = globals;
  const file$c = "node_modules/svelte-range-slider-pips/src/RangeSlider.svelte";

  function get_each_context$1(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[64] = list[i];
    child_ctx[66] = i;
    return child_ctx;
  }

  // (821:6) {#if float}
  function create_if_block_2$2(ctx) {
    let span;
    let t_value =
      /*handleFormatter*/ ctx[21](
        /*value*/ ctx[64],
        /*index*/ ctx[66],
        /*percentOf*/ ctx[23](/*value*/ ctx[64])
      ) + "";
    let t;
    let if_block0 = /*prefix*/ ctx[18] && create_if_block_4$1(ctx);
    let if_block1 = /*suffix*/ ctx[19] && create_if_block_3$1(ctx);

    const block = {
      c: function create() {
        span = element("span");
        if (if_block0) if_block0.c();
        t = text(t_value);
        if (if_block1) if_block1.c();
        attr_dev(span, "class", "rangeFloat");
        add_location(span, file$c, 821, 8, 24447);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        if (if_block0) if_block0.m(span, null);
        append_dev(span, t);
        if (if_block1) if_block1.m(span, null);
      },
      p: function update(ctx, dirty) {
        if (/*prefix*/ ctx[18]) {
          if (if_block0) {
            if_block0.p(ctx, dirty);
          } else {
            if_block0 = create_if_block_4$1(ctx);
            if_block0.c();
            if_block0.m(span, t);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        if (
          dirty[0] & /*handleFormatter, values, percentOf*/ 10485761 &&
          t_value !==
            (t_value =
              /*handleFormatter*/ ctx[21](
                /*value*/ ctx[64],
                /*index*/ ctx[66],
                /*percentOf*/ ctx[23](/*value*/ ctx[64])
              ) + "")
        )
          set_data_dev(t, t_value);

        if (/*suffix*/ ctx[19]) {
          if (if_block1) {
            if_block1.p(ctx, dirty);
          } else {
            if_block1 = create_if_block_3$1(ctx);
            if_block1.c();
            if_block1.m(span, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_2$2.name,
      type: "if",
      source: "(821:6) {#if float}",
      ctx,
    });

    return block;
  }

  // (823:10) {#if prefix}
  function create_if_block_4$1(ctx) {
    let span;
    let t;

    const block = {
      c: function create() {
        span = element("span");
        t = text(/*prefix*/ ctx[18]);
        attr_dev(span, "class", "rangeFloat-prefix");
        add_location(span, file$c, 822, 22, 24495);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        append_dev(span, t);
      },
      p: function update(ctx, dirty) {
        if (dirty[0] & /*prefix*/ 262144) set_data_dev(t, /*prefix*/ ctx[18]);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_4$1.name,
      type: "if",
      source: "(823:10) {#if prefix}",
      ctx,
    });

    return block;
  }

  // (823:121) {#if suffix}
  function create_if_block_3$1(ctx) {
    let span;
    let t;

    const block = {
      c: function create() {
        span = element("span");
        t = text(/*suffix*/ ctx[19]);
        attr_dev(span, "class", "rangeFloat-suffix");
        add_location(span, file$c, 822, 133, 24606);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        append_dev(span, t);
      },
      p: function update(ctx, dirty) {
        if (dirty[0] & /*suffix*/ 524288) set_data_dev(t, /*suffix*/ ctx[19]);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_3$1.name,
      type: "if",
      source: "(823:121) {#if suffix}",
      ctx,
    });

    return block;
  }

  // (800:2) {#each values as value, index}
  function create_each_block$1(ctx) {
    let span1;
    let span0;
    let t;
    let span1_style_value;
    let span1_aria_valuemin_value;
    let span1_aria_valuemax_value;
    let span1_aria_valuenow_value;
    let span1_aria_valuetext_value;
    let span1_aria_orientation_value;
    let span1_tabindex_value;
    let mounted;
    let dispose;
    let if_block = /*float*/ ctx[7] && create_if_block_2$2(ctx);

    const block = {
      c: function create() {
        span1 = element("span");
        span0 = element("span");
        t = space();
        if (if_block) if_block.c();
        attr_dev(span0, "class", "rangeNub");
        add_location(span0, file$c, 819, 6, 24395);
        attr_dev(span1, "role", "slider");
        attr_dev(span1, "class", "rangeHandle");
        attr_dev(span1, "data-handle", /*index*/ ctx[66]);
        attr_dev(
          span1,
          "style",
          (span1_style_value =
            "" +
            /*orientationStart*/ (ctx[28] +
              ": " +
              /*$springPositions*/ ctx[29][/*index*/ ctx[66]] +
              "%; z-index: " +
              /*activeHandle*/ (ctx[26] === /*index*/ ctx[66] ? 3 : 2) +
              ";"))
        );

        attr_dev(
          span1,
          "aria-valuemin",
          (span1_aria_valuemin_value =
            /*range*/ ctx[2] === true && /*index*/ ctx[66] === 1
              ? /*values*/ ctx[0][0]
              : /*min*/ ctx[3])
        );

        attr_dev(
          span1,
          "aria-valuemax",
          (span1_aria_valuemax_value =
            /*range*/ ctx[2] === true && /*index*/ ctx[66] === 0
              ? /*values*/ ctx[0][1]
              : /*max*/ ctx[4])
        );

        attr_dev(
          span1,
          "aria-valuenow",
          (span1_aria_valuenow_value = /*value*/ ctx[64])
        );
        attr_dev(
          span1,
          "aria-valuetext",
          (span1_aria_valuetext_value =
            "" +
            /*prefix*/ (ctx[18] +
              /*handleFormatter*/ ctx[21](
                /*value*/ ctx[64],
                /*index*/ ctx[66],
                /*percentOf*/ ctx[23](/*value*/ ctx[64])
              ) +
              /*suffix*/ ctx[19]))
        );
        attr_dev(
          span1,
          "aria-orientation",
          (span1_aria_orientation_value = /*vertical*/ ctx[6]
            ? "vertical"
            : "horizontal")
        );
        attr_dev(span1, "aria-disabled", /*disabled*/ ctx[10]);
        attr_dev(span1, "disabled", /*disabled*/ ctx[10]);
        attr_dev(
          span1,
          "tabindex",
          (span1_tabindex_value = /*disabled*/ ctx[10] ? -1 : 0)
        );
        toggle_class(
          span1,
          "active",
          /*focus*/ ctx[24] && /*activeHandle*/ ctx[26] === /*index*/ ctx[66]
        );
        toggle_class(
          span1,
          "press",
          /*handlePressed*/ ctx[25] &&
            /*activeHandle*/ ctx[26] === /*index*/ ctx[66]
        );
        add_location(span1, file$c, 800, 4, 23582);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span1, anchor);
        append_dev(span1, span0);
        append_dev(span1, t);
        if (if_block) if_block.m(span1, null);

        if (!mounted) {
          dispose = [
            listen_dev(
              span1,
              "blur",
              /*sliderBlurHandle*/ ctx[34],
              false,
              false,
              false
            ),
            listen_dev(
              span1,
              "focus",
              /*sliderFocusHandle*/ ctx[35],
              false,
              false,
              false
            ),
            listen_dev(
              span1,
              "keydown",
              /*sliderKeydown*/ ctx[36],
              false,
              false,
              false
            ),
          ];

          mounted = true;
        }
      },
      p: function update(ctx, dirty) {
        if (/*float*/ ctx[7]) {
          if (if_block) {
            if_block.p(ctx, dirty);
          } else {
            if_block = create_if_block_2$2(ctx);
            if_block.c();
            if_block.m(span1, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }

        if (
          dirty[0] &
            /*orientationStart, $springPositions, activeHandle*/ 872415232 &&
          span1_style_value !==
            (span1_style_value =
              "" +
              /*orientationStart*/ (ctx[28] +
                ": " +
                /*$springPositions*/ ctx[29][/*index*/ ctx[66]] +
                "%; z-index: " +
                /*activeHandle*/ (ctx[26] === /*index*/ ctx[66] ? 3 : 2) +
                ";"))
        ) {
          attr_dev(span1, "style", span1_style_value);
        }

        if (
          dirty[0] & /*range, values, min*/ 13 &&
          span1_aria_valuemin_value !==
            (span1_aria_valuemin_value =
              /*range*/ ctx[2] === true && /*index*/ ctx[66] === 1
                ? /*values*/ ctx[0][0]
                : /*min*/ ctx[3])
        ) {
          attr_dev(span1, "aria-valuemin", span1_aria_valuemin_value);
        }

        if (
          dirty[0] & /*range, values, max*/ 21 &&
          span1_aria_valuemax_value !==
            (span1_aria_valuemax_value =
              /*range*/ ctx[2] === true && /*index*/ ctx[66] === 0
                ? /*values*/ ctx[0][1]
                : /*max*/ ctx[4])
        ) {
          attr_dev(span1, "aria-valuemax", span1_aria_valuemax_value);
        }

        if (
          dirty[0] & /*values*/ 1 &&
          span1_aria_valuenow_value !==
            (span1_aria_valuenow_value = /*value*/ ctx[64])
        ) {
          attr_dev(span1, "aria-valuenow", span1_aria_valuenow_value);
        }

        if (
          dirty[0] &
            /*prefix, handleFormatter, values, percentOf, suffix*/ 11272193 &&
          span1_aria_valuetext_value !==
            (span1_aria_valuetext_value =
              "" +
              /*prefix*/ (ctx[18] +
                /*handleFormatter*/ ctx[21](
                  /*value*/ ctx[64],
                  /*index*/ ctx[66],
                  /*percentOf*/ ctx[23](/*value*/ ctx[64])
                ) +
                /*suffix*/ ctx[19]))
        ) {
          attr_dev(span1, "aria-valuetext", span1_aria_valuetext_value);
        }

        if (
          dirty[0] & /*vertical*/ 64 &&
          span1_aria_orientation_value !==
            (span1_aria_orientation_value = /*vertical*/ ctx[6]
              ? "vertical"
              : "horizontal")
        ) {
          attr_dev(span1, "aria-orientation", span1_aria_orientation_value);
        }

        if (dirty[0] & /*disabled*/ 1024) {
          attr_dev(span1, "aria-disabled", /*disabled*/ ctx[10]);
        }

        if (dirty[0] & /*disabled*/ 1024) {
          attr_dev(span1, "disabled", /*disabled*/ ctx[10]);
        }

        if (
          dirty[0] & /*disabled*/ 1024 &&
          span1_tabindex_value !==
            (span1_tabindex_value = /*disabled*/ ctx[10] ? -1 : 0)
        ) {
          attr_dev(span1, "tabindex", span1_tabindex_value);
        }

        if (dirty[0] & /*focus, activeHandle*/ 83886080) {
          toggle_class(
            span1,
            "active",
            /*focus*/ ctx[24] && /*activeHandle*/ ctx[26] === /*index*/ ctx[66]
          );
        }

        if (dirty[0] & /*handlePressed, activeHandle*/ 100663296) {
          toggle_class(
            span1,
            "press",
            /*handlePressed*/ ctx[25] &&
              /*activeHandle*/ ctx[26] === /*index*/ ctx[66]
          );
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span1);
        if (if_block) if_block.d();
        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block$1.name,
      type: "each",
      source: "(800:2) {#each values as value, index}",
      ctx,
    });

    return block;
  }

  // (828:2) {#if range}
  function create_if_block_1$6(ctx) {
    let span;
    let span_style_value;

    const block = {
      c: function create() {
        span = element("span");
        attr_dev(span, "class", "rangeBar");
        attr_dev(
          span,
          "style",
          (span_style_value =
            "" +
            /*orientationStart*/ (ctx[28] +
              ": " +
              /*rangeStart*/ ctx[32](/*$springPositions*/ ctx[29]) +
              "%; " +
              /*orientationEnd*/ ctx[27] +
              ": " +
              /*rangeEnd*/ ctx[33](/*$springPositions*/ ctx[29]) +
              "%;"))
        );
        add_location(span, file$c, 828, 4, 24727);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
      },
      p: function update(ctx, dirty) {
        if (
          dirty[0] &
            /*orientationStart, $springPositions, orientationEnd*/ 939524096 &&
          span_style_value !==
            (span_style_value =
              "" +
              /*orientationStart*/ (ctx[28] +
                ": " +
                /*rangeStart*/ ctx[32](/*$springPositions*/ ctx[29]) +
                "%; " +
                /*orientationEnd*/ ctx[27] +
                ": " +
                /*rangeEnd*/ ctx[33](/*$springPositions*/ ctx[29]) +
                "%;"))
        ) {
          attr_dev(span, "style", span_style_value);
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_1$6.name,
      type: "if",
      source: "(828:2) {#if range}",
      ctx,
    });

    return block;
  }

  // (834:2) {#if pips}
  function create_if_block$a(ctx) {
    let rangepips;
    let current;

    rangepips = new RangePips({
      props: {
        values: /*values*/ ctx[0],
        min: /*min*/ ctx[3],
        max: /*max*/ ctx[4],
        step: /*step*/ ctx[5],
        range: /*range*/ ctx[2],
        vertical: /*vertical*/ ctx[6],
        reversed: /*reversed*/ ctx[8],
        orientationStart: /*orientationStart*/ ctx[28],
        hoverable: /*hoverable*/ ctx[9],
        disabled: /*disabled*/ ctx[10],
        all: /*all*/ ctx[13],
        first: /*first*/ ctx[14],
        last: /*last*/ ctx[15],
        rest: /*rest*/ ctx[16],
        pipstep: /*pipstep*/ ctx[12],
        prefix: /*prefix*/ ctx[18],
        suffix: /*suffix*/ ctx[19],
        formatter: /*formatter*/ ctx[20],
        focus: /*focus*/ ctx[24],
        percentOf: /*percentOf*/ ctx[23],
        moveHandle: /*moveHandle*/ ctx[31],
        fixFloat: /*fixFloat*/ ctx[30],
      },
      $$inline: true,
    });

    const block = {
      c: function create() {
        create_component(rangepips.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(rangepips, target, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        const rangepips_changes = {};
        if (dirty[0] & /*values*/ 1)
          rangepips_changes.values = /*values*/ ctx[0];
        if (dirty[0] & /*min*/ 8) rangepips_changes.min = /*min*/ ctx[3];
        if (dirty[0] & /*max*/ 16) rangepips_changes.max = /*max*/ ctx[4];
        if (dirty[0] & /*step*/ 32) rangepips_changes.step = /*step*/ ctx[5];
        if (dirty[0] & /*range*/ 4) rangepips_changes.range = /*range*/ ctx[2];
        if (dirty[0] & /*vertical*/ 64)
          rangepips_changes.vertical = /*vertical*/ ctx[6];
        if (dirty[0] & /*reversed*/ 256)
          rangepips_changes.reversed = /*reversed*/ ctx[8];
        if (dirty[0] & /*orientationStart*/ 268435456)
          rangepips_changes.orientationStart = /*orientationStart*/ ctx[28];
        if (dirty[0] & /*hoverable*/ 512)
          rangepips_changes.hoverable = /*hoverable*/ ctx[9];
        if (dirty[0] & /*disabled*/ 1024)
          rangepips_changes.disabled = /*disabled*/ ctx[10];
        if (dirty[0] & /*all*/ 8192) rangepips_changes.all = /*all*/ ctx[13];
        if (dirty[0] & /*first*/ 16384)
          rangepips_changes.first = /*first*/ ctx[14];
        if (dirty[0] & /*last*/ 32768)
          rangepips_changes.last = /*last*/ ctx[15];
        if (dirty[0] & /*rest*/ 65536)
          rangepips_changes.rest = /*rest*/ ctx[16];
        if (dirty[0] & /*pipstep*/ 4096)
          rangepips_changes.pipstep = /*pipstep*/ ctx[12];
        if (dirty[0] & /*prefix*/ 262144)
          rangepips_changes.prefix = /*prefix*/ ctx[18];
        if (dirty[0] & /*suffix*/ 524288)
          rangepips_changes.suffix = /*suffix*/ ctx[19];
        if (dirty[0] & /*formatter*/ 1048576)
          rangepips_changes.formatter = /*formatter*/ ctx[20];
        if (dirty[0] & /*focus*/ 16777216)
          rangepips_changes.focus = /*focus*/ ctx[24];
        if (dirty[0] & /*percentOf*/ 8388608)
          rangepips_changes.percentOf = /*percentOf*/ ctx[23];
        rangepips.$set(rangepips_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(rangepips.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(rangepips.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(rangepips, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$a.name,
      type: "if",
      source: "(834:2) {#if pips}",
      ctx,
    });

    return block;
  }

  function create_fragment$c(ctx) {
    let div;
    let t0;
    let t1;
    let current;
    let mounted;
    let dispose;
    let each_value = /*values*/ ctx[0];
    validate_each_argument(each_value);
    let each_blocks = [];

    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$1(
        get_each_context$1(ctx, each_value, i)
      );
    }

    let if_block0 = /*range*/ ctx[2] && create_if_block_1$6(ctx);
    let if_block1 = /*pips*/ ctx[11] && create_if_block$a(ctx);

    const block = {
      c: function create() {
        div = element("div");

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        t0 = space();
        if (if_block0) if_block0.c();
        t1 = space();
        if (if_block1) if_block1.c();
        attr_dev(div, "id", /*id*/ ctx[17]);
        attr_dev(div, "class", "rangeSlider");
        toggle_class(div, "range", /*range*/ ctx[2]);
        toggle_class(div, "disabled", /*disabled*/ ctx[10]);
        toggle_class(div, "hoverable", /*hoverable*/ ctx[9]);
        toggle_class(div, "vertical", /*vertical*/ ctx[6]);
        toggle_class(div, "reversed", /*reversed*/ ctx[8]);
        toggle_class(div, "focus", /*focus*/ ctx[24]);
        toggle_class(div, "min", /*range*/ ctx[2] === "min");
        toggle_class(div, "max", /*range*/ ctx[2] === "max");
        toggle_class(div, "pips", /*pips*/ ctx[11]);
        toggle_class(
          div,
          "pip-labels",
          /*all*/ ctx[13] === "label" ||
            /*first*/ ctx[14] === "label" ||
            /*last*/ ctx[15] === "label" ||
            /*rest*/ ctx[16] === "label"
        );
        add_location(div, file$c, 780, 0, 23048);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(div, null);
        }

        append_dev(div, t0);
        if (if_block0) if_block0.m(div, null);
        append_dev(div, t1);
        if (if_block1) if_block1.m(div, null);
        /*div_binding*/ ctx[50](div);
        current = true;

        if (!mounted) {
          dispose = [
            listen_dev(
              window,
              "mousedown",
              /*bodyInteractStart*/ ctx[39],
              false,
              false,
              false
            ),
            listen_dev(
              window,
              "touchstart",
              /*bodyInteractStart*/ ctx[39],
              false,
              false,
              false
            ),
            listen_dev(
              window,
              "mousemove",
              /*bodyInteract*/ ctx[40],
              false,
              false,
              false
            ),
            listen_dev(
              window,
              "touchmove",
              /*bodyInteract*/ ctx[40],
              false,
              false,
              false
            ),
            listen_dev(
              window,
              "mouseup",
              /*bodyMouseUp*/ ctx[41],
              false,
              false,
              false
            ),
            listen_dev(
              window,
              "touchend",
              /*bodyTouchEnd*/ ctx[42],
              false,
              false,
              false
            ),
            listen_dev(
              window,
              "keydown",
              /*bodyKeyDown*/ ctx[43],
              false,
              false,
              false
            ),
            listen_dev(
              div,
              "mousedown",
              /*sliderInteractStart*/ ctx[37],
              false,
              false,
              false
            ),
            listen_dev(
              div,
              "mouseup",
              /*sliderInteractEnd*/ ctx[38],
              false,
              false,
              false
            ),
            listen_dev(
              div,
              "touchstart",
              prevent_default(/*sliderInteractStart*/ ctx[37]),
              false,
              true,
              false
            ),
            listen_dev(
              div,
              "touchend",
              prevent_default(/*sliderInteractEnd*/ ctx[38]),
              false,
              true,
              false
            ),
          ];

          mounted = true;
        }
      },
      p: function update(ctx, dirty) {
        if (
          (dirty[0] &
            /*orientationStart, $springPositions, activeHandle, range, values, min, max, prefix, handleFormatter, percentOf, suffix, vertical, disabled, focus, handlePressed, float*/ 934020317) |
          (dirty[1] & /*sliderBlurHandle, sliderFocusHandle, sliderKeydown*/ 56)
        ) {
          each_value = /*values*/ ctx[0];
          validate_each_argument(each_value);
          let i;

          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context$1(ctx, each_value, i);

            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block$1(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(div, t0);
            }
          }

          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }

          each_blocks.length = each_value.length;
        }

        if (/*range*/ ctx[2]) {
          if (if_block0) {
            if_block0.p(ctx, dirty);
          } else {
            if_block0 = create_if_block_1$6(ctx);
            if_block0.c();
            if_block0.m(div, t1);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        if (/*pips*/ ctx[11]) {
          if (if_block1) {
            if_block1.p(ctx, dirty);

            if (dirty[0] & /*pips*/ 2048) {
              transition_in(if_block1, 1);
            }
          } else {
            if_block1 = create_if_block$a(ctx);
            if_block1.c();
            transition_in(if_block1, 1);
            if_block1.m(div, null);
          }
        } else if (if_block1) {
          group_outros();

          transition_out(if_block1, 1, 1, () => {
            if_block1 = null;
          });

          check_outros();
        }

        if (!current || dirty[0] & /*id*/ 131072) {
          attr_dev(div, "id", /*id*/ ctx[17]);
        }

        if (!current || dirty[0] & /*range*/ 4) {
          toggle_class(div, "range", /*range*/ ctx[2]);
        }

        if (!current || dirty[0] & /*disabled*/ 1024) {
          toggle_class(div, "disabled", /*disabled*/ ctx[10]);
        }

        if (!current || dirty[0] & /*hoverable*/ 512) {
          toggle_class(div, "hoverable", /*hoverable*/ ctx[9]);
        }

        if (!current || dirty[0] & /*vertical*/ 64) {
          toggle_class(div, "vertical", /*vertical*/ ctx[6]);
        }

        if (!current || dirty[0] & /*reversed*/ 256) {
          toggle_class(div, "reversed", /*reversed*/ ctx[8]);
        }

        if (!current || dirty[0] & /*focus*/ 16777216) {
          toggle_class(div, "focus", /*focus*/ ctx[24]);
        }

        if (!current || dirty[0] & /*range*/ 4) {
          toggle_class(div, "min", /*range*/ ctx[2] === "min");
        }

        if (!current || dirty[0] & /*range*/ 4) {
          toggle_class(div, "max", /*range*/ ctx[2] === "max");
        }

        if (!current || dirty[0] & /*pips*/ 2048) {
          toggle_class(div, "pips", /*pips*/ ctx[11]);
        }

        if (!current || dirty[0] & /*all, first, last, rest*/ 122880) {
          toggle_class(
            div,
            "pip-labels",
            /*all*/ ctx[13] === "label" ||
              /*first*/ ctx[14] === "label" ||
              /*last*/ ctx[15] === "label" ||
              /*rest*/ ctx[16] === "label"
          );
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(if_block1);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block1);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        destroy_each(each_blocks, detaching);
        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
        /*div_binding*/ ctx[50](null);
        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$c.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function index(el) {
    if (!el) return -1;
    var i = 0;

    while ((el = el.previousElementSibling)) {
      i++;
    }

    return i;
  }

  /**
   * normalise a mouse or touch event to return the
   * client (x/y) object for that event
   * @param {event} e a mouse/touch event to normalise
   * @returns {object} normalised event client object (x,y)
   **/
  function normalisedClient(e) {
    if (e.type.includes("touch")) {
      return e.touches[0];
    } else {
      return e;
    }
  }

  function instance$c($$self, $$props, $$invalidate) {
    let percentOf;
    let clampValue;
    let alignValueToStep;
    let orientationStart;
    let orientationEnd;

    let $springPositions,
      $$unsubscribe_springPositions = noop,
      $$subscribe_springPositions = () => (
        $$unsubscribe_springPositions(),
        ($$unsubscribe_springPositions = subscribe(springPositions, ($$value) =>
          $$invalidate(29, ($springPositions = $$value))
        )),
        springPositions
      );

    $$self.$$.on_destroy.push(() => $$unsubscribe_springPositions());
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("RangeSlider", slots, []);
    let { slider = undefined } = $$props;
    let { range = false } = $$props;
    let { pushy = false } = $$props;
    let { min = 0 } = $$props;
    let { max = 100 } = $$props;
    let { step = 1 } = $$props;
    let { values = [(max + min) / 2] } = $$props;
    let { vertical = false } = $$props;
    let { float = false } = $$props;
    let { reversed = false } = $$props;
    let { hoverable = true } = $$props;
    let { disabled = false } = $$props;
    let { pips = false } = $$props;
    let { pipstep = undefined } = $$props;
    let { all = undefined } = $$props;
    let { first = undefined } = $$props;
    let { last = undefined } = $$props;
    let { rest = undefined } = $$props;
    let { id = undefined } = $$props;
    let { prefix = "" } = $$props;
    let { suffix = "" } = $$props;
    let { formatter = (v, i, p) => v } = $$props;
    let { handleFormatter = formatter } = $$props;
    let { precision = 2 } = $$props;
    let { springValues = { stiffness: 0.15, damping: 0.4 } } = $$props;

    // prepare dispatched events
    const dispatch = createEventDispatcher();

    // state management
    let valueLength = 0;

    let focus = false;
    let handleActivated = false;
    let handlePressed = false;
    let keyboardActive = false;
    let activeHandle = values.length - 1;
    let startValue;
    let previousValue;

    // copy the initial values in to a spring function which
    // will update every time the values array is modified
    let springPositions;

    const fixFloat = (v) => parseFloat(v.toFixed(precision));

    /**
     * check if an element is a handle on the slider
     * @param {object} el dom object reference we want to check
     * @returns {boolean}
     **/
    function targetIsHandle(el) {
      const handles = slider.querySelectorAll(".handle");
      const isHandle = Array.prototype.includes.call(handles, el);
      const isChild = Array.prototype.some.call(handles, (e) => e.contains(el));
      return isHandle || isChild;
    }

    /**
     * trim the values array based on whether the property
     * for 'range' is 'min', 'max', or truthy. This is because we
     * do not want more than one handle for a min/max range, and we do
     * not want more than two handles for a true range.
     * @param {array} values the input values for the rangeSlider
     * @return {array} the range array for creating a rangeSlider
     **/
    function trimRange(values) {
      if (range === "min" || range === "max") {
        return values.slice(0, 1);
      } else if (range) {
        return values.slice(0, 2);
      } else {
        return values;
      }
    }

    /**
     * helper to return the slider dimensions for finding
     * the closest handle to user interaction
     * @return {object} the range slider DOM client rect
     **/
    function getSliderDimensions() {
      return slider.getBoundingClientRect();
    }

    /**
     * helper to return closest handle to user interaction
     * @param {object} clientPos the client{x,y} positions to check against
     * @return {number} the index of the closest handle to clientPos
     **/
    function getClosestHandle(clientPos) {
      // first make sure we have the latest dimensions
      // of the slider, as it may have changed size
      const dims = getSliderDimensions();

      // calculate the interaction position, percent and value
      let handlePos = 0;

      let handlePercent = 0;
      let handleVal = 0;

      if (vertical) {
        handlePos = clientPos.clientY - dims.top;
        handlePercent = (handlePos / dims.height) * 100;
        handlePercent = reversed ? handlePercent : 100 - handlePercent;
      } else {
        handlePos = clientPos.clientX - dims.left;
        handlePercent = (handlePos / dims.width) * 100;
        handlePercent = reversed ? 100 - handlePercent : handlePercent;
      }

      handleVal = ((max - min) / 100) * handlePercent + min;
      let closest;

      // if we have a range, and the handles are at the same
      // position, we want a simple check if the interaction
      // value is greater than return the second handle
      if (range === true && values[0] === values[1]) {
        if (handleVal > values[1]) {
          return 1;
        } else {
          return 0;
        }
      } // we sort the handles values, and return the first one closest
      // to the interaction value
      else {
        closest = values.indexOf(
          [...values].sort(
            (a, b) => Math.abs(handleVal - a) - Math.abs(handleVal - b)
          )[0]
        ); // if there are multiple handles, and not a range, then
      }

      return closest;
    }

    /**
     * take the interaction position on the slider, convert
     * it to a value on the range, and then send that value
     * through to the moveHandle() method to set the active
     * handle's position
     * @param {object} clientPos the client{x,y} of the interaction
     **/
    function handleInteract(clientPos) {
      // first make sure we have the latest dimensions
      // of the slider, as it may have changed size
      const dims = getSliderDimensions();

      // calculate the interaction position, percent and value
      let handlePos = 0;

      let handlePercent = 0;
      let handleVal = 0;

      if (vertical) {
        handlePos = clientPos.clientY - dims.top;
        handlePercent = (handlePos / dims.height) * 100;
        handlePercent = reversed ? handlePercent : 100 - handlePercent;
      } else {
        handlePos = clientPos.clientX - dims.left;
        handlePercent = (handlePos / dims.width) * 100;
        handlePercent = reversed ? 100 - handlePercent : handlePercent;
      }

      handleVal = ((max - min) / 100) * handlePercent + min;

      // move handle to the value
      moveHandle(activeHandle, handleVal);
    }

    /**
     * move a handle to a specific value, respecting the clamp/align rules
     * @param {number} index the index of the handle we want to move
     * @param {number} value the value to move the handle to
     * @return {number} the value that was moved to (after alignment/clamping)
     **/
    function moveHandle(index, value) {
      // align & clamp the value so we're not doing extra
      // calculation on an out-of-range value down below
      value = alignValueToStep(value);

      // use the active handle if handle index is not provided
      if (typeof index === "undefined") {
        index = activeHandle;
      }

      // if this is a range slider perform special checks
      if (range) {
        // restrict the handles of a range-slider from
        // going past one-another unless "pushy" is true
        if (index === 0 && value > values[1]) {
          if (pushy) {
            $$invalidate(0, (values[1] = value), values);
          } else {
            value = values[1];
          }
        } else if (index === 1 && value < values[0]) {
          if (pushy) {
            $$invalidate(0, (values[0] = value), values);
          } else {
            value = values[0];
          }
        }
      }

      // if the value has changed, update it
      if (values[index] !== value) {
        $$invalidate(0, (values[index] = value), values);
      }

      // fire the change event when the handle moves,
      // and store the previous value for the next time
      if (previousValue !== value) {
        eChange();
        previousValue = value;
      }

      return value;
    }

    /**
     * helper to find the beginning range value for use with css style
     * @param {array} values the input values for the rangeSlider
     * @return {number} the beginning of the range
     **/
    function rangeStart(values) {
      if (range === "min") {
        return 0;
      } else {
        return values[0];
      }
    }

    /**
     * helper to find the ending range value for use with css style
     * @param {array} values the input values for the rangeSlider
     * @return {number} the end of the range
     **/
    function rangeEnd(values) {
      if (range === "max") {
        return 0;
      } else if (range === "min") {
        return 100 - values[0];
      } else {
        return 100 - values[1];
      }
    }

    /**
     * when the user has unfocussed (blurred) from the
     * slider, deactivate all handles
     * @param {event} e the event from browser
     **/
    function sliderBlurHandle(e) {
      if (keyboardActive) {
        $$invalidate(24, (focus = false));
        handleActivated = false;
        $$invalidate(25, (handlePressed = false));
      }
    }

    /**
     * when the user focusses the handle of a slider
     * set it to be active
     * @param {event} e the event from browser
     **/
    function sliderFocusHandle(e) {
      if (!disabled) {
        $$invalidate(26, (activeHandle = index(e.target)));
        $$invalidate(24, (focus = true));
      }
    }

    /**
     * handle the keyboard accessible features by checking the
     * input type, and modfier key then moving handle by appropriate amount
     * @param {event} e the event from browser
     **/
    function sliderKeydown(e) {
      if (!disabled) {
        const handle = index(e.target);
        let jump = e.ctrlKey || e.metaKey || e.shiftKey ? step * 10 : step;
        let prevent = false;

        switch (e.key) {
          case "PageDown":
            jump *= 10;
          case "ArrowRight":
          case "ArrowUp":
            moveHandle(handle, values[handle] + jump);
            prevent = true;
            break;
          case "PageUp":
            jump *= 10;
          case "ArrowLeft":
          case "ArrowDown":
            moveHandle(handle, values[handle] - jump);
            prevent = true;
            break;
          case "Home":
            moveHandle(handle, min);
            prevent = true;
            break;
          case "End":
            moveHandle(handle, max);
            prevent = true;
            break;
        }

        if (prevent) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    }

    /**
     * function to run when the user touches
     * down on the slider element anywhere
     * @param {event} e the event from browser
     **/
    function sliderInteractStart(e) {
      if (!disabled) {
        const el = e.target;
        const clientPos = normalisedClient(e);

        // set the closest handle as active
        $$invalidate(24, (focus = true));

        handleActivated = true;
        $$invalidate(25, (handlePressed = true));
        $$invalidate(26, (activeHandle = getClosestHandle(clientPos)));

        // fire the start event
        startValue = previousValue = alignValueToStep(values[activeHandle]);

        eStart();

        // for touch devices we want the handle to instantly
        // move to the position touched for more responsive feeling
        if (e.type === "touchstart" && !el.matches(".pipVal")) {
          handleInteract(clientPos);
        }
      }
    }

    /**
     * function to run when the user stops touching
     * down on the slider element anywhere
     * @param {event} e the event from browser
     **/
    function sliderInteractEnd(e) {
      // fire the stop event for touch devices
      if (e.type === "touchend") {
        eStop();
      }

      $$invalidate(25, (handlePressed = false));
    }

    /**
     * unfocus the slider if the user clicked off of
     * it, somewhere else on the screen
     * @param {event} e the event from browser
     **/
    function bodyInteractStart(e) {
      keyboardActive = false;

      if (focus && e.target !== slider && !slider.contains(e.target)) {
        $$invalidate(24, (focus = false));
      }
    }

    /**
     * send the clientX through to handle the interaction
     * whenever the user moves acros screen while active
     * @param {event} e the event from browser
     **/
    function bodyInteract(e) {
      if (!disabled) {
        if (handleActivated) {
          handleInteract(normalisedClient(e));
        }
      }
    }

    /**
     * if user triggers mouseup on the body while
     * a handle is active (without moving) then we
     * trigger an interact event there
     * @param {event} e the event from browser
     **/
    function bodyMouseUp(e) {
      if (!disabled) {
        const el = e.target;

        // this only works if a handle is active, which can
        // only happen if there was sliderInteractStart triggered
        // on the slider, already
        if (handleActivated) {
          if (el === slider || slider.contains(el)) {
            $$invalidate(24, (focus = true));

            // don't trigger interact if the target is a handle (no need) or
            // if the target is a label (we want to move to that value from rangePips)
            if (!targetIsHandle(el) && !el.matches(".pipVal")) {
              handleInteract(normalisedClient(e));
            }
          }

          // fire the stop event for mouse device
          // when the body is triggered with an active handle
          eStop();
        }
      }

      handleActivated = false;
      $$invalidate(25, (handlePressed = false));
    }

    /**
     * if user triggers touchend on the body then we
     * defocus the slider completely
     * @param {event} e the event from browser
     **/
    function bodyTouchEnd(e) {
      handleActivated = false;
      $$invalidate(25, (handlePressed = false));
    }

    function bodyKeyDown(e) {
      if (!disabled) {
        if (e.target === slider || slider.contains(e.target)) {
          keyboardActive = true;
        }
      }
    }

    function eStart() {
      !disabled &&
        dispatch("start", {
          activeHandle,
          value: startValue,
          values: values.map((v) => alignValueToStep(v)),
        });
    }

    function eStop() {
      !disabled &&
        dispatch("stop", {
          activeHandle,
          startValue,
          value: values[activeHandle],
          values: values.map((v) => alignValueToStep(v)),
        });
    }

    function eChange() {
      !disabled &&
        dispatch("change", {
          activeHandle,
          startValue,
          previousValue:
            typeof previousValue === "undefined" ? startValue : previousValue,
          value: values[activeHandle],
          values: values.map((v) => alignValueToStep(v)),
        });
    }

    const writable_props = [
      "slider",
      "range",
      "pushy",
      "min",
      "max",
      "step",
      "values",
      "vertical",
      "float",
      "reversed",
      "hoverable",
      "disabled",
      "pips",
      "pipstep",
      "all",
      "first",
      "last",
      "rest",
      "id",
      "prefix",
      "suffix",
      "formatter",
      "handleFormatter",
      "precision",
      "springValues",
    ];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console_1$2.warn(
          `<RangeSlider> was created with unknown prop '${key}'`
        );
    });

    function div_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        slider = $$value;
        $$invalidate(1, slider);
      });
    }

    $$self.$$set = ($$props) => {
      if ("slider" in $$props) $$invalidate(1, (slider = $$props.slider));
      if ("range" in $$props) $$invalidate(2, (range = $$props.range));
      if ("pushy" in $$props) $$invalidate(44, (pushy = $$props.pushy));
      if ("min" in $$props) $$invalidate(3, (min = $$props.min));
      if ("max" in $$props) $$invalidate(4, (max = $$props.max));
      if ("step" in $$props) $$invalidate(5, (step = $$props.step));
      if ("values" in $$props) $$invalidate(0, (values = $$props.values));
      if ("vertical" in $$props) $$invalidate(6, (vertical = $$props.vertical));
      if ("float" in $$props) $$invalidate(7, (float = $$props.float));
      if ("reversed" in $$props) $$invalidate(8, (reversed = $$props.reversed));
      if ("hoverable" in $$props)
        $$invalidate(9, (hoverable = $$props.hoverable));
      if ("disabled" in $$props)
        $$invalidate(10, (disabled = $$props.disabled));
      if ("pips" in $$props) $$invalidate(11, (pips = $$props.pips));
      if ("pipstep" in $$props) $$invalidate(12, (pipstep = $$props.pipstep));
      if ("all" in $$props) $$invalidate(13, (all = $$props.all));
      if ("first" in $$props) $$invalidate(14, (first = $$props.first));
      if ("last" in $$props) $$invalidate(15, (last = $$props.last));
      if ("rest" in $$props) $$invalidate(16, (rest = $$props.rest));
      if ("id" in $$props) $$invalidate(17, (id = $$props.id));
      if ("prefix" in $$props) $$invalidate(18, (prefix = $$props.prefix));
      if ("suffix" in $$props) $$invalidate(19, (suffix = $$props.suffix));
      if ("formatter" in $$props)
        $$invalidate(20, (formatter = $$props.formatter));
      if ("handleFormatter" in $$props)
        $$invalidate(21, (handleFormatter = $$props.handleFormatter));
      if ("precision" in $$props)
        $$invalidate(45, (precision = $$props.precision));
      if ("springValues" in $$props)
        $$invalidate(46, (springValues = $$props.springValues));
    };

    $$self.$capture_state = () => ({
      spring,
      createEventDispatcher,
      RangePips,
      slider,
      range,
      pushy,
      min,
      max,
      step,
      values,
      vertical,
      float,
      reversed,
      hoverable,
      disabled,
      pips,
      pipstep,
      all,
      first,
      last,
      rest,
      id,
      prefix,
      suffix,
      formatter,
      handleFormatter,
      precision,
      springValues,
      dispatch,
      valueLength,
      focus,
      handleActivated,
      handlePressed,
      keyboardActive,
      activeHandle,
      startValue,
      previousValue,
      springPositions,
      fixFloat,
      index,
      normalisedClient,
      targetIsHandle,
      trimRange,
      getSliderDimensions,
      getClosestHandle,
      handleInteract,
      moveHandle,
      rangeStart,
      rangeEnd,
      sliderBlurHandle,
      sliderFocusHandle,
      sliderKeydown,
      sliderInteractStart,
      sliderInteractEnd,
      bodyInteractStart,
      bodyInteract,
      bodyMouseUp,
      bodyTouchEnd,
      bodyKeyDown,
      eStart,
      eStop,
      eChange,
      alignValueToStep,
      orientationEnd,
      orientationStart,
      clampValue,
      percentOf,
      $springPositions,
    });

    $$self.$inject_state = ($$props) => {
      if ("slider" in $$props) $$invalidate(1, (slider = $$props.slider));
      if ("range" in $$props) $$invalidate(2, (range = $$props.range));
      if ("pushy" in $$props) $$invalidate(44, (pushy = $$props.pushy));
      if ("min" in $$props) $$invalidate(3, (min = $$props.min));
      if ("max" in $$props) $$invalidate(4, (max = $$props.max));
      if ("step" in $$props) $$invalidate(5, (step = $$props.step));
      if ("values" in $$props) $$invalidate(0, (values = $$props.values));
      if ("vertical" in $$props) $$invalidate(6, (vertical = $$props.vertical));
      if ("float" in $$props) $$invalidate(7, (float = $$props.float));
      if ("reversed" in $$props) $$invalidate(8, (reversed = $$props.reversed));
      if ("hoverable" in $$props)
        $$invalidate(9, (hoverable = $$props.hoverable));
      if ("disabled" in $$props)
        $$invalidate(10, (disabled = $$props.disabled));
      if ("pips" in $$props) $$invalidate(11, (pips = $$props.pips));
      if ("pipstep" in $$props) $$invalidate(12, (pipstep = $$props.pipstep));
      if ("all" in $$props) $$invalidate(13, (all = $$props.all));
      if ("first" in $$props) $$invalidate(14, (first = $$props.first));
      if ("last" in $$props) $$invalidate(15, (last = $$props.last));
      if ("rest" in $$props) $$invalidate(16, (rest = $$props.rest));
      if ("id" in $$props) $$invalidate(17, (id = $$props.id));
      if ("prefix" in $$props) $$invalidate(18, (prefix = $$props.prefix));
      if ("suffix" in $$props) $$invalidate(19, (suffix = $$props.suffix));
      if ("formatter" in $$props)
        $$invalidate(20, (formatter = $$props.formatter));
      if ("handleFormatter" in $$props)
        $$invalidate(21, (handleFormatter = $$props.handleFormatter));
      if ("precision" in $$props)
        $$invalidate(45, (precision = $$props.precision));
      if ("springValues" in $$props)
        $$invalidate(46, (springValues = $$props.springValues));
      if ("valueLength" in $$props)
        $$invalidate(47, (valueLength = $$props.valueLength));
      if ("focus" in $$props) $$invalidate(24, (focus = $$props.focus));
      if ("handleActivated" in $$props)
        handleActivated = $$props.handleActivated;
      if ("handlePressed" in $$props)
        $$invalidate(25, (handlePressed = $$props.handlePressed));
      if ("keyboardActive" in $$props) keyboardActive = $$props.keyboardActive;
      if ("activeHandle" in $$props)
        $$invalidate(26, (activeHandle = $$props.activeHandle));
      if ("startValue" in $$props) startValue = $$props.startValue;
      if ("previousValue" in $$props) previousValue = $$props.previousValue;
      if ("springPositions" in $$props)
        $$subscribe_springPositions(
          $$invalidate(22, (springPositions = $$props.springPositions))
        );
      if ("alignValueToStep" in $$props)
        $$invalidate(48, (alignValueToStep = $$props.alignValueToStep));
      if ("orientationEnd" in $$props)
        $$invalidate(27, (orientationEnd = $$props.orientationEnd));
      if ("orientationStart" in $$props)
        $$invalidate(28, (orientationStart = $$props.orientationStart));
      if ("clampValue" in $$props)
        $$invalidate(49, (clampValue = $$props.clampValue));
      if ("percentOf" in $$props)
        $$invalidate(23, (percentOf = $$props.percentOf));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    $$self.$$.update = () => {
      if ($$self.$$.dirty[0] & /*min, max*/ 24) {
        /**
         * clamp a value from the range so that it always
         * falls within the min/max values
         * @param {number} val the value to clamp
         * @return {number} the value after it's been clamped
         **/
        $$invalidate(
          49,
          (clampValue = function (val) {
            // return the min/max if outside of that range
            return val <= min ? min : val >= max ? max : val;
          })
        );
      }

      if (
        ($$self.$$.dirty[0] & /*min, max, step*/ 56) |
        ($$self.$$.dirty[1] & /*clampValue*/ 262144)
      ) {
        /**
         * align the value with the steps so that it
         * always sits on the closest (above/below) step
         * @param {number} val the value to align
         * @return {number} the value after it's been aligned
         **/
        $$invalidate(
          48,
          (alignValueToStep = function (val) {
            // sanity check for performance
            if (val <= min) {
              return fixFloat(min);
            } else if (val >= max) {
              return fixFloat(max);
            }

            // find the middle-point between steps
            // and see if the value is closer to the
            // next step, or previous step
            let remainder = (val - min) % step;

            let aligned = val - remainder;

            if (Math.abs(remainder) * 2 >= step) {
              aligned += remainder > 0 ? step : -step;
            }

            // make sure the value is within acceptable limits
            aligned = clampValue(aligned);

            // make sure the returned value is set to the precision desired
            // this is also because javascript often returns weird floats
            // when dealing with odd numbers and percentages
            return fixFloat(aligned);
          })
        );
      }

      if ($$self.$$.dirty[0] & /*min, max*/ 24) {
        /**
         * take in a value, and then calculate that value's percentage
         * of the overall range (min-max);
         * @param {number} val the value we're getting percent for
         * @return {number} the percentage value
         **/
        $$invalidate(
          23,
          (percentOf = function (val) {
            let perc = ((val - min) / (max - min)) * 100;

            if (isNaN(perc) || perc <= 0) {
              return 0;
            } else if (perc >= 100) {
              return 100;
            } else {
              return fixFloat(perc);
            }
          })
        );
      }

      if (
        ($$self.$$.dirty[0] &
          /*values, max, min, percentOf, springPositions*/ 12582937) |
        ($$self.$$.dirty[1] &
          /*alignValueToStep, valueLength, springValues*/ 229376)
      ) {
        {
          // check that "values" is an array, or set it as array
          // to prevent any errors in springs, or range trimming
          if (!Array.isArray(values)) {
            $$invalidate(0, (values = [(max + min) / 2]));
            console.error(
              "'values' prop should be an Array (https://github.com/simeydotme/svelte-range-slider-pips#slider-props)"
            );
          }

          // trim the range so it remains as a min/max (only 2 handles)
          // and also align the handles to the steps
          $$invalidate(
            0,
            (values = trimRange(values.map((v) => alignValueToStep(v))))
          );

          // check if the valueLength (length of values[]) has changed,
          // because if so we need to re-seed the spring function with the
          // new values array.
          if (valueLength !== values.length) {
            // set the initial spring values when the slider initialises,
            // or when values array length has changed
            $$subscribe_springPositions(
              $$invalidate(
                22,
                (springPositions = spring(
                  values.map((v) => percentOf(v)),
                  springValues
                ))
              )
            );
          } else {
            // update the value of the spring function for animated handles
            // whenever the values has updated
            springPositions.set(values.map((v) => percentOf(v)));
          }

          // set the valueLength for the next check
          $$invalidate(47, (valueLength = values.length));
        }
      }

      if ($$self.$$.dirty[0] & /*vertical, reversed*/ 320) {
        /**
         * the orientation of the handles/pips based on the
         * input values of vertical and reversed
         **/
        $$invalidate(
          28,
          (orientationStart = vertical
            ? reversed
              ? "top"
              : "bottom"
            : reversed
            ? "right"
            : "left")
        );
      }

      if ($$self.$$.dirty[0] & /*vertical, reversed*/ 320) {
        $$invalidate(
          27,
          (orientationEnd = vertical
            ? reversed
              ? "bottom"
              : "top"
            : reversed
            ? "left"
            : "right")
        );
      }
    };

    return [
      values,
      slider,
      range,
      min,
      max,
      step,
      vertical,
      float,
      reversed,
      hoverable,
      disabled,
      pips,
      pipstep,
      all,
      first,
      last,
      rest,
      id,
      prefix,
      suffix,
      formatter,
      handleFormatter,
      springPositions,
      percentOf,
      focus,
      handlePressed,
      activeHandle,
      orientationEnd,
      orientationStart,
      $springPositions,
      fixFloat,
      moveHandle,
      rangeStart,
      rangeEnd,
      sliderBlurHandle,
      sliderFocusHandle,
      sliderKeydown,
      sliderInteractStart,
      sliderInteractEnd,
      bodyInteractStart,
      bodyInteract,
      bodyMouseUp,
      bodyTouchEnd,
      bodyKeyDown,
      pushy,
      precision,
      springValues,
      valueLength,
      alignValueToStep,
      clampValue,
      div_binding,
    ];
  }

  class RangeSlider extends SvelteComponentDev {
    constructor(options) {
      super(options);

      init(
        this,
        options,
        instance$c,
        create_fragment$c,
        safe_not_equal,
        {
          slider: 1,
          range: 2,
          pushy: 44,
          min: 3,
          max: 4,
          step: 5,
          values: 0,
          vertical: 6,
          float: 7,
          reversed: 8,
          hoverable: 9,
          disabled: 10,
          pips: 11,
          pipstep: 12,
          all: 13,
          first: 14,
          last: 15,
          rest: 16,
          id: 17,
          prefix: 18,
          suffix: 19,
          formatter: 20,
          handleFormatter: 21,
          precision: 45,
          springValues: 46,
        },
        null,
        [-1, -1, -1]
      );

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "RangeSlider",
        options,
        id: create_fragment$c.name,
      });
    }

    get slider() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set slider(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get range() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set range(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get pushy() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set pushy(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get min() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set min(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get max() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set max(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get step() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set step(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get values() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set values(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get vertical() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set vertical(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get float() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set float(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get reversed() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set reversed(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get hoverable() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set hoverable(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get disabled() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set disabled(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get pips() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set pips(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get pipstep() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set pipstep(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get all() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set all(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get first() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set first(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get last() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set last(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get rest() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set rest(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get id() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set id(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get prefix() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set prefix(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get suffix() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set suffix(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get formatter() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set formatter(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get handleFormatter() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set handleFormatter(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get precision() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set precision(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get springValues() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set springValues(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  /* src/components/LobbyModal.svelte generated by Svelte v3.50.1 */
  const file$b = "src/components/LobbyModal.svelte";

  // (23:0) {#if open}
  function create_if_block$9(ctx) {
    let div0;
    let t0;
    let div9;
    let div1;
    let t1;
    let h2;
    let t2;
    let t3;
    let div4;
    let div2;
    let h40;
    let t4;
    let t5_value = /*minutes*/ ctx[2][0] + "";
    let t5;
    let t6;
    let rangeslider0;
    let updating_values;
    let t7;
    let div3;
    let h41;
    let t8;
    let t9_value = /*increment*/ ctx[3][0] + "";
    let t9;
    let t10;
    let rangeslider1;
    let updating_values_1;
    let t11;
    let div8;
    let div5;
    let img0;
    let img0_src_value;
    let t12;
    let div6;
    let img1;
    let img1_src_value;
    let t13;
    let div7;
    let img2;
    let img2_src_value;
    let current;
    let mounted;
    let dispose;

    function rangeslider0_values_binding(value) {
      /*rangeslider0_values_binding*/ ctx[6](value);
    }

    let rangeslider0_props = { id: "slider", max: 30 };

    if (/*minutes*/ ctx[2] !== void 0) {
      rangeslider0_props.values = /*minutes*/ ctx[2];
    }

    rangeslider0 = new RangeSlider({
      props: rangeslider0_props,
      $$inline: true,
    });

    binding_callbacks.push(() =>
      bind(rangeslider0, "values", rangeslider0_values_binding)
    );

    function rangeslider1_values_binding(value) {
      /*rangeslider1_values_binding*/ ctx[7](value);
    }

    let rangeslider1_props = { id: "slider", max: 30 };

    if (/*increment*/ ctx[3] !== void 0) {
      rangeslider1_props.values = /*increment*/ ctx[3];
    }

    rangeslider1 = new RangeSlider({
      props: rangeslider1_props,
      $$inline: true,
    });

    binding_callbacks.push(() =>
      bind(rangeslider1, "values", rangeslider1_values_binding)
    );

    const block = {
      c: function create() {
        div0 = element("div");
        t0 = space();
        div9 = element("div");
        div1 = element("div");
        t1 = space();
        h2 = element("h2");
        t2 = text(/*title*/ ctx[1]);
        t3 = space();
        div4 = element("div");
        div2 = element("div");
        h40 = element("h4");
        t4 = text("Minutes per side: ");
        t5 = text(t5_value);
        t6 = space();
        create_component(rangeslider0.$$.fragment);
        t7 = space();
        div3 = element("div");
        h41 = element("h4");
        t8 = text("Increments in seconds: ");
        t9 = text(t9_value);
        t10 = space();
        create_component(rangeslider1.$$.fragment);
        t11 = space();
        div8 = element("div");
        div5 = element("div");
        img0 = element("img");
        t12 = space();
        div6 = element("div");
        img1 = element("img");
        t13 = space();
        div7 = element("div");
        img2 = element("img");
        attr_dev(div0, "id", "modal-background");
        attr_dev(div0, "class", "svelte-1w8ncd4");
        add_location(div0, file$b, 23, 2, 689);
        attr_dev(div1, "class", "close svelte-1w8ncd4");
        add_location(div1, file$b, 25, 4, 764);
        attr_dev(h2, "class", "svelte-1w8ncd4");
        add_location(h2, file$b, 26, 4, 812);
        attr_dev(h40, "class", "svelte-1w8ncd4");
        add_location(h40, file$b, 29, 8, 906);
        attr_dev(div2, "class", "slider-container svelte-1w8ncd4");
        add_location(div2, file$b, 28, 6, 867);
        attr_dev(h41, "class", "svelte-1w8ncd4");
        add_location(h41, file$b, 33, 8, 1071);
        attr_dev(div3, "class", "slider-container svelte-1w8ncd4");
        add_location(div3, file$b, 32, 6, 1032);
        attr_dev(div4, "id", "slider-container");
        attr_dev(div4, "class", "svelte-1w8ncd4");
        add_location(div4, file$b, 27, 4, 833);
        attr_dev(img0, "class", "icon svelte-1w8ncd4");
        if (!src_url_equal(img0.src, (img0_src_value = img$i)))
          attr_dev(img0, "src", img0_src_value);
        attr_dev(img0, "alt", "black king");
        add_location(img0, file$b, 39, 8, 1328);
        attr_dev(div5, "class", "color svelte-1w8ncd4");
        add_location(div5, file$b, 38, 6, 1248);
        attr_dev(img1, "id", "combined-icon");
        if (!src_url_equal(img1.src, (img1_src_value = img$g)))
          attr_dev(img1, "src", img1_src_value);
        attr_dev(img1, "alt", "combined king");
        attr_dev(img1, "class", "svelte-1w8ncd4");
        add_location(img1, file$b, 42, 8, 1482);
        attr_dev(div6, "class", "color svelte-1w8ncd4");
        add_location(div6, file$b, 41, 6, 1401);
        attr_dev(img2, "class", "icon svelte-1w8ncd4");
        if (!src_url_equal(img2.src, (img2_src_value = img$h)))
          attr_dev(img2, "src", img2_src_value);
        attr_dev(img2, "alt", "white king");
        add_location(img2, file$b, 45, 8, 1647);
        attr_dev(div7, "class", "color svelte-1w8ncd4");
        add_location(div7, file$b, 44, 6, 1567);
        attr_dev(div8, "id", "color-selection");
        attr_dev(div8, "class", "svelte-1w8ncd4");
        add_location(div8, file$b, 37, 4, 1215);
        attr_dev(div9, "id", "modal");
        attr_dev(div9, "class", "svelte-1w8ncd4");
        add_location(div9, file$b, 24, 2, 743);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div0, anchor);
        insert_dev(target, t0, anchor);
        insert_dev(target, div9, anchor);
        append_dev(div9, div1);
        append_dev(div9, t1);
        append_dev(div9, h2);
        append_dev(h2, t2);
        append_dev(div9, t3);
        append_dev(div9, div4);
        append_dev(div4, div2);
        append_dev(div2, h40);
        append_dev(h40, t4);
        append_dev(h40, t5);
        append_dev(div2, t6);
        mount_component(rangeslider0, div2, null);
        append_dev(div4, t7);
        append_dev(div4, div3);
        append_dev(div3, h41);
        append_dev(h41, t8);
        append_dev(h41, t9);
        append_dev(div3, t10);
        mount_component(rangeslider1, div3, null);
        append_dev(div9, t11);
        append_dev(div9, div8);
        append_dev(div8, div5);
        append_dev(div5, img0);
        append_dev(div8, t12);
        append_dev(div8, div6);
        append_dev(div6, img1);
        append_dev(div8, t13);
        append_dev(div8, div7);
        append_dev(div7, img2);
        current = true;

        if (!mounted) {
          dispose = [
            listen_dev(
              div0,
              "click",
              /*closeModal*/ ctx[4],
              false,
              false,
              false
            ),
            listen_dev(
              div1,
              "click",
              /*closeModal*/ ctx[4],
              false,
              false,
              false
            ),
            listen_dev(
              div5,
              "click",
              /*click_handler*/ ctx[8],
              false,
              false,
              false
            ),
            listen_dev(
              div6,
              "click",
              /*click_handler_1*/ ctx[9],
              false,
              false,
              false
            ),
            listen_dev(
              div7,
              "click",
              /*click_handler_2*/ ctx[10],
              false,
              false,
              false
            ),
          ];

          mounted = true;
        }
      },
      p: function update(ctx, dirty) {
        if (!current || dirty & /*title*/ 2) set_data_dev(t2, /*title*/ ctx[1]);
        if (
          (!current || dirty & /*minutes*/ 4) &&
          t5_value !== (t5_value = /*minutes*/ ctx[2][0] + "")
        )
          set_data_dev(t5, t5_value);
        const rangeslider0_changes = {};

        if (!updating_values && dirty & /*minutes*/ 4) {
          updating_values = true;
          rangeslider0_changes.values = /*minutes*/ ctx[2];
          add_flush_callback(() => (updating_values = false));
        }

        rangeslider0.$set(rangeslider0_changes);
        if (
          (!current || dirty & /*increment*/ 8) &&
          t9_value !== (t9_value = /*increment*/ ctx[3][0] + "")
        )
          set_data_dev(t9, t9_value);
        const rangeslider1_changes = {};

        if (!updating_values_1 && dirty & /*increment*/ 8) {
          updating_values_1 = true;
          rangeslider1_changes.values = /*increment*/ ctx[3];
          add_flush_callback(() => (updating_values_1 = false));
        }

        rangeslider1.$set(rangeslider1_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(rangeslider0.$$.fragment, local);
        transition_in(rangeslider1.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(rangeslider0.$$.fragment, local);
        transition_out(rangeslider1.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div0);
        if (detaching) detach_dev(t0);
        if (detaching) detach_dev(div9);
        destroy_component(rangeslider0);
        destroy_component(rangeslider1);
        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$9.name,
      type: "if",
      source: "(23:0) {#if open}",
      ctx,
    });

    return block;
  }

  function create_fragment$b(ctx) {
    let if_block_anchor;
    let current;
    let if_block = /*open*/ ctx[0] && create_if_block$9(ctx);

    const block = {
      c: function create() {
        if (if_block) if_block.c();
        if_block_anchor = empty();
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        if (if_block) if_block.m(target, anchor);
        insert_dev(target, if_block_anchor, anchor);
        current = true;
      },
      p: function update(ctx, [dirty]) {
        if (/*open*/ ctx[0]) {
          if (if_block) {
            if_block.p(ctx, dirty);

            if (dirty & /*open*/ 1) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block$9(ctx);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          group_outros();

          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });

          check_outros();
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(if_block);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block);
        current = false;
      },
      d: function destroy(detaching) {
        if (if_block) if_block.d(detaching);
        if (detaching) detach_dev(if_block_anchor);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$b.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$b($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("LobbyModal", slots, []);
    const dispatch = createEventDispatcher();
    let { open = false } = $$props;
    let { title = "" } = $$props;
    let minutes = [5];
    let increment = [5];

    function closeModal() {
      dispatch("closeModal");
    }

    function handleCreateGame(color) {
      dispatch("joinLobby", {
        mode: `${minutes[0]}:${increment[0]}`,
        color,
      });
    }

    const writable_props = ["open", "title"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<LobbyModal> was created with unknown prop '${key}'`);
    });

    function rangeslider0_values_binding(value) {
      minutes = value;
      $$invalidate(2, minutes);
    }

    function rangeslider1_values_binding(value) {
      increment = value;
      $$invalidate(3, increment);
    }

    const click_handler = () => handleCreateGame(ChessColor$1.BLACK);
    const click_handler_1 = () => handleCreateGame(ChessColor$1.RANDOM);
    const click_handler_2 = () => handleCreateGame(ChessColor$1.WHITE);

    $$self.$$set = ($$props) => {
      if ("open" in $$props) $$invalidate(0, (open = $$props.open));
      if ("title" in $$props) $$invalidate(1, (title = $$props.title));
    };

    $$self.$capture_state = () => ({
      createEventDispatcher,
      RangeSlider,
      BlackKing: img$i,
      WhiteKing: img$h,
      CombinedKing: img$g,
      ChessColor: ChessColor$1,
      dispatch,
      open,
      title,
      minutes,
      increment,
      closeModal,
      handleCreateGame,
    });

    $$self.$inject_state = ($$props) => {
      if ("open" in $$props) $$invalidate(0, (open = $$props.open));
      if ("title" in $$props) $$invalidate(1, (title = $$props.title));
      if ("minutes" in $$props) $$invalidate(2, (minutes = $$props.minutes));
      if ("increment" in $$props)
        $$invalidate(3, (increment = $$props.increment));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [
      open,
      title,
      minutes,
      increment,
      closeModal,
      handleCreateGame,
      rangeslider0_values_binding,
      rangeslider1_values_binding,
      click_handler,
      click_handler_1,
      click_handler_2,
    ];
  }

  class LobbyModal extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$b, create_fragment$b, safe_not_equal, {
        open: 0,
        title: 1,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "LobbyModal",
        options,
        id: create_fragment$b.name,
      });
    }

    get open() {
      throw new Error(
        "<LobbyModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set open(value) {
      throw new Error(
        "<LobbyModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get title() {
      throw new Error(
        "<LobbyModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set title(value) {
      throw new Error(
        "<LobbyModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  var img$f =
    "data:image/png;base64,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";

  /* src/components/ClipboxTextInput.svelte generated by Svelte v3.50.1 */
  const file$a = "src/components/ClipboxTextInput.svelte";

  function create_fragment$a(ctx) {
    let div1;
    let input;
    let t;
    let div0;
    let img;
    let img_src_value;
    let mounted;
    let dispose;

    const block = {
      c: function create() {
        div1 = element("div");
        input = element("input");
        t = space();
        div0 = element("div");
        img = element("img");
        input.readOnly = true;
        attr_dev(input, "class", "svelte-wo56r2");
        add_location(input, file$a, 13, 1, 276);
        attr_dev(img, "class", "icon svelte-wo56r2");
        if (!src_url_equal(img.src, (img_src_value = img$f)))
          attr_dev(img, "src", img_src_value);
        attr_dev(img, "alt", "copy to clipboard icon");
        add_location(img, file$a, 15, 2, 420);
        attr_dev(div0, "id", "clipboard-button");
        attr_dev(div0, "class", "svelte-wo56r2");
        add_location(div0, file$a, 14, 1, 357);
        attr_dev(div1, "id", "container");
        attr_dev(div1, "class", "svelte-wo56r2");
        add_location(div1, file$a, 12, 0, 254);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div1, anchor);
        append_dev(div1, input);
        set_input_value(input, /*text*/ ctx[0]);
        /*input_binding*/ ctx[5](input);
        append_dev(div1, t);
        append_dev(div1, div0);
        append_dev(div0, img);

        if (!mounted) {
          dispose = [
            listen_dev(input, "input", /*input_input_handler*/ ctx[4]),
            listen_dev(
              input,
              "focus",
              /*selectInputText*/ ctx[3],
              false,
              false,
              false
            ),
            listen_dev(
              div0,
              "click",
              /*handleCopyToClipboard*/ ctx[2],
              false,
              false,
              false
            ),
          ];

          mounted = true;
        }
      },
      p: function update(ctx, [dirty]) {
        if (dirty & /*text*/ 1 && input.value !== /*text*/ ctx[0]) {
          set_input_value(input, /*text*/ ctx[0]);
        }
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(div1);
        /*input_binding*/ ctx[5](null);
        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$a.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$a($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("ClipboxTextInput", slots, []);
    let { text } = $$props;
    let ref;

    function handleCopyToClipboard() {
      navigator.clipboard.writeText(text);
      ref.select();
    }

    function selectInputText() {
      ref.select();
    }

    const writable_props = ["text"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(
          `<ClipboxTextInput> was created with unknown prop '${key}'`
        );
    });

    function input_input_handler() {
      text = this.value;
      $$invalidate(0, text);
    }

    function input_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        ref = $$value;
        $$invalidate(1, ref);
      });
    }

    $$self.$$set = ($$props) => {
      if ("text" in $$props) $$invalidate(0, (text = $$props.text));
    };

    $$self.$capture_state = () => ({
      CopyToClipboardIcon: img$f,
      text,
      ref,
      handleCopyToClipboard,
      selectInputText,
    });

    $$self.$inject_state = ($$props) => {
      if ("text" in $$props) $$invalidate(0, (text = $$props.text));
      if ("ref" in $$props) $$invalidate(1, (ref = $$props.ref));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [
      text,
      ref,
      handleCopyToClipboard,
      selectInputText,
      input_input_handler,
      input_binding,
    ];
  }

  class ClipboxTextInput extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$a, create_fragment$a, safe_not_equal, {
        text: 0,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "ClipboxTextInput",
        options,
        id: create_fragment$a.name,
      });

      const { ctx } = this.$$;
      const props = options.props || {};

      if (/*text*/ ctx[0] === undefined && !("text" in props)) {
        console.warn(
          "<ClipboxTextInput> was created without expected prop 'text'"
        );
      }
    }

    get text() {
      throw new Error(
        "<ClipboxTextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set text(value) {
      throw new Error(
        "<ClipboxTextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  /* src/views/Home.svelte generated by Svelte v3.50.1 */

  const { Object: Object_1 } = globals;
  const file$9 = "src/views/Home.svelte";

  // (108:4) {:else}
  function create_else_block_1(ctx) {
    let table;
    let current;

    table = new Table({
      props: {
        lobbyTable: /*roomList*/ ctx[4],
        firstIndexName: "Room ID",
        isLobbyTable: false,
      },
      $$inline: true,
    });

    table.$on("joinRoom", /*joinRoom*/ ctx[10]);

    const block = {
      c: function create() {
        create_component(table.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(table, target, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        const table_changes = {};
        if (dirty & /*roomList*/ 16)
          table_changes.lobbyTable = /*roomList*/ ctx[4];
        table.$set(table_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(table.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(table.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(table, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_else_block_1.name,
      type: "else",
      source: "(108:4) {:else}",
      ctx,
    });

    return block;
  }

  // (106:29)
  function create_if_block_2$1(ctx) {
    let table;
    let current;

    table = new Table({
      props: { lobbyTable: /*lobbyList*/ ctx[3] },
      $$inline: true,
    });

    table.$on("joinLobby", /*handleJoinLobby*/ ctx[6]);

    const block = {
      c: function create() {
        create_component(table.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(table, target, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        const table_changes = {};
        if (dirty & /*lobbyList*/ 8)
          table_changes.lobbyTable = /*lobbyList*/ ctx[3];
        table.$set(table_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(table.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(table.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(table, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_2$1.name,
      type: "if",
      source: "(106:29) ",
      ctx,
    });

    return block;
  }

  // (100:4) {#if selected === 0}
  function create_if_block_1$5(ctx) {
    let pairing;
    let current;
    pairing = new Pairing({ $$inline: true });
    pairing.$on("openCustomModal", /*openCustomModal_handler*/ ctx[13]);
    pairing.$on("joinLobby", /*handleJoinLobby*/ ctx[6]);
    pairing.$on("leaveLobby", /*leaveLobby_handler*/ ctx[14]);

    const block = {
      c: function create() {
        create_component(pairing.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(pairing, target, anchor);
        current = true;
      },
      p: noop,
      i: function intro(local) {
        if (current) return;
        transition_in(pairing.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(pairing.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(pairing, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_1$5.name,
      type: "if",
      source: "(100:4) {#if selected === 0}",
      ctx,
    });

    return block;
  }

  // (99:2) <SwitchContainer {selected} on:select={handleSelect}>
  function create_default_slot$1(ctx) {
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    const if_block_creators = [
      create_if_block_1$5,
      create_if_block_2$1,
      create_else_block_1,
    ];
    const if_blocks = [];

    function select_block_type(ctx, dirty) {
      if (/*selected*/ ctx[2] === 0) return 0;
      if (/*selected*/ ctx[2] === 1) return 1;
      return 2;
    }

    current_block_type_index = select_block_type(ctx);
    if_block = if_blocks[current_block_type_index] =
      if_block_creators[current_block_type_index](ctx);

    const block = {
      c: function create() {
        if_block.c();
        if_block_anchor = empty();
      },
      m: function mount(target, anchor) {
        if_blocks[current_block_type_index].m(target, anchor);
        insert_dev(target, if_block_anchor, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx);

        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx, dirty);
        } else {
          group_outros();

          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });

          check_outros();
          if_block = if_blocks[current_block_type_index];

          if (!if_block) {
            if_block = if_blocks[current_block_type_index] =
              if_block_creators[current_block_type_index](ctx);
            if_block.c();
          } else {
            if_block.p(ctx, dirty);
          }

          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(if_block);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block);
        current = false;
      },
      d: function destroy(detaching) {
        if_blocks[current_block_type_index].d(detaching);
        if (detaching) detach_dev(if_block_anchor);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_default_slot$1.name,
      type: "slot",
      source: "(99:2) <SwitchContainer {selected} on:select={handleSelect}>",
      ctx,
    });

    return block;
  }

  // (125:4) {:else}
  function create_else_block$4(ctx) {
    let clipboxtextinput;
    let current;

    clipboxtextinput = new ClipboxTextInput({
      props: {
        text: `https://chess.diderikk.dev/chess/lobby/${/*friendLink*/ ctx[1]}`,
      },
      $$inline: true,
    });

    const block = {
      c: function create() {
        create_component(clipboxtextinput.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(clipboxtextinput, target, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        const clipboxtextinput_changes = {};
        if (dirty & /*friendLink*/ 2)
          clipboxtextinput_changes.text = `https://chess.diderikk.dev/chess/lobby/${
            /*friendLink*/ ctx[1]
          }`;
        clipboxtextinput.$set(clipboxtextinput_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(clipboxtextinput.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(clipboxtextinput.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(clipboxtextinput, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_else_block$4.name,
      type: "else",
      source: "(125:4) {:else}",
      ctx,
    });

    return block;
  }

  // (121:4) {#if friendLink.length === 0}
  function create_if_block$8(ctx) {
    let div;
    let h3;
    let mounted;
    let dispose;

    const block = {
      c: function create() {
        div = element("div");
        h3 = element("h3");
        h3.textContent = "Play With A Friend";
        attr_dev(h3, "class", "svelte-1liyo2f");
        add_location(h3, file$9, 122, 8, 3651);
        attr_dev(div, "class", "sidebar-button svelte-1liyo2f");
        add_location(div, file$9, 121, 6, 3569);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        append_dev(div, h3);

        if (!mounted) {
          dispose = listen_dev(
            div,
            "click",
            /*click_handler_1*/ ctx[16],
            false,
            false,
            false
          );
          mounted = true;
        }
      },
      p: noop,
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        mounted = false;
        dispose();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$8.name,
      type: "if",
      source: "(121:4) {#if friendLink.length === 0}",
      ctx,
    });

    return block;
  }

  function create_fragment$9(ctx) {
    let div3;
    let div0;
    let t0;
    let switchcontainer;
    let t1;
    let div2;
    let div1;
    let h3;
    let t3;
    let current_block_type_index;
    let if_block;
    let t4;
    let lobbymodal;
    let current;
    let mounted;
    let dispose;

    switchcontainer = new SwitchContainer({
      props: {
        selected: /*selected*/ ctx[2],
        $$slots: { default: [create_default_slot$1] },
        $$scope: { ctx },
      },
      $$inline: true,
    });

    switchcontainer.$on("select", /*handleSelect*/ ctx[5]);
    const if_block_creators = [create_if_block$8, create_else_block$4];
    const if_blocks = [];

    function select_block_type_1(ctx, dirty) {
      if (/*friendLink*/ ctx[1].length === 0) return 0;
      return 1;
    }

    current_block_type_index = select_block_type_1(ctx);
    if_block = if_blocks[current_block_type_index] =
      if_block_creators[current_block_type_index](ctx);

    lobbymodal = new LobbyModal({
      props: {
        title: "Create a game",
        open: /*openCustomModal*/ ctx[0],
      },
      $$inline: true,
    });

    lobbymodal.$on("closeModal", /*handleCustomModalClose*/ ctx[7]);
    lobbymodal.$on("joinLobby", /*handleModal*/ ctx[8]);

    const block = {
      c: function create() {
        div3 = element("div");
        div0 = element("div");
        t0 = space();
        create_component(switchcontainer.$$.fragment);
        t1 = space();
        div2 = element("div");
        div1 = element("div");
        h3 = element("h3");
        h3.textContent = "Create A Game";
        t3 = space();
        if_block.c();
        t4 = space();
        create_component(lobbymodal.$$.fragment);
        attr_dev(div0, "class", "sidebar-hidden svelte-1liyo2f");
        add_location(div0, file$9, 96, 2, 2816);
        attr_dev(h3, "class", "svelte-1liyo2f");
        add_location(h3, file$9, 118, 6, 3495);
        attr_dev(div1, "class", "sidebar-button svelte-1liyo2f");
        add_location(div1, file$9, 117, 4, 3419);
        attr_dev(div2, "class", "sidebar svelte-1liyo2f");
        add_location(div2, file$9, 116, 2, 3393);
        attr_dev(div3, "id", "container");
        attr_dev(div3, "class", "svelte-1liyo2f");
        add_location(div3, file$9, 95, 0, 2793);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div3, anchor);
        append_dev(div3, div0);
        append_dev(div3, t0);
        mount_component(switchcontainer, div3, null);
        append_dev(div3, t1);
        append_dev(div3, div2);
        append_dev(div2, div1);
        append_dev(div1, h3);
        append_dev(div2, t3);
        if_blocks[current_block_type_index].m(div2, null);
        append_dev(div3, t4);
        mount_component(lobbymodal, div3, null);
        current = true;

        if (!mounted) {
          dispose = listen_dev(
            div1,
            "click",
            /*click_handler*/ ctx[15],
            false,
            false,
            false
          );
          mounted = true;
        }
      },
      p: function update(ctx, [dirty]) {
        const switchcontainer_changes = {};
        if (dirty & /*selected*/ 4)
          switchcontainer_changes.selected = /*selected*/ ctx[2];

        if (dirty & /*$$scope, selected, lobbyList, roomList*/ 1048604) {
          switchcontainer_changes.$$scope = { dirty, ctx };
        }

        switchcontainer.$set(switchcontainer_changes);
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type_1(ctx);

        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx, dirty);
        } else {
          group_outros();

          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });

          check_outros();
          if_block = if_blocks[current_block_type_index];

          if (!if_block) {
            if_block = if_blocks[current_block_type_index] =
              if_block_creators[current_block_type_index](ctx);
            if_block.c();
          } else {
            if_block.p(ctx, dirty);
          }

          transition_in(if_block, 1);
          if_block.m(div2, null);
        }

        const lobbymodal_changes = {};
        if (dirty & /*openCustomModal*/ 1)
          lobbymodal_changes.open = /*openCustomModal*/ ctx[0];
        lobbymodal.$set(lobbymodal_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(switchcontainer.$$.fragment, local);
        transition_in(if_block);
        transition_in(lobbymodal.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(switchcontainer.$$.fragment, local);
        transition_out(if_block);
        transition_out(lobbymodal.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div3);
        destroy_component(switchcontainer);
        if_blocks[current_block_type_index].d();
        destroy_component(lobbymodal);
        mounted = false;
        dispose();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$9.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$9($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("Home", slots, []);
    let { navigate = null } = $$props;
    let { socket = null } = $$props;
    let lobbyChannel = null;
    let openCustomModal = false;
    let withFriend = false;
    let friendLink = "";
    let selected = 0;
    let lobbyList = [];
    let roomList = [];

    onMount(async () => {
      await handleJoinLobby(null);
    });

    onDestroy(async () => {
      modeIndex.set(-1);
      await leaveLobby();
    });

    function handleSelect(e) {
      $$invalidate(2, (selected = e.detail));
    }

    async function handleJoinLobby(e) {
      if (lobbyChannel) await leaveLobby();
      const topic = `lobby:lobby`;

      if (e) {
        const color = ChessColor$1[e.detail.color];

        if (withFriend) {
          lobbyChannel = socket.channel(topic, {
            color,
            mode: e.detail.mode,
            priv: null,
          });
          withFriend = false;
        } else
          lobbyChannel = socket.channel(topic, { color, mode: e.detail.mode });
      } else {
        lobbyChannel = socket.channel(topic, {});
      }

      lobbyChannel.join().receive("ok", (resp) => {
        if (resp.link) $$invalidate(1, (friendLink = resp.link));
        else $$invalidate(1, (friendLink = ""));
      });

      lobbyChannel.on("room", (resp) => {
        navigate(`/chess/${resp.roomId}/${resp.id}`);
      });

      lobbyChannel.on("presence_state", (resp) => {
        $$invalidate(3, (lobbyList = []));
        $$invalidate(4, (roomList = []));

        Object.keys(resp.lobbies).forEach((mode) => {
          const lobbiesIt = resp.lobbies[mode].ids.map((id) => {
            return { mode, id: id.id, color: id.color };
          });

          $$invalidate(3, (lobbyList = [...lobbyList, ...lobbiesIt]));
        });

        $$invalidate(
          4,
          (roomList = resp.rooms.map((room) => ({
            mode: room.mode,
            id: room.roomId,
            color: "RANDOM",
          })))
        );
      });
    }

    async function leaveLobby(_e = null) {
      if (lobbyChannel)
        return new Promise((res, _rej) => {
          lobbyChannel.leave().receive("ok", () => {
            lobbyChannel = null;
            res();
          });
        });
    }

    function handleCustomModalClose() {
      $$invalidate(0, (openCustomModal = false));
      withFriend = false;
    }

    function handleModal(e) {
      modeIndex.set(11);
      $$invalidate(0, (openCustomModal = false));
      handleJoinLobby(e);
    }

    function handleCustomModalOpen(isWithFriend = false) {
      $$invalidate(0, (openCustomModal = true));
      withFriend = isWithFriend;
    }

    function joinRoom(e) {
      navigate(`/chess/${e.detail}/`);
    }

    const writable_props = ["navigate", "socket"];

    Object_1.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<Home> was created with unknown prop '${key}'`);
    });

    const openCustomModal_handler = () => handleCustomModalOpen();
    const leaveLobby_handler = () => handleJoinLobby(null);
    const click_handler = () => handleCustomModalOpen();
    const click_handler_1 = () => handleCustomModalOpen(true);

    $$self.$$set = ($$props) => {
      if ("navigate" in $$props)
        $$invalidate(11, (navigate = $$props.navigate));
      if ("socket" in $$props) $$invalidate(12, (socket = $$props.socket));
    };

    $$self.$capture_state = () => ({
      Pairing,
      SwitchContainer,
      ChessColor: ChessColor$1,
      Table,
      modeIndex,
      onDestroy,
      onMount,
      LobbyModal,
      ClipboxTextInput,
      navigate,
      socket,
      lobbyChannel,
      openCustomModal,
      withFriend,
      friendLink,
      selected,
      lobbyList,
      roomList,
      handleSelect,
      handleJoinLobby,
      leaveLobby,
      handleCustomModalClose,
      handleModal,
      handleCustomModalOpen,
      joinRoom,
    });

    $$self.$inject_state = ($$props) => {
      if ("navigate" in $$props)
        $$invalidate(11, (navigate = $$props.navigate));
      if ("socket" in $$props) $$invalidate(12, (socket = $$props.socket));
      if ("lobbyChannel" in $$props) lobbyChannel = $$props.lobbyChannel;
      if ("openCustomModal" in $$props)
        $$invalidate(0, (openCustomModal = $$props.openCustomModal));
      if ("withFriend" in $$props) withFriend = $$props.withFriend;
      if ("friendLink" in $$props)
        $$invalidate(1, (friendLink = $$props.friendLink));
      if ("selected" in $$props) $$invalidate(2, (selected = $$props.selected));
      if ("lobbyList" in $$props)
        $$invalidate(3, (lobbyList = $$props.lobbyList));
      if ("roomList" in $$props) $$invalidate(4, (roomList = $$props.roomList));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [
      openCustomModal,
      friendLink,
      selected,
      lobbyList,
      roomList,
      handleSelect,
      handleJoinLobby,
      handleCustomModalClose,
      handleModal,
      handleCustomModalOpen,
      joinRoom,
      navigate,
      socket,
      openCustomModal_handler,
      leaveLobby_handler,
      click_handler,
      click_handler_1,
    ];
  }

  class Home extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$9, create_fragment$9, safe_not_equal, {
        navigate: 11,
        socket: 12,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Home",
        options,
        id: create_fragment$9.name,
      });
    }

    get navigate() {
      throw new Error(
        "<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set navigate(value) {
      throw new Error(
        "<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get socket() {
      throw new Error(
        "<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set socket(value) {
      throw new Error(
        "<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  /* src/views/LobbyLinked.svelte generated by Svelte v3.50.1 */

  const { console: console_1$1 } = globals;
  const file$8 = "src/views/LobbyLinked.svelte";

  // (46:2) {#if !loading}
  function create_if_block$7(ctx) {
    let div;
    let h1;
    let t1;
    let h3;
    let mounted;
    let dispose;

    const block = {
      c: function create() {
        div = element("div");
        h1 = element("h1");
        h1.textContent = "404";
        t1 = space();
        h3 = element("h3");
        h3.textContent = "Room Not Found";
        attr_dev(h1, "class", "svelte-kpavn1");
        add_location(h1, file$8, 47, 6, 1102);
        attr_dev(h3, "class", "svelte-kpavn1");
        add_location(h3, file$8, 48, 6, 1152);
        attr_dev(div, "class", "svelte-kpavn1");
        add_location(div, file$8, 46, 4, 1090);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        append_dev(div, h1);
        append_dev(div, t1);
        append_dev(div, h3);

        if (!mounted) {
          dispose = listen_dev(
            h1,
            "click",
            /*click_handler*/ ctx[5],
            false,
            false,
            false
          );
          mounted = true;
        }
      },
      p: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        mounted = false;
        dispose();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$7.name,
      type: "if",
      source: "(46:2) {#if !loading}",
      ctx,
    });

    return block;
  }

  function create_fragment$8(ctx) {
    let div;
    let if_block = !(/*loading*/ ctx[0]) && create_if_block$7(ctx);

    const block = {
      c: function create() {
        div = element("div");
        if (if_block) if_block.c();
        attr_dev(div, "class", "svelte-kpavn1");
        add_location(div, file$8, 44, 0, 1063);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        if (if_block) if_block.m(div, null);
      },
      p: function update(ctx, [dirty]) {
        if (!(/*loading*/ ctx[0])) {
          if (if_block) {
            if_block.p(ctx, dirty);
          } else {
            if_block = create_if_block$7(ctx);
            if_block.c();
            if_block.m(div, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        if (if_block) if_block.d();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$8.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$8($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("LobbyLinked", slots, []);
    let { navigate = null } = $$props;
    let { socket = null } = $$props;
    let { params = null } = $$props;
    let lobbyChannel = null;
    let loading = true;

    onMount(async () => {
      await handleJoinLobby();

      setTimeout(() => {
        $$invalidate(0, (loading = false));
      }, 1500);
    });

    onDestroy(async () => {
      await leaveLobby();
    });

    async function handleJoinLobby() {
      if (lobbyChannel) await leaveLobby();
      const topic = `lobby:lobby`;
      console.log(params);

      lobbyChannel = socket.channel(topic, {
        color: null,
        mode: null,
        priv: params.lobbyId,
      });

      lobbyChannel.join();

      lobbyChannel.on("room", (resp) => {
        navigate(`/chess/${resp.roomId}/${resp.id}`);
      });
    }

    async function leaveLobby(_e = null) {
      if (lobbyChannel)
        return new Promise((res, _rej) => {
          lobbyChannel.leave().receive("ok", () => {
            lobbyChannel = null;
            res();
          });
        });
    }

    function handleClick() {
      navigate("/chess");
    }

    const writable_props = ["navigate", "socket", "params"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console_1$1.warn(
          `<LobbyLinked> was created with unknown prop '${key}'`
        );
    });

    const click_handler = () => handleClick();

    $$self.$$set = ($$props) => {
      if ("navigate" in $$props) $$invalidate(2, (navigate = $$props.navigate));
      if ("socket" in $$props) $$invalidate(3, (socket = $$props.socket));
      if ("params" in $$props) $$invalidate(4, (params = $$props.params));
    };

    $$self.$capture_state = () => ({
      onDestroy,
      onMount,
      navigate,
      socket,
      params,
      lobbyChannel,
      loading,
      handleJoinLobby,
      leaveLobby,
      handleClick,
    });

    $$self.$inject_state = ($$props) => {
      if ("navigate" in $$props) $$invalidate(2, (navigate = $$props.navigate));
      if ("socket" in $$props) $$invalidate(3, (socket = $$props.socket));
      if ("params" in $$props) $$invalidate(4, (params = $$props.params));
      if ("lobbyChannel" in $$props) lobbyChannel = $$props.lobbyChannel;
      if ("loading" in $$props) $$invalidate(0, (loading = $$props.loading));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [loading, handleClick, navigate, socket, params, click_handler];
  }

  class LobbyLinked extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$8, create_fragment$8, safe_not_equal, {
        navigate: 2,
        socket: 3,
        params: 4,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "LobbyLinked",
        options,
        id: create_fragment$8.name,
      });
    }

    get navigate() {
      throw new Error(
        "<LobbyLinked>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set navigate(value) {
      throw new Error(
        "<LobbyLinked>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get socket() {
      throw new Error(
        "<LobbyLinked>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set socket(value) {
      throw new Error(
        "<LobbyLinked>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get params() {
      throw new Error(
        "<LobbyLinked>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set params(value) {
      throw new Error(
        "<LobbyLinked>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  /* src/views/NotFound.svelte generated by Svelte v3.50.1 */

  const file$7 = "src/views/NotFound.svelte";

  function create_fragment$7(ctx) {
    let div1;
    let div0;
    let h1;
    let t1;
    let h3;
    let mounted;
    let dispose;

    const block = {
      c: function create() {
        div1 = element("div");
        div0 = element("div");
        h1 = element("h1");
        h1.textContent = "404";
        t1 = space();
        h3 = element("h3");
        h3.textContent = "Room Not Found";
        attr_dev(h1, "class", "svelte-1bt2ant");
        add_location(h1, file$7, 8, 4, 126);
        attr_dev(h3, "class", "svelte-1bt2ant");
        add_location(h3, file$7, 9, 4, 174);
        attr_dev(div0, "class", "svelte-1bt2ant");
        add_location(div0, file$7, 7, 2, 116);
        attr_dev(div1, "class", "svelte-1bt2ant");
        add_location(div1, file$7, 6, 0, 108);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div1, anchor);
        append_dev(div1, div0);
        append_dev(div0, h1);
        append_dev(div0, t1);
        append_dev(div0, h3);

        if (!mounted) {
          dispose = listen_dev(
            h1,
            "click",
            /*click_handler*/ ctx[2],
            false,
            false,
            false
          );
          mounted = true;
        }
      },
      p: noop,
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(div1);
        mounted = false;
        dispose();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$7.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$7($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("NotFound", slots, []);
    let { navigate = null } = $$props;

    function handleClick() {
      navigate("/chess");
    }

    const writable_props = ["navigate"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<NotFound> was created with unknown prop '${key}'`);
    });

    const click_handler = () => handleClick();

    $$self.$$set = ($$props) => {
      if ("navigate" in $$props) $$invalidate(1, (navigate = $$props.navigate));
    };

    $$self.$capture_state = () => ({ navigate, handleClick });

    $$self.$inject_state = ($$props) => {
      if ("navigate" in $$props) $$invalidate(1, (navigate = $$props.navigate));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [handleClick, navigate, click_handler];
  }

  class NotFound extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$7, create_fragment$7, safe_not_equal, {
        navigate: 1,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "NotFound",
        options,
        id: create_fragment$7.name,
      });
    }

    get navigate() {
      throw new Error(
        "<NotFound>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set navigate(value) {
      throw new Error(
        "<NotFound>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  var Finished;
  (function (Finished) {
    Finished[(Finished["MATE"] = 0)] = "MATE";
    Finished[(Finished["STALEMATE"] = 1)] = "STALEMATE";
    Finished[(Finished["NONE"] = 2)] = "NONE";
  })(Finished || (Finished = {}));
  var Finished$1 = Finished;

  var PlayerType;
  (function (PlayerType) {
    PlayerType[(PlayerType["WHITE"] = 0)] = "WHITE";
    PlayerType[(PlayerType["BLACK"] = 1)] = "BLACK";
    PlayerType[(PlayerType["SPECTATOR"] = 2)] = "SPECTATOR";
  })(PlayerType || (PlayerType = {}));
  var PlayerType$1 = PlayerType;

  class ChessPiece {
    constructor(row, column, color, moved) {
      this.column = column;
      this.row = row;
      this.color = color;
      this.moved = moved;
    }
    move(movePosition, board) {
      const boardCopy = [...board];
      if (
        this.validMoves(boardCopy).filter(
          (validMove) =>
            validMove.row === movePosition.row &&
            validMove.column === movePosition.column
        ).length > 0
      ) {
        boardCopy[this.row][this.column] = null;
        this.row = movePosition.row;
        this.column = movePosition.column;
        boardCopy[movePosition.row][movePosition.column] = this;
      }
      this.moved += 1;
      return boardCopy;
    }
    testMove(movePosition, board) {
      const boardCopy = [...board];
      boardCopy[this.row][this.column] = null;
      this.row = movePosition.row;
      this.column = movePosition.column;
      boardCopy[movePosition.row][movePosition.column] = this;
      return boardCopy;
    }
    toString() {
      return `${this.row}:${this.column} - ${this.color}`;
    }
  }

  var img$e =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAARpSURBVGiB7Zo/bFtVFMZ/x7EhUdN2cFSkDMSCdEnKgkSH0IAZACkgAgpL2yhCDGz8UZNgRYINhpQgQAgQIwNiARRRJJOJAVhAuEhtBUIijhpRZJyAGpw4jRMfhmcjU/XZ78XnvbhuPunIkt/1ud/ne8699517RVW5lRDZawJhY19wu2NfcLtjTwSLSEJEBkUk9P5D7VBEhkXkZyALXATyIvJcmBxQ1VAMuB8oAXoDS4XFQ8LaeIjIRWDQ5XEJSKjqlaB5hBLSItKLu1iAGPBgGFzCyuHbPbTpDJwFIQlW1Szwe4Nm34XBJcxZ+qU6z95T1V/DIBGm4C+Bj3Fm5Vr8CMyGxiKE5agTOAP8wY2XJAWKwDtAb+B8AhZ7J3C+jtDr7W/g4ZtSMHACyPkQW7Vt4PmbSjDwLHBtF2Jr7UOgo+UFA48A5SbFVu31lhYM9ABXGgmZnZ3VdDqtkUikkeAdYLiVBc97GblsNquqqn19fV5GeQk4bMXRbB0WkceAUY9t//fZAH3AK7smdh2iVo6A024PRISpqSkGB533h56eHgDm5uYoFAqsr68zMzPD2tqam4uTIvKyVsKoKRiFchfwDy5hGY/HdXt7W+thbGysUWifsOBqNcKPAt1uD1dXV0kmk/T39wPOyMbjcaanp1lZWSGfz5NOpxv18TTwbdNMjUb4DD6Wm6WlJVVVTSQSfpaoL1pp0rrNT+OtrS0AyuVyYH24wSqkY34ap1IpBgYGWF5eDqwPVxiF9DPY7Kzq2UetFNLncDb9QWLewomJYFVdBb628OWCIrBg4ciy4nEW56UhCLypqhsmnizyoiaXp7HP3XNAxIyjpeCK6LNAaWhoSHO5nG5ubvqyjY0NnZycrIr9Cjhkyc9yL11FCjja2dn5ZDwep6Ojw9ePVZVoNAqwCJxSVdcN9m5gftQiIi8CbwNEo9Eqec8ol8v/bUyAeVV9ypSgcTjfjTOjWubwaUuO1nXpUeyPTE5aOjPN4fHx8dGRkREiEbv/MZPJPCQiola5ZxjOsYWFhS01RrFY1O7u7geseFqOcGxiYiKWTCa9lm48IZPJUCgUDlj5M52lRSSPU7m0xjFVvWThyHrS+tzYH8AlwO5k0So3KpESAV6gTn3Lh5WBDzDeaQVyx0NEDgKP49ShhnHC3EtirwEXgM+AT1XVV4XAE7fdChZnZuoFjuBUI2rtQOX7OyqfvTiHa0dc3G3gFOiywJ8VywFXcS681NpV4LKqlnbF26tgETkOPAHcC9wFJPB2dyMI7OBcoVgEfgLeVdVFT7/0kJeHgE8IvoTTjJWAV6kMYF09DcR2Ad+0gCCvlgbizQh+vwVE+LXzzey0Cg2e+8VvwA/A9zhL133AceAYdvv6Qr29d8NJS0ROAW/gzLwXgF+AyzWWw1lyokBHxQRnYqnaNpBT1b9c+ujCOSWs9VH9A2p97AAHK22rdhS4BzgMvAW8pqrXXPUEsQ7vBby+UbWNYK/YvxHf7tgX3O645QT/Cym/GLJbVZClAAAAAElFTkSuQmCC";

  var img$d =
    "data:image/png;base64,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";

  class King extends ChessPiece {
    constructor(row, column, color, moved) {
      super(row, column, color, moved);
      this.image = color === ChessColor$1.WHITE ? img$h : img$i;
    }
    move(movePosition, board) {
      const boardCopy = [...board];
      if (
        this.validMoves(boardCopy).filter(
          (validMove) =>
            validMove.row === movePosition.row &&
            validMove.column === movePosition.column
        ).length > 0
      ) {
        if (
          this.moved === 0 &&
          this.color === ChessColor$1.WHITE &&
          (movePosition.column === this.column + 2 ||
            movePosition.column === this.column + 3)
        ) {
          boardCopy[this.row][this.column + 3].move(
            { row: this.row, column: this.column + 1 },
            board
          );
          movePosition = { row: this.row, column: this.column + 2 };
        } else if (
          this.moved === 0 &&
          this.color === ChessColor$1.WHITE &&
          (movePosition.column === this.column - 2 ||
            movePosition.column === this.column - 4)
        ) {
          boardCopy[this.row][this.column - 4].move(
            { row: this.row, column: this.column - 1 },
            board
          );
          movePosition = { row: this.row, column: this.column - 2 };
        } else if (
          this.moved === 0 &&
          this.color === ChessColor$1.BLACK &&
          (movePosition.column === this.column - 2 ||
            movePosition.column === this.column - 3)
        ) {
          boardCopy[this.row][this.column - 3].move(
            { row: this.row, column: this.column - 1 },
            board
          );
          movePosition = { row: this.row, column: this.column - 2 };
        } else if (
          this.moved === 0 &&
          this.color === ChessColor$1.BLACK &&
          (movePosition.column === this.column + 2 ||
            movePosition.column === this.column + 4)
        ) {
          boardCopy[this.row][this.column + 4].move(
            { row: this.row, column: this.column + 1 },
            board
          );
          movePosition = { row: this.row, column: this.column + 2 };
        }
        boardCopy[this.row][this.column] = null;
        this.row = movePosition.row;
        this.column = movePosition.column;
        boardCopy[movePosition.row][movePosition.column] = this;
      }
      this.moved += 1;
      return boardCopy;
    }
    protectMoves(board) {
      const res = [];
      const opposingColor =
        this.color === ChessColor$1.WHITE
          ? ChessColor$1.BLACK
          : ChessColor$1.WHITE;
      // Up
      if (
        this.row + 1 <= 7 &&
        (!board[this.row + 1][this.column] ||
          (board[this.row + 1][this.column] &&
            board[this.row + 1][this.column].color === opposingColor))
      )
        res.push({ row: this.row + 1, column: this.column });
      // Down
      if (
        this.row - 1 >= 0 &&
        (!board[this.row - 1][this.column] ||
          (board[this.row - 1][this.column] &&
            board[this.row - 1][this.column].color === opposingColor))
      )
        res.push({ row: this.row - 1, column: this.column });
      // Right
      if (
        this.column + 1 <= 7 &&
        (!board[this.row][this.column + 1] ||
          (board[this.row][this.column + 1] &&
            board[this.row][this.column + 1].color === opposingColor))
      )
        res.push({ row: this.row, column: this.column + 1 });
      // Left
      if (
        this.column - 1 >= 0 &&
        (!board[this.row][this.column - 1] ||
          (board[this.row][this.column - 1] &&
            board[this.row][this.column - 1].color === opposingColor))
      )
        res.push({ row: this.row, column: this.column - 1 });
      if (
        this.row + 1 <= 7 &&
        this.column + 1 <= 7 &&
        (!board[this.row + 1][this.column + 1] ||
          (board[this.row + 1][this.column + 1] &&
            board[this.row + 1][this.column + 1].color === opposingColor))
      )
        res.push({ row: this.row + 1, column: this.column + 1 });
      // Top-left
      if (
        this.row - 1 >= 0 &&
        this.column - 1 >= 0 &&
        (!board[this.row - 1][this.column - 1] ||
          (board[this.row - 1][this.column - 1] &&
            board[this.row - 1][this.column - 1].color === opposingColor))
      )
        res.push({ row: this.row - 1, column: this.column - 1 });
      // Bottom-left
      if (
        this.row - 1 >= 0 &&
        this.column + 1 <= 7 &&
        (!board[this.row - 1][this.column + 1] ||
          (board[this.row - 1][this.column + 1] &&
            board[this.row - 1][this.column + 1].color === opposingColor))
      )
        res.push({ row: this.row - 1, column: this.column + 1 });
      // Top-right
      if (
        this.row + 1 <= 7 &&
        this.column - 1 >= 0 &&
        (!board[this.row + 1][this.column - 1] ||
          (board[this.row + 1][this.column - 1] &&
            board[this.row + 1][this.column - 1].color === opposingColor))
      )
        res.push({ row: this.row + 1, column: this.column - 1 });
      return res;
    }
    validMoves(board) {
      const res = [];
      const opposingColor =
        this.color === ChessColor$1.WHITE
          ? ChessColor$1.BLACK
          : ChessColor$1.WHITE;
      // Up
      if (
        this.row + 1 <= 7 &&
        !ChessBoard.isProtected(
          { row: this.row + 1, column: this.column },
          board,
          opposingColor
        ) &&
        (!board[this.row + 1][this.column] ||
          (board[this.row + 1][this.column] &&
            board[this.row + 1][this.column].color === opposingColor))
      )
        res.push({ row: this.row + 1, column: this.column });
      // Down
      if (
        this.row - 1 >= 0 &&
        !ChessBoard.isProtected(
          { row: this.row - 1, column: this.column },
          board,
          opposingColor
        ) &&
        (!board[this.row - 1][this.column] ||
          (board[this.row - 1][this.column] &&
            board[this.row - 1][this.column].color === opposingColor))
      )
        res.push({ row: this.row - 1, column: this.column });
      // Right
      if (
        this.column + 1 <= 7 &&
        !ChessBoard.isProtected(
          { row: this.row, column: this.column + 1 },
          board,
          opposingColor
        ) &&
        (!board[this.row][this.column + 1] ||
          (board[this.row][this.column + 1] &&
            board[this.row][this.column + 1].color === opposingColor))
      )
        res.push({ row: this.row, column: this.column + 1 });
      // Left
      if (
        this.column - 1 >= 0 &&
        !ChessBoard.isProtected(
          { row: this.row, column: this.column - 1 },
          board,
          opposingColor
        ) &&
        (!board[this.row][this.column - 1] ||
          (board[this.row][this.column - 1] &&
            board[this.row][this.column - 1].color === opposingColor))
      )
        res.push({ row: this.row, column: this.column - 1 });
      if (
        this.row + 1 <= 7 &&
        this.column + 1 <= 7 &&
        !ChessBoard.isProtected(
          { row: this.row + 1, column: this.column + 1 },
          board,
          opposingColor
        ) &&
        (!board[this.row + 1][this.column + 1] ||
          (board[this.row + 1][this.column + 1] &&
            board[this.row + 1][this.column + 1].color === opposingColor))
      )
        res.push({ row: this.row + 1, column: this.column + 1 });
      // Top-left
      if (
        this.row - 1 >= 0 &&
        this.column - 1 >= 0 &&
        !ChessBoard.isProtected(
          { row: this.row - 1, column: this.column - 1 },
          board,
          opposingColor
        ) &&
        (!board[this.row - 1][this.column - 1] ||
          (board[this.row - 1][this.column - 1] &&
            board[this.row - 1][this.column - 1].color === opposingColor))
      )
        res.push({ row: this.row - 1, column: this.column - 1 });
      // Bottom-left
      if (
        this.row - 1 >= 0 &&
        this.column + 1 <= 7 &&
        !ChessBoard.isProtected(
          { row: this.row - 1, column: this.column + 1 },
          board,
          opposingColor
        ) &&
        (!board[this.row - 1][this.column + 1] ||
          (board[this.row - 1][this.column + 1] &&
            board[this.row - 1][this.column + 1].color === opposingColor))
      )
        res.push({ row: this.row - 1, column: this.column + 1 });
      // Top-right
      if (
        this.row + 1 <= 7 &&
        this.column - 1 >= 0 &&
        !ChessBoard.isProtected(
          { row: this.row + 1, column: this.column - 1 },
          board,
          opposingColor
        ) &&
        (!board[this.row + 1][this.column - 1] ||
          (board[this.row + 1][this.column - 1] &&
            board[this.row + 1][this.column - 1].color === opposingColor))
      )
        res.push({ row: this.row + 1, column: this.column - 1 });
      // Rokade right
      if (
        this.color === ChessColor$1.WHITE &&
        this.moved === 0 &&
        !board[this.row][this.column + 1] &&
        !board[this.row][this.column + 2] &&
        board[this.row][this.column + 3] &&
        board[this.row][this.column + 3].moved === 0 &&
        !ChessBoard.isProtected(
          { row: this.row, column: this.column + 1 },
          board,
          opposingColor
        ) &&
        !ChessBoard.isProtected(
          { row: this.row, column: this.column + 2 },
          board,
          opposingColor
        )
      ) {
        res.push({ row: this.row, column: this.column + 2 });
        res.push({ row: this.row, column: this.column + 3 });
      }
      if (
        this.color === ChessColor$1.BLACK &&
        this.moved === 0 &&
        !board[this.row][this.column + 1] &&
        !board[this.row][this.column + 2] &&
        !board[this.row][this.column + 3] &&
        board[this.row][this.column + 4] &&
        board[this.row][this.column + 4].moved === 0 &&
        !ChessBoard.isProtected(
          { row: this.row, column: this.column + 1 },
          board,
          opposingColor
        ) &&
        !ChessBoard.isProtected(
          { row: this.row, column: this.column + 2 },
          board,
          opposingColor
        ) &&
        !ChessBoard.isProtected(
          { row: this.row, column: this.column + 3 },
          board,
          opposingColor
        )
      ) {
        res.push({ row: this.row, column: this.column + 2 });
        res.push({ row: this.row, column: this.column + 4 });
      }
      //Rocade left
      if (
        this.color === ChessColor$1.WHITE &&
        this.moved === 0 &&
        !board[this.row][this.column - 1] &&
        !board[this.row][this.column - 2] &&
        !board[this.row][this.column - 3] &&
        board[this.row][this.column - 4] &&
        board[this.row][this.column - 4].moved === 0 &&
        !ChessBoard.isProtected(
          { row: this.row, column: this.column - 1 },
          board,
          opposingColor
        ) &&
        !ChessBoard.isProtected(
          { row: this.row, column: this.column - 2 },
          board,
          opposingColor
        ) &&
        !ChessBoard.isProtected(
          { row: this.row, column: this.column - 3 },
          board,
          opposingColor
        )
      ) {
        res.push({ row: this.row, column: this.column - 2 });
        res.push({ row: this.row, column: this.column - 4 });
      }
      if (
        this.color === ChessColor$1.BLACK &&
        this.moved === 0 &&
        !board[this.row][this.column - 1] &&
        !board[this.row][this.column - 2] &&
        board[this.row][this.column - 3] &&
        board[this.row][this.column - 3].moved === 0 &&
        !ChessBoard.isProtected(
          { row: this.row, column: this.column - 1 },
          board,
          opposingColor
        ) &&
        !ChessBoard.isProtected(
          { row: this.row, column: this.column - 2 },
          board,
          opposingColor
        )
      ) {
        res.push({ row: this.row, column: this.column - 2 });
        res.push({ row: this.row, column: this.column - 3 });
      }
      return res;
    }
    toSerialized() {
      return this.color === ChessColor$1.BLACK
        ? `bK${this.moved}`
        : `wK${this.moved}`;
    }
  }

  class Bishop extends ChessPiece {
    constructor(row, column, color, moved) {
      super(row, column, color, moved);
      this.image = color === ChessColor$1.WHITE ? img$d : img$e;
    }
    protectMoves(board) {
      return this.validMoves(board);
    }
    validMoves(board) {
      const res = [];
      const stopDir = [false, false, false, false];
      const opposingColor =
        this.color === ChessColor$1.WHITE
          ? ChessColor$1.BLACK
          : ChessColor$1.WHITE;
      for (let i = 1; i < 8; i++) {
        // Bottom-right
        if (
          !stopDir[0] &&
          this.row + i <= 7 &&
          this.column + i <= 7 &&
          (!board[this.row + i][this.column + i] ||
            (board[this.row + i][this.column + i] &&
              board[this.row + i][this.column + i].color === opposingColor))
        ) {
          res.push({ row: this.row + i, column: this.column + i });
          if (
            board[this.row + i][this.column + i] &&
            !(board[this.row + i][this.column + i] instanceof King)
          )
            stopDir[0] = true;
        } else stopDir[0] = true;
        // Top-left
        if (
          !stopDir[2] &&
          this.row - i >= 0 &&
          this.column - i >= 0 &&
          (!board[this.row - i][this.column - i] ||
            (board[this.row - i][this.column - i] &&
              board[this.row - i][this.column - i].color === opposingColor))
        ) {
          res.push({ row: this.row - i, column: this.column - i });
          if (
            board[this.row - i][this.column - i] &&
            !(board[this.row - i][this.column - i] instanceof King)
          )
            stopDir[2] = true;
        } else stopDir[2] = true;
        // Bottom-left
        if (
          !stopDir[1] &&
          this.row - i >= 0 &&
          this.column + i <= 7 &&
          (!board[this.row - i][this.column + i] ||
            (board[this.row - i][this.column + i] &&
              board[this.row - i][this.column + i].color === opposingColor))
        ) {
          res.push({ row: this.row - i, column: this.column + i });
          if (
            board[this.row - i][this.column + i] &&
            !(board[this.row - i][this.column + i] instanceof King)
          )
            stopDir[1] = true;
        } else stopDir[1] = true;
        // Top-right
        if (
          !stopDir[3] &&
          this.row + i <= 7 &&
          this.column - i >= 0 &&
          (!board[this.row + i][this.column - i] ||
            (board[this.row + i][this.column - i] &&
              board[this.row + i][this.column - i].color === opposingColor))
        ) {
          res.push({ row: this.row + i, column: this.column - i });
          if (
            board[this.row + i][this.column - i] &&
            !(board[this.row + i][this.column - i] instanceof King)
          )
            stopDir[3] = true;
        } else stopDir[3] = true;
      }
      return res;
    }
    toSerialized() {
      return this.color === ChessColor$1.BLACK
        ? `bB${this.moved}`
        : `wB${this.moved}`;
    }
  }

  var img$c =
    "data:image/png;base64,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";

  var img$b =
    "data:image/png;base64,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";

  class Knight extends ChessPiece {
    constructor(row, column, color, moved) {
      super(row, column, color, moved);
      this.image = color === ChessColor$1.WHITE ? img$b : img$c;
    }
    protectMoves(board) {
      return this.validMoves(board);
    }
    validMoves(board) {
      const res = [];
      const opposingColor =
        this.color === ChessColor$1.WHITE
          ? ChessColor$1.BLACK
          : ChessColor$1.WHITE;
      if (
        this.row + 1 <= 7 &&
        this.column + 2 <= 7 &&
        (!board[this.row + 1][this.column + 2] ||
          board[this.row + 1][this.column + 2].color === opposingColor)
      )
        res.push({ row: this.row + 1, column: this.column + 2 });
      if (
        this.row + 2 <= 7 &&
        this.column + 1 <= 7 &&
        (!board[this.row + 2][this.column + 1] ||
          board[this.row + 2][this.column + 1].color === opposingColor)
      )
        res.push({ row: this.row + 2, column: this.column + 1 });
      if (
        this.row + 2 <= 7 &&
        this.column - 1 >= 0 &&
        (!board[this.row + 2][this.column - 1] ||
          board[this.row + 2][this.column - 1].color === opposingColor)
      )
        res.push({ row: this.row + 2, column: this.column - 1 });
      if (
        this.row + 1 <= 7 &&
        this.column - 2 >= 0 &&
        (!board[this.row + 1][this.column - 2] ||
          board[this.row + 1][this.column - 2].color === opposingColor)
      )
        res.push({ row: this.row + 1, column: this.column - 2 });
      if (
        this.row - 1 >= 0 &&
        this.column - 2 >= 0 &&
        (!board[this.row - 1][this.column - 2] ||
          board[this.row - 1][this.column - 2].color === opposingColor)
      )
        res.push({ row: this.row - 1, column: this.column - 2 });
      if (
        this.row - 2 >= 0 &&
        this.column - 1 >= 0 &&
        (!board[this.row - 2][this.column - 1] ||
          board[this.row - 2][this.column - 1].color === opposingColor)
      )
        res.push({ row: this.row - 2, column: this.column - 1 });
      if (
        this.row - 2 >= 0 &&
        this.column + 1 <= 7 &&
        (!board[this.row - 2][this.column + 1] ||
          board[this.row - 2][this.column + 1].color === opposingColor)
      )
        res.push({ row: this.row - 2, column: this.column + 1 });
      if (
        this.row - 1 >= 0 &&
        this.column + 2 <= 7 &&
        (!board[this.row - 1][this.column + 2] ||
          board[this.row - 1][this.column + 2].color === opposingColor)
      )
        res.push({ row: this.row - 1, column: this.column + 2 });
      return res;
    }
    toSerialized() {
      return this.color === ChessColor$1.BLACK
        ? `bH${this.moved}`
        : `wH${this.moved}`;
    }
  }

  var img$a =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKaSURBVGiB7Zo9axVBFIafNyYoGhSNYFDUoI1CGtEgooIo/oGAhWApWlhoivgLgp32tlqJBEEsBMXGr0ILkYiVhRaCICL4gUXisbi5QaIkOzvnzL25975wujnvnIezOzs7uzIzukl9rS6gtHrAna4ecKerB9zp6jrg/lZMKmknMAbsAF4DL83sa5HJzaxYACPAA8AWxSxwBVgdXYNKbS0lHQbuA4NLDJsBDpnZ96g6itzDkgaBGywNCzAKXI2spdSiNQnsqjj2nKR9UYWUAj4SPL6ySgGndmzFd/hn8PjKKgX8Jnh8ZZUCvpMw9jdwN6qQcGBJJ4GphJQ+YFrSlpB6IjcekvYAL1j++fs/PQaOm9msZ01hHZY0AExTDxbgKI3tpqvCOizpDHAz0+YXsN3MPjuUBMTewxcdPNYA5x18FhQCLGkDcMDJ7oSTDxDX4ar75ira7egVBrzN0WtYkrzMooDfOnrNmOPKGgJsZu+AT052z518gNhV+qmTzzMnHyAW+JGDxxzwxMFnQZHA12lsD3N02cw+eBSzoOBTymHgI/+eUlaJmxE1Re6l1wIXgE01LY5JOuVYUkNBnd0LvKdeZxfHPRzPqyNgtzrCNuMW8y86bQUMrAdeOcM241pbAQMDwMMg2GZMtBPwVDCs0TjvGms5MI1TjS8FgA24nVOr12PpLLDRyWs5jUuq/cqYDSypH7iU65OgPmCidrbD5XyaMpfy3/EDGGrVJT3p4JGq5i4uWVnAkkYI/PC1jMbrJOV2+GBmfo5GJa1LTVrJwKuA/alJucCjmfm5Sp4/F3goMz9XyfP3gBO1OTM/V8nz1wae/zqYvEo6K3k7m/Pr4RytewY39S01odifeO2irvubtgfc6eoBd7q6DvgP/gH4mMhDFawAAAAASUVORK5CYII=";

  var img$9 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAASLSURBVGiB7ZrLS2NnGIefL6YJEuM4GaOiUvDCgJIKI0Y7KFJ3BSm00j9gil1ULbRi+1cUV92U7gahSLvUzeAiVG3QCoOggxmvgRlRY2uKSLSivl3oV2JJgyfnYrw8EDgh3+X35P3ycc7JUSLCXcJ13QGc5l74tnMvfNu5F77t3Dlh93VMqpQKAmGgEVgGfheRbUcmFxHHXkAx8CMgGV4/AaV2Z1BOnVoqpaqAKPCux+Ohra2NUChELBZjZmaGw8NDgF2gXURWbAviYHVfANLS0iJLS0uSTjwel87OTl3pKFBgWw6HZD8BJBAIyNbWlmQimUxKZWWllv7MrixO7dIdAAMDA1RUVGRsUFJSwtDQ0KX2duCU8BOAcDictVHa50/sCuKUcArg5OQka6PT01N9eGRXEKeEXwFMTExkbRSJRPRhzLYkDm1a7wPi8XgkHo9n3LR2d3fF7/frTevDG7tpKaUeA88BPB4P8Xg8Y7u3b9/idv974veDUsqe37HNlS0GXgMSCoUkFotlrK5mY2NDwuGwrvImUGZ5JpuFfwakqalJDg4Osspqjo6OpKOjQ0tP3Bhhzi8MpKioSNbW1q4kq0kkElJaWqqlO6zMZedv+EuA3t5eamtrDXUMBoP09/frt19ZmsrGCq8DMj8/b6i6ms3NTV3hPStz2XK1pJRyA0cul6sglUrh9XpzGicQCJBMJgECIpK0IptdS7oMKCgpKclZFs6FL6iyIhRg65L+A5CNjY2clvTe3p4opQQ4BgqtymXnpjUDMD09nVPnaDSqv7iXInJoVSg7haMAk5OTOXWemprSh79ZlOccG5d0OyBer1dmZ2cNLedYLCbFxcV6l/7I0lx2CV9Ifw9IdXW17OzsXEl2f39fGhoatOwvlmeyWdgNRADp7OyU4+PjrLJnZ2fS09OjZReBohsjzPn+8AXwJyBut1vGxsayCkejUfF6vVr4L+BrwJ33wsBDYPYiuHR1dcni4mJWWc3q6qp0d3en369eACryVhjwAr8CUlVVJaOjo1cS/S/j4+NSV1enpV8C/rwTBhQwqjeqN2/e5CSrSSQSUl9fr6VfAO/km/B3gDx48EAWFhZMyWpWV1elrKxMSz/PG2Ggh4v7VpFIxBJZzdzcnPh8Pi39eb4IzwEyPDxsqaxmZGREC78GXNcqDHzAxV8pV72VY5STkxOpqanR0h/nmtWqc+lv4PyvFJ/PZ9GQlykoKGBwcPDSfDlhQXUbgbPCwkJJJBK2VFdzcHAggUBAV/npdVV4CFDPnj0jGAxaMNz/4/P56Ovr02+/zWkQCyq8A8jy8rKt1dVsb2+Ly+US4G/AazivSdk6QCorKx2R1TQ2Nupl3WY0s9kl/RSgtbXV5DDGSJuvzWhfs8LvATQ3N5scxhhp84WM9jUrXApQXl5uchhjpM33yGhfs8KP4NLtVEdIm8+wsKkb8UqpaaC9trYWv9+f8zhGSaVSrKysALwSEUPL2uyTeA8B1tfXTQ5jbn4jmBX+lPML/usi+0MjGXDsSbx84c49TXsvfNu5F77t3DnhfwDnGIncxPZT9AAAAABJRU5ErkJggg==";

  class Pawn extends ChessPiece {
    constructor(row, column, color, moved) {
      super(row, column, color, moved);
      this.image = color === ChessColor$1.WHITE ? img$9 : img$a;
    }
    move(movePosition, board) {
      const boardCopy = [...board];
      if (
        this.validMoves(boardCopy).filter(
          (validMove) =>
            validMove.row === movePosition.row &&
            validMove.column === movePosition.column
        ).length > 0
      ) {
        if (
          movePosition.column === this.column + 1 &&
          movePosition.row === this.row + 1 &&
          !board[this.row + 1][this.column + 1]
        ) {
          board[this.row][this.column + 1] = null;
        }
        if (
          movePosition.column === this.column - 1 &&
          movePosition.row === this.row + 1 &&
          !board[this.row + 1][this.column - 1]
        ) {
          board[this.row][this.column - 1] = null;
        }
        if (
          movePosition.column === this.column + 1 &&
          movePosition.row === this.row - 1 &&
          !board[this.row - 1][this.column + 1]
        ) {
          board[this.row][this.column + 1] = null;
        }
        if (
          movePosition.column === this.column - 1 &&
          movePosition.row === this.row - 1 &&
          !board[this.row - 1][this.column - 1]
        ) {
          board[this.row][this.column - 1] = null;
        }
        boardCopy[this.row][this.column] = null;
        this.row = movePosition.row;
        this.column = movePosition.column;
        boardCopy[movePosition.row][movePosition.column] = this;
      }
      this.moved += 1;
      return boardCopy;
    }
    validMoves(board) {
      const res = [];
      const opposingColor =
        this.color === ChessColor$1.WHITE
          ? ChessColor$1.BLACK
          : ChessColor$1.WHITE;
      // Row above
      if (!board[this.row - 1][this.column])
        res.push({ row: this.row - 1, column: this.column });
      // Row two above if the piece is at start
      if (
        !board[this.row - 2][this.column] &&
        !board[this.row - 1][this.column] &&
        this.row === 6
      )
        res.push({ row: this.row - 2, column: this.column });
      // Take opposing color piece on the left
      if (
        board[this.row - 1][this.column - 1] &&
        board[this.row - 1][this.column - 1].color === opposingColor
      )
        res.push({ row: this.row - 1, column: this.column - 1 });
      if (
        board[this.row - 1][this.column + 1] &&
        board[this.row - 1][this.column + 1].color === opposingColor
      )
        res.push({ row: this.row - 1, column: this.column + 1 });
      if (
        board[this.row][this.column + 1] &&
        board[this.row][this.column + 1].color === opposingColor &&
        board[this.row][this.column + 1] instanceof Pawn &&
        this.row === 3 &&
        board[this.row][this.column + 1].moved === 1
      )
        res.push({ row: this.row - 1, column: this.column + 1 });
      if (
        board[this.row][this.column - 1] &&
        board[this.row][this.column - 1].color === opposingColor &&
        board[this.row][this.column - 1] instanceof Pawn &&
        this.row === 3 &&
        board[this.row][this.column - 1].moved === 1
      )
        res.push({ row: this.row - 1, column: this.column - 1 });
      return res;
    }
    protectMoves() {
      return [
        { row: this.row - 1, column: this.column - 1 },
        { row: this.row - 1, column: this.column + 1 },
      ];
    }
    toSerialized() {
      return this.color === ChessColor$1.BLACK
        ? `bP${this.moved}`
        : `wP${this.moved}`;
    }
  }

  var img$8 =
    "data:image/png;base64,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";

  var img$7 =
    "data:image/png;base64,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";

  class Queen extends ChessPiece {
    constructor(row, column, color, moved) {
      super(row, column, color, moved);
      this.image = color === ChessColor$1.WHITE ? img$7 : img$8;
    }
    protectMoves(board) {
      return this.validMoves(board);
    }
    validMoves(board) {
      const res = [];
      const stopDir = Array(8).fill(false);
      const opposingColor =
        this.color === ChessColor$1.WHITE
          ? ChessColor$1.BLACK
          : ChessColor$1.WHITE;
      for (let i = 1; i < 8; i++) {
        // Up
        if (
          !stopDir[0] &&
          this.row + i <= 7 &&
          (!board[this.row + i][this.column] ||
            (board[this.row + i][this.column] &&
              board[this.row + i][this.column].color === opposingColor))
        ) {
          res.push({ row: this.row + i, column: this.column });
          if (
            board[this.row + i][this.column] &&
            !(board[this.row + i][this.column] instanceof King)
          )
            stopDir[0] = true;
        } else stopDir[0] = true;
        // Down
        if (
          !stopDir[2] &&
          this.row - i >= 0 &&
          (!board[this.row - i][this.column] ||
            (board[this.row - i][this.column] &&
              board[this.row - i][this.column].color === opposingColor))
        ) {
          res.push({ row: this.row - i, column: this.column });
          if (
            board[this.row - i][this.column] &&
            !(board[this.row - i][this.column] instanceof King)
          )
            stopDir[2] = true;
        } else stopDir[2] = true;
        // Right
        if (
          !stopDir[1] &&
          this.column + i <= 7 &&
          (!board[this.row][this.column + i] ||
            (board[this.row][this.column + i] &&
              board[this.row][this.column + i].color === opposingColor))
        ) {
          res.push({ row: this.row, column: this.column + i });
          if (
            board[this.row][this.column + i] &&
            !(board[this.row][this.column + i] instanceof King)
          )
            stopDir[1] = true;
        } else stopDir[1] = true;
        // Left
        if (
          !stopDir[3] &&
          this.column - i >= 0 &&
          (!board[this.row][this.column - i] ||
            (board[this.row][this.column - i] &&
              board[this.row][this.column - i].color === opposingColor))
        ) {
          res.push({ row: this.row, column: this.column - i });
          if (
            board[this.row][this.column - i] &&
            !(board[this.row][this.column - i] instanceof King)
          )
            stopDir[3] = true;
        } else stopDir[3] = true;
        if (
          !stopDir[4] &&
          this.row + i <= 7 &&
          this.column + i <= 7 &&
          (!board[this.row + i][this.column + i] ||
            (board[this.row + i][this.column + i] &&
              board[this.row + i][this.column + i].color === opposingColor))
        ) {
          res.push({ row: this.row + i, column: this.column + i });
          if (
            board[this.row + i][this.column + i] &&
            !(board[this.row + i][this.column + i] instanceof King)
          )
            stopDir[4] = true;
        } else stopDir[4] = true;
        // Top-left
        if (
          !stopDir[5] &&
          this.row - i >= 0 &&
          this.column - i >= 0 &&
          (!board[this.row - i][this.column - i] ||
            (board[this.row - i][this.column - i] &&
              board[this.row - i][this.column - i].color === opposingColor))
        ) {
          res.push({ row: this.row - i, column: this.column - i });
          if (
            board[this.row - i][this.column - i] &&
            !(board[this.row - i][this.column - i] instanceof King)
          )
            stopDir[5] = true;
        } else stopDir[5] = true;
        // Bottom-left
        if (
          !stopDir[6] &&
          this.row - i >= 0 &&
          this.column + i <= 7 &&
          (!board[this.row - i][this.column + i] ||
            (board[this.row - i][this.column + i] &&
              board[this.row - i][this.column + i].color === opposingColor))
        ) {
          res.push({ row: this.row - i, column: this.column + i });
          if (
            board[this.row - i][this.column + i] &&
            !(board[this.row - i][this.column + i] instanceof King)
          )
            stopDir[6] = true;
        } else stopDir[6] = true;
        // Top-right
        if (
          !stopDir[7] &&
          this.row + i <= 7 &&
          this.column - i >= 0 &&
          (!board[this.row + i][this.column - i] ||
            (board[this.row + i][this.column - i] &&
              board[this.row + i][this.column - i].color === opposingColor))
        ) {
          res.push({ row: this.row + i, column: this.column - i });
          if (
            board[this.row + i][this.column - i] &&
            !(board[this.row + i][this.column - i] instanceof King)
          )
            stopDir[7] = true;
        } else stopDir[7] = true;
      }
      return res;
    }
    toSerialized() {
      return this.color === ChessColor$1.BLACK
        ? `bQ${this.moved}`
        : `wQ${this.moved}`;
    }
  }

  var img$6 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAJSSURBVGiB7ZqxixNBFMa/b/HOFBGbSDRgoRCQK01IndrG1j/BI0QQ7JLG2sIg5AQ7QbCystByIYVFKq1sUh0kmyKolWE37rPwxDOG252ZzcabnR+8YsObt+/bmXkzO1mKCIqEt+sE8sYJth0n2HacYNtxgm1HWzDJEsn3JGWDHZGkgr+Q/ETyyob7HJKM0/onIiJaBqANQM6wq4r+AuD+hvsEKv5JdkH5CaXnLslvp64PUrRpkry39lspw5y22sN5mHIPu6JlO+ddMJNd/sZE8CXf97VrgKnN53N4nnddNWnqnniQ3G+1Wp9rtdoNrQCGLBaLr6PR6KaIfFFqaPKUAewBeIH8q/M7AJd1ctbu4dOQfADgab/f95rNpnG8TUynU3Q6HYjIAMAjEfmhEyeTjYeIPCO5H0XRk+VymUXIfwjDECLySkQeGgXKqoggn42I8kbDbTx2nUDeOMG24wTbjhNsO06w7TjBtuME206WB/EXG40G6vV6hiH/EAQBfN8vGwfK8H34te/7si1ms5mQ/GicZ0ZibwEIkc951h2TXI2HNMlSpVJ5MxgM9spl8xF3FnEco9frvSR5W0SOdWJkMYffrlargzAMsa3zrN9EUYQwDCsAPpCsi8h31RjGp5YkAwBVoyB6XBORQLVR4Zalwgk2nsPVatVrt9tY+8Jhq4zHY0wmE73GGkvQIYAYJ8tEt9s1X2QVGQ6H60vVEU7qUZIpF60dFqkkUhWxws1hJ9h2dAQ/xq9C8T/xHMA8jWMm/w+fJ9yQth0n2HacYNspnOCf287BmtabMhEAAAAASUVORK5CYII=";

  var img$5 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAMiSURBVGiB7ZqxTxNRHMc/P2jC2dDCYmhtB8cuJgQaWQwFRx1kdHAQHCr/ghOyMLAQBnRhI4Q4MTBoTEzYJDQhONIOGG3aktCQGHFo6HOAMyBX2nv3oHq9T/JLmrv3fvf73nv37t7vV1FK0Ul0tTuAmyYQ7HcCwX4nEOx3AsF+R1uwiFgi8l5ElIMtiYi4aK9E5IuI3Ha4zrSI1Ftt3xSllJYBY4C6wmIu2yvgpcN1ym7aNzPPUzqTyVxwODAwYJ96IiJPbQMeOrVXSpHNZu0+6fN9zvpZAKVSyam9a0LaPRvQ399PpVIBeNvo/BXHXpzZBXp6erAsy0h8xgWvr68zOztLvV6/dM6yLObn5y8dn5mZ4fj4mIODA0efU1NTjjdKB+OCU6kUq6urrvpYlsXi4qLpUBzxLLhcLrO2tmYilpbZ29vT7+xhlX5G81X3um3Zbdyim/EQkTCQB+6Ew2HGx8fp7e3V8tUqtVqNzc1NDg8PAX4AQ0qpgisnuiN8dqP6gM+ASiaTKp/Pq+vi6OhIjYyM2CO7D9zViVl7hG1EpA/4AIwkk0nm5uYIhYyvhSwsLLC1tQXwFRhTSu3r+PEsGP6I/hSNRoeGh4fPf3wYoVqtsru7S6VSKQIPdMUC3qb0X9P7MaAymYzx6ZzNZu2p/MprnCZ3Sz8N+mpE1auDYHvodwLBficQ7HcCwX4nEOx3AsF+p+MEm9yp9wDs7OwwMTFh0C3kcjn7Z8SrL5OCnwOk02kmJycNuoVIJMLKygqcJg4vJ7bdYGjznwJqXV1dant723gCoFQqqWg0aicBHnmJ1fMIi4gFvANCg4ODFAoFCgV3icRWGB0dZWNjA2BZRO4rpb5pOTIwuh+54Xy0iHwHbrVlhIF7AIlEgu7ubgPurqZYLHJycpLgNEX8y21/Y4tWLpcjFouZcteQWCxmVye16Lj3cMcJ1lmkpoE67S+knbclzooKzcx15UFEyoDZ0oIZ4kqpcrNG2lP6/H8u2mluyzod9wxrv5bi8bjJOG4MnRF+zelC8S/xBmjp5WykXPo/0XHPcCDY7wSC/U4g2O/8BtFWHbaczITCAAAAAElFTkSuQmCC";

  class Rook extends ChessPiece {
    constructor(row, column, color, moved) {
      super(row, column, color, moved);
      this.image = color === ChessColor$1.WHITE ? img$5 : img$6;
    }
    protectMoves(board) {
      return this.validMoves(board);
    }
    validMoves(board) {
      const res = [];
      const stopDir = [false, false, false, false];
      const opposingColor =
        this.color === ChessColor$1.WHITE
          ? ChessColor$1.BLACK
          : ChessColor$1.WHITE;
      for (let i = 1; i < 8; i++) {
        // Up
        if (
          !stopDir[0] &&
          this.row + i <= 7 &&
          (!board[this.row + i][this.column] ||
            (board[this.row + i][this.column] &&
              board[this.row + i][this.column].color === opposingColor))
        ) {
          res.push({ row: this.row + i, column: this.column });
          if (
            board[this.row + i][this.column] &&
            !(board[this.row + i][this.column] instanceof King)
          )
            stopDir[0] = true;
        } else stopDir[0] = true;
        // Down
        if (
          !stopDir[2] &&
          this.row - i >= 0 &&
          (!board[this.row - i][this.column] ||
            (board[this.row - i][this.column] &&
              board[this.row - i][this.column].color === opposingColor))
        ) {
          res.push({ row: this.row - i, column: this.column });
          if (
            board[this.row - i][this.column] &&
            !(board[this.row - i][this.column] instanceof King)
          )
            stopDir[2] = true;
        } else stopDir[2] = true;
        // Right
        if (
          !stopDir[1] &&
          this.column + i <= 7 &&
          (!board[this.row][this.column + i] ||
            (board[this.row][this.column + i] &&
              board[this.row][this.column + i].color === opposingColor))
        ) {
          res.push({ row: this.row, column: this.column + i });
          if (
            board[this.row][this.column + i] &&
            !(board[this.row][this.column + i] instanceof King)
          )
            stopDir[1] = true;
        } else stopDir[1] = true;
        // Left
        if (
          !stopDir[3] &&
          this.column - i >= 0 &&
          (!board[this.row][this.column - i] ||
            (board[this.row][this.column - i] &&
              board[this.row][this.column - i].color === opposingColor))
        ) {
          res.push({ row: this.row, column: this.column - i });
          if (
            board[this.row][this.column - i] &&
            !(board[this.row][this.column - i] instanceof King)
          )
            stopDir[3] = true;
        } else stopDir[3] = true;
      }
      return res;
    }
    toSerialized() {
      return this.color === ChessColor$1.BLACK
        ? `bR${this.moved}`
        : `wR${this.moved}`;
    }
  }

  class ChessBoard {
    static isFinished(turn, board) {
      let validMoves = [];
      if (this.isChecked(turn, board)) {
        for (let i = 0; i < board.length; i++) {
          for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] && board[i][j].color === turn) {
              validMoves = [
                ...validMoves,
                ...ChessBoard.filterValidMovesChecked(board[i][j], board),
              ];
            }
          }
        }
        if (validMoves.length === 0) return Finished$1.MATE;
      } else {
        for (let i = 0; i < board.length; i++) {
          for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] && board[i][j].color === turn) {
              validMoves = [...validMoves, ...board[i][j].validMoves(board)];
            }
          }
        }
        if (validMoves.length === 0) return Finished$1.STALEMATE;
      }
      return Finished$1.NONE;
    }
    static isChecked(turn, board) {
      let king = null;
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (
            board[i][j] &&
            board[i][j].color === turn &&
            board[i][j] instanceof King
          ) {
            king = board[i][j];
            break;
          }
        }
      }
      if (king === null) throw Error("King is missing");
      const opposingColor =
        turn === ChessColor$1.WHITE ? ChessColor$1.BLACK : ChessColor$1.WHITE;
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (
            board[i][j] &&
            board[i][j].color === opposingColor &&
            !(board[i][j] instanceof King) &&
            board[i][j]
              .protectMoves(board)
              .filter(
                (validMove) =>
                  validMove.row === king.row && validMove.column === king.column
              ).length > 0
          )
            return true;
        }
      }
      return false;
    }
    static filterValidMovesChecked(piece, board) {
      let king = null;
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (
            board[i][j] &&
            board[i][j].color === piece.color &&
            board[i][j] instanceof King
          ) {
            king = board[i][j];
            break;
          }
        }
      }
      if (king === null) throw Error("King is missing");
      const validMoves = piece.validMoves(board);
      const initialPosition = {
        row: piece.row,
        column: piece.column,
      };
      const opposingColor =
        piece.color === ChessColor$1.WHITE
          ? ChessColor$1.BLACK
          : ChessColor$1.WHITE;
      return validMoves.filter((validMove) => {
        const temp = board[validMove.row][validMove.column];
        board = piece.testMove(validMove, board);
        for (let i = 0; i < board.length; i++) {
          for (let j = 0; j < board[i].length; j++) {
            if (
              board[i][j] &&
              board[i][j].color === opposingColor &&
              !(board[i][j] instanceof King) &&
              board[i][j]
                .protectMoves(board)
                .filter(
                  (validMove) =>
                    validMove.row === king.row &&
                    validMove.column === king.column
                ).length > 0
            ) {
              board = piece.testMove(initialPosition, board);
              if (temp) board[validMove.row][validMove.column] = temp;
              return false;
            }
          }
        }
        board = piece.testMove(initialPosition, board);
        if (temp) board[validMove.row][validMove.column] = temp;
        return true;
      });
    }
    static isProtected(position, chessBoard, opposingColor) {
      const boardCopy = [...chessBoard];
      const chessPiece = chessBoard[position.row][position.column];
      if (chessPiece) {
        if (chessPiece.color !== opposingColor) return false;
        chessPiece.color =
          chessPiece.color === ChessColor$1.WHITE
            ? ChessColor$1.BLACK
            : ChessColor$1.WHITE;
        //TODO: Check if it works without
        boardCopy[position.row][position.column] = chessPiece;
      }
      for (let i = 0; i < boardCopy.length; i++) {
        for (let j = 0; j < boardCopy[i].length; j++) {
          if (
            boardCopy[i][j] &&
            boardCopy[i][j].color === opposingColor &&
            boardCopy[i][j]
              .protectMoves(boardCopy)
              .filter(
                (validMove) =>
                  validMove.row === position.row &&
                  validMove.column === position.column
              ).length > 0
          ) {
            if (chessPiece)
              chessPiece.color =
                chessPiece.color === ChessColor$1.WHITE
                  ? ChessColor$1.BLACK
                  : ChessColor$1.WHITE;
            return true;
          }
        }
      }
      if (chessPiece)
        chessPiece.color =
          chessPiece.color === ChessColor$1.WHITE
            ? ChessColor$1.BLACK
            : ChessColor$1.WHITE;
      return false;
    }
    static serializeBoard(chessBoard, playerType) {
      const board = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      for (let row = 0; row < chessBoard.length; row++) {
        for (let col = 0; col < chessBoard[row].length; col++) {
          const boardCol = playerType === PlayerType$1.BLACK ? 7 - col : col;
          board[row][boardCol] = this.serializePiece(chessBoard[row][col]);
        }
      }
      return playerType === PlayerType$1.BLACK ? board : board.reverse();
    }
    static deserializeBoard(stringBoard, playerType) {
      const board = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      for (let row = 0; row < stringBoard.length; row++) {
        for (let col = 0; col < stringBoard[row].length; col++) {
          const boardRow = playerType === PlayerType$1.BLACK ? row : 7 - row;
          const boardCol = playerType === PlayerType$1.BLACK ? 7 - col : col;
          board[boardRow][boardCol] = this.deserializePiece(
            stringBoard[row][col],
            boardRow,
            boardCol
          );
        }
      }
      return board;
    }
    static deserializePiece(piece, row, column) {
      if (piece === null) return null;
      const color = piece[0] === "w" ? ChessColor$1.WHITE : ChessColor$1.BLACK;
      const pieceType = piece[1];
      const moved = parseInt(piece.substring(2));
      switch (pieceType) {
        case "B":
          return new Bishop(row, column, color, moved);
        case "K":
          return new King(row, column, color, moved);
        case "H":
          return new Knight(row, column, color, moved);
        case "P":
          return new Pawn(row, column, color, moved);
        case "Q":
          return new Queen(row, column, color, moved);
        case "R":
          return new Rook(row, column, color, moved);
        default:
          throw new Error(`Could not deserialize piece: ${piece}`);
      }
    }
    static serializePiece(piece) {
      if (piece === null) return null;
      return piece.toSerialized();
    }
  }

  /* src/components/Piece.svelte generated by Svelte v3.50.1 */
  const file$6 = "src/components/Piece.svelte";

  // (75:2) {:else}
  function create_else_block$3(ctx) {
    let img;
    let img_src_value;

    const block = {
      c: function create() {
        img = element("img");
        attr_dev(img, "class", "invisible svelte-1yd518t");
        if (!src_url_equal(img.src, (img_src_value = img$g)))
          attr_dev(img, "src", img_src_value);
        attr_dev(img, "alt", "blank");
        add_location(img, file$6, 75, 4, 2003);
      },
      m: function mount(target, anchor) {
        insert_dev(target, img, anchor);
      },
      p: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(img);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_else_block$3.name,
      type: "else",
      source: "(75:2) {:else}",
      ctx,
    });

    return block;
  }

  // (61:2) {#if piece}
  function create_if_block_1$4(ctx) {
    let img;
    let img_src_value;
    let mounted;
    let dispose;

    const block = {
      c: function create() {
        img = element("img");
        if (!src_url_equal(img.src, (img_src_value = /*piece*/ ctx[0].image)))
          attr_dev(img, "src", img_src_value);
        attr_dev(img, "alt", "piece icon");
        attr_dev(img, "class", "svelte-1yd518t");
        toggle_class(img, "checked", /*isChecked*/ ctx[2]);
        add_location(img, file$6, 61, 4, 1639);
      },
      m: function mount(target, anchor) {
        insert_dev(target, img, anchor);

        if (!mounted) {
          dispose = [
            listen_dev(
              img,
              "dragstart",
              /*dragstart_handler*/ ctx[13],
              false,
              false,
              false
            ),
            listen_dev(
              img,
              "dragend",
              /*handleDragEnd*/ ctx[7],
              false,
              false,
              false
            ),
            listen_dev(
              img,
              "dragenter",
              /*handleDragEnter*/ ctx[8],
              false,
              false,
              false
            ),
            listen_dev(
              img,
              "dragleave",
              /*handleDragLeave*/ ctx[9],
              false,
              false,
              false
            ),
            listen_dev(
              img,
              "drop",
              /*handleDragDrop*/ ctx[10],
              false,
              false,
              false
            ),
            listen_dev(img, "dragover", dragover_handler, false, false, false),
          ];

          mounted = true;
        }
      },
      p: function update(ctx, dirty) {
        if (
          dirty & /*piece*/ 1 &&
          !src_url_equal(img.src, (img_src_value = /*piece*/ ctx[0].image))
        ) {
          attr_dev(img, "src", img_src_value);
        }

        if (dirty & /*isChecked*/ 4) {
          toggle_class(img, "checked", /*isChecked*/ ctx[2]);
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(img);
        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_1$4.name,
      type: "if",
      source: "(61:2) {#if piece}",
      ctx,
    });

    return block;
  }

  // (78:2) {#if validMove && !pieceDragedEntered}
  function create_if_block$6(ctx) {
    let div;

    const block = {
      c: function create() {
        div = element("div");
        attr_dev(div, "id", "green-dot");
        attr_dev(div, "class", "svelte-1yd518t");
        add_location(div, file$6, 78, 4, 2110);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$6.name,
      type: "if",
      source: "(78:2) {#if validMove && !pieceDragedEntered}",
      ctx,
    });

    return block;
  }

  function create_fragment$6(ctx) {
    let div;
    let t;
    let div_class_value;
    let mounted;
    let dispose;

    function select_block_type(ctx, dirty) {
      if (/*piece*/ ctx[0]) return create_if_block_1$4;
      return create_else_block$3;
    }

    let current_block_type = select_block_type(ctx);
    let if_block0 = current_block_type(ctx);
    let if_block1 =
      /*validMove*/ ctx[1] &&
      !(/*pieceDragedEntered*/ ctx[3]) &&
      create_if_block$6(ctx);

    const block = {
      c: function create() {
        div = element("div");
        if_block0.c();
        t = space();
        if (if_block1) if_block1.c();
        attr_dev(div, "id", "container");

        attr_dev(
          div,
          "class",
          (div_class_value =
            "" +
            (null_to_empty(
              /*pieceDragedEntered*/ ctx[3]
                ? "drag-enter"
                : /*classSelector*/ ctx[5]()
            ) +
              " svelte-1yd518t"))
        );

        add_location(div, file$6, 46, 0, 1249);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        if_block0.m(div, null);
        append_dev(div, t);
        if (if_block1) if_block1.m(div, null);

        if (!mounted) {
          dispose = [
            listen_dev(
              div,
              "click",
              /*handleClick*/ ctx[4],
              false,
              false,
              false
            ),
            listen_dev(
              div,
              "dragenter",
              /*handleDragEnter*/ ctx[8],
              false,
              false,
              false
            ),
            listen_dev(
              div,
              "dragleave",
              /*handleDragLeave*/ ctx[9],
              false,
              false,
              false
            ),
            listen_dev(
              div,
              "drop",
              /*handleDragDrop*/ ctx[10],
              false,
              false,
              false
            ),
            listen_dev(
              div,
              "dragover",
              dragover_handler_1,
              false,
              false,
              false
            ),
            listen_dev(div, "focus", focus_handler, false, false, false),
            listen_dev(
              div,
              "mouseover",
              /*mouseover_handler*/ ctx[14],
              false,
              false,
              false
            ),
            listen_dev(
              div,
              "mouseleave",
              /*mouseleave_handler*/ ctx[15],
              false,
              false,
              false
            ),
          ];

          mounted = true;
        }
      },
      p: function update(ctx, [dirty]) {
        if (
          current_block_type ===
            (current_block_type = select_block_type(ctx)) &&
          if_block0
        ) {
          if_block0.p(ctx, dirty);
        } else {
          if_block0.d(1);
          if_block0 = current_block_type(ctx);

          if (if_block0) {
            if_block0.c();
            if_block0.m(div, t);
          }
        }

        if (/*validMove*/ ctx[1] && !(/*pieceDragedEntered*/ ctx[3])) {
          if (if_block1);
          else {
            if_block1 = create_if_block$6(ctx);
            if_block1.c();
            if_block1.m(div, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }

        if (
          dirty & /*pieceDragedEntered*/ 8 &&
          div_class_value !==
            (div_class_value =
              "" +
              (null_to_empty(
                /*pieceDragedEntered*/ ctx[3]
                  ? "drag-enter"
                  : /*classSelector*/ ctx[5]()
              ) +
                " svelte-1yd518t"))
        ) {
          attr_dev(div, "class", div_class_value);
        }
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        if_block0.d();
        if (if_block1) if_block1.d();
        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$6.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  const dragover_handler = (ev) => {
    ev.preventDefault();
  };

  const dragover_handler_1 = (ev) => {
    ev.preventDefault();
  };

  const focus_handler = () => {};

  function instance$6($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("Piece", slots, []);
    const dispatch = createEventDispatcher();
    let { piece = null } = $$props;
    let { row = 0 } = $$props;
    let { column = 0 } = $$props;
    let { validMove = false } = $$props;
    let { isChecked = false } = $$props;
    let pieceDragedEntered = false;

    function handleClick() {
      $$invalidate(3, (pieceDragedEntered = false));
      if (validMove) dispatch("move", { row, column });
      else dispatch("showValidMoves", piece);
    }

    function classSelector() {
      if (pieceDragedEntered) return "drag-enter";
      return (row + column) % 2 === 0 ? "even" : "odd";
    }

    function handleDragStart(e, piece) {
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.setData("text", JSON.stringify({ row, column }));
      dispatch("showDragValidMoves", piece);
    }

    function handleDragEnd(_e) {
      dispatch("showValidMoves", piece);
    }

    function handleDragEnter(_e) {
      if (validMove) $$invalidate(3, (pieceDragedEntered = true));
    }

    function handleDragLeave(_e) {
      if (validMove) $$invalidate(3, (pieceDragedEntered = false));
    }

    function handleDragDrop(e) {
      e.preventDefault();

      if (validMove) {
        dispatch("move", { row, column });
        $$invalidate(3, (pieceDragedEntered = false));
      }
    }

    const writable_props = ["piece", "row", "column", "validMove", "isChecked"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<Piece> was created with unknown prop '${key}'`);
    });

    const dragstart_handler = (e) => handleDragStart(e, piece);
    const mouseover_handler = () => handleDragEnter();
    const mouseleave_handler = () => handleDragLeave();

    $$self.$$set = ($$props) => {
      if ("piece" in $$props) $$invalidate(0, (piece = $$props.piece));
      if ("row" in $$props) $$invalidate(11, (row = $$props.row));
      if ("column" in $$props) $$invalidate(12, (column = $$props.column));
      if ("validMove" in $$props)
        $$invalidate(1, (validMove = $$props.validMove));
      if ("isChecked" in $$props)
        $$invalidate(2, (isChecked = $$props.isChecked));
    };

    $$self.$capture_state = () => ({
      createEventDispatcher,
      BlankIcon: img$g,
      dispatch,
      piece,
      row,
      column,
      validMove,
      isChecked,
      pieceDragedEntered,
      handleClick,
      classSelector,
      handleDragStart,
      handleDragEnd,
      handleDragEnter,
      handleDragLeave,
      handleDragDrop,
    });

    $$self.$inject_state = ($$props) => {
      if ("piece" in $$props) $$invalidate(0, (piece = $$props.piece));
      if ("row" in $$props) $$invalidate(11, (row = $$props.row));
      if ("column" in $$props) $$invalidate(12, (column = $$props.column));
      if ("validMove" in $$props)
        $$invalidate(1, (validMove = $$props.validMove));
      if ("isChecked" in $$props)
        $$invalidate(2, (isChecked = $$props.isChecked));
      if ("pieceDragedEntered" in $$props)
        $$invalidate(3, (pieceDragedEntered = $$props.pieceDragedEntered));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [
      piece,
      validMove,
      isChecked,
      pieceDragedEntered,
      handleClick,
      classSelector,
      handleDragStart,
      handleDragEnd,
      handleDragEnter,
      handleDragLeave,
      handleDragDrop,
      row,
      column,
      dragstart_handler,
      mouseover_handler,
      mouseleave_handler,
    ];
  }

  class Piece extends SvelteComponentDev {
    constructor(options) {
      super(options);

      init(this, options, instance$6, create_fragment$6, safe_not_equal, {
        piece: 0,
        row: 11,
        column: 12,
        validMove: 1,
        isChecked: 2,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Piece",
        options,
        id: create_fragment$6.name,
      });
    }

    get piece() {
      throw new Error(
        "<Piece>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set piece(value) {
      throw new Error(
        "<Piece>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get row() {
      throw new Error(
        "<Piece>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set row(value) {
      throw new Error(
        "<Piece>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get column() {
      throw new Error(
        "<Piece>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set column(value) {
      throw new Error(
        "<Piece>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get validMove() {
      throw new Error(
        "<Piece>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set validMove(value) {
      throw new Error(
        "<Piece>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get isChecked() {
      throw new Error(
        "<Piece>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set isChecked(value) {
      throw new Error(
        "<Piece>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  var RoomStatus;
  (function (RoomStatus) {
    RoomStatus[(RoomStatus["SETUP"] = 0)] = "SETUP";
    RoomStatus[(RoomStatus["PLAYING"] = 1)] = "PLAYING";
    RoomStatus[(RoomStatus["WHITE"] = 2)] = "WHITE";
    RoomStatus[(RoomStatus["BLACK"] = 3)] = "BLACK";
    RoomStatus[(RoomStatus["REMIS"] = 4)] = "REMIS";
    RoomStatus[(RoomStatus["ABORTED"] = 5)] = "ABORTED";
    RoomStatus[(RoomStatus["REMIS_REQUESTED"] = 6)] = "REMIS_REQUESTED";
  })(RoomStatus || (RoomStatus = {}));
  var RoomStatus$1 = RoomStatus;

  /* src/components/Board.svelte generated by Svelte v3.50.1 */
  const file$5 = "src/components/Board.svelte";

  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[20] = list[i];
    child_ctx[22] = i;
    return child_ctx;
  }

  function get_each_context_1(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[23] = list[i];
    child_ctx[25] = i;
    return child_ctx;
  }

  // (109:2) {#if mobile}
  function create_if_block_1$3(ctx) {
    let div2;
    let div1;
    let div0;
    let t0;
    let h30;
    let t2;
    let h31;
    let t3;
    let h31_hidden_value;
    let t4;
    let h32;
    let t5_value = formatTime$1(/*opponentTime*/ ctx[2]) + "";
    let t5;

    const block = {
      c: function create() {
        div2 = element("div");
        div1 = element("div");
        div0 = element("div");
        t0 = space();
        h30 = element("h3");
        h30.textContent = "Anonymous";
        t2 = space();
        h31 = element("h3");
        t3 = text(/*awayTimer*/ ctx[6]);
        t4 = space();
        h32 = element("h3");
        t5 = text(t5_value);
        attr_dev(div0, "class", "activity-ball svelte-j4lzjv");

        set_style(
          div0,
          "background-color",
          /*getPlayerActivity*/ ctx[7](/*roomPresence*/ ctx[3])[1]
            ? "green"
            : "grey"
        );

        add_location(div0, file$5, 111, 8, 3329);
        add_location(h30, file$5, 117, 8, 3501);
        h31.hidden = h31_hidden_value = /*awayTimer*/ ctx[6] === 30;
        attr_dev(h31, "class", "timer");
        add_location(h31, file$5, 118, 8, 3528);
        attr_dev(div1, "class", "activity-container svelte-j4lzjv");
        add_location(div1, file$5, 110, 6, 3288);
        add_location(h32, file$5, 120, 6, 3608);
        attr_dev(div2, "class", "row svelte-j4lzjv");
        add_location(div2, file$5, 109, 4, 3264);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div2, anchor);
        append_dev(div2, div1);
        append_dev(div1, div0);
        append_dev(div1, t0);
        append_dev(div1, h30);
        append_dev(div1, t2);
        append_dev(div1, h31);
        append_dev(h31, t3);
        append_dev(div2, t4);
        append_dev(div2, h32);
        append_dev(h32, t5);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*roomPresence*/ 8) {
          set_style(
            div0,
            "background-color",
            /*getPlayerActivity*/ ctx[7](/*roomPresence*/ ctx[3])[1]
              ? "green"
              : "grey"
          );
        }

        if (dirty & /*awayTimer*/ 64) set_data_dev(t3, /*awayTimer*/ ctx[6]);

        if (
          dirty & /*awayTimer*/ 64 &&
          h31_hidden_value !== (h31_hidden_value = /*awayTimer*/ ctx[6] === 30)
        ) {
          prop_dev(h31, "hidden", h31_hidden_value);
        }

        if (
          dirty & /*opponentTime*/ 4 &&
          t5_value !== (t5_value = formatTime$1(/*opponentTime*/ ctx[2]) + "")
        )
          set_data_dev(t5, t5_value);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div2);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_1$3.name,
      type: "if",
      source: "(109:2) {#if mobile}",
      ctx,
    });

    return block;
  }

  // (126:6) {#each row as column, columnIndex}
  function create_each_block_1(ctx) {
    let piece;
    let current;

    function func(...args) {
      return /*func*/ ctx[15](
        /*rowIndex*/ ctx[22],
        /*columnIndex*/ ctx[25],
        ...args
      );
    }

    piece = new Piece({
      props: {
        piece: /*column*/ ctx[23],
        row: /*rowIndex*/ ctx[22],
        column: /*columnIndex*/ ctx[25],
        validMove: /*validMoves*/ ctx[5].filter(func).length > 0,
        isChecked: /*isChecked*/ ctx[11](/*column*/ ctx[23]),
      },
      $$inline: true,
    });

    piece.$on("showValidMoves", /*handleShowValidMoves*/ ctx[8]);
    piece.$on("showDragValidMoves", /*handleDragShowValidMoves*/ ctx[9]);
    piece.$on("move", /*handleMove*/ ctx[10]);

    const block = {
      c: function create() {
        create_component(piece.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(piece, target, anchor);
        current = true;
      },
      p: function update(new_ctx, dirty) {
        ctx = new_ctx;
        const piece_changes = {};
        if (dirty & /*chessBoard*/ 1) piece_changes.piece = /*column*/ ctx[23];
        if (dirty & /*validMoves*/ 32)
          piece_changes.validMove =
            /*validMoves*/ ctx[5].filter(func).length > 0;
        if (dirty & /*chessBoard*/ 1)
          piece_changes.isChecked = /*isChecked*/ ctx[11](/*column*/ ctx[23]);
        piece.$set(piece_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(piece.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(piece.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(piece, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block_1.name,
      type: "each",
      source: "(126:6) {#each row as column, columnIndex}",
      ctx,
    });

    return block;
  }

  // (125:4) {#each chessBoard as row, rowIndex}
  function create_each_block(ctx) {
    let each_1_anchor;
    let current;
    let each_value_1 = /*row*/ ctx[20];
    validate_each_argument(each_value_1);
    let each_blocks = [];

    for (let i = 0; i < each_value_1.length; i += 1) {
      each_blocks[i] = create_each_block_1(
        get_each_context_1(ctx, each_value_1, i)
      );
    }

    const out = (i) =>
      transition_out(each_blocks[i], 1, 1, () => {
        each_blocks[i] = null;
      });

    const block = {
      c: function create() {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        each_1_anchor = empty();
      },
      m: function mount(target, anchor) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(target, anchor);
        }

        insert_dev(target, each_1_anchor, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        if (
          dirty &
          /*chessBoard, validMoves, isChecked, handleShowValidMoves, handleDragShowValidMoves, handleMove*/ 3873
        ) {
          each_value_1 = /*row*/ ctx[20];
          validate_each_argument(each_value_1);
          let i;

          for (i = 0; i < each_value_1.length; i += 1) {
            const child_ctx = get_each_context_1(ctx, each_value_1, i);

            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block_1(child_ctx);
              each_blocks[i].c();
              transition_in(each_blocks[i], 1);
              each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
            }
          }

          group_outros();

          for (i = each_value_1.length; i < each_blocks.length; i += 1) {
            out(i);
          }

          check_outros();
        }
      },
      i: function intro(local) {
        if (current) return;

        for (let i = 0; i < each_value_1.length; i += 1) {
          transition_in(each_blocks[i]);
        }

        current = true;
      },
      o: function outro(local) {
        each_blocks = each_blocks.filter(Boolean);

        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }

        current = false;
      },
      d: function destroy(detaching) {
        destroy_each(each_blocks, detaching);
        if (detaching) detach_dev(each_1_anchor);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block.name,
      type: "each",
      source: "(125:4) {#each chessBoard as row, rowIndex}",
      ctx,
    });

    return block;
  }

  // (142:2) {#if mobile}
  function create_if_block$5(ctx) {
    let div2;
    let div1;
    let div0;
    let t0;
    let h30;
    let t2;
    let h31;
    let t3_value = formatTime$1(/*playerTime*/ ctx[1]) + "";
    let t3;

    const block = {
      c: function create() {
        div2 = element("div");
        div1 = element("div");
        div0 = element("div");
        t0 = space();
        h30 = element("h3");
        h30.textContent = "Anonymous";
        t2 = space();
        h31 = element("h3");
        t3 = text(t3_value);
        attr_dev(div0, "class", "activity-ball svelte-j4lzjv");

        set_style(
          div0,
          "background-color",
          /*getPlayerActivity*/ ctx[7](/*roomPresence*/ ctx[3])[0]
            ? "green"
            : "grey"
        );

        add_location(div0, file$5, 144, 8, 4315);
        add_location(h30, file$5, 150, 8, 4487);
        attr_dev(div1, "class", "activity-container svelte-j4lzjv");
        add_location(div1, file$5, 143, 6, 4274);
        add_location(h31, file$5, 152, 6, 4525);
        attr_dev(div2, "class", "row svelte-j4lzjv");
        add_location(div2, file$5, 142, 4, 4250);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div2, anchor);
        append_dev(div2, div1);
        append_dev(div1, div0);
        append_dev(div1, t0);
        append_dev(div1, h30);
        append_dev(div2, t2);
        append_dev(div2, h31);
        append_dev(h31, t3);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*roomPresence*/ 8) {
          set_style(
            div0,
            "background-color",
            /*getPlayerActivity*/ ctx[7](/*roomPresence*/ ctx[3])[0]
              ? "green"
              : "grey"
          );
        }

        if (
          dirty & /*playerTime*/ 2 &&
          t3_value !== (t3_value = formatTime$1(/*playerTime*/ ctx[1]) + "")
        )
          set_data_dev(t3, t3_value);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div2);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$5.name,
      type: "if",
      source: "(142:2) {#if mobile}",
      ctx,
    });

    return block;
  }

  function create_fragment$5(ctx) {
    let div1;
    let t0;
    let div0;
    let t1;
    let current;
    let if_block0 = /*mobile*/ ctx[4] && create_if_block_1$3(ctx);
    let each_value = /*chessBoard*/ ctx[0];
    validate_each_argument(each_value);
    let each_blocks = [];

    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    }

    const out = (i) =>
      transition_out(each_blocks[i], 1, 1, () => {
        each_blocks[i] = null;
      });

    let if_block1 = /*mobile*/ ctx[4] && create_if_block$5(ctx);

    const block = {
      c: function create() {
        div1 = element("div");
        if (if_block0) if_block0.c();
        t0 = space();
        div0 = element("div");

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        t1 = space();
        if (if_block1) if_block1.c();
        attr_dev(div0, "id", "board");
        attr_dev(div0, "class", "svelte-j4lzjv");
        add_location(div0, file$5, 123, 2, 3665);
        attr_dev(div1, "id", "container");
        add_location(div1, file$5, 107, 0, 3224);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div1, anchor);
        if (if_block0) if_block0.m(div1, null);
        append_dev(div1, t0);
        append_dev(div1, div0);

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(div0, null);
        }

        append_dev(div1, t1);
        if (if_block1) if_block1.m(div1, null);
        current = true;
      },
      p: function update(ctx, [dirty]) {
        if (/*mobile*/ ctx[4]) {
          if (if_block0) {
            if_block0.p(ctx, dirty);
          } else {
            if_block0 = create_if_block_1$3(ctx);
            if_block0.c();
            if_block0.m(div1, t0);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        if (
          dirty &
          /*chessBoard, validMoves, isChecked, handleShowValidMoves, handleDragShowValidMoves, handleMove*/ 3873
        ) {
          each_value = /*chessBoard*/ ctx[0];
          validate_each_argument(each_value);
          let i;

          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context(ctx, each_value, i);

            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block(child_ctx);
              each_blocks[i].c();
              transition_in(each_blocks[i], 1);
              each_blocks[i].m(div0, null);
            }
          }

          group_outros();

          for (i = each_value.length; i < each_blocks.length; i += 1) {
            out(i);
          }

          check_outros();
        }

        if (/*mobile*/ ctx[4]) {
          if (if_block1) {
            if_block1.p(ctx, dirty);
          } else {
            if_block1 = create_if_block$5(ctx);
            if_block1.c();
            if_block1.m(div1, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
      },
      i: function intro(local) {
        if (current) return;

        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }

        current = true;
      },
      o: function outro(local) {
        each_blocks = each_blocks.filter(Boolean);

        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }

        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div1);
        if (if_block0) if_block0.d();
        destroy_each(each_blocks, detaching);
        if (if_block1) if_block1.d();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$5.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function addLeadingZero$1(number) {
    if (number < 10) return `0${number}`;
    return number.toString();
  }

  function formatTime$1(time) {
    return `${addLeadingZero$1(Math.trunc(time / 60))}:${addLeadingZero$1(
      time % 60
    )}`;
  }

  function instance$5($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("Board", slots, []);
    const dispatch = createEventDispatcher();
    let { playerType = PlayerType$1.SPECTATOR } = $$props;
    let { chessBoard = null } = $$props;
    let { nextTurn = PlayerType$1.SPECTATOR } = $$props;
    let { playerTime = 0 } = $$props;
    let { opponentTime = 0 } = $$props;
    let { status = RoomStatus$1.SETUP } = $$props;
    let { roomPresence = [] } = $$props;
    let { mobile = false } = $$props;
    let validMoves = [];
    let selectedPiece = null;
    let awayTimer = 30;
    let isTicking = false;

    function getPlayerActivity(roomPresence) {
      const activities = Array(2).fill(false);

      roomPresence.forEach((presence) => {
        if (PlayerType$1[presence.color] === playerType) activities[0] = true;
        if (
          PlayerType$1[presence.color] !== playerType &&
          PlayerType$1[presence.color] !== PlayerType$1.SPECTATOR
        )
          activities[1] = true;
      });

      if (
        !activities[1] &&
        (status === RoomStatus$1.PLAYING ||
          status === RoomStatus$1.REMIS_REQUESTED ||
          status === RoomStatus$1.SETUP)
      ) {
        if (!isTicking) {
          isTicking = true;
          tickAwayTime();
        }
      } else {
        isTicking = false;
        $$invalidate(6, (awayTimer = 30));
      }

      return activities;
    }

    function tickAwayTime() {
      if (isTicking) {
        if (awayTimer === 0) {
          dispatch("timeout");
        } else {
          $$invalidate(6, (awayTimer -= 1));
          setTimeout(() => tickAwayTime(), 1000);
        }
      }
    }

    function handleShowValidMoves(e) {
      if (selectedPiece === e.detail) {
        $$invalidate(5, (validMoves = []));
        selectedPiece = null;
        return;
      }

      selectedPiece = e.detail;
      const playersPiece =
        e.detail &&
        PlayerType$1[playerType] === ChessColor$1[e.detail.color] &&
        nextTurn === playerType;

      if (e.detail && playersPiece) {
        $$invalidate(
          5,
          (validMoves = ChessBoard.filterValidMovesChecked(e.detail, [
            ...chessBoard,
          ]))
        );
      } else $$invalidate(5, (validMoves = []));
    }

    function handleDragShowValidMoves(e) {
      selectedPiece = e.detail;
      const playersPiece =
        e.detail &&
        PlayerType$1[playerType] === ChessColor$1[e.detail.color] &&
        nextTurn === playerType;

      if (e.detail && playersPiece) {
        $$invalidate(
          5,
          (validMoves = ChessBoard.filterValidMovesChecked(e.detail, [
            ...chessBoard,
          ]))
        );
      } else $$invalidate(5, (validMoves = []));
    }

    function handleMove(e) {
      const newBoard = selectedPiece.move(e.detail, chessBoard);
      selectedPiece = null;
      $$invalidate(5, (validMoves = []));
      $$invalidate(0, (chessBoard = newBoard));
      dispatch("move", ChessBoard.serializeBoard(newBoard, playerType));
    }

    function isChecked(piece) {
      return (
        piece instanceof King &&
        ChessBoard.isChecked(piece.color, [...chessBoard])
      );
    }

    const writable_props = [
      "playerType",
      "chessBoard",
      "nextTurn",
      "playerTime",
      "opponentTime",
      "status",
      "roomPresence",
      "mobile",
    ];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<Board> was created with unknown prop '${key}'`);
    });

    const func = (rowIndex, columnIndex, rowCol) =>
      rowCol.row === rowIndex && rowCol.column === columnIndex;

    $$self.$$set = ($$props) => {
      if ("playerType" in $$props)
        $$invalidate(12, (playerType = $$props.playerType));
      if ("chessBoard" in $$props)
        $$invalidate(0, (chessBoard = $$props.chessBoard));
      if ("nextTurn" in $$props)
        $$invalidate(13, (nextTurn = $$props.nextTurn));
      if ("playerTime" in $$props)
        $$invalidate(1, (playerTime = $$props.playerTime));
      if ("opponentTime" in $$props)
        $$invalidate(2, (opponentTime = $$props.opponentTime));
      if ("status" in $$props) $$invalidate(14, (status = $$props.status));
      if ("roomPresence" in $$props)
        $$invalidate(3, (roomPresence = $$props.roomPresence));
      if ("mobile" in $$props) $$invalidate(4, (mobile = $$props.mobile));
    };

    $$self.$capture_state = () => ({
      ChessBoard,
      Piece,
      King,
      PlayerType: PlayerType$1,
      ChessColor: ChessColor$1,
      createEventDispatcher,
      RoomStatus: RoomStatus$1,
      dispatch,
      playerType,
      chessBoard,
      nextTurn,
      playerTime,
      opponentTime,
      status,
      roomPresence,
      mobile,
      validMoves,
      selectedPiece,
      awayTimer,
      isTicking,
      addLeadingZero: addLeadingZero$1,
      formatTime: formatTime$1,
      getPlayerActivity,
      tickAwayTime,
      handleShowValidMoves,
      handleDragShowValidMoves,
      handleMove,
      isChecked,
    });

    $$self.$inject_state = ($$props) => {
      if ("playerType" in $$props)
        $$invalidate(12, (playerType = $$props.playerType));
      if ("chessBoard" in $$props)
        $$invalidate(0, (chessBoard = $$props.chessBoard));
      if ("nextTurn" in $$props)
        $$invalidate(13, (nextTurn = $$props.nextTurn));
      if ("playerTime" in $$props)
        $$invalidate(1, (playerTime = $$props.playerTime));
      if ("opponentTime" in $$props)
        $$invalidate(2, (opponentTime = $$props.opponentTime));
      if ("status" in $$props) $$invalidate(14, (status = $$props.status));
      if ("roomPresence" in $$props)
        $$invalidate(3, (roomPresence = $$props.roomPresence));
      if ("mobile" in $$props) $$invalidate(4, (mobile = $$props.mobile));
      if ("validMoves" in $$props)
        $$invalidate(5, (validMoves = $$props.validMoves));
      if ("selectedPiece" in $$props) selectedPiece = $$props.selectedPiece;
      if ("awayTimer" in $$props)
        $$invalidate(6, (awayTimer = $$props.awayTimer));
      if ("isTicking" in $$props) isTicking = $$props.isTicking;
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [
      chessBoard,
      playerTime,
      opponentTime,
      roomPresence,
      mobile,
      validMoves,
      awayTimer,
      getPlayerActivity,
      handleShowValidMoves,
      handleDragShowValidMoves,
      handleMove,
      isChecked,
      playerType,
      nextTurn,
      status,
      func,
    ];
  }

  class Board extends SvelteComponentDev {
    constructor(options) {
      super(options);

      init(this, options, instance$5, create_fragment$5, safe_not_equal, {
        playerType: 12,
        chessBoard: 0,
        nextTurn: 13,
        playerTime: 1,
        opponentTime: 2,
        status: 14,
        roomPresence: 3,
        mobile: 4,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Board",
        options,
        id: create_fragment$5.name,
      });
    }

    get playerType() {
      throw new Error(
        "<Board>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set playerType(value) {
      throw new Error(
        "<Board>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get chessBoard() {
      throw new Error(
        "<Board>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set chessBoard(value) {
      throw new Error(
        "<Board>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get nextTurn() {
      throw new Error(
        "<Board>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set nextTurn(value) {
      throw new Error(
        "<Board>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get playerTime() {
      throw new Error(
        "<Board>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set playerTime(value) {
      throw new Error(
        "<Board>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get opponentTime() {
      throw new Error(
        "<Board>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set opponentTime(value) {
      throw new Error(
        "<Board>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get status() {
      throw new Error(
        "<Board>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set status(value) {
      throw new Error(
        "<Board>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get roomPresence() {
      throw new Error(
        "<Board>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set roomPresence(value) {
      throw new Error(
        "<Board>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get mobile() {
      throw new Error(
        "<Board>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set mobile(value) {
      throw new Error(
        "<Board>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  var img$4 =
    "data:image/png;base64,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";

  var img$3 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAIABJREFUeJzsnXW4XNXVh997YyQhIYqFQAhuwS1YcIoVD1agRh0qtJTK19ShChVavGjRUrRAcCvuQQNJkISQEGJErs33x7q3XMKdubP2WfvIzHqfZz8JZM6s3zlzzt777L0EHMdxHMdxHMdxHMdxHMdxHMdxHMdxHMdxHMdxHMcpJA1ZC3AcpyoGASsCQ4FhndpQYDCwHNAXWKH97/2BAe1/H7DMd/UHepexMxcoAR8CTcBSYBHQBsxr//8ftH9ubqe/d/7zXWB2stN1HCc2PgFwnGzpBYwARgJrtP85stN/D0cG+V5ZCQxkKTIReAeY0enP6e1/nwK8CbRkJdBx6h2fADhOfHoDawHrA+sB67b/OQpYGWjMTFm2NAPTgDeA19tbx98nIysPjuNEwicAjmNHH2BjYHM+GuzXRwb6ntnJKiRtyCrBC+3t+fY/X0UmDo7jJMQnAI4TxiBgM2Sw36y9bYgP9LFpAl4GJgFPA48DTwILshTlOEXEJwCO0z29gS2Ase1tC2DNTBU5nWkDXkImA4+1t+fwlQLHqYhPABznkwzjo8F+B2ArxJveKQ5LgGeAB4H7gAeQKAbHcdrxCYDjiKf97sAewI7I3r1TW7QCzyKTgXuRicGcLAU5Ttb4BMCpR/ohA/2eyKC/Kf4s1BttiGPhPcDtyMRgcaaKHCdlvNNz6oUtgL2RAX8HxGPfcTpYjKwM/Ke9Tc5UjeOkgE8AnFqlN7AL8GngQCSxjuNUy2TgNuBWZGLgqwNOzeETAKeW6A/sBhwOHICE6jlOUhYDdwHXAP8G5mcrx3Fs8AmAU3SGAYcBhyJv/EVLmVsNzUiO/Q8Qx7Xu/r6403ELO31PR55/+CjXfwc9+XjNgB7AQGSrpB+wPHJtByH1BgZ10VYCVkGcKmt1i2UJ4jPwL+Am5Ho7TiHxCYBTRAYCBwFHIo58RU6+04rkzJ8GvAW8jeTIf7P9v98C3stMXTiDkDTHKyI1DVbjoxoHq7e3oq/QNCMrA9cB1yITLMcpDD4BcIpCX2Bf4ChgP4oVl18CpiLJaiYhmexeRQb36dRvwpqhwNpInYS129u6wAbIJK9ILAFuBi5FfAeaKn/ccbLHJwBOnmkAdgVOQJz58j4otCLFbF7ko8H+pfbmhW10jEQmAhu3/zkG2ASZCOad94ErgcuARzLW4jhl8QmAk0dGIIP+54DR2UopSwl4hY9Sz3akn12apagapwdSXGlzPqrBsBX5nhi+hkwE/oFs6ziO4zjL0AOJ0b8aWRIv5azNQJy+JiARBkOjXAUnhNHAccA5yKpL1vdKV60VmIhEqBTZZ8VxHMeMdYDTkQE26066c5sE/AmJMPAcAsViBHAEcBbwBPmbUE4DfgysGusCOI7j5JUGJCvfLcibUdYdckenfCFwLBLK5tQOyyO1Hn6C1ABoIfv7rYRMTK4D9gIao5294zhODlge+AriFJd15zsL2W74MrIK4dQPg4HxwEXkZ+XpVeTZ6BfxvB3HcVJnTeB3SNKULDvZZ4CfInUB/I3LAVmN2gL4AVIyOOvtgtnAL/FVKMdxCs5Y4HqyW+ZvQfK4fxOZhDhOdwxGHPUuRBIwZTURWIpEDmwa9Wwdx3GM2QsZeLPoOD9EJh0nIGmCHSeUnkimyfOR2P6sJgN3AvtEPlfHcZxgGoGDgcdJv4NcBFyBpAf2PVQnBr2QTJT/ILutrMeRypaev8VxnFzQiCyZph1/3Yp4dJ9IvhPBOLVHHyQXxCXAPNKfCDyH5D3oEftEHcdxuqIn8AUk9W2and8k4Pt4bL6TD/oChyDbTmk7EL6A1MZwh1bHcVKhETgaCVtKq6N7F/gj4q3tOHllFeA0YDLpTgReRvJX+ETAcZwoNCAFeZ4jnU6tFamqdiCeOtUpFg1IWusrkSqBaU0EnkUqZTqO45ixI3A/6XRic5Gc7humcmaOE5dBiJ9KWhPnEvAwsHMaJ+cUG/cmdSqxLZKnf1wKtp4Ezgb+CSxOwV6tMQApUDS0/e89ked7UPu/9wb6t/99ecSrvTPNwML2v3/IR/Xs5yKDSguwAAmHe7/9746OnYAvInUK+qRg79/AD5Hy1I7zCXwC4HTFSODXyF5/zHtkCZKO92zg0Yh2ikgjUixmFJLEqGNwHwYMX+a/hyIDfJo0IVnrOiYEs5H0yu93alOAqcB0oC1lfXlmZeDrSBrq2FUlW4GLkToIb0e25RQMnwA4nekPfA84hbjx9O8hldrORQaOemUwUsq2o62KOJKNRure9y9/aKFoBt5CIkZmIBOCNzq1qdTnBKE/krDqW8BakW0tAs4AfouvsDmO04kGJJZ/KnH3JqcCJ1N/yXqGALsCJwHnAY8hy+1p7QnnvS1EVoDOBb6BbDkNCbnQBaURySvwIPGv9VtIDgF/+XMch22Ah4jb6TyPdDrL7jvXGj2Rt/cDgAnATcDryNtt1oNsEdscZFA8C7l/tgSWq/bHKChbIgmGYpcsvgcYk9I5OY6TM1YCLiXu4PQQMhjW6tvGQCTcawIwEVlmzXrQrPXWBDyBTAoOp3brPayDRMMsJd61bAb+Qn2ttjhOXdOIOB/NIU6n0gb8B9glrRNKkVWRQecsZBDKqsqht4+315G35hOBjaitCeco4ALiZhmcjUQn1NJ1cxxnGcYgMcKxOpIHkVCnWmFtZE/6eiQbYdYDnbfq2gzgOuBrxHeuS4tRyIpAzK2BB5EJlOM4NUQ/ZJk61nLiY8hSf9Hpiyzpn076xY28xWuvI4Pn4UiOhCKzAXF9BJqQ+7/WfS0cpy44GHiTOJ3Fi0ghlCIvHY5Glo6vRpLbZD1YeYvbFiH+GqciDndFZVMk0U8sH56X8GyCjlNYhgFXEadzmAp8lmKWI21EOrY/IW+GWQ9I3rJtryE+HTtSzGI6WyM+NzGuTRsStjo4tbNxHCcxhwAzse8Q3kPi+NNIY2rNRsg2SNrli70Vp73NR5OBoq1q7YmUB45xXd5FCoE5NUbRbnKnMkORsJ4jjb+3CekYf06xcsBvjeRdPwJYPWMtsWnmoxS8cxB/D/gol3+5XP8ddFUroHMtgT5IuFhHCuJaz+kwDdkWugqpU1EEeiIRPhOIk2L4YuQFYF6E73YywCcAtcO+yHLdqsbfexfy0E8y/t5YbAaMRwb90RlrSUoTMhBNaf9zJh/Pv9+Rg382MD9lbQORbaaOWgSd6xKshHitjwLWIP06Bda8jkwErkKq+uWdwYiPw7ewv/YzkJDBW4y/18kAnwAUnyHAn5HCPZa8gXQgNxp/bwxWQM7/i8DmGWvRUEIG9ql8VDhnCrVVRGfZokZrdvr7KGSCUKR+6EngfOAK0p90adkQ+COwl/H3loC/IpOMRcbf7ThOlYxDcntb7vd9iCwhFiEMaEskvKsI3vvzkORBlyArKjsiS+31Tm/EP+M4ZJtpIuJrkvXv1V1bjGwR7GF/SczZgzj+AW/gkQKOkzo9gV9in4nuKqQUcJ4ZggygsRyeLNpk4ErgNGB/5C3X0bEGcu1OQ67lZLL/Xcu155FCT3n2lu8NfAf7yXIL4hvUM71TcZz6ZTTwX2wf4heR1YQ8swtwGfLmlXWH37k1AY8Af0CiL1aOdQEcVgYORa71I8i1z/r379wWI/U18vxWvDqyf2997g+Q/5cHxyk0hwMfYPfQNpPvrF+9kHN+lOw79442H1mmnoAsrdZbaeM80QvZBjoZWY6fTfb3R0d7hnxXwDwc+62Wue3f6ziOIQOQvW7Lh/VZYKs0T0LBQOAU4mUw1LRm5O3mB8AWFDNZTL3QiPxGP0B+s5gFdKpt05Cl94ERzzuUwUi/Yp1N8BIkrbbjOAkZg2Qrs3o4FwPfJ597disjb9axKhVW22Yib5THke99Xacy/ZEaFeeQ/WRyPuLkmMd8FPsgkSeW5/skUtLYcZxAjkW88q0eygeA9VI9g+rYAric7PZ0W4B7kYnRZhQrLM2pjgbkt/0+cB9xq+pVak2In8BmcU9XzfLAmdhel/nYhyc7Ts3TG4mztXwQv0b+lq93QPbTsxr070Eypw2PfaJO7lgR+ApyD1hH01Tbbge2i32iSrZFohosz/NM8rni6Di5YzVsvfzvJn9haGOQJfa0O9xWpOb5ydhnTHSKy1Bku2ci2UwGJpIvf5w+SKSFpW/Avciky3GcMuyCpNq0eOCakf30PFXs2wgZ+GOVMC3XJiHXouipgZ34rIZMEB8k/ft0IvnKZLk7UiDJ6vzeRlYYHMfpRAOSVtNq/+1VpBBOXtiQ9Af+t4CfIulmHSeENYGfYTsIdtdagX8C66dwftUwDLgeu/NbjJQSdxwHWW67GLsH7BLyk2J2FOKBnZbDVSvyFnU4vufo2NGI5Hy4mvQcVVvb7eXFk/44bLMInkPxi0Q5TiJWAh7G5oH6AKmAlweGAWeTXhz2FOBH+L6+E58RyL02hXTu7SbgT0gK7KxZD6lnYXVuD+AOuE6dsgl2nch/ycf+di9k/zSNOP4m4Bqk0lneohuc2qcR2Bu5B9NYFXgf+DrZr2z1RPxprFb13gA2SPMEHCdrDsRmOa0F+D/y4ei3B/bhQ121PCdUceqTNBNYvQzsm8pZVWZXpFy1xTnNaf8+x6l5TsYm1Gg29nW+Q1iXdEL6piOd7KBUzspx9CyPPN9Tif88TESca7NkOBJmbHE+zUhODsepSXoCF2LzsDxB9rH9g5BCQkuI29E9Tb6LqjjOsjQiKYitq3Yu25qQ1bAV0jmtLumF+ChYndMv8UycTo3RD7gZmwfkUrKtQNcAfB6Yhc35dNXakOvly4JO0dkNKb8bMwR2JnAC2Q6cRwMLsTmfa/BiQk6NMAypXZ70oVhK9ktka2O35Fdu4P8X4iDpOLXEGCSePuZEYCLZOgNvBrzeha6Q9iBeiMspOKOAl0j+MLwNbJ+u9I/RE9nbtJrhl+u88pQO1XFisAlxk2ItQpKKZeUYPBC7xEGTkMyMjlM4Nkay0SV9CO5HvIyzYgzwWBe6rNqDSApkx6kntgNuIt5z9TTZTag7MptaODtPQRyNHacwjAPmkvzm/wvZxf32Rbzul1bQl6Q9hOyPOk49swNwF3GesWbESbB/amfzcQ4A5nWjsZr2Lvkrn+w4XXIwyT3jW4Fvpi28E7sCr3Why6I9BuyZ3qk4TiHYC3icOM/cK2S3yjYGm5XQucDOKWt3HBXjSZ4VbDHZpfTth6TwjbE/+Q4SzuchPo7TNY2IN79Vgp3OrQ34M9l416+CTQrhJcAhKWt3nKo4geTpMWeQXRW/jYFnq9CobUuRZciB6Z2K4xSa/sj222Lsn8cXyabk8ADg1gC9y7Zm4NiUtTtORU4kucPLJLIpXduAePjHSOhzE/moUeA4RWQkUt3TekWuCZlgpF1Dowfi15RUfyvywuU4mfNVkj+gd5FNituVsJmVd/WWsXeK5+E4tcw4xKvf+jm9E6lumDYW6dDbyD4vilPnnEryh/AisqmLfQhST8CyQ5mFrIbkoTiR49QSPYAvEeeZPSjF8+jgECRnQdJJwFfTFu44AD8l+cM3IW3RiBPQWQFau2tX47W9HSc2Q4BzsH9+L0GKGaXJWJKnFG8FvpiybqfO+SHJZ65ZhPmNAV4N0FupTSMf5Ukdp57YD3n2LJ/llxBn4DRZl+Tn0YasjjhOdE4i2c3aAnwhddVwFLapfNuQN5EBaZ6E4zj/ox9SkTNp9FHntgg4Ps2TAFYn+YtJG/D1lHU7dcbnSObw10T6Mf49kU7C8k3hVcQxyXGc7NkeeAHbZ/wc0i3BvRLwXELNbfh2gBOJ40nmubqE9J1thmObZrQJmUz0SfMkHMfpll6IU7JlOG/adUgGA48m1NyCJGRzHDMORRJQhN6UC4E9Uta8A5J9z6ozeA4v0+s4eWcTkr9Jd25vIYWL0mIFpEBY0hcV90tyTDiIZOl955DuAwQSimdVxKdjr79fqmfgOE4oyyErdRbV+ErIy8+pKervB9yRUPMivHaAk5BdSbakNoN0vWr7IuE8VrP/GXhCH8cpKvsgz7BVf3ARMrlIg+WAmxPq/QCvIugEsjFyA4XefLOAjVLUO5TkS2ed222ku//nOI49w4EbsOsXHgFWTEl7LyS/SBK97wEbpKTXqRFGkWz//H3SnXmujV18/yIkVadX7XOc2uE47MKAXwfWT0l3D5JPAt5EQg0dp1uGIgkxQm+2ecA2KerdBfEzsHiwnyS9B9txnHTZAHgKm75iNrBTSrp7IYXFkuidhEQZOE5Z+pJsGf1D0nU8ORy7kqGXkE2tcMdx0qMPdqnAlwDHpKS7N/CfhHrvxUOYnTL0AP5F+M21CHEaTIuTsSkTugRPnuE49cZxJC/GU0L6oAkpae6H5CZIovcKfHvT6YLzSDaI7pWSzp7A3xNo7dzeArZNSbfjOPlic2AKNn3JhaSTOXAQslWZROuEFHQ6BeK7hN9MTcABKelcAZiYQGvnNhEYlpJux3HyyXDgTmz6lNuBgSloHkay1MdtwAkp6HQKwAGEJ8xoBQ5LSadFmsyOm/8sZCXBcRynB/JWbJE46AnSebFYBXgtgc4mYPcUdDo5ZhNgPuE3UVrVpywKZZSQc01rwuI4TrE4AJhL8n7mRWDVFPSuQbJSwnNJv/yxkxNWJNn+129S0mlRKrOEnOuGKWl2HKeYbARMJXl/8wowMgW96yJJ10J1vg4MSUGnkyN6ISEhoTfNlUBjCjrXRG7QpA/jY8gqguM4TnesjPQZSfudaUiSsthsg4Rgh+q8E98SrSvOJfxmuZd0Ykk3AN5OoLOjXY8X8nEcR0d/4N8k739mkE4V0cNJ5sPw+xQ0OjngFMJvkucRT/zYbI7ksE768J2FOPg4juNo6YFN0qD3SSc76vcS6jw2BY1OhuyKlLYMuTneIZ180lsjD0ySG7kFOCkFrY7j1D4nI31Kkj7pA2BsClr/kkDjYqT/dWqQVYDphN0Y84BNU9A4FlgQqLGjfQh8OgWtjuPUDweRbJ+9hPRt20fW2YNk1Q/fIZ0IBidFegMPE3ZDNAG7paBxC5KVHy4B7+IzWMdx4rANMJPkKwGbR9Y5AHg6gcb7SSeroZMSSZaFvpaCvvWQwTvJgzUdCeFxHMeJxXpICvEkfdUs4vdVqyJlgEM1ulNgjXAU4TfBxSnoWxtZdkryQE0B1kpBq+M4zhoky8JXQl541ouscyPCExu1AQdH1udEZhNgIWE3wH+JH+63GsmLcbzc/j2O4zhpsTISFZWk73oTGBVZ54GEV02dg0x2nAIygPAMetOJ7wiyIvBSoL6O9gLi3Og4jpM2K5Jsr72ErCTE7sN+nkDfI7g/QCG5lLAfvAnYKbK2pNWsSsDjwNDIOh3HcSoxiHAH6472HHH7skbg1gT6fhdRW6Y0ZC0gEkcAVwUeeyJwnqGWZVkBuAvYMsF33IcU7lhgoqg8PZAqhGmU+FyIFCtakoItx3HsGADcBOyS4DueQKrzzTdR9EkGIy9NIb5SJeAQJDOik3NGI3H7ITO9P0fW1guYGKito91OnNS+DUgI4U+BW5AUnkl0hrQ2JH/4LUhWL49qcJxi0A/pm5L2bTGX28cQnstgDvH9FZyE9EL2bEJ+4PuIv9fz90BtHe0hJEe3JYOBH5PcGTFWewr4HJLLwXGc/NIXuIdkz/sFkTUel0DbQ3hq9VzzS8J+2PeI7/T3f4HaOtojyFKbFcshb/uhqyVpt2lIwQ/HcfJLf+ABkj3rP4is8a8JtP0wsjYnkJ0Jy1fdBuwfWduRhIeilIBnsa1ZvTNSrzvrQT2k3Yg7PzpOnlkBeJLwZ7wN+ExEfb2QbH8h2prxbKu5Ywjh2anOiKxtJ8SxLfRheBWJubXiG4QXRMpLe5N0Sow6jhPGcGAS4c/4UqR4WyxGEO7nNAlZQXVywuWE/ZCxYzzXJ1llv2nYJqI4M4GWvLUPiF9YxHGccEYArxP+jL9P3GyBuwOtgdr+GFGXo+BAwn7AucCaEXUNI1m6zLeRiAYrfpVAS17bXMSz13GcfLI6MJXwZ/wNJOFQLH4bqKsN2CeiLqcKhhFeROeoiLr6Eh6NUEIqblnOfL+cQEve22Rkz9FxnHyyPsmqCD5MvCX3XsBjgbreRqKonIy4krAf7u+RdV0UqKsELAK2M9SyUft3Zj1Qx2yXm10tx3FisBXhdVlKSGbXWGxAeH6AmLqcCnyasB/sBeIk0ungG4G6Ssh+lGUFqh4kz9VdlLan0TVzHCcO+xMWqdXRvhxR21cS6Dowoi6nC4YTtqS0iLjZ5bZHvFdDb6STjPWckEBL0dpz1G5qa8epFb5F+DPeBOwYUdsNgbrexDZHS2oUtcO8mrCkMN8B/mCspYOVkNjXEYHHn4k8HFb0QWL910j4PU1IdcS2xIrK0wO5fkn3+Q5EcpI7jpNfziL8ZWcGUkdlhp2c/zEMeZEIqU74Z+xf4JwuOJiwWVrMNI69kFTCoTPbmyNoG59Az1TgNCRKotFYVyU2RbxyQ30WbklRq+M4YTQC1xPePz1IvPDtvQlL2tYKjI2kyWmnP2EhJYuBDSPq+lOApo72BPb5/UEmFSF6/kb2SS7WBJ5Br70Z2R5yHCffJI2Uilmi94+Bml5CVl6dSPyBsB/mOxE1HR2oqYQU4LHM8tfBYMKy/X03gpZQBhKWSWx8FmIdx1GzMslyBMR61vsAzwdq+kkkTXXPJsh+tPYHeZh4S/9JykvOJ96qxL4Beq6MpCUJG6P3Gv5rJkodxwlhI6QvDOlDFxDPqXsbwiIWlkbUVLc0ErZctIh4qSSXR/L0h9y4bcAhkXQB/EypZynhzouxuQzdudyTjUzHcQI5jPBiaS8RL6z7rEBND1JcB/tcEhqjaelVvyznB2oqIWl5Y3KtUk+ek1lo8z28mY1Mx3EScAbh/enfImnqj6QiDtF0XCRNdcdKwBz0P0DMpf/QSIQScGdEXR1oS10eH1lPEkahO5f5mah0HCcJjcBthPern46k61OBet7FU5SboF0CLiFe/+tG0jMCmB2gqYRU90vDS13rPGeZetiafujOJWa+Asdx4jGE8DfuWYTF71dDyBhUAn4fSU/dsD1he0MTIulpRN7gQ26GxcDWkXQti9aDdfOUdIWwHPpr7ThOMdmc8DwgdxBn730oYZlnmxHndSeARsKqNE0mXhz7dwP0dLTPR9LUFVqHyTznsvYJgOPUF58hvJ/9Zs403RlJT81zAmEXfP9IejYnPM9/7OqDy3KrUt/PUtanwScAjlN/nEdYX7sEySgag5sCNcWM+KpJlgfeQX+h/x1JTz/gxQA9JaQ+QNrZoX6r1PgW8R0TQ/EJgOPUH30Ir2T6ApJp0Jo1kNwDWj1vEifba83yc/QX+UPEYzwGZwfo6dC0fiRNlTguQGtew1Z8ApBvhiOrY1u2ty2QPVPHScoGhCda+3MkTd8L1PN/kfTUHCMJ+9F/FEnPLoQnqYhZv7oSa6DXPId4kRNJ8AlAfugD7Imk5H4GWEj532A6MBFxyB2TgVanNvgqYX1vG7BbBD29kSqrWj0LiJP2vea4Ev3FfY04jn9927875Aa8lWyzQT1RRlel9h6wexZiK+ATgOwZjRS8Cln+7GivAt+noHXTnUy5gbB77hXijAva5GQd7S8RtNQUYwl72947kp7Q7FQzkQRGWXIqYdqbkUpba6YvuUt8ApAdqwH/JCwnerk2G/gB8dK3OrXHcGRFKeR++0UkTRMDtDQB60TSUxPch/6iXhtJy6aEFR9qA/aLpEnDEMKLbJSQ+tb3I8V1JgBfAg5AthfSxCcA6dMAnAjMw27gX7a9DuyY1gk5hWcvwl4Om4mT52RjwiquXh1BS02wD/qLuRRYK4KWnoQtoZeQWtJ5QRsNUG17CnmLSyPVpU8A0mUA+jDS0NaMOEd54RSnGs4k7D57jDhRTn8J0NKGJLhzOtEAPEp+BtvQ5fNY4SehDCMsg1W1bRZwEpK0KRY+AUiPVZGw1TQG/87tEmTS7TiV6IM4n4bcY9+OoGcwYWnh74ugpdAchv4izgdWjKBlbcJSUS4ln2kfxxO/A/8P8VYDfAKQDiOQWhVpD/4d7WqgV/SzdIrOJoQlZFuIOLNac1KAlhL52CbOBT0IS7LzwwhaGghz7igBP4mgx4rQYhaa9gLid2CNTwDi04+wFTjrdlbsE3VqggmE3V93Y7/d1Iuw8evZCFoKyQnoL947xMms9PkALSWk+l7a2f409EZu/tgd+P3ttizxCUBcGpAMmlkP/h3tM3FP16kB+qCveNrRjo+gZ/dALXWfIrg3MAX9hTsxgpZByJ62VksrsEMEPdYMJZ393V8b6/YJQFyOJ/tBv3NbhIdKOd2zLWHhqTOJs115e4CWZ6jzVYCQLE8vEcdh6I8BWkpIgpSisDzxPbyXYrvX5hOAeAxFkj9lPegv226MedJOzfBnwu6v30TQsm2gloMjaCkEvYCp6C/YQRG0rE9YzP80ipfZrBfwS8JiWKttFxrq9QlAPM4h+W/djCzH3oeEh4Z4RXfVYiX3cmqH/sAb6O+tpcRJex5SLfBp6nQV4HPoL9YjxLlYoW/FB0bQkhbbEh5S012bj51PhE8A4jAcWEz4b3w3Er2zfBffvQYS3z81wfc/aXq2Tq3yKcLurxiVYzdBtoS1Wj4dQUuu6QG8jP5C7RRByx4BOkqIZ33RaUAcUZ7CfhKwr5FGnwDE4ceE/a7vUX2H1RdJ3hLSKZYohm+Nkz3/JOz+irHKdG2Ajqeos1WAkNj0uyPoCA3hmIW8QdUSmyBbA08Sth2ybPuVkS6fANjTA4mk0V7XVwkruX0oYQ5blltJTu2yImFbT89j70+2EWET3iKvJqtoIGzpOUaVum8G6CgBX4ygJU/0AbZG3vROQDIjTkV3jS420uITAHv2RH9NZ5Ms7fYXA2zOIk4KV6f2+DJhffnXImi5PEDH4xGyoKNBAAAgAElEQVR05JL90V+cRyLoGELYrPFp6rNT0pbAnGhk1ycA9lyI/ppaxOeH5BvYzsCuU/v0IOzFcg4SDWPJOoQ5WY8z1pFLHkR/YWKkTTw7QEcJ2CWCliKwA7rr9KCRXZ8A2LIcMBfd9Xwemz3K9dB3jN8wsOvUB7sS1qfHyEB5UYCOmyLoyBXj0F+UGA4Sa+OlHLX4BKA2OBT99fySof07lbbPN7Tt1D7Xob+/m7CvE7Amel+qNmADYx254gb0P86hEXSE5MZfTJgDVK3gE4DaQNtBLsV2ifQ0pf3bDW07tc+ahIW3XhRBy7kBOs6LoCMXrI3eO/JF7EvNrkuYR/IvjHUUDZ8AFJ+B6DvHG4w17Ka0/4yxfaf2+TX6PqMFSQhnybrox7wlwMrGOnLBWeh/lKMj6Lg6QMcMpPOsZ3wCUHw+i/5ajjfWMFZp/wVj+07tszxhYa6XR9AS4vj6swg6MmUAesejydjHaIZmavIKZT4BqAW0BUsWIKWCLdHmTPcJgBPCCej7jVZgjLGOnQJ0vE+careZcTL6ixAj1j5kNvYYdZalqQw+ASg2K6J3fL00gg7tKsR9ETQ4tU8j8AT6vuPaCFoeCdDxlQg6MqEReZvXnPwc7N88tkS8LLU/xB7GOoqKTwCKzUnor2OM8Nu/KzXUc+SNk4y90d/zbUgSNEsOD9AxiRp58dQmkCkBp0fQ8Z8AHVaDWC3gE4Bio30LmYWkyrakAX31tgnGGpz64j70/Yd1Oeoe6F+CS8SpfZM6d6E76RakmpglWsejjjbOWEeR8QlAcRmNfvXr7Ag6Qp7DuquU5pgSsgdfwj4D5TcCNMRwSkyVddF3PNdF0DFRqaGEXSrbWsEnAMXlR+iv4Y4RdPxFqaEF+zStTv2hfQktISvGlvRDn3p+KbCSsY5U+S36Cz/OWMOmARpKeA7yZfEJQHF5Ad31m4b9/mNP4F2ljnuNNTj1SegK8GbGOn4RoOH7xhpSozcwE93JvoB9xxNSmelmYw21gE8Aislm6K9fDB+cfQJ0nBRBh1OfhPiAWVU07WBF9Im4plHQ4nMhno8nGmtYjbB8zNZeoLWATwCKyRnor9+mEXRcrNTQQo1mRHMyISQKrAkYaazjUqWGEnGicaJzB7qTfB/70L/fKzWUiOODUAv4BKB4NABT0F27FyPoCKlA6DUAHGtC8sCcYaxhlwANhasSuCb6jHvWF3oFYJ5SQxuSLdD5JD4BKB47o792P4yg44gAHSdE0OHUN5uiXwX4AMlka8mLSg0twCrGGgD7QjsdfF753W1IghBLTkSfv/8WpPa549QCRwUcc5W5Cr2OJcjbmuNY8ixwm/KYQdhnpb1Q+fkewDHGGqLRE3gb3QznLmMNvRDnCe1bxzhjHbWErwAUi57onXAfjqBjEDKga3TESMfqOAC7o+9P3sI2KdYw9M9EYWpi7If+Ah9nrOEzARqeMNZQa/gEoFiEPIffiKDjCwE6Do2gw3E6eBL9PRmymlaJkKq0mxtriMIV6E5qAVK+0ZKnlBpKwJHGGmoNnwAUi8vQXbNYXvfaJCzzgL4RdDhOB8eg71OeMdawV4CGPxprMKc/MqBrTuoCYw27KO2XkO0C69LDtYZPAIpDP/TPYQyv+1WQiYVGh3Z/1HG0hG4RW+bmb0BfH2AmxvU5rJ0AD0L/Nm+dbCEkl8CZSEflOLXAp9E/h/+MoONI9ElMYuhwnM40A38KOM7SGbAEXKQ8ZkWkwmFuuRndjGYKtpn/hqDPtDQPCRl0KuMrAMXhRnTXazFxnoHHlDpm4itxTjoMQEL8NPfnImCwoYaV0Sequ8bQvukKwDBkX0PDP7DtsD+DDBga/o5MAhynFhiM/i3hZuyfgbWArZTHXImvxDnpsAA4T3lMX2zD8d5FX3ToAPTh7anwVXQzmTakTKkl2qInTUi6YKd7fAWgGJyI/nodEkHHTwJ0eAEuJ01CUsU/a6zhMKX9EnCssQYTHkB3Encb2w+p+GS6nFLj+ASgGNyD7lrF8rqfpNTxOvaFwBynO65F379sY2g/xGH3ekP7JqyBPsXi8cYaLlLaL6HfsqhnfAKQf1YlH173Wyg1lICfR9DhON2xN/p7Vbt10B3a0PnF2KcnTsS30Z1AE7bOFCsAC5Ua3iBeKuRaxCcA+ecU9Ndqzwg6fhugY6MIOhynOxrRF8xagO0+/EFK+yVylrfmPnTibzG2r/U/KBGn6Ekt4xOA/KPNcBbD674RSZ2q0WGdZMVxNPwYfR9jGRLYB321zNykyx6KxFVqxH/BWIM2818zMMJYQ63jE4B8sx7663RmBB3jAnScGkGH41TLCPRbZ48Za7hEaf9DJPFe5nwOnfAWJKGBFZsp7ZeAGwzt1ws+Acg3E9Bfp20j6DhHqaENGBVBh+No0ObOKAEbG9oPqd1xuKH9YP6NTvS9xvZPV9ovIRfb0eETgHzzCrprNBl7r/tewGyljvuNNThOCAei72csHVd7A3OU9mOU7lbRD1mK0Ii2rjimzaf8Fvr0pI5PAPLM1mTbeXUQ0ol+JYIOx9ESUsZ+srGGC5T255GwNkBSL/h9kElAtZSQFQMrtkYyjmm4EGg11OA4WRNSqvRKcxV6HS3AdRF0OI6WFiQzrYa1kC1oK65Wfn4g8mKWGRejm7E8YmxfG27k+43h+ApAPmlE/+bydAQdIZVAb46gw3FCGY0+n82vDe33RCJzNPbPSGIwyQpAD/R76ZYZjBrQO0E8Akw11OA4WbMr+oiWGBX3QiqBeuU/J0+8ATyuPGY8dr40LehrAyTyZ0syAdgKCQHUYDkB2B7JQKhBu8TiOHlHu+xeIs5zoNWxCI/GcfKH9tlYE33Rq0rcpvz8RujHQRN+hG6pYpKx/bOU9lvx2P8k+BZA/ugNvI/u2twXQccQYKlSh7/9O3lkJPptgN8Z2h+CPifBl0ONJVkB0ObRvz2BrWVpBA5VHvMQ8I6hBsfJmn2RDkNDjIF3PDIZyVqH4yTlLeC/ymOOwG4bYA76JEOfCjUWOgEYgL5058RAW12xI/q3+cxjJh3HmBCv+3/lQMcH2L4QOI4l2rFiJLalrLV+ALsjK6WpcQC6JYql2KYt/JPSfguwiqH9esS3APLFAPQ5OGJ43Y9Ettc0Os6JoMNxrFgV/T39B0P7Wyltl4A9QgyFrgBol/8fQjorK/ZVfv5+YIahfcfJmoPR5eCAOMvuR6HvR3z538kz09G/wGjHpEo8BbynPGZciKG0JgCWy//rok/+48v/Tq2RF697rY7pwAMRdDiOJdoxYz3041I52oA7lMfsamS7W9ZAvzxhGSZxstJ2M7bFh+oV3wLID8PRV+C8IoKO9ZUaSth6TDtOLEKesa8a2j9aabsZ2RZUEbICsJvy8+8jSxpW7KP8/MPol1McJ88cgWQN0xBj2f2YgGN8+d8pArPQZ64N9sbvgjvQpazvCYzVGgmZAOyk/PydyJKGBX2BXZTHaD0qHSfv5MXrfrzy85OBJyPocJwYaJPy7Ar0MbI9G3hCecw4rZGQCYC2+MCdATbKsSsyCdDgEwCnllgd/Uz/GqDJWMe2wDrKYy4z1uA4MdGOHf3RvyBXIrofgHYCsBLihKfBcgKgXWKZATxnaN9xsuYY9ElHYnn/a/Hlf6dIPI0+esxyG0DrR7UlUiEwGoegc0x4w9j+a0r7Fxjbr2fcCTAfPIfuWryDFO6ypLH9ezU6tEVWHCcP/APdff6ioe2B6NMCq8IRtSsAOyo//7Dy85VYB1hbeYwv/zu1xIbAJspjrkDnTFQNuyPJUjT4279TRLRjyAZIWWEL5gPPK49RbdHHngBovSgrofX+b8F2+8FxsubYgGPysPzfhuficIrJRPQTaG2enEo8pPz8toa2P0Z/xJFIsxxhGf9/vdL2/Ya2Hd8CyJoGZEtNcx1eiqBjOSSqQKPjrgg6HCctHkJ3v1tOdo9S2p6P4sVeswKwPdBL8fnF2DngNaD3fNaGcDhOntkeqT2uIcbb/37AoBzocJy00I4l2pXySmhfZAcgWQmrQjMB0C4tPIVd6NHa6LP5+QTAqSVCvO6vNFeh19FEnAqEjpMWWj+AVdFP1svxDvCm8piqx2rNBGALpQhLB0DtjOoD4BlD+46TJT2Bw5XHPA68aqxjIPqiJ7ciNc4dp6g8hYwpGrT5cioRzQ9AMwHYUinC0gFQezEfxi77oONkzR5IDg4NMZbdD0GfiMuX/52i0wY8qjympiYAQ5AMZBq0F6wS2oupvWCOk2dCvO6vzoGOD4FbIuhwnLTRjilZTgA2QZz2zdgdnSeids+iEkORDk1jf2dD+47gUQDZsBwwF935xwh/XRF9dbRLIuhwnCwYh+7eb0VenC3oAcxT2q9q27zaFQBtOJ/l/v9YdKlPm9EXUXCcvHIAsILymBjL7keSjwqEjpMFj6Jzam/ELia/FX1F3U2r+VC1E4DNlMYty/9ql1KeAhYZ2necLAnxur8+Bzpm4Ym4nNphMfCs8hjLbQCtU3tVGUOrnQBoHQBfUH6+Er7/79QrA9EXF4nhdT8a/dvM1chqnOPUCtptTcsJwNPKz4+p5kPVTAAGAmspjVtNAHqR7faD42TJ4YgPgIZYqX/zUIHQcbJE+3K5Dfpts3JoJwCboH9mu2QsOueDeVaGkVmM1gFsFSPbzsdxJ8D0uRPdec8H+kXQ8bxSxzTs+gDHyQsroe+LNjKy3RPZhtDY7rYoUTUrAOsrhU7CrhOuahmjE5PR1292nDyyMuJ5rOF67P1fNgU2Vh5zBbU1EXMcgJnA68pjtGNYOVrQr6x3a7uaCcAGSqPa8oWV0JY+9ZrjTq1wJBL+oyEPlf/Al/+d2kU7xmjHsEpoJwDd2o4xAZik/HwltLMny8mH42RJHrzuG4DxymNewq4ImOPkDe0YYzkBeNHadjUTgKorC7VjGQGgnQB4x+PUAmsBWyuPuRpZJrRkR2CU8pjLjDU4Tp7QTgCstgBA/3Ld7dZddxOA5dBXNbKaAAxBqipp8AmAUwscQz687rWrEKVIOhwnL2jHmNWBwUa2tROA0ei3ET+G1gt/VhJjy7Cr0vYHuOdxTDwKID06HGmz9LrviTg9aXR4Dg6n1mlAxhrNc2GVmr4BifTR2B5V6Qu7WwHQRgBY7sFrl06epTY6f6e+2QLYUHnM5djf+3sh+f81+Nu/U+uUiOCMp7D9svKYtSv9o/UE4CXl5yuhvWjuAOjUAnnxutfqaAWuiaDDcfKGdhvA0hHwNeXnE00A1lEam6r8fCU8AsCpNxqQ7H8aXsT+3u8HHKQ85k5ky8Bxap0sHQEnKz+faAIwSmlsmvLz5WhAvwzqDoBO0dkZWEN5TAyv+wOB5ZXH+PK/Uy9oxxptIq1KaBMRVUzj390EQNsZTVV+vhwrAf0Vn2/DNvzQcbIgxOv+yhzoWAL8O4IOx8kjHamxq2UAMMzIdmorAD3R59W3WgEYpfz8m8BCI9uOkwW9gMOUx/wXmGKsYzCwt/KYm5AaII5TDywA3lIe021e/irRTgDWosI4X2kCsBq6SkZLgPcUn6+ENveAdSfoOGmzDzBUeUyMZffDgD450OE4eWaq8vOjjOy+h0xAqqUvUlekSypNALTL/9OwC0XyCYBTb2iX3VuI43Wv1TEfuC2CDsfJM9oxZ5Shbe1K+4hy/1BpArC60ojV8j/oL9ZUQ9uOkzb9gAOUx8Twul8VfdKSa5EypY5TT0xVfl77UlsJ7fZD2QlApSX+rBwAwVcAnPriIPLhdX8U+ahAWFQGIX3XKGQLtR/iANYbWAHJatm3/bOLgKVAM5JBdTYyoZuJlzUvAlmuALyp/HwqEwBfAXCcMEK87m/IgY53gXsi6Mg7yyPFmsYimRs7Bn2rnO8gTs2TkTwPj7e3p5GJg5M9U5WfL9wKgDYCQDsrKUcjMFJ5jK8AOEVlCJJ2V0MMr/u1gS2Vx1yJZACsdVYA9kXqYYxFMrtpHKRDWB7YrL0d3f7/WoBHgTva2+PUx/XPI9oxZw0kv42Fn5x2AqAtqgfALeiKDuwQYqQLRirtLqW6ssZOMrwYUBy+jP78Do6gY0KAjm0i6MgLg4DjkMnWEvTXJo02B7gE8R9JVPXNUdMDaEL3e2lfqsuhLZQ3McTIbxUGWpC9Lgt2UtgtAa8a2XUq4xOAONyH7tzmIdfEmpeVOiZTe9U3ewJHALei79yzbm8CP6ZCyJdjzuvofqOxRnY3UNp9McTIlgoDllnAjlXYLQG3G9p2yuMTAHtGIku4mnM7P4KOrZQaSsDPIujIioHAt5Fl3awH8qRtKVIdcjPTK+R0xUR0v83RXX+NmqFKu2W3CystnT8J/KMKMYuAU6v4XLVoUyZaOh86TpociX77Kg+V/wCuMleRPiOB3yN7qr/H1lM7K3ojA81TwHXYVqJzPo527BluZHcOEj1SLQORiJRP0F3n82UqexvPRQqHvKIQ0x3ai/SuoW3HSZMQr/t7jTU0AuOVxzwNTDLWkSb9gJ8i/da3kQ6y1mgADgGeQfwEfGvAHm0eDm2mz3KU0Gfd7TJCpbsJwFLE4eho4H7EGQZk5vMnpMrRXUoh3aG9SO8b23ecNFgf2Fx5TAyv+3FUCBMqQ5Fj/w9AJi//x0cx+bVMI/AZxGdjArJC4NigHXusJgCgnwAM6ep/VhPKUkIe+LQeeu0WwOwoKhwnLiH7gXlY/i8BV0fQEZsxwNnYRSsVjf7AT4D9ET+rl7OVUxNoxx6rioCgX33ocgKQx/A57UXyFQCniByp/PzrSNy3Jb3RhxTeT7H8bhqAE5HKifU6+HdmS2QL51Ty2f8XCe3YYzkB+ED5+cJMALTLJL4C4BSNbYF1lMdcjn2Ew6fIRwXCWAwHbgTOoYwTVJ2yHHA64iRoFb5dj2jHHsstAO0EoEsfgNjZrELwFQCn1smL171WRzMyaBSBPRDnN6vkK9WwCEkROxVZJXkHqZa4FAnFauHjIVm9kEGho41G6revg+1gUY6DgEfa/3wtBXu1RpYrAHOVnw/2AUibLoVWwFcAnCLRCBymPOYpApN5VKA/sh+s4XaK8bx9AziTuCuc85EtmUeQ9LxPYFvAZ3Wk3sC2wO5IXH+M89kQeAyJGLgnwvfXMlmuAGgnAJZ1KqIxEH3Si1rLRpZXPBGQDXugP59TIuj4TIAOq0QmsWgAfk28JDuTgTOQFMhpb58OQ5z3bkL6PetzWwx8OrWzqQ0a0GeM7G9k+4tKu39LarCROClIOzMa3UlNj6zH+QifANhwAbpzaUNfmbMablXq+BB9yeI06QVcjP3A+B7wK/KVWW8w8FXgeWzPtRmpf+BUz0x019jqWT5MaffyECPLIYkynuv0RW8gDiQxlhS0KUmfj6DB6RqfACSnD+K8ozmXeyPoGIb+zSWoA0mJ5YHbsB0Mnwc+T/yXnqTsDNyM3Xm3oo9QqWcmobu+WxjZ3VdpV+27sxKSDrjcF74DbJrwJJZFWwjoAWP7Tnl8ApCcQ9Cfy5ci6PhqgA6tv0Ba9AXuxm4AfBopz1y0rcUtke0Bi2vQBOyXrvzC8hC6a2sVijpOafdWzZf3QJxbuvvSt7H1bNTuj95paNupjE8AknMN+o44hjf4A0odc8hnBrle2L39zkT2VfMYGq3hU4hHf9LrsQi76nW1zD3oruuuRna3Udq9p6svKXezH4N4n3bHCOB7GtXdoO1klhradpyYDED/VnUb9mGuq6N/C7kamYzkiQbgUpK/qbYBfwTWBc5r/+8i8x+kANDvSHYufYF/IQWTnPJox6A+RnYXKT/f5VZWuQmAZg/Icr9Ie3Hy1ik5TjkOQZ97PkbSnaPRL2/nMfnPBPRFjJZlOrLc/20qlEwtIEuA7yLhg28n+J6VkFLvnkSpPNoJgNVKmnYC0GXfU24CsIHii0diF9qgvTg+AXCKgjbpziJkTzdrHdPJn6/NeODHCb/jZsSz37qYWZ64F3GsTrIdtwXwVxM1tYl2DMpqBUA1AdCG+1jNEH0LwKlFhiNvYxr+DSw01rEBUhRHw+Xka1l8DHAR4U56JeA0pIz5LCtROWYmcu9dlOA7TgAON1FTe2S1AtCs/LxqAqDNEGhVotS3AJxa5Ej0z1SMZfdjAo7J0/J/f6QkcmgZ3xbE0e908u0sak0TEtL4mwTfcS7iP+J8nKxWALRjrsoHQNtZtSg/Xw5fAXBqEe2y+xzgjgg6tHvmLyNhcXnhz+i2JzuzEAllvMBOTqEoIRUAfxZ4/CDg73ZyaoasVgC0Y26vrv5nuQlAD+WXW60AuA+AU2usAWynPCaG1/32wNrKY/L09n8I8NnAY+cBuyG1DOqdnwBnBR77KeBQQy21QFZRANoxt8sVr7ytAGgvjq8AOHnnGPLhdR9SgfBKcxVhDAL+EnjsIiRU8HE7OYXnW4TfY2eS75TQaaOdqGe1AhB1AuArAI7TNdqB9y3skih10AM4QnnMY8CrxjpCOYOwsr4tyMrBQ7ZyCk8J8Ql4MuDY1YAf2sopNEVZAeiScgO99o2lnhxqHKdaxgAbK4+5Enuv+z2QmG4NeVn+3w5x3AvhW2S77N8HqZkyqP3P/sACpJTwfCTEMqu+czFwMFJqWpvN9WSkutyb1qKcaHR5n2nf9GOT1XKK48QgZNk9D8v/bUja4qxpAH5PWMjfeYRvG4SyGbAjEnu/FbA+lf2p5gMvIIWH7kOy+GnrvCfhLaTWhLZQTF/gF3jlQMhu21rrp6dCmzfaSsw3lXb/aGTX6Z6x6H6bh43s9lPazUvMegMwBZ32lyLoWA4ZVDQ6JkbQEcLhhOWxf4b0qvhtAPwUeCVQa+fWjCQm+kKK+kFforqELEFrV7dqkTPRXbeTjez2VdpV5byYp/ji+YlP5SO0Vco8Q1V6bIbut3nNyO4opV3L+zEJO6LvVJNmt+sKbd3wEvC5CDq09CSsqM1CwkMFNeyAhGomGfArtfeQt+wVUziXwe32tBovTUFb3vkbumv2ZSO7yyvtdjkBKOcE+LxCiOaz3ZFVUgWne7QD6whsfp+1lJ/PywQgL173Wh1NSBbCrBmPPmwRxEEtxkpKB1shfgUPAntGtDMcOZdXgK8Td8n3A8KKuh0JrGmspWhklbxOez+UNB8+kepnFpb1yj+jsFsCLjG07VSmN7JEqfl9PmVg9/dKm9Ye9CH0RFKwanQ/EkHHQCQMTqPjXxF0aGlAXiy0b6SPEm+g7A38Cv0zYNWeQiYfsWiguhLwy7bQnAK1wmXorldINs6uGKq0+47my3sC/63iSx+mTIahQMZXYbNzu8rQttM9r6L7fa5PaK8/MENpMw+Z3j6FviO12hvszOcCdOQh5/uB6HW3AJtG0rMp8FyAJuu2BMnLH4uQbas5hKdmrgWuIZvna2WlXfWW7HCkCli5L3wQ+/2pgyvY66olHWAcHZei+33akE4llAlKeyXCQ8YsuQSd5lZky8SaiUod88lHZ347+t/9vEha9gc+DNATs/2ReBFc/w7Qc2wkLUXgRnTX6kAju2sp7T4bYqQRWZa/Dakr/TYSqnIc5f0HkrAvupO6JYIGpzyfRd85vA2sGmBrL+StTmtvdNCZ2bEcOifaEnG87ldGf/3+EUGHlrWQCZFG9wLCEgV1xxfIbsm/u3YVcfrgrQO03B1BR1G4Dd212sfI7sZKuzG2GM3ZA91J3ZmNzLplGBLHqu0gXgbWU9g5CHkb1dp5KsnJGaHdxioRx+v+5AAde0fQoaWjUp+m/TaCjlMCdKTd/hbhvEG/ctSCPtFUrXAPumu1q5HdbZR2CzFJ2wndST2Qjcy65nrCOqu5SDWyfhW+ezXgfGTrIMTGN83OMhztEuoSJFOcNVqHrvfIPjFYI7JipL1+IStMlRhP+D2Ydvu58bkDHBCg48QIOorAQ+iu0w5Gdscp7RZitXwrdCf1QjYy6xrtJG3ZNhcJd/smEqL2GeAHyGpOU4Lv/QBYIeJ5V8NgZEDS6NZmYauGtdAPYH+OoEPLDuh/d+u9/7FImlzrgTpWa8Mm2qYzPdFPxP5jrKEoTEJ3nbYwsqvdLs9DZs9uWRPdSc3IRmbdcy/Zd3zLtgkRz7davoBe92ERdPw4QMfYCDq0aLOqWXaoIH4TIQlxKrVW4A2kGuETSDTB+8Y2pqPP598dv1JqWEy62QvzgvZ+Wd3IrjZLZiFC5gegO6kmwvKEO8nYhGRv69ZtGhIymDV3odMdy+v+BaWOqeTjOZqKTvdjxva1IV3l2gtIEp/dkD6tK1ZGKhVehKxeJbVp/Ya3RYCGXYw15J0G9E6ilbZANXxRaffvRnajo11CzXrZt145A5vOMmlrQ5bDsmYV8uF1v7lSQwn4ZQQdWkaj1/1VQ/vaEOSu7sNrCBsE+wNfQ588atm2U4DtSryhtB8jlXWeGYLu+iwytP09pe3TkxrsAayB5GaPmZbyHXQnlnXYV73SE8kFYTGIJ2m/i32iVfJt9NpjeN3/JkBHHoq6nIBOcyt2oX8D+ag0b0ibioStJmUwYYV5Opq1p/fZSvu3GdvPO+uguz6W5ZO1WzSnhhpaFbkpF3b6sgXAucSJvdVm3No6gganOlZEnx3Qst1C9p7rHTyOTnsMr/uQCoTPGWsIRRv+d5+h7dOUtju3Syi/zB/KVwjfYhtnqEMb0lpvPlnbobs+Txva1k7OvhBiZGsqO6zMArZMcBJdcXcFe101aw9YR8c66D2GLdr95GPfH6RojVb/nyLo2DlAx2kRdITwT3S6rcLf+hPu+PdL4vlOHENYKKJlIadVAuynUb0wL+yP7tpYJvy6Qmn7EK2BYVSXh306shdihdYRp57TUOaFNZAKbKGDubZdTz5S1nbwE/TnsH0EHdrSpG3kp5qbNvnMoUZ2QxImlUinCM4PAnRZ55XQbo3sbmg77xyP7tpYVvvUZiDcpasvqZRK8juIp2p3rIJtApbZys9bh784etYAtS8AACAASURBVKYhman+GdlOK/BTpPNfHNmWhiOUn5+GfWrOXuhDCh9GtgzygDat7RIjuyFZGO9BfD5iczr6rY4+iEOjFdotorxMKNNAO/Zox7ZKaDMvdmm70kOnWTKwjGV+X/n5oYa2nXAWAEcjS5cx9gKfQN6aJyBvrnlhS2BD5TGXI7NyS/ZG3yHFnrBp0P6mFtE/mwNjlMcsQGqhtBrY7442JDpAe20s++MXlZ9fzdB23tGOPdqxrRLarZY5Xf3PShOAtRVfvi4y87RAO0uq1xzUeeUKYH3gR9jMeF9EsgVuizja5Y2jAo6JMfBqdbQA10bQEYp20ridgc3jA475BeLzkhaT0GeL3NbQ/lvKz480tJ13tIOw1QSgAanWq6HLCUAltEVfrJZ+jlHavcPIrmNPX2RV4BZ0JVVnIglSdiNOxTMrGpEOUnO/BpXl7IZ+yJupRsetEXQk4Zfo9L9BsnDkPsgEVWNzFtk4nu6m1FlC/HIsOExp92Yju0XgTnTXJuRloSuGKu0uKPdFlcKQpiMx/9UyEpv9RG2s5CgDm04cFiMrAlcAvRE/gY2RFaPhSPhUMxJiOgN4Bano15HJLu/sgn7JM8bb/6eB5XOgIwnPKD+/JpI74IJAe99Av4T7N2Qimzb3I5MPzVvf5oivSVK0q3ja+7DIaF96LX4P0K96B23J3o9ulnF0iJEuWE1pdyn5fkt0apdz0d2rbcSZsN6o1LGY/GXQHIH+LfddwnKrj0G/YtKGFFnKCm2Vye8Z2dUWaMvjNl0MeqDP1WCVN2dXpd17yn1RpYEzq72f6cigXi29sS8H6jjd0Qt9bO1DSNY4Swajzyh4IzDPWEdS3kFf3XMlJHxQ07FujGx/aN9UHwBeVx5jidYbf6CRXe2KR15yc8RmNaQPqJYlyITVAu2kt+xYbjkBGKH8fDnaAmyPMrLtONXyKfRLyDGW3Y9AJsFZ67DgioBj1kUGx6OonJSnN7Ls/zBhfZV12WEt05Wft5oAaLNVthjZzTujlJ+fit22pnYCUNZptdKPm6X35xR0UQhrInnpHSctQrzutd7cMXTMJb+12y9Fwjy1E5phyOThl0iI5fNI/9WArA7ugEyUQlcK3yf7iAlt3gur9MTa6nV5ys8RE+3+/1RD29qx9p1y/2A5AbCM/5yq/PwoQ9uO0x39gQOUx0xEohssWRV9Bbhr0W2xpcnbSG79oLzlSKf8Izs5/+Mc7BIPpYVVimJtxs16mQCMUn7ewkG+A+0EoOwKQB59AEB/seop+5STPQej3+uMsex+NHoH2Lwu/3fwK/I1iLwD/DprEejvN6vSs9rkUpYlb/NMlisAZlsAlhOA4eiX7soxVfn5UUZ2HacatMvuS4AbcqBjBrZV9GIwBdkGyAunIGGqWaMN/bLSrPWXsF7lyiujlJ/PcgWgrP9IpQnA++hm4o3YOQJqL9ZoI7uO0x3DgD2Vx9wAzDfWsT6whfKYK0knhW1S/gD8N2sRyHaJZQGXJIxSft4qHbe2T9c6KxaVrFYAVkLn39FMhUlZpQlACX3KS6ttgKnKz6+Onder41TicHThP5CP1L+Q/+X/DlqQgk/aVUhLniAsVXAsNlN+XptQrRyjlJ+vhwnAQPQ+b1YrANpcFFOoUEuiu/1D7QNolShjJrr40wZgIyPbjlOJEK/72yLoOFL5+deRQa0ozEAcLS0LqFTLNCS7Yl72swcj+Qs0WOUs0ParZT3Oa4iN0TlZzseuEuA6ys+/Vukfu5sAaFMXaquilaOEPimItqqX42gZiYSUaYjhdb8NEv+u4TKKkV65M88iUQ5pDirPAzuSrzfZseicPZvQV/Hrij7o77OXDezmnU2Vn9eOZZXQvmQnmgBof8z1lZ+vxPPKz29iaNtxuiIvXvchy/9Xm6tIh5eQAfDhFGzd0m4rzWp/1bCj8vMvIpOApKyPLhHQUmCygd28ox1rtFkcK6HJjwPwaqV/7K4z084iN1B+vhLaCYCvADixyYPXfSPih6DhKWzeCLPiTaTw0s+IE48/GyksdAD58Phflv2Vn3/EyO72ys+/Sn1kAtSONdqxrBLaCUDFFYDuWAtd0YFW9IkjyjFOaXsudskvHGdZNkBfrOb3EXTsHqDjlAg6smI0cBUy0Givw7JtAfAX9LHuabIF+vM6wsj2pUq7Iamci0YD8AG666JdwalkW1vEKqRY1v9oRBxhNAat3sSHKO0mPlnHqcAv0N+PW0XQcb5SQyu2WTrzwijgdGTJWXM92hDfgm+Rv4qIXXEm+vNb0cj2FKXtk43s5plR6H+PQRnZXoRBpdxnlEbHJzXYibeUtrVLZY5TLa+huxcTLb2VoTfiFa/RcU8EHXljQ+CLwFlInYP/Ir4DLyDnfwWSW+AwJGFZUeiFRERpfm+r/Ana1d8SsLWR7TxzILprMtXQ9n5K291uPVTj4PEiOq9HSz+A59C9vYwBbja07zgA26Hfe7s8go79kJUxDUWJ/U/CixTbx6Ec+6N/m/+XoW0NHyIvi7VOlg6A2ii7bl9CqlkeeElp1DISQHvxPBLAiUFevO61OpqJU4HQSYdTlZ8vYfd7aycAjyH3W62T5QRAm5PBxPnwUHTLDs9aGG3naKXteghBcdKlB+LNr7kPYyTcGYDeHydG/QEnHUKcPR8wsr0CEtKnsf0DI9t553V018VyS/wJpe1DLYxuqDS6GOk0LdhYabsErGJk23EA9kJ/D34ngo7jAnRoswU6+eEe9L/3CUa2Pxtgux7CsFdGf12stsR7IWOrxrZJZt5eSFIJjeH1LAy329a+9ZjMehynnYvQ3X+xvO7/o9SxEFg+gg4nPmPRDzTz0JcMLsdEpe23qI8Q7MPQXZcP0SVSqsQYpe0FVLHFX40PQDP6vNJW3qDNwOPKY7SpWh2nHMsBByuPuQ/7THLDgT2Ux/ybfCa1cbrn5wHHXICufko5VgF2VR5zCzLo1DraseVR7BIjaSt/PkeFIkAdVBsjqHVksAwHeUj5eZ8AOFbshz5WPIbX/Xj0bxL14P1fixwG7KY8pgUJgbTgWPRbuNcb2c472oQ+Dxra1tYfsHQ+5BR0yw+Webu1sY9NQD9D+079ci36e29oBB0PKXW8j+QMcIpFXyRuXLv8bzXZa0SfWGkmdsvceaY/+q3wvQ3t36e0/SVD2+ysNL4Ifc30cgxG9lU19ncxsu3ULwPJh9f9GshSnkbH2RF0OPH5PfrBvxU7B7x9A+z/ych23tkN/e9ilWmyB1JSWGN/rJFtQJyJtLm3Nze0P0lpu15CUpx4hHhCx/C6Py1Ax04RdDhxGUtYfYMrDTXcGGDfdKDJMT9Gd10skyJtrrTdioQNm/KsUsSJhrbPUdq+xdC2U5/cge6eW4idF3ZnnlPqeBOD/N9OqvRFSq9rB98W9NnhyrEe+pXW16gP73+A29Bdm78a2v6G0nbV+/+ajuIxxWchW0fAsXgn6ISzInpP6Oux8cLuzIboM4/9kyq8f51ccSZhodPnYpcC+Xvo+8yOF7NapxFJB65BO2ZVQuvYblUP4mOcSHZLIGsrbZfQh004Tgcnob/f9o2g41cBOjaLoMOJhza2vKPNwa6M8Qj0mf+WUKzCSknYCv3vs4ahfW1RvM8a2v4fmylFtGC7JDpdad/9AJxQ/ovuXpuFndNrBw3AG0od2rodTrasib62fEc7yVDH7wLsX2poP+9o9/8t84CsobRdwrYg3//ogexzaoRYxuRfp7RtlRfbqS9Gkw+v+x2UGkrAjyLocOLQF3iSsMH/UezSrY9AH+1Son6c/0DC2jXXxjIHxzFK2x8Qcfv7QaUYy5zoX1fabkFfOtVxfoS+M4zhdf+XAB3rRNDhxOFCwgb/pUiNFCvOC9DwiKH9vDMYfXSGpQP8X5W2bzO0/Qm0cao3GdpeU2m7BBxuaN+pD15Ad4/F8LrvCbyr1FFPnXLR0Xp1d26WqzzrIenWtRoONNSQd45Ef33WMLSvjb77iaHtT6C9GPOwzRL1qtL+BYa2ndpH6+dSAk6PoGOfAB0nR9Dh2LMr+oxynSd5lr4m/wrQ8CL1FWH1D3TX5wVD2yugD820zD74CUYoxZTQh09U4iyl7enUT5yqk5wz0N/f2hzd1XCxUkMrsGoEHY4tGyLe+yGD/wJgXUMtewbqOMFQQ95pQO98/jtD+9oXgVZgkKH9LnlJKcrSG/9TStuxOmin9mgApqC7t6xisDuzHDBXqeOOCDocW1YhLM9/RzvaUEsf9KupJaROgHW0S57ZAv012t3Q/s+Vtp8wtF0WrVPCREPbfZFkKxr73ze079QuO6F/2H8YQccRATqixP06ZiyPdM6hg/+Fxnq0YW0d7ShjHXnnh+iuz0JkcmXFY0r7ZxjaLsshSlGLkbcaK25V2r/P0LZTu5yNvkOM4XV/vVLDYlJY9nOC6QHcTPjg/zTy4mPFaMLC/p6ivvb+QULJNdfoRkPbw9Dv/+9jaL8sg9CHRYwztK/N0tYCrGRo36k9eiJlTTX3VYx0m4OQDGsaHddG0OHY8WfCB/85yIBtRSNwT6CWqM5lOWRl9OPcVwztH6u03YSsNKWCdjnrp4a211Hatv5hnNpjP/T3lGUmtg4+H6Dj0Ag6HBu+S/jg34r4PFkSkuK6BNxprKMIaPPOlLCdrF2mtJ1q4rvfKMU9aGz/NaX9e4ztO7WF9mFrQd4QrLlTqWMetsvDjh3j0S/hdm7WqczXQe8/VUISD0VJLZtz7kd3nSzTcDeiX5G0fMnulr2V4pqxrU+sDQdsRbxwHWdZ+iEhVpr76fYIOlZBv+R4UQQdTnL2Qr+V07ldhW34ciP6Aa2jxchzkXdGoJ+8/d7Q/jZK2yVst9m7pR/66lH7G9rfUWm7hGTfcpxlCcn0dUIEHd8K0LFXBB1OMnYlzMmuoz2IrSc5yGpCiJY3sS3oVhS+if5abWto//+Uthdhf890y71Kkeca2m4ApintW29DOLXBDejuo8VIhi5rtCE/M7HNsukkZ1tgPuGD/xRgRWNN2xCeefAQYy1FQVsNdBq2KzZa+zFWJLtFO0t5F9swkj8o7bcBqxvad4rPYPLhdb8W+gqEZ0XQ4YSzGeFZ/krtx25krGkw+heljna9sZaiMBL9s2gZfz8E/Vbg1w3tV812SpElbNMCh9j/lqF9p/iciP4eiuF1r51MWz9LTjLWBWYQPvgvxTaDXAchuf5LwCzqN3T6FPTXa0tD+0cF2F/T0H7VNKLPk/xrQ/shqVu9YprTmXvQ3T+xvO4nKXW8jte4yAujgbcJH/xbiVO1NCSMraONj6CnKDxOts/iJUr7zxvaVnNOGVHlmnXudG04YhsZzZac3LEq+qU265SsEJZv/BcRdDh6RgBvED7QlhCHM2u2IzwKoV6X/iFsK+5XhvZ7AbMztK9m3zKiKjXLilZbBthPNV7SyS0hS317RtDx2wAdG0fQ4ehYEXiZZIN/jBC7lYF3AvXMBIZH0FQUfoH+mo0xtB9S7G6soX01fZBlUY3gU4w1aKtavY3k53bqmyfRd47WXveNwFtKHc8Ya3D0DEZ//yzb/hpBVy+k9kmInjbggAiaikJP9Fs5Lxtr+IfS/mxyMJZdhU60dcrCXyrtl7DNSeAUj7XR3zMxvO7HBeg4NYIOp3oGkayyXwnZ541RWEdbqbVz+20EPUXiQPTXbIKh/d7oo0guNrQfzNHoRLdi62E6Rmm/hMR+O/XLBPT3TAyve60PTRswKoIOpzosBv9riPPW9tkEmh5DBqB65ib0121DQ/shE5AYzqNqBqFPNHGCsQbtclwz4sDj1CevoLtfYnjdhzj83G+swamegUgUUZLB/3biZGzbkXCnvwXY+mUVkRHoHYKtI8ouVdpfjNyTueAOdOJvMbb/ZaX9EvBDYw1OMdga/b3y8wg6DgjQ4VUts2EA8DDJBv+7iRNCujb6iWTndlQETUXjx+iv2+cN7S+H3pfuOkP7ifkaOvHN2G4DDEBf0OUN4uzDOflGm0GyhH2GNoArlBqasU8T63RPP/T5IpZtj2BbDK2DgcALCXR5NkkZA6agu24LsP09D1HaL5GzXA0j0MdPWtdTv1Bpv4QXU6k3GtF7+j4dQUd/9BNW61Uzp3v6IW/uSQb/Z5H0rtb0AiYm0PUQvu8P+sq2JcR3xxKtI/2HwPLGGhLzKLqTeMzY/vZK+yXEIcepH3ZDf498L4KOYwJ0HBtBh1OevsCdJBv8XyLeqs25CXS9jeQLcKS2h/b6bW1ovz+wUGn/akP7ZpyM/kKub6zhOaX9JmA1Yw1OfjkP3f0Ry+v+ZqWOXM74a5jlgNtINvhPJp6jcUjtiI62FHlZcqTv1zqwW+fhGK+0XyJOPZLErIj+Ylo7V52ktF9C0gk7tU9v4H1090YMr/shSCes0fHPCDqcrumDbLckGfynEK/y6BcSavtyJF1FJCQL59eMNWjDDxcgW1O5RPtmMxXb8KpByNuSRsM84tR3d/LFQegf9hhe9yERKwdG0OF8kl7Av0k2wL6JFAiKwX6IM2iotvMi6SoiA4C56K7fIiQLpBUh4YdXGNo35wj0N+WOxhouC9DwbWMNTv7QOtrE8rrXpmqdQ5zYcefj9ACuJNng/zZSUCYGW6PfK+7c7sA+lXWRCakFYp15LyT88CBjDaYsB3yA7oT+ZqxhZ6X9EjANfzhqmQHoV4ZujqBjJJIJU6Pj3Ag6nI/TE3GsSjL4TydeQp31gFkJtL2IrI46Qi9kpUZ7HS1fVkPCD2dTgJeB89GdVIw3nJBCHUcba3Dyw2fQ3w/HRNDxvQAdu0bQ4XxED/RZ2JZtM4mTKwLEUW1qAm2zkWRBzkcci/46Pm6sIST88ExjDVEIeQO39moMCbN6Bvt0r04+uBXdvRDL6/5ppY53yEG1rxqmESnMk2Twf4945ZmHI6GEodqa8AlkVzyF/lpaJ965JkDDpsYaotCAZNnTnNhEYw09kWV97QXezViHkz3D0UenxPC6X1+poQT8LoIOR2gkLHlY5zabeJ3yIPQTxs6tDc8d0RV7oL+WU7DdIl4JfZ/0pKH96Pwc/c26nrGG7yg1lPBsa7WINk11iThe99pnogRsGUGHIy8pZ5Ns8J8LbBVJXz8kBDWJvhgJrGqB/6C/licbawjZCvy6sYaorIM+NfAfjTUMRB/m0YaUF3ZqhwfQ3QNziJMi9TWljlciaHBk8P8LyQf/bSLp641+y2rZZu1YXStshn5c+gD77UDtts5SYJixhuj8F/2Ftk5w8BulhhLwL2MNTnYMR+91b53nG2BbpYYSMCGCDiesT+jcFgI7RdLWA3246rLtBtxvpBw3oL+evzLWMC5AQy5T/3bHcehP9AvGGkagz7pWIt7s3kmXkHtwXAQdZwbosN4Sc+DXJBtcPwR2iaStkbAcJp3bfUgotvNJtkT/9r8UWNVYR8hvvI+xhlRYDvGQ1ZxoDEeHEC9f9wWoDS5G97u/jX2J6B5IjLhGxxPGGhw4nfwO/g0kK+5TQsoCW2apqzVCajtcaKxhFWCJUsObFHhFJ2TGvZ2xhk3Qz/xKxFvmc9JDmw/iDxE0hHgdfyeCjnomxAGzc1sE7B5RX9Jtidexf1OtJcYSdl2tIzx+FaDhNGMNqbI6+lzH1ukWAW5XaighpUCd4tKAFM7Q/OZ7RtChDTVrJV4VuXrkJyQbXJciOfhj8YuE+mYSLwNhrXA3+utqvQrcHwkb1WhYQrxy0qmhdbyIcdJbE7YKMM5Yh5Meg9D91s3Ye/v2QZ8a+25jDfVMSCjwsoP/ARH1fSuhvg8Qz3anPLsRdm2t/cC+GaAhxstw6uyF/sRPjaAjpMTngxF0OOmwKrrfenYEDYcoNZSwd4StV5IOrk3ApyPqC8lP0bktRJa2ncpoi2+VkIqQlvREnxwvxiQkExqAl9Gd+AzsvVm3IGwVIMaysBOfNdH9zm9H0KAtMLMUGBJBR71xMskG1xbgyIj6jkcfnrrsfbJXRH21wj7or20b9qsqRwboKFTmv+4IWf6I8Sb0rwAdj2PvGe7EZwj6TtUy3edAxHlMo8H6zaMe+TphE/2O1oyUNY/Fkej9ojq3JuJkqqw1GgkrChcj5v6RAB3HRdCRGYPQ17KejH34w0aEzbxPMNbhxKcR6cw1v/OGhvaPV9ouEfetsx74PMkG/xbi5s8/EH0O+M6tFTgqor5a4vOE/f4bGOsYF6BjFjWYz+Ec9Bfi8Ag6rgzQ8S7yRucUiynofucfGdq+S2l7AfaZMOuJz5JsWb0N+GJEfXsAixPqOzGivlpiAPrcGyWkLLQ1NwbosM4+mAs2Rj87j5EQZV30b4Y1+6PUONeh+40nA70M7G6ptBur86kXjif54P+liPrGog9JXbZ9N6K+WuMM9Ne3Bfvsm+ujH/OWUMNhwCG5mGM4u2gzxJWQPeK1I2hx4nEa+t85aRW1RqS8tdbuvgnt1itHEDah7zz4fzWivs3Qh4Iu234cUV+tMRp9tr0ScH4ELefnREduCCmKclcEHaMIqxFwbQQtTjw2Rf8bfwhsn8Dm9wNszsJm5aHeSOpQ10bcMqsbAO8n0FdCsgQ61XM9+mvchEQNWTIK/RjTir0PQu64B/0PlKRDLsefAnSU8LDAovEq+t94NmG13r9FmBPan4POrL45jGRv/qX/b+/Mw+0qqzv83pt5hBBIgBASRJkTCDIbsIyCSBkEarUCtYg4FattrdQBsVLaqsggGhyLigIWKSASgiDKIMpkBIJABhJIDIQhgZDx3t0/1t29h2OSe/c37b3P+b3Ps56EkNy9vj1841q/hWUnxWIEbu9eo30dS6MW/cNV9OfLEXxx2WVuiwWmizDQ/0TwYwy28irqyyOETRcTcfk0bp3CGuDj9G9lPh47w3e5TheSci3KCfhF02fEP1P3lfj9Pko/LsIA4PcUv8/PYVlqIXGNMwtdB6ey/I7inWSMrZGPFPQjt5gBQyIsW+AXgLUQGyz25PUd8gisYNTlwHKPn39DjEa3MO/A7fiu0c6N7ONw4EUP/65Di4yifIjq9OU/cvAjxlF3ZXknxW/QtRH8GIit6Iv6sowWKNLQRnwJvwEjt5VY8ZVF+OWbN9ohEdvdahyDW4BXo30ugZ9v9/RxOTaBSGnPALOBm7Eo+pOAzULfmEiMp3ihnQzbMaiK1kxbHS13Unzg7caCCEPjem70wwi+iDiMxjq4EAN2SGuJYh+JOBK/PPoM25ZPgeuxU9VsHXATcCLVPo5w0XbJiDPouqjNPkwbxnqcQfEbNTOSLy5iDRmS5KwTp1B+h9pozwFbRm1x63AYxWWVm+0/Evp7qaevVbTHiCPM5ovrbkuMgDvXejMnR/Cl8gwCFlD8Zh0WwZcdcdtafBpTnRL14ArK70gzbIvwpMhtbRUOobiMeLN9JbHPX/b0t8r2c2BiuFvlxSgsRqdoG2JpurhUnJ1NtXdXouIShHdvJF/+y8GXDEsnFPVgMHAP5Xein4jd0BbhLfgr6F1C+u3VD3r6XHV7nmqcWV+Gm/9fjODLAY6+xCw5XXmG4LYLEOOmjcLKEBf1pQvrqEQ9GAPcR3md5+Xxm9gSHIBfdkVGeXn0uzr6WydbC7wn1A1zYH/cgu1i1XVxUf/8LW149t/MGRS/cY8QPnrT1ZcMeBSbzIh6MAa3Ep0+1g2cjz74/rAv8DJ+9/ublHuvU79fZVgX5VSwHIL1uS4+x5i0uMYhHB3Bl9rRiUVBFr15743kz60OvmTAeZH8EXEYAlxMmo5yNXHLzLYSe+OXQ58B36P8c9UjCJcqWmVbjelhpOQ8R19/HsEX11TyuyP4UluOp/gNnE+cVfcbsHzvov6sAaZE8EfE5a9xO/rpr/0Syw0WfbMnbvncjfYD4uwOuvBVyh+gU9giYGyge9YXU3ATgnoFmBTBn39w8CUjTjB7rXEJzjonki//6OBLhs0Eh0XyScRjMyxy2zfVrLlTfDfa8u8ve2CpkT73/MdUZ/AH24X4NuUP0CksRTnrIbjtFscaK7bEbbfqjgi+1J63UvxGvghsFcGXARSXK87togj+iDRsiYm4LMDt2XdjwUAnISnXIuyKBWf5DEA/obr3/Ezc6o7UybqB6aFu2EZwPbK7jzgTw8sd/VHQ+Ea4meI384pIvkzFreBIN3BsJJ9EOqZhddhvwI6bNvSsX8UEUq7AYlK2L8XTerMzsBi/wed6ql9OeRTwfszXp0gv9duX+VZWzIDbgt2tP+co3GIq1gF7RfBnd9zuWVtU/HNlKsVTO7qA/SL5c0FBX3JbiulTi9ZhMFb/4U3YQD+8XHdagon4SzTfhD0b4ccg7N3+GPA47s9j7wi+bYX7JPHzEfwBt2DxNdg9FpvghxS/sfcQ56x1CLbCc3nxbo7kkxCtwCjcyrc22i0o/TYGg7CKiS559l8N7EsH7lLtjwNDA/sDdsTn4k9qRcpasiNuW++nR/LnENzTeT4YySch6o7LRL/RbkMBt7F5F8X7vmcC+/DhgtfPrYs4MQlDgLkO/ryAlSYX/cBFlncJcRSewL24x0oswEkI0cuR+A3+d6AjmFRcSPHns3Oga++Ge2ZO6J2InH9x9OdjkfxpSUYBz1L8Jv9XJH+G4Sb2kAEPom1KIXI6cP+WMuDXwIjkXrcvIymeoXF6gOsOBR4qeN3cZhNn638SbrUp5qIxoDDvpfiNXgvsEsmf3XGvR66670IYR+E++N+Lqm+WQdHqhiGK7Xyr4DVzW40Fk8dgpqNPJ0byp6XpwGb7RW/2zIg+fdzBn9zOjOiXEHXhJ7h9P/dhgk0iPcdQ7Fld6Xm9DxS8XqN91PPaG+N0R3/ujORPW7AHbrmWsapUdeBW8zmfme4byS8h6sBA3Ir8PIQCqMpkN4o9r596XGs/rK906WNvIU7m1Za4qVSuw+SthQdfo/iNX0a8PPzxuKuWLSSOcqEQdcClZvpsNPiXP1MpvwAAGeVJREFUTdHyxjc6XmccJqHt0rc+B2zteN2++JGjT7Fi0tqKMbjNvq6O6JNL8aLcbqe6kqVCxOQMin0rK4GdynBUvI63Uey5XeVwjQG4V2LtBo5zalnfFD3+yG0x8bLS2o6zcHsIJ0X0aYajTxnwHxH9EqKqfI5i38kPynFTNPGfFHtuFztc40sFr9Fol7o1q09GAPMcfTo5kk9tSScWBFT0ISzBdhBiMAKY4+BTPmN9ZyS/hKgqRaPJ/7kcN0UDwymekv3hgtc4BXextZgVWF31X26N5E9bcwBu0pTfiejTHrjlhWbAClQnXrQXRWtrhEgnE358nuJ9W5Fqd759aCyhtYNwG29WI73/aFxC8QfSjeUex+JE3Gevi4AJEX0TokoUVVGbje3+iXI4nuKD4Kv0vzLjNviV3j7Fr3kbZSjwqKNf50fySeB+JrMAU7SKRdGtzUa7HymbifbAJXj2E6V42t4MwDRPYpa7HQ78xuHn53ahXxM3ycWOPj2B6lNE53DcVtyXRfRpIKZP7voy34R9dEK0MjvgttK7DJic3t22YwIWcO1TpfGEflxnAHC9xzV+QbxMqmNwG1+6gIMj+RSNuparvQJ4f8F/k2GpIj8L7w5gOawPANs5/vsZwNnh3BGikszBXa57OVZVTYRnHP67pPOwQkDr+/h7l+Cu2LcIeDPwvOO/3xRbYcdOLnoClwDnhHVHbIzRmKhO0VnaUuKJRQDsj7uKVYYqRonW53zcvw9Zta0/i7JPePz8mGqqHcANjn7NJ+4Rs9gAb8ftYf2cuDsfZzv6lWHbSDG1C4Qom8lY0a6yBytZWHuQvo8xj8N2B1yvEbOeyocdferGyluLErgSt4f295H9+rajXxlW//rAyP4JUSbfoPwBSxbO1gD7sGn2wTIEXK/hW2BoU+yG9bsufl0e0S/RB5sDz1D8oa0G9oro11DgHge/cltKvLLGQpTNBOBFyh+4ZGHs42yaXXGTc8/tLqxPjcEQrNiUi18LUHnq0jkJt4f3KHFTNsZiaSGuL/0zwBsi+idEmbh+t7Jq2TebH2wT2wNPe/z8uViAYiy+4uhXbH0ZUYCrcHuIX4/s1474zXyfBiZF9lGIsvDRf5eVbz9g0+l4E3DX0s+wqq4xi0EdhbuI29ci+iUKshnuL9qpkX2bDqxy9C3DdhFiZi4IURYd2Blq2QOZrLh9iU2rNG4FPObx81dRTFK4KBOxo1YX3x7DhIxEhTgQN+WqZbjn7veXU3HTlc5NNdFFq9IB/BNu364svb1A35XuNsc0UVyv0Q28p49r+DAEdxXC2PFjwoNP4/ZQf4O9FDE519G33O5DASeidTkYq+xW9gAn27CtB75L3+fxI7CgPZ9rxa4C6VPKva+AR1EinZhMpMuDnZHAP9/tzrtR3QDRugzEpGhdy2zLwtsrWFpzf7KShuEniZ7Rd1ChL+/18O1WVJyq8kzAtvVdHnBReeGiDAJmOvqW20x0/iRan7cA/4mtJl1ztGXFbR2WIfVt7Oiyvwp3w/Hv224mnsY/2Na967v0IhY30FLUtRZAX5wIXOfw79YBh2Ir7ViMBm7DT9LyTkxV65UgHglRfUZgqbUxB4h2ZjTwErAEU2oswijgRuCtHte/D1PUi9WnbYFVXt3B8d+fClwbzh0Rm6/jNtNbRNy8U7AgmQcd/cvtfqxDFEKIstgcuBe/vix2kPMAbPve1T+p/dWQobiXtbwLGBzZP980mQzbqts2sp9CCLEhxgEP49eHpUhz/ncP/35L/ABxEYkpwErcHvxFCfzbDj+hjAx4nPhpjEII0cg2+GdtpBA6OwF3sZ8XsOJVosa8G/cX9IwE/u0IPOvhY4ZpUr8xga9CCDEZeAq/PiuF1PkewMuO/nUBx0T2TyTiItxegpXEqz/dyE7Anxx9zG0J9sILIUQsdsGtAFujPYdV4IvJRPwWVl+I7J9IyEDgdtxf1hSr62lYFK7Ph7UU2C+Br0KI9uMA/GqbZFg6XWwlvVH4xSbcjgUOihZiLO7n7Y8BYxL4eCCWBuPzga3E0iCFECIUJ+Gvx7ACm0TExFdrZQmqvdKy7It7YZ47SBMNug/uQka5dQPnJfBVCNH6nINfLZMM2908MIGv3/TwcQ1wUAIfRYn4SEH+mDTiSdPw32rLgCuQcIoQwo0BwKX490NLSVNA5189/YytBCsqwtdwf0lSBYeECLbJgFtQESEhRDFGADfg3/+kCk4+Ffd0vwz4cgIfRUUYhMnpur4sH0zk52T8020yTBBJWgFCiP6wDaY06tvvLCBNAPV03I92MyxmQDulbcY2mOyvywuzFjgqkZ8TgT86+tn8Me6eyGchRD3ZAxPo8e1v5pBm0bELfjFTczA5Y9GGTAWW4/biLAf2TuTnePwlNzMsw+CURD4LIerF8bgL5zTao9gCKzY74L6Iy7CUxDcl8FNUmEOx6E+XF+h50q2qx+BfdCO3GdgxiBBCDAAuxO8MPbffkaZI2QRgroef65HSn+jhfbi/SItJJ8M7Gv+a27n9AitIJIRoX8bhLpLWbDeTJuA4RCG1DyXwU9SI83F/mRaSrmjEAKw8ZYgPdhHxhTmEENVkb2A+YfqSb5FmV3Ez/AMUL0jgp6gZHcD3cH+pniTNuVdOCHGODFjd87OEEO3Dafgr+2WkFR0bDvza09+rSKPlImrIIGAW7i/XH0hz/pVzMmE+4gy4EhiW0HchRHqGYAJhIfqM1Vi11RQMw/+o4nbSqLmKGjMay5t3fckeIk3dgJwDCaMamGH1vacm9F0IkY5dgQcJ01e8ABycyO9BwI2e/s7Gjg+E6JPtseA+15ftLkxJKxU7EkYrIMMENc5B22RCtBKnAa8Spo94Ctg5kd8DgGs9/Z2HCvyIguyJ5Ym6vnS3AyMT+jsW+JWHv812C2ljGoQQ4dmKMJK+ud1LuuyhwfgP/s+TbrIiWoz9sBKWri/f3aRVmRoKfNfD32ZbAhyd0H8hRDiOxr7hUP3Bt0h3hj4M+JmnvyuA/RP5K1qUg/DbOnuQ9Pn2oSJ8MyzKdwYWgSuEqD5DMWGfEFlCGekzhUbgF4ydYf3fXyT0WbQwR+BXbOIxYNvEPh+An0xms80GpiRtgRCiKFOwbzXUd78Q2Deh/5sD93j6vAZ4e0KfRRtwPFYEyPWlnIdpV6dkS/xn0o22FltZKJVGiGoxCPgktloP9b3/EqtDkopxWBaVj8/rUb0TEYmTsRfM9eV8mnSywTkhdb5zewJtrwlRFQ7CUnhDfd/dwMWkrReyNaaj4uN3F+l0CUSbcjp+Z2tLsJKbqQlV6auxk5iB6SYIIdIzHJvc+yxKmq2MiqGTMCVV3/7orMR+izbl7/F7WZcC05J7bZUL5zj4uylbCBybshFCCN6BfXshv+VHgF1SNqLner6xSt3ARxP7Ldqcf8LvpV0BvC2515ZeczFhjwQy4BrsDE8IEY9xmGx3yG836/mZKcXLwJQEl3n63Y0q+4mSOBu/44D1PT+jDP6ScBLCuS0DPoDFHQghwjEA6yteIOw3u5RydvBC1DHR4C9K5z3AOvxe5IuBztSOY6uJmxz87cvmIAEhIUJxKH71STZmt5I+PRnCVDJdj8VjCVE6p+KXIphhW+hDUzuOaf6fBaws6G9/7EasToEQojgTibPdvwpLGUy96BgIfN3T93zw/5vEvguxSY7FTywow+oHpJQObmR34OF++FjU1mI7HMoWEKJ/jADOw78/2ZA9itU5Sc1I/KV9M0zk56TEvgvRL47CfyX9CJYWUwbDgEsJHyCYYdUVz6Ccow4h6kAn8D7C6vfn1gV8lXJ2GScSRp1wNZb9IERlOQS/AkL5YLl3ascbOIRw5YWb7X7KyX4QosocDTxAnG9uDjA9XVNexzTg2X742Jctx2IhhKg8++FXSjjDdhLek9rxBoZi25Br8P94N2T3AIenaowQFWU6cAdxvrGypbtPwISFfNuxBNgrse9CeDGVMMV4LsKCZ8piCnDfBvwKZXchWWHRfhxI2DodzfYg5e0iDgAuIMxR4pPAG9K6L0QYtsU+RN+P4FekLcrRTCeWKRBiNr8xm0XaqmNClMFULOMn1ne0EovwL0uLYywwsw8f+2uzKSdNUYhghIp+XQTsn9j3ZnbAcodjdV7dwPVYJylEK7En8L/ECbDN7eeUF0AMdt4/bwN+udjtKHNItAiDgO/g/1Gsonzxi44eH/5E3InAzShGQNSfw7GBOebAv5hy44UA/pZwaYtXo5LjogU5hzAdwQxgcGLfm4mZq9xoDwOnkbY0qRA+dALHETd2JsMCdMvW2BjS40OoNpWliipEEk4nTGT9r4AJiX3fEG8k7plmbkuwCceYJK0SojijsEn+08T/Hm6k/OC47YDfEG4yc0ZS74UoicOBl/H/aJ7HivpUgcOIo1febCuwVcL2aZolRJ9sjU1OfVN/+2OPUY06G0dhhYRCtGkZpj0iRNswhTArhW7gMspR+GpmIPBh/Et89sfWAtdiokLaMhSp6cTevWvxrwPSH3seqwZYdqXNIcBXCBfTMAfVCxFtyljC5QI/SnWi57fAVukpOsYMmA98hmociYjWZgL2rs0nzbu9Bhtwy6oR0siuhElrzm0W1WiXEKUxEBP7CfFBvYatEqrCJCxg0bdccn+tC+tUTkFBgyIcncARWKxLynf5GqqxOu7AdvZeI1z7vka5AmdCVIq/JlxJ3p9iuwtVYWfgKvxrgBexZ4AvUH6glKgvOwL/Rhgt+yID//eBNyVoX3/YCriBcO1bDZyZtAVC1IRphNtaXAi8Na37fbIbVt885UQgw45HzqMaqylRbbbDIvnvIm7ufrN1Y5H9ZZTq3RhHE1bvYz7lFjkTovKMJZzaXje2BT8yaQv6Zg9sezNlB9s4GfgkkhgVvWyJSV2nHvRzm0W1BsahWBGhkBP1O4BxKRshRF0ZCHyJcB/fXCxNr2rsT3yVtI1ZF3An8CHKrbMgymE8dq59J+l3pDLsnf8Z1at/cRA2SQ7Zzi9SfvaCELXjXcCrhPsQv0E19bWnAv9NvNLDfdl64NfAudhKrCNuc0UJdGDP9lzsWa+nnHdtDfBdbBesSowCLiXsZOhl4PiUjRCi1dgFeIhwH+VC4JikLeg/47Gz+hcop3PO7TnsiOI0LKVR1JMtsIyQGVhQaJnv1HIsNXa7qC1241isXwjZ3vupTiCjELVmEDYwhpydX0O1MgUaGQX8A7CAcjvtDFsp3g18GtgHiQ5VmU7sGX0ae2ZlrfIbbT7wMaoXhwM2QZpB2PZ2YxMdFfMRIjDHYqvTUB/rYuDEpC0oRl5U5V7K78hzewULFruwx7fNorVe9MVwYDoW1Hkj5e8cNdpD2A5SVXPdTyO8YudSqru7KERLMA4rlRvyw70NU/mqMgdjKYQhxUhC2Dqs6ttFwDsxXXgRh62xe3wRds9TifL0117DYlmmx7oBAdgBmEn4tv8CZdYIkYRObNUTUmp3NXABVua3ymwOfIQ0hYdc7Sngx8CngHcAk2PciBZnMrbD8insXj5F+c91Y/YwllFQZVnbIcC/EE5sLLe1WF+kozEhErMf4TvGRcCpKRvhwZuxM8wVlD8I9GXLscCoKzGhmSOw/PN2ZxT2HE/Dzo5nEfaYK5atwJ7lEeFvSXBOxFKBQ9+DP2KpvKKmKN2p/owGLgFOD/xz7wA+iuUEV51RWMrk+6leXvWmyCdcC7BgsfkNv1+ASdB2leNaMAZgBXQmY9vPOzT8fjIwkXr1Q/cB38J2JV4t2Ze+mIodl4TWAOnGUgbPxY49RE2p04cnNs3RwBVYhxqK9cDlwGexFWwd2AP4K2wXY6eSffFlHZaetQArHb0EC3RrtuexnOuUjMF2MMZuwLbBCkFNBran/oWZ/ghc3WOPlexLf9gC+BwmchU6CHEB8D5sgSBqjiYArcVmmILg3xH22S7FJgHfwSYFdWEaNhE4ldYvCrSe3gnBCnpXp69iE4munj8HW7Wtafr3Q7CoerBdpQHYwJ2nr43s+fOx2MDf6spuc7FU2auxeJM6MAiLRfgsNkELSYYtMP6R6u98CNHWHAw8Sfgzv/mYZnodA352x7QUqhxMJivXFmJxCNOp3+LoCOAPxLkvi7FgViFETRiJ1dyOobN/P3BkuqYEpQPTO/8KtrVb9qAjK9ceB74MHED9Bn0wv2cR5950Y/EO0roQoqa8BevkYnQQd1HtnOf+sAO2q3ENFudQ9oAki2srsQHzk5jMdl2ZQtyKmk8AhydrjRAiGsOxaOAY0qjdwE+od2eaMxCb0FyI7XKUUaVQFt7mYumix1F/idopwHXEezdXYVLKg1M1SAiRhr2wVXuMjmMdtl24Y7LWxGcycDYWCPYs5Q9ksv7ZIixN7wNYFkIrsAvwI+KWLp4FvDFVg4QQ6enAKqSFrv6VWxemy75PqgYlZFvs3l2M7RCUUUde9uc2FxPlOQsL9mwlJmG7FzFlj1/A7l0dYyCEEA6MxgLhQsoJN1o3NhE4KFWDSmAUFn19HtbWlyl/MGx1W8nrizG1arnmXbAdtVjfZ4ZNKi4hfMqgEKIm7AzcQtxO+y6ss271FcZATG/gOGxScA2mpKhYAjdbjG1LX4xJBb+Z+p/h98V07L2JXcr4NiyeQAghOA5T+YrZ6TyMdeStLiLTzObAIZhIywysvHEd6heksuXAPcA3MPW6g6l2YZ3Q5GWv7yH+vX4SO8YSouVXZKIYI4F/xYrVDIt4nScwjYL/pj4SwzEYg+0YvAGLL9im4b93pleFr+6sBZ4B5jXYEmyFPw8TmMpK8648RmKyuh/D0lFjshz4N2zLf23ka4maoAmA2BDbYVvYZxB3tf4q8ANsMvBIxOvUkQ5sQpAXzWnW3d+q6c+GJvZvNRY8tozeegSN/70Mq18wHxvs23GA3xjbYIW2zib++ft6TML7M1iVRSH+H00AxKbYFfgiVk40NndiE4HrseAkUYwR9Or0D6N3ByfX9R+IBS2C6UI0n6Wvobey2yvYwNFYP2BVz//P6w2sDN6C1qYDeCtwJnAy8WMZMkyf4zOY4qUQQjixH3A7ac6Dl2AR3iGrGgpRFmOwFLtYOv0bslm0ZhquEKJE3o5VRkvRia3BxFzeRvsFDYp604m9t9di73Gqgf8+4LAE7RNCtCmdwN9gwVupOrbFWJnjqQnaJ4QrE7At9/mk+zYyLNX0RHSkK4RIxGDg77CI/pSd3e+BT2CBVEKUzXDgVEwIKnbufrM9jKX01bE8txCiBchzmH9H2s6vCxMYOovWSZcT9WAo9s5fSTl6Dg9hA79W/EKIStABvIM0YibNtgL4IdYpajIgYjAEG/S/T3kiTr/CYguEEKKyHIpFIpfRSa4CbsLSrcbFbqhoaQYBRwPfBV6inPe5G7gVSyEUQojasB/wU8rTwl+PrZo+jqnrCdEXY4F3YSqVyyjnvc0woaVvI71+IUTN2Qkr6FJ2tbzfA+djBVcGRW2xqAudwL7AZ7EaDakD+ZrtT8Dn0O6VEKLFGIkF7c2m3E42w5TsZgGfxKrMKZK6fRiLxYvMAJ6l/Hcxw9T6YtfgEEKI0unABEv+h/JXXLktBX6ExQ7ELswi0jIaO8v/AiaW00X571uGFeX5CXBEvKYLIUR12R64ACtUUnaH3GhzsTPYM7FzWKkR1oftgXcDl2HHPlWZZOY2D/gUsHWsGyCEEHViKHAa8EvKCxrclL0C3IHVKTgRU30T5TMAmAZ8BNvBWUT578qGbC224/U2dNwkKoKEJEQVmQy8F5sQvLFcVzbJM8BvsW3l+7GSxiq5Go9BWIXKacBePb/uTW+VwyryJPA9LJVwSbmuCPF6NAEQVecgbCLwV8DmJfvSH17AJgJzMI32x3p+XVqmUzWjA5gE7AbsgQ36U3p+H7uMbgieB67GxKl+U7IvQmwUTQBEXcjlV0/DAroGlutOYV6kd0IwBysYswhYiE0a2pFx2A5PbjsCb8IG/LopOq4CrscG/VuBdeW6I0TfaAIg6sh4TKzlncBbqP+Z6mvAAmwykE8KFgJP9/z6HJa2WCe2xAb48cBELDBvYsPvJ1G/Qb6ZdVhcyFXAdViciBC1QRMAUXfGA3+JBeYdRj22iF1Yg+0ibMxeavh9HrS4vuffvtTzaxemY5//vNcafv4wbJclZzAwoscGA5thZ/CjsaOYzYExTb/fGhv0t6J1hZZWYSv867AKgC9t+q8LUV00ARCtxHDgcEzk5XhssBLCl9eA24FrMWlrrfRFS6AJgGhVhgJHAidgOwRbluuOqBnzgJlYYalfYDsmQrQUmgCIdqATSxk7osem8/rtbiFWAXcDt/XYA+W6I0R8NAEQ7cgw4GB6JwR7Uv9AQlGMDPgDdp4/E/g1WuWLNkMTACHseOBQbDJwJKoF0Ip0YQV37sJW+Hdg5X6FaFs0ARDiz9kWqxD4ZizN8CAswFDUh/VYHYC76R30FbEvRAOaAAjRNwOAXeidEEzv+W8dG1SDfHX/QJOtKtMpIaqOJgBCuDEG2B/YF5Oo3R3YidbNf68K67DB/kGs/sIDwENosBeiMJoACBGOgZjK3e6Yjn3jr8o6KMZ6TAUxr6WQ//oosLpEv4RoGTQBECI+g4GdscnATtgkIZfDnUT7Tg5WYzUR5mNSyPnvHweeQHr6QkRFEwAhymc8vZOCxonB9j3/bwssdbFOrAAWY5XxlgB/wioiPk3vQK/yuEKUiCYAQtSDYcBYbDLQaGOb/nxUz9/PNfzBdPw7e2yznj/Ltf7BVtqvNlxrBRZYB701A17psRU9vy4HXm74s+XYYL8YG+i1TS+EEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghRAz+D1hyObuzPiRHAAAAAElFTkSuQmCC";

  var img$2 =
    "data:image/png;base64,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";

  var img$1 =
    "data:image/png;base64,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RERERERERERERERERERERERERERERERERERERERERERERETl728i994mW2HRQgAAAABJRU5ErkJggg==";

  var img =
    "data:image/png;base64,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";

  const message = writable("");

  /* src/components/GameOptions.svelte generated by Svelte v3.50.1 */
  const file$4 = "src/components/GameOptions.svelte";

  // (81:2) {#if !mobile}
  function create_if_block_7(ctx) {
    let h4;
    let t;
    let h4_hidden_value;

    const block = {
      c: function create() {
        h4 = element("h4");
        t = text(/*messageValue*/ ctx[4]);
        h4.hidden = h4_hidden_value = /*messageValue*/ ctx[4] === "";
        attr_dev(h4, "class", "svelte-1vnhkon");
        add_location(h4, file$4, 81, 4, 2330);
      },
      m: function mount(target, anchor) {
        insert_dev(target, h4, anchor);
        append_dev(h4, t);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*messageValue*/ 16)
          set_data_dev(t, /*messageValue*/ ctx[4]);

        if (
          dirty & /*messageValue*/ 16 &&
          h4_hidden_value !== (h4_hidden_value = /*messageValue*/ ctx[4] === "")
        ) {
          prop_dev(h4, "hidden", h4_hidden_value);
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(h4);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_7.name,
      type: "if",
      source: "(81:2) {#if !mobile}",
      ctx,
    });

    return block;
  }

  // (150:2) {:else}
  function create_else_block$2(ctx) {
    let div1;
    let div0;
    let img$1;
    let img_src_value;
    let mounted;
    let dispose;

    const block = {
      c: function create() {
        div1 = element("div");
        div0 = element("div");
        img$1 = element("img");
        attr_dev(img$1, "class", " svelte-1vnhkon");
        if (!src_url_equal(img$1.src, (img_src_value = img)))
          attr_dev(img$1, "src", img_src_value);
        attr_dev(img$1, "alt", "return icon");
        add_location(img$1, file$4, 152, 8, 4658);
        attr_dev(div0, "class", "option-container svelte-1vnhkon");
        add_location(div0, file$4, 151, 6, 4588);
        attr_dev(div1, "id", "img-container");
        attr_dev(div1, "class", "svelte-1vnhkon");
        add_location(div1, file$4, 150, 4, 4557);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div1, anchor);
        append_dev(div1, div0);
        append_dev(div0, img$1);

        if (!mounted) {
          dispose = listen_dev(
            div0,
            "click",
            /*handleReturnToLobby*/ ctx[8],
            false,
            false,
            false
          );
          mounted = true;
        }
      },
      p: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(div1);
        mounted = false;
        dispose();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_else_block$2.name,
      type: "else",
      source: "(150:2) {:else}",
      ctx,
    });

    return block;
  }

  // (84:2) {#if playerType !== PlayerType.SPECTATOR}
  function create_if_block$4(ctx) {
    let div;
    let t0;
    let t1;
    let show_if_2 =
      /*selected*/ ctx[3] !== 0 &&
      /*selected*/ ctx[3] !== 2 &&
      /*status*/ ctx[0] !== RoomStatus$1.REMIS_REQUESTED &&
      !(/*gameFinished*/ ctx[7](/*status*/ ctx[0]));
    let t2;
    let show_if_1 =
      /*selected*/ ctx[3] !== 0 &&
      /*selected*/ ctx[3] !== 1 &&
      !(/*gameFinished*/ ctx[7](/*status*/ ctx[0]));
    let t3;
    let t4;
    let show_if = /*gameFinished*/ ctx[7](/*status*/ ctx[0]);
    let if_block0 =
      /*selected*/ (ctx[3] >= 0 ||
        /*status*/ ctx[0] === RoomStatus$1.REMIS_REQUESTED) &&
      create_if_block_6(ctx);
    let if_block1 =
      /*status*/ ctx[0] === RoomStatus$1.SETUP && create_if_block_5(ctx);
    let if_block2 = show_if_2 && create_if_block_4(ctx);
    let if_block3 = show_if_1 && create_if_block_3(ctx);
    let if_block4 =
      /*selected*/ (ctx[3] >= 0 ||
        /*status*/ ctx[0] === RoomStatus$1.REMIS_REQUESTED) &&
      create_if_block_2(ctx);
    let if_block5 = show_if && create_if_block_1$2(ctx);

    const block = {
      c: function create() {
        div = element("div");
        if (if_block0) if_block0.c();
        t0 = space();
        if (if_block1) if_block1.c();
        t1 = space();
        if (if_block2) if_block2.c();
        t2 = space();
        if (if_block3) if_block3.c();
        t3 = space();
        if (if_block4) if_block4.c();
        t4 = space();
        if (if_block5) if_block5.c();
        attr_dev(div, "id", "img-container");
        attr_dev(div, "class", "svelte-1vnhkon");
        add_location(div, file$4, 84, 4, 2439);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        if (if_block0) if_block0.m(div, null);
        append_dev(div, t0);
        if (if_block1) if_block1.m(div, null);
        append_dev(div, t1);
        if (if_block2) if_block2.m(div, null);
        append_dev(div, t2);
        if (if_block3) if_block3.m(div, null);
        append_dev(div, t3);
        if (if_block4) if_block4.m(div, null);
        append_dev(div, t4);
        if (if_block5) if_block5.m(div, null);
      },
      p: function update(ctx, dirty) {
        if (
          /*selected*/ ctx[3] >= 0 ||
          /*status*/ ctx[0] === RoomStatus$1.REMIS_REQUESTED
        ) {
          if (if_block0) {
            if_block0.p(ctx, dirty);
          } else {
            if_block0 = create_if_block_6(ctx);
            if_block0.c();
            if_block0.m(div, t0);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        if (/*status*/ ctx[0] === RoomStatus$1.SETUP) {
          if (if_block1) {
            if_block1.p(ctx, dirty);
          } else {
            if_block1 = create_if_block_5(ctx);
            if_block1.c();
            if_block1.m(div, t1);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }

        if (dirty & /*selected, status*/ 9)
          show_if_2 =
            /*selected*/ ctx[3] !== 0 &&
            /*selected*/ ctx[3] !== 2 &&
            /*status*/ ctx[0] !== RoomStatus$1.REMIS_REQUESTED &&
            !(/*gameFinished*/ ctx[7](/*status*/ ctx[0]));

        if (show_if_2) {
          if (if_block2) {
            if_block2.p(ctx, dirty);
          } else {
            if_block2 = create_if_block_4(ctx);
            if_block2.c();
            if_block2.m(div, t2);
          }
        } else if (if_block2) {
          if_block2.d(1);
          if_block2 = null;
        }

        if (dirty & /*selected, status*/ 9)
          show_if_1 =
            /*selected*/ ctx[3] !== 0 &&
            /*selected*/ ctx[3] !== 1 &&
            !(/*gameFinished*/ ctx[7](/*status*/ ctx[0]));

        if (show_if_1) {
          if (if_block3) {
            if_block3.p(ctx, dirty);
          } else {
            if_block3 = create_if_block_3(ctx);
            if_block3.c();
            if_block3.m(div, t3);
          }
        } else if (if_block3) {
          if_block3.d(1);
          if_block3 = null;
        }

        if (
          /*selected*/ ctx[3] >= 0 ||
          /*status*/ ctx[0] === RoomStatus$1.REMIS_REQUESTED
        ) {
          if (if_block4) {
            if_block4.p(ctx, dirty);
          } else {
            if_block4 = create_if_block_2(ctx);
            if_block4.c();
            if_block4.m(div, t4);
          }
        } else if (if_block4) {
          if_block4.d(1);
          if_block4 = null;
        }

        if (dirty & /*status*/ 1)
          show_if = /*gameFinished*/ ctx[7](/*status*/ ctx[0]);

        if (show_if) {
          if (if_block5) {
            if_block5.p(ctx, dirty);
          } else {
            if_block5 = create_if_block_1$2(ctx);
            if_block5.c();
            if_block5.m(div, null);
          }
        } else if (if_block5) {
          if_block5.d(1);
          if_block5 = null;
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
        if (if_block2) if_block2.d();
        if (if_block3) if_block3.d();
        if (if_block4) if_block4.d();
        if (if_block5) if_block5.d();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$4.name,
      type: "if",
      source: "(84:2) {#if playerType !== PlayerType.SPECTATOR}",
      ctx,
    });

    return block;
  }

  // (86:6) {#if selected >= 0 || status === RoomStatus.REMIS_REQUESTED}
  function create_if_block_6(ctx) {
    let div;
    let img;
    let img_src_value;
    let mounted;
    let dispose;

    const block = {
      c: function create() {
        div = element("div");
        img = element("img");
        if (!src_url_equal(img.src, (img_src_value = img$2)))
          attr_dev(img, "src", img_src_value);
        attr_dev(img, "alt", "cancel icon");
        attr_dev(img, "class", "svelte-1vnhkon");
        add_location(img, file$4, 87, 10, 2619);
        attr_dev(div, "class", "confirm-container svelte-1vnhkon");
        add_location(div, file$4, 86, 8, 2539);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        append_dev(div, img);

        if (!mounted) {
          dispose = listen_dev(
            div,
            "click",
            /*click_handler*/ ctx[9],
            false,
            false,
            false
          );
          mounted = true;
        }
      },
      p: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        mounted = false;
        dispose();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_6.name,
      type: "if",
      source:
        "(86:6) {#if selected >= 0 || status === RoomStatus.REMIS_REQUESTED}",
      ctx,
    });

    return block;
  }

  // (91:6) {#if status === RoomStatus.SETUP}
  function create_if_block_5(ctx) {
    let div;
    let img;
    let img_class_value;
    let img_src_value;
    let div_class_value;
    let mounted;
    let dispose;

    const block = {
      c: function create() {
        div = element("div");
        img = element("img");
        attr_dev(
          img,
          "class",
          (img_class_value =
            "" +
            (null_to_empty(/*selected*/ ctx[3] !== 0 ? "" : "disabled-img") +
              " svelte-1vnhkon"))
        );
        if (!src_url_equal(img.src, (img_src_value = img$2)))
          attr_dev(img, "src", img_src_value);
        attr_dev(img, "alt", "cancel icon");
        add_location(img, file$4, 97, 10, 2917);

        attr_dev(
          div,
          "class",
          (div_class_value =
            "" +
            (null_to_empty(
              /*selected*/ ctx[3] !== 0
                ? "option-container"
                : "disabled-option-container"
            ) +
              " svelte-1vnhkon"))
        );

        add_location(div, file$4, 91, 8, 2737);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        append_dev(div, img);

        if (!mounted) {
          dispose = listen_dev(
            div,
            "click",
            /*click_handler_1*/ ctx[10],
            false,
            false,
            false
          );
          mounted = true;
        }
      },
      p: function update(ctx, dirty) {
        if (
          dirty & /*selected*/ 8 &&
          img_class_value !==
            (img_class_value =
              "" +
              (null_to_empty(/*selected*/ ctx[3] !== 0 ? "" : "disabled-img") +
                " svelte-1vnhkon"))
        ) {
          attr_dev(img, "class", img_class_value);
        }

        if (
          dirty & /*selected*/ 8 &&
          div_class_value !==
            (div_class_value =
              "" +
              (null_to_empty(
                /*selected*/ ctx[3] !== 0
                  ? "option-container"
                  : "disabled-option-container"
              ) +
                " svelte-1vnhkon"))
        ) {
          attr_dev(div, "class", div_class_value);
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        mounted = false;
        dispose();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_5.name,
      type: "if",
      source: "(91:6) {#if status === RoomStatus.SETUP}",
      ctx,
    });

    return block;
  }

  // (105:6) {#if selected !== 0 && selected !== 2 && status !== RoomStatus.REMIS_REQUESTED && !gameFinished(status)}
  function create_if_block_4(ctx) {
    let div;
    let img;
    let img_class_value;
    let img_src_value;
    let div_class_value;
    let mounted;
    let dispose;

    const block = {
      c: function create() {
        div = element("div");
        img = element("img");

        attr_dev(
          img,
          "class",
          (img_class_value =
            "" +
            (null_to_empty(
              /*status*/ ctx[0] === RoomStatus$1.PLAYING &&
                /*selected*/ ctx[3] !== 1
                ? ""
                : "disabled-img"
            ) +
              " svelte-1vnhkon"))
        );

        if (!src_url_equal(img.src, (img_src_value = img$3)))
          attr_dev(img, "src", img_src_value);
        attr_dev(img, "alt", "remis icon");
        add_location(img, file$4, 111, 10, 3410);

        attr_dev(
          div,
          "class",
          (div_class_value =
            "" +
            (null_to_empty(
              /*status*/ ctx[0] === RoomStatus$1.PLAYING &&
                /*selected*/ ctx[3] !== 1
                ? "option-container"
                : "disabled-option-container"
            ) +
              " svelte-1vnhkon"))
        );

        add_location(div, file$4, 105, 8, 3197);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        append_dev(div, img);

        if (!mounted) {
          dispose = listen_dev(
            div,
            "click",
            /*click_handler_2*/ ctx[11],
            false,
            false,
            false
          );
          mounted = true;
        }
      },
      p: function update(ctx, dirty) {
        if (
          dirty & /*status, selected*/ 9 &&
          img_class_value !==
            (img_class_value =
              "" +
              (null_to_empty(
                /*status*/ ctx[0] === RoomStatus$1.PLAYING &&
                  /*selected*/ ctx[3] !== 1
                  ? ""
                  : "disabled-img"
              ) +
                " svelte-1vnhkon"))
        ) {
          attr_dev(img, "class", img_class_value);
        }

        if (
          dirty & /*status, selected*/ 9 &&
          div_class_value !==
            (div_class_value =
              "" +
              (null_to_empty(
                /*status*/ ctx[0] === RoomStatus$1.PLAYING &&
                  /*selected*/ ctx[3] !== 1
                  ? "option-container"
                  : "disabled-option-container"
              ) +
                " svelte-1vnhkon"))
        ) {
          attr_dev(div, "class", div_class_value);
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        mounted = false;
        dispose();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_4.name,
      type: "if",
      source:
        "(105:6) {#if selected !== 0 && selected !== 2 && status !== RoomStatus.REMIS_REQUESTED && !gameFinished(status)}",
      ctx,
    });

    return block;
  }

  // (121:6) {#if selected !== 0 && selected !== 1 && !gameFinished(status)}
  function create_if_block_3(ctx) {
    let div;
    let img;
    let img_class_value;
    let img_src_value;
    let div_class_value;
    let mounted;
    let dispose;

    const block = {
      c: function create() {
        div = element("div");
        img = element("img");

        attr_dev(
          img,
          "class",
          (img_class_value =
            "" +
            (null_to_empty(
              /*status*/ ctx[0] === RoomStatus$1.PLAYING &&
                /*selected*/ ctx[3] !== 2
                ? ""
                : "disabled-img"
            ) +
              " svelte-1vnhkon"))
        );

        if (!src_url_equal(img.src, (img_src_value = img$4)))
          attr_dev(img, "src", img_src_value);
        attr_dev(img, "alt", "resign flag");
        add_location(img, file$4, 127, 10, 3921);

        attr_dev(
          div,
          "class",
          (div_class_value =
            "" +
            (null_to_empty(
              /*status*/ ctx[0] === RoomStatus$1.PLAYING &&
                /*selected*/ ctx[3] !== 2
                ? "option-container"
                : "disabled-option-container"
            ) +
              " svelte-1vnhkon"))
        );

        add_location(div, file$4, 121, 8, 3708);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        append_dev(div, img);

        if (!mounted) {
          dispose = listen_dev(
            div,
            "click",
            /*click_handler_3*/ ctx[12],
            false,
            false,
            false
          );
          mounted = true;
        }
      },
      p: function update(ctx, dirty) {
        if (
          dirty & /*status, selected*/ 9 &&
          img_class_value !==
            (img_class_value =
              "" +
              (null_to_empty(
                /*status*/ ctx[0] === RoomStatus$1.PLAYING &&
                  /*selected*/ ctx[3] !== 2
                  ? ""
                  : "disabled-img"
              ) +
                " svelte-1vnhkon"))
        ) {
          attr_dev(img, "class", img_class_value);
        }

        if (
          dirty & /*status, selected*/ 9 &&
          div_class_value !==
            (div_class_value =
              "" +
              (null_to_empty(
                /*status*/ ctx[0] === RoomStatus$1.PLAYING &&
                  /*selected*/ ctx[3] !== 2
                  ? "option-container"
                  : "disabled-option-container"
              ) +
                " svelte-1vnhkon"))
        ) {
          attr_dev(div, "class", div_class_value);
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        mounted = false;
        dispose();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_3.name,
      type: "if",
      source:
        "(121:6) {#if selected !== 0 && selected !== 1 && !gameFinished(status)}",
      ctx,
    });

    return block;
  }

  // (138:6) {#if selected >= 0 || status === RoomStatus.REMIS_REQUESTED}
  function create_if_block_2(ctx) {
    let div;
    let img;
    let img_src_value;
    let mounted;
    let dispose;

    const block = {
      c: function create() {
        div = element("div");
        img = element("img");
        if (!src_url_equal(img.src, (img_src_value = img$1)))
          attr_dev(img, "src", img_src_value);
        attr_dev(img, "alt", "confirm icon");
        attr_dev(img, "class", "svelte-1vnhkon");
        add_location(img, file$4, 139, 10, 4302);
        attr_dev(div, "class", "confirm-container svelte-1vnhkon");
        add_location(div, file$4, 138, 8, 4223);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        append_dev(div, img);

        if (!mounted) {
          dispose = listen_dev(
            div,
            "click",
            /*click_handler_4*/ ctx[13],
            false,
            false,
            false
          );
          mounted = true;
        }
      },
      p: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        mounted = false;
        dispose();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_2.name,
      type: "if",
      source:
        "(138:6) {#if selected >= 0 || status === RoomStatus.REMIS_REQUESTED}",
      ctx,
    });

    return block;
  }

  // (144:6) {#if gameFinished(status)}
  function create_if_block_1$2(ctx) {
    let button;
    let mounted;
    let dispose;

    const block = {
      c: function create() {
        button = element("button");
        button.textContent = "Return to lobby!";
        attr_dev(button, "id", "return-button");
        attr_dev(button, "class", "svelte-1vnhkon");
        add_location(button, file$4, 144, 8, 4416);
      },
      m: function mount(target, anchor) {
        insert_dev(target, button, anchor);

        if (!mounted) {
          dispose = listen_dev(
            button,
            "click",
            /*handleReturnToLobby*/ ctx[8],
            false,
            false,
            false
          );
          mounted = true;
        }
      },
      p: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(button);
        mounted = false;
        dispose();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_1$2.name,
      type: "if",
      source: "(144:6) {#if gameFinished(status)}",
      ctx,
    });

    return block;
  }

  function create_fragment$4(ctx) {
    let div;
    let t;
    let if_block0 = !(/*mobile*/ ctx[2]) && create_if_block_7(ctx);

    function select_block_type(ctx, dirty) {
      if (/*playerType*/ ctx[1] !== PlayerType$1.SPECTATOR)
        return create_if_block$4;
      return create_else_block$2;
    }

    let current_block_type = select_block_type(ctx);
    let if_block1 = current_block_type(ctx);

    const block = {
      c: function create() {
        div = element("div");
        if (if_block0) if_block0.c();
        t = space();
        if_block1.c();
        attr_dev(div, "id", "container");
        attr_dev(div, "class", "svelte-1vnhkon");
        add_location(div, file$4, 79, 0, 2289);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        if (if_block0) if_block0.m(div, null);
        append_dev(div, t);
        if_block1.m(div, null);
      },
      p: function update(ctx, [dirty]) {
        if (!(/*mobile*/ ctx[2])) {
          if (if_block0) {
            if_block0.p(ctx, dirty);
          } else {
            if_block0 = create_if_block_7(ctx);
            if_block0.c();
            if_block0.m(div, t);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        if (
          current_block_type ===
            (current_block_type = select_block_type(ctx)) &&
          if_block1
        ) {
          if_block1.p(ctx, dirty);
        } else {
          if_block1.d(1);
          if_block1 = current_block_type(ctx);

          if (if_block1) {
            if_block1.c();
            if_block1.m(div, null);
          }
        }
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        if (if_block0) if_block0.d();
        if_block1.d();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$4.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$4($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("GameOptions", slots, []);
    const dispatch = createEventDispatcher();
    let { status = RoomStatus$1.SETUP } = $$props;
    let { playerType = PlayerType$1.SPECTATOR } = $$props;
    let { mobile = false } = $$props;
    let selected = -1;
    let messageValue = "";

    const messageUnSub = message.subscribe((val) => {
      $$invalidate(4, (messageValue = val));
    });

    onDestroy(messageUnSub);

    function handleImageClick(index) {
      if (
        index >= 1 &&
        status !== RoomStatus$1.REMIS_REQUESTED &&
        status !== RoomStatus$1.PLAYING
      )
        return;
      if (index === 0 && status !== RoomStatus$1.SETUP) return;
      if (playerType === PlayerType$1.SPECTATOR) return;
      $$invalidate(3, (selected = index));

      switch (index) {
        case 0:
          message.set("Are you sure you want to abort?");
          break;
        case 1:
          message.set("Offer remis?");
          break;
        case 2:
          message.set("Are you sure you want to resign?");
          break;
      }
    }

    function handleConfirm(confirmed) {
      if (confirmed) {
        if (status === RoomStatus$1.REMIS_REQUESTED) {
          dispatch("remis");
        } else {
          switch (selected) {
            case 0:
              dispatch("abort");
              break;
            case 1:
              dispatch("remis");
              break;
            case 2:
              dispatch("resign");
              break;
          }
        }
      } else {
        if (status === RoomStatus$1.REMIS_REQUESTED) {
          dispatch("remisDeclined");
        }
      }

      $$invalidate(3, (selected = -1));
      message.set("");
    }

    function gameFinished(status) {
      return (
        status === RoomStatus$1.WHITE ||
        status === RoomStatus$1.BLACK ||
        status === RoomStatus$1.ABORTED ||
        status === RoomStatus$1.REMIS
      );
    }

    function handleReturnToLobby() {
      dispatch("return");
    }

    const writable_props = ["status", "playerType", "mobile"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<GameOptions> was created with unknown prop '${key}'`);
    });

    const click_handler = () => handleConfirm(false);
    const click_handler_1 = () => handleImageClick(0);
    const click_handler_2 = () => handleImageClick(1);
    const click_handler_3 = () => handleImageClick(2);
    const click_handler_4 = () => handleConfirm(true);

    $$self.$$set = ($$props) => {
      if ("status" in $$props) $$invalidate(0, (status = $$props.status));
      if ("playerType" in $$props)
        $$invalidate(1, (playerType = $$props.playerType));
      if ("mobile" in $$props) $$invalidate(2, (mobile = $$props.mobile));
    };

    $$self.$capture_state = () => ({
      resignFlagIcon: img$4,
      remisIcon: img$3,
      cancelIcon: img$2,
      confirmIcon: img$1,
      returnIcon: img,
      createEventDispatcher,
      onDestroy,
      RoomStatus: RoomStatus$1,
      message,
      PlayerType: PlayerType$1,
      dispatch,
      status,
      playerType,
      mobile,
      selected,
      messageValue,
      messageUnSub,
      handleImageClick,
      handleConfirm,
      gameFinished,
      handleReturnToLobby,
    });

    $$self.$inject_state = ($$props) => {
      if ("status" in $$props) $$invalidate(0, (status = $$props.status));
      if ("playerType" in $$props)
        $$invalidate(1, (playerType = $$props.playerType));
      if ("mobile" in $$props) $$invalidate(2, (mobile = $$props.mobile));
      if ("selected" in $$props) $$invalidate(3, (selected = $$props.selected));
      if ("messageValue" in $$props)
        $$invalidate(4, (messageValue = $$props.messageValue));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [
      status,
      playerType,
      mobile,
      selected,
      messageValue,
      handleImageClick,
      handleConfirm,
      gameFinished,
      handleReturnToLobby,
      click_handler,
      click_handler_1,
      click_handler_2,
      click_handler_3,
      click_handler_4,
    ];
  }

  class GameOptions extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$4, create_fragment$4, safe_not_equal, {
        status: 0,
        playerType: 1,
        mobile: 2,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "GameOptions",
        options,
        id: create_fragment$4.name,
      });
    }

    get status() {
      throw new Error(
        "<GameOptions>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set status(value) {
      throw new Error(
        "<GameOptions>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get playerType() {
      throw new Error(
        "<GameOptions>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set playerType(value) {
      throw new Error(
        "<GameOptions>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get mobile() {
      throw new Error(
        "<GameOptions>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set mobile(value) {
      throw new Error(
        "<GameOptions>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  /* src/components/Clock.svelte generated by Svelte v3.50.1 */
  const file$3 = "src/components/Clock.svelte";

  // (60:2) {#if !mobile}
  function create_if_block_1$1(ctx) {
    let div2;
    let div1;
    let div0;
    let t0;
    let h30;
    let t2;
    let h31;
    let t3;
    let h31_hidden_value;
    let t4;
    let h32;
    let t5_value = formatTime(/*opponentTime*/ ctx[2]) + "";
    let t5;

    const block = {
      c: function create() {
        div2 = element("div");
        div1 = element("div");
        div0 = element("div");
        t0 = space();
        h30 = element("h3");
        h30.textContent = "Anonymous";
        t2 = space();
        h31 = element("h3");
        t3 = text(/*awayTimer*/ ctx[6]);
        t4 = space();
        h32 = element("h3");
        t5 = text(t5_value);
        attr_dev(div0, "class", "activity-ball svelte-1bxi5d5");

        set_style(
          div0,
          "background-color",
          /*getPlayerActivity*/ ctx[7](/*roomPresence*/ ctx[4])[1]
            ? "green"
            : "grey"
        );

        add_location(div0, file$3, 62, 8, 1819);
        add_location(h30, file$3, 68, 8, 1991);
        h31.hidden = h31_hidden_value = /*awayTimer*/ ctx[6] === 30;
        attr_dev(h31, "class", "timer svelte-1bxi5d5");
        add_location(h31, file$3, 69, 8, 2018);
        attr_dev(div1, "class", "activity-container svelte-1bxi5d5");
        add_location(div1, file$3, 61, 6, 1778);
        add_location(h32, file$3, 71, 6, 2098);
        attr_dev(div2, "class", "row svelte-1bxi5d5");
        add_location(div2, file$3, 60, 4, 1754);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div2, anchor);
        append_dev(div2, div1);
        append_dev(div1, div0);
        append_dev(div1, t0);
        append_dev(div1, h30);
        append_dev(div1, t2);
        append_dev(div1, h31);
        append_dev(h31, t3);
        append_dev(div2, t4);
        append_dev(div2, h32);
        append_dev(h32, t5);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*roomPresence*/ 16) {
          set_style(
            div0,
            "background-color",
            /*getPlayerActivity*/ ctx[7](/*roomPresence*/ ctx[4])[1]
              ? "green"
              : "grey"
          );
        }

        if (dirty & /*awayTimer*/ 64) set_data_dev(t3, /*awayTimer*/ ctx[6]);

        if (
          dirty & /*awayTimer*/ 64 &&
          h31_hidden_value !== (h31_hidden_value = /*awayTimer*/ ctx[6] === 30)
        ) {
          prop_dev(h31, "hidden", h31_hidden_value);
        }

        if (
          dirty & /*opponentTime*/ 4 &&
          t5_value !== (t5_value = formatTime(/*opponentTime*/ ctx[2]) + "")
        )
          set_data_dev(t5, t5_value);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div2);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_1$1.name,
      type: "if",
      source: "(60:2) {#if !mobile}",
      ctx,
    });

    return block;
  }

  // (86:2) {#if !mobile}
  function create_if_block$3(ctx) {
    let div2;
    let div1;
    let div0;
    let t0;
    let h30;
    let t2;
    let h31;
    let t3_value = formatTime(/*playerTime*/ ctx[1]) + "";
    let t3;

    const block = {
      c: function create() {
        div2 = element("div");
        div1 = element("div");
        div0 = element("div");
        t0 = space();
        h30 = element("h3");
        h30.textContent = "Anonymous";
        t2 = space();
        h31 = element("h3");
        t3 = text(t3_value);
        attr_dev(div0, "class", "activity-ball svelte-1bxi5d5");

        set_style(
          div0,
          "background-color",
          /*getPlayerActivity*/ ctx[7](/*roomPresence*/ ctx[4])[0]
            ? "green"
            : "grey"
        );

        add_location(div0, file$3, 88, 8, 2377);
        add_location(h30, file$3, 94, 8, 2549);
        attr_dev(div1, "class", "activity-container svelte-1bxi5d5");
        add_location(div1, file$3, 87, 6, 2336);
        add_location(h31, file$3, 96, 6, 2587);
        attr_dev(div2, "class", "row svelte-1bxi5d5");
        add_location(div2, file$3, 86, 4, 2312);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div2, anchor);
        append_dev(div2, div1);
        append_dev(div1, div0);
        append_dev(div1, t0);
        append_dev(div1, h30);
        append_dev(div2, t2);
        append_dev(div2, h31);
        append_dev(h31, t3);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*roomPresence*/ 16) {
          set_style(
            div0,
            "background-color",
            /*getPlayerActivity*/ ctx[7](/*roomPresence*/ ctx[4])[0]
              ? "green"
              : "grey"
          );
        }

        if (
          dirty & /*playerTime*/ 2 &&
          t3_value !== (t3_value = formatTime(/*playerTime*/ ctx[1]) + "")
        )
          set_data_dev(t3, t3_value);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div2);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$3.name,
      type: "if",
      source: "(86:2) {#if !mobile}",
      ctx,
    });

    return block;
  }

  function create_fragment$3(ctx) {
    let div;
    let t0;
    let gameoptions;
    let t1;
    let current;
    let if_block0 = !(/*mobile*/ ctx[5]) && create_if_block_1$1(ctx);

    gameoptions = new GameOptions({
      props: {
        status: /*status*/ ctx[3],
        playerType: /*playerType*/ ctx[0],
        mobile: /*mobile*/ ctx[5],
      },
      $$inline: true,
    });

    gameoptions.$on("abort", /*abort_handler*/ ctx[8]);
    gameoptions.$on("remis", /*remis_handler*/ ctx[9]);
    gameoptions.$on("resign", /*resign_handler*/ ctx[10]);
    gameoptions.$on("remisDeclined", /*remisDeclined_handler*/ ctx[11]);
    gameoptions.$on("return", /*return_handler*/ ctx[12]);
    let if_block1 = !(/*mobile*/ ctx[5]) && create_if_block$3(ctx);

    const block = {
      c: function create() {
        div = element("div");
        if (if_block0) if_block0.c();
        t0 = space();
        create_component(gameoptions.$$.fragment);
        t1 = space();
        if (if_block1) if_block1.c();
        attr_dev(div, "id", "container");
        attr_dev(div, "class", "svelte-1bxi5d5");
        add_location(div, file$3, 58, 0, 1713);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        if (if_block0) if_block0.m(div, null);
        append_dev(div, t0);
        mount_component(gameoptions, div, null);
        append_dev(div, t1);
        if (if_block1) if_block1.m(div, null);
        current = true;
      },
      p: function update(ctx, [dirty]) {
        if (!(/*mobile*/ ctx[5])) {
          if (if_block0) {
            if_block0.p(ctx, dirty);
          } else {
            if_block0 = create_if_block_1$1(ctx);
            if_block0.c();
            if_block0.m(div, t0);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        const gameoptions_changes = {};
        if (dirty & /*status*/ 8)
          gameoptions_changes.status = /*status*/ ctx[3];
        if (dirty & /*playerType*/ 1)
          gameoptions_changes.playerType = /*playerType*/ ctx[0];
        if (dirty & /*mobile*/ 32)
          gameoptions_changes.mobile = /*mobile*/ ctx[5];
        gameoptions.$set(gameoptions_changes);

        if (!(/*mobile*/ ctx[5])) {
          if (if_block1) {
            if_block1.p(ctx, dirty);
          } else {
            if_block1 = create_if_block$3(ctx);
            if_block1.c();
            if_block1.m(div, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(gameoptions.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(gameoptions.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        if (if_block0) if_block0.d();
        destroy_component(gameoptions);
        if (if_block1) if_block1.d();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$3.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function addLeadingZero(number) {
    if (number < 10) return `0${number}`;
    return number.toString();
  }

  function formatTime(time) {
    return `${addLeadingZero(Math.trunc(time / 60))}:${addLeadingZero(
      time % 60
    )}`;
  }

  function instance$3($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("Clock", slots, []);
    const dispatch = createEventDispatcher();
    let { playerType = PlayerType$1.SPECTATOR } = $$props;
    let { playerTime = 0 } = $$props;
    let { opponentTime = 0 } = $$props;
    let { status = RoomStatus$1.SETUP } = $$props;
    let { roomPresence = [] } = $$props;
    let { mobile = false } = $$props;
    let awayTimer = 30;
    let isTicking = false;

    function getPlayerActivity(roomPresence) {
      const activities = Array(2).fill(false);

      roomPresence.forEach((presence) => {
        if (PlayerType$1[presence.color] === playerType) activities[0] = true;
        if (
          PlayerType$1[presence.color] !== playerType &&
          PlayerType$1[presence.color] !== PlayerType$1.SPECTATOR
        )
          activities[1] = true;
      });

      if (
        !activities[1] &&
        (status === RoomStatus$1.PLAYING ||
          status === RoomStatus$1.REMIS_REQUESTED ||
          status === RoomStatus$1.SETUP)
      ) {
        if (!isTicking) {
          isTicking = true;
          tickAwayTime();
        }
      } else {
        isTicking = false;
        $$invalidate(6, (awayTimer = 30));
      }

      return activities;
    }

    function tickAwayTime() {
      if (isTicking) {
        if (awayTimer === 0) {
          dispatch("timeout");
        } else {
          $$invalidate(6, (awayTimer -= 1));
          setTimeout(() => tickAwayTime(), 1000);
        }
      }
    }

    const writable_props = [
      "playerType",
      "playerTime",
      "opponentTime",
      "status",
      "roomPresence",
      "mobile",
    ];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<Clock> was created with unknown prop '${key}'`);
    });

    function abort_handler(event) {
      bubble.call(this, $$self, event);
    }

    function remis_handler(event) {
      bubble.call(this, $$self, event);
    }

    function resign_handler(event) {
      bubble.call(this, $$self, event);
    }

    function remisDeclined_handler(event) {
      bubble.call(this, $$self, event);
    }

    function return_handler(event) {
      bubble.call(this, $$self, event);
    }

    $$self.$$set = ($$props) => {
      if ("playerType" in $$props)
        $$invalidate(0, (playerType = $$props.playerType));
      if ("playerTime" in $$props)
        $$invalidate(1, (playerTime = $$props.playerTime));
      if ("opponentTime" in $$props)
        $$invalidate(2, (opponentTime = $$props.opponentTime));
      if ("status" in $$props) $$invalidate(3, (status = $$props.status));
      if ("roomPresence" in $$props)
        $$invalidate(4, (roomPresence = $$props.roomPresence));
      if ("mobile" in $$props) $$invalidate(5, (mobile = $$props.mobile));
    };

    $$self.$capture_state = () => ({
      createEventDispatcher,
      PlayerType: PlayerType$1,
      RoomStatus: RoomStatus$1,
      GameOptions,
      dispatch,
      playerType,
      playerTime,
      opponentTime,
      status,
      roomPresence,
      mobile,
      awayTimer,
      isTicking,
      addLeadingZero,
      formatTime,
      getPlayerActivity,
      tickAwayTime,
    });

    $$self.$inject_state = ($$props) => {
      if ("playerType" in $$props)
        $$invalidate(0, (playerType = $$props.playerType));
      if ("playerTime" in $$props)
        $$invalidate(1, (playerTime = $$props.playerTime));
      if ("opponentTime" in $$props)
        $$invalidate(2, (opponentTime = $$props.opponentTime));
      if ("status" in $$props) $$invalidate(3, (status = $$props.status));
      if ("roomPresence" in $$props)
        $$invalidate(4, (roomPresence = $$props.roomPresence));
      if ("mobile" in $$props) $$invalidate(5, (mobile = $$props.mobile));
      if ("awayTimer" in $$props)
        $$invalidate(6, (awayTimer = $$props.awayTimer));
      if ("isTicking" in $$props) isTicking = $$props.isTicking;
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [
      playerType,
      playerTime,
      opponentTime,
      status,
      roomPresence,
      mobile,
      awayTimer,
      getPlayerActivity,
      abort_handler,
      remis_handler,
      resign_handler,
      remisDeclined_handler,
      return_handler,
    ];
  }

  class Clock extends SvelteComponentDev {
    constructor(options) {
      super(options);

      init(this, options, instance$3, create_fragment$3, safe_not_equal, {
        playerType: 0,
        playerTime: 1,
        opponentTime: 2,
        status: 3,
        roomPresence: 4,
        mobile: 5,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Clock",
        options,
        id: create_fragment$3.name,
      });
    }

    get playerType() {
      throw new Error(
        "<Clock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set playerType(value) {
      throw new Error(
        "<Clock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get playerTime() {
      throw new Error(
        "<Clock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set playerTime(value) {
      throw new Error(
        "<Clock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get opponentTime() {
      throw new Error(
        "<Clock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set opponentTime(value) {
      throw new Error(
        "<Clock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get status() {
      throw new Error(
        "<Clock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set status(value) {
      throw new Error(
        "<Clock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get roomPresence() {
      throw new Error(
        "<Clock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set roomPresence(value) {
      throw new Error(
        "<Clock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get mobile() {
      throw new Error(
        "<Clock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set mobile(value) {
      throw new Error(
        "<Clock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  /* src/components/GameFinishedModal.svelte generated by Svelte v3.50.1 */
  const file$2 = "src/components/GameFinishedModal.svelte";

  // (34:0) {#if open}
  function create_if_block$2(ctx) {
    let div0;
    let t0;
    let div2;
    let div1;
    let t1;
    let h2;
    let t3;
    let button;
    let mounted;
    let dispose;

    const block = {
      c: function create() {
        div0 = element("div");
        t0 = space();
        div2 = element("div");
        div1 = element("div");
        t1 = space();
        h2 = element("h2");
        h2.textContent = `${/*getTitleByStatus*/ ctx[3]()}`;
        t3 = space();
        button = element("button");
        button.textContent = "Return to lobby!";
        attr_dev(div0, "id", "modal-background");
        attr_dev(div0, "class", "svelte-cnykie");
        add_location(div0, file$2, 34, 2, 1043);
        attr_dev(div1, "class", "close svelte-cnykie");
        add_location(div1, file$2, 36, 4, 1118);
        attr_dev(h2, "class", "svelte-cnykie");
        add_location(h2, file$2, 37, 4, 1166);
        attr_dev(button, "id", "return-button");
        attr_dev(button, "class", "svelte-cnykie");
        add_location(button, file$2, 38, 4, 1200);
        attr_dev(div2, "id", "modal");
        attr_dev(div2, "class", "svelte-cnykie");
        add_location(div2, file$2, 35, 2, 1097);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div0, anchor);
        insert_dev(target, t0, anchor);
        insert_dev(target, div2, anchor);
        append_dev(div2, div1);
        append_dev(div2, t1);
        append_dev(div2, h2);
        append_dev(div2, t3);
        append_dev(div2, button);

        if (!mounted) {
          dispose = [
            listen_dev(
              div0,
              "click",
              /*closeModal*/ ctx[1],
              false,
              false,
              false
            ),
            listen_dev(
              div1,
              "click",
              /*closeModal*/ ctx[1],
              false,
              false,
              false
            ),
            listen_dev(
              button,
              "click",
              /*handleReturnToLobby*/ ctx[2],
              false,
              false,
              false
            ),
          ];

          mounted = true;
        }
      },
      p: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(div0);
        if (detaching) detach_dev(t0);
        if (detaching) detach_dev(div2);
        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$2.name,
      type: "if",
      source: "(34:0) {#if open}",
      ctx,
    });

    return block;
  }

  function create_fragment$2(ctx) {
    let if_block_anchor;
    let if_block = /*open*/ ctx[0] && create_if_block$2(ctx);

    const block = {
      c: function create() {
        if (if_block) if_block.c();
        if_block_anchor = empty();
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        if (if_block) if_block.m(target, anchor);
        insert_dev(target, if_block_anchor, anchor);
      },
      p: function update(ctx, [dirty]) {
        if (/*open*/ ctx[0]) {
          if (if_block) {
            if_block.p(ctx, dirty);
          } else {
            if_block = create_if_block$2(ctx);
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (if_block) if_block.d(detaching);
        if (detaching) detach_dev(if_block_anchor);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$2.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$2($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("GameFinishedModal", slots, []);
    const dispatch = createEventDispatcher();
    let { open = false } = $$props;
    let { status = RoomStatus$1.SETUP } = $$props;
    let { playerType = PlayerType$1.SPECTATOR } = $$props;

    function closeModal() {
      dispatch("close");
    }

    function handleReturnToLobby() {
      dispatch("return");
    }

    function getTitleByStatus() {
      switch (status) {
        case RoomStatus$1.ABORTED:
          return "Game was aborted";
        case RoomStatus$1.BLACK:
          if (playerType === PlayerType$1.BLACK) return "You won the game!";
          return "You lost the game ;(";
        case RoomStatus$1.WHITE:
          if (playerType === PlayerType$1.WHITE) return "You won the game!";
          return "You lost the game ;(";
        case RoomStatus$1.REMIS:
          return "Game ended in remis :/";
        default:
          return "Game ended";
      }
    }

    const writable_props = ["open", "status", "playerType"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(
          `<GameFinishedModal> was created with unknown prop '${key}'`
        );
    });

    $$self.$$set = ($$props) => {
      if ("open" in $$props) $$invalidate(0, (open = $$props.open));
      if ("status" in $$props) $$invalidate(4, (status = $$props.status));
      if ("playerType" in $$props)
        $$invalidate(5, (playerType = $$props.playerType));
    };

    $$self.$capture_state = () => ({
      createEventDispatcher,
      PlayerType: PlayerType$1,
      RoomStatus: RoomStatus$1,
      dispatch,
      open,
      status,
      playerType,
      closeModal,
      handleReturnToLobby,
      getTitleByStatus,
    });

    $$self.$inject_state = ($$props) => {
      if ("open" in $$props) $$invalidate(0, (open = $$props.open));
      if ("status" in $$props) $$invalidate(4, (status = $$props.status));
      if ("playerType" in $$props)
        $$invalidate(5, (playerType = $$props.playerType));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [
      open,
      closeModal,
      handleReturnToLobby,
      getTitleByStatus,
      status,
      playerType,
    ];
  }

  class GameFinishedModal extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$2, create_fragment$2, safe_not_equal, {
        open: 0,
        status: 4,
        playerType: 5,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "GameFinishedModal",
        options,
        id: create_fragment$2.name,
      });
    }

    get open() {
      throw new Error(
        "<GameFinishedModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set open(value) {
      throw new Error(
        "<GameFinishedModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get status() {
      throw new Error(
        "<GameFinishedModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set status(value) {
      throw new Error(
        "<GameFinishedModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get playerType() {
      throw new Error(
        "<GameFinishedModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set playerType(value) {
      throw new Error(
        "<GameFinishedModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  /* src/views/Room.svelte generated by Svelte v3.50.1 */

  const { console: console_1 } = globals;
  const file$1 = "src/views/Room.svelte";

  // (209:0) {:else}
  function create_else_block$1(ctx) {
    let div;
    let t0;
    let gamefinishedmodal;
    let t1;
    let board;
    let t2;
    let clock;
    let current;
    let if_block = !(/*mobile*/ ctx[10]) && create_if_block_1(ctx);

    gamefinishedmodal = new GameFinishedModal({
      props: {
        open: /*openGameFinishedModal*/ ctx[9],
        status: /*status*/ ctx[8],
        playerType: /*playerType*/ ctx[3],
      },
      $$inline: true,
    });

    gamefinishedmodal.$on("close", /*closeModal*/ ctx[17]);
    gamefinishedmodal.$on("return", /*handleReturn*/ ctx[18]);

    board = new Board({
      props: {
        playerType: /*playerType*/ ctx[3],
        chessBoard: /*chessBoard*/ ctx[4],
        nextTurn: /*nextTurn*/ ctx[5],
        playerTime: /*playerTime*/ ctx[6],
        opponentTime: /*opponentTime*/ ctx[7],
        status: /*status*/ ctx[8],
        roomPresence: /*roomPresence*/ ctx[1],
        mobile: /*mobile*/ ctx[10],
      },
      $$inline: true,
    });

    board.$on("move", /*handleMove*/ ctx[11]);
    board.$on("timeout", /*handleTimeout*/ ctx[16]);

    clock = new Clock({
      props: {
        playerTime: /*playerTime*/ ctx[6],
        opponentTime: /*opponentTime*/ ctx[7],
        status: /*status*/ ctx[8],
        playerType: /*playerType*/ ctx[3],
        roomPresence: /*roomPresence*/ ctx[1],
        mobile: /*mobile*/ ctx[10],
      },
      $$inline: true,
    });

    clock.$on("abort", /*handleAbort*/ ctx[12]);
    clock.$on("remis", /*handleRemis*/ ctx[13]);
    clock.$on("remisDeclined", /*handleRemisDecline*/ ctx[14]);
    clock.$on("resign", /*handleResign*/ ctx[15]);
    clock.$on("return", /*handleReturn*/ ctx[18]);
    clock.$on("timeout", /*handleTimeout*/ ctx[16]);

    const block = {
      c: function create() {
        div = element("div");
        if (if_block) if_block.c();
        t0 = space();
        create_component(gamefinishedmodal.$$.fragment);
        t1 = space();
        create_component(board.$$.fragment);
        t2 = space();
        create_component(clock.$$.fragment);
        attr_dev(div, "id", "container");
        attr_dev(div, "class", "svelte-stoob6");
        add_location(div, file$1, 209, 2, 6140);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        if (if_block) if_block.m(div, null);
        append_dev(div, t0);
        mount_component(gamefinishedmodal, div, null);
        append_dev(div, t1);
        mount_component(board, div, null);
        append_dev(div, t2);
        mount_component(clock, div, null);
        current = true;
      },
      p: function update(ctx, dirty) {
        if (!(/*mobile*/ ctx[10])) {
          if (if_block);
          else {
            if_block = create_if_block_1(ctx);
            if_block.c();
            if_block.m(div, t0);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }

        const gamefinishedmodal_changes = {};
        if (dirty[0] & /*openGameFinishedModal*/ 512)
          gamefinishedmodal_changes.open = /*openGameFinishedModal*/ ctx[9];
        if (dirty[0] & /*status*/ 256)
          gamefinishedmodal_changes.status = /*status*/ ctx[8];
        if (dirty[0] & /*playerType*/ 8)
          gamefinishedmodal_changes.playerType = /*playerType*/ ctx[3];
        gamefinishedmodal.$set(gamefinishedmodal_changes);
        const board_changes = {};
        if (dirty[0] & /*playerType*/ 8)
          board_changes.playerType = /*playerType*/ ctx[3];
        if (dirty[0] & /*chessBoard*/ 16)
          board_changes.chessBoard = /*chessBoard*/ ctx[4];
        if (dirty[0] & /*nextTurn*/ 32)
          board_changes.nextTurn = /*nextTurn*/ ctx[5];
        if (dirty[0] & /*playerTime*/ 64)
          board_changes.playerTime = /*playerTime*/ ctx[6];
        if (dirty[0] & /*opponentTime*/ 128)
          board_changes.opponentTime = /*opponentTime*/ ctx[7];
        if (dirty[0] & /*status*/ 256) board_changes.status = /*status*/ ctx[8];
        if (dirty[0] & /*roomPresence*/ 2)
          board_changes.roomPresence = /*roomPresence*/ ctx[1];
        if (dirty[0] & /*mobile*/ 1024)
          board_changes.mobile = /*mobile*/ ctx[10];
        board.$set(board_changes);
        const clock_changes = {};
        if (dirty[0] & /*playerTime*/ 64)
          clock_changes.playerTime = /*playerTime*/ ctx[6];
        if (dirty[0] & /*opponentTime*/ 128)
          clock_changes.opponentTime = /*opponentTime*/ ctx[7];
        if (dirty[0] & /*status*/ 256) clock_changes.status = /*status*/ ctx[8];
        if (dirty[0] & /*playerType*/ 8)
          clock_changes.playerType = /*playerType*/ ctx[3];
        if (dirty[0] & /*roomPresence*/ 2)
          clock_changes.roomPresence = /*roomPresence*/ ctx[1];
        if (dirty[0] & /*mobile*/ 1024)
          clock_changes.mobile = /*mobile*/ ctx[10];
        clock.$set(clock_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(gamefinishedmodal.$$.fragment, local);
        transition_in(board.$$.fragment, local);
        transition_in(clock.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(gamefinishedmodal.$$.fragment, local);
        transition_out(board.$$.fragment, local);
        transition_out(clock.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        if (if_block) if_block.d();
        destroy_component(gamefinishedmodal);
        destroy_component(board);
        destroy_component(clock);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_else_block$1.name,
      type: "else",
      source: "(209:0) {:else}",
      ctx,
    });

    return block;
  }

  // (206:0) {#if isLoading}
  function create_if_block$1(ctx) {
    let div;

    const block = {
      c: function create() {
        div = element("div");
        attr_dev(div, "id", "loader");
        attr_dev(div, "class", "svelte-stoob6");
        add_location(div, file$1, 207, 2, 6110);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
      },
      p: noop,
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$1.name,
      type: "if",
      source: "(206:0) {#if isLoading}",
      ctx,
    });

    return block;
  }

  // (211:4) {#if !mobile}
  function create_if_block_1(ctx) {
    let div;

    const block = {
      c: function create() {
        div = element("div");
        attr_dev(div, "id", "invisible");
        attr_dev(div, "class", "svelte-stoob6");
        add_location(div, file$1, 211, 6, 6185);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_1.name,
      type: "if",
      source: "(211:4) {#if !mobile}",
      ctx,
    });

    return block;
  }

  function create_fragment$1(ctx) {
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    let mounted;
    let dispose;
    add_render_callback(/*onwindowresize*/ ctx[22]);
    const if_block_creators = [create_if_block$1, create_else_block$1];
    const if_blocks = [];

    function select_block_type(ctx, dirty) {
      if (/*isLoading*/ ctx[2]) return 0;
      return 1;
    }

    current_block_type_index = select_block_type(ctx);
    if_block = if_blocks[current_block_type_index] =
      if_block_creators[current_block_type_index](ctx);

    const block = {
      c: function create() {
        if_block.c();
        if_block_anchor = empty();
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        if_blocks[current_block_type_index].m(target, anchor);
        insert_dev(target, if_block_anchor, anchor);
        current = true;

        if (!mounted) {
          dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[22]);
          mounted = true;
        }
      },
      p: function update(ctx, dirty) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx);

        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx, dirty);
        } else {
          group_outros();

          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });

          check_outros();
          if_block = if_blocks[current_block_type_index];

          if (!if_block) {
            if_block = if_blocks[current_block_type_index] =
              if_block_creators[current_block_type_index](ctx);
            if_block.c();
          } else {
            if_block.p(ctx, dirty);
          }

          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(if_block);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block);
        current = false;
      },
      d: function destroy(detaching) {
        if_blocks[current_block_type_index].d(detaching);
        if (detaching) detach_dev(if_block_anchor);
        mounted = false;
        dispose();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$1.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$1($$self, $$props, $$invalidate) {
    let mobile;
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("Room", slots, []);
    let { params = null } = $$props;
    let { navigate = null } = $$props;
    let { socket = null } = $$props;
    let innerWidth = 0;
    let roomChannel = null;
    let presence = null;
    let roomPresence = [];
    let isLoading = true;
    let playerType = PlayerType$1.SPECTATOR;
    let chessBoard = null;
    let hasSent = false;
    let nextTurn = null;
    let playerTime = 100;
    let opponentTime = 100;
    let increment = 0;
    let status = RoomStatus$1.SETUP;
    let isTicking = false;
    let openGameFinishedModal = gameFinished();

    onMount(async () => {
      await handleJoinLobby();
    });

    onDestroy(async () => {
      await leaveRoom();
    });

    async function handleJoinLobby() {
      roomChannel = socket.channel(`room:${params.roomId}`, {
        userId: params.id !== undefined ? params.id : null,
      });

      roomChannel
        .join()
        .receive("ok", (resp) => {
          presence = new Presence(roomChannel);

          if (presence)
            presence.onSync(() => {
              $$invalidate(1, (roomPresence = []));

              presence.list((_id, idk) => {
                $$invalidate(1, (roomPresence = [...roomPresence, idk]));
              });
            });

          $$invalidate(3, (playerType = PlayerType$1[resp.color]));
          $$invalidate(
            4,
            (chessBoard = ChessBoard.deserializeBoard(resp.board, playerType))
          );
          $$invalidate(5, (nextTurn = PlayerType$1[resp.nextTurn]));
          increment = resp.increment;
          $$invalidate(8, (status = RoomStatus$1[resp.status]));

          if (playerType === PlayerType$1.BLACK) {
            $$invalidate(6, (playerTime = resp.blackTime));
            $$invalidate(7, (opponentTime = resp.whiteTime));
          } else {
            $$invalidate(6, (playerTime = resp.whiteTime));
            $$invalidate(7, (opponentTime = resp.blackTime));
          }

          if (!gameFinished() && status !== RoomStatus$1.SETUP && !isTicking) {
            // addLatency();
            tickTime(750);
          }

          if (gameFinished()) $$invalidate(9, (openGameFinishedModal = true));
          $$invalidate(2, (isLoading = false));
        })
        .receive("error", async (resp) => {
          console.log(resp);
          await leaveRoom();
          navigate("/chess/404");
        });

      roomChannel.on("move", (resp) => {
        if (gameFinished()) return;

        if (hasSent) {
          hasSent = false;
        } else {
          $$invalidate(
            4,
            (chessBoard = ChessBoard.deserializeBoard(resp.board, playerType))
          );
        }

        $$invalidate(5, (nextTurn = PlayerType$1[resp.nextTurn]));

        if (nextTurn === playerType) {
          const isFinished = ChessBoard.isFinished(
            ChessColor$1[resp.nextTurn],
            chessBoard
          );
          if (isFinished === Finished$1.MATE) roomChannel.push("loss", {});
          if (isFinished === Finished$1.STALEMATE)
            roomChannel.push("remis", { forced: true });
        }

        incrementTime();
        if (status === RoomStatus$1.SETUP && !isTicking) tickTime(1000);
        $$invalidate(8, (status = RoomStatus$1.PLAYING));
      });

      roomChannel.on("finished", (resp) => {
        $$invalidate(8, (status = RoomStatus$1[resp.winner]));
        $$invalidate(9, (openGameFinishedModal = true));
      });

      roomChannel.on("aborted", () => {
        $$invalidate(8, (status = RoomStatus$1.ABORTED));
        $$invalidate(9, (openGameFinishedModal = true));
      });

      roomChannel.on("remis_request", (resp) => {
        if (
          playerType !== PlayerType$1.SPECTATOR &&
          playerType !== PlayerType$1[resp.color]
        ) {
          $$invalidate(8, (status = RoomStatus$1.REMIS_REQUESTED));
          message.set("Opponent offered remis");
        }
      });

      roomChannel.on("remis", (resp) => {
        if (resp.decline) $$invalidate(8, (status = RoomStatus$1.PLAYING));
        else {
          $$invalidate(8, (status = RoomStatus$1.REMIS));
          $$invalidate(9, (openGameFinishedModal = true));
        }
      });
    }

    async function leaveRoom() {
      return new Promise((res, rej) => {
        if (!roomChannel) res();

        roomChannel
          .leave()
          .receive("ok", () => {
            roomChannel = null;
            res();
          })
          .receive("error", () => rej());
      });
    }

    function handleMove(e) {
      if (!gameFinished()) {
        roomChannel.push("move", { board: e.detail });
        hasSent = true;
      }
    }

    function handleAbort() {
      if (roomChannel) roomChannel.push("abort", {});
    }

    function handleRemis() {
      if (roomChannel) roomChannel.push("remis", {});
    }

    function handleRemisDecline() {
      if (roomChannel) roomChannel.push("remis", { decline: true });
    }

    function handleResign() {
      if (roomChannel) roomChannel.push("loss", {});
    }

    function handleTimeout() {
      if (roomChannel) roomChannel.push("timeout", {});
    }

    function tickTime(timeout) {
      if (gameFinished()) return;

      if (nextTurn === playerType || playerType === PlayerType$1.SPECTATOR) {
        if (playerTime > 0) $$invalidate(6, (playerTime -= 1));
      } else {
        if (opponentTime > 0) $$invalidate(7, (opponentTime -= 1));
      }

      if (roomChannel && (playerTime <= 0 || opponentTime <= 0))
        roomChannel.push("expired", {});
      if (!isTicking) isTicking = true;
      setTimeout(() => tickTime(1000), timeout);
    }

    function incrementTime() {
      if (gameFinished()) return;

      if (nextTurn === playerType || playerType === PlayerType$1.SPECTATOR) {
        $$invalidate(7, (opponentTime += increment));
      } else {
        $$invalidate(6, (playerTime += increment));
      }
    }

    function gameFinished() {
      return (
        status === RoomStatus$1.WHITE ||
        status === RoomStatus$1.BLACK ||
        status === RoomStatus$1.ABORTED ||
        status === RoomStatus$1.REMIS
      );
    }

    function closeModal() {
      $$invalidate(9, (openGameFinishedModal = false));
    }

    function handleReturn() {
      navigate("/chess");
    }

    const writable_props = ["params", "navigate", "socket"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console_1.warn(`<Room> was created with unknown prop '${key}'`);
    });

    function onwindowresize() {
      $$invalidate(0, (innerWidth = window.innerWidth));
    }

    $$self.$$set = ($$props) => {
      if ("params" in $$props) $$invalidate(19, (params = $$props.params));
      if ("navigate" in $$props)
        $$invalidate(20, (navigate = $$props.navigate));
      if ("socket" in $$props) $$invalidate(21, (socket = $$props.socket));
    };

    $$self.$capture_state = () => ({
      Presence,
      onDestroy,
      onMount,
      Board,
      Clock,
      GameFinishedModal,
      ChessColor: ChessColor$1,
      Finished: Finished$1,
      PlayerType: PlayerType$1,
      RoomStatus: RoomStatus$1,
      ChessBoard,
      message,
      params,
      navigate,
      socket,
      innerWidth,
      roomChannel,
      presence,
      roomPresence,
      isLoading,
      playerType,
      chessBoard,
      hasSent,
      nextTurn,
      playerTime,
      opponentTime,
      increment,
      status,
      isTicking,
      openGameFinishedModal,
      handleJoinLobby,
      leaveRoom,
      handleMove,
      handleAbort,
      handleRemis,
      handleRemisDecline,
      handleResign,
      handleTimeout,
      tickTime,
      incrementTime,
      gameFinished,
      closeModal,
      handleReturn,
      mobile,
    });

    $$self.$inject_state = ($$props) => {
      if ("params" in $$props) $$invalidate(19, (params = $$props.params));
      if ("navigate" in $$props)
        $$invalidate(20, (navigate = $$props.navigate));
      if ("socket" in $$props) $$invalidate(21, (socket = $$props.socket));
      if ("innerWidth" in $$props)
        $$invalidate(0, (innerWidth = $$props.innerWidth));
      if ("roomChannel" in $$props) roomChannel = $$props.roomChannel;
      if ("presence" in $$props) presence = $$props.presence;
      if ("roomPresence" in $$props)
        $$invalidate(1, (roomPresence = $$props.roomPresence));
      if ("isLoading" in $$props)
        $$invalidate(2, (isLoading = $$props.isLoading));
      if ("playerType" in $$props)
        $$invalidate(3, (playerType = $$props.playerType));
      if ("chessBoard" in $$props)
        $$invalidate(4, (chessBoard = $$props.chessBoard));
      if ("hasSent" in $$props) hasSent = $$props.hasSent;
      if ("nextTurn" in $$props) $$invalidate(5, (nextTurn = $$props.nextTurn));
      if ("playerTime" in $$props)
        $$invalidate(6, (playerTime = $$props.playerTime));
      if ("opponentTime" in $$props)
        $$invalidate(7, (opponentTime = $$props.opponentTime));
      if ("increment" in $$props) increment = $$props.increment;
      if ("status" in $$props) $$invalidate(8, (status = $$props.status));
      if ("isTicking" in $$props) isTicking = $$props.isTicking;
      if ("openGameFinishedModal" in $$props)
        $$invalidate(
          9,
          (openGameFinishedModal = $$props.openGameFinishedModal)
        );
      if ("mobile" in $$props) $$invalidate(10, (mobile = $$props.mobile));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    $$self.$$.update = () => {
      if ($$self.$$.dirty[0] & /*innerWidth*/ 1) {
        $$invalidate(10, (mobile = innerWidth < 1500));
      }
    };

    return [
      innerWidth,
      roomPresence,
      isLoading,
      playerType,
      chessBoard,
      nextTurn,
      playerTime,
      opponentTime,
      status,
      openGameFinishedModal,
      mobile,
      handleMove,
      handleAbort,
      handleRemis,
      handleRemisDecline,
      handleResign,
      handleTimeout,
      closeModal,
      handleReturn,
      params,
      navigate,
      socket,
      onwindowresize,
    ];
  }

  class Room extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(
        this,
        options,
        instance$1,
        create_fragment$1,
        safe_not_equal,
        { params: 19, navigate: 20, socket: 21 },
        null,
        [-1, -1]
      );

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Room",
        options,
        id: create_fragment$1.name,
      });
    }

    get params() {
      throw new Error(
        "<Room>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set params(value) {
      throw new Error(
        "<Room>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get navigate() {
      throw new Error(
        "<Room>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set navigate(value) {
      throw new Error(
        "<Room>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get socket() {
      throw new Error(
        "<Room>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set socket(value) {
      throw new Error(
        "<Room>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  /* src/App.svelte generated by Svelte v3.50.1 */
  const file = "src/App.svelte";

  // (43:0) {:else}
  function create_else_block(ctx) {
    let div;

    const block = {
      c: function create() {
        div = element("div");
        div.textContent = "...";
        attr_dev(div, "class", "svelte-c8gbf1");
        add_location(div, file, 44, 2, 1337);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
      },
      p: noop,
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_else_block.name,
      type: "else",
      source: "(43:0) {:else}",
      ctx,
    });

    return block;
  }

  // (20:0) {#if socket && socket.isConnected}
  function create_if_block(ctx) {
    let router;
    let current;

    router = new Router$1({
      props: {
        $$slots: { default: [create_default_slot] },
        $$scope: { ctx },
      },
      $$inline: true,
    });

    const block = {
      c: function create() {
        create_component(router.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(router, target, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        const router_changes = {};

        if (dirty & /*$$scope, socket*/ 9) {
          router_changes.$$scope = { dirty, ctx };
        }

        router.$set(router_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(router.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(router.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(router, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block.name,
      type: "if",
      source: "(20:0) {#if socket && socket.isConnected}",
      ctx,
    });

    return block;
  }

  // (23:6) <Route path="/chess" let:navigate>
  function create_default_slot_6(ctx) {
    let home;
    let current;

    home = new Home({
      props: {
        socket: /*socket*/ ctx[0],
        navigate: /*navigate*/ ctx[1],
      },
      $$inline: true,
    });

    const block = {
      c: function create() {
        create_component(home.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(home, target, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        const home_changes = {};
        if (dirty & /*socket*/ 1) home_changes.socket = /*socket*/ ctx[0];
        if (dirty & /*navigate*/ 2) home_changes.navigate = /*navigate*/ ctx[1];
        home.$set(home_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(home.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(home.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(home, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_default_slot_6.name,
      type: "slot",
      source: '(23:6) <Route path=\\"/chess\\" let:navigate>',
      ctx,
    });

    return block;
  }

  // (26:6) <Route path="/chess/lobby/:lobbyId" let:navigate let:params>
  function create_default_slot_5(ctx) {
    let lobbylinked;
    let current;

    lobbylinked = new LobbyLinked({
      props: {
        socket: /*socket*/ ctx[0],
        navigate: /*navigate*/ ctx[1],
        params: /*params*/ ctx[2],
      },
      $$inline: true,
    });

    const block = {
      c: function create() {
        create_component(lobbylinked.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(lobbylinked, target, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        const lobbylinked_changes = {};
        if (dirty & /*socket*/ 1)
          lobbylinked_changes.socket = /*socket*/ ctx[0];
        if (dirty & /*navigate*/ 2)
          lobbylinked_changes.navigate = /*navigate*/ ctx[1];
        if (dirty & /*params*/ 4)
          lobbylinked_changes.params = /*params*/ ctx[2];
        lobbylinked.$set(lobbylinked_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(lobbylinked.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(lobbylinked.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(lobbylinked, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_default_slot_5.name,
      type: "slot",
      source:
        '(26:6) <Route path=\\"/chess/lobby/:lobbyId\\" let:navigate let:params>',
      ctx,
    });

    return block;
  }

  // (29:6) <Route path="/chess/:roomId/:id" let:navigate let:params>
  function create_default_slot_4(ctx) {
    let room;
    let current;

    room = new Room({
      props: {
        socket: /*socket*/ ctx[0],
        navigate: /*navigate*/ ctx[1],
        params: /*params*/ ctx[2],
      },
      $$inline: true,
    });

    const block = {
      c: function create() {
        create_component(room.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(room, target, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        const room_changes = {};
        if (dirty & /*socket*/ 1) room_changes.socket = /*socket*/ ctx[0];
        if (dirty & /*navigate*/ 2) room_changes.navigate = /*navigate*/ ctx[1];
        if (dirty & /*params*/ 4) room_changes.params = /*params*/ ctx[2];
        room.$set(room_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(room.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(room.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(room, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_default_slot_4.name,
      type: "slot",
      source:
        '(29:6) <Route path=\\"/chess/:roomId/:id\\" let:navigate let:params>',
      ctx,
    });

    return block;
  }

  // (32:6) <Route path="/chess/:roomId/" let:navigate let:params>
  function create_default_slot_3(ctx) {
    let room;
    let current;

    room = new Room({
      props: {
        socket: /*socket*/ ctx[0],
        navigate: /*navigate*/ ctx[1],
        params: /*params*/ ctx[2],
      },
      $$inline: true,
    });

    const block = {
      c: function create() {
        create_component(room.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(room, target, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        const room_changes = {};
        if (dirty & /*socket*/ 1) room_changes.socket = /*socket*/ ctx[0];
        if (dirty & /*navigate*/ 2) room_changes.navigate = /*navigate*/ ctx[1];
        if (dirty & /*params*/ 4) room_changes.params = /*params*/ ctx[2];
        room.$set(room_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(room.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(room.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(room, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_default_slot_3.name,
      type: "slot",
      source:
        '(32:6) <Route path=\\"/chess/:roomId/\\" let:navigate let:params>',
      ctx,
    });

    return block;
  }

  // (35:6) <Route path="/chess/404" let:navigate>
  function create_default_slot_2(ctx) {
    let notfound;
    let current;

    notfound = new NotFound({
      props: { navigate: /*navigate*/ ctx[1] },
      $$inline: true,
    });

    const block = {
      c: function create() {
        create_component(notfound.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(notfound, target, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        const notfound_changes = {};
        if (dirty & /*navigate*/ 2)
          notfound_changes.navigate = /*navigate*/ ctx[1];
        notfound.$set(notfound_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(notfound.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(notfound.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(notfound, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_default_slot_2.name,
      type: "slot",
      source: '(35:6) <Route path=\\"/chess/404\\" let:navigate>',
      ctx,
    });

    return block;
  }

  // (38:6) <Route path="*" let:navigate>
  function create_default_slot_1(ctx) {
    let notfound;
    let current;

    notfound = new NotFound({
      props: { navigate: /*navigate*/ ctx[1] },
      $$inline: true,
    });

    const block = {
      c: function create() {
        create_component(notfound.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(notfound, target, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        const notfound_changes = {};
        if (dirty & /*navigate*/ 2)
          notfound_changes.navigate = /*navigate*/ ctx[1];
        notfound.$set(notfound_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(notfound.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(notfound.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(notfound, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_default_slot_1.name,
      type: "slot",
      source: '(38:6) <Route path=\\"*\\" let:navigate>',
      ctx,
    });

    return block;
  }

  // (21:2) <Router>
  function create_default_slot(ctx) {
    let div;
    let route0;
    let t0;
    let route1;
    let t1;
    let route2;
    let t2;
    let route3;
    let t3;
    let route4;
    let t4;
    let route5;
    let current;

    route0 = new Route$1({
      props: {
        path: "/chess",
        $$slots: {
          default: [
            create_default_slot_6,
            ({ navigate }) => ({ 1: navigate }),
            ({ navigate }) => (navigate ? 2 : 0),
          ],
        },
        $$scope: { ctx },
      },
      $$inline: true,
    });

    route1 = new Route$1({
      props: {
        path: "/chess/lobby/:lobbyId",
        $$slots: {
          default: [
            create_default_slot_5,
            ({ navigate, params }) => ({ 1: navigate, 2: params }),
            ({ navigate, params }) => (navigate ? 2 : 0) | (params ? 4 : 0),
          ],
        },
        $$scope: { ctx },
      },
      $$inline: true,
    });

    route2 = new Route$1({
      props: {
        path: "/chess/:roomId/:id",
        $$slots: {
          default: [
            create_default_slot_4,
            ({ navigate, params }) => ({ 1: navigate, 2: params }),
            ({ navigate, params }) => (navigate ? 2 : 0) | (params ? 4 : 0),
          ],
        },
        $$scope: { ctx },
      },
      $$inline: true,
    });

    route3 = new Route$1({
      props: {
        path: "/chess/:roomId/",
        $$slots: {
          default: [
            create_default_slot_3,
            ({ navigate, params }) => ({ 1: navigate, 2: params }),
            ({ navigate, params }) => (navigate ? 2 : 0) | (params ? 4 : 0),
          ],
        },
        $$scope: { ctx },
      },
      $$inline: true,
    });

    route4 = new Route$1({
      props: {
        path: "/chess/404",
        $$slots: {
          default: [
            create_default_slot_2,
            ({ navigate }) => ({ 1: navigate }),
            ({ navigate }) => (navigate ? 2 : 0),
          ],
        },
        $$scope: { ctx },
      },
      $$inline: true,
    });

    route5 = new Route$1({
      props: {
        path: "*",
        $$slots: {
          default: [
            create_default_slot_1,
            ({ navigate }) => ({ 1: navigate }),
            ({ navigate }) => (navigate ? 2 : 0),
          ],
        },
        $$scope: { ctx },
      },
      $$inline: true,
    });

    const block = {
      c: function create() {
        div = element("div");
        create_component(route0.$$.fragment);
        t0 = space();
        create_component(route1.$$.fragment);
        t1 = space();
        create_component(route2.$$.fragment);
        t2 = space();
        create_component(route3.$$.fragment);
        t3 = space();
        create_component(route4.$$.fragment);
        t4 = space();
        create_component(route5.$$.fragment);
        attr_dev(div, "class", "svelte-c8gbf1");
        add_location(div, file, 21, 4, 613);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        mount_component(route0, div, null);
        append_dev(div, t0);
        mount_component(route1, div, null);
        append_dev(div, t1);
        mount_component(route2, div, null);
        append_dev(div, t2);
        mount_component(route3, div, null);
        append_dev(div, t3);
        mount_component(route4, div, null);
        append_dev(div, t4);
        mount_component(route5, div, null);
        current = true;
      },
      p: function update(ctx, dirty) {
        const route0_changes = {};

        if (dirty & /*$$scope, socket, navigate*/ 11) {
          route0_changes.$$scope = { dirty, ctx };
        }

        route0.$set(route0_changes);
        const route1_changes = {};

        if (dirty & /*$$scope, socket, navigate, params*/ 15) {
          route1_changes.$$scope = { dirty, ctx };
        }

        route1.$set(route1_changes);
        const route2_changes = {};

        if (dirty & /*$$scope, socket, navigate, params*/ 15) {
          route2_changes.$$scope = { dirty, ctx };
        }

        route2.$set(route2_changes);
        const route3_changes = {};

        if (dirty & /*$$scope, socket, navigate, params*/ 15) {
          route3_changes.$$scope = { dirty, ctx };
        }

        route3.$set(route3_changes);
        const route4_changes = {};

        if (dirty & /*$$scope, navigate*/ 10) {
          route4_changes.$$scope = { dirty, ctx };
        }

        route4.$set(route4_changes);
        const route5_changes = {};

        if (dirty & /*$$scope, navigate*/ 10) {
          route5_changes.$$scope = { dirty, ctx };
        }

        route5.$set(route5_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(route0.$$.fragment, local);
        transition_in(route1.$$.fragment, local);
        transition_in(route2.$$.fragment, local);
        transition_in(route3.$$.fragment, local);
        transition_in(route4.$$.fragment, local);
        transition_in(route5.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(route0.$$.fragment, local);
        transition_out(route1.$$.fragment, local);
        transition_out(route2.$$.fragment, local);
        transition_out(route3.$$.fragment, local);
        transition_out(route4.$$.fragment, local);
        transition_out(route5.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        destroy_component(route0);
        destroy_component(route1);
        destroy_component(route2);
        destroy_component(route3);
        destroy_component(route4);
        destroy_component(route5);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_default_slot.name,
      type: "slot",
      source: "(21:2) <Router>",
      ctx,
    });

    return block;
  }

  function create_fragment(ctx) {
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    const if_block_creators = [create_if_block, create_else_block];
    const if_blocks = [];

    function select_block_type(ctx, dirty) {
      if (/*socket*/ ctx[0] && /*socket*/ ctx[0].isConnected) return 0;
      return 1;
    }

    current_block_type_index = select_block_type(ctx);
    if_block = if_blocks[current_block_type_index] =
      if_block_creators[current_block_type_index](ctx);

    const block = {
      c: function create() {
        if_block.c();
        if_block_anchor = empty();
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        if_blocks[current_block_type_index].m(target, anchor);
        insert_dev(target, if_block_anchor, anchor);
        current = true;
      },
      p: function update(ctx, [dirty]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx);

        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx, dirty);
        } else {
          group_outros();

          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });

          check_outros();
          if_block = if_blocks[current_block_type_index];

          if (!if_block) {
            if_block = if_blocks[current_block_type_index] =
              if_block_creators[current_block_type_index](ctx);
            if_block.c();
          } else {
            if_block.p(ctx, dirty);
          }

          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(if_block);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block);
        current = false;
      },
      d: function destroy(detaching) {
        if_blocks[current_block_type_index].d(detaching);
        if (detaching) detach_dev(if_block_anchor);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("App", slots, []);
    let socket = null;

    onMount(() => {
      $$invalidate(
        0,
        (socket = new Socket("wss://elixirapi.me:30000/chesssocket", {
          params: { userId: "anonymous" },
        }))
      );
      socket.connect();
    });

    onDestroy(() => {
      socket.disconnect();
    });

    const writable_props = [];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<App> was created with unknown prop '${key}'`);
    });

    $$self.$capture_state = () => ({
      Socket,
      onDestroy,
      onMount,
      Router: Router$1,
      Route: Route$1,
      Home,
      LobbyLinked,
      NotFound,
      Room,
      socket,
    });

    $$self.$inject_state = ($$props) => {
      if ("socket" in $$props) $$invalidate(0, (socket = $$props.socket));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [socket];
  }

  class App extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance, create_fragment, safe_not_equal, {});

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "App",
        options,
        id: create_fragment.name,
      });
    }
  }

  const app = new App({
    target: document.body,
    props: {
      name: "world",
    },
  });

  return app;
})();
//# sourceMappingURL=bundle.js.map
