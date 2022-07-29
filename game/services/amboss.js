import { makeRequest } from "./graphql.js";

const AMBOSS_ENDPOINT = "https://api.amboss.space/graphql";

export async function getPopularNodes() {
  const result = await makeRequest(
    AMBOSS_ENDPOINT,
    `
		query Query {
			getPopularNodes
		}
	`
  );

  return result.data.getPopularNodes;
}
export async function getNodeChannels(pubkey) {
  if (!pubkey) throw new Error("missing pubkey");

  const result = await makeRequest(
    AMBOSS_ENDPOINT,
    `
		query Query($pubkey: String!) {
			getNode(pubkey: $pubkey) {
				graph_info {
					channels {
						num_channels
						channel_list {
							list {
								capacity
								node1_pub
								node2_pub
								long_channel_id
							}
						}
					}
				}
			}
		}
	`,
    { pubkey }
  );

  return result.data.getNode.graph_info.channels;
}
