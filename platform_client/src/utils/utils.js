export function hasTokenExpired(creation_time) {
    const tokenCreationTime = new Date(creation_time);
    const currentTime = new Date();
    const oneHour = 1000 * 60 * 60;
    return currentTime - tokenCreationTime > oneHour;
}
