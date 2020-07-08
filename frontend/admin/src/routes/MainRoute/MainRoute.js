import React, { useEffect } from "react";
import { 
  BrowserRouter, 
  Route, 
  Redirect, 
  Switch,
} from "react-router-dom";
import NavigationBar from "../../components/NavigationBar";
import LoginPage from "../../pages/LoginPage";
import LogOutPage from "../../pages/LogOutPage";
import CreateRealEstatePage from "../../pages/CreateRealEstatePage";
import RealEstateListPage from "../../pages/RealEstateListPage";
import UpdateRealEstatePage from "../../pages/UpdateRealEstatePage";
import RealEstateDetailPage from "../../pages/RealEstateDetailPage";
import NoMatchPage from "../../pages/NoMatchPage";
import PrivateRoute from "../PrivateRoute";
import { checkTokenExpired } from "../../services/userService";

const MainRoute = () => {
  useEffect(() => {
    (async () => {
      try {
        let res = await checkTokenExpired(localStorage.getItem("token"));
        if (res.data.isExpired) {
          localStorage.removeItem("token");
        }
      } catch (error) {
        alert(error);
      }
    })();
    return () => {}
  }, []);

  return (
    <BrowserRouter forceRefresh>
      <Route path="/" render={(props) => (
        props.location.pathname === "/logout" ? null : <NavigationBar {...props} />
      )}/>
      <Switch>
        <PrivateRoute 
          exact 
          path="/" 
          component={RealEstateListPage}
        />
        <PrivateRoute 
          path="/create" 
          component={CreateRealEstatePage}
        />
        <PrivateRoute 
          path="/update/:reId" 
          component={UpdateRealEstatePage}
        />
        <PrivateRoute 
          path="/real-estate/:reId" 
          component={RealEstateDetailPage}
        />
        <Route 
          path="/login" 
          render={(props) => (
            localStorage.getItem("token") ? <Redirect to="/" /> : <LoginPage {...props} />
          )}
        />
        <Route 
          path="/logout" 
          component={LogOutPage}
          render={(props) => (
            localStorage.getItem("token") ? <LogOutPage {...props} /> : <Redirect to="/" />
          )}
        />
        <Route component={NoMatchPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default MainRoute;
