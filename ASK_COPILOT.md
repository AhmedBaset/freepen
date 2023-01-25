# How to make aliases for git add, commit, push, pull, and status

# 1. Open your .bash_profile file in your text editor.
# 2. Add the following lines to the file:
# alias ga='git add'
# alias gc='git commit -m'
# alias gp='git push'
# alias gpl='git pull'
# alias gs='git status'
# 3. Save the file.
# 4. Close the terminal.
# 5. Open the terminal.
# 6. Type the following command: source ~/.bash_profile
# 7. You can now use the aliases you created. by typing the following commands:
# ga
# gc
# gp
# gpl
# gs

# How to make aliases for git add, commit, push, pull, and status

# 1. Open your .bash_profile file in your text editor.
# 2. Add the following lines to the file:
# alias ga='git add'
# alias gc='git commit -m'
# alias gp='git push'
# alias gpl='git pull'
# alias gs='git status'
# 3. Save the file.
# 4. Close the terminal.
# 5. Open the terminal.
# 6. Type the following command: source ~/.bash_profile
# 7. You can now use the aliases you created. by typing the following commands:
# ga

If doesn't work, try this:

alias ga='git add'

If you want to make aliases for multiple commands, you can do so by separating the commands with a semicolon. For example, if you want to make an alias for git add and git commit, you can do so by adding the following line to your .bash_profile file:

alias gac='git add; git commit -m'

To assign the commit message to this alias as well, you can add the following line to your .bash_profile file:

alias gacm='git add; git commit -m' 
alias gacm='git add; git commit -m "$@"' # This line allows you to add a commit message when you use the alias. For example, if you want to add the commit message "Added a new file", you can do so by typing the following command: gacm "Added a new file" 


