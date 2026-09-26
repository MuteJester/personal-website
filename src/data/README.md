# Site content

Everything shown on the site comes from the YAML files in this folder. Each file is one entry; the schema for every collection is in `src/content.config.ts`, and a file that does not match its schema fails the build with the file and field named.

| Folder          | One file per…                     | Shown on                                   |
|-----------------|-----------------------------------|--------------------------------------------|
| `profile/`      | (single file) name, bio, links    | home, footer, CV header, metadata          |
| `research/`     | research interest                 | Research                                   |
| `publications/` | paper or preprint                 | Publications, home (if `selected`), CV, PDF|
| `patents/`      | patent or application             | home, CV, PDF                              |
| `talks/`        | talk, poster or demo              | Talks & Posters, CV, PDF                   |
| `awards/`       | fellowship, scholarship or award  | CV, PDF                                    |
| `service/`      | reviewing or organizing role      | CV, PDF                                    |
| `education/`    | degree                            | CV, PDF, timeline chart                    |
| `experience/`   | position (research/teaching/industry) | CV, PDF, timeline chart               |
| `projects/`     | software package                  | Software, home (if `featured`), Research   |

## Adding an entry

1. Copy the matching file from `_templates/` into the collection folder.
2. Name it `YYYY-short-title.yaml` (publications and talks) or a short slug (everything else). The file name is the entry's id, used for anchors and cross-references.
3. Fill in the fields. Optional fields can be deleted.
4. Run `npm run build` (or `npm run check`) to validate. The CV PDF regenerates automatically on deploy.

## Conventions

- Author lists use full names; the site bolds the exact string "Thomas Konstantinovsky".
- Joint first authorship: set `equalContribution: true` and `equalContributors` to how many leading authors share it.
- `status` on publications: `published` (default), `preprint`, or `in-preparation` (shown without links or citation).
- Dates are ISO (`2026-06-15`). For talks with only a year known, set `yearOnly: true`.
- Cross-references use ids: `research/*.yaml` lists publication and project ids; `projects/*.yaml` may name a `paper` id.
- Keep amounts out of award entries. Never use em dashes in copy.
