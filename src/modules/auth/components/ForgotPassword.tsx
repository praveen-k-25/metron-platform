import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
} from "react";
import toast from "react-hot-toast";
import whiteLoader from "@/assets/gifs/white-spinner.webp";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordComponentProps } from "../auth.types";
import AuthPasswordInput from "@/shared/components/ui/AuthPasswordInput";
import { forgotPasswordSchema } from "../auth.validation";
import { handleResetPassword } from "../auth.api";

const ForgotPassword: FC<forgotPasswordComponentProps> = (props) => {
  const { onClose, isOpen, email, resendOtp } = props;
  const inputRef = useRef<Array<HTMLInputElement | null>>([]);
  const [resend, setResend] = useState(true);
  const [seconds, setSeconds] = useState(30);
  const [otp, setOtp] = useState<string[]>(Array(4).fill(""));
  const [loading, setLoading] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<{ message: string; error: boolean }>(
    { message: "", error: false },
  );
  const {
    formState: { errors },
    register,
    reset,
    handleSubmit,
  } = useForm({
    mode: "all",
    resolver: yupResolver(forgotPasswordSchema),
  });

  useEffect(() => {
    inputRef.current[0]?.focus();
  }, [isOpen]);

  useEffect(() => {
    setOtpError({ message: "", error: false });
  }, [otp]);

  const startCountdown = () => {
    setResend(false); // disable resend while counting down

    const intervalId = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId); // stop countdown
          setResend(true); // enable resend
          return 30; // reset
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleInputChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // allow only numbers (0–9)

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRef.current.length - 1) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous input if current is already empty
        inputRef.current[index - 1]?.focus();
      }
    }
  };

  const handleClose = () => {
    onClose();
    reset();
    setOtp(Array(4).fill(""));
  };

  const onForgotPasswordSubmit = async (data: any) => {
    if (otp.some((item: string) => item === "")) {
      setOtpError({ message: "Invalid OTP", error: true });
      return;
    }
    try {
      setLoading(true);
      await handleResetPassword({
        email: email,
        otp: parseInt(otp.join("")),
        newPassword: data.newPassword,
      });
      toast.success("New Password Updated");
      handleClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      setOtpError({ message: "Invalid OTP", error: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed md:left-[50%] inset-0 backdrop-blur-sm flex flex-col justify-center items-center text-(--text) p-3 ${isOpen ? " z-10" : "-z-20"}`}
    >
      <form
        onSubmit={handleSubmit(onForgotPasswordSubmit)}
        className={`w-92.5 p-4 rounded-md bg-(--background) border border-(--border) transition-all ease-in-out duration-300 ${isOpen ? " translate-0 opacity-100" : "translate-y-2 opacity-0"} flex flex-col gap-4`}
      >
        <span id="FP-verify-otp" className=" font-semibold text-2xl">
          Verify OTP
        </span>
        <div id="FP-sent-otp" className="font-light flex flex-col gap-1">
          <p className="text-sm ">
            We sent an OTP to{" "}
            <span className="font-semibold text-(--sub-text)">
              {email}
            </span>{" "}
          </p>
          <p className="text-sm">Enter it below to continue.</p>
        </div>
        <section id="FP-input-otp" className="flex flex-col gap-1 font-light">
          <section className="flex justify-around items-center gap-3">
            {Array.from({ length: 4 }, (_, index) => (
              <input
                ref={(el: HTMLInputElement | null) => {
                  inputRef.current[index] = el;
                }}
                key={`otp-${index}`}
                type="text"
                maxLength={1}
                value={otp[index]}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(e.target.value, index)
                }
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                  handleKeyDown(e, index)
                }
                className={`rounded-md outline-0 border border-(--border) bg-(--primary-background) text-center text-(--text) w-10 h-10 ${otpError.error && "border-(--destructive)"}`}
              />
            ))}
          </section>
          {
            // show error message
            otpError.error && (
              <span className="text-(--destructive) text-xs ml-3">
                {otpError.message}
              </span>
            )
          }
        </section>
        <div id="FP-resend-otp" className="font-light text-sm my-1">
          <p className="flex justify-between gap-2">
            Resend available{" "}
            {!resend &&
              `in 00:${seconds < 10 ? `0${seconds}` : seconds} seconds`}
            <button
              disabled={!resend}
              onClick={() => {
                if (resend) {
                  startCountdown();
                  resendOtp();
                }
              }}
              className={`${resend ? "text-(--primary)" : "text-(--sub-primary)"} font-semibold tracking-wide cursor-pointer whitespace-nowrap`}
            >
              Resend OTP
            </button>
          </p>
        </div>
        <AuthPasswordInput
          label="New Password"
          type="password"
          name="newPassword"
          id="newPassword"
          passwordView={true}
          register={register}
          errors={errors}
          errorMessage={
            (errors?.newPassword?.message as string) || "new password required"
          }
          componentClassName="flex flex-col gap-1"
          labelClassName="font-medium text-sm select-none text-(--text)"
          inputWrapperClassName={`flex rounded-lg border border-[var(--border)] overflow-hidden ${
            errors?.newPassword
              ? "border-[var(--destructive)] shadow-[0_0_2px_0_var(--destructive)]"
              : "focus-within:shadow-[0_0_2px_2px_var(--input)]"
          }`}
          inputClassName={`outline-none border-none p-3 text-sm flex-1 text-(--text) caret-[var(--text)] bg-[var(--button)]`}
          visibleIconClassName="p-2 px-4 border-0 flex justify-center items-center bg-[var(--button)]"
          errorClassName={`text-xs ml-1 font-medium text-[var(--destructive)] `}
        />

        <button
          id="FP-submit-otp"
          type="submit"
          className="bg-(--primary) rounded-md cursor-pointer flex justify-center items-center"
        >
          {loading ? (
            <img
              src={whiteLoader}
              alt="loading..."
              className={`w-9 my-0.5 ${!loading && "opacity-0"}`}
            />
          ) : (
            <p className=" text-white my-2">verify</p>
          )}
        </button>
        <div
          id="FP-back-to-login"
          onClick={handleClose}
          className="text-(--text) text-sm text-center cursor-default"
        >
          Back to Login
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
