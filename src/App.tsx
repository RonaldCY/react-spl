import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks';
import { Button, Grid, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import './App.css';
import { CreateUserDocument, DeleteUserDocument, NotificationDocument, User, UsersDocument } from './generated/graphql';


function App() {
  const [name, setName] = useState<String>("");
  const [id, setId] = useState<String>("");

  const { loading: qLoading, error, data: qData } = useQuery(UsersDocument);
  const [createUser] = useMutation<User>(CreateUserDocument);
  const [deleteUser] = useMutation(DeleteUserDocument);
  const { data: csData } = useSubscription(
    NotificationDocument,
    { variables: { code: "create" } }
  );
  const { data: dsData } = useSubscription(
    NotificationDocument,
    { variables: { code: "delete" } }
  );


  if (qLoading) return (<>Loading...</>);
  if (error) return (<>Error! {error.message}</>);

  return (
    <>
      {qData.users.map((user: User) => (
        <div >
          {user.id} : {user.name}
        </div>
      ))}
      <Grid>
        <TextField value={name} onChange={e => setName(e.target.value)}></TextField>
        <Button variant="contained" onClick={e => {
          e.preventDefault();
          createUser({ variables: { input: { name: name } } });
        }}>Create</Button>
      </Grid>
      <h4>New created: {csData ? csData.notification.name : "creating..."}</h4>
      <Grid>
        <TextField value={id} onChange={e => setId(e.target.value)}></TextField>
        <Button variant="contained" onClick={e => {
          e.preventDefault();
          deleteUser({ variables: { id: id } });
        }}>Delete</Button>
      </Grid>
      <h4>To delete: {dsData ? dsData.notification.id : "deleting..."}</h4>

    </>
  );
}

export default App;
