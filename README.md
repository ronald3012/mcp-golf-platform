# iQtek MCP Server — Golf Platform

MCP (Model Context Protocol) productivo del torneo iQtek Golf. Permite que Claude (Desktop, Code, o API) opere el torneo en vivo: emparejar jugadores, crear/borrar foursomes, consultar leaderboards y scoring.

Es un **cliente HTTP fino** del API `iqtekgolf_api`: no toca BD, no duplica lógica, propaga el JWT del staff al API y marca cada operación con `X-Mcp-Source: 1` para auditar.

## Tools expuestos (15)

**Pairing (6)**:
- `pair_players`, `unpair_player`, `revert_pair_audit`
- `list_unpaired_players`, `list_pairs`, `list_pair_audit`

**Foursomes (4)**:
- `list_foursomes`, `get_foursome`, `create_foursome`, `delete_foursome`

**Scoring (5)**:
- `get_best_ball_leaderboard`, `get_pareja_leaderboard`
- `get_player_results`, `get_foursome_scoring`, `get_round_progress`

## Agregarlo a Claude Desktop (sin clonar el repo)

Editar `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) y agregar:

```json
{
  "mcpServers": {
    "iqtek-golf": {
      "command": "npx",
      "args": ["-y", "github:TU_USUARIO/iqtek-mcp-golf-platform"],
      "env": {
        "API_BASE_URL": "https://dev-api.iqtekgolf.innovix.com.do",
        "STAFF_JWT": "PEGAR_AQUI_EL_JWT_DEL_STAFF",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

Después: **Cmd+Q a Claude Desktop y reabrir**. Eso es todo. `npx` clona el repo en caché, instala deps y arranca el server. Primera ejecución lenta (~30s), las siguientes son instantáneas.

> Reemplazá `TU_USUARIO` por tu usuario/organización de GitHub. Si el repo es privado, el operador necesita acceso vía SSH/HTTPS configurado en su Git.

## Generar el `STAFF_JWT`

Desde la carpeta del API:

```bash
cd ../iqtekgolf_api
node -e "
require('dotenv').config();
const jwt = require('jsonwebtoken');
console.log(jwt.sign(
  { uid: 'staff-operador', name: 'Nombre del Operador' },
  process.env.SECRET_JWT_SEED2,
  { expiresIn: '7d' }
));
"
```

Copiar el output al `STAFF_JWT` del config. Dura 7 días. Si necesitás más, cambiá `expiresIn` (`"14d"`, `"30d"`).

Cada operador del torneo tiene su propio JWT con su propio `uid` — así el `pair_audit_log` queda con identidad real de quién hizo qué.

## Variables de entorno

| Var | Default | Para qué |
|---|---|---|
| `API_BASE_URL` | (requerido) | URL del API iqtekgolf en prod o dev |
| `STAFF_JWT` | (requerido) | JWT firmado con `SECRET_JWT_SEED2` del API |
| `LOG_LEVEL` | `info` | Pino log level (a stderr) |
| `API_TIMEOUT_MS` | `15000` | Timeout HTTP al API |

## Desarrollo local

Si querés correrlo desde código (sin npx):

```bash
git clone <repo>
cd iqtek-mcp-golf-platform
npm install
npm run build
npm start             # HTTP transport en puerto 4101
# o
npm run start:stdio   # stdio transport para Claude Desktop
```

Para usar la build local en Claude Desktop:

```json
{
  "mcpServers": {
    "iqtek-golf": {
      "command": "/path/absoluto/a/node",
      "args": ["/path/absoluto/a/dist/server-stdio.js"],
      "env": { "API_BASE_URL": "...", "STAFF_JWT": "..." }
    }
  }
}
```

## Tests

```bash
npm test
```

8 tests cubren `apiClient` (propagación de headers, query params, error handling, timeouts) y los tools básicos (URL building, body serialization).

## Arquitectura

```
Claude (Desktop/Code/API)
   │ MCP protocol (stdio)
   ▼
iqtek-mcp-golf-platform (este paquete, ejecutado por npx o local)
   │ HTTP (x-token + X-Mcp-Source: 1)
   ▼
iqtekgolf_api (puerto 4001 dev / dominio real prod)
   │ mysql2
   ▼
MySQL (personas, foursomes, posteos*, pair_audit_log)
```

El MCP es **stateless y sin acceso a BD**. Toda lógica de negocio vive en el API.

## Source tracking

Cada llamada del MCP al API incluye `X-Mcp-Source: 1`. Endpoints sensibles como `DELETE /api/foursome/:id` aplican confirmaciones especiales solo cuando ven ese header — operaciones del panel admin no se ven afectadas.

Para reportes de auditoría:

```sql
SELECT source, action, COUNT(*) FROM pair_audit_log GROUP BY source, action;
```

## Build details

- TypeScript estricto, target ES2022, Node16 module resolution.
- Se commitea `dist/` al repo para que `npx github:...` funcione sin necesidad de devDependencies.
- Si modificás `src/`, hacé `npm run build` antes de commitear.
