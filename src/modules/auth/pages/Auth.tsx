import loginBackgruoundImage from "@/assets/images/birds-eye-2.webp";
import companyLogoDark from "@/assets/svgs/logo-dark.svg";
import companyLogo from "@/assets/svgs/logo.svg";
import useTheme from "@/shared/hooks/useTheme";
import { useAppDispatch } from "@/store/hooks";
import { useCallback, useEffect, useState } from "react";
import { setSliceTheme } from "../auth.slices";
import Login from "../components/Login";
import Register from "../components/Register";

const Auth = () => {
  const dispatch = useAppDispatch();
  const [accessPage, setAccessPage] = useState("SignUp");
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    dispatch(setSliceTheme(localStorage.getItem("metron-theme") || "light"));
  }, []);

  const handleTheme = useCallback(() => {
    theme === "dark" ? setTheme("light") : setTheme("dark");
  }, [theme, setTheme]);

  return (
    <div className="relative w-dvw h-dvh md:w-screen md:h-screen">
      <img
        src={loginBackgruoundImage}
        alt="Metron Login Image"
        className="w-full h-full overflow-x-hidden"
      />
      <div className="absolute inset-0 bg-transparent grid md:grid-cols-2">
        <section className="hidden md:block w-full h-full">
          <div className="w-full h-full flex flex-col justify-between items-start text-white px-5 py-10">
            <article className="w-full flex justify-end items-center gap-3">
              <div className="w-75 h-0 mt-1 border-b border-white"></div>
              <p className="font-semibold italic text-[18px] lg:text-[21px] ">
                {/* Revolutionize */} Fleet Inteligence
              </p>
            </article>
            <article className="flex flex-col gap-4">
              <h1 className="text-5xl font-serif">
                Get <br />
                Smarter <br />
                Fleet Insights
              </h1>

              <p className="text-sm max-w-100">
                You can optimize every vehicle if you monitor deeply, trust the
                data, and act at the right time.
              </p>
            </article>
          </div>
        </section>
        <section className={`overflow-auto bg-white`}>
          <div
            className={`relative overflow-x-hidden w-full h-full bg-(--background)`}
          >
            {/* Sign In or Login */}
            <section
              className={`bg-transparent flex flex-col justify-between items-center w-full h-full absolute inset-0 transition-all ${
                accessPage === "SignIn"
                  ? " opacity-0 duration-500 -translate-x-full"
                  : " opacity-100 duration-600 z-10 "
              }`}
            >
              <article className="w-full flex gap-2 justify-center items-center p-3 select-none">
                <>
                  {theme === "light" ? (
                    <img
                      onClick={handleTheme}
                      src={companyLogo}
                      alt=""
                      className={`w-7`}
                    />
                  ) : (
                    <img
                      onClick={handleTheme}
                      src={companyLogoDark}
                      alt=""
                      className={`w-7`}
                    />
                  )}
                </>

                <span className="font-semibold text-lg text-(--text)">
                  Metron
                </span>
              </article>
              <article className="flex-1 flex flex-col justify-center items-center gap-2 m-2">
                <div className="bg-(--primary-background) px-5 py-6 rounded-(--radius) shadow-[0_0_4px_0_#818181] border border-(--border) flex flex-col justify-center gap-2">
                  <h2 className="text-2xl text-center select-none text-(--text)">
                    Welcome
                  </h2>
                  <p className="text-sm text-center text-(--sub-text) mx-3 select-none ">
                    Enter your email and password to access your account
                  </p>
                  <Login accessPage={accessPage} />
                </div>
              </article>
              <article className="text-(--sub-text) font-medium text-sm text-center p-4 select-none">
                Dont't have an account?{" "}
                <span
                  onClick={() => setAccessPage("SignIn")}
                  className="text-(--text) font-semibold underline cursor-pointer"
                >
                  Sign Up
                </span>
              </article>
            </section>
            {/* Sign Up or Register */}
            <section
              className={`bg-transparent flex flex-col w-full h-full absolute inset-0 transition-all ${
                accessPage === "SignUp"
                  ? "opacity-0 duration-500 translate-x-full"
                  : "opacity-100 duration-600 z-10"
              }`}
            >
              <section className="bg-transparent flex flex-col w-full h-full px-3 relative">
                <article className="w-full flex gap-2 justify-center items-center p-3 select-none">
                  <>
                    {theme === "light" ? (
                      <img
                        onClick={handleTheme}
                        src={companyLogo}
                        alt=""
                        className={`w-7`}
                      />
                    ) : (
                      <img
                        onClick={handleTheme}
                        src={companyLogoDark}
                        alt=""
                        className={`w-7`}
                      />
                    )}
                  </>
                  <span className="font-semibold text-lg text-(--text)">
                    Metron
                  </span>
                </article>
                <article className="flex-1 flex flex-col justify-center items-center gap-2 px-1 m-2">
                  <div className="bg-(--primary-background) px-5 py-6 rounded-(--radius) border border-(--border) flex flex-col justify-center gap-2 w-full sm:w-auto">
                    <h2 className="text-2xl text-(--text) text-center">
                      Create an account
                    </h2>
                    <Register
                      accessPage={accessPage}
                      setAccessPage={setAccessPage}
                    />
                  </div>
                </article>
                <article className="text-(--sub-text) font-medium text-sm text-center p-4">
                  Back to{" "}
                  <span
                    onClick={() => setAccessPage("SignUp")}
                    className="text-(--text) font-semibold underline cursor-pointer"
                  >
                    Sign In
                  </span>
                </article>
              </section>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Auth;
