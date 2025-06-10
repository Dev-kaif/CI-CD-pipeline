# 🚀 GitHub Actions Workflow for EC2 Deployment

This README provides a detailed breakdown of a GitHub Actions workflow designed to automate code deployment to an Amazon EC2 instance via SSH. It also includes a comprehensive guide on GitHub Actions fundamentals, YAML syntax, and common features.

---

## 🛠️ EC2 Deployment Workflow (`.github/workflows/deploy.yml`)

This workflow triggers on pushes to the `main` branch, checks out the code, and then uses SSH to connect to your EC2 instance to pull the latest changes and restart your application via PM2.

```yaml
# This is a GitHub Actions workflow file. Workflow files use YAML syntax.
# They define automated processes (workflows) that run in response to specific events.

# The 'name' keyword provides a user-friendly title for your workflow.
# This name will appear in the 'Actions' tab of your GitHub repository,
# making it easy to identify this specific workflow.
name: Deploy on EC2

# The 'on' keyword specifies the GitHub events that trigger this workflow.
# When any of the listed events occur, the workflow defined in this file will start executing.
on:
  # The 'push' event triggers the workflow when code is pushed to the repository.
  push:
    # 'branches' is a filter for the 'push' event.
    # This workflow will only run if the push occurs on the 'main' branch.
    # You can specify multiple branches (e.g., [main, develop]) or use wildcards.
    branches: [main]

# The 'jobs' keyword defines one or more jobs that make up your workflow.
# Jobs run in parallel by default, but you can configure them to run sequentially.
jobs:
  # 'Deploy' is the unique identifier (ID) for this specific job.
  # This ID is used for internal references and dependencies between jobs.
  Deploy:
    # 'name' provides a user-friendly name for this job.
    # This name will appear in the GitHub Actions UI.
    name: Deploy to EC2
    # 'runs-on' specifies the type of runner (virtual machine) where the job will execute.
    # 'ubuntu-latest' means the job will run on the latest available Ubuntu Linux virtual machine provided by GitHub.
    # Other options include 'windows-latest', 'macos-latest', or self-hosted runners.
    runs-on: ubuntu-latest

    # The 'steps' keyword defines a sequence of tasks that will be executed within this job.
    # Each item under 'steps' (prefixed with a hyphen '-') is a single step.
    steps:
      # This is the first step in the 'Deploy' job.
      - name: Checkout repository # 'name' provides a descriptive title for this step.
        # 'uses' specifies that this step will use a pre-defined GitHub Action.
        # 'actions/checkout@v4' is a popular action that checks out your repository's code
        # onto the runner, making it available for subsequent steps.
        # '@v4' specifies the version of the action to use (important for stability and security).
        uses: actions/checkout@v4

      # This is the second step in the 'Deploy' job.
      - name: Execute remote SSH commands using SSH key # Descriptive name for this step.
        # 'uses' again specifies a pre-defined action.
        # 'appleboy/ssh-action@v1' is a third-party action used to execute SSH commands on a remote server.
        # '@v1' specifies the version of this action.
        uses: appleboy/ssh-action@v1
        # 'with' passes input parameters to the action specified by 'uses'.
        # The keys under 'with' are specific to the action being used.
        with:
          # 'host' is the IP address or hostname of your EC2 instance.
          # In a real-world scenario, this might also be a GitHub Secret for security.
          host: 15.206.189.207
          # 'username' is the SSH user on your EC2 instance (e.g., 'ubuntu', 'ec2-user').
          username: ubuntu
          # 'key' is the private SSH key used for authentication to the EC2 instance.
          # ${{ secrets.SSH_PRIVATE_KEY }} securely retrieves the value of a secret
          # named 'SSH_PRIVATE_KEY' that you must have configured in your GitHub repository settings.
          # Using secrets is crucial for sensitive information like private keys.
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          # 'port' is the SSH port on the EC2 instance, typically 22.
          port: 22
          # 'script' contains the shell commands to be executed on the remote EC2 instance.
          # The '|' (pipe) character indicates a multi-line string literal,
          # where newlines are preserved. Each line below it will be executed sequentially.
          script: |
            # Change directory to your application's root folder on the EC2 instance.
            # Make sure this path '/practice/git-try-act' is correct on your server.
            cd /practice/git-try-act
            # Pull the latest code from the 'main' branch of your repository.
            # This assumes your EC2 instance has Git installed and configured.
            git pull origin main
            # Restart all PM2 processes. PM2 is a process manager for Node.js applications.
            # 'pm2 restart all' will reload your application(s) with the newly pulled code.
            # Ensure PM2 is installed and your app is managed by PM2 on the EC2 instance.
            pm2 restart all
            # Print a confirmation message to the workflow logs.
            echo "Deployment script finished!"
```

---

## 📚 Understanding GitHub Actions: Rules, Syntax, and Features

GitHub Actions is a powerful CI/CD (Continuous Integration/Continuous Delivery) platform that allows you to automate tasks within your software development life cycle. This section will explain the fundamental rules for writing YAML files, common syntax, and special features provided by GitHub.

### 1. YAML Basics for GitHub Actions

GitHub Actions workflows are defined in **YAML** (YAML Ain't Markup Language) files. YAML is a human-readable data serialization standard.

- **Key-Value Pairs**: Data is represented as `key: value`.

  ```yaml
  name: My Workflow
  runs-on: ubuntu-latest
  ```

- **Lists (Sequences)**: Items in a list are denoted by a hyphen (`-`) followed by a space.
  
  ```yaml
  branches:
    - main
    - develop
  ```

- **Mappings (Dictionaries/Objects)**: Key-value pairs grouped together with **indentation**.
  
  ```yaml
  jobs:
    my-job:
      runs-on: ubuntu-latest
  ```

- **Indentation is Crucial**: YAML uses whitespace indentation (spaces, _not_ tabs) to define structure and hierarchy. Consistent indentation is vital. A common convention is 2 spaces per level.
  - **Incorrect:**
  
    ```yaml
    jobs:
    my-job: # ERROR: Incorrect indentation
      runs-on: ubuntu-latest

    ```

  - **Correct:**
  
    ```yaml
    jobs:
      my-job: # Correct indentation
        runs-on: ubuntu-latest

    ```

- **Comments**: Use `#` to denote comments. Anything after `#` on a line is ignored.

### 2. Core Concepts of GitHub Actions

- **Workflow**: An automated, configurable process made up of one or more jobs. Defined in a `.yml` or `.yaml` file in the `.github/workflows/` directory of your repository.
- **Event**: A specific activity in your repository that triggers a workflow run (e.g., `push`, `pull_request`, `issue_comment`, `schedule`).
- **Job**: A set of `steps` that execute on the same `runner`. Jobs run in parallel by default but can be configured to run sequentially (using `needs`).
- **Step**: An individual task within a job. A step can run a command (`run`) or use an `action` (`uses`).
- **Action**: A reusable unit of code. Actions can be written by GitHub (`actions/checkout`), the community, or yourself. They abstract complex operations into simple steps.
- **Runner**: A server that runs your workflow jobs. GitHub provides hosted runners (`ubuntu-latest`, `windows-latest`, `macos-latest`), or you can set up self-hosted runners.

### 3. Workflow Syntax Reference

- **`name`**: (Top-level and for Jobs/Steps) A user-friendly name for your workflow, job, or step.

  ```yaml
  name: My CI Workflow # Workflow name
  jobs:
    build:
      name: Build and Test # Job name
      steps:
        - name: Install Dependencies # Step name
          run: npm install
  ```

- **`on`**: Defines the events that trigger the workflow.

  - `push`, `pull_request`: Triggered on code pushes or pull request activity.
  - `workflow_dispatch`: Allows manual triggering from the GitHub UI.
  - `schedule`: Triggers on a cron schedule.
  - `issue_comment`: Triggers when an issue comment is created.
  - You can specify `branches`, `tags`, `paths` to filter events.

- **`jobs`**: The top-level key to define all jobs in the workflow.

- **`runs-on`**: Specifies the runner environment for a job.

  ```yaml
  runs-on: ubuntu-latest # GitHub-hosted runner
  runs-on: self-hosted # Your own custom runner
  ```

- **`steps`**: The sequence of tasks within a job.

- **`uses`**: Specifies a GitHub Action to use. Actions are fetched from GitHub Marketplace or your repository.

  ```yaml
  - uses: actions/checkout@v4 # Use a specific version for stability
  - uses: actions/setup-node@v3
    with:
      node-version: "16"
  ```

- **`run`**: Executes shell commands. By default, uses Bash on Linux/macOS and PowerShell on Windows.

  ```yaml
  - run: echo "Hello, world!"
  - run: | # Multi-line script
      npm install
      npm test
  ```

- **`with`**: Passes input parameters to an action. The available parameters depend on the action being used.

- **`env`**: Sets environment variables for a workflow, job, or step.

  ```yaml
  env:
    MY_VARIABLE: "some_value" # Workflow level
  jobs:
    build:
      env:
        JOB_VAR: "job_value" # Job level
      steps:
        - name: My Step
          env:
            STEP_VAR: "step_value" # Step level
          run: echo $MY_VARIABLE $JOB_VAR $STEP_VAR
  ```

- **`if`**: Conditionally runs a job or step based on an expression.

  ```yaml
  - name: Run only on successful build
    if: ${{ success() }} # Runs only if previous steps/jobs succeeded
    run: echo "Previous step was successful!"
  ```

- **`needs`**: Defines dependencies between jobs. A job will only run after the jobs listed in `needs` have completed successfully.

  ```yaml
  jobs:
    build: ...
    deploy:
      needs: build # Deploy job will run only after the build job completes
      runs-on: ubuntu-latest
      steps: ...
  ```

### 4. What GitHub Provides: Contexts and Secrets

GitHub Actions provides several built-in contexts and features to access information about the workflow run, repository, environment, and more.

- **`secrets`**:

  - **Purpose**: Securely stores sensitive information (like API keys, SSH private keys, cloud credentials) that your workflows need, without exposing them in your workflow files.
  - **Usage**: Accessed using `secrets.<SECRET_NAME>`.
  - **Configuration**: You define secrets in your GitHub repository settings (**Settings > Secrets and variables > Actions > Repository secrets**). Organization secrets are also available.
  - **Example**: `key: ${{ secrets.SSH_PRIVATE_KEY }}`

- **`github` context**:

  - Provides information about the workflow run, repository, and user.
  - **`github.event`**: The full JSON payload of the event that triggered the workflow. You can access specific properties like `github.event.pull_request.head.ref` or `github.event.issue.number`.
  - **`github.sha`**: The commit SHA that triggered the workflow. Useful for ensuring you're working with a specific code version.
  - **`github.ref`**: The branch or tag ref that triggered the workflow (e.g., `refs/heads/main`, `refs/tags/v1.0.0`).
  - **`github.workflow`**: The name of the workflow.
  - **`github.repository`**: The owner/repository name (e.g., `octocat/hello-world`).
  - **`github.actor`**: The username of the person or app that initiated the workflow.
  - **`github.status`**: This is not a direct context variable but refers to the _status function_ used in `if` conditions to check the outcome of previous steps/jobs.
    - `success()`: True if all previous steps/jobs in the dependency chain succeeded.
    - `always()`: Always runs, regardless of previous status.
    - `failure()`: Runs only if any previous step/job failed.
    - `cancelled()`: Runs only if the workflow was cancelled.
  - **Example Usage**:
  
    ```yaml
    - name: Log Commit SHA
      run: echo "Commit SHA: ${{ github.sha }}"
    - name: Check if Push to Main
      if: ${{ github.ref == 'refs/heads/main' }}
      run: echo "This was a push to main!"
    ```

- **`env` context**:

  - Accesses environment variables set in the workflow, job, or step.
  - **Example**: `run: echo "My variable is: ${{ env.MY_VARIABLE }}"`

- **`runner` context**:

  - Provides information about the runner itself.
  - **`runner.os`**: The operating system of the runner (e.g., `Linux`, `Windows`, `macOS`).
  - **Example**: `run: echo "Running on ${{ runner.os }}"`

- **`inputs` context**:
  - Used when a workflow is triggered by `workflow_dispatch` to access input parameters provided by the user.
  - **Example**: `if: ${{ github.event.inputs.environment == 'production' }}`

### 5. Best Practices for GitHub Actions

- **Use Secrets**: _Always_ use secrets for sensitive data. Never hardcode credentials in your workflow files.
- **Pin Actions to a Version**: Use specific versions of actions (e.g., `actions/checkout@v4`) instead of floating tags (`@latest`). This ensures reproducibility and stability.
- **Descriptive Names**: Use clear `name` attributes for workflows, jobs, and steps to make logs and the GitHub Actions UI easier to understand.
- **Conditional Execution (`if`)**: Use `if` conditions to control when jobs or steps run, saving resources and ensuring logical flow.
- **Concurrency**: For workflows that might run often and modify shared resources (like deployments), use `concurrency` to ensure only one run is active at a time or to cancel older runs.
- **Caching**: Cache dependencies (like `node_modules`) to speed up subsequent workflow runs.
- **Error Handling**: Consider adding steps that run `if: ${{ failure() }}` to send notifications or clean up if a job fails.
- **Separate Concerns**: For complex projects, consider breaking down your CI, CD, and other automations into separate, smaller workflow files for better organization.

---
