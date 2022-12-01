/*
Language: ZIG
Author: KekOnTheWorld <kekontheworld@gmail.com>
Description: The ZIG language provides high performance and runtime safety.
Website: https://ziglang.org
Category: common, enterprise
*/

import { NUMERIC as NUMBER } from "./lib/java.js";

/** @type LanguageFn */
export default function(hljs) {
    //const regex = hljs.regex;
    
    const LITERALS = [
        "null",
        "undefined",
        "true",
        "false",
    ];

    const TYPES = [
        // Integer
        "f16",
        "f32",
        "f64",
        "f80",
        "f128",
        "usize",
        "isize",
        "comptime_int",
        "comptime_float",

        // Type
        "bool",
        "void",
        "noreturn",
        "type",
        "error",
        "anyerror",
        "anyframe",
        "anytype",
        "anyopaque",
        
        // C
        "c_short",
        "c_ushort",
        "c_int",
        "c_uint",
        "c_long",
        "c_ulong",
        "c_longlong",
        "c_longdouble"
    ];

    const MAIN_KEYWORDS = [
        "const",
        "let",
        "fn",
        // Repeat
        "inline",
        "while",
        "for",
        // Storage
        "extern",
        "packed",
        "export",
        "pub",
        "noalias",
        "comptime",
        "volatile",
        "align",
        "linksection",
        "threadlocal",
        "allowzero",
        "noinline",
        "callconv",
        // Structure
        "struct",
        "enum",
        "union",
        "opaque",
        // Statement
        "asm",
        "unreachable",
        // Flow
        "break",
        "return",
        "continue",
        "defer",
        "errdefer",
        // Async
        "await",
        "resume",
        "suspend",
        "async",
        "nosuspend",
        // Try Catch
        "try",
        "catch",
        // Conditional
        "if",
        "else",
        "switch",
        "orelse",
        // Default
        "usingnamespace",
        "test",
        "and",
        "or",
    ];

    const KEYWORDS = {
        keyword: MAIN_KEYWORDS,
        literal: LITERALS,
        type: TYPES,
    };

    const ZIG_IDENT_RE = "[_a-zA-Z][_a-zA-Z0-9]*";
    const GENERIC_IDENT_RE = ZIG_IDENT_RE;

    const INT_TYPE = {
        match: /(u|i)\d+/,
        className: "type",
    };

    const MULTILINE_STRING = {
        begin: /\\\\/,
        end: /\n/,
        className: "string"
    };

    const COMMENT = {
        begin: /\/\//,
        end: /\n/,
        className: "comment"
    };

    return {
        name: 'ZIG',
        keywords: KEYWORDS,
        aliases: [ 'zig', ],
        contains: [
            {
                match: "@" + GENERIC_IDENT_RE,
                className: "built_in",
            },
            {
                begin: [
                  '(?:' + GENERIC_IDENT_RE + '\\s+)',
                  hljs.UNDERSCORE_IDENT_RE,
                  /\s*(?=\()/
                ],
                className: { 2: "title.function" },
                keywords: KEYWORDS,
                contains: [
                  {
                    className: 'params',
                    begin: /\(/,
                    end: /\)/,
                    keywords: KEYWORDS,
                    relevance: 0,
                    contains: [
                      hljs.APOS_STRING_MODE,
                      hljs.QUOTE_STRING_MODE,
                      hljs.C_BLOCK_COMMENT_MODE,
                      INT_TYPE,
                    ]
                  },
                  hljs.C_LINE_COMMENT_MODE,
                  hljs.C_BLOCK_COMMENT_MODE
                ]
            },
            {
                // Expression keywords prevent 'keyword Name(...)' from being
                // recognized as a function definition
                beginKeywords: 'struct union enum error',
                relevance: 0
            },
            {
                begin: [
                    GENERIC_IDENT_RE,
                    /\s*(?=\{)/
                ],
                className: { 1: "title.class" },
                keywords: KEYWORDS,
                contains: [
                  hljs.C_LINE_COMMENT_MODE,
                  hljs.C_BLOCK_COMMENT_MODE,
                  INT_TYPE
                ]
            },
            {
                beginKeywords: "struct",
                relevance: 0
            },
            {
                match: [
                    GENERIC_IDENT_RE,
                    /\s*:\s*/,
                    GENERIC_IDENT_RE
                ],
                className: { 3: "type" }
            },
            hljs.QUOTE_STRING_MODE,
            MULTILINE_STRING,
            NUMBER,
            COMMENT,
            INT_TYPE,
        ],
    };
  }
  