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
    document.getElementById('name').innerText = `${username}`;
});