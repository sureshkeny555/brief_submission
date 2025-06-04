import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import s from "./DeleteConfirmationPopup.module.scss";
import { deleteVolunteer, updateIsDeleteVolunteers } from '../../../store/features/volunteers';


function DeleteConfirmationPopup(props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch()
  const password = watch("password");

  const isDeleteVolunteers = useSelector((state) => state?.volunteers?.isDeleteVolunteers);
  const selectedVolunteers = useSelector((state) => state?.volunteers?.selectedVolunteers);



  const handleClose = () => {
    dispatch(updateIsDeleteVolunteers(false))
  }

  const onSubmit = () => {
    if (selectedVolunteers) {
      dispatch(deleteVolunteer(selectedVolunteers));
    } else {
      dispatch(deleteVolunteer());
    }
    
  }

  return (
    <>
      <Modal
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={isDeleteVolunteers}
        onHide={handleClose}
      >
        <form onSubmit={handleSubmit(onSubmit)} >
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>
           <div>
             Are you sure want to delete ?
           </div>
          </Modal.Body>
          <Modal.Footer style={{ display: "flex", justifyContent: "center", gap: '15px' }}>
            <Button onClick={handleClose} className={s.btn}>
              No
            </Button>
            <Button type="submit" className={s.btn2}>
              Yes
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

    </>
  );
}

export default DeleteConfirmationPopup;
