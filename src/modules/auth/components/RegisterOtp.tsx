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
import { RegisterOtpProps } from "../auth.types";
import { handleRegisterOtp, handleUserRegister } from "../auth.api";

const RegisterOtp: FC<RegisterOtpProps> = (props) => {
  const { email, onClose, isOpen, userInfo, setAccessPage, reset } = props;
  const inputRef = useRef<Array<HTMLInputElement | null>>([]);
  const [resend, setResend] = useState(true);
  const [seconds, setSeconds] = useState(30);
  const [otp, setOtp] = useState<string[]>(Array(4).fill(""));
  const [loading, setLoading] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<{ message: string; error: boolean }>(
    { message: "", error: false },
  );

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
    setOtp(Array(4).fill(""));
  };

  const onSubmit = async () => {
    if (otp.length !== 4) {
      setOtpError({ message: "Invalid OTP", error: true });
      return;
    }
    try {
      setLoading(true);
      await handleUserRegister({ ...userInfo, otp: otp.join("") });
      toast.success("Registration Completed");
      reset();
      handleClose();
      setAccessPage("SignUp");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      setOtpError({ message: "Invalid OTP", error: true });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setOtpError({ message: "", error: false });
      await toast.promise(handleRegisterOtp({ email: userInfo?.email }), {
        loading: "Sending OTP",
        success: "OTP sent",
        error: "Failed to send OTP",
      });
    } catch (error) {
      toast.error("OTP not sent");
    }
  };

  return (
    <div
      className={`fixed md:left-[50%] inset-0 backdrop-blur-sm flex flex-col justify-center items-center text-(--text) p-3 ${isOpen ? " z-10" : "-z-20"}`}
    >
      <div
        className={`w-92.5 p-4 rounded-md bg-(--background) border border-(--border) transition-all ease-in-out duration-300 ${isOpen ? " translate-0 opacity-100" : "translate-y-2 opacity-0"} flex flex-col gap-4`}
      >
        <span className=" font-semibold text-2xl">Verify OTP</span>
        <div className="font-light flex flex-col gap-1">
          <p className="text-sm ">
            We sent an OTP to{" "}
            <span className="font-semibold text-(--sub-text)">
              {email}
            </span>{" "}
          </p>
          <p className="text-sm">Enter it below to continue.</p>
        </div>
        <section className="flex flex-col gap-1 font-light">
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
                className={`rounded-md border border-(--border) bg-(--primary-background) text-center text-(--text) w-10 h-10 ${otpError.error && "border-(--destructive)"}`}
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
        <div className="font-light text-sm my-1">
          <p className="flex justify-between gap-2">
            Resend available{" "}
            {!resend &&
              `in 00:${seconds < 10 ? `0${seconds}` : seconds} seconds`}
            <span
              onClick={() => {
                if (resend) {
                  startCountdown();
                  handleResend();
                }
              }}
              className={`${resend ? "text-(--primary)" : "text-(--sub-primary)"} font-semibold tracking-wide cursor-pointer whitespace-nowrap`}
            >
              Resend OTP
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={onSubmit}
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
          onClick={handleClose}
          className="text-(--text) text-sm text-center cursor-default"
        >
          Back to Register
        </div>
      </div>
    </div>
  );
};

export default RegisterOtp;
