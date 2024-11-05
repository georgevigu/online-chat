import React from "react";
import blankProfilePicture from "../images/blank-profile-picture.png";

export default function ChatMessages(props) {
	const allMessageElements = props.allMessages
		.filter(
			(message) =>
				(message.senderId === parseInt(props.currentUserId) &&
					message.recipientId === props.selectedUserId) ||
				(message.senderId === props.selectedUserId &&
					message.recipientId === parseInt(props.currentUserId))
		)
		.map((message) => {
			return (
				<>
					<h6
						className={`timestamp ${
							message.senderId === parseInt(props.currentUserId)
								? "timestamp--me"
								: ""
						}`}
					>
						{message.timestamp.slice(11, 16)}
					</h6>
					<div
						className={`message ${
							message.senderId === parseInt(props.currentUserId)
								? "message--me"
								: "message--other"
						}`}
						key={message.id}
					>
						<p>{message.content}</p>
					</div>
				</>
			);
		});

	let image = "";

	props.allUsers.forEach((user) => {
		if (user.id === props.selectedUserId) {
			image = user.image;
		}
	});

	return (
		<div className="chat--messages">
			<div className="chat--messages--title">
				<img
					src={image ? image : blankProfilePicture}
					alt="Profile"
					className="profile-pic"
				/>
				<h2>{props.title}</h2>
			</div>
			<div className="chat--messages--content">
				{allMessageElements}
				<div ref={props.messageEndRef} />
			</div>

			<div className="chat--messages--send">
				<input
					type="text"
					value={props.newMessage}
					onChange={(e) => props.setNewMessage(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							props.handleSendMessage();
						}
					}}
					placeholder="Type your message"
				/>
				<button onClick={props.handleSendMessage}>Send</button>
			</div>
		</div>
	);
}
