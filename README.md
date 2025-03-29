# Tasks

- [x] Jsend setup
- [x] bcrypt setup
- [x] httpStatusText setup
- [x] async wrapper
- [x] global error handling
- [x] update user
- [x] login
- [x] user data validation
- [x] JWT > generate tokens
- [ ] JWT > verify token middleware
- [ ] role-based middleware

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
