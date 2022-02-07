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
  titleInput: PropTypes.string,
  newTitle: PropTypes.string,
  setTitle: PropTypes.func,
};

TitleInput.defaultProps = {
  titleInput: '',
  newTitle: '',
  setTitle: () => {},
};

export default TitleInput;
