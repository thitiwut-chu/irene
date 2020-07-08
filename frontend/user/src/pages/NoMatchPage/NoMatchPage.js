import React, { useEffect } from "react";
import { Typography } from "antd";
import {
  FrownOutlined,
} from '@ant-design/icons';

const NoMatchPage = () => {
  const {
     container,
     fontSize72,
  } = styles;

  useEffect(() => {
    document.title = "404 ไม่พบหน้า | Irene";
  }, []);

  return (
    <div style={container}>
      <FrownOutlined style={fontSize72} />
      <br />
      <Typography.Title level={1}>404 Page not found</Typography.Title>
    </div>
  )
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "8px",
  },
  fontSize72: {
    fontSize: "72px",
  },
}

export default NoMatchPage;
