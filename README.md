# odinbook

This is the final project of The Odin Project's NodeJS component.

# Features

- Users can signup for an account with a username and password, as well as login with a correct username and password.

For logged in users:

- Users will see all posts made by them and their friends.
- Users can see how long ago a post or comment was made.
- Users can create posts, and add images to them (disabled currently to reduce upkeep).
- Users can comment on posts, which will be seen by everyone that has access to the post.
- Users can like posts & comments, which will be seen by everyone that has access to the post/comment.
- Users can see a list of all users and their relationship to them (friend, incoming friend request and non-friend).
- Users can send a friend request to users that aren't already friends with them. If accepted, the two users become friends.
- Users can change their profile picture using a URL to an image.

# Project Structure & Reasoning

- Finding posts and other users are done in parallel to save time. [Example code](https://github.com/cbj252/odinbook/blob/main/controllers/mainController.js#L17)
- Posting comments: Check if the comment is valid (comment is not empty). If it is, get the post the comment is made for from, and make the comment only if the post is found. [Example code](https://github.com/cbj252/odinbook/blob/main/controllers/mainController.js#L128)
- Responsive: Uses @media to stack the posts and users on top of one-another on smaller, typically mobile, devices for easier viewing. [Example code](https://github.com/cbj252/odinbook/blob/main/public/stylesheets/position.css)
- Useful functions that are used in multiple areas like validating posts and comments are kept in a separate file to be
  imported when necessary [Example code](https://github.com/cbj252/odinbook/blob/main/controllers/helperFunc.js)

# What I would do if I had more time

- Pressing the like button currently refreshes the page and forces you back to the top of the main page. Potentially refactoring the code so that just the post/comment is updated when the like button is clicked would be beneficial.
- Similarly, if Ann and Bob, two users who are friends, are connected to the website at the same time and Ann likes Bob's post, Bob doesn't see that Ann liked the post until he refreshes the page. Making a post automatically update for all users when a user likes/stops liking the post would be useful.

# Scripts

In the main directory, run:

`npm run start`
Runs the website in a development server.
The program requires a database URL "DB_URL" in .env to function correctly.

`npm run devstart`
Uses nodemon to run the website everytime a change is detected in the file directory.
