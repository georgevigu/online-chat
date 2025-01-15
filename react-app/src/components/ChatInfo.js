import React from "react";
import blankProfilePicture from "../images/blank-profile-picture.png";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

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
			<h4 style={{ alignSelf: "flex-start" }}>Shared content</h4>
			<ImageList sx={{ width: 300, height: 450 }} cols={3} rowHeight={164}>
				{props.allMessages
					.filter((item) => item.imageId !== null && item.imageId !== undefined) // Ensure imageId exists and is not null or undefined
					.map((item) => (
						<ImageListItem key={item.imageId}>
							<a href={item.image} target="_blank" rel="noopener noreferrer">
								<img
									src={item.image}
									alt="Message attachment"
									loading="lazy"
									style={{
										maxWidth: "100%",
										maxHeight: "100%",
										objectFit: "contain",
									}}
								/>
							</a>
						</ImageListItem>
					))}
			</ImageList>
		</div>
	);
}
