const TitleInput = (props) => {
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
};

export default TitleInput;
