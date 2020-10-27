module.exports = grammar({
  name: 'lox',

  rules: {
    // https://craftinginterpreters.com/appendix-i.html
    source_file: $ => repeat($.declaration),

    // Declarations
    declaration: $ => choice($.classDecl, $.funDecl, $.varDecl, $.statement),
    classDecl:   $ => seq("class", $.identifier, optional(seq("<", $.identifier)), "{", repeat($.function), "}"),
    funDecl:     $ => seq("fun", $.function),
    varDecl:     $ => seq("var", $.identifier, optional(seq("=", $.expression)), ";"),

    // Statements
    statement:   $ => choice($.exprStmt, $.forStmt, $.ifStmt, $.printStmt, $.returnStmt, $.whileStmt, $.block),
    exprStmt:    $ => seq($.expression, ";"),
    forStmt:     $ => seq("for", "(", choice($.varDecl, $.exprStmt, ";"), optional($.expression), ";", optional($.expression), ")", $.statement),
    ifStmt:      $ => prec.left(seq("if", "(", $.expression, ")", $.statement, optional(seq("else", $.statement)))),
    printStmt:   $ => seq("print", $.expression, ";"),
    returnStmt:  $ => seq("return", optional($.expression), ";"),
    whileStmt:   $ => seq("while", "(", $.expression, ")", $.statement),
    block:       $ => seq("{", repeat($.declaration), "}"),

    // Expressions
    expression:  $ => $.assignment,
    assignment:  $ => choice(seq(optional(seq($.call, ".")), $.identifier, "=", $.assignment), $.logic_or),
    logic_or:    $ => seq($.logic_and, repeat(seq("or", $.logic_and))),
    logic_and:   $ => seq($.equality, repeat(seq("and", $.equality))),
    equality:    $ => seq($.comparison, repeat(seq(choice("!=", "=="), $.comparison))),
    comparison:  $ => seq($.term, repeat(seq(choice(">", ">=", "<", "<="), $.term))),
    term:        $ => seq($.factor, repeat(seq(choice("-", "+"), $.factor))),
    factor:      $ => seq($.unary, repeat(seq(choice("/", "*"), $.unary))),
    unary:       $ => choice(seq(choice("!", "-"), $.unary), $.call),
    call:        $ => prec.left(seq($.primary, repeat(choice(seq("(", optional($.arguments), ")"), seq(".", $.identifier))))),
    primary:     $ => choice("true", "false", "nil", "this", $.number, $.string, $.identifier, seq("(", $.expression, ")"), seq("super", ".", $.identifier)),

    // Utility
    function:    $ => seq($.identifier, "(", repeat($.parameters), ")", $.block),
    parameters:  $ => seq($.identifier, repeat(seq(",", $.identifier))),
    arguments:   $ => seq($.expression, repeat(seq(",", $.expression))),

    // Lexical
    number:      $ => /\d+(\.\d+)?/,
    string:      $ => /"[^"]*"/,
    identifier:  $ => /[a-zA-Z_]\w*/,
  }
});
