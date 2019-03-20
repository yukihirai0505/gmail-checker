const GmailCheckerEx = {
  observe: fn => {
    let observer = new MutationObserver(() => fn());
    observer.observe(document, { childList: true, subtree: true });
  }
};

GmailCheckerEx.observe(() => {
  // check subject
  const subjectBoxes = Array.from(document.getElementsByName(
    "subjectbox"
  ) as NodeListOf<HTMLInputElement>);
  subjectBoxes.forEach(subjectBox => {
    console.log(subjectBox.value);
    if (!subjectBox.value) {
      console.log("subject is empty");
    }
  });

  // check content
  const contents = Array.from(document.getElementsByName("body") as NodeListOf<
    HTMLInputElement
  >);
  contents.forEach(content => {
    const errors = content.value.split("\n").filter((text, idx) => {
      if (text.length > 30) {
        console.log(idx);
        console.log(text);
        return true;
      }
      return false;
    });
    if (errors.length === 0) {
      console.log("no error");
    }
  });
});
