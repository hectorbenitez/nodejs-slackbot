import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Navbar, NavbarBrand, Row, Col, Spinner } from "reactstrap";
import { FaDownload } from 'react-icons/fa';

function Surveys() {
  const [surveys, setSurveys] = useState([]);

  useEffect(async () => {
    const response = await axios.get("/api/v1/surveys");
    const surveys = response.data;

    setSurveys(surveys);
  }, []);


  if(surveys.length === 0) {
    return <Spinner color="primary" />
  }

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/dashboard">Encora Butler</NavbarBrand>
      </Navbar>
      <Container style={{ paddingTop: 20 }}>
        <Row>
          <Col>
            <h3>Surveys</h3>
            <hr></hr>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Survey Name</th>
                  <th>Download Answers</th>
                </tr>
              </thead>
              <tbody>
                {surveys.map((survey) => {
                  return (
                    <tr key={survey._id}>
                      <td>{survey.surveyName}</td>
                      <td>
                        <a href={`/api/v1/surveys/${survey._id}/surveySessions`} target="_blank">
                          <FaDownload/>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Surveys;
