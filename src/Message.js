import React, { forwardRef } from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./Message.css";
import DeleteIcon from '@material-ui/icons/Delete';
import db from "./firebase";


const Message = forwardRef(({username, message }, ref) => {
  const isUser = username === message.message.username;
  const isInfo = message.message.username === 'Info';

  return (
    <div ref={ref} className={`message ${isUser && "message_user"}`}>
      <Card className={isUser ? "message_userCard" : isInfo ? "message_infoCard" : "message_guestCard"}>
        <CardContent>
        <Typography color="textSecondary" gutterBottom>
        {!isUser && `${message.message.username || 'Unknown User'}`} 
        </Typography>
          <Typography color="white" variant="h5" component="h2">
            {message.message.message}
            {isUser ? <DeleteIcon onClick={
              (event) => db.collection('messages').doc(message.id).delete()
            }/>: ''}
          </Typography>
          <Typography color="textSecondary" style={isUser ? {color: "white"}: {}} gutterBottom>
            {message.message.currentTime}
        </Typography>
        </CardContent>
      </Card>
    </div>
  );
});

export default Message;
