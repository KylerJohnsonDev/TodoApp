# TodoApp (Taskify)

This project demonstrates using a code-gen tool called Orval to generate TypeScript types. 

For a full explanation, including what makes Orval unique, see the [Orval - Generate more from your Open API Doc](http://kylerjohnsondev/blog/code-gen-with-orval).

### Project details

The backend is a .NET 9 project that uses Entity Framework Core for code-first DB migrations and interacting with the SQLite database. Disclaimer: This is __NOT__  a production-ready backend - The auth implementation specifically has not been evaluated for security.

The frontend is an Angular project because that is the framework for which I needed a PoC. Orval doesn't just generate types, but also the Angular HTTP services based on the Open API document. 

Main caveat: these types of code-gen tools are only as good as your Open API document. 

### Project Setup

_Note: you need the .NET SDK installed along with the .NET 9 runtime. You also need node version 20.19.0 or higher installed._ 

1. Clone this repo
```bash
git clone https://github.com/KylerJohnsonDev/TodoApp.git
```

2. Create SQLite DB file - From project root, run the following:

For Mac, Linux, or Git Bash shells:
```bash
touch backend/TodoApi/todoapp.db
```

Powershell (Windows):
```powershell
New-Item -Path .\backend\TodoApi\todoapp.db -ItemType File
```

3. Install .NET project dependencies - cd into the `backend/TodoApi` directory and run:

For Mac, Linux, or Git Bash shells:
```bash
dotnet restore
```

Powershell (Windows):
```powershell
dotnet restore
```

4. Install Angular dependencies - cd into the `frontend/angular-ui` directory and run:
```bash
npm install
```

### Run locally

Backend - From the the `backend/TodoApi` directory, run:
```bash
dotnet run
```

frontend- from the `frontend/angular-ui`, run:
```bash
npx @angular/cli serve 
```

![Screenshot of Taskify UI](https://github.com/kylerjohnsondev/TodoApp/blob/main/todo_app_orval.png?raw=true)
