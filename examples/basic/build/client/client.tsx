"use client";
import ReactDomClient from "react-dom/client";
import React from "react";
import f_45 from "./components/server-functions-with-form-actions/UpdateName.tsx";
import f_44 from "./components/server-functions-with-actions/UpdateMyName.tsx";
import f_43 from "./components/passing-live-promise-to-client/Comments.tsx";
import f_42 from "./components/importing-server-functions-from-client-components/EmptyNote.tsx";
import f_41 from "./components/how-use-client-marks-client-code/InspirationGenerator.tsx";
import f_40 from "./components/how-use-client-marks-client-code/FancyText.tsx";
import f_39 from "./components/creating-server-function-from-server-component/Button.tsx";
import f_38 from "./components/calling-server-function-outside-form/LikeButton.tsx";
import f_37 from "./components/async-components-with-server-components/Comments.tsx";
import f_36 from "./components/adding-interactivity-to-server-components/Expandable.tsx";
console.log("--- Client bundle code running ---");
window.$f_36 = f_36;
window.$f_37 = f_37;
window.$f_38 = f_38;
window.$f_39 = f_39;
window.$f_40 = f_40;
window.$f_41 = f_41;
window.$f_42 = f_42;
window.$f_43 = f_43;
window.$f_44 = f_44;
window.$f_45 = f_45;

/* FORKET CLIENT */
// @ts-ignore
(() => {
  // lib/client/index.js
  (function() {
    const FORKET_SERVER_ACTIONS_ENDPOINT = "/@forket";
    const ENABLE_LOGGING = 1;
    const log = ENABLE_LOGGING ? console.log.bind(console) : () => {
    };
    const roots = /* @__PURE__ */ new Map();
    const renderers = window.$F_renderers = {};
    const ATTR_MAP = {
      class: "className",
      for: "htmlFor",
      readonly: "readOnly",
      tabindex: "tabIndex",
      maxlength: "maxLength",
      colspan: "colSpan",
      rowspan: "rowSpan"
    };
    const BOOLEAN_ATTRS = /* @__PURE__ */ new Set([
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
      "hidden",
      "inert",
      "ismap",
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
    function FRSC_init() {
      const d = document;
      let islands = typeof window.$FRSC_ !== "undefined" ? window.$FRSC_ : [];
      log(`\u{10090} [client] \u{1F3DD}\uFE0F(${islands.length}) v${"0.7.9"}`);
      if (typeof window.$FRSC === "undefined") {
        window.$FRSC = function(data) {
          const id = data[0];
          const componentName = data[1];
          const props = normalizeProps(data[2]);
          const children = getChildren(id);
          return hydrateComponentBetweenMarkers(id, componentName, props, children);
        };
      }
      if (islands.length > 0) {
        islands = window.$FRSC_ = islands.filter((i) => !window.$FRSC(i));
      }
      function hydrateComponentBetweenMarkers(id, componentName, props, children) {
        renderers[id] = function(newProps) {
          const Component = window["$" + id];
          if (!Component) {
            console.warn(`\u{10090} Component <${componentName}> not found in the global scope yet.`);
            return false;
          }
          const boundary = {
            start: d.querySelector(`template[type="forket/start/${id}"]`),
            end: d.querySelector(`template[type="forket/end/${id}"]`)
          };
          if (!boundary.start || !boundary.end) {
            console.warn(`\u{10090} Boundary not found for <${componentName}>. Re-trying rendering in 1 sec.`);
            setTimeout(() => renderers[id](newProps), 1e3);
            return false;
          }
          const container = d.createElement("div");
          moveInServerGeneratedElements(boundary.start, boundary.end, container);
          container.style.display = "contents";
          boundary.end.parentNode.insertBefore(container, boundary.end);
          boundary.end.parentNode.removeChild(boundary.start);
          boundary.end.parentNode.removeChild(boundary.end);
          renderers[id] = function(newProps2) {
            if (newProps2) {
              props = { ...props, ...newProps2 };
            }
            log("\u{10090} [client] Rendering <" + componentName + ">", { props, children });
            mountOrUpdate(container, React.createElement(Component, props, children));
            return true;
          };
          return renderers[id](newProps);
        };
        return renderers[id]();
      }
      function normalizeProps(content) {
        try {
          content = JSON.parse(content, function(key, value) {
            if (key === "children") {
              return;
            }
            if (typeof value === "string" && value.match(/^\$FSA_/)) {
              const funcName = value.replace(/^\$FSA_/, "");
              return window.FSA_call(value, funcName);
            } else if (typeof value === "string" && value.match(/^\$FLP_/)) {
              return new Promise((resolve, reject) => {
                const id = value.replace(/^\$FLP_/, "");
                if (typeof window.$FLP_ === "undefined") {
                  window.$FLP_ = {};
                }
                if (typeof window.$FLP_[id] === "undefined") {
                  window.$FLP_[id] = {
                    status: "unknown",
                    resolve,
                    reject
                  };
                } else {
                  window.$FLP_[id].resolve = resolve;
                  window.$FLP_[id].reject = reject;
                  FLP_process(id);
                }
              });
            }
            return value;
          });
        } catch (e) {
          console.warn("\u{10090} Error parsing props content:", e);
          content = {};
        }
        return content;
      }
      function getChildren(id) {
        const template = d.querySelector(`template[type="forket/children"]#${id}`);
        if (!template) {
          return null;
        }
        const content = template.innerHTML;
        template?.parentNode?.removeChild(template);
        return htmlToReactElements(content);
      }
      function moveInServerGeneratedElements(start, end, newParent) {
        let current = start.nextSibling;
        while (current && current !== end) {
          const next = current.nextSibling;
          newParent.appendChild(current);
          current = next;
        }
      }
      function htmlToReactElements(html) {
        const tpl = document.createElement("template");
        tpl.innerHTML = html;
        const out = [];
        tpl.content.childNodes.forEach((n, i) => {
          const el = domNodeToReact(n, `root.${i}`);
          if (Array.isArray(el)) out.push(...el);
          else if (el !== null && el !== "") out.push(el);
        });
        return out;
      }
      function toCamel(s) {
        return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      }
      function parseStyle(styleText) {
        const style = {};
        styleText.split(";").forEach((rule) => {
          const [rawProp, rawVal] = rule.split(":");
          if (!rawProp || !rawVal) return;
          const prop = toCamel(rawProp.trim());
          let val = rawVal.trim();
          if (!Number.isNaN(Number(val)) && val !== "") val = Number(val);
          style[prop] = val;
        });
        return style;
      }
      function attrToProps(el) {
        const props = {};
        for (const attr of el.attributes) {
          let name = attr.name.toLowerCase();
          const mapped = ATTR_MAP[name] || name;
          if (/^on[a-z]+$/.test(mapped)) continue;
          if (mapped === "style") {
            props.style = parseStyle(attr.value || "");
            continue;
          }
          if (BOOLEAN_ATTRS.has(name)) {
            props[mapped] = attr.value === "" || attr.value.toLowerCase() === name || attr.value.toLowerCase() === "true";
            continue;
          }
          props[mapped] = attr.value;
        }
        return props;
      }
      function domNodeToReact(node, keyPrefix) {
        switch (node.nodeType) {
          case Node.ELEMENT_NODE: {
            const tag = node.tagName.toLowerCase();
            const props = { ...attrToProps(node), key: keyPrefix };
            const children = [];
            node.childNodes.forEach((child, i) => {
              const reactChild = domNodeToReact(child, `${keyPrefix}.${i}`);
              if (reactChild !== null && reactChild !== "") children.push(reactChild);
            });
            return children.length ? React.createElement(tag, props, ...children) : React.createElement(tag, props);
          }
          case Node.TEXT_NODE: {
            const text = node.nodeValue;
            return text && !/^\s+$/.test(text) ? text : null;
          }
          case Node.DOCUMENT_FRAGMENT_NODE: {
            const kids = [];
            node.childNodes.forEach((child, i) => {
              const k = domNodeToReact(child, `${keyPrefix}.${i}`);
              if (k !== null && k !== "") kids.push(k);
            });
            return kids.length ? kids : null;
          }
          default:
            return null;
        }
      }
      function mountOrUpdate(container, element) {
        let root = roots.get(container);
        if (!root) {
          root = ReactDomClient.hydrateRoot(container, element);
          roots.set(container, root);
        } else {
          root.render(element);
        }
      }
    }
    function FLP_process(id) {
      if (typeof id === "undefined") {
        console.warn("\u{10090} FLP_process called without id.");
        return;
      }
      if (typeof window.$FLP_ !== "undefined" && window.$FLP_[id]) {
        const value = window.$FLP_[id].value;
        const status = window.$FLP_[id].status;
        const resolve = window.$FLP_[id].resolve;
        const reject = window.$FLP_[id].reject;
        const boundaryID = window.$FLP_[id].boundaryID;
        if (status === "resolved") {
          log(`\u{10090} [client] Promise resolved (${id})`, value);
          if (resolve) {
            resolve(value);
          }
          ;
        } else if (status === "rejected") {
          log(`\u{10090} [client] Promise rejected (${id})`, value);
          if (reject) {
            reject(new Error(value));
          }
          ;
        } else {
          console.warn(`\u{10090} [client] Promise with id ${id} is in unknown state: ${status}.`);
          return;
        }
        delete window.$FLP_[id];
        if (renderers[boundaryID]) {
          renderers[boundaryID]();
        }
      } else {
        console.warn(
          `\u{10090} [client] Promise with id ${id} not found in the global scope. The promise is resolved/rejected but the component boundary that needs it is not rendered yet or the promise is already consumed somehow.`
        );
      }
    }
    function FSA_call(id, funcName) {
      return async function(...args) {
        const data = args.length > 0 ? args[0] : {};
        if (typeof FormData !== "undefined" && data instanceof FormData) {
          const fd = new FormData();
          fd.set("__actionId", id);
          for (const [k, v] of data.entries()) fd.append(k, v);
          const result2 = await fetch(FORKET_SERVER_ACTIONS_ENDPOINT + "/" + funcName, {
            method: "POST",
            body: fd
          });
          if (!result2.ok) {
            throw new Error(`Server action ${id} failed with status ${result2.status}`);
          }
          const responseData2 = await result2.json();
          if (responseData2.error) throw new Error(responseData2.error);
          return responseData2.result;
        }
        const result = await fetch(FORKET_SERVER_ACTIONS_ENDPOINT + "/" + funcName, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ __actionId: id, data: args })
        });
        if (!result.ok) {
          throw new Error(`Server action ${id} failed with status ${result.status}`);
        }
        const responseData = await result.json();
        return responseData.result;
      };
    }
    window.FRSC_init = FRSC_init;
    window.FSA_call = FSA_call;
    window.FLP_process = FLP_process;
    FRSC_init();
  })();
})();
