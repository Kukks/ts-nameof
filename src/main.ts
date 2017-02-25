import * as ts from "typescript";

// TODOS
// 1. Ensure nameof function is same one from library.
// 2. Throw build errors when someone uses nameof improperly (better than failing silently and someone not catching the issue)
// 3. Implement nameof<T>(propertyAccessFunc)
// 4. Implement nameof.full

const nameofFunctionName = "nameof";

const nameofTransformerFactory: ts.TransformerFactory<ts.SourceFile> = context => {
    return file => visitNodeAndChildren(file, context) as ts.SourceFile;
};

function visitNodeAndChildren(node: ts.Node, context: ts.TransformationContext): ts.Node {
    if (node == null)
        return node;

    node = visitNode(node);
    const visitor: ts.Visitor = childNode => visitNodeAndChildren(childNode, context);
    return ts.visitEachChild(node, visitor, context);
}

function visitNode(node: ts.Node) {
    if (!isNameofCallExpression(node))
        return node;

    const nameofString = getNameofStringFromArgument(node.arguments[0]);
    if (nameofString == null)
        return node;

    return ts.createLiteral(nameofString);
}

function isNameofCallExpression(node: ts.Node): node is ts.CallExpression {
    const callExpression = node as ts.CallExpression;
    return callExpression.kind === ts.SyntaxKind.CallExpression &&
        callExpression.expression != null &&
        callExpression.expression.getText() === nameofFunctionName &&
        callExpression.arguments != null &&
        callExpression.arguments.length === 1;
}

function getNameofStringFromArgument(arg: ts.Expression) {
    if (isPropertyAccessExpression(arg))
        return arg.name.getText();

    return arg.getText();
}

function isPropertyAccessExpression(arg: ts.Expression): arg is ts.PropertyAccessExpression {
    const propAccessExpr = arg as ts.PropertyAccessExpression;
    return propAccessExpr.kind === ts.SyntaxKind.PropertyAccessExpression && propAccessExpr.name != null;
}

export default nameofTransformerFactory;
