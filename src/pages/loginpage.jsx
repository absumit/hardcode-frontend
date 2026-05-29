import Loginnav from "./navpage2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { clearError, loginUser } from "../store/authSlice";
import { Link } from "react-router";
import { useEffect } from "react";

const loginSchema = z.object({
  Email: z.string().email("invalid email"),
  password: z.string(),
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const displayError = error && error !== "No token provided";

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const emailRegister = register("Email", { required: true });
  const passwordRegister = register("password", { required: true });

  const clearLoginErrorOnEdit = () => {
    if (displayError) {
      dispatch(clearError());
    }
  };

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result) && result.payload?.success) {
      navigate("/");
    }
  };

  return (
    <>
      <div>
        <Loginnav></Loginnav>
      </div>
      <div className="flex h-screen items-center justify-center">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
    
          <h2 className="card-title justify-center text-3xl">Codehard</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              {...emailRegister}
              onChange={(event) => {
                emailRegister.onChange(event);
                clearLoginErrorOnEdit();
              }}
              placeholder="Email"
              className="input mt-6"
              disabled={loading}
            />
            {errors.Email && (
              <p className="text-red-600">{errors.Email.message}</p>
            )}

            <input
              {...passwordRegister}
              onChange={(event) => {
                passwordRegister.onChange(event);
                clearLoginErrorOnEdit();
              }}
              type="password"
              placeholder="Enter Password"
              className="input mt-6"
              disabled={loading}
            />
            {errors.password && (
              <p className="text-red-600">{errors.password.message}</p>
            )}

            {displayError && (
              <p className="mt-4 rounded-md px-3 py-2 text-center text-sm text-red-600 transition-all duration-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-neutral mt-6 w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="mt-6">
              Don't have an account?{" "}
              <span className="text-red-400 ml-1">
                {" "}
                <Link to={"/signup"}>create one</Link>
              </span>
            </p>
          </form>
        </fieldset>
      </div>
    </>
  );
}

export default Login;
