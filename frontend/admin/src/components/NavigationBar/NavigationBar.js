import React from "react";
import { Menu, Row, Col, Button, } from "antd";
import { Link } from "react-router-dom";

const NavigationBar = (props) => {
  const { 
    history, 
  } = props;
  const { 
    logo,
    container,
    menu,
    logoContainer,
    navItem,
    rightNavContainer,
  } = styles;

  const logOut = () => {
    history.push("/logout");
  }

  return (
    <Row style={container}>
      <Col span={12}>
        <Row gutter={16}>
          <Col className="gutter-row" style={logoContainer}>
            <Link to="/" style={logo}>
              <img 
                src="/logo192.png" 
                alt="" 
                width="32"
              />
            </Link>
          </Col>
          {localStorage.getItem("token") && 
            <Col className="gutter-row">
              <Menu
                theme="light"
                mode="horizontal"
                style={menu}
                selectedKeys={[history.location.pathname]}
              >
                <Menu.Item 
                  key={"/"}
                  onClick={() => history.push("/")} 
                  style={navItem}
                >
                  หอทั้งหมด
                </Menu.Item>
                <Menu.Item 
                  key={"/create"}
                  onClick={() => history.push("/create")} 
                  style={navItem}
                >
                  สร้างหอ
                </Menu.Item>
              </Menu>
            </Col>
          }
        </Row>
      </Col>
      <Col span={12} style={rightNavContainer}>
        {localStorage.getItem("token") && 
          <Button onClick={logOut}>Log out</Button>
        }
      </Col>
    </Row>
  )
}

const styles = {
  logoContainer: {
    display: "flex",
  },
  logo: {
    width: "16px",
    height: "32px",
    margin: "16px 24px",
  },
  container: {
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
  },
  navItem: {
    fontWeight: "bold",
    fontSize: "16px",
  },
  rightNavContainer: {
    display: "flex", 
    justifyContent: "flex-end", 
    alignItems: "center", 
    paddingRight: 24,
  },
}

export default NavigationBar;
