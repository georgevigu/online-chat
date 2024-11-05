import React from "react";
import blankProfilePicture from "../images/blank-profile-picture.png";

export default function ChatList(props) {
	const allUserElements = props.allUsers
		? props.allUsers.map((user, index) => {
				return user.id !== parseInt(props.currentUserId) ? (
					<li>
						<button
							className="chat--list--element"
							key={user.id}
							onClick={() => props.handleUserClick(user)}
						>
							<img
								src={user.image ? user.image : blankProfilePicture}
								alt="Profile"
								className="profile-pic"
							/>
							{user.firstname} {user.lastname}
						</button>
					</li>
				) : (
					""
				);
		  })
		: null;

	return (
		<div className="chat--list">
			<h2>Friends</h2>
			<ul>{allUserElements}</ul>
		</div>
	);
}
