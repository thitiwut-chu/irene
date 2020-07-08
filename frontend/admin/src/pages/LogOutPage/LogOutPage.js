import React, { useEffect } from "react";
import { Spin, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { logOut } from "../../services/userService";

const LogOutPage = props => {
  const {
    history,
  } = props;
  const { 
    container,
    loadingIcon,
    logOutText,
  } = styles;
  useEffect(() => {
    document.title = "ออกจากระบบ | Irene";

    setTimeout(() => {
      logOut();
      history.push("/");
    }, Math.floor(Math.random() * (4000 - 2000 + 1) ) + 2000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={container}>
      <Spin indicator={<LoadingOutlined style={loadingIcon} spin />}/>
      <br />
      <Typography.Text strong style={logOutText}>Logging out</Typography.Text>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center", 
    marginTop: "40px",
  },
  loadingIcon: {
    fontSize: "56px",
    marginBottom: 16,
  },
  logOutText: {
    fontSize: 18,
  },
}

export default LogOutPage;
