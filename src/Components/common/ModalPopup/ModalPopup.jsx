import React from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import cx from "classnames";
import { useForm } from 'react-hook-form';
import s from "./ModalPopup.module.scss";
import { approveRequest, updateIsApprove } from '../../../store/features/reports';
import { approveRequestDist, updateIsApproveDist } from '../../../store/features/distributors';

function ModalPopup(props) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm();

    const { reqMsg } = props

    const dispatch = useDispatch()

    const isApprove = useSelector((state) => state?.reports?.isApprove);
    const isApproveDist = useSelector((state) => state?.distributors?.isApprove);


    const handleClose = () => {
        dispatch(updateIsApprove(false));
        dispatch(updateIsApproveDist(false))
    }

    const onSubmit = () => {
        if (isApprove) {
            dispatch(approveRequest());

        } else {
            dispatch(approveRequestDist());
        }
    }


    return (
        <>
            <Modal
                {...props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={isApprove || isApproveDist}
                onHide={handleClose}
            >
                <form onSubmit={handleSubmit(onSubmit)} >
                    <Modal.Header closeButton>
                        <Modal.Title className={s.title}>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            {reqMsg}
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

export default ModalPopup;
