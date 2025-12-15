# Estrategia de Publicación y Promoción del MCP

## Estado Actual

- [x] Paquete MCP creado en `packages/mcp/`
- [x] Nombre del paquete: `diffsheets-mcp`
- [x] Página `/mcp` creada con instrucciones de instalación
- [x] Footer actualizado con link al MCP
- [x] FAQ actualizado con pregunta sobre CLI
- [x] Traducciones en inglés y español

## Pasos Pendientes

### 1. Publicar en npm

```bash
cd packages/mcp
npm login   # si no estás autenticado
npm publish
```

Esto lo publicará como `diffsheets-mcp` en npm. Los usuarios podrán instalarlo con:
```bash
npx diffsheets-mcp
```

### 2. Registrar en el MCP Registry oficial

Anthropic tiene un registro de MCPs en: https://github.com/modelcontextprotocol/servers

Haz un PR para añadir DiffSheets al listado oficial de servidores MCP.

### 3. Configuración para usuarios

**Claude Code / Claude Desktop:**
```json
{
  "mcpServers": {
    "diffsheets": {
      "command": "npx",
      "args": ["diffsheets-mcp"]
    }
  }
}
```

### 4. Structured Data (JSON-LD) - Opcional

Añadir en la página del MCP para SEO:
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "DiffSheets MCP",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Windows, macOS, Linux",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

## Links

- npm: https://www.npmjs.com/package/diffsheets-mcp
- GitHub: https://github.com/LyricalString/diffsheets/tree/main/packages/mcp
- Página MCP: https://www.diffsheets.com/mcp
