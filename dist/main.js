let $b3e7e8c1a3c43eb7$var$stack = [];
function $b3e7e8c1a3c43eb7$export$bdd553fddd433dcb(callback = ()=>{}) {
    queueMicrotask(()=>{
        setTimeout(()=>$b3e7e8c1a3c43eb7$var$releaseNextTicks());
    });
    return new Promise((res)=>{
        $b3e7e8c1a3c43eb7$var$stack.push(()=>{
            callback();
            res();
        });
    });
}
function $b3e7e8c1a3c43eb7$var$releaseNextTicks() {
    while($b3e7e8c1a3c43eb7$var$stack.length)$b3e7e8c1a3c43eb7$var$stack.shift()();
}


function $8f9b49c1a83abf36$export$588732934346abbf(el, callback) {
    let skip = false;
    callback(el, ()=>skip = true);
    if (skip) return;
    let node = el.firstElementChild;
    while(node){
        $8f9b49c1a83abf36$export$588732934346abbf(node, callback, false);
        node = node.nextElementSibling;
    }
}




let $48a071f4e22bc27f$var$flushPending = false;
let $48a071f4e22bc27f$var$flushing = false;
let $48a071f4e22bc27f$var$queue = [];
let $48a071f4e22bc27f$var$lastFlushedIndex = -1;
function $48a071f4e22bc27f$export$fba1a0a20887772f(job) {
    if (!$48a071f4e22bc27f$var$queue.includes(job)) $48a071f4e22bc27f$var$queue.push(job);
    $48a071f4e22bc27f$var$queueFlush();
}
function $48a071f4e22bc27f$var$queueFlush() {
    if (!$48a071f4e22bc27f$var$flushing && !$48a071f4e22bc27f$var$flushPending) {
        $48a071f4e22bc27f$var$flushPending = true;
        queueMicrotask($48a071f4e22bc27f$export$8ca066e62735a16c);
    }
}
function $48a071f4e22bc27f$export$8ca066e62735a16c() {
    $48a071f4e22bc27f$var$flushPending = false;
    $48a071f4e22bc27f$var$flushing = true;
    for(let i = 0; i < $48a071f4e22bc27f$var$queue.length; i++){
        $48a071f4e22bc27f$var$queue[i]();
        $48a071f4e22bc27f$var$lastFlushedIndex = i;
    }
    $48a071f4e22bc27f$var$queue.length = 0;
    $48a071f4e22bc27f$var$lastFlushedIndex = -1;
    $48a071f4e22bc27f$var$flushing = false;
}


function $42a4c9f2d525081f$export$7e6f8094deb93e61(controller, callback) {
    const values = controller.constructor.values || {};
    let observing = false;
    const changeCallbacks = Object.keys(values).map((key)=>{
        const callbackName = `${key}ValueChanged`;
        const controllerCallback = controller[callbackName];
        const monkeyPatchedCallback = function(value, previousValue) {
            if (observing) callback(key, value, previousValue, this);
            if (typeof controllerCallback === "function") controllerCallback.call(this, value, previousValue);
        };
        return [
            callbackName,
            monkeyPatchedCallback.bind(controller)
        ];
    });
    Object.assign(controller, Object.fromEntries(changeCallbacks));
    return {
        start () {
            observing = true;
        },
        stop () {
            observing = false;
        }
    };
}


function $9ac3f1e21fdbcee2$export$1530b8c0a3516a7d(controller, callback) {
    let observing = false;
    const { element: element } = controller;
    const filterElementNodes = (nodes)=>Array.from(nodes).filter((node)=>node.nodeType !== 3);
    const onMutate = (mutationList)=>{
        const removedNodes = [];
        const addedNodes = [];
        mutationList.forEach((mutation)=>{
            if (mutation.type === "childList") {
                removedNodes.push(...filterElementNodes(mutation.removedNodes));
                addedNodes.push(...filterElementNodes(mutation.addedNodes));
            }
        });
        if (addedNodes.length || removedNodes.length) callback(addedNodes, removedNodes);
    };
    const observer = new MutationObserver(onMutate);
    return {
        start () {
            if (!observing) {
                observer.observe(element, {
                    childList: true,
                    subtree: true
                });
                observing = true;
            }
        },
        stop () {
            if (observing) {
                const mutations = observer.takeRecords();
                if (mutations.length > 0) onMutate(mutations);
                observer.disconnect();
                observing = false;
            }
        },
        runWithoutObservation (callback) {
            this.stop();
            callback();
            this.start();
        }
    };
}




const $e831555dc9bb4016$var$isObject = (value)=>{
    const type = typeof value;
    return value !== null && (type === 'object' || type === 'function');
};
const $e831555dc9bb4016$var$isEmptyObject = (value)=>$e831555dc9bb4016$var$isObject(value) && Object.keys(value).length === 0;
const $e831555dc9bb4016$var$disallowedKeys = new Set([
    '__proto__',
    'prototype',
    'constructor'
]);
const $e831555dc9bb4016$var$digits = new Set('0123456789');
function $e831555dc9bb4016$var$getPathSegments(path) {
    const parts = [];
    let currentSegment = '';
    let currentPart = 'start';
    let isIgnoring = false;
    for (const character of path)switch(character){
        case '\\':
            if (currentPart === 'index') throw new Error('Invalid character in an index');
            if (currentPart === 'indexEnd') throw new Error('Invalid character after an index');
            if (isIgnoring) currentSegment += character;
            currentPart = 'property';
            isIgnoring = !isIgnoring;
            break;
        case '.':
            if (currentPart === 'index') throw new Error('Invalid character in an index');
            if (currentPart === 'indexEnd') {
                currentPart = 'property';
                break;
            }
            if (isIgnoring) {
                isIgnoring = false;
                currentSegment += character;
                break;
            }
            if ($e831555dc9bb4016$var$disallowedKeys.has(currentSegment)) return [];
            parts.push(currentSegment);
            currentSegment = '';
            currentPart = 'property';
            break;
        case '[':
            if (currentPart === 'index') throw new Error('Invalid character in an index');
            if (currentPart === 'indexEnd') {
                currentPart = 'index';
                break;
            }
            if (isIgnoring) {
                isIgnoring = false;
                currentSegment += character;
                break;
            }
            if (currentPart === 'property') {
                if ($e831555dc9bb4016$var$disallowedKeys.has(currentSegment)) return [];
                parts.push(currentSegment);
                currentSegment = '';
            }
            currentPart = 'index';
            break;
        case ']':
            if (currentPart === 'index') {
                parts.push(Number.parseInt(currentSegment, 10));
                currentSegment = '';
                currentPart = 'indexEnd';
                break;
            }
            if (currentPart === 'indexEnd') throw new Error('Invalid character after an index');
        default:
            if (currentPart === 'index' && !$e831555dc9bb4016$var$digits.has(character)) throw new Error('Invalid character in an index');
            if (currentPart === 'indexEnd') throw new Error('Invalid character after an index');
            if (currentPart === 'start') currentPart = 'property';
            if (isIgnoring) {
                isIgnoring = false;
                currentSegment += '\\';
            }
            currentSegment += character;
    }
    if (isIgnoring) currentSegment += '\\';
    switch(currentPart){
        case 'property':
            if ($e831555dc9bb4016$var$disallowedKeys.has(currentSegment)) return [];
            parts.push(currentSegment);
            break;
        case 'index':
            throw new Error('Index was not closed');
        case 'start':
            parts.push('');
            break;
    }
    return parts;
}
function $e831555dc9bb4016$var$isStringIndex(object, key) {
    if (typeof key !== 'number' && Array.isArray(object)) {
        const index = Number.parseInt(key, 10);
        return Number.isInteger(index) && object[index] === object[key];
    }
    return false;
}
function $e831555dc9bb4016$var$assertNotStringIndex(object, key) {
    if ($e831555dc9bb4016$var$isStringIndex(object, key)) throw new Error('Cannot use string index');
}
function $e831555dc9bb4016$export$63ef76b19cf4a753(object, path, value) {
    if (!$e831555dc9bb4016$var$isObject(object) || typeof path !== 'string') return value === undefined ? object : value;
    const pathArray = $e831555dc9bb4016$var$getPathSegments(path);
    if (pathArray.length === 0) return value;
    for(let index = 0; index < pathArray.length; index++){
        const key = pathArray[index];
        if ($e831555dc9bb4016$var$isStringIndex(object, key)) object = index === pathArray.length - 1 ? undefined : null;
        else object = object[key];
        if (object === undefined || object === null) {
            // `object` is either `undefined` or `null` so we want to stop the loop, and
            // if this is not the last bit of the path, and
            // if it didn't return `undefined`
            // it would return `null` if `object` is `null`
            // but we want `get({foo: null}, 'foo.bar')` to equal `undefined`, or the supplied value, not `null`
            if (index !== pathArray.length - 1) return value;
            break;
        }
    }
    return object === undefined ? value : object;
}
function $e831555dc9bb4016$export$a41c68a4eb5ff164(object, path, value) {
    if (!$e831555dc9bb4016$var$isObject(object) || typeof path !== 'string') return object;
    const root = object;
    const pathArray = $e831555dc9bb4016$var$getPathSegments(path);
    for(let index = 0; index < pathArray.length; index++){
        const key = pathArray[index];
        $e831555dc9bb4016$var$assertNotStringIndex(object, key);
        if (index === pathArray.length - 1) object[key] = value;
        else if (!$e831555dc9bb4016$var$isObject(object[key])) object[key] = typeof pathArray[index + 1] === 'number' ? [] : {};
        object = object[key];
    }
    return root;
}
function $e831555dc9bb4016$export$2fae62fb628b9c68(object, path) {
    if (!$e831555dc9bb4016$var$isObject(object) || typeof path !== 'string') return false;
    const pathArray = $e831555dc9bb4016$var$getPathSegments(path);
    for(let index = 0; index < pathArray.length; index++){
        const key = pathArray[index];
        $e831555dc9bb4016$var$assertNotStringIndex(object, key);
        if (index === pathArray.length - 1) {
            delete object[key];
            return true;
        }
        object = object[key];
        if (!$e831555dc9bb4016$var$isObject(object)) return false;
    }
}
function $e831555dc9bb4016$export$bf9617eaf5d2451(object, path) {
    if (!$e831555dc9bb4016$var$isObject(object) || typeof path !== 'string') return false;
    const pathArray = $e831555dc9bb4016$var$getPathSegments(path);
    if (pathArray.length === 0) return false;
    for (const key of pathArray){
        if (!$e831555dc9bb4016$var$isObject(object) || !(key in object) || $e831555dc9bb4016$var$isStringIndex(object, key)) return false;
        object = object[key];
    }
    return true;
}
function $e831555dc9bb4016$export$b36556ce4a09dde6(path) {
    if (typeof path !== 'string') throw new TypeError('Expected a string');
    return path.replaceAll(/[\\.[]/g, '\\$&');
}
// The keys returned by Object.entries() for arrays are strings
function $e831555dc9bb4016$var$entries(value) {
    const result = Object.entries(value);
    if (Array.isArray(value)) return result.map(([key, value])=>[
            Number(key),
            value
        ]);
    return result;
}
function $e831555dc9bb4016$var$stringifyPath(pathSegments) {
    let result = '';
    for (let [index, segment] of $e831555dc9bb4016$var$entries(pathSegments))if (typeof segment === 'number') result += `[${segment}]`;
    else {
        segment = $e831555dc9bb4016$export$b36556ce4a09dde6(segment);
        result += index === 0 ? segment : `.${segment}`;
    }
    return result;
}
function* $e831555dc9bb4016$var$deepKeysIterator(object, currentPath = []) {
    if (!$e831555dc9bb4016$var$isObject(object) || $e831555dc9bb4016$var$isEmptyObject(object)) {
        if (currentPath.length > 0) yield $e831555dc9bb4016$var$stringifyPath(currentPath);
        return;
    }
    for (const [key, value] of $e831555dc9bb4016$var$entries(object))yield* $e831555dc9bb4016$var$deepKeysIterator(value, [
        ...currentPath,
        key
    ]);
}
function $e831555dc9bb4016$export$13f626a1d0c23ea1(object) {
    return [
        ...$e831555dc9bb4016$var$deepKeysIterator(object)
    ];
}



function $3f0461988d854c09$export$2706f8d45625eda6(el, value) {
    if (Array.isArray(value)) return $3f0461988d854c09$var$setClassesFromString(el, value.join(" "));
    else if (typeof value === "object" && value !== null) return $3f0461988d854c09$var$setClassesFromObject(el, value);
    return $3f0461988d854c09$var$setClassesFromString(el, value);
}
function $3f0461988d854c09$var$setClassesFromString(el, classString) {
    let missingClasses = (classString)=>classString.split(" ").filter((i)=>!el.classList.contains(i)).filter(Boolean);
    let classes = missingClasses(classString);
    el.classList.add(...classes);
    return ()=>el.classList.remove(...classes);
}
function $3f0461988d854c09$var$setClassesFromObject(el, classObject) {
    let split = (classString)=>classString.split(" ").filter(Boolean);
    let forAdd = Object.entries(classObject).flatMap(([classString, bool])=>bool ? split(classString) : false).filter(Boolean);
    let forRemove = Object.entries(classObject).flatMap(([classString, bool])=>!bool ? split(classString) : false).filter(Boolean);
    let added = [];
    let removed = [];
    forRemove.forEach((i)=>{
        if (el.classList.contains(i)) {
            el.classList.remove(i);
            removed.push(i);
        }
    });
    forAdd.forEach((i)=>{
        if (!el.classList.contains(i)) {
            el.classList.add(i);
            added.push(i);
        }
    });
    return ()=>{
        removed.forEach((i)=>el.classList.add(i));
        added.forEach((i)=>el.classList.remove(i));
    };
}


function $6bb642d3be92d590$export$2385a24977818dd0(element, name, value) {
    switch(name){
        case "class":
            $6bb642d3be92d590$var$bindClasses(element, value);
            break;
        case "all":
            $6bb642d3be92d590$var$bindAll(element, value);
            break;
        case "text":
            $6bb642d3be92d590$var$bindText(element, value);
            break;
        case "html":
            $6bb642d3be92d590$var$bindHTML(element, value);
            break;
        case "checked":
        case "selected":
            $6bb642d3be92d590$var$bindAttributeAndProperty(element, name, value);
            break;
        default:
            $6bb642d3be92d590$var$bindAttribute(element, name, value);
            break;
    }
}
function $6bb642d3be92d590$var$bindClasses(element, value) {
    if (element.__value_bindings_undo_classes) element.__value_bindings_undo_classes();
    element.__value_bindings_undo_classes = (0, $3f0461988d854c09$export$2706f8d45625eda6)(element, value);
}
function $6bb642d3be92d590$var$bindText(element, value) {
    element.textContent = value;
}
function $6bb642d3be92d590$var$bindHTML(element, value) {
    element.innerHTML = value;
}
function $6bb642d3be92d590$var$bindAttribute(el, name, value) {
    if ([
        null,
        undefined,
        false
    ].includes(value) && $6bb642d3be92d590$var$attributeShouldntBePreservedIfFalsy(name)) el.removeAttribute(name);
    else {
        if ($6bb642d3be92d590$var$isBooleanAttr(name)) value = name;
        $6bb642d3be92d590$var$setIfChanged(el, name, value);
    }
}
function $6bb642d3be92d590$var$bindAll(element, obj) {
    Object.keys(obj).forEach((name)=>$6bb642d3be92d590$export$2385a24977818dd0(element, name, (0, $e831555dc9bb4016$export$63ef76b19cf4a753)(obj, name)));
}
function $6bb642d3be92d590$var$bindAttributeAndProperty(el, name, value) {
    $6bb642d3be92d590$var$bindAttribute(el, name, value);
    $6bb642d3be92d590$var$setPropertyIfChanged(el, name, value);
}
function $6bb642d3be92d590$var$setIfChanged(el, attrName, value) {
    if (el.getAttribute(attrName) != value) el.setAttribute(attrName, value);
}
function $6bb642d3be92d590$var$setPropertyIfChanged(el, propName, value) {
    if (el[propName] !== value) el[propName] = value;
}
// As per HTML spec table https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute
const $6bb642d3be92d590$var$booleanAttributes = new Set([
    "allowfullscreen",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "defer",
    "disabled",
    "formnovalidate",
    "inert",
    "ismap",
    "itemscope",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "selected"
]);
function $6bb642d3be92d590$var$isBooleanAttr(attrName) {
    return $6bb642d3be92d590$var$booleanAttributes.has(attrName);
}
function $6bb642d3be92d590$var$attributeShouldntBePreservedIfFalsy(name) {
    return ![
        "aria-pressed",
        "aria-checked",
        "aria-expanded",
        "aria-selected"
    ].includes(name);
}



function $438b9fc6d2bad1a9$export$816b23a2bc3d44ec(controller, callback) {
    const bindings = $438b9fc6d2bad1a9$export$afc479602647d2a4(controller);
    bindings.forEach((binding)=>{
        let { node: node, name: name, path: path, negated: negated } = binding;
        if (!controller.element.contains(node)) // clean up any bindings for elements that have been removed from the DOM
        bindings.delete(binding);
        else {
            $438b9fc6d2bad1a9$var$updateBindingsForNode(controller, node, name, path, negated);
            node.removeAttribute("data-cloak");
        }
    });
    if (typeof callback === "function") // Run the callback once all bindings have been updated.
    callback();
}
function $438b9fc6d2bad1a9$var$updateBindingsForNode(controller, node, name, path, negated) {
    let value = (0, $e831555dc9bb4016$export$63ef76b19cf4a753)(controller, path);
    if (typeof value === "function") value = value.bind(controller)(node);
    (0, $6bb642d3be92d590$export$2385a24977818dd0)(node, name, negated ? !value : value);
}
function $438b9fc6d2bad1a9$export$2696433f89f63f2f(controller) {
    if (!$438b9fc6d2bad1a9$var$bindingsAreInitialized(controller)) {
        controller.__value_bindings = new Set();
        $438b9fc6d2bad1a9$export$9d08f9cef6f4df8b(controller, controller.element);
    }
}
function $438b9fc6d2bad1a9$export$9d08f9cef6f4df8b(controller, rootNode) {
    const attrPrefix = `data-${controller.identifier}-bind`;
    (0, $8f9b49c1a83abf36$export$588732934346abbf)(rootNode, (node)=>{
        Array.from(node.attributes).filter(({ name: name })=>name.startsWith(attrPrefix)).forEach((attr)=>{
            let negated = false;
            let path = attr.value;
            if (path.startsWith("!")) {
                negated = true;
                path = path.replace("!", "");
            }
            const name = attr.name === attrPrefix ? "all" : attr.name.replace(`${attrPrefix}-`, "");
            $438b9fc6d2bad1a9$export$794005cd6f1aea3(controller, node, name, path, negated);
            node.removeAttribute(attr.name);
        });
    });
}
function $438b9fc6d2bad1a9$export$317a120ffaa434e1(controller) {
    $438b9fc6d2bad1a9$export$b7c6f809f4c7570b(controller);
    $438b9fc6d2bad1a9$export$2696433f89f63f2f(controller);
}
function $438b9fc6d2bad1a9$export$794005cd6f1aea3(controller, node, name, path, negated) {
    $438b9fc6d2bad1a9$export$afc479602647d2a4(controller).add({
        node: node,
        name: name,
        path: path,
        negated: negated
    });
}
function $438b9fc6d2bad1a9$export$3eff236524896414(controller, node) {
    const bindings = $438b9fc6d2bad1a9$export$afc479602647d2a4(controller);
    bindings.forEach((binding)=>{
        if (binding.node === node) bindings.delete(binding);
    });
}
function $438b9fc6d2bad1a9$export$b7c6f809f4c7570b(controller) {
    controller.__value_bindings?.clear();
    controller.__value_bindings = new Set();
}
function $438b9fc6d2bad1a9$export$afc479602647d2a4(controller) {
    return controller.__value_bindings;
}
function $438b9fc6d2bad1a9$var$bindingsAreInitialized(controller) {
    return controller.__value_bindings instanceof Set;
}


const $0c4a772011edf2b8$export$d8d8c48ace6d5d1b = (controller)=>{
    let initialUpdateHasRun = false;
    const updateBindingsAndNotify = ()=>{
        (0, $438b9fc6d2bad1a9$export$816b23a2bc3d44ec)(controller, ()=>{
            if (typeof controller.bindingsUpdated === "function") controller.bindingsUpdated(!initialUpdateHasRun);
        });
        initialUpdateHasRun = true;
    };
    const scheduleUpdate = ()=>(0, $48a071f4e22bc27f$export$fba1a0a20887772f)(updateBindingsAndNotify);
    const valuesObserver = (0, $42a4c9f2d525081f$export$7e6f8094deb93e61)(controller, scheduleUpdate);
    const treeObserver = (0, $9ac3f1e21fdbcee2$export$1530b8c0a3516a7d)(controller, (addedNodes, removedNodes)=>{
        removedNodes.forEach((node)=>(0, $438b9fc6d2bad1a9$export$3eff236524896414)(controller, node));
        addedNodes.forEach((node)=>(0, $438b9fc6d2bad1a9$export$9d08f9cef6f4df8b)(controller, node));
        treeObserver.runWithoutObservation(updateBindingsAndNotify);
    });
    (0, $438b9fc6d2bad1a9$export$2696433f89f63f2f)(controller);
    scheduleUpdate();
    const disconnect = controller.disconnect;
    Object.assign(controller, {
        updateBindings: scheduleUpdate,
        disconnect () {
            valuesObserver.stop();
            treeObserver.stop();
            (0, $438b9fc6d2bad1a9$export$b7c6f809f4c7570b)(controller);
            if (typeof disconnect === "function") disconnect.bind(controller)();
        }
    });
    treeObserver.start();
    valuesObserver.start();
};


/*
Stimulus 3.2.1
Copyright © 2023 Basecamp, LLC
 */ class $861a37e0262dfc28$var$EventListener {
    constructor(eventTarget, eventName, eventOptions){
        this.eventTarget = eventTarget;
        this.eventName = eventName;
        this.eventOptions = eventOptions;
        this.unorderedBindings = new Set();
    }
    connect() {
        this.eventTarget.addEventListener(this.eventName, this, this.eventOptions);
    }
    disconnect() {
        this.eventTarget.removeEventListener(this.eventName, this, this.eventOptions);
    }
    bindingConnected(binding) {
        this.unorderedBindings.add(binding);
    }
    bindingDisconnected(binding) {
        this.unorderedBindings.delete(binding);
    }
    handleEvent(event) {
        const extendedEvent = $861a37e0262dfc28$var$extendEvent(event);
        for (const binding of this.bindings){
            if (extendedEvent.immediatePropagationStopped) break;
            else binding.handleEvent(extendedEvent);
        }
    }
    hasBindings() {
        return this.unorderedBindings.size > 0;
    }
    get bindings() {
        return Array.from(this.unorderedBindings).sort((left, right)=>{
            const leftIndex = left.index, rightIndex = right.index;
            return leftIndex < rightIndex ? -1 : leftIndex > rightIndex ? 1 : 0;
        });
    }
}
function $861a37e0262dfc28$var$extendEvent(event) {
    if ("immediatePropagationStopped" in event) return event;
    else {
        const { stopImmediatePropagation: stopImmediatePropagation } = event;
        return Object.assign(event, {
            immediatePropagationStopped: false,
            stopImmediatePropagation () {
                this.immediatePropagationStopped = true;
                stopImmediatePropagation.call(this);
            }
        });
    }
}
class $861a37e0262dfc28$var$Dispatcher {
    constructor(application){
        this.application = application;
        this.eventListenerMaps = new Map();
        this.started = false;
    }
    start() {
        if (!this.started) {
            this.started = true;
            this.eventListeners.forEach((eventListener)=>eventListener.connect());
        }
    }
    stop() {
        if (this.started) {
            this.started = false;
            this.eventListeners.forEach((eventListener)=>eventListener.disconnect());
        }
    }
    get eventListeners() {
        return Array.from(this.eventListenerMaps.values()).reduce((listeners, map)=>listeners.concat(Array.from(map.values())), []);
    }
    bindingConnected(binding) {
        this.fetchEventListenerForBinding(binding).bindingConnected(binding);
    }
    bindingDisconnected(binding, clearEventListeners = false) {
        this.fetchEventListenerForBinding(binding).bindingDisconnected(binding);
        if (clearEventListeners) this.clearEventListenersForBinding(binding);
    }
    handleError(error, message, detail = {}) {
        this.application.handleError(error, `Error ${message}`, detail);
    }
    clearEventListenersForBinding(binding) {
        const eventListener = this.fetchEventListenerForBinding(binding);
        if (!eventListener.hasBindings()) {
            eventListener.disconnect();
            this.removeMappedEventListenerFor(binding);
        }
    }
    removeMappedEventListenerFor(binding) {
        const { eventTarget: eventTarget, eventName: eventName, eventOptions: eventOptions } = binding;
        const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
        const cacheKey = this.cacheKey(eventName, eventOptions);
        eventListenerMap.delete(cacheKey);
        if (eventListenerMap.size == 0) this.eventListenerMaps.delete(eventTarget);
    }
    fetchEventListenerForBinding(binding) {
        const { eventTarget: eventTarget, eventName: eventName, eventOptions: eventOptions } = binding;
        return this.fetchEventListener(eventTarget, eventName, eventOptions);
    }
    fetchEventListener(eventTarget, eventName, eventOptions) {
        const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
        const cacheKey = this.cacheKey(eventName, eventOptions);
        let eventListener = eventListenerMap.get(cacheKey);
        if (!eventListener) {
            eventListener = this.createEventListener(eventTarget, eventName, eventOptions);
            eventListenerMap.set(cacheKey, eventListener);
        }
        return eventListener;
    }
    createEventListener(eventTarget, eventName, eventOptions) {
        const eventListener = new $861a37e0262dfc28$var$EventListener(eventTarget, eventName, eventOptions);
        if (this.started) eventListener.connect();
        return eventListener;
    }
    fetchEventListenerMapForEventTarget(eventTarget) {
        let eventListenerMap = this.eventListenerMaps.get(eventTarget);
        if (!eventListenerMap) {
            eventListenerMap = new Map();
            this.eventListenerMaps.set(eventTarget, eventListenerMap);
        }
        return eventListenerMap;
    }
    cacheKey(eventName, eventOptions) {
        const parts = [
            eventName
        ];
        Object.keys(eventOptions).sort().forEach((key)=>{
            parts.push(`${eventOptions[key] ? "" : "!"}${key}`);
        });
        return parts.join(":");
    }
}
const $861a37e0262dfc28$var$defaultActionDescriptorFilters = {
    stop ({ event: event, value: value }) {
        if (value) event.stopPropagation();
        return true;
    },
    prevent ({ event: event, value: value }) {
        if (value) event.preventDefault();
        return true;
    },
    self ({ event: event, value: value, element: element }) {
        if (value) return element === event.target;
        else return true;
    }
};
const $861a37e0262dfc28$var$descriptorPattern = /^(?:(?:([^.]+?)\+)?(.+?)(?:\.(.+?))?(?:@(window|document))?->)?(.+?)(?:#([^:]+?))(?::(.+))?$/;
function $861a37e0262dfc28$var$parseActionDescriptorString(descriptorString) {
    const source = descriptorString.trim();
    const matches = source.match($861a37e0262dfc28$var$descriptorPattern) || [];
    let eventName = matches[2];
    let keyFilter = matches[3];
    if (keyFilter && ![
        "keydown",
        "keyup",
        "keypress"
    ].includes(eventName)) {
        eventName += `.${keyFilter}`;
        keyFilter = "";
    }
    return {
        eventTarget: $861a37e0262dfc28$var$parseEventTarget(matches[4]),
        eventName: eventName,
        eventOptions: matches[7] ? $861a37e0262dfc28$var$parseEventOptions(matches[7]) : {},
        identifier: matches[5],
        methodName: matches[6],
        keyFilter: matches[1] || keyFilter
    };
}
function $861a37e0262dfc28$var$parseEventTarget(eventTargetName) {
    if (eventTargetName == "window") return window;
    else if (eventTargetName == "document") return document;
}
function $861a37e0262dfc28$var$parseEventOptions(eventOptions) {
    return eventOptions.split(":").reduce((options, token)=>Object.assign(options, {
            [token.replace(/^!/, "")]: !/^!/.test(token)
        }), {});
}
function $861a37e0262dfc28$var$stringifyEventTarget(eventTarget) {
    if (eventTarget == window) return "window";
    else if (eventTarget == document) return "document";
}
function $861a37e0262dfc28$var$camelize(value) {
    return value.replace(/(?:[_-])([a-z0-9])/g, (_, char)=>char.toUpperCase());
}
function $861a37e0262dfc28$var$namespaceCamelize(value) {
    return $861a37e0262dfc28$var$camelize(value.replace(/--/g, "-").replace(/__/g, "_"));
}
function $861a37e0262dfc28$var$capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
function $861a37e0262dfc28$var$dasherize(value) {
    return value.replace(/([A-Z])/g, (_, char)=>`-${char.toLowerCase()}`);
}
function $861a37e0262dfc28$var$tokenize(value) {
    return value.match(/[^\s]+/g) || [];
}
function $861a37e0262dfc28$var$isSomething(object) {
    return object !== null && object !== undefined;
}
function $861a37e0262dfc28$var$hasProperty(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
}
const $861a37e0262dfc28$var$allModifiers = [
    "meta",
    "ctrl",
    "alt",
    "shift"
];
class $861a37e0262dfc28$var$Action {
    constructor(element, index, descriptor, schema){
        this.element = element;
        this.index = index;
        this.eventTarget = descriptor.eventTarget || element;
        this.eventName = descriptor.eventName || $861a37e0262dfc28$var$getDefaultEventNameForElement(element) || $861a37e0262dfc28$var$error("missing event name");
        this.eventOptions = descriptor.eventOptions || {};
        this.identifier = descriptor.identifier || $861a37e0262dfc28$var$error("missing identifier");
        this.methodName = descriptor.methodName || $861a37e0262dfc28$var$error("missing method name");
        this.keyFilter = descriptor.keyFilter || "";
        this.schema = schema;
    }
    static forToken(token, schema) {
        return new this(token.element, token.index, $861a37e0262dfc28$var$parseActionDescriptorString(token.content), schema);
    }
    toString() {
        const eventFilter = this.keyFilter ? `.${this.keyFilter}` : "";
        const eventTarget = this.eventTargetName ? `@${this.eventTargetName}` : "";
        return `${this.eventName}${eventFilter}${eventTarget}->${this.identifier}#${this.methodName}`;
    }
    shouldIgnoreKeyboardEvent(event) {
        if (!this.keyFilter) return false;
        const filters = this.keyFilter.split("+");
        if (this.keyFilterDissatisfied(event, filters)) return true;
        const standardFilter = filters.filter((key)=>!$861a37e0262dfc28$var$allModifiers.includes(key))[0];
        if (!standardFilter) return false;
        if (!$861a37e0262dfc28$var$hasProperty(this.keyMappings, standardFilter)) $861a37e0262dfc28$var$error(`contains unknown key filter: ${this.keyFilter}`);
        return this.keyMappings[standardFilter].toLowerCase() !== event.key.toLowerCase();
    }
    shouldIgnoreMouseEvent(event) {
        if (!this.keyFilter) return false;
        const filters = [
            this.keyFilter
        ];
        if (this.keyFilterDissatisfied(event, filters)) return true;
        return false;
    }
    get params() {
        const params = {};
        const pattern = new RegExp(`^data-${this.identifier}-(.+)-param$`, "i");
        for (const { name: name, value: value } of Array.from(this.element.attributes)){
            const match = name.match(pattern);
            const key = match && match[1];
            if (key) params[$861a37e0262dfc28$var$camelize(key)] = $861a37e0262dfc28$var$typecast(value);
        }
        return params;
    }
    get eventTargetName() {
        return $861a37e0262dfc28$var$stringifyEventTarget(this.eventTarget);
    }
    get keyMappings() {
        return this.schema.keyMappings;
    }
    keyFilterDissatisfied(event, filters) {
        const [meta, ctrl, alt, shift] = $861a37e0262dfc28$var$allModifiers.map((modifier)=>filters.includes(modifier));
        return event.metaKey !== meta || event.ctrlKey !== ctrl || event.altKey !== alt || event.shiftKey !== shift;
    }
}
const $861a37e0262dfc28$var$defaultEventNames = {
    a: ()=>"click",
    button: ()=>"click",
    form: ()=>"submit",
    details: ()=>"toggle",
    input: (e)=>e.getAttribute("type") == "submit" ? "click" : "input",
    select: ()=>"change",
    textarea: ()=>"input"
};
function $861a37e0262dfc28$var$getDefaultEventNameForElement(element) {
    const tagName = element.tagName.toLowerCase();
    if (tagName in $861a37e0262dfc28$var$defaultEventNames) return $861a37e0262dfc28$var$defaultEventNames[tagName](element);
}
function $861a37e0262dfc28$var$error(message) {
    throw new Error(message);
}
function $861a37e0262dfc28$var$typecast(value) {
    try {
        return JSON.parse(value);
    } catch (o_O) {
        return value;
    }
}
class $861a37e0262dfc28$var$Binding {
    constructor(context, action){
        this.context = context;
        this.action = action;
    }
    get index() {
        return this.action.index;
    }
    get eventTarget() {
        return this.action.eventTarget;
    }
    get eventOptions() {
        return this.action.eventOptions;
    }
    get identifier() {
        return this.context.identifier;
    }
    handleEvent(event) {
        const actionEvent = this.prepareActionEvent(event);
        if (this.willBeInvokedByEvent(event) && this.applyEventModifiers(actionEvent)) this.invokeWithEvent(actionEvent);
    }
    get eventName() {
        return this.action.eventName;
    }
    get method() {
        const method = this.controller[this.methodName];
        if (typeof method == "function") return method;
        throw new Error(`Action "${this.action}" references undefined method "${this.methodName}"`);
    }
    applyEventModifiers(event) {
        const { element: element } = this.action;
        const { actionDescriptorFilters: actionDescriptorFilters } = this.context.application;
        const { controller: controller } = this.context;
        let passes = true;
        for (const [name, value] of Object.entries(this.eventOptions)){
            if (name in actionDescriptorFilters) {
                const filter = actionDescriptorFilters[name];
                passes = passes && filter({
                    name: name,
                    value: value,
                    event: event,
                    element: element,
                    controller: controller
                });
            } else continue;
        }
        return passes;
    }
    prepareActionEvent(event) {
        return Object.assign(event, {
            params: this.action.params
        });
    }
    invokeWithEvent(event) {
        const { target: target, currentTarget: currentTarget } = event;
        try {
            this.method.call(this.controller, event);
            this.context.logDebugActivity(this.methodName, {
                event: event,
                target: target,
                currentTarget: currentTarget,
                action: this.methodName
            });
        } catch (error) {
            const { identifier: identifier, controller: controller, element: element, index: index } = this;
            const detail = {
                identifier: identifier,
                controller: controller,
                element: element,
                index: index,
                event: event
            };
            this.context.handleError(error, `invoking action "${this.action}"`, detail);
        }
    }
    willBeInvokedByEvent(event) {
        const eventTarget = event.target;
        if (event instanceof KeyboardEvent && this.action.shouldIgnoreKeyboardEvent(event)) return false;
        if (event instanceof MouseEvent && this.action.shouldIgnoreMouseEvent(event)) return false;
        if (this.element === eventTarget) return true;
        else if (eventTarget instanceof Element && this.element.contains(eventTarget)) return this.scope.containsElement(eventTarget);
        else return this.scope.containsElement(this.action.element);
    }
    get controller() {
        return this.context.controller;
    }
    get methodName() {
        return this.action.methodName;
    }
    get element() {
        return this.scope.element;
    }
    get scope() {
        return this.context.scope;
    }
}
class $861a37e0262dfc28$export$12e07a2a9f87578a {
    constructor(element, delegate){
        this.mutationObserverInit = {
            attributes: true,
            childList: true,
            subtree: true
        };
        this.element = element;
        this.started = false;
        this.delegate = delegate;
        this.elements = new Set();
        this.mutationObserver = new MutationObserver((mutations)=>this.processMutations(mutations));
    }
    start() {
        if (!this.started) {
            this.started = true;
            this.mutationObserver.observe(this.element, this.mutationObserverInit);
            this.refresh();
        }
    }
    pause(callback) {
        if (this.started) {
            this.mutationObserver.disconnect();
            this.started = false;
        }
        callback();
        if (!this.started) {
            this.mutationObserver.observe(this.element, this.mutationObserverInit);
            this.started = true;
        }
    }
    stop() {
        if (this.started) {
            this.mutationObserver.takeRecords();
            this.mutationObserver.disconnect();
            this.started = false;
        }
    }
    refresh() {
        if (this.started) {
            const matches = new Set(this.matchElementsInTree());
            for (const element of Array.from(this.elements))if (!matches.has(element)) this.removeElement(element);
            for (const element of Array.from(matches))this.addElement(element);
        }
    }
    processMutations(mutations) {
        if (this.started) for (const mutation of mutations)this.processMutation(mutation);
    }
    processMutation(mutation) {
        if (mutation.type == "attributes") this.processAttributeChange(mutation.target, mutation.attributeName);
        else if (mutation.type == "childList") {
            this.processRemovedNodes(mutation.removedNodes);
            this.processAddedNodes(mutation.addedNodes);
        }
    }
    processAttributeChange(element, attributeName) {
        if (this.elements.has(element)) {
            if (this.delegate.elementAttributeChanged && this.matchElement(element)) this.delegate.elementAttributeChanged(element, attributeName);
            else this.removeElement(element);
        } else if (this.matchElement(element)) this.addElement(element);
    }
    processRemovedNodes(nodes) {
        for (const node of Array.from(nodes)){
            const element = this.elementFromNode(node);
            if (element) this.processTree(element, this.removeElement);
        }
    }
    processAddedNodes(nodes) {
        for (const node of Array.from(nodes)){
            const element = this.elementFromNode(node);
            if (element && this.elementIsActive(element)) this.processTree(element, this.addElement);
        }
    }
    matchElement(element) {
        return this.delegate.matchElement(element);
    }
    matchElementsInTree(tree = this.element) {
        return this.delegate.matchElementsInTree(tree);
    }
    processTree(tree, processor) {
        for (const element of this.matchElementsInTree(tree))processor.call(this, element);
    }
    elementFromNode(node) {
        if (node.nodeType == Node.ELEMENT_NODE) return node;
    }
    elementIsActive(element) {
        if (element.isConnected != this.element.isConnected) return false;
        else return this.element.contains(element);
    }
    addElement(element) {
        if (!this.elements.has(element)) {
            if (this.elementIsActive(element)) {
                this.elements.add(element);
                if (this.delegate.elementMatched) this.delegate.elementMatched(element);
            }
        }
    }
    removeElement(element) {
        if (this.elements.has(element)) {
            this.elements.delete(element);
            if (this.delegate.elementUnmatched) this.delegate.elementUnmatched(element);
        }
    }
}
class $861a37e0262dfc28$export$fe68319d413d05cb {
    constructor(element, attributeName, delegate){
        this.attributeName = attributeName;
        this.delegate = delegate;
        this.elementObserver = new $861a37e0262dfc28$export$12e07a2a9f87578a(element, this);
    }
    get element() {
        return this.elementObserver.element;
    }
    get selector() {
        return `[${this.attributeName}]`;
    }
    start() {
        this.elementObserver.start();
    }
    pause(callback) {
        this.elementObserver.pause(callback);
    }
    stop() {
        this.elementObserver.stop();
    }
    refresh() {
        this.elementObserver.refresh();
    }
    get started() {
        return this.elementObserver.started;
    }
    matchElement(element) {
        return element.hasAttribute(this.attributeName);
    }
    matchElementsInTree(tree) {
        const match = this.matchElement(tree) ? [
            tree
        ] : [];
        const matches = Array.from(tree.querySelectorAll(this.selector));
        return match.concat(matches);
    }
    elementMatched(element) {
        if (this.delegate.elementMatchedAttribute) this.delegate.elementMatchedAttribute(element, this.attributeName);
    }
    elementUnmatched(element) {
        if (this.delegate.elementUnmatchedAttribute) this.delegate.elementUnmatchedAttribute(element, this.attributeName);
    }
    elementAttributeChanged(element, attributeName) {
        if (this.delegate.elementAttributeValueChanged && this.attributeName == attributeName) this.delegate.elementAttributeValueChanged(element, attributeName);
    }
}
function $861a37e0262dfc28$export$e16d8520af44a096(map, key, value) {
    $861a37e0262dfc28$export$e7aa7bc5c1b3cfb3(map, key).add(value);
}
function $861a37e0262dfc28$export$1d2f21e549771e67(map, key, value) {
    $861a37e0262dfc28$export$e7aa7bc5c1b3cfb3(map, key).delete(value);
    $861a37e0262dfc28$export$d6cf75919f12ca5a(map, key);
}
function $861a37e0262dfc28$export$e7aa7bc5c1b3cfb3(map, key) {
    let values = map.get(key);
    if (!values) {
        values = new Set();
        map.set(key, values);
    }
    return values;
}
function $861a37e0262dfc28$export$d6cf75919f12ca5a(map, key) {
    const values = map.get(key);
    if (values != null && values.size == 0) map.delete(key);
}
class $861a37e0262dfc28$export$8bd4ad37b76db6ba {
    constructor(){
        this.valuesByKey = new Map();
    }
    get keys() {
        return Array.from(this.valuesByKey.keys());
    }
    get values() {
        const sets = Array.from(this.valuesByKey.values());
        return sets.reduce((values, set)=>values.concat(Array.from(set)), []);
    }
    get size() {
        const sets = Array.from(this.valuesByKey.values());
        return sets.reduce((size, set)=>size + set.size, 0);
    }
    add(key, value) {
        $861a37e0262dfc28$export$e16d8520af44a096(this.valuesByKey, key, value);
    }
    delete(key, value) {
        $861a37e0262dfc28$export$1d2f21e549771e67(this.valuesByKey, key, value);
    }
    has(key, value) {
        const values = this.valuesByKey.get(key);
        return values != null && values.has(value);
    }
    hasKey(key) {
        return this.valuesByKey.has(key);
    }
    hasValue(value) {
        const sets = Array.from(this.valuesByKey.values());
        return sets.some((set)=>set.has(value));
    }
    getValuesForKey(key) {
        const values = this.valuesByKey.get(key);
        return values ? Array.from(values) : [];
    }
    getKeysForValue(value) {
        return Array.from(this.valuesByKey).filter(([_key, values])=>values.has(value)).map(([key, _values])=>key);
    }
}
class $861a37e0262dfc28$export$a7c3d2c2552a674d extends $861a37e0262dfc28$export$8bd4ad37b76db6ba {
    constructor(){
        super();
        this.keysByValue = new Map();
    }
    get values() {
        return Array.from(this.keysByValue.keys());
    }
    add(key, value) {
        super.add(key, value);
        $861a37e0262dfc28$export$e16d8520af44a096(this.keysByValue, value, key);
    }
    delete(key, value) {
        super.delete(key, value);
        $861a37e0262dfc28$export$1d2f21e549771e67(this.keysByValue, value, key);
    }
    hasValue(value) {
        return this.keysByValue.has(value);
    }
    getKeysForValue(value) {
        const set = this.keysByValue.get(value);
        return set ? Array.from(set) : [];
    }
}
class $861a37e0262dfc28$export$116e0b48509995b {
    constructor(element, selector, delegate, details){
        this._selector = selector;
        this.details = details;
        this.elementObserver = new $861a37e0262dfc28$export$12e07a2a9f87578a(element, this);
        this.delegate = delegate;
        this.matchesByElement = new $861a37e0262dfc28$export$8bd4ad37b76db6ba();
    }
    get started() {
        return this.elementObserver.started;
    }
    get selector() {
        return this._selector;
    }
    set selector(selector) {
        this._selector = selector;
        this.refresh();
    }
    start() {
        this.elementObserver.start();
    }
    pause(callback) {
        this.elementObserver.pause(callback);
    }
    stop() {
        this.elementObserver.stop();
    }
    refresh() {
        this.elementObserver.refresh();
    }
    get element() {
        return this.elementObserver.element;
    }
    matchElement(element) {
        const { selector: selector } = this;
        if (selector) {
            const matches = element.matches(selector);
            if (this.delegate.selectorMatchElement) return matches && this.delegate.selectorMatchElement(element, this.details);
            return matches;
        } else return false;
    }
    matchElementsInTree(tree) {
        const { selector: selector } = this;
        if (selector) {
            const match = this.matchElement(tree) ? [
                tree
            ] : [];
            const matches = Array.from(tree.querySelectorAll(selector)).filter((match)=>this.matchElement(match));
            return match.concat(matches);
        } else return [];
    }
    elementMatched(element) {
        const { selector: selector } = this;
        if (selector) this.selectorMatched(element, selector);
    }
    elementUnmatched(element) {
        const selectors = this.matchesByElement.getKeysForValue(element);
        for (const selector of selectors)this.selectorUnmatched(element, selector);
    }
    elementAttributeChanged(element, _attributeName) {
        const { selector: selector } = this;
        if (selector) {
            const matches = this.matchElement(element);
            const matchedBefore = this.matchesByElement.has(selector, element);
            if (matches && !matchedBefore) this.selectorMatched(element, selector);
            else if (!matches && matchedBefore) this.selectorUnmatched(element, selector);
        }
    }
    selectorMatched(element, selector) {
        this.delegate.selectorMatched(element, selector, this.details);
        this.matchesByElement.add(selector, element);
    }
    selectorUnmatched(element, selector) {
        this.delegate.selectorUnmatched(element, selector, this.details);
        this.matchesByElement.delete(selector, element);
    }
}
class $861a37e0262dfc28$export$da226bebbf7f6caa {
    constructor(element, delegate){
        this.element = element;
        this.delegate = delegate;
        this.started = false;
        this.stringMap = new Map();
        this.mutationObserver = new MutationObserver((mutations)=>this.processMutations(mutations));
    }
    start() {
        if (!this.started) {
            this.started = true;
            this.mutationObserver.observe(this.element, {
                attributes: true,
                attributeOldValue: true
            });
            this.refresh();
        }
    }
    stop() {
        if (this.started) {
            this.mutationObserver.takeRecords();
            this.mutationObserver.disconnect();
            this.started = false;
        }
    }
    refresh() {
        if (this.started) for (const attributeName of this.knownAttributeNames)this.refreshAttribute(attributeName, null);
    }
    processMutations(mutations) {
        if (this.started) for (const mutation of mutations)this.processMutation(mutation);
    }
    processMutation(mutation) {
        const attributeName = mutation.attributeName;
        if (attributeName) this.refreshAttribute(attributeName, mutation.oldValue);
    }
    refreshAttribute(attributeName, oldValue) {
        const key = this.delegate.getStringMapKeyForAttribute(attributeName);
        if (key != null) {
            if (!this.stringMap.has(attributeName)) this.stringMapKeyAdded(key, attributeName);
            const value = this.element.getAttribute(attributeName);
            if (this.stringMap.get(attributeName) != value) this.stringMapValueChanged(value, key, oldValue);
            if (value == null) {
                const oldValue = this.stringMap.get(attributeName);
                this.stringMap.delete(attributeName);
                if (oldValue) this.stringMapKeyRemoved(key, attributeName, oldValue);
            } else this.stringMap.set(attributeName, value);
        }
    }
    stringMapKeyAdded(key, attributeName) {
        if (this.delegate.stringMapKeyAdded) this.delegate.stringMapKeyAdded(key, attributeName);
    }
    stringMapValueChanged(value, key, oldValue) {
        if (this.delegate.stringMapValueChanged) this.delegate.stringMapValueChanged(value, key, oldValue);
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
        if (this.delegate.stringMapKeyRemoved) this.delegate.stringMapKeyRemoved(key, attributeName, oldValue);
    }
    get knownAttributeNames() {
        return Array.from(new Set(this.currentAttributeNames.concat(this.recordedAttributeNames)));
    }
    get currentAttributeNames() {
        return Array.from(this.element.attributes).map((attribute)=>attribute.name);
    }
    get recordedAttributeNames() {
        return Array.from(this.stringMap.keys());
    }
}
class $861a37e0262dfc28$export$3aa21c2f03ef6b3b {
    constructor(element, attributeName, delegate){
        this.attributeObserver = new $861a37e0262dfc28$export$fe68319d413d05cb(element, attributeName, this);
        this.delegate = delegate;
        this.tokensByElement = new $861a37e0262dfc28$export$8bd4ad37b76db6ba();
    }
    get started() {
        return this.attributeObserver.started;
    }
    start() {
        this.attributeObserver.start();
    }
    pause(callback) {
        this.attributeObserver.pause(callback);
    }
    stop() {
        this.attributeObserver.stop();
    }
    refresh() {
        this.attributeObserver.refresh();
    }
    get element() {
        return this.attributeObserver.element;
    }
    get attributeName() {
        return this.attributeObserver.attributeName;
    }
    elementMatchedAttribute(element) {
        this.tokensMatched(this.readTokensForElement(element));
    }
    elementAttributeValueChanged(element) {
        const [unmatchedTokens, matchedTokens] = this.refreshTokensForElement(element);
        this.tokensUnmatched(unmatchedTokens);
        this.tokensMatched(matchedTokens);
    }
    elementUnmatchedAttribute(element) {
        this.tokensUnmatched(this.tokensByElement.getValuesForKey(element));
    }
    tokensMatched(tokens) {
        tokens.forEach((token)=>this.tokenMatched(token));
    }
    tokensUnmatched(tokens) {
        tokens.forEach((token)=>this.tokenUnmatched(token));
    }
    tokenMatched(token) {
        this.delegate.tokenMatched(token);
        this.tokensByElement.add(token.element, token);
    }
    tokenUnmatched(token) {
        this.delegate.tokenUnmatched(token);
        this.tokensByElement.delete(token.element, token);
    }
    refreshTokensForElement(element) {
        const previousTokens = this.tokensByElement.getValuesForKey(element);
        const currentTokens = this.readTokensForElement(element);
        const firstDifferingIndex = $861a37e0262dfc28$var$zip(previousTokens, currentTokens).findIndex(([previousToken, currentToken])=>!$861a37e0262dfc28$var$tokensAreEqual(previousToken, currentToken));
        if (firstDifferingIndex == -1) return [
            [],
            []
        ];
        else return [
            previousTokens.slice(firstDifferingIndex),
            currentTokens.slice(firstDifferingIndex)
        ];
    }
    readTokensForElement(element) {
        const attributeName = this.attributeName;
        const tokenString = element.getAttribute(attributeName) || "";
        return $861a37e0262dfc28$var$parseTokenString(tokenString, element, attributeName);
    }
}
function $861a37e0262dfc28$var$parseTokenString(tokenString, element, attributeName) {
    return tokenString.trim().split(/\s+/).filter((content)=>content.length).map((content, index)=>({
            element: element,
            attributeName: attributeName,
            content: content,
            index: index
        }));
}
function $861a37e0262dfc28$var$zip(left, right) {
    const length = Math.max(left.length, right.length);
    return Array.from({
        length: length
    }, (_, index)=>[
            left[index],
            right[index]
        ]);
}
function $861a37e0262dfc28$var$tokensAreEqual(left, right) {
    return left && right && left.index == right.index && left.content == right.content;
}
class $861a37e0262dfc28$export$d27fa4c7330a452e {
    constructor(element, attributeName, delegate){
        this.tokenListObserver = new $861a37e0262dfc28$export$3aa21c2f03ef6b3b(element, attributeName, this);
        this.delegate = delegate;
        this.parseResultsByToken = new WeakMap();
        this.valuesByTokenByElement = new WeakMap();
    }
    get started() {
        return this.tokenListObserver.started;
    }
    start() {
        this.tokenListObserver.start();
    }
    stop() {
        this.tokenListObserver.stop();
    }
    refresh() {
        this.tokenListObserver.refresh();
    }
    get element() {
        return this.tokenListObserver.element;
    }
    get attributeName() {
        return this.tokenListObserver.attributeName;
    }
    tokenMatched(token) {
        const { element: element } = token;
        const { value: value } = this.fetchParseResultForToken(token);
        if (value) {
            this.fetchValuesByTokenForElement(element).set(token, value);
            this.delegate.elementMatchedValue(element, value);
        }
    }
    tokenUnmatched(token) {
        const { element: element } = token;
        const { value: value } = this.fetchParseResultForToken(token);
        if (value) {
            this.fetchValuesByTokenForElement(element).delete(token);
            this.delegate.elementUnmatchedValue(element, value);
        }
    }
    fetchParseResultForToken(token) {
        let parseResult = this.parseResultsByToken.get(token);
        if (!parseResult) {
            parseResult = this.parseToken(token);
            this.parseResultsByToken.set(token, parseResult);
        }
        return parseResult;
    }
    fetchValuesByTokenForElement(element) {
        let valuesByToken = this.valuesByTokenByElement.get(element);
        if (!valuesByToken) {
            valuesByToken = new Map();
            this.valuesByTokenByElement.set(element, valuesByToken);
        }
        return valuesByToken;
    }
    parseToken(token) {
        try {
            const value = this.delegate.parseValueForToken(token);
            return {
                value: value
            };
        } catch (error) {
            return {
                error: error
            };
        }
    }
}
class $861a37e0262dfc28$var$BindingObserver {
    constructor(context, delegate){
        this.context = context;
        this.delegate = delegate;
        this.bindingsByAction = new Map();
    }
    start() {
        if (!this.valueListObserver) {
            this.valueListObserver = new $861a37e0262dfc28$export$d27fa4c7330a452e(this.element, this.actionAttribute, this);
            this.valueListObserver.start();
        }
    }
    stop() {
        if (this.valueListObserver) {
            this.valueListObserver.stop();
            delete this.valueListObserver;
            this.disconnectAllActions();
        }
    }
    get element() {
        return this.context.element;
    }
    get identifier() {
        return this.context.identifier;
    }
    get actionAttribute() {
        return this.schema.actionAttribute;
    }
    get schema() {
        return this.context.schema;
    }
    get bindings() {
        return Array.from(this.bindingsByAction.values());
    }
    connectAction(action) {
        const binding = new $861a37e0262dfc28$var$Binding(this.context, action);
        this.bindingsByAction.set(action, binding);
        this.delegate.bindingConnected(binding);
    }
    disconnectAction(action) {
        const binding = this.bindingsByAction.get(action);
        if (binding) {
            this.bindingsByAction.delete(action);
            this.delegate.bindingDisconnected(binding);
        }
    }
    disconnectAllActions() {
        this.bindings.forEach((binding)=>this.delegate.bindingDisconnected(binding, true));
        this.bindingsByAction.clear();
    }
    parseValueForToken(token) {
        const action = $861a37e0262dfc28$var$Action.forToken(token, this.schema);
        if (action.identifier == this.identifier) return action;
    }
    elementMatchedValue(element, action) {
        this.connectAction(action);
    }
    elementUnmatchedValue(element, action) {
        this.disconnectAction(action);
    }
}
class $861a37e0262dfc28$var$ValueObserver {
    constructor(context, receiver){
        this.context = context;
        this.receiver = receiver;
        this.stringMapObserver = new $861a37e0262dfc28$export$da226bebbf7f6caa(this.element, this);
        this.valueDescriptorMap = this.controller.valueDescriptorMap;
    }
    start() {
        this.stringMapObserver.start();
        this.invokeChangedCallbacksForDefaultValues();
    }
    stop() {
        this.stringMapObserver.stop();
    }
    get element() {
        return this.context.element;
    }
    get controller() {
        return this.context.controller;
    }
    getStringMapKeyForAttribute(attributeName) {
        if (attributeName in this.valueDescriptorMap) return this.valueDescriptorMap[attributeName].name;
    }
    stringMapKeyAdded(key, attributeName) {
        const descriptor = this.valueDescriptorMap[attributeName];
        if (!this.hasValue(key)) this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), descriptor.writer(descriptor.defaultValue));
    }
    stringMapValueChanged(value, name, oldValue) {
        const descriptor = this.valueDescriptorNameMap[name];
        if (value === null) return;
        if (oldValue === null) oldValue = descriptor.writer(descriptor.defaultValue);
        this.invokeChangedCallback(name, value, oldValue);
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
        const descriptor = this.valueDescriptorNameMap[key];
        if (this.hasValue(key)) this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), oldValue);
        else this.invokeChangedCallback(key, descriptor.writer(descriptor.defaultValue), oldValue);
    }
    invokeChangedCallbacksForDefaultValues() {
        for (const { key: key, name: name, defaultValue: defaultValue, writer: writer } of this.valueDescriptors)if (defaultValue != undefined && !this.controller.data.has(key)) this.invokeChangedCallback(name, writer(defaultValue), undefined);
    }
    invokeChangedCallback(name, rawValue, rawOldValue) {
        const changedMethodName = `${name}Changed`;
        const changedMethod = this.receiver[changedMethodName];
        if (typeof changedMethod == "function") {
            const descriptor = this.valueDescriptorNameMap[name];
            try {
                const value = descriptor.reader(rawValue);
                let oldValue = rawOldValue;
                if (rawOldValue) oldValue = descriptor.reader(rawOldValue);
                changedMethod.call(this.receiver, value, oldValue);
            } catch (error) {
                if (error instanceof TypeError) error.message = `Stimulus Value "${this.context.identifier}.${descriptor.name}" - ${error.message}`;
                throw error;
            }
        }
    }
    get valueDescriptors() {
        const { valueDescriptorMap: valueDescriptorMap } = this;
        return Object.keys(valueDescriptorMap).map((key)=>valueDescriptorMap[key]);
    }
    get valueDescriptorNameMap() {
        const descriptors = {};
        Object.keys(this.valueDescriptorMap).forEach((key)=>{
            const descriptor = this.valueDescriptorMap[key];
            descriptors[descriptor.name] = descriptor;
        });
        return descriptors;
    }
    hasValue(attributeName) {
        const descriptor = this.valueDescriptorNameMap[attributeName];
        const hasMethodName = `has${$861a37e0262dfc28$var$capitalize(descriptor.name)}`;
        return this.receiver[hasMethodName];
    }
}
class $861a37e0262dfc28$var$TargetObserver {
    constructor(context, delegate){
        this.context = context;
        this.delegate = delegate;
        this.targetsByName = new $861a37e0262dfc28$export$8bd4ad37b76db6ba();
    }
    start() {
        if (!this.tokenListObserver) {
            this.tokenListObserver = new $861a37e0262dfc28$export$3aa21c2f03ef6b3b(this.element, this.attributeName, this);
            this.tokenListObserver.start();
        }
    }
    stop() {
        if (this.tokenListObserver) {
            this.disconnectAllTargets();
            this.tokenListObserver.stop();
            delete this.tokenListObserver;
        }
    }
    tokenMatched({ element: element, content: name }) {
        if (this.scope.containsElement(element)) this.connectTarget(element, name);
    }
    tokenUnmatched({ element: element, content: name }) {
        this.disconnectTarget(element, name);
    }
    connectTarget(element, name) {
        var _a;
        if (!this.targetsByName.has(name, element)) {
            this.targetsByName.add(name, element);
            (_a = this.tokenListObserver) === null || _a === void 0 || _a.pause(()=>this.delegate.targetConnected(element, name));
        }
    }
    disconnectTarget(element, name) {
        var _a;
        if (this.targetsByName.has(name, element)) {
            this.targetsByName.delete(name, element);
            (_a = this.tokenListObserver) === null || _a === void 0 || _a.pause(()=>this.delegate.targetDisconnected(element, name));
        }
    }
    disconnectAllTargets() {
        for (const name of this.targetsByName.keys)for (const element of this.targetsByName.getValuesForKey(name))this.disconnectTarget(element, name);
    }
    get attributeName() {
        return `data-${this.context.identifier}-target`;
    }
    get element() {
        return this.context.element;
    }
    get scope() {
        return this.context.scope;
    }
}
function $861a37e0262dfc28$var$readInheritableStaticArrayValues(constructor, propertyName) {
    const ancestors = $861a37e0262dfc28$var$getAncestorsForConstructor(constructor);
    return Array.from(ancestors.reduce((values, constructor)=>{
        $861a37e0262dfc28$var$getOwnStaticArrayValues(constructor, propertyName).forEach((name)=>values.add(name));
        return values;
    }, new Set()));
}
function $861a37e0262dfc28$var$readInheritableStaticObjectPairs(constructor, propertyName) {
    const ancestors = $861a37e0262dfc28$var$getAncestorsForConstructor(constructor);
    return ancestors.reduce((pairs, constructor)=>{
        pairs.push(...$861a37e0262dfc28$var$getOwnStaticObjectPairs(constructor, propertyName));
        return pairs;
    }, []);
}
function $861a37e0262dfc28$var$getAncestorsForConstructor(constructor) {
    const ancestors = [];
    while(constructor){
        ancestors.push(constructor);
        constructor = Object.getPrototypeOf(constructor);
    }
    return ancestors.reverse();
}
function $861a37e0262dfc28$var$getOwnStaticArrayValues(constructor, propertyName) {
    const definition = constructor[propertyName];
    return Array.isArray(definition) ? definition : [];
}
function $861a37e0262dfc28$var$getOwnStaticObjectPairs(constructor, propertyName) {
    const definition = constructor[propertyName];
    return definition ? Object.keys(definition).map((key)=>[
            key,
            definition[key]
        ]) : [];
}
class $861a37e0262dfc28$var$OutletObserver {
    constructor(context, delegate){
        this.started = false;
        this.context = context;
        this.delegate = delegate;
        this.outletsByName = new $861a37e0262dfc28$export$8bd4ad37b76db6ba();
        this.outletElementsByName = new $861a37e0262dfc28$export$8bd4ad37b76db6ba();
        this.selectorObserverMap = new Map();
        this.attributeObserverMap = new Map();
    }
    start() {
        if (!this.started) {
            this.outletDefinitions.forEach((outletName)=>{
                this.setupSelectorObserverForOutlet(outletName);
                this.setupAttributeObserverForOutlet(outletName);
            });
            this.started = true;
            this.dependentContexts.forEach((context)=>context.refresh());
        }
    }
    refresh() {
        this.selectorObserverMap.forEach((observer)=>observer.refresh());
        this.attributeObserverMap.forEach((observer)=>observer.refresh());
    }
    stop() {
        if (this.started) {
            this.started = false;
            this.disconnectAllOutlets();
            this.stopSelectorObservers();
            this.stopAttributeObservers();
        }
    }
    stopSelectorObservers() {
        if (this.selectorObserverMap.size > 0) {
            this.selectorObserverMap.forEach((observer)=>observer.stop());
            this.selectorObserverMap.clear();
        }
    }
    stopAttributeObservers() {
        if (this.attributeObserverMap.size > 0) {
            this.attributeObserverMap.forEach((observer)=>observer.stop());
            this.attributeObserverMap.clear();
        }
    }
    selectorMatched(element, _selector, { outletName: outletName }) {
        const outlet = this.getOutlet(element, outletName);
        if (outlet) this.connectOutlet(outlet, element, outletName);
    }
    selectorUnmatched(element, _selector, { outletName: outletName }) {
        const outlet = this.getOutletFromMap(element, outletName);
        if (outlet) this.disconnectOutlet(outlet, element, outletName);
    }
    selectorMatchElement(element, { outletName: outletName }) {
        const selector = this.selector(outletName);
        const hasOutlet = this.hasOutlet(element, outletName);
        const hasOutletController = element.matches(`[${this.schema.controllerAttribute}~=${outletName}]`);
        if (selector) return hasOutlet && hasOutletController && element.matches(selector);
        else return false;
    }
    elementMatchedAttribute(_element, attributeName) {
        const outletName = this.getOutletNameFromOutletAttributeName(attributeName);
        if (outletName) this.updateSelectorObserverForOutlet(outletName);
    }
    elementAttributeValueChanged(_element, attributeName) {
        const outletName = this.getOutletNameFromOutletAttributeName(attributeName);
        if (outletName) this.updateSelectorObserverForOutlet(outletName);
    }
    elementUnmatchedAttribute(_element, attributeName) {
        const outletName = this.getOutletNameFromOutletAttributeName(attributeName);
        if (outletName) this.updateSelectorObserverForOutlet(outletName);
    }
    connectOutlet(outlet, element, outletName) {
        var _a;
        if (!this.outletElementsByName.has(outletName, element)) {
            this.outletsByName.add(outletName, outlet);
            this.outletElementsByName.add(outletName, element);
            (_a = this.selectorObserverMap.get(outletName)) === null || _a === void 0 || _a.pause(()=>this.delegate.outletConnected(outlet, element, outletName));
        }
    }
    disconnectOutlet(outlet, element, outletName) {
        var _a;
        if (this.outletElementsByName.has(outletName, element)) {
            this.outletsByName.delete(outletName, outlet);
            this.outletElementsByName.delete(outletName, element);
            (_a = this.selectorObserverMap.get(outletName)) === null || _a === void 0 || _a.pause(()=>this.delegate.outletDisconnected(outlet, element, outletName));
        }
    }
    disconnectAllOutlets() {
        for (const outletName of this.outletElementsByName.keys){
            for (const element of this.outletElementsByName.getValuesForKey(outletName))for (const outlet of this.outletsByName.getValuesForKey(outletName))this.disconnectOutlet(outlet, element, outletName);
        }
    }
    updateSelectorObserverForOutlet(outletName) {
        const observer = this.selectorObserverMap.get(outletName);
        if (observer) observer.selector = this.selector(outletName);
    }
    setupSelectorObserverForOutlet(outletName) {
        const selector = this.selector(outletName);
        const selectorObserver = new $861a37e0262dfc28$export$116e0b48509995b(document.body, selector, this, {
            outletName: outletName
        });
        this.selectorObserverMap.set(outletName, selectorObserver);
        selectorObserver.start();
    }
    setupAttributeObserverForOutlet(outletName) {
        const attributeName = this.attributeNameForOutletName(outletName);
        const attributeObserver = new $861a37e0262dfc28$export$fe68319d413d05cb(this.scope.element, attributeName, this);
        this.attributeObserverMap.set(outletName, attributeObserver);
        attributeObserver.start();
    }
    selector(outletName) {
        return this.scope.outlets.getSelectorForOutletName(outletName);
    }
    attributeNameForOutletName(outletName) {
        return this.scope.schema.outletAttributeForScope(this.identifier, outletName);
    }
    getOutletNameFromOutletAttributeName(attributeName) {
        return this.outletDefinitions.find((outletName)=>this.attributeNameForOutletName(outletName) === attributeName);
    }
    get outletDependencies() {
        const dependencies = new $861a37e0262dfc28$export$8bd4ad37b76db6ba();
        this.router.modules.forEach((module)=>{
            const constructor = module.definition.controllerConstructor;
            const outlets = $861a37e0262dfc28$var$readInheritableStaticArrayValues(constructor, "outlets");
            outlets.forEach((outlet)=>dependencies.add(outlet, module.identifier));
        });
        return dependencies;
    }
    get outletDefinitions() {
        return this.outletDependencies.getKeysForValue(this.identifier);
    }
    get dependentControllerIdentifiers() {
        return this.outletDependencies.getValuesForKey(this.identifier);
    }
    get dependentContexts() {
        const identifiers = this.dependentControllerIdentifiers;
        return this.router.contexts.filter((context)=>identifiers.includes(context.identifier));
    }
    hasOutlet(element, outletName) {
        return !!this.getOutlet(element, outletName) || !!this.getOutletFromMap(element, outletName);
    }
    getOutlet(element, outletName) {
        return this.application.getControllerForElementAndIdentifier(element, outletName);
    }
    getOutletFromMap(element, outletName) {
        return this.outletsByName.getValuesForKey(outletName).find((outlet)=>outlet.element === element);
    }
    get scope() {
        return this.context.scope;
    }
    get schema() {
        return this.context.schema;
    }
    get identifier() {
        return this.context.identifier;
    }
    get application() {
        return this.context.application;
    }
    get router() {
        return this.application.router;
    }
}
class $861a37e0262dfc28$export$841858b892ce1f4c {
    constructor(module, scope){
        this.logDebugActivity = (functionName, detail = {})=>{
            const { identifier: identifier, controller: controller, element: element } = this;
            detail = Object.assign({
                identifier: identifier,
                controller: controller,
                element: element
            }, detail);
            this.application.logDebugActivity(this.identifier, functionName, detail);
        };
        this.module = module;
        this.scope = scope;
        this.controller = new module.controllerConstructor(this);
        this.bindingObserver = new $861a37e0262dfc28$var$BindingObserver(this, this.dispatcher);
        this.valueObserver = new $861a37e0262dfc28$var$ValueObserver(this, this.controller);
        this.targetObserver = new $861a37e0262dfc28$var$TargetObserver(this, this);
        this.outletObserver = new $861a37e0262dfc28$var$OutletObserver(this, this);
        try {
            this.controller.initialize();
            this.logDebugActivity("initialize");
        } catch (error) {
            this.handleError(error, "initializing controller");
        }
    }
    connect() {
        this.bindingObserver.start();
        this.valueObserver.start();
        this.targetObserver.start();
        this.outletObserver.start();
        try {
            this.controller.connect();
            this.logDebugActivity("connect");
        } catch (error) {
            this.handleError(error, "connecting controller");
        }
    }
    refresh() {
        this.outletObserver.refresh();
    }
    disconnect() {
        try {
            this.controller.disconnect();
            this.logDebugActivity("disconnect");
        } catch (error) {
            this.handleError(error, "disconnecting controller");
        }
        this.outletObserver.stop();
        this.targetObserver.stop();
        this.valueObserver.stop();
        this.bindingObserver.stop();
    }
    get application() {
        return this.module.application;
    }
    get identifier() {
        return this.module.identifier;
    }
    get schema() {
        return this.application.schema;
    }
    get dispatcher() {
        return this.application.dispatcher;
    }
    get element() {
        return this.scope.element;
    }
    get parentElement() {
        return this.element.parentElement;
    }
    handleError(error, message, detail = {}) {
        const { identifier: identifier, controller: controller, element: element } = this;
        detail = Object.assign({
            identifier: identifier,
            controller: controller,
            element: element
        }, detail);
        this.application.handleError(error, `Error ${message}`, detail);
    }
    targetConnected(element, name) {
        this.invokeControllerMethod(`${name}TargetConnected`, element);
    }
    targetDisconnected(element, name) {
        this.invokeControllerMethod(`${name}TargetDisconnected`, element);
    }
    outletConnected(outlet, element, name) {
        this.invokeControllerMethod(`${$861a37e0262dfc28$var$namespaceCamelize(name)}OutletConnected`, outlet, element);
    }
    outletDisconnected(outlet, element, name) {
        this.invokeControllerMethod(`${$861a37e0262dfc28$var$namespaceCamelize(name)}OutletDisconnected`, outlet, element);
    }
    invokeControllerMethod(methodName, ...args) {
        const controller = this.controller;
        if (typeof controller[methodName] == "function") controller[methodName](...args);
    }
}
function $861a37e0262dfc28$var$bless(constructor) {
    return $861a37e0262dfc28$var$shadow(constructor, $861a37e0262dfc28$var$getBlessedProperties(constructor));
}
function $861a37e0262dfc28$var$shadow(constructor, properties) {
    const shadowConstructor = $861a37e0262dfc28$var$extend(constructor);
    const shadowProperties = $861a37e0262dfc28$var$getShadowProperties(constructor.prototype, properties);
    Object.defineProperties(shadowConstructor.prototype, shadowProperties);
    return shadowConstructor;
}
function $861a37e0262dfc28$var$getBlessedProperties(constructor) {
    const blessings = $861a37e0262dfc28$var$readInheritableStaticArrayValues(constructor, "blessings");
    return blessings.reduce((blessedProperties, blessing)=>{
        const properties = blessing(constructor);
        for(const key in properties){
            const descriptor = blessedProperties[key] || {};
            blessedProperties[key] = Object.assign(descriptor, properties[key]);
        }
        return blessedProperties;
    }, {});
}
function $861a37e0262dfc28$var$getShadowProperties(prototype, properties) {
    return $861a37e0262dfc28$var$getOwnKeys(properties).reduce((shadowProperties, key)=>{
        const descriptor = $861a37e0262dfc28$var$getShadowedDescriptor(prototype, properties, key);
        if (descriptor) Object.assign(shadowProperties, {
            [key]: descriptor
        });
        return shadowProperties;
    }, {});
}
function $861a37e0262dfc28$var$getShadowedDescriptor(prototype, properties, key) {
    const shadowingDescriptor = Object.getOwnPropertyDescriptor(prototype, key);
    const shadowedByValue = shadowingDescriptor && "value" in shadowingDescriptor;
    if (!shadowedByValue) {
        const descriptor = Object.getOwnPropertyDescriptor(properties, key).value;
        if (shadowingDescriptor) {
            descriptor.get = shadowingDescriptor.get || descriptor.get;
            descriptor.set = shadowingDescriptor.set || descriptor.set;
        }
        return descriptor;
    }
}
const $861a37e0262dfc28$var$getOwnKeys = (()=>{
    if (typeof Object.getOwnPropertySymbols == "function") return (object)=>[
            ...Object.getOwnPropertyNames(object),
            ...Object.getOwnPropertySymbols(object)
        ];
    else return Object.getOwnPropertyNames;
})();
const $861a37e0262dfc28$var$extend = (()=>{
    function extendWithReflect(constructor) {
        function extended() {
            return Reflect.construct(constructor, arguments, new.target);
        }
        extended.prototype = Object.create(constructor.prototype, {
            constructor: {
                value: extended
            }
        });
        Reflect.setPrototypeOf(extended, constructor);
        return extended;
    }
    function testReflectExtension() {
        const a = function() {
            this.a.call(this);
        };
        const b = extendWithReflect(a);
        b.prototype.a = function() {};
        return new b();
    }
    try {
        testReflectExtension();
        return extendWithReflect;
    } catch (error) {
        return (constructor)=>class extended extends constructor {
            };
    }
})();
function $861a37e0262dfc28$var$blessDefinition(definition) {
    return {
        identifier: definition.identifier,
        controllerConstructor: $861a37e0262dfc28$var$bless(definition.controllerConstructor)
    };
}
class $861a37e0262dfc28$var$Module {
    constructor(application, definition){
        this.application = application;
        this.definition = $861a37e0262dfc28$var$blessDefinition(definition);
        this.contextsByScope = new WeakMap();
        this.connectedContexts = new Set();
    }
    get identifier() {
        return this.definition.identifier;
    }
    get controllerConstructor() {
        return this.definition.controllerConstructor;
    }
    get contexts() {
        return Array.from(this.connectedContexts);
    }
    connectContextForScope(scope) {
        const context = this.fetchContextForScope(scope);
        this.connectedContexts.add(context);
        context.connect();
    }
    disconnectContextForScope(scope) {
        const context = this.contextsByScope.get(scope);
        if (context) {
            this.connectedContexts.delete(context);
            context.disconnect();
        }
    }
    fetchContextForScope(scope) {
        let context = this.contextsByScope.get(scope);
        if (!context) {
            context = new $861a37e0262dfc28$export$841858b892ce1f4c(this, scope);
            this.contextsByScope.set(scope, context);
        }
        return context;
    }
}
class $861a37e0262dfc28$var$ClassMap {
    constructor(scope){
        this.scope = scope;
    }
    has(name) {
        return this.data.has(this.getDataKey(name));
    }
    get(name) {
        return this.getAll(name)[0];
    }
    getAll(name) {
        const tokenString = this.data.get(this.getDataKey(name)) || "";
        return $861a37e0262dfc28$var$tokenize(tokenString);
    }
    getAttributeName(name) {
        return this.data.getAttributeNameForKey(this.getDataKey(name));
    }
    getDataKey(name) {
        return `${name}-class`;
    }
    get data() {
        return this.scope.data;
    }
}
class $861a37e0262dfc28$var$DataMap {
    constructor(scope){
        this.scope = scope;
    }
    get element() {
        return this.scope.element;
    }
    get identifier() {
        return this.scope.identifier;
    }
    get(key) {
        const name = this.getAttributeNameForKey(key);
        return this.element.getAttribute(name);
    }
    set(key, value) {
        const name = this.getAttributeNameForKey(key);
        this.element.setAttribute(name, value);
        return this.get(key);
    }
    has(key) {
        const name = this.getAttributeNameForKey(key);
        return this.element.hasAttribute(name);
    }
    delete(key) {
        if (this.has(key)) {
            const name = this.getAttributeNameForKey(key);
            this.element.removeAttribute(name);
            return true;
        } else return false;
    }
    getAttributeNameForKey(key) {
        return `data-${this.identifier}-${$861a37e0262dfc28$var$dasherize(key)}`;
    }
}
class $861a37e0262dfc28$var$Guide {
    constructor(logger){
        this.warnedKeysByObject = new WeakMap();
        this.logger = logger;
    }
    warn(object, key, message) {
        let warnedKeys = this.warnedKeysByObject.get(object);
        if (!warnedKeys) {
            warnedKeys = new Set();
            this.warnedKeysByObject.set(object, warnedKeys);
        }
        if (!warnedKeys.has(key)) {
            warnedKeys.add(key);
            this.logger.warn(message, object);
        }
    }
}
function $861a37e0262dfc28$var$attributeValueContainsToken(attributeName, token) {
    return `[${attributeName}~="${token}"]`;
}
class $861a37e0262dfc28$var$TargetSet {
    constructor(scope){
        this.scope = scope;
    }
    get element() {
        return this.scope.element;
    }
    get identifier() {
        return this.scope.identifier;
    }
    get schema() {
        return this.scope.schema;
    }
    has(targetName) {
        return this.find(targetName) != null;
    }
    find(...targetNames) {
        return targetNames.reduce((target, targetName)=>target || this.findTarget(targetName) || this.findLegacyTarget(targetName), undefined);
    }
    findAll(...targetNames) {
        return targetNames.reduce((targets, targetName)=>[
                ...targets,
                ...this.findAllTargets(targetName),
                ...this.findAllLegacyTargets(targetName)
            ], []);
    }
    findTarget(targetName) {
        const selector = this.getSelectorForTargetName(targetName);
        return this.scope.findElement(selector);
    }
    findAllTargets(targetName) {
        const selector = this.getSelectorForTargetName(targetName);
        return this.scope.findAllElements(selector);
    }
    getSelectorForTargetName(targetName) {
        const attributeName = this.schema.targetAttributeForScope(this.identifier);
        return $861a37e0262dfc28$var$attributeValueContainsToken(attributeName, targetName);
    }
    findLegacyTarget(targetName) {
        const selector = this.getLegacySelectorForTargetName(targetName);
        return this.deprecate(this.scope.findElement(selector), targetName);
    }
    findAllLegacyTargets(targetName) {
        const selector = this.getLegacySelectorForTargetName(targetName);
        return this.scope.findAllElements(selector).map((element)=>this.deprecate(element, targetName));
    }
    getLegacySelectorForTargetName(targetName) {
        const targetDescriptor = `${this.identifier}.${targetName}`;
        return $861a37e0262dfc28$var$attributeValueContainsToken(this.schema.targetAttribute, targetDescriptor);
    }
    deprecate(element, targetName) {
        if (element) {
            const { identifier: identifier } = this;
            const attributeName = this.schema.targetAttribute;
            const revisedAttributeName = this.schema.targetAttributeForScope(identifier);
            this.guide.warn(element, `target:${targetName}`, `Please replace ${attributeName}="${identifier}.${targetName}" with ${revisedAttributeName}="${targetName}". ` + `The ${attributeName} attribute is deprecated and will be removed in a future version of Stimulus.`);
        }
        return element;
    }
    get guide() {
        return this.scope.guide;
    }
}
class $861a37e0262dfc28$var$OutletSet {
    constructor(scope, controllerElement){
        this.scope = scope;
        this.controllerElement = controllerElement;
    }
    get element() {
        return this.scope.element;
    }
    get identifier() {
        return this.scope.identifier;
    }
    get schema() {
        return this.scope.schema;
    }
    has(outletName) {
        return this.find(outletName) != null;
    }
    find(...outletNames) {
        return outletNames.reduce((outlet, outletName)=>outlet || this.findOutlet(outletName), undefined);
    }
    findAll(...outletNames) {
        return outletNames.reduce((outlets, outletName)=>[
                ...outlets,
                ...this.findAllOutlets(outletName)
            ], []);
    }
    getSelectorForOutletName(outletName) {
        const attributeName = this.schema.outletAttributeForScope(this.identifier, outletName);
        return this.controllerElement.getAttribute(attributeName);
    }
    findOutlet(outletName) {
        const selector = this.getSelectorForOutletName(outletName);
        if (selector) return this.findElement(selector, outletName);
    }
    findAllOutlets(outletName) {
        const selector = this.getSelectorForOutletName(outletName);
        return selector ? this.findAllElements(selector, outletName) : [];
    }
    findElement(selector, outletName) {
        const elements = this.scope.queryElements(selector);
        return elements.filter((element)=>this.matchesElement(element, selector, outletName))[0];
    }
    findAllElements(selector, outletName) {
        const elements = this.scope.queryElements(selector);
        return elements.filter((element)=>this.matchesElement(element, selector, outletName));
    }
    matchesElement(element, selector, outletName) {
        const controllerAttribute = element.getAttribute(this.scope.schema.controllerAttribute) || "";
        return element.matches(selector) && controllerAttribute.split(" ").includes(outletName);
    }
}
class $861a37e0262dfc28$var$Scope {
    constructor(schema, element, identifier, logger){
        this.targets = new $861a37e0262dfc28$var$TargetSet(this);
        this.classes = new $861a37e0262dfc28$var$ClassMap(this);
        this.data = new $861a37e0262dfc28$var$DataMap(this);
        this.containsElement = (element)=>{
            return element.closest(this.controllerSelector) === this.element;
        };
        this.schema = schema;
        this.element = element;
        this.identifier = identifier;
        this.guide = new $861a37e0262dfc28$var$Guide(logger);
        this.outlets = new $861a37e0262dfc28$var$OutletSet(this.documentScope, element);
    }
    findElement(selector) {
        return this.element.matches(selector) ? this.element : this.queryElements(selector).find(this.containsElement);
    }
    findAllElements(selector) {
        return [
            ...this.element.matches(selector) ? [
                this.element
            ] : [],
            ...this.queryElements(selector).filter(this.containsElement)
        ];
    }
    queryElements(selector) {
        return Array.from(this.element.querySelectorAll(selector));
    }
    get controllerSelector() {
        return $861a37e0262dfc28$var$attributeValueContainsToken(this.schema.controllerAttribute, this.identifier);
    }
    get isDocumentScope() {
        return this.element === document.documentElement;
    }
    get documentScope() {
        return this.isDocumentScope ? this : new $861a37e0262dfc28$var$Scope(this.schema, document.documentElement, this.identifier, this.guide.logger);
    }
}
class $861a37e0262dfc28$var$ScopeObserver {
    constructor(element, schema, delegate){
        this.element = element;
        this.schema = schema;
        this.delegate = delegate;
        this.valueListObserver = new $861a37e0262dfc28$export$d27fa4c7330a452e(this.element, this.controllerAttribute, this);
        this.scopesByIdentifierByElement = new WeakMap();
        this.scopeReferenceCounts = new WeakMap();
    }
    start() {
        this.valueListObserver.start();
    }
    stop() {
        this.valueListObserver.stop();
    }
    get controllerAttribute() {
        return this.schema.controllerAttribute;
    }
    parseValueForToken(token) {
        const { element: element, content: identifier } = token;
        return this.parseValueForElementAndIdentifier(element, identifier);
    }
    parseValueForElementAndIdentifier(element, identifier) {
        const scopesByIdentifier = this.fetchScopesByIdentifierForElement(element);
        let scope = scopesByIdentifier.get(identifier);
        if (!scope) {
            scope = this.delegate.createScopeForElementAndIdentifier(element, identifier);
            scopesByIdentifier.set(identifier, scope);
        }
        return scope;
    }
    elementMatchedValue(element, value) {
        const referenceCount = (this.scopeReferenceCounts.get(value) || 0) + 1;
        this.scopeReferenceCounts.set(value, referenceCount);
        if (referenceCount == 1) this.delegate.scopeConnected(value);
    }
    elementUnmatchedValue(element, value) {
        const referenceCount = this.scopeReferenceCounts.get(value);
        if (referenceCount) {
            this.scopeReferenceCounts.set(value, referenceCount - 1);
            if (referenceCount == 1) this.delegate.scopeDisconnected(value);
        }
    }
    fetchScopesByIdentifierForElement(element) {
        let scopesByIdentifier = this.scopesByIdentifierByElement.get(element);
        if (!scopesByIdentifier) {
            scopesByIdentifier = new Map();
            this.scopesByIdentifierByElement.set(element, scopesByIdentifier);
        }
        return scopesByIdentifier;
    }
}
class $861a37e0262dfc28$var$Router {
    constructor(application){
        this.application = application;
        this.scopeObserver = new $861a37e0262dfc28$var$ScopeObserver(this.element, this.schema, this);
        this.scopesByIdentifier = new $861a37e0262dfc28$export$8bd4ad37b76db6ba();
        this.modulesByIdentifier = new Map();
    }
    get element() {
        return this.application.element;
    }
    get schema() {
        return this.application.schema;
    }
    get logger() {
        return this.application.logger;
    }
    get controllerAttribute() {
        return this.schema.controllerAttribute;
    }
    get modules() {
        return Array.from(this.modulesByIdentifier.values());
    }
    get contexts() {
        return this.modules.reduce((contexts, module)=>contexts.concat(module.contexts), []);
    }
    start() {
        this.scopeObserver.start();
    }
    stop() {
        this.scopeObserver.stop();
    }
    loadDefinition(definition) {
        this.unloadIdentifier(definition.identifier);
        const module = new $861a37e0262dfc28$var$Module(this.application, definition);
        this.connectModule(module);
        const afterLoad = definition.controllerConstructor.afterLoad;
        if (afterLoad) afterLoad.call(definition.controllerConstructor, definition.identifier, this.application);
    }
    unloadIdentifier(identifier) {
        const module = this.modulesByIdentifier.get(identifier);
        if (module) this.disconnectModule(module);
    }
    getContextForElementAndIdentifier(element, identifier) {
        const module = this.modulesByIdentifier.get(identifier);
        if (module) return module.contexts.find((context)=>context.element == element);
    }
    proposeToConnectScopeForElementAndIdentifier(element, identifier) {
        const scope = this.scopeObserver.parseValueForElementAndIdentifier(element, identifier);
        if (scope) this.scopeObserver.elementMatchedValue(scope.element, scope);
        else console.error(`Couldn't find or create scope for identifier: "${identifier}" and element:`, element);
    }
    handleError(error, message, detail) {
        this.application.handleError(error, message, detail);
    }
    createScopeForElementAndIdentifier(element, identifier) {
        return new $861a37e0262dfc28$var$Scope(this.schema, element, identifier, this.logger);
    }
    scopeConnected(scope) {
        this.scopesByIdentifier.add(scope.identifier, scope);
        const module = this.modulesByIdentifier.get(scope.identifier);
        if (module) module.connectContextForScope(scope);
    }
    scopeDisconnected(scope) {
        this.scopesByIdentifier.delete(scope.identifier, scope);
        const module = this.modulesByIdentifier.get(scope.identifier);
        if (module) module.disconnectContextForScope(scope);
    }
    connectModule(module) {
        this.modulesByIdentifier.set(module.identifier, module);
        const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
        scopes.forEach((scope)=>module.connectContextForScope(scope));
    }
    disconnectModule(module) {
        this.modulesByIdentifier.delete(module.identifier);
        const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
        scopes.forEach((scope)=>module.disconnectContextForScope(scope));
    }
}
const $861a37e0262dfc28$export$1db618b7b2275ea1 = {
    controllerAttribute: "data-controller",
    actionAttribute: "data-action",
    targetAttribute: "data-target",
    targetAttributeForScope: (identifier)=>`data-${identifier}-target`,
    outletAttributeForScope: (identifier, outlet)=>`data-${identifier}-${outlet}-outlet`,
    keyMappings: Object.assign(Object.assign({
        enter: "Enter",
        tab: "Tab",
        esc: "Escape",
        space: " ",
        up: "ArrowUp",
        down: "ArrowDown",
        left: "ArrowLeft",
        right: "ArrowRight",
        home: "Home",
        end: "End",
        page_up: "PageUp",
        page_down: "PageDown"
    }, $861a37e0262dfc28$var$objectFromEntries("abcdefghijklmnopqrstuvwxyz".split("").map((c)=>[
            c,
            c
        ]))), $861a37e0262dfc28$var$objectFromEntries("0123456789".split("").map((n)=>[
            n,
            n
        ])))
};
function $861a37e0262dfc28$var$objectFromEntries(array) {
    return array.reduce((memo, [k, v])=>Object.assign(Object.assign({}, memo), {
            [k]: v
        }), {});
}
class $861a37e0262dfc28$export$16975c34e60e1e61 {
    constructor(element = document.documentElement, schema = $861a37e0262dfc28$export$1db618b7b2275ea1){
        this.logger = console;
        this.debug = false;
        this.logDebugActivity = (identifier, functionName, detail = {})=>{
            if (this.debug) this.logFormattedMessage(identifier, functionName, detail);
        };
        this.element = element;
        this.schema = schema;
        this.dispatcher = new $861a37e0262dfc28$var$Dispatcher(this);
        this.router = new $861a37e0262dfc28$var$Router(this);
        this.actionDescriptorFilters = Object.assign({}, $861a37e0262dfc28$var$defaultActionDescriptorFilters);
    }
    static start(element, schema) {
        const application = new this(element, schema);
        application.start();
        return application;
    }
    async start() {
        await $861a37e0262dfc28$var$domReady();
        this.logDebugActivity("application", "starting");
        this.dispatcher.start();
        this.router.start();
        this.logDebugActivity("application", "start");
    }
    stop() {
        this.logDebugActivity("application", "stopping");
        this.dispatcher.stop();
        this.router.stop();
        this.logDebugActivity("application", "stop");
    }
    register(identifier, controllerConstructor) {
        this.load({
            identifier: identifier,
            controllerConstructor: controllerConstructor
        });
    }
    registerActionOption(name, filter) {
        this.actionDescriptorFilters[name] = filter;
    }
    load(head, ...rest) {
        const definitions = Array.isArray(head) ? head : [
            head,
            ...rest
        ];
        definitions.forEach((definition)=>{
            if (definition.controllerConstructor.shouldLoad) this.router.loadDefinition(definition);
        });
    }
    unload(head, ...rest) {
        const identifiers = Array.isArray(head) ? head : [
            head,
            ...rest
        ];
        identifiers.forEach((identifier)=>this.router.unloadIdentifier(identifier));
    }
    get controllers() {
        return this.router.contexts.map((context)=>context.controller);
    }
    getControllerForElementAndIdentifier(element, identifier) {
        const context = this.router.getContextForElementAndIdentifier(element, identifier);
        return context ? context.controller : null;
    }
    handleError(error, message, detail) {
        var _a;
        this.logger.error(`%s\n\n%o\n\n%o`, message, error, detail);
        (_a = window.onerror) === null || _a === void 0 || _a.call(window, message, "", 0, 0, error);
    }
    logFormattedMessage(identifier, functionName, detail = {}) {
        detail = Object.assign({
            application: this
        }, detail);
        this.logger.groupCollapsed(`${identifier} #${functionName}`);
        this.logger.log("details:", Object.assign({}, detail));
        this.logger.groupEnd();
    }
}
function $861a37e0262dfc28$var$domReady() {
    return new Promise((resolve)=>{
        if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", ()=>resolve());
        else resolve();
    });
}
function $861a37e0262dfc28$var$ClassPropertiesBlessing(constructor) {
    const classes = $861a37e0262dfc28$var$readInheritableStaticArrayValues(constructor, "classes");
    return classes.reduce((properties, classDefinition)=>{
        return Object.assign(properties, $861a37e0262dfc28$var$propertiesForClassDefinition(classDefinition));
    }, {});
}
function $861a37e0262dfc28$var$propertiesForClassDefinition(key) {
    return {
        [`${key}Class`]: {
            get () {
                const { classes: classes } = this;
                if (classes.has(key)) return classes.get(key);
                else {
                    const attribute = classes.getAttributeName(key);
                    throw new Error(`Missing attribute "${attribute}"`);
                }
            }
        },
        [`${key}Classes`]: {
            get () {
                return this.classes.getAll(key);
            }
        },
        [`has${$861a37e0262dfc28$var$capitalize(key)}Class`]: {
            get () {
                return this.classes.has(key);
            }
        }
    };
}
function $861a37e0262dfc28$var$OutletPropertiesBlessing(constructor) {
    const outlets = $861a37e0262dfc28$var$readInheritableStaticArrayValues(constructor, "outlets");
    return outlets.reduce((properties, outletDefinition)=>{
        return Object.assign(properties, $861a37e0262dfc28$var$propertiesForOutletDefinition(outletDefinition));
    }, {});
}
function $861a37e0262dfc28$var$getOutletController(controller, element, identifier) {
    return controller.application.getControllerForElementAndIdentifier(element, identifier);
}
function $861a37e0262dfc28$var$getControllerAndEnsureConnectedScope(controller, element, outletName) {
    let outletController = $861a37e0262dfc28$var$getOutletController(controller, element, outletName);
    if (outletController) return outletController;
    controller.application.router.proposeToConnectScopeForElementAndIdentifier(element, outletName);
    outletController = $861a37e0262dfc28$var$getOutletController(controller, element, outletName);
    if (outletController) return outletController;
}
function $861a37e0262dfc28$var$propertiesForOutletDefinition(name) {
    const camelizedName = $861a37e0262dfc28$var$namespaceCamelize(name);
    return {
        [`${camelizedName}Outlet`]: {
            get () {
                const outletElement = this.outlets.find(name);
                const selector = this.outlets.getSelectorForOutletName(name);
                if (outletElement) {
                    const outletController = $861a37e0262dfc28$var$getControllerAndEnsureConnectedScope(this, outletElement, name);
                    if (outletController) return outletController;
                    throw new Error(`The provided outlet element is missing an outlet controller "${name}" instance for host controller "${this.identifier}"`);
                }
                throw new Error(`Missing outlet element "${name}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${selector}".`);
            }
        },
        [`${camelizedName}Outlets`]: {
            get () {
                const outlets = this.outlets.findAll(name);
                if (outlets.length > 0) return outlets.map((outletElement)=>{
                    const outletController = $861a37e0262dfc28$var$getControllerAndEnsureConnectedScope(this, outletElement, name);
                    if (outletController) return outletController;
                    console.warn(`The provided outlet element is missing an outlet controller "${name}" instance for host controller "${this.identifier}"`, outletElement);
                }).filter((controller)=>controller);
                return [];
            }
        },
        [`${camelizedName}OutletElement`]: {
            get () {
                const outletElement = this.outlets.find(name);
                const selector = this.outlets.getSelectorForOutletName(name);
                if (outletElement) return outletElement;
                else throw new Error(`Missing outlet element "${name}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${selector}".`);
            }
        },
        [`${camelizedName}OutletElements`]: {
            get () {
                return this.outlets.findAll(name);
            }
        },
        [`has${$861a37e0262dfc28$var$capitalize(camelizedName)}Outlet`]: {
            get () {
                return this.outlets.has(name);
            }
        }
    };
}
function $861a37e0262dfc28$var$TargetPropertiesBlessing(constructor) {
    const targets = $861a37e0262dfc28$var$readInheritableStaticArrayValues(constructor, "targets");
    return targets.reduce((properties, targetDefinition)=>{
        return Object.assign(properties, $861a37e0262dfc28$var$propertiesForTargetDefinition(targetDefinition));
    }, {});
}
function $861a37e0262dfc28$var$propertiesForTargetDefinition(name) {
    return {
        [`${name}Target`]: {
            get () {
                const target = this.targets.find(name);
                if (target) return target;
                else throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`);
            }
        },
        [`${name}Targets`]: {
            get () {
                return this.targets.findAll(name);
            }
        },
        [`has${$861a37e0262dfc28$var$capitalize(name)}Target`]: {
            get () {
                return this.targets.has(name);
            }
        }
    };
}
function $861a37e0262dfc28$var$ValuePropertiesBlessing(constructor) {
    const valueDefinitionPairs = $861a37e0262dfc28$var$readInheritableStaticObjectPairs(constructor, "values");
    const propertyDescriptorMap = {
        valueDescriptorMap: {
            get () {
                return valueDefinitionPairs.reduce((result, valueDefinitionPair)=>{
                    const valueDescriptor = $861a37e0262dfc28$var$parseValueDefinitionPair(valueDefinitionPair, this.identifier);
                    const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key);
                    return Object.assign(result, {
                        [attributeName]: valueDescriptor
                    });
                }, {});
            }
        }
    };
    return valueDefinitionPairs.reduce((properties, valueDefinitionPair)=>{
        return Object.assign(properties, $861a37e0262dfc28$var$propertiesForValueDefinitionPair(valueDefinitionPair));
    }, propertyDescriptorMap);
}
function $861a37e0262dfc28$var$propertiesForValueDefinitionPair(valueDefinitionPair, controller) {
    const definition = $861a37e0262dfc28$var$parseValueDefinitionPair(valueDefinitionPair, controller);
    const { key: key, name: name, reader: read, writer: write } = definition;
    return {
        [name]: {
            get () {
                const value = this.data.get(key);
                if (value !== null) return read(value);
                else return definition.defaultValue;
            },
            set (value) {
                if (value === undefined) this.data.delete(key);
                else this.data.set(key, write(value));
            }
        },
        [`has${$861a37e0262dfc28$var$capitalize(name)}`]: {
            get () {
                return this.data.has(key) || definition.hasCustomDefaultValue;
            }
        }
    };
}
function $861a37e0262dfc28$var$parseValueDefinitionPair([token, typeDefinition], controller) {
    return $861a37e0262dfc28$var$valueDescriptorForTokenAndTypeDefinition({
        controller: controller,
        token: token,
        typeDefinition: typeDefinition
    });
}
function $861a37e0262dfc28$var$parseValueTypeConstant(constant) {
    switch(constant){
        case Array:
            return "array";
        case Boolean:
            return "boolean";
        case Number:
            return "number";
        case Object:
            return "object";
        case String:
            return "string";
    }
}
function $861a37e0262dfc28$var$parseValueTypeDefault(defaultValue) {
    switch(typeof defaultValue){
        case "boolean":
            return "boolean";
        case "number":
            return "number";
        case "string":
            return "string";
    }
    if (Array.isArray(defaultValue)) return "array";
    if (Object.prototype.toString.call(defaultValue) === "[object Object]") return "object";
}
function $861a37e0262dfc28$var$parseValueTypeObject(payload) {
    const { controller: controller, token: token, typeObject: typeObject } = payload;
    const hasType = $861a37e0262dfc28$var$isSomething(typeObject.type);
    const hasDefault = $861a37e0262dfc28$var$isSomething(typeObject.default);
    const fullObject = hasType && hasDefault;
    const onlyType = hasType && !hasDefault;
    const onlyDefault = !hasType && hasDefault;
    const typeFromObject = $861a37e0262dfc28$var$parseValueTypeConstant(typeObject.type);
    const typeFromDefaultValue = $861a37e0262dfc28$var$parseValueTypeDefault(payload.typeObject.default);
    if (onlyType) return typeFromObject;
    if (onlyDefault) return typeFromDefaultValue;
    if (typeFromObject !== typeFromDefaultValue) {
        const propertyPath = controller ? `${controller}.${token}` : token;
        throw new Error(`The specified default value for the Stimulus Value "${propertyPath}" must match the defined type "${typeFromObject}". The provided default value of "${typeObject.default}" is of type "${typeFromDefaultValue}".`);
    }
    if (fullObject) return typeFromObject;
}
function $861a37e0262dfc28$var$parseValueTypeDefinition(payload) {
    const { controller: controller, token: token, typeDefinition: typeDefinition } = payload;
    const typeObject = {
        controller: controller,
        token: token,
        typeObject: typeDefinition
    };
    const typeFromObject = $861a37e0262dfc28$var$parseValueTypeObject(typeObject);
    const typeFromDefaultValue = $861a37e0262dfc28$var$parseValueTypeDefault(typeDefinition);
    const typeFromConstant = $861a37e0262dfc28$var$parseValueTypeConstant(typeDefinition);
    const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
    if (type) return type;
    const propertyPath = controller ? `${controller}.${typeDefinition}` : token;
    throw new Error(`Unknown value type "${propertyPath}" for "${token}" value`);
}
function $861a37e0262dfc28$var$defaultValueForDefinition(typeDefinition) {
    const constant = $861a37e0262dfc28$var$parseValueTypeConstant(typeDefinition);
    if (constant) return $861a37e0262dfc28$var$defaultValuesByType[constant];
    const hasDefault = $861a37e0262dfc28$var$hasProperty(typeDefinition, "default");
    const hasType = $861a37e0262dfc28$var$hasProperty(typeDefinition, "type");
    const typeObject = typeDefinition;
    if (hasDefault) return typeObject.default;
    if (hasType) {
        const { type: type } = typeObject;
        const constantFromType = $861a37e0262dfc28$var$parseValueTypeConstant(type);
        if (constantFromType) return $861a37e0262dfc28$var$defaultValuesByType[constantFromType];
    }
    return typeDefinition;
}
function $861a37e0262dfc28$var$valueDescriptorForTokenAndTypeDefinition(payload) {
    const { token: token, typeDefinition: typeDefinition } = payload;
    const key = `${$861a37e0262dfc28$var$dasherize(token)}-value`;
    const type = $861a37e0262dfc28$var$parseValueTypeDefinition(payload);
    return {
        type: type,
        key: key,
        name: $861a37e0262dfc28$var$camelize(key),
        get defaultValue () {
            return $861a37e0262dfc28$var$defaultValueForDefinition(typeDefinition);
        },
        get hasCustomDefaultValue () {
            return $861a37e0262dfc28$var$parseValueTypeDefault(typeDefinition) !== undefined;
        },
        reader: $861a37e0262dfc28$var$readers[type],
        writer: $861a37e0262dfc28$var$writers[type] || $861a37e0262dfc28$var$writers.default
    };
}
const $861a37e0262dfc28$var$defaultValuesByType = {
    get array () {
        return [];
    },
    boolean: false,
    number: 0,
    get object () {
        return {};
    },
    string: ""
};
const $861a37e0262dfc28$var$readers = {
    array (value) {
        const array = JSON.parse(value);
        if (!Array.isArray(array)) throw new TypeError(`expected value of type "array" but instead got value "${value}" of type "${$861a37e0262dfc28$var$parseValueTypeDefault(array)}"`);
        return array;
    },
    boolean (value) {
        return !(value == "0" || String(value).toLowerCase() == "false");
    },
    number (value) {
        return Number(value.replace(/_/g, ""));
    },
    object (value) {
        const object = JSON.parse(value);
        if (object === null || typeof object != "object" || Array.isArray(object)) throw new TypeError(`expected value of type "object" but instead got value "${value}" of type "${$861a37e0262dfc28$var$parseValueTypeDefault(object)}"`);
        return object;
    },
    string (value) {
        return value;
    }
};
const $861a37e0262dfc28$var$writers = {
    default: $861a37e0262dfc28$var$writeString,
    array: $861a37e0262dfc28$var$writeJSON,
    object: $861a37e0262dfc28$var$writeJSON
};
function $861a37e0262dfc28$var$writeJSON(value) {
    return JSON.stringify(value);
}
function $861a37e0262dfc28$var$writeString(value) {
    return `${value}`;
}
class $861a37e0262dfc28$export$bd0bf19f25da8474 {
    constructor(context){
        this.context = context;
    }
    static get shouldLoad() {
        return true;
    }
    static afterLoad(_identifier, _application) {
        return;
    }
    get application() {
        return this.context.application;
    }
    get scope() {
        return this.context.scope;
    }
    get element() {
        return this.scope.element;
    }
    get identifier() {
        return this.scope.identifier;
    }
    get targets() {
        return this.scope.targets;
    }
    get outlets() {
        return this.scope.outlets;
    }
    get classes() {
        return this.scope.classes;
    }
    get data() {
        return this.scope.data;
    }
    initialize() {}
    connect() {}
    disconnect() {}
    dispatch(eventName, { target: target = this.element, detail: detail = {}, prefix: prefix = this.identifier, bubbles: bubbles = true, cancelable: cancelable = true } = {}) {
        const type = prefix ? `${prefix}:${eventName}` : eventName;
        const event = new CustomEvent(type, {
            detail: detail,
            bubbles: bubbles,
            cancelable: cancelable
        });
        target.dispatchEvent(event);
        return event;
    }
}
$861a37e0262dfc28$export$bd0bf19f25da8474.blessings = [
    $861a37e0262dfc28$var$ClassPropertiesBlessing,
    $861a37e0262dfc28$var$TargetPropertiesBlessing,
    $861a37e0262dfc28$var$ValuePropertiesBlessing,
    $861a37e0262dfc28$var$OutletPropertiesBlessing
];
$861a37e0262dfc28$export$bd0bf19f25da8474.targets = [];
$861a37e0262dfc28$export$bd0bf19f25da8474.outlets = [];
$861a37e0262dfc28$export$bd0bf19f25da8474.values = {};



class $1e3a7605f5964432$export$2e2bcd8739ae039 extends (0, $861a37e0262dfc28$export$bd0bf19f25da8474) {
    connect() {
        (0, $0c4a772011edf2b8$export$d8d8c48ace6d5d1b)(this);
    }
}




export {$0c4a772011edf2b8$export$d8d8c48ace6d5d1b as useValueBindings, $1e3a7605f5964432$export$2e2bcd8739ae039 as ValueBindingsController, $b3e7e8c1a3c43eb7$export$bdd553fddd433dcb as nextTick};
//# sourceMappingURL=main.js.map
