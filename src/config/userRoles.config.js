const userRoles = {
  ADMIN: "admin",
  MANAGER: "manager",
  CSR: "csr",
  VIEW_ONLY: "view_only",
  get DEFAULT() { return this.VIEW_ONLY }
}

module.exports = { userRoles }