import MessageShow from "./MessageShow";

function MessageList() {
    const renderedMessages = messages.map((message) => {
        return <MessageShow />
    })

    return (
        <div>
            {renderedMessages}
        </div>
    )
}

export default MessageList;