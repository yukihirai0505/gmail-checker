const div = document.createElement("div");
div.id = "gmail-checker-extension";
div.className = "gmail-checker-alert hidden";
document.body.appendChild(div);

let subjectIsErr = false;
let contentIsErr = false;

const GmailCheckerEx = {
  observe: fn => {
    let observer = new MutationObserver(() => fn());
    observer.observe(document, { childList: true, subtree: true });
  },
  strip: html => {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
};

const changeAlert = (type, isErr) => {
  switch (type) {
    case "subject": {
      if (subjectIsErr === isErr) return;
      subjectIsErr = isErr;
    }
    case "content": {
      if (contentIsErr === isErr) return;
      contentIsErr = isErr;
    }
  }
  const alertBoard = document.getElementById("gmail-checker-extension");
  let message = "";
  if (subjectIsErr) {
    message = "・件名を入力してください\n";
  }
  if (contentIsErr) {
    message += "・メール内容で1行30文字を超えている部分があります";
  }
  alertBoard.textContent = message;
  if (subjectIsErr || contentIsErr) {
    alertBoard.className = "gmail-checker-alert";
  } else {
    alertBoard.className = "gmail-checker-alert hidden";
  }
};

GmailCheckerEx.observe(() => {
  // check subject
  let _subjectIsErr = false;
  const subjectBoxes = Array.from(document.getElementsByName(
    "subjectbox"
  ) as NodeListOf<HTMLInputElement>);
  subjectBoxes.forEach(subjectBox => {
    if (!subjectBox.value) {
      _subjectIsErr = true;
    }
  });
  changeAlert("subject", _subjectIsErr);

  // check content
  const contents = Array.from(document.getElementsByName("body") as NodeListOf<
    HTMLInputElement
  >);

  let _contentIsErr = false;
  contents.forEach(content => {
    const errors = content.value.split("\n").filter((text, idx) => {
      text = GmailCheckerEx.strip(text);
      if (text.length > 30) {
        _contentIsErr = true;
        console.log(idx);
        console.log(text);
        return true;
      }
      return false;
    });
    if (errors.length === 0) {
      _contentIsErr = false;
    }
  });
  changeAlert("content", _contentIsErr);
});
