import React, { useEffect, useState } from "react";
import { 
  Row, 
  Col, 
  Spin, 
  Typography, 
  Pagination, 
  Empty,
  Input,
  Select,
  Button,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { listRealEstate } from "../../services/realEstateService";
import { ROOT_ENDPOINT } from "../../environment";
import { provinces } from "../../constants/filterConstants";

const RealEstateListPage = (props) => {
  const [realEstates, setRealEstates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [filters, setFilters] = useState({});
  const { history, location } = props;
  const {
    container,
    realEstatesName,
    realEstatesImg,
    itemContainer,
    contentContainer,
    textAlignCenter,
    fontSize48,
    colorFFA107,
    fontSize16,
    marginBottom8,
    color0077ED,
    filterContainer,
    filterOptionContainer,
    marginTop8,
    width100percent,
    flexJustifyFlexEnd,
  } = styles;

  useEffect(() => {
    fetchRealEstate(filters);
    return () => {
      setRealEstates([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    document.title = "ดูหอ | Irene";

    if (location.state) {
      let tmpFilter = {...filters};
      tmpFilter.keyword = location.state.keyword 
      setFilters(tmpFilter);
      fetchRealEstate(tmpFilter);
    }

    window.addEventListener("beforeunload", (e) => {
      history.replace("/real-estate");
    });
  }, []);

  const fetchRealEstate = async (filters) => {
    setLoading(true);
    let queryParams = new URLSearchParams();
    queryParams.append("limit", 9);
    queryParams.append("offset", (currentPage - 1) * 9);
    for (const key in filters) {
      queryParams.append(key, filters[key]);
    }

    try {
      let res = await listRealEstate(queryParams.toString());
      setRealEstates(res.data.rows);
      setCount(res.data.count);
      setLoading(false);
    } catch (error) {
      alert(error);
      setLoading(false);
    }
  }

  const renderRealEstates = () => {
    if (loading) {
      return (
        <Col span={24} style={textAlignCenter}>
          <Spin 
            indicator={<LoadingOutlined style={fontSize48} spin />}
          />
        </Col>
      );
    }

    if (realEstates.length === 0) {
      return (
        <Col span={24}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Col>
      );
    }

    return realEstates.map(realEstate => (
        <Col key={realEstate.id} span={12} className="gutter-row">
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

  const onSearch = (value) => {
    let tmpFlters = {
      ...filters,
      keyword: value,
    }
    if (!value) {
      delete tmpFlters["keyword"];
    }
    setFilters(tmpFlters);
    fetchRealEstate(tmpFlters);
  }

  const renderKeyword = () => {
    if (filters.keyword) {
      return (
        <div style={{ ...fontSize16, ...marginBottom8 }}>
          ค้นหา "
          <Typography.Text style={color0077ED}>
            {filters.keyword}
          </Typography.Text>
          "
        </div>
      );
    } else {
      return null;
    }
  }

  const onPageChange = (p, ps) => {
    setCurrentPage(p);
  }

  const renderProvinces = () => {
    return provinces.map((province, index) => (
      <Select.Option key={index} value={province}>
        {province}
      </Select.Option>
    ));
  }

  const removeFilter = (key) => {
    let tmpFilter = {...filters};
    delete tmpFilter[key];
    setFilters(tmpFilter);
  }

  return (
    <Row style={container} gutter={[16, 8]}>
      <Col span={24} className="gutter-row">
        <Row justify="end">
          <Col span={6}>
            <Input.Search 
              placeholder="ค้นหาจาก สถานที่, ถนน, จังหวัด"
              enterButton
              allowClear
              onSearch={onSearch}
            />
          </Col>
        </Row>
      </Col>
      <Col span={5} className="gutter-row">
        <div style={filterContainer}>
          <div style={filterOptionContainer}>
            <Typography.Text strong>ราคาเช่า</Typography.Text>
            <Row justify="space-between" style={marginTop8}>
              <Col span={11}>
                <Input 
                  placeholder="฿ น้อยสุด" 
                  allowClear
                  onChange={(e) => {
                    if (!e.target.value) {
                      removeFilter("minPrice");
                      return;
                    }
                    setFilters({ ...filters, minPrice: e.target.value });
                  }}
                />
              </Col>
              <Col span={2} style={textAlignCenter}>
                -
              </Col>
              <Col span={11}>
                <Input 
                  placeholder="฿ มากสุด"
                  allowClear
                  onChange={(e) => {
                    if (!e.target.value) {
                      removeFilter("maxPrice");
                      return;
                    }
                    setFilters({ ...filters, maxPrice: e.target.value });
                  }}
                /> 
              </Col>
            </Row>
          </div>
          <div style={filterOptionContainer}>
            <Typography.Text strong>จังหวัด</Typography.Text>
            <Row style={marginTop8} gutter={[0, 8]}>
              <Col className="gutter-row" span={24}>
                <Select 
                  placeholder="จังหวัด"
                  allowClear
                  onChange={(v, o) => {
                    if (!v) {
                      removeFilter("province");
                      return;
                    }
                    setFilters({
                      ...filters,
                      province: v,
                    });
                  }}
                  style={width100percent} 
                >
                  {renderProvinces()}
                </Select>
              </Col>
            </Row>
          </div>
          <Row style={textAlignCenter} gutter={[0, 8]}>
            <Col span={24} className="gutter-row">
              <Button 
                onClick={() => fetchRealEstate(filters)} 
                type="primary"
              >
                ค้นหา
              </Button>
            </Col>
          </Row>
        </div>
      </Col>
      <Col span={19} className="gutter-row">
        {renderKeyword()}
        <Row gutter={[16, 8]}>
          {renderRealEstates()}
        </Row>
        <div style={flexJustifyFlexEnd} hidden={loading}>
          <Pagination
            current={currentPage}
            total={count} 
            onChange={onPageChange}
            hideOnSinglePage
          />
        </div>
      </Col>
    </Row>
  )
}

const styles = {
  container: {
    margin: "8px 16px",
  },
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
  fontSize16: {
    fontSize: "16px",
  },
  marginBottom8: {
    marginBottom: "8px",
  },
  color0077ED: {
    color: "#0077ED",
  },
  filterContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: "2px",
    padding: "0 16px 8px 16px",
    boxShadow: "0 1px 4px rgba(0,0,0,.2)",
  },
  filterOptionContainer: {
    padding: "8px 0 16px 0",
  },
  marginTop8: {
    marginTop: 8,
  },
  width100percent: {
    width: "100%",
  },
  flexJustifyFlexEnd: {
    display: "flex",
    justifyContent: "flex-end",
  },
}

export default RealEstateListPage;
