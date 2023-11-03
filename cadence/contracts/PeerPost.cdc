import FungibleToken from "./interfaces/FungibleToken.cdc"
import NonFungibleToken from "./interfaces/NonFungibleToken.cdc"
import MetadataViews from "./interfaces/MetadataViews.cdc"

pub contract PeerPost: NonFungibleToken {
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    pub event PeerPostUserCreated(address: Address)
    pub event PeerPostPostCreated(post: PublicPost)
    pub event PeerPostPostDeleted(post: PublicPost)
    pub event PeerPostPostUpdated(post: PublicPost)
    
    pub var totalSupply: UInt64

    pub let PostCollectionStoragePath: StoragePath
    pub let PostCollectionPublicPath: PublicPath

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath

    pub struct NftData {
        pub let id: UInt64
        pub let serial: UInt64
        pub let author: Address
        pub let postId: UInt64
        pub let postPrice: UFix64
        pub let postTitle: String
        pub let postImage: String
        pub let postCreateDate: UFix64

        init(_id: UInt64, _serial: UInt64, _author: Address, _postId: UInt64, _postPrice: UFix64, _postTitle: String, _postImage: String, _postCreateDate: UFix64) {
            self.id = _id
            self.serial = _serial
            self.author = _author
            self.postId = _postId
            self.postPrice = _postPrice
            self.postTitle = _postTitle
            self.postImage =  _postImage
            self.postCreateDate = _postCreateDate
        }
    }

    pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {
        pub let id: UInt64
        pub let serial: UInt64
        pub let author: Address
        pub let postId: UInt64
        pub let postPrice: UFix64
        pub let postTitle: String
        pub let postImage: String
        pub let postCreateDate: UFix64

        pub let dateReceived: UFix64

        pub fun getViews(): [Type] {
            let supportedViews: [Type] = []
            return supportedViews
        }

        pub fun resolveView(_ view: Type): AnyStruct? {
            return nil
        }

        init(_author: Address, _postId: UInt64, _serial: UInt64, _postPrice: UFix64, _postTitle: String, _postImage: String, _postCreateDate: UFix64) {
            self.id = self.uuid
            self.dateReceived = getCurrentBlock().timestamp
            self.postId = _postId
            self.author = _author
            self.serial = _serial
            self.postPrice = _postPrice
            self.postTitle = _postTitle
            self.postImage =  _postImage
            self.postCreateDate = _postCreateDate

            PeerPost.totalSupply = PeerPost.totalSupply + 1
        }
    }

    pub resource interface CollectionPublic {
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowPeerPost(id: UInt64): &NFT?
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun checkOwnAuthorPost(postID: UInt64, authorAddress: Address): Bool
        pub fun getIDs(): [UInt64]
    }

    pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection, CollectionPublic {
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}
        pub var ownAuthorPost: {Address: {UInt64: Bool}}

        init () {
            self.ownedNFTs <- {}
            self.ownAuthorPost = {}
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token: @NonFungibleToken.NFT <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")
            return <-token
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token: @NFT <- token as! @NFT
            let authorAdd = token.author
            let postId = token.postId
            let id: UInt64 = token.id

            let oldToken <- self.ownedNFTs[id] <- token
            
            if self.ownAuthorPost[authorAdd] != nil {
                if self.ownAuthorPost[authorAdd]![postId] == nil {
                    self.ownAuthorPost[authorAdd]!.insert(key: postId, true)
                }
            } else { 
                self.ownAuthorPost.insert(key: authorAdd, {postId: true})
            } 
            destroy oldToken
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        pub fun borrowPeerPost(id: UInt64): &PeerPost.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
                return ref as! &PeerPost.NFT
            } else {
                return nil
            }
        }

        pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
            let nft = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            let PeerPost = nft as! &PeerPost.NFT
            return PeerPost
        }

        pub fun checkOwnAuthorPost(postID: UInt64, authorAddress: Address): Bool {
            if self.ownAuthorPost[authorAddress] != nil {
                if self.ownAuthorPost[authorAddress]![postID] != nil {
                    return true
                }
            }
            return false
        }

        destroy() {
            destroy self.ownedNFTs
        }        
    }

    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    pub fun getNft(address:Address) : [NftData] {
        var allData: [NftData] = []
        let account: PublicAccount = getAccount(address)

        if let collection = account.getCapability(self.CollectionPublicPath).borrow<&{CollectionPublic}>()  {
            for id in collection.getIDs() {
                var nft = collection.borrowPeerPost(id: id)
                allData.append(NftData(_id: nft!.id, _serial: nft!.serial, _author: nft!.author, _postId: nft!.postId, _postPrice: nft!.postPrice, _postTitle: nft!.postTitle, _postImage: nft!.postImage, _postCreateDate: nft!.postCreateDate))
            }
        }
        return allData
    }
    
    pub resource Post {
        pub let id: UInt64
        pub(set) var title: String
        pub(set) var description: String
        pub(set) var author:  Address
        pub(set) var image: String
        pub(set) var price: UFix64
        pub(set) var readingTime: UInt64
        pub(set) var metadata: {String: String}
        pub var createDate: UFix64

        init(_title: String, _description: String, _author: Address, _image: String, _price: UFix64, _readingTime: UInt64, _metadata: {String: String}) {
            self.id = self.uuid
            self.title = _title
            self.description = _description
            self.author = _author
            self.image = _image
            self.price = _price
            self.readingTime = _readingTime
            self.metadata = _metadata
            self.createDate = getCurrentBlock().timestamp
        }
    }

    pub struct PublicPost {
        pub let id: UInt64?
        pub let title: String?
        pub let description: String?
        pub let author: Address?
        pub let image: String?
        pub let price: UFix64?
        pub let readingTime: UInt64?
        pub let metadata: {String: String}?
        pub let createDate: UFix64?

        init(_id: UInt64?, _title: String?, _description: String?, _author: Address?, _image: String?, _price: UFix64?, _readingTime: UInt64, _createDate: UFix64?, _metadata: {String: String}?) {
            self.id = _id
            self.title = _title
            self.description = _description
            self.author = _author
            self.image = _image
            self.price = _price
            self.readingTime = _readingTime
            self.metadata = _metadata
            self.createDate = _createDate
        }
    }

    pub fun createPost(_title: String, _description: String, _author: Address, _image: String, _price: UFix64, _readingTime: UInt64, _metadata: {String: String}): @Post {
        return <-create Post(_title: _title, _description: _description, _author: _author, _image: _image, _price: _price, _readingTime: _readingTime, _metadata: _metadata)
    }

    pub resource interface PostCollectionPublic {
        pub fun getPostData(postID: UInt64): PublicPost?
        pub fun getAllPostIDs(): [UInt64]
        pub fun borrowPost(postID: UInt64, readerAddress: Address): &Post? 
        
        pub fun purchasePost(postID: UInt64, recipient: Capability<&{CollectionPublic}>, buyTokens: @FungibleToken.Vault)

        pub fun purchasedCount(postID: UInt64): UInt64?
    }

    pub resource PostCollection: PostCollectionPublic {
        access(self) var posts: @{UInt64: Post}
        access(self) var receiverCap: Capability<&{FungibleToken.Receiver}>
        access(self) var buyers: {UInt64: {Address: Bool}}
        access (self) var postSerial: {UInt64: UInt64}

        pub fun updatePost(post: PublicPost) {
            if(post.id != nil && self.posts.containsKey(post.id!)){
                let ref: &PeerPost.Post = (&self.posts[post.id!] as &PeerPost.Post?)!
                ref.title = post.title ?? ref.title
                ref.description = post.description ?? ref.description
                ref.image = post.image ?? ref.image
                ref.price = post.price ?? ref.price
                ref.readingTime = post.readingTime ?? ref.readingTime
                ref.metadata = post.metadata ?? ref.metadata              

                emit PeerPostPostUpdated(post: post)
            }
        }

        pub fun savePost(post: @Post) {
            let evetData : PublicPost = PublicPost(_id: post.id, _title: post.title, _description: nil, _author: post.author, _image: post.image, _price: post.price, _readingTime: post.readingTime, _createDate: post.createDate, _metadata: post.metadata) 
            emit PeerPostPostCreated(post: evetData)
            self.posts[post.id] <-! post
        }
        
        pub fun deletePost(postID: UInt64): @Post {
            let post <- self.posts.remove(key: postID) ?? panic("Post not found")
            let evetData = PublicPost(_id: post.id, _title: post.title, _description: nil, _author: post.author, _image: post.image, _price: post.price, _readingTime: post.readingTime, _createDate: post.createDate, _metadata: post.metadata) 
            emit PeerPostPostDeleted(post: evetData)
            return <-post
        }
        
        init(receiver: Capability<&{FungibleToken.Receiver}>) {
            self.posts <- {}
            self.buyers = {}
            self.postSerial = {}
            self.receiverCap = receiver
        }

        destroy() {
            destroy self.posts
        }
    
        pub fun getPostData(postID: UInt64): PeerPost.PublicPost? {
            if self.posts[postID] != nil {
                let ref: &PeerPost.Post = (&self.posts[postID] as &PeerPost.Post?)!
                var description: String? = nil
                
                if ref.price == 0.0 { description = ref.description }
                let postData : PublicPost = PublicPost(_id: ref.id, _title: ref.title, _description: description, _author: ref.author, _image: ref.image, _price: ref.price, _readingTime: ref.readingTime, _createDate: ref.createDate, _metadata: ref.metadata) 
                return postData
            }
            return nil
        }

        pub fun getAllPostIDs(): [UInt64] {
            return self.posts.keys
        }
    
        pub fun borrowPost(postID: UInt64, readerAddress: Address): &PeerPost.Post? {
            if self.posts[postID] != nil {
                let ref: &PeerPost.Post = (&self.posts[postID] as &PeerPost.Post?)!
                if readerAddress == self.owner!.address { return ref }
                if ref.price == 0.0 { return ref }
                let readerCap = getAccount(readerAddress).getCapability<&{CollectionPublic}>(PeerPost.CollectionPublicPath).borrow()
                if readerCap == nil { return nil }
                if readerCap!.checkOwnAuthorPost(postID: postID, authorAddress: self.owner!.address) { return ref }
                return nil
            }
            return  nil
        }

        access(self) fun isPriceZero(postID: UInt64): Bool {
            if self.posts[postID] != nil {
                let ref: &PeerPost.Post = (&self.posts[postID] as &PeerPost.Post?)!
                return ref.price == 0.0
            }
            return false
        }

        access(self) fun priceCheck(postID: UInt64, payment: UFix64) : Bool {
            if self.posts[postID] != nil {
                let ref: &PeerPost.Post = (&self.posts[postID] as &PeerPost.Post?)!
                return ref.price == payment
            }
            return false
        }

        access(self) fun incrementSerial(postID: UInt64): UInt64 {
            if self.postSerial[postID] != nil {
                self.postSerial[postID] = self.postSerial[postID]! + 1
            } else {
                self.postSerial.insert(key: postID, 1)
            }
            return self.postSerial[postID]!
        }

        pub fun purchasePost(postID: UInt64, recipient: Capability<&{CollectionPublic}>, buyTokens: @FungibleToken.Vault) {
            pre {
                self.posts.keys.contains(postID): "This author does not own the requested post ".concat(postID.toString()).concat(" ").concat(self.posts.length.toString())
                !self.isPriceZero(postID: postID): "This post is free"
                self.priceCheck(postID: postID, payment: buyTokens.balance): "Payment vault does not contain requested price"
            }

            let ref: &PeerPost.Post = (&self.posts[postID] as &PeerPost.Post?)!
            let vaultRef = self.receiverCap.borrow() ?? panic("Could not borrow reference to owner token vault")
            vaultRef.deposit(from: <-buyTokens)
            
            let receiverReference = recipient.borrow() ?? panic("Could not borrow reference to receiver collection")
            receiverReference.deposit(token: <- create PeerPost.NFT(_author: self.owner!.address, _postId: postID, _serial: self.incrementSerial(postID: postID), _postPrice: ref.price, _postTitle: ref.title, _postImage: ref.image, _postCreateDate: ref.createDate))
        }

        pub fun purchasedCount(postID: UInt64): UInt64? {
            if self.posts[postID] != nil {
                if self.postSerial[postID] != nil {
                    return self.postSerial[postID]!
                } else { return 0 }
            }
            return nil
        }
    }   

    pub fun createEmptyPostCollection(address: Address, receiver: Capability<&{FungibleToken.Receiver}>): @PostCollection {
        emit PeerPostUserCreated(address: address)
        return <- create PostCollection(receiver: receiver)
    }

    init() {
        self.totalSupply = 0
        self.CollectionStoragePath = /storage/PeerPostNFTCollection
        self.CollectionPublicPath = /public/PeerPostNFTCollection
        self.PostCollectionStoragePath = /storage/PeerPostCollection
        self.PostCollectionPublicPath = /public/PeerPostCollection  
    }
}