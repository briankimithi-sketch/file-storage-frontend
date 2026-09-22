function MessageBanner({ message, error }) {
    return (
        <>
            {message && (
                <p className="success-message">
                    {message}
                </p>
            )}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}
        </>
    );
}

export default MessageBanner;
