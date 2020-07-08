import React from "react";
import { 
  Route, 
  Redirect,
} from "react-router-dom";

const PrivateRoute = (props) => {
  const { 
    path, 
    component: Component, 
    ...restProps
  } = props;
  if (localStorage.getItem("token")) {
    return (
      <Route path={path} component={Component} {...restProps}/>
    );
  } else {
    return (
      <Redirect to={`/login?redir=${path}`}/>
    );
  }
};

export default PrivateRoute;

