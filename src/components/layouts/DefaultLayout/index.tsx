import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import routes from "../../../pages/routes";
import classNames from "classnames/bind";
import styles from "./style.module.scss";
import fallbackAvatar from "../../../assets/img/fallback-avatar.jpg";
import Cookies from "js-cookie";

const cx = classNames.bind(styles);

const { Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  onClick?: Function,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    label,
    children,
    onClick,
  } as MenuItem;
}

const LayoutDefault = ({ children }: { children?: any }) => {
  const navigate = useNavigate();
  let location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [current, setCurrent] = useState(
    location.pathname === "/" || location.pathname === ""
      ? "/home"
      : location.pathname
  );
  //or simply use const [current, setCurrent] = useState(location.pathname)

  function handleClick(e: any) {
    setCurrent(e.key);
  }

  const items: MenuItem[] = routes
    .filter(({ label }) => label !== "")
    .map(({ path, label, icon }, index) =>
      getItem(label, path, icon, () => {
        navigate(path);
      })
    );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={240}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "sticky",
          zIndex: "5",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className={cx("logo")}>
          <Link className={cx("logo__link")} to="/"></Link>
        </div>
        <div className={cx("admin__wrapper")}>
          <img
            className={cx("admin__img")}
            src={fallbackAvatar}
            alt="fallback-avatar"
            loading="lazy"
          />
          <div className={cx("admin__text")}>
            <h5 className={cx("admin__name")}>Admin</h5>
            <button
              className={cx("admin__logout")}
              onClick={() => {
                navigate("/dang-nhap");
                Cookies.remove("tokenAdmin");
              }}
            >
              Log out
            </button>
          </div>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={[current]}
          mode="inline"
          items={items}
          onClick={handleClick}
          // selectedKeys={[current]}
        />
      </Sider>
      <Layout className={cx("site-layout")}>
        <Content>
          <div className={cx("site-layout-background")}>{children}</div>
        </Content>
        <Footer style={{ textAlign: "center", padding: "20px" }}>
          Cinema ©2023 Sản phẩm của Nhóm
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutDefault;
