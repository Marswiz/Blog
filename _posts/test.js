export interface RootNode extends Node {
    type: NodeTypes.ROOT
    children: TemplateChildNode[]
    helpers: symbol[]
    components: string[]
    directives: string[]
    hoists: (JSChildNode | null)[]
    imports: ImportItem[]
    cached: number
    temps: number
    ssrHelpers?: symbol[]
    codegenNode?: TemplateChildNode | JSChildNode | BlockStatement
}

