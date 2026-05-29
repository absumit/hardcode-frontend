import Signupnav from "./navpage1";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { registerUser } from "../store/authSlice";
import { Link } from "react-router";
import { useEffect } from "react";
import { clearError } from "../store/authSlice";

const signupSchema = z
  .object({
    UserName: z.string().min(3, "minimum character should be 3"),
    Email: z.string().email("invalid email"),
    password: z
      .string()
      .min(8, "minimum 8 characters required")
      .refine((val) => /[A-Z]/.test(val), "must contain uppercase letter")
      .refine((val) => /[a-z]/.test(val), "must contain lowercase letter")
      .refine((val) => /\d/.test(val), "must contain number")
      .refine(
        (val) => /[!@#$%^&*]/.test(val),
        "must contain special character (!@#$%^&*)",
      ),
    ConfirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.ConfirmPassword, {
    message: "Passwords don't match",
    path: ["ConfirmPassword"],
  });

function Signup() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data));
    if (result.payload) {
      navigate("/login");
    }
  };

  return (
    <>
      <div>
        <Signupnav></Signupnav>
      </div>

      <div className="flex h-screen items-center justify-center">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          {/* <legend className="fieldset-legend">Signup</legend> */}
          <h2 className="card-title justify-center text-3xl">Codehard</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register("UserName", { required: true })}
              placeholder="Username"
              className="input mt-4"
              disabled={loading}
            />
            {errors.UserName && (
              <p className="text-red-600">{errors.UserName.message}</p>
            )}

            <input
              {...register("Email", { required: true })}
              placeholder="Email"
              className="input mt-6"
              disabled={loading}
            />
            {errors.Email && (
              <p className="text-red-600">{errors.Email.message}</p>
            )}

            <input
              {...register("password", { required: true })}
              type="password"
              placeholder="Create Password"
              className="input mt-6"
              disabled={loading}
            />
            {errors.password && (
              <p className="text-red-600">{errors.password.message}</p>
            )}

            <input
              {...register("ConfirmPassword", {
                required: true,
              })}
              type="password"
              placeholder="Confirm Password"
              className="input mt-6"
              disabled={loading}
            />
            {errors.ConfirmPassword && (
              <p className="text-red-600">{errors.ConfirmPassword.message}</p>
            )}

            {/* {error && <p className="text-red-600 mt-4 text-center">{error}</p>} */}

            <button
              type="submit"
              className="btn btn-neutral mt-6 w-full"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            <p className="mt-6">
              Already have an account?{" "}
              <span className="text-red-400 ml-1">
                {" "}
                <Link to={"/login"}>Login</Link>
              </span>
            </p>
          </form>
        </fieldset>
      </div>
    </>
  );
}

export default Signup;
