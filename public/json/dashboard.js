// recup des tokens
const fragment = new URLSearchParams(window.location.hash.slice(1));
const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];

// token pour requetes
let secretUser = `${tokenType} ${accessToken}`

// recup des infos de l'user ( pdp pseudo ect )
fetch('https://discord.com/api/users/@me', {
    headers: {
        authorization: `${secretUser}`,
    },
})
.then(result => result.json())
.then(response => {
    const { username, discriminator, avatar, id } = response;

    // injection html du pseudo de l'user
    document.getElementById('user-name').innerText = `${username}`;

    // injection de l'avatar de l'user
    const userAvatar = document.getElementById('user-avatar');
    userAvatar.src = `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;
    userAvatar.alt = 'Avatar';
});
