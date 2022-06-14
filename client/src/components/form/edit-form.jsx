import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import * as dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';

import useDomEffect from '../../hooks/useDomEffect';
import useUpdateTimeBlockTitle from '../../hooks/useUpdateTimeBlockTitle';

import '../../stylesheets/modal.css';

dayjs.extend(LocalizedFormat);
dayjs.extend(CustomParseFormat);

function EditForm(props) {
    const { isVisible, id, title, hideForm } = props;
    const [newTitle, setNewTitle] = useState(title);
    const [updateTimeBlockTitle] = useUpdateTimeBlockTitle();

    useEffect(() => {
        setNewTitle(title);
    }, [isVisible, title]);

    const onEdit = () => {
        updateTimeBlockTitle({
            variables: { id, title: newTitle },
        });

        hideForm();
    };

    const titleInput = useRef(null);
    useEffect(() => {
        titleInput.current?.focus();
    }, [isVisible]);

    useDomEffect(
        'keydown',
        (e) => {
            if (!isVisible) {
                return;
            }

            if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                e.preventDefault();
                onEdit();
            }
        },
        [newTitle]
    );

    return (
        <Modal show={isVisible} onHide={hideForm}>
            <Modal.Header closeButton />
            <Modal.Body>
                <div>Please enter new title</div>
                <input
                    ref={titleInput}
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
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

EditForm.propTypes = {
    isVisible: PropTypes.bool,
    id: PropTypes.string,
    title: PropTypes.string,
    hideForm: PropTypes.func,
};

EditForm.defaultProps = {
    isVisible: false,
    id: '',
    title: '',
    hideForm: () => {},
};

export default EditForm;
