import { useState, useMemo, useEffect, useRef } from "react";
import { App } from "../App";
import { useChat } from "../hooks/use-chat";
import { ChatMessage } from "../components/ChatMessage";
import { appConfig } from "../../config.browser";
import { Welcome } from "../components/Welcome";

export default function Index() {
  // The content of the box where the user is typing
  const [message, setMessage] = useState<string>("");

  // This hook is responsible for managing the chat and communicating with the
  // backend
  const { currentChat, chatHistory, sendMessage, cancel, state, clear } =
    useChat();

  // This is the message that is currently being generated by the AI
  const currentMessage = useMemo(() => {
    return { content: currentChat ?? "", role: "assistant" } as const;
  }, [currentChat]);

  // This is a ref to the bottom of the chat history. We use it to scroll
  // to the bottom when a new message is added.
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat, chatHistory, state]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // This is a ref to the input box. We use it to focus the input box when the
  // user clicks on the "Send" button.
  const inputRef = useRef<HTMLInputElement>(null);
  const focusInput = () => {
  inputRef.current?.focus();
 };

   useEffect(() => {
   focusInput();
  }, [state]);

  return (
    <App title="Satoshi AI">
      <main className="bg-slate-200 md:rounded-lg md:shadow-md p-6 w-full h-full flex flex-col">
        <section className="overflow-y-auto flex-grow mb-4 pb-8">
          <div className="flex flex-col space-y-4">
            {chatHistory.length === 0 ? (
              <>
                <Welcome />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {appConfig.samplePhrases.map((phrase) => (
                    <button
                      key={phrase}
                      onClick={() => sendMessage(phrase, chatHistory)}
                      className="bg-gray-200 border-gray-700 border-2 rounded-lg p-4"
                    >
                      {phrase}
                    </button>
                  ))}
            </div>
              </>
            ) : (
              chatHistory.map((chat, i) => (
                <ChatMessage key={i} message={chat} />
              ))
            )}

            {currentChat ? <ChatMessage message={currentMessage} /> : null}
          </div>

          <div ref={bottomRef} />
        </section>
        <div className="flex items-center justify-center h-20">
          {state === "idle" ? null : (
            <button
              className="bg-gray-100 text-gray-900 py-2 px-4 my-8"
              onClick={cancel}
            >
              Stop generating
            </button>
          )}
        </div>
        <section className="bg-gray-200 rounded-lg p-2">
          <form
            className="flex"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(message, chatHistory);
              setMessage("");
            }}
          >
            {chatHistory.length > 1 ? (
              <button
                className="bg-red-300 text-white py-2 px-4 rounded-l-lg"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  clear();
                  setMessage("");
                }}
              >
                Reset
              </button>
            ) : null}
            <input
              type="text"
              ref={inputRef}
              className="w-full rounded-l-lg p-2 text-slate-600 outline-none"
              placeholder={state == "idle" ? "Ask a question..." : "..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={state !== "idle"}
            />
            {state === "idle" ? (
              <button
                className="bg-green-400 text-white font-bold py-2 px-4 rounded-r-lg"
                type="submit"
              >
                Enter
              </button>
            ) : null}
          </form>
           </section>

              <div className="flex justify-center">
                  <p className="text-sm text-gray-500 mt-5">
                    ©2023 Satoshi AI.
                  </p>
                </div>
      </main>
    </App>
  );
}
