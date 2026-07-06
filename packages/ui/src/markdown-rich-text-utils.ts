import type { MarkdownEditorAction } from "./markdown-editor-utils";

function focusEditor(root: HTMLElement) {
  root.focus();

  const selection = window.getSelection();
  if (selection && selection.rangeCount === 0) {
    const range = document.createRange();
    range.selectNodeContents(root);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

function wrapSelectionInElement(tagName: string, className?: string) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return;
  }

  const range = selection.getRangeAt(0);
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }

  if (range.collapsed) {
    element.textContent = tagName === "code" ? "code" : "text";
    range.insertNode(element);
    range.selectNodeContents(element);
  } else {
    try {
      range.surroundContents(element);
    } catch {
      const fragment = range.extractContents();
      element.appendChild(fragment);
      range.insertNode(element);
    }
    range.selectNodeContents(element);
  }

  selection.removeAllRanges();
  selection.addRange(range);
}

function insertHtmlAtSelection(root: HTMLElement, html: string) {
  focusEditor(root);

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    root.insertAdjacentHTML("beforeend", html);
    return;
  }

  const range = selection.getRangeAt(0);
  range.deleteContents();

  const template = document.createElement("template");
  template.innerHTML = html;
  const fragment = template.content;
  const lastNode = fragment.lastChild;
  range.insertNode(fragment);

  if (lastNode) {
    range.setStartAfter(lastNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

function insertTable(root: HTMLElement) {
  insertHtmlAtSelection(
    root,
    `<table>
<thead>
<tr><th>Column 1</th><th>Column 2</th><th>Column 3</th></tr>
</thead>
<tbody>
<tr><td>Cell</td><td>Cell</td><td>Cell</td></tr>
</tbody>
</table><p><br></p>`,
  );
}

function insertTaskList(root: HTMLElement) {
  insertHtmlAtSelection(
    root,
    `<ul data-task-list="true">
<li><input type="checkbox" /> Task item</li>
</ul><p><br></p>`,
  );
}

function insertCodeBlock(root: HTMLElement) {
  insertHtmlAtSelection(
    root,
    `<pre><code>code</code></pre><p><br></p>`,
  );

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return;
  }

  const range = selection.getRangeAt(0);
  const pre = root.querySelector("pre:last-of-type code");
  if (!pre) {
    return;
  }

  range.selectNodeContents(pre);
  selection.removeAllRanges();
  selection.addRange(range);
}

function promptForUrl(label: string, fallback = "https://") {
  if (typeof window === "undefined") {
    return null;
  }

  return window.prompt(label, fallback);
}

export function applyRichTextAction(
  root: HTMLElement,
  action: MarkdownEditorAction,
) {
  focusEditor(root);

  switch (action) {
    case "bold":
      document.execCommand("bold");
      break;
    case "italic":
      document.execCommand("italic");
      break;
    case "strikethrough":
      document.execCommand("strikeThrough");
      break;
    case "heading1":
      document.execCommand("formatBlock", false, "h1");
      break;
    case "heading2":
      document.execCommand("formatBlock", false, "h2");
      break;
    case "heading3":
      document.execCommand("formatBlock", false, "h3");
      break;
    case "heading4":
      document.execCommand("formatBlock", false, "h4");
      break;
    case "bulletList":
      document.execCommand("insertUnorderedList");
      break;
    case "orderedList":
      document.execCommand("insertOrderedList");
      break;
    case "taskList":
      insertTaskList(root);
      break;
    case "blockquote":
      document.execCommand("formatBlock", false, "blockquote");
      break;
    case "inlineCode":
      wrapSelectionInElement("code");
      break;
    case "codeBlock":
      insertCodeBlock(root);
      break;
    case "link": {
      const url = promptForUrl("Enter link URL");
      if (url) {
        document.execCommand("createLink", false, url);
      }
      break;
    }
    case "image": {
      const url = promptForUrl("Enter image URL", "https://");
      if (url) {
        document.execCommand("insertImage", false, url);
      }
      break;
    }
    case "table":
      insertTable(root);
      break;
    case "horizontalRule":
      document.execCommand("insertHorizontalRule");
      break;
    default:
      break;
  }
}