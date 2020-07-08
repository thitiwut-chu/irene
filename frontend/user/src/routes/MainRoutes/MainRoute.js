import React from "react";
import { 
  BrowserRouter, 
  Route, 
  Switch,
} from "react-router-dom";
import NavigationBar from "../../components/NavigationBar";
import HomePage from "../../pages/HomePage";
import RealEstateListPage from "../../pages/RealEstateListPage";
import RealEstateDetailPage from "../../pages/RealEstateDetailPage";
import NoMatchPage from "../../pages/NoMatchPage";

const MainRoute = () => {
  return (
    <BrowserRouter>
      <Route path="/" component={NavigationBar}/>
      <Switch>
        <Route exact path="/" component={HomePage}/>
        <Route 
          exact 
          path="/real-estate" 
          component={RealEstateListPage}
        />
        <Route 
          path="/real-estate/:reId" 
          component={RealEstateDetailPage}
        />
        <Route component={NoMatchPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default MainRoute;
