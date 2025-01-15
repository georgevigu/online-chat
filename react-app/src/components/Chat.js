import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ChatList from "./ChatList";
import ChatMessages from "./ChatMessages";
import ChatInfo from "./ChatInfo";

export default function Chat() {
	const { userId } = useParams();
	const [token, setToken] = useState("");
	const [allUsers, setAllUsers] = useState([]);
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [newMessage, setNewMessage] = useState("");
	const [title, setTitle] = useState("");
	const [allMessages, setAllMessages] = useState([]);
	const [imageAttached, setImageAttached] = useState(false);
	const messageEndRef = useRef(null);

	const scrollToBottom = () => {
		if (messageEndRef.current) {
			messageEndRef.current.scrollIntoView();
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [allMessages]);

	useEffect(() => {
		if (selectedUserId) {
			fetchConversation();
		}
	}, [selectedUserId]);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setToken(token);
		}

		const fetchAllUsers = async () => {
			try {
				const response = await axios.get(
					`http://localhost:8080/api/v1/user/profile`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setAllUsers(response.data);
			} catch (error) {
				console.error("Error fetching all users: ", error);
			}
		};

		fetchAllUsers();
	}, []);

	useEffect(() => {
		const fetchProfilePictureById = async (userId, id) => {
			try {
				const response = await axios.get(
					`http://localhost:8080/api/v1/image/${id}`,
					{
						responseType: "arraybuffer",
					}
				);

				const base64 = btoa(
					new Uint8Array(response.data).reduce(
						(data, byte) => data + String.fromCharCode(byte),
						""
					)
				);

				setAllUsers((prevUsers) =>
					prevUsers.map((user) =>
						user.id === userId
							? { ...user, image: `data:image/png;base64,${base64}` }
							: user
					)
				);
			} catch (error) {
				console.error("Error fetching profile picture: ", error);
			}
		};

		const getAllProfilePictures = () => {
			allUsers.forEach((user) => {
				if (user.imageId) {
					fetchProfilePictureById(user.id, user.imageId);
				}
			});
		};

		getAllProfilePictures();
	}, [selectedUserId]);

	useEffect(() => {
		const fetchMessageImageById = async (messageId, imageId) => {
			try {
				const response = await axios.get(
					`http://localhost:8080/api/v1/image/${imageId}`,
					{
						responseType: "arraybuffer",
					}
				);

				const base64 = btoa(
					new Uint8Array(response.data).reduce(
						(data, byte) => data + String.fromCharCode(byte),
						""
					)
				);

				setAllMessages((prevMessages) =>
					prevMessages.map((message) =>
						message.id === messageId && !message.image // Prevent re-fetching if already fetched
							? { ...message, image: `data:image/png;base64,${base64}` }
							: message
					)
				);
			} catch (error) {
				console.error("Error fetching message image: ", error);
			}
		};

		const getAllMessageImages = () => {
			allMessages.forEach((message) => {
				if (message.imageId && !message.image) {
					// Only fetch if imageId exists and the image hasn't been fetched yet
					fetchMessageImageById(message.id, message.imageId);
				}
			});
		};

		getAllMessageImages();
	}, [allMessages]); // Dependency array only includes allMessages

	const fetchConversation = async () => {
		if (!selectedUserId) return;
		try {
			const response = await axios.get(
				`http://localhost:8080/api/v1/message/by-users`,
				{
					params: {
						senderId: userId,
						recipientId: selectedUserId,
					},
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const messages = response.data.map((message) => ({
				id: message.id,
				content: message.content,
				timestamp: message.timestamp,
				senderId: message.sender.id,
				recipientId: message.recipient.id,
				imageId: message.imageId,
			}));
			setAllMessages(messages);
		} catch (error) {
			console.error("Error fetching messages: ", error);
		}
	};

	const handleUserClick = (user) => {
		setSelectedUserId(user.id);
		setTitle(user.firstname + " " + user.lastname);
	};

	const handleUpload = async () => {
		const formData = new FormData();
		formData.append("image", newMessage);
		formData.append("senderId", userId);
		formData.append("recipientId", selectedUserId);
		setImageAttached(false);

		try {
			const response = await axios.post(
				`http://localhost:8080/api/v1/image/upload/message`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			console.log("Image uploaded successfully:", response.data);
			fetchConversation();
		} catch (error) {
			console.error("Error uploading image:", error);
		}
	};

	const handleSendMessage = async () => {
		if (newMessage === "" && !imageAttached) {
			return;
		}
		if (imageAttached) {
			handleUpload();
		}
		setNewMessage("");
		try {
			const response = await axios.post(
				"http://localhost:8080/api/v1/message/send",
				{
					senderId: parseInt(userId),
					recipientId: parseInt(selectedUserId),
					content: newMessage,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log("Message sent:", response.data);
			setNewMessage("");
			fetchConversation();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="chat">
			<ChatList
				currentUserId={userId}
				allUsers={allUsers}
				handleUserClick={handleUserClick}
			/>
			<ChatMessages
				handleSendMessage={handleSendMessage}
				currentUserId={userId}
				selectedUserId={selectedUserId}
				title={title}
				messageEndRef={messageEndRef}
				allMessages={allMessages}
				newMessage={newMessage}
				setNewMessage={setNewMessage}
				allUsers={allUsers}
				imageAttached={imageAttached}
				setImageAttached={setImageAttached}
			/>
			<ChatInfo
				allUsers={allUsers}
				selectedUserId={selectedUserId}
				allMessages={allMessages}
			/>
		</div>
	);
}
