# iQtek Golf — MCP

MCP (Model Context Protocol) interno para operar el torneo desde Claude (Desktop/Code/API). **Uso restringido a personal autorizado.**

## Instalación en Claude Desktop

1. Editar `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) y agregar dentro de `mcpServers`:

```json
{
  "mcpServers": {
    "iqtek-golf": {
      "command": "npx",
      "args": ["-y", "github:ronald3012/mcp-golf-platform"],
      "env": {
        "API_BASE_URL": "<solicitar al administrador>",
        "STAFF_JWT": "<solicitar al administrador>",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

> Si el `command` falla, usá el path absoluto a `npx` (`which npx` te lo da).

2. Cerrar Claude Desktop con Cmd+Q y reabrir.

Primera ejecución tarda unos segundos (descarga e instala). Después arranca instantáneo.

## Requisitos del operador

- Node 20 o superior instalado (incluye `npx`).
- `API_BASE_URL` y `STAFF_JWT` provistos por el administrador del torneo, **por canal privado**. Estos valores no se publican y son específicos por operador.

## Variables de entorno

| Var | Requerido | Default |
|---|---|---|
| `API_BASE_URL` | ✓ | — |
| `STAFF_JWT` | ✓ | — |
| `LOG_LEVEL` | — | `info` |
| `API_TIMEOUT_MS` | — | `15000` |

Las credenciales tienen vencimiento. Cuando expiren, el administrador entrega un reemplazo.

## Soporte

Reportar problemas al administrador del torneo. No abrir issues públicos en este repo con datos de configuración, JWTs ni URLs.

## Licencia

Software interno — no distribuir.
