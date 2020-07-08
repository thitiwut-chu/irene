import React, { useState, useEffect } from "react";
import { 
  Input, 
  Row, 
  Col, 
  Typography, 
  Spin, 
  Empty,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom"
import { listRealEstate } from "../../services/realEstateService";
import { ROOT_ENDPOINT } from "../../environment";

const HomePage = props => {
  const [realEstates, setRealEstates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { 
    realEstatesName,
    realEstatesImg,
    itemContainer,
    contentContainer,
    textAlignCenter,
    fontSize48,
    colorFFA107,
    searchContainer,
    colorWhite,
    width512,
    padding16and100,
  } = styles;
  const { history } = props;

  useEffect(() => {
    document.title = "Irene";
    let queryParams = new URLSearchParams();
    queryParams.append("limit", 6);
    queryParams.append("random", true);

    setIsLoading(true);
    (async () => {
      try {
        let res = await listRealEstate(queryParams);
        setRealEstates(res.data.rows);
        setIsLoading(false);
      } catch (error) {
        alert(error);
        setIsLoading(false);
      }
    })();
    return () => {
      setRealEstates([]);
    }
  }, []);

  const search = (value) => {
    history.push(`/real-estate`, { keyword: value });
  }

  const renderRealEstates = () => {
    if (isLoading) {
      return (
        <Col span={24} className="gutter-row" style={textAlignCenter}>
          <Spin 
            indicator={<LoadingOutlined style={fontSize48} spin />}
          />
        </Col>
      );
    }

    if (realEstates.length === 0) {
      return (
        <Col span={24} className="gutter-row">
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="ไม่มีข้อมูล"
          />
        </Col>
      );
    }

    return realEstates.map(realEstate => (
      <Col key={realEstate.id} span={8} className="gutter-row">
        <Row style={itemContainer}>
          <Col span={8}>
            <Link to={`/real-estate/${realEstate.id}`}>
              <img 
                src={realEstate.images[0] ? 
                  `${ROOT_ENDPOINT}/${realEstate.images[0].url}`
                  : 
                  "/no_image.jpg"} style={realEstatesImg} 
                alt=""
              />
            </Link>
          </Col>
          <Col span={16} style={contentContainer}>
            <Link to={`/real-estate/${realEstate.id}`}>
              <Typography.Text style={realEstatesName} strong>
                {realEstate.name}
              </Typography.Text>
            </Link>
            <br />
            <Link to={`/real-estate/${realEstate.id}`}>
              <Typography.Text type="secondary">
                {`${realEstate.address} ${realEstate.province}`}
              </Typography.Text>
            </Link>
            <br />
            <Typography.Text style={colorFFA107}>
              {`${realEstate.price} บาท/เดือน`}
            </Typography.Text>
            <br />
          </Col>
        </Row>
      </Col>
      )
    );
  }

  return (
    <div>
      <Row style={searchContainer} justify="center">
        <Col>
          <Typography.Title style={colorWhite}>
            ค้นหาหอ
          </Typography.Title>
          <Input.Search
            placeholder="ค้นหาจาก สถานที่, ถนน, จังหวัด"
            enterButton
            size="large"
            style={width512}
            onSearch={search}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={padding16and100}>
        {renderRealEstates()}
      </Row>
    </div>
  )
}

const styles = {
  itemContainer: {
    boxShadow: "0 1px 4px rgba(0,0,0,.2)",
    backgroundColor: "#FFFFFF", 
    width: "100%",
    borderRadius: "2px",
    height: "100%",
    paddingRight: "8px",
  },
  contentContainer: {
    paddingLeft: "16px",
    paddingTop: "4px",
  },
  realEstatesName: {
    fontSize: "18px",
  },
  realEstatesImg: {
    width: "100%",
    borderRadius: "2px",
    objectFit: "cover",
    height: "150px",
  },
  textAlignCenter: {
    textAlign: "center",
  },
  fontSize48: {
    fontSize: "48px",
  },
  colorFFA107: {
    color: "#FFA107",
  },
  searchContainer: {
    backgroundColor: "#0066ff", 
    padding: "80px 100px",
  },
  colorWhite: {
    color: "#FFFFFF",
  },
  width512: {
    width: "512px",
  },
  padding16and100: {
    padding: "16px 100px",
  },
}

export default HomePage;
