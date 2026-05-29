import { useParams, Link } from "react-router";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Panel, Group, Separator } from "react-resizable-panels";
import { getallproblems } from "../store/importdataslice";
import {
  fetchSubmissions,
  runCode,
  submitCode,
} from "../store/submissionslice";
import { Send } from "lucide-react";
import { sendAiPrompt, clearAiError } from "../store/aislice";
import AiMarkdown from "./AiMarkdown";

const boilerplates = {
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ code here\n    return 0;\n}`,
  python: `def solve():\n    # Write your Python code here\n    pass\n\nif __name__ == "__main__":\n    solve()`,
  javascript: `function solve() {\n    // Write your JS code here\n}\n\nsolve();`,
  java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your Java code here\n    }\n}`,
};

const languageLabels = {
  cpp: "C++ 17",
  python: "Python 3",
  javascript: "Node.js",
  java: "Java 17",
};

const editorLanguageMap = {
  cpp: "cpp",
  python: "python",
  javascript: "javascript",
  java: "java",
};

function Openeditor() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(boilerplates.cpp);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeSection, setActiveSection] = useState("description");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "ai",
      text: "Share your current idea or paste your code snippet and I will help you improve it.",
    },
  ]);

  const { register, handleSubmit, reset } = useForm();
  const onSubmit = async ({ message }) => {
    const trimmed = message?.trim();
    if (!trimmed) return;

    setChatMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    reset();
    dispatch(clearAiError());

    const result = await dispatch(sendAiPrompt(trimmed));

    if (sendAiPrompt.fulfilled.match(result)) {
      const text = result.payload?.text || "No response.";
      setChatMessages((prev) => [...prev, { role: "ai", text }]);
    } else {
      const messageText =
        result.payload ||
        result.error?.message ||
        "Failed to reach AI service.";
      setChatMessages((prev) => [...prev, { role: "ai", text: messageText }]);
    }
  };

  const { ques = [], loading = false } = useSelector(
    (state) => state.problems || {},
  );
  const {
    submissions,
    submissionsLoading,
    runLoading,
    submitLoading,
    runResult,
    error: submissionError,
  } = useSelector((state) => state.submissions || {});
  const { loading: aiLoading, error: aiError } = useSelector(
    (state) => state.ai || {},
  );

  const problem = Array.isArray(ques)
    ? ques.find((item) => item._id === id)
    : null;

  useEffect(() => {
    if (ques.length === 0) {
      dispatch(getallproblems());
    }
  }, [dispatch, ques.length]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(fetchSubmissions(id));
    }
  }, [dispatch, id]);

  if (loading || !problem || !problem.title) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-base-200 text-base-content">
        <span className="loading loading-spinner loading-lg mb-4 text-teal-700"></span>
        <p className="animate-pulse text-base-content/60">
          Loading problem data...
        </p>
      </div>
    );
  }

  async function handlerun() {
    if (!id) return;

    const result = await dispatch(runCode({ id, code, language }));

    if (runCode.fulfilled.match(result)) {
      setActiveSection("run");
    }
  }

  async function handlesubmit() {
    if (!id) return;

    const result = await dispatch(submitCode({ id, code, language }));

    if (submitCode.fulfilled.match(result)) {
      setActiveSection("submissions");
    }
  }

  const Header = (
    <div className="flex shrink-0 items-center justify-between border-b border-base-300 bg-base-100 px-4 py-3">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-semibold tracking-wide text-base-content/75 transition-colors hover:text-base-content"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          PROBLEMS
        </Link>
        <span className="hidden text-base-content/30 sm:block">|</span>
        <span className="hidden font-mono text-[10px] text-base-content/45 sm:block">
          #{problem.problemid}
        </span>
      </div>
      <div className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
        {problem.difficulty}
      </div>
    </div>
  );

  const ProblemDescription = (
    <div className="space-y-6">
      <div>
        <h1 className="mb-4 text-2xl font-semibold text-base-content">
          {problem.title}
        </h1>
        <p className="whitespace-pre-line leading-relaxed text-base-content/75">
          {problem.description}
        </p>
      </div>

      <div className="space-y-4">
        {problem.examples?.map((ex, i) => (
          <div
            key={i}
            className="rounded-2xl border border-base-300 bg-base-200 p-4 shadow-sm"
          >
            <h4 className="mb-3 text-[10px] font-bold uppercase text-base-content/50">
              Example {i + 1}
            </h4>
            <div className="space-y-2 font-mono text-[12px] text-base-content/85">
              <p>
                <span className="text-base-content/50">Input:</span> {ex.input}
              </p>
              <p>
                <span className="text-base-content/50">Output:</span>{" "}
                {ex.output}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SubmissionSection = (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-base-content">Submissions</h2>
        <p className="mt-1 text-sm text-base-content/70">
          Your latest attempts for this problem.
        </p>
      </div>

      {submissionsLoading ? (
        <div className="rounded-2xl border border-base-300 bg-base-200 p-4 text-sm text-base-content/70">
          Loading submissions...
        </div>
      ) : submissions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-base-300 bg-base-200 p-5 text-sm text-base-content/70">
          No submissions yet. Your attempts will appear here.
        </div>
      ) : (
        <div className="space-y-3">
          {submissions
            .slice()
            .reverse()
            .map((submission) => (
              <div
                key={submission._id}
                className="rounded-2xl border border-base-300 bg-base-200 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold capitalize text-base-content">
                      {submission.status}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-base-content/50">
                      {languageLabels[submission.language] || submission.language}
                    </p>
                  </div>
                  <p className="text-xs text-base-content/50">
                    {new Date(submission.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-base-content/85">
                  <div className="rounded-xl bg-base-300 p-3">
                    Passed: {submission.testCasesPassed}/
                    {submission.testCasesTotal}
                  </div>
                  <div className="rounded-xl bg-base-300 p-3">
                    Runtime: {submission.runtime || 0} ms
                  </div>
                </div>

                {submission.errorMessage ? (
                  <p className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200">
                    {submission.errorMessage}
                  </p>
                ) : null}
              </div>
            ))}
        </div>
      )}
    </div>
  );

  const RunSection = (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-base-content">Run Results</h2>
        <p className="mt-1 text-sm text-base-content/70">
          Output from your latest run against the example test cases.
        </p>
      </div>

      {runLoading ? (
        <div className="rounded-2xl border border-base-300 bg-base-200 p-4 text-sm text-base-content/70">
          Running your code...
        </div>
      ) : !Array.isArray(runResult) || runResult.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-base-300 bg-base-200 p-5 text-sm text-base-content/70">
          No run results yet. Click Run to test your code.
        </div>
      ) : (
        <div className="space-y-3">
          {runResult.map((result, index) => (
            <div
              key={`${result.token || "run"}-${index}`}
              className="rounded-2xl border border-base-300 bg-base-200 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-base-content">
                    Example {index + 1}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-base-content/50">
                    {result.status?.description || "Processed"}
                  </p>
                </div>
                <p className="text-xs text-base-content/50">
                  {result.time || 0} s
                </p>
              </div>

              <div className="mt-3 space-y-3 text-xs text-base-content/85">
                <div className="rounded-xl bg-base-300 p-3">
                  <p className="mb-1 font-semibold text-base-content/60">
                    Input
                  </p>
                  <pre className="whitespace-pre-wrap font-mono">
                    {result.stdin || "No input"}
                  </pre>
                </div>

                <div className="rounded-xl bg-base-300 p-3">
                  <p className="mb-1 font-semibold text-base-content/60">
                    Output
                  </p>
                  <pre className="whitespace-pre-wrap font-mono">
                    {result.stdout ||
                      result.compile_output ||
                      result.stderr ||
                      "No output"}
                  </pre>
                </div>

                {result.expected_output ? (
                  <div className="rounded-xl bg-base-300 p-3">
                    <p className="mb-1 font-semibold text-base-content/60">
                      Expected
                    </p>
                    <pre className="whitespace-pre-wrap font-mono">
                      {result.expected_output}
                    </pre>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ChatAI = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-base-300 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-base-content">
            Chat with AI
          </h2>
          <p className="text-xs text-base-content/60">
            Ask questions about this problem or your approach.
          </p>
        </div>
        <span className="badge badge-outline text-[10px] uppercase tracking-widest">
          Beta
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto py-6">
        {chatMessages.map((msg, index) => (
          <div
            key={`${msg.role}-${index}`}
            className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-header text-[10px] text-base-content/60">
              {msg.role === "user" ? "You" : "AI Assistant"}
            </div>
            <div
              className={`chat-bubble ${
                msg.role === "user"
                  ? "bg-base-content text-base-100"
                  : "bg-base-200 text-base-content"
              }`}
            >
              {msg.role === "user" ? msg.text : <AiMarkdown text={msg.text} />}
            </div>
          </div>
        ))}
        {aiLoading ? (
          <div className="chat chat-start">
            <div className="chat-header text-[10px] text-base-content/60">
              AI Assistant
            </div>
            <div className="chat-bubble bg-base-200 text-base-content">
              Thinking...
            </div>
          </div>
        ) : null}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-t border-base-300 pt-4"
      >
        <div className="flex items-center gap-2">
          <input
            {...register("message")}
            type="text"
            placeholder="Ask a question..."
            className="input input-bordered w-full bg-base-100"
          />
          <button
            type="submit"
            className="btn btn-primary btn-square"
            disabled={aiLoading}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-[11px] text-base-content/50">
          Responses are generated and may be inaccurate. Verify before
          submitting.
        </p>
        {aiError ? (
          <p className="mt-1 text-[11px] text-rose-300">{aiError}</p>
        ) : null}
      </form>
    </div>
  );

  const LeftPanelContent = (
    <div className="flex h-full flex-col bg-base-100">
      <div className="flex flex-col md:flex-row shrink-0 items-stretch md:items-center gap-2 border-b border-base-300 px-4 py-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSection("description")}
          className={`rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
            activeSection === "description"
              ? "bg-base-content text-base-100"
              : "bg-base-200 text-base-content/70 hover:bg-base-300 hover:text-base-content"
          }`}
        >
          Description
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("submissions")}
          className={`rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
            activeSection === "submissions"
              ? "bg-base-content text-base-100"
              : "bg-base-200 text-base-content/70 hover:bg-base-300 hover:text-base-content"
          }`}
        >
          Submissions
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("run")}
          className={`rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
            activeSection === "run"
              ? "bg-base-content text-base-100"
              : "bg-base-200 text-base-content/70 hover:bg-base-300 hover:text-base-content"
          }`}
        >
          Run
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("chatAI")}
          className={`rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
            activeSection === "chatAI"
              ? "bg-base-content text-base-100"
              : "bg-base-200 text-base-content/70 hover:bg-base-300 hover:text-base-content"
          }`}
        >
          AI
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeSection === "description"
          ? ProblemDescription
          : activeSection === "submissions"
            ? SubmissionSection
            : activeSection === "run"
              ? RunSection
              : ChatAI}
      </div>
    </div>
  );

  const CodeEditor = (
    <div className="flex h-full flex-col bg-base-100">
      <div className="flex items-center justify-between border-b border-base-300 bg-base-200 px-4 py-2">
        <select
          className="rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-[12px] font-semibold text-base-content outline-none"
          value={language}
          onChange={(e) => {
            const nextLanguage = e.target.value;
            setLanguage(nextLanguage);
            setCode(boilerplates[nextLanguage]);
          }}
        >
          <option value="cpp">C++ 17</option>
          <option value="python">Python 3</option>
          <option value="javascript">Node.js</option>
          <option value="java">Java 17</option>
        </select>
        <button
          onClick={() => setCode(boilerplates[language])}
          className="text-[11px] font-semibold uppercase tracking-wide text-base-content/65 transition-colors hover:text-base-content"
        >
          Reset
        </button>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          theme="vs-dark"
          language={editorLanguageMap[language] || "plaintext"}
          value={code}
          onChange={(v) => setCode(v)}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true,
          }}
        />
      </div>
      <div className="sticky bottom-0 z-10 flex min-h-16 items-center justify-between border-t border-base-300 bg-base-200 px-4 py-4 shadow-[0_-8px_24px_rgba(0,0,0,0.22)]">
        <div className="max-w-[60%] text-xs text-base-content/70">
          {submissionError ? (
            <p className="line-clamp-2 text-rose-300">{submissionError}</p>
          ) : Array.isArray(runResult) && runResult.length > 0 ? (
            <p>
              Run finished for {runResult.length} example
              {runResult.length > 1 ? "s" : ""}.
            </p>
          ) : (
            <p>Console</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlerun}
            disabled={runLoading || submitLoading}
            className="rounded-lg border border-teal-500/40 px-6 py-2 text-sm font-medium text-teal-200 transition-colors hover:bg-teal-500/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {runLoading ? "Running..." : "Run"}
          </button>
          <button
            onClick={handlesubmit}
            disabled={runLoading || submitLoading}
            className="rounded-lg bg-base-content px-6 py-2 text-sm font-medium text-base-100 transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-base-200 text-base-content">
      {Header}
      <div className="flex-1 overflow-hidden">
        {isMobile ? (
          <div className="h-full overflow-y-auto">
            <div className="min-h-[50vh] border-b border-base-300">
              {LeftPanelContent}
            </div>
            <div className="h-[60vh]">{CodeEditor}</div>
          </div>
        ) : (
          <Group orientation="horizontal" className="h-full">
            <Panel defaultSize="50%" minSize="30%">
              {LeftPanelContent}
            </Panel>
            <Separator className="w-1 cursor-col-resize bg-base-300 transition-colors hover:bg-base-content/30" />
            <Panel defaultSize="50%" minSize="30%">
              {CodeEditor}
            </Panel>
          </Group>
        )}
      </div>
    </div>
  );
}

export default Openeditor;
