# Anonymous Project Page Maintenance Guide

This repository is the canonical source for the static project page used during double-anonymous review. The `main` branch is the live deployment branch. Every push to `main` can become publicly visible through GitHub Pages and, after synchronization, through Anonymous GitHub.

Do not upload the full research workspace, paper source directory, internal documents, raw datasets, or unreviewed media to this repository. Copy only the files required by the webpage after checking them for identifying information.

## 1. Set up the repository on a new computer

Install Git and the GitHub CLI, then authenticate:

```bash
gh auth login
gh auth setup-git
```

Clone the repository using the URL shown on its GitHub page. A shallow clone is recommended because the repository contains videos:

```bash
git clone --depth 1 https://github.com/OWNER/REPOSITORY.git CAST_anonymous_site
cd CAST_anonymous_site
```

Configure an anonymous commit identity for this repository only:

```bash
git config --local user.name "Anonymous"
git config --local user.email "anonymous@users.noreply.github.com"
```

Confirm the configuration:

```bash
git config --local --get user.name
git config --local --get user.email
git remote -v
```

Expected commit identity:

```text
Anonymous
anonymous@users.noreply.github.com
```

## 2. Start every update from the latest version

Before editing, make sure the working tree is clean and retrieve the latest deployed version:

```bash
git status --short --branch
git pull --ff-only
```

If `git status` reports changes that you do not recognize, inspect them before continuing. Do not overwrite or stage unrelated work.

## 3. Edit webpage content

The main webpage is `index.html`. Styles, scripts, posters, figures, and videos are referenced with relative paths.

For text-only changes:

1. Edit `index.html`.
2. Preserve the existing section hierarchy and academic presentation style.
3. Keep the abstract, title, tables, and claims consistent with the submitted manuscript.

For media changes:

1. Copy only the approved image or video into this repository.
2. Prefer a new filename, such as `demo_0808_v2.mp4`, to avoid stale browser caches.
3. Update the corresponding `src`, `data-src`, or `poster` path in `index.html`.
4. Check that the filename capitalization matches exactly; GitHub Pages paths are case-sensitive.
5. Remove the old deployed file only after confirming that it is no longer referenced and that a source copy exists elsewhere.

Check whether an old filename is still referenced:

```bash
rg -n 'old_filename\.mp4' index.html assets
```

If there are no references and a separate source copy exists, remove the old deployed file with:

```bash
git rm old_filename.mp4
```

Git history retains previously committed files. Never commit sensitive or identifying material with the intention of deleting it later.

## 4. Prepare videos for web playback

Recommended video properties:

- MP4 container
- H.264 video
- `yuv420p` pixel format
- consistent 16:9 aspect ratio
- less than 100 MB per file
- MP4 metadata placed at the beginning of the file (`faststart`)

Inspect a video:

```bash
ffprobe -v error \
  -select_streams v:0 \
  -show_entries stream=codec_name,width,height,pix_fmt \
  -show_entries format=duration,size:format_tags \
  -of default=noprint_wrappers=1 \
  input.mp4
```

Move MP4 metadata to the beginning without re-encoding or reducing quality:

```bash
ffmpeg -i input.mp4 \
  -map 0 -c copy -map_metadata -1 \
  -movflags +faststart \
  output_for_web.mp4
```

Use `output_for_web.mp4` in the deployment repository. Keep the original media in the separate research workspace.

## 5. Preview locally

From the repository root, start a local HTTP server:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/` in a browser. Use another terminal for validation commands, or stop the server with `Ctrl+C` when finished.

Check at least the following:

- the page loads without console errors;
- all section links work;
- images and posters load;
- every changed video plays;
- video cards retain consistent dimensions;
- tables remain readable on desktop and mobile widths;
- no author, affiliation, laboratory, company, or contact information is visible.

## 6. Double-anonymous preflight check

During review, the webpage and every uploaded asset must remain anonymous. Do not add:

- author names or affiliations;
- laboratory or institutional logos;
- email addresses or acknowledgments;
- funding information;
- personal websites, identifiable cloud-storage links, or the source GitHub URL;
- public paper, arXiv, code, or dataset links that reveal authorship;
- local filesystem paths;
- identifying metadata in PDFs, images, or videos.

Search using the actual private terms that must not appear:

```bash
rg -n -i \
  'AUTHOR_NAME|INSTITUTION_NAME|EMAIL_ADDRESS|GITHUB_USERNAME|/home/|C:\\Users\\' \
  --glob '*.html' --glob '*.md' --glob '*.css' \
  --glob '*.js' --glob '*.txt' .
```

Replace the uppercase placeholders with real terms before running the command. No output is the expected result.

Inspect the exact pending changes:

```bash
git status --short
git diff --check
git diff
```

For new media, inspect metadata with `ffprobe` and, when available, `exiftool`:

```bash
exiftool -Author -Creator -Artist -Comment -Description new_asset
```

## 7. Commit only the intended files

Stage explicit paths. Do not use `git add .` or `git add -A` in this repository.

```bash
git add index.html path/to/new_image.jpg new_video.mp4
git status --short
git diff --cached --check
git diff --cached --stat
```

Confirm the commit identity before committing:

```bash
git config --local --get user.name
git config --local --get user.email
```

Commit and push directly to `main`, which is the established deployment branch:

```bash
git commit -m "Update project page"
git push origin main
```

## 8. Publish and refresh the anonymous page

After pushing:

1. Wait for the GitHub Pages build to complete.
2. Confirm that the new page and changed media return successfully.
3. Open the [Anonymous GitHub dashboard](https://anonymous.4open.science/dashboard).
4. Find anonymization ID `10e5e9997807` and select **Refresh**.
5. Wait until its status returns to **Ready**.
6. Open the anonymous page in a signed-out or private browser window and perform a hard refresh.

Review URL:

```text
https://anonymous.4open.science/w/10e5e9997807/
```

The review URL stays unchanged after normal content updates. Only this `/w/` URL should appear in review material. Do not include the source repository URL, the original GitHub Pages URL, or the Anonymous GitHub `/status/` URL in the manuscript.

If **Auto update** is enabled, Anonymous GitHub may update automatically, but synchronization can take up to approximately one hour. Manual **Refresh** is preferred after a verified Pages deployment.

## 9. Roll back a bad deployment

Do not force-push or rewrite history. Find the problematic commit and create a normal revert commit:

```bash
git log --oneline -n 10
git revert BAD_COMMIT_SHA
git push origin main
```

Wait for GitHub Pages to rebuild, then refresh the Anonymous GitHub project again.

## 10. Final checklist for every update

- [ ] Started from the latest `main` branch.
- [ ] Modified only the canonical deployment repository.
- [ ] Copied only required and reviewed assets.
- [ ] Used new media filenames where appropriate.
- [ ] Previewed the page locally.
- [ ] Verified every changed video and image.
- [ ] Checked file paths and capitalization.
- [ ] Scanned HTML, text, and media metadata for identifying information.
- [ ] Confirmed the anonymous Git commit identity.
- [ ] Staged only explicit files.
- [ ] Pushed to `main` successfully.
- [ ] Waited for GitHub Pages to finish.
- [ ] Refreshed Anonymous GitHub only after Pages was correct.
- [ ] Tested the final `/w/` link in a signed-out browser.

## After acceptance

The restrictions above apply during double-anonymous review. After acceptance and completion of the review process, prepare a separate public release update that can add author names, affiliations, acknowledgments, the official paper, code, and dataset links. Do not reveal these details early in the anonymous deployment.

## License and attribution

The page structure is adapted from the [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template), distributed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Attribution is retained in the website footer.
