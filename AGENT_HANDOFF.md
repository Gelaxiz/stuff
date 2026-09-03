# Nexus School agent handoff

Updated: 2026-09-03

## Runtime

- Checkout: `/home/niilo/.gemini/antigravity/scratch/nexus-school`
- User service: `nexus-school.service`
- Local listener: `127.0.0.1:4990`
- Public host: `https://nequz.gelaxiz.xyz`
- Server entry: `server.mjs`
- Git remote used for delivery: `gelaxiz` (`Gelaxiz/stuff`)

## Current product behavior

- The homepage has an explicit **Open browser / Proxy mode** button plus a globe item in the dock. Both open the local Scramjet page in one click.
- Tab cloak is applied on every visit. `storage/js/auto-cloak.js` restores the saved preset and falls back to the Classroom title/icon when none exists.
- The game catalog is loaded from `storage/json/games.json` and rendered by `storage/js/games-library.js`.
- The library contains 270 unique entries. It includes 115 self-contained MIT HTML5 games under `pages/games/open-arcade/`, each with a dedicated local SVG cover.
- Every catalog entry has a nonblank, existing icon path. Preserve that invariant when adding games.
- Angry Birds 1 uses the restored Angry Birds Chrome HTML5 build through Scramjet; Angry Birds 2 and Epic remain locally available.
- Counter-Strike entries are external browser launchers: CSPSP/CSWEB (2D) and WebXash (requires the player to supply legally owned game files). Do not commit Valve game data.
- All 23 detected Ruffle launch pages load `storage/css/flash-player.css` and `storage/js/flash-player.js`. The shared layer uses `showAll`, forced scaling, full viewport sizing, and letterboxing so Papa's and other Flash games fit without cropping.

## Safety and maintenance

- Keep the ytdlp outbound proxy on port `4970`; port `4990` belongs to Nexus.
- Preserve GET/HEAD-only behavior and path confinement in `server.mjs`.
- When adding games, verify every local catalog URL exists and preserve third-party licenses/attribution.
- Validate desktop and mobile iframe sizing, JSON syntax, the systemd user service, and the public Cloudflare hostname before pushing.
