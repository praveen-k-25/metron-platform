import { type FC, useEffect, useState } from "react";
import { registerComponentProps, registerRequestForm } from "../auth.types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import AuthTextInput from "@/shared/components/ui/AuthTextInput";
import AuthPasswordInput from "@/shared/components/ui/AuthPasswordInput";
import whiteLoader from "@/assets/gifs/white-spinner.webp";
import { registerSchema } from "../auth.validation";
import RegisterOtp from "./RegisterOtp";
import { handleRegisterOtp } from "../auth.api";

const Register: FC<registerComponentProps> = (props) => {
  const { accessPage, setAccessPage } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(registerSchema),
  });
  const [userInfo, setUserInfo] = useState<registerRequestForm>();
  // OTP page

  const [otpPageOpen, setOtpPageOpen] = useState<boolean>(false);

  useEffect(() => {
    clearErrors();
  }, [accessPage]);

  const onSubmit = async (data: any) => {
    setUserInfo(data);
    try {
      setLoading(true);
      await toast.promise(handleRegisterOtp({ email: data?.email }), {
        loading: "Sending OTP",
        success: "OTP sent",
        error: "Failed to send OTP",
      });

      setOtpPageOpen(true);
    } catch (error: any) {
      const { cause } = error;
      if (cause === null) return;
      if (cause.includes("email")) {
        toast.error("Email already exist");
        setError("email", {
          message: "email already exist",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="min-w-75 mt-8 flex flex-col gap-1"
      >
        {/* Username */}
        <AuthTextInput
          label="Username"
          type="text"
          name="username"
          autoComplete="off"
          id="register_user"
          register={register}
          errors={errors}
          errorMessage={
            (errors?.username?.message as string) || "username is required"
          }
          componentClassName="flex flex-col gap-1"
          labelClassName="font-medium text-sm select-none text-[var(--text)]"
          inputClassName={`outline-none p-3 text-sm border border-[var(--border)] text-[var(--text)] caret-[var(--text)] bg-[var(--button)] rounded-lg ${
            errors.username
              ? "border-[var(--destructive)] shadow-[0_0_2px_0_var(--destructive)]"
              : "focus:shadow-[0_0_2px_2px_var(--input)]"
          }`}
          errorClassName={`text-xs ml-1 font-medium text-[var(--destructive)] `}
        />
        {/* Email */}
        <AuthTextInput
          label="Email"
          type="text"
          name="email"
          id="register_email"
          autoComplete="off"
          register={register}
          errors={errors}
          errorMessage={
            (errors?.email?.message as string) || "email is required"
          }
          componentClassName="flex flex-col gap-1"
          labelClassName="font-medium text-sm select-none text-[var(--text)]"
          inputClassName={`outline-none p-3 text-sm border border-[var(--border)] text-[var(--text)]  caret-[var(--text)] rounded-lg bg-[var(--button)] transition-shadow duration-100 ${
            errors.email
              ? "border-[var(--destructive)] shadow-[0_0_2px_0_var(--destructive)]"
              : "focus:shadow-[0_0_2px_2px_var(--input)]"
          }`}
          errorClassName={`text-xs ml-1 font-medium text-[var(--destructive)] `}
        />

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Password */}
          <AuthPasswordInput
            label="Password"
            type="password"
            name="password"
            id="register_password"
            passwordView={false}
            register={register}
            errors={errors}
            errorMessage={
              (errors?.password?.message as string) || "password is reaquired"
            }
            componentClassName="flex flex-col gap-1"
            labelClassName="font-medium text-sm select-none text-[var(--text)]"
            inputWrapperClassName={`flex rounded-lg border border-[var(--border)] overflow-hidden ${
              errors?.password
                ? "border-[var(--destructive)] shadow-[0_0_2px_0_var(--destructive)]"
                : "focus-within:shadow-[0_0_2px_2px_var(--input)]"
            }`}
            inputClassName={`outline-none border-none p-3 text-sm flex-1 text-[var(--text)] caret-[var(--text)] bg-[var(--button)]`}
            visibleIconClassName="p-2 px-4 border-0 flex justify-center items-center bg-[var(--button)]"
            errorClassName={`text-xs ml-1 font-medium text-[var(--destructive)] `}
          />

          {/*Confirm Password */}
          <AuthPasswordInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            id="register_confirm_password"
            passwordView={true}
            register={register}
            errors={errors}
            errorMessage={
              (errors?.confirmPassword?.message as string) ||
              "password is required"
            }
            componentClassName="flex flex-col gap-1"
            labelClassName="font-medium text-sm select-none text-[var(--text)]"
            inputWrapperClassName={`flex rounded-lg border border-[var(--border)] overflow-hidden ${
              errors?.password
                ? "border-[var(--destructive)] shadow-[0_0_2px_0_var(--destructive)]"
                : "focus-within:shadow-[0_0_2px_2px_var(--input)]"
            }`}
            inputClassName={`outline-none border-none p-3 text-sm flex-1 text-[var(--text)] caret-[var(--text)] bg-[var(--button)]`}
            visibleIconClassName="p-2 px-4 border-0 flex justify-center items-center bg-[var(--button)]"
            errorClassName={`text-xs ml-1 font-medium text-[var(--destructive)] `}
          />
        </section>

        {/* Submit Button */}
        <button
          type="submit"
          className=" mt-2 text-white text-sm font-medium flex justify-center bg-(--primary) p-0.5 rounded-lg cursor-pointer select-none"
        >
          {loading ? (
            <img
              src={whiteLoader}
              alt="loading..."
              className={`w-9 ${!loading && "opacity-0"}`}
            />
          ) : (
            <span className="p-2">Sign Up</span>
          )}
        </button>
      </form>
      {/* Otp section */}
      {userInfo?.email && (
        <RegisterOtp
          isOpen={otpPageOpen}
          email={userInfo.email}
          onClose={() => setOtpPageOpen(false)}
          userInfo={userInfo}
          setAccessPage={setAccessPage}
          reset={reset}
        />
      )}
    </>
  );
};

export default Register;
