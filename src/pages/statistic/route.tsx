import { FaChartBar } from "react-icons/fa";
import { lazy } from "react";

const route = {
  path: "/statistic",
  label: "Thống kê",
  icon: <FaChartBar />,
  exact: true,
  public: true,
  component: lazy(() => import(".")),
};

export default route;
