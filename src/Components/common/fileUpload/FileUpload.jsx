import React, { useState } from 'react';
import s from "./FileUpload.module.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import { updateFileName, updateFileUploadResponse, updateUploadedCsvFile, uploadCsvFile } from '../../../store/features/volunteers';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { ReactSVG } from 'react-svg';
import csvIcon from "../../../assets/svg/csvIcon.svg";
import { toast } from 'react-toastify';


const FileUpload = (props) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();

    const fileName = useSelector((state) => state?.volunteers?.fileName)
    const fileUploadResponse = useSelector((state) => state?.volunteers?.fileUploadResponse);
    const responseMessage = useSelector((state) => state?.volunteers?.responseMessage);
    console.log(responseMessage?.results, "responseMessage");

    const handleUploadVolunteers = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (file && file.type == "text/csv") {
            dispatch(updateFileName(file.name))
            dispatch(uploadCsvFile(file));
        } else if (file.type != "text/csv") {
            toast.error("Please upload a CSV file")
        }
    }

    const onSubmit = () => {
        dispatch(updateFileUploadResponse(false));
        location.reload();
    }



    return (
        <div className={s.inputContainer}>
            {fileName == "" && <ReactSVG src={csvIcon} className={s.icon} />}
            <label htmlFor="fileUpload" className={s.btn}>{fileName || "Upload CSV File"}</label>
            <input type="file" accept='.csv' onChange={handleUploadVolunteers} id="fileUpload" />
            {fileUploadResponse && <Modal
                {...props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={fileUploadResponse}
            >
                <form onSubmit={handleSubmit(onSubmit)} >
                    <Modal.Header>
                        <Modal.Title className={s.title}>Information</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {typeof responseMessage === "string" ? (
                            responseMessage
                        ) : (
                            responseMessage?.inserted_rows === 0 ? (
                                responseMessage?.skipped_results
                            ) : (
                                responseMessage?.skipped_rows === 0 ? (
                                    responseMessage?.inserted_results
                                ) : (
                                    `${responseMessage?.inserted_results} & ${responseMessage?.skipped_results}`
                                )
                            )
                        )}
                    </Modal.Body>
                    <Modal.Footer style={{ display: "flex", justifyContent: "center", gap: '15px' }}>
                        <Button type="submit" className={s.btn2}>
                            Okay
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>}
        </div>
    )
}

export default FileUpload;
