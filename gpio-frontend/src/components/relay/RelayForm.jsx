const RelayForm = props => {

    const submitHandler = (event) => {
        event.preventDefault();
        console.log('Form submitted');
    }
    return(
        <form onSubmit={submitHandler}>
            <label>Denumire</label>
            <input type="text" />
        </form>
    )
}

export default RelayForm;