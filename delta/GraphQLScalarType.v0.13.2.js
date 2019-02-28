export class GraphQLScalarType {
  name: string;
  description: ?string;
  astNode: ?ScalarTypeDefinitionNode;

  _scalarConfig: GraphQLScalarTypeConfig<*, *>;

  constructor(config: GraphQLScalarTypeConfig<*, *>): void {
    this.name = config.name;
    this.description = config.description;
    this.astNode = config.astNode;
    this._scalarConfig = config;
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

  // Serializes an internal value to include in a response.
  serialize(value: mixed): mixed {
    const serializer = this._scalarConfig.serialize;
    return serializer(value);
  }

  // Parses an externally provided value to use as an input.
  parseValue(value: mixed): mixed {
    const parser = this._scalarConfig.parseValue;
    if (isInvalid(value)) {
      return undefined;
    }
    return parser ? parser(value) : value;
  }

  // Parses an externally provided literal value to use as an input.
  parseLiteral(valueNode: ValueNode, variables: ?ObjMap<mixed>): mixed {
    const parser = this._scalarConfig.parseLiteral;
    return parser
      ? parser(valueNode, variables)
      : valueFromASTUntyped(valueNode, variables);
  }

  toString(): string {
    return this.name;
  }

  toJSON: () => string;
  inspect: () => string;
}
