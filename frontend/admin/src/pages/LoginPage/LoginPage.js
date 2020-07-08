import React, { useState, useEffect } from "react";
import { 
  Typography, 
  Button, 
  Form, 
  Input, 
  Row, 
  Col,
} from "antd";
import { logIn } from "../../services/userService";
import queryString from "query-string";

const LoginPage = props => {
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState();
  const { 
    history,
    location,
  } = props;
  const { 
    container,
    form,
    error, 
  } = styles;

  useEffect(() => {
    document.title = "เข้าสู่ระบบ | Irene";
  }, []);

  const onFinish = async values => {
    try {
      setLoggingIn(true);

      let res = await logIn(values.username, values.password);
      localStorage.setItem("token", res.data.token);

      setLoggingIn(false);
      
      let redir = queryString.parse(location.search).redir || "/";
      history.push(redir);
    } catch (error) {
      setLoggingIn(false);
      switch (error.response.status) {
        case 401:
          setLoginError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
          break;
        case 500:
          setLoginError("เซิฟเวอร์มีปัญหา");
          break;
        default:
          break;
      }
    }
  };

  return (
    <Row justify="center">
      <Col span={6} style={container}>
        <Typography.Title level={4}>เข้าสู่ระบบ</Typography.Title>
        <Form
          name="basic"
          onFinish={onFinish}
          style={form}
        >
          <Form.Item
            name="username"
            validateStatus={loginError ? "error" : undefined}
            rules={[{ required: true, message: "โปรดใส่ชื่อผู้ใช้" }]}
          >
            <Input placeholder="ชื่อผู้ใช้" />
          </Form.Item>

          <Form.Item
            name="password"
            validateStatus={loginError ? "error" : undefined}
            rules={[{ required: true, message: "โปรดใส่รหัสผ่าน" }]}
          >
            <Input.Password placeholder="รหัสผ่าน" />
          </Form.Item>
          <Form.Item>
            { loggingIn ? 
              <Button loading disabled type="primary" htmlType="submit">
                เข้าสู่ระบบ
              </Button>
              :
              <Button type="primary" htmlType="submit">
                เข้าสู่ระบบ
              </Button>
            }
          </Form.Item>
        </Form>
        { loginError ? 
          <div style={error}>{loginError}</div>
          :
          null
        }
      </Col>
    </Row>
  )
}

const styles = {
  container: {
    marginTop: "10%",
    borderRadius: "2px",
    backgroundColor: "#FFFFFF",
    padding: "8px 16px",
    boxShadow: "0 1px 4px rgba(0,0,0,.2)",
  },
  form: {
    marginTop: "20px",
  },
  signupButton: {
    fontWeight: "bold",
    padding: "0 5px",
  },
  error: {
    color: "red",
    marginTop: "-20px",
  }
}

export default LoginPage;
