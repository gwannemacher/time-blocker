import React from 'react';
import PropTypes from 'prop-types';

function TitleInput(props) {
    const { titleInput, newTitle, setTitle } = props;

    return (
        <input
            ref={titleInput}
            type="text"
            placeholder="Add title"
            value={newTitle}
            onChange={(e) => setTitle(e.target.value)}
        />
    );
}

TitleInput.propTypes = {
    titleInput: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    newTitle: PropTypes.string,
    setTitle: PropTypes.func,
};

TitleInput.defaultProps = {
    titleInput: { current: {} },
    newTitle: '',
    setTitle: () => {},
};

export default TitleInput;
