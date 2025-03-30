# Tasks

## Upcoming sprints

- [x] SPRINT 01: application and users setup
- [ ] SPRINT 02: tickets
- [ ] SPRINT 03: comments
- [ ] SPRINT 04: departments
- [ ] SPRINT 05: images
- [ ] SPRINT 06: tags
- [ ] SPRINT 07: logs

### sprint 01: users API

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
