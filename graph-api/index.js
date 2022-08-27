import "dotenv/config";
import express from "express";
import logger from "morgan";
import createError from "http-errors";
import lndconnect from "lndconnect";

import {
  authenticatedLndGrpc,
  getNode,
  getChannel,
  getWalletInfo,
} from "lightning";

const { host, cert, macaroon } = lndconnect.decode(process.env.LNDCONNECT);
const { lnd } = authenticatedLndGrpc({
  cert: btoa(cert),
  macaroon,
  socket: host,
});

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function pruneNodeData(nodeData) {
  return {
    alias: nodeData.alias,
    color: nodeData.color,
    channelCount: nodeData.channel_count,
    channels: nodeData.channels
      .map(purneChannelData)
      .sort((a, b) => b.capacity - a.capacity),
  };
}
function purneChannelData(channelData) {
  return {
    id: channelData.id,
    capacity: channelData.capacity,
    nodes: channelData.policies.map((pol) => pol.public_key),
  };
}

app.get("/status", async (req, res, next) => {
  try {
    const info = await getWalletInfo({ lnd });
    res.json({
      isSynced: info.is_synced_to_chain && info.is_synced_to_graph,
      currentBlockHash: info.current_block_hash,
      currentBlockHeight: info.current_block_height,
    });
  } catch (e) {
    res.status(e[0]);
    res.end(e[1]);
  }
});
app.get("/node/:pubkey", async (req, res, next) => {
  if (!req.params.pubkey) throw new Error("no pubkey");
  try {
    const info = await getNode({ lnd, public_key: req.params.pubkey });
    res.json(pruneNodeData(info));
  } catch (e) {
    res.status(e[0]);
    res.end(e[1]);
  }
});

app.get("/channel/:shortId", async (req, res, next) => {
  if (!req.params.shortId) throw new Error("no shortId");
  try {
    const channelData = await getChannel({ lnd, id: req.params.shortId });
    res.json(purneChannelData(channelData));
  } catch (e) {
    res.status(e[0]);
    res.end(e[1]);
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
