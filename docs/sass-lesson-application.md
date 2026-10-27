# Sass lessons applied to the D.A.D. homepage

These lessons teach **styling with Sass**, not renaming the Open Coding Society
abbreviation. Their `ocs__*` classes remain intact. The earlier OCS-to-SASS
branding, filename, JavaScript identifier, and API-route replacements have been
reversed; the Python backend needs no rename for this work.

## Lesson mapping

| Lesson | Application |
| --- | --- |
| [CSS to Sass guide](https://pages.opencodingsociety.com/topics/view/sass/guide/?category=sass) | Moved both inline style blocks from `index.html` to `_sass/open-coding/dad-home.scss`; centralized brand variables; registered imports in `_sass/open-coding/_main.scss`. The standalone `layout: none` homepage loads `assets/css/dad-home.scss`, which Jekyll compiles to CSS. |
| [Grids](https://pages.opencodingsociety.com/topics/view/sass/grids/?category=sass) | Deed form uses `ocs__grid ocs__grid--standard cols-2`; every direct child is a cell, the photo spans two columns, and the submit action spans the row. The grid collapses to one column below 40rem. |
| [Containers](https://pages.opencodingsociety.com/topics/view/navigation/sass/containers/lesson/?category=sass) | One `ocs__container` encloses the community-deeds section. Cards group the carousel and submission form; the sign-in notice uses a callout. |
| [Buttons](https://pages.opencodingsociety.com/topics/view/sass/buttons-grammar1/?category=sass) | Actions use semantic buttons and navigation uses links, with `ocs__btn`, `fill`, `outline`, `accent`, `pill`, and `small` modifiers. Shared styles provide focus and disabled states. |
| [Inputs](https://pages.opencodingsociety.com/topics/view/sass/inputs/?category=sass) | Form fields use `ocs__input`, size modifiers, names, associated labels, and required validation. Chat has an accessible name. The upload control remains keyboard accessible. Submission uses a real form. |
| [Toggles](https://pages.opencodingsociety.com/topics/view/sass/toggles/?category=sass) | A labeled `ocs__toggle` checkbox controls slideshow autoplay with a live status output. Reduced motion starts paused; background tabs pause; zero/one-photo carousels disable autoplay. |
| [Typography](https://pages.opencodingsociety.com/topics/view/sass/typography/?category=sass) | Section, chat, modal, and slide titles use heading elements. Supporting text uses paragraphs and shared role classes. Single-underscore typography classes are supported alongside the double-underscore component grammar. |

## Organization and scope

`_sass/open-coding/grammar/` supplies the opt-in shared grammar missing from this
checkout: tokens/mixins, layout, typography, buttons, inputs, and toggles. The
site-wide hub imports it so other pages can reuse it. D.A.D.-specific styles
are scoped to `.dad-home` to avoid changing unrelated lessons or pages.

The editable homepage is `_projects/dad/pages/html/index.html`. The project
build copies it to root `index.html`; keep both in sync.

The prebuilt React files in `assets/dad-site/` are retained. Their editable
React sources are not present in this checkout. This change refactors the
custom homepage carousel, chat, authentication controls, and deed form;
it does not rewrite the bundled React application or every legacy page.

## Verification

- Standalone homepage Sass and the full `_sass/open-coding/_main.scss` hub compile with Ruby Sass 3.7.4.
- `node --test tests/dad-carousel.test.mjs` passes five tests, including a check that the project source matches the generated homepage.
- Homepage module passes Node's JavaScript syntax check.
- Markup checks confirm one container, a semantic form, labels for all deed fields, and no inline styles or style blocks.
- `git diff --check` passes.
- Full `make` completed successfully with Ruby 3.3.13 and GitHub Pages 232; Jekyll built the site and reported server startup.
- Visual/browser validation remains to be done: no connected browser is available in this session.

Before publishing, run `make` in your configured environment. Check `/` at desktop and phone widths, open the
chat and deed modal, tab through the controls, toggle slideshow playback, and
submit a test deed against a development backend.
