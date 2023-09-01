import { FaCalendar } from "react-icons/fa";
import { lazy } from "react";

const route = {
  path: "/schedule",
  label: "Lịch chiếu",
  icon: <FaCalendar />,
  exact: true,
  public: true,
  component: lazy(() => import(".")),
};

export default route;
