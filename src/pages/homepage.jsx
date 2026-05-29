import Homenav from "./navhome";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getallproblems } from "../store/importdataslice";
import { Link, useOutlet } from "react-router";

function Home() {
  const dispatch = useDispatch();
  const ques = useSelector((state) => state.problems.ques);
  const outlet = useOutlet();
  const [filteredQues, setfilteredQues] = useState(ques);

  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getallproblems());
  }, [dispatch]);

  useEffect(() => {
    setfilteredQues(ques);
  }, [ques]);

  const getsortedques = (diffvalue) => {
    const newques = ques.filter((value) => value.difficulty === diffvalue);
    setfilteredQues(newques);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>
          <span className="loading loading-dots loading-xl"></span>
        </p>
      </div>
    );
  }

  if (outlet) {
    return outlet;
  }

  const getDifficultyBadge = (difficulty) => {
    const diff = difficulty?.toLowerCase();
    if (diff === "easy")
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    if (diff === "medium") return "border-amber-200 bg-amber-50 text-amber-700";
    if (diff === "hard") return "border-rose-200 bg-rose-50 text-rose-700";
    return "border-stone-200 bg-stone-100 text-stone-600";
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <Homenav />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 space-y-4">
            <div className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-base-content/50">
                Categories
              </h2>
              <ul className="menu menu-sm p-0 gap-1">
                <li>
                  <Link className="rounded-xl bg-base-300 font-medium text-base-content">
                    All Problems
                  </Link>
                </li>
                <li>
                  <Link className="rounded-xl text-base-content/70 hover:bg-base-200 hover:text-base-content">
                    Algorithms
                  </Link>
                </li>
                <li>
                  <Link className="rounded-xl text-base-content/70 hover:bg-base-200 hover:text-base-content">
                    Database
                  </Link>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-base-content/50">
                Filter By
              </h2>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => getsortedques("easy")}
                    className="btn btn-sm btn-outline w-full"
                  >
                    Easy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => getsortedques("medium")}
                    className="btn btn-sm btn-outline w-full"
                  >
                    Medium
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => getsortedques("hard")}
                    className="btn btn-sm btn-outline w-full"
                  >
                    Hard
                  </button>
                </li>
              </ul>
            </div>
          </aside>

          <section className="flex-1">
            <div className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
              <div className="p-6 pb-0 flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-base-content">
                  Problem Set
                </h1>
                <div className="text-sm text-base-content/60">
                  {ques.length} problems found
                </div>
              </div>

              <div className="overflow-x-auto p-4">
                <table className="table">
                  <thead>
                    <tr className="border-b border-base-300 text-base-content/60">
                      <th className="font-semibold">#</th>
                      <th className="font-semibold">Title</th>
                      <th className="font-semibold">Difficulty</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-base-content/90">
                    {filteredQues.map((data) => (
                      <tr
                        key={data.problemid}
                        className="border-b border-base-300/60 transition-colors hover:bg-base-200/70"
                      >
                        <td className="font-mono text-sm text-base-content/55">
                          {data.problemid}
                        </td>
                        <td>
                          <Link
                            to={`problems/${data._id}`}
                            className="font-medium text-base-content transition-colors hover:text-teal-300"
                          >
                            {data.title}
                          </Link>
                        </td>
                        <td>
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getDifficultyBadge(data.difficulty)}`}
                          >
                            {data.difficulty}
                          </span>
                        </td>
                        <td className="text-right">
                          <Link
                            to={`problems/${data._id}`}
                            className="inline-flex rounded-xl border border-base-300 px-3 py-1.5 text-xs font-medium text-base-content/80 transition-colors hover:border-teal-700/40 hover:bg-teal-500/10 hover:text-teal-200"
                          >
                            Solve
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Home;
