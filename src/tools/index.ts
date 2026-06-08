import { pairPlayersTool } from "./pairPlayers.js";
import { unpairPlayerTool } from "./unpairPlayer.js";
import { revertPairAuditTool } from "./revertPairAudit.js";
import { listUnpairedPlayersTool } from "./listUnpairedPlayers.js";
import { listPairsTool } from "./listPairs.js";
import { listPairAuditTool } from "./listPairAudit.js";
import { listFoursomesTool } from "./listFoursomes.js";
import { getFoursomeTool } from "./getFoursome.js";
import { createFoursomeTool } from "./createFoursome.js";
import { deleteFoursomeTool } from "./deleteFoursome.js";
import { getBestBallLeaderboardTool } from "./getBestBallLeaderboard.js";
import { getParejaLeaderboardTool } from "./getParejaLeaderboard.js";
import { getPlayerResultsTool } from "./getPlayerResults.js";
import { getFoursomeScoringTool } from "./getFoursomeScoring.js";
import { getRoundProgressTool } from "./getRoundProgress.js";

export const allTools = [
  pairPlayersTool,
  unpairPlayerTool,
  revertPairAuditTool,
  listUnpairedPlayersTool,
  listPairsTool,
  listPairAuditTool,
  listFoursomesTool,
  getFoursomeTool,
  createFoursomeTool,
  deleteFoursomeTool,
  getBestBallLeaderboardTool,
  getParejaLeaderboardTool,
  getPlayerResultsTool,
  getFoursomeScoringTool,
  getRoundProgressTool,
];
