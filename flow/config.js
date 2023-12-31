import { config } from "@onflow/fcl";

config({
  "app.detail.title": "PEERPOST",
  "app.detail.icon": "https://i.ibb.co/TbcVHNh/logopp.png",
  "accessNode.api": `https://rest-${process.env.NEXT_PUBLIC_FLOW_NETWORK}.onflow.org`,
  "discovery.wallet": `https://fcl-discovery.onflow.org/${process.env.NEXT_PUBLIC_FLOW_NETWORK}/authn`,
  "0xFlowToken": "0x7e60df042a9c0868",
  "0xFungibleToken": "0x9a0766d93b6608b7",
  "0xMetadataViews": "0x631e88ae7f1d7c20",
  "0xNonFungibleToken": "0x631e88ae7f1d7c20",
  "0xPeerPost": "0xb788410a456ece32",
});