import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const NavigationBar = props => {
  const { 
    history, 
  } = props;
  const { 
    logo,
    header,
    menu,
    leftNav,
    navItem,
  } = styles;

  return (
    <div style={header} >
      <div style={leftNav} >
        <Link to="/" style={logo} >
          <img 
            src="/logo192.png" 
            alt="" 
            width="32"
          />
        </Link>
        <Menu
          theme="light"
          mode="horizontal"
          style={menu}
          selectedKeys={[history.location.pathname]}
        >
          <Menu.Item 
            key={"/real-estate"}
            onClick={() => history.push("/real-estate")} 
            style={navItem}
          >
            ดูหอ
          </Menu.Item>
        </Menu>
      </div>
    </div>
  )
}

const styles = {
  logo: {
    width: "16px",
    height: "32px",
    margin: "16px 24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    boxShadow: "0 1px 3px rgba(0,0,0,.15)",
    position: "sticky",
    top: "0",
    zIndex: "2",
  },
  menu: {
    lineHeight: "64px",
    borderWidth: "0",
  },
  leftNav: {
    display: "flex",
    justifyContent: "space-evenly",
  },
  navItem: {
    fontWeight: "bold",
    fontSize: "16px",
  },
}

export default NavigationBar;
