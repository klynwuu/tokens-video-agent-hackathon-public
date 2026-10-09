# Video Gaming Agents

**Turn footage into a playable story.** Context Agent → Story cartridge → Video Agent → GAME ON.

This public package contains the architecture deck, a web-hostable editing interface, a sanitized Media Spotlight Story export, the actual recorded demonstration and the completed 15- and 30-second shorts.

## Run locally

```sh
python3 server.py
```

Open http://127.0.0.1:4180/. Python 3 is the only runtime required to preview the packaged demo. `npm start` runs the same server. Use `python3 server.py --port 4181` to change ports.

1. Open **Architecture deck** and play or navigate the eight levels.
2. Open **Editing portal**, inspect the Story context, choose 15 or 30 seconds, and press **ASSEMBLE** to load the corresponding completed MP4.
3. Play the **Actual recorded demo** and both output videos from the home page.

The portal runs entirely in the browser and loads local JSON and MP4 files. It uses the saved edit decisions and packaged outputs, with no private storage, original footage, API key or live model call. It does not create a new render. The actual recording demonstrates the separate local prototype's real media processing. The 70-second process replay is labeled as a reconstruction.

## Host on the web

Publish the contents of `public/` to a static host. The home page, portal, interactive deck, JSON and MP4s use relative paths and also work beneath a repository prefix. The source, local server and repository metadata are outside the served directory. No deployment is performed automatically.

## Contents

| Path | Contents |
| --- | --- |
| `public/index.html` | Unified preview and video gallery |
| `public/frontend/` | Portable frontend plus browser-only demo adapter |
| `public/deck/` | Prebuilt interactive architecture deck |
| `deck/` | Editable React/Remotion deck source and locked dependencies |
| `docs/architecture.md` | Architecture and extraction DAG |
| `docs/frontend-architecture.md` | Static frontend and integration boundary |
| `public/data/ai-data-center.story.json` | Sanitized storage export: 115 ordered items, 114 distinct placeholder assets, latest Story composition |
| `public/data/source-manifest.json` | Five selected source descriptions and timestamped cues; placeholder paths only |
| `public/videos/` | Existing architecture movie and actual recorded demo |
| `public/demo/videos/` | Two completed shorts and the separate process reconstruction |
| `public/demo/plans/` | Sanitized edit decisions |

## Recorded demonstration

[Watch the supplied demonstration on YouTube](https://www.youtube.com/watch?v=URz1e7PPw9Y). A local H.264/AAC copy is provided for offline playback. The recording is approximately 81 seconds. No YouTube account or Studio editing URL is required to view the local copy.

## Sanitization

The Story export is derived from the existing Media Spotlight storage snapshot. All 115 item positions, duplicate references, media dimensions, source time ranges and the latest composition structure are retained. Private asset/Story/item identifiers are replaced with public placeholders. Original filesystem and cloud paths, names, capture dates, cities, linked personal Stories, free-text asset analysis, cover URLs, user ratings, hashes and model usage/evidence telemetry are omitted. Facility and location names in the retained composition are replaced with placeholders. Edit plans use the same placeholder mapping.

Original media and private databases are excluded. The two requested output MP4s retain their exact bytes. The real recording is converted for browser compatibility with container metadata removed; its visible screen content is retained for review.

```sh
python3 scripts/validate.py
```

The validator checks JSON references, output hashes, prohibited personal markers, static paths and excluded files. Starting the local demo does not automatically commit, push, comment or deploy anything.
