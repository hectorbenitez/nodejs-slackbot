import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from "axios";

const DeleteSessionModal = ({
  isOpen,
  session,
  closeModal,
}) => {

  const confirmDelete = async () => {
    try{
      const response = await axios.delete(`/api/v1/surveySessions/${session._id}`);
      console.log("response====", response);
      closeModal();
    }catch(e){
      console.log("error====", e);
    }
    closeModal();
  };

  if(!session){
    return null;
  }
  return (
    <Modal isOpen={isOpen} toggle={closeModal}>
      <ModalHeader toggle={closeModal}>Delete session</ModalHeader>
      <ModalBody>
        <span>Are you sure you want to delete session </span>
        <b>{session.survey.surveyName} </b>
        <span>from </span>
        <b>{session.userName}</b>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={confirmDelete}>Confirm</Button>
        {' '}
        <Button color="secondary" onClick={closeModal}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
}

export default DeleteSessionModal;