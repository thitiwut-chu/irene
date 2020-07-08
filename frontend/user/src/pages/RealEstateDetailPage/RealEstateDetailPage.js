import React, { useEffect, useState } from "react";
import { 
  Row, 
  Col, 
  Typography, 
  Descriptions, 
  Tabs,
  Spin,
  Empty,
} from "antd";
import { 
  CheckCircleTwoTone, 
  CloseCircleTwoTone,
  LoadingOutlined,
} from "@ant-design/icons";
import dateFormat from "dateformat";
import { getRealEstateById } from "../../services/realEstateService";
import GoogleMapReact from "google-map-react";
import { ROOT_ENDPOINT } from "../../environment";
import Lightbox from "react-image-lightbox";

const { TabPane } = Tabs;

const RealEstateDetailPage = props => {
  const [realEstate, setRealEstate] = useState();
  const [loading, setLoading] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(-1);
  const [lightBoxVibisle, setLightBoxVibisle] = useState(false);
  const [images, setImages] = useState([]);
  const { 
    container,
    imageStyle,
    width250,
    margin4and0,
    fontSize24,
    margin16and0,
    textAlignCenter,
    fontSize48,
    mapContainer,
    marginTop32,
  } = styles;

  useEffect(() => {
    if (realEstate) {
      document.title = `${realEstate.name} | Irene`;
    }
  }, [realEstate]);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        let res = await getRealEstateById(props.match.params.reId);
        setRealEstate(res.data);
        setLoading(false);

        let images = res.data.images.map(image => `${ROOT_ENDPOINT}/${image.url}`);
        setImages(images);
      } catch (error) {
        alert(error);
        setLoading(false);
      }
    })();
    return () => {
      setRealEstate([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderImages = () => {
    if (realEstate.images.length === 0) {
      return (<Empty description="ไม่มีรูป" />);
    }

    return realEstate.images.map((image, index) => (
      <img
        key={image.id}
        src={`${ROOT_ENDPOINT}/${image.url}`} 
        alt="" 
        style={imageStyle} 
        onClick={() => {
          setPhotoIndex(index);
          setLightBoxVibisle(true);
        }}
      />
    ));
  }

  const renderHaveOrDontIcon = (have) => {
    if (have) {
      return (
        <CheckCircleTwoTone 
          style={fontSize24} 
          twoToneColor="#67DE2D" 
        />
      );
    } else {
      return (
        <CloseCircleTwoTone 
          style={fontSize24} 
          twoToneColor="#FF3333"
        />
      );
    }
  }

  const renderFacilityItem = (have, facilityName) => {
    return (
      <Col span={24}>
        <Row style={margin4and0}>
          <Col span={4}>
            {renderHaveOrDontIcon(have)}
          </Col>
          <Col span={20}>
            {facilityName}
          </Col>
        </Row>
      </Col>
    );
  };

  const renderFacility = () => {
    const { facility } = realEstate;
    return (
      <Row style={width250}>
        {renderFacilityItem(facility.fan, "พัดลม")}
        {renderFacilityItem(facility.airConditioner, "เครื่องปรับอากาศ")}
        {renderFacilityItem(facility.waterHeater, "เครื่องทำน้ำอุ่น")}
        {renderFacilityItem(facility.freeWirelessInternet, "อินเทอร์เน็ตฟรี")}
        {
          renderFacilityItem(
            facility.motorcycleParkingLot, 
            "ที่จอดรถจักรยานยนต์"
          )
        }
        {renderFacilityItem(facility.carParkingLot, "ที่จอดรถยนต์")}
        {renderFacilityItem(facility.elevator, "ลิฟท์")}
      </Row>
    );
  }

  if (loading || !realEstate) {
    return (
      <Row>
        <Col span={24} className="gutter-row" style={{ ...textAlignCenter, ...marginTop32 }}>
          <Spin
            indicator={<LoadingOutlined style={fontSize48} spin />}
          />
        </Col>
      </Row>
    );
  }

  return (
    <Row justify="center">
      <Col style={container} span={16}>
        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="รายละเอียด" key="1">
            <Typography.Text type="secondary">
              อัพเดทล่าสุด {dateFormat(realEstate.updatedAt, "d/m/yyyy")}
            </Typography.Text>
            <br />
            <Descriptions bordered column={4}>
              <Descriptions.Item label="ชื่อหอ" span={2}>
                {realEstate.name}
              </Descriptions.Item>
              <Descriptions.Item label="ราคา" span={2}>
                {realEstate.price} บาท/เดือน
              </Descriptions.Item>
              <Descriptions.Item label="ที่อยู่" span={4}>
                {realEstate.address}
              </Descriptions.Item>
              <Descriptions.Item label="จังหวัด" span={2}>
                {realEstate.province}
              </Descriptions.Item>
              <Descriptions.Item label="รหัสไปรษณีย์" span={2}>
                {realEstate.postalCode}
              </Descriptions.Item>
              <Descriptions.Item label="รายละเอียด" span={4}>
                {realEstate.description}
              </Descriptions.Item>
              <Descriptions.Item label="ติดต่อ" span={4}>
                <div>
                  เบอร์โทรศัพท์: {realEstate.contact.phoneNumber}
                </div>
                <div>
                  ไลน์ไอดี: {realEstate.contact.lineId}
                </div>  
              </Descriptions.Item>
              <Descriptions.Item label="สิ่งอำนวยความสะดวก" span={4}>
                {renderFacility()}
              </Descriptions.Item>
            </Descriptions>
          </TabPane>
          <TabPane tab="แผนที่" key="2">
            <div style={mapContainer}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY }}
                defaultCenter={{
                  lat: realEstate.position.latitude,
                  lng: realEstate.position.longitude,
                }}
                defaultZoom={14}
                onGoogleApiLoaded={({map, maps}) => {
                  let marker = new maps.Marker({
                    position: {
                      lat: realEstate.position.latitude,
                      lng: realEstate.position.longitude,
                    },
                    map,
                    title: realEstate.name,
                  });

                  return marker;
                }}
              >
              </GoogleMapReact>
            </div>
          </TabPane>
          <TabPane tab="รูปภาพ" key="3">
            <div style={margin16and0}>
              {renderImages()}
            </div>
          </TabPane>
        </Tabs>
      </Col>
      {lightBoxVibisle && (
        <Lightbox
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setLightBoxVibisle(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + images.length - 1) % images.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % images.length)
          }
        />
      )}
    </Row>
  );
}

const styles = {
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: "2px",
    boxShadow: "0 1px 4px rgba(0,0,0,.2)",
    padding: "16px 16px",
    margin: "16px 0",
  },
  imageStyle: {
    objectFit: "contain",
    margin: 4,
    cursor: "zoom-in",
    maxWidth: 128,
  },
  maxWidth90percent: {
    maxWidth: "90%",
  },
  width250: {
    width: "250px",
  },
  margin4and0: {
    margin: "4px 0",
  },
  fontSize24: {
    fontSize: "24px",
  },
  margin16and0: {
    margin: "16px 0",
  },
  textAlignCenter: {
    textAlign: "center",
  },
  fontSize48: {
    fontSize: "48px",
  },
  mapContainer: {
    height: 600, 
    width: '100%',
  },
  marginTop32: {
    marginTop: 32,
  },
}

export default RealEstateDetailPage;
