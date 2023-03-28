import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Container, Table, Navbar, NavbarBrand, Row, Col, Spinner } from "reactstrap";
import { FaTrash } from 'react-icons/fa';
import DeleteSessionModal from "../../components/DeleteSessionModal/DeleteSessionModal";

function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({});
  const [deleteModalState, setDeleteModalState] = useState({isOpen: false, session: null})

  useEffect(async () => {
    if(!deleteModalState.isOpen){
      const response = await axios.get("/api/v1/surveySessions");
      const sessions = response.data;

      sessions.sort((a,b)=> a.considerCompleted - b.considerCompleted || a.isCompleted - b.isCompleted);
      setSessions(sessions);

      const completedSessions = sessions.filter(session => session.isCompleted)
      const considerCompletedSessions = sessions.filter(session => session.considerCompleted)
      setStats({
        total: sessions.length,
        completed: completedSessions.length,
        considerCompleted: considerCompletedSessions.length
      })
    }
  }, [deleteModalState]);

  const handlerOnDelete = (session) => {
    setDeleteModalState({
      ...deleteModalState,
      isOpen: true,
      session: session
    })
  }

  if(sessions.length === 0) {
    return <Spinner color="primary" />
  }

  return (
    <div>
      <DeleteSessionModal isOpen={deleteModalState.isOpen} session={deleteModalState.session} closeModal={() => setDeleteModalState({...deleteModalState, isOpen: false})}/>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/dashboard">Encora Butler</NavbarBrand>
        <Link to="/surveys">Surveys</Link>
      </Navbar>
      <Container style={{ paddingTop: 20 }}>
        <Row>
          <Col>
            <h3>Survey Sessions</h3>
            Total: { stats.total } | Considered Complete: { stats.considerCompleted } | Completed: { stats.completed }
            <hr></hr>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Survey</th>
                  <th>Created at</th>
                  <th>Progress</th>
                  <th>Consider <br/> Complete</th>
                  <th>Answers</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => {
                  return (
                    <tr key={session._id}>
                      <td>{session.userName}</td>
                      <td>{session.survey.surveyName}</td>
                      <td>{session.createdAt}</td>
                      <td>
                        {session.isCompleted
                          ? "Completed"
                          : `${Math.round(
                              (session.index * 100) / session.questions.length
                            )}%`}
                      </td>
                      <td>
                        {session.considerCompleted ? "yes": `no`}
                      </td>
                      <th scope="row">
                        <Link to={`surveySessions/${session._id}`}>
                          See Answers
                        </Link>
                      </th>
                      <td><FaTrash style={{color: 'red', cursor: 'pointer'}} onClick={()=> handlerOnDelete(session)}/></td>
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

export default Dashboard;
