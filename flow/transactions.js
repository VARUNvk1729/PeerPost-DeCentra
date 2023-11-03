import * as fcl from "@onflow/fcl";

const CREATE_POST = `
import PeerPost from 0xPeerPost
import FungibleToken from 0xFungibleToken

transaction (_title: String, _description: String, _image: String, _price: UFix64, _readingTime: UInt64) {
  prepare(acct: AuthAccount) {
    if acct.borrow<&PeerPost.PostCollection>(from: PeerPost.PostCollectionStoragePath) == nil {
      let vaultRef = acct.getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
      acct.save<@PeerPost.PostCollection>(<-PeerPost.createEmptyPostCollection(address: acct.address, receiver: vaultRef), to: PeerPost.PostCollectionStoragePath)
      acct.link<&{PeerPost.PostCollectionPublic}>(PeerPost.PostCollectionPublicPath, target: PeerPost.PostCollectionStoragePath)
    }
    let collection = acct.borrow<&PeerPost.PostCollection>(from: PeerPost.PostCollectionStoragePath)
    collection?.savePost(post: <-PeerPost.createPost(_title: _title, _description: _description, _author: acct.address, _image: _image, _price: _price, _readingTime: _readingTime, _metadata: {}))
  }
}`;

export async function createPost(title, description, image, price, readingTime) {
  return fcl.mutate({
    cadence: CREATE_POST,
    args: (arg, t) => [arg(title, t.String), arg(description, t.String), arg(image, t.String), arg(price, t.UFix64), arg(readingTime, t.UInt64)],
  });
}

const DELETE_POST = `
import PeerPost from 0xPeerPost
transaction (_postID: UInt64) {
  prepare(acct: AuthAccount) {
    let collection = acct.borrow<&PeerPost.PostCollection>(from: PeerPost.PostCollectionStoragePath) ?? panic("Failed to borrow PostCollection")
    let post <- collection.deletePost(postID: _postID)
    destroy post
  }
}`;

export async function deletePost(postID) {
  return fcl.mutate({
    cadence: DELETE_POST,
    args: (arg, t) => [arg(postID, t.UInt64)],
  });
}

const PURCHASE_POST = `
import PeerPost from 0xPeerPost
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken
transaction(author: Address, postID: UInt64, price: UFix64) {
  prepare(acct: AuthAccount) {
    if acct.borrow<&PeerPost.Collection>(from: PeerPost.CollectionStoragePath) == nil {
      acct.save<@NonFungibleToken.Collection>(<-PeerPost.createEmptyCollection(), to: PeerPost.CollectionStoragePath)
      acct.link<&{PeerPost.CollectionPublic}>(PeerPost.CollectionPublicPath, target: PeerPost.CollectionStoragePath)
    }
    let authorAcc = getAccount(author)
    let capability = authorAcc.getCapability<&{PeerPost.PostCollectionPublic}>(PeerPost.PostCollectionPublicPath)
    let publicRef = capability.borrow() ?? panic("Could not borrow reference to the owner's CollectionPublic")
    let recepCap = acct.getCapability<&{PeerPost.CollectionPublic}>(PeerPost.CollectionPublicPath)
    let vaultRef = acct.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault)
    let temporaryVault: @FungibleToken.Vault <- vaultRef!.withdraw(amount: price)
    publicRef.purchasePost(postID: postID, recipient: recepCap, buyTokens: <- temporaryVault)
  }
}`;

export async function purchasePost(author, postID, price) {
  return fcl.mutate({
    cadence: PURCHASE_POST,
    args: (arg, t) => [arg(author, t.Address), arg(postID, t.UInt64), arg(price, t.UFix64)],
  });
}