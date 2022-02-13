import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import * as dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';
import { useMutation } from '@apollo/client';

import { UPDATE_TIME_BLOCK_TITLE_MUTATION } from '../../queries';
import TitleInput from '../event-form/title-input';

import '../../stylesheets/modal.css';

dayjs.extend(LocalizedFormat);
dayjs.extend(CustomParseFormat);

function EditModal(props) {
    const {
        isVisible, id, title, hideForm
    } = props;
    const [newTitle, setNewTitle] = useState(title);
    const [updateTimeBlockName] = useMutation(UPDATE_TIME_BLOCK_TITLE_MUTATION);

    useEffect(() => {
        setNewTitle(title);
    }, [isVisible, title]);

    const onEdit = () => {
        updateTimeBlockName({
            variables: { id, title: newTitle },
        });

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
                <div>Please enter new title</div>
                <TitleInput
                    titleInput={titleInput}
                    newTitle={newTitle}
                    setTitle={setNewTitle}
                />
                <button className="btn-cancel" onClick={hideForm} type="button">
                    Cancel
                </button>
                <button className="btn-save" onClick={onEdit} type="submit">
                    Save
                </button>
            </Modal.Body>
        </Modal>
    );
}

EditModal.propTypes = {
    isVisible: PropTypes.bool,
    id: PropTypes.string,
    title: PropTypes.string,
    hideForm: PropTypes.func,
};

EditModal.defaultProps = {
    isVisible: false,
    id: '',
    title: '',
    hideForm: () => {},
};

export default EditModal;
