
---
title: "GIT Tutorial to copy branch"
date: "2024-01-01"
---

##  Step1 : first create a empty folder in desktop and open gitbash in the folder

fir git clone the repo

```bash
git clone https://github.com/bmentor0321/OptiPrice_Prognosticator_Infosys_Internship_Oct2024.git
```

## Step 2 : then go to to repo folder created inside that empyt folder

```bash
 cd OptiPrice_Prognosticator_Infosys_Internship_Oct2024
```

or go manually inside the folder and open gitbash there

## Step 3 : then to find out number of branches that repo has do

`git branch -a`

Now the main branch is made by vishal so we checkout vishal 
```bash
 git checkout vishal
```


## Step 4: then create out branch of any name
```bash
git checkout -b test1sanskar
```

## Step 5 : then copy vishals branch's content with our branch 

```bash
git fetch origin
```
then merge
```bash
git merge origin/vishal
```


## Step 6 : then publish our branch onto github
```bash
 git push origin test1sanskar
```



## now if we made updates in folder and want to push the new updates to the branch do

If you want to push all new and modified files in the branch to GitHub, here’s how to do it:

### Step 1: Stage All Changes
Use the `git add .` command to stage all new and modified files in your branch:

```bash
git add .
```

### Step 2: Commit All Changes
Commit all staged files with a descriptive message:

```bash
git commit -m "Add all new changes and updates"
```

### Step 3: Push the Changes to GitHub
Push all changes in your branch (`test1sanskar`) to GitHub:

```bash
git push origin test1sanskar
```

This will upload all staged changes to the `test1sanskar` branch on GitHub. Now, everything you’ve added or modified locally will be reflected on GitHub.