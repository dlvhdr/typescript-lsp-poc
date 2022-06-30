# typescript-lsp-poc

🗣 [monaco-editor](https://github.com/microsoft/monaco-editor) is the code editor which powers [VS Code](https://github.com/microsoft/vscode), with the features better described [here](https://code.visualstudio.com/docs/editor/editingevolved).

# Getting Started
```
fnm use
npm install
npm run build
```

# What?

LSP can be directly integrated into monaco.

Instead of monaco getting its *Typescript intellisense* from the webworker it bootstraps, it will get it over a *Web Socket* from a **Language Server**.

### What’s bad with monaco’s TS webworker?

The webworker monaco uses is a limited Typescript language client. The language client can understand only the current file, and cannot analyze the entire project. For example, this means it cannot know where an implementation of a function is, if it’s in a different file.

# Execution Plan

- Start the [Typescript language server](https://github.com/typescript-language-server/typescript-language-server) locally
- Register monaco providers (*completions provider etc.*) using something like the [monaco-languageclient](https://github.com/TypeFox/monaco-languageclient/) and [monaco-jsonrpc](https://github.com/CodinGame/monaco-jsonrpc) libraries
    - When a message arrives over the WebSocket, the message will be parsed by the relevant provider
    - E.g. the LSP sends a message saying there are 5 errors in the file → the errors provider will be triggered, adding the errors to monaco
- Deploy the grid app files on the same server and feed them into the language server

# Stretch goal

- Understand how multiple language servers can be hooked into monaco with something like [json-ws-proxy](https://github.com/wylieconlon/jsonrpc-ws-proxy)

# POC Open Questions

Hopefully by the end of the POC we will have answers to these questions:

- What’s the backend effort of this task?
- How will you sync the user’s changes to the grid app?
- Can `typescript-language-server` work against remote files?

## Resources

- [IEditorService](https://cs.github.com/microsoft/vscode/blob/05de94e4c547a8953d3c002fe034fa4589ebfa97/src/vs/workbench/services/editor/common/editorService.ts#L102)
- [Theia’s monaco-text-model-service](https://github.com/eclipse-theia/theia/blob/master/packages/monaco/src/browser/monaco-text-model-service.ts)
