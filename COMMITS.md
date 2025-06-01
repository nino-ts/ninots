# Commit Standards 📜

According to the **[Conventional Commits](https://www.conventionalcommits.org/en)** documentation, semantic commits are a simple convention for commit messages. This convention defines a set of rules for creating an explicit commit history, which facilitates the creation of automated tools.

These commits will help you and your team to easily understand what changes were made in the committed code segment.

This identification occurs through a word and emoji that identifies whether the commit is related to a code change, package update, documentation, visual change, test...

## Type and description 🦄

The semantic commit has the structural elements below (types), which inform the intention of your commit to the user of your code.

- `feat` - Commits of the feat type indicate that your code snippet is including a **new feature** (relates to the MINOR in semantic versioning).

- `fix` - Commits of the fix type indicate that your committed code is **solving a problem** (bug fix), (relates to the PATCH in semantic versioning).

- `docs` - Commits of the docs type indicate that there were **changes in documentation**, such as in the Readme of your repository. (Does not include code changes).

- `test` - Commits of the test type are used when **changes in tests** are made, whether creating, changing, or deleting unit tests. (Does not include code changes)

- `build` - Commits of the build type are used when modifications are made to **build files and dependencies**.

- `perf` - Commits of the perf type are used to identify any code changes that are related to **performance**.

- `style` - Commits of the style type indicate that there were changes related to **code formatting**, semicolons, trailing spaces, lint... (Does not include code changes).

- `refactor` - Commits of the refactor type refer to changes due to **refactorings that do not change functionality**, such as a change in the way a certain part of the screen is processed, but which maintained the same functionality, or performance improvements due to a code review.

- `chore` - Commits of the chore type indicate **task updates** of build, administrator configurations, packages... such as adding a package in gitignore. (Does not include code changes)

- `ci` - Commits of the ci type indicate changes related to **continuous integration**.

- `raw` - Commits of the raw type indicate changes related to configuration files, data, features, parameters.

- `cleanup` - Commits of the cleanup type are used to remove commented code, unnecessary snippets, or any other form of cleaning up source code, aiming to improve its readability and maintainability.

- `remove` - Commits of the remove type indicate the deletion of obsolete or unused files, directories, or functionalities, reducing the size and complexity of the project and keeping it more organized.

## Recommendations 🎉

- Add a type consistent with the content title.
- We recommend that the first line should have a maximum of 4 words.
- To describe in detail, use the commit description.
- Use an emoji at the beginning of the commit message representing the commit.
- Links need to be added in their most authentic form, that is: without link shorteners and affiliate links.

## Commit complements 💻

- **Footer:** information about the reviewer and card number in Trello or Jira. Example: Reviewed-by: Elisandro Mello Refs #133
- **Body:** more precise descriptions of what is contained in the commit, presenting impacts and the reasons why changes were made to the code, as well as essential instructions for future interventions. Example: see the issue for details on typos fixed.
- **Descriptions:** a succinct description of the change. Example: correct minor typos in code

## Emoji patterns 💈

<table>
    <thead>
        <tr>
            <th>Commit type</th>
            <th>Emoji</th>
            <th>Keyword</th>
        </tr>
    </thead>
 <tbody>
        <tr>
            <td>Accessibility</td>
            <td>♿ <code>:wheelchair:</code></td>
            <td></td>
        </tr>
        <tr>
            <td>Adding a test</td>
            <td>✅ <code>:white_check_mark:</code></td>
            <td><code>test</code></td>
        </tr>
        <tr>
            <td>Updating a submodule version</td>
            <td>⬆️ <code>:arrow_up:</code></td>
            <td></td>
        </tr>
        <tr>
            <td>Downgrading a submodule version</td>
            <td>⬇️ <code>:arrow_down:</code></td>
            <td></td>
        </tr>
        <tr>
            <td>Adding a dependency</td>
            <td>➕ <code>:heavy_plus_sign:</code></td>
            <td><code>build</code></td>
        </tr>
        <tr>
            <td>Code review changes</td>
            <td>👌 <code>:ok_hand:</code></td>
            <td><code>style</code></td>
        </tr>
        <tr>
            <td>Animations and transitions</td>
            <td>💫 <code>:dizzy:</code></td>
            <td></td>
        </tr>
        <tr>
            <td>Bugfix</td>
            <td>🐛 <code>:bug:</code></td>
            <td><code>fix</code></td>
        </tr>
        <tr>
            <td>Comments</td>
            <td>💡 <code>:bulb:</code></td>
            <td><code>docs</code></td>
        </tr>
        <tr>
            <td>Initial commit</td>
            <td>🎉 <code>:tada:</code></td>
            <td><code>init</code></td>
        </tr>
        <tr>
            <td>Configuration</td>
            <td>🔧 <code>:wrench:</code></td>
            <td><code>chore</code></td>
        </tr>
        <tr>
            <td>Deploy</td>
            <td>🚀 <code>:rocket:</code></td>
            <td></td>
        </tr>
        <tr>
            <td>Documentation</td>
            <td>📚 <code>:books:</code></td>
            <td><code>docs</code></td>
        </tr>
        <tr>
            <td>Work in progress</td>
            <td>🚧 <code>:construction:</code></td>
            <td></td>
        </tr>
        <tr>
            <td>Interface styling</td>
            <td>💄 <code>:lipstick:</code></td>
            <td><code>feat</code></td>
        </tr>
        <tr>
            <td>Infrastructure</td>
            <td>🧱 <code>:bricks:</code></td>
            <td><code>ci</code></td>
        </tr>
        <tr>
            <td>Ideas list (tasks)</td>
            <td>🔜 <code> :soon: </code></td>
            <td></td>
        </tr>
        <tr>
            <td>Move/Rename</td>
            <td>🚚 <code>:truck:</code></td>
            <td><code>chore</code></td>
        </tr>
        <tr>
            <td>New feature</td>
            <td>✨ <code>:sparkles:</code></td>
            <td><code>feat</code></td>
        </tr>
        <tr>
            <td>Package.json in JS</td>
            <td>📦 <code>:package:</code></td>
            <td><code>build</code></td>
        </tr>
        <tr>
            <td>Performance</td>
            <td>⚡ <code>:zap:</code></td>
            <td><code>perf</code></td>
        </tr>
        <tr>
                <td>Refactoring</td>
                <td>♻️ <code>:recycle:</code></td>
                <td><code>refactor</code></td>
        </tr>
        <tr>
            <td>Code Cleanup</td>
            <td>🧹 <code>:broom:</code></td>
            <td><code>cleanup</code></td>
        </tr>
        <tr>
            <td>Removing a file</td>
            <td>🗑️ <code>:wastebasket:</code></td>
            <td><code>remove</code></td>
        </tr>
        <tr>
            <td>Removing a dependency</td>
            <td>➖ <code>:heavy_minus_sign:</code></td>
            <td><code>build</code></td>
        </tr>
        <tr>
            <td>Responsiveness</td>
            <td>📱 <code>:iphone:</code></td>
            <td></td>
        </tr>
        <tr>
            <td>Reverting changes</td>
            <td>💥 <code>:boom:</code></td>
            <td><code>fix</code></td>
        </tr>
        <tr>
            <td>Security</td>
            <td>🔒️ <code>:lock:</code></td>
            <td></td>
        </tr>
        <tr>
            <td>SEO</td>
            <td>🔍️ <code>:mag:</code></td>
            <td></td>
        </tr>
        <tr>
            <td>Version tag</td>
            <td>🔖 <code>:bookmark:</code></td>
            <td></td>
        </tr>
        <tr>
            <td>Approval test</td>
            <td>✔️ <code>:heavy_check_mark:</code></td>
            <td><code>test</code></td>
        </tr>
        <tr>
            <td>Tests</td>
            <td>🧪 <code>:test_tube:</code></td>
            <td><code>test</code></td>
        </tr>
        <tr>
            <td>Text</td>
            <td>📝 <code>:pencil:</code></td>
            <td></td>
        </tr>
        <tr>
            <td>Typing</td>
            <td>🏷️ <code>:label:</code></td>
            <td></td>
        </tr>
        <tr>
            <td>Error handling</td>
            <td>🥅 <code>:goal_net:</code></td>
            <td></td>
        </tr>
        <tr>
            <td>Data</td>
            <td>🗃️ <code>:card_file_box:</code></td>
            <td><code>raw</code></td>
        </tr>
    </tbody>
</table>

## 💻 Examples

<table>
    <thead>
        <tr>
            <th>Git Command</th>
            <th>Result on GitHub</th>
        </tr>
    </thead>
 <tbody>
        <tr>
            <td>
                <code>git commit -m ":tada: Initial commit"</code>
            </td>
            <td>🎉 Initial commit</td>
        </tr>
        <tr>
            <td>
                <code>git commit -m ":books: docs: README update"</code>
            </td>
            <td>📚 docs: README update</td>
        </tr>
        <tr>
            <td>
                <code>git commit -m ":bug: fix: Infinite loop on line 50"</code>
            </td>
            <td>🐛 fix: Infinite loop on line 50</td>
        </tr>
        <tr>
            <td>
                <code>git commit -m ":sparkles: feat: Login page"</code>
            </td>
            <td>✨ feat: Login page</td>
        </tr>
        <tr>
            <td>
                <code>git commit -m ":bricks: ci: Modification in Dockerfile"</code>
            </td>
            <td>🧱 ci: Modification in Dockerfile</td>
        </tr>
        <tr>
            <td>
                <code>git commit -m ":recycle: refactor: Converting to arrow functions"</code>
            </td>
            <td>♻️ refactor: Converting to arrow functions</td>
        </tr>
        <tr>
            <td>
                <code>git commit -m ":zap: perf: Improved response time"</code>
            </td>
            <td>⚡ perf: Improved response time</td>
        </tr>
        <tr>
            <td>
                <code>git commit -m ":boom: fix: Reverting inefficient changes"</code>
            </td>
            <td>💥 fix: Reverting inefficient changes</td>
        </tr>
        <tr>
            <td>
                <code>git commit -m ":lipstick: feat: CSS styling of the form"</code>
            </td>
            <td>💄 feat: CSS styling of the form</td>
        </tr>
        <tr>
            <td>
                <code>git commit -m ":test_tube: test: Creating new test"</code>
            </td>
            <td>🧪 test: Creating new test</td>
        </tr>
        <tr>
            <td>
                <code>git commit -m ":bulb: docs: Comments about the LoremIpsum() function"</code>
            </td>
            <td>💡 docs: Comments about the LoremIpsum() function</td>
        </tr>
        <tr>
            <td>
                <code>git commit -m ":card_file_box: raw: RAW Data for year yyyy"</code>
            </td>
            <td>🗃️ raw: RAW Data for year yyyy</td>
        </tr>
        <tr>
            <td>
                <code>git commit -m ":broom: cleanup: Removing commented code blocks and unused variables in form validation function"</code>
            </td>
            <td>🧹 cleanup: Removing commented code blocks and unused variables in form validation function</td>
        </tr>
        <tr>
            <td>
                <code>git commit -m ":wastebasket: remove: Removing unused files from the project to maintain organization and continuous updating"</code>
            </td>
            <td>🗑️ remove: Removing unused files from the project to maintain organization and continuous updating</td>
        </tr>
    </tbody>
</table>
