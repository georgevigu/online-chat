import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPayload } from "../utils/tokenUtils";

export default function Main() {
	const navigate = useNavigate();
	const [currentUserId, setCurrentUserId] = useState(null);
	const [token, setToken] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setToken(token);
			const decodedToken = getPayload(token);
			setCurrentUserId(decodedToken.id);
		}
	}, []);

	const goToProfile = () => {
		if (token) {
			navigate(`/profile/${currentUserId}`);
		} else {
			navigate("/login");
		}
	};

	const goToChat = () => {
		if (token) {
			navigate(`/chat/${currentUserId}`);
		} else {
			navigate("/login");
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	return (
		<main>
			<div className="menu">
				<h2>You are logged in!</h2>
				<button onClick={handleLogout}>Logout</button>
				<button onClick={goToProfile}>My Profile</button>
				<button onClick={goToChat}>Messages</button>
			</div>
			<div className="feed"></div>
			<div className="profile"></div>
		</main>
	);
}
