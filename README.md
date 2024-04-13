# Catman

## Specification Deliverable

### Elevator pitch

Do you love cats? Do you also love Pacman? The catman application combines both of these into one game. See how long you can play until you are caught by the enemy. Try to beat the high score. Get notified when the current high score gets beat.

### Design

![Catman websitse framework](https://github.com/rachelstans/startup/assets/101438461/6d43f22b-3ea7-465e-b89a-05a84b8241e8)

### Key features

- Secure login over HTTPS
- Recieve a push notification when someone makes the leaderboard in realtime
- Display of timer, game maze, score
- Leaderboard of highest scores is stored
- Ability to control cat and move around with keys

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Uses correct HTML structure for application. Four HTML pages. One for the homepage, one for login, one for the game, and one for the leaderboard.
- **CSS** - Application styling that looks good on different screen sizes, uses good whitespace, color choice and contrast.
- **JavaScript** - Provides login, game display, ability to move with pressing keys
- display other users votes, backend endpoint calls.
- **Service** - Backend service with endpoints for:
  - login
  - retrieving scores
  - recieving new scores
- **DB/Login** - Store users, their scores, and leaderboard in database. Register and login users. Credentials securely stored in database. Can't play unless authenticated.
- **WebSocket** - As a player beats the highscore, other users playing the game receive a push notification telling them this.
- **React** - Application ported to use the React web framework.

## HTML deliverable

For this deliverable I built out the structure of my application using HTML.

- **HTML pages** - Four HTML page that represent the home page and the ability to login and play and see the leaderboard.
- **Links** - The index, play, and leaderboard pages have links to play, home, and leaderboard pages. The login page automatically links to the play page.
- **Text** - The push notification is represented by a textual description.
- **Images** - Currently my maze is an image, but this might change later so I will put another image if I do end up changing it
- **DB/Login** - Input box and submit button for login. The leaderboard represents data pulled from the database.
- **WebSocket** - The push notification on the play page represents in realtime as someone becomes ranked 1 on the leaderboard.

## CSS deliverable

For this deliverable I properly styled the application into its final appearance.

- **Header, footer, and main content body**
- **Navigation elements** - I dropped the underlines and they only appear when hovering. They also brighten when hovered on.
- **Responsive to window resizing** - My app looks great on all window sizes and devices
- **Application elements** - Used good contrast and whitespace
- **Application text content** - Two consistent fonts
- **Application images** - My maze is an image, but will be changed a lot in JavaScript

## JavaScript deliverable

For this deliverable I implemented by JavaScript so that the application works for a single user. I also added placeholders for future technology.

- [x] **login** - When you press the login button it takes you to the play page.
- [x] **database** - Displayed the scores on the leaderboard page. Currently this is stored and retrieved from local storage, but it will be replaced with the database data later.
- [x] **WebSocket** - I used the setInterval function to periodically increase a random score. This will be replaced with WebSocket messages later.
- [x] **application logic** - The ranking number changes based up the user's score.
