import React from "react";
import blankProfilePicture from "../images/blank-profile-picture.png";

export default function ChatInfo(props) {
	let currentUser = "";

	props.allUsers.forEach((user) => {
		if (user.id === props.selectedUserId) {
			currentUser = user;
		}
	});
	return (
		<div className="chat--info">
			<h2>Info</h2>
			<img
				src={currentUser.image ? currentUser.image : blankProfilePicture}
				alt="Profile"
				className="profile-pic-big"
			/>
			<h3>
				{currentUser.firstname} {currentUser.lastname}
			</h3>
		</div>
	);
}
