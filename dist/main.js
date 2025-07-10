import {getProperty as $5OpyM$getProperty} from "dot-prop";

let $d4ae3234addc34de$var$stack = [];
function $d4ae3234addc34de$export$bdd553fddd433dcb(callback = ()=>{}) {
    queueMicrotask(()=>{
        setTimeout(()=>$d4ae3234addc34de$var$releaseNextTicks());
    });
    return new Promise((res)=>{
        $d4ae3234addc34de$var$stack.push(()=>{
            callback();
            res();
        });
    });
}
function $d4ae3234addc34de$var$releaseNextTicks() {
    while($d4ae3234addc34de$var$stack.length)$d4ae3234addc34de$var$stack.shift()();
}


function $95c85b5463da005b$export$588732934346abbf(el, callback) {
    let skip = false;
    callback(el, ()=>skip = true);
    if (skip) return;
    let node = el.firstElementChild;
    while(node){
        $95c85b5463da005b$export$588732934346abbf(node, callback, false);
        node = node.nextElementSibling;
    }
}


function $6171ecfbc5185ed7$export$61fc7d43ac8f84b0(func, wait) {
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




let $eae25d6e66596517$var$flushPending = false;
let $eae25d6e66596517$var$flushing = false;
let $eae25d6e66596517$var$queue = [];
function $eae25d6e66596517$export$fba1a0a20887772f(job) {
    if (!$eae25d6e66596517$var$queue.includes(job)) $eae25d6e66596517$var$queue.push(job);
    $eae25d6e66596517$var$queueFlush();
}
function $eae25d6e66596517$var$queueFlush() {
    if (!$eae25d6e66596517$var$flushing && !$eae25d6e66596517$var$flushPending) {
        $eae25d6e66596517$var$flushPending = true;
        queueMicrotask($eae25d6e66596517$export$8ca066e62735a16c);
    }
}
function $eae25d6e66596517$export$8ca066e62735a16c() {
    $eae25d6e66596517$var$flushPending = false;
    $eae25d6e66596517$var$flushing = true;
    for(let i = 0; i < $eae25d6e66596517$var$queue.length; i++){
        $eae25d6e66596517$var$queue[i]();
        lastFlushedIndex = i;
    }
    $eae25d6e66596517$var$queue.length = 0;
    lastFlushedIndex = -1;
    $eae25d6e66596517$var$flushing = false;
}


function $6f9c88a3e0762a2c$export$7e6f8094deb93e61(controller, callback) {
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


function $dcb8aed17f7a9f14$export$1530b8c0a3516a7d(controller, callback) {
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






function $e244f1b8e144127e$export$2385a24977818dd0(element, name, value) {
    switch(name){
        case "all":
            $e244f1b8e144127e$var$bindAll(element, value);
            break;
        case "text":
            $e244f1b8e144127e$var$bindText(element, value);
            break;
        case "html":
            $e244f1b8e144127e$var$bindHTML(element, value);
            break;
        case "checked":
        case "selected":
            $e244f1b8e144127e$var$bindAttributeAndProperty(element, name, value);
            break;
        default:
            $e244f1b8e144127e$var$bindAttribute(element, name, value);
            break;
    }
}
function $e244f1b8e144127e$var$bindText(element, value) {
    element.innerText = value;
}
function $e244f1b8e144127e$var$bindHTML(element, value) {
    element.innerHTML = value;
}
function $e244f1b8e144127e$var$bindAttribute(el, name, value) {
    if ([
        null,
        undefined,
        false
    ].includes(value) && $e244f1b8e144127e$var$attributeShouldntBePreservedIfFalsy(name)) el.removeAttribute(name);
    else {
        if ($e244f1b8e144127e$var$isBooleanAttr(name)) value = name;
        $e244f1b8e144127e$var$setIfChanged(el, name, value);
    }
}
function $e244f1b8e144127e$var$bindAll(element, obj) {
    Object.keys(obj).forEach((name)=>$e244f1b8e144127e$export$2385a24977818dd0(element, name, (0, $5OpyM$getProperty)(obj, name)));
}
function $e244f1b8e144127e$var$bindAttributeAndProperty(el, name, value) {
    $e244f1b8e144127e$var$bindAttribute(el, name, value);
    $e244f1b8e144127e$var$setPropertyIfChanged(el, name, value);
}
function $e244f1b8e144127e$var$setIfChanged(el, attrName, value) {
    if (el.getAttribute(attrName) != value) el.setAttribute(attrName, value);
}
function $e244f1b8e144127e$var$setPropertyIfChanged(el, propName, value) {
    if (el[propName] !== value) el[propName] = value;
}
// As per HTML spec table https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute
const $e244f1b8e144127e$var$booleanAttributes = new Set([
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
function $e244f1b8e144127e$var$isBooleanAttr(attrName) {
    return $e244f1b8e144127e$var$booleanAttributes.has(attrName);
}
function $e244f1b8e144127e$var$attributeShouldntBePreservedIfFalsy(name) {
    return ![
        "aria-pressed",
        "aria-checked",
        "aria-expanded",
        "aria-selected"
    ].includes(name);
}



function $81fb34e72745e1de$export$816b23a2bc3d44ec(controller, callback) {
    const bindings = $81fb34e72745e1de$export$afc479602647d2a4(controller);
    bindings.forEach((binding)=>{
        let { node: node, name: name, path: path, negated: negated } = binding;
        if (!controller.element.contains(node)) // clean up any bindings for elements that have been removed from the DOM
        bindings.delete(binding);
        else {
            // Update bindings for the node
            const value = (0, $5OpyM$getProperty)(controller, path);
            (0, $e244f1b8e144127e$export$2385a24977818dd0)(node, name, negated ? !value : value);
            node.removeAttribute("data-cloak");
        }
    });
    if (typeof callback === "function") // Run the callback once all bindings have been updated.
    callback();
}
function $81fb34e72745e1de$export$2696433f89f63f2f(controller) {
    if (!$81fb34e72745e1de$var$bindingsAreInitialized(controller)) {
        controller.__value_bindings = new Set();
        $81fb34e72745e1de$export$9d08f9cef6f4df8b(controller, controller.element);
    }
}
function $81fb34e72745e1de$export$9d08f9cef6f4df8b(controller, rootNode) {
    const attrPrefix = `data-${controller.identifier}-bind`;
    (0, $95c85b5463da005b$export$588732934346abbf)(rootNode, (node)=>{
        Array.from(node.attributes).filter(({ name: name })=>name.startsWith(attrPrefix)).forEach((attr)=>{
            let negated = false;
            let path = attr.value;
            if (path.startsWith("!")) {
                negated = true;
                path = path.replace("!", "");
            }
            const name = attr.name === attrPrefix ? "all" : attr.name.replace(`${attrPrefix}-`, "");
            $81fb34e72745e1de$export$794005cd6f1aea3(controller, node, name, path, negated);
            node.removeAttribute(attr.name);
        });
    });
}
function $81fb34e72745e1de$export$317a120ffaa434e1(controller) {
    $81fb34e72745e1de$export$b7c6f809f4c7570b(controller);
    $81fb34e72745e1de$export$2696433f89f63f2f(controller);
}
function $81fb34e72745e1de$export$794005cd6f1aea3(controller, node, name, path, negated) {
    $81fb34e72745e1de$export$afc479602647d2a4(controller).add({
        node: node,
        name: name,
        path: path,
        negated: negated
    });
}
function $81fb34e72745e1de$export$3eff236524896414(controller, node) {
    const bindings = $81fb34e72745e1de$export$afc479602647d2a4(controller);
    bindings.forEach((binding)=>{
        if (binding.node === node) bindings.delete(binding);
    });
}
function $81fb34e72745e1de$export$b7c6f809f4c7570b(controller) {
    controller.__value_bindings?.clear();
    controller.__value_bindings = new Set();
}
function $81fb34e72745e1de$export$afc479602647d2a4(controller) {
    return controller.__value_bindings;
}
function $81fb34e72745e1de$var$bindingsAreInitialized(controller) {
    return controller.__value_bindings instanceof Set;
}


const $591b1c2388287e20$export$d8d8c48ace6d5d1b = (controller)=>{
    let initialUpdateHasRun = false;
    const updateBindingsAndNotify = ()=>{
        (0, $81fb34e72745e1de$export$816b23a2bc3d44ec)(controller, ()=>{
            if (typeof controller.bindingsUpdated === "function") controller.bindingsUpdated(!initialUpdateHasRun);
        });
        initialUpdateHasRun = true;
    };
    const scheduleUpdate = ()=>(0, $eae25d6e66596517$export$fba1a0a20887772f)(updateBindingsAndNotify);
    const valuesObserver = (0, $6f9c88a3e0762a2c$export$7e6f8094deb93e61)(controller, scheduleUpdate);
    const treeObserver = (0, $dcb8aed17f7a9f14$export$1530b8c0a3516a7d)(controller, (addedNodes, removedNodes)=>{
        removedNodes.forEach((node)=>(0, $81fb34e72745e1de$export$3eff236524896414)(controller, node));
        addedNodes.forEach((node)=>(0, $81fb34e72745e1de$export$9d08f9cef6f4df8b)(controller, node));
        treeObserver.runWithoutObservation(updateBindingsAndNotify);
    });
    (0, $81fb34e72745e1de$export$2696433f89f63f2f)(controller);
    scheduleUpdate();
    const disconnect = controller.disconnect;
    Object.assign(controller, {
        updateBindings: scheduleUpdate,
        disconnect () {
            valuesObserver.stop();
            treeObserver.stop();
            (0, $81fb34e72745e1de$export$b7c6f809f4c7570b)(controller);
            if (typeof disconnect === "function") disconnect.bind(controller)();
        }
    });
    treeObserver.start();
    valuesObserver.start();
};




export {$591b1c2388287e20$export$d8d8c48ace6d5d1b as useValueBindings, $d4ae3234addc34de$export$bdd553fddd433dcb as nextTick};
//# sourceMappingURL=main.js.map
