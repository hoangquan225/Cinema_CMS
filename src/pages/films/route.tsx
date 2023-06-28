import { FaFilm } from "react-icons/fa";
import { lazy } from "react";

const route = {
  path: "/films",
  label: "Phim",
  icon: <FaFilm />,
  exact: true,
  public: true,
  component: lazy(() => import(".")),
};

export default route;
