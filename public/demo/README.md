# Packaged video exports

Serve the repository with `python3 server.py`, then open `/demo/`.

- `videos/nbox-15s.mp4` and `videos/nbox-30s.mp4`: the existing completed original-footage exports, copied byte for byte.
- `videos/ai-editor-process.mp4`: a 70-second animated reconstruction of the editing workflow, not an OS screen recording or live model run.
- `../videos/actual-demo-recording.mp4`: the actual 81-second screen recording associated with the supplied YouTube video, converted to H.264/AAC for browser playback.
- `plans/`: saved edit decisions with public placeholder IDs and source filenames.
- `captions/`: English subtitle files.

The two completed output hashes and media checks are recorded in `manifest.json` and `validation.json`.
