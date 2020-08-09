import React, { useState, useEffect } from "react";
import { Input, FormControl, Modal, makeStyles, Button } from "@material-ui/core";
import Message from "./Message";
import "./App.css";
import firebase from "firebase";
import FlipMove from "react-flip-move";
import SendIcon from "@material-ui/icons/Send";
import { IconButton } from "@material-ui/core";
import db from './firebase';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 200,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {

  const classes = useStyles();
  const auth = firebase.auth();
  const storage = firebase.storage();

  const getTime = () => {
    let currentDate = new Date();
    let dateFormatted = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    return dateFormatted;
  }

  const [modalStyle] = useState(getModalStyle);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState("");
  const [username2, setUsername2] = useState("");
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User has logged in
        console.log(authUser);
        setUser(authUser);

      } else {
        // User has logged out
        setUser(null);
      }

    });
    return () => {
      // perform some cleanup 
      unsubscribe();
    }
  }, [user, username2])

  useEffect(() => {
    db.collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({ id: doc.id, message: doc.data() }))
        );
      });
  }, []);

  // useEffect(() => {
  //   setUsername(prompt("Enter your name: "));
  // }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    db.collection("messages").add({
      message: input,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      currentTime: getTime()
    });
    setInput("");
  };


  const signUp = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username2
        });
      })
      .catch((error) => alert(error.message))

      setPassword('');
      setEmail('');
    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

      setPassword('');
      setEmail('');
    setOpenSignIn(false);
  }

  return (
    <div className="App">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        className="app_modal"
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signupform">
            <center>
              <img
                className="app_image"
                src="https://facebookbrand.com/wp-content/uploads/2018/09/Header-e1538151782912.png?w=100&h=100" />
            </center>
            <Input
              type="text"
              placeholder="username"
              value={username2}
              onChange={(e) => setUsername2(e.target.value)}
            />

            <Input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signUp}>Sign Up</Button>

          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        className="app_modal"
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signupform">
            <center>
              <img
                className="app_image"
                src="https://facebookbrand.com/wp-content/uploads/2018/09/Header-e1538151782912.png?w=100&h=100" />
            </center>
            <Input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signIn}>Sign In</Button>

          </form>
        </div>
      </Modal>

      <img src="https://facebookbrand.com/wp-content/uploads/2018/09/Header-e1538151782912.png?w=100&h=100"></img>

      {user ? (
        <div className="app_loginContainer">
          <Button className="app_signup" onClick={() => auth.signOut()}>Logout</Button>
          <Button className="app_signup" onClick={() => setOpenSignIn(true)}>Sign In</Button>
        </div>
      ) : (
          <div className="app_loginContainer">
            <Button className="app_signup" onClick={() => setOpen(true)}>Sign Up</Button>
          <Button className="app_signup" onClick={() => setOpenSignIn(true)}>Sign In</Button>
          </div>
        )}
      <h1>Welcome {user === null ? '' : user.displayName}</h1>
      {user?.displayName? (
      <form className="app_form">
        <FormControl className="app_formControl">
          <Input
            placeholder="Enter a message and hit enter"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="app_input"
          />

          <IconButton
            type="submit"
            disabled={!input}
            variant="contained"
            color="primary"
            onClick={sendMessage}
            className="app_iconButton"
          >
            <SendIcon />
          </IconButton>
        </FormControl>
      </form>
      ) : (
        <h1>Sorry, you need to Sign Up to message</h1>
      )}
      <FlipMove>
        {messages.map((message) => (
          user?.displayName ? (
            <Message key={message.id} username={user.displayName} message={message} />
          ) : (
            <h1>Sorry, you need to Sign Up to see message</h1>
          )
        ))}
      </FlipMove>

    </div>
  );
}

export default App;
