let $1b65c17c68ad2def$var$stack = [];
function $1b65c17c68ad2def$export$bdd553fddd433dcb(callback = ()=>{}) {
    queueMicrotask(()=>{
        setTimeout(()=>$1b65c17c68ad2def$var$releaseNextTicks());
    });
    return new Promise((res)=>{
        $1b65c17c68ad2def$var$stack.push(()=>{
            callback();
            res();
        });
    });
}
function $1b65c17c68ad2def$var$releaseNextTicks() {
    while($1b65c17c68ad2def$var$stack.length)$1b65c17c68ad2def$var$stack.shift()();
}


function $f2c6b253ca7f90a5$export$588732934346abbf(el, callback) {
    let skip = false;
    callback(el, ()=>skip = true);
    if (skip) return;
    let node = el.firstElementChild;
    while(node){
        $f2c6b253ca7f90a5$export$588732934346abbf(node, callback, false);
        node = node.nextElementSibling;
    }
}


function $ab15207bcd454330$export$61fc7d43ac8f84b0(func, wait) {
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




let $c9c38abdedb1801d$var$flushPending = false;
let $c9c38abdedb1801d$var$flushing = false;
let $c9c38abdedb1801d$var$queue = [];
function $c9c38abdedb1801d$export$fba1a0a20887772f(job) {
    if (!$c9c38abdedb1801d$var$queue.includes(job)) $c9c38abdedb1801d$var$queue.push(job);
    $c9c38abdedb1801d$var$queueFlush();
}
function $c9c38abdedb1801d$var$queueFlush() {
    if (!$c9c38abdedb1801d$var$flushing && !$c9c38abdedb1801d$var$flushPending) {
        $c9c38abdedb1801d$var$flushPending = true;
        queueMicrotask($c9c38abdedb1801d$export$8ca066e62735a16c);
    }
}
function $c9c38abdedb1801d$export$8ca066e62735a16c() {
    $c9c38abdedb1801d$var$flushPending = false;
    $c9c38abdedb1801d$var$flushing = true;
    for(let i = 0; i < $c9c38abdedb1801d$var$queue.length; i++){
        $c9c38abdedb1801d$var$queue[i]();
        lastFlushedIndex = i;
    }
    $c9c38abdedb1801d$var$queue.length = 0;
    lastFlushedIndex = -1;
    $c9c38abdedb1801d$var$flushing = false;
}


function $2f1bc38ffa799d8a$export$7e6f8094deb93e61(controller, callback) {
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


function $27fd7c4a96ba66c2$export$1530b8c0a3516a7d(controller, callback) {
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




const $58aadf541c12f919$var$isObject = (value)=>{
    const type = typeof value;
    return value !== null && (type === 'object' || type === 'function');
};
const $58aadf541c12f919$var$isEmptyObject = (value)=>$58aadf541c12f919$var$isObject(value) && Object.keys(value).length === 0;
const $58aadf541c12f919$var$disallowedKeys = new Set([
    '__proto__',
    'prototype',
    'constructor'
]);
const $58aadf541c12f919$var$digits = new Set('0123456789');
function $58aadf541c12f919$var$getPathSegments(path) {
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
            if ($58aadf541c12f919$var$disallowedKeys.has(currentSegment)) return [];
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
                if ($58aadf541c12f919$var$disallowedKeys.has(currentSegment)) return [];
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
            if (currentPart === 'index' && !$58aadf541c12f919$var$digits.has(character)) throw new Error('Invalid character in an index');
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
            if ($58aadf541c12f919$var$disallowedKeys.has(currentSegment)) return [];
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
function $58aadf541c12f919$var$isStringIndex(object, key) {
    if (typeof key !== 'number' && Array.isArray(object)) {
        const index = Number.parseInt(key, 10);
        return Number.isInteger(index) && object[index] === object[key];
    }
    return false;
}
function $58aadf541c12f919$var$assertNotStringIndex(object, key) {
    if ($58aadf541c12f919$var$isStringIndex(object, key)) throw new Error('Cannot use string index');
}
function $58aadf541c12f919$export$63ef76b19cf4a753(object, path, value) {
    if (!$58aadf541c12f919$var$isObject(object) || typeof path !== 'string') return value === undefined ? object : value;
    const pathArray = $58aadf541c12f919$var$getPathSegments(path);
    if (pathArray.length === 0) return value;
    for(let index = 0; index < pathArray.length; index++){
        const key = pathArray[index];
        if ($58aadf541c12f919$var$isStringIndex(object, key)) object = index === pathArray.length - 1 ? undefined : null;
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
function $58aadf541c12f919$export$a41c68a4eb5ff164(object, path, value) {
    if (!$58aadf541c12f919$var$isObject(object) || typeof path !== 'string') return object;
    const root = object;
    const pathArray = $58aadf541c12f919$var$getPathSegments(path);
    for(let index = 0; index < pathArray.length; index++){
        const key = pathArray[index];
        $58aadf541c12f919$var$assertNotStringIndex(object, key);
        if (index === pathArray.length - 1) object[key] = value;
        else if (!$58aadf541c12f919$var$isObject(object[key])) object[key] = typeof pathArray[index + 1] === 'number' ? [] : {};
        object = object[key];
    }
    return root;
}
function $58aadf541c12f919$export$2fae62fb628b9c68(object, path) {
    if (!$58aadf541c12f919$var$isObject(object) || typeof path !== 'string') return false;
    const pathArray = $58aadf541c12f919$var$getPathSegments(path);
    for(let index = 0; index < pathArray.length; index++){
        const key = pathArray[index];
        $58aadf541c12f919$var$assertNotStringIndex(object, key);
        if (index === pathArray.length - 1) {
            delete object[key];
            return true;
        }
        object = object[key];
        if (!$58aadf541c12f919$var$isObject(object)) return false;
    }
}
function $58aadf541c12f919$export$bf9617eaf5d2451(object, path) {
    if (!$58aadf541c12f919$var$isObject(object) || typeof path !== 'string') return false;
    const pathArray = $58aadf541c12f919$var$getPathSegments(path);
    if (pathArray.length === 0) return false;
    for (const key of pathArray){
        if (!$58aadf541c12f919$var$isObject(object) || !(key in object) || $58aadf541c12f919$var$isStringIndex(object, key)) return false;
        object = object[key];
    }
    return true;
}
function $58aadf541c12f919$export$b36556ce4a09dde6(path) {
    if (typeof path !== 'string') throw new TypeError('Expected a string');
    return path.replaceAll(/[\\.[]/g, '\\$&');
}
// The keys returned by Object.entries() for arrays are strings
function $58aadf541c12f919$var$entries(value) {
    const result = Object.entries(value);
    if (Array.isArray(value)) return result.map(([key, value])=>[
            Number(key),
            value
        ]);
    return result;
}
function $58aadf541c12f919$var$stringifyPath(pathSegments) {
    let result = '';
    for (let [index, segment] of $58aadf541c12f919$var$entries(pathSegments))if (typeof segment === 'number') result += `[${segment}]`;
    else {
        segment = $58aadf541c12f919$export$b36556ce4a09dde6(segment);
        result += index === 0 ? segment : `.${segment}`;
    }
    return result;
}
function* $58aadf541c12f919$var$deepKeysIterator(object, currentPath = []) {
    if (!$58aadf541c12f919$var$isObject(object) || $58aadf541c12f919$var$isEmptyObject(object)) {
        if (currentPath.length > 0) yield $58aadf541c12f919$var$stringifyPath(currentPath);
        return;
    }
    for (const [key, value] of $58aadf541c12f919$var$entries(object))yield* $58aadf541c12f919$var$deepKeysIterator(value, [
        ...currentPath,
        key
    ]);
}
function $58aadf541c12f919$export$13f626a1d0c23ea1(object) {
    return [
        ...$58aadf541c12f919$var$deepKeysIterator(object)
    ];
}



function $e079e892a7dd69f3$export$2385a24977818dd0(element, name, value) {
    switch(name){
        case "all":
            $e079e892a7dd69f3$var$bindAll(element, value);
            break;
        case "text":
            $e079e892a7dd69f3$var$bindText(element, value);
            break;
        case "html":
            $e079e892a7dd69f3$var$bindHTML(element, value);
            break;
        case "checked":
        case "selected":
            $e079e892a7dd69f3$var$bindAttributeAndProperty(element, name, value);
            break;
        default:
            $e079e892a7dd69f3$var$bindAttribute(element, name, value);
            break;
    }
}
function $e079e892a7dd69f3$var$bindText(element, value) {
    element.innerText = value;
}
function $e079e892a7dd69f3$var$bindHTML(element, value) {
    element.innerHTML = value;
}
function $e079e892a7dd69f3$var$bindAttribute(el, name, value) {
    if ([
        null,
        undefined,
        false
    ].includes(value) && $e079e892a7dd69f3$var$attributeShouldntBePreservedIfFalsy(name)) el.removeAttribute(name);
    else {
        if ($e079e892a7dd69f3$var$isBooleanAttr(name)) value = name;
        $e079e892a7dd69f3$var$setIfChanged(el, name, value);
    }
}
function $e079e892a7dd69f3$var$bindAll(element, obj) {
    Object.keys(obj).forEach((name)=>$e079e892a7dd69f3$export$2385a24977818dd0(element, name, (0, $58aadf541c12f919$export$63ef76b19cf4a753)(obj, name)));
}
function $e079e892a7dd69f3$var$bindAttributeAndProperty(el, name, value) {
    $e079e892a7dd69f3$var$bindAttribute(el, name, value);
    $e079e892a7dd69f3$var$setPropertyIfChanged(el, name, value);
}
function $e079e892a7dd69f3$var$setIfChanged(el, attrName, value) {
    if (el.getAttribute(attrName) != value) el.setAttribute(attrName, value);
}
function $e079e892a7dd69f3$var$setPropertyIfChanged(el, propName, value) {
    if (el[propName] !== value) el[propName] = value;
}
// As per HTML spec table https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute
const $e079e892a7dd69f3$var$booleanAttributes = new Set([
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
function $e079e892a7dd69f3$var$isBooleanAttr(attrName) {
    return $e079e892a7dd69f3$var$booleanAttributes.has(attrName);
}
function $e079e892a7dd69f3$var$attributeShouldntBePreservedIfFalsy(name) {
    return ![
        "aria-pressed",
        "aria-checked",
        "aria-expanded",
        "aria-selected"
    ].includes(name);
}



function $b06a48268576e1c4$export$816b23a2bc3d44ec(controller, callback) {
    const bindings = $b06a48268576e1c4$export$afc479602647d2a4(controller);
    bindings.forEach((binding)=>{
        let { node: node, name: name, path: path, negated: negated } = binding;
        if (!controller.element.contains(node)) // clean up any bindings for elements that have been removed from the DOM
        bindings.delete(binding);
        else {
            // Update bindings for the node
            const value = (0, $58aadf541c12f919$export$63ef76b19cf4a753)(controller, path);
            (0, $e079e892a7dd69f3$export$2385a24977818dd0)(node, name, negated ? !value : value);
            node.removeAttribute("data-cloak");
        }
    });
    if (typeof callback === "function") // Run the callback once all bindings have been updated.
    callback();
}
function $b06a48268576e1c4$export$2696433f89f63f2f(controller) {
    if (!$b06a48268576e1c4$var$bindingsAreInitialized(controller)) {
        controller.__value_bindings = new Set();
        $b06a48268576e1c4$export$9d08f9cef6f4df8b(controller, controller.element);
    }
}
function $b06a48268576e1c4$export$9d08f9cef6f4df8b(controller, rootNode) {
    const attrPrefix = `data-${controller.identifier}-bind`;
    (0, $f2c6b253ca7f90a5$export$588732934346abbf)(rootNode, (node)=>{
        Array.from(node.attributes).filter(({ name: name })=>name.startsWith(attrPrefix)).forEach((attr)=>{
            let negated = false;
            let path = attr.value;
            if (path.startsWith("!")) {
                negated = true;
                path = path.replace("!", "");
            }
            const name = attr.name === attrPrefix ? "all" : attr.name.replace(`${attrPrefix}-`, "");
            $b06a48268576e1c4$export$794005cd6f1aea3(controller, node, name, path, negated);
            node.removeAttribute(attr.name);
        });
    });
}
function $b06a48268576e1c4$export$317a120ffaa434e1(controller) {
    $b06a48268576e1c4$export$b7c6f809f4c7570b(controller);
    $b06a48268576e1c4$export$2696433f89f63f2f(controller);
}
function $b06a48268576e1c4$export$794005cd6f1aea3(controller, node, name, path, negated) {
    $b06a48268576e1c4$export$afc479602647d2a4(controller).add({
        node: node,
        name: name,
        path: path,
        negated: negated
    });
}
function $b06a48268576e1c4$export$3eff236524896414(controller, node) {
    const bindings = $b06a48268576e1c4$export$afc479602647d2a4(controller);
    bindings.forEach((binding)=>{
        if (binding.node === node) bindings.delete(binding);
    });
}
function $b06a48268576e1c4$export$b7c6f809f4c7570b(controller) {
    controller.__value_bindings?.clear();
    controller.__value_bindings = new Set();
}
function $b06a48268576e1c4$export$afc479602647d2a4(controller) {
    return controller.__value_bindings;
}
function $b06a48268576e1c4$var$bindingsAreInitialized(controller) {
    return controller.__value_bindings instanceof Set;
}


const $74d2fd5bf8805eea$export$d8d8c48ace6d5d1b = (controller)=>{
    let initialUpdateHasRun = false;
    const updateBindingsAndNotify = ()=>{
        (0, $b06a48268576e1c4$export$816b23a2bc3d44ec)(controller, ()=>{
            if (typeof controller.bindingsUpdated === "function") controller.bindingsUpdated(!initialUpdateHasRun);
        });
        initialUpdateHasRun = true;
    };
    const scheduleUpdate = ()=>(0, $c9c38abdedb1801d$export$fba1a0a20887772f)(updateBindingsAndNotify);
    const valuesObserver = (0, $2f1bc38ffa799d8a$export$7e6f8094deb93e61)(controller, scheduleUpdate);
    const treeObserver = (0, $27fd7c4a96ba66c2$export$1530b8c0a3516a7d)(controller, (addedNodes, removedNodes)=>{
        removedNodes.forEach((node)=>(0, $b06a48268576e1c4$export$3eff236524896414)(controller, node));
        addedNodes.forEach((node)=>(0, $b06a48268576e1c4$export$9d08f9cef6f4df8b)(controller, node));
        treeObserver.runWithoutObservation(updateBindingsAndNotify);
    });
    (0, $b06a48268576e1c4$export$2696433f89f63f2f)(controller);
    scheduleUpdate();
    const disconnect = controller.disconnect;
    Object.assign(controller, {
        updateBindings: scheduleUpdate,
        disconnect () {
            valuesObserver.stop();
            treeObserver.stop();
            (0, $b06a48268576e1c4$export$b7c6f809f4c7570b)(controller);
            if (typeof disconnect === "function") disconnect.bind(controller)();
        }
    });
    treeObserver.start();
    valuesObserver.start();
};




export {$74d2fd5bf8805eea$export$d8d8c48ace6d5d1b as useValueBindings, $1b65c17c68ad2def$export$bdd553fddd433dcb as nextTick};
//# sourceMappingURL=main.js.map
