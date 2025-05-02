# Ticket Syste

>**Progress** **[60%]**

You can follow the [frontend project](https://github.com/sfwnisme/ticketing-**issue**)

## 🟥⚠️ Next Session

- departments routes

## Upcoming sprints

- [x] SPRINT 01: application and users setup
- [x] SPRINT 02: tags
- [x] SPRINT 03: tickets
- [x] SPRINT 04: comments
- [x] SPRINT 05: departments
- [ ] SPRINT 06: images
- [ ] SPRINT 07: logs

### sprint 01: users

- [x] Jsend setup
- [x] bcrypt setup
- [x] httpStatusText setup
- [x] async wrapper
- [x] global error handling
- [x] update user
- [x] login
- [x] user data validation
- [x] JWT > generate tokens
- [x] JWT > verify token middleware
- [x] role-based middleware
- [ ] get all user's tickets, comments, history

### sprint 02: tags

- [x] get all tags
- [ ] get all tag's tickets using query
- [x] get single tag
- [x] create tag
- [x] update tag
- [x] delete tag

### sprint 03: tickets

- [x] get all tickets
- [x] get single ticket
- [x] create ticket
- [x] update ticket
- [x] delete ticket
- [x] delete tickets

### sprint 04: comments

- [x] get all comments
- [x] get all ticket's comments using query
- [x] get single comment
- [x] create comment
- [x] update comment
- [x] delete comment

- ### sprint 05: departments

- [x] get all departments
- [ ] get all department's tickets using query
- [x] get single department
- [x] create department
- [x] update department
- [x] delete department
- [ ] add user to department
- [ ] add ticket to department

### BACKLOG

- [ ] application error stack-trace npm

## Common errors

### error code: `node:events:498`

cause: editing the validation schema on dev mode makes the conflict of the port in use

solution: change the port number or kill its process
kill process:

```bash
netstat -ano | findstr

## example result
TCP    0.0.0.0:5000       0.0.0.0:0     LISTENING     2924
TCP    [::]:5000          [::]:0        LISTENING     2924
                                                      ^^^^
UDP    0.0.0.0:50001      *:*                         6808

## find the TCP port LISTENING number
taskkill /PID <TCP port LISTENING number> /F
```

### Converting circular structure to JSON

Sometimes you forget to add `await` before the Model request thus this issue happens, especially if the Model request have a populate

**issue**:

```js
    const populatedComment = Comment.findById(comment._id)
      .populate('ticket', '_id title')
      .populate('author', '_id name')
```

**solution**: add await before the Model

```js
    const populatedComment = await Comment.findById(comment._id)
      .populate('ticket', '_id title')
      .populate('author', '_id name')
```

```bash
Converting circular structure to JSON
    --> starting at object with constructor 'MongoClient'
    |     property 's' -> object with constructor 'Object'
    |     property 'sessionPool' -> object with constructor 'ServerSessionPool'
    --- property 'client' closes the circle
```
