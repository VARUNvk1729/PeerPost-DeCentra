import * as fcl from "@onflow/fcl";

const MYPOSTS = `
import PeerPost from 0xPeerPost
pub struct PostData {
	pub let id: String
	pub let title: String
	pub let description: String
	pub let author: String
	pub let image: String
	pub let price: String
	pub let metadata: {String: String}
	pub let createDate: String
	init(_id: UInt64, _title: String, _description: String, _author:Address, _image: String, _price: UFix64, _createDate: UFix64, _metadata: {String: String}) {
		self.id = _id.toString()
		self.title = _title
		self.description = _description
		self.author = _author.toString()
		self.image = _image
		self.price = _price.toString()
		self.metadata = _metadata
		self.createDate = _createDate.toString()
	}
}
pub fun main(author: Address, reader: Address): [PostData] {
	let acct = getAccount(author)
	let capability = acct.getCapability<&{PeerPost.PostCollectionPublic}>(PeerPost.PostCollectionPublicPath)
	let publicRef = capability.borrow()
	if(publicRef == nil) { return [] }
	let postIDs = publicRef!.getAllPostIDs()
	let posts: [PostData] = []
	for postID in postIDs {
		let post = publicRef!.borrowPost(postID: postID, readerAddress: reader) ?? panic("This post does not exist")
		let postData = PostData(_id: post.id, _title: post.title, _description: post.description, _author: post.author, _image: post.image, _price: post.price, _createDate: post.createDate, _metadata: post.metadata)
		posts.append(postData)
	}
	return posts
}`;

export async function getMyPosts(author) {
  return fcl.query({
    cadence: MYPOSTS,
    args: (arg, t) => [arg(author, t.Address), arg(author, t.Address)],
  });
}

const PUBLICPOSTS = `
import PeerPost from 0xPeerPost
pub struct PostData {
	pub let id: String
	pub let title: String
	pub let description: String
	pub let author: String
	pub let image: String
	pub let price: String
	pub let metadata: {String: String}
	pub let createDate: String
	init(_id: UInt64, _title: String, _description: String, _author:Address, _image: String, _price: UFix64, _createDate: UFix64, _metadata: {String: String}) {
		self.id = _id.toString()
		self.title = _title
		self.description = _description
		self.author = _author.toString()
		self.image = _image
		self.price = _price.toString()
		self.metadata = _metadata
		self.createDate = _createDate.toString()
	}
}
pub fun main(author: Address, reader: Address): [PostData] {
	let acct = getAccount(author)
	let capability = acct.getCapability<&{PeerPost.PostCollectionPublic}>(PeerPost.PostCollectionPublicPath)
	let publicRef = capability.borrow()
	if(publicRef == nil) { return [] }
	let postIDs = publicRef!.getAllPostIDs()
	let posts: [PostData] = []
	for postID in postIDs {
		let post = publicRef!.borrowPost(postID: postID, readerAddress: reader) ?? panic("This post does not exist")
		let postData = PostData(_id: post.id, _title: post.title, _description: post.description, _author: post.author, _image: post.image, _price: post.price, _createDate: post.createDate, _metadata: post.metadata)
		posts.append(postData)
	}
	return posts
}`;

export async function getPublicPosts(author) {
  return fcl.query({
    cadence: PUBLICPOSTS,
    args: (arg, t) => [arg(author, t.Address), arg(author, t.Address)],
  });
}

const PUBLICPOSTBYID = `
import PeerPost from 0xPeerPost
pub struct PostData {
	pub let id: String?
	pub let title: String?
	pub let description: String?
	pub let author: String?
	pub let image: String?
	pub let price: String?
	pub let readingTime: UInt64?
	pub let metadata: {String: String}?
	pub let createDate: String?
	init(_id: UInt64?, _title: String?, _description: String?, _author:Address?, _image: String?, _price: UFix64?, _readingTime: UInt64?, _createDate: UFix64?,_metadata: {String: String}?) {
		self.id = _id?.toString()
		self.title = _title
		self.description = _description
		self.author = _author?.toString()
		self.image = _image
		self.price = _price?.toString()
		self.readingTime = _readingTime
		self.metadata = _metadata
		self.createDate = _createDate?.toString()
	}
}
pub fun main(author: Address, postID: UInt64): PostData? {
	let acct = getAccount(author)
	let capability = acct.getCapability<&{PeerPost.PostCollectionPublic}>(PeerPost.PostCollectionPublicPath)
	let publicRef = capability.borrow()
	if(publicRef == nil) { return nil }
	let post = publicRef!.getPostData(postID: postID)
	if(post == nil) { return nil }
	let postData = PostData(_id: post?.id, _title: post?.title, _description: post?.description, _author: post?.author, _image: post?.image, _price: post?.price, _readingTime: post?.readingTime, _createDate: post?.createDate, _metadata: post?.metadata)
	return postData
}`;

export async function getPublicPostById(author, postID) {
  return fcl.query({
    cadence: PUBLICPOSTBYID,
    args: (arg, t) => [arg(author, t.Address), arg(postID, t.UInt64)],
  });
}

const PAIDPOST = `
import PeerPost from 0xPeerPost
pub struct PostData {
	pub let id: String?
	pub let title: String?
	pub let description: String?
	pub let author: String?
	pub let image: String?
	pub let price: String?
	pub let readingTime: UInt64?
	pub let metadata: {String: String}?
	pub let createDate: String?
	init(_id: UInt64?, _title: String?, _description: String?, _author:Address?, _image: String?, _price: UFix64?, _readingTime: UInt64?, _createDate: UFix64?,_metadata: {String: String}?) {
		self.id = _id?.toString()
		self.title = _title
		self.description = _description
		self.author = _author?.toString()
		self.image = _image
		self.price = _price?.toString()
		self.readingTime = _readingTime
		self.metadata = _metadata
		self.createDate = _createDate?.toString()
	}
}
pub fun main(author: Address, reader: Address, postID: UInt64): PostData? {
	let acct = getAccount(author)
	let capability = acct.getCapability<&{PeerPost.PostCollectionPublic}>(PeerPost.PostCollectionPublicPath)
	let publicRef = capability.borrow()
	if(publicRef == nil) { return nil }
	let post = publicRef!.borrowPost(postID: postID, readerAddress: reader) 
	if(post == nil) { return nil }
	let postData = PostData(_id: post?.id, _title: post?.title, _description: post?.description, _author: post?.author, _image: post?.image, _price: post?.price, _readingTime: post?.readingTime, _createDate: post?.createDate, _metadata: post?.metadata)
	return postData
}`;

export async function getPaidPostById(author, reader, postID) {
  return fcl.query({
    cadence: PAIDPOST,
    args: (arg, t) => [arg(author, t.Address), arg(reader, t.Address), arg(postID, t.UInt64)],
  });
}

const PURCHASEDCOUNT = `
import PeerPost from 0xPeerPost
pub fun main(author: Address): UInt64 {
	let acct = getAccount(author)
    let capability = acct.getCapability<&{PeerPost.PostCollectionPublic}>(PeerPost.PostCollectionPublicPath)
    let publicRef = capability.borrow()

	var counters: UInt64 = 0
	if (capability.check()) {
		for postID in publicRef!.getAllPostIDs() {
			let count = publicRef!.purchasedCount(postID: postID)
			counters = (counters + count!)
		}
	}
	return counters
}`;

export async function getPurchasedCount(author) {
  return fcl.query({
    cadence: PURCHASEDCOUNT,
    args: (arg, t) => [arg(author, t.Address)],
  });
}