import React from "react";
import blankProfilePicture from "../images/blank-profile-picture.png";
import SendIcon from "@mui/icons-material/Send";
import IconButton from "@mui/material/IconButton";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Button from "@mui/material/Button";

export default function ChatMessages(props) {
	console.log(props.allMessages);
	const allMessageElements = props.allMessages.map((message) => {
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
					{message.image ? (
						<img
							src={message.image}
							alt="Message attachment"
							style={{ maxWidth: "200px", borderRadius: "8px" }}
						/>
					) : (
						<p>{message.content}</p>
					)}
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

	const handleImageChange = (e) => {
		props.setImageAttached(true);
		props.setNewMessage(e.target.files[0]);
	};

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
				<label htmlFor="icon-button-file">
					<input
						accept="image/*"
						id="icon-button-file"
						type="file"
						style={{ display: "none" }}
						onChange={handleImageChange}
					/>
					<IconButton
						color="primary"
						aria-label="upload picture"
						component="span"
					>
						<AttachFileIcon />
					</IconButton>
				</label>
				<Button
					variant="contained"
					onClick={props.handleSendMessage}
					endIcon={<SendIcon />}
				>
					Send
				</Button>
			</div>
		</div>
	);
}
