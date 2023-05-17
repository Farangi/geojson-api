module.exports = {
	roots: ['./src'],
	preset: 'ts-jest',
	testEnvironment: 'node',
	transform: {
		'^.+\\.ts?$': 'ts-jest'
	},
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
	moduleFileExtensions: ['ts', 'js', 'json', 'node'],
	collectCoverage: true,
	clearMocks: true,
}