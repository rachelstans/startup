# Catman

## Specification Deliverable

### Elevator pitch

Do you love cats? Do you also love Pacman? The catman application combines both of these into one game. See how long you can play until you are caught by the enemy. Try to beat the high score.

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

