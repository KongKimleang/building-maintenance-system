# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


 Git commands 

## **1️⃣ Setup / Configuration**

```bash
git config --global user.name "Your Name"       # Set your Git username
git config --global user.email "you@example.com" # Set your Git email
git config --global core.editor "code --wait"    # Use VS Code as Git editor
git config --global color.ui auto                # Enable color in terminal
```

---

## **2️⃣ Cloning / Initial setup**

```bash
git clone https://github.com/username/repo-name.git   # Clone a repo
cd repo-name                                         # Enter repo folder
git remote -v                                       # Check remote URLs
git remote add origin <url>                          # Add remote if missing
git branch -a                                       # Show all branches
```

---

## **3️⃣ Branching / Switching**

```bash
git branch new-branch-name          # Create a new branch
git checkout new-branch-name        # Switch to a branch
git checkout -b new-branch-name     # Create + switch at once
git branch -d old-branch-name       # Delete local branch
git push origin --delete old-branch # Delete remote branch
```

---

## **4️⃣ Syncing / Updating**

```bash
git pull origin main                # Pull latest changes from main
git fetch origin                    # Fetch updates without merging
git merge origin/main               # Merge fetched changes
git rebase origin/main              # Rebase your changes onto main
```

---

## **5️⃣ Staging / Committing**

```bash
git status                          # See changes
git add file.txt                     # Stage one file
git add .                            # Stage all changes
git commit -m "Your commit message"  # Commit staged changes
git commit -am "Update"              # Add+commit tracked files in one step
```

---

## **6️⃣ Pushing / Sharing**

```bash
git push origin main                # Push commits to main
git push origin new-branch          # Push a branch
git push -u origin new-branch       # Push branch and set upstream
```

---

## **7️⃣ Undo / Fix mistakes**

```bash
git restore file.txt                # Discard changes in a file
git restore .                       # Discard all changes
git reset HEAD file.txt             # Unstage a file
git reset --soft HEAD~1             # Undo last commit, keep changes staged
git reset --hard HEAD~1             # Undo last commit, discard changes
git revert <commit-hash>            # Revert a specific commit safely
```

---

## **8️⃣ Viewing history / logs**

```bash
git log                             # Show commit history
git log --oneline                   # Short history
git log --graph --all --decorate    # Visual graph of branches
git diff                            # Show unstaged changes
git diff --staged                    # Show staged changes
```

---

## **9️⃣ Tagging / Releases**

```bash
git tag v1.0                        # Create a tag
git tag                              # List tags
git push origin v1.0                 # Push a tag
```

---

## **🔟 Advanced / Collaboration**

```bash
git stash                           # Save local changes temporarily
git stash list                      # See stashed changes
git stash apply                     # Reapply stashed changes
git cherry-pick <commit-hash>       # Apply a specific commit to current branch
git remote show origin              # See info about remote
git reflog                           # See all actions in Git history
```
