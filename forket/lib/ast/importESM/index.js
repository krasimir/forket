/* This file is auto-generated by Forket. Don't change it manually. */

export default function (what, where) {
  return [
  {
    "type": "ImportDeclaration",
    "span": {
      "start": 1618,
      "end": 1644
    },
    "specifiers": [
      {
        "type": "ImportDefaultSpecifier",
        "span": {
          "start": 1625,
          "end": 1630
        },
        "local": {
          "type": "Identifier",
          "span": {
            "start": 1625,
            "end": 1630
          },
          "ctxt": 2,
          "value": what,
          "optional": false
        }
      }
    ],
    "source": {
      "type": "StringLiteral",
      "span": {
        "start": 1636,
        "end": 1643
      },
      "value": where,
      "raw": "\"" + where + "\""
    },
    "typeOnly": false,
    "with": null,
    "phase": "evaluation"
  }
]
}