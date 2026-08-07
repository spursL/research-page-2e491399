# Anonymous Supplementary Website

This repository contains a static supplementary website prepared for double-anonymous review.

## Local preview

Run the following command from the repository root:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173/`.

## Anonymous deployment

1. Publish this repository with GitHub Pages from the repository root.
2. Create an anonymized mirror with [Anonymous GitHub](https://anonymous.4open.science/).
3. Enable its **GitHub page** option and use only the generated `/w/` URL in review material.
4. Verify the anonymized page in a signed-out browser before submission.

The source GitHub URL and the original GitHub Pages URL must not appear in the manuscript or supplementary material during review.

## License and attribution

The page structure is adapted from the [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template), distributed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Attribution is retained in the website footer.
