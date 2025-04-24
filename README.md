# Tasks

## Upcoming sprints

- [x] SPRINT 01: application and users setup
- [x] SPRINT 02: tags
- [ ] SPRINT 03: tickets
- [ ] SPRINT 04: comments
- [ ] SPRINT 05: departments
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

### sprint 02: tags

- [x] get all tags
- [x] get single tag
- [x] create tag
- [x] update tag
- [x] delete tag

### BACKLOG

- [ ] application error stack-trace npm

## Common errors

error code: `node:events:498`

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
