import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import * as dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';
import { useMutation } from '@apollo/client';

import '../../stylesheets/modal.css';
import { TIMEBLOCKS_QUERY, DELETE_TIME_BLOCK_MUTATION } from '../../queries';

dayjs.extend(LocalizedFormat);
dayjs.extend(CustomParseFormat);

function DeleteModal(props) {
    const { isVisible, id, hideForm } = props;

    const [deleteTimeBlock] = useMutation(DELETE_TIME_BLOCK_MUTATION, {
        refetchQueries: [TIMEBLOCKS_QUERY],
    });

    const onDelete = () => {
        deleteTimeBlock({
            variables: { id },
        });

        hideForm();
    };

    const onCancel = () => {
        hideForm();
    };

    const titleInput = useRef(null);
    useEffect(() => {
        titleInput.current?.focus();
    }, [isVisible]);

    return (
        <Modal show={isVisible} onHide={hideForm}>
            <Modal.Header closeButton />
            <Modal.Body>
                <div>Are you sure you want to delete?</div>
                <button className="btn-cancel" onClick={onCancel} type="button">
                    Cancel
                </button>
                <button className="btn-save" ref={titleInput} onClick={onDelete} type="submit">
                    Delete
                </button>
            </Modal.Body>
        </Modal>
    );
}

DeleteModal.propTypes = {
    isVisible: PropTypes.bool,
    id: PropTypes.string,
    hideForm: PropTypes.func,
};

DeleteModal.defaultProps = {
    isVisible: false,
    id: '',
    hideForm: () => {},
};

export default DeleteModal;
