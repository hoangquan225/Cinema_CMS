import { lazy } from "react";
import { IoLocation } from "react-icons/io5";

const route = {
  path: "/theater",
  label: "Rạp chiếu",
  icon: <IoLocation />,
  exact: true,
  public: true,
  component: lazy(() => import(".")),
};

export default route;
