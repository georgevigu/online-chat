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
			console.log("fetching", userId, id);
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
				console.log(user);
				if (user.imageId) {
					fetchProfilePictureById(user.id, user.imageId);
				}
			});
		};

		getAllProfilePictures();
	}, [selectedUserId]);

	console.log("all users", allUsers);

	const fetchAllMessages = async () => {
		try {
			const response = await axios.get(
				`http://localhost:8080/api/v1/message/`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setAllMessages(response.data);
		} catch (error) {
			console.error("Error fetching messages: ", error);
		}
	};

	const handleUserClick = (user) => {
		setSelectedUserId(user.id);
		setTitle(user.firstname + " " + user.lastname);
		fetchAllMessages();
	};

	const handleSendMessage = async () => {
		if (newMessage === "") {
			return;
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
			fetchAllMessages();
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
			/>
			<ChatInfo allUsers={allUsers} selectedUserId={selectedUserId} />
		</div>
	);
}
