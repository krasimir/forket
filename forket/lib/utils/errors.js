class ResolverError extends Error {
  constructor(message) {
    super(message || "Resolver error occurred");
    this.name = "ResolverError";
  }
}
class ResolverModuleNotFoundError extends Error {
  constructor(message) {
    super(message || 'Module not found');
    this.name = "ResolverModuleNotFoundError";
  }
}
class ResolverIsInNodeModulesError extends Error {
  constructor(message) {
    super(message || "Module is found in node_modules");
    this.name = "ResolverIsInNodeModulesError";
  }
}

module.exports = {
  ResolverError,
  ResolverModuleNotFoundError,
  ResolverIsInNodeModulesError
};
