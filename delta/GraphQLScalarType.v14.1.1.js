export class GraphQLScalarType {
  name: string;
  description: ?string;
  serialize: GraphQLScalarSerializer<*>;
  parseValue: GraphQLScalarValueParser<*>;
  parseLiteral: GraphQLScalarLiteralParser<*>;
  astNode: ?ScalarTypeDefinitionNode;
  extensionASTNodes: ?$ReadOnlyArray<ScalarTypeExtensionNode>;

  constructor(config: GraphQLScalarTypeConfig<*, *>): void {
    this.name = config.name;
    this.description = config.description;
    this.serialize = config.serialize;
    this.parseValue = config.parseValue || (value => value);
    this.parseLiteral = config.parseLiteral || valueFromASTUntyped;
    this.astNode = config.astNode;
    this.extensionASTNodes = config.extensionASTNodes;
    invariant(typeof config.name === 'string', 'Must provide name.');
    invariant(
      typeof config.serialize === 'function',
      `${this.name} must provide "serialize" function. If this custom Scalar ` +
        'is also used as an input type, ensure "parseValue" and "parseLiteral" ' +
        'functions are also provided.',
    );
    if (config.parseValue || config.parseLiteral) {
      invariant(
        typeof config.parseValue === 'function' &&
          typeof config.parseLiteral === 'function',
        `${this.name} must provide both "parseValue" and "parseLiteral" ` +
          'functions.',
      );
    }
  }

  toString(): string {
    return this.name;
  }
}
