const { visit, isUnionType, isInterfaceType } = require("graphql");

module.exports = {
  plugin: (schema, documents, a, output) => {
    const bigIntFieldMap = {};

    // get the name of the file from the output path
    const nameRaw = output.outputFile.split("/").pop().split(".")[0];
    // put lower case on first letter
    const name = nameRaw.charAt(0).toLowerCase() + nameRaw.slice(1);

    const nameVariable = `${name}BigIntFieldMap`;

    const bigIntType = schema.getType("BigInt");

    if (!bigIntType) {
      return `export const ${nameVariable} = {};`;
    }

    documents.forEach((doc, i) => {
      visit(doc.document, {
        Field(node, _key, _parent, _path, ancestors) {
          // Start with the root query type and traverse the schema based on the field path
          let currentType = schema.getQueryType();
          // Traverse through ancestors to reach the current field's type
          for (const ancestor of ancestors) {
            if (
              ancestor.kind === "Field" &&
              currentType &&
              currentType.getFields
            ) {
              const fieldDef = currentType.getFields()[ancestor.name.value];
              if (!fieldDef) break;

              // Unwrap non-null and list types to get to the core field type
              let fieldType = fieldDef.type;
              while (fieldType.ofType) {
                fieldType = fieldType.ofType;
              }

              // Check if the fieldType is a union or interface type
              if (isUnionType(fieldType) || isInterfaceType(fieldType)) {
                // Get the possible types of the union or interface
                const possibleTypes = schema.getPossibleTypes(fieldType);
                // Find the possible type that contains the current field
                const possibleType = possibleTypes.find((type) =>
                  Object.keys(type.getFields()).includes(node.name.value)
                );
                if (possibleType) {
                  currentType = schema.getType(possibleType.name);
                } else {
                  break;
                }
              } else {
                currentType = schema.getType(fieldType.name);
              }
            }
          }

          if (currentType && currentType.getFields) {
            const fieldDef = currentType.getFields()[node.name.value];
            if (!fieldDef) {
              return;
            }

            // Unwrap to core field type
            let fieldType = fieldDef.type;
            while (fieldType.ofType) {
              fieldType = fieldType.ofType;
            }

            // Check if this field is of type BigInt
            if (fieldType.name === "BigInt") {
              let current = bigIntFieldMap;
              ancestors.forEach((ancestor) => {
                if (
                  ancestor.kind === "Field" &&
                  ancestor.name &&
                  ancestor.name.value
                ) {
                  const name = ancestor.name.value;
                  current[name] = current[name] || {};
                  current = current[name];
                }
              });
              current[node.name.value] = true;
            }
          }
        },
      });
    });

    return `
    type BigIntFieldMap = {
      [key: string]: boolean | BigIntFieldMap;
    };
    export const ${nameVariable}: BigIntFieldMap = ${JSON.stringify(bigIntFieldMap, null, 2)};`;
  },
};
