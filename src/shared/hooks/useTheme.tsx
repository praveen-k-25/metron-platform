import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setSliceTheme } from "@/modules/auth/auth.slices";

const useTheme = (): [
  "light" | "dark",
  React.Dispatch<React.SetStateAction<"light" | "dark">>,
] => {
  const [theme, setTheme] = useState<"light" | "dark">(
    localStorage.getItem("metron-theme") === "dark" ? "dark" : "light",
  );
  const dispatch = useAppDispatch();

  // indicates the root element which is html tag
  const element = document.documentElement;
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const onWindowMatch = () => {
    if (
      localStorage.getItem("metron-theme") === "dark" ||
      (!("metron-theme" in localStorage) && darkQuery.matches)
    ) {
      element.classList.add("dark");
    } else {
      element.classList.remove("dark");
    }
  };

  useEffect(() => {
    onWindowMatch();
  }, []);

  useEffect(() => {
    switch (theme) {
      case "dark": {
        element.classList.add("dark");
        localStorage.setItem("metron-theme", "dark");
        break;
      }
      default: {
        element.classList.remove("dark");
        localStorage.setItem("metron-theme", "light");
        break;
      }
    }
  }, [theme]);

  useEffect(() => {
    const changeHandler = (e: MediaQueryListEvent) => {
      if (!("metron-theme" in localStorage)) {
        if (e.matches) {
          element.classList.add("dark");
        } else {
          element.classList.remove("dark");
        }
      }
    };

    darkQuery.addEventListener("change", changeHandler);
    return () => darkQuery.removeEventListener("change", changeHandler);
  }, []);

  useEffect(() => {
    dispatch(setSliceTheme(theme));
  }, [theme]);

  return [theme, setTheme];
};

export default useTheme;
