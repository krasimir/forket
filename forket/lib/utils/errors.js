export class ResolverError extends Error {
  constructor(message) {
    super(message || "Resolver error occurred");
    this.name = "ResolverError";
  }
}
export class ResolverModuleNotFoundError extends Error {
  constructor(message) {
    super(message || "Module not found");
    this.name = "ResolverModuleNotFoundError";
  }
}
export class ResolverIsInNodeModulesError extends Error {
  constructor(message) {
    super(message || "Module is found in node_modules");
    this.name = "ResolverIsInNodeModulesError";
  }
}
