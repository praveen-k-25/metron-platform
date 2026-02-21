import whiteLoader from "@/assets/gifs/white-spinner.webp";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState, type FC } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
//import Checkbox from "../ui/Checkbox";
import AuthPasswordInput from "@/shared/components/ui/AuthPasswordInput";
import AuthTextInput from "@/shared/components/ui/AuthTextInput";
import { useAppDispatch } from "@/store/hooks";
import { handleForgotPasswordOtp, handleUserLogin } from "../auth.api";
import { setAuth, setLoggedIn, setSliceTheme } from "../auth.slices";
import { loginComponentProps, LoginFormRequest } from "../auth.types";
import { loginSchema } from "../auth.validation";
import ForgotPassword from "./ForgotPassword";

const Login: FC<loginComponentProps> = (props) => {
  const { accessPage } = props;
  const [loading, setLoading] = useState<boolean>(false);
  //const [rememberMe, setRememberMe] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // forgot password
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState<boolean>(false);

  // form Validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    watch,
    setError,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    clearErrors();
  }, [accessPage]);

  const handleForgotPasswordOpen = useCallback(async () => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watch("email"))) {
      clearErrors("email");
      try {
        await toast.promise(
          handleForgotPasswordOtp({ email: watch("email") }),
          {
            loading: "Sending otp...",
            success: <p>OTP sent</p>,
            error: <p>OTP not sent.</p>,
          },
        );
        setForgotPasswordOpen(true);
      } catch (err: any) {
        const { cause, message } = err;
        if (cause === null) return;
        if (cause.includes("email")) {
          setError("email", {
            type: "manual",
            message: message,
          });
        }
      }
    } else {
      setError("email", {
        type: "manual",
        message: "email is required",
      });
    }
  }, [watch("email")]);

  const onSubmit = async (data: LoginFormRequest) => {
    try {
      setLoading(true);
      const response = await handleUserLogin(data);
      toast.success("Logged In");
      dispatch(setLoggedIn(response.data));
      dispatch(setSliceTheme(localStorage?.getItem("metron-theme")));
      navigate("/dashboard", { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      const { cause } = error;
      if (cause === null) return;
      if (cause.includes("password")) {
        setError("password", {
          type: "manual",
          message: "Invalid Password",
        });
      } else if (cause.includes("email")) {
        setError("email", {
          type: "manual",
          message: "Invalid Email",
        });
      }
      dispatch(setAuth(false));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="min-w-75 mt-8 flex flex-col gap-2"
      >
        {/* Username or Email */}
        <AuthTextInput
          label="Email"
          type="text"
          name="email"
          id="login_email"
          autoComplete="email"
          autoFocus={true}
          register={register}
          errors={errors}
          errorMessage={(errors?.email?.message as string) || "invalid email"}
          componentClassName="flex flex-col gap-1"
          labelClassName="font-medium text-sm select-none text-(--text)"
          inputClassName={`outline-none p-3 text-sm border border-[var(--border)] text-(--text) caret-(--text) rounded-lg bg-[var(--button)] transition-shadow duration-100 ${
            errors.email
              ? "border-[var(--destructive)] shadow-[0_0_2px_0_var(--destructive)]"
              : "focus:shadow-[0_0_2px_2px_var(--input)]"
          }`}
          errorClassName={`text-xs ml-1 font-medium text-[var(--destructive)] `}
        />

        {/* Password */}

        <AuthPasswordInput
          label="Password"
          type="password"
          name="password"
          id="login_password"
          passwordView={true}
          register={register}
          errors={errors}
          errorMessage={
            (errors?.password?.message as string) || "invalid password"
          }
          componentClassName="flex flex-col gap-1"
          labelClassName="font-medium text-sm select-none text-(--text)"
          inputWrapperClassName={`flex rounded-lg border border-[var(--border)] overflow-hidden ${
            errors?.password
              ? "border-[var(--destructive)] shadow-[0_0_2px_0_var(--destructive)]"
              : "focus-within:shadow-[0_0_2px_2px_var(--input)]"
          }`}
          inputClassName={`outline-none border-none p-3 text-sm flex-1 text-(--text) caret-(--text) bg-[var(--button)]`}
          visibleIconClassName="p-2 px-4 border-0 flex justify-center items-center bg-[var(--button)]"
          errorClassName={`text-xs ml-1 font-medium text-[var(--destructive)] `}
        />

        {/* Remember Me */}
        <section className="flex justify-end">
          {/* <div className="text-sm flex gap-2">
            <Checkbox
              color="bg-(--primary) border-(--primary)"
              checked={rememberMe}
              onClick={() => {
                setRememberMe(!rememberMe);
              }}
            />
            <input
              id="remember_me"
              onChange={() => {
                setRememberMe(!rememberMe);
              }}
              type="checkbox"
              className="hidden"
            />
            <label
              htmlFor="remember_me"
              className="text-xs font-medium select-none text-(--text)"
            >
              Remember Me
            </label>
          </div> */}
          <p
            onClick={handleForgotPasswordOpen}
            className="text-(--text) capitalize font-medium text-xs text-right cursor-pointer select-none"
          >
            Forgot Password ?
          </p>
        </section>

        {/* Submit Button */}
        <button
          type="submit"
          className={`relative mt-2 text-white flex justify-center text-sm bg-(--primary) px-2 font-medium rounded-lg cursor-pointer select-none ${loading ? "pointer-events-none disabled" : ""}`}
        >
          <img
            src={whiteLoader}
            alt="loading..."
            className={`w-9 ${!loading && "opacity-0"}`}
          />
          <p className={`p-2 ${loading && "opacity-0"} absolute inset-0`}>
            Sign In
          </p>
        </button>
      </form>
      <ForgotPassword
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        resendOtp={handleForgotPasswordOpen}
        email={watch("email")}
      />
    </>
  );
};

export default Login;
