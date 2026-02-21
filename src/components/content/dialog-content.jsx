import { createContext, useContext, useState } from "react";

const DialogContentProvider = createContext();

const defaultData = {
  show: false,
  title: "",
  text: "",
  button: [{ text: "Oke" }],
};

function DialogContentPopupProvider({ children, oneLineButton = false }) {
  const [showUpDialogContent, setShowUpDialogContent] = useState(defaultData);

  const callDialogContentProvider = (
    DialogContentOption = { title: "", text: "", button: [{ text: "Oke" }] },
  ) => {
    const filterButton = DialogContentOption?.button?.filter(
      (a) => typeof a.text === "string" && !!a.text,
    ) || [{ text: "Oke" }];
    const buildDialogContent = {
      show: true,
      title: DialogContentOption.title,
      text: DialogContentOption.text,
      button: filterButton.slice(0, 5),
    };
    setShowUpDialogContent(buildDialogContent);
  };

  const callingShow = (btnOption) => {
    if (typeof btnOption.press === "function") {
      btnOption.press(true); // Call Process
    }
    if (typeof btnOption.onClick === "function") {
      btnOption.onClick(true); // Call Process
    }
    // Reset
    setShowUpDialogContent({ ...showUpDialogContent, show: false });
    setTimeout(() => {
      setShowUpDialogContent(defaultData);
    }, 300);
  };

  return (
    <DialogContentProvider.Provider
      value={{
        show: callDialogContentProvider,
      }}
    >
      <div
        className={
          "fixed top-0 left-0 w-full h-screen bg-black/70 z-90 flex justify-center items-center duration-150 px-3.5 py-1.5 " +
          (showUpDialogContent.show
            ? "opacity-100 backdrop-blur-xs"
            : "opacity-0 pointer-events-none")
        }
      >
        <div
          className={
            "bg-white p-0.5 rounded-xl shadow-xl min-w-[290px] max-w-[420px] duration-200 " +
            (showUpDialogContent.show ? "scale-100 mb-0" : "scale-90 mb-5")
          }
        >
          <div className="p-5 pb-1">
            <h1 className="font-semibold text-xl mb-2.5">
              {String(showUpDialogContent.title)?.trim()?.replace(/\n/g, "")}
            </h1>
            <div className="text-[15px] text-wrap">
              {typeof showUpDialogContent.text === "text" ? (
                <p className="text-wrap text-[15px] whitespace-pre-line">
                  {String(showUpDialogContent.text)?.trim()}
                </p>
              ) : (
                showUpDialogContent.text
              )}
            </div>
          </div>
          <div
            className={"w-full flex flex-wrap justify-end py-2.5 px-2 text-sm"}
          >
            {showUpDialogContent.button.map((btn, i) => (
              <button
                className={
                  "cursor-pointer text-blue-600 hover:bg-blue-300/40 p-1.5 px-4 rounded-md duration-300 text-[0.98rem] ml-1" +
                  (btn.isDanger ? " hover:bg-red-600/10 text-red-500" : "") +
                  (btn.isRecommend ? " font-semibold" : "") +
                  (oneLineButton ? " w-full block mt-0.5 py-2.5" : "")
                }
                onClick={() => {
                  callingShow(btn);
                }}
                key={i}
              >
                {btn.text}
              </button>
            ))}
          </div>
        </div>
      </div>
      {children}
    </DialogContentProvider.Provider>
  );
}

function useDialogContent() {
  const context = useContext(DialogContentProvider);
  return context;
}

export { DialogContentPopupProvider, useDialogContent };
