# Expo Line Login
## Installation
```bash
npx expo install expo-line-login
```
## Prerequisites
- Please create a Line Login channel and get the channel ID from [Line Developer Console](https://developers.line.biz/console/).
- Please add your app schema and package name into the "App settings" fields in the "LINE Login" section of the [Line Developer Console](https://developers.line.biz/console/).
- Please add the following config in your app.json
```json
{
  "expo": {
    "plugins": [
      [
        "expo-line-login", {
          "channelId": "YOUR_CHANNEL_ID", // repleace with your channel ID
        }
      ]
    ]
  }
}
```

## Usage
### Login
```js
import { 
  login,
  LoginPermission,
  BotPrompt,
} from 'expo-line-login';

const result = await login({
  [
    LoginPermission.PROFILE,
    LoginPermission.OPEN_ID,
    LoginPermission.EMAIL,
  ],
  BotPrompt.NORMAL,
});
console.log(result);
```

### Get Profile
```js
import { getProfile } from 'expo-line-login';

const profile = await getProfile();
console.log(profile);
```

### Logout
```js
import { logout } from 'expo-line-login';

await logout();
```

### Get Access Token
```js
import { getAccessToken } from 'expo-line-login';

const accessToken = await getAccessToken();
console.log(accessToken);
```

### Get Friendship Status
```js
import { lineGetBotFriendshipStatus } from 'expo-line-login';

const friendshipStatus = await lineGetBotFriendshipStatus();
console.log(friendshipStatus);
```