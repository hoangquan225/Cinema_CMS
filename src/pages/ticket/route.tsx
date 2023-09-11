import { BsTicketPerforated } from "react-icons/bs";
import { lazy } from "react";

const route = {
  path: "/ticket",
  label: "Vé",
  icon: <BsTicketPerforated />,
  exact: true,
  public: true,
  component: lazy(() => import(".")),
};

export default route;
