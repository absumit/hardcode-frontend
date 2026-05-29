import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/authSlice";

function Homenav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { firstname, role } = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <>
      <div className="navbar border-b border-base-300 bg-base-100 px-4 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost border-none text-base-content/80 hover:bg-base-200 lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content z-1 mt-3 w-52 rounded-xl border border-base-300 bg-base-100 p-2 text-base-content shadow-lg"
            >
              <li>
                <a>Problems</a>
              </li>
              <li>
                <a>Contests</a>
              </li>
            </ul>
          </div>
          <a className="btn btn-ghost border-none text-xl font-semibold tracking-tight text-base-content hover:bg-base-200">
            Hardcode
          </a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1 text-base-content/70">
            <li>
              <a className="rounded-lg hover:bg-base-200 hover:text-base-content">
                Problems
              </a>
            </li>
            <li>
              <a className="rounded-lg hover:bg-base-200 hover:text-base-content">
                Contests
              </a>
            </li>
          </ul>
        </div>
        <div className="flex navbar-end gap-2">
          <div className="dropdown dropdown-end">
            <div tabIndex="0" role="button" class="$$btn m-1">
              <button className="btn rounded-xl border-base-300 bg-base-200 text-base-content shadow-none hover:border-base-content/30 hover:bg-base-300">
                {firstname}
              </button>
            </div>
            <ul
              tabIndex="-1"
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 gap-2 shadow-sm"
            >
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
              <li>{role === "admin" && <Link to="/admin">Admin</Link>}</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Homenav;
