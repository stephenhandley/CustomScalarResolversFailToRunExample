// Copied from https://github.com/stephenhandley/graphql-validated-types/blob/master/src/GraphQLValidatedScalar.js

const { GraphQLScalarType } = require('graphql');

class GraphQLValidatedScalar extends GraphQLScalarType {
	constructor({name, description = 'custom scalar type'}) {
		super({
			name,
			description,
			serialize: (value)=> {
				return this._serialize(value);
			},
			parseValue: (value)=> {
				return this._parseValue(value);
			},
			parseLiteral: (ast)=> {
				return this._parseLiteral(ast);
			}
		});
		console.log(`constructing scalar type: ${name}`);
		this._default = null;
		this.clearValidators();
	}

	clearValidators () {
		this.validators = [];
	}

	_serialize (value) {
		console.log('GVS serialize', value);
		return value;
	}

	_parseValue (value) {
		console.log('GVS parseValue', value);
		return this.validate(value);
	}

	_parseLiteral (ast) {
		console.log('GVS parseLiteral', value);
		return this.validate(ast.value);
	}

	shouldDefault (value) {
		return !value;
	}

	default (_default) {
		this._default = _default;
		return this;
	}

	validate (value) {
		console.log('validating');
		if (this.shouldDefault(value) && this._default) {
			value = this._default;
		}
  	return this.validators.reduce((result, validator) => {
			return validator(result);
		}, value);
	}

	validator (validator) {
		let new_validators = Array.isArray(validator) ? validator : [validator];
		this.validators = [...this.validators, ...new_validators];
		return this;
	}
}

module.exports = GraphQLValidatedScalar;
