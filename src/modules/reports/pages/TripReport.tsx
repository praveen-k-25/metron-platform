import { ChevronDown, TextAlignJustify, WalletCards } from "lucide-react";
import { useCallback, useState } from "react";
import Select from "react-select";
import BasicForm from "../components/BasicForm";
import {
  options,
  reportForm,
  tableHeader,
  tripReportData,
} from "../reports.types";
import { getTripReport } from "../reports.api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const dropdown = () => <ChevronDown className="mr-2" size={20} />;

const inputSelectStyle = {
  control: (base: any) => ({
    ...base,
    border: "none",
    boxShadow: "none",
    backgroundColor: "transparent",
    "&:hover": {
      border: "none",
    },
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "var(--report-text)", // visible text color
    //height: "30px",
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
  dropdownIndicator: (base: any) => ({
    ...base,
    padding: "4px",
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: "0 8px",
  }),
};

const tableHeaders = [
  {
    label: "S.No",
  },
  {
    label: "Vehicle",
  },
  {
    label: "Start Trip",
  },
  {
    label: "End Trip",
  },
  {
    label: "Duration",
  },
];

const tableOptions = [
  {
    label: "5",
    value: 5,
  },
  {
    label: "10",
    value: 10,
  },
  {
    label: "15",
    value: 15,
  },
];

const schema = yup.object({
  //name: yup.string().required("name is required"),
  startDate: yup.date().required("start date is required"),
  endDate: yup.date().required("start date is required"),
  vehicle: yup
    .object({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .required("select is required"),
});

const TripReport = () => {
  const [activeMobileForm, setMobileFormActive] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [rowsperpage, setRowsPerPage] = useState<options>(tableOptions[0]);
  const [tripData, setTripData] = useState<tripReportData[]>([]);
  const [tripDataCount, setTripDataCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [payload, setPayload] = useState<reportForm>();
  //const [search, setSearch] = useState<string>("");

  const tripReportForm = useForm({
    resolver: yupResolver(schema),
  });

  const handleMobileFormActiveState = () => {
    setMobileFormActive((prev: boolean) => !prev);
  };

  const handleFormSubmit = async (data: any) => {
    const payload = {
      page: page,
      rows: rowsperpage.value,
      startDate: data.startDate,
      endDate: data.endDate,
      vehicle: data.vehicle.value,
    };
    setPayload(payload);
    setMobileFormActive(false);
    handleTripReport();
  };

  const handleTripReport = async (
    customPage?: number,
    customRows?: options,
  ) => {
    if (!payload || Object.keys(tripReportForm.formState.errors).length !== 0)
      return;
    if (customPage) setPage(customPage);
    if (customRows) setRowsPerPage(customRows);

    let customPayload = {
      ...payload,
      page: customPage ? customPage : page,
      rows: customRows ? customRows.value : rowsperpage.value,
    };
    try {
      setLoading(true);
      const response = await getTripReport(customPayload);
      setTripData(response.data);
      setTripDataCount(response.totalCount);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderLoaderRows = useCallback(() => {
    return Array.from({ length: rowsperpage.value }).map((_, index) => (
      <tr key={index} className="animate-pulse h-14">
        {tableHeaders.map((_, i) => (
          <td key={i} className="p-3">
            <div className="h-4 px-2 rounded bg-slate-200"></div>
          </td>
        ))}
      </tr>
    ));
  }, [rowsperpage.value, tableHeaders]);

  return (
    <div className="flex-1 h-full">
      <div className="text-(--report-text) bg-(--report-bg) relative w-full h-full overflow-x-hidden overflow-y-auto flex flex-col gap-5 p-3">
        <section
          id="report-header"
          className="flex justify-between items-center"
        >
          <h2 className="text-xl font-semibold px-3 ">Trip Report</h2>
          <button
            onClick={handleMobileFormActiveState}
            className="sm:hidden p-1.5 px-2 border border-(--report-border) rounded-md shadow-[0_0_2px_0px_(--report-shadow)] cursor-pointer"
          >
            <TextAlignJustify size={17} strokeWidth={3} />
          </button>
        </section>
        <section id="report-form">
          <BasicForm
            reportForm={tripReportForm}
            activeMobileForm={activeMobileForm}
            handleMobileFormActiveState={handleMobileFormActiveState}
            handleFormSubmit={handleFormSubmit}
          />
        </section>
        <section
          id="table-section"
          className=" rounded-2xl shadow-[0_0_3px_0_var(--report-shadow)] p-5 flex flex-col gap-4"
        >
          {/* <section className="w-full flex justify-between items-center">
            <input
              type="search"
              className="w-75 ml-4 p-1 px-3 rounded-lg shadow-[0_0_3px_0_var(--report-shadow)] outline-0 focus:shadow-[0_0_5px_0_var(--report-shadow)]"
              placeholder="Filter vehicle"
            />
          </section> */}
          <section
            id="report-table"
            className="w-full border border-(--report-row-border) rounded-2xl overflow-x-auto"
          >
            <table className="text-sm font-normal w-full">
              <thead className="bg-(--report-sec-bg)">
                <tr className="border-b border-(--report-row-border)">
                  {tableHeaders.map((header: tableHeader, index: number) => (
                    <th
                      key={`${header.label}-${index}`}
                      className="font-semibold p-2 text-start px-3 whitespace-nowrap"
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  renderLoaderRows()
                ) : tripDataCount === 0 ? (
                  <tr className="border-b border-(--report-row-border) ">
                    <td colSpan={tableHeaders.length} className="p-5 ">
                      <div className="flex flex-col gap-2 justify-center items-center">
                        <WalletCards size={18} />
                        <p className="text-center">No Data Found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {tripData.map((data: tripReportData, index: number) => (
                      <tr
                        key={`${data.vehicleName}-${(page - 1) * rowsperpage.value + index + 1}`}
                        className="border-b border-(--report-row-border) hover:bg-(--report-hover-data)"
                      >
                        <td className="p-2 pl-5">
                          {(page - 1) * rowsperpage.value + index + 1}
                        </td>
                        <td className="p-2">{data.vehicleName}</td>
                        <td className="p-2">{data.startTrip}</td>
                        <td className="p-2">{data.endTrip}</td>
                        <td className="p-2">{data.duration}</td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </section>
          <section className="w-full flex flex-col sm:flex-row gap-3 justify-between items-center p-2 text-sm">
            <div className="text-(--report-text)">
              Showing{" "}
              <span className="font-semibold">
                {`${1 + rowsperpage.value * (page - 1) > tripDataCount ? tripDataCount : 1 + rowsperpage.value * (page - 1)} - ${rowsperpage.value * page < tripDataCount ? rowsperpage.value * page : tripDataCount}`}{" "}
              </span>{" "}
              of <span className="font-semibold">{`${tripDataCount}`}</span>
            </div>

            <div className="flex flex-row gap-2 justify-center items-center">
              <section className="">
                <Select
                  value={rowsperpage}
                  classNamePrefix="metronSelect"
                  onChange={(e: any) => {
                    let temPage = Math.ceil(tripDataCount / e.value);
                    if (page > temPage) {
                      handleTripReport(temPage, e);
                    } else {
                      handleTripReport(page, e);
                    }
                  }}
                  isSearchable={false}
                  className="border border-(--report-border) rounded-lg h-7 flex justify-center items-center "
                  placeholder="Select Vehicle"
                  components={{
                    DropdownIndicator: dropdown,
                    IndicatorSeparator: null,
                  }}
                  options={tableOptions}
                  styles={inputSelectStyle}
                  menuPlacement="auto"
                  menuPosition="fixed"
                />
              </section>
              <section className="flex justify-center items-center text-(--report-text)">
                <button
                  disabled={page === 1}
                  onClick={() => {
                    //setPage((prev: number) => prev - 1);
                    handleTripReport(page - 1);
                  }}
                  className={`border border-(--report-border) rounded-l-lg px-3 p-1 ${page === 1 ? "text-(--report-hover)" : "hover:bg-(--report-sec-bg)"}`}
                >
                  Previous
                </button>
                <button
                  disabled={
                    page === Math.ceil(tripDataCount / rowsperpage.value)
                  }
                  onClick={() => {
                    //setPage((prev: number) => prev + 1);
                    handleTripReport(page + 1);
                  }}
                  className={`border-y border-r border-(--report-border)  rounded-r-lg px-3 p-1  ${page === Math.ceil(tripDataCount / rowsperpage.value) ? "text-(--report-hover)" : "hover:bg-(--report-sec-bg)"}`}
                >
                  Next
                </button>
              </section>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
};

export default TripReport;
