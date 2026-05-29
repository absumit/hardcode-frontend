import { useDispatch, useSelector } from "react-redux";
import { makeproblems } from "../store/createproblem";
import { useState } from "react";
import Adminnavbar from "./adminnav";

const problemJsonTemplate = `{
  "problemid": "01",
  "title": "Count Digit Occurrences",
  "description": "Given a number N (can be negative), count how many times a specific digit D (0-9) appears in its absolute value. Return the count as an integer.",
  "difficulty": "easy",
  "constraints": [
    "-10^9 <= N <= 10^9",
    "0 <= D <= 9"
  ],
  "examples": [
    {
      "input": "123123\\n1",
      "output": "2",
      "explanation": "Digit 1 appears twice in 123123"
    }
  ],
  "hiddentestcases": [
    {
      "input": "0\\n0",
      "output": "1"
    }
  ],
  "refsolution": [
    {
      "language": "python",
      "solution": "def count_digit_occurrences(N, D):\\n    return str(abs(N)).count(str(D))\\n\\nN = int(input())\\nD = int(input())\\nprint(count_digit_occurrences(N, D))"
    }
  ],
  "tags": ["string", "digit", "counting"],
  "category": "Number Theory"
}`;

function Adminpage() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.problemCreator);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [jsonPayload, setJsonPayload] = useState(problemJsonTemplate);

  const submitJsonPayload = async () => {
    try {
      const parsedPayload = JSON.parse(jsonPayload);
      const result = await dispatch(makeproblems(parsedPayload));

      if (makeproblems.fulfilled.match(result)) {
        setAlert({
          show: true,
          type: "success",
          message: "Problem created successfully!",
        });
        setTimeout(() => setAlert({ show: false, type: "", message: "" }), 3000);
        return;
      }

      setAlert({
        show: true,
        type: "error",
        message:
          result.payload?.msg ||
          result.payload?.message ||
          result.payload ||
          "Failed to create problem",
      });
      setTimeout(() => setAlert({ show: false, type: "", message: "" }), 5000);
    } catch {
      setAlert({
        show: true,
        type: "error",
        message: "JSON payload must be valid JSON before publishing",
      });
    }
  };

  return (
    <>
      {alert.show && (
        <div
          className={`alert alert-${alert.type} fixed top-4 right-4 w-96 shadow-lg z-50`}
        >
          <span>{alert.message}</span>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => setAlert({ show: false, type: "", message: "" })}
          >
            x
          </button>
        </div>
      )}

      <div className="min-h-screen bg-base-200 p-4 flex flex-col gap-3">
        <div>
                <Adminnavbar></Adminnavbar>
        </div>
        <div className="mx-auto max-w-6xl rounded-lg border border-base-300 bg-base-100 shadow-md">
          <div className="border-b border-base-300 px-6 py-4">
            <h1 className="text-2xl font-bold text-base-content">
              Admin JSON Publisher
            </h1>
            <p className="mt-1 text-sm text-base-content/70">
              Edit the payload directly and publish it to the backend.
            </p>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[360px_minmax(0,1fr)]">
            <div>
              <h2 className="text-lg font-bold text-base-content">
                Expected Shape
              </h2>
              <p className="mb-4 mt-1 text-sm text-base-content/70">
                The backend expects this exact object structure.
              </p>
              <pre className="h-152 overflow-x-auto whitespace-pre-wrap rounded-lg bg-base-200 p-4 text-xs leading-6 text-base-content">
                {problemJsonTemplate}
              </pre>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-base-content">
                  JSON Payload Editor
                </h2>
                <button
                  type="button"
                  onClick={() => setJsonPayload(problemJsonTemplate)}
                  className="btn btn-xs btn-outline"
                >
                  Reset JSON
                </button>
              </div>

              <div className="alert alert-warning mb-3 text-sm">
                <span>
                  Use stdin format for every test case input. Do not write labeled
                  text like `N = 123, D = 1`.
                </span>
              </div>

              <textarea
                value={jsonPayload}
                onChange={(e) => setJsonPayload(e.target.value)}
                className="textarea textarea-bordered h-136 w-full bg-base-200 font-mono text-xs text-base-content"
                spellCheck={false}
              ></textarea>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={submitJsonPayload}
                  className="btn btn-primary flex-1 text-base-100"
                  disabled={loading}
                >
                  {loading ? "Publishing..." : "Publish JSON"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Adminpage;
