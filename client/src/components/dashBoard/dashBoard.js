import React, { useState,useEffect } from "react";
import { useHistory } from "react-router-dom";
import {Container,Row,Button} from 'react-bootstrap';

import AuthService from "../../services/auth.services";
import UserService from "../../services/user.services";

import NavigationBar from "../Navbar/navbar";
import BoardCard from "../card/card";
import NewBoard from "../modal/newBoard";
import "./dashBoard.css";



export default function DashBoard(props) {
  const history = useHistory();

  const [modalShow, setModalShow] = React.useState(false);
  const [boards, setBoards] = useState([]);
  const [boardName, setBoardName] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  
  //get data and check if user is logged in or not
  const fetch = async () => {
    await UserService.getBoards().then(async (response) => {
      const authorized = await AuthService.isLoggedIn();
      if (!authorized) {
        history.push("/login");
      } else {
        setName(response.data.name);
        setBoards((boards) => response.data.boards);
      }
    });
  };


  const onSubmit = async () => {
    await UserService.createBoard(boardName, description)
      .then((res) => {
        console.log("The Board is Just Created! Enjoy");
      })
      .catch((er) => {
        console.log("Something Went Wrong" + er);
      });

    setModalShow(false);
    setBoardName("");
    setDescription("");
    window.location.reload();
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetch();
  }, []);

  return (
    <div className="DashBoard">
      <NavigationBar user={name} />
      <div className="Dashboard-header">
        <Button
          variant="outline-primary"
          style={{ marginTop: "2%", marginBottom: "1%" }}
          onClick={() => setModalShow(true)}
        >
          Create Board{" "}
        </Button>
        <NewBoard
          show={modalShow}
          onHide={() => setModalShow(false)}
          boardName={boardName}
          description={description}
          onChangeName={(value) => setBoardName(value)}
          onChangeDes={(value) => setDescription(value)}
          onSubmit={() => onSubmit()}
        />
        <Container>
          <Row>
            {boards.map((value) => {
              return <BoardCard key={value._id} board={value} />;
            })}
          </Row>
        </Container>
      </div>
    </div>
  );
}
