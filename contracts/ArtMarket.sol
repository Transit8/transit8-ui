pragma solidity ^0.4.24;

  contract ArtMarket {
  address public owner;

  struct Item {
    string title;
    string blockstackUrl;
    bytes32 hash;   //can also be used as a pointer to the item in IPFS storage
    uint ownerIndex;
    mapping (uint => address) owners;
    uint price;
  }
  mapping (uint => Item) public items;
  int public itemIndex = -1;

  mapping(bytes32 => bool) public itemExists;

  struct Auction {
    uint itemID;
    uint created;
    uint duration;
    uint reserve;
    uint increment;
    address curator;
    uint highestBid;
    address highestBidder;
    mapping(address => uint) bids;
    bool closed;
  }
  mapping (uint => Auction) public auctions;
  int public auctionIndex = -1;

  constructor() public {
    owner = msg.sender;
  }

  //blockstackUrl is empty if the item is stored on IPFS
  function addItem(string title, bytes32 hash, string blockstackUrl) public {
    require(!itemExists[hash]);
    itemIndex++;
    items[uint(itemIndex)].title = title;
    items[uint(itemIndex)].hash = hash;
    items[uint(itemIndex)].blockstackUrl = blockstackUrl;
    items[uint(itemIndex)].ownerIndex = 0;
    items[uint(itemIndex)].owners[0] = msg.sender;
    itemExists[hash] = true;
  }

  function buy(uint itemID) payable public {
    if(msg.value == items[itemID].price) {
     items[itemID].owners[items[itemID].ownerIndex].transfer(msg.value);
     items[itemID].ownerIndex++;
     items[itemID].owners[items[itemID].ownerIndex] = msg.sender;
    }
  }

  function startAuction(uint itemID, uint duration) public {
    require(msg.sender == items[itemID].owners[items[itemID].ownerIndex]);  //only possible to auction items you own
    auctionIndex++;
    auctions[uint(auctionIndex)].itemID = itemID;
    auctions[uint(auctionIndex)].duration = duration;
    auctions[uint(auctionIndex)].curator = msg.sender;
    auctions[uint(auctionIndex)].created = now;
  }

  function closeAuction(uint auctionID) public {
    if(now - auctions[auctionID].created > auctions[auctionID].duration) {
     items[auctions[auctionID].itemID].owners[items[auctions[auctionID].itemID].ownerIndex].transfer(auctions[auctionID].highestBid);
     items[auctions[auctionID].itemID].ownerIndex++;
     items[auctions[auctionID].itemID].owners[items[auctions[auctionID].itemID].ownerIndex]= auctions[auctionID].highestBidder;
     auctions[auctionID].closed = true;
    }
  }

  function reclaimEscrow(uint auctionID) public {
   require(auctions[auctionID].closed && auctions[auctionID].highestBidder != msg.sender);
   msg.sender.transfer(auctions[auctionID].bids[msg.sender]);
   auctions[auctionID].bids[msg.sender] = 0;
  }

  function placeBid(uint auctionID) payable public {
    require(msg.value > auctions[auctionID].highestBid);
    auctions[auctionID].highestBidder = msg.sender;
    auctions[auctionID].highestBid = msg.value;
    auctions[auctionID].bids[msg.sender] = msg.value;
  }
}
