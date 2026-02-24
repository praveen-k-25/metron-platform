import dropdown_dark from "@/assets/svgs/dropdown-dark.svg";
import dropdown from "@/assets/svgs/dropdown.svg";
import { useAppSelector } from "@/store/hooks";
import {
  Navigation,
  Pause,
  Search,
  ShieldAlert,
  ShieldOff,
} from "lucide-react";
import type { FC } from "react";
import * as React from "react";
import { useState, useEffect } from "react";
import { selectAllVehicles } from "../dashboard.slice";
import { vehicleCardProps, vehicleData } from "../dashboard.types";
import useDebounce from "@/shared/Functions/useBebounce";

interface vehicleCardList {
  vehicle: vehicleData;
  handleSelectedVehicle: (data: vehicleData | null) => void;
  focusedVehicle: vehicleData | null;
}

const handletimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${year}-${month}-${day} ${formattedHours}:${formattedMinutes} ${ampm}`;
};

const VehicleCard: FC<vehicleCardProps> = (props) => {
  const { isOpen, changeOpen, theme, handleSelectedVehicle, focusedVehicle } =
    props;
  const userVehicle = useAppSelector(selectAllVehicles) as vehicleData[];
  const [search, setSearch] = useState<string>("");
  const [filteredVehicles, setFilteredVehicles] =
    useState<vehicleData[]>(userVehicle);

  const handleFilter = useDebounce((searchValue: string) => {
    if (searchValue === "") return setFilteredVehicles(userVehicle);
    const filtered = userVehicle.filter((vehicle) =>
      vehicle.username.toLowerCase().includes(searchValue.toLowerCase()),
    );
    setFilteredVehicles(filtered);
  }, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    handleFilter(search);
  }, [userVehicle, search]);

  return (
    <div
      className={`relative h-full transition-[width] duration-300 ease-in-out ${isOpen ? "mr-0.5 w-72.5 sm:w-[320px]" : "w-0"} flex flex-col justify-center items-center bg-(--button-sec) rounded-md`}
    >
      <button
        className={`rounded-md p-1.75 w-7.5 h-10 bg-(--button) border-(--border) flex justify-center items-center absolute top-2 right-2 transition-all duration-300 ease-in-out ${!isOpen && "translate-x-10.5 -translate-y-1"} z-998 shadow-[0_0_3px_0_#7F7F7F]`}
        type="button"
        onClick={changeOpen}
      >
        <img
          src={theme === "light" ? dropdown : dropdown_dark}
          alt="open vehicle card"
          aria-label="open vehicle card"
          className={`transition-all delay-100 duration-300 ease-in-out w-4 ${isOpen ? "rotate-90" : "-rotate-90"}`}
        />
      </button>
      <div className="w-full h-full flex flex-col justify-start gap-2 p-2 overflow-hidden">
        <div className="mr-8.75 p-0.5 rounded-[10px] bg-linear-to-r from-blue-500 to-pink-600 text-sm bg-(--button)">
          <div className="w-full h-full bg-(--button) rounded-lg flex p-2">
            <label
              htmlFor="vehicle search"
              className="border-r border-[#9f9e9e75] border-opacity-50 pr-1.5 mr-1.5"
            >
              <div className="w-full h-full flex justify-center items-center pb-0.5">
                {theme === "light" ? (
                  <Search color="#0a0a0a" size={19} strokeWidth={1} />
                ) : (
                  <Search color="#fafafa" size={19} strokeWidth={1} />
                )}
              </div>
            </label>
            <input
              id="vehicle search"
              type="search"
              autoComplete="off"
              onChange={handleSearch}
              placeholder="Search for a vehicle"
              className="flex-1 bg-(--button) outline-none border-none text-(--text) placeholder:text-(--text) placeholder:text-sm placeholder:font-light dark:placeholder:font-extralight placeholder:opacity-90"
            />
          </div>
        </div>

        <section className="flex flex-col gap-2">
          {filteredVehicles.map((vehicle: vehicleData) => (
            <VehiclesList
              key={`vehicleList-${vehicle.id}`}
              vehicle={vehicle}
              handleSelectedVehicle={handleSelectedVehicle}
              focusedVehicle={focusedVehicle}
            />
          ))}
        </section>
      </div>
    </div>
  );
};

const VehiclesList: FC<vehicleCardList> = React.memo(
  function vehicleCard(props) {
    const { vehicle, handleSelectedVehicle, focusedVehicle } = props;

    const handleClick = () => {
      if (!focusedVehicle) {
        handleSelectedVehicle(vehicle);
        return;
      }
      if (focusedVehicle.id === vehicle.id) {
        handleSelectedVehicle(null);
        return;
      }
      handleSelectedVehicle(vehicle);
    };

    return (
      <div
        onClick={handleClick}
        className={`min-w-full overflow-hidden flex flex-col gap-2 p-3 rounded-lg text-(--text) text-xs bg-(--button) border-(--border) ${focusedVehicle?.id === vehicle.id ? "shadow-[0_0_4px_0_#515151] dark:shadow-[0_0_4px_0_#EEEEEE]" : "shadow-[0_0_2px_0_#515151] dark:shadow-[0_0_2px_0_#EEEEEE]"}`}
      >
        <section className="w-full flex justify-between items-center whitespace-nowrap">
          <fieldset className="flex gap-5 items-center">
            {vehicle.status === 3 ? (
              <Navigation
                color="#2B60F0"
                fill="#2B60F0"
                size={22}
                strokeWidth={1}
                className="ml-2 -rotate-90"
              />
            ) : vehicle.status === 2 ? (
              <Pause
                color="#EBD700"
                fill="#EBD700"
                size={24}
                strokeWidth={1}
                className="ml-2"
              />
            ) : vehicle.status === 0 ? (
              <ShieldAlert
                color="#E60000"
                fill="#E60000"
                size={28}
                strokeWidth={1}
                className="ml-1"
              />
            ) : (
              <ShieldOff
                color="#5B5B5B"
                fill="#5B5B5B"
                size={28}
                strokeWidth={1}
                className="ml-1"
              />
            )}
            <div className="flex flex-col ">
              <span className="">{vehicle.username}</span>
              <span className="text-[10px]">#{vehicle.id.slice(0, 8)}</span>
            </div>
          </fieldset>
          <p
            className={`p-1 rounded-md text-[10px] text-white flex gap-1.5 items-center px-2 font-semibold tracking-wider ${
              vehicle.status === 3
                ? "shadow-[0_0_2px_0_#9BB4F8] bg-[#001e6f]"
                : vehicle.status === 2
                  ? "shadow-[0_0_2px_0_#EBD700] bg-[#b6a700]"
                  : vehicle.status === 0
                    ? "shadow-[0_0_4px_0_#e6000085] bg-[#cb0000]"
                    : "shadow-[0_0_2px_0_#5B5B5B] bg-[#464646]"
            }`}
          >
            {vehicle.status === 3
              ? "Moving"
              : vehicle.status === 2
                ? "Idle"
                : vehicle.status === 0
                  ? "No Data"
                  : "Inactive"}
          </p>
        </section>
        <section className="text-[10px] flex justify-between items-center whitespace-nowrap">
          <fieldset className="">
            <p className="">Last Update :</p>
            <p className="">{handletimestamp(vehicle.timestamp)}</p>
          </fieldset>
          <div className="flex gap-1">
            <fieldset className="">
              <p className="flex flex-row justify-center items-center gap-1">
                <span className="p-0.75 shadow-[0_0_3px_0_#656565] rounded-full bg-white"></span>{" "}
                Lat
              </p>
              <p className="">{vehicle.lat}</p>
            </fieldset>
            <fieldset className="">
              <p className="flex flex-row justify-center items-center gap-1 ">
                <span className="p-0.75 shadow-[0_0_3px_0_#7F7F7F] rounded-full bg-black"></span>{" "}
                Lng
              </p>
              <p className="">{vehicle.lng}</p>
            </fieldset>
          </div>
        </section>
        <section className="flex flex-row justify-between items-center whitespace-nowrap gap-2 ">
          <fieldset className="w-13.75 flex flex-col items-start justify-start">
            <p className="text-[11px]">Speed :</p>
            <p className="">
              {vehicle.speed} <span className="text-[10px]">km/h</span>{" "}
            </p>
          </fieldset>
          <div className="relative h-full flex-1 p-0.5 bg-transparent overflow-hidden">
            <div
              className={`transition-[width] duration-300 ease-in absolute z-10 inset-0 h-full bg-linear-to-r ${vehicle.status === 3 ? "from-indigo-400 from-10% via-sky-500 via-30% to-emerald-500 to-90%" : vehicle.status === 2 ? "from-gray-100 via-yellow-200 to-yellow-500" : "from-gray-100 via-gray-300 to-gray-600"}`}
              style={{
                width: vehicle.status === 3 ? `${vehicle.speed}%` : "100%",
                WebkitMaskImage: "linear-gradient(#000 0 0)", // fallback mask
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                maskImage: `repeating-linear-gradient(
                              to right,
                              #000 0 3px,
                              transparent 3px 6px
                            )`,
                maskRepeat: "repeat",
                maskSize: "repeat",
                maskPosition: "center",
              }}
            ></div>
            <div
              className="absolute z-0 inset-0 w-full h-full bg-gray-100"
              style={{
                WebkitMaskImage: "linear-gradient(#000 0 0)", // fallback mask
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                maskImage: `repeating-linear-gradient(
                            to right,
                            #000 0 3px,
                            transparent 3px 6px
                          )`,
                maskRepeat: "repeat",
                maskSize: "repeat",
                maskPosition: "center",
              }}
            ></div>
          </div>
        </section>
      </div>
    );
  },
);

export default VehicleCard;
