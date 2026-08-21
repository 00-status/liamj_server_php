/**
 * KingdomPage | unlisted/kingdom, authenticates with websocket API.
 *      KingdomLobby | create or join lobby. Generate kingdom.
 *      KingdomOverview | GET initial paint of Kingdom. Orchestrate updates to kingdom.
 *           KingdomCanvas
 *           Sidebar
 *               RegionMenu
 *               ProjectMenu
 *               WarMenu
 *
 *
 */
export const KingdomPage = () => {
    // If we are NOT connected to the websocket server and we have not yet received a "kingdom-generated" event.
    //      Render the Lobby
    //          Create new Lobby
    //          Join a Lobby

    // If we receive a "kingdom-generated" event from ws server.
    //      Render KingdomOverview
    return null;
};
