const div = document.createElement("div");
div.id = "gmail-checker-extension";
div.className = "gmail-checker-alert hidden";
document.body.appendChild(div);

let contentIsErr = false;

const observe = (fn: Function) => {
  let observer = new MutationObserver(() => fn());
  observer.observe(document, { childList: true, subtree: true });
};

const strip = (html: string) => {
  let tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const changeAlert = (type, isErr) => {
  switch (type) {
    case "content": {
      if (contentIsErr === isErr) return;
      contentIsErr = isErr;
    }
  }
  const alertBoard = document.getElementById("gmail-checker-extension");
  let message = "";
  if (contentIsErr) {
    message += "・メール内容で1行30文字を超えている部分があります";
  }
  alertBoard.textContent = message;
  if (contentIsErr) {
    alertBoard.className = "gmail-checker-alert";
  } else {
    alertBoard.className = "gmail-checker-alert hidden";
  }
};

observe(() => {
  // check content
  const contents = Array.from(document.getElementsByClassName(
    "editable"
  ) as HTMLCollectionOf<HTMLDivElement>);

  let _contentIsErr = false;
  const checkContent = (content: HTMLDivElement) => {
    const errors = content.innerText.split("\n").filter((text, idx) => {
      text = strip(text);
      if (text.length > 30) {
        _contentIsErr = true;
        return true;
      }
      return false;
    });
    if (errors.length === 0) {
      _contentIsErr = false;
    }
  };
  contents.forEach(content => {
    checkContent(content);
  });

  changeAlert("content", _contentIsErr);
});
