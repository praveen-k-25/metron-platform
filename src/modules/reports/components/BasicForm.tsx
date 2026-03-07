import { CalendarDays, ChevronDown, Search, X } from "lucide-react";
import { FC, useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import { Controller } from "react-hook-form";
import Select from "react-select";
import { getVehicleList } from "../reports.api";
import { BasicFormProps, vehicle } from "../reports.types";

const dropdown = () => <ChevronDown className="mr-2" size={20} />;

const inputSelectStyle = {
  control: (base: any) => ({
    ...base,
    border: "none",
    boxShadow: "none",
    backgroundColor: "transparent",
    color: "var(--text)",
    "&:hover": {
      border: "none",
    },
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "var(--text)",
  }),
  input: (base: any) => ({
    ...base,
    color: "var(--text)",
  }),
  menu: (base: any) => ({
    ...base,
    overflow: "hidden",
  }),
  menuList: (base: any) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: "var(--option-bg)",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "var(--option-selected)"
      : state.isFocused
        ? "var(--option-hover)"
        : "var(--option-bg)",
    color: state.isSelected ? "white" : "var(--option-text)",
    cursor: "pointer",
    ":active": {
      backgroundColor: state.isSelected
        ? "var(--option-selected)"
        : "var(--option-hover)",
    },
  }),
};

const BasicForm: FC<BasicFormProps> = (formProp) => {
  const {
    handleFormSubmit,
    activeMobileForm,
    handleMobileFormActiveState,
    reportForm,
  } = formProp;
  const [vehicleList, setVehicleList] = useState<vehicle[]>([]);
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = reportForm;

  useEffect(() => {
    handleVehicleList();
  }, []);

  const handleVehicleList = async () => {
    try {
      const response = await getVehicleList();
      setVehicleList(response.data);
      setValue("vehicle", response.data[0]);
    } catch (error: any) {
      const { cause } = error;
      if (cause === null) return;
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`absolute min-w-75 top-0 bottom-0 right-0 text-(--report-text) bg-(--report-bg) flex flex-col gap-5 pt-3 p-3 transition-all duration-300 ease-in-out z-10 ${activeMobileForm ? "translate-x-0" : "translate-x-full sm:translate-x-0"} sm:w-full sm:relative sm:grid sm:grid-cols-4 sm:gap-5 sm:p-5 shadow-[0_0_3px_0_var(--report-shadow)] sm:bg-transparent sm:rounded-2xl`}
    >
      <div className="sm:hidden w-full flex justify-end items-center">
        <X
          size={30}
          onClick={handleMobileFormActiveState}
          className="p-1 rounded-lg text-(--report-text) bg-(--report-sec-bg) hover:bg-(--report-hover) cursor-pointer"
        />
      </div>
      {/* <fieldset className="col-span-1 relative">
        <input
          {...register("name")}
          placeholder="John Doe"
          className={`w-full h-full border rounded-md py-2 px-3 text-sm outline-none font-normal ${errors.name ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0px_1px_#f63b3b89] bg-red-200" : "focus:border-blue-500 focus:shadow-[0_0_0px_1px_#3b83f689]"}`}
        />
        <label
          className={`absolute left-3 text-xs px-1 font-semibold transition-all duration-200 ${errors.name ? "-top-4 bg-transparent text-red-600" : "-top-2 bg-white text-gray-600"}`}
        >
          Name
        </label>
      </fieldset> */}
      <fieldset
        className={`relative text-(--report-text) border border-(--report-border) rounded-lg text-sm ${errors.startDate ? "border-red-500 focus-within:border-red-500 focus-within:shadow-[0_0_0px_1px_#f63b3b89]" : "focus-within:border-blue-500 focus-within:shadow-[0_0_0px_1px_#3b83f689]"}`}
      >
        <Controller
          name="startDate"
          control={control}
          render={({ field, fieldState }) => (
            <Flatpickr
              value={field.value ? [field.value] : []}
              placeholder="yyyy-mm-dd"
              className={`w-full h-full outline-0 px-3 py-2.5 rounded-lg relative z-0 ${
                fieldState.error && "border-red-500"
              }`}
              options={{
                dateFormat: "Y-m-d",
                maxDate: "today",
              }}
              onChange={(date: Date[]) => field.onChange(date[0])}
            />
          )}
        />

        <CalendarDays
          size={18}
          className="absolute right-2.5 top-2.5 pointer-events-none"
          strokeWidth={1.5}
        />
        <label
          className={`absolute left-3 text-sm px-1 font-semibold transition-all duration-200 ${errors.startDate ? "-top-4.5 bg-transparent text-red-600" : "-top-3 bg-(--report-bg) text-(--report-text)"}`}
        >
          Start Date
        </label>
      </fieldset>
      <fieldset
        className={`text-(--report-text) border border-(--report-border) relative rounded-lg text-sm ${errors.endDate ? "border-red-500 focus-within:border-red-500 focus-within:shadow-[0_0_0px_1px_#f63b3b89]" : "focus-within:border-blue-500 focus-within:shadow-[0_0_0px_1px_#3b83f689]"}`}
      >
        <Controller
          name="endDate"
          control={control}
          render={({ field, fieldState }) => (
            <Flatpickr
              value={field.value}
              placeholder="yyyy-mm-dd"
              className={`w-full h-full outline-0 px-3 py-2.5 rounded-lg relative z-0 ${fieldState.error && "border-red-500"}`}
              options={{
                dateFormat: "Y-m-d",
                minDate: watch("startDate"),
                maxDate: "today",
              }}
              onChange={(date: any) => field.onChange(date[0])}
            />
          )}
        />

        <CalendarDays
          size={18}
          className="absolute right-2.5 top-2.5 pointer-events-none"
          strokeWidth={1.5}
        />
        <label
          className={`absolute left-3 text-sm px-1 font-semibold transition-all duration-200 ${errors.endDate ? "-top-4.5 bg-transparent text-red-600" : "-top-3 bg-(--report-bg) text-(--report-text)"}`}
        >
          End Date
        </label>
      </fieldset>
      <fieldset
        className={`relative w-full text-(--report-text) border border-(--report-border) bg-(--report-bg) rounded-lg text-sm ${errors.vehicle ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0px_1px_#f63b3b89]" : "focus-within:border-blue-500 focus-within:shadow-[0_0_0px_1px_#3b83f689]"}`}
      >
        <Controller
          name="vehicle"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              classNamePrefix="metronSelect"
              placeholder="Select Vehicle"
              components={{
                DropdownIndicator: dropdown,
                IndicatorSeparator: null,
              }}
              options={vehicleList}
              styles={inputSelectStyle}
            />
          )}
        />

        <label
          className={`absolute left-3 text-sm px-1 font-semibold transition-all duration-200 ${errors.vehicle ? "-top-4.5 bg-transparent text-red-600" : "-top-3 bg-(--report-bg) text-(--report-text)"}`}
        >
          Vehicle
        </label>
      </fieldset>
      <button
        id="basicFormSubmit"
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex justify-center items-center gap-2 font-semibold cursor-pointer hover:bg-blue-700 transition-colors duration-200 mt-5 sm:mt-0"
      >
        <Search size={18} strokeWidth={2.5} className="" />
        {"Search"}
      </button>
    </form>
  );
};

export default BasicForm;
