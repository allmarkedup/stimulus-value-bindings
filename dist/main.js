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


function $e70725f4c88e33dc$export$61fc7d43ac8f84b0(func, wait) {
    var timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
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



function $6bb642d3be92d590$export$2385a24977818dd0(element, name, value) {
    switch(name){
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
            // Update bindings for the node
            const value = (0, $e831555dc9bb4016$export$63ef76b19cf4a753)(controller, path);
            (0, $6bb642d3be92d590$export$2385a24977818dd0)(node, name, negated ? !value : value);
            node.removeAttribute("data-cloak");
        }
    });
    if (typeof callback === "function") // Run the callback once all bindings have been updated.
    callback();
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




export {$0c4a772011edf2b8$export$d8d8c48ace6d5d1b as useValueBindings, $b3e7e8c1a3c43eb7$export$bdd553fddd433dcb as nextTick};
//# sourceMappingURL=main.js.map
