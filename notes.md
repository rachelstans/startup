# Notes

### Adding, Commiting, Pushing, and Pulling

All of these can be done in the development environment or GitHub

- Adding: adds a change (or changes) that you want to commit to staging
    - this is important bc say you make 5 changes but only want to commit the 2nd and last change bc they r related, then u could use this add feature by hitting the + button and only adding the 2nd and 5th changes to staged
- Commiting: is similar to saving an edited file and you need to include a commit message that briefly describes the changes you made
> Git assigns each commit a unique ID, called a SHA or hash, that identifies:
>   - The specific changes
>   - When the changes were made
>   - Who created the changes
- Pushing: pushes the commits to GitHub
- Pulling: pull changes made to the project in GitHub to VS code

### Conflicts

- conflicts occur when at least 2 different changes are made to the same line of code that are trying to be pushed to GitHub
    - this can be resolved my merging the changes together
    - through vs code there is a nifty merge feature that nicely highlights the differences to make it easier to combine the changes together


### Forks

- provides the ability to create a copy of a GitHub repository of an open source code base that you want to experiment with, or contribute to
- clones it to GitHub

## AWS & EC2

- http://3.222.95.1/
    - my web server

use this to remote shell into my server
>ssh -i cs260.pem ubuntu@katman.click

- because i have an elastci ip address associated with my server's ip address, it won't change even if I need to reboot my server
- using one isn't necessary, but if I ever stop or reboot my server the ip address will change
    - keeping the ip consistent matters so I and others can access my webpage at the same place everytime
