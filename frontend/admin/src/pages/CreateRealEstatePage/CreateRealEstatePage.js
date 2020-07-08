import React, { useState, useEffect } from "react";
import { 
  Row, 
  Col, 
  Button, 
  Input, 
  Form,
  Typography,
  Checkbox,
  Steps,
  Upload, 
  Descriptions,
  Tabs,
  Select,
  Modal,
  Empty,
} from "antd";
import { 
  PlusOutlined, 
  CheckCircleTwoTone, 
  CloseCircleTwoTone,
} from "@ant-design/icons";
import provinces from "../../constants/provinces";
import GoogleMapReact from "google-map-react";
import { 
  createRealEstate,
  addRealEstateImage,
} from "../../services/realEstateService";

const { Step } = Steps;
const { TabPane } = Tabs;
const { Option } = Select;

const Marker = () => (
  <div 
    style={styles.marker}
  >
    <img src="/marker.png" alt="" height={48}/>
  </div>
);

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { span: 22 },
};

const CreateRealEstatePage = props => {
  const [current, setCurrent] = useState(0);
  const [values, setValues] = useState({});
  const [fileList, setFileList] = useState([]);
  const [positionSelected, setPositionSelected] = useState(false);
  const [position, setPosition] = useState({
    lat: 13.7245601,
    lng: 100.4930241,
  });
  const [isCreating, setisCreating] = useState(false);
  const { 
    container, 
    formContainer,
    width250,
    margin4and0,
    margin8and0,
    margin16and0,
    fontSize24,
    textAlignRight,
    flexJustifyCenter,
    imageStyle,
    mapContainer,
  } = styles;
  const { history } = props;

  useEffect(() => {
    document.title = "สร้างหอ | Irene";
  }, []);

  const customRequest = (info) => {
    const { onSuccess } = info;
    setTimeout(() => {
      onSuccess();
    }, 1000);
  }

  const removeImage = () => {
    return true;
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

  const renderProvinces = () => {
    return provinces.map((province, index) => (
      <Option key={index} value={province}>{province}</Option>
    ));
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
    const { facility } = values;

    if (!facility) {
      return;
    }

    return (
      <Row style={width250}>
        {renderFacilityItem(facility.includes("fan"), "พัดลม")}
        {
          renderFacilityItem(
            facility.includes("airConditioner"), 
            "เครื่องปรับอากาศ"
          )
        }
        {
          renderFacilityItem(
            facility.includes("waterHeater"), 
            "เครื่องทำน้ำอุ่น"
          )
        }
        {
          renderFacilityItem(
            facility.includes("freeWirelessInternet"), 
            "อินเทอร์เน็ตฟรี"
          )
        }
        {
          renderFacilityItem(
            facility.includes("motorcycleParkingLot"), 
            "ที่จอดรถจักรยานยนต์"
          )
        }
        {
          renderFacilityItem(
            facility.includes("carParkingLot"), 
            "ที่จอดรถยนต์"
          )
        }
        {renderFacilityItem(facility.includes("elevator"), "ลิฟท์")}
      </Row>
    );
  }

  const renderImages = () => {
    if (fileList.length === 0) {
      return (
        <Col span={24} style={flexJustifyCenter}>
          <Empty description="ไม่มีรูป" />
        </Col>
      );
    }

    return fileList.map(file => (
      <img 
        key={file.uid} 
        src={file.thumbUrl} 
        style={imageStyle} 
        alt=""
      />
    ));
  }

  const onCreate = async () => {
    const { 
      name,
      price,
      address,
      description,
      phoneNumber,
      lineId,
      facility,
      province,
      postalCode,
    } = values;

    try {
      setisCreating(true);
      const realEstate = {
        realEstate: {
          name,
          price: Number.parseInt(price),
          address,
          description,
          province,
          postalCode,
        },
        contact: {
          phoneNumber,
          lineId,
        },
        facility: {
          fan: facility.includes("fan"),
          airConditioner: facility.includes("airConditioner"),
          waterHeater: facility.includes("waterHeater"),
          freeWirelessInternet: facility.includes("freeWirelessInternet"),
          motorcycleParkingLot: facility.includes("motorcycleParkingLot"),
          carParkingLot: facility.includes("carParkingLot"),
          elevator: facility.includes("elevator"),
        },
        position: {
          latitude: position.lat,
          longitude: position.lng,
        },
      }

      let token = localStorage.getItem("token");

      let res = await createRealEstate(token, realEstate);

      for (const file of fileList) {
        let formData = new FormData();
        formData.append("image", file.originFileObj);
        addRealEstateImage(token, res.data.id, formData);
      }

      setisCreating(false);
      Modal.success({
        content: "สร้างหอสำเร็จ!",
        onOk: () => history.push("/")
      });
    } catch (error) {
      alert(error.name);
      setisCreating(false);
    }
  }

  const forms = [
    <Form
      {...layout}
      name="basic"
      initialValues={values}
      onFinish={(values) => {
        setValues(values);
        setCurrent(current + 1);
      }}
    >
      <Form.Item
        label="ชื่อหอ"
        name="name"
        rules={[{ required: true, message: "โปรดใส่ชื่อหอ" }]}
      >
        <Input maxLength={63}/>
      </Form.Item>

      <Form.Item
        label="ราคาเช่า"
        name="price"
        rules={[
          { 
            required: true, 
            message: "โปรดใส่ราคาเช่า",
          }, 
          {
            transform: (value) => Number.parseInt(value) || 1,
            max: 16777215,
            type: "integer",
            message: "ราคาเช่าห้ามเกิน 16,777,215 บาท",
            validateTrigger: "onSubmit",
          },
          {
            transform: (value) => Number.parseInt(value) || 1,
            min: 1,
            type: "integer",
            message: "ราคาเช่าห้ามน้อยกว่า 1 บาท",
            validateTrigger: "onSubmit",
          }
        ]}
      >
        <Input 
          type="number" 
          onKeyDown={(e) => {
            if (e.keyCode === 69 || e.keyCode === 110) {
              e.preventDefault();
            }
          }} 
          addonAfter="บาท/เดือน"
          />
      </Form.Item>
      <Form.Item
        label="ที่อยู่"
        name="address"
        rules={[{ required: true, message: "โปรดใส่ที่อยู่" }]}
      >
        <Input.TextArea maxLength={255}/>
      </Form.Item>
      <Form.Item
        label="รหัสไปรษณีย์"
        name="postalCode"
        rules={[
          { 
            required: true, message: "โปรดใส่รหัสไปรษณีย์" 
          },
          {
            pattern: /^[1-9]\d{4}$/,
            message: "รหัสไปรษณีย์ต้องเป็นเลข 5 หลักและห้ามขึ้นต้นด้วย 0",
            validateTrigger: "onSubmit",
          },
        ]}
      >
        <Input maxLength={5}/>
      </Form.Item>
      <Form.Item
        label="จังหวัด"
        name="province"
        rules={[
          { 
            required: true, message: "โปรดเลือกจังหวัด" 
          },
        ]}
      >
        <Select placeholder="เลือกจังหวัด">
          {renderProvinces()}
        </Select>
      </Form.Item>
      <Form.Item
        label="รายละเอียด"
        name="description"
        rules={[{ required: true, message: "โปรดใส่รายละเอียด" }]}
      >
        <Input.TextArea maxLength={1023}/>
      </Form.Item>
      <Form.Item
        label="เบอร์โทรศัพท์"
        name="phoneNumber"
        rules={[
          { required: true, message: "โปรดใส่เบอร์โทรศัพท์" },
          { 
            pattern: /^\d{0,10}$/,
            message: "เบอร์โทรศัพท์ต้องเป็นเลข ไม่มี -",
            validateTrigger: "onSubmit",
          }
        ]}
      >
        <Input maxLength={10}/>
      </Form.Item>
      <Form.Item
        label="ไอดีไลน์"
        name="lineId"
        validateTrigger="onSubmit"
        rules={[{ pattern: /[a-zA-Z0-9]+/, message: "รูปแบบไม่ถูกต้อง"}]}
      >
        <Input addonBefore="@" max={255}/>
      </Form.Item>
      <Form.Item
        label="สิ่งอำนวยความสะดวก"
        name="facility"
      >
        <Checkbox.Group>
          <Checkbox value="fan">พัดลม</Checkbox>
          <br />
          <Checkbox value="airConditioner">เครื่องปรับอากาศ</Checkbox>
          <br />
          <Checkbox value="waterHeater">เครื่องทำน้ำอุ่น</Checkbox>
          <br />
          <Checkbox value="freeWirelessInternet">อินเทอร์เน็ตฟรี</Checkbox>
          <br />
          <Checkbox value="motorcycleParkingLot">ที่จอดรถจักรยานยนต์</Checkbox>
          <br />
          <Checkbox value="carParkingLot">ที่จอดรถยนต์</Checkbox>
          <br />
          <Checkbox value="elevator">ลิฟท์</Checkbox>
        </Checkbox.Group>
      </Form.Item>
      <Form.Item {...tailLayout} style={textAlignRight}>
        <Button type="primary" htmlType="submit">
          ถัดไป
        </Button>
      </Form.Item>
    </Form>,
    <Row gutter={[0, 24]}>
      <Col className="gutter-row" span={24} style={mapContainer}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY }}
          defaultCenter={{
            lat: 13.7245601,
            lng: 100.4930241,
          }}
          defaultZoom={8}
          options={{disableDefaultUI: true,}}
          onClick={({ lat, lng }) => {
            setPositionSelected(true);
            setPosition({lat, lng});
          }}
        >
          {positionSelected && <Marker {...position}text="My Marker"/>}
        </GoogleMapReact>
      </Col>
      <Col 
        className="gutter-row" 
        span={12} 
        onClick={() => setCurrent(current - 1)}
      >
        <Button>ย้อนกลับ</Button>
      </Col>
      <Col
        className="gutter-row"
        span={12} 
        onClick={() => setCurrent(current + 1)} 
        style={textAlignRight}
      >
        <Button 
          type="primary"
          disabled={!positionSelected}
        >
          ถัดไป
        </Button>
      </Col>
    </Row>,
    <Row>
      <Col span={24}>
        <Row>
          <Col span={24} style={margin8and0}>
            <Upload
              listType="picture-card"
              multiple
              showUploadList={{
                showPreviewIcon: false,
                showDownloadIcon: false,
              }}
              fileList={fileList}
              customRequest={customRequest}
              onChange={(info) => {
                setFileList(info.fileList)
              }}
              onRemove={removeImage}
              accept=".jpg,.png"
            >
              <div>
                <PlusOutlined /> 
                <div>อัพโหลด</div>
              </div>
            </Upload>
          </Col>
          <Col span={12} onClick={() => setCurrent(current - 1)}>
            <Button>ย้อนกลับ</Button>
          </Col>
          <Col 
            span={12} 
            onClick={() => setCurrent(current + 1)} 
            style={textAlignRight}
          >
            <Button type="primary">ถัดไป</Button>
          </Col>
        </Row>
      </Col>
    </Row>,
    <Row>
      <Col span={24} style={margin8and0}>
        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="รายละเอียด" key="1">
            <Descriptions bordered>
              <Descriptions.Item label="ชื่อหอ" span={3}>
                {values.name}
              </Descriptions.Item>
              <Descriptions.Item label="ราคา" span={3}>
                {values.price} บาท/เดือน
              </Descriptions.Item>
              <Descriptions.Item label="ที่อยู่" span={3}>
                {values.address}
              </Descriptions.Item>
              <Descriptions.Item label="รายละเอียด" span={3}>
                {values.description}
              </Descriptions.Item>
              <Descriptions.Item label="ติดต่อ" span={3}>
                <div>
                  เบอร์โทรศัพท์: {values.phoneNumber}
                </div>
                <div>
                  ไลน์ไอดี: {values.lineId}
                </div>  
              </Descriptions.Item>
              <Descriptions.Item label="สิ่งอำนวยความสะดวก" span={3}>
                {renderFacility()}
              </Descriptions.Item>
            </Descriptions>
          </TabPane>
          <TabPane tab="แผนที่" key="2">
            <Row style={margin16and0}>
              <Col span={24} style={mapContainer}>
                <GoogleMapReact
                  bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY }}
                  defaultCenter={position}
                  defaultZoom={14}
                  options={{disableDefaultUI: true,}}
                >
                  <Marker {...position}text="My Marker"/>
                </GoogleMapReact>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="รูปภาพ" key="3">
            <Row style={margin16and0}>
              {renderImages()}
            </Row>
          </TabPane>
        </Tabs>
      </Col>
      <Col span={12} onClick={() => setCurrent(current - 1)}>
        <Button>ย้อนกลับ</Button>
      </Col>
      <Col span={12} onClick={onCreate} style={textAlignRight}>
        <Button type="primary" loading={isCreating}>สร้าง</Button>
      </Col>
    </Row>
  ];

  const renderForm = () => {
    return forms[current];
  }

  return (
    <Row justify="center">
      <Col span={12} style={container}>
        <Typography.Title level={3}>
          สร้างหอ
        </Typography.Title>
        <Steps current={current}>
          <Step title="ใส่รายละเอียด" />
          <Step title="ใส่พิกัด" />
          <Step title="เพิ่มรูป"/>
          <Step title="ยืนยัน"/>
        </Steps>
        <div style={formContainer}>
          {renderForm()}
        </div>
      </Col>
    </Row>
  )
}

const styles = {
  marker: {
    position: 'absolute',
    transform: 'translate(-50%, -110%)',
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: "2px",
    boxShadow: "0 1px 4px rgba(0,0,0,.2)",
    padding: "16px 16px",
    margin: "16px 0",
  },
  formContainer: {
    margin: "16px 0",
  },
  width250: {
    width: "250px",
  },
  margin4and0: {
    margin: "4px 0",
  },
  margin8and0: {
    margin: "8px 0",
  },
  fontSize24: {
    fontSize: "24px",
  },
  textAlignRight: {
    textAlign: "right",
  },
  margin16and0: {
    margin: "16px 0",
  },
  flexJustifyCenter: {
    display: "flex", 
    justifyContent: "center",
  },
  imageStyle: {
    margin: 8,
    objectFit: "contain",
    maxWidth: 128,
  },
  mapContainer: {
    height: 600, 
    width: '100%',
  },
}

export default CreateRealEstatePage;
