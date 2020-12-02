import React, {useState, useEffect} from "react";
import { useHistory, useLocation } from "react-router-dom";
import {Container,Row,Col,Card,Button,Badge} from "react-bootstrap";

import AuthService from "../../services/auth.services";
import UserService from "../../services/user.services";


import NavigationBar from "../Navbar/navbar";
import NewTask from "../model/newTask";
import UserUpdateModel from "../model/userUpdate";
import Task from "../model/Task";
import TaskCard from "../card/taskCard";
import GetBadge from "../card/getBadge";
import "../dashBoard/dashBoard.css";


export default function Board(props) {
  //models
  const [modalShow, setModalShow] = React.useState(false);
  const [taskShow, setTaskShow] = React.useState(false);
  const [userUpdate, setUserUpdateShow] = React.useState(false);
  //tasks
  const [todoTasks, setTodoTasks] = useState([]);
  const [inDevelopmentTasks, setDevTasks] = useState([]);
  const [toBeReviewedTasks, setRevTasks] = useState([]);
  const [finishedTasks, setFinTasks] = useState([]);

  //about board
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [boardName, setBoardName] = useState("");
  const [description, setDescription] = useState("");
  const [newUser, setNewUser] = useState("");

  //NEW task details
  const [taskId, setTaskId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDes] = useState("");
  const [taskUsers, setTaskUsers] = useState([]);
  const [taskStage, setTaskStage] = useState(0);

  const history = useHistory();
  const location = useLocation();
  const boardID = location.pathname.replace("/dashboard/", "").replace("/board", "");

  //get Board Details
  const fetch = async () => {
    await UserService.getBoard(boardID).then(async (response) => {
      const authorized = await AuthService.isLoggedIn();
      if (!authorized) {
        history.push("/login");
      } else {
        console.log(response.data.data);
        setUsers((users) => response.data.data.members);
        setBoardName(response.data.data.name);
        setDescription(response.data.data.description);
        setTaskUsers(response.data.data.members[0]);

        var t = [],
          d = [],
          r = [],
          f = [];
        for (var i in response.data.data.tasks) {
          if (response.data.data.tasks[i].stage === 0)
            t.push(response.data.data.tasks[i]);
          else if (response.data.data.tasks[i].stage === 1)
            d.push(response.data.data.tasks[i]);
          else if (response.data.data.tasks[i].stage === 2)
            r.push(response.data.data.tasks[i]);
          else if (response.data.data.tasks[i].stage === 3)
            f.push(response.data.data.tasks[i]);
        }
        setTodoTasks((todoTasks) => t);
        setDevTasks((inDevelopmentTasks) => d);
        setRevTasks((inDevelopmentTasks) => r);
        setFinTasks((toBeReviewedTasks) => f);
      }
    });
  };

  //Get All users on Platform 
  const getUsers = async () => {
    await AuthService.getUsers().then((data) => {
      var usrs = [];
      for (var i in data.data.message) {
        usrs.push(data.data.message[i].email);
      }
      setAllUsers((allUsers) => usrs);
      setNewUser(usrs[0]);
    });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    getUsers();
    fetch();
  }, []);

  const onSubmit = async () => {
    var usrArr = [];
    usrArr.push(taskUsers);
    await UserService.addtask(
      boardID,
      taskName,
      taskDescription,
      usrArr,
      taskStage
    )
      .then((res) => {
        console.log("Submitted");
      })
      .catch(() => {
        console.log("Got some Error");
      });

    setModalShow(false);
    setBoardName("");
    setDescription("");
    window.location.reload();
  };

  //add users to board
  const onUserUpdate = async () => {
    var data = {
      id: boardID,
      members: [...users, newUser],
    };
    setUsers((users) => [...users, newUser]);
    await UserService.updateBoard(data)
      .then((res) => {
        console.log("Successfull");
      })
      .catch((er) => {
        console.log("Got some Error");
        console.log(er);
      });
  };

  //update Task Details
  const onUpdateTask = async () => {
    var data = {
      id: boardID,
      taskId: taskId,
      name: taskName,
      description: taskDescription,
      stage: taskStage,
      member: newUser,
    };

    console.log(data);
    await UserService.updateTask(data)
      .then((res) => {
        console.log("Successfull");
        window.location.reload();
      })
      .catch((er) => {
        console.log(er);
        console.log("Something Gone Wrong!");
      });
  };

  return (
    <div className="Dashboard">

      {/* Navigation Bar */}
      <NavigationBar user={JSON.parse(localStorage.getItem("user")).name} />

      <div className="Dashboard-header">
        
        {/* Models */}
        <UserUpdateModel
          show={userUpdate}
          onHide={() => setUserUpdateShow(false)}
          users={allUsers}
          user={newUser}
          onChangeUser={(value) => setNewUser(value)}
          onSubmit={() => onUserUpdate()}
        />

        <NewTask
          show={modalShow}
          onHide={() => {
            setModalShow(false);
          }}
          taskName={taskName}
          description={taskDescription}
          stage={taskStage}
          taskUsers={taskUsers}
          users={users}
          onChangeName={(value) => setTaskName(value)}
          onChangeDes={(value) => setTaskDes(value)}
          onChangeStage={(value) => setTaskStage(value)}
          onChangeUser={(value) => setTaskUsers(value)}
          onSubmit={() => onSubmit()}
        />

        <Task
          show={taskShow}
          onHide={() => {
            setTaskShow(false);
            setTaskName("");
            setTaskDes("");
            setTaskStage(0);
          }}
          name={taskName}
          description={taskDescription}
          stage={taskStage}
          taskUsers={newUser}
          users={users}
          onChangeDes={(value) => setTaskDes(value)}
          onChangeStage={(value) => setTaskStage(value)}
          onChangeUser={(value) => setNewUser(value)}
          onSubmit={() => onUpdateTask()}
        />

        {/* Users List*/}
        <Container style={{ marginBottom: "1rem" }}>
          <Card bg="dark" variant="dark" className="text-center">
            <Card.Body>
              <Card.Title>{boardName}</Card.Title>
              <Card.Subtitle>{description}</Card.Subtitle>
              Users:
              {users.map((value) => {
                return GetBadge(value);
              })}
              <Button
                variant="primary"
                onClick={() => {
                  setUserUpdateShow(true);
                }}
              >
                <Badge pill variant="info">
                  {" "}
                  +{" "}
                </Badge>
              </Button>
            </Card.Body>
          </Card>
        </Container>

        {/* Tasks */}
        <Container>
          <Row lg={4}>
            <Col>
              <Button
                variant="primary"
                size="lg"
                block
                onClick={() => {
                  setTaskStage(0);
                  setModalShow(true);
                }}
              >
                TO DO{" "}
                <Badge pill variant="info">
                  {" "}
                  +{" "}
                </Badge>
              </Button>
              {todoTasks.map((value) => {
                return (
                  <div
                    onClick={() => {
                      setTaskId(value._id);
                      setTaskShow(true);
                      setTaskName(value.name);
                      setTaskDes(value.description);
                    }}
                  >
                    {" "}
                    <TaskCard key={value._id} Task={value}></TaskCard>{" "}
                  </div>
                );
              })}
            </Col>
            <Col>
              <Button
                variant="primary"
                size="lg"
                block
                onClick={() => {
                  setTaskStage(1);
                  setModalShow(true);
                }}
              >
                In Development{" "}
                <Badge pill variant="info">
                  {" "}
                  +{" "}
                </Badge>
              </Button>
              {inDevelopmentTasks.map((value) => {
                return (
                  <div
                    onClick={() => {
                      setTaskId(value._id);
                      setTaskShow(true);
                      setTaskName(value.name);
                      setTaskDes(value.description);
                    }}
                  >
                    {" "}
                    <TaskCard key={value._id} Task={value}></TaskCard>{" "}
                  </div>
                );
              })}
            </Col>
            <Col>
              <Button
                variant="primary"
                size="lg"
                block
                onClick={() => {
                  setTaskStage(2);
                  setModalShow(true);
                }}
              >
                To Be Reviewed{" "}
                <Badge pill variant="info">
                  {" "}
                  +{" "}
                </Badge>
              </Button>
              {toBeReviewedTasks.map((value) => {
                return (
                  <div
                    onClick={() => {
                      setTaskId(value._id);
                      setTaskShow(true);
                      setTaskName(value.name);
                      setTaskDes(value.description);
                    }}
                  >
                    {" "}
                    <TaskCard key={value._id} Task={value}></TaskCard>{" "}
                  </div>
                );
              })}
            </Col>
            <Col>
              <Button
                variant="primary"
                size="lg"
                block
                onClick={() => {
                  setTaskStage(3);
                  setModalShow(true);
                }}
              >
                Finished{" "}
                <Badge pill variant="info">
                  {" "}
                  +{" "}
                </Badge>
              </Button>
              {finishedTasks.map((value) => {
                return (
                  <div
                    onClick={() => {
                      setTaskId(value._id);
                      setTaskShow(true);
                      setTaskName(value.name);
                      setTaskDes(value.description);
                    }}
                  >
                    {" "}
                    <TaskCard key={value._id} Task={value}></TaskCard>{" "}
                  </div>
                );
              })}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
