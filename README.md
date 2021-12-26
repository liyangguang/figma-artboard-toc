# ToC+

A figma plugin to:
- Generate pages by sections
- Generate table-of-contents of section > page > artboard, with links directly to the item

## Load the plugin manually

This is only needed before the plugin is published, or you want to run a modified local version.

1. Download or clone this repo.
1. Install the desktop version of Figma (web version doesn't support loading local plugins).
1. Open any Figma Design file.
1. Right click anywhere in the working area, `Plugins > Development > Import plugin from manifest`.
1. Select the `manifest.json` file at the root of this repo.
1. Now you can start use it: `Plugins > Development > ToC+`.

## Development

- Main code all under `/src`:
  - `ui.html` for the UI part (with `<style>` and `<script>` inside).
  - All the `.ts` files for the code part.
  - DO NOT modify files under `/dist`, those are generated files, and will be overwritten everytime you compile.
- Bundled using `rollup.js`: (After editing source code, you must run either of these)
  - Compile TS with auto re-run on saving: `npm start`.
  - Compile TS once: `npm build`.
- Final code:
  - compiled under `/dist`
  - `manifest.json`: the Figma Plugin entry point.
