import React, { useState, useEffect } from "react";
import { 
  listRealEstate,
  deleteRealEstate,
} from "../../services/realEstateService";
import { 
  Table, 
  Typography, 
  Row, 
  Col,
  Button,
  Modal,
} from "antd";
import dateFormat from "dateformat";
import { 
  FaEdit,
  FaInfo,
  FaTrash,
} from "react-icons/fa";

const { Column } = Table;

const RealEstateListPage = (props) => {
  const { history } = props;
  const [realEstates, setRealEstates] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);

  const { 
    container,
    height100percent,
    flexAlignCenter,
    updateButton,
  } = styles;
  
  const fetchRealEstates = async () => {
    setFetching(true);
    try {
      let res = await listRealEstate((currentPage - 1) * 10);
      setFetching(false);
      setCount(res.data.count);
      setRealEstates(res.data.rows);
    } catch (error) {
      setFetching(false);
      alert(error);
    }
  }

  useEffect(() => {
    document.title = "รายชื่อหอพัก | Irene";
  }, []);

  useEffect(() => {
    fetchRealEstates()
    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const onPageChange = (p, ps) => {
    setCurrentPage(p);
  }

  const onDelete = (reId, reName) => {
    Modal.confirm({
      title: `คุณแน่ใจใช่ไหมว่าต้องการจะลบ ${reName}?`,
      onOk: async () => {
        try {
          await deleteRealEstate(localStorage.getItem("token"), reId);
          fetchRealEstates();
        } catch (error) {
          alert(error);
        }
      }
    })
  }

  return (
    <Row justify="center">
      <Col span={18} style={container}>
        <Typography.Title level={2}>รายชื่อหอพัก</Typography.Title>
        <Table
          emptyText="ไม่มีข้อมูล"
          pagination={{
            onChange: onPageChange,
            hideOnSinglePage: true,
            pageSize: 10,
            total: count,
          }}
          rowKey={(re) => re.id}
          loading={fetching}
          dataSource={realEstates} 
        >
          <Column title="ไอดี" dataIndex="id" key="id"/>
          <Column title="ชื่อหอ" dataIndex="name" key="name"/>
          <Column 
            title="แก้ไขล่าสุด" 
            dataIndex="updatedAt" 
            key="updatedAt" 
            render={(v, r, i) => dateFormat(v, "HH:MM mmmm d, yyyy")}
          />
          <Column 
            title="สร้างเมื่อ" 
            dataIndex="createdAt" 
            key="createdAt"
            render={(v, r, i) => dateFormat(v, "HH:MM mmmm d, yyyy")}
          />
          <Column 
            key="action" 
            render={(v, r, i) => (
              <Row gutter={16}>
                <Col className="gutter-row">
                  <Button 
                    type="primary" 
                    onClick={() => history.push(`real-estate/${r.id}`)}
                  >
                    <Row gutter={8} style={height100percent}>
                      <Col 
                        className="gutter-row" 
                        style={{...flexAlignCenter, ...height100percent}}
                      >
                        <FaInfo size={16} />
                      </Col>
                        ดูรายละเอียด
                      <Col className="gutter-row"></Col>
                    </Row>
                  </Button>
                </Col>
                <Col className="gutter-row">
                  <Button
                    type="primary"
                    onClick={() => history.push(`update/${r.id}`)}
                    style={updateButton}
                  >
                    <Row gutter={8} style={height100percent}>
                      <Col 
                        className="gutter-row" 
                        style={{...flexAlignCenter, ...height100percent}}
                      >
                        <FaEdit size={16} />
                      </Col>
                        แก้ไข
                      <Col className="gutter-row"></Col>
                    </Row>
                  </Button>
                </Col>
                <Col className="gutter-row">
                  <Button 
                    type="danger"
                    onClick={() => onDelete(r.id, r.name)}
                  >
                    <Row gutter={8} style={height100percent}>
                      <Col 
                        className="gutter-row" 
                        style={{...flexAlignCenter, ...height100percent}}
                      >
                        <FaTrash size={16} />
                      </Col>
                        ลบ
                      <Col className="gutter-row"></Col>
                    </Row>
                  </Button>
                </Col>
              </Row>
            )} 
          />
        </Table>
      </Col>
    </Row>
  );
}

const styles = {
  container: {
    marginTop: 24,
  },
  height100percent: {
    height: "100%",
  },
  flexAlignCenter: {
    display: "flex",
    alignItems: "center",
  },
  updateButton: {
    backgroundColor: "#1AAA55", 
    borderColor: "#168F48",
  },
}

export default RealEstateListPage;
